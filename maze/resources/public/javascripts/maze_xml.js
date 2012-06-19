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
    var G__6662__delegate = function(array, i, idxs) {
      return cljs.core.apply.call(null, aget, aget.call(null, array, i), idxs)
    };
    var G__6662 = function(array, i, var_args) {
      var idxs = null;
      if(goog.isDef(var_args)) {
        idxs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6662__delegate.call(this, array, i, idxs)
    };
    G__6662.cljs$lang$maxFixedArity = 2;
    G__6662.cljs$lang$applyTo = function(arglist__6663) {
      var array = cljs.core.first(arglist__6663);
      var i = cljs.core.first(cljs.core.next(arglist__6663));
      var idxs = cljs.core.rest(cljs.core.next(arglist__6663));
      return G__6662__delegate(array, i, idxs)
    };
    G__6662.cljs$lang$arity$variadic = G__6662__delegate;
    return G__6662
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
      var and__132__auto____6664 = this$;
      if(and__132__auto____6664) {
        return this$.cljs$core$IFn$_invoke$arity$1
      }else {
        return and__132__auto____6664
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$1(this$)
    }else {
      return function() {
        var or__138__auto____6665 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6665) {
          return or__138__auto____6665
        }else {
          var or__138__auto____6666 = cljs.core._invoke["_"];
          if(or__138__auto____6666) {
            return or__138__auto____6666
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$)
    }
  };
  var _invoke__2 = function(this$, a) {
    if(function() {
      var and__132__auto____6667 = this$;
      if(and__132__auto____6667) {
        return this$.cljs$core$IFn$_invoke$arity$2
      }else {
        return and__132__auto____6667
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$2(this$, a)
    }else {
      return function() {
        var or__138__auto____6668 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6668) {
          return or__138__auto____6668
        }else {
          var or__138__auto____6669 = cljs.core._invoke["_"];
          if(or__138__auto____6669) {
            return or__138__auto____6669
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a)
    }
  };
  var _invoke__3 = function(this$, a, b) {
    if(function() {
      var and__132__auto____6670 = this$;
      if(and__132__auto____6670) {
        return this$.cljs$core$IFn$_invoke$arity$3
      }else {
        return and__132__auto____6670
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$3(this$, a, b)
    }else {
      return function() {
        var or__138__auto____6671 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6671) {
          return or__138__auto____6671
        }else {
          var or__138__auto____6672 = cljs.core._invoke["_"];
          if(or__138__auto____6672) {
            return or__138__auto____6672
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b)
    }
  };
  var _invoke__4 = function(this$, a, b, c) {
    if(function() {
      var and__132__auto____6673 = this$;
      if(and__132__auto____6673) {
        return this$.cljs$core$IFn$_invoke$arity$4
      }else {
        return and__132__auto____6673
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$4(this$, a, b, c)
    }else {
      return function() {
        var or__138__auto____6674 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6674) {
          return or__138__auto____6674
        }else {
          var or__138__auto____6675 = cljs.core._invoke["_"];
          if(or__138__auto____6675) {
            return or__138__auto____6675
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c)
    }
  };
  var _invoke__5 = function(this$, a, b, c, d) {
    if(function() {
      var and__132__auto____6676 = this$;
      if(and__132__auto____6676) {
        return this$.cljs$core$IFn$_invoke$arity$5
      }else {
        return and__132__auto____6676
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$5(this$, a, b, c, d)
    }else {
      return function() {
        var or__138__auto____6677 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6677) {
          return or__138__auto____6677
        }else {
          var or__138__auto____6678 = cljs.core._invoke["_"];
          if(or__138__auto____6678) {
            return or__138__auto____6678
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d)
    }
  };
  var _invoke__6 = function(this$, a, b, c, d, e) {
    if(function() {
      var and__132__auto____6679 = this$;
      if(and__132__auto____6679) {
        return this$.cljs$core$IFn$_invoke$arity$6
      }else {
        return and__132__auto____6679
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$6(this$, a, b, c, d, e)
    }else {
      return function() {
        var or__138__auto____6680 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6680) {
          return or__138__auto____6680
        }else {
          var or__138__auto____6681 = cljs.core._invoke["_"];
          if(or__138__auto____6681) {
            return or__138__auto____6681
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e)
    }
  };
  var _invoke__7 = function(this$, a, b, c, d, e, f) {
    if(function() {
      var and__132__auto____6682 = this$;
      if(and__132__auto____6682) {
        return this$.cljs$core$IFn$_invoke$arity$7
      }else {
        return and__132__auto____6682
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$7(this$, a, b, c, d, e, f)
    }else {
      return function() {
        var or__138__auto____6683 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6683) {
          return or__138__auto____6683
        }else {
          var or__138__auto____6684 = cljs.core._invoke["_"];
          if(or__138__auto____6684) {
            return or__138__auto____6684
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f)
    }
  };
  var _invoke__8 = function(this$, a, b, c, d, e, f, g) {
    if(function() {
      var and__132__auto____6685 = this$;
      if(and__132__auto____6685) {
        return this$.cljs$core$IFn$_invoke$arity$8
      }else {
        return and__132__auto____6685
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$8(this$, a, b, c, d, e, f, g)
    }else {
      return function() {
        var or__138__auto____6686 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6686) {
          return or__138__auto____6686
        }else {
          var or__138__auto____6687 = cljs.core._invoke["_"];
          if(or__138__auto____6687) {
            return or__138__auto____6687
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g)
    }
  };
  var _invoke__9 = function(this$, a, b, c, d, e, f, g, h) {
    if(function() {
      var and__132__auto____6688 = this$;
      if(and__132__auto____6688) {
        return this$.cljs$core$IFn$_invoke$arity$9
      }else {
        return and__132__auto____6688
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$9(this$, a, b, c, d, e, f, g, h)
    }else {
      return function() {
        var or__138__auto____6689 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6689) {
          return or__138__auto____6689
        }else {
          var or__138__auto____6690 = cljs.core._invoke["_"];
          if(or__138__auto____6690) {
            return or__138__auto____6690
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h)
    }
  };
  var _invoke__10 = function(this$, a, b, c, d, e, f, g, h, i) {
    if(function() {
      var and__132__auto____6691 = this$;
      if(and__132__auto____6691) {
        return this$.cljs$core$IFn$_invoke$arity$10
      }else {
        return and__132__auto____6691
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$10(this$, a, b, c, d, e, f, g, h, i)
    }else {
      return function() {
        var or__138__auto____6692 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6692) {
          return or__138__auto____6692
        }else {
          var or__138__auto____6693 = cljs.core._invoke["_"];
          if(or__138__auto____6693) {
            return or__138__auto____6693
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i)
    }
  };
  var _invoke__11 = function(this$, a, b, c, d, e, f, g, h, i, j) {
    if(function() {
      var and__132__auto____6694 = this$;
      if(and__132__auto____6694) {
        return this$.cljs$core$IFn$_invoke$arity$11
      }else {
        return and__132__auto____6694
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$11(this$, a, b, c, d, e, f, g, h, i, j)
    }else {
      return function() {
        var or__138__auto____6695 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6695) {
          return or__138__auto____6695
        }else {
          var or__138__auto____6696 = cljs.core._invoke["_"];
          if(or__138__auto____6696) {
            return or__138__auto____6696
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j)
    }
  };
  var _invoke__12 = function(this$, a, b, c, d, e, f, g, h, i, j, k) {
    if(function() {
      var and__132__auto____6697 = this$;
      if(and__132__auto____6697) {
        return this$.cljs$core$IFn$_invoke$arity$12
      }else {
        return and__132__auto____6697
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$12(this$, a, b, c, d, e, f, g, h, i, j, k)
    }else {
      return function() {
        var or__138__auto____6698 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6698) {
          return or__138__auto____6698
        }else {
          var or__138__auto____6699 = cljs.core._invoke["_"];
          if(or__138__auto____6699) {
            return or__138__auto____6699
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k)
    }
  };
  var _invoke__13 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l) {
    if(function() {
      var and__132__auto____6700 = this$;
      if(and__132__auto____6700) {
        return this$.cljs$core$IFn$_invoke$arity$13
      }else {
        return and__132__auto____6700
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$13(this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }else {
      return function() {
        var or__138__auto____6701 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6701) {
          return or__138__auto____6701
        }else {
          var or__138__auto____6702 = cljs.core._invoke["_"];
          if(or__138__auto____6702) {
            return or__138__auto____6702
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l)
    }
  };
  var _invoke__14 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    if(function() {
      var and__132__auto____6703 = this$;
      if(and__132__auto____6703) {
        return this$.cljs$core$IFn$_invoke$arity$14
      }else {
        return and__132__auto____6703
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$14(this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }else {
      return function() {
        var or__138__auto____6704 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6704) {
          return or__138__auto____6704
        }else {
          var or__138__auto____6705 = cljs.core._invoke["_"];
          if(or__138__auto____6705) {
            return or__138__auto____6705
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m)
    }
  };
  var _invoke__15 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    if(function() {
      var and__132__auto____6706 = this$;
      if(and__132__auto____6706) {
        return this$.cljs$core$IFn$_invoke$arity$15
      }else {
        return and__132__auto____6706
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$15(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }else {
      return function() {
        var or__138__auto____6707 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6707) {
          return or__138__auto____6707
        }else {
          var or__138__auto____6708 = cljs.core._invoke["_"];
          if(or__138__auto____6708) {
            return or__138__auto____6708
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n)
    }
  };
  var _invoke__16 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    if(function() {
      var and__132__auto____6709 = this$;
      if(and__132__auto____6709) {
        return this$.cljs$core$IFn$_invoke$arity$16
      }else {
        return and__132__auto____6709
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$16(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }else {
      return function() {
        var or__138__auto____6710 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6710) {
          return or__138__auto____6710
        }else {
          var or__138__auto____6711 = cljs.core._invoke["_"];
          if(or__138__auto____6711) {
            return or__138__auto____6711
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o)
    }
  };
  var _invoke__17 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    if(function() {
      var and__132__auto____6712 = this$;
      if(and__132__auto____6712) {
        return this$.cljs$core$IFn$_invoke$arity$17
      }else {
        return and__132__auto____6712
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$17(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }else {
      return function() {
        var or__138__auto____6713 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6713) {
          return or__138__auto____6713
        }else {
          var or__138__auto____6714 = cljs.core._invoke["_"];
          if(or__138__auto____6714) {
            return or__138__auto____6714
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
    }
  };
  var _invoke__18 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    if(function() {
      var and__132__auto____6715 = this$;
      if(and__132__auto____6715) {
        return this$.cljs$core$IFn$_invoke$arity$18
      }else {
        return and__132__auto____6715
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$18(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }else {
      return function() {
        var or__138__auto____6716 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6716) {
          return or__138__auto____6716
        }else {
          var or__138__auto____6717 = cljs.core._invoke["_"];
          if(or__138__auto____6717) {
            return or__138__auto____6717
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }
  };
  var _invoke__19 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s) {
    if(function() {
      var and__132__auto____6718 = this$;
      if(and__132__auto____6718) {
        return this$.cljs$core$IFn$_invoke$arity$19
      }else {
        return and__132__auto____6718
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$19(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }else {
      return function() {
        var or__138__auto____6719 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6719) {
          return or__138__auto____6719
        }else {
          var or__138__auto____6720 = cljs.core._invoke["_"];
          if(or__138__auto____6720) {
            return or__138__auto____6720
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s)
    }
  };
  var _invoke__20 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t) {
    if(function() {
      var and__132__auto____6721 = this$;
      if(and__132__auto____6721) {
        return this$.cljs$core$IFn$_invoke$arity$20
      }else {
        return and__132__auto____6721
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$20(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }else {
      return function() {
        var or__138__auto____6722 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6722) {
          return or__138__auto____6722
        }else {
          var or__138__auto____6723 = cljs.core._invoke["_"];
          if(or__138__auto____6723) {
            return or__138__auto____6723
          }else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t)
    }
  };
  var _invoke__21 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest) {
    if(function() {
      var and__132__auto____6724 = this$;
      if(and__132__auto____6724) {
        return this$.cljs$core$IFn$_invoke$arity$21
      }else {
        return and__132__auto____6724
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$21(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, s, t, rest)
    }else {
      return function() {
        var or__138__auto____6725 = cljs.core._invoke[goog.typeOf.call(null, this$)];
        if(or__138__auto____6725) {
          return or__138__auto____6725
        }else {
          var or__138__auto____6726 = cljs.core._invoke["_"];
          if(or__138__auto____6726) {
            return or__138__auto____6726
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
    var and__132__auto____6727 = coll;
    if(and__132__auto____6727) {
      return coll.cljs$core$ICounted$_count$arity$1
    }else {
      return and__132__auto____6727
    }
  }()) {
    return coll.cljs$core$ICounted$_count$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6728 = cljs.core._count[goog.typeOf.call(null, coll)];
      if(or__138__auto____6728) {
        return or__138__auto____6728
      }else {
        var or__138__auto____6729 = cljs.core._count["_"];
        if(or__138__auto____6729) {
          return or__138__auto____6729
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
    var and__132__auto____6730 = coll;
    if(and__132__auto____6730) {
      return coll.cljs$core$IEmptyableCollection$_empty$arity$1
    }else {
      return and__132__auto____6730
    }
  }()) {
    return coll.cljs$core$IEmptyableCollection$_empty$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6731 = cljs.core._empty[goog.typeOf.call(null, coll)];
      if(or__138__auto____6731) {
        return or__138__auto____6731
      }else {
        var or__138__auto____6732 = cljs.core._empty["_"];
        if(or__138__auto____6732) {
          return or__138__auto____6732
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
    var and__132__auto____6733 = coll;
    if(and__132__auto____6733) {
      return coll.cljs$core$ICollection$_conj$arity$2
    }else {
      return and__132__auto____6733
    }
  }()) {
    return coll.cljs$core$ICollection$_conj$arity$2(coll, o)
  }else {
    return function() {
      var or__138__auto____6734 = cljs.core._conj[goog.typeOf.call(null, coll)];
      if(or__138__auto____6734) {
        return or__138__auto____6734
      }else {
        var or__138__auto____6735 = cljs.core._conj["_"];
        if(or__138__auto____6735) {
          return or__138__auto____6735
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
      var and__132__auto____6736 = coll;
      if(and__132__auto____6736) {
        return coll.cljs$core$IIndexed$_nth$arity$2
      }else {
        return and__132__auto____6736
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth$arity$2(coll, n)
    }else {
      return function() {
        var or__138__auto____6737 = cljs.core._nth[goog.typeOf.call(null, coll)];
        if(or__138__auto____6737) {
          return or__138__auto____6737
        }else {
          var or__138__auto____6738 = cljs.core._nth["_"];
          if(or__138__auto____6738) {
            return or__138__auto____6738
          }else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n)
    }
  };
  var _nth__3 = function(coll, n, not_found) {
    if(function() {
      var and__132__auto____6739 = coll;
      if(and__132__auto____6739) {
        return coll.cljs$core$IIndexed$_nth$arity$3
      }else {
        return and__132__auto____6739
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth$arity$3(coll, n, not_found)
    }else {
      return function() {
        var or__138__auto____6740 = cljs.core._nth[goog.typeOf.call(null, coll)];
        if(or__138__auto____6740) {
          return or__138__auto____6740
        }else {
          var or__138__auto____6741 = cljs.core._nth["_"];
          if(or__138__auto____6741) {
            return or__138__auto____6741
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
    var and__132__auto____6742 = coll;
    if(and__132__auto____6742) {
      return coll.cljs$core$ISeq$_first$arity$1
    }else {
      return and__132__auto____6742
    }
  }()) {
    return coll.cljs$core$ISeq$_first$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6743 = cljs.core._first[goog.typeOf.call(null, coll)];
      if(or__138__auto____6743) {
        return or__138__auto____6743
      }else {
        var or__138__auto____6744 = cljs.core._first["_"];
        if(or__138__auto____6744) {
          return or__138__auto____6744
        }else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-first", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._rest = function _rest(coll) {
  if(function() {
    var and__132__auto____6745 = coll;
    if(and__132__auto____6745) {
      return coll.cljs$core$ISeq$_rest$arity$1
    }else {
      return and__132__auto____6745
    }
  }()) {
    return coll.cljs$core$ISeq$_rest$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6746 = cljs.core._rest[goog.typeOf.call(null, coll)];
      if(or__138__auto____6746) {
        return or__138__auto____6746
      }else {
        var or__138__auto____6747 = cljs.core._rest["_"];
        if(or__138__auto____6747) {
          return or__138__auto____6747
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
      var and__132__auto____6748 = o;
      if(and__132__auto____6748) {
        return o.cljs$core$ILookup$_lookup$arity$2
      }else {
        return and__132__auto____6748
      }
    }()) {
      return o.cljs$core$ILookup$_lookup$arity$2(o, k)
    }else {
      return function() {
        var or__138__auto____6749 = cljs.core._lookup[goog.typeOf.call(null, o)];
        if(or__138__auto____6749) {
          return or__138__auto____6749
        }else {
          var or__138__auto____6750 = cljs.core._lookup["_"];
          if(or__138__auto____6750) {
            return or__138__auto____6750
          }else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k)
    }
  };
  var _lookup__3 = function(o, k, not_found) {
    if(function() {
      var and__132__auto____6751 = o;
      if(and__132__auto____6751) {
        return o.cljs$core$ILookup$_lookup$arity$3
      }else {
        return and__132__auto____6751
      }
    }()) {
      return o.cljs$core$ILookup$_lookup$arity$3(o, k, not_found)
    }else {
      return function() {
        var or__138__auto____6752 = cljs.core._lookup[goog.typeOf.call(null, o)];
        if(or__138__auto____6752) {
          return or__138__auto____6752
        }else {
          var or__138__auto____6753 = cljs.core._lookup["_"];
          if(or__138__auto____6753) {
            return or__138__auto____6753
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
    var and__132__auto____6754 = coll;
    if(and__132__auto____6754) {
      return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2
    }else {
      return and__132__auto____6754
    }
  }()) {
    return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(coll, k)
  }else {
    return function() {
      var or__138__auto____6755 = cljs.core._contains_key_QMARK_[goog.typeOf.call(null, coll)];
      if(or__138__auto____6755) {
        return or__138__auto____6755
      }else {
        var or__138__auto____6756 = cljs.core._contains_key_QMARK_["_"];
        if(or__138__auto____6756) {
          return or__138__auto____6756
        }else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", coll);
        }
      }
    }().call(null, coll, k)
  }
};
cljs.core._assoc = function _assoc(coll, k, v) {
  if(function() {
    var and__132__auto____6757 = coll;
    if(and__132__auto____6757) {
      return coll.cljs$core$IAssociative$_assoc$arity$3
    }else {
      return and__132__auto____6757
    }
  }()) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, k, v)
  }else {
    return function() {
      var or__138__auto____6758 = cljs.core._assoc[goog.typeOf.call(null, coll)];
      if(or__138__auto____6758) {
        return or__138__auto____6758
      }else {
        var or__138__auto____6759 = cljs.core._assoc["_"];
        if(or__138__auto____6759) {
          return or__138__auto____6759
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
    var and__132__auto____6760 = coll;
    if(and__132__auto____6760) {
      return coll.cljs$core$IMap$_dissoc$arity$2
    }else {
      return and__132__auto____6760
    }
  }()) {
    return coll.cljs$core$IMap$_dissoc$arity$2(coll, k)
  }else {
    return function() {
      var or__138__auto____6761 = cljs.core._dissoc[goog.typeOf.call(null, coll)];
      if(or__138__auto____6761) {
        return or__138__auto____6761
      }else {
        var or__138__auto____6762 = cljs.core._dissoc["_"];
        if(or__138__auto____6762) {
          return or__138__auto____6762
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
    var and__132__auto____6763 = coll;
    if(and__132__auto____6763) {
      return coll.cljs$core$IMapEntry$_key$arity$1
    }else {
      return and__132__auto____6763
    }
  }()) {
    return coll.cljs$core$IMapEntry$_key$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6764 = cljs.core._key[goog.typeOf.call(null, coll)];
      if(or__138__auto____6764) {
        return or__138__auto____6764
      }else {
        var or__138__auto____6765 = cljs.core._key["_"];
        if(or__138__auto____6765) {
          return or__138__auto____6765
        }else {
          throw cljs.core.missing_protocol.call(null, "IMapEntry.-key", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._val = function _val(coll) {
  if(function() {
    var and__132__auto____6766 = coll;
    if(and__132__auto____6766) {
      return coll.cljs$core$IMapEntry$_val$arity$1
    }else {
      return and__132__auto____6766
    }
  }()) {
    return coll.cljs$core$IMapEntry$_val$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6767 = cljs.core._val[goog.typeOf.call(null, coll)];
      if(or__138__auto____6767) {
        return or__138__auto____6767
      }else {
        var or__138__auto____6768 = cljs.core._val["_"];
        if(or__138__auto____6768) {
          return or__138__auto____6768
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
    var and__132__auto____6769 = coll;
    if(and__132__auto____6769) {
      return coll.cljs$core$ISet$_disjoin$arity$2
    }else {
      return and__132__auto____6769
    }
  }()) {
    return coll.cljs$core$ISet$_disjoin$arity$2(coll, v)
  }else {
    return function() {
      var or__138__auto____6770 = cljs.core._disjoin[goog.typeOf.call(null, coll)];
      if(or__138__auto____6770) {
        return or__138__auto____6770
      }else {
        var or__138__auto____6771 = cljs.core._disjoin["_"];
        if(or__138__auto____6771) {
          return or__138__auto____6771
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
    var and__132__auto____6772 = coll;
    if(and__132__auto____6772) {
      return coll.cljs$core$IStack$_peek$arity$1
    }else {
      return and__132__auto____6772
    }
  }()) {
    return coll.cljs$core$IStack$_peek$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6773 = cljs.core._peek[goog.typeOf.call(null, coll)];
      if(or__138__auto____6773) {
        return or__138__auto____6773
      }else {
        var or__138__auto____6774 = cljs.core._peek["_"];
        if(or__138__auto____6774) {
          return or__138__auto____6774
        }else {
          throw cljs.core.missing_protocol.call(null, "IStack.-peek", coll);
        }
      }
    }().call(null, coll)
  }
};
cljs.core._pop = function _pop(coll) {
  if(function() {
    var and__132__auto____6775 = coll;
    if(and__132__auto____6775) {
      return coll.cljs$core$IStack$_pop$arity$1
    }else {
      return and__132__auto____6775
    }
  }()) {
    return coll.cljs$core$IStack$_pop$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6776 = cljs.core._pop[goog.typeOf.call(null, coll)];
      if(or__138__auto____6776) {
        return or__138__auto____6776
      }else {
        var or__138__auto____6777 = cljs.core._pop["_"];
        if(or__138__auto____6777) {
          return or__138__auto____6777
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
    var and__132__auto____6778 = coll;
    if(and__132__auto____6778) {
      return coll.cljs$core$IVector$_assoc_n$arity$3
    }else {
      return and__132__auto____6778
    }
  }()) {
    return coll.cljs$core$IVector$_assoc_n$arity$3(coll, n, val)
  }else {
    return function() {
      var or__138__auto____6779 = cljs.core._assoc_n[goog.typeOf.call(null, coll)];
      if(or__138__auto____6779) {
        return or__138__auto____6779
      }else {
        var or__138__auto____6780 = cljs.core._assoc_n["_"];
        if(or__138__auto____6780) {
          return or__138__auto____6780
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
    var and__132__auto____6781 = o;
    if(and__132__auto____6781) {
      return o.cljs$core$IDeref$_deref$arity$1
    }else {
      return and__132__auto____6781
    }
  }()) {
    return o.cljs$core$IDeref$_deref$arity$1(o)
  }else {
    return function() {
      var or__138__auto____6782 = cljs.core._deref[goog.typeOf.call(null, o)];
      if(or__138__auto____6782) {
        return or__138__auto____6782
      }else {
        var or__138__auto____6783 = cljs.core._deref["_"];
        if(or__138__auto____6783) {
          return or__138__auto____6783
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
    var and__132__auto____6784 = o;
    if(and__132__auto____6784) {
      return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3
    }else {
      return and__132__auto____6784
    }
  }()) {
    return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(o, msec, timeout_val)
  }else {
    return function() {
      var or__138__auto____6785 = cljs.core._deref_with_timeout[goog.typeOf.call(null, o)];
      if(or__138__auto____6785) {
        return or__138__auto____6785
      }else {
        var or__138__auto____6786 = cljs.core._deref_with_timeout["_"];
        if(or__138__auto____6786) {
          return or__138__auto____6786
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
    var and__132__auto____6787 = o;
    if(and__132__auto____6787) {
      return o.cljs$core$IMeta$_meta$arity$1
    }else {
      return and__132__auto____6787
    }
  }()) {
    return o.cljs$core$IMeta$_meta$arity$1(o)
  }else {
    return function() {
      var or__138__auto____6788 = cljs.core._meta[goog.typeOf.call(null, o)];
      if(or__138__auto____6788) {
        return or__138__auto____6788
      }else {
        var or__138__auto____6789 = cljs.core._meta["_"];
        if(or__138__auto____6789) {
          return or__138__auto____6789
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
    var and__132__auto____6790 = o;
    if(and__132__auto____6790) {
      return o.cljs$core$IWithMeta$_with_meta$arity$2
    }else {
      return and__132__auto____6790
    }
  }()) {
    return o.cljs$core$IWithMeta$_with_meta$arity$2(o, meta)
  }else {
    return function() {
      var or__138__auto____6791 = cljs.core._with_meta[goog.typeOf.call(null, o)];
      if(or__138__auto____6791) {
        return or__138__auto____6791
      }else {
        var or__138__auto____6792 = cljs.core._with_meta["_"];
        if(or__138__auto____6792) {
          return or__138__auto____6792
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
      var and__132__auto____6793 = coll;
      if(and__132__auto____6793) {
        return coll.cljs$core$IReduce$_reduce$arity$2
      }else {
        return and__132__auto____6793
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce$arity$2(coll, f)
    }else {
      return function() {
        var or__138__auto____6794 = cljs.core._reduce[goog.typeOf.call(null, coll)];
        if(or__138__auto____6794) {
          return or__138__auto____6794
        }else {
          var or__138__auto____6795 = cljs.core._reduce["_"];
          if(or__138__auto____6795) {
            return or__138__auto____6795
          }else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f)
    }
  };
  var _reduce__3 = function(coll, f, start) {
    if(function() {
      var and__132__auto____6796 = coll;
      if(and__132__auto____6796) {
        return coll.cljs$core$IReduce$_reduce$arity$3
      }else {
        return and__132__auto____6796
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce$arity$3(coll, f, start)
    }else {
      return function() {
        var or__138__auto____6797 = cljs.core._reduce[goog.typeOf.call(null, coll)];
        if(or__138__auto____6797) {
          return or__138__auto____6797
        }else {
          var or__138__auto____6798 = cljs.core._reduce["_"];
          if(or__138__auto____6798) {
            return or__138__auto____6798
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
    var and__132__auto____6799 = coll;
    if(and__132__auto____6799) {
      return coll.cljs$core$IKVReduce$_kv_reduce$arity$3
    }else {
      return and__132__auto____6799
    }
  }()) {
    return coll.cljs$core$IKVReduce$_kv_reduce$arity$3(coll, f, init)
  }else {
    return function() {
      var or__138__auto____6800 = cljs.core._kv_reduce[goog.typeOf.call(null, coll)];
      if(or__138__auto____6800) {
        return or__138__auto____6800
      }else {
        var or__138__auto____6801 = cljs.core._kv_reduce["_"];
        if(or__138__auto____6801) {
          return or__138__auto____6801
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
    var and__132__auto____6802 = o;
    if(and__132__auto____6802) {
      return o.cljs$core$IEquiv$_equiv$arity$2
    }else {
      return and__132__auto____6802
    }
  }()) {
    return o.cljs$core$IEquiv$_equiv$arity$2(o, other)
  }else {
    return function() {
      var or__138__auto____6803 = cljs.core._equiv[goog.typeOf.call(null, o)];
      if(or__138__auto____6803) {
        return or__138__auto____6803
      }else {
        var or__138__auto____6804 = cljs.core._equiv["_"];
        if(or__138__auto____6804) {
          return or__138__auto____6804
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
    var and__132__auto____6805 = o;
    if(and__132__auto____6805) {
      return o.cljs$core$IHash$_hash$arity$1
    }else {
      return and__132__auto____6805
    }
  }()) {
    return o.cljs$core$IHash$_hash$arity$1(o)
  }else {
    return function() {
      var or__138__auto____6806 = cljs.core._hash[goog.typeOf.call(null, o)];
      if(or__138__auto____6806) {
        return or__138__auto____6806
      }else {
        var or__138__auto____6807 = cljs.core._hash["_"];
        if(or__138__auto____6807) {
          return or__138__auto____6807
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
    var and__132__auto____6808 = o;
    if(and__132__auto____6808) {
      return o.cljs$core$ISeqable$_seq$arity$1
    }else {
      return and__132__auto____6808
    }
  }()) {
    return o.cljs$core$ISeqable$_seq$arity$1(o)
  }else {
    return function() {
      var or__138__auto____6809 = cljs.core._seq[goog.typeOf.call(null, o)];
      if(or__138__auto____6809) {
        return or__138__auto____6809
      }else {
        var or__138__auto____6810 = cljs.core._seq["_"];
        if(or__138__auto____6810) {
          return or__138__auto____6810
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
    var and__132__auto____6811 = coll;
    if(and__132__auto____6811) {
      return coll.cljs$core$IReversible$_rseq$arity$1
    }else {
      return and__132__auto____6811
    }
  }()) {
    return coll.cljs$core$IReversible$_rseq$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6812 = cljs.core._rseq[goog.typeOf.call(null, coll)];
      if(or__138__auto____6812) {
        return or__138__auto____6812
      }else {
        var or__138__auto____6813 = cljs.core._rseq["_"];
        if(or__138__auto____6813) {
          return or__138__auto____6813
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
    var and__132__auto____6814 = coll;
    if(and__132__auto____6814) {
      return coll.cljs$core$ISorted$_sorted_seq$arity$2
    }else {
      return and__132__auto____6814
    }
  }()) {
    return coll.cljs$core$ISorted$_sorted_seq$arity$2(coll, ascending_QMARK_)
  }else {
    return function() {
      var or__138__auto____6815 = cljs.core._sorted_seq[goog.typeOf.call(null, coll)];
      if(or__138__auto____6815) {
        return or__138__auto____6815
      }else {
        var or__138__auto____6816 = cljs.core._sorted_seq["_"];
        if(or__138__auto____6816) {
          return or__138__auto____6816
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq", coll);
        }
      }
    }().call(null, coll, ascending_QMARK_)
  }
};
cljs.core._sorted_seq_from = function _sorted_seq_from(coll, k, ascending_QMARK_) {
  if(function() {
    var and__132__auto____6817 = coll;
    if(and__132__auto____6817) {
      return coll.cljs$core$ISorted$_sorted_seq_from$arity$3
    }else {
      return and__132__auto____6817
    }
  }()) {
    return coll.cljs$core$ISorted$_sorted_seq_from$arity$3(coll, k, ascending_QMARK_)
  }else {
    return function() {
      var or__138__auto____6818 = cljs.core._sorted_seq_from[goog.typeOf.call(null, coll)];
      if(or__138__auto____6818) {
        return or__138__auto____6818
      }else {
        var or__138__auto____6819 = cljs.core._sorted_seq_from["_"];
        if(or__138__auto____6819) {
          return or__138__auto____6819
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq-from", coll);
        }
      }
    }().call(null, coll, k, ascending_QMARK_)
  }
};
cljs.core._entry_key = function _entry_key(coll, entry) {
  if(function() {
    var and__132__auto____6820 = coll;
    if(and__132__auto____6820) {
      return coll.cljs$core$ISorted$_entry_key$arity$2
    }else {
      return and__132__auto____6820
    }
  }()) {
    return coll.cljs$core$ISorted$_entry_key$arity$2(coll, entry)
  }else {
    return function() {
      var or__138__auto____6821 = cljs.core._entry_key[goog.typeOf.call(null, coll)];
      if(or__138__auto____6821) {
        return or__138__auto____6821
      }else {
        var or__138__auto____6822 = cljs.core._entry_key["_"];
        if(or__138__auto____6822) {
          return or__138__auto____6822
        }else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-entry-key", coll);
        }
      }
    }().call(null, coll, entry)
  }
};
cljs.core._comparator = function _comparator(coll) {
  if(function() {
    var and__132__auto____6823 = coll;
    if(and__132__auto____6823) {
      return coll.cljs$core$ISorted$_comparator$arity$1
    }else {
      return and__132__auto____6823
    }
  }()) {
    return coll.cljs$core$ISorted$_comparator$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6824 = cljs.core._comparator[goog.typeOf.call(null, coll)];
      if(or__138__auto____6824) {
        return or__138__auto____6824
      }else {
        var or__138__auto____6825 = cljs.core._comparator["_"];
        if(or__138__auto____6825) {
          return or__138__auto____6825
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
    var and__132__auto____6826 = o;
    if(and__132__auto____6826) {
      return o.cljs$core$IPrintable$_pr_seq$arity$2
    }else {
      return and__132__auto____6826
    }
  }()) {
    return o.cljs$core$IPrintable$_pr_seq$arity$2(o, opts)
  }else {
    return function() {
      var or__138__auto____6827 = cljs.core._pr_seq[goog.typeOf.call(null, o)];
      if(or__138__auto____6827) {
        return or__138__auto____6827
      }else {
        var or__138__auto____6828 = cljs.core._pr_seq["_"];
        if(or__138__auto____6828) {
          return or__138__auto____6828
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
    var and__132__auto____6829 = d;
    if(and__132__auto____6829) {
      return d.cljs$core$IPending$_realized_QMARK_$arity$1
    }else {
      return and__132__auto____6829
    }
  }()) {
    return d.cljs$core$IPending$_realized_QMARK_$arity$1(d)
  }else {
    return function() {
      var or__138__auto____6830 = cljs.core._realized_QMARK_[goog.typeOf.call(null, d)];
      if(or__138__auto____6830) {
        return or__138__auto____6830
      }else {
        var or__138__auto____6831 = cljs.core._realized_QMARK_["_"];
        if(or__138__auto____6831) {
          return or__138__auto____6831
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
    var and__132__auto____6832 = this$;
    if(and__132__auto____6832) {
      return this$.cljs$core$IWatchable$_notify_watches$arity$3
    }else {
      return and__132__auto____6832
    }
  }()) {
    return this$.cljs$core$IWatchable$_notify_watches$arity$3(this$, oldval, newval)
  }else {
    return function() {
      var or__138__auto____6833 = cljs.core._notify_watches[goog.typeOf.call(null, this$)];
      if(or__138__auto____6833) {
        return or__138__auto____6833
      }else {
        var or__138__auto____6834 = cljs.core._notify_watches["_"];
        if(or__138__auto____6834) {
          return or__138__auto____6834
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", this$);
        }
      }
    }().call(null, this$, oldval, newval)
  }
};
cljs.core._add_watch = function _add_watch(this$, key, f) {
  if(function() {
    var and__132__auto____6835 = this$;
    if(and__132__auto____6835) {
      return this$.cljs$core$IWatchable$_add_watch$arity$3
    }else {
      return and__132__auto____6835
    }
  }()) {
    return this$.cljs$core$IWatchable$_add_watch$arity$3(this$, key, f)
  }else {
    return function() {
      var or__138__auto____6836 = cljs.core._add_watch[goog.typeOf.call(null, this$)];
      if(or__138__auto____6836) {
        return or__138__auto____6836
      }else {
        var or__138__auto____6837 = cljs.core._add_watch["_"];
        if(or__138__auto____6837) {
          return or__138__auto____6837
        }else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", this$);
        }
      }
    }().call(null, this$, key, f)
  }
};
cljs.core._remove_watch = function _remove_watch(this$, key) {
  if(function() {
    var and__132__auto____6838 = this$;
    if(and__132__auto____6838) {
      return this$.cljs$core$IWatchable$_remove_watch$arity$2
    }else {
      return and__132__auto____6838
    }
  }()) {
    return this$.cljs$core$IWatchable$_remove_watch$arity$2(this$, key)
  }else {
    return function() {
      var or__138__auto____6839 = cljs.core._remove_watch[goog.typeOf.call(null, this$)];
      if(or__138__auto____6839) {
        return or__138__auto____6839
      }else {
        var or__138__auto____6840 = cljs.core._remove_watch["_"];
        if(or__138__auto____6840) {
          return or__138__auto____6840
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
    var and__132__auto____6841 = coll;
    if(and__132__auto____6841) {
      return coll.cljs$core$IEditableCollection$_as_transient$arity$1
    }else {
      return and__132__auto____6841
    }
  }()) {
    return coll.cljs$core$IEditableCollection$_as_transient$arity$1(coll)
  }else {
    return function() {
      var or__138__auto____6842 = cljs.core._as_transient[goog.typeOf.call(null, coll)];
      if(or__138__auto____6842) {
        return or__138__auto____6842
      }else {
        var or__138__auto____6843 = cljs.core._as_transient["_"];
        if(or__138__auto____6843) {
          return or__138__auto____6843
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
    var and__132__auto____6844 = tcoll;
    if(and__132__auto____6844) {
      return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2
    }else {
      return and__132__auto____6844
    }
  }()) {
    return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2(tcoll, val)
  }else {
    return function() {
      var or__138__auto____6845 = cljs.core._conj_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6845) {
        return or__138__auto____6845
      }else {
        var or__138__auto____6846 = cljs.core._conj_BANG_["_"];
        if(or__138__auto____6846) {
          return or__138__auto____6846
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientCollection.-conj!", tcoll);
        }
      }
    }().call(null, tcoll, val)
  }
};
cljs.core._persistent_BANG_ = function _persistent_BANG_(tcoll) {
  if(function() {
    var and__132__auto____6847 = tcoll;
    if(and__132__auto____6847) {
      return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1
    }else {
      return and__132__auto____6847
    }
  }()) {
    return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(tcoll)
  }else {
    return function() {
      var or__138__auto____6848 = cljs.core._persistent_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6848) {
        return or__138__auto____6848
      }else {
        var or__138__auto____6849 = cljs.core._persistent_BANG_["_"];
        if(or__138__auto____6849) {
          return or__138__auto____6849
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
    var and__132__auto____6850 = tcoll;
    if(and__132__auto____6850) {
      return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3
    }else {
      return and__132__auto____6850
    }
  }()) {
    return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(tcoll, key, val)
  }else {
    return function() {
      var or__138__auto____6851 = cljs.core._assoc_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6851) {
        return or__138__auto____6851
      }else {
        var or__138__auto____6852 = cljs.core._assoc_BANG_["_"];
        if(or__138__auto____6852) {
          return or__138__auto____6852
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
    var and__132__auto____6853 = tcoll;
    if(and__132__auto____6853) {
      return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2
    }else {
      return and__132__auto____6853
    }
  }()) {
    return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(tcoll, key)
  }else {
    return function() {
      var or__138__auto____6854 = cljs.core._dissoc_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6854) {
        return or__138__auto____6854
      }else {
        var or__138__auto____6855 = cljs.core._dissoc_BANG_["_"];
        if(or__138__auto____6855) {
          return or__138__auto____6855
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
    var and__132__auto____6856 = tcoll;
    if(and__132__auto____6856) {
      return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3
    }else {
      return and__132__auto____6856
    }
  }()) {
    return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(tcoll, n, val)
  }else {
    return function() {
      var or__138__auto____6857 = cljs.core._assoc_n_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6857) {
        return or__138__auto____6857
      }else {
        var or__138__auto____6858 = cljs.core._assoc_n_BANG_["_"];
        if(or__138__auto____6858) {
          return or__138__auto____6858
        }else {
          throw cljs.core.missing_protocol.call(null, "ITransientVector.-assoc-n!", tcoll);
        }
      }
    }().call(null, tcoll, n, val)
  }
};
cljs.core._pop_BANG_ = function _pop_BANG_(tcoll) {
  if(function() {
    var and__132__auto____6859 = tcoll;
    if(and__132__auto____6859) {
      return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1
    }else {
      return and__132__auto____6859
    }
  }()) {
    return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1(tcoll)
  }else {
    return function() {
      var or__138__auto____6860 = cljs.core._pop_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6860) {
        return or__138__auto____6860
      }else {
        var or__138__auto____6861 = cljs.core._pop_BANG_["_"];
        if(or__138__auto____6861) {
          return or__138__auto____6861
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
    var and__132__auto____6862 = tcoll;
    if(and__132__auto____6862) {
      return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2
    }else {
      return and__132__auto____6862
    }
  }()) {
    return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(tcoll, v)
  }else {
    return function() {
      var or__138__auto____6863 = cljs.core._disjoin_BANG_[goog.typeOf.call(null, tcoll)];
      if(or__138__auto____6863) {
        return or__138__auto____6863
      }else {
        var or__138__auto____6864 = cljs.core._disjoin_BANG_["_"];
        if(or__138__auto____6864) {
          return or__138__auto____6864
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
    var or__138__auto____6865 = x === y;
    if(or__138__auto____6865) {
      return or__138__auto____6865
    }else {
      return cljs.core._equiv.call(null, x, y)
    }
  };
  var _EQ___3 = function() {
    var G__6866__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ_.call(null, x, y))) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__6867 = y;
            var G__6868 = cljs.core.first.call(null, more);
            var G__6869 = cljs.core.next.call(null, more);
            x = G__6867;
            y = G__6868;
            more = G__6869;
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
    var G__6866 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6866__delegate.call(this, x, y, more)
    };
    G__6866.cljs$lang$maxFixedArity = 2;
    G__6866.cljs$lang$applyTo = function(arglist__6870) {
      var x = cljs.core.first(arglist__6870);
      var y = cljs.core.first(cljs.core.next(arglist__6870));
      var more = cljs.core.rest(cljs.core.next(arglist__6870));
      return G__6866__delegate(x, y, more)
    };
    G__6866.cljs$lang$arity$variadic = G__6866__delegate;
    return G__6866
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
    var or__138__auto____6871 = x == null;
    if(or__138__auto____6871) {
      return or__138__auto____6871
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
  var G__6872 = null;
  var G__6872__2 = function(o, k) {
    return null
  };
  var G__6872__3 = function(o, k, not_found) {
    return not_found
  };
  G__6872 = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6872__2.call(this, o, k);
      case 3:
        return G__6872__3.call(this, o, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6872
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
  var G__6873 = null;
  var G__6873__2 = function(_, f) {
    return f.call(null)
  };
  var G__6873__3 = function(_, f, start) {
    return start
  };
  G__6873 = function(_, f, start) {
    switch(arguments.length) {
      case 2:
        return G__6873__2.call(this, _, f);
      case 3:
        return G__6873__3.call(this, _, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6873
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
  var G__6874 = null;
  var G__6874__2 = function(_, n) {
    return null
  };
  var G__6874__3 = function(_, n, not_found) {
    return not_found
  };
  G__6874 = function(_, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6874__2.call(this, _, n);
      case 3:
        return G__6874__3.call(this, _, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6874
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
      var val__6875 = cljs.core._nth.call(null, cicoll, 0);
      var n__6876 = 1;
      while(true) {
        if(n__6876 < cljs.core._count.call(null, cicoll)) {
          var nval__6877 = f.call(null, val__6875, cljs.core._nth.call(null, cicoll, n__6876));
          if(cljs.core.reduced_QMARK_.call(null, nval__6877)) {
            return cljs.core.deref.call(null, nval__6877)
          }else {
            var G__6884 = nval__6877;
            var G__6885 = n__6876 + 1;
            val__6875 = G__6884;
            n__6876 = G__6885;
            continue
          }
        }else {
          return val__6875
        }
        break
      }
    }
  };
  var ci_reduce__3 = function(cicoll, f, val) {
    var val__6878 = val;
    var n__6879 = 0;
    while(true) {
      if(n__6879 < cljs.core._count.call(null, cicoll)) {
        var nval__6880 = f.call(null, val__6878, cljs.core._nth.call(null, cicoll, n__6879));
        if(cljs.core.reduced_QMARK_.call(null, nval__6880)) {
          return cljs.core.deref.call(null, nval__6880)
        }else {
          var G__6886 = nval__6880;
          var G__6887 = n__6879 + 1;
          val__6878 = G__6886;
          n__6879 = G__6887;
          continue
        }
      }else {
        return val__6878
      }
      break
    }
  };
  var ci_reduce__4 = function(cicoll, f, val, idx) {
    var val__6881 = val;
    var n__6882 = idx;
    while(true) {
      if(n__6882 < cljs.core._count.call(null, cicoll)) {
        var nval__6883 = f.call(null, val__6881, cljs.core._nth.call(null, cicoll, n__6882));
        if(cljs.core.reduced_QMARK_.call(null, nval__6883)) {
          return cljs.core.deref.call(null, nval__6883)
        }else {
          var G__6888 = nval__6883;
          var G__6889 = n__6882 + 1;
          val__6881 = G__6888;
          n__6882 = G__6889;
          continue
        }
      }else {
        return val__6881
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
  var this__6890 = this;
  return cljs.core.hash_coll.call(null, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__6891 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.IndexedSeq.prototype.cljs$core$ASeq$ = true;
cljs.core.IndexedSeq.prototype.toString = function() {
  var this__6892 = this;
  var this$__6893 = this;
  return cljs.core.pr_str.call(null, this$__6893)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var this__6894 = this;
  if(cljs.core.counted_QMARK_.call(null, this__6894.a)) {
    return cljs.core.ci_reduce.call(null, this__6894.a, f, this__6894.a[this__6894.i], this__6894.i + 1)
  }else {
    return cljs.core.ci_reduce.call(null, coll, f, this__6894.a[this__6894.i], 0)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var this__6895 = this;
  if(cljs.core.counted_QMARK_.call(null, this__6895.a)) {
    return cljs.core.ci_reduce.call(null, this__6895.a, f, start, this__6895.i)
  }else {
    return cljs.core.ci_reduce.call(null, coll, f, start, 0)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__6896 = this;
  return this$
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var this__6897 = this;
  return this__6897.a.length - this__6897.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(_) {
  var this__6898 = this;
  return this__6898.a[this__6898.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(_) {
  var this__6899 = this;
  if(this__6899.i + 1 < this__6899.a.length) {
    return new cljs.core.IndexedSeq(this__6899.a, this__6899.i + 1)
  }else {
    return cljs.core.list.call(null)
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__6900 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__6901 = this;
  var i__6902 = n + this__6901.i;
  if(i__6902 < this__6901.a.length) {
    return this__6901.a[i__6902]
  }else {
    return null
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__6903 = this;
  var i__6904 = n + this__6903.i;
  if(i__6904 < this__6903.a.length) {
    return this__6903.a[i__6904]
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
  var G__6905 = null;
  var G__6905__2 = function(array, f) {
    return cljs.core.ci_reduce.call(null, array, f)
  };
  var G__6905__3 = function(array, f, start) {
    return cljs.core.ci_reduce.call(null, array, f, start)
  };
  G__6905 = function(array, f, start) {
    switch(arguments.length) {
      case 2:
        return G__6905__2.call(this, array, f);
      case 3:
        return G__6905__3.call(this, array, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6905
}();
cljs.core.ILookup["array"] = true;
cljs.core._lookup["array"] = function() {
  var G__6906 = null;
  var G__6906__2 = function(array, k) {
    return array[k]
  };
  var G__6906__3 = function(array, k, not_found) {
    return cljs.core._nth.call(null, array, k, not_found)
  };
  G__6906 = function(array, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6906__2.call(this, array, k);
      case 3:
        return G__6906__3.call(this, array, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6906
}();
cljs.core.IIndexed["array"] = true;
cljs.core._nth["array"] = function() {
  var G__6907 = null;
  var G__6907__2 = function(array, n) {
    if(n < array.length) {
      return array[n]
    }else {
      return null
    }
  };
  var G__6907__3 = function(array, n, not_found) {
    if(n < array.length) {
      return array[n]
    }else {
      return not_found
    }
  };
  G__6907 = function(array, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__6907__2.call(this, array, n);
      case 3:
        return G__6907__3.call(this, array, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__6907
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
      var G__6908__6909 = coll;
      if(G__6908__6909 != null) {
        if(function() {
          var or__138__auto____6910 = G__6908__6909.cljs$lang$protocol_mask$partition0$ & 32;
          if(or__138__auto____6910) {
            return or__138__auto____6910
          }else {
            return G__6908__6909.cljs$core$ASeq$
          }
        }()) {
          return true
        }else {
          if(!G__6908__6909.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__6908__6909)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__6908__6909)
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
      var G__6911__6912 = coll;
      if(G__6911__6912 != null) {
        if(function() {
          var or__138__auto____6913 = G__6911__6912.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__138__auto____6913) {
            return or__138__auto____6913
          }else {
            return G__6911__6912.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__6911__6912.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6911__6912)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6911__6912)
      }
    }()) {
      return cljs.core._first.call(null, coll)
    }else {
      var s__6914 = cljs.core.seq.call(null, coll);
      if(s__6914 != null) {
        return cljs.core._first.call(null, s__6914)
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
      var G__6915__6916 = coll;
      if(G__6915__6916 != null) {
        if(function() {
          var or__138__auto____6917 = G__6915__6916.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__138__auto____6917) {
            return or__138__auto____6917
          }else {
            return G__6915__6916.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__6915__6916.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6915__6916)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6915__6916)
      }
    }()) {
      return cljs.core._rest.call(null, coll)
    }else {
      var s__6918 = cljs.core.seq.call(null, coll);
      if(s__6918 != null) {
        return cljs.core._rest.call(null, s__6918)
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
      var G__6919__6920 = coll;
      if(G__6919__6920 != null) {
        if(function() {
          var or__138__auto____6921 = G__6919__6920.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__138__auto____6921) {
            return or__138__auto____6921
          }else {
            return G__6919__6920.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__6919__6920.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6919__6920)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__6919__6920)
      }
    }()) {
      var coll__6922 = cljs.core._rest.call(null, coll);
      if(coll__6922 != null) {
        if(function() {
          var G__6923__6924 = coll__6922;
          if(G__6923__6924 != null) {
            if(function() {
              var or__138__auto____6925 = G__6923__6924.cljs$lang$protocol_mask$partition0$ & 32;
              if(or__138__auto____6925) {
                return or__138__auto____6925
              }else {
                return G__6923__6924.cljs$core$ASeq$
              }
            }()) {
              return true
            }else {
              if(!G__6923__6924.cljs$lang$protocol_mask$partition0$) {
                return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__6923__6924)
              }else {
                return false
              }
            }
          }else {
            return cljs.core.type_satisfies_.call(null, cljs.core.ASeq, G__6923__6924)
          }
        }()) {
          return coll__6922
        }else {
          return cljs.core._seq.call(null, coll__6922)
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
      var G__6926 = cljs.core.next.call(null, s);
      s = G__6926;
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
    var G__6927__delegate = function(coll, x, xs) {
      while(true) {
        if(cljs.core.truth_(xs)) {
          var G__6928 = conj.call(null, coll, x);
          var G__6929 = cljs.core.first.call(null, xs);
          var G__6930 = cljs.core.next.call(null, xs);
          coll = G__6928;
          x = G__6929;
          xs = G__6930;
          continue
        }else {
          return conj.call(null, coll, x)
        }
        break
      }
    };
    var G__6927 = function(coll, x, var_args) {
      var xs = null;
      if(goog.isDef(var_args)) {
        xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6927__delegate.call(this, coll, x, xs)
    };
    G__6927.cljs$lang$maxFixedArity = 2;
    G__6927.cljs$lang$applyTo = function(arglist__6931) {
      var coll = cljs.core.first(arglist__6931);
      var x = cljs.core.first(cljs.core.next(arglist__6931));
      var xs = cljs.core.rest(cljs.core.next(arglist__6931));
      return G__6927__delegate(coll, x, xs)
    };
    G__6927.cljs$lang$arity$variadic = G__6927__delegate;
    return G__6927
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
  var s__6932 = cljs.core.seq.call(null, coll);
  var acc__6933 = 0;
  while(true) {
    if(cljs.core.counted_QMARK_.call(null, s__6932)) {
      return acc__6933 + cljs.core._count.call(null, s__6932)
    }else {
      var G__6934 = cljs.core.next.call(null, s__6932);
      var G__6935 = acc__6933 + 1;
      s__6932 = G__6934;
      acc__6933 = G__6935;
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
        var G__6936__6937 = coll;
        if(G__6936__6937 != null) {
          if(function() {
            var or__138__auto____6938 = G__6936__6937.cljs$lang$protocol_mask$partition0$ & 16;
            if(or__138__auto____6938) {
              return or__138__auto____6938
            }else {
              return G__6936__6937.cljs$core$IIndexed$
            }
          }()) {
            return true
          }else {
            if(!G__6936__6937.cljs$lang$protocol_mask$partition0$) {
              return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6936__6937)
            }else {
              return false
            }
          }
        }else {
          return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6936__6937)
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
        var G__6939__6940 = coll;
        if(G__6939__6940 != null) {
          if(function() {
            var or__138__auto____6941 = G__6939__6940.cljs$lang$protocol_mask$partition0$ & 16;
            if(or__138__auto____6941) {
              return or__138__auto____6941
            }else {
              return G__6939__6940.cljs$core$IIndexed$
            }
          }()) {
            return true
          }else {
            if(!G__6939__6940.cljs$lang$protocol_mask$partition0$) {
              return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6939__6940)
            }else {
              return false
            }
          }
        }else {
          return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6939__6940)
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
    var G__6943__delegate = function(coll, k, v, kvs) {
      while(true) {
        var ret__6942 = assoc.call(null, coll, k, v);
        if(cljs.core.truth_(kvs)) {
          var G__6944 = ret__6942;
          var G__6945 = cljs.core.first.call(null, kvs);
          var G__6946 = cljs.core.second.call(null, kvs);
          var G__6947 = cljs.core.nnext.call(null, kvs);
          coll = G__6944;
          k = G__6945;
          v = G__6946;
          kvs = G__6947;
          continue
        }else {
          return ret__6942
        }
        break
      }
    };
    var G__6943 = function(coll, k, v, var_args) {
      var kvs = null;
      if(goog.isDef(var_args)) {
        kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__6943__delegate.call(this, coll, k, v, kvs)
    };
    G__6943.cljs$lang$maxFixedArity = 3;
    G__6943.cljs$lang$applyTo = function(arglist__6948) {
      var coll = cljs.core.first(arglist__6948);
      var k = cljs.core.first(cljs.core.next(arglist__6948));
      var v = cljs.core.first(cljs.core.next(cljs.core.next(arglist__6948)));
      var kvs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__6948)));
      return G__6943__delegate(coll, k, v, kvs)
    };
    G__6943.cljs$lang$arity$variadic = G__6943__delegate;
    return G__6943
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
    var G__6950__delegate = function(coll, k, ks) {
      while(true) {
        var ret__6949 = dissoc.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__6951 = ret__6949;
          var G__6952 = cljs.core.first.call(null, ks);
          var G__6953 = cljs.core.next.call(null, ks);
          coll = G__6951;
          k = G__6952;
          ks = G__6953;
          continue
        }else {
          return ret__6949
        }
        break
      }
    };
    var G__6950 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6950__delegate.call(this, coll, k, ks)
    };
    G__6950.cljs$lang$maxFixedArity = 2;
    G__6950.cljs$lang$applyTo = function(arglist__6954) {
      var coll = cljs.core.first(arglist__6954);
      var k = cljs.core.first(cljs.core.next(arglist__6954));
      var ks = cljs.core.rest(cljs.core.next(arglist__6954));
      return G__6950__delegate(coll, k, ks)
    };
    G__6950.cljs$lang$arity$variadic = G__6950__delegate;
    return G__6950
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
    var G__6955__6956 = o;
    if(G__6955__6956 != null) {
      if(function() {
        var or__138__auto____6957 = G__6955__6956.cljs$lang$protocol_mask$partition0$ & 65536;
        if(or__138__auto____6957) {
          return or__138__auto____6957
        }else {
          return G__6955__6956.cljs$core$IMeta$
        }
      }()) {
        return true
      }else {
        if(!G__6955__6956.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__6955__6956)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__6955__6956)
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
    var G__6959__delegate = function(coll, k, ks) {
      while(true) {
        var ret__6958 = disj.call(null, coll, k);
        if(cljs.core.truth_(ks)) {
          var G__6960 = ret__6958;
          var G__6961 = cljs.core.first.call(null, ks);
          var G__6962 = cljs.core.next.call(null, ks);
          coll = G__6960;
          k = G__6961;
          ks = G__6962;
          continue
        }else {
          return ret__6958
        }
        break
      }
    };
    var G__6959 = function(coll, k, var_args) {
      var ks = null;
      if(goog.isDef(var_args)) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__6959__delegate.call(this, coll, k, ks)
    };
    G__6959.cljs$lang$maxFixedArity = 2;
    G__6959.cljs$lang$applyTo = function(arglist__6963) {
      var coll = cljs.core.first(arglist__6963);
      var k = cljs.core.first(cljs.core.next(arglist__6963));
      var ks = cljs.core.rest(cljs.core.next(arglist__6963));
      return G__6959__delegate(coll, k, ks)
    };
    G__6959.cljs$lang$arity$variadic = G__6959__delegate;
    return G__6959
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
    var G__6964__6965 = x;
    if(G__6964__6965 != null) {
      if(function() {
        var or__138__auto____6966 = G__6964__6965.cljs$lang$protocol_mask$partition0$ & 8;
        if(or__138__auto____6966) {
          return or__138__auto____6966
        }else {
          return G__6964__6965.cljs$core$ICollection$
        }
      }()) {
        return true
      }else {
        if(!G__6964__6965.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, G__6964__6965)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, G__6964__6965)
    }
  }
};
cljs.core.set_QMARK_ = function set_QMARK_(x) {
  if(x == null) {
    return false
  }else {
    var G__6967__6968 = x;
    if(G__6967__6968 != null) {
      if(function() {
        var or__138__auto____6969 = G__6967__6968.cljs$lang$protocol_mask$partition0$ & 2048;
        if(or__138__auto____6969) {
          return or__138__auto____6969
        }else {
          return G__6967__6968.cljs$core$ISet$
        }
      }()) {
        return true
      }else {
        if(!G__6967__6968.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ISet, G__6967__6968)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISet, G__6967__6968)
    }
  }
};
cljs.core.associative_QMARK_ = function associative_QMARK_(x) {
  var G__6970__6971 = x;
  if(G__6970__6971 != null) {
    if(function() {
      var or__138__auto____6972 = G__6970__6971.cljs$lang$protocol_mask$partition0$ & 256;
      if(or__138__auto____6972) {
        return or__138__auto____6972
      }else {
        return G__6970__6971.cljs$core$IAssociative$
      }
    }()) {
      return true
    }else {
      if(!G__6970__6971.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, G__6970__6971)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, G__6970__6971)
  }
};
cljs.core.sequential_QMARK_ = function sequential_QMARK_(x) {
  var G__6973__6974 = x;
  if(G__6973__6974 != null) {
    if(function() {
      var or__138__auto____6975 = G__6973__6974.cljs$lang$protocol_mask$partition0$ & 8388608;
      if(or__138__auto____6975) {
        return or__138__auto____6975
      }else {
        return G__6973__6974.cljs$core$ISequential$
      }
    }()) {
      return true
    }else {
      if(!G__6973__6974.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, G__6973__6974)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, G__6973__6974)
  }
};
cljs.core.counted_QMARK_ = function counted_QMARK_(x) {
  var G__6976__6977 = x;
  if(G__6976__6977 != null) {
    if(function() {
      var or__138__auto____6978 = G__6976__6977.cljs$lang$protocol_mask$partition0$ & 2;
      if(or__138__auto____6978) {
        return or__138__auto____6978
      }else {
        return G__6976__6977.cljs$core$ICounted$
      }
    }()) {
      return true
    }else {
      if(!G__6976__6977.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, G__6976__6977)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, G__6976__6977)
  }
};
cljs.core.indexed_QMARK_ = function indexed_QMARK_(x) {
  var G__6979__6980 = x;
  if(G__6979__6980 != null) {
    if(function() {
      var or__138__auto____6981 = G__6979__6980.cljs$lang$protocol_mask$partition0$ & 16;
      if(or__138__auto____6981) {
        return or__138__auto____6981
      }else {
        return G__6979__6980.cljs$core$IIndexed$
      }
    }()) {
      return true
    }else {
      if(!G__6979__6980.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6979__6980)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, G__6979__6980)
  }
};
cljs.core.reduceable_QMARK_ = function reduceable_QMARK_(x) {
  var G__6982__6983 = x;
  if(G__6982__6983 != null) {
    if(function() {
      var or__138__auto____6984 = G__6982__6983.cljs$lang$protocol_mask$partition0$ & 262144;
      if(or__138__auto____6984) {
        return or__138__auto____6984
      }else {
        return G__6982__6983.cljs$core$IReduce$
      }
    }()) {
      return true
    }else {
      if(!G__6982__6983.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__6982__6983)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__6982__6983)
  }
};
cljs.core.map_QMARK_ = function map_QMARK_(x) {
  if(x == null) {
    return false
  }else {
    var G__6985__6986 = x;
    if(G__6985__6986 != null) {
      if(function() {
        var or__138__auto____6987 = G__6985__6986.cljs$lang$protocol_mask$partition0$ & 512;
        if(or__138__auto____6987) {
          return or__138__auto____6987
        }else {
          return G__6985__6986.cljs$core$IMap$
        }
      }()) {
        return true
      }else {
        if(!G__6985__6986.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IMap, G__6985__6986)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IMap, G__6985__6986)
    }
  }
};
cljs.core.vector_QMARK_ = function vector_QMARK_(x) {
  var G__6988__6989 = x;
  if(G__6988__6989 != null) {
    if(function() {
      var or__138__auto____6990 = G__6988__6989.cljs$lang$protocol_mask$partition0$ & 8192;
      if(or__138__auto____6990) {
        return or__138__auto____6990
      }else {
        return G__6988__6989.cljs$core$IVector$
      }
    }()) {
      return true
    }else {
      if(!G__6988__6989.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IVector, G__6988__6989)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IVector, G__6988__6989)
  }
};
cljs.core.js_obj = function() {
  var js_obj = null;
  var js_obj__0 = function() {
    return{}
  };
  var js_obj__1 = function() {
    var G__6991__delegate = function(keyvals) {
      return cljs.core.apply.call(null, goog.object.create, keyvals)
    };
    var G__6991 = function(var_args) {
      var keyvals = null;
      if(goog.isDef(var_args)) {
        keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__6991__delegate.call(this, keyvals)
    };
    G__6991.cljs$lang$maxFixedArity = 0;
    G__6991.cljs$lang$applyTo = function(arglist__6992) {
      var keyvals = cljs.core.seq(arglist__6992);
      return G__6991__delegate(keyvals)
    };
    G__6991.cljs$lang$arity$variadic = G__6991__delegate;
    return G__6991
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
  var keys__6993 = [];
  goog.object.forEach.call(null, obj, function(val, key, obj) {
    return keys__6993.push(key)
  });
  return keys__6993
};
cljs.core.js_delete = function js_delete(obj, key) {
  return delete obj[key]
};
cljs.core.array_copy = function array_copy(from, i, to, j, len) {
  var i__6994 = i;
  var j__6995 = j;
  var len__6996 = len;
  while(true) {
    if(len__6996 === 0) {
      return to
    }else {
      to[j__6995] = from[i__6994];
      var G__6997 = i__6994 + 1;
      var G__6998 = j__6995 + 1;
      var G__6999 = len__6996 - 1;
      i__6994 = G__6997;
      j__6995 = G__6998;
      len__6996 = G__6999;
      continue
    }
    break
  }
};
cljs.core.array_copy_downward = function array_copy_downward(from, i, to, j, len) {
  var i__7000 = i + (len - 1);
  var j__7001 = j + (len - 1);
  var len__7002 = len;
  while(true) {
    if(len__7002 === 0) {
      return to
    }else {
      to[j__7001] = from[i__7000];
      var G__7003 = i__7000 - 1;
      var G__7004 = j__7001 - 1;
      var G__7005 = len__7002 - 1;
      i__7000 = G__7003;
      j__7001 = G__7004;
      len__7002 = G__7005;
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
    var G__7006__7007 = s;
    if(G__7006__7007 != null) {
      if(function() {
        var or__138__auto____7008 = G__7006__7007.cljs$lang$protocol_mask$partition0$ & 64;
        if(or__138__auto____7008) {
          return or__138__auto____7008
        }else {
          return G__7006__7007.cljs$core$ISeq$
        }
      }()) {
        return true
      }else {
        if(!G__7006__7007.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__7006__7007)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__7006__7007)
    }
  }
};
cljs.core.seqable_QMARK_ = function seqable_QMARK_(s) {
  var G__7009__7010 = s;
  if(G__7009__7010 != null) {
    if(function() {
      var or__138__auto____7011 = G__7009__7010.cljs$lang$protocol_mask$partition0$ & 4194304;
      if(or__138__auto____7011) {
        return or__138__auto____7011
      }else {
        return G__7009__7010.cljs$core$ISeqable$
      }
    }()) {
      return true
    }else {
      if(!G__7009__7010.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, G__7009__7010)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, G__7009__7010)
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
  var and__132__auto____7012 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__132__auto____7012)) {
    return cljs.core.not.call(null, function() {
      var or__138__auto____7013 = x.charAt(0) === "\ufdd0";
      if(or__138__auto____7013) {
        return or__138__auto____7013
      }else {
        return x.charAt(0) === "\ufdd1"
      }
    }())
  }else {
    return and__132__auto____7012
  }
};
cljs.core.keyword_QMARK_ = function keyword_QMARK_(x) {
  var and__132__auto____7014 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__132__auto____7014)) {
    return x.charAt(0) === "\ufdd0"
  }else {
    return and__132__auto____7014
  }
};
cljs.core.symbol_QMARK_ = function symbol_QMARK_(x) {
  var and__132__auto____7015 = goog.isString.call(null, x);
  if(cljs.core.truth_(and__132__auto____7015)) {
    return x.charAt(0) === "\ufdd1"
  }else {
    return and__132__auto____7015
  }
};
cljs.core.number_QMARK_ = function number_QMARK_(n) {
  return goog.isNumber.call(null, n)
};
cljs.core.fn_QMARK_ = function fn_QMARK_(f) {
  return goog.isFunction.call(null, f)
};
cljs.core.ifn_QMARK_ = function ifn_QMARK_(f) {
  var or__138__auto____7016 = cljs.core.fn_QMARK_.call(null, f);
  if(or__138__auto____7016) {
    return or__138__auto____7016
  }else {
    var G__7017__7018 = f;
    if(G__7017__7018 != null) {
      if(function() {
        var or__138__auto____7019 = G__7017__7018.cljs$lang$protocol_mask$partition0$ & 1;
        if(or__138__auto____7019) {
          return or__138__auto____7019
        }else {
          return G__7017__7018.cljs$core$IFn$
        }
      }()) {
        return true
      }else {
        if(!G__7017__7018.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IFn, G__7017__7018)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IFn, G__7017__7018)
    }
  }
};
cljs.core.integer_QMARK_ = function integer_QMARK_(n) {
  var and__132__auto____7020 = cljs.core.number_QMARK_.call(null, n);
  if(and__132__auto____7020) {
    return n == n.toFixed()
  }else {
    return and__132__auto____7020
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
    var and__132__auto____7021 = coll;
    if(cljs.core.truth_(and__132__auto____7021)) {
      var and__132__auto____7022 = cljs.core.associative_QMARK_.call(null, coll);
      if(and__132__auto____7022) {
        return cljs.core.contains_QMARK_.call(null, coll, k)
      }else {
        return and__132__auto____7022
      }
    }else {
      return and__132__auto____7021
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
    var G__7027__delegate = function(x, y, more) {
      if(cljs.core.not.call(null, cljs.core._EQ_.call(null, x, y))) {
        var s__7023 = cljs.core.set([y, x]);
        var xs__7024 = more;
        while(true) {
          var x__7025 = cljs.core.first.call(null, xs__7024);
          var etc__7026 = cljs.core.next.call(null, xs__7024);
          if(cljs.core.truth_(xs__7024)) {
            if(cljs.core.contains_QMARK_.call(null, s__7023, x__7025)) {
              return false
            }else {
              var G__7028 = cljs.core.conj.call(null, s__7023, x__7025);
              var G__7029 = etc__7026;
              s__7023 = G__7028;
              xs__7024 = G__7029;
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
    var G__7027 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7027__delegate.call(this, x, y, more)
    };
    G__7027.cljs$lang$maxFixedArity = 2;
    G__7027.cljs$lang$applyTo = function(arglist__7030) {
      var x = cljs.core.first(arglist__7030);
      var y = cljs.core.first(cljs.core.next(arglist__7030));
      var more = cljs.core.rest(cljs.core.next(arglist__7030));
      return G__7027__delegate(x, y, more)
    };
    G__7027.cljs$lang$arity$variadic = G__7027__delegate;
    return G__7027
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
      var r__7031 = f.call(null, x, y);
      if(cljs.core.number_QMARK_.call(null, r__7031)) {
        return r__7031
      }else {
        if(cljs.core.truth_(r__7031)) {
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
      var a__7032 = cljs.core.to_array.call(null, coll);
      goog.array.stableSort.call(null, a__7032, cljs.core.fn__GT_comparator.call(null, comp));
      return cljs.core.seq.call(null, a__7032)
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
    var temp__317__auto____7033 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__317__auto____7033)) {
      var s__7034 = temp__317__auto____7033;
      return cljs.core.reduce.call(null, f, cljs.core.first.call(null, s__7034), cljs.core.next.call(null, s__7034))
    }else {
      return f.call(null)
    }
  };
  var seq_reduce__3 = function(f, val, coll) {
    var val__7035 = val;
    var coll__7036 = cljs.core.seq.call(null, coll);
    while(true) {
      if(cljs.core.truth_(coll__7036)) {
        var nval__7037 = f.call(null, val__7035, cljs.core.first.call(null, coll__7036));
        if(cljs.core.reduced_QMARK_.call(null, nval__7037)) {
          return cljs.core.deref.call(null, nval__7037)
        }else {
          var G__7038 = nval__7037;
          var G__7039 = cljs.core.next.call(null, coll__7036);
          val__7035 = G__7038;
          coll__7036 = G__7039;
          continue
        }
      }else {
        return val__7035
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
      var G__7040__7041 = coll;
      if(G__7040__7041 != null) {
        if(function() {
          var or__138__auto____7042 = G__7040__7041.cljs$lang$protocol_mask$partition0$ & 262144;
          if(or__138__auto____7042) {
            return or__138__auto____7042
          }else {
            return G__7040__7041.cljs$core$IReduce$
          }
        }()) {
          return true
        }else {
          if(!G__7040__7041.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__7040__7041)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__7040__7041)
      }
    }()) {
      return cljs.core._reduce.call(null, coll, f)
    }else {
      return cljs.core.seq_reduce.call(null, f, coll)
    }
  };
  var reduce__3 = function(f, val, coll) {
    if(function() {
      var G__7043__7044 = coll;
      if(G__7043__7044 != null) {
        if(function() {
          var or__138__auto____7045 = G__7043__7044.cljs$lang$protocol_mask$partition0$ & 262144;
          if(or__138__auto____7045) {
            return or__138__auto____7045
          }else {
            return G__7043__7044.cljs$core$IReduce$
          }
        }()) {
          return true
        }else {
          if(!G__7043__7044.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__7043__7044)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, G__7043__7044)
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
  var this__7046 = this;
  return this__7046.val
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
    var G__7047__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _PLUS_, x + y, more)
    };
    var G__7047 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7047__delegate.call(this, x, y, more)
    };
    G__7047.cljs$lang$maxFixedArity = 2;
    G__7047.cljs$lang$applyTo = function(arglist__7048) {
      var x = cljs.core.first(arglist__7048);
      var y = cljs.core.first(cljs.core.next(arglist__7048));
      var more = cljs.core.rest(cljs.core.next(arglist__7048));
      return G__7047__delegate(x, y, more)
    };
    G__7047.cljs$lang$arity$variadic = G__7047__delegate;
    return G__7047
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
    var G__7049__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _, x - y, more)
    };
    var G__7049 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7049__delegate.call(this, x, y, more)
    };
    G__7049.cljs$lang$maxFixedArity = 2;
    G__7049.cljs$lang$applyTo = function(arglist__7050) {
      var x = cljs.core.first(arglist__7050);
      var y = cljs.core.first(cljs.core.next(arglist__7050));
      var more = cljs.core.rest(cljs.core.next(arglist__7050));
      return G__7049__delegate(x, y, more)
    };
    G__7049.cljs$lang$arity$variadic = G__7049__delegate;
    return G__7049
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
    var G__7051__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _STAR_, x * y, more)
    };
    var G__7051 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7051__delegate.call(this, x, y, more)
    };
    G__7051.cljs$lang$maxFixedArity = 2;
    G__7051.cljs$lang$applyTo = function(arglist__7052) {
      var x = cljs.core.first(arglist__7052);
      var y = cljs.core.first(cljs.core.next(arglist__7052));
      var more = cljs.core.rest(cljs.core.next(arglist__7052));
      return G__7051__delegate(x, y, more)
    };
    G__7051.cljs$lang$arity$variadic = G__7051__delegate;
    return G__7051
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
    var G__7053__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _SLASH_, _SLASH_.call(null, x, y), more)
    };
    var G__7053 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7053__delegate.call(this, x, y, more)
    };
    G__7053.cljs$lang$maxFixedArity = 2;
    G__7053.cljs$lang$applyTo = function(arglist__7054) {
      var x = cljs.core.first(arglist__7054);
      var y = cljs.core.first(cljs.core.next(arglist__7054));
      var more = cljs.core.rest(cljs.core.next(arglist__7054));
      return G__7053__delegate(x, y, more)
    };
    G__7053.cljs$lang$arity$variadic = G__7053__delegate;
    return G__7053
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
    var G__7055__delegate = function(x, y, more) {
      while(true) {
        if(x < y) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__7056 = y;
            var G__7057 = cljs.core.first.call(null, more);
            var G__7058 = cljs.core.next.call(null, more);
            x = G__7056;
            y = G__7057;
            more = G__7058;
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
    var G__7055 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7055__delegate.call(this, x, y, more)
    };
    G__7055.cljs$lang$maxFixedArity = 2;
    G__7055.cljs$lang$applyTo = function(arglist__7059) {
      var x = cljs.core.first(arglist__7059);
      var y = cljs.core.first(cljs.core.next(arglist__7059));
      var more = cljs.core.rest(cljs.core.next(arglist__7059));
      return G__7055__delegate(x, y, more)
    };
    G__7055.cljs$lang$arity$variadic = G__7055__delegate;
    return G__7055
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
    var G__7060__delegate = function(x, y, more) {
      while(true) {
        if(x <= y) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__7061 = y;
            var G__7062 = cljs.core.first.call(null, more);
            var G__7063 = cljs.core.next.call(null, more);
            x = G__7061;
            y = G__7062;
            more = G__7063;
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
    var G__7060 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7060__delegate.call(this, x, y, more)
    };
    G__7060.cljs$lang$maxFixedArity = 2;
    G__7060.cljs$lang$applyTo = function(arglist__7064) {
      var x = cljs.core.first(arglist__7064);
      var y = cljs.core.first(cljs.core.next(arglist__7064));
      var more = cljs.core.rest(cljs.core.next(arglist__7064));
      return G__7060__delegate(x, y, more)
    };
    G__7060.cljs$lang$arity$variadic = G__7060__delegate;
    return G__7060
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
    var G__7065__delegate = function(x, y, more) {
      while(true) {
        if(x > y) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__7066 = y;
            var G__7067 = cljs.core.first.call(null, more);
            var G__7068 = cljs.core.next.call(null, more);
            x = G__7066;
            y = G__7067;
            more = G__7068;
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
    var G__7065 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7065__delegate.call(this, x, y, more)
    };
    G__7065.cljs$lang$maxFixedArity = 2;
    G__7065.cljs$lang$applyTo = function(arglist__7069) {
      var x = cljs.core.first(arglist__7069);
      var y = cljs.core.first(cljs.core.next(arglist__7069));
      var more = cljs.core.rest(cljs.core.next(arglist__7069));
      return G__7065__delegate(x, y, more)
    };
    G__7065.cljs$lang$arity$variadic = G__7065__delegate;
    return G__7065
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
    var G__7070__delegate = function(x, y, more) {
      while(true) {
        if(x >= y) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__7071 = y;
            var G__7072 = cljs.core.first.call(null, more);
            var G__7073 = cljs.core.next.call(null, more);
            x = G__7071;
            y = G__7072;
            more = G__7073;
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
    var G__7070 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7070__delegate.call(this, x, y, more)
    };
    G__7070.cljs$lang$maxFixedArity = 2;
    G__7070.cljs$lang$applyTo = function(arglist__7074) {
      var x = cljs.core.first(arglist__7074);
      var y = cljs.core.first(cljs.core.next(arglist__7074));
      var more = cljs.core.rest(cljs.core.next(arglist__7074));
      return G__7070__delegate(x, y, more)
    };
    G__7070.cljs$lang$arity$variadic = G__7070__delegate;
    return G__7070
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
    var G__7075__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, max, x > y ? x : y, more)
    };
    var G__7075 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7075__delegate.call(this, x, y, more)
    };
    G__7075.cljs$lang$maxFixedArity = 2;
    G__7075.cljs$lang$applyTo = function(arglist__7076) {
      var x = cljs.core.first(arglist__7076);
      var y = cljs.core.first(cljs.core.next(arglist__7076));
      var more = cljs.core.rest(cljs.core.next(arglist__7076));
      return G__7075__delegate(x, y, more)
    };
    G__7075.cljs$lang$arity$variadic = G__7075__delegate;
    return G__7075
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
    var G__7077__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, min, x < y ? x : y, more)
    };
    var G__7077 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7077__delegate.call(this, x, y, more)
    };
    G__7077.cljs$lang$maxFixedArity = 2;
    G__7077.cljs$lang$applyTo = function(arglist__7078) {
      var x = cljs.core.first(arglist__7078);
      var y = cljs.core.first(cljs.core.next(arglist__7078));
      var more = cljs.core.rest(cljs.core.next(arglist__7078));
      return G__7077__delegate(x, y, more)
    };
    G__7077.cljs$lang$arity$variadic = G__7077__delegate;
    return G__7077
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
  var rem__7079 = n % d;
  return cljs.core.fix.call(null, (n - rem__7079) / d)
};
cljs.core.rem = function rem(n, d) {
  var q__7080 = cljs.core.quot.call(null, n, d);
  return n - d * q__7080
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
  var c__7081 = 0;
  var n__7082 = n;
  while(true) {
    if(n__7082 === 0) {
      return c__7081
    }else {
      var G__7083 = c__7081 + 1;
      var G__7084 = n__7082 & n__7082 - 1;
      c__7081 = G__7083;
      n__7082 = G__7084;
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
    var G__7085__delegate = function(x, y, more) {
      while(true) {
        if(cljs.core.truth_(_EQ__EQ_.call(null, x, y))) {
          if(cljs.core.truth_(cljs.core.next.call(null, more))) {
            var G__7086 = y;
            var G__7087 = cljs.core.first.call(null, more);
            var G__7088 = cljs.core.next.call(null, more);
            x = G__7086;
            y = G__7087;
            more = G__7088;
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
    var G__7085 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7085__delegate.call(this, x, y, more)
    };
    G__7085.cljs$lang$maxFixedArity = 2;
    G__7085.cljs$lang$applyTo = function(arglist__7089) {
      var x = cljs.core.first(arglist__7089);
      var y = cljs.core.first(cljs.core.next(arglist__7089));
      var more = cljs.core.rest(cljs.core.next(arglist__7089));
      return G__7085__delegate(x, y, more)
    };
    G__7085.cljs$lang$arity$variadic = G__7085__delegate;
    return G__7085
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
  var n__7090 = n;
  var xs__7091 = cljs.core.seq.call(null, coll);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__132__auto____7092 = xs__7091;
      if(cljs.core.truth_(and__132__auto____7092)) {
        return n__7090 > 0
      }else {
        return and__132__auto____7092
      }
    }())) {
      var G__7093 = n__7090 - 1;
      var G__7094 = cljs.core.next.call(null, xs__7091);
      n__7090 = G__7093;
      xs__7091 = G__7094;
      continue
    }else {
      return xs__7091
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
    var G__7095__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__7096 = sb.append(str_STAR_.call(null, cljs.core.first.call(null, more)));
            var G__7097 = cljs.core.next.call(null, more);
            sb = G__7096;
            more = G__7097;
            continue
          }else {
            return str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str_STAR_.call(null, x)), ys)
    };
    var G__7095 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__7095__delegate.call(this, x, ys)
    };
    G__7095.cljs$lang$maxFixedArity = 1;
    G__7095.cljs$lang$applyTo = function(arglist__7098) {
      var x = cljs.core.first(arglist__7098);
      var ys = cljs.core.rest(arglist__7098);
      return G__7095__delegate(x, ys)
    };
    G__7095.cljs$lang$arity$variadic = G__7095__delegate;
    return G__7095
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
    var G__7099__delegate = function(x, ys) {
      return function(sb, more) {
        while(true) {
          if(cljs.core.truth_(more)) {
            var G__7100 = sb.append(str.call(null, cljs.core.first.call(null, more)));
            var G__7101 = cljs.core.next.call(null, more);
            sb = G__7100;
            more = G__7101;
            continue
          }else {
            return cljs.core.str_STAR_.call(null, sb)
          }
          break
        }
      }.call(null, new goog.string.StringBuffer(str.call(null, x)), ys)
    };
    var G__7099 = function(x, var_args) {
      var ys = null;
      if(goog.isDef(var_args)) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__7099__delegate.call(this, x, ys)
    };
    G__7099.cljs$lang$maxFixedArity = 1;
    G__7099.cljs$lang$applyTo = function(arglist__7102) {
      var x = cljs.core.first(arglist__7102);
      var ys = cljs.core.rest(arglist__7102);
      return G__7099__delegate(x, ys)
    };
    G__7099.cljs$lang$arity$variadic = G__7099__delegate;
    return G__7099
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
    var xs__7103 = cljs.core.seq.call(null, x);
    var ys__7104 = cljs.core.seq.call(null, y);
    while(true) {
      if(xs__7103 == null) {
        return ys__7104 == null
      }else {
        if(ys__7104 == null) {
          return false
        }else {
          if(cljs.core._EQ_.call(null, cljs.core.first.call(null, xs__7103), cljs.core.first.call(null, ys__7104))) {
            var G__7105 = cljs.core.next.call(null, xs__7103);
            var G__7106 = cljs.core.next.call(null, ys__7104);
            xs__7103 = G__7105;
            ys__7104 = G__7106;
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
  return cljs.core.reduce.call(null, function(p1__7107_SHARP_, p2__7108_SHARP_) {
    return cljs.core.hash_combine.call(null, p1__7107_SHARP_, cljs.core.hash.call(null, p2__7108_SHARP_))
  }, cljs.core.hash.call(null, cljs.core.first.call(null, coll)), cljs.core.next.call(null, coll))
};
void 0;
void 0;
cljs.core.hash_imap = function hash_imap(m) {
  var h__7109 = 0;
  var s__7110 = cljs.core.seq.call(null, m);
  while(true) {
    if(cljs.core.truth_(s__7110)) {
      var e__7111 = cljs.core.first.call(null, s__7110);
      var G__7112 = (h__7109 + (cljs.core.hash.call(null, cljs.core.key.call(null, e__7111)) ^ cljs.core.hash.call(null, cljs.core.val.call(null, e__7111)))) % 4503599627370496;
      var G__7113 = cljs.core.next.call(null, s__7110);
      h__7109 = G__7112;
      s__7110 = G__7113;
      continue
    }else {
      return h__7109
    }
    break
  }
};
cljs.core.hash_iset = function hash_iset(s) {
  var h__7114 = 0;
  var s__7115 = cljs.core.seq.call(null, s);
  while(true) {
    if(cljs.core.truth_(s__7115)) {
      var e__7116 = cljs.core.first.call(null, s__7115);
      var G__7117 = (h__7114 + cljs.core.hash.call(null, e__7116)) % 4503599627370496;
      var G__7118 = cljs.core.next.call(null, s__7115);
      h__7114 = G__7117;
      s__7115 = G__7118;
      continue
    }else {
      return h__7114
    }
    break
  }
};
void 0;
cljs.core.extend_object_BANG_ = function extend_object_BANG_(obj, fn_map) {
  var G__7119__7120 = cljs.core.seq.call(null, fn_map);
  if(cljs.core.truth_(G__7119__7120)) {
    var G__7122__7124 = cljs.core.first.call(null, G__7119__7120);
    var vec__7123__7125 = G__7122__7124;
    var key_name__7126 = cljs.core.nth.call(null, vec__7123__7125, 0, null);
    var f__7127 = cljs.core.nth.call(null, vec__7123__7125, 1, null);
    var G__7119__7128 = G__7119__7120;
    var G__7122__7129 = G__7122__7124;
    var G__7119__7130 = G__7119__7128;
    while(true) {
      var vec__7131__7132 = G__7122__7129;
      var key_name__7133 = cljs.core.nth.call(null, vec__7131__7132, 0, null);
      var f__7134 = cljs.core.nth.call(null, vec__7131__7132, 1, null);
      var G__7119__7135 = G__7119__7130;
      var str_name__7136 = cljs.core.name.call(null, key_name__7133);
      obj[str_name__7136] = f__7134;
      var temp__324__auto____7137 = cljs.core.next.call(null, G__7119__7135);
      if(cljs.core.truth_(temp__324__auto____7137)) {
        var G__7119__7138 = temp__324__auto____7137;
        var G__7139 = cljs.core.first.call(null, G__7119__7138);
        var G__7140 = G__7119__7138;
        G__7122__7129 = G__7139;
        G__7119__7130 = G__7140;
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
  var this__7141 = this;
  var h__2328__auto____7142 = this__7141.__hash;
  if(h__2328__auto____7142 != null) {
    return h__2328__auto____7142
  }else {
    var h__2328__auto____7143 = cljs.core.hash_coll.call(null, coll);
    this__7141.__hash = h__2328__auto____7143;
    return h__2328__auto____7143
  }
};
cljs.core.List.prototype.cljs$core$ISequential$ = true;
cljs.core.List.prototype.cljs$core$ICollection$ = true;
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7144 = this;
  return new cljs.core.List(this__7144.meta, o, coll, this__7144.count + 1, null)
};
cljs.core.List.prototype.cljs$core$ASeq$ = true;
cljs.core.List.prototype.toString = function() {
  var this__7145 = this;
  var this$__7146 = this;
  return cljs.core.pr_str.call(null, this$__7146)
};
cljs.core.List.prototype.cljs$core$ISeqable$ = true;
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7147 = this;
  return coll
};
cljs.core.List.prototype.cljs$core$ICounted$ = true;
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7148 = this;
  return this__7148.count
};
cljs.core.List.prototype.cljs$core$IStack$ = true;
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__7149 = this;
  return this__7149.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__7150 = this;
  return cljs.core._rest.call(null, coll)
};
cljs.core.List.prototype.cljs$core$ISeq$ = true;
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__7151 = this;
  return this__7151.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__7152 = this;
  return this__7152.rest
};
cljs.core.List.prototype.cljs$core$IEquiv$ = true;
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7153 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.List.prototype.cljs$core$IWithMeta$ = true;
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7154 = this;
  return new cljs.core.List(meta, this__7154.first, this__7154.rest, this__7154.count, this__7154.__hash)
};
cljs.core.List.prototype.cljs$core$IMeta$ = true;
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7155 = this;
  return this__7155.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7156 = this;
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
  var this__7157 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$ISequential$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7158 = this;
  return new cljs.core.List(this__7158.meta, o, null, 1, null)
};
cljs.core.EmptyList.prototype.toString = function() {
  var this__7159 = this;
  var this$__7160 = this;
  return cljs.core.pr_str.call(null, this$__7160)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7161 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7162 = this;
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$ = true;
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__7163 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__7164 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__7165 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__7166 = this;
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7167 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7168 = this;
  return new cljs.core.EmptyList(meta)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7169 = this;
  return this__7169.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7170 = this;
  return coll
};
cljs.core.EmptyList.prototype.cljs$core$IList$ = true;
cljs.core.EmptyList;
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function reversible_QMARK_(coll) {
  var G__7171__7172 = coll;
  if(G__7171__7172 != null) {
    if(function() {
      var or__138__auto____7173 = G__7171__7172.cljs$lang$protocol_mask$partition0$ & 67108864;
      if(or__138__auto____7173) {
        return or__138__auto____7173
      }else {
        return G__7171__7172.cljs$core$IReversible$
      }
    }()) {
      return true
    }else {
      if(!G__7171__7172.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IReversible, G__7171__7172)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IReversible, G__7171__7172)
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
  list.cljs$lang$applyTo = function(arglist__7174) {
    var items = cljs.core.seq(arglist__7174);
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
  var this__7175 = this;
  var h__2328__auto____7176 = this__7175.__hash;
  if(h__2328__auto____7176 != null) {
    return h__2328__auto____7176
  }else {
    var h__2328__auto____7177 = cljs.core.hash_coll.call(null, coll);
    this__7175.__hash = h__2328__auto____7177;
    return h__2328__auto____7177
  }
};
cljs.core.Cons.prototype.cljs$core$ISequential$ = true;
cljs.core.Cons.prototype.cljs$core$ICollection$ = true;
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7178 = this;
  return new cljs.core.Cons(null, o, coll, this__7178.__hash)
};
cljs.core.Cons.prototype.cljs$core$ASeq$ = true;
cljs.core.Cons.prototype.toString = function() {
  var this__7179 = this;
  var this$__7180 = this;
  return cljs.core.pr_str.call(null, this$__7180)
};
cljs.core.Cons.prototype.cljs$core$ISeqable$ = true;
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7181 = this;
  return coll
};
cljs.core.Cons.prototype.cljs$core$ISeq$ = true;
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__7182 = this;
  return this__7182.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__7183 = this;
  if(this__7183.rest == null) {
    return cljs.core.List.EMPTY
  }else {
    return this__7183.rest
  }
};
cljs.core.Cons.prototype.cljs$core$IEquiv$ = true;
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7184 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7185 = this;
  return new cljs.core.Cons(meta, this__7185.first, this__7185.rest, this__7185.__hash)
};
cljs.core.Cons.prototype.cljs$core$IMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7186 = this;
  return this__7186.meta
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7187 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__7187.meta)
};
cljs.core.Cons.prototype.cljs$core$IList$ = true;
cljs.core.Cons;
cljs.core.cons = function cons(x, coll) {
  if(function() {
    var or__138__auto____7188 = coll == null;
    if(or__138__auto____7188) {
      return or__138__auto____7188
    }else {
      var G__7189__7190 = coll;
      if(G__7189__7190 != null) {
        if(function() {
          var or__138__auto____7191 = G__7189__7190.cljs$lang$protocol_mask$partition0$ & 64;
          if(or__138__auto____7191) {
            return or__138__auto____7191
          }else {
            return G__7189__7190.cljs$core$ISeq$
          }
        }()) {
          return true
        }else {
          if(!G__7189__7190.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__7189__7190)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, G__7189__7190)
      }
    }
  }()) {
    return new cljs.core.Cons(null, x, coll, null)
  }else {
    return new cljs.core.Cons(null, x, cljs.core.seq.call(null, coll), null)
  }
};
cljs.core.list_QMARK_ = function list_QMARK_(x) {
  var G__7192__7193 = x;
  if(G__7192__7193 != null) {
    if(function() {
      var or__138__auto____7194 = G__7192__7193.cljs$lang$protocol_mask$partition0$ & 16777216;
      if(or__138__auto____7194) {
        return or__138__auto____7194
      }else {
        return G__7192__7193.cljs$core$IList$
      }
    }()) {
      return true
    }else {
      if(!G__7192__7193.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.type_satisfies_.call(null, cljs.core.IList, G__7192__7193)
      }else {
        return false
      }
    }
  }else {
    return cljs.core.type_satisfies_.call(null, cljs.core.IList, G__7192__7193)
  }
};
cljs.core.IReduce["string"] = true;
cljs.core._reduce["string"] = function() {
  var G__7195 = null;
  var G__7195__2 = function(string, f) {
    return cljs.core.ci_reduce.call(null, string, f)
  };
  var G__7195__3 = function(string, f, start) {
    return cljs.core.ci_reduce.call(null, string, f, start)
  };
  G__7195 = function(string, f, start) {
    switch(arguments.length) {
      case 2:
        return G__7195__2.call(this, string, f);
      case 3:
        return G__7195__3.call(this, string, f, start)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7195
}();
cljs.core.ILookup["string"] = true;
cljs.core._lookup["string"] = function() {
  var G__7196 = null;
  var G__7196__2 = function(string, k) {
    return cljs.core._nth.call(null, string, k)
  };
  var G__7196__3 = function(string, k, not_found) {
    return cljs.core._nth.call(null, string, k, not_found)
  };
  G__7196 = function(string, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7196__2.call(this, string, k);
      case 3:
        return G__7196__3.call(this, string, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7196
}();
cljs.core.IIndexed["string"] = true;
cljs.core._nth["string"] = function() {
  var G__7197 = null;
  var G__7197__2 = function(string, n) {
    if(n < cljs.core._count.call(null, string)) {
      return string.charAt(n)
    }else {
      return null
    }
  };
  var G__7197__3 = function(string, n, not_found) {
    if(n < cljs.core._count.call(null, string)) {
      return string.charAt(n)
    }else {
      return not_found
    }
  };
  G__7197 = function(string, n, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7197__2.call(this, string, n);
      case 3:
        return G__7197__3.call(this, string, n, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7197
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
  var G__7206 = null;
  var G__7206__2 = function(tsym7200, coll) {
    var tsym7200__7202 = this;
    var this$__7203 = tsym7200__7202;
    return cljs.core.get.call(null, coll, this$__7203.toString())
  };
  var G__7206__3 = function(tsym7201, coll, not_found) {
    var tsym7201__7204 = this;
    var this$__7205 = tsym7201__7204;
    return cljs.core.get.call(null, coll, this$__7205.toString(), not_found)
  };
  G__7206 = function(tsym7201, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7206__2.call(this, tsym7201, coll);
      case 3:
        return G__7206__3.call(this, tsym7201, coll, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7206
}();
String.prototype.apply = function(tsym7198, args7199) {
  return tsym7198.call.apply(tsym7198, [tsym7198].concat(cljs.core.aclone.call(null, args7199)))
};
String["prototype"]["apply"] = function(s, args) {
  if(cljs.core.count.call(null, args) < 2) {
    return cljs.core.get.call(null, args[0], s)
  }else {
    return cljs.core.get.call(null, args[0], s, args[1])
  }
};
cljs.core.lazy_seq_value = function lazy_seq_value(lazy_seq) {
  var x__7207 = lazy_seq.x;
  if(cljs.core.truth_(lazy_seq.realized)) {
    return x__7207
  }else {
    lazy_seq.x = x__7207.call(null);
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
  var this__7208 = this;
  var h__2328__auto____7209 = this__7208.__hash;
  if(h__2328__auto____7209 != null) {
    return h__2328__auto____7209
  }else {
    var h__2328__auto____7210 = cljs.core.hash_coll.call(null, coll);
    this__7208.__hash = h__2328__auto____7210;
    return h__2328__auto____7210
  }
};
cljs.core.LazySeq.prototype.cljs$core$ISequential$ = true;
cljs.core.LazySeq.prototype.cljs$core$ICollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7211 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.LazySeq.prototype.toString = function() {
  var this__7212 = this;
  var this$__7213 = this;
  return cljs.core.pr_str.call(null, this$__7213)
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7214 = this;
  return cljs.core.seq.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__7215 = this;
  return cljs.core.first.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__7216 = this;
  return cljs.core.rest.call(null, cljs.core.lazy_seq_value.call(null, coll))
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7217 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7218 = this;
  return new cljs.core.LazySeq(meta, this__7218.realized, this__7218.x, this__7218.__hash)
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7219 = this;
  return this__7219.meta
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7220 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__7220.meta)
};
cljs.core.LazySeq;
cljs.core.to_array = function to_array(s) {
  var ary__7221 = [];
  var s__7222 = s;
  while(true) {
    if(cljs.core.truth_(cljs.core.seq.call(null, s__7222))) {
      ary__7221.push(cljs.core.first.call(null, s__7222));
      var G__7223 = cljs.core.next.call(null, s__7222);
      s__7222 = G__7223;
      continue
    }else {
      return ary__7221
    }
    break
  }
};
cljs.core.to_array_2d = function to_array_2d(coll) {
  var ret__7224 = cljs.core.make_array.call(null, cljs.core.count.call(null, coll));
  var i__7225 = 0;
  var xs__7226 = cljs.core.seq.call(null, coll);
  while(true) {
    if(cljs.core.truth_(xs__7226)) {
      ret__7224[i__7225] = cljs.core.to_array.call(null, cljs.core.first.call(null, xs__7226));
      var G__7227 = i__7225 + 1;
      var G__7228 = cljs.core.next.call(null, xs__7226);
      i__7225 = G__7227;
      xs__7226 = G__7228;
      continue
    }else {
    }
    break
  }
  return ret__7224
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
    var a__7229 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__7230 = cljs.core.seq.call(null, init_val_or_seq);
      var i__7231 = 0;
      var s__7232 = s__7230;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__132__auto____7233 = s__7232;
          if(cljs.core.truth_(and__132__auto____7233)) {
            return i__7231 < size
          }else {
            return and__132__auto____7233
          }
        }())) {
          a__7229[i__7231] = cljs.core.first.call(null, s__7232);
          var G__7236 = i__7231 + 1;
          var G__7237 = cljs.core.next.call(null, s__7232);
          i__7231 = G__7236;
          s__7232 = G__7237;
          continue
        }else {
          return a__7229
        }
        break
      }
    }else {
      var n__2649__auto____7234 = size;
      var i__7235 = 0;
      while(true) {
        if(i__7235 < n__2649__auto____7234) {
          a__7229[i__7235] = init_val_or_seq;
          var G__7238 = i__7235 + 1;
          i__7235 = G__7238;
          continue
        }else {
        }
        break
      }
      return a__7229
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
    var a__7239 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__7240 = cljs.core.seq.call(null, init_val_or_seq);
      var i__7241 = 0;
      var s__7242 = s__7240;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__132__auto____7243 = s__7242;
          if(cljs.core.truth_(and__132__auto____7243)) {
            return i__7241 < size
          }else {
            return and__132__auto____7243
          }
        }())) {
          a__7239[i__7241] = cljs.core.first.call(null, s__7242);
          var G__7246 = i__7241 + 1;
          var G__7247 = cljs.core.next.call(null, s__7242);
          i__7241 = G__7246;
          s__7242 = G__7247;
          continue
        }else {
          return a__7239
        }
        break
      }
    }else {
      var n__2649__auto____7244 = size;
      var i__7245 = 0;
      while(true) {
        if(i__7245 < n__2649__auto____7244) {
          a__7239[i__7245] = init_val_or_seq;
          var G__7248 = i__7245 + 1;
          i__7245 = G__7248;
          continue
        }else {
        }
        break
      }
      return a__7239
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
    var a__7249 = cljs.core.make_array.call(null, size);
    if(cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s__7250 = cljs.core.seq.call(null, init_val_or_seq);
      var i__7251 = 0;
      var s__7252 = s__7250;
      while(true) {
        if(cljs.core.truth_(function() {
          var and__132__auto____7253 = s__7252;
          if(cljs.core.truth_(and__132__auto____7253)) {
            return i__7251 < size
          }else {
            return and__132__auto____7253
          }
        }())) {
          a__7249[i__7251] = cljs.core.first.call(null, s__7252);
          var G__7256 = i__7251 + 1;
          var G__7257 = cljs.core.next.call(null, s__7252);
          i__7251 = G__7256;
          s__7252 = G__7257;
          continue
        }else {
          return a__7249
        }
        break
      }
    }else {
      var n__2649__auto____7254 = size;
      var i__7255 = 0;
      while(true) {
        if(i__7255 < n__2649__auto____7254) {
          a__7249[i__7255] = init_val_or_seq;
          var G__7258 = i__7255 + 1;
          i__7255 = G__7258;
          continue
        }else {
        }
        break
      }
      return a__7249
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
    var s__7259 = s;
    var i__7260 = n;
    var sum__7261 = 0;
    while(true) {
      if(cljs.core.truth_(function() {
        var and__132__auto____7262 = i__7260 > 0;
        if(and__132__auto____7262) {
          return cljs.core.seq.call(null, s__7259)
        }else {
          return and__132__auto____7262
        }
      }())) {
        var G__7263 = cljs.core.next.call(null, s__7259);
        var G__7264 = i__7260 - 1;
        var G__7265 = sum__7261 + 1;
        s__7259 = G__7263;
        i__7260 = G__7264;
        sum__7261 = G__7265;
        continue
      }else {
        return sum__7261
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
      var s__7266 = cljs.core.seq.call(null, x);
      if(cljs.core.truth_(s__7266)) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__7266), concat.call(null, cljs.core.rest.call(null, s__7266), y))
      }else {
        return y
      }
    })
  };
  var concat__3 = function() {
    var G__7269__delegate = function(x, y, zs) {
      var cat__7268 = function cat(xys, zs) {
        return new cljs.core.LazySeq(null, false, function() {
          var xys__7267 = cljs.core.seq.call(null, xys);
          if(cljs.core.truth_(xys__7267)) {
            return cljs.core.cons.call(null, cljs.core.first.call(null, xys__7267), cat.call(null, cljs.core.rest.call(null, xys__7267), zs))
          }else {
            if(cljs.core.truth_(zs)) {
              return cat.call(null, cljs.core.first.call(null, zs), cljs.core.next.call(null, zs))
            }else {
              return null
            }
          }
        })
      };
      return cat__7268.call(null, concat.call(null, x, y), zs)
    };
    var G__7269 = function(x, y, var_args) {
      var zs = null;
      if(goog.isDef(var_args)) {
        zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7269__delegate.call(this, x, y, zs)
    };
    G__7269.cljs$lang$maxFixedArity = 2;
    G__7269.cljs$lang$applyTo = function(arglist__7270) {
      var x = cljs.core.first(arglist__7270);
      var y = cljs.core.first(cljs.core.next(arglist__7270));
      var zs = cljs.core.rest(cljs.core.next(arglist__7270));
      return G__7269__delegate(x, y, zs)
    };
    G__7269.cljs$lang$arity$variadic = G__7269__delegate;
    return G__7269
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
    var G__7271__delegate = function(a, b, c, d, more) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, more)))))
    };
    var G__7271 = function(a, b, c, d, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__7271__delegate.call(this, a, b, c, d, more)
    };
    G__7271.cljs$lang$maxFixedArity = 4;
    G__7271.cljs$lang$applyTo = function(arglist__7272) {
      var a = cljs.core.first(arglist__7272);
      var b = cljs.core.first(cljs.core.next(arglist__7272));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7272)));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7272))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7272))));
      return G__7271__delegate(a, b, c, d, more)
    };
    G__7271.cljs$lang$arity$variadic = G__7271__delegate;
    return G__7271
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
  var args__7273 = cljs.core.seq.call(null, args);
  if(argc === 0) {
    return f.call(null)
  }else {
    var a__7274 = cljs.core._first.call(null, args__7273);
    var args__7275 = cljs.core._rest.call(null, args__7273);
    if(argc === 1) {
      if(f.cljs$lang$arity$1) {
        return f.cljs$lang$arity$1(a__7274)
      }else {
        return f.call(null, a__7274)
      }
    }else {
      var b__7276 = cljs.core._first.call(null, args__7275);
      var args__7277 = cljs.core._rest.call(null, args__7275);
      if(argc === 2) {
        if(f.cljs$lang$arity$2) {
          return f.cljs$lang$arity$2(a__7274, b__7276)
        }else {
          return f.call(null, a__7274, b__7276)
        }
      }else {
        var c__7278 = cljs.core._first.call(null, args__7277);
        var args__7279 = cljs.core._rest.call(null, args__7277);
        if(argc === 3) {
          if(f.cljs$lang$arity$3) {
            return f.cljs$lang$arity$3(a__7274, b__7276, c__7278)
          }else {
            return f.call(null, a__7274, b__7276, c__7278)
          }
        }else {
          var d__7280 = cljs.core._first.call(null, args__7279);
          var args__7281 = cljs.core._rest.call(null, args__7279);
          if(argc === 4) {
            if(f.cljs$lang$arity$4) {
              return f.cljs$lang$arity$4(a__7274, b__7276, c__7278, d__7280)
            }else {
              return f.call(null, a__7274, b__7276, c__7278, d__7280)
            }
          }else {
            var e__7282 = cljs.core._first.call(null, args__7281);
            var args__7283 = cljs.core._rest.call(null, args__7281);
            if(argc === 5) {
              if(f.cljs$lang$arity$5) {
                return f.cljs$lang$arity$5(a__7274, b__7276, c__7278, d__7280, e__7282)
              }else {
                return f.call(null, a__7274, b__7276, c__7278, d__7280, e__7282)
              }
            }else {
              var f__7284 = cljs.core._first.call(null, args__7283);
              var args__7285 = cljs.core._rest.call(null, args__7283);
              if(argc === 6) {
                if(f__7284.cljs$lang$arity$6) {
                  return f__7284.cljs$lang$arity$6(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284)
                }else {
                  return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284)
                }
              }else {
                var g__7286 = cljs.core._first.call(null, args__7285);
                var args__7287 = cljs.core._rest.call(null, args__7285);
                if(argc === 7) {
                  if(f__7284.cljs$lang$arity$7) {
                    return f__7284.cljs$lang$arity$7(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286)
                  }else {
                    return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286)
                  }
                }else {
                  var h__7288 = cljs.core._first.call(null, args__7287);
                  var args__7289 = cljs.core._rest.call(null, args__7287);
                  if(argc === 8) {
                    if(f__7284.cljs$lang$arity$8) {
                      return f__7284.cljs$lang$arity$8(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288)
                    }else {
                      return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288)
                    }
                  }else {
                    var i__7290 = cljs.core._first.call(null, args__7289);
                    var args__7291 = cljs.core._rest.call(null, args__7289);
                    if(argc === 9) {
                      if(f__7284.cljs$lang$arity$9) {
                        return f__7284.cljs$lang$arity$9(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290)
                      }else {
                        return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290)
                      }
                    }else {
                      var j__7292 = cljs.core._first.call(null, args__7291);
                      var args__7293 = cljs.core._rest.call(null, args__7291);
                      if(argc === 10) {
                        if(f__7284.cljs$lang$arity$10) {
                          return f__7284.cljs$lang$arity$10(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292)
                        }else {
                          return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292)
                        }
                      }else {
                        var k__7294 = cljs.core._first.call(null, args__7293);
                        var args__7295 = cljs.core._rest.call(null, args__7293);
                        if(argc === 11) {
                          if(f__7284.cljs$lang$arity$11) {
                            return f__7284.cljs$lang$arity$11(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294)
                          }else {
                            return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294)
                          }
                        }else {
                          var l__7296 = cljs.core._first.call(null, args__7295);
                          var args__7297 = cljs.core._rest.call(null, args__7295);
                          if(argc === 12) {
                            if(f__7284.cljs$lang$arity$12) {
                              return f__7284.cljs$lang$arity$12(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296)
                            }else {
                              return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296)
                            }
                          }else {
                            var m__7298 = cljs.core._first.call(null, args__7297);
                            var args__7299 = cljs.core._rest.call(null, args__7297);
                            if(argc === 13) {
                              if(f__7284.cljs$lang$arity$13) {
                                return f__7284.cljs$lang$arity$13(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298)
                              }else {
                                return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298)
                              }
                            }else {
                              var n__7300 = cljs.core._first.call(null, args__7299);
                              var args__7301 = cljs.core._rest.call(null, args__7299);
                              if(argc === 14) {
                                if(f__7284.cljs$lang$arity$14) {
                                  return f__7284.cljs$lang$arity$14(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300)
                                }else {
                                  return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300)
                                }
                              }else {
                                var o__7302 = cljs.core._first.call(null, args__7301);
                                var args__7303 = cljs.core._rest.call(null, args__7301);
                                if(argc === 15) {
                                  if(f__7284.cljs$lang$arity$15) {
                                    return f__7284.cljs$lang$arity$15(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302)
                                  }else {
                                    return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302)
                                  }
                                }else {
                                  var p__7304 = cljs.core._first.call(null, args__7303);
                                  var args__7305 = cljs.core._rest.call(null, args__7303);
                                  if(argc === 16) {
                                    if(f__7284.cljs$lang$arity$16) {
                                      return f__7284.cljs$lang$arity$16(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302, p__7304)
                                    }else {
                                      return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302, p__7304)
                                    }
                                  }else {
                                    var q__7306 = cljs.core._first.call(null, args__7305);
                                    var args__7307 = cljs.core._rest.call(null, args__7305);
                                    if(argc === 17) {
                                      if(f__7284.cljs$lang$arity$17) {
                                        return f__7284.cljs$lang$arity$17(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302, p__7304, q__7306)
                                      }else {
                                        return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302, p__7304, q__7306)
                                      }
                                    }else {
                                      var r__7308 = cljs.core._first.call(null, args__7307);
                                      var args__7309 = cljs.core._rest.call(null, args__7307);
                                      if(argc === 18) {
                                        if(f__7284.cljs$lang$arity$18) {
                                          return f__7284.cljs$lang$arity$18(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302, p__7304, q__7306, r__7308)
                                        }else {
                                          return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302, p__7304, q__7306, r__7308)
                                        }
                                      }else {
                                        var s__7310 = cljs.core._first.call(null, args__7309);
                                        var args__7311 = cljs.core._rest.call(null, args__7309);
                                        if(argc === 19) {
                                          if(f__7284.cljs$lang$arity$19) {
                                            return f__7284.cljs$lang$arity$19(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302, p__7304, q__7306, r__7308, s__7310)
                                          }else {
                                            return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302, p__7304, q__7306, r__7308, s__7310)
                                          }
                                        }else {
                                          var t__7312 = cljs.core._first.call(null, args__7311);
                                          var args__7313 = cljs.core._rest.call(null, args__7311);
                                          if(argc === 20) {
                                            if(f__7284.cljs$lang$arity$20) {
                                              return f__7284.cljs$lang$arity$20(a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302, p__7304, q__7306, r__7308, s__7310, t__7312)
                                            }else {
                                              return f__7284.call(null, a__7274, b__7276, c__7278, d__7280, e__7282, f__7284, g__7286, h__7288, i__7290, j__7292, k__7294, l__7296, m__7298, n__7300, o__7302, p__7304, q__7306, r__7308, s__7310, t__7312)
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
    var fixed_arity__7314 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      var bc__7315 = cljs.core.bounded_count.call(null, args, fixed_arity__7314 + 1);
      if(bc__7315 <= fixed_arity__7314) {
        return cljs.core.apply_to.call(null, f, bc__7315, args)
      }else {
        return f.cljs$lang$applyTo(args)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, args))
    }
  };
  var apply__3 = function(f, x, args) {
    var arglist__7316 = cljs.core.list_STAR_.call(null, x, args);
    var fixed_arity__7317 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      var bc__7318 = cljs.core.bounded_count.call(null, arglist__7316, fixed_arity__7317 + 1);
      if(bc__7318 <= fixed_arity__7317) {
        return cljs.core.apply_to.call(null, f, bc__7318, arglist__7316)
      }else {
        return f.cljs$lang$applyTo(arglist__7316)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__7316))
    }
  };
  var apply__4 = function(f, x, y, args) {
    var arglist__7319 = cljs.core.list_STAR_.call(null, x, y, args);
    var fixed_arity__7320 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      var bc__7321 = cljs.core.bounded_count.call(null, arglist__7319, fixed_arity__7320 + 1);
      if(bc__7321 <= fixed_arity__7320) {
        return cljs.core.apply_to.call(null, f, bc__7321, arglist__7319)
      }else {
        return f.cljs$lang$applyTo(arglist__7319)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__7319))
    }
  };
  var apply__5 = function(f, x, y, z, args) {
    var arglist__7322 = cljs.core.list_STAR_.call(null, x, y, z, args);
    var fixed_arity__7323 = f.cljs$lang$maxFixedArity;
    if(cljs.core.truth_(f.cljs$lang$applyTo)) {
      var bc__7324 = cljs.core.bounded_count.call(null, arglist__7322, fixed_arity__7323 + 1);
      if(bc__7324 <= fixed_arity__7323) {
        return cljs.core.apply_to.call(null, f, bc__7324, arglist__7322)
      }else {
        return f.cljs$lang$applyTo(arglist__7322)
      }
    }else {
      return f.apply(f, cljs.core.to_array.call(null, arglist__7322))
    }
  };
  var apply__6 = function() {
    var G__7328__delegate = function(f, a, b, c, d, args) {
      var arglist__7325 = cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, args)))));
      var fixed_arity__7326 = f.cljs$lang$maxFixedArity;
      if(cljs.core.truth_(f.cljs$lang$applyTo)) {
        var bc__7327 = cljs.core.bounded_count.call(null, arglist__7325, fixed_arity__7326 + 1);
        if(bc__7327 <= fixed_arity__7326) {
          return cljs.core.apply_to.call(null, f, bc__7327, arglist__7325)
        }else {
          return f.cljs$lang$applyTo(arglist__7325)
        }
      }else {
        return f.apply(f, cljs.core.to_array.call(null, arglist__7325))
      }
    };
    var G__7328 = function(f, a, b, c, d, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__7328__delegate.call(this, f, a, b, c, d, args)
    };
    G__7328.cljs$lang$maxFixedArity = 5;
    G__7328.cljs$lang$applyTo = function(arglist__7329) {
      var f = cljs.core.first(arglist__7329);
      var a = cljs.core.first(cljs.core.next(arglist__7329));
      var b = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7329)));
      var c = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7329))));
      var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7329)))));
      var args = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7329)))));
      return G__7328__delegate(f, a, b, c, d, args)
    };
    G__7328.cljs$lang$arity$variadic = G__7328__delegate;
    return G__7328
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
  vary_meta.cljs$lang$applyTo = function(arglist__7330) {
    var obj = cljs.core.first(arglist__7330);
    var f = cljs.core.first(cljs.core.next(arglist__7330));
    var args = cljs.core.rest(cljs.core.next(arglist__7330));
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
    var G__7331__delegate = function(x, y, more) {
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, x, y, more))
    };
    var G__7331 = function(x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7331__delegate.call(this, x, y, more)
    };
    G__7331.cljs$lang$maxFixedArity = 2;
    G__7331.cljs$lang$applyTo = function(arglist__7332) {
      var x = cljs.core.first(arglist__7332);
      var y = cljs.core.first(cljs.core.next(arglist__7332));
      var more = cljs.core.rest(cljs.core.next(arglist__7332));
      return G__7331__delegate(x, y, more)
    };
    G__7331.cljs$lang$arity$variadic = G__7331__delegate;
    return G__7331
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
        var G__7333 = pred;
        var G__7334 = cljs.core.next.call(null, coll);
        pred = G__7333;
        coll = G__7334;
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
      var or__138__auto____7335 = pred.call(null, cljs.core.first.call(null, coll));
      if(cljs.core.truth_(or__138__auto____7335)) {
        return or__138__auto____7335
      }else {
        var G__7336 = pred;
        var G__7337 = cljs.core.next.call(null, coll);
        pred = G__7336;
        coll = G__7337;
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
    var G__7338 = null;
    var G__7338__0 = function() {
      return cljs.core.not.call(null, f.call(null))
    };
    var G__7338__1 = function(x) {
      return cljs.core.not.call(null, f.call(null, x))
    };
    var G__7338__2 = function(x, y) {
      return cljs.core.not.call(null, f.call(null, x, y))
    };
    var G__7338__3 = function() {
      var G__7339__delegate = function(x, y, zs) {
        return cljs.core.not.call(null, cljs.core.apply.call(null, f, x, y, zs))
      };
      var G__7339 = function(x, y, var_args) {
        var zs = null;
        if(goog.isDef(var_args)) {
          zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
        }
        return G__7339__delegate.call(this, x, y, zs)
      };
      G__7339.cljs$lang$maxFixedArity = 2;
      G__7339.cljs$lang$applyTo = function(arglist__7340) {
        var x = cljs.core.first(arglist__7340);
        var y = cljs.core.first(cljs.core.next(arglist__7340));
        var zs = cljs.core.rest(cljs.core.next(arglist__7340));
        return G__7339__delegate(x, y, zs)
      };
      G__7339.cljs$lang$arity$variadic = G__7339__delegate;
      return G__7339
    }();
    G__7338 = function(x, y, var_args) {
      var zs = var_args;
      switch(arguments.length) {
        case 0:
          return G__7338__0.call(this);
        case 1:
          return G__7338__1.call(this, x);
        case 2:
          return G__7338__2.call(this, x, y);
        default:
          return G__7338__3.cljs$lang$arity$variadic(x, y, cljs.core.array_seq(arguments, 2))
      }
      throw"Invalid arity: " + arguments.length;
    };
    G__7338.cljs$lang$maxFixedArity = 2;
    G__7338.cljs$lang$applyTo = G__7338__3.cljs$lang$applyTo;
    return G__7338
  }()
};
cljs.core.constantly = function constantly(x) {
  return function() {
    var G__7341__delegate = function(args) {
      return x
    };
    var G__7341 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__7341__delegate.call(this, args)
    };
    G__7341.cljs$lang$maxFixedArity = 0;
    G__7341.cljs$lang$applyTo = function(arglist__7342) {
      var args = cljs.core.seq(arglist__7342);
      return G__7341__delegate(args)
    };
    G__7341.cljs$lang$arity$variadic = G__7341__delegate;
    return G__7341
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
      var G__7346 = null;
      var G__7346__0 = function() {
        return f.call(null, g.call(null))
      };
      var G__7346__1 = function(x) {
        return f.call(null, g.call(null, x))
      };
      var G__7346__2 = function(x, y) {
        return f.call(null, g.call(null, x, y))
      };
      var G__7346__3 = function(x, y, z) {
        return f.call(null, g.call(null, x, y, z))
      };
      var G__7346__4 = function() {
        var G__7347__delegate = function(x, y, z, args) {
          return f.call(null, cljs.core.apply.call(null, g, x, y, z, args))
        };
        var G__7347 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7347__delegate.call(this, x, y, z, args)
        };
        G__7347.cljs$lang$maxFixedArity = 3;
        G__7347.cljs$lang$applyTo = function(arglist__7348) {
          var x = cljs.core.first(arglist__7348);
          var y = cljs.core.first(cljs.core.next(arglist__7348));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7348)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7348)));
          return G__7347__delegate(x, y, z, args)
        };
        G__7347.cljs$lang$arity$variadic = G__7347__delegate;
        return G__7347
      }();
      G__7346 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__7346__0.call(this);
          case 1:
            return G__7346__1.call(this, x);
          case 2:
            return G__7346__2.call(this, x, y);
          case 3:
            return G__7346__3.call(this, x, y, z);
          default:
            return G__7346__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__7346.cljs$lang$maxFixedArity = 3;
      G__7346.cljs$lang$applyTo = G__7346__4.cljs$lang$applyTo;
      return G__7346
    }()
  };
  var comp__3 = function(f, g, h) {
    return function() {
      var G__7349 = null;
      var G__7349__0 = function() {
        return f.call(null, g.call(null, h.call(null)))
      };
      var G__7349__1 = function(x) {
        return f.call(null, g.call(null, h.call(null, x)))
      };
      var G__7349__2 = function(x, y) {
        return f.call(null, g.call(null, h.call(null, x, y)))
      };
      var G__7349__3 = function(x, y, z) {
        return f.call(null, g.call(null, h.call(null, x, y, z)))
      };
      var G__7349__4 = function() {
        var G__7350__delegate = function(x, y, z, args) {
          return f.call(null, g.call(null, cljs.core.apply.call(null, h, x, y, z, args)))
        };
        var G__7350 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7350__delegate.call(this, x, y, z, args)
        };
        G__7350.cljs$lang$maxFixedArity = 3;
        G__7350.cljs$lang$applyTo = function(arglist__7351) {
          var x = cljs.core.first(arglist__7351);
          var y = cljs.core.first(cljs.core.next(arglist__7351));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7351)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7351)));
          return G__7350__delegate(x, y, z, args)
        };
        G__7350.cljs$lang$arity$variadic = G__7350__delegate;
        return G__7350
      }();
      G__7349 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__7349__0.call(this);
          case 1:
            return G__7349__1.call(this, x);
          case 2:
            return G__7349__2.call(this, x, y);
          case 3:
            return G__7349__3.call(this, x, y, z);
          default:
            return G__7349__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__7349.cljs$lang$maxFixedArity = 3;
      G__7349.cljs$lang$applyTo = G__7349__4.cljs$lang$applyTo;
      return G__7349
    }()
  };
  var comp__4 = function() {
    var G__7352__delegate = function(f1, f2, f3, fs) {
      var fs__7343 = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, f1, f2, f3, fs));
      return function() {
        var G__7353__delegate = function(args) {
          var ret__7344 = cljs.core.apply.call(null, cljs.core.first.call(null, fs__7343), args);
          var fs__7345 = cljs.core.next.call(null, fs__7343);
          while(true) {
            if(cljs.core.truth_(fs__7345)) {
              var G__7354 = cljs.core.first.call(null, fs__7345).call(null, ret__7344);
              var G__7355 = cljs.core.next.call(null, fs__7345);
              ret__7344 = G__7354;
              fs__7345 = G__7355;
              continue
            }else {
              return ret__7344
            }
            break
          }
        };
        var G__7353 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__7353__delegate.call(this, args)
        };
        G__7353.cljs$lang$maxFixedArity = 0;
        G__7353.cljs$lang$applyTo = function(arglist__7356) {
          var args = cljs.core.seq(arglist__7356);
          return G__7353__delegate(args)
        };
        G__7353.cljs$lang$arity$variadic = G__7353__delegate;
        return G__7353
      }()
    };
    var G__7352 = function(f1, f2, f3, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__7352__delegate.call(this, f1, f2, f3, fs)
    };
    G__7352.cljs$lang$maxFixedArity = 3;
    G__7352.cljs$lang$applyTo = function(arglist__7357) {
      var f1 = cljs.core.first(arglist__7357);
      var f2 = cljs.core.first(cljs.core.next(arglist__7357));
      var f3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7357)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7357)));
      return G__7352__delegate(f1, f2, f3, fs)
    };
    G__7352.cljs$lang$arity$variadic = G__7352__delegate;
    return G__7352
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
      var G__7358__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, args)
      };
      var G__7358 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__7358__delegate.call(this, args)
      };
      G__7358.cljs$lang$maxFixedArity = 0;
      G__7358.cljs$lang$applyTo = function(arglist__7359) {
        var args = cljs.core.seq(arglist__7359);
        return G__7358__delegate(args)
      };
      G__7358.cljs$lang$arity$variadic = G__7358__delegate;
      return G__7358
    }()
  };
  var partial__3 = function(f, arg1, arg2) {
    return function() {
      var G__7360__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, args)
      };
      var G__7360 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__7360__delegate.call(this, args)
      };
      G__7360.cljs$lang$maxFixedArity = 0;
      G__7360.cljs$lang$applyTo = function(arglist__7361) {
        var args = cljs.core.seq(arglist__7361);
        return G__7360__delegate(args)
      };
      G__7360.cljs$lang$arity$variadic = G__7360__delegate;
      return G__7360
    }()
  };
  var partial__4 = function(f, arg1, arg2, arg3) {
    return function() {
      var G__7362__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, arg3, args)
      };
      var G__7362 = function(var_args) {
        var args = null;
        if(goog.isDef(var_args)) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
        }
        return G__7362__delegate.call(this, args)
      };
      G__7362.cljs$lang$maxFixedArity = 0;
      G__7362.cljs$lang$applyTo = function(arglist__7363) {
        var args = cljs.core.seq(arglist__7363);
        return G__7362__delegate(args)
      };
      G__7362.cljs$lang$arity$variadic = G__7362__delegate;
      return G__7362
    }()
  };
  var partial__5 = function() {
    var G__7364__delegate = function(f, arg1, arg2, arg3, more) {
      return function() {
        var G__7365__delegate = function(args) {
          return cljs.core.apply.call(null, f, arg1, arg2, arg3, cljs.core.concat.call(null, more, args))
        };
        var G__7365 = function(var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
          }
          return G__7365__delegate.call(this, args)
        };
        G__7365.cljs$lang$maxFixedArity = 0;
        G__7365.cljs$lang$applyTo = function(arglist__7366) {
          var args = cljs.core.seq(arglist__7366);
          return G__7365__delegate(args)
        };
        G__7365.cljs$lang$arity$variadic = G__7365__delegate;
        return G__7365
      }()
    };
    var G__7364 = function(f, arg1, arg2, arg3, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__7364__delegate.call(this, f, arg1, arg2, arg3, more)
    };
    G__7364.cljs$lang$maxFixedArity = 4;
    G__7364.cljs$lang$applyTo = function(arglist__7367) {
      var f = cljs.core.first(arglist__7367);
      var arg1 = cljs.core.first(cljs.core.next(arglist__7367));
      var arg2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7367)));
      var arg3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7367))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7367))));
      return G__7364__delegate(f, arg1, arg2, arg3, more)
    };
    G__7364.cljs$lang$arity$variadic = G__7364__delegate;
    return G__7364
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
      var G__7368 = null;
      var G__7368__1 = function(a) {
        return f.call(null, a == null ? x : a)
      };
      var G__7368__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b)
      };
      var G__7368__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b, c)
      };
      var G__7368__4 = function() {
        var G__7369__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b, c, ds)
        };
        var G__7369 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7369__delegate.call(this, a, b, c, ds)
        };
        G__7369.cljs$lang$maxFixedArity = 3;
        G__7369.cljs$lang$applyTo = function(arglist__7370) {
          var a = cljs.core.first(arglist__7370);
          var b = cljs.core.first(cljs.core.next(arglist__7370));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7370)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7370)));
          return G__7369__delegate(a, b, c, ds)
        };
        G__7369.cljs$lang$arity$variadic = G__7369__delegate;
        return G__7369
      }();
      G__7368 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 1:
            return G__7368__1.call(this, a);
          case 2:
            return G__7368__2.call(this, a, b);
          case 3:
            return G__7368__3.call(this, a, b, c);
          default:
            return G__7368__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__7368.cljs$lang$maxFixedArity = 3;
      G__7368.cljs$lang$applyTo = G__7368__4.cljs$lang$applyTo;
      return G__7368
    }()
  };
  var fnil__3 = function(f, x, y) {
    return function() {
      var G__7371 = null;
      var G__7371__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b == null ? y : b)
      };
      var G__7371__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b == null ? y : b, c)
      };
      var G__7371__4 = function() {
        var G__7372__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b == null ? y : b, c, ds)
        };
        var G__7372 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7372__delegate.call(this, a, b, c, ds)
        };
        G__7372.cljs$lang$maxFixedArity = 3;
        G__7372.cljs$lang$applyTo = function(arglist__7373) {
          var a = cljs.core.first(arglist__7373);
          var b = cljs.core.first(cljs.core.next(arglist__7373));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7373)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7373)));
          return G__7372__delegate(a, b, c, ds)
        };
        G__7372.cljs$lang$arity$variadic = G__7372__delegate;
        return G__7372
      }();
      G__7371 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__7371__2.call(this, a, b);
          case 3:
            return G__7371__3.call(this, a, b, c);
          default:
            return G__7371__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__7371.cljs$lang$maxFixedArity = 3;
      G__7371.cljs$lang$applyTo = G__7371__4.cljs$lang$applyTo;
      return G__7371
    }()
  };
  var fnil__4 = function(f, x, y, z) {
    return function() {
      var G__7374 = null;
      var G__7374__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b == null ? y : b)
      };
      var G__7374__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b == null ? y : b, c == null ? z : c)
      };
      var G__7374__4 = function() {
        var G__7375__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b == null ? y : b, c == null ? z : c, ds)
        };
        var G__7375 = function(a, b, c, var_args) {
          var ds = null;
          if(goog.isDef(var_args)) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7375__delegate.call(this, a, b, c, ds)
        };
        G__7375.cljs$lang$maxFixedArity = 3;
        G__7375.cljs$lang$applyTo = function(arglist__7376) {
          var a = cljs.core.first(arglist__7376);
          var b = cljs.core.first(cljs.core.next(arglist__7376));
          var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7376)));
          var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7376)));
          return G__7375__delegate(a, b, c, ds)
        };
        G__7375.cljs$lang$arity$variadic = G__7375__delegate;
        return G__7375
      }();
      G__7374 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__7374__2.call(this, a, b);
          case 3:
            return G__7374__3.call(this, a, b, c);
          default:
            return G__7374__4.cljs$lang$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__7374.cljs$lang$maxFixedArity = 3;
      G__7374.cljs$lang$applyTo = G__7374__4.cljs$lang$applyTo;
      return G__7374
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
  var mapi__7379 = function mpi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__324__auto____7377 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7377)) {
        var s__7378 = temp__324__auto____7377;
        return cljs.core.cons.call(null, f.call(null, idx, cljs.core.first.call(null, s__7378)), mpi.call(null, idx + 1, cljs.core.rest.call(null, s__7378)))
      }else {
        return null
      }
    })
  };
  return mapi__7379.call(null, 0, coll)
};
cljs.core.keep = function keep(f, coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__324__auto____7380 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____7380)) {
      var s__7381 = temp__324__auto____7380;
      var x__7382 = f.call(null, cljs.core.first.call(null, s__7381));
      if(x__7382 == null) {
        return keep.call(null, f, cljs.core.rest.call(null, s__7381))
      }else {
        return cljs.core.cons.call(null, x__7382, keep.call(null, f, cljs.core.rest.call(null, s__7381)))
      }
    }else {
      return null
    }
  })
};
cljs.core.keep_indexed = function keep_indexed(f, coll) {
  var keepi__7392 = function kpi(idx, coll) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__324__auto____7389 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7389)) {
        var s__7390 = temp__324__auto____7389;
        var x__7391 = f.call(null, idx, cljs.core.first.call(null, s__7390));
        if(x__7391 == null) {
          return kpi.call(null, idx + 1, cljs.core.rest.call(null, s__7390))
        }else {
          return cljs.core.cons.call(null, x__7391, kpi.call(null, idx + 1, cljs.core.rest.call(null, s__7390)))
        }
      }else {
        return null
      }
    })
  };
  return keepi__7392.call(null, 0, coll)
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
          var and__132__auto____7399 = p.call(null, x);
          if(cljs.core.truth_(and__132__auto____7399)) {
            return p.call(null, y)
          }else {
            return and__132__auto____7399
          }
        }())
      };
      var ep1__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7400 = p.call(null, x);
          if(cljs.core.truth_(and__132__auto____7400)) {
            var and__132__auto____7401 = p.call(null, y);
            if(cljs.core.truth_(and__132__auto____7401)) {
              return p.call(null, z)
            }else {
              return and__132__auto____7401
            }
          }else {
            return and__132__auto____7400
          }
        }())
      };
      var ep1__4 = function() {
        var G__7437__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__132__auto____7402 = ep1.call(null, x, y, z);
            if(cljs.core.truth_(and__132__auto____7402)) {
              return cljs.core.every_QMARK_.call(null, p, args)
            }else {
              return and__132__auto____7402
            }
          }())
        };
        var G__7437 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7437__delegate.call(this, x, y, z, args)
        };
        G__7437.cljs$lang$maxFixedArity = 3;
        G__7437.cljs$lang$applyTo = function(arglist__7438) {
          var x = cljs.core.first(arglist__7438);
          var y = cljs.core.first(cljs.core.next(arglist__7438));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7438)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7438)));
          return G__7437__delegate(x, y, z, args)
        };
        G__7437.cljs$lang$arity$variadic = G__7437__delegate;
        return G__7437
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
          var and__132__auto____7403 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7403)) {
            return p2.call(null, x)
          }else {
            return and__132__auto____7403
          }
        }())
      };
      var ep2__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7404 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7404)) {
            var and__132__auto____7405 = p1.call(null, y);
            if(cljs.core.truth_(and__132__auto____7405)) {
              var and__132__auto____7406 = p2.call(null, x);
              if(cljs.core.truth_(and__132__auto____7406)) {
                return p2.call(null, y)
              }else {
                return and__132__auto____7406
              }
            }else {
              return and__132__auto____7405
            }
          }else {
            return and__132__auto____7404
          }
        }())
      };
      var ep2__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7407 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7407)) {
            var and__132__auto____7408 = p1.call(null, y);
            if(cljs.core.truth_(and__132__auto____7408)) {
              var and__132__auto____7409 = p1.call(null, z);
              if(cljs.core.truth_(and__132__auto____7409)) {
                var and__132__auto____7410 = p2.call(null, x);
                if(cljs.core.truth_(and__132__auto____7410)) {
                  var and__132__auto____7411 = p2.call(null, y);
                  if(cljs.core.truth_(and__132__auto____7411)) {
                    return p2.call(null, z)
                  }else {
                    return and__132__auto____7411
                  }
                }else {
                  return and__132__auto____7410
                }
              }else {
                return and__132__auto____7409
              }
            }else {
              return and__132__auto____7408
            }
          }else {
            return and__132__auto____7407
          }
        }())
      };
      var ep2__4 = function() {
        var G__7439__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__132__auto____7412 = ep2.call(null, x, y, z);
            if(cljs.core.truth_(and__132__auto____7412)) {
              return cljs.core.every_QMARK_.call(null, function(p1__7383_SHARP_) {
                var and__132__auto____7413 = p1.call(null, p1__7383_SHARP_);
                if(cljs.core.truth_(and__132__auto____7413)) {
                  return p2.call(null, p1__7383_SHARP_)
                }else {
                  return and__132__auto____7413
                }
              }, args)
            }else {
              return and__132__auto____7412
            }
          }())
        };
        var G__7439 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7439__delegate.call(this, x, y, z, args)
        };
        G__7439.cljs$lang$maxFixedArity = 3;
        G__7439.cljs$lang$applyTo = function(arglist__7440) {
          var x = cljs.core.first(arglist__7440);
          var y = cljs.core.first(cljs.core.next(arglist__7440));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7440)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7440)));
          return G__7439__delegate(x, y, z, args)
        };
        G__7439.cljs$lang$arity$variadic = G__7439__delegate;
        return G__7439
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
          var and__132__auto____7414 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7414)) {
            var and__132__auto____7415 = p2.call(null, x);
            if(cljs.core.truth_(and__132__auto____7415)) {
              return p3.call(null, x)
            }else {
              return and__132__auto____7415
            }
          }else {
            return and__132__auto____7414
          }
        }())
      };
      var ep3__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7416 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7416)) {
            var and__132__auto____7417 = p2.call(null, x);
            if(cljs.core.truth_(and__132__auto____7417)) {
              var and__132__auto____7418 = p3.call(null, x);
              if(cljs.core.truth_(and__132__auto____7418)) {
                var and__132__auto____7419 = p1.call(null, y);
                if(cljs.core.truth_(and__132__auto____7419)) {
                  var and__132__auto____7420 = p2.call(null, y);
                  if(cljs.core.truth_(and__132__auto____7420)) {
                    return p3.call(null, y)
                  }else {
                    return and__132__auto____7420
                  }
                }else {
                  return and__132__auto____7419
                }
              }else {
                return and__132__auto____7418
              }
            }else {
              return and__132__auto____7417
            }
          }else {
            return and__132__auto____7416
          }
        }())
      };
      var ep3__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__132__auto____7421 = p1.call(null, x);
          if(cljs.core.truth_(and__132__auto____7421)) {
            var and__132__auto____7422 = p2.call(null, x);
            if(cljs.core.truth_(and__132__auto____7422)) {
              var and__132__auto____7423 = p3.call(null, x);
              if(cljs.core.truth_(and__132__auto____7423)) {
                var and__132__auto____7424 = p1.call(null, y);
                if(cljs.core.truth_(and__132__auto____7424)) {
                  var and__132__auto____7425 = p2.call(null, y);
                  if(cljs.core.truth_(and__132__auto____7425)) {
                    var and__132__auto____7426 = p3.call(null, y);
                    if(cljs.core.truth_(and__132__auto____7426)) {
                      var and__132__auto____7427 = p1.call(null, z);
                      if(cljs.core.truth_(and__132__auto____7427)) {
                        var and__132__auto____7428 = p2.call(null, z);
                        if(cljs.core.truth_(and__132__auto____7428)) {
                          return p3.call(null, z)
                        }else {
                          return and__132__auto____7428
                        }
                      }else {
                        return and__132__auto____7427
                      }
                    }else {
                      return and__132__auto____7426
                    }
                  }else {
                    return and__132__auto____7425
                  }
                }else {
                  return and__132__auto____7424
                }
              }else {
                return and__132__auto____7423
              }
            }else {
              return and__132__auto____7422
            }
          }else {
            return and__132__auto____7421
          }
        }())
      };
      var ep3__4 = function() {
        var G__7441__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, function() {
            var and__132__auto____7429 = ep3.call(null, x, y, z);
            if(cljs.core.truth_(and__132__auto____7429)) {
              return cljs.core.every_QMARK_.call(null, function(p1__7384_SHARP_) {
                var and__132__auto____7430 = p1.call(null, p1__7384_SHARP_);
                if(cljs.core.truth_(and__132__auto____7430)) {
                  var and__132__auto____7431 = p2.call(null, p1__7384_SHARP_);
                  if(cljs.core.truth_(and__132__auto____7431)) {
                    return p3.call(null, p1__7384_SHARP_)
                  }else {
                    return and__132__auto____7431
                  }
                }else {
                  return and__132__auto____7430
                }
              }, args)
            }else {
              return and__132__auto____7429
            }
          }())
        };
        var G__7441 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7441__delegate.call(this, x, y, z, args)
        };
        G__7441.cljs$lang$maxFixedArity = 3;
        G__7441.cljs$lang$applyTo = function(arglist__7442) {
          var x = cljs.core.first(arglist__7442);
          var y = cljs.core.first(cljs.core.next(arglist__7442));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7442)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7442)));
          return G__7441__delegate(x, y, z, args)
        };
        G__7441.cljs$lang$arity$variadic = G__7441__delegate;
        return G__7441
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
    var G__7443__delegate = function(p1, p2, p3, ps) {
      var ps__7432 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function() {
        var epn = null;
        var epn__0 = function() {
          return true
        };
        var epn__1 = function(x) {
          return cljs.core.every_QMARK_.call(null, function(p1__7385_SHARP_) {
            return p1__7385_SHARP_.call(null, x)
          }, ps__7432)
        };
        var epn__2 = function(x, y) {
          return cljs.core.every_QMARK_.call(null, function(p1__7386_SHARP_) {
            var and__132__auto____7433 = p1__7386_SHARP_.call(null, x);
            if(cljs.core.truth_(and__132__auto____7433)) {
              return p1__7386_SHARP_.call(null, y)
            }else {
              return and__132__auto____7433
            }
          }, ps__7432)
        };
        var epn__3 = function(x, y, z) {
          return cljs.core.every_QMARK_.call(null, function(p1__7387_SHARP_) {
            var and__132__auto____7434 = p1__7387_SHARP_.call(null, x);
            if(cljs.core.truth_(and__132__auto____7434)) {
              var and__132__auto____7435 = p1__7387_SHARP_.call(null, y);
              if(cljs.core.truth_(and__132__auto____7435)) {
                return p1__7387_SHARP_.call(null, z)
              }else {
                return and__132__auto____7435
              }
            }else {
              return and__132__auto____7434
            }
          }, ps__7432)
        };
        var epn__4 = function() {
          var G__7444__delegate = function(x, y, z, args) {
            return cljs.core.boolean$.call(null, function() {
              var and__132__auto____7436 = epn.call(null, x, y, z);
              if(cljs.core.truth_(and__132__auto____7436)) {
                return cljs.core.every_QMARK_.call(null, function(p1__7388_SHARP_) {
                  return cljs.core.every_QMARK_.call(null, p1__7388_SHARP_, args)
                }, ps__7432)
              }else {
                return and__132__auto____7436
              }
            }())
          };
          var G__7444 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__7444__delegate.call(this, x, y, z, args)
          };
          G__7444.cljs$lang$maxFixedArity = 3;
          G__7444.cljs$lang$applyTo = function(arglist__7445) {
            var x = cljs.core.first(arglist__7445);
            var y = cljs.core.first(cljs.core.next(arglist__7445));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7445)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7445)));
            return G__7444__delegate(x, y, z, args)
          };
          G__7444.cljs$lang$arity$variadic = G__7444__delegate;
          return G__7444
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
    var G__7443 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__7443__delegate.call(this, p1, p2, p3, ps)
    };
    G__7443.cljs$lang$maxFixedArity = 3;
    G__7443.cljs$lang$applyTo = function(arglist__7446) {
      var p1 = cljs.core.first(arglist__7446);
      var p2 = cljs.core.first(cljs.core.next(arglist__7446));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7446)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7446)));
      return G__7443__delegate(p1, p2, p3, ps)
    };
    G__7443.cljs$lang$arity$variadic = G__7443__delegate;
    return G__7443
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
        var or__138__auto____7448 = p.call(null, x);
        if(cljs.core.truth_(or__138__auto____7448)) {
          return or__138__auto____7448
        }else {
          return p.call(null, y)
        }
      };
      var sp1__3 = function(x, y, z) {
        var or__138__auto____7449 = p.call(null, x);
        if(cljs.core.truth_(or__138__auto____7449)) {
          return or__138__auto____7449
        }else {
          var or__138__auto____7450 = p.call(null, y);
          if(cljs.core.truth_(or__138__auto____7450)) {
            return or__138__auto____7450
          }else {
            return p.call(null, z)
          }
        }
      };
      var sp1__4 = function() {
        var G__7486__delegate = function(x, y, z, args) {
          var or__138__auto____7451 = sp1.call(null, x, y, z);
          if(cljs.core.truth_(or__138__auto____7451)) {
            return or__138__auto____7451
          }else {
            return cljs.core.some.call(null, p, args)
          }
        };
        var G__7486 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7486__delegate.call(this, x, y, z, args)
        };
        G__7486.cljs$lang$maxFixedArity = 3;
        G__7486.cljs$lang$applyTo = function(arglist__7487) {
          var x = cljs.core.first(arglist__7487);
          var y = cljs.core.first(cljs.core.next(arglist__7487));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7487)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7487)));
          return G__7486__delegate(x, y, z, args)
        };
        G__7486.cljs$lang$arity$variadic = G__7486__delegate;
        return G__7486
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
        var or__138__auto____7452 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7452)) {
          return or__138__auto____7452
        }else {
          return p2.call(null, x)
        }
      };
      var sp2__2 = function(x, y) {
        var or__138__auto____7453 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7453)) {
          return or__138__auto____7453
        }else {
          var or__138__auto____7454 = p1.call(null, y);
          if(cljs.core.truth_(or__138__auto____7454)) {
            return or__138__auto____7454
          }else {
            var or__138__auto____7455 = p2.call(null, x);
            if(cljs.core.truth_(or__138__auto____7455)) {
              return or__138__auto____7455
            }else {
              return p2.call(null, y)
            }
          }
        }
      };
      var sp2__3 = function(x, y, z) {
        var or__138__auto____7456 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7456)) {
          return or__138__auto____7456
        }else {
          var or__138__auto____7457 = p1.call(null, y);
          if(cljs.core.truth_(or__138__auto____7457)) {
            return or__138__auto____7457
          }else {
            var or__138__auto____7458 = p1.call(null, z);
            if(cljs.core.truth_(or__138__auto____7458)) {
              return or__138__auto____7458
            }else {
              var or__138__auto____7459 = p2.call(null, x);
              if(cljs.core.truth_(or__138__auto____7459)) {
                return or__138__auto____7459
              }else {
                var or__138__auto____7460 = p2.call(null, y);
                if(cljs.core.truth_(or__138__auto____7460)) {
                  return or__138__auto____7460
                }else {
                  return p2.call(null, z)
                }
              }
            }
          }
        }
      };
      var sp2__4 = function() {
        var G__7488__delegate = function(x, y, z, args) {
          var or__138__auto____7461 = sp2.call(null, x, y, z);
          if(cljs.core.truth_(or__138__auto____7461)) {
            return or__138__auto____7461
          }else {
            return cljs.core.some.call(null, function(p1__7393_SHARP_) {
              var or__138__auto____7462 = p1.call(null, p1__7393_SHARP_);
              if(cljs.core.truth_(or__138__auto____7462)) {
                return or__138__auto____7462
              }else {
                return p2.call(null, p1__7393_SHARP_)
              }
            }, args)
          }
        };
        var G__7488 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7488__delegate.call(this, x, y, z, args)
        };
        G__7488.cljs$lang$maxFixedArity = 3;
        G__7488.cljs$lang$applyTo = function(arglist__7489) {
          var x = cljs.core.first(arglist__7489);
          var y = cljs.core.first(cljs.core.next(arglist__7489));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7489)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7489)));
          return G__7488__delegate(x, y, z, args)
        };
        G__7488.cljs$lang$arity$variadic = G__7488__delegate;
        return G__7488
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
        var or__138__auto____7463 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7463)) {
          return or__138__auto____7463
        }else {
          var or__138__auto____7464 = p2.call(null, x);
          if(cljs.core.truth_(or__138__auto____7464)) {
            return or__138__auto____7464
          }else {
            return p3.call(null, x)
          }
        }
      };
      var sp3__2 = function(x, y) {
        var or__138__auto____7465 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7465)) {
          return or__138__auto____7465
        }else {
          var or__138__auto____7466 = p2.call(null, x);
          if(cljs.core.truth_(or__138__auto____7466)) {
            return or__138__auto____7466
          }else {
            var or__138__auto____7467 = p3.call(null, x);
            if(cljs.core.truth_(or__138__auto____7467)) {
              return or__138__auto____7467
            }else {
              var or__138__auto____7468 = p1.call(null, y);
              if(cljs.core.truth_(or__138__auto____7468)) {
                return or__138__auto____7468
              }else {
                var or__138__auto____7469 = p2.call(null, y);
                if(cljs.core.truth_(or__138__auto____7469)) {
                  return or__138__auto____7469
                }else {
                  return p3.call(null, y)
                }
              }
            }
          }
        }
      };
      var sp3__3 = function(x, y, z) {
        var or__138__auto____7470 = p1.call(null, x);
        if(cljs.core.truth_(or__138__auto____7470)) {
          return or__138__auto____7470
        }else {
          var or__138__auto____7471 = p2.call(null, x);
          if(cljs.core.truth_(or__138__auto____7471)) {
            return or__138__auto____7471
          }else {
            var or__138__auto____7472 = p3.call(null, x);
            if(cljs.core.truth_(or__138__auto____7472)) {
              return or__138__auto____7472
            }else {
              var or__138__auto____7473 = p1.call(null, y);
              if(cljs.core.truth_(or__138__auto____7473)) {
                return or__138__auto____7473
              }else {
                var or__138__auto____7474 = p2.call(null, y);
                if(cljs.core.truth_(or__138__auto____7474)) {
                  return or__138__auto____7474
                }else {
                  var or__138__auto____7475 = p3.call(null, y);
                  if(cljs.core.truth_(or__138__auto____7475)) {
                    return or__138__auto____7475
                  }else {
                    var or__138__auto____7476 = p1.call(null, z);
                    if(cljs.core.truth_(or__138__auto____7476)) {
                      return or__138__auto____7476
                    }else {
                      var or__138__auto____7477 = p2.call(null, z);
                      if(cljs.core.truth_(or__138__auto____7477)) {
                        return or__138__auto____7477
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
        var G__7490__delegate = function(x, y, z, args) {
          var or__138__auto____7478 = sp3.call(null, x, y, z);
          if(cljs.core.truth_(or__138__auto____7478)) {
            return or__138__auto____7478
          }else {
            return cljs.core.some.call(null, function(p1__7394_SHARP_) {
              var or__138__auto____7479 = p1.call(null, p1__7394_SHARP_);
              if(cljs.core.truth_(or__138__auto____7479)) {
                return or__138__auto____7479
              }else {
                var or__138__auto____7480 = p2.call(null, p1__7394_SHARP_);
                if(cljs.core.truth_(or__138__auto____7480)) {
                  return or__138__auto____7480
                }else {
                  return p3.call(null, p1__7394_SHARP_)
                }
              }
            }, args)
          }
        };
        var G__7490 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__7490__delegate.call(this, x, y, z, args)
        };
        G__7490.cljs$lang$maxFixedArity = 3;
        G__7490.cljs$lang$applyTo = function(arglist__7491) {
          var x = cljs.core.first(arglist__7491);
          var y = cljs.core.first(cljs.core.next(arglist__7491));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7491)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7491)));
          return G__7490__delegate(x, y, z, args)
        };
        G__7490.cljs$lang$arity$variadic = G__7490__delegate;
        return G__7490
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
    var G__7492__delegate = function(p1, p2, p3, ps) {
      var ps__7481 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function() {
        var spn = null;
        var spn__0 = function() {
          return null
        };
        var spn__1 = function(x) {
          return cljs.core.some.call(null, function(p1__7395_SHARP_) {
            return p1__7395_SHARP_.call(null, x)
          }, ps__7481)
        };
        var spn__2 = function(x, y) {
          return cljs.core.some.call(null, function(p1__7396_SHARP_) {
            var or__138__auto____7482 = p1__7396_SHARP_.call(null, x);
            if(cljs.core.truth_(or__138__auto____7482)) {
              return or__138__auto____7482
            }else {
              return p1__7396_SHARP_.call(null, y)
            }
          }, ps__7481)
        };
        var spn__3 = function(x, y, z) {
          return cljs.core.some.call(null, function(p1__7397_SHARP_) {
            var or__138__auto____7483 = p1__7397_SHARP_.call(null, x);
            if(cljs.core.truth_(or__138__auto____7483)) {
              return or__138__auto____7483
            }else {
              var or__138__auto____7484 = p1__7397_SHARP_.call(null, y);
              if(cljs.core.truth_(or__138__auto____7484)) {
                return or__138__auto____7484
              }else {
                return p1__7397_SHARP_.call(null, z)
              }
            }
          }, ps__7481)
        };
        var spn__4 = function() {
          var G__7493__delegate = function(x, y, z, args) {
            var or__138__auto____7485 = spn.call(null, x, y, z);
            if(cljs.core.truth_(or__138__auto____7485)) {
              return or__138__auto____7485
            }else {
              return cljs.core.some.call(null, function(p1__7398_SHARP_) {
                return cljs.core.some.call(null, p1__7398_SHARP_, args)
              }, ps__7481)
            }
          };
          var G__7493 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__7493__delegate.call(this, x, y, z, args)
          };
          G__7493.cljs$lang$maxFixedArity = 3;
          G__7493.cljs$lang$applyTo = function(arglist__7494) {
            var x = cljs.core.first(arglist__7494);
            var y = cljs.core.first(cljs.core.next(arglist__7494));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7494)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7494)));
            return G__7493__delegate(x, y, z, args)
          };
          G__7493.cljs$lang$arity$variadic = G__7493__delegate;
          return G__7493
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
    var G__7492 = function(p1, p2, p3, var_args) {
      var ps = null;
      if(goog.isDef(var_args)) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__7492__delegate.call(this, p1, p2, p3, ps)
    };
    G__7492.cljs$lang$maxFixedArity = 3;
    G__7492.cljs$lang$applyTo = function(arglist__7495) {
      var p1 = cljs.core.first(arglist__7495);
      var p2 = cljs.core.first(cljs.core.next(arglist__7495));
      var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7495)));
      var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7495)));
      return G__7492__delegate(p1, p2, p3, ps)
    };
    G__7492.cljs$lang$arity$variadic = G__7492__delegate;
    return G__7492
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
      var temp__324__auto____7496 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7496)) {
        var s__7497 = temp__324__auto____7496;
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s__7497)), map.call(null, f, cljs.core.rest.call(null, s__7497)))
      }else {
        return null
      }
    })
  };
  var map__3 = function(f, c1, c2) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__7498 = cljs.core.seq.call(null, c1);
      var s2__7499 = cljs.core.seq.call(null, c2);
      if(cljs.core.truth_(function() {
        var and__132__auto____7500 = s1__7498;
        if(cljs.core.truth_(and__132__auto____7500)) {
          return s2__7499
        }else {
          return and__132__auto____7500
        }
      }())) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1__7498), cljs.core.first.call(null, s2__7499)), map.call(null, f, cljs.core.rest.call(null, s1__7498), cljs.core.rest.call(null, s2__7499)))
      }else {
        return null
      }
    })
  };
  var map__4 = function(f, c1, c2, c3) {
    return new cljs.core.LazySeq(null, false, function() {
      var s1__7501 = cljs.core.seq.call(null, c1);
      var s2__7502 = cljs.core.seq.call(null, c2);
      var s3__7503 = cljs.core.seq.call(null, c3);
      if(cljs.core.truth_(function() {
        var and__132__auto____7504 = s1__7501;
        if(cljs.core.truth_(and__132__auto____7504)) {
          var and__132__auto____7505 = s2__7502;
          if(cljs.core.truth_(and__132__auto____7505)) {
            return s3__7503
          }else {
            return and__132__auto____7505
          }
        }else {
          return and__132__auto____7504
        }
      }())) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1__7501), cljs.core.first.call(null, s2__7502), cljs.core.first.call(null, s3__7503)), map.call(null, f, cljs.core.rest.call(null, s1__7501), cljs.core.rest.call(null, s2__7502), cljs.core.rest.call(null, s3__7503)))
      }else {
        return null
      }
    })
  };
  var map__5 = function() {
    var G__7508__delegate = function(f, c1, c2, c3, colls) {
      var step__7507 = function step(cs) {
        return new cljs.core.LazySeq(null, false, function() {
          var ss__7506 = map.call(null, cljs.core.seq, cs);
          if(cljs.core.every_QMARK_.call(null, cljs.core.identity, ss__7506)) {
            return cljs.core.cons.call(null, map.call(null, cljs.core.first, ss__7506), step.call(null, map.call(null, cljs.core.rest, ss__7506)))
          }else {
            return null
          }
        })
      };
      return map.call(null, function(p1__7447_SHARP_) {
        return cljs.core.apply.call(null, f, p1__7447_SHARP_)
      }, step__7507.call(null, cljs.core.conj.call(null, colls, c3, c2, c1)))
    };
    var G__7508 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__7508__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__7508.cljs$lang$maxFixedArity = 4;
    G__7508.cljs$lang$applyTo = function(arglist__7509) {
      var f = cljs.core.first(arglist__7509);
      var c1 = cljs.core.first(cljs.core.next(arglist__7509));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7509)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7509))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7509))));
      return G__7508__delegate(f, c1, c2, c3, colls)
    };
    G__7508.cljs$lang$arity$variadic = G__7508__delegate;
    return G__7508
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
      var temp__324__auto____7510 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7510)) {
        var s__7511 = temp__324__auto____7510;
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__7511), take.call(null, n - 1, cljs.core.rest.call(null, s__7511)))
      }else {
        return null
      }
    }else {
      return null
    }
  })
};
cljs.core.drop = function drop(n, coll) {
  var step__7514 = function(n, coll) {
    while(true) {
      var s__7512 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(function() {
        var and__132__auto____7513 = n > 0;
        if(and__132__auto____7513) {
          return s__7512
        }else {
          return and__132__auto____7513
        }
      }())) {
        var G__7515 = n - 1;
        var G__7516 = cljs.core.rest.call(null, s__7512);
        n = G__7515;
        coll = G__7516;
        continue
      }else {
        return s__7512
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__7514.call(null, n, coll)
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
  var s__7517 = cljs.core.seq.call(null, coll);
  var lead__7518 = cljs.core.seq.call(null, cljs.core.drop.call(null, n, coll));
  while(true) {
    if(cljs.core.truth_(lead__7518)) {
      var G__7519 = cljs.core.next.call(null, s__7517);
      var G__7520 = cljs.core.next.call(null, lead__7518);
      s__7517 = G__7519;
      lead__7518 = G__7520;
      continue
    }else {
      return s__7517
    }
    break
  }
};
cljs.core.drop_while = function drop_while(pred, coll) {
  var step__7523 = function(pred, coll) {
    while(true) {
      var s__7521 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(function() {
        var and__132__auto____7522 = s__7521;
        if(cljs.core.truth_(and__132__auto____7522)) {
          return pred.call(null, cljs.core.first.call(null, s__7521))
        }else {
          return and__132__auto____7522
        }
      }())) {
        var G__7524 = pred;
        var G__7525 = cljs.core.rest.call(null, s__7521);
        pred = G__7524;
        coll = G__7525;
        continue
      }else {
        return s__7521
      }
      break
    }
  };
  return new cljs.core.LazySeq(null, false, function() {
    return step__7523.call(null, pred, coll)
  })
};
cljs.core.cycle = function cycle(coll) {
  return new cljs.core.LazySeq(null, false, function() {
    var temp__324__auto____7526 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____7526)) {
      var s__7527 = temp__324__auto____7526;
      return cljs.core.concat.call(null, s__7527, cycle.call(null, s__7527))
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
      var s1__7528 = cljs.core.seq.call(null, c1);
      var s2__7529 = cljs.core.seq.call(null, c2);
      if(cljs.core.truth_(function() {
        var and__132__auto____7530 = s1__7528;
        if(cljs.core.truth_(and__132__auto____7530)) {
          return s2__7529
        }else {
          return and__132__auto____7530
        }
      }())) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s1__7528), cljs.core.cons.call(null, cljs.core.first.call(null, s2__7529), interleave.call(null, cljs.core.rest.call(null, s1__7528), cljs.core.rest.call(null, s2__7529))))
      }else {
        return null
      }
    })
  };
  var interleave__3 = function() {
    var G__7532__delegate = function(c1, c2, colls) {
      return new cljs.core.LazySeq(null, false, function() {
        var ss__7531 = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, colls, c2, c1));
        if(cljs.core.every_QMARK_.call(null, cljs.core.identity, ss__7531)) {
          return cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, ss__7531), cljs.core.apply.call(null, interleave, cljs.core.map.call(null, cljs.core.rest, ss__7531)))
        }else {
          return null
        }
      })
    };
    var G__7532 = function(c1, c2, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7532__delegate.call(this, c1, c2, colls)
    };
    G__7532.cljs$lang$maxFixedArity = 2;
    G__7532.cljs$lang$applyTo = function(arglist__7533) {
      var c1 = cljs.core.first(arglist__7533);
      var c2 = cljs.core.first(cljs.core.next(arglist__7533));
      var colls = cljs.core.rest(cljs.core.next(arglist__7533));
      return G__7532__delegate(c1, c2, colls)
    };
    G__7532.cljs$lang$arity$variadic = G__7532__delegate;
    return G__7532
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
  var cat__7536 = function cat(coll, colls) {
    return new cljs.core.LazySeq(null, false, function() {
      var temp__317__auto____7534 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__317__auto____7534)) {
        var coll__7535 = temp__317__auto____7534;
        return cljs.core.cons.call(null, cljs.core.first.call(null, coll__7535), cat.call(null, cljs.core.rest.call(null, coll__7535), colls))
      }else {
        if(cljs.core.truth_(cljs.core.seq.call(null, colls))) {
          return cat.call(null, cljs.core.first.call(null, colls), cljs.core.rest.call(null, colls))
        }else {
          return null
        }
      }
    })
  };
  return cat__7536.call(null, null, colls)
};
cljs.core.mapcat = function() {
  var mapcat = null;
  var mapcat__2 = function(f, coll) {
    return cljs.core.flatten1.call(null, cljs.core.map.call(null, f, coll))
  };
  var mapcat__3 = function() {
    var G__7537__delegate = function(f, coll, colls) {
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, f, coll, colls))
    };
    var G__7537 = function(f, coll, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
      }
      return G__7537__delegate.call(this, f, coll, colls)
    };
    G__7537.cljs$lang$maxFixedArity = 2;
    G__7537.cljs$lang$applyTo = function(arglist__7538) {
      var f = cljs.core.first(arglist__7538);
      var coll = cljs.core.first(cljs.core.next(arglist__7538));
      var colls = cljs.core.rest(cljs.core.next(arglist__7538));
      return G__7537__delegate(f, coll, colls)
    };
    G__7537.cljs$lang$arity$variadic = G__7537__delegate;
    return G__7537
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
    var temp__324__auto____7539 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____7539)) {
      var s__7540 = temp__324__auto____7539;
      var f__7541 = cljs.core.first.call(null, s__7540);
      var r__7542 = cljs.core.rest.call(null, s__7540);
      if(cljs.core.truth_(pred.call(null, f__7541))) {
        return cljs.core.cons.call(null, f__7541, filter.call(null, pred, r__7542))
      }else {
        return filter.call(null, pred, r__7542)
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
  var walk__7544 = function walk(node) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, node, cljs.core.truth_(branch_QMARK_.call(null, node)) ? cljs.core.mapcat.call(null, walk, children.call(null, node)) : null)
    })
  };
  return walk__7544.call(null, root)
};
cljs.core.flatten = function flatten(x) {
  return cljs.core.filter.call(null, function(p1__7543_SHARP_) {
    return cljs.core.not.call(null, cljs.core.sequential_QMARK_.call(null, p1__7543_SHARP_))
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, x)))
};
cljs.core.into = function into(to, from) {
  if(function() {
    var G__7545__7546 = to;
    if(G__7545__7546 != null) {
      if(function() {
        var or__138__auto____7547 = G__7545__7546.cljs$lang$protocol_mask$partition0$ & 2147483648;
        if(or__138__auto____7547) {
          return or__138__auto____7547
        }else {
          return G__7545__7546.cljs$core$IEditableCollection$
        }
      }()) {
        return true
      }else {
        if(!G__7545__7546.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.type_satisfies_.call(null, cljs.core.IEditableCollection, G__7545__7546)
        }else {
          return false
        }
      }
    }else {
      return cljs.core.type_satisfies_.call(null, cljs.core.IEditableCollection, G__7545__7546)
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
    var G__7548__delegate = function(f, c1, c2, c3, colls) {
      return cljs.core.into.call(null, cljs.core.PersistentVector.fromArray([]), cljs.core.apply.call(null, cljs.core.map, f, c1, c2, c3, colls))
    };
    var G__7548 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if(goog.isDef(var_args)) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0)
      }
      return G__7548__delegate.call(this, f, c1, c2, c3, colls)
    };
    G__7548.cljs$lang$maxFixedArity = 4;
    G__7548.cljs$lang$applyTo = function(arglist__7549) {
      var f = cljs.core.first(arglist__7549);
      var c1 = cljs.core.first(cljs.core.next(arglist__7549));
      var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7549)));
      var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7549))));
      var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__7549))));
      return G__7548__delegate(f, c1, c2, c3, colls)
    };
    G__7548.cljs$lang$arity$variadic = G__7548__delegate;
    return G__7548
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
      var temp__324__auto____7550 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7550)) {
        var s__7551 = temp__324__auto____7550;
        var p__7552 = cljs.core.take.call(null, n, s__7551);
        if(n === cljs.core.count.call(null, p__7552)) {
          return cljs.core.cons.call(null, p__7552, partition.call(null, n, step, cljs.core.drop.call(null, step, s__7551)))
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
      var temp__324__auto____7553 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____7553)) {
        var s__7554 = temp__324__auto____7553;
        var p__7555 = cljs.core.take.call(null, n, s__7554);
        if(n === cljs.core.count.call(null, p__7555)) {
          return cljs.core.cons.call(null, p__7555, partition.call(null, n, step, pad, cljs.core.drop.call(null, step, s__7554)))
        }else {
          return cljs.core.list.call(null, cljs.core.take.call(null, n, cljs.core.concat.call(null, p__7555, pad)))
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
    var sentinel__7556 = cljs.core.lookup_sentinel;
    var m__7557 = m;
    var ks__7558 = cljs.core.seq.call(null, ks);
    while(true) {
      if(cljs.core.truth_(ks__7558)) {
        var m__7559 = cljs.core.get.call(null, m__7557, cljs.core.first.call(null, ks__7558), sentinel__7556);
        if(sentinel__7556 === m__7559) {
          return not_found
        }else {
          var G__7560 = sentinel__7556;
          var G__7561 = m__7559;
          var G__7562 = cljs.core.next.call(null, ks__7558);
          sentinel__7556 = G__7560;
          m__7557 = G__7561;
          ks__7558 = G__7562;
          continue
        }
      }else {
        return m__7557
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
cljs.core.assoc_in = function assoc_in(m, p__7563, v) {
  var vec__7564__7565 = p__7563;
  var k__7566 = cljs.core.nth.call(null, vec__7564__7565, 0, null);
  var ks__7567 = cljs.core.nthnext.call(null, vec__7564__7565, 1);
  if(cljs.core.truth_(ks__7567)) {
    return cljs.core.assoc.call(null, m, k__7566, assoc_in.call(null, cljs.core.get.call(null, m, k__7566), ks__7567, v))
  }else {
    return cljs.core.assoc.call(null, m, k__7566, v)
  }
};
cljs.core.update_in = function() {
  var update_in__delegate = function(m, p__7568, f, args) {
    var vec__7569__7570 = p__7568;
    var k__7571 = cljs.core.nth.call(null, vec__7569__7570, 0, null);
    var ks__7572 = cljs.core.nthnext.call(null, vec__7569__7570, 1);
    if(cljs.core.truth_(ks__7572)) {
      return cljs.core.assoc.call(null, m, k__7571, cljs.core.apply.call(null, update_in, cljs.core.get.call(null, m, k__7571), ks__7572, f, args))
    }else {
      return cljs.core.assoc.call(null, m, k__7571, cljs.core.apply.call(null, f, cljs.core.get.call(null, m, k__7571), args))
    }
  };
  var update_in = function(m, p__7568, f, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
    }
    return update_in__delegate.call(this, m, p__7568, f, args)
  };
  update_in.cljs$lang$maxFixedArity = 3;
  update_in.cljs$lang$applyTo = function(arglist__7573) {
    var m = cljs.core.first(arglist__7573);
    var p__7568 = cljs.core.first(cljs.core.next(arglist__7573));
    var f = cljs.core.first(cljs.core.next(cljs.core.next(arglist__7573)));
    var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__7573)));
    return update_in__delegate(m, p__7568, f, args)
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
  var this__7578 = this;
  var h__2328__auto____7579 = this__7578.__hash;
  if(h__2328__auto____7579 != null) {
    return h__2328__auto____7579
  }else {
    var h__2328__auto____7580 = cljs.core.hash_coll.call(null, coll);
    this__7578.__hash = h__2328__auto____7580;
    return h__2328__auto____7580
  }
};
cljs.core.Vector.prototype.cljs$core$ILookup$ = true;
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7581 = this;
  return cljs.core._nth.call(null, coll, k, null)
};
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7582 = this;
  return cljs.core._nth.call(null, coll, k, not_found)
};
cljs.core.Vector.prototype.cljs$core$IAssociative$ = true;
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__7583 = this;
  var new_array__7584 = cljs.core.aclone.call(null, this__7583.array);
  new_array__7584[k] = v;
  return new cljs.core.Vector(this__7583.meta, new_array__7584, null)
};
cljs.core.Vector.prototype.cljs$core$IFn$ = true;
cljs.core.Vector.prototype.call = function() {
  var G__7613 = null;
  var G__7613__2 = function(tsym7576, k) {
    var this__7585 = this;
    var tsym7576__7586 = this;
    var coll__7587 = tsym7576__7586;
    return cljs.core._lookup.call(null, coll__7587, k)
  };
  var G__7613__3 = function(tsym7577, k, not_found) {
    var this__7588 = this;
    var tsym7577__7589 = this;
    var coll__7590 = tsym7577__7589;
    return cljs.core._lookup.call(null, coll__7590, k, not_found)
  };
  G__7613 = function(tsym7577, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7613__2.call(this, tsym7577, k);
      case 3:
        return G__7613__3.call(this, tsym7577, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7613
}();
cljs.core.Vector.prototype.apply = function(tsym7574, args7575) {
  return tsym7574.call.apply(tsym7574, [tsym7574].concat(cljs.core.aclone.call(null, args7575)))
};
cljs.core.Vector.prototype.cljs$core$ISequential$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7591 = this;
  var new_array__7592 = cljs.core.aclone.call(null, this__7591.array);
  new_array__7592.push(o);
  return new cljs.core.Vector(this__7591.meta, new_array__7592, null)
};
cljs.core.Vector.prototype.toString = function() {
  var this__7593 = this;
  var this$__7594 = this;
  return cljs.core.pr_str.call(null, this$__7594)
};
cljs.core.Vector.prototype.cljs$core$IReduce$ = true;
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(v, f) {
  var this__7595 = this;
  return cljs.core.ci_reduce.call(null, this__7595.array, f)
};
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(v, f, start) {
  var this__7596 = this;
  return cljs.core.ci_reduce.call(null, this__7596.array, f, start)
};
cljs.core.Vector.prototype.cljs$core$ISeqable$ = true;
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7597 = this;
  if(this__7597.array.length > 0) {
    var vector_seq__7598 = function vector_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < this__7597.array.length) {
          return cljs.core.cons.call(null, this__7597.array[i], vector_seq.call(null, i + 1))
        }else {
          return null
        }
      })
    };
    return vector_seq__7598.call(null, 0)
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$ICounted$ = true;
cljs.core.Vector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7599 = this;
  return this__7599.array.length
};
cljs.core.Vector.prototype.cljs$core$IStack$ = true;
cljs.core.Vector.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__7600 = this;
  var count__7601 = this__7600.array.length;
  if(count__7601 > 0) {
    return this__7600.array[count__7601 - 1]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__7602 = this;
  if(this__7602.array.length > 0) {
    var new_array__7603 = cljs.core.aclone.call(null, this__7602.array);
    new_array__7603.pop();
    return new cljs.core.Vector(this__7602.meta, new_array__7603, null)
  }else {
    throw new Error("Can't pop empty vector");
  }
};
cljs.core.Vector.prototype.cljs$core$IVector$ = true;
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__7604 = this;
  return cljs.core._assoc.call(null, coll, n, val)
};
cljs.core.Vector.prototype.cljs$core$IEquiv$ = true;
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7605 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Vector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7606 = this;
  return new cljs.core.Vector(meta, this__7606.array, this__7606.__hash)
};
cljs.core.Vector.prototype.cljs$core$IMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7607 = this;
  return this__7607.meta
};
cljs.core.Vector.prototype.cljs$core$IIndexed$ = true;
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__7609 = this;
  if(function() {
    var and__132__auto____7610 = 0 <= n;
    if(and__132__auto____7610) {
      return n < this__7609.array.length
    }else {
      return and__132__auto____7610
    }
  }()) {
    return this__7609.array[n]
  }else {
    return null
  }
};
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__7611 = this;
  if(function() {
    var and__132__auto____7612 = 0 <= n;
    if(and__132__auto____7612) {
      return n < this__7611.array.length
    }else {
      return and__132__auto____7612
    }
  }()) {
    return this__7611.array[n]
  }else {
    return not_found
  }
};
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7608 = this;
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this__7608.meta)
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
  var cnt__7614 = pv.cnt;
  if(cnt__7614 < 32) {
    return 0
  }else {
    return cnt__7614 - 1 >>> 5 << 5
  }
};
cljs.core.new_path = function new_path(edit, level, node) {
  var ll__7615 = level;
  var ret__7616 = node;
  while(true) {
    if(ll__7615 === 0) {
      return ret__7616
    }else {
      var embed__7617 = ret__7616;
      var r__7618 = cljs.core.pv_fresh_node.call(null, edit);
      var ___7619 = cljs.core.pv_aset.call(null, r__7618, 0, embed__7617);
      var G__7620 = ll__7615 - 5;
      var G__7621 = r__7618;
      ll__7615 = G__7620;
      ret__7616 = G__7621;
      continue
    }
    break
  }
};
cljs.core.push_tail = function push_tail(pv, level, parent, tailnode) {
  var ret__7622 = cljs.core.pv_clone_node.call(null, parent);
  var subidx__7623 = pv.cnt - 1 >>> level & 31;
  if(5 === level) {
    cljs.core.pv_aset.call(null, ret__7622, subidx__7623, tailnode);
    return ret__7622
  }else {
    var temp__317__auto____7624 = cljs.core.pv_aget.call(null, parent, subidx__7623);
    if(cljs.core.truth_(temp__317__auto____7624)) {
      var child__7625 = temp__317__auto____7624;
      var node_to_insert__7626 = push_tail.call(null, pv, level - 5, child__7625, tailnode);
      cljs.core.pv_aset.call(null, ret__7622, subidx__7623, node_to_insert__7626);
      return ret__7622
    }else {
      var node_to_insert__7627 = cljs.core.new_path.call(null, null, level - 5, tailnode);
      cljs.core.pv_aset.call(null, ret__7622, subidx__7623, node_to_insert__7627);
      return ret__7622
    }
  }
};
cljs.core.array_for = function array_for(pv, i) {
  if(function() {
    var and__132__auto____7628 = 0 <= i;
    if(and__132__auto____7628) {
      return i < pv.cnt
    }else {
      return and__132__auto____7628
    }
  }()) {
    if(i >= cljs.core.tail_off.call(null, pv)) {
      return pv.tail
    }else {
      var node__7629 = pv.root;
      var level__7630 = pv.shift;
      while(true) {
        if(level__7630 > 0) {
          var G__7631 = cljs.core.pv_aget.call(null, node__7629, i >>> level__7630 & 31);
          var G__7632 = level__7630 - 5;
          node__7629 = G__7631;
          level__7630 = G__7632;
          continue
        }else {
          return node__7629.arr
        }
        break
      }
    }
  }else {
    throw new Error([cljs.core.str("No item "), cljs.core.str(i), cljs.core.str(" in vector of length "), cljs.core.str(pv.cnt)].join(""));
  }
};
cljs.core.do_assoc = function do_assoc(pv, level, node, i, val) {
  var ret__7633 = cljs.core.pv_clone_node.call(null, node);
  if(level === 0) {
    cljs.core.pv_aset.call(null, ret__7633, i & 31, val);
    return ret__7633
  }else {
    var subidx__7634 = i >>> level & 31;
    cljs.core.pv_aset.call(null, ret__7633, subidx__7634, do_assoc.call(null, pv, level - 5, cljs.core.pv_aget.call(null, node, subidx__7634), i, val));
    return ret__7633
  }
};
cljs.core.pop_tail = function pop_tail(pv, level, node) {
  var subidx__7635 = pv.cnt - 2 >>> level & 31;
  if(level > 5) {
    var new_child__7636 = pop_tail.call(null, pv, level - 5, cljs.core.pv_aget.call(null, node, subidx__7635));
    if(function() {
      var and__132__auto____7637 = new_child__7636 == null;
      if(and__132__auto____7637) {
        return subidx__7635 === 0
      }else {
        return and__132__auto____7637
      }
    }()) {
      return null
    }else {
      var ret__7638 = cljs.core.pv_clone_node.call(null, node);
      cljs.core.pv_aset.call(null, ret__7638, subidx__7635, new_child__7636);
      return ret__7638
    }
  }else {
    if(subidx__7635 === 0) {
      return null
    }else {
      if("\ufdd0'else") {
        var ret__7639 = cljs.core.pv_clone_node.call(null, node);
        cljs.core.pv_aset.call(null, ret__7639, subidx__7635, null);
        return ret__7639
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
  var c__7640 = cljs.core._count.call(null, v);
  if(c__7640 > 0) {
    if(void 0 === cljs.core.t7641) {
      cljs.core.t7641 = function(c, offset, v, vector_seq, __meta__2353__auto__) {
        this.c = c;
        this.offset = offset;
        this.v = v;
        this.vector_seq = vector_seq;
        this.__meta__2353__auto__ = __meta__2353__auto__;
        this.cljs$lang$protocol_mask$partition1$ = 0;
        this.cljs$lang$protocol_mask$partition0$ = 282263648
      };
      cljs.core.t7641.cljs$lang$type = true;
      cljs.core.t7641.cljs$lang$ctorPrSeq = function(this__2418__auto__) {
        return cljs.core.list.call(null, "cljs.core.t7641")
      };
      cljs.core.t7641.prototype.cljs$core$ISeqable$ = true;
      cljs.core.t7641.prototype.cljs$core$ISeqable$_seq$arity$1 = function(vseq) {
        var this__7642 = this;
        return vseq
      };
      cljs.core.t7641.prototype.cljs$core$ISeq$ = true;
      cljs.core.t7641.prototype.cljs$core$ISeq$_first$arity$1 = function(_) {
        var this__7643 = this;
        return cljs.core._nth.call(null, this__7643.v, this__7643.offset)
      };
      cljs.core.t7641.prototype.cljs$core$ISeq$_rest$arity$1 = function(_) {
        var this__7644 = this;
        var offset__7645 = this__7644.offset + 1;
        if(offset__7645 < this__7644.c) {
          return this__7644.vector_seq.call(null, this__7644.v, offset__7645)
        }else {
          return cljs.core.List.EMPTY
        }
      };
      cljs.core.t7641.prototype.cljs$core$ASeq$ = true;
      cljs.core.t7641.prototype.cljs$core$IEquiv$ = true;
      cljs.core.t7641.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(vseq, other) {
        var this__7646 = this;
        return cljs.core.equiv_sequential.call(null, vseq, other)
      };
      cljs.core.t7641.prototype.cljs$core$ISequential$ = true;
      cljs.core.t7641.prototype.cljs$core$IPrintable$ = true;
      cljs.core.t7641.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(vseq, opts) {
        var this__7647 = this;
        return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "(", " ", ")", opts, vseq)
      };
      cljs.core.t7641.prototype.cljs$core$IMeta$ = true;
      cljs.core.t7641.prototype.cljs$core$IMeta$_meta$arity$1 = function(___2354__auto__) {
        var this__7648 = this;
        return this__7648.__meta__2353__auto__
      };
      cljs.core.t7641.prototype.cljs$core$IWithMeta$ = true;
      cljs.core.t7641.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(___2354__auto__, __meta__2353__auto__) {
        var this__7649 = this;
        return new cljs.core.t7641(this__7649.c, this__7649.offset, this__7649.v, this__7649.vector_seq, __meta__2353__auto__)
      };
      cljs.core.t7641
    }else {
    }
    return new cljs.core.t7641(c__7640, offset, v, vector_seq, null)
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
  var this__7654 = this;
  return new cljs.core.TransientVector(this__7654.cnt, this__7654.shift, cljs.core.tv_editable_root.call(null, this__7654.root), cljs.core.tv_editable_tail.call(null, this__7654.tail))
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7655 = this;
  var h__2328__auto____7656 = this__7655.__hash;
  if(h__2328__auto____7656 != null) {
    return h__2328__auto____7656
  }else {
    var h__2328__auto____7657 = cljs.core.hash_coll.call(null, coll);
    this__7655.__hash = h__2328__auto____7657;
    return h__2328__auto____7657
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7658 = this;
  return cljs.core._nth.call(null, coll, k, null)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7659 = this;
  return cljs.core._nth.call(null, coll, k, not_found)
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__7660 = this;
  if(function() {
    var and__132__auto____7661 = 0 <= k;
    if(and__132__auto____7661) {
      return k < this__7660.cnt
    }else {
      return and__132__auto____7661
    }
  }()) {
    if(cljs.core.tail_off.call(null, coll) <= k) {
      var new_tail__7662 = cljs.core.aclone.call(null, this__7660.tail);
      new_tail__7662[k & 31] = v;
      return new cljs.core.PersistentVector(this__7660.meta, this__7660.cnt, this__7660.shift, this__7660.root, new_tail__7662, null)
    }else {
      return new cljs.core.PersistentVector(this__7660.meta, this__7660.cnt, this__7660.shift, cljs.core.do_assoc.call(null, coll, this__7660.shift, this__7660.root, k, v), this__7660.tail, null)
    }
  }else {
    if(k === this__7660.cnt) {
      return cljs.core._conj.call(null, coll, v)
    }else {
      if("\ufdd0'else") {
        throw new Error([cljs.core.str("Index "), cljs.core.str(k), cljs.core.str(" out of bounds  [0,"), cljs.core.str(this__7660.cnt), cljs.core.str("]")].join(""));
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentVector.prototype.call = function() {
  var G__7707 = null;
  var G__7707__2 = function(tsym7652, k) {
    var this__7663 = this;
    var tsym7652__7664 = this;
    var coll__7665 = tsym7652__7664;
    return cljs.core._lookup.call(null, coll__7665, k)
  };
  var G__7707__3 = function(tsym7653, k, not_found) {
    var this__7666 = this;
    var tsym7653__7667 = this;
    var coll__7668 = tsym7653__7667;
    return cljs.core._lookup.call(null, coll__7668, k, not_found)
  };
  G__7707 = function(tsym7653, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7707__2.call(this, tsym7653, k);
      case 3:
        return G__7707__3.call(this, tsym7653, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7707
}();
cljs.core.PersistentVector.prototype.apply = function(tsym7650, args7651) {
  return tsym7650.call.apply(tsym7650, [tsym7650].concat(cljs.core.aclone.call(null, args7651)))
};
cljs.core.PersistentVector.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(v, f, init) {
  var this__7669 = this;
  var step_init__7670 = [0, init];
  var i__7671 = 0;
  while(true) {
    if(i__7671 < this__7669.cnt) {
      var arr__7672 = cljs.core.array_for.call(null, v, i__7671);
      var len__7673 = arr__7672.length;
      var init__7677 = function() {
        var j__7674 = 0;
        var init__7675 = step_init__7670[1];
        while(true) {
          if(j__7674 < len__7673) {
            var init__7676 = f.call(null, init__7675, j__7674 + i__7671, arr__7672[j__7674]);
            if(cljs.core.reduced_QMARK_.call(null, init__7676)) {
              return init__7676
            }else {
              var G__7708 = j__7674 + 1;
              var G__7709 = init__7676;
              j__7674 = G__7708;
              init__7675 = G__7709;
              continue
            }
          }else {
            step_init__7670[0] = len__7673;
            step_init__7670[1] = init__7675;
            return init__7675
          }
          break
        }
      }();
      if(cljs.core.reduced_QMARK_.call(null, init__7677)) {
        return cljs.core.deref.call(null, init__7677)
      }else {
        var G__7710 = i__7671 + step_init__7670[0];
        i__7671 = G__7710;
        continue
      }
    }else {
      return step_init__7670[1]
    }
    break
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7678 = this;
  if(this__7678.cnt - cljs.core.tail_off.call(null, coll) < 32) {
    var new_tail__7679 = cljs.core.aclone.call(null, this__7678.tail);
    new_tail__7679.push(o);
    return new cljs.core.PersistentVector(this__7678.meta, this__7678.cnt + 1, this__7678.shift, this__7678.root, new_tail__7679, null)
  }else {
    var root_overflow_QMARK___7680 = this__7678.cnt >>> 5 > 1 << this__7678.shift;
    var new_shift__7681 = root_overflow_QMARK___7680 ? this__7678.shift + 5 : this__7678.shift;
    var new_root__7683 = root_overflow_QMARK___7680 ? function() {
      var n_r__7682 = cljs.core.pv_fresh_node.call(null, null);
      cljs.core.pv_aset.call(null, n_r__7682, 0, this__7678.root);
      cljs.core.pv_aset.call(null, n_r__7682, 1, cljs.core.new_path.call(null, null, this__7678.shift, new cljs.core.VectorNode(null, this__7678.tail)));
      return n_r__7682
    }() : cljs.core.push_tail.call(null, coll, this__7678.shift, this__7678.root, new cljs.core.VectorNode(null, this__7678.tail));
    return new cljs.core.PersistentVector(this__7678.meta, this__7678.cnt + 1, new_shift__7681, new_root__7683, [o], null)
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(coll) {
  var this__7684 = this;
  return cljs.core._nth.call(null, coll, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(coll) {
  var this__7685 = this;
  return cljs.core._nth.call(null, coll, 1)
};
cljs.core.PersistentVector.prototype.toString = function() {
  var this__7686 = this;
  var this$__7687 = this;
  return cljs.core.pr_str.call(null, this$__7687)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(v, f) {
  var this__7688 = this;
  return cljs.core.ci_reduce.call(null, v, f)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(v, f, start) {
  var this__7689 = this;
  return cljs.core.ci_reduce.call(null, v, f, start)
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7690 = this;
  return cljs.core.vector_seq.call(null, coll, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7691 = this;
  return this__7691.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__7692 = this;
  if(this__7692.cnt > 0) {
    return cljs.core._nth.call(null, coll, this__7692.cnt - 1)
  }else {
    return null
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__7693 = this;
  if(this__7693.cnt === 0) {
    throw new Error("Can't pop empty vector");
  }else {
    if(1 === this__7693.cnt) {
      return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__7693.meta)
    }else {
      if(1 < this__7693.cnt - cljs.core.tail_off.call(null, coll)) {
        return new cljs.core.PersistentVector(this__7693.meta, this__7693.cnt - 1, this__7693.shift, this__7693.root, this__7693.tail.slice(0, -1), null)
      }else {
        if("\ufdd0'else") {
          var new_tail__7694 = cljs.core.array_for.call(null, coll, this__7693.cnt - 2);
          var nr__7695 = cljs.core.pop_tail.call(null, coll, this__7693.shift, this__7693.root);
          var new_root__7696 = nr__7695 == null ? cljs.core.PersistentVector.EMPTY_NODE : nr__7695;
          var cnt_1__7697 = this__7693.cnt - 1;
          if(function() {
            var and__132__auto____7698 = 5 < this__7693.shift;
            if(and__132__auto____7698) {
              return cljs.core.pv_aget.call(null, new_root__7696, 1) == null
            }else {
              return and__132__auto____7698
            }
          }()) {
            return new cljs.core.PersistentVector(this__7693.meta, cnt_1__7697, this__7693.shift - 5, cljs.core.pv_aget.call(null, new_root__7696, 0), new_tail__7694, null)
          }else {
            return new cljs.core.PersistentVector(this__7693.meta, cnt_1__7697, this__7693.shift, new_root__7696, new_tail__7694, null)
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
  var this__7700 = this;
  return cljs.core._assoc.call(null, coll, n, val)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7701 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7702 = this;
  return new cljs.core.PersistentVector(meta, this__7702.cnt, this__7702.shift, this__7702.root, this__7702.tail, this__7702.__hash)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7703 = this;
  return this__7703.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__7704 = this;
  return cljs.core.array_for.call(null, coll, n)[n & 31]
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__7705 = this;
  if(function() {
    var and__132__auto____7706 = 0 <= n;
    if(and__132__auto____7706) {
      return n < this__7705.cnt
    }else {
      return and__132__auto____7706
    }
  }()) {
    return cljs.core._nth.call(null, coll, n)
  }else {
    return not_found
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7699 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this__7699.meta)
};
cljs.core.PersistentVector;
cljs.core.PersistentVector.EMPTY_NODE = cljs.core.pv_fresh_node.call(null, null);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, [], 0);
cljs.core.PersistentVector.fromArray = function(xs) {
  var xs__7711 = cljs.core.seq.call(null, xs);
  var out__7712 = cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY);
  while(true) {
    if(cljs.core.truth_(xs__7711)) {
      var G__7713 = cljs.core.next.call(null, xs__7711);
      var G__7714 = cljs.core.conj_BANG_.call(null, out__7712, cljs.core.first.call(null, xs__7711));
      xs__7711 = G__7713;
      out__7712 = G__7714;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__7712)
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
  vector.cljs$lang$applyTo = function(arglist__7715) {
    var args = cljs.core.seq(arglist__7715);
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
  var this__7720 = this;
  var h__2328__auto____7721 = this__7720.__hash;
  if(h__2328__auto____7721 != null) {
    return h__2328__auto____7721
  }else {
    var h__2328__auto____7722 = cljs.core.hash_coll.call(null, coll);
    this__7720.__hash = h__2328__auto____7722;
    return h__2328__auto____7722
  }
};
cljs.core.Subvec.prototype.cljs$core$ILookup$ = true;
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7723 = this;
  return cljs.core._nth.call(null, coll, k, null)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7724 = this;
  return cljs.core._nth.call(null, coll, k, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$ = true;
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, key, val) {
  var this__7725 = this;
  var v_pos__7726 = this__7725.start + key;
  return new cljs.core.Subvec(this__7725.meta, cljs.core._assoc.call(null, this__7725.v, v_pos__7726, val), this__7725.start, this__7725.end > v_pos__7726 + 1 ? this__7725.end : v_pos__7726 + 1, null)
};
cljs.core.Subvec.prototype.cljs$core$IFn$ = true;
cljs.core.Subvec.prototype.call = function() {
  var G__7750 = null;
  var G__7750__2 = function(tsym7718, k) {
    var this__7727 = this;
    var tsym7718__7728 = this;
    var coll__7729 = tsym7718__7728;
    return cljs.core._lookup.call(null, coll__7729, k)
  };
  var G__7750__3 = function(tsym7719, k, not_found) {
    var this__7730 = this;
    var tsym7719__7731 = this;
    var coll__7732 = tsym7719__7731;
    return cljs.core._lookup.call(null, coll__7732, k, not_found)
  };
  G__7750 = function(tsym7719, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7750__2.call(this, tsym7719, k);
      case 3:
        return G__7750__3.call(this, tsym7719, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7750
}();
cljs.core.Subvec.prototype.apply = function(tsym7716, args7717) {
  return tsym7716.call.apply(tsym7716, [tsym7716].concat(cljs.core.aclone.call(null, args7717)))
};
cljs.core.Subvec.prototype.cljs$core$ISequential$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7733 = this;
  return new cljs.core.Subvec(this__7733.meta, cljs.core._assoc_n.call(null, this__7733.v, this__7733.end, o), this__7733.start, this__7733.end + 1, null)
};
cljs.core.Subvec.prototype.toString = function() {
  var this__7734 = this;
  var this$__7735 = this;
  return cljs.core.pr_str.call(null, this$__7735)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$ = true;
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var this__7736 = this;
  return cljs.core.ci_reduce.call(null, coll, f)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var this__7737 = this;
  return cljs.core.ci_reduce.call(null, coll, f, start)
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$ = true;
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7738 = this;
  var subvec_seq__7739 = function subvec_seq(i) {
    if(i === this__7738.end) {
      return null
    }else {
      return cljs.core.cons.call(null, cljs.core._nth.call(null, this__7738.v, i), new cljs.core.LazySeq(null, false, function() {
        return subvec_seq.call(null, i + 1)
      }))
    }
  };
  return subvec_seq__7739.call(null, this__7738.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$ = true;
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7740 = this;
  return this__7740.end - this__7740.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$ = true;
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__7741 = this;
  return cljs.core._nth.call(null, this__7741.v, this__7741.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__7742 = this;
  if(this__7742.start === this__7742.end) {
    throw new Error("Can't pop empty vector");
  }else {
    return new cljs.core.Subvec(this__7742.meta, this__7742.v, this__7742.start, this__7742.end - 1, null)
  }
};
cljs.core.Subvec.prototype.cljs$core$IVector$ = true;
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var this__7743 = this;
  return cljs.core._assoc.call(null, coll, n, val)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$ = true;
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7744 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7745 = this;
  return new cljs.core.Subvec(meta, this__7745.v, this__7745.start, this__7745.end, this__7745.__hash)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7746 = this;
  return this__7746.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$ = true;
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__7748 = this;
  return cljs.core._nth.call(null, this__7748.v, this__7748.start + n)
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__7749 = this;
  return cljs.core._nth.call(null, this__7749.v, this__7749.start + n, not_found)
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7747 = this;
  return cljs.core.with_meta.call(null, cljs.core.Vector.EMPTY, this__7747.meta)
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
  var ret__7751 = cljs.core.make_array.call(null, 32);
  cljs.core.array_copy.call(null, tl, 0, ret__7751, 0, tl.length);
  return ret__7751
};
cljs.core.tv_push_tail = function tv_push_tail(tv, level, parent, tail_node) {
  var ret__7752 = cljs.core.tv_ensure_editable.call(null, tv.root.edit, parent);
  var subidx__7753 = tv.cnt - 1 >>> level & 31;
  cljs.core.pv_aset.call(null, ret__7752, subidx__7753, level === 5 ? tail_node : function() {
    var child__7754 = cljs.core.pv_aget.call(null, ret__7752, subidx__7753);
    if(child__7754 != null) {
      return tv_push_tail.call(null, tv, level - 5, child__7754, tail_node)
    }else {
      return cljs.core.new_path.call(null, tv.root.edit, level - 5, tail_node)
    }
  }());
  return ret__7752
};
cljs.core.tv_pop_tail = function tv_pop_tail(tv, level, node) {
  var node__7755 = cljs.core.tv_ensure_editable.call(null, tv.root.edit, node);
  var subidx__7756 = tv.cnt - 2 >>> level & 31;
  if(level > 5) {
    var new_child__7757 = tv_pop_tail.call(null, tv, level - 5, cljs.core.pv_aget.call(null, node__7755, subidx__7756));
    if(function() {
      var and__132__auto____7758 = new_child__7757 == null;
      if(and__132__auto____7758) {
        return subidx__7756 === 0
      }else {
        return and__132__auto____7758
      }
    }()) {
      return null
    }else {
      cljs.core.pv_aset.call(null, node__7755, subidx__7756, new_child__7757);
      return node__7755
    }
  }else {
    if(subidx__7756 === 0) {
      return null
    }else {
      if("\ufdd0'else") {
        cljs.core.pv_aset.call(null, node__7755, subidx__7756, null);
        return node__7755
      }else {
        return null
      }
    }
  }
};
cljs.core.editable_array_for = function editable_array_for(tv, i) {
  if(function() {
    var and__132__auto____7759 = 0 <= i;
    if(and__132__auto____7759) {
      return i < tv.cnt
    }else {
      return and__132__auto____7759
    }
  }()) {
    if(i >= cljs.core.tail_off.call(null, tv)) {
      return tv.tail
    }else {
      var root__7760 = tv.root;
      var node__7761 = root__7760;
      var level__7762 = tv.shift;
      while(true) {
        if(level__7762 > 0) {
          var G__7763 = cljs.core.tv_ensure_editable.call(null, root__7760.edit, cljs.core.pv_aget.call(null, node__7761, i >>> level__7762 & 31));
          var G__7764 = level__7762 - 5;
          node__7761 = G__7763;
          level__7762 = G__7764;
          continue
        }else {
          return node__7761.arr
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
  var G__7802 = null;
  var G__7802__2 = function(tsym7767, k) {
    var this__7769 = this;
    var tsym7767__7770 = this;
    var coll__7771 = tsym7767__7770;
    return cljs.core._lookup.call(null, coll__7771, k)
  };
  var G__7802__3 = function(tsym7768, k, not_found) {
    var this__7772 = this;
    var tsym7768__7773 = this;
    var coll__7774 = tsym7768__7773;
    return cljs.core._lookup.call(null, coll__7774, k, not_found)
  };
  G__7802 = function(tsym7768, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7802__2.call(this, tsym7768, k);
      case 3:
        return G__7802__3.call(this, tsym7768, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7802
}();
cljs.core.TransientVector.prototype.apply = function(tsym7765, args7766) {
  return tsym7765.call.apply(tsym7765, [tsym7765].concat(cljs.core.aclone.call(null, args7766)))
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7775 = this;
  return cljs.core._nth.call(null, coll, k, null)
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7776 = this;
  return cljs.core._nth.call(null, coll, k, not_found)
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$ = true;
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var this__7777 = this;
  if(cljs.core.truth_(this__7777.root.edit)) {
    return cljs.core.array_for.call(null, coll, n)[n & 31]
  }else {
    throw new Error("nth after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var this__7778 = this;
  if(function() {
    var and__132__auto____7779 = 0 <= n;
    if(and__132__auto____7779) {
      return n < this__7778.cnt
    }else {
      return and__132__auto____7779
    }
  }()) {
    return cljs.core._nth.call(null, coll, n)
  }else {
    return not_found
  }
};
cljs.core.TransientVector.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7780 = this;
  if(cljs.core.truth_(this__7780.root.edit)) {
    return this__7780.cnt
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$ = true;
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = function(tcoll, n, val) {
  var this__7781 = this;
  if(cljs.core.truth_(this__7781.root.edit)) {
    if(function() {
      var and__132__auto____7782 = 0 <= n;
      if(and__132__auto____7782) {
        return n < this__7781.cnt
      }else {
        return and__132__auto____7782
      }
    }()) {
      if(cljs.core.tail_off.call(null, tcoll) <= n) {
        this__7781.tail[n & 31] = val;
        return tcoll
      }else {
        var new_root__7785 = function go(level, node) {
          var node__7783 = cljs.core.tv_ensure_editable.call(null, this__7781.root.edit, node);
          if(level === 0) {
            cljs.core.pv_aset.call(null, node__7783, n & 31, val);
            return node__7783
          }else {
            var subidx__7784 = n >>> level & 31;
            cljs.core.pv_aset.call(null, node__7783, subidx__7784, go.call(null, level - 5, cljs.core.pv_aget.call(null, node__7783, subidx__7784)));
            return node__7783
          }
        }.call(null, this__7781.shift, this__7781.root);
        this__7781.root = new_root__7785;
        return tcoll
      }
    }else {
      if(n === this__7781.cnt) {
        return cljs.core._conj_BANG_.call(null, tcoll, val)
      }else {
        if("\ufdd0'else") {
          throw new Error([cljs.core.str("Index "), cljs.core.str(n), cljs.core.str(" out of bounds for TransientVector of length"), cljs.core.str(this__7781.cnt)].join(""));
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
  var this__7786 = this;
  if(cljs.core.truth_(this__7786.root.edit)) {
    if(this__7786.cnt === 0) {
      throw new Error("Can't pop empty vector");
    }else {
      if(1 === this__7786.cnt) {
        this__7786.cnt = 0;
        return tcoll
      }else {
        if((this__7786.cnt - 1 & 31) > 0) {
          this__7786.cnt = this__7786.cnt - 1;
          return tcoll
        }else {
          if("\ufdd0'else") {
            var new_tail__7787 = cljs.core.editable_array_for.call(null, tcoll, this__7786.cnt - 2);
            var new_root__7789 = function() {
              var nr__7788 = cljs.core.tv_pop_tail.call(null, tcoll, this__7786.shift, this__7786.root);
              if(nr__7788 != null) {
                return nr__7788
              }else {
                return new cljs.core.VectorNode(this__7786.root.edit, cljs.core.make_array.call(null, 32))
              }
            }();
            if(function() {
              var and__132__auto____7790 = 5 < this__7786.shift;
              if(and__132__auto____7790) {
                return cljs.core.pv_aget.call(null, new_root__7789, 1) == null
              }else {
                return and__132__auto____7790
              }
            }()) {
              var new_root__7791 = cljs.core.tv_ensure_editable.call(null, this__7786.root.edit, cljs.core.pv_aget.call(null, new_root__7789, 0));
              this__7786.root = new_root__7791;
              this__7786.shift = this__7786.shift - 5;
              this__7786.cnt = this__7786.cnt - 1;
              this__7786.tail = new_tail__7787;
              return tcoll
            }else {
              this__7786.root = new_root__7789;
              this__7786.cnt = this__7786.cnt - 1;
              this__7786.tail = new_tail__7787;
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
  var this__7792 = this;
  return cljs.core._assoc_n_BANG_.call(null, tcoll, key, val)
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__7793 = this;
  if(cljs.core.truth_(this__7793.root.edit)) {
    if(this__7793.cnt - cljs.core.tail_off.call(null, tcoll) < 32) {
      this__7793.tail[this__7793.cnt & 31] = o;
      this__7793.cnt = this__7793.cnt + 1;
      return tcoll
    }else {
      var tail_node__7794 = new cljs.core.VectorNode(this__7793.root.edit, this__7793.tail);
      var new_tail__7795 = cljs.core.make_array.call(null, 32);
      new_tail__7795[0] = o;
      this__7793.tail = new_tail__7795;
      if(this__7793.cnt >>> 5 > 1 << this__7793.shift) {
        var new_root_array__7796 = cljs.core.make_array.call(null, 32);
        var new_shift__7797 = this__7793.shift + 5;
        new_root_array__7796[0] = this__7793.root;
        new_root_array__7796[1] = cljs.core.new_path.call(null, this__7793.root.edit, this__7793.shift, tail_node__7794);
        this__7793.root = new cljs.core.VectorNode(this__7793.root.edit, new_root_array__7796);
        this__7793.shift = new_shift__7797;
        this__7793.cnt = this__7793.cnt + 1;
        return tcoll
      }else {
        var new_root__7798 = cljs.core.tv_push_tail.call(null, tcoll, this__7793.shift, this__7793.root, tail_node__7794);
        this__7793.root = new_root__7798;
        this__7793.cnt = this__7793.cnt + 1;
        return tcoll
      }
    }
  }else {
    throw new Error("conj! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__7799 = this;
  if(cljs.core.truth_(this__7799.root.edit)) {
    this__7799.root.edit = null;
    var len__7800 = this__7799.cnt - cljs.core.tail_off.call(null, tcoll);
    var trimmed_tail__7801 = cljs.core.make_array.call(null, len__7800);
    cljs.core.array_copy.call(null, this__7799.tail, 0, trimmed_tail__7801, 0, len__7800);
    return new cljs.core.PersistentVector(null, this__7799.cnt, this__7799.shift, this__7799.root, trimmed_tail__7801, null)
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
  var this__7803 = this;
  var h__2328__auto____7804 = this__7803.__hash;
  if(h__2328__auto____7804 != null) {
    return h__2328__auto____7804
  }else {
    var h__2328__auto____7805 = cljs.core.hash_coll.call(null, coll);
    this__7803.__hash = h__2328__auto____7805;
    return h__2328__auto____7805
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7806 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  var this__7807 = this;
  var this$__7808 = this;
  return cljs.core.pr_str.call(null, this$__7808)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7809 = this;
  return coll
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__7810 = this;
  return cljs.core._first.call(null, this__7810.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__7811 = this;
  var temp__317__auto____7812 = cljs.core.next.call(null, this__7811.front);
  if(cljs.core.truth_(temp__317__auto____7812)) {
    var f1__7813 = temp__317__auto____7812;
    return new cljs.core.PersistentQueueSeq(this__7811.meta, f1__7813, this__7811.rear, null)
  }else {
    if(this__7811.rear == null) {
      return cljs.core._empty.call(null, coll)
    }else {
      return new cljs.core.PersistentQueueSeq(this__7811.meta, this__7811.rear, null, null)
    }
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7814 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7815 = this;
  return new cljs.core.PersistentQueueSeq(meta, this__7815.front, this__7815.rear, this__7815.__hash)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7816 = this;
  return this__7816.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7817 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__7817.meta)
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
  var this__7818 = this;
  var h__2328__auto____7819 = this__7818.__hash;
  if(h__2328__auto____7819 != null) {
    return h__2328__auto____7819
  }else {
    var h__2328__auto____7820 = cljs.core.hash_coll.call(null, coll);
    this__7818.__hash = h__2328__auto____7820;
    return h__2328__auto____7820
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__7821 = this;
  if(cljs.core.truth_(this__7821.front)) {
    return new cljs.core.PersistentQueue(this__7821.meta, this__7821.count + 1, this__7821.front, cljs.core.conj.call(null, function() {
      var or__138__auto____7822 = this__7821.rear;
      if(cljs.core.truth_(or__138__auto____7822)) {
        return or__138__auto____7822
      }else {
        return cljs.core.PersistentVector.fromArray([])
      }
    }(), o), null)
  }else {
    return new cljs.core.PersistentQueue(this__7821.meta, this__7821.count + 1, cljs.core.conj.call(null, this__7821.front, o), cljs.core.PersistentVector.fromArray([]), null)
  }
};
cljs.core.PersistentQueue.prototype.toString = function() {
  var this__7823 = this;
  var this$__7824 = this;
  return cljs.core.pr_str.call(null, this$__7824)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7825 = this;
  var rear__7826 = cljs.core.seq.call(null, this__7825.rear);
  if(cljs.core.truth_(function() {
    var or__138__auto____7827 = this__7825.front;
    if(cljs.core.truth_(or__138__auto____7827)) {
      return or__138__auto____7827
    }else {
      return rear__7826
    }
  }())) {
    return new cljs.core.PersistentQueueSeq(null, this__7825.front, cljs.core.seq.call(null, rear__7826), null, null)
  }else {
    return cljs.core.List.EMPTY
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7828 = this;
  return this__7828.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var this__7829 = this;
  return cljs.core._first.call(null, this__7829.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var this__7830 = this;
  if(cljs.core.truth_(this__7830.front)) {
    var temp__317__auto____7831 = cljs.core.next.call(null, this__7830.front);
    if(cljs.core.truth_(temp__317__auto____7831)) {
      var f1__7832 = temp__317__auto____7831;
      return new cljs.core.PersistentQueue(this__7830.meta, this__7830.count - 1, f1__7832, this__7830.rear, null)
    }else {
      return new cljs.core.PersistentQueue(this__7830.meta, this__7830.count - 1, cljs.core.seq.call(null, this__7830.rear), cljs.core.PersistentVector.fromArray([]), null)
    }
  }else {
    return coll
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__7833 = this;
  return cljs.core.first.call(null, this__7833.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__7834 = this;
  return cljs.core.rest.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7835 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7836 = this;
  return new cljs.core.PersistentQueue(meta, this__7836.count, this__7836.front, this__7836.rear, this__7836.__hash)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7837 = this;
  return this__7837.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7838 = this;
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
  var this__7839 = this;
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
  var len__7840 = array.length;
  var i__7841 = 0;
  while(true) {
    if(i__7841 < len__7840) {
      if(cljs.core._EQ_.call(null, k, array[i__7841])) {
        return i__7841
      }else {
        var G__7842 = i__7841 + incr;
        i__7841 = G__7842;
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
      var and__132__auto____7843 = goog.isString.call(null, k);
      if(cljs.core.truth_(and__132__auto____7843)) {
        return strobj.hasOwnProperty(k)
      }else {
        return and__132__auto____7843
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
  var a__7844 = cljs.core.hash.call(null, a);
  var b__7845 = cljs.core.hash.call(null, b);
  if(a__7844 < b__7845) {
    return-1
  }else {
    if(a__7844 > b__7845) {
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
  var ks__7847 = m.keys;
  var len__7848 = ks__7847.length;
  var so__7849 = m.strobj;
  var out__7850 = cljs.core.with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, cljs.core.meta.call(null, m));
  var i__7851 = 0;
  var out__7852 = cljs.core.transient$.call(null, out__7850);
  while(true) {
    if(i__7851 < len__7848) {
      var k__7853 = ks__7847[i__7851];
      var G__7854 = i__7851 + 1;
      var G__7855 = cljs.core.assoc_BANG_.call(null, out__7852, k__7853, so__7849[k__7853]);
      i__7851 = G__7854;
      out__7852 = G__7855;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, out__7852, k, v))
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
  var this__7860 = this;
  return cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.hash_map.call(null), coll))
};
cljs.core.ObjMap.prototype.cljs$core$IHash$ = true;
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7861 = this;
  var h__2328__auto____7862 = this__7861.__hash;
  if(h__2328__auto____7862 != null) {
    return h__2328__auto____7862
  }else {
    var h__2328__auto____7863 = cljs.core.hash_imap.call(null, coll);
    this__7861.__hash = h__2328__auto____7863;
    return h__2328__auto____7863
  }
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$ = true;
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7864 = this;
  return cljs.core._lookup.call(null, coll, k, null)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7865 = this;
  return cljs.core.obj_map_contains_key_QMARK_.call(null, k, this__7865.strobj, this__7865.strobj[k], not_found)
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__7866 = this;
  if(cljs.core.truth_(goog.isString.call(null, k))) {
    var overwrite_QMARK___7867 = this__7866.strobj.hasOwnProperty(k);
    if(cljs.core.truth_(overwrite_QMARK___7867)) {
      var new_strobj__7868 = goog.object.clone.call(null, this__7866.strobj);
      new_strobj__7868[k] = v;
      return new cljs.core.ObjMap(this__7866.meta, this__7866.keys, new_strobj__7868, this__7866.update_count + 1, null)
    }else {
      if(this__7866.update_count < cljs.core.ObjMap.HASHMAP_THRESHOLD) {
        var new_strobj__7869 = goog.object.clone.call(null, this__7866.strobj);
        var new_keys__7870 = cljs.core.aclone.call(null, this__7866.keys);
        new_strobj__7869[k] = v;
        new_keys__7870.push(k);
        return new cljs.core.ObjMap(this__7866.meta, new_keys__7870, new_strobj__7869, this__7866.update_count + 1, null)
      }else {
        return cljs.core.obj_map__GT_hash_map.call(null, coll, k, v)
      }
    }
  }else {
    return cljs.core.obj_map__GT_hash_map.call(null, coll, k, v)
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__7871 = this;
  return cljs.core.obj_map_contains_key_QMARK_.call(null, k, this__7871.strobj)
};
cljs.core.ObjMap.prototype.cljs$core$IFn$ = true;
cljs.core.ObjMap.prototype.call = function() {
  var G__7891 = null;
  var G__7891__2 = function(tsym7858, k) {
    var this__7872 = this;
    var tsym7858__7873 = this;
    var coll__7874 = tsym7858__7873;
    return cljs.core._lookup.call(null, coll__7874, k)
  };
  var G__7891__3 = function(tsym7859, k, not_found) {
    var this__7875 = this;
    var tsym7859__7876 = this;
    var coll__7877 = tsym7859__7876;
    return cljs.core._lookup.call(null, coll__7877, k, not_found)
  };
  G__7891 = function(tsym7859, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7891__2.call(this, tsym7859, k);
      case 3:
        return G__7891__3.call(this, tsym7859, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7891
}();
cljs.core.ObjMap.prototype.apply = function(tsym7856, args7857) {
  return tsym7856.call.apply(tsym7856, [tsym7856].concat(cljs.core.aclone.call(null, args7857)))
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__7878 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.ObjMap.prototype.toString = function() {
  var this__7879 = this;
  var this$__7880 = this;
  return cljs.core.pr_str.call(null, this$__7880)
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7881 = this;
  if(this__7881.keys.length > 0) {
    return cljs.core.map.call(null, function(p1__7846_SHARP_) {
      return cljs.core.vector.call(null, p1__7846_SHARP_, this__7881.strobj[p1__7846_SHARP_])
    }, this__7881.keys.sort(cljs.core.obj_map_compare_keys))
  }else {
    return null
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7882 = this;
  return this__7882.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7883 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7884 = this;
  return new cljs.core.ObjMap(meta, this__7884.keys, this__7884.strobj, this__7884.update_count, this__7884.__hash)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7885 = this;
  return this__7885.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7886 = this;
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this__7886.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__7887 = this;
  if(cljs.core.truth_(function() {
    var and__132__auto____7888 = goog.isString.call(null, k);
    if(cljs.core.truth_(and__132__auto____7888)) {
      return this__7887.strobj.hasOwnProperty(k)
    }else {
      return and__132__auto____7888
    }
  }())) {
    var new_keys__7889 = cljs.core.aclone.call(null, this__7887.keys);
    var new_strobj__7890 = goog.object.clone.call(null, this__7887.strobj);
    new_keys__7889.splice(cljs.core.scan_array.call(null, 1, k, new_keys__7889), 1);
    cljs.core.js_delete.call(null, new_strobj__7890, k);
    return new cljs.core.ObjMap(this__7887.meta, new_keys__7889, new_strobj__7890, this__7887.update_count + 1, null)
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
  var this__7897 = this;
  var h__2328__auto____7898 = this__7897.__hash;
  if(h__2328__auto____7898 != null) {
    return h__2328__auto____7898
  }else {
    var h__2328__auto____7899 = cljs.core.hash_imap.call(null, coll);
    this__7897.__hash = h__2328__auto____7899;
    return h__2328__auto____7899
  }
};
cljs.core.HashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7900 = this;
  return cljs.core._lookup.call(null, coll, k, null)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7901 = this;
  var bucket__7902 = this__7901.hashobj[cljs.core.hash.call(null, k)];
  var i__7903 = cljs.core.truth_(bucket__7902) ? cljs.core.scan_array.call(null, 2, k, bucket__7902) : null;
  if(cljs.core.truth_(i__7903)) {
    return bucket__7902[i__7903 + 1]
  }else {
    return not_found
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__7904 = this;
  var h__7905 = cljs.core.hash.call(null, k);
  var bucket__7906 = this__7904.hashobj[h__7905];
  if(cljs.core.truth_(bucket__7906)) {
    var new_bucket__7907 = cljs.core.aclone.call(null, bucket__7906);
    var new_hashobj__7908 = goog.object.clone.call(null, this__7904.hashobj);
    new_hashobj__7908[h__7905] = new_bucket__7907;
    var temp__317__auto____7909 = cljs.core.scan_array.call(null, 2, k, new_bucket__7907);
    if(cljs.core.truth_(temp__317__auto____7909)) {
      var i__7910 = temp__317__auto____7909;
      new_bucket__7907[i__7910 + 1] = v;
      return new cljs.core.HashMap(this__7904.meta, this__7904.count, new_hashobj__7908, null)
    }else {
      new_bucket__7907.push(k, v);
      return new cljs.core.HashMap(this__7904.meta, this__7904.count + 1, new_hashobj__7908, null)
    }
  }else {
    var new_hashobj__7911 = goog.object.clone.call(null, this__7904.hashobj);
    new_hashobj__7911[h__7905] = [k, v];
    return new cljs.core.HashMap(this__7904.meta, this__7904.count + 1, new_hashobj__7911, null)
  }
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__7912 = this;
  var bucket__7913 = this__7912.hashobj[cljs.core.hash.call(null, k)];
  var i__7914 = cljs.core.truth_(bucket__7913) ? cljs.core.scan_array.call(null, 2, k, bucket__7913) : null;
  if(cljs.core.truth_(i__7914)) {
    return true
  }else {
    return false
  }
};
cljs.core.HashMap.prototype.cljs$core$IFn$ = true;
cljs.core.HashMap.prototype.call = function() {
  var G__7937 = null;
  var G__7937__2 = function(tsym7895, k) {
    var this__7915 = this;
    var tsym7895__7916 = this;
    var coll__7917 = tsym7895__7916;
    return cljs.core._lookup.call(null, coll__7917, k)
  };
  var G__7937__3 = function(tsym7896, k, not_found) {
    var this__7918 = this;
    var tsym7896__7919 = this;
    var coll__7920 = tsym7896__7919;
    return cljs.core._lookup.call(null, coll__7920, k, not_found)
  };
  G__7937 = function(tsym7896, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7937__2.call(this, tsym7896, k);
      case 3:
        return G__7937__3.call(this, tsym7896, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7937
}();
cljs.core.HashMap.prototype.apply = function(tsym7893, args7894) {
  return tsym7893.call.apply(tsym7893, [tsym7893].concat(cljs.core.aclone.call(null, args7894)))
};
cljs.core.HashMap.prototype.cljs$core$ICollection$ = true;
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__7921 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.HashMap.prototype.toString = function() {
  var this__7922 = this;
  var this$__7923 = this;
  return cljs.core.pr_str.call(null, this$__7923)
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7924 = this;
  if(this__7924.count > 0) {
    var hashes__7925 = cljs.core.js_keys.call(null, this__7924.hashobj).sort();
    return cljs.core.mapcat.call(null, function(p1__7892_SHARP_) {
      return cljs.core.map.call(null, cljs.core.vec, cljs.core.partition.call(null, 2, this__7924.hashobj[p1__7892_SHARP_]))
    }, hashes__7925)
  }else {
    return null
  }
};
cljs.core.HashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.HashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7926 = this;
  return this__7926.count
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7927 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7928 = this;
  return new cljs.core.HashMap(meta, this__7928.count, this__7928.hashobj, this__7928.__hash)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7929 = this;
  return this__7929.meta
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7930 = this;
  return cljs.core.with_meta.call(null, cljs.core.HashMap.EMPTY, this__7930.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMap$ = true;
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__7931 = this;
  var h__7932 = cljs.core.hash.call(null, k);
  var bucket__7933 = this__7931.hashobj[h__7932];
  var i__7934 = cljs.core.truth_(bucket__7933) ? cljs.core.scan_array.call(null, 2, k, bucket__7933) : null;
  if(cljs.core.not.call(null, i__7934)) {
    return coll
  }else {
    var new_hashobj__7935 = goog.object.clone.call(null, this__7931.hashobj);
    if(3 > bucket__7933.length) {
      cljs.core.js_delete.call(null, new_hashobj__7935, h__7932)
    }else {
      var new_bucket__7936 = cljs.core.aclone.call(null, bucket__7933);
      new_bucket__7936.splice(i__7934, 2);
      new_hashobj__7935[h__7932] = new_bucket__7936
    }
    return new cljs.core.HashMap(this__7931.meta, this__7931.count - 1, new_hashobj__7935, null)
  }
};
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, {}, 0);
cljs.core.HashMap.fromArrays = function(ks, vs) {
  var len__7938 = ks.length;
  var i__7939 = 0;
  var out__7940 = cljs.core.HashMap.EMPTY;
  while(true) {
    if(i__7939 < len__7938) {
      var G__7941 = i__7939 + 1;
      var G__7942 = cljs.core.assoc.call(null, out__7940, ks[i__7939], vs[i__7939]);
      i__7939 = G__7941;
      out__7940 = G__7942;
      continue
    }else {
      return out__7940
    }
    break
  }
};
cljs.core.array_map_index_of = function array_map_index_of(m, k) {
  var arr__7943 = m.arr;
  var len__7944 = arr__7943.length;
  var i__7945 = 0;
  while(true) {
    if(len__7944 <= i__7945) {
      return-1
    }else {
      if(cljs.core._EQ_.call(null, arr__7943[i__7945], k)) {
        return i__7945
      }else {
        if("\ufdd0'else") {
          var G__7946 = i__7945 + 2;
          i__7945 = G__7946;
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
  var this__7951 = this;
  return new cljs.core.TransientArrayMap({}, this__7951.arr.length, cljs.core.aclone.call(null, this__7951.arr))
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__7952 = this;
  var h__2328__auto____7953 = this__7952.__hash;
  if(h__2328__auto____7953 != null) {
    return h__2328__auto____7953
  }else {
    var h__2328__auto____7954 = cljs.core.hash_imap.call(null, coll);
    this__7952.__hash = h__2328__auto____7954;
    return h__2328__auto____7954
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__7955 = this;
  return cljs.core._lookup.call(null, coll, k, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__7956 = this;
  var idx__7957 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__7957 === -1) {
    return not_found
  }else {
    return this__7956.arr[idx__7957 + 1]
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__7958 = this;
  var idx__7959 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__7959 === -1) {
    if(this__7958.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
      return new cljs.core.PersistentArrayMap(this__7958.meta, this__7958.cnt + 1, function() {
        var G__7960__7961 = cljs.core.aclone.call(null, this__7958.arr);
        G__7960__7961.push(k);
        G__7960__7961.push(v);
        return G__7960__7961
      }(), null)
    }else {
      return cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, coll)), k, v))
    }
  }else {
    if(v === this__7958.arr[idx__7959 + 1]) {
      return coll
    }else {
      if("\ufdd0'else") {
        return new cljs.core.PersistentArrayMap(this__7958.meta, this__7958.cnt, function() {
          var G__7962__7963 = cljs.core.aclone.call(null, this__7958.arr);
          G__7962__7963[idx__7959 + 1] = v;
          return G__7962__7963
        }(), null)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__7964 = this;
  return cljs.core.array_map_index_of.call(null, coll, k) != -1
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentArrayMap.prototype.call = function() {
  var G__7994 = null;
  var G__7994__2 = function(tsym7949, k) {
    var this__7965 = this;
    var tsym7949__7966 = this;
    var coll__7967 = tsym7949__7966;
    return cljs.core._lookup.call(null, coll__7967, k)
  };
  var G__7994__3 = function(tsym7950, k, not_found) {
    var this__7968 = this;
    var tsym7950__7969 = this;
    var coll__7970 = tsym7950__7969;
    return cljs.core._lookup.call(null, coll__7970, k, not_found)
  };
  G__7994 = function(tsym7950, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__7994__2.call(this, tsym7950, k);
      case 3:
        return G__7994__3.call(this, tsym7950, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__7994
}();
cljs.core.PersistentArrayMap.prototype.apply = function(tsym7947, args7948) {
  return tsym7947.call.apply(tsym7947, [tsym7947].concat(cljs.core.aclone.call(null, args7948)))
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__7971 = this;
  var len__7972 = this__7971.arr.length;
  var i__7973 = 0;
  var init__7974 = init;
  while(true) {
    if(i__7973 < len__7972) {
      var init__7975 = f.call(null, init__7974, this__7971.arr[i__7973], this__7971.arr[i__7973 + 1]);
      if(cljs.core.reduced_QMARK_.call(null, init__7975)) {
        return cljs.core.deref.call(null, init__7975)
      }else {
        var G__7995 = i__7973 + 2;
        var G__7996 = init__7975;
        i__7973 = G__7995;
        init__7974 = G__7996;
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
  var this__7976 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentArrayMap.prototype.toString = function() {
  var this__7977 = this;
  var this$__7978 = this;
  return cljs.core.pr_str.call(null, this$__7978)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__7979 = this;
  if(this__7979.cnt > 0) {
    var len__7980 = this__7979.arr.length;
    var array_map_seq__7981 = function array_map_seq(i) {
      return new cljs.core.LazySeq(null, false, function() {
        if(i < len__7980) {
          return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([this__7979.arr[i], this__7979.arr[i + 1]]), array_map_seq.call(null, i + 2))
        }else {
          return null
        }
      })
    };
    return array_map_seq__7981.call(null, 0)
  }else {
    return null
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__7982 = this;
  return this__7982.cnt
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__7983 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__7984 = this;
  return new cljs.core.PersistentArrayMap(meta, this__7984.cnt, this__7984.arr, this__7984.__hash)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__7985 = this;
  return this__7985.meta
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__7986 = this;
  return cljs.core._with_meta.call(null, cljs.core.PersistentArrayMap.EMPTY, this__7986.meta)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__7987 = this;
  var idx__7988 = cljs.core.array_map_index_of.call(null, coll, k);
  if(idx__7988 >= 0) {
    var len__7989 = this__7987.arr.length;
    var new_len__7990 = len__7989 - 2;
    if(new_len__7990 === 0) {
      return cljs.core._empty.call(null, coll)
    }else {
      var new_arr__7991 = cljs.core.make_array.call(null, new_len__7990);
      var s__7992 = 0;
      var d__7993 = 0;
      while(true) {
        if(s__7992 >= len__7989) {
          return new cljs.core.PersistentArrayMap(this__7987.meta, this__7987.cnt - 1, new_arr__7991, null)
        }else {
          if(cljs.core._EQ_.call(null, k, this__7987.arr[s__7992])) {
            var G__7997 = s__7992 + 2;
            var G__7998 = d__7993;
            s__7992 = G__7997;
            d__7993 = G__7998;
            continue
          }else {
            if("\ufdd0'else") {
              new_arr__7991[d__7993] = this__7987.arr[s__7992];
              new_arr__7991[d__7993 + 1] = this__7987.arr[s__7992 + 1];
              var G__7999 = s__7992 + 2;
              var G__8000 = d__7993 + 2;
              s__7992 = G__7999;
              d__7993 = G__8000;
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
  var len__8001 = cljs.core.count.call(null, ks);
  var i__8002 = 0;
  var out__8003 = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);
  while(true) {
    if(i__8002 < len__8001) {
      var G__8004 = i__8002 + 1;
      var G__8005 = cljs.core.assoc_BANG_.call(null, out__8003, ks[i__8002], vs[i__8002]);
      i__8002 = G__8004;
      out__8003 = G__8005;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__8003)
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
  var this__8006 = this;
  if(cljs.core.truth_(this__8006.editable_QMARK_)) {
    var idx__8007 = cljs.core.array_map_index_of.call(null, tcoll, key);
    if(idx__8007 >= 0) {
      this__8006.arr[idx__8007] = this__8006.arr[this__8006.len - 2];
      this__8006.arr[idx__8007 + 1] = this__8006.arr[this__8006.len - 1];
      var G__8008__8009 = this__8006.arr;
      G__8008__8009.pop();
      G__8008__8009.pop();
      G__8008__8009;
      this__8006.len = this__8006.len - 2
    }else {
    }
    return tcoll
  }else {
    throw new Error("dissoc! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var this__8010 = this;
  if(cljs.core.truth_(this__8010.editable_QMARK_)) {
    var idx__8011 = cljs.core.array_map_index_of.call(null, tcoll, key);
    if(idx__8011 === -1) {
      if(this__8010.len + 2 <= 2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
        this__8010.len = this__8010.len + 2;
        this__8010.arr.push(key);
        this__8010.arr.push(val);
        return tcoll
      }else {
        return cljs.core.assoc_BANG_.call(null, cljs.core.array__GT_transient_hash_map.call(null, this__8010.len, this__8010.arr), key, val)
      }
    }else {
      if(val === this__8010.arr[idx__8011 + 1]) {
        return tcoll
      }else {
        this__8010.arr[idx__8011 + 1] = val;
        return tcoll
      }
    }
  }else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__8012 = this;
  if(cljs.core.truth_(this__8012.editable_QMARK_)) {
    if(function() {
      var G__8013__8014 = o;
      if(G__8013__8014 != null) {
        if(function() {
          var or__138__auto____8015 = G__8013__8014.cljs$lang$protocol_mask$partition0$ & 1024;
          if(or__138__auto____8015) {
            return or__138__auto____8015
          }else {
            return G__8013__8014.cljs$core$IMapEntry$
          }
        }()) {
          return true
        }else {
          if(!G__8013__8014.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__8013__8014)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__8013__8014)
      }
    }()) {
      return cljs.core._assoc_BANG_.call(null, tcoll, cljs.core.key.call(null, o), cljs.core.val.call(null, o))
    }else {
      var es__8016 = cljs.core.seq.call(null, o);
      var tcoll__8017 = tcoll;
      while(true) {
        var temp__317__auto____8018 = cljs.core.first.call(null, es__8016);
        if(cljs.core.truth_(temp__317__auto____8018)) {
          var e__8019 = temp__317__auto____8018;
          var G__8025 = cljs.core.next.call(null, es__8016);
          var G__8026 = cljs.core._assoc_BANG_.call(null, tcoll__8017, cljs.core.key.call(null, e__8019), cljs.core.val.call(null, e__8019));
          es__8016 = G__8025;
          tcoll__8017 = G__8026;
          continue
        }else {
          return tcoll__8017
        }
        break
      }
    }
  }else {
    throw new Error("conj! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__8020 = this;
  if(cljs.core.truth_(this__8020.editable_QMARK_)) {
    this__8020.editable_QMARK_ = false;
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, this__8020.len, 2), this__8020.arr, null)
  }else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, k) {
  var this__8021 = this;
  return cljs.core._lookup.call(null, tcoll, k, null)
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, k, not_found) {
  var this__8022 = this;
  if(cljs.core.truth_(this__8022.editable_QMARK_)) {
    var idx__8023 = cljs.core.array_map_index_of.call(null, tcoll, k);
    if(idx__8023 === -1) {
      return not_found
    }else {
      return this__8022.arr[idx__8023 + 1]
    }
  }else {
    throw new Error("lookup after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(tcoll) {
  var this__8024 = this;
  if(cljs.core.truth_(this__8024.editable_QMARK_)) {
    return cljs.core.quot.call(null, this__8024.len, 2)
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientArrayMap;
void 0;
cljs.core.array__GT_transient_hash_map = function array__GT_transient_hash_map(len, arr) {
  var out__8027 = cljs.core.transient$.call(null, cljs.core.ObjMap.fromObject([], {}));
  var i__8028 = 0;
  while(true) {
    if(i__8028 < len) {
      var G__8029 = cljs.core.assoc_BANG_.call(null, out__8027, arr[i__8028], arr[i__8028 + 1]);
      var G__8030 = i__8028 + 2;
      out__8027 = G__8029;
      i__8028 = G__8030;
      continue
    }else {
      return out__8027
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
    var G__8031__8032 = cljs.core.aclone.call(null, arr);
    G__8031__8032[i] = a;
    return G__8031__8032
  };
  var clone_and_set__5 = function(arr, i, a, j, b) {
    var G__8033__8034 = cljs.core.aclone.call(null, arr);
    G__8033__8034[i] = a;
    G__8033__8034[j] = b;
    return G__8033__8034
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
  var new_arr__8035 = cljs.core.make_array.call(null, arr.length - 2);
  cljs.core.array_copy.call(null, arr, 0, new_arr__8035, 0, 2 * i);
  cljs.core.array_copy.call(null, arr, 2 * (i + 1), new_arr__8035, 2 * i, new_arr__8035.length - 2 * i);
  return new_arr__8035
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
    var editable__8036 = inode.ensure_editable(edit);
    editable__8036.arr[i] = a;
    return editable__8036
  };
  var edit_and_set__6 = function(inode, edit, i, a, j, b) {
    var editable__8037 = inode.ensure_editable(edit);
    editable__8037.arr[i] = a;
    editable__8037.arr[j] = b;
    return editable__8037
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
  var len__8038 = arr.length;
  var i__8039 = 0;
  var init__8040 = init;
  while(true) {
    if(i__8039 < len__8038) {
      var init__8043 = function() {
        var k__8041 = arr[i__8039];
        if(k__8041 != null) {
          return f.call(null, init__8040, k__8041, arr[i__8039 + 1])
        }else {
          var node__8042 = arr[i__8039 + 1];
          if(node__8042 != null) {
            return node__8042.kv_reduce(f, init__8040)
          }else {
            return init__8040
          }
        }
      }();
      if(cljs.core.reduced_QMARK_.call(null, init__8043)) {
        return cljs.core.deref.call(null, init__8043)
      }else {
        var G__8044 = i__8039 + 2;
        var G__8045 = init__8043;
        i__8039 = G__8044;
        init__8040 = G__8045;
        continue
      }
    }else {
      return init__8040
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
  var this__8046 = this;
  var inode__8047 = this;
  if(this__8046.bitmap === bit) {
    return null
  }else {
    var editable__8048 = inode__8047.ensure_editable(e);
    var earr__8049 = editable__8048.arr;
    var len__8050 = earr__8049.length;
    editable__8048.bitmap = bit ^ editable__8048.bitmap;
    cljs.core.array_copy.call(null, earr__8049, 2 * (i + 1), earr__8049, 2 * i, len__8050 - 2 * (i + 1));
    earr__8049[len__8050 - 2] = null;
    earr__8049[len__8050 - 1] = null;
    return editable__8048
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__8051 = this;
  var inode__8052 = this;
  var bit__8053 = 1 << (hash >>> shift & 31);
  var idx__8054 = cljs.core.bitmap_indexed_node_index.call(null, this__8051.bitmap, bit__8053);
  if((this__8051.bitmap & bit__8053) === 0) {
    var n__8055 = cljs.core.bit_count.call(null, this__8051.bitmap);
    if(2 * n__8055 < this__8051.arr.length) {
      var editable__8056 = inode__8052.ensure_editable(edit);
      var earr__8057 = editable__8056.arr;
      added_leaf_QMARK_[0] = true;
      cljs.core.array_copy_downward.call(null, earr__8057, 2 * idx__8054, earr__8057, 2 * (idx__8054 + 1), 2 * (n__8055 - idx__8054));
      earr__8057[2 * idx__8054] = key;
      earr__8057[2 * idx__8054 + 1] = val;
      editable__8056.bitmap = editable__8056.bitmap | bit__8053;
      return editable__8056
    }else {
      if(n__8055 >= 16) {
        var nodes__8058 = cljs.core.make_array.call(null, 32);
        var jdx__8059 = hash >>> shift & 31;
        nodes__8058[jdx__8059] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
        var i__8060 = 0;
        var j__8061 = 0;
        while(true) {
          if(i__8060 < 32) {
            if((this__8051.bitmap >>> i__8060 & 1) === 0) {
              var G__8114 = i__8060 + 1;
              var G__8115 = j__8061;
              i__8060 = G__8114;
              j__8061 = G__8115;
              continue
            }else {
              nodes__8058[i__8060] = null != this__8051.arr[j__8061] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, cljs.core.hash.call(null, this__8051.arr[j__8061]), this__8051.arr[j__8061], this__8051.arr[j__8061 + 1], added_leaf_QMARK_) : this__8051.arr[j__8061 + 1];
              var G__8116 = i__8060 + 1;
              var G__8117 = j__8061 + 2;
              i__8060 = G__8116;
              j__8061 = G__8117;
              continue
            }
          }else {
          }
          break
        }
        return new cljs.core.ArrayNode(edit, n__8055 + 1, nodes__8058)
      }else {
        if("\ufdd0'else") {
          var new_arr__8062 = cljs.core.make_array.call(null, 2 * (n__8055 + 4));
          cljs.core.array_copy.call(null, this__8051.arr, 0, new_arr__8062, 0, 2 * idx__8054);
          new_arr__8062[2 * idx__8054] = key;
          added_leaf_QMARK_[0] = true;
          new_arr__8062[2 * idx__8054 + 1] = val;
          cljs.core.array_copy.call(null, this__8051.arr, 2 * idx__8054, new_arr__8062, 2 * (idx__8054 + 1), 2 * (n__8055 - idx__8054));
          var editable__8063 = inode__8052.ensure_editable(edit);
          editable__8063.arr = new_arr__8062;
          editable__8063.bitmap = editable__8063.bitmap | bit__8053;
          return editable__8063
        }else {
          return null
        }
      }
    }
  }else {
    var key_or_nil__8064 = this__8051.arr[2 * idx__8054];
    var val_or_node__8065 = this__8051.arr[2 * idx__8054 + 1];
    if(null == key_or_nil__8064) {
      var n__8066 = val_or_node__8065.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
      if(n__8066 === val_or_node__8065) {
        return inode__8052
      }else {
        return cljs.core.edit_and_set.call(null, inode__8052, edit, 2 * idx__8054 + 1, n__8066)
      }
    }else {
      if(cljs.core._EQ_.call(null, key, key_or_nil__8064)) {
        if(val === val_or_node__8065) {
          return inode__8052
        }else {
          return cljs.core.edit_and_set.call(null, inode__8052, edit, 2 * idx__8054 + 1, val)
        }
      }else {
        if("\ufdd0'else") {
          added_leaf_QMARK_[0] = true;
          return cljs.core.edit_and_set.call(null, inode__8052, edit, 2 * idx__8054, null, 2 * idx__8054 + 1, cljs.core.create_node.call(null, edit, shift + 5, key_or_nil__8064, val_or_node__8065, hash, key, val))
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  var this__8067 = this;
  var inode__8068 = this;
  return cljs.core.create_inode_seq.call(null, this__8067.arr)
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__8069 = this;
  var inode__8070 = this;
  var bit__8071 = 1 << (hash >>> shift & 31);
  if((this__8069.bitmap & bit__8071) === 0) {
    return inode__8070
  }else {
    var idx__8072 = cljs.core.bitmap_indexed_node_index.call(null, this__8069.bitmap, bit__8071);
    var key_or_nil__8073 = this__8069.arr[2 * idx__8072];
    var val_or_node__8074 = this__8069.arr[2 * idx__8072 + 1];
    if(null == key_or_nil__8073) {
      var n__8075 = val_or_node__8074.inode_without_BANG_(edit, shift + 5, hash, key, removed_leaf_QMARK_);
      if(n__8075 === val_or_node__8074) {
        return inode__8070
      }else {
        if(null != n__8075) {
          return cljs.core.edit_and_set.call(null, inode__8070, edit, 2 * idx__8072 + 1, n__8075)
        }else {
          if(this__8069.bitmap === bit__8071) {
            return null
          }else {
            if("\ufdd0'else") {
              return inode__8070.edit_and_remove_pair(edit, bit__8071, idx__8072)
            }else {
              return null
            }
          }
        }
      }
    }else {
      if(cljs.core._EQ_.call(null, key, key_or_nil__8073)) {
        removed_leaf_QMARK_[0] = true;
        return inode__8070.edit_and_remove_pair(edit, bit__8071, idx__8072)
      }else {
        if("\ufdd0'else") {
          return inode__8070
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(e) {
  var this__8076 = this;
  var inode__8077 = this;
  if(e === this__8076.edit) {
    return inode__8077
  }else {
    var n__8078 = cljs.core.bit_count.call(null, this__8076.bitmap);
    var new_arr__8079 = cljs.core.make_array.call(null, n__8078 < 0 ? 4 : 2 * (n__8078 + 1));
    cljs.core.array_copy.call(null, this__8076.arr, 0, new_arr__8079, 0, 2 * n__8078);
    return new cljs.core.BitmapIndexedNode(e, this__8076.bitmap, new_arr__8079)
  }
};
cljs.core.BitmapIndexedNode.prototype.kv_reduce = function(f, init) {
  var this__8080 = this;
  var inode__8081 = this;
  return cljs.core.inode_kv_reduce.call(null, this__8080.arr, f, init)
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function() {
  var G__8118 = null;
  var G__8118__3 = function(shift, hash, key) {
    var this__8082 = this;
    var inode__8083 = this;
    var bit__8084 = 1 << (hash >>> shift & 31);
    if((this__8082.bitmap & bit__8084) === 0) {
      return null
    }else {
      var idx__8085 = cljs.core.bitmap_indexed_node_index.call(null, this__8082.bitmap, bit__8084);
      var key_or_nil__8086 = this__8082.arr[2 * idx__8085];
      var val_or_node__8087 = this__8082.arr[2 * idx__8085 + 1];
      if(null == key_or_nil__8086) {
        return val_or_node__8087.inode_find(shift + 5, hash, key)
      }else {
        if(cljs.core._EQ_.call(null, key, key_or_nil__8086)) {
          return cljs.core.PersistentVector.fromArray([key_or_nil__8086, val_or_node__8087])
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
  var G__8118__4 = function(shift, hash, key, not_found) {
    var this__8088 = this;
    var inode__8089 = this;
    var bit__8090 = 1 << (hash >>> shift & 31);
    if((this__8088.bitmap & bit__8090) === 0) {
      return not_found
    }else {
      var idx__8091 = cljs.core.bitmap_indexed_node_index.call(null, this__8088.bitmap, bit__8090);
      var key_or_nil__8092 = this__8088.arr[2 * idx__8091];
      var val_or_node__8093 = this__8088.arr[2 * idx__8091 + 1];
      if(null == key_or_nil__8092) {
        return val_or_node__8093.inode_find(shift + 5, hash, key, not_found)
      }else {
        if(cljs.core._EQ_.call(null, key, key_or_nil__8092)) {
          return cljs.core.PersistentVector.fromArray([key_or_nil__8092, val_or_node__8093])
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
  G__8118 = function(shift, hash, key, not_found) {
    switch(arguments.length) {
      case 3:
        return G__8118__3.call(this, shift, hash, key);
      case 4:
        return G__8118__4.call(this, shift, hash, key, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8118
}();
cljs.core.BitmapIndexedNode.prototype.inode_without = function(shift, hash, key) {
  var this__8094 = this;
  var inode__8095 = this;
  var bit__8096 = 1 << (hash >>> shift & 31);
  if((this__8094.bitmap & bit__8096) === 0) {
    return inode__8095
  }else {
    var idx__8097 = cljs.core.bitmap_indexed_node_index.call(null, this__8094.bitmap, bit__8096);
    var key_or_nil__8098 = this__8094.arr[2 * idx__8097];
    var val_or_node__8099 = this__8094.arr[2 * idx__8097 + 1];
    if(null == key_or_nil__8098) {
      var n__8100 = val_or_node__8099.inode_without(shift + 5, hash, key);
      if(n__8100 === val_or_node__8099) {
        return inode__8095
      }else {
        if(null != n__8100) {
          return new cljs.core.BitmapIndexedNode(null, this__8094.bitmap, cljs.core.clone_and_set.call(null, this__8094.arr, 2 * idx__8097 + 1, n__8100))
        }else {
          if(this__8094.bitmap === bit__8096) {
            return null
          }else {
            if("\ufdd0'else") {
              return new cljs.core.BitmapIndexedNode(null, this__8094.bitmap ^ bit__8096, cljs.core.remove_pair.call(null, this__8094.arr, idx__8097))
            }else {
              return null
            }
          }
        }
      }
    }else {
      if(cljs.core._EQ_.call(null, key, key_or_nil__8098)) {
        return new cljs.core.BitmapIndexedNode(null, this__8094.bitmap ^ bit__8096, cljs.core.remove_pair.call(null, this__8094.arr, idx__8097))
      }else {
        if("\ufdd0'else") {
          return inode__8095
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var this__8101 = this;
  var inode__8102 = this;
  var bit__8103 = 1 << (hash >>> shift & 31);
  var idx__8104 = cljs.core.bitmap_indexed_node_index.call(null, this__8101.bitmap, bit__8103);
  if((this__8101.bitmap & bit__8103) === 0) {
    var n__8105 = cljs.core.bit_count.call(null, this__8101.bitmap);
    if(n__8105 >= 16) {
      var nodes__8106 = cljs.core.make_array.call(null, 32);
      var jdx__8107 = hash >>> shift & 31;
      nodes__8106[jdx__8107] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
      var i__8108 = 0;
      var j__8109 = 0;
      while(true) {
        if(i__8108 < 32) {
          if((this__8101.bitmap >>> i__8108 & 1) === 0) {
            var G__8119 = i__8108 + 1;
            var G__8120 = j__8109;
            i__8108 = G__8119;
            j__8109 = G__8120;
            continue
          }else {
            nodes__8106[i__8108] = null != this__8101.arr[j__8109] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, cljs.core.hash.call(null, this__8101.arr[j__8109]), this__8101.arr[j__8109], this__8101.arr[j__8109 + 1], added_leaf_QMARK_) : this__8101.arr[j__8109 + 1];
            var G__8121 = i__8108 + 1;
            var G__8122 = j__8109 + 2;
            i__8108 = G__8121;
            j__8109 = G__8122;
            continue
          }
        }else {
        }
        break
      }
      return new cljs.core.ArrayNode(null, n__8105 + 1, nodes__8106)
    }else {
      var new_arr__8110 = cljs.core.make_array.call(null, 2 * (n__8105 + 1));
      cljs.core.array_copy.call(null, this__8101.arr, 0, new_arr__8110, 0, 2 * idx__8104);
      new_arr__8110[2 * idx__8104] = key;
      added_leaf_QMARK_[0] = true;
      new_arr__8110[2 * idx__8104 + 1] = val;
      cljs.core.array_copy.call(null, this__8101.arr, 2 * idx__8104, new_arr__8110, 2 * (idx__8104 + 1), 2 * (n__8105 - idx__8104));
      return new cljs.core.BitmapIndexedNode(null, this__8101.bitmap | bit__8103, new_arr__8110)
    }
  }else {
    var key_or_nil__8111 = this__8101.arr[2 * idx__8104];
    var val_or_node__8112 = this__8101.arr[2 * idx__8104 + 1];
    if(null == key_or_nil__8111) {
      var n__8113 = val_or_node__8112.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
      if(n__8113 === val_or_node__8112) {
        return inode__8102
      }else {
        return new cljs.core.BitmapIndexedNode(null, this__8101.bitmap, cljs.core.clone_and_set.call(null, this__8101.arr, 2 * idx__8104 + 1, n__8113))
      }
    }else {
      if(cljs.core._EQ_.call(null, key, key_or_nil__8111)) {
        if(val === val_or_node__8112) {
          return inode__8102
        }else {
          return new cljs.core.BitmapIndexedNode(null, this__8101.bitmap, cljs.core.clone_and_set.call(null, this__8101.arr, 2 * idx__8104 + 1, val))
        }
      }else {
        if("\ufdd0'else") {
          added_leaf_QMARK_[0] = true;
          return new cljs.core.BitmapIndexedNode(null, this__8101.bitmap, cljs.core.clone_and_set.call(null, this__8101.arr, 2 * idx__8104, null, 2 * idx__8104 + 1, cljs.core.create_node.call(null, shift + 5, key_or_nil__8111, val_or_node__8112, hash, key, val)))
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
  var arr__8123 = array_node.arr;
  var len__8124 = 2 * (array_node.cnt - 1);
  var new_arr__8125 = cljs.core.make_array.call(null, len__8124);
  var i__8126 = 0;
  var j__8127 = 1;
  var bitmap__8128 = 0;
  while(true) {
    if(i__8126 < len__8124) {
      if(function() {
        var and__132__auto____8129 = i__8126 != idx;
        if(and__132__auto____8129) {
          return null != arr__8123[i__8126]
        }else {
          return and__132__auto____8129
        }
      }()) {
        new_arr__8125[j__8127] = arr__8123[i__8126];
        var G__8130 = i__8126 + 1;
        var G__8131 = j__8127 + 2;
        var G__8132 = bitmap__8128 | 1 << i__8126;
        i__8126 = G__8130;
        j__8127 = G__8131;
        bitmap__8128 = G__8132;
        continue
      }else {
        var G__8133 = i__8126 + 1;
        var G__8134 = j__8127;
        var G__8135 = bitmap__8128;
        i__8126 = G__8133;
        j__8127 = G__8134;
        bitmap__8128 = G__8135;
        continue
      }
    }else {
      return new cljs.core.BitmapIndexedNode(edit, bitmap__8128, new_arr__8125)
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
  var this__8136 = this;
  var inode__8137 = this;
  var idx__8138 = hash >>> shift & 31;
  var node__8139 = this__8136.arr[idx__8138];
  if(null == node__8139) {
    return new cljs.core.ArrayNode(null, this__8136.cnt + 1, cljs.core.clone_and_set.call(null, this__8136.arr, idx__8138, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_)))
  }else {
    var n__8140 = node__8139.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
    if(n__8140 === node__8139) {
      return inode__8137
    }else {
      return new cljs.core.ArrayNode(null, this__8136.cnt, cljs.core.clone_and_set.call(null, this__8136.arr, idx__8138, n__8140))
    }
  }
};
cljs.core.ArrayNode.prototype.inode_without = function(shift, hash, key) {
  var this__8141 = this;
  var inode__8142 = this;
  var idx__8143 = hash >>> shift & 31;
  var node__8144 = this__8141.arr[idx__8143];
  if(null != node__8144) {
    var n__8145 = node__8144.inode_without(shift + 5, hash, key);
    if(n__8145 === node__8144) {
      return inode__8142
    }else {
      if(n__8145 == null) {
        if(this__8141.cnt <= 8) {
          return cljs.core.pack_array_node.call(null, inode__8142, null, idx__8143)
        }else {
          return new cljs.core.ArrayNode(null, this__8141.cnt - 1, cljs.core.clone_and_set.call(null, this__8141.arr, idx__8143, n__8145))
        }
      }else {
        if("\ufdd0'else") {
          return new cljs.core.ArrayNode(null, this__8141.cnt, cljs.core.clone_and_set.call(null, this__8141.arr, idx__8143, n__8145))
        }else {
          return null
        }
      }
    }
  }else {
    return inode__8142
  }
};
cljs.core.ArrayNode.prototype.inode_find = function() {
  var G__8177 = null;
  var G__8177__3 = function(shift, hash, key) {
    var this__8146 = this;
    var inode__8147 = this;
    var idx__8148 = hash >>> shift & 31;
    var node__8149 = this__8146.arr[idx__8148];
    if(null != node__8149) {
      return node__8149.inode_find(shift + 5, hash, key)
    }else {
      return null
    }
  };
  var G__8177__4 = function(shift, hash, key, not_found) {
    var this__8150 = this;
    var inode__8151 = this;
    var idx__8152 = hash >>> shift & 31;
    var node__8153 = this__8150.arr[idx__8152];
    if(null != node__8153) {
      return node__8153.inode_find(shift + 5, hash, key, not_found)
    }else {
      return not_found
    }
  };
  G__8177 = function(shift, hash, key, not_found) {
    switch(arguments.length) {
      case 3:
        return G__8177__3.call(this, shift, hash, key);
      case 4:
        return G__8177__4.call(this, shift, hash, key, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8177
}();
cljs.core.ArrayNode.prototype.inode_seq = function() {
  var this__8154 = this;
  var inode__8155 = this;
  return cljs.core.create_array_node_seq.call(null, this__8154.arr)
};
cljs.core.ArrayNode.prototype.ensure_editable = function(e) {
  var this__8156 = this;
  var inode__8157 = this;
  if(e === this__8156.edit) {
    return inode__8157
  }else {
    return new cljs.core.ArrayNode(e, this__8156.cnt, cljs.core.aclone.call(null, this__8156.arr))
  }
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__8158 = this;
  var inode__8159 = this;
  var idx__8160 = hash >>> shift & 31;
  var node__8161 = this__8158.arr[idx__8160];
  if(null == node__8161) {
    var editable__8162 = cljs.core.edit_and_set.call(null, inode__8159, edit, idx__8160, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_));
    editable__8162.cnt = editable__8162.cnt + 1;
    return editable__8162
  }else {
    var n__8163 = node__8161.inode_assoc_BANG_(edit, shift + 5, hash, key, val, added_leaf_QMARK_);
    if(n__8163 === node__8161) {
      return inode__8159
    }else {
      return cljs.core.edit_and_set.call(null, inode__8159, edit, idx__8160, n__8163)
    }
  }
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__8164 = this;
  var inode__8165 = this;
  var idx__8166 = hash >>> shift & 31;
  var node__8167 = this__8164.arr[idx__8166];
  if(null == node__8167) {
    return inode__8165
  }else {
    var n__8168 = node__8167.inode_without_BANG_(edit, shift + 5, hash, key, removed_leaf_QMARK_);
    if(n__8168 === node__8167) {
      return inode__8165
    }else {
      if(null == n__8168) {
        if(this__8164.cnt <= 8) {
          return cljs.core.pack_array_node.call(null, inode__8165, edit, idx__8166)
        }else {
          var editable__8169 = cljs.core.edit_and_set.call(null, inode__8165, edit, idx__8166, n__8168);
          editable__8169.cnt = editable__8169.cnt - 1;
          return editable__8169
        }
      }else {
        if("\ufdd0'else") {
          return cljs.core.edit_and_set.call(null, inode__8165, edit, idx__8166, n__8168)
        }else {
          return null
        }
      }
    }
  }
};
cljs.core.ArrayNode.prototype.kv_reduce = function(f, init) {
  var this__8170 = this;
  var inode__8171 = this;
  var len__8172 = this__8170.arr.length;
  var i__8173 = 0;
  var init__8174 = init;
  while(true) {
    if(i__8173 < len__8172) {
      var node__8175 = this__8170.arr[i__8173];
      if(node__8175 != null) {
        var init__8176 = node__8175.kv_reduce(f, init__8174);
        if(cljs.core.reduced_QMARK_.call(null, init__8176)) {
          return cljs.core.deref.call(null, init__8176)
        }else {
          var G__8178 = i__8173 + 1;
          var G__8179 = init__8176;
          i__8173 = G__8178;
          init__8174 = G__8179;
          continue
        }
      }else {
        return null
      }
    }else {
      return init__8174
    }
    break
  }
};
cljs.core.ArrayNode;
cljs.core.hash_collision_node_find_index = function hash_collision_node_find_index(arr, cnt, key) {
  var lim__8180 = 2 * cnt;
  var i__8181 = 0;
  while(true) {
    if(i__8181 < lim__8180) {
      if(cljs.core._EQ_.call(null, key, arr[i__8181])) {
        return i__8181
      }else {
        var G__8182 = i__8181 + 2;
        i__8181 = G__8182;
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
  var this__8183 = this;
  var inode__8184 = this;
  if(hash === this__8183.collision_hash) {
    var idx__8185 = cljs.core.hash_collision_node_find_index.call(null, this__8183.arr, this__8183.cnt, key);
    if(idx__8185 === -1) {
      var len__8186 = this__8183.arr.length;
      var new_arr__8187 = cljs.core.make_array.call(null, len__8186 + 2);
      cljs.core.array_copy.call(null, this__8183.arr, 0, new_arr__8187, 0, len__8186);
      new_arr__8187[len__8186] = key;
      new_arr__8187[len__8186 + 1] = val;
      added_leaf_QMARK_[0] = true;
      return new cljs.core.HashCollisionNode(null, this__8183.collision_hash, this__8183.cnt + 1, new_arr__8187)
    }else {
      if(cljs.core._EQ_.call(null, this__8183.arr[idx__8185], val)) {
        return inode__8184
      }else {
        return new cljs.core.HashCollisionNode(null, this__8183.collision_hash, this__8183.cnt, cljs.core.clone_and_set.call(null, this__8183.arr, idx__8185 + 1, val))
      }
    }
  }else {
    return(new cljs.core.BitmapIndexedNode(null, 1 << (this__8183.collision_hash >>> shift & 31), [null, inode__8184])).inode_assoc(shift, hash, key, val, added_leaf_QMARK_)
  }
};
cljs.core.HashCollisionNode.prototype.inode_without = function(shift, hash, key) {
  var this__8188 = this;
  var inode__8189 = this;
  var idx__8190 = cljs.core.hash_collision_node_find_index.call(null, this__8188.arr, this__8188.cnt, key);
  if(idx__8190 === -1) {
    return inode__8189
  }else {
    if(this__8188.cnt === 1) {
      return null
    }else {
      if("\ufdd0'else") {
        return new cljs.core.HashCollisionNode(null, this__8188.collision_hash, this__8188.cnt - 1, cljs.core.remove_pair.call(null, this__8188.arr, cljs.core.quot.call(null, idx__8190, 2)))
      }else {
        return null
      }
    }
  }
};
cljs.core.HashCollisionNode.prototype.inode_find = function() {
  var G__8217 = null;
  var G__8217__3 = function(shift, hash, key) {
    var this__8191 = this;
    var inode__8192 = this;
    var idx__8193 = cljs.core.hash_collision_node_find_index.call(null, this__8191.arr, this__8191.cnt, key);
    if(idx__8193 < 0) {
      return null
    }else {
      if(cljs.core._EQ_.call(null, key, this__8191.arr[idx__8193])) {
        return cljs.core.PersistentVector.fromArray([this__8191.arr[idx__8193], this__8191.arr[idx__8193 + 1]])
      }else {
        if("\ufdd0'else") {
          return null
        }else {
          return null
        }
      }
    }
  };
  var G__8217__4 = function(shift, hash, key, not_found) {
    var this__8194 = this;
    var inode__8195 = this;
    var idx__8196 = cljs.core.hash_collision_node_find_index.call(null, this__8194.arr, this__8194.cnt, key);
    if(idx__8196 < 0) {
      return not_found
    }else {
      if(cljs.core._EQ_.call(null, key, this__8194.arr[idx__8196])) {
        return cljs.core.PersistentVector.fromArray([this__8194.arr[idx__8196], this__8194.arr[idx__8196 + 1]])
      }else {
        if("\ufdd0'else") {
          return not_found
        }else {
          return null
        }
      }
    }
  };
  G__8217 = function(shift, hash, key, not_found) {
    switch(arguments.length) {
      case 3:
        return G__8217__3.call(this, shift, hash, key);
      case 4:
        return G__8217__4.call(this, shift, hash, key, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8217
}();
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  var this__8197 = this;
  var inode__8198 = this;
  return cljs.core.create_inode_seq.call(null, this__8197.arr)
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function() {
  var G__8218 = null;
  var G__8218__1 = function(e) {
    var this__8199 = this;
    var inode__8200 = this;
    if(e === this__8199.edit) {
      return inode__8200
    }else {
      var new_arr__8201 = cljs.core.make_array.call(null, 2 * (this__8199.cnt + 1));
      cljs.core.array_copy.call(null, this__8199.arr, 0, new_arr__8201, 0, 2 * this__8199.cnt);
      return new cljs.core.HashCollisionNode(e, this__8199.collision_hash, this__8199.cnt, new_arr__8201)
    }
  };
  var G__8218__3 = function(e, count, array) {
    var this__8202 = this;
    var inode__8203 = this;
    if(e === this__8202.edit) {
      this__8202.arr = array;
      this__8202.cnt = count;
      return inode__8203
    }else {
      return new cljs.core.HashCollisionNode(this__8202.edit, this__8202.collision_hash, count, array)
    }
  };
  G__8218 = function(e, count, array) {
    switch(arguments.length) {
      case 1:
        return G__8218__1.call(this, e);
      case 3:
        return G__8218__3.call(this, e, count, array)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8218
}();
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(edit, shift, hash, key, val, added_leaf_QMARK_) {
  var this__8204 = this;
  var inode__8205 = this;
  if(hash === this__8204.collision_hash) {
    var idx__8206 = cljs.core.hash_collision_node_find_index.call(null, this__8204.arr, this__8204.cnt, key);
    if(idx__8206 === -1) {
      if(this__8204.arr.length > 2 * this__8204.cnt) {
        var editable__8207 = cljs.core.edit_and_set.call(null, inode__8205, edit, 2 * this__8204.cnt, key, 2 * this__8204.cnt + 1, val);
        added_leaf_QMARK_[0] = true;
        editable__8207.cnt = editable__8207.cnt + 1;
        return editable__8207
      }else {
        var len__8208 = this__8204.arr.length;
        var new_arr__8209 = cljs.core.make_array.call(null, len__8208 + 2);
        cljs.core.array_copy.call(null, this__8204.arr, 0, new_arr__8209, 0, len__8208);
        new_arr__8209[len__8208] = key;
        new_arr__8209[len__8208 + 1] = val;
        added_leaf_QMARK_[0] = true;
        return inode__8205.ensure_editable(edit, this__8204.cnt + 1, new_arr__8209)
      }
    }else {
      if(this__8204.arr[idx__8206 + 1] === val) {
        return inode__8205
      }else {
        return cljs.core.edit_and_set.call(null, inode__8205, edit, idx__8206 + 1, val)
      }
    }
  }else {
    return(new cljs.core.BitmapIndexedNode(edit, 1 << (this__8204.collision_hash >>> shift & 31), [null, inode__8205, null, null])).inode_assoc_BANG_(edit, shift, hash, key, val, added_leaf_QMARK_)
  }
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(edit, shift, hash, key, removed_leaf_QMARK_) {
  var this__8210 = this;
  var inode__8211 = this;
  var idx__8212 = cljs.core.hash_collision_node_find_index.call(null, this__8210.arr, this__8210.cnt, key);
  if(idx__8212 === -1) {
    return inode__8211
  }else {
    removed_leaf_QMARK_[0] = true;
    if(this__8210.cnt === 1) {
      return null
    }else {
      var editable__8213 = inode__8211.ensure_editable(edit);
      var earr__8214 = editable__8213.arr;
      earr__8214[idx__8212] = earr__8214[2 * this__8210.cnt - 2];
      earr__8214[idx__8212 + 1] = earr__8214[2 * this__8210.cnt - 1];
      earr__8214[2 * this__8210.cnt - 1] = null;
      earr__8214[2 * this__8210.cnt - 2] = null;
      editable__8213.cnt = editable__8213.cnt - 1;
      return editable__8213
    }
  }
};
cljs.core.HashCollisionNode.prototype.kv_reduce = function(f, init) {
  var this__8215 = this;
  var inode__8216 = this;
  return cljs.core.inode_kv_reduce.call(null, this__8215.arr, f, init)
};
cljs.core.HashCollisionNode;
cljs.core.create_node = function() {
  var create_node = null;
  var create_node__6 = function(shift, key1, val1, key2hash, key2, val2) {
    var key1hash__8219 = cljs.core.hash.call(null, key1);
    if(key1hash__8219 === key2hash) {
      return new cljs.core.HashCollisionNode(null, key1hash__8219, 2, [key1, val1, key2, val2])
    }else {
      var added_leaf_QMARK___8220 = [false];
      return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift, key1hash__8219, key1, val1, added_leaf_QMARK___8220).inode_assoc(shift, key2hash, key2, val2, added_leaf_QMARK___8220)
    }
  };
  var create_node__7 = function(edit, shift, key1, val1, key2hash, key2, val2) {
    var key1hash__8221 = cljs.core.hash.call(null, key1);
    if(key1hash__8221 === key2hash) {
      return new cljs.core.HashCollisionNode(null, key1hash__8221, 2, [key1, val1, key2, val2])
    }else {
      var added_leaf_QMARK___8222 = [false];
      return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift, key1hash__8221, key1, val1, added_leaf_QMARK___8222).inode_assoc_BANG_(edit, shift, key2hash, key2, val2, added_leaf_QMARK___8222)
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
  var this__8223 = this;
  var h__2328__auto____8224 = this__8223.__hash;
  if(h__2328__auto____8224 != null) {
    return h__2328__auto____8224
  }else {
    var h__2328__auto____8225 = cljs.core.hash_coll.call(null, coll);
    this__8223.__hash = h__2328__auto____8225;
    return h__2328__auto____8225
  }
};
cljs.core.NodeSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__8226 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.NodeSeq.prototype.toString = function() {
  var this__8227 = this;
  var this$__8228 = this;
  return cljs.core.pr_str.call(null, this$__8228)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__8229 = this;
  return this$
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__8230 = this;
  if(this__8230.s == null) {
    return cljs.core.PersistentVector.fromArray([this__8230.nodes[this__8230.i], this__8230.nodes[this__8230.i + 1]])
  }else {
    return cljs.core.first.call(null, this__8230.s)
  }
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__8231 = this;
  if(this__8231.s == null) {
    return cljs.core.create_inode_seq.call(null, this__8231.nodes, this__8231.i + 2, null)
  }else {
    return cljs.core.create_inode_seq.call(null, this__8231.nodes, this__8231.i, cljs.core.next.call(null, this__8231.s))
  }
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8232 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8233 = this;
  return new cljs.core.NodeSeq(meta, this__8233.nodes, this__8233.i, this__8233.s, this__8233.__hash)
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8234 = this;
  return this__8234.meta
};
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8235 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__8235.meta)
};
cljs.core.NodeSeq;
cljs.core.create_inode_seq = function() {
  var create_inode_seq = null;
  var create_inode_seq__1 = function(nodes) {
    return create_inode_seq.call(null, nodes, 0, null)
  };
  var create_inode_seq__3 = function(nodes, i, s) {
    if(s == null) {
      var len__8236 = nodes.length;
      var j__8237 = i;
      while(true) {
        if(j__8237 < len__8236) {
          if(null != nodes[j__8237]) {
            return new cljs.core.NodeSeq(null, nodes, j__8237, null, null)
          }else {
            var temp__317__auto____8238 = nodes[j__8237 + 1];
            if(cljs.core.truth_(temp__317__auto____8238)) {
              var node__8239 = temp__317__auto____8238;
              var temp__317__auto____8240 = node__8239.inode_seq();
              if(cljs.core.truth_(temp__317__auto____8240)) {
                var node_seq__8241 = temp__317__auto____8240;
                return new cljs.core.NodeSeq(null, nodes, j__8237 + 2, node_seq__8241, null)
              }else {
                var G__8242 = j__8237 + 2;
                j__8237 = G__8242;
                continue
              }
            }else {
              var G__8243 = j__8237 + 2;
              j__8237 = G__8243;
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
  var this__8244 = this;
  var h__2328__auto____8245 = this__8244.__hash;
  if(h__2328__auto____8245 != null) {
    return h__2328__auto____8245
  }else {
    var h__2328__auto____8246 = cljs.core.hash_coll.call(null, coll);
    this__8244.__hash = h__2328__auto____8246;
    return h__2328__auto____8246
  }
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__8247 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.ArrayNodeSeq.prototype.toString = function() {
  var this__8248 = this;
  var this$__8249 = this;
  return cljs.core.pr_str.call(null, this$__8249)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__8250 = this;
  return this$
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var this__8251 = this;
  return cljs.core.first.call(null, this__8251.s)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var this__8252 = this;
  return cljs.core.create_array_node_seq.call(null, null, this__8252.nodes, this__8252.i, cljs.core.next.call(null, this__8252.s))
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8253 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8254 = this;
  return new cljs.core.ArrayNodeSeq(meta, this__8254.nodes, this__8254.i, this__8254.s, this__8254.__hash)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8255 = this;
  return this__8255.meta
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8256 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__8256.meta)
};
cljs.core.ArrayNodeSeq;
cljs.core.create_array_node_seq = function() {
  var create_array_node_seq = null;
  var create_array_node_seq__1 = function(nodes) {
    return create_array_node_seq.call(null, null, nodes, 0, null)
  };
  var create_array_node_seq__4 = function(meta, nodes, i, s) {
    if(s == null) {
      var len__8257 = nodes.length;
      var j__8258 = i;
      while(true) {
        if(j__8258 < len__8257) {
          var temp__317__auto____8259 = nodes[j__8258];
          if(cljs.core.truth_(temp__317__auto____8259)) {
            var nj__8260 = temp__317__auto____8259;
            var temp__317__auto____8261 = nj__8260.inode_seq();
            if(cljs.core.truth_(temp__317__auto____8261)) {
              var ns__8262 = temp__317__auto____8261;
              return new cljs.core.ArrayNodeSeq(meta, nodes, j__8258 + 1, ns__8262, null)
            }else {
              var G__8263 = j__8258 + 1;
              j__8258 = G__8263;
              continue
            }
          }else {
            var G__8264 = j__8258 + 1;
            j__8258 = G__8264;
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
  var this__8269 = this;
  return new cljs.core.TransientHashMap({}, this__8269.root, this__8269.cnt, this__8269.has_nil_QMARK_, this__8269.nil_val)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__8270 = this;
  var h__2328__auto____8271 = this__8270.__hash;
  if(h__2328__auto____8271 != null) {
    return h__2328__auto____8271
  }else {
    var h__2328__auto____8272 = cljs.core.hash_imap.call(null, coll);
    this__8270.__hash = h__2328__auto____8272;
    return h__2328__auto____8272
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__8273 = this;
  return cljs.core._lookup.call(null, coll, k, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__8274 = this;
  if(k == null) {
    if(cljs.core.truth_(this__8274.has_nil_QMARK_)) {
      return this__8274.nil_val
    }else {
      return not_found
    }
  }else {
    if(this__8274.root == null) {
      return not_found
    }else {
      if("\ufdd0'else") {
        return cljs.core.nth.call(null, this__8274.root.inode_find(0, cljs.core.hash.call(null, k), k, [null, not_found]), 1)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__8275 = this;
  if(k == null) {
    if(cljs.core.truth_(function() {
      var and__132__auto____8276 = this__8275.has_nil_QMARK_;
      if(cljs.core.truth_(and__132__auto____8276)) {
        return v === this__8275.nil_val
      }else {
        return and__132__auto____8276
      }
    }())) {
      return coll
    }else {
      return new cljs.core.PersistentHashMap(this__8275.meta, cljs.core.truth_(this__8275.has_nil_QMARK_) ? this__8275.cnt : this__8275.cnt + 1, this__8275.root, true, v, null)
    }
  }else {
    var added_leaf_QMARK___8277 = [false];
    var new_root__8278 = (this__8275.root == null ? cljs.core.BitmapIndexedNode.EMPTY : this__8275.root).inode_assoc(0, cljs.core.hash.call(null, k), k, v, added_leaf_QMARK___8277);
    if(new_root__8278 === this__8275.root) {
      return coll
    }else {
      return new cljs.core.PersistentHashMap(this__8275.meta, cljs.core.truth_(added_leaf_QMARK___8277[0]) ? this__8275.cnt + 1 : this__8275.cnt, new_root__8278, this__8275.has_nil_QMARK_, this__8275.nil_val, null)
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__8279 = this;
  if(k == null) {
    return this__8279.has_nil_QMARK_
  }else {
    if(this__8279.root == null) {
      return false
    }else {
      if("\ufdd0'else") {
        return cljs.core.not.call(null, this__8279.root.inode_find(0, cljs.core.hash.call(null, k), k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel)
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentHashMap.prototype.call = function() {
  var G__8300 = null;
  var G__8300__2 = function(tsym8267, k) {
    var this__8280 = this;
    var tsym8267__8281 = this;
    var coll__8282 = tsym8267__8281;
    return cljs.core._lookup.call(null, coll__8282, k)
  };
  var G__8300__3 = function(tsym8268, k, not_found) {
    var this__8283 = this;
    var tsym8268__8284 = this;
    var coll__8285 = tsym8268__8284;
    return cljs.core._lookup.call(null, coll__8285, k, not_found)
  };
  G__8300 = function(tsym8268, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8300__2.call(this, tsym8268, k);
      case 3:
        return G__8300__3.call(this, tsym8268, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8300
}();
cljs.core.PersistentHashMap.prototype.apply = function(tsym8265, args8266) {
  return tsym8265.call.apply(tsym8265, [tsym8265].concat(cljs.core.aclone.call(null, args8266)))
};
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__8286 = this;
  var init__8287 = cljs.core.truth_(this__8286.has_nil_QMARK_) ? f.call(null, init, null, this__8286.nil_val) : init;
  if(cljs.core.reduced_QMARK_.call(null, init__8287)) {
    return cljs.core.deref.call(null, init__8287)
  }else {
    if(null != this__8286.root) {
      return this__8286.root.kv_reduce(f, init__8287)
    }else {
      if("\ufdd0'else") {
        return init__8287
      }else {
        return null
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__8288 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  var this__8289 = this;
  var this$__8290 = this;
  return cljs.core.pr_str.call(null, this$__8290)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__8291 = this;
  if(this__8291.cnt > 0) {
    var s__8292 = null != this__8291.root ? this__8291.root.inode_seq() : null;
    if(cljs.core.truth_(this__8291.has_nil_QMARK_)) {
      return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([null, this__8291.nil_val]), s__8292)
    }else {
      return s__8292
    }
  }else {
    return null
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8293 = this;
  return this__8293.cnt
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8294 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8295 = this;
  return new cljs.core.PersistentHashMap(meta, this__8295.cnt, this__8295.root, this__8295.has_nil_QMARK_, this__8295.nil_val, this__8295.__hash)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8296 = this;
  return this__8296.meta
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8297 = this;
  return cljs.core._with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, this__8297.meta)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__8298 = this;
  if(k == null) {
    if(cljs.core.truth_(this__8298.has_nil_QMARK_)) {
      return new cljs.core.PersistentHashMap(this__8298.meta, this__8298.cnt - 1, this__8298.root, false, null, null)
    }else {
      return coll
    }
  }else {
    if(this__8298.root == null) {
      return coll
    }else {
      if("\ufdd0'else") {
        var new_root__8299 = this__8298.root.inode_without(0, cljs.core.hash.call(null, k), k);
        if(new_root__8299 === this__8298.root) {
          return coll
        }else {
          return new cljs.core.PersistentHashMap(this__8298.meta, this__8298.cnt - 1, new_root__8299, this__8298.has_nil_QMARK_, this__8298.nil_val, null)
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
  var len__8301 = ks.length;
  var i__8302 = 0;
  var out__8303 = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
  while(true) {
    if(i__8302 < len__8301) {
      var G__8304 = i__8302 + 1;
      var G__8305 = cljs.core.assoc_BANG_.call(null, out__8303, ks[i__8302], vs[i__8302]);
      i__8302 = G__8304;
      out__8303 = G__8305;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__8303)
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
  var this__8306 = this;
  return tcoll.without_BANG_(key)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var this__8307 = this;
  return tcoll.assoc_BANG_(key, val)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, val) {
  var this__8308 = this;
  return tcoll.conj_BANG_(val)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__8309 = this;
  return tcoll.persistent_BANG_()
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, k) {
  var this__8310 = this;
  if(k == null) {
    if(cljs.core.truth_(this__8310.has_nil_QMARK_)) {
      return this__8310.nil_val
    }else {
      return null
    }
  }else {
    if(this__8310.root == null) {
      return null
    }else {
      return cljs.core.nth.call(null, this__8310.root.inode_find(0, cljs.core.hash.call(null, k), k), 1)
    }
  }
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, k, not_found) {
  var this__8311 = this;
  if(k == null) {
    if(cljs.core.truth_(this__8311.has_nil_QMARK_)) {
      return this__8311.nil_val
    }else {
      return not_found
    }
  }else {
    if(this__8311.root == null) {
      return not_found
    }else {
      return cljs.core.nth.call(null, this__8311.root.inode_find(0, cljs.core.hash.call(null, k), k, [null, not_found]), 1)
    }
  }
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8312 = this;
  if(cljs.core.truth_(this__8312.edit)) {
    return this__8312.count
  }else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(o) {
  var this__8313 = this;
  var tcoll__8314 = this;
  if(cljs.core.truth_(this__8313.edit)) {
    if(function() {
      var G__8315__8316 = o;
      if(G__8315__8316 != null) {
        if(function() {
          var or__138__auto____8317 = G__8315__8316.cljs$lang$protocol_mask$partition0$ & 1024;
          if(or__138__auto____8317) {
            return or__138__auto____8317
          }else {
            return G__8315__8316.cljs$core$IMapEntry$
          }
        }()) {
          return true
        }else {
          if(!G__8315__8316.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__8315__8316)
          }else {
            return false
          }
        }
      }else {
        return cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, G__8315__8316)
      }
    }()) {
      return tcoll__8314.assoc_BANG_(cljs.core.key.call(null, o), cljs.core.val.call(null, o))
    }else {
      var es__8318 = cljs.core.seq.call(null, o);
      var tcoll__8319 = tcoll__8314;
      while(true) {
        var temp__317__auto____8320 = cljs.core.first.call(null, es__8318);
        if(cljs.core.truth_(temp__317__auto____8320)) {
          var e__8321 = temp__317__auto____8320;
          var G__8332 = cljs.core.next.call(null, es__8318);
          var G__8333 = tcoll__8319.assoc_BANG_(cljs.core.key.call(null, e__8321), cljs.core.val.call(null, e__8321));
          es__8318 = G__8332;
          tcoll__8319 = G__8333;
          continue
        }else {
          return tcoll__8319
        }
        break
      }
    }
  }else {
    throw new Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(k, v) {
  var this__8322 = this;
  var tcoll__8323 = this;
  if(cljs.core.truth_(this__8322.edit)) {
    if(k == null) {
      if(this__8322.nil_val === v) {
      }else {
        this__8322.nil_val = v
      }
      if(cljs.core.truth_(this__8322.has_nil_QMARK_)) {
      }else {
        this__8322.count = this__8322.count + 1;
        this__8322.has_nil_QMARK_ = true
      }
      return tcoll__8323
    }else {
      var added_leaf_QMARK___8324 = [false];
      var node__8325 = (this__8322.root == null ? cljs.core.BitmapIndexedNode.EMPTY : this__8322.root).inode_assoc_BANG_(this__8322.edit, 0, cljs.core.hash.call(null, k), k, v, added_leaf_QMARK___8324);
      if(node__8325 === this__8322.root) {
      }else {
        this__8322.root = node__8325
      }
      if(cljs.core.truth_(added_leaf_QMARK___8324[0])) {
        this__8322.count = this__8322.count + 1
      }else {
      }
      return tcoll__8323
    }
  }else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(k) {
  var this__8326 = this;
  var tcoll__8327 = this;
  if(cljs.core.truth_(this__8326.edit)) {
    if(k == null) {
      if(cljs.core.truth_(this__8326.has_nil_QMARK_)) {
        this__8326.has_nil_QMARK_ = false;
        this__8326.nil_val = null;
        this__8326.count = this__8326.count - 1;
        return tcoll__8327
      }else {
        return tcoll__8327
      }
    }else {
      if(this__8326.root == null) {
        return tcoll__8327
      }else {
        var removed_leaf_QMARK___8328 = [false];
        var node__8329 = this__8326.root.inode_without_BANG_(this__8326.edit, 0, cljs.core.hash.call(null, k), k, removed_leaf_QMARK___8328);
        if(node__8329 === this__8326.root) {
        }else {
          this__8326.root = node__8329
        }
        if(cljs.core.truth_(removed_leaf_QMARK___8328[0])) {
          this__8326.count = this__8326.count - 1
        }else {
        }
        return tcoll__8327
      }
    }
  }else {
    throw new Error("dissoc! after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  var this__8330 = this;
  var tcoll__8331 = this;
  if(cljs.core.truth_(this__8330.edit)) {
    this__8330.edit = null;
    return new cljs.core.PersistentHashMap(null, this__8330.count, this__8330.root, this__8330.has_nil_QMARK_, this__8330.nil_val, null)
  }else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientHashMap;
cljs.core.tree_map_seq_push = function tree_map_seq_push(node, stack, ascending_QMARK_) {
  var t__8334 = node;
  var stack__8335 = stack;
  while(true) {
    if(t__8334 != null) {
      var G__8336 = cljs.core.truth_(ascending_QMARK_) ? t__8334.left : t__8334.right;
      var G__8337 = cljs.core.conj.call(null, stack__8335, t__8334);
      t__8334 = G__8336;
      stack__8335 = G__8337;
      continue
    }else {
      return stack__8335
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
  var this__8338 = this;
  var h__2328__auto____8339 = this__8338.__hash;
  if(h__2328__auto____8339 != null) {
    return h__2328__auto____8339
  }else {
    var h__2328__auto____8340 = cljs.core.hash_coll.call(null, coll);
    this__8338.__hash = h__2328__auto____8340;
    return h__2328__auto____8340
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__8341 = this;
  return cljs.core.cons.call(null, o, coll)
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  var this__8342 = this;
  var this$__8343 = this;
  return cljs.core.pr_str.call(null, this$__8343)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var this__8344 = this;
  return this$
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8345 = this;
  if(this__8345.cnt < 0) {
    return cljs.core.count.call(null, cljs.core.next.call(null, coll)) + 1
  }else {
    return this__8345.cnt
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(this$) {
  var this__8346 = this;
  return cljs.core.peek.call(null, this__8346.stack)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(this$) {
  var this__8347 = this;
  var t__8348 = cljs.core.peek.call(null, this__8347.stack);
  var next_stack__8349 = cljs.core.tree_map_seq_push.call(null, cljs.core.truth_(this__8347.ascending_QMARK_) ? t__8348.right : t__8348.left, cljs.core.pop.call(null, this__8347.stack), this__8347.ascending_QMARK_);
  if(next_stack__8349 != null) {
    return new cljs.core.PersistentTreeMapSeq(null, next_stack__8349, this__8347.ascending_QMARK_, this__8347.cnt - 1, null)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8350 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8351 = this;
  return new cljs.core.PersistentTreeMapSeq(meta, this__8351.stack, this__8351.ascending_QMARK_, this__8351.cnt, this__8351.__hash)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8352 = this;
  return this__8352.meta
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
        var and__132__auto____8353 = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, right);
        if(and__132__auto____8353) {
          return cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, right.left)
        }else {
          return and__132__auto____8353
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
        var and__132__auto____8354 = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, left);
        if(and__132__auto____8354) {
          return cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, left.right)
        }else {
          return and__132__auto____8354
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
  var init__8355 = f.call(null, init, node.key, node.val);
  if(cljs.core.reduced_QMARK_.call(null, init__8355)) {
    return cljs.core.deref.call(null, init__8355)
  }else {
    var init__8356 = node.left != null ? tree_map_kv_reduce.call(null, node.left, f, init__8355) : init__8355;
    if(cljs.core.reduced_QMARK_.call(null, init__8356)) {
      return cljs.core.deref.call(null, init__8356)
    }else {
      var init__8357 = node.right != null ? tree_map_kv_reduce.call(null, node.right, f, init__8356) : init__8356;
      if(cljs.core.reduced_QMARK_.call(null, init__8357)) {
        return cljs.core.deref.call(null, init__8357)
      }else {
        return init__8357
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
  var this__8362 = this;
  var h__2328__auto____8363 = this__8362.__hash;
  if(h__2328__auto____8363 != null) {
    return h__2328__auto____8363
  }else {
    var h__2328__auto____8364 = cljs.core.hash_coll.call(null, coll);
    this__8362.__hash = h__2328__auto____8364;
    return h__2328__auto____8364
  }
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$ = true;
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(node, k) {
  var this__8365 = this;
  return cljs.core._nth.call(null, node, k, null)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(node, k, not_found) {
  var this__8366 = this;
  return cljs.core._nth.call(null, node, k, not_found)
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$ = true;
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(node, k, v) {
  var this__8367 = this;
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this__8367.key, this__8367.val]), k, v)
};
cljs.core.BlackNode.prototype.cljs$core$IFn$ = true;
cljs.core.BlackNode.prototype.call = function() {
  var G__8414 = null;
  var G__8414__2 = function(tsym8360, k) {
    var this__8368 = this;
    var tsym8360__8369 = this;
    var node__8370 = tsym8360__8369;
    return cljs.core._lookup.call(null, node__8370, k)
  };
  var G__8414__3 = function(tsym8361, k, not_found) {
    var this__8371 = this;
    var tsym8361__8372 = this;
    var node__8373 = tsym8361__8372;
    return cljs.core._lookup.call(null, node__8373, k, not_found)
  };
  G__8414 = function(tsym8361, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8414__2.call(this, tsym8361, k);
      case 3:
        return G__8414__3.call(this, tsym8361, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8414
}();
cljs.core.BlackNode.prototype.apply = function(tsym8358, args8359) {
  return tsym8358.call.apply(tsym8358, [tsym8358].concat(cljs.core.aclone.call(null, args8359)))
};
cljs.core.BlackNode.prototype.cljs$core$ISequential$ = true;
cljs.core.BlackNode.prototype.cljs$core$ICollection$ = true;
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(node, o) {
  var this__8374 = this;
  return cljs.core.PersistentVector.fromArray([this__8374.key, this__8374.val, o])
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$ = true;
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(node) {
  var this__8375 = this;
  return this__8375.key
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(node) {
  var this__8376 = this;
  return this__8376.val
};
cljs.core.BlackNode.prototype.add_right = function(ins) {
  var this__8377 = this;
  var node__8378 = this;
  return ins.balance_right(node__8378)
};
cljs.core.BlackNode.prototype.redden = function() {
  var this__8379 = this;
  var node__8380 = this;
  return new cljs.core.RedNode(this__8379.key, this__8379.val, this__8379.left, this__8379.right, null)
};
cljs.core.BlackNode.prototype.remove_right = function(del) {
  var this__8381 = this;
  var node__8382 = this;
  return cljs.core.balance_right_del.call(null, this__8381.key, this__8381.val, this__8381.left, del)
};
cljs.core.BlackNode.prototype.replace = function(key, val, left, right) {
  var this__8383 = this;
  var node__8384 = this;
  return new cljs.core.BlackNode(key, val, left, right, null)
};
cljs.core.BlackNode.prototype.kv_reduce = function(f, init) {
  var this__8385 = this;
  var node__8386 = this;
  return cljs.core.tree_map_kv_reduce.call(null, node__8386, f, init)
};
cljs.core.BlackNode.prototype.remove_left = function(del) {
  var this__8387 = this;
  var node__8388 = this;
  return cljs.core.balance_left_del.call(null, this__8387.key, this__8387.val, del, this__8387.right)
};
cljs.core.BlackNode.prototype.add_left = function(ins) {
  var this__8389 = this;
  var node__8390 = this;
  return ins.balance_left(node__8390)
};
cljs.core.BlackNode.prototype.balance_left = function(parent) {
  var this__8391 = this;
  var node__8392 = this;
  return new cljs.core.BlackNode(parent.key, parent.val, node__8392, parent.right, null)
};
cljs.core.BlackNode.prototype.toString = function() {
  var G__8415 = null;
  var G__8415__0 = function() {
    var this__8395 = this;
    var this$__8396 = this;
    return cljs.core.pr_str.call(null, this$__8396)
  };
  G__8415 = function() {
    switch(arguments.length) {
      case 0:
        return G__8415__0.call(this)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8415
}();
cljs.core.BlackNode.prototype.balance_right = function(parent) {
  var this__8397 = this;
  var node__8398 = this;
  return new cljs.core.BlackNode(parent.key, parent.val, parent.left, node__8398, null)
};
cljs.core.BlackNode.prototype.blacken = function() {
  var this__8399 = this;
  var node__8400 = this;
  return node__8400
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$ = true;
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(node, f) {
  var this__8401 = this;
  return cljs.core.ci_reduce.call(null, node, f)
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(node, f, start) {
  var this__8402 = this;
  return cljs.core.ci_reduce.call(null, node, f, start)
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$ = true;
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(node) {
  var this__8403 = this;
  return cljs.core.list.call(null, this__8403.key, this__8403.val)
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$ = true;
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function(node) {
  var this__8405 = this;
  return 2
};
cljs.core.BlackNode.prototype.cljs$core$IStack$ = true;
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function(node) {
  var this__8406 = this;
  return this__8406.val
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function(node) {
  var this__8407 = this;
  return cljs.core.PersistentVector.fromArray([this__8407.key])
};
cljs.core.BlackNode.prototype.cljs$core$IVector$ = true;
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(node, n, v) {
  var this__8408 = this;
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this__8408.key, this__8408.val]), n, v)
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$ = true;
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8409 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$ = true;
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(node, meta) {
  var this__8410 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this__8410.key, this__8410.val]), meta)
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$ = true;
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(node) {
  var this__8411 = this;
  return null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$ = true;
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(node, n) {
  var this__8412 = this;
  if(n === 0) {
    return this__8412.key
  }else {
    if(n === 1) {
      return this__8412.val
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
  var this__8413 = this;
  if(n === 0) {
    return this__8413.key
  }else {
    if(n === 1) {
      return this__8413.val
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
  var this__8404 = this;
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
  var this__8420 = this;
  var h__2328__auto____8421 = this__8420.__hash;
  if(h__2328__auto____8421 != null) {
    return h__2328__auto____8421
  }else {
    var h__2328__auto____8422 = cljs.core.hash_coll.call(null, coll);
    this__8420.__hash = h__2328__auto____8422;
    return h__2328__auto____8422
  }
};
cljs.core.RedNode.prototype.cljs$core$ILookup$ = true;
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(node, k) {
  var this__8423 = this;
  return cljs.core._nth.call(null, node, k, null)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(node, k, not_found) {
  var this__8424 = this;
  return cljs.core._nth.call(null, node, k, not_found)
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$ = true;
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(node, k, v) {
  var this__8425 = this;
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this__8425.key, this__8425.val]), k, v)
};
cljs.core.RedNode.prototype.cljs$core$IFn$ = true;
cljs.core.RedNode.prototype.call = function() {
  var G__8472 = null;
  var G__8472__2 = function(tsym8418, k) {
    var this__8426 = this;
    var tsym8418__8427 = this;
    var node__8428 = tsym8418__8427;
    return cljs.core._lookup.call(null, node__8428, k)
  };
  var G__8472__3 = function(tsym8419, k, not_found) {
    var this__8429 = this;
    var tsym8419__8430 = this;
    var node__8431 = tsym8419__8430;
    return cljs.core._lookup.call(null, node__8431, k, not_found)
  };
  G__8472 = function(tsym8419, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8472__2.call(this, tsym8419, k);
      case 3:
        return G__8472__3.call(this, tsym8419, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8472
}();
cljs.core.RedNode.prototype.apply = function(tsym8416, args8417) {
  return tsym8416.call.apply(tsym8416, [tsym8416].concat(cljs.core.aclone.call(null, args8417)))
};
cljs.core.RedNode.prototype.cljs$core$ISequential$ = true;
cljs.core.RedNode.prototype.cljs$core$ICollection$ = true;
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(node, o) {
  var this__8432 = this;
  return cljs.core.PersistentVector.fromArray([this__8432.key, this__8432.val, o])
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$ = true;
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(node) {
  var this__8433 = this;
  return this__8433.key
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(node) {
  var this__8434 = this;
  return this__8434.val
};
cljs.core.RedNode.prototype.add_right = function(ins) {
  var this__8435 = this;
  var node__8436 = this;
  return new cljs.core.RedNode(this__8435.key, this__8435.val, this__8435.left, ins, null)
};
cljs.core.RedNode.prototype.redden = function() {
  var this__8437 = this;
  var node__8438 = this;
  throw new Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.remove_right = function(del) {
  var this__8439 = this;
  var node__8440 = this;
  return new cljs.core.RedNode(this__8439.key, this__8439.val, this__8439.left, del, null)
};
cljs.core.RedNode.prototype.replace = function(key, val, left, right) {
  var this__8441 = this;
  var node__8442 = this;
  return new cljs.core.RedNode(key, val, left, right, null)
};
cljs.core.RedNode.prototype.kv_reduce = function(f, init) {
  var this__8443 = this;
  var node__8444 = this;
  return cljs.core.tree_map_kv_reduce.call(null, node__8444, f, init)
};
cljs.core.RedNode.prototype.remove_left = function(del) {
  var this__8445 = this;
  var node__8446 = this;
  return new cljs.core.RedNode(this__8445.key, this__8445.val, del, this__8445.right, null)
};
cljs.core.RedNode.prototype.add_left = function(ins) {
  var this__8447 = this;
  var node__8448 = this;
  return new cljs.core.RedNode(this__8447.key, this__8447.val, ins, this__8447.right, null)
};
cljs.core.RedNode.prototype.balance_left = function(parent) {
  var this__8449 = this;
  var node__8450 = this;
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__8449.left)) {
    return new cljs.core.RedNode(this__8449.key, this__8449.val, this__8449.left.blacken(), new cljs.core.BlackNode(parent.key, parent.val, this__8449.right, parent.right, null), null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__8449.right)) {
      return new cljs.core.RedNode(this__8449.right.key, this__8449.right.val, new cljs.core.BlackNode(this__8449.key, this__8449.val, this__8449.left, this__8449.right.left, null), new cljs.core.BlackNode(parent.key, parent.val, this__8449.right.right, parent.right, null), null)
    }else {
      if("\ufdd0'else") {
        return new cljs.core.BlackNode(parent.key, parent.val, node__8450, parent.right, null)
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.toString = function() {
  var G__8473 = null;
  var G__8473__0 = function() {
    var this__8453 = this;
    var this$__8454 = this;
    return cljs.core.pr_str.call(null, this$__8454)
  };
  G__8473 = function() {
    switch(arguments.length) {
      case 0:
        return G__8473__0.call(this)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8473
}();
cljs.core.RedNode.prototype.balance_right = function(parent) {
  var this__8455 = this;
  var node__8456 = this;
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__8455.right)) {
    return new cljs.core.RedNode(this__8455.key, this__8455.val, new cljs.core.BlackNode(parent.key, parent.val, parent.left, this__8455.left, null), this__8455.right.blacken(), null)
  }else {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this__8455.left)) {
      return new cljs.core.RedNode(this__8455.left.key, this__8455.left.val, new cljs.core.BlackNode(parent.key, parent.val, parent.left, this__8455.left.left, null), new cljs.core.BlackNode(this__8455.key, this__8455.val, this__8455.left.right, this__8455.right, null), null)
    }else {
      if("\ufdd0'else") {
        return new cljs.core.BlackNode(parent.key, parent.val, parent.left, node__8456, null)
      }else {
        return null
      }
    }
  }
};
cljs.core.RedNode.prototype.blacken = function() {
  var this__8457 = this;
  var node__8458 = this;
  return new cljs.core.BlackNode(this__8457.key, this__8457.val, this__8457.left, this__8457.right, null)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$ = true;
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(node, f) {
  var this__8459 = this;
  return cljs.core.ci_reduce.call(null, node, f)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(node, f, start) {
  var this__8460 = this;
  return cljs.core.ci_reduce.call(null, node, f, start)
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$ = true;
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(node) {
  var this__8461 = this;
  return cljs.core.list.call(null, this__8461.key, this__8461.val)
};
cljs.core.RedNode.prototype.cljs$core$ICounted$ = true;
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function(node) {
  var this__8463 = this;
  return 2
};
cljs.core.RedNode.prototype.cljs$core$IStack$ = true;
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function(node) {
  var this__8464 = this;
  return this__8464.val
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function(node) {
  var this__8465 = this;
  return cljs.core.PersistentVector.fromArray([this__8465.key])
};
cljs.core.RedNode.prototype.cljs$core$IVector$ = true;
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(node, n, v) {
  var this__8466 = this;
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this__8466.key, this__8466.val]), n, v)
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$ = true;
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8467 = this;
  return cljs.core.equiv_sequential.call(null, coll, other)
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$ = true;
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(node, meta) {
  var this__8468 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this__8468.key, this__8468.val]), meta)
};
cljs.core.RedNode.prototype.cljs$core$IMeta$ = true;
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(node) {
  var this__8469 = this;
  return null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$ = true;
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(node, n) {
  var this__8470 = this;
  if(n === 0) {
    return this__8470.key
  }else {
    if(n === 1) {
      return this__8470.val
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
  var this__8471 = this;
  if(n === 0) {
    return this__8471.key
  }else {
    if(n === 1) {
      return this__8471.val
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
  var this__8462 = this;
  return cljs.core.PersistentVector.fromArray([])
};
cljs.core.RedNode;
cljs.core.tree_map_add = function tree_map_add(comp, tree, k, v, found) {
  if(tree == null) {
    return new cljs.core.RedNode(k, v, null, null, null)
  }else {
    var c__8474 = comp.call(null, k, tree.key);
    if(c__8474 === 0) {
      found[0] = tree;
      return null
    }else {
      if(c__8474 < 0) {
        var ins__8475 = tree_map_add.call(null, comp, tree.left, k, v, found);
        if(ins__8475 != null) {
          return tree.add_left(ins__8475)
        }else {
          return null
        }
      }else {
        if("\ufdd0'else") {
          var ins__8476 = tree_map_add.call(null, comp, tree.right, k, v, found);
          if(ins__8476 != null) {
            return tree.add_right(ins__8476)
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
          var app__8477 = tree_map_append.call(null, left.right, right.left);
          if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, app__8477)) {
            return new cljs.core.RedNode(app__8477.key, app__8477.val, new cljs.core.RedNode(left.key, left.val, left.left, app__8477.left), new cljs.core.RedNode(right.key, right.val, app__8477.right, right.right), null)
          }else {
            return new cljs.core.RedNode(left.key, left.val, left.left, new cljs.core.RedNode(right.key, right.val, app__8477, right.right, null), null)
          }
        }else {
          return new cljs.core.RedNode(left.key, left.val, left.left, tree_map_append.call(null, left.right, right), null)
        }
      }else {
        if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, right)) {
          return new cljs.core.RedNode(right.key, right.val, tree_map_append.call(null, left, right.left), right.right, null)
        }else {
          if("\ufdd0'else") {
            var app__8478 = tree_map_append.call(null, left.right, right.left);
            if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, app__8478)) {
              return new cljs.core.RedNode(app__8478.key, app__8478.val, new cljs.core.BlackNode(left.key, left.val, left.left, app__8478.left, null), new cljs.core.BlackNode(right.key, right.val, app__8478.right, right.right, null), null)
            }else {
              return cljs.core.balance_left_del.call(null, left.key, left.val, left.left, new cljs.core.BlackNode(right.key, right.val, app__8478, right.right, null))
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
    var c__8479 = comp.call(null, k, tree.key);
    if(c__8479 === 0) {
      found[0] = tree;
      return cljs.core.tree_map_append.call(null, tree.left, tree.right)
    }else {
      if(c__8479 < 0) {
        var del__8480 = tree_map_remove.call(null, comp, tree.left, k, found);
        if(function() {
          var or__138__auto____8481 = del__8480 != null;
          if(or__138__auto____8481) {
            return or__138__auto____8481
          }else {
            return found[0] != null
          }
        }()) {
          if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, tree.left)) {
            return cljs.core.balance_left_del.call(null, tree.key, tree.val, del__8480, tree.right)
          }else {
            return new cljs.core.RedNode(tree.key, tree.val, del__8480, tree.right, null)
          }
        }else {
          return null
        }
      }else {
        if("\ufdd0'else") {
          var del__8482 = tree_map_remove.call(null, comp, tree.right, k, found);
          if(function() {
            var or__138__auto____8483 = del__8482 != null;
            if(or__138__auto____8483) {
              return or__138__auto____8483
            }else {
              return found[0] != null
            }
          }()) {
            if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, tree.right)) {
              return cljs.core.balance_right_del.call(null, tree.key, tree.val, tree.left, del__8482)
            }else {
              return new cljs.core.RedNode(tree.key, tree.val, tree.left, del__8482, null)
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
  var tk__8484 = tree.key;
  var c__8485 = comp.call(null, k, tk__8484);
  if(c__8485 === 0) {
    return tree.replace(tk__8484, v, tree.left, tree.right)
  }else {
    if(c__8485 < 0) {
      return tree.replace(tk__8484, tree.val, tree_map_replace.call(null, comp, tree.left, k, v), tree.right)
    }else {
      if("\ufdd0'else") {
        return tree.replace(tk__8484, tree.val, tree.left, tree_map_replace.call(null, comp, tree.right, k, v))
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
  var this__8490 = this;
  var h__2328__auto____8491 = this__8490.__hash;
  if(h__2328__auto____8491 != null) {
    return h__2328__auto____8491
  }else {
    var h__2328__auto____8492 = cljs.core.hash_imap.call(null, coll);
    this__8490.__hash = h__2328__auto____8492;
    return h__2328__auto____8492
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var this__8493 = this;
  return cljs.core._lookup.call(null, coll, k, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var this__8494 = this;
  var n__8495 = coll.entry_at(k);
  if(n__8495 != null) {
    return n__8495.val
  }else {
    return not_found
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var this__8496 = this;
  var found__8497 = [null];
  var t__8498 = cljs.core.tree_map_add.call(null, this__8496.comp, this__8496.tree, k, v, found__8497);
  if(t__8498 == null) {
    var found_node__8499 = cljs.core.nth.call(null, found__8497, 0);
    if(cljs.core._EQ_.call(null, v, found_node__8499.val)) {
      return coll
    }else {
      return new cljs.core.PersistentTreeMap(this__8496.comp, cljs.core.tree_map_replace.call(null, this__8496.comp, this__8496.tree, k, v), this__8496.cnt, this__8496.meta, null)
    }
  }else {
    return new cljs.core.PersistentTreeMap(this__8496.comp, t__8498.blacken(), this__8496.cnt + 1, this__8496.meta, null)
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var this__8500 = this;
  return coll.entry_at(k) != null
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentTreeMap.prototype.call = function() {
  var G__8532 = null;
  var G__8532__2 = function(tsym8488, k) {
    var this__8501 = this;
    var tsym8488__8502 = this;
    var coll__8503 = tsym8488__8502;
    return cljs.core._lookup.call(null, coll__8503, k)
  };
  var G__8532__3 = function(tsym8489, k, not_found) {
    var this__8504 = this;
    var tsym8489__8505 = this;
    var coll__8506 = tsym8489__8505;
    return cljs.core._lookup.call(null, coll__8506, k, not_found)
  };
  G__8532 = function(tsym8489, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8532__2.call(this, tsym8489, k);
      case 3:
        return G__8532__3.call(this, tsym8489, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8532
}();
cljs.core.PersistentTreeMap.prototype.apply = function(tsym8486, args8487) {
  return tsym8486.call.apply(tsym8486, [tsym8486].concat(cljs.core.aclone.call(null, args8487)))
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var this__8507 = this;
  if(this__8507.tree != null) {
    return cljs.core.tree_map_kv_reduce.call(null, this__8507.tree, f, init)
  }else {
    return init
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var this__8508 = this;
  if(cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1))
  }else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll, entry)
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__8509 = this;
  if(this__8509.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__8509.tree, false, this__8509.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.toString = function() {
  var this__8510 = this;
  var this$__8511 = this;
  return cljs.core.pr_str.call(null, this$__8511)
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(k) {
  var this__8512 = this;
  var coll__8513 = this;
  var t__8514 = this__8512.tree;
  while(true) {
    if(t__8514 != null) {
      var c__8515 = this__8512.comp.call(null, k, t__8514.key);
      if(c__8515 === 0) {
        return t__8514
      }else {
        if(c__8515 < 0) {
          var G__8533 = t__8514.left;
          t__8514 = G__8533;
          continue
        }else {
          if("\ufdd0'else") {
            var G__8534 = t__8514.right;
            t__8514 = G__8534;
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
  var this__8516 = this;
  if(this__8516.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__8516.tree, ascending_QMARK_, this__8516.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(coll, k, ascending_QMARK_) {
  var this__8517 = this;
  if(this__8517.cnt > 0) {
    var stack__8518 = null;
    var t__8519 = this__8517.tree;
    while(true) {
      if(t__8519 != null) {
        var c__8520 = this__8517.comp.call(null, k, t__8519.key);
        if(c__8520 === 0) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.call(null, stack__8518, t__8519), ascending_QMARK_, -1)
        }else {
          if(cljs.core.truth_(ascending_QMARK_)) {
            if(c__8520 < 0) {
              var G__8535 = cljs.core.conj.call(null, stack__8518, t__8519);
              var G__8536 = t__8519.left;
              stack__8518 = G__8535;
              t__8519 = G__8536;
              continue
            }else {
              var G__8537 = stack__8518;
              var G__8538 = t__8519.right;
              stack__8518 = G__8537;
              t__8519 = G__8538;
              continue
            }
          }else {
            if("\ufdd0'else") {
              if(c__8520 > 0) {
                var G__8539 = cljs.core.conj.call(null, stack__8518, t__8519);
                var G__8540 = t__8519.right;
                stack__8518 = G__8539;
                t__8519 = G__8540;
                continue
              }else {
                var G__8541 = stack__8518;
                var G__8542 = t__8519.left;
                stack__8518 = G__8541;
                t__8519 = G__8542;
                continue
              }
            }else {
              return null
            }
          }
        }
      }else {
        if(stack__8518 == null) {
          return new cljs.core.PersistentTreeMapSeq(null, stack__8518, ascending_QMARK_, -1)
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
  var this__8521 = this;
  return cljs.core.key.call(null, entry)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function(coll) {
  var this__8522 = this;
  return this__8522.comp
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__8523 = this;
  if(this__8523.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, this__8523.tree, true, this__8523.cnt)
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8524 = this;
  return this__8524.cnt
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8525 = this;
  return cljs.core.equiv_map.call(null, coll, other)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8526 = this;
  return new cljs.core.PersistentTreeMap(this__8526.comp, this__8526.tree, this__8526.cnt, meta, this__8526.__hash)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8530 = this;
  return this__8530.meta
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8531 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeMap.EMPTY, this__8531.meta)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var this__8527 = this;
  var found__8528 = [null];
  var t__8529 = cljs.core.tree_map_remove.call(null, this__8527.comp, this__8527.tree, k, found__8528);
  if(t__8529 == null) {
    if(cljs.core.nth.call(null, found__8528, 0) == null) {
      return coll
    }else {
      return new cljs.core.PersistentTreeMap(this__8527.comp, null, 0, this__8527.meta, null)
    }
  }else {
    return new cljs.core.PersistentTreeMap(this__8527.comp, t__8529.blacken(), this__8527.cnt - 1, this__8527.meta, null)
  }
};
cljs.core.PersistentTreeMap;
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null, 0);
cljs.core.hash_map = function() {
  var hash_map__delegate = function(keyvals) {
    var in$__8543 = cljs.core.seq.call(null, keyvals);
    var out__8544 = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
    while(true) {
      if(cljs.core.truth_(in$__8543)) {
        var G__8545 = cljs.core.nnext.call(null, in$__8543);
        var G__8546 = cljs.core.assoc_BANG_.call(null, out__8544, cljs.core.first.call(null, in$__8543), cljs.core.second.call(null, in$__8543));
        in$__8543 = G__8545;
        out__8544 = G__8546;
        continue
      }else {
        return cljs.core.persistent_BANG_.call(null, out__8544)
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
  hash_map.cljs$lang$applyTo = function(arglist__8547) {
    var keyvals = cljs.core.seq(arglist__8547);
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
  array_map.cljs$lang$applyTo = function(arglist__8548) {
    var keyvals = cljs.core.seq(arglist__8548);
    return array_map__delegate(keyvals)
  };
  array_map.cljs$lang$arity$variadic = array_map__delegate;
  return array_map
}();
cljs.core.sorted_map = function() {
  var sorted_map__delegate = function(keyvals) {
    var in$__8549 = cljs.core.seq.call(null, keyvals);
    var out__8550 = cljs.core.PersistentTreeMap.EMPTY;
    while(true) {
      if(cljs.core.truth_(in$__8549)) {
        var G__8551 = cljs.core.nnext.call(null, in$__8549);
        var G__8552 = cljs.core.assoc.call(null, out__8550, cljs.core.first.call(null, in$__8549), cljs.core.second.call(null, in$__8549));
        in$__8549 = G__8551;
        out__8550 = G__8552;
        continue
      }else {
        return out__8550
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
  sorted_map.cljs$lang$applyTo = function(arglist__8553) {
    var keyvals = cljs.core.seq(arglist__8553);
    return sorted_map__delegate(keyvals)
  };
  sorted_map.cljs$lang$arity$variadic = sorted_map__delegate;
  return sorted_map
}();
cljs.core.sorted_map_by = function() {
  var sorted_map_by__delegate = function(comparator, keyvals) {
    var in$__8554 = cljs.core.seq.call(null, keyvals);
    var out__8555 = new cljs.core.PersistentTreeMap(comparator, null, 0, null, 0);
    while(true) {
      if(cljs.core.truth_(in$__8554)) {
        var G__8556 = cljs.core.nnext.call(null, in$__8554);
        var G__8557 = cljs.core.assoc.call(null, out__8555, cljs.core.first.call(null, in$__8554), cljs.core.second.call(null, in$__8554));
        in$__8554 = G__8556;
        out__8555 = G__8557;
        continue
      }else {
        return out__8555
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
  sorted_map_by.cljs$lang$applyTo = function(arglist__8558) {
    var comparator = cljs.core.first(arglist__8558);
    var keyvals = cljs.core.rest(arglist__8558);
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
      return cljs.core.reduce.call(null, function(p1__8559_SHARP_, p2__8560_SHARP_) {
        return cljs.core.conj.call(null, function() {
          var or__138__auto____8561 = p1__8559_SHARP_;
          if(cljs.core.truth_(or__138__auto____8561)) {
            return or__138__auto____8561
          }else {
            return cljs.core.ObjMap.fromObject([], {})
          }
        }(), p2__8560_SHARP_)
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
  merge.cljs$lang$applyTo = function(arglist__8562) {
    var maps = cljs.core.seq(arglist__8562);
    return merge__delegate(maps)
  };
  merge.cljs$lang$arity$variadic = merge__delegate;
  return merge
}();
cljs.core.merge_with = function() {
  var merge_with__delegate = function(f, maps) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, maps))) {
      var merge_entry__8565 = function(m, e) {
        var k__8563 = cljs.core.first.call(null, e);
        var v__8564 = cljs.core.second.call(null, e);
        if(cljs.core.contains_QMARK_.call(null, m, k__8563)) {
          return cljs.core.assoc.call(null, m, k__8563, f.call(null, cljs.core.get.call(null, m, k__8563), v__8564))
        }else {
          return cljs.core.assoc.call(null, m, k__8563, v__8564)
        }
      };
      var merge2__8567 = function(m1, m2) {
        return cljs.core.reduce.call(null, merge_entry__8565, function() {
          var or__138__auto____8566 = m1;
          if(cljs.core.truth_(or__138__auto____8566)) {
            return or__138__auto____8566
          }else {
            return cljs.core.ObjMap.fromObject([], {})
          }
        }(), cljs.core.seq.call(null, m2))
      };
      return cljs.core.reduce.call(null, merge2__8567, maps)
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
  merge_with.cljs$lang$applyTo = function(arglist__8568) {
    var f = cljs.core.first(arglist__8568);
    var maps = cljs.core.rest(arglist__8568);
    return merge_with__delegate(f, maps)
  };
  merge_with.cljs$lang$arity$variadic = merge_with__delegate;
  return merge_with
}();
cljs.core.select_keys = function select_keys(map, keyseq) {
  var ret__8569 = cljs.core.ObjMap.fromObject([], {});
  var keys__8570 = cljs.core.seq.call(null, keyseq);
  while(true) {
    if(cljs.core.truth_(keys__8570)) {
      var key__8571 = cljs.core.first.call(null, keys__8570);
      var entry__8572 = cljs.core.get.call(null, map, key__8571, "\ufdd0'user/not-found");
      var G__8573 = cljs.core.not_EQ_.call(null, entry__8572, "\ufdd0'user/not-found") ? cljs.core.assoc.call(null, ret__8569, key__8571, entry__8572) : ret__8569;
      var G__8574 = cljs.core.next.call(null, keys__8570);
      ret__8569 = G__8573;
      keys__8570 = G__8574;
      continue
    }else {
      return ret__8569
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
  var this__8580 = this;
  return new cljs.core.TransientHashSet(cljs.core.transient$.call(null, this__8580.hash_map))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var this__8581 = this;
  var h__2328__auto____8582 = this__8581.__hash;
  if(h__2328__auto____8582 != null) {
    return h__2328__auto____8582
  }else {
    var h__2328__auto____8583 = cljs.core.hash_iset.call(null, coll);
    this__8581.__hash = h__2328__auto____8583;
    return h__2328__auto____8583
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, v) {
  var this__8584 = this;
  return cljs.core._lookup.call(null, coll, v, null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, v, not_found) {
  var this__8585 = this;
  if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this__8585.hash_map, v))) {
    return v
  }else {
    return not_found
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentHashSet.prototype.call = function() {
  var G__8604 = null;
  var G__8604__2 = function(tsym8578, k) {
    var this__8586 = this;
    var tsym8578__8587 = this;
    var coll__8588 = tsym8578__8587;
    return cljs.core._lookup.call(null, coll__8588, k)
  };
  var G__8604__3 = function(tsym8579, k, not_found) {
    var this__8589 = this;
    var tsym8579__8590 = this;
    var coll__8591 = tsym8579__8590;
    return cljs.core._lookup.call(null, coll__8591, k, not_found)
  };
  G__8604 = function(tsym8579, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8604__2.call(this, tsym8579, k);
      case 3:
        return G__8604__3.call(this, tsym8579, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8604
}();
cljs.core.PersistentHashSet.prototype.apply = function(tsym8576, args8577) {
  return tsym8576.call.apply(tsym8576, [tsym8576].concat(cljs.core.aclone.call(null, args8577)))
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__8592 = this;
  return new cljs.core.PersistentHashSet(this__8592.meta, cljs.core.assoc.call(null, this__8592.hash_map, o, null), null)
};
cljs.core.PersistentHashSet.prototype.toString = function() {
  var this__8593 = this;
  var this$__8594 = this;
  return cljs.core.pr_str.call(null, this$__8594)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__8595 = this;
  return cljs.core.keys.call(null, this__8595.hash_map)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(coll, v) {
  var this__8596 = this;
  return new cljs.core.PersistentHashSet(this__8596.meta, cljs.core.dissoc.call(null, this__8596.hash_map, v), null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8597 = this;
  return cljs.core.count.call(null, cljs.core.seq.call(null, coll))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8598 = this;
  var and__132__auto____8599 = cljs.core.set_QMARK_.call(null, other);
  if(and__132__auto____8599) {
    var and__132__auto____8600 = cljs.core.count.call(null, coll) === cljs.core.count.call(null, other);
    if(and__132__auto____8600) {
      return cljs.core.every_QMARK_.call(null, function(p1__8575_SHARP_) {
        return cljs.core.contains_QMARK_.call(null, coll, p1__8575_SHARP_)
      }, other)
    }else {
      return and__132__auto____8600
    }
  }else {
    return and__132__auto____8599
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8601 = this;
  return new cljs.core.PersistentHashSet(meta, this__8601.hash_map, this__8601.__hash)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8602 = this;
  return this__8602.meta
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8603 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentHashSet.EMPTY, this__8603.meta)
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
  var G__8622 = null;
  var G__8622__2 = function(tsym8608, k) {
    var this__8610 = this;
    var tsym8608__8611 = this;
    var tcoll__8612 = tsym8608__8611;
    if(cljs.core._lookup.call(null, this__8610.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
      return null
    }else {
      return k
    }
  };
  var G__8622__3 = function(tsym8609, k, not_found) {
    var this__8613 = this;
    var tsym8609__8614 = this;
    var tcoll__8615 = tsym8609__8614;
    if(cljs.core._lookup.call(null, this__8613.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
      return not_found
    }else {
      return k
    }
  };
  G__8622 = function(tsym8609, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8622__2.call(this, tsym8609, k);
      case 3:
        return G__8622__3.call(this, tsym8609, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8622
}();
cljs.core.TransientHashSet.prototype.apply = function(tsym8606, args8607) {
  return tsym8606.call.apply(tsym8606, [tsym8606].concat(cljs.core.aclone.call(null, args8607)))
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, v) {
  var this__8616 = this;
  return cljs.core._lookup.call(null, tcoll, v, null)
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, v, not_found) {
  var this__8617 = this;
  if(cljs.core._lookup.call(null, this__8617.transient_map, v, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return not_found
  }else {
    return v
  }
};
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(tcoll) {
  var this__8618 = this;
  return cljs.core.count.call(null, this__8618.transient_map)
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = function(tcoll, v) {
  var this__8619 = this;
  this__8619.transient_map = cljs.core.dissoc_BANG_.call(null, this__8619.transient_map, v);
  return tcoll
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var this__8620 = this;
  this__8620.transient_map = cljs.core.assoc_BANG_.call(null, this__8620.transient_map, o, null);
  return tcoll
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var this__8621 = this;
  return new cljs.core.PersistentHashSet(null, cljs.core.persistent_BANG_.call(null, this__8621.transient_map), null)
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
  var this__8627 = this;
  var h__2328__auto____8628 = this__8627.__hash;
  if(h__2328__auto____8628 != null) {
    return h__2328__auto____8628
  }else {
    var h__2328__auto____8629 = cljs.core.hash_iset.call(null, coll);
    this__8627.__hash = h__2328__auto____8629;
    return h__2328__auto____8629
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, v) {
  var this__8630 = this;
  return cljs.core._lookup.call(null, coll, v, null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, v, not_found) {
  var this__8631 = this;
  if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this__8631.tree_map, v))) {
    return v
  }else {
    return not_found
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentTreeSet.prototype.call = function() {
  var G__8655 = null;
  var G__8655__2 = function(tsym8625, k) {
    var this__8632 = this;
    var tsym8625__8633 = this;
    var coll__8634 = tsym8625__8633;
    return cljs.core._lookup.call(null, coll__8634, k)
  };
  var G__8655__3 = function(tsym8626, k, not_found) {
    var this__8635 = this;
    var tsym8626__8636 = this;
    var coll__8637 = tsym8626__8636;
    return cljs.core._lookup.call(null, coll__8637, k, not_found)
  };
  G__8655 = function(tsym8626, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__8655__2.call(this, tsym8626, k);
      case 3:
        return G__8655__3.call(this, tsym8626, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__8655
}();
cljs.core.PersistentTreeSet.prototype.apply = function(tsym8623, args8624) {
  return tsym8623.call.apply(tsym8623, [tsym8623].concat(cljs.core.aclone.call(null, args8624)))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var this__8638 = this;
  return new cljs.core.PersistentTreeSet(this__8638.meta, cljs.core.assoc.call(null, this__8638.tree_map, o, null), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var this__8639 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core.rseq.call(null, this__8639.tree_map))
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  var this__8640 = this;
  var this$__8641 = this;
  return cljs.core.pr_str.call(null, this$__8641)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(coll, ascending_QMARK_) {
  var this__8642 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq.call(null, this__8642.tree_map, ascending_QMARK_))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(coll, k, ascending_QMARK_) {
  var this__8643 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq_from.call(null, this__8643.tree_map, k, ascending_QMARK_))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(coll, entry) {
  var this__8644 = this;
  return entry
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function(coll) {
  var this__8645 = this;
  return cljs.core._comparator.call(null, this__8645.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var this__8646 = this;
  return cljs.core.keys.call(null, this__8646.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(coll, v) {
  var this__8647 = this;
  return new cljs.core.PersistentTreeSet(this__8647.meta, cljs.core.dissoc.call(null, this__8647.tree_map, v), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var this__8648 = this;
  return cljs.core.count.call(null, this__8648.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var this__8649 = this;
  var and__132__auto____8650 = cljs.core.set_QMARK_.call(null, other);
  if(and__132__auto____8650) {
    var and__132__auto____8651 = cljs.core.count.call(null, coll) === cljs.core.count.call(null, other);
    if(and__132__auto____8651) {
      return cljs.core.every_QMARK_.call(null, function(p1__8605_SHARP_) {
        return cljs.core.contains_QMARK_.call(null, coll, p1__8605_SHARP_)
      }, other)
    }else {
      return and__132__auto____8651
    }
  }else {
    return and__132__auto____8650
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta) {
  var this__8652 = this;
  return new cljs.core.PersistentTreeSet(meta, this__8652.tree_map, this__8652.__hash)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var this__8653 = this;
  return this__8653.meta
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var this__8654 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeSet.EMPTY, this__8654.meta)
};
cljs.core.PersistentTreeSet;
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map.call(null), 0);
cljs.core.set = function set(coll) {
  var in$__8656 = cljs.core.seq.call(null, coll);
  var out__8657 = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);
  while(true) {
    if(cljs.core.truth_(cljs.core.seq.call(null, in$__8656))) {
      var G__8658 = cljs.core.next.call(null, in$__8656);
      var G__8659 = cljs.core.conj_BANG_.call(null, out__8657, cljs.core.first.call(null, in$__8656));
      in$__8656 = G__8658;
      out__8657 = G__8659;
      continue
    }else {
      return cljs.core.persistent_BANG_.call(null, out__8657)
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
  sorted_set.cljs$lang$applyTo = function(arglist__8660) {
    var keys = cljs.core.seq(arglist__8660);
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
  sorted_set_by.cljs$lang$applyTo = function(arglist__8662) {
    var comparator = cljs.core.first(arglist__8662);
    var keys = cljs.core.rest(arglist__8662);
    return sorted_set_by__delegate(comparator, keys)
  };
  sorted_set_by.cljs$lang$arity$variadic = sorted_set_by__delegate;
  return sorted_set_by
}();
cljs.core.replace = function replace(smap, coll) {
  if(cljs.core.vector_QMARK_.call(null, coll)) {
    var n__8663 = cljs.core.count.call(null, coll);
    return cljs.core.reduce.call(null, function(v, i) {
      var temp__317__auto____8664 = cljs.core.find.call(null, smap, cljs.core.nth.call(null, v, i));
      if(cljs.core.truth_(temp__317__auto____8664)) {
        var e__8665 = temp__317__auto____8664;
        return cljs.core.assoc.call(null, v, i, cljs.core.second.call(null, e__8665))
      }else {
        return v
      }
    }, coll, cljs.core.take.call(null, n__8663, cljs.core.iterate.call(null, cljs.core.inc, 0)))
  }else {
    return cljs.core.map.call(null, function(p1__8661_SHARP_) {
      var temp__317__auto____8666 = cljs.core.find.call(null, smap, p1__8661_SHARP_);
      if(cljs.core.truth_(temp__317__auto____8666)) {
        var e__8667 = temp__317__auto____8666;
        return cljs.core.second.call(null, e__8667)
      }else {
        return p1__8661_SHARP_
      }
    }, coll)
  }
};
cljs.core.distinct = function distinct(coll) {
  var step__8675 = function step(xs, seen) {
    return new cljs.core.LazySeq(null, false, function() {
      return function(p__8668, seen) {
        while(true) {
          var vec__8669__8670 = p__8668;
          var f__8671 = cljs.core.nth.call(null, vec__8669__8670, 0, null);
          var xs__8672 = vec__8669__8670;
          var temp__324__auto____8673 = cljs.core.seq.call(null, xs__8672);
          if(cljs.core.truth_(temp__324__auto____8673)) {
            var s__8674 = temp__324__auto____8673;
            if(cljs.core.contains_QMARK_.call(null, seen, f__8671)) {
              var G__8676 = cljs.core.rest.call(null, s__8674);
              var G__8677 = seen;
              p__8668 = G__8676;
              seen = G__8677;
              continue
            }else {
              return cljs.core.cons.call(null, f__8671, step.call(null, cljs.core.rest.call(null, s__8674), cljs.core.conj.call(null, seen, f__8671)))
            }
          }else {
            return null
          }
          break
        }
      }.call(null, xs, seen)
    })
  };
  return step__8675.call(null, coll, cljs.core.set([]))
};
cljs.core.butlast = function butlast(s) {
  var ret__8678 = cljs.core.PersistentVector.fromArray([]);
  var s__8679 = s;
  while(true) {
    if(cljs.core.truth_(cljs.core.next.call(null, s__8679))) {
      var G__8680 = cljs.core.conj.call(null, ret__8678, cljs.core.first.call(null, s__8679));
      var G__8681 = cljs.core.next.call(null, s__8679);
      ret__8678 = G__8680;
      s__8679 = G__8681;
      continue
    }else {
      return cljs.core.seq.call(null, ret__8678)
    }
    break
  }
};
cljs.core.name = function name(x) {
  if(cljs.core.string_QMARK_.call(null, x)) {
    return x
  }else {
    if(function() {
      var or__138__auto____8682 = cljs.core.keyword_QMARK_.call(null, x);
      if(or__138__auto____8682) {
        return or__138__auto____8682
      }else {
        return cljs.core.symbol_QMARK_.call(null, x)
      }
    }()) {
      var i__8683 = x.lastIndexOf("/");
      if(i__8683 < 0) {
        return cljs.core.subs.call(null, x, 2)
      }else {
        return cljs.core.subs.call(null, x, i__8683 + 1)
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
    var or__138__auto____8684 = cljs.core.keyword_QMARK_.call(null, x);
    if(or__138__auto____8684) {
      return or__138__auto____8684
    }else {
      return cljs.core.symbol_QMARK_.call(null, x)
    }
  }()) {
    var i__8685 = x.lastIndexOf("/");
    if(i__8685 > -1) {
      return cljs.core.subs.call(null, x, 2, i__8685)
    }else {
      return null
    }
  }else {
    throw new Error([cljs.core.str("Doesn't support namespace: "), cljs.core.str(x)].join(""));
  }
};
cljs.core.zipmap = function zipmap(keys, vals) {
  var map__8688 = cljs.core.ObjMap.fromObject([], {});
  var ks__8689 = cljs.core.seq.call(null, keys);
  var vs__8690 = cljs.core.seq.call(null, vals);
  while(true) {
    if(cljs.core.truth_(function() {
      var and__132__auto____8691 = ks__8689;
      if(cljs.core.truth_(and__132__auto____8691)) {
        return vs__8690
      }else {
        return and__132__auto____8691
      }
    }())) {
      var G__8692 = cljs.core.assoc.call(null, map__8688, cljs.core.first.call(null, ks__8689), cljs.core.first.call(null, vs__8690));
      var G__8693 = cljs.core.next.call(null, ks__8689);
      var G__8694 = cljs.core.next.call(null, vs__8690);
      map__8688 = G__8692;
      ks__8689 = G__8693;
      vs__8690 = G__8694;
      continue
    }else {
      return map__8688
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
    var G__8697__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__8686_SHARP_, p2__8687_SHARP_) {
        return max_key.call(null, k, p1__8686_SHARP_, p2__8687_SHARP_)
      }, max_key.call(null, k, x, y), more)
    };
    var G__8697 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__8697__delegate.call(this, k, x, y, more)
    };
    G__8697.cljs$lang$maxFixedArity = 3;
    G__8697.cljs$lang$applyTo = function(arglist__8698) {
      var k = cljs.core.first(arglist__8698);
      var x = cljs.core.first(cljs.core.next(arglist__8698));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8698)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8698)));
      return G__8697__delegate(k, x, y, more)
    };
    G__8697.cljs$lang$arity$variadic = G__8697__delegate;
    return G__8697
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
    var G__8699__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__8695_SHARP_, p2__8696_SHARP_) {
        return min_key.call(null, k, p1__8695_SHARP_, p2__8696_SHARP_)
      }, min_key.call(null, k, x, y), more)
    };
    var G__8699 = function(k, x, y, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__8699__delegate.call(this, k, x, y, more)
    };
    G__8699.cljs$lang$maxFixedArity = 3;
    G__8699.cljs$lang$applyTo = function(arglist__8700) {
      var k = cljs.core.first(arglist__8700);
      var x = cljs.core.first(cljs.core.next(arglist__8700));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8700)));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8700)));
      return G__8699__delegate(k, x, y, more)
    };
    G__8699.cljs$lang$arity$variadic = G__8699__delegate;
    return G__8699
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
      var temp__324__auto____8701 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____8701)) {
        var s__8702 = temp__324__auto____8701;
        return cljs.core.cons.call(null, cljs.core.take.call(null, n, s__8702), partition_all.call(null, n, step, cljs.core.drop.call(null, step, s__8702)))
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
    var temp__324__auto____8703 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____8703)) {
      var s__8704 = temp__324__auto____8703;
      if(cljs.core.truth_(pred.call(null, cljs.core.first.call(null, s__8704)))) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s__8704), take_while.call(null, pred, cljs.core.rest.call(null, s__8704)))
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
    var comp__8705 = cljs.core._comparator.call(null, sc);
    return test.call(null, comp__8705.call(null, cljs.core._entry_key.call(null, sc, e), key), 0)
  }
};
cljs.core.subseq = function() {
  var subseq = null;
  var subseq__3 = function(sc, test, key) {
    var include__8706 = cljs.core.mk_bound_fn.call(null, sc, test, key);
    if(cljs.core.truth_(cljs.core.set([cljs.core._GT_, cljs.core._GT__EQ_]).call(null, test))) {
      var temp__324__auto____8707 = cljs.core._sorted_seq_from.call(null, sc, key, true);
      if(cljs.core.truth_(temp__324__auto____8707)) {
        var vec__8708__8709 = temp__324__auto____8707;
        var e__8710 = cljs.core.nth.call(null, vec__8708__8709, 0, null);
        var s__8711 = vec__8708__8709;
        if(cljs.core.truth_(include__8706.call(null, e__8710))) {
          return s__8711
        }else {
          return cljs.core.next.call(null, s__8711)
        }
      }else {
        return null
      }
    }else {
      return cljs.core.take_while.call(null, include__8706, cljs.core._sorted_seq.call(null, sc, true))
    }
  };
  var subseq__5 = function(sc, start_test, start_key, end_test, end_key) {
    var temp__324__auto____8712 = cljs.core._sorted_seq_from.call(null, sc, start_key, true);
    if(cljs.core.truth_(temp__324__auto____8712)) {
      var vec__8713__8714 = temp__324__auto____8712;
      var e__8715 = cljs.core.nth.call(null, vec__8713__8714, 0, null);
      var s__8716 = vec__8713__8714;
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, sc, end_test, end_key), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, sc, start_test, start_key).call(null, e__8715)) ? s__8716 : cljs.core.next.call(null, s__8716))
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
    var include__8717 = cljs.core.mk_bound_fn.call(null, sc, test, key);
    if(cljs.core.truth_(cljs.core.set([cljs.core._LT_, cljs.core._LT__EQ_]).call(null, test))) {
      var temp__324__auto____8718 = cljs.core._sorted_seq_from.call(null, sc, key, false);
      if(cljs.core.truth_(temp__324__auto____8718)) {
        var vec__8719__8720 = temp__324__auto____8718;
        var e__8721 = cljs.core.nth.call(null, vec__8719__8720, 0, null);
        var s__8722 = vec__8719__8720;
        if(cljs.core.truth_(include__8717.call(null, e__8721))) {
          return s__8722
        }else {
          return cljs.core.next.call(null, s__8722)
        }
      }else {
        return null
      }
    }else {
      return cljs.core.take_while.call(null, include__8717, cljs.core._sorted_seq.call(null, sc, false))
    }
  };
  var rsubseq__5 = function(sc, start_test, start_key, end_test, end_key) {
    var temp__324__auto____8723 = cljs.core._sorted_seq_from.call(null, sc, end_key, false);
    if(cljs.core.truth_(temp__324__auto____8723)) {
      var vec__8724__8725 = temp__324__auto____8723;
      var e__8726 = cljs.core.nth.call(null, vec__8724__8725, 0, null);
      var s__8727 = vec__8724__8725;
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, sc, start_test, start_key), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, sc, end_test, end_key).call(null, e__8726)) ? s__8727 : cljs.core.next.call(null, s__8727))
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
  var this__8728 = this;
  var h__2328__auto____8729 = this__8728.__hash;
  if(h__2328__auto____8729 != null) {
    return h__2328__auto____8729
  }else {
    var h__2328__auto____8730 = cljs.core.hash_coll.call(null, rng);
    this__8728.__hash = h__2328__auto____8730;
    return h__2328__auto____8730
  }
};
cljs.core.Range.prototype.cljs$core$ISequential$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(rng, o) {
  var this__8731 = this;
  return cljs.core.cons.call(null, o, rng)
};
cljs.core.Range.prototype.toString = function() {
  var this__8732 = this;
  var this$__8733 = this;
  return cljs.core.pr_str.call(null, this$__8733)
};
cljs.core.Range.prototype.cljs$core$IReduce$ = true;
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(rng, f) {
  var this__8734 = this;
  return cljs.core.ci_reduce.call(null, rng, f)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(rng, f, s) {
  var this__8735 = this;
  return cljs.core.ci_reduce.call(null, rng, f, s)
};
cljs.core.Range.prototype.cljs$core$ISeqable$ = true;
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(rng) {
  var this__8736 = this;
  var comp__8737 = this__8736.step > 0 ? cljs.core._LT_ : cljs.core._GT_;
  if(cljs.core.truth_(comp__8737.call(null, this__8736.start, this__8736.end))) {
    return rng
  }else {
    return null
  }
};
cljs.core.Range.prototype.cljs$core$ICounted$ = true;
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(rng) {
  var this__8738 = this;
  if(cljs.core.not.call(null, cljs.core._seq.call(null, rng))) {
    return 0
  }else {
    return Math["ceil"]((this__8738.end - this__8738.start) / this__8738.step)
  }
};
cljs.core.Range.prototype.cljs$core$ISeq$ = true;
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function(rng) {
  var this__8739 = this;
  return this__8739.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(rng) {
  var this__8740 = this;
  if(cljs.core.truth_(cljs.core._seq.call(null, rng))) {
    return new cljs.core.Range(this__8740.meta, this__8740.start + this__8740.step, this__8740.end, this__8740.step, null)
  }else {
    return cljs.core.list.call(null)
  }
};
cljs.core.Range.prototype.cljs$core$IEquiv$ = true;
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(rng, other) {
  var this__8741 = this;
  return cljs.core.equiv_sequential.call(null, rng, other)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(rng, meta) {
  var this__8742 = this;
  return new cljs.core.Range(meta, this__8742.start, this__8742.end, this__8742.step, this__8742.__hash)
};
cljs.core.Range.prototype.cljs$core$IMeta$ = true;
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function(rng) {
  var this__8743 = this;
  return this__8743.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$ = true;
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(rng, n) {
  var this__8744 = this;
  if(n < cljs.core._count.call(null, rng)) {
    return this__8744.start + n * this__8744.step
  }else {
    if(function() {
      var and__132__auto____8745 = this__8744.start > this__8744.end;
      if(and__132__auto____8745) {
        return this__8744.step === 0
      }else {
        return and__132__auto____8745
      }
    }()) {
      return this__8744.start
    }else {
      throw new Error("Index out of bounds");
    }
  }
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(rng, n, not_found) {
  var this__8746 = this;
  if(n < cljs.core._count.call(null, rng)) {
    return this__8746.start + n * this__8746.step
  }else {
    if(function() {
      var and__132__auto____8747 = this__8746.start > this__8746.end;
      if(and__132__auto____8747) {
        return this__8746.step === 0
      }else {
        return and__132__auto____8747
      }
    }()) {
      return this__8746.start
    }else {
      return not_found
    }
  }
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(rng) {
  var this__8748 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this__8748.meta)
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
    var temp__324__auto____8749 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____8749)) {
      var s__8750 = temp__324__auto____8749;
      return cljs.core.cons.call(null, cljs.core.first.call(null, s__8750), take_nth.call(null, n, cljs.core.drop.call(null, n, s__8750)))
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
    var temp__324__auto____8752 = cljs.core.seq.call(null, coll);
    if(cljs.core.truth_(temp__324__auto____8752)) {
      var s__8753 = temp__324__auto____8752;
      var fst__8754 = cljs.core.first.call(null, s__8753);
      var fv__8755 = f.call(null, fst__8754);
      var run__8756 = cljs.core.cons.call(null, fst__8754, cljs.core.take_while.call(null, function(p1__8751_SHARP_) {
        return cljs.core._EQ_.call(null, fv__8755, f.call(null, p1__8751_SHARP_))
      }, cljs.core.next.call(null, s__8753)));
      return cljs.core.cons.call(null, run__8756, partition_by.call(null, f, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, run__8756), s__8753))))
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
      var temp__317__auto____8767 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__317__auto____8767)) {
        var s__8768 = temp__317__auto____8767;
        return reductions.call(null, f, cljs.core.first.call(null, s__8768), cljs.core.rest.call(null, s__8768))
      }else {
        return cljs.core.list.call(null, f.call(null))
      }
    })
  };
  var reductions__3 = function(f, init, coll) {
    return cljs.core.cons.call(null, init, new cljs.core.LazySeq(null, false, function() {
      var temp__324__auto____8769 = cljs.core.seq.call(null, coll);
      if(cljs.core.truth_(temp__324__auto____8769)) {
        var s__8770 = temp__324__auto____8769;
        return reductions.call(null, f, f.call(null, init, cljs.core.first.call(null, s__8770)), cljs.core.rest.call(null, s__8770))
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
      var G__8772 = null;
      var G__8772__0 = function() {
        return cljs.core.vector.call(null, f.call(null))
      };
      var G__8772__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x))
      };
      var G__8772__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y))
      };
      var G__8772__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z))
      };
      var G__8772__4 = function() {
        var G__8773__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args))
        };
        var G__8773 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__8773__delegate.call(this, x, y, z, args)
        };
        G__8773.cljs$lang$maxFixedArity = 3;
        G__8773.cljs$lang$applyTo = function(arglist__8774) {
          var x = cljs.core.first(arglist__8774);
          var y = cljs.core.first(cljs.core.next(arglist__8774));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8774)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8774)));
          return G__8773__delegate(x, y, z, args)
        };
        G__8773.cljs$lang$arity$variadic = G__8773__delegate;
        return G__8773
      }();
      G__8772 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__8772__0.call(this);
          case 1:
            return G__8772__1.call(this, x);
          case 2:
            return G__8772__2.call(this, x, y);
          case 3:
            return G__8772__3.call(this, x, y, z);
          default:
            return G__8772__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__8772.cljs$lang$maxFixedArity = 3;
      G__8772.cljs$lang$applyTo = G__8772__4.cljs$lang$applyTo;
      return G__8772
    }()
  };
  var juxt__2 = function(f, g) {
    return function() {
      var G__8775 = null;
      var G__8775__0 = function() {
        return cljs.core.vector.call(null, f.call(null), g.call(null))
      };
      var G__8775__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x), g.call(null, x))
      };
      var G__8775__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y), g.call(null, x, y))
      };
      var G__8775__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z), g.call(null, x, y, z))
      };
      var G__8775__4 = function() {
        var G__8776__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args))
        };
        var G__8776 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__8776__delegate.call(this, x, y, z, args)
        };
        G__8776.cljs$lang$maxFixedArity = 3;
        G__8776.cljs$lang$applyTo = function(arglist__8777) {
          var x = cljs.core.first(arglist__8777);
          var y = cljs.core.first(cljs.core.next(arglist__8777));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8777)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8777)));
          return G__8776__delegate(x, y, z, args)
        };
        G__8776.cljs$lang$arity$variadic = G__8776__delegate;
        return G__8776
      }();
      G__8775 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__8775__0.call(this);
          case 1:
            return G__8775__1.call(this, x);
          case 2:
            return G__8775__2.call(this, x, y);
          case 3:
            return G__8775__3.call(this, x, y, z);
          default:
            return G__8775__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__8775.cljs$lang$maxFixedArity = 3;
      G__8775.cljs$lang$applyTo = G__8775__4.cljs$lang$applyTo;
      return G__8775
    }()
  };
  var juxt__3 = function(f, g, h) {
    return function() {
      var G__8778 = null;
      var G__8778__0 = function() {
        return cljs.core.vector.call(null, f.call(null), g.call(null), h.call(null))
      };
      var G__8778__1 = function(x) {
        return cljs.core.vector.call(null, f.call(null, x), g.call(null, x), h.call(null, x))
      };
      var G__8778__2 = function(x, y) {
        return cljs.core.vector.call(null, f.call(null, x, y), g.call(null, x, y), h.call(null, x, y))
      };
      var G__8778__3 = function(x, y, z) {
        return cljs.core.vector.call(null, f.call(null, x, y, z), g.call(null, x, y, z), h.call(null, x, y, z))
      };
      var G__8778__4 = function() {
        var G__8779__delegate = function(x, y, z, args) {
          return cljs.core.vector.call(null, cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args), cljs.core.apply.call(null, h, x, y, z, args))
        };
        var G__8779 = function(x, y, z, var_args) {
          var args = null;
          if(goog.isDef(var_args)) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
          }
          return G__8779__delegate.call(this, x, y, z, args)
        };
        G__8779.cljs$lang$maxFixedArity = 3;
        G__8779.cljs$lang$applyTo = function(arglist__8780) {
          var x = cljs.core.first(arglist__8780);
          var y = cljs.core.first(cljs.core.next(arglist__8780));
          var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8780)));
          var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8780)));
          return G__8779__delegate(x, y, z, args)
        };
        G__8779.cljs$lang$arity$variadic = G__8779__delegate;
        return G__8779
      }();
      G__8778 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__8778__0.call(this);
          case 1:
            return G__8778__1.call(this, x);
          case 2:
            return G__8778__2.call(this, x, y);
          case 3:
            return G__8778__3.call(this, x, y, z);
          default:
            return G__8778__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
        }
        throw"Invalid arity: " + arguments.length;
      };
      G__8778.cljs$lang$maxFixedArity = 3;
      G__8778.cljs$lang$applyTo = G__8778__4.cljs$lang$applyTo;
      return G__8778
    }()
  };
  var juxt__4 = function() {
    var G__8781__delegate = function(f, g, h, fs) {
      var fs__8771 = cljs.core.list_STAR_.call(null, f, g, h, fs);
      return function() {
        var G__8782 = null;
        var G__8782__0 = function() {
          return cljs.core.reduce.call(null, function(p1__8757_SHARP_, p2__8758_SHARP_) {
            return cljs.core.conj.call(null, p1__8757_SHARP_, p2__8758_SHARP_.call(null))
          }, cljs.core.PersistentVector.fromArray([]), fs__8771)
        };
        var G__8782__1 = function(x) {
          return cljs.core.reduce.call(null, function(p1__8759_SHARP_, p2__8760_SHARP_) {
            return cljs.core.conj.call(null, p1__8759_SHARP_, p2__8760_SHARP_.call(null, x))
          }, cljs.core.PersistentVector.fromArray([]), fs__8771)
        };
        var G__8782__2 = function(x, y) {
          return cljs.core.reduce.call(null, function(p1__8761_SHARP_, p2__8762_SHARP_) {
            return cljs.core.conj.call(null, p1__8761_SHARP_, p2__8762_SHARP_.call(null, x, y))
          }, cljs.core.PersistentVector.fromArray([]), fs__8771)
        };
        var G__8782__3 = function(x, y, z) {
          return cljs.core.reduce.call(null, function(p1__8763_SHARP_, p2__8764_SHARP_) {
            return cljs.core.conj.call(null, p1__8763_SHARP_, p2__8764_SHARP_.call(null, x, y, z))
          }, cljs.core.PersistentVector.fromArray([]), fs__8771)
        };
        var G__8782__4 = function() {
          var G__8783__delegate = function(x, y, z, args) {
            return cljs.core.reduce.call(null, function(p1__8765_SHARP_, p2__8766_SHARP_) {
              return cljs.core.conj.call(null, p1__8765_SHARP_, cljs.core.apply.call(null, p2__8766_SHARP_, x, y, z, args))
            }, cljs.core.PersistentVector.fromArray([]), fs__8771)
          };
          var G__8783 = function(x, y, z, var_args) {
            var args = null;
            if(goog.isDef(var_args)) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
            }
            return G__8783__delegate.call(this, x, y, z, args)
          };
          G__8783.cljs$lang$maxFixedArity = 3;
          G__8783.cljs$lang$applyTo = function(arglist__8784) {
            var x = cljs.core.first(arglist__8784);
            var y = cljs.core.first(cljs.core.next(arglist__8784));
            var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8784)));
            var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8784)));
            return G__8783__delegate(x, y, z, args)
          };
          G__8783.cljs$lang$arity$variadic = G__8783__delegate;
          return G__8783
        }();
        G__8782 = function(x, y, z, var_args) {
          var args = var_args;
          switch(arguments.length) {
            case 0:
              return G__8782__0.call(this);
            case 1:
              return G__8782__1.call(this, x);
            case 2:
              return G__8782__2.call(this, x, y);
            case 3:
              return G__8782__3.call(this, x, y, z);
            default:
              return G__8782__4.cljs$lang$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3))
          }
          throw"Invalid arity: " + arguments.length;
        };
        G__8782.cljs$lang$maxFixedArity = 3;
        G__8782.cljs$lang$applyTo = G__8782__4.cljs$lang$applyTo;
        return G__8782
      }()
    };
    var G__8781 = function(f, g, h, var_args) {
      var fs = null;
      if(goog.isDef(var_args)) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0)
      }
      return G__8781__delegate.call(this, f, g, h, fs)
    };
    G__8781.cljs$lang$maxFixedArity = 3;
    G__8781.cljs$lang$applyTo = function(arglist__8785) {
      var f = cljs.core.first(arglist__8785);
      var g = cljs.core.first(cljs.core.next(arglist__8785));
      var h = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8785)));
      var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8785)));
      return G__8781__delegate(f, g, h, fs)
    };
    G__8781.cljs$lang$arity$variadic = G__8781__delegate;
    return G__8781
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
        var G__8787 = cljs.core.next.call(null, coll);
        coll = G__8787;
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
        var and__132__auto____8786 = cljs.core.seq.call(null, coll);
        if(cljs.core.truth_(and__132__auto____8786)) {
          return n > 0
        }else {
          return and__132__auto____8786
        }
      }())) {
        var G__8788 = n - 1;
        var G__8789 = cljs.core.next.call(null, coll);
        n = G__8788;
        coll = G__8789;
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
  var matches__8790 = re.exec(s);
  if(cljs.core._EQ_.call(null, cljs.core.first.call(null, matches__8790), s)) {
    if(cljs.core.count.call(null, matches__8790) === 1) {
      return cljs.core.first.call(null, matches__8790)
    }else {
      return cljs.core.vec.call(null, matches__8790)
    }
  }else {
    return null
  }
};
cljs.core.re_find = function re_find(re, s) {
  var matches__8791 = re.exec(s);
  if(matches__8791 == null) {
    return null
  }else {
    if(cljs.core.count.call(null, matches__8791) === 1) {
      return cljs.core.first.call(null, matches__8791)
    }else {
      return cljs.core.vec.call(null, matches__8791)
    }
  }
};
cljs.core.re_seq = function re_seq(re, s) {
  var match_data__8792 = cljs.core.re_find.call(null, re, s);
  var match_idx__8793 = s.search(re);
  var match_str__8794 = cljs.core.coll_QMARK_.call(null, match_data__8792) ? cljs.core.first.call(null, match_data__8792) : match_data__8792;
  var post_match__8795 = cljs.core.subs.call(null, s, match_idx__8793 + cljs.core.count.call(null, match_str__8794));
  if(cljs.core.truth_(match_data__8792)) {
    return new cljs.core.LazySeq(null, false, function() {
      return cljs.core.cons.call(null, match_data__8792, re_seq.call(null, re, post_match__8795))
    })
  }else {
    return null
  }
};
cljs.core.re_pattern = function re_pattern(s) {
  var vec__8797__8798 = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, s);
  var ___8799 = cljs.core.nth.call(null, vec__8797__8798, 0, null);
  var flags__8800 = cljs.core.nth.call(null, vec__8797__8798, 1, null);
  var pattern__8801 = cljs.core.nth.call(null, vec__8797__8798, 2, null);
  return new RegExp(pattern__8801, flags__8800)
};
cljs.core.pr_sequential = function pr_sequential(print_one, begin, sep, end, opts, coll) {
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray([begin]), cljs.core.flatten1.call(null, cljs.core.interpose.call(null, cljs.core.PersistentVector.fromArray([sep]), cljs.core.map.call(null, function(p1__8796_SHARP_) {
    return print_one.call(null, p1__8796_SHARP_, opts)
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
          var and__132__auto____8802 = cljs.core.get.call(null, opts, "\ufdd0'meta");
          if(cljs.core.truth_(and__132__auto____8802)) {
            var and__132__auto____8806 = function() {
              var G__8803__8804 = obj;
              if(G__8803__8804 != null) {
                if(function() {
                  var or__138__auto____8805 = G__8803__8804.cljs$lang$protocol_mask$partition0$ & 65536;
                  if(or__138__auto____8805) {
                    return or__138__auto____8805
                  }else {
                    return G__8803__8804.cljs$core$IMeta$
                  }
                }()) {
                  return true
                }else {
                  if(!G__8803__8804.cljs$lang$protocol_mask$partition0$) {
                    return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__8803__8804)
                  }else {
                    return false
                  }
                }
              }else {
                return cljs.core.type_satisfies_.call(null, cljs.core.IMeta, G__8803__8804)
              }
            }();
            if(cljs.core.truth_(and__132__auto____8806)) {
              return cljs.core.meta.call(null, obj)
            }else {
              return and__132__auto____8806
            }
          }else {
            return and__132__auto____8802
          }
        }()) ? cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["^"]), pr_seq.call(null, cljs.core.meta.call(null, obj), opts), cljs.core.PersistentVector.fromArray([" "])) : null, cljs.core.truth_(function() {
          var and__132__auto____8807 = obj != null;
          if(and__132__auto____8807) {
            return obj.cljs$lang$type
          }else {
            return and__132__auto____8807
          }
        }()) ? obj.cljs$lang$ctorPrSeq(obj) : function() {
          var G__8808__8809 = obj;
          if(G__8808__8809 != null) {
            if(function() {
              var or__138__auto____8810 = G__8808__8809.cljs$lang$protocol_mask$partition0$ & 268435456;
              if(or__138__auto____8810) {
                return or__138__auto____8810
              }else {
                return G__8808__8809.cljs$core$IPrintable$
              }
            }()) {
              return true
            }else {
              if(!G__8808__8809.cljs$lang$protocol_mask$partition0$) {
                return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__8808__8809)
              }else {
                return false
              }
            }
          }else {
            return cljs.core.type_satisfies_.call(null, cljs.core.IPrintable, G__8808__8809)
          }
        }() ? cljs.core._pr_seq.call(null, obj, opts) : "\ufdd0'else" ? cljs.core.list.call(null, "#<", [cljs.core.str(obj)].join(""), ">") : null)
      }else {
        return null
      }
    }
  }
};
cljs.core.pr_sb = function pr_sb(objs, opts) {
  var first_obj__8811 = cljs.core.first.call(null, objs);
  var sb__8812 = new goog.string.StringBuffer;
  var G__8813__8814 = cljs.core.seq.call(null, objs);
  if(cljs.core.truth_(G__8813__8814)) {
    var obj__8815 = cljs.core.first.call(null, G__8813__8814);
    var G__8813__8816 = G__8813__8814;
    while(true) {
      if(obj__8815 === first_obj__8811) {
      }else {
        sb__8812.append(" ")
      }
      var G__8817__8818 = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, obj__8815, opts));
      if(cljs.core.truth_(G__8817__8818)) {
        var string__8819 = cljs.core.first.call(null, G__8817__8818);
        var G__8817__8820 = G__8817__8818;
        while(true) {
          sb__8812.append(string__8819);
          var temp__324__auto____8821 = cljs.core.next.call(null, G__8817__8820);
          if(cljs.core.truth_(temp__324__auto____8821)) {
            var G__8817__8822 = temp__324__auto____8821;
            var G__8825 = cljs.core.first.call(null, G__8817__8822);
            var G__8826 = G__8817__8822;
            string__8819 = G__8825;
            G__8817__8820 = G__8826;
            continue
          }else {
          }
          break
        }
      }else {
      }
      var temp__324__auto____8823 = cljs.core.next.call(null, G__8813__8816);
      if(cljs.core.truth_(temp__324__auto____8823)) {
        var G__8813__8824 = temp__324__auto____8823;
        var G__8827 = cljs.core.first.call(null, G__8813__8824);
        var G__8828 = G__8813__8824;
        obj__8815 = G__8827;
        G__8813__8816 = G__8828;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return sb__8812
};
cljs.core.pr_str_with_opts = function pr_str_with_opts(objs, opts) {
  return[cljs.core.str(cljs.core.pr_sb.call(null, objs, opts))].join("")
};
cljs.core.prn_str_with_opts = function prn_str_with_opts(objs, opts) {
  var sb__8829 = cljs.core.pr_sb.call(null, objs, opts);
  sb__8829.append("\n");
  return[cljs.core.str(sb__8829)].join("")
};
cljs.core.pr_with_opts = function pr_with_opts(objs, opts) {
  var first_obj__8830 = cljs.core.first.call(null, objs);
  var G__8831__8832 = cljs.core.seq.call(null, objs);
  if(cljs.core.truth_(G__8831__8832)) {
    var obj__8833 = cljs.core.first.call(null, G__8831__8832);
    var G__8831__8834 = G__8831__8832;
    while(true) {
      if(obj__8833 === first_obj__8830) {
      }else {
        cljs.core.string_print.call(null, " ")
      }
      var G__8835__8836 = cljs.core.seq.call(null, cljs.core.pr_seq.call(null, obj__8833, opts));
      if(cljs.core.truth_(G__8835__8836)) {
        var string__8837 = cljs.core.first.call(null, G__8835__8836);
        var G__8835__8838 = G__8835__8836;
        while(true) {
          cljs.core.string_print.call(null, string__8837);
          var temp__324__auto____8839 = cljs.core.next.call(null, G__8835__8838);
          if(cljs.core.truth_(temp__324__auto____8839)) {
            var G__8835__8840 = temp__324__auto____8839;
            var G__8843 = cljs.core.first.call(null, G__8835__8840);
            var G__8844 = G__8835__8840;
            string__8837 = G__8843;
            G__8835__8838 = G__8844;
            continue
          }else {
          }
          break
        }
      }else {
      }
      var temp__324__auto____8841 = cljs.core.next.call(null, G__8831__8834);
      if(cljs.core.truth_(temp__324__auto____8841)) {
        var G__8831__8842 = temp__324__auto____8841;
        var G__8845 = cljs.core.first.call(null, G__8831__8842);
        var G__8846 = G__8831__8842;
        obj__8833 = G__8845;
        G__8831__8834 = G__8846;
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
  pr_str.cljs$lang$applyTo = function(arglist__8847) {
    var objs = cljs.core.seq(arglist__8847);
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
  prn_str.cljs$lang$applyTo = function(arglist__8848) {
    var objs = cljs.core.seq(arglist__8848);
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
  pr.cljs$lang$applyTo = function(arglist__8849) {
    var objs = cljs.core.seq(arglist__8849);
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
  cljs_core_print.cljs$lang$applyTo = function(arglist__8850) {
    var objs = cljs.core.seq(arglist__8850);
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
  print_str.cljs$lang$applyTo = function(arglist__8851) {
    var objs = cljs.core.seq(arglist__8851);
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
  println.cljs$lang$applyTo = function(arglist__8852) {
    var objs = cljs.core.seq(arglist__8852);
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
  println_str.cljs$lang$applyTo = function(arglist__8853) {
    var objs = cljs.core.seq(arglist__8853);
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
  prn.cljs$lang$applyTo = function(arglist__8854) {
    var objs = cljs.core.seq(arglist__8854);
    return prn__delegate(objs)
  };
  prn.cljs$lang$arity$variadic = prn__delegate;
  return prn
}();
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__8855 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__8855, "{", ", ", "}", opts, coll)
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
  var pr_pair__8856 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__8856, "{", ", ", "}", opts, coll)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(coll, opts) {
  var pr_pair__8857 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__8857, "{", ", ", "}", opts, coll)
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
      var temp__324__auto____8858 = cljs.core.namespace.call(null, obj);
      if(cljs.core.truth_(temp__324__auto____8858)) {
        var nspc__8859 = temp__324__auto____8858;
        return[cljs.core.str(nspc__8859), cljs.core.str("/")].join("")
      }else {
        return null
      }
    }()), cljs.core.str(cljs.core.name.call(null, obj))].join(""))
  }else {
    if(cljs.core.symbol_QMARK_.call(null, obj)) {
      return cljs.core.list.call(null, [cljs.core.str(function() {
        var temp__324__auto____8860 = cljs.core.namespace.call(null, obj);
        if(cljs.core.truth_(temp__324__auto____8860)) {
          var nspc__8861 = temp__324__auto____8860;
          return[cljs.core.str(nspc__8861), cljs.core.str("/")].join("")
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
  var pr_pair__8862 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__8862, "{", ", ", "}", opts, coll)
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
  var pr_pair__8863 = function(keyval) {
    return cljs.core.pr_sequential.call(null, cljs.core.pr_seq, "", " ", "", opts, keyval)
  };
  return cljs.core.pr_sequential.call(null, pr_pair__8863, "{", ", ", "}", opts, coll)
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
  var this__8864 = this;
  return goog.getUid.call(null, this$)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$ = true;
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(this$, oldval, newval) {
  var this__8865 = this;
  var G__8866__8867 = cljs.core.seq.call(null, this__8865.watches);
  if(cljs.core.truth_(G__8866__8867)) {
    var G__8869__8871 = cljs.core.first.call(null, G__8866__8867);
    var vec__8870__8872 = G__8869__8871;
    var key__8873 = cljs.core.nth.call(null, vec__8870__8872, 0, null);
    var f__8874 = cljs.core.nth.call(null, vec__8870__8872, 1, null);
    var G__8866__8875 = G__8866__8867;
    var G__8869__8876 = G__8869__8871;
    var G__8866__8877 = G__8866__8875;
    while(true) {
      var vec__8878__8879 = G__8869__8876;
      var key__8880 = cljs.core.nth.call(null, vec__8878__8879, 0, null);
      var f__8881 = cljs.core.nth.call(null, vec__8878__8879, 1, null);
      var G__8866__8882 = G__8866__8877;
      f__8881.call(null, key__8880, this$, oldval, newval);
      var temp__324__auto____8883 = cljs.core.next.call(null, G__8866__8882);
      if(cljs.core.truth_(temp__324__auto____8883)) {
        var G__8866__8884 = temp__324__auto____8883;
        var G__8891 = cljs.core.first.call(null, G__8866__8884);
        var G__8892 = G__8866__8884;
        G__8869__8876 = G__8891;
        G__8866__8877 = G__8892;
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
  var this__8885 = this;
  return this$.watches = cljs.core.assoc.call(null, this__8885.watches, key, f)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(this$, key) {
  var this__8886 = this;
  return this$.watches = cljs.core.dissoc.call(null, this__8886.watches, key)
};
cljs.core.Atom.prototype.cljs$core$IPrintable$ = true;
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = function(a, opts) {
  var this__8887 = this;
  return cljs.core.concat.call(null, cljs.core.PersistentVector.fromArray(["#<Atom: "]), cljs.core._pr_seq.call(null, this__8887.state, opts), ">")
};
cljs.core.Atom.prototype.cljs$core$IMeta$ = true;
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function(_) {
  var this__8888 = this;
  return this__8888.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$ = true;
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function(_) {
  var this__8889 = this;
  return this__8889.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$ = true;
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var this__8890 = this;
  return o === other
};
cljs.core.Atom;
cljs.core.atom = function() {
  var atom = null;
  var atom__1 = function(x) {
    return new cljs.core.Atom(x, null, null, null)
  };
  var atom__2 = function() {
    var G__8899__delegate = function(x, p__8893) {
      var map__8894__8895 = p__8893;
      var map__8894__8896 = cljs.core.seq_QMARK_.call(null, map__8894__8895) ? cljs.core.apply.call(null, cljs.core.hash_map, map__8894__8895) : map__8894__8895;
      var validator__8897 = cljs.core.get.call(null, map__8894__8896, "\ufdd0'validator");
      var meta__8898 = cljs.core.get.call(null, map__8894__8896, "\ufdd0'meta");
      return new cljs.core.Atom(x, meta__8898, validator__8897, null)
    };
    var G__8899 = function(x, var_args) {
      var p__8893 = null;
      if(goog.isDef(var_args)) {
        p__8893 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__8899__delegate.call(this, x, p__8893)
    };
    G__8899.cljs$lang$maxFixedArity = 1;
    G__8899.cljs$lang$applyTo = function(arglist__8900) {
      var x = cljs.core.first(arglist__8900);
      var p__8893 = cljs.core.rest(arglist__8900);
      return G__8899__delegate(x, p__8893)
    };
    G__8899.cljs$lang$arity$variadic = G__8899__delegate;
    return G__8899
  }();
  atom = function(x, var_args) {
    var p__8893 = var_args;
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
  var temp__324__auto____8901 = a.validator;
  if(cljs.core.truth_(temp__324__auto____8901)) {
    var validate__8902 = temp__324__auto____8901;
    if(cljs.core.truth_(validate__8902.call(null, new_value))) {
    }else {
      throw new Error([cljs.core.str("Assert failed: "), cljs.core.str("Validator rejected reference state"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list("\ufdd1'validate", "\ufdd1'new-value"), cljs.core.hash_map("\ufdd0'line", 5917))))].join(""));
    }
  }else {
  }
  var old_value__8903 = a.state;
  a.state = new_value;
  cljs.core._notify_watches.call(null, a, old_value__8903, new_value);
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
    var G__8904__delegate = function(a, f, x, y, z, more) {
      return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, f, a.state, x, y, z, more))
    };
    var G__8904 = function(a, f, x, y, z, var_args) {
      var more = null;
      if(goog.isDef(var_args)) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0)
      }
      return G__8904__delegate.call(this, a, f, x, y, z, more)
    };
    G__8904.cljs$lang$maxFixedArity = 5;
    G__8904.cljs$lang$applyTo = function(arglist__8905) {
      var a = cljs.core.first(arglist__8905);
      var f = cljs.core.first(cljs.core.next(arglist__8905));
      var x = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8905)));
      var y = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__8905))));
      var z = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__8905)))));
      var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__8905)))));
      return G__8904__delegate(a, f, x, y, z, more)
    };
    G__8904.cljs$lang$arity$variadic = G__8904__delegate;
    return G__8904
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
  alter_meta_BANG_.cljs$lang$applyTo = function(arglist__8906) {
    var iref = cljs.core.first(arglist__8906);
    var f = cljs.core.first(cljs.core.next(arglist__8906));
    var args = cljs.core.rest(cljs.core.next(arglist__8906));
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
  var this__8907 = this;
  return"\ufdd0'done".call(null, cljs.core.deref.call(null, this__8907.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$ = true;
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function(_) {
  var this__8908 = this;
  return"\ufdd0'value".call(null, cljs.core.swap_BANG_.call(null, this__8908.state, function(p__8909) {
    var curr_state__8910 = p__8909;
    var curr_state__8911 = cljs.core.seq_QMARK_.call(null, curr_state__8910) ? cljs.core.apply.call(null, cljs.core.hash_map, curr_state__8910) : curr_state__8910;
    var done__8912 = cljs.core.get.call(null, curr_state__8911, "\ufdd0'done");
    if(cljs.core.truth_(done__8912)) {
      return curr_state__8911
    }else {
      return cljs.core.ObjMap.fromObject(["\ufdd0'done", "\ufdd0'value"], {"\ufdd0'done":true, "\ufdd0'value":this__8908.f.call(null)})
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
    var map__8913__8914 = options;
    var map__8913__8915 = cljs.core.seq_QMARK_.call(null, map__8913__8914) ? cljs.core.apply.call(null, cljs.core.hash_map, map__8913__8914) : map__8913__8914;
    var keywordize_keys__8916 = cljs.core.get.call(null, map__8913__8915, "\ufdd0'keywordize-keys");
    var keyfn__8917 = cljs.core.truth_(keywordize_keys__8916) ? cljs.core.keyword : cljs.core.str;
    var f__8923 = function thisfn(x) {
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
                var iter__2589__auto____8922 = function iter__8918(s__8919) {
                  return new cljs.core.LazySeq(null, false, function() {
                    var s__8919__8920 = s__8919;
                    while(true) {
                      if(cljs.core.truth_(cljs.core.seq.call(null, s__8919__8920))) {
                        var k__8921 = cljs.core.first.call(null, s__8919__8920);
                        return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([keyfn__8917.call(null, k__8921), thisfn.call(null, x[k__8921])]), iter__8918.call(null, cljs.core.rest.call(null, s__8919__8920)))
                      }else {
                        return null
                      }
                      break
                    }
                  })
                };
                return iter__2589__auto____8922.call(null, cljs.core.js_keys.call(null, x))
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
    return f__8923.call(null, x)
  };
  var js__GT_clj = function(x, var_args) {
    var options = null;
    if(goog.isDef(var_args)) {
      options = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return js__GT_clj__delegate.call(this, x, options)
  };
  js__GT_clj.cljs$lang$maxFixedArity = 1;
  js__GT_clj.cljs$lang$applyTo = function(arglist__8924) {
    var x = cljs.core.first(arglist__8924);
    var options = cljs.core.rest(arglist__8924);
    return js__GT_clj__delegate(x, options)
  };
  js__GT_clj.cljs$lang$arity$variadic = js__GT_clj__delegate;
  return js__GT_clj
}();
cljs.core.memoize = function memoize(f) {
  var mem__8925 = cljs.core.atom.call(null, cljs.core.ObjMap.fromObject([], {}));
  return function() {
    var G__8929__delegate = function(args) {
      var temp__317__auto____8926 = cljs.core.get.call(null, cljs.core.deref.call(null, mem__8925), args);
      if(cljs.core.truth_(temp__317__auto____8926)) {
        var v__8927 = temp__317__auto____8926;
        return v__8927
      }else {
        var ret__8928 = cljs.core.apply.call(null, f, args);
        cljs.core.swap_BANG_.call(null, mem__8925, cljs.core.assoc, args, ret__8928);
        return ret__8928
      }
    };
    var G__8929 = function(var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0)
      }
      return G__8929__delegate.call(this, args)
    };
    G__8929.cljs$lang$maxFixedArity = 0;
    G__8929.cljs$lang$applyTo = function(arglist__8930) {
      var args = cljs.core.seq(arglist__8930);
      return G__8929__delegate(args)
    };
    G__8929.cljs$lang$arity$variadic = G__8929__delegate;
    return G__8929
  }()
};
cljs.core.trampoline = function() {
  var trampoline = null;
  var trampoline__1 = function(f) {
    while(true) {
      var ret__8931 = f.call(null);
      if(cljs.core.fn_QMARK_.call(null, ret__8931)) {
        var G__8932 = ret__8931;
        f = G__8932;
        continue
      }else {
        return ret__8931
      }
      break
    }
  };
  var trampoline__2 = function() {
    var G__8933__delegate = function(f, args) {
      return trampoline.call(null, function() {
        return cljs.core.apply.call(null, f, args)
      })
    };
    var G__8933 = function(f, var_args) {
      var args = null;
      if(goog.isDef(var_args)) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
      }
      return G__8933__delegate.call(this, f, args)
    };
    G__8933.cljs$lang$maxFixedArity = 1;
    G__8933.cljs$lang$applyTo = function(arglist__8934) {
      var f = cljs.core.first(arglist__8934);
      var args = cljs.core.rest(arglist__8934);
      return G__8933__delegate(f, args)
    };
    G__8933.cljs$lang$arity$variadic = G__8933__delegate;
    return G__8933
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
    var k__8935 = f.call(null, x);
    return cljs.core.assoc.call(null, ret, k__8935, cljs.core.conj.call(null, cljs.core.get.call(null, ret, k__8935, cljs.core.PersistentVector.fromArray([])), x))
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
    var or__138__auto____8936 = cljs.core._EQ_.call(null, child, parent);
    if(or__138__auto____8936) {
      return or__138__auto____8936
    }else {
      var or__138__auto____8937 = cljs.core.contains_QMARK_.call(null, "\ufdd0'ancestors".call(null, h).call(null, child), parent);
      if(or__138__auto____8937) {
        return or__138__auto____8937
      }else {
        var and__132__auto____8938 = cljs.core.vector_QMARK_.call(null, parent);
        if(and__132__auto____8938) {
          var and__132__auto____8939 = cljs.core.vector_QMARK_.call(null, child);
          if(and__132__auto____8939) {
            var and__132__auto____8940 = cljs.core.count.call(null, parent) === cljs.core.count.call(null, child);
            if(and__132__auto____8940) {
              var ret__8941 = true;
              var i__8942 = 0;
              while(true) {
                if(function() {
                  var or__138__auto____8943 = cljs.core.not.call(null, ret__8941);
                  if(or__138__auto____8943) {
                    return or__138__auto____8943
                  }else {
                    return i__8942 === cljs.core.count.call(null, parent)
                  }
                }()) {
                  return ret__8941
                }else {
                  var G__8944 = isa_QMARK_.call(null, h, child.call(null, i__8942), parent.call(null, i__8942));
                  var G__8945 = i__8942 + 1;
                  ret__8941 = G__8944;
                  i__8942 = G__8945;
                  continue
                }
                break
              }
            }else {
              return and__132__auto____8940
            }
          }else {
            return and__132__auto____8939
          }
        }else {
          return and__132__auto____8938
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
    var tp__8949 = "\ufdd0'parents".call(null, h);
    var td__8950 = "\ufdd0'descendants".call(null, h);
    var ta__8951 = "\ufdd0'ancestors".call(null, h);
    var tf__8952 = function(m, source, sources, target, targets) {
      return cljs.core.reduce.call(null, function(ret, k) {
        return cljs.core.assoc.call(null, ret, k, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.get.call(null, targets, k, cljs.core.set([])), cljs.core.cons.call(null, target, targets.call(null, target))))
      }, m, cljs.core.cons.call(null, source, sources.call(null, source)))
    };
    var or__138__auto____8953 = cljs.core.contains_QMARK_.call(null, tp__8949.call(null, tag), parent) ? null : function() {
      if(cljs.core.contains_QMARK_.call(null, ta__8951.call(null, tag), parent)) {
        throw new Error([cljs.core.str(tag), cljs.core.str("already has"), cljs.core.str(parent), cljs.core.str("as ancestor")].join(""));
      }else {
      }
      if(cljs.core.contains_QMARK_.call(null, ta__8951.call(null, parent), tag)) {
        throw new Error([cljs.core.str("Cyclic derivation:"), cljs.core.str(parent), cljs.core.str("has"), cljs.core.str(tag), cljs.core.str("as ancestor")].join(""));
      }else {
      }
      return cljs.core.ObjMap.fromObject(["\ufdd0'parents", "\ufdd0'ancestors", "\ufdd0'descendants"], {"\ufdd0'parents":cljs.core.assoc.call(null, "\ufdd0'parents".call(null, h), tag, cljs.core.conj.call(null, cljs.core.get.call(null, tp__8949, tag, cljs.core.set([])), parent)), "\ufdd0'ancestors":tf__8952.call(null, "\ufdd0'ancestors".call(null, h), tag, td__8950, parent, ta__8951), "\ufdd0'descendants":tf__8952.call(null, "\ufdd0'descendants".call(null, h), parent, ta__8951, tag, td__8950)})
    }();
    if(cljs.core.truth_(or__138__auto____8953)) {
      return or__138__auto____8953
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
    var parentMap__8954 = "\ufdd0'parents".call(null, h);
    var childsParents__8955 = cljs.core.truth_(parentMap__8954.call(null, tag)) ? cljs.core.disj.call(null, parentMap__8954.call(null, tag), parent) : cljs.core.set([]);
    var newParents__8956 = cljs.core.truth_(cljs.core.not_empty.call(null, childsParents__8955)) ? cljs.core.assoc.call(null, parentMap__8954, tag, childsParents__8955) : cljs.core.dissoc.call(null, parentMap__8954, tag);
    var deriv_seq__8957 = cljs.core.flatten.call(null, cljs.core.map.call(null, function(p1__8946_SHARP_) {
      return cljs.core.cons.call(null, cljs.core.first.call(null, p1__8946_SHARP_), cljs.core.interpose.call(null, cljs.core.first.call(null, p1__8946_SHARP_), cljs.core.second.call(null, p1__8946_SHARP_)))
    }, cljs.core.seq.call(null, newParents__8956)));
    if(cljs.core.contains_QMARK_.call(null, parentMap__8954.call(null, tag), parent)) {
      return cljs.core.reduce.call(null, function(p1__8947_SHARP_, p2__8948_SHARP_) {
        return cljs.core.apply.call(null, cljs.core.derive, p1__8947_SHARP_, p2__8948_SHARP_)
      }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, deriv_seq__8957))
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
  var xprefs__8958 = cljs.core.deref.call(null, prefer_table).call(null, x);
  var or__138__auto____8960 = cljs.core.truth_(function() {
    var and__132__auto____8959 = xprefs__8958;
    if(cljs.core.truth_(and__132__auto____8959)) {
      return xprefs__8958.call(null, y)
    }else {
      return and__132__auto____8959
    }
  }()) ? true : null;
  if(cljs.core.truth_(or__138__auto____8960)) {
    return or__138__auto____8960
  }else {
    var or__138__auto____8962 = function() {
      var ps__8961 = cljs.core.parents.call(null, y);
      while(true) {
        if(cljs.core.count.call(null, ps__8961) > 0) {
          if(cljs.core.truth_(prefers_STAR_.call(null, x, cljs.core.first.call(null, ps__8961), prefer_table))) {
          }else {
          }
          var G__8965 = cljs.core.rest.call(null, ps__8961);
          ps__8961 = G__8965;
          continue
        }else {
          return null
        }
        break
      }
    }();
    if(cljs.core.truth_(or__138__auto____8962)) {
      return or__138__auto____8962
    }else {
      var or__138__auto____8964 = function() {
        var ps__8963 = cljs.core.parents.call(null, x);
        while(true) {
          if(cljs.core.count.call(null, ps__8963) > 0) {
            if(cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, ps__8963), y, prefer_table))) {
            }else {
            }
            var G__8966 = cljs.core.rest.call(null, ps__8963);
            ps__8963 = G__8966;
            continue
          }else {
            return null
          }
          break
        }
      }();
      if(cljs.core.truth_(or__138__auto____8964)) {
        return or__138__auto____8964
      }else {
        return false
      }
    }
  }
};
cljs.core.dominates = function dominates(x, y, prefer_table) {
  var or__138__auto____8967 = cljs.core.prefers_STAR_.call(null, x, y, prefer_table);
  if(cljs.core.truth_(or__138__auto____8967)) {
    return or__138__auto____8967
  }else {
    return cljs.core.isa_QMARK_.call(null, x, y)
  }
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  var best_entry__8976 = cljs.core.reduce.call(null, function(be, p__8968) {
    var vec__8969__8970 = p__8968;
    var k__8971 = cljs.core.nth.call(null, vec__8969__8970, 0, null);
    var ___8972 = cljs.core.nth.call(null, vec__8969__8970, 1, null);
    var e__8973 = vec__8969__8970;
    if(cljs.core.isa_QMARK_.call(null, dispatch_val, k__8971)) {
      var be2__8975 = cljs.core.truth_(function() {
        var or__138__auto____8974 = be == null;
        if(or__138__auto____8974) {
          return or__138__auto____8974
        }else {
          return cljs.core.dominates.call(null, k__8971, cljs.core.first.call(null, be), prefer_table)
        }
      }()) ? e__8973 : be;
      if(cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, be2__8975), k__8971, prefer_table))) {
      }else {
        throw new Error([cljs.core.str("Multiple methods in multimethod '"), cljs.core.str(name), cljs.core.str("' match dispatch value: "), cljs.core.str(dispatch_val), cljs.core.str(" -> "), cljs.core.str(k__8971), cljs.core.str(" and "), cljs.core.str(cljs.core.first.call(null, be2__8975)), cljs.core.str(", and neither is preferred")].join(""));
      }
      return be2__8975
    }else {
      return be
    }
  }, null, cljs.core.deref.call(null, method_table));
  if(cljs.core.truth_(best_entry__8976)) {
    if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, cached_hierarchy), cljs.core.deref.call(null, hierarchy))) {
      cljs.core.swap_BANG_.call(null, method_cache, cljs.core.assoc, dispatch_val, cljs.core.second.call(null, best_entry__8976));
      return cljs.core.second.call(null, best_entry__8976)
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
    var and__132__auto____8977 = mf;
    if(and__132__auto____8977) {
      return mf.cljs$core$IMultiFn$_reset$arity$1
    }else {
      return and__132__auto____8977
    }
  }()) {
    return mf.cljs$core$IMultiFn$_reset$arity$1(mf)
  }else {
    return function() {
      var or__138__auto____8978 = cljs.core._reset[goog.typeOf.call(null, mf)];
      if(or__138__auto____8978) {
        return or__138__auto____8978
      }else {
        var or__138__auto____8979 = cljs.core._reset["_"];
        if(or__138__auto____8979) {
          return or__138__auto____8979
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._add_method = function _add_method(mf, dispatch_val, method) {
  if(function() {
    var and__132__auto____8980 = mf;
    if(and__132__auto____8980) {
      return mf.cljs$core$IMultiFn$_add_method$arity$3
    }else {
      return and__132__auto____8980
    }
  }()) {
    return mf.cljs$core$IMultiFn$_add_method$arity$3(mf, dispatch_val, method)
  }else {
    return function() {
      var or__138__auto____8981 = cljs.core._add_method[goog.typeOf.call(null, mf)];
      if(or__138__auto____8981) {
        return or__138__auto____8981
      }else {
        var or__138__auto____8982 = cljs.core._add_method["_"];
        if(or__138__auto____8982) {
          return or__138__auto____8982
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, method)
  }
};
cljs.core._remove_method = function _remove_method(mf, dispatch_val) {
  if(function() {
    var and__132__auto____8983 = mf;
    if(and__132__auto____8983) {
      return mf.cljs$core$IMultiFn$_remove_method$arity$2
    }else {
      return and__132__auto____8983
    }
  }()) {
    return mf.cljs$core$IMultiFn$_remove_method$arity$2(mf, dispatch_val)
  }else {
    return function() {
      var or__138__auto____8984 = cljs.core._remove_method[goog.typeOf.call(null, mf)];
      if(or__138__auto____8984) {
        return or__138__auto____8984
      }else {
        var or__138__auto____8985 = cljs.core._remove_method["_"];
        if(or__138__auto____8985) {
          return or__138__auto____8985
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._prefer_method = function _prefer_method(mf, dispatch_val, dispatch_val_y) {
  if(function() {
    var and__132__auto____8986 = mf;
    if(and__132__auto____8986) {
      return mf.cljs$core$IMultiFn$_prefer_method$arity$3
    }else {
      return and__132__auto____8986
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefer_method$arity$3(mf, dispatch_val, dispatch_val_y)
  }else {
    return function() {
      var or__138__auto____8987 = cljs.core._prefer_method[goog.typeOf.call(null, mf)];
      if(or__138__auto____8987) {
        return or__138__auto____8987
      }else {
        var or__138__auto____8988 = cljs.core._prefer_method["_"];
        if(or__138__auto____8988) {
          return or__138__auto____8988
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, dispatch_val_y)
  }
};
cljs.core._get_method = function _get_method(mf, dispatch_val) {
  if(function() {
    var and__132__auto____8989 = mf;
    if(and__132__auto____8989) {
      return mf.cljs$core$IMultiFn$_get_method$arity$2
    }else {
      return and__132__auto____8989
    }
  }()) {
    return mf.cljs$core$IMultiFn$_get_method$arity$2(mf, dispatch_val)
  }else {
    return function() {
      var or__138__auto____8990 = cljs.core._get_method[goog.typeOf.call(null, mf)];
      if(or__138__auto____8990) {
        return or__138__auto____8990
      }else {
        var or__138__auto____8991 = cljs.core._get_method["_"];
        if(or__138__auto____8991) {
          return or__138__auto____8991
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", mf);
        }
      }
    }().call(null, mf, dispatch_val)
  }
};
cljs.core._methods = function _methods(mf) {
  if(function() {
    var and__132__auto____8992 = mf;
    if(and__132__auto____8992) {
      return mf.cljs$core$IMultiFn$_methods$arity$1
    }else {
      return and__132__auto____8992
    }
  }()) {
    return mf.cljs$core$IMultiFn$_methods$arity$1(mf)
  }else {
    return function() {
      var or__138__auto____8993 = cljs.core._methods[goog.typeOf.call(null, mf)];
      if(or__138__auto____8993) {
        return or__138__auto____8993
      }else {
        var or__138__auto____8994 = cljs.core._methods["_"];
        if(or__138__auto____8994) {
          return or__138__auto____8994
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._prefers = function _prefers(mf) {
  if(function() {
    var and__132__auto____8995 = mf;
    if(and__132__auto____8995) {
      return mf.cljs$core$IMultiFn$_prefers$arity$1
    }else {
      return and__132__auto____8995
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefers$arity$1(mf)
  }else {
    return function() {
      var or__138__auto____8996 = cljs.core._prefers[goog.typeOf.call(null, mf)];
      if(or__138__auto____8996) {
        return or__138__auto____8996
      }else {
        var or__138__auto____8997 = cljs.core._prefers["_"];
        if(or__138__auto____8997) {
          return or__138__auto____8997
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", mf);
        }
      }
    }().call(null, mf)
  }
};
cljs.core._dispatch = function _dispatch(mf, args) {
  if(function() {
    var and__132__auto____8998 = mf;
    if(and__132__auto____8998) {
      return mf.cljs$core$IMultiFn$_dispatch$arity$2
    }else {
      return and__132__auto____8998
    }
  }()) {
    return mf.cljs$core$IMultiFn$_dispatch$arity$2(mf, args)
  }else {
    return function() {
      var or__138__auto____8999 = cljs.core._dispatch[goog.typeOf.call(null, mf)];
      if(or__138__auto____8999) {
        return or__138__auto____8999
      }else {
        var or__138__auto____9000 = cljs.core._dispatch["_"];
        if(or__138__auto____9000) {
          return or__138__auto____9000
        }else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", mf);
        }
      }
    }().call(null, mf, args)
  }
};
void 0;
cljs.core.do_dispatch = function do_dispatch(mf, dispatch_fn, args) {
  var dispatch_val__9001 = cljs.core.apply.call(null, dispatch_fn, args);
  var target_fn__9002 = cljs.core._get_method.call(null, mf, dispatch_val__9001);
  if(cljs.core.truth_(target_fn__9002)) {
  }else {
    throw new Error([cljs.core.str("No method in multimethod '"), cljs.core.str(cljs.core.name), cljs.core.str("' for dispatch value: "), cljs.core.str(dispatch_val__9001)].join(""));
  }
  return cljs.core.apply.call(null, target_fn__9002, args)
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
  var this__9003 = this;
  return goog.getUid.call(null, this$)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$ = true;
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(mf) {
  var this__9004 = this;
  cljs.core.swap_BANG_.call(null, this__9004.method_table, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this__9004.method_cache, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this__9004.prefer_table, function(mf) {
    return cljs.core.ObjMap.fromObject([], {})
  });
  cljs.core.swap_BANG_.call(null, this__9004.cached_hierarchy, function(mf) {
    return null
  });
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(mf, dispatch_val, method) {
  var this__9005 = this;
  cljs.core.swap_BANG_.call(null, this__9005.method_table, cljs.core.assoc, dispatch_val, method);
  cljs.core.reset_cache.call(null, this__9005.method_cache, this__9005.method_table, this__9005.cached_hierarchy, this__9005.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(mf, dispatch_val) {
  var this__9006 = this;
  cljs.core.swap_BANG_.call(null, this__9006.method_table, cljs.core.dissoc, dispatch_val);
  cljs.core.reset_cache.call(null, this__9006.method_cache, this__9006.method_table, this__9006.cached_hierarchy, this__9006.hierarchy);
  return mf
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(mf, dispatch_val) {
  var this__9007 = this;
  if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, this__9007.cached_hierarchy), cljs.core.deref.call(null, this__9007.hierarchy))) {
  }else {
    cljs.core.reset_cache.call(null, this__9007.method_cache, this__9007.method_table, this__9007.cached_hierarchy, this__9007.hierarchy)
  }
  var temp__317__auto____9008 = cljs.core.deref.call(null, this__9007.method_cache).call(null, dispatch_val);
  if(cljs.core.truth_(temp__317__auto____9008)) {
    var target_fn__9009 = temp__317__auto____9008;
    return target_fn__9009
  }else {
    var temp__317__auto____9010 = cljs.core.find_and_cache_best_method.call(null, this__9007.name, dispatch_val, this__9007.hierarchy, this__9007.method_table, this__9007.prefer_table, this__9007.method_cache, this__9007.cached_hierarchy);
    if(cljs.core.truth_(temp__317__auto____9010)) {
      var target_fn__9011 = temp__317__auto____9010;
      return target_fn__9011
    }else {
      return cljs.core.deref.call(null, this__9007.method_table).call(null, this__9007.default_dispatch_val)
    }
  }
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(mf, dispatch_val_x, dispatch_val_y) {
  var this__9012 = this;
  if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null, dispatch_val_x, dispatch_val_y, this__9012.prefer_table))) {
    throw new Error([cljs.core.str("Preference conflict in multimethod '"), cljs.core.str(this__9012.name), cljs.core.str("': "), cljs.core.str(dispatch_val_y), cljs.core.str(" is already preferred to "), cljs.core.str(dispatch_val_x)].join(""));
  }else {
  }
  cljs.core.swap_BANG_.call(null, this__9012.prefer_table, function(old) {
    return cljs.core.assoc.call(null, old, dispatch_val_x, cljs.core.conj.call(null, cljs.core.get.call(null, old, dispatch_val_x, cljs.core.set([])), dispatch_val_y))
  });
  return cljs.core.reset_cache.call(null, this__9012.method_cache, this__9012.method_table, this__9012.cached_hierarchy, this__9012.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function(mf) {
  var this__9013 = this;
  return cljs.core.deref.call(null, this__9013.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function(mf) {
  var this__9014 = this;
  return cljs.core.deref.call(null, this__9014.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch$arity$2 = function(mf, args) {
  var this__9015 = this;
  return cljs.core.do_dispatch.call(null, mf, this__9015.dispatch_fn, args)
};
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = function() {
  var G__9016__delegate = function(_, args) {
    return cljs.core._dispatch.call(null, this, args)
  };
  var G__9016 = function(_, var_args) {
    var args = null;
    if(goog.isDef(var_args)) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return G__9016__delegate.call(this, _, args)
  };
  G__9016.cljs$lang$maxFixedArity = 1;
  G__9016.cljs$lang$applyTo = function(arglist__9017) {
    var _ = cljs.core.first(arglist__9017);
    var args = cljs.core.rest(arglist__9017);
    return G__9016__delegate(_, args)
  };
  G__9016.cljs$lang$arity$variadic = G__9016__delegate;
  return G__9016
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
      var s__9018 = s;
      var limit__9019 = limit;
      var parts__9020 = cljs.core.PersistentVector.fromArray([]);
      while(true) {
        if(cljs.core._EQ_.call(null, limit__9019, 1)) {
          return cljs.core.conj.call(null, parts__9020, s__9018)
        }else {
          var temp__317__auto____9021 = cljs.core.re_find.call(null, re, s__9018);
          if(cljs.core.truth_(temp__317__auto____9021)) {
            var m__9022 = temp__317__auto____9021;
            var index__9023 = s__9018.indexOf(m__9022);
            var G__9024 = s__9018.substring(index__9023 + cljs.core.count.call(null, m__9022));
            var G__9025 = limit__9019 - 1;
            var G__9026 = cljs.core.conj.call(null, parts__9020, s__9018.substring(0, index__9023));
            s__9018 = G__9024;
            limit__9019 = G__9025;
            parts__9020 = G__9026;
            continue
          }else {
            return cljs.core.conj.call(null, parts__9020, s__9018)
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
  var index__9027 = s.length;
  while(true) {
    if(index__9027 === 0) {
      return""
    }else {
      var ch__9028 = cljs.core.get.call(null, s, index__9027 - 1);
      if(function() {
        var or__138__auto____9029 = cljs.core._EQ_.call(null, ch__9028, "\n");
        if(or__138__auto____9029) {
          return or__138__auto____9029
        }else {
          return cljs.core._EQ_.call(null, ch__9028, "\r")
        }
      }()) {
        var G__9030 = index__9027 - 1;
        index__9027 = G__9030;
        continue
      }else {
        return s.substring(0, index__9027)
      }
    }
    break
  }
};
clojure.string.blank_QMARK_ = function blank_QMARK_(s) {
  var s__9031 = [cljs.core.str(s)].join("");
  if(cljs.core.truth_(function() {
    var or__138__auto____9032 = cljs.core.not.call(null, s__9031);
    if(or__138__auto____9032) {
      return or__138__auto____9032
    }else {
      var or__138__auto____9033 = cljs.core._EQ_.call(null, "", s__9031);
      if(or__138__auto____9033) {
        return or__138__auto____9033
      }else {
        return cljs.core.re_matches.call(null, /\s+/, s__9031)
      }
    }
  }())) {
    return true
  }else {
    return false
  }
};
clojure.string.escape = function escape(s, cmap) {
  var buffer__9034 = new goog.string.StringBuffer;
  var length__9035 = s.length;
  var index__9036 = 0;
  while(true) {
    if(cljs.core._EQ_.call(null, length__9035, index__9036)) {
      return buffer__9034.toString()
    }else {
      var ch__9037 = s.charAt(index__9036);
      var temp__317__auto____9038 = cljs.core.get.call(null, cmap, ch__9037);
      if(cljs.core.truth_(temp__317__auto____9038)) {
        var replacement__9039 = temp__317__auto____9038;
        buffer__9034.append([cljs.core.str(replacement__9039)].join(""))
      }else {
        buffer__9034.append(ch__9037)
      }
      var G__9040 = index__9036 + 1;
      index__9036 = G__9040;
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
    var and__132__auto____9113 = this$;
    if(and__132__auto____9113) {
      return this$.clojure$browser$event$EventType$event_types$arity$1
    }else {
      return and__132__auto____9113
    }
  }()) {
    return this$.clojure$browser$event$EventType$event_types$arity$1(this$)
  }else {
    return function() {
      var or__138__auto____9114 = clojure.browser.event.event_types[goog.typeOf.call(null, this$)];
      if(or__138__auto____9114) {
        return or__138__auto____9114
      }else {
        var or__138__auto____9115 = clojure.browser.event.event_types["_"];
        if(or__138__auto____9115) {
          return or__138__auto____9115
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
  return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__9116) {
    var vec__9117__9118 = p__9116;
    var k__9119 = cljs.core.nth.call(null, vec__9117__9118, 0, null);
    var v__9120 = cljs.core.nth.call(null, vec__9117__9118, 1, null);
    return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__9119.toLowerCase()), v__9120])
  }, cljs.core.merge.call(null, cljs.core.js__GT_clj.call(null, goog.events.EventType))))
};
goog.events.EventTarget.prototype.clojure$browser$event$EventType$ = true;
goog.events.EventTarget.prototype.clojure$browser$event$EventType$event_types$arity$1 = function(this$) {
  return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__9121) {
    var vec__9122__9123 = p__9121;
    var k__9124 = cljs.core.nth.call(null, vec__9122__9123, 0, null);
    var v__9125 = cljs.core.nth.call(null, vec__9122__9123, 1, null);
    return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__9124.toLowerCase()), v__9125])
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
clojure.browser.net.event_types = cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__9051) {
  var vec__9052__9053 = p__9051;
  var k__9054 = cljs.core.nth.call(null, vec__9052__9053, 0, null);
  var v__9055 = cljs.core.nth.call(null, vec__9052__9053, 1, null);
  return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__9054.toLowerCase()), v__9055])
}, cljs.core.merge.call(null, cljs.core.js__GT_clj.call(null, goog.net.EventType))));
void 0;
clojure.browser.net.IConnection = {};
clojure.browser.net.connect = function() {
  var connect = null;
  var connect__1 = function(this$) {
    if(function() {
      var and__132__auto____9056 = this$;
      if(and__132__auto____9056) {
        return this$.clojure$browser$net$IConnection$connect$arity$1
      }else {
        return and__132__auto____9056
      }
    }()) {
      return this$.clojure$browser$net$IConnection$connect$arity$1(this$)
    }else {
      return function() {
        var or__138__auto____9057 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(or__138__auto____9057) {
          return or__138__auto____9057
        }else {
          var or__138__auto____9058 = clojure.browser.net.connect["_"];
          if(or__138__auto____9058) {
            return or__138__auto____9058
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$)
    }
  };
  var connect__2 = function(this$, opt1) {
    if(function() {
      var and__132__auto____9059 = this$;
      if(and__132__auto____9059) {
        return this$.clojure$browser$net$IConnection$connect$arity$2
      }else {
        return and__132__auto____9059
      }
    }()) {
      return this$.clojure$browser$net$IConnection$connect$arity$2(this$, opt1)
    }else {
      return function() {
        var or__138__auto____9060 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(or__138__auto____9060) {
          return or__138__auto____9060
        }else {
          var or__138__auto____9061 = clojure.browser.net.connect["_"];
          if(or__138__auto____9061) {
            return or__138__auto____9061
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$, opt1)
    }
  };
  var connect__3 = function(this$, opt1, opt2) {
    if(function() {
      var and__132__auto____9062 = this$;
      if(and__132__auto____9062) {
        return this$.clojure$browser$net$IConnection$connect$arity$3
      }else {
        return and__132__auto____9062
      }
    }()) {
      return this$.clojure$browser$net$IConnection$connect$arity$3(this$, opt1, opt2)
    }else {
      return function() {
        var or__138__auto____9063 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(or__138__auto____9063) {
          return or__138__auto____9063
        }else {
          var or__138__auto____9064 = clojure.browser.net.connect["_"];
          if(or__138__auto____9064) {
            return or__138__auto____9064
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.connect", this$);
          }
        }
      }().call(null, this$, opt1, opt2)
    }
  };
  var connect__4 = function(this$, opt1, opt2, opt3) {
    if(function() {
      var and__132__auto____9065 = this$;
      if(and__132__auto____9065) {
        return this$.clojure$browser$net$IConnection$connect$arity$4
      }else {
        return and__132__auto____9065
      }
    }()) {
      return this$.clojure$browser$net$IConnection$connect$arity$4(this$, opt1, opt2, opt3)
    }else {
      return function() {
        var or__138__auto____9066 = clojure.browser.net.connect[goog.typeOf.call(null, this$)];
        if(or__138__auto____9066) {
          return or__138__auto____9066
        }else {
          var or__138__auto____9067 = clojure.browser.net.connect["_"];
          if(or__138__auto____9067) {
            return or__138__auto____9067
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
      var and__132__auto____9068 = this$;
      if(and__132__auto____9068) {
        return this$.clojure$browser$net$IConnection$transmit$arity$2
      }else {
        return and__132__auto____9068
      }
    }()) {
      return this$.clojure$browser$net$IConnection$transmit$arity$2(this$, opt)
    }else {
      return function() {
        var or__138__auto____9069 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(or__138__auto____9069) {
          return or__138__auto____9069
        }else {
          var or__138__auto____9070 = clojure.browser.net.transmit["_"];
          if(or__138__auto____9070) {
            return or__138__auto____9070
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt)
    }
  };
  var transmit__3 = function(this$, opt, opt2) {
    if(function() {
      var and__132__auto____9071 = this$;
      if(and__132__auto____9071) {
        return this$.clojure$browser$net$IConnection$transmit$arity$3
      }else {
        return and__132__auto____9071
      }
    }()) {
      return this$.clojure$browser$net$IConnection$transmit$arity$3(this$, opt, opt2)
    }else {
      return function() {
        var or__138__auto____9072 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(or__138__auto____9072) {
          return or__138__auto____9072
        }else {
          var or__138__auto____9073 = clojure.browser.net.transmit["_"];
          if(or__138__auto____9073) {
            return or__138__auto____9073
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2)
    }
  };
  var transmit__4 = function(this$, opt, opt2, opt3) {
    if(function() {
      var and__132__auto____9074 = this$;
      if(and__132__auto____9074) {
        return this$.clojure$browser$net$IConnection$transmit$arity$4
      }else {
        return and__132__auto____9074
      }
    }()) {
      return this$.clojure$browser$net$IConnection$transmit$arity$4(this$, opt, opt2, opt3)
    }else {
      return function() {
        var or__138__auto____9075 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(or__138__auto____9075) {
          return or__138__auto____9075
        }else {
          var or__138__auto____9076 = clojure.browser.net.transmit["_"];
          if(or__138__auto____9076) {
            return or__138__auto____9076
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2, opt3)
    }
  };
  var transmit__5 = function(this$, opt, opt2, opt3, opt4) {
    if(function() {
      var and__132__auto____9077 = this$;
      if(and__132__auto____9077) {
        return this$.clojure$browser$net$IConnection$transmit$arity$5
      }else {
        return and__132__auto____9077
      }
    }()) {
      return this$.clojure$browser$net$IConnection$transmit$arity$5(this$, opt, opt2, opt3, opt4)
    }else {
      return function() {
        var or__138__auto____9078 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(or__138__auto____9078) {
          return or__138__auto____9078
        }else {
          var or__138__auto____9079 = clojure.browser.net.transmit["_"];
          if(or__138__auto____9079) {
            return or__138__auto____9079
          }else {
            throw cljs.core.missing_protocol.call(null, "IConnection.transmit", this$);
          }
        }
      }().call(null, this$, opt, opt2, opt3, opt4)
    }
  };
  var transmit__6 = function(this$, opt, opt2, opt3, opt4, opt5) {
    if(function() {
      var and__132__auto____9080 = this$;
      if(and__132__auto____9080) {
        return this$.clojure$browser$net$IConnection$transmit$arity$6
      }else {
        return and__132__auto____9080
      }
    }()) {
      return this$.clojure$browser$net$IConnection$transmit$arity$6(this$, opt, opt2, opt3, opt4, opt5)
    }else {
      return function() {
        var or__138__auto____9081 = clojure.browser.net.transmit[goog.typeOf.call(null, this$)];
        if(or__138__auto____9081) {
          return or__138__auto____9081
        }else {
          var or__138__auto____9082 = clojure.browser.net.transmit["_"];
          if(or__138__auto____9082) {
            return or__138__auto____9082
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
    var and__132__auto____9083 = this$;
    if(and__132__auto____9083) {
      return this$.clojure$browser$net$IConnection$close$arity$1
    }else {
      return and__132__auto____9083
    }
  }()) {
    return this$.clojure$browser$net$IConnection$close$arity$1(this$)
  }else {
    return function() {
      var or__138__auto____9084 = clojure.browser.net.close[goog.typeOf.call(null, this$)];
      if(or__138__auto____9084) {
        return or__138__auto____9084
      }else {
        var or__138__auto____9085 = clojure.browser.net.close["_"];
        if(or__138__auto____9085) {
          return or__138__auto____9085
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
  return cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__9086) {
    var vec__9087__9088 = p__9086;
    var k__9089 = cljs.core.nth.call(null, vec__9087__9088, 0, null);
    var v__9090 = cljs.core.nth.call(null, vec__9087__9088, 1, null);
    return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__9089.toLowerCase()), v__9090])
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
clojure.browser.net.xpc_config_fields = cljs.core.into.call(null, cljs.core.ObjMap.fromObject([], {}), cljs.core.map.call(null, function(p__9091) {
  var vec__9092__9093 = p__9091;
  var k__9094 = cljs.core.nth.call(null, vec__9092__9093, 0, null);
  var v__9095 = cljs.core.nth.call(null, vec__9092__9093, 1, null);
  return cljs.core.PersistentVector.fromArray([cljs.core.keyword.call(null, k__9094.toLowerCase()), v__9095])
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
      var and__132__auto____9096 = this$;
      if(and__132__auto____9096) {
        return this$.clojure$browser$net$ICrossPageChannel$register_service$arity$3
      }else {
        return and__132__auto____9096
      }
    }()) {
      return this$.clojure$browser$net$ICrossPageChannel$register_service$arity$3(this$, service_name, fn)
    }else {
      return function() {
        var or__138__auto____9097 = clojure.browser.net.register_service[goog.typeOf.call(null, this$)];
        if(or__138__auto____9097) {
          return or__138__auto____9097
        }else {
          var or__138__auto____9098 = clojure.browser.net.register_service["_"];
          if(or__138__auto____9098) {
            return or__138__auto____9098
          }else {
            throw cljs.core.missing_protocol.call(null, "ICrossPageChannel.register-service", this$);
          }
        }
      }().call(null, this$, service_name, fn)
    }
  };
  var register_service__4 = function(this$, service_name, fn, encode_json_QMARK_) {
    if(function() {
      var and__132__auto____9099 = this$;
      if(and__132__auto____9099) {
        return this$.clojure$browser$net$ICrossPageChannel$register_service$arity$4
      }else {
        return and__132__auto____9099
      }
    }()) {
      return this$.clojure$browser$net$ICrossPageChannel$register_service$arity$4(this$, service_name, fn, encode_json_QMARK_)
    }else {
      return function() {
        var or__138__auto____9100 = clojure.browser.net.register_service[goog.typeOf.call(null, this$)];
        if(or__138__auto____9100) {
          return or__138__auto____9100
        }else {
          var or__138__auto____9101 = clojure.browser.net.register_service["_"];
          if(or__138__auto____9101) {
            return or__138__auto____9101
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
    var temp__324__auto____9102 = (new goog.Uri(window.location.href)).getParameterValue("xpc");
    if(cljs.core.truth_(temp__324__auto____9102)) {
      var config__9103 = temp__324__auto____9102;
      return new goog.net.xpc.CrossPageChannel(goog.json.parse.call(null, config__9103))
    }else {
      return null
    }
  };
  var xpc_connection__1 = function(config) {
    return new goog.net.xpc.CrossPageChannel(cljs.core.reduce.call(null, function(sum, p__9104) {
      var vec__9105__9106 = p__9104;
      var k__9107 = cljs.core.nth.call(null, vec__9105__9106, 0, null);
      var v__9108 = cljs.core.nth.call(null, vec__9105__9106, 1, null);
      var temp__317__auto____9109 = cljs.core.get.call(null, clojure.browser.net.xpc_config_fields, k__9107);
      if(cljs.core.truth_(temp__317__auto____9109)) {
        var field__9110 = temp__317__auto____9109;
        var G__9111__9112 = sum;
        G__9111__9112[field__9110] = v__9108;
        return G__9111__9112
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
  var temp__317__auto____9041 = cljs.core.deref.call(null, clojure.browser.repl.xpc_connection);
  if(cljs.core.truth_(temp__317__auto____9041)) {
    var conn__9042 = temp__317__auto____9041;
    return clojure.browser.net.transmit.call(null, conn__9042, "\ufdd0'print", cljs.core.pr_str.call(null, data))
  }else {
    return null
  }
};
clojure.browser.repl.evaluate_javascript = function evaluate_javascript(conn, block) {
  var result__9045 = function() {
    try {
      return cljs.core.ObjMap.fromObject(["\ufdd0'status", "\ufdd0'value"], {"\ufdd0'status":"\ufdd0'success", "\ufdd0'value":[cljs.core.str(eval(block))].join("")})
    }catch(e9043) {
      if(cljs.core.instance_QMARK_.call(null, Error, e9043)) {
        var e__9044 = e9043;
        return cljs.core.ObjMap.fromObject(["\ufdd0'status", "\ufdd0'value", "\ufdd0'stacktrace"], {"\ufdd0'status":"\ufdd0'exception", "\ufdd0'value":cljs.core.pr_str.call(null, e__9044), "\ufdd0'stacktrace":cljs.core.truth_(e__9044.hasOwnProperty("stack")) ? e__9044.stack : "No stacktrace available."})
      }else {
        if("\ufdd0'else") {
          throw e9043;
        }else {
          return null
        }
      }
    }
  }();
  return cljs.core.pr_str.call(null, result__9045)
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
    var conn__9046 = clojure.browser.net.xhr_connection.call(null);
    clojure.browser.event.listen.call(null, conn__9046, "\ufdd0'error", function(_) {
      if(n < 10) {
        return send_print.call(null, url, data, n + 1)
      }else {
        return console.log([cljs.core.str("Could not send "), cljs.core.str(data), cljs.core.str(" after "), cljs.core.str(n), cljs.core.str(" attempts.")].join(""))
      }
    });
    return clojure.browser.net.transmit.call(null, conn__9046, url, "POST", data, null, 0)
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
  var temp__317__auto____9047 = clojure.browser.net.xpc_connection.call(null);
  if(cljs.core.truth_(temp__317__auto____9047)) {
    var repl_connection__9048 = temp__317__auto____9047;
    var connection__9049 = clojure.browser.net.xhr_connection.call(null);
    clojure.browser.event.listen.call(null, connection__9049, "\ufdd0'success", function(e) {
      return clojure.browser.net.transmit.call(null, repl_connection__9048, "\ufdd0'evaluate-javascript", e.currentTarget.getResponseText(cljs.core.List.EMPTY))
    });
    clojure.browser.net.register_service.call(null, repl_connection__9048, "\ufdd0'send-result", function(data) {
      return clojure.browser.repl.send_result.call(null, connection__9049, url, clojure.browser.repl.wrap_message.call(null, "\ufdd0'result", data))
    });
    clojure.browser.net.register_service.call(null, repl_connection__9048, "\ufdd0'print", function(data) {
      return clojure.browser.repl.send_print.call(null, url, clojure.browser.repl.wrap_message.call(null, "\ufdd0'print", data))
    });
    clojure.browser.net.connect.call(null, repl_connection__9048, cljs.core.constantly.call(null, null));
    return setTimeout(function() {
      return clojure.browser.repl.send_result.call(null, connection__9049, url, clojure.browser.repl.wrap_message.call(null, "\ufdd0'ready", "ready"))
    }, 50)
  }else {
    return alert("No 'xpc' param provided to child iframe.")
  }
};
clojure.browser.repl.connect = function connect(repl_server_url) {
  var repl_connection__9050 = clojure.browser.net.xpc_connection.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'peer_uri"], {"\ufdd0'peer_uri":repl_server_url}));
  cljs.core.swap_BANG_.call(null, clojure.browser.repl.xpc_connection, cljs.core.constantly.call(null, repl_connection__9050));
  clojure.browser.net.register_service.call(null, repl_connection__9050, "\ufdd0'evaluate-javascript", function(js) {
    return clojure.browser.net.transmit.call(null, repl_connection__9050, "\ufdd0'send-result", clojure.browser.repl.evaluate_javascript.call(null, repl_connection__9050, js))
  });
  return clojure.browser.net.connect.call(null, repl_connection__9050, cljs.core.constantly.call(null, null), function(iframe) {
    return iframe.style.display = "none"
  })
};
goog.provide("jayq.util");
goog.require("cljs.core");
jayq.util.map__GT_js = function map__GT_js(m) {
  var out__9234 = {};
  var G__9235__9236 = cljs.core.seq.call(null, m);
  if(cljs.core.truth_(G__9235__9236)) {
    var G__9238__9240 = cljs.core.first.call(null, G__9235__9236);
    var vec__9239__9241 = G__9238__9240;
    var k__9242 = cljs.core.nth.call(null, vec__9239__9241, 0, null);
    var v__9243 = cljs.core.nth.call(null, vec__9239__9241, 1, null);
    var G__9235__9244 = G__9235__9236;
    var G__9238__9245 = G__9238__9240;
    var G__9235__9246 = G__9235__9244;
    while(true) {
      var vec__9247__9248 = G__9238__9245;
      var k__9249 = cljs.core.nth.call(null, vec__9247__9248, 0, null);
      var v__9250 = cljs.core.nth.call(null, vec__9247__9248, 1, null);
      var G__9235__9251 = G__9235__9246;
      out__9234[cljs.core.name.call(null, k__9249)] = v__9250;
      var temp__324__auto____9252 = cljs.core.next.call(null, G__9235__9251);
      if(cljs.core.truth_(temp__324__auto____9252)) {
        var G__9235__9253 = temp__324__auto____9252;
        var G__9254 = cljs.core.first.call(null, G__9235__9253);
        var G__9255 = G__9235__9253;
        G__9238__9245 = G__9254;
        G__9235__9246 = G__9255;
        continue
      }else {
      }
      break
    }
  }else {
  }
  return out__9234
};
jayq.util.wait = function wait(ms, func) {
  return setTimeout(func, ms)
};
jayq.util.log = function() {
  var log__delegate = function(v, text) {
    var vs__9256 = cljs.core.string_QMARK_.call(null, v) ? cljs.core.apply.call(null, cljs.core.str, v, text) : v;
    return console.log(vs__9256)
  };
  var log = function(v, var_args) {
    var text = null;
    if(goog.isDef(var_args)) {
      text = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return log__delegate.call(this, v, text)
  };
  log.cljs$lang$maxFixedArity = 1;
  log.cljs$lang$applyTo = function(arglist__9257) {
    var v = cljs.core.first(arglist__9257);
    var text = cljs.core.rest(arglist__9257);
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
        return cljs.core.reduce.call(null, function(m, p__9258) {
          var vec__9259__9260 = p__9258;
          var k__9261 = cljs.core.nth.call(null, vec__9259__9260, 0, null);
          var v__9262 = cljs.core.nth.call(null, vec__9259__9260, 1, null);
          return cljs.core.assoc.call(null, m, clj__GT_js.call(null, k__9261), clj__GT_js.call(null, v__9262))
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
      var temp__317__auto____9126 = jayq.core.crate_meta.call(null, sel);
      if(cljs.core.truth_(temp__317__auto____9126)) {
        var cm__9127 = temp__317__auto____9126;
        return[cljs.core.str("[crateGroup="), cljs.core.str(cm__9127), cljs.core.str("]")].join("")
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
  var $__delegate = function(sel, p__9128) {
    var vec__9129__9130 = p__9128;
    var context__9131 = cljs.core.nth.call(null, vec__9129__9130, 0, null);
    if(cljs.core.not.call(null, context__9131)) {
      return jQuery(jayq.core.__GT_selector.call(null, sel))
    }else {
      return jQuery(jayq.core.__GT_selector.call(null, sel), context__9131)
    }
  };
  var $ = function(sel, var_args) {
    var p__9128 = null;
    if(goog.isDef(var_args)) {
      p__9128 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return $__delegate.call(this, sel, p__9128)
  };
  $.cljs$lang$maxFixedArity = 1;
  $.cljs$lang$applyTo = function(arglist__9132) {
    var sel = cljs.core.first(arglist__9132);
    var p__9128 = cljs.core.rest(arglist__9132);
    return $__delegate(sel, p__9128)
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
  var or__138__auto____9133 = this$.slice(k, k + 1);
  if(cljs.core.truth_(or__138__auto____9133)) {
    return or__138__auto____9133
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
  var G__9134 = null;
  var G__9134__2 = function(_, k) {
    return cljs.core._lookup.call(null, this, k)
  };
  var G__9134__3 = function(_, k, not_found) {
    return cljs.core._lookup.call(null, this, k, not_found)
  };
  G__9134 = function(_, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__9134__2.call(this, _, k);
      case 3:
        return G__9134__3.call(this, _, k, not_found)
    }
    throw"Invalid arity: " + arguments.length;
  };
  return G__9134
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
  var attr__delegate = function($elem, a, p__9135) {
    var vec__9136__9137 = p__9135;
    var v__9138 = cljs.core.nth.call(null, vec__9136__9137, 0, null);
    var a__9139 = cljs.core.name.call(null, a);
    if(cljs.core.not.call(null, v__9138)) {
      return $elem.attr(a__9139)
    }else {
      return $elem.attr(a__9139, v__9138)
    }
  };
  var attr = function($elem, a, var_args) {
    var p__9135 = null;
    if(goog.isDef(var_args)) {
      p__9135 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return attr__delegate.call(this, $elem, a, p__9135)
  };
  attr.cljs$lang$maxFixedArity = 2;
  attr.cljs$lang$applyTo = function(arglist__9140) {
    var $elem = cljs.core.first(arglist__9140);
    var a = cljs.core.first(cljs.core.next(arglist__9140));
    var p__9135 = cljs.core.rest(cljs.core.next(arglist__9140));
    return attr__delegate($elem, a, p__9135)
  };
  attr.cljs$lang$arity$variadic = attr__delegate;
  return attr
}();
jayq.core.remove_attr = function remove_attr($elem, a) {
  return $elem.removeAttr(cljs.core.name.call(null, a))
};
jayq.core.data = function() {
  var data__delegate = function($elem, k, p__9141) {
    var vec__9142__9143 = p__9141;
    var v__9144 = cljs.core.nth.call(null, vec__9142__9143, 0, null);
    var k__9145 = cljs.core.name.call(null, k);
    if(cljs.core.not.call(null, v__9144)) {
      return $elem.data(k__9145)
    }else {
      return $elem.data(k__9145, v__9144)
    }
  };
  var data = function($elem, k, var_args) {
    var p__9141 = null;
    if(goog.isDef(var_args)) {
      p__9141 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return data__delegate.call(this, $elem, k, p__9141)
  };
  data.cljs$lang$maxFixedArity = 2;
  data.cljs$lang$applyTo = function(arglist__9146) {
    var $elem = cljs.core.first(arglist__9146);
    var k = cljs.core.first(cljs.core.next(arglist__9146));
    var p__9141 = cljs.core.rest(cljs.core.next(arglist__9146));
    return data__delegate($elem, k, p__9141)
  };
  data.cljs$lang$arity$variadic = data__delegate;
  return data
}();
jayq.core.position = function position($elem) {
  return cljs.core.js__GT_clj.call(null, $elem.position(), "\ufdd0'keywordize-keys", true)
};
jayq.core.add_class = function add_class($elem, cl) {
  var cl__9147 = cljs.core.name.call(null, cl);
  return $elem.addClass(cl__9147)
};
jayq.core.remove_class = function remove_class($elem, cl) {
  var cl__9148 = cljs.core.name.call(null, cl);
  return $elem.removeClass(cl__9148)
};
jayq.core.toggle_class = function toggle_class($elem, cl) {
  var cl__9149 = cljs.core.name.call(null, cl);
  return $elem.toggleClass(cl__9149)
};
jayq.core.has_class = function has_class($elem, cl) {
  var cl__9150 = cljs.core.name.call(null, cl);
  return $elem.hasClass(cl__9150)
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
  var hide__delegate = function($elem, p__9151) {
    var vec__9152__9153 = p__9151;
    var speed__9154 = cljs.core.nth.call(null, vec__9152__9153, 0, null);
    var on_finish__9155 = cljs.core.nth.call(null, vec__9152__9153, 1, null);
    return $elem.hide(speed__9154, on_finish__9155)
  };
  var hide = function($elem, var_args) {
    var p__9151 = null;
    if(goog.isDef(var_args)) {
      p__9151 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return hide__delegate.call(this, $elem, p__9151)
  };
  hide.cljs$lang$maxFixedArity = 1;
  hide.cljs$lang$applyTo = function(arglist__9156) {
    var $elem = cljs.core.first(arglist__9156);
    var p__9151 = cljs.core.rest(arglist__9156);
    return hide__delegate($elem, p__9151)
  };
  hide.cljs$lang$arity$variadic = hide__delegate;
  return hide
}();
jayq.core.show = function() {
  var show__delegate = function($elem, p__9157) {
    var vec__9158__9159 = p__9157;
    var speed__9160 = cljs.core.nth.call(null, vec__9158__9159, 0, null);
    var on_finish__9161 = cljs.core.nth.call(null, vec__9158__9159, 1, null);
    return $elem.show(speed__9160, on_finish__9161)
  };
  var show = function($elem, var_args) {
    var p__9157 = null;
    if(goog.isDef(var_args)) {
      p__9157 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return show__delegate.call(this, $elem, p__9157)
  };
  show.cljs$lang$maxFixedArity = 1;
  show.cljs$lang$applyTo = function(arglist__9162) {
    var $elem = cljs.core.first(arglist__9162);
    var p__9157 = cljs.core.rest(arglist__9162);
    return show__delegate($elem, p__9157)
  };
  show.cljs$lang$arity$variadic = show__delegate;
  return show
}();
jayq.core.toggle = function() {
  var toggle__delegate = function($elem, p__9163) {
    var vec__9164__9165 = p__9163;
    var speed__9166 = cljs.core.nth.call(null, vec__9164__9165, 0, null);
    var on_finish__9167 = cljs.core.nth.call(null, vec__9164__9165, 1, null);
    return $elem.toggle(speed__9166, on_finish__9167)
  };
  var toggle = function($elem, var_args) {
    var p__9163 = null;
    if(goog.isDef(var_args)) {
      p__9163 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return toggle__delegate.call(this, $elem, p__9163)
  };
  toggle.cljs$lang$maxFixedArity = 1;
  toggle.cljs$lang$applyTo = function(arglist__9168) {
    var $elem = cljs.core.first(arglist__9168);
    var p__9163 = cljs.core.rest(arglist__9168);
    return toggle__delegate($elem, p__9163)
  };
  toggle.cljs$lang$arity$variadic = toggle__delegate;
  return toggle
}();
jayq.core.fade_out = function() {
  var fade_out__delegate = function($elem, p__9169) {
    var vec__9170__9171 = p__9169;
    var speed__9172 = cljs.core.nth.call(null, vec__9170__9171, 0, null);
    var on_finish__9173 = cljs.core.nth.call(null, vec__9170__9171, 1, null);
    return $elem.fadeOut(speed__9172, on_finish__9173)
  };
  var fade_out = function($elem, var_args) {
    var p__9169 = null;
    if(goog.isDef(var_args)) {
      p__9169 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return fade_out__delegate.call(this, $elem, p__9169)
  };
  fade_out.cljs$lang$maxFixedArity = 1;
  fade_out.cljs$lang$applyTo = function(arglist__9174) {
    var $elem = cljs.core.first(arglist__9174);
    var p__9169 = cljs.core.rest(arglist__9174);
    return fade_out__delegate($elem, p__9169)
  };
  fade_out.cljs$lang$arity$variadic = fade_out__delegate;
  return fade_out
}();
jayq.core.fade_in = function() {
  var fade_in__delegate = function($elem, p__9175) {
    var vec__9176__9177 = p__9175;
    var speed__9178 = cljs.core.nth.call(null, vec__9176__9177, 0, null);
    var on_finish__9179 = cljs.core.nth.call(null, vec__9176__9177, 1, null);
    return $elem.fadeIn(speed__9178, on_finish__9179)
  };
  var fade_in = function($elem, var_args) {
    var p__9175 = null;
    if(goog.isDef(var_args)) {
      p__9175 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return fade_in__delegate.call(this, $elem, p__9175)
  };
  fade_in.cljs$lang$maxFixedArity = 1;
  fade_in.cljs$lang$applyTo = function(arglist__9180) {
    var $elem = cljs.core.first(arglist__9180);
    var p__9175 = cljs.core.rest(arglist__9180);
    return fade_in__delegate($elem, p__9175)
  };
  fade_in.cljs$lang$arity$variadic = fade_in__delegate;
  return fade_in
}();
jayq.core.slide_up = function() {
  var slide_up__delegate = function($elem, p__9181) {
    var vec__9182__9183 = p__9181;
    var speed__9184 = cljs.core.nth.call(null, vec__9182__9183, 0, null);
    var on_finish__9185 = cljs.core.nth.call(null, vec__9182__9183, 1, null);
    return $elem.slideUp(speed__9184, on_finish__9185)
  };
  var slide_up = function($elem, var_args) {
    var p__9181 = null;
    if(goog.isDef(var_args)) {
      p__9181 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return slide_up__delegate.call(this, $elem, p__9181)
  };
  slide_up.cljs$lang$maxFixedArity = 1;
  slide_up.cljs$lang$applyTo = function(arglist__9186) {
    var $elem = cljs.core.first(arglist__9186);
    var p__9181 = cljs.core.rest(arglist__9186);
    return slide_up__delegate($elem, p__9181)
  };
  slide_up.cljs$lang$arity$variadic = slide_up__delegate;
  return slide_up
}();
jayq.core.slide_down = function() {
  var slide_down__delegate = function($elem, p__9187) {
    var vec__9188__9189 = p__9187;
    var speed__9190 = cljs.core.nth.call(null, vec__9188__9189, 0, null);
    var on_finish__9191 = cljs.core.nth.call(null, vec__9188__9189, 1, null);
    return $elem.slideDown(speed__9190, on_finish__9191)
  };
  var slide_down = function($elem, var_args) {
    var p__9187 = null;
    if(goog.isDef(var_args)) {
      p__9187 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return slide_down__delegate.call(this, $elem, p__9187)
  };
  slide_down.cljs$lang$maxFixedArity = 1;
  slide_down.cljs$lang$applyTo = function(arglist__9192) {
    var $elem = cljs.core.first(arglist__9192);
    var p__9187 = cljs.core.rest(arglist__9192);
    return slide_down__delegate($elem, p__9187)
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
  var closest__delegate = function($elem, selector, p__9193) {
    var vec__9194__9195 = p__9193;
    var context__9196 = cljs.core.nth.call(null, vec__9194__9195, 0, null);
    return $elem.closest(selector, context__9196)
  };
  var closest = function($elem, selector, var_args) {
    var p__9193 = null;
    if(goog.isDef(var_args)) {
      p__9193 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return closest__delegate.call(this, $elem, selector, p__9193)
  };
  closest.cljs$lang$maxFixedArity = 2;
  closest.cljs$lang$applyTo = function(arglist__9197) {
    var $elem = cljs.core.first(arglist__9197);
    var selector = cljs.core.first(cljs.core.next(arglist__9197));
    var p__9193 = cljs.core.rest(cljs.core.next(arglist__9197));
    return closest__delegate($elem, selector, p__9193)
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
  var val__delegate = function($elem, p__9198) {
    var vec__9199__9200 = p__9198;
    var v__9201 = cljs.core.nth.call(null, vec__9199__9200, 0, null);
    if(cljs.core.truth_(v__9201)) {
      return $elem.val(v__9201)
    }else {
      return $elem.val()
    }
  };
  var val = function($elem, var_args) {
    var p__9198 = null;
    if(goog.isDef(var_args)) {
      p__9198 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0)
    }
    return val__delegate.call(this, $elem, p__9198)
  };
  val.cljs$lang$maxFixedArity = 1;
  val.cljs$lang$applyTo = function(arglist__9202) {
    var $elem = cljs.core.first(arglist__9202);
    var p__9198 = cljs.core.rest(arglist__9202);
    return val__delegate($elem, p__9198)
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
jayq.core.xhr = function xhr(p__9203, content, callback) {
  var vec__9204__9205 = p__9203;
  var method__9206 = cljs.core.nth.call(null, vec__9204__9205, 0, null);
  var uri__9207 = cljs.core.nth.call(null, vec__9204__9205, 1, null);
  var params__9208 = jayq.util.clj__GT_js.call(null, cljs.core.ObjMap.fromObject(["\ufdd0'type", "\ufdd0'data", "\ufdd0'success"], {"\ufdd0'type":clojure.string.upper_case.call(null, cljs.core.name.call(null, method__9206)), "\ufdd0'data":jayq.util.clj__GT_js.call(null, content), "\ufdd0'success":callback}));
  return jQuery.ajax(uri__9207, params__9208)
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
  var unbind__delegate = function($elem, ev, p__9209) {
    var vec__9210__9211 = p__9209;
    var func__9212 = cljs.core.nth.call(null, vec__9210__9211, 0, null);
    return $elem.unbind(cljs.core.name.call(null, ev), func__9212)
  };
  var unbind = function($elem, ev, var_args) {
    var p__9209 = null;
    if(goog.isDef(var_args)) {
      p__9209 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return unbind__delegate.call(this, $elem, ev, p__9209)
  };
  unbind.cljs$lang$maxFixedArity = 2;
  unbind.cljs$lang$applyTo = function(arglist__9213) {
    var $elem = cljs.core.first(arglist__9213);
    var ev = cljs.core.first(cljs.core.next(arglist__9213));
    var p__9209 = cljs.core.rest(cljs.core.next(arglist__9213));
    return unbind__delegate($elem, ev, p__9209)
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
  var on__delegate = function($elem, events, p__9214) {
    var vec__9215__9216 = p__9214;
    var sel__9217 = cljs.core.nth.call(null, vec__9215__9216, 0, null);
    var data__9218 = cljs.core.nth.call(null, vec__9215__9216, 1, null);
    var handler__9219 = cljs.core.nth.call(null, vec__9215__9216, 2, null);
    return $elem.on(jayq.core.__GT_event.call(null, events), jayq.core.__GT_selector.call(null, sel__9217), data__9218, handler__9219)
  };
  var on = function($elem, events, var_args) {
    var p__9214 = null;
    if(goog.isDef(var_args)) {
      p__9214 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return on__delegate.call(this, $elem, events, p__9214)
  };
  on.cljs$lang$maxFixedArity = 2;
  on.cljs$lang$applyTo = function(arglist__9220) {
    var $elem = cljs.core.first(arglist__9220);
    var events = cljs.core.first(cljs.core.next(arglist__9220));
    var p__9214 = cljs.core.rest(cljs.core.next(arglist__9220));
    return on__delegate($elem, events, p__9214)
  };
  on.cljs$lang$arity$variadic = on__delegate;
  return on
}();
jayq.core.one = function() {
  var one__delegate = function($elem, events, p__9221) {
    var vec__9222__9223 = p__9221;
    var sel__9224 = cljs.core.nth.call(null, vec__9222__9223, 0, null);
    var data__9225 = cljs.core.nth.call(null, vec__9222__9223, 1, null);
    var handler__9226 = cljs.core.nth.call(null, vec__9222__9223, 2, null);
    return $elem.one(jayq.core.__GT_event.call(null, events), jayq.core.__GT_selector.call(null, sel__9224), data__9225, handler__9226)
  };
  var one = function($elem, events, var_args) {
    var p__9221 = null;
    if(goog.isDef(var_args)) {
      p__9221 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return one__delegate.call(this, $elem, events, p__9221)
  };
  one.cljs$lang$maxFixedArity = 2;
  one.cljs$lang$applyTo = function(arglist__9227) {
    var $elem = cljs.core.first(arglist__9227);
    var events = cljs.core.first(cljs.core.next(arglist__9227));
    var p__9221 = cljs.core.rest(cljs.core.next(arglist__9227));
    return one__delegate($elem, events, p__9221)
  };
  one.cljs$lang$arity$variadic = one__delegate;
  return one
}();
jayq.core.off = function() {
  var off__delegate = function($elem, events, p__9228) {
    var vec__9229__9230 = p__9228;
    var sel__9231 = cljs.core.nth.call(null, vec__9229__9230, 0, null);
    var handler__9232 = cljs.core.nth.call(null, vec__9229__9230, 1, null);
    return $elem.off(jayq.core.__GT_event.call(null, events), jayq.core.__GT_selector.call(null, sel__9231), handler__9232)
  };
  var off = function($elem, events, var_args) {
    var p__9228 = null;
    if(goog.isDef(var_args)) {
      p__9228 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0)
    }
    return off__delegate.call(this, $elem, events, p__9228)
  };
  off.cljs$lang$maxFixedArity = 2;
  off.cljs$lang$applyTo = function(arglist__9233) {
    var $elem = cljs.core.first(arglist__9233);
    var events = cljs.core.first(cljs.core.next(arglist__9233));
    var p__9228 = cljs.core.rest(cljs.core.next(arglist__9233));
    return off__delegate($elem, events, p__9228)
  };
  off.cljs$lang$arity$variadic = off__delegate;
  return off
}();
jayq.core.prevent = function prevent(e) {
  return e.preventDefault()
};
goog.provide("io.turbonode.hyper_clj.maze_xml");
goog.require("cljs.core");
goog.require("clojure.browser.repl");
goog.require("clojure.string");
goog.require("jayq.core");
io.turbonode.hyper_clj.maze_xml.$ = jayq.core.$;
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
  io.turbonode.hyper_clj.maze_xml.attach_events.call(null);
  io.turbonode.hyper_clj.maze_xml.get_document.call(null, io.turbonode.hyper_clj.maze_xml.start_link);
  return io.turbonode.hyper_clj.maze_xml.set_focus.call(null)
});
io.turbonode.hyper_clj.maze_xml.attach_events = function attach_events() {
  return jayq.core.bind.call(null, io.turbonode.hyper_clj.maze_xml.$.call(null, "[name|=interface]"), "\ufdd0'submit", function() {
    io.turbonode.hyper_clj.maze_xml.move.call(null);
    return false
  })
};
io.turbonode.hyper_clj.maze_xml.get_document = function get_document(url) {
  return jayq.core.ajax.call(null, url, cljs.core.ObjMap.fromObject(["\ufdd0'accepts", "\ufdd0'context", "\ufdd0'dataType", "\ufdd0'success", "\ufdd0'type"], {"\ufdd0'accepts":io.turbonode.hyper_clj.maze_xml.maze_media_type, "\ufdd0'context":window, "\ufdd0'dataType":"xml", "\ufdd0'success":io.turbonode.hyper_clj.maze_xml.process_links, "\ufdd0'type":"GET"}))
};
io.turbonode.hyper_clj.maze_xml.get_option_link = function get_option_link(action) {
  var temp__324__auto____17727 = cljs.core.first.call(null, io.turbonode.hyper_clj.maze_xml.$.call(null, "\ufdd0'.options"));
  if(cljs.core.truth_(temp__324__auto____17727)) {
    var options_elm__17728 = temp__324__auto____17727;
    var links__17729 = options_elm__17728.links;
    var head__17730 = cljs.core.first.call(null, links__17729);
    var tail__17731 = cljs.core.rest.call(null, links__17729);
    while(true) {
      if(cljs.core._EQ_.call(null, function() {
        var or__138__auto____17732 = "\ufdd0'name".call(null, head__17730);
        if(cljs.core.truth_(or__138__auto____17732)) {
          return or__138__auto____17732
        }else {
          return"\ufdd0'rel".call(null, head__17730)
        }
      }(), action)) {
        return"\ufdd0'href".call(null, head__17730)
      }else {
        if(cljs.core.empty_QMARK_.call(null, tail__17731)) {
          return null
        }else {
          var G__17733 = cljs.core.first.call(null, tail__17731);
          var G__17734 = cljs.core.rest.call(null, tail__17731);
          head__17730 = G__17733;
          tail__17731 = G__17734;
          continue
        }
      }
      break
    }
  }else {
    return null
  }
};
io.turbonode.hyper_clj.maze_xml.maze_media_type = "application/vnd.amundsen.maze+xml";
io.turbonode.hyper_clj.maze_xml.move = function move() {
  var temp__324__auto____17735 = cljs.core.first.call(null, io.turbonode.hyper_clj.maze_xml.$.call(null, "[name|=move]"));
  if(cljs.core.truth_(temp__324__auto____17735)) {
    var move_elm__17736 = temp__324__auto____17735;
    var v__17737 = move_elm__17736.value;
    if(cljs.core._EQ_.call(null, v__17737, "clear")) {
      return history.go(0)
    }else {
      var href__17738 = io.turbonode.hyper_clj.maze_xml.get_option_link.call(null, v__17737);
      if(cljs.core.truth_(href__17738)) {
        io.turbonode.hyper_clj.maze_xml.update_history.call(null, v__17737);
        io.turbonode.hyper_clj.maze_xml.get_document.call(null, href__17738)
      }else {
        alert(io.turbonode.hyper_clj.maze_xml.sorry_message)
      }
      return io.turbonode.hyper_clj.maze_xml.set_focus.call(null)
    }
  }else {
    return null
  }
};
io.turbonode.hyper_clj.maze_xml.process_links = function process_links(data) {
  return io.turbonode.hyper_clj.maze_xml.show_options.call(null, cljs.core.flatten.call(null, cljs.core.map.call(null, function(node) {
    var $node__17739 = io.turbonode.hyper_clj.maze_xml.$.call(null, node);
    var href__17740 = jayq.core.attr.call(null, $node__17739, "\ufdd0'href");
    var rels__17741 = clojure.string.split.call(null, jayq.core.attr.call(null, $node__17739, "\ufdd0'rel"), / /);
    var name__17742 = jayq.core.attr.call(null, $node__17739, "\ufdd0'name");
    return cljs.core.map.call(null, function(rel) {
      return cljs.core.ObjMap.fromObject(["\ufdd0'rel", "\ufdd0'href", "\ufdd0'name"], {"\ufdd0'rel":rel, "\ufdd0'href":href__17740, "\ufdd0'name":name__17742})
    }, rels__17741)
  }, jayq.core.find.call(null, io.turbonode.hyper_clj.maze_xml.$.call(null, data), "\ufdd0'link"))))
};
io.turbonode.hyper_clj.maze_xml.set_focus = function set_focus() {
  var G__17743__17744 = io.turbonode.hyper_clj.maze_xml.$.call(null, "[name|=move]");
  G__17743__17744.val("");
  G__17743__17744.focus();
  return G__17743__17744
};
io.turbonode.hyper_clj.maze_xml.show_options = function show_options(links) {
  var temp__324__auto____17745 = cljs.core.first.call(null, io.turbonode.hyper_clj.maze_xml.$.call(null, ".options"));
  if(cljs.core.truth_(temp__324__auto____17745)) {
    var options_elm__17746 = temp__324__auto____17745;
    options_elm__17746.links = links;
    var txt__17755 = cljs.core.map.call(null, function(p__17747) {
      var map__17748__17749 = p__17747;
      var map__17748__17750 = cljs.core.seq_QMARK_.call(null, map__17748__17749) ? cljs.core.apply.call(null, cljs.core.hash_map, map__17748__17749) : map__17748__17749;
      var name__17751 = cljs.core.get.call(null, map__17748__17750, "\ufdd0'name");
      var href__17752 = cljs.core.get.call(null, map__17748__17750, "\ufdd0'href");
      var rel__17753 = cljs.core.get.call(null, map__17748__17750, "\ufdd0'rel");
      if(cljs.core._EQ_.call(null, rel__17753, "collection")) {
        return"clear"
      }else {
        if(cljs.core._EQ_.call(null, rel__17753, "maze")) {
          var or__138__auto____17754 = name__17751;
          if(cljs.core.truth_(or__138__auto____17754)) {
            return or__138__auto____17754
          }else {
            return rel__17753
          }
        }else {
          if("\ufdd0'else") {
            return rel__17753
          }else {
            return null
          }
        }
      }
    }, links);
    var txt__17756 = clojure.string.join.call(null, ", ", txt__17755);
    return options_elm__17746.innerHTML = txt__17756
  }else {
    return null
  }
};
io.turbonode.hyper_clj.maze_xml.sorry_message = "Sorry, I don't understand what you want to do.";
io.turbonode.hyper_clj.maze_xml.start_link = "/maze/";
io.turbonode.hyper_clj.maze_xml.success_message = "Congratulations! you've made it out of the maze!";
io.turbonode.hyper_clj.maze_xml.update_history = function update_history(action) {
  var temp__324__auto____17757 = cljs.core.first.call(null, io.turbonode.hyper_clj.maze_xml.$.call(null, "#history"));
  if(cljs.core.truth_(temp__324__auto____17757)) {
    var history_elm__17758 = temp__324__auto____17757;
    var num__17759 = history_elm__17758.num;
    var num__17760 = cljs.core.truth_(num__17759) ? num__17759 : 0;
    var txt__17761 = io.turbonode.hyper_clj.maze_xml.$.call(null, history_elm__17758).text();
    var new_entry__17762 = function(entry) {
      return io.turbonode.hyper_clj.maze_xml.$.call(null, history_elm__17758).text([cljs.core.str(num__17760 + 1), cljs.core.str(": "), cljs.core.str(entry), cljs.core.str("\n"), cljs.core.str(txt__17761)].join(""))
    };
    history_elm__17758.num = num__17760 + 1;
    if(cljs.core._EQ_.call(null, action, "exit")) {
      return new_entry__17762.call(null, io.turbonode.hyper_clj.maze_xml.success_message)
    }else {
      return new_entry__17762.call(null, action)
    }
  }else {
    return null
  }
};
