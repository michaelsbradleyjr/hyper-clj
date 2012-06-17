var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.DEBUG = true;
goog.LOCALE = "en";
goog.provide = function(name) {
  if(!COMPILED) {
    if(goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while(namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      if(goog.getObjectByName(namespace)) {
        break
      }
      goog.implicitNamespaces_[namespace] = true
    }
  }
  goog.exportPath_(name)
};
goog.setTestOnly = function(opt_message) {
  if(COMPILED && !goog.DEBUG) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + opt_message ? ": " + opt_message : ".");
  }
};
if(!COMPILED) {
  goog.isProvided_ = function(name) {
    return!goog.implicitNamespaces_[name] && !!goog.getObjectByName(name)
  };
  goog.implicitNamespaces_ = {}
}
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if(!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0])
  }
  for(var part;parts.length && (part = parts.shift());) {
    if(!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object
    }else {
      if(cur[part]) {
        cur = cur[part]
      }else {
        cur = cur[part] = {}
      }
    }
  }
};
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for(var part;part = parts.shift();) {
    if(goog.isDefAndNotNull(cur[part])) {
      cur = cur[part]
    }else {
      return null
    }
  }
  return cur
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for(var x in obj) {
    global[x] = obj[x]
  }
};
goog.addDependency = function(relPath, provides, requires) {
  if(!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for(var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      if(!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {}
      }
      deps.pathToNames[path][provide] = true
    }
    for(var j = 0;require = requires[j];j++) {
      if(!(path in deps.requires)) {
        deps.requires[path] = {}
      }
      deps.requires[path][require] = true
    }
  }
};
goog.ENABLE_DEBUG_LOADER = true;
goog.require = function(name) {
  if(!COMPILED) {
    if(goog.isProvided_(name)) {
      return
    }
    if(goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if(path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return
      }
    }
    var errorMessage = "goog.require could not find: " + name;
    if(goog.global.console) {
      goog.global.console["error"](errorMessage)
    }
    throw Error(errorMessage);
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.identityFunction = function(var_args) {
  return arguments[0]
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    return ctor.instance_ || (ctor.instance_ = new ctor)
  }
};
if(!COMPILED && goog.ENABLE_DEBUG_LOADER) {
  goog.included_ = {};
  goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != "undefined" && "write" in doc
  };
  goog.findBasePath_ = function() {
    if(goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return
    }else {
      if(!goog.inHtmlDocument_()) {
        return
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("script");
    for(var i = scripts.length - 1;i >= 0;--i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if(src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return
      }
    }
  };
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if(!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true
    }
  };
  goog.writeScriptTag_ = function(src) {
    if(goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      doc.write('<script type="text/javascript" src="' + src + '"></' + "script>");
      return true
    }else {
      return false
    }
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if(path in deps.written) {
        return
      }
      if(path in deps.visited) {
        if(!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path)
        }
        return
      }
      deps.visited[path] = true;
      if(path in deps.requires) {
        for(var requireName in deps.requires[path]) {
          if(!goog.isProvided_(requireName)) {
            if(requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName])
            }else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if(!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path)
      }
    }
    for(var path in goog.included_) {
      if(!deps.written[path]) {
        visitNode(path)
      }
    }
    for(var i = 0;i < scripts.length;i++) {
      if(scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i])
      }else {
        throw Error("Undefined script input");
      }
    }
  };
  goog.getPathFromDeps_ = function(rule) {
    if(rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule]
    }else {
      return null
    }
  };
  goog.findBasePath_();
  if(!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js")
  }
}
goog.typeOf = function(value) {
  var s = typeof value;
  if(s == "object") {
    if(value) {
      if(value instanceof Array) {
        return"array"
      }else {
        if(value instanceof Object) {
          return s
        }
      }
      var className = Object.prototype.toString.call(value);
      if(className == "[object Window]") {
        return"object"
      }
      if(className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(s == "function" && typeof value.call == "undefined") {
      return"object"
    }
  }
  return s
};
goog.propertyIsEnumerableCustom_ = function(object, propName) {
  if(propName in object) {
    for(var key in object) {
      if(key == propName && Object.prototype.hasOwnProperty.call(object, propName)) {
        return true
      }
    }
  }
  return false
};
goog.propertyIsEnumerable_ = function(object, propName) {
  if(object instanceof Object) {
    return Object.prototype.propertyIsEnumerable.call(object, propName)
  }else {
    return goog.propertyIsEnumerableCustom_(object, propName)
  }
};
goog.isDef = function(val) {
  return val !== undefined
};
goog.isNull = function(val) {
  return val === null
};
goog.isDefAndNotNull = function(val) {
  return val != null
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array"
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number"
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function"
};
goog.isString = function(val) {
  return typeof val == "string"
};
goog.isBoolean = function(val) {
  return typeof val == "boolean"
};
goog.isNumber = function(val) {
  return typeof val == "number"
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function"
};
goog.isObject = function(val) {
  var type = goog.typeOf(val);
  return type == "object" || type == "array" || type == "function"
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(obj) {
  if("removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_)
  }
  try {
    delete obj[goog.UID_PROPERTY_]
  }catch(ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.cloneObject(obj[key])
    }
    return clone
  }
  return obj
};
Object.prototype.clone;
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments)
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if(!fn) {
    throw new Error;
  }
  if(arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs)
    }
  }else {
    return function() {
      return fn.apply(selfObj, arguments)
    }
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if(Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_
  }else {
    goog.bind = goog.bindJs_
  }
  return goog.bind.apply(null, arguments)
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs)
  }
};
goog.mixin = function(target, source) {
  for(var x in source) {
    target[x] = source[x]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(script) {
  if(goog.global.execScript) {
    goog.global.execScript(script, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global["_et_"] != "undefined") {
          delete goog.global["_et_"];
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(script)
      }else {
        var doc = goog.global.document;
        var scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for(var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]))
    }
    return mapped.join("-")
  };
  var rename;
  if(goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts
  }else {
    rename = function(a) {
      return a
    }
  }
  if(opt_modifier) {
    return className + "-" + rename(opt_modifier)
  }else {
    return rename(className)
  }
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if(!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING
}
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for(var key in values) {
    var value = ("" + values[key]).replace(/\$/g, "$$$$");
    str = str.replace(new RegExp("\\{\\$" + key + "\\}", "gi"), value)
  }
  return str
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo)
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if(caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1))
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for(var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if(ctor.prototype[opt_methodName] === caller) {
      foundCaller = true
    }else {
      if(foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args)
      }
    }
  }
  if(me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args)
  }else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global)
};
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0
};
goog.string.subs = function(str, var_args) {
  for(var i = 1;i < arguments.length;i++) {
    var replacement = String(arguments[i]).replace(/\$/g, "$$$$");
    str = str.replace(/\%s/, replacement)
  }
  return str
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(str) {
  return/^[\s\xa0]*$/.test(str)
};
goog.string.isEmptySafe = function(str) {
  return goog.string.isEmpty(goog.string.makeSafe(str))
};
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str)
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str)
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str)
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str)
};
goog.string.isSpace = function(ch) {
  return ch == " "
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd"
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if(test1 < test2) {
    return-1
  }else {
    if(test1 == test2) {
      return 0
    }else {
      return 1
    }
  }
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if(str1 == str2) {
    return 0
  }
  if(!str1) {
    return-1
  }
  if(!str2) {
    return 1
  }
  var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var count = Math.min(tokens1.length, tokens2.length);
  for(var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if(a != b) {
      var num1 = parseInt(a, 10);
      if(!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if(!isNaN(num2) && num1 - num2) {
          return num1 - num2
        }
      }
      return a < b ? -1 : 1
    }
  }
  if(tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length
  }
  return str1 < str2 ? -1 : 1
};
goog.string.encodeUriRegExp_ = /^[a-zA-Z0-9\-_.!~*'()]*$/;
goog.string.urlEncode = function(str) {
  str = String(str);
  if(!goog.string.encodeUriRegExp_.test(str)) {
    return encodeURIComponent(str)
  }
  return str
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if(opt_isLikelyToContainHtmlChars) {
    return str.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }else {
    if(!goog.string.allRe_.test(str)) {
      return str
    }
    if(str.indexOf("&") != -1) {
      str = str.replace(goog.string.amperRe_, "&amp;")
    }
    if(str.indexOf("<") != -1) {
      str = str.replace(goog.string.ltRe_, "&lt;")
    }
    if(str.indexOf(">") != -1) {
      str = str.replace(goog.string.gtRe_, "&gt;")
    }
    if(str.indexOf('"') != -1) {
      str = str.replace(goog.string.quotRe_, "&quot;")
    }
    return str
  }
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(str) {
  if(goog.string.contains(str, "&")) {
    if("document" in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str)
    }else {
      return goog.string.unescapePureXmlEntities_(str)
    }
  }
  return str
};
goog.string.unescapeEntitiesUsingDom_ = function(str) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var div = document.createElement("div");
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if(value) {
      return value
    }
    if(entity.charAt(0) == "#") {
      var n = Number("0" + entity.substr(1));
      if(!isNaN(n)) {
        value = String.fromCharCode(n)
      }
    }
    if(!value) {
      div.innerHTML = s + " ";
      value = div.firstChild.nodeValue.slice(0, -1)
    }
    return seen[s] = value
  })
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if(entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if(!isNaN(n)) {
            return String.fromCharCode(n)
          }
        }
        return s
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml)
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for(var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if(str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1)
    }
  }
  return str
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if(opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if(str.length > chars) {
    str = str.substring(0, chars - 3) + "..."
  }
  if(opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if(opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if(opt_trailingChars && str.length > chars) {
    if(opt_trailingChars > chars) {
      opt_trailingChars = chars
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint)
  }else {
    if(str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos)
    }
  }
  if(opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if(s.quote) {
    return s.quote()
  }else {
    var sb = ['"'];
    for(var i = 0;i < s.length;i++) {
      var ch = s.charAt(i);
      var cc = ch.charCodeAt(0);
      sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch))
    }
    sb.push('"');
    return sb.join("")
  }
};
goog.string.escapeString = function(str) {
  var sb = [];
  for(var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i))
  }
  return sb.join("")
};
goog.string.escapeChar = function(c) {
  if(c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c]
  }
  if(c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c]
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if(cc > 31 && cc < 127) {
    rv = c
  }else {
    if(cc < 256) {
      rv = "\\x";
      if(cc < 16 || cc > 256) {
        rv += "0"
      }
    }else {
      rv = "\\u";
      if(cc < 4096) {
        rv += "0"
      }
    }
    rv += cc.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[c] = rv
};
goog.string.toMap = function(s) {
  var rv = {};
  for(var i = 0;i < s.length;i++) {
    rv[s.charAt(i)] = true
  }
  return rv
};
goog.string.contains = function(s, ss) {
  return s.indexOf(ss) != -1
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if(index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength)
  }
  return resultStr
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "")
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "")
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(string, length) {
  return(new Array(length + 1)).join(string)
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if(index == -1) {
    index = s.length
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj)
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for(var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
    var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
      var v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if(v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2])
    }while(order == 0)
  }
  return order
};
goog.string.compareElements_ = function(left, right) {
  if(left < right) {
    return-1
  }else {
    if(left > right) {
      return 1
    }
  }
  return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  var result = 0;
  for(var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i);
    result %= goog.string.HASHCODE_MAX_
  }
  return result
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if(num == 0 && goog.string.isEmpty(str)) {
    return NaN
  }
  return num
};
goog.string.toCamelCaseCache_ = {};
goog.string.toCamelCase = function(str) {
  return goog.string.toCamelCaseCache_[str] || (goog.string.toCamelCaseCache_[str] = String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase()
  }))
};
goog.string.toSelectorCaseCache_ = {};
goog.string.toSelectorCase = function(str) {
  return goog.string.toSelectorCaseCache_[str] || (goog.string.toSelectorCaseCache_[str] = String(str).replace(/([A-Z])/g, "-$1").toLowerCase())
};
goog.provide("goog.userAgent.jscript");
goog.require("goog.string");
goog.userAgent.jscript.ASSUME_NO_JSCRIPT = false;
goog.userAgent.jscript.init_ = function() {
  var hasScriptEngine = "ScriptEngine" in goog.global;
  goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ = hasScriptEngine && goog.global["ScriptEngine"]() == "JScript";
  goog.userAgent.jscript.DETECTED_VERSION_ = goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_ ? goog.global["ScriptEngineMajorVersion"]() + "." + goog.global["ScriptEngineMinorVersion"]() + "." + goog.global["ScriptEngineBuildVersion"]() : "0"
};
if(!goog.userAgent.jscript.ASSUME_NO_JSCRIPT) {
  goog.userAgent.jscript.init_()
}
goog.userAgent.jscript.HAS_JSCRIPT = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? false : goog.userAgent.jscript.DETECTED_HAS_JSCRIPT_;
goog.userAgent.jscript.VERSION = goog.userAgent.jscript.ASSUME_NO_JSCRIPT ? "0" : goog.userAgent.jscript.DETECTED_VERSION_;
goog.userAgent.jscript.isVersion = function(version) {
  return goog.string.compareVersions(goog.userAgent.jscript.VERSION, version) >= 0
};
goog.provide("goog.string.StringBuffer");
goog.require("goog.userAgent.jscript");
goog.string.StringBuffer = function(opt_a1, var_args) {
  this.buffer_ = goog.userAgent.jscript.HAS_JSCRIPT ? [] : "";
  if(opt_a1 != null) {
    this.append.apply(this, arguments)
  }
};
goog.string.StringBuffer.prototype.set = function(s) {
  this.clear();
  this.append(s)
};
if(goog.userAgent.jscript.HAS_JSCRIPT) {
  goog.string.StringBuffer.prototype.bufferLength_ = 0;
  goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
    if(opt_a2 == null) {
      this.buffer_[this.bufferLength_++] = a1
    }else {
      this.buffer_.push.apply(this.buffer_, arguments);
      this.bufferLength_ = this.buffer_.length
    }
    return this
  }
}else {
  goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
    this.buffer_ += a1;
    if(opt_a2 != null) {
      for(var i = 1;i < arguments.length;i++) {
        this.buffer_ += arguments[i]
      }
    }
    return this
  }
}
goog.string.StringBuffer.prototype.clear = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    this.buffer_.length = 0;
    this.bufferLength_ = 0
  }else {
    this.buffer_ = ""
  }
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.toString().length
};
goog.string.StringBuffer.prototype.toString = function() {
  if(goog.userAgent.jscript.HAS_JSCRIPT) {
    var str = this.buffer_.join("");
    this.clear();
    if(str) {
      this.append(str)
    }
    return str
  }else {
    return this.buffer_
  }
};
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
  for(var key in obj) {
    f.call(opt_obj, obj[key], key, obj)
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for(var key in obj) {
    if(f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key]
    }
  }
  return res
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for(var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj)
  }
  return res
};
goog.object.some = function(obj, f, opt_obj) {
  for(var key in obj) {
    if(f.call(opt_obj, obj[key], key, obj)) {
      return true
    }
  }
  return false
};
goog.object.every = function(obj, f, opt_obj) {
  for(var key in obj) {
    if(!f.call(opt_obj, obj[key], key, obj)) {
      return false
    }
  }
  return true
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for(var key in obj) {
    rv++
  }
  return rv
};
goog.object.getAnyKey = function(obj) {
  for(var key in obj) {
    return key
  }
};
goog.object.getAnyValue = function(obj) {
  for(var key in obj) {
    return obj[key]
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val)
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for(var key in obj) {
    res[i++] = obj[key]
  }
  return res
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for(var key in obj) {
    res[i++] = key
  }
  return res
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for(var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if(!goog.isDef(obj)) {
      break
    }
  }
  return obj
};
goog.object.containsKey = function(obj, key) {
  return key in obj
};
goog.object.containsValue = function(obj, val) {
  for(var key in obj) {
    if(obj[key] == val) {
      return true
    }
  }
  return false
};
goog.object.findKey = function(obj, f, opt_this) {
  for(var key in obj) {
    if(f.call(opt_this, obj[key], key, obj)) {
      return key
    }
  }
  return undefined
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key]
};
goog.object.isEmpty = function(obj) {
  for(var key in obj) {
    return false
  }
  return true
};
goog.object.clear = function(obj) {
  for(var i in obj) {
    delete obj[i]
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if(rv = key in obj) {
    delete obj[key]
  }
  return rv
};
goog.object.add = function(obj, key, val) {
  if(key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val)
};
goog.object.get = function(obj, key, opt_val) {
  if(key in obj) {
    return obj[key]
  }
  return opt_val
};
goog.object.set = function(obj, key, value) {
  obj[key] = value
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value
};
goog.object.clone = function(obj) {
  var res = {};
  for(var key in obj) {
    res[key] = obj[key]
  }
  return res
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key])
    }
    return clone
  }
  return obj
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for(var key in obj) {
    transposed[obj[key]] = key
  }
  return transposed
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for(var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for(key in source) {
      target[key] = source[key]
    }
    for(var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if(Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if(argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for(var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1]
  }
  return rv
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if(argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  var rv = {};
  for(var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true
  }
  return rv
};
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  this.stack = (new Error).stack || "";
  if(opt_msg) {
    this.message = String(opt_msg)
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.string");
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if(givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs
  }else {
    if(defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs
    }
  }
  throw new goog.asserts.AssertionError("" + message, args || []);
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return condition
};
goog.asserts.fail = function(opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("instanceof check failed.", null, opt_message, Array.prototype.slice.call(arguments, 3))
  }
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.NATIVE_ARRAY_PROTOTYPES = true;
goog.array.ArrayLike;
goog.array.peek = function(array) {
  return array[array.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex)
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if(goog.isString(arr)) {
    if(!goog.isString(obj) || obj.length != 1) {
      return-1
    }
    return arr.indexOf(obj, fromIndex)
  }
  for(var i = fromIndex;i < arr.length;i++) {
    if(i in arr && arr[i] === obj) {
      return i
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex)
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if(fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex)
  }
  if(goog.isString(arr)) {
    if(!goog.isString(obj) || obj.length != 1) {
      return-1
    }
    return arr.lastIndexOf(obj, fromIndex)
  }
  for(var i = fromIndex;i >= 0;i--) {
    if(i in arr && arr[i] === obj) {
      return i
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = l - 1;i >= 0;--i) {
    if(i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      var val = arr2[i];
      if(f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val
      }
    }
  }
  return res
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr)
    }
  }
  return res
};
goog.array.reduce = function(arr, f, val, opt_obj) {
  if(arr.reduce) {
    if(opt_obj) {
      return arr.reduce(goog.bind(f, opt_obj), val)
    }else {
      return arr.reduce(f, val)
    }
  }
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  });
  return rval
};
goog.array.reduceRight = function(arr, f, val, opt_obj) {
  if(arr.reduceRight) {
    if(opt_obj) {
      return arr.reduceRight(goog.bind(f, opt_obj), val)
    }else {
      return arr.reduceRight(f, val)
    }
  }
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  });
  return rval
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true
    }
  }
  return false
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false
    }
  }
  return true
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return-1
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = l - 1;i >= 0;i--) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return-1
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0
};
goog.array.clear = function(arr) {
  if(!goog.isArray(arr)) {
    for(var i = arr.length - 1;i >= 0;i--) {
      delete arr[i]
    }
  }
  arr.length = 0
};
goog.array.insert = function(arr, obj) {
  if(!goog.array.contains(arr, obj)) {
    arr.push(obj)
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj)
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd)
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if(arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj)
  }else {
    goog.array.insertAt(arr, obj, i)
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if(rv = i >= 0) {
    goog.array.removeAt(arr, i)
  }
  return rv
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if(i >= 0) {
    goog.array.removeAt(arr, i);
    return true
  }
  return false
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.clone = function(arr) {
  if(goog.isArray(arr)) {
    return goog.array.concat(arr)
  }else {
    var rv = [];
    for(var i = 0, len = arr.length;i < len;i++) {
      rv[i] = arr[i]
    }
    return rv
  }
};
goog.array.toArray = function(object) {
  if(goog.isArray(object)) {
    return goog.array.concat(object)
  }
  return goog.array.clone(object)
};
goog.array.extend = function(arr1, var_args) {
  for(var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    var isArrayLike;
    if(goog.isArray(arr2) || (isArrayLike = goog.isArrayLike(arr2)) && arr2.hasOwnProperty("callee")) {
      arr1.push.apply(arr1, arr2)
    }else {
      if(isArrayLike) {
        var len1 = arr1.length;
        var len2 = arr2.length;
        for(var j = 0;j < len2;j++) {
          arr1[len1 + j] = arr2[j]
        }
      }else {
        arr1.push(arr2)
      }
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1))
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if(arguments.length <= 2) {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start)
  }else {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end)
  }
};
goog.array.removeDuplicates = function(arr, opt_rv) {
  var returnArray = opt_rv || arr;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while(cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
    if(!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current
    }
  }
  returnArray.length = cursorInsert
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target)
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj)
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while(left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if(isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr)
    }else {
      compareResult = compareFn(opt_target, arr[middle])
    }
    if(compareResult > 0) {
      left = middle + 1
    }else {
      right = middle;
      found = !compareResult
    }
  }
  return found ? left : ~left
};
goog.array.sort = function(arr, opt_compareFn) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.sort.call(arr, opt_compareFn || goog.array.defaultCompare)
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for(var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]}
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index
  }
  goog.array.sort(arr, stableCompareFn);
  for(var i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value
  }
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return compare(a[key], b[key])
  })
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for(var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if(compareResult > 0 || compareResult == 0 && opt_strict) {
      return false
    }
  }
  return true
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if(!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for(var i = 0;i < l;i++) {
    if(!equalsFn(arr1[i], arr2[i])) {
      return false
    }
  }
  return true
};
goog.array.compare = function(arr1, arr2, opt_equalsFn) {
  return goog.array.equals(arr1, arr2, opt_equalsFn)
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);
  for(var i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if(result != 0) {
      return result
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if(index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true
  }
  return false
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false
};
goog.array.bucket = function(array, sorter) {
  var buckets = {};
  for(var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter(value, i, array);
    if(goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value)
    }
  }
  return buckets
};
goog.array.repeat = function(value, n) {
  var array = [];
  for(var i = 0;i < n;i++) {
    array[i] = value
  }
  return array
};
goog.array.flatten = function(var_args) {
  var result = [];
  for(var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if(goog.isArray(element)) {
      result.push.apply(result, goog.array.flatten.apply(null, element))
    }else {
      result.push(element)
    }
  }
  return result
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if(array.length) {
    n %= array.length;
    if(n > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n))
    }else {
      if(n < 0) {
        goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n))
      }
    }
  }
  return array
};
goog.array.zip = function(var_args) {
  if(!arguments.length) {
    return[]
  }
  var result = [];
  for(var i = 0;true;i++) {
    var value = [];
    for(var j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if(i >= arr.length) {
        return result
      }
      value.push(arr[i])
    }
    result.push(value)
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for(var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp
  }
};
goog.provide("cljs.core");
goog.require("goog.string");
goog.require("goog.string.StringBuffer");
goog.require("goog.object");
goog.require("goog.array");
cljs.core._STAR_unchecked_if_STAR_ = false;
cljs.core._STAR_print_fn_STAR_ = function _STAR_print_fn_STAR_(_) {
  throw new Error("No *print-fn* fn set for evaluation environment");
};
void 0;
void 0;
void 0;
cljs.core.truth_ = function truth_(x) {
  return x != null && x !== false
};
void 0;
cljs.core.type_satisfies_ = function type_satisfies_(p, x) {
  if(p[goog.typeOf.call(null, x)]) {
    return true
  }else {
    if(p["_"]) {
      return true
    }else {
      if("\ufdd0'else") {
        return false
      }else {
        return null
      }
    }
  }
};
void 0;
cljs.core.is_proto_ = function is_proto_(x) {
  return x.constructor.prototype === x
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.missing_protocol = function missing_protocol(proto, obj) {
  return Error("No protocol method " + proto + " defined for type " + goog.typeOf.call(null, obj) + ": " + obj)
};
cljs.core.aclone = function aclone(array_like) {
  return Array.prototype.slice.call(array_like)
};
cljs.core.array = function array(var_args) {
  return Array.prototype.slice.call(arguments)
};
cljs.core.make_array = function() {
  var make_array = null;
  var make_array__1 = function(size) {
    return new Array(size)
  };
  var make_array__2 = function(type, size) {
    return make_array.call(null, size)
  };
  make_array = function(type, size) {
    switch(arguments.length) {
      case 1:
        return make_array__1.call(this, type);
      case 2:
        return make_array__2.call(this, type, size)
    }
    throw"Invalid arity: " + arguments.length;
  };
  make_array.cljs$lang$arity$1 = make_array__1;
  make_array.cljs$lang$arity$2 = make_array__2;
  return make_array
}();
void 0;
cljs.core.aget = function() {
  var aget = null;
  var aget__2 = function(array, i) {
    return array[i]
  };
  var aget__3 = function() {
    var G__6411__delegate = function(array, i, idxs) {
      return cljs.core.apply.call(null, aget, aget.call(null, array, i), idxs)
    };
    var G__6411 = function(array, i, var_args) {
      var idxs = null;
      if(goog.isDef(var_args)) {
        idxs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6411__delegate.call(this, array, i, idxs)
    };
    G__6411.cljs$lang$maxFixedArity = 2;
    G__6411.cljs$lang$applyTo = function(arglist__6412) {
      var array = cljs.core.first(arglist__6412);
      var i = cljs.core.first(cljs.core.next(arglist__6412));
      var idxs = cljs.core.rest(cljs.core.next(arglist__6412));
      return G__6411__delegate(array, i, idxs)
    };
    G__6411.cljs$lang$arity$variadic = G__6411__delegate;
    return G__6411
  }();
  aget = function(array, i, var_args) {
    var idxs = var_args;
    switch(arguments.length) {
      case 2:
        return aget__2.call(this, array, i);
      default:
        return aget__3.cljs$lang$arity$variadic(array, i, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  aget.cljs$lang$maxFixedArity = 2;
  aget.cljs$lang$applyTo = aget__3.cljs$lang$applyTo;
  aget.cljs$lang$arity$2 = aget__2;
  aget.cljs$lang$arity$variadic = aget__3.cljs$lang$arity$variadic;
  return aget
}();
cljs.core.aset = function aset(array, i, val) {
  return array[i] = val
};
cljs.core.alength = function alength(array) {
  return array.length
};
void 0;
cljs.core.into_array = function() {
  var into_array = null;
  var into_array__1 = function(aseq) {
    return into_array.call(null, null, aseq)
  };
  var into_array__2 = function(type, aseq) {
    return cljs.core.reduce.call(null, function(a, x) {
      a.push(x);
      return a
    }, [], aseq)
  };
  into_array = function(type, aseq) {
    switch(arguments.length) {
      case 1:
        return into_array__1.call(this, type);
      case 2:
        return into_array__2.call(this, type, aseq)
    }
    throw"Invalid arity: " + arguments.length;
  };
  into_array.cljs$lang$arity$1 = into_array__1;
  into_array.cljs$lang$arity$2 = into_array__2;
  return into_array
}();
void 0;
cljs.core.IFn = {};
cljs.core._invoke = function() {
  var _invoke = null;
  var _invoke__1 = function(this$) {
    if(function() {
      var and__132__auto____6413 = this$;
      if(and__132__auto____6413) {
        return this$.cljs$core$IFn$_invoke$arity$1
      }else {
        return and__132__auto____6413
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$1(this$)
    }else {
      return function() {
        var or__138__auto____6414 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6414) {
          return or__138__auto____6414
        }else {
          var or__138__auto____6415 = cljs.core._invoke["_"];
          if(or__138__auto____6415) {
            return or__138__auto____6415
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$)
    }
  };
  var _invoke__2 = function(this$, a) {
    if(function() {
      var and__132__auto____6416 = this$;
      if(and__132__auto____6416) {
        return this$.cljs$core$IFn$_invoke$arity$2
      }else {
        return and__132__auto____6416
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$2(this$, a)
    }else {
      return function() {
        var or__138__auto____6417 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6417) {
          return or__138__auto____6417
        }else {
          var or__138__auto____6418 = cljs.core._invoke["_"];
          if(or__138__auto____6418) {
            return or__138__auto____6418
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a)
    }
  };
  var _invoke__3 = function(this$, a, b) {
    if(function() {
      var and__132__auto____6419 = this$;
      if(and__132__auto____6419) {
        return this$.cljs$core$IFn$_invoke$arity$3
      }else {
        return and__132__auto____6419
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$3(this$, a, b)
    }else {
      return function() {
        var or__138__auto____6420 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6420) {
          return or__138__auto____6420
        }else {
          var or__138__auto____6421 = cljs.core._invoke["_"];
          if(or__138__auto____6421) {
            return or__138__auto____6421
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b)
    }
  };
  var _invoke__4 = function(this$, a, b, c) {
    if(function() {
      var and__132__auto____6422 = this$;
      if(and__132__auto____6422) {
        return this$.cljs$core$IFn$_invoke$arity$4
      }else {
        return and__132__auto____6422
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$4(this$, a, b, c)
    }else {
      return function() {
        var or__138__auto____6423 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6423) {
          return or__138__auto____6423
        }else {
          var or__138__auto____6424 = cljs.core._invoke["_"];
          if(or__138__auto____6424) {
            return or__138__auto____6424
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c)
    }
  };
  var _invoke__5 = function(this$, a, b, c, d) {
    if(function() {
      var and__132__auto____6425 = this$;
      if(and__132__auto____6425) {
        return this$.cljs$core$IFn$_invoke$arity$5
      }else {
        return and__132__auto____6425
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$5(this$, a, b, c, d)
    }else {
      return function() {
        var or__138__auto____6426 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6426) {
          return or__138__auto____6426
        }else {
          var or__138__auto____6427 = cljs.core._invoke["_"];
          if(or__138__auto____6427) {
            return or__138__auto____6427
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d)
    }
  };
  var _invoke__6 = function(this$, a, b, c, d, e) {
    if(function() {
      var and__132__auto____6428 = this$;
      if(and__132__auto____6428) {
        return this$.cljs$core$IFn$_invoke$arity$6
      }else {
        return and__132__auto____6428
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$6(this$, a, b, c, d, e)
    }else {
      return function() {
        var or__138__auto____6429 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6429) {
          return or__138__auto____6429
        }else {
          var or__138__auto____6430 = cljs.core._invoke["_"];
          if(or__138__auto____6430) {
            return or__138__auto____6430
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e)
    }
  };
  var _invoke__7 = function(this$, a, b, c, d, e, f) {
    if(function() {
      var and__132__auto____6431 = this$;
      if(and__132__auto____6431) {
        return this$.cljs$core$IFn$_invoke$arity$7
      }else {
        return and__132__auto____6431
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$7(this$, a, b, c, d, e, f)
    }else {
      return function() {
        var or__138__auto____6432 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6432) {
          return or__138__auto____6432
        }else {
          var or__138__auto____6433 = cljs.core._invoke["_"];
          if(or__138__auto____6433) {
            return or__138__auto____6433
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f)
    }
  };
  var _invoke__8 = function(this$, a, b, c, d, e, f, g) {
    if(function() {
      var and__132__auto____6434 = this$;
      if(and__132__auto____6434) {
        return this$.cljs$core$IFn$_invoke$arity$8
      }else {
        return and__132__auto____6434
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$8(this$, a, b, c, d, e, f, g)
    }else {
      return function() {
        var or__138__auto____6435 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6435) {
          return or__138__auto____6435
        }else {
          var or__138__auto____6436 = cljs.core._invoke["_"];
          if(or__138__auto____6436) {
            return or__138__auto____6436
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g)
    }
  };
  var _invoke__9 = function(this$, a, b, c, d, e, f, g, h) {
    if(function() {
      var and__132__auto____6437 = this$;
      if(and__132__auto____6437) {
        return this$.cljs$core$IFn$_invoke$arity$9
      }else {
        return and__132__auto____6437
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$9(this$, a, b, c, d, e, f, g, h)
    }else {
      return function() {
        var or__138__auto____6438 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6438) {
          return or__138__auto____6438
        }else {
          var or__138__auto____6439 = cljs.core._invoke["_"];
          if(or__138__auto____6439) {
            return or__138__auto____6439
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h)
    }
  };
  var _invoke__10 = function(this$, a, b, c, d, e, f, g, h, i) {
    if(function() {
      var and__132__auto____6440 = this$;
      if(and__132__auto____6440) {
        return this$.cljs$core$IFn$_invoke$arity$10
      }else {
        return and__132__auto____6440
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$10(this$, a, b, c, d, e, f, g, h, i)
    }else {
      return function() {
        var or__138__auto____6441 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6441) {
          return or__138__auto____6441
        }else {
          var or__138__auto____6442 = cljs.core._invoke["_"];
          if(or__138__auto____6442) {
            return or__138__auto____6442
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i)
    }
  };
  var _invoke__11 = function(this$, a, b, c, d, e, f, g, h, i, j) {
    if(function() {
      var and__132__auto____6443 = this$;
      if(and__132__auto____6443) {
        return this$.cljs$core$IFn$_invoke$arity$11
      }else {
        return and__132__auto____6443
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$11(this$, a, b, c, d, e, f, g, h, i, j)
    }else {
      return function() {
        var or__138__auto____6444 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6444) {
          return or__138__auto____6444
        }else {
          var or__138__auto____6445 = cljs.core._invoke["_"];
          if(or__138__auto____6445) {
            return or__138__auto____6445
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j)
    }
  };
  var _invoke__12 = function(this$, a, b, c, d, e, f, g, h, i, j, k) {
    if(function() {
      var and__132__auto____6446 = this$;
      if(and__132__auto____6446) {
        return this$.cljs$core$IFn$_invoke$arity$12
      }else {
        return and__132__auto____6446
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$12(this$, a, b, c, d, e, f, g, h, i, j, k)
    }else {
      return function() {
        var or__138__auto____6447 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6447) {
          return or__138__auto____6447
        }else {
          var or__138__auto____6448 = cljs.core._invoke["_"];
          if(or__138__auto____6448) {
            return or__138__auto____6448
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k)
    }
  };
  var _invoke__13 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l) {
    if(function() {
      var and__132__auto____6449 = this$;
      if(and__132__auto____6449) {
        return this$.cljs$core$IFn$_invoke$arity$13
      }else {
        return and__132__auto____6449
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$13(this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }else {
      return function() {
        var or__138__auto____6450 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6450) {
          return or__138__auto____6450
        }else {
          var or__138__auto____6451 = cljs.core._invoke["_"];
          if(or__138__auto____6451) {
            return or__138__auto____6451
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }
  };
  var _invoke__14 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    if(function() {
      var and__132__auto____6452 = this$;
      if(and__132__auto____6452) {
        return this$.cljs$core$IFn$_invoke$arity$14
      }else {
        return and__132__auto____6452
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$14(this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }else {
      return function() {
        var or__138__auto____6453 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6453) {
          return or__138__auto____6453
        }else {
          var or__138__auto____6454 = cljs.core._invoke["_"];
          if(or__138__auto____6454) {
            return or__138__auto____6454
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }
  };
  var _invoke__15 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    if(function() {
      var and__132__auto____6455 = this$;
      if(and__132__auto____6455) {
        return this$.cljs$core$IFn$_invoke$arity$15
      }else {
        return and__132__auto____6455
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$15(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }else {
      return function() {
        var or__138__auto____6456 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6456) {
          return or__138__auto____6456
        }else {
          var or__138__auto____6457 = cljs.core._invoke["_"];
          if(or__138__auto____6457) {
            return or__138__auto____6457
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }
  };
  var _invoke__16 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    if(function() {
      var and__132__auto____6458 = this$;
      if(and__132__auto____6458) {
        return this$.cljs$core$IFn$_invoke$arity$16
      }else {
        return and__132__auto____6458
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$16(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }else {
      return function() {
        var or__138__auto____6459 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6459) {
          return or__138__auto____6459
        }else {
          var or__138__auto____6460 = cljs.core._invoke["_"];
          if(or__138__auto____6460) {
            return or__138__auto____6460
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }
  };
  var _invoke__17 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    if(function() {
      var and__132__auto____6461 = this$;
      if(and__132__auto____6461) {
        return this$.cljs$core$IFn$_invoke$arity$17
      }else {
        return and__132__auto____6461
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$17(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }else {
      return function() {
        var or__138__auto____6462 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6462) {
          return or__138__auto____6462
        }else {
          var or__138__auto____6463 = cljs.core._invoke["_"];
          if(or__138__auto____6463) {
            return or__138__auto____6463
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }
  };
  var _invoke__18 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    if(function() {
      var and__132__auto____6464 = this$;
      if(and__132__auto____6464) {
        return this$.cljs$core$IFn$_invoke$arity$18
      }else {
        return and__132__auto____6464
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$18(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }else {
      return function() {
        var or__138__auto____6465 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6465) {
          return or__138__auto____6465
        }else {
          var or__138__auto____6466 = cljs.core._invoke["_"];
          if(or__138__auto____6466) {
            return or__138__auto____6466
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }
  };
  var _invoke__19 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s) {
    if(function() {
      var and__132__auto____6467 = this$;
      if(and__132__auto____6467) {
        return this$.cljs$core$IFn$_invoke$arity$19
      }else {
        return and__132__auto____6467
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$19(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }else {
      return function() {
        var or__138__auto____6468 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6468) {
          return or__138__auto____6468
        }else {
          var or__138__auto____6469 = cljs.core._invoke["_"];
          if(or__138__auto____6469) {
            return or__138__auto____6469
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }
  };
  var _invoke__20 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t) {
    if(function() {
      var and__132__auto____6470 = this$;
      if(and__132__auto____6470) {
        return this$.cljs$core$IFn$_invoke$arity$20
      }else {
        return and__132__auto____6470
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$20(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }else {
      return function() {
        var or__138__auto____6471 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6471) {
          return or__138__auto____6471
        }else {
          var or__138__auto____6472 = cljs.core._invoke["_"];
          if(or__138__auto____6472) {
            return or__138__auto____6472
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }
  };
  var _invoke__21 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    if(function() {
      var and__132__auto____6473 = this$;
      if(and__132__auto____6473) {
        return this$.cljs$core$IFn$_invoke$arity$21
      }else {
        return and__132__auto____6473
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$21(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }else {
      return function() {
        var or__138__auto____6474 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6474) {
          return or__138__auto____6474
        }else {
          var or__138__auto____6475 = cljs.core._invoke["_"];
          if(or__138__auto____6475) {
            return or__138__auto____6475
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }
  };
  _invoke = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    switch(arguments.length) {
      case 1:
        return _invoke__1.call(this, this$);
      case 2:
        return _invoke__2.call(this, this$, a);
      case 3:
        return _invoke__3.call(this, this$, a, b);
      case 4:
        return _invoke__4.call(this, this$, a, b, c);
      case 5:
        return _invoke__5.call(this, this$, a, b, c, d);
      case 6:
        return _invoke__6.call(this, this$, a, b, c, d, e);
      case 7:
        return _invoke__7.call(this, this$, a, b, c, d, e, f);
      case 8:
        return _invoke__8.call(this, this$, a, b, c, d, e, f, g);
      case 9:
        return _invoke__9.call(this, this$, a, b, c, d, e, f, g, h);
      case 10:
        return _invoke__10.call(this, this$, a, b, c, d, e, f, g, h, i);
      case 11:
        return _invoke__11.call(this, this$, a, b, c, d, e, f, g, h, i, j);
      case 12:
        return _invoke__12.call(this, this$, a, b, c, d, e, f, g, h, i, j, k);
      case 13:
        return _invoke__13.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l);
      case 14:
        return _invoke__14.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m);
      case 15:
        return _invoke__15.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
      case 16:
        return _invoke__16.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
      case 17:
        return _invoke__17.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
      case 18:
        return _invoke__18.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
      case 19:
        return _invoke__19.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s);
      case 20:
        return _invoke__20.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t);
      case 21:
        return _invoke__21.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _invoke.cljs$lang$arity$1 = _invoke__1;
  _invoke.cljs$lang$arity$2 = _invoke__2;
  _invoke.cljs$lang$arity$3 = _invoke__3;
  _invoke.cljs$lang$arity$4 = _invoke__4;
  _invoke.cljs$lang$arity$5 = _invoke__5;
  _invoke.cljs$lang$arity$6 = _invoke__6;
  _invoke.cljs$lang$arity$7 = _invoke__7;
  _invoke.cljs$lang$arity$8 = _invoke__8;
  _invoke.cljs$lang$arity$9 = _invoke__9;
  _invoke.cljs$lang$arity$10 = _invoke__10;
  _invoke.cljs$lang$arity$11 = _invoke__11;
  _invoke.cljs$lang$arity$12 = _invoke__12;
  _invoke.cljs$lang$arity$13 = _invoke__13;
  _invoke.cljs$lang$arity$14 = _invoke__14;
  _invoke.cljs$lang$arity$15 = _invoke__15;
  _invoke.cljs$lang$arity$16 = _invoke__16;
  _invoke.cljs$lang$arity$17 = _invoke__17;
  _invoke.cljs$lang$arity$18 = _invoke__18;
  _invoke.cljs$lang$arity$19 = _invoke__19;
  _invoke.cljs$lang$arity$20 = _invoke__20;
  _invoke.cljs$lang$arity$21 = _invoke__21;
  return _invoke
}();
void 0;
void 0;
cljs.core.ICounted = {};
cljs.core._count = function _count(coll) {
  if(function() {
    var and__132__auto____6476 = coll;
    if(and__132__auto____6476) {
      return coll.cljs$core$ICounted$_count$arity$1
    }else {
      return and__132__auto____6476
    }
  }()) {
    return coll.cljs$core$ICounted$_count$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6477 = cljs.core._count[goog.typeOf.call(null, coll)];
      if(or__138__auto____6477) {
        return or__138__auto____6477
      }else {
        var or__138__auto____6478 = cljs.core._count["_"];
        if(or__138__auto____6478) {
          return or__138__auto____6478
        }else {
          throw cljs.core.missing_protocol.call(null, "ICounted.-count", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.IEmptyableCollection = {};
cljs.core._empty = function _empty(coll) {
  if(function() {
    var and__132__auto____6479 = coll;
    if(and__132__auto____6479) {
      return coll.cljs$core$IEmptyableCollection$_empty$arity$1
    }else {
      return and__132__auto____6479
    }
  }()) {
    return coll.cljs$core$IEmptyableCollection$_empty$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6480 = cljs.core._empty[goog.typeOf.call(null, coll)];
      if(or__138__auto____6480) {
        return or__138__auto____6480
      }else {
        var or__138__auto____6481 = cljs.core._empty["_"];
        if(or__138__auto____6481) {
          return or__138__auto____6481
        }else {
          throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.ICollection = {};
cljs.core._conj = function _conj(coll, o) {
  if(function() {
    var and__132__auto____6482 = coll;
    if(and__132__auto____6482) {
      return coll.cljs$core$ICollection$_conj$arity$2
    }else {
      return and__132__auto____6482
    }
  }()) {
    return coll.cljs$core$ICollection$_conj$arity$2(coll, o)
  }else {
    return function() {
      var or__138__auto____6483 = cljs.core._conj[goog.typeOf.call(null, coll)];
      if(or__138__auto____6483) {
        return or__138__auto____6483
      }else {
        var or__138__auto____6484 = cljs.core._conj["_"];
        if(or__138__auto____6484) {
          return or__138__auto____6484
        }else {
          throw cljs.core.missing_protocol.call(null, "ICollection.-conj", coll);
        }
      }
    }().call(null, coll, o)
  }
};
void 0;
void 0;
cljs.core.IIndexed = {};
cljs.core._nth = function() {
  var _nth = null;
  var _nth__2 = function(coll, n) {
    if(function() {
      var and__132__auto____6485 = coll;
      if(and__132__auto____6485) {
        return coll.cljs$core$IIndexed$_nth$arity$2
      }else {
        return and__132__auto____6485
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth$arity$2(coll, n)
    }else {
      return function() {
        var or__138__auto____6486 = cljs.core._nth[goog.typeOf.call(null, coll)];
        if(or__138__auto____6486) {
          return or__138__auto____6486
        }else {
          var or__138__auto____6487 = cljs.core._nth["_"];
          if(or__138__auto____6487) {
            return or__138__auto____6487
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n)
    }
  };
  var _nth__3 = function(coll, n, not_found) {
    if(function() {
      var and__132__auto____6488 = coll;
      if(and__132__auto____6488) {
        return coll.cljs$core$IIndexed$_nth$arity$3
      }else {
        return and__132__auto____6488
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth$arity$3(coll, n, not_found)
    }else {
      return function() {
        var or__138__auto____6489 = cljs.core._nth[goog.typeOf.call(null, coll)];
        if(or__138__auto____6489) {
          return or__138__auto____6489
        }else {
          var or__138__auto____6490 = cljs.core._nth["_"];
          if(or__138__auto____6490) {
            return or__138__auto____6490
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n, not_found)
    }
  };
  _nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return _nth__2.call(this, coll, n);
      case 3:
        return _nth__3.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _nth.cljs$lang$arity$2 = _nth__2;
  _nth.cljs$lang$arity$3 = _nth__3;
  return _nth
}();
void 0;
void 0;
cljs.core.ASeq = {};
void 0;
void 0;
cljs.core.ISeq = {};
cljs.core._first = function _first(coll) {
  if(function() {
    var and__132__auto____6491 = coll;
    if(and__132__auto____6491) {
      return coll.cljs$core$ISeq$_first$arity$1
    }else {
      return and__132__auto____6491
    }
  }()) {
    return coll.cljs$core$ISeq$_first$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6492 = cljs.core._first[goog.typeOf.call(null, coll)];
      if(or__138__auto____6492) {
        return or__138__auto____6492
      }else {
        var or__138__auto____6493 = cljs.core._first["_"];
        if(or__138__auto____6493) {
          return or__138__auto____6493
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-first", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._rest = function _rest(coll) {
  if(function() {
    var and__132__auto____6494 = coll;
    if(and__132__auto____6494) {
      return coll.cljs$core$ISeq$_rest$arity$1
    }else {
      return and__132__auto____6494
    }
  }()) {
    return coll.cljs$core$ISeq$_rest$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6495 = cljs.core._rest[goog.typeOf.call(null, coll)];
      if(or__138__auto____6495) {
        return or__138__auto____6495
      }else {
        var or__138__auto____6496 = cljs.core._rest["_"];
        if(or__138__auto____6496) {
          return or__138__auto____6496
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-rest", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.ILookup = {};
cljs.core._lookup = function() {
  var _lookup = null;
  var _lookup__2 = function(o, k) {
    if(function() {
      var and__132__auto____6497 = o;
      if(and__132__auto____6497) {
        return o.cljs$core$ILookup$_lookup$arity$2
      }else {
        return and__132__auto____6497
      }
    }()) {
      return o.cljs$core$ILookup$_lookup$arity$2(o, k)
    }else {
      return function() {
        var or__138__auto____6498 = cljs.core._lookup[goog.typeOf.call(null, o)];
        if(or__138__auto____6498) {
          return or__138__auto____6498
        }else {
          var or__138__auto____6499 = cljs.core._lookup["_"];
          if(or__138__auto____6499) {
            return or__138__auto____6499
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k)
    }
  };
  var _lookup__3 = function(o, k, not_found) {
    if(function() {
      var and__132__auto____6500 = o;
      if(and__132__auto____6500) {
        return o.cljs$core$ILookup$_lookup$arity$3
      }else {
        return and__132__auto____6500
      }
    }()) {
      return o.cljs$core$ILookup$_lookup$arity$3(o, k, not_found)
    }else {
      return function() {
        var or__138__auto____6501 = cljs.core._lookup[goog.typeOf.call(null, o)];
        if(or__138__auto____6501) {
          return or__138__auto____6501
        }else {
          var or__138__auto____6502 = cljs.core._lookup["_"];
          if(or__138__auto____6502) {
            return or__138__auto____6502
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k, not_found)
    }
  };
  _lookup = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return _lookup__2.call(this, o, k);
      case 3:
        return _lookup__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _lookup.cljs$lang$arity$2 = _lookup__2;
  _lookup.cljs$lang$arity$3 = _lookup__3;
  return _lookup
}();
void 0;
void 0;
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = function _contains_key_QMARK_(coll, k) {
  if(function() {
    var and__132__auto____6503 = coll;
    if(and__132__auto____6503) {
      return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2
    }else {
      return and__132__auto____6503
    }
  }()) {
    return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(coll, k)
  }else {
    return function() {
      var or__138__auto____6504 = cljs.core._contains_key_QMARK_[goog.typeOf.call(null, coll)];
      if(or__138__auto____6504) {
        return or__138__auto____6504
      }else {
        var or__138__auto____6505 = cljs.core._contains_key_QMARK_["_"];
        if(or__138__auto____6505) {
          return or__138__auto____6505
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", coll);
        }
      }
    }().call(null, coll, k)
  }
};
cljs.core._assoc = function _assoc(coll, k, v) {
  if(function() {
    var and__132__auto____6506 = coll;
    if(and__132__auto____6506) {
      return coll.cljs$core$IAssociative$_assoc$arity$3
    }else {
      return and__132__auto____6506
    }
  }()) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, k, v)
  }else {
    return function() {
      var or__138__auto____6507 = cljs.core._assoc[goog.typeOf.call(null, coll)];
      if(or__138__auto____6507) {
        return or__138__auto____6507
      }else {
        var or__138__auto____6508 = cljs.core._assoc["_"];
        if(or__138__auto____6508) {
          return or__138__auto____6508
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", coll);
        }
      }
    }().call(null, coll, k, v)
  }
};
void 0;
void 0;
cljs.core.IMap = {};
cljs.core._dissoc = function _dissoc(coll, k) {
  if(function() {
    var and__132__auto____6509 = coll;
    if(and__132__auto____6509) {
      return coll.cljs$core$IMap$_dissoc$arity$2
    }else {
      return and__132__auto____6509
    }
  }()) {
    return coll.cljs$core$IMap$_dissoc$arity$2(coll, k)
  }else {
    return function() {
      var or__138__auto____6510 = cljs.core._dissoc[goog.typeOf.call(null, coll)];
      if(or__138__auto____6510) {
        return or__138__auto____6510
      }else {
        var or__138__auto____6511 = cljs.core._dissoc["_"];
        if(or__138__auto____6511) {
          return or__138__auto____6511
        }else {
          throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", coll);
        }
      }
    }().call(null, coll, k)
  }
};
void 0;
void 0;
cljs.core.IMapEntry = {};
cljs.core._key = function _key(coll) {
  if(function() {
    var and__132__auto____6512 = coll;
    if(and__132__auto____6512) {
      return coll.cljs$core$IMapEntry$_key$arity$1
    }else {
      return and__132__auto____6512
    }
  }()) {
    return coll.cljs$core$IMapEntry$_key$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6513 = cljs.core._key[goog.typeOf.call(null, coll)];
      if(or__138__auto____6513) {
        return or__138__auto____6513
      }else {
        var or__138__auto____6514 = cljs.core._key["_"];
        if(or__138__auto____6514) {
          return or__138__auto____6514
        }else {
          throw cljs.core.missing_protocol.call(null, "IMapEntry.-key", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._val = function _val(coll) {
  if(function() {
    var and__132__auto____6515 = coll;
    if(and__132__auto____6515) {
      return coll.cljs$core$IMapEntry$_val$arity$1
    }else {
      return and__132__auto____6515
    }
  }()) {
    return coll.cljs$core$IMapEntry$_val$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6516 = cljs.core._val[goog.typeOf.call(null, coll)];
      if(or__138__auto____6516) {
        return or__138__auto____6516
      }else {
        var or__138__auto____6517 = cljs.core._val["_"];
        if(or__138__auto____6517) {
          return or__138__auto____6517
        }else {
          throw cljs.core.missing_protocol.call(null, "IMapEntry.-val", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.ISet = {};
cljs.core._disjoin = function _disjoin(coll, v) {
  if(function() {
    var and__132__auto____6518 = coll;
    if(and__132__auto____6518) {
      return coll.cljs$core$ISet$_disjoin$arity$2
    }else {
      return and__132__auto____6518
    }
  }()) {
    return coll.cljs$core$ISet$_disjoin$arity$2(coll, v)
  }else {
    return function() {
      var or__138__auto____6519 = cljs.core._disjoin[goog.typeOf.call(null, coll)];
      if(or__138__auto____6519) {
        return or__138__auto____6519
      }else {
        var or__138__auto____6520 = cljs.core._disjoin["_"];
        if(or__138__auto____6520) {
          return or__138__auto____6520
        }else {
          throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", coll);
        }
      }
    }().call(null, coll, v)
  }
};
void 0;
void 0;
cljs.core.IStack = {};
cljs.core._peek = function _peek(coll) {
  if(function() {
    var and__132__auto____6521 = coll;
    if(and__132__auto____6521) {
      return coll.cljs$core$IStack$_peek$arity$1
    }else {
      return and__132__auto____6521
    }
  }()) {
    return coll.cljs$core$IStack$_peek$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6522 = cljs.core._peek[goog.typeOf.call(null, coll)];
      if(or__138__auto____6522) {
        return or__138__auto____6522
      }else {
        var or__138__auto____6523 = cljs.core._peek["_"];
        if(or__138__auto____6523) {
          return or__138__auto____6523
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-peek", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._pop = function _pop(coll) {
  if(function() {
    var and__132__auto____6524 = coll;
    if(and__132__auto____6524) {
      return coll.cljs$core$IStack$_pop$arity$1
    }else {
      return and__132__auto____6524
    }
  }()) {
    return coll.cljs$core$IStack$_pop$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6525 = cljs.core._pop[goog.typeOf.call(null, coll)];
      if(or__138__auto____6525) {
        return or__138__auto____6525
      }else {
        var or__138__auto____6526 = cljs.core._pop["_"];
        if(or__138__auto____6526) {
          return or__138__auto____6526
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-pop", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.IVector = {};
cljs.core._assoc_n = function _assoc_n(coll, n, val) {
  if(function() {
    var and__132__auto____6527 = coll;
    if(and__132__auto____6527) {
      return coll.cljs$core$IVector$_assoc_n$arity$3
    }else {
      return and__132__auto____6527
    }
  }()) {
    return coll.cljs$core$IVector$_assoc_n$arity$3(coll, n, val)
  }else {
    return function() {
      var or__138__auto____6528 = cljs.core._assoc_n[goog.typeOf.call(null, coll)];
      if(or__138__auto____6528) {
        return or__138__auto____6528
      }else {
        var or__138__auto____6529 = cljs.core._assoc_n["_"];
        if(or__138__auto____6529) {
          return or__138__auto____6529
        }else {
          throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", coll);
        }
      }
    }().call(null, coll, n, val)
  }
};
void 0;
void 0;
cljs.core.IDeref = {};
cljs.core._deref = function _deref(o) {
  if(function() {
    var and__132__auto____6530 = o;
    if(and__132__auto____6530) {
      return o.cljs$core$IDeref$_deref$arity$1
    }else {
      return and__132__auto____6530
    }
  }()) {
    return o.cljs$core$IDeref$_deref$arity$1(o)
  }else {
    return function() {
      var or__138__auto____6531 = cljs.core._deref[goog.typeOf.call(null, o)];
      if(or__138__auto____6531) {
        return or__138__auto____6531
      }else {
        var or__138__auto____6532 = cljs.core._deref["_"];
        if(or__138__auto____6532) {
          return or__138__auto____6532
        }else {
          throw cljs.core.missing_protocol.call(null, "IDeref.-deref", o);
        }
      }
    }().call(null, o)
  }
};
void 0;
void 0;
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = function _deref_with_timeout(o, msec, timeout_val) {
  if(function() {
    var and__132__auto____6533 = o;
    if(and__132__auto____6533) {
      return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3
    }else {
      return and__132__auto____6533
    }
  }()) {
    return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(o, msec, timeout_val)
  }else {
    return function() {
      var or__138__auto____6534 = cljs.core._deref_with_timeout[goog.typeOf.call(null, o)];
      if(or__138__auto____6534) {
        return or__138__auto____6534
      }else {
        var or__138__auto____6535 = cljs.core._deref_with_timeout["_"];
        if(or__138__auto____6535) {
          return or__138__auto____6535
        }else {
          throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", o);
        }
      }
    }().call(null, o, msec, timeout_val)
  }
};
void 0;
void 0;
cljs.core.IMeta = {};
cljs.core._meta = function _meta(o) {
  if(function() {
    var and__132__auto____6536 = o;
    if(and__132__auto____6536) {
      return o.cljs$core$IMeta$_meta$arity$1
    }else {
      return and__132__auto____6536
    }
  }()) {
    return o.cljs$core$IMeta$_meta$arity$1(o)
  }else {
    return function() {
      var or__138__auto____6537 = cljs.core._meta[goog.typeOf.call(null, o)];
      if(or__138__auto____6537) {
        return or__138__auto____6537
      }else {
        var or__138__auto____6538 = cljs.core._meta["_"];
        if(or__138__auto____6538) {
          return or__138__auto____6538
        }else {
          throw cljs.core.missing_protocol.call(null, "IMeta.-meta", o);
        }
      }
    }().call(null, o)
  }
};
void 0;
void 0;
cljs.core.IWithMeta = {};
cljs.core._with_meta = function _with_meta(o, meta) {
  if(function() {
    var and__132__auto____6539 = o;
    if(and__132__auto____6539) {
      return o.cljs$core$IWithMeta$_with_meta$arity$2
    }else {
      return and__132__auto____6539
    }
  }()) {
    return o.cljs$core$IWithMeta$_with_meta$arity$2(o, meta)
  }else {
    return function() {
      var or__138__auto____6540 = cljs.core._with_meta[goog.typeOf.call(null, o)];
      if(or__138__auto____6540) {
        return or__138__auto____6540
      }else {
        var or__138__auto____6541 = cljs.core._with_meta["_"];
        if(or__138__auto____6541) {
          return or__138__auto____6541
        }else {
          throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", o);
        }
      }
    }().call(null, o, meta)
  }
};
void 0;
void 0;
cljs.core.IReduce = {};
cljs.core._reduce = function() {
  var _reduce = null;
  var _reduce__2 = function(coll, f) {
    if(function() {
      var and__132__auto____6542 = coll;
      if(and__132__auto____6542) {
        return coll.cljs$core$IReduce$_reduce$arity$2
      }else {
        return and__132__auto____6542
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce$arity$2(coll, f)
    }else {
      return function() {
        var or__138__auto____6543 = cljs.core._reduce[goog.typeOf.call(null, coll)];
        if(or__138__auto____6543) {
          return or__138__auto____6543
        }else {
          var or__138__auto____6544 = cljs.core._reduce["_"];
          if(or__138__auto____6544) {
            return or__138__auto____6544
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f)
    }
  };
  var _reduce__3 = function(coll, f, start) {
    if(function() {
      var and__132__auto____6545 = coll;
      if(and__132__auto____6545) {
        return coll.cljs$core$IReduce$_reduce$arity$3
      }else {
        return and__132__auto____6545
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce$arity$3(coll, f, start)
    }else {
      return function() {
        var or__138__auto____6546 = cljs.core._reduce[goog.typeOf.call(null, coll)];
        if(or__138__auto____6546) {
          return or__138__auto____6546
        }else {
          var or__138__auto____6547 = cljs.core._reduce["_"];
          if(or__138__auto____6547) {
            return or__138__auto____6547
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f, start)
    }
  };
  _reduce = function(coll, f, start) {
    switch(arguments.length) {
      case 2:
        return _reduce__2.call(this, coll, f);
      case 3:
        return _reduce__3.call(this, coll, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  _reduce.cljs$lang$arity$2 = _reduce__2;
  _reduce.cljs$lang$arity$3 = _reduce__3;
  return _reduce
}();
void 0;
void 0;
cljs.core.IKVReduce = {};
cljs.core._kv_reduce = function _kv_reduce(coll, f, init) {
  if(function() {
    var and__132__auto____6548 = coll;
    if(and__132__auto____6548) {
      return coll.cljs$core$IKVReduce$_kv_reduce$arity$3
    }else {
      return and__132__auto____6548
    }
  }()) {
    return coll.cljs$core$IKVReduce$_kv_reduce$arity$3(coll, f, init)
  }else {
    return function() {
      var or__138__auto____6549 = cljs.core._kv_reduce[goog.typeOf.call(null, coll)];
      if(or__138__auto____6549) {
        return or__138__auto____6549
      }else {
        var or__138__auto____6550 = cljs.core._kv_reduce["_"];
        if(or__138__auto____6550) {
          return or__138__auto____6550
        }else {
          throw cljs.core.missing_protocol.call(null, "IKVReduce.-kv-reduce", coll);
        }
      }
    }().call(null, coll, f, init)
  }
};
void 0;
void 0;
cljs.core.IEquiv = {};
cljs.core._equiv = function _equiv(o, other) {
  if(function() {
    var and__132__auto____6551 = o;
    if(and__132__auto____6551) {
      return o.cljs$core$IEquiv$_equiv$arity$2
    }else {
      return and__132__auto____6551
    }
  }()) {
    return o.cljs$core$IEquiv$_equiv$arity$2(o, other)
  }else {
    return function() {
      var or__138__auto____6552 = cljs.core._equiv[goog.typeOf.call(null, o)];
      if(or__138__auto____6552) {
        return or__138__auto____6552
      }else {
        var or__138__auto____6553 = cljs.core._equiv["_"];
        if(or__138__auto____6553) {
          return or__138__auto____6553
        }else {
          throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", o);
        }
      }
    }().call(null, o, other)
  }
};
void 0;
void 0;
cljs.core.IHash = {};
cljs.core._hash = function _hash(o) {
  if(function() {
    var and__132__auto____6554 = o;
    if(and__132__auto____6554) {
      return o.cljs$core$IHash$_hash$arity$1
    }else {
      return and__132__auto____6554
    }
  }()) {
    return o.cljs$core$IHash$_hash$arity$1(o)
  }else {
    return function() {
      var or__138__auto____6555 = cljs.core._hash[goog.typeOf.call(null, o)];
      if(or__138__auto____6555) {
        return or__138__auto____6555
      }else {
        var or__138__auto____6556 = cljs.core._hash["_"];
        if(or__138__auto____6556) {
          return or__138__auto____6556
        }else {
          throw cljs.core.missing_protocol.call(null, "IHash.-hash", o);
        }
      }
    }().call(null, o)
  }
};
void 0;
void 0;
cljs.core.ISeqable = {};
cljs.core._seq = function _seq(o) {
  if(function() {
    var and__132__auto____6557 = o;
    if(and__132__auto____6557) {
      return o.cljs$core$ISeqable$_seq$arity$1
    }else {
      return and__132__auto____6557
    }
  }()) {
    return o.cljs$core$ISeqable$_seq$arity$1(o)
  }else {
    return function() {
      var or__138__auto____6558 = cljs.core._seq[goog.typeOf.call(null, o)];
      if(or__138__auto____6558) {
        return or__138__auto____6558
      }else {
        var or__138__auto____6559 = cljs.core._seq["_"];
        if(or__138__auto____6559) {
          return or__138__auto____6559
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", o);
        }
      }
    }().call(null, o)
  }
};
void 0;
void 0;
cljs.core.ISequential = {};
void 0;
void 0;
cljs.core.IList = {};
void 0;
void 0;
cljs.core.IRecord = {};
void 0;
void 0;
cljs.core.IReversible = {};
cljs.core._rseq = function _rseq(coll) {
  if(function() {
    var and__132__auto____6560 = coll;
    if(and__132__auto____6560) {
      return coll.cljs$core$IReversible$_rseq$arity$1
    }else {
      return and__132__auto____6560
    }
  }()) {
    return coll.cljs$core$IReversible$_rseq$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6561 = cljs.core._rseq[goog.typeOf.call(null, coll)];
      if(or__138__auto____6561) {
        return or__138__auto____6561
      }else {
        var or__138__auto____6562 = cljs.core._rseq["_"];
        if(or__138__auto____6562) {
          return or__138__auto____6562
        }else {
          throw cljs.core.missing_protocol.call(null, "IReversible.-rseq", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.ISorted = {};
cljs.core._sorted_seq = function _sorted_seq(coll, ascending_QMARK_) {
  if(function() {
    var and__132__auto____6563 = coll;
    if(and__132__auto____6563) {
      return coll.cljs$core$ISorted$_sorted_seq$arity$2
    }else {
      return and__132__auto____6563
    }
  }()) {
    return coll.cljs$core$ISorted$_sorted_seq$arity$2(coll, ascending_QMARK_)
  }else {
    return function() {
      var or__138__auto____6564 = cljs.core._sorted_seq[goog.typeOf.call(null, coll)];
      if(or__138__auto____6564) {
        return or__138__auto____6564
      }else {
        var or__138__auto____6565 = cljs.core._sorted_seq["_"];
        if(or__138__auto____6565) {
          return or__138__auto____6565
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq", coll);
        }
      }
    }().call(null, coll, ascending_QMARK_)
  }
};
cljs.core._sorted_seq_from = function _sorted_seq_from(coll, k, ascending_QMARK_) {
  if(function() {
    var and__132__auto____6566 = coll;
    if(and__132__auto____6566) {
      return coll.cljs$core$ISorted$_sorted_seq_from$arity$3
    }else {
      return and__132__auto____6566
    }
  }()) {
    return coll.cljs$core$ISorted$_sorted_seq_from$arity$3(coll, k, ascending_QMARK_)
  }else {
    return function() {
      var or__138__auto____6567 = cljs.core._sorted_seq_from[goog.typeOf.call(null, coll)];
      if(or__138__auto____6567) {
        return or__138__auto____6567
      }else {
        var or__138__auto____6568 = cljs.core._sorted_seq_from["_"];
        if(or__138__auto____6568) {
          return or__138__auto____6568
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq-from", coll);
        }
      }
    }().call(null, coll, k, ascending_QMARK_)
  }
};
cljs.core._entry_key = function _entry_key(coll, entry) {
  if(function() {
    var and__132__auto____6569 = coll;
    if(and__132__auto____6569) {
      return coll.cljs$core$ISorted$_entry_key$arity$2
    }else {
      return and__132__auto____6569
    }
  }()) {
    return coll.cljs$core$ISorted$_entry_key$arity$2(coll, entry)
  }else {
    return function() {
      var or__138__auto____6570 = cljs.core._entry_key[goog.typeOf.call(null, coll)];
      if(or__138__auto____6570) {
        return or__138__auto____6570
      }else {
        var or__138__auto____6571 = cljs.core._entry_key["_"];
        if(or__138__auto____6571) {
          return or__138__auto____6571
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-entry-key", coll);
        }
      }
    }().call(null, coll, entry)
  }
};
cljs.core._comparator = function _comparator(coll) {
  if(function() {
    var and__132__auto____6572 = coll;
    if(and__132__auto____6572) {
      return coll.cljs$core$ISorted$_comparator$arity$1
    }else {
      return and__132__auto____6572
    }
  }()) {
    return coll.cljs$core$ISorted$_comparator$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6573 = cljs.core._comparator[goog.typeOf.call(null, coll)];
      if(or__138__auto____6573) {
        return or__138__auto____6573
      }else {
        var or__138__auto____6574 = cljs.core._comparator["_"];
        if(or__138__auto____6574) {
          return or__138__auto____6574
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-comparator", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.IPrintable = {};
cljs.core._pr_seq = function _pr_seq(o, opts) {
  if(function() {
    var and__132__auto____6575 = o;
    if(and__132__auto____6575) {
      return o.cljs$core$IPrintable$_pr_seq$arity$2
    }else {
      return and__132__auto____6575
    }
  }()) {
    return o.cljs$core$IPrintable$_pr_seq$arity$2(o, opts)
  }else {
    return function() {
      var or__138__auto____6576 = cljs.core._pr_seq[goog.typeOf.call(null, o)];
      if(or__138__auto____6576) {
        return or__138__auto____6576
      }else {
        var or__138__auto____6577 = cljs.core._pr_seq["_"];
        if(or__138__auto____6577) {
          return or__138__auto____6577
        }else {
          throw cljs.core.missing_protocol.call(null, "IPrintable.-pr-seq", o);
        }
      }
    }().call(null, o, opts)
  }
};
void 0;
void 0;
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = function _realized_QMARK_(d) {
  if(function() {
    var and__132__auto____6578 = d;
    if(and__132__auto____6578) {
      return d.cljs$core$IPending$_realized_QMARK_$arity$1
    }else {
      return and__132__auto____6578
    }
  }()) {
    return d.cljs$core$IPending$_realized_QMARK_$arity$1(d)
  }else {
    return function() {
      var or__138__auto____6579 = cljs.core._realized_QMARK_[goog.typeOf.call(null, d)];
      if(or__138__auto____6579) {
        return or__138__auto____6579
      }else {
        var or__138__auto____6580 = cljs.core._realized_QMARK_["_"];
        if(or__138__auto____6580) {
          return or__138__auto____6580
        }else {
          throw cljs.core.missing_protocol.call(null, "IPending.-realized?", d);
        }
      }
    }().call(null, d)
  }
};
void 0;
void 0;
cljs.core.IWatchable = {};
cljs.core._notify_watches = function _notify_watches(this$, oldval, newval) {
  if(function() {
    var and__132__auto____6581 = this$;
    if(and__132__auto____6581) {
      return this$.cljs$core$IWatchable$_notify_watches$arity$3
    }else {
      return and__132__auto____6581
    }
  }()) {
    return this$.cljs$core$IWatchable$_notify_watches$arity$3(this$, oldval, newval)
  }else {
    return function() {
      var or__138__auto____6582 = cljs.core._notify_watches[goog.typeOf.call(null, this$)];
      if(or__138__auto____6582) {
        return or__138__auto____6582
      }else {
        var or__138__auto____6583 = cljs.core._notify_watches["_"];
        if(or__138__auto____6583) {
          return or__138__auto____6583
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", this$);
        }
      }
    }().call(null, this$, oldval, newval)
  }
};
cljs.core._add_watch = function _add_watch(this$, key, f) {
  if(function() {
    var and__132__auto____6584 = this$;
    if(and__132__auto____6584) {
      return this$.cljs$core$IWatchable$_add_watch$arity$3
    }else {
      return and__132__auto____6584
    }
  }()) {
    return this$.cljs$core$IWatchable$_add_watch$arity$3(this$, key, f)
  }else {
    return function() {
      var or__138__auto____6585 = cljs.core._add_watch[goog.typeOf.call(null, this$)];
      if(or__138__auto____6585) {
        return or__138__auto____6585
      }else {
        var or__138__auto____6586 = cljs.core._add_watch["_"];
        if(or__138__auto____6586) {
          return or__138__auto____6586
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", this$);
        }
      }
    }().call(null, this$, key, f)
  }
};
cljs.core._remove_watch = function _remove_watch(this$, key) {
  if(function() {
    var and__132__auto____6587 = this$;
    if(and__132__auto____6587) {
      return this$.cljs$core$IWatchable$_remove_watch$arity$2
    }else {
      return and__132__auto____6587
    }
  }()) {
    return this$.cljs$core$IWatchable$_remove_watch$arity$2(this$, key)
  }else {
    return function() {
      var or__138__auto____6588 = cljs.core._remove_watch[goog.typeOf.call(null, this$)];
      if(or__138__auto____6588) {
        return or__138__auto____6588
      }else {
        var or__138__auto____6589 = cljs.core._remove_watch["_"];
        if(or__138__auto____6589) {
          return or__138__auto____6589
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", this$);
        }
      }
    }().call(null, this$, key)
  }
};
void 0;
void 0;
cljs.core.IEditableCollection = {};
cljs.core._as_transient = function _as_transient(coll) {
  if(function() {
    var and__132__auto____6590 = coll;
    if(and__132__auto____6590) {
      return coll.cljs$core$IEditableCollection$_as_transient$arity$1
    }else {
      return and__132__auto____6590
    }
  }()) {
    return coll.cljs$core$IEditableCollection$_as_transient$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6591 = cljs.core._as_transient[goog.typeOf.call(null, coll)];
      if(or__138__auto____6591) {
        return or__138__auto____6591
      }else {
        var or__138__auto____6592 = cljs.core._as_transient["_"];
        if(or__138__auto____6592) {
          return or__138__auto____6592
        }else {
          throw cljs.core.missing_protocol.call(null, "IEditableCollection.-as-transient", coll);
        }
      }
    }().call(null, coll)
  }
};
void 0;
void 0;
cljs.core.ITransientCollection = {};
cljs.core._conj_BANG_ = function _conj_BANG_(tcoll, val) {
  if(function() {
    var and__132__auto____6593 = tcoll;
    if(and__132__auto____6593) {
      return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2
    }else {
      return and__132__auto____6593
    }
  }()) {
    return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2(tcoll, val)
  }else {
    return function() {
      var or__138__auto____6594 = cljs.core._conj_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6594) {
        return or__138__auto____6594
      }else {
        var or__138__auto____6595 = cljs.core._conj_BANG_["_"];
        if(or__138__auto____6595) {
          return or__138__auto____6595
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientCollection.-conj!", tcoll);
        }
      }
    }().call(null, tcoll, val)
  }
};
cljs.core._persistent_BANG_ = function _persistent_BANG_(tcoll) {
  if(function() {
    var and__132__auto____6596 = tcoll;
    if(and__132__auto____6596) {
      return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1
    }else {
      return and__132__auto____6596
    }
  }()) {
    return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(tcoll)
  }else {
    return function() {
      var or__138__auto____6597 = cljs.core._persistent_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6597) {
        return or__138__auto____6597
      }else {
        var or__138__auto____6598 = cljs.core._persistent_BANG_["_"];
        if(or__138__auto____6598) {
          return or__138__auto____6598
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientCollection.-persistent!", tcoll);
        }
      }
    }().call(null, tcoll)
  }
};
void 0;
void 0;
cljs.core.ITransientAssociative = {};
cljs.core._assoc_BANG_ = function _assoc_BANG_(tcoll, key, val) {
  if(function() {
    var and__132__auto____6599 = tcoll;
    if(and__132__auto____6599) {
      return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3
    }else {
      return and__132__auto____6599
    }
  }()) {
    return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(tcoll, key, val)
  }else {
    return function() {
      var or__138__auto____6600 = cljs.core._assoc_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6600) {
        return or__138__auto____6600
      }else {
        var or__138__auto____6601 = cljs.core._assoc_BANG_["_"];
        if(or__138__auto____6601) {
          return or__138__auto____6601
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientAssociative.-assoc!", tcoll);
        }
      }
    }().call(null, tcoll, key, val)
  }
};
void 0;
void 0;
cljs.core.ITransientMap = {};
cljs.core._dissoc_BANG_ = function _dissoc_BANG_(tcoll, key) {
  if(function() {
    var and__132__auto____6602 = tcoll;
    if(and__132__auto____6602) {
      return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2
    }else {
      return and__132__auto____6602
    }
  }()) {
    return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(tcoll, key)
  }else {
    return function() {
      var or__138__auto____6603 = cljs.core._dissoc_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6603) {
        return or__138__auto____6603
      }else {
        var or__138__auto____6604 = cljs.core._dissoc_BANG_["_"];
        if(or__138__auto____6604) {
          return or__138__auto____6604
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientMap.-dissoc!", tcoll);
        }
      }
    }().call(null, tcoll, key)
  }
};
void 0;
void 0;
cljs.core.ITransientVector = {};
cljs.core._assoc_n_BANG_ = function _assoc_n_BANG_(tcoll, n, val) {
  if(function() {
    var and__132__auto____6605 = tcoll;
    if(and__132__auto____6605) {
      return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3
    }else {
      return and__132__auto____6605
    }
  }()) {
    return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(tcoll, n, val)
  }else {
    return function() {
      var or__138__auto____6606 = cljs.core._assoc_n_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6606) {
        return or__138__auto____6606
      }else {
        var or__138__auto____6607 = cljs.core._assoc_n_BANG_["_"];
        if(or__138__auto____6607) {
          return or__138__auto____6607
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientVector.-assoc-n!", tcoll);
        }
      }
    }().call(null, tcoll, n, val)
  }
};
cljs.core._pop_BANG_ = function _pop_BANG_(tcoll) {
  if(function() {
    var and__132__auto____6608 = tcoll;
    if(and__132__auto____6608) {
      return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1
    }else {
      return and__132__auto____6608
    }
  }()) {
    return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1(tcoll)
  }else {
    return function() {
      var or__138__auto____6609 = cljs.core._pop_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6609) {
        return or__138__auto____6609
      }else {
        var or__138__auto____6610 = cljs.core._pop_BANG_["_"];
        if(or__138__auto____6610) {
          return or__138__auto____6610
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientVector.-pop!", tcoll);
        }
      }
    }().call(null, tcoll)
  }
};
void 0;
void 0;
cljs.core.ITransientSet = {};
cljs.core._disjoin_BANG_ = function _disjoin_BANG_(tcoll, v) {
  if(function() {
    var and__132__auto____6611 = tcoll;
    if(and__132__auto____6611) {
      return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2
    }else {
      return and__132__auto____6611
    }
  }()) {
    return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(tcoll, v)
  }else {
    return function() {
      var or__138__auto____6612 = cljs.core._disjoin_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6612) {
        return or__138__auto____6612
      }else {
        var or__138__auto____6613 = cljs.core._disjoin_BANG_["_"];
        if(or__138__auto____6613) {
          return or__138__auto____6613
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientSet.-disjoin!", tcoll);
        }
      }
    }().call(null, tcoll, v)
  }
};
void 0;
cljs.core.identical_QMARK_ = function identical_QMARK_(x, y) {
  return x === y
};
void 0;
void 0;
cljs.core._EQ_ = function() {
  var _EQ_ = null;
  var _EQ___1 = function(x) {
    return true
  };
  var _EQ___2 = function(x, y) {
    var or__138__auto____6614 = x === y;
    if(or__138__auto____6614) {
      return or__138__auto____6614
    }else {
      return cljs.core._equiv.call(null, x, y)
    }
  };
  var _EQ___3 = function() {
    var G__6615__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ_.call(null, x, y))) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__6616 = y;
            var G__6617 = cljs.core.first.call(null, more);
            var G__6618 = cljs.core.next.call(null, more);
            x = G__6616;
            y = G__6617;
            more = G__6618;
            continue
          }else {
            return _EQ_.call(null, y, cljs.core.first.call(null, more))
          }
        }else {
          return false
        }
        break
      }
    };
    var G__6615 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6615__delegate.call(this, x, y, more)
    };
    G__6615.cljs$lang$maxFixedArity = 2;
    G__6615.cljs$lang$applyTo = function(arglist__6619) {
      var x = cljs.core.first(arglist__6619);
      var y = cljs.core.first(cljs.core.next(arglist__6619));
      var more = cljs.core.rest(cljs.core.next(arglist__6619));
      return G__6615__delegate(x, y, more)
    };
    G__6615.cljs$lang$arity$variadic = G__6615__delegate;
    return G__6615
  }();
  _EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _EQ___1.call(this, x);
      case 2:
        return _EQ___2.call(this, x, y);
      default:
        return _EQ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _EQ_.cljs$lang$maxFixedArity = 2;
  _EQ_.cljs$lang$applyTo = _EQ___3.cljs$lang$applyTo;
  _EQ_.cljs$lang$arity$1 = _EQ___1;
  _EQ_.cljs$lang$arity$2 = _EQ___2;
  _EQ_.cljs$lang$arity$variadic = _EQ___3.cljs$lang$arity$variadic;
  return _EQ_
}();
cljs.core.nil_QMARK_ = function nil_QMARK_(x) {
  return x == null
};
cljs.core.type = function type(x) {
  if(function() {
    var or__138__auto____6620 = x == null;
    if(or__138__auto____6620) {
      return or__138__auto____6620
    }else {
      return void 0 === x
    }
  }()) {
    return null
  }else {
    return x.constructor
  }
};
void 0;
void 0;
void 0;
cljs.core.IHash["null"] = true;
cljs.core._hash["null"] = function(o) {
  return 0
};
cljs.core.ILookup["null"] = true;
cljs.core._lookup["null"] = function() {
  var G__6621 = null;
  var G__6621__2 = function(o, k) {
    return null
  };
  var G__6621__3 = function(o, k, not_found) {
    return not_found
  };
  G__6621 = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6621__2.call(this, o, k);
      case 3:
        return G__6621__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6621
}();
cljs.core.IAssociative["null"] = true;
cljs.core._assoc["null"] = function(_, k, v) {
  return cljs.core.hash_map.call(null, k, v)
};
cljs.core.ICollection["null"] = true;
cljs.core._conj["null"] = function(_, o) {
  return cljs.core.list.call(null, o)
};
cljs.core.IReduce["null"] = true;
cljs.core._reduce["null"] = function() {
  var G__6622 = null;
  var G__6622__2 = function(_, f) {
    return f.call(null)
  };
  var G__6622__3 = function(_, f, start) {
    return start
  };
  G__6622 = function(_, f, start) {
    switch(arguments.length) {
      case 2:
        return G__6622__2.call(this, _, f);
      case 3:
        return G__6622__3.call(this, _, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6622
}();
cljs.core.IPrintable["null"] = true;
cljs.core._pr_seq["null"] = function(o) {
  return cljs.core.list.call(null, "nil")
};
cljs.core.ISet["null"] = true;
cljs.core._disjoin["null"] = function(_, v) {
  return null
};
cljs.core.ICounted["null"] = true;
cljs.core._count["null"] = function(_) {
  return 0
};
cljs.core.IStack["null"] = true;
cljs.core._peek["null"] = function(_) {
  return null
};
cljs.core._pop["null"] = function(_) {
  return null
};
cljs.core.ISeq["null"] = true;
cljs.core._first["null"] = function(_) {
  return null
};
cljs.core._rest["null"] = function(_) {
  return cljs.core.list.call(null)
};
cljs.core.IEquiv["null"] = true;
cljs.core._equiv["null"] = function(_, o) {
  return o == null
};
cljs.core.IWithMeta["null"] = true;
cljs.core._with_meta["null"] = function(_, meta) {
  return null
};
cljs.core.IMeta["null"] = true;
cljs.core._meta["null"] = function(_) {
  return null
};
cljs.core.IIndexed["null"] = true;
cljs.core._nth["null"] = function() {
  var G__6623 = null;
  var G__6623__2 = function(_, n) {
    return null
  };
  var G__6623__3 = function(_, n, not_found) {
    return not_found
  };
  G__6623 = function(_, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6623__2.call(this, _, n);
      case 3:
        return G__6623__3.call(this, _, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6623
}();
cljs.core.IEmptyableCollection["null"] = true;
cljs.core._empty["null"] = function(_) {
  return null
};
cljs.core.IMap["null"] = true;
cljs.core._dissoc["null"] = function(_, k) {
  return null
};
Date.prototype.cljs$core$IEquiv$ = true;
Date.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  return o.toString() === other.toString()
};
cljs.core.IHash["number"] = true;
cljs.core._hash["number"] = function(o) {
  return o
};
cljs.core.IEquiv["number"] = true;
cljs.core._equiv["number"] = function(x, o) {
  return x === o
};
cljs.core.IHash["boolean"] = true;
cljs.core._hash["boolean"] = function(o) {
  return o === true ? 1 : 0
};
cljs.core.IHash["function"] = true;
cljs.core._hash["function"] = function(o) {
  return goog.getUid.call(null, o)
};
cljs.core.inc = function inc(x) {
  return x + 1
};
void 0;
void 0;
cljs.core.ci_reduce = function() {
  var ci_reduce = null;
  var ci_reduce__2 = function(cicoll, f) {
    if(cljs.core._count.call(null, cicoll) === 0) {
      return f.call(null)
    }else {
      var val__6624 = cljs.core._nth.call(null, cicoll, 0);
      var n__6625 = 1;
      while(true) {
        if(n__6625 < cljs.core._count.call(null, cicoll)) {
          var nval__6626 = f.call(null, val__6624, cljs.core._nth.call(null, cicoll, n__6625));
          if(cljs.core.reduced_QMARK_.call(null, nval__6626)) {
            return cljs.core.deref.call(null, nval__6626)
          }else {
            var G__6633 = nval__6626;
            var G__6634 = n__6625 + 1;
            val__6624 = G__6633;
            n__6625 = G__6634;
            continue
          }
        }else {
          return val__6624
        }
        break
      }
    }
  };
  var ci_reduce__3 = function(cicoll, f, val) {
    var val__6627 = val;
    var n__6628 = 0;
    while(true) {
      if(n__6628 < cljs.core._count.call(null, cicoll)) {
        var nval__6629 = f.call(null, val__6627, cljs.core._nth.call(null, cicoll, n__6628));
        if(cljs.core.reduced_QMARK_.call(null, nval__6629)) {
          return cljs.core.deref.call(null, nval__6629)
        }else {
          var G__6635 = nval__6629;
          var G__6636 = n__6628 + 1;
          val__6627 = G__6635;
          n__6628 = G__6636;
          continue
        }
      }else {
        return val__6627
      }
      break
    }
  };
  var ci_reduce__4 = function(cicoll, f, val, idx) {
    var val__6630 = val;
    var n__6631 = idx;
    while(true) {
      if(n__6631 < cljs.core._count.call(null, cicoll)) {
        var nval__6632 = f.call(null, val__6630, cljs.core._nth.call(null, cicoll, n__6631));
        if(cljs.core.reduced_QMARK_.call(null, nval__6632)) {
          return cljs.core.deref.call(null, nval__6632)
        }else {
          var G__6637 = nval__6632;
          var G__6638 = n__6631 + 1;
          val__6630 = G__6637;
          n__6631 = G__6638;
          continue
        }
      }else {
        return val__6630
      }
      break
    }
  };
  ci_reduce = function(cicoll, f, val, idx) {
    switch(arguments.length) {
      case 2:
        return ci_reduce__2.call(this, cicoll, f);
      case 3:
        return ci_reduce__3.call(this, cicoll, f, val);
      case 4:
        return ci_reduce__4.call(this, cicoll, f, val, idx)
    }
    throw"Invalid arity: " + arguments.length;
  };
  ci_reduce.cljs$lang$arity$2 = ci_reduce__2;
  ci_reduce.cljs$lang$arity$3 = ci_reduce__3;
  ci_reduce.cljs$lang$arity$4 = ci_reduce__4;
  return ci_reduce
}();
void 0;
void 0;
void 0;
void 0;
cljs.core.IndexedSeq = function(a, i) {
  this.a = a;
  this.i = i;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 15990906
};
cljs.core.IndexedSeq.cljs$lang$type = true;
cljs.core.IndexedSeq.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.IndexedSeq")
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__6639 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__6640 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$ASeq$ = true;
cljs.core.IndexedSeq.prototype.toString = function() {
  var this__6641 = this;
  var this$__6642 = this;
  return cljs.core.pr_str.call(null, this$__6642)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var this__6643 = this;
  if(cljs.core.counted_QMARK_.call(null, this__6643.a)) {
    return cljs.core.ci_reduce.call(null, this__6643.a, f, this__6643.a[this__6643.i], this__6643.i + 1)
  }else {
    return cljs.core.ci_reduce.call(null, coll, f, this__6643.a[this__6643.i], 0)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var this__6644 = this;
  if(cljs.core.counted_QMARK_.call(null, this__6644.a)) {
    return cljs.core.ci_reduce.call(null, this__6644.a, f, start, this__6644.i)
  }else {
    return cljs.core.ci_reduce.call(null, coll, f, start, 0)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__6645 = this;
  return this$
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var this__6646 = this;
  return this__6646.a.length - this__6646.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(_) {
  var this__6647 = this;
  return this__6647.a[this__6647.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(_) {
  var this__6648 = this;
  if(this__6648.i + 1 < this__6648.a.length) {
    return new cljs.core.IndexedSeq(this__6648.a, this__6648.i + 1)
  }else {
    return cljs.core.list.call(null)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__6649 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__6650 = this;
  var i__6651 = n + this__6650.i;
  if(i__6651 < this__6650.a.length) {
    return this__6650.a[i__6651]
  }else {
    return null
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__6652 = this;
  var i__6653 = n + this__6652.i;
  if(i__6653 < this__6652.a.length) {
    return this__6652.a[i__6653]
  }else {
    return not_found
  }
};
cljs.core.IndexedSeq;
cljs.core.prim_seq = function() {
  var prim_seq = null;
  var prim_seq__1 = function(prim) {
    return prim_seq.call(null, prim, 0)
  };
  var prim_seq__2 = function(prim, i) {
    if(prim.length === 0) {
      return null
    }else {
      return new cljs.core.IndexedSeq(prim, i)
    }
  };
  prim_seq = function(prim, i) {
    switch(arguments.length) {
      case 1:
        return prim_seq__1.call(this, prim);
      case 2:
        return prim_seq__2.call(this, prim, i)
    }
    throw"Invalid arity: " + arguments.length;
  };
  prim_seq.cljs$lang$arity$1 = prim_seq__1;
  prim_seq.cljs$lang$arity$2 = prim_seq__2;
  return prim_seq
}();
cljs.core.array_seq = function() {
  var array_seq = null;
  var array_seq__1 = function(array) {
    return cljs.core.prim_seq.call(null, array, 0)
  };
  var array_seq__2 = function(array, i) {
    return cljs.core.prim_seq.call(null, array, i)
  };
  array_seq = function(array, i) {
    switch(arguments.length) {
      case 1:
        return array_seq__1.call(this, array);
      case 2:
        return array_seq__2.call(this, array, i)
    }
    throw"Invalid arity: " + arguments.length;
  };
  array_seq.cljs$lang$arity$1 = array_seq__1;
  array_seq.cljs$lang$arity$2 = array_seq__2;
  return array_seq
}();
cljs.core.IReduce["array"] = true;
cljs.core._reduce["array"] = function() {
  var G__6654 = null;
  var G__6654__2 = function(array, f) {
    return cljs.core.ci_reduce.call(null, array, f)
  };
  var G__6654__3 = function(array, f, start) {
    return cljs.core.ci_reduce.call(null, array, f, start)
  };
  G__6654 = function(array, f, start) {
    switch(arguments.length) {
      case 2:
        return G__6654__2.call(this, array, f);
      case 3:
        return G__6654__3.call(this, array, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6654
}();
cljs.core.ILookup["array"] = true;
cljs.core._lookup["array"] = function() {
  var G__6655 = null;
  var G__6655__2 = function(array, k) {
    return array[k]
  };
  var G__6655__3 = function(array, k, not_found) {
    return cljs.core._nth.call(null, array, k, not_found)
  };
  G__6655 = function(array, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6655__2.call(this, array, k);
      case 3:
        return G__6655__3.call(this, array, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6655
}();
cljs.core.IIndexed["array"] = true;
cljs.core._nth["array"] = function() {
  var G__6656 = null;
  var G__6656__2 = function(array, n) {
    if(n < array.length) {
      return array[n]
    }else {
      return null
    }
  };
  var G__6656__3 = function(array, n, not_found) {
    if(n < array.length) {
      return array[n]
    }else {
      return not_found
    }
  };
  G__6656 = function(array, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6656__2.call(this, array, n);
      case 3:
        return G__6656__3.call(this, array, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6656
}();
cljs.core.ICounted["array"] = true;
cljs.core._count["array"] = function(a) {
  return a.length
};
cljs.core.ISeqable["array"] = true;
cljs.core._seq["array"] = function(array) {
  return cljs.core.array_seq.call(null, array, 0)
};
cljs.core.seq = function seq(coll) {
  if(coll != null) {
    if(function() {
      var G__6657__6658 = coll;
      if(G__6657__6658 != null) {
        if(function() {
          var or__138__auto____6659 = G__6657__6658.cljs$lang$protocol_mask$partition0$ & 32;
          if(or__138__auto____6659) {
            return or__138__auto____6659
          }else {
            return G__6657__6658.cljs$core$ASeq$
          }
        }()) {
          return true
        }else {
          if(!G__6657__6658.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__6657__6658)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__6657__6658)
      }
    }()) {
      return coll
    }else {
      return cljs.core._seq.call(null, coll)
    }
  }else {
    return null
  }
};
cljs.core.first = function first(coll) {
  if(coll != null) {
    if(function() {
      var G__6660__6661 = coll;
      if(G__6660__6661 != null) {
        if(function() {
          var or__138__auto____6662 = G__6660__6661.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__138__auto____6662) {
            return or__138__auto____6662
          }else {
            return G__6660__6661.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__6660__6661.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6660__6661)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6660__6661)
      }
    }()) {
      return cljs.core._first.call(null, coll)
    }else {
      var s__6663 = cljs.core.seq.call(null, coll);
      if(s__6663 != null) {
        return cljs.core._first.call(null, s__6663)
      }else {
        return null
      }
    }
  }else {
    return null
  }
};
cljs.core.rest = function rest(coll) {
  if(coll != null) {
    if(function() {
      var G__6664__6665 = coll;
      if(G__6664__6665 != null) {
        if(function() {
          var or__138__auto____6666 = G__6664__6665.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__138__auto____6666) {
            return or__138__auto____6666
          }else {
            return G__6664__6665.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__6664__6665.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6664__6665)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6664__6665)
      }
    }()) {
      return cljs.core._rest.call(null, coll)
    }else {
      var s__6667 = cljs.core.seq.call(null, coll);
      if(s__6667 != null) {
        return cljs.core._rest.call(null, s__6667)
      }else {
        return cljs.core.List.EMPTY
      }
    }
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.next = function next(coll) {
  if(coll != null) {
    if(function() {
      var G__6668__6669 = coll;
      if(G__6668__6669 != null) {
        if(function() {
          var or__138__auto____6670 = G__6668__6669.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__138__auto____6670) {
            return or__138__auto____6670
          }else {
            return G__6668__6669.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__6668__6669.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6668__6669)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6668__6669)
      }
    }()) {
      var coll__6671 = cljs.core._rest.call(null, coll);
      if(coll__6671 != null) {
        if(function() {
          var G__6672__6673 = coll__6671;
          if(G__6672__6673 != null) {
            if(function() {
              var or__138__auto____6674 = G__6672__6673.cljs$lang$protocol_mask$partition0$ & 32;
              if(or__138__auto____6674) {
                return or__138__auto____6674
              }else {
                return G__6672__6673.cljs$core$ASeq$
              }
            }()) {
              return true
            }else {
              if(!G__6672__6673.cljs$lang$protocol_mask$partition0$) {
                return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__6672__6673)
              }else {
                return false
              }
            }
          }else {
            return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__6672__6673)
          }
        }()) {
          return coll__6671
        }else {
          return cljs.core._seq.call(null, coll__6671)
        }
      }else {
        return null
      }
    }else {
      return cljs.core.seq.call(null, cljs.core.rest.call(null, coll))
    }
  }else {
    return null
  }
};
cljs.core.second = function second(coll) {
  return cljs.core.first.call(null, cljs.core.next.call(null, coll))
};
cljs.core.ffirst = function ffirst(coll) {
  return cljs.core.first.call(null, cljs.core.first.call(null, coll))
};
cljs.core.nfirst = function nfirst(coll) {
  return cljs.core.next.call(null, cljs.core.first.call(null, coll))
};
cljs.core.fnext = function fnext(coll) {
  return cljs.core.first.call(null, cljs.core.next.call(null, coll))
};
cljs.core.nnext = function nnext(coll) {
  return cljs.core.next.call(null, cljs.core.next.call(null, coll))
};
cljs.core.last = function last(s) {
  while(true) {
    if(cljs.core.truth_(cljs.core.next.call(null, s))) {
      var G__6675 = cljs.core.next.call(null, s);
      s = G__6675;
      continue
    }else {
      return cljs.core.first.call(null, s)
    }
    break
  }
};
cljs.core.IEquiv["_"] = true;
cljs.core._equiv["_"] = function(x, o) {
  return x === o
};
cljs.core.not = function not(x) {
  if(cljs.core.truth_(x)) {
    return false
  }else {
    return true
  }
};
cljs.core.conj = function() {
  var conj = null;
  var conj__2 = function(coll, x) {
    return cljs.core._conj.call(null, coll, x)
  };
  var conj__3 = function() {
    var G__6676__delegate = function(coll, x, xs) {
      while(true) {
        if(cljs.core.truth_(xs)) {
          var G__6677 = conj.call(null, coll, x);
          var G__6678 = cljs.core.first.call(null, xs);
          var G__6679 = cljs.core.next.call(null, xs);
          coll = G__6677;
          x = G__6678;
          xs = G__6679;
          continue
        }else {
          return conj.call(null, coll, x)
        }
        break
      }
    };
    var G__6676 = function(coll, x, var_args) {
      var xs = null;
      if(goog.isDef(var_args)) {
        xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6676__delegate.call(this, coll, x, xs)
    };
    G__6676.cljs$lang$maxFixedArity = 2;
    G__6676.cljs$lang$applyTo = function(arglist__6680) {
      var coll = cljs.core.first(arglist__6680);
      var x = cljs.core.first(cljs.core.next(arglist__6680));
      var xs = cljs.core.rest(cljs.core.next(arglist__6680));
      return G__6676__delegate(coll, x, xs)
    };
    G__6676.cljs$lang$arity$variadic = G__6676__delegate;
    return G__6676
  }();
  conj = function(coll, x, var_args) {
    var xs = var_args;
    switch(arguments.length) {
      case 2:
        return conj__2.call(this, coll, x);
      default:
        return conj__3.cljs$lang$arity$variadic(coll, x, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  conj.cljs$lang$maxFixedArity = 2;
  conj.cljs$lang$applyTo = conj__3.cljs$lang$applyTo;
  conj.cljs$lang$arity$2 = conj__2;
  conj.cljs$lang$arity$variadic = conj__3.cljs$lang$arity$variadic;
  return conj
}();
cljs.core.empty = function empty(coll) {
  return cljs.core._empty.call(null, coll)
};
void 0;
cljs.core.accumulating_seq_count = function accumulating_seq_count(coll) {
  var s__6681 = cljs.core.seq.call(null, coll);
  var acc__6682 = 0;
  while(true) {
    if(cljs.core.counted_QMARK_.call(null, s__6681)) {
      return acc__6682 + cljs.core._count.call(null, s__6681)
    }else {
      var G__6683 = cljs.core.next.call(null, s__6681);
      var G__6684 = acc__6682 + 1;
      s__6681 = G__6683;
      acc__6682 = G__6684;
      continue
    }
    break
  }
};
cljs.core.count = function count(coll) {
  if(cljs.core.counted_QMARK_.call(null, coll)) {
    return cljs.core._count.call(null, coll)
  }else {
    return cljs.core.accumulating_seq_count.call(null, coll)
  }
};
void 0;
cljs.core.linear_traversal_nth = function() {
  var linear_traversal_nth = null;
  var linear_traversal_nth__2 = function(coll, n) {
    if(coll == null) {
      throw new Error("Index out of bounds");
    }else {
      if(n === 0) {
        if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
          return cljs.core.first.call(null, coll)
        }else {
          throw new Error("Index out of bounds");
        }
      }else {
        if(cljs.core.indexed_QMARK_.call(null, coll)) {
          return cljs.core._nth.call(null, coll, n)
        }else {
          if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
            return linear_traversal_nth.call(null, cljs.core.next.call(null, coll), n - 1)
          }else {
            if("\ufdd0'else") {
              throw new Error("Index out of bounds");
            }else {
              return null
            }
          }
        }
      }
    }
  };
  var linear_traversal_nth__3 = function(coll, n, not_found) {
    if(coll == null) {
      return not_found
    }else {
      if(n === 0) {
        if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
          return cljs.core.first.call(null, coll)
        }else {
          return not_found
        }
      }else {
        if(cljs.core.indexed_QMARK_.call(null, coll)) {
          return cljs.core._nth.call(null, coll, n, not_found)
        }else {
          if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
            return linear_traversal_nth.call(null, cljs.core.next.call(null, coll), n - 1, not_found)
          }else {
            if("\ufdd0'else") {
              return not_found
            }else {
              return null
            }
          }
        }
      }
    }
  };
  linear_traversal_nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return linear_traversal_nth__2.call(this, coll, n);
      case 3:
        return linear_traversal_nth__3.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  linear_traversal_nth.cljs$lang$arity$2 = linear_traversal_nth__2;
  linear_traversal_nth.cljs$lang$arity$3 = linear_traversal_nth__3;
  return linear_traversal_nth
}();
cljs.core.nth = function() {
  var nth = null;
  var nth__2 = function(coll, n) {
    if(coll != null) {
      if(function() {
        var G__6685__6686 = coll;
        if(G__6685__6686 != null) {
          if(function() {
            var or__138__auto____6687 = G__6685__6686.cljs$lang$protocol_mask$partition0$ & 16;
            if(or__138__auto____6687) {
              return or__138__auto____6687
            }else {
              return G__6685__6686.cljs$core$IIndexed$
            }
          }()) {
            return true
          }else {
            if(!G__6685__6686.cljs$lang$protocol_mask$partition0$) {
              return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6685__6686)
            }else {
              return false
            }
          }
        }else {
          return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6685__6686)
        }
      }()) {
        return cljs.core._nth.call(null, coll, Math.floor(n))
      }else {
        return cljs.core.linear_traversal_nth.call(null, coll, Math.floor(n))
      }
    }else {
      return null
    }
  };
  var nth__3 = function(coll, n, not_found) {
    if(coll != null) {
      if(function() {
        var G__6688__6689 = coll;
        if(G__6688__6689 != null) {
          if(function() {
            var or__138__auto____6690 = G__6688__6689.cljs$lang$protocol_mask$partition0$ & 16;
            if(or__138__auto____6690) {
              return or__138__auto____6690
            }else {
              return G__6688__6689.cljs$core$IIndexed$
            }
          }()) {
            return true
          }else {
            if(!G__6688__6689.cljs$lang$protocol_mask$partition0$) {
              return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6688__6689)
            }else {
              return false
            }
          }
        }else {
          return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6688__6689)
        }
      }()) {
        return cljs.core._nth.call(null, coll, Math.floor(n), not_found)
      }else {
        return cljs.core.linear_traversal_nth.call(null, coll, Math.floor(n), not_found)
      }
    }else {
      return not_found
    }
  };
  nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return nth__2.call(this, coll, n);
      case 3:
        return nth__3.call(this, coll, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  nth.cljs$lang$arity$2 = nth__2;
  nth.cljs$lang$arity$3 = nth__3;
  return nth
}();
cljs.core.get = function() {
  var get = null;
  var get__2 = function(o, k) {
    return cljs.core._lookup.call(null, o, k)
  };
  var get__3 = function(o, k, not_found) {
    return cljs.core._lookup.call(null, o, k, not_found)
  };
  get = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return get__2.call(this, o, k);
      case 3:
        return get__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  get.cljs$lang$arity$2 = get__2;
  get.cljs$lang$arity$3 = get__3;
  return get
}();
cljs.core.assoc = function() {
  var assoc = null;
  var assoc__3 = function(coll, k, v) {
    return cljs.core._assoc.call(null, coll, k, v)
  };
  var assoc__4 = function() {
    var G__6692__delegate = function(coll, k, v, kvs) {
      while(true) {
        var ret__6691 = assoc.call(null, coll, k, v);
        if(cljs.core.truth_(kvs)) {
          var G__6693 = ret__6691;
          var G__6694 = cljs.core.first.call(null, kvs);
          var G__6695 = cljs.core.second.call(null, kvs);
          var G__6696 = cljs.core.nnext.call(null, kvs);
          coll = G__6693;
          k = G__6694;
          v = G__6695;
          kvs = G__6696;
          continue
        }else {
          return ret__6691
        }
        break
      }
    };
    var G__6692 = function(coll, k, v, var_args) {
      var kvs = null;
      if(goog.isDef(var_args)) {
        kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__6692__delegate.call(this, coll, k, v, kvs)
    };
    G__6692.cljs$lang$maxFixedArity = 3;
    G__6692.cljs$lang$applyTo = function(arglist__6697) {
      var coll = cljs.core.first(arglist__6697);
      var k = cljs.core.first(cljs.core.next(arglist__6697));
      var v = cljs.core.first(cljs.core.next(cljs.core.next(arglist__6697)));
      var kvs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__6697)));
      return G__6692__delegate(coll, k, v, kvs)
    };
    G__6692.cljs$lang$arity$variadic = G__6692__delegate;
    return G__6692
  }();
  assoc = function(coll, k, v, var_args) {
    var kvs = var_args;
    switch(arguments.length) {
      case 3:
        return assoc__3.call(this, coll, k, v);
      default:
        return assoc__4.cljs$lang$arity$variadic(coll, k, v, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  assoc.cljs$lang$maxFixedArity = 3;
  assoc.cljs$lang$applyTo = assoc__4.cljs$lang$applyTo;
  assoc.cljs$lang$arity$3 = assoc__3;
  assoc.cljs$lang$arity$variadic = assoc__4.cljs$lang$arity$variadic;
  return assoc
}();
cljs.core.dissoc = function() {
  var dissoc = null;
  var dissoc__1 = function(coll) {
    return coll
  };
  var dissoc__2 = function(coll, k) {
    return cljs.core._dissoc.call(null, coll, k)
  };
  var dissoc__3 = function() {
    var G__6699__delegate = function(coll, k, ks) {
      while(true) {
        var ret__6698 = dissoc.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__6700 = ret__6698;
          var G__6701 = cljs.core.first.call(null, ks);
          var G__6702 = cljs.core.next.call(null, ks);
          coll = G__6700;
          k = G__6701;
          ks = G__6702;
          continue
        }else {
          return ret__6698
        }
        break
      }
    };
    var G__6699 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6699__delegate.call(this, coll, k, ks)
    };
    G__6699.cljs$lang$maxFixedArity = 2;
    G__6699.cljs$lang$applyTo = function(arglist__6703) {
      var coll = cljs.core.first(arglist__6703);
      var k = cljs.core.first(cljs.core.next(arglist__6703));
      var ks = cljs.core.rest(cljs.core.next(arglist__6703));
      return G__6699__delegate(coll, k, ks)
    };
    G__6699.cljs$lang$arity$variadic = G__6699__delegate;
    return G__6699
  }();
  dissoc = function(coll, k, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 1:
        return dissoc__1.call(this, coll);
      case 2:
        return dissoc__2.call(this, coll, k);
      default:
        return dissoc__3.cljs$lang$arity$variadic(coll, k, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  dissoc.cljs$lang$maxFixedArity = 2;
  dissoc.cljs$lang$applyTo = dissoc__3.cljs$lang$applyTo;
  dissoc.cljs$lang$arity$1 = dissoc__1;
  dissoc.cljs$lang$arity$2 = dissoc__2;
  dissoc.cljs$lang$arity$variadic = dissoc__3.cljs$lang$arity$variadic;
  return dissoc
}();
cljs.core.with_meta = function with_meta(o, meta) {
  return cljs.core._with_meta.call(null, o, meta)
};
cljs.core.meta = function meta(o) {
  if(function() {
    var G__6704__6705 = o;
    if(G__6704__6705 != null) {
      if(function() {
        var or__138__auto____6706 = G__6704__6705.cljs$lang$protocol_mask$partition0$ & 65536;
        if(or__138__auto____6706) {
          return or__138__auto____6706
        }else {
          return G__6704__6705.cljs$core$IMeta$
        }
      }()) {
        return true
      }else {
        if(!G__6704__6705.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__6704__6705)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__6704__6705)
    }
  }()) {
    return cljs.core._meta.call(null, o)
  }else {
    return null
  }
};
cljs.core.peek = function peek(coll) {
  return cljs.core._peek.call(null, coll)
};
cljs.core.pop = function pop(coll) {
  return cljs.core._pop.call(null, coll)
};
cljs.core.disj = function() {
  var disj = null;
  var disj__1 = function(coll) {
    return coll
  };
  var disj__2 = function(coll, k) {
    return cljs.core._disjoin.call(null, coll, k)
  };
  var disj__3 = function() {
    var G__6708__delegate = function(coll, k, ks) {
      while(true) {
        var ret__6707 = disj.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__6709 = ret__6707;
          var G__6710 = cljs.core.first.call(null, ks);
          var G__6711 = cljs.core.next.call(null, ks);
          coll = G__6709;
          k = G__6710;
          ks = G__6711;
          continue
        }else {
          return ret__6707
        }
        break
      }
    };
    var G__6708 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6708__delegate.call(this, coll, k, ks)
    };
    G__6708.cljs$lang$maxFixedArity = 2;
    G__6708.cljs$lang$applyTo = function(arglist__6712) {
      var coll = cljs.core.first(arglist__6712);
      var k = cljs.core.first(cljs.core.next(arglist__6712));
      var ks = cljs.core.rest(cljs.core.next(arglist__6712));
      return G__6708__delegate(coll, k, ks)
    };
    G__6708.cljs$lang$arity$variadic = G__6708__delegate;
    return G__6708
  }();
  disj = function(coll, k, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 1:
        return disj__1.call(this, coll);
      case 2:
        return disj__2.call(this, coll, k);
      default:
        return disj__3.cljs$lang$arity$variadic(coll, k, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  disj.cljs$lang$maxFixedArity = 2;
  disj.cljs$lang$applyTo = disj__3.cljs$lang$applyTo;
  disj.cljs$lang$arity$1 = disj__1;
  disj.cljs$lang$arity$2 = disj__2;
  disj.cljs$lang$arity$variadic = disj__3.cljs$lang$arity$variadic;
  return disj
}();
cljs.core.hash = function hash(o) {
  return cljs.core._hash.call(null, o)
};
cljs.core.empty_QMARK_ = function empty_QMARK_(coll) {
  return cljs.core.not.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.coll_QMARK_ = function coll_QMARK_(x) {
  if(x == null) {
    return false
  }else {
    var G__6713__6714 = x;
    if(G__6713__6714 != null) {
      if(function() {
        var or__138__auto____6715 = G__6713__6714.cljs$lang$protocol_mask$partition0$ & 8;
        if(or__138__auto____6715) {
          return or__138__auto____6715
        }else {
          return G__6713__6714.cljs$core$ICollection$
        }
      }()) {
        return true
      }else {
        if(!G__6713__6714.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, G__6713__6714)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, G__6713__6714)
    }
  }
};
cljs.core.set_QMARK_ = function set_QMARK_(x) {
  if(x == null) {
    return false
  }else {
    var G__6716__6717 = x;
    if(G__6716__6717 != null) {
      if(function() {
        var or__138__auto____6718 = G__6716__6717.cljs$lang$protocol_mask$partition0$ & 2048;
        if(or__138__auto____6718) {
          return or__138__auto____6718
        }else {
          return G__6716__6717.cljs$core$ISet$
        }
      }()) {
        return true
      }else {
        if(!G__6716__6717.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ISet, G__6716__6717)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISet, G__6716__6717)
    }
  }
};
cljs.core.associative_QMARK_ = function associative_QMARK_(x) {
  var G__6719__6720 = x;
  if(G__6719__6720 != null) {
    if(function() {
      var or__138__auto____6721 = G__6719__6720.cljs$lang$protocol_mask$partition0$ & 256;
      if(or__138__auto____6721) {
        return or__138__auto____6721
      }else {
        return G__6719__6720.cljs$core$IAssociative$
      }
    }()) {
      return true
    }else {
      if(!G__6719__6720.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, G__6719__6720)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, G__6719__6720)
  }
};
cljs.core.sequential_QMARK_ = function sequential_QMARK_(x) {
  var G__6722__6723 = x;
  if(G__6722__6723 != null) {
    if(function() {
      var or__138__auto____6724 = G__6722__6723.cljs$lang$protocol_mask$partition0$ & 8388608;
      if(or__138__auto____6724) {
        return or__138__auto____6724
      }else {
        return G__6722__6723.cljs$core$ISequential$
      }
    }()) {
      return true
    }else {
      if(!G__6722__6723.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, G__6722__6723)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, G__6722__6723)
  }
};
cljs.core.counted_QMARK_ = function counted_QMARK_(x) {
  var G__6725__6726 = x;
  if(G__6725__6726 != null) {
    if(function() {
      var or__138__auto____6727 = G__6725__6726.cljs$lang$protocol_mask$partition0$ & 2;
      if(or__138__auto____6727) {
        return or__138__auto____6727
      }else {
        return G__6725__6726.cljs$core$ICounted$
      }
    }()) {
      return true
    }else {
      if(!G__6725__6726.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, G__6725__6726)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, G__6725__6726)
  }
};
cljs.core.indexed_QMARK_ = function indexed_QMARK_(x) {
  var G__6728__6729 = x;
  if(G__6728__6729 != null) {
    if(function() {
      var or__138__auto____6730 = G__6728__6729.cljs$lang$protocol_mask$partition0$ & 16;
      if(or__138__auto____6730) {
        return or__138__auto____6730
      }else {
        return G__6728__6729.cljs$core$IIndexed$
      }
    }()) {
      return true
    }else {
      if(!G__6728__6729.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6728__6729)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6728__6729)
  }
};
cljs.core.reduceable_QMARK_ = function reduceable_QMARK_(x) {
  var G__6731__6732 = x;
  if(G__6731__6732 != null) {
    if(function() {
      var or__138__auto____6733 = G__6731__6732.cljs$lang$protocol_mask$partition0$ & 262144;
      if(or__138__auto____6733) {
        return or__138__auto____6733
      }else {
        return G__6731__6732.cljs$core$IReduce$
      }
    }()) {
      return true
    }else {
      if(!G__6731__6732.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__6731__6732)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__6731__6732)
  }
};
cljs.core.map_QMARK_ = function map_QMARK_(x) {
  if(x == null) {
    return false
  }else {
    var G__6734__6735 = x;
    if(G__6734__6735 != null) {
      if(function() {
        var or__138__auto____6736 = G__6734__6735.cljs$lang$protocol_mask$partition0$ & 512;
        if(or__138__auto____6736) {
          return or__138__auto____6736
        }else {
          return G__6734__6735.cljs$core$IMap$
        }
      }()) {
        return true
      }else {
        if(!G__6734__6735.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IMap, G__6734__6735)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMap, G__6734__6735)
    }
  }
};
cljs.core.vector_QMARK_ = function vector_QMARK_(x) {
  var G__6737__6738 = x;
  if(G__6737__6738 != null) {
    if(function() {
      var or__138__auto____6739 = G__6737__6738.cljs$lang$protocol_mask$partition0$ & 8192;
      if(or__138__auto____6739) {
        return or__138__auto____6739
      }else {
        return G__6737__6738.cljs$core$IVector$
      }
    }()) {
      return true
    }else {
      if(!G__6737__6738.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IVector, G__6737__6738)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IVector, G__6737__6738)
  }
};
cljs.core.js_obj = function() {
  var js_obj = null;
  var js_obj__0 = function() {
    return{}
  };
  var js_obj__1 = function() {
    var G__6740__delegate = function(keyvals) {
      return cljs.core.apply.call(null, goog.object.create, keyvals)
    };
    var G__6740 = function(var_args) {
      var keyvals = null;
      if(goog.isDef(var_args)) {
        keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__6740__delegate.call(this, keyvals)
    };
    G__6740.cljs$lang$maxFixedArity = 0;
    G__6740.cljs$lang$applyTo = function(arglist__6741) {
      var keyvals = cljs.core.seq(arglist__6741);
      return G__6740__delegate(keyvals)
    };
    G__6740.cljs$lang$arity$variadic = G__6740__delegate;
    return G__6740
  }();
  js_obj = function(var_args) {
    var keyvals = var_args;
    switch(arguments.length) {
      case 0:
        return js_obj__0.call(this);
      default:
        return js_obj__1.cljs$lang$arity$variadic(falsecljs.core.array_seq(arguments, 0))
    }
    throw"Invalid arity: " + arguments.length;
  };
  js_obj.cljs$lang$maxFixedArity = 0;
  js_obj.cljs$lang$applyTo = js_obj__1.cljs$lang$applyTo;
  js_obj.cljs$lang$arity$0 = js_obj__0;
  js_obj.cljs$lang$arity$variadic = js_obj__1.cljs$lang$arity$variadic;
  return js_obj
}();
cljs.core.js_keys = function js_keys(obj) {
  var keys__6742 = [];
  goog.object.forEach.call(null, obj, function(val, key, obj) {
    return keys__6742.push(key)
  });
  return keys__6742
};
cljs.core.js_delete = function js_delete(obj, key) {
  return delete obj[key]
};
cljs.core.array_copy = function array_copy(from, i, to, j, len) {
  var i__6743 = i;
  var j__6744 = j;
  var len__6745 = len;
  while(true) {
    if(len__6745 === 0) {
      return to
    }else {
      to[j__6744] = from[i__6743];
      var G__6746 = i__6743 + 1;
      var G__6747 = j__6744 + 1;
      var G__6748 = len__6745 - 1;
      i__6743 = G__6746;
      j__6744 = G__6747;
      len__6745 = G__6748;
      continue
    }
    break
  }
};
cljs.core.array_copy_downward = function array_copy_downward(from, i, to, j, len) {
  var i__6749 = i + (len - 1);
  var j__6750 = j + (len - 1);
  var len__6751 = len;
  while(true) {
    if(len__6751 === 0) {
      return to
    }else {
      to[j__6750] = from[i__6749];
      var G__6752 = i__6749 - 1;
      var G__6753 = j__6750 - 1;
      var G__6754 = len__6751 - 1;
      i__6749 = G__6752;
      j__6750 = G__6753;
      len__6751 = G__6754;
      continue
    }
    break
  }
};
cljs.core.lookup_sentinel = {};
cljs.core.false_QMARK_ = function false_QMARK_(x) {
  return x === false
};
cljs.core.true_QMARK_ = function true_QMARK_(x) {
  return x === true
};
cljs.core.undefined_QMARK_ = function undefined_QMARK_(x) {
  return void 0 === x
};
cljs.core.instance_QMARK_ = function instance_QMARK_(t, o) {
  return o != null && (o instanceof t || o.constructor === t || t === Object)
};
cljs.core.seq_QMARK_ = function seq_QMARK_(s) {
  if(s == null) {
    return false
  }else {
    var G__6755__6756 = s;
    if(G__6755__6756 != null) {
      if(function() {
        var or__138__auto____6757 = G__6755__6756.cljs$lang$protocol_mask$partition0$ & 64;
        if(or__138__auto____6757) {
          return or__138__auto____6757
        }else {
          return G__6755__6756.cljs$core$ISeq$
        }
      }()) {
        return true
      }else {
        if(!G__6755__6756.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6755__6756)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6755__6756)
    }
  }
};
cljs.core.seqable_QMARK_ = function seqable_QMARK_(s) {
  var G__6758__6759 = s;
  if(G__6758__6759 != null) {
    if(function() {
      var or__138__auto____6760 = G__6758__6759.cljs$lang$protocol_mask$partition0$ & 4194304;
      if(or__138__auto____6760) {
        return or__138__auto____6760
      }else {
        return G__6758__6759.cljs$core$ISeqable$
      }
    }()) {
      return true
    }else {
      if(!G__6758__6759.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, G__6758__6759)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, G__6758__6759)
  }
};
cljs.core.boolean$ = function boolean$(x) {
  if(cljs.core.truth_(x)) {
    return true
  }else {
    return false
  }
};
cljs.core.string_QMARK_ = function string_QMARK_(x) {
  var and__132__auto____6761 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__132__auto____6761)) {
    return cljs.core.not.call(null, function() {
      var or__138__auto____6762 = x.charAt(0) === "\ufdd0";
      if(or__138__auto____6762) {
        return or__138__auto____6762
      }else {
        return x.charAt(0) === "\ufdd1"
      }
    }())
  }else {
    return and__132__auto____6761
  }
};
cljs.core.keyword_QMARK_ = function keyword_QMARK_(x) {
  var and__132__auto____6763 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__132__auto____6763)) {
    return x.charAt(0) === "\ufdd0"
  }else {
    return and__132__auto____6763
  }
};
cljs.core.symbol_QMARK_ = function symbol_QMARK_(x) {
  var and__132__auto____6764 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__132__auto____6764)) {
    return x.charAt(0) === "\ufdd1"
  }else {
    return and__132__auto____6764
  }
};
cljs.core.number_QMARK_ = function number_QMARK_(n) {
  return goog.isNumber.call(null, n)
};
cljs.core.fn_QMARK_ = function fn_QMARK_(f) {
  return goog.isFunction.call(null, f)
};
cljs.core.ifn_QMARK_ = function ifn_QMARK_(f) {
  var or__138__auto____6765 = cljs.core.fn_QMARK_.call(null, f);
  if(or__138__auto____6765) {
    return or__138__auto____6765
  }else {
    var G__6766__6767 = f;
    if(G__6766__6767 != null) {
      if(function() {
        var or__138__auto____6768 = G__6766__6767.cljs$lang$protocol_mask$partition0$ & 1;
        if(or__138__auto____6768) {
          return or__138__auto____6768
        }else {
          return G__6766__6767.cljs$core$IFn$
        }
      }()) {
        return true
      }else {
        if(!G__6766__6767.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IFn, G__6766__6767)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IFn, G__6766__6767)
    }
  }
};
cljs.core.integer_QMARK_ = function integer_QMARK_(n) {
  var and__132__auto____6769 = cljs.core.number_QMARK_.call(null, n);
  if(and__132__auto____6769) {
    return n == n.toFixed()
  }else {
    return and__132__auto____6769
  }
};
cljs.core.contains_QMARK_ = function contains_QMARK_(coll, v) {
  if(cljs.core._lookup.call(null, coll, v, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return false
  }else {
    return true
  }
};
cljs.core.find = function find(coll, k) {
  if(cljs.core.truth_(function() {
    var and__132__auto____6770 = coll;
    if(cljs.core.truth_(and__132__auto____6770)) {
      var and__132__auto____6771 = cljs.core.associative_QMARK_.call(null, coll);
      if(and__132__auto____6771) {
        return cljs.core.contains_QMARK_.call(null, coll, k)
      }else {
        return and__132__auto____6771
      }
    }else {
      return and__132__auto____6770
    }
  }())) {
    return cljs.core.PersistentVector.fromArray([k, cljs.core._lookup.call(null, coll, k)])
  }else {
    return null
  }
};
cljs.core.distinct_QMARK_ = function() {
  var distinct_QMARK_ = null;
  var distinct_QMARK___1 = function(x) {
    return true
  };
  var distinct_QMARK___2 = function(x, y) {
    return cljs.core.not.call(null, cljs.core._EQ_.call(null, x, y))
  };
  var distinct_QMARK___3 = function() {
    var G__6776__delegate = function(x, y, more) {
      if(cljs.core.not.call(null, cljs.core._EQ_.call(null, x, y))) {
        var s__6772 = cljs.core.set([y, x]);
        var xs__6773 = more;
        while(true) {
          var x__6774 = cljs.core.first.call(null, xs__6773);
          var etc__6775 = cljs.core.next.call(null, xs__6773);
          if(cljs.core.truth_(xs__6773)) {
            if(cljs.core.contains_QMARK_.call(null, s__6772, x__6774)) {
              return false
            }else {
              var G__6777 = cljs.core.conj.call(null, s__6772, x__6774);
              var G__6778 = etc__6775;
              s__6772 = G__6777;
              xs__6773 = G__6778;
              continue
            }
          }else {
            return true
          }
          break
        }
      }else {
        return false
      }
    };
    var G__6776 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6776__delegate.call(this, x, y, more)
    };
    G__6776.cljs$lang$maxFixedArity = 2;
    G__6776.cljs$lang$applyTo = function(arglist__6779) {
      var x = cljs.core.first(arglist__6779);
      var y = cljs.core.first(cljs.core.next(arglist__6779));
      var more = cljs.core.rest(cljs.core.next(arglist__6779));
      return G__6776__delegate(x, y, more)
    };
    G__6776.cljs$lang$arity$variadic = G__6776__delegate;
    return G__6776
  }();
  distinct_QMARK_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return distinct_QMARK___1.call(this, x);
      case 2:
        return distinct_QMARK___2.call(this, x, y);
      default:
        return distinct_QMARK___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  distinct_QMARK_.cljs$lang$maxFixedArity = 2;
  distinct_QMARK_.cljs$lang$applyTo = distinct_QMARK___3.cljs$lang$applyTo;
  distinct_QMARK_.cljs$lang$arity$1 = distinct_QMARK___1;
  distinct_QMARK_.cljs$lang$arity$2 = distinct_QMARK___2;
  distinct_QMARK_.cljs$lang$arity$variadic = distinct_QMARK___3.cljs$lang$arity$variadic;
  return distinct_QMARK_
}();
cljs.core.compare = function compare(x, y) {
  if(cljs.core.type.call(null, x) === cljs.core.type.call(null, y)) {
    return goog.array.defaultCompare.call(null, x, y)
  }else {
    if(x == null) {
      return-1
    }else {
      if(y == null) {
        return 1
      }else {
        if("\ufdd0'else") {
          throw new Error("compare on non-nil objects of different types");
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.fn__GT_comparator = function fn__GT_comparator(f) {
  if(cljs.core._EQ_.call(null, f, cljs.core.compare)) {
    return cljs.core.compare
  }else {
    return function(x, y) {
      var r__6780 = f.call(null, x, y);
      if(cljs.core.number_QMARK_.call(null, r__6780)) {
        return r__6780
      }else {
        if(cljs.core.truth_(r__6780)) {
          return-1
        }else {
          if(cljs.core.truth_(f.call(null, y, x))) {
            return 1
          }else {
            return 0
          }
        }
      }
    }
  }
};
void 0;
cljs.core.sort = function() {
  var sort = null;
  var sort__1 = function(coll) {
    return sort.call(null, cljs.core.compare, coll)
  };
  var sort__2 = function(comp, coll) {
    if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
      var a__6781 = cljs.core.to_array.call(null, coll);
      goog.array.stableSort.call(null, a__6781, cljs.core.fn__GT_comparator.call(null, comp));
      return cljs.core.seq.call(null, a__6781)
    }else {
      return cljs.core.List.EMPTY
    }
  };
  sort = function(comp, coll) {
    switch(arguments.length) {
      case 1:
        return sort__1.call(this, comp);
      case 2:
        return sort__2.call(this, comp, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  sort.cljs$lang$arity$1 = sort__1;
  sort.cljs$lang$arity$2 = sort__2;
  return sort
}();
cljs.core.sort_by = function() {
  var sort_by = null;
  var sort_by__2 = function(keyfn, coll) {
    return sort_by.call(null, keyfn, cljs.core.compare, coll)
  };
  var sort_by__3 = function(keyfn, comp, coll) {
    return cljs.core.sort.call(null, function(x, y) {
      return cljs.core.fn__GT_comparator.call(null, comp).call(null, keyfn.call(null, x), keyfn.call(null, y))
    }, coll)
  };
  sort_by = function(keyfn, comp, coll) {
    switch(arguments.length) {
      case 2:
        return sort_by__2.call(this, keyfn, comp);
      case 3:
        return sort_by__3.call(this, keyfn, comp, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  sort_by.cljs$lang$arity$2 = sort_by__2;
  sort_by.cljs$lang$arity$3 = sort_by__3;
  return sort_by
}();
cljs.core.seq_reduce = function() {
  var seq_reduce = null;
  var seq_reduce__2 = function(f, coll) {
    var temp__317__auto____6782 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__317__auto____6782)) {
      var s__6783 = temp__317__auto____6782;
      return cljs.core.reduce.call(null, f, cljs.core.first.call(null, s__6783), cljs.core.next.call(null, s__6783))
    }else {
      return f.call(null)
    }
  };
  var seq_reduce__3 = function(f, val, coll) {
    var val__6784 = val;
    var coll__6785 = cljs.core.seq.call(null, coll);
    while(true) {
      if(cljs.core.truth_(coll__6785)) {
        var nval__6786 = f.call(null, val__6784, cljs.core.first.call(null, coll__6785));
        if(cljs.core.reduced_QMARK_.call(null, nval__6786)) {
          return cljs.core.deref.call(null, nval__6786)
        }else {
          var G__6787 = nval__6786;
          var G__6788 = cljs.core.next.call(null, coll__6785);
          val__6784 = G__6787;
          coll__6785 = G__6788;
          continue
        }
      }else {
        return val__6784
      }
      break
    }
  };
  seq_reduce = function(f, val, coll) {
    switch(arguments.length) {
      case 2:
        return seq_reduce__2.call(this, f, val);
      case 3:
        return seq_reduce__3.call(this, f, val, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  seq_reduce.cljs$lang$arity$2 = seq_reduce__2;
  seq_reduce.cljs$lang$arity$3 = seq_reduce__3;
  return seq_reduce
}();
cljs.core.reduce = function() {
  var reduce = null;
  var reduce__2 = function(f, coll) {
    if(function() {
      var G__6789__6790 = coll;
      if(G__6789__6790 != null) {
        if(function() {
          var or__138__auto____6791 = G__6789__6790.cljs$lang$protocol_mask$partition0$ & 262144;
          if(or__138__auto____6791) {
            return or__138__auto____6791
          }else {
            return G__6789__6790.cljs$core$IReduce$
          }
        }()) {
          return true
        }else {
          if(!G__6789__6790.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__6789__6790)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__6789__6790)
      }
    }()) {
      return cljs.core._reduce.call(null, coll, f)
    }else {
      return cljs.core.seq_reduce.call(null, f, coll)
    }
  };
  var reduce__3 = function(f, val, coll) {
    if(function() {
      var G__6792__6793 = coll;
      if(G__6792__6793 != null) {
        if(function() {
          var or__138__auto____6794 = G__6792__6793.cljs$lang$protocol_mask$partition0$ & 262144;
          if(or__138__auto____6794) {
            return or__138__auto____6794
          }else {
            return G__6792__6793.cljs$core$IReduce$
          }
        }()) {
          return true
        }else {
          if(!G__6792__6793.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__6792__6793)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__6792__6793)
      }
    }()) {
      return cljs.core._reduce.call(null, coll, f, val)
    }else {
      return cljs.core.seq_reduce.call(null, f, val, coll)
    }
  };
  reduce = function(f, val, coll) {
    switch(arguments.length) {
      case 2:
        return reduce__2.call(this, f, val);
      case 3:
        return reduce__3.call(this, f, val, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  reduce.cljs$lang$arity$2 = reduce__2;
  reduce.cljs$lang$arity$3 = reduce__3;
  return reduce
}();
cljs.core.reduce_kv = function reduce_kv(f, init, coll) {
  return cljs.core._kv_reduce.call(null, coll, f, init)
};
cljs.core.Reduced = function(val) {
  this.val = val;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 16384
};
cljs.core.Reduced.cljs$lang$type = true;
cljs.core.Reduced.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.Reduced")
};
cljs.core.Reduced.prototype.cljs$core$IDeref$ = true;
cljs.core.Reduced.prototype.cljs$core$IDeref$_deref$arity$1 = function(o) {
  var this__6795 = this;
  return this__6795.val
};
cljs.core.Reduced;
cljs.core.reduced_QMARK_ = function reduced_QMARK_(r) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Reduced, r)
};
cljs.core.reduced = function reduced(x) {
  return new cljs.core.Reduced(x)
};
cljs.core._PLUS_ = function() {
  var _PLUS_ = null;
  var _PLUS___0 = function() {
    return 0
  };
  var _PLUS___1 = function(x) {
    return x
  };
  var _PLUS___2 = function(x, y) {
    return x + y
  };
  var _PLUS___3 = function() {
    var G__6796__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _PLUS_, x + y, more)
    };
    var G__6796 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6796__delegate.call(this, x, y, more)
    };
    G__6796.cljs$lang$maxFixedArity = 2;
    G__6796.cljs$lang$applyTo = function(arglist__6797) {
      var x = cljs.core.first(arglist__6797);
      var y = cljs.core.first(cljs.core.next(arglist__6797));
      var more = cljs.core.rest(cljs.core.next(arglist__6797));
      return G__6796__delegate(x, y, more)
    };
    G__6796.cljs$lang$arity$variadic = G__6796__delegate;
    return G__6796
  }();
  _PLUS_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return _PLUS___0.call(this);
      case 1:
        return _PLUS___1.call(this, x);
      case 2:
        return _PLUS___2.call(this, x, y);
      default:
        return _PLUS___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _PLUS_.cljs$lang$maxFixedArity = 2;
  _PLUS_.cljs$lang$applyTo = _PLUS___3.cljs$lang$applyTo;
  _PLUS_.cljs$lang$arity$0 = _PLUS___0;
  _PLUS_.cljs$lang$arity$1 = _PLUS___1;
  _PLUS_.cljs$lang$arity$2 = _PLUS___2;
  _PLUS_.cljs$lang$arity$variadic = _PLUS___3.cljs$lang$arity$variadic;
  return _PLUS_
}();
cljs.core._ = function() {
  var _ = null;
  var ___1 = function(x) {
    return-x
  };
  var ___2 = function(x, y) {
    return x - y
  };
  var ___3 = function() {
    var G__6798__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _, x - y, more)
    };
    var G__6798 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6798__delegate.call(this, x, y, more)
    };
    G__6798.cljs$lang$maxFixedArity = 2;
    G__6798.cljs$lang$applyTo = function(arglist__6799) {
      var x = cljs.core.first(arglist__6799);
      var y = cljs.core.first(cljs.core.next(arglist__6799));
      var more = cljs.core.rest(cljs.core.next(arglist__6799));
      return G__6798__delegate(x, y, more)
    };
    G__6798.cljs$lang$arity$variadic = G__6798__delegate;
    return G__6798
  }();
  _ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return ___1.call(this, x);
      case 2:
        return ___2.call(this, x, y);
      default:
        return ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _.cljs$lang$maxFixedArity = 2;
  _.cljs$lang$applyTo = ___3.cljs$lang$applyTo;
  _.cljs$lang$arity$1 = ___1;
  _.cljs$lang$arity$2 = ___2;
  _.cljs$lang$arity$variadic = ___3.cljs$lang$arity$variadic;
  return _
}();
cljs.core._STAR_ = function() {
  var _STAR_ = null;
  var _STAR___0 = function() {
    return 1
  };
  var _STAR___1 = function(x) {
    return x
  };
  var _STAR___2 = function(x, y) {
    return x * y
  };
  var _STAR___3 = function() {
    var G__6800__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _STAR_, x * y, more)
    };
    var G__6800 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6800__delegate.call(this, x, y, more)
    };
    G__6800.cljs$lang$maxFixedArity = 2;
    G__6800.cljs$lang$applyTo = function(arglist__6801) {
      var x = cljs.core.first(arglist__6801);
      var y = cljs.core.first(cljs.core.next(arglist__6801));
      var more = cljs.core.rest(cljs.core.next(arglist__6801));
      return G__6800__delegate(x, y, more)
    };
    G__6800.cljs$lang$arity$variadic = G__6800__delegate;
    return G__6800
  }();
  _STAR_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return _STAR___0.call(this);
      case 1:
        return _STAR___1.call(this, x);
      case 2:
        return _STAR___2.call(this, x, y);
      default:
        return _STAR___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _STAR_.cljs$lang$maxFixedArity = 2;
  _STAR_.cljs$lang$applyTo = _STAR___3.cljs$lang$applyTo;
  _STAR_.cljs$lang$arity$0 = _STAR___0;
  _STAR_.cljs$lang$arity$1 = _STAR___1;
  _STAR_.cljs$lang$arity$2 = _STAR___2;
  _STAR_.cljs$lang$arity$variadic = _STAR___3.cljs$lang$arity$variadic;
  return _STAR_
}();
cljs.core._SLASH_ = function() {
  var _SLASH_ = null;
  var _SLASH___1 = function(x) {
    return _SLASH_.call(null, 1, x)
  };
  var _SLASH___2 = function(x, y) {
    return x / y
  };
  var _SLASH___3 = function() {
    var G__6802__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _SLASH_, _SLASH_.call(null, x, y), more)
    };
    var G__6802 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6802__delegate.call(this, x, y, more)
    };
    G__6802.cljs$lang$maxFixedArity = 2;
    G__6802.cljs$lang$applyTo = function(arglist__6803) {
      var x = cljs.core.first(arglist__6803);
      var y = cljs.core.first(cljs.core.next(arglist__6803));
      var more = cljs.core.rest(cljs.core.next(arglist__6803));
      return G__6802__delegate(x, y, more)
    };
    G__6802.cljs$lang$arity$variadic = G__6802__delegate;
    return G__6802
  }();
  _SLASH_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _SLASH___1.call(this, x);
      case 2:
        return _SLASH___2.call(this, x, y);
      default:
        return _SLASH___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _SLASH_.cljs$lang$maxFixedArity = 2;
  _SLASH_.cljs$lang$applyTo = _SLASH___3.cljs$lang$applyTo;
  _SLASH_.cljs$lang$arity$1 = _SLASH___1;
  _SLASH_.cljs$lang$arity$2 = _SLASH___2;
  _SLASH_.cljs$lang$arity$variadic = _SLASH___3.cljs$lang$arity$variadic;
  return _SLASH_
}();
cljs.core._LT_ = function() {
  var _LT_ = null;
  var _LT___1 = function(x) {
    return true
  };
  var _LT___2 = function(x, y) {
    return x < y
  };
  var _LT___3 = function() {
    var G__6804__delegate = function(x, y, more) {
      while(true) {
        if(x < y) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__6805 = y;
            var G__6806 = cljs.core.first.call(null, more);
            var G__6807 = cljs.core.next.call(null, more);
            x = G__6805;
            y = G__6806;
            more = G__6807;
            continue
          }else {
            return y < cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__6804 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6804__delegate.call(this, x, y, more)
    };
    G__6804.cljs$lang$maxFixedArity = 2;
    G__6804.cljs$lang$applyTo = function(arglist__6808) {
      var x = cljs.core.first(arglist__6808);
      var y = cljs.core.first(cljs.core.next(arglist__6808));
      var more = cljs.core.rest(cljs.core.next(arglist__6808));
      return G__6804__delegate(x, y, more)
    };
    G__6804.cljs$lang$arity$variadic = G__6804__delegate;
    return G__6804
  }();
  _LT_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _LT___1.call(this, x);
      case 2:
        return _LT___2.call(this, x, y);
      default:
        return _LT___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _LT_.cljs$lang$maxFixedArity = 2;
  _LT_.cljs$lang$applyTo = _LT___3.cljs$lang$applyTo;
  _LT_.cljs$lang$arity$1 = _LT___1;
  _LT_.cljs$lang$arity$2 = _LT___2;
  _LT_.cljs$lang$arity$variadic = _LT___3.cljs$lang$arity$variadic;
  return _LT_
}();
cljs.core._LT__EQ_ = function() {
  var _LT__EQ_ = null;
  var _LT__EQ___1 = function(x) {
    return true
  };
  var _LT__EQ___2 = function(x, y) {
    return x <= y
  };
  var _LT__EQ___3 = function() {
    var G__6809__delegate = function(x, y, more) {
      while(true) {
        if(x <= y) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__6810 = y;
            var G__6811 = cljs.core.first.call(null, more);
            var G__6812 = cljs.core.next.call(null, more);
            x = G__6810;
            y = G__6811;
            more = G__6812;
            continue
          }else {
            return y <= cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__6809 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6809__delegate.call(this, x, y, more)
    };
    G__6809.cljs$lang$maxFixedArity = 2;
    G__6809.cljs$lang$applyTo = function(arglist__6813) {
      var x = cljs.core.first(arglist__6813);
      var y = cljs.core.first(cljs.core.next(arglist__6813));
      var more = cljs.core.rest(cljs.core.next(arglist__6813));
      return G__6809__delegate(x, y, more)
    };
    G__6809.cljs$lang$arity$variadic = G__6809__delegate;
    return G__6809
  }();
  _LT__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _LT__EQ___1.call(this, x);
      case 2:
        return _LT__EQ___2.call(this, x, y);
      default:
        return _LT__EQ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _LT__EQ_.cljs$lang$maxFixedArity = 2;
  _LT__EQ_.cljs$lang$applyTo = _LT__EQ___3.cljs$lang$applyTo;
  _LT__EQ_.cljs$lang$arity$1 = _LT__EQ___1;
  _LT__EQ_.cljs$lang$arity$2 = _LT__EQ___2;
  _LT__EQ_.cljs$lang$arity$variadic = _LT__EQ___3.cljs$lang$arity$variadic;
  return _LT__EQ_
}();
cljs.core._GT_ = function() {
  var _GT_ = null;
  var _GT___1 = function(x) {
    return true
  };
  var _GT___2 = function(x, y) {
    return x > y
  };
  var _GT___3 = function() {
    var G__6814__delegate = function(x, y, more) {
      while(true) {
        if(x > y) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__6815 = y;
            var G__6816 = cljs.core.first.call(null, more);
            var G__6817 = cljs.core.next.call(null, more);
            x = G__6815;
            y = G__6816;
            more = G__6817;
            continue
          }else {
            return y > cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__6814 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6814__delegate.call(this, x, y, more)
    };
    G__6814.cljs$lang$maxFixedArity = 2;
    G__6814.cljs$lang$applyTo = function(arglist__6818) {
      var x = cljs.core.first(arglist__6818);
      var y = cljs.core.first(cljs.core.next(arglist__6818));
      var more = cljs.core.rest(cljs.core.next(arglist__6818));
      return G__6814__delegate(x, y, more)
    };
    G__6814.cljs$lang$arity$variadic = G__6814__delegate;
    return G__6814
  }();
  _GT_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _GT___1.call(this, x);
      case 2:
        return _GT___2.call(this, x, y);
      default:
        return _GT___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _GT_.cljs$lang$maxFixedArity = 2;
  _GT_.cljs$lang$applyTo = _GT___3.cljs$lang$applyTo;
  _GT_.cljs$lang$arity$1 = _GT___1;
  _GT_.cljs$lang$arity$2 = _GT___2;
  _GT_.cljs$lang$arity$variadic = _GT___3.cljs$lang$arity$variadic;
  return _GT_
}();
cljs.core._GT__EQ_ = function() {
  var _GT__EQ_ = null;
  var _GT__EQ___1 = function(x) {
    return true
  };
  var _GT__EQ___2 = function(x, y) {
    return x >= y
  };
  var _GT__EQ___3 = function() {
    var G__6819__delegate = function(x, y, more) {
      while(true) {
        if(x >= y) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__6820 = y;
            var G__6821 = cljs.core.first.call(null, more);
            var G__6822 = cljs.core.next.call(null, more);
            x = G__6820;
            y = G__6821;
            more = G__6822;
            continue
          }else {
            return y >= cljs.core.first.call(null, more)
          }
        }else {
          return false
        }
        break
      }
    };
    var G__6819 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6819__delegate.call(this, x, y, more)
    };
    G__6819.cljs$lang$maxFixedArity = 2;
    G__6819.cljs$lang$applyTo = function(arglist__6823) {
      var x = cljs.core.first(arglist__6823);
      var y = cljs.core.first(cljs.core.next(arglist__6823));
      var more = cljs.core.rest(cljs.core.next(arglist__6823));
      return G__6819__delegate(x, y, more)
    };
    G__6819.cljs$lang$arity$variadic = G__6819__delegate;
    return G__6819
  }();
  _GT__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _GT__EQ___1.call(this, x);
      case 2:
        return _GT__EQ___2.call(this, x, y);
      default:
        return _GT__EQ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _GT__EQ_.cljs$lang$maxFixedArity = 2;
  _GT__EQ_.cljs$lang$applyTo = _GT__EQ___3.cljs$lang$applyTo;
  _GT__EQ_.cljs$lang$arity$1 = _GT__EQ___1;
  _GT__EQ_.cljs$lang$arity$2 = _GT__EQ___2;
  _GT__EQ_.cljs$lang$arity$variadic = _GT__EQ___3.cljs$lang$arity$variadic;
  return _GT__EQ_
}();
cljs.core.dec = function dec(x) {
  return x - 1
};
cljs.core.max = function() {
  var max = null;
  var max__1 = function(x) {
    return x
  };
  var max__2 = function(x, y) {
    return x > y ? x : y
  };
  var max__3 = function() {
    var G__6824__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, max, x > y ? x : y, more)
    };
    var G__6824 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6824__delegate.call(this, x, y, more)
    };
    G__6824.cljs$lang$maxFixedArity = 2;
    G__6824.cljs$lang$applyTo = function(arglist__6825) {
      var x = cljs.core.first(arglist__6825);
      var y = cljs.core.first(cljs.core.next(arglist__6825));
      var more = cljs.core.rest(cljs.core.next(arglist__6825));
      return G__6824__delegate(x, y, more)
    };
    G__6824.cljs$lang$arity$variadic = G__6824__delegate;
    return G__6824
  }();
  max = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return max__1.call(this, x);
      case 2:
        return max__2.call(this, x, y);
      default:
        return max__3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  max.cljs$lang$maxFixedArity = 2;
  max.cljs$lang$applyTo = max__3.cljs$lang$applyTo;
  max.cljs$lang$arity$1 = max__1;
  max.cljs$lang$arity$2 = max__2;
  max.cljs$lang$arity$variadic = max__3.cljs$lang$arity$variadic;
  return max
}();
cljs.core.min = function() {
  var min = null;
  var min__1 = function(x) {
    return x
  };
  var min__2 = function(x, y) {
    return x < y ? x : y
  };
  var min__3 = function() {
    var G__6826__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, min, x < y ? x : y, more)
    };
    var G__6826 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6826__delegate.call(this, x, y, more)
    };
    G__6826.cljs$lang$maxFixedArity = 2;
    G__6826.cljs$lang$applyTo = function(arglist__6827) {
      var x = cljs.core.first(arglist__6827);
      var y = cljs.core.first(cljs.core.next(arglist__6827));
      var more = cljs.core.rest(cljs.core.next(arglist__6827));
      return G__6826__delegate(x, y, more)
    };
    G__6826.cljs$lang$arity$variadic = G__6826__delegate;
    return G__6826
  }();
  min = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return min__1.call(this, x);
      case 2:
        return min__2.call(this, x, y);
      default:
        return min__3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  min.cljs$lang$maxFixedArity = 2;
  min.cljs$lang$applyTo = min__3.cljs$lang$applyTo;
  min.cljs$lang$arity$1 = min__1;
  min.cljs$lang$arity$2 = min__2;
  min.cljs$lang$arity$variadic = min__3.cljs$lang$arity$variadic;
  return min
}();
cljs.core.fix = function fix(q) {
  if(q >= 0) {
    return Math.floor.call(null, q)
  }else {
    return Math.ceil.call(null, q)
  }
};
cljs.core.int$ = function int$(x) {
  return cljs.core.fix.call(null, x)
};
cljs.core.long$ = function long$(x) {
  return cljs.core.fix.call(null, x)
};
cljs.core.mod = function mod(n, d) {
  return n % d
};
cljs.core.quot = function quot(n, d) {
  var rem__6828 = n % d;
  return cljs.core.fix.call(null, (n - rem__6828) / d)
};
cljs.core.rem = function rem(n, d) {
  var q__6829 = cljs.core.quot.call(null, n, d);
  return n - d * q__6829
};
cljs.core.rand = function() {
  var rand = null;
  var rand__0 = function() {
    return Math.random.call(null)
  };
  var rand__1 = function(n) {
    return n * rand.call(null)
  };
  rand = function(n) {
    switch(arguments.length) {
      case 0:
        return rand__0.call(this);
      case 1:
        return rand__1.call(this, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  rand.cljs$lang$arity$0 = rand__0;
  rand.cljs$lang$arity$1 = rand__1;
  return rand
}();
cljs.core.rand_int = function rand_int(n) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, n))
};
cljs.core.bit_xor = function bit_xor(x, y) {
  return x ^ y
};
cljs.core.bit_and = function bit_and(x, y) {
  return x & y
};
cljs.core.bit_or = function bit_or(x, y) {
  return x | y
};
cljs.core.bit_and_not = function bit_and_not(x, y) {
  return x & ~y
};
cljs.core.bit_clear = function bit_clear(x, n) {
  return x & ~(1 << n)
};
cljs.core.bit_flip = function bit_flip(x, n) {
  return x ^ 1 << n
};
cljs.core.bit_not = function bit_not(x) {
  return~x
};
cljs.core.bit_set = function bit_set(x, n) {
  return x | 1 << n
};
cljs.core.bit_test = function bit_test(x, n) {
  return(x & 1 << n) != 0
};
cljs.core.bit_shift_left = function bit_shift_left(x, n) {
  return x << n
};
cljs.core.bit_shift_right = function bit_shift_right(x, n) {
  return x >> n
};
cljs.core.bit_shift_right_zero_fill = function bit_shift_right_zero_fill(x, n) {
  return x >>> n
};
cljs.core.bit_count = function bit_count(n) {
  var c__6830 = 0;
  var n__6831 = n;
  while(true) {
    if(n__6831 === 0) {
      return c__6830
    }else {
      var G__6832 = c__6830 + 1;
      var G__6833 = n__6831 & n__6831 - 1;
      c__6830 = G__6832;
      n__6831 = G__6833;
      continue
    }
    break
  }
};
cljs.core._EQ__EQ_ = function() {
  var _EQ__EQ_ = null;
  var _EQ__EQ___1 = function(x) {
    return true
  };
  var _EQ__EQ___2 = function(x, y) {
    return cljs.core._equiv.call(null, x, y)
  };
  var _EQ__EQ___3 = function() {
    var G__6834__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ__EQ_.call(null, x, y))) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__6835 = y;
            var G__6836 = cljs.core.first.call(null, more);
            var G__6837 = cljs.core.next.call(null, more);
            x = G__6835;
            y = G__6836;
            more = G__6837;
            continue
          }else {
            return _EQ__EQ_.call(null, y, cljs.core.first.call(null, more))
          }
        }else {
          return false
        }
        break
      }
    };
    var G__6834 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6834__delegate.call(this, x, y, more)
    };
    G__6834.cljs$lang$maxFixedArity = 2;
    G__6834.cljs$lang$applyTo = function(arglist__6838) {
      var x = cljs.core.first(arglist__6838);
      var y = cljs.core.first(cljs.core.next(arglist__6838));
      var more = cljs.core.rest(cljs.core.next(arglist__6838));
      return G__6834__delegate(x, y, more)
    };
    G__6834.cljs$lang$arity$variadic = G__6834__delegate;
    return G__6834
  }();
  _EQ__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _EQ__EQ___1.call(this, x);
      case 2:
        return _EQ__EQ___2.call(this, x, y);
      default:
        return _EQ__EQ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  _EQ__EQ_.cljs$lang$maxFixedArity = 2;
  _EQ__EQ_.cljs$lang$applyTo = _EQ__EQ___3.cljs$lang$applyTo;
  _EQ__EQ_.cljs$lang$arity$1 = _EQ__EQ___1;
  _EQ__EQ_.cljs$lang$arity$2 = _EQ__EQ___2;
  _EQ__EQ_.cljs$lang$arity$variadic = _EQ__EQ___3.cljs$lang$arity$variadic;
  return _EQ__EQ_
}();
cljs.core.pos_QMARK_ = function pos_QMARK_(n) {
  return n > 0
};
cljs.core.zero_QMARK_ = function zero_QMARK_(n) {
  return n === 0
};
cljs.core.neg_QMARK_ = function neg_QMARK_(x) {
  return x < 0
};
cljs.core.nthnext = function nthnext(coll, n) {
  var n__6839 = n;
  var xs__6840 = cljs.core.seq.call(null, coll);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__132__auto____6841 = xs__6840;
      if(cljs.core.truth_(and__132__auto____6841)) {
        return n__6839 > 0
      }else {
        return and__132__auto____6841
      }
    }())) {
      var G__6842 = n__6839 - 1;
      var G__6843 = cljs.core.next.call(null, xs__6840);
      n__6839 = G__6842;
      xs__6840 = G__6843;
      continue
    }else {
      return xs__6840
    }
    break
  }
};
cljs.core.str_STAR_ = function() {
  var str_STAR_ = null;
  var str_STAR___0 = function() {
    return""
  };
  var str_STAR___1 = function(x) {
    if(x == null) {
      return""
    }else {
      if("\ufdd0'else") {
        return x.toString()
      }else {
        return null
      }
    }
  };
  var str_STAR___2 = function() {
    var G__6844__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__6845 = sb.append(str_STAR_.call(null, cljs.core.first.call(null, more)));
            var G__6846 = cljs.core.next.call(null, more);
            sb = G__6845;
            more = G__6846;
            continue
          }else {
            return str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str_STAR_.call(null, x)), ys)
    };
    var G__6844 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__6844__delegate.call(this, x, ys)
    };
    G__6844.cljs$lang$maxFixedArity = 1;
    G__6844.cljs$lang$applyTo = function(arglist__6847) {
      var x = cljs.core.first(arglist__6847);
      var ys = cljs.core.rest(arglist__6847);
      return G__6844__delegate(x, ys)
    };
    G__6844.cljs$lang$arity$variadic = G__6844__delegate;
    return G__6844
  }();
  str_STAR_ = function(x, var_args) {
    var ys = var_args;
    switch(arguments.length) {
      case 0:
        return str_STAR___0.call(this);
      case 1:
        return str_STAR___1.call(this, x);
      default:
        return str_STAR___2.cljs$lang$arity$variadic(x, cljs.core.array_seq(arguments, 1))
    }
    throw"Invalid arity: " + arguments.length;
  };
  str_STAR_.cljs$lang$maxFixedArity = 1;
  str_STAR_.cljs$lang$applyTo = str_STAR___2.cljs$lang$applyTo;
  str_STAR_.cljs$lang$arity$0 = str_STAR___0;
  str_STAR_.cljs$lang$arity$1 = str_STAR___1;
  str_STAR_.cljs$lang$arity$variadic = str_STAR___2.cljs$lang$arity$variadic;
  return str_STAR_
}();
cljs.core.str = function() {
  var str = null;
  var str__0 = function() {
    return""
  };
  var str__1 = function(x) {
    if(cljs.core.symbol_QMARK_.call(null, x)) {
      return x.substring(2, x.length)
    }else {
      if(cljs.core.keyword_QMARK_.call(null, x)) {
        return cljs.core.str_STAR_.call(null, ":", x.substring(2, x.length))
      }else {
        if(x == null) {
          return""
        }else {
          if("\ufdd0'else") {
            return x.toString()
          }else {
            return null
          }
        }
      }
    }
  };
  var str__2 = function() {
    var G__6848__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__6849 = sb.append(str.call(null, cljs.core.first.call(null, more)));
            var G__6850 = cljs.core.next.call(null, more);
            sb = G__6849;
            more = G__6850;
            continue
          }else {
            return cljs.core.str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str.call(null, x)), ys)
    };
    var G__6848 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__6848__delegate.call(this, x, ys)
    };
    G__6848.cljs$lang$maxFixedArity = 1;
    G__6848.cljs$lang$applyTo = function(arglist__6851) {
      var x = cljs.core.first(arglist__6851);
      var ys = cljs.core.rest(arglist__6851);
      return G__6848__delegate(x, ys)
    };
    G__6848.cljs$lang$arity$variadic = G__6848__delegate;
    return G__6848
  }();
  str = function(x, var_args) {
    var ys = var_args;
    switch(arguments.length) {
      case 0:
        return str__0.call(this);
      case 1:
        return str__1.call(this, x);
      default:
        return str__2.cljs$lang$arity$variadic(x, cljs.core.array_seq(arguments, 1))
    }
    throw"Invalid arity: " + arguments.length;
  };
  str.cljs$lang$maxFixedArity = 1;
  str.cljs$lang$applyTo = str__2.cljs$lang$applyTo;
  str.cljs$lang$arity$0 = str__0;
  str.cljs$lang$arity$1 = str__1;
  str.cljs$lang$arity$variadic = str__2.cljs$lang$arity$variadic;
  return str
}();
cljs.core.subs = function() {
  var subs = null;
  var subs__2 = function(s, start) {
    return s.substring(start)
  };
  var subs__3 = function(s, start, end) {
    return s.substring(start, end)
  };
  subs = function(s, start, end) {
    switch(arguments.length) {
      case 2:
        return subs__2.call(this, s, start);
      case 3:
        return subs__3.call(this, s, start, end)
    }
    throw"Invalid arity: " + arguments.length;
  };
  subs.cljs$lang$arity$2 = subs__2;
  subs.cljs$lang$arity$3 = subs__3;
  return subs
}();
cljs.core.symbol = function() {
  var symbol = null;
  var symbol__1 = function(name) {
    if(cljs.core.symbol_QMARK_.call(null, name)) {
      name
    }else {
      if(cljs.core.keyword_QMARK_.call(null, name)) {
        cljs.core.str_STAR_.call(null, "\ufdd1", "'", cljs.core.subs.call(null, name, 2))
      }else {
      }
    }
    return cljs.core.str_STAR_.call(null, "\ufdd1", "'", name)
  };
  var symbol__2 = function(ns, name) {
    return symbol.call(null, cljs.core.str_STAR_.call(null, ns, "/", name))
  };
  symbol = function(ns, name) {
    switch(arguments.length) {
      case 1:
        return symbol__1.call(this, ns);
      case 2:
        return symbol__2.call(this, ns, name)
    }
    throw"Invalid arity: " + arguments.length;
  };
  symbol.cljs$lang$arity$1 = symbol__1;
  symbol.cljs$lang$arity$2 = symbol__2;
  return symbol
}();
cljs.core.keyword = function() {
  var keyword = null;
  var keyword__1 = function(name) {
    if(cljs.core.keyword_QMARK_.call(null, name)) {
      return name
    }else {
      if(cljs.core.symbol_QMARK_.call(null, name)) {
        return cljs.core.str_STAR_.call(null, "\ufdd0", "'", cljs.core.subs.call(null, name, 2))
      }else {
        if("\ufdd0'else") {
          return cljs.core.str_STAR_.call(null, "\ufdd0", "'", name)
        }else {
          return null
        }
      }
    }
  };
  var keyword__2 = function(ns, name) {
    return keyword.call(null, cljs.core.str_STAR_.call(null, ns, "/", name))
  };
  keyword = function(ns, name) {
    switch(arguments.length) {
      case 1:
        return keyword__1.call(this, ns);
      case 2:
        return keyword__2.call(this, ns, name)
    }
    throw"Invalid arity: " + arguments.length;
  };
  keyword.cljs$lang$arity$1 = keyword__1;
  keyword.cljs$lang$arity$2 = keyword__2;
  return keyword
}();
cljs.core.equiv_sequential = function equiv_sequential(x, y) {
  return cljs.core.boolean$.call(null, cljs.core.sequential_QMARK_.call(null, y) ? function() {
    var xs__6852 = cljs.core.seq.call(null, x);
    var ys__6853 = cljs.core.seq.call(null, y);
    while(true) {
      if(xs__6852 == null) {
        return ys__6853 == null
      }else {
        if(ys__6853 == null) {
          return false
        }else {
          if(cljs.core._EQ_.call(null, cljs.core.first.call(null, xs__6852), cljs.core.first.call(null, ys__6853))) {
            var G__6854 = cljs.core.next.call(null, xs__6852);
            var G__6855 = cljs.core.next.call(null, ys__6853);
            xs__6852 = G__6854;
            ys__6853 = G__6855;
            continue
          }else {
            if("\ufdd0'else") {
              return false
            }else {
              return null
            }
          }
        }
      }
      break
    }
  }() : null)
};
cljs.core.hash_combine = function hash_combine(seed, hash) {
  return seed ^ hash + 2654435769 + (seed << 6) + (seed >> 2)
};
cljs.core.hash_coll = function hash_coll(coll) {
  return cljs.core.reduce.call(null, function(p1__6856_SHARP_, p2__6857_SHARP_) {
    return cljs.core.hash_combine.call(null, p1__6856_SHARP_, cljs.core.hash.call(null, p2__6857_SHARP_))
  }, cljs.core.hash.call(null, cljs.core.first.call(null, coll)), cljs.core.next.call(null, coll))
};
void 0;
void 0;
cljs.core.hash_imap = function hash_imap(m) {
  var h__6858 = 0;
  var s__6859 = cljs.core.seq.call(null, m);
  while(true) {
    if(cljs.core.truth_(s__6859)) {
      var e__6860 = cljs.core.first.call(null, s__6859);
      var G__6861 = (h__6858 + (cljs.core.hash.call(null, cljs.core.key.call(null, e__6860)) ^ cljs.core.hash.call(null, cljs.core.val.call(null, e__6860)))) % 4503599627370496;
      var G__6862 = cljs.core.next.call(null, s__6859);
      h__6858 = G__6861;
      s__6859 = G__6862;
      continue
    }else {
      return h__6858
    }
    break
  }
};
cljs.core.hash_iset = function hash_iset(s) {
  var h__6863 = 0;
  var s__6864 = cljs.core.seq.call(null, s);
  while(true) {
    if(cljs.core.truth_(s__6864)) {
      var e__6865 = cljs.core.first.call(null, s__6864);
      var G__6866 = (h__6863 + cljs.core.hash.call(null, e__6865)) % 4503599627370496;
      var G__6867 = cljs.core.next.call(null, s__6864);
      h__6863 = G__6866;
      s__6864 = G__6867;
      continue
    }else {
      return h__6863
    }
    break
  }
};
void 0;
cljs.core.extend_object_BANG_ = function extend_object_BANG_(obj, fn_map) {
  var G__6868__6869 = cljs.core.seq.call(null, fn_map);
  if(cljs.core.truth_(G__6868__6869)) {
    var G__6871__6873 = cljs.core.first.call(null, G__6868__6869);
    var vec__6872__6874 = G__6871__6873;
    var key_name__6875 = cljs.core.nth.call(null, vec__6872__6874, 0, null);
    var f__6876 = cljs.core.nth.call(null, vec__6872__6874, 1, null);
    var G__6868__6877 = G__6868__6869;
    var G__6871__6878 = G__6871__6873;
    var G__6868__6879 = G__6868__6877;
    while(true) {
      var vec__6880__6881 = G__6871__6878;
      var key_name__6882 = cljs.core.nth.call(null, vec__6880__6881, 0, null);
      var f__6883 = cljs.core.nth.call(null, vec__6880__6881, 1, null);
      var G__6868__6884 = G__6868__6879;
      var str_name__6885 = cljs.core.name.call(null, key_name__6882);
      obj[str_name__6885] = f__6883;
      var temp__324__auto____6886 = cljs.core.next.call(null, G__6868__6884);
      if(cljs.core.truth_(temp__324__auto____6886)) {
        var G__6868__6887 = temp__324__auto____6886;
        var G__6888 = cljs.core.first.call(null, G__6868__6887);
        var G__6889 = G__6868__6887;
        G__6871__6878 = G__6888;
        G__6868__6879 = G__6889;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return obj
};
cljs.core.List = function(meta, first, rest, count, __hash) {
  this.meta = meta;
  this.first = first;
  this.rest = rest;
  this.count = count;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32706670
};
cljs.core.List.cljs$lang$type = true;
cljs.core.List.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.List")
};
cljs.core.List.prototype.cljs$core$IHash$ = true;
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__6890 = this;
  var h__2328__auto____6891 = this__6890.__hash;
  if(h__2328__auto____6891 != null) {
    return h__2328__auto____6891
  }else {
    var h__2328__auto____6892 = cljs.core.hash_coll.call(null, coll);
    this__6890.__hash = h__2328__auto____6892;
    return h__2328__auto____6892
  }
};
cljs.core.List.prototype.cljs$core$ISequential$ = true;
cljs.core.List.prototype.cljs$core$ICollection$ = true;
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__6893 = this;
  return new cljs.core.List(this__6893.meta, o, coll, this__6893.count + 1, null)
};
cljs.core.List.prototype.cljs$core$ASeq$ = true;
cljs.core.List.prototype.toString = function() {
  var this__6894 = this;
  var this$__6895 = this;
  return cljs.core.pr_str.call(null, this$__6895)
};
cljs.core.List.prototype.cljs$core$ISeqable$ = true;
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__6896 = this;
  return coll
};
cljs.core.List.prototype.cljs$core$ICounted$ = true;
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__6897 = this;
  return this__6897.count
};
cljs.core.List.prototype.cljs$core$IStack$ = true;
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__6898 = this;
  return this__6898.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__6899 = this;
  return cljs.core._rest.call(null, coll)
};
cljs.core.List.prototype.cljs$core$ISeq$ = true;
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__6900 = this;
  return this__6900.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__6901 = this;
  return this__6901.rest
};
cljs.core.List.prototype.cljs$core$IEquiv$ = true;
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__6902 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.List.prototype.cljs$core$IWithMeta$ = true;
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__6903 = this;
  return new cljs.core.List(meta, this__6903.first, this__6903.rest, this__6903.count, this__6903.__hash)
};
cljs.core.List.prototype.cljs$core$IMeta$ = true;
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__6904 = this;
  return this__6904.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__6905 = this;
  return cljs.core.List.EMPTY
};
cljs.core.List.prototype.cljs$core$IList$ = true;
cljs.core.List;
cljs.core.EmptyList = function(meta) {
  this.meta = meta;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32706638
};
cljs.core.EmptyList.cljs$lang$type = true;
cljs.core.EmptyList.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.EmptyList")
};
cljs.core.EmptyList.prototype.cljs$core$IHash$ = true;
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__6906 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$ISequential$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__6907 = this;
  return new cljs.core.List(this__6907.meta, o, null, 1, null)
};
cljs.core.EmptyList.prototype.toString = function() {
  var this__6908 = this;
  var this$__6909 = this;
  return cljs.core.pr_str.call(null, this$__6909)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__6910 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__6911 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$ = true;
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__6912 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__6913 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__6914 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__6915 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__6916 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__6917 = this;
  return new cljs.core.EmptyList(meta)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__6918 = this;
  return this__6918.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__6919 = this;
  return coll
};
cljs.core.EmptyList.prototype.cljs$core$IList$ = true;
cljs.core.EmptyList;
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function reversible_QMARK_(coll) {
  var G__6920__6921 = coll;
  if(G__6920__6921 != null) {
    if(function() {
      var or__138__auto____6922 = G__6920__6921.cljs$lang$protocol_mask$partition0$ & 67108864;
      if(or__138__auto____6922) {
        return or__138__auto____6922
      }else {
        return G__6920__6921.cljs$core$IReversible$
      }
    }()) {
      return true
    }else {
      if(!G__6920__6921.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReversible, G__6920__6921)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IReversible, G__6920__6921)
  }
};
cljs.core.rseq = function rseq(coll) {
  return cljs.core._rseq.call(null, coll)
};
cljs.core.reverse = function reverse(coll) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, coll)
};
cljs.core.list = function() {
  var list__delegate = function(items) {
    return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, cljs.core.reverse.call(null, items))
  };
  var list = function(var_args) {
    var items = null;
    if(goog.isDef(var_args)) {
      items = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return list__delegate.call(this, items)
  };
  list.cljs$lang$maxFixedArity = 0;
  list.cljs$lang$applyTo = function(arglist__6923) {
    var items = cljs.core.seq(arglist__6923);
    return list__delegate(items)
  };
  list.cljs$lang$arity$variadic = list__delegate;
  return list
}();
cljs.core.Cons = function(meta, first, rest, __hash) {
  this.meta = meta;
  this.first = first;
  this.rest = rest;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32702572
};
cljs.core.Cons.cljs$lang$type = true;
cljs.core.Cons.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.Cons")
};
cljs.core.Cons.prototype.cljs$core$IHash$ = true;
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__6924 = this;
  var h__2328__auto____6925 = this__6924.__hash;
  if(h__2328__auto____6925 != null) {
    return h__2328__auto____6925
  }else {
    var h__2328__auto____6926 = cljs.core.hash_coll.call(null, coll);
    this__6924.__hash = h__2328__auto____6926;
    return h__2328__auto____6926
  }
};
cljs.core.Cons.prototype.cljs$core$ISequential$ = true;
cljs.core.Cons.prototype.cljs$core$ICollection$ = true;
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__6927 = this;
  return new cljs.core.Cons(null, o, coll, this__6927.__hash)
};
cljs.core.Cons.prototype.cljs$core$ASeq$ = true;
cljs.core.Cons.prototype.toString = function() {
  var this__6928 = this;
  var this$__6929 = this;
  return cljs.core.pr_str.call(null, this$__6929)
};
cljs.core.Cons.prototype.cljs$core$ISeqable$ = true;
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__6930 = this;
  return coll
};
cljs.core.Cons.prototype.cljs$core$ISeq$ = true;
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__6931 = this;
  return this__6931.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__6932 = this;
  if(this__6932.rest == null) {
    return cljs.core.List.EMPTY
  }else {
    return this__6932.rest
  }
};
cljs.core.Cons.prototype.cljs$core$IEquiv$ = true;
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__6933 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__6934 = this;
  return new cljs.core.Cons(meta, this__6934.first, this__6934.rest, this__6934.__hash)
};
cljs.core.Cons.prototype.cljs$core$IMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__6935 = this;
  return this__6935.meta
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__6936 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__6936.meta)
};
cljs.core.Cons.prototype.cljs$core$IList$ = true;
cljs.core.Cons;
cljs.core.cons = function cons(x, coll) {
  if(function() {
    var or__138__auto____6937 = coll == null;
    if(or__138__auto____6937) {
      return or__138__auto____6937
    }else {
      var G__6938__6939 = coll;
      if(G__6938__6939 != null) {
        if(function() {
          var or__138__auto____6940 = G__6938__6939.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__138__auto____6940) {
            return or__138__auto____6940
          }else {
            return G__6938__6939.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__6938__6939.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6938__6939)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6938__6939)
      }
    }
  }()) {
    return new cljs.core.Cons(null, x, coll, null)
  }else {
    return new cljs.core.Cons(null, x, cljs.core.seq.call(null, coll), null)
  }
};
cljs.core.list_QMARK_ = function list_QMARK_(x) {
  var G__6941__6942 = x;
  if(G__6941__6942 != null) {
    if(function() {
      var or__138__auto____6943 = G__6941__6942.cljs$lang$protocol_mask$partition0$ & 16777216;
      if(or__138__auto____6943) {
        return or__138__auto____6943
      }else {
        return G__6941__6942.cljs$core$IList$
      }
    }()) {
      return true
    }else {
      if(!G__6941__6942.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IList, G__6941__6942)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IList, G__6941__6942)
  }
};
cljs.core.IReduce["string"] = true;
cljs.core._reduce["string"] = function() {
  var G__6944 = null;
  var G__6944__2 = function(string, f) {
    return cljs.core.ci_reduce.call(null, string, f)
  };
  var G__6944__3 = function(string, f, start) {
    return cljs.core.ci_reduce.call(null, string, f, start)
  };
  G__6944 = function(string, f, start) {
    switch(arguments.length) {
      case 2:
        return G__6944__2.call(this, string, f);
      case 3:
        return G__6944__3.call(this, string, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6944
}();
cljs.core.ILookup["string"] = true;
cljs.core._lookup["string"] = function() {
  var G__6945 = null;
  var G__6945__2 = function(string, k) {
    return cljs.core._nth.call(null, string, k)
  };
  var G__6945__3 = function(string, k, not_found) {
    return cljs.core._nth.call(null, string, k, not_found)
  };
  G__6945 = function(string, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6945__2.call(this, string, k);
      case 3:
        return G__6945__3.call(this, string, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6945
}();
cljs.core.IIndexed["string"] = true;
cljs.core._nth["string"] = function() {
  var G__6946 = null;
  var G__6946__2 = function(string, n) {
    if(n < cljs.core._count.call(null, string)) {
      return string.charAt(n)
    }else {
      return null
    }
  };
  var G__6946__3 = function(string, n, not_found) {
    if(n < cljs.core._count.call(null, string)) {
      return string.charAt(n)
    }else {
      return not_found
    }
  };
  G__6946 = function(string, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6946__2.call(this, string, n);
      case 3:
        return G__6946__3.call(this, string, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6946
}();
cljs.core.ICounted["string"] = true;
cljs.core._count["string"] = function(s) {
  return s.length
};
cljs.core.ISeqable["string"] = true;
cljs.core._seq["string"] = function(string) {
  return cljs.core.prim_seq.call(null, string, 0)
};
cljs.core.IHash["string"] = true;
cljs.core._hash["string"] = function(o) {
  return goog.string.hashCode.call(null, o)
};
String.prototype.cljs$core$IFn$ = true;
String.prototype.call = function() {
  var G__6955 = null;
  var G__6955__2 = function(tsym6949, coll) {
    var tsym6949__6951 = this;
    var this$__6952 = tsym6949__6951;
    return cljs.core.get.call(null, coll, this$__6952.toString())
  };
  var G__6955__3 = function(tsym6950, coll, not_found) {
    var tsym6950__6953 = this;
    var this$__6954 = tsym6950__6953;
    return cljs.core.get.call(null, coll, this$__6954.toString(), not_found)
  };
  G__6955 = function(tsym6950, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6955__2.call(this, tsym6950, coll);
      case 3:
        return G__6955__3.call(this, tsym6950, coll, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6955
}();
String.prototype.apply = function(tsym6947, args6948) {
  return tsym6947.call.apply(tsym6947, [tsym6947].concat(cljs.core.aclone.call(null, args6948)))
};
String["prototype"]["apply"] = function(s, args) {
  if(cljs.core.count.call(null, args) < 2) {
    return cljs.core.get.call(null, args[0], s)
  }else {
    return cljs.core.get.call(null, args[0], s, args[1])
  }
};
cljs.core.lazy_seq_value = function lazy_seq_value(lazy_seq) {
  var x__6956 = lazy_seq.x;
  if(cljs.core.truth_(lazy_seq.realized)) {
    return x__6956
  }else {
    lazy_seq.x = x__6956.call(null);
    lazy_seq.realized = true;
    return lazy_seq.x
  }
};
cljs.core.LazySeq = function(meta, realized, x, __hash) {
  this.meta = meta;
  this.realized = realized;
  this.x = x;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 15925324
};
cljs.core.LazySeq.cljs$lang$type = true;
cljs.core.LazySeq.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.LazySeq")
};
cljs.core.LazySeq.prototype.cljs$core$IHash$ = true;
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__6957 = this;
  var h__2328__auto____6958 = this__6957.__hash;
  if(h__2328__auto____6958 != null) {
    return h__2328__auto____6958
  }else {
    var h__2328__auto____6959 = cljs.core.hash_coll.call(null, coll);
    this__6957.__hash = h__2328__auto____6959;
    return h__2328__auto____6959
  }
};
cljs.core.LazySeq.prototype.cljs$core$ISequential$ = true;
cljs.core.LazySeq.prototype.cljs$core$ICollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__6960 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.LazySeq.prototype.toString = function() {
  var this__6961 = this;
  var this$__6962 = this;
  return cljs.core.pr_str.call(null, this$__6962)
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__6963 = this;
  return cljs.core.seq.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__6964 = this;
  return cljs.core.first.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__6965 = this;
  return cljs.core.rest.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__6966 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__6967 = this;
  return new cljs.core.LazySeq(meta, this__6967.realized, this__6967.x, this__6967.__hash)
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__6968 = this;
  return this__6968.meta
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__6969 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__6969.meta)
};
cljs.core.LazySeq;
cljs.core.to_array = function to_array(s) {
  var ary__6970 = [];
  var s__6971 = s;
  while(true) {
    if(cljs.core.truth_(cljs.core.seq.call(null, s__6971))) {
      ary__6970.push(cljs.core.first.call(null, s__6971));
      var G__6972 = cljs.core.next.call(null, s__6971);
      s__6971 = G__6972;
      continue
    }else {
      return ary__6970
    }
    break
  }
};
cljs.core.to_array_2d = function to_array_2d(coll) {
  var ret__6973 = cljs.core.make_array.call(null, cljs.core.count.call(null, coll));
  var i__6974 = 0;
  var xs__6975 = cljs.core.seq.call(null, coll);
  while(true) {
    if(cljs.core.truth_(xs__6975)) {
      ret__6973[i__6974] = cljs.core.to_array.call(null, cljs.core.first.call(null, xs__6975));
      var G__6976 = i__6974 + 1;
      var G__6977 = cljs.core.next.call(null, xs__6975);
      i__6974 = G__6976;
      xs__6975 = G__6977;
      continue
    }else {
    }
    break
  }
  return ret__6973
};
cljs.core.long_array = function() {
  var long_array = null;
  var long_array__1 = function(size_or_seq) {
    if(cljs.core.number_QMARK_.call(null, size_or_seq)) {
      return long_array.call(null, size_or_seq, null)
    }else {
      if(cljs.core.seq_QMARK_.call(null, size_or_seq)) {
        return cljs.core.into_array.call(null, size_or_seq)
      }else {
        if("\ufdd0'else") {
          throw new Error("long-array called with something other than size or ISeq");
        }else {
          return null
        }
      }
    }
  };
  var long_array__2 = function(size, init_val_or_seq) {
    var a__6978 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__6979 = cljs.core.seq.call(null, init_val_or_seq);
      var i__6980 = 0;
      var s__6981 = s__6979;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__132__auto____6982 = s__6981;
          if(cljs.core.truth_(and__132__auto____6982)) {
            return i__6980 < size
          }else {
            return and__132__auto____6982
          }
        }())) {
          a__6978[i__6980] = cljs.core.first.call(null, s__6981);
          var G__6985 = i__6980 + 1;
          var G__6986 = cljs.core.next.call(null, s__6981);
          i__6980 = G__6985;
          s__6981 = G__6986;
          continue
        }else {
          return a__6978
        }
        break
      }
    }else {
      var n__2649__auto____6983 = size;
      var i__6984 = 0;
      while(true) {
        if(i__6984 < n__2649__auto____6983) {
          a__6978[i__6984] = init_val_or_seq;
          var G__6987 = i__6984 + 1;
          i__6984 = G__6987;
          continue
        }else {
        }
        break
      }
      return a__6978
    }
  };
  long_array = function(size, init_val_or_seq) {
    switch(arguments.length) {
      case 1:
        return long_array__1.call(this, size);
      case 2:
        return long_array__2.call(this, size, init_val_or_seq)
    }
    throw"Invalid arity: " + arguments.length;
  };
  long_array.cljs$lang$arity$1 = long_array__1;
  long_array.cljs$lang$arity$2 = long_array__2;
  return long_array
}();
cljs.core.double_array = function() {
  var double_array = null;
  var double_array__1 = function(size_or_seq) {
    if(cljs.core.number_QMARK_.call(null, size_or_seq)) {
      return double_array.call(null, size_or_seq, null)
    }else {
      if(cljs.core.seq_QMARK_.call(null, size_or_seq)) {
        return cljs.core.into_array.call(null, size_or_seq)
      }else {
        if("\ufdd0'else") {
          throw new Error("double-array called with something other than size or ISeq");
        }else {
          return null
        }
      }
    }
  };
  var double_array__2 = function(size, init_val_or_seq) {
    var a__6988 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__6989 = cljs.core.seq.call(null, init_val_or_seq);
      var i__6990 = 0;
      var s__6991 = s__6989;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__132__auto____6992 = s__6991;
          if(cljs.core.truth_(and__132__auto____6992)) {
            return i__6990 < size
          }else {
            return and__132__auto____6992
          }
        }())) {
          a__6988[i__6990] = cljs.core.first.call(null, s__6991);
          var G__6995 = i__6990 + 1;
          var G__6996 = cljs.core.next.call(null, s__6991);
          i__6990 = G__6995;
          s__6991 = G__6996;
          continue
        }else {
          return a__6988
        }
        break
      }
    }else {
      var n__2649__auto____6993 = size;
      var i__6994 = 0;
      while(true) {
        if(i__6994 < n__2649__auto____6993) {
          a__6988[i__6994] = init_val_or_seq;
          var G__6997 = i__6994 + 1;
          i__6994 = G__6997;
          continue
        }else {
        }
        break
      }
      return a__6988
    }
  };
  double_array = function(size, init_val_or_seq) {
    switch(arguments.length) {
      case 1:
        return double_array__1.call(this, size);
      case 2:
        return double_array__2.call(this, size, init_val_or_seq)
    }
    throw"Invalid arity: " + arguments.length;
  };
  double_array.cljs$lang$arity$1 = double_array__1;
  double_array.cljs$lang$arity$2 = double_array__2;
  return double_array
}();
cljs.core.object_array = function() {
  var object_array = null;
  var object_array__1 = function(size_or_seq) {
    if(cljs.core.number_QMARK_.call(null, size_or_seq)) {
      return object_array.call(null, size_or_seq, null)
    }else {
      if(cljs.core.seq_QMARK_.call(null, size_or_seq)) {
        return cljs.core.into_array.call(null, size_or_seq)
      }else {
        if("\ufdd0'else") {
          throw new Error("object-array called with something other than size or ISeq");
        }else {
          return null
        }
      }
    }
  };
  var object_array__2 = function(size, init_val_or_seq) {
    var a__6998 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__6999 = cljs.core.seq.call(null, init_val_or_seq);
      var i__7000 = 0;
      var s__7001 = s__6999;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__132__auto____7002 = s__7001;
          if(cljs.core.truth_(and__132__auto____7002)) {
            return i__7000 < size
          }else {
            return and__132__auto____7002
          }
        }())) {
          a__6998[i__7000] = cljs.core.first.call(null, s__7001);
          var G__7005 = i__7000 + 1;
          var G__7006 = cljs.core.next.call(null, s__7001);
          i__7000 = G__7005;
          s__7001 = G__7006;
          continue
        }else {
          return a__6998
        }
        break
      }
    }else {
      var n__2649__auto____7003 = size;
      var i__7004 = 0;
      while(true) {
        if(i__7004 < n__2649__auto____7003) {
          a__6998[i__7004] = init_val_or_seq;
          var G__7007 = i__7004 + 1;
          i__7004 = G__7007;
          continue
        }else {
        }
        break
      }
      return a__6998
    }
  };
  object_array = function(size, init_val_or_seq) {
    switch(arguments.length) {
      case 1:
        return object_array__1.call(this, size);
      case 2:
        return object_array__2.call(this, size, init_val_or_seq)
    }
    throw"Invalid arity: " + arguments.length;
  };
  object_array.cljs$lang$arity$1 = object_array__1;
  object_array.cljs$lang$arity$2 = object_array__2;
  return object_array
}();
cljs.core.bounded_count = function bounded_count(s, n) {
  if(cljs.core.counted_QMARK_.call(null, s)) {
    return cljs.core.count.call(null, s)
  }else {
    var s__7008 = s;
    var i__7009 = n;
    var sum__7010 = 0;
    while(true) {
      if(cljs.core.truth_(function() {
        var and__132__auto____7011 = i__7009 > 0;
        if(and__132__auto____7011) {
          return cljs.core.seq.call(null, s__7008)
        }else {
          return and__132__auto____7011
        }
      }())) {
        var G__7012 = cljs.core.next.call(null, s__7008);
        var G__7013 = i__7009 - 1;
        var G__7014 = sum__7010 + 1;
        s__7008 = G__7012;
        i__7009 = G__7013;
        sum__7010 = G__7014;
        continue
      }else {
        return sum__7010
      }
      break
    }
  }
};
cljs.core.spread = function spread(arglist) {
  if(arglist == null) {
    return null
  }else {
    if(cljs.core.next.call(null, arglist) == null) {
      return cljs.core.seq.call(null, cljs.core.first.call(null, arglist))
    }else {
      if("\ufdd0'else") {
        return cljs.core.cons.call(null, cljs.core.first.call(null, arglist), spread.call(null, cljs.core.next.call(null, arglist)))
      }else {
        return null
      }
    }
  }
};
cljs.core.concat = function() {
  var concat = null;
  var concat__0 = function() {
    return new cljs.core.LazySeq(null, false, function() {
      return null
    })
  };
  var concat__1 = function(x) {
    return new cljs.core.LazySeq(null, false, function() {
      return x
    })
  };
  var concat__2 = function(x, y) {
    return new cljs.core.LazySeq(null, false, function() {
      var s__7015 = cljs.core.seq.call(null, x);
      if(cljs.core.truth_(s__7015)) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__7015), concat.call(null, cljs.core.rest.call(null, s__7015), y))
      }else {
        return y
      }
    })
  };
  var concat__3 = function() {
    var G__7018__delegate = function(x, y, zs) {
      var cat__7017 = function cat(xys, zs) {
        return new cljs.core.LazySeq(null, false, function() {
          var xys__7016 = cljs.core.seq.call(null, xys);
          if(cljs.core.truth_(xys__7016)) {
            return cljs.core.cons.call(null, cljs.core.first.call(null, xys__7016), cat.call(null, cljs.core.rest.call(null, xys__7016), zs))
          }else {
            if(cljs.core.truth_(zs)) {
              return cat.call(null, cljs.core.first.call(null, zs), cljs.core.next.call(null, zs))
            }else {
              return null
            }
          }
        })
      };
      return cat__7017.call(null, concat.call(null, x, y), zs)
    };
    var G__7018 = function(x, y, var_args) {
      var zs = null;
      if(goog.isDef(var_args)) {
        zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7018__delegate.call(this, x, y, zs)
    };
    G__7018.cljs$lang$maxFixedArity = 2;
    G__7018.cljs$lang$applyTo = function(arglist__7019) {
      var x = cljs.core.first(arglist__7019);
      var y = cljs.core.first(cljs.core.next(arglist__7019));
      var zs = cljs.core.rest(cljs.core.next(arglist__7019));
      return G__7018__delegate(x, y, zs)
    };
    G__7018.cljs$lang$arity$variadic = G__7018__delegate;
    return G__7018
  }();
  concat = function(x, y, var_args) {
    var zs = var_args;
    switch(arguments.length) {
      case 0:
        return concat__0.call(this);
      case 1:
        return concat__1.call(this, x);
      case 2:
        return concat__2.call(this, x, y);
      default:
        return concat__3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  concat.cljs$lang$maxFixedArity = 2;
  concat.cljs$lang$applyTo = concat__3.cljs$lang$applyTo;
  concat.cljs$lang$arity$0 = concat__0;
  concat.cljs$lang$arity$1 = concat__1;
  concat.cljs$lang$arity$2 = concat__2;
  concat.cljs$lang$arity$variadic = concat__3.cljs$lang$arity$variadic;
  return concat
}();
cljs.core.list_STAR_ = function() {
  var list_STAR_ = null;
  var list_STAR___1 = function(args) {
    return cljs.core.seq.call(null, args)
  };
  var list_STAR___2 = function(a, args) {
    return cljs.core.cons.call(null, a, args)
  };
  var list_STAR___3 = function(a, b, args) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, args))
  };
  var list_STAR___4 = function(a, b, c, args) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, args)))
  };
  var list_STAR___5 = function() {
    var G__7020__delegate = function(a, b, c, d, more) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, more)))))
    };
    var G__7020 = function(a, b, c, d, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__7020__delegate.call(this, a, b, c, d, more)
    };
    G__7020.cljs$lang$maxFixedArity = 4;
    G__7020.cljs$lang$applyTo = function(arglist__7021) {
      var a = cljs.core.first(arglist__7021);
      var b = cljs.core.first(cljs.core.next(arglist__7021));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7021)));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7021))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7021))));
      return G__7020__delegate(a, b, c, d, more)
    };
    G__7020.cljs$lang$arity$variadic = G__7020__delegate;
    return G__7020
  }();
  list_STAR_ = function(a, b, c, d, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return list_STAR___1.call(this, a);
      case 2:
        return list_STAR___2.call(this, a, b);
      case 3:
        return list_STAR___3.call(this, a, b, c);
      case 4:
        return list_STAR___4.call(this, a, b, c, d);
      default:
        return list_STAR___5.cljs$lang$arity$variadic(a, b, c, d, cljs.core.array_seq(arguments, 4))
    }
    throw"Invalid arity: " + arguments.length;
  };
  list_STAR_.cljs$lang$maxFixedArity = 4;
  list_STAR_.cljs$lang$applyTo = list_STAR___5.cljs$lang$applyTo;
  list_STAR_.cljs$lang$arity$1 = list_STAR___1;
  list_STAR_.cljs$lang$arity$2 = list_STAR___2;
  list_STAR_.cljs$lang$arity$3 = list_STAR___3;
  list_STAR_.cljs$lang$arity$4 = list_STAR___4;
  list_STAR_.cljs$lang$arity$variadic = list_STAR___5.cljs$lang$arity$variadic;
  return list_STAR_
}();
cljs.core.transient$ = function transient$(coll) {
  return cljs.core._as_transient.call(null, coll)
};
cljs.core.persistent_BANG_ = function persistent_BANG_(tcoll) {
  return cljs.core._persistent_BANG_.call(null, tcoll)
};
cljs.core.conj_BANG_ = function conj_BANG_(tcoll, val) {
  return cljs.core._conj_BANG_.call(null, tcoll, val)
};
cljs.core.assoc_BANG_ = function assoc_BANG_(tcoll, key, val) {
  return cljs.core._assoc_BANG_.call(null, tcoll, key, val)
};
cljs.core.dissoc_BANG_ = function dissoc_BANG_(tcoll, key) {
  return cljs.core._dissoc_BANG_.call(null, tcoll, key)
};
cljs.core.pop_BANG_ = function pop_BANG_(tcoll) {
  return cljs.core._pop_BANG_.call(null, tcoll)
};
cljs.core.disj_BANG_ = function disj_BANG_(tcoll, val) {
  return cljs.core._disjoin_BANG_.call(null, tcoll, val)
};
void 0;
cljs.core.apply_to = function apply_to(f, argc, args) {
  var args__7022 = cljs.core.seq.call(null, args);
  if(argc === 0) {
    return f.call(null)
  }else {
    var a__7023 = cljs.core._first.call(null, args__7022);
    var args__7024 = cljs.core._rest.call(null, args__7022);
    if(argc === 1) {
      if(f.cljs$lang$arity$1) {
        return f.cljs$lang$arity$1(a__7023)
      }else {
        return f.call(null, a__7023)
      }
    }else {
      var b__7025 = cljs.core._first.call(null, args__7024);
      var args__7026 = cljs.core._rest.call(null, args__7024);
      if(argc === 2) {
        if(f.cljs$lang$arity$2) {
          return f.cljs$lang$arity$2(a__7023, b__7025)
        }else {
          return f.call(null, a__7023, b__7025)
        }
      }else {
        var c__7027 = cljs.core._first.call(null, args__7026);
        var args__7028 = cljs.core._rest.call(null, args__7026);
        if(argc === 3) {
          if(f.cljs$lang$arity$3) {
            return f.cljs$lang$arity$3(a__7023, b__7025, c__7027)
          }else {
            return f.call(null, a__7023, b__7025, c__7027)
          }
        }else {
          var d__7029 = cljs.core._first.call(null, args__7028);
          var args__7030 = cljs.core._rest.call(null, args__7028);
          if(argc === 4) {
            if(f.cljs$lang$arity$4) {
              return f.cljs$lang$arity$4(a__7023, b__7025, c__7027, d__7029)
            }else {
              return f.call(null, a__7023, b__7025, c__7027, d__7029)
            }
          }else {
            var e__7031 = cljs.core._first.call(null, args__7030);
            var args__7032 = cljs.core._rest.call(null, args__7030);
            if(argc === 5) {
              if(f.cljs$lang$arity$5) {
                return f.cljs$lang$arity$5(a__7023, b__7025, c__7027, d__7029, e__7031)
              }else {
                return f.call(null, a__7023, b__7025, c__7027, d__7029, e__7031)
              }
            }else {
              var f__7033 = cljs.core._first.call(null, args__7032);
              var args__7034 = cljs.core._rest.call(null, args__7032);
              if(argc === 6) {
                if(f__7033.cljs$lang$arity$6) {
                  return f__7033.cljs$lang$arity$6(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033)
                }else {
                  return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033)
                }
              }else {
                var g__7035 = cljs.core._first.call(null, args__7034);
                var args__7036 = cljs.core._rest.call(null, args__7034);
                if(argc === 7) {
                  if(f__7033.cljs$lang$arity$7) {
                    return f__7033.cljs$lang$arity$7(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035)
                  }else {
                    return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035)
                  }
                }else {
                  var h__7037 = cljs.core._first.call(null, args__7036);
                  var args__7038 = cljs.core._rest.call(null, args__7036);
                  if(argc === 8) {
                    if(f__7033.cljs$lang$arity$8) {
                      return f__7033.cljs$lang$arity$8(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037)
                    }else {
                      return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037)
                    }
                  }else {
                    var i__7039 = cljs.core._first.call(null, args__7038);
                    var args__7040 = cljs.core._rest.call(null, args__7038);
                    if(argc === 9) {
                      if(f__7033.cljs$lang$arity$9) {
                        return f__7033.cljs$lang$arity$9(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039)
                      }else {
                        return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039)
                      }
                    }else {
                      var j__7041 = cljs.core._first.call(null, args__7040);
                      var args__7042 = cljs.core._rest.call(null, args__7040);
                      if(argc === 10) {
                        if(f__7033.cljs$lang$arity$10) {
                          return f__7033.cljs$lang$arity$10(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041)
                        }else {
                          return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041)
                        }
                      }else {
                        var k__7043 = cljs.core._first.call(null, args__7042);
                        var args__7044 = cljs.core._rest.call(null, args__7042);
                        if(argc === 11) {
                          if(f__7033.cljs$lang$arity$11) {
                            return f__7033.cljs$lang$arity$11(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043)
                          }else {
                            return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043)
                          }
                        }else {
                          var l__7045 = cljs.core._first.call(null, args__7044);
                          var args__7046 = cljs.core._rest.call(null, args__7044);
                          if(argc === 12) {
                            if(f__7033.cljs$lang$arity$12) {
                              return f__7033.cljs$lang$arity$12(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045)
                            }else {
                              return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045)
                            }
                          }else {
                            var m__7047 = cljs.core._first.call(null, args__7046);
                            var args__7048 = cljs.core._rest.call(null, args__7046);
                            if(argc === 13) {
                              if(f__7033.cljs$lang$arity$13) {
                                return f__7033.cljs$lang$arity$13(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047)
                              }else {
                                return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047)
                              }
                            }else {
                              var n__7049 = cljs.core._first.call(null, args__7048);
                              var args__7050 = cljs.core._rest.call(null, args__7048);
                              if(argc === 14) {
                                if(f__7033.cljs$lang$arity$14) {
                                  return f__7033.cljs$lang$arity$14(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049)
                                }else {
                                  return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049)
                                }
                              }else {
                                var o__7051 = cljs.core._first.call(null, args__7050);
                                var args__7052 = cljs.core._rest.call(null, args__7050);
                                if(argc === 15) {
                                  if(f__7033.cljs$lang$arity$15) {
                                    return f__7033.cljs$lang$arity$15(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051)
                                  }else {
                                    return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051)
                                  }
                                }else {
                                  var p__7053 = cljs.core._first.call(null, args__7052);
                                  var args__7054 = cljs.core._rest.call(null, args__7052);
                                  if(argc === 16) {
                                    if(f__7033.cljs$lang$arity$16) {
                                      return f__7033.cljs$lang$arity$16(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051, p__7053)
                                    }else {
                                      return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051, p__7053)
                                    }
                                  }else {
                                    var q__7055 = cljs.core._first.call(null, args__7054);
                                    var args__7056 = cljs.core._rest.call(null, args__7054);
                                    if(argc === 17) {
                                      if(f__7033.cljs$lang$arity$17) {
                                        return f__7033.cljs$lang$arity$17(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051, p__7053, q__7055)
                                      }else {
                                        return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051, p__7053, q__7055)
                                      }
                                    }else {
                                      var r__7057 = cljs.core._first.call(null, args__7056);
                                      var args__7058 = cljs.core._rest.call(null, args__7056);
                                      if(argc === 18) {
                                        if(f__7033.cljs$lang$arity$18) {
                                          return f__7033.cljs$lang$arity$18(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051, p__7053, q__7055, r__7057)
                                        }else {
                                          return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051, p__7053, q__7055, r__7057)
                                        }
                                      }else {
                                        var s__7059 = cljs.core._first.call(null, args__7058);
                                        var args__7060 = cljs.core._rest.call(null, args__7058);
                                        if(argc === 19) {
                                          if(f__7033.cljs$lang$arity$19) {
                                            return f__7033.cljs$lang$arity$19(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051, p__7053, q__7055, r__7057, s__7059)
                                          }else {
                                            return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051, p__7053, q__7055, r__7057, s__7059)
                                          }
                                        }else {
                                          var t__7061 = cljs.core._first.call(null, args__7060);
                                          var args__7062 = cljs.core._rest.call(null, args__7060);
                                          if(argc === 20) {
                                            if(f__7033.cljs$lang$arity$20) {
                                              return f__7033.cljs$lang$arity$20(a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051, p__7053, q__7055, r__7057, s__7059, t__7061)
                                            }else {
                                              return f__7033.call(null, a__7023, b__7025, c__7027, d__7029, e__7031, f__7033, g__7035, h__7037, i__7039, j__7041, k__7043, l__7045, m__7047, n__7049, o__7051, p__7053, q__7055, r__7057, s__7059, t__7061)
                                            }
                                          }else {
                                            throw new Error("Only up to 20 arguments supported on functions");
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
void 0;
cljs.core.apply = function() {
  var apply = null;
  var apply__2 = function(f, args) {
    var fixed_arity__7063 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      var bc__7064 = cljs.core.bounded_count.call(null, args, fixed_arity__7063 + 1);
      if(bc__7064 <= fixed_arity__7063) {
        return cljs.core.apply_to.call(null, f, bc__7064, args)
      }else {
        return f.cljs$lang$applyTo(args)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, args))
    }
  };
  var apply__3 = function(f, x, args) {
    var arglist__7065 = cljs.core.list_STAR_.call(null, x, args);
    var fixed_arity__7066 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      var bc__7067 = cljs.core.bounded_count.call(null, arglist__7065, fixed_arity__7066 + 1);
      if(bc__7067 <= fixed_arity__7066) {
        return cljs.core.apply_to.call(null, f, bc__7067, arglist__7065)
      }else {
        return f.cljs$lang$applyTo(arglist__7065)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__7065))
    }
  };
  var apply__4 = function(f, x, y, args) {
    var arglist__7068 = cljs.core.list_STAR_.call(null, x, y, args);
    var fixed_arity__7069 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      var bc__7070 = cljs.core.bounded_count.call(null, arglist__7068, fixed_arity__7069 + 1);
      if(bc__7070 <= fixed_arity__7069) {
        return cljs.core.apply_to.call(null, f, bc__7070, arglist__7068)
      }else {
        return f.cljs$lang$applyTo(arglist__7068)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__7068))
    }
  };
  var apply__5 = function(f, x, y, z, args) {
    var arglist__7071 = cljs.core.list_STAR_.call(null, x, y, z, args);
    var fixed_arity__7072 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      var bc__7073 = cljs.core.bounded_count.call(null, arglist__7071, fixed_arity__7072 + 1);
      if(bc__7073 <= fixed_arity__7072) {
        return cljs.core.apply_to.call(null, f, bc__7073, arglist__7071)
      }else {
        return f.cljs$lang$applyTo(arglist__7071)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__7071))
    }
  };
  var apply__6 = function() {
    var G__7077__delegate = function(f, a, b, c, d, args) {
      var arglist__7074 = cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, args)))));
      var fixed_arity__7075 = f.cljs$lang$maxFixedArity;
      if(cljs.core.truth_(f.cljs$lang$applyTo)) {
        var bc__7076 = cljs.core.bounded_count.call(null, arglist__7074, fixed_arity__7075 + 1);
        if(bc__7076 <= fixed_arity__7075) {
          return cljs.core.apply_to.call(null, f, bc__7076, arglist__7074)
        }else {
          return f.cljs$lang$applyTo(arglist__7074)
        }
      }else {
        return f.apply(f, cljs.core.to_array.call(null, arglist__7074))
      }
    };
    var G__7077 = function(f, a, b, c, d, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__7077__delegate.call(this, f, a, b, c, d, args)
    };
    G__7077.cljs$lang$maxFixedArity = 5;
    G__7077.cljs$lang$applyTo = function(arglist__7078) {
      var f = cljs.core.first(arglist__7078);
      var a = cljs.core.first(cljs.core.next(arglist__7078));
      var b = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7078)));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7078))));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7078)))));
      var args = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7078)))));
      return G__7077__delegate(f, a, b, c, d, args)
    };
    G__7077.cljs$lang$arity$variadic = G__7077__delegate;
    return G__7077
  }();
  apply = function(f, a, b, c, d, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 2:
        return apply__2.call(this, f, a);
      case 3:
        return apply__3.call(this, f, a, b);
      case 4:
        return apply__4.call(this, f, a, b, c);
      case 5:
        return apply__5.call(this, f, a, b, c, d);
      default:
        return apply__6.cljs$lang$arity$variadic(f, a, b, c, d, cljs.core.array_seq(arguments, 5))
    }
    throw"Invalid arity: " + arguments.length;
  };
  apply.cljs$lang$maxFixedArity = 5;
  apply.cljs$lang$applyTo = apply__6.cljs$lang$applyTo;
  apply.cljs$lang$arity$2 = apply__2;
  apply.cljs$lang$arity$3 = apply__3;
  apply.cljs$lang$arity$4 = apply__4;
  apply.cljs$lang$arity$5 = apply__5;
  apply.cljs$lang$arity$variadic = apply__6.cljs$lang$arity$variadic;
  return apply
}();
cljs.core.vary_meta = function() {
  var vary_meta__delegate = function(obj, f, args) {
    return cljs.core.with_meta.call(null, obj, cljs.core.apply.call(null, f, cljs.core.meta.call(null, obj), args))
  };
  var vary_meta = function(obj, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return vary_meta__delegate.call(this, obj, f, args)
  };
  vary_meta.cljs$lang$maxFixedArity = 2;
  vary_meta.cljs$lang$applyTo = function(arglist__7079) {
    var obj = cljs.core.first(arglist__7079);
    var f = cljs.core.first(cljs.core.next(arglist__7079));
    var args = cljs.core.rest(cljs.core.next(arglist__7079));
    return vary_meta__delegate(obj, f, args)
  };
  vary_meta.cljs$lang$arity$variadic = vary_meta__delegate;
  return vary_meta
}();
cljs.core.not_EQ_ = function() {
  var not_EQ_ = null;
  var not_EQ___1 = function(x) {
    return false
  };
  var not_EQ___2 = function(x, y) {
    return cljs.core.not.call(null, cljs.core._EQ_.call(null, x, y))
  };
  var not_EQ___3 = function() {
    var G__7080__delegate = function(x, y, more) {
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, x, y, more))
    };
    var G__7080 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7080__delegate.call(this, x, y, more)
    };
    G__7080.cljs$lang$maxFixedArity = 2;
    G__7080.cljs$lang$applyTo = function(arglist__7081) {
      var x = cljs.core.first(arglist__7081);
      var y = cljs.core.first(cljs.core.next(arglist__7081));
      var more = cljs.core.rest(cljs.core.next(arglist__7081));
      return G__7080__delegate(x, y, more)
    };
    G__7080.cljs$lang$arity$variadic = G__7080__delegate;
    return G__7080
  }();
  not_EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return not_EQ___1.call(this, x);
      case 2:
        return not_EQ___2.call(this, x, y);
      default:
        return not_EQ___3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  not_EQ_.cljs$lang$maxFixedArity = 2;
  not_EQ_.cljs$lang$applyTo = not_EQ___3.cljs$lang$applyTo;
  not_EQ_.cljs$lang$arity$1 = not_EQ___1;
  not_EQ_.cljs$lang$arity$2 = not_EQ___2;
  not_EQ_.cljs$lang$arity$variadic = not_EQ___3.cljs$lang$arity$variadic;
  return not_EQ_
}();
cljs.core.not_empty = function not_empty(coll) {
  if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
    return coll
  }else {
    return null
  }
};
cljs.core.every_QMARK_ = function every_QMARK_(pred, coll) {
  while(true) {
    if(cljs.core.seq.call(null, coll) == null) {
      return true
    }else {
      if(cljs.core.truth_(pred.call(null, cljs.core.first.call(null, coll)))) {
        var G__7082 = pred;
        var G__7083 = cljs.core.next.call(null, coll);
        pred = G__7082;
        coll = G__7083;
        continue
      }else {
        if("\ufdd0'else") {
          return false
        }else {
          return null
        }
      }
    }
    break
  }
};
cljs.core.not_every_QMARK_ = function not_every_QMARK_(pred, coll) {
  return cljs.core.not.call(null, cljs.core.every_QMARK_.call(null, pred, coll))
};
cljs.core.some = function some(pred, coll) {
  while(true) {
    if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
      var or__138__auto____7084 = pred.call(null, cljs.core.first.call(null, coll));
      if(cljs.core.truth_(or__138__auto____7084)) {
        return or__138__auto____7084
      }else {
        var G__7085 = pred;
        var G__7086 = cljs.core.next.call(null, coll);
        pred = G__7085;
        coll = G__7086;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.not_any_QMARK_ = function not_any_QMARK_(pred, coll) {
  return cljs.core.not.call(null, cljs.core.some.call(null, pred, coll))
};
cljs.core.even_QMARK_ = function even_QMARK_(n) {
  if(cljs.core.integer_QMARK_.call(null, n)) {
    return(n & 1) === 0
  }else {
    throw new Error([cljs.core.str("Argument must be an integer: "), cljs.core.str(n)].join(""));
  }
};
cljs.core.odd_QMARK_ = function odd_QMARK_(n) {
  return cljs.core.not.call(null, cljs.core.even_QMARK_.call(null, n))
};
cljs.core.identity = function identity(x) {
  return x
};
cljs.core.complement = function complement(f) {
  return function() {
    var G__7087 = null;
    var G__7087__0 = function() {
      return cljs.core.not.call(null, f.call(null))
    };
    var G__7087__1 = function(x) {
      return cljs.core.not.call(null, f.call(null, x))
    };
    var G__7087__2 = function(x, y) {
      return cljs.core.not.call(null, f.call(null, x, y))
    };
    var G__7087__3 = function() {
      var G__7088__delegate = function(x, y, zs) {
        return cljs.core.not.call(null, cljs.core.apply.call(null, f, x, y, zs))
      };
      var G__7088 = function(x, y, var_args) {
        var zs = null;
        if(goog.isDef(var_args)) {
          zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
        }
        return G__7088__delegate.call(this, x, y, zs)
      };
      G__7088.cljs$lang$maxFixedArity = 2;
      G__7088.cljs$lang$applyTo = function(arglist__7089) {
        var x = cljs.core.first(arglist__7089);
        var y = cljs.core.first(cljs.core.next(arglist__7089));
        var zs = cljs.core.rest(cljs.core.next(arglist__7089));
        return G__7088__delegate(x, y, zs)
      };
      G__7088.cljs$lang$arity$variadic = G__7088__delegate;
      return G__7088
    }();
    G__7087 = function(x, y, var_args) {
      var zs = var_args;
      switch(arguments.length) {
        case 0:
          return G__7087__0.call(this);
        case 1:
          return G__7087__1.call(this, x);
        case 2:
          return G__7087__2.call(this, x, y);
        default:
          return G__7087__3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
      }
      throw"Invalid arity: " + arguments.length;
    };
    G__7087.cljs$lang$maxFixedArity = 2;
    G__7087.cljs$lang$applyTo = G__7087__3.cljs$lang$applyTo;
    return G__7087
  }()
};
cljs.core.constantly = function constantly(x) {
  return function() {
    var G__7090__delegate = function(args) {
      return x
    };
    var G__7090 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__7090__delegate.call(this, args)
    };
    G__7090.cljs$lang$maxFixedArity = 0;
    G__7090.cljs$lang$applyTo = function(arglist__7091) {
      var args = cljs.core.seq(arglist__7091);
      return G__7090__delegate(args)
    };
    G__7090.cljs$lang$arity$variadic = G__7090__delegate;
    return G__7090
  }()
};
cljs.core.comp = function() {
  var comp = null;
  var comp__0 = function() {
    return cljs.core.identity
  };
  var comp__1 = function(f) {
    return f
  };
  var comp__2 = function(f, g) {
    return function() {
      var G__7095 = null;
      var G__7095__0 = function() {
        return f.call(null, g.call(null))
      };
      var G__7095__1 = function(x) {
        return f.call(null, g.call(null, x))
      };
      var G__7095__2 = function(x, y) {
        return f.call(null, g.call(null, x, y))
      };
      var G__7095__3 = function(x, y, z) {
        return f.call(null, g.call(null, x, y, z))
      };
      var G__7095__4 = function() {
        var G__7096__delegate = function(x, y, z, args) {
          return f.call(null, cljs.core.apply.call(null, g, x, y, z, args))
        };
        var G__7096 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7096__delegate.call(this, x, y, z, args)
        };
        G__7096.cljs$lang$maxFixedArity = 3;
        G__7096.cljs$lang$applyTo = function(arglist__7097) {
          var x = cljs.core.first(arglist__7097);
          var y = cljs.core.first(cljs.core.next(arglist__7097));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7097)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7097)));
          return G__7096__delegate(x, y, z, args)
        };
        G__7096.cljs$lang$arity$variadic = G__7096__delegate;
        return G__7096
      }();
      G__7095 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__7095__0.call(this);
          case 1:
            return G__7095__1.call(this, x);
          case 2:
            return G__7095__2.call(this, x, y);
          case 3:
            return G__7095__3.call(this, x, y, z);
          default:
            return G__7095__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__7095.cljs$lang$maxFixedArity = 3;
      G__7095.cljs$lang$applyTo = G__7095__4.cljs$lang$applyTo;
      return G__7095
    }()
  };
  var comp__3 = function(f, g, h) {
    return function() {
      var G__7098 = null;
      var G__7098__0 = function() {
        return f.call(null, g.call(null, h.call(null)))
      };
      var G__7098__1 = function(x) {
        return f.call(null, g.call(null, h.call(null, x)))
      };
      var G__7098__2 = function(x, y) {
        return f.call(null, g.call(null, h.call(null, x, y)))
      };
      var G__7098__3 = function(x, y, z) {
        return f.call(null, g.call(null, h.call(null, x, y, z)))
      };
      var G__7098__4 = function() {
        var G__7099__delegate = function(x, y, z, args) {
          return f.call(null, g.call(null, cljs.core.apply.call(null, h, x, y, z, args)))
        };
        var G__7099 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7099__delegate.call(this, x, y, z, args)
        };
        G__7099.cljs$lang$maxFixedArity = 3;
        G__7099.cljs$lang$applyTo = function(arglist__7100) {
          var x = cljs.core.first(arglist__7100);
          var y = cljs.core.first(cljs.core.next(arglist__7100));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7100)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7100)));
          return G__7099__delegate(x, y, z, args)
        };
        G__7099.cljs$lang$arity$variadic = G__7099__delegate;
        return G__7099
      }();
      G__7098 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__7098__0.call(this);
          case 1:
            return G__7098__1.call(this, x);
          case 2:
            return G__7098__2.call(this, x, y);
          case 3:
            return G__7098__3.call(this, x, y, z);
          default:
            return G__7098__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__7098.cljs$lang$maxFixedArity = 3;
      G__7098.cljs$lang$applyTo = G__7098__4.cljs$lang$applyTo;
      return G__7098
    }()
  };
  var comp__4 = function() {
    var G__7101__delegate = function(f1, f2, f3, fs) {
      var fs__7092 = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, f1, f2, f3, fs));
      return function() {
        var G__7102__delegate = function(args) {
          var ret__7093 = cljs.core.apply.call(null, cljs.core.first.call(null, fs__7092), args);
          var fs__7094 = cljs.core.next.call(null, fs__7092);
          while(true) {
            if(cljs.core.truth_(fs__7094)) {
              var G__7103 = cljs.core.first.call(null, fs__7094).call(null, ret__7093);
              var G__7104 = cljs.core.next.call(null, fs__7094);
              ret__7093 = G__7103;
              fs__7094 = G__7104;
              continue
            }else {
              return ret__7093
            }
            break
          }
        };
        var G__7102 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__7102__delegate.call(this, args)
        };
        G__7102.cljs$lang$maxFixedArity = 0;
        G__7102.cljs$lang$applyTo = function(arglist__7105) {
          var args = cljs.core.seq(arglist__7105);
          return G__7102__delegate(args)
        };
        G__7102.cljs$lang$arity$variadic = G__7102__delegate;
        return G__7102
      }()
    };
    var G__7101 = function(f1, f2, f3, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__7101__delegate.call(this, f1, f2, f3, fs)
    };
    G__7101.cljs$lang$maxFixedArity = 3;
    G__7101.cljs$lang$applyTo = function(arglist__7106) {
      var f1 = cljs.core.first(arglist__7106);
      var f2 = cljs.core.first(cljs.core.next(arglist__7106));
      var f3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7106)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7106)));
      return G__7101__delegate(f1, f2, f3, fs)
    };
    G__7101.cljs$lang$arity$variadic = G__7101__delegate;
    return G__7101
  }();
  comp = function(f1, f2, f3, var_args) {
    var fs = var_args;
    switch(arguments.length) {
      case 0:
        return comp__0.call(this);
      case 1:
        return comp__1.call(this, f1);
      case 2:
        return comp__2.call(this, f1, f2);
      case 3:
        return comp__3.call(this, f1, f2, f3);
      default:
        return comp__4.cljs$lang$arity$variadic(f1, f2, f3, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  comp.cljs$lang$maxFixedArity = 3;
  comp.cljs$lang$applyTo = comp__4.cljs$lang$applyTo;
  comp.cljs$lang$arity$0 = comp__0;
  comp.cljs$lang$arity$1 = comp__1;
  comp.cljs$lang$arity$2 = comp__2;
  comp.cljs$lang$arity$3 = comp__3;
  comp.cljs$lang$arity$variadic = comp__4.cljs$lang$arity$variadic;
  return comp
}();
cljs.core.partial = function() {
  var partial = null;
  var partial__2 = function(f, arg1) {
    return function() {
      var G__7107__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, args)
      };
      var G__7107 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__7107__delegate.call(this, args)
      };
      G__7107.cljs$lang$maxFixedArity = 0;
      G__7107.cljs$lang$applyTo = function(arglist__7108) {
        var args = cljs.core.seq(arglist__7108);
        return G__7107__delegate(args)
      };
      G__7107.cljs$lang$arity$variadic = G__7107__delegate;
      return G__7107
    }()
  };
  var partial__3 = function(f, arg1, arg2) {
    return function() {
      var G__7109__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, args)
      };
      var G__7109 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__7109__delegate.call(this, args)
      };
      G__7109.cljs$lang$maxFixedArity = 0;
      G__7109.cljs$lang$applyTo = function(arglist__7110) {
        var args = cljs.core.seq(arglist__7110);
        return G__7109__delegate(args)
      };
      G__7109.cljs$lang$arity$variadic = G__7109__delegate;
      return G__7109
    }()
  };
  var partial__4 = function(f, arg1, arg2, arg3) {
    return function() {
      var G__7111__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, arg3, args)
      };
      var G__7111 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__7111__delegate.call(this, args)
      };
      G__7111.cljs$lang$maxFixedArity = 0;
      G__7111.cljs$lang$applyTo = function(arglist__7112) {
        var args = cljs.core.seq(arglist__7112);
        return G__7111__delegate(args)
      };
      G__7111.cljs$lang$arity$variadic = G__7111__delegate;
      return G__7111
    }()
  };
  var partial__5 = function() {
    var G__7113__delegate = function(f, arg1, arg2, arg3, more) {
      return function() {
        var G__7114__delegate = function(args) {
          return cljs.core.apply.call(null, f, arg1, arg2, arg3, cljs.core.concat.call(null, more, args))
        };
        var G__7114 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__7114__delegate.call(this, args)
        };
        G__7114.cljs$lang$maxFixedArity = 0;
        G__7114.cljs$lang$applyTo = function(arglist__7115) {
          var args = cljs.core.seq(arglist__7115);
          return G__7114__delegate(args)
        };
        G__7114.cljs$lang$arity$variadic = G__7114__delegate;
        return G__7114
      }()
    };
    var G__7113 = function(f, arg1, arg2, arg3, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__7113__delegate.call(this, f, arg1, arg2, arg3, more)
    };
    G__7113.cljs$lang$maxFixedArity = 4;
    G__7113.cljs$lang$applyTo = function(arglist__7116) {
      var f = cljs.core.first(arglist__7116);
      var arg1 = cljs.core.first(cljs.core.next(arglist__7116));
      var arg2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7116)));
      var arg3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7116))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7116))));
      return G__7113__delegate(f, arg1, arg2, arg3, more)
    };
    G__7113.cljs$lang$arity$variadic = G__7113__delegate;
    return G__7113
  }();
  partial = function(f, arg1, arg2, arg3, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return partial__2.call(this, f, arg1);
      case 3:
        return partial__3.call(this, f, arg1, arg2);
      case 4:
        return partial__4.call(this, f, arg1, arg2, arg3);
      default:
        return partial__5.cljs$lang$arity$variadic(f, arg1, arg2, arg3, cljs.core.array_seq(arguments, 4))
    }
    throw"Invalid arity: " + arguments.length;
  };
  partial.cljs$lang$maxFixedArity = 4;
  partial.cljs$lang$applyTo = partial__5.cljs$lang$applyTo;
  partial.cljs$lang$arity$2 = partial__2;
  partial.cljs$lang$arity$3 = partial__3;
  partial.cljs$lang$arity$4 = partial__4;
  partial.cljs$lang$arity$variadic = partial__5.cljs$lang$arity$variadic;
  return partial
}();
cljs.core.fnil = function() {
  var fnil = null;
  var fnil__2 = function(f, x) {
    return function() {
      var G__7117 = null;
      var G__7117__1 = function(a) {
        return f.call(null, a == null ? x : a)
      };
      var G__7117__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b)
      };
      var G__7117__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b, c)
      };
      var G__7117__4 = function() {
        var G__7118__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b, c, ds)
        };
        var G__7118 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7118__delegate.call(this, a, b, c, ds)
        };
        G__7118.cljs$lang$maxFixedArity = 3;
        G__7118.cljs$lang$applyTo = function(arglist__7119) {
          var a = cljs.core.first(arglist__7119);
          var b = cljs.core.first(cljs.core.next(arglist__7119));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7119)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7119)));
          return G__7118__delegate(a, b, c, ds)
        };
        G__7118.cljs$lang$arity$variadic = G__7118__delegate;
        return G__7118
      }();
      G__7117 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 1:
            return G__7117__1.call(this, a);
          case 2:
            return G__7117__2.call(this, a, b);
          case 3:
            return G__7117__3.call(this, a, b, c);
          default:
            return G__7117__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__7117.cljs$lang$maxFixedArity = 3;
      G__7117.cljs$lang$applyTo = G__7117__4.cljs$lang$applyTo;
      return G__7117
    }()
  };
  var fnil__3 = function(f, x, y) {
    return function() {
      var G__7120 = null;
      var G__7120__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b == null ? y : b)
      };
      var G__7120__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b == null ? y : b, c)
      };
      var G__7120__4 = function() {
        var G__7121__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b == null ? y : b, c, ds)
        };
        var G__7121 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7121__delegate.call(this, a, b, c, ds)
        };
        G__7121.cljs$lang$maxFixedArity = 3;
        G__7121.cljs$lang$applyTo = function(arglist__7122) {
          var a = cljs.core.first(arglist__7122);
          var b = cljs.core.first(cljs.core.next(arglist__7122));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7122)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7122)));
          return G__7121__delegate(a, b, c, ds)
        };
        G__7121.cljs$lang$arity$variadic = G__7121__delegate;
        return G__7121
      }();
      G__7120 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__7120__2.call(this, a, b);
          case 3:
            return G__7120__3.call(this, a, b, c);
          default:
            return G__7120__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__7120.cljs$lang$maxFixedArity = 3;
      G__7120.cljs$lang$applyTo = G__7120__4.cljs$lang$applyTo;
      return G__7120
    }()
  };
  var fnil__4 = function(f, x, y, z) {
    return function() {
      var G__7123 = null;
      var G__7123__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b == null ? y : b)
      };
      var G__7123__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b == null ? y : b, c == null ? z : c)
      };
      var G__7123__4 = function() {
        var G__7124__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b == null ? y : b, c == null ? z : c, ds)
        };
        var G__7124 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7124__delegate.call(this, a, b, c, ds)
        };
        G__7124.cljs$lang$maxFixedArity = 3;
        G__7124.cljs$lang$applyTo = function(arglist__7125) {
          var a = cljs.core.first(arglist__7125);
          var b = cljs.core.first(cljs.core.next(arglist__7125));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7125)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7125)));
          return G__7124__delegate(a, b, c, ds)
        };
        G__7124.cljs$lang$arity$variadic = G__7124__delegate;
        return G__7124
      }();
      G__7123 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__7123__2.call(this, a, b);
          case 3:
            return G__7123__3.call(this, a, b, c);
          default:
            return G__7123__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__7123.cljs$lang$maxFixedArity = 3;
      G__7123.cljs$lang$applyTo = G__7123__4.cljs$lang$applyTo;
      return G__7123
    }()
  };
  fnil = function(f, x, y, z) {
    switch(arguments.length) {
      case 2:
        return fnil__2.call(this, f, x);
      case 3:
        return fnil__3.call(this, f, x, y);
      case 4:
        return fnil__4.call(this, f, x, y, z)
    }
    throw"Invalid arity: " + arguments.length;
  };
  fnil.cljs$lang$arity$2 = fnil__2;
  fnil.cljs$lang$arity$3 = fnil__3;
  fnil.cljs$lang$arity$4 = fnil__4;
  return fnil
}();
cljs.core.map_indexed = function map_indexed(f, coll) {
  var mapi__7128 = function mpi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__324__auto____7126 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7126)) {
        var s__7127 = temp__324__auto____7126;
        return cljs.core.cons.call(null, f.call(null, idx, cljs.core.first.call(null, s__7127)), mpi.call(null, idx + 1, cljs.core.rest.call(null, s__7127)))
      }else {
        return null
      }
    })
  };
  return mapi__7128.call(null, 0, coll)
};
cljs.core.keep = function keep(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__324__auto____7129 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____7129)) {
      var s__7130 = temp__324__auto____7129;
      var x__7131 = f.call(null, cljs.core.first.call(null, s__7130));
      if(x__7131 == null) {
        return keep.call(null, f, cljs.core.rest.call(null, s__7130))
      }else {
        return cljs.core.cons.call(null, x__7131, keep.call(null, f, cljs.core.rest.call(null, s__7130)))
      }
    }else {
      return null
    }
  })
};
cljs.core.keep_indexed = function keep_indexed(f, coll) {
  var keepi__7141 = function kpi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__324__auto____7138 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7138)) {
        var s__7139 = temp__324__auto____7138;
        var x__7140 = f.call(null, idx, cljs.core.first.call(null, s__7139));
        if(x__7140 == null) {
          return kpi.call(null, idx + 1, cljs.core.rest.call(null, s__7139))
        }else {
          return cljs.core.cons.call(null, x__7140, kpi.call(null, idx + 1, cljs.core.rest.call(null, s__7139)))
        }
      }else {
        return null
      }
    })
  };
  return keepi__7141.call(null, 0, coll)
};
cljs.core.every_pred = function() {
  var every_pred = null;
  var every_pred__1 = function(p) {
    return function() {
      var ep1 = null;
      var ep1__0 = function() {
        return true
      };
      var ep1__1 = function(x) {
        return cljs.core.boolean$.call(null, p.call(null, x))
      };
      var ep1__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7148 = p.call(null, x);
          if(cljs.core.truth_(and__132__auto____7148)) {
            return p.call(null, y)
          }else {
            return and__132__auto____7148
          }
        }())
      };
      var ep1__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7149 = p.call(null, x);
          if(cljs.core.truth_(and__132__auto____7149)) {
            var and__132__auto____7150 = p.call(null, y);
            if(cljs.core.truth_(and__132__auto____7150)) {
              return p.call(null, z)
            }else {
              return and__132__auto____7150
            }
          }else {
            return and__132__auto____7149
          }
        }())
      };
      var ep1__4 = function() {
        var G__7186__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__132__auto____7151 = ep1.call(null, x, y, z);
            if(cljs.core.truth_(and__132__auto____7151)) {
              return cljs.core.every_QMARK_.call(null, p, args)
            }else {
              return and__132__auto____7151
            }
          }())
        };
        var G__7186 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7186__delegate.call(this, x, y, z, args)
        };
        G__7186.cljs$lang$maxFixedArity = 3;
        G__7186.cljs$lang$applyTo = function(arglist__7187) {
          var x = cljs.core.first(arglist__7187);
          var y = cljs.core.first(cljs.core.next(arglist__7187));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7187)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7187)));
          return G__7186__delegate(x, y, z, args)
        };
        G__7186.cljs$lang$arity$variadic = G__7186__delegate;
        return G__7186
      }();
      ep1 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep1__0.call(this);
          case 1:
            return ep1__1.call(this, x);
          case 2:
            return ep1__2.call(this, x, y);
          case 3:
            return ep1__3.call(this, x, y, z);
          default:
            return ep1__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep1.cljs$lang$maxFixedArity = 3;
      ep1.cljs$lang$applyTo = ep1__4.cljs$lang$applyTo;
      ep1.cljs$lang$arity$0 = ep1__0;
      ep1.cljs$lang$arity$1 = ep1__1;
      ep1.cljs$lang$arity$2 = ep1__2;
      ep1.cljs$lang$arity$3 = ep1__3;
      ep1.cljs$lang$arity$variadic = ep1__4.cljs$lang$arity$variadic;
      return ep1
    }()
  };
  var every_pred__2 = function(p1, p2) {
    return function() {
      var ep2 = null;
      var ep2__0 = function() {
        return true
      };
      var ep2__1 = function(x) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7152 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7152)) {
            return p2.call(null, x)
          }else {
            return and__132__auto____7152
          }
        }())
      };
      var ep2__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7153 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7153)) {
            var and__132__auto____7154 = p1.call(null, y);
            if(cljs.core.truth_(and__132__auto____7154)) {
              var and__132__auto____7155 = p2.call(null, x);
              if(cljs.core.truth_(and__132__auto____7155)) {
                return p2.call(null, y)
              }else {
                return and__132__auto____7155
              }
            }else {
              return and__132__auto____7154
            }
          }else {
            return and__132__auto____7153
          }
        }())
      };
      var ep2__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7156 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7156)) {
            var and__132__auto____7157 = p1.call(null, y);
            if(cljs.core.truth_(and__132__auto____7157)) {
              var and__132__auto____7158 = p1.call(null, z);
              if(cljs.core.truth_(and__132__auto____7158)) {
                var and__132__auto____7159 = p2.call(null, x);
                if(cljs.core.truth_(and__132__auto____7159)) {
                  var and__132__auto____7160 = p2.call(null, y);
                  if(cljs.core.truth_(and__132__auto____7160)) {
                    return p2.call(null, z)
                  }else {
                    return and__132__auto____7160
                  }
                }else {
                  return and__132__auto____7159
                }
              }else {
                return and__132__auto____7158
              }
            }else {
              return and__132__auto____7157
            }
          }else {
            return and__132__auto____7156
          }
        }())
      };
      var ep2__4 = function() {
        var G__7188__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__132__auto____7161 = ep2.call(null, x, y, z);
            if(cljs.core.truth_(and__132__auto____7161)) {
              return cljs.core.every_QMARK_.call(null, function(p1__7132_SHARP_) {
                var and__132__auto____7162 = p1.call(null, p1__7132_SHARP_);
                if(cljs.core.truth_(and__132__auto____7162)) {
                  return p2.call(null, p1__7132_SHARP_)
                }else {
                  return and__132__auto____7162
                }
              }, args)
            }else {
              return and__132__auto____7161
            }
          }())
        };
        var G__7188 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7188__delegate.call(this, x, y, z, args)
        };
        G__7188.cljs$lang$maxFixedArity = 3;
        G__7188.cljs$lang$applyTo = function(arglist__7189) {
          var x = cljs.core.first(arglist__7189);
          var y = cljs.core.first(cljs.core.next(arglist__7189));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7189)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7189)));
          return G__7188__delegate(x, y, z, args)
        };
        G__7188.cljs$lang$arity$variadic = G__7188__delegate;
        return G__7188
      }();
      ep2 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep2__0.call(this);
          case 1:
            return ep2__1.call(this, x);
          case 2:
            return ep2__2.call(this, x, y);
          case 3:
            return ep2__3.call(this, x, y, z);
          default:
            return ep2__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep2.cljs$lang$maxFixedArity = 3;
      ep2.cljs$lang$applyTo = ep2__4.cljs$lang$applyTo;
      ep2.cljs$lang$arity$0 = ep2__0;
      ep2.cljs$lang$arity$1 = ep2__1;
      ep2.cljs$lang$arity$2 = ep2__2;
      ep2.cljs$lang$arity$3 = ep2__3;
      ep2.cljs$lang$arity$variadic = ep2__4.cljs$lang$arity$variadic;
      return ep2
    }()
  };
  var every_pred__3 = function(p1, p2, p3) {
    return function() {
      var ep3 = null;
      var ep3__0 = function() {
        return true
      };
      var ep3__1 = function(x) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7163 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7163)) {
            var and__132__auto____7164 = p2.call(null, x);
            if(cljs.core.truth_(and__132__auto____7164)) {
              return p3.call(null, x)
            }else {
              return and__132__auto____7164
            }
          }else {
            return and__132__auto____7163
          }
        }())
      };
      var ep3__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7165 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7165)) {
            var and__132__auto____7166 = p2.call(null, x);
            if(cljs.core.truth_(and__132__auto____7166)) {
              var and__132__auto____7167 = p3.call(null, x);
              if(cljs.core.truth_(and__132__auto____7167)) {
                var and__132__auto____7168 = p1.call(null, y);
                if(cljs.core.truth_(and__132__auto____7168)) {
                  var and__132__auto____7169 = p2.call(null, y);
                  if(cljs.core.truth_(and__132__auto____7169)) {
                    return p3.call(null, y)
                  }else {
                    return and__132__auto____7169
                  }
                }else {
                  return and__132__auto____7168
                }
              }else {
                return and__132__auto____7167
              }
            }else {
              return and__132__auto____7166
            }
          }else {
            return and__132__auto____7165
          }
        }())
      };
      var ep3__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7170 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7170)) {
            var and__132__auto____7171 = p2.call(null, x);
            if(cljs.core.truth_(and__132__auto____7171)) {
              var and__132__auto____7172 = p3.call(null, x);
              if(cljs.core.truth_(and__132__auto____7172)) {
                var and__132__auto____7173 = p1.call(null, y);
                if(cljs.core.truth_(and__132__auto____7173)) {
                  var and__132__auto____7174 = p2.call(null, y);
                  if(cljs.core.truth_(and__132__auto____7174)) {
                    var and__132__auto____7175 = p3.call(null, y);
                    if(cljs.core.truth_(and__132__auto____7175)) {
                      var and__132__auto____7176 = p1.call(null, z);
                      if(cljs.core.truth_(and__132__auto____7176)) {
                        var and__132__auto____7177 = p2.call(null, z);
                        if(cljs.core.truth_(and__132__auto____7177)) {
                          return p3.call(null, z)
                        }else {
                          return and__132__auto____7177
                        }
                      }else {
                        return and__132__auto____7176
                      }
                    }else {
                      return and__132__auto____7175
                    }
                  }else {
                    return and__132__auto____7174
                  }
                }else {
                  return and__132__auto____7173
                }
              }else {
                return and__132__auto____7172
              }
            }else {
              return and__132__auto____7171
            }
          }else {
            return and__132__auto____7170
          }
        }())
      };
      var ep3__4 = function() {
        var G__7190__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__132__auto____7178 = ep3.call(null, x, y, z);
            if(cljs.core.truth_(and__132__auto____7178)) {
              return cljs.core.every_QMARK_.call(null, function(p1__7133_SHARP_) {
                var and__132__auto____7179 = p1.call(null, p1__7133_SHARP_);
                if(cljs.core.truth_(and__132__auto____7179)) {
                  var and__132__auto____7180 = p2.call(null, p1__7133_SHARP_);
                  if(cljs.core.truth_(and__132__auto____7180)) {
                    return p3.call(null, p1__7133_SHARP_)
                  }else {
                    return and__132__auto____7180
                  }
                }else {
                  return and__132__auto____7179
                }
              }, args)
            }else {
              return and__132__auto____7178
            }
          }())
        };
        var G__7190 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7190__delegate.call(this, x, y, z, args)
        };
        G__7190.cljs$lang$maxFixedArity = 3;
        G__7190.cljs$lang$applyTo = function(arglist__7191) {
          var x = cljs.core.first(arglist__7191);
          var y = cljs.core.first(cljs.core.next(arglist__7191));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7191)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7191)));
          return G__7190__delegate(x, y, z, args)
        };
        G__7190.cljs$lang$arity$variadic = G__7190__delegate;
        return G__7190
      }();
      ep3 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep3__0.call(this);
          case 1:
            return ep3__1.call(this, x);
          case 2:
            return ep3__2.call(this, x, y);
          case 3:
            return ep3__3.call(this, x, y, z);
          default:
            return ep3__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      ep3.cljs$lang$maxFixedArity = 3;
      ep3.cljs$lang$applyTo = ep3__4.cljs$lang$applyTo;
      ep3.cljs$lang$arity$0 = ep3__0;
      ep3.cljs$lang$arity$1 = ep3__1;
      ep3.cljs$lang$arity$2 = ep3__2;
      ep3.cljs$lang$arity$3 = ep3__3;
      ep3.cljs$lang$arity$variadic = ep3__4.cljs$lang$arity$variadic;
      return ep3
    }()
  };
  var every_pred__4 = function() {
    var G__7192__delegate = function(p1, p2, p3, ps) {
      var ps__7181 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function() {
        var epn = null;
        var epn__0 = function() {
          return true
        };
        var epn__1 = function(x) {
          return cljs.core.every_QMARK_.call(null, function(p1__7134_SHARP_) {
            return p1__7134_SHARP_.call(null, x)
          }, ps__7181)
        };
        var epn__2 = function(x, y) {
          return cljs.core.every_QMARK_.call(null, function(p1__7135_SHARP_) {
            var and__132__auto____7182 = p1__7135_SHARP_.call(null, x);
            if(cljs.core.truth_(and__132__auto____7182)) {
              return p1__7135_SHARP_.call(null, y)
            }else {
              return and__132__auto____7182
            }
          }, ps__7181)
        };
        var epn__3 = function(x, y, z) {
          return cljs.core.every_QMARK_.call(null, function(p1__7136_SHARP_) {
            var and__132__auto____7183 = p1__7136_SHARP_.call(null, x);
            if(cljs.core.truth_(and__132__auto____7183)) {
              var and__132__auto____7184 = p1__7136_SHARP_.call(null, y);
              if(cljs.core.truth_(and__132__auto____7184)) {
                return p1__7136_SHARP_.call(null, z)
              }else {
                return and__132__auto____7184
              }
            }else {
              return and__132__auto____7183
            }
          }, ps__7181)
        };
        var epn__4 = function() {
          var G__7193__delegate = function(x, y, z, args) {
            return cljs.core.boolean$.call(null, function() {
              var and__132__auto____7185 = epn.call(null, x, y, z);
              if(cljs.core.truth_(and__132__auto____7185)) {
                return cljs.core.every_QMARK_.call(null, function(p1__7137_SHARP_) {
                  return cljs.core.every_QMARK_.call(null, p1__7137_SHARP_, args)
                }, ps__7181)
              }else {
                return and__132__auto____7185
              }
            }())
          };
          var G__7193 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__7193__delegate.call(this, x, y, z, args)
          };
          G__7193.cljs$lang$maxFixedArity = 3;
          G__7193.cljs$lang$applyTo = function(arglist__7194) {
            var x = cljs.core.first(arglist__7194);
            var y = cljs.core.first(cljs.core.next(arglist__7194));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7194)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7194)));
            return G__7193__delegate(x, y, z, args)
          };
          G__7193.cljs$lang$arity$variadic = G__7193__delegate;
          return G__7193
        }();
        epn = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return epn__0.call(this);
            case 1:
              return epn__1.call(this, x);
            case 2:
              return epn__2.call(this, x, y);
            case 3:
              return epn__3.call(this, x, y, z);
            default:
              return epn__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
          }
          throw"Invalid arity: " + arguments.length;
        };
        epn.cljs$lang$maxFixedArity = 3;
        epn.cljs$lang$applyTo = epn__4.cljs$lang$applyTo;
        epn.cljs$lang$arity$0 = epn__0;
        epn.cljs$lang$arity$1 = epn__1;
        epn.cljs$lang$arity$2 = epn__2;
        epn.cljs$lang$arity$3 = epn__3;
        epn.cljs$lang$arity$variadic = epn__4.cljs$lang$arity$variadic;
        return epn
      }()
    };
    var G__7192 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__7192__delegate.call(this, p1, p2, p3, ps)
    };
    G__7192.cljs$lang$maxFixedArity = 3;
    G__7192.cljs$lang$applyTo = function(arglist__7195) {
      var p1 = cljs.core.first(arglist__7195);
      var p2 = cljs.core.first(cljs.core.next(arglist__7195));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7195)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7195)));
      return G__7192__delegate(p1, p2, p3, ps)
    };
    G__7192.cljs$lang$arity$variadic = G__7192__delegate;
    return G__7192
  }();
  every_pred = function(p1, p2, p3, var_args) {
    var ps = var_args;
    switch(arguments.length) {
      case 1:
        return every_pred__1.call(this, p1);
      case 2:
        return every_pred__2.call(this, p1, p2);
      case 3:
        return every_pred__3.call(this, p1, p2, p3);
      default:
        return every_pred__4.cljs$lang$arity$variadic(p1, p2, p3, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  every_pred.cljs$lang$maxFixedArity = 3;
  every_pred.cljs$lang$applyTo = every_pred__4.cljs$lang$applyTo;
  every_pred.cljs$lang$arity$1 = every_pred__1;
  every_pred.cljs$lang$arity$2 = every_pred__2;
  every_pred.cljs$lang$arity$3 = every_pred__3;
  every_pred.cljs$lang$arity$variadic = every_pred__4.cljs$lang$arity$variadic;
  return every_pred
}();
cljs.core.some_fn = function() {
  var some_fn = null;
  var some_fn__1 = function(p) {
    return function() {
      var sp1 = null;
      var sp1__0 = function() {
        return null
      };
      var sp1__1 = function(x) {
        return p.call(null, x)
      };
      var sp1__2 = function(x, y) {
        var or__138__auto____7197 = p.call(null, x);
        if(cljs.core.truth_(or__138__auto____7197)) {
          return or__138__auto____7197
        }else {
          return p.call(null, y)
        }
      };
      var sp1__3 = function(x, y, z) {
        var or__138__auto____7198 = p.call(null, x);
        if(cljs.core.truth_(or__138__auto____7198)) {
          return or__138__auto____7198
        }else {
          var or__138__auto____7199 = p.call(null, y);
          if(cljs.core.truth_(or__138__auto____7199)) {
            return or__138__auto____7199
          }else {
            return p.call(null, z)
          }
        }
      };
      var sp1__4 = function() {
        var G__7235__delegate = function(x, y, z, args) {
          var or__138__auto____7200 = sp1.call(null, x, y, z);
          if(cljs.core.truth_(or__138__auto____7200)) {
            return or__138__auto____7200
          }else {
            return cljs.core.some.call(null, p, args)
          }
        };
        var G__7235 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7235__delegate.call(this, x, y, z, args)
        };
        G__7235.cljs$lang$maxFixedArity = 3;
        G__7235.cljs$lang$applyTo = function(arglist__7236) {
          var x = cljs.core.first(arglist__7236);
          var y = cljs.core.first(cljs.core.next(arglist__7236));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7236)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7236)));
          return G__7235__delegate(x, y, z, args)
        };
        G__7235.cljs$lang$arity$variadic = G__7235__delegate;
        return G__7235
      }();
      sp1 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp1__0.call(this);
          case 1:
            return sp1__1.call(this, x);
          case 2:
            return sp1__2.call(this, x, y);
          case 3:
            return sp1__3.call(this, x, y, z);
          default:
            return sp1__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp1.cljs$lang$maxFixedArity = 3;
      sp1.cljs$lang$applyTo = sp1__4.cljs$lang$applyTo;
      sp1.cljs$lang$arity$0 = sp1__0;
      sp1.cljs$lang$arity$1 = sp1__1;
      sp1.cljs$lang$arity$2 = sp1__2;
      sp1.cljs$lang$arity$3 = sp1__3;
      sp1.cljs$lang$arity$variadic = sp1__4.cljs$lang$arity$variadic;
      return sp1
    }()
  };
  var some_fn__2 = function(p1, p2) {
    return function() {
      var sp2 = null;
      var sp2__0 = function() {
        return null
      };
      var sp2__1 = function(x) {
        var or__138__auto____7201 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7201)) {
          return or__138__auto____7201
        }else {
          return p2.call(null, x)
        }
      };
      var sp2__2 = function(x, y) {
        var or__138__auto____7202 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7202)) {
          return or__138__auto____7202
        }else {
          var or__138__auto____7203 = p1.call(null, y);
          if(cljs.core.truth_(or__138__auto____7203)) {
            return or__138__auto____7203
          }else {
            var or__138__auto____7204 = p2.call(null, x);
            if(cljs.core.truth_(or__138__auto____7204)) {
              return or__138__auto____7204
            }else {
              return p2.call(null, y)
            }
          }
        }
      };
      var sp2__3 = function(x, y, z) {
        var or__138__auto____7205 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7205)) {
          return or__138__auto____7205
        }else {
          var or__138__auto____7206 = p1.call(null, y);
          if(cljs.core.truth_(or__138__auto____7206)) {
            return or__138__auto____7206
          }else {
            var or__138__auto____7207 = p1.call(null, z);
            if(cljs.core.truth_(or__138__auto____7207)) {
              return or__138__auto____7207
            }else {
              var or__138__auto____7208 = p2.call(null, x);
              if(cljs.core.truth_(or__138__auto____7208)) {
                return or__138__auto____7208
              }else {
                var or__138__auto____7209 = p2.call(null, y);
                if(cljs.core.truth_(or__138__auto____7209)) {
                  return or__138__auto____7209
                }else {
                  return p2.call(null, z)
                }
              }
            }
          }
        }
      };
      var sp2__4 = function() {
        var G__7237__delegate = function(x, y, z, args) {
          var or__138__auto____7210 = sp2.call(null, x, y, z);
          if(cljs.core.truth_(or__138__auto____7210)) {
            return or__138__auto____7210
          }else {
            return cljs.core.some.call(null, function(p1__7142_SHARP_) {
              var or__138__auto____7211 = p1.call(null, p1__7142_SHARP_);
              if(cljs.core.truth_(or__138__auto____7211)) {
                return or__138__auto____7211
              }else {
                return p2.call(null, p1__7142_SHARP_)
              }
            }, args)
          }
        };
        var G__7237 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7237__delegate.call(this, x, y, z, args)
        };
        G__7237.cljs$lang$maxFixedArity = 3;
        G__7237.cljs$lang$applyTo = function(arglist__7238) {
          var x = cljs.core.first(arglist__7238);
          var y = cljs.core.first(cljs.core.next(arglist__7238));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7238)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7238)));
          return G__7237__delegate(x, y, z, args)
        };
        G__7237.cljs$lang$arity$variadic = G__7237__delegate;
        return G__7237
      }();
      sp2 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp2__0.call(this);
          case 1:
            return sp2__1.call(this, x);
          case 2:
            return sp2__2.call(this, x, y);
          case 3:
            return sp2__3.call(this, x, y, z);
          default:
            return sp2__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp2.cljs$lang$maxFixedArity = 3;
      sp2.cljs$lang$applyTo = sp2__4.cljs$lang$applyTo;
      sp2.cljs$lang$arity$0 = sp2__0;
      sp2.cljs$lang$arity$1 = sp2__1;
      sp2.cljs$lang$arity$2 = sp2__2;
      sp2.cljs$lang$arity$3 = sp2__3;
      sp2.cljs$lang$arity$variadic = sp2__4.cljs$lang$arity$variadic;
      return sp2
    }()
  };
  var some_fn__3 = function(p1, p2, p3) {
    return function() {
      var sp3 = null;
      var sp3__0 = function() {
        return null
      };
      var sp3__1 = function(x) {
        var or__138__auto____7212 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7212)) {
          return or__138__auto____7212
        }else {
          var or__138__auto____7213 = p2.call(null, x);
          if(cljs.core.truth_(or__138__auto____7213)) {
            return or__138__auto____7213
          }else {
            return p3.call(null, x)
          }
        }
      };
      var sp3__2 = function(x, y) {
        var or__138__auto____7214 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7214)) {
          return or__138__auto____7214
        }else {
          var or__138__auto____7215 = p2.call(null, x);
          if(cljs.core.truth_(or__138__auto____7215)) {
            return or__138__auto____7215
          }else {
            var or__138__auto____7216 = p3.call(null, x);
            if(cljs.core.truth_(or__138__auto____7216)) {
              return or__138__auto____7216
            }else {
              var or__138__auto____7217 = p1.call(null, y);
              if(cljs.core.truth_(or__138__auto____7217)) {
                return or__138__auto____7217
              }else {
                var or__138__auto____7218 = p2.call(null, y);
                if(cljs.core.truth_(or__138__auto____7218)) {
                  return or__138__auto____7218
                }else {
                  return p3.call(null, y)
                }
              }
            }
          }
        }
      };
      var sp3__3 = function(x, y, z) {
        var or__138__auto____7219 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7219)) {
          return or__138__auto____7219
        }else {
          var or__138__auto____7220 = p2.call(null, x);
          if(cljs.core.truth_(or__138__auto____7220)) {
            return or__138__auto____7220
          }else {
            var or__138__auto____7221 = p3.call(null, x);
            if(cljs.core.truth_(or__138__auto____7221)) {
              return or__138__auto____7221
            }else {
              var or__138__auto____7222 = p1.call(null, y);
              if(cljs.core.truth_(or__138__auto____7222)) {
                return or__138__auto____7222
              }else {
                var or__138__auto____7223 = p2.call(null, y);
                if(cljs.core.truth_(or__138__auto____7223)) {
                  return or__138__auto____7223
                }else {
                  var or__138__auto____7224 = p3.call(null, y);
                  if(cljs.core.truth_(or__138__auto____7224)) {
                    return or__138__auto____7224
                  }else {
                    var or__138__auto____7225 = p1.call(null, z);
                    if(cljs.core.truth_(or__138__auto____7225)) {
                      return or__138__auto____7225
                    }else {
                      var or__138__auto____7226 = p2.call(null, z);
                      if(cljs.core.truth_(or__138__auto____7226)) {
                        return or__138__auto____7226
                      }else {
                        return p3.call(null, z)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
      var sp3__4 = function() {
        var G__7239__delegate = function(x, y, z, args) {
          var or__138__auto____7227 = sp3.call(null, x, y, z);
          if(cljs.core.truth_(or__138__auto____7227)) {
            return or__138__auto____7227
          }else {
            return cljs.core.some.call(null, function(p1__7143_SHARP_) {
              var or__138__auto____7228 = p1.call(null, p1__7143_SHARP_);
              if(cljs.core.truth_(or__138__auto____7228)) {
                return or__138__auto____7228
              }else {
                var or__138__auto____7229 = p2.call(null, p1__7143_SHARP_);
                if(cljs.core.truth_(or__138__auto____7229)) {
                  return or__138__auto____7229
                }else {
                  return p3.call(null, p1__7143_SHARP_)
                }
              }
            }, args)
          }
        };
        var G__7239 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7239__delegate.call(this, x, y, z, args)
        };
        G__7239.cljs$lang$maxFixedArity = 3;
        G__7239.cljs$lang$applyTo = function(arglist__7240) {
          var x = cljs.core.first(arglist__7240);
          var y = cljs.core.first(cljs.core.next(arglist__7240));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7240)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7240)));
          return G__7239__delegate(x, y, z, args)
        };
        G__7239.cljs$lang$arity$variadic = G__7239__delegate;
        return G__7239
      }();
      sp3 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp3__0.call(this);
          case 1:
            return sp3__1.call(this, x);
          case 2:
            return sp3__2.call(this, x, y);
          case 3:
            return sp3__3.call(this, x, y, z);
          default:
            return sp3__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      sp3.cljs$lang$maxFixedArity = 3;
      sp3.cljs$lang$applyTo = sp3__4.cljs$lang$applyTo;
      sp3.cljs$lang$arity$0 = sp3__0;
      sp3.cljs$lang$arity$1 = sp3__1;
      sp3.cljs$lang$arity$2 = sp3__2;
      sp3.cljs$lang$arity$3 = sp3__3;
      sp3.cljs$lang$arity$variadic = sp3__4.cljs$lang$arity$variadic;
      return sp3
    }()
  };
  var some_fn__4 = function() {
    var G__7241__delegate = function(p1, p2, p3, ps) {
      var ps__7230 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function() {
        var spn = null;
        var spn__0 = function() {
          return null
        };
        var spn__1 = function(x) {
          return cljs.core.some.call(null, function(p1__7144_SHARP_) {
            return p1__7144_SHARP_.call(null, x)
          }, ps__7230)
        };
        var spn__2 = function(x, y) {
          return cljs.core.some.call(null, function(p1__7145_SHARP_) {
            var or__138__auto____7231 = p1__7145_SHARP_.call(null, x);
            if(cljs.core.truth_(or__138__auto____7231)) {
              return or__138__auto____7231
            }else {
              return p1__7145_SHARP_.call(null, y)
            }
          }, ps__7230)
        };
        var spn__3 = function(x, y, z) {
          return cljs.core.some.call(null, function(p1__7146_SHARP_) {
            var or__138__auto____7232 = p1__7146_SHARP_.call(null, x);
            if(cljs.core.truth_(or__138__auto____7232)) {
              return or__138__auto____7232
            }else {
              var or__138__auto____7233 = p1__7146_SHARP_.call(null, y);
              if(cljs.core.truth_(or__138__auto____7233)) {
                return or__138__auto____7233
              }else {
                return p1__7146_SHARP_.call(null, z)
              }
            }
          }, ps__7230)
        };
        var spn__4 = function() {
          var G__7242__delegate = function(x, y, z, args) {
            var or__138__auto____7234 = spn.call(null, x, y, z);
            if(cljs.core.truth_(or__138__auto____7234)) {
              return or__138__auto____7234
            }else {
              return cljs.core.some.call(null, function(p1__7147_SHARP_) {
                return cljs.core.some.call(null, p1__7147_SHARP_, args)
              }, ps__7230)
            }
          };
          var G__7242 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__7242__delegate.call(this, x, y, z, args)
          };
          G__7242.cljs$lang$maxFixedArity = 3;
          G__7242.cljs$lang$applyTo = function(arglist__7243) {
            var x = cljs.core.first(arglist__7243);
            var y = cljs.core.first(cljs.core.next(arglist__7243));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7243)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7243)));
            return G__7242__delegate(x, y, z, args)
          };
          G__7242.cljs$lang$arity$variadic = G__7242__delegate;
          return G__7242
        }();
        spn = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return spn__0.call(this);
            case 1:
              return spn__1.call(this, x);
            case 2:
              return spn__2.call(this, x, y);
            case 3:
              return spn__3.call(this, x, y, z);
            default:
              return spn__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
          }
          throw"Invalid arity: " + arguments.length;
        };
        spn.cljs$lang$maxFixedArity = 3;
        spn.cljs$lang$applyTo = spn__4.cljs$lang$applyTo;
        spn.cljs$lang$arity$0 = spn__0;
        spn.cljs$lang$arity$1 = spn__1;
        spn.cljs$lang$arity$2 = spn__2;
        spn.cljs$lang$arity$3 = spn__3;
        spn.cljs$lang$arity$variadic = spn__4.cljs$lang$arity$variadic;
        return spn
      }()
    };
    var G__7241 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__7241__delegate.call(this, p1, p2, p3, ps)
    };
    G__7241.cljs$lang$maxFixedArity = 3;
    G__7241.cljs$lang$applyTo = function(arglist__7244) {
      var p1 = cljs.core.first(arglist__7244);
      var p2 = cljs.core.first(cljs.core.next(arglist__7244));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7244)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7244)));
      return G__7241__delegate(p1, p2, p3, ps)
    };
    G__7241.cljs$lang$arity$variadic = G__7241__delegate;
    return G__7241
  }();
  some_fn = function(p1, p2, p3, var_args) {
    var ps = var_args;
    switch(arguments.length) {
      case 1:
        return some_fn__1.call(this, p1);
      case 2:
        return some_fn__2.call(this, p1, p2);
      case 3:
        return some_fn__3.call(this, p1, p2, p3);
      default:
        return some_fn__4.cljs$lang$arity$variadic(p1, p2, p3, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  some_fn.cljs$lang$maxFixedArity = 3;
  some_fn.cljs$lang$applyTo = some_fn__4.cljs$lang$applyTo;
  some_fn.cljs$lang$arity$1 = some_fn__1;
  some_fn.cljs$lang$arity$2 = some_fn__2;
  some_fn.cljs$lang$arity$3 = some_fn__3;
  some_fn.cljs$lang$arity$variadic = some_fn__4.cljs$lang$arity$variadic;
  return some_fn
}();
cljs.core.map = function() {
  var map = null;
  var map__2 = function(f, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__324__auto____7245 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7245)) {
        var s__7246 = temp__324__auto____7245;
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s__7246)), map.call(null, f, cljs.core.rest.call(null, s__7246)))
      }else {
        return null
      }
    })
  };
  var map__3 = function(f, c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__7247 = cljs.core.seq.call(null, c1);
      var s2__7248 = cljs.core.seq.call(null, c2);
      if(cljs.core.truth_(function() {
        var and__132__auto____7249 = s1__7247;
        if(cljs.core.truth_(and__132__auto____7249)) {
          return s2__7248
        }else {
          return and__132__auto____7249
        }
      }())) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1__7247), cljs.core.first.call(null, s2__7248)), map.call(null, f, cljs.core.rest.call(null, s1__7247), cljs.core.rest.call(null, s2__7248)))
      }else {
        return null
      }
    })
  };
  var map__4 = function(f, c1, c2, c3) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__7250 = cljs.core.seq.call(null, c1);
      var s2__7251 = cljs.core.seq.call(null, c2);
      var s3__7252 = cljs.core.seq.call(null, c3);
      if(cljs.core.truth_(function() {
        var and__132__auto____7253 = s1__7250;
        if(cljs.core.truth_(and__132__auto____7253)) {
          var and__132__auto____7254 = s2__7251;
          if(cljs.core.truth_(and__132__auto____7254)) {
            return s3__7252
          }else {
            return and__132__auto____7254
          }
        }else {
          return and__132__auto____7253
        }
      }())) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1__7250), cljs.core.first.call(null, s2__7251), cljs.core.first.call(null, s3__7252)), map.call(null, f, cljs.core.rest.call(null, s1__7250), cljs.core.rest.call(null, s2__7251), cljs.core.rest.call(null, s3__7252)))
      }else {
        return null
      }
    })
  };
  var map__5 = function() {
    var G__7257__delegate = function(f, c1, c2, c3, colls) {
      var step__7256 = function step(cs) {
        return new cljs.core.LazySeq(null, false, function() {
          var ss__7255 = map.call(null, cljs.core.seq, cs);
          if(cljs.core.every_QMARK_.call(null, cljs.core.identity, ss__7255)) {
            return cljs.core.cons.call(null, map.call(null, cljs.core.first, ss__7255), step.call(null, map.call(null, cljs.core.rest, ss__7255)))
          }else {
            return null
          }
        })
      };
      return map.call(null, function(p1__7196_SHARP_) {
        return cljs.core.apply.call(null, f, p1__7196_SHARP_)
      }, step__7256.call(null, cljs.core.conj.call(null, colls, c3, c2, c1)))
    };
    var G__7257 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__7257__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__7257.cljs$lang$maxFixedArity = 4;
    G__7257.cljs$lang$applyTo = function(arglist__7258) {
      var f = cljs.core.first(arglist__7258);
      var c1 = cljs.core.first(cljs.core.next(arglist__7258));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7258)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7258))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7258))));
      return G__7257__delegate(f, c1, c2, c3, colls)
    };
    G__7257.cljs$lang$arity$variadic = G__7257__delegate;
    return G__7257
  }();
  map = function(f, c1, c2, c3, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return map__2.call(this, f, c1);
      case 3:
        return map__3.call(this, f, c1, c2);
      case 4:
        return map__4.call(this, f, c1, c2, c3);
      default:
        return map__5.cljs$lang$arity$variadic(f, c1, c2, c3, cljs.core.array_seq(arguments, 4))
    }
    throw"Invalid arity: " + arguments.length;
  };
  map.cljs$lang$maxFixedArity = 4;
  map.cljs$lang$applyTo = map__5.cljs$lang$applyTo;
  map.cljs$lang$arity$2 = map__2;
  map.cljs$lang$arity$3 = map__3;
  map.cljs$lang$arity$4 = map__4;
  map.cljs$lang$arity$variadic = map__5.cljs$lang$arity$variadic;
  return map
}();
cljs.core.take = function take(n, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    if(n > 0) {
      var temp__324__auto____7259 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7259)) {
        var s__7260 = temp__324__auto____7259;
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__7260), take.call(null, n - 1, cljs.core.rest.call(null, s__7260)))
      }else {
        return null
      }
    }else {
      return null
    }
  })
};
cljs.core.drop = function drop(n, coll) {
  var step__7263 = function(n, coll) {
    while(true) {
      var s__7261 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(function() {
        var and__132__auto____7262 = n > 0;
        if(and__132__auto____7262) {
          return s__7261
        }else {
          return and__132__auto____7262
        }
      }())) {
        var G__7264 = n - 1;
        var G__7265 = cljs.core.rest.call(null, s__7261);
        n = G__7264;
        coll = G__7265;
        continue
      }else {
        return s__7261
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__7263.call(null, n, coll)
  })
};
cljs.core.drop_last = function() {
  var drop_last = null;
  var drop_last__1 = function(s) {
    return drop_last.call(null, 1, s)
  };
  var drop_last__2 = function(n, s) {
    return cljs.core.map.call(null, function(x, _) {
      return x
    }, s, cljs.core.drop.call(null, n, s))
  };
  drop_last = function(n, s) {
    switch(arguments.length) {
      case 1:
        return drop_last__1.call(this, n);
      case 2:
        return drop_last__2.call(this, n, s)
    }
    throw"Invalid arity: " + arguments.length;
  };
  drop_last.cljs$lang$arity$1 = drop_last__1;
  drop_last.cljs$lang$arity$2 = drop_last__2;
  return drop_last
}();
cljs.core.take_last = function take_last(n, coll) {
  var s__7266 = cljs.core.seq.call(null, coll);
  var lead__7267 = cljs.core.seq.call(null, cljs.core.drop.call(null, n, coll));
  while(true) {
    if(cljs.core.truth_(lead__7267)) {
      var G__7268 = cljs.core.next.call(null, s__7266);
      var G__7269 = cljs.core.next.call(null, lead__7267);
      s__7266 = G__7268;
      lead__7267 = G__7269;
      continue
    }else {
      return s__7266
    }
    break
  }
};
cljs.core.drop_while = function drop_while(pred, coll) {
  var step__7272 = function(pred, coll) {
    while(true) {
      var s__7270 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(function() {
        var and__132__auto____7271 = s__7270;
        if(cljs.core.truth_(and__132__auto____7271)) {
          return pred.call(null, cljs.core.first.call(null, s__7270))
        }else {
          return and__132__auto____7271
        }
      }())) {
        var G__7273 = pred;
        var G__7274 = cljs.core.rest.call(null, s__7270);
        pred = G__7273;
        coll = G__7274;
        continue
      }else {
        return s__7270
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__7272.call(null, pred, coll)
  })
};
cljs.core.cycle = function cycle(coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__324__auto____7275 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____7275)) {
      var s__7276 = temp__324__auto____7275;
      return cljs.core.concat.call(null, s__7276, cycle.call(null, s__7276))
    }else {
      return null
    }
  })
};
cljs.core.split_at = function split_at(n, coll) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take.call(null, n, coll), cljs.core.drop.call(null, n, coll)])
};
cljs.core.repeat = function() {
  var repeat = null;
  var repeat__1 = function(x) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, x, repeat.call(null, x))
    })
  };
  var repeat__2 = function(n, x) {
    return cljs.core.take.call(null, n, repeat.call(null, x))
  };
  repeat = function(n, x) {
    switch(arguments.length) {
      case 1:
        return repeat__1.call(this, n);
      case 2:
        return repeat__2.call(this, n, x)
    }
    throw"Invalid arity: " + arguments.length;
  };
  repeat.cljs$lang$arity$1 = repeat__1;
  repeat.cljs$lang$arity$2 = repeat__2;
  return repeat
}();
cljs.core.replicate = function replicate(n, x) {
  return cljs.core.take.call(null, n, cljs.core.repeat.call(null, x))
};
cljs.core.repeatedly = function() {
  var repeatedly = null;
  var repeatedly__1 = function(f) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, f.call(null), repeatedly.call(null, f))
    })
  };
  var repeatedly__2 = function(n, f) {
    return cljs.core.take.call(null, n, repeatedly.call(null, f))
  };
  repeatedly = function(n, f) {
    switch(arguments.length) {
      case 1:
        return repeatedly__1.call(this, n);
      case 2:
        return repeatedly__2.call(this, n, f)
    }
    throw"Invalid arity: " + arguments.length;
  };
  repeatedly.cljs$lang$arity$1 = repeatedly__1;
  repeatedly.cljs$lang$arity$2 = repeatedly__2;
  return repeatedly
}();
cljs.core.iterate = function iterate(f, x) {
  return cljs.core.cons.call(null, x, new cljs.core.LazySeq(null, false, function() {
    return iterate.call(null, f, f.call(null, x))
  }))
};
cljs.core.interleave = function() {
  var interleave = null;
  var interleave__2 = function(c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__7277 = cljs.core.seq.call(null, c1);
      var s2__7278 = cljs.core.seq.call(null, c2);
      if(cljs.core.truth_(function() {
        var and__132__auto____7279 = s1__7277;
        if(cljs.core.truth_(and__132__auto____7279)) {
          return s2__7278
        }else {
          return and__132__auto____7279
        }
      }())) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s1__7277), cljs.core.cons.call(null, cljs.core.first.call(null, s2__7278), interleave.call(null, cljs.core.rest.call(null, s1__7277), cljs.core.rest.call(null, s2__7278))))
      }else {
        return null
      }
    })
  };
  var interleave__3 = function() {
    var G__7281__delegate = function(c1, c2, colls) {
      return new cljs.core.LazySeq(null, false, function() {
        var ss__7280 = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, colls, c2, c1));
        if(cljs.core.every_QMARK_.call(null, cljs.core.identity, ss__7280)) {
          return cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, ss__7280), cljs.core.apply.call(null, interleave, cljs.core.map.call(null, cljs.core.rest, ss__7280)))
        }else {
          return null
        }
      })
    };
    var G__7281 = function(c1, c2, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7281__delegate.call(this, c1, c2, colls)
    };
    G__7281.cljs$lang$maxFixedArity = 2;
    G__7281.cljs$lang$applyTo = function(arglist__7282) {
      var c1 = cljs.core.first(arglist__7282);
      var c2 = cljs.core.first(cljs.core.next(arglist__7282));
      var colls = cljs.core.rest(cljs.core.next(arglist__7282));
      return G__7281__delegate(c1, c2, colls)
    };
    G__7281.cljs$lang$arity$variadic = G__7281__delegate;
    return G__7281
  }();
  interleave = function(c1, c2, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return interleave__2.call(this, c1, c2);
      default:
        return interleave__3.cljs$lang$arity$variadic(c1, c2, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  interleave.cljs$lang$maxFixedArity = 2;
  interleave.cljs$lang$applyTo = interleave__3.cljs$lang$applyTo;
  interleave.cljs$lang$arity$2 = interleave__2;
  interleave.cljs$lang$arity$variadic = interleave__3.cljs$lang$arity$variadic;
  return interleave
}();
cljs.core.interpose = function interpose(sep, coll) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, sep), coll))
};
cljs.core.flatten1 = function flatten1(colls) {
  var cat__7285 = function cat(coll, colls) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__317__auto____7283 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__317__auto____7283)) {
        var coll__7284 = temp__317__auto____7283;
        return cljs.core.cons.call(null, cljs.core.first.call(null, coll__7284), cat.call(null, cljs.core.rest.call(null, coll__7284), colls))
      }else {
        if(cljs.core.truth_(cljs.core.seq.call(null, colls))) {
          return cat.call(null, cljs.core.first.call(null, colls), cljs.core.rest.call(null, colls))
        }else {
          return null
        }
      }
    })
  };
  return cat__7285.call(null, null, colls)
};
cljs.core.mapcat = function() {
  var mapcat = null;
  var mapcat__2 = function(f, coll) {
    return cljs.core.flatten1.call(null, cljs.core.map.call(null, f, coll))
  };
  var mapcat__3 = function() {
    var G__7286__delegate = function(f, coll, colls) {
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, f, coll, colls))
    };
    var G__7286 = function(f, coll, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7286__delegate.call(this, f, coll, colls)
    };
    G__7286.cljs$lang$maxFixedArity = 2;
    G__7286.cljs$lang$applyTo = function(arglist__7287) {
      var f = cljs.core.first(arglist__7287);
      var coll = cljs.core.first(cljs.core.next(arglist__7287));
      var colls = cljs.core.rest(cljs.core.next(arglist__7287));
      return G__7286__delegate(f, coll, colls)
    };
    G__7286.cljs$lang$arity$variadic = G__7286__delegate;
    return G__7286
  }();
  mapcat = function(f, coll, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return mapcat__2.call(this, f, coll);
      default:
        return mapcat__3.cljs$lang$arity$variadic(f, coll, cljs.core.array_seq(arguments, 2))
    }
    throw"Invalid arity: " + arguments.length;
  };
  mapcat.cljs$lang$maxFixedArity = 2;
  mapcat.cljs$lang$applyTo = mapcat__3.cljs$lang$applyTo;
  mapcat.cljs$lang$arity$2 = mapcat__2;
  mapcat.cljs$lang$arity$variadic = mapcat__3.cljs$lang$arity$variadic;
  return mapcat
}();
cljs.core.filter = function filter(pred, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__324__auto____7288 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____7288)) {
      var s__7289 = temp__324__auto____7288;
      var f__7290 = cljs.core.first.call(null, s__7289);
      var r__7291 = cljs.core.rest.call(null, s__7289);
      if(cljs.core.truth_(pred.call(null, f__7290))) {
        return cljs.core.cons.call(null, f__7290, filter.call(null, pred, r__7291))
      }else {
        return filter.call(null, pred, r__7291)
      }
    }else {
      return null
    }
  })
};
cljs.core.remove = function remove(pred, coll) {
  return cljs.core.filter.call(null, cljs.core.complement.call(null, pred), coll)
};
cljs.core.tree_seq = function tree_seq(branch_QMARK_, children, root) {
  var walk__7293 = function walk(node) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, node, cljs.core.truth_(branch_QMARK_.call(null, node)) ? cljs.core.mapcat.call(null, walk, children.call(null, node)) : null)
    })
  };
  return walk__7293.call(null, root)
};
cljs.core.flatten = function flatten(x) {
  return cljs.core.filter.call(null, function(p1__7292_SHARP_) {
    return cljs.core.not.call(null, cljs.core.sequential_QMARK_.call(null, p1__7292_SHARP_))
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, x)))
};
cljs.core.into = function into(to, from) {
  if(function() {
    var G__7294__7295 = to;
    if(G__7294__7295 != null) {
      if(function() {
        var or__138__auto____7296 = G__7294__7295.cljs$lang$protocol_mask$partition0$ & 2147483648;
        if(or__138__auto____7296) {
          return or__138__auto____7296
        }else {
          return G__7294__7295.cljs$core$IEditableCollection$
        }
      }()) {
        return true
      }else {
        if(!G__7294__7295.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IEditableCollection, G__7294__7295)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IEditableCollection, G__7294__7295)
    }
  }()) {
    return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core.transient$.call(null, to), from))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, to, from)
  }
};
cljs.core.mapv = function() {
  var mapv = null;
  var mapv__2 = function(f, coll) {
    return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(v, o) {
      return cljs.core.conj_BANG_.call(null, v, f.call(null, o))
    }, cljs.core.transient$.call(null, cljs.core.PersistentVector.fromArray([])), coll))
  };
  var mapv__3 = function(f, c1, c2) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.fromArray([]), cljs.core.map.call(null, f, c1, c2))
  };
  var mapv__4 = function(f, c1, c2, c3) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.fromArray([]), cljs.core.map.call(null, f, c1, c2, c3))
  };
  var mapv__5 = function() {
    var G__7297__delegate = function(f, c1, c2, c3, colls) {
      return cljs.core.into.call(null, cljs.core.PersistentVector.fromArray([]), cljs.core.apply.call(null, cljs.core.map, f, c1, c2, c3, colls))
    };
    var G__7297 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__7297__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__7297.cljs$lang$maxFixedArity = 4;
    G__7297.cljs$lang$applyTo = function(arglist__7298) {
      var f = cljs.core.first(arglist__7298);
      var c1 = cljs.core.first(cljs.core.next(arglist__7298));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7298)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7298))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7298))));
      return G__7297__delegate(f, c1, c2, c3, colls)
    };
    G__7297.cljs$lang$arity$variadic = G__7297__delegate;
    return G__7297
  }();
  mapv = function(f, c1, c2, c3, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return mapv__2.call(this, f, c1);
      case 3:
        return mapv__3.call(this, f, c1, c2);
      case 4:
        return mapv__4.call(this, f, c1, c2, c3);
      default:
        return mapv__5.cljs$lang$arity$variadic(f, c1, c2, c3, cljs.core.array_seq(arguments, 4))
    }
    throw"Invalid arity: " + arguments.length;
  };
  mapv.cljs$lang$maxFixedArity = 4;
  mapv.cljs$lang$applyTo = mapv__5.cljs$lang$applyTo;
  mapv.cljs$lang$arity$2 = mapv__2;
  mapv.cljs$lang$arity$3 = mapv__3;
  mapv.cljs$lang$arity$4 = mapv__4;
  mapv.cljs$lang$arity$variadic = mapv__5.cljs$lang$arity$variadic;
  return mapv
}();
cljs.core.filterv = function filterv(pred, coll) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(v, o) {
    if(cljs.core.truth_(pred.call(null, o))) {
      return cljs.core.conj_BANG_.call(null, v, o)
    }else {
      return v
    }
  }, cljs.core.transient$.call(null, cljs.core.PersistentVector.fromArray([])), coll))
};
cljs.core.partition = function() {
  var partition = null;
  var partition__2 = function(n, coll) {
    return partition.call(null, n, n, coll)
  };
  var partition__3 = function(n, step, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__324__auto____7299 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7299)) {
        var s__7300 = temp__324__auto____7299;
        var p__7301 = cljs.core.take.call(null, n, s__7300);
        if(n === cljs.core.count.call(null, p__7301)) {
          return cljs.core.cons.call(null, p__7301, partition.call(null, n, step, cljs.core.drop.call(null, step, s__7300)))
        }else {
          return null
        }
      }else {
        return null
      }
    })
  };
  var partition__4 = function(n, step, pad, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__324__auto____7302 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7302)) {
        var s__7303 = temp__324__auto____7302;
        var p__7304 = cljs.core.take.call(null, n, s__7303);
        if(n === cljs.core.count.call(null, p__7304)) {
          return cljs.core.cons.call(null, p__7304, partition.call(null, n, step, pad, cljs.core.drop.call(null, step, s__7303)))
        }else {
          return cljs.core.list.call(null, cljs.core.take.call(null, n, cljs.core.concat.call(null, p__7304, pad)))
        }
      }else {
        return null
      }
    })
  };
  partition = function(n, step, pad, coll) {
    switch(arguments.length) {
      case 2:
        return partition__2.call(this, n, step);
      case 3:
        return partition__3.call(this, n, step, pad);
      case 4:
        return partition__4.call(this, n, step, pad, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  partition.cljs$lang$arity$2 = partition__2;
  partition.cljs$lang$arity$3 = partition__3;
  partition.cljs$lang$arity$4 = partition__4;
  return partition
}();
cljs.core.get_in = function() {
  var get_in = null;
  var get_in__2 = function(m, ks) {
    return cljs.core.reduce.call(null, cljs.core.get, m, ks)
  };
  var get_in__3 = function(m, ks, not_found) {
    var sentinel__7305 = cljs.core.lookup_sentinel;
    var m__7306 = m;
    var ks__7307 = cljs.core.seq.call(null, ks);
    while(true) {
      if(cljs.core.truth_(ks__7307)) {
        var m__7308 = cljs.core.get.call(null, m__7306, cljs.core.first.call(null, ks__7307), sentinel__7305);
        if(sentinel__7305 === m__7308) {
          return not_found
        }else {
          var G__7309 = sentinel__7305;
          var G__7310 = m__7308;
          var G__7311 = cljs.core.next.call(null, ks__7307);
          sentinel__7305 = G__7309;
          m__7306 = G__7310;
          ks__7307 = G__7311;
          continue
        }
      }else {
        return m__7306
      }
      break
    }
  };
  get_in = function(m, ks, not_found) {
    switch(arguments.length) {
      case 2:
        return get_in__2.call(this, m, ks);
      case 3:
        return get_in__3.call(this, m, ks, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  get_in.cljs$lang$arity$2 = get_in__2;
  get_in.cljs$lang$arity$3 = get_in__3;
  return get_in
}();
cljs.core.assoc_in = function assoc_in(m, p__7312, v) {
  var vec__7313__7314 = p__7312;
  var k__7315 = cljs.core.nth.call(null, vec__7313__7314, 0, null);
  var ks__7316 = cljs.core.nthnext.call(null, vec__7313__7314, 1);
  if(cljs.core.truth_(ks__7316)) {
    return cljs.core.assoc.call(null, m, k__7315, assoc_in.call(null, cljs.core.get.call(null, m, k__7315), ks__7316, v))
  }else {
    return cljs.core.assoc.call(null, m, k__7315, v)
  }
};
cljs.core.update_in = function() {
  var update_in__delegate = function(m, p__7317, f, args) {
    var vec__7318__7319 = p__7317;
    var k__7320 = cljs.core.nth.call(null, vec__7318__7319, 0, null);
    var ks__7321 = cljs.core.nthnext.call(null, vec__7318__7319, 1);
    if(cljs.core.truth_(ks__7321)) {
      return cljs.core.assoc.call(null, m, k__7320, cljs.core.apply.call(null, update_in, cljs.core.get.call(null, m, k__7320), ks__7321, f, args))
    }else {
      return cljs.core.assoc.call(null, m, k__7320, cljs.core.apply.call(null, f, cljs.core.get.call(null, m, k__7320), args))
    }
  };
  var update_in = function(m, p__7317, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
    }
    return update_in__delegate.call(this, m, p__7317, f, args)
  };
  update_in.cljs$lang$maxFixedArity = 3;
  update_in.cljs$lang$applyTo = function(arglist__7322) {
    var m = cljs.core.first(arglist__7322);
    var p__7317 = cljs.core.first(cljs.core.next(arglist__7322));
    var f = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7322)));
    var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7322)));
    return update_in__delegate(m, p__7317, f, args)
  };
  update_in.cljs$lang$arity$variadic = update_in__delegate;
  return update_in
}();
cljs.core.Vector = function(meta, array, __hash) {
  this.meta = meta;
  this.array = array;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 16200095
};
cljs.core.Vector.cljs$lang$type = true;
cljs.core.Vector.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.Vector")
};
cljs.core.Vector.prototype.cljs$core$IHash$ = true;
cljs.core.Vector.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7327 = this;
  var h__2328__auto____7328 = this__7327.__hash;
  if(h__2328__auto____7328 != null) {
    return h__2328__auto____7328
  }else {
    var h__2328__auto____7329 = cljs.core.hash_coll.call(null, coll);
    this__7327.__hash = h__2328__auto____7329;
    return h__2328__auto____7329
  }
};
cljs.core.Vector.prototype.cljs$core$ILookup$ = true;
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7330 = this;
  return cljs.core._nth.call(null, coll, k, null)
};
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7331 = this;
  return cljs.core._nth.call(null, coll, k, not_found)
};
cljs.core.Vector.prototype.cljs$core$IAssociative$ = true;
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__7332 = this;
  var new_array__7333 = cljs.core.aclone.call(null, this__7332.array);
  new_array__7333[k] = v;
  return new cljs.core.Vector(this__7332.meta, new_array__7333, null)
};
cljs.core.Vector.prototype.cljs$core$IFn$ = true;
cljs.core.Vector.prototype.call = function() {
  var G__7362 = null;
  var G__7362__2 = function(tsym7325, k) {
    var this__7334 = this;
    var tsym7325__7335 = this;
    var coll__7336 = tsym7325__7335;
    return cljs.core._lookup.call(null, coll__7336, k)
  };
  var G__7362__3 = function(tsym7326, k, not_found) {
    var this__7337 = this;
    var tsym7326__7338 = this;
    var coll__7339 = tsym7326__7338;
    return cljs.core._lookup.call(null, coll__7339, k, not_found)
  };
  G__7362 = function(tsym7326, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7362__2.call(this, tsym7326, k);
      case 3:
        return G__7362__3.call(this, tsym7326, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7362
}();
cljs.core.Vector.prototype.apply = function(tsym7323, args7324) {
  return tsym7323.call.apply(tsym7323, [tsym7323].concat(cljs.core.aclone.call(null, args7324)))
};
cljs.core.Vector.prototype.cljs$core$ISequential$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7340 = this;
  var new_array__7341 = cljs.core.aclone.call(null, this__7340.array);
  new_array__7341.push(o);
  return new cljs.core.Vector(this__7340.meta, new_array__7341, null)
};
cljs.core.Vector.prototype.toString = function() {
  var this__7342 = this;
  var this$__7343 = this;
  return cljs.core.pr_str.call(null, this$__7343)
};
cljs.core.Vector.prototype.cljs$core$IReduce$ = true;
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(v, f) {
  var this__7344 = this;
  return cljs.core.ci_reduce.call(null, this__7344.array, f)
};
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(v, f, start) {
  var this__7345 = this;
  return cljs.core.ci_reduce.call(null, this__7345.array, f, start)
};
cljs.core.Vector.prototype.cljs$core$ISeqable$ = true;
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7346 = this;
  if(this__7346.array.length > 0) {
    var vector_seq__7347 = function vector_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < this__7346.array.length) {
          return cljs.core.cons.call(null, this__7346.array[i], vector_seq.call(null, i + 1))
        }else {
          return null
        }
      })
    };
    return vector_seq__7347.call(null, 0)
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$ICounted$ = true;
cljs.core.Vector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7348 = this;
  return this__7348.array.length
};
cljs.core.Vector.prototype.cljs$core$IStack$ = true;
cljs.core.Vector.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__7349 = this;
  var count__7350 = this__7349.array.length;
  if(count__7350 > 0) {
    return this__7349.array[count__7350 - 1]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__7351 = this;
  if(this__7351.array.length > 0) {
    var new_array__7352 = cljs.core.aclone.call(null, this__7351.array);
    new_array__7352.pop();
    return new cljs.core.Vector(this__7351.meta, new_array__7352, null)
  }else {
    throw new Error("Can't pop empty vector");
  }
};
cljs.core.Vector.prototype.cljs$core$IVector$ = true;
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__7353 = this;
  return cljs.core._assoc.call(null, coll, n, val)
};
cljs.core.Vector.prototype.cljs$core$IEquiv$ = true;
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7354 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Vector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7355 = this;
  return new cljs.core.Vector(meta, this__7355.array, this__7355.__hash)
};
cljs.core.Vector.prototype.cljs$core$IMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7356 = this;
  return this__7356.meta
};
cljs.core.Vector.prototype.cljs$core$IIndexed$ = true;
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__7358 = this;
  if(function() {
    var and__132__auto____7359 = 0 <= n;
    if(and__132__auto____7359) {
      return n < this__7358.array.length
    }else {
      return and__132__auto____7359
    }
  }()) {
    return this__7358.array[n]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__7360 = this;
  if(function() {
    var and__132__auto____7361 = 0 <= n;
    if(and__132__auto____7361) {
      return n < this__7360.array.length
    }else {
      return and__132__auto____7361
    }
  }()) {
    return this__7360.array[n]
  }else {
    return not_found
  }
};
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7357 = this;
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this__7357.meta)
};
cljs.core.Vector;
cljs.core.Vector.EMPTY = new cljs.core.Vector(null, [], 0);
cljs.core.Vector.fromArray = function(xs) {
  return new cljs.core.Vector(null, xs, null)
};
cljs.core.VectorNode = function(edit, arr) {
  this.edit = edit;
  this.arr = arr
};
cljs.core.VectorNode.cljs$lang$type = true;
cljs.core.VectorNode.cljs$lang$ctorPrSeq = function(this__2419__auto__) {
  return cljs.core.list.call(null, "cljs.core.VectorNode")
};
cljs.core.VectorNode;
cljs.core.pv_fresh_node = function pv_fresh_node(edit) {
  return new cljs.core.VectorNode(edit, cljs.core.make_array.call(null, 32))
};
cljs.core.pv_aget = function pv_aget(node, idx) {
  return node.arr[idx]
};
cljs.core.pv_aset = function pv_aset(node, idx, val) {
  return node.arr[idx] = val
};
cljs.core.pv_clone_node = function pv_clone_node(node) {
  return new cljs.core.VectorNode(node.edit, cljs.core.aclone.call(null, node.arr))
};
cljs.core.tail_off = function tail_off(pv) {
  var cnt__7363 = pv.cnt;
  if(cnt__7363 < 32) {
    return 0
  }else {
    return cnt__7363 - 1 >>> 5 << 5
  }
};
cljs.core.new_path = function new_path(edit, level, node) {
  var ll__7364 = level;
  var ret__7365 = node;
  while(true) {
    if(ll__7364 === 0) {
      return ret__7365
    }else {
      var embed__7366 = ret__7365;
      var r__7367 = cljs.core.pv_fresh_node.call(null, edit);
      var ___7368 = cljs.core.pv_aset.call(null, r__7367, 0, embed__7366);
      var G__7369 = ll__7364 - 5;
      var G__7370 = r__7367;
      ll__7364 = G__7369;
      ret__7365 = G__7370;
      continue
    }
    break
  }
};
cljs.core.push_tail = function push_tail(pv, level, parent, tailnode) {
  var ret__7371 = cljs.core.pv_clone_node.call(null, parent);
  var subidx__7372 = pv.cnt - 1 >>> level & 31;
  if(5 === level) {
    cljs.core.pv_aset.call(null, ret__7371, subidx__7372, tailnode);
    return ret__7371
  }else {
    var temp__317__auto____7373 = cljs.core.pv_aget.call(null, parent, subidx__7372);
    if(cljs.core.truth_(temp__317__auto____7373)) {
      var child__7374 = temp__317__auto____7373;
      var node_to_insert__7375 = push_tail.call(null, pv, level - 5, child__7374, tailnode);
      cljs.core.pv_aset.call(null, ret__7371, subidx__7372, node_to_insert__7375);
      return ret__7371
    }else {
      var node_to_insert__7376 = cljs.core.new_path.call(null, null, level - 5, tailnode);
      cljs.core.pv_aset.call(null, ret__7371, subidx__7372, node_to_insert__7376);
      return ret__7371
    }
  }
};
cljs.core.array_for = function array_for(pv, i) {
  if(function() {
    var and__132__auto____7377 = 0 <= i;
    if(and__132__auto____7377) {
      return i < pv.cnt
    }else {
      return and__132__auto____7377
    }
  }()) {
    if(i >= cljs.core.tail_off.call(null, pv)) {
      return pv.tail
    }else {
      var node__7378 = pv.root;
      var level__7379 = pv.shift;
      while(true) {
        if(level__7379 > 0) {
          var G__7380 = cljs.core.pv_aget.call(null, node__7378, i >>> level__7379 & 31);
          var G__7381 = level__7379 - 5;
          node__7378 = G__7380;
          level__7379 = G__7381;
          continue
        }else {
          return node__7378.arr
        }
        break
      }
    }
  }else {
    throw new Error([cljs.core.str("No item "), cljs.core.str(i), cljs.core.str(" in vector of length "), cljs.core.str(pv.cnt)].join(""));
  }
};
cljs.core.do_assoc = function do_assoc(pv, level, node, i, val) {
  var ret__7382 = cljs.core.pv_clone_node.call(null, node);
  if(level === 0) {
    cljs.core.pv_aset.call(null, ret__7382, i & 31, val);
    return ret__7382
  }else {
    var subidx__7383 = i >>> level & 31;
    cljs.core.pv_aset.call(null, ret__7382, subidx__7383, do_assoc.call(null, pv, level - 5, cljs.core.pv_aget.call(null, node, subidx__7383), i, val));
    return ret__7382
  }
};
cljs.core.pop_tail = function pop_tail(pv, level, node) {
  var subidx__7384 = pv.cnt - 2 >>> level & 31;
  if(level > 5) {
    var new_child__7385 = pop_tail.call(null, pv, level - 5, cljs.core.pv_aget.call(null, node, subidx__7384));
    if(function() {
      var and__132__auto____7386 = new_child__7385 == null;
      if(and__132__auto____7386) {
        return subidx__7384 === 0
      }else {
        return and__132__auto____7386
      }
    }()) {
      return null
    }else {
      var ret__7387 = cljs.core.pv_clone_node.call(null, node);
      cljs.core.pv_aset.call(null, ret__7387, subidx__7384, new_child__7385);
      return ret__7387
    }
  }else {
    if(subidx__7384 === 0) {
      return null
    }else {
      if("\ufdd0'else") {
        var ret__7388 = cljs.core.pv_clone_node.call(null, node);
        cljs.core.pv_aset.call(null, ret__7388, subidx__7384, null);
        return ret__7388
      }else {
        return null
      }
    }
  }
};
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
cljs.core.vector_seq = function vector_seq(v, offset) {
  var c__7389 = cljs.core._count.call(null, v);
  if(c__7389 > 0) {
    if(void 0 === cljs.core.t7390) {
      cljs.core.t7390 = function(c, offset, v, vector_seq, __meta__2353__auto__) {
        this.c = c;
        this.offset = offset;
        this.v = v;
        this.vector_seq = vector_seq;
        this.__meta__2353__auto__ = __meta__2353__auto__;
        this.cljs$lang$protocol_mask$partition1$ = 0;
        this.cljs$lang$protocol_mask$partition0$ = 282263648
      };
      cljs.core.t7390.cljs$lang$type = true;
      cljs.core.t7390.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
        return cljs.core.list.call(null, "cljs.core.t7390")
      };
      cljs.core.t7390.prototype.cljs$core$ISeqable$ = true;
      cljs.core.t7390.prototype.cljs$core$ISeqable$_seq$arity$1 = function(vseq) {
        var this__7391 = this;
        return vseq
      };
      cljs.core.t7390.prototype.cljs$core$ISeq$ = true;
      cljs.core.t7390.prototype.cljs$core$ISeq$_first$arity$1 = function(_) {
        var this__7392 = this;
        return cljs.core._nth.call(null, this__7392.v, this__7392.offset)
      };
      cljs.core.t7390.prototype.cljs$core$ISeq$_rest$arity$1 = function(_) {
        var this__7393 = this;
        var offset__7394 = this__7393.offset + 1;
        if(offset__7394 < this__7393.c) {
          return this__7393.vector_seq.call(null, this__7393.v, offset__7394)
        }else {
          return cljs.core.List.EMPTY
        }
      };
      cljs.core.t7390.prototype.cljs$core$ASeq$ = true;
      cljs.core.t7390.prototype.cljs$core$IEquiv$ = true;
      cljs.core.t7390.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(vseq, other) {
        var this__7395 = this;
        return cljs.core.equiv_sequential.call(null, vseq, other)
      };
      cljs.core.t7390.prototype.cljs$core$ISequential$ = true;
      cljs.core.t7390.prototype.cljs$core$IPrintable$ = true;
      cljs.core.t7390.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(vseq, opts) {
        var this__7396 = this;
        return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, vseq)
      };
      cljs.core.t7390.prototype.cljs$core$IMeta$ = true;
      cljs.core.t7390.prototype.cljs$core$IMeta$_meta$arity$1 = function(___2354__auto__) {
        var this__7397 = this;
        return this__7397.__meta__2353__auto__
      };
      cljs.core.t7390.prototype.cljs$core$IWithMeta$ = true;
      cljs.core.t7390.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(___2354__auto__, __meta__2353__auto__) {
        var this__7398 = this;
        return new cljs.core.t7390(this__7398.c, this__7398.offset, this__7398.v, this__7398.vector_seq, __meta__2353__auto__)
      };
      cljs.core.t7390
    }else {
    }
    return new cljs.core.t7390(c__7389, offset, v, vector_seq, null)
  }else {
    return null
  }
};
cljs.core.PersistentVector = function(meta, cnt, shift, root, tail, __hash) {
  this.meta = meta;
  this.cnt = cnt;
  this.shift = shift;
  this.root = root;
  this.tail = tail;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2164209055
};
cljs.core.PersistentVector.cljs$lang$type = true;
cljs.core.PersistentVector.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentVector")
};
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__7403 = this;
  return new cljs.core.TransientVector(this__7403.cnt, this__7403.shift, cljs.core.tv_editable_root.call(null, this__7403.root), cljs.core.tv_editable_tail.call(null, this__7403.tail))
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7404 = this;
  var h__2328__auto____7405 = this__7404.__hash;
  if(h__2328__auto____7405 != null) {
    return h__2328__auto____7405
  }else {
    var h__2328__auto____7406 = cljs.core.hash_coll.call(null, coll);
    this__7404.__hash = h__2328__auto____7406;
    return h__2328__auto____7406
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7407 = this;
  return cljs.core._nth.call(null, coll, k, null)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7408 = this;
  return cljs.core._nth.call(null, coll, k, not_found)
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__7409 = this;
  if(function() {
    var and__132__auto____7410 = 0 <= k;
    if(and__132__auto____7410) {
      return k < this__7409.cnt
    }else {
      return and__132__auto____7410
    }
  }()) {
    if(cljs.core.tail_off.call(null, coll) <= k) {
      var new_tail__7411 = cljs.core.aclone.call(null, this__7409.tail);
      new_tail__7411[k & 31] = v;
      return new cljs.core.PersistentVector(this__7409.meta, this__7409.cnt, this__7409.shift, this__7409.root, new_tail__7411, null)
    }else {
      return new cljs.core.PersistentVector(this__7409.meta, this__7409.cnt, this__7409.shift, cljs.core.do_assoc.call(null, coll, this__7409.shift, this__7409.root, k, v), this__7409.tail, null)
    }
  }else {
    if(k === this__7409.cnt) {
      return cljs.core._conj.call(null, coll, v)
    }else {
      if("\ufdd0'else") {
        throw new Error([cljs.core.str("Index "), cljs.core.str(k), cljs.core.str(" out of bounds  [0,"), cljs.core.str(this__7409.cnt), cljs.core.str("]")].join(""));
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentVector.prototype.call = function() {
  var G__7456 = null;
  var G__7456__2 = function(tsym7401, k) {
    var this__7412 = this;
    var tsym7401__7413 = this;
    var coll__7414 = tsym7401__7413;
    return cljs.core._lookup.call(null, coll__7414, k)
  };
  var G__7456__3 = function(tsym7402, k, not_found) {
    var this__7415 = this;
    var tsym7402__7416 = this;
    var coll__7417 = tsym7402__7416;
    return cljs.core._lookup.call(null, coll__7417, k, not_found)
  };
  G__7456 = function(tsym7402, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7456__2.call(this, tsym7402, k);
      case 3:
        return G__7456__3.call(this, tsym7402, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7456
}();
cljs.core.PersistentVector.prototype.apply = function(tsym7399, args7400) {
  return tsym7399.call.apply(tsym7399, [tsym7399].concat(cljs.core.aclone.call(null, args7400)))
};
cljs.core.PersistentVector.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(v, f, init) {
  var this__7418 = this;
  var step_init__7419 = [0, init];
  var i__7420 = 0;
  while(true) {
    if(i__7420 < this__7418.cnt) {
      var arr__7421 = cljs.core.array_for.call(null, v, i__7420);
      var len__7422 = arr__7421.length;
      var init__7426 = function() {
        var j__7423 = 0;
        var init__7424 = step_init__7419[1];
        while(true) {
          if(j__7423 < len__7422) {
            var init__7425 = f.call(null, init__7424, j__7423 + i__7420, arr__7421[j__7423]);
            if(cljs.core.reduced_QMARK_.call(null, init__7425)) {
              return init__7425
            }else {
              var G__7457 = j__7423 + 1;
              var G__7458 = init__7425;
              j__7423 = G__7457;
              init__7424 = G__7458;
              continue
            }
          }else {
            step_init__7419[0] = len__7422;
            step_init__7419[1] = init__7424;
            return init__7424
          }
          break
        }
      }();
      if(cljs.core.reduced_QMARK_.call(null, init__7426)) {
        return cljs.core.deref.call(null, init__7426)
      }else {
        var G__7459 = i__7420 + step_init__7419[0];
        i__7420 = G__7459;
        continue
      }
    }else {
      return step_init__7419[1]
    }
    break
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7427 = this;
  if(this__7427.cnt - cljs.core.tail_off.call(null, coll) < 32) {
    var new_tail__7428 = cljs.core.aclone.call(null, this__7427.tail);
    new_tail__7428.push(o);
    return new cljs.core.PersistentVector(this__7427.meta, this__7427.cnt + 1, this__7427.shift, this__7427.root, new_tail__7428, null)
  }else {
    var root_overflow_QMARK___7429 = this__7427.cnt >>> 5 > 1 << this__7427.shift;
    var new_shift__7430 = root_overflow_QMARK___7429 ? this__7427.shift + 5 : this__7427.shift;
    var new_root__7432 = root_overflow_QMARK___7429 ? function() {
      var n_r__7431 = cljs.core.pv_fresh_node.call(null, null);
      cljs.core.pv_aset.call(null, n_r__7431, 0, this__7427.root);
      cljs.core.pv_aset.call(null, n_r__7431, 1, cljs.core.new_path.call(null, null, this__7427.shift, new cljs.core.VectorNode(null, this__7427.tail)));
      return n_r__7431
    }() : cljs.core.push_tail.call(null, coll, this__7427.shift, this__7427.root, new cljs.core.VectorNode(null, this__7427.tail));
    return new cljs.core.PersistentVector(this__7427.meta, this__7427.cnt + 1, new_shift__7430, new_root__7432, [o], null)
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(coll) {
  var this__7433 = this;
  return cljs.core._nth.call(null, coll, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(coll) {
  var this__7434 = this;
  return cljs.core._nth.call(null, coll, 1)
};
cljs.core.PersistentVector.prototype.toString = function() {
  var this__7435 = this;
  var this$__7436 = this;
  return cljs.core.pr_str.call(null, this$__7436)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(v, f) {
  var this__7437 = this;
  return cljs.core.ci_reduce.call(null, v, f)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(v, f, start) {
  var this__7438 = this;
  return cljs.core.ci_reduce.call(null, v, f, start)
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7439 = this;
  return cljs.core.vector_seq.call(null, coll, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7440 = this;
  return this__7440.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__7441 = this;
  if(this__7441.cnt > 0) {
    return cljs.core._nth.call(null, coll, this__7441.cnt - 1)
  }else {
    return null
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__7442 = this;
  if(this__7442.cnt === 0) {
    throw new Error("Can't pop empty vector");
  }else {
    if(1 === this__7442.cnt) {
      return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__7442.meta)
    }else {
      if(1 < this__7442.cnt - cljs.core.tail_off.call(null, coll)) {
        return new cljs.core.PersistentVector(this__7442.meta, this__7442.cnt - 1, this__7442.shift, this__7442.root, this__7442.tail.slice(0, -1), null)
      }else {
        if("\ufdd0'else") {
          var new_tail__7443 = cljs.core.array_for.call(null, coll, this__7442.cnt - 2);
          var nr__7444 = cljs.core.pop_tail.call(null, coll, this__7442.shift, this__7442.root);
          var new_root__7445 = nr__7444 == null ? cljs.core.PersistentVector.EMPTY_NODE : nr__7444;
          var cnt_1__7446 = this__7442.cnt - 1;
          if(function() {
            var and__132__auto____7447 = 5 < this__7442.shift;
            if(and__132__auto____7447) {
              return cljs.core.pv_aget.call(null, new_root__7445, 1) == null
            }else {
              return and__132__auto____7447
            }
          }()) {
            return new cljs.core.PersistentVector(this__7442.meta, cnt_1__7446, this__7442.shift - 5, cljs.core.pv_aget.call(null, new_root__7445, 0), new_tail__7443, null)
          }else {
            return new cljs.core.PersistentVector(this__7442.meta, cnt_1__7446, this__7442.shift, new_root__7445, new_tail__7443, null)
          }
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__7449 = this;
  return cljs.core._assoc.call(null, coll, n, val)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7450 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7451 = this;
  return new cljs.core.PersistentVector(meta, this__7451.cnt, this__7451.shift, this__7451.root, this__7451.tail, this__7451.__hash)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7452 = this;
  return this__7452.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__7453 = this;
  return cljs.core.array_for.call(null, coll, n)[n & 31]
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__7454 = this;
  if(function() {
    var and__132__auto____7455 = 0 <= n;
    if(and__132__auto____7455) {
      return n < this__7454.cnt
    }else {
      return and__132__auto____7455
    }
  }()) {
    return cljs.core._nth.call(null, coll, n)
  }else {
    return not_found
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7448 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__7448.meta)
};
cljs.core.PersistentVector;
cljs.core.PersistentVector.EMPTY_NODE = cljs.core.pv_fresh_node.call(null, null);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, [], 0);
cljs.core.PersistentVector.fromArray = function(xs) {
  var xs__7460 = cljs.core.seq.call(null, xs);
  var out__7461 = cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY);
  while(true) {
    if(cljs.core.truth_(xs__7460)) {
      var G__7462 = cljs.core.next.call(null, xs__7460);
      var G__7463 = cljs.core.conj_BANG_.call(null, out__7461, cljs.core.first.call(null, xs__7460));
      xs__7460 = G__7462;
      out__7461 = G__7463;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__7461)
    }
    break
  }
};
cljs.core.vec = function vec(coll) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.PersistentVector.EMPTY, coll)
};
cljs.core.vector = function() {
  var vector__delegate = function(args) {
    return cljs.core.vec.call(null, args)
  };
  var vector = function(var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return vector__delegate.call(this, args)
  };
  vector.cljs$lang$maxFixedArity = 0;
  vector.cljs$lang$applyTo = function(arglist__7464) {
    var args = cljs.core.seq(arglist__7464);
    return vector__delegate(args)
  };
  vector.cljs$lang$arity$variadic = vector__delegate;
  return vector
}();
cljs.core.Subvec = function(meta, v, start, end, __hash) {
  this.meta = meta;
  this.v = v;
  this.start = start;
  this.end = end;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 16200095
};
cljs.core.Subvec.cljs$lang$type = true;
cljs.core.Subvec.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.Subvec")
};
cljs.core.Subvec.prototype.cljs$core$IHash$ = true;
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7469 = this;
  var h__2328__auto____7470 = this__7469.__hash;
  if(h__2328__auto____7470 != null) {
    return h__2328__auto____7470
  }else {
    var h__2328__auto____7471 = cljs.core.hash_coll.call(null, coll);
    this__7469.__hash = h__2328__auto____7471;
    return h__2328__auto____7471
  }
};
cljs.core.Subvec.prototype.cljs$core$ILookup$ = true;
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7472 = this;
  return cljs.core._nth.call(null, coll, k, null)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7473 = this;
  return cljs.core._nth.call(null, coll, k, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$ = true;
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, key, val) {
  var this__7474 = this;
  var v_pos__7475 = this__7474.start + key;
  return new cljs.core.Subvec(this__7474.meta, cljs.core._assoc.call(null, this__7474.v, v_pos__7475, val), this__7474.start, this__7474.end > v_pos__7475 + 1 ? this__7474.end : v_pos__7475 + 1, null)
};
cljs.core.Subvec.prototype.cljs$core$IFn$ = true;
cljs.core.Subvec.prototype.call = function() {
  var G__7499 = null;
  var G__7499__2 = function(tsym7467, k) {
    var this__7476 = this;
    var tsym7467__7477 = this;
    var coll__7478 = tsym7467__7477;
    return cljs.core._lookup.call(null, coll__7478, k)
  };
  var G__7499__3 = function(tsym7468, k, not_found) {
    var this__7479 = this;
    var tsym7468__7480 = this;
    var coll__7481 = tsym7468__7480;
    return cljs.core._lookup.call(null, coll__7481, k, not_found)
  };
  G__7499 = function(tsym7468, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7499__2.call(this, tsym7468, k);
      case 3:
        return G__7499__3.call(this, tsym7468, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7499
}();
cljs.core.Subvec.prototype.apply = function(tsym7465, args7466) {
  return tsym7465.call.apply(tsym7465, [tsym7465].concat(cljs.core.aclone.call(null, args7466)))
};
cljs.core.Subvec.prototype.cljs$core$ISequential$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7482 = this;
  return new cljs.core.Subvec(this__7482.meta, cljs.core._assoc_n.call(null, this__7482.v, this__7482.end, o), this__7482.start, this__7482.end + 1, null)
};
cljs.core.Subvec.prototype.toString = function() {
  var this__7483 = this;
  var this$__7484 = this;
  return cljs.core.pr_str.call(null, this$__7484)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$ = true;
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var this__7485 = this;
  return cljs.core.ci_reduce.call(null, coll, f)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var this__7486 = this;
  return cljs.core.ci_reduce.call(null, coll, f, start)
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$ = true;
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7487 = this;
  var subvec_seq__7488 = function subvec_seq(i) {
    if(i === this__7487.end) {
      return null
    }else {
      return cljs.core.cons.call(null, cljs.core._nth.call(null, this__7487.v, i), new cljs.core.LazySeq(null, false, function() {
        return subvec_seq.call(null, i + 1)
      }))
    }
  };
  return subvec_seq__7488.call(null, this__7487.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$ = true;
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7489 = this;
  return this__7489.end - this__7489.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$ = true;
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__7490 = this;
  return cljs.core._nth.call(null, this__7490.v, this__7490.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__7491 = this;
  if(this__7491.start === this__7491.end) {
    throw new Error("Can't pop empty vector");
  }else {
    return new cljs.core.Subvec(this__7491.meta, this__7491.v, this__7491.start, this__7491.end - 1, null)
  }
};
cljs.core.Subvec.prototype.cljs$core$IVector$ = true;
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__7492 = this;
  return cljs.core._assoc.call(null, coll, n, val)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$ = true;
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7493 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7494 = this;
  return new cljs.core.Subvec(meta, this__7494.v, this__7494.start, this__7494.end, this__7494.__hash)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7495 = this;
  return this__7495.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$ = true;
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__7497 = this;
  return cljs.core._nth.call(null, this__7497.v, this__7497.start + n)
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__7498 = this;
  return cljs.core._nth.call(null, this__7498.v, this__7498.start + n, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7496 = this;
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this__7496.meta)
};
cljs.core.Subvec;
cljs.core.subvec = function() {
  var subvec = null;
  var subvec__2 = function(v, start) {
    return subvec.call(null, v, start, cljs.core.count.call(null, v))
  };
  var subvec__3 = function(v, start, end) {
    return new cljs.core.Subvec(null, v, start, end, null)
  };
  subvec = function(v, start, end) {
    switch(arguments.length) {
      case 2:
        return subvec__2.call(this, v, start);
      case 3:
        return subvec__3.call(this, v, start, end)
    }
    throw"Invalid arity: " + arguments.length;
  };
  subvec.cljs$lang$arity$2 = subvec__2;
  subvec.cljs$lang$arity$3 = subvec__3;
  return subvec
}();
cljs.core.tv_ensure_editable = function tv_ensure_editable(edit, node) {
  if(edit === node.edit) {
    return node
  }else {
    return new cljs.core.VectorNode(edit, cljs.core.aclone.call(null, node.arr))
  }
};
cljs.core.tv_editable_root = function tv_editable_root(node) {
  return new cljs.core.VectorNode({}, cljs.core.aclone.call(null, node.arr))
};
cljs.core.tv_editable_tail = function tv_editable_tail(tl) {
  var ret__7500 = cljs.core.make_array.call(null, 32);
  cljs.core.array_copy.call(null, tl, 0, ret__7500, 0, tl.length);
  return ret__7500
};
cljs.core.tv_push_tail = function tv_push_tail(tv, level, parent, tail_node) {
  var ret__7501 = cljs.core.tv_ensure_editable.call(null, tv.root.edit, parent);
  var subidx__7502 = tv.cnt - 1 >>> level & 31;
  cljs.core.pv_aset.call(null, ret__7501, subidx__7502, level === 5 ? tail_node : function() {
    var child__7503 = cljs.core.pv_aget.call(null, ret__7501, subidx__7502);
    if(child__7503 != null) {
      return tv_push_tail.call(null, tv, level - 5, child__7503, tail_node)
    }else {
      return cljs.core.new_path.call(null, tv.root.edit, level - 5, tail_node)
    }
  }());
  return ret__7501
};
cljs.core.tv_pop_tail = function tv_pop_tail(tv, level, node) {
  var node__7504 = cljs.core.tv_ensure_editable.call(null, tv.root.edit, node);
  var subidx__7505 = tv.cnt - 2 >>> level & 31;
  if(level > 5) {
    var new_child__7506 = tv_pop_tail.call(null, tv, level - 5, cljs.core.pv_aget.call(null, node__7504, subidx__7505));
    if(function() {
      var and__132__auto____7507 = new_child__7506 == null;
      if(and__132__auto____7507) {
        return subidx__7505 === 0
      }else {
        return and__132__auto____7507
      }
    }()) {
      return null
    }else {
      cljs.core.pv_aset.call(null, node__7504, subidx__7505, new_child__7506);
      return node__7504
    }
  }else {
    if(subidx__7505 === 0) {
      return null
    }else {
      if("\ufdd0'else") {
        cljs.core.pv_aset.call(null, node__7504, subidx__7505, null);
        return node__7504
      }else {
        return null
      }
    }
  }
};
cljs.core.editable_array_for = function editable_array_for(tv, i) {
  if(function() {
    var and__132__auto____7508 = 0 <= i;
    if(and__132__auto____7508) {
      return i < tv.cnt
    }else {
      return and__132__auto____7508
    }
  }()) {
    if(i >= cljs.core.tail_off.call(null, tv)) {
      return tv.tail
    }else {
      var root__7509 = tv.root;
      var node__7510 = root__7509;
      var level__7511 = tv.shift;
      while(true) {
        if(level__7511 > 0) {
          var G__7512 = cljs.core.tv_ensure_editable.call(null, root__7509.edit, cljs.core.pv_aget.call(null, node__7510, i >>> level__7511 & 31));
          var G__7513 = level__7511 - 5;
          node__7510 = G__7512;
          level__7511 = G__7513;
          continue
        }else {
          return node__7510.arr
        }
        break
      }
    }
  }else {
    throw new Error([cljs.core.str("No item "), cljs.core.str(i), cljs.core.str(" in transient vector of length "), cljs.core.str(tv.cnt)].join(""));
  }
};
cljs.core.TransientVector = function(cnt, shift, root, tail) {
  this.cnt = cnt;
  this.shift = shift;
  this.root = root;
  this.tail = tail;
  this.cljs$lang$protocol_mask$partition0$ = 147;
  this.cljs$lang$protocol_mask$partition1$ = 11
};
cljs.core.TransientVector.cljs$lang$type = true;
cljs.core.TransientVector.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.TransientVector")
};
cljs.core.TransientVector.prototype.cljs$core$IFn$ = true;
cljs.core.TransientVector.prototype.call = function() {
  var G__7551 = null;
  var G__7551__2 = function(tsym7516, k) {
    var this__7518 = this;
    var tsym7516__7519 = this;
    var coll__7520 = tsym7516__7519;
    return cljs.core._lookup.call(null, coll__7520, k)
  };
  var G__7551__3 = function(tsym7517, k, not_found) {
    var this__7521 = this;
    var tsym7517__7522 = this;
    var coll__7523 = tsym7517__7522;
    return cljs.core._lookup.call(null, coll__7523, k, not_found)
  };
  G__7551 = function(tsym7517, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7551__2.call(this, tsym7517, k);
      case 3:
        return G__7551__3.call(this, tsym7517, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7551
}();
cljs.core.TransientVector.prototype.apply = function(tsym7514, args7515) {
  return tsym7514.call.apply(tsym7514, [tsym7514].concat(cljs.core.aclone.call(null, args7515)))
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7524 = this;
  return cljs.core._nth.call(null, coll, k, null)
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7525 = this;
  return cljs.core._nth.call(null, coll, k, not_found)
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$ = true;
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__7526 = this;
  if(cljs.core.truth_(this__7526.root.edit)) {
    return cljs.core.array_for.call(null, coll, n)[n & 31]
  }else {
    throw new Error("nth after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__7527 = this;
  if(function() {
    var and__132__auto____7528 = 0 <= n;
    if(and__132__auto____7528) {
      return n < this__7527.cnt
    }else {
      return and__132__auto____7528
    }
  }()) {
    return cljs.core._nth.call(null, coll, n)
  }else {
    return not_found
  }
};
cljs.core.TransientVector.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7529 = this;
  if(cljs.core.truth_(this__7529.root.edit)) {
    return this__7529.cnt
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$ = true;
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = function(tcoll, n, val) {
  var this__7530 = this;
  if(cljs.core.truth_(this__7530.root.edit)) {
    if(function() {
      var and__132__auto____7531 = 0 <= n;
      if(and__132__auto____7531) {
        return n < this__7530.cnt
      }else {
        return and__132__auto____7531
      }
    }()) {
      if(cljs.core.tail_off.call(null, tcoll) <= n) {
        this__7530.tail[n & 31] = val;
        return tcoll
      }else {
        var new_root__7534 = function go(level, node) {
          var node__7532 = cljs.core.tv_ensure_editable.call(null, this__7530.root.edit, node);
          if(level === 0) {
            cljs.core.pv_aset.call(null, node__7532, n & 31, val);
            return node__7532
          }else {
            var subidx__7533 = n >>> level & 31;
            cljs.core.pv_aset.call(null, node__7532, subidx__7533, go.call(null, level - 5, cljs.core.pv_aget.call(null, node__7532, subidx__7533)));
            return node__7532
          }
        }.call(null, this__7530.shift, this__7530.root);
        this__7530.root = new_root__7534;
        return tcoll
      }
    }else {
      if(n === this__7530.cnt) {
        return cljs.core._conj_BANG_.call(null, tcoll, val)
      }else {
        if("\ufdd0'else") {
          throw new Error([cljs.core.str("Index "), cljs.core.str(n), cljs.core.str(" out of bounds for TransientVector of length"), cljs.core.str(this__7530.cnt)].join(""));
        }else {
          return null
        }
      }
    }
  }else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_pop_BANG_$arity$1 = function(tcoll) {
  var this__7535 = this;
  if(cljs.core.truth_(this__7535.root.edit)) {
    if(this__7535.cnt === 0) {
      throw new Error("Can't pop empty vector");
    }else {
      if(1 === this__7535.cnt) {
        this__7535.cnt = 0;
        return tcoll
      }else {
        if((this__7535.cnt - 1 & 31) > 0) {
          this__7535.cnt = this__7535.cnt - 1;
          return tcoll
        }else {
          if("\ufdd0'else") {
            var new_tail__7536 = cljs.core.editable_array_for.call(null, tcoll, this__7535.cnt - 2);
            var new_root__7538 = function() {
              var nr__7537 = cljs.core.tv_pop_tail.call(null, tcoll, this__7535.shift, this__7535.root);
              if(nr__7537 != null) {
                return nr__7537
              }else {
                return new cljs.core.VectorNode(this__7535.root.edit, cljs.core.make_array.call(null, 32))
              }
            }();
            if(function() {
              var and__132__auto____7539 = 5 < this__7535.shift;
              if(and__132__auto____7539) {
                return cljs.core.pv_aget.call(null, new_root__7538, 1) == null
              }else {
                return and__132__auto____7539
              }
            }()) {
              var new_root__7540 = cljs.core.tv_ensure_editable.call(null, this__7535.root.edit, cljs.core.pv_aget.call(null, new_root__7538, 0));
              this__7535.root = new_root__7540;
              this__7535.shift = this__7535.shift - 5;
              this__7535.cnt = this__7535.cnt - 1;
              this__7535.tail = new_tail__7536;
              return tcoll
            }else {
              this__7535.root = new_root__7538;
              this__7535.cnt = this__7535.cnt - 1;
              this__7535.tail = new_tail__7536;
              return tcoll
            }
          }else {
            return null
          }
        }
      }
    }
  }else {
    throw new Error("pop! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$ = true;
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var this__7541 = this;
  return cljs.core._assoc_n_BANG_.call(null, tcoll, key, val)
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__7542 = this;
  if(cljs.core.truth_(this__7542.root.edit)) {
    if(this__7542.cnt - cljs.core.tail_off.call(null, tcoll) < 32) {
      this__7542.tail[this__7542.cnt & 31] = o;
      this__7542.cnt = this__7542.cnt + 1;
      return tcoll
    }else {
      var tail_node__7543 = new cljs.core.VectorNode(this__7542.root.edit, this__7542.tail);
      var new_tail__7544 = cljs.core.make_array.call(null, 32);
      new_tail__7544[0] = o;
      this__7542.tail = new_tail__7544;
      if(this__7542.cnt >>> 5 > 1 << this__7542.shift) {
        var new_root_array__7545 = cljs.core.make_array.call(null, 32);
        var new_shift__7546 = this__7542.shift + 5;
        new_root_array__7545[0] = this__7542.root;
        new_root_array__7545[1] = cljs.core.new_path.call(null, this__7542.root.edit, this__7542.shift, tail_node__7543);
        this__7542.root = new cljs.core.VectorNode(this__7542.root.edit, new_root_array__7545);
        this__7542.shift = new_shift__7546;
        this__7542.cnt = this__7542.cnt + 1;
        return tcoll
      }else {
        var new_root__7547 = cljs.core.tv_push_tail.call(null, tcoll, this__7542.shift, this__7542.root, tail_node__7543);
        this__7542.root = new_root__7547;
        this__7542.cnt = this__7542.cnt + 1;
        return tcoll
      }
    }
  }else {
    throw new Error("conj! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__7548 = this;
  if(cljs.core.truth_(this__7548.root.edit)) {
    this__7548.root.edit = null;
    var len__7549 = this__7548.cnt - cljs.core.tail_off.call(null, tcoll);
    var trimmed_tail__7550 = cljs.core.make_array.call(null, len__7549);
    cljs.core.array_copy.call(null, this__7548.tail, 0, trimmed_tail__7550, 0, len__7549);
    return new cljs.core.PersistentVector(null, this__7548.cnt, this__7548.shift, this__7548.root, trimmed_tail__7550, null)
  }else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientVector;
cljs.core.PersistentQueueSeq = function(meta, front, rear, __hash) {
  this.meta = meta;
  this.front = front;
  this.rear = rear;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 15925324
};
cljs.core.PersistentQueueSeq.cljs$lang$type = true;
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7552 = this;
  var h__2328__auto____7553 = this__7552.__hash;
  if(h__2328__auto____7553 != null) {
    return h__2328__auto____7553
  }else {
    var h__2328__auto____7554 = cljs.core.hash_coll.call(null, coll);
    this__7552.__hash = h__2328__auto____7554;
    return h__2328__auto____7554
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7555 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  var this__7556 = this;
  var this$__7557 = this;
  return cljs.core.pr_str.call(null, this$__7557)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7558 = this;
  return coll
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__7559 = this;
  return cljs.core._first.call(null, this__7559.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__7560 = this;
  var temp__317__auto____7561 = cljs.core.next.call(null, this__7560.front);
  if(cljs.core.truth_(temp__317__auto____7561)) {
    var f1__7562 = temp__317__auto____7561;
    return new cljs.core.PersistentQueueSeq(this__7560.meta, f1__7562, this__7560.rear, null)
  }else {
    if(this__7560.rear == null) {
      return cljs.core._empty.call(null, coll)
    }else {
      return new cljs.core.PersistentQueueSeq(this__7560.meta, this__7560.rear, null, null)
    }
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7563 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7564 = this;
  return new cljs.core.PersistentQueueSeq(meta, this__7564.front, this__7564.rear, this__7564.__hash)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7565 = this;
  return this__7565.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7566 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__7566.meta)
};
cljs.core.PersistentQueueSeq;
cljs.core.PersistentQueue = function(meta, count, front, rear, __hash) {
  this.meta = meta;
  this.count = count;
  this.front = front;
  this.rear = rear;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 15929422
};
cljs.core.PersistentQueue.cljs$lang$type = true;
cljs.core.PersistentQueue.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentQueue")
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7567 = this;
  var h__2328__auto____7568 = this__7567.__hash;
  if(h__2328__auto____7568 != null) {
    return h__2328__auto____7568
  }else {
    var h__2328__auto____7569 = cljs.core.hash_coll.call(null, coll);
    this__7567.__hash = h__2328__auto____7569;
    return h__2328__auto____7569
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7570 = this;
  if(cljs.core.truth_(this__7570.front)) {
    return new cljs.core.PersistentQueue(this__7570.meta, this__7570.count + 1, this__7570.front, cljs.core.conj.call(null, function() {
      var or__138__auto____7571 = this__7570.rear;
      if(cljs.core.truth_(or__138__auto____7571)) {
        return or__138__auto____7571
      }else {
        return cljs.core.PersistentVector.fromArray([])
      }
    }(), o), null)
  }else {
    return new cljs.core.PersistentQueue(this__7570.meta, this__7570.count + 1, cljs.core.conj.call(null, this__7570.front, o), cljs.core.PersistentVector.fromArray([]), null)
  }
};
cljs.core.PersistentQueue.prototype.toString = function() {
  var this__7572 = this;
  var this$__7573 = this;
  return cljs.core.pr_str.call(null, this$__7573)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7574 = this;
  var rear__7575 = cljs.core.seq.call(null, this__7574.rear);
  if(cljs.core.truth_(function() {
    var or__138__auto____7576 = this__7574.front;
    if(cljs.core.truth_(or__138__auto____7576)) {
      return or__138__auto____7576
    }else {
      return rear__7575
    }
  }())) {
    return new cljs.core.PersistentQueueSeq(null, this__7574.front, cljs.core.seq.call(null, rear__7575), null, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7577 = this;
  return this__7577.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__7578 = this;
  return cljs.core._first.call(null, this__7578.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__7579 = this;
  if(cljs.core.truth_(this__7579.front)) {
    var temp__317__auto____7580 = cljs.core.next.call(null, this__7579.front);
    if(cljs.core.truth_(temp__317__auto____7580)) {
      var f1__7581 = temp__317__auto____7580;
      return new cljs.core.PersistentQueue(this__7579.meta, this__7579.count - 1, f1__7581, this__7579.rear, null)
    }else {
      return new cljs.core.PersistentQueue(this__7579.meta, this__7579.count - 1, cljs.core.seq.call(null, this__7579.rear), cljs.core.PersistentVector.fromArray([]), null)
    }
  }else {
    return coll
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__7582 = this;
  return cljs.core.first.call(null, this__7582.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__7583 = this;
  return cljs.core.rest.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7584 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7585 = this;
  return new cljs.core.PersistentQueue(meta, this__7585.count, this__7585.front, this__7585.rear, this__7585.__hash)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7586 = this;
  return this__7586.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7587 = this;
  return cljs.core.PersistentQueue.EMPTY
};
cljs.core.PersistentQueue;
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.fromArray([]), 0);
cljs.core.NeverEquiv = function() {
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1048576
};
cljs.core.NeverEquiv.cljs$lang$type = true;
cljs.core.NeverEquiv.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.NeverEquiv")
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$ = true;
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var this__7588 = this;
  return false
};
cljs.core.NeverEquiv;
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function equiv_map(x, y) {
  return cljs.core.boolean$.call(null, cljs.core.map_QMARK_.call(null, y) ? cljs.core.count.call(null, x) === cljs.core.count.call(null, y) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(xkv) {
    return cljs.core._EQ_.call(null, cljs.core.get.call(null, y, cljs.core.first.call(null, xkv), cljs.core.never_equiv), cljs.core.second.call(null, xkv))
  }, x)) : null : null)
};
cljs.core.scan_array = function scan_array(incr, k, array) {
  var len__7589 = array.length;
  var i__7590 = 0;
  while(true) {
    if(i__7590 < len__7589) {
      if(cljs.core._EQ_.call(null, k, array[i__7590])) {
        return i__7590
      }else {
        var G__7591 = i__7590 + incr;
        i__7590 = G__7591;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.obj_map_contains_key_QMARK_ = function() {
  var obj_map_contains_key_QMARK_ = null;
  var obj_map_contains_key_QMARK___2 = function(k, strobj) {
    return obj_map_contains_key_QMARK_.call(null, k, strobj, true, false)
  };
  var obj_map_contains_key_QMARK___4 = function(k, strobj, true_val, false_val) {
    if(cljs.core.truth_(function() {
      var and__132__auto____7592 = goog.isString.call(null, k);
      if(cljs.core.truth_(and__132__auto____7592)) {
        return strobj.hasOwnProperty(k)
      }else {
        return and__132__auto____7592
      }
    }())) {
      return true_val
    }else {
      return false_val
    }
  };
  obj_map_contains_key_QMARK_ = function(k, strobj, true_val, false_val) {
    switch(arguments.length) {
      case 2:
        return obj_map_contains_key_QMARK___2.call(this, k, strobj);
      case 4:
        return obj_map_contains_key_QMARK___4.call(this, k, strobj, true_val, false_val)
    }
    throw"Invalid arity: " + arguments.length;
  };
  obj_map_contains_key_QMARK_.cljs$lang$arity$2 = obj_map_contains_key_QMARK___2;
  obj_map_contains_key_QMARK_.cljs$lang$arity$4 = obj_map_contains_key_QMARK___4;
  return obj_map_contains_key_QMARK_
}();
cljs.core.obj_map_compare_keys = function obj_map_compare_keys(a, b) {
  var a__7593 = cljs.core.hash.call(null, a);
  var b__7594 = cljs.core.hash.call(null, b);
  if(a__7593 < b__7594) {
    return-1
  }else {
    if(a__7593 > b__7594) {
      return 1
    }else {
      if("\ufdd0'else") {
        return 0
      }else {
        return null
      }
    }
  }
};
cljs.core.obj_map__GT_hash_map = function obj_map__GT_hash_map(m, k, v) {
  var ks__7596 = m.keys;
  var len__7597 = ks__7596.length;
  var so__7598 = m.strobj;
  var out__7599 = cljs.core.with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, cljs.core.meta.call(null, m));
  var i__7600 = 0;
  var out__7601 = cljs.core.transient$.call(null, out__7599);
  while(true) {
    if(i__7600 < len__7597) {
      var k__7602 = ks__7596[i__7600];
      var G__7603 = i__7600 + 1;
      var G__7604 = cljs.core.assoc_BANG_.call(null, out__7601, k__7602, so__7598[k__7602]);
      i__7600 = G__7603;
      out__7601 = G__7604;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, out__7601, k, v))
    }
    break
  }
};
cljs.core.ObjMap = function(meta, keys, strobj, update_count, __hash) {
  this.meta = meta;
  this.keys = keys;
  this.strobj = strobj;
  this.update_count = update_count;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2155021199
};
cljs.core.ObjMap.cljs$lang$type = true;
cljs.core.ObjMap.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.ObjMap")
};
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__7609 = this;
  return cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.hash_map.call(null), coll))
};
cljs.core.ObjMap.prototype.cljs$core$IHash$ = true;
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7610 = this;
  var h__2328__auto____7611 = this__7610.__hash;
  if(h__2328__auto____7611 != null) {
    return h__2328__auto____7611
  }else {
    var h__2328__auto____7612 = cljs.core.hash_imap.call(null, coll);
    this__7610.__hash = h__2328__auto____7612;
    return h__2328__auto____7612
  }
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$ = true;
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7613 = this;
  return cljs.core._lookup.call(null, coll, k, null)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7614 = this;
  return cljs.core.obj_map_contains_key_QMARK_.call(null, k, this__7614.strobj, this__7614.strobj[k], not_found)
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__7615 = this;
  if(cljs.core.truth_(goog.isString.call(null, k))) {
    var overwrite_QMARK___7616 = this__7615.strobj.hasOwnProperty(k);
    if(cljs.core.truth_(overwrite_QMARK___7616)) {
      var new_strobj__7617 = goog.object.clone.call(null, this__7615.strobj);
      new_strobj__7617[k] = v;
      return new cljs.core.ObjMap(this__7615.meta, this__7615.keys, new_strobj__7617, this__7615.update_count + 1, null)
    }else {
      if(this__7615.update_count < cljs.core.ObjMap.HASHMAP_THRESHOLD) {
        var new_strobj__7618 = goog.object.clone.call(null, this__7615.strobj);
        var new_keys__7619 = cljs.core.aclone.call(null, this__7615.keys);
        new_strobj__7618[k] = v;
        new_keys__7619.push(k);
        return new cljs.core.ObjMap(this__7615.meta, new_keys__7619, new_strobj__7618, this__7615.update_count + 1, null)
      }else {
        return cljs.core.obj_map__GT_hash_map.call(null, coll, k, v)
      }
    }
  }else {
    return cljs.core.obj_map__GT_hash_map.call(null, coll, k, v)
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__7620 = this;
  return cljs.core.obj_map_contains_key_QMARK_.call(null, k, this__7620.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IFn$ = true;
cljs.core.ObjMap.prototype.call = function() {
  var G__7640 = null;
  var G__7640__2 = function(tsym7607, k) {
    var this__7621 = this;
    var tsym7607__7622 = this;
    var coll__7623 = tsym7607__7622;
    return cljs.core._lookup.call(null, coll__7623, k)
  };
  var G__7640__3 = function(tsym7608, k, not_found) {
    var this__7624 = this;
    var tsym7608__7625 = this;
    var coll__7626 = tsym7608__7625;
    return cljs.core._lookup.call(null, coll__7626, k, not_found)
  };
  G__7640 = function(tsym7608, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7640__2.call(this, tsym7608, k);
      case 3:
        return G__7640__3.call(this, tsym7608, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7640
}();
cljs.core.ObjMap.prototype.apply = function(tsym7605, args7606) {
  return tsym7605.call.apply(tsym7605, [tsym7605].concat(cljs.core.aclone.call(null, args7606)))
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__7627 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.ObjMap.prototype.toString = function() {
  var this__7628 = this;
  var this$__7629 = this;
  return cljs.core.pr_str.call(null, this$__7629)
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7630 = this;
  if(this__7630.keys.length > 0) {
    return cljs.core.map.call(null, function(p1__7595_SHARP_) {
      return cljs.core.vector.call(null, p1__7595_SHARP_, this__7630.strobj[p1__7595_SHARP_])
    }, this__7630.keys.sort(cljs.core.obj_map_compare_keys))
  }else {
    return null
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7631 = this;
  return this__7631.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7632 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7633 = this;
  return new cljs.core.ObjMap(meta, this__7633.keys, this__7633.strobj, this__7633.update_count, this__7633.__hash)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7634 = this;
  return this__7634.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7635 = this;
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this__7635.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__7636 = this;
  if(cljs.core.truth_(function() {
    var and__132__auto____7637 = goog.isString.call(null, k);
    if(cljs.core.truth_(and__132__auto____7637)) {
      return this__7636.strobj.hasOwnProperty(k)
    }else {
      return and__132__auto____7637
    }
  }())) {
    var new_keys__7638 = cljs.core.aclone.call(null, this__7636.keys);
    var new_strobj__7639 = goog.object.clone.call(null, this__7636.strobj);
    new_keys__7638.splice(cljs.core.scan_array.call(null, 1, k, new_keys__7638), 1);
    cljs.core.js_delete.call(null, new_strobj__7639, k);
    return new cljs.core.ObjMap(this__7636.meta, new_keys__7638, new_strobj__7639, this__7636.update_count + 1, null)
  }else {
    return coll
  }
};
cljs.core.ObjMap;
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], {}, 0, 0);
cljs.core.ObjMap.HASHMAP_THRESHOLD = 32;
cljs.core.ObjMap.fromObject = function(ks, obj) {
  return new cljs.core.ObjMap(null, ks, obj, 0, null)
};
cljs.core.HashMap = function(meta, count, hashobj, __hash) {
  this.meta = meta;
  this.count = count;
  this.hashobj = hashobj;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 7537551
};
cljs.core.HashMap.cljs$lang$type = true;
cljs.core.HashMap.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.HashMap")
};
cljs.core.HashMap.prototype.cljs$core$IHash$ = true;
cljs.core.HashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7646 = this;
  var h__2328__auto____7647 = this__7646.__hash;
  if(h__2328__auto____7647 != null) {
    return h__2328__auto____7647
  }else {
    var h__2328__auto____7648 = cljs.core.hash_imap.call(null, coll);
    this__7646.__hash = h__2328__auto____7648;
    return h__2328__auto____7648
  }
};
cljs.core.HashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7649 = this;
  return cljs.core._lookup.call(null, coll, k, null)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7650 = this;
  var bucket__7651 = this__7650.hashobj[cljs.core.hash.call(null, k)];
  var i__7652 = cljs.core.truth_(bucket__7651) ? cljs.core.scan_array.call(null, 2, k, bucket__7651) : null;
  if(cljs.core.truth_(i__7652)) {
    return bucket__7651[i__7652 + 1]
  }else {
    return not_found
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__7653 = this;
  var h__7654 = cljs.core.hash.call(null, k);
  var bucket__7655 = this__7653.hashobj[h__7654];
  if(cljs.core.truth_(bucket__7655)) {
    var new_bucket__7656 = cljs.core.aclone.call(null, bucket__7655);
    var new_hashobj__7657 = goog.object.clone.call(null, this__7653.hashobj);
    new_hashobj__7657[h__7654] = new_bucket__7656;
    var temp__317__auto____7658 = cljs.core.scan_array.call(null, 2, k, new_bucket__7656);
    if(cljs.core.truth_(temp__317__auto____7658)) {
      var i__7659 = temp__317__auto____7658;
      new_bucket__7656[i__7659 + 1] = v;
      return new cljs.core.HashMap(this__7653.meta, this__7653.count, new_hashobj__7657, null)
    }else {
      new_bucket__7656.push(k, v);
      return new cljs.core.HashMap(this__7653.meta, this__7653.count + 1, new_hashobj__7657, null)
    }
  }else {
    var new_hashobj__7660 = goog.object.clone.call(null, this__7653.hashobj);
    new_hashobj__7660[h__7654] = [k, v];
    return new cljs.core.HashMap(this__7653.meta, this__7653.count + 1, new_hashobj__7660, null)
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__7661 = this;
  var bucket__7662 = this__7661.hashobj[cljs.core.hash.call(null, k)];
  var i__7663 = cljs.core.truth_(bucket__7662) ? cljs.core.scan_array.call(null, 2, k, bucket__7662) : null;
  if(cljs.core.truth_(i__7663)) {
    return true
  }else {
    return false
  }
};
cljs.core.HashMap.prototype.cljs$core$IFn$ = true;
cljs.core.HashMap.prototype.call = function() {
  var G__7686 = null;
  var G__7686__2 = function(tsym7644, k) {
    var this__7664 = this;
    var tsym7644__7665 = this;
    var coll__7666 = tsym7644__7665;
    return cljs.core._lookup.call(null, coll__7666, k)
  };
  var G__7686__3 = function(tsym7645, k, not_found) {
    var this__7667 = this;
    var tsym7645__7668 = this;
    var coll__7669 = tsym7645__7668;
    return cljs.core._lookup.call(null, coll__7669, k, not_found)
  };
  G__7686 = function(tsym7645, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7686__2.call(this, tsym7645, k);
      case 3:
        return G__7686__3.call(this, tsym7645, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7686
}();
cljs.core.HashMap.prototype.apply = function(tsym7642, args7643) {
  return tsym7642.call.apply(tsym7642, [tsym7642].concat(cljs.core.aclone.call(null, args7643)))
};
cljs.core.HashMap.prototype.cljs$core$ICollection$ = true;
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__7670 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.HashMap.prototype.toString = function() {
  var this__7671 = this;
  var this$__7672 = this;
  return cljs.core.pr_str.call(null, this$__7672)
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7673 = this;
  if(this__7673.count > 0) {
    var hashes__7674 = cljs.core.js_keys.call(null, this__7673.hashobj).sort();
    return cljs.core.mapcat.call(null, function(p1__7641_SHARP_) {
      return cljs.core.map.call(null, cljs.core.vec, cljs.core.partition.call(null, 2, this__7673.hashobj[p1__7641_SHARP_]))
    }, hashes__7674)
  }else {
    return null
  }
};
cljs.core.HashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.HashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7675 = this;
  return this__7675.count
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7676 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7677 = this;
  return new cljs.core.HashMap(meta, this__7677.count, this__7677.hashobj, this__7677.__hash)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7678 = this;
  return this__7678.meta
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7679 = this;
  return cljs.core.with_meta.call(null, cljs.core.HashMap.EMPTY, this__7679.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMap$ = true;
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__7680 = this;
  var h__7681 = cljs.core.hash.call(null, k);
  var bucket__7682 = this__7680.hashobj[h__7681];
  var i__7683 = cljs.core.truth_(bucket__7682) ? cljs.core.scan_array.call(null, 2, k, bucket__7682) : null;
  if(cljs.core.not.call(null, i__7683)) {
    return coll
  }else {
    var new_hashobj__7684 = goog.object.clone.call(null, this__7680.hashobj);
    if(3 > bucket__7682.length) {
      cljs.core.js_delete.call(null, new_hashobj__7684, h__7681)
    }else {
      var new_bucket__7685 = cljs.core.aclone.call(null, bucket__7682);
      new_bucket__7685.splice(i__7683, 2);
      new_hashobj__7684[h__7681] = new_bucket__7685
    }
    return new cljs.core.HashMap(this__7680.meta, this__7680.count - 1, new_hashobj__7684, null)
  }
};
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, {}, 0);
cljs.core.HashMap.fromArrays = function(ks, vs) {
  var len__7687 = ks.length;
  var i__7688 = 0;
  var out__7689 = cljs.core.HashMap.EMPTY;
  while(true) {
    if(i__7688 < len__7687) {
      var G__7690 = i__7688 + 1;
      var G__7691 = cljs.core.assoc.call(null, out__7689, ks[i__7688], vs[i__7688]);
      i__7688 = G__7690;
      out__7689 = G__7691;
      continue
    }else {
      return out__7689
    }
    break
  }
};
cljs.core.array_map_index_of = function array_map_index_of(m, k) {
  var arr__7692 = m.arr;
  var len__7693 = arr__7692.length;
  var i__7694 = 0;
  while(true) {
    if(len__7693 <= i__7694) {
      return-1
    }else {
      if(cljs.core._EQ_.call(null, arr__7692[i__7694], k)) {
        return i__7694
      }else {
        if("\ufdd0'else") {
          var G__7695 = i__7694 + 2;
          i__7694 = G__7695;
          continue
        }else {
          return null
        }
      }
    }
    break
  }
};
void 0;
cljs.core.PersistentArrayMap = function(meta, cnt, arr, __hash) {
  this.meta = meta;
  this.cnt = cnt;
  this.arr = arr;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2155545487
};
cljs.core.PersistentArrayMap.cljs$lang$type = true;
cljs.core.PersistentArrayMap.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentArrayMap")
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__7700 = this;
  return new cljs.core.TransientArrayMap({}, this__7700.arr.length, cljs.core.aclone.call(null, this__7700.arr))
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7701 = this;
  var h__2328__auto____7702 = this__7701.__hash;
  if(h__2328__auto____7702 != null) {
    return h__2328__auto____7702
  }else {
    var h__2328__auto____7703 = cljs.core.hash_imap.call(null, coll);
    this__7701.__hash = h__2328__auto____7703;
    return h__2328__auto____7703
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7704 = this;
  return cljs.core._lookup.call(null, coll, k, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7705 = this;
  var idx__7706 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__7706 === -1) {
    return not_found
  }else {
    return this__7705.arr[idx__7706 + 1]
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__7707 = this;
  var idx__7708 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__7708 === -1) {
    if(this__7707.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
      return new cljs.core.PersistentArrayMap(this__7707.meta, this__7707.cnt + 1, function() {
        var G__7709__7710 = cljs.core.aclone.call(null, this__7707.arr);
        G__7709__7710.push(k);
        G__7709__7710.push(v);
        return G__7709__7710
      }(), null)
    }else {
      return cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, coll)), k, v))
    }
  }else {
    if(v === this__7707.arr[idx__7708 + 1]) {
      return coll
    }else {
      if("\ufdd0'else") {
        return new cljs.core.PersistentArrayMap(this__7707.meta, this__7707.cnt, function() {
          var G__7711__7712 = cljs.core.aclone.call(null, this__7707.arr);
          G__7711__7712[idx__7708 + 1] = v;
          return G__7711__7712
        }(), null)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__7713 = this;
  return cljs.core.array_map_index_of.call(null, coll, k) != -1
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentArrayMap.prototype.call = function() {
  var G__7743 = null;
  var G__7743__2 = function(tsym7698, k) {
    var this__7714 = this;
    var tsym7698__7715 = this;
    var coll__7716 = tsym7698__7715;
    return cljs.core._lookup.call(null, coll__7716, k)
  };
  var G__7743__3 = function(tsym7699, k, not_found) {
    var this__7717 = this;
    var tsym7699__7718 = this;
    var coll__7719 = tsym7699__7718;
    return cljs.core._lookup.call(null, coll__7719, k, not_found)
  };
  G__7743 = function(tsym7699, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7743__2.call(this, tsym7699, k);
      case 3:
        return G__7743__3.call(this, tsym7699, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7743
}();
cljs.core.PersistentArrayMap.prototype.apply = function(tsym7696, args7697) {
  return tsym7696.call.apply(tsym7696, [tsym7696].concat(cljs.core.aclone.call(null, args7697)))
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__7720 = this;
  var len__7721 = this__7720.arr.length;
  var i__7722 = 0;
  var init__7723 = init;
  while(true) {
    if(i__7722 < len__7721) {
      var init__7724 = f.call(null, init__7723, this__7720.arr[i__7722], this__7720.arr[i__7722 + 1]);
      if(cljs.core.reduced_QMARK_.call(null, init__7724)) {
        return cljs.core.deref.call(null, init__7724)
      }else {
        var G__7744 = i__7722 + 2;
        var G__7745 = init__7724;
        i__7722 = G__7744;
        init__7723 = G__7745;
        continue
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__7725 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentArrayMap.prototype.toString = function() {
  var this__7726 = this;
  var this$__7727 = this;
  return cljs.core.pr_str.call(null, this$__7727)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7728 = this;
  if(this__7728.cnt > 0) {
    var len__7729 = this__7728.arr.length;
    var array_map_seq__7730 = function array_map_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < len__7729) {
          return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([this__7728.arr[i], this__7728.arr[i + 1]]), array_map_seq.call(null, i + 2))
        }else {
          return null
        }
      })
    };
    return array_map_seq__7730.call(null, 0)
  }else {
    return null
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7731 = this;
  return this__7731.cnt
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7732 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7733 = this;
  return new cljs.core.PersistentArrayMap(meta, this__7733.cnt, this__7733.arr, this__7733.__hash)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7734 = this;
  return this__7734.meta
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7735 = this;
  return cljs.core._with_meta.call(null, cljs.core.PersistentArrayMap.EMPTY, this__7735.meta)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__7736 = this;
  var idx__7737 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__7737 >= 0) {
    var len__7738 = this__7736.arr.length;
    var new_len__7739 = len__7738 - 2;
    if(new_len__7739 === 0) {
      return cljs.core._empty.call(null, coll)
    }else {
      var new_arr__7740 = cljs.core.make_array.call(null, new_len__7739);
      var s__7741 = 0;
      var d__7742 = 0;
      while(true) {
        if(s__7741 >= len__7738) {
          return new cljs.core.PersistentArrayMap(this__7736.meta, this__7736.cnt - 1, new_arr__7740, null)
        }else {
          if(cljs.core._EQ_.call(null, k, this__7736.arr[s__7741])) {
            var G__7746 = s__7741 + 2;
            var G__7747 = d__7742;
            s__7741 = G__7746;
            d__7742 = G__7747;
            continue
          }else {
            if("\ufdd0'else") {
              new_arr__7740[d__7742] = this__7736.arr[s__7741];
              new_arr__7740[d__7742 + 1] = this__7736.arr[s__7741 + 1];
              var G__7748 = s__7741 + 2;
              var G__7749 = d__7742 + 2;
              s__7741 = G__7748;
              d__7742 = G__7749;
              continue
            }else {
              return null
            }
          }
        }
        break
      }
    }
  }else {
    return coll
  }
};
cljs.core.PersistentArrayMap;
cljs.core.PersistentArrayMap.EMPTY = new cljs.core.PersistentArrayMap(null, 0, [], null);
cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD = 16;
cljs.core.PersistentArrayMap.fromArrays = function(ks, vs) {
  var len__7750 = cljs.core.count.call(null, ks);
  var i__7751 = 0;
  var out__7752 = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);
  while(true) {
    if(i__7751 < len__7750) {
      var G__7753 = i__7751 + 1;
      var G__7754 = cljs.core.assoc_BANG_.call(null, out__7752, ks[i__7751], vs[i__7751]);
      i__7751 = G__7753;
      out__7752 = G__7754;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__7752)
    }
    break
  }
};
void 0;
cljs.core.TransientArrayMap = function(editable_QMARK_, len, arr) {
  this.editable_QMARK_ = editable_QMARK_;
  this.len = len;
  this.arr = arr;
  this.cljs$lang$protocol_mask$partition1$ = 7;
  this.cljs$lang$protocol_mask$partition0$ = 130
};
cljs.core.TransientArrayMap.cljs$lang$type = true;
cljs.core.TransientArrayMap.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.TransientArrayMap")
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(tcoll, key) {
  var this__7755 = this;
  if(cljs.core.truth_(this__7755.editable_QMARK_)) {
    var idx__7756 = cljs.core.array_map_index_of.call(null, tcoll, key);
    if(idx__7756 >= 0) {
      this__7755.arr[idx__7756] = this__7755.arr[this__7755.len - 2];
      this__7755.arr[idx__7756 + 1] = this__7755.arr[this__7755.len - 1];
      var G__7757__7758 = this__7755.arr;
      G__7757__7758.pop();
      G__7757__7758.pop();
      G__7757__7758;
      this__7755.len = this__7755.len - 2
    }else {
    }
    return tcoll
  }else {
    throw new Error("dissoc! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var this__7759 = this;
  if(cljs.core.truth_(this__7759.editable_QMARK_)) {
    var idx__7760 = cljs.core.array_map_index_of.call(null, tcoll, key);
    if(idx__7760 === -1) {
      if(this__7759.len + 2 <= 2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
        this__7759.len = this__7759.len + 2;
        this__7759.arr.push(key);
        this__7759.arr.push(val);
        return tcoll
      }else {
        return cljs.core.assoc_BANG_.call(null, cljs.core.array__GT_transient_hash_map.call(null, this__7759.len, this__7759.arr), key, val)
      }
    }else {
      if(val === this__7759.arr[idx__7760 + 1]) {
        return tcoll
      }else {
        this__7759.arr[idx__7760 + 1] = val;
        return tcoll
      }
    }
  }else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__7761 = this;
  if(cljs.core.truth_(this__7761.editable_QMARK_)) {
    if(function() {
      var G__7762__7763 = o;
      if(G__7762__7763 != null) {
        if(function() {
          var or__138__auto____7764 = G__7762__7763.cljs$lang$protocol_mask$partition0$ & 1024;
          if(or__138__auto____7764) {
            return or__138__auto____7764
          }else {
            return G__7762__7763.cljs$core$IMapEntry$
          }
        }()) {
          return true
        }else {
          if(!G__7762__7763.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__7762__7763)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__7762__7763)
      }
    }()) {
      return cljs.core._assoc_BANG_.call(null, tcoll, cljs.core.key.call(null, o), cljs.core.val.call(null, o))
    }else {
      var es__7765 = cljs.core.seq.call(null, o);
      var tcoll__7766 = tcoll;
      while(true) {
        var temp__317__auto____7767 = cljs.core.first.call(null, es__7765);
        if(cljs.core.truth_(temp__317__auto____7767)) {
          var e__7768 = temp__317__auto____7767;
          var G__7774 = cljs.core.next.call(null, es__7765);
          var G__7775 = cljs.core._assoc_BANG_.call(null, tcoll__7766, cljs.core.key.call(null, e__7768), cljs.core.val.call(null, e__7768));
          es__7765 = G__7774;
          tcoll__7766 = G__7775;
          continue
        }else {
          return tcoll__7766
        }
        break
      }
    }
  }else {
    throw new Error("conj! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__7769 = this;
  if(cljs.core.truth_(this__7769.editable_QMARK_)) {
    this__7769.editable_QMARK_ = false;
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, this__7769.len, 2), this__7769.arr, null)
  }else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, k) {
  var this__7770 = this;
  return cljs.core._lookup.call(null, tcoll, k, null)
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, k, not_found) {
  var this__7771 = this;
  if(cljs.core.truth_(this__7771.editable_QMARK_)) {
    var idx__7772 = cljs.core.array_map_index_of.call(null, tcoll, k);
    if(idx__7772 === -1) {
      return not_found
    }else {
      return this__7771.arr[idx__7772 + 1]
    }
  }else {
    throw new Error("lookup after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(tcoll) {
  var this__7773 = this;
  if(cljs.core.truth_(this__7773.editable_QMARK_)) {
    return cljs.core.quot.call(null, this__7773.len, 2)
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientArrayMap;
void 0;
cljs.core.array__GT_transient_hash_map = function array__GT_transient_hash_map(len, arr) {
  var out__7776 = cljs.core.transient$.call(null, cljs.core.ObjMap.fromObject([], {}));
  var i__7777 = 0;
  while(true) {
    if(i__7777 < len) {
      var G__7778 = cljs.core.assoc_BANG_.call(null, out__7776, arr[i__7777], arr[i__7777 + 1]);
      var G__7779 = i__7777 + 2;
      out__7776 = G__7778;
      i__7777 = G__7779;
      continue
    }else {
      return out__7776
    }
    break
  }
};
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
cljs.core.mask = function mask(hash, shift) {
  return hash >>> shift & 31
};
cljs.core.clone_and_set = function() {
  var clone_and_set = null;
  var clone_and_set__3 = function(arr, i, a) {
    var G__7780__7781 = cljs.core.aclone.call(null, arr);
    G__7780__7781[i] = a;
    return G__7780__7781
  };
  var clone_and_set__5 = function(arr, i, a, j, b) {
    var G__7782__7783 = cljs.core.aclone.call(null, arr);
    G__7782__7783[i] = a;
    G__7782__7783[j] = b;
    return G__7782__7783
  };
  clone_and_set = function(arr, i, a, j, b) {
    switch(arguments.length) {
      case 3:
        return clone_and_set__3.call(this, arr, i, a);
      case 5:
        return clone_and_set__5.call(this, arr, i, a, j, b)
    }
    throw"Invalid arity: " + arguments.length;
  };
  clone_and_set.cljs$lang$arity$3 = clone_and_set__3;
  clone_and_set.cljs$lang$arity$5 = clone_and_set__5;
  return clone_and_set
}();
cljs.core.remove_pair = function remove_pair(arr, i) {
  var new_arr__7784 = cljs.core.make_array.call(null, arr.length - 2);
  cljs.core.array_copy.call(null, arr, 0, new_arr__7784, 0, 2 * i);
  cljs.core.array_copy.call(null, arr, 2 * (i + 1), new_arr__7784, 2 * i, new_arr__7784.length - 2 * i);
  return new_arr__7784
};
cljs.core.bitmap_indexed_node_index = function bitmap_indexed_node_index(bitmap, bit) {
  return cljs.core.bit_count.call(null, bitmap & bit - 1)
};
cljs.core.bitpos = function bitpos(hash, shift) {
  return 1 << (hash >>> shift & 31)
};
cljs.core.edit_and_set = function() {
  var edit_and_set = null;
  var edit_and_set__4 = function(inode, edit, i, a) {
    var editable__7785 = inode.ensure_editable(edit);
    editable__7785.arr[i] = a;
    return editable__7785
  };
  var edit_and_set__6 = function(inode, edit, i, a, j, b) {
    var editable__7786 = inode.ensure_editable(edit);
    editable__7786.arr[i] = a;
    editable__7786.arr[j] = b;
    return editable__7786
  };
  edit_and_set = function(inode, edit, i, a, j, b) {
    switch(arguments.length) {
      case 4:
        return edit_and_set__4.call(this, inode, edit, i, a);
      case 6:
        return edit_and_set__6.call(this, inode, edit, i, a, j, b)
    }
    throw"Invalid arity: " + arguments.length;
  };
  edit_and_set.cljs$lang$arity$4 = edit_and_set__4;
  edit_and_set.cljs$lang$arity$6 = edit_and_set__6;
  return edit_and_set
}();
cljs.core.inode_kv_reduce = function inode_kv_reduce(arr, f, init) {
  var len__7787 = arr.length;
  var i__7788 = 0;
  var init__7789 = init;
  while(true) {
    if(i__7788 < len__7787) {
      var init__7792 = function() {
        var k__7790 = arr[i__7788];
        if(k__7790 != null) {
          return f.call(null, init__7789, k__7790, arr[i__7788 + 1])
        }else {
          var node__7791 = arr[i__7788 + 1];
          if(node__7791 != null) {
            return node__7791.kv_reduce(f, init__7789)
          }else {
            return init__7789
          }
        }
      }();
      if(cljs.core.reduced_QMARK_.call(null, init__7792)) {
        return cljs.core.deref.call(null, init__7792)
      }else {
        var G__7793 = i__7788 + 2;
        var G__7794 = init__7792;
        i__7788 = G__7793;
        init__7789 = G__7794;
        continue
      }
    }else {
      return init__7789
    }
    break
  }
};
void 0;
cljs.core.BitmapIndexedNode = function(edit, bitmap, arr) {
  this.edit = edit;
  this.bitmap = bitmap;
  this.arr = arr
};
cljs.core.BitmapIndexedNode.cljs$lang$type = true;
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.BitmapIndexedNode")
};
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = function(e, bit, i) {
  var this__7795 = this;
  var inode__7796 = this;
  if(this__7795.bitmap === bit) {
    return null
  }else {
    var editable__7797 = inode__7796.ensure_editable(e);
    var earr__7798 = editable__7797.arr;
    var len__7799 = earr__7798.length;
    editable__7797.bitmap = bit ^ editable__7797.bitmap;
    cljs.core.array_copy.call(null, earr__7798, 2 * (i + 1), earr__7798, 2 * i, len__7799 - 2 * (i + 1));
    earr__7798[len__7799 - 2] = null;
    earr__7798[len__7799 - 1] = null;
    return editable__7797
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__7800 = this;
  var inode__7801 = this;
  var bit__7802 = 1 << (hash >>> shift & 31);
  var idx__7803 = cljs.core.bitmap_indexed_node_index.call(null, this__7800.bitmap, bit__7802);
  if((this__7800.bitmap & bit__7802) === 0) {
    var n__7804 = cljs.core.bit_count.call(null, this__7800.bitmap);
    if(2 * n__7804 < this__7800.arr.length) {
      var editable__7805 = inode__7801.ensure_editable(edit);
      var earr__7806 = editable__7805.arr;
      added_leaf_QMARK_[0] = true;
      cljs.core.array_copy_downward.call(null, earr__7806, 2 * idx__7803, earr__7806, 2 * (idx__7803 + 1), 2 * (n__7804 - idx__7803));
      earr__7806[2 * idx__7803] = key;
      earr__7806[2 * idx__7803 + 1] = val;
      editable__7805.bitmap = editable__7805.bitmap | bit__7802;
      return editable__7805
    }else {
      if(n__7804 >= 16) {
        var nodes__7807 = cljs.core.make_array.call(null, 32);
        var jdx__7808 = hash >>> shift & 31;
        nodes__7807[jdx__7808] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
        var i__7809 = 0;
        var j__7810 = 0;
        while(true) {
          if(i__7809 < 32) {
            if((this__7800.bitmap >>> i__7809 & 1) === 0) {
              var G__7863 = i__7809 + 1;
              var G__7864 = j__7810;
              i__7809 = G__7863;
              j__7810 = G__7864;
              continue
            }else {
              nodes__7807[i__7809] = null != this__7800.arr[j__7810] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, cljs.core.hash.call(null, this__7800.arr[j__7810]), this__7800.arr[j__7810], this__7800.arr[j__7810 + 1], added_leaf_QMARK_) : this__7800.arr[j__7810 + 1];
              var G__7865 = i__7809 + 1;
              var G__7866 = j__7810 + 2;
              i__7809 = G__7865;
              j__7810 = G__7866;
              continue
            }
          }else {
          }
          break
        }
        return new cljs.core.ArrayNode(edit, n__7804 + 1, nodes__7807)
      }else {
        if("\ufdd0'else") {
          var new_arr__7811 = cljs.core.make_array.call(null, 2 * (n__7804 + 4));
          cljs.core.array_copy.call(null, this__7800.arr, 0, new_arr__7811, 0, 2 * idx__7803);
          new_arr__7811[2 * idx__7803] = key;
          added_leaf_QMARK_[0] = true;
          new_arr__7811[2 * idx__7803 + 1] = val;
          cljs.core.array_copy.call(null, this__7800.arr, 2 * idx__7803, new_arr__7811, 2 * (idx__7803 + 1), 2 * (n__7804 - idx__7803));
          var editable__7812 = inode__7801.ensure_editable(edit);
          editable__7812.arr = new_arr__7811;
          editable__7812.bitmap = editable__7812.bitmap | bit__7802;
          return editable__7812
        }else {
          return null
        }
      }
    }
  }else {
    var key_or_nil__7813 = this__7800.arr[2 * idx__7803];
    var val_or_node__7814 = this__7800.arr[2 * idx__7803 + 1];
    if(null == key_or_nil__7813) {
      var n__7815 = val_or_node__7814.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
      if(n__7815 === val_or_node__7814) {
        return inode__7801
      }else {
        return cljs.core.edit_and_set.call(null, inode__7801, edit, 2 * idx__7803 + 1, n__7815)
      }
    }else {
      if(cljs.core._EQ_.call(null, key, key_or_nil__7813)) {
        if(val === val_or_node__7814) {
          return inode__7801
        }else {
          return cljs.core.edit_and_set.call(null, inode__7801, edit, 2 * idx__7803 + 1, val)
        }
      }else {
        if("\ufdd0'else") {
          added_leaf_QMARK_[0] = true;
          return cljs.core.edit_and_set.call(null, inode__7801, edit, 2 * idx__7803, null, 2 * idx__7803 + 1, cljs.core.create_node.call(null, edit, shift + 5, key_or_nil__7813, val_or_node__7814, hash, key, val))
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  var this__7816 = this;
  var inode__7817 = this;
  return cljs.core.create_inode_seq.call(null, this__7816.arr)
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__7818 = this;
  var inode__7819 = this;
  var bit__7820 = 1 << (hash >>> shift & 31);
  if((this__7818.bitmap & bit__7820) === 0) {
    return inode__7819
  }else {
    var idx__7821 = cljs.core.bitmap_indexed_node_index.call(null, this__7818.bitmap, bit__7820);
    var key_or_nil__7822 = this__7818.arr[2 * idx__7821];
    var val_or_node__7823 = this__7818.arr[2 * idx__7821 + 1];
    if(null == key_or_nil__7822) {
      var n__7824 = val_or_node__7823.inode_without_BANG_(edit, shift + 5, hash, key, removed_leaf_QMARK_);
      if(n__7824 === val_or_node__7823) {
        return inode__7819
      }else {
        if(null != n__7824) {
          return cljs.core.edit_and_set.call(null, inode__7819, edit, 2 * idx__7821 + 1, n__7824)
        }else {
          if(this__7818.bitmap === bit__7820) {
            return null
          }else {
            if("\ufdd0'else") {
              return inode__7819.edit_and_remove_pair(edit, bit__7820, idx__7821)
            }else {
              return null
            }
          }
        }
      }
    }else {
      if(cljs.core._EQ_.call(null, key, key_or_nil__7822)) {
        removed_leaf_QMARK_[0] = true;
        return inode__7819.edit_and_remove_pair(edit, bit__7820, idx__7821)
      }else {
        if("\ufdd0'else") {
          return inode__7819
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(e) {
  var this__7825 = this;
  var inode__7826 = this;
  if(e === this__7825.edit) {
    return inode__7826
  }else {
    var n__7827 = cljs.core.bit_count.call(null, this__7825.bitmap);
    var new_arr__7828 = cljs.core.make_array.call(null, n__7827 < 0 ? 4 : 2 * (n__7827 + 1));
    cljs.core.array_copy.call(null, this__7825.arr, 0, new_arr__7828, 0, 2 * n__7827);
    return new cljs.core.BitmapIndexedNode(e, this__7825.bitmap, new_arr__7828)
  }
};
cljs.core.BitmapIndexedNode.prototype.kv_reduce = function(f, init) {
  var this__7829 = this;
  var inode__7830 = this;
  return cljs.core.inode_kv_reduce.call(null, this__7829.arr, f, init)
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function() {
  var G__7867 = null;
  var G__7867__3 = function(shift, hash, key) {
    var this__7831 = this;
    var inode__7832 = this;
    var bit__7833 = 1 << (hash >>> shift & 31);
    if((this__7831.bitmap & bit__7833) === 0) {
      return null
    }else {
      var idx__7834 = cljs.core.bitmap_indexed_node_index.call(null, this__7831.bitmap, bit__7833);
      var key_or_nil__7835 = this__7831.arr[2 * idx__7834];
      var val_or_node__7836 = this__7831.arr[2 * idx__7834 + 1];
      if(null == key_or_nil__7835) {
        return val_or_node__7836.inode_find(shift + 5, hash, key)
      }else {
        if(cljs.core._EQ_.call(null, key, key_or_nil__7835)) {
          return cljs.core.PersistentVector.fromArray([key_or_nil__7835, val_or_node__7836])
        }else {
          if("\ufdd0'else") {
            return null
          }else {
            return null
          }
        }
      }
    }
  };
  var G__7867__4 = function(shift, hash, key, not_found) {
    var this__7837 = this;
    var inode__7838 = this;
    var bit__7839 = 1 << (hash >>> shift & 31);
    if((this__7837.bitmap & bit__7839) === 0) {
      return not_found
    }else {
      var idx__7840 = cljs.core.bitmap_indexed_node_index.call(null, this__7837.bitmap, bit__7839);
      var key_or_nil__7841 = this__7837.arr[2 * idx__7840];
      var val_or_node__7842 = this__7837.arr[2 * idx__7840 + 1];
      if(null == key_or_nil__7841) {
        return val_or_node__7842.inode_find(shift + 5, hash, key, not_found)
      }else {
        if(cljs.core._EQ_.call(null, key, key_or_nil__7841)) {
          return cljs.core.PersistentVector.fromArray([key_or_nil__7841, val_or_node__7842])
        }else {
          if("\ufdd0'else") {
            return not_found
          }else {
            return null
          }
        }
      }
    }
  };
  G__7867 = function(shift, hash, key, not_found) {
    switch(arguments.length) {
      case 3:
        return G__7867__3.call(this, shift, hash, key);
      case 4:
        return G__7867__4.call(this, shift, hash, key, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7867
}();
cljs.core.BitmapIndexedNode.prototype.inode_without = function(shift, hash, key) {
  var this__7843 = this;
  var inode__7844 = this;
  var bit__7845 = 1 << (hash >>> shift & 31);
  if((this__7843.bitmap & bit__7845) === 0) {
    return inode__7844
  }else {
    var idx__7846 = cljs.core.bitmap_indexed_node_index.call(null, this__7843.bitmap, bit__7845);
    var key_or_nil__7847 = this__7843.arr[2 * idx__7846];
    var val_or_node__7848 = this__7843.arr[2 * idx__7846 + 1];
    if(null == key_or_nil__7847) {
      var n__7849 = val_or_node__7848.inode_without(shift + 5, hash, key);
      if(n__7849 === val_or_node__7848) {
        return inode__7844
      }else {
        if(null != n__7849) {
          return new cljs.core.BitmapIndexedNode(null, this__7843.bitmap, cljs.core.clone_and_set.call(null, this__7843.arr, 2 * idx__7846 + 1, n__7849))
        }else {
          if(this__7843.bitmap === bit__7845) {
            return null
          }else {
            if("\ufdd0'else") {
              return new cljs.core.BitmapIndexedNode(null, this__7843.bitmap ^ bit__7845, cljs.core.remove_pair.call(null, this__7843.arr, idx__7846))
            }else {
              return null
            }
          }
        }
      }
    }else {
      if(cljs.core._EQ_.call(null, key, key_or_nil__7847)) {
        return new cljs.core.BitmapIndexedNode(null, this__7843.bitmap ^ bit__7845, cljs.core.remove_pair.call(null, this__7843.arr, idx__7846))
      }else {
        if("\ufdd0'else") {
          return inode__7844
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var this__7850 = this;
  var inode__7851 = this;
  var bit__7852 = 1 << (hash >>> shift & 31);
  var idx__7853 = cljs.core.bitmap_indexed_node_index.call(null, this__7850.bitmap, bit__7852);
  if((this__7850.bitmap & bit__7852) === 0) {
    var n__7854 = cljs.core.bit_count.call(null, this__7850.bitmap);
    if(n__7854 >= 16) {
      var nodes__7855 = cljs.core.make_array.call(null, 32);
      var jdx__7856 = hash >>> shift & 31;
      nodes__7855[jdx__7856] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
      var i__7857 = 0;
      var j__7858 = 0;
      while(true) {
        if(i__7857 < 32) {
          if((this__7850.bitmap >>> i__7857 & 1) === 0) {
            var G__7868 = i__7857 + 1;
            var G__7869 = j__7858;
            i__7857 = G__7868;
            j__7858 = G__7869;
            continue
          }else {
            nodes__7855[i__7857] = null != this__7850.arr[j__7858] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, cljs.core.hash.call(null, this__7850.arr[j__7858]), this__7850.arr[j__7858], this__7850.arr[j__7858 + 1], added_leaf_QMARK_) : this__7850.arr[j__7858 + 1];
            var G__7870 = i__7857 + 1;
            var G__7871 = j__7858 + 2;
            i__7857 = G__7870;
            j__7858 = G__7871;
            continue
          }
        }else {
        }
        break
      }
      return new cljs.core.ArrayNode(null, n__7854 + 1, nodes__7855)
    }else {
      var new_arr__7859 = cljs.core.make_array.call(null, 2 * (n__7854 + 1));
      cljs.core.array_copy.call(null, this__7850.arr, 0, new_arr__7859, 0, 2 * idx__7853);
      new_arr__7859[2 * idx__7853] = key;
      added_leaf_QMARK_[0] = true;
      new_arr__7859[2 * idx__7853 + 1] = val;
      cljs.core.array_copy.call(null, this__7850.arr, 2 * idx__7853, new_arr__7859, 2 * (idx__7853 + 1), 2 * (n__7854 - idx__7853));
      return new cljs.core.BitmapIndexedNode(null, this__7850.bitmap | bit__7852, new_arr__7859)
    }
  }else {
    var key_or_nil__7860 = this__7850.arr[2 * idx__7853];
    var val_or_node__7861 = this__7850.arr[2 * idx__7853 + 1];
    if(null == key_or_nil__7860) {
      var n__7862 = val_or_node__7861.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
      if(n__7862 === val_or_node__7861) {
        return inode__7851
      }else {
        return new cljs.core.BitmapIndexedNode(null, this__7850.bitmap, cljs.core.clone_and_set.call(null, this__7850.arr, 2 * idx__7853 + 1, n__7862))
      }
    }else {
      if(cljs.core._EQ_.call(null, key, key_or_nil__7860)) {
        if(val === val_or_node__7861) {
          return inode__7851
        }else {
          return new cljs.core.BitmapIndexedNode(null, this__7850.bitmap, cljs.core.clone_and_set.call(null, this__7850.arr, 2 * idx__7853 + 1, val))
        }
      }else {
        if("\ufdd0'else") {
          added_leaf_QMARK_[0] = true;
          return new cljs.core.BitmapIndexedNode(null, this__7850.bitmap, cljs.core.clone_and_set.call(null, this__7850.arr, 2 * idx__7853, null, 2 * idx__7853 + 1, cljs.core.create_node.call(null, shift + 5, key_or_nil__7860, val_or_node__7861, hash, key, val)))
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode;
cljs.core.BitmapIndexedNode.EMPTY = new cljs.core.BitmapIndexedNode(null, 0, cljs.core.make_array.call(null, 0));
cljs.core.pack_array_node = function pack_array_node(array_node, edit, idx) {
  var arr__7872 = array_node.arr;
  var len__7873 = 2 * (array_node.cnt - 1);
  var new_arr__7874 = cljs.core.make_array.call(null, len__7873);
  var i__7875 = 0;
  var j__7876 = 1;
  var bitmap__7877 = 0;
  while(true) {
    if(i__7875 < len__7873) {
      if(function() {
        var and__132__auto____7878 = i__7875 != idx;
        if(and__132__auto____7878) {
          return null != arr__7872[i__7875]
        }else {
          return and__132__auto____7878
        }
      }()) {
        new_arr__7874[j__7876] = arr__7872[i__7875];
        var G__7879 = i__7875 + 1;
        var G__7880 = j__7876 + 2;
        var G__7881 = bitmap__7877 | 1 << i__7875;
        i__7875 = G__7879;
        j__7876 = G__7880;
        bitmap__7877 = G__7881;
        continue
      }else {
        var G__7882 = i__7875 + 1;
        var G__7883 = j__7876;
        var G__7884 = bitmap__7877;
        i__7875 = G__7882;
        j__7876 = G__7883;
        bitmap__7877 = G__7884;
        continue
      }
    }else {
      return new cljs.core.BitmapIndexedNode(edit, bitmap__7877, new_arr__7874)
    }
    break
  }
};
cljs.core.ArrayNode = function(edit, cnt, arr) {
  this.edit = edit;
  this.cnt = cnt;
  this.arr = arr
};
cljs.core.ArrayNode.cljs$lang$type = true;
cljs.core.ArrayNode.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.ArrayNode")
};
cljs.core.ArrayNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var this__7885 = this;
  var inode__7886 = this;
  var idx__7887 = hash >>> shift & 31;
  var node__7888 = this__7885.arr[idx__7887];
  if(null == node__7888) {
    return new cljs.core.ArrayNode(null, this__7885.cnt + 1, cljs.core.clone_and_set.call(null, this__7885.arr, idx__7887, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_)))
  }else {
    var n__7889 = node__7888.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
    if(n__7889 === node__7888) {
      return inode__7886
    }else {
      return new cljs.core.ArrayNode(null, this__7885.cnt, cljs.core.clone_and_set.call(null, this__7885.arr, idx__7887, n__7889))
    }
  }
};
cljs.core.ArrayNode.prototype.inode_without = function(shift, hash, key) {
  var this__7890 = this;
  var inode__7891 = this;
  var idx__7892 = hash >>> shift & 31;
  var node__7893 = this__7890.arr[idx__7892];
  if(null != node__7893) {
    var n__7894 = node__7893.inode_without(shift + 5, hash, key);
    if(n__7894 === node__7893) {
      return inode__7891
    }else {
      if(n__7894 == null) {
        if(this__7890.cnt <= 8) {
          return cljs.core.pack_array_node.call(null, inode__7891, null, idx__7892)
        }else {
          return new cljs.core.ArrayNode(null, this__7890.cnt - 1, cljs.core.clone_and_set.call(null, this__7890.arr, idx__7892, n__7894))
        }
      }else {
        if("\ufdd0'else") {
          return new cljs.core.ArrayNode(null, this__7890.cnt, cljs.core.clone_and_set.call(null, this__7890.arr, idx__7892, n__7894))
        }else {
          return null
        }
      }
    }
  }else {
    return inode__7891
  }
};
cljs.core.ArrayNode.prototype.inode_find = function() {
  var G__7926 = null;
  var G__7926__3 = function(shift, hash, key) {
    var this__7895 = this;
    var inode__7896 = this;
    var idx__7897 = hash >>> shift & 31;
    var node__7898 = this__7895.arr[idx__7897];
    if(null != node__7898) {
      return node__7898.inode_find(shift + 5, hash, key)
    }else {
      return null
    }
  };
  var G__7926__4 = function(shift, hash, key, not_found) {
    var this__7899 = this;
    var inode__7900 = this;
    var idx__7901 = hash >>> shift & 31;
    var node__7902 = this__7899.arr[idx__7901];
    if(null != node__7902) {
      return node__7902.inode_find(shift + 5, hash, key, not_found)
    }else {
      return not_found
    }
  };
  G__7926 = function(shift, hash, key, not_found) {
    switch(arguments.length) {
      case 3:
        return G__7926__3.call(this, shift, hash, key);
      case 4:
        return G__7926__4.call(this, shift, hash, key, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7926
}();
cljs.core.ArrayNode.prototype.inode_seq = function() {
  var this__7903 = this;
  var inode__7904 = this;
  return cljs.core.create_array_node_seq.call(null, this__7903.arr)
};
cljs.core.ArrayNode.prototype.ensure_editable = function(e) {
  var this__7905 = this;
  var inode__7906 = this;
  if(e === this__7905.edit) {
    return inode__7906
  }else {
    return new cljs.core.ArrayNode(e, this__7905.cnt, cljs.core.aclone.call(null, this__7905.arr))
  }
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__7907 = this;
  var inode__7908 = this;
  var idx__7909 = hash >>> shift & 31;
  var node__7910 = this__7907.arr[idx__7909];
  if(null == node__7910) {
    var editable__7911 = cljs.core.edit_and_set.call(null, inode__7908, edit, idx__7909, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_));
    editable__7911.cnt = editable__7911.cnt + 1;
    return editable__7911
  }else {
    var n__7912 = node__7910.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
    if(n__7912 === node__7910) {
      return inode__7908
    }else {
      return cljs.core.edit_and_set.call(null, inode__7908, edit, idx__7909, n__7912)
    }
  }
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__7913 = this;
  var inode__7914 = this;
  var idx__7915 = hash >>> shift & 31;
  var node__7916 = this__7913.arr[idx__7915];
  if(null == node__7916) {
    return inode__7914
  }else {
    var n__7917 = node__7916.inode_without_BANG_(edit, shift + 5, hash, key, removed_leaf_QMARK_);
    if(n__7917 === node__7916) {
      return inode__7914
    }else {
      if(null == n__7917) {
        if(this__7913.cnt <= 8) {
          return cljs.core.pack_array_node.call(null, inode__7914, edit, idx__7915)
        }else {
          var editable__7918 = cljs.core.edit_and_set.call(null, inode__7914, edit, idx__7915, n__7917);
          editable__7918.cnt = editable__7918.cnt - 1;
          return editable__7918
        }
      }else {
        if("\ufdd0'else") {
          return cljs.core.edit_and_set.call(null, inode__7914, edit, idx__7915, n__7917)
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.ArrayNode.prototype.kv_reduce = function(f, init) {
  var this__7919 = this;
  var inode__7920 = this;
  var len__7921 = this__7919.arr.length;
  var i__7922 = 0;
  var init__7923 = init;
  while(true) {
    if(i__7922 < len__7921) {
      var node__7924 = this__7919.arr[i__7922];
      if(node__7924 != null) {
        var init__7925 = node__7924.kv_reduce(f, init__7923);
        if(cljs.core.reduced_QMARK_.call(null, init__7925)) {
          return cljs.core.deref.call(null, init__7925)
        }else {
          var G__7927 = i__7922 + 1;
          var G__7928 = init__7925;
          i__7922 = G__7927;
          init__7923 = G__7928;
          continue
        }
      }else {
        return null
      }
    }else {
      return init__7923
    }
    break
  }
};
cljs.core.ArrayNode;
cljs.core.hash_collision_node_find_index = function hash_collision_node_find_index(arr, cnt, key) {
  var lim__7929 = 2 * cnt;
  var i__7930 = 0;
  while(true) {
    if(i__7930 < lim__7929) {
      if(cljs.core._EQ_.call(null, key, arr[i__7930])) {
        return i__7930
      }else {
        var G__7931 = i__7930 + 2;
        i__7930 = G__7931;
        continue
      }
    }else {
      return-1
    }
    break
  }
};
cljs.core.HashCollisionNode = function(edit, collision_hash, cnt, arr) {
  this.edit = edit;
  this.collision_hash = collision_hash;
  this.cnt = cnt;
  this.arr = arr
};
cljs.core.HashCollisionNode.cljs$lang$type = true;
cljs.core.HashCollisionNode.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.HashCollisionNode")
};
cljs.core.HashCollisionNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var this__7932 = this;
  var inode__7933 = this;
  if(hash === this__7932.collision_hash) {
    var idx__7934 = cljs.core.hash_collision_node_find_index.call(null, this__7932.arr, this__7932.cnt, key);
    if(idx__7934 === -1) {
      var len__7935 = this__7932.arr.length;
      var new_arr__7936 = cljs.core.make_array.call(null, len__7935 + 2);
      cljs.core.array_copy.call(null, this__7932.arr, 0, new_arr__7936, 0, len__7935);
      new_arr__7936[len__7935] = key;
      new_arr__7936[len__7935 + 1] = val;
      added_leaf_QMARK_[0] = true;
      return new cljs.core.HashCollisionNode(null, this__7932.collision_hash, this__7932.cnt + 1, new_arr__7936)
    }else {
      if(cljs.core._EQ_.call(null, this__7932.arr[idx__7934], val)) {
        return inode__7933
      }else {
        return new cljs.core.HashCollisionNode(null, this__7932.collision_hash, this__7932.cnt, cljs.core.clone_and_set.call(null, this__7932.arr, idx__7934 + 1, val))
      }
    }
  }else {
    return(new cljs.core.BitmapIndexedNode(null, 1 << (this__7932.collision_hash >>> shift & 31), [null, inode__7933])).inode_assoc(shift, hash, key, val, added_leaf_QMARK_)
  }
};
cljs.core.HashCollisionNode.prototype.inode_without = function(shift, hash, key) {
  var this__7937 = this;
  var inode__7938 = this;
  var idx__7939 = cljs.core.hash_collision_node_find_index.call(null, this__7937.arr, this__7937.cnt, key);
  if(idx__7939 === -1) {
    return inode__7938
  }else {
    if(this__7937.cnt === 1) {
      return null
    }else {
      if("\ufdd0'else") {
        return new cljs.core.HashCollisionNode(null, this__7937.collision_hash, this__7937.cnt - 1, cljs.core.remove_pair.call(null, this__7937.arr, cljs.core.quot.call(null, idx__7939, 2)))
      }else {
        return null
      }
    }
  }
};
cljs.core.HashCollisionNode.prototype.inode_find = function() {
  var G__7966 = null;
  var G__7966__3 = function(shift, hash, key) {
    var this__7940 = this;
    var inode__7941 = this;
    var idx__7942 = cljs.core.hash_collision_node_find_index.call(null, this__7940.arr, this__7940.cnt, key);
    if(idx__7942 < 0) {
      return null
    }else {
      if(cljs.core._EQ_.call(null, key, this__7940.arr[idx__7942])) {
        return cljs.core.PersistentVector.fromArray([this__7940.arr[idx__7942], this__7940.arr[idx__7942 + 1]])
      }else {
        if("\ufdd0'else") {
          return null
        }else {
          return null
        }
      }
    }
  };
  var G__7966__4 = function(shift, hash, key, not_found) {
    var this__7943 = this;
    var inode__7944 = this;
    var idx__7945 = cljs.core.hash_collision_node_find_index.call(null, this__7943.arr, this__7943.cnt, key);
    if(idx__7945 < 0) {
      return not_found
    }else {
      if(cljs.core._EQ_.call(null, key, this__7943.arr[idx__7945])) {
        return cljs.core.PersistentVector.fromArray([this__7943.arr[idx__7945], this__7943.arr[idx__7945 + 1]])
      }else {
        if("\ufdd0'else") {
          return not_found
        }else {
          return null
        }
      }
    }
  };
  G__7966 = function(shift, hash, key, not_found) {
    switch(arguments.length) {
      case 3:
        return G__7966__3.call(this, shift, hash, key);
      case 4:
        return G__7966__4.call(this, shift, hash, key, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7966
}();
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  var this__7946 = this;
  var inode__7947 = this;
  return cljs.core.create_inode_seq.call(null, this__7946.arr)
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function() {
  var G__7967 = null;
  var G__7967__1 = function(e) {
    var this__7948 = this;
    var inode__7949 = this;
    if(e === this__7948.edit) {
      return inode__7949
    }else {
      var new_arr__7950 = cljs.core.make_array.call(null, 2 * (this__7948.cnt + 1));
      cljs.core.array_copy.call(null, this__7948.arr, 0, new_arr__7950, 0, 2 * this__7948.cnt);
      return new cljs.core.HashCollisionNode(e, this__7948.collision_hash, this__7948.cnt, new_arr__7950)
    }
  };
  var G__7967__3 = function(e, count, array) {
    var this__7951 = this;
    var inode__7952 = this;
    if(e === this__7951.edit) {
      this__7951.arr = array;
      this__7951.cnt = count;
      return inode__7952
    }else {
      return new cljs.core.HashCollisionNode(this__7951.edit, this__7951.collision_hash, count, array)
    }
  };
  G__7967 = function(e, count, array) {
    switch(arguments.length) {
      case 1:
        return G__7967__1.call(this, e);
      case 3:
        return G__7967__3.call(this, e, count, array)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7967
}();
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__7953 = this;
  var inode__7954 = this;
  if(hash === this__7953.collision_hash) {
    var idx__7955 = cljs.core.hash_collision_node_find_index.call(null, this__7953.arr, this__7953.cnt, key);
    if(idx__7955 === -1) {
      if(this__7953.arr.length > 2 * this__7953.cnt) {
        var editable__7956 = cljs.core.edit_and_set.call(null, inode__7954, edit, 2 * this__7953.cnt, key, 2 * this__7953.cnt + 1, val);
        added_leaf_QMARK_[0] = true;
        editable__7956.cnt = editable__7956.cnt + 1;
        return editable__7956
      }else {
        var len__7957 = this__7953.arr.length;
        var new_arr__7958 = cljs.core.make_array.call(null, len__7957 + 2);
        cljs.core.array_copy.call(null, this__7953.arr, 0, new_arr__7958, 0, len__7957);
        new_arr__7958[len__7957] = key;
        new_arr__7958[len__7957 + 1] = val;
        added_leaf_QMARK_[0] = true;
        return inode__7954.ensure_editable(edit, this__7953.cnt + 1, new_arr__7958)
      }
    }else {
      if(this__7953.arr[idx__7955 + 1] === val) {
        return inode__7954
      }else {
        return cljs.core.edit_and_set.call(null, inode__7954, edit, idx__7955 + 1, val)
      }
    }
  }else {
    return(new cljs.core.BitmapIndexedNode(edit, 1 << (this__7953.collision_hash >>> shift & 31), [null, inode__7954, null, null])).inode_assoc_BANG_(edit, shift, hash, key, val, added_leaf_QMARK_)
  }
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__7959 = this;
  var inode__7960 = this;
  var idx__7961 = cljs.core.hash_collision_node_find_index.call(null, this__7959.arr, this__7959.cnt, key);
  if(idx__7961 === -1) {
    return inode__7960
  }else {
    removed_leaf_QMARK_[0] = true;
    if(this__7959.cnt === 1) {
      return null
    }else {
      var editable__7962 = inode__7960.ensure_editable(edit);
      var earr__7963 = editable__7962.arr;
      earr__7963[idx__7961] = earr__7963[2 * this__7959.cnt - 2];
      earr__7963[idx__7961 + 1] = earr__7963[2 * this__7959.cnt - 1];
      earr__7963[2 * this__7959.cnt - 1] = null;
      earr__7963[2 * this__7959.cnt - 2] = null;
      editable__7962.cnt = editable__7962.cnt - 1;
      return editable__7962
    }
  }
};
cljs.core.HashCollisionNode.prototype.kv_reduce = function(f, init) {
  var this__7964 = this;
  var inode__7965 = this;
  return cljs.core.inode_kv_reduce.call(null, this__7964.arr, f, init)
};
cljs.core.HashCollisionNode;
cljs.core.create_node = function() {
  var create_node = null;
  var create_node__6 = function(shift, key1, val1, key2hash, key2, val2) {
    var key1hash__7968 = cljs.core.hash.call(null, key1);
    if(key1hash__7968 === key2hash) {
      return new cljs.core.HashCollisionNode(null, key1hash__7968, 2, [key1, val1, key2, val2])
    }else {
      var added_leaf_QMARK___7969 = [false];
      return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift, key1hash__7968, key1, val1, added_leaf_QMARK___7969).inode_assoc(shift, key2hash, key2, val2, added_leaf_QMARK___7969)
    }
  };
  var create_node__7 = function(edit, shift, key1, val1, key2hash, key2, val2) {
    var key1hash__7970 = cljs.core.hash.call(null, key1);
    if(key1hash__7970 === key2hash) {
      return new cljs.core.HashCollisionNode(null, key1hash__7970, 2, [key1, val1, key2, val2])
    }else {
      var added_leaf_QMARK___7971 = [false];
      return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift, key1hash__7970, key1, val1, added_leaf_QMARK___7971).inode_assoc_BANG_(edit, shift, key2hash, key2, val2, added_leaf_QMARK___7971)
    }
  };
  create_node = function(edit, shift, key1, val1, key2hash, key2, val2) {
    switch(arguments.length) {
      case 6:
        return create_node__6.call(this, edit, shift, key1, val1, key2hash, key2);
      case 7:
        return create_node__7.call(this, edit, shift, key1, val1, key2hash, key2, val2)
    }
    throw"Invalid arity: " + arguments.length;
  };
  create_node.cljs$lang$arity$6 = create_node__6;
  create_node.cljs$lang$arity$7 = create_node__7;
  return create_node
}();
cljs.core.NodeSeq = function(meta, nodes, i, s, __hash) {
  this.meta = meta;
  this.nodes = nodes;
  this.i = i;
  this.s = s;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 15925324
};
cljs.core.NodeSeq.cljs$lang$type = true;
cljs.core.NodeSeq.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.NodeSeq")
};
cljs.core.NodeSeq.prototype.cljs$core$IHash$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7972 = this;
  var h__2328__auto____7973 = this__7972.__hash;
  if(h__2328__auto____7973 != null) {
    return h__2328__auto____7973
  }else {
    var h__2328__auto____7974 = cljs.core.hash_coll.call(null, coll);
    this__7972.__hash = h__2328__auto____7974;
    return h__2328__auto____7974
  }
};
cljs.core.NodeSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7975 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.NodeSeq.prototype.toString = function() {
  var this__7976 = this;
  var this$__7977 = this;
  return cljs.core.pr_str.call(null, this$__7977)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__7978 = this;
  return this$
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__7979 = this;
  if(this__7979.s == null) {
    return cljs.core.PersistentVector.fromArray([this__7979.nodes[this__7979.i], this__7979.nodes[this__7979.i + 1]])
  }else {
    return cljs.core.first.call(null, this__7979.s)
  }
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__7980 = this;
  if(this__7980.s == null) {
    return cljs.core.create_inode_seq.call(null, this__7980.nodes, this__7980.i + 2, null)
  }else {
    return cljs.core.create_inode_seq.call(null, this__7980.nodes, this__7980.i, cljs.core.next.call(null, this__7980.s))
  }
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7981 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7982 = this;
  return new cljs.core.NodeSeq(meta, this__7982.nodes, this__7982.i, this__7982.s, this__7982.__hash)
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7983 = this;
  return this__7983.meta
};
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7984 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__7984.meta)
};
cljs.core.NodeSeq;
cljs.core.create_inode_seq = function() {
  var create_inode_seq = null;
  var create_inode_seq__1 = function(nodes) {
    return create_inode_seq.call(null, nodes, 0, null)
  };
  var create_inode_seq__3 = function(nodes, i, s) {
    if(s == null) {
      var len__7985 = nodes.length;
      var j__7986 = i;
      while(true) {
        if(j__7986 < len__7985) {
          if(null != nodes[j__7986]) {
            return new cljs.core.NodeSeq(null, nodes, j__7986, null, null)
          }else {
            var temp__317__auto____7987 = nodes[j__7986 + 1];
            if(cljs.core.truth_(temp__317__auto____7987)) {
              var node__7988 = temp__317__auto____7987;
              var temp__317__auto____7989 = node__7988.inode_seq();
              if(cljs.core.truth_(temp__317__auto____7989)) {
                var node_seq__7990 = temp__317__auto____7989;
                return new cljs.core.NodeSeq(null, nodes, j__7986 + 2, node_seq__7990, null)
              }else {
                var G__7991 = j__7986 + 2;
                j__7986 = G__7991;
                continue
              }
            }else {
              var G__7992 = j__7986 + 2;
              j__7986 = G__7992;
              continue
            }
          }
        }else {
          return null
        }
        break
      }
    }else {
      return new cljs.core.NodeSeq(null, nodes, i, s, null)
    }
  };
  create_inode_seq = function(nodes, i, s) {
    switch(arguments.length) {
      case 1:
        return create_inode_seq__1.call(this, nodes);
      case 3:
        return create_inode_seq__3.call(this, nodes, i, s)
    }
    throw"Invalid arity: " + arguments.length;
  };
  create_inode_seq.cljs$lang$arity$1 = create_inode_seq__1;
  create_inode_seq.cljs$lang$arity$3 = create_inode_seq__3;
  return create_inode_seq
}();
cljs.core.ArrayNodeSeq = function(meta, nodes, i, s, __hash) {
  this.meta = meta;
  this.nodes = nodes;
  this.i = i;
  this.s = s;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 15925324
};
cljs.core.ArrayNodeSeq.cljs$lang$type = true;
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.ArrayNodeSeq")
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7993 = this;
  var h__2328__auto____7994 = this__7993.__hash;
  if(h__2328__auto____7994 != null) {
    return h__2328__auto____7994
  }else {
    var h__2328__auto____7995 = cljs.core.hash_coll.call(null, coll);
    this__7993.__hash = h__2328__auto____7995;
    return h__2328__auto____7995
  }
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7996 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.ArrayNodeSeq.prototype.toString = function() {
  var this__7997 = this;
  var this$__7998 = this;
  return cljs.core.pr_str.call(null, this$__7998)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__7999 = this;
  return this$
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__8000 = this;
  return cljs.core.first.call(null, this__8000.s)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__8001 = this;
  return cljs.core.create_array_node_seq.call(null, null, this__8001.nodes, this__8001.i, cljs.core.next.call(null, this__8001.s))
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8002 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8003 = this;
  return new cljs.core.ArrayNodeSeq(meta, this__8003.nodes, this__8003.i, this__8003.s, this__8003.__hash)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8004 = this;
  return this__8004.meta
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8005 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__8005.meta)
};
cljs.core.ArrayNodeSeq;
cljs.core.create_array_node_seq = function() {
  var create_array_node_seq = null;
  var create_array_node_seq__1 = function(nodes) {
    return create_array_node_seq.call(null, null, nodes, 0, null)
  };
  var create_array_node_seq__4 = function(meta, nodes, i, s) {
    if(s == null) {
      var len__8006 = nodes.length;
      var j__8007 = i;
      while(true) {
        if(j__8007 < len__8006) {
          var temp__317__auto____8008 = nodes[j__8007];
          if(cljs.core.truth_(temp__317__auto____8008)) {
            var nj__8009 = temp__317__auto____8008;
            var temp__317__auto____8010 = nj__8009.inode_seq();
            if(cljs.core.truth_(temp__317__auto____8010)) {
              var ns__8011 = temp__317__auto____8010;
              return new cljs.core.ArrayNodeSeq(meta, nodes, j__8007 + 1, ns__8011, null)
            }else {
              var G__8012 = j__8007 + 1;
              j__8007 = G__8012;
              continue
            }
          }else {
            var G__8013 = j__8007 + 1;
            j__8007 = G__8013;
            continue
          }
        }else {
          return null
        }
        break
      }
    }else {
      return new cljs.core.ArrayNodeSeq(meta, nodes, i, s, null)
    }
  };
  create_array_node_seq = function(meta, nodes, i, s) {
    switch(arguments.length) {
      case 1:
        return create_array_node_seq__1.call(this, meta);
      case 4:
        return create_array_node_seq__4.call(this, meta, nodes, i, s)
    }
    throw"Invalid arity: " + arguments.length;
  };
  create_array_node_seq.cljs$lang$arity$1 = create_array_node_seq__1;
  create_array_node_seq.cljs$lang$arity$4 = create_array_node_seq__4;
  return create_array_node_seq
}();
void 0;
cljs.core.PersistentHashMap = function(meta, cnt, root, has_nil_QMARK_, nil_val, __hash) {
  this.meta = meta;
  this.cnt = cnt;
  this.root = root;
  this.has_nil_QMARK_ = has_nil_QMARK_;
  this.nil_val = nil_val;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2155545487
};
cljs.core.PersistentHashMap.cljs$lang$type = true;
cljs.core.PersistentHashMap.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentHashMap")
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__8018 = this;
  return new cljs.core.TransientHashMap({}, this__8018.root, this__8018.cnt, this__8018.has_nil_QMARK_, this__8018.nil_val)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__8019 = this;
  var h__2328__auto____8020 = this__8019.__hash;
  if(h__2328__auto____8020 != null) {
    return h__2328__auto____8020
  }else {
    var h__2328__auto____8021 = cljs.core.hash_imap.call(null, coll);
    this__8019.__hash = h__2328__auto____8021;
    return h__2328__auto____8021
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__8022 = this;
  return cljs.core._lookup.call(null, coll, k, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__8023 = this;
  if(k == null) {
    if(cljs.core.truth_(this__8023.has_nil_QMARK_)) {
      return this__8023.nil_val
    }else {
      return not_found
    }
  }else {
    if(this__8023.root == null) {
      return not_found
    }else {
      if("\ufdd0'else") {
        return cljs.core.nth.call(null, this__8023.root.inode_find(0, cljs.core.hash.call(null, k), k, [null, not_found]), 1)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__8024 = this;
  if(k == null) {
    if(cljs.core.truth_(function() {
      var and__132__auto____8025 = this__8024.has_nil_QMARK_;
      if(cljs.core.truth_(and__132__auto____8025)) {
        return v === this__8024.nil_val
      }else {
        return and__132__auto____8025
      }
    }())) {
      return coll
    }else {
      return new cljs.core.PersistentHashMap(this__8024.meta, cljs.core.truth_(this__8024.has_nil_QMARK_) ? this__8024.cnt : this__8024.cnt + 1, this__8024.root, true, v, null)
    }
  }else {
    var added_leaf_QMARK___8026 = [false];
    var new_root__8027 = (this__8024.root == null ? cljs.core.BitmapIndexedNode.EMPTY : this__8024.root).inode_assoc(0, cljs.core.hash.call(null, k), k, v, added_leaf_QMARK___8026);
    if(new_root__8027 === this__8024.root) {
      return coll
    }else {
      return new cljs.core.PersistentHashMap(this__8024.meta, cljs.core.truth_(added_leaf_QMARK___8026[0]) ? this__8024.cnt + 1 : this__8024.cnt, new_root__8027, this__8024.has_nil_QMARK_, this__8024.nil_val, null)
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__8028 = this;
  if(k == null) {
    return this__8028.has_nil_QMARK_
  }else {
    if(this__8028.root == null) {
      return false
    }else {
      if("\ufdd0'else") {
        return cljs.core.not.call(null, this__8028.root.inode_find(0, cljs.core.hash.call(null, k), k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentHashMap.prototype.call = function() {
  var G__8049 = null;
  var G__8049__2 = function(tsym8016, k) {
    var this__8029 = this;
    var tsym8016__8030 = this;
    var coll__8031 = tsym8016__8030;
    return cljs.core._lookup.call(null, coll__8031, k)
  };
  var G__8049__3 = function(tsym8017, k, not_found) {
    var this__8032 = this;
    var tsym8017__8033 = this;
    var coll__8034 = tsym8017__8033;
    return cljs.core._lookup.call(null, coll__8034, k, not_found)
  };
  G__8049 = function(tsym8017, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8049__2.call(this, tsym8017, k);
      case 3:
        return G__8049__3.call(this, tsym8017, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8049
}();
cljs.core.PersistentHashMap.prototype.apply = function(tsym8014, args8015) {
  return tsym8014.call.apply(tsym8014, [tsym8014].concat(cljs.core.aclone.call(null, args8015)))
};
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__8035 = this;
  var init__8036 = cljs.core.truth_(this__8035.has_nil_QMARK_) ? f.call(null, init, null, this__8035.nil_val) : init;
  if(cljs.core.reduced_QMARK_.call(null, init__8036)) {
    return cljs.core.deref.call(null, init__8036)
  }else {
    if(null != this__8035.root) {
      return this__8035.root.kv_reduce(f, init__8036)
    }else {
      if("\ufdd0'else") {
        return init__8036
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__8037 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  var this__8038 = this;
  var this$__8039 = this;
  return cljs.core.pr_str.call(null, this$__8039)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__8040 = this;
  if(this__8040.cnt > 0) {
    var s__8041 = null != this__8040.root ? this__8040.root.inode_seq() : null;
    if(cljs.core.truth_(this__8040.has_nil_QMARK_)) {
      return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([null, this__8040.nil_val]), s__8041)
    }else {
      return s__8041
    }
  }else {
    return null
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8042 = this;
  return this__8042.cnt
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8043 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8044 = this;
  return new cljs.core.PersistentHashMap(meta, this__8044.cnt, this__8044.root, this__8044.has_nil_QMARK_, this__8044.nil_val, this__8044.__hash)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8045 = this;
  return this__8045.meta
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8046 = this;
  return cljs.core._with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, this__8046.meta)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__8047 = this;
  if(k == null) {
    if(cljs.core.truth_(this__8047.has_nil_QMARK_)) {
      return new cljs.core.PersistentHashMap(this__8047.meta, this__8047.cnt - 1, this__8047.root, false, null, null)
    }else {
      return coll
    }
  }else {
    if(this__8047.root == null) {
      return coll
    }else {
      if("\ufdd0'else") {
        var new_root__8048 = this__8047.root.inode_without(0, cljs.core.hash.call(null, k), k);
        if(new_root__8048 === this__8047.root) {
          return coll
        }else {
          return new cljs.core.PersistentHashMap(this__8047.meta, this__8047.cnt - 1, new_root__8048, this__8047.has_nil_QMARK_, this__8047.nil_val, null)
        }
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap;
cljs.core.PersistentHashMap.EMPTY = new cljs.core.PersistentHashMap(null, 0, null, false, null, 0);
cljs.core.PersistentHashMap.fromArrays = function(ks, vs) {
  var len__8050 = ks.length;
  var i__8051 = 0;
  var out__8052 = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
  while(true) {
    if(i__8051 < len__8050) {
      var G__8053 = i__8051 + 1;
      var G__8054 = cljs.core.assoc_BANG_.call(null, out__8052, ks[i__8051], vs[i__8051]);
      i__8051 = G__8053;
      out__8052 = G__8054;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__8052)
    }
    break
  }
};
cljs.core.TransientHashMap = function(edit, root, count, has_nil_QMARK_, nil_val) {
  this.edit = edit;
  this.root = root;
  this.count = count;
  this.has_nil_QMARK_ = has_nil_QMARK_;
  this.nil_val = nil_val;
  this.cljs$lang$protocol_mask$partition1$ = 7;
  this.cljs$lang$protocol_mask$partition0$ = 130
};
cljs.core.TransientHashMap.cljs$lang$type = true;
cljs.core.TransientHashMap.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.TransientHashMap")
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(tcoll, key) {
  var this__8055 = this;
  return tcoll.without_BANG_(key)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var this__8056 = this;
  return tcoll.assoc_BANG_(key, val)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, val) {
  var this__8057 = this;
  return tcoll.conj_BANG_(val)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__8058 = this;
  return tcoll.persistent_BANG_()
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, k) {
  var this__8059 = this;
  if(k == null) {
    if(cljs.core.truth_(this__8059.has_nil_QMARK_)) {
      return this__8059.nil_val
    }else {
      return null
    }
  }else {
    if(this__8059.root == null) {
      return null
    }else {
      return cljs.core.nth.call(null, this__8059.root.inode_find(0, cljs.core.hash.call(null, k), k), 1)
    }
  }
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, k, not_found) {
  var this__8060 = this;
  if(k == null) {
    if(cljs.core.truth_(this__8060.has_nil_QMARK_)) {
      return this__8060.nil_val
    }else {
      return not_found
    }
  }else {
    if(this__8060.root == null) {
      return not_found
    }else {
      return cljs.core.nth.call(null, this__8060.root.inode_find(0, cljs.core.hash.call(null, k), k, [null, not_found]), 1)
    }
  }
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8061 = this;
  if(cljs.core.truth_(this__8061.edit)) {
    return this__8061.count
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(o) {
  var this__8062 = this;
  var tcoll__8063 = this;
  if(cljs.core.truth_(this__8062.edit)) {
    if(function() {
      var G__8064__8065 = o;
      if(G__8064__8065 != null) {
        if(function() {
          var or__138__auto____8066 = G__8064__8065.cljs$lang$protocol_mask$partition0$ & 1024;
          if(or__138__auto____8066) {
            return or__138__auto____8066
          }else {
            return G__8064__8065.cljs$core$IMapEntry$
          }
        }()) {
          return true
        }else {
          if(!G__8064__8065.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__8064__8065)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__8064__8065)
      }
    }()) {
      return tcoll__8063.assoc_BANG_(cljs.core.key.call(null, o), cljs.core.val.call(null, o))
    }else {
      var es__8067 = cljs.core.seq.call(null, o);
      var tcoll__8068 = tcoll__8063;
      while(true) {
        var temp__317__auto____8069 = cljs.core.first.call(null, es__8067);
        if(cljs.core.truth_(temp__317__auto____8069)) {
          var e__8070 = temp__317__auto____8069;
          var G__8081 = cljs.core.next.call(null, es__8067);
          var G__8082 = tcoll__8068.assoc_BANG_(cljs.core.key.call(null, e__8070), cljs.core.val.call(null, e__8070));
          es__8067 = G__8081;
          tcoll__8068 = G__8082;
          continue
        }else {
          return tcoll__8068
        }
        break
      }
    }
  }else {
    throw new Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(k, v) {
  var this__8071 = this;
  var tcoll__8072 = this;
  if(cljs.core.truth_(this__8071.edit)) {
    if(k == null) {
      if(this__8071.nil_val === v) {
      }else {
        this__8071.nil_val = v
      }
      if(cljs.core.truth_(this__8071.has_nil_QMARK_)) {
      }else {
        this__8071.count = this__8071.count + 1;
        this__8071.has_nil_QMARK_ = true
      }
      return tcoll__8072
    }else {
      var added_leaf_QMARK___8073 = [false];
      var node__8074 = (this__8071.root == null ? cljs.core.BitmapIndexedNode.EMPTY : this__8071.root).inode_assoc_BANG_(this__8071.edit, 0, cljs.core.hash.call(null, k), k, v, added_leaf_QMARK___8073);
      if(node__8074 === this__8071.root) {
      }else {
        this__8071.root = node__8074
      }
      if(cljs.core.truth_(added_leaf_QMARK___8073[0])) {
        this__8071.count = this__8071.count + 1
      }else {
      }
      return tcoll__8072
    }
  }else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(k) {
  var this__8075 = this;
  var tcoll__8076 = this;
  if(cljs.core.truth_(this__8075.edit)) {
    if(k == null) {
      if(cljs.core.truth_(this__8075.has_nil_QMARK_)) {
        this__8075.has_nil_QMARK_ = false;
        this__8075.nil_val = null;
        this__8075.count = this__8075.count - 1;
        return tcoll__8076
      }else {
        return tcoll__8076
      }
    }else {
      if(this__8075.root == null) {
        return tcoll__8076
      }else {
        var removed_leaf_QMARK___8077 = [false];
        var node__8078 = this__8075.root.inode_without_BANG_(this__8075.edit, 0, cljs.core.hash.call(null, k), k, removed_leaf_QMARK___8077);
        if(node__8078 === this__8075.root) {
        }else {
          this__8075.root = node__8078
        }
        if(cljs.core.truth_(removed_leaf_QMARK___8077[0])) {
          this__8075.count = this__8075.count - 1
        }else {
        }
        return tcoll__8076
      }
    }
  }else {
    throw new Error("dissoc! after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  var this__8079 = this;
  var tcoll__8080 = this;
  if(cljs.core.truth_(this__8079.edit)) {
    this__8079.edit = null;
    return new cljs.core.PersistentHashMap(null, this__8079.count, this__8079.root, this__8079.has_nil_QMARK_, this__8079.nil_val, null)
  }else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientHashMap;
cljs.core.tree_map_seq_push = function tree_map_seq_push(node, stack, ascending_QMARK_) {
  var t__8083 = node;
  var stack__8084 = stack;
  while(true) {
    if(t__8083 != null) {
      var G__8085 = cljs.core.truth_(ascending_QMARK_) ? t__8083.left : t__8083.right;
      var G__8086 = cljs.core.conj.call(null, stack__8084, t__8083);
      t__8083 = G__8085;
      stack__8084 = G__8086;
      continue
    }else {
      return stack__8084
    }
    break
  }
};
cljs.core.PersistentTreeMapSeq = function(meta, stack, ascending_QMARK_, cnt, __hash) {
  this.meta = meta;
  this.stack = stack;
  this.ascending_QMARK_ = ascending_QMARK_;
  this.cnt = cnt;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 15925322
};
cljs.core.PersistentTreeMapSeq.cljs$lang$type = true;
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentTreeMapSeq")
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__8087 = this;
  var h__2328__auto____8088 = this__8087.__hash;
  if(h__2328__auto____8088 != null) {
    return h__2328__auto____8088
  }else {
    var h__2328__auto____8089 = cljs.core.hash_coll.call(null, coll);
    this__8087.__hash = h__2328__auto____8089;
    return h__2328__auto____8089
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__8090 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  var this__8091 = this;
  var this$__8092 = this;
  return cljs.core.pr_str.call(null, this$__8092)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__8093 = this;
  return this$
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8094 = this;
  if(this__8094.cnt < 0) {
    return cljs.core.count.call(null, cljs.core.next.call(null, coll)) + 1
  }else {
    return this__8094.cnt
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(this$) {
  var this__8095 = this;
  return cljs.core.peek.call(null, this__8095.stack)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(this$) {
  var this__8096 = this;
  var t__8097 = cljs.core.peek.call(null, this__8096.stack);
  var next_stack__8098 = cljs.core.tree_map_seq_push.call(null, cljs.core.truth_(this__8096.ascending_QMARK_) ? t__8097.right : t__8097.left, cljs.core.pop.call(null, this__8096.stack), this__8096.ascending_QMARK_);
  if(next_stack__8098 != null) {
    return new cljs.core.PersistentTreeMapSeq(null, next_stack__8098, this__8096.ascending_QMARK_, this__8096.cnt - 1, null)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8099 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8100 = this;
  return new cljs.core.PersistentTreeMapSeq(meta, this__8100.stack, this__8100.ascending_QMARK_, this__8100.cnt, this__8100.__hash)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8101 = this;
  return this__8101.meta
};
cljs.core.PersistentTreeMapSeq;
cljs.core.create_tree_map_seq = function create_tree_map_seq(tree, ascending_QMARK_, cnt) {
  return new cljs.core.PersistentTreeMapSeq(null, cljs.core.tree_map_seq_push.call(null, tree, null, ascending_QMARK_), ascending_QMARK_, cnt, null)
};
void 0;
void 0;
cljs.core.balance_left = function balance_left(key, val, ins, right) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins)) {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins.left)) {
      return new cljs.core.RedNode(ins.key, ins.val, ins.left.blacken(), new cljs.core.BlackNode(key, val, ins.right, right, null), null)
    }else {
      if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins.right)) {
        return new cljs.core.RedNode(ins.right.key, ins.right.val, new cljs.core.BlackNode(ins.key, ins.val, ins.left, ins.right.left, null), new cljs.core.BlackNode(key, val, ins.right.right, right, null), null)
      }else {
        if("\ufdd0'else") {
          return new cljs.core.BlackNode(key, val, ins, right, null)
        }else {
          return null
        }
      }
    }
  }else {
    return new cljs.core.BlackNode(key, val, ins, right, null)
  }
};
cljs.core.balance_right = function balance_right(key, val, left, ins) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins)) {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins.right)) {
      return new cljs.core.RedNode(ins.key, ins.val, new cljs.core.BlackNode(key, val, left, ins.left, null), ins.right.blacken(), null)
    }else {
      if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, ins.left)) {
        return new cljs.core.RedNode(ins.left.key, ins.left.val, new cljs.core.BlackNode(key, val, left, ins.left.left, null), new cljs.core.BlackNode(ins.key, ins.val, ins.left.right, ins.right, null), null)
      }else {
        if("\ufdd0'else") {
          return new cljs.core.BlackNode(key, val, left, ins, null)
        }else {
          return null
        }
      }
    }
  }else {
    return new cljs.core.BlackNode(key, val, left, ins, null)
  }
};
cljs.core.balance_left_del = function balance_left_del(key, val, del, right) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, del)) {
    return new cljs.core.RedNode(key, val, del.blacken(), right, null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, right)) {
      return cljs.core.balance_right.call(null, key, val, del, right.redden())
    }else {
      if(function() {
        var and__132__auto____8102 = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, right);
        if(and__132__auto____8102) {
          return cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, right.left)
        }else {
          return and__132__auto____8102
        }
      }()) {
        return new cljs.core.RedNode(right.left.key, right.left.val, new cljs.core.BlackNode(key, val, del, right.left.left, null), cljs.core.balance_right.call(null, right.key, right.val, right.left.right, right.right.redden()), null)
      }else {
        if("\ufdd0'else") {
          throw new Error("red-black tree invariant violation");
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.balance_right_del = function balance_right_del(key, val, left, del) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, del)) {
    return new cljs.core.RedNode(key, val, left, del.blacken(), null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, left)) {
      return cljs.core.balance_left.call(null, key, val, left.redden(), del)
    }else {
      if(function() {
        var and__132__auto____8103 = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, left);
        if(and__132__auto____8103) {
          return cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, left.right)
        }else {
          return and__132__auto____8103
        }
      }()) {
        return new cljs.core.RedNode(left.right.key, left.right.val, cljs.core.balance_left.call(null, left.key, left.val, left.left.redden(), left.right.left), new cljs.core.BlackNode(key, val, left.right.right, del, null), null)
      }else {
        if("\ufdd0'else") {
          throw new Error("red-black tree invariant violation");
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.tree_map_kv_reduce = function tree_map_kv_reduce(node, f, init) {
  var init__8104 = f.call(null, init, node.key, node.val);
  if(cljs.core.reduced_QMARK_.call(null, init__8104)) {
    return cljs.core.deref.call(null, init__8104)
  }else {
    var init__8105 = node.left != null ? tree_map_kv_reduce.call(null, node.left, f, init__8104) : init__8104;
    if(cljs.core.reduced_QMARK_.call(null, init__8105)) {
      return cljs.core.deref.call(null, init__8105)
    }else {
      var init__8106 = node.right != null ? tree_map_kv_reduce.call(null, node.right, f, init__8105) : init__8105;
      if(cljs.core.reduced_QMARK_.call(null, init__8106)) {
        return cljs.core.deref.call(null, init__8106)
      }else {
        return init__8106
      }
    }
  }
};
cljs.core.BlackNode = function(key, val, left, right, __hash) {
  this.key = key;
  this.val = val;
  this.left = left;
  this.right = right;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 16201119
};
cljs.core.BlackNode.cljs$lang$type = true;
cljs.core.BlackNode.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.BlackNode")
};
cljs.core.BlackNode.prototype.cljs$core$IHash$ = true;
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__8111 = this;
  var h__2328__auto____8112 = this__8111.__hash;
  if(h__2328__auto____8112 != null) {
    return h__2328__auto____8112
  }else {
    var h__2328__auto____8113 = cljs.core.hash_coll.call(null, coll);
    this__8111.__hash = h__2328__auto____8113;
    return h__2328__auto____8113
  }
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$ = true;
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(node, k) {
  var this__8114 = this;
  return cljs.core._nth.call(null, node, k, null)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(node, k, not_found) {
  var this__8115 = this;
  return cljs.core._nth.call(null, node, k, not_found)
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$ = true;
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(node, k, v) {
  var this__8116 = this;
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this__8116.key, this__8116.val]), k, v)
};
cljs.core.BlackNode.prototype.cljs$core$IFn$ = true;
cljs.core.BlackNode.prototype.call = function() {
  var G__8163 = null;
  var G__8163__2 = function(tsym8109, k) {
    var this__8117 = this;
    var tsym8109__8118 = this;
    var node__8119 = tsym8109__8118;
    return cljs.core._lookup.call(null, node__8119, k)
  };
  var G__8163__3 = function(tsym8110, k, not_found) {
    var this__8120 = this;
    var tsym8110__8121 = this;
    var node__8122 = tsym8110__8121;
    return cljs.core._lookup.call(null, node__8122, k, not_found)
  };
  G__8163 = function(tsym8110, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8163__2.call(this, tsym8110, k);
      case 3:
        return G__8163__3.call(this, tsym8110, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8163
}();
cljs.core.BlackNode.prototype.apply = function(tsym8107, args8108) {
  return tsym8107.call.apply(tsym8107, [tsym8107].concat(cljs.core.aclone.call(null, args8108)))
};
cljs.core.BlackNode.prototype.cljs$core$ISequential$ = true;
cljs.core.BlackNode.prototype.cljs$core$ICollection$ = true;
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(node, o) {
  var this__8123 = this;
  return cljs.core.PersistentVector.fromArray([this__8123.key, this__8123.val, o])
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$ = true;
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(node) {
  var this__8124 = this;
  return this__8124.key
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(node) {
  var this__8125 = this;
  return this__8125.val
};
cljs.core.BlackNode.prototype.add_right = function(ins) {
  var this__8126 = this;
  var node__8127 = this;
  return ins.balance_right(node__8127)
};
cljs.core.BlackNode.prototype.redden = function() {
  var this__8128 = this;
  var node__8129 = this;
  return new cljs.core.RedNode(this__8128.key, this__8128.val, this__8128.left, this__8128.right, null)
};
cljs.core.BlackNode.prototype.remove_right = function(del) {
  var this__8130 = this;
  var node__8131 = this;
  return cljs.core.balance_right_del.call(null, this__8130.key, this__8130.val, this__8130.left, del)
};
cljs.core.BlackNode.prototype.replace = function(key, val, left, right) {
  var this__8132 = this;
  var node__8133 = this;
  return new cljs.core.BlackNode(key, val, left, right, null)
};
cljs.core.BlackNode.prototype.kv_reduce = function(f, init) {
  var this__8134 = this;
  var node__8135 = this;
  return cljs.core.tree_map_kv_reduce.call(null, node__8135, f, init)
};
cljs.core.BlackNode.prototype.remove_left = function(del) {
  var this__8136 = this;
  var node__8137 = this;
  return cljs.core.balance_left_del.call(null, this__8136.key, this__8136.val, del, this__8136.right)
};
cljs.core.BlackNode.prototype.add_left = function(ins) {
  var this__8138 = this;
  var node__8139 = this;
  return ins.balance_left(node__8139)
};
cljs.core.BlackNode.prototype.balance_left = function(parent) {
  var this__8140 = this;
  var node__8141 = this;
  return new cljs.core.BlackNode(parent.key, parent.val, node__8141, parent.right, null)
};
cljs.core.BlackNode.prototype.toString = function() {
  var G__8164 = null;
  var G__8164__0 = function() {
    var this__8144 = this;
    var this$__8145 = this;
    return cljs.core.pr_str.call(null, this$__8145)
  };
  G__8164 = function() {
    switch(arguments.length) {
      case 0:
        return G__8164__0.call(this)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8164
}();
cljs.core.BlackNode.prototype.balance_right = function(parent) {
  var this__8146 = this;
  var node__8147 = this;
  return new cljs.core.BlackNode(parent.key, parent.val, parent.left, node__8147, null)
};
cljs.core.BlackNode.prototype.blacken = function() {
  var this__8148 = this;
  var node__8149 = this;
  return node__8149
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$ = true;
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(node, f) {
  var this__8150 = this;
  return cljs.core.ci_reduce.call(null, node, f)
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(node, f, start) {
  var this__8151 = this;
  return cljs.core.ci_reduce.call(null, node, f, start)
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$ = true;
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(node) {
  var this__8152 = this;
  return cljs.core.list.call(null, this__8152.key, this__8152.val)
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$ = true;
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function(node) {
  var this__8154 = this;
  return 2
};
cljs.core.BlackNode.prototype.cljs$core$IStack$ = true;
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function(node) {
  var this__8155 = this;
  return this__8155.val
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function(node) {
  var this__8156 = this;
  return cljs.core.PersistentVector.fromArray([this__8156.key])
};
cljs.core.BlackNode.prototype.cljs$core$IVector$ = true;
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(node, n, v) {
  var this__8157 = this;
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this__8157.key, this__8157.val]), n, v)
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$ = true;
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8158 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$ = true;
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(node, meta) {
  var this__8159 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this__8159.key, this__8159.val]), meta)
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$ = true;
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(node) {
  var this__8160 = this;
  return null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$ = true;
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(node, n) {
  var this__8161 = this;
  if(n === 0) {
    return this__8161.key
  }else {
    if(n === 1) {
      return this__8161.val
    }else {
      if("\ufdd0'else") {
        return null
      }else {
        return null
      }
    }
  }
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(node, n, not_found) {
  var this__8162 = this;
  if(n === 0) {
    return this__8162.key
  }else {
    if(n === 1) {
      return this__8162.val
    }else {
      if("\ufdd0'else") {
        return not_found
      }else {
        return null
      }
    }
  }
};
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(node) {
  var this__8153 = this;
  return cljs.core.PersistentVector.fromArray([])
};
cljs.core.BlackNode;
cljs.core.RedNode = function(key, val, left, right, __hash) {
  this.key = key;
  this.val = val;
  this.left = left;
  this.right = right;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 16201119
};
cljs.core.RedNode.cljs$lang$type = true;
cljs.core.RedNode.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.RedNode")
};
cljs.core.RedNode.prototype.cljs$core$IHash$ = true;
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__8169 = this;
  var h__2328__auto____8170 = this__8169.__hash;
  if(h__2328__auto____8170 != null) {
    return h__2328__auto____8170
  }else {
    var h__2328__auto____8171 = cljs.core.hash_coll.call(null, coll);
    this__8169.__hash = h__2328__auto____8171;
    return h__2328__auto____8171
  }
};
cljs.core.RedNode.prototype.cljs$core$ILookup$ = true;
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(node, k) {
  var this__8172 = this;
  return cljs.core._nth.call(null, node, k, null)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(node, k, not_found) {
  var this__8173 = this;
  return cljs.core._nth.call(null, node, k, not_found)
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$ = true;
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(node, k, v) {
  var this__8174 = this;
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this__8174.key, this__8174.val]), k, v)
};
cljs.core.RedNode.prototype.cljs$core$IFn$ = true;
cljs.core.RedNode.prototype.call = function() {
  var G__8221 = null;
  var G__8221__2 = function(tsym8167, k) {
    var this__8175 = this;
    var tsym8167__8176 = this;
    var node__8177 = tsym8167__8176;
    return cljs.core._lookup.call(null, node__8177, k)
  };
  var G__8221__3 = function(tsym8168, k, not_found) {
    var this__8178 = this;
    var tsym8168__8179 = this;
    var node__8180 = tsym8168__8179;
    return cljs.core._lookup.call(null, node__8180, k, not_found)
  };
  G__8221 = function(tsym8168, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8221__2.call(this, tsym8168, k);
      case 3:
        return G__8221__3.call(this, tsym8168, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8221
}();
cljs.core.RedNode.prototype.apply = function(tsym8165, args8166) {
  return tsym8165.call.apply(tsym8165, [tsym8165].concat(cljs.core.aclone.call(null, args8166)))
};
cljs.core.RedNode.prototype.cljs$core$ISequential$ = true;
cljs.core.RedNode.prototype.cljs$core$ICollection$ = true;
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(node, o) {
  var this__8181 = this;
  return cljs.core.PersistentVector.fromArray([this__8181.key, this__8181.val, o])
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$ = true;
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(node) {
  var this__8182 = this;
  return this__8182.key
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(node) {
  var this__8183 = this;
  return this__8183.val
};
cljs.core.RedNode.prototype.add_right = function(ins) {
  var this__8184 = this;
  var node__8185 = this;
  return new cljs.core.RedNode(this__8184.key, this__8184.val, this__8184.left, ins, null)
};
cljs.core.RedNode.prototype.redden = function() {
  var this__8186 = this;
  var node__8187 = this;
  throw new Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.remove_right = function(del) {
  var this__8188 = this;
  var node__8189 = this;
  return new cljs.core.RedNode(this__8188.key, this__8188.val, this__8188.left, del, null)
};
cljs.core.RedNode.prototype.replace = function(key, val, left, right) {
  var this__8190 = this;
  var node__8191 = this;
  return new cljs.core.RedNode(key, val, left, right, null)
};
cljs.core.RedNode.prototype.kv_reduce = function(f, init) {
  var this__8192 = this;
  var node__8193 = this;
  return cljs.core.tree_map_kv_reduce.call(null, node__8193, f, init)
};
cljs.core.RedNode.prototype.remove_left = function(del) {
  var this__8194 = this;
  var node__8195 = this;
  return new cljs.core.RedNode(this__8194.key, this__8194.val, del, this__8194.right, null)
};
cljs.core.RedNode.prototype.add_left = function(ins) {
  var this__8196 = this;
  var node__8197 = this;
  return new cljs.core.RedNode(this__8196.key, this__8196.val, ins, this__8196.right, null)
};
cljs.core.RedNode.prototype.balance_left = function(parent) {
  var this__8198 = this;
  var node__8199 = this;
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__8198.left)) {
    return new cljs.core.RedNode(this__8198.key, this__8198.val, this__8198.left.blacken(), new cljs.core.BlackNode(parent.key, parent.val, this__8198.right, parent.right, null), null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__8198.right)) {
      return new cljs.core.RedNode(this__8198.right.key, this__8198.right.val, new cljs.core.BlackNode(this__8198.key, this__8198.val, this__8198.left, this__8198.right.left, null), new cljs.core.BlackNode(parent.key, parent.val, this__8198.right.right, parent.right, null), null)
    }else {
      if("\ufdd0'else") {
        return new cljs.core.BlackNode(parent.key, parent.val, node__8199, parent.right, null)
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.toString = function() {
  var G__8222 = null;
  var G__8222__0 = function() {
    var this__8202 = this;
    var this$__8203 = this;
    return cljs.core.pr_str.call(null, this$__8203)
  };
  G__8222 = function() {
    switch(arguments.length) {
      case 0:
        return G__8222__0.call(this)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8222
}();
cljs.core.RedNode.prototype.balance_right = function(parent) {
  var this__8204 = this;
  var node__8205 = this;
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__8204.right)) {
    return new cljs.core.RedNode(this__8204.key, this__8204.val, new cljs.core.BlackNode(parent.key, parent.val, parent.left, this__8204.left, null), this__8204.right.blacken(), null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__8204.left)) {
      return new cljs.core.RedNode(this__8204.left.key, this__8204.left.val, new cljs.core.BlackNode(parent.key, parent.val, parent.left, this__8204.left.left, null), new cljs.core.BlackNode(this__8204.key, this__8204.val, this__8204.left.right, this__8204.right, null), null)
    }else {
      if("\ufdd0'else") {
        return new cljs.core.BlackNode(parent.key, parent.val, parent.left, node__8205, null)
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.blacken = function() {
  var this__8206 = this;
  var node__8207 = this;
  return new cljs.core.BlackNode(this__8206.key, this__8206.val, this__8206.left, this__8206.right, null)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$ = true;
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(node, f) {
  var this__8208 = this;
  return cljs.core.ci_reduce.call(null, node, f)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(node, f, start) {
  var this__8209 = this;
  return cljs.core.ci_reduce.call(null, node, f, start)
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$ = true;
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(node) {
  var this__8210 = this;
  return cljs.core.list.call(null, this__8210.key, this__8210.val)
};
cljs.core.RedNode.prototype.cljs$core$ICounted$ = true;
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function(node) {
  var this__8212 = this;
  return 2
};
cljs.core.RedNode.prototype.cljs$core$IStack$ = true;
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function(node) {
  var this__8213 = this;
  return this__8213.val
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function(node) {
  var this__8214 = this;
  return cljs.core.PersistentVector.fromArray([this__8214.key])
};
cljs.core.RedNode.prototype.cljs$core$IVector$ = true;
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(node, n, v) {
  var this__8215 = this;
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this__8215.key, this__8215.val]), n, v)
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$ = true;
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8216 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$ = true;
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(node, meta) {
  var this__8217 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this__8217.key, this__8217.val]), meta)
};
cljs.core.RedNode.prototype.cljs$core$IMeta$ = true;
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(node) {
  var this__8218 = this;
  return null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$ = true;
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(node, n) {
  var this__8219 = this;
  if(n === 0) {
    return this__8219.key
  }else {
    if(n === 1) {
      return this__8219.val
    }else {
      if("\ufdd0'else") {
        return null
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(node, n, not_found) {
  var this__8220 = this;
  if(n === 0) {
    return this__8220.key
  }else {
    if(n === 1) {
      return this__8220.val
    }else {
      if("\ufdd0'else") {
        return not_found
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(node) {
  var this__8211 = this;
  return cljs.core.PersistentVector.fromArray([])
};
cljs.core.RedNode;
cljs.core.tree_map_add = function tree_map_add(comp, tree, k, v, found) {
  if(tree == null) {
    return new cljs.core.RedNode(k, v, null, null, null)
  }else {
    var c__8223 = comp.call(null, k, tree.key);
    if(c__8223 === 0) {
      found[0] = tree;
      return null
    }else {
      if(c__8223 < 0) {
        var ins__8224 = tree_map_add.call(null, comp, tree.left, k, v, found);
        if(ins__8224 != null) {
          return tree.add_left(ins__8224)
        }else {
          return null
        }
      }else {
        if("\ufdd0'else") {
          var ins__8225 = tree_map_add.call(null, comp, tree.right, k, v, found);
          if(ins__8225 != null) {
            return tree.add_right(ins__8225)
          }else {
            return null
          }
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.tree_map_append = function tree_map_append(left, right) {
  if(left == null) {
    return right
  }else {
    if(right == null) {
      return left
    }else {
      if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, left)) {
        if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, right)) {
          var app__8226 = tree_map_append.call(null, left.right, right.left);
          if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, app__8226)) {
            return new cljs.core.RedNode(app__8226.key, app__8226.val, new cljs.core.RedNode(left.key, left.val, left.left, app__8226.left), new cljs.core.RedNode(right.key, right.val, app__8226.right, right.right), null)
          }else {
            return new cljs.core.RedNode(left.key, left.val, left.left, new cljs.core.RedNode(right.key, right.val, app__8226, right.right, null), null)
          }
        }else {
          return new cljs.core.RedNode(left.key, left.val, left.left, tree_map_append.call(null, left.right, right), null)
        }
      }else {
        if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, right)) {
          return new cljs.core.RedNode(right.key, right.val, tree_map_append.call(null, left, right.left), right.right, null)
        }else {
          if("\ufdd0'else") {
            var app__8227 = tree_map_append.call(null, left.right, right.left);
            if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, app__8227)) {
              return new cljs.core.RedNode(app__8227.key, app__8227.val, new cljs.core.BlackNode(left.key, left.val, left.left, app__8227.left, null), new cljs.core.BlackNode(right.key, right.val, app__8227.right, right.right, null), null)
            }else {
              return cljs.core.balance_left_del.call(null, left.key, left.val, left.left, new cljs.core.BlackNode(right.key, right.val, app__8227, right.right, null))
            }
          }else {
            return null
          }
        }
      }
    }
  }
};
cljs.core.tree_map_remove = function tree_map_remove(comp, tree, k, found) {
  if(tree != null) {
    var c__8228 = comp.call(null, k, tree.key);
    if(c__8228 === 0) {
      found[0] = tree;
      return cljs.core.tree_map_append.call(null, tree.left, tree.right)
    }else {
      if(c__8228 < 0) {
        var del__8229 = tree_map_remove.call(null, comp, tree.left, k, found);
        if(function() {
          var or__138__auto____8230 = del__8229 != null;
          if(or__138__auto____8230) {
            return or__138__auto____8230
          }else {
            return found[0] != null
          }
        }()) {
          if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, tree.left)) {
            return cljs.core.balance_left_del.call(null, tree.key, tree.val, del__8229, tree.right)
          }else {
            return new cljs.core.RedNode(tree.key, tree.val, del__8229, tree.right, null)
          }
        }else {
          return null
        }
      }else {
        if("\ufdd0'else") {
          var del__8231 = tree_map_remove.call(null, comp, tree.right, k, found);
          if(function() {
            var or__138__auto____8232 = del__8231 != null;
            if(or__138__auto____8232) {
              return or__138__auto____8232
            }else {
              return found[0] != null
            }
          }()) {
            if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, tree.right)) {
              return cljs.core.balance_right_del.call(null, tree.key, tree.val, tree.left, del__8231)
            }else {
              return new cljs.core.RedNode(tree.key, tree.val, tree.left, del__8231, null)
            }
          }else {
            return null
          }
        }else {
          return null
        }
      }
    }
  }else {
    return null
  }
};
cljs.core.tree_map_replace = function tree_map_replace(comp, tree, k, v) {
  var tk__8233 = tree.key;
  var c__8234 = comp.call(null, k, tk__8233);
  if(c__8234 === 0) {
    return tree.replace(tk__8233, v, tree.left, tree.right)
  }else {
    if(c__8234 < 0) {
      return tree.replace(tk__8233, tree.val, tree_map_replace.call(null, comp, tree.left, k, v), tree.right)
    }else {
      if("\ufdd0'else") {
        return tree.replace(tk__8233, tree.val, tree.left, tree_map_replace.call(null, comp, tree.right, k, v))
      }else {
        return null
      }
    }
  }
};
void 0;
cljs.core.PersistentTreeMap = function(comp, tree, cnt, meta, __hash) {
  this.comp = comp;
  this.tree = tree;
  this.cnt = cnt;
  this.meta = meta;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 209388431
};
cljs.core.PersistentTreeMap.cljs$lang$type = true;
cljs.core.PersistentTreeMap.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentTreeMap")
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__8239 = this;
  var h__2328__auto____8240 = this__8239.__hash;
  if(h__2328__auto____8240 != null) {
    return h__2328__auto____8240
  }else {
    var h__2328__auto____8241 = cljs.core.hash_imap.call(null, coll);
    this__8239.__hash = h__2328__auto____8241;
    return h__2328__auto____8241
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__8242 = this;
  return cljs.core._lookup.call(null, coll, k, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__8243 = this;
  var n__8244 = coll.entry_at(k);
  if(n__8244 != null) {
    return n__8244.val
  }else {
    return not_found
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__8245 = this;
  var found__8246 = [null];
  var t__8247 = cljs.core.tree_map_add.call(null, this__8245.comp, this__8245.tree, k, v, found__8246);
  if(t__8247 == null) {
    var found_node__8248 = cljs.core.nth.call(null, found__8246, 0);
    if(cljs.core._EQ_.call(null, v, found_node__8248.val)) {
      return coll
    }else {
      return new cljs.core.PersistentTreeMap(this__8245.comp, cljs.core.tree_map_replace.call(null, this__8245.comp, this__8245.tree, k, v), this__8245.cnt, this__8245.meta, null)
    }
  }else {
    return new cljs.core.PersistentTreeMap(this__8245.comp, t__8247.blacken(), this__8245.cnt + 1, this__8245.meta, null)
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__8249 = this;
  return coll.entry_at(k) != null
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentTreeMap.prototype.call = function() {
  var G__8281 = null;
  var G__8281__2 = function(tsym8237, k) {
    var this__8250 = this;
    var tsym8237__8251 = this;
    var coll__8252 = tsym8237__8251;
    return cljs.core._lookup.call(null, coll__8252, k)
  };
  var G__8281__3 = function(tsym8238, k, not_found) {
    var this__8253 = this;
    var tsym8238__8254 = this;
    var coll__8255 = tsym8238__8254;
    return cljs.core._lookup.call(null, coll__8255, k, not_found)
  };
  G__8281 = function(tsym8238, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8281__2.call(this, tsym8238, k);
      case 3:
        return G__8281__3.call(this, tsym8238, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8281
}();
cljs.core.PersistentTreeMap.prototype.apply = function(tsym8235, args8236) {
  return tsym8235.call.apply(tsym8235, [tsym8235].concat(cljs.core.aclone.call(null, args8236)))
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__8256 = this;
  if(this__8256.tree != null) {
    return cljs.core.tree_map_kv_reduce.call(null, this__8256.tree, f, init)
  }else {
    return init
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__8257 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__8258 = this;
  if(this__8258.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__8258.tree, false, this__8258.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.toString = function() {
  var this__8259 = this;
  var this$__8260 = this;
  return cljs.core.pr_str.call(null, this$__8260)
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(k) {
  var this__8261 = this;
  var coll__8262 = this;
  var t__8263 = this__8261.tree;
  while(true) {
    if(t__8263 != null) {
      var c__8264 = this__8261.comp.call(null, k, t__8263.key);
      if(c__8264 === 0) {
        return t__8263
      }else {
        if(c__8264 < 0) {
          var G__8282 = t__8263.left;
          t__8263 = G__8282;
          continue
        }else {
          if("\ufdd0'else") {
            var G__8283 = t__8263.right;
            t__8263 = G__8283;
            continue
          }else {
            return null
          }
        }
      }
    }else {
      return null
    }
    break
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(coll, ascending_QMARK_) {
  var this__8265 = this;
  if(this__8265.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__8265.tree, ascending_QMARK_, this__8265.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(coll, k, ascending_QMARK_) {
  var this__8266 = this;
  if(this__8266.cnt > 0) {
    var stack__8267 = null;
    var t__8268 = this__8266.tree;
    while(true) {
      if(t__8268 != null) {
        var c__8269 = this__8266.comp.call(null, k, t__8268.key);
        if(c__8269 === 0) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.call(null, stack__8267, t__8268), ascending_QMARK_, -1)
        }else {
          if(cljs.core.truth_(ascending_QMARK_)) {
            if(c__8269 < 0) {
              var G__8284 = cljs.core.conj.call(null, stack__8267, t__8268);
              var G__8285 = t__8268.left;
              stack__8267 = G__8284;
              t__8268 = G__8285;
              continue
            }else {
              var G__8286 = stack__8267;
              var G__8287 = t__8268.right;
              stack__8267 = G__8286;
              t__8268 = G__8287;
              continue
            }
          }else {
            if("\ufdd0'else") {
              if(c__8269 > 0) {
                var G__8288 = cljs.core.conj.call(null, stack__8267, t__8268);
                var G__8289 = t__8268.right;
                stack__8267 = G__8288;
                t__8268 = G__8289;
                continue
              }else {
                var G__8290 = stack__8267;
                var G__8291 = t__8268.left;
                stack__8267 = G__8290;
                t__8268 = G__8291;
                continue
              }
            }else {
              return null
            }
          }
        }
      }else {
        if(stack__8267 == null) {
          return new cljs.core.PersistentTreeMapSeq(null, stack__8267, ascending_QMARK_, -1)
        }else {
          return null
        }
      }
      break
    }
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(coll, entry) {
  var this__8270 = this;
  return cljs.core.key.call(null, entry)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function(coll) {
  var this__8271 = this;
  return this__8271.comp
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__8272 = this;
  if(this__8272.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__8272.tree, true, this__8272.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8273 = this;
  return this__8273.cnt
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8274 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8275 = this;
  return new cljs.core.PersistentTreeMap(this__8275.comp, this__8275.tree, this__8275.cnt, meta, this__8275.__hash)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8279 = this;
  return this__8279.meta
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8280 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeMap.EMPTY, this__8280.meta)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__8276 = this;
  var found__8277 = [null];
  var t__8278 = cljs.core.tree_map_remove.call(null, this__8276.comp, this__8276.tree, k, found__8277);
  if(t__8278 == null) {
    if(cljs.core.nth.call(null, found__8277, 0) == null) {
      return coll
    }else {
      return new cljs.core.PersistentTreeMap(this__8276.comp, null, 0, this__8276.meta, null)
    }
  }else {
    return new cljs.core.PersistentTreeMap(this__8276.comp, t__8278.blacken(), this__8276.cnt - 1, this__8276.meta, null)
  }
};
cljs.core.PersistentTreeMap;
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null, 0);
cljs.core.hash_map = function() {
  var hash_map__delegate = function(keyvals) {
    var in$__8292 = cljs.core.seq.call(null, keyvals);
    var out__8293 = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
    while(true) {
      if(cljs.core.truth_(in$__8292)) {
        var G__8294 = cljs.core.nnext.call(null, in$__8292);
        var G__8295 = cljs.core.assoc_BANG_.call(null, out__8293, cljs.core.first.call(null, in$__8292), cljs.core.second.call(null, in$__8292));
        in$__8292 = G__8294;
        out__8293 = G__8295;
        continue
      }else {
        return cljs.core.persistent_BANG_.call(null, out__8293)
      }
      break
    }
  };
  var hash_map = function(var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return hash_map__delegate.call(this, keyvals)
  };
  hash_map.cljs$lang$maxFixedArity = 0;
  hash_map.cljs$lang$applyTo = function(arglist__8296) {
    var keyvals = cljs.core.seq(arglist__8296);
    return hash_map__delegate(keyvals)
  };
  hash_map.cljs$lang$arity$variadic = hash_map__delegate;
  return hash_map
}();
cljs.core.array_map = function() {
  var array_map__delegate = function(keyvals) {
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, cljs.core.count.call(null, keyvals), 2), cljs.core.apply.call(null, cljs.core.array, keyvals), null)
  };
  var array_map = function(var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return array_map__delegate.call(this, keyvals)
  };
  array_map.cljs$lang$maxFixedArity = 0;
  array_map.cljs$lang$applyTo = function(arglist__8297) {
    var keyvals = cljs.core.seq(arglist__8297);
    return array_map__delegate(keyvals)
  };
  array_map.cljs$lang$arity$variadic = array_map__delegate;
  return array_map
}();
cljs.core.sorted_map = function() {
  var sorted_map__delegate = function(keyvals) {
    var in$__8298 = cljs.core.seq.call(null, keyvals);
    var out__8299 = cljs.core.PersistentTreeMap.EMPTY;
    while(true) {
      if(cljs.core.truth_(in$__8298)) {
        var G__8300 = cljs.core.nnext.call(null, in$__8298);
        var G__8301 = cljs.core.assoc.call(null, out__8299, cljs.core.first.call(null, in$__8298), cljs.core.second.call(null, in$__8298));
        in$__8298 = G__8300;
        out__8299 = G__8301;
        continue
      }else {
        return out__8299
      }
      break
    }
  };
  var sorted_map = function(var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return sorted_map__delegate.call(this, keyvals)
  };
  sorted_map.cljs$lang$maxFixedArity = 0;
  sorted_map.cljs$lang$applyTo = function(arglist__8302) {
    var keyvals = cljs.core.seq(arglist__8302);
    return sorted_map__delegate(keyvals)
  };
  sorted_map.cljs$lang$arity$variadic = sorted_map__delegate;
  return sorted_map
}();
cljs.core.sorted_map_by = function() {
  var sorted_map_by__delegate = function(comparator, keyvals) {
    var in$__8303 = cljs.core.seq.call(null, keyvals);
    var out__8304 = new cljs.core.PersistentTreeMap(comparator, null, 0, null, 0);
    while(true) {
      if(cljs.core.truth_(in$__8303)) {
        var G__8305 = cljs.core.nnext.call(null, in$__8303);
        var G__8306 = cljs.core.assoc.call(null, out__8304, cljs.core.first.call(null, in$__8303), cljs.core.second.call(null, in$__8303));
        in$__8303 = G__8305;
        out__8304 = G__8306;
        continue
      }else {
        return out__8304
      }
      break
    }
  };
  var sorted_map_by = function(comparator, var_args) {
    var keyvals = null;
    if(goog.isDef(var_args)) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return sorted_map_by__delegate.call(this, comparator, keyvals)
  };
  sorted_map_by.cljs$lang$maxFixedArity = 1;
  sorted_map_by.cljs$lang$applyTo = function(arglist__8307) {
    var comparator = cljs.core.first(arglist__8307);
    var keyvals = cljs.core.rest(arglist__8307);
    return sorted_map_by__delegate(comparator, keyvals)
  };
  sorted_map_by.cljs$lang$arity$variadic = sorted_map_by__delegate;
  return sorted_map_by
}();
cljs.core.keys = function keys(hash_map) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.first, hash_map))
};
cljs.core.key = function key(map_entry) {
  return cljs.core._key.call(null, map_entry)
};
cljs.core.vals = function vals(hash_map) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.second, hash_map))
};
cljs.core.val = function val(map_entry) {
  return cljs.core._val.call(null, map_entry)
};
cljs.core.merge = function() {
  var merge__delegate = function(maps) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, maps))) {
      return cljs.core.reduce.call(null, function(p1__8308_SHARP_, p2__8309_SHARP_) {
        return cljs.core.conj.call(null, function() {
          var or__138__auto____8310 = p1__8308_SHARP_;
          if(cljs.core.truth_(or__138__auto____8310)) {
            return or__138__auto____8310
          }else {
            return cljs.core.ObjMap.fromObject([], {})
          }
        }(), p2__8309_SHARP_)
      }, maps)
    }else {
      return null
    }
  };
  var merge = function(var_args) {
    var maps = null;
    if(goog.isDef(var_args)) {
      maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return merge__delegate.call(this, maps)
  };
  merge.cljs$lang$maxFixedArity = 0;
  merge.cljs$lang$applyTo = function(arglist__8311) {
    var maps = cljs.core.seq(arglist__8311);
    return merge__delegate(maps)
  };
  merge.cljs$lang$arity$variadic = merge__delegate;
  return merge
}();
cljs.core.merge_with = function() {
  var merge_with__delegate = function(f, maps) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, maps))) {
      var merge_entry__8314 = function(m, e) {
        var k__8312 = cljs.core.first.call(null, e);
        var v__8313 = cljs.core.second.call(null, e);
        if(cljs.core.contains_QMARK_.call(null, m, k__8312)) {
          return cljs.core.assoc.call(null, m, k__8312, f.call(null, cljs.core.get.call(null, m, k__8312), v__8313))
        }else {
          return cljs.core.assoc.call(null, m, k__8312, v__8313)
        }
      };
      var merge2__8316 = function(m1, m2) {
        return cljs.core.reduce.call(null, merge_entry__8314, function() {
          var or__138__auto____8315 = m1;
          if(cljs.core.truth_(or__138__auto____8315)) {
            return or__138__auto____8315
          }else {
            return cljs.core.ObjMap.fromObject([], {})
          }
        }(), cljs.core.seq.call(null, m2))
      };
      return cljs.core.reduce.call(null, merge2__8316, maps)
    }else {
      return null
    }
  };
  var merge_with = function(f, var_args) {
    var maps = null;
    if(goog.isDef(var_args)) {
      maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return merge_with__delegate.call(this, f, maps)
  };
  merge_with.cljs$lang$maxFixedArity = 1;
  merge_with.cljs$lang$applyTo = function(arglist__8317) {
    var f = cljs.core.first(arglist__8317);
    var maps = cljs.core.rest(arglist__8317);
    return merge_with__delegate(f, maps)
  };
  merge_with.cljs$lang$arity$variadic = merge_with__delegate;
  return merge_with
}();
cljs.core.select_keys = function select_keys(map, keyseq) {
  var ret__8318 = cljs.core.ObjMap.fromObject([], {});
  var keys__8319 = cljs.core.seq.call(null, keyseq);
  while(true) {
    if(cljs.core.truth_(keys__8319)) {
      var key__8320 = cljs.core.first.call(null, keys__8319);
      var entry__8321 = cljs.core.get.call(null, map, key__8320, "\ufdd0'user/not-found");
      var G__8322 = cljs.core.not_EQ_.call(null, entry__8321, "\ufdd0'user/not-found") ? cljs.core.assoc.call(null, ret__8318, key__8320, entry__8321) : ret__8318;
      var G__8323 = cljs.core.next.call(null, keys__8319);
      ret__8318 = G__8322;
      keys__8319 = G__8323;
      continue
    }else {
      return ret__8318
    }
    break
  }
};
void 0;
cljs.core.PersistentHashSet = function(meta, hash_map, __hash) {
  this.meta = meta;
  this.hash_map = hash_map;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2155022479
};
cljs.core.PersistentHashSet.cljs$lang$type = true;
cljs.core.PersistentHashSet.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentHashSet")
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var this__8329 = this;
  return new cljs.core.TransientHashSet(cljs.core.transient$.call(null, this__8329.hash_map))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__8330 = this;
  var h__2328__auto____8331 = this__8330.__hash;
  if(h__2328__auto____8331 != null) {
    return h__2328__auto____8331
  }else {
    var h__2328__auto____8332 = cljs.core.hash_iset.call(null, coll);
    this__8330.__hash = h__2328__auto____8332;
    return h__2328__auto____8332
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, v) {
  var this__8333 = this;
  return cljs.core._lookup.call(null, coll, v, null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, v, not_found) {
  var this__8334 = this;
  if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this__8334.hash_map, v))) {
    return v
  }else {
    return not_found
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentHashSet.prototype.call = function() {
  var G__8353 = null;
  var G__8353__2 = function(tsym8327, k) {
    var this__8335 = this;
    var tsym8327__8336 = this;
    var coll__8337 = tsym8327__8336;
    return cljs.core._lookup.call(null, coll__8337, k)
  };
  var G__8353__3 = function(tsym8328, k, not_found) {
    var this__8338 = this;
    var tsym8328__8339 = this;
    var coll__8340 = tsym8328__8339;
    return cljs.core._lookup.call(null, coll__8340, k, not_found)
  };
  G__8353 = function(tsym8328, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8353__2.call(this, tsym8328, k);
      case 3:
        return G__8353__3.call(this, tsym8328, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8353
}();
cljs.core.PersistentHashSet.prototype.apply = function(tsym8325, args8326) {
  return tsym8325.call.apply(tsym8325, [tsym8325].concat(cljs.core.aclone.call(null, args8326)))
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__8341 = this;
  return new cljs.core.PersistentHashSet(this__8341.meta, cljs.core.assoc.call(null, this__8341.hash_map, o, null), null)
};
cljs.core.PersistentHashSet.prototype.toString = function() {
  var this__8342 = this;
  var this$__8343 = this;
  return cljs.core.pr_str.call(null, this$__8343)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__8344 = this;
  return cljs.core.keys.call(null, this__8344.hash_map)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(coll, v) {
  var this__8345 = this;
  return new cljs.core.PersistentHashSet(this__8345.meta, cljs.core.dissoc.call(null, this__8345.hash_map, v), null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8346 = this;
  return cljs.core.count.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8347 = this;
  var and__132__auto____8348 = cljs.core.set_QMARK_.call(null, other);
  if(and__132__auto____8348) {
    var and__132__auto____8349 = cljs.core.count.call(null, coll) === cljs.core.count.call(null, other);
    if(and__132__auto____8349) {
      return cljs.core.every_QMARK_.call(null, function(p1__8324_SHARP_) {
        return cljs.core.contains_QMARK_.call(null, coll, p1__8324_SHARP_)
      }, other)
    }else {
      return and__132__auto____8349
    }
  }else {
    return and__132__auto____8348
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8350 = this;
  return new cljs.core.PersistentHashSet(meta, this__8350.hash_map, this__8350.__hash)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8351 = this;
  return this__8351.meta
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8352 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentHashSet.EMPTY, this__8352.meta)
};
cljs.core.PersistentHashSet;
cljs.core.PersistentHashSet.EMPTY = new cljs.core.PersistentHashSet(null, cljs.core.hash_map.call(null), 0);
cljs.core.TransientHashSet = function(transient_map) {
  this.transient_map = transient_map;
  this.cljs$lang$protocol_mask$partition0$ = 131;
  this.cljs$lang$protocol_mask$partition1$ = 17
};
cljs.core.TransientHashSet.cljs$lang$type = true;
cljs.core.TransientHashSet.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.TransientHashSet")
};
cljs.core.TransientHashSet.prototype.cljs$core$IFn$ = true;
cljs.core.TransientHashSet.prototype.call = function() {
  var G__8371 = null;
  var G__8371__2 = function(tsym8357, k) {
    var this__8359 = this;
    var tsym8357__8360 = this;
    var tcoll__8361 = tsym8357__8360;
    if(cljs.core._lookup.call(null, this__8359.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
      return null
    }else {
      return k
    }
  };
  var G__8371__3 = function(tsym8358, k, not_found) {
    var this__8362 = this;
    var tsym8358__8363 = this;
    var tcoll__8364 = tsym8358__8363;
    if(cljs.core._lookup.call(null, this__8362.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
      return not_found
    }else {
      return k
    }
  };
  G__8371 = function(tsym8358, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8371__2.call(this, tsym8358, k);
      case 3:
        return G__8371__3.call(this, tsym8358, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8371
}();
cljs.core.TransientHashSet.prototype.apply = function(tsym8355, args8356) {
  return tsym8355.call.apply(tsym8355, [tsym8355].concat(cljs.core.aclone.call(null, args8356)))
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, v) {
  var this__8365 = this;
  return cljs.core._lookup.call(null, tcoll, v, null)
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, v, not_found) {
  var this__8366 = this;
  if(cljs.core._lookup.call(null, this__8366.transient_map, v, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return not_found
  }else {
    return v
  }
};
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(tcoll) {
  var this__8367 = this;
  return cljs.core.count.call(null, this__8367.transient_map)
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = function(tcoll, v) {
  var this__8368 = this;
  this__8368.transient_map = cljs.core.dissoc_BANG_.call(null, this__8368.transient_map, v);
  return tcoll
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__8369 = this;
  this__8369.transient_map = cljs.core.assoc_BANG_.call(null, this__8369.transient_map, o, null);
  return tcoll
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__8370 = this;
  return new cljs.core.PersistentHashSet(null, cljs.core.persistent_BANG_.call(null, this__8370.transient_map), null)
};
cljs.core.TransientHashSet;
cljs.core.PersistentTreeSet = function(meta, tree_map, __hash) {
  this.meta = meta;
  this.tree_map = tree_map;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 208865423
};
cljs.core.PersistentTreeSet.cljs$lang$type = true;
cljs.core.PersistentTreeSet.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.PersistentTreeSet")
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__8376 = this;
  var h__2328__auto____8377 = this__8376.__hash;
  if(h__2328__auto____8377 != null) {
    return h__2328__auto____8377
  }else {
    var h__2328__auto____8378 = cljs.core.hash_iset.call(null, coll);
    this__8376.__hash = h__2328__auto____8378;
    return h__2328__auto____8378
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, v) {
  var this__8379 = this;
  return cljs.core._lookup.call(null, coll, v, null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, v, not_found) {
  var this__8380 = this;
  if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this__8380.tree_map, v))) {
    return v
  }else {
    return not_found
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentTreeSet.prototype.call = function() {
  var G__8404 = null;
  var G__8404__2 = function(tsym8374, k) {
    var this__8381 = this;
    var tsym8374__8382 = this;
    var coll__8383 = tsym8374__8382;
    return cljs.core._lookup.call(null, coll__8383, k)
  };
  var G__8404__3 = function(tsym8375, k, not_found) {
    var this__8384 = this;
    var tsym8375__8385 = this;
    var coll__8386 = tsym8375__8385;
    return cljs.core._lookup.call(null, coll__8386, k, not_found)
  };
  G__8404 = function(tsym8375, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8404__2.call(this, tsym8375, k);
      case 3:
        return G__8404__3.call(this, tsym8375, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8404
}();
cljs.core.PersistentTreeSet.prototype.apply = function(tsym8372, args8373) {
  return tsym8372.call.apply(tsym8372, [tsym8372].concat(cljs.core.aclone.call(null, args8373)))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__8387 = this;
  return new cljs.core.PersistentTreeSet(this__8387.meta, cljs.core.assoc.call(null, this__8387.tree_map, o, null), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__8388 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core.rseq.call(null, this__8388.tree_map))
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  var this__8389 = this;
  var this$__8390 = this;
  return cljs.core.pr_str.call(null, this$__8390)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(coll, ascending_QMARK_) {
  var this__8391 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq.call(null, this__8391.tree_map, ascending_QMARK_))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(coll, k, ascending_QMARK_) {
  var this__8392 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq_from.call(null, this__8392.tree_map, k, ascending_QMARK_))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(coll, entry) {
  var this__8393 = this;
  return entry
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function(coll) {
  var this__8394 = this;
  return cljs.core._comparator.call(null, this__8394.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__8395 = this;
  return cljs.core.keys.call(null, this__8395.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(coll, v) {
  var this__8396 = this;
  return new cljs.core.PersistentTreeSet(this__8396.meta, cljs.core.dissoc.call(null, this__8396.tree_map, v), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8397 = this;
  return cljs.core.count.call(null, this__8397.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8398 = this;
  var and__132__auto____8399 = cljs.core.set_QMARK_.call(null, other);
  if(and__132__auto____8399) {
    var and__132__auto____8400 = cljs.core.count.call(null, coll) === cljs.core.count.call(null, other);
    if(and__132__auto____8400) {
      return cljs.core.every_QMARK_.call(null, function(p1__8354_SHARP_) {
        return cljs.core.contains_QMARK_.call(null, coll, p1__8354_SHARP_)
      }, other)
    }else {
      return and__132__auto____8400
    }
  }else {
    return and__132__auto____8399
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8401 = this;
  return new cljs.core.PersistentTreeSet(meta, this__8401.tree_map, this__8401.__hash)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8402 = this;
  return this__8402.meta
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8403 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeSet.EMPTY, this__8403.meta)
};
cljs.core.PersistentTreeSet;
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map.call(null), 0);
cljs.core.set = function set(coll) {
  var in$__8405 = cljs.core.seq.call(null, coll);
  var out__8406 = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);
  while(true) {
    if(cljs.core.truth_(cljs.core.seq.call(null, in$__8405))) {
      var G__8407 = cljs.core.next.call(null, in$__8405);
      var G__8408 = cljs.core.conj_BANG_.call(null, out__8406, cljs.core.first.call(null, in$__8405));
      in$__8405 = G__8407;
      out__8406 = G__8408;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__8406)
    }
    break
  }
};
cljs.core.sorted_set = function() {
  var sorted_set__delegate = function(keys) {
    return cljs.core.reduce.call(null, cljs.core._conj, cljs.core.PersistentTreeSet.EMPTY, keys)
  };
  var sorted_set = function(var_args) {
    var keys = null;
    if(goog.isDef(var_args)) {
      keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return sorted_set__delegate.call(this, keys)
  };
  sorted_set.cljs$lang$maxFixedArity = 0;
  sorted_set.cljs$lang$applyTo = function(arglist__8409) {
    var keys = cljs.core.seq(arglist__8409);
    return sorted_set__delegate(keys)
  };
  sorted_set.cljs$lang$arity$variadic = sorted_set__delegate;
  return sorted_set
}();
cljs.core.sorted_set_by = function() {
  var sorted_set_by__delegate = function(comparator, keys) {
    return cljs.core.reduce.call(null, cljs.core._conj, new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map_by.call(null, comparator), 0), keys)
  };
  var sorted_set_by = function(comparator, var_args) {
    var keys = null;
    if(goog.isDef(var_args)) {
      keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return sorted_set_by__delegate.call(this, comparator, keys)
  };
  sorted_set_by.cljs$lang$maxFixedArity = 1;
  sorted_set_by.cljs$lang$applyTo = function(arglist__8411) {
    var comparator = cljs.core.first(arglist__8411);
    var keys = cljs.core.rest(arglist__8411);
    return sorted_set_by__delegate(comparator, keys)
  };
  sorted_set_by.cljs$lang$arity$variadic = sorted_set_by__delegate;
  return sorted_set_by
}();
cljs.core.replace = function replace(smap, coll) {
  if(cljs.core.vector_QMARK_.call(null, coll)) {
    var n__8412 = cljs.core.count.call(null, coll);
    return cljs.core.reduce.call(null, function(v, i) {
      var temp__317__auto____8413 = cljs.core.find.call(null, smap, cljs.core.nth.call(null, v, i));
      if(cljs.core.truth_(temp__317__auto____8413)) {
        var e__8414 = temp__317__auto____8413;
        return cljs.core.assoc.call(null, v, i, cljs.core.second.call(null, e__8414))
      }else {
        return v
      }
    }, coll, cljs.core.take.call(null, n__8412, cljs.core.iterate.call(null, cljs.core.inc, 0)))
  }else {
    return cljs.core.map.call(null, function(p1__8410_SHARP_) {
      var temp__317__auto____8415 = cljs.core.find.call(null, smap, p1__8410_SHARP_);
      if(cljs.core.truth_(temp__317__auto____8415)) {
        var e__8416 = temp__317__auto____8415;
        return cljs.core.second.call(null, e__8416)
      }else {
        return p1__8410_SHARP_
      }
    }, coll)
  }
};
cljs.core.distinct = function distinct(coll) {
  var step__8424 = function step(xs, seen) {
    return new cljs.core.LazySeq(null, false, function() {
      return function(p__8417, seen) {
        while(true) {
          var vec__8418__8419 = p__8417;
          var f__8420 = cljs.core.nth.call(null, vec__8418__8419, 0, null);
          var xs__8421 = vec__8418__8419;
          var temp__324__auto____8422 = cljs.core.seq.call(null, xs__8421);
          if(cljs.core.truth_(temp__324__auto____8422)) {
            var s__8423 = temp__324__auto____8422;
            if(cljs.core.contains_QMARK_.call(null, seen, f__8420)) {
              var G__8425 = cljs.core.rest.call(null, s__8423);
              var G__8426 = seen;
              p__8417 = G__8425;
              seen = G__8426;
              continue
            }else {
              return cljs.core.cons.call(null, f__8420, step.call(null, cljs.core.rest.call(null, s__8423), cljs.core.conj.call(null, seen, f__8420)))
            }
          }else {
            return null
          }
          break
        }
      }.call(null, xs, seen)
    })
  };
  return step__8424.call(null, coll, cljs.core.set([]))
};
cljs.core.butlast = function butlast(s) {
  var ret__8427 = cljs.core.PersistentVector.fromArray([]);
  var s__8428 = s;
  while(true) {
    if(cljs.core.truth_(cljs.core.next.call(null, s__8428))) {
      var G__8429 = cljs.core.conj.call(null, ret__8427, cljs.core.first.call(null, s__8428));
      var G__8430 = cljs.core.next.call(null, s__8428);
      ret__8427 = G__8429;
      s__8428 = G__8430;
      continue
    }else {
      return cljs.core.seq.call(null, ret__8427)
    }
    break
  }
};
cljs.core.name = function name(x) {
  if(cljs.core.string_QMARK_.call(null, x)) {
    return x
  }else {
    if(function() {
      var or__138__auto____8431 = cljs.core.keyword_QMARK_.call(null, x);
      if(or__138__auto____8431) {
        return or__138__auto____8431
      }else {
        return cljs.core.symbol_QMARK_.call(null, x)
      }
    }()) {
      var i__8432 = x.lastIndexOf("/");
      if(i__8432 < 0) {
        return cljs.core.subs.call(null, x, 2)
      }else {
        return cljs.core.subs.call(null, x, i__8432 + 1)
      }
    }else {
      if("\ufdd0'else") {
        throw new Error([cljs.core.str("Doesn't support name: "), cljs.core.str(x)].join(""));
      }else {
        return null
      }
    }
  }
};
cljs.core.namespace = function namespace(x) {
  if(function() {
    var or__138__auto____8433 = cljs.core.keyword_QMARK_.call(null, x);
    if(or__138__auto____8433) {
      return or__138__auto____8433
    }else {
      return cljs.core.symbol_QMARK_.call(null, x)
    }
  }()) {
    var i__8434 = x.lastIndexOf("/");
    if(i__8434 > -1) {
      return cljs.core.subs.call(null, x, 2, i__8434)
    }else {
      return null
    }
  }else {
    throw new Error([cljs.core.str("Doesn't support namespace: "), cljs.core.str(x)].join(""));
  }
};
cljs.core.zipmap = function zipmap(keys, vals) {
  var map__8437 = cljs.core.ObjMap.fromObject([], {});
  var ks__8438 = cljs.core.seq.call(null, keys);
  var vs__8439 = cljs.core.seq.call(null, vals);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__132__auto____8440 = ks__8438;
      if(cljs.core.truth_(and__132__auto____8440)) {
        return vs__8439
      }else {
        return and__132__auto____8440
      }
    }())) {
      var G__8441 = cljs.core.assoc.call(null, map__8437, cljs.core.first.call(null, ks__8438), cljs.core.first.call(null, vs__8439));
      var G__8442 = cljs.core.next.call(null, ks__8438);
      var G__8443 = cljs.core.next.call(null, vs__8439);
      map__8437 = G__8441;
      ks__8438 = G__8442;
      vs__8439 = G__8443;
      continue
    }else {
      return map__8437
    }
    break
  }
};
cljs.core.max_key = function() {
  var max_key = null;
  var max_key__2 = function(k, x) {
    return x
  };
  var max_key__3 = function(k, x, y) {
    if(k.call(null, x) > k.call(null, y)) {
      return x
    }else {
      return y
    }
  };
  var max_key__4 = function() {
    var G__8446__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__8435_SHARP_, p2__8436_SHARP_) {
        return max_key.call(null, k, p1__8435_SHARP_, p2__8436_SHARP_)
      }, max_key.call(null, k, x, y), more)
    };
    var G__8446 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__8446__delegate.call(this, k, x, y, more)
    };
    G__8446.cljs$lang$maxFixedArity = 3;
    G__8446.cljs$lang$applyTo = function(arglist__8447) {
      var k = cljs.core.first(arglist__8447);
      var x = cljs.core.first(cljs.core.next(arglist__8447));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8447)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8447)));
      return G__8446__delegate(k, x, y, more)
    };
    G__8446.cljs$lang$arity$variadic = G__8446__delegate;
    return G__8446
  }();
  max_key = function(k, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return max_key__2.call(this, k, x);
      case 3:
        return max_key__3.call(this, k, x, y);
      default:
        return max_key__4.cljs$lang$arity$variadic(k, x, y, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  max_key.cljs$lang$maxFixedArity = 3;
  max_key.cljs$lang$applyTo = max_key__4.cljs$lang$applyTo;
  max_key.cljs$lang$arity$2 = max_key__2;
  max_key.cljs$lang$arity$3 = max_key__3;
  max_key.cljs$lang$arity$variadic = max_key__4.cljs$lang$arity$variadic;
  return max_key
}();
cljs.core.min_key = function() {
  var min_key = null;
  var min_key__2 = function(k, x) {
    return x
  };
  var min_key__3 = function(k, x, y) {
    if(k.call(null, x) < k.call(null, y)) {
      return x
    }else {
      return y
    }
  };
  var min_key__4 = function() {
    var G__8448__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__8444_SHARP_, p2__8445_SHARP_) {
        return min_key.call(null, k, p1__8444_SHARP_, p2__8445_SHARP_)
      }, min_key.call(null, k, x, y), more)
    };
    var G__8448 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__8448__delegate.call(this, k, x, y, more)
    };
    G__8448.cljs$lang$maxFixedArity = 3;
    G__8448.cljs$lang$applyTo = function(arglist__8449) {
      var k = cljs.core.first(arglist__8449);
      var x = cljs.core.first(cljs.core.next(arglist__8449));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8449)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8449)));
      return G__8448__delegate(k, x, y, more)
    };
    G__8448.cljs$lang$arity$variadic = G__8448__delegate;
    return G__8448
  }();
  min_key = function(k, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return min_key__2.call(this, k, x);
      case 3:
        return min_key__3.call(this, k, x, y);
      default:
        return min_key__4.cljs$lang$arity$variadic(k, x, y, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  min_key.cljs$lang$maxFixedArity = 3;
  min_key.cljs$lang$applyTo = min_key__4.cljs$lang$applyTo;
  min_key.cljs$lang$arity$2 = min_key__2;
  min_key.cljs$lang$arity$3 = min_key__3;
  min_key.cljs$lang$arity$variadic = min_key__4.cljs$lang$arity$variadic;
  return min_key
}();
cljs.core.partition_all = function() {
  var partition_all = null;
  var partition_all__2 = function(n, coll) {
    return partition_all.call(null, n, n, coll)
  };
  var partition_all__3 = function(n, step, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__324__auto____8450 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____8450)) {
        var s__8451 = temp__324__auto____8450;
        return cljs.core.cons.call(null, cljs.core.take.call(null, n, s__8451), partition_all.call(null, n, step, cljs.core.drop.call(null, step, s__8451)))
      }else {
        return null
      }
    })
  };
  partition_all = function(n, step, coll) {
    switch(arguments.length) {
      case 2:
        return partition_all__2.call(this, n, step);
      case 3:
        return partition_all__3.call(this, n, step, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  partition_all.cljs$lang$arity$2 = partition_all__2;
  partition_all.cljs$lang$arity$3 = partition_all__3;
  return partition_all
}();
cljs.core.take_while = function take_while(pred, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__324__auto____8452 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____8452)) {
      var s__8453 = temp__324__auto____8452;
      if(cljs.core.truth_(pred.call(null, cljs.core.first.call(null, s__8453)))) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__8453), take_while.call(null, pred, cljs.core.rest.call(null, s__8453)))
      }else {
        return null
      }
    }else {
      return null
    }
  })
};
cljs.core.mk_bound_fn = function mk_bound_fn(sc, test, key) {
  return function(e) {
    var comp__8454 = cljs.core._comparator.call(null, sc);
    return test.call(null, comp__8454.call(null, cljs.core._entry_key.call(null, sc, e), key), 0)
  }
};
cljs.core.subseq = function() {
  var subseq = null;
  var subseq__3 = function(sc, test, key) {
    var include__8455 = cljs.core.mk_bound_fn.call(null, sc, test, key);
    if(cljs.core.truth_(cljs.core.set([cljs.core._GT_, cljs.core._GT__EQ_]).call(null, test))) {
      var temp__324__auto____8456 = cljs.core._sorted_seq_from.call(null, sc, key, true);
      if(cljs.core.truth_(temp__324__auto____8456)) {
        var vec__8457__8458 = temp__324__auto____8456;
        var e__8459 = cljs.core.nth.call(null, vec__8457__8458, 0, null);
        var s__8460 = vec__8457__8458;
        if(cljs.core.truth_(include__8455.call(null, e__8459))) {
          return s__8460
        }else {
          return cljs.core.next.call(null, s__8460)
        }
      }else {
        return null
      }
    }else {
      return cljs.core.take_while.call(null, include__8455, cljs.core._sorted_seq.call(null, sc, true))
    }
  };
  var subseq__5 = function(sc, start_test, start_key, end_test, end_key) {
    var temp__324__auto____8461 = cljs.core._sorted_seq_from.call(null, sc, start_key, true);
    if(cljs.core.truth_(temp__324__auto____8461)) {
      var vec__8462__8463 = temp__324__auto____8461;
      var e__8464 = cljs.core.nth.call(null, vec__8462__8463, 0, null);
      var s__8465 = vec__8462__8463;
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, sc, end_test, end_key), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, sc, start_test, start_key).call(null, e__8464)) ? s__8465 : cljs.core.next.call(null, s__8465))
    }else {
      return null
    }
  };
  subseq = function(sc, start_test, start_key, end_test, end_key) {
    switch(arguments.length) {
      case 3:
        return subseq__3.call(this, sc, start_test, start_key);
      case 5:
        return subseq__5.call(this, sc, start_test, start_key, end_test, end_key)
    }
    throw"Invalid arity: " + arguments.length;
  };
  subseq.cljs$lang$arity$3 = subseq__3;
  subseq.cljs$lang$arity$5 = subseq__5;
  return subseq
}();
cljs.core.rsubseq = function() {
  var rsubseq = null;
  var rsubseq__3 = function(sc, test, key) {
    var include__8466 = cljs.core.mk_bound_fn.call(null, sc, test, key);
    if(cljs.core.truth_(cljs.core.set([cljs.core._LT_, cljs.core._LT__EQ_]).call(null, test))) {
      var temp__324__auto____8467 = cljs.core._sorted_seq_from.call(null, sc, key, false);
      if(cljs.core.truth_(temp__324__auto____8467)) {
        var vec__8468__8469 = temp__324__auto____8467;
        var e__8470 = cljs.core.nth.call(null, vec__8468__8469, 0, null);
        var s__8471 = vec__8468__8469;
        if(cljs.core.truth_(include__8466.call(null, e__8470))) {
          return s__8471
        }else {
          return cljs.core.next.call(null, s__8471)
        }
      }else {
        return null
      }
    }else {
      return cljs.core.take_while.call(null, include__8466, cljs.core._sorted_seq.call(null, sc, false))
    }
  };
  var rsubseq__5 = function(sc, start_test, start_key, end_test, end_key) {
    var temp__324__auto____8472 = cljs.core._sorted_seq_from.call(null, sc, end_key, false);
    if(cljs.core.truth_(temp__324__auto____8472)) {
      var vec__8473__8474 = temp__324__auto____8472;
      var e__8475 = cljs.core.nth.call(null, vec__8473__8474, 0, null);
      var s__8476 = vec__8473__8474;
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, sc, start_test, start_key), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, sc, end_test, end_key).call(null, e__8475)) ? s__8476 : cljs.core.next.call(null, s__8476))
    }else {
      return null
    }
  };
  rsubseq = function(sc, start_test, start_key, end_test, end_key) {
    switch(arguments.length) {
      case 3:
        return rsubseq__3.call(this, sc, start_test, start_key);
      case 5:
        return rsubseq__5.call(this, sc, start_test, start_key, end_test, end_key)
    }
    throw"Invalid arity: " + arguments.length;
  };
  rsubseq.cljs$lang$arity$3 = rsubseq__3;
  rsubseq.cljs$lang$arity$5 = rsubseq__5;
  return rsubseq
}();
cljs.core.Range = function(meta, start, end, step, __hash) {
  this.meta = meta;
  this.start = start;
  this.end = end;
  this.step = step;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 16187486
};
cljs.core.Range.cljs$lang$type = true;
cljs.core.Range.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.Range")
};
cljs.core.Range.prototype.cljs$core$IHash$ = true;
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = function(rng) {
  var this__8477 = this;
  var h__2328__auto____8478 = this__8477.__hash;
  if(h__2328__auto____8478 != null) {
    return h__2328__auto____8478
  }else {
    var h__2328__auto____8479 = cljs.core.hash_coll.call(null, rng);
    this__8477.__hash = h__2328__auto____8479;
    return h__2328__auto____8479
  }
};
cljs.core.Range.prototype.cljs$core$ISequential$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(rng, o) {
  var this__8480 = this;
  return cljs.core.cons.call(null, o, rng)
};
cljs.core.Range.prototype.toString = function() {
  var this__8481 = this;
  var this$__8482 = this;
  return cljs.core.pr_str.call(null, this$__8482)
};
cljs.core.Range.prototype.cljs$core$IReduce$ = true;
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(rng, f) {
  var this__8483 = this;
  return cljs.core.ci_reduce.call(null, rng, f)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(rng, f, s) {
  var this__8484 = this;
  return cljs.core.ci_reduce.call(null, rng, f, s)
};
cljs.core.Range.prototype.cljs$core$ISeqable$ = true;
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(rng) {
  var this__8485 = this;
  var comp__8486 = this__8485.step > 0 ? cljs.core._LT_ : cljs.core._GT_;
  if(cljs.core.truth_(comp__8486.call(null, this__8485.start, this__8485.end))) {
    return rng
  }else {
    return null
  }
};
cljs.core.Range.prototype.cljs$core$ICounted$ = true;
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(rng) {
  var this__8487 = this;
  if(cljs.core.not.call(null, cljs.core._seq.call(null, rng))) {
    return 0
  }else {
    return Math["ceil"]((this__8487.end - this__8487.start) / this__8487.step)
  }
};
cljs.core.Range.prototype.cljs$core$ISeq$ = true;
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function(rng) {
  var this__8488 = this;
  return this__8488.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(rng) {
  var this__8489 = this;
  if(cljs.core.truth_(cljs.core._seq.call(null, rng))) {
    return new cljs.core.Range(this__8489.meta, this__8489.start + this__8489.step, this__8489.end, this__8489.step, null)
  }else {
    return cljs.core.list.call(null)
  }
};
cljs.core.Range.prototype.cljs$core$IEquiv$ = true;
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(rng, other) {
  var this__8490 = this;
  return cljs.core.equiv_sequential.call(null, rng, other)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(rng, meta) {
  var this__8491 = this;
  return new cljs.core.Range(meta, this__8491.start, this__8491.end, this__8491.step, this__8491.__hash)
};
cljs.core.Range.prototype.cljs$core$IMeta$ = true;
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function(rng) {
  var this__8492 = this;
  return this__8492.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$ = true;
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(rng, n) {
  var this__8493 = this;
  if(n < cljs.core._count.call(null, rng)) {
    return this__8493.start + n * this__8493.step
  }else {
    if(function() {
      var and__132__auto____8494 = this__8493.start > this__8493.end;
      if(and__132__auto____8494) {
        return this__8493.step === 0
      }else {
        return and__132__auto____8494
      }
    }()) {
      return this__8493.start
    }else {
      throw new Error("Index out of bounds");
    }
  }
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(rng, n, not_found) {
  var this__8495 = this;
  if(n < cljs.core._count.call(null, rng)) {
    return this__8495.start + n * this__8495.step
  }else {
    if(function() {
      var and__132__auto____8496 = this__8495.start > this__8495.end;
      if(and__132__auto____8496) {
        return this__8495.step === 0
      }else {
        return and__132__auto____8496
      }
    }()) {
      return this__8495.start
    }else {
      return not_found
    }
  }
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(rng) {
  var this__8497 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__8497.meta)
};
cljs.core.Range;
cljs.core.range = function() {
  var range = null;
  var range__0 = function() {
    return range.call(null, 0, Number["MAX_VALUE"], 1)
  };
  var range__1 = function(end) {
    return range.call(null, 0, end, 1)
  };
  var range__2 = function(start, end) {
    return range.call(null, start, end, 1)
  };
  var range__3 = function(start, end, step) {
    return new cljs.core.Range(null, start, end, step, null)
  };
  range = function(start, end, step) {
    switch(arguments.length) {
      case 0:
        return range__0.call(this);
      case 1:
        return range__1.call(this, start);
      case 2:
        return range__2.call(this, start, end);
      case 3:
        return range__3.call(this, start, end, step)
    }
    throw"Invalid arity: " + arguments.length;
  };
  range.cljs$lang$arity$0 = range__0;
  range.cljs$lang$arity$1 = range__1;
  range.cljs$lang$arity$2 = range__2;
  range.cljs$lang$arity$3 = range__3;
  return range
}();
cljs.core.take_nth = function take_nth(n, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__324__auto____8498 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____8498)) {
      var s__8499 = temp__324__auto____8498;
      return cljs.core.cons.call(null, cljs.core.first.call(null, s__8499), take_nth.call(null, n, cljs.core.drop.call(null, n, s__8499)))
    }else {
      return null
    }
  })
};
cljs.core.split_with = function split_with(pred, coll) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take_while.call(null, pred, coll), cljs.core.drop_while.call(null, pred, coll)])
};
cljs.core.partition_by = function partition_by(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__324__auto____8501 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____8501)) {
      var s__8502 = temp__324__auto____8501;
      var fst__8503 = cljs.core.first.call(null, s__8502);
      var fv__8504 = f.call(null, fst__8503);
      var run__8505 = cljs.core.cons.call(null, fst__8503, cljs.core.take_while.call(null, function(p1__8500_SHARP_) {
        return cljs.core._EQ_.call(null, fv__8504, f.call(null, p1__8500_SHARP_))
      }, cljs.core.next.call(null, s__8502)));
      return cljs.core.cons.call(null, run__8505, partition_by.call(null, f, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, run__8505), s__8502))))
    }else {
      return null
    }
  })
};
cljs.core.frequencies = function frequencies(coll) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(counts, x) {
    return cljs.core.assoc_BANG_.call(null, counts, x, cljs.core.get.call(null, counts, x, 0) + 1)
  }, cljs.core.transient$.call(null, cljs.core.ObjMap.fromObject([], {})), coll))
};
cljs.core.reductions = function() {
  var reductions = null;
  var reductions__2 = function(f, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__317__auto____8516 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__317__auto____8516)) {
        var s__8517 = temp__317__auto____8516;
        return reductions.call(null, f, cljs.core.first.call(null, s__8517), cljs.core.rest.call(null, s__8517))
      }else {
        return cljs.core.list.call(null, f.call(null))
      }
    })
  };
  var reductions__3 = function(f, init, coll) {
    return cljs.core.cons.call(null, init, new cljs.core.LazySeq(null, false, function() {
      var temp__324__auto____8518 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____8518)) {
        var s__8519 = temp__324__auto____8518;
        return reductions.call(null, f, f.call(null, init, cljs.core.first.call(null, s__8519)), cljs.core.rest.call(null, s__8519))
      }else {
        return null
      }
    }))
  };
  reductions = function(f, init, coll) {
    switch(arguments.length) {
      case 2:
        return reductions__2.call(this, f, init);
      case 3:
        return reductions__3.call(this, f, init, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  reductions.cljs$lang$arity$2 = reductions__2;
  reductions.cljs$lang$arity$3 = reductions__3;
  return reductions
}();
cljs.core.juxt = function() {
  var juxt = null;
  var juxt__1 = function(f) {
    return function() {
      var G__8521 = null;
      var G__8521__0 = function() {
        return cljs.core.vector.call(null, f.call(null))
      };
      var G__8521__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x))
      };
      var G__8521__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y))
      };
      var G__8521__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z))
      };
      var G__8521__4 = function() {
        var G__8522__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args))
        };
        var G__8522 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__8522__delegate.call(this, x, y, z, args)
        };
        G__8522.cljs$lang$maxFixedArity = 3;
        G__8522.cljs$lang$applyTo = function(arglist__8523) {
          var x = cljs.core.first(arglist__8523);
          var y = cljs.core.first(cljs.core.next(arglist__8523));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8523)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8523)));
          return G__8522__delegate(x, y, z, args)
        };
        G__8522.cljs$lang$arity$variadic = G__8522__delegate;
        return G__8522
      }();
      G__8521 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__8521__0.call(this);
          case 1:
            return G__8521__1.call(this, x);
          case 2:
            return G__8521__2.call(this, x, y);
          case 3:
            return G__8521__3.call(this, x, y, z);
          default:
            return G__8521__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__8521.cljs$lang$maxFixedArity = 3;
      G__8521.cljs$lang$applyTo = G__8521__4.cljs$lang$applyTo;
      return G__8521
    }()
  };
  var juxt__2 = function(f, g) {
    return function() {
      var G__8524 = null;
      var G__8524__0 = function() {
        return cljs.core.vector.call(null, f.call(null), g.call(null))
      };
      var G__8524__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x), g.call(null, x))
      };
      var G__8524__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y), g.call(null, x, y))
      };
      var G__8524__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z), g.call(null, x, y, z))
      };
      var G__8524__4 = function() {
        var G__8525__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args))
        };
        var G__8525 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__8525__delegate.call(this, x, y, z, args)
        };
        G__8525.cljs$lang$maxFixedArity = 3;
        G__8525.cljs$lang$applyTo = function(arglist__8526) {
          var x = cljs.core.first(arglist__8526);
          var y = cljs.core.first(cljs.core.next(arglist__8526));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8526)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8526)));
          return G__8525__delegate(x, y, z, args)
        };
        G__8525.cljs$lang$arity$variadic = G__8525__delegate;
        return G__8525
      }();
      G__8524 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__8524__0.call(this);
          case 1:
            return G__8524__1.call(this, x);
          case 2:
            return G__8524__2.call(this, x, y);
          case 3:
            return G__8524__3.call(this, x, y, z);
          default:
            return G__8524__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__8524.cljs$lang$maxFixedArity = 3;
      G__8524.cljs$lang$applyTo = G__8524__4.cljs$lang$applyTo;
      return G__8524
    }()
  };
  var juxt__3 = function(f, g, h) {
    return function() {
      var G__8527 = null;
      var G__8527__0 = function() {
        return cljs.core.vector.call(null, f.call(null), g.call(null), h.call(null))
      };
      var G__8527__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x), g.call(null, x), h.call(null, x))
      };
      var G__8527__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y), g.call(null, x, y), h.call(null, x, y))
      };
      var G__8527__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z), g.call(null, x, y, z), h.call(null, x, y, z))
      };
      var G__8527__4 = function() {
        var G__8528__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args), cljs.core.apply.call(null, h, x, y, z, args))
        };
        var G__8528 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__8528__delegate.call(this, x, y, z, args)
        };
        G__8528.cljs$lang$maxFixedArity = 3;
        G__8528.cljs$lang$applyTo = function(arglist__8529) {
          var x = cljs.core.first(arglist__8529);
          var y = cljs.core.first(cljs.core.next(arglist__8529));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8529)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8529)));
          return G__8528__delegate(x, y, z, args)
        };
        G__8528.cljs$lang$arity$variadic = G__8528__delegate;
        return G__8528
      }();
      G__8527 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__8527__0.call(this);
          case 1:
            return G__8527__1.call(this, x);
          case 2:
            return G__8527__2.call(this, x, y);
          case 3:
            return G__8527__3.call(this, x, y, z);
          default:
            return G__8527__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__8527.cljs$lang$maxFixedArity = 3;
      G__8527.cljs$lang$applyTo = G__8527__4.cljs$lang$applyTo;
      return G__8527
    }()
  };
  var juxt__4 = function() {
    var G__8530__delegate = function(f, g, h, fs) {
      var fs__8520 = cljs.core.list_STAR_.call(null, f, g, h, fs);
      return function() {
        var G__8531 = null;
        var G__8531__0 = function() {
          return cljs.core.reduce.call(null, function(p1__8506_SHARP_, p2__8507_SHARP_) {
            return cljs.core.conj.call(null, p1__8506_SHARP_, p2__8507_SHARP_.call(null))
          }, cljs.core.PersistentVector.fromArray([]), fs__8520)
        };
        var G__8531__1 = function(x) {
          return cljs.core.reduce.call(null, function(p1__8508_SHARP_, p2__8509_SHARP_) {
            return cljs.core.conj.call(null, p1__8508_SHARP_, p2__8509_SHARP_.call(null, x))
          }, cljs.core.PersistentVector.fromArray([]), fs__8520)
        };
        var G__8531__2 = function(x, y) {
          return cljs.core.reduce.call(null, function(p1__8510_SHARP_, p2__8511_SHARP_) {
            return cljs.core.conj.call(null, p1__8510_SHARP_, p2__8511_SHARP_.call(null, x, y))
          }, cljs.core.PersistentVector.fromArray([]), fs__8520)
        };
        var G__8531__3 = function(x, y, z) {
          return cljs.core.reduce.call(null, function(p1__8512_SHARP_, p2__8513_SHARP_) {
            return cljs.core.conj.call(null, p1__8512_SHARP_, p2__8513_SHARP_.call(null, x, y, z))
          }, cljs.core.PersistentVector.fromArray([]), fs__8520)
        };
        var G__8531__4 = function() {
          var G__8532__delegate = function(x, y, z, args) {
            return cljs.core.reduce.call(null, function(p1__8514_SHARP_, p2__8515_SHARP_) {
              return cljs.core.conj.call(null, p1__8514_SHARP_, cljs.core.apply.call(null, p2__8515_SHARP_, x, y, z, args))
            }, cljs.core.PersistentVector.fromArray([]), fs__8520)
          };
          var G__8532 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__8532__delegate.call(this, x, y, z, args)
          };
          G__8532.cljs$lang$maxFixedArity = 3;
          G__8532.cljs$lang$applyTo = function(arglist__8533) {
            var x = cljs.core.first(arglist__8533);
            var y = cljs.core.first(cljs.core.next(arglist__8533));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8533)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8533)));
            return G__8532__delegate(x, y, z, args)
          };
          G__8532.cljs$lang$arity$variadic = G__8532__delegate;
          return G__8532
        }();
        G__8531 = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return G__8531__0.call(this);
            case 1:
              return G__8531__1.call(this, x);
            case 2:
              return G__8531__2.call(this, x, y);
            case 3:
              return G__8531__3.call(this, x, y, z);
            default:
              return G__8531__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
          }
          throw"Invalid arity: " + arguments.length;
        };
        G__8531.cljs$lang$maxFixedArity = 3;
        G__8531.cljs$lang$applyTo = G__8531__4.cljs$lang$applyTo;
        return G__8531
      }()
    };
    var G__8530 = function(f, g, h, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__8530__delegate.call(this, f, g, h, fs)
    };
    G__8530.cljs$lang$maxFixedArity = 3;
    G__8530.cljs$lang$applyTo = function(arglist__8534) {
      var f = cljs.core.first(arglist__8534);
      var g = cljs.core.first(cljs.core.next(arglist__8534));
      var h = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8534)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8534)));
      return G__8530__delegate(f, g, h, fs)
    };
    G__8530.cljs$lang$arity$variadic = G__8530__delegate;
    return G__8530
  }();
  juxt = function(f, g, h, var_args) {
    var fs = var_args;
    switch(arguments.length) {
      case 1:
        return juxt__1.call(this, f);
      case 2:
        return juxt__2.call(this, f, g);
      case 3:
        return juxt__3.call(this, f, g, h);
      default:
        return juxt__4.cljs$lang$arity$variadic(f, g, h, cljs.core.array_seq(arguments, 3))
    }
    throw"Invalid arity: " + arguments.length;
  };
  juxt.cljs$lang$maxFixedArity = 3;
  juxt.cljs$lang$applyTo = juxt__4.cljs$lang$applyTo;
  juxt.cljs$lang$arity$1 = juxt__1;
  juxt.cljs$lang$arity$2 = juxt__2;
  juxt.cljs$lang$arity$3 = juxt__3;
  juxt.cljs$lang$arity$variadic = juxt__4.cljs$lang$arity$variadic;
  return juxt
}();
cljs.core.dorun = function() {
  var dorun = null;
  var dorun__1 = function(coll) {
    while(true) {
      if(cljs.core.truth_(cljs.core.seq.call(null, coll))) {
        var G__8536 = cljs.core.next.call(null, coll);
        coll = G__8536;
        continue
      }else {
        return null
      }
      break
    }
  };
  var dorun__2 = function(n, coll) {
    while(true) {
      if(cljs.core.truth_(function() {
        var and__132__auto____8535 = cljs.core.seq.call(null, coll);
        if(cljs.core.truth_(and__132__auto____8535)) {
          return n > 0
        }else {
          return and__132__auto____8535
        }
      }())) {
        var G__8537 = n - 1;
        var G__8538 = cljs.core.next.call(null, coll);
        n = G__8537;
        coll = G__8538;
        continue
      }else {
        return null
      }
      break
    }
  };
  dorun = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return dorun__1.call(this, n);
      case 2:
        return dorun__2.call(this, n, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  dorun.cljs$lang$arity$1 = dorun__1;
  dorun.cljs$lang$arity$2 = dorun__2;
  return dorun
}();
cljs.core.doall = function() {
  var doall = null;
  var doall__1 = function(coll) {
    cljs.core.dorun.call(null, coll);
    return coll
  };
  var doall__2 = function(n, coll) {
    cljs.core.dorun.call(null, n, coll);
    return coll
  };
  doall = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return doall__1.call(this, n);
      case 2:
        return doall__2.call(this, n, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  doall.cljs$lang$arity$1 = doall__1;
  doall.cljs$lang$arity$2 = doall__2;
  return doall
}();
cljs.core.re_matches = function re_matches(re, s) {
  var matches__8539 = re.exec(s);
  if(cljs.core._EQ_.call(null, cljs.core.first.call(null, matches__8539), s)) {
    if(cljs.core.count.call(null, matches__8539) === 1) {
      return cljs.core.first.call(null, matches__8539)
    }else {
      return cljs.core.vec.call(null, matches__8539)
    }
  }else {
    return null
  }
};
cljs.core.re_find = function re_find(re, s) {
  var matches__8540 = re.exec(s);
  if(matches__8540 == null) {
    return null
  }else {
    if(cljs.core.count.call(null, matches__8540) === 1) {
      return cljs.core.first.call(null, matches__8540)
    }else {
      return cljs.core.vec.call(null, matches__8540)
    }
  }
};
cljs.core.re_seq = function re_seq(re, s) {
  var match_data__8541 = cljs.core.re_find.call(null, re, s);
  var match_idx__8542 = s.search(re);
  var match_str__8543 = cljs.core.coll_QMARK_.call(null, match_data__8541) ? cljs.core.first.call(null, match_data__8541) : match_data__8541;
  var post_match__8544 = cljs.core.subs.call(null, s, match_idx__8542 + cljs.core.count.call(null, match_str__8543));
  if(cljs.core.truth_(match_data__8541)) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, match_data__8541, re_seq.call(null, re, post_match__8544))
    })
  }else {
    return null
  }
};
cljs.core.re_pattern = function re_pattern(s) {
  var vec__8546__8547 = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, s);
  var ___8548 = cljs.core.nth.call(null, vec__8546__8547, 0, null);
  var flags__8549 = cljs.core.nth.call(null, vec__8546__8547, 1, null);
  var pattern__8550 = cljs.core.nth.call(null, vec__8546__8547, 2, null);
  return new RegExp(pattern__8550, flags__8549)
};
cljs.core.pr_sequential = function pr_sequential(print_one, begin, sep, end, opts, coll) {
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([begin]), cljs.core.flatten1.call(null, cljs.core.interpose.call(null, cljs.core.PersistentVector.fromArray([sep]), cljs.core.map.call(null, function(p1__8545_SHARP_) {
    return print_one.call(null, p1__8545_SHARP_, opts)
  }, coll))), cljs.core.PersistentVector.fromArray([end]))
};
cljs.core.string_print = function string_print(x) {
  cljs.core._STAR_print_fn_STAR_.call(null, x);
  return null
};
cljs.core.flush = function flush() {
  return null
};
cljs.core.pr_seq = function pr_seq(obj, opts) {
  if(obj == null) {
    return cljs.core.list.call(null, "nil")
  }else {
    if(void 0 === obj) {
      return cljs.core.list.call(null, "#<undefined>")
    }else {
      if("\ufdd0'else") {
        return cljs.core.concat.call(null, cljs.core.truth_(function() {
          var and__132__auto____8551 = cljs.core.get.call(null, opts, "\ufdd0'meta");
          if(cljs.core.truth_(and__132__auto____8551)) {
            var and__132__auto____8555 = function() {
              var G__8552__8553 = obj;
              if(G__8552__8553 != null) {
                if(function() {
                  var or__138__auto____8554 = G__8552__8553.cljs$lang$protocol_mask$partition0$ & 65536;
                  if(or__138__auto____8554) {
                    return or__138__auto____8554
                  }else {
                    return G__8552__8553.cljs$core$IMeta$
                  }
                }()) {
                  return true
                }else {
                  if(!G__8552__8553.cljs$lang$protocol_mask$partition0$) {
                    return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__8552__8553)
                  }else {
                    return false
                  }
                }
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__8552__8553)
              }
            }();
            if(cljs.core.truth_(and__132__auto____8555)) {
              return cljs.core.meta.call(null, obj)
            }else {
              return and__132__auto____8555
            }
          }else {
            return and__132__auto____8551
          }
        }()) ? cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["^"]), pr_seq.call(null, cljs.core.meta.call(null, obj), opts), cljs.core.PersistentVector.fromArray([" "])) : null, cljs.core.truth_(function() {
          var and__132__auto____8556 = obj != null;
          if(and__132__auto____8556) {
            return obj.cljs$lang$type
          }else {
            return and__132__auto____8556
          }
        }()) ? obj.cljs$lang$ctorPrSeq(obj) : function() {
          var G__8557__8558 = obj;
          if(G__8557__8558 != null) {
            if(function() {
              var or__138__auto____8559 = G__8557__8558.cljs$lang$protocol_mask$partition0$ & 268435456;
              if(or__138__auto____8559) {
                return or__138__auto____8559
              }else {
                return G__8557__8558.cljs$core$IPrintable$
              }
            }()) {
              return true
            }else {
              if(!G__8557__8558.cljs$lang$protocol_mask$partition0$) {
                return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__8557__8558)
              }else {
                return false
              }
            }
          }else {
            return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__8557__8558)
          }
        }() ? cljs.core._pr_seq.call(null, obj, opts) : "\ufdd0'else" ? cljs.core.list.call(null, "#<", [cljs.core.str(obj)].join(""), ">") : null)
      }else {
        return null
      }
    }
  }
};
cljs.core.pr_sb = function pr_sb(objs, opts) {
  var first_obj__8560 = cljs.core.first.call(null, objs);
  var sb__8561 = new goog.string.StringBuffer;
  var G__8562__8563 = cljs.core.seq.call(null, objs);
  if(cljs.core.truth_(G__8562__8563)) {
    var obj__8564 = cljs.core.first.call(null, G__8562__8563);
    var G__8562__8565 = G__8562__8563;
    while(true) {
      if(obj__8564 === first_obj__8560) {
      }else {
        sb__8561.append(" ")
      }
      var G__8566__8567 = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, obj__8564, opts));
      if(cljs.core.truth_(G__8566__8567)) {
        var string__8568 = cljs.core.first.call(null, G__8566__8567);
        var G__8566__8569 = G__8566__8567;
        while(true) {
          sb__8561.append(string__8568);
          var temp__324__auto____8570 = cljs.core.next.call(null, G__8566__8569);
          if(cljs.core.truth_(temp__324__auto____8570)) {
            var G__8566__8571 = temp__324__auto____8570;
            var G__8574 = cljs.core.first.call(null, G__8566__8571);
            var G__8575 = G__8566__8571;
            string__8568 = G__8574;
            G__8566__8569 = G__8575;
            continue
          }else {
          }
          break
        }
      }else {
      }
      var temp__324__auto____8572 = cljs.core.next.call(null, G__8562__8565);
      if(cljs.core.truth_(temp__324__auto____8572)) {
        var G__8562__8573 = temp__324__auto____8572;
        var G__8576 = cljs.core.first.call(null, G__8562__8573);
        var G__8577 = G__8562__8573;
        obj__8564 = G__8576;
        G__8562__8565 = G__8577;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return sb__8561
};
cljs.core.pr_str_with_opts = function pr_str_with_opts(objs, opts) {
  return[cljs.core.str(cljs.core.pr_sb.call(null, objs, opts))].join("")
};
cljs.core.prn_str_with_opts = function prn_str_with_opts(objs, opts) {
  var sb__8578 = cljs.core.pr_sb.call(null, objs, opts);
  sb__8578.append("\n");
  return[cljs.core.str(sb__8578)].join("")
};
cljs.core.pr_with_opts = function pr_with_opts(objs, opts) {
  var first_obj__8579 = cljs.core.first.call(null, objs);
  var G__8580__8581 = cljs.core.seq.call(null, objs);
  if(cljs.core.truth_(G__8580__8581)) {
    var obj__8582 = cljs.core.first.call(null, G__8580__8581);
    var G__8580__8583 = G__8580__8581;
    while(true) {
      if(obj__8582 === first_obj__8579) {
      }else {
        cljs.core.string_print.call(null, " ")
      }
      var G__8584__8585 = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, obj__8582, opts));
      if(cljs.core.truth_(G__8584__8585)) {
        var string__8586 = cljs.core.first.call(null, G__8584__8585);
        var G__8584__8587 = G__8584__8585;
        while(true) {
          cljs.core.string_print.call(null, string__8586);
          var temp__324__auto____8588 = cljs.core.next.call(null, G__8584__8587);
          if(cljs.core.truth_(temp__324__auto____8588)) {
            var G__8584__8589 = temp__324__auto____8588;
            var G__8592 = cljs.core.first.call(null, G__8584__8589);
            var G__8593 = G__8584__8589;
            string__8586 = G__8592;
            G__8584__8587 = G__8593;
            continue
          }else {
          }
          break
        }
      }else {
      }
      var temp__324__auto____8590 = cljs.core.next.call(null, G__8580__8583);
      if(cljs.core.truth_(temp__324__auto____8590)) {
        var G__8580__8591 = temp__324__auto____8590;
        var G__8594 = cljs.core.first.call(null, G__8580__8591);
        var G__8595 = G__8580__8591;
        obj__8582 = G__8594;
        G__8580__8583 = G__8595;
        continue
      }else {
        return null
      }
      break
    }
  }else {
    return null
  }
};
cljs.core.newline = function newline(opts) {
  cljs.core.string_print.call(null, "\n");
  if(cljs.core.truth_(cljs.core.get.call(null, opts, "\ufdd0'flush-on-newline"))) {
    return cljs.core.flush.call(null)
  }else {
    return null
  }
};
cljs.core._STAR_flush_on_newline_STAR_ = true;
cljs.core._STAR_print_readably_STAR_ = true;
cljs.core._STAR_print_meta_STAR_ = false;
cljs.core._STAR_print_dup_STAR_ = false;
cljs.core.pr_opts = function pr_opts() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'flush-on-newline", "\ufdd0'readably", "\ufdd0'meta", "\ufdd0'dup"], {"\ufdd0'flush-on-newline":cljs.core._STAR_flush_on_newline_STAR_, "\ufdd0'readably":cljs.core._STAR_print_readably_STAR_, "\ufdd0'meta":cljs.core._STAR_print_meta_STAR_, "\ufdd0'dup":cljs.core._STAR_print_dup_STAR_})
};
cljs.core.pr_str = function() {
  var pr_str__delegate = function(objs) {
    return cljs.core.pr_str_with_opts.call(null, objs, cljs.core.pr_opts.call(null))
  };
  var pr_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return pr_str__delegate.call(this, objs)
  };
  pr_str.cljs$lang$maxFixedArity = 0;
  pr_str.cljs$lang$applyTo = function(arglist__8596) {
    var objs = cljs.core.seq(arglist__8596);
    return pr_str__delegate(objs)
  };
  pr_str.cljs$lang$arity$variadic = pr_str__delegate;
  return pr_str
}();
cljs.core.prn_str = function() {
  var prn_str__delegate = function(objs) {
    return cljs.core.prn_str_with_opts.call(null, objs, cljs.core.pr_opts.call(null))
  };
  var prn_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return prn_str__delegate.call(this, objs)
  };
  prn_str.cljs$lang$maxFixedArity = 0;
  prn_str.cljs$lang$applyTo = function(arglist__8597) {
    var objs = cljs.core.seq(arglist__8597);
    return prn_str__delegate(objs)
  };
  prn_str.cljs$lang$arity$variadic = prn_str__delegate;
  return prn_str
}();
cljs.core.pr = function() {
  var pr__delegate = function(objs) {
    return cljs.core.pr_with_opts.call(null, objs, cljs.core.pr_opts.call(null))
  };
  var pr = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return pr__delegate.call(this, objs)
  };
  pr.cljs$lang$maxFixedArity = 0;
  pr.cljs$lang$applyTo = function(arglist__8598) {
    var objs = cljs.core.seq(arglist__8598);
    return pr__delegate(objs)
  };
  pr.cljs$lang$arity$variadic = pr__delegate;
  return pr
}();
cljs.core.print = function() {
  var cljs_core_print__delegate = function(objs) {
    return cljs.core.pr_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false))
  };
  var cljs_core_print = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return cljs_core_print__delegate.call(this, objs)
  };
  cljs_core_print.cljs$lang$maxFixedArity = 0;
  cljs_core_print.cljs$lang$applyTo = function(arglist__8599) {
    var objs = cljs.core.seq(arglist__8599);
    return cljs_core_print__delegate(objs)
  };
  cljs_core_print.cljs$lang$arity$variadic = cljs_core_print__delegate;
  return cljs_core_print
}();
cljs.core.print_str = function() {
  var print_str__delegate = function(objs) {
    return cljs.core.pr_str_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false))
  };
  var print_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return print_str__delegate.call(this, objs)
  };
  print_str.cljs$lang$maxFixedArity = 0;
  print_str.cljs$lang$applyTo = function(arglist__8600) {
    var objs = cljs.core.seq(arglist__8600);
    return print_str__delegate(objs)
  };
  print_str.cljs$lang$arity$variadic = print_str__delegate;
  return print_str
}();
cljs.core.println = function() {
  var println__delegate = function(objs) {
    cljs.core.pr_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  };
  var println = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return println__delegate.call(this, objs)
  };
  println.cljs$lang$maxFixedArity = 0;
  println.cljs$lang$applyTo = function(arglist__8601) {
    var objs = cljs.core.seq(arglist__8601);
    return println__delegate(objs)
  };
  println.cljs$lang$arity$variadic = println__delegate;
  return println
}();
cljs.core.println_str = function() {
  var println_str__delegate = function(objs) {
    return cljs.core.prn_str_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0'readably", false))
  };
  var println_str = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return println_str__delegate.call(this, objs)
  };
  println_str.cljs$lang$maxFixedArity = 0;
  println_str.cljs$lang$applyTo = function(arglist__8602) {
    var objs = cljs.core.seq(arglist__8602);
    return println_str__delegate(objs)
  };
  println_str.cljs$lang$arity$variadic = println_str__delegate;
  return println_str
}();
cljs.core.prn = function() {
  var prn__delegate = function(objs) {
    cljs.core.pr_with_opts.call(null, objs, cljs.core.pr_opts.call(null));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  };
  var prn = function(var_args) {
    var objs = null;
    if(goog.isDef(var_args)) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
    }
    return prn__delegate.call(this, objs)
  };
  prn.cljs$lang$maxFixedArity = 0;
  prn.cljs$lang$applyTo = function(arglist__8603) {
    var objs = cljs.core.seq(arglist__8603);
    return prn__delegate(objs)
  };
  prn.cljs$lang$arity$variadic = prn__delegate;
  return prn
}();
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__8604 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__8604, "{", ", ", "}", opts, coll)
};
cljs.core.IPrintable["number"] = true;
cljs.core._pr_seq["number"] = function(n, opts) {
  return cljs.core.list.call(null, [cljs.core.str(n)].join(""))
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.Subvec.prototype.cljs$core$IPrintable$ = true;
cljs.core.Subvec.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__8605 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__8605, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__8606 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__8606, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentQueue.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#queue [", " ", "]", opts, cljs.core.seq.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.LazySeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#{", " ", "}", opts, coll)
};
cljs.core.IPrintable["boolean"] = true;
cljs.core._pr_seq["boolean"] = function(bool, opts) {
  return cljs.core.list.call(null, [cljs.core.str(bool)].join(""))
};
cljs.core.IPrintable["string"] = true;
cljs.core._pr_seq["string"] = function(obj, opts) {
  if(cljs.core.keyword_QMARK_.call(null, obj)) {
    return cljs.core.list.call(null, [cljs.core.str(":"), cljs.core.str(function() {
      var temp__324__auto____8607 = cljs.core.namespace.call(null, obj);
      if(cljs.core.truth_(temp__324__auto____8607)) {
        var nspc__8608 = temp__324__auto____8607;
        return[cljs.core.str(nspc__8608), cljs.core.str("/")].join("")
      }else {
        return null
      }
    }()), cljs.core.str(cljs.core.name.call(null, obj))].join(""))
  }else {
    if(cljs.core.symbol_QMARK_.call(null, obj)) {
      return cljs.core.list.call(null, [cljs.core.str(function() {
        var temp__324__auto____8609 = cljs.core.namespace.call(null, obj);
        if(cljs.core.truth_(temp__324__auto____8609)) {
          var nspc__8610 = temp__324__auto____8609;
          return[cljs.core.str(nspc__8610), cljs.core.str("/")].join("")
        }else {
          return null
        }
      }()), cljs.core.str(cljs.core.name.call(null, obj))].join(""))
    }else {
      if("\ufdd0'else") {
        return cljs.core.list.call(null, cljs.core.truth_("\ufdd0'readably".call(null, opts)) ? goog.string.quote.call(null, obj) : obj)
      }else {
        return null
      }
    }
  }
};
cljs.core.NodeSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.RedNode.prototype.cljs$core$IPrintable$ = true;
cljs.core.RedNode.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__8611 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__8611, "{", ", ", "}", opts, coll)
};
cljs.core.Vector.prototype.cljs$core$IPrintable$ = true;
cljs.core.Vector.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#{", " ", "}", opts, coll)
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.List.prototype.cljs$core$IPrintable$ = true;
cljs.core.List.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.IPrintable["array"] = true;
cljs.core._pr_seq["array"] = function(a, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "#<Array [", ", ", "]>", opts, a)
};
cljs.core.IPrintable["function"] = true;
cljs.core._pr_seq["function"] = function(this$) {
  return cljs.core.list.call(null, "#<", [cljs.core.str(this$)].join(""), ">")
};
cljs.core.EmptyList.prototype.cljs$core$IPrintable$ = true;
cljs.core.EmptyList.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.list.call(null, "()")
};
cljs.core.BlackNode.prototype.cljs$core$IPrintable$ = true;
cljs.core.BlackNode.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "[", " ", "]", opts, coll)
};
cljs.core.Cons.prototype.cljs$core$IPrintable$ = true;
cljs.core.Cons.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.Range.prototype.cljs$core$IPrintable$ = true;
cljs.core.Range.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.ObjMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__8612 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__8612, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, coll)
};
cljs.core.Atom = function(state, meta, validator, watches) {
  this.state = state;
  this.meta = meta;
  this.validator = validator;
  this.watches = watches;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1345404928
};
cljs.core.Atom.cljs$lang$type = true;
cljs.core.Atom.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.Atom")
};
cljs.core.Atom.prototype.cljs$core$IHash$ = true;
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var this__8613 = this;
  return goog.getUid.call(null, this$)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$ = true;
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(this$, oldval, newval) {
  var this__8614 = this;
  var G__8615__8616 = cljs.core.seq.call(null, this__8614.watches);
  if(cljs.core.truth_(G__8615__8616)) {
    var G__8618__8620 = cljs.core.first.call(null, G__8615__8616);
    var vec__8619__8621 = G__8618__8620;
    var key__8622 = cljs.core.nth.call(null, vec__8619__8621, 0, null);
    var f__8623 = cljs.core.nth.call(null, vec__8619__8621, 1, null);
    var G__8615__8624 = G__8615__8616;
    var G__8618__8625 = G__8618__8620;
    var G__8615__8626 = G__8615__8624;
    while(true) {
      var vec__8627__8628 = G__8618__8625;
      var key__8629 = cljs.core.nth.call(null, vec__8627__8628, 0, null);
      var f__8630 = cljs.core.nth.call(null, vec__8627__8628, 1, null);
      var G__8615__8631 = G__8615__8626;
      f__8630.call(null, key__8629, this$, oldval, newval);
      var temp__324__auto____8632 = cljs.core.next.call(null, G__8615__8631);
      if(cljs.core.truth_(temp__324__auto____8632)) {
        var G__8615__8633 = temp__324__auto____8632;
        var G__8640 = cljs.core.first.call(null, G__8615__8633);
        var G__8641 = G__8615__8633;
        G__8618__8625 = G__8640;
        G__8615__8626 = G__8641;
        continue
      }else {
        return null
      }
      break
    }
  }else {
    return null
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = function(this$, key, f) {
  var this__8634 = this;
  return this$.watches = cljs.core.assoc.call(null, this__8634.watches, key, f)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(this$, key) {
  var this__8635 = this;
  return this$.watches = cljs.core.dissoc.call(null, this__8635.watches, key)
};
cljs.core.Atom.prototype.cljs$core$IPrintable$ = true;
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, opts) {
  var this__8636 = this;
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["#<Atom: "]), cljs.core._pr_seq.call(null, this__8636.state, opts), ">")
};
cljs.core.Atom.prototype.cljs$core$IMeta$ = true;
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function(_) {
  var this__8637 = this;
  return this__8637.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$ = true;
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function(_) {
  var this__8638 = this;
  return this__8638.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$ = true;
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var this__8639 = this;
  return o === other
};
cljs.core.Atom;
cljs.core.atom = function() {
  var atom = null;
  var atom__1 = function(x) {
    return new cljs.core.Atom(x, null, null, null)
  };
  var atom__2 = function() {
    var G__8648__delegate = function(x, p__8642) {
      var map__8643__8644 = p__8642;
      var map__8643__8645 = cljs.core.seq_QMARK_.call(null, map__8643__8644) ? cljs.core.apply.call(null, cljs.core.hash_map, map__8643__8644) : map__8643__8644;
      var validator__8646 = cljs.core.get.call(null, map__8643__8645, "\ufdd0'validator");
      var meta__8647 = cljs.core.get.call(null, map__8643__8645, "\ufdd0'meta");
      return new cljs.core.Atom(x, meta__8647, validator__8646, null)
    };
    var G__8648 = function(x, var_args) {
      var p__8642 = null;
      if(goog.isDef(var_args)) {
        p__8642 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__8648__delegate.call(this, x, p__8642)
    };
    G__8648.cljs$lang$maxFixedArity = 1;
    G__8648.cljs$lang$applyTo = function(arglist__8649) {
      var x = cljs.core.first(arglist__8649);
      var p__8642 = cljs.core.rest(arglist__8649);
      return G__8648__delegate(x, p__8642)
    };
    G__8648.cljs$lang$arity$variadic = G__8648__delegate;
    return G__8648
  }();
  atom = function(x, var_args) {
    var p__8642 = var_args;
    switch(arguments.length) {
      case 1:
        return atom__1.call(this, x);
      default:
        return atom__2.cljs$lang$arity$variadic(x, cljs.core.array_seq(arguments, 1))
    }
    throw"Invalid arity: " + arguments.length;
  };
  atom.cljs$lang$maxFixedArity = 1;
  atom.cljs$lang$applyTo = atom__2.cljs$lang$applyTo;
  atom.cljs$lang$arity$1 = atom__1;
  atom.cljs$lang$arity$variadic = atom__2.cljs$lang$arity$variadic;
  return atom
}();
cljs.core.reset_BANG_ = function reset_BANG_(a, new_value) {
  var temp__324__auto____8650 = a.validator;
  if(cljs.core.truth_(temp__324__auto____8650)) {
    var validate__8651 = temp__324__auto____8650;
    if(cljs.core.truth_(validate__8651.call(null, new_value))) {
    }else {
      throw new Error([cljs.core.str("Assert failed: "), cljs.core.str("Validator rejected reference state"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'validate", "\ufdd1'new-value"), cljs.core.hash_map("\ufdd0'line", 5917))))].join(""));
    }
  }else {
  }
  var old_value__8652 = a.state;
  a.state = new_value;
  cljs.core._notify_watches.call(null, a, old_value__8652, new_value);
  return new_value
};
cljs.core.swap_BANG_ = function() {
  var swap_BANG_ = null;
  var swap_BANG___2 = function(a, f) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state))
  };
  var swap_BANG___3 = function(a, f, x) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x))
  };
  var swap_BANG___4 = function(a, f, x, y) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x, y))
  };
  var swap_BANG___5 = function(a, f, x, y, z) {
    return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x, y, z))
  };
  var swap_BANG___6 = function() {
    var G__8653__delegate = function(a, f, x, y, z, more) {
      return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, f, a.state, x, y, z, more))
    };
    var G__8653 = function(a, f, x, y, z, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__8653__delegate.call(this, a, f, x, y, z, more)
    };
    G__8653.cljs$lang$maxFixedArity = 5;
    G__8653.cljs$lang$applyTo = function(arglist__8654) {
      var a = cljs.core.first(arglist__8654);
      var f = cljs.core.first(cljs.core.next(arglist__8654));
      var x = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8654)));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__8654))));
      var z = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__8654)))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__8654)))));
      return G__8653__delegate(a, f, x, y, z, more)
    };
    G__8653.cljs$lang$arity$variadic = G__8653__delegate;
    return G__8653
  }();
  swap_BANG_ = function(a, f, x, y, z, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return swap_BANG___2.call(this, a, f);
      case 3:
        return swap_BANG___3.call(this, a, f, x);
      case 4:
        return swap_BANG___4.call(this, a, f, x, y);
      case 5:
        return swap_BANG___5.call(this, a, f, x, y, z);
      default:
        return swap_BANG___6.cljs$lang$arity$variadic(a, f, x, y, z, cljs.core.array_seq(arguments, 5))
    }
    throw"Invalid arity: " + arguments.length;
  };
  swap_BANG_.cljs$lang$maxFixedArity = 5;
  swap_BANG_.cljs$lang$applyTo = swap_BANG___6.cljs$lang$applyTo;
  swap_BANG_.cljs$lang$arity$2 = swap_BANG___2;
  swap_BANG_.cljs$lang$arity$3 = swap_BANG___3;
  swap_BANG_.cljs$lang$arity$4 = swap_BANG___4;
  swap_BANG_.cljs$lang$arity$5 = swap_BANG___5;
  swap_BANG_.cljs$lang$arity$variadic = swap_BANG___6.cljs$lang$arity$variadic;
  return swap_BANG_
}();
cljs.core.compare_and_set_BANG_ = function compare_and_set_BANG_(a, oldval, newval) {
  if(cljs.core._EQ_.call(null, a.state, oldval)) {
    cljs.core.reset_BANG_.call(null, a, newval);
    return true
  }else {
    return false
  }
};
cljs.core.deref = function deref(o) {
  return cljs.core._deref.call(null, o)
};
cljs.core.set_validator_BANG_ = function set_validator_BANG_(iref, val) {
  return iref.validator = val
};
cljs.core.get_validator = function get_validator(iref) {
  return iref.validator
};
cljs.core.alter_meta_BANG_ = function() {
  var alter_meta_BANG___delegate = function(iref, f, args) {
    return iref.meta = cljs.core.apply.call(null, f, iref.meta, args)
  };
  var alter_meta_BANG_ = function(iref, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return alter_meta_BANG___delegate.call(this, iref, f, args)
  };
  alter_meta_BANG_.cljs$lang$maxFixedArity = 2;
  alter_meta_BANG_.cljs$lang$applyTo = function(arglist__8655) {
    var iref = cljs.core.first(arglist__8655);
    var f = cljs.core.first(cljs.core.next(arglist__8655));
    var args = cljs.core.rest(cljs.core.next(arglist__8655));
    return alter_meta_BANG___delegate(iref, f, args)
  };
  alter_meta_BANG_.cljs$lang$arity$variadic = alter_meta_BANG___delegate;
  return alter_meta_BANG_
}();
cljs.core.reset_meta_BANG_ = function reset_meta_BANG_(iref, m) {
  return iref.meta = m
};
cljs.core.add_watch = function add_watch(iref, key, f) {
  return cljs.core._add_watch.call(null, iref, key, f)
};
cljs.core.remove_watch = function remove_watch(iref, key) {
  return cljs.core._remove_watch.call(null, iref, key)
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var gensym = null;
  var gensym__0 = function() {
    return gensym.call(null, "G__")
  };
  var gensym__1 = function(prefix_string) {
    if(cljs.core.gensym_counter == null) {
      cljs.core.gensym_counter = cljs.core.atom.call(null, 0)
    }else {
    }
    return cljs.core.symbol.call(null, [cljs.core.str(prefix_string), cljs.core.str(cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc))].join(""))
  };
  gensym = function(prefix_string) {
    switch(arguments.length) {
      case 0:
        return gensym__0.call(this);
      case 1:
        return gensym__1.call(this, prefix_string)
    }
    throw"Invalid arity: " + arguments.length;
  };
  gensym.cljs$lang$arity$0 = gensym__0;
  gensym.cljs$lang$arity$1 = gensym__1;
  return gensym
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(state, f) {
  this.state = state;
  this.f = f;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 536887296
};
cljs.core.Delay.cljs$lang$type = true;
cljs.core.Delay.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.Delay")
};
cljs.core.Delay.prototype.cljs$core$IPending$ = true;
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = function(d) {
  var this__8656 = this;
  return"\ufdd0'done".call(null, cljs.core.deref.call(null, this__8656.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$ = true;
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function(_) {
  var this__8657 = this;
  return"\ufdd0'value".call(null, cljs.core.swap_BANG_.call(null, this__8657.state, function(p__8658) {
    var curr_state__8659 = p__8658;
    var curr_state__8660 = cljs.core.seq_QMARK_.call(null, curr_state__8659) ? cljs.core.apply.call(null, cljs.core.hash_map, curr_state__8659) : curr_state__8659;
    var done__8661 = cljs.core.get.call(null, curr_state__8660, "\ufdd0'done");
    if(cljs.core.truth_(done__8661)) {
      return curr_state__8660
    }else {
      return cljs.core.ObjMap.fromObject(["\ufdd0'done", "\ufdd0'value"], {"\ufdd0'done":true, "\ufdd0'value":this__8657.f.call(null)})
    }
  }))
};
cljs.core.Delay;
cljs.core.delay_QMARK_ = function delay_QMARK_(x) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Delay, x)
};
cljs.core.force = function force(x) {
  if(cljs.core.delay_QMARK_.call(null, x)) {
    return cljs.core.deref.call(null, x)
  }else {
    return x
  }
};
cljs.core.realized_QMARK_ = function realized_QMARK_(d) {
  return cljs.core._realized_QMARK_.call(null, d)
};
cljs.core.js__GT_clj = function() {
  var js__GT_clj__delegate = function(x, options) {
    var map__8662__8663 = options;
    var map__8662__8664 = cljs.core.seq_QMARK_.call(null, map__8662__8663) ? cljs.core.apply.call(null, cljs.core.hash_map, map__8662__8663) : map__8662__8663;
    var keywordize_keys__8665 = cljs.core.get.call(null, map__8662__8664, "\ufdd0'keywordize-keys");
    var keyfn__8666 = cljs.core.truth_(keywordize_keys__8665) ? cljs.core.keyword : cljs.core.str;
    var f__8672 = function thisfn(x) {
      if(cljs.core.seq_QMARK_.call(null, x)) {
        return cljs.core.doall.call(null, cljs.core.map.call(null, thisfn, x))
      }else {
        if(cljs.core.coll_QMARK_.call(null, x)) {
          return cljs.core.into.call(null, cljs.core.empty.call(null, x), cljs.core.map.call(null, thisfn, x))
        }else {
          if(cljs.core.truth_(goog.isArray.call(null, x))) {
            return cljs.core.vec.call(null, cljs.core.map.call(null, thisfn, x))
          }else {
            if(cljs.core.type.call(null, x) === Object) {
              return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), function() {
                var iter__2589__auto____8671 = function iter__8667(s__8668) {
                  return new cljs.core.LazySeq(null, false, function() {
                    var s__8668__8669 = s__8668;
                    while(true) {
                      if(cljs.core.truth_(cljs.core.seq.call(null, s__8668__8669))) {
                        var k__8670 = cljs.core.first.call(null, s__8668__8669);
                        return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([keyfn__8666.call(null, k__8670), thisfn.call(null, x[k__8670])]), iter__8667.call(null, cljs.core.rest.call(null, s__8668__8669)))
                      }else {
                        return null
                      }
                      break
                    }
                  })
                };
                return iter__2589__auto____8671.call(null, cljs.core.js_keys.call(null, x))
              }())
            }else {
              if("\ufdd0'else") {
                return x
              }else {
                return null
              }
            }
          }
        }
      }
    };
    return f__8672.call(null, x)
  };
  var js__GT_clj = function(x, var_args) {
    var options = null;
    if(goog.isDef(var_args)) {
      options = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return js__GT_clj__delegate.call(this, x, options)
  };
  js__GT_clj.cljs$lang$maxFixedArity = 1;
  js__GT_clj.cljs$lang$applyTo = function(arglist__8673) {
    var x = cljs.core.first(arglist__8673);
    var options = cljs.core.rest(arglist__8673);
    return js__GT_clj__delegate(x, options)
  };
  js__GT_clj.cljs$lang$arity$variadic = js__GT_clj__delegate;
  return js__GT_clj
}();
cljs.core.memoize = function memoize(f) {
  var mem__8674 = cljs.core.atom.call(null, cljs.core.ObjMap.fromObject([], {}));
  return function() {
    var G__8678__delegate = function(args) {
      var temp__317__auto____8675 = cljs.core.get.call(null, cljs.core.deref.call(null, mem__8674), args);
      if(cljs.core.truth_(temp__317__auto____8675)) {
        var v__8676 = temp__317__auto____8675;
        return v__8676
      }else {
        var ret__8677 = cljs.core.apply.call(null, f, args);
        cljs.core.swap_BANG_.call(null, mem__8674, cljs.core.assoc, args, ret__8677);
        return ret__8677
      }
    };
    var G__8678 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__8678__delegate.call(this, args)
    };
    G__8678.cljs$lang$maxFixedArity = 0;
    G__8678.cljs$lang$applyTo = function(arglist__8679) {
      var args = cljs.core.seq(arglist__8679);
      return G__8678__delegate(args)
    };
    G__8678.cljs$lang$arity$variadic = G__8678__delegate;
    return G__8678
  }()
};
cljs.core.trampoline = function() {
  var trampoline = null;
  var trampoline__1 = function(f) {
    while(true) {
      var ret__8680 = f.call(null);
      if(cljs.core.fn_QMARK_.call(null, ret__8680)) {
        var G__8681 = ret__8680;
        f = G__8681;
        continue
      }else {
        return ret__8680
      }
      break
    }
  };
  var trampoline__2 = function() {
    var G__8682__delegate = function(f, args) {
      return trampoline.call(null, function() {
        return cljs.core.apply.call(null, f, args)
      })
    };
    var G__8682 = function(f, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__8682__delegate.call(this, f, args)
    };
    G__8682.cljs$lang$maxFixedArity = 1;
    G__8682.cljs$lang$applyTo = function(arglist__8683) {
      var f = cljs.core.first(arglist__8683);
      var args = cljs.core.rest(arglist__8683);
      return G__8682__delegate(f, args)
    };
    G__8682.cljs$lang$arity$variadic = G__8682__delegate;
    return G__8682
  }();
  trampoline = function(f, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 1:
        return trampoline__1.call(this, f);
      default:
        return trampoline__2.cljs$lang$arity$variadic(f, cljs.core.array_seq(arguments, 1))
    }
    throw"Invalid arity: " + arguments.length;
  };
  trampoline.cljs$lang$maxFixedArity = 1;
  trampoline.cljs$lang$applyTo = trampoline__2.cljs$lang$applyTo;
  trampoline.cljs$lang$arity$1 = trampoline__1;
  trampoline.cljs$lang$arity$variadic = trampoline__2.cljs$lang$arity$variadic;
  return trampoline
}();
cljs.core.rand = function() {
  var rand = null;
  var rand__0 = function() {
    return rand.call(null, 1)
  };
  var rand__1 = function(n) {
    return Math.random() * n
  };
  rand = function(n) {
    switch(arguments.length) {
      case 0:
        return rand__0.call(this);
      case 1:
        return rand__1.call(this, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  rand.cljs$lang$arity$0 = rand__0;
  rand.cljs$lang$arity$1 = rand__1;
  return rand
}();
cljs.core.rand_int = function rand_int(n) {
  return Math.floor(Math.random() * n)
};
cljs.core.rand_nth = function rand_nth(coll) {
  return cljs.core.nth.call(null, coll, cljs.core.rand_int.call(null, cljs.core.count.call(null, coll)))
};
cljs.core.group_by = function group_by(f, coll) {
  return cljs.core.reduce.call(null, function(ret, x) {
    var k__8684 = f.call(null, x);
    return cljs.core.assoc.call(null, ret, k__8684, cljs.core.conj.call(null, cljs.core.get.call(null, ret, k__8684, cljs.core.PersistentVector.fromArray([])), x))
  }, cljs.core.ObjMap.fromObject([], {}), coll)
};
cljs.core.make_hierarchy = function make_hierarchy() {
  return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'descendants", "\ufdd0'ancestors"], {"\ufdd0'parents":cljs.core.ObjMap.fromObject([], {}), "\ufdd0'descendants":cljs.core.ObjMap.fromObject([], {}), "\ufdd0'ancestors":cljs.core.ObjMap.fromObject([], {})})
};
cljs.core.global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null));
cljs.core.isa_QMARK_ = function() {
  var isa_QMARK_ = null;
  var isa_QMARK___2 = function(child, parent) {
    return isa_QMARK_.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), child, parent)
  };
  var isa_QMARK___3 = function(h, child, parent) {
    var or__138__auto____8685 = cljs.core._EQ_.call(null, child, parent);
    if(or__138__auto____8685) {
      return or__138__auto____8685
    }else {
      var or__138__auto____8686 = cljs.core.contains_QMARK_.call(null, "\ufdd0'ancestors".call(null, h).call(null, child), parent);
      if(or__138__auto____8686) {
        return or__138__auto____8686
      }else {
        var and__132__auto____8687 = cljs.core.vector_QMARK_.call(null, parent);
        if(and__132__auto____8687) {
          var and__132__auto____8688 = cljs.core.vector_QMARK_.call(null, child);
          if(and__132__auto____8688) {
            var and__132__auto____8689 = cljs.core.count.call(null, parent) === cljs.core.count.call(null, child);
            if(and__132__auto____8689) {
              var ret__8690 = true;
              var i__8691 = 0;
              while(true) {
                if(function() {
                  var or__138__auto____8692 = cljs.core.not.call(null, ret__8690);
                  if(or__138__auto____8692) {
                    return or__138__auto____8692
                  }else {
                    return i__8691 === cljs.core.count.call(null, parent)
                  }
                }()) {
                  return ret__8690
                }else {
                  var G__8693 = isa_QMARK_.call(null, h, child.call(null, i__8691), parent.call(null, i__8691));
                  var G__8694 = i__8691 + 1;
                  ret__8690 = G__8693;
                  i__8691 = G__8694;
                  continue
                }
                break
              }
            }else {
              return and__132__auto____8689
            }
          }else {
            return and__132__auto____8688
          }
        }else {
          return and__132__auto____8687
        }
      }
    }
  };
  isa_QMARK_ = function(h, child, parent) {
    switch(arguments.length) {
      case 2:
        return isa_QMARK___2.call(this, h, child);
      case 3:
        return isa_QMARK___3.call(this, h, child, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  isa_QMARK_.cljs$lang$arity$2 = isa_QMARK___2;
  isa_QMARK_.cljs$lang$arity$3 = isa_QMARK___3;
  return isa_QMARK_
}();
cljs.core.parents = function() {
  var parents = null;
  var parents__1 = function(tag) {
    return parents.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var parents__2 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'parents".call(null, h), tag))
  };
  parents = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return parents__1.call(this, h);
      case 2:
        return parents__2.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  parents.cljs$lang$arity$1 = parents__1;
  parents.cljs$lang$arity$2 = parents__2;
  return parents
}();
cljs.core.ancestors = function() {
  var ancestors = null;
  var ancestors__1 = function(tag) {
    return ancestors.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var ancestors__2 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'ancestors".call(null, h), tag))
  };
  ancestors = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return ancestors__1.call(this, h);
      case 2:
        return ancestors__2.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  ancestors.cljs$lang$arity$1 = ancestors__1;
  ancestors.cljs$lang$arity$2 = ancestors__2;
  return ancestors
}();
cljs.core.descendants = function() {
  var descendants = null;
  var descendants__1 = function(tag) {
    return descendants.call(null, cljs.core.deref.call(null, cljs.core.global_hierarchy), tag)
  };
  var descendants__2 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, "\ufdd0'descendants".call(null, h), tag))
  };
  descendants = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return descendants__1.call(this, h);
      case 2:
        return descendants__2.call(this, h, tag)
    }
    throw"Invalid arity: " + arguments.length;
  };
  descendants.cljs$lang$arity$1 = descendants__1;
  descendants.cljs$lang$arity$2 = descendants__2;
  return descendants
}();
cljs.core.derive = function() {
  var derive = null;
  var derive__2 = function(tag, parent) {
    if(cljs.core.truth_(cljs.core.namespace.call(null, parent))) {
    }else {
      throw new Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'namespace", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 6201))))].join(""));
    }
    cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, derive, tag, parent);
    return null
  };
  var derive__3 = function(h, tag, parent) {
    if(cljs.core.not_EQ_.call(null, tag, parent)) {
    }else {
      throw new Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'not=", "\ufdd1'tag", "\ufdd1'parent"), cljs.core.hash_map("\ufdd0'line", 6205))))].join(""));
    }
    var tp__8698 = "\ufdd0'parents".call(null, h);
    var td__8699 = "\ufdd0'descendants".call(null, h);
    var ta__8700 = "\ufdd0'ancestors".call(null, h);
    var tf__8701 = function(m, source, sources, target, targets) {
      return cljs.core.reduce.call(null, function(ret, k) {
        return cljs.core.assoc.call(null, ret, k, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.get.call(null, targets, k, cljs.core.set([])), cljs.core.cons.call(null, target, targets.call(null, target))))
      }, m, cljs.core.cons.call(null, source, sources.call(null, source)))
    };
    var or__138__auto____8702 = cljs.core.contains_QMARK_.call(null, tp__8698.call(null, tag), parent) ? null : function() {
      if(cljs.core.contains_QMARK_.call(null, ta__8700.call(null, tag), parent)) {
        throw new Error([cljs.core.str(tag), cljs.core.str("already has"), cljs.core.str(parent), cljs.core.str("as ancestor")].join(""));
      }else {
      }
      if(cljs.core.contains_QMARK_.call(null, ta__8700.call(null, parent), tag)) {
        throw new Error([cljs.core.str("Cyclic derivation:"), cljs.core.str(parent), cljs.core.str("has"), cljs.core.str(tag), cljs.core.str("as ancestor")].join(""));
      }else {
      }
      return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'ancestors", "\ufdd0'descendants"], {"\ufdd0'parents":cljs.core.assoc.call(null, "\ufdd0'parents".call(null, h), tag, cljs.core.conj.call(null, cljs.core.get.call(null, tp__8698, tag, cljs.core.set([])), parent)), "\ufdd0'ancestors":tf__8701.call(null, "\ufdd0'ancestors".call(null, h), tag, td__8699, parent, ta__8700), "\ufdd0'descendants":tf__8701.call(null, "\ufdd0'descendants".call(null, h), parent, ta__8700, tag, td__8699)})
    }();
    if(cljs.core.truth_(or__138__auto____8702)) {
      return or__138__auto____8702
    }else {
      return h
    }
  };
  derive = function(h, tag, parent) {
    switch(arguments.length) {
      case 2:
        return derive__2.call(this, h, tag);
      case 3:
        return derive__3.call(this, h, tag, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  derive.cljs$lang$arity$2 = derive__2;
  derive.cljs$lang$arity$3 = derive__3;
  return derive
}();
cljs.core.underive = function() {
  var underive = null;
  var underive__2 = function(tag, parent) {
    cljs.core.swap_BANG_.call(null, cljs.core.global_hierarchy, underive, tag, parent);
    return null
  };
  var underive__3 = function(h, tag, parent) {
    var parentMap__8703 = "\ufdd0'parents".call(null, h);
    var childsParents__8704 = cljs.core.truth_(parentMap__8703.call(null, tag)) ? cljs.core.disj.call(null, parentMap__8703.call(null, tag), parent) : cljs.core.set([]);
    var newParents__8705 = cljs.core.truth_(cljs.core.not_empty.call(null, childsParents__8704)) ? cljs.core.assoc.call(null, parentMap__8703, tag, childsParents__8704) : cljs.core.dissoc.call(null, parentMap__8703, tag);
    var deriv_seq__8706 = cljs.core.flatten.call(null, cljs.core.map.call(null, function(p1__8695_SHARP_) {
      return cljs.core.cons.call(null, cljs.core.first.call(null, p1__8695_SHARP_), cljs.core.interpose.call(null, cljs.core.first.call(null, p1__8695_SHARP_), cljs.core.second.call(null, p1__8695_SHARP_)))
    }, cljs.core.seq.call(null, newParents__8705)));
    if(cljs.core.contains_QMARK_.call(null, parentMap__8703.call(null, tag), parent)) {
      return cljs.core.reduce.call(null, function(p1__8696_SHARP_, p2__8697_SHARP_) {
        return cljs.core.apply.call(null, cljs.core.derive, p1__8696_SHARP_, p2__8697_SHARP_)
      }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, deriv_seq__8706))
    }else {
      return h
    }
  };
  underive = function(h, tag, parent) {
    switch(arguments.length) {
      case 2:
        return underive__2.call(this, h, tag);
      case 3:
        return underive__3.call(this, h, tag, parent)
    }
    throw"Invalid arity: " + arguments.length;
  };
  underive.cljs$lang$arity$2 = underive__2;
  underive.cljs$lang$arity$3 = underive__3;
  return underive
}();
cljs.core.reset_cache = function reset_cache(method_cache, method_table, cached_hierarchy, hierarchy) {
  cljs.core.swap_BANG_.call(null, method_cache, function(_) {
    return cljs.core.deref.call(null, method_table)
  });
  return cljs.core.swap_BANG_.call(null, cached_hierarchy, function(_) {
    return cljs.core.deref.call(null, hierarchy)
  })
};
cljs.core.prefers_STAR_ = function prefers_STAR_(x, y, prefer_table) {
  var xprefs__8707 = cljs.core.deref.call(null, prefer_table).call(null, x);
  var or__138__auto____8709 = cljs.core.truth_(function() {
    var and__132__auto____8708 = xprefs__8707;
    if(cljs.core.truth_(and__132__auto____8708)) {
      return xprefs__8707.call(null, y)
    }else {
      return and__132__auto____8708
    }
  }()) ? true : null;
  if(cljs.core.truth_(or__138__auto____8709)) {
    return or__138__auto____8709
  }else {
    var or__138__auto____8711 = function() {
      var ps__8710 = cljs.core.parents.call(null, y);
      while(true) {
        if(cljs.core.count.call(null, ps__8710) > 0) {
          if(cljs.core.truth_(prefers_STAR_.call(null, x, cljs.core.first.call(null, ps__8710), prefer_table))) {
          }else {
          }
          var G__8714 = cljs.core.rest.call(null, ps__8710);
          ps__8710 = G__8714;
          continue
        }else {
          return null
        }
        break
      }
    }();
    if(cljs.core.truth_(or__138__auto____8711)) {
      return or__138__auto____8711
    }else {
      var or__138__auto____8713 = function() {
        var ps__8712 = cljs.core.parents.call(null, x);
        while(true) {
          if(cljs.core.count.call(null, ps__8712) > 0) {
            if(cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, ps__8712), y, prefer_table))) {
            }else {
            }
            var G__8715 = cljs.core.rest.call(null, ps__8712);
            ps__8712 = G__8715;
            continue
          }else {
            return null
          }
          break
        }
      }();
      if(cljs.core.truth_(or__138__auto____8713)) {
        return or__138__auto____8713
      }else {
        return false
      }
    }
  }
};
cljs.core.dominates = function dominates(x, y, prefer_table) {
  var or__138__auto____8716 = cljs.core.prefers_STAR_.call(null, x, y, prefer_table);
  if(cljs.core.truth_(or__138__auto____8716)) {
    return or__138__auto____8716
  }else {
    return cljs.core.isa_QMARK_.call(null, x, y)
  }
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  var best_entry__8725 = cljs.core.reduce.call(null, function(be, p__8717) {
    var vec__8718__8719 = p__8717;
    var k__8720 = cljs.core.nth.call(null, vec__8718__8719, 0, null);
    var ___8721 = cljs.core.nth.call(null, vec__8718__8719, 1, null);
    var e__8722 = vec__8718__8719;
    if(cljs.core.isa_QMARK_.call(null, dispatch_val, k__8720)) {
      var be2__8724 = cljs.core.truth_(function() {
        var or__138__auto____8723 = be == null;
        if(or__138__auto____8723) {
          return or__138__auto____8723
        }else {
          return cljs.core.dominates.call(null, k__8720, cljs.core.first.call(null, be), prefer_table)
        }
      }()) ? e__8722 : be;
      if(cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, be2__8724), k__8720, prefer_table))) {
      }else {
        throw new Error([cljs.core.str("Multiple methods in multimethod '"), cljs.core.str(name), cljs.core.str("' match dispatch value: "), cljs.core.str(dispatch_val), cljs.core.str(" -> "), cljs.core.str(k__8720), cljs.core.str(" and "), cljs.core.str(cljs.core.first.call(null, be2__8724)), cljs.core.str(", and neither is preferred")].join(""));
      }
      return be2__8724
    }else {
      return be
    }
  }, null, cljs.core.deref.call(null, method_table));
  if(cljs.core.truth_(best_entry__8725)) {
    if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, cached_hierarchy), cljs.core.deref.call(null, hierarchy))) {
      cljs.core.swap_BANG_.call(null, method_cache, cljs.core.assoc, dispatch_val, cljs.core.second.call(null, best_entry__8725));
      return cljs.core.second.call(null, best_entry__8725)
    }else {
      cljs.core.reset_cache.call(null, method_cache, method_table, cached_hierarchy, hierarchy);
      return find_and_cache_best_method.call(null, name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy)
    }
  }else {
    return null
  }
};
void 0;
cljs.core.IMultiFn = {};
cljs.core._reset = function _reset(mf) {
  if(function() {
    var and__132__auto____8726 = mf;
    if(and__132__auto____8726) {
      return mf.cljs$core$IMultiFn$_reset$arity$1
    }else {
      return and__132__auto____8726
    }
  }()) {
    return mf.cljs$core$IMultiFn$_reset$arity$1(mf)
  }else {
    return function() {
      var or__138__auto____8727 = cljs.core._reset[goog.typeOf.call(null, mf)];
      if(or__138__auto____8727) {
        return or__138__auto____8727
      }else {
        var or__138__auto____8728 = cljs.core._reset["_"];
        if(or__138__auto____8728) {
          return or__138__auto____8728
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._add_method = function _add_method(mf, dispatch_val, method) {
  if(function() {
    var and__132__auto____8729 = mf;
    if(and__132__auto____8729) {
      return mf.cljs$core$IMultiFn$_add_method$arity$3
    }else {
      return and__132__auto____8729
    }
  }()) {
    return mf.cljs$core$IMultiFn$_add_method$arity$3(mf, dispatch_val, method)
  }else {
    return function() {
      var or__138__auto____8730 = cljs.core._add_method[goog.typeOf.call(null, mf)];
      if(or__138__auto____8730) {
        return or__138__auto____8730
      }else {
        var or__138__auto____8731 = cljs.core._add_method["_"];
        if(or__138__auto____8731) {
          return or__138__auto____8731
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, method)
  }
};
cljs.core._remove_method = function _remove_method(mf, dispatch_val) {
  if(function() {
    var and__132__auto____8732 = mf;
    if(and__132__auto____8732) {
      return mf.cljs$core$IMultiFn$_remove_method$arity$2
    }else {
      return and__132__auto____8732
    }
  }()) {
    return mf.cljs$core$IMultiFn$_remove_method$arity$2(mf, dispatch_val)
  }else {
    return function() {
      var or__138__auto____8733 = cljs.core._remove_method[goog.typeOf.call(null, mf)];
      if(or__138__auto____8733) {
        return or__138__auto____8733
      }else {
        var or__138__auto____8734 = cljs.core._remove_method["_"];
        if(or__138__auto____8734) {
          return or__138__auto____8734
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._prefer_method = function _prefer_method(mf, dispatch_val, dispatch_val_y) {
  if(function() {
    var and__132__auto____8735 = mf;
    if(and__132__auto____8735) {
      return mf.cljs$core$IMultiFn$_prefer_method$arity$3
    }else {
      return and__132__auto____8735
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefer_method$arity$3(mf, dispatch_val, dispatch_val_y)
  }else {
    return function() {
      var or__138__auto____8736 = cljs.core._prefer_method[goog.typeOf.call(null, mf)];
      if(or__138__auto____8736) {
        return or__138__auto____8736
      }else {
        var or__138__auto____8737 = cljs.core._prefer_method["_"];
        if(or__138__auto____8737) {
          return or__138__auto____8737
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, dispatch_val_y)
  }
};
cljs.core._get_method = function _get_method(mf, dispatch_val) {
  if(function() {
    var and__132__auto____8738 = mf;
    if(and__132__auto____8738) {
      return mf.cljs$core$IMultiFn$_get_method$arity$2
    }else {
      return and__132__auto____8738
    }
  }()) {
    return mf.cljs$core$IMultiFn$_get_method$arity$2(mf, dispatch_val)
  }else {
    return function() {
      var or__138__auto____8739 = cljs.core._get_method[goog.typeOf.call(null, mf)];
      if(or__138__auto____8739) {
        return or__138__auto____8739
      }else {
        var or__138__auto____8740 = cljs.core._get_method["_"];
        if(or__138__auto____8740) {
          return or__138__auto____8740
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._methods = function _methods(mf) {
  if(function() {
    var and__132__auto____8741 = mf;
    if(and__132__auto____8741) {
      return mf.cljs$core$IMultiFn$_methods$arity$1
    }else {
      return and__132__auto____8741
    }
  }()) {
    return mf.cljs$core$IMultiFn$_methods$arity$1(mf)
  }else {
    return function() {
      var or__138__auto____8742 = cljs.core._methods[goog.typeOf.call(null, mf)];
      if(or__138__auto____8742) {
        return or__138__auto____8742
      }else {
        var or__138__auto____8743 = cljs.core._methods["_"];
        if(or__138__auto____8743) {
          return or__138__auto____8743
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._prefers = function _prefers(mf) {
  if(function() {
    var and__132__auto____8744 = mf;
    if(and__132__auto____8744) {
      return mf.cljs$core$IMultiFn$_prefers$arity$1
    }else {
      return and__132__auto____8744
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefers$arity$1(mf)
  }else {
    return function() {
      var or__138__auto____8745 = cljs.core._prefers[goog.typeOf.call(null, mf)];
      if(or__138__auto____8745) {
        return or__138__auto____8745
      }else {
        var or__138__auto____8746 = cljs.core._prefers["_"];
        if(or__138__auto____8746) {
          return or__138__auto____8746
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._dispatch = function _dispatch(mf, args) {
  if(function() {
    var and__132__auto____8747 = mf;
    if(and__132__auto____8747) {
      return mf.cljs$core$IMultiFn$_dispatch$arity$2
    }else {
      return and__132__auto____8747
    }
  }()) {
    return mf.cljs$core$IMultiFn$_dispatch$arity$2(mf, args)
  }else {
    return function() {
      var or__138__auto____8748 = cljs.core._dispatch[goog.typeOf.call(null, mf)];
      if(or__138__auto____8748) {
        return or__138__auto____8748
      }else {
        var or__138__auto____8749 = cljs.core._dispatch["_"];
        if(or__138__auto____8749) {
          return or__138__auto____8749
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", mf);
        }
      }
    }().call(null, mf, args)
  }
};
void 0;
cljs.core.do_dispatch = function do_dispatch(mf, dispatch_fn, args) {
  var dispatch_val__8750 = cljs.core.apply.call(null, dispatch_fn, args);
  var target_fn__8751 = cljs.core._get_method.call(null, mf, dispatch_val__8750);
  if(cljs.core.truth_(target_fn__8751)) {
  }else {
    throw new Error([cljs.core.str("No method in multimethod '"), cljs.core.str(cljs.core.name), cljs.core.str("' for dispatch value: "), cljs.core.str(dispatch_val__8750)].join(""));
  }
  return cljs.core.apply.call(null, target_fn__8751, args)
};
cljs.core.MultiFn = function(name, dispatch_fn, default_dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  this.name = name;
  this.dispatch_fn = dispatch_fn;
  this.default_dispatch_val = default_dispatch_val;
  this.hierarchy = hierarchy;
  this.method_table = method_table;
  this.prefer_table = prefer_table;
  this.method_cache = method_cache;
  this.cached_hierarchy = cached_hierarchy;
  this.cljs$lang$protocol_mask$partition0$ = 2097152;
  this.cljs$lang$protocol_mask$partition1$ = 32
};
cljs.core.MultiFn.cljs$lang$type = true;
cljs.core.MultiFn.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
  return cljs.core.list.call(null, "cljs.core.MultiFn")
};
cljs.core.MultiFn.prototype.cljs$core$IHash$ = true;
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var this__8752 = this;
  return goog.getUid.call(null, this$)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$ = true;
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(mf) {
  var this__8753 = this;
  cljs.core.swap_BANG_.call(null, this__8753.method_table, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this__8753.method_cache, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this__8753.prefer_table, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this__8753.cached_hierarchy, function(mf) {
    return null
  });
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(mf, dispatch_val, method) {
  var this__8754 = this;
  cljs.core.swap_BANG_.call(null, this__8754.method_table, cljs.core.assoc, dispatch_val, method);
  cljs.core.reset_cache.call(null, this__8754.method_cache, this__8754.method_table, this__8754.cached_hierarchy, this__8754.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(mf, dispatch_val) {
  var this__8755 = this;
  cljs.core.swap_BANG_.call(null, this__8755.method_table, cljs.core.dissoc, dispatch_val);
  cljs.core.reset_cache.call(null, this__8755.method_cache, this__8755.method_table, this__8755.cached_hierarchy, this__8755.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(mf, dispatch_val) {
  var this__8756 = this;
  if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, this__8756.cached_hierarchy), cljs.core.deref.call(null, this__8756.hierarchy))) {
  }else {
    cljs.core.reset_cache.call(null, this__8756.method_cache, this__8756.method_table, this__8756.cached_hierarchy, this__8756.hierarchy)
  }
  var temp__317__auto____8757 = cljs.core.deref.call(null, this__8756.method_cache).call(null, dispatch_val);
  if(cljs.core.truth_(temp__317__auto____8757)) {
    var target_fn__8758 = temp__317__auto____8757;
    return target_fn__8758
  }else {
    var temp__317__auto____8759 = cljs.core.find_and_cache_best_method.call(null, this__8756.name, dispatch_val, this__8756.hierarchy, this__8756.method_table, this__8756.prefer_table, this__8756.method_cache, this__8756.cached_hierarchy);
    if(cljs.core.truth_(temp__317__auto____8759)) {
      var target_fn__8760 = temp__317__auto____8759;
      return target_fn__8760
    }else {
      return cljs.core.deref.call(null, this__8756.method_table).call(null, this__8756.default_dispatch_val)
    }
  }
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(mf, dispatch_val_x, dispatch_val_y) {
  var this__8761 = this;
  if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null, dispatch_val_x, dispatch_val_y, this__8761.prefer_table))) {
    throw new Error([cljs.core.str("Preference conflict in multimethod '"), cljs.core.str(this__8761.name), cljs.core.str("': "), cljs.core.str(dispatch_val_y), cljs.core.str(" is already preferred to "), cljs.core.str(dispatch_val_x)].join(""));
  }else {
  }
  cljs.core.swap_BANG_.call(null, this__8761.prefer_table, function(old) {
    return cljs.core.assoc.call(null, old, dispatch_val_x, cljs.core.conj.call(null, cljs.core.get.call(null, old, dispatch_val_x, cljs.core.set([])), dispatch_val_y))
  });
  return cljs.core.reset_cache.call(null, this__8761.method_cache, this__8761.method_table, this__8761.cached_hierarchy, this__8761.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function(mf) {
  var this__8762 = this;
  return cljs.core.deref.call(null, this__8762.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function(mf) {
  var this__8763 = this;
  return cljs.core.deref.call(null, this__8763.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch$arity$2 = function(mf, args) {
  var this__8764 = this;
  return cljs.core.do_dispatch.call(null, mf, this__8764.dispatch_fn, args)
};
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = function() {
  var G__8765__delegate = function(_, args) {
    return cljs.core._dispatch.call(null, this, args)
  };
  var G__8765 = function(_, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return G__8765__delegate.call(this, _, args)
  };
  G__8765.cljs$lang$maxFixedArity = 1;
  G__8765.cljs$lang$applyTo = function(arglist__8766) {
    var _ = cljs.core.first(arglist__8766);
    var args = cljs.core.rest(arglist__8766);
    return G__8765__delegate(_, args)
  };
  G__8765.cljs$lang$arity$variadic = G__8765__delegate;
  return G__8765
}();
cljs.core.MultiFn.prototype.apply = function(_, args) {
  return cljs.core._dispatch.call(null, this, args)
};
cljs.core.remove_all_methods = function remove_all_methods(multifn) {
  return cljs.core._reset.call(null, multifn)
};
cljs.core.remove_method = function remove_method(multifn, dispatch_val) {
  return cljs.core._remove_method.call(null, multifn, dispatch_val)
};
cljs.core.prefer_method = function prefer_method(multifn, dispatch_val_x, dispatch_val_y) {
  return cljs.core._prefer_method.call(null, multifn, dispatch_val_x, dispatch_val_y)
};
cljs.core.methods$ = function methods$(multifn) {
  return cljs.core._methods.call(null, multifn)
};
cljs.core.get_method = function get_method(multifn, dispatch_val) {
  return cljs.core._get_method.call(null, multifn, dispatch_val)
};
cljs.core.prefers = function prefers(multifn) {
  return cljs.core._prefers.call(null, multifn)
};
goog.provide("clojure.string");
goog.require("cljs.core");
goog.require("goog.string");
goog.require("goog.string.StringBuffer");
clojure.string.seq_reverse = function seq_reverse(coll) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, coll)
};
clojure.string.reverse = function reverse(s) {
  return s.split("").reverse().join("")
};
clojure.string.replace = function replace(s, match, replacement) {
  if(cljs.core.string_QMARK_.call(null, match)) {
    return s.replace(new RegExp(goog.string.regExpEscape.call(null, match), "g"), replacement)
  }else {
    if(cljs.core.truth_(match.hasOwnProperty("source"))) {
      return s.replace(new RegExp(match.source, "g"), replacement)
    }else {
      if("\ufdd0'else") {
        throw[cljs.core.str("Invalid match arg: "), cljs.core.str(match)].join("");
      }else {
        return null
      }
    }
  }
};
clojure.string.replace_first = function replace_first(s, match, replacement) {
  return s.replace(match, replacement)
};
clojure.string.join = function() {
  var join = null;
  var join__1 = function(coll) {
    return cljs.core.apply.call(null, cljs.core.str, coll)
  };
  var join__2 = function(separator, coll) {
    return cljs.core.apply.call(null, cljs.core.str, cljs.core.interpose.call(null, separator, coll))
  };
  join = function(separator, coll) {
    switch(arguments.length) {
      case 1:
        return join__1.call(this, separator);
      case 2:
        return join__2.call(this, separator, coll)
    }
    throw"Invalid arity: " + arguments.length;
  };
  join.cljs$lang$arity$1 = join__1;
  join.cljs$lang$arity$2 = join__2;
  return join
}();
clojure.string.upper_case = function upper_case(s) {
  return s.toUpperCase()
};
clojure.string.lower_case = function lower_case(s) {
  return s.toLowerCase()
};
clojure.string.capitalize = function capitalize(s) {
  if(cljs.core.count.call(null, s) < 2) {
    return clojure.string.upper_case.call(null, s)
  }else {
    return[cljs.core.str(clojure.string.upper_case.call(null, cljs.core.subs.call(null, s, 0, 1))), cljs.core.str(clojure.string.lower_case.call(null, cljs.core.subs.call(null, s, 1)))].join("")
  }
};
clojure.string.split = function() {
  var split = null;
  var split__2 = function(s, re) {
    return cljs.core.vec.call(null, [cljs.core.str(s)].join("").split(re))
  };
  var split__3 = function(s, re, limit) {
    if(limit < 1) {
      return cljs.core.vec.call(null, [cljs.core.str(s)].join("").split(re))
    }else {
      var s__6768 = s;
      var limit__6769 = limit;
      var parts__6770 = cljs.core.PersistentVector.fromArray([]);
      while(true) {
        if(cljs.core._EQ_.call(null, limit__6769, 1)) {
          return cljs.core.conj.call(null, parts__6770, s__6768)
        }else {
          var temp__317__auto____6771 = cljs.core.re_find.call(null, re, s__6768);
          if(cljs.core.truth_(temp__317__auto____6771)) {
            var m__6772 = temp__317__auto____6771;
            var index__6773 = s__6768.indexOf(m__6772);
            var G__6774 = s__6768.substring(index__6773 + cljs.core.count.call(null, m__6772));
            var G__6775 = limit__6769 - 1;
            var G__6776 = cljs.core.conj.call(null, parts__6770, s__6768.substring(0, index__6773));
            s__6768 = G__6774;
            limit__6769 = G__6775;
            parts__6770 = G__6776;
            continue
          }else {
            return cljs.core.conj.call(null, parts__6770, s__6768)
          }
        }
        break
      }
    }
  };
  split = function(s, re, limit) {
    switch(arguments.length) {
      case 2:
        return split__2.call(this, s, re);
      case 3:
        return split__3.call(this, s, re, limit)
    }
    throw"Invalid arity: " + arguments.length;
  };
  split.cljs$lang$arity$2 = split__2;
  split.cljs$lang$arity$3 = split__3;
  return split
}();
clojure.string.split_lines = function split_lines(s) {
  return clojure.string.split.call(null, s, /\n|\r\n/)
};
clojure.string.trim = function trim(s) {
  return goog.string.trim.call(null, s)
};
clojure.string.triml = function triml(s) {
  return goog.string.trimLeft.call(null, s)
};
clojure.string.trimr = function trimr(s) {
  return goog.string.trimRight.call(null, s)
};
clojure.string.trim_newline = function trim_newline(s) {
  var index__6777 = s.length;
  while(true) {
    if(index__6777 === 0) {
      return""
    }else {
      var ch__6778 = cljs.core.get.call(null, s, index__6777 - 1);
      if(function() {
        var or__138__auto____6779 = cljs.core._EQ_.call(null, ch__6778, "\n");
        if(or__138__auto____6779) {
          return or__138__auto____6779
        }else {
          return cljs.core._EQ_.call(null, ch__6778, "\r")
        }
      }()) {
        var G__6780 = index__6777 - 1;
        index__6777 = G__6780;
        continue
      }else {
        return s.substring(0, index__6777)
      }
    }
    break
  }
};
clojure.string.blank_QMARK_ = function blank_QMARK_(s) {
  var s__6781 = [cljs.core.str(s)].join("");
  if(cljs.core.truth_(function() {
    var or__138__auto____6782 = cljs.core.not.call(null, s__6781);
    if(or__138__auto____6782) {
      return or__138__auto____6782
    }else {
      var or__138__auto____6783 = cljs.core._EQ_.call(null, "", s__6781);
      if(or__138__auto____6783) {
        return or__138__auto____6783
      }else {
        return cljs.core.re_matches.call(null, /\s+/, s__6781)
      }
    }
  }())) {
    return true
  }else {
    return false
  }
};
clojure.string.escape = function escape(s, cmap) {
  var buffer__6784 = new goog.string.StringBuffer;
  var length__6785 = s.length;
  var index__6786 = 0;
  while(true) {
    if(cljs.core._EQ_.call(null, length__6785, index__6786)) {
      return buffer__6784.toString()
    }else {
      var ch__6787 = s.charAt(index__6786);
      var temp__317__auto____6788 = cljs.core.get.call(null, cmap, ch__6787);
      if(cljs.core.truth_(temp__317__auto____6788)) {
        var replacement__6789 = temp__317__auto____6788;
        buffer__6784.append([cljs.core.str(replacement__6789)].join(""))
      }else {
        buffer__6784.append(ch__6787)
      }
      var G__6790 = index__6786 + 1;
      index__6786 = G__6790;
      continue
    }
    break
  }
};
goog.provide("goog.debug.EntryPointMonitor");
goog.provide("goog.debug.entryPointRegistry");
goog.require("goog.asserts");
goog.debug.EntryPointMonitor = function() {
};
goog.debug.EntryPointMonitor.prototype.wrap;
goog.debug.EntryPointMonitor.prototype.unwrap;
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = false;
goog.debug.entryPointRegistry.register = function(callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback;
  if(goog.debug.entryPointRegistry.monitorsMayExist_) {
    var monitors = goog.debug.entryPointRegistry.monitors_;
    for(var i = 0;i < monitors.length;i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]))
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = true;
  var transformer = goog.bind(monitor.wrap, monitor);
  for(var i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer)
  }
  goog.debug.entryPointRegistry.monitors_.push(monitor)
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(monitor) {
  var monitors = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(monitor == monitors[monitors.length - 1], "Only the most recent monitor can be unwrapped.");
  var transformer = goog.bind(monitor.unwrap, monitor);
  for(var i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer)
  }
  monitors.length--
};
goog.provide("goog.debug.errorHandlerWeakDep");
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function(fn, opt_tracers) {
  return fn
}};
goog.provide("goog.userAgent");
goog.require("goog.string");
goog.userAgent.ASSUME_IE = false;
goog.userAgent.ASSUME_GECKO = false;
goog.userAgent.ASSUME_WEBKIT = false;
goog.userAgent.ASSUME_MOBILE_WEBKIT = false;
goog.userAgent.ASSUME_OPERA = false;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global["navigator"] ? goog.global["navigator"].userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global["navigator"]
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = false;
  goog.userAgent.detectedIe_ = false;
  goog.userAgent.detectedWebkit_ = false;
  goog.userAgent.detectedMobile_ = false;
  goog.userAgent.detectedGecko_ = false;
  var ua;
  if(!goog.userAgent.BROWSER_KNOWN_ && (ua = goog.userAgent.getUserAgentString())) {
    var navigator = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = ua.indexOf("Opera") == 0;
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && ua.indexOf("MSIE") != -1;
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && ua.indexOf("WebKit") != -1;
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && ua.indexOf("Mobile") != -1;
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && navigator.product == "Gecko"
  }
};
if(!goog.userAgent.BROWSER_KNOWN_) {
  goog.userAgent.init_()
}
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = false;
goog.userAgent.ASSUME_WINDOWS = false;
goog.userAgent.ASSUME_LINUX = false;
goog.userAgent.ASSUME_X11 = false;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator()["appVersion"] || "", "X11")
};
if(!goog.userAgent.PLATFORM_KNOWN_) {
  goog.userAgent.initPlatform_()
}
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
  var version = "", re;
  if(goog.userAgent.OPERA && goog.global["opera"]) {
    var operaVersion = goog.global["opera"].version;
    version = typeof operaVersion == "function" ? operaVersion() : operaVersion
  }else {
    if(goog.userAgent.GECKO) {
      re = /rv\:([^\);]+)(\)|;)/
    }else {
      if(goog.userAgent.IE) {
        re = /MSIE\s+([^\);]+)(\)|;)/
      }else {
        if(goog.userAgent.WEBKIT) {
          re = /WebKit\/(\S+)/
        }
      }
    }
    if(re) {
      var arr = re.exec(goog.userAgent.getUserAgentString());
      version = arr ? arr[1] : ""
    }
  }
  if(goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if(docMode > parseFloat(version)) {
      return String(docMode)
    }
  }
  return version
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global["document"];
  return doc ? doc["documentMode"] : undefined
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(version) {
  return goog.userAgent.isVersionCache_[version] || (goog.userAgent.isVersionCache_[version] = goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0)
};
goog.userAgent.isDocumentModeCache_ = {};
goog.userAgent.isDocumentMode = function(documentMode) {
  return goog.userAgent.isDocumentModeCache_[documentMode] || (goog.userAgent.isDocumentModeCache_[documentMode] = goog.userAgent.IE && document.documentMode && document.documentMode >= documentMode)
};
goog.provide("goog.events.BrowserFeature");
goog.require("goog.userAgent");
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersion("8")};
goog.provide("goog.disposable.IDisposable");
goog.disposable.IDisposable = function() {
};
goog.disposable.IDisposable.prototype.dispose;
goog.disposable.IDisposable.prototype.isDisposed;
goog.provide("goog.Disposable");
goog.provide("goog.dispose");
goog.require("goog.disposable.IDisposable");
goog.Disposable = function() {
  if(goog.Disposable.ENABLE_MONITORING) {
    goog.Disposable.instances_[goog.getUid(this)] = this
  }
};
goog.Disposable.ENABLE_MONITORING = false;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var ret = [];
  for(var id in goog.Disposable.instances_) {
    if(goog.Disposable.instances_.hasOwnProperty(id)) {
      ret.push(goog.Disposable.instances_[Number(id)])
    }
  }
  return ret
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = false;
goog.Disposable.prototype.dependentDisposables_;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if(!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal();
    if(goog.Disposable.ENABLE_MONITORING) {
      var uid = goog.getUid(this);
      if(!goog.Disposable.instances_.hasOwnProperty(uid)) {
        throw Error(this + " did not call the goog.Disposable base " + "constructor or was disposed of after a clearUndisposedObjects " + "call");
      }
      delete goog.Disposable.instances_[uid]
    }
  }
};
goog.Disposable.prototype.registerDisposable = function(disposable) {
  if(!this.dependentDisposables_) {
    this.dependentDisposables_ = []
  }
  this.dependentDisposables_.push(disposable)
};
goog.Disposable.prototype.disposeInternal = function() {
  if(this.dependentDisposables_) {
    goog.disposeAll.apply(null, this.dependentDisposables_)
  }
};
goog.dispose = function(obj) {
  if(obj && typeof obj.dispose == "function") {
    obj.dispose()
  }
};
goog.disposeAll = function(var_args) {
  for(var i = 0, len = arguments.length;i < len;++i) {
    var disposable = arguments[i];
    if(goog.isArrayLike(disposable)) {
      goog.disposeAll.apply(null, disposable)
    }else {
      goog.dispose(disposable)
    }
  }
};
goog.provide("goog.events.Event");
goog.require("goog.Disposable");
goog.events.Event = function(type, opt_target) {
  goog.Disposable.call(this);
  this.type = type;
  this.target = opt_target;
  this.currentTarget = this.target
};
goog.inherits(goog.events.Event, goog.Disposable);
goog.events.Event.prototype.disposeInternal = function() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
goog.events.Event.prototype.propagationStopped_ = false;
goog.events.Event.prototype.returnValue_ = true;
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = true
};
goog.events.Event.prototype.preventDefault = function() {
  this.returnValue_ = false
};
goog.events.Event.stopPropagation = function(e) {
  e.stopPropagation()
};
goog.events.Event.preventDefault = function(e) {
  e.preventDefault()
};
goog.provide("goog.events.EventType");
goog.require("goog.userAgent");
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", 
DRAGSTART:"dragstart", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", CONTEXTMENU:"contextmenu", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", 
BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", MESSAGE:"message", CONNECT:"connect", TRANSITIONEND:goog.userAgent.WEBKIT ? "webkitTransitionEnd" : goog.userAgent.OPERA ? "oTransitionEnd" : "transitionend"};
goog.provide("goog.reflect");
goog.reflect.object = function(type, object) {
  return object
};
goog.reflect.sinkValue = function(x) {
  goog.reflect.sinkValue[" "](x);
  return x
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(obj, prop) {
  try {
    goog.reflect.sinkValue(obj[prop]);
    return true
  }catch(e) {
  }
  return false
};
goog.provide("goog.events.BrowserEvent");
goog.provide("goog.events.BrowserEvent.MouseButton");
goog.require("goog.events.BrowserFeature");
goog.require("goog.events.Event");
goog.require("goog.events.EventType");
goog.require("goog.reflect");
goog.require("goog.userAgent");
goog.events.BrowserEvent = function(opt_e, opt_currentTarget) {
  if(opt_e) {
    this.init(opt_e, opt_currentTarget)
  }
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.currentTarget;
goog.events.BrowserEvent.prototype.relatedTarget = null;
goog.events.BrowserEvent.prototype.offsetX = 0;
goog.events.BrowserEvent.prototype.offsetY = 0;
goog.events.BrowserEvent.prototype.clientX = 0;
goog.events.BrowserEvent.prototype.clientY = 0;
goog.events.BrowserEvent.prototype.screenX = 0;
goog.events.BrowserEvent.prototype.screenY = 0;
goog.events.BrowserEvent.prototype.button = 0;
goog.events.BrowserEvent.prototype.keyCode = 0;
goog.events.BrowserEvent.prototype.charCode = 0;
goog.events.BrowserEvent.prototype.ctrlKey = false;
goog.events.BrowserEvent.prototype.altKey = false;
goog.events.BrowserEvent.prototype.shiftKey = false;
goog.events.BrowserEvent.prototype.metaKey = false;
goog.events.BrowserEvent.prototype.state;
goog.events.BrowserEvent.prototype.platformModifierKey = false;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type;
  goog.events.Event.call(this, type);
  this.target = e.target || e.srcElement;
  this.currentTarget = opt_currentTarget;
  var relatedTarget = e.relatedTarget;
  if(relatedTarget) {
    if(goog.userAgent.GECKO) {
      if(!goog.reflect.canAccessProperty(relatedTarget, "nodeName")) {
        relatedTarget = null
      }
    }
  }else {
    if(type == goog.events.EventType.MOUSEOVER) {
      relatedTarget = e.fromElement
    }else {
      if(type == goog.events.EventType.MOUSEOUT) {
        relatedTarget = e.toElement
      }
    }
  }
  this.relatedTarget = relatedTarget;
  this.offsetX = e.offsetX !== undefined ? e.offsetX : e.layerX;
  this.offsetY = e.offsetY !== undefined ? e.offsetY : e.layerY;
  this.clientX = e.clientX !== undefined ? e.clientX : e.pageX;
  this.clientY = e.clientY !== undefined ? e.clientY : e.pageY;
  this.screenX = e.screenX || 0;
  this.screenY = e.screenY || 0;
  this.button = e.button;
  this.keyCode = e.keyCode || 0;
  this.charCode = e.charCode || (type == "keypress" ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? e.metaKey : e.ctrlKey;
  this.state = e.state;
  this.event_ = e;
  delete this.returnValue_;
  delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function(button) {
  if(!goog.events.BrowserFeature.HAS_W3C_BUTTON) {
    if(this.type == "click") {
      return button == goog.events.BrowserEvent.MouseButton.LEFT
    }else {
      return!!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[button])
    }
  }else {
    return this.event_.button == button
  }
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  if(this.event_.stopPropagation) {
    this.event_.stopPropagation()
  }else {
    this.event_.cancelBubble = true
  }
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var be = this.event_;
  if(!be.preventDefault) {
    be.returnValue = false;
    if(goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        var VK_F1 = 112;
        var VK_F12 = 123;
        if(be.ctrlKey || be.keyCode >= VK_F1 && be.keyCode <= VK_F12) {
          be.keyCode = -1
        }
      }catch(ex) {
      }
    }
  }else {
    be.preventDefault()
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
  goog.events.BrowserEvent.superClass_.disposeInternal.call(this);
  this.event_ = null;
  this.target = null;
  this.currentTarget = null;
  this.relatedTarget = null
};
goog.provide("goog.events.EventWrapper");
goog.events.EventWrapper = function() {
};
goog.events.EventWrapper.prototype.listen = function(src, listener, opt_capt, opt_scope, opt_eventHandler) {
};
goog.events.EventWrapper.prototype.unlisten = function(src, listener, opt_capt, opt_scope, opt_eventHandler) {
};
goog.provide("goog.events.Listener");
goog.events.Listener = function() {
};
goog.events.Listener.counter_ = 0;
goog.events.Listener.prototype.isFunctionListener_;
goog.events.Listener.prototype.listener;
goog.events.Listener.prototype.proxy;
goog.events.Listener.prototype.src;
goog.events.Listener.prototype.type;
goog.events.Listener.prototype.capture;
goog.events.Listener.prototype.handler;
goog.events.Listener.prototype.key = 0;
goog.events.Listener.prototype.removed = false;
goog.events.Listener.prototype.callOnce = false;
goog.events.Listener.prototype.init = function(listener, proxy, src, type, capture, opt_handler) {
  if(goog.isFunction(listener)) {
    this.isFunctionListener_ = true
  }else {
    if(listener && listener.handleEvent && goog.isFunction(listener.handleEvent)) {
      this.isFunctionListener_ = false
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.listener = listener;
  this.proxy = proxy;
  this.src = src;
  this.type = type;
  this.capture = !!capture;
  this.handler = opt_handler;
  this.callOnce = false;
  this.key = ++goog.events.Listener.counter_;
  this.removed = false
};
goog.events.Listener.prototype.handleEvent = function(eventObject) {
  if(this.isFunctionListener_) {
    return this.listener.call(this.handler || this.src, eventObject)
  }
  return this.listener.handleEvent.call(this.listener, eventObject)
};
goog.provide("goog.events");
goog.require("goog.array");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.debug.errorHandlerWeakDep");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.BrowserFeature");
goog.require("goog.events.Event");
goog.require("goog.events.EventWrapper");
goog.require("goog.events.Listener");
goog.require("goog.object");
goog.require("goog.userAgent");
goog.events.ASSUME_GOOD_GC = false;
goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if(!type) {
    throw Error("Invalid event type");
  }else {
    if(goog.isArray(type)) {
      for(var i = 0;i < type.length;i++) {
        goog.events.listen(src, type[i], listener, opt_capt, opt_handler)
      }
      return null
    }else {
      var capture = !!opt_capt;
      var map = goog.events.listenerTree_;
      if(!(type in map)) {
        map[type] = {count_:0, remaining_:0}
      }
      map = map[type];
      if(!(capture in map)) {
        map[capture] = {count_:0, remaining_:0};
        map.count_++
      }
      map = map[capture];
      var srcUid = goog.getUid(src);
      var listenerArray, listenerObj;
      map.remaining_++;
      if(!map[srcUid]) {
        listenerArray = map[srcUid] = [];
        map.count_++
      }else {
        listenerArray = map[srcUid];
        for(var i = 0;i < listenerArray.length;i++) {
          listenerObj = listenerArray[i];
          if(listenerObj.listener == listener && listenerObj.handler == opt_handler) {
            if(listenerObj.removed) {
              break
            }
            return listenerArray[i].key
          }
        }
      }
      var proxy = goog.events.getProxy();
      proxy.src = src;
      listenerObj = new goog.events.Listener;
      listenerObj.init(listener, proxy, src, type, capture, opt_handler);
      var key = listenerObj.key;
      proxy.key = key;
      listenerArray.push(listenerObj);
      goog.events.listeners_[key] = listenerObj;
      if(!goog.events.sources_[srcUid]) {
        goog.events.sources_[srcUid] = []
      }
      goog.events.sources_[srcUid].push(listenerObj);
      if(src.addEventListener) {
        if(src == goog.global || !src.customEvent_) {
          src.addEventListener(type, proxy, capture)
        }
      }else {
        src.attachEvent(goog.events.getOnString_(type), proxy)
      }
      return key
    }
  }
};
goog.events.getProxy = function() {
  var proxyCallbackFunction = goog.events.handleBrowserEvent_;
  var f = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(eventObject) {
    return proxyCallbackFunction.call(f.src, f.key, eventObject)
  } : function(eventObject) {
    var v = proxyCallbackFunction.call(f.src, f.key, eventObject);
    if(!v) {
      return v
    }
  };
  return f
};
goog.events.listenOnce = function(src, type, listener, opt_capt, opt_handler) {
  if(goog.isArray(type)) {
    for(var i = 0;i < type.length;i++) {
      goog.events.listenOnce(src, type[i], listener, opt_capt, opt_handler)
    }
    return null
  }
  var key = goog.events.listen(src, type, listener, opt_capt, opt_handler);
  var listenerObj = goog.events.listeners_[key];
  listenerObj.callOnce = true;
  return key
};
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler)
};
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  if(goog.isArray(type)) {
    for(var i = 0;i < type.length;i++) {
      goog.events.unlisten(src, type[i], listener, opt_capt, opt_handler)
    }
    return null
  }
  var capture = !!opt_capt;
  var listenerArray = goog.events.getListeners_(src, type, capture);
  if(!listenerArray) {
    return false
  }
  for(var i = 0;i < listenerArray.length;i++) {
    if(listenerArray[i].listener == listener && listenerArray[i].capture == capture && listenerArray[i].handler == opt_handler) {
      return goog.events.unlistenByKey(listenerArray[i].key)
    }
  }
  return false
};
goog.events.unlistenByKey = function(key) {
  if(!goog.events.listeners_[key]) {
    return false
  }
  var listener = goog.events.listeners_[key];
  if(listener.removed) {
    return false
  }
  var src = listener.src;
  var type = listener.type;
  var proxy = listener.proxy;
  var capture = listener.capture;
  if(src.removeEventListener) {
    if(src == goog.global || !src.customEvent_) {
      src.removeEventListener(type, proxy, capture)
    }
  }else {
    if(src.detachEvent) {
      src.detachEvent(goog.events.getOnString_(type), proxy)
    }
  }
  var srcUid = goog.getUid(src);
  var listenerArray = goog.events.listenerTree_[type][capture][srcUid];
  if(goog.events.sources_[srcUid]) {
    var sourcesArray = goog.events.sources_[srcUid];
    goog.array.remove(sourcesArray, listener);
    if(sourcesArray.length == 0) {
      delete goog.events.sources_[srcUid]
    }
  }
  listener.removed = true;
  listenerArray.needsCleanup_ = true;
  goog.events.cleanUp_(type, capture, srcUid, listenerArray);
  delete goog.events.listeners_[key];
  return true
};
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler)
};
goog.events.cleanUp_ = function(type, capture, srcUid, listenerArray) {
  if(!listenerArray.locked_) {
    if(listenerArray.needsCleanup_) {
      for(var oldIndex = 0, newIndex = 0;oldIndex < listenerArray.length;oldIndex++) {
        if(listenerArray[oldIndex].removed) {
          var proxy = listenerArray[oldIndex].proxy;
          proxy.src = null;
          continue
        }
        if(oldIndex != newIndex) {
          listenerArray[newIndex] = listenerArray[oldIndex]
        }
        newIndex++
      }
      listenerArray.length = newIndex;
      listenerArray.needsCleanup_ = false;
      if(newIndex == 0) {
        delete goog.events.listenerTree_[type][capture][srcUid];
        goog.events.listenerTree_[type][capture].count_--;
        if(goog.events.listenerTree_[type][capture].count_ == 0) {
          delete goog.events.listenerTree_[type][capture];
          goog.events.listenerTree_[type].count_--
        }
        if(goog.events.listenerTree_[type].count_ == 0) {
          delete goog.events.listenerTree_[type]
        }
      }
    }
  }
};
goog.events.removeAll = function(opt_obj, opt_type, opt_capt) {
  var count = 0;
  var noObj = opt_obj == null;
  var noType = opt_type == null;
  var noCapt = opt_capt == null;
  opt_capt = !!opt_capt;
  if(!noObj) {
    var srcUid = goog.getUid(opt_obj);
    if(goog.events.sources_[srcUid]) {
      var sourcesArray = goog.events.sources_[srcUid];
      for(var i = sourcesArray.length - 1;i >= 0;i--) {
        var listener = sourcesArray[i];
        if((noType || opt_type == listener.type) && (noCapt || opt_capt == listener.capture)) {
          goog.events.unlistenByKey(listener.key);
          count++
        }
      }
    }
  }else {
    goog.object.forEach(goog.events.sources_, function(listeners) {
      for(var i = listeners.length - 1;i >= 0;i--) {
        var listener = listeners[i];
        if((noType || opt_type == listener.type) && (noCapt || opt_capt == listener.capture)) {
          goog.events.unlistenByKey(listener.key);
          count++
        }
      }
    })
  }
  return count
};
goog.events.getListeners = function(obj, type, capture) {
  return goog.events.getListeners_(obj, type, capture) || []
};
goog.events.getListeners_ = function(obj, type, capture) {
  var map = goog.events.listenerTree_;
  if(type in map) {
    map = map[type];
    if(capture in map) {
      map = map[capture];
      var objUid = goog.getUid(obj);
      if(map[objUid]) {
        return map[objUid]
      }
    }
  }
  return null
};
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  var capture = !!opt_capt;
  var listenerArray = goog.events.getListeners_(src, type, capture);
  if(listenerArray) {
    for(var i = 0;i < listenerArray.length;i++) {
      if(!listenerArray[i].removed && listenerArray[i].listener == listener && listenerArray[i].capture == capture && listenerArray[i].handler == opt_handler) {
        return listenerArray[i]
      }
    }
  }
  return null
};
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  var objUid = goog.getUid(obj);
  var listeners = goog.events.sources_[objUid];
  if(listeners) {
    var hasType = goog.isDef(opt_type);
    var hasCapture = goog.isDef(opt_capture);
    if(hasType && hasCapture) {
      var map = goog.events.listenerTree_[opt_type];
      return!!map && !!map[opt_capture] && objUid in map[opt_capture]
    }else {
      if(!(hasType || hasCapture)) {
        return true
      }else {
        return goog.array.some(listeners, function(listener) {
          return hasType && listener.type == opt_type || hasCapture && listener.capture == opt_capture
        })
      }
    }
  }
  return false
};
goog.events.expose = function(e) {
  var str = [];
  for(var key in e) {
    if(e[key] && e[key].id) {
      str.push(key + " = " + e[key] + " (" + e[key].id + ")")
    }else {
      str.push(key + " = " + e[key])
    }
  }
  return str.join("\n")
};
goog.events.getOnString_ = function(type) {
  if(type in goog.events.onStringMap_) {
    return goog.events.onStringMap_[type]
  }
  return goog.events.onStringMap_[type] = goog.events.onString_ + type
};
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  var map = goog.events.listenerTree_;
  if(type in map) {
    map = map[type];
    if(capture in map) {
      return goog.events.fireListeners_(map[capture], obj, type, capture, eventObject)
    }
  }
  return true
};
goog.events.fireListeners_ = function(map, obj, type, capture, eventObject) {
  var retval = 1;
  var objUid = goog.getUid(obj);
  if(map[objUid]) {
    map.remaining_--;
    var listenerArray = map[objUid];
    if(!listenerArray.locked_) {
      listenerArray.locked_ = 1
    }else {
      listenerArray.locked_++
    }
    try {
      var length = listenerArray.length;
      for(var i = 0;i < length;i++) {
        var listener = listenerArray[i];
        if(listener && !listener.removed) {
          retval &= goog.events.fireListener(listener, eventObject) !== false
        }
      }
    }finally {
      listenerArray.locked_--;
      goog.events.cleanUp_(type, capture, objUid, listenerArray)
    }
  }
  return Boolean(retval)
};
goog.events.fireListener = function(listener, eventObject) {
  var rv = listener.handleEvent(eventObject);
  if(listener.callOnce) {
    goog.events.unlistenByKey(listener.key)
  }
  return rv
};
goog.events.getTotalListenerCount = function() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function(src, e) {
  var type = e.type || e;
  var map = goog.events.listenerTree_;
  if(!(type in map)) {
    return true
  }
  if(goog.isString(e)) {
    e = new goog.events.Event(e, src)
  }else {
    if(!(e instanceof goog.events.Event)) {
      var oldEvent = e;
      e = new goog.events.Event(type, src);
      goog.object.extend(e, oldEvent)
    }else {
      e.target = e.target || src
    }
  }
  var rv = 1, ancestors;
  map = map[type];
  var hasCapture = true in map;
  var targetsMap;
  if(hasCapture) {
    ancestors = [];
    for(var parent = src;parent;parent = parent.getParentEventTarget()) {
      ancestors.push(parent)
    }
    targetsMap = map[true];
    targetsMap.remaining_ = targetsMap.count_;
    for(var i = ancestors.length - 1;!e.propagationStopped_ && i >= 0 && targetsMap.remaining_;i--) {
      e.currentTarget = ancestors[i];
      rv &= goog.events.fireListeners_(targetsMap, ancestors[i], e.type, true, e) && e.returnValue_ != false
    }
  }
  var hasBubble = false in map;
  if(hasBubble) {
    targetsMap = map[false];
    targetsMap.remaining_ = targetsMap.count_;
    if(hasCapture) {
      for(var i = 0;!e.propagationStopped_ && i < ancestors.length && targetsMap.remaining_;i++) {
        e.currentTarget = ancestors[i];
        rv &= goog.events.fireListeners_(targetsMap, ancestors[i], e.type, false, e) && e.returnValue_ != false
      }
    }else {
      for(var current = src;!e.propagationStopped_ && current && targetsMap.remaining_;current = current.getParentEventTarget()) {
        e.currentTarget = current;
        rv &= goog.events.fireListeners_(targetsMap, current, e.type, false, e) && e.returnValue_ != false
      }
    }
  }
  return Boolean(rv)
};
goog.events.protectBrowserEventEntryPoint = function(errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(key, opt_evt) {
  if(!goog.events.listeners_[key]) {
    return true
  }
  var listener = goog.events.listeners_[key];
  var type = listener.type;
  var map = goog.events.listenerTree_;
  if(!(type in map)) {
    return true
  }
  map = map[type];
  var retval, targetsMap;
  if(!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt || goog.getObjectByName("window.event");
    var hasCapture = true in map;
    var hasBubble = false in map;
    if(hasCapture) {
      if(goog.events.isMarkedIeEvent_(ieEvent)) {
        return true
      }
      goog.events.markIeEvent_(ieEvent)
    }
    var evt = new goog.events.BrowserEvent;
    evt.init(ieEvent, this);
    retval = true;
    try {
      if(hasCapture) {
        var ancestors = [];
        for(var parent = evt.currentTarget;parent;parent = parent.parentNode) {
          ancestors.push(parent)
        }
        targetsMap = map[true];
        targetsMap.remaining_ = targetsMap.count_;
        for(var i = ancestors.length - 1;!evt.propagationStopped_ && i >= 0 && targetsMap.remaining_;i--) {
          evt.currentTarget = ancestors[i];
          retval &= goog.events.fireListeners_(targetsMap, ancestors[i], type, true, evt)
        }
        if(hasBubble) {
          targetsMap = map[false];
          targetsMap.remaining_ = targetsMap.count_;
          for(var i = 0;!evt.propagationStopped_ && i < ancestors.length && targetsMap.remaining_;i++) {
            evt.currentTarget = ancestors[i];
            retval &= goog.events.fireListeners_(targetsMap, ancestors[i], type, false, evt)
          }
        }
      }else {
        retval = goog.events.fireListener(listener, evt)
      }
    }finally {
      if(ancestors) {
        ancestors.length = 0
      }
      evt.dispose()
    }
    return retval
  }
  var be = new goog.events.BrowserEvent(opt_evt, this);
  try {
    retval = goog.events.fireListener(listener, be)
  }finally {
    be.dispose()
  }
  return retval
};
goog.events.markIeEvent_ = function(e) {
  var useReturnValue = false;
  if(e.keyCode == 0) {
    try {
      e.keyCode = -1;
      return
    }catch(ex) {
      useReturnValue = true
    }
  }
  if(useReturnValue || e.returnValue == undefined) {
    e.returnValue = true
  }
};
goog.events.isMarkedIeEvent_ = function(e) {
  return e.keyCode < 0 || e.returnValue != undefined
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(identifier) {
  return identifier + "_" + goog.events.uniqueIdCounter_++
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.events.handleBrowserEvent_ = transformer(goog.events.handleBrowserEvent_)
});
goog.provide("goog.events.EventTarget");
goog.require("goog.Disposable");
goog.require("goog.events");
goog.events.EventTarget = function() {
  goog.Disposable.call(this)
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.EventTarget.prototype.customEvent_ = true;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(parent) {
  this.parentEventTarget_ = parent
};
goog.events.EventTarget.prototype.addEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope)
};
goog.events.EventTarget.prototype.removeEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope)
};
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  return goog.events.dispatchEvent(this, e)
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  goog.events.removeAll(this);
  this.parentEventTarget_ = null
};
goog.provide("clojure.browser.event");
goog.require("cljs.core");
goog.require("goog.events");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
void 0;
clojure.browser.event.EventType = {};
clojure.browser.event.event_types = function event_types(this$) {
  if(function() {
    var and__132__auto____18358 = this$;
    if(and__132__auto____18358) {
      return this$.clojure$browser$event$EventType$event_types$arity$1
    }else {
      return and__132__auto____18358
    }
  }()) {
    return this$.clojure$browser$event$EventType$event_types$arity$1(this$)
  }else {
    return function() {
      var or__138__auto____18359 = clojure.browser.event.event_types[goog.typeOf.call(null, this$)];
      if(or__138__auto____18359) {
        return or__138__auto____18359
      }else {
        var or__138__auto____18360 = clojure.browser.event.event_types["_"];
        if(or__138__auto____18360) {
          return or__138__auto____18360
        }else {
          throw cljs.core.missing_protocol.call(null, "EventType.event-types", this$);
        }
      }
    }().call(null, this$)
  }
};
void 0;
Element.prototype.clojure$browser$event$EventType$ = true;
Element.prototype.clojure$browser$event$EventType$event_types$arity$1 = function(this$) {
  return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__18361) {
    var vec__18362__18363 = p__18361;
    var k__18364 = cljs.core.nth.call(null, vec__18362__18363, 0, null);
    var v__18365 = cljs.core.nth.call(null, vec__18362__18363, 1, null);
    return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__18364.toLowerCase()), v__18365])
  }, cljs.core.merge.call(null, cljs.core.js__GT_clj.call(null, goog.events.EventType))))
};
goog.events.EventTarget.prototype.clojure$browser$event$EventType$ = true;
goog.events.EventTarget.prototype.clojure$browser$event$EventType$event_types$arity$1 = function(this$) {
  return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__18366) {
    var vec__18367__18368 = p__18366;
    var k__18369 = cljs.core.nth.call(null, vec__18367__18368, 0, null);
    var v__18370 = cljs.core.nth.call(null, vec__18367__18368, 1, null);
    return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__18369.toLowerCase()), v__18370])
  }, cljs.core.merge.call(null, cljs.core.js__GT_clj.call(null, goog.events.EventType))))
};
clojure.browser.event.listen = function() {
  var listen = null;
  var listen__3 = function(src, type, fn) {
    return listen.call(null, src, type, fn, false)
  };
  var listen__4 = function(src, type, fn, capture_QMARK_) {
    return goog.events.listen.call(null, src, cljs.core.get.call(null, clojure.browser.event.event_types.call(null, src), type, type), fn, capture_QMARK_)
  };
  listen = function(src, type, fn, capture_QMARK_) {
    switch(arguments.length) {
      case 3:
        return listen__3.call(this, src, type, fn);
      case 4:
        return listen__4.call(this, src, type, fn, capture_QMARK_)
    }
    throw"Invalid arity: " + arguments.length;
  };
  listen.cljs$lang$arity$3 = listen__3;
  listen.cljs$lang$arity$4 = listen__4;
  return listen
}();
clojure.browser.event.listen_once = function() {
  var listen_once = null;
  var listen_once__3 = function(src, type, fn) {
    return listen_once.call(null, src, type, fn, false)
  };
  var listen_once__4 = function(src, type, fn, capture_QMARK_) {
    return goog.events.listenOnce.call(null, src, cljs.core.get.call(null, clojure.browser.event.event_types.call(null, src), type, type), fn, capture_QMARK_)
  };
  listen_once = function(src, type, fn, capture_QMARK_) {
    switch(arguments.length) {
      case 3:
        return listen_once__3.call(this, src, type, fn);
      case 4:
        return listen_once__4.call(this, src, type, fn, capture_QMARK_)
    }
    throw"Invalid arity: " + arguments.length;
  };
  listen_once.cljs$lang$arity$3 = listen_once__3;
  listen_once.cljs$lang$arity$4 = listen_once__4;
  return listen_once
}();
clojure.browser.event.unlisten = function() {
  var unlisten = null;
  var unlisten__3 = function(src, type, fn) {
    return unlisten.call(null, src, type, fn, false)
  };
  var unlisten__4 = function(src, type, fn, capture_QMARK_) {
    return goog.events.unlisten.call(null, src, cljs.core.get.call(null, clojure.browser.event.event_types.call(null, src), type, type), fn, capture_QMARK_)
  };
  unlisten = function(src, type, fn, capture_QMARK_) {
    switch(arguments.length) {
      case 3:
        return unlisten__3.call(this, src, type, fn);
      case 4:
        return unlisten__4.call(this, src, type, fn, capture_QMARK_)
    }
    throw"Invalid arity: " + arguments.length;
  };
  unlisten.cljs$lang$arity$3 = unlisten__3;
  unlisten.cljs$lang$arity$4 = unlisten__4;
  return unlisten
}();
clojure.browser.event.unlisten_by_key = function unlisten_by_key(key) {
  return goog.events.unlistenByKey.call(null, key)
};
clojure.browser.event.dispatch_event = function dispatch_event(src, event) {
  return goog.events.dispatchEvent.call(null, src, event)
};
clojure.browser.event.expose = function expose(e) {
  return goog.events.expose.call(null, e)
};
clojure.browser.event.fire_listeners = function fire_listeners(obj, type, capture, event) {
  return null
};
clojure.browser.event.total_listener_count = function total_listener_count() {
  return goog.events.getTotalListenerCount.call(null)
};
clojure.browser.event.get_listener = function get_listener(src, type, listener, opt_capt, opt_handler) {
  return null
};
clojure.browser.event.all_listeners = function all_listeners(obj, type, capture) {
  return null
};
clojure.browser.event.unique_event_id = function unique_event_id(event_type) {
  return null
};
clojure.browser.event.has_listener = function has_listener(obj, opt_type, opt_capture) {
  return null
};
clojure.browser.event.remove_all = function remove_all(opt_obj, opt_type, opt_capt) {
  return null
};
goog.provide("goog.Timer");
goog.require("goog.events.EventTarget");
goog.Timer = function(opt_interval, opt_timerObject) {
  goog.events.EventTarget.call(this);
  this.interval_ = opt_interval || 1;
  this.timerObject_ = opt_timerObject || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now()
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = false;
goog.Timer.defaultTimerObject = goog.global["window"];
goog.Timer.intervalScale = 0.8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
  return this.interval_
};
goog.Timer.prototype.setInterval = function(interval) {
  this.interval_ = interval;
  if(this.timer_ && this.enabled) {
    this.stop();
    this.start()
  }else {
    if(this.timer_) {
      this.stop()
    }
  }
};
goog.Timer.prototype.tick_ = function() {
  if(this.enabled) {
    var elapsed = goog.now() - this.last_;
    if(elapsed > 0 && elapsed < this.interval_ * goog.Timer.intervalScale) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - elapsed);
      return
    }
    this.dispatchTick();
    if(this.enabled) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
      this.last_ = goog.now()
    }
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK)
};
goog.Timer.prototype.start = function() {
  this.enabled = true;
  if(!this.timer_) {
    this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
    this.last_ = goog.now()
  }
};
goog.Timer.prototype.stop = function() {
  this.enabled = false;
  if(this.timer_) {
    this.timerObject_.clearTimeout(this.timer_);
    this.timer_ = null
  }
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(listener, opt_delay, opt_handler) {
  if(goog.isFunction(listener)) {
    if(opt_handler) {
      listener = goog.bind(listener, opt_handler)
    }
  }else {
    if(listener && typeof listener.handleEvent == "function") {
      listener = goog.bind(listener.handleEvent, listener)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  if(opt_delay > goog.Timer.MAX_TIMEOUT_) {
    return-1
  }else {
    return goog.Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0)
  }
};
goog.Timer.clear = function(timerId) {
  goog.Timer.defaultTimerObject.clearTimeout(timerId)
};
goog.provide("goog.structs");
goog.require("goog.array");
goog.require("goog.object");
goog.structs.getCount = function(col) {
  if(typeof col.getCount == "function") {
    return col.getCount()
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return col.length
  }
  return goog.object.getCount(col)
};
goog.structs.getValues = function(col) {
  if(typeof col.getValues == "function") {
    return col.getValues()
  }
  if(goog.isString(col)) {
    return col.split("")
  }
  if(goog.isArrayLike(col)) {
    var rv = [];
    var l = col.length;
    for(var i = 0;i < l;i++) {
      rv.push(col[i])
    }
    return rv
  }
  return goog.object.getValues(col)
};
goog.structs.getKeys = function(col) {
  if(typeof col.getKeys == "function") {
    return col.getKeys()
  }
  if(typeof col.getValues == "function") {
    return undefined
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    var rv = [];
    var l = col.length;
    for(var i = 0;i < l;i++) {
      rv.push(i)
    }
    return rv
  }
  return goog.object.getKeys(col)
};
goog.structs.contains = function(col, val) {
  if(typeof col.contains == "function") {
    return col.contains(val)
  }
  if(typeof col.containsValue == "function") {
    return col.containsValue(val)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.contains(col, val)
  }
  return goog.object.containsValue(col, val)
};
goog.structs.isEmpty = function(col) {
  if(typeof col.isEmpty == "function") {
    return col.isEmpty()
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.isEmpty(col)
  }
  return goog.object.isEmpty(col)
};
goog.structs.clear = function(col) {
  if(typeof col.clear == "function") {
    col.clear()
  }else {
    if(goog.isArrayLike(col)) {
      goog.array.clear(col)
    }else {
      goog.object.clear(col)
    }
  }
};
goog.structs.forEach = function(col, f, opt_obj) {
  if(typeof col.forEach == "function") {
    col.forEach(f, opt_obj)
  }else {
    if(goog.isArrayLike(col) || goog.isString(col)) {
      goog.array.forEach(col, f, opt_obj)
    }else {
      var keys = goog.structs.getKeys(col);
      var values = goog.structs.getValues(col);
      var l = values.length;
      for(var i = 0;i < l;i++) {
        f.call(opt_obj, values[i], keys && keys[i], col)
      }
    }
  }
};
goog.structs.filter = function(col, f, opt_obj) {
  if(typeof col.filter == "function") {
    return col.filter(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter(col, f, opt_obj)
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if(keys) {
    rv = {};
    for(var i = 0;i < l;i++) {
      if(f.call(opt_obj, values[i], keys[i], col)) {
        rv[keys[i]] = values[i]
      }
    }
  }else {
    rv = [];
    for(var i = 0;i < l;i++) {
      if(f.call(opt_obj, values[i], undefined, col)) {
        rv.push(values[i])
      }
    }
  }
  return rv
};
goog.structs.map = function(col, f, opt_obj) {
  if(typeof col.map == "function") {
    return col.map(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map(col, f, opt_obj)
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if(keys) {
    rv = {};
    for(var i = 0;i < l;i++) {
      rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col)
    }
  }else {
    rv = [];
    for(var i = 0;i < l;i++) {
      rv[i] = f.call(opt_obj, values[i], undefined, col)
    }
  }
  return rv
};
goog.structs.some = function(col, f, opt_obj) {
  if(typeof col.some == "function") {
    return col.some(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some(col, f, opt_obj)
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for(var i = 0;i < l;i++) {
    if(f.call(opt_obj, values[i], keys && keys[i], col)) {
      return true
    }
  }
  return false
};
goog.structs.every = function(col, f, opt_obj) {
  if(typeof col.every == "function") {
    return col.every(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every(col, f, opt_obj)
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for(var i = 0;i < l;i++) {
    if(!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return false
    }
  }
  return true
};
goog.provide("goog.structs.Collection");
goog.structs.Collection = function() {
};
goog.structs.Collection.prototype.add;
goog.structs.Collection.prototype.remove;
goog.structs.Collection.prototype.contains;
goog.structs.Collection.prototype.getCount;
goog.provide("goog.iter");
goog.provide("goog.iter.Iterator");
goog.provide("goog.iter.StopIteration");
goog.require("goog.array");
goog.require("goog.asserts");
goog.iter.Iterable;
if("StopIteration" in goog.global) {
  goog.iter.StopIteration = goog.global["StopIteration"]
}else {
  goog.iter.StopIteration = Error("StopIteration")
}
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(opt_keys) {
  return this
};
goog.iter.toIterator = function(iterable) {
  if(iterable instanceof goog.iter.Iterator) {
    return iterable
  }
  if(typeof iterable.__iterator__ == "function") {
    return iterable.__iterator__(false)
  }
  if(goog.isArrayLike(iterable)) {
    var i = 0;
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
      while(true) {
        if(i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        if(!(i in iterable)) {
          i++;
          continue
        }
        return iterable[i++]
      }
    };
    return newIter
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
  if(goog.isArrayLike(iterable)) {
    try {
      goog.array.forEach(iterable, f, opt_obj)
    }catch(ex) {
      if(ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  }else {
    iterable = goog.iter.toIterator(iterable);
    try {
      while(true) {
        f.call(opt_obj, iterable.next(), undefined, iterable)
      }
    }catch(ex) {
      if(ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  }
};
goog.iter.filter = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while(true) {
      var val = iterable.next();
      if(f.call(opt_obj, val, undefined, iterable)) {
        return val
      }
    }
  };
  return newIter
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
  var start = 0;
  var stop = startOrStop;
  var step = opt_step || 1;
  if(arguments.length > 1) {
    start = startOrStop;
    stop = opt_stop
  }
  if(step == 0) {
    throw Error("Range step argument must not be zero");
  }
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if(step > 0 && start >= stop || step < 0 && start <= stop) {
      throw goog.iter.StopIteration;
    }
    var rv = start;
    start += step;
    return rv
  };
  return newIter
};
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator)
};
goog.iter.map = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while(true) {
      var val = iterable.next();
      return f.call(opt_obj, val, undefined, iterable)
    }
  };
  return newIter
};
goog.iter.reduce = function(iterable, f, val, opt_obj) {
  var rval = val;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val)
  });
  return rval
};
goog.iter.some = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while(true) {
      if(f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return true
      }
    }
  }catch(ex) {
    if(ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return false
};
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while(true) {
      if(!f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return false
      }
    }
  }catch(ex) {
    if(ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return true
};
goog.iter.chain = function(var_args) {
  var args = arguments;
  var length = args.length;
  var i = 0;
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    try {
      if(i >= length) {
        throw goog.iter.StopIteration;
      }
      var current = goog.iter.toIterator(args[i]);
      return current.next()
    }catch(ex) {
      if(ex !== goog.iter.StopIteration || i >= length) {
        throw ex;
      }else {
        i++;
        return this.next()
      }
    }
  };
  return newIter
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var dropping = true;
  newIter.next = function() {
    while(true) {
      var val = iterable.next();
      if(dropping && f.call(opt_obj, val, undefined, iterable)) {
        continue
      }else {
        dropping = false
      }
      return val
    }
  };
  return newIter
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var taking = true;
  newIter.next = function() {
    while(true) {
      if(taking) {
        var val = iterable.next();
        if(f.call(opt_obj, val, undefined, iterable)) {
          return val
        }else {
          taking = false
        }
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return newIter
};
goog.iter.toArray = function(iterable) {
  if(goog.isArrayLike(iterable)) {
    return goog.array.toArray(iterable)
  }
  iterable = goog.iter.toIterator(iterable);
  var array = [];
  goog.iter.forEach(iterable, function(val) {
    array.push(val)
  });
  return array
};
goog.iter.equals = function(iterable1, iterable2) {
  iterable1 = goog.iter.toIterator(iterable1);
  iterable2 = goog.iter.toIterator(iterable2);
  var b1, b2;
  try {
    while(true) {
      b1 = b2 = false;
      var val1 = iterable1.next();
      b1 = true;
      var val2 = iterable2.next();
      b2 = true;
      if(val1 != val2) {
        return false
      }
    }
  }catch(ex) {
    if(ex !== goog.iter.StopIteration) {
      throw ex;
    }else {
      if(b1 && !b2) {
        return false
      }
      if(!b2) {
        try {
          val2 = iterable2.next();
          return false
        }catch(ex1) {
          if(ex1 !== goog.iter.StopIteration) {
            throw ex1;
          }
          return true
        }
      }
    }
  }
  return false
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next()
  }catch(e) {
    if(e != goog.iter.StopIteration) {
      throw e;
    }
    return defaultValue
  }
};
goog.iter.product = function(var_args) {
  var someArrayEmpty = goog.array.some(arguments, function(arr) {
    return!arr.length
  });
  if(someArrayEmpty || !arguments.length) {
    return new goog.iter.Iterator
  }
  var iter = new goog.iter.Iterator;
  var arrays = arguments;
  var indicies = goog.array.repeat(0, arrays.length);
  iter.next = function() {
    if(indicies) {
      var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex]
      });
      for(var i = indicies.length - 1;i >= 0;i--) {
        goog.asserts.assert(indicies);
        if(indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break
        }
        if(i == 0) {
          indicies = null;
          break
        }
        indicies[i] = 0
      }
      return retVal
    }
    throw goog.iter.StopIteration;
  };
  return iter
};
goog.iter.cycle = function(iterable) {
  var baseIterator = goog.iter.toIterator(iterable);
  var cache = [];
  var cacheIndex = 0;
  var iter = new goog.iter.Iterator;
  var useCache = false;
  iter.next = function() {
    var returnElement = null;
    if(!useCache) {
      try {
        returnElement = baseIterator.next();
        cache.push(returnElement);
        return returnElement
      }catch(e) {
        if(e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e;
        }
        useCache = true
      }
    }
    returnElement = cache[cacheIndex];
    cacheIndex = (cacheIndex + 1) % cache.length;
    return returnElement
  };
  return iter
};
goog.provide("goog.structs.Map");
goog.require("goog.iter.Iterator");
goog.require("goog.iter.StopIteration");
goog.require("goog.object");
goog.require("goog.structs");
goog.structs.Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  var argLength = arguments.length;
  if(argLength > 1) {
    if(argLength % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var i = 0;i < argLength;i += 2) {
      this.set(arguments[i], arguments[i + 1])
    }
  }else {
    if(opt_map) {
      this.addAll(opt_map)
    }
  }
};
goog.structs.Map.prototype.count_ = 0;
goog.structs.Map.prototype.version_ = 0;
goog.structs.Map.prototype.getCount = function() {
  return this.count_
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  var rv = [];
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    rv.push(this.map_[key])
  }
  return rv
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat()
};
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key)
};
goog.structs.Map.prototype.containsValue = function(val) {
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    if(goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return true
    }
  }
  return false
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if(this === otherMap) {
    return true
  }
  if(this.count_ != otherMap.getCount()) {
    return false
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for(var key, i = 0;key = this.keys_[i];i++) {
    if(!equalityFn(this.get(key), otherMap.get(key))) {
      return false
    }
  }
  return true
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.keys_.length = 0;
  this.count_ = 0;
  this.version_ = 0
};
goog.structs.Map.prototype.remove = function(key) {
  if(goog.structs.Map.hasKey_(this.map_, key)) {
    delete this.map_[key];
    this.count_--;
    this.version_++;
    if(this.keys_.length > 2 * this.count_) {
      this.cleanupKeysArray_()
    }
    return true
  }
  return false
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if(this.count_ != this.keys_.length) {
    var srcIndex = 0;
    var destIndex = 0;
    while(srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if(goog.structs.Map.hasKey_(this.map_, key)) {
        this.keys_[destIndex++] = key
      }
      srcIndex++
    }
    this.keys_.length = destIndex
  }
  if(this.count_ != this.keys_.length) {
    var seen = {};
    var srcIndex = 0;
    var destIndex = 0;
    while(srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if(!goog.structs.Map.hasKey_(seen, key)) {
        this.keys_[destIndex++] = key;
        seen[key] = 1
      }
      srcIndex++
    }
    this.keys_.length = destIndex
  }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
  if(goog.structs.Map.hasKey_(this.map_, key)) {
    return this.map_[key]
  }
  return opt_val
};
goog.structs.Map.prototype.set = function(key, value) {
  if(!goog.structs.Map.hasKey_(this.map_, key)) {
    this.count_++;
    this.keys_.push(key);
    this.version_++
  }
  this.map_[key] = value
};
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  if(map instanceof goog.structs.Map) {
    keys = map.getKeys();
    values = map.getValues()
  }else {
    keys = goog.object.getKeys(map);
    values = goog.object.getValues(map)
  }
  for(var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i])
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
  var transposed = new goog.structs.Map;
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    var value = this.map_[key];
    transposed.set(value, key)
  }
  return transposed
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  var obj = {};
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    obj[key] = this.map_[key]
  }
  return obj
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(true)
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(false)
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
  this.cleanupKeysArray_();
  var i = 0;
  var keys = this.keys_;
  var map = this.map_;
  var version = this.version_;
  var selfObj = this;
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while(true) {
      if(version != selfObj.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if(i >= keys.length) {
        throw goog.iter.StopIteration;
      }
      var key = keys[i++];
      return opt_keys ? key : map[key]
    }
  };
  return newIter
};
goog.structs.Map.hasKey_ = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
};
goog.provide("goog.structs.Set");
goog.require("goog.structs");
goog.require("goog.structs.Collection");
goog.require("goog.structs.Map");
goog.structs.Set = function(opt_values) {
  this.map_ = new goog.structs.Map;
  if(opt_values) {
    this.addAll(opt_values)
  }
};
goog.structs.Set.getKey_ = function(val) {
  var type = typeof val;
  if(type == "object" && val || type == "function") {
    return"o" + goog.getUid(val)
  }else {
    return type.substr(0, 1) + val
  }
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount()
};
goog.structs.Set.prototype.add = function(element) {
  this.map_.set(goog.structs.Set.getKey_(element), element)
};
goog.structs.Set.prototype.addAll = function(col) {
  var values = goog.structs.getValues(col);
  var l = values.length;
  for(var i = 0;i < l;i++) {
    this.add(values[i])
  }
};
goog.structs.Set.prototype.removeAll = function(col) {
  var values = goog.structs.getValues(col);
  var l = values.length;
  for(var i = 0;i < l;i++) {
    this.remove(values[i])
  }
};
goog.structs.Set.prototype.remove = function(element) {
  return this.map_.remove(goog.structs.Set.getKey_(element))
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear()
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty()
};
goog.structs.Set.prototype.contains = function(element) {
  return this.map_.containsKey(goog.structs.Set.getKey_(element))
};
goog.structs.Set.prototype.containsAll = function(col) {
  return goog.structs.every(col, this.contains, this)
};
goog.structs.Set.prototype.intersection = function(col) {
  var result = new goog.structs.Set;
  var values = goog.structs.getValues(col);
  for(var i = 0;i < values.length;i++) {
    var value = values[i];
    if(this.contains(value)) {
      result.add(value)
    }
  }
  return result
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues()
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this)
};
goog.structs.Set.prototype.equals = function(col) {
  return this.getCount() == goog.structs.getCount(col) && this.isSubsetOf(col)
};
goog.structs.Set.prototype.isSubsetOf = function(col) {
  var colCount = goog.structs.getCount(col);
  if(this.getCount() > colCount) {
    return false
  }
  if(!(col instanceof goog.structs.Set) && colCount > 5) {
    col = new goog.structs.Set(col)
  }
  return goog.structs.every(this, function(value) {
    return goog.structs.contains(col, value)
  })
};
goog.structs.Set.prototype.__iterator__ = function(opt_keys) {
  return this.map_.__iterator__(false)
};
goog.provide("goog.debug");
goog.require("goog.array");
goog.require("goog.string");
goog.require("goog.structs.Set");
goog.require("goog.userAgent");
goog.debug.catchErrors = function(logFunc, opt_cancel, opt_target) {
  var target = opt_target || goog.global;
  var oldErrorHandler = target.onerror;
  var retVal = goog.userAgent.WEBKIT ? !opt_cancel : !!opt_cancel;
  target.onerror = function(message, url, line) {
    if(oldErrorHandler) {
      oldErrorHandler(message, url, line)
    }
    logFunc({message:message, fileName:url, line:line});
    return retVal
  }
};
goog.debug.expose = function(obj, opt_showFn) {
  if(typeof obj == "undefined") {
    return"undefined"
  }
  if(obj == null) {
    return"NULL"
  }
  var str = [];
  for(var x in obj) {
    if(!opt_showFn && goog.isFunction(obj[x])) {
      continue
    }
    var s = x + " = ";
    try {
      s += obj[x]
    }catch(e) {
      s += "*** " + e + " ***"
    }
    str.push(s)
  }
  return str.join("\n")
};
goog.debug.deepExpose = function(obj, opt_showFn) {
  var previous = new goog.structs.Set;
  var str = [];
  var helper = function(obj, space) {
    var nestspace = space + "  ";
    var indentMultiline = function(str) {
      return str.replace(/\n/g, "\n" + space)
    };
    try {
      if(!goog.isDef(obj)) {
        str.push("undefined")
      }else {
        if(goog.isNull(obj)) {
          str.push("NULL")
        }else {
          if(goog.isString(obj)) {
            str.push('"' + indentMultiline(obj) + '"')
          }else {
            if(goog.isFunction(obj)) {
              str.push(indentMultiline(String(obj)))
            }else {
              if(goog.isObject(obj)) {
                if(previous.contains(obj)) {
                  str.push("*** reference loop detected ***")
                }else {
                  previous.add(obj);
                  str.push("{");
                  for(var x in obj) {
                    if(!opt_showFn && goog.isFunction(obj[x])) {
                      continue
                    }
                    str.push("\n");
                    str.push(nestspace);
                    str.push(x + " = ");
                    helper(obj[x], nestspace)
                  }
                  str.push("\n" + space + "}")
                }
              }else {
                str.push(obj)
              }
            }
          }
        }
      }
    }catch(e) {
      str.push("*** " + e + " ***")
    }
  };
  helper(obj, "");
  return str.join("")
};
goog.debug.exposeArray = function(arr) {
  var str = [];
  for(var i = 0;i < arr.length;i++) {
    if(goog.isArray(arr[i])) {
      str.push(goog.debug.exposeArray(arr[i]))
    }else {
      str.push(arr[i])
    }
  }
  return"[ " + str.join(", ") + " ]"
};
goog.debug.exposeException = function(err, opt_fn) {
  try {
    var e = goog.debug.normalizeErrorObject(err);
    var error = "Message: " + goog.string.htmlEscape(e.message) + '\nUrl: <a href="view-source:' + e.fileName + '" target="_new">' + e.fileName + "</a>\nLine: " + e.lineNumber + "\n\nBrowser stack:\n" + goog.string.htmlEscape(e.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + goog.string.htmlEscape(goog.debug.getStacktrace(opt_fn) + "-> ");
    return error
  }catch(e2) {
    return"Exception trying to expose exception! You win, we lose. " + e2
  }
};
goog.debug.normalizeErrorObject = function(err) {
  var href = goog.getObjectByName("window.location.href");
  if(goog.isString(err)) {
    return{"message":err, "name":"Unknown error", "lineNumber":"Not available", "fileName":href, "stack":"Not available"}
  }
  var lineNumber, fileName;
  var threwError = false;
  try {
    lineNumber = err.lineNumber || err.line || "Not available"
  }catch(e) {
    lineNumber = "Not available";
    threwError = true
  }
  try {
    fileName = err.fileName || err.filename || err.sourceURL || href
  }catch(e) {
    fileName = "Not available";
    threwError = true
  }
  if(threwError || !err.lineNumber || !err.fileName || !err.stack) {
    return{"message":err.message, "name":err.name, "lineNumber":lineNumber, "fileName":fileName, "stack":err.stack || "Not available"}
  }
  return err
};
goog.debug.enhanceError = function(err, opt_message) {
  var error = typeof err == "string" ? Error(err) : err;
  if(!error.stack) {
    error.stack = goog.debug.getStacktrace(arguments.callee.caller)
  }
  if(opt_message) {
    var x = 0;
    while(error["message" + x]) {
      ++x
    }
    error["message" + x] = String(opt_message)
  }
  return error
};
goog.debug.getStacktraceSimple = function(opt_depth) {
  var sb = [];
  var fn = arguments.callee.caller;
  var depth = 0;
  while(fn && (!opt_depth || depth < opt_depth)) {
    sb.push(goog.debug.getFunctionName(fn));
    sb.push("()\n");
    try {
      fn = fn.caller
    }catch(e) {
      sb.push("[exception trying to get caller]\n");
      break
    }
    depth++;
    if(depth >= goog.debug.MAX_STACK_DEPTH) {
      sb.push("[...long stack...]");
      break
    }
  }
  if(opt_depth && depth >= opt_depth) {
    sb.push("[...reached max depth limit...]")
  }else {
    sb.push("[end]")
  }
  return sb.join("")
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getStacktrace = function(opt_fn) {
  return goog.debug.getStacktraceHelper_(opt_fn || arguments.callee.caller, [])
};
goog.debug.getStacktraceHelper_ = function(fn, visited) {
  var sb = [];
  if(goog.array.contains(visited, fn)) {
    sb.push("[...circular reference...]")
  }else {
    if(fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
      sb.push(goog.debug.getFunctionName(fn) + "(");
      var args = fn.arguments;
      for(var i = 0;i < args.length;i++) {
        if(i > 0) {
          sb.push(", ")
        }
        var argDesc;
        var arg = args[i];
        switch(typeof arg) {
          case "object":
            argDesc = arg ? "object" : "null";
            break;
          case "string":
            argDesc = arg;
            break;
          case "number":
            argDesc = String(arg);
            break;
          case "boolean":
            argDesc = arg ? "true" : "false";
            break;
          case "function":
            argDesc = goog.debug.getFunctionName(arg);
            argDesc = argDesc ? argDesc : "[fn]";
            break;
          case "undefined":
          ;
          default:
            argDesc = typeof arg;
            break
        }
        if(argDesc.length > 40) {
          argDesc = argDesc.substr(0, 40) + "..."
        }
        sb.push(argDesc)
      }
      visited.push(fn);
      sb.push(")\n");
      try {
        sb.push(goog.debug.getStacktraceHelper_(fn.caller, visited))
      }catch(e) {
        sb.push("[exception trying to get caller]\n")
      }
    }else {
      if(fn) {
        sb.push("[...long stack...]")
      }else {
        sb.push("[end]")
      }
    }
  }
  return sb.join("")
};
goog.debug.setFunctionResolver = function(resolver) {
  goog.debug.fnNameResolver_ = resolver
};
goog.debug.getFunctionName = function(fn) {
  if(goog.debug.fnNameCache_[fn]) {
    return goog.debug.fnNameCache_[fn]
  }
  if(goog.debug.fnNameResolver_) {
    var name = goog.debug.fnNameResolver_(fn);
    if(name) {
      goog.debug.fnNameCache_[fn] = name;
      return name
    }
  }
  var functionSource = String(fn);
  if(!goog.debug.fnNameCache_[functionSource]) {
    var matches = /function ([^\(]+)/.exec(functionSource);
    if(matches) {
      var method = matches[1];
      goog.debug.fnNameCache_[functionSource] = method
    }else {
      goog.debug.fnNameCache_[functionSource] = "[Anonymous]"
    }
  }
  return goog.debug.fnNameCache_[functionSource]
};
goog.debug.makeWhitespaceVisible = function(string) {
  return string.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]")
};
goog.debug.fnNameCache_ = {};
goog.debug.fnNameResolver_;
goog.provide("goog.debug.LogRecord");
goog.debug.LogRecord = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber)
};
goog.debug.LogRecord.prototype.time_;
goog.debug.LogRecord.prototype.level_;
goog.debug.LogRecord.prototype.msg_;
goog.debug.LogRecord.prototype.loggerName_;
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.prototype.exceptionText_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = true;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  if(goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS) {
    this.sequenceNumber_ = typeof opt_sequenceNumber == "number" ? opt_sequenceNumber : goog.debug.LogRecord.nextSequenceNumber_++
  }
  this.time_ = opt_time || goog.now();
  this.level_ = level;
  this.msg_ = msg;
  this.loggerName_ = loggerName;
  delete this.exception_;
  delete this.exceptionText_
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_
};
goog.debug.LogRecord.prototype.setException = function(exception) {
  this.exception_ = exception
};
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_
};
goog.debug.LogRecord.prototype.setExceptionText = function(text) {
  this.exceptionText_ = text
};
goog.debug.LogRecord.prototype.setLoggerName = function(loggerName) {
  this.loggerName_ = loggerName
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_
};
goog.debug.LogRecord.prototype.setLevel = function(level) {
  this.level_ = level
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_
};
goog.debug.LogRecord.prototype.setMessage = function(msg) {
  this.msg_ = msg
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_
};
goog.debug.LogRecord.prototype.setMillis = function(time) {
  this.time_ = time
};
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_
};
goog.provide("goog.debug.LogBuffer");
goog.require("goog.asserts");
goog.require("goog.debug.LogRecord");
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining " + "goog.debug.LogBuffer.CAPACITY.");
  this.clear()
};
goog.debug.LogBuffer.getInstance = function() {
  if(!goog.debug.LogBuffer.instance_) {
    goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer
  }
  return goog.debug.LogBuffer.instance_
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.buffer_;
goog.debug.LogBuffer.prototype.curIndex_;
goog.debug.LogBuffer.prototype.isFull_;
goog.debug.LogBuffer.prototype.addRecord = function(level, msg, loggerName) {
  var curIndex = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = curIndex;
  if(this.isFull_) {
    var ret = this.buffer_[curIndex];
    ret.reset(level, msg, loggerName);
    return ret
  }
  this.isFull_ = curIndex == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[curIndex] = new goog.debug.LogRecord(level, msg, loggerName)
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return goog.debug.LogBuffer.CAPACITY > 0
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = new Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = false
};
goog.debug.LogBuffer.prototype.forEachRecord = function(func) {
  var buffer = this.buffer_;
  if(!buffer[0]) {
    return
  }
  var curIndex = this.curIndex_;
  var i = this.isFull_ ? curIndex : -1;
  do {
    i = (i + 1) % goog.debug.LogBuffer.CAPACITY;
    func(buffer[i])
  }while(i != curIndex)
};
goog.provide("goog.debug.LogManager");
goog.provide("goog.debug.Logger");
goog.provide("goog.debug.Logger.Level");
goog.require("goog.array");
goog.require("goog.asserts");
goog.require("goog.debug");
goog.require("goog.debug.LogBuffer");
goog.require("goog.debug.LogRecord");
goog.debug.Logger = function(name) {
  this.name_ = name
};
goog.debug.Logger.prototype.parent_ = null;
goog.debug.Logger.prototype.level_ = null;
goog.debug.Logger.prototype.children_ = null;
goog.debug.Logger.prototype.handlers_ = null;
goog.debug.Logger.ENABLE_HIERARCHY = true;
if(!goog.debug.Logger.ENABLE_HIERARCHY) {
  goog.debug.Logger.rootHandlers_ = [];
  goog.debug.Logger.rootLevel_
}
goog.debug.Logger.Level = function(name, value) {
  this.name = name;
  this.value = value
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for(var i = 0, level;level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];i++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[level.value] = level;
    goog.debug.Logger.Level.predefinedLevelsCache_[level.name] = level
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(name) {
  if(!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_()
  }
  return goog.debug.Logger.Level.predefinedLevelsCache_[name] || null
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(value) {
  if(!goog.debug.Logger.Level.predefinedLevelsCache_) {
    goog.debug.Logger.Level.createPredefinedLevelsCache_()
  }
  if(value in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[value]
  }
  for(var i = 0;i < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++i) {
    var level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];
    if(level.value <= value) {
      return level
    }
  }
  return null
};
goog.debug.Logger.getLogger = function(name) {
  return goog.debug.LogManager.getLogger(name)
};
goog.debug.Logger.logToProfilers = function(msg) {
  if(goog.global["console"]) {
    if(goog.global["console"]["timeStamp"]) {
      goog.global["console"]["timeStamp"](msg)
    }else {
      if(goog.global["console"]["markTimeline"]) {
        goog.global["console"]["markTimeline"](msg)
      }
    }
  }
  if(goog.global["msWriteProfilerMark"]) {
    goog.global["msWriteProfilerMark"](msg)
  }
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_
};
goog.debug.Logger.prototype.addHandler = function(handler) {
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    if(!this.handlers_) {
      this.handlers_ = []
    }
    this.handlers_.push(handler)
  }else {
    goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when " + "goog.debug.Logger.ENABLE_HIERARCHY is false.");
    goog.debug.Logger.rootHandlers_.push(handler)
  }
};
goog.debug.Logger.prototype.removeHandler = function(handler) {
  var handlers = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
  return!!handlers && goog.array.remove(handlers, handler)
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_
};
goog.debug.Logger.prototype.getChildren = function() {
  if(!this.children_) {
    this.children_ = {}
  }
  return this.children_
};
goog.debug.Logger.prototype.setLevel = function(level) {
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    this.level_ = level
  }else {
    goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when " + "goog.debug.Logger.ENABLE_HIERARCHY is false.");
    goog.debug.Logger.rootLevel_ = level
  }
};
goog.debug.Logger.prototype.getLevel = function() {
  return this.level_
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if(!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_
  }
  if(this.level_) {
    return this.level_
  }
  if(this.parent_) {
    return this.parent_.getEffectiveLevel()
  }
  goog.asserts.fail("Root logger has no level set.");
  return null
};
goog.debug.Logger.prototype.isLoggable = function(level) {
  return level.value >= this.getEffectiveLevel().value
};
goog.debug.Logger.prototype.log = function(level, msg, opt_exception) {
  if(this.isLoggable(level)) {
    this.doLogRecord_(this.getLogRecord(level, msg, opt_exception))
  }
};
goog.debug.Logger.prototype.getLogRecord = function(level, msg, opt_exception) {
  if(goog.debug.LogBuffer.isBufferingEnabled()) {
    var logRecord = goog.debug.LogBuffer.getInstance().addRecord(level, msg, this.name_)
  }else {
    logRecord = new goog.debug.LogRecord(level, String(msg), this.name_)
  }
  if(opt_exception) {
    logRecord.setException(opt_exception);
    logRecord.setExceptionText(goog.debug.exposeException(opt_exception, arguments.callee.caller))
  }
  return logRecord
};
goog.debug.Logger.prototype.shout = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.SHOUT, msg, opt_exception)
};
goog.debug.Logger.prototype.severe = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception)
};
goog.debug.Logger.prototype.warning = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.WARNING, msg, opt_exception)
};
goog.debug.Logger.prototype.info = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.INFO, msg, opt_exception)
};
goog.debug.Logger.prototype.config = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.CONFIG, msg, opt_exception)
};
goog.debug.Logger.prototype.fine = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.FINE, msg, opt_exception)
};
goog.debug.Logger.prototype.finer = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.FINER, msg, opt_exception)
};
goog.debug.Logger.prototype.finest = function(msg, opt_exception) {
  this.log(goog.debug.Logger.Level.FINEST, msg, opt_exception)
};
goog.debug.Logger.prototype.logRecord = function(logRecord) {
  if(this.isLoggable(logRecord.getLevel())) {
    this.doLogRecord_(logRecord)
  }
};
goog.debug.Logger.prototype.doLogRecord_ = function(logRecord) {
  goog.debug.Logger.logToProfilers("log:" + logRecord.getMessage());
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    var target = this;
    while(target) {
      target.callPublish_(logRecord);
      target = target.getParent()
    }
  }else {
    for(var i = 0, handler;handler = goog.debug.Logger.rootHandlers_[i++];) {
      handler(logRecord)
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(logRecord) {
  if(this.handlers_) {
    for(var i = 0, handler;handler = this.handlers_[i];i++) {
      handler(logRecord)
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(parent) {
  this.parent_ = parent
};
goog.debug.Logger.prototype.addChild_ = function(name, logger) {
  this.getChildren()[name] = logger
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  if(!goog.debug.LogManager.rootLogger_) {
    goog.debug.LogManager.rootLogger_ = new goog.debug.Logger("");
    goog.debug.LogManager.loggers_[""] = goog.debug.LogManager.rootLogger_;
    goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG)
  }
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_
};
goog.debug.LogManager.getLogger = function(name) {
  goog.debug.LogManager.initialize();
  var ret = goog.debug.LogManager.loggers_[name];
  return ret || goog.debug.LogManager.createLogger_(name)
};
goog.debug.LogManager.createFunctionForCatchErrors = function(opt_logger) {
  return function(info) {
    var logger = opt_logger || goog.debug.LogManager.getRoot();
    logger.severe("Error: " + info.message + " (" + info.fileName + " @ Line: " + info.line + ")")
  }
};
goog.debug.LogManager.createLogger_ = function(name) {
  var logger = new goog.debug.Logger(name);
  if(goog.debug.Logger.ENABLE_HIERARCHY) {
    var lastDotIndex = name.lastIndexOf(".");
    var parentName = name.substr(0, lastDotIndex);
    var leafName = name.substr(lastDotIndex + 1);
    var parentLogger = goog.debug.LogManager.getLogger(parentName);
    parentLogger.addChild_(leafName, logger);
    logger.setParent_(parentLogger)
  }
  goog.debug.LogManager.loggers_[name] = logger;
  return logger
};
goog.provide("goog.json");
goog.provide("goog.json.Serializer");
goog.json.isValid_ = function(s) {
  if(/^\s*$/.test(s)) {
    return false
  }
  var backslashesRe = /\\["\\\/bfnrtu]/g;
  var simpleValuesRe = /"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g;
  var remainderRe = /^[\],:{}\s\u2028\u2029]*$/;
  return remainderRe.test(s.replace(backslashesRe, "@").replace(simpleValuesRe, "]").replace(openBracketsRe, ""))
};
goog.json.parse = function(s) {
  var o = String(s);
  if(goog.json.isValid_(o)) {
    try {
      return eval("(" + o + ")")
    }catch(ex) {
    }
  }
  throw Error("Invalid JSON string: " + o);
};
goog.json.unsafeParse = function(s) {
  return eval("(" + s + ")")
};
goog.json.Replacer;
goog.json.serialize = function(object, opt_replacer) {
  return(new goog.json.Serializer(opt_replacer)).serialize(object)
};
goog.json.Serializer = function(opt_replacer) {
  this.replacer_ = opt_replacer
};
goog.json.Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serialize_(object, sb);
  return sb.join("")
};
goog.json.Serializer.prototype.serialize_ = function(object, sb) {
  switch(typeof object) {
    case "string":
      this.serializeString_(object, sb);
      break;
    case "number":
      this.serializeNumber_(object, sb);
      break;
    case "boolean":
      sb.push(object);
      break;
    case "undefined":
      sb.push("null");
      break;
    case "object":
      if(object == null) {
        sb.push("null");
        break
      }
      if(goog.isArray(object)) {
        this.serializeArray_(object, sb);
        break
      }
      this.serializeObject_(object, sb);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof object);
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\u0008":"\\b", "\u000c":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(s, sb) {
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function(c) {
    if(c in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[c]
    }
    var cc = c.charCodeAt(0);
    var rv = "\\u";
    if(cc < 16) {
      rv += "000"
    }else {
      if(cc < 256) {
        rv += "00"
      }else {
        if(cc < 4096) {
          rv += "0"
        }
      }
    }
    return goog.json.Serializer.charToJsonCharCache_[c] = rv + cc.toString(16)
  }), '"')
};
goog.json.Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? n : "null")
};
goog.json.Serializer.prototype.serializeArray_ = function(arr, sb) {
  var l = arr.length;
  sb.push("[");
  var sep = "";
  for(var i = 0;i < l;i++) {
    sb.push(sep);
    var value = arr[i];
    this.serialize_(this.replacer_ ? this.replacer_.call(arr, String(i), value) : value, sb);
    sep = ","
  }
  sb.push("]")
};
goog.json.Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push("{");
  var sep = "";
  for(var key in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key];
      if(typeof value != "function") {
        sb.push(sep);
        this.serializeString_(key, sb);
        sb.push(":");
        this.serialize_(this.replacer_ ? this.replacer_.call(obj, key, value) : value, sb);
        sep = ","
      }
    }
  }
  sb.push("}")
};
goog.provide("goog.net.ErrorCode");
goog.net.ErrorCode = {NO_ERROR:0, ACCESS_DENIED:1, FILE_NOT_FOUND:2, FF_SILENT_ERROR:3, CUSTOM_ERROR:4, EXCEPTION:5, HTTP_ERROR:6, ABORT:7, TIMEOUT:8, OFFLINE:9};
goog.net.ErrorCode.getDebugMessage = function(errorCode) {
  switch(errorCode) {
    case goog.net.ErrorCode.NO_ERROR:
      return"No Error";
    case goog.net.ErrorCode.ACCESS_DENIED:
      return"Access denied to content document";
    case goog.net.ErrorCode.FILE_NOT_FOUND:
      return"File not found";
    case goog.net.ErrorCode.FF_SILENT_ERROR:
      return"Firefox silently errored";
    case goog.net.ErrorCode.CUSTOM_ERROR:
      return"Application custom error";
    case goog.net.ErrorCode.EXCEPTION:
      return"An exception occurred";
    case goog.net.ErrorCode.HTTP_ERROR:
      return"Http response at 400 or 500 level";
    case goog.net.ErrorCode.ABORT:
      return"Request was aborted";
    case goog.net.ErrorCode.TIMEOUT:
      return"Request timed out";
    case goog.net.ErrorCode.OFFLINE:
      return"The resource is not available offline";
    default:
      return"Unrecognized error code"
  }
};
goog.provide("goog.net.EventType");
goog.net.EventType = {COMPLETE:"complete", SUCCESS:"success", ERROR:"error", ABORT:"abort", READY:"ready", READY_STATE_CHANGE:"readystatechange", TIMEOUT:"timeout", INCREMENTAL_DATA:"incrementaldata", PROGRESS:"progress"};
goog.provide("goog.net.HttpStatus");
goog.net.HttpStatus = {CONTINUE:100, SWITCHING_PROTOCOLS:101, OK:200, CREATED:201, ACCEPTED:202, NON_AUTHORITATIVE_INFORMATION:203, NO_CONTENT:204, RESET_CONTENT:205, PARTIAL_CONTENT:206, MULTIPLE_CHOICES:300, MOVED_PERMANENTLY:301, FOUND:302, SEE_OTHER:303, NOT_MODIFIED:304, USE_PROXY:305, TEMPORARY_REDIRECT:307, BAD_REQUEST:400, UNAUTHORIZED:401, PAYMENT_REQUIRED:402, FORBIDDEN:403, NOT_FOUND:404, METHOD_NOT_ALLOWED:405, NOT_ACCEPTABLE:406, PROXY_AUTHENTICATION_REQUIRED:407, REQUEST_TIMEOUT:408, 
CONFLICT:409, GONE:410, LENGTH_REQUIRED:411, PRECONDITION_FAILED:412, REQUEST_ENTITY_TOO_LARGE:413, REQUEST_URI_TOO_LONG:414, UNSUPPORTED_MEDIA_TYPE:415, REQUEST_RANGE_NOT_SATISFIABLE:416, EXPECTATION_FAILED:417, INTERNAL_SERVER_ERROR:500, NOT_IMPLEMENTED:501, BAD_GATEWAY:502, SERVICE_UNAVAILABLE:503, GATEWAY_TIMEOUT:504, HTTP_VERSION_NOT_SUPPORTED:505, QUIRK_IE_NO_CONTENT:1223};
goog.provide("goog.net.XmlHttpFactory");
goog.net.XmlHttpFactory = function() {
};
goog.net.XmlHttpFactory.prototype.cachedOptions_ = null;
goog.net.XmlHttpFactory.prototype.createInstance = goog.abstractMethod;
goog.net.XmlHttpFactory.prototype.getOptions = function() {
  return this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions())
};
goog.net.XmlHttpFactory.prototype.internalGetOptions = goog.abstractMethod;
goog.provide("goog.net.WrapperXmlHttpFactory");
goog.require("goog.net.XmlHttpFactory");
goog.net.WrapperXmlHttpFactory = function(xhrFactory, optionsFactory) {
  goog.net.XmlHttpFactory.call(this);
  this.xhrFactory_ = xhrFactory;
  this.optionsFactory_ = optionsFactory
};
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function() {
  return this.xhrFactory_()
};
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function() {
  return this.optionsFactory_()
};
goog.provide("goog.net.DefaultXmlHttpFactory");
goog.provide("goog.net.XmlHttp");
goog.provide("goog.net.XmlHttp.OptionType");
goog.provide("goog.net.XmlHttp.ReadyState");
goog.require("goog.net.WrapperXmlHttpFactory");
goog.require("goog.net.XmlHttpFactory");
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance()
};
goog.net.XmlHttp.getOptions = function() {
  return goog.net.XmlHttp.factory_.getOptions()
};
goog.net.XmlHttp.OptionType = {USE_NULL_FUNCTION:0, LOCAL_REQUEST_ERROR:1};
goog.net.XmlHttp.ReadyState = {UNINITIALIZED:0, LOADING:1, LOADED:2, INTERACTIVE:3, COMPLETE:4};
goog.net.XmlHttp.factory_;
goog.net.XmlHttp.setFactory = function(factory, optionsFactory) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(factory, optionsFactory))
};
goog.net.XmlHttp.setGlobalFactory = function(factory) {
  goog.net.XmlHttp.factory_ = factory
};
goog.net.DefaultXmlHttpFactory = function() {
  goog.net.XmlHttpFactory.call(this)
};
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  var progId = this.getProgId_();
  if(progId) {
    return new ActiveXObject(progId)
  }else {
    return new XMLHttpRequest
  }
};
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function() {
  var progId = this.getProgId_();
  var options = {};
  if(progId) {
    options[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = true;
    options[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = true
  }
  return options
};
goog.net.DefaultXmlHttpFactory.prototype.ieProgId_ = null;
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function() {
  if(!this.ieProgId_ && typeof XMLHttpRequest == "undefined" && typeof ActiveXObject != "undefined") {
    var ACTIVE_X_IDENTS = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
    for(var i = 0;i < ACTIVE_X_IDENTS.length;i++) {
      var candidate = ACTIVE_X_IDENTS[i];
      try {
        new ActiveXObject(candidate);
        this.ieProgId_ = candidate;
        return candidate
      }catch(e) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled," + " or MSXML might not be installed");
  }
  return this.ieProgId_
};
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory);
goog.provide("goog.net.xhrMonitor");
goog.require("goog.array");
goog.require("goog.debug.Logger");
goog.require("goog.userAgent");
goog.net.XhrMonitor_ = function() {
  if(!goog.userAgent.GECKO) {
    return
  }
  this.contextsToXhr_ = {};
  this.xhrToContexts_ = {};
  this.stack_ = []
};
goog.net.XhrMonitor_.getKey = function(obj) {
  return goog.isString(obj) ? obj : goog.isObject(obj) ? goog.getUid(obj) : ""
};
goog.net.XhrMonitor_.prototype.logger_ = goog.debug.Logger.getLogger("goog.net.xhrMonitor");
goog.net.XhrMonitor_.prototype.enabled_ = goog.userAgent.GECKO;
goog.net.XhrMonitor_.prototype.setEnabled = function(val) {
  this.enabled_ = goog.userAgent.GECKO && val
};
goog.net.XhrMonitor_.prototype.pushContext = function(context) {
  if(!this.enabled_) {
    return
  }
  var key = goog.net.XhrMonitor_.getKey(context);
  this.logger_.finest("Pushing context: " + context + " (" + key + ")");
  this.stack_.push(key)
};
goog.net.XhrMonitor_.prototype.popContext = function() {
  if(!this.enabled_) {
    return
  }
  var context = this.stack_.pop();
  this.logger_.finest("Popping context: " + context);
  this.updateDependentContexts_(context)
};
goog.net.XhrMonitor_.prototype.isContextSafe = function(context) {
  if(!this.enabled_) {
    return true
  }
  var deps = this.contextsToXhr_[goog.net.XhrMonitor_.getKey(context)];
  this.logger_.fine("Context is safe : " + context + " - " + deps);
  return!deps
};
goog.net.XhrMonitor_.prototype.markXhrOpen = function(xhr) {
  if(!this.enabled_) {
    return
  }
  var uid = goog.getUid(xhr);
  this.logger_.fine("Opening XHR : " + uid);
  for(var i = 0;i < this.stack_.length;i++) {
    var context = this.stack_[i];
    this.addToMap_(this.contextsToXhr_, context, uid);
    this.addToMap_(this.xhrToContexts_, uid, context)
  }
};
goog.net.XhrMonitor_.prototype.markXhrClosed = function(xhr) {
  if(!this.enabled_) {
    return
  }
  var uid = goog.getUid(xhr);
  this.logger_.fine("Closing XHR : " + uid);
  delete this.xhrToContexts_[uid];
  for(var context in this.contextsToXhr_) {
    goog.array.remove(this.contextsToXhr_[context], uid);
    if(this.contextsToXhr_[context].length == 0) {
      delete this.contextsToXhr_[context]
    }
  }
};
goog.net.XhrMonitor_.prototype.updateDependentContexts_ = function(xhrUid) {
  var contexts = this.xhrToContexts_[xhrUid];
  var xhrs = this.contextsToXhr_[xhrUid];
  if(contexts && xhrs) {
    this.logger_.finest("Updating dependent contexts");
    goog.array.forEach(contexts, function(context) {
      goog.array.forEach(xhrs, function(xhr) {
        this.addToMap_(this.contextsToXhr_, context, xhr);
        this.addToMap_(this.xhrToContexts_, xhr, context)
      }, this)
    }, this)
  }
};
goog.net.XhrMonitor_.prototype.addToMap_ = function(map, key, value) {
  if(!map[key]) {
    map[key] = []
  }
  if(!goog.array.contains(map[key], value)) {
    map[key].push(value)
  }
};
goog.net.xhrMonitor = new goog.net.XhrMonitor_;
goog.provide("goog.uri.utils");
goog.provide("goog.uri.utils.ComponentIndex");
goog.provide("goog.uri.utils.QueryArray");
goog.provide("goog.uri.utils.QueryValue");
goog.provide("goog.uri.utils.StandardQueryParam");
goog.require("goog.asserts");
goog.require("goog.string");
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = [];
  if(opt_scheme) {
    out.push(opt_scheme, ":")
  }
  if(opt_domain) {
    out.push("//");
    if(opt_userInfo) {
      out.push(opt_userInfo, "@")
    }
    out.push(opt_domain);
    if(opt_port) {
      out.push(":", opt_port)
    }
  }
  if(opt_path) {
    out.push(opt_path)
  }
  if(opt_queryData) {
    out.push("?", opt_queryData)
  }
  if(opt_fragment) {
    out.push("#", opt_fragment)
  }
  return out.join("")
};
goog.uri.utils.splitRe_ = new RegExp("^" + "(?:" + "([^:/?#.]+)" + ":)?" + "(?://" + "(?:([^/?#]*)@)?" + "([\\w\\d\\-\\u0100-\\uffff.%]*)" + "(?::([0-9]+))?" + ")?" + "([^?#]+)?" + "(?:\\?([^#]*))?" + "(?:#(.*))?" + "$");
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(uri) {
  return uri.match(goog.uri.utils.splitRe_)
};
goog.uri.utils.decodeIfPossible_ = function(uri) {
  return uri && decodeURIComponent(uri)
};
goog.uri.utils.getComponentByIndex_ = function(componentIndex, uri) {
  return goog.uri.utils.split(uri)[componentIndex] || null
};
goog.uri.utils.getScheme = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, uri)
};
goog.uri.utils.getUserInfoEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, uri)
};
goog.uri.utils.getUserInfo = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(uri))
};
goog.uri.utils.getDomainEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, uri)
};
goog.uri.utils.getDomain = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(uri))
};
goog.uri.utils.getPort = function(uri) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, uri)) || null
};
goog.uri.utils.getPathEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, uri)
};
goog.uri.utils.getPath = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(uri))
};
goog.uri.utils.getQueryData = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, uri)
};
goog.uri.utils.getFragmentEncoded = function(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? null : uri.substr(hashIndex + 1)
};
goog.uri.utils.setFragmentEncoded = function(uri, fragment) {
  return goog.uri.utils.removeFragment(uri) + (fragment ? "#" + fragment : "")
};
goog.uri.utils.getFragment = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(uri))
};
goog.uri.utils.getHost = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], pieces[goog.uri.utils.ComponentIndex.USER_INFO], pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT])
};
goog.uri.utils.getPathAndAfter = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, pieces[goog.uri.utils.ComponentIndex.PATH], pieces[goog.uri.utils.ComponentIndex.QUERY_DATA], pieces[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.removeFragment = function(uri) {
  var hashIndex = uri.indexOf("#");
  return hashIndex < 0 ? uri : uri.substr(0, hashIndex)
};
goog.uri.utils.haveSameDomain = function(uri1, uri2) {
  var pieces1 = goog.uri.utils.split(uri1);
  var pieces2 = goog.uri.utils.split(uri2);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.SCHEME] == pieces2[goog.uri.utils.ComponentIndex.SCHEME] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT]
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(uri) {
  if(goog.DEBUG && (uri.indexOf("#") >= 0 || uri.indexOf("?") >= 0)) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not " + "supported: [" + uri + "]");
  }
};
goog.uri.utils.QueryValue;
goog.uri.utils.QueryArray;
goog.uri.utils.appendQueryData_ = function(buffer) {
  if(buffer[1]) {
    var baseUri = buffer[0];
    var hashIndex = baseUri.indexOf("#");
    if(hashIndex >= 0) {
      buffer.push(baseUri.substr(hashIndex));
      buffer[0] = baseUri = baseUri.substr(0, hashIndex)
    }
    var questionIndex = baseUri.indexOf("?");
    if(questionIndex < 0) {
      buffer[1] = "?"
    }else {
      if(questionIndex == baseUri.length - 1) {
        buffer[1] = undefined
      }
    }
  }
  return buffer.join("")
};
goog.uri.utils.appendKeyValuePairs_ = function(key, value, pairs) {
  if(goog.isArray(value)) {
    value = value;
    for(var j = 0;j < value.length;j++) {
      pairs.push("&", key);
      if(value[j] !== "") {
        pairs.push("=", goog.string.urlEncode(value[j]))
      }
    }
  }else {
    if(value != null) {
      pairs.push("&", key);
      if(value !== "") {
        pairs.push("=", goog.string.urlEncode(value))
      }
    }
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(buffer, keysAndValues, opt_startIndex) {
  goog.asserts.assert(Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2 == 0, "goog.uri.utils: Key/value lists must be even in length.");
  for(var i = opt_startIndex || 0;i < keysAndValues.length;i += 2) {
    goog.uri.utils.appendKeyValuePairs_(keysAndValues[i], keysAndValues[i + 1], buffer)
  }
  return buffer
};
goog.uri.utils.buildQueryData = function(keysAndValues, opt_startIndex) {
  var buffer = goog.uri.utils.buildQueryDataBuffer_([], keysAndValues, opt_startIndex);
  buffer[0] = "";
  return buffer.join("")
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(buffer, map) {
  for(var key in map) {
    goog.uri.utils.appendKeyValuePairs_(key, map[key], buffer)
  }
  return buffer
};
goog.uri.utils.buildQueryDataFromMap = function(map) {
  var buffer = goog.uri.utils.buildQueryDataBufferFromMap_([], map);
  buffer[0] = "";
  return buffer.join("")
};
goog.uri.utils.appendParams = function(uri, var_args) {
  return goog.uri.utils.appendQueryData_(arguments.length == 2 ? goog.uri.utils.buildQueryDataBuffer_([uri], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([uri], arguments, 1))
};
goog.uri.utils.appendParamsFromMap = function(uri, map) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([uri], map))
};
goog.uri.utils.appendParam = function(uri, key, value) {
  return goog.uri.utils.appendQueryData_([uri, "&", key, "=", goog.string.urlEncode(value)])
};
goog.uri.utils.findParam_ = function(uri, startIndex, keyEncoded, hashOrEndIndex) {
  var index = startIndex;
  var keyLength = keyEncoded.length;
  while((index = uri.indexOf(keyEncoded, index)) >= 0 && index < hashOrEndIndex) {
    var precedingChar = uri.charCodeAt(index - 1);
    if(precedingChar == goog.uri.utils.CharCode_.AMPERSAND || precedingChar == goog.uri.utils.CharCode_.QUESTION) {
      var followingChar = uri.charCodeAt(index + keyLength);
      if(!followingChar || followingChar == goog.uri.utils.CharCode_.EQUAL || followingChar == goog.uri.utils.CharCode_.AMPERSAND || followingChar == goog.uri.utils.CharCode_.HASH) {
        return index
      }
    }
    index += keyLength + 1
  }
  return-1
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(uri, keyEncoded) {
  return goog.uri.utils.findParam_(uri, 0, keyEncoded, uri.search(goog.uri.utils.hashOrEndRe_)) >= 0
};
goog.uri.utils.getParamValue = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var foundIndex = goog.uri.utils.findParam_(uri, 0, keyEncoded, hashOrEndIndex);
  if(foundIndex < 0) {
    return null
  }else {
    var endPosition = uri.indexOf("&", foundIndex);
    if(endPosition < 0 || endPosition > hashOrEndIndex) {
      endPosition = hashOrEndIndex
    }
    foundIndex += keyEncoded.length + 1;
    return goog.string.urlDecode(uri.substr(foundIndex, endPosition - foundIndex))
  }
};
goog.uri.utils.getParamValues = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var result = [];
  while((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    position = uri.indexOf("&", foundIndex);
    if(position < 0 || position > hashOrEndIndex) {
      position = hashOrEndIndex
    }
    foundIndex += keyEncoded.length + 1;
    result.push(goog.string.urlDecode(uri.substr(foundIndex, position - foundIndex)))
  }
  return result
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var buffer = [];
  while((foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    buffer.push(uri.substring(position, foundIndex));
    position = Math.min(uri.indexOf("&", foundIndex) + 1 || hashOrEndIndex, hashOrEndIndex)
  }
  buffer.push(uri.substr(position));
  return buffer.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1")
};
goog.uri.utils.setParam = function(uri, keyEncoded, value) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(uri, keyEncoded), keyEncoded, value)
};
goog.uri.utils.appendPath = function(baseUri, path) {
  goog.uri.utils.assertNoFragmentsOrQueries_(baseUri);
  if(goog.string.endsWith(baseUri, "/")) {
    baseUri = baseUri.substr(0, baseUri.length - 1)
  }
  if(goog.string.startsWith(path, "/")) {
    path = path.substr(1)
  }
  return goog.string.buildString(baseUri, "/", path)
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(uri) {
  return goog.uri.utils.setParam(uri, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
};
goog.provide("goog.net.XhrIo");
goog.provide("goog.net.XhrIo.ResponseType");
goog.require("goog.Timer");
goog.require("goog.debug.Logger");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.debug.errorHandlerWeakDep");
goog.require("goog.events.EventTarget");
goog.require("goog.json");
goog.require("goog.net.ErrorCode");
goog.require("goog.net.EventType");
goog.require("goog.net.HttpStatus");
goog.require("goog.net.XmlHttp");
goog.require("goog.net.xhrMonitor");
goog.require("goog.object");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.require("goog.uri.utils");
goog.net.XhrIo = function(opt_xmlHttpFactory) {
  goog.events.EventTarget.call(this);
  this.headers = new goog.structs.Map;
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null
};
goog.inherits(goog.net.XhrIo, goog.events.EventTarget);
goog.net.XhrIo.ResponseType = {DEFAULT:"", TEXT:"text", DOCUMENT:"document", BLOB:"blob", ARRAY_BUFFER:"arraybuffer"};
goog.net.XhrIo.prototype.logger_ = goog.debug.Logger.getLogger("goog.net.XhrIo");
goog.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?:?$/i;
goog.net.XhrIo.FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8";
goog.net.XhrIo.sendInstances_ = [];
goog.net.XhrIo.send = function(url, opt_callback, opt_method, opt_content, opt_headers, opt_timeoutInterval) {
  var x = new goog.net.XhrIo;
  goog.net.XhrIo.sendInstances_.push(x);
  if(opt_callback) {
    goog.events.listen(x, goog.net.EventType.COMPLETE, opt_callback)
  }
  goog.events.listen(x, goog.net.EventType.READY, goog.partial(goog.net.XhrIo.cleanupSend_, x));
  if(opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval)
  }
  x.send(url, opt_method, opt_content, opt_headers)
};
goog.net.XhrIo.cleanup = function() {
  var instances = goog.net.XhrIo.sendInstances_;
  while(instances.length) {
    instances.pop().dispose()
  }
};
goog.net.XhrIo.protectEntryPoints = function(errorHandler) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = errorHandler.protectEntryPoint(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_)
};
goog.net.XhrIo.cleanupSend_ = function(XhrIo) {
  XhrIo.dispose();
  goog.array.remove(goog.net.XhrIo.sendInstances_, XhrIo)
};
goog.net.XhrIo.prototype.active_ = false;
goog.net.XhrIo.prototype.xhr_ = null;
goog.net.XhrIo.prototype.xhrOptions_ = null;
goog.net.XhrIo.prototype.lastUri_ = "";
goog.net.XhrIo.prototype.lastMethod_ = "";
goog.net.XhrIo.prototype.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
goog.net.XhrIo.prototype.lastError_ = "";
goog.net.XhrIo.prototype.errorDispatched_ = false;
goog.net.XhrIo.prototype.inSend_ = false;
goog.net.XhrIo.prototype.inOpen_ = false;
goog.net.XhrIo.prototype.inAbort_ = false;
goog.net.XhrIo.prototype.timeoutInterval_ = 0;
goog.net.XhrIo.prototype.timeoutId_ = null;
goog.net.XhrIo.prototype.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;
goog.net.XhrIo.prototype.withCredentials_ = false;
goog.net.XhrIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_
};
goog.net.XhrIo.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms)
};
goog.net.XhrIo.prototype.setResponseType = function(type) {
  this.responseType_ = type
};
goog.net.XhrIo.prototype.getResponseType = function() {
  return this.responseType_
};
goog.net.XhrIo.prototype.setWithCredentials = function(withCredentials) {
  this.withCredentials_ = withCredentials
};
goog.net.XhrIo.prototype.getWithCredentials = function() {
  return this.withCredentials_
};
goog.net.XhrIo.prototype.send = function(url, opt_method, opt_content, opt_headers) {
  if(this.xhr_) {
    throw Error("[goog.net.XhrIo] Object is active with another request");
  }
  var method = opt_method ? opt_method.toUpperCase() : "GET";
  this.lastUri_ = url;
  this.lastError_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastMethod_ = method;
  this.errorDispatched_ = false;
  this.active_ = true;
  this.xhr_ = this.createXhr();
  this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions();
  goog.net.xhrMonitor.markXhrOpen(this.xhr_);
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);
  try {
    this.logger_.fine(this.formatMsg_("Opening Xhr"));
    this.inOpen_ = true;
    this.xhr_.open(method, url, true);
    this.inOpen_ = false
  }catch(err) {
    this.logger_.fine(this.formatMsg_("Error opening Xhr: " + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
    return
  }
  var content = opt_content || "";
  var headers = this.headers.clone();
  if(opt_headers) {
    goog.structs.forEach(opt_headers, function(value, key) {
      headers.set(key, value)
    })
  }
  if(method == "POST" && !headers.containsKey(goog.net.XhrIo.CONTENT_TYPE_HEADER)) {
    headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, goog.net.XhrIo.FORM_CONTENT_TYPE)
  }
  goog.structs.forEach(headers, function(value, key) {
    this.xhr_.setRequestHeader(key, value)
  }, this);
  if(this.responseType_) {
    this.xhr_.responseType = this.responseType_
  }
  if(goog.object.containsKey(this.xhr_, "withCredentials")) {
    this.xhr_.withCredentials = this.withCredentials_
  }
  try {
    if(this.timeoutId_) {
      goog.Timer.defaultTimerObject.clearTimeout(this.timeoutId_);
      this.timeoutId_ = null
    }
    if(this.timeoutInterval_ > 0) {
      this.logger_.fine(this.formatMsg_("Will abort after " + this.timeoutInterval_ + "ms if incomplete"));
      this.timeoutId_ = goog.Timer.defaultTimerObject.setTimeout(goog.bind(this.timeout_, this), this.timeoutInterval_)
    }
    this.logger_.fine(this.formatMsg_("Sending request"));
    this.inSend_ = true;
    this.xhr_.send(content);
    this.inSend_ = false
  }catch(err) {
    this.logger_.fine(this.formatMsg_("Send error: " + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err)
  }
};
goog.net.XhrIo.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp()
};
goog.net.XhrIo.prototype.dispatchEvent = function(e) {
  if(this.xhr_) {
    goog.net.xhrMonitor.pushContext(this.xhr_);
    try {
      return goog.net.XhrIo.superClass_.dispatchEvent.call(this, e)
    }finally {
      goog.net.xhrMonitor.popContext()
    }
  }else {
    return goog.net.XhrIo.superClass_.dispatchEvent.call(this, e)
  }
};
goog.net.XhrIo.prototype.timeout_ = function() {
  if(typeof goog == "undefined") {
  }else {
    if(this.xhr_) {
      this.lastError_ = "Timed out after " + this.timeoutInterval_ + "ms, aborting";
      this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT;
      this.logger_.fine(this.formatMsg_(this.lastError_));
      this.dispatchEvent(goog.net.EventType.TIMEOUT);
      this.abort(goog.net.ErrorCode.TIMEOUT)
    }
  }
};
goog.net.XhrIo.prototype.error_ = function(errorCode, err) {
  this.active_ = false;
  if(this.xhr_) {
    this.inAbort_ = true;
    this.xhr_.abort();
    this.inAbort_ = false
  }
  this.lastError_ = err;
  this.lastErrorCode_ = errorCode;
  this.dispatchErrors_();
  this.cleanUpXhr_()
};
goog.net.XhrIo.prototype.dispatchErrors_ = function() {
  if(!this.errorDispatched_) {
    this.errorDispatched_ = true;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ERROR)
  }
};
goog.net.XhrIo.prototype.abort = function(opt_failureCode) {
  if(this.xhr_ && this.active_) {
    this.logger_.fine(this.formatMsg_("Aborting"));
    this.active_ = false;
    this.inAbort_ = true;
    this.xhr_.abort();
    this.inAbort_ = false;
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ABORT);
    this.cleanUpXhr_()
  }
};
goog.net.XhrIo.prototype.disposeInternal = function() {
  if(this.xhr_) {
    if(this.active_) {
      this.active_ = false;
      this.inAbort_ = true;
      this.xhr_.abort();
      this.inAbort_ = false
    }
    this.cleanUpXhr_(true)
  }
  goog.net.XhrIo.superClass_.disposeInternal.call(this)
};
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if(!this.inOpen_ && !this.inSend_ && !this.inAbort_) {
    this.onReadyStateChangeEntryPoint_()
  }else {
    this.onReadyStateChangeHelper_()
  }
};
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_()
};
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function() {
  if(!this.active_) {
    return
  }
  if(typeof goog == "undefined") {
  }else {
    if(this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE && this.getStatus() == 2) {
      this.logger_.fine(this.formatMsg_("Local request error detected and ignored"))
    }else {
      if(this.inSend_ && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
        goog.Timer.defaultTimerObject.setTimeout(goog.bind(this.onReadyStateChange_, this), 0);
        return
      }
      this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE);
      if(this.isComplete()) {
        this.logger_.fine(this.formatMsg_("Request complete"));
        this.active_ = false;
        if(this.isSuccess()) {
          this.dispatchEvent(goog.net.EventType.COMPLETE);
          this.dispatchEvent(goog.net.EventType.SUCCESS)
        }else {
          this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR;
          this.lastError_ = this.getStatusText() + " [" + this.getStatus() + "]";
          this.dispatchErrors_()
        }
        this.cleanUpXhr_()
      }
    }
  }
};
goog.net.XhrIo.prototype.cleanUpXhr_ = function(opt_fromDispose) {
  if(this.xhr_) {
    var xhr = this.xhr_;
    var clearedOnReadyStateChange = this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ? goog.nullFunction : null;
    this.xhr_ = null;
    this.xhrOptions_ = null;
    if(this.timeoutId_) {
      goog.Timer.defaultTimerObject.clearTimeout(this.timeoutId_);
      this.timeoutId_ = null
    }
    if(!opt_fromDispose) {
      goog.net.xhrMonitor.pushContext(xhr);
      this.dispatchEvent(goog.net.EventType.READY);
      goog.net.xhrMonitor.popContext()
    }
    goog.net.xhrMonitor.markXhrClosed(xhr);
    try {
      xhr.onreadystatechange = clearedOnReadyStateChange
    }catch(e) {
      this.logger_.severe("Problem encountered resetting onreadystatechange: " + e.message)
    }
  }
};
goog.net.XhrIo.prototype.isActive = function() {
  return!!this.xhr_
};
goog.net.XhrIo.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE
};
goog.net.XhrIo.prototype.isSuccess = function() {
  switch(this.getStatus()) {
    case 0:
      return!this.isLastUriEffectiveSchemeHttp_();
    case goog.net.HttpStatus.OK:
    ;
    case goog.net.HttpStatus.CREATED:
    ;
    case goog.net.HttpStatus.ACCEPTED:
    ;
    case goog.net.HttpStatus.NO_CONTENT:
    ;
    case goog.net.HttpStatus.NOT_MODIFIED:
    ;
    case goog.net.HttpStatus.QUIRK_IE_NO_CONTENT:
      return true;
    default:
      return false
  }
};
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var lastUriScheme = goog.isString(this.lastUri_) ? goog.uri.utils.getScheme(this.lastUri_) : this.lastUri_.getScheme();
  if(lastUriScheme) {
    return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(lastUriScheme)
  }
  if(self.location) {
    return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(self.location.protocol)
  }else {
    return true
  }
};
goog.net.XhrIo.prototype.getReadyState = function() {
  return this.xhr_ ? this.xhr_.readyState : goog.net.XmlHttp.ReadyState.UNINITIALIZED
};
goog.net.XhrIo.prototype.getStatus = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.status : -1
  }catch(e) {
    this.logger_.warning("Can not get status: " + e.message);
    return-1
  }
};
goog.net.XhrIo.prototype.getStatusText = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.statusText : ""
  }catch(e) {
    this.logger_.fine("Can not get status: " + e.message);
    return""
  }
};
goog.net.XhrIo.prototype.getLastUri = function() {
  return String(this.lastUri_)
};
goog.net.XhrIo.prototype.getResponseText = function() {
  try {
    return this.xhr_ ? this.xhr_.responseText : ""
  }catch(e) {
    this.logger_.fine("Can not get responseText: " + e.message);
    return""
  }
};
goog.net.XhrIo.prototype.getResponseXml = function() {
  try {
    return this.xhr_ ? this.xhr_.responseXML : null
  }catch(e) {
    this.logger_.fine("Can not get responseXML: " + e.message);
    return null
  }
};
goog.net.XhrIo.prototype.getResponseJson = function(opt_xssiPrefix) {
  if(!this.xhr_) {
    return undefined
  }
  var responseText = this.xhr_.responseText;
  if(opt_xssiPrefix && responseText.indexOf(opt_xssiPrefix) == 0) {
    responseText = responseText.substring(opt_xssiPrefix.length)
  }
  return goog.json.parse(responseText)
};
goog.net.XhrIo.prototype.getResponse = function() {
  try {
    if(!this.xhr_) {
      return null
    }
    if("response" in this.xhr_) {
      return this.xhr_.response
    }
    switch(this.responseType_) {
      case goog.net.XhrIo.ResponseType.DEFAULT:
      ;
      case goog.net.XhrIo.ResponseType.TEXT:
        return this.xhr_.responseText;
      case goog.net.XhrIo.ResponseType.ARRAY_BUFFER:
        if("mozResponseArrayBuffer" in this.xhr_) {
          return this.xhr_.mozResponseArrayBuffer
        }
    }
    this.logger_.severe("Response type " + this.responseType_ + " is not " + "supported on this browser");
    return null
  }catch(e) {
    this.logger_.fine("Can not get response: " + e.message);
    return null
  }
};
goog.net.XhrIo.prototype.getResponseHeader = function(key) {
  return this.xhr_ && this.isComplete() ? this.xhr_.getResponseHeader(key) : undefined
};
goog.net.XhrIo.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.isComplete() ? this.xhr_.getAllResponseHeaders() : ""
};
goog.net.XhrIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_
};
goog.net.XhrIo.prototype.getLastError = function() {
  return goog.isString(this.lastError_) ? this.lastError_ : String(this.lastError_)
};
goog.net.XhrIo.prototype.formatMsg_ = function(msg) {
  return msg + " [" + this.lastMethod_ + " " + this.lastUri_ + " " + this.getStatus() + "]"
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = transformer(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_)
});
goog.provide("goog.net.xpc");
goog.provide("goog.net.xpc.CfgFields");
goog.provide("goog.net.xpc.ChannelStates");
goog.provide("goog.net.xpc.TransportNames");
goog.provide("goog.net.xpc.TransportTypes");
goog.provide("goog.net.xpc.UriCfgFields");
goog.require("goog.debug.Logger");
goog.net.xpc.TransportTypes = {NATIVE_MESSAGING:1, FRAME_ELEMENT_METHOD:2, IFRAME_RELAY:3, IFRAME_POLLING:4, FLASH:5, NIX:6};
goog.net.xpc.TransportNames = {1:"NativeMessagingTransport", 2:"FrameElementMethodTransport", 3:"IframeRelayTransport", 4:"IframePollingTransport", 5:"FlashTransport", 6:"NixTransport"};
goog.net.xpc.CfgFields = {CHANNEL_NAME:"cn", AUTH_TOKEN:"at", REMOTE_AUTH_TOKEN:"rat", PEER_URI:"pu", IFRAME_ID:"ifrid", TRANSPORT:"tp", LOCAL_RELAY_URI:"lru", PEER_RELAY_URI:"pru", LOCAL_POLL_URI:"lpu", PEER_POLL_URI:"ppu", PEER_HOSTNAME:"ph"};
goog.net.xpc.UriCfgFields = [goog.net.xpc.CfgFields.PEER_URI, goog.net.xpc.CfgFields.LOCAL_RELAY_URI, goog.net.xpc.CfgFields.PEER_RELAY_URI, goog.net.xpc.CfgFields.LOCAL_POLL_URI, goog.net.xpc.CfgFields.PEER_POLL_URI];
goog.net.xpc.ChannelStates = {NOT_CONNECTED:1, CONNECTED:2, CLOSED:3};
goog.net.xpc.TRANSPORT_SERVICE_ = "tp";
goog.net.xpc.SETUP = "SETUP";
goog.net.xpc.SETUP_ACK_ = "SETUP_ACK";
goog.net.xpc.channels_ = {};
goog.net.xpc.getRandomString = function(length, opt_characters) {
  var chars = opt_characters || goog.net.xpc.randomStringCharacters_;
  var charsLength = chars.length;
  var s = "";
  while(length-- > 0) {
    s += chars.charAt(Math.floor(Math.random() * charsLength))
  }
  return s
};
goog.net.xpc.randomStringCharacters_ = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
goog.net.xpc.logger = goog.debug.Logger.getLogger("goog.net.xpc");
goog.provide("goog.Uri");
goog.provide("goog.Uri.QueryData");
goog.require("goog.array");
goog.require("goog.string");
goog.require("goog.structs");
goog.require("goog.structs.Map");
goog.require("goog.uri.utils");
goog.require("goog.uri.utils.ComponentIndex");
goog.Uri = function(opt_uri, opt_ignoreCase) {
  var m;
  if(opt_uri instanceof goog.Uri) {
    this.setIgnoreCase(opt_ignoreCase == null ? opt_uri.getIgnoreCase() : opt_ignoreCase);
    this.setScheme(opt_uri.getScheme());
    this.setUserInfo(opt_uri.getUserInfo());
    this.setDomain(opt_uri.getDomain());
    this.setPort(opt_uri.getPort());
    this.setPath(opt_uri.getPath());
    this.setQueryData(opt_uri.getQueryData().clone());
    this.setFragment(opt_uri.getFragment())
  }else {
    if(opt_uri && (m = goog.uri.utils.split(String(opt_uri)))) {
      this.setIgnoreCase(!!opt_ignoreCase);
      this.setScheme(m[goog.uri.utils.ComponentIndex.SCHEME] || "", true);
      this.setUserInfo(m[goog.uri.utils.ComponentIndex.USER_INFO] || "", true);
      this.setDomain(m[goog.uri.utils.ComponentIndex.DOMAIN] || "", true);
      this.setPort(m[goog.uri.utils.ComponentIndex.PORT]);
      this.setPath(m[goog.uri.utils.ComponentIndex.PATH] || "", true);
      this.setQuery(m[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", true);
      this.setFragment(m[goog.uri.utils.ComponentIndex.FRAGMENT] || "", true)
    }else {
      this.setIgnoreCase(!!opt_ignoreCase);
      this.queryData_ = new goog.Uri.QueryData(null, this, this.ignoreCase_)
    }
  }
};
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.queryData_;
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = false;
goog.Uri.prototype.ignoreCase_ = false;
goog.Uri.prototype.toString = function() {
  if(this.cachedToString_) {
    return this.cachedToString_
  }
  var out = [];
  if(this.scheme_) {
    out.push(goog.Uri.encodeSpecialChars_(this.scheme_, goog.Uri.reDisallowedInSchemeOrUserInfo_), ":")
  }
  if(this.domain_) {
    out.push("//");
    if(this.userInfo_) {
      out.push(goog.Uri.encodeSpecialChars_(this.userInfo_, goog.Uri.reDisallowedInSchemeOrUserInfo_), "@")
    }
    out.push(goog.Uri.encodeString_(this.domain_));
    if(this.port_ != null) {
      out.push(":", String(this.getPort()))
    }
  }
  if(this.path_) {
    if(this.hasDomain() && this.path_.charAt(0) != "/") {
      out.push("/")
    }
    out.push(goog.Uri.encodeSpecialChars_(this.path_, this.path_.charAt(0) == "/" ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_))
  }
  var query = String(this.queryData_);
  if(query) {
    out.push("?", query)
  }
  if(this.fragment_) {
    out.push("#", goog.Uri.encodeSpecialChars_(this.fragment_, goog.Uri.reDisallowedInFragment_))
  }
  return this.cachedToString_ = out.join("")
};
goog.Uri.prototype.resolve = function(relativeUri) {
  var absoluteUri = this.clone();
  var overridden = relativeUri.hasScheme();
  if(overridden) {
    absoluteUri.setScheme(relativeUri.getScheme())
  }else {
    overridden = relativeUri.hasUserInfo()
  }
  if(overridden) {
    absoluteUri.setUserInfo(relativeUri.getUserInfo())
  }else {
    overridden = relativeUri.hasDomain()
  }
  if(overridden) {
    absoluteUri.setDomain(relativeUri.getDomain())
  }else {
    overridden = relativeUri.hasPort()
  }
  var path = relativeUri.getPath();
  if(overridden) {
    absoluteUri.setPort(relativeUri.getPort())
  }else {
    overridden = relativeUri.hasPath();
    if(overridden) {
      if(path.charAt(0) != "/") {
        if(this.hasDomain() && !this.hasPath()) {
          path = "/" + path
        }else {
          var lastSlashIndex = absoluteUri.getPath().lastIndexOf("/");
          if(lastSlashIndex != -1) {
            path = absoluteUri.getPath().substr(0, lastSlashIndex + 1) + path
          }
        }
      }
      path = goog.Uri.removeDotSegments(path)
    }
  }
  if(overridden) {
    absoluteUri.setPath(path)
  }else {
    overridden = relativeUri.hasQuery()
  }
  if(overridden) {
    absoluteUri.setQuery(relativeUri.getDecodedQuery())
  }else {
    overridden = relativeUri.hasFragment()
  }
  if(overridden) {
    absoluteUri.setFragment(relativeUri.getFragment())
  }
  return absoluteUri
};
goog.Uri.prototype.clone = function() {
  return goog.Uri.create(this.scheme_, this.userInfo_, this.domain_, this.port_, this.path_, this.queryData_.clone(), this.fragment_, this.ignoreCase_)
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_
};
goog.Uri.prototype.setScheme = function(newScheme, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.scheme_ = opt_decode ? goog.Uri.decodeOrEmpty_(newScheme) : newScheme;
  if(this.scheme_) {
    this.scheme_ = this.scheme_.replace(/:$/, "")
  }
  return this
};
goog.Uri.prototype.hasScheme = function() {
  return!!this.scheme_
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_
};
goog.Uri.prototype.setUserInfo = function(newUserInfo, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.userInfo_ = opt_decode ? goog.Uri.decodeOrEmpty_(newUserInfo) : newUserInfo;
  return this
};
goog.Uri.prototype.hasUserInfo = function() {
  return!!this.userInfo_
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_
};
goog.Uri.prototype.setDomain = function(newDomain, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.domain_ = opt_decode ? goog.Uri.decodeOrEmpty_(newDomain) : newDomain;
  return this
};
goog.Uri.prototype.hasDomain = function() {
  return!!this.domain_
};
goog.Uri.prototype.getPort = function() {
  return this.port_
};
goog.Uri.prototype.setPort = function(newPort) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(newPort) {
    newPort = Number(newPort);
    if(isNaN(newPort) || newPort < 0) {
      throw Error("Bad port number " + newPort);
    }
    this.port_ = newPort
  }else {
    this.port_ = null
  }
  return this
};
goog.Uri.prototype.hasPort = function() {
  return this.port_ != null
};
goog.Uri.prototype.getPath = function() {
  return this.path_
};
goog.Uri.prototype.setPath = function(newPath, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.path_ = opt_decode ? goog.Uri.decodeOrEmpty_(newPath) : newPath;
  return this
};
goog.Uri.prototype.hasPath = function() {
  return!!this.path_
};
goog.Uri.prototype.hasQuery = function() {
  return this.queryData_.toString() !== ""
};
goog.Uri.prototype.setQueryData = function(queryData, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(queryData instanceof goog.Uri.QueryData) {
    this.queryData_ = queryData;
    this.queryData_.uri_ = this;
    this.queryData_.setIgnoreCase(this.ignoreCase_)
  }else {
    if(!opt_decode) {
      queryData = goog.Uri.encodeSpecialChars_(queryData, goog.Uri.reDisallowedInQuery_)
    }
    this.queryData_ = new goog.Uri.QueryData(queryData, this, this.ignoreCase_)
  }
  return this
};
goog.Uri.prototype.setQuery = function(newQuery, opt_decode) {
  return this.setQueryData(newQuery, opt_decode)
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString()
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString()
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_
};
goog.Uri.prototype.getQuery = function() {
  return this.getEncodedQuery()
};
goog.Uri.prototype.setParameterValue = function(key, value) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.queryData_.set(key, value);
  return this
};
goog.Uri.prototype.setParameterValues = function(key, values) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  if(!goog.isArray(values)) {
    values = [String(values)]
  }
  this.queryData_.setValues(key, values);
  return this
};
goog.Uri.prototype.getParameterValues = function(name) {
  return this.queryData_.getValues(name)
};
goog.Uri.prototype.getParameterValue = function(paramName) {
  return this.queryData_.get(paramName)
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_
};
goog.Uri.prototype.setFragment = function(newFragment, opt_decode) {
  this.enforceReadOnly();
  delete this.cachedToString_;
  this.fragment_ = opt_decode ? goog.Uri.decodeOrEmpty_(newFragment) : newFragment;
  return this
};
goog.Uri.prototype.hasFragment = function() {
  return!!this.fragment_
};
goog.Uri.prototype.hasSameDomainAs = function(uri2) {
  return(!this.hasDomain() && !uri2.hasDomain() || this.getDomain() == uri2.getDomain()) && (!this.hasPort() && !uri2.hasPort() || this.getPort() == uri2.getPort())
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this
};
goog.Uri.prototype.removeParameter = function(key) {
  this.enforceReadOnly();
  this.queryData_.remove(key);
  return this
};
goog.Uri.prototype.setReadOnly = function(isReadOnly) {
  this.isReadOnly_ = isReadOnly;
  return this
};
goog.Uri.prototype.isReadOnly = function() {
  return this.isReadOnly_
};
goog.Uri.prototype.enforceReadOnly = function() {
  if(this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(ignoreCase) {
  this.ignoreCase_ = ignoreCase;
  if(this.queryData_) {
    this.queryData_.setIgnoreCase(ignoreCase)
  }
  return this
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.ignoreCase_
};
goog.Uri.parse = function(uri, opt_ignoreCase) {
  return uri instanceof goog.Uri ? uri.clone() : new goog.Uri(uri, opt_ignoreCase)
};
goog.Uri.create = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_query, opt_fragment, opt_ignoreCase) {
  var uri = new goog.Uri(null, opt_ignoreCase);
  opt_scheme && uri.setScheme(opt_scheme);
  opt_userInfo && uri.setUserInfo(opt_userInfo);
  opt_domain && uri.setDomain(opt_domain);
  opt_port && uri.setPort(opt_port);
  opt_path && uri.setPath(opt_path);
  opt_query && uri.setQueryData(opt_query);
  opt_fragment && uri.setFragment(opt_fragment);
  return uri
};
goog.Uri.resolve = function(base, rel) {
  if(!(base instanceof goog.Uri)) {
    base = goog.Uri.parse(base)
  }
  if(!(rel instanceof goog.Uri)) {
    rel = goog.Uri.parse(rel)
  }
  return base.resolve(rel)
};
goog.Uri.removeDotSegments = function(path) {
  if(path == ".." || path == ".") {
    return""
  }else {
    if(!goog.string.contains(path, "./") && !goog.string.contains(path, "/.")) {
      return path
    }else {
      var leadingSlash = goog.string.startsWith(path, "/");
      var segments = path.split("/");
      var out = [];
      for(var pos = 0;pos < segments.length;) {
        var segment = segments[pos++];
        if(segment == ".") {
          if(leadingSlash && pos == segments.length) {
            out.push("")
          }
        }else {
          if(segment == "..") {
            if(out.length > 1 || out.length == 1 && out[0] != "") {
              out.pop()
            }
            if(leadingSlash && pos == segments.length) {
              out.push("")
            }
          }else {
            out.push(segment);
            leadingSlash = true
          }
        }
      }
      return out.join("/")
    }
  }
};
goog.Uri.decodeOrEmpty_ = function(val) {
  return val ? decodeURIComponent(val) : ""
};
goog.Uri.encodeString_ = function(unescapedPart) {
  if(goog.isString(unescapedPart)) {
    return encodeURIComponent(unescapedPart)
  }
  return null
};
goog.Uri.encodeSpecialRegExp_ = /^[a-zA-Z0-9\-_.!~*'():\/;?]*$/;
goog.Uri.encodeSpecialChars_ = function(unescapedPart, extra) {
  var ret = null;
  if(goog.isString(unescapedPart)) {
    ret = unescapedPart;
    if(!goog.Uri.encodeSpecialRegExp_.test(ret)) {
      ret = encodeURI(unescapedPart)
    }
    if(ret.search(extra) >= 0) {
      ret = ret.replace(extra, goog.Uri.encodeChar_)
    }
  }
  return ret
};
goog.Uri.encodeChar_ = function(ch) {
  var n = ch.charCodeAt(0);
  return"%" + (n >> 4 & 15).toString(16) + (n & 15).toString(16)
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(uri1String, uri2String) {
  var pieces1 = goog.uri.utils.split(uri1String);
  var pieces2 = goog.uri.utils.split(uri2String);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT]
};
goog.Uri.QueryData = function(opt_query, opt_uri, opt_ignoreCase) {
  this.encodedQuery_ = opt_query || null;
  this.uri_ = opt_uri || null;
  this.ignoreCase_ = !!opt_ignoreCase
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if(!this.keyMap_) {
    this.keyMap_ = new goog.structs.Map;
    this.count_ = 0;
    if(this.encodedQuery_) {
      var pairs = this.encodedQuery_.split("&");
      for(var i = 0;i < pairs.length;i++) {
        var indexOfEquals = pairs[i].indexOf("=");
        var name = null;
        var value = null;
        if(indexOfEquals >= 0) {
          name = pairs[i].substring(0, indexOfEquals);
          value = pairs[i].substring(indexOfEquals + 1)
        }else {
          name = pairs[i]
        }
        name = goog.string.urlDecode(name);
        name = this.getKeyName_(name);
        this.add(name, value ? goog.string.urlDecode(value) : "")
      }
    }
  }
};
goog.Uri.QueryData.createFromMap = function(map, opt_uri, opt_ignoreCase) {
  var keys = goog.structs.getKeys(map);
  if(typeof keys == "undefined") {
    throw Error("Keys are undefined");
  }
  return goog.Uri.QueryData.createFromKeysValues(keys, goog.structs.getValues(map), opt_uri, opt_ignoreCase)
};
goog.Uri.QueryData.createFromKeysValues = function(keys, values, opt_uri, opt_ignoreCase) {
  if(keys.length != values.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  var queryData = new goog.Uri.QueryData(null, opt_uri, opt_ignoreCase);
  for(var i = 0;i < keys.length;i++) {
    queryData.add(keys[i], values[i])
  }
  return queryData
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.decodedQuery_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_
};
goog.Uri.QueryData.prototype.add = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  if(!this.containsKey(key)) {
    this.keyMap_.set(key, value)
  }else {
    var current = this.keyMap_.get(key);
    if(goog.isArray(current)) {
      current.push(value)
    }else {
      this.keyMap_.set(key, [current, value])
    }
  }
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.remove = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  if(this.keyMap_.containsKey(key)) {
    this.invalidateCache_();
    var old = this.keyMap_.get(key);
    if(goog.isArray(old)) {
      this.count_ -= old.length
    }else {
      this.count_--
    }
    return this.keyMap_.remove(key)
  }
  return false
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  if(this.keyMap_) {
    this.keyMap_.clear()
  }
  this.count_ = 0
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return this.count_ == 0
};
goog.Uri.QueryData.prototype.containsKey = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.containsKey(key)
};
goog.Uri.QueryData.prototype.containsValue = function(value) {
  var vals = this.getValues();
  return goog.array.contains(vals, value)
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  var vals = this.keyMap_.getValues();
  var keys = this.keyMap_.getKeys();
  var rv = [];
  for(var i = 0;i < keys.length;i++) {
    var val = vals[i];
    if(goog.isArray(val)) {
      for(var j = 0;j < val.length;j++) {
        rv.push(keys[i])
      }
    }else {
      rv.push(keys[i])
    }
  }
  return rv
};
goog.Uri.QueryData.prototype.getValues = function(opt_key) {
  this.ensureKeyMapInitialized_();
  var rv;
  if(opt_key) {
    var key = this.getKeyName_(opt_key);
    if(this.containsKey(key)) {
      var value = this.keyMap_.get(key);
      if(goog.isArray(value)) {
        return value
      }else {
        rv = [];
        rv.push(value)
      }
    }else {
      rv = []
    }
  }else {
    var vals = this.keyMap_.getValues();
    rv = [];
    for(var i = 0;i < vals.length;i++) {
      var val = vals[i];
      if(goog.isArray(val)) {
        goog.array.extend(rv, val)
      }else {
        rv.push(val)
      }
    }
  }
  return rv
};
goog.Uri.QueryData.prototype.set = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  if(this.containsKey(key)) {
    var old = this.keyMap_.get(key);
    if(goog.isArray(old)) {
      this.count_ -= old.length
    }else {
      this.count_--
    }
  }
  this.keyMap_.set(key, value);
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.get = function(key, opt_default) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  if(this.containsKey(key)) {
    var val = this.keyMap_.get(key);
    if(goog.isArray(val)) {
      return val[0]
    }else {
      return val
    }
  }else {
    return opt_default
  }
};
goog.Uri.QueryData.prototype.setValues = function(key, values) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  if(this.containsKey(key)) {
    var old = this.keyMap_.get(key);
    if(goog.isArray(old)) {
      this.count_ -= old.length
    }else {
      this.count_--
    }
  }
  if(values.length > 0) {
    this.keyMap_.set(key, values);
    this.count_ += values.length
  }
};
goog.Uri.QueryData.prototype.toString = function() {
  if(this.encodedQuery_) {
    return this.encodedQuery_
  }
  if(!this.keyMap_) {
    return""
  }
  var sb = [];
  var count = 0;
  var keys = this.keyMap_.getKeys();
  for(var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var encodedKey = goog.string.urlEncode(key);
    var val = this.keyMap_.get(key);
    if(goog.isArray(val)) {
      for(var j = 0;j < val.length;j++) {
        if(count > 0) {
          sb.push("&")
        }
        sb.push(encodedKey);
        if(val[j] !== "") {
          sb.push("=", goog.string.urlEncode(val[j]))
        }
        count++
      }
    }else {
      if(count > 0) {
        sb.push("&")
      }
      sb.push(encodedKey);
      if(val !== "") {
        sb.push("=", goog.string.urlEncode(val))
      }
      count++
    }
  }
  return this.encodedQuery_ = sb.join("")
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  if(!this.decodedQuery_) {
    this.decodedQuery_ = goog.Uri.decodeOrEmpty_(this.toString())
  }
  return this.decodedQuery_
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  delete this.decodedQuery_;
  delete this.encodedQuery_;
  if(this.uri_) {
    delete this.uri_.cachedToString_
  }
};
goog.Uri.QueryData.prototype.filterKeys = function(keys) {
  this.ensureKeyMapInitialized_();
  goog.structs.forEach(this.keyMap_, function(value, key, map) {
    if(!goog.array.contains(keys, key)) {
      this.remove(key)
    }
  }, this);
  return this
};
goog.Uri.QueryData.prototype.clone = function() {
  var rv = new goog.Uri.QueryData;
  if(this.decodedQuery_) {
    rv.decodedQuery_ = this.decodedQuery_
  }
  if(this.encodedQuery_) {
    rv.encodedQuery_ = this.encodedQuery_
  }
  if(this.keyMap_) {
    rv.keyMap_ = this.keyMap_.clone()
  }
  return rv
};
goog.Uri.QueryData.prototype.getKeyName_ = function(arg) {
  var keyName = String(arg);
  if(this.ignoreCase_) {
    keyName = keyName.toLowerCase()
  }
  return keyName
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(ignoreCase) {
  var resetKeys = ignoreCase && !this.ignoreCase_;
  if(resetKeys) {
    this.ensureKeyMapInitialized_();
    this.invalidateCache_();
    goog.structs.forEach(this.keyMap_, function(value, key, map) {
      var lowerCase = key.toLowerCase();
      if(key != lowerCase) {
        this.remove(key);
        this.add(lowerCase, value)
      }
    }, this)
  }
  this.ignoreCase_ = ignoreCase
};
goog.Uri.QueryData.prototype.extend = function(var_args) {
  for(var i = 0;i < arguments.length;i++) {
    var data = arguments[i];
    goog.structs.forEach(data, function(value, key) {
      this.add(key, value)
    }, this)
  }
};
goog.provide("goog.dom.BrowserFeature");
goog.require("goog.userAgent");
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentMode(9) || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.provide("goog.dom.TagName");
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", DD:"DD", DEL:"DEL", DFN:"DFN", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", FIELDSET:"FIELDSET", FONT:"FONT", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", 
H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", MAP:"MAP", MENU:"MENU", META:"META", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", P:"P", PARAM:"PARAM", PRE:"PRE", Q:"Q", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SELECT:"SELECT", SMALL:"SMALL", SPAN:"SPAN", STRIKE:"STRIKE", 
STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUP:"SUP", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TITLE:"TITLE", TR:"TR", TT:"TT", U:"U", UL:"UL", VAR:"VAR"};
goog.provide("goog.dom.classes");
goog.require("goog.array");
goog.dom.classes.set = function(element, className) {
  element.className = className
};
goog.dom.classes.get = function(element) {
  var className = element.className;
  return className && typeof className.split == "function" ? className.split(/\s+/) : []
};
goog.dom.classes.add = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);
  var b = goog.dom.classes.add_(classes, args);
  element.className = classes.join(" ");
  return b
};
goog.dom.classes.remove = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);
  var b = goog.dom.classes.remove_(classes, args);
  element.className = classes.join(" ");
  return b
};
goog.dom.classes.add_ = function(classes, args) {
  var rv = 0;
  for(var i = 0;i < args.length;i++) {
    if(!goog.array.contains(classes, args[i])) {
      classes.push(args[i]);
      rv++
    }
  }
  return rv == args.length
};
goog.dom.classes.remove_ = function(classes, args) {
  var rv = 0;
  for(var i = 0;i < classes.length;i++) {
    if(goog.array.contains(args, classes[i])) {
      goog.array.splice(classes, i--, 1);
      rv++
    }
  }
  return rv == args.length
};
goog.dom.classes.swap = function(element, fromClass, toClass) {
  var classes = goog.dom.classes.get(element);
  var removed = false;
  for(var i = 0;i < classes.length;i++) {
    if(classes[i] == fromClass) {
      goog.array.splice(classes, i--, 1);
      removed = true
    }
  }
  if(removed) {
    classes.push(toClass);
    element.className = classes.join(" ")
  }
  return removed
};
goog.dom.classes.addRemove = function(element, classesToRemove, classesToAdd) {
  var classes = goog.dom.classes.get(element);
  if(goog.isString(classesToRemove)) {
    goog.array.remove(classes, classesToRemove)
  }else {
    if(goog.isArray(classesToRemove)) {
      goog.dom.classes.remove_(classes, classesToRemove)
    }
  }
  if(goog.isString(classesToAdd) && !goog.array.contains(classes, classesToAdd)) {
    classes.push(classesToAdd)
  }else {
    if(goog.isArray(classesToAdd)) {
      goog.dom.classes.add_(classes, classesToAdd)
    }
  }
  element.className = classes.join(" ")
};
goog.dom.classes.has = function(element, className) {
  return goog.array.contains(goog.dom.classes.get(element), className)
};
goog.dom.classes.enable = function(element, className, enabled) {
  if(enabled) {
    goog.dom.classes.add(element, className)
  }else {
    goog.dom.classes.remove(element, className)
  }
};
goog.dom.classes.toggle = function(element, className) {
  var add = !goog.dom.classes.has(element, className);
  goog.dom.classes.enable(element, className, add);
  return add
};
goog.provide("goog.math.Coordinate");
goog.math.Coordinate = function(opt_x, opt_y) {
  this.x = goog.isDef(opt_x) ? opt_x : 0;
  this.y = goog.isDef(opt_y) ? opt_y : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
if(goog.DEBUG) {
  goog.math.Coordinate.prototype.toString = function() {
    return"(" + this.x + ", " + this.y + ")"
  }
}
goog.math.Coordinate.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.x == b.x && a.y == b.y
};
goog.math.Coordinate.distance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return dx * dx + dy * dy
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.provide("goog.math.Size");
goog.math.Size = function(width, height) {
  this.width = width;
  this.height = height
};
goog.math.Size.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.width == b.width && a.height == b.height
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
if(goog.DEBUG) {
  goog.math.Size.prototype.toString = function() {
    return"(" + this.width + " x " + this.height + ")"
  }
}
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
  return(this.width + this.height) * 2
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function(target) {
  return this.width <= target.width && this.height <= target.height
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function(s) {
  this.width *= s;
  this.height *= s;
  return this
};
goog.math.Size.prototype.scaleToFit = function(target) {
  var s = this.aspectRatio() > target.aspectRatio() ? target.width / this.width : target.height / this.height;
  return this.scale(s)
};
goog.provide("goog.dom");
goog.provide("goog.dom.DomHelper");
goog.provide("goog.dom.NodeType");
goog.require("goog.array");
goog.require("goog.dom.BrowserFeature");
goog.require("goog.dom.TagName");
goog.require("goog.dom.classes");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Size");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.dom.ASSUME_QUIRKS_MODE = false;
goog.dom.ASSUME_STANDARDS_MODE = false;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(opt_element) {
  return opt_element ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(opt_element)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.defaultDomHelper_;
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(element) {
  return goog.isString(element) ? document.getElementById(element) : element
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(document, opt_tag, opt_class, opt_el)
};
goog.dom.getElementsByClass = function(className, opt_el) {
  var parent = opt_el || document;
  if(goog.dom.canUseQuerySelector_(parent)) {
    return parent.querySelectorAll("." + className)
  }else {
    if(parent.getElementsByClassName) {
      return parent.getElementsByClassName(className)
    }
  }
  return goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el)
};
goog.dom.getElementByClass = function(className, opt_el) {
  var parent = opt_el || document;
  var retVal = null;
  if(goog.dom.canUseQuerySelector_(parent)) {
    retVal = parent.querySelector("." + className)
  }else {
    retVal = goog.dom.getElementsByClass(className, opt_el)[0]
  }
  return retVal || null
};
goog.dom.canUseQuerySelector_ = function(parent) {
  return parent.querySelectorAll && parent.querySelector && (!goog.userAgent.WEBKIT || goog.dom.isCss1CompatMode_(document) || goog.userAgent.isVersion("528"))
};
goog.dom.getElementsByTagNameAndClass_ = function(doc, opt_tag, opt_class, opt_el) {
  var parent = opt_el || doc;
  var tagName = opt_tag && opt_tag != "*" ? opt_tag.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(parent) && (tagName || opt_class)) {
    var query = tagName + (opt_class ? "." + opt_class : "");
    return parent.querySelectorAll(query)
  }
  if(opt_class && parent.getElementsByClassName) {
    var els = parent.getElementsByClassName(opt_class);
    if(tagName) {
      var arrayLike = {};
      var len = 0;
      for(var i = 0, el;el = els[i];i++) {
        if(tagName == el.nodeName) {
          arrayLike[len++] = el
        }
      }
      arrayLike.length = len;
      return arrayLike
    }else {
      return els
    }
  }
  var els = parent.getElementsByTagName(tagName || "*");
  if(opt_class) {
    var arrayLike = {};
    var len = 0;
    for(var i = 0, el;el = els[i];i++) {
      var className = el.className;
      if(typeof className.split == "function" && goog.array.contains(className.split(/\s+/), opt_class)) {
        arrayLike[len++] = el
      }
    }
    arrayLike.length = len;
    return arrayLike
  }else {
    return els
  }
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(element, properties) {
  goog.object.forEach(properties, function(val, key) {
    if(key == "style") {
      element.style.cssText = val
    }else {
      if(key == "class") {
        element.className = val
      }else {
        if(key == "for") {
          element.htmlFor = val
        }else {
          if(key in goog.dom.DIRECT_ATTRIBUTE_MAP_) {
            element.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[key], val)
          }else {
            if(goog.string.startsWith(key, "aria-")) {
              element.setAttribute(key, val)
            }else {
              element[key] = val
            }
          }
        }
      }
    }
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {"cellpadding":"cellPadding", "cellspacing":"cellSpacing", "colspan":"colSpan", "rowspan":"rowSpan", "valign":"vAlign", "height":"height", "width":"width", "usemap":"useMap", "frameborder":"frameBorder", "maxlength":"maxLength", "type":"type"};
goog.dom.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize_(opt_window || window)
};
goog.dom.getViewportSize_ = function(win) {
  var doc = win.document;
  if(goog.userAgent.WEBKIT && !goog.userAgent.isVersion("500") && !goog.userAgent.MOBILE) {
    if(typeof win.innerHeight == "undefined") {
      win = window
    }
    var innerHeight = win.innerHeight;
    var scrollHeight = win.document.documentElement.scrollHeight;
    if(win == win.top) {
      if(scrollHeight < innerHeight) {
        innerHeight -= 15
      }
    }
    return new goog.math.Size(win.innerWidth, innerHeight)
  }
  var el = goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body;
  return new goog.math.Size(el.clientWidth, el.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(win) {
  var doc = win.document;
  var height = 0;
  if(doc) {
    var vh = goog.dom.getViewportSize_(win).height;
    var body = doc.body;
    var docEl = doc.documentElement;
    if(goog.dom.isCss1CompatMode_(doc) && docEl.scrollHeight) {
      height = docEl.scrollHeight != vh ? docEl.scrollHeight : docEl.offsetHeight
    }else {
      var sh = docEl.scrollHeight;
      var oh = docEl.offsetHeight;
      if(docEl.clientHeight != oh) {
        sh = body.scrollHeight;
        oh = body.offsetHeight
      }
      if(sh > vh) {
        height = sh > oh ? sh : oh
      }else {
        height = sh < oh ? sh : oh
      }
    }
  }
  return height
};
goog.dom.getPageScroll = function(opt_window) {
  var win = opt_window || goog.global || window;
  return goog.dom.getDomHelper(win.document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(doc) {
  var el = goog.dom.getDocumentScrollElement_(doc);
  var win = goog.dom.getWindow_(doc);
  return new goog.math.Coordinate(win.pageXOffset || el.scrollLeft, win.pageYOffset || el.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(doc) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body
};
goog.dom.getWindow = function(opt_doc) {
  return opt_doc ? goog.dom.getWindow_(opt_doc) : window
};
goog.dom.getWindow_ = function(doc) {
  return doc.parentWindow || doc.defaultView
};
goog.dom.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(doc, args) {
  var tagName = args[0];
  var attributes = args[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && attributes && (attributes.name || attributes.type)) {
    var tagNameArr = ["<", tagName];
    if(attributes.name) {
      tagNameArr.push(' name="', goog.string.htmlEscape(attributes.name), '"')
    }
    if(attributes.type) {
      tagNameArr.push(' type="', goog.string.htmlEscape(attributes.type), '"');
      var clone = {};
      goog.object.extend(clone, attributes);
      attributes = clone;
      delete attributes.type
    }
    tagNameArr.push(">");
    tagName = tagNameArr.join("")
  }
  var element = doc.createElement(tagName);
  if(attributes) {
    if(goog.isString(attributes)) {
      element.className = attributes
    }else {
      if(goog.isArray(attributes)) {
        goog.dom.classes.add.apply(null, [element].concat(attributes))
      }else {
        goog.dom.setProperties(element, attributes)
      }
    }
  }
  if(args.length > 2) {
    goog.dom.append_(doc, element, args, 2)
  }
  return element
};
goog.dom.append_ = function(doc, parent, args, startIndex) {
  function childHandler(child) {
    if(child) {
      parent.appendChild(goog.isString(child) ? doc.createTextNode(child) : child)
    }
  }
  for(var i = startIndex;i < args.length;i++) {
    var arg = args[i];
    if(goog.isArrayLike(arg) && !goog.dom.isNodeLike(arg)) {
      goog.array.forEach(goog.dom.isNodeList(arg) ? goog.array.clone(arg) : arg, childHandler)
    }else {
      childHandler(arg)
    }
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(name) {
  return document.createElement(name)
};
goog.dom.createTextNode = function(content) {
  return document.createTextNode(content)
};
goog.dom.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(document, rows, columns, !!opt_fillWithNbsp)
};
goog.dom.createTable_ = function(doc, rows, columns, fillWithNbsp) {
  var rowHtml = ["<tr>"];
  for(var i = 0;i < columns;i++) {
    rowHtml.push(fillWithNbsp ? "<td>&nbsp;</td>" : "<td></td>")
  }
  rowHtml.push("</tr>");
  rowHtml = rowHtml.join("");
  var totalHtml = ["<table>"];
  for(i = 0;i < rows;i++) {
    totalHtml.push(rowHtml)
  }
  totalHtml.push("</table>");
  var elem = doc.createElement(goog.dom.TagName.DIV);
  elem.innerHTML = totalHtml.join("");
  return elem.removeChild(elem.firstChild)
};
goog.dom.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(document, htmlString)
};
goog.dom.htmlToDocumentFragment_ = function(doc, htmlString) {
  var tempDiv = doc.createElement("div");
  if(goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    tempDiv.innerHTML = "<br>" + htmlString;
    tempDiv.removeChild(tempDiv.firstChild)
  }else {
    tempDiv.innerHTML = htmlString
  }
  if(tempDiv.childNodes.length == 1) {
    return tempDiv.removeChild(tempDiv.firstChild)
  }else {
    var fragment = doc.createDocumentFragment();
    while(tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild)
    }
    return fragment
  }
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(doc) {
  if(goog.dom.COMPAT_MODE_KNOWN_) {
    return goog.dom.ASSUME_STANDARDS_MODE
  }
  return doc.compatMode == "CSS1Compat"
};
goog.dom.canHaveChildren = function(node) {
  if(node.nodeType != goog.dom.NodeType.ELEMENT) {
    return false
  }
  switch(node.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.STYLE:
      return false
  }
  return true
};
goog.dom.appendChild = function(parent, child) {
  parent.appendChild(child)
};
goog.dom.append = function(parent, var_args) {
  goog.dom.append_(goog.dom.getOwnerDocument(parent), parent, arguments, 1)
};
goog.dom.removeChildren = function(node) {
  var child;
  while(child = node.firstChild) {
    node.removeChild(child)
  }
};
goog.dom.insertSiblingBefore = function(newNode, refNode) {
  if(refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode)
  }
};
goog.dom.insertSiblingAfter = function(newNode, refNode) {
  if(refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling)
  }
};
goog.dom.insertChildAt = function(parent, child, index) {
  parent.insertBefore(child, parent.childNodes[index] || null)
};
goog.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null
};
goog.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  if(parent) {
    parent.replaceChild(newNode, oldNode)
  }
};
goog.dom.flattenElement = function(element) {
  var child, parent = element.parentNode;
  if(parent && parent.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(element.removeNode) {
      return element.removeNode(false)
    }else {
      while(child = element.firstChild) {
        parent.insertBefore(child, element)
      }
      return goog.dom.removeNode(element)
    }
  }
};
goog.dom.getChildren = function(element) {
  if(goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && element.children != undefined) {
    return element.children
  }
  return goog.array.filter(element.childNodes, function(node) {
    return node.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(node) {
  if(node.firstElementChild != undefined) {
    return node.firstElementChild
  }
  return goog.dom.getNextElementNode_(node.firstChild, true)
};
goog.dom.getLastElementChild = function(node) {
  if(node.lastElementChild != undefined) {
    return node.lastElementChild
  }
  return goog.dom.getNextElementNode_(node.lastChild, false)
};
goog.dom.getNextElementSibling = function(node) {
  if(node.nextElementSibling != undefined) {
    return node.nextElementSibling
  }
  return goog.dom.getNextElementNode_(node.nextSibling, true)
};
goog.dom.getPreviousElementSibling = function(node) {
  if(node.previousElementSibling != undefined) {
    return node.previousElementSibling
  }
  return goog.dom.getNextElementNode_(node.previousSibling, false)
};
goog.dom.getNextElementNode_ = function(node, forward) {
  while(node && node.nodeType != goog.dom.NodeType.ELEMENT) {
    node = forward ? node.nextSibling : node.previousSibling
  }
  return node
};
goog.dom.getNextNode = function(node) {
  if(!node) {
    return null
  }
  if(node.firstChild) {
    return node.firstChild
  }
  while(node && !node.nextSibling) {
    node = node.parentNode
  }
  return node ? node.nextSibling : null
};
goog.dom.getPreviousNode = function(node) {
  if(!node) {
    return null
  }
  if(!node.previousSibling) {
    return node.parentNode
  }
  node = node.previousSibling;
  while(node && node.lastChild) {
    node = node.lastChild
  }
  return node
};
goog.dom.isNodeLike = function(obj) {
  return goog.isObject(obj) && obj.nodeType > 0
};
goog.dom.isElement = function(obj) {
  return goog.isObject(obj) && obj.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(obj) {
  return goog.isObject(obj) && obj["window"] == obj
};
goog.dom.contains = function(parent, descendant) {
  if(parent.contains && descendant.nodeType == goog.dom.NodeType.ELEMENT) {
    return parent == descendant || parent.contains(descendant)
  }
  if(typeof parent.compareDocumentPosition != "undefined") {
    return parent == descendant || Boolean(parent.compareDocumentPosition(descendant) & 16)
  }
  while(descendant && parent != descendant) {
    descendant = descendant.parentNode
  }
  return descendant == parent
};
goog.dom.compareNodeOrder = function(node1, node2) {
  if(node1 == node2) {
    return 0
  }
  if(node1.compareDocumentPosition) {
    return node1.compareDocumentPosition(node2) & 2 ? 1 : -1
  }
  if("sourceIndex" in node1 || node1.parentNode && "sourceIndex" in node1.parentNode) {
    var isElement1 = node1.nodeType == goog.dom.NodeType.ELEMENT;
    var isElement2 = node2.nodeType == goog.dom.NodeType.ELEMENT;
    if(isElement1 && isElement2) {
      return node1.sourceIndex - node2.sourceIndex
    }else {
      var parent1 = node1.parentNode;
      var parent2 = node2.parentNode;
      if(parent1 == parent2) {
        return goog.dom.compareSiblingOrder_(node1, node2)
      }
      if(!isElement1 && goog.dom.contains(parent1, node2)) {
        return-1 * goog.dom.compareParentsDescendantNodeIe_(node1, node2)
      }
      if(!isElement2 && goog.dom.contains(parent2, node1)) {
        return goog.dom.compareParentsDescendantNodeIe_(node2, node1)
      }
      return(isElement1 ? node1.sourceIndex : parent1.sourceIndex) - (isElement2 ? node2.sourceIndex : parent2.sourceIndex)
    }
  }
  var doc = goog.dom.getOwnerDocument(node1);
  var range1, range2;
  range1 = doc.createRange();
  range1.selectNode(node1);
  range1.collapse(true);
  range2 = doc.createRange();
  range2.selectNode(node2);
  range2.collapse(true);
  return range1.compareBoundaryPoints(goog.global["Range"].START_TO_END, range2)
};
goog.dom.compareParentsDescendantNodeIe_ = function(textNode, node) {
  var parent = textNode.parentNode;
  if(parent == node) {
    return-1
  }
  var sibling = node;
  while(sibling.parentNode != parent) {
    sibling = sibling.parentNode
  }
  return goog.dom.compareSiblingOrder_(sibling, textNode)
};
goog.dom.compareSiblingOrder_ = function(node1, node2) {
  var s = node2;
  while(s = s.previousSibling) {
    if(s == node1) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(var_args) {
  var i, count = arguments.length;
  if(!count) {
    return null
  }else {
    if(count == 1) {
      return arguments[0]
    }
  }
  var paths = [];
  var minLength = Infinity;
  for(i = 0;i < count;i++) {
    var ancestors = [];
    var node = arguments[i];
    while(node) {
      ancestors.unshift(node);
      node = node.parentNode
    }
    paths.push(ancestors);
    minLength = Math.min(minLength, ancestors.length)
  }
  var output = null;
  for(i = 0;i < minLength;i++) {
    var first = paths[0][i];
    for(var j = 1;j < count;j++) {
      if(first != paths[j][i]) {
        return output
      }
    }
    output = first
  }
  return output
};
goog.dom.getOwnerDocument = function(node) {
  return node.nodeType == goog.dom.NodeType.DOCUMENT ? node : node.ownerDocument || node.document
};
goog.dom.getFrameContentDocument = function(frame) {
  var doc = frame.contentDocument || frame.contentWindow.document;
  return doc
};
goog.dom.getFrameContentWindow = function(frame) {
  return frame.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(frame))
};
goog.dom.setTextContent = function(element, text) {
  if("textContent" in element) {
    element.textContent = text
  }else {
    if(element.firstChild && element.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      while(element.lastChild != element.firstChild) {
        element.removeChild(element.lastChild)
      }
      element.firstChild.data = text
    }else {
      goog.dom.removeChildren(element);
      var doc = goog.dom.getOwnerDocument(element);
      element.appendChild(doc.createTextNode(text))
    }
  }
};
goog.dom.getOuterHtml = function(element) {
  if("outerHTML" in element) {
    return element.outerHTML
  }else {
    var doc = goog.dom.getOwnerDocument(element);
    var div = doc.createElement("div");
    div.appendChild(element.cloneNode(true));
    return div.innerHTML
  }
};
goog.dom.findNode = function(root, p) {
  var rv = [];
  var found = goog.dom.findNodes_(root, p, rv, true);
  return found ? rv[0] : undefined
};
goog.dom.findNodes = function(root, p) {
  var rv = [];
  goog.dom.findNodes_(root, p, rv, false);
  return rv
};
goog.dom.findNodes_ = function(root, p, rv, findOne) {
  if(root != null) {
    var child = root.firstChild;
    while(child) {
      if(p(child)) {
        rv.push(child);
        if(findOne) {
          return true
        }
      }
      if(goog.dom.findNodes_(child, p, rv, findOne)) {
        return true
      }
      child = child.nextSibling
    }
  }
  return false
};
goog.dom.TAGS_TO_IGNORE_ = {"SCRIPT":1, "STYLE":1, "HEAD":1, "IFRAME":1, "OBJECT":1};
goog.dom.PREDEFINED_TAG_VALUES_ = {"IMG":" ", "BR":"\n"};
goog.dom.isFocusableTabIndex = function(element) {
  var attrNode = element.getAttributeNode("tabindex");
  if(attrNode && attrNode.specified) {
    var index = element.tabIndex;
    return goog.isNumber(index) && index >= 0 && index < 32768
  }
  return false
};
goog.dom.setFocusableTabIndex = function(element, enable) {
  if(enable) {
    element.tabIndex = 0
  }else {
    element.tabIndex = -1;
    element.removeAttribute("tabIndex")
  }
};
goog.dom.getTextContent = function(node) {
  var textContent;
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in node) {
    textContent = goog.string.canonicalizeNewlines(node.innerText)
  }else {
    var buf = [];
    goog.dom.getTextContent_(node, buf, true);
    textContent = buf.join("")
  }
  textContent = textContent.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  textContent = textContent.replace(/\u200B/g, "");
  if(!goog.dom.BrowserFeature.CAN_USE_INNER_TEXT) {
    textContent = textContent.replace(/ +/g, " ")
  }
  if(textContent != " ") {
    textContent = textContent.replace(/^\s*/, "")
  }
  return textContent
};
goog.dom.getRawTextContent = function(node) {
  var buf = [];
  goog.dom.getTextContent_(node, buf, false);
  return buf.join("")
};
goog.dom.getTextContent_ = function(node, buf, normalizeWhitespace) {
  if(node.nodeName in goog.dom.TAGS_TO_IGNORE_) {
  }else {
    if(node.nodeType == goog.dom.NodeType.TEXT) {
      if(normalizeWhitespace) {
        buf.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ""))
      }else {
        buf.push(node.nodeValue)
      }
    }else {
      if(node.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        buf.push(goog.dom.PREDEFINED_TAG_VALUES_[node.nodeName])
      }else {
        var child = node.firstChild;
        while(child) {
          goog.dom.getTextContent_(child, buf, normalizeWhitespace);
          child = child.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(node) {
  return goog.dom.getTextContent(node).length
};
goog.dom.getNodeTextOffset = function(node, opt_offsetParent) {
  var root = opt_offsetParent || goog.dom.getOwnerDocument(node).body;
  var buf = [];
  while(node && node != root) {
    var cur = node;
    while(cur = cur.previousSibling) {
      buf.unshift(goog.dom.getTextContent(cur))
    }
    node = node.parentNode
  }
  return goog.string.trimLeft(buf.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(parent, offset, opt_result) {
  var stack = [parent], pos = 0, cur;
  while(stack.length > 0 && pos < offset) {
    cur = stack.pop();
    if(cur.nodeName in goog.dom.TAGS_TO_IGNORE_) {
    }else {
      if(cur.nodeType == goog.dom.NodeType.TEXT) {
        var text = cur.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
        pos += text.length
      }else {
        if(cur.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          pos += goog.dom.PREDEFINED_TAG_VALUES_[cur.nodeName].length
        }else {
          for(var i = cur.childNodes.length - 1;i >= 0;i--) {
            stack.push(cur.childNodes[i])
          }
        }
      }
    }
  }
  if(goog.isObject(opt_result)) {
    opt_result.remainder = cur ? cur.nodeValue.length + offset - pos - 1 : 0;
    opt_result.node = cur
  }
  return cur
};
goog.dom.isNodeList = function(val) {
  if(val && typeof val.length == "number") {
    if(goog.isObject(val)) {
      return typeof val.item == "function" || typeof val.item == "string"
    }else {
      if(goog.isFunction(val)) {
        return typeof val.item == "function"
      }
    }
  }
  return false
};
goog.dom.getAncestorByTagNameAndClass = function(element, opt_tag, opt_class) {
  var tagName = opt_tag ? opt_tag.toUpperCase() : null;
  return goog.dom.getAncestor(element, function(node) {
    return(!tagName || node.nodeName == tagName) && (!opt_class || goog.dom.classes.has(node, opt_class))
  }, true)
};
goog.dom.getAncestorByClass = function(element, opt_class) {
  return goog.dom.getAncestorByTagNameAndClass(element, null, opt_class)
};
goog.dom.getAncestor = function(element, matcher, opt_includeNode, opt_maxSearchSteps) {
  if(!opt_includeNode) {
    element = element.parentNode
  }
  var ignoreSearchSteps = opt_maxSearchSteps == null;
  var steps = 0;
  while(element && (ignoreSearchSteps || steps <= opt_maxSearchSteps)) {
    if(matcher(element)) {
      return element
    }
    element = element.parentNode;
    steps++
  }
  return null
};
goog.dom.getActiveElement = function(doc) {
  try {
    return doc && doc.activeElement
  }catch(e) {
  }
  return null
};
goog.dom.DomHelper = function(opt_document) {
  this.document_ = opt_document || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(document) {
  this.document_ = document
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(element) {
  if(goog.isString(element)) {
    return this.document_.getElementById(element)
  }else {
    return element
  }
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, opt_tag, opt_class, opt_el)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementsByClass(className, doc)
};
goog.dom.DomHelper.prototype.getElementByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementByClass(className, doc)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize(opt_window || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.Appendable;
goog.dom.DomHelper.prototype.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(name) {
  return this.document_.createElement(name)
};
goog.dom.DomHelper.prototype.createTextNode = function(content) {
  return this.document_.createTextNode(content)
};
goog.dom.DomHelper.prototype.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(this.document_, rows, columns, !!opt_fillWithNbsp)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(this.document_, htmlString)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.provide("goog.messaging.MessageChannel");
goog.messaging.MessageChannel = function() {
};
goog.messaging.MessageChannel.prototype.connect = function(opt_connectCb) {
};
goog.messaging.MessageChannel.prototype.isConnected = function() {
};
goog.messaging.MessageChannel.prototype.registerService = function(serviceName, callback, opt_objectPayload) {
};
goog.messaging.MessageChannel.prototype.registerDefaultService = function(callback) {
};
goog.messaging.MessageChannel.prototype.send = function(serviceName, payload) {
};
goog.provide("goog.messaging.AbstractChannel");
goog.require("goog.Disposable");
goog.require("goog.debug");
goog.require("goog.debug.Logger");
goog.require("goog.json");
goog.require("goog.messaging.MessageChannel");
goog.messaging.AbstractChannel = function() {
  goog.base(this);
  this.services_ = {}
};
goog.inherits(goog.messaging.AbstractChannel, goog.Disposable);
goog.messaging.AbstractChannel.prototype.defaultService_;
goog.messaging.AbstractChannel.prototype.logger = goog.debug.Logger.getLogger("goog.messaging.AbstractChannel");
goog.messaging.AbstractChannel.prototype.connect = function(opt_connectCb) {
  if(opt_connectCb) {
    opt_connectCb()
  }
};
goog.messaging.AbstractChannel.prototype.isConnected = function() {
  return true
};
goog.messaging.AbstractChannel.prototype.registerService = function(serviceName, callback, opt_objectPayload) {
  this.services_[serviceName] = {callback:callback, objectPayload:!!opt_objectPayload}
};
goog.messaging.AbstractChannel.prototype.registerDefaultService = function(callback) {
  this.defaultService_ = callback
};
goog.messaging.AbstractChannel.prototype.send = goog.abstractMethod;
goog.messaging.AbstractChannel.prototype.deliver = function(serviceName, payload) {
  var service = this.getService(serviceName, payload);
  if(!service) {
    return
  }
  var decodedPayload = this.decodePayload(serviceName, payload, service.objectPayload);
  if(goog.isDefAndNotNull(decodedPayload)) {
    service.callback(decodedPayload)
  }
};
goog.messaging.AbstractChannel.prototype.getService = function(serviceName, payload) {
  var service = this.services_[serviceName];
  if(service) {
    return service
  }else {
    if(this.defaultService_) {
      var callback = goog.partial(this.defaultService_, serviceName);
      var objectPayload = goog.isObject(payload);
      return{callback:callback, objectPayload:objectPayload}
    }
  }
  this.logger.warning('Unknown service name "' + serviceName + '"');
  return null
};
goog.messaging.AbstractChannel.prototype.decodePayload = function(serviceName, payload, objectPayload) {
  if(objectPayload && goog.isString(payload)) {
    try {
      return goog.json.parse(payload)
    }catch(err) {
      this.logger.warning("Expected JSON payload for " + serviceName + ', was "' + payload + '"');
      return null
    }
  }else {
    if(!objectPayload && !goog.isString(payload)) {
      return goog.json.serialize(payload)
    }
  }
  return payload
};
goog.messaging.AbstractChannel.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  goog.dispose(this.logger);
  delete this.logger;
  delete this.services_;
  delete this.defaultService_
};
goog.provide("goog.net.xpc.CrossPageChannelRole");
goog.net.xpc.CrossPageChannelRole = {OUTER:0, INNER:1};
goog.provide("goog.net.xpc.Transport");
goog.require("goog.Disposable");
goog.require("goog.dom");
goog.require("goog.net.xpc");
goog.net.xpc.Transport = function(opt_domHelper) {
  goog.Disposable.call(this);
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper()
};
goog.inherits(goog.net.xpc.Transport, goog.Disposable);
goog.net.xpc.Transport.prototype.transportType = 0;
goog.net.xpc.Transport.prototype.getType = function() {
  return this.transportType
};
goog.net.xpc.Transport.prototype.getWindow = function() {
  return this.domHelper_.getWindow()
};
goog.net.xpc.Transport.prototype.getName = function() {
  return goog.net.xpc.TransportNames[this.transportType] || ""
};
goog.net.xpc.Transport.prototype.transportServiceHandler = goog.abstractMethod;
goog.net.xpc.Transport.prototype.connect = goog.abstractMethod;
goog.net.xpc.Transport.prototype.send = goog.abstractMethod;
goog.provide("goog.net.xpc.FrameElementMethodTransport");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.CrossPageChannelRole");
goog.require("goog.net.xpc.Transport");
goog.net.xpc.FrameElementMethodTransport = function(channel, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.channel_ = channel;
  this.queue_ = [];
  this.deliverQueuedCb_ = goog.bind(this.deliverQueued_, this)
};
goog.inherits(goog.net.xpc.FrameElementMethodTransport, goog.net.xpc.Transport);
goog.net.xpc.FrameElementMethodTransport.prototype.transportType = goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD;
goog.net.xpc.FrameElementMethodTransport.prototype.recursive_ = false;
goog.net.xpc.FrameElementMethodTransport.prototype.timer_ = 0;
goog.net.xpc.FrameElementMethodTransport.outgoing_ = null;
goog.net.xpc.FrameElementMethodTransport.prototype.connect = function() {
  if(this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER) {
    this.iframeElm_ = this.channel_.iframeElement_;
    this.iframeElm_["XPC_toOuter"] = goog.bind(this.incoming_, this)
  }else {
    this.attemptSetup_()
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.attemptSetup_ = function() {
  var retry = true;
  try {
    if(!this.iframeElm_) {
      this.iframeElm_ = this.getWindow().frameElement
    }
    if(this.iframeElm_ && this.iframeElm_["XPC_toOuter"]) {
      this.outgoing_ = this.iframeElm_["XPC_toOuter"];
      this.iframeElm_["XPC_toOuter"]["XPC_toInner"] = goog.bind(this.incoming_, this);
      retry = false;
      this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_);
      this.channel_.notifyConnected_()
    }
  }catch(e) {
    goog.net.xpc.logger.severe("exception caught while attempting setup: " + e)
  }
  if(retry) {
    if(!this.attemptSetupCb_) {
      this.attemptSetupCb_ = goog.bind(this.attemptSetup_, this)
    }
    this.getWindow().setTimeout(this.attemptSetupCb_, 100)
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.transportServiceHandler = function(payload) {
  if(this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER && !this.channel_.isConnected() && payload == goog.net.xpc.SETUP_ACK_) {
    this.outgoing_ = this.iframeElm_["XPC_toOuter"]["XPC_toInner"];
    this.channel_.notifyConnected_()
  }else {
    throw Error("Got unexpected transport message.");
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.incoming_ = function(serviceName, payload) {
  if(!this.recursive_ && this.queue_.length == 0) {
    this.channel_.deliver_(serviceName, payload)
  }else {
    this.queue_.push({serviceName:serviceName, payload:payload});
    if(this.queue_.length == 1) {
      this.timer_ = this.getWindow().setTimeout(this.deliverQueuedCb_, 1)
    }
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.deliverQueued_ = function() {
  while(this.queue_.length) {
    var msg = this.queue_.shift();
    this.channel_.deliver_(msg.serviceName, msg.payload)
  }
};
goog.net.xpc.FrameElementMethodTransport.prototype.send = function(service, payload) {
  this.recursive_ = true;
  this.outgoing_(service, payload);
  this.recursive_ = false
};
goog.net.xpc.FrameElementMethodTransport.prototype.disposeInternal = function() {
  goog.net.xpc.FrameElementMethodTransport.superClass_.disposeInternal.call(this);
  this.outgoing_ = null;
  this.iframeElm_ = null
};
goog.provide("goog.net.xpc.IframePollingTransport");
goog.provide("goog.net.xpc.IframePollingTransport.Receiver");
goog.provide("goog.net.xpc.IframePollingTransport.Sender");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.CrossPageChannelRole");
goog.require("goog.net.xpc.Transport");
goog.require("goog.userAgent");
goog.net.xpc.IframePollingTransport = function(channel, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.channel_ = channel;
  this.sendUri_ = this.channel_.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI];
  this.rcvUri_ = this.channel_.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI];
  this.sendQueue_ = []
};
goog.inherits(goog.net.xpc.IframePollingTransport, goog.net.xpc.Transport);
goog.net.xpc.IframePollingTransport.prototype.transportType = goog.net.xpc.TransportTypes.IFRAME_POLLING;
goog.net.xpc.IframePollingTransport.prototype.sequence_ = 0;
goog.net.xpc.IframePollingTransport.prototype.waitForAck_ = false;
goog.net.xpc.IframePollingTransport.prototype.initialized_ = false;
goog.net.xpc.IframePollingTransport.IFRAME_PREFIX = "googlexpc";
goog.net.xpc.IframePollingTransport.prototype.getMsgFrameName_ = function() {
  return goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + "_" + this.channel_.name + "_msg"
};
goog.net.xpc.IframePollingTransport.prototype.getAckFrameName_ = function() {
  return goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + "_" + this.channel_.name + "_ack"
};
goog.net.xpc.IframePollingTransport.prototype.connect = function() {
  if(this.isDisposed()) {
    return
  }
  goog.net.xpc.logger.fine("transport connect called");
  if(!this.initialized_) {
    goog.net.xpc.logger.fine("initializing...");
    this.constructSenderFrames_();
    this.initialized_ = true
  }
  this.checkForeignFramesReady_()
};
goog.net.xpc.IframePollingTransport.prototype.constructSenderFrames_ = function() {
  var name = this.getMsgFrameName_();
  this.msgIframeElm_ = this.constructSenderFrame_(name);
  this.msgWinObj_ = this.getWindow().frames[name];
  name = this.getAckFrameName_();
  this.ackIframeElm_ = this.constructSenderFrame_(name);
  this.ackWinObj_ = this.getWindow().frames[name]
};
goog.net.xpc.IframePollingTransport.prototype.constructSenderFrame_ = function(id) {
  goog.net.xpc.logger.finest("constructing sender frame: " + id);
  var ifr = goog.dom.createElement("iframe");
  var s = ifr.style;
  s.position = "absolute";
  s.top = "-10px";
  s.left = "10px";
  s.width = "1px";
  s.height = "1px";
  ifr.id = ifr.name = id;
  ifr.src = this.sendUri_ + "#INITIAL";
  this.getWindow().document.body.appendChild(ifr);
  return ifr
};
goog.net.xpc.IframePollingTransport.prototype.innerPeerReconnect_ = function() {
  goog.net.xpc.logger.finest("innerPeerReconnect called");
  this.channel_.name = goog.net.xpc.getRandomString(10);
  goog.net.xpc.logger.finest("switching channels: " + this.channel_.name);
  this.deconstructSenderFrames_();
  this.initialized_ = false;
  this.reconnectFrame_ = this.constructSenderFrame_(goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + "_reconnect_" + this.channel_.name)
};
goog.net.xpc.IframePollingTransport.prototype.outerPeerReconnect_ = function() {
  goog.net.xpc.logger.finest("outerPeerReconnect called");
  var frames = this.channel_.peerWindowObject_.frames;
  var length = frames.length;
  for(var i = 0;i < length;i++) {
    var frameName;
    try {
      if(frames[i] && frames[i].name) {
        frameName = frames[i].name
      }
    }catch(e) {
    }
    if(!frameName) {
      continue
    }
    var message = frameName.split("_");
    if(message.length == 3 && message[0] == goog.net.xpc.IframePollingTransport.IFRAME_PREFIX && message[1] == "reconnect") {
      this.channel_.name = message[2];
      this.deconstructSenderFrames_();
      this.initialized_ = false;
      break
    }
  }
};
goog.net.xpc.IframePollingTransport.prototype.deconstructSenderFrames_ = function() {
  goog.net.xpc.logger.finest("deconstructSenderFrames called");
  if(this.msgIframeElm_) {
    this.msgIframeElm_.parentNode.removeChild(this.msgIframeElm_);
    this.msgIframeElm_ = null;
    this.msgWinObj_ = null
  }
  if(this.ackIframeElm_) {
    this.ackIframeElm_.parentNode.removeChild(this.ackIframeElm_);
    this.ackIframeElm_ = null;
    this.ackWinObj_ = null
  }
};
goog.net.xpc.IframePollingTransport.prototype.checkForeignFramesReady_ = function() {
  if(!(this.isRcvFrameReady_(this.getMsgFrameName_()) && this.isRcvFrameReady_(this.getAckFrameName_()))) {
    goog.net.xpc.logger.finest("foreign frames not (yet) present");
    if(this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.INNER && !this.reconnectFrame_) {
      this.innerPeerReconnect_()
    }else {
      if(this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER) {
        this.outerPeerReconnect_()
      }
    }
    this.getWindow().setTimeout(goog.bind(this.connect, this), 100)
  }else {
    goog.net.xpc.logger.fine("foreign frames present");
    this.msgReceiver_ = new goog.net.xpc.IframePollingTransport.Receiver(this, this.channel_.peerWindowObject_.frames[this.getMsgFrameName_()], goog.bind(this.processIncomingMsg, this));
    this.ackReceiver_ = new goog.net.xpc.IframePollingTransport.Receiver(this, this.channel_.peerWindowObject_.frames[this.getAckFrameName_()], goog.bind(this.processIncomingAck, this));
    this.checkLocalFramesPresent_()
  }
};
goog.net.xpc.IframePollingTransport.prototype.isRcvFrameReady_ = function(frameName) {
  goog.net.xpc.logger.finest("checking for receive frame: " + frameName);
  try {
    var winObj = this.channel_.peerWindowObject_.frames[frameName];
    if(!winObj || winObj.location.href.indexOf(this.rcvUri_) != 0) {
      return false
    }
  }catch(e) {
    return false
  }
  return true
};
goog.net.xpc.IframePollingTransport.prototype.checkLocalFramesPresent_ = function() {
  var frames = this.channel_.peerWindowObject_.frames;
  if(!(frames[this.getAckFrameName_()] && frames[this.getMsgFrameName_()])) {
    if(!this.checkLocalFramesPresentCb_) {
      this.checkLocalFramesPresentCb_ = goog.bind(this.checkLocalFramesPresent_, this)
    }
    this.getWindow().setTimeout(this.checkLocalFramesPresentCb_, 100);
    goog.net.xpc.logger.fine("local frames not (yet) present")
  }else {
    this.msgSender_ = new goog.net.xpc.IframePollingTransport.Sender(this.sendUri_, this.msgWinObj_);
    this.ackSender_ = new goog.net.xpc.IframePollingTransport.Sender(this.sendUri_, this.ackWinObj_);
    goog.net.xpc.logger.fine("local frames ready");
    this.getWindow().setTimeout(goog.bind(function() {
      this.msgSender_.send(goog.net.xpc.SETUP);
      this.sentConnectionSetup_ = true;
      this.waitForAck_ = true;
      goog.net.xpc.logger.fine("SETUP sent")
    }, this), 100)
  }
};
goog.net.xpc.IframePollingTransport.prototype.checkIfConnected_ = function() {
  if(this.sentConnectionSetupAck_ && this.rcvdConnectionSetupAck_) {
    this.channel_.notifyConnected_();
    if(this.deliveryQueue_) {
      goog.net.xpc.logger.fine("delivering queued messages " + "(" + this.deliveryQueue_.length + ")");
      for(var i = 0, m;i < this.deliveryQueue_.length;i++) {
        m = this.deliveryQueue_[i];
        this.channel_.deliver_(m.service, m.payload)
      }
      delete this.deliveryQueue_
    }
  }else {
    goog.net.xpc.logger.finest("checking if connected: " + "ack sent:" + this.sentConnectionSetupAck_ + ", ack rcvd: " + this.rcvdConnectionSetupAck_)
  }
};
goog.net.xpc.IframePollingTransport.prototype.processIncomingMsg = function(raw) {
  goog.net.xpc.logger.finest("msg received: " + raw);
  if(raw == goog.net.xpc.SETUP) {
    if(!this.ackSender_) {
      return
    }
    this.ackSender_.send(goog.net.xpc.SETUP_ACK_);
    goog.net.xpc.logger.finest("SETUP_ACK sent");
    this.sentConnectionSetupAck_ = true;
    this.checkIfConnected_()
  }else {
    if(this.channel_.isConnected() || this.sentConnectionSetupAck_) {
      var pos = raw.indexOf("|");
      var head = raw.substring(0, pos);
      var frame = raw.substring(pos + 1);
      pos = head.indexOf(",");
      if(pos == -1) {
        var seq = head;
        this.ackSender_.send("ACK:" + seq);
        this.deliverPayload_(frame)
      }else {
        var seq = head.substring(0, pos);
        this.ackSender_.send("ACK:" + seq);
        var partInfo = head.substring(pos + 1).split("/");
        var part0 = parseInt(partInfo[0], 10);
        var part1 = parseInt(partInfo[1], 10);
        if(part0 == 1) {
          this.parts_ = []
        }
        this.parts_.push(frame);
        if(part0 == part1) {
          this.deliverPayload_(this.parts_.join(""));
          delete this.parts_
        }
      }
    }else {
      goog.net.xpc.logger.warning("received msg, but channel is not connected")
    }
  }
};
goog.net.xpc.IframePollingTransport.prototype.processIncomingAck = function(msgStr) {
  goog.net.xpc.logger.finest("ack received: " + msgStr);
  if(msgStr == goog.net.xpc.SETUP_ACK_) {
    this.waitForAck_ = false;
    this.rcvdConnectionSetupAck_ = true;
    this.checkIfConnected_()
  }else {
    if(this.channel_.isConnected()) {
      if(!this.waitForAck_) {
        goog.net.xpc.logger.warning("got unexpected ack");
        return
      }
      var seq = parseInt(msgStr.split(":")[1], 10);
      if(seq == this.sequence_) {
        this.waitForAck_ = false;
        this.sendNextFrame_()
      }else {
        goog.net.xpc.logger.warning("got ack with wrong sequence")
      }
    }else {
      goog.net.xpc.logger.warning("received ack, but channel not connected")
    }
  }
};
goog.net.xpc.IframePollingTransport.prototype.sendNextFrame_ = function() {
  if(this.waitForAck_ || !this.sendQueue_.length) {
    return
  }
  var s = this.sendQueue_.shift();
  ++this.sequence_;
  this.msgSender_.send(this.sequence_ + s);
  goog.net.xpc.logger.finest("msg sent: " + this.sequence_ + s);
  this.waitForAck_ = true
};
goog.net.xpc.IframePollingTransport.prototype.deliverPayload_ = function(s) {
  var pos = s.indexOf(":");
  var service = s.substr(0, pos);
  var payload = s.substring(pos + 1);
  if(!this.channel_.isConnected()) {
    (this.deliveryQueue_ || (this.deliveryQueue_ = [])).push({service:service, payload:payload});
    goog.net.xpc.logger.finest("queued delivery")
  }else {
    this.channel_.deliver_(service, payload)
  }
};
goog.net.xpc.IframePollingTransport.prototype.MAX_FRAME_LENGTH_ = 3800;
goog.net.xpc.IframePollingTransport.prototype.send = function(service, payload) {
  var frame = service + ":" + payload;
  if(!goog.userAgent.IE || payload.length <= this.MAX_FRAME_LENGTH_) {
    this.sendQueue_.push("|" + frame)
  }else {
    var l = payload.length;
    var num = Math.ceil(l / this.MAX_FRAME_LENGTH_);
    var pos = 0;
    var i = 1;
    while(pos < l) {
      this.sendQueue_.push("," + i + "/" + num + "|" + frame.substr(pos, this.MAX_FRAME_LENGTH_));
      i++;
      pos += this.MAX_FRAME_LENGTH_
    }
  }
  this.sendNextFrame_()
};
goog.net.xpc.IframePollingTransport.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  var receivers = goog.net.xpc.IframePollingTransport.receivers_;
  goog.array.remove(receivers, this.msgReceiver_);
  goog.array.remove(receivers, this.ackReceiver_);
  this.msgReceiver_ = this.ackReceiver_ = null;
  goog.dom.removeNode(this.msgIframeElm_);
  goog.dom.removeNode(this.ackIframeElm_);
  this.msgIframeElm_ = this.ackIframeElm_ = null;
  this.msgWinObj_ = this.ackWinObj_ = null
};
goog.net.xpc.IframePollingTransport.receivers_ = [];
goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_ = 10;
goog.net.xpc.IframePollingTransport.TIME_POLL_LONG_ = 100;
goog.net.xpc.IframePollingTransport.TIME_SHORT_POLL_AFTER_ACTIVITY_ = 1E3;
goog.net.xpc.IframePollingTransport.receive_ = function() {
  var rcvd = false;
  try {
    for(var i = 0, l = goog.net.xpc.IframePollingTransport.receivers_.length;i < l;i++) {
      rcvd = rcvd || goog.net.xpc.IframePollingTransport.receivers_[i].receive()
    }
  }catch(e) {
    goog.net.xpc.logger.info("receive_() failed: " + e);
    goog.net.xpc.IframePollingTransport.receivers_[i].transport_.channel_.notifyTransportError_();
    if(!goog.net.xpc.IframePollingTransport.receivers_.length) {
      return
    }
  }
  var now = goog.now();
  if(rcvd) {
    goog.net.xpc.IframePollingTransport.lastActivity_ = now
  }
  var t = now - goog.net.xpc.IframePollingTransport.lastActivity_ < goog.net.xpc.IframePollingTransport.TIME_SHORT_POLL_AFTER_ACTIVITY_ ? goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_ : goog.net.xpc.IframePollingTransport.TIME_POLL_LONG_;
  goog.net.xpc.IframePollingTransport.rcvTimer_ = window.setTimeout(goog.net.xpc.IframePollingTransport.receiveCb_, t)
};
goog.net.xpc.IframePollingTransport.receiveCb_ = goog.bind(goog.net.xpc.IframePollingTransport.receive_, goog.net.xpc.IframePollingTransport);
goog.net.xpc.IframePollingTransport.startRcvTimer_ = function() {
  goog.net.xpc.logger.fine("starting receive-timer");
  goog.net.xpc.IframePollingTransport.lastActivity_ = goog.now();
  if(goog.net.xpc.IframePollingTransport.rcvTimer_) {
    window.clearTimeout(goog.net.xpc.IframePollingTransport.rcvTimer_)
  }
  goog.net.xpc.IframePollingTransport.rcvTimer_ = window.setTimeout(goog.net.xpc.IframePollingTransport.receiveCb_, goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_)
};
goog.net.xpc.IframePollingTransport.Sender = function(url, windowObj) {
  this.sendUri_ = url;
  this.sendFrame_ = windowObj;
  this.cycle_ = 0
};
goog.net.xpc.IframePollingTransport.Sender.prototype.send = function(payload) {
  this.cycle_ = ++this.cycle_ % 2;
  var url = this.sendUri_ + "#" + this.cycle_ + encodeURIComponent(payload);
  try {
    if(goog.userAgent.WEBKIT) {
      this.sendFrame_.location.href = url
    }else {
      this.sendFrame_.location.replace(url)
    }
  }catch(e) {
    goog.net.xpc.logger.severe("sending failed", e)
  }
  goog.net.xpc.IframePollingTransport.startRcvTimer_()
};
goog.net.xpc.IframePollingTransport.Receiver = function(transport, windowObj, callback) {
  this.transport_ = transport;
  this.rcvFrame_ = windowObj;
  this.cb_ = callback;
  this.currentLoc_ = this.rcvFrame_.location.href.split("#")[0] + "#INITIAL";
  goog.net.xpc.IframePollingTransport.receivers_.push(this);
  goog.net.xpc.IframePollingTransport.startRcvTimer_()
};
goog.net.xpc.IframePollingTransport.Receiver.prototype.receive = function() {
  var loc = this.rcvFrame_.location.href;
  if(loc != this.currentLoc_) {
    this.currentLoc_ = loc;
    var payload = loc.split("#")[1];
    if(payload) {
      payload = payload.substr(1);
      this.cb_(decodeURIComponent(payload))
    }
    return true
  }else {
    return false
  }
};
goog.provide("goog.net.xpc.IframeRelayTransport");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.Transport");
goog.require("goog.userAgent");
goog.net.xpc.IframeRelayTransport = function(channel, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.channel_ = channel;
  this.peerRelayUri_ = this.channel_.cfg_[goog.net.xpc.CfgFields.PEER_RELAY_URI];
  this.peerIframeId_ = this.channel_.cfg_[goog.net.xpc.CfgFields.IFRAME_ID];
  if(goog.userAgent.WEBKIT) {
    goog.net.xpc.IframeRelayTransport.startCleanupTimer_()
  }
};
goog.inherits(goog.net.xpc.IframeRelayTransport, goog.net.xpc.Transport);
if(goog.userAgent.WEBKIT) {
  goog.net.xpc.IframeRelayTransport.iframeRefs_ = [];
  goog.net.xpc.IframeRelayTransport.CLEANUP_INTERVAL_ = 1E3;
  goog.net.xpc.IframeRelayTransport.IFRAME_MAX_AGE_ = 3E3;
  goog.net.xpc.IframeRelayTransport.cleanupTimer_ = 0;
  goog.net.xpc.IframeRelayTransport.startCleanupTimer_ = function() {
    if(!goog.net.xpc.IframeRelayTransport.cleanupTimer_) {
      goog.net.xpc.IframeRelayTransport.cleanupTimer_ = window.setTimeout(function() {
        goog.net.xpc.IframeRelayTransport.cleanup_()
      }, goog.net.xpc.IframeRelayTransport.CLEANUP_INTERVAL_)
    }
  };
  goog.net.xpc.IframeRelayTransport.cleanup_ = function(opt_maxAge) {
    var now = goog.now();
    var maxAge = opt_maxAge || goog.net.xpc.IframeRelayTransport.IFRAME_MAX_AGE_;
    while(goog.net.xpc.IframeRelayTransport.iframeRefs_.length && now - goog.net.xpc.IframeRelayTransport.iframeRefs_[0].timestamp >= maxAge) {
      var ifr = goog.net.xpc.IframeRelayTransport.iframeRefs_.shift().iframeElement;
      goog.dom.removeNode(ifr);
      goog.net.xpc.logger.finest("iframe removed")
    }
    goog.net.xpc.IframeRelayTransport.cleanupTimer_ = window.setTimeout(goog.net.xpc.IframeRelayTransport.cleanupCb_, goog.net.xpc.IframeRelayTransport.CLEANUP_INTERVAL_)
  };
  goog.net.xpc.IframeRelayTransport.cleanupCb_ = function() {
    goog.net.xpc.IframeRelayTransport.cleanup_()
  }
}
goog.net.xpc.IframeRelayTransport.IE_PAYLOAD_MAX_SIZE_ = 1800;
goog.net.xpc.IframeRelayTransport.FragmentInfo;
goog.net.xpc.IframeRelayTransport.fragmentMap_ = {};
goog.net.xpc.IframeRelayTransport.prototype.transportType = goog.net.xpc.TransportTypes.IFRAME_RELAY;
goog.net.xpc.IframeRelayTransport.prototype.connect = function() {
  if(!this.getWindow()["xpcRelay"]) {
    this.getWindow()["xpcRelay"] = goog.net.xpc.IframeRelayTransport.receiveMessage_
  }
  this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP)
};
goog.net.xpc.IframeRelayTransport.receiveMessage_ = function(channelName, frame) {
  var pos = frame.indexOf(":");
  var header = frame.substr(0, pos);
  var payload = frame.substr(pos + 1);
  if(!goog.userAgent.IE || (pos = header.indexOf("|")) == -1) {
    var service = header
  }else {
    var service = header.substr(0, pos);
    var fragmentIdStr = header.substr(pos + 1);
    pos = fragmentIdStr.indexOf("+");
    var messageIdStr = fragmentIdStr.substr(0, pos);
    var fragmentNum = parseInt(fragmentIdStr.substr(pos + 1), 10);
    var fragmentInfo = goog.net.xpc.IframeRelayTransport.fragmentMap_[messageIdStr];
    if(!fragmentInfo) {
      fragmentInfo = goog.net.xpc.IframeRelayTransport.fragmentMap_[messageIdStr] = {fragments:[], received:0, expected:0}
    }
    if(goog.string.contains(fragmentIdStr, "++")) {
      fragmentInfo.expected = fragmentNum + 1
    }
    fragmentInfo.fragments[fragmentNum] = payload;
    fragmentInfo.received++;
    if(fragmentInfo.received != fragmentInfo.expected) {
      return
    }
    payload = fragmentInfo.fragments.join("");
    delete goog.net.xpc.IframeRelayTransport.fragmentMap_[messageIdStr]
  }
  goog.net.xpc.channels_[channelName].deliver_(service, decodeURIComponent(payload))
};
goog.net.xpc.IframeRelayTransport.prototype.transportServiceHandler = function(payload) {
  if(payload == goog.net.xpc.SETUP) {
    this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_);
    this.channel_.notifyConnected_()
  }else {
    if(payload == goog.net.xpc.SETUP_ACK_) {
      this.channel_.notifyConnected_()
    }
  }
};
goog.net.xpc.IframeRelayTransport.prototype.send = function(service, payload) {
  var encodedPayload = encodeURIComponent(payload);
  var encodedLen = encodedPayload.length;
  var maxSize = goog.net.xpc.IframeRelayTransport.IE_PAYLOAD_MAX_SIZE_;
  if(goog.userAgent.IE && encodedLen > maxSize) {
    var messageIdStr = goog.string.getRandomString();
    for(var startIndex = 0, fragmentNum = 0;startIndex < encodedLen;fragmentNum++) {
      var payloadFragment = encodedPayload.substr(startIndex, maxSize);
      startIndex += maxSize;
      var fragmentIdStr = messageIdStr + (startIndex >= encodedLen ? "++" : "+") + fragmentNum;
      this.send_(service, payloadFragment, fragmentIdStr)
    }
  }else {
    this.send_(service, encodedPayload)
  }
};
goog.net.xpc.IframeRelayTransport.prototype.send_ = function(service, encodedPayload, opt_fragmentIdStr) {
  if(goog.userAgent.IE) {
    var div = this.getWindow().document.createElement("div");
    div.innerHTML = '<iframe onload="this.xpcOnload()"></iframe>';
    var ifr = div.childNodes[0];
    div = null;
    ifr["xpcOnload"] = goog.net.xpc.IframeRelayTransport.iframeLoadHandler_
  }else {
    var ifr = this.getWindow().document.createElement("iframe");
    if(goog.userAgent.WEBKIT) {
      goog.net.xpc.IframeRelayTransport.iframeRefs_.push({timestamp:goog.now(), iframeElement:ifr})
    }else {
      goog.events.listen(ifr, "load", goog.net.xpc.IframeRelayTransport.iframeLoadHandler_)
    }
  }
  var style = ifr.style;
  style.visibility = "hidden";
  style.width = ifr.style.height = "0px";
  style.position = "absolute";
  var url = this.peerRelayUri_;
  url += "#" + this.channel_.name;
  if(this.peerIframeId_) {
    url += "," + this.peerIframeId_
  }
  url += "|" + service;
  if(opt_fragmentIdStr) {
    url += "|" + opt_fragmentIdStr
  }
  url += ":" + encodedPayload;
  ifr.src = url;
  this.getWindow().document.body.appendChild(ifr);
  goog.net.xpc.logger.finest("msg sent: " + url)
};
goog.net.xpc.IframeRelayTransport.iframeLoadHandler_ = function() {
  goog.net.xpc.logger.finest("iframe-load");
  goog.dom.removeNode(this);
  this.xpcOnload = null
};
goog.net.xpc.IframeRelayTransport.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  if(goog.userAgent.WEBKIT) {
    goog.net.xpc.IframeRelayTransport.cleanup_(0)
  }
};
goog.provide("goog.net.xpc.NativeMessagingTransport");
goog.require("goog.events");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.CrossPageChannelRole");
goog.require("goog.net.xpc.Transport");
goog.net.xpc.NativeMessagingTransport = function(channel, peerHostname, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.channel_ = channel;
  this.peerHostname_ = peerHostname || "*"
};
goog.inherits(goog.net.xpc.NativeMessagingTransport, goog.net.xpc.Transport);
goog.net.xpc.NativeMessagingTransport.prototype.initialized_ = false;
goog.net.xpc.NativeMessagingTransport.prototype.transportType = goog.net.xpc.TransportTypes.NATIVE_MESSAGING;
goog.net.xpc.NativeMessagingTransport.activeCount_ = {};
goog.net.xpc.NativeMessagingTransport.initialize_ = function(listenWindow) {
  var uid = goog.getUid(listenWindow);
  var value = goog.net.xpc.NativeMessagingTransport.activeCount_[uid];
  if(!goog.isNumber(value)) {
    value = 0
  }
  if(value == 0) {
    goog.events.listen(listenWindow.postMessage ? listenWindow : listenWindow.document, "message", goog.net.xpc.NativeMessagingTransport.messageReceived_, false, goog.net.xpc.NativeMessagingTransport)
  }
  goog.net.xpc.NativeMessagingTransport.activeCount_[uid] = value + 1
};
goog.net.xpc.NativeMessagingTransport.messageReceived_ = function(msgEvt) {
  var data = msgEvt.getBrowserEvent().data;
  if(!goog.isString(data)) {
    return false
  }
  var headDelim = data.indexOf("|");
  var serviceDelim = data.indexOf(":");
  if(headDelim == -1 || serviceDelim == -1) {
    return false
  }
  var channelName = data.substring(0, headDelim);
  var service = data.substring(headDelim + 1, serviceDelim);
  var payload = data.substring(serviceDelim + 1);
  goog.net.xpc.logger.fine("messageReceived: channel=" + channelName + ", service=" + service + ", payload=" + payload);
  var channel = goog.net.xpc.channels_[channelName];
  if(channel) {
    channel.deliver_(service, payload, msgEvt.getBrowserEvent().origin);
    return true
  }
  for(var staleChannelName in goog.net.xpc.channels_) {
    var staleChannel = goog.net.xpc.channels_[staleChannelName];
    if(staleChannel.getRole() == goog.net.xpc.CrossPageChannelRole.INNER && !staleChannel.isConnected() && service == goog.net.xpc.TRANSPORT_SERVICE_ && payload == goog.net.xpc.SETUP) {
      goog.net.xpc.logger.fine("changing channel name to " + channelName);
      staleChannel.name = channelName;
      delete goog.net.xpc.channels_[staleChannelName];
      goog.net.xpc.channels_[channelName] = staleChannel;
      staleChannel.deliver_(service, payload);
      return true
    }
  }
  goog.net.xpc.logger.info('channel name mismatch; message ignored"');
  return false
};
goog.net.xpc.NativeMessagingTransport.prototype.transportServiceHandler = function(payload) {
  switch(payload) {
    case goog.net.xpc.SETUP:
      this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_);
      break;
    case goog.net.xpc.SETUP_ACK_:
      this.channel_.notifyConnected_();
      break
  }
};
goog.net.xpc.NativeMessagingTransport.prototype.connect = function() {
  goog.net.xpc.NativeMessagingTransport.initialize_(this.getWindow());
  this.initialized_ = true;
  this.connectWithRetries_()
};
goog.net.xpc.NativeMessagingTransport.prototype.connectWithRetries_ = function() {
  if(this.channel_.isConnected() || this.isDisposed()) {
    return
  }
  this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP);
  this.getWindow().setTimeout(goog.bind(this.connectWithRetries_, this), 100)
};
goog.net.xpc.NativeMessagingTransport.prototype.send = function(service, payload) {
  var win = this.channel_.peerWindowObject_;
  if(!win) {
    goog.net.xpc.logger.fine("send(): window not ready");
    return
  }
  var obj = win.postMessage ? win : win.document;
  this.send = function(service, payload) {
    goog.net.xpc.logger.fine("send(): payload=" + payload + " to hostname=" + this.peerHostname_);
    obj.postMessage(this.channel_.name + "|" + service + ":" + payload, this.peerHostname_)
  };
  this.send(service, payload)
};
goog.net.xpc.NativeMessagingTransport.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  if(this.initialized_) {
    var listenWindow = this.getWindow();
    var uid = goog.getUid(listenWindow);
    var value = goog.net.xpc.NativeMessagingTransport.activeCount_[uid];
    goog.net.xpc.NativeMessagingTransport.activeCount_[uid] = value - 1;
    if(value == 1) {
      goog.events.unlisten(listenWindow.postMessage ? listenWindow : listenWindow.document, "message", goog.net.xpc.NativeMessagingTransport.messageReceived_, false, goog.net.xpc.NativeMessagingTransport)
    }
  }
  delete this.send
};
goog.provide("goog.net.xpc.NixTransport");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.CrossPageChannelRole");
goog.require("goog.net.xpc.Transport");
goog.require("goog.reflect");
goog.net.xpc.NixTransport = function(channel, opt_domHelper) {
  goog.base(this, opt_domHelper);
  this.channel_ = channel;
  this.authToken_ = channel[goog.net.xpc.CfgFields.AUTH_TOKEN] || "";
  this.remoteAuthToken_ = channel[goog.net.xpc.CfgFields.REMOTE_AUTH_TOKEN] || "";
  goog.net.xpc.NixTransport.conductGlobalSetup_(this.getWindow());
  this[goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE] = this.handleMessage_;
  this[goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL] = this.createChannel_
};
goog.inherits(goog.net.xpc.NixTransport, goog.net.xpc.Transport);
goog.net.xpc.NixTransport.NIX_WRAPPER = "GCXPC____NIXVBS_wrapper";
goog.net.xpc.NixTransport.NIX_GET_WRAPPER = "GCXPC____NIXVBS_get_wrapper";
goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE = "GCXPC____NIXJS_handle_message";
goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL = "GCXPC____NIXJS_create_channel";
goog.net.xpc.NixTransport.NIX_ID_FIELD = "GCXPC____NIXVBS_container";
goog.net.xpc.NixTransport.isNixSupported = function() {
  var isSupported = false;
  try {
    var oldOpener = window.opener;
    window.opener = {};
    isSupported = goog.reflect.canAccessProperty(window, "opener");
    window.opener = oldOpener
  }catch(e) {
  }
  return isSupported
};
goog.net.xpc.NixTransport.conductGlobalSetup_ = function(listenWindow) {
  if(listenWindow["nix_setup_complete"]) {
    return
  }
  var vbscript = "Class " + goog.net.xpc.NixTransport.NIX_WRAPPER + "\n " + "Private m_Transport\n" + "Private m_Auth\n" + "Public Sub SetTransport(transport)\n" + "If isEmpty(m_Transport) Then\n" + "Set m_Transport = transport\n" + "End If\n" + "End Sub\n" + "Public Sub SetAuth(auth)\n" + "If isEmpty(m_Auth) Then\n" + "m_Auth = auth\n" + "End If\n" + "End Sub\n" + "Public Function GetAuthToken()\n " + "GetAuthToken = m_Auth\n" + "End Function\n" + "Public Sub SendMessage(service, payload)\n " + 
  "Call m_Transport." + goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE + "(service, payload)\n" + "End Sub\n" + "Public Sub CreateChannel(channel)\n " + "Call m_Transport." + goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL + "(channel)\n" + "End Sub\n" + "Public Sub " + goog.net.xpc.NixTransport.NIX_ID_FIELD + "()\n " + "End Sub\n" + "End Class\n " + "Function " + goog.net.xpc.NixTransport.NIX_GET_WRAPPER + "(transport, auth)\n" + "Dim wrap\n" + "Set wrap = New " + goog.net.xpc.NixTransport.NIX_WRAPPER + 
  "\n" + "wrap.SetTransport transport\n" + "wrap.SetAuth auth\n" + "Set " + goog.net.xpc.NixTransport.NIX_GET_WRAPPER + " = wrap\n" + "End Function";
  try {
    listenWindow.execScript(vbscript, "vbscript");
    listenWindow["nix_setup_complete"] = true
  }catch(e) {
    goog.net.xpc.logger.severe("exception caught while attempting global setup: " + e)
  }
};
goog.net.xpc.NixTransport.prototype.transportType = goog.net.xpc.TransportTypes.NIX;
goog.net.xpc.NixTransport.prototype.localSetupCompleted_ = false;
goog.net.xpc.NixTransport.prototype.nixChannel_ = null;
goog.net.xpc.NixTransport.prototype.connect = function() {
  if(this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER) {
    this.attemptOuterSetup_()
  }else {
    this.attemptInnerSetup_()
  }
};
goog.net.xpc.NixTransport.prototype.attemptOuterSetup_ = function() {
  if(this.localSetupCompleted_) {
    return
  }
  var innerFrame = this.channel_.iframeElement_;
  try {
    innerFrame.contentWindow.opener = this.getWindow()[goog.net.xpc.NixTransport.NIX_GET_WRAPPER](this, this.authToken_);
    this.localSetupCompleted_ = true
  }catch(e) {
    goog.net.xpc.logger.severe("exception caught while attempting setup: " + e)
  }
  if(!this.localSetupCompleted_) {
    this.getWindow().setTimeout(goog.bind(this.attemptOuterSetup_, this), 100)
  }
};
goog.net.xpc.NixTransport.prototype.attemptInnerSetup_ = function() {
  if(this.localSetupCompleted_) {
    return
  }
  try {
    var opener = this.getWindow().opener;
    if(opener && goog.net.xpc.NixTransport.NIX_ID_FIELD in opener) {
      this.nixChannel_ = opener;
      var remoteAuthToken = this.nixChannel_["GetAuthToken"]();
      if(remoteAuthToken != this.remoteAuthToken_) {
        goog.net.xpc.logger.severe("Invalid auth token from other party");
        return
      }
      this.nixChannel_["CreateChannel"](this.getWindow()[goog.net.xpc.NixTransport.NIX_GET_WRAPPER](this, this.authToken_));
      this.localSetupCompleted_ = true;
      this.channel_.notifyConnected_()
    }
  }catch(e) {
    goog.net.xpc.logger.severe("exception caught while attempting setup: " + e);
    return
  }
  if(!this.localSetupCompleted_) {
    this.getWindow().setTimeout(goog.bind(this.attemptInnerSetup_, this), 100)
  }
};
goog.net.xpc.NixTransport.prototype.createChannel_ = function(channel) {
  if(typeof channel != "unknown" || !(goog.net.xpc.NixTransport.NIX_ID_FIELD in channel)) {
    goog.net.xpc.logger.severe("Invalid NIX channel given to createChannel_")
  }
  this.nixChannel_ = channel;
  var remoteAuthToken = this.nixChannel_["GetAuthToken"]();
  if(remoteAuthToken != this.remoteAuthToken_) {
    goog.net.xpc.logger.severe("Invalid auth token from other party");
    return
  }
  this.channel_.notifyConnected_()
};
goog.net.xpc.NixTransport.prototype.handleMessage_ = function(serviceName, payload) {
  function deliveryHandler() {
    this.channel_.deliver_(serviceName, payload)
  }
  this.getWindow().setTimeout(goog.bind(deliveryHandler, this), 1)
};
goog.net.xpc.NixTransport.prototype.send = function(service, payload) {
  if(typeof this.nixChannel_ !== "unknown") {
    goog.net.xpc.logger.severe("NIX channel not connected")
  }
  this.nixChannel_["SendMessage"](service, payload)
};
goog.net.xpc.NixTransport.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  this.nixChannel_ = null
};
goog.provide("goog.net.xpc.CrossPageChannel");
goog.require("goog.Disposable");
goog.require("goog.Uri");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.json");
goog.require("goog.messaging.AbstractChannel");
goog.require("goog.net.xpc");
goog.require("goog.net.xpc.CrossPageChannelRole");
goog.require("goog.net.xpc.FrameElementMethodTransport");
goog.require("goog.net.xpc.IframePollingTransport");
goog.require("goog.net.xpc.IframeRelayTransport");
goog.require("goog.net.xpc.NativeMessagingTransport");
goog.require("goog.net.xpc.NixTransport");
goog.require("goog.net.xpc.Transport");
goog.require("goog.userAgent");
goog.net.xpc.CrossPageChannel = function(cfg, opt_domHelper) {
  goog.base(this);
  for(var i = 0, uriField;uriField = goog.net.xpc.UriCfgFields[i];i++) {
    if(uriField in cfg && !/^https?:\/\//.test(cfg[uriField])) {
      throw Error("URI " + cfg[uriField] + " is invalid for field " + uriField);
    }
  }
  this.cfg_ = cfg;
  this.name = this.cfg_[goog.net.xpc.CfgFields.CHANNEL_NAME] || goog.net.xpc.getRandomString(10);
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();
  this.deferredDeliveries_ = [];
  cfg[goog.net.xpc.CfgFields.LOCAL_POLL_URI] = cfg[goog.net.xpc.CfgFields.LOCAL_POLL_URI] || goog.uri.utils.getHost(this.domHelper_.getWindow().location.href) + "/robots.txt";
  cfg[goog.net.xpc.CfgFields.PEER_POLL_URI] = cfg[goog.net.xpc.CfgFields.PEER_POLL_URI] || goog.uri.utils.getHost(cfg[goog.net.xpc.CfgFields.PEER_URI] || "") + "/robots.txt";
  goog.net.xpc.channels_[this.name] = this;
  goog.events.listen(window, "unload", goog.net.xpc.CrossPageChannel.disposeAll_);
  goog.net.xpc.logger.info("CrossPageChannel created: " + this.name)
};
goog.inherits(goog.net.xpc.CrossPageChannel, goog.messaging.AbstractChannel);
goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_ESCAPE_RE_ = new RegExp("^%*" + goog.net.xpc.TRANSPORT_SERVICE_ + "$");
goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_UNESCAPE_RE_ = new RegExp("^%+" + goog.net.xpc.TRANSPORT_SERVICE_ + "$");
goog.net.xpc.CrossPageChannel.prototype.transport_ = null;
goog.net.xpc.CrossPageChannel.prototype.state_ = goog.net.xpc.ChannelStates.NOT_CONNECTED;
goog.net.xpc.CrossPageChannel.prototype.isConnected = function() {
  return this.state_ == goog.net.xpc.ChannelStates.CONNECTED
};
goog.net.xpc.CrossPageChannel.prototype.peerWindowObject_ = null;
goog.net.xpc.CrossPageChannel.prototype.iframeElement_ = null;
goog.net.xpc.CrossPageChannel.prototype.setPeerWindowObject = function(peerWindowObject) {
  this.peerWindowObject_ = peerWindowObject
};
goog.net.xpc.CrossPageChannel.prototype.determineTransportType_ = function() {
  var transportType;
  if(goog.isFunction(document.postMessage) || goog.isFunction(window.postMessage) || goog.userAgent.IE && window.postMessage) {
    transportType = goog.net.xpc.TransportTypes.NATIVE_MESSAGING
  }else {
    if(goog.userAgent.GECKO) {
      transportType = goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD
    }else {
      if(goog.userAgent.IE && this.cfg_[goog.net.xpc.CfgFields.PEER_RELAY_URI]) {
        transportType = goog.net.xpc.TransportTypes.IFRAME_RELAY
      }else {
        if(goog.userAgent.IE && goog.net.xpc.NixTransport.isNixSupported()) {
          transportType = goog.net.xpc.TransportTypes.NIX
        }else {
          transportType = goog.net.xpc.TransportTypes.IFRAME_POLLING
        }
      }
    }
  }
  return transportType
};
goog.net.xpc.CrossPageChannel.prototype.createTransport_ = function() {
  if(this.transport_) {
    return
  }
  if(!this.cfg_[goog.net.xpc.CfgFields.TRANSPORT]) {
    this.cfg_[goog.net.xpc.CfgFields.TRANSPORT] = this.determineTransportType_()
  }
  switch(this.cfg_[goog.net.xpc.CfgFields.TRANSPORT]) {
    case goog.net.xpc.TransportTypes.NATIVE_MESSAGING:
      this.transport_ = new goog.net.xpc.NativeMessagingTransport(this, this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME], this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.NIX:
      this.transport_ = new goog.net.xpc.NixTransport(this, this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD:
      this.transport_ = new goog.net.xpc.FrameElementMethodTransport(this, this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.IFRAME_RELAY:
      this.transport_ = new goog.net.xpc.IframeRelayTransport(this, this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.IFRAME_POLLING:
      this.transport_ = new goog.net.xpc.IframePollingTransport(this, this.domHelper_);
      break
  }
  if(this.transport_) {
    goog.net.xpc.logger.info("Transport created: " + this.transport_.getName())
  }else {
    throw Error("CrossPageChannel: No suitable transport found!");
  }
};
goog.net.xpc.CrossPageChannel.prototype.getTransportType = function() {
  return this.transport_.getType()
};
goog.net.xpc.CrossPageChannel.prototype.getTransportName = function() {
  return this.transport_.getName()
};
goog.net.xpc.CrossPageChannel.prototype.getPeerConfiguration = function() {
  var peerCfg = {};
  peerCfg[goog.net.xpc.CfgFields.CHANNEL_NAME] = this.name;
  peerCfg[goog.net.xpc.CfgFields.TRANSPORT] = this.cfg_[goog.net.xpc.CfgFields.TRANSPORT];
  if(this.cfg_[goog.net.xpc.CfgFields.LOCAL_RELAY_URI]) {
    peerCfg[goog.net.xpc.CfgFields.PEER_RELAY_URI] = this.cfg_[goog.net.xpc.CfgFields.LOCAL_RELAY_URI]
  }
  if(this.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI]) {
    peerCfg[goog.net.xpc.CfgFields.PEER_POLL_URI] = this.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI]
  }
  if(this.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI]) {
    peerCfg[goog.net.xpc.CfgFields.LOCAL_POLL_URI] = this.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI]
  }
  return peerCfg
};
goog.net.xpc.CrossPageChannel.prototype.createPeerIframe = function(parentElm, opt_configureIframeCb, opt_addCfgParam) {
  var iframeId = this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID];
  if(!iframeId) {
    iframeId = this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID] = "xpcpeer" + goog.net.xpc.getRandomString(4)
  }
  var iframeElm = goog.dom.createElement("IFRAME");
  iframeElm.id = iframeElm.name = iframeId;
  if(opt_configureIframeCb) {
    opt_configureIframeCb(iframeElm)
  }else {
    iframeElm.style.width = iframeElm.style.height = "100%"
  }
  var peerUri = this.cfg_[goog.net.xpc.CfgFields.PEER_URI];
  if(goog.isString(peerUri)) {
    peerUri = this.cfg_[goog.net.xpc.CfgFields.PEER_URI] = new goog.Uri(peerUri)
  }
  if(opt_addCfgParam !== false) {
    peerUri.setParameterValue("xpc", goog.json.serialize(this.getPeerConfiguration()))
  }
  if(goog.userAgent.GECKO || goog.userAgent.WEBKIT) {
    this.deferConnect_ = true;
    window.setTimeout(goog.bind(function() {
      this.deferConnect_ = false;
      parentElm.appendChild(iframeElm);
      iframeElm.src = peerUri.toString();
      goog.net.xpc.logger.info("peer iframe created (" + iframeId + ")");
      if(this.connectDeferred_) {
        this.connect(this.connectCb_)
      }
    }, this), 1)
  }else {
    iframeElm.src = peerUri.toString();
    parentElm.appendChild(iframeElm);
    goog.net.xpc.logger.info("peer iframe created (" + iframeId + ")")
  }
  return iframeElm
};
goog.net.xpc.CrossPageChannel.prototype.deferConnect_ = false;
goog.net.xpc.CrossPageChannel.prototype.connectDeferred_ = false;
goog.net.xpc.CrossPageChannel.prototype.connect = function(opt_connectCb) {
  this.connectCb_ = opt_connectCb || goog.nullFunction;
  if(this.deferConnect_) {
    goog.net.xpc.logger.info("connect() deferred");
    this.connectDeferred_ = true;
    return
  }
  this.connectDeferred_ = false;
  goog.net.xpc.logger.info("connect()");
  if(this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID]) {
    this.iframeElement_ = this.domHelper_.getElement(this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID])
  }
  if(this.iframeElement_) {
    var winObj = this.iframeElement_.contentWindow;
    if(!winObj) {
      winObj = window.frames[this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID]]
    }
    this.setPeerWindowObject(winObj)
  }
  if(!this.peerWindowObject_) {
    if(window == top) {
      throw Error("CrossPageChannel: Can't connect, peer window-object not set.");
    }else {
      this.setPeerWindowObject(window.parent)
    }
  }
  this.createTransport_();
  this.transport_.connect();
  while(this.deferredDeliveries_.length > 0) {
    this.deferredDeliveries_.shift()()
  }
};
goog.net.xpc.CrossPageChannel.prototype.close = function() {
  if(!this.isConnected()) {
    return
  }
  this.state_ = goog.net.xpc.ChannelStates.CLOSED;
  this.transport_.dispose();
  this.transport_ = null;
  this.connectCb_ = null;
  this.connectDeferred_ = false;
  this.deferredDeliveries_.length = 0;
  goog.net.xpc.logger.info('Channel "' + this.name + '" closed')
};
goog.net.xpc.CrossPageChannel.prototype.notifyConnected_ = function() {
  if(this.isConnected()) {
    return
  }
  this.state_ = goog.net.xpc.ChannelStates.CONNECTED;
  goog.net.xpc.logger.info('Channel "' + this.name + '" connected');
  this.connectCb_()
};
goog.net.xpc.CrossPageChannel.prototype.notifyTransportError_ = function() {
  goog.net.xpc.logger.info("Transport Error");
  this.close()
};
goog.net.xpc.CrossPageChannel.prototype.send = function(serviceName, payload) {
  if(!this.isConnected()) {
    goog.net.xpc.logger.severe("Can't send. Channel not connected.");
    return
  }
  if(Boolean(this.peerWindowObject_.closed)) {
    goog.net.xpc.logger.severe("Peer has disappeared.");
    this.close();
    return
  }
  if(goog.isObject(payload)) {
    payload = goog.json.serialize(payload)
  }
  this.transport_.send(this.escapeServiceName_(serviceName), payload)
};
goog.net.xpc.CrossPageChannel.prototype.deliver_ = function(serviceName, payload, opt_origin) {
  if(this.connectDeferred_) {
    this.deferredDeliveries_.push(goog.bind(this.deliver_, this, serviceName, payload, opt_origin));
    return
  }
  if(!this.isMessageOriginAcceptable_(opt_origin)) {
    goog.net.xpc.logger.warning('Message received from unapproved origin "' + opt_origin + '" - rejected.');
    return
  }
  if(this.isDisposed()) {
    goog.net.xpc.logger.warning("CrossPageChannel::deliver_(): Disposed.")
  }else {
    if(!serviceName || serviceName == goog.net.xpc.TRANSPORT_SERVICE_) {
      this.transport_.transportServiceHandler(payload)
    }else {
      if(this.isConnected()) {
        this.deliver(this.unescapeServiceName_(serviceName), payload)
      }else {
        goog.net.xpc.logger.info("CrossPageChannel::deliver_(): Not connected.")
      }
    }
  }
};
goog.net.xpc.CrossPageChannel.prototype.escapeServiceName_ = function(name) {
  if(goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_ESCAPE_RE_.test(name)) {
    name = "%" + name
  }
  return name.replace(/[%:|]/g, encodeURIComponent)
};
goog.net.xpc.CrossPageChannel.prototype.unescapeServiceName_ = function(name) {
  name = name.replace(/%[0-9a-f]{2}/gi, decodeURIComponent);
  if(goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_UNESCAPE_RE_.test(name)) {
    return name.substring(1)
  }else {
    return name
  }
};
goog.net.xpc.CrossPageChannel.prototype.getRole = function() {
  return window.parent == this.peerWindowObject_ ? goog.net.xpc.CrossPageChannelRole.INNER : goog.net.xpc.CrossPageChannelRole.OUTER
};
goog.net.xpc.CrossPageChannel.prototype.isMessageOriginAcceptable_ = function(opt_origin) {
  var peerHostname = this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME];
  return goog.string.isEmptySafe(opt_origin) || goog.string.isEmptySafe(peerHostname) || opt_origin == this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME]
};
goog.net.xpc.CrossPageChannel.prototype.disposeInternal = function() {
  goog.base(this, "disposeInternal");
  this.close();
  this.peerWindowObject_ = null;
  this.iframeElement_ = null;
  delete goog.net.xpc.channels_[this.name];
  this.deferredDeliveries_.length = 0
};
goog.net.xpc.CrossPageChannel.disposeAll_ = function() {
  for(var name in goog.net.xpc.channels_) {
    var ch = goog.net.xpc.channels_[name];
    if(ch) {
      ch.dispose()
    }
  }
};
goog.provide("clojure.browser.net");
goog.require("cljs.core");
goog.require("clojure.browser.event");
goog.require("goog.net.XhrIo");
goog.require("goog.net.EventType");
goog.require("goog.net.xpc.CfgFields");
goog.require("goog.net.xpc.CrossPageChannel");
goog.require("goog.json");
clojure.browser.net._STAR_timeout_STAR_ = 1E4;
clojure.browser.net.event_types = cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__18296) {
  var vec__18297__18298 = p__18296;
  var k__18299 = cljs.core.nth.call(null, vec__18297__18298, 0, null);
  var v__18300 = cljs.core.nth.call(null, vec__18297__18298, 1, null);
  return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__18299.toLowerCase()), v__18300])
}, cljs.core.merge.call(null, cljs.core.js__GT_clj.call(null, goog.net.EventType))));
void 0;
clojure.browser.net.IConnection = {};
clojure.browser.net.connect = function() {
  var connect = null;
  var connect__1 = function(this$) {
    if(function() {
      var and__132__auto____18301 = this$;
      if(and__132__auto____18301) {
        return this$.clojure$browser$net$IConnection$connect$arity$1
      }else {
        return and__132__auto____18301
      }
    }()) {
      return this$.clojure$browser$net$IConnection$connect$arity$1(this$)
    }else {
      return function() {
        var or__138__auto____18302 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(or__138__auto____18302) {
          return or__138__auto____18302
        }else {
          var or__138__auto____18303 = clojure.browser.net.connect["_"];
          if(or__138__auto____18303) {
            return or__138__auto____18303
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$)
    }
  };
  var connect__2 = function(this$, opt1) {
    if(function() {
      var and__132__auto____18304 = this$;
      if(and__132__auto____18304) {
        return this$.clojure$browser$net$IConnection$connect$arity$2
      }else {
        return and__132__auto____18304
      }
    }()) {
      return this$.clojure$browser$net$IConnection$connect$arity$2(this$, opt1)
    }else {
      return function() {
        var or__138__auto____18305 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(or__138__auto____18305) {
          return or__138__auto____18305
        }else {
          var or__138__auto____18306 = clojure.browser.net.connect["_"];
          if(or__138__auto____18306) {
            return or__138__auto____18306
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$, opt1)
    }
  };
  var connect__3 = function(this$, opt1, opt2) {
    if(function() {
      var and__132__auto____18307 = this$;
      if(and__132__auto____18307) {
        return this$.clojure$browser$net$IConnection$connect$arity$3
      }else {
        return and__132__auto____18307
      }
    }()) {
      return this$.clojure$browser$net$IConnection$connect$arity$3(this$, opt1, opt2)
    }else {
      return function() {
        var or__138__auto____18308 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(or__138__auto____18308) {
          return or__138__auto____18308
        }else {
          var or__138__auto____18309 = clojure.browser.net.connect["_"];
          if(or__138__auto____18309) {
            return or__138__auto____18309
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$, opt1, opt2)
    }
  };
  var connect__4 = function(this$, opt1, opt2, opt3) {
    if(function() {
      var and__132__auto____18310 = this$;
      if(and__132__auto____18310) {
        return this$.clojure$browser$net$IConnection$connect$arity$4
      }else {
        return and__132__auto____18310
      }
    }()) {
      return this$.clojure$browser$net$IConnection$connect$arity$4(this$, opt1, opt2, opt3)
    }else {
      return function() {
        var or__138__auto____18311 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(or__138__auto____18311) {
          return or__138__auto____18311
        }else {
          var or__138__auto____18312 = clojure.browser.net.connect["_"];
          if(or__138__auto____18312) {
            return or__138__auto____18312
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$, opt1, opt2, opt3)
    }
  };
  connect = function(this$, opt1, opt2, opt3) {
    switch(arguments.length) {
      case 1:
        return connect__1.call(this, this$);
      case 2:
        return connect__2.call(this, this$, opt1);
      case 3:
        return connect__3.call(this, this$, opt1, opt2);
      case 4:
        return connect__4.call(this, this$, opt1, opt2, opt3)
    }
    throw"Invalid arity: " + arguments.length;
  };
  connect.cljs$lang$arity$1 = connect__1;
  connect.cljs$lang$arity$2 = connect__2;
  connect.cljs$lang$arity$3 = connect__3;
  connect.cljs$lang$arity$4 = connect__4;
  return connect
}();
clojure.browser.net.transmit = function() {
  var transmit = null;
  var transmit__2 = function(this$, opt) {
    if(function() {
      var and__132__auto____18313 = this$;
      if(and__132__auto____18313) {
        return this$.clojure$browser$net$IConnection$transmit$arity$2
      }else {
        return and__132__auto____18313
      }
    }()) {
      return this$.clojure$browser$net$IConnection$transmit$arity$2(this$, opt)
    }else {
      return function() {
        var or__138__auto____18314 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(or__138__auto____18314) {
          return or__138__auto____18314
        }else {
          var or__138__auto____18315 = clojure.browser.net.transmit["_"];
          if(or__138__auto____18315) {
            return or__138__auto____18315
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt)
    }
  };
  var transmit__3 = function(this$, opt, opt2) {
    if(function() {
      var and__132__auto____18316 = this$;
      if(and__132__auto____18316) {
        return this$.clojure$browser$net$IConnection$transmit$arity$3
      }else {
        return and__132__auto____18316
      }
    }()) {
      return this$.clojure$browser$net$IConnection$transmit$arity$3(this$, opt, opt2)
    }else {
      return function() {
        var or__138__auto____18317 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(or__138__auto____18317) {
          return or__138__auto____18317
        }else {
          var or__138__auto____18318 = clojure.browser.net.transmit["_"];
          if(or__138__auto____18318) {
            return or__138__auto____18318
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2)
    }
  };
  var transmit__4 = function(this$, opt, opt2, opt3) {
    if(function() {
      var and__132__auto____18319 = this$;
      if(and__132__auto____18319) {
        return this$.clojure$browser$net$IConnection$transmit$arity$4
      }else {
        return and__132__auto____18319
      }
    }()) {
      return this$.clojure$browser$net$IConnection$transmit$arity$4(this$, opt, opt2, opt3)
    }else {
      return function() {
        var or__138__auto____18320 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(or__138__auto____18320) {
          return or__138__auto____18320
        }else {
          var or__138__auto____18321 = clojure.browser.net.transmit["_"];
          if(or__138__auto____18321) {
            return or__138__auto____18321
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2, opt3)
    }
  };
  var transmit__5 = function(this$, opt, opt2, opt3, opt4) {
    if(function() {
      var and__132__auto____18322 = this$;
      if(and__132__auto____18322) {
        return this$.clojure$browser$net$IConnection$transmit$arity$5
      }else {
        return and__132__auto____18322
      }
    }()) {
      return this$.clojure$browser$net$IConnection$transmit$arity$5(this$, opt, opt2, opt3, opt4)
    }else {
      return function() {
        var or__138__auto____18323 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(or__138__auto____18323) {
          return or__138__auto____18323
        }else {
          var or__138__auto____18324 = clojure.browser.net.transmit["_"];
          if(or__138__auto____18324) {
            return or__138__auto____18324
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2, opt3, opt4)
    }
  };
  var transmit__6 = function(this$, opt, opt2, opt3, opt4, opt5) {
    if(function() {
      var and__132__auto____18325 = this$;
      if(and__132__auto____18325) {
        return this$.clojure$browser$net$IConnection$transmit$arity$6
      }else {
        return and__132__auto____18325
      }
    }()) {
      return this$.clojure$browser$net$IConnection$transmit$arity$6(this$, opt, opt2, opt3, opt4, opt5)
    }else {
      return function() {
        var or__138__auto____18326 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(or__138__auto____18326) {
          return or__138__auto____18326
        }else {
          var or__138__auto____18327 = clojure.browser.net.transmit["_"];
          if(or__138__auto____18327) {
            return or__138__auto____18327
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2, opt3, opt4, opt5)
    }
  };
  transmit = function(this$, opt, opt2, opt3, opt4, opt5) {
    switch(arguments.length) {
      case 2:
        return transmit__2.call(this, this$, opt);
      case 3:
        return transmit__3.call(this, this$, opt, opt2);
      case 4:
        return transmit__4.call(this, this$, opt, opt2, opt3);
      case 5:
        return transmit__5.call(this, this$, opt, opt2, opt3, opt4);
      case 6:
        return transmit__6.call(this, this$, opt, opt2, opt3, opt4, opt5)
    }
    throw"Invalid arity: " + arguments.length;
  };
  transmit.cljs$lang$arity$2 = transmit__2;
  transmit.cljs$lang$arity$3 = transmit__3;
  transmit.cljs$lang$arity$4 = transmit__4;
  transmit.cljs$lang$arity$5 = transmit__5;
  transmit.cljs$lang$arity$6 = transmit__6;
  return transmit
}();
clojure.browser.net.close = function close(this$) {
  if(function() {
    var and__132__auto____18328 = this$;
    if(and__132__auto____18328) {
      return this$.clojure$browser$net$IConnection$close$arity$1
    }else {
      return and__132__auto____18328
    }
  }()) {
    return this$.clojure$browser$net$IConnection$close$arity$1(this$)
  }else {
    return function() {
      var or__138__auto____18329 = clojure.browser.net.close[goog.typeOf.call(null, this$)];
      if(or__138__auto____18329) {
        return or__138__auto____18329
      }else {
        var or__138__auto____18330 = clojure.browser.net.close["_"];
        if(or__138__auto____18330) {
          return or__138__auto____18330
        }else {
          throw cljs.core.missing_protocol.call(null, "IConnection.close", this$);
        }
      }
    }().call(null, this$)
  }
};
void 0;
goog.net.XhrIo.prototype.clojure$browser$event$EventType$ = true;
goog.net.XhrIo.prototype.clojure$browser$event$EventType$event_types$arity$1 = function(this$) {
  return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__18331) {
    var vec__18332__18333 = p__18331;
    var k__18334 = cljs.core.nth.call(null, vec__18332__18333, 0, null);
    var v__18335 = cljs.core.nth.call(null, vec__18332__18333, 1, null);
    return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__18334.toLowerCase()), v__18335])
  }, cljs.core.merge.call(null, cljs.core.js__GT_clj.call(null, goog.net.EventType))))
};
goog.net.XhrIo.prototype.clojure$browser$net$IConnection$ = true;
goog.net.XhrIo.prototype.clojure$browser$net$IConnection$transmit$arity$2 = function(this$, uri) {
  return clojure.browser.net.transmit.call(null, this$, uri, "GET", null, null, clojure.browser.net._STAR_timeout_STAR_)
};
goog.net.XhrIo.prototype.clojure$browser$net$IConnection$transmit$arity$3 = function(this$, uri, method) {
  return clojure.browser.net.transmit.call(null, this$, uri, method, null, null, clojure.browser.net._STAR_timeout_STAR_)
};
goog.net.XhrIo.prototype.clojure$browser$net$IConnection$transmit$arity$4 = function(this$, uri, method, content) {
  return clojure.browser.net.transmit.call(null, this$, uri, method, content, null, clojure.browser.net._STAR_timeout_STAR_)
};
goog.net.XhrIo.prototype.clojure$browser$net$IConnection$transmit$arity$5 = function(this$, uri, method, content, headers) {
  return clojure.browser.net.transmit.call(null, this$, uri, method, content, headers, clojure.browser.net._STAR_timeout_STAR_)
};
goog.net.XhrIo.prototype.clojure$browser$net$IConnection$transmit$arity$6 = function(this$, uri, method, content, headers, timeout) {
  this$.setTimeoutInterval(timeout);
  return this$.send(uri, method, content, headers)
};
clojure.browser.net.xpc_config_fields = cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__18336) {
  var vec__18337__18338 = p__18336;
  var k__18339 = cljs.core.nth.call(null, vec__18337__18338, 0, null);
  var v__18340 = cljs.core.nth.call(null, vec__18337__18338, 1, null);
  return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__18339.toLowerCase()), v__18340])
}, cljs.core.js__GT_clj.call(null, goog.net.xpc.CfgFields)));
clojure.browser.net.xhr_connection = function xhr_connection() {
  return new goog.net.XhrIo
};
void 0;
clojure.browser.net.ICrossPageChannel = {};
clojure.browser.net.register_service = function() {
  var register_service = null;
  var register_service__3 = function(this$, service_name, fn) {
    if(function() {
      var and__132__auto____18341 = this$;
      if(and__132__auto____18341) {
        return this$.clojure$browser$net$ICrossPageChannel$register_service$arity$3
      }else {
        return and__132__auto____18341
      }
    }()) {
      return this$.clojure$browser$net$ICrossPageChannel$register_service$arity$3(this$, service_name, fn)
    }else {
      return function() {
        var or__138__auto____18342 = clojure.browser.net.register_service[goog.typeOf.call(null, this$)];
        if(or__138__auto____18342) {
          return or__138__auto____18342
        }else {
          var or__138__auto____18343 = clojure.browser.net.register_service["_"];
          if(or__138__auto____18343) {
            return or__138__auto____18343
          }else {
            throw cljs.core.missing_protocol.call(null, "ICrossPageChannel.register-service", this$);
          }
        }
      }().call(null, this$, service_name, fn)
    }
  };
  var register_service__4 = function(this$, service_name, fn, encode_json_QMARK_) {
    if(function() {
      var and__132__auto____18344 = this$;
      if(and__132__auto____18344) {
        return this$.clojure$browser$net$ICrossPageChannel$register_service$arity$4
      }else {
        return and__132__auto____18344
      }
    }()) {
      return this$.clojure$browser$net$ICrossPageChannel$register_service$arity$4(this$, service_name, fn, encode_json_QMARK_)
    }else {
      return function() {
        var or__138__auto____18345 = clojure.browser.net.register_service[goog.typeOf.call(null, this$)];
        if(or__138__auto____18345) {
          return or__138__auto____18345
        }else {
          var or__138__auto____18346 = clojure.browser.net.register_service["_"];
          if(or__138__auto____18346) {
            return or__138__auto____18346
          }else {
            throw cljs.core.missing_protocol.call(null, "ICrossPageChannel.register-service", this$);
          }
        }
      }().call(null, this$, service_name, fn, encode_json_QMARK_)
    }
  };
  register_service = function(this$, service_name, fn, encode_json_QMARK_) {
    switch(arguments.length) {
      case 3:
        return register_service__3.call(this, this$, service_name, fn);
      case 4:
        return register_service__4.call(this, this$, service_name, fn, encode_json_QMARK_)
    }
    throw"Invalid arity: " + arguments.length;
  };
  register_service.cljs$lang$arity$3 = register_service__3;
  register_service.cljs$lang$arity$4 = register_service__4;
  return register_service
}();
void 0;
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$ = true;
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$connect$arity$1 = function(this$) {
  return clojure.browser.net.connect.call(null, this$, null)
};
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$connect$arity$2 = function(this$, on_connect_fn) {
  return this$.connect(on_connect_fn)
};
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$connect$arity$3 = function(this$, on_connect_fn, config_iframe_fn) {
  return clojure.browser.net.connect.call(null, this$, on_connect_fn, config_iframe_fn, document.body)
};
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$connect$arity$4 = function(this$, on_connect_fn, config_iframe_fn, iframe_parent) {
  this$.createPeerIframe(iframe_parent, config_iframe_fn);
  return this$.connect(on_connect_fn)
};
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$transmit$arity$3 = function(this$, service_name, payload) {
  return this$.send(cljs.core.name.call(null, service_name), payload)
};
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$IConnection$close$arity$1 = function(this$) {
  return this$.close(cljs.core.List.EMPTY)
};
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$ICrossPageChannel$ = true;
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$ICrossPageChannel$register_service$arity$3 = function(this$, service_name, fn) {
  return clojure.browser.net.register_service.call(null, this$, service_name, fn, false)
};
goog.net.xpc.CrossPageChannel.prototype.clojure$browser$net$ICrossPageChannel$register_service$arity$4 = function(this$, service_name, fn, encode_json_QMARK_) {
  return this$.registerService(cljs.core.name.call(null, service_name), fn, encode_json_QMARK_)
};
clojure.browser.net.xpc_connection = function() {
  var xpc_connection = null;
  var xpc_connection__0 = function() {
    var temp__324__auto____18347 = (new goog.Uri(window.location.href)).getParameterValue("xpc");
    if(cljs.core.truth_(temp__324__auto____18347)) {
      var config__18348 = temp__324__auto____18347;
      return new goog.net.xpc.CrossPageChannel(goog.json.parse.call(null, config__18348))
    }else {
      return null
    }
  };
  var xpc_connection__1 = function(config) {
    return new goog.net.xpc.CrossPageChannel(cljs.core.reduce.call(null, function(sum, p__18349) {
      var vec__18350__18351 = p__18349;
      var k__18352 = cljs.core.nth.call(null, vec__18350__18351, 0, null);
      var v__18353 = cljs.core.nth.call(null, vec__18350__18351, 1, null);
      var temp__317__auto____18354 = cljs.core.get.call(null, clojure.browser.net.xpc_config_fields, k__18352);
      if(cljs.core.truth_(temp__317__auto____18354)) {
        var field__18355 = temp__317__auto____18354;
        var G__18356__18357 = sum;
        G__18356__18357[field__18355] = v__18353;
        return G__18356__18357
      }else {
        return sum
      }
    }, {}, config))
  };
  xpc_connection = function(config) {
    switch(arguments.length) {
      case 0:
        return xpc_connection__0.call(this);
      case 1:
        return xpc_connection__1.call(this, config)
    }
    throw"Invalid arity: " + arguments.length;
  };
  xpc_connection.cljs$lang$arity$0 = xpc_connection__0;
  xpc_connection.cljs$lang$arity$1 = xpc_connection__1;
  return xpc_connection
}();
goog.provide("clojure.browser.repl");
goog.require("cljs.core");
goog.require("clojure.browser.net");
goog.require("clojure.browser.event");
clojure.browser.repl.xpc_connection = cljs.core.atom.call(null, null);
clojure.browser.repl.repl_print = function repl_print(data) {
  var temp__317__auto____18286 = cljs.core.deref.call(null, clojure.browser.repl.xpc_connection);
  if(cljs.core.truth_(temp__317__auto____18286)) {
    var conn__18287 = temp__317__auto____18286;
    return clojure.browser.net.transmit.call(null, conn__18287, "\ufdd0'print", cljs.core.pr_str.call(null, data))
  }else {
    return null
  }
};
clojure.browser.repl.evaluate_javascript = function evaluate_javascript(conn, block) {
  var result__18290 = function() {
    try {
      return cljs.core.ObjMap.fromObject(["\ufdd0'status", "\ufdd0'value"], {"\ufdd0'status":"\ufdd0'success", "\ufdd0'value":[cljs.core.str(eval(block))].join("")})
    }catch(e18288) {
      if(cljs.core.instance_QMARK_.call(null, Error, e18288)) {
        var e__18289 = e18288;
        return cljs.core.ObjMap.fromObject(["\ufdd0'status", "\ufdd0'value", "\ufdd0'stacktrace"], {"\ufdd0'status":"\ufdd0'exception", "\ufdd0'value":cljs.core.pr_str.call(null, e__18289), "\ufdd0'stacktrace":cljs.core.truth_(e__18289.hasOwnProperty("stack")) ? e__18289.stack : "No stacktrace available."})
      }else {
        if("\ufdd0'else") {
          throw e18288;
        }else {
          return null
        }
      }
    }
  }();
  return cljs.core.pr_str.call(null, result__18290)
};
clojure.browser.repl.send_result = function send_result(connection, url, data) {
  return clojure.browser.net.transmit.call(null, connection, url, "POST", data, null, 0)
};
clojure.browser.repl.send_print = function() {
  var send_print = null;
  var send_print__2 = function(url, data) {
    return send_print.call(null, url, data, 0)
  };
  var send_print__3 = function(url, data, n) {
    var conn__18291 = clojure.browser.net.xhr_connection.call(null);
    clojure.browser.event.listen.call(null, conn__18291, "\ufdd0'error", function(_) {
      if(n < 10) {
        return send_print.call(null, url, data, n + 1)
      }else {
        return console.log([cljs.core.str("Could not send "), cljs.core.str(data), cljs.core.str(" after "), cljs.core.str(n), cljs.core.str(" attempts.")].join(""))
      }
    });
    return clojure.browser.net.transmit.call(null, conn__18291, url, "POST", data, null, 0)
  };
  send_print = function(url, data, n) {
    switch(arguments.length) {
      case 2:
        return send_print__2.call(this, url, data);
      case 3:
        return send_print__3.call(this, url, data, n)
    }
    throw"Invalid arity: " + arguments.length;
  };
  send_print.cljs$lang$arity$2 = send_print__2;
  send_print.cljs$lang$arity$3 = send_print__3;
  return send_print
}();
clojure.browser.repl.order = cljs.core.atom.call(null, 0);
clojure.browser.repl.wrap_message = function wrap_message(t, data) {
  return cljs.core.pr_str.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'type", "\ufdd0'content", "\ufdd0'order"], {"\ufdd0'type":t, "\ufdd0'content":data, "\ufdd0'order":cljs.core.swap_BANG_.call(null, clojure.browser.repl.order, cljs.core.inc)}))
};
clojure.browser.repl.start_evaluator = function start_evaluator(url) {
  var temp__317__auto____18292 = clojure.browser.net.xpc_connection.call(null);
  if(cljs.core.truth_(temp__317__auto____18292)) {
    var repl_connection__18293 = temp__317__auto____18292;
    var connection__18294 = clojure.browser.net.xhr_connection.call(null);
    clojure.browser.event.listen.call(null, connection__18294, "\ufdd0'success", function(e) {
      return clojure.browser.net.transmit.call(null, repl_connection__18293, "\ufdd0'evaluate-javascript", e.currentTarget.getResponseText(cljs.core.List.EMPTY))
    });
    clojure.browser.net.register_service.call(null, repl_connection__18293, "\ufdd0'send-result", function(data) {
      return clojure.browser.repl.send_result.call(null, connection__18294, url, clojure.browser.repl.wrap_message.call(null, "\ufdd0'result", data))
    });
    clojure.browser.net.register_service.call(null, repl_connection__18293, "\ufdd0'print", function(data) {
      return clojure.browser.repl.send_print.call(null, url, clojure.browser.repl.wrap_message.call(null, "\ufdd0'print", data))
    });
    clojure.browser.net.connect.call(null, repl_connection__18293, cljs.core.constantly.call(null, null));
    return setTimeout(function() {
      return clojure.browser.repl.send_result.call(null, connection__18294, url, clojure.browser.repl.wrap_message.call(null, "\ufdd0'ready", "ready"))
    }, 50)
  }else {
    return alert("No 'xpc' param provided to child iframe.")
  }
};
clojure.browser.repl.connect = function connect(repl_server_url) {
  var repl_connection__18295 = clojure.browser.net.xpc_connection.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'peer_uri"], {"\ufdd0'peer_uri":repl_server_url}));
  cljs.core.swap_BANG_.call(null, clojure.browser.repl.xpc_connection, cljs.core.constantly.call(null, repl_connection__18295));
  clojure.browser.net.register_service.call(null, repl_connection__18295, "\ufdd0'evaluate-javascript", function(js) {
    return clojure.browser.net.transmit.call(null, repl_connection__18295, "\ufdd0'send-result", clojure.browser.repl.evaluate_javascript.call(null, repl_connection__18295, js))
  });
  return clojure.browser.net.connect.call(null, repl_connection__18295, cljs.core.constantly.call(null, null), function(iframe) {
    return iframe.style.display = "none"
  })
};
goog.provide("jayq.util");
goog.require("cljs.core");
jayq.util.map__GT_js = function map__GT_js(m) {
  var out__6739 = {};
  var G__6740__6741 = cljs.core.seq.call(null, m);
  if(cljs.core.truth_(G__6740__6741)) {
    var G__6743__6745 = cljs.core.first.call(null, G__6740__6741);
    var vec__6744__6746 = G__6743__6745;
    var k__6747 = cljs.core.nth.call(null, vec__6744__6746, 0, null);
    var v__6748 = cljs.core.nth.call(null, vec__6744__6746, 1, null);
    var G__6740__6749 = G__6740__6741;
    var G__6743__6750 = G__6743__6745;
    var G__6740__6751 = G__6740__6749;
    while(true) {
      var vec__6752__6753 = G__6743__6750;
      var k__6754 = cljs.core.nth.call(null, vec__6752__6753, 0, null);
      var v__6755 = cljs.core.nth.call(null, vec__6752__6753, 1, null);
      var G__6740__6756 = G__6740__6751;
      out__6739[cljs.core.name.call(null, k__6754)] = v__6755;
      var temp__324__auto____6757 = cljs.core.next.call(null, G__6740__6756);
      if(cljs.core.truth_(temp__324__auto____6757)) {
        var G__6740__6758 = temp__324__auto____6757;
        var G__6759 = cljs.core.first.call(null, G__6740__6758);
        var G__6760 = G__6740__6758;
        G__6743__6750 = G__6759;
        G__6740__6751 = G__6760;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return out__6739
};
jayq.util.wait = function wait(ms, func) {
  return setTimeout(func, ms)
};
jayq.util.log = function() {
  var log__delegate = function(v, text) {
    var vs__6761 = cljs.core.string_QMARK_.call(null, v) ? cljs.core.apply.call(null, cljs.core.str, v, text) : v;
    return console.log(vs__6761)
  };
  var log = function(v, var_args) {
    var text = null;
    if(goog.isDef(var_args)) {
      text = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return log__delegate.call(this, v, text)
  };
  log.cljs$lang$maxFixedArity = 1;
  log.cljs$lang$applyTo = function(arglist__6762) {
    var v = cljs.core.first(arglist__6762);
    var text = cljs.core.rest(arglist__6762);
    return log__delegate(v, text)
  };
  log.cljs$lang$arity$variadic = log__delegate;
  return log
}();
jayq.util.clj__GT_js = function clj__GT_js(x) {
  if(cljs.core.string_QMARK_.call(null, x)) {
    return x
  }else {
    if(cljs.core.keyword_QMARK_.call(null, x)) {
      return cljs.core.name.call(null, x)
    }else {
      if(cljs.core.map_QMARK_.call(null, x)) {
        return cljs.core.reduce.call(null, function(m, p__6763) {
          var vec__6764__6765 = p__6763;
          var k__6766 = cljs.core.nth.call(null, vec__6764__6765, 0, null);
          var v__6767 = cljs.core.nth.call(null, vec__6764__6765, 1, null);
          return cljs.core.assoc.call(null, m, clj__GT_js.call(null, k__6766), clj__GT_js.call(null, v__6767))
        }, cljs.core.ObjMap.fromObject([], {}), x).strobj
      }else {
        if(cljs.core.coll_QMARK_.call(null, x)) {
          return cljs.core.apply.call(null, cljs.core.array, cljs.core.map.call(null, clj__GT_js, x))
        }else {
          if("\ufdd0'else") {
            return x
          }else {
            return null
          }
        }
      }
    }
  }
};
goog.provide("jayq.core");
goog.require("cljs.core");
goog.require("jayq.util");
goog.require("clojure.string");
jayq.core.crate_meta = function crate_meta(func) {
  return func.prototype._crateGroup
};
jayq.core.__GT_selector = function __GT_selector(sel) {
  if(cljs.core.string_QMARK_.call(null, sel)) {
    return sel
  }else {
    if(cljs.core.fn_QMARK_.call(null, sel)) {
      var temp__317__auto____6631 = jayq.core.crate_meta.call(null, sel);
      if(cljs.core.truth_(temp__317__auto____6631)) {
        var cm__6632 = temp__317__auto____6631;
        return[cljs.core.str("[crateGroup="), cljs.core.str(cm__6632), cljs.core.str("]")].join("")
      }else {
        return sel
      }
    }else {
      if(cljs.core.keyword_QMARK_.call(null, sel)) {
        return cljs.core.name.call(null, sel)
      }else {
        if("\ufdd0'else") {
          return sel
        }else {
          return null
        }
      }
    }
  }
};
jayq.core.$ = function() {
  var $__delegate = function(sel, p__6633) {
    var vec__6634__6635 = p__6633;
    var context__6636 = cljs.core.nth.call(null, vec__6634__6635, 0, null);
    if(cljs.core.not.call(null, context__6636)) {
      return jQuery(jayq.core.__GT_selector.call(null, sel))
    }else {
      return jQuery(jayq.core.__GT_selector.call(null, sel), context__6636)
    }
  };
  var $ = function(sel, var_args) {
    var p__6633 = null;
    if(goog.isDef(var_args)) {
      p__6633 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return $__delegate.call(this, sel, p__6633)
  };
  $.cljs$lang$maxFixedArity = 1;
  $.cljs$lang$applyTo = function(arglist__6637) {
    var sel = cljs.core.first(arglist__6637);
    var p__6633 = cljs.core.rest(arglist__6637);
    return $__delegate(sel, p__6633)
  };
  $.cljs$lang$arity$variadic = $__delegate;
  return $
}();
jQuery.prototype.cljs$core$IReduce$ = true;
jQuery.prototype.cljs$core$IReduce$_reduce$arity$2 = function(this$, f) {
  return cljs.core.ci_reduce.call(null, this$, f)
};
jQuery.prototype.cljs$core$IReduce$_reduce$arity$3 = function(this$, f, start) {
  return cljs.core.ci_reduce.call(null, this$, f, start)
};
jQuery.prototype.cljs$core$ILookup$ = true;
jQuery.prototype.cljs$core$ILookup$_lookup$arity$2 = function(this$, k) {
  var or__138__auto____6638 = this$.slice(k, k + 1);
  if(cljs.core.truth_(or__138__auto____6638)) {
    return or__138__auto____6638
  }else {
    return null
  }
};
jQuery.prototype.cljs$core$ILookup$_lookup$arity$3 = function(this$, k, not_found) {
  return cljs.core._nth.call(null, this$, k, not_found)
};
jQuery.prototype.cljs$core$ISequential$ = true;
jQuery.prototype.cljs$core$IIndexed$ = true;
jQuery.prototype.cljs$core$IIndexed$_nth$arity$2 = function(this$, n) {
  if(n < cljs.core.count.call(null, this$)) {
    return this$.slice(n, n + 1)
  }else {
    return null
  }
};
jQuery.prototype.cljs$core$IIndexed$_nth$arity$3 = function(this$, n, not_found) {
  if(n < cljs.core.count.call(null, this$)) {
    return this$.slice(n, n + 1)
  }else {
    if(void 0 === not_found) {
      return null
    }else {
      return not_found
    }
  }
};
jQuery.prototype.cljs$core$ICounted$ = true;
jQuery.prototype.cljs$core$ICounted$_count$arity$1 = function(this$) {
  return this$.size()
};
jQuery.prototype.cljs$core$ISeq$ = true;
jQuery.prototype.cljs$core$ISeq$_first$arity$1 = function(this$) {
  return this$.get(0)
};
jQuery.prototype.cljs$core$ISeq$_rest$arity$1 = function(this$) {
  if(cljs.core.count.call(null, this$) > 1) {
    return this$.slice(1)
  }else {
    return cljs.core.list.call(null)
  }
};
jQuery.prototype.cljs$core$ISeqable$ = true;
jQuery.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  if(cljs.core.truth_(this$.get(0))) {
    return this$
  }else {
    return null
  }
};
jQuery.prototype.call = function() {
  var G__6639 = null;
  var G__6639__2 = function(_, k) {
    return cljs.core._lookup.call(null, this, k)
  };
  var G__6639__3 = function(_, k, not_found) {
    return cljs.core._lookup.call(null, this, k, not_found)
  };
  G__6639 = function(_, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6639__2.call(this, _, k);
      case 3:
        return G__6639__3.call(this, _, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6639
}();
jayq.core.anim = function anim(elem, props, dur) {
  return elem.animate(jayq.util.clj__GT_js.call(null, props), dur)
};
jayq.core.text = function text($elem, txt) {
  return $elem.text(txt)
};
jayq.core.css = function css($elem, opts) {
  if(cljs.core.keyword_QMARK_.call(null, opts)) {
    return $elem.css(cljs.core.name.call(null, opts))
  }else {
    return $elem.css(jayq.util.clj__GT_js.call(null, opts))
  }
};
jayq.core.attr = function() {
  var attr__delegate = function($elem, a, p__6640) {
    var vec__6641__6642 = p__6640;
    var v__6643 = cljs.core.nth.call(null, vec__6641__6642, 0, null);
    var a__6644 = cljs.core.name.call(null, a);
    if(cljs.core.not.call(null, v__6643)) {
      return $elem.attr(a__6644)
    }else {
      return $elem.attr(a__6644, v__6643)
    }
  };
  var attr = function($elem, a, var_args) {
    var p__6640 = null;
    if(goog.isDef(var_args)) {
      p__6640 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return attr__delegate.call(this, $elem, a, p__6640)
  };
  attr.cljs$lang$maxFixedArity = 2;
  attr.cljs$lang$applyTo = function(arglist__6645) {
    var $elem = cljs.core.first(arglist__6645);
    var a = cljs.core.first(cljs.core.next(arglist__6645));
    var p__6640 = cljs.core.rest(cljs.core.next(arglist__6645));
    return attr__delegate($elem, a, p__6640)
  };
  attr.cljs$lang$arity$variadic = attr__delegate;
  return attr
}();
jayq.core.remove_attr = function remove_attr($elem, a) {
  return $elem.removeAttr(cljs.core.name.call(null, a))
};
jayq.core.data = function() {
  var data__delegate = function($elem, k, p__6646) {
    var vec__6647__6648 = p__6646;
    var v__6649 = cljs.core.nth.call(null, vec__6647__6648, 0, null);
    var k__6650 = cljs.core.name.call(null, k);
    if(cljs.core.not.call(null, v__6649)) {
      return $elem.data(k__6650)
    }else {
      return $elem.data(k__6650, v__6649)
    }
  };
  var data = function($elem, k, var_args) {
    var p__6646 = null;
    if(goog.isDef(var_args)) {
      p__6646 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return data__delegate.call(this, $elem, k, p__6646)
  };
  data.cljs$lang$maxFixedArity = 2;
  data.cljs$lang$applyTo = function(arglist__6651) {
    var $elem = cljs.core.first(arglist__6651);
    var k = cljs.core.first(cljs.core.next(arglist__6651));
    var p__6646 = cljs.core.rest(cljs.core.next(arglist__6651));
    return data__delegate($elem, k, p__6646)
  };
  data.cljs$lang$arity$variadic = data__delegate;
  return data
}();
jayq.core.position = function position($elem) {
  return cljs.core.js__GT_clj.call(null, $elem.position(), "\ufdd0'keywordize-keys", true)
};
jayq.core.add_class = function add_class($elem, cl) {
  var cl__6652 = cljs.core.name.call(null, cl);
  return $elem.addClass(cl__6652)
};
jayq.core.remove_class = function remove_class($elem, cl) {
  var cl__6653 = cljs.core.name.call(null, cl);
  return $elem.removeClass(cl__6653)
};
jayq.core.toggle_class = function toggle_class($elem, cl) {
  var cl__6654 = cljs.core.name.call(null, cl);
  return $elem.toggleClass(cl__6654)
};
jayq.core.has_class = function has_class($elem, cl) {
  var cl__6655 = cljs.core.name.call(null, cl);
  return $elem.hasClass(cl__6655)
};
jayq.core.after = function after($elem, content) {
  return $elem.after(content)
};
jayq.core.before = function before($elem, content) {
  return $elem.before(content)
};
jayq.core.append = function append($elem, content) {
  return $elem.append(content)
};
jayq.core.prepend = function prepend($elem, content) {
  return $elem.prepend(content)
};
jayq.core.remove = function remove($elem) {
  return $elem.remove()
};
jayq.core.hide = function() {
  var hide__delegate = function($elem, p__6656) {
    var vec__6657__6658 = p__6656;
    var speed__6659 = cljs.core.nth.call(null, vec__6657__6658, 0, null);
    var on_finish__6660 = cljs.core.nth.call(null, vec__6657__6658, 1, null);
    return $elem.hide(speed__6659, on_finish__6660)
  };
  var hide = function($elem, var_args) {
    var p__6656 = null;
    if(goog.isDef(var_args)) {
      p__6656 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return hide__delegate.call(this, $elem, p__6656)
  };
  hide.cljs$lang$maxFixedArity = 1;
  hide.cljs$lang$applyTo = function(arglist__6661) {
    var $elem = cljs.core.first(arglist__6661);
    var p__6656 = cljs.core.rest(arglist__6661);
    return hide__delegate($elem, p__6656)
  };
  hide.cljs$lang$arity$variadic = hide__delegate;
  return hide
}();
jayq.core.show = function() {
  var show__delegate = function($elem, p__6662) {
    var vec__6663__6664 = p__6662;
    var speed__6665 = cljs.core.nth.call(null, vec__6663__6664, 0, null);
    var on_finish__6666 = cljs.core.nth.call(null, vec__6663__6664, 1, null);
    return $elem.show(speed__6665, on_finish__6666)
  };
  var show = function($elem, var_args) {
    var p__6662 = null;
    if(goog.isDef(var_args)) {
      p__6662 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return show__delegate.call(this, $elem, p__6662)
  };
  show.cljs$lang$maxFixedArity = 1;
  show.cljs$lang$applyTo = function(arglist__6667) {
    var $elem = cljs.core.first(arglist__6667);
    var p__6662 = cljs.core.rest(arglist__6667);
    return show__delegate($elem, p__6662)
  };
  show.cljs$lang$arity$variadic = show__delegate;
  return show
}();
jayq.core.toggle = function() {
  var toggle__delegate = function($elem, p__6668) {
    var vec__6669__6670 = p__6668;
    var speed__6671 = cljs.core.nth.call(null, vec__6669__6670, 0, null);
    var on_finish__6672 = cljs.core.nth.call(null, vec__6669__6670, 1, null);
    return $elem.toggle(speed__6671, on_finish__6672)
  };
  var toggle = function($elem, var_args) {
    var p__6668 = null;
    if(goog.isDef(var_args)) {
      p__6668 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return toggle__delegate.call(this, $elem, p__6668)
  };
  toggle.cljs$lang$maxFixedArity = 1;
  toggle.cljs$lang$applyTo = function(arglist__6673) {
    var $elem = cljs.core.first(arglist__6673);
    var p__6668 = cljs.core.rest(arglist__6673);
    return toggle__delegate($elem, p__6668)
  };
  toggle.cljs$lang$arity$variadic = toggle__delegate;
  return toggle
}();
jayq.core.fade_out = function() {
  var fade_out__delegate = function($elem, p__6674) {
    var vec__6675__6676 = p__6674;
    var speed__6677 = cljs.core.nth.call(null, vec__6675__6676, 0, null);
    var on_finish__6678 = cljs.core.nth.call(null, vec__6675__6676, 1, null);
    return $elem.fadeOut(speed__6677, on_finish__6678)
  };
  var fade_out = function($elem, var_args) {
    var p__6674 = null;
    if(goog.isDef(var_args)) {
      p__6674 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return fade_out__delegate.call(this, $elem, p__6674)
  };
  fade_out.cljs$lang$maxFixedArity = 1;
  fade_out.cljs$lang$applyTo = function(arglist__6679) {
    var $elem = cljs.core.first(arglist__6679);
    var p__6674 = cljs.core.rest(arglist__6679);
    return fade_out__delegate($elem, p__6674)
  };
  fade_out.cljs$lang$arity$variadic = fade_out__delegate;
  return fade_out
}();
jayq.core.fade_in = function() {
  var fade_in__delegate = function($elem, p__6680) {
    var vec__6681__6682 = p__6680;
    var speed__6683 = cljs.core.nth.call(null, vec__6681__6682, 0, null);
    var on_finish__6684 = cljs.core.nth.call(null, vec__6681__6682, 1, null);
    return $elem.fadeIn(speed__6683, on_finish__6684)
  };
  var fade_in = function($elem, var_args) {
    var p__6680 = null;
    if(goog.isDef(var_args)) {
      p__6680 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return fade_in__delegate.call(this, $elem, p__6680)
  };
  fade_in.cljs$lang$maxFixedArity = 1;
  fade_in.cljs$lang$applyTo = function(arglist__6685) {
    var $elem = cljs.core.first(arglist__6685);
    var p__6680 = cljs.core.rest(arglist__6685);
    return fade_in__delegate($elem, p__6680)
  };
  fade_in.cljs$lang$arity$variadic = fade_in__delegate;
  return fade_in
}();
jayq.core.slide_up = function() {
  var slide_up__delegate = function($elem, p__6686) {
    var vec__6687__6688 = p__6686;
    var speed__6689 = cljs.core.nth.call(null, vec__6687__6688, 0, null);
    var on_finish__6690 = cljs.core.nth.call(null, vec__6687__6688, 1, null);
    return $elem.slideUp(speed__6689, on_finish__6690)
  };
  var slide_up = function($elem, var_args) {
    var p__6686 = null;
    if(goog.isDef(var_args)) {
      p__6686 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return slide_up__delegate.call(this, $elem, p__6686)
  };
  slide_up.cljs$lang$maxFixedArity = 1;
  slide_up.cljs$lang$applyTo = function(arglist__6691) {
    var $elem = cljs.core.first(arglist__6691);
    var p__6686 = cljs.core.rest(arglist__6691);
    return slide_up__delegate($elem, p__6686)
  };
  slide_up.cljs$lang$arity$variadic = slide_up__delegate;
  return slide_up
}();
jayq.core.slide_down = function() {
  var slide_down__delegate = function($elem, p__6692) {
    var vec__6693__6694 = p__6692;
    var speed__6695 = cljs.core.nth.call(null, vec__6693__6694, 0, null);
    var on_finish__6696 = cljs.core.nth.call(null, vec__6693__6694, 1, null);
    return $elem.slideDown(speed__6695, on_finish__6696)
  };
  var slide_down = function($elem, var_args) {
    var p__6692 = null;
    if(goog.isDef(var_args)) {
      p__6692 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return slide_down__delegate.call(this, $elem, p__6692)
  };
  slide_down.cljs$lang$maxFixedArity = 1;
  slide_down.cljs$lang$applyTo = function(arglist__6697) {
    var $elem = cljs.core.first(arglist__6697);
    var p__6692 = cljs.core.rest(arglist__6697);
    return slide_down__delegate($elem, p__6692)
  };
  slide_down.cljs$lang$arity$variadic = slide_down__delegate;
  return slide_down
}();
jayq.core.parent = function parent($elem) {
  return $elem.parent()
};
jayq.core.find = function find($elem, selector) {
  return $elem.find(cljs.core.name.call(null, selector))
};
jayq.core.closest = function() {
  var closest__delegate = function($elem, selector, p__6698) {
    var vec__6699__6700 = p__6698;
    var context__6701 = cljs.core.nth.call(null, vec__6699__6700, 0, null);
    return $elem.closest(selector, context__6701)
  };
  var closest = function($elem, selector, var_args) {
    var p__6698 = null;
    if(goog.isDef(var_args)) {
      p__6698 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return closest__delegate.call(this, $elem, selector, p__6698)
  };
  closest.cljs$lang$maxFixedArity = 2;
  closest.cljs$lang$applyTo = function(arglist__6702) {
    var $elem = cljs.core.first(arglist__6702);
    var selector = cljs.core.first(cljs.core.next(arglist__6702));
    var p__6698 = cljs.core.rest(cljs.core.next(arglist__6702));
    return closest__delegate($elem, selector, p__6698)
  };
  closest.cljs$lang$arity$variadic = closest__delegate;
  return closest
}();
jayq.core.clone = function clone($elem) {
  return $elem.clone()
};
jayq.core.inner = function inner($elem, v) {
  return $elem.html(v)
};
jayq.core.empty = function empty($elem) {
  return $elem.empty()
};
jayq.core.val = function() {
  var val__delegate = function($elem, p__6703) {
    var vec__6704__6705 = p__6703;
    var v__6706 = cljs.core.nth.call(null, vec__6704__6705, 0, null);
    if(cljs.core.truth_(v__6706)) {
      return $elem.val(v__6706)
    }else {
      return $elem.val()
    }
  };
  var val = function($elem, var_args) {
    var p__6703 = null;
    if(goog.isDef(var_args)) {
      p__6703 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return val__delegate.call(this, $elem, p__6703)
  };
  val.cljs$lang$maxFixedArity = 1;
  val.cljs$lang$applyTo = function(arglist__6707) {
    var $elem = cljs.core.first(arglist__6707);
    var p__6703 = cljs.core.rest(arglist__6707);
    return val__delegate($elem, p__6703)
  };
  val.cljs$lang$arity$variadic = val__delegate;
  return val
}();
jayq.core.serialize = function serialize($elem) {
  return $elem.serialize()
};
jayq.core.queue = function queue($elem, callback) {
  return $elem.queue(callback)
};
jayq.core.dequeue = function dequeue(elem) {
  return jayq.core.$.call(null, elem).dequeue()
};
jayq.core.document_ready = function document_ready(func) {
  return jayq.core.$.call(null, document).ready(func)
};
jayq.core.xhr = function xhr(p__6708, content, callback) {
  var vec__6709__6710 = p__6708;
  var method__6711 = cljs.core.nth.call(null, vec__6709__6710, 0, null);
  var uri__6712 = cljs.core.nth.call(null, vec__6709__6710, 1, null);
  var params__6713 = jayq.util.clj__GT_js.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'type", "\ufdd0'data", "\ufdd0'success"], {"\ufdd0'type":clojure.string.upper_case.call(null, cljs.core.name.call(null, method__6711)), "\ufdd0'data":jayq.util.clj__GT_js.call(null, content), "\ufdd0'success":callback}));
  return jQuery.ajax(uri__6712, params__6713)
};
jayq.core.ajax = function() {
  var ajax = null;
  var ajax__1 = function(settings) {
    return jQuery.ajax(jayq.util.clj__GT_js.call(null, settings))
  };
  var ajax__2 = function(url, settings) {
    return jQuery.ajax(url, jayq.util.clj__GT_js.call(null, settings))
  };
  ajax = function(url, settings) {
    switch(arguments.length) {
      case 1:
        return ajax__1.call(this, url);
      case 2:
        return ajax__2.call(this, url, settings)
    }
    throw"Invalid arity: " + arguments.length;
  };
  ajax.cljs$lang$arity$1 = ajax__1;
  ajax.cljs$lang$arity$2 = ajax__2;
  return ajax
}();
jayq.core.bind = function bind($elem, ev, func) {
  return $elem.bind(cljs.core.name.call(null, ev), func)
};
jayq.core.unbind = function() {
  var unbind__delegate = function($elem, ev, p__6714) {
    var vec__6715__6716 = p__6714;
    var func__6717 = cljs.core.nth.call(null, vec__6715__6716, 0, null);
    return $elem.unbind(cljs.core.name.call(null, ev), func__6717)
  };
  var unbind = function($elem, ev, var_args) {
    var p__6714 = null;
    if(goog.isDef(var_args)) {
      p__6714 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return unbind__delegate.call(this, $elem, ev, p__6714)
  };
  unbind.cljs$lang$maxFixedArity = 2;
  unbind.cljs$lang$applyTo = function(arglist__6718) {
    var $elem = cljs.core.first(arglist__6718);
    var ev = cljs.core.first(cljs.core.next(arglist__6718));
    var p__6714 = cljs.core.rest(cljs.core.next(arglist__6718));
    return unbind__delegate($elem, ev, p__6714)
  };
  unbind.cljs$lang$arity$variadic = unbind__delegate;
  return unbind
}();
jayq.core.trigger = function trigger($elem, ev) {
  return $elem.trigger(cljs.core.name.call(null, ev))
};
jayq.core.delegate = function delegate($elem, sel, ev, func) {
  return $elem.delegate(jayq.core.__GT_selector.call(null, sel), cljs.core.name.call(null, ev), func)
};
jayq.core.__GT_event = function __GT_event(e) {
  if(cljs.core.keyword_QMARK_.call(null, e)) {
    return cljs.core.name.call(null, e)
  }else {
    if(cljs.core.map_QMARK_.call(null, e)) {
      return jayq.util.clj__GT_js.call(null, e)
    }else {
      if(cljs.core.coll_QMARK_.call(null, e)) {
        return clojure.string.join.call(null, " ", cljs.core.map.call(null, cljs.core.name, e))
      }else {
        if("\ufdd0'else") {
          throw new Error([cljs.core.str("Unknown event type: "), cljs.core.str(e)].join(""));
        }else {
          return null
        }
      }
    }
  }
};
jayq.core.on = function() {
  var on__delegate = function($elem, events, p__6719) {
    var vec__6720__6721 = p__6719;
    var sel__6722 = cljs.core.nth.call(null, vec__6720__6721, 0, null);
    var data__6723 = cljs.core.nth.call(null, vec__6720__6721, 1, null);
    var handler__6724 = cljs.core.nth.call(null, vec__6720__6721, 2, null);
    return $elem.on(jayq.core.__GT_event.call(null, events), jayq.core.__GT_selector.call(null, sel__6722), data__6723, handler__6724)
  };
  var on = function($elem, events, var_args) {
    var p__6719 = null;
    if(goog.isDef(var_args)) {
      p__6719 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return on__delegate.call(this, $elem, events, p__6719)
  };
  on.cljs$lang$maxFixedArity = 2;
  on.cljs$lang$applyTo = function(arglist__6725) {
    var $elem = cljs.core.first(arglist__6725);
    var events = cljs.core.first(cljs.core.next(arglist__6725));
    var p__6719 = cljs.core.rest(cljs.core.next(arglist__6725));
    return on__delegate($elem, events, p__6719)
  };
  on.cljs$lang$arity$variadic = on__delegate;
  return on
}();
jayq.core.one = function() {
  var one__delegate = function($elem, events, p__6726) {
    var vec__6727__6728 = p__6726;
    var sel__6729 = cljs.core.nth.call(null, vec__6727__6728, 0, null);
    var data__6730 = cljs.core.nth.call(null, vec__6727__6728, 1, null);
    var handler__6731 = cljs.core.nth.call(null, vec__6727__6728, 2, null);
    return $elem.one(jayq.core.__GT_event.call(null, events), jayq.core.__GT_selector.call(null, sel__6729), data__6730, handler__6731)
  };
  var one = function($elem, events, var_args) {
    var p__6726 = null;
    if(goog.isDef(var_args)) {
      p__6726 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return one__delegate.call(this, $elem, events, p__6726)
  };
  one.cljs$lang$maxFixedArity = 2;
  one.cljs$lang$applyTo = function(arglist__6732) {
    var $elem = cljs.core.first(arglist__6732);
    var events = cljs.core.first(cljs.core.next(arglist__6732));
    var p__6726 = cljs.core.rest(cljs.core.next(arglist__6732));
    return one__delegate($elem, events, p__6726)
  };
  one.cljs$lang$arity$variadic = one__delegate;
  return one
}();
jayq.core.off = function() {
  var off__delegate = function($elem, events, p__6733) {
    var vec__6734__6735 = p__6733;
    var sel__6736 = cljs.core.nth.call(null, vec__6734__6735, 0, null);
    var handler__6737 = cljs.core.nth.call(null, vec__6734__6735, 1, null);
    return $elem.off(jayq.core.__GT_event.call(null, events), jayq.core.__GT_selector.call(null, sel__6736), handler__6737)
  };
  var off = function($elem, events, var_args) {
    var p__6733 = null;
    if(goog.isDef(var_args)) {
      p__6733 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return off__delegate.call(this, $elem, events, p__6733)
  };
  off.cljs$lang$maxFixedArity = 2;
  off.cljs$lang$applyTo = function(arglist__6738) {
    var $elem = cljs.core.first(arglist__6738);
    var events = cljs.core.first(cljs.core.next(arglist__6738));
    var p__6733 = cljs.core.rest(cljs.core.next(arglist__6738));
    return off__delegate($elem, events, p__6733)
  };
  off.cljs$lang$arity$variadic = off__delegate;
  return off
}();
jayq.core.prevent = function prevent(e) {
  return e.preventDefault()
};
goog.provide("io.turbonode.hyper_clj.maze");
goog.require("cljs.core");
goog.require("clojure.browser.repl");
goog.require("clojure.string");
goog.require("jayq.core");
io.turbonode.hyper_clj.maze.$ = jayq.core.$;
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
jayq.core.document_ready.call(null, function() {
  clojure.browser.repl.connect.call(null, "http://localhost:9000/repl");
  io.turbonode.hyper_clj.maze.attach_events.call(null);
  io.turbonode.hyper_clj.maze.get_document.call(null, io.turbonode.hyper_clj.maze.start_link);
  return io.turbonode.hyper_clj.maze.set_focus.call(null)
});
io.turbonode.hyper_clj.maze.attach_events = function attach_events() {
  return jayq.core.bind.call(null, io.turbonode.hyper_clj.maze.$.call(null, "[name|=interface]"), "\ufdd0'submit", function() {
    io.turbonode.hyper_clj.maze.move.call(null);
    return false
  })
};
io.turbonode.hyper_clj.maze.get_document = function get_document(url) {
  return jayq.core.ajax.call(null, url, cljs.core.ObjMap.fromObject(["\ufdd0'accepts", "\ufdd0'context", "\ufdd0'dataType", "\ufdd0'success", "\ufdd0'type"], {"\ufdd0'accepts":io.turbonode.hyper_clj.maze.maze_media_type, "\ufdd0'context":window, "\ufdd0'dataType":"xml", "\ufdd0'success":io.turbonode.hyper_clj.maze.process_links, "\ufdd0'type":"GET"}))
};
io.turbonode.hyper_clj.maze.get_option_link = function get_option_link(action) {
  var temp__324__auto____475748 = cljs.core.first.call(null, io.turbonode.hyper_clj.maze.$.call(null, "\ufdd0'.options"));
  if(cljs.core.truth_(temp__324__auto____475748)) {
    var options_elm__475749 = temp__324__auto____475748;
    var links__475750 = options_elm__475749.links;
    var head__475751 = cljs.core.first.call(null, links__475750);
    var tail__475752 = cljs.core.rest.call(null, links__475750);
    while(true) {
      if(cljs.core._EQ_.call(null, "\ufdd0'rel".call(null, head__475751), action)) {
        return"\ufdd0'href".call(null, head__475751)
      }else {
        if(cljs.core.empty_QMARK_.call(null, tail__475752)) {
          return null
        }else {
          var G__475753 = cljs.core.first.call(null, tail__475752);
          var G__475754 = cljs.core.rest.call(null, tail__475752);
          head__475751 = G__475753;
          tail__475752 = G__475754;
          continue
        }
      }
      break
    }
  }else {
    return null
  }
};
io.turbonode.hyper_clj.maze.maze_media_type = "application/vnd.amundsen.maze+xml";
io.turbonode.hyper_clj.maze.move = function move() {
  var temp__324__auto____475755 = cljs.core.first.call(null, io.turbonode.hyper_clj.maze.$.call(null, "[name|=move]"));
  if(cljs.core.truth_(temp__324__auto____475755)) {
    var move_elm__475756 = temp__324__auto____475755;
    var v__475757 = move_elm__475756.value;
    if(cljs.core._EQ_.call(null, v__475757, "clear")) {
      return history.go(0)
    }else {
      var href__475758 = io.turbonode.hyper_clj.maze.get_option_link.call(null, v__475757);
      if(cljs.core.truth_(href__475758)) {
        io.turbonode.hyper_clj.maze.update_history.call(null, v__475757);
        io.turbonode.hyper_clj.maze.get_document.call(null, href__475758)
      }else {
        alert(io.turbonode.hyper_clj.maze.sorry_message)
      }
      return io.turbonode.hyper_clj.maze.set_focus.call(null)
    }
  }else {
    return null
  }
};
io.turbonode.hyper_clj.maze.process_links = function process_links(data) {
  return io.turbonode.hyper_clj.maze.show_options.call(null, cljs.core.flatten.call(null, cljs.core.map.call(null, function(node) {
    var href__475759 = jayq.core.attr.call(null, io.turbonode.hyper_clj.maze.$.call(null, node), "\ufdd0'href");
    var rels__475760 = clojure.string.split.call(null, jayq.core.attr.call(null, io.turbonode.hyper_clj.maze.$.call(null, node), "\ufdd0'rel"), / /);
    return cljs.core.map.call(null, function(rel) {
      return cljs.core.ObjMap.fromObject(["\ufdd0'rel", "\ufdd0'href"], {"\ufdd0'rel":rel, "\ufdd0'href":href__475759})
    }, rels__475760)
  }, jayq.core.find.call(null, io.turbonode.hyper_clj.maze.$.call(null, data), "\ufdd0'link"))))
};
io.turbonode.hyper_clj.maze.set_focus = function set_focus() {
  var G__475761__475762 = io.turbonode.hyper_clj.maze.$.call(null, "[name|=move]");
  G__475761__475762.val("");
  G__475761__475762.focus();
  return G__475761__475762
};
io.turbonode.hyper_clj.maze.show_options = function show_options(links) {
  var temp__324__auto____475763 = cljs.core.first.call(null, io.turbonode.hyper_clj.maze.$.call(null, ".options"));
  if(cljs.core.truth_(temp__324__auto____475763)) {
    var options_elm__475764 = temp__324__auto____475763;
    options_elm__475764.links = links;
    var txt__475771 = cljs.core.map.call(null, function(p__475765) {
      var map__475766__475767 = p__475765;
      var map__475766__475768 = cljs.core.seq_QMARK_.call(null, map__475766__475767) ? cljs.core.apply.call(null, cljs.core.hash_map, map__475766__475767) : map__475766__475767;
      var href__475769 = cljs.core.get.call(null, map__475766__475768, "\ufdd0'href");
      var rel__475770 = cljs.core.get.call(null, map__475766__475768, "\ufdd0'rel");
      if(cljs.core._EQ_.call(null, rel__475770, "collection")) {
        return"clear"
      }else {
        return rel__475770
      }
    }, links);
    var txt__475772 = clojure.string.join.call(null, ", ", txt__475771);
    return options_elm__475764.innerHTML = txt__475772
  }else {
    return null
  }
};
io.turbonode.hyper_clj.maze.sorry_message = "Sorry, I don't understand what you want to do.";
io.turbonode.hyper_clj.maze.start_link = "/maze/";
io.turbonode.hyper_clj.maze.success_message = "Congratulations! you've made it out of the maze!";
io.turbonode.hyper_clj.maze.update_history = function update_history(action) {
  var temp__324__auto____475773 = cljs.core.first.call(null, io.turbonode.hyper_clj.maze.$.call(null, "#history"));
  if(cljs.core.truth_(temp__324__auto____475773)) {
    var history_elm__475774 = temp__324__auto____475773;
    var num__475775 = history_elm__475774.num;
    var num__475776 = cljs.core.truth_(num__475775) ? num__475775 : 0;
    var txt__475777 = io.turbonode.hyper_clj.maze.$.call(null, history_elm__475774).text();
    var new_entry__475778 = function(entry) {
      return io.turbonode.hyper_clj.maze.$.call(null, history_elm__475774).text([cljs.core.str(num__475776 + 1), cljs.core.str(": "), cljs.core.str(entry), cljs.core.str("\n"), cljs.core.str(txt__475777)].join(""))
    };
    history_elm__475774.num = num__475776 + 1;
    if(cljs.core._EQ_.call(null, action, "exit")) {
      return new_entry__475778.call(null, io.turbonode.hyper_clj.maze.success_message)
    }else {
      return new_entry__475778.call(null, action)
    }
  }else {
    return null
  }
};
