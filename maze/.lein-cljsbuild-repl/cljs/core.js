goog.provide('cljs.core');
goog.require('goog.string');
goog.require('goog.string.StringBuffer');
goog.require('goog.object');
goog.require('goog.array');
cljs.core._STAR_unchecked_if_STAR_ = false;
/**
* Each runtime environment provides a diffenent way to print output.
* Whatever function *print-fn* is bound to will be passed any
* Strings which should be printed.
*/
cljs.core._STAR_print_fn_STAR_ = (function _STAR_print_fn_STAR_(_){
throw (new Error("No *print-fn* fn set for evaluation environment"));
});
void 0;
void 0;
void 0;
/**
* Internal - do not use!
*/
cljs.core.truth_ = (function truth_(x){
return (x != null && x !== false);
});
void 0;/**
* Internal - do not use!
*/
cljs.core.type_satisfies_ = (function type_satisfies_(p,x){
if((p[goog.typeOf.call(null,x)]))
{return true;
} else
{if((p["_"]))
{return true;
} else
{if("\uFDD0'else")
{return false;
} else
{return null;
}
}
}
});
void 0;cljs.core.is_proto_ = (function is_proto_(x){
return (x).constructor.prototype === x;
});
/**
* When compiled for a command-line target, whatever
* function *main-fn* is set to will be called with the command-line
* argv as arguments
*/
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.missing_protocol = (function missing_protocol(proto,obj){
return Error("No protocol method "+proto+" defined for type "+goog.typeOf.call(null,obj)+": "+obj);
});
/**
* Returns a javascript array, cloned from the passed in array
*/
cljs.core.aclone = (function aclone(array_like){
return Array.prototype.slice.call(array_like);
});
/**
* Creates a new javascript array.
* @param {...*} var_args
*/
cljs.core.array = (function array(var_args){
return Array.prototype.slice.call(arguments);
});
cljs.core.make_array = (function() {
var make_array = null;
var make_array__1 = (function (size){
return new Array(size);
});
var make_array__2 = (function (type,size){
return make_array.call(null,size);
});
make_array = function(type,size){
switch(arguments.length){
case 1:
return make_array__1.call(this,type);
case 2:
return make_array__2.call(this,type,size);
}
throw('Invalid arity: ' + arguments.length);
};
make_array.cljs$lang$arity$1 = make_array__1;
make_array.cljs$lang$arity$2 = make_array__2;
return make_array;
})()
;
void 0;
/**
* Returns the value at the index.
* @param {...*} var_args
*/
cljs.core.aget = (function() {
var aget = null;
var aget__2 = (function (array,i){
return (array[i]);
});
var aget__3 = (function() { 
var G__8551__delegate = function (array,i,idxs){
return cljs.core.apply.call(null,aget,aget.call(null,array,i),idxs);
};
var G__8551 = function (array,i,var_args){
var idxs = null;
if (goog.isDef(var_args)) {
  idxs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8551__delegate.call(this, array, i, idxs);
};
G__8551.cljs$lang$maxFixedArity = 2;
G__8551.cljs$lang$applyTo = (function (arglist__8552){
var array = cljs.core.first(arglist__8552);
var i = cljs.core.first(cljs.core.next(arglist__8552));
var idxs = cljs.core.rest(cljs.core.next(arglist__8552));
return G__8551__delegate(array, i, idxs);
});
G__8551.cljs$lang$arity$variadic = G__8551__delegate;
return G__8551;
})()
;
aget = function(array,i,var_args){
var idxs = var_args;
switch(arguments.length){
case 2:
return aget__2.call(this,array,i);
default:
return aget__3.cljs$lang$arity$variadic(array,i, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
aget.cljs$lang$maxFixedArity = 2;
aget.cljs$lang$applyTo = aget__3.cljs$lang$applyTo;
aget.cljs$lang$arity$2 = aget__2;
aget.cljs$lang$arity$variadic = aget__3.cljs$lang$arity$variadic;
return aget;
})()
;
/**
* Sets the value at the index.
*/
cljs.core.aset = (function aset(array,i,val){
return (array[i] = val);
});
/**
* Returns the length of the array. Works on arrays of all types.
*/
cljs.core.alength = (function alength(array){
return array.length;
});
void 0;
cljs.core.into_array = (function() {
var into_array = null;
var into_array__1 = (function (aseq){
return into_array.call(null,null,aseq);
});
var into_array__2 = (function (type,aseq){
return cljs.core.reduce.call(null,(function (a,x){
a.push(x);
return a;
}),[],aseq);
});
into_array = function(type,aseq){
switch(arguments.length){
case 1:
return into_array__1.call(this,type);
case 2:
return into_array__2.call(this,type,aseq);
}
throw('Invalid arity: ' + arguments.length);
};
into_array.cljs$lang$arity$1 = into_array__1;
into_array.cljs$lang$arity$2 = into_array__2;
return into_array;
})()
;
void 0;cljs.core.IFn = {};
cljs.core._invoke = (function() {
var _invoke = null;
var _invoke__1 = (function (this$){
if((function (){var and__132__auto____8553 = this$;
if(and__132__auto____8553)
{return this$.cljs$core$IFn$_invoke$arity$1;
} else
{return and__132__auto____8553;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$1(this$);
} else
{return (function (){var or__138__auto____8554 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8554)
{return or__138__auto____8554;
} else
{var or__138__auto____8555 = (cljs.core._invoke["_"]);
if(or__138__auto____8555)
{return or__138__auto____8555;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$);
}
});
var _invoke__2 = (function (this$,a){
if((function (){var and__132__auto____8556 = this$;
if(and__132__auto____8556)
{return this$.cljs$core$IFn$_invoke$arity$2;
} else
{return and__132__auto____8556;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$2(this$,a);
} else
{return (function (){var or__138__auto____8557 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8557)
{return or__138__auto____8557;
} else
{var or__138__auto____8558 = (cljs.core._invoke["_"]);
if(or__138__auto____8558)
{return or__138__auto____8558;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a);
}
});
var _invoke__3 = (function (this$,a,b){
if((function (){var and__132__auto____8559 = this$;
if(and__132__auto____8559)
{return this$.cljs$core$IFn$_invoke$arity$3;
} else
{return and__132__auto____8559;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$3(this$,a,b);
} else
{return (function (){var or__138__auto____8560 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8560)
{return or__138__auto____8560;
} else
{var or__138__auto____8561 = (cljs.core._invoke["_"]);
if(or__138__auto____8561)
{return or__138__auto____8561;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b);
}
});
var _invoke__4 = (function (this$,a,b,c){
if((function (){var and__132__auto____8562 = this$;
if(and__132__auto____8562)
{return this$.cljs$core$IFn$_invoke$arity$4;
} else
{return and__132__auto____8562;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$4(this$,a,b,c);
} else
{return (function (){var or__138__auto____8563 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8563)
{return or__138__auto____8563;
} else
{var or__138__auto____8564 = (cljs.core._invoke["_"]);
if(or__138__auto____8564)
{return or__138__auto____8564;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c);
}
});
var _invoke__5 = (function (this$,a,b,c,d){
if((function (){var and__132__auto____8565 = this$;
if(and__132__auto____8565)
{return this$.cljs$core$IFn$_invoke$arity$5;
} else
{return and__132__auto____8565;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$5(this$,a,b,c,d);
} else
{return (function (){var or__138__auto____8566 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8566)
{return or__138__auto____8566;
} else
{var or__138__auto____8567 = (cljs.core._invoke["_"]);
if(or__138__auto____8567)
{return or__138__auto____8567;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d);
}
});
var _invoke__6 = (function (this$,a,b,c,d,e){
if((function (){var and__132__auto____8568 = this$;
if(and__132__auto____8568)
{return this$.cljs$core$IFn$_invoke$arity$6;
} else
{return and__132__auto____8568;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$6(this$,a,b,c,d,e);
} else
{return (function (){var or__138__auto____8569 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8569)
{return or__138__auto____8569;
} else
{var or__138__auto____8570 = (cljs.core._invoke["_"]);
if(or__138__auto____8570)
{return or__138__auto____8570;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e);
}
});
var _invoke__7 = (function (this$,a,b,c,d,e,f){
if((function (){var and__132__auto____8571 = this$;
if(and__132__auto____8571)
{return this$.cljs$core$IFn$_invoke$arity$7;
} else
{return and__132__auto____8571;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$7(this$,a,b,c,d,e,f);
} else
{return (function (){var or__138__auto____8572 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8572)
{return or__138__auto____8572;
} else
{var or__138__auto____8573 = (cljs.core._invoke["_"]);
if(or__138__auto____8573)
{return or__138__auto____8573;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f);
}
});
var _invoke__8 = (function (this$,a,b,c,d,e,f,g){
if((function (){var and__132__auto____8574 = this$;
if(and__132__auto____8574)
{return this$.cljs$core$IFn$_invoke$arity$8;
} else
{return and__132__auto____8574;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$8(this$,a,b,c,d,e,f,g);
} else
{return (function (){var or__138__auto____8575 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8575)
{return or__138__auto____8575;
} else
{var or__138__auto____8576 = (cljs.core._invoke["_"]);
if(or__138__auto____8576)
{return or__138__auto____8576;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g);
}
});
var _invoke__9 = (function (this$,a,b,c,d,e,f,g,h){
if((function (){var and__132__auto____8577 = this$;
if(and__132__auto____8577)
{return this$.cljs$core$IFn$_invoke$arity$9;
} else
{return and__132__auto____8577;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$9(this$,a,b,c,d,e,f,g,h);
} else
{return (function (){var or__138__auto____8578 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8578)
{return or__138__auto____8578;
} else
{var or__138__auto____8579 = (cljs.core._invoke["_"]);
if(or__138__auto____8579)
{return or__138__auto____8579;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h);
}
});
var _invoke__10 = (function (this$,a,b,c,d,e,f,g,h,i){
if((function (){var and__132__auto____8580 = this$;
if(and__132__auto____8580)
{return this$.cljs$core$IFn$_invoke$arity$10;
} else
{return and__132__auto____8580;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$10(this$,a,b,c,d,e,f,g,h,i);
} else
{return (function (){var or__138__auto____8581 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8581)
{return or__138__auto____8581;
} else
{var or__138__auto____8582 = (cljs.core._invoke["_"]);
if(or__138__auto____8582)
{return or__138__auto____8582;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i);
}
});
var _invoke__11 = (function (this$,a,b,c,d,e,f,g,h,i,j){
if((function (){var and__132__auto____8583 = this$;
if(and__132__auto____8583)
{return this$.cljs$core$IFn$_invoke$arity$11;
} else
{return and__132__auto____8583;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$11(this$,a,b,c,d,e,f,g,h,i,j);
} else
{return (function (){var or__138__auto____8584 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8584)
{return or__138__auto____8584;
} else
{var or__138__auto____8585 = (cljs.core._invoke["_"]);
if(or__138__auto____8585)
{return or__138__auto____8585;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j);
}
});
var _invoke__12 = (function (this$,a,b,c,d,e,f,g,h,i,j,k){
if((function (){var and__132__auto____8586 = this$;
if(and__132__auto____8586)
{return this$.cljs$core$IFn$_invoke$arity$12;
} else
{return and__132__auto____8586;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$12(this$,a,b,c,d,e,f,g,h,i,j,k);
} else
{return (function (){var or__138__auto____8587 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8587)
{return or__138__auto____8587;
} else
{var or__138__auto____8588 = (cljs.core._invoke["_"]);
if(or__138__auto____8588)
{return or__138__auto____8588;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k);
}
});
var _invoke__13 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l){
if((function (){var and__132__auto____8589 = this$;
if(and__132__auto____8589)
{return this$.cljs$core$IFn$_invoke$arity$13;
} else
{return and__132__auto____8589;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$13(this$,a,b,c,d,e,f,g,h,i,j,k,l);
} else
{return (function (){var or__138__auto____8590 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8590)
{return or__138__auto____8590;
} else
{var or__138__auto____8591 = (cljs.core._invoke["_"]);
if(or__138__auto____8591)
{return or__138__auto____8591;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l);
}
});
var _invoke__14 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m){
if((function (){var and__132__auto____8592 = this$;
if(and__132__auto____8592)
{return this$.cljs$core$IFn$_invoke$arity$14;
} else
{return and__132__auto____8592;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$14(this$,a,b,c,d,e,f,g,h,i,j,k,l,m);
} else
{return (function (){var or__138__auto____8593 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8593)
{return or__138__auto____8593;
} else
{var or__138__auto____8594 = (cljs.core._invoke["_"]);
if(or__138__auto____8594)
{return or__138__auto____8594;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m);
}
});
var _invoke__15 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n){
if((function (){var and__132__auto____8595 = this$;
if(and__132__auto____8595)
{return this$.cljs$core$IFn$_invoke$arity$15;
} else
{return and__132__auto____8595;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$15(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n);
} else
{return (function (){var or__138__auto____8596 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8596)
{return or__138__auto____8596;
} else
{var or__138__auto____8597 = (cljs.core._invoke["_"]);
if(or__138__auto____8597)
{return or__138__auto____8597;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n);
}
});
var _invoke__16 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){
if((function (){var and__132__auto____8598 = this$;
if(and__132__auto____8598)
{return this$.cljs$core$IFn$_invoke$arity$16;
} else
{return and__132__auto____8598;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$16(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o);
} else
{return (function (){var or__138__auto____8599 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8599)
{return or__138__auto____8599;
} else
{var or__138__auto____8600 = (cljs.core._invoke["_"]);
if(or__138__auto____8600)
{return or__138__auto____8600;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o);
}
});
var _invoke__17 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){
if((function (){var and__132__auto____8601 = this$;
if(and__132__auto____8601)
{return this$.cljs$core$IFn$_invoke$arity$17;
} else
{return and__132__auto____8601;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$17(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
} else
{return (function (){var or__138__auto____8602 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8602)
{return or__138__auto____8602;
} else
{var or__138__auto____8603 = (cljs.core._invoke["_"]);
if(or__138__auto____8603)
{return or__138__auto____8603;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
}
});
var _invoke__18 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){
if((function (){var and__132__auto____8604 = this$;
if(and__132__auto____8604)
{return this$.cljs$core$IFn$_invoke$arity$18;
} else
{return and__132__auto____8604;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$18(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q);
} else
{return (function (){var or__138__auto____8605 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8605)
{return or__138__auto____8605;
} else
{var or__138__auto____8606 = (cljs.core._invoke["_"]);
if(or__138__auto____8606)
{return or__138__auto____8606;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q);
}
});
var _invoke__19 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s){
if((function (){var and__132__auto____8607 = this$;
if(and__132__auto____8607)
{return this$.cljs$core$IFn$_invoke$arity$19;
} else
{return and__132__auto____8607;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$19(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s);
} else
{return (function (){var or__138__auto____8608 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8608)
{return or__138__auto____8608;
} else
{var or__138__auto____8609 = (cljs.core._invoke["_"]);
if(or__138__auto____8609)
{return or__138__auto____8609;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s);
}
});
var _invoke__20 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t){
if((function (){var and__132__auto____8610 = this$;
if(and__132__auto____8610)
{return this$.cljs$core$IFn$_invoke$arity$20;
} else
{return and__132__auto____8610;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$20(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t);
} else
{return (function (){var or__138__auto____8611 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8611)
{return or__138__auto____8611;
} else
{var or__138__auto____8612 = (cljs.core._invoke["_"]);
if(or__138__auto____8612)
{return or__138__auto____8612;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t);
}
});
var _invoke__21 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t,rest){
if((function (){var and__132__auto____8613 = this$;
if(and__132__auto____8613)
{return this$.cljs$core$IFn$_invoke$arity$21;
} else
{return and__132__auto____8613;
}
})())
{return this$.cljs$core$IFn$_invoke$arity$21(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t,rest);
} else
{return (function (){var or__138__auto____8614 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);
if(or__138__auto____8614)
{return or__138__auto____8614;
} else
{var or__138__auto____8615 = (cljs.core._invoke["_"]);
if(or__138__auto____8615)
{return or__138__auto____8615;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t,rest);
}
});
_invoke = function(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t,rest){
switch(arguments.length){
case 1:
return _invoke__1.call(this,this$);
case 2:
return _invoke__2.call(this,this$,a);
case 3:
return _invoke__3.call(this,this$,a,b);
case 4:
return _invoke__4.call(this,this$,a,b,c);
case 5:
return _invoke__5.call(this,this$,a,b,c,d);
case 6:
return _invoke__6.call(this,this$,a,b,c,d,e);
case 7:
return _invoke__7.call(this,this$,a,b,c,d,e,f);
case 8:
return _invoke__8.call(this,this$,a,b,c,d,e,f,g);
case 9:
return _invoke__9.call(this,this$,a,b,c,d,e,f,g,h);
case 10:
return _invoke__10.call(this,this$,a,b,c,d,e,f,g,h,i);
case 11:
return _invoke__11.call(this,this$,a,b,c,d,e,f,g,h,i,j);
case 12:
return _invoke__12.call(this,this$,a,b,c,d,e,f,g,h,i,j,k);
case 13:
return _invoke__13.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l);
case 14:
return _invoke__14.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m);
case 15:
return _invoke__15.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n);
case 16:
return _invoke__16.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o);
case 17:
return _invoke__17.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
case 18:
return _invoke__18.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q);
case 19:
return _invoke__19.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s);
case 20:
return _invoke__20.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t);
case 21:
return _invoke__21.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t,rest);
}
throw('Invalid arity: ' + arguments.length);
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
return _invoke;
})()
;
void 0;void 0;cljs.core.ICounted = {};
cljs.core._count = (function _count(coll){
if((function (){var and__132__auto____8616 = coll;
if(and__132__auto____8616)
{return coll.cljs$core$ICounted$_count$arity$1;
} else
{return and__132__auto____8616;
}
})())
{return coll.cljs$core$ICounted$_count$arity$1(coll);
} else
{return (function (){var or__138__auto____8617 = (cljs.core._count[goog.typeOf.call(null,coll)]);
if(or__138__auto____8617)
{return or__138__auto____8617;
} else
{var or__138__auto____8618 = (cljs.core._count["_"]);
if(or__138__auto____8618)
{return or__138__auto____8618;
} else
{throw cljs.core.missing_protocol.call(null,"ICounted.-count",coll);
}
}
})().call(null,coll);
}
});
void 0;void 0;cljs.core.IEmptyableCollection = {};
cljs.core._empty = (function _empty(coll){
if((function (){var and__132__auto____8619 = coll;
if(and__132__auto____8619)
{return coll.cljs$core$IEmptyableCollection$_empty$arity$1;
} else
{return and__132__auto____8619;
}
})())
{return coll.cljs$core$IEmptyableCollection$_empty$arity$1(coll);
} else
{return (function (){var or__138__auto____8620 = (cljs.core._empty[goog.typeOf.call(null,coll)]);
if(or__138__auto____8620)
{return or__138__auto____8620;
} else
{var or__138__auto____8621 = (cljs.core._empty["_"]);
if(or__138__auto____8621)
{return or__138__auto____8621;
} else
{throw cljs.core.missing_protocol.call(null,"IEmptyableCollection.-empty",coll);
}
}
})().call(null,coll);
}
});
void 0;void 0;cljs.core.ICollection = {};
cljs.core._conj = (function _conj(coll,o){
if((function (){var and__132__auto____8622 = coll;
if(and__132__auto____8622)
{return coll.cljs$core$ICollection$_conj$arity$2;
} else
{return and__132__auto____8622;
}
})())
{return coll.cljs$core$ICollection$_conj$arity$2(coll,o);
} else
{return (function (){var or__138__auto____8623 = (cljs.core._conj[goog.typeOf.call(null,coll)]);
if(or__138__auto____8623)
{return or__138__auto____8623;
} else
{var or__138__auto____8624 = (cljs.core._conj["_"]);
if(or__138__auto____8624)
{return or__138__auto____8624;
} else
{throw cljs.core.missing_protocol.call(null,"ICollection.-conj",coll);
}
}
})().call(null,coll,o);
}
});
void 0;void 0;cljs.core.IIndexed = {};
cljs.core._nth = (function() {
var _nth = null;
var _nth__2 = (function (coll,n){
if((function (){var and__132__auto____8625 = coll;
if(and__132__auto____8625)
{return coll.cljs$core$IIndexed$_nth$arity$2;
} else
{return and__132__auto____8625;
}
})())
{return coll.cljs$core$IIndexed$_nth$arity$2(coll,n);
} else
{return (function (){var or__138__auto____8626 = (cljs.core._nth[goog.typeOf.call(null,coll)]);
if(or__138__auto____8626)
{return or__138__auto____8626;
} else
{var or__138__auto____8627 = (cljs.core._nth["_"]);
if(or__138__auto____8627)
{return or__138__auto____8627;
} else
{throw cljs.core.missing_protocol.call(null,"IIndexed.-nth",coll);
}
}
})().call(null,coll,n);
}
});
var _nth__3 = (function (coll,n,not_found){
if((function (){var and__132__auto____8628 = coll;
if(and__132__auto____8628)
{return coll.cljs$core$IIndexed$_nth$arity$3;
} else
{return and__132__auto____8628;
}
})())
{return coll.cljs$core$IIndexed$_nth$arity$3(coll,n,not_found);
} else
{return (function (){var or__138__auto____8629 = (cljs.core._nth[goog.typeOf.call(null,coll)]);
if(or__138__auto____8629)
{return or__138__auto____8629;
} else
{var or__138__auto____8630 = (cljs.core._nth["_"]);
if(or__138__auto____8630)
{return or__138__auto____8630;
} else
{throw cljs.core.missing_protocol.call(null,"IIndexed.-nth",coll);
}
}
})().call(null,coll,n,not_found);
}
});
_nth = function(coll,n,not_found){
switch(arguments.length){
case 2:
return _nth__2.call(this,coll,n);
case 3:
return _nth__3.call(this,coll,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
_nth.cljs$lang$arity$2 = _nth__2;
_nth.cljs$lang$arity$3 = _nth__3;
return _nth;
})()
;
void 0;void 0;cljs.core.ASeq = {};
void 0;void 0;cljs.core.ISeq = {};
cljs.core._first = (function _first(coll){
if((function (){var and__132__auto____8631 = coll;
if(and__132__auto____8631)
{return coll.cljs$core$ISeq$_first$arity$1;
} else
{return and__132__auto____8631;
}
})())
{return coll.cljs$core$ISeq$_first$arity$1(coll);
} else
{return (function (){var or__138__auto____8632 = (cljs.core._first[goog.typeOf.call(null,coll)]);
if(or__138__auto____8632)
{return or__138__auto____8632;
} else
{var or__138__auto____8633 = (cljs.core._first["_"]);
if(or__138__auto____8633)
{return or__138__auto____8633;
} else
{throw cljs.core.missing_protocol.call(null,"ISeq.-first",coll);
}
}
})().call(null,coll);
}
});
cljs.core._rest = (function _rest(coll){
if((function (){var and__132__auto____8634 = coll;
if(and__132__auto____8634)
{return coll.cljs$core$ISeq$_rest$arity$1;
} else
{return and__132__auto____8634;
}
})())
{return coll.cljs$core$ISeq$_rest$arity$1(coll);
} else
{return (function (){var or__138__auto____8635 = (cljs.core._rest[goog.typeOf.call(null,coll)]);
if(or__138__auto____8635)
{return or__138__auto____8635;
} else
{var or__138__auto____8636 = (cljs.core._rest["_"]);
if(or__138__auto____8636)
{return or__138__auto____8636;
} else
{throw cljs.core.missing_protocol.call(null,"ISeq.-rest",coll);
}
}
})().call(null,coll);
}
});
void 0;void 0;cljs.core.ILookup = {};
cljs.core._lookup = (function() {
var _lookup = null;
var _lookup__2 = (function (o,k){
if((function (){var and__132__auto____8637 = o;
if(and__132__auto____8637)
{return o.cljs$core$ILookup$_lookup$arity$2;
} else
{return and__132__auto____8637;
}
})())
{return o.cljs$core$ILookup$_lookup$arity$2(o,k);
} else
{return (function (){var or__138__auto____8638 = (cljs.core._lookup[goog.typeOf.call(null,o)]);
if(or__138__auto____8638)
{return or__138__auto____8638;
} else
{var or__138__auto____8639 = (cljs.core._lookup["_"]);
if(or__138__auto____8639)
{return or__138__auto____8639;
} else
{throw cljs.core.missing_protocol.call(null,"ILookup.-lookup",o);
}
}
})().call(null,o,k);
}
});
var _lookup__3 = (function (o,k,not_found){
if((function (){var and__132__auto____8640 = o;
if(and__132__auto____8640)
{return o.cljs$core$ILookup$_lookup$arity$3;
} else
{return and__132__auto____8640;
}
})())
{return o.cljs$core$ILookup$_lookup$arity$3(o,k,not_found);
} else
{return (function (){var or__138__auto____8641 = (cljs.core._lookup[goog.typeOf.call(null,o)]);
if(or__138__auto____8641)
{return or__138__auto____8641;
} else
{var or__138__auto____8642 = (cljs.core._lookup["_"]);
if(or__138__auto____8642)
{return or__138__auto____8642;
} else
{throw cljs.core.missing_protocol.call(null,"ILookup.-lookup",o);
}
}
})().call(null,o,k,not_found);
}
});
_lookup = function(o,k,not_found){
switch(arguments.length){
case 2:
return _lookup__2.call(this,o,k);
case 3:
return _lookup__3.call(this,o,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
_lookup.cljs$lang$arity$2 = _lookup__2;
_lookup.cljs$lang$arity$3 = _lookup__3;
return _lookup;
})()
;
void 0;void 0;cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = (function _contains_key_QMARK_(coll,k){
if((function (){var and__132__auto____8643 = coll;
if(and__132__auto____8643)
{return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2;
} else
{return and__132__auto____8643;
}
})())
{return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(coll,k);
} else
{return (function (){var or__138__auto____8644 = (cljs.core._contains_key_QMARK_[goog.typeOf.call(null,coll)]);
if(or__138__auto____8644)
{return or__138__auto____8644;
} else
{var or__138__auto____8645 = (cljs.core._contains_key_QMARK_["_"]);
if(or__138__auto____8645)
{return or__138__auto____8645;
} else
{throw cljs.core.missing_protocol.call(null,"IAssociative.-contains-key?",coll);
}
}
})().call(null,coll,k);
}
});
cljs.core._assoc = (function _assoc(coll,k,v){
if((function (){var and__132__auto____8646 = coll;
if(and__132__auto____8646)
{return coll.cljs$core$IAssociative$_assoc$arity$3;
} else
{return and__132__auto____8646;
}
})())
{return coll.cljs$core$IAssociative$_assoc$arity$3(coll,k,v);
} else
{return (function (){var or__138__auto____8647 = (cljs.core._assoc[goog.typeOf.call(null,coll)]);
if(or__138__auto____8647)
{return or__138__auto____8647;
} else
{var or__138__auto____8648 = (cljs.core._assoc["_"]);
if(or__138__auto____8648)
{return or__138__auto____8648;
} else
{throw cljs.core.missing_protocol.call(null,"IAssociative.-assoc",coll);
}
}
})().call(null,coll,k,v);
}
});
void 0;void 0;cljs.core.IMap = {};
cljs.core._dissoc = (function _dissoc(coll,k){
if((function (){var and__132__auto____8649 = coll;
if(and__132__auto____8649)
{return coll.cljs$core$IMap$_dissoc$arity$2;
} else
{return and__132__auto____8649;
}
})())
{return coll.cljs$core$IMap$_dissoc$arity$2(coll,k);
} else
{return (function (){var or__138__auto____8650 = (cljs.core._dissoc[goog.typeOf.call(null,coll)]);
if(or__138__auto____8650)
{return or__138__auto____8650;
} else
{var or__138__auto____8651 = (cljs.core._dissoc["_"]);
if(or__138__auto____8651)
{return or__138__auto____8651;
} else
{throw cljs.core.missing_protocol.call(null,"IMap.-dissoc",coll);
}
}
})().call(null,coll,k);
}
});
void 0;void 0;cljs.core.IMapEntry = {};
cljs.core._key = (function _key(coll){
if((function (){var and__132__auto____8652 = coll;
if(and__132__auto____8652)
{return coll.cljs$core$IMapEntry$_key$arity$1;
} else
{return and__132__auto____8652;
}
})())
{return coll.cljs$core$IMapEntry$_key$arity$1(coll);
} else
{return (function (){var or__138__auto____8653 = (cljs.core._key[goog.typeOf.call(null,coll)]);
if(or__138__auto____8653)
{return or__138__auto____8653;
} else
{var or__138__auto____8654 = (cljs.core._key["_"]);
if(or__138__auto____8654)
{return or__138__auto____8654;
} else
{throw cljs.core.missing_protocol.call(null,"IMapEntry.-key",coll);
}
}
})().call(null,coll);
}
});
cljs.core._val = (function _val(coll){
if((function (){var and__132__auto____8655 = coll;
if(and__132__auto____8655)
{return coll.cljs$core$IMapEntry$_val$arity$1;
} else
{return and__132__auto____8655;
}
})())
{return coll.cljs$core$IMapEntry$_val$arity$1(coll);
} else
{return (function (){var or__138__auto____8656 = (cljs.core._val[goog.typeOf.call(null,coll)]);
if(or__138__auto____8656)
{return or__138__auto____8656;
} else
{var or__138__auto____8657 = (cljs.core._val["_"]);
if(or__138__auto____8657)
{return or__138__auto____8657;
} else
{throw cljs.core.missing_protocol.call(null,"IMapEntry.-val",coll);
}
}
})().call(null,coll);
}
});
void 0;void 0;cljs.core.ISet = {};
cljs.core._disjoin = (function _disjoin(coll,v){
if((function (){var and__132__auto____8658 = coll;
if(and__132__auto____8658)
{return coll.cljs$core$ISet$_disjoin$arity$2;
} else
{return and__132__auto____8658;
}
})())
{return coll.cljs$core$ISet$_disjoin$arity$2(coll,v);
} else
{return (function (){var or__138__auto____8659 = (cljs.core._disjoin[goog.typeOf.call(null,coll)]);
if(or__138__auto____8659)
{return or__138__auto____8659;
} else
{var or__138__auto____8660 = (cljs.core._disjoin["_"]);
if(or__138__auto____8660)
{return or__138__auto____8660;
} else
{throw cljs.core.missing_protocol.call(null,"ISet.-disjoin",coll);
}
}
})().call(null,coll,v);
}
});
void 0;void 0;cljs.core.IStack = {};
cljs.core._peek = (function _peek(coll){
if((function (){var and__132__auto____8661 = coll;
if(and__132__auto____8661)
{return coll.cljs$core$IStack$_peek$arity$1;
} else
{return and__132__auto____8661;
}
})())
{return coll.cljs$core$IStack$_peek$arity$1(coll);
} else
{return (function (){var or__138__auto____8662 = (cljs.core._peek[goog.typeOf.call(null,coll)]);
if(or__138__auto____8662)
{return or__138__auto____8662;
} else
{var or__138__auto____8663 = (cljs.core._peek["_"]);
if(or__138__auto____8663)
{return or__138__auto____8663;
} else
{throw cljs.core.missing_protocol.call(null,"IStack.-peek",coll);
}
}
})().call(null,coll);
}
});
cljs.core._pop = (function _pop(coll){
if((function (){var and__132__auto____8664 = coll;
if(and__132__auto____8664)
{return coll.cljs$core$IStack$_pop$arity$1;
} else
{return and__132__auto____8664;
}
})())
{return coll.cljs$core$IStack$_pop$arity$1(coll);
} else
{return (function (){var or__138__auto____8665 = (cljs.core._pop[goog.typeOf.call(null,coll)]);
if(or__138__auto____8665)
{return or__138__auto____8665;
} else
{var or__138__auto____8666 = (cljs.core._pop["_"]);
if(or__138__auto____8666)
{return or__138__auto____8666;
} else
{throw cljs.core.missing_protocol.call(null,"IStack.-pop",coll);
}
}
})().call(null,coll);
}
});
void 0;void 0;cljs.core.IVector = {};
cljs.core._assoc_n = (function _assoc_n(coll,n,val){
if((function (){var and__132__auto____8667 = coll;
if(and__132__auto____8667)
{return coll.cljs$core$IVector$_assoc_n$arity$3;
} else
{return and__132__auto____8667;
}
})())
{return coll.cljs$core$IVector$_assoc_n$arity$3(coll,n,val);
} else
{return (function (){var or__138__auto____8668 = (cljs.core._assoc_n[goog.typeOf.call(null,coll)]);
if(or__138__auto____8668)
{return or__138__auto____8668;
} else
{var or__138__auto____8669 = (cljs.core._assoc_n["_"]);
if(or__138__auto____8669)
{return or__138__auto____8669;
} else
{throw cljs.core.missing_protocol.call(null,"IVector.-assoc-n",coll);
}
}
})().call(null,coll,n,val);
}
});
void 0;void 0;cljs.core.IDeref = {};
cljs.core._deref = (function _deref(o){
if((function (){var and__132__auto____8670 = o;
if(and__132__auto____8670)
{return o.cljs$core$IDeref$_deref$arity$1;
} else
{return and__132__auto____8670;
}
})())
{return o.cljs$core$IDeref$_deref$arity$1(o);
} else
{return (function (){var or__138__auto____8671 = (cljs.core._deref[goog.typeOf.call(null,o)]);
if(or__138__auto____8671)
{return or__138__auto____8671;
} else
{var or__138__auto____8672 = (cljs.core._deref["_"]);
if(or__138__auto____8672)
{return or__138__auto____8672;
} else
{throw cljs.core.missing_protocol.call(null,"IDeref.-deref",o);
}
}
})().call(null,o);
}
});
void 0;void 0;cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = (function _deref_with_timeout(o,msec,timeout_val){
if((function (){var and__132__auto____8673 = o;
if(and__132__auto____8673)
{return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3;
} else
{return and__132__auto____8673;
}
})())
{return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(o,msec,timeout_val);
} else
{return (function (){var or__138__auto____8674 = (cljs.core._deref_with_timeout[goog.typeOf.call(null,o)]);
if(or__138__auto____8674)
{return or__138__auto____8674;
} else
{var or__138__auto____8675 = (cljs.core._deref_with_timeout["_"]);
if(or__138__auto____8675)
{return or__138__auto____8675;
} else
{throw cljs.core.missing_protocol.call(null,"IDerefWithTimeout.-deref-with-timeout",o);
}
}
})().call(null,o,msec,timeout_val);
}
});
void 0;void 0;cljs.core.IMeta = {};
cljs.core._meta = (function _meta(o){
if((function (){var and__132__auto____8676 = o;
if(and__132__auto____8676)
{return o.cljs$core$IMeta$_meta$arity$1;
} else
{return and__132__auto____8676;
}
})())
{return o.cljs$core$IMeta$_meta$arity$1(o);
} else
{return (function (){var or__138__auto____8677 = (cljs.core._meta[goog.typeOf.call(null,o)]);
if(or__138__auto____8677)
{return or__138__auto____8677;
} else
{var or__138__auto____8678 = (cljs.core._meta["_"]);
if(or__138__auto____8678)
{return or__138__auto____8678;
} else
{throw cljs.core.missing_protocol.call(null,"IMeta.-meta",o);
}
}
})().call(null,o);
}
});
void 0;void 0;cljs.core.IWithMeta = {};
cljs.core._with_meta = (function _with_meta(o,meta){
if((function (){var and__132__auto____8679 = o;
if(and__132__auto____8679)
{return o.cljs$core$IWithMeta$_with_meta$arity$2;
} else
{return and__132__auto____8679;
}
})())
{return o.cljs$core$IWithMeta$_with_meta$arity$2(o,meta);
} else
{return (function (){var or__138__auto____8680 = (cljs.core._with_meta[goog.typeOf.call(null,o)]);
if(or__138__auto____8680)
{return or__138__auto____8680;
} else
{var or__138__auto____8681 = (cljs.core._with_meta["_"]);
if(or__138__auto____8681)
{return or__138__auto____8681;
} else
{throw cljs.core.missing_protocol.call(null,"IWithMeta.-with-meta",o);
}
}
})().call(null,o,meta);
}
});
void 0;void 0;cljs.core.IReduce = {};
cljs.core._reduce = (function() {
var _reduce = null;
var _reduce__2 = (function (coll,f){
if((function (){var and__132__auto____8682 = coll;
if(and__132__auto____8682)
{return coll.cljs$core$IReduce$_reduce$arity$2;
} else
{return and__132__auto____8682;
}
})())
{return coll.cljs$core$IReduce$_reduce$arity$2(coll,f);
} else
{return (function (){var or__138__auto____8683 = (cljs.core._reduce[goog.typeOf.call(null,coll)]);
if(or__138__auto____8683)
{return or__138__auto____8683;
} else
{var or__138__auto____8684 = (cljs.core._reduce["_"]);
if(or__138__auto____8684)
{return or__138__auto____8684;
} else
{throw cljs.core.missing_protocol.call(null,"IReduce.-reduce",coll);
}
}
})().call(null,coll,f);
}
});
var _reduce__3 = (function (coll,f,start){
if((function (){var and__132__auto____8685 = coll;
if(and__132__auto____8685)
{return coll.cljs$core$IReduce$_reduce$arity$3;
} else
{return and__132__auto____8685;
}
})())
{return coll.cljs$core$IReduce$_reduce$arity$3(coll,f,start);
} else
{return (function (){var or__138__auto____8686 = (cljs.core._reduce[goog.typeOf.call(null,coll)]);
if(or__138__auto____8686)
{return or__138__auto____8686;
} else
{var or__138__auto____8687 = (cljs.core._reduce["_"]);
if(or__138__auto____8687)
{return or__138__auto____8687;
} else
{throw cljs.core.missing_protocol.call(null,"IReduce.-reduce",coll);
}
}
})().call(null,coll,f,start);
}
});
_reduce = function(coll,f,start){
switch(arguments.length){
case 2:
return _reduce__2.call(this,coll,f);
case 3:
return _reduce__3.call(this,coll,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
_reduce.cljs$lang$arity$2 = _reduce__2;
_reduce.cljs$lang$arity$3 = _reduce__3;
return _reduce;
})()
;
void 0;void 0;cljs.core.IKVReduce = {};
cljs.core._kv_reduce = (function _kv_reduce(coll,f,init){
if((function (){var and__132__auto____8688 = coll;
if(and__132__auto____8688)
{return coll.cljs$core$IKVReduce$_kv_reduce$arity$3;
} else
{return and__132__auto____8688;
}
})())
{return coll.cljs$core$IKVReduce$_kv_reduce$arity$3(coll,f,init);
} else
{return (function (){var or__138__auto____8689 = (cljs.core._kv_reduce[goog.typeOf.call(null,coll)]);
if(or__138__auto____8689)
{return or__138__auto____8689;
} else
{var or__138__auto____8690 = (cljs.core._kv_reduce["_"]);
if(or__138__auto____8690)
{return or__138__auto____8690;
} else
{throw cljs.core.missing_protocol.call(null,"IKVReduce.-kv-reduce",coll);
}
}
})().call(null,coll,f,init);
}
});
void 0;void 0;cljs.core.IEquiv = {};
cljs.core._equiv = (function _equiv(o,other){
if((function (){var and__132__auto____8691 = o;
if(and__132__auto____8691)
{return o.cljs$core$IEquiv$_equiv$arity$2;
} else
{return and__132__auto____8691;
}
})())
{return o.cljs$core$IEquiv$_equiv$arity$2(o,other);
} else
{return (function (){var or__138__auto____8692 = (cljs.core._equiv[goog.typeOf.call(null,o)]);
if(or__138__auto____8692)
{return or__138__auto____8692;
} else
{var or__138__auto____8693 = (cljs.core._equiv["_"]);
if(or__138__auto____8693)
{return or__138__auto____8693;
} else
{throw cljs.core.missing_protocol.call(null,"IEquiv.-equiv",o);
}
}
})().call(null,o,other);
}
});
void 0;void 0;cljs.core.IHash = {};
cljs.core._hash = (function _hash(o){
if((function (){var and__132__auto____8694 = o;
if(and__132__auto____8694)
{return o.cljs$core$IHash$_hash$arity$1;
} else
{return and__132__auto____8694;
}
})())
{return o.cljs$core$IHash$_hash$arity$1(o);
} else
{return (function (){var or__138__auto____8695 = (cljs.core._hash[goog.typeOf.call(null,o)]);
if(or__138__auto____8695)
{return or__138__auto____8695;
} else
{var or__138__auto____8696 = (cljs.core._hash["_"]);
if(or__138__auto____8696)
{return or__138__auto____8696;
} else
{throw cljs.core.missing_protocol.call(null,"IHash.-hash",o);
}
}
})().call(null,o);
}
});
void 0;void 0;cljs.core.ISeqable = {};
cljs.core._seq = (function _seq(o){
if((function (){var and__132__auto____8697 = o;
if(and__132__auto____8697)
{return o.cljs$core$ISeqable$_seq$arity$1;
} else
{return and__132__auto____8697;
}
})())
{return o.cljs$core$ISeqable$_seq$arity$1(o);
} else
{return (function (){var or__138__auto____8698 = (cljs.core._seq[goog.typeOf.call(null,o)]);
if(or__138__auto____8698)
{return or__138__auto____8698;
} else
{var or__138__auto____8699 = (cljs.core._seq["_"]);
if(or__138__auto____8699)
{return or__138__auto____8699;
} else
{throw cljs.core.missing_protocol.call(null,"ISeqable.-seq",o);
}
}
})().call(null,o);
}
});
void 0;void 0;cljs.core.ISequential = {};
void 0;void 0;cljs.core.IList = {};
void 0;void 0;cljs.core.IRecord = {};
void 0;void 0;cljs.core.IReversible = {};
cljs.core._rseq = (function _rseq(coll){
if((function (){var and__132__auto____8700 = coll;
if(and__132__auto____8700)
{return coll.cljs$core$IReversible$_rseq$arity$1;
} else
{return and__132__auto____8700;
}
})())
{return coll.cljs$core$IReversible$_rseq$arity$1(coll);
} else
{return (function (){var or__138__auto____8701 = (cljs.core._rseq[goog.typeOf.call(null,coll)]);
if(or__138__auto____8701)
{return or__138__auto____8701;
} else
{var or__138__auto____8702 = (cljs.core._rseq["_"]);
if(or__138__auto____8702)
{return or__138__auto____8702;
} else
{throw cljs.core.missing_protocol.call(null,"IReversible.-rseq",coll);
}
}
})().call(null,coll);
}
});
void 0;void 0;cljs.core.ISorted = {};
cljs.core._sorted_seq = (function _sorted_seq(coll,ascending_QMARK_){
if((function (){var and__132__auto____8703 = coll;
if(and__132__auto____8703)
{return coll.cljs$core$ISorted$_sorted_seq$arity$2;
} else
{return and__132__auto____8703;
}
})())
{return coll.cljs$core$ISorted$_sorted_seq$arity$2(coll,ascending_QMARK_);
} else
{return (function (){var or__138__auto____8704 = (cljs.core._sorted_seq[goog.typeOf.call(null,coll)]);
if(or__138__auto____8704)
{return or__138__auto____8704;
} else
{var or__138__auto____8705 = (cljs.core._sorted_seq["_"]);
if(or__138__auto____8705)
{return or__138__auto____8705;
} else
{throw cljs.core.missing_protocol.call(null,"ISorted.-sorted-seq",coll);
}
}
})().call(null,coll,ascending_QMARK_);
}
});
cljs.core._sorted_seq_from = (function _sorted_seq_from(coll,k,ascending_QMARK_){
if((function (){var and__132__auto____8706 = coll;
if(and__132__auto____8706)
{return coll.cljs$core$ISorted$_sorted_seq_from$arity$3;
} else
{return and__132__auto____8706;
}
})())
{return coll.cljs$core$ISorted$_sorted_seq_from$arity$3(coll,k,ascending_QMARK_);
} else
{return (function (){var or__138__auto____8707 = (cljs.core._sorted_seq_from[goog.typeOf.call(null,coll)]);
if(or__138__auto____8707)
{return or__138__auto____8707;
} else
{var or__138__auto____8708 = (cljs.core._sorted_seq_from["_"]);
if(or__138__auto____8708)
{return or__138__auto____8708;
} else
{throw cljs.core.missing_protocol.call(null,"ISorted.-sorted-seq-from",coll);
}
}
})().call(null,coll,k,ascending_QMARK_);
}
});
cljs.core._entry_key = (function _entry_key(coll,entry){
if((function (){var and__132__auto____8709 = coll;
if(and__132__auto____8709)
{return coll.cljs$core$ISorted$_entry_key$arity$2;
} else
{return and__132__auto____8709;
}
})())
{return coll.cljs$core$ISorted$_entry_key$arity$2(coll,entry);
} else
{return (function (){var or__138__auto____8710 = (cljs.core._entry_key[goog.typeOf.call(null,coll)]);
if(or__138__auto____8710)
{return or__138__auto____8710;
} else
{var or__138__auto____8711 = (cljs.core._entry_key["_"]);
if(or__138__auto____8711)
{return or__138__auto____8711;
} else
{throw cljs.core.missing_protocol.call(null,"ISorted.-entry-key",coll);
}
}
})().call(null,coll,entry);
}
});
cljs.core._comparator = (function _comparator(coll){
if((function (){var and__132__auto____8712 = coll;
if(and__132__auto____8712)
{return coll.cljs$core$ISorted$_comparator$arity$1;
} else
{return and__132__auto____8712;
}
})())
{return coll.cljs$core$ISorted$_comparator$arity$1(coll);
} else
{return (function (){var or__138__auto____8713 = (cljs.core._comparator[goog.typeOf.call(null,coll)]);
if(or__138__auto____8713)
{return or__138__auto____8713;
} else
{var or__138__auto____8714 = (cljs.core._comparator["_"]);
if(or__138__auto____8714)
{return or__138__auto____8714;
} else
{throw cljs.core.missing_protocol.call(null,"ISorted.-comparator",coll);
}
}
})().call(null,coll);
}
});
void 0;void 0;cljs.core.IPrintable = {};
cljs.core._pr_seq = (function _pr_seq(o,opts){
if((function (){var and__132__auto____8715 = o;
if(and__132__auto____8715)
{return o.cljs$core$IPrintable$_pr_seq$arity$2;
} else
{return and__132__auto____8715;
}
})())
{return o.cljs$core$IPrintable$_pr_seq$arity$2(o,opts);
} else
{return (function (){var or__138__auto____8716 = (cljs.core._pr_seq[goog.typeOf.call(null,o)]);
if(or__138__auto____8716)
{return or__138__auto____8716;
} else
{var or__138__auto____8717 = (cljs.core._pr_seq["_"]);
if(or__138__auto____8717)
{return or__138__auto____8717;
} else
{throw cljs.core.missing_protocol.call(null,"IPrintable.-pr-seq",o);
}
}
})().call(null,o,opts);
}
});
void 0;void 0;cljs.core.IPending = {};
cljs.core._realized_QMARK_ = (function _realized_QMARK_(d){
if((function (){var and__132__auto____8718 = d;
if(and__132__auto____8718)
{return d.cljs$core$IPending$_realized_QMARK_$arity$1;
} else
{return and__132__auto____8718;
}
})())
{return d.cljs$core$IPending$_realized_QMARK_$arity$1(d);
} else
{return (function (){var or__138__auto____8719 = (cljs.core._realized_QMARK_[goog.typeOf.call(null,d)]);
if(or__138__auto____8719)
{return or__138__auto____8719;
} else
{var or__138__auto____8720 = (cljs.core._realized_QMARK_["_"]);
if(or__138__auto____8720)
{return or__138__auto____8720;
} else
{throw cljs.core.missing_protocol.call(null,"IPending.-realized?",d);
}
}
})().call(null,d);
}
});
void 0;void 0;cljs.core.IWatchable = {};
cljs.core._notify_watches = (function _notify_watches(this$,oldval,newval){
if((function (){var and__132__auto____8721 = this$;
if(and__132__auto____8721)
{return this$.cljs$core$IWatchable$_notify_watches$arity$3;
} else
{return and__132__auto____8721;
}
})())
{return this$.cljs$core$IWatchable$_notify_watches$arity$3(this$,oldval,newval);
} else
{return (function (){var or__138__auto____8722 = (cljs.core._notify_watches[goog.typeOf.call(null,this$)]);
if(or__138__auto____8722)
{return or__138__auto____8722;
} else
{var or__138__auto____8723 = (cljs.core._notify_watches["_"]);
if(or__138__auto____8723)
{return or__138__auto____8723;
} else
{throw cljs.core.missing_protocol.call(null,"IWatchable.-notify-watches",this$);
}
}
})().call(null,this$,oldval,newval);
}
});
cljs.core._add_watch = (function _add_watch(this$,key,f){
if((function (){var and__132__auto____8724 = this$;
if(and__132__auto____8724)
{return this$.cljs$core$IWatchable$_add_watch$arity$3;
} else
{return and__132__auto____8724;
}
})())
{return this$.cljs$core$IWatchable$_add_watch$arity$3(this$,key,f);
} else
{return (function (){var or__138__auto____8725 = (cljs.core._add_watch[goog.typeOf.call(null,this$)]);
if(or__138__auto____8725)
{return or__138__auto____8725;
} else
{var or__138__auto____8726 = (cljs.core._add_watch["_"]);
if(or__138__auto____8726)
{return or__138__auto____8726;
} else
{throw cljs.core.missing_protocol.call(null,"IWatchable.-add-watch",this$);
}
}
})().call(null,this$,key,f);
}
});
cljs.core._remove_watch = (function _remove_watch(this$,key){
if((function (){var and__132__auto____8727 = this$;
if(and__132__auto____8727)
{return this$.cljs$core$IWatchable$_remove_watch$arity$2;
} else
{return and__132__auto____8727;
}
})())
{return this$.cljs$core$IWatchable$_remove_watch$arity$2(this$,key);
} else
{return (function (){var or__138__auto____8728 = (cljs.core._remove_watch[goog.typeOf.call(null,this$)]);
if(or__138__auto____8728)
{return or__138__auto____8728;
} else
{var or__138__auto____8729 = (cljs.core._remove_watch["_"]);
if(or__138__auto____8729)
{return or__138__auto____8729;
} else
{throw cljs.core.missing_protocol.call(null,"IWatchable.-remove-watch",this$);
}
}
})().call(null,this$,key);
}
});
void 0;void 0;cljs.core.IEditableCollection = {};
cljs.core._as_transient = (function _as_transient(coll){
if((function (){var and__132__auto____8730 = coll;
if(and__132__auto____8730)
{return coll.cljs$core$IEditableCollection$_as_transient$arity$1;
} else
{return and__132__auto____8730;
}
})())
{return coll.cljs$core$IEditableCollection$_as_transient$arity$1(coll);
} else
{return (function (){var or__138__auto____8731 = (cljs.core._as_transient[goog.typeOf.call(null,coll)]);
if(or__138__auto____8731)
{return or__138__auto____8731;
} else
{var or__138__auto____8732 = (cljs.core._as_transient["_"]);
if(or__138__auto____8732)
{return or__138__auto____8732;
} else
{throw cljs.core.missing_protocol.call(null,"IEditableCollection.-as-transient",coll);
}
}
})().call(null,coll);
}
});
void 0;void 0;cljs.core.ITransientCollection = {};
cljs.core._conj_BANG_ = (function _conj_BANG_(tcoll,val){
if((function (){var and__132__auto____8733 = tcoll;
if(and__132__auto____8733)
{return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2;
} else
{return and__132__auto____8733;
}
})())
{return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2(tcoll,val);
} else
{return (function (){var or__138__auto____8734 = (cljs.core._conj_BANG_[goog.typeOf.call(null,tcoll)]);
if(or__138__auto____8734)
{return or__138__auto____8734;
} else
{var or__138__auto____8735 = (cljs.core._conj_BANG_["_"]);
if(or__138__auto____8735)
{return or__138__auto____8735;
} else
{throw cljs.core.missing_protocol.call(null,"ITransientCollection.-conj!",tcoll);
}
}
})().call(null,tcoll,val);
}
});
cljs.core._persistent_BANG_ = (function _persistent_BANG_(tcoll){
if((function (){var and__132__auto____8736 = tcoll;
if(and__132__auto____8736)
{return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1;
} else
{return and__132__auto____8736;
}
})())
{return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(tcoll);
} else
{return (function (){var or__138__auto____8737 = (cljs.core._persistent_BANG_[goog.typeOf.call(null,tcoll)]);
if(or__138__auto____8737)
{return or__138__auto____8737;
} else
{var or__138__auto____8738 = (cljs.core._persistent_BANG_["_"]);
if(or__138__auto____8738)
{return or__138__auto____8738;
} else
{throw cljs.core.missing_protocol.call(null,"ITransientCollection.-persistent!",tcoll);
}
}
})().call(null,tcoll);
}
});
void 0;void 0;cljs.core.ITransientAssociative = {};
cljs.core._assoc_BANG_ = (function _assoc_BANG_(tcoll,key,val){
if((function (){var and__132__auto____8739 = tcoll;
if(and__132__auto____8739)
{return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3;
} else
{return and__132__auto____8739;
}
})())
{return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(tcoll,key,val);
} else
{return (function (){var or__138__auto____8740 = (cljs.core._assoc_BANG_[goog.typeOf.call(null,tcoll)]);
if(or__138__auto____8740)
{return or__138__auto____8740;
} else
{var or__138__auto____8741 = (cljs.core._assoc_BANG_["_"]);
if(or__138__auto____8741)
{return or__138__auto____8741;
} else
{throw cljs.core.missing_protocol.call(null,"ITransientAssociative.-assoc!",tcoll);
}
}
})().call(null,tcoll,key,val);
}
});
void 0;void 0;cljs.core.ITransientMap = {};
cljs.core._dissoc_BANG_ = (function _dissoc_BANG_(tcoll,key){
if((function (){var and__132__auto____8742 = tcoll;
if(and__132__auto____8742)
{return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2;
} else
{return and__132__auto____8742;
}
})())
{return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(tcoll,key);
} else
{return (function (){var or__138__auto____8743 = (cljs.core._dissoc_BANG_[goog.typeOf.call(null,tcoll)]);
if(or__138__auto____8743)
{return or__138__auto____8743;
} else
{var or__138__auto____8744 = (cljs.core._dissoc_BANG_["_"]);
if(or__138__auto____8744)
{return or__138__auto____8744;
} else
{throw cljs.core.missing_protocol.call(null,"ITransientMap.-dissoc!",tcoll);
}
}
})().call(null,tcoll,key);
}
});
void 0;void 0;cljs.core.ITransientVector = {};
cljs.core._assoc_n_BANG_ = (function _assoc_n_BANG_(tcoll,n,val){
if((function (){var and__132__auto____8745 = tcoll;
if(and__132__auto____8745)
{return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3;
} else
{return and__132__auto____8745;
}
})())
{return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(tcoll,n,val);
} else
{return (function (){var or__138__auto____8746 = (cljs.core._assoc_n_BANG_[goog.typeOf.call(null,tcoll)]);
if(or__138__auto____8746)
{return or__138__auto____8746;
} else
{var or__138__auto____8747 = (cljs.core._assoc_n_BANG_["_"]);
if(or__138__auto____8747)
{return or__138__auto____8747;
} else
{throw cljs.core.missing_protocol.call(null,"ITransientVector.-assoc-n!",tcoll);
}
}
})().call(null,tcoll,n,val);
}
});
cljs.core._pop_BANG_ = (function _pop_BANG_(tcoll){
if((function (){var and__132__auto____8748 = tcoll;
if(and__132__auto____8748)
{return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1;
} else
{return and__132__auto____8748;
}
})())
{return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1(tcoll);
} else
{return (function (){var or__138__auto____8749 = (cljs.core._pop_BANG_[goog.typeOf.call(null,tcoll)]);
if(or__138__auto____8749)
{return or__138__auto____8749;
} else
{var or__138__auto____8750 = (cljs.core._pop_BANG_["_"]);
if(or__138__auto____8750)
{return or__138__auto____8750;
} else
{throw cljs.core.missing_protocol.call(null,"ITransientVector.-pop!",tcoll);
}
}
})().call(null,tcoll);
}
});
void 0;void 0;cljs.core.ITransientSet = {};
cljs.core._disjoin_BANG_ = (function _disjoin_BANG_(tcoll,v){
if((function (){var and__132__auto____8751 = tcoll;
if(and__132__auto____8751)
{return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2;
} else
{return and__132__auto____8751;
}
})())
{return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(tcoll,v);
} else
{return (function (){var or__138__auto____8752 = (cljs.core._disjoin_BANG_[goog.typeOf.call(null,tcoll)]);
if(or__138__auto____8752)
{return or__138__auto____8752;
} else
{var or__138__auto____8753 = (cljs.core._disjoin_BANG_["_"]);
if(or__138__auto____8753)
{return or__138__auto____8753;
} else
{throw cljs.core.missing_protocol.call(null,"ITransientSet.-disjoin!",tcoll);
}
}
})().call(null,tcoll,v);
}
});
void 0;/**
* Tests if 2 arguments are the same object
*/
cljs.core.identical_QMARK_ = (function identical_QMARK_(x,y){
return (x === y);
});
void 0;
void 0;
/**
* Equality. Returns true if x equals y, false if not. Compares
* numbers and collections in a type-independent manner.  Clojure's immutable data
* structures define -equiv (and thus =) as a value, not an identity,
* comparison.
* @param {...*} var_args
*/
cljs.core._EQ_ = (function() {
var _EQ_ = null;
var _EQ___1 = (function (x){
return true;
});
var _EQ___2 = (function (x,y){
var or__138__auto____8754 = (x === y);
if(or__138__auto____8754)
{return or__138__auto____8754;
} else
{return cljs.core._equiv.call(null,x,y);
}
});
var _EQ___3 = (function() { 
var G__8755__delegate = function (x,y,more){
while(true){
if(cljs.core.truth_(_EQ_.call(null,x,y)))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__8756 = y;
var G__8757 = cljs.core.first.call(null,more);
var G__8758 = cljs.core.next.call(null,more);
x = G__8756;
y = G__8757;
more = G__8758;
continue;
}
} else
{return _EQ_.call(null,y,cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__8755 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8755__delegate.call(this, x, y, more);
};
G__8755.cljs$lang$maxFixedArity = 2;
G__8755.cljs$lang$applyTo = (function (arglist__8759){
var x = cljs.core.first(arglist__8759);
var y = cljs.core.first(cljs.core.next(arglist__8759));
var more = cljs.core.rest(cljs.core.next(arglist__8759));
return G__8755__delegate(x, y, more);
});
G__8755.cljs$lang$arity$variadic = G__8755__delegate;
return G__8755;
})()
;
_EQ_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return _EQ___1.call(this,x);
case 2:
return _EQ___2.call(this,x,y);
default:
return _EQ___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
_EQ_.cljs$lang$maxFixedArity = 2;
_EQ_.cljs$lang$applyTo = _EQ___3.cljs$lang$applyTo;
_EQ_.cljs$lang$arity$1 = _EQ___1;
_EQ_.cljs$lang$arity$2 = _EQ___2;
_EQ_.cljs$lang$arity$variadic = _EQ___3.cljs$lang$arity$variadic;
return _EQ_;
})()
;
/**
* Returns true if x is nil, false otherwise.
*/
cljs.core.nil_QMARK_ = (function nil_QMARK_(x){
return (x == null);
});
cljs.core.type = (function type(x){
if((function (){var or__138__auto____8760 = (x == null);
if(or__138__auto____8760)
{return or__138__auto____8760;
} else
{return (void 0 === x);
}
})())
{return null;
} else
{return (x).constructor;
}
});
void 0;
void 0;
void 0;
(cljs.core.IHash["null"] = true);
(cljs.core._hash["null"] = (function (o){
return 0;
}));
(cljs.core.ILookup["null"] = true);
(cljs.core._lookup["null"] = (function() {
var G__8761 = null;
var G__8761__2 = (function (o,k){
return null;
});
var G__8761__3 = (function (o,k,not_found){
return not_found;
});
G__8761 = function(o,k,not_found){
switch(arguments.length){
case 2:
return G__8761__2.call(this,o,k);
case 3:
return G__8761__3.call(this,o,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__8761;
})()
);
(cljs.core.IAssociative["null"] = true);
(cljs.core._assoc["null"] = (function (_,k,v){
return cljs.core.hash_map.call(null,k,v);
}));
(cljs.core.ICollection["null"] = true);
(cljs.core._conj["null"] = (function (_,o){
return cljs.core.list.call(null,o);
}));
(cljs.core.IReduce["null"] = true);
(cljs.core._reduce["null"] = (function() {
var G__8762 = null;
var G__8762__2 = (function (_,f){
return f.call(null);
});
var G__8762__3 = (function (_,f,start){
return start;
});
G__8762 = function(_,f,start){
switch(arguments.length){
case 2:
return G__8762__2.call(this,_,f);
case 3:
return G__8762__3.call(this,_,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return G__8762;
})()
);
(cljs.core.IPrintable["null"] = true);
(cljs.core._pr_seq["null"] = (function (o){
return cljs.core.list.call(null,"nil");
}));
(cljs.core.ISet["null"] = true);
(cljs.core._disjoin["null"] = (function (_,v){
return null;
}));
(cljs.core.ICounted["null"] = true);
(cljs.core._count["null"] = (function (_){
return 0;
}));
(cljs.core.IStack["null"] = true);
(cljs.core._peek["null"] = (function (_){
return null;
}));
(cljs.core._pop["null"] = (function (_){
return null;
}));
(cljs.core.ISeq["null"] = true);
(cljs.core._first["null"] = (function (_){
return null;
}));
(cljs.core._rest["null"] = (function (_){
return cljs.core.list.call(null);
}));
(cljs.core.IEquiv["null"] = true);
(cljs.core._equiv["null"] = (function (_,o){
return (o == null);
}));
(cljs.core.IWithMeta["null"] = true);
(cljs.core._with_meta["null"] = (function (_,meta){
return null;
}));
(cljs.core.IMeta["null"] = true);
(cljs.core._meta["null"] = (function (_){
return null;
}));
(cljs.core.IIndexed["null"] = true);
(cljs.core._nth["null"] = (function() {
var G__8763 = null;
var G__8763__2 = (function (_,n){
return null;
});
var G__8763__3 = (function (_,n,not_found){
return not_found;
});
G__8763 = function(_,n,not_found){
switch(arguments.length){
case 2:
return G__8763__2.call(this,_,n);
case 3:
return G__8763__3.call(this,_,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__8763;
})()
);
(cljs.core.IEmptyableCollection["null"] = true);
(cljs.core._empty["null"] = (function (_){
return null;
}));
(cljs.core.IMap["null"] = true);
(cljs.core._dissoc["null"] = (function (_,k){
return null;
}));
Date.prototype.cljs$core$IEquiv$ = true;
Date.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (o,other){
return (o.toString() === other.toString());
});
(cljs.core.IHash["number"] = true);
(cljs.core._hash["number"] = (function (o){
return o;
}));
(cljs.core.IEquiv["number"] = true);
(cljs.core._equiv["number"] = (function (x,o){
return (x === o);
}));
(cljs.core.IHash["boolean"] = true);
(cljs.core._hash["boolean"] = (function (o){
return ((o === true) ? 1 : 0);
}));
(cljs.core.IHash["function"] = true);
(cljs.core._hash["function"] = (function (o){
return goog.getUid.call(null,o);
}));
/**
* Returns a number one greater than num.
*/
cljs.core.inc = (function inc(x){
return (x + 1);
});
void 0;
void 0;
/**
* Accepts any collection which satisfies the ICount and IIndexed protocols and
* reduces them without incurring seq initialization
*/
cljs.core.ci_reduce = (function() {
var ci_reduce = null;
var ci_reduce__2 = (function (cicoll,f){
if((cljs.core._count.call(null,cicoll) === 0))
{return f.call(null);
} else
{var val__8764 = cljs.core._nth.call(null,cicoll,0);
var n__8765 = 1;
while(true){
if((n__8765 < cljs.core._count.call(null,cicoll)))
{var nval__8766 = f.call(null,val__8764,cljs.core._nth.call(null,cicoll,n__8765));
if(cljs.core.reduced_QMARK_.call(null,nval__8766))
{return cljs.core.deref.call(null,nval__8766);
} else
{{
var G__8773 = nval__8766;
var G__8774 = (n__8765 + 1);
val__8764 = G__8773;
n__8765 = G__8774;
continue;
}
}
} else
{return val__8764;
}
break;
}
}
});
var ci_reduce__3 = (function (cicoll,f,val){
var val__8767 = val;
var n__8768 = 0;
while(true){
if((n__8768 < cljs.core._count.call(null,cicoll)))
{var nval__8769 = f.call(null,val__8767,cljs.core._nth.call(null,cicoll,n__8768));
if(cljs.core.reduced_QMARK_.call(null,nval__8769))
{return cljs.core.deref.call(null,nval__8769);
} else
{{
var G__8775 = nval__8769;
var G__8776 = (n__8768 + 1);
val__8767 = G__8775;
n__8768 = G__8776;
continue;
}
}
} else
{return val__8767;
}
break;
}
});
var ci_reduce__4 = (function (cicoll,f,val,idx){
var val__8770 = val;
var n__8771 = idx;
while(true){
if((n__8771 < cljs.core._count.call(null,cicoll)))
{var nval__8772 = f.call(null,val__8770,cljs.core._nth.call(null,cicoll,n__8771));
if(cljs.core.reduced_QMARK_.call(null,nval__8772))
{return cljs.core.deref.call(null,nval__8772);
} else
{{
var G__8777 = nval__8772;
var G__8778 = (n__8771 + 1);
val__8770 = G__8777;
n__8771 = G__8778;
continue;
}
}
} else
{return val__8770;
}
break;
}
});
ci_reduce = function(cicoll,f,val,idx){
switch(arguments.length){
case 2:
return ci_reduce__2.call(this,cicoll,f);
case 3:
return ci_reduce__3.call(this,cicoll,f,val);
case 4:
return ci_reduce__4.call(this,cicoll,f,val,idx);
}
throw('Invalid arity: ' + arguments.length);
};
ci_reduce.cljs$lang$arity$2 = ci_reduce__2;
ci_reduce.cljs$lang$arity$3 = ci_reduce__3;
ci_reduce.cljs$lang$arity$4 = ci_reduce__4;
return ci_reduce;
})()
;
void 0;
void 0;
void 0;
void 0;

/**
* @constructor
*/
cljs.core.IndexedSeq = (function (a,i){
this.a = a;
this.i = i;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 15990906;
})
cljs.core.IndexedSeq.cljs$lang$type = true;
cljs.core.IndexedSeq.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.IndexedSeq");
});
cljs.core.IndexedSeq.prototype.cljs$core$IHash$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__8779 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.IndexedSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__8780 = this;
return cljs.core.cons.call(null,o,coll);
});
cljs.core.IndexedSeq.prototype.cljs$core$ASeq$ = true;
cljs.core.IndexedSeq.prototype.toString = (function (){
var this__8781 = this;
var this$__8782 = this;
return cljs.core.pr_str.call(null,this$__8782);
});
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (coll,f){
var this__8783 = this;
if(cljs.core.counted_QMARK_.call(null,this__8783.a))
{return cljs.core.ci_reduce.call(null,this__8783.a,f,(this__8783.a[this__8783.i]),(this__8783.i + 1));
} else
{return cljs.core.ci_reduce.call(null,coll,f,(this__8783.a[this__8783.i]),0);
}
});
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (coll,f,start){
var this__8784 = this;
if(cljs.core.counted_QMARK_.call(null,this__8784.a))
{return cljs.core.ci_reduce.call(null,this__8784.a,f,start,this__8784.i);
} else
{return cljs.core.ci_reduce.call(null,coll,f,start,0);
}
});
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this$){
var this__8785 = this;
return this$;
});
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = (function (_){
var this__8786 = this;
return (this__8786.a.length - this__8786.i);
});
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = (function (_){
var this__8787 = this;
return (this__8787.a[this__8787.i]);
});
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = (function (_){
var this__8788 = this;
if(((this__8788.i + 1) < this__8788.a.length))
{return (new cljs.core.IndexedSeq(this__8788.a,(this__8788.i + 1)));
} else
{return cljs.core.list.call(null);
}
});
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__8789 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (coll,n){
var this__8790 = this;
var i__8791 = (n + this__8790.i);
if((i__8791 < this__8790.a.length))
{return (this__8790.a[i__8791]);
} else
{return null;
}
});
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (coll,n,not_found){
var this__8792 = this;
var i__8793 = (n + this__8792.i);
if((i__8793 < this__8792.a.length))
{return (this__8792.a[i__8793]);
} else
{return not_found;
}
});
cljs.core.IndexedSeq;
cljs.core.prim_seq = (function() {
var prim_seq = null;
var prim_seq__1 = (function (prim){
return prim_seq.call(null,prim,0);
});
var prim_seq__2 = (function (prim,i){
if((prim.length === 0))
{return null;
} else
{return (new cljs.core.IndexedSeq(prim,i));
}
});
prim_seq = function(prim,i){
switch(arguments.length){
case 1:
return prim_seq__1.call(this,prim);
case 2:
return prim_seq__2.call(this,prim,i);
}
throw('Invalid arity: ' + arguments.length);
};
prim_seq.cljs$lang$arity$1 = prim_seq__1;
prim_seq.cljs$lang$arity$2 = prim_seq__2;
return prim_seq;
})()
;
cljs.core.array_seq = (function() {
var array_seq = null;
var array_seq__1 = (function (array){
return cljs.core.prim_seq.call(null,array,0);
});
var array_seq__2 = (function (array,i){
return cljs.core.prim_seq.call(null,array,i);
});
array_seq = function(array,i){
switch(arguments.length){
case 1:
return array_seq__1.call(this,array);
case 2:
return array_seq__2.call(this,array,i);
}
throw('Invalid arity: ' + arguments.length);
};
array_seq.cljs$lang$arity$1 = array_seq__1;
array_seq.cljs$lang$arity$2 = array_seq__2;
return array_seq;
})()
;
(cljs.core.IReduce["array"] = true);
(cljs.core._reduce["array"] = (function() {
var G__8794 = null;
var G__8794__2 = (function (array,f){
return cljs.core.ci_reduce.call(null,array,f);
});
var G__8794__3 = (function (array,f,start){
return cljs.core.ci_reduce.call(null,array,f,start);
});
G__8794 = function(array,f,start){
switch(arguments.length){
case 2:
return G__8794__2.call(this,array,f);
case 3:
return G__8794__3.call(this,array,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return G__8794;
})()
);
(cljs.core.ILookup["array"] = true);
(cljs.core._lookup["array"] = (function() {
var G__8795 = null;
var G__8795__2 = (function (array,k){
return (array[k]);
});
var G__8795__3 = (function (array,k,not_found){
return cljs.core._nth.call(null,array,k,not_found);
});
G__8795 = function(array,k,not_found){
switch(arguments.length){
case 2:
return G__8795__2.call(this,array,k);
case 3:
return G__8795__3.call(this,array,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__8795;
})()
);
(cljs.core.IIndexed["array"] = true);
(cljs.core._nth["array"] = (function() {
var G__8796 = null;
var G__8796__2 = (function (array,n){
if((n < array.length))
{return (array[n]);
} else
{return null;
}
});
var G__8796__3 = (function (array,n,not_found){
if((n < array.length))
{return (array[n]);
} else
{return not_found;
}
});
G__8796 = function(array,n,not_found){
switch(arguments.length){
case 2:
return G__8796__2.call(this,array,n);
case 3:
return G__8796__3.call(this,array,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__8796;
})()
);
(cljs.core.ICounted["array"] = true);
(cljs.core._count["array"] = (function (a){
return a.length;
}));
(cljs.core.ISeqable["array"] = true);
(cljs.core._seq["array"] = (function (array){
return cljs.core.array_seq.call(null,array,0);
}));
/**
* Returns a seq on the collection. If the collection is
* empty, returns nil.  (seq nil) returns nil. seq also works on
* Strings.
*/
cljs.core.seq = (function seq(coll){
if((coll != null))
{if((function (){var G__8797__8798 = coll;
if((G__8797__8798 != null))
{if((function (){var or__138__auto____8799 = (G__8797__8798.cljs$lang$protocol_mask$partition0$ & 32);
if(or__138__auto____8799)
{return or__138__auto____8799;
} else
{return G__8797__8798.cljs$core$ASeq$;
}
})())
{return true;
} else
{if((!G__8797__8798.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ASeq,G__8797__8798);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ASeq,G__8797__8798);
}
})())
{return coll;
} else
{return cljs.core._seq.call(null,coll);
}
} else
{return null;
}
});
/**
* Returns the first item in the collection. Calls seq on its
* argument. If coll is nil, returns nil.
*/
cljs.core.first = (function first(coll){
if((coll != null))
{if((function (){var G__8800__8801 = coll;
if((G__8800__8801 != null))
{if((function (){var or__138__auto____8802 = (G__8800__8801.cljs$lang$protocol_mask$partition0$ & 64);
if(or__138__auto____8802)
{return or__138__auto____8802;
} else
{return G__8800__8801.cljs$core$ISeq$;
}
})())
{return true;
} else
{if((!G__8800__8801.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,G__8800__8801);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,G__8800__8801);
}
})())
{return cljs.core._first.call(null,coll);
} else
{var s__8803 = cljs.core.seq.call(null,coll);
if((s__8803 != null))
{return cljs.core._first.call(null,s__8803);
} else
{return null;
}
}
} else
{return null;
}
});
/**
* Returns a possibly empty seq of the items after the first. Calls seq on its
* argument.
*/
cljs.core.rest = (function rest(coll){
if((coll != null))
{if((function (){var G__8804__8805 = coll;
if((G__8804__8805 != null))
{if((function (){var or__138__auto____8806 = (G__8804__8805.cljs$lang$protocol_mask$partition0$ & 64);
if(or__138__auto____8806)
{return or__138__auto____8806;
} else
{return G__8804__8805.cljs$core$ISeq$;
}
})())
{return true;
} else
{if((!G__8804__8805.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,G__8804__8805);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,G__8804__8805);
}
})())
{return cljs.core._rest.call(null,coll);
} else
{var s__8807 = cljs.core.seq.call(null,coll);
if((s__8807 != null))
{return cljs.core._rest.call(null,s__8807);
} else
{return cljs.core.List.EMPTY;
}
}
} else
{return cljs.core.List.EMPTY;
}
});
/**
* Returns a seq of the items after the first. Calls seq on its
* argument.  If there are no more items, returns nil
*/
cljs.core.next = (function next(coll){
if((coll != null))
{if((function (){var G__8808__8809 = coll;
if((G__8808__8809 != null))
{if((function (){var or__138__auto____8810 = (G__8808__8809.cljs$lang$protocol_mask$partition0$ & 64);
if(or__138__auto____8810)
{return or__138__auto____8810;
} else
{return G__8808__8809.cljs$core$ISeq$;
}
})())
{return true;
} else
{if((!G__8808__8809.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,G__8808__8809);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,G__8808__8809);
}
})())
{var coll__8811 = cljs.core._rest.call(null,coll);
if((coll__8811 != null))
{if((function (){var G__8812__8813 = coll__8811;
if((G__8812__8813 != null))
{if((function (){var or__138__auto____8814 = (G__8812__8813.cljs$lang$protocol_mask$partition0$ & 32);
if(or__138__auto____8814)
{return or__138__auto____8814;
} else
{return G__8812__8813.cljs$core$ASeq$;
}
})())
{return true;
} else
{if((!G__8812__8813.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ASeq,G__8812__8813);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ASeq,G__8812__8813);
}
})())
{return coll__8811;
} else
{return cljs.core._seq.call(null,coll__8811);
}
} else
{return null;
}
} else
{return cljs.core.seq.call(null,cljs.core.rest.call(null,coll));
}
} else
{return null;
}
});
/**
* Same as (first (next x))
*/
cljs.core.second = (function second(coll){
return cljs.core.first.call(null,cljs.core.next.call(null,coll));
});
/**
* Same as (first (first x))
*/
cljs.core.ffirst = (function ffirst(coll){
return cljs.core.first.call(null,cljs.core.first.call(null,coll));
});
/**
* Same as (next (first x))
*/
cljs.core.nfirst = (function nfirst(coll){
return cljs.core.next.call(null,cljs.core.first.call(null,coll));
});
/**
* Same as (first (next x))
*/
cljs.core.fnext = (function fnext(coll){
return cljs.core.first.call(null,cljs.core.next.call(null,coll));
});
/**
* Same as (next (next x))
*/
cljs.core.nnext = (function nnext(coll){
return cljs.core.next.call(null,cljs.core.next.call(null,coll));
});
/**
* Return the last item in coll, in linear time
*/
cljs.core.last = (function last(s){
while(true){
if(cljs.core.truth_(cljs.core.next.call(null,s)))
{{
var G__8815 = cljs.core.next.call(null,s);
s = G__8815;
continue;
}
} else
{return cljs.core.first.call(null,s);
}
break;
}
});
(cljs.core.IEquiv["_"] = true);
(cljs.core._equiv["_"] = (function (x,o){
return (x === o);
}));
/**
* Returns true if x is logical false, false otherwise.
*/
cljs.core.not = (function not(x){
if(cljs.core.truth_(x))
{return false;
} else
{return true;
}
});
/**
* conj[oin]. Returns a new collection with the xs
* 'added'. (conj nil item) returns (item).  The 'addition' may
* happen at different 'places' depending on the concrete type.
* @param {...*} var_args
*/
cljs.core.conj = (function() {
var conj = null;
var conj__2 = (function (coll,x){
return cljs.core._conj.call(null,coll,x);
});
var conj__3 = (function() { 
var G__8816__delegate = function (coll,x,xs){
while(true){
if(cljs.core.truth_(xs))
{{
var G__8817 = conj.call(null,coll,x);
var G__8818 = cljs.core.first.call(null,xs);
var G__8819 = cljs.core.next.call(null,xs);
coll = G__8817;
x = G__8818;
xs = G__8819;
continue;
}
} else
{return conj.call(null,coll,x);
}
break;
}
};
var G__8816 = function (coll,x,var_args){
var xs = null;
if (goog.isDef(var_args)) {
  xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8816__delegate.call(this, coll, x, xs);
};
G__8816.cljs$lang$maxFixedArity = 2;
G__8816.cljs$lang$applyTo = (function (arglist__8820){
var coll = cljs.core.first(arglist__8820);
var x = cljs.core.first(cljs.core.next(arglist__8820));
var xs = cljs.core.rest(cljs.core.next(arglist__8820));
return G__8816__delegate(coll, x, xs);
});
G__8816.cljs$lang$arity$variadic = G__8816__delegate;
return G__8816;
})()
;
conj = function(coll,x,var_args){
var xs = var_args;
switch(arguments.length){
case 2:
return conj__2.call(this,coll,x);
default:
return conj__3.cljs$lang$arity$variadic(coll,x, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
conj.cljs$lang$maxFixedArity = 2;
conj.cljs$lang$applyTo = conj__3.cljs$lang$applyTo;
conj.cljs$lang$arity$2 = conj__2;
conj.cljs$lang$arity$variadic = conj__3.cljs$lang$arity$variadic;
return conj;
})()
;
/**
* Returns an empty collection of the same category as coll, or nil
*/
cljs.core.empty = (function empty(coll){
return cljs.core._empty.call(null,coll);
});
void 0;
cljs.core.accumulating_seq_count = (function accumulating_seq_count(coll){
var s__8821 = cljs.core.seq.call(null,coll);
var acc__8822 = 0;
while(true){
if(cljs.core.counted_QMARK_.call(null,s__8821))
{return (acc__8822 + cljs.core._count.call(null,s__8821));
} else
{{
var G__8823 = cljs.core.next.call(null,s__8821);
var G__8824 = (acc__8822 + 1);
s__8821 = G__8823;
acc__8822 = G__8824;
continue;
}
}
break;
}
});
/**
* Returns the number of items in the collection. (count nil) returns
* 0.  Also works on strings, arrays, and Maps
*/
cljs.core.count = (function count(coll){
if(cljs.core.counted_QMARK_.call(null,coll))
{return cljs.core._count.call(null,coll);
} else
{return cljs.core.accumulating_seq_count.call(null,coll);
}
});
void 0;
cljs.core.linear_traversal_nth = (function() {
var linear_traversal_nth = null;
var linear_traversal_nth__2 = (function (coll,n){
if((coll == null))
{throw (new Error("Index out of bounds"));
} else
{if((n === 0))
{if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{return cljs.core.first.call(null,coll);
} else
{throw (new Error("Index out of bounds"));
}
} else
{if(cljs.core.indexed_QMARK_.call(null,coll))
{return cljs.core._nth.call(null,coll,n);
} else
{if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{return linear_traversal_nth.call(null,cljs.core.next.call(null,coll),(n - 1));
} else
{if("\uFDD0'else")
{throw (new Error("Index out of bounds"));
} else
{return null;
}
}
}
}
}
});
var linear_traversal_nth__3 = (function (coll,n,not_found){
if((coll == null))
{return not_found;
} else
{if((n === 0))
{if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{return cljs.core.first.call(null,coll);
} else
{return not_found;
}
} else
{if(cljs.core.indexed_QMARK_.call(null,coll))
{return cljs.core._nth.call(null,coll,n,not_found);
} else
{if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{return linear_traversal_nth.call(null,cljs.core.next.call(null,coll),(n - 1),not_found);
} else
{if("\uFDD0'else")
{return not_found;
} else
{return null;
}
}
}
}
}
});
linear_traversal_nth = function(coll,n,not_found){
switch(arguments.length){
case 2:
return linear_traversal_nth__2.call(this,coll,n);
case 3:
return linear_traversal_nth__3.call(this,coll,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
linear_traversal_nth.cljs$lang$arity$2 = linear_traversal_nth__2;
linear_traversal_nth.cljs$lang$arity$3 = linear_traversal_nth__3;
return linear_traversal_nth;
})()
;
/**
* Returns the value at the index. get returns nil if index out of
* bounds, nth throws an exception unless not-found is supplied.  nth
* also works for strings, arrays, regex Matchers and Lists, and,
* in O(n) time, for sequences.
*/
cljs.core.nth = (function() {
var nth = null;
var nth__2 = (function (coll,n){
if((coll != null))
{if((function (){var G__8825__8826 = coll;
if((G__8825__8826 != null))
{if((function (){var or__138__auto____8827 = (G__8825__8826.cljs$lang$protocol_mask$partition0$ & 16);
if(or__138__auto____8827)
{return or__138__auto____8827;
} else
{return G__8825__8826.cljs$core$IIndexed$;
}
})())
{return true;
} else
{if((!G__8825__8826.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IIndexed,G__8825__8826);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IIndexed,G__8825__8826);
}
})())
{return cljs.core._nth.call(null,coll,Math.floor(n));
} else
{return cljs.core.linear_traversal_nth.call(null,coll,Math.floor(n));
}
} else
{return null;
}
});
var nth__3 = (function (coll,n,not_found){
if((coll != null))
{if((function (){var G__8828__8829 = coll;
if((G__8828__8829 != null))
{if((function (){var or__138__auto____8830 = (G__8828__8829.cljs$lang$protocol_mask$partition0$ & 16);
if(or__138__auto____8830)
{return or__138__auto____8830;
} else
{return G__8828__8829.cljs$core$IIndexed$;
}
})())
{return true;
} else
{if((!G__8828__8829.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IIndexed,G__8828__8829);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IIndexed,G__8828__8829);
}
})())
{return cljs.core._nth.call(null,coll,Math.floor(n),not_found);
} else
{return cljs.core.linear_traversal_nth.call(null,coll,Math.floor(n),not_found);
}
} else
{return not_found;
}
});
nth = function(coll,n,not_found){
switch(arguments.length){
case 2:
return nth__2.call(this,coll,n);
case 3:
return nth__3.call(this,coll,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
nth.cljs$lang$arity$2 = nth__2;
nth.cljs$lang$arity$3 = nth__3;
return nth;
})()
;
/**
* Returns the value mapped to key, not-found or nil if key not present.
*/
cljs.core.get = (function() {
var get = null;
var get__2 = (function (o,k){
return cljs.core._lookup.call(null,o,k);
});
var get__3 = (function (o,k,not_found){
return cljs.core._lookup.call(null,o,k,not_found);
});
get = function(o,k,not_found){
switch(arguments.length){
case 2:
return get__2.call(this,o,k);
case 3:
return get__3.call(this,o,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
get.cljs$lang$arity$2 = get__2;
get.cljs$lang$arity$3 = get__3;
return get;
})()
;
/**
* assoc[iate]. When applied to a map, returns a new map of the
* same (hashed/sorted) type, that contains the mapping of key(s) to
* val(s). When applied to a vector, returns a new vector that
* contains val at index.
* @param {...*} var_args
*/
cljs.core.assoc = (function() {
var assoc = null;
var assoc__3 = (function (coll,k,v){
return cljs.core._assoc.call(null,coll,k,v);
});
var assoc__4 = (function() { 
var G__8832__delegate = function (coll,k,v,kvs){
while(true){
var ret__8831 = assoc.call(null,coll,k,v);
if(cljs.core.truth_(kvs))
{{
var G__8833 = ret__8831;
var G__8834 = cljs.core.first.call(null,kvs);
var G__8835 = cljs.core.second.call(null,kvs);
var G__8836 = cljs.core.nnext.call(null,kvs);
coll = G__8833;
k = G__8834;
v = G__8835;
kvs = G__8836;
continue;
}
} else
{return ret__8831;
}
break;
}
};
var G__8832 = function (coll,k,v,var_args){
var kvs = null;
if (goog.isDef(var_args)) {
  kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__8832__delegate.call(this, coll, k, v, kvs);
};
G__8832.cljs$lang$maxFixedArity = 3;
G__8832.cljs$lang$applyTo = (function (arglist__8837){
var coll = cljs.core.first(arglist__8837);
var k = cljs.core.first(cljs.core.next(arglist__8837));
var v = cljs.core.first(cljs.core.next(cljs.core.next(arglist__8837)));
var kvs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__8837)));
return G__8832__delegate(coll, k, v, kvs);
});
G__8832.cljs$lang$arity$variadic = G__8832__delegate;
return G__8832;
})()
;
assoc = function(coll,k,v,var_args){
var kvs = var_args;
switch(arguments.length){
case 3:
return assoc__3.call(this,coll,k,v);
default:
return assoc__4.cljs$lang$arity$variadic(coll,k,v, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
assoc.cljs$lang$maxFixedArity = 3;
assoc.cljs$lang$applyTo = assoc__4.cljs$lang$applyTo;
assoc.cljs$lang$arity$3 = assoc__3;
assoc.cljs$lang$arity$variadic = assoc__4.cljs$lang$arity$variadic;
return assoc;
})()
;
/**
* dissoc[iate]. Returns a new map of the same (hashed/sorted) type,
* that does not contain a mapping for key(s).
* @param {...*} var_args
*/
cljs.core.dissoc = (function() {
var dissoc = null;
var dissoc__1 = (function (coll){
return coll;
});
var dissoc__2 = (function (coll,k){
return cljs.core._dissoc.call(null,coll,k);
});
var dissoc__3 = (function() { 
var G__8839__delegate = function (coll,k,ks){
while(true){
var ret__8838 = dissoc.call(null,coll,k);
if(cljs.core.truth_(ks))
{{
var G__8840 = ret__8838;
var G__8841 = cljs.core.first.call(null,ks);
var G__8842 = cljs.core.next.call(null,ks);
coll = G__8840;
k = G__8841;
ks = G__8842;
continue;
}
} else
{return ret__8838;
}
break;
}
};
var G__8839 = function (coll,k,var_args){
var ks = null;
if (goog.isDef(var_args)) {
  ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8839__delegate.call(this, coll, k, ks);
};
G__8839.cljs$lang$maxFixedArity = 2;
G__8839.cljs$lang$applyTo = (function (arglist__8843){
var coll = cljs.core.first(arglist__8843);
var k = cljs.core.first(cljs.core.next(arglist__8843));
var ks = cljs.core.rest(cljs.core.next(arglist__8843));
return G__8839__delegate(coll, k, ks);
});
G__8839.cljs$lang$arity$variadic = G__8839__delegate;
return G__8839;
})()
;
dissoc = function(coll,k,var_args){
var ks = var_args;
switch(arguments.length){
case 1:
return dissoc__1.call(this,coll);
case 2:
return dissoc__2.call(this,coll,k);
default:
return dissoc__3.cljs$lang$arity$variadic(coll,k, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
dissoc.cljs$lang$maxFixedArity = 2;
dissoc.cljs$lang$applyTo = dissoc__3.cljs$lang$applyTo;
dissoc.cljs$lang$arity$1 = dissoc__1;
dissoc.cljs$lang$arity$2 = dissoc__2;
dissoc.cljs$lang$arity$variadic = dissoc__3.cljs$lang$arity$variadic;
return dissoc;
})()
;
/**
* Returns an object of the same type and value as obj, with
* map m as its metadata.
*/
cljs.core.with_meta = (function with_meta(o,meta){
return cljs.core._with_meta.call(null,o,meta);
});
/**
* Returns the metadata of obj, returns nil if there is no metadata.
*/
cljs.core.meta = (function meta(o){
if((function (){var G__8844__8845 = o;
if((G__8844__8845 != null))
{if((function (){var or__138__auto____8846 = (G__8844__8845.cljs$lang$protocol_mask$partition0$ & 65536);
if(or__138__auto____8846)
{return or__138__auto____8846;
} else
{return G__8844__8845.cljs$core$IMeta$;
}
})())
{return true;
} else
{if((!G__8844__8845.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IMeta,G__8844__8845);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IMeta,G__8844__8845);
}
})())
{return cljs.core._meta.call(null,o);
} else
{return null;
}
});
/**
* For a list or queue, same as first, for a vector, same as, but much
* more efficient than, last. If the collection is empty, returns nil.
*/
cljs.core.peek = (function peek(coll){
return cljs.core._peek.call(null,coll);
});
/**
* For a list or queue, returns a new list/queue without the first
* item, for a vector, returns a new vector without the last item.
* Note - not the same as next/butlast.
*/
cljs.core.pop = (function pop(coll){
return cljs.core._pop.call(null,coll);
});
/**
* disj[oin]. Returns a new set of the same (hashed/sorted) type, that
* does not contain key(s).
* @param {...*} var_args
*/
cljs.core.disj = (function() {
var disj = null;
var disj__1 = (function (coll){
return coll;
});
var disj__2 = (function (coll,k){
return cljs.core._disjoin.call(null,coll,k);
});
var disj__3 = (function() { 
var G__8848__delegate = function (coll,k,ks){
while(true){
var ret__8847 = disj.call(null,coll,k);
if(cljs.core.truth_(ks))
{{
var G__8849 = ret__8847;
var G__8850 = cljs.core.first.call(null,ks);
var G__8851 = cljs.core.next.call(null,ks);
coll = G__8849;
k = G__8850;
ks = G__8851;
continue;
}
} else
{return ret__8847;
}
break;
}
};
var G__8848 = function (coll,k,var_args){
var ks = null;
if (goog.isDef(var_args)) {
  ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8848__delegate.call(this, coll, k, ks);
};
G__8848.cljs$lang$maxFixedArity = 2;
G__8848.cljs$lang$applyTo = (function (arglist__8852){
var coll = cljs.core.first(arglist__8852);
var k = cljs.core.first(cljs.core.next(arglist__8852));
var ks = cljs.core.rest(cljs.core.next(arglist__8852));
return G__8848__delegate(coll, k, ks);
});
G__8848.cljs$lang$arity$variadic = G__8848__delegate;
return G__8848;
})()
;
disj = function(coll,k,var_args){
var ks = var_args;
switch(arguments.length){
case 1:
return disj__1.call(this,coll);
case 2:
return disj__2.call(this,coll,k);
default:
return disj__3.cljs$lang$arity$variadic(coll,k, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
disj.cljs$lang$maxFixedArity = 2;
disj.cljs$lang$applyTo = disj__3.cljs$lang$applyTo;
disj.cljs$lang$arity$1 = disj__1;
disj.cljs$lang$arity$2 = disj__2;
disj.cljs$lang$arity$variadic = disj__3.cljs$lang$arity$variadic;
return disj;
})()
;
cljs.core.hash = (function hash(o){
return cljs.core._hash.call(null,o);
});
/**
* Returns true if coll has no items - same as (not (seq coll)).
* Please use the idiom (seq x) rather than (not (empty? x))
*/
cljs.core.empty_QMARK_ = (function empty_QMARK_(coll){
return cljs.core.not.call(null,cljs.core.seq.call(null,coll));
});
/**
* Returns true if x satisfies ICollection
*/
cljs.core.coll_QMARK_ = (function coll_QMARK_(x){
if((x == null))
{return false;
} else
{var G__8853__8854 = x;
if((G__8853__8854 != null))
{if((function (){var or__138__auto____8855 = (G__8853__8854.cljs$lang$protocol_mask$partition0$ & 8);
if(or__138__auto____8855)
{return or__138__auto____8855;
} else
{return G__8853__8854.cljs$core$ICollection$;
}
})())
{return true;
} else
{if((!G__8853__8854.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ICollection,G__8853__8854);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ICollection,G__8853__8854);
}
}
});
/**
* Returns true if x satisfies ISet
*/
cljs.core.set_QMARK_ = (function set_QMARK_(x){
if((x == null))
{return false;
} else
{var G__8856__8857 = x;
if((G__8856__8857 != null))
{if((function (){var or__138__auto____8858 = (G__8856__8857.cljs$lang$protocol_mask$partition0$ & 2048);
if(or__138__auto____8858)
{return or__138__auto____8858;
} else
{return G__8856__8857.cljs$core$ISet$;
}
})())
{return true;
} else
{if((!G__8856__8857.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ISet,G__8856__8857);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISet,G__8856__8857);
}
}
});
/**
* Returns true if coll implements Associative
*/
cljs.core.associative_QMARK_ = (function associative_QMARK_(x){
var G__8859__8860 = x;
if((G__8859__8860 != null))
{if((function (){var or__138__auto____8861 = (G__8859__8860.cljs$lang$protocol_mask$partition0$ & 256);
if(or__138__auto____8861)
{return or__138__auto____8861;
} else
{return G__8859__8860.cljs$core$IAssociative$;
}
})())
{return true;
} else
{if((!G__8859__8860.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IAssociative,G__8859__8860);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IAssociative,G__8859__8860);
}
});
/**
* Returns true if coll satisfies ISequential
*/
cljs.core.sequential_QMARK_ = (function sequential_QMARK_(x){
var G__8862__8863 = x;
if((G__8862__8863 != null))
{if((function (){var or__138__auto____8864 = (G__8862__8863.cljs$lang$protocol_mask$partition0$ & 8388608);
if(or__138__auto____8864)
{return or__138__auto____8864;
} else
{return G__8862__8863.cljs$core$ISequential$;
}
})())
{return true;
} else
{if((!G__8862__8863.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ISequential,G__8862__8863);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISequential,G__8862__8863);
}
});
/**
* Returns true if coll implements count in constant time
*/
cljs.core.counted_QMARK_ = (function counted_QMARK_(x){
var G__8865__8866 = x;
if((G__8865__8866 != null))
{if((function (){var or__138__auto____8867 = (G__8865__8866.cljs$lang$protocol_mask$partition0$ & 2);
if(or__138__auto____8867)
{return or__138__auto____8867;
} else
{return G__8865__8866.cljs$core$ICounted$;
}
})())
{return true;
} else
{if((!G__8865__8866.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ICounted,G__8865__8866);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ICounted,G__8865__8866);
}
});
/**
* Returns true if coll implements nth in constant time
*/
cljs.core.indexed_QMARK_ = (function indexed_QMARK_(x){
var G__8868__8869 = x;
if((G__8868__8869 != null))
{if((function (){var or__138__auto____8870 = (G__8868__8869.cljs$lang$protocol_mask$partition0$ & 16);
if(or__138__auto____8870)
{return or__138__auto____8870;
} else
{return G__8868__8869.cljs$core$IIndexed$;
}
})())
{return true;
} else
{if((!G__8868__8869.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IIndexed,G__8868__8869);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IIndexed,G__8868__8869);
}
});
/**
* Returns true if coll satisfies IReduce
*/
cljs.core.reduceable_QMARK_ = (function reduceable_QMARK_(x){
var G__8871__8872 = x;
if((G__8871__8872 != null))
{if((function (){var or__138__auto____8873 = (G__8871__8872.cljs$lang$protocol_mask$partition0$ & 262144);
if(or__138__auto____8873)
{return or__138__auto____8873;
} else
{return G__8871__8872.cljs$core$IReduce$;
}
})())
{return true;
} else
{if((!G__8871__8872.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IReduce,G__8871__8872);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IReduce,G__8871__8872);
}
});
/**
* Return true if x satisfies IMap
*/
cljs.core.map_QMARK_ = (function map_QMARK_(x){
if((x == null))
{return false;
} else
{var G__8874__8875 = x;
if((G__8874__8875 != null))
{if((function (){var or__138__auto____8876 = (G__8874__8875.cljs$lang$protocol_mask$partition0$ & 512);
if(or__138__auto____8876)
{return or__138__auto____8876;
} else
{return G__8874__8875.cljs$core$IMap$;
}
})())
{return true;
} else
{if((!G__8874__8875.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IMap,G__8874__8875);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IMap,G__8874__8875);
}
}
});
/**
* Return true if x satisfies IVector
*/
cljs.core.vector_QMARK_ = (function vector_QMARK_(x){
var G__8877__8878 = x;
if((G__8877__8878 != null))
{if((function (){var or__138__auto____8879 = (G__8877__8878.cljs$lang$protocol_mask$partition0$ & 8192);
if(or__138__auto____8879)
{return or__138__auto____8879;
} else
{return G__8877__8878.cljs$core$IVector$;
}
})())
{return true;
} else
{if((!G__8877__8878.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IVector,G__8877__8878);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IVector,G__8877__8878);
}
});
/**
* @param {...*} var_args
*/
cljs.core.js_obj = (function() {
var js_obj = null;
var js_obj__0 = (function (){
return {};
});
var js_obj__1 = (function() { 
var G__8880__delegate = function (keyvals){
return cljs.core.apply.call(null,goog.object.create,keyvals);
};
var G__8880 = function (var_args){
var keyvals = null;
if (goog.isDef(var_args)) {
  keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__8880__delegate.call(this, keyvals);
};
G__8880.cljs$lang$maxFixedArity = 0;
G__8880.cljs$lang$applyTo = (function (arglist__8881){
var keyvals = cljs.core.seq(arglist__8881);;
return G__8880__delegate(keyvals);
});
G__8880.cljs$lang$arity$variadic = G__8880__delegate;
return G__8880;
})()
;
js_obj = function(var_args){
var keyvals = var_args;
switch(arguments.length){
case 0:
return js_obj__0.call(this);
default:
return js_obj__1.cljs$lang$arity$variadic(falsecljs.core.array_seq(arguments, 0));
}
throw('Invalid arity: ' + arguments.length);
};
js_obj.cljs$lang$maxFixedArity = 0;
js_obj.cljs$lang$applyTo = js_obj__1.cljs$lang$applyTo;
js_obj.cljs$lang$arity$0 = js_obj__0;
js_obj.cljs$lang$arity$variadic = js_obj__1.cljs$lang$arity$variadic;
return js_obj;
})()
;
cljs.core.js_keys = (function js_keys(obj){
var keys__8882 = [];
goog.object.forEach.call(null,obj,(function (val,key,obj){
return keys__8882.push(key);
}));
return keys__8882;
});
cljs.core.js_delete = (function js_delete(obj,key){
return delete obj[key];
});
cljs.core.array_copy = (function array_copy(from,i,to,j,len){
var i__8883 = i;
var j__8884 = j;
var len__8885 = len;
while(true){
if((len__8885 === 0))
{return to;
} else
{(to[j__8884] = (from[i__8883]));
{
var G__8886 = (i__8883 + 1);
var G__8887 = (j__8884 + 1);
var G__8888 = (len__8885 - 1);
i__8883 = G__8886;
j__8884 = G__8887;
len__8885 = G__8888;
continue;
}
}
break;
}
});
cljs.core.array_copy_downward = (function array_copy_downward(from,i,to,j,len){
var i__8889 = (i + (len - 1));
var j__8890 = (j + (len - 1));
var len__8891 = len;
while(true){
if((len__8891 === 0))
{return to;
} else
{(to[j__8890] = (from[i__8889]));
{
var G__8892 = (i__8889 - 1);
var G__8893 = (j__8890 - 1);
var G__8894 = (len__8891 - 1);
i__8889 = G__8892;
j__8890 = G__8893;
len__8891 = G__8894;
continue;
}
}
break;
}
});
cljs.core.lookup_sentinel = {};
/**
* Returns true if x is the value false, false otherwise.
*/
cljs.core.false_QMARK_ = (function false_QMARK_(x){
return x === false;
});
/**
* Returns true if x is the value true, false otherwise.
*/
cljs.core.true_QMARK_ = (function true_QMARK_(x){
return x === true;
});
cljs.core.undefined_QMARK_ = (function undefined_QMARK_(x){
return (void 0 === x);
});
cljs.core.instance_QMARK_ = (function instance_QMARK_(t,o){
return (o != null && (o instanceof t || o.constructor === t || t === Object));
});
/**
* Return true if s satisfies ISeq
*/
cljs.core.seq_QMARK_ = (function seq_QMARK_(s){
if((s == null))
{return false;
} else
{var G__8895__8896 = s;
if((G__8895__8896 != null))
{if((function (){var or__138__auto____8897 = (G__8895__8896.cljs$lang$protocol_mask$partition0$ & 64);
if(or__138__auto____8897)
{return or__138__auto____8897;
} else
{return G__8895__8896.cljs$core$ISeq$;
}
})())
{return true;
} else
{if((!G__8895__8896.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,G__8895__8896);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,G__8895__8896);
}
}
});
/**
* Return true if s satisfies ISeqable
*/
cljs.core.seqable_QMARK_ = (function seqable_QMARK_(s){
var G__8898__8899 = s;
if((G__8898__8899 != null))
{if((function (){var or__138__auto____8900 = (G__8898__8899.cljs$lang$protocol_mask$partition0$ & 4194304);
if(or__138__auto____8900)
{return or__138__auto____8900;
} else
{return G__8898__8899.cljs$core$ISeqable$;
}
})())
{return true;
} else
{if((!G__8898__8899.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeqable,G__8898__8899);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeqable,G__8898__8899);
}
});
cljs.core.boolean$ = (function boolean$(x){
if(cljs.core.truth_(x))
{return true;
} else
{return false;
}
});
cljs.core.string_QMARK_ = (function string_QMARK_(x){
var and__132__auto____8901 = goog.isString.call(null,x);
if(cljs.core.truth_(and__132__auto____8901))
{return cljs.core.not.call(null,(function (){var or__138__auto____8902 = (x.charAt(0) === "\uFDD0");
if(or__138__auto____8902)
{return or__138__auto____8902;
} else
{return (x.charAt(0) === "\uFDD1");
}
})());
} else
{return and__132__auto____8901;
}
});
cljs.core.keyword_QMARK_ = (function keyword_QMARK_(x){
var and__132__auto____8903 = goog.isString.call(null,x);
if(cljs.core.truth_(and__132__auto____8903))
{return (x.charAt(0) === "\uFDD0");
} else
{return and__132__auto____8903;
}
});
cljs.core.symbol_QMARK_ = (function symbol_QMARK_(x){
var and__132__auto____8904 = goog.isString.call(null,x);
if(cljs.core.truth_(and__132__auto____8904))
{return (x.charAt(0) === "\uFDD1");
} else
{return and__132__auto____8904;
}
});
cljs.core.number_QMARK_ = (function number_QMARK_(n){
return goog.isNumber.call(null,n);
});
cljs.core.fn_QMARK_ = (function fn_QMARK_(f){
return goog.isFunction.call(null,f);
});
cljs.core.ifn_QMARK_ = (function ifn_QMARK_(f){
var or__138__auto____8905 = cljs.core.fn_QMARK_.call(null,f);
if(or__138__auto____8905)
{return or__138__auto____8905;
} else
{var G__8906__8907 = f;
if((G__8906__8907 != null))
{if((function (){var or__138__auto____8908 = (G__8906__8907.cljs$lang$protocol_mask$partition0$ & 1);
if(or__138__auto____8908)
{return or__138__auto____8908;
} else
{return G__8906__8907.cljs$core$IFn$;
}
})())
{return true;
} else
{if((!G__8906__8907.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IFn,G__8906__8907);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IFn,G__8906__8907);
}
}
});
/**
* Returns true if n is an integer.  Warning: returns true on underflow condition.
*/
cljs.core.integer_QMARK_ = (function integer_QMARK_(n){
var and__132__auto____8909 = cljs.core.number_QMARK_.call(null,n);
if(and__132__auto____8909)
{return (n == n.toFixed());
} else
{return and__132__auto____8909;
}
});
/**
* Returns true if key is present in the given collection, otherwise
* returns false.  Note that for numerically indexed collections like
* vectors and arrays, this tests if the numeric key is within the
* range of indexes. 'contains?' operates constant or logarithmic time;
* it will not perform a linear search for a value.  See also 'some'.
*/
cljs.core.contains_QMARK_ = (function contains_QMARK_(coll,v){
if((cljs.core._lookup.call(null,coll,v,cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel))
{return false;
} else
{return true;
}
});
/**
* Returns the map entry for key, or nil if key not present.
*/
cljs.core.find = (function find(coll,k){
if(cljs.core.truth_((function (){var and__132__auto____8910 = coll;
if(cljs.core.truth_(and__132__auto____8910))
{var and__132__auto____8911 = cljs.core.associative_QMARK_.call(null,coll);
if(and__132__auto____8911)
{return cljs.core.contains_QMARK_.call(null,coll,k);
} else
{return and__132__auto____8911;
}
} else
{return and__132__auto____8910;
}
})()))
{return cljs.core.PersistentVector.fromArray([k,cljs.core._lookup.call(null,coll,k)]);
} else
{return null;
}
});
/**
* Returns true if no two of the arguments are =
* @param {...*} var_args
*/
cljs.core.distinct_QMARK_ = (function() {
var distinct_QMARK_ = null;
var distinct_QMARK___1 = (function (x){
return true;
});
var distinct_QMARK___2 = (function (x,y){
return cljs.core.not.call(null,cljs.core._EQ_.call(null,x,y));
});
var distinct_QMARK___3 = (function() { 
var G__8916__delegate = function (x,y,more){
if(cljs.core.not.call(null,cljs.core._EQ_.call(null,x,y)))
{var s__8912 = cljs.core.set([y,x]);
var xs__8913 = more;
while(true){
var x__8914 = cljs.core.first.call(null,xs__8913);
var etc__8915 = cljs.core.next.call(null,xs__8913);
if(cljs.core.truth_(xs__8913))
{if(cljs.core.contains_QMARK_.call(null,s__8912,x__8914))
{return false;
} else
{{
var G__8917 = cljs.core.conj.call(null,s__8912,x__8914);
var G__8918 = etc__8915;
s__8912 = G__8917;
xs__8913 = G__8918;
continue;
}
}
} else
{return true;
}
break;
}
} else
{return false;
}
};
var G__8916 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8916__delegate.call(this, x, y, more);
};
G__8916.cljs$lang$maxFixedArity = 2;
G__8916.cljs$lang$applyTo = (function (arglist__8919){
var x = cljs.core.first(arglist__8919);
var y = cljs.core.first(cljs.core.next(arglist__8919));
var more = cljs.core.rest(cljs.core.next(arglist__8919));
return G__8916__delegate(x, y, more);
});
G__8916.cljs$lang$arity$variadic = G__8916__delegate;
return G__8916;
})()
;
distinct_QMARK_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return distinct_QMARK___1.call(this,x);
case 2:
return distinct_QMARK___2.call(this,x,y);
default:
return distinct_QMARK___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
distinct_QMARK_.cljs$lang$maxFixedArity = 2;
distinct_QMARK_.cljs$lang$applyTo = distinct_QMARK___3.cljs$lang$applyTo;
distinct_QMARK_.cljs$lang$arity$1 = distinct_QMARK___1;
distinct_QMARK_.cljs$lang$arity$2 = distinct_QMARK___2;
distinct_QMARK_.cljs$lang$arity$variadic = distinct_QMARK___3.cljs$lang$arity$variadic;
return distinct_QMARK_;
})()
;
/**
* Comparator. Returns a negative number, zero, or a positive number
* when x is logically 'less than', 'equal to', or 'greater than'
* y. Uses google.array.defaultCompare for objects of the same type
* and special-cases nil to be less than any other object.
*/
cljs.core.compare = (function compare(x,y){
if((cljs.core.type.call(null,x) === cljs.core.type.call(null,y)))
{return goog.array.defaultCompare.call(null,x,y);
} else
{if((x == null))
{return -1;
} else
{if((y == null))
{return 1;
} else
{if("\uFDD0'else")
{throw (new Error("compare on non-nil objects of different types"));
} else
{return null;
}
}
}
}
});
/**
* Given a fn that might be boolean valued or a comparator,
* return a fn that is a comparator.
*/
cljs.core.fn__GT_comparator = (function fn__GT_comparator(f){
if(cljs.core._EQ_.call(null,f,cljs.core.compare))
{return cljs.core.compare;
} else
{return (function (x,y){
var r__8920 = f.call(null,x,y);
if(cljs.core.number_QMARK_.call(null,r__8920))
{return r__8920;
} else
{if(cljs.core.truth_(r__8920))
{return -1;
} else
{if(cljs.core.truth_(f.call(null,y,x)))
{return 1;
} else
{return 0;
}
}
}
});
}
});
void 0;
/**
* Returns a sorted sequence of the items in coll. Comp can be
* boolean-valued comparison funcion, or a -/0/+ valued comparator.
* Comp defaults to compare.
*/
cljs.core.sort = (function() {
var sort = null;
var sort__1 = (function (coll){
return sort.call(null,cljs.core.compare,coll);
});
var sort__2 = (function (comp,coll){
if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{var a__8921 = cljs.core.to_array.call(null,coll);
goog.array.stableSort.call(null,a__8921,cljs.core.fn__GT_comparator.call(null,comp));
return cljs.core.seq.call(null,a__8921);
} else
{return cljs.core.List.EMPTY;
}
});
sort = function(comp,coll){
switch(arguments.length){
case 1:
return sort__1.call(this,comp);
case 2:
return sort__2.call(this,comp,coll);
}
throw('Invalid arity: ' + arguments.length);
};
sort.cljs$lang$arity$1 = sort__1;
sort.cljs$lang$arity$2 = sort__2;
return sort;
})()
;
/**
* Returns a sorted sequence of the items in coll, where the sort
* order is determined by comparing (keyfn item).  Comp can be
* boolean-valued comparison funcion, or a -/0/+ valued comparator.
* Comp defaults to compare.
*/
cljs.core.sort_by = (function() {
var sort_by = null;
var sort_by__2 = (function (keyfn,coll){
return sort_by.call(null,keyfn,cljs.core.compare,coll);
});
var sort_by__3 = (function (keyfn,comp,coll){
return cljs.core.sort.call(null,(function (x,y){
return cljs.core.fn__GT_comparator.call(null,comp).call(null,keyfn.call(null,x),keyfn.call(null,y));
}),coll);
});
sort_by = function(keyfn,comp,coll){
switch(arguments.length){
case 2:
return sort_by__2.call(this,keyfn,comp);
case 3:
return sort_by__3.call(this,keyfn,comp,coll);
}
throw('Invalid arity: ' + arguments.length);
};
sort_by.cljs$lang$arity$2 = sort_by__2;
sort_by.cljs$lang$arity$3 = sort_by__3;
return sort_by;
})()
;
cljs.core.seq_reduce = (function() {
var seq_reduce = null;
var seq_reduce__2 = (function (f,coll){
var temp__317__auto____8922 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__317__auto____8922))
{var s__8923 = temp__317__auto____8922;
return cljs.core.reduce.call(null,f,cljs.core.first.call(null,s__8923),cljs.core.next.call(null,s__8923));
} else
{return f.call(null);
}
});
var seq_reduce__3 = (function (f,val,coll){
var val__8924 = val;
var coll__8925 = cljs.core.seq.call(null,coll);
while(true){
if(cljs.core.truth_(coll__8925))
{var nval__8926 = f.call(null,val__8924,cljs.core.first.call(null,coll__8925));
if(cljs.core.reduced_QMARK_.call(null,nval__8926))
{return cljs.core.deref.call(null,nval__8926);
} else
{{
var G__8927 = nval__8926;
var G__8928 = cljs.core.next.call(null,coll__8925);
val__8924 = G__8927;
coll__8925 = G__8928;
continue;
}
}
} else
{return val__8924;
}
break;
}
});
seq_reduce = function(f,val,coll){
switch(arguments.length){
case 2:
return seq_reduce__2.call(this,f,val);
case 3:
return seq_reduce__3.call(this,f,val,coll);
}
throw('Invalid arity: ' + arguments.length);
};
seq_reduce.cljs$lang$arity$2 = seq_reduce__2;
seq_reduce.cljs$lang$arity$3 = seq_reduce__3;
return seq_reduce;
})()
;
/**
* f should be a function of 2 arguments. If val is not supplied,
* returns the result of applying f to the first 2 items in coll, then
* applying f to that result and the 3rd item, etc. If coll contains no
* items, f must accept no arguments as well, and reduce returns the
* result of calling f with no arguments.  If coll has only 1 item, it
* is returned and f is not called.  If val is supplied, returns the
* result of applying f to val and the first item in coll, then
* applying f to that result and the 2nd item, etc. If coll contains no
* items, returns val and f is not called.
*/
cljs.core.reduce = (function() {
var reduce = null;
var reduce__2 = (function (f,coll){
if((function (){var G__8929__8930 = coll;
if((G__8929__8930 != null))
{if((function (){var or__138__auto____8931 = (G__8929__8930.cljs$lang$protocol_mask$partition0$ & 262144);
if(or__138__auto____8931)
{return or__138__auto____8931;
} else
{return G__8929__8930.cljs$core$IReduce$;
}
})())
{return true;
} else
{if((!G__8929__8930.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IReduce,G__8929__8930);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IReduce,G__8929__8930);
}
})())
{return cljs.core._reduce.call(null,coll,f);
} else
{return cljs.core.seq_reduce.call(null,f,coll);
}
});
var reduce__3 = (function (f,val,coll){
if((function (){var G__8932__8933 = coll;
if((G__8932__8933 != null))
{if((function (){var or__138__auto____8934 = (G__8932__8933.cljs$lang$protocol_mask$partition0$ & 262144);
if(or__138__auto____8934)
{return or__138__auto____8934;
} else
{return G__8932__8933.cljs$core$IReduce$;
}
})())
{return true;
} else
{if((!G__8932__8933.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IReduce,G__8932__8933);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IReduce,G__8932__8933);
}
})())
{return cljs.core._reduce.call(null,coll,f,val);
} else
{return cljs.core.seq_reduce.call(null,f,val,coll);
}
});
reduce = function(f,val,coll){
switch(arguments.length){
case 2:
return reduce__2.call(this,f,val);
case 3:
return reduce__3.call(this,f,val,coll);
}
throw('Invalid arity: ' + arguments.length);
};
reduce.cljs$lang$arity$2 = reduce__2;
reduce.cljs$lang$arity$3 = reduce__3;
return reduce;
})()
;
/**
* Reduces an associative collection. f should be a function of 3
* arguments. Returns the result of applying f to init, the first key
* and the first value in coll, then applying f to that result and the
* 2nd key and value, etc. If coll contains no entries, returns init
* and f is not called. Note that reduce-kv is supported on vectors,
* where the keys will be the ordinals.
*/
cljs.core.reduce_kv = (function reduce_kv(f,init,coll){
return cljs.core._kv_reduce.call(null,coll,f,init);
});

/**
* @constructor
*/
cljs.core.Reduced = (function (val){
this.val = val;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 16384;
})
cljs.core.Reduced.cljs$lang$type = true;
cljs.core.Reduced.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.Reduced");
});
cljs.core.Reduced.prototype.cljs$core$IDeref$ = true;
cljs.core.Reduced.prototype.cljs$core$IDeref$_deref$arity$1 = (function (o){
var this__8935 = this;
return this__8935.val;
});
cljs.core.Reduced;
/**
* Returns true if x is the result of a call to reduced
*/
cljs.core.reduced_QMARK_ = (function reduced_QMARK_(r){
return cljs.core.instance_QMARK_.call(null,cljs.core.Reduced,r);
});
/**
* Wraps x in a way such that a reduce will terminate with the value x
*/
cljs.core.reduced = (function reduced(x){
return (new cljs.core.Reduced(x));
});
/**
* Returns the sum of nums. (+) returns 0.
* @param {...*} var_args
*/
cljs.core._PLUS_ = (function() {
var _PLUS_ = null;
var _PLUS___0 = (function (){
return 0;
});
var _PLUS___1 = (function (x){
return x;
});
var _PLUS___2 = (function (x,y){
return (x + y);
});
var _PLUS___3 = (function() { 
var G__8936__delegate = function (x,y,more){
return cljs.core.reduce.call(null,_PLUS_,(x + y),more);
};
var G__8936 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8936__delegate.call(this, x, y, more);
};
G__8936.cljs$lang$maxFixedArity = 2;
G__8936.cljs$lang$applyTo = (function (arglist__8937){
var x = cljs.core.first(arglist__8937);
var y = cljs.core.first(cljs.core.next(arglist__8937));
var more = cljs.core.rest(cljs.core.next(arglist__8937));
return G__8936__delegate(x, y, more);
});
G__8936.cljs$lang$arity$variadic = G__8936__delegate;
return G__8936;
})()
;
_PLUS_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 0:
return _PLUS___0.call(this);
case 1:
return _PLUS___1.call(this,x);
case 2:
return _PLUS___2.call(this,x,y);
default:
return _PLUS___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
_PLUS_.cljs$lang$maxFixedArity = 2;
_PLUS_.cljs$lang$applyTo = _PLUS___3.cljs$lang$applyTo;
_PLUS_.cljs$lang$arity$0 = _PLUS___0;
_PLUS_.cljs$lang$arity$1 = _PLUS___1;
_PLUS_.cljs$lang$arity$2 = _PLUS___2;
_PLUS_.cljs$lang$arity$variadic = _PLUS___3.cljs$lang$arity$variadic;
return _PLUS_;
})()
;
/**
* If no ys are supplied, returns the negation of x, else subtracts
* the ys from x and returns the result.
* @param {...*} var_args
*/
cljs.core._ = (function() {
var _ = null;
var ___1 = (function (x){
return (- x);
});
var ___2 = (function (x,y){
return (x - y);
});
var ___3 = (function() { 
var G__8938__delegate = function (x,y,more){
return cljs.core.reduce.call(null,_,(x - y),more);
};
var G__8938 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8938__delegate.call(this, x, y, more);
};
G__8938.cljs$lang$maxFixedArity = 2;
G__8938.cljs$lang$applyTo = (function (arglist__8939){
var x = cljs.core.first(arglist__8939);
var y = cljs.core.first(cljs.core.next(arglist__8939));
var more = cljs.core.rest(cljs.core.next(arglist__8939));
return G__8938__delegate(x, y, more);
});
G__8938.cljs$lang$arity$variadic = G__8938__delegate;
return G__8938;
})()
;
_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return ___1.call(this,x);
case 2:
return ___2.call(this,x,y);
default:
return ___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
_.cljs$lang$maxFixedArity = 2;
_.cljs$lang$applyTo = ___3.cljs$lang$applyTo;
_.cljs$lang$arity$1 = ___1;
_.cljs$lang$arity$2 = ___2;
_.cljs$lang$arity$variadic = ___3.cljs$lang$arity$variadic;
return _;
})()
;
/**
* Returns the product of nums. (*) returns 1.
* @param {...*} var_args
*/
cljs.core._STAR_ = (function() {
var _STAR_ = null;
var _STAR___0 = (function (){
return 1;
});
var _STAR___1 = (function (x){
return x;
});
var _STAR___2 = (function (x,y){
return (x * y);
});
var _STAR___3 = (function() { 
var G__8940__delegate = function (x,y,more){
return cljs.core.reduce.call(null,_STAR_,(x * y),more);
};
var G__8940 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8940__delegate.call(this, x, y, more);
};
G__8940.cljs$lang$maxFixedArity = 2;
G__8940.cljs$lang$applyTo = (function (arglist__8941){
var x = cljs.core.first(arglist__8941);
var y = cljs.core.first(cljs.core.next(arglist__8941));
var more = cljs.core.rest(cljs.core.next(arglist__8941));
return G__8940__delegate(x, y, more);
});
G__8940.cljs$lang$arity$variadic = G__8940__delegate;
return G__8940;
})()
;
_STAR_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 0:
return _STAR___0.call(this);
case 1:
return _STAR___1.call(this,x);
case 2:
return _STAR___2.call(this,x,y);
default:
return _STAR___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
_STAR_.cljs$lang$maxFixedArity = 2;
_STAR_.cljs$lang$applyTo = _STAR___3.cljs$lang$applyTo;
_STAR_.cljs$lang$arity$0 = _STAR___0;
_STAR_.cljs$lang$arity$1 = _STAR___1;
_STAR_.cljs$lang$arity$2 = _STAR___2;
_STAR_.cljs$lang$arity$variadic = _STAR___3.cljs$lang$arity$variadic;
return _STAR_;
})()
;
/**
* If no denominators are supplied, returns 1/numerator,
* else returns numerator divided by all of the denominators.
* @param {...*} var_args
*/
cljs.core._SLASH_ = (function() {
var _SLASH_ = null;
var _SLASH___1 = (function (x){
return _SLASH_.call(null,1,x);
});
var _SLASH___2 = (function (x,y){
return (x / y);
});
var _SLASH___3 = (function() { 
var G__8942__delegate = function (x,y,more){
return cljs.core.reduce.call(null,_SLASH_,_SLASH_.call(null,x,y),more);
};
var G__8942 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8942__delegate.call(this, x, y, more);
};
G__8942.cljs$lang$maxFixedArity = 2;
G__8942.cljs$lang$applyTo = (function (arglist__8943){
var x = cljs.core.first(arglist__8943);
var y = cljs.core.first(cljs.core.next(arglist__8943));
var more = cljs.core.rest(cljs.core.next(arglist__8943));
return G__8942__delegate(x, y, more);
});
G__8942.cljs$lang$arity$variadic = G__8942__delegate;
return G__8942;
})()
;
_SLASH_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return _SLASH___1.call(this,x);
case 2:
return _SLASH___2.call(this,x,y);
default:
return _SLASH___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
_SLASH_.cljs$lang$maxFixedArity = 2;
_SLASH_.cljs$lang$applyTo = _SLASH___3.cljs$lang$applyTo;
_SLASH_.cljs$lang$arity$1 = _SLASH___1;
_SLASH_.cljs$lang$arity$2 = _SLASH___2;
_SLASH_.cljs$lang$arity$variadic = _SLASH___3.cljs$lang$arity$variadic;
return _SLASH_;
})()
;
/**
* Returns non-nil if nums are in monotonically increasing order,
* otherwise false.
* @param {...*} var_args
*/
cljs.core._LT_ = (function() {
var _LT_ = null;
var _LT___1 = (function (x){
return true;
});
var _LT___2 = (function (x,y){
return (x < y);
});
var _LT___3 = (function() { 
var G__8944__delegate = function (x,y,more){
while(true){
if((x < y))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__8945 = y;
var G__8946 = cljs.core.first.call(null,more);
var G__8947 = cljs.core.next.call(null,more);
x = G__8945;
y = G__8946;
more = G__8947;
continue;
}
} else
{return (y < cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__8944 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8944__delegate.call(this, x, y, more);
};
G__8944.cljs$lang$maxFixedArity = 2;
G__8944.cljs$lang$applyTo = (function (arglist__8948){
var x = cljs.core.first(arglist__8948);
var y = cljs.core.first(cljs.core.next(arglist__8948));
var more = cljs.core.rest(cljs.core.next(arglist__8948));
return G__8944__delegate(x, y, more);
});
G__8944.cljs$lang$arity$variadic = G__8944__delegate;
return G__8944;
})()
;
_LT_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return _LT___1.call(this,x);
case 2:
return _LT___2.call(this,x,y);
default:
return _LT___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
_LT_.cljs$lang$maxFixedArity = 2;
_LT_.cljs$lang$applyTo = _LT___3.cljs$lang$applyTo;
_LT_.cljs$lang$arity$1 = _LT___1;
_LT_.cljs$lang$arity$2 = _LT___2;
_LT_.cljs$lang$arity$variadic = _LT___3.cljs$lang$arity$variadic;
return _LT_;
})()
;
/**
* Returns non-nil if nums are in monotonically non-decreasing order,
* otherwise false.
* @param {...*} var_args
*/
cljs.core._LT__EQ_ = (function() {
var _LT__EQ_ = null;
var _LT__EQ___1 = (function (x){
return true;
});
var _LT__EQ___2 = (function (x,y){
return (x <= y);
});
var _LT__EQ___3 = (function() { 
var G__8949__delegate = function (x,y,more){
while(true){
if((x <= y))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__8950 = y;
var G__8951 = cljs.core.first.call(null,more);
var G__8952 = cljs.core.next.call(null,more);
x = G__8950;
y = G__8951;
more = G__8952;
continue;
}
} else
{return (y <= cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__8949 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8949__delegate.call(this, x, y, more);
};
G__8949.cljs$lang$maxFixedArity = 2;
G__8949.cljs$lang$applyTo = (function (arglist__8953){
var x = cljs.core.first(arglist__8953);
var y = cljs.core.first(cljs.core.next(arglist__8953));
var more = cljs.core.rest(cljs.core.next(arglist__8953));
return G__8949__delegate(x, y, more);
});
G__8949.cljs$lang$arity$variadic = G__8949__delegate;
return G__8949;
})()
;
_LT__EQ_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return _LT__EQ___1.call(this,x);
case 2:
return _LT__EQ___2.call(this,x,y);
default:
return _LT__EQ___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
_LT__EQ_.cljs$lang$maxFixedArity = 2;
_LT__EQ_.cljs$lang$applyTo = _LT__EQ___3.cljs$lang$applyTo;
_LT__EQ_.cljs$lang$arity$1 = _LT__EQ___1;
_LT__EQ_.cljs$lang$arity$2 = _LT__EQ___2;
_LT__EQ_.cljs$lang$arity$variadic = _LT__EQ___3.cljs$lang$arity$variadic;
return _LT__EQ_;
})()
;
/**
* Returns non-nil if nums are in monotonically decreasing order,
* otherwise false.
* @param {...*} var_args
*/
cljs.core._GT_ = (function() {
var _GT_ = null;
var _GT___1 = (function (x){
return true;
});
var _GT___2 = (function (x,y){
return (x > y);
});
var _GT___3 = (function() { 
var G__8954__delegate = function (x,y,more){
while(true){
if((x > y))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__8955 = y;
var G__8956 = cljs.core.first.call(null,more);
var G__8957 = cljs.core.next.call(null,more);
x = G__8955;
y = G__8956;
more = G__8957;
continue;
}
} else
{return (y > cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__8954 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8954__delegate.call(this, x, y, more);
};
G__8954.cljs$lang$maxFixedArity = 2;
G__8954.cljs$lang$applyTo = (function (arglist__8958){
var x = cljs.core.first(arglist__8958);
var y = cljs.core.first(cljs.core.next(arglist__8958));
var more = cljs.core.rest(cljs.core.next(arglist__8958));
return G__8954__delegate(x, y, more);
});
G__8954.cljs$lang$arity$variadic = G__8954__delegate;
return G__8954;
})()
;
_GT_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return _GT___1.call(this,x);
case 2:
return _GT___2.call(this,x,y);
default:
return _GT___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
_GT_.cljs$lang$maxFixedArity = 2;
_GT_.cljs$lang$applyTo = _GT___3.cljs$lang$applyTo;
_GT_.cljs$lang$arity$1 = _GT___1;
_GT_.cljs$lang$arity$2 = _GT___2;
_GT_.cljs$lang$arity$variadic = _GT___3.cljs$lang$arity$variadic;
return _GT_;
})()
;
/**
* Returns non-nil if nums are in monotonically non-increasing order,
* otherwise false.
* @param {...*} var_args
*/
cljs.core._GT__EQ_ = (function() {
var _GT__EQ_ = null;
var _GT__EQ___1 = (function (x){
return true;
});
var _GT__EQ___2 = (function (x,y){
return (x >= y);
});
var _GT__EQ___3 = (function() { 
var G__8959__delegate = function (x,y,more){
while(true){
if((x >= y))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__8960 = y;
var G__8961 = cljs.core.first.call(null,more);
var G__8962 = cljs.core.next.call(null,more);
x = G__8960;
y = G__8961;
more = G__8962;
continue;
}
} else
{return (y >= cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__8959 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8959__delegate.call(this, x, y, more);
};
G__8959.cljs$lang$maxFixedArity = 2;
G__8959.cljs$lang$applyTo = (function (arglist__8963){
var x = cljs.core.first(arglist__8963);
var y = cljs.core.first(cljs.core.next(arglist__8963));
var more = cljs.core.rest(cljs.core.next(arglist__8963));
return G__8959__delegate(x, y, more);
});
G__8959.cljs$lang$arity$variadic = G__8959__delegate;
return G__8959;
})()
;
_GT__EQ_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return _GT__EQ___1.call(this,x);
case 2:
return _GT__EQ___2.call(this,x,y);
default:
return _GT__EQ___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
_GT__EQ_.cljs$lang$maxFixedArity = 2;
_GT__EQ_.cljs$lang$applyTo = _GT__EQ___3.cljs$lang$applyTo;
_GT__EQ_.cljs$lang$arity$1 = _GT__EQ___1;
_GT__EQ_.cljs$lang$arity$2 = _GT__EQ___2;
_GT__EQ_.cljs$lang$arity$variadic = _GT__EQ___3.cljs$lang$arity$variadic;
return _GT__EQ_;
})()
;
/**
* Returns a number one less than num.
*/
cljs.core.dec = (function dec(x){
return (x - 1);
});
/**
* Returns the greatest of the nums.
* @param {...*} var_args
*/
cljs.core.max = (function() {
var max = null;
var max__1 = (function (x){
return x;
});
var max__2 = (function (x,y){
return ((x > y) ? x : y);
});
var max__3 = (function() { 
var G__8964__delegate = function (x,y,more){
return cljs.core.reduce.call(null,max,((x > y) ? x : y),more);
};
var G__8964 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8964__delegate.call(this, x, y, more);
};
G__8964.cljs$lang$maxFixedArity = 2;
G__8964.cljs$lang$applyTo = (function (arglist__8965){
var x = cljs.core.first(arglist__8965);
var y = cljs.core.first(cljs.core.next(arglist__8965));
var more = cljs.core.rest(cljs.core.next(arglist__8965));
return G__8964__delegate(x, y, more);
});
G__8964.cljs$lang$arity$variadic = G__8964__delegate;
return G__8964;
})()
;
max = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return max__1.call(this,x);
case 2:
return max__2.call(this,x,y);
default:
return max__3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
max.cljs$lang$maxFixedArity = 2;
max.cljs$lang$applyTo = max__3.cljs$lang$applyTo;
max.cljs$lang$arity$1 = max__1;
max.cljs$lang$arity$2 = max__2;
max.cljs$lang$arity$variadic = max__3.cljs$lang$arity$variadic;
return max;
})()
;
/**
* Returns the least of the nums.
* @param {...*} var_args
*/
cljs.core.min = (function() {
var min = null;
var min__1 = (function (x){
return x;
});
var min__2 = (function (x,y){
return ((x < y) ? x : y);
});
var min__3 = (function() { 
var G__8966__delegate = function (x,y,more){
return cljs.core.reduce.call(null,min,((x < y) ? x : y),more);
};
var G__8966 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8966__delegate.call(this, x, y, more);
};
G__8966.cljs$lang$maxFixedArity = 2;
G__8966.cljs$lang$applyTo = (function (arglist__8967){
var x = cljs.core.first(arglist__8967);
var y = cljs.core.first(cljs.core.next(arglist__8967));
var more = cljs.core.rest(cljs.core.next(arglist__8967));
return G__8966__delegate(x, y, more);
});
G__8966.cljs$lang$arity$variadic = G__8966__delegate;
return G__8966;
})()
;
min = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return min__1.call(this,x);
case 2:
return min__2.call(this,x,y);
default:
return min__3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
min.cljs$lang$maxFixedArity = 2;
min.cljs$lang$applyTo = min__3.cljs$lang$applyTo;
min.cljs$lang$arity$1 = min__1;
min.cljs$lang$arity$2 = min__2;
min.cljs$lang$arity$variadic = min__3.cljs$lang$arity$variadic;
return min;
})()
;
cljs.core.fix = (function fix(q){
if((q >= 0))
{return Math.floor.call(null,q);
} else
{return Math.ceil.call(null,q);
}
});
/**
* Coerce to int by stripping decimal places.
*/
cljs.core.int$ = (function int$(x){
return cljs.core.fix.call(null,x);
});
/**
* Coerce to long by stripping decimal places. Identical to `int'.
*/
cljs.core.long$ = (function long$(x){
return cljs.core.fix.call(null,x);
});
/**
* Modulus of num and div. Truncates toward negative infinity.
*/
cljs.core.mod = (function mod(n,d){
return (n % d);
});
/**
* quot[ient] of dividing numerator by denominator.
*/
cljs.core.quot = (function quot(n,d){
var rem__8968 = (n % d);
return cljs.core.fix.call(null,((n - rem__8968) / d));
});
/**
* remainder of dividing numerator by denominator.
*/
cljs.core.rem = (function rem(n,d){
var q__8969 = cljs.core.quot.call(null,n,d);
return (n - (d * q__8969));
});
/**
* Returns a random floating point number between 0 (inclusive) and n (default 1) (exclusive).
*/
cljs.core.rand = (function() {
var rand = null;
var rand__0 = (function (){
return Math.random.call(null);
});
var rand__1 = (function (n){
return (n * rand.call(null));
});
rand = function(n){
switch(arguments.length){
case 0:
return rand__0.call(this);
case 1:
return rand__1.call(this,n);
}
throw('Invalid arity: ' + arguments.length);
};
rand.cljs$lang$arity$0 = rand__0;
rand.cljs$lang$arity$1 = rand__1;
return rand;
})()
;
/**
* Returns a random integer between 0 (inclusive) and n (exclusive).
*/
cljs.core.rand_int = (function rand_int(n){
return cljs.core.fix.call(null,cljs.core.rand.call(null,n));
});
/**
* Bitwise exclusive or
*/
cljs.core.bit_xor = (function bit_xor(x,y){
return (x ^ y);
});
/**
* Bitwise and
*/
cljs.core.bit_and = (function bit_and(x,y){
return (x & y);
});
/**
* Bitwise or
*/
cljs.core.bit_or = (function bit_or(x,y){
return (x | y);
});
/**
* Bitwise and
*/
cljs.core.bit_and_not = (function bit_and_not(x,y){
return (x & ~y);
});
/**
* Clear bit at index n
*/
cljs.core.bit_clear = (function bit_clear(x,n){
return (x & ~(1 << n));
});
/**
* Flip bit at index n
*/
cljs.core.bit_flip = (function bit_flip(x,n){
return (x ^ (1 << n));
});
/**
* Bitwise complement
*/
cljs.core.bit_not = (function bit_not(x){
return (~ x);
});
/**
* Set bit at index n
*/
cljs.core.bit_set = (function bit_set(x,n){
return (x | (1 << n));
});
/**
* Test bit at index n
*/
cljs.core.bit_test = (function bit_test(x,n){
return ((x & (1 << n)) != 0);
});
/**
* Bitwise shift left
*/
cljs.core.bit_shift_left = (function bit_shift_left(x,n){
return (x << n);
});
/**
* Bitwise shift right
*/
cljs.core.bit_shift_right = (function bit_shift_right(x,n){
return (x >> n);
});
/**
* Bitwise shift right with zero fill
*/
cljs.core.bit_shift_right_zero_fill = (function bit_shift_right_zero_fill(x,n){
return (x >>> n);
});
/**
* Counts the number of bits set in n
*/
cljs.core.bit_count = (function bit_count(n){
var c__8970 = 0;
var n__8971 = n;
while(true){
if((n__8971 === 0))
{return c__8970;
} else
{{
var G__8972 = (c__8970 + 1);
var G__8973 = (n__8971 & (n__8971 - 1));
c__8970 = G__8972;
n__8971 = G__8973;
continue;
}
}
break;
}
});
/**
* Returns non-nil if nums all have the equivalent
* value, otherwise false. Behavior on non nums is
* undefined.
* @param {...*} var_args
*/
cljs.core._EQ__EQ_ = (function() {
var _EQ__EQ_ = null;
var _EQ__EQ___1 = (function (x){
return true;
});
var _EQ__EQ___2 = (function (x,y){
return cljs.core._equiv.call(null,x,y);
});
var _EQ__EQ___3 = (function() { 
var G__8974__delegate = function (x,y,more){
while(true){
if(cljs.core.truth_(_EQ__EQ_.call(null,x,y)))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__8975 = y;
var G__8976 = cljs.core.first.call(null,more);
var G__8977 = cljs.core.next.call(null,more);
x = G__8975;
y = G__8976;
more = G__8977;
continue;
}
} else
{return _EQ__EQ_.call(null,y,cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__8974 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__8974__delegate.call(this, x, y, more);
};
G__8974.cljs$lang$maxFixedArity = 2;
G__8974.cljs$lang$applyTo = (function (arglist__8978){
var x = cljs.core.first(arglist__8978);
var y = cljs.core.first(cljs.core.next(arglist__8978));
var more = cljs.core.rest(cljs.core.next(arglist__8978));
return G__8974__delegate(x, y, more);
});
G__8974.cljs$lang$arity$variadic = G__8974__delegate;
return G__8974;
})()
;
_EQ__EQ_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return _EQ__EQ___1.call(this,x);
case 2:
return _EQ__EQ___2.call(this,x,y);
default:
return _EQ__EQ___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
_EQ__EQ_.cljs$lang$maxFixedArity = 2;
_EQ__EQ_.cljs$lang$applyTo = _EQ__EQ___3.cljs$lang$applyTo;
_EQ__EQ_.cljs$lang$arity$1 = _EQ__EQ___1;
_EQ__EQ_.cljs$lang$arity$2 = _EQ__EQ___2;
_EQ__EQ_.cljs$lang$arity$variadic = _EQ__EQ___3.cljs$lang$arity$variadic;
return _EQ__EQ_;
})()
;
/**
* Returns true if num is greater than zero, else false
*/
cljs.core.pos_QMARK_ = (function pos_QMARK_(n){
return (n > 0);
});
cljs.core.zero_QMARK_ = (function zero_QMARK_(n){
return (n === 0);
});
/**
* Returns true if num is less than zero, else false
*/
cljs.core.neg_QMARK_ = (function neg_QMARK_(x){
return (x < 0);
});
/**
* Returns the nth next of coll, (seq coll) when n is 0.
*/
cljs.core.nthnext = (function nthnext(coll,n){
var n__8979 = n;
var xs__8980 = cljs.core.seq.call(null,coll);
while(true){
if(cljs.core.truth_((function (){var and__132__auto____8981 = xs__8980;
if(cljs.core.truth_(and__132__auto____8981))
{return (n__8979 > 0);
} else
{return and__132__auto____8981;
}
})()))
{{
var G__8982 = (n__8979 - 1);
var G__8983 = cljs.core.next.call(null,xs__8980);
n__8979 = G__8982;
xs__8980 = G__8983;
continue;
}
} else
{return xs__8980;
}
break;
}
});
/**
* Internal - do not use!
* @param {...*} var_args
*/
cljs.core.str_STAR_ = (function() {
var str_STAR_ = null;
var str_STAR___0 = (function (){
return "";
});
var str_STAR___1 = (function (x){
if((x == null))
{return "";
} else
{if("\uFDD0'else")
{return x.toString();
} else
{return null;
}
}
});
var str_STAR___2 = (function() { 
var G__8984__delegate = function (x,ys){
return (function (sb,more){
while(true){
if(cljs.core.truth_(more))
{{
var G__8985 = sb.append(str_STAR_.call(null,cljs.core.first.call(null,more)));
var G__8986 = cljs.core.next.call(null,more);
sb = G__8985;
more = G__8986;
continue;
}
} else
{return str_STAR_.call(null,sb);
}
break;
}
}).call(null,(new goog.string.StringBuffer(str_STAR_.call(null,x))),ys);
};
var G__8984 = function (x,var_args){
var ys = null;
if (goog.isDef(var_args)) {
  ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return G__8984__delegate.call(this, x, ys);
};
G__8984.cljs$lang$maxFixedArity = 1;
G__8984.cljs$lang$applyTo = (function (arglist__8987){
var x = cljs.core.first(arglist__8987);
var ys = cljs.core.rest(arglist__8987);
return G__8984__delegate(x, ys);
});
G__8984.cljs$lang$arity$variadic = G__8984__delegate;
return G__8984;
})()
;
str_STAR_ = function(x,var_args){
var ys = var_args;
switch(arguments.length){
case 0:
return str_STAR___0.call(this);
case 1:
return str_STAR___1.call(this,x);
default:
return str_STAR___2.cljs$lang$arity$variadic(x, cljs.core.array_seq(arguments, 1));
}
throw('Invalid arity: ' + arguments.length);
};
str_STAR_.cljs$lang$maxFixedArity = 1;
str_STAR_.cljs$lang$applyTo = str_STAR___2.cljs$lang$applyTo;
str_STAR_.cljs$lang$arity$0 = str_STAR___0;
str_STAR_.cljs$lang$arity$1 = str_STAR___1;
str_STAR_.cljs$lang$arity$variadic = str_STAR___2.cljs$lang$arity$variadic;
return str_STAR_;
})()
;
/**
* With no args, returns the empty string. With one arg x, returns
* x.toString().  (str nil) returns the empty string. With more than
* one arg, returns the concatenation of the str values of the args.
* @param {...*} var_args
*/
cljs.core.str = (function() {
var str = null;
var str__0 = (function (){
return "";
});
var str__1 = (function (x){
if(cljs.core.symbol_QMARK_.call(null,x))
{return x.substring(2,x.length);
} else
{if(cljs.core.keyword_QMARK_.call(null,x))
{return cljs.core.str_STAR_.call(null,":",x.substring(2,x.length));
} else
{if((x == null))
{return "";
} else
{if("\uFDD0'else")
{return x.toString();
} else
{return null;
}
}
}
}
});
var str__2 = (function() { 
var G__8988__delegate = function (x,ys){
return (function (sb,more){
while(true){
if(cljs.core.truth_(more))
{{
var G__8989 = sb.append(str.call(null,cljs.core.first.call(null,more)));
var G__8990 = cljs.core.next.call(null,more);
sb = G__8989;
more = G__8990;
continue;
}
} else
{return cljs.core.str_STAR_.call(null,sb);
}
break;
}
}).call(null,(new goog.string.StringBuffer(str.call(null,x))),ys);
};
var G__8988 = function (x,var_args){
var ys = null;
if (goog.isDef(var_args)) {
  ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return G__8988__delegate.call(this, x, ys);
};
G__8988.cljs$lang$maxFixedArity = 1;
G__8988.cljs$lang$applyTo = (function (arglist__8991){
var x = cljs.core.first(arglist__8991);
var ys = cljs.core.rest(arglist__8991);
return G__8988__delegate(x, ys);
});
G__8988.cljs$lang$arity$variadic = G__8988__delegate;
return G__8988;
})()
;
str = function(x,var_args){
var ys = var_args;
switch(arguments.length){
case 0:
return str__0.call(this);
case 1:
return str__1.call(this,x);
default:
return str__2.cljs$lang$arity$variadic(x, cljs.core.array_seq(arguments, 1));
}
throw('Invalid arity: ' + arguments.length);
};
str.cljs$lang$maxFixedArity = 1;
str.cljs$lang$applyTo = str__2.cljs$lang$applyTo;
str.cljs$lang$arity$0 = str__0;
str.cljs$lang$arity$1 = str__1;
str.cljs$lang$arity$variadic = str__2.cljs$lang$arity$variadic;
return str;
})()
;
/**
* Returns the substring of s beginning at start inclusive, and ending
* at end (defaults to length of string), exclusive.
*/
cljs.core.subs = (function() {
var subs = null;
var subs__2 = (function (s,start){
return s.substring(start);
});
var subs__3 = (function (s,start,end){
return s.substring(start,end);
});
subs = function(s,start,end){
switch(arguments.length){
case 2:
return subs__2.call(this,s,start);
case 3:
return subs__3.call(this,s,start,end);
}
throw('Invalid arity: ' + arguments.length);
};
subs.cljs$lang$arity$2 = subs__2;
subs.cljs$lang$arity$3 = subs__3;
return subs;
})()
;
/**
* Returns a Symbol with the given namespace and name.
*/
cljs.core.symbol = (function() {
var symbol = null;
var symbol__1 = (function (name){
if(cljs.core.symbol_QMARK_.call(null,name))
{name;
} else
{if(cljs.core.keyword_QMARK_.call(null,name))
{cljs.core.str_STAR_.call(null,"\uFDD1","'",cljs.core.subs.call(null,name,2));
} else
{}
}
return cljs.core.str_STAR_.call(null,"\uFDD1","'",name);
});
var symbol__2 = (function (ns,name){
return symbol.call(null,cljs.core.str_STAR_.call(null,ns,"/",name));
});
symbol = function(ns,name){
switch(arguments.length){
case 1:
return symbol__1.call(this,ns);
case 2:
return symbol__2.call(this,ns,name);
}
throw('Invalid arity: ' + arguments.length);
};
symbol.cljs$lang$arity$1 = symbol__1;
symbol.cljs$lang$arity$2 = symbol__2;
return symbol;
})()
;
/**
* Returns a Keyword with the given namespace and name.  Do not use :
* in the keyword strings, it will be added automatically.
*/
cljs.core.keyword = (function() {
var keyword = null;
var keyword__1 = (function (name){
if(cljs.core.keyword_QMARK_.call(null,name))
{return name;
} else
{if(cljs.core.symbol_QMARK_.call(null,name))
{return cljs.core.str_STAR_.call(null,"\uFDD0","'",cljs.core.subs.call(null,name,2));
} else
{if("\uFDD0'else")
{return cljs.core.str_STAR_.call(null,"\uFDD0","'",name);
} else
{return null;
}
}
}
});
var keyword__2 = (function (ns,name){
return keyword.call(null,cljs.core.str_STAR_.call(null,ns,"/",name));
});
keyword = function(ns,name){
switch(arguments.length){
case 1:
return keyword__1.call(this,ns);
case 2:
return keyword__2.call(this,ns,name);
}
throw('Invalid arity: ' + arguments.length);
};
keyword.cljs$lang$arity$1 = keyword__1;
keyword.cljs$lang$arity$2 = keyword__2;
return keyword;
})()
;
/**
* Assumes x is sequential. Returns true if x equals y, otherwise
* returns false.
*/
cljs.core.equiv_sequential = (function equiv_sequential(x,y){
return cljs.core.boolean$.call(null,((cljs.core.sequential_QMARK_.call(null,y))?(function (){var xs__8992 = cljs.core.seq.call(null,x);
var ys__8993 = cljs.core.seq.call(null,y);
while(true){
if((xs__8992 == null))
{return (ys__8993 == null);
} else
{if((ys__8993 == null))
{return false;
} else
{if(cljs.core._EQ_.call(null,cljs.core.first.call(null,xs__8992),cljs.core.first.call(null,ys__8993)))
{{
var G__8994 = cljs.core.next.call(null,xs__8992);
var G__8995 = cljs.core.next.call(null,ys__8993);
xs__8992 = G__8994;
ys__8993 = G__8995;
continue;
}
} else
{if("\uFDD0'else")
{return false;
} else
{return null;
}
}
}
}
break;
}
})():null));
});
cljs.core.hash_combine = (function hash_combine(seed,hash){
return (seed ^ (((hash + 2654435769) + (seed << 6)) + (seed >> 2)));
});
cljs.core.hash_coll = (function hash_coll(coll){
return cljs.core.reduce.call(null,(function (p1__8996_SHARP_,p2__8997_SHARP_){
return cljs.core.hash_combine.call(null,p1__8996_SHARP_,cljs.core.hash.call(null,p2__8997_SHARP_));
}),cljs.core.hash.call(null,cljs.core.first.call(null,coll)),cljs.core.next.call(null,coll));
});
void 0;
void 0;
cljs.core.hash_imap = (function hash_imap(m){
var h__8998 = 0;
var s__8999 = cljs.core.seq.call(null,m);
while(true){
if(cljs.core.truth_(s__8999))
{var e__9000 = cljs.core.first.call(null,s__8999);
{
var G__9001 = ((h__8998 + (cljs.core.hash.call(null,cljs.core.key.call(null,e__9000)) ^ cljs.core.hash.call(null,cljs.core.val.call(null,e__9000)))) % 4503599627370496);
var G__9002 = cljs.core.next.call(null,s__8999);
h__8998 = G__9001;
s__8999 = G__9002;
continue;
}
} else
{return h__8998;
}
break;
}
});
cljs.core.hash_iset = (function hash_iset(s){
var h__9003 = 0;
var s__9004 = cljs.core.seq.call(null,s);
while(true){
if(cljs.core.truth_(s__9004))
{var e__9005 = cljs.core.first.call(null,s__9004);
{
var G__9006 = ((h__9003 + cljs.core.hash.call(null,e__9005)) % 4503599627370496);
var G__9007 = cljs.core.next.call(null,s__9004);
h__9003 = G__9006;
s__9004 = G__9007;
continue;
}
} else
{return h__9003;
}
break;
}
});
void 0;
/**
* Takes a JavaScript object and a map of names to functions and
* attaches said functions as methods on the object.  Any references to
* JavaScript's implict this (via the this-as macro) will resolve to the
* object that the function is attached.
*/
cljs.core.extend_object_BANG_ = (function extend_object_BANG_(obj,fn_map){
var G__9008__9009 = cljs.core.seq.call(null,fn_map);
if(cljs.core.truth_(G__9008__9009))
{var G__9011__9013 = cljs.core.first.call(null,G__9008__9009);
var vec__9012__9014 = G__9011__9013;
var key_name__9015 = cljs.core.nth.call(null,vec__9012__9014,0,null);
var f__9016 = cljs.core.nth.call(null,vec__9012__9014,1,null);
var G__9008__9017 = G__9008__9009;
var G__9011__9018 = G__9011__9013;
var G__9008__9019 = G__9008__9017;
while(true){
var vec__9020__9021 = G__9011__9018;
var key_name__9022 = cljs.core.nth.call(null,vec__9020__9021,0,null);
var f__9023 = cljs.core.nth.call(null,vec__9020__9021,1,null);
var G__9008__9024 = G__9008__9019;
var str_name__9025 = cljs.core.name.call(null,key_name__9022);
obj[str_name__9025] = f__9023;
var temp__324__auto____9026 = cljs.core.next.call(null,G__9008__9024);
if(cljs.core.truth_(temp__324__auto____9026))
{var G__9008__9027 = temp__324__auto____9026;
{
var G__9028 = cljs.core.first.call(null,G__9008__9027);
var G__9029 = G__9008__9027;
G__9011__9018 = G__9028;
G__9008__9019 = G__9029;
continue;
}
} else
{}
break;
}
} else
{}
return obj;
});

/**
* @constructor
*/
cljs.core.List = (function (meta,first,rest,count,__hash){
this.meta = meta;
this.first = first;
this.rest = rest;
this.count = count;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 32706670;
})
cljs.core.List.cljs$lang$type = true;
cljs.core.List.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.List");
});
cljs.core.List.prototype.cljs$core$IHash$ = true;
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9030 = this;
var h__2236__auto____9031 = this__9030.__hash;
if((h__2236__auto____9031 != null))
{return h__2236__auto____9031;
} else
{var h__2236__auto____9032 = cljs.core.hash_coll.call(null,coll);
this__9030.__hash = h__2236__auto____9032;
return h__2236__auto____9032;
}
});
cljs.core.List.prototype.cljs$core$ISequential$ = true;
cljs.core.List.prototype.cljs$core$ICollection$ = true;
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__9033 = this;
return (new cljs.core.List(this__9033.meta,o,coll,(this__9033.count + 1),null));
});
cljs.core.List.prototype.cljs$core$ASeq$ = true;
cljs.core.List.prototype.toString = (function (){
var this__9034 = this;
var this$__9035 = this;
return cljs.core.pr_str.call(null,this$__9035);
});
cljs.core.List.prototype.cljs$core$ISeqable$ = true;
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9036 = this;
return coll;
});
cljs.core.List.prototype.cljs$core$ICounted$ = true;
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__9037 = this;
return this__9037.count;
});
cljs.core.List.prototype.cljs$core$IStack$ = true;
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = (function (coll){
var this__9038 = this;
return this__9038.first;
});
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = (function (coll){
var this__9039 = this;
return cljs.core._rest.call(null,coll);
});
cljs.core.List.prototype.cljs$core$ISeq$ = true;
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = (function (coll){
var this__9040 = this;
return this__9040.first;
});
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = (function (coll){
var this__9041 = this;
return this__9041.rest;
});
cljs.core.List.prototype.cljs$core$IEquiv$ = true;
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9042 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.List.prototype.cljs$core$IWithMeta$ = true;
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9043 = this;
return (new cljs.core.List(meta,this__9043.first,this__9043.rest,this__9043.count,this__9043.__hash));
});
cljs.core.List.prototype.cljs$core$IMeta$ = true;
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9044 = this;
return this__9044.meta;
});
cljs.core.List.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9045 = this;
return cljs.core.List.EMPTY;
});
cljs.core.List.prototype.cljs$core$IList$ = true;
cljs.core.List;

/**
* @constructor
*/
cljs.core.EmptyList = (function (meta){
this.meta = meta;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 32706638;
})
cljs.core.EmptyList.cljs$lang$type = true;
cljs.core.EmptyList.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.EmptyList");
});
cljs.core.EmptyList.prototype.cljs$core$IHash$ = true;
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9046 = this;
return 0;
});
cljs.core.EmptyList.prototype.cljs$core$ISequential$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__9047 = this;
return (new cljs.core.List(this__9047.meta,o,null,1,null));
});
cljs.core.EmptyList.prototype.toString = (function (){
var this__9048 = this;
var this$__9049 = this;
return cljs.core.pr_str.call(null,this$__9049);
});
cljs.core.EmptyList.prototype.cljs$core$ISeqable$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9050 = this;
return null;
});
cljs.core.EmptyList.prototype.cljs$core$ICounted$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__9051 = this;
return 0;
});
cljs.core.EmptyList.prototype.cljs$core$IStack$ = true;
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = (function (coll){
var this__9052 = this;
return null;
});
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = (function (coll){
var this__9053 = this;
return null;
});
cljs.core.EmptyList.prototype.cljs$core$ISeq$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = (function (coll){
var this__9054 = this;
return null;
});
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = (function (coll){
var this__9055 = this;
return null;
});
cljs.core.EmptyList.prototype.cljs$core$IEquiv$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9056 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9057 = this;
return (new cljs.core.EmptyList(meta));
});
cljs.core.EmptyList.prototype.cljs$core$IMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9058 = this;
return this__9058.meta;
});
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9059 = this;
return coll;
});
cljs.core.EmptyList.prototype.cljs$core$IList$ = true;
cljs.core.EmptyList;
cljs.core.List.EMPTY = (new cljs.core.EmptyList(null));
cljs.core.reversible_QMARK_ = (function reversible_QMARK_(coll){
var G__9060__9061 = coll;
if((G__9060__9061 != null))
{if((function (){var or__138__auto____9062 = (G__9060__9061.cljs$lang$protocol_mask$partition0$ & 67108864);
if(or__138__auto____9062)
{return or__138__auto____9062;
} else
{return G__9060__9061.cljs$core$IReversible$;
}
})())
{return true;
} else
{if((!G__9060__9061.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IReversible,G__9060__9061);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IReversible,G__9060__9061);
}
});
cljs.core.rseq = (function rseq(coll){
return cljs.core._rseq.call(null,coll);
});
/**
* Returns a seq of the items in coll in reverse order. Not lazy.
*/
cljs.core.reverse = (function reverse(coll){
return cljs.core.reduce.call(null,cljs.core.conj,cljs.core.List.EMPTY,coll);
});
/**
* @param {...*} var_args
*/
cljs.core.list = (function() { 
var list__delegate = function (items){
return cljs.core.reduce.call(null,cljs.core.conj,cljs.core.List.EMPTY,cljs.core.reverse.call(null,items));
};
var list = function (var_args){
var items = null;
if (goog.isDef(var_args)) {
  items = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return list__delegate.call(this, items);
};
list.cljs$lang$maxFixedArity = 0;
list.cljs$lang$applyTo = (function (arglist__9063){
var items = cljs.core.seq(arglist__9063);;
return list__delegate(items);
});
list.cljs$lang$arity$variadic = list__delegate;
return list;
})()
;

/**
* @constructor
*/
cljs.core.Cons = (function (meta,first,rest,__hash){
this.meta = meta;
this.first = first;
this.rest = rest;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 32702572;
})
cljs.core.Cons.cljs$lang$type = true;
cljs.core.Cons.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.Cons");
});
cljs.core.Cons.prototype.cljs$core$IHash$ = true;
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9064 = this;
var h__2236__auto____9065 = this__9064.__hash;
if((h__2236__auto____9065 != null))
{return h__2236__auto____9065;
} else
{var h__2236__auto____9066 = cljs.core.hash_coll.call(null,coll);
this__9064.__hash = h__2236__auto____9066;
return h__2236__auto____9066;
}
});
cljs.core.Cons.prototype.cljs$core$ISequential$ = true;
cljs.core.Cons.prototype.cljs$core$ICollection$ = true;
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__9067 = this;
return (new cljs.core.Cons(null,o,coll,this__9067.__hash));
});
cljs.core.Cons.prototype.cljs$core$ASeq$ = true;
cljs.core.Cons.prototype.toString = (function (){
var this__9068 = this;
var this$__9069 = this;
return cljs.core.pr_str.call(null,this$__9069);
});
cljs.core.Cons.prototype.cljs$core$ISeqable$ = true;
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9070 = this;
return coll;
});
cljs.core.Cons.prototype.cljs$core$ISeq$ = true;
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = (function (coll){
var this__9071 = this;
return this__9071.first;
});
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = (function (coll){
var this__9072 = this;
if((this__9072.rest == null))
{return cljs.core.List.EMPTY;
} else
{return this__9072.rest;
}
});
cljs.core.Cons.prototype.cljs$core$IEquiv$ = true;
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9073 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.Cons.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9074 = this;
return (new cljs.core.Cons(meta,this__9074.first,this__9074.rest,this__9074.__hash));
});
cljs.core.Cons.prototype.cljs$core$IMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9075 = this;
return this__9075.meta;
});
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9076 = this;
return cljs.core.with_meta.call(null,cljs.core.List.EMPTY,this__9076.meta);
});
cljs.core.Cons.prototype.cljs$core$IList$ = true;
cljs.core.Cons;
/**
* Returns a new seq where x is the first element and seq is the rest.
*/
cljs.core.cons = (function cons(x,coll){
if((function (){var or__138__auto____9077 = (coll == null);
if(or__138__auto____9077)
{return or__138__auto____9077;
} else
{var G__9078__9079 = coll;
if((G__9078__9079 != null))
{if((function (){var or__138__auto____9080 = (G__9078__9079.cljs$lang$protocol_mask$partition0$ & 64);
if(or__138__auto____9080)
{return or__138__auto____9080;
} else
{return G__9078__9079.cljs$core$ISeq$;
}
})())
{return true;
} else
{if((!G__9078__9079.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,G__9078__9079);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,G__9078__9079);
}
}
})())
{return (new cljs.core.Cons(null,x,coll,null));
} else
{return (new cljs.core.Cons(null,x,cljs.core.seq.call(null,coll),null));
}
});
cljs.core.list_QMARK_ = (function list_QMARK_(x){
var G__9081__9082 = x;
if((G__9081__9082 != null))
{if((function (){var or__138__auto____9083 = (G__9081__9082.cljs$lang$protocol_mask$partition0$ & 16777216);
if(or__138__auto____9083)
{return or__138__auto____9083;
} else
{return G__9081__9082.cljs$core$IList$;
}
})())
{return true;
} else
{if((!G__9081__9082.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IList,G__9081__9082);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IList,G__9081__9082);
}
});
(cljs.core.IReduce["string"] = true);
(cljs.core._reduce["string"] = (function() {
var G__9084 = null;
var G__9084__2 = (function (string,f){
return cljs.core.ci_reduce.call(null,string,f);
});
var G__9084__3 = (function (string,f,start){
return cljs.core.ci_reduce.call(null,string,f,start);
});
G__9084 = function(string,f,start){
switch(arguments.length){
case 2:
return G__9084__2.call(this,string,f);
case 3:
return G__9084__3.call(this,string,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9084;
})()
);
(cljs.core.ILookup["string"] = true);
(cljs.core._lookup["string"] = (function() {
var G__9085 = null;
var G__9085__2 = (function (string,k){
return cljs.core._nth.call(null,string,k);
});
var G__9085__3 = (function (string,k,not_found){
return cljs.core._nth.call(null,string,k,not_found);
});
G__9085 = function(string,k,not_found){
switch(arguments.length){
case 2:
return G__9085__2.call(this,string,k);
case 3:
return G__9085__3.call(this,string,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9085;
})()
);
(cljs.core.IIndexed["string"] = true);
(cljs.core._nth["string"] = (function() {
var G__9086 = null;
var G__9086__2 = (function (string,n){
if((n < cljs.core._count.call(null,string)))
{return string.charAt(n);
} else
{return null;
}
});
var G__9086__3 = (function (string,n,not_found){
if((n < cljs.core._count.call(null,string)))
{return string.charAt(n);
} else
{return not_found;
}
});
G__9086 = function(string,n,not_found){
switch(arguments.length){
case 2:
return G__9086__2.call(this,string,n);
case 3:
return G__9086__3.call(this,string,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9086;
})()
);
(cljs.core.ICounted["string"] = true);
(cljs.core._count["string"] = (function (s){
return s.length;
}));
(cljs.core.ISeqable["string"] = true);
(cljs.core._seq["string"] = (function (string){
return cljs.core.prim_seq.call(null,string,0);
}));
(cljs.core.IHash["string"] = true);
(cljs.core._hash["string"] = (function (o){
return goog.string.hashCode.call(null,o);
}));
String.prototype.cljs$core$IFn$ = true;
String.prototype.call = (function() {
var G__9095 = null;
var G__9095__2 = (function (tsym9089,coll){
var tsym9089__9091 = this;
var this$__9092 = tsym9089__9091;
return cljs.core.get.call(null,coll,this$__9092.toString());
});
var G__9095__3 = (function (tsym9090,coll,not_found){
var tsym9090__9093 = this;
var this$__9094 = tsym9090__9093;
return cljs.core.get.call(null,coll,this$__9094.toString(),not_found);
});
G__9095 = function(tsym9090,coll,not_found){
switch(arguments.length){
case 2:
return G__9095__2.call(this,tsym9090,coll);
case 3:
return G__9095__3.call(this,tsym9090,coll,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9095;
})()
;
String.prototype.apply = (function (tsym9087,args9088){
return tsym9087.call.apply(tsym9087,[tsym9087].concat(cljs.core.aclone.call(null,args9088)));
});
String['prototype']['apply'] = (function (s,args){
if((cljs.core.count.call(null,args) < 2))
{return cljs.core.get.call(null,(args[0]),s);
} else
{return cljs.core.get.call(null,(args[0]),s,(args[1]));
}
});
cljs.core.lazy_seq_value = (function lazy_seq_value(lazy_seq){
var x__9096 = lazy_seq.x;
if(cljs.core.truth_(lazy_seq.realized))
{return x__9096;
} else
{lazy_seq.x = x__9096.call(null);
lazy_seq.realized = true;
return lazy_seq.x;
}
});

/**
* @constructor
*/
cljs.core.LazySeq = (function (meta,realized,x,__hash){
this.meta = meta;
this.realized = realized;
this.x = x;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 15925324;
})
cljs.core.LazySeq.cljs$lang$type = true;
cljs.core.LazySeq.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.LazySeq");
});
cljs.core.LazySeq.prototype.cljs$core$IHash$ = true;
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9097 = this;
var h__2236__auto____9098 = this__9097.__hash;
if((h__2236__auto____9098 != null))
{return h__2236__auto____9098;
} else
{var h__2236__auto____9099 = cljs.core.hash_coll.call(null,coll);
this__9097.__hash = h__2236__auto____9099;
return h__2236__auto____9099;
}
});
cljs.core.LazySeq.prototype.cljs$core$ISequential$ = true;
cljs.core.LazySeq.prototype.cljs$core$ICollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__9100 = this;
return cljs.core.cons.call(null,o,coll);
});
cljs.core.LazySeq.prototype.toString = (function (){
var this__9101 = this;
var this$__9102 = this;
return cljs.core.pr_str.call(null,this$__9102);
});
cljs.core.LazySeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9103 = this;
return cljs.core.seq.call(null,cljs.core.lazy_seq_value.call(null,coll));
});
cljs.core.LazySeq.prototype.cljs$core$ISeq$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = (function (coll){
var this__9104 = this;
return cljs.core.first.call(null,cljs.core.lazy_seq_value.call(null,coll));
});
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = (function (coll){
var this__9105 = this;
return cljs.core.rest.call(null,cljs.core.lazy_seq_value.call(null,coll));
});
cljs.core.LazySeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9106 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9107 = this;
return (new cljs.core.LazySeq(meta,this__9107.realized,this__9107.x,this__9107.__hash));
});
cljs.core.LazySeq.prototype.cljs$core$IMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9108 = this;
return this__9108.meta;
});
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9109 = this;
return cljs.core.with_meta.call(null,cljs.core.List.EMPTY,this__9109.meta);
});
cljs.core.LazySeq;
/**
* Naive impl of to-array as a start.
*/
cljs.core.to_array = (function to_array(s){
var ary__9110 = [];
var s__9111 = s;
while(true){
if(cljs.core.truth_(cljs.core.seq.call(null,s__9111)))
{ary__9110.push(cljs.core.first.call(null,s__9111));
{
var G__9112 = cljs.core.next.call(null,s__9111);
s__9111 = G__9112;
continue;
}
} else
{return ary__9110;
}
break;
}
});
/**
* Returns a (potentially-ragged) 2-dimensional array
* containing the contents of coll.
*/
cljs.core.to_array_2d = (function to_array_2d(coll){
var ret__9113 = cljs.core.make_array.call(null,cljs.core.count.call(null,coll));
var i__9114 = 0;
var xs__9115 = cljs.core.seq.call(null,coll);
while(true){
if(cljs.core.truth_(xs__9115))
{(ret__9113[i__9114] = cljs.core.to_array.call(null,cljs.core.first.call(null,xs__9115)));
{
var G__9116 = (i__9114 + 1);
var G__9117 = cljs.core.next.call(null,xs__9115);
i__9114 = G__9116;
xs__9115 = G__9117;
continue;
}
} else
{}
break;
}
return ret__9113;
});
cljs.core.long_array = (function() {
var long_array = null;
var long_array__1 = (function (size_or_seq){
if(cljs.core.number_QMARK_.call(null,size_or_seq))
{return long_array.call(null,size_or_seq,null);
} else
{if(cljs.core.seq_QMARK_.call(null,size_or_seq))
{return cljs.core.into_array.call(null,size_or_seq);
} else
{if("\uFDD0'else")
{throw (new Error("long-array called with something other than size or ISeq"));
} else
{return null;
}
}
}
});
var long_array__2 = (function (size,init_val_or_seq){
var a__9118 = cljs.core.make_array.call(null,size);
if(cljs.core.seq_QMARK_.call(null,init_val_or_seq))
{var s__9119 = cljs.core.seq.call(null,init_val_or_seq);
var i__9120 = 0;
var s__9121 = s__9119;
while(true){
if(cljs.core.truth_((function (){var and__132__auto____9122 = s__9121;
if(cljs.core.truth_(and__132__auto____9122))
{return (i__9120 < size);
} else
{return and__132__auto____9122;
}
})()))
{(a__9118[i__9120] = cljs.core.first.call(null,s__9121));
{
var G__9125 = (i__9120 + 1);
var G__9126 = cljs.core.next.call(null,s__9121);
i__9120 = G__9125;
s__9121 = G__9126;
continue;
}
} else
{return a__9118;
}
break;
}
} else
{var n__2557__auto____9123 = size;
var i__9124 = 0;
while(true){
if((i__9124 < n__2557__auto____9123))
{(a__9118[i__9124] = init_val_or_seq);
{
var G__9127 = (i__9124 + 1);
i__9124 = G__9127;
continue;
}
} else
{}
break;
}
return a__9118;
}
});
long_array = function(size,init_val_or_seq){
switch(arguments.length){
case 1:
return long_array__1.call(this,size);
case 2:
return long_array__2.call(this,size,init_val_or_seq);
}
throw('Invalid arity: ' + arguments.length);
};
long_array.cljs$lang$arity$1 = long_array__1;
long_array.cljs$lang$arity$2 = long_array__2;
return long_array;
})()
;
cljs.core.double_array = (function() {
var double_array = null;
var double_array__1 = (function (size_or_seq){
if(cljs.core.number_QMARK_.call(null,size_or_seq))
{return double_array.call(null,size_or_seq,null);
} else
{if(cljs.core.seq_QMARK_.call(null,size_or_seq))
{return cljs.core.into_array.call(null,size_or_seq);
} else
{if("\uFDD0'else")
{throw (new Error("double-array called with something other than size or ISeq"));
} else
{return null;
}
}
}
});
var double_array__2 = (function (size,init_val_or_seq){
var a__9128 = cljs.core.make_array.call(null,size);
if(cljs.core.seq_QMARK_.call(null,init_val_or_seq))
{var s__9129 = cljs.core.seq.call(null,init_val_or_seq);
var i__9130 = 0;
var s__9131 = s__9129;
while(true){
if(cljs.core.truth_((function (){var and__132__auto____9132 = s__9131;
if(cljs.core.truth_(and__132__auto____9132))
{return (i__9130 < size);
} else
{return and__132__auto____9132;
}
})()))
{(a__9128[i__9130] = cljs.core.first.call(null,s__9131));
{
var G__9135 = (i__9130 + 1);
var G__9136 = cljs.core.next.call(null,s__9131);
i__9130 = G__9135;
s__9131 = G__9136;
continue;
}
} else
{return a__9128;
}
break;
}
} else
{var n__2557__auto____9133 = size;
var i__9134 = 0;
while(true){
if((i__9134 < n__2557__auto____9133))
{(a__9128[i__9134] = init_val_or_seq);
{
var G__9137 = (i__9134 + 1);
i__9134 = G__9137;
continue;
}
} else
{}
break;
}
return a__9128;
}
});
double_array = function(size,init_val_or_seq){
switch(arguments.length){
case 1:
return double_array__1.call(this,size);
case 2:
return double_array__2.call(this,size,init_val_or_seq);
}
throw('Invalid arity: ' + arguments.length);
};
double_array.cljs$lang$arity$1 = double_array__1;
double_array.cljs$lang$arity$2 = double_array__2;
return double_array;
})()
;
cljs.core.object_array = (function() {
var object_array = null;
var object_array__1 = (function (size_or_seq){
if(cljs.core.number_QMARK_.call(null,size_or_seq))
{return object_array.call(null,size_or_seq,null);
} else
{if(cljs.core.seq_QMARK_.call(null,size_or_seq))
{return cljs.core.into_array.call(null,size_or_seq);
} else
{if("\uFDD0'else")
{throw (new Error("object-array called with something other than size or ISeq"));
} else
{return null;
}
}
}
});
var object_array__2 = (function (size,init_val_or_seq){
var a__9138 = cljs.core.make_array.call(null,size);
if(cljs.core.seq_QMARK_.call(null,init_val_or_seq))
{var s__9139 = cljs.core.seq.call(null,init_val_or_seq);
var i__9140 = 0;
var s__9141 = s__9139;
while(true){
if(cljs.core.truth_((function (){var and__132__auto____9142 = s__9141;
if(cljs.core.truth_(and__132__auto____9142))
{return (i__9140 < size);
} else
{return and__132__auto____9142;
}
})()))
{(a__9138[i__9140] = cljs.core.first.call(null,s__9141));
{
var G__9145 = (i__9140 + 1);
var G__9146 = cljs.core.next.call(null,s__9141);
i__9140 = G__9145;
s__9141 = G__9146;
continue;
}
} else
{return a__9138;
}
break;
}
} else
{var n__2557__auto____9143 = size;
var i__9144 = 0;
while(true){
if((i__9144 < n__2557__auto____9143))
{(a__9138[i__9144] = init_val_or_seq);
{
var G__9147 = (i__9144 + 1);
i__9144 = G__9147;
continue;
}
} else
{}
break;
}
return a__9138;
}
});
object_array = function(size,init_val_or_seq){
switch(arguments.length){
case 1:
return object_array__1.call(this,size);
case 2:
return object_array__2.call(this,size,init_val_or_seq);
}
throw('Invalid arity: ' + arguments.length);
};
object_array.cljs$lang$arity$1 = object_array__1;
object_array.cljs$lang$arity$2 = object_array__2;
return object_array;
})()
;
cljs.core.bounded_count = (function bounded_count(s,n){
if(cljs.core.counted_QMARK_.call(null,s))
{return cljs.core.count.call(null,s);
} else
{var s__9148 = s;
var i__9149 = n;
var sum__9150 = 0;
while(true){
if(cljs.core.truth_((function (){var and__132__auto____9151 = (i__9149 > 0);
if(and__132__auto____9151)
{return cljs.core.seq.call(null,s__9148);
} else
{return and__132__auto____9151;
}
})()))
{{
var G__9152 = cljs.core.next.call(null,s__9148);
var G__9153 = (i__9149 - 1);
var G__9154 = (sum__9150 + 1);
s__9148 = G__9152;
i__9149 = G__9153;
sum__9150 = G__9154;
continue;
}
} else
{return sum__9150;
}
break;
}
}
});
cljs.core.spread = (function spread(arglist){
if((arglist == null))
{return null;
} else
{if((cljs.core.next.call(null,arglist) == null))
{return cljs.core.seq.call(null,cljs.core.first.call(null,arglist));
} else
{if("\uFDD0'else")
{return cljs.core.cons.call(null,cljs.core.first.call(null,arglist),spread.call(null,cljs.core.next.call(null,arglist)));
} else
{return null;
}
}
}
});
/**
* Returns a lazy seq representing the concatenation of the elements in the supplied colls.
* @param {...*} var_args
*/
cljs.core.concat = (function() {
var concat = null;
var concat__0 = (function (){
return (new cljs.core.LazySeq(null,false,(function (){
return null;
})));
});
var concat__1 = (function (x){
return (new cljs.core.LazySeq(null,false,(function (){
return x;
})));
});
var concat__2 = (function (x,y){
return (new cljs.core.LazySeq(null,false,(function (){
var s__9155 = cljs.core.seq.call(null,x);
if(cljs.core.truth_(s__9155))
{return cljs.core.cons.call(null,cljs.core.first.call(null,s__9155),concat.call(null,cljs.core.rest.call(null,s__9155),y));
} else
{return y;
}
})));
});
var concat__3 = (function() { 
var G__9158__delegate = function (x,y,zs){
var cat__9157 = (function cat(xys,zs){
return (new cljs.core.LazySeq(null,false,(function (){
var xys__9156 = cljs.core.seq.call(null,xys);
if(cljs.core.truth_(xys__9156))
{return cljs.core.cons.call(null,cljs.core.first.call(null,xys__9156),cat.call(null,cljs.core.rest.call(null,xys__9156),zs));
} else
{if(cljs.core.truth_(zs))
{return cat.call(null,cljs.core.first.call(null,zs),cljs.core.next.call(null,zs));
} else
{return null;
}
}
})));
});
return cat__9157.call(null,concat.call(null,x,y),zs);
};
var G__9158 = function (x,y,var_args){
var zs = null;
if (goog.isDef(var_args)) {
  zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__9158__delegate.call(this, x, y, zs);
};
G__9158.cljs$lang$maxFixedArity = 2;
G__9158.cljs$lang$applyTo = (function (arglist__9159){
var x = cljs.core.first(arglist__9159);
var y = cljs.core.first(cljs.core.next(arglist__9159));
var zs = cljs.core.rest(cljs.core.next(arglist__9159));
return G__9158__delegate(x, y, zs);
});
G__9158.cljs$lang$arity$variadic = G__9158__delegate;
return G__9158;
})()
;
concat = function(x,y,var_args){
var zs = var_args;
switch(arguments.length){
case 0:
return concat__0.call(this);
case 1:
return concat__1.call(this,x);
case 2:
return concat__2.call(this,x,y);
default:
return concat__3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
concat.cljs$lang$maxFixedArity = 2;
concat.cljs$lang$applyTo = concat__3.cljs$lang$applyTo;
concat.cljs$lang$arity$0 = concat__0;
concat.cljs$lang$arity$1 = concat__1;
concat.cljs$lang$arity$2 = concat__2;
concat.cljs$lang$arity$variadic = concat__3.cljs$lang$arity$variadic;
return concat;
})()
;
/**
* Creates a new list containing the items prepended to the rest, the
* last of which will be treated as a sequence.
* @param {...*} var_args
*/
cljs.core.list_STAR_ = (function() {
var list_STAR_ = null;
var list_STAR___1 = (function (args){
return cljs.core.seq.call(null,args);
});
var list_STAR___2 = (function (a,args){
return cljs.core.cons.call(null,a,args);
});
var list_STAR___3 = (function (a,b,args){
return cljs.core.cons.call(null,a,cljs.core.cons.call(null,b,args));
});
var list_STAR___4 = (function (a,b,c,args){
return cljs.core.cons.call(null,a,cljs.core.cons.call(null,b,cljs.core.cons.call(null,c,args)));
});
var list_STAR___5 = (function() { 
var G__9160__delegate = function (a,b,c,d,more){
return cljs.core.cons.call(null,a,cljs.core.cons.call(null,b,cljs.core.cons.call(null,c,cljs.core.cons.call(null,d,cljs.core.spread.call(null,more)))));
};
var G__9160 = function (a,b,c,d,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4),0);
} 
return G__9160__delegate.call(this, a, b, c, d, more);
};
G__9160.cljs$lang$maxFixedArity = 4;
G__9160.cljs$lang$applyTo = (function (arglist__9161){
var a = cljs.core.first(arglist__9161);
var b = cljs.core.first(cljs.core.next(arglist__9161));
var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9161)));
var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9161))));
var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9161))));
return G__9160__delegate(a, b, c, d, more);
});
G__9160.cljs$lang$arity$variadic = G__9160__delegate;
return G__9160;
})()
;
list_STAR_ = function(a,b,c,d,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return list_STAR___1.call(this,a);
case 2:
return list_STAR___2.call(this,a,b);
case 3:
return list_STAR___3.call(this,a,b,c);
case 4:
return list_STAR___4.call(this,a,b,c,d);
default:
return list_STAR___5.cljs$lang$arity$variadic(a,b,c,d, cljs.core.array_seq(arguments, 4));
}
throw('Invalid arity: ' + arguments.length);
};
list_STAR_.cljs$lang$maxFixedArity = 4;
list_STAR_.cljs$lang$applyTo = list_STAR___5.cljs$lang$applyTo;
list_STAR_.cljs$lang$arity$1 = list_STAR___1;
list_STAR_.cljs$lang$arity$2 = list_STAR___2;
list_STAR_.cljs$lang$arity$3 = list_STAR___3;
list_STAR_.cljs$lang$arity$4 = list_STAR___4;
list_STAR_.cljs$lang$arity$variadic = list_STAR___5.cljs$lang$arity$variadic;
return list_STAR_;
})()
;
cljs.core.transient$ = (function transient$(coll){
return cljs.core._as_transient.call(null,coll);
});
cljs.core.persistent_BANG_ = (function persistent_BANG_(tcoll){
return cljs.core._persistent_BANG_.call(null,tcoll);
});
cljs.core.conj_BANG_ = (function conj_BANG_(tcoll,val){
return cljs.core._conj_BANG_.call(null,tcoll,val);
});
cljs.core.assoc_BANG_ = (function assoc_BANG_(tcoll,key,val){
return cljs.core._assoc_BANG_.call(null,tcoll,key,val);
});
cljs.core.dissoc_BANG_ = (function dissoc_BANG_(tcoll,key){
return cljs.core._dissoc_BANG_.call(null,tcoll,key);
});
cljs.core.pop_BANG_ = (function pop_BANG_(tcoll){
return cljs.core._pop_BANG_.call(null,tcoll);
});
cljs.core.disj_BANG_ = (function disj_BANG_(tcoll,val){
return cljs.core._disjoin_BANG_.call(null,tcoll,val);
});
void 0;cljs.core.apply_to = (function apply_to(f,argc,args){
var args__9162 = cljs.core.seq.call(null,args);
if((argc === 0))
{return f.call(null);
} else
{var a__9163 = cljs.core._first.call(null,args__9162);
var args__9164 = cljs.core._rest.call(null,args__9162);
if((argc === 1))
{if(f.cljs$lang$arity$1)
{return f.cljs$lang$arity$1(a__9163);
} else
{return f.call(null,a__9163);
}
} else
{var b__9165 = cljs.core._first.call(null,args__9164);
var args__9166 = cljs.core._rest.call(null,args__9164);
if((argc === 2))
{if(f.cljs$lang$arity$2)
{return f.cljs$lang$arity$2(a__9163,b__9165);
} else
{return f.call(null,a__9163,b__9165);
}
} else
{var c__9167 = cljs.core._first.call(null,args__9166);
var args__9168 = cljs.core._rest.call(null,args__9166);
if((argc === 3))
{if(f.cljs$lang$arity$3)
{return f.cljs$lang$arity$3(a__9163,b__9165,c__9167);
} else
{return f.call(null,a__9163,b__9165,c__9167);
}
} else
{var d__9169 = cljs.core._first.call(null,args__9168);
var args__9170 = cljs.core._rest.call(null,args__9168);
if((argc === 4))
{if(f.cljs$lang$arity$4)
{return f.cljs$lang$arity$4(a__9163,b__9165,c__9167,d__9169);
} else
{return f.call(null,a__9163,b__9165,c__9167,d__9169);
}
} else
{var e__9171 = cljs.core._first.call(null,args__9170);
var args__9172 = cljs.core._rest.call(null,args__9170);
if((argc === 5))
{if(f.cljs$lang$arity$5)
{return f.cljs$lang$arity$5(a__9163,b__9165,c__9167,d__9169,e__9171);
} else
{return f.call(null,a__9163,b__9165,c__9167,d__9169,e__9171);
}
} else
{var f__9173 = cljs.core._first.call(null,args__9172);
var args__9174 = cljs.core._rest.call(null,args__9172);
if((argc === 6))
{if(f__9173.cljs$lang$arity$6)
{return f__9173.cljs$lang$arity$6(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173);
}
} else
{var g__9175 = cljs.core._first.call(null,args__9174);
var args__9176 = cljs.core._rest.call(null,args__9174);
if((argc === 7))
{if(f__9173.cljs$lang$arity$7)
{return f__9173.cljs$lang$arity$7(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175);
}
} else
{var h__9177 = cljs.core._first.call(null,args__9176);
var args__9178 = cljs.core._rest.call(null,args__9176);
if((argc === 8))
{if(f__9173.cljs$lang$arity$8)
{return f__9173.cljs$lang$arity$8(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177);
}
} else
{var i__9179 = cljs.core._first.call(null,args__9178);
var args__9180 = cljs.core._rest.call(null,args__9178);
if((argc === 9))
{if(f__9173.cljs$lang$arity$9)
{return f__9173.cljs$lang$arity$9(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179);
}
} else
{var j__9181 = cljs.core._first.call(null,args__9180);
var args__9182 = cljs.core._rest.call(null,args__9180);
if((argc === 10))
{if(f__9173.cljs$lang$arity$10)
{return f__9173.cljs$lang$arity$10(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181);
}
} else
{var k__9183 = cljs.core._first.call(null,args__9182);
var args__9184 = cljs.core._rest.call(null,args__9182);
if((argc === 11))
{if(f__9173.cljs$lang$arity$11)
{return f__9173.cljs$lang$arity$11(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183);
}
} else
{var l__9185 = cljs.core._first.call(null,args__9184);
var args__9186 = cljs.core._rest.call(null,args__9184);
if((argc === 12))
{if(f__9173.cljs$lang$arity$12)
{return f__9173.cljs$lang$arity$12(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185);
}
} else
{var m__9187 = cljs.core._first.call(null,args__9186);
var args__9188 = cljs.core._rest.call(null,args__9186);
if((argc === 13))
{if(f__9173.cljs$lang$arity$13)
{return f__9173.cljs$lang$arity$13(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187);
}
} else
{var n__9189 = cljs.core._first.call(null,args__9188);
var args__9190 = cljs.core._rest.call(null,args__9188);
if((argc === 14))
{if(f__9173.cljs$lang$arity$14)
{return f__9173.cljs$lang$arity$14(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189);
}
} else
{var o__9191 = cljs.core._first.call(null,args__9190);
var args__9192 = cljs.core._rest.call(null,args__9190);
if((argc === 15))
{if(f__9173.cljs$lang$arity$15)
{return f__9173.cljs$lang$arity$15(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191);
}
} else
{var p__9193 = cljs.core._first.call(null,args__9192);
var args__9194 = cljs.core._rest.call(null,args__9192);
if((argc === 16))
{if(f__9173.cljs$lang$arity$16)
{return f__9173.cljs$lang$arity$16(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191,p__9193);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191,p__9193);
}
} else
{var q__9195 = cljs.core._first.call(null,args__9194);
var args__9196 = cljs.core._rest.call(null,args__9194);
if((argc === 17))
{if(f__9173.cljs$lang$arity$17)
{return f__9173.cljs$lang$arity$17(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191,p__9193,q__9195);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191,p__9193,q__9195);
}
} else
{var r__9197 = cljs.core._first.call(null,args__9196);
var args__9198 = cljs.core._rest.call(null,args__9196);
if((argc === 18))
{if(f__9173.cljs$lang$arity$18)
{return f__9173.cljs$lang$arity$18(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191,p__9193,q__9195,r__9197);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191,p__9193,q__9195,r__9197);
}
} else
{var s__9199 = cljs.core._first.call(null,args__9198);
var args__9200 = cljs.core._rest.call(null,args__9198);
if((argc === 19))
{if(f__9173.cljs$lang$arity$19)
{return f__9173.cljs$lang$arity$19(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191,p__9193,q__9195,r__9197,s__9199);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191,p__9193,q__9195,r__9197,s__9199);
}
} else
{var t__9201 = cljs.core._first.call(null,args__9200);
var args__9202 = cljs.core._rest.call(null,args__9200);
if((argc === 20))
{if(f__9173.cljs$lang$arity$20)
{return f__9173.cljs$lang$arity$20(a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191,p__9193,q__9195,r__9197,s__9199,t__9201);
} else
{return f__9173.call(null,a__9163,b__9165,c__9167,d__9169,e__9171,f__9173,g__9175,h__9177,i__9179,j__9181,k__9183,l__9185,m__9187,n__9189,o__9191,p__9193,q__9195,r__9197,s__9199,t__9201);
}
} else
{throw (new Error("Only up to 20 arguments supported on functions"));
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
});
void 0;/**
* Applies fn f to the argument list formed by prepending intervening arguments to args.
* First cut.  Not lazy.  Needs to use emitted toApply.
* @param {...*} var_args
*/
cljs.core.apply = (function() {
var apply = null;
var apply__2 = (function (f,args){
var fixed_arity__9203 = f.cljs$lang$maxFixedArity;
if(cljs.core.truth_(f.cljs$lang$applyTo))
{var bc__9204 = cljs.core.bounded_count.call(null,args,(fixed_arity__9203 + 1));
if((bc__9204 <= fixed_arity__9203))
{return cljs.core.apply_to.call(null,f,bc__9204,args);
} else
{return f.cljs$lang$applyTo(args);
}
} else
{return f.apply(f,cljs.core.to_array.call(null,args));
}
});
var apply__3 = (function (f,x,args){
var arglist__9205 = cljs.core.list_STAR_.call(null,x,args);
var fixed_arity__9206 = f.cljs$lang$maxFixedArity;
if(cljs.core.truth_(f.cljs$lang$applyTo))
{var bc__9207 = cljs.core.bounded_count.call(null,arglist__9205,(fixed_arity__9206 + 1));
if((bc__9207 <= fixed_arity__9206))
{return cljs.core.apply_to.call(null,f,bc__9207,arglist__9205);
} else
{return f.cljs$lang$applyTo(arglist__9205);
}
} else
{return f.apply(f,cljs.core.to_array.call(null,arglist__9205));
}
});
var apply__4 = (function (f,x,y,args){
var arglist__9208 = cljs.core.list_STAR_.call(null,x,y,args);
var fixed_arity__9209 = f.cljs$lang$maxFixedArity;
if(cljs.core.truth_(f.cljs$lang$applyTo))
{var bc__9210 = cljs.core.bounded_count.call(null,arglist__9208,(fixed_arity__9209 + 1));
if((bc__9210 <= fixed_arity__9209))
{return cljs.core.apply_to.call(null,f,bc__9210,arglist__9208);
} else
{return f.cljs$lang$applyTo(arglist__9208);
}
} else
{return f.apply(f,cljs.core.to_array.call(null,arglist__9208));
}
});
var apply__5 = (function (f,x,y,z,args){
var arglist__9211 = cljs.core.list_STAR_.call(null,x,y,z,args);
var fixed_arity__9212 = f.cljs$lang$maxFixedArity;
if(cljs.core.truth_(f.cljs$lang$applyTo))
{var bc__9213 = cljs.core.bounded_count.call(null,arglist__9211,(fixed_arity__9212 + 1));
if((bc__9213 <= fixed_arity__9212))
{return cljs.core.apply_to.call(null,f,bc__9213,arglist__9211);
} else
{return f.cljs$lang$applyTo(arglist__9211);
}
} else
{return f.apply(f,cljs.core.to_array.call(null,arglist__9211));
}
});
var apply__6 = (function() { 
var G__9217__delegate = function (f,a,b,c,d,args){
var arglist__9214 = cljs.core.cons.call(null,a,cljs.core.cons.call(null,b,cljs.core.cons.call(null,c,cljs.core.cons.call(null,d,cljs.core.spread.call(null,args)))));
var fixed_arity__9215 = f.cljs$lang$maxFixedArity;
if(cljs.core.truth_(f.cljs$lang$applyTo))
{var bc__9216 = cljs.core.bounded_count.call(null,arglist__9214,(fixed_arity__9215 + 1));
if((bc__9216 <= fixed_arity__9215))
{return cljs.core.apply_to.call(null,f,bc__9216,arglist__9214);
} else
{return f.cljs$lang$applyTo(arglist__9214);
}
} else
{return f.apply(f,cljs.core.to_array.call(null,arglist__9214));
}
};
var G__9217 = function (f,a,b,c,d,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5),0);
} 
return G__9217__delegate.call(this, f, a, b, c, d, args);
};
G__9217.cljs$lang$maxFixedArity = 5;
G__9217.cljs$lang$applyTo = (function (arglist__9218){
var f = cljs.core.first(arglist__9218);
var a = cljs.core.first(cljs.core.next(arglist__9218));
var b = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9218)));
var c = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9218))));
var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9218)))));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9218)))));
return G__9217__delegate(f, a, b, c, d, args);
});
G__9217.cljs$lang$arity$variadic = G__9217__delegate;
return G__9217;
})()
;
apply = function(f,a,b,c,d,var_args){
var args = var_args;
switch(arguments.length){
case 2:
return apply__2.call(this,f,a);
case 3:
return apply__3.call(this,f,a,b);
case 4:
return apply__4.call(this,f,a,b,c);
case 5:
return apply__5.call(this,f,a,b,c,d);
default:
return apply__6.cljs$lang$arity$variadic(f,a,b,c,d, cljs.core.array_seq(arguments, 5));
}
throw('Invalid arity: ' + arguments.length);
};
apply.cljs$lang$maxFixedArity = 5;
apply.cljs$lang$applyTo = apply__6.cljs$lang$applyTo;
apply.cljs$lang$arity$2 = apply__2;
apply.cljs$lang$arity$3 = apply__3;
apply.cljs$lang$arity$4 = apply__4;
apply.cljs$lang$arity$5 = apply__5;
apply.cljs$lang$arity$variadic = apply__6.cljs$lang$arity$variadic;
return apply;
})()
;
/**
* Returns an object of the same type and value as obj, with
* (apply f (meta obj) args) as its metadata.
* @param {...*} var_args
*/
cljs.core.vary_meta = (function() { 
var vary_meta__delegate = function (obj,f,args){
return cljs.core.with_meta.call(null,obj,cljs.core.apply.call(null,f,cljs.core.meta.call(null,obj),args));
};
var vary_meta = function (obj,f,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return vary_meta__delegate.call(this, obj, f, args);
};
vary_meta.cljs$lang$maxFixedArity = 2;
vary_meta.cljs$lang$applyTo = (function (arglist__9219){
var obj = cljs.core.first(arglist__9219);
var f = cljs.core.first(cljs.core.next(arglist__9219));
var args = cljs.core.rest(cljs.core.next(arglist__9219));
return vary_meta__delegate(obj, f, args);
});
vary_meta.cljs$lang$arity$variadic = vary_meta__delegate;
return vary_meta;
})()
;
/**
* Same as (not (= obj1 obj2))
* @param {...*} var_args
*/
cljs.core.not_EQ_ = (function() {
var not_EQ_ = null;
var not_EQ___1 = (function (x){
return false;
});
var not_EQ___2 = (function (x,y){
return cljs.core.not.call(null,cljs.core._EQ_.call(null,x,y));
});
var not_EQ___3 = (function() { 
var G__9220__delegate = function (x,y,more){
return cljs.core.not.call(null,cljs.core.apply.call(null,cljs.core._EQ_,x,y,more));
};
var G__9220 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__9220__delegate.call(this, x, y, more);
};
G__9220.cljs$lang$maxFixedArity = 2;
G__9220.cljs$lang$applyTo = (function (arglist__9221){
var x = cljs.core.first(arglist__9221);
var y = cljs.core.first(cljs.core.next(arglist__9221));
var more = cljs.core.rest(cljs.core.next(arglist__9221));
return G__9220__delegate(x, y, more);
});
G__9220.cljs$lang$arity$variadic = G__9220__delegate;
return G__9220;
})()
;
not_EQ_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case 1:
return not_EQ___1.call(this,x);
case 2:
return not_EQ___2.call(this,x,y);
default:
return not_EQ___3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
not_EQ_.cljs$lang$maxFixedArity = 2;
not_EQ_.cljs$lang$applyTo = not_EQ___3.cljs$lang$applyTo;
not_EQ_.cljs$lang$arity$1 = not_EQ___1;
not_EQ_.cljs$lang$arity$2 = not_EQ___2;
not_EQ_.cljs$lang$arity$variadic = not_EQ___3.cljs$lang$arity$variadic;
return not_EQ_;
})()
;
/**
* If coll is empty, returns nil, else coll
*/
cljs.core.not_empty = (function not_empty(coll){
if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{return coll;
} else
{return null;
}
});
/**
* Returns true if (pred x) is logical true for every x in coll, else
* false.
*/
cljs.core.every_QMARK_ = (function every_QMARK_(pred,coll){
while(true){
if((cljs.core.seq.call(null,coll) == null))
{return true;
} else
{if(cljs.core.truth_(pred.call(null,cljs.core.first.call(null,coll))))
{{
var G__9222 = pred;
var G__9223 = cljs.core.next.call(null,coll);
pred = G__9222;
coll = G__9223;
continue;
}
} else
{if("\uFDD0'else")
{return false;
} else
{return null;
}
}
}
break;
}
});
/**
* Returns false if (pred x) is logical true for every x in
* coll, else true.
*/
cljs.core.not_every_QMARK_ = (function not_every_QMARK_(pred,coll){
return cljs.core.not.call(null,cljs.core.every_QMARK_.call(null,pred,coll));
});
/**
* Returns the first logical true value of (pred x) for any x in coll,
* else nil.  One common idiom is to use a set as pred, for example
* this will return :fred if :fred is in the sequence, otherwise nil:
* (some #{:fred} coll)
*/
cljs.core.some = (function some(pred,coll){
while(true){
if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{var or__138__auto____9224 = pred.call(null,cljs.core.first.call(null,coll));
if(cljs.core.truth_(or__138__auto____9224))
{return or__138__auto____9224;
} else
{{
var G__9225 = pred;
var G__9226 = cljs.core.next.call(null,coll);
pred = G__9225;
coll = G__9226;
continue;
}
}
} else
{return null;
}
break;
}
});
/**
* Returns false if (pred x) is logical true for any x in coll,
* else true.
*/
cljs.core.not_any_QMARK_ = (function not_any_QMARK_(pred,coll){
return cljs.core.not.call(null,cljs.core.some.call(null,pred,coll));
});
/**
* Returns true if n is even, throws an exception if n is not an integer
*/
cljs.core.even_QMARK_ = (function even_QMARK_(n){
if(cljs.core.integer_QMARK_.call(null,n))
{return ((n & 1) === 0);
} else
{throw (new Error([cljs.core.str("Argument must be an integer: "),cljs.core.str(n)].join('')));
}
});
/**
* Returns true if n is odd, throws an exception if n is not an integer
*/
cljs.core.odd_QMARK_ = (function odd_QMARK_(n){
return cljs.core.not.call(null,cljs.core.even_QMARK_.call(null,n));
});
cljs.core.identity = (function identity(x){
return x;
});
/**
* Takes a fn f and returns a fn that takes the same arguments as f,
* has the same effects, if any, and returns the opposite truth value.
*/
cljs.core.complement = (function complement(f){
return (function() {
var G__9227 = null;
var G__9227__0 = (function (){
return cljs.core.not.call(null,f.call(null));
});
var G__9227__1 = (function (x){
return cljs.core.not.call(null,f.call(null,x));
});
var G__9227__2 = (function (x,y){
return cljs.core.not.call(null,f.call(null,x,y));
});
var G__9227__3 = (function() { 
var G__9228__delegate = function (x,y,zs){
return cljs.core.not.call(null,cljs.core.apply.call(null,f,x,y,zs));
};
var G__9228 = function (x,y,var_args){
var zs = null;
if (goog.isDef(var_args)) {
  zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__9228__delegate.call(this, x, y, zs);
};
G__9228.cljs$lang$maxFixedArity = 2;
G__9228.cljs$lang$applyTo = (function (arglist__9229){
var x = cljs.core.first(arglist__9229);
var y = cljs.core.first(cljs.core.next(arglist__9229));
var zs = cljs.core.rest(cljs.core.next(arglist__9229));
return G__9228__delegate(x, y, zs);
});
G__9228.cljs$lang$arity$variadic = G__9228__delegate;
return G__9228;
})()
;
G__9227 = function(x,y,var_args){
var zs = var_args;
switch(arguments.length){
case 0:
return G__9227__0.call(this);
case 1:
return G__9227__1.call(this,x);
case 2:
return G__9227__2.call(this,x,y);
default:
return G__9227__3.cljs$lang$arity$variadic(x,y, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
G__9227.cljs$lang$maxFixedArity = 2;
G__9227.cljs$lang$applyTo = G__9227__3.cljs$lang$applyTo;
return G__9227;
})()
});
/**
* Returns a function that takes any number of arguments and returns x.
*/
cljs.core.constantly = (function constantly(x){
return (function() { 
var G__9230__delegate = function (args){
return x;
};
var G__9230 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__9230__delegate.call(this, args);
};
G__9230.cljs$lang$maxFixedArity = 0;
G__9230.cljs$lang$applyTo = (function (arglist__9231){
var args = cljs.core.seq(arglist__9231);;
return G__9230__delegate(args);
});
G__9230.cljs$lang$arity$variadic = G__9230__delegate;
return G__9230;
})()
;
});
/**
* Takes a set of functions and returns a fn that is the composition
* of those fns.  The returned fn takes a variable number of args,
* applies the rightmost of fns to the args, the next
* fn (right-to-left) to the result, etc.
* @param {...*} var_args
*/
cljs.core.comp = (function() {
var comp = null;
var comp__0 = (function (){
return cljs.core.identity;
});
var comp__1 = (function (f){
return f;
});
var comp__2 = (function (f,g){
return (function() {
var G__9235 = null;
var G__9235__0 = (function (){
return f.call(null,g.call(null));
});
var G__9235__1 = (function (x){
return f.call(null,g.call(null,x));
});
var G__9235__2 = (function (x,y){
return f.call(null,g.call(null,x,y));
});
var G__9235__3 = (function (x,y,z){
return f.call(null,g.call(null,x,y,z));
});
var G__9235__4 = (function() { 
var G__9236__delegate = function (x,y,z,args){
return f.call(null,cljs.core.apply.call(null,g,x,y,z,args));
};
var G__9236 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9236__delegate.call(this, x, y, z, args);
};
G__9236.cljs$lang$maxFixedArity = 3;
G__9236.cljs$lang$applyTo = (function (arglist__9237){
var x = cljs.core.first(arglist__9237);
var y = cljs.core.first(cljs.core.next(arglist__9237));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9237)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9237)));
return G__9236__delegate(x, y, z, args);
});
G__9236.cljs$lang$arity$variadic = G__9236__delegate;
return G__9236;
})()
;
G__9235 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return G__9235__0.call(this);
case 1:
return G__9235__1.call(this,x);
case 2:
return G__9235__2.call(this,x,y);
case 3:
return G__9235__3.call(this,x,y,z);
default:
return G__9235__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
G__9235.cljs$lang$maxFixedArity = 3;
G__9235.cljs$lang$applyTo = G__9235__4.cljs$lang$applyTo;
return G__9235;
})()
});
var comp__3 = (function (f,g,h){
return (function() {
var G__9238 = null;
var G__9238__0 = (function (){
return f.call(null,g.call(null,h.call(null)));
});
var G__9238__1 = (function (x){
return f.call(null,g.call(null,h.call(null,x)));
});
var G__9238__2 = (function (x,y){
return f.call(null,g.call(null,h.call(null,x,y)));
});
var G__9238__3 = (function (x,y,z){
return f.call(null,g.call(null,h.call(null,x,y,z)));
});
var G__9238__4 = (function() { 
var G__9239__delegate = function (x,y,z,args){
return f.call(null,g.call(null,cljs.core.apply.call(null,h,x,y,z,args)));
};
var G__9239 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9239__delegate.call(this, x, y, z, args);
};
G__9239.cljs$lang$maxFixedArity = 3;
G__9239.cljs$lang$applyTo = (function (arglist__9240){
var x = cljs.core.first(arglist__9240);
var y = cljs.core.first(cljs.core.next(arglist__9240));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9240)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9240)));
return G__9239__delegate(x, y, z, args);
});
G__9239.cljs$lang$arity$variadic = G__9239__delegate;
return G__9239;
})()
;
G__9238 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return G__9238__0.call(this);
case 1:
return G__9238__1.call(this,x);
case 2:
return G__9238__2.call(this,x,y);
case 3:
return G__9238__3.call(this,x,y,z);
default:
return G__9238__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
G__9238.cljs$lang$maxFixedArity = 3;
G__9238.cljs$lang$applyTo = G__9238__4.cljs$lang$applyTo;
return G__9238;
})()
});
var comp__4 = (function() { 
var G__9241__delegate = function (f1,f2,f3,fs){
var fs__9232 = cljs.core.reverse.call(null,cljs.core.list_STAR_.call(null,f1,f2,f3,fs));
return (function() { 
var G__9242__delegate = function (args){
var ret__9233 = cljs.core.apply.call(null,cljs.core.first.call(null,fs__9232),args);
var fs__9234 = cljs.core.next.call(null,fs__9232);
while(true){
if(cljs.core.truth_(fs__9234))
{{
var G__9243 = cljs.core.first.call(null,fs__9234).call(null,ret__9233);
var G__9244 = cljs.core.next.call(null,fs__9234);
ret__9233 = G__9243;
fs__9234 = G__9244;
continue;
}
} else
{return ret__9233;
}
break;
}
};
var G__9242 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__9242__delegate.call(this, args);
};
G__9242.cljs$lang$maxFixedArity = 0;
G__9242.cljs$lang$applyTo = (function (arglist__9245){
var args = cljs.core.seq(arglist__9245);;
return G__9242__delegate(args);
});
G__9242.cljs$lang$arity$variadic = G__9242__delegate;
return G__9242;
})()
;
};
var G__9241 = function (f1,f2,f3,var_args){
var fs = null;
if (goog.isDef(var_args)) {
  fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9241__delegate.call(this, f1, f2, f3, fs);
};
G__9241.cljs$lang$maxFixedArity = 3;
G__9241.cljs$lang$applyTo = (function (arglist__9246){
var f1 = cljs.core.first(arglist__9246);
var f2 = cljs.core.first(cljs.core.next(arglist__9246));
var f3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9246)));
var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9246)));
return G__9241__delegate(f1, f2, f3, fs);
});
G__9241.cljs$lang$arity$variadic = G__9241__delegate;
return G__9241;
})()
;
comp = function(f1,f2,f3,var_args){
var fs = var_args;
switch(arguments.length){
case 0:
return comp__0.call(this);
case 1:
return comp__1.call(this,f1);
case 2:
return comp__2.call(this,f1,f2);
case 3:
return comp__3.call(this,f1,f2,f3);
default:
return comp__4.cljs$lang$arity$variadic(f1,f2,f3, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
comp.cljs$lang$maxFixedArity = 3;
comp.cljs$lang$applyTo = comp__4.cljs$lang$applyTo;
comp.cljs$lang$arity$0 = comp__0;
comp.cljs$lang$arity$1 = comp__1;
comp.cljs$lang$arity$2 = comp__2;
comp.cljs$lang$arity$3 = comp__3;
comp.cljs$lang$arity$variadic = comp__4.cljs$lang$arity$variadic;
return comp;
})()
;
/**
* Takes a function f and fewer than the normal arguments to f, and
* returns a fn that takes a variable number of additional args. When
* called, the returned function calls f with args + additional args.
* @param {...*} var_args
*/
cljs.core.partial = (function() {
var partial = null;
var partial__2 = (function (f,arg1){
return (function() { 
var G__9247__delegate = function (args){
return cljs.core.apply.call(null,f,arg1,args);
};
var G__9247 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__9247__delegate.call(this, args);
};
G__9247.cljs$lang$maxFixedArity = 0;
G__9247.cljs$lang$applyTo = (function (arglist__9248){
var args = cljs.core.seq(arglist__9248);;
return G__9247__delegate(args);
});
G__9247.cljs$lang$arity$variadic = G__9247__delegate;
return G__9247;
})()
;
});
var partial__3 = (function (f,arg1,arg2){
return (function() { 
var G__9249__delegate = function (args){
return cljs.core.apply.call(null,f,arg1,arg2,args);
};
var G__9249 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__9249__delegate.call(this, args);
};
G__9249.cljs$lang$maxFixedArity = 0;
G__9249.cljs$lang$applyTo = (function (arglist__9250){
var args = cljs.core.seq(arglist__9250);;
return G__9249__delegate(args);
});
G__9249.cljs$lang$arity$variadic = G__9249__delegate;
return G__9249;
})()
;
});
var partial__4 = (function (f,arg1,arg2,arg3){
return (function() { 
var G__9251__delegate = function (args){
return cljs.core.apply.call(null,f,arg1,arg2,arg3,args);
};
var G__9251 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__9251__delegate.call(this, args);
};
G__9251.cljs$lang$maxFixedArity = 0;
G__9251.cljs$lang$applyTo = (function (arglist__9252){
var args = cljs.core.seq(arglist__9252);;
return G__9251__delegate(args);
});
G__9251.cljs$lang$arity$variadic = G__9251__delegate;
return G__9251;
})()
;
});
var partial__5 = (function() { 
var G__9253__delegate = function (f,arg1,arg2,arg3,more){
return (function() { 
var G__9254__delegate = function (args){
return cljs.core.apply.call(null,f,arg1,arg2,arg3,cljs.core.concat.call(null,more,args));
};
var G__9254 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__9254__delegate.call(this, args);
};
G__9254.cljs$lang$maxFixedArity = 0;
G__9254.cljs$lang$applyTo = (function (arglist__9255){
var args = cljs.core.seq(arglist__9255);;
return G__9254__delegate(args);
});
G__9254.cljs$lang$arity$variadic = G__9254__delegate;
return G__9254;
})()
;
};
var G__9253 = function (f,arg1,arg2,arg3,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4),0);
} 
return G__9253__delegate.call(this, f, arg1, arg2, arg3, more);
};
G__9253.cljs$lang$maxFixedArity = 4;
G__9253.cljs$lang$applyTo = (function (arglist__9256){
var f = cljs.core.first(arglist__9256);
var arg1 = cljs.core.first(cljs.core.next(arglist__9256));
var arg2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9256)));
var arg3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9256))));
var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9256))));
return G__9253__delegate(f, arg1, arg2, arg3, more);
});
G__9253.cljs$lang$arity$variadic = G__9253__delegate;
return G__9253;
})()
;
partial = function(f,arg1,arg2,arg3,var_args){
var more = var_args;
switch(arguments.length){
case 2:
return partial__2.call(this,f,arg1);
case 3:
return partial__3.call(this,f,arg1,arg2);
case 4:
return partial__4.call(this,f,arg1,arg2,arg3);
default:
return partial__5.cljs$lang$arity$variadic(f,arg1,arg2,arg3, cljs.core.array_seq(arguments, 4));
}
throw('Invalid arity: ' + arguments.length);
};
partial.cljs$lang$maxFixedArity = 4;
partial.cljs$lang$applyTo = partial__5.cljs$lang$applyTo;
partial.cljs$lang$arity$2 = partial__2;
partial.cljs$lang$arity$3 = partial__3;
partial.cljs$lang$arity$4 = partial__4;
partial.cljs$lang$arity$variadic = partial__5.cljs$lang$arity$variadic;
return partial;
})()
;
/**
* Takes a function f, and returns a function that calls f, replacing
* a nil first argument to f with the supplied value x. Higher arity
* versions can replace arguments in the second and third
* positions (y, z). Note that the function f can take any number of
* arguments, not just the one(s) being nil-patched.
*/
cljs.core.fnil = (function() {
var fnil = null;
var fnil__2 = (function (f,x){
return (function() {
var G__9257 = null;
var G__9257__1 = (function (a){
return f.call(null,(((a == null))?x:a));
});
var G__9257__2 = (function (a,b){
return f.call(null,(((a == null))?x:a),b);
});
var G__9257__3 = (function (a,b,c){
return f.call(null,(((a == null))?x:a),b,c);
});
var G__9257__4 = (function() { 
var G__9258__delegate = function (a,b,c,ds){
return cljs.core.apply.call(null,f,(((a == null))?x:a),b,c,ds);
};
var G__9258 = function (a,b,c,var_args){
var ds = null;
if (goog.isDef(var_args)) {
  ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9258__delegate.call(this, a, b, c, ds);
};
G__9258.cljs$lang$maxFixedArity = 3;
G__9258.cljs$lang$applyTo = (function (arglist__9259){
var a = cljs.core.first(arglist__9259);
var b = cljs.core.first(cljs.core.next(arglist__9259));
var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9259)));
var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9259)));
return G__9258__delegate(a, b, c, ds);
});
G__9258.cljs$lang$arity$variadic = G__9258__delegate;
return G__9258;
})()
;
G__9257 = function(a,b,c,var_args){
var ds = var_args;
switch(arguments.length){
case 1:
return G__9257__1.call(this,a);
case 2:
return G__9257__2.call(this,a,b);
case 3:
return G__9257__3.call(this,a,b,c);
default:
return G__9257__4.cljs$lang$arity$variadic(a,b,c, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
G__9257.cljs$lang$maxFixedArity = 3;
G__9257.cljs$lang$applyTo = G__9257__4.cljs$lang$applyTo;
return G__9257;
})()
});
var fnil__3 = (function (f,x,y){
return (function() {
var G__9260 = null;
var G__9260__2 = (function (a,b){
return f.call(null,(((a == null))?x:a),(((b == null))?y:b));
});
var G__9260__3 = (function (a,b,c){
return f.call(null,(((a == null))?x:a),(((b == null))?y:b),c);
});
var G__9260__4 = (function() { 
var G__9261__delegate = function (a,b,c,ds){
return cljs.core.apply.call(null,f,(((a == null))?x:a),(((b == null))?y:b),c,ds);
};
var G__9261 = function (a,b,c,var_args){
var ds = null;
if (goog.isDef(var_args)) {
  ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9261__delegate.call(this, a, b, c, ds);
};
G__9261.cljs$lang$maxFixedArity = 3;
G__9261.cljs$lang$applyTo = (function (arglist__9262){
var a = cljs.core.first(arglist__9262);
var b = cljs.core.first(cljs.core.next(arglist__9262));
var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9262)));
var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9262)));
return G__9261__delegate(a, b, c, ds);
});
G__9261.cljs$lang$arity$variadic = G__9261__delegate;
return G__9261;
})()
;
G__9260 = function(a,b,c,var_args){
var ds = var_args;
switch(arguments.length){
case 2:
return G__9260__2.call(this,a,b);
case 3:
return G__9260__3.call(this,a,b,c);
default:
return G__9260__4.cljs$lang$arity$variadic(a,b,c, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
G__9260.cljs$lang$maxFixedArity = 3;
G__9260.cljs$lang$applyTo = G__9260__4.cljs$lang$applyTo;
return G__9260;
})()
});
var fnil__4 = (function (f,x,y,z){
return (function() {
var G__9263 = null;
var G__9263__2 = (function (a,b){
return f.call(null,(((a == null))?x:a),(((b == null))?y:b));
});
var G__9263__3 = (function (a,b,c){
return f.call(null,(((a == null))?x:a),(((b == null))?y:b),(((c == null))?z:c));
});
var G__9263__4 = (function() { 
var G__9264__delegate = function (a,b,c,ds){
return cljs.core.apply.call(null,f,(((a == null))?x:a),(((b == null))?y:b),(((c == null))?z:c),ds);
};
var G__9264 = function (a,b,c,var_args){
var ds = null;
if (goog.isDef(var_args)) {
  ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9264__delegate.call(this, a, b, c, ds);
};
G__9264.cljs$lang$maxFixedArity = 3;
G__9264.cljs$lang$applyTo = (function (arglist__9265){
var a = cljs.core.first(arglist__9265);
var b = cljs.core.first(cljs.core.next(arglist__9265));
var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9265)));
var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9265)));
return G__9264__delegate(a, b, c, ds);
});
G__9264.cljs$lang$arity$variadic = G__9264__delegate;
return G__9264;
})()
;
G__9263 = function(a,b,c,var_args){
var ds = var_args;
switch(arguments.length){
case 2:
return G__9263__2.call(this,a,b);
case 3:
return G__9263__3.call(this,a,b,c);
default:
return G__9263__4.cljs$lang$arity$variadic(a,b,c, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
G__9263.cljs$lang$maxFixedArity = 3;
G__9263.cljs$lang$applyTo = G__9263__4.cljs$lang$applyTo;
return G__9263;
})()
});
fnil = function(f,x,y,z){
switch(arguments.length){
case 2:
return fnil__2.call(this,f,x);
case 3:
return fnil__3.call(this,f,x,y);
case 4:
return fnil__4.call(this,f,x,y,z);
}
throw('Invalid arity: ' + arguments.length);
};
fnil.cljs$lang$arity$2 = fnil__2;
fnil.cljs$lang$arity$3 = fnil__3;
fnil.cljs$lang$arity$4 = fnil__4;
return fnil;
})()
;
/**
* Returns a lazy sequence consisting of the result of applying f to 0
* and the first item of coll, followed by applying f to 1 and the second
* item in coll, etc, until coll is exhausted. Thus function f should
* accept 2 arguments, index and item.
*/
cljs.core.map_indexed = (function map_indexed(f,coll){
var mapi__9268 = (function mpi(idx,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____9266 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____9266))
{var s__9267 = temp__324__auto____9266;
return cljs.core.cons.call(null,f.call(null,idx,cljs.core.first.call(null,s__9267)),mpi.call(null,(idx + 1),cljs.core.rest.call(null,s__9267)));
} else
{return null;
}
})));
});
return mapi__9268.call(null,0,coll);
});
/**
* Returns a lazy sequence of the non-nil results of (f item). Note,
* this means false return values will be included.  f must be free of
* side-effects.
*/
cljs.core.keep = (function keep(f,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____9269 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____9269))
{var s__9270 = temp__324__auto____9269;
var x__9271 = f.call(null,cljs.core.first.call(null,s__9270));
if((x__9271 == null))
{return keep.call(null,f,cljs.core.rest.call(null,s__9270));
} else
{return cljs.core.cons.call(null,x__9271,keep.call(null,f,cljs.core.rest.call(null,s__9270)));
}
} else
{return null;
}
})));
});
/**
* Returns a lazy sequence of the non-nil results of (f index item). Note,
* this means false return values will be included.  f must be free of
* side-effects.
*/
cljs.core.keep_indexed = (function keep_indexed(f,coll){
var keepi__9281 = (function kpi(idx,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____9278 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____9278))
{var s__9279 = temp__324__auto____9278;
var x__9280 = f.call(null,idx,cljs.core.first.call(null,s__9279));
if((x__9280 == null))
{return kpi.call(null,(idx + 1),cljs.core.rest.call(null,s__9279));
} else
{return cljs.core.cons.call(null,x__9280,kpi.call(null,(idx + 1),cljs.core.rest.call(null,s__9279)));
}
} else
{return null;
}
})));
});
return keepi__9281.call(null,0,coll);
});
/**
* Takes a set of predicates and returns a function f that returns true if all of its
* composing predicates return a logical true value against all of its arguments, else it returns
* false. Note that f is short-circuiting in that it will stop execution on the first
* argument that triggers a logical false result against the original predicates.
* @param {...*} var_args
*/
cljs.core.every_pred = (function() {
var every_pred = null;
var every_pred__1 = (function (p){
return (function() {
var ep1 = null;
var ep1__0 = (function (){
return true;
});
var ep1__1 = (function (x){
return cljs.core.boolean$.call(null,p.call(null,x));
});
var ep1__2 = (function (x,y){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9288 = p.call(null,x);
if(cljs.core.truth_(and__132__auto____9288))
{return p.call(null,y);
} else
{return and__132__auto____9288;
}
})());
});
var ep1__3 = (function (x,y,z){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9289 = p.call(null,x);
if(cljs.core.truth_(and__132__auto____9289))
{var and__132__auto____9290 = p.call(null,y);
if(cljs.core.truth_(and__132__auto____9290))
{return p.call(null,z);
} else
{return and__132__auto____9290;
}
} else
{return and__132__auto____9289;
}
})());
});
var ep1__4 = (function() { 
var G__9326__delegate = function (x,y,z,args){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9291 = ep1.call(null,x,y,z);
if(cljs.core.truth_(and__132__auto____9291))
{return cljs.core.every_QMARK_.call(null,p,args);
} else
{return and__132__auto____9291;
}
})());
};
var G__9326 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9326__delegate.call(this, x, y, z, args);
};
G__9326.cljs$lang$maxFixedArity = 3;
G__9326.cljs$lang$applyTo = (function (arglist__9327){
var x = cljs.core.first(arglist__9327);
var y = cljs.core.first(cljs.core.next(arglist__9327));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9327)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9327)));
return G__9326__delegate(x, y, z, args);
});
G__9326.cljs$lang$arity$variadic = G__9326__delegate;
return G__9326;
})()
;
ep1 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return ep1__0.call(this);
case 1:
return ep1__1.call(this,x);
case 2:
return ep1__2.call(this,x,y);
case 3:
return ep1__3.call(this,x,y,z);
default:
return ep1__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
ep1.cljs$lang$maxFixedArity = 3;
ep1.cljs$lang$applyTo = ep1__4.cljs$lang$applyTo;
ep1.cljs$lang$arity$0 = ep1__0;
ep1.cljs$lang$arity$1 = ep1__1;
ep1.cljs$lang$arity$2 = ep1__2;
ep1.cljs$lang$arity$3 = ep1__3;
ep1.cljs$lang$arity$variadic = ep1__4.cljs$lang$arity$variadic;
return ep1;
})()
});
var every_pred__2 = (function (p1,p2){
return (function() {
var ep2 = null;
var ep2__0 = (function (){
return true;
});
var ep2__1 = (function (x){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9292 = p1.call(null,x);
if(cljs.core.truth_(and__132__auto____9292))
{return p2.call(null,x);
} else
{return and__132__auto____9292;
}
})());
});
var ep2__2 = (function (x,y){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9293 = p1.call(null,x);
if(cljs.core.truth_(and__132__auto____9293))
{var and__132__auto____9294 = p1.call(null,y);
if(cljs.core.truth_(and__132__auto____9294))
{var and__132__auto____9295 = p2.call(null,x);
if(cljs.core.truth_(and__132__auto____9295))
{return p2.call(null,y);
} else
{return and__132__auto____9295;
}
} else
{return and__132__auto____9294;
}
} else
{return and__132__auto____9293;
}
})());
});
var ep2__3 = (function (x,y,z){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9296 = p1.call(null,x);
if(cljs.core.truth_(and__132__auto____9296))
{var and__132__auto____9297 = p1.call(null,y);
if(cljs.core.truth_(and__132__auto____9297))
{var and__132__auto____9298 = p1.call(null,z);
if(cljs.core.truth_(and__132__auto____9298))
{var and__132__auto____9299 = p2.call(null,x);
if(cljs.core.truth_(and__132__auto____9299))
{var and__132__auto____9300 = p2.call(null,y);
if(cljs.core.truth_(and__132__auto____9300))
{return p2.call(null,z);
} else
{return and__132__auto____9300;
}
} else
{return and__132__auto____9299;
}
} else
{return and__132__auto____9298;
}
} else
{return and__132__auto____9297;
}
} else
{return and__132__auto____9296;
}
})());
});
var ep2__4 = (function() { 
var G__9328__delegate = function (x,y,z,args){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9301 = ep2.call(null,x,y,z);
if(cljs.core.truth_(and__132__auto____9301))
{return cljs.core.every_QMARK_.call(null,(function (p1__9272_SHARP_){
var and__132__auto____9302 = p1.call(null,p1__9272_SHARP_);
if(cljs.core.truth_(and__132__auto____9302))
{return p2.call(null,p1__9272_SHARP_);
} else
{return and__132__auto____9302;
}
}),args);
} else
{return and__132__auto____9301;
}
})());
};
var G__9328 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9328__delegate.call(this, x, y, z, args);
};
G__9328.cljs$lang$maxFixedArity = 3;
G__9328.cljs$lang$applyTo = (function (arglist__9329){
var x = cljs.core.first(arglist__9329);
var y = cljs.core.first(cljs.core.next(arglist__9329));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9329)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9329)));
return G__9328__delegate(x, y, z, args);
});
G__9328.cljs$lang$arity$variadic = G__9328__delegate;
return G__9328;
})()
;
ep2 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return ep2__0.call(this);
case 1:
return ep2__1.call(this,x);
case 2:
return ep2__2.call(this,x,y);
case 3:
return ep2__3.call(this,x,y,z);
default:
return ep2__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
ep2.cljs$lang$maxFixedArity = 3;
ep2.cljs$lang$applyTo = ep2__4.cljs$lang$applyTo;
ep2.cljs$lang$arity$0 = ep2__0;
ep2.cljs$lang$arity$1 = ep2__1;
ep2.cljs$lang$arity$2 = ep2__2;
ep2.cljs$lang$arity$3 = ep2__3;
ep2.cljs$lang$arity$variadic = ep2__4.cljs$lang$arity$variadic;
return ep2;
})()
});
var every_pred__3 = (function (p1,p2,p3){
return (function() {
var ep3 = null;
var ep3__0 = (function (){
return true;
});
var ep3__1 = (function (x){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9303 = p1.call(null,x);
if(cljs.core.truth_(and__132__auto____9303))
{var and__132__auto____9304 = p2.call(null,x);
if(cljs.core.truth_(and__132__auto____9304))
{return p3.call(null,x);
} else
{return and__132__auto____9304;
}
} else
{return and__132__auto____9303;
}
})());
});
var ep3__2 = (function (x,y){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9305 = p1.call(null,x);
if(cljs.core.truth_(and__132__auto____9305))
{var and__132__auto____9306 = p2.call(null,x);
if(cljs.core.truth_(and__132__auto____9306))
{var and__132__auto____9307 = p3.call(null,x);
if(cljs.core.truth_(and__132__auto____9307))
{var and__132__auto____9308 = p1.call(null,y);
if(cljs.core.truth_(and__132__auto____9308))
{var and__132__auto____9309 = p2.call(null,y);
if(cljs.core.truth_(and__132__auto____9309))
{return p3.call(null,y);
} else
{return and__132__auto____9309;
}
} else
{return and__132__auto____9308;
}
} else
{return and__132__auto____9307;
}
} else
{return and__132__auto____9306;
}
} else
{return and__132__auto____9305;
}
})());
});
var ep3__3 = (function (x,y,z){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9310 = p1.call(null,x);
if(cljs.core.truth_(and__132__auto____9310))
{var and__132__auto____9311 = p2.call(null,x);
if(cljs.core.truth_(and__132__auto____9311))
{var and__132__auto____9312 = p3.call(null,x);
if(cljs.core.truth_(and__132__auto____9312))
{var and__132__auto____9313 = p1.call(null,y);
if(cljs.core.truth_(and__132__auto____9313))
{var and__132__auto____9314 = p2.call(null,y);
if(cljs.core.truth_(and__132__auto____9314))
{var and__132__auto____9315 = p3.call(null,y);
if(cljs.core.truth_(and__132__auto____9315))
{var and__132__auto____9316 = p1.call(null,z);
if(cljs.core.truth_(and__132__auto____9316))
{var and__132__auto____9317 = p2.call(null,z);
if(cljs.core.truth_(and__132__auto____9317))
{return p3.call(null,z);
} else
{return and__132__auto____9317;
}
} else
{return and__132__auto____9316;
}
} else
{return and__132__auto____9315;
}
} else
{return and__132__auto____9314;
}
} else
{return and__132__auto____9313;
}
} else
{return and__132__auto____9312;
}
} else
{return and__132__auto____9311;
}
} else
{return and__132__auto____9310;
}
})());
});
var ep3__4 = (function() { 
var G__9330__delegate = function (x,y,z,args){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9318 = ep3.call(null,x,y,z);
if(cljs.core.truth_(and__132__auto____9318))
{return cljs.core.every_QMARK_.call(null,(function (p1__9273_SHARP_){
var and__132__auto____9319 = p1.call(null,p1__9273_SHARP_);
if(cljs.core.truth_(and__132__auto____9319))
{var and__132__auto____9320 = p2.call(null,p1__9273_SHARP_);
if(cljs.core.truth_(and__132__auto____9320))
{return p3.call(null,p1__9273_SHARP_);
} else
{return and__132__auto____9320;
}
} else
{return and__132__auto____9319;
}
}),args);
} else
{return and__132__auto____9318;
}
})());
};
var G__9330 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9330__delegate.call(this, x, y, z, args);
};
G__9330.cljs$lang$maxFixedArity = 3;
G__9330.cljs$lang$applyTo = (function (arglist__9331){
var x = cljs.core.first(arglist__9331);
var y = cljs.core.first(cljs.core.next(arglist__9331));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9331)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9331)));
return G__9330__delegate(x, y, z, args);
});
G__9330.cljs$lang$arity$variadic = G__9330__delegate;
return G__9330;
})()
;
ep3 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return ep3__0.call(this);
case 1:
return ep3__1.call(this,x);
case 2:
return ep3__2.call(this,x,y);
case 3:
return ep3__3.call(this,x,y,z);
default:
return ep3__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
ep3.cljs$lang$maxFixedArity = 3;
ep3.cljs$lang$applyTo = ep3__4.cljs$lang$applyTo;
ep3.cljs$lang$arity$0 = ep3__0;
ep3.cljs$lang$arity$1 = ep3__1;
ep3.cljs$lang$arity$2 = ep3__2;
ep3.cljs$lang$arity$3 = ep3__3;
ep3.cljs$lang$arity$variadic = ep3__4.cljs$lang$arity$variadic;
return ep3;
})()
});
var every_pred__4 = (function() { 
var G__9332__delegate = function (p1,p2,p3,ps){
var ps__9321 = cljs.core.list_STAR_.call(null,p1,p2,p3,ps);
return (function() {
var epn = null;
var epn__0 = (function (){
return true;
});
var epn__1 = (function (x){
return cljs.core.every_QMARK_.call(null,(function (p1__9274_SHARP_){
return p1__9274_SHARP_.call(null,x);
}),ps__9321);
});
var epn__2 = (function (x,y){
return cljs.core.every_QMARK_.call(null,(function (p1__9275_SHARP_){
var and__132__auto____9322 = p1__9275_SHARP_.call(null,x);
if(cljs.core.truth_(and__132__auto____9322))
{return p1__9275_SHARP_.call(null,y);
} else
{return and__132__auto____9322;
}
}),ps__9321);
});
var epn__3 = (function (x,y,z){
return cljs.core.every_QMARK_.call(null,(function (p1__9276_SHARP_){
var and__132__auto____9323 = p1__9276_SHARP_.call(null,x);
if(cljs.core.truth_(and__132__auto____9323))
{var and__132__auto____9324 = p1__9276_SHARP_.call(null,y);
if(cljs.core.truth_(and__132__auto____9324))
{return p1__9276_SHARP_.call(null,z);
} else
{return and__132__auto____9324;
}
} else
{return and__132__auto____9323;
}
}),ps__9321);
});
var epn__4 = (function() { 
var G__9333__delegate = function (x,y,z,args){
return cljs.core.boolean$.call(null,(function (){var and__132__auto____9325 = epn.call(null,x,y,z);
if(cljs.core.truth_(and__132__auto____9325))
{return cljs.core.every_QMARK_.call(null,(function (p1__9277_SHARP_){
return cljs.core.every_QMARK_.call(null,p1__9277_SHARP_,args);
}),ps__9321);
} else
{return and__132__auto____9325;
}
})());
};
var G__9333 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9333__delegate.call(this, x, y, z, args);
};
G__9333.cljs$lang$maxFixedArity = 3;
G__9333.cljs$lang$applyTo = (function (arglist__9334){
var x = cljs.core.first(arglist__9334);
var y = cljs.core.first(cljs.core.next(arglist__9334));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9334)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9334)));
return G__9333__delegate(x, y, z, args);
});
G__9333.cljs$lang$arity$variadic = G__9333__delegate;
return G__9333;
})()
;
epn = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return epn__0.call(this);
case 1:
return epn__1.call(this,x);
case 2:
return epn__2.call(this,x,y);
case 3:
return epn__3.call(this,x,y,z);
default:
return epn__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
epn.cljs$lang$maxFixedArity = 3;
epn.cljs$lang$applyTo = epn__4.cljs$lang$applyTo;
epn.cljs$lang$arity$0 = epn__0;
epn.cljs$lang$arity$1 = epn__1;
epn.cljs$lang$arity$2 = epn__2;
epn.cljs$lang$arity$3 = epn__3;
epn.cljs$lang$arity$variadic = epn__4.cljs$lang$arity$variadic;
return epn;
})()
};
var G__9332 = function (p1,p2,p3,var_args){
var ps = null;
if (goog.isDef(var_args)) {
  ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9332__delegate.call(this, p1, p2, p3, ps);
};
G__9332.cljs$lang$maxFixedArity = 3;
G__9332.cljs$lang$applyTo = (function (arglist__9335){
var p1 = cljs.core.first(arglist__9335);
var p2 = cljs.core.first(cljs.core.next(arglist__9335));
var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9335)));
var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9335)));
return G__9332__delegate(p1, p2, p3, ps);
});
G__9332.cljs$lang$arity$variadic = G__9332__delegate;
return G__9332;
})()
;
every_pred = function(p1,p2,p3,var_args){
var ps = var_args;
switch(arguments.length){
case 1:
return every_pred__1.call(this,p1);
case 2:
return every_pred__2.call(this,p1,p2);
case 3:
return every_pred__3.call(this,p1,p2,p3);
default:
return every_pred__4.cljs$lang$arity$variadic(p1,p2,p3, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
every_pred.cljs$lang$maxFixedArity = 3;
every_pred.cljs$lang$applyTo = every_pred__4.cljs$lang$applyTo;
every_pred.cljs$lang$arity$1 = every_pred__1;
every_pred.cljs$lang$arity$2 = every_pred__2;
every_pred.cljs$lang$arity$3 = every_pred__3;
every_pred.cljs$lang$arity$variadic = every_pred__4.cljs$lang$arity$variadic;
return every_pred;
})()
;
/**
* Takes a set of predicates and returns a function f that returns the first logical true value
* returned by one of its composing predicates against any of its arguments, else it returns
* logical false. Note that f is short-circuiting in that it will stop execution on the first
* argument that triggers a logical true result against the original predicates.
* @param {...*} var_args
*/
cljs.core.some_fn = (function() {
var some_fn = null;
var some_fn__1 = (function (p){
return (function() {
var sp1 = null;
var sp1__0 = (function (){
return null;
});
var sp1__1 = (function (x){
return p.call(null,x);
});
var sp1__2 = (function (x,y){
var or__138__auto____9337 = p.call(null,x);
if(cljs.core.truth_(or__138__auto____9337))
{return or__138__auto____9337;
} else
{return p.call(null,y);
}
});
var sp1__3 = (function (x,y,z){
var or__138__auto____9338 = p.call(null,x);
if(cljs.core.truth_(or__138__auto____9338))
{return or__138__auto____9338;
} else
{var or__138__auto____9339 = p.call(null,y);
if(cljs.core.truth_(or__138__auto____9339))
{return or__138__auto____9339;
} else
{return p.call(null,z);
}
}
});
var sp1__4 = (function() { 
var G__9375__delegate = function (x,y,z,args){
var or__138__auto____9340 = sp1.call(null,x,y,z);
if(cljs.core.truth_(or__138__auto____9340))
{return or__138__auto____9340;
} else
{return cljs.core.some.call(null,p,args);
}
};
var G__9375 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9375__delegate.call(this, x, y, z, args);
};
G__9375.cljs$lang$maxFixedArity = 3;
G__9375.cljs$lang$applyTo = (function (arglist__9376){
var x = cljs.core.first(arglist__9376);
var y = cljs.core.first(cljs.core.next(arglist__9376));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9376)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9376)));
return G__9375__delegate(x, y, z, args);
});
G__9375.cljs$lang$arity$variadic = G__9375__delegate;
return G__9375;
})()
;
sp1 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return sp1__0.call(this);
case 1:
return sp1__1.call(this,x);
case 2:
return sp1__2.call(this,x,y);
case 3:
return sp1__3.call(this,x,y,z);
default:
return sp1__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
sp1.cljs$lang$maxFixedArity = 3;
sp1.cljs$lang$applyTo = sp1__4.cljs$lang$applyTo;
sp1.cljs$lang$arity$0 = sp1__0;
sp1.cljs$lang$arity$1 = sp1__1;
sp1.cljs$lang$arity$2 = sp1__2;
sp1.cljs$lang$arity$3 = sp1__3;
sp1.cljs$lang$arity$variadic = sp1__4.cljs$lang$arity$variadic;
return sp1;
})()
});
var some_fn__2 = (function (p1,p2){
return (function() {
var sp2 = null;
var sp2__0 = (function (){
return null;
});
var sp2__1 = (function (x){
var or__138__auto____9341 = p1.call(null,x);
if(cljs.core.truth_(or__138__auto____9341))
{return or__138__auto____9341;
} else
{return p2.call(null,x);
}
});
var sp2__2 = (function (x,y){
var or__138__auto____9342 = p1.call(null,x);
if(cljs.core.truth_(or__138__auto____9342))
{return or__138__auto____9342;
} else
{var or__138__auto____9343 = p1.call(null,y);
if(cljs.core.truth_(or__138__auto____9343))
{return or__138__auto____9343;
} else
{var or__138__auto____9344 = p2.call(null,x);
if(cljs.core.truth_(or__138__auto____9344))
{return or__138__auto____9344;
} else
{return p2.call(null,y);
}
}
}
});
var sp2__3 = (function (x,y,z){
var or__138__auto____9345 = p1.call(null,x);
if(cljs.core.truth_(or__138__auto____9345))
{return or__138__auto____9345;
} else
{var or__138__auto____9346 = p1.call(null,y);
if(cljs.core.truth_(or__138__auto____9346))
{return or__138__auto____9346;
} else
{var or__138__auto____9347 = p1.call(null,z);
if(cljs.core.truth_(or__138__auto____9347))
{return or__138__auto____9347;
} else
{var or__138__auto____9348 = p2.call(null,x);
if(cljs.core.truth_(or__138__auto____9348))
{return or__138__auto____9348;
} else
{var or__138__auto____9349 = p2.call(null,y);
if(cljs.core.truth_(or__138__auto____9349))
{return or__138__auto____9349;
} else
{return p2.call(null,z);
}
}
}
}
}
});
var sp2__4 = (function() { 
var G__9377__delegate = function (x,y,z,args){
var or__138__auto____9350 = sp2.call(null,x,y,z);
if(cljs.core.truth_(or__138__auto____9350))
{return or__138__auto____9350;
} else
{return cljs.core.some.call(null,(function (p1__9282_SHARP_){
var or__138__auto____9351 = p1.call(null,p1__9282_SHARP_);
if(cljs.core.truth_(or__138__auto____9351))
{return or__138__auto____9351;
} else
{return p2.call(null,p1__9282_SHARP_);
}
}),args);
}
};
var G__9377 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9377__delegate.call(this, x, y, z, args);
};
G__9377.cljs$lang$maxFixedArity = 3;
G__9377.cljs$lang$applyTo = (function (arglist__9378){
var x = cljs.core.first(arglist__9378);
var y = cljs.core.first(cljs.core.next(arglist__9378));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9378)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9378)));
return G__9377__delegate(x, y, z, args);
});
G__9377.cljs$lang$arity$variadic = G__9377__delegate;
return G__9377;
})()
;
sp2 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return sp2__0.call(this);
case 1:
return sp2__1.call(this,x);
case 2:
return sp2__2.call(this,x,y);
case 3:
return sp2__3.call(this,x,y,z);
default:
return sp2__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
sp2.cljs$lang$maxFixedArity = 3;
sp2.cljs$lang$applyTo = sp2__4.cljs$lang$applyTo;
sp2.cljs$lang$arity$0 = sp2__0;
sp2.cljs$lang$arity$1 = sp2__1;
sp2.cljs$lang$arity$2 = sp2__2;
sp2.cljs$lang$arity$3 = sp2__3;
sp2.cljs$lang$arity$variadic = sp2__4.cljs$lang$arity$variadic;
return sp2;
})()
});
var some_fn__3 = (function (p1,p2,p3){
return (function() {
var sp3 = null;
var sp3__0 = (function (){
return null;
});
var sp3__1 = (function (x){
var or__138__auto____9352 = p1.call(null,x);
if(cljs.core.truth_(or__138__auto____9352))
{return or__138__auto____9352;
} else
{var or__138__auto____9353 = p2.call(null,x);
if(cljs.core.truth_(or__138__auto____9353))
{return or__138__auto____9353;
} else
{return p3.call(null,x);
}
}
});
var sp3__2 = (function (x,y){
var or__138__auto____9354 = p1.call(null,x);
if(cljs.core.truth_(or__138__auto____9354))
{return or__138__auto____9354;
} else
{var or__138__auto____9355 = p2.call(null,x);
if(cljs.core.truth_(or__138__auto____9355))
{return or__138__auto____9355;
} else
{var or__138__auto____9356 = p3.call(null,x);
if(cljs.core.truth_(or__138__auto____9356))
{return or__138__auto____9356;
} else
{var or__138__auto____9357 = p1.call(null,y);
if(cljs.core.truth_(or__138__auto____9357))
{return or__138__auto____9357;
} else
{var or__138__auto____9358 = p2.call(null,y);
if(cljs.core.truth_(or__138__auto____9358))
{return or__138__auto____9358;
} else
{return p3.call(null,y);
}
}
}
}
}
});
var sp3__3 = (function (x,y,z){
var or__138__auto____9359 = p1.call(null,x);
if(cljs.core.truth_(or__138__auto____9359))
{return or__138__auto____9359;
} else
{var or__138__auto____9360 = p2.call(null,x);
if(cljs.core.truth_(or__138__auto____9360))
{return or__138__auto____9360;
} else
{var or__138__auto____9361 = p3.call(null,x);
if(cljs.core.truth_(or__138__auto____9361))
{return or__138__auto____9361;
} else
{var or__138__auto____9362 = p1.call(null,y);
if(cljs.core.truth_(or__138__auto____9362))
{return or__138__auto____9362;
} else
{var or__138__auto____9363 = p2.call(null,y);
if(cljs.core.truth_(or__138__auto____9363))
{return or__138__auto____9363;
} else
{var or__138__auto____9364 = p3.call(null,y);
if(cljs.core.truth_(or__138__auto____9364))
{return or__138__auto____9364;
} else
{var or__138__auto____9365 = p1.call(null,z);
if(cljs.core.truth_(or__138__auto____9365))
{return or__138__auto____9365;
} else
{var or__138__auto____9366 = p2.call(null,z);
if(cljs.core.truth_(or__138__auto____9366))
{return or__138__auto____9366;
} else
{return p3.call(null,z);
}
}
}
}
}
}
}
}
});
var sp3__4 = (function() { 
var G__9379__delegate = function (x,y,z,args){
var or__138__auto____9367 = sp3.call(null,x,y,z);
if(cljs.core.truth_(or__138__auto____9367))
{return or__138__auto____9367;
} else
{return cljs.core.some.call(null,(function (p1__9283_SHARP_){
var or__138__auto____9368 = p1.call(null,p1__9283_SHARP_);
if(cljs.core.truth_(or__138__auto____9368))
{return or__138__auto____9368;
} else
{var or__138__auto____9369 = p2.call(null,p1__9283_SHARP_);
if(cljs.core.truth_(or__138__auto____9369))
{return or__138__auto____9369;
} else
{return p3.call(null,p1__9283_SHARP_);
}
}
}),args);
}
};
var G__9379 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9379__delegate.call(this, x, y, z, args);
};
G__9379.cljs$lang$maxFixedArity = 3;
G__9379.cljs$lang$applyTo = (function (arglist__9380){
var x = cljs.core.first(arglist__9380);
var y = cljs.core.first(cljs.core.next(arglist__9380));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9380)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9380)));
return G__9379__delegate(x, y, z, args);
});
G__9379.cljs$lang$arity$variadic = G__9379__delegate;
return G__9379;
})()
;
sp3 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return sp3__0.call(this);
case 1:
return sp3__1.call(this,x);
case 2:
return sp3__2.call(this,x,y);
case 3:
return sp3__3.call(this,x,y,z);
default:
return sp3__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
sp3.cljs$lang$maxFixedArity = 3;
sp3.cljs$lang$applyTo = sp3__4.cljs$lang$applyTo;
sp3.cljs$lang$arity$0 = sp3__0;
sp3.cljs$lang$arity$1 = sp3__1;
sp3.cljs$lang$arity$2 = sp3__2;
sp3.cljs$lang$arity$3 = sp3__3;
sp3.cljs$lang$arity$variadic = sp3__4.cljs$lang$arity$variadic;
return sp3;
})()
});
var some_fn__4 = (function() { 
var G__9381__delegate = function (p1,p2,p3,ps){
var ps__9370 = cljs.core.list_STAR_.call(null,p1,p2,p3,ps);
return (function() {
var spn = null;
var spn__0 = (function (){
return null;
});
var spn__1 = (function (x){
return cljs.core.some.call(null,(function (p1__9284_SHARP_){
return p1__9284_SHARP_.call(null,x);
}),ps__9370);
});
var spn__2 = (function (x,y){
return cljs.core.some.call(null,(function (p1__9285_SHARP_){
var or__138__auto____9371 = p1__9285_SHARP_.call(null,x);
if(cljs.core.truth_(or__138__auto____9371))
{return or__138__auto____9371;
} else
{return p1__9285_SHARP_.call(null,y);
}
}),ps__9370);
});
var spn__3 = (function (x,y,z){
return cljs.core.some.call(null,(function (p1__9286_SHARP_){
var or__138__auto____9372 = p1__9286_SHARP_.call(null,x);
if(cljs.core.truth_(or__138__auto____9372))
{return or__138__auto____9372;
} else
{var or__138__auto____9373 = p1__9286_SHARP_.call(null,y);
if(cljs.core.truth_(or__138__auto____9373))
{return or__138__auto____9373;
} else
{return p1__9286_SHARP_.call(null,z);
}
}
}),ps__9370);
});
var spn__4 = (function() { 
var G__9382__delegate = function (x,y,z,args){
var or__138__auto____9374 = spn.call(null,x,y,z);
if(cljs.core.truth_(or__138__auto____9374))
{return or__138__auto____9374;
} else
{return cljs.core.some.call(null,(function (p1__9287_SHARP_){
return cljs.core.some.call(null,p1__9287_SHARP_,args);
}),ps__9370);
}
};
var G__9382 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9382__delegate.call(this, x, y, z, args);
};
G__9382.cljs$lang$maxFixedArity = 3;
G__9382.cljs$lang$applyTo = (function (arglist__9383){
var x = cljs.core.first(arglist__9383);
var y = cljs.core.first(cljs.core.next(arglist__9383));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9383)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9383)));
return G__9382__delegate(x, y, z, args);
});
G__9382.cljs$lang$arity$variadic = G__9382__delegate;
return G__9382;
})()
;
spn = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return spn__0.call(this);
case 1:
return spn__1.call(this,x);
case 2:
return spn__2.call(this,x,y);
case 3:
return spn__3.call(this,x,y,z);
default:
return spn__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
spn.cljs$lang$maxFixedArity = 3;
spn.cljs$lang$applyTo = spn__4.cljs$lang$applyTo;
spn.cljs$lang$arity$0 = spn__0;
spn.cljs$lang$arity$1 = spn__1;
spn.cljs$lang$arity$2 = spn__2;
spn.cljs$lang$arity$3 = spn__3;
spn.cljs$lang$arity$variadic = spn__4.cljs$lang$arity$variadic;
return spn;
})()
};
var G__9381 = function (p1,p2,p3,var_args){
var ps = null;
if (goog.isDef(var_args)) {
  ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__9381__delegate.call(this, p1, p2, p3, ps);
};
G__9381.cljs$lang$maxFixedArity = 3;
G__9381.cljs$lang$applyTo = (function (arglist__9384){
var p1 = cljs.core.first(arglist__9384);
var p2 = cljs.core.first(cljs.core.next(arglist__9384));
var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9384)));
var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9384)));
return G__9381__delegate(p1, p2, p3, ps);
});
G__9381.cljs$lang$arity$variadic = G__9381__delegate;
return G__9381;
})()
;
some_fn = function(p1,p2,p3,var_args){
var ps = var_args;
switch(arguments.length){
case 1:
return some_fn__1.call(this,p1);
case 2:
return some_fn__2.call(this,p1,p2);
case 3:
return some_fn__3.call(this,p1,p2,p3);
default:
return some_fn__4.cljs$lang$arity$variadic(p1,p2,p3, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
some_fn.cljs$lang$maxFixedArity = 3;
some_fn.cljs$lang$applyTo = some_fn__4.cljs$lang$applyTo;
some_fn.cljs$lang$arity$1 = some_fn__1;
some_fn.cljs$lang$arity$2 = some_fn__2;
some_fn.cljs$lang$arity$3 = some_fn__3;
some_fn.cljs$lang$arity$variadic = some_fn__4.cljs$lang$arity$variadic;
return some_fn;
})()
;
/**
* Returns a lazy sequence consisting of the result of applying f to the
* set of first items of each coll, followed by applying f to the set
* of second items in each coll, until any one of the colls is
* exhausted.  Any remaining items in other colls are ignored. Function
* f should accept number-of-colls arguments.
* @param {...*} var_args
*/
cljs.core.map = (function() {
var map = null;
var map__2 = (function (f,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____9385 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____9385))
{var s__9386 = temp__324__auto____9385;
return cljs.core.cons.call(null,f.call(null,cljs.core.first.call(null,s__9386)),map.call(null,f,cljs.core.rest.call(null,s__9386)));
} else
{return null;
}
})));
});
var map__3 = (function (f,c1,c2){
return (new cljs.core.LazySeq(null,false,(function (){
var s1__9387 = cljs.core.seq.call(null,c1);
var s2__9388 = cljs.core.seq.call(null,c2);
if(cljs.core.truth_((function (){var and__132__auto____9389 = s1__9387;
if(cljs.core.truth_(and__132__auto____9389))
{return s2__9388;
} else
{return and__132__auto____9389;
}
})()))
{return cljs.core.cons.call(null,f.call(null,cljs.core.first.call(null,s1__9387),cljs.core.first.call(null,s2__9388)),map.call(null,f,cljs.core.rest.call(null,s1__9387),cljs.core.rest.call(null,s2__9388)));
} else
{return null;
}
})));
});
var map__4 = (function (f,c1,c2,c3){
return (new cljs.core.LazySeq(null,false,(function (){
var s1__9390 = cljs.core.seq.call(null,c1);
var s2__9391 = cljs.core.seq.call(null,c2);
var s3__9392 = cljs.core.seq.call(null,c3);
if(cljs.core.truth_((function (){var and__132__auto____9393 = s1__9390;
if(cljs.core.truth_(and__132__auto____9393))
{var and__132__auto____9394 = s2__9391;
if(cljs.core.truth_(and__132__auto____9394))
{return s3__9392;
} else
{return and__132__auto____9394;
}
} else
{return and__132__auto____9393;
}
})()))
{return cljs.core.cons.call(null,f.call(null,cljs.core.first.call(null,s1__9390),cljs.core.first.call(null,s2__9391),cljs.core.first.call(null,s3__9392)),map.call(null,f,cljs.core.rest.call(null,s1__9390),cljs.core.rest.call(null,s2__9391),cljs.core.rest.call(null,s3__9392)));
} else
{return null;
}
})));
});
var map__5 = (function() { 
var G__9397__delegate = function (f,c1,c2,c3,colls){
var step__9396 = (function step(cs){
return (new cljs.core.LazySeq(null,false,(function (){
var ss__9395 = map.call(null,cljs.core.seq,cs);
if(cljs.core.every_QMARK_.call(null,cljs.core.identity,ss__9395))
{return cljs.core.cons.call(null,map.call(null,cljs.core.first,ss__9395),step.call(null,map.call(null,cljs.core.rest,ss__9395)));
} else
{return null;
}
})));
});
return map.call(null,(function (p1__9336_SHARP_){
return cljs.core.apply.call(null,f,p1__9336_SHARP_);
}),step__9396.call(null,cljs.core.conj.call(null,colls,c3,c2,c1)));
};
var G__9397 = function (f,c1,c2,c3,var_args){
var colls = null;
if (goog.isDef(var_args)) {
  colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4),0);
} 
return G__9397__delegate.call(this, f, c1, c2, c3, colls);
};
G__9397.cljs$lang$maxFixedArity = 4;
G__9397.cljs$lang$applyTo = (function (arglist__9398){
var f = cljs.core.first(arglist__9398);
var c1 = cljs.core.first(cljs.core.next(arglist__9398));
var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9398)));
var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9398))));
var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9398))));
return G__9397__delegate(f, c1, c2, c3, colls);
});
G__9397.cljs$lang$arity$variadic = G__9397__delegate;
return G__9397;
})()
;
map = function(f,c1,c2,c3,var_args){
var colls = var_args;
switch(arguments.length){
case 2:
return map__2.call(this,f,c1);
case 3:
return map__3.call(this,f,c1,c2);
case 4:
return map__4.call(this,f,c1,c2,c3);
default:
return map__5.cljs$lang$arity$variadic(f,c1,c2,c3, cljs.core.array_seq(arguments, 4));
}
throw('Invalid arity: ' + arguments.length);
};
map.cljs$lang$maxFixedArity = 4;
map.cljs$lang$applyTo = map__5.cljs$lang$applyTo;
map.cljs$lang$arity$2 = map__2;
map.cljs$lang$arity$3 = map__3;
map.cljs$lang$arity$4 = map__4;
map.cljs$lang$arity$variadic = map__5.cljs$lang$arity$variadic;
return map;
})()
;
/**
* Returns a lazy sequence of the first n items in coll, or all items if
* there are fewer than n.
*/
cljs.core.take = (function take(n,coll){
return (new cljs.core.LazySeq(null,false,(function (){
if((n > 0))
{var temp__324__auto____9399 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____9399))
{var s__9400 = temp__324__auto____9399;
return cljs.core.cons.call(null,cljs.core.first.call(null,s__9400),take.call(null,(n - 1),cljs.core.rest.call(null,s__9400)));
} else
{return null;
}
} else
{return null;
}
})));
});
/**
* Returns a lazy sequence of all but the first n items in coll.
*/
cljs.core.drop = (function drop(n,coll){
var step__9403 = (function (n,coll){
while(true){
var s__9401 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_((function (){var and__132__auto____9402 = (n > 0);
if(and__132__auto____9402)
{return s__9401;
} else
{return and__132__auto____9402;
}
})()))
{{
var G__9404 = (n - 1);
var G__9405 = cljs.core.rest.call(null,s__9401);
n = G__9404;
coll = G__9405;
continue;
}
} else
{return s__9401;
}
break;
}
});
return (new cljs.core.LazySeq(null,false,(function (){
return step__9403.call(null,n,coll);
})));
});
/**
* Return a lazy sequence of all but the last n (default 1) items in coll
*/
cljs.core.drop_last = (function() {
var drop_last = null;
var drop_last__1 = (function (s){
return drop_last.call(null,1,s);
});
var drop_last__2 = (function (n,s){
return cljs.core.map.call(null,(function (x,_){
return x;
}),s,cljs.core.drop.call(null,n,s));
});
drop_last = function(n,s){
switch(arguments.length){
case 1:
return drop_last__1.call(this,n);
case 2:
return drop_last__2.call(this,n,s);
}
throw('Invalid arity: ' + arguments.length);
};
drop_last.cljs$lang$arity$1 = drop_last__1;
drop_last.cljs$lang$arity$2 = drop_last__2;
return drop_last;
})()
;
/**
* Returns a seq of the last n items in coll.  Depending on the type
* of coll may be no better than linear time.  For vectors, see also subvec.
*/
cljs.core.take_last = (function take_last(n,coll){
var s__9406 = cljs.core.seq.call(null,coll);
var lead__9407 = cljs.core.seq.call(null,cljs.core.drop.call(null,n,coll));
while(true){
if(cljs.core.truth_(lead__9407))
{{
var G__9408 = cljs.core.next.call(null,s__9406);
var G__9409 = cljs.core.next.call(null,lead__9407);
s__9406 = G__9408;
lead__9407 = G__9409;
continue;
}
} else
{return s__9406;
}
break;
}
});
/**
* Returns a lazy sequence of the items in coll starting from the first
* item for which (pred item) returns nil.
*/
cljs.core.drop_while = (function drop_while(pred,coll){
var step__9412 = (function (pred,coll){
while(true){
var s__9410 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_((function (){var and__132__auto____9411 = s__9410;
if(cljs.core.truth_(and__132__auto____9411))
{return pred.call(null,cljs.core.first.call(null,s__9410));
} else
{return and__132__auto____9411;
}
})()))
{{
var G__9413 = pred;
var G__9414 = cljs.core.rest.call(null,s__9410);
pred = G__9413;
coll = G__9414;
continue;
}
} else
{return s__9410;
}
break;
}
});
return (new cljs.core.LazySeq(null,false,(function (){
return step__9412.call(null,pred,coll);
})));
});
/**
* Returns a lazy (infinite!) sequence of repetitions of the items in coll.
*/
cljs.core.cycle = (function cycle(coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____9415 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____9415))
{var s__9416 = temp__324__auto____9415;
return cljs.core.concat.call(null,s__9416,cycle.call(null,s__9416));
} else
{return null;
}
})));
});
/**
* Returns a vector of [(take n coll) (drop n coll)]
*/
cljs.core.split_at = (function split_at(n,coll){
return cljs.core.PersistentVector.fromArray([cljs.core.take.call(null,n,coll),cljs.core.drop.call(null,n,coll)]);
});
/**
* Returns a lazy (infinite!, or length n if supplied) sequence of xs.
*/
cljs.core.repeat = (function() {
var repeat = null;
var repeat__1 = (function (x){
return (new cljs.core.LazySeq(null,false,(function (){
return cljs.core.cons.call(null,x,repeat.call(null,x));
})));
});
var repeat__2 = (function (n,x){
return cljs.core.take.call(null,n,repeat.call(null,x));
});
repeat = function(n,x){
switch(arguments.length){
case 1:
return repeat__1.call(this,n);
case 2:
return repeat__2.call(this,n,x);
}
throw('Invalid arity: ' + arguments.length);
};
repeat.cljs$lang$arity$1 = repeat__1;
repeat.cljs$lang$arity$2 = repeat__2;
return repeat;
})()
;
/**
* Returns a lazy seq of n xs.
*/
cljs.core.replicate = (function replicate(n,x){
return cljs.core.take.call(null,n,cljs.core.repeat.call(null,x));
});
/**
* Takes a function of no args, presumably with side effects, and
* returns an infinite (or length n if supplied) lazy sequence of calls
* to it
*/
cljs.core.repeatedly = (function() {
var repeatedly = null;
var repeatedly__1 = (function (f){
return (new cljs.core.LazySeq(null,false,(function (){
return cljs.core.cons.call(null,f.call(null),repeatedly.call(null,f));
})));
});
var repeatedly__2 = (function (n,f){
return cljs.core.take.call(null,n,repeatedly.call(null,f));
});
repeatedly = function(n,f){
switch(arguments.length){
case 1:
return repeatedly__1.call(this,n);
case 2:
return repeatedly__2.call(this,n,f);
}
throw('Invalid arity: ' + arguments.length);
};
repeatedly.cljs$lang$arity$1 = repeatedly__1;
repeatedly.cljs$lang$arity$2 = repeatedly__2;
return repeatedly;
})()
;
/**
* Returns a lazy sequence of x, (f x), (f (f x)) etc. f must be free of side-effects
*/
cljs.core.iterate = (function iterate(f,x){
return cljs.core.cons.call(null,x,(new cljs.core.LazySeq(null,false,(function (){
return iterate.call(null,f,f.call(null,x));
}))));
});
/**
* Returns a lazy seq of the first item in each coll, then the second etc.
* @param {...*} var_args
*/
cljs.core.interleave = (function() {
var interleave = null;
var interleave__2 = (function (c1,c2){
return (new cljs.core.LazySeq(null,false,(function (){
var s1__9417 = cljs.core.seq.call(null,c1);
var s2__9418 = cljs.core.seq.call(null,c2);
if(cljs.core.truth_((function (){var and__132__auto____9419 = s1__9417;
if(cljs.core.truth_(and__132__auto____9419))
{return s2__9418;
} else
{return and__132__auto____9419;
}
})()))
{return cljs.core.cons.call(null,cljs.core.first.call(null,s1__9417),cljs.core.cons.call(null,cljs.core.first.call(null,s2__9418),interleave.call(null,cljs.core.rest.call(null,s1__9417),cljs.core.rest.call(null,s2__9418))));
} else
{return null;
}
})));
});
var interleave__3 = (function() { 
var G__9421__delegate = function (c1,c2,colls){
return (new cljs.core.LazySeq(null,false,(function (){
var ss__9420 = cljs.core.map.call(null,cljs.core.seq,cljs.core.conj.call(null,colls,c2,c1));
if(cljs.core.every_QMARK_.call(null,cljs.core.identity,ss__9420))
{return cljs.core.concat.call(null,cljs.core.map.call(null,cljs.core.first,ss__9420),cljs.core.apply.call(null,interleave,cljs.core.map.call(null,cljs.core.rest,ss__9420)));
} else
{return null;
}
})));
};
var G__9421 = function (c1,c2,var_args){
var colls = null;
if (goog.isDef(var_args)) {
  colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__9421__delegate.call(this, c1, c2, colls);
};
G__9421.cljs$lang$maxFixedArity = 2;
G__9421.cljs$lang$applyTo = (function (arglist__9422){
var c1 = cljs.core.first(arglist__9422);
var c2 = cljs.core.first(cljs.core.next(arglist__9422));
var colls = cljs.core.rest(cljs.core.next(arglist__9422));
return G__9421__delegate(c1, c2, colls);
});
G__9421.cljs$lang$arity$variadic = G__9421__delegate;
return G__9421;
})()
;
interleave = function(c1,c2,var_args){
var colls = var_args;
switch(arguments.length){
case 2:
return interleave__2.call(this,c1,c2);
default:
return interleave__3.cljs$lang$arity$variadic(c1,c2, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
interleave.cljs$lang$maxFixedArity = 2;
interleave.cljs$lang$applyTo = interleave__3.cljs$lang$applyTo;
interleave.cljs$lang$arity$2 = interleave__2;
interleave.cljs$lang$arity$variadic = interleave__3.cljs$lang$arity$variadic;
return interleave;
})()
;
/**
* Returns a lazy seq of the elements of coll separated by sep
*/
cljs.core.interpose = (function interpose(sep,coll){
return cljs.core.drop.call(null,1,cljs.core.interleave.call(null,cljs.core.repeat.call(null,sep),coll));
});
/**
* Take a collection of collections, and return a lazy seq
* of items from the inner collection
*/
cljs.core.flatten1 = (function flatten1(colls){
var cat__9425 = (function cat(coll,colls){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__317__auto____9423 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__317__auto____9423))
{var coll__9424 = temp__317__auto____9423;
return cljs.core.cons.call(null,cljs.core.first.call(null,coll__9424),cat.call(null,cljs.core.rest.call(null,coll__9424),colls));
} else
{if(cljs.core.truth_(cljs.core.seq.call(null,colls)))
{return cat.call(null,cljs.core.first.call(null,colls),cljs.core.rest.call(null,colls));
} else
{return null;
}
}
})));
});
return cat__9425.call(null,null,colls);
});
/**
* Returns the result of applying concat to the result of applying map
* to f and colls.  Thus function f should return a collection.
* @param {...*} var_args
*/
cljs.core.mapcat = (function() {
var mapcat = null;
var mapcat__2 = (function (f,coll){
return cljs.core.flatten1.call(null,cljs.core.map.call(null,f,coll));
});
var mapcat__3 = (function() { 
var G__9426__delegate = function (f,coll,colls){
return cljs.core.flatten1.call(null,cljs.core.apply.call(null,cljs.core.map,f,coll,colls));
};
var G__9426 = function (f,coll,var_args){
var colls = null;
if (goog.isDef(var_args)) {
  colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__9426__delegate.call(this, f, coll, colls);
};
G__9426.cljs$lang$maxFixedArity = 2;
G__9426.cljs$lang$applyTo = (function (arglist__9427){
var f = cljs.core.first(arglist__9427);
var coll = cljs.core.first(cljs.core.next(arglist__9427));
var colls = cljs.core.rest(cljs.core.next(arglist__9427));
return G__9426__delegate(f, coll, colls);
});
G__9426.cljs$lang$arity$variadic = G__9426__delegate;
return G__9426;
})()
;
mapcat = function(f,coll,var_args){
var colls = var_args;
switch(arguments.length){
case 2:
return mapcat__2.call(this,f,coll);
default:
return mapcat__3.cljs$lang$arity$variadic(f,coll, cljs.core.array_seq(arguments, 2));
}
throw('Invalid arity: ' + arguments.length);
};
mapcat.cljs$lang$maxFixedArity = 2;
mapcat.cljs$lang$applyTo = mapcat__3.cljs$lang$applyTo;
mapcat.cljs$lang$arity$2 = mapcat__2;
mapcat.cljs$lang$arity$variadic = mapcat__3.cljs$lang$arity$variadic;
return mapcat;
})()
;
/**
* Returns a lazy sequence of the items in coll for which
* (pred item) returns true. pred must be free of side-effects.
*/
cljs.core.filter = (function filter(pred,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____9428 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____9428))
{var s__9429 = temp__324__auto____9428;
var f__9430 = cljs.core.first.call(null,s__9429);
var r__9431 = cljs.core.rest.call(null,s__9429);
if(cljs.core.truth_(pred.call(null,f__9430)))
{return cljs.core.cons.call(null,f__9430,filter.call(null,pred,r__9431));
} else
{return filter.call(null,pred,r__9431);
}
} else
{return null;
}
})));
});
/**
* Returns a lazy sequence of the items in coll for which
* (pred item) returns false. pred must be free of side-effects.
*/
cljs.core.remove = (function remove(pred,coll){
return cljs.core.filter.call(null,cljs.core.complement.call(null,pred),coll);
});
/**
* Returns a lazy sequence of the nodes in a tree, via a depth-first walk.
* branch? must be a fn of one arg that returns true if passed a node
* that can have children (but may not).  children must be a fn of one
* arg that returns a sequence of the children. Will only be called on
* nodes for which branch? returns true. Root is the root node of the
* tree.
*/
cljs.core.tree_seq = (function tree_seq(branch_QMARK_,children,root){
var walk__9433 = (function walk(node){
return (new cljs.core.LazySeq(null,false,(function (){
return cljs.core.cons.call(null,node,(cljs.core.truth_(branch_QMARK_.call(null,node))?cljs.core.mapcat.call(null,walk,children.call(null,node)):null));
})));
});
return walk__9433.call(null,root);
});
/**
* Takes any nested combination of sequential things (lists, vectors,
* etc.) and returns their contents as a single, flat sequence.
* (flatten nil) returns nil.
*/
cljs.core.flatten = (function flatten(x){
return cljs.core.filter.call(null,(function (p1__9432_SHARP_){
return cljs.core.not.call(null,cljs.core.sequential_QMARK_.call(null,p1__9432_SHARP_));
}),cljs.core.rest.call(null,cljs.core.tree_seq.call(null,cljs.core.sequential_QMARK_,cljs.core.seq,x)));
});
/**
* Returns a new coll consisting of to-coll with all of the items of
* from-coll conjoined.
*/
cljs.core.into = (function into(to,from){
if((function (){var G__9434__9435 = to;
if((G__9434__9435 != null))
{if((function (){var or__138__auto____9436 = (G__9434__9435.cljs$lang$protocol_mask$partition0$ & 2147483648);
if(or__138__auto____9436)
{return or__138__auto____9436;
} else
{return G__9434__9435.cljs$core$IEditableCollection$;
}
})())
{return true;
} else
{if((!G__9434__9435.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IEditableCollection,G__9434__9435);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IEditableCollection,G__9434__9435);
}
})())
{return cljs.core.persistent_BANG_.call(null,cljs.core.reduce.call(null,cljs.core._conj_BANG_,cljs.core.transient$.call(null,to),from));
} else
{return cljs.core.reduce.call(null,cljs.core._conj,to,from);
}
});
/**
* Returns a vector consisting of the result of applying f to the
* set of first items of each coll, followed by applying f to the set
* of second items in each coll, until any one of the colls is
* exhausted.  Any remaining items in other colls are ignored. Function
* f should accept number-of-colls arguments.
* @param {...*} var_args
*/
cljs.core.mapv = (function() {
var mapv = null;
var mapv__2 = (function (f,coll){
return cljs.core.persistent_BANG_.call(null,cljs.core.reduce.call(null,(function (v,o){
return cljs.core.conj_BANG_.call(null,v,f.call(null,o));
}),cljs.core.transient$.call(null,cljs.core.PersistentVector.fromArray([])),coll));
});
var mapv__3 = (function (f,c1,c2){
return cljs.core.into.call(null,cljs.core.PersistentVector.fromArray([]),cljs.core.map.call(null,f,c1,c2));
});
var mapv__4 = (function (f,c1,c2,c3){
return cljs.core.into.call(null,cljs.core.PersistentVector.fromArray([]),cljs.core.map.call(null,f,c1,c2,c3));
});
var mapv__5 = (function() { 
var G__9437__delegate = function (f,c1,c2,c3,colls){
return cljs.core.into.call(null,cljs.core.PersistentVector.fromArray([]),cljs.core.apply.call(null,cljs.core.map,f,c1,c2,c3,colls));
};
var G__9437 = function (f,c1,c2,c3,var_args){
var colls = null;
if (goog.isDef(var_args)) {
  colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4),0);
} 
return G__9437__delegate.call(this, f, c1, c2, c3, colls);
};
G__9437.cljs$lang$maxFixedArity = 4;
G__9437.cljs$lang$applyTo = (function (arglist__9438){
var f = cljs.core.first(arglist__9438);
var c1 = cljs.core.first(cljs.core.next(arglist__9438));
var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9438)));
var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9438))));
var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__9438))));
return G__9437__delegate(f, c1, c2, c3, colls);
});
G__9437.cljs$lang$arity$variadic = G__9437__delegate;
return G__9437;
})()
;
mapv = function(f,c1,c2,c3,var_args){
var colls = var_args;
switch(arguments.length){
case 2:
return mapv__2.call(this,f,c1);
case 3:
return mapv__3.call(this,f,c1,c2);
case 4:
return mapv__4.call(this,f,c1,c2,c3);
default:
return mapv__5.cljs$lang$arity$variadic(f,c1,c2,c3, cljs.core.array_seq(arguments, 4));
}
throw('Invalid arity: ' + arguments.length);
};
mapv.cljs$lang$maxFixedArity = 4;
mapv.cljs$lang$applyTo = mapv__5.cljs$lang$applyTo;
mapv.cljs$lang$arity$2 = mapv__2;
mapv.cljs$lang$arity$3 = mapv__3;
mapv.cljs$lang$arity$4 = mapv__4;
mapv.cljs$lang$arity$variadic = mapv__5.cljs$lang$arity$variadic;
return mapv;
})()
;
/**
* Returns a vector of the items in coll for which
* (pred item) returns true. pred must be free of side-effects.
*/
cljs.core.filterv = (function filterv(pred,coll){
return cljs.core.persistent_BANG_.call(null,cljs.core.reduce.call(null,(function (v,o){
if(cljs.core.truth_(pred.call(null,o)))
{return cljs.core.conj_BANG_.call(null,v,o);
} else
{return v;
}
}),cljs.core.transient$.call(null,cljs.core.PersistentVector.fromArray([])),coll));
});
/**
* Returns a lazy sequence of lists of n items each, at offsets step
* apart. If step is not supplied, defaults to n, i.e. the partitions
* do not overlap. If a pad collection is supplied, use its elements as
* necessary to complete last partition upto n items. In case there are
* not enough padding elements, return a partition with less than n items.
*/
cljs.core.partition = (function() {
var partition = null;
var partition__2 = (function (n,coll){
return partition.call(null,n,n,coll);
});
var partition__3 = (function (n,step,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____9439 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____9439))
{var s__9440 = temp__324__auto____9439;
var p__9441 = cljs.core.take.call(null,n,s__9440);
if((n === cljs.core.count.call(null,p__9441)))
{return cljs.core.cons.call(null,p__9441,partition.call(null,n,step,cljs.core.drop.call(null,step,s__9440)));
} else
{return null;
}
} else
{return null;
}
})));
});
var partition__4 = (function (n,step,pad,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____9442 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____9442))
{var s__9443 = temp__324__auto____9442;
var p__9444 = cljs.core.take.call(null,n,s__9443);
if((n === cljs.core.count.call(null,p__9444)))
{return cljs.core.cons.call(null,p__9444,partition.call(null,n,step,pad,cljs.core.drop.call(null,step,s__9443)));
} else
{return cljs.core.list.call(null,cljs.core.take.call(null,n,cljs.core.concat.call(null,p__9444,pad)));
}
} else
{return null;
}
})));
});
partition = function(n,step,pad,coll){
switch(arguments.length){
case 2:
return partition__2.call(this,n,step);
case 3:
return partition__3.call(this,n,step,pad);
case 4:
return partition__4.call(this,n,step,pad,coll);
}
throw('Invalid arity: ' + arguments.length);
};
partition.cljs$lang$arity$2 = partition__2;
partition.cljs$lang$arity$3 = partition__3;
partition.cljs$lang$arity$4 = partition__4;
return partition;
})()
;
/**
* Returns the value in a nested associative structure,
* where ks is a sequence of ke(ys. Returns nil if the key is not present,
* or the not-found value if supplied.
*/
cljs.core.get_in = (function() {
var get_in = null;
var get_in__2 = (function (m,ks){
return cljs.core.reduce.call(null,cljs.core.get,m,ks);
});
var get_in__3 = (function (m,ks,not_found){
var sentinel__9445 = cljs.core.lookup_sentinel;
var m__9446 = m;
var ks__9447 = cljs.core.seq.call(null,ks);
while(true){
if(cljs.core.truth_(ks__9447))
{var m__9448 = cljs.core.get.call(null,m__9446,cljs.core.first.call(null,ks__9447),sentinel__9445);
if((sentinel__9445 === m__9448))
{return not_found;
} else
{{
var G__9449 = sentinel__9445;
var G__9450 = m__9448;
var G__9451 = cljs.core.next.call(null,ks__9447);
sentinel__9445 = G__9449;
m__9446 = G__9450;
ks__9447 = G__9451;
continue;
}
}
} else
{return m__9446;
}
break;
}
});
get_in = function(m,ks,not_found){
switch(arguments.length){
case 2:
return get_in__2.call(this,m,ks);
case 3:
return get_in__3.call(this,m,ks,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
get_in.cljs$lang$arity$2 = get_in__2;
get_in.cljs$lang$arity$3 = get_in__3;
return get_in;
})()
;
/**
* Associates a value in a nested associative structure, where ks is a
* sequence of keys and v is the new value and returns a new nested structure.
* If any levels do not exist, hash-maps will be created.
*/
cljs.core.assoc_in = (function assoc_in(m,p__9452,v){
var vec__9453__9454 = p__9452;
var k__9455 = cljs.core.nth.call(null,vec__9453__9454,0,null);
var ks__9456 = cljs.core.nthnext.call(null,vec__9453__9454,1);
if(cljs.core.truth_(ks__9456))
{return cljs.core.assoc.call(null,m,k__9455,assoc_in.call(null,cljs.core.get.call(null,m,k__9455),ks__9456,v));
} else
{return cljs.core.assoc.call(null,m,k__9455,v);
}
});
/**
* 'Updates' a value in a nested associative structure, where ks is a
* sequence of keys and f is a function that will take the old value
* and any supplied args and return the new value, and returns a new
* nested structure.  If any levels do not exist, hash-maps will be
* created.
* @param {...*} var_args
*/
cljs.core.update_in = (function() { 
var update_in__delegate = function (m,p__9457,f,args){
var vec__9458__9459 = p__9457;
var k__9460 = cljs.core.nth.call(null,vec__9458__9459,0,null);
var ks__9461 = cljs.core.nthnext.call(null,vec__9458__9459,1);
if(cljs.core.truth_(ks__9461))
{return cljs.core.assoc.call(null,m,k__9460,cljs.core.apply.call(null,update_in,cljs.core.get.call(null,m,k__9460),ks__9461,f,args));
} else
{return cljs.core.assoc.call(null,m,k__9460,cljs.core.apply.call(null,f,cljs.core.get.call(null,m,k__9460),args));
}
};
var update_in = function (m,p__9457,f,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return update_in__delegate.call(this, m, p__9457, f, args);
};
update_in.cljs$lang$maxFixedArity = 3;
update_in.cljs$lang$applyTo = (function (arglist__9462){
var m = cljs.core.first(arglist__9462);
var p__9457 = cljs.core.first(cljs.core.next(arglist__9462));
var f = cljs.core.first(cljs.core.next(cljs.core.next(arglist__9462)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__9462)));
return update_in__delegate(m, p__9457, f, args);
});
update_in.cljs$lang$arity$variadic = update_in__delegate;
return update_in;
})()
;

/**
* @constructor
*/
cljs.core.Vector = (function (meta,array,__hash){
this.meta = meta;
this.array = array;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 16200095;
})
cljs.core.Vector.cljs$lang$type = true;
cljs.core.Vector.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.Vector");
});
cljs.core.Vector.prototype.cljs$core$IHash$ = true;
cljs.core.Vector.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9467 = this;
var h__2236__auto____9468 = this__9467.__hash;
if((h__2236__auto____9468 != null))
{return h__2236__auto____9468;
} else
{var h__2236__auto____9469 = cljs.core.hash_coll.call(null,coll);
this__9467.__hash = h__2236__auto____9469;
return h__2236__auto____9469;
}
});
cljs.core.Vector.prototype.cljs$core$ILookup$ = true;
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,k){
var this__9470 = this;
return cljs.core._nth.call(null,coll,k,null);
});
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,k,not_found){
var this__9471 = this;
return cljs.core._nth.call(null,coll,k,not_found);
});
cljs.core.Vector.prototype.cljs$core$IAssociative$ = true;
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (coll,k,v){
var this__9472 = this;
var new_array__9473 = cljs.core.aclone.call(null,this__9472.array);
(new_array__9473[k] = v);
return (new cljs.core.Vector(this__9472.meta,new_array__9473,null));
});
cljs.core.Vector.prototype.cljs$core$IFn$ = true;
cljs.core.Vector.prototype.call = (function() {
var G__9502 = null;
var G__9502__2 = (function (tsym9465,k){
var this__9474 = this;
var tsym9465__9475 = this;
var coll__9476 = tsym9465__9475;
return cljs.core._lookup.call(null,coll__9476,k);
});
var G__9502__3 = (function (tsym9466,k,not_found){
var this__9477 = this;
var tsym9466__9478 = this;
var coll__9479 = tsym9466__9478;
return cljs.core._lookup.call(null,coll__9479,k,not_found);
});
G__9502 = function(tsym9466,k,not_found){
switch(arguments.length){
case 2:
return G__9502__2.call(this,tsym9466,k);
case 3:
return G__9502__3.call(this,tsym9466,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9502;
})()
;
cljs.core.Vector.prototype.apply = (function (tsym9463,args9464){
return tsym9463.call.apply(tsym9463,[tsym9463].concat(cljs.core.aclone.call(null,args9464)));
});
cljs.core.Vector.prototype.cljs$core$ISequential$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__9480 = this;
var new_array__9481 = cljs.core.aclone.call(null,this__9480.array);
new_array__9481.push(o);
return (new cljs.core.Vector(this__9480.meta,new_array__9481,null));
});
cljs.core.Vector.prototype.toString = (function (){
var this__9482 = this;
var this$__9483 = this;
return cljs.core.pr_str.call(null,this$__9483);
});
cljs.core.Vector.prototype.cljs$core$IReduce$ = true;
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (v,f){
var this__9484 = this;
return cljs.core.ci_reduce.call(null,this__9484.array,f);
});
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (v,f,start){
var this__9485 = this;
return cljs.core.ci_reduce.call(null,this__9485.array,f,start);
});
cljs.core.Vector.prototype.cljs$core$ISeqable$ = true;
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9486 = this;
if((this__9486.array.length > 0))
{var vector_seq__9487 = (function vector_seq(i){
return (new cljs.core.LazySeq(null,false,(function (){
if((i < this__9486.array.length))
{return cljs.core.cons.call(null,(this__9486.array[i]),vector_seq.call(null,(i + 1)));
} else
{return null;
}
})));
});
return vector_seq__9487.call(null,0);
} else
{return null;
}
});
cljs.core.Vector.prototype.cljs$core$ICounted$ = true;
cljs.core.Vector.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__9488 = this;
return this__9488.array.length;
});
cljs.core.Vector.prototype.cljs$core$IStack$ = true;
cljs.core.Vector.prototype.cljs$core$IStack$_peek$arity$1 = (function (coll){
var this__9489 = this;
var count__9490 = this__9489.array.length;
if((count__9490 > 0))
{return (this__9489.array[(count__9490 - 1)]);
} else
{return null;
}
});
cljs.core.Vector.prototype.cljs$core$IStack$_pop$arity$1 = (function (coll){
var this__9491 = this;
if((this__9491.array.length > 0))
{var new_array__9492 = cljs.core.aclone.call(null,this__9491.array);
new_array__9492.pop();
return (new cljs.core.Vector(this__9491.meta,new_array__9492,null));
} else
{throw (new Error("Can't pop empty vector"));
}
});
cljs.core.Vector.prototype.cljs$core$IVector$ = true;
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n$arity$3 = (function (coll,n,val){
var this__9493 = this;
return cljs.core._assoc.call(null,coll,n,val);
});
cljs.core.Vector.prototype.cljs$core$IEquiv$ = true;
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9494 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.Vector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9495 = this;
return (new cljs.core.Vector(meta,this__9495.array,this__9495.__hash));
});
cljs.core.Vector.prototype.cljs$core$IMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9496 = this;
return this__9496.meta;
});
cljs.core.Vector.prototype.cljs$core$IIndexed$ = true;
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (coll,n){
var this__9498 = this;
if((function (){var and__132__auto____9499 = (0 <= n);
if(and__132__auto____9499)
{return (n < this__9498.array.length);
} else
{return and__132__auto____9499;
}
})())
{return (this__9498.array[n]);
} else
{return null;
}
});
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (coll,n,not_found){
var this__9500 = this;
if((function (){var and__132__auto____9501 = (0 <= n);
if(and__132__auto____9501)
{return (n < this__9500.array.length);
} else
{return and__132__auto____9501;
}
})())
{return (this__9500.array[n]);
} else
{return not_found;
}
});
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9497 = this;
return cljs.core.with_meta.call(null,cljs.core.Vector.EMPTY,this__9497.meta);
});
cljs.core.Vector;
cljs.core.Vector.EMPTY = (new cljs.core.Vector(null,[],0));
cljs.core.Vector.fromArray = (function (xs){
return (new cljs.core.Vector(null,xs,null));
});

/**
* @constructor
*/
cljs.core.VectorNode = (function (edit,arr){
this.edit = edit;
this.arr = arr;
})
cljs.core.VectorNode.cljs$lang$type = true;
cljs.core.VectorNode.cljs$lang$ctorPrSeq = (function (this__2327__auto__){
return cljs.core.list.call(null,"cljs.core.VectorNode");
});
cljs.core.VectorNode;
cljs.core.pv_fresh_node = (function pv_fresh_node(edit){
return (new cljs.core.VectorNode(edit,cljs.core.make_array.call(null,32)));
});
cljs.core.pv_aget = (function pv_aget(node,idx){
return (node.arr[idx]);
});
cljs.core.pv_aset = (function pv_aset(node,idx,val){
return (node.arr[idx] = val);
});
cljs.core.pv_clone_node = (function pv_clone_node(node){
return (new cljs.core.VectorNode(node.edit,cljs.core.aclone.call(null,node.arr)));
});
cljs.core.tail_off = (function tail_off(pv){
var cnt__9503 = pv.cnt;
if((cnt__9503 < 32))
{return 0;
} else
{return (((cnt__9503 - 1) >>> 5) << 5);
}
});
cljs.core.new_path = (function new_path(edit,level,node){
var ll__9504 = level;
var ret__9505 = node;
while(true){
if((ll__9504 === 0))
{return ret__9505;
} else
{var embed__9506 = ret__9505;
var r__9507 = cljs.core.pv_fresh_node.call(null,edit);
var ___9508 = cljs.core.pv_aset.call(null,r__9507,0,embed__9506);
{
var G__9509 = (ll__9504 - 5);
var G__9510 = r__9507;
ll__9504 = G__9509;
ret__9505 = G__9510;
continue;
}
}
break;
}
});
cljs.core.push_tail = (function push_tail(pv,level,parent,tailnode){
var ret__9511 = cljs.core.pv_clone_node.call(null,parent);
var subidx__9512 = (((pv.cnt - 1) >>> level) & 31);
if((5 === level))
{cljs.core.pv_aset.call(null,ret__9511,subidx__9512,tailnode);
return ret__9511;
} else
{var temp__317__auto____9513 = cljs.core.pv_aget.call(null,parent,subidx__9512);
if(cljs.core.truth_(temp__317__auto____9513))
{var child__9514 = temp__317__auto____9513;
var node_to_insert__9515 = push_tail.call(null,pv,(level - 5),child__9514,tailnode);
cljs.core.pv_aset.call(null,ret__9511,subidx__9512,node_to_insert__9515);
return ret__9511;
} else
{var node_to_insert__9516 = cljs.core.new_path.call(null,null,(level - 5),tailnode);
cljs.core.pv_aset.call(null,ret__9511,subidx__9512,node_to_insert__9516);
return ret__9511;
}
}
});
cljs.core.array_for = (function array_for(pv,i){
if((function (){var and__132__auto____9517 = (0 <= i);
if(and__132__auto____9517)
{return (i < pv.cnt);
} else
{return and__132__auto____9517;
}
})())
{if((i >= cljs.core.tail_off.call(null,pv)))
{return pv.tail;
} else
{var node__9518 = pv.root;
var level__9519 = pv.shift;
while(true){
if((level__9519 > 0))
{{
var G__9520 = cljs.core.pv_aget.call(null,node__9518,((i >>> level__9519) & 31));
var G__9521 = (level__9519 - 5);
node__9518 = G__9520;
level__9519 = G__9521;
continue;
}
} else
{return node__9518.arr;
}
break;
}
}
} else
{throw (new Error([cljs.core.str("No item "),cljs.core.str(i),cljs.core.str(" in vector of length "),cljs.core.str(pv.cnt)].join('')));
}
});
cljs.core.do_assoc = (function do_assoc(pv,level,node,i,val){
var ret__9522 = cljs.core.pv_clone_node.call(null,node);
if((level === 0))
{cljs.core.pv_aset.call(null,ret__9522,(i & 31),val);
return ret__9522;
} else
{var subidx__9523 = ((i >>> level) & 31);
cljs.core.pv_aset.call(null,ret__9522,subidx__9523,do_assoc.call(null,pv,(level - 5),cljs.core.pv_aget.call(null,node,subidx__9523),i,val));
return ret__9522;
}
});
cljs.core.pop_tail = (function pop_tail(pv,level,node){
var subidx__9524 = (((pv.cnt - 2) >>> level) & 31);
if((level > 5))
{var new_child__9525 = pop_tail.call(null,pv,(level - 5),cljs.core.pv_aget.call(null,node,subidx__9524));
if((function (){var and__132__auto____9526 = (new_child__9525 == null);
if(and__132__auto____9526)
{return (subidx__9524 === 0);
} else
{return and__132__auto____9526;
}
})())
{return null;
} else
{var ret__9527 = cljs.core.pv_clone_node.call(null,node);
cljs.core.pv_aset.call(null,ret__9527,subidx__9524,new_child__9525);
return ret__9527;
}
} else
{if((subidx__9524 === 0))
{return null;
} else
{if("\uFDD0'else")
{var ret__9528 = cljs.core.pv_clone_node.call(null,node);
cljs.core.pv_aset.call(null,ret__9528,subidx__9524,null);
return ret__9528;
} else
{return null;
}
}
}
});
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
cljs.core.vector_seq = (function vector_seq(v,offset){
var c__9529 = cljs.core._count.call(null,v);
if((c__9529 > 0))
{if((void 0 === cljs.core.t9530))
{
/**
* @constructor
*/
cljs.core.t9530 = (function (c,offset,v,vector_seq,__meta__2261__auto__){
this.c = c;
this.offset = offset;
this.v = v;
this.vector_seq = vector_seq;
this.__meta__2261__auto__ = __meta__2261__auto__;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 282263648;
})
cljs.core.t9530.cljs$lang$type = true;
cljs.core.t9530.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.t9530");
});
cljs.core.t9530.prototype.cljs$core$ISeqable$ = true;
cljs.core.t9530.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (vseq){
var this__9531 = this;
return vseq;
});
cljs.core.t9530.prototype.cljs$core$ISeq$ = true;
cljs.core.t9530.prototype.cljs$core$ISeq$_first$arity$1 = (function (_){
var this__9532 = this;
return cljs.core._nth.call(null,this__9532.v,this__9532.offset);
});
cljs.core.t9530.prototype.cljs$core$ISeq$_rest$arity$1 = (function (_){
var this__9533 = this;
var offset__9534 = (this__9533.offset + 1);
if((offset__9534 < this__9533.c))
{return this__9533.vector_seq.call(null,this__9533.v,offset__9534);
} else
{return cljs.core.List.EMPTY;
}
});
cljs.core.t9530.prototype.cljs$core$ASeq$ = true;
cljs.core.t9530.prototype.cljs$core$IEquiv$ = true;
cljs.core.t9530.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (vseq,other){
var this__9535 = this;
return cljs.core.equiv_sequential.call(null,vseq,other);
});
cljs.core.t9530.prototype.cljs$core$ISequential$ = true;
cljs.core.t9530.prototype.cljs$core$IPrintable$ = true;
cljs.core.t9530.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (vseq,opts){
var this__9536 = this;
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,vseq);
});
cljs.core.t9530.prototype.cljs$core$IMeta$ = true;
cljs.core.t9530.prototype.cljs$core$IMeta$_meta$arity$1 = (function (___2262__auto__){
var this__9537 = this;
return this__9537.__meta__2261__auto__;
});
cljs.core.t9530.prototype.cljs$core$IWithMeta$ = true;
cljs.core.t9530.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (___2262__auto__,__meta__2261__auto__){
var this__9538 = this;
return (new cljs.core.t9530(this__9538.c,this__9538.offset,this__9538.v,this__9538.vector_seq,__meta__2261__auto__));
});
cljs.core.t9530;
} else
{}
return (new cljs.core.t9530(c__9529,offset,v,vector_seq,null));
} else
{return null;
}
});

/**
* @constructor
*/
cljs.core.PersistentVector = (function (meta,cnt,shift,root,tail,__hash){
this.meta = meta;
this.cnt = cnt;
this.shift = shift;
this.root = root;
this.tail = tail;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 2164209055;
})
cljs.core.PersistentVector.cljs$lang$type = true;
cljs.core.PersistentVector.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentVector");
});
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = (function (coll){
var this__9543 = this;
return (new cljs.core.TransientVector(this__9543.cnt,this__9543.shift,cljs.core.tv_editable_root.call(null,this__9543.root),cljs.core.tv_editable_tail.call(null,this__9543.tail)));
});
cljs.core.PersistentVector.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9544 = this;
var h__2236__auto____9545 = this__9544.__hash;
if((h__2236__auto____9545 != null))
{return h__2236__auto____9545;
} else
{var h__2236__auto____9546 = cljs.core.hash_coll.call(null,coll);
this__9544.__hash = h__2236__auto____9546;
return h__2236__auto____9546;
}
});
cljs.core.PersistentVector.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,k){
var this__9547 = this;
return cljs.core._nth.call(null,coll,k,null);
});
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,k,not_found){
var this__9548 = this;
return cljs.core._nth.call(null,coll,k,not_found);
});
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (coll,k,v){
var this__9549 = this;
if((function (){var and__132__auto____9550 = (0 <= k);
if(and__132__auto____9550)
{return (k < this__9549.cnt);
} else
{return and__132__auto____9550;
}
})())
{if((cljs.core.tail_off.call(null,coll) <= k))
{var new_tail__9551 = cljs.core.aclone.call(null,this__9549.tail);
(new_tail__9551[(k & 31)] = v);
return (new cljs.core.PersistentVector(this__9549.meta,this__9549.cnt,this__9549.shift,this__9549.root,new_tail__9551,null));
} else
{return (new cljs.core.PersistentVector(this__9549.meta,this__9549.cnt,this__9549.shift,cljs.core.do_assoc.call(null,coll,this__9549.shift,this__9549.root,k,v),this__9549.tail,null));
}
} else
{if((k === this__9549.cnt))
{return cljs.core._conj.call(null,coll,v);
} else
{if("\uFDD0'else")
{throw (new Error([cljs.core.str("Index "),cljs.core.str(k),cljs.core.str(" out of bounds  [0,"),cljs.core.str(this__9549.cnt),cljs.core.str("]")].join('')));
} else
{return null;
}
}
}
});
cljs.core.PersistentVector.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentVector.prototype.call = (function() {
var G__9596 = null;
var G__9596__2 = (function (tsym9541,k){
var this__9552 = this;
var tsym9541__9553 = this;
var coll__9554 = tsym9541__9553;
return cljs.core._lookup.call(null,coll__9554,k);
});
var G__9596__3 = (function (tsym9542,k,not_found){
var this__9555 = this;
var tsym9542__9556 = this;
var coll__9557 = tsym9542__9556;
return cljs.core._lookup.call(null,coll__9557,k,not_found);
});
G__9596 = function(tsym9542,k,not_found){
switch(arguments.length){
case 2:
return G__9596__2.call(this,tsym9542,k);
case 3:
return G__9596__3.call(this,tsym9542,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9596;
})()
;
cljs.core.PersistentVector.prototype.apply = (function (tsym9539,args9540){
return tsym9539.call.apply(tsym9539,[tsym9539].concat(cljs.core.aclone.call(null,args9540)));
});
cljs.core.PersistentVector.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (v,f,init){
var this__9558 = this;
var step_init__9559 = [0,init];
var i__9560 = 0;
while(true){
if((i__9560 < this__9558.cnt))
{var arr__9561 = cljs.core.array_for.call(null,v,i__9560);
var len__9562 = arr__9561.length;
var init__9566 = (function (){var j__9563 = 0;
var init__9564 = (step_init__9559[1]);
while(true){
if((j__9563 < len__9562))
{var init__9565 = f.call(null,init__9564,(j__9563 + i__9560),(arr__9561[j__9563]));
if(cljs.core.reduced_QMARK_.call(null,init__9565))
{return init__9565;
} else
{{
var G__9597 = (j__9563 + 1);
var G__9598 = init__9565;
j__9563 = G__9597;
init__9564 = G__9598;
continue;
}
}
} else
{(step_init__9559[0] = len__9562);
(step_init__9559[1] = init__9564);
return init__9564;
}
break;
}
})();
if(cljs.core.reduced_QMARK_.call(null,init__9566))
{return cljs.core.deref.call(null,init__9566);
} else
{{
var G__9599 = (i__9560 + (step_init__9559[0]));
i__9560 = G__9599;
continue;
}
}
} else
{return (step_init__9559[1]);
}
break;
}
});
cljs.core.PersistentVector.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__9567 = this;
if(((this__9567.cnt - cljs.core.tail_off.call(null,coll)) < 32))
{var new_tail__9568 = cljs.core.aclone.call(null,this__9567.tail);
new_tail__9568.push(o);
return (new cljs.core.PersistentVector(this__9567.meta,(this__9567.cnt + 1),this__9567.shift,this__9567.root,new_tail__9568,null));
} else
{var root_overflow_QMARK___9569 = ((this__9567.cnt >>> 5) > (1 << this__9567.shift));
var new_shift__9570 = ((root_overflow_QMARK___9569)?(this__9567.shift + 5):this__9567.shift);
var new_root__9572 = ((root_overflow_QMARK___9569)?(function (){var n_r__9571 = cljs.core.pv_fresh_node.call(null,null);
cljs.core.pv_aset.call(null,n_r__9571,0,this__9567.root);
cljs.core.pv_aset.call(null,n_r__9571,1,cljs.core.new_path.call(null,null,this__9567.shift,(new cljs.core.VectorNode(null,this__9567.tail))));
return n_r__9571;
})():cljs.core.push_tail.call(null,coll,this__9567.shift,this__9567.root,(new cljs.core.VectorNode(null,this__9567.tail))));
return (new cljs.core.PersistentVector(this__9567.meta,(this__9567.cnt + 1),new_shift__9570,new_root__9572,[o],null));
}
});
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = (function (coll){
var this__9573 = this;
return cljs.core._nth.call(null,coll,0);
});
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = (function (coll){
var this__9574 = this;
return cljs.core._nth.call(null,coll,1);
});
cljs.core.PersistentVector.prototype.toString = (function (){
var this__9575 = this;
var this$__9576 = this;
return cljs.core.pr_str.call(null,this$__9576);
});
cljs.core.PersistentVector.prototype.cljs$core$IReduce$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (v,f){
var this__9577 = this;
return cljs.core.ci_reduce.call(null,v,f);
});
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (v,f,start){
var this__9578 = this;
return cljs.core.ci_reduce.call(null,v,f,start);
});
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9579 = this;
return cljs.core.vector_seq.call(null,coll,0);
});
cljs.core.PersistentVector.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__9580 = this;
return this__9580.cnt;
});
cljs.core.PersistentVector.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = (function (coll){
var this__9581 = this;
if((this__9581.cnt > 0))
{return cljs.core._nth.call(null,coll,(this__9581.cnt - 1));
} else
{return null;
}
});
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = (function (coll){
var this__9582 = this;
if((this__9582.cnt === 0))
{throw (new Error("Can't pop empty vector"));
} else
{if((1 === this__9582.cnt))
{return cljs.core._with_meta.call(null,cljs.core.PersistentVector.EMPTY,this__9582.meta);
} else
{if((1 < (this__9582.cnt - cljs.core.tail_off.call(null,coll))))
{return (new cljs.core.PersistentVector(this__9582.meta,(this__9582.cnt - 1),this__9582.shift,this__9582.root,this__9582.tail.slice(0,-1),null));
} else
{if("\uFDD0'else")
{var new_tail__9583 = cljs.core.array_for.call(null,coll,(this__9582.cnt - 2));
var nr__9584 = cljs.core.pop_tail.call(null,coll,this__9582.shift,this__9582.root);
var new_root__9585 = (((nr__9584 == null))?cljs.core.PersistentVector.EMPTY_NODE:nr__9584);
var cnt_1__9586 = (this__9582.cnt - 1);
if((function (){var and__132__auto____9587 = (5 < this__9582.shift);
if(and__132__auto____9587)
{return (cljs.core.pv_aget.call(null,new_root__9585,1) == null);
} else
{return and__132__auto____9587;
}
})())
{return (new cljs.core.PersistentVector(this__9582.meta,cnt_1__9586,(this__9582.shift - 5),cljs.core.pv_aget.call(null,new_root__9585,0),new_tail__9583,null));
} else
{return (new cljs.core.PersistentVector(this__9582.meta,cnt_1__9586,this__9582.shift,new_root__9585,new_tail__9583,null));
}
} else
{return null;
}
}
}
}
});
cljs.core.PersistentVector.prototype.cljs$core$IVector$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = (function (coll,n,val){
var this__9589 = this;
return cljs.core._assoc.call(null,coll,n,val);
});
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9590 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9591 = this;
return (new cljs.core.PersistentVector(meta,this__9591.cnt,this__9591.shift,this__9591.root,this__9591.tail,this__9591.__hash));
});
cljs.core.PersistentVector.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9592 = this;
return this__9592.meta;
});
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (coll,n){
var this__9593 = this;
return (cljs.core.array_for.call(null,coll,n)[(n & 31)]);
});
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (coll,n,not_found){
var this__9594 = this;
if((function (){var and__132__auto____9595 = (0 <= n);
if(and__132__auto____9595)
{return (n < this__9594.cnt);
} else
{return and__132__auto____9595;
}
})())
{return cljs.core._nth.call(null,coll,n);
} else
{return not_found;
}
});
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9588 = this;
return cljs.core.with_meta.call(null,cljs.core.PersistentVector.EMPTY,this__9588.meta);
});
cljs.core.PersistentVector;
cljs.core.PersistentVector.EMPTY_NODE = cljs.core.pv_fresh_node.call(null,null);
cljs.core.PersistentVector.EMPTY = (new cljs.core.PersistentVector(null,0,5,cljs.core.PersistentVector.EMPTY_NODE,[],0));
cljs.core.PersistentVector.fromArray = (function (xs){
var xs__9600 = cljs.core.seq.call(null,xs);
var out__9601 = cljs.core.transient$.call(null,cljs.core.PersistentVector.EMPTY);
while(true){
if(cljs.core.truth_(xs__9600))
{{
var G__9602 = cljs.core.next.call(null,xs__9600);
var G__9603 = cljs.core.conj_BANG_.call(null,out__9601,cljs.core.first.call(null,xs__9600));
xs__9600 = G__9602;
out__9601 = G__9603;
continue;
}
} else
{return cljs.core.persistent_BANG_.call(null,out__9601);
}
break;
}
});
cljs.core.vec = (function vec(coll){
return cljs.core.reduce.call(null,cljs.core.conj,cljs.core.PersistentVector.EMPTY,coll);
});
/**
* @param {...*} var_args
*/
cljs.core.vector = (function() { 
var vector__delegate = function (args){
return cljs.core.vec.call(null,args);
};
var vector = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return vector__delegate.call(this, args);
};
vector.cljs$lang$maxFixedArity = 0;
vector.cljs$lang$applyTo = (function (arglist__9604){
var args = cljs.core.seq(arglist__9604);;
return vector__delegate(args);
});
vector.cljs$lang$arity$variadic = vector__delegate;
return vector;
})()
;

/**
* @constructor
*/
cljs.core.Subvec = (function (meta,v,start,end,__hash){
this.meta = meta;
this.v = v;
this.start = start;
this.end = end;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 16200095;
})
cljs.core.Subvec.cljs$lang$type = true;
cljs.core.Subvec.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.Subvec");
});
cljs.core.Subvec.prototype.cljs$core$IHash$ = true;
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9609 = this;
var h__2236__auto____9610 = this__9609.__hash;
if((h__2236__auto____9610 != null))
{return h__2236__auto____9610;
} else
{var h__2236__auto____9611 = cljs.core.hash_coll.call(null,coll);
this__9609.__hash = h__2236__auto____9611;
return h__2236__auto____9611;
}
});
cljs.core.Subvec.prototype.cljs$core$ILookup$ = true;
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,k){
var this__9612 = this;
return cljs.core._nth.call(null,coll,k,null);
});
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,k,not_found){
var this__9613 = this;
return cljs.core._nth.call(null,coll,k,not_found);
});
cljs.core.Subvec.prototype.cljs$core$IAssociative$ = true;
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (coll,key,val){
var this__9614 = this;
var v_pos__9615 = (this__9614.start + key);
return (new cljs.core.Subvec(this__9614.meta,cljs.core._assoc.call(null,this__9614.v,v_pos__9615,val),this__9614.start,((this__9614.end > (v_pos__9615 + 1)) ? this__9614.end : (v_pos__9615 + 1)),null));
});
cljs.core.Subvec.prototype.cljs$core$IFn$ = true;
cljs.core.Subvec.prototype.call = (function() {
var G__9639 = null;
var G__9639__2 = (function (tsym9607,k){
var this__9616 = this;
var tsym9607__9617 = this;
var coll__9618 = tsym9607__9617;
return cljs.core._lookup.call(null,coll__9618,k);
});
var G__9639__3 = (function (tsym9608,k,not_found){
var this__9619 = this;
var tsym9608__9620 = this;
var coll__9621 = tsym9608__9620;
return cljs.core._lookup.call(null,coll__9621,k,not_found);
});
G__9639 = function(tsym9608,k,not_found){
switch(arguments.length){
case 2:
return G__9639__2.call(this,tsym9608,k);
case 3:
return G__9639__3.call(this,tsym9608,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9639;
})()
;
cljs.core.Subvec.prototype.apply = (function (tsym9605,args9606){
return tsym9605.call.apply(tsym9605,[tsym9605].concat(cljs.core.aclone.call(null,args9606)));
});
cljs.core.Subvec.prototype.cljs$core$ISequential$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__9622 = this;
return (new cljs.core.Subvec(this__9622.meta,cljs.core._assoc_n.call(null,this__9622.v,this__9622.end,o),this__9622.start,(this__9622.end + 1),null));
});
cljs.core.Subvec.prototype.toString = (function (){
var this__9623 = this;
var this$__9624 = this;
return cljs.core.pr_str.call(null,this$__9624);
});
cljs.core.Subvec.prototype.cljs$core$IReduce$ = true;
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (coll,f){
var this__9625 = this;
return cljs.core.ci_reduce.call(null,coll,f);
});
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (coll,f,start){
var this__9626 = this;
return cljs.core.ci_reduce.call(null,coll,f,start);
});
cljs.core.Subvec.prototype.cljs$core$ISeqable$ = true;
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9627 = this;
var subvec_seq__9628 = (function subvec_seq(i){
if((i === this__9627.end))
{return null;
} else
{return cljs.core.cons.call(null,cljs.core._nth.call(null,this__9627.v,i),(new cljs.core.LazySeq(null,false,(function (){
return subvec_seq.call(null,(i + 1));
}))));
}
});
return subvec_seq__9628.call(null,this__9627.start);
});
cljs.core.Subvec.prototype.cljs$core$ICounted$ = true;
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__9629 = this;
return (this__9629.end - this__9629.start);
});
cljs.core.Subvec.prototype.cljs$core$IStack$ = true;
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = (function (coll){
var this__9630 = this;
return cljs.core._nth.call(null,this__9630.v,(this__9630.end - 1));
});
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = (function (coll){
var this__9631 = this;
if((this__9631.start === this__9631.end))
{throw (new Error("Can't pop empty vector"));
} else
{return (new cljs.core.Subvec(this__9631.meta,this__9631.v,this__9631.start,(this__9631.end - 1),null));
}
});
cljs.core.Subvec.prototype.cljs$core$IVector$ = true;
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = (function (coll,n,val){
var this__9632 = this;
return cljs.core._assoc.call(null,coll,n,val);
});
cljs.core.Subvec.prototype.cljs$core$IEquiv$ = true;
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9633 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.Subvec.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9634 = this;
return (new cljs.core.Subvec(meta,this__9634.v,this__9634.start,this__9634.end,this__9634.__hash));
});
cljs.core.Subvec.prototype.cljs$core$IMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9635 = this;
return this__9635.meta;
});
cljs.core.Subvec.prototype.cljs$core$IIndexed$ = true;
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (coll,n){
var this__9637 = this;
return cljs.core._nth.call(null,this__9637.v,(this__9637.start + n));
});
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (coll,n,not_found){
var this__9638 = this;
return cljs.core._nth.call(null,this__9638.v,(this__9638.start + n),not_found);
});
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9636 = this;
return cljs.core.with_meta.call(null,cljs.core.Vector.EMPTY,this__9636.meta);
});
cljs.core.Subvec;
/**
* Returns a persistent vector of the items in vector from
* start (inclusive) to end (exclusive).  If end is not supplied,
* defaults to (count vector). This operation is O(1) and very fast, as
* the resulting vector shares structure with the original and no
* trimming is done.
*/
cljs.core.subvec = (function() {
var subvec = null;
var subvec__2 = (function (v,start){
return subvec.call(null,v,start,cljs.core.count.call(null,v));
});
var subvec__3 = (function (v,start,end){
return (new cljs.core.Subvec(null,v,start,end,null));
});
subvec = function(v,start,end){
switch(arguments.length){
case 2:
return subvec__2.call(this,v,start);
case 3:
return subvec__3.call(this,v,start,end);
}
throw('Invalid arity: ' + arguments.length);
};
subvec.cljs$lang$arity$2 = subvec__2;
subvec.cljs$lang$arity$3 = subvec__3;
return subvec;
})()
;
cljs.core.tv_ensure_editable = (function tv_ensure_editable(edit,node){
if((edit === node.edit))
{return node;
} else
{return (new cljs.core.VectorNode(edit,cljs.core.aclone.call(null,node.arr)));
}
});
cljs.core.tv_editable_root = (function tv_editable_root(node){
return (new cljs.core.VectorNode({},cljs.core.aclone.call(null,node.arr)));
});
cljs.core.tv_editable_tail = (function tv_editable_tail(tl){
var ret__9640 = cljs.core.make_array.call(null,32);
cljs.core.array_copy.call(null,tl,0,ret__9640,0,tl.length);
return ret__9640;
});
cljs.core.tv_push_tail = (function tv_push_tail(tv,level,parent,tail_node){
var ret__9641 = cljs.core.tv_ensure_editable.call(null,tv.root.edit,parent);
var subidx__9642 = (((tv.cnt - 1) >>> level) & 31);
cljs.core.pv_aset.call(null,ret__9641,subidx__9642,(((level === 5))?tail_node:(function (){var child__9643 = cljs.core.pv_aget.call(null,ret__9641,subidx__9642);
if((child__9643 != null))
{return tv_push_tail.call(null,tv,(level - 5),child__9643,tail_node);
} else
{return cljs.core.new_path.call(null,tv.root.edit,(level - 5),tail_node);
}
})()));
return ret__9641;
});
cljs.core.tv_pop_tail = (function tv_pop_tail(tv,level,node){
var node__9644 = cljs.core.tv_ensure_editable.call(null,tv.root.edit,node);
var subidx__9645 = (((tv.cnt - 2) >>> level) & 31);
if((level > 5))
{var new_child__9646 = tv_pop_tail.call(null,tv,(level - 5),cljs.core.pv_aget.call(null,node__9644,subidx__9645));
if((function (){var and__132__auto____9647 = (new_child__9646 == null);
if(and__132__auto____9647)
{return (subidx__9645 === 0);
} else
{return and__132__auto____9647;
}
})())
{return null;
} else
{cljs.core.pv_aset.call(null,node__9644,subidx__9645,new_child__9646);
return node__9644;
}
} else
{if((subidx__9645 === 0))
{return null;
} else
{if("\uFDD0'else")
{cljs.core.pv_aset.call(null,node__9644,subidx__9645,null);
return node__9644;
} else
{return null;
}
}
}
});
cljs.core.editable_array_for = (function editable_array_for(tv,i){
if((function (){var and__132__auto____9648 = (0 <= i);
if(and__132__auto____9648)
{return (i < tv.cnt);
} else
{return and__132__auto____9648;
}
})())
{if((i >= cljs.core.tail_off.call(null,tv)))
{return tv.tail;
} else
{var root__9649 = tv.root;
var node__9650 = root__9649;
var level__9651 = tv.shift;
while(true){
if((level__9651 > 0))
{{
var G__9652 = cljs.core.tv_ensure_editable.call(null,root__9649.edit,cljs.core.pv_aget.call(null,node__9650,((i >>> level__9651) & 31)));
var G__9653 = (level__9651 - 5);
node__9650 = G__9652;
level__9651 = G__9653;
continue;
}
} else
{return node__9650.arr;
}
break;
}
}
} else
{throw (new Error([cljs.core.str("No item "),cljs.core.str(i),cljs.core.str(" in transient vector of length "),cljs.core.str(tv.cnt)].join('')));
}
});

/**
* @constructor
*/
cljs.core.TransientVector = (function (cnt,shift,root,tail){
this.cnt = cnt;
this.shift = shift;
this.root = root;
this.tail = tail;
this.cljs$lang$protocol_mask$partition0$ = 147;
this.cljs$lang$protocol_mask$partition1$ = 11;
})
cljs.core.TransientVector.cljs$lang$type = true;
cljs.core.TransientVector.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.TransientVector");
});
cljs.core.TransientVector.prototype.cljs$core$IFn$ = true;
cljs.core.TransientVector.prototype.call = (function() {
var G__9691 = null;
var G__9691__2 = (function (tsym9656,k){
var this__9658 = this;
var tsym9656__9659 = this;
var coll__9660 = tsym9656__9659;
return cljs.core._lookup.call(null,coll__9660,k);
});
var G__9691__3 = (function (tsym9657,k,not_found){
var this__9661 = this;
var tsym9657__9662 = this;
var coll__9663 = tsym9657__9662;
return cljs.core._lookup.call(null,coll__9663,k,not_found);
});
G__9691 = function(tsym9657,k,not_found){
switch(arguments.length){
case 2:
return G__9691__2.call(this,tsym9657,k);
case 3:
return G__9691__3.call(this,tsym9657,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9691;
})()
;
cljs.core.TransientVector.prototype.apply = (function (tsym9654,args9655){
return tsym9654.call.apply(tsym9654,[tsym9654].concat(cljs.core.aclone.call(null,args9655)));
});
cljs.core.TransientVector.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,k){
var this__9664 = this;
return cljs.core._nth.call(null,coll,k,null);
});
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,k,not_found){
var this__9665 = this;
return cljs.core._nth.call(null,coll,k,not_found);
});
cljs.core.TransientVector.prototype.cljs$core$IIndexed$ = true;
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (coll,n){
var this__9666 = this;
if(cljs.core.truth_(this__9666.root.edit))
{return (cljs.core.array_for.call(null,coll,n)[(n & 31)]);
} else
{throw (new Error("nth after persistent!"));
}
});
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (coll,n,not_found){
var this__9667 = this;
if((function (){var and__132__auto____9668 = (0 <= n);
if(and__132__auto____9668)
{return (n < this__9667.cnt);
} else
{return and__132__auto____9668;
}
})())
{return cljs.core._nth.call(null,coll,n);
} else
{return not_found;
}
});
cljs.core.TransientVector.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__9669 = this;
if(cljs.core.truth_(this__9669.root.edit))
{return this__9669.cnt;
} else
{throw (new Error("count after persistent!"));
}
});
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$ = true;
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = (function (tcoll,n,val){
var this__9670 = this;
if(cljs.core.truth_(this__9670.root.edit))
{if((function (){var and__132__auto____9671 = (0 <= n);
if(and__132__auto____9671)
{return (n < this__9670.cnt);
} else
{return and__132__auto____9671;
}
})())
{if((cljs.core.tail_off.call(null,tcoll) <= n))
{(this__9670.tail[(n & 31)] = val);
return tcoll;
} else
{var new_root__9674 = (function go(level,node){
var node__9672 = cljs.core.tv_ensure_editable.call(null,this__9670.root.edit,node);
if((level === 0))
{cljs.core.pv_aset.call(null,node__9672,(n & 31),val);
return node__9672;
} else
{var subidx__9673 = ((n >>> level) & 31);
cljs.core.pv_aset.call(null,node__9672,subidx__9673,go.call(null,(level - 5),cljs.core.pv_aget.call(null,node__9672,subidx__9673)));
return node__9672;
}
}).call(null,this__9670.shift,this__9670.root);
this__9670.root = new_root__9674;
return tcoll;
}
} else
{if((n === this__9670.cnt))
{return cljs.core._conj_BANG_.call(null,tcoll,val);
} else
{if("\uFDD0'else")
{throw (new Error([cljs.core.str("Index "),cljs.core.str(n),cljs.core.str(" out of bounds for TransientVector of length"),cljs.core.str(this__9670.cnt)].join('')));
} else
{return null;
}
}
}
} else
{throw (new Error("assoc! after persistent!"));
}
});
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_pop_BANG_$arity$1 = (function (tcoll){
var this__9675 = this;
if(cljs.core.truth_(this__9675.root.edit))
{if((this__9675.cnt === 0))
{throw (new Error("Can't pop empty vector"));
} else
{if((1 === this__9675.cnt))
{this__9675.cnt = 0;
return tcoll;
} else
{if((((this__9675.cnt - 1) & 31) > 0))
{this__9675.cnt = (this__9675.cnt - 1);
return tcoll;
} else
{if("\uFDD0'else")
{var new_tail__9676 = cljs.core.editable_array_for.call(null,tcoll,(this__9675.cnt - 2));
var new_root__9678 = (function (){var nr__9677 = cljs.core.tv_pop_tail.call(null,tcoll,this__9675.shift,this__9675.root);
if((nr__9677 != null))
{return nr__9677;
} else
{return (new cljs.core.VectorNode(this__9675.root.edit,cljs.core.make_array.call(null,32)));
}
})();
if((function (){var and__132__auto____9679 = (5 < this__9675.shift);
if(and__132__auto____9679)
{return (cljs.core.pv_aget.call(null,new_root__9678,1) == null);
} else
{return and__132__auto____9679;
}
})())
{var new_root__9680 = cljs.core.tv_ensure_editable.call(null,this__9675.root.edit,cljs.core.pv_aget.call(null,new_root__9678,0));
this__9675.root = new_root__9680;
this__9675.shift = (this__9675.shift - 5);
this__9675.cnt = (this__9675.cnt - 1);
this__9675.tail = new_tail__9676;
return tcoll;
} else
{this__9675.root = new_root__9678;
this__9675.cnt = (this__9675.cnt - 1);
this__9675.tail = new_tail__9676;
return tcoll;
}
} else
{return null;
}
}
}
}
} else
{throw (new Error("pop! after persistent!"));
}
});
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$ = true;
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = (function (tcoll,key,val){
var this__9681 = this;
return cljs.core._assoc_n_BANG_.call(null,tcoll,key,val);
});
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = (function (tcoll,o){
var this__9682 = this;
if(cljs.core.truth_(this__9682.root.edit))
{if(((this__9682.cnt - cljs.core.tail_off.call(null,tcoll)) < 32))
{(this__9682.tail[(this__9682.cnt & 31)] = o);
this__9682.cnt = (this__9682.cnt + 1);
return tcoll;
} else
{var tail_node__9683 = (new cljs.core.VectorNode(this__9682.root.edit,this__9682.tail));
var new_tail__9684 = cljs.core.make_array.call(null,32);
(new_tail__9684[0] = o);
this__9682.tail = new_tail__9684;
if(((this__9682.cnt >>> 5) > (1 << this__9682.shift)))
{var new_root_array__9685 = cljs.core.make_array.call(null,32);
var new_shift__9686 = (this__9682.shift + 5);
(new_root_array__9685[0] = this__9682.root);
(new_root_array__9685[1] = cljs.core.new_path.call(null,this__9682.root.edit,this__9682.shift,tail_node__9683));
this__9682.root = (new cljs.core.VectorNode(this__9682.root.edit,new_root_array__9685));
this__9682.shift = new_shift__9686;
this__9682.cnt = (this__9682.cnt + 1);
return tcoll;
} else
{var new_root__9687 = cljs.core.tv_push_tail.call(null,tcoll,this__9682.shift,this__9682.root,tail_node__9683);
this__9682.root = new_root__9687;
this__9682.cnt = (this__9682.cnt + 1);
return tcoll;
}
}
} else
{throw (new Error("conj! after persistent!"));
}
});
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = (function (tcoll){
var this__9688 = this;
if(cljs.core.truth_(this__9688.root.edit))
{this__9688.root.edit = null;
var len__9689 = (this__9688.cnt - cljs.core.tail_off.call(null,tcoll));
var trimmed_tail__9690 = cljs.core.make_array.call(null,len__9689);
cljs.core.array_copy.call(null,this__9688.tail,0,trimmed_tail__9690,0,len__9689);
return (new cljs.core.PersistentVector(null,this__9688.cnt,this__9688.shift,this__9688.root,trimmed_tail__9690,null));
} else
{throw (new Error("persistent! called twice"));
}
});
cljs.core.TransientVector;

/**
* @constructor
*/
cljs.core.PersistentQueueSeq = (function (meta,front,rear,__hash){
this.meta = meta;
this.front = front;
this.rear = rear;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 15925324;
})
cljs.core.PersistentQueueSeq.cljs$lang$type = true;
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentQueueSeq");
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9692 = this;
var h__2236__auto____9693 = this__9692.__hash;
if((h__2236__auto____9693 != null))
{return h__2236__auto____9693;
} else
{var h__2236__auto____9694 = cljs.core.hash_coll.call(null,coll);
this__9692.__hash = h__2236__auto____9694;
return h__2236__auto____9694;
}
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__9695 = this;
return cljs.core.cons.call(null,o,coll);
});
cljs.core.PersistentQueueSeq.prototype.toString = (function (){
var this__9696 = this;
var this$__9697 = this;
return cljs.core.pr_str.call(null,this$__9697);
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9698 = this;
return coll;
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = (function (coll){
var this__9699 = this;
return cljs.core._first.call(null,this__9699.front);
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = (function (coll){
var this__9700 = this;
var temp__317__auto____9701 = cljs.core.next.call(null,this__9700.front);
if(cljs.core.truth_(temp__317__auto____9701))
{var f1__9702 = temp__317__auto____9701;
return (new cljs.core.PersistentQueueSeq(this__9700.meta,f1__9702,this__9700.rear,null));
} else
{if((this__9700.rear == null))
{return cljs.core._empty.call(null,coll);
} else
{return (new cljs.core.PersistentQueueSeq(this__9700.meta,this__9700.rear,null,null));
}
}
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9703 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9704 = this;
return (new cljs.core.PersistentQueueSeq(meta,this__9704.front,this__9704.rear,this__9704.__hash));
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9705 = this;
return this__9705.meta;
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9706 = this;
return cljs.core.with_meta.call(null,cljs.core.List.EMPTY,this__9706.meta);
});
cljs.core.PersistentQueueSeq;

/**
* @constructor
*/
cljs.core.PersistentQueue = (function (meta,count,front,rear,__hash){
this.meta = meta;
this.count = count;
this.front = front;
this.rear = rear;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 15929422;
})
cljs.core.PersistentQueue.cljs$lang$type = true;
cljs.core.PersistentQueue.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentQueue");
});
cljs.core.PersistentQueue.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9707 = this;
var h__2236__auto____9708 = this__9707.__hash;
if((h__2236__auto____9708 != null))
{return h__2236__auto____9708;
} else
{var h__2236__auto____9709 = cljs.core.hash_coll.call(null,coll);
this__9707.__hash = h__2236__auto____9709;
return h__2236__auto____9709;
}
});
cljs.core.PersistentQueue.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__9710 = this;
if(cljs.core.truth_(this__9710.front))
{return (new cljs.core.PersistentQueue(this__9710.meta,(this__9710.count + 1),this__9710.front,cljs.core.conj.call(null,(function (){var or__138__auto____9711 = this__9710.rear;
if(cljs.core.truth_(or__138__auto____9711))
{return or__138__auto____9711;
} else
{return cljs.core.PersistentVector.fromArray([]);
}
})(),o),null));
} else
{return (new cljs.core.PersistentQueue(this__9710.meta,(this__9710.count + 1),cljs.core.conj.call(null,this__9710.front,o),cljs.core.PersistentVector.fromArray([]),null));
}
});
cljs.core.PersistentQueue.prototype.toString = (function (){
var this__9712 = this;
var this$__9713 = this;
return cljs.core.pr_str.call(null,this$__9713);
});
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9714 = this;
var rear__9715 = cljs.core.seq.call(null,this__9714.rear);
if(cljs.core.truth_((function (){var or__138__auto____9716 = this__9714.front;
if(cljs.core.truth_(or__138__auto____9716))
{return or__138__auto____9716;
} else
{return rear__9715;
}
})()))
{return (new cljs.core.PersistentQueueSeq(null,this__9714.front,cljs.core.seq.call(null,rear__9715),null,null));
} else
{return cljs.core.List.EMPTY;
}
});
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__9717 = this;
return this__9717.count;
});
cljs.core.PersistentQueue.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = (function (coll){
var this__9718 = this;
return cljs.core._first.call(null,this__9718.front);
});
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = (function (coll){
var this__9719 = this;
if(cljs.core.truth_(this__9719.front))
{var temp__317__auto____9720 = cljs.core.next.call(null,this__9719.front);
if(cljs.core.truth_(temp__317__auto____9720))
{var f1__9721 = temp__317__auto____9720;
return (new cljs.core.PersistentQueue(this__9719.meta,(this__9719.count - 1),f1__9721,this__9719.rear,null));
} else
{return (new cljs.core.PersistentQueue(this__9719.meta,(this__9719.count - 1),cljs.core.seq.call(null,this__9719.rear),cljs.core.PersistentVector.fromArray([]),null));
}
} else
{return coll;
}
});
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = (function (coll){
var this__9722 = this;
return cljs.core.first.call(null,this__9722.front);
});
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = (function (coll){
var this__9723 = this;
return cljs.core.rest.call(null,cljs.core.seq.call(null,coll));
});
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9724 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9725 = this;
return (new cljs.core.PersistentQueue(meta,this__9725.count,this__9725.front,this__9725.rear,this__9725.__hash));
});
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9726 = this;
return this__9726.meta;
});
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9727 = this;
return cljs.core.PersistentQueue.EMPTY;
});
cljs.core.PersistentQueue;
cljs.core.PersistentQueue.EMPTY = (new cljs.core.PersistentQueue(null,0,null,cljs.core.PersistentVector.fromArray([]),0));

/**
* @constructor
*/
cljs.core.NeverEquiv = (function (){
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 1048576;
})
cljs.core.NeverEquiv.cljs$lang$type = true;
cljs.core.NeverEquiv.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.NeverEquiv");
});
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$ = true;
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (o,other){
var this__9728 = this;
return false;
});
cljs.core.NeverEquiv;
cljs.core.never_equiv = (new cljs.core.NeverEquiv());
/**
* Assumes y is a map. Returns true if x equals y, otherwise returns
* false.
*/
cljs.core.equiv_map = (function equiv_map(x,y){
return cljs.core.boolean$.call(null,((cljs.core.map_QMARK_.call(null,y))?(((cljs.core.count.call(null,x) === cljs.core.count.call(null,y)))?cljs.core.every_QMARK_.call(null,cljs.core.identity,cljs.core.map.call(null,(function (xkv){
return cljs.core._EQ_.call(null,cljs.core.get.call(null,y,cljs.core.first.call(null,xkv),cljs.core.never_equiv),cljs.core.second.call(null,xkv));
}),x)):null):null));
});
cljs.core.scan_array = (function scan_array(incr,k,array){
var len__9729 = array.length;
var i__9730 = 0;
while(true){
if((i__9730 < len__9729))
{if(cljs.core._EQ_.call(null,k,(array[i__9730])))
{return i__9730;
} else
{{
var G__9731 = (i__9730 + incr);
i__9730 = G__9731;
continue;
}
}
} else
{return null;
}
break;
}
});
cljs.core.obj_map_contains_key_QMARK_ = (function() {
var obj_map_contains_key_QMARK_ = null;
var obj_map_contains_key_QMARK___2 = (function (k,strobj){
return obj_map_contains_key_QMARK_.call(null,k,strobj,true,false);
});
var obj_map_contains_key_QMARK___4 = (function (k,strobj,true_val,false_val){
if(cljs.core.truth_((function (){var and__132__auto____9732 = goog.isString.call(null,k);
if(cljs.core.truth_(and__132__auto____9732))
{return strobj.hasOwnProperty(k);
} else
{return and__132__auto____9732;
}
})()))
{return true_val;
} else
{return false_val;
}
});
obj_map_contains_key_QMARK_ = function(k,strobj,true_val,false_val){
switch(arguments.length){
case 2:
return obj_map_contains_key_QMARK___2.call(this,k,strobj);
case 4:
return obj_map_contains_key_QMARK___4.call(this,k,strobj,true_val,false_val);
}
throw('Invalid arity: ' + arguments.length);
};
obj_map_contains_key_QMARK_.cljs$lang$arity$2 = obj_map_contains_key_QMARK___2;
obj_map_contains_key_QMARK_.cljs$lang$arity$4 = obj_map_contains_key_QMARK___4;
return obj_map_contains_key_QMARK_;
})()
;
cljs.core.obj_map_compare_keys = (function obj_map_compare_keys(a,b){
var a__9733 = cljs.core.hash.call(null,a);
var b__9734 = cljs.core.hash.call(null,b);
if((a__9733 < b__9734))
{return -1;
} else
{if((a__9733 > b__9734))
{return 1;
} else
{if("\uFDD0'else")
{return 0;
} else
{return null;
}
}
}
});
cljs.core.obj_map__GT_hash_map = (function obj_map__GT_hash_map(m,k,v){
var ks__9736 = m.keys;
var len__9737 = ks__9736.length;
var so__9738 = m.strobj;
var out__9739 = cljs.core.with_meta.call(null,cljs.core.PersistentHashMap.EMPTY,cljs.core.meta.call(null,m));
var i__9740 = 0;
var out__9741 = cljs.core.transient$.call(null,out__9739);
while(true){
if((i__9740 < len__9737))
{var k__9742 = (ks__9736[i__9740]);
{
var G__9743 = (i__9740 + 1);
var G__9744 = cljs.core.assoc_BANG_.call(null,out__9741,k__9742,(so__9738[k__9742]));
i__9740 = G__9743;
out__9741 = G__9744;
continue;
}
} else
{return cljs.core.persistent_BANG_.call(null,cljs.core.assoc_BANG_.call(null,out__9741,k,v));
}
break;
}
});

/**
* @constructor
*/
cljs.core.ObjMap = (function (meta,keys,strobj,update_count,__hash){
this.meta = meta;
this.keys = keys;
this.strobj = strobj;
this.update_count = update_count;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 2155021199;
})
cljs.core.ObjMap.cljs$lang$type = true;
cljs.core.ObjMap.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.ObjMap");
});
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = (function (coll){
var this__9749 = this;
return cljs.core.transient$.call(null,cljs.core.into.call(null,cljs.core.hash_map.call(null),coll));
});
cljs.core.ObjMap.prototype.cljs$core$IHash$ = true;
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9750 = this;
var h__2236__auto____9751 = this__9750.__hash;
if((h__2236__auto____9751 != null))
{return h__2236__auto____9751;
} else
{var h__2236__auto____9752 = cljs.core.hash_imap.call(null,coll);
this__9750.__hash = h__2236__auto____9752;
return h__2236__auto____9752;
}
});
cljs.core.ObjMap.prototype.cljs$core$ILookup$ = true;
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,k){
var this__9753 = this;
return cljs.core._lookup.call(null,coll,k,null);
});
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,k,not_found){
var this__9754 = this;
return cljs.core.obj_map_contains_key_QMARK_.call(null,k,this__9754.strobj,(this__9754.strobj[k]),not_found);
});
cljs.core.ObjMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (coll,k,v){
var this__9755 = this;
if(cljs.core.truth_(goog.isString.call(null,k)))
{var overwrite_QMARK___9756 = this__9755.strobj.hasOwnProperty(k);
if(cljs.core.truth_(overwrite_QMARK___9756))
{var new_strobj__9757 = goog.object.clone.call(null,this__9755.strobj);
(new_strobj__9757[k] = v);
return (new cljs.core.ObjMap(this__9755.meta,this__9755.keys,new_strobj__9757,(this__9755.update_count + 1),null));
} else
{if((this__9755.update_count < cljs.core.ObjMap.HASHMAP_THRESHOLD))
{var new_strobj__9758 = goog.object.clone.call(null,this__9755.strobj);
var new_keys__9759 = cljs.core.aclone.call(null,this__9755.keys);
(new_strobj__9758[k] = v);
new_keys__9759.push(k);
return (new cljs.core.ObjMap(this__9755.meta,new_keys__9759,new_strobj__9758,(this__9755.update_count + 1),null));
} else
{return cljs.core.obj_map__GT_hash_map.call(null,coll,k,v);
}
}
} else
{return cljs.core.obj_map__GT_hash_map.call(null,coll,k,v);
}
});
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (coll,k){
var this__9760 = this;
return cljs.core.obj_map_contains_key_QMARK_.call(null,k,this__9760.strobj);
});
cljs.core.ObjMap.prototype.cljs$core$IFn$ = true;
cljs.core.ObjMap.prototype.call = (function() {
var G__9780 = null;
var G__9780__2 = (function (tsym9747,k){
var this__9761 = this;
var tsym9747__9762 = this;
var coll__9763 = tsym9747__9762;
return cljs.core._lookup.call(null,coll__9763,k);
});
var G__9780__3 = (function (tsym9748,k,not_found){
var this__9764 = this;
var tsym9748__9765 = this;
var coll__9766 = tsym9748__9765;
return cljs.core._lookup.call(null,coll__9766,k,not_found);
});
G__9780 = function(tsym9748,k,not_found){
switch(arguments.length){
case 2:
return G__9780__2.call(this,tsym9748,k);
case 3:
return G__9780__3.call(this,tsym9748,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9780;
})()
;
cljs.core.ObjMap.prototype.apply = (function (tsym9745,args9746){
return tsym9745.call.apply(tsym9745,[tsym9745].concat(cljs.core.aclone.call(null,args9746)));
});
cljs.core.ObjMap.prototype.cljs$core$ICollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,entry){
var this__9767 = this;
if(cljs.core.vector_QMARK_.call(null,entry))
{return cljs.core._assoc.call(null,coll,cljs.core._nth.call(null,entry,0),cljs.core._nth.call(null,entry,1));
} else
{return cljs.core.reduce.call(null,cljs.core._conj,coll,entry);
}
});
cljs.core.ObjMap.prototype.toString = (function (){
var this__9768 = this;
var this$__9769 = this;
return cljs.core.pr_str.call(null,this$__9769);
});
cljs.core.ObjMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9770 = this;
if((this__9770.keys.length > 0))
{return cljs.core.map.call(null,(function (p1__9735_SHARP_){
return cljs.core.vector.call(null,p1__9735_SHARP_,(this__9770.strobj[p1__9735_SHARP_]));
}),this__9770.keys.sort(cljs.core.obj_map_compare_keys));
} else
{return null;
}
});
cljs.core.ObjMap.prototype.cljs$core$ICounted$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__9771 = this;
return this__9771.keys.length;
});
cljs.core.ObjMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9772 = this;
return cljs.core.equiv_map.call(null,coll,other);
});
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9773 = this;
return (new cljs.core.ObjMap(meta,this__9773.keys,this__9773.strobj,this__9773.update_count,this__9773.__hash));
});
cljs.core.ObjMap.prototype.cljs$core$IMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9774 = this;
return this__9774.meta;
});
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9775 = this;
return cljs.core.with_meta.call(null,cljs.core.ObjMap.EMPTY,this__9775.meta);
});
cljs.core.ObjMap.prototype.cljs$core$IMap$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (coll,k){
var this__9776 = this;
if(cljs.core.truth_((function (){var and__132__auto____9777 = goog.isString.call(null,k);
if(cljs.core.truth_(and__132__auto____9777))
{return this__9776.strobj.hasOwnProperty(k);
} else
{return and__132__auto____9777;
}
})()))
{var new_keys__9778 = cljs.core.aclone.call(null,this__9776.keys);
var new_strobj__9779 = goog.object.clone.call(null,this__9776.strobj);
new_keys__9778.splice(cljs.core.scan_array.call(null,1,k,new_keys__9778),1);
cljs.core.js_delete.call(null,new_strobj__9779,k);
return (new cljs.core.ObjMap(this__9776.meta,new_keys__9778,new_strobj__9779,(this__9776.update_count + 1),null));
} else
{return coll;
}
});
cljs.core.ObjMap;
cljs.core.ObjMap.EMPTY = (new cljs.core.ObjMap(null,[],{},0,0));
cljs.core.ObjMap.HASHMAP_THRESHOLD = 32;
cljs.core.ObjMap.fromObject = (function (ks,obj){
return (new cljs.core.ObjMap(null,ks,obj,0,null));
});

/**
* @constructor
*/
cljs.core.HashMap = (function (meta,count,hashobj,__hash){
this.meta = meta;
this.count = count;
this.hashobj = hashobj;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 7537551;
})
cljs.core.HashMap.cljs$lang$type = true;
cljs.core.HashMap.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.HashMap");
});
cljs.core.HashMap.prototype.cljs$core$IHash$ = true;
cljs.core.HashMap.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9786 = this;
var h__2236__auto____9787 = this__9786.__hash;
if((h__2236__auto____9787 != null))
{return h__2236__auto____9787;
} else
{var h__2236__auto____9788 = cljs.core.hash_imap.call(null,coll);
this__9786.__hash = h__2236__auto____9788;
return h__2236__auto____9788;
}
});
cljs.core.HashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,k){
var this__9789 = this;
return cljs.core._lookup.call(null,coll,k,null);
});
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,k,not_found){
var this__9790 = this;
var bucket__9791 = (this__9790.hashobj[cljs.core.hash.call(null,k)]);
var i__9792 = (cljs.core.truth_(bucket__9791)?cljs.core.scan_array.call(null,2,k,bucket__9791):null);
if(cljs.core.truth_(i__9792))
{return (bucket__9791[(i__9792 + 1)]);
} else
{return not_found;
}
});
cljs.core.HashMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (coll,k,v){
var this__9793 = this;
var h__9794 = cljs.core.hash.call(null,k);
var bucket__9795 = (this__9793.hashobj[h__9794]);
if(cljs.core.truth_(bucket__9795))
{var new_bucket__9796 = cljs.core.aclone.call(null,bucket__9795);
var new_hashobj__9797 = goog.object.clone.call(null,this__9793.hashobj);
(new_hashobj__9797[h__9794] = new_bucket__9796);
var temp__317__auto____9798 = cljs.core.scan_array.call(null,2,k,new_bucket__9796);
if(cljs.core.truth_(temp__317__auto____9798))
{var i__9799 = temp__317__auto____9798;
(new_bucket__9796[(i__9799 + 1)] = v);
return (new cljs.core.HashMap(this__9793.meta,this__9793.count,new_hashobj__9797,null));
} else
{new_bucket__9796.push(k,v);
return (new cljs.core.HashMap(this__9793.meta,(this__9793.count + 1),new_hashobj__9797,null));
}
} else
{var new_hashobj__9800 = goog.object.clone.call(null,this__9793.hashobj);
(new_hashobj__9800[h__9794] = [k,v]);
return (new cljs.core.HashMap(this__9793.meta,(this__9793.count + 1),new_hashobj__9800,null));
}
});
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (coll,k){
var this__9801 = this;
var bucket__9802 = (this__9801.hashobj[cljs.core.hash.call(null,k)]);
var i__9803 = (cljs.core.truth_(bucket__9802)?cljs.core.scan_array.call(null,2,k,bucket__9802):null);
if(cljs.core.truth_(i__9803))
{return true;
} else
{return false;
}
});
cljs.core.HashMap.prototype.cljs$core$IFn$ = true;
cljs.core.HashMap.prototype.call = (function() {
var G__9826 = null;
var G__9826__2 = (function (tsym9784,k){
var this__9804 = this;
var tsym9784__9805 = this;
var coll__9806 = tsym9784__9805;
return cljs.core._lookup.call(null,coll__9806,k);
});
var G__9826__3 = (function (tsym9785,k,not_found){
var this__9807 = this;
var tsym9785__9808 = this;
var coll__9809 = tsym9785__9808;
return cljs.core._lookup.call(null,coll__9809,k,not_found);
});
G__9826 = function(tsym9785,k,not_found){
switch(arguments.length){
case 2:
return G__9826__2.call(this,tsym9785,k);
case 3:
return G__9826__3.call(this,tsym9785,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9826;
})()
;
cljs.core.HashMap.prototype.apply = (function (tsym9782,args9783){
return tsym9782.call.apply(tsym9782,[tsym9782].concat(cljs.core.aclone.call(null,args9783)));
});
cljs.core.HashMap.prototype.cljs$core$ICollection$ = true;
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,entry){
var this__9810 = this;
if(cljs.core.vector_QMARK_.call(null,entry))
{return cljs.core._assoc.call(null,coll,cljs.core._nth.call(null,entry,0),cljs.core._nth.call(null,entry,1));
} else
{return cljs.core.reduce.call(null,cljs.core._conj,coll,entry);
}
});
cljs.core.HashMap.prototype.toString = (function (){
var this__9811 = this;
var this$__9812 = this;
return cljs.core.pr_str.call(null,this$__9812);
});
cljs.core.HashMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9813 = this;
if((this__9813.count > 0))
{var hashes__9814 = cljs.core.js_keys.call(null,this__9813.hashobj).sort();
return cljs.core.mapcat.call(null,(function (p1__9781_SHARP_){
return cljs.core.map.call(null,cljs.core.vec,cljs.core.partition.call(null,2,(this__9813.hashobj[p1__9781_SHARP_])));
}),hashes__9814);
} else
{return null;
}
});
cljs.core.HashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.HashMap.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__9815 = this;
return this__9815.count;
});
cljs.core.HashMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9816 = this;
return cljs.core.equiv_map.call(null,coll,other);
});
cljs.core.HashMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9817 = this;
return (new cljs.core.HashMap(meta,this__9817.count,this__9817.hashobj,this__9817.__hash));
});
cljs.core.HashMap.prototype.cljs$core$IMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9818 = this;
return this__9818.meta;
});
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9819 = this;
return cljs.core.with_meta.call(null,cljs.core.HashMap.EMPTY,this__9819.meta);
});
cljs.core.HashMap.prototype.cljs$core$IMap$ = true;
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (coll,k){
var this__9820 = this;
var h__9821 = cljs.core.hash.call(null,k);
var bucket__9822 = (this__9820.hashobj[h__9821]);
var i__9823 = (cljs.core.truth_(bucket__9822)?cljs.core.scan_array.call(null,2,k,bucket__9822):null);
if(cljs.core.not.call(null,i__9823))
{return coll;
} else
{var new_hashobj__9824 = goog.object.clone.call(null,this__9820.hashobj);
if((3 > bucket__9822.length))
{cljs.core.js_delete.call(null,new_hashobj__9824,h__9821);
} else
{var new_bucket__9825 = cljs.core.aclone.call(null,bucket__9822);
new_bucket__9825.splice(i__9823,2);
(new_hashobj__9824[h__9821] = new_bucket__9825);
}
return (new cljs.core.HashMap(this__9820.meta,(this__9820.count - 1),new_hashobj__9824,null));
}
});
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = (new cljs.core.HashMap(null,0,{},0));
cljs.core.HashMap.fromArrays = (function (ks,vs){
var len__9827 = ks.length;
var i__9828 = 0;
var out__9829 = cljs.core.HashMap.EMPTY;
while(true){
if((i__9828 < len__9827))
{{
var G__9830 = (i__9828 + 1);
var G__9831 = cljs.core.assoc.call(null,out__9829,(ks[i__9828]),(vs[i__9828]));
i__9828 = G__9830;
out__9829 = G__9831;
continue;
}
} else
{return out__9829;
}
break;
}
});
cljs.core.array_map_index_of = (function array_map_index_of(m,k){
var arr__9832 = m.arr;
var len__9833 = arr__9832.length;
var i__9834 = 0;
while(true){
if((len__9833 <= i__9834))
{return -1;
} else
{if(cljs.core._EQ_.call(null,(arr__9832[i__9834]),k))
{return i__9834;
} else
{if("\uFDD0'else")
{{
var G__9835 = (i__9834 + 2);
i__9834 = G__9835;
continue;
}
} else
{return null;
}
}
}
break;
}
});
void 0;

/**
* @constructor
*/
cljs.core.PersistentArrayMap = (function (meta,cnt,arr,__hash){
this.meta = meta;
this.cnt = cnt;
this.arr = arr;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 2155545487;
})
cljs.core.PersistentArrayMap.cljs$lang$type = true;
cljs.core.PersistentArrayMap.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentArrayMap");
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = (function (coll){
var this__9840 = this;
return (new cljs.core.TransientArrayMap({},this__9840.arr.length,cljs.core.aclone.call(null,this__9840.arr)));
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__9841 = this;
var h__2236__auto____9842 = this__9841.__hash;
if((h__2236__auto____9842 != null))
{return h__2236__auto____9842;
} else
{var h__2236__auto____9843 = cljs.core.hash_imap.call(null,coll);
this__9841.__hash = h__2236__auto____9843;
return h__2236__auto____9843;
}
});
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,k){
var this__9844 = this;
return cljs.core._lookup.call(null,coll,k,null);
});
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,k,not_found){
var this__9845 = this;
var idx__9846 = cljs.core.array_map_index_of.call(null,coll,k);
if((idx__9846 === -1))
{return not_found;
} else
{return (this__9845.arr[(idx__9846 + 1)]);
}
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (coll,k,v){
var this__9847 = this;
var idx__9848 = cljs.core.array_map_index_of.call(null,coll,k);
if((idx__9848 === -1))
{if((this__9847.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD))
{return (new cljs.core.PersistentArrayMap(this__9847.meta,(this__9847.cnt + 1),(function (){var G__9849__9850 = cljs.core.aclone.call(null,this__9847.arr);
G__9849__9850.push(k);
G__9849__9850.push(v);
return G__9849__9850;
})(),null));
} else
{return cljs.core.persistent_BANG_.call(null,cljs.core.assoc_BANG_.call(null,cljs.core.transient$.call(null,cljs.core.into.call(null,cljs.core.PersistentHashMap.EMPTY,coll)),k,v));
}
} else
{if((v === (this__9847.arr[(idx__9848 + 1)])))
{return coll;
} else
{if("\uFDD0'else")
{return (new cljs.core.PersistentArrayMap(this__9847.meta,this__9847.cnt,(function (){var G__9851__9852 = cljs.core.aclone.call(null,this__9847.arr);
(G__9851__9852[(idx__9848 + 1)] = v);
return G__9851__9852;
})(),null));
} else
{return null;
}
}
}
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (coll,k){
var this__9853 = this;
return (cljs.core.array_map_index_of.call(null,coll,k) != -1);
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentArrayMap.prototype.call = (function() {
var G__9883 = null;
var G__9883__2 = (function (tsym9838,k){
var this__9854 = this;
var tsym9838__9855 = this;
var coll__9856 = tsym9838__9855;
return cljs.core._lookup.call(null,coll__9856,k);
});
var G__9883__3 = (function (tsym9839,k,not_found){
var this__9857 = this;
var tsym9839__9858 = this;
var coll__9859 = tsym9839__9858;
return cljs.core._lookup.call(null,coll__9859,k,not_found);
});
G__9883 = function(tsym9839,k,not_found){
switch(arguments.length){
case 2:
return G__9883__2.call(this,tsym9839,k);
case 3:
return G__9883__3.call(this,tsym9839,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__9883;
})()
;
cljs.core.PersistentArrayMap.prototype.apply = (function (tsym9836,args9837){
return tsym9836.call.apply(tsym9836,[tsym9836].concat(cljs.core.aclone.call(null,args9837)));
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (coll,f,init){
var this__9860 = this;
var len__9861 = this__9860.arr.length;
var i__9862 = 0;
var init__9863 = init;
while(true){
if((i__9862 < len__9861))
{var init__9864 = f.call(null,init__9863,(this__9860.arr[i__9862]),(this__9860.arr[(i__9862 + 1)]));
if(cljs.core.reduced_QMARK_.call(null,init__9864))
{return cljs.core.deref.call(null,init__9864);
} else
{{
var G__9884 = (i__9862 + 2);
var G__9885 = init__9864;
i__9862 = G__9884;
init__9863 = G__9885;
continue;
}
}
} else
{return null;
}
break;
}
});
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,entry){
var this__9865 = this;
if(cljs.core.vector_QMARK_.call(null,entry))
{return cljs.core._assoc.call(null,coll,cljs.core._nth.call(null,entry,0),cljs.core._nth.call(null,entry,1));
} else
{return cljs.core.reduce.call(null,cljs.core._conj,coll,entry);
}
});
cljs.core.PersistentArrayMap.prototype.toString = (function (){
var this__9866 = this;
var this$__9867 = this;
return cljs.core.pr_str.call(null,this$__9867);
});
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__9868 = this;
if((this__9868.cnt > 0))
{var len__9869 = this__9868.arr.length;
var array_map_seq__9870 = (function array_map_seq(i){
return (new cljs.core.LazySeq(null,false,(function (){
if((i < len__9869))
{return cljs.core.cons.call(null,cljs.core.PersistentVector.fromArray([(this__9868.arr[i]),(this__9868.arr[(i + 1)])]),array_map_seq.call(null,(i + 2)));
} else
{return null;
}
})));
});
return array_map_seq__9870.call(null,0);
} else
{return null;
}
});
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__9871 = this;
return this__9871.cnt;
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__9872 = this;
return cljs.core.equiv_map.call(null,coll,other);
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__9873 = this;
return (new cljs.core.PersistentArrayMap(meta,this__9873.cnt,this__9873.arr,this__9873.__hash));
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__9874 = this;
return this__9874.meta;
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__9875 = this;
return cljs.core._with_meta.call(null,cljs.core.PersistentArrayMap.EMPTY,this__9875.meta);
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (coll,k){
var this__9876 = this;
var idx__9877 = cljs.core.array_map_index_of.call(null,coll,k);
if((idx__9877 >= 0))
{var len__9878 = this__9876.arr.length;
var new_len__9879 = (len__9878 - 2);
if((new_len__9879 === 0))
{return cljs.core._empty.call(null,coll);
} else
{var new_arr__9880 = cljs.core.make_array.call(null,new_len__9879);
var s__9881 = 0;
var d__9882 = 0;
while(true){
if((s__9881 >= len__9878))
{return (new cljs.core.PersistentArrayMap(this__9876.meta,(this__9876.cnt - 1),new_arr__9880,null));
} else
{if(cljs.core._EQ_.call(null,k,(this__9876.arr[s__9881])))
{{
var G__9886 = (s__9881 + 2);
var G__9887 = d__9882;
s__9881 = G__9886;
d__9882 = G__9887;
continue;
}
} else
{if("\uFDD0'else")
{(new_arr__9880[d__9882] = (this__9876.arr[s__9881]));
(new_arr__9880[(d__9882 + 1)] = (this__9876.arr[(s__9881 + 1)]));
{
var G__9888 = (s__9881 + 2);
var G__9889 = (d__9882 + 2);
s__9881 = G__9888;
d__9882 = G__9889;
continue;
}
} else
{return null;
}
}
}
break;
}
}
} else
{return coll;
}
});
cljs.core.PersistentArrayMap;
cljs.core.PersistentArrayMap.EMPTY = (new cljs.core.PersistentArrayMap(null,0,[],null));
cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD = 16;
cljs.core.PersistentArrayMap.fromArrays = (function (ks,vs){
var len__9890 = cljs.core.count.call(null,ks);
var i__9891 = 0;
var out__9892 = cljs.core.transient$.call(null,cljs.core.PersistentArrayMap.EMPTY);
while(true){
if((i__9891 < len__9890))
{{
var G__9893 = (i__9891 + 1);
var G__9894 = cljs.core.assoc_BANG_.call(null,out__9892,(ks[i__9891]),(vs[i__9891]));
i__9891 = G__9893;
out__9892 = G__9894;
continue;
}
} else
{return cljs.core.persistent_BANG_.call(null,out__9892);
}
break;
}
});
void 0;

/**
* @constructor
*/
cljs.core.TransientArrayMap = (function (editable_QMARK_,len,arr){
this.editable_QMARK_ = editable_QMARK_;
this.len = len;
this.arr = arr;
this.cljs$lang$protocol_mask$partition1$ = 7;
this.cljs$lang$protocol_mask$partition0$ = 130;
})
cljs.core.TransientArrayMap.cljs$lang$type = true;
cljs.core.TransientArrayMap.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.TransientArrayMap");
});
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = (function (tcoll,key){
var this__9895 = this;
if(cljs.core.truth_(this__9895.editable_QMARK_))
{var idx__9896 = cljs.core.array_map_index_of.call(null,tcoll,key);
if((idx__9896 >= 0))
{(this__9895.arr[idx__9896] = (this__9895.arr[(this__9895.len - 2)]));
(this__9895.arr[(idx__9896 + 1)] = (this__9895.arr[(this__9895.len - 1)]));
var G__9897__9898 = this__9895.arr;
G__9897__9898.pop();
G__9897__9898.pop();
G__9897__9898;
this__9895.len = (this__9895.len - 2);
} else
{}
return tcoll;
} else
{throw (new Error("dissoc! after persistent!"));
}
});
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = (function (tcoll,key,val){
var this__9899 = this;
if(cljs.core.truth_(this__9899.editable_QMARK_))
{var idx__9900 = cljs.core.array_map_index_of.call(null,tcoll,key);
if((idx__9900 === -1))
{if(((this__9899.len + 2) <= (2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD)))
{this__9899.len = (this__9899.len + 2);
this__9899.arr.push(key);
this__9899.arr.push(val);
return tcoll;
} else
{return cljs.core.assoc_BANG_.call(null,cljs.core.array__GT_transient_hash_map.call(null,this__9899.len,this__9899.arr),key,val);
}
} else
{if((val === (this__9899.arr[(idx__9900 + 1)])))
{return tcoll;
} else
{(this__9899.arr[(idx__9900 + 1)] = val);
return tcoll;
}
}
} else
{throw (new Error("assoc! after persistent!"));
}
});
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = (function (tcoll,o){
var this__9901 = this;
if(cljs.core.truth_(this__9901.editable_QMARK_))
{if((function (){var G__9902__9903 = o;
if((G__9902__9903 != null))
{if((function (){var or__138__auto____9904 = (G__9902__9903.cljs$lang$protocol_mask$partition0$ & 1024);
if(or__138__auto____9904)
{return or__138__auto____9904;
} else
{return G__9902__9903.cljs$core$IMapEntry$;
}
})())
{return true;
} else
{if((!G__9902__9903.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IMapEntry,G__9902__9903);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IMapEntry,G__9902__9903);
}
})())
{return cljs.core._assoc_BANG_.call(null,tcoll,cljs.core.key.call(null,o),cljs.core.val.call(null,o));
} else
{var es__9905 = cljs.core.seq.call(null,o);
var tcoll__9906 = tcoll;
while(true){
var temp__317__auto____9907 = cljs.core.first.call(null,es__9905);
if(cljs.core.truth_(temp__317__auto____9907))
{var e__9908 = temp__317__auto____9907;
{
var G__9914 = cljs.core.next.call(null,es__9905);
var G__9915 = cljs.core._assoc_BANG_.call(null,tcoll__9906,cljs.core.key.call(null,e__9908),cljs.core.val.call(null,e__9908));
es__9905 = G__9914;
tcoll__9906 = G__9915;
continue;
}
} else
{return tcoll__9906;
}
break;
}
}
} else
{throw (new Error("conj! after persistent!"));
}
});
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = (function (tcoll){
var this__9909 = this;
if(cljs.core.truth_(this__9909.editable_QMARK_))
{this__9909.editable_QMARK_ = false;
return (new cljs.core.PersistentArrayMap(null,cljs.core.quot.call(null,this__9909.len,2),this__9909.arr,null));
} else
{throw (new Error("persistent! called twice"));
}
});
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (tcoll,k){
var this__9910 = this;
return cljs.core._lookup.call(null,tcoll,k,null);
});
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (tcoll,k,not_found){
var this__9911 = this;
if(cljs.core.truth_(this__9911.editable_QMARK_))
{var idx__9912 = cljs.core.array_map_index_of.call(null,tcoll,k);
if((idx__9912 === -1))
{return not_found;
} else
{return (this__9911.arr[(idx__9912 + 1)]);
}
} else
{throw (new Error("lookup after persistent!"));
}
});
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = (function (tcoll){
var this__9913 = this;
if(cljs.core.truth_(this__9913.editable_QMARK_))
{return cljs.core.quot.call(null,this__9913.len,2);
} else
{throw (new Error("count after persistent!"));
}
});
cljs.core.TransientArrayMap;
void 0;
cljs.core.array__GT_transient_hash_map = (function array__GT_transient_hash_map(len,arr){
var out__9916 = cljs.core.transient$.call(null,cljs.core.ObjMap.fromObject([],{}));
var i__9917 = 0;
while(true){
if((i__9917 < len))
{{
var G__9918 = cljs.core.assoc_BANG_.call(null,out__9916,(arr[i__9917]),(arr[(i__9917 + 1)]));
var G__9919 = (i__9917 + 2);
out__9916 = G__9918;
i__9917 = G__9919;
continue;
}
} else
{return out__9916;
}
break;
}
});
void 0;
void 0;
void 0;
void 0;
void 0;
void 0;
cljs.core.mask = (function mask(hash,shift){
return ((hash >>> shift) & 31);
});
cljs.core.clone_and_set = (function() {
var clone_and_set = null;
var clone_and_set__3 = (function (arr,i,a){
var G__9920__9921 = cljs.core.aclone.call(null,arr);
(G__9920__9921[i] = a);
return G__9920__9921;
});
var clone_and_set__5 = (function (arr,i,a,j,b){
var G__9922__9923 = cljs.core.aclone.call(null,arr);
(G__9922__9923[i] = a);
(G__9922__9923[j] = b);
return G__9922__9923;
});
clone_and_set = function(arr,i,a,j,b){
switch(arguments.length){
case 3:
return clone_and_set__3.call(this,arr,i,a);
case 5:
return clone_and_set__5.call(this,arr,i,a,j,b);
}
throw('Invalid arity: ' + arguments.length);
};
clone_and_set.cljs$lang$arity$3 = clone_and_set__3;
clone_and_set.cljs$lang$arity$5 = clone_and_set__5;
return clone_and_set;
})()
;
cljs.core.remove_pair = (function remove_pair(arr,i){
var new_arr__9924 = cljs.core.make_array.call(null,(arr.length - 2));
cljs.core.array_copy.call(null,arr,0,new_arr__9924,0,(2 * i));
cljs.core.array_copy.call(null,arr,(2 * (i + 1)),new_arr__9924,(2 * i),(new_arr__9924.length - (2 * i)));
return new_arr__9924;
});
cljs.core.bitmap_indexed_node_index = (function bitmap_indexed_node_index(bitmap,bit){
return cljs.core.bit_count.call(null,(bitmap & (bit - 1)));
});
cljs.core.bitpos = (function bitpos(hash,shift){
return (1 << ((hash >>> shift) & 0x01f));
});
cljs.core.edit_and_set = (function() {
var edit_and_set = null;
var edit_and_set__4 = (function (inode,edit,i,a){
var editable__9925 = inode.ensure_editable(edit);
(editable__9925.arr[i] = a);
return editable__9925;
});
var edit_and_set__6 = (function (inode,edit,i,a,j,b){
var editable__9926 = inode.ensure_editable(edit);
(editable__9926.arr[i] = a);
(editable__9926.arr[j] = b);
return editable__9926;
});
edit_and_set = function(inode,edit,i,a,j,b){
switch(arguments.length){
case 4:
return edit_and_set__4.call(this,inode,edit,i,a);
case 6:
return edit_and_set__6.call(this,inode,edit,i,a,j,b);
}
throw('Invalid arity: ' + arguments.length);
};
edit_and_set.cljs$lang$arity$4 = edit_and_set__4;
edit_and_set.cljs$lang$arity$6 = edit_and_set__6;
return edit_and_set;
})()
;
cljs.core.inode_kv_reduce = (function inode_kv_reduce(arr,f,init){
var len__9927 = arr.length;
var i__9928 = 0;
var init__9929 = init;
while(true){
if((i__9928 < len__9927))
{var init__9932 = (function (){var k__9930 = (arr[i__9928]);
if((k__9930 != null))
{return f.call(null,init__9929,k__9930,(arr[(i__9928 + 1)]));
} else
{var node__9931 = (arr[(i__9928 + 1)]);
if((node__9931 != null))
{return node__9931.kv_reduce(f,init__9929);
} else
{return init__9929;
}
}
})();
if(cljs.core.reduced_QMARK_.call(null,init__9932))
{return cljs.core.deref.call(null,init__9932);
} else
{{
var G__9933 = (i__9928 + 2);
var G__9934 = init__9932;
i__9928 = G__9933;
init__9929 = G__9934;
continue;
}
}
} else
{return init__9929;
}
break;
}
});
void 0;

/**
* @constructor
*/
cljs.core.BitmapIndexedNode = (function (edit,bitmap,arr){
this.edit = edit;
this.bitmap = bitmap;
this.arr = arr;
})
cljs.core.BitmapIndexedNode.cljs$lang$type = true;
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.BitmapIndexedNode");
});
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = (function (e,bit,i){
var this__9935 = this;
var inode__9936 = this;
if((this__9935.bitmap === bit))
{return null;
} else
{var editable__9937 = inode__9936.ensure_editable(e);
var earr__9938 = editable__9937.arr;
var len__9939 = earr__9938.length;
editable__9937.bitmap = (bit ^ editable__9937.bitmap);
cljs.core.array_copy.call(null,earr__9938,(2 * (i + 1)),earr__9938,(2 * i),(len__9939 - (2 * (i + 1))));
(earr__9938[(len__9939 - 2)] = null);
(earr__9938[(len__9939 - 1)] = null);
return editable__9937;
}
});
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = (function (edit,shift,hash,key,val,added_leaf_QMARK_){
var this__9940 = this;
var inode__9941 = this;
var bit__9942 = (1 << ((hash >>> shift) & 0x01f));
var idx__9943 = cljs.core.bitmap_indexed_node_index.call(null,this__9940.bitmap,bit__9942);
if(((this__9940.bitmap & bit__9942) === 0))
{var n__9944 = cljs.core.bit_count.call(null,this__9940.bitmap);
if(((2 * n__9944) < this__9940.arr.length))
{var editable__9945 = inode__9941.ensure_editable(edit);
var earr__9946 = editable__9945.arr;
(added_leaf_QMARK_[0] = true);
cljs.core.array_copy_downward.call(null,earr__9946,(2 * idx__9943),earr__9946,(2 * (idx__9943 + 1)),(2 * (n__9944 - idx__9943)));
(earr__9946[(2 * idx__9943)] = key);
(earr__9946[((2 * idx__9943) + 1)] = val);
editable__9945.bitmap = (editable__9945.bitmap | bit__9942);
return editable__9945;
} else
{if((n__9944 >= 16))
{var nodes__9947 = cljs.core.make_array.call(null,32);
var jdx__9948 = ((hash >>> shift) & 0x01f);
(nodes__9947[jdx__9948] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit,(shift + 5),hash,key,val,added_leaf_QMARK_));
var i__9949 = 0;
var j__9950 = 0;
while(true){
if((i__9949 < 32))
{if((((this__9940.bitmap >>> i__9949) & 1) === 0))
{{
var G__10003 = (i__9949 + 1);
var G__10004 = j__9950;
i__9949 = G__10003;
j__9950 = G__10004;
continue;
}
} else
{(nodes__9947[i__9949] = (((null != (this__9940.arr[j__9950])))?cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit,(shift + 5),cljs.core.hash.call(null,(this__9940.arr[j__9950])),(this__9940.arr[j__9950]),(this__9940.arr[(j__9950 + 1)]),added_leaf_QMARK_):(this__9940.arr[(j__9950 + 1)])));
{
var G__10005 = (i__9949 + 1);
var G__10006 = (j__9950 + 2);
i__9949 = G__10005;
j__9950 = G__10006;
continue;
}
}
} else
{}
break;
}
return (new cljs.core.ArrayNode(edit,(n__9944 + 1),nodes__9947));
} else
{if("\uFDD0'else")
{var new_arr__9951 = cljs.core.make_array.call(null,(2 * (n__9944 + 4)));
cljs.core.array_copy.call(null,this__9940.arr,0,new_arr__9951,0,(2 * idx__9943));
(new_arr__9951[(2 * idx__9943)] = key);
(added_leaf_QMARK_[0] = true);
(new_arr__9951[((2 * idx__9943) + 1)] = val);
cljs.core.array_copy.call(null,this__9940.arr,(2 * idx__9943),new_arr__9951,(2 * (idx__9943 + 1)),(2 * (n__9944 - idx__9943)));
var editable__9952 = inode__9941.ensure_editable(edit);
editable__9952.arr = new_arr__9951;
editable__9952.bitmap = (editable__9952.bitmap | bit__9942);
return editable__9952;
} else
{return null;
}
}
}
} else
{var key_or_nil__9953 = (this__9940.arr[(2 * idx__9943)]);
var val_or_node__9954 = (this__9940.arr[((2 * idx__9943) + 1)]);
if((null == key_or_nil__9953))
{var n__9955 = val_or_node__9954.inode_assoc_BANG_(edit,(shift + 5),hash,key,val,added_leaf_QMARK_);
if((n__9955 === val_or_node__9954))
{return inode__9941;
} else
{return cljs.core.edit_and_set.call(null,inode__9941,edit,((2 * idx__9943) + 1),n__9955);
}
} else
{if(cljs.core._EQ_.call(null,key,key_or_nil__9953))
{if((val === val_or_node__9954))
{return inode__9941;
} else
{return cljs.core.edit_and_set.call(null,inode__9941,edit,((2 * idx__9943) + 1),val);
}
} else
{if("\uFDD0'else")
{(added_leaf_QMARK_[0] = true);
return cljs.core.edit_and_set.call(null,inode__9941,edit,(2 * idx__9943),null,((2 * idx__9943) + 1),cljs.core.create_node.call(null,edit,(shift + 5),key_or_nil__9953,val_or_node__9954,hash,key,val));
} else
{return null;
}
}
}
}
});
cljs.core.BitmapIndexedNode.prototype.inode_seq = (function (){
var this__9956 = this;
var inode__9957 = this;
return cljs.core.create_inode_seq.call(null,this__9956.arr);
});
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = (function (edit,shift,hash,key,removed_leaf_QMARK_){
var this__9958 = this;
var inode__9959 = this;
var bit__9960 = (1 << ((hash >>> shift) & 0x01f));
if(((this__9958.bitmap & bit__9960) === 0))
{return inode__9959;
} else
{var idx__9961 = cljs.core.bitmap_indexed_node_index.call(null,this__9958.bitmap,bit__9960);
var key_or_nil__9962 = (this__9958.arr[(2 * idx__9961)]);
var val_or_node__9963 = (this__9958.arr[((2 * idx__9961) + 1)]);
if((null == key_or_nil__9962))
{var n__9964 = val_or_node__9963.inode_without_BANG_(edit,(shift + 5),hash,key,removed_leaf_QMARK_);
if((n__9964 === val_or_node__9963))
{return inode__9959;
} else
{if((null != n__9964))
{return cljs.core.edit_and_set.call(null,inode__9959,edit,((2 * idx__9961) + 1),n__9964);
} else
{if((this__9958.bitmap === bit__9960))
{return null;
} else
{if("\uFDD0'else")
{return inode__9959.edit_and_remove_pair(edit,bit__9960,idx__9961);
} else
{return null;
}
}
}
}
} else
{if(cljs.core._EQ_.call(null,key,key_or_nil__9962))
{(removed_leaf_QMARK_[0] = true);
return inode__9959.edit_and_remove_pair(edit,bit__9960,idx__9961);
} else
{if("\uFDD0'else")
{return inode__9959;
} else
{return null;
}
}
}
}
});
cljs.core.BitmapIndexedNode.prototype.ensure_editable = (function (e){
var this__9965 = this;
var inode__9966 = this;
if((e === this__9965.edit))
{return inode__9966;
} else
{var n__9967 = cljs.core.bit_count.call(null,this__9965.bitmap);
var new_arr__9968 = cljs.core.make_array.call(null,(((n__9967 < 0))?4:(2 * (n__9967 + 1))));
cljs.core.array_copy.call(null,this__9965.arr,0,new_arr__9968,0,(2 * n__9967));
return (new cljs.core.BitmapIndexedNode(e,this__9965.bitmap,new_arr__9968));
}
});
cljs.core.BitmapIndexedNode.prototype.kv_reduce = (function (f,init){
var this__9969 = this;
var inode__9970 = this;
return cljs.core.inode_kv_reduce.call(null,this__9969.arr,f,init);
});
cljs.core.BitmapIndexedNode.prototype.inode_find = (function() {
var G__10007 = null;
var G__10007__3 = (function (shift,hash,key){
var this__9971 = this;
var inode__9972 = this;
var bit__9973 = (1 << ((hash >>> shift) & 0x01f));
if(((this__9971.bitmap & bit__9973) === 0))
{return null;
} else
{var idx__9974 = cljs.core.bitmap_indexed_node_index.call(null,this__9971.bitmap,bit__9973);
var key_or_nil__9975 = (this__9971.arr[(2 * idx__9974)]);
var val_or_node__9976 = (this__9971.arr[((2 * idx__9974) + 1)]);
if((null == key_or_nil__9975))
{return val_or_node__9976.inode_find((shift + 5),hash,key);
} else
{if(cljs.core._EQ_.call(null,key,key_or_nil__9975))
{return cljs.core.PersistentVector.fromArray([key_or_nil__9975,val_or_node__9976]);
} else
{if("\uFDD0'else")
{return null;
} else
{return null;
}
}
}
}
});
var G__10007__4 = (function (shift,hash,key,not_found){
var this__9977 = this;
var inode__9978 = this;
var bit__9979 = (1 << ((hash >>> shift) & 0x01f));
if(((this__9977.bitmap & bit__9979) === 0))
{return not_found;
} else
{var idx__9980 = cljs.core.bitmap_indexed_node_index.call(null,this__9977.bitmap,bit__9979);
var key_or_nil__9981 = (this__9977.arr[(2 * idx__9980)]);
var val_or_node__9982 = (this__9977.arr[((2 * idx__9980) + 1)]);
if((null == key_or_nil__9981))
{return val_or_node__9982.inode_find((shift + 5),hash,key,not_found);
} else
{if(cljs.core._EQ_.call(null,key,key_or_nil__9981))
{return cljs.core.PersistentVector.fromArray([key_or_nil__9981,val_or_node__9982]);
} else
{if("\uFDD0'else")
{return not_found;
} else
{return null;
}
}
}
}
});
G__10007 = function(shift,hash,key,not_found){
switch(arguments.length){
case 3:
return G__10007__3.call(this,shift,hash,key);
case 4:
return G__10007__4.call(this,shift,hash,key,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10007;
})()
;
cljs.core.BitmapIndexedNode.prototype.inode_without = (function (shift,hash,key){
var this__9983 = this;
var inode__9984 = this;
var bit__9985 = (1 << ((hash >>> shift) & 0x01f));
if(((this__9983.bitmap & bit__9985) === 0))
{return inode__9984;
} else
{var idx__9986 = cljs.core.bitmap_indexed_node_index.call(null,this__9983.bitmap,bit__9985);
var key_or_nil__9987 = (this__9983.arr[(2 * idx__9986)]);
var val_or_node__9988 = (this__9983.arr[((2 * idx__9986) + 1)]);
if((null == key_or_nil__9987))
{var n__9989 = val_or_node__9988.inode_without((shift + 5),hash,key);
if((n__9989 === val_or_node__9988))
{return inode__9984;
} else
{if((null != n__9989))
{return (new cljs.core.BitmapIndexedNode(null,this__9983.bitmap,cljs.core.clone_and_set.call(null,this__9983.arr,((2 * idx__9986) + 1),n__9989)));
} else
{if((this__9983.bitmap === bit__9985))
{return null;
} else
{if("\uFDD0'else")
{return (new cljs.core.BitmapIndexedNode(null,(this__9983.bitmap ^ bit__9985),cljs.core.remove_pair.call(null,this__9983.arr,idx__9986)));
} else
{return null;
}
}
}
}
} else
{if(cljs.core._EQ_.call(null,key,key_or_nil__9987))
{return (new cljs.core.BitmapIndexedNode(null,(this__9983.bitmap ^ bit__9985),cljs.core.remove_pair.call(null,this__9983.arr,idx__9986)));
} else
{if("\uFDD0'else")
{return inode__9984;
} else
{return null;
}
}
}
}
});
cljs.core.BitmapIndexedNode.prototype.inode_assoc = (function (shift,hash,key,val,added_leaf_QMARK_){
var this__9990 = this;
var inode__9991 = this;
var bit__9992 = (1 << ((hash >>> shift) & 0x01f));
var idx__9993 = cljs.core.bitmap_indexed_node_index.call(null,this__9990.bitmap,bit__9992);
if(((this__9990.bitmap & bit__9992) === 0))
{var n__9994 = cljs.core.bit_count.call(null,this__9990.bitmap);
if((n__9994 >= 16))
{var nodes__9995 = cljs.core.make_array.call(null,32);
var jdx__9996 = ((hash >>> shift) & 0x01f);
(nodes__9995[jdx__9996] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc((shift + 5),hash,key,val,added_leaf_QMARK_));
var i__9997 = 0;
var j__9998 = 0;
while(true){
if((i__9997 < 32))
{if((((this__9990.bitmap >>> i__9997) & 1) === 0))
{{
var G__10008 = (i__9997 + 1);
var G__10009 = j__9998;
i__9997 = G__10008;
j__9998 = G__10009;
continue;
}
} else
{(nodes__9995[i__9997] = (((null != (this__9990.arr[j__9998])))?cljs.core.BitmapIndexedNode.EMPTY.inode_assoc((shift + 5),cljs.core.hash.call(null,(this__9990.arr[j__9998])),(this__9990.arr[j__9998]),(this__9990.arr[(j__9998 + 1)]),added_leaf_QMARK_):(this__9990.arr[(j__9998 + 1)])));
{
var G__10010 = (i__9997 + 1);
var G__10011 = (j__9998 + 2);
i__9997 = G__10010;
j__9998 = G__10011;
continue;
}
}
} else
{}
break;
}
return (new cljs.core.ArrayNode(null,(n__9994 + 1),nodes__9995));
} else
{var new_arr__9999 = cljs.core.make_array.call(null,(2 * (n__9994 + 1)));
cljs.core.array_copy.call(null,this__9990.arr,0,new_arr__9999,0,(2 * idx__9993));
(new_arr__9999[(2 * idx__9993)] = key);
(added_leaf_QMARK_[0] = true);
(new_arr__9999[((2 * idx__9993) + 1)] = val);
cljs.core.array_copy.call(null,this__9990.arr,(2 * idx__9993),new_arr__9999,(2 * (idx__9993 + 1)),(2 * (n__9994 - idx__9993)));
return (new cljs.core.BitmapIndexedNode(null,(this__9990.bitmap | bit__9992),new_arr__9999));
}
} else
{var key_or_nil__10000 = (this__9990.arr[(2 * idx__9993)]);
var val_or_node__10001 = (this__9990.arr[((2 * idx__9993) + 1)]);
if((null == key_or_nil__10000))
{var n__10002 = val_or_node__10001.inode_assoc((shift + 5),hash,key,val,added_leaf_QMARK_);
if((n__10002 === val_or_node__10001))
{return inode__9991;
} else
{return (new cljs.core.BitmapIndexedNode(null,this__9990.bitmap,cljs.core.clone_and_set.call(null,this__9990.arr,((2 * idx__9993) + 1),n__10002)));
}
} else
{if(cljs.core._EQ_.call(null,key,key_or_nil__10000))
{if((val === val_or_node__10001))
{return inode__9991;
} else
{return (new cljs.core.BitmapIndexedNode(null,this__9990.bitmap,cljs.core.clone_and_set.call(null,this__9990.arr,((2 * idx__9993) + 1),val)));
}
} else
{if("\uFDD0'else")
{(added_leaf_QMARK_[0] = true);
return (new cljs.core.BitmapIndexedNode(null,this__9990.bitmap,cljs.core.clone_and_set.call(null,this__9990.arr,(2 * idx__9993),null,((2 * idx__9993) + 1),cljs.core.create_node.call(null,(shift + 5),key_or_nil__10000,val_or_node__10001,hash,key,val))));
} else
{return null;
}
}
}
}
});
cljs.core.BitmapIndexedNode;
cljs.core.BitmapIndexedNode.EMPTY = (new cljs.core.BitmapIndexedNode(null,0,cljs.core.make_array.call(null,0)));
cljs.core.pack_array_node = (function pack_array_node(array_node,edit,idx){
var arr__10012 = array_node.arr;
var len__10013 = (2 * (array_node.cnt - 1));
var new_arr__10014 = cljs.core.make_array.call(null,len__10013);
var i__10015 = 0;
var j__10016 = 1;
var bitmap__10017 = 0;
while(true){
if((i__10015 < len__10013))
{if((function (){var and__132__auto____10018 = (i__10015 != idx);
if(and__132__auto____10018)
{return (null != (arr__10012[i__10015]));
} else
{return and__132__auto____10018;
}
})())
{(new_arr__10014[j__10016] = (arr__10012[i__10015]));
{
var G__10019 = (i__10015 + 1);
var G__10020 = (j__10016 + 2);
var G__10021 = (bitmap__10017 | (1 << i__10015));
i__10015 = G__10019;
j__10016 = G__10020;
bitmap__10017 = G__10021;
continue;
}
} else
{{
var G__10022 = (i__10015 + 1);
var G__10023 = j__10016;
var G__10024 = bitmap__10017;
i__10015 = G__10022;
j__10016 = G__10023;
bitmap__10017 = G__10024;
continue;
}
}
} else
{return (new cljs.core.BitmapIndexedNode(edit,bitmap__10017,new_arr__10014));
}
break;
}
});

/**
* @constructor
*/
cljs.core.ArrayNode = (function (edit,cnt,arr){
this.edit = edit;
this.cnt = cnt;
this.arr = arr;
})
cljs.core.ArrayNode.cljs$lang$type = true;
cljs.core.ArrayNode.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.ArrayNode");
});
cljs.core.ArrayNode.prototype.inode_assoc = (function (shift,hash,key,val,added_leaf_QMARK_){
var this__10025 = this;
var inode__10026 = this;
var idx__10027 = ((hash >>> shift) & 0x01f);
var node__10028 = (this__10025.arr[idx__10027]);
if((null == node__10028))
{return (new cljs.core.ArrayNode(null,(this__10025.cnt + 1),cljs.core.clone_and_set.call(null,this__10025.arr,idx__10027,cljs.core.BitmapIndexedNode.EMPTY.inode_assoc((shift + 5),hash,key,val,added_leaf_QMARK_))));
} else
{var n__10029 = node__10028.inode_assoc((shift + 5),hash,key,val,added_leaf_QMARK_);
if((n__10029 === node__10028))
{return inode__10026;
} else
{return (new cljs.core.ArrayNode(null,this__10025.cnt,cljs.core.clone_and_set.call(null,this__10025.arr,idx__10027,n__10029)));
}
}
});
cljs.core.ArrayNode.prototype.inode_without = (function (shift,hash,key){
var this__10030 = this;
var inode__10031 = this;
var idx__10032 = ((hash >>> shift) & 0x01f);
var node__10033 = (this__10030.arr[idx__10032]);
if((null != node__10033))
{var n__10034 = node__10033.inode_without((shift + 5),hash,key);
if((n__10034 === node__10033))
{return inode__10031;
} else
{if((n__10034 == null))
{if((this__10030.cnt <= 8))
{return cljs.core.pack_array_node.call(null,inode__10031,null,idx__10032);
} else
{return (new cljs.core.ArrayNode(null,(this__10030.cnt - 1),cljs.core.clone_and_set.call(null,this__10030.arr,idx__10032,n__10034)));
}
} else
{if("\uFDD0'else")
{return (new cljs.core.ArrayNode(null,this__10030.cnt,cljs.core.clone_and_set.call(null,this__10030.arr,idx__10032,n__10034)));
} else
{return null;
}
}
}
} else
{return inode__10031;
}
});
cljs.core.ArrayNode.prototype.inode_find = (function() {
var G__10066 = null;
var G__10066__3 = (function (shift,hash,key){
var this__10035 = this;
var inode__10036 = this;
var idx__10037 = ((hash >>> shift) & 0x01f);
var node__10038 = (this__10035.arr[idx__10037]);
if((null != node__10038))
{return node__10038.inode_find((shift + 5),hash,key);
} else
{return null;
}
});
var G__10066__4 = (function (shift,hash,key,not_found){
var this__10039 = this;
var inode__10040 = this;
var idx__10041 = ((hash >>> shift) & 0x01f);
var node__10042 = (this__10039.arr[idx__10041]);
if((null != node__10042))
{return node__10042.inode_find((shift + 5),hash,key,not_found);
} else
{return not_found;
}
});
G__10066 = function(shift,hash,key,not_found){
switch(arguments.length){
case 3:
return G__10066__3.call(this,shift,hash,key);
case 4:
return G__10066__4.call(this,shift,hash,key,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10066;
})()
;
cljs.core.ArrayNode.prototype.inode_seq = (function (){
var this__10043 = this;
var inode__10044 = this;
return cljs.core.create_array_node_seq.call(null,this__10043.arr);
});
cljs.core.ArrayNode.prototype.ensure_editable = (function (e){
var this__10045 = this;
var inode__10046 = this;
if((e === this__10045.edit))
{return inode__10046;
} else
{return (new cljs.core.ArrayNode(e,this__10045.cnt,cljs.core.aclone.call(null,this__10045.arr)));
}
});
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = (function (edit,shift,hash,key,val,added_leaf_QMARK_){
var this__10047 = this;
var inode__10048 = this;
var idx__10049 = ((hash >>> shift) & 0x01f);
var node__10050 = (this__10047.arr[idx__10049]);
if((null == node__10050))
{var editable__10051 = cljs.core.edit_and_set.call(null,inode__10048,edit,idx__10049,cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit,(shift + 5),hash,key,val,added_leaf_QMARK_));
editable__10051.cnt = (editable__10051.cnt + 1);
return editable__10051;
} else
{var n__10052 = node__10050.inode_assoc_BANG_(edit,(shift + 5),hash,key,val,added_leaf_QMARK_);
if((n__10052 === node__10050))
{return inode__10048;
} else
{return cljs.core.edit_and_set.call(null,inode__10048,edit,idx__10049,n__10052);
}
}
});
cljs.core.ArrayNode.prototype.inode_without_BANG_ = (function (edit,shift,hash,key,removed_leaf_QMARK_){
var this__10053 = this;
var inode__10054 = this;
var idx__10055 = ((hash >>> shift) & 0x01f);
var node__10056 = (this__10053.arr[idx__10055]);
if((null == node__10056))
{return inode__10054;
} else
{var n__10057 = node__10056.inode_without_BANG_(edit,(shift + 5),hash,key,removed_leaf_QMARK_);
if((n__10057 === node__10056))
{return inode__10054;
} else
{if((null == n__10057))
{if((this__10053.cnt <= 8))
{return cljs.core.pack_array_node.call(null,inode__10054,edit,idx__10055);
} else
{var editable__10058 = cljs.core.edit_and_set.call(null,inode__10054,edit,idx__10055,n__10057);
editable__10058.cnt = (editable__10058.cnt - 1);
return editable__10058;
}
} else
{if("\uFDD0'else")
{return cljs.core.edit_and_set.call(null,inode__10054,edit,idx__10055,n__10057);
} else
{return null;
}
}
}
}
});
cljs.core.ArrayNode.prototype.kv_reduce = (function (f,init){
var this__10059 = this;
var inode__10060 = this;
var len__10061 = this__10059.arr.length;
var i__10062 = 0;
var init__10063 = init;
while(true){
if((i__10062 < len__10061))
{var node__10064 = (this__10059.arr[i__10062]);
if((node__10064 != null))
{var init__10065 = node__10064.kv_reduce(f,init__10063);
if(cljs.core.reduced_QMARK_.call(null,init__10065))
{return cljs.core.deref.call(null,init__10065);
} else
{{
var G__10067 = (i__10062 + 1);
var G__10068 = init__10065;
i__10062 = G__10067;
init__10063 = G__10068;
continue;
}
}
} else
{return null;
}
} else
{return init__10063;
}
break;
}
});
cljs.core.ArrayNode;
cljs.core.hash_collision_node_find_index = (function hash_collision_node_find_index(arr,cnt,key){
var lim__10069 = (2 * cnt);
var i__10070 = 0;
while(true){
if((i__10070 < lim__10069))
{if(cljs.core._EQ_.call(null,key,(arr[i__10070])))
{return i__10070;
} else
{{
var G__10071 = (i__10070 + 2);
i__10070 = G__10071;
continue;
}
}
} else
{return -1;
}
break;
}
});

/**
* @constructor
*/
cljs.core.HashCollisionNode = (function (edit,collision_hash,cnt,arr){
this.edit = edit;
this.collision_hash = collision_hash;
this.cnt = cnt;
this.arr = arr;
})
cljs.core.HashCollisionNode.cljs$lang$type = true;
cljs.core.HashCollisionNode.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.HashCollisionNode");
});
cljs.core.HashCollisionNode.prototype.inode_assoc = (function (shift,hash,key,val,added_leaf_QMARK_){
var this__10072 = this;
var inode__10073 = this;
if((hash === this__10072.collision_hash))
{var idx__10074 = cljs.core.hash_collision_node_find_index.call(null,this__10072.arr,this__10072.cnt,key);
if((idx__10074 === -1))
{var len__10075 = this__10072.arr.length;
var new_arr__10076 = cljs.core.make_array.call(null,(len__10075 + 2));
cljs.core.array_copy.call(null,this__10072.arr,0,new_arr__10076,0,len__10075);
(new_arr__10076[len__10075] = key);
(new_arr__10076[(len__10075 + 1)] = val);
(added_leaf_QMARK_[0] = true);
return (new cljs.core.HashCollisionNode(null,this__10072.collision_hash,(this__10072.cnt + 1),new_arr__10076));
} else
{if(cljs.core._EQ_.call(null,(this__10072.arr[idx__10074]),val))
{return inode__10073;
} else
{return (new cljs.core.HashCollisionNode(null,this__10072.collision_hash,this__10072.cnt,cljs.core.clone_and_set.call(null,this__10072.arr,(idx__10074 + 1),val)));
}
}
} else
{return (new cljs.core.BitmapIndexedNode(null,(1 << ((this__10072.collision_hash >>> shift) & 0x01f)),[null,inode__10073])).inode_assoc(shift,hash,key,val,added_leaf_QMARK_);
}
});
cljs.core.HashCollisionNode.prototype.inode_without = (function (shift,hash,key){
var this__10077 = this;
var inode__10078 = this;
var idx__10079 = cljs.core.hash_collision_node_find_index.call(null,this__10077.arr,this__10077.cnt,key);
if((idx__10079 === -1))
{return inode__10078;
} else
{if((this__10077.cnt === 1))
{return null;
} else
{if("\uFDD0'else")
{return (new cljs.core.HashCollisionNode(null,this__10077.collision_hash,(this__10077.cnt - 1),cljs.core.remove_pair.call(null,this__10077.arr,cljs.core.quot.call(null,idx__10079,2))));
} else
{return null;
}
}
}
});
cljs.core.HashCollisionNode.prototype.inode_find = (function() {
var G__10106 = null;
var G__10106__3 = (function (shift,hash,key){
var this__10080 = this;
var inode__10081 = this;
var idx__10082 = cljs.core.hash_collision_node_find_index.call(null,this__10080.arr,this__10080.cnt,key);
if((idx__10082 < 0))
{return null;
} else
{if(cljs.core._EQ_.call(null,key,(this__10080.arr[idx__10082])))
{return cljs.core.PersistentVector.fromArray([(this__10080.arr[idx__10082]),(this__10080.arr[(idx__10082 + 1)])]);
} else
{if("\uFDD0'else")
{return null;
} else
{return null;
}
}
}
});
var G__10106__4 = (function (shift,hash,key,not_found){
var this__10083 = this;
var inode__10084 = this;
var idx__10085 = cljs.core.hash_collision_node_find_index.call(null,this__10083.arr,this__10083.cnt,key);
if((idx__10085 < 0))
{return not_found;
} else
{if(cljs.core._EQ_.call(null,key,(this__10083.arr[idx__10085])))
{return cljs.core.PersistentVector.fromArray([(this__10083.arr[idx__10085]),(this__10083.arr[(idx__10085 + 1)])]);
} else
{if("\uFDD0'else")
{return not_found;
} else
{return null;
}
}
}
});
G__10106 = function(shift,hash,key,not_found){
switch(arguments.length){
case 3:
return G__10106__3.call(this,shift,hash,key);
case 4:
return G__10106__4.call(this,shift,hash,key,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10106;
})()
;
cljs.core.HashCollisionNode.prototype.inode_seq = (function (){
var this__10086 = this;
var inode__10087 = this;
return cljs.core.create_inode_seq.call(null,this__10086.arr);
});
cljs.core.HashCollisionNode.prototype.ensure_editable = (function() {
var G__10107 = null;
var G__10107__1 = (function (e){
var this__10088 = this;
var inode__10089 = this;
if((e === this__10088.edit))
{return inode__10089;
} else
{var new_arr__10090 = cljs.core.make_array.call(null,(2 * (this__10088.cnt + 1)));
cljs.core.array_copy.call(null,this__10088.arr,0,new_arr__10090,0,(2 * this__10088.cnt));
return (new cljs.core.HashCollisionNode(e,this__10088.collision_hash,this__10088.cnt,new_arr__10090));
}
});
var G__10107__3 = (function (e,count,array){
var this__10091 = this;
var inode__10092 = this;
if((e === this__10091.edit))
{this__10091.arr = array;
this__10091.cnt = count;
return inode__10092;
} else
{return (new cljs.core.HashCollisionNode(this__10091.edit,this__10091.collision_hash,count,array));
}
});
G__10107 = function(e,count,array){
switch(arguments.length){
case 1:
return G__10107__1.call(this,e);
case 3:
return G__10107__3.call(this,e,count,array);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10107;
})()
;
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = (function (edit,shift,hash,key,val,added_leaf_QMARK_){
var this__10093 = this;
var inode__10094 = this;
if((hash === this__10093.collision_hash))
{var idx__10095 = cljs.core.hash_collision_node_find_index.call(null,this__10093.arr,this__10093.cnt,key);
if((idx__10095 === -1))
{if((this__10093.arr.length > (2 * this__10093.cnt)))
{var editable__10096 = cljs.core.edit_and_set.call(null,inode__10094,edit,(2 * this__10093.cnt),key,((2 * this__10093.cnt) + 1),val);
(added_leaf_QMARK_[0] = true);
editable__10096.cnt = (editable__10096.cnt + 1);
return editable__10096;
} else
{var len__10097 = this__10093.arr.length;
var new_arr__10098 = cljs.core.make_array.call(null,(len__10097 + 2));
cljs.core.array_copy.call(null,this__10093.arr,0,new_arr__10098,0,len__10097);
(new_arr__10098[len__10097] = key);
(new_arr__10098[(len__10097 + 1)] = val);
(added_leaf_QMARK_[0] = true);
return inode__10094.ensure_editable(edit,(this__10093.cnt + 1),new_arr__10098);
}
} else
{if(((this__10093.arr[(idx__10095 + 1)]) === val))
{return inode__10094;
} else
{return cljs.core.edit_and_set.call(null,inode__10094,edit,(idx__10095 + 1),val);
}
}
} else
{return (new cljs.core.BitmapIndexedNode(edit,(1 << ((this__10093.collision_hash >>> shift) & 0x01f)),[null,inode__10094,null,null])).inode_assoc_BANG_(edit,shift,hash,key,val,added_leaf_QMARK_);
}
});
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = (function (edit,shift,hash,key,removed_leaf_QMARK_){
var this__10099 = this;
var inode__10100 = this;
var idx__10101 = cljs.core.hash_collision_node_find_index.call(null,this__10099.arr,this__10099.cnt,key);
if((idx__10101 === -1))
{return inode__10100;
} else
{(removed_leaf_QMARK_[0] = true);
if((this__10099.cnt === 1))
{return null;
} else
{var editable__10102 = inode__10100.ensure_editable(edit);
var earr__10103 = editable__10102.arr;
(earr__10103[idx__10101] = (earr__10103[((2 * this__10099.cnt) - 2)]));
(earr__10103[(idx__10101 + 1)] = (earr__10103[((2 * this__10099.cnt) - 1)]));
(earr__10103[((2 * this__10099.cnt) - 1)] = null);
(earr__10103[((2 * this__10099.cnt) - 2)] = null);
editable__10102.cnt = (editable__10102.cnt - 1);
return editable__10102;
}
}
});
cljs.core.HashCollisionNode.prototype.kv_reduce = (function (f,init){
var this__10104 = this;
var inode__10105 = this;
return cljs.core.inode_kv_reduce.call(null,this__10104.arr,f,init);
});
cljs.core.HashCollisionNode;
cljs.core.create_node = (function() {
var create_node = null;
var create_node__6 = (function (shift,key1,val1,key2hash,key2,val2){
var key1hash__10108 = cljs.core.hash.call(null,key1);
if((key1hash__10108 === key2hash))
{return (new cljs.core.HashCollisionNode(null,key1hash__10108,2,[key1,val1,key2,val2]));
} else
{var added_leaf_QMARK___10109 = [false];
return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift,key1hash__10108,key1,val1,added_leaf_QMARK___10109).inode_assoc(shift,key2hash,key2,val2,added_leaf_QMARK___10109);
}
});
var create_node__7 = (function (edit,shift,key1,val1,key2hash,key2,val2){
var key1hash__10110 = cljs.core.hash.call(null,key1);
if((key1hash__10110 === key2hash))
{return (new cljs.core.HashCollisionNode(null,key1hash__10110,2,[key1,val1,key2,val2]));
} else
{var added_leaf_QMARK___10111 = [false];
return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit,shift,key1hash__10110,key1,val1,added_leaf_QMARK___10111).inode_assoc_BANG_(edit,shift,key2hash,key2,val2,added_leaf_QMARK___10111);
}
});
create_node = function(edit,shift,key1,val1,key2hash,key2,val2){
switch(arguments.length){
case 6:
return create_node__6.call(this,edit,shift,key1,val1,key2hash,key2);
case 7:
return create_node__7.call(this,edit,shift,key1,val1,key2hash,key2,val2);
}
throw('Invalid arity: ' + arguments.length);
};
create_node.cljs$lang$arity$6 = create_node__6;
create_node.cljs$lang$arity$7 = create_node__7;
return create_node;
})()
;

/**
* @constructor
*/
cljs.core.NodeSeq = (function (meta,nodes,i,s,__hash){
this.meta = meta;
this.nodes = nodes;
this.i = i;
this.s = s;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 15925324;
})
cljs.core.NodeSeq.cljs$lang$type = true;
cljs.core.NodeSeq.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.NodeSeq");
});
cljs.core.NodeSeq.prototype.cljs$core$IHash$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__10112 = this;
var h__2236__auto____10113 = this__10112.__hash;
if((h__2236__auto____10113 != null))
{return h__2236__auto____10113;
} else
{var h__2236__auto____10114 = cljs.core.hash_coll.call(null,coll);
this__10112.__hash = h__2236__auto____10114;
return h__2236__auto____10114;
}
});
cljs.core.NodeSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__10115 = this;
return cljs.core.cons.call(null,o,coll);
});
cljs.core.NodeSeq.prototype.toString = (function (){
var this__10116 = this;
var this$__10117 = this;
return cljs.core.pr_str.call(null,this$__10117);
});
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this$){
var this__10118 = this;
return this$;
});
cljs.core.NodeSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = (function (coll){
var this__10119 = this;
if((this__10119.s == null))
{return cljs.core.PersistentVector.fromArray([(this__10119.nodes[this__10119.i]),(this__10119.nodes[(this__10119.i + 1)])]);
} else
{return cljs.core.first.call(null,this__10119.s);
}
});
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = (function (coll){
var this__10120 = this;
if((this__10120.s == null))
{return cljs.core.create_inode_seq.call(null,this__10120.nodes,(this__10120.i + 2),null);
} else
{return cljs.core.create_inode_seq.call(null,this__10120.nodes,this__10120.i,cljs.core.next.call(null,this__10120.s));
}
});
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__10121 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__10122 = this;
return (new cljs.core.NodeSeq(meta,this__10122.nodes,this__10122.i,this__10122.s,this__10122.__hash));
});
cljs.core.NodeSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__10123 = this;
return this__10123.meta;
});
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__10124 = this;
return cljs.core.with_meta.call(null,cljs.core.List.EMPTY,this__10124.meta);
});
cljs.core.NodeSeq;
cljs.core.create_inode_seq = (function() {
var create_inode_seq = null;
var create_inode_seq__1 = (function (nodes){
return create_inode_seq.call(null,nodes,0,null);
});
var create_inode_seq__3 = (function (nodes,i,s){
if((s == null))
{var len__10125 = nodes.length;
var j__10126 = i;
while(true){
if((j__10126 < len__10125))
{if((null != (nodes[j__10126])))
{return (new cljs.core.NodeSeq(null,nodes,j__10126,null,null));
} else
{var temp__317__auto____10127 = (nodes[(j__10126 + 1)]);
if(cljs.core.truth_(temp__317__auto____10127))
{var node__10128 = temp__317__auto____10127;
var temp__317__auto____10129 = node__10128.inode_seq();
if(cljs.core.truth_(temp__317__auto____10129))
{var node_seq__10130 = temp__317__auto____10129;
return (new cljs.core.NodeSeq(null,nodes,(j__10126 + 2),node_seq__10130,null));
} else
{{
var G__10131 = (j__10126 + 2);
j__10126 = G__10131;
continue;
}
}
} else
{{
var G__10132 = (j__10126 + 2);
j__10126 = G__10132;
continue;
}
}
}
} else
{return null;
}
break;
}
} else
{return (new cljs.core.NodeSeq(null,nodes,i,s,null));
}
});
create_inode_seq = function(nodes,i,s){
switch(arguments.length){
case 1:
return create_inode_seq__1.call(this,nodes);
case 3:
return create_inode_seq__3.call(this,nodes,i,s);
}
throw('Invalid arity: ' + arguments.length);
};
create_inode_seq.cljs$lang$arity$1 = create_inode_seq__1;
create_inode_seq.cljs$lang$arity$3 = create_inode_seq__3;
return create_inode_seq;
})()
;

/**
* @constructor
*/
cljs.core.ArrayNodeSeq = (function (meta,nodes,i,s,__hash){
this.meta = meta;
this.nodes = nodes;
this.i = i;
this.s = s;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 15925324;
})
cljs.core.ArrayNodeSeq.cljs$lang$type = true;
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.ArrayNodeSeq");
});
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__10133 = this;
var h__2236__auto____10134 = this__10133.__hash;
if((h__2236__auto____10134 != null))
{return h__2236__auto____10134;
} else
{var h__2236__auto____10135 = cljs.core.hash_coll.call(null,coll);
this__10133.__hash = h__2236__auto____10135;
return h__2236__auto____10135;
}
});
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__10136 = this;
return cljs.core.cons.call(null,o,coll);
});
cljs.core.ArrayNodeSeq.prototype.toString = (function (){
var this__10137 = this;
var this$__10138 = this;
return cljs.core.pr_str.call(null,this$__10138);
});
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this$){
var this__10139 = this;
return this$;
});
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = (function (coll){
var this__10140 = this;
return cljs.core.first.call(null,this__10140.s);
});
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = (function (coll){
var this__10141 = this;
return cljs.core.create_array_node_seq.call(null,null,this__10141.nodes,this__10141.i,cljs.core.next.call(null,this__10141.s));
});
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__10142 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__10143 = this;
return (new cljs.core.ArrayNodeSeq(meta,this__10143.nodes,this__10143.i,this__10143.s,this__10143.__hash));
});
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__10144 = this;
return this__10144.meta;
});
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__10145 = this;
return cljs.core.with_meta.call(null,cljs.core.List.EMPTY,this__10145.meta);
});
cljs.core.ArrayNodeSeq;
cljs.core.create_array_node_seq = (function() {
var create_array_node_seq = null;
var create_array_node_seq__1 = (function (nodes){
return create_array_node_seq.call(null,null,nodes,0,null);
});
var create_array_node_seq__4 = (function (meta,nodes,i,s){
if((s == null))
{var len__10146 = nodes.length;
var j__10147 = i;
while(true){
if((j__10147 < len__10146))
{var temp__317__auto____10148 = (nodes[j__10147]);
if(cljs.core.truth_(temp__317__auto____10148))
{var nj__10149 = temp__317__auto____10148;
var temp__317__auto____10150 = nj__10149.inode_seq();
if(cljs.core.truth_(temp__317__auto____10150))
{var ns__10151 = temp__317__auto____10150;
return (new cljs.core.ArrayNodeSeq(meta,nodes,(j__10147 + 1),ns__10151,null));
} else
{{
var G__10152 = (j__10147 + 1);
j__10147 = G__10152;
continue;
}
}
} else
{{
var G__10153 = (j__10147 + 1);
j__10147 = G__10153;
continue;
}
}
} else
{return null;
}
break;
}
} else
{return (new cljs.core.ArrayNodeSeq(meta,nodes,i,s,null));
}
});
create_array_node_seq = function(meta,nodes,i,s){
switch(arguments.length){
case 1:
return create_array_node_seq__1.call(this,meta);
case 4:
return create_array_node_seq__4.call(this,meta,nodes,i,s);
}
throw('Invalid arity: ' + arguments.length);
};
create_array_node_seq.cljs$lang$arity$1 = create_array_node_seq__1;
create_array_node_seq.cljs$lang$arity$4 = create_array_node_seq__4;
return create_array_node_seq;
})()
;
void 0;

/**
* @constructor
*/
cljs.core.PersistentHashMap = (function (meta,cnt,root,has_nil_QMARK_,nil_val,__hash){
this.meta = meta;
this.cnt = cnt;
this.root = root;
this.has_nil_QMARK_ = has_nil_QMARK_;
this.nil_val = nil_val;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 2155545487;
})
cljs.core.PersistentHashMap.cljs$lang$type = true;
cljs.core.PersistentHashMap.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentHashMap");
});
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = (function (coll){
var this__10158 = this;
return (new cljs.core.TransientHashMap({},this__10158.root,this__10158.cnt,this__10158.has_nil_QMARK_,this__10158.nil_val));
});
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__10159 = this;
var h__2236__auto____10160 = this__10159.__hash;
if((h__2236__auto____10160 != null))
{return h__2236__auto____10160;
} else
{var h__2236__auto____10161 = cljs.core.hash_imap.call(null,coll);
this__10159.__hash = h__2236__auto____10161;
return h__2236__auto____10161;
}
});
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,k){
var this__10162 = this;
return cljs.core._lookup.call(null,coll,k,null);
});
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,k,not_found){
var this__10163 = this;
if((k == null))
{if(cljs.core.truth_(this__10163.has_nil_QMARK_))
{return this__10163.nil_val;
} else
{return not_found;
}
} else
{if((this__10163.root == null))
{return not_found;
} else
{if("\uFDD0'else")
{return cljs.core.nth.call(null,this__10163.root.inode_find(0,cljs.core.hash.call(null,k),k,[null,not_found]),1);
} else
{return null;
}
}
}
});
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (coll,k,v){
var this__10164 = this;
if((k == null))
{if(cljs.core.truth_((function (){var and__132__auto____10165 = this__10164.has_nil_QMARK_;
if(cljs.core.truth_(and__132__auto____10165))
{return (v === this__10164.nil_val);
} else
{return and__132__auto____10165;
}
})()))
{return coll;
} else
{return (new cljs.core.PersistentHashMap(this__10164.meta,(cljs.core.truth_(this__10164.has_nil_QMARK_)?this__10164.cnt:(this__10164.cnt + 1)),this__10164.root,true,v,null));
}
} else
{var added_leaf_QMARK___10166 = [false];
var new_root__10167 = (((this__10164.root == null))?cljs.core.BitmapIndexedNode.EMPTY:this__10164.root).inode_assoc(0,cljs.core.hash.call(null,k),k,v,added_leaf_QMARK___10166);
if((new_root__10167 === this__10164.root))
{return coll;
} else
{return (new cljs.core.PersistentHashMap(this__10164.meta,(cljs.core.truth_((added_leaf_QMARK___10166[0]))?(this__10164.cnt + 1):this__10164.cnt),new_root__10167,this__10164.has_nil_QMARK_,this__10164.nil_val,null));
}
}
});
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (coll,k){
var this__10168 = this;
if((k == null))
{return this__10168.has_nil_QMARK_;
} else
{if((this__10168.root == null))
{return false;
} else
{if("\uFDD0'else")
{return cljs.core.not.call(null,(this__10168.root.inode_find(0,cljs.core.hash.call(null,k),k,cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel));
} else
{return null;
}
}
}
});
cljs.core.PersistentHashMap.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentHashMap.prototype.call = (function() {
var G__10189 = null;
var G__10189__2 = (function (tsym10156,k){
var this__10169 = this;
var tsym10156__10170 = this;
var coll__10171 = tsym10156__10170;
return cljs.core._lookup.call(null,coll__10171,k);
});
var G__10189__3 = (function (tsym10157,k,not_found){
var this__10172 = this;
var tsym10157__10173 = this;
var coll__10174 = tsym10157__10173;
return cljs.core._lookup.call(null,coll__10174,k,not_found);
});
G__10189 = function(tsym10157,k,not_found){
switch(arguments.length){
case 2:
return G__10189__2.call(this,tsym10157,k);
case 3:
return G__10189__3.call(this,tsym10157,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10189;
})()
;
cljs.core.PersistentHashMap.prototype.apply = (function (tsym10154,args10155){
return tsym10154.call.apply(tsym10154,[tsym10154].concat(cljs.core.aclone.call(null,args10155)));
});
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (coll,f,init){
var this__10175 = this;
var init__10176 = (cljs.core.truth_(this__10175.has_nil_QMARK_)?f.call(null,init,null,this__10175.nil_val):init);
if(cljs.core.reduced_QMARK_.call(null,init__10176))
{return cljs.core.deref.call(null,init__10176);
} else
{if((null != this__10175.root))
{return this__10175.root.kv_reduce(f,init__10176);
} else
{if("\uFDD0'else")
{return init__10176;
} else
{return null;
}
}
}
});
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,entry){
var this__10177 = this;
if(cljs.core.vector_QMARK_.call(null,entry))
{return cljs.core._assoc.call(null,coll,cljs.core._nth.call(null,entry,0),cljs.core._nth.call(null,entry,1));
} else
{return cljs.core.reduce.call(null,cljs.core._conj,coll,entry);
}
});
cljs.core.PersistentHashMap.prototype.toString = (function (){
var this__10178 = this;
var this$__10179 = this;
return cljs.core.pr_str.call(null,this$__10179);
});
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__10180 = this;
if((this__10180.cnt > 0))
{var s__10181 = (((null != this__10180.root))?this__10180.root.inode_seq():null);
if(cljs.core.truth_(this__10180.has_nil_QMARK_))
{return cljs.core.cons.call(null,cljs.core.PersistentVector.fromArray([null,this__10180.nil_val]),s__10181);
} else
{return s__10181;
}
} else
{return null;
}
});
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__10182 = this;
return this__10182.cnt;
});
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__10183 = this;
return cljs.core.equiv_map.call(null,coll,other);
});
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__10184 = this;
return (new cljs.core.PersistentHashMap(meta,this__10184.cnt,this__10184.root,this__10184.has_nil_QMARK_,this__10184.nil_val,this__10184.__hash));
});
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__10185 = this;
return this__10185.meta;
});
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__10186 = this;
return cljs.core._with_meta.call(null,cljs.core.PersistentHashMap.EMPTY,this__10186.meta);
});
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (coll,k){
var this__10187 = this;
if((k == null))
{if(cljs.core.truth_(this__10187.has_nil_QMARK_))
{return (new cljs.core.PersistentHashMap(this__10187.meta,(this__10187.cnt - 1),this__10187.root,false,null,null));
} else
{return coll;
}
} else
{if((this__10187.root == null))
{return coll;
} else
{if("\uFDD0'else")
{var new_root__10188 = this__10187.root.inode_without(0,cljs.core.hash.call(null,k),k);
if((new_root__10188 === this__10187.root))
{return coll;
} else
{return (new cljs.core.PersistentHashMap(this__10187.meta,(this__10187.cnt - 1),new_root__10188,this__10187.has_nil_QMARK_,this__10187.nil_val,null));
}
} else
{return null;
}
}
}
});
cljs.core.PersistentHashMap;
cljs.core.PersistentHashMap.EMPTY = (new cljs.core.PersistentHashMap(null,0,null,false,null,0));
cljs.core.PersistentHashMap.fromArrays = (function (ks,vs){
var len__10190 = ks.length;
var i__10191 = 0;
var out__10192 = cljs.core.transient$.call(null,cljs.core.PersistentHashMap.EMPTY);
while(true){
if((i__10191 < len__10190))
{{
var G__10193 = (i__10191 + 1);
var G__10194 = cljs.core.assoc_BANG_.call(null,out__10192,(ks[i__10191]),(vs[i__10191]));
i__10191 = G__10193;
out__10192 = G__10194;
continue;
}
} else
{return cljs.core.persistent_BANG_.call(null,out__10192);
}
break;
}
});

/**
* @constructor
*/
cljs.core.TransientHashMap = (function (edit,root,count,has_nil_QMARK_,nil_val){
this.edit = edit;
this.root = root;
this.count = count;
this.has_nil_QMARK_ = has_nil_QMARK_;
this.nil_val = nil_val;
this.cljs$lang$protocol_mask$partition1$ = 7;
this.cljs$lang$protocol_mask$partition0$ = 130;
})
cljs.core.TransientHashMap.cljs$lang$type = true;
cljs.core.TransientHashMap.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.TransientHashMap");
});
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = (function (tcoll,key){
var this__10195 = this;
return tcoll.without_BANG_(key);
});
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = (function (tcoll,key,val){
var this__10196 = this;
return tcoll.assoc_BANG_(key,val);
});
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = (function (tcoll,val){
var this__10197 = this;
return tcoll.conj_BANG_(val);
});
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = (function (tcoll){
var this__10198 = this;
return tcoll.persistent_BANG_();
});
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (tcoll,k){
var this__10199 = this;
if((k == null))
{if(cljs.core.truth_(this__10199.has_nil_QMARK_))
{return this__10199.nil_val;
} else
{return null;
}
} else
{if((this__10199.root == null))
{return null;
} else
{return cljs.core.nth.call(null,this__10199.root.inode_find(0,cljs.core.hash.call(null,k),k),1);
}
}
});
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (tcoll,k,not_found){
var this__10200 = this;
if((k == null))
{if(cljs.core.truth_(this__10200.has_nil_QMARK_))
{return this__10200.nil_val;
} else
{return not_found;
}
} else
{if((this__10200.root == null))
{return not_found;
} else
{return cljs.core.nth.call(null,this__10200.root.inode_find(0,cljs.core.hash.call(null,k),k,[null,not_found]),1);
}
}
});
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__10201 = this;
if(cljs.core.truth_(this__10201.edit))
{return this__10201.count;
} else
{throw (new Error("count after persistent!"));
}
});
cljs.core.TransientHashMap.prototype.conj_BANG_ = (function (o){
var this__10202 = this;
var tcoll__10203 = this;
if(cljs.core.truth_(this__10202.edit))
{if((function (){var G__10204__10205 = o;
if((G__10204__10205 != null))
{if((function (){var or__138__auto____10206 = (G__10204__10205.cljs$lang$protocol_mask$partition0$ & 1024);
if(or__138__auto____10206)
{return or__138__auto____10206;
} else
{return G__10204__10205.cljs$core$IMapEntry$;
}
})())
{return true;
} else
{if((!G__10204__10205.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IMapEntry,G__10204__10205);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IMapEntry,G__10204__10205);
}
})())
{return tcoll__10203.assoc_BANG_(cljs.core.key.call(null,o),cljs.core.val.call(null,o));
} else
{var es__10207 = cljs.core.seq.call(null,o);
var tcoll__10208 = tcoll__10203;
while(true){
var temp__317__auto____10209 = cljs.core.first.call(null,es__10207);
if(cljs.core.truth_(temp__317__auto____10209))
{var e__10210 = temp__317__auto____10209;
{
var G__10221 = cljs.core.next.call(null,es__10207);
var G__10222 = tcoll__10208.assoc_BANG_(cljs.core.key.call(null,e__10210),cljs.core.val.call(null,e__10210));
es__10207 = G__10221;
tcoll__10208 = G__10222;
continue;
}
} else
{return tcoll__10208;
}
break;
}
}
} else
{throw (new Error("conj! after persistent"));
}
});
cljs.core.TransientHashMap.prototype.assoc_BANG_ = (function (k,v){
var this__10211 = this;
var tcoll__10212 = this;
if(cljs.core.truth_(this__10211.edit))
{if((k == null))
{if((this__10211.nil_val === v))
{} else
{this__10211.nil_val = v;
}
if(cljs.core.truth_(this__10211.has_nil_QMARK_))
{} else
{this__10211.count = (this__10211.count + 1);
this__10211.has_nil_QMARK_ = true;
}
return tcoll__10212;
} else
{var added_leaf_QMARK___10213 = [false];
var node__10214 = (((this__10211.root == null))?cljs.core.BitmapIndexedNode.EMPTY:this__10211.root).inode_assoc_BANG_(this__10211.edit,0,cljs.core.hash.call(null,k),k,v,added_leaf_QMARK___10213);
if((node__10214 === this__10211.root))
{} else
{this__10211.root = node__10214;
}
if(cljs.core.truth_((added_leaf_QMARK___10213[0])))
{this__10211.count = (this__10211.count + 1);
} else
{}
return tcoll__10212;
}
} else
{throw (new Error("assoc! after persistent!"));
}
});
cljs.core.TransientHashMap.prototype.without_BANG_ = (function (k){
var this__10215 = this;
var tcoll__10216 = this;
if(cljs.core.truth_(this__10215.edit))
{if((k == null))
{if(cljs.core.truth_(this__10215.has_nil_QMARK_))
{this__10215.has_nil_QMARK_ = false;
this__10215.nil_val = null;
this__10215.count = (this__10215.count - 1);
return tcoll__10216;
} else
{return tcoll__10216;
}
} else
{if((this__10215.root == null))
{return tcoll__10216;
} else
{var removed_leaf_QMARK___10217 = [false];
var node__10218 = this__10215.root.inode_without_BANG_(this__10215.edit,0,cljs.core.hash.call(null,k),k,removed_leaf_QMARK___10217);
if((node__10218 === this__10215.root))
{} else
{this__10215.root = node__10218;
}
if(cljs.core.truth_((removed_leaf_QMARK___10217[0])))
{this__10215.count = (this__10215.count - 1);
} else
{}
return tcoll__10216;
}
}
} else
{throw (new Error("dissoc! after persistent!"));
}
});
cljs.core.TransientHashMap.prototype.persistent_BANG_ = (function (){
var this__10219 = this;
var tcoll__10220 = this;
if(cljs.core.truth_(this__10219.edit))
{this__10219.edit = null;
return (new cljs.core.PersistentHashMap(null,this__10219.count,this__10219.root,this__10219.has_nil_QMARK_,this__10219.nil_val,null));
} else
{throw (new Error("persistent! called twice"));
}
});
cljs.core.TransientHashMap;
cljs.core.tree_map_seq_push = (function tree_map_seq_push(node,stack,ascending_QMARK_){
var t__10223 = node;
var stack__10224 = stack;
while(true){
if((t__10223 != null))
{{
var G__10225 = (cljs.core.truth_(ascending_QMARK_)?t__10223.left:t__10223.right);
var G__10226 = cljs.core.conj.call(null,stack__10224,t__10223);
t__10223 = G__10225;
stack__10224 = G__10226;
continue;
}
} else
{return stack__10224;
}
break;
}
});

/**
* @constructor
*/
cljs.core.PersistentTreeMapSeq = (function (meta,stack,ascending_QMARK_,cnt,__hash){
this.meta = meta;
this.stack = stack;
this.ascending_QMARK_ = ascending_QMARK_;
this.cnt = cnt;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 15925322;
})
cljs.core.PersistentTreeMapSeq.cljs$lang$type = true;
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentTreeMapSeq");
});
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__10227 = this;
var h__2236__auto____10228 = this__10227.__hash;
if((h__2236__auto____10228 != null))
{return h__2236__auto____10228;
} else
{var h__2236__auto____10229 = cljs.core.hash_coll.call(null,coll);
this__10227.__hash = h__2236__auto____10229;
return h__2236__auto____10229;
}
});
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__10230 = this;
return cljs.core.cons.call(null,o,coll);
});
cljs.core.PersistentTreeMapSeq.prototype.toString = (function (){
var this__10231 = this;
var this$__10232 = this;
return cljs.core.pr_str.call(null,this$__10232);
});
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this$){
var this__10233 = this;
return this$;
});
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__10234 = this;
if((this__10234.cnt < 0))
{return (cljs.core.count.call(null,cljs.core.next.call(null,coll)) + 1);
} else
{return this__10234.cnt;
}
});
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = (function (this$){
var this__10235 = this;
return cljs.core.peek.call(null,this__10235.stack);
});
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = (function (this$){
var this__10236 = this;
var t__10237 = cljs.core.peek.call(null,this__10236.stack);
var next_stack__10238 = cljs.core.tree_map_seq_push.call(null,(cljs.core.truth_(this__10236.ascending_QMARK_)?t__10237.right:t__10237.left),cljs.core.pop.call(null,this__10236.stack),this__10236.ascending_QMARK_);
if((next_stack__10238 != null))
{return (new cljs.core.PersistentTreeMapSeq(null,next_stack__10238,this__10236.ascending_QMARK_,(this__10236.cnt - 1),null));
} else
{return null;
}
});
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__10239 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__10240 = this;
return (new cljs.core.PersistentTreeMapSeq(meta,this__10240.stack,this__10240.ascending_QMARK_,this__10240.cnt,this__10240.__hash));
});
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__10241 = this;
return this__10241.meta;
});
cljs.core.PersistentTreeMapSeq;
cljs.core.create_tree_map_seq = (function create_tree_map_seq(tree,ascending_QMARK_,cnt){
return (new cljs.core.PersistentTreeMapSeq(null,cljs.core.tree_map_seq_push.call(null,tree,null,ascending_QMARK_),ascending_QMARK_,cnt,null));
});
void 0;
void 0;
cljs.core.balance_left = (function balance_left(key,val,ins,right){
if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,ins))
{if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,ins.left))
{return (new cljs.core.RedNode(ins.key,ins.val,ins.left.blacken(),(new cljs.core.BlackNode(key,val,ins.right,right,null)),null));
} else
{if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,ins.right))
{return (new cljs.core.RedNode(ins.right.key,ins.right.val,(new cljs.core.BlackNode(ins.key,ins.val,ins.left,ins.right.left,null)),(new cljs.core.BlackNode(key,val,ins.right.right,right,null)),null));
} else
{if("\uFDD0'else")
{return (new cljs.core.BlackNode(key,val,ins,right,null));
} else
{return null;
}
}
}
} else
{return (new cljs.core.BlackNode(key,val,ins,right,null));
}
});
cljs.core.balance_right = (function balance_right(key,val,left,ins){
if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,ins))
{if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,ins.right))
{return (new cljs.core.RedNode(ins.key,ins.val,(new cljs.core.BlackNode(key,val,left,ins.left,null)),ins.right.blacken(),null));
} else
{if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,ins.left))
{return (new cljs.core.RedNode(ins.left.key,ins.left.val,(new cljs.core.BlackNode(key,val,left,ins.left.left,null)),(new cljs.core.BlackNode(ins.key,ins.val,ins.left.right,ins.right,null)),null));
} else
{if("\uFDD0'else")
{return (new cljs.core.BlackNode(key,val,left,ins,null));
} else
{return null;
}
}
}
} else
{return (new cljs.core.BlackNode(key,val,left,ins,null));
}
});
cljs.core.balance_left_del = (function balance_left_del(key,val,del,right){
if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,del))
{return (new cljs.core.RedNode(key,val,del.blacken(),right,null));
} else
{if(cljs.core.instance_QMARK_.call(null,cljs.core.BlackNode,right))
{return cljs.core.balance_right.call(null,key,val,del,right.redden());
} else
{if((function (){var and__132__auto____10242 = cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,right);
if(and__132__auto____10242)
{return cljs.core.instance_QMARK_.call(null,cljs.core.BlackNode,right.left);
} else
{return and__132__auto____10242;
}
})())
{return (new cljs.core.RedNode(right.left.key,right.left.val,(new cljs.core.BlackNode(key,val,del,right.left.left,null)),cljs.core.balance_right.call(null,right.key,right.val,right.left.right,right.right.redden()),null));
} else
{if("\uFDD0'else")
{throw (new Error("red-black tree invariant violation"));
} else
{return null;
}
}
}
}
});
cljs.core.balance_right_del = (function balance_right_del(key,val,left,del){
if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,del))
{return (new cljs.core.RedNode(key,val,left,del.blacken(),null));
} else
{if(cljs.core.instance_QMARK_.call(null,cljs.core.BlackNode,left))
{return cljs.core.balance_left.call(null,key,val,left.redden(),del);
} else
{if((function (){var and__132__auto____10243 = cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,left);
if(and__132__auto____10243)
{return cljs.core.instance_QMARK_.call(null,cljs.core.BlackNode,left.right);
} else
{return and__132__auto____10243;
}
})())
{return (new cljs.core.RedNode(left.right.key,left.right.val,cljs.core.balance_left.call(null,left.key,left.val,left.left.redden(),left.right.left),(new cljs.core.BlackNode(key,val,left.right.right,del,null)),null));
} else
{if("\uFDD0'else")
{throw (new Error("red-black tree invariant violation"));
} else
{return null;
}
}
}
}
});
cljs.core.tree_map_kv_reduce = (function tree_map_kv_reduce(node,f,init){
var init__10244 = f.call(null,init,node.key,node.val);
if(cljs.core.reduced_QMARK_.call(null,init__10244))
{return cljs.core.deref.call(null,init__10244);
} else
{var init__10245 = (((node.left != null))?tree_map_kv_reduce.call(null,node.left,f,init__10244):init__10244);
if(cljs.core.reduced_QMARK_.call(null,init__10245))
{return cljs.core.deref.call(null,init__10245);
} else
{var init__10246 = (((node.right != null))?tree_map_kv_reduce.call(null,node.right,f,init__10245):init__10245);
if(cljs.core.reduced_QMARK_.call(null,init__10246))
{return cljs.core.deref.call(null,init__10246);
} else
{return init__10246;
}
}
}
});

/**
* @constructor
*/
cljs.core.BlackNode = (function (key,val,left,right,__hash){
this.key = key;
this.val = val;
this.left = left;
this.right = right;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 16201119;
})
cljs.core.BlackNode.cljs$lang$type = true;
cljs.core.BlackNode.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.BlackNode");
});
cljs.core.BlackNode.prototype.cljs$core$IHash$ = true;
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__10251 = this;
var h__2236__auto____10252 = this__10251.__hash;
if((h__2236__auto____10252 != null))
{return h__2236__auto____10252;
} else
{var h__2236__auto____10253 = cljs.core.hash_coll.call(null,coll);
this__10251.__hash = h__2236__auto____10253;
return h__2236__auto____10253;
}
});
cljs.core.BlackNode.prototype.cljs$core$ILookup$ = true;
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (node,k){
var this__10254 = this;
return cljs.core._nth.call(null,node,k,null);
});
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (node,k,not_found){
var this__10255 = this;
return cljs.core._nth.call(null,node,k,not_found);
});
cljs.core.BlackNode.prototype.cljs$core$IAssociative$ = true;
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (node,k,v){
var this__10256 = this;
return cljs.core.assoc.call(null,cljs.core.PersistentVector.fromArray([this__10256.key,this__10256.val]),k,v);
});
cljs.core.BlackNode.prototype.cljs$core$IFn$ = true;
cljs.core.BlackNode.prototype.call = (function() {
var G__10303 = null;
var G__10303__2 = (function (tsym10249,k){
var this__10257 = this;
var tsym10249__10258 = this;
var node__10259 = tsym10249__10258;
return cljs.core._lookup.call(null,node__10259,k);
});
var G__10303__3 = (function (tsym10250,k,not_found){
var this__10260 = this;
var tsym10250__10261 = this;
var node__10262 = tsym10250__10261;
return cljs.core._lookup.call(null,node__10262,k,not_found);
});
G__10303 = function(tsym10250,k,not_found){
switch(arguments.length){
case 2:
return G__10303__2.call(this,tsym10250,k);
case 3:
return G__10303__3.call(this,tsym10250,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10303;
})()
;
cljs.core.BlackNode.prototype.apply = (function (tsym10247,args10248){
return tsym10247.call.apply(tsym10247,[tsym10247].concat(cljs.core.aclone.call(null,args10248)));
});
cljs.core.BlackNode.prototype.cljs$core$ISequential$ = true;
cljs.core.BlackNode.prototype.cljs$core$ICollection$ = true;
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = (function (node,o){
var this__10263 = this;
return cljs.core.PersistentVector.fromArray([this__10263.key,this__10263.val,o]);
});
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$ = true;
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = (function (node){
var this__10264 = this;
return this__10264.key;
});
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = (function (node){
var this__10265 = this;
return this__10265.val;
});
cljs.core.BlackNode.prototype.add_right = (function (ins){
var this__10266 = this;
var node__10267 = this;
return ins.balance_right(node__10267);
});
cljs.core.BlackNode.prototype.redden = (function (){
var this__10268 = this;
var node__10269 = this;
return (new cljs.core.RedNode(this__10268.key,this__10268.val,this__10268.left,this__10268.right,null));
});
cljs.core.BlackNode.prototype.remove_right = (function (del){
var this__10270 = this;
var node__10271 = this;
return cljs.core.balance_right_del.call(null,this__10270.key,this__10270.val,this__10270.left,del);
});
cljs.core.BlackNode.prototype.replace = (function (key,val,left,right){
var this__10272 = this;
var node__10273 = this;
return (new cljs.core.BlackNode(key,val,left,right,null));
});
cljs.core.BlackNode.prototype.kv_reduce = (function (f,init){
var this__10274 = this;
var node__10275 = this;
return cljs.core.tree_map_kv_reduce.call(null,node__10275,f,init);
});
cljs.core.BlackNode.prototype.remove_left = (function (del){
var this__10276 = this;
var node__10277 = this;
return cljs.core.balance_left_del.call(null,this__10276.key,this__10276.val,del,this__10276.right);
});
cljs.core.BlackNode.prototype.add_left = (function (ins){
var this__10278 = this;
var node__10279 = this;
return ins.balance_left(node__10279);
});
cljs.core.BlackNode.prototype.balance_left = (function (parent){
var this__10280 = this;
var node__10281 = this;
return (new cljs.core.BlackNode(parent.key,parent.val,node__10281,parent.right,null));
});
cljs.core.BlackNode.prototype.toString = (function() {
var G__10304 = null;
var G__10304__0 = (function (){
var this__10284 = this;
var this$__10285 = this;
return cljs.core.pr_str.call(null,this$__10285);
});
G__10304 = function(){
switch(arguments.length){
case 0:
return G__10304__0.call(this);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10304;
})()
;
cljs.core.BlackNode.prototype.balance_right = (function (parent){
var this__10286 = this;
var node__10287 = this;
return (new cljs.core.BlackNode(parent.key,parent.val,parent.left,node__10287,null));
});
cljs.core.BlackNode.prototype.blacken = (function (){
var this__10288 = this;
var node__10289 = this;
return node__10289;
});
cljs.core.BlackNode.prototype.cljs$core$IReduce$ = true;
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (node,f){
var this__10290 = this;
return cljs.core.ci_reduce.call(null,node,f);
});
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (node,f,start){
var this__10291 = this;
return cljs.core.ci_reduce.call(null,node,f,start);
});
cljs.core.BlackNode.prototype.cljs$core$ISeqable$ = true;
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (node){
var this__10292 = this;
return cljs.core.list.call(null,this__10292.key,this__10292.val);
});
cljs.core.BlackNode.prototype.cljs$core$ICounted$ = true;
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = (function (node){
var this__10294 = this;
return 2;
});
cljs.core.BlackNode.prototype.cljs$core$IStack$ = true;
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = (function (node){
var this__10295 = this;
return this__10295.val;
});
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = (function (node){
var this__10296 = this;
return cljs.core.PersistentVector.fromArray([this__10296.key]);
});
cljs.core.BlackNode.prototype.cljs$core$IVector$ = true;
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = (function (node,n,v){
var this__10297 = this;
return cljs.core._assoc_n.call(null,cljs.core.PersistentVector.fromArray([this__10297.key,this__10297.val]),n,v);
});
cljs.core.BlackNode.prototype.cljs$core$IEquiv$ = true;
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__10298 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$ = true;
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (node,meta){
var this__10299 = this;
return cljs.core.with_meta.call(null,cljs.core.PersistentVector.fromArray([this__10299.key,this__10299.val]),meta);
});
cljs.core.BlackNode.prototype.cljs$core$IMeta$ = true;
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = (function (node){
var this__10300 = this;
return null;
});
cljs.core.BlackNode.prototype.cljs$core$IIndexed$ = true;
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (node,n){
var this__10301 = this;
if((n === 0))
{return this__10301.key;
} else
{if((n === 1))
{return this__10301.val;
} else
{if("\uFDD0'else")
{return null;
} else
{return null;
}
}
}
});
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (node,n,not_found){
var this__10302 = this;
if((n === 0))
{return this__10302.key;
} else
{if((n === 1))
{return this__10302.val;
} else
{if("\uFDD0'else")
{return not_found;
} else
{return null;
}
}
}
});
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (node){
var this__10293 = this;
return cljs.core.PersistentVector.fromArray([]);
});
cljs.core.BlackNode;

/**
* @constructor
*/
cljs.core.RedNode = (function (key,val,left,right,__hash){
this.key = key;
this.val = val;
this.left = left;
this.right = right;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 16201119;
})
cljs.core.RedNode.cljs$lang$type = true;
cljs.core.RedNode.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.RedNode");
});
cljs.core.RedNode.prototype.cljs$core$IHash$ = true;
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__10309 = this;
var h__2236__auto____10310 = this__10309.__hash;
if((h__2236__auto____10310 != null))
{return h__2236__auto____10310;
} else
{var h__2236__auto____10311 = cljs.core.hash_coll.call(null,coll);
this__10309.__hash = h__2236__auto____10311;
return h__2236__auto____10311;
}
});
cljs.core.RedNode.prototype.cljs$core$ILookup$ = true;
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (node,k){
var this__10312 = this;
return cljs.core._nth.call(null,node,k,null);
});
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (node,k,not_found){
var this__10313 = this;
return cljs.core._nth.call(null,node,k,not_found);
});
cljs.core.RedNode.prototype.cljs$core$IAssociative$ = true;
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (node,k,v){
var this__10314 = this;
return cljs.core.assoc.call(null,cljs.core.PersistentVector.fromArray([this__10314.key,this__10314.val]),k,v);
});
cljs.core.RedNode.prototype.cljs$core$IFn$ = true;
cljs.core.RedNode.prototype.call = (function() {
var G__10361 = null;
var G__10361__2 = (function (tsym10307,k){
var this__10315 = this;
var tsym10307__10316 = this;
var node__10317 = tsym10307__10316;
return cljs.core._lookup.call(null,node__10317,k);
});
var G__10361__3 = (function (tsym10308,k,not_found){
var this__10318 = this;
var tsym10308__10319 = this;
var node__10320 = tsym10308__10319;
return cljs.core._lookup.call(null,node__10320,k,not_found);
});
G__10361 = function(tsym10308,k,not_found){
switch(arguments.length){
case 2:
return G__10361__2.call(this,tsym10308,k);
case 3:
return G__10361__3.call(this,tsym10308,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10361;
})()
;
cljs.core.RedNode.prototype.apply = (function (tsym10305,args10306){
return tsym10305.call.apply(tsym10305,[tsym10305].concat(cljs.core.aclone.call(null,args10306)));
});
cljs.core.RedNode.prototype.cljs$core$ISequential$ = true;
cljs.core.RedNode.prototype.cljs$core$ICollection$ = true;
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = (function (node,o){
var this__10321 = this;
return cljs.core.PersistentVector.fromArray([this__10321.key,this__10321.val,o]);
});
cljs.core.RedNode.prototype.cljs$core$IMapEntry$ = true;
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = (function (node){
var this__10322 = this;
return this__10322.key;
});
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = (function (node){
var this__10323 = this;
return this__10323.val;
});
cljs.core.RedNode.prototype.add_right = (function (ins){
var this__10324 = this;
var node__10325 = this;
return (new cljs.core.RedNode(this__10324.key,this__10324.val,this__10324.left,ins,null));
});
cljs.core.RedNode.prototype.redden = (function (){
var this__10326 = this;
var node__10327 = this;
throw (new Error("red-black tree invariant violation"));
});
cljs.core.RedNode.prototype.remove_right = (function (del){
var this__10328 = this;
var node__10329 = this;
return (new cljs.core.RedNode(this__10328.key,this__10328.val,this__10328.left,del,null));
});
cljs.core.RedNode.prototype.replace = (function (key,val,left,right){
var this__10330 = this;
var node__10331 = this;
return (new cljs.core.RedNode(key,val,left,right,null));
});
cljs.core.RedNode.prototype.kv_reduce = (function (f,init){
var this__10332 = this;
var node__10333 = this;
return cljs.core.tree_map_kv_reduce.call(null,node__10333,f,init);
});
cljs.core.RedNode.prototype.remove_left = (function (del){
var this__10334 = this;
var node__10335 = this;
return (new cljs.core.RedNode(this__10334.key,this__10334.val,del,this__10334.right,null));
});
cljs.core.RedNode.prototype.add_left = (function (ins){
var this__10336 = this;
var node__10337 = this;
return (new cljs.core.RedNode(this__10336.key,this__10336.val,ins,this__10336.right,null));
});
cljs.core.RedNode.prototype.balance_left = (function (parent){
var this__10338 = this;
var node__10339 = this;
if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,this__10338.left))
{return (new cljs.core.RedNode(this__10338.key,this__10338.val,this__10338.left.blacken(),(new cljs.core.BlackNode(parent.key,parent.val,this__10338.right,parent.right,null)),null));
} else
{if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,this__10338.right))
{return (new cljs.core.RedNode(this__10338.right.key,this__10338.right.val,(new cljs.core.BlackNode(this__10338.key,this__10338.val,this__10338.left,this__10338.right.left,null)),(new cljs.core.BlackNode(parent.key,parent.val,this__10338.right.right,parent.right,null)),null));
} else
{if("\uFDD0'else")
{return (new cljs.core.BlackNode(parent.key,parent.val,node__10339,parent.right,null));
} else
{return null;
}
}
}
});
cljs.core.RedNode.prototype.toString = (function() {
var G__10362 = null;
var G__10362__0 = (function (){
var this__10342 = this;
var this$__10343 = this;
return cljs.core.pr_str.call(null,this$__10343);
});
G__10362 = function(){
switch(arguments.length){
case 0:
return G__10362__0.call(this);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10362;
})()
;
cljs.core.RedNode.prototype.balance_right = (function (parent){
var this__10344 = this;
var node__10345 = this;
if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,this__10344.right))
{return (new cljs.core.RedNode(this__10344.key,this__10344.val,(new cljs.core.BlackNode(parent.key,parent.val,parent.left,this__10344.left,null)),this__10344.right.blacken(),null));
} else
{if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,this__10344.left))
{return (new cljs.core.RedNode(this__10344.left.key,this__10344.left.val,(new cljs.core.BlackNode(parent.key,parent.val,parent.left,this__10344.left.left,null)),(new cljs.core.BlackNode(this__10344.key,this__10344.val,this__10344.left.right,this__10344.right,null)),null));
} else
{if("\uFDD0'else")
{return (new cljs.core.BlackNode(parent.key,parent.val,parent.left,node__10345,null));
} else
{return null;
}
}
}
});
cljs.core.RedNode.prototype.blacken = (function (){
var this__10346 = this;
var node__10347 = this;
return (new cljs.core.BlackNode(this__10346.key,this__10346.val,this__10346.left,this__10346.right,null));
});
cljs.core.RedNode.prototype.cljs$core$IReduce$ = true;
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (node,f){
var this__10348 = this;
return cljs.core.ci_reduce.call(null,node,f);
});
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (node,f,start){
var this__10349 = this;
return cljs.core.ci_reduce.call(null,node,f,start);
});
cljs.core.RedNode.prototype.cljs$core$ISeqable$ = true;
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (node){
var this__10350 = this;
return cljs.core.list.call(null,this__10350.key,this__10350.val);
});
cljs.core.RedNode.prototype.cljs$core$ICounted$ = true;
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = (function (node){
var this__10352 = this;
return 2;
});
cljs.core.RedNode.prototype.cljs$core$IStack$ = true;
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = (function (node){
var this__10353 = this;
return this__10353.val;
});
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = (function (node){
var this__10354 = this;
return cljs.core.PersistentVector.fromArray([this__10354.key]);
});
cljs.core.RedNode.prototype.cljs$core$IVector$ = true;
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = (function (node,n,v){
var this__10355 = this;
return cljs.core._assoc_n.call(null,cljs.core.PersistentVector.fromArray([this__10355.key,this__10355.val]),n,v);
});
cljs.core.RedNode.prototype.cljs$core$IEquiv$ = true;
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__10356 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.RedNode.prototype.cljs$core$IWithMeta$ = true;
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (node,meta){
var this__10357 = this;
return cljs.core.with_meta.call(null,cljs.core.PersistentVector.fromArray([this__10357.key,this__10357.val]),meta);
});
cljs.core.RedNode.prototype.cljs$core$IMeta$ = true;
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = (function (node){
var this__10358 = this;
return null;
});
cljs.core.RedNode.prototype.cljs$core$IIndexed$ = true;
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (node,n){
var this__10359 = this;
if((n === 0))
{return this__10359.key;
} else
{if((n === 1))
{return this__10359.val;
} else
{if("\uFDD0'else")
{return null;
} else
{return null;
}
}
}
});
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (node,n,not_found){
var this__10360 = this;
if((n === 0))
{return this__10360.key;
} else
{if((n === 1))
{return this__10360.val;
} else
{if("\uFDD0'else")
{return not_found;
} else
{return null;
}
}
}
});
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (node){
var this__10351 = this;
return cljs.core.PersistentVector.fromArray([]);
});
cljs.core.RedNode;
cljs.core.tree_map_add = (function tree_map_add(comp,tree,k,v,found){
if((tree == null))
{return (new cljs.core.RedNode(k,v,null,null,null));
} else
{var c__10363 = comp.call(null,k,tree.key);
if((c__10363 === 0))
{(found[0] = tree);
return null;
} else
{if((c__10363 < 0))
{var ins__10364 = tree_map_add.call(null,comp,tree.left,k,v,found);
if((ins__10364 != null))
{return tree.add_left(ins__10364);
} else
{return null;
}
} else
{if("\uFDD0'else")
{var ins__10365 = tree_map_add.call(null,comp,tree.right,k,v,found);
if((ins__10365 != null))
{return tree.add_right(ins__10365);
} else
{return null;
}
} else
{return null;
}
}
}
}
});
cljs.core.tree_map_append = (function tree_map_append(left,right){
if((left == null))
{return right;
} else
{if((right == null))
{return left;
} else
{if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,left))
{if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,right))
{var app__10366 = tree_map_append.call(null,left.right,right.left);
if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,app__10366))
{return (new cljs.core.RedNode(app__10366.key,app__10366.val,(new cljs.core.RedNode(left.key,left.val,left.left,app__10366.left)),(new cljs.core.RedNode(right.key,right.val,app__10366.right,right.right)),null));
} else
{return (new cljs.core.RedNode(left.key,left.val,left.left,(new cljs.core.RedNode(right.key,right.val,app__10366,right.right,null)),null));
}
} else
{return (new cljs.core.RedNode(left.key,left.val,left.left,tree_map_append.call(null,left.right,right),null));
}
} else
{if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,right))
{return (new cljs.core.RedNode(right.key,right.val,tree_map_append.call(null,left,right.left),right.right,null));
} else
{if("\uFDD0'else")
{var app__10367 = tree_map_append.call(null,left.right,right.left);
if(cljs.core.instance_QMARK_.call(null,cljs.core.RedNode,app__10367))
{return (new cljs.core.RedNode(app__10367.key,app__10367.val,(new cljs.core.BlackNode(left.key,left.val,left.left,app__10367.left,null)),(new cljs.core.BlackNode(right.key,right.val,app__10367.right,right.right,null)),null));
} else
{return cljs.core.balance_left_del.call(null,left.key,left.val,left.left,(new cljs.core.BlackNode(right.key,right.val,app__10367,right.right,null)));
}
} else
{return null;
}
}
}
}
}
});
cljs.core.tree_map_remove = (function tree_map_remove(comp,tree,k,found){
if((tree != null))
{var c__10368 = comp.call(null,k,tree.key);
if((c__10368 === 0))
{(found[0] = tree);
return cljs.core.tree_map_append.call(null,tree.left,tree.right);
} else
{if((c__10368 < 0))
{var del__10369 = tree_map_remove.call(null,comp,tree.left,k,found);
if((function (){var or__138__auto____10370 = (del__10369 != null);
if(or__138__auto____10370)
{return or__138__auto____10370;
} else
{return ((found[0]) != null);
}
})())
{if(cljs.core.instance_QMARK_.call(null,cljs.core.BlackNode,tree.left))
{return cljs.core.balance_left_del.call(null,tree.key,tree.val,del__10369,tree.right);
} else
{return (new cljs.core.RedNode(tree.key,tree.val,del__10369,tree.right,null));
}
} else
{return null;
}
} else
{if("\uFDD0'else")
{var del__10371 = tree_map_remove.call(null,comp,tree.right,k,found);
if((function (){var or__138__auto____10372 = (del__10371 != null);
if(or__138__auto____10372)
{return or__138__auto____10372;
} else
{return ((found[0]) != null);
}
})())
{if(cljs.core.instance_QMARK_.call(null,cljs.core.BlackNode,tree.right))
{return cljs.core.balance_right_del.call(null,tree.key,tree.val,tree.left,del__10371);
} else
{return (new cljs.core.RedNode(tree.key,tree.val,tree.left,del__10371,null));
}
} else
{return null;
}
} else
{return null;
}
}
}
} else
{return null;
}
});
cljs.core.tree_map_replace = (function tree_map_replace(comp,tree,k,v){
var tk__10373 = tree.key;
var c__10374 = comp.call(null,k,tk__10373);
if((c__10374 === 0))
{return tree.replace(tk__10373,v,tree.left,tree.right);
} else
{if((c__10374 < 0))
{return tree.replace(tk__10373,tree.val,tree_map_replace.call(null,comp,tree.left,k,v),tree.right);
} else
{if("\uFDD0'else")
{return tree.replace(tk__10373,tree.val,tree.left,tree_map_replace.call(null,comp,tree.right,k,v));
} else
{return null;
}
}
}
});
void 0;

/**
* @constructor
*/
cljs.core.PersistentTreeMap = (function (comp,tree,cnt,meta,__hash){
this.comp = comp;
this.tree = tree;
this.cnt = cnt;
this.meta = meta;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 209388431;
})
cljs.core.PersistentTreeMap.cljs$lang$type = true;
cljs.core.PersistentTreeMap.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentTreeMap");
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__10379 = this;
var h__2236__auto____10380 = this__10379.__hash;
if((h__2236__auto____10380 != null))
{return h__2236__auto____10380;
} else
{var h__2236__auto____10381 = cljs.core.hash_imap.call(null,coll);
this__10379.__hash = h__2236__auto____10381;
return h__2236__auto____10381;
}
});
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,k){
var this__10382 = this;
return cljs.core._lookup.call(null,coll,k,null);
});
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,k,not_found){
var this__10383 = this;
var n__10384 = coll.entry_at(k);
if((n__10384 != null))
{return n__10384.val;
} else
{return not_found;
}
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (coll,k,v){
var this__10385 = this;
var found__10386 = [null];
var t__10387 = cljs.core.tree_map_add.call(null,this__10385.comp,this__10385.tree,k,v,found__10386);
if((t__10387 == null))
{var found_node__10388 = cljs.core.nth.call(null,found__10386,0);
if(cljs.core._EQ_.call(null,v,found_node__10388.val))
{return coll;
} else
{return (new cljs.core.PersistentTreeMap(this__10385.comp,cljs.core.tree_map_replace.call(null,this__10385.comp,this__10385.tree,k,v),this__10385.cnt,this__10385.meta,null));
}
} else
{return (new cljs.core.PersistentTreeMap(this__10385.comp,t__10387.blacken(),(this__10385.cnt + 1),this__10385.meta,null));
}
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (coll,k){
var this__10389 = this;
return (coll.entry_at(k) != null);
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentTreeMap.prototype.call = (function() {
var G__10421 = null;
var G__10421__2 = (function (tsym10377,k){
var this__10390 = this;
var tsym10377__10391 = this;
var coll__10392 = tsym10377__10391;
return cljs.core._lookup.call(null,coll__10392,k);
});
var G__10421__3 = (function (tsym10378,k,not_found){
var this__10393 = this;
var tsym10378__10394 = this;
var coll__10395 = tsym10378__10394;
return cljs.core._lookup.call(null,coll__10395,k,not_found);
});
G__10421 = function(tsym10378,k,not_found){
switch(arguments.length){
case 2:
return G__10421__2.call(this,tsym10378,k);
case 3:
return G__10421__3.call(this,tsym10378,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10421;
})()
;
cljs.core.PersistentTreeMap.prototype.apply = (function (tsym10375,args10376){
return tsym10375.call.apply(tsym10375,[tsym10375].concat(cljs.core.aclone.call(null,args10376)));
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (coll,f,init){
var this__10396 = this;
if((this__10396.tree != null))
{return cljs.core.tree_map_kv_reduce.call(null,this__10396.tree,f,init);
} else
{return init;
}
});
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,entry){
var this__10397 = this;
if(cljs.core.vector_QMARK_.call(null,entry))
{return cljs.core._assoc.call(null,coll,cljs.core._nth.call(null,entry,0),cljs.core._nth.call(null,entry,1));
} else
{return cljs.core.reduce.call(null,cljs.core._conj,coll,entry);
}
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = (function (coll){
var this__10398 = this;
if((this__10398.cnt > 0))
{return cljs.core.create_tree_map_seq.call(null,this__10398.tree,false,this__10398.cnt);
} else
{return null;
}
});
cljs.core.PersistentTreeMap.prototype.toString = (function (){
var this__10399 = this;
var this$__10400 = this;
return cljs.core.pr_str.call(null,this$__10400);
});
cljs.core.PersistentTreeMap.prototype.entry_at = (function (k){
var this__10401 = this;
var coll__10402 = this;
var t__10403 = this__10401.tree;
while(true){
if((t__10403 != null))
{var c__10404 = this__10401.comp.call(null,k,t__10403.key);
if((c__10404 === 0))
{return t__10403;
} else
{if((c__10404 < 0))
{{
var G__10422 = t__10403.left;
t__10403 = G__10422;
continue;
}
} else
{if("\uFDD0'else")
{{
var G__10423 = t__10403.right;
t__10403 = G__10423;
continue;
}
} else
{return null;
}
}
}
} else
{return null;
}
break;
}
});
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = (function (coll,ascending_QMARK_){
var this__10405 = this;
if((this__10405.cnt > 0))
{return cljs.core.create_tree_map_seq.call(null,this__10405.tree,ascending_QMARK_,this__10405.cnt);
} else
{return null;
}
});
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = (function (coll,k,ascending_QMARK_){
var this__10406 = this;
if((this__10406.cnt > 0))
{var stack__10407 = null;
var t__10408 = this__10406.tree;
while(true){
if((t__10408 != null))
{var c__10409 = this__10406.comp.call(null,k,t__10408.key);
if((c__10409 === 0))
{return (new cljs.core.PersistentTreeMapSeq(null,cljs.core.conj.call(null,stack__10407,t__10408),ascending_QMARK_,-1));
} else
{if(cljs.core.truth_(ascending_QMARK_))
{if((c__10409 < 0))
{{
var G__10424 = cljs.core.conj.call(null,stack__10407,t__10408);
var G__10425 = t__10408.left;
stack__10407 = G__10424;
t__10408 = G__10425;
continue;
}
} else
{{
var G__10426 = stack__10407;
var G__10427 = t__10408.right;
stack__10407 = G__10426;
t__10408 = G__10427;
continue;
}
}
} else
{if("\uFDD0'else")
{if((c__10409 > 0))
{{
var G__10428 = cljs.core.conj.call(null,stack__10407,t__10408);
var G__10429 = t__10408.right;
stack__10407 = G__10428;
t__10408 = G__10429;
continue;
}
} else
{{
var G__10430 = stack__10407;
var G__10431 = t__10408.left;
stack__10407 = G__10430;
t__10408 = G__10431;
continue;
}
}
} else
{return null;
}
}
}
} else
{if((stack__10407 == null))
{return (new cljs.core.PersistentTreeMapSeq(null,stack__10407,ascending_QMARK_,-1));
} else
{return null;
}
}
break;
}
} else
{return null;
}
});
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_entry_key$arity$2 = (function (coll,entry){
var this__10410 = this;
return cljs.core.key.call(null,entry);
});
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = (function (coll){
var this__10411 = this;
return this__10411.comp;
});
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__10412 = this;
if((this__10412.cnt > 0))
{return cljs.core.create_tree_map_seq.call(null,this__10412.tree,true,this__10412.cnt);
} else
{return null;
}
});
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__10413 = this;
return this__10413.cnt;
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__10414 = this;
return cljs.core.equiv_map.call(null,coll,other);
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__10415 = this;
return (new cljs.core.PersistentTreeMap(this__10415.comp,this__10415.tree,this__10415.cnt,meta,this__10415.__hash));
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__10419 = this;
return this__10419.meta;
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__10420 = this;
return cljs.core.with_meta.call(null,cljs.core.PersistentTreeMap.EMPTY,this__10420.meta);
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (coll,k){
var this__10416 = this;
var found__10417 = [null];
var t__10418 = cljs.core.tree_map_remove.call(null,this__10416.comp,this__10416.tree,k,found__10417);
if((t__10418 == null))
{if((cljs.core.nth.call(null,found__10417,0) == null))
{return coll;
} else
{return (new cljs.core.PersistentTreeMap(this__10416.comp,null,0,this__10416.meta,null));
}
} else
{return (new cljs.core.PersistentTreeMap(this__10416.comp,t__10418.blacken(),(this__10416.cnt - 1),this__10416.meta,null));
}
});
cljs.core.PersistentTreeMap;
cljs.core.PersistentTreeMap.EMPTY = (new cljs.core.PersistentTreeMap(cljs.core.compare,null,0,null,0));
/**
* keyval => key val
* Returns a new hash map with supplied mappings.
* @param {...*} var_args
*/
cljs.core.hash_map = (function() { 
var hash_map__delegate = function (keyvals){
var in$__10432 = cljs.core.seq.call(null,keyvals);
var out__10433 = cljs.core.transient$.call(null,cljs.core.PersistentHashMap.EMPTY);
while(true){
if(cljs.core.truth_(in$__10432))
{{
var G__10434 = cljs.core.nnext.call(null,in$__10432);
var G__10435 = cljs.core.assoc_BANG_.call(null,out__10433,cljs.core.first.call(null,in$__10432),cljs.core.second.call(null,in$__10432));
in$__10432 = G__10434;
out__10433 = G__10435;
continue;
}
} else
{return cljs.core.persistent_BANG_.call(null,out__10433);
}
break;
}
};
var hash_map = function (var_args){
var keyvals = null;
if (goog.isDef(var_args)) {
  keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return hash_map__delegate.call(this, keyvals);
};
hash_map.cljs$lang$maxFixedArity = 0;
hash_map.cljs$lang$applyTo = (function (arglist__10436){
var keyvals = cljs.core.seq(arglist__10436);;
return hash_map__delegate(keyvals);
});
hash_map.cljs$lang$arity$variadic = hash_map__delegate;
return hash_map;
})()
;
/**
* keyval => key val
* Returns a new array map with supplied mappings.
* @param {...*} var_args
*/
cljs.core.array_map = (function() { 
var array_map__delegate = function (keyvals){
return (new cljs.core.PersistentArrayMap(null,cljs.core.quot.call(null,cljs.core.count.call(null,keyvals),2),cljs.core.apply.call(null,cljs.core.array,keyvals),null));
};
var array_map = function (var_args){
var keyvals = null;
if (goog.isDef(var_args)) {
  keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return array_map__delegate.call(this, keyvals);
};
array_map.cljs$lang$maxFixedArity = 0;
array_map.cljs$lang$applyTo = (function (arglist__10437){
var keyvals = cljs.core.seq(arglist__10437);;
return array_map__delegate(keyvals);
});
array_map.cljs$lang$arity$variadic = array_map__delegate;
return array_map;
})()
;
/**
* keyval => key val
* Returns a new sorted map with supplied mappings.
* @param {...*} var_args
*/
cljs.core.sorted_map = (function() { 
var sorted_map__delegate = function (keyvals){
var in$__10438 = cljs.core.seq.call(null,keyvals);
var out__10439 = cljs.core.PersistentTreeMap.EMPTY;
while(true){
if(cljs.core.truth_(in$__10438))
{{
var G__10440 = cljs.core.nnext.call(null,in$__10438);
var G__10441 = cljs.core.assoc.call(null,out__10439,cljs.core.first.call(null,in$__10438),cljs.core.second.call(null,in$__10438));
in$__10438 = G__10440;
out__10439 = G__10441;
continue;
}
} else
{return out__10439;
}
break;
}
};
var sorted_map = function (var_args){
var keyvals = null;
if (goog.isDef(var_args)) {
  keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return sorted_map__delegate.call(this, keyvals);
};
sorted_map.cljs$lang$maxFixedArity = 0;
sorted_map.cljs$lang$applyTo = (function (arglist__10442){
var keyvals = cljs.core.seq(arglist__10442);;
return sorted_map__delegate(keyvals);
});
sorted_map.cljs$lang$arity$variadic = sorted_map__delegate;
return sorted_map;
})()
;
/**
* keyval => key val
* Returns a new sorted map with supplied mappings, using the supplied comparator.
* @param {...*} var_args
*/
cljs.core.sorted_map_by = (function() { 
var sorted_map_by__delegate = function (comparator,keyvals){
var in$__10443 = cljs.core.seq.call(null,keyvals);
var out__10444 = (new cljs.core.PersistentTreeMap(comparator,null,0,null,0));
while(true){
if(cljs.core.truth_(in$__10443))
{{
var G__10445 = cljs.core.nnext.call(null,in$__10443);
var G__10446 = cljs.core.assoc.call(null,out__10444,cljs.core.first.call(null,in$__10443),cljs.core.second.call(null,in$__10443));
in$__10443 = G__10445;
out__10444 = G__10446;
continue;
}
} else
{return out__10444;
}
break;
}
};
var sorted_map_by = function (comparator,var_args){
var keyvals = null;
if (goog.isDef(var_args)) {
  keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return sorted_map_by__delegate.call(this, comparator, keyvals);
};
sorted_map_by.cljs$lang$maxFixedArity = 1;
sorted_map_by.cljs$lang$applyTo = (function (arglist__10447){
var comparator = cljs.core.first(arglist__10447);
var keyvals = cljs.core.rest(arglist__10447);
return sorted_map_by__delegate(comparator, keyvals);
});
sorted_map_by.cljs$lang$arity$variadic = sorted_map_by__delegate;
return sorted_map_by;
})()
;
/**
* Returns a sequence of the map's keys.
*/
cljs.core.keys = (function keys(hash_map){
return cljs.core.seq.call(null,cljs.core.map.call(null,cljs.core.first,hash_map));
});
/**
* Returns the key of the map entry.
*/
cljs.core.key = (function key(map_entry){
return cljs.core._key.call(null,map_entry);
});
/**
* Returns a sequence of the map's values.
*/
cljs.core.vals = (function vals(hash_map){
return cljs.core.seq.call(null,cljs.core.map.call(null,cljs.core.second,hash_map));
});
/**
* Returns the value in the map entry.
*/
cljs.core.val = (function val(map_entry){
return cljs.core._val.call(null,map_entry);
});
/**
* Returns a map that consists of the rest of the maps conj-ed onto
* the first.  If a key occurs in more than one map, the mapping from
* the latter (left-to-right) will be the mapping in the result.
* @param {...*} var_args
*/
cljs.core.merge = (function() { 
var merge__delegate = function (maps){
if(cljs.core.truth_(cljs.core.some.call(null,cljs.core.identity,maps)))
{return cljs.core.reduce.call(null,(function (p1__10448_SHARP_,p2__10449_SHARP_){
return cljs.core.conj.call(null,(function (){var or__138__auto____10450 = p1__10448_SHARP_;
if(cljs.core.truth_(or__138__auto____10450))
{return or__138__auto____10450;
} else
{return cljs.core.ObjMap.fromObject([],{});
}
})(),p2__10449_SHARP_);
}),maps);
} else
{return null;
}
};
var merge = function (var_args){
var maps = null;
if (goog.isDef(var_args)) {
  maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return merge__delegate.call(this, maps);
};
merge.cljs$lang$maxFixedArity = 0;
merge.cljs$lang$applyTo = (function (arglist__10451){
var maps = cljs.core.seq(arglist__10451);;
return merge__delegate(maps);
});
merge.cljs$lang$arity$variadic = merge__delegate;
return merge;
})()
;
/**
* Returns a map that consists of the rest of the maps conj-ed onto
* the first.  If a key occurs in more than one map, the mapping(s)
* from the latter (left-to-right) will be combined with the mapping in
* the result by calling (f val-in-result val-in-latter).
* @param {...*} var_args
*/
cljs.core.merge_with = (function() { 
var merge_with__delegate = function (f,maps){
if(cljs.core.truth_(cljs.core.some.call(null,cljs.core.identity,maps)))
{var merge_entry__10454 = (function (m,e){
var k__10452 = cljs.core.first.call(null,e);
var v__10453 = cljs.core.second.call(null,e);
if(cljs.core.contains_QMARK_.call(null,m,k__10452))
{return cljs.core.assoc.call(null,m,k__10452,f.call(null,cljs.core.get.call(null,m,k__10452),v__10453));
} else
{return cljs.core.assoc.call(null,m,k__10452,v__10453);
}
});
var merge2__10456 = (function (m1,m2){
return cljs.core.reduce.call(null,merge_entry__10454,(function (){var or__138__auto____10455 = m1;
if(cljs.core.truth_(or__138__auto____10455))
{return or__138__auto____10455;
} else
{return cljs.core.ObjMap.fromObject([],{});
}
})(),cljs.core.seq.call(null,m2));
});
return cljs.core.reduce.call(null,merge2__10456,maps);
} else
{return null;
}
};
var merge_with = function (f,var_args){
var maps = null;
if (goog.isDef(var_args)) {
  maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return merge_with__delegate.call(this, f, maps);
};
merge_with.cljs$lang$maxFixedArity = 1;
merge_with.cljs$lang$applyTo = (function (arglist__10457){
var f = cljs.core.first(arglist__10457);
var maps = cljs.core.rest(arglist__10457);
return merge_with__delegate(f, maps);
});
merge_with.cljs$lang$arity$variadic = merge_with__delegate;
return merge_with;
})()
;
/**
* Returns a map containing only those entries in map whose key is in keys
*/
cljs.core.select_keys = (function select_keys(map,keyseq){
var ret__10458 = cljs.core.ObjMap.fromObject([],{});
var keys__10459 = cljs.core.seq.call(null,keyseq);
while(true){
if(cljs.core.truth_(keys__10459))
{var key__10460 = cljs.core.first.call(null,keys__10459);
var entry__10461 = cljs.core.get.call(null,map,key__10460,"\uFDD0'user/not-found");
{
var G__10462 = ((cljs.core.not_EQ_.call(null,entry__10461,"\uFDD0'user/not-found"))?cljs.core.assoc.call(null,ret__10458,key__10460,entry__10461):ret__10458);
var G__10463 = cljs.core.next.call(null,keys__10459);
ret__10458 = G__10462;
keys__10459 = G__10463;
continue;
}
} else
{return ret__10458;
}
break;
}
});
void 0;

/**
* @constructor
*/
cljs.core.PersistentHashSet = (function (meta,hash_map,__hash){
this.meta = meta;
this.hash_map = hash_map;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 2155022479;
})
cljs.core.PersistentHashSet.cljs$lang$type = true;
cljs.core.PersistentHashSet.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentHashSet");
});
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = (function (coll){
var this__10469 = this;
return (new cljs.core.TransientHashSet(cljs.core.transient$.call(null,this__10469.hash_map)));
});
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__10470 = this;
var h__2236__auto____10471 = this__10470.__hash;
if((h__2236__auto____10471 != null))
{return h__2236__auto____10471;
} else
{var h__2236__auto____10472 = cljs.core.hash_iset.call(null,coll);
this__10470.__hash = h__2236__auto____10472;
return h__2236__auto____10472;
}
});
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,v){
var this__10473 = this;
return cljs.core._lookup.call(null,coll,v,null);
});
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,v,not_found){
var this__10474 = this;
if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null,this__10474.hash_map,v)))
{return v;
} else
{return not_found;
}
});
cljs.core.PersistentHashSet.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentHashSet.prototype.call = (function() {
var G__10493 = null;
var G__10493__2 = (function (tsym10467,k){
var this__10475 = this;
var tsym10467__10476 = this;
var coll__10477 = tsym10467__10476;
return cljs.core._lookup.call(null,coll__10477,k);
});
var G__10493__3 = (function (tsym10468,k,not_found){
var this__10478 = this;
var tsym10468__10479 = this;
var coll__10480 = tsym10468__10479;
return cljs.core._lookup.call(null,coll__10480,k,not_found);
});
G__10493 = function(tsym10468,k,not_found){
switch(arguments.length){
case 2:
return G__10493__2.call(this,tsym10468,k);
case 3:
return G__10493__3.call(this,tsym10468,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10493;
})()
;
cljs.core.PersistentHashSet.prototype.apply = (function (tsym10465,args10466){
return tsym10465.call.apply(tsym10465,[tsym10465].concat(cljs.core.aclone.call(null,args10466)));
});
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__10481 = this;
return (new cljs.core.PersistentHashSet(this__10481.meta,cljs.core.assoc.call(null,this__10481.hash_map,o,null),null));
});
cljs.core.PersistentHashSet.prototype.toString = (function (){
var this__10482 = this;
var this$__10483 = this;
return cljs.core.pr_str.call(null,this$__10483);
});
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__10484 = this;
return cljs.core.keys.call(null,this__10484.hash_map);
});
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = (function (coll,v){
var this__10485 = this;
return (new cljs.core.PersistentHashSet(this__10485.meta,cljs.core.dissoc.call(null,this__10485.hash_map,v),null));
});
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__10486 = this;
return cljs.core.count.call(null,cljs.core.seq.call(null,coll));
});
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__10487 = this;
var and__132__auto____10488 = cljs.core.set_QMARK_.call(null,other);
if(and__132__auto____10488)
{var and__132__auto____10489 = (cljs.core.count.call(null,coll) === cljs.core.count.call(null,other));
if(and__132__auto____10489)
{return cljs.core.every_QMARK_.call(null,(function (p1__10464_SHARP_){
return cljs.core.contains_QMARK_.call(null,coll,p1__10464_SHARP_);
}),other);
} else
{return and__132__auto____10489;
}
} else
{return and__132__auto____10488;
}
});
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__10490 = this;
return (new cljs.core.PersistentHashSet(meta,this__10490.hash_map,this__10490.__hash));
});
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__10491 = this;
return this__10491.meta;
});
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__10492 = this;
return cljs.core.with_meta.call(null,cljs.core.PersistentHashSet.EMPTY,this__10492.meta);
});
cljs.core.PersistentHashSet;
cljs.core.PersistentHashSet.EMPTY = (new cljs.core.PersistentHashSet(null,cljs.core.hash_map.call(null),0));

/**
* @constructor
*/
cljs.core.TransientHashSet = (function (transient_map){
this.transient_map = transient_map;
this.cljs$lang$protocol_mask$partition0$ = 131;
this.cljs$lang$protocol_mask$partition1$ = 17;
})
cljs.core.TransientHashSet.cljs$lang$type = true;
cljs.core.TransientHashSet.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.TransientHashSet");
});
cljs.core.TransientHashSet.prototype.cljs$core$IFn$ = true;
cljs.core.TransientHashSet.prototype.call = (function() {
var G__10511 = null;
var G__10511__2 = (function (tsym10497,k){
var this__10499 = this;
var tsym10497__10500 = this;
var tcoll__10501 = tsym10497__10500;
if((cljs.core._lookup.call(null,this__10499.transient_map,k,cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel))
{return null;
} else
{return k;
}
});
var G__10511__3 = (function (tsym10498,k,not_found){
var this__10502 = this;
var tsym10498__10503 = this;
var tcoll__10504 = tsym10498__10503;
if((cljs.core._lookup.call(null,this__10502.transient_map,k,cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel))
{return not_found;
} else
{return k;
}
});
G__10511 = function(tsym10498,k,not_found){
switch(arguments.length){
case 2:
return G__10511__2.call(this,tsym10498,k);
case 3:
return G__10511__3.call(this,tsym10498,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10511;
})()
;
cljs.core.TransientHashSet.prototype.apply = (function (tsym10495,args10496){
return tsym10495.call.apply(tsym10495,[tsym10495].concat(cljs.core.aclone.call(null,args10496)));
});
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (tcoll,v){
var this__10505 = this;
return cljs.core._lookup.call(null,tcoll,v,null);
});
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (tcoll,v,not_found){
var this__10506 = this;
if((cljs.core._lookup.call(null,this__10506.transient_map,v,cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel))
{return not_found;
} else
{return v;
}
});
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = (function (tcoll){
var this__10507 = this;
return cljs.core.count.call(null,this__10507.transient_map);
});
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = (function (tcoll,v){
var this__10508 = this;
this__10508.transient_map = cljs.core.dissoc_BANG_.call(null,this__10508.transient_map,v);
return tcoll;
});
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$ = true;
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = (function (tcoll,o){
var this__10509 = this;
this__10509.transient_map = cljs.core.assoc_BANG_.call(null,this__10509.transient_map,o,null);
return tcoll;
});
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = (function (tcoll){
var this__10510 = this;
return (new cljs.core.PersistentHashSet(null,cljs.core.persistent_BANG_.call(null,this__10510.transient_map),null));
});
cljs.core.TransientHashSet;

/**
* @constructor
*/
cljs.core.PersistentTreeSet = (function (meta,tree_map,__hash){
this.meta = meta;
this.tree_map = tree_map;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 208865423;
})
cljs.core.PersistentTreeSet.cljs$lang$type = true;
cljs.core.PersistentTreeSet.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentTreeSet");
});
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = (function (coll){
var this__10516 = this;
var h__2236__auto____10517 = this__10516.__hash;
if((h__2236__auto____10517 != null))
{return h__2236__auto____10517;
} else
{var h__2236__auto____10518 = cljs.core.hash_iset.call(null,coll);
this__10516.__hash = h__2236__auto____10518;
return h__2236__auto____10518;
}
});
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (coll,v){
var this__10519 = this;
return cljs.core._lookup.call(null,coll,v,null);
});
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (coll,v,not_found){
var this__10520 = this;
if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null,this__10520.tree_map,v)))
{return v;
} else
{return not_found;
}
});
cljs.core.PersistentTreeSet.prototype.cljs$core$IFn$ = true;
cljs.core.PersistentTreeSet.prototype.call = (function() {
var G__10544 = null;
var G__10544__2 = (function (tsym10514,k){
var this__10521 = this;
var tsym10514__10522 = this;
var coll__10523 = tsym10514__10522;
return cljs.core._lookup.call(null,coll__10523,k);
});
var G__10544__3 = (function (tsym10515,k,not_found){
var this__10524 = this;
var tsym10515__10525 = this;
var coll__10526 = tsym10515__10525;
return cljs.core._lookup.call(null,coll__10526,k,not_found);
});
G__10544 = function(tsym10515,k,not_found){
switch(arguments.length){
case 2:
return G__10544__2.call(this,tsym10515,k);
case 3:
return G__10544__3.call(this,tsym10515,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__10544;
})()
;
cljs.core.PersistentTreeSet.prototype.apply = (function (tsym10512,args10513){
return tsym10512.call.apply(tsym10512,[tsym10512].concat(cljs.core.aclone.call(null,args10513)));
});
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = (function (coll,o){
var this__10527 = this;
return (new cljs.core.PersistentTreeSet(this__10527.meta,cljs.core.assoc.call(null,this__10527.tree_map,o,null),null));
});
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = (function (coll){
var this__10528 = this;
return cljs.core.map.call(null,cljs.core.key,cljs.core.rseq.call(null,this__10528.tree_map));
});
cljs.core.PersistentTreeSet.prototype.toString = (function (){
var this__10529 = this;
var this$__10530 = this;
return cljs.core.pr_str.call(null,this$__10530);
});
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = (function (coll,ascending_QMARK_){
var this__10531 = this;
return cljs.core.map.call(null,cljs.core.key,cljs.core._sorted_seq.call(null,this__10531.tree_map,ascending_QMARK_));
});
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = (function (coll,k,ascending_QMARK_){
var this__10532 = this;
return cljs.core.map.call(null,cljs.core.key,cljs.core._sorted_seq_from.call(null,this__10532.tree_map,k,ascending_QMARK_));
});
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = (function (coll,entry){
var this__10533 = this;
return entry;
});
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = (function (coll){
var this__10534 = this;
return cljs.core._comparator.call(null,this__10534.tree_map);
});
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (coll){
var this__10535 = this;
return cljs.core.keys.call(null,this__10535.tree_map);
});
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = (function (coll,v){
var this__10536 = this;
return (new cljs.core.PersistentTreeSet(this__10536.meta,cljs.core.dissoc.call(null,this__10536.tree_map,v),null));
});
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = (function (coll){
var this__10537 = this;
return cljs.core.count.call(null,this__10537.tree_map);
});
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (coll,other){
var this__10538 = this;
var and__132__auto____10539 = cljs.core.set_QMARK_.call(null,other);
if(and__132__auto____10539)
{var and__132__auto____10540 = (cljs.core.count.call(null,coll) === cljs.core.count.call(null,other));
if(and__132__auto____10540)
{return cljs.core.every_QMARK_.call(null,(function (p1__10494_SHARP_){
return cljs.core.contains_QMARK_.call(null,coll,p1__10494_SHARP_);
}),other);
} else
{return and__132__auto____10540;
}
} else
{return and__132__auto____10539;
}
});
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (coll,meta){
var this__10541 = this;
return (new cljs.core.PersistentTreeSet(meta,this__10541.tree_map,this__10541.__hash));
});
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = (function (coll){
var this__10542 = this;
return this__10542.meta;
});
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (coll){
var this__10543 = this;
return cljs.core.with_meta.call(null,cljs.core.PersistentTreeSet.EMPTY,this__10543.meta);
});
cljs.core.PersistentTreeSet;
cljs.core.PersistentTreeSet.EMPTY = (new cljs.core.PersistentTreeSet(null,cljs.core.sorted_map.call(null),0));
/**
* Returns a set of the distinct elements of coll.
*/
cljs.core.set = (function set(coll){
var in$__10545 = cljs.core.seq.call(null,coll);
var out__10546 = cljs.core.transient$.call(null,cljs.core.PersistentHashSet.EMPTY);
while(true){
if(cljs.core.truth_(cljs.core.seq.call(null,in$__10545)))
{{
var G__10547 = cljs.core.next.call(null,in$__10545);
var G__10548 = cljs.core.conj_BANG_.call(null,out__10546,cljs.core.first.call(null,in$__10545));
in$__10545 = G__10547;
out__10546 = G__10548;
continue;
}
} else
{return cljs.core.persistent_BANG_.call(null,out__10546);
}
break;
}
});
/**
* Returns a new sorted set with supplied keys.
* @param {...*} var_args
*/
cljs.core.sorted_set = (function() { 
var sorted_set__delegate = function (keys){
return cljs.core.reduce.call(null,cljs.core._conj,cljs.core.PersistentTreeSet.EMPTY,keys);
};
var sorted_set = function (var_args){
var keys = null;
if (goog.isDef(var_args)) {
  keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return sorted_set__delegate.call(this, keys);
};
sorted_set.cljs$lang$maxFixedArity = 0;
sorted_set.cljs$lang$applyTo = (function (arglist__10549){
var keys = cljs.core.seq(arglist__10549);;
return sorted_set__delegate(keys);
});
sorted_set.cljs$lang$arity$variadic = sorted_set__delegate;
return sorted_set;
})()
;
/**
* Returns a new sorted set with supplied keys, using the supplied comparator.
* @param {...*} var_args
*/
cljs.core.sorted_set_by = (function() { 
var sorted_set_by__delegate = function (comparator,keys){
return cljs.core.reduce.call(null,cljs.core._conj,(new cljs.core.PersistentTreeSet(null,cljs.core.sorted_map_by.call(null,comparator),0)),keys);
};
var sorted_set_by = function (comparator,var_args){
var keys = null;
if (goog.isDef(var_args)) {
  keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return sorted_set_by__delegate.call(this, comparator, keys);
};
sorted_set_by.cljs$lang$maxFixedArity = 1;
sorted_set_by.cljs$lang$applyTo = (function (arglist__10551){
var comparator = cljs.core.first(arglist__10551);
var keys = cljs.core.rest(arglist__10551);
return sorted_set_by__delegate(comparator, keys);
});
sorted_set_by.cljs$lang$arity$variadic = sorted_set_by__delegate;
return sorted_set_by;
})()
;
/**
* Given a map of replacement pairs and a vector/collection, returns a
* vector/seq with any elements = a key in smap replaced with the
* corresponding val in smap
*/
cljs.core.replace = (function replace(smap,coll){
if(cljs.core.vector_QMARK_.call(null,coll))
{var n__10552 = cljs.core.count.call(null,coll);
return cljs.core.reduce.call(null,(function (v,i){
var temp__317__auto____10553 = cljs.core.find.call(null,smap,cljs.core.nth.call(null,v,i));
if(cljs.core.truth_(temp__317__auto____10553))
{var e__10554 = temp__317__auto____10553;
return cljs.core.assoc.call(null,v,i,cljs.core.second.call(null,e__10554));
} else
{return v;
}
}),coll,cljs.core.take.call(null,n__10552,cljs.core.iterate.call(null,cljs.core.inc,0)));
} else
{return cljs.core.map.call(null,(function (p1__10550_SHARP_){
var temp__317__auto____10555 = cljs.core.find.call(null,smap,p1__10550_SHARP_);
if(cljs.core.truth_(temp__317__auto____10555))
{var e__10556 = temp__317__auto____10555;
return cljs.core.second.call(null,e__10556);
} else
{return p1__10550_SHARP_;
}
}),coll);
}
});
/**
* Returns a lazy sequence of the elements of coll with duplicates removed
*/
cljs.core.distinct = (function distinct(coll){
var step__10564 = (function step(xs,seen){
return (new cljs.core.LazySeq(null,false,(function (){
return (function (p__10557,seen){
while(true){
var vec__10558__10559 = p__10557;
var f__10560 = cljs.core.nth.call(null,vec__10558__10559,0,null);
var xs__10561 = vec__10558__10559;
var temp__324__auto____10562 = cljs.core.seq.call(null,xs__10561);
if(cljs.core.truth_(temp__324__auto____10562))
{var s__10563 = temp__324__auto____10562;
if(cljs.core.contains_QMARK_.call(null,seen,f__10560))
{{
var G__10565 = cljs.core.rest.call(null,s__10563);
var G__10566 = seen;
p__10557 = G__10565;
seen = G__10566;
continue;
}
} else
{return cljs.core.cons.call(null,f__10560,step.call(null,cljs.core.rest.call(null,s__10563),cljs.core.conj.call(null,seen,f__10560)));
}
} else
{return null;
}
break;
}
}).call(null,xs,seen);
})));
});
return step__10564.call(null,coll,cljs.core.set([]));
});
cljs.core.butlast = (function butlast(s){
var ret__10567 = cljs.core.PersistentVector.fromArray([]);
var s__10568 = s;
while(true){
if(cljs.core.truth_(cljs.core.next.call(null,s__10568)))
{{
var G__10569 = cljs.core.conj.call(null,ret__10567,cljs.core.first.call(null,s__10568));
var G__10570 = cljs.core.next.call(null,s__10568);
ret__10567 = G__10569;
s__10568 = G__10570;
continue;
}
} else
{return cljs.core.seq.call(null,ret__10567);
}
break;
}
});
/**
* Returns the name String of a string, symbol or keyword.
*/
cljs.core.name = (function name(x){
if(cljs.core.string_QMARK_.call(null,x))
{return x;
} else
{if((function (){var or__138__auto____10571 = cljs.core.keyword_QMARK_.call(null,x);
if(or__138__auto____10571)
{return or__138__auto____10571;
} else
{return cljs.core.symbol_QMARK_.call(null,x);
}
})())
{var i__10572 = x.lastIndexOf("/");
if((i__10572 < 0))
{return cljs.core.subs.call(null,x,2);
} else
{return cljs.core.subs.call(null,x,(i__10572 + 1));
}
} else
{if("\uFDD0'else")
{throw (new Error([cljs.core.str("Doesn't support name: "),cljs.core.str(x)].join('')));
} else
{return null;
}
}
}
});
/**
* Returns the namespace String of a symbol or keyword, or nil if not present.
*/
cljs.core.namespace = (function namespace(x){
if((function (){var or__138__auto____10573 = cljs.core.keyword_QMARK_.call(null,x);
if(or__138__auto____10573)
{return or__138__auto____10573;
} else
{return cljs.core.symbol_QMARK_.call(null,x);
}
})())
{var i__10574 = x.lastIndexOf("/");
if((i__10574 > -1))
{return cljs.core.subs.call(null,x,2,i__10574);
} else
{return null;
}
} else
{throw (new Error([cljs.core.str("Doesn't support namespace: "),cljs.core.str(x)].join('')));
}
});
/**
* Returns a map with the keys mapped to the corresponding vals.
*/
cljs.core.zipmap = (function zipmap(keys,vals){
var map__10577 = cljs.core.ObjMap.fromObject([],{});
var ks__10578 = cljs.core.seq.call(null,keys);
var vs__10579 = cljs.core.seq.call(null,vals);
while(true){
if(cljs.core.truth_((function (){var and__132__auto____10580 = ks__10578;
if(cljs.core.truth_(and__132__auto____10580))
{return vs__10579;
} else
{return and__132__auto____10580;
}
})()))
{{
var G__10581 = cljs.core.assoc.call(null,map__10577,cljs.core.first.call(null,ks__10578),cljs.core.first.call(null,vs__10579));
var G__10582 = cljs.core.next.call(null,ks__10578);
var G__10583 = cljs.core.next.call(null,vs__10579);
map__10577 = G__10581;
ks__10578 = G__10582;
vs__10579 = G__10583;
continue;
}
} else
{return map__10577;
}
break;
}
});
/**
* Returns the x for which (k x), a number, is greatest.
* @param {...*} var_args
*/
cljs.core.max_key = (function() {
var max_key = null;
var max_key__2 = (function (k,x){
return x;
});
var max_key__3 = (function (k,x,y){
if((k.call(null,x) > k.call(null,y)))
{return x;
} else
{return y;
}
});
var max_key__4 = (function() { 
var G__10586__delegate = function (k,x,y,more){
return cljs.core.reduce.call(null,(function (p1__10575_SHARP_,p2__10576_SHARP_){
return max_key.call(null,k,p1__10575_SHARP_,p2__10576_SHARP_);
}),max_key.call(null,k,x,y),more);
};
var G__10586 = function (k,x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__10586__delegate.call(this, k, x, y, more);
};
G__10586.cljs$lang$maxFixedArity = 3;
G__10586.cljs$lang$applyTo = (function (arglist__10587){
var k = cljs.core.first(arglist__10587);
var x = cljs.core.first(cljs.core.next(arglist__10587));
var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__10587)));
var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__10587)));
return G__10586__delegate(k, x, y, more);
});
G__10586.cljs$lang$arity$variadic = G__10586__delegate;
return G__10586;
})()
;
max_key = function(k,x,y,var_args){
var more = var_args;
switch(arguments.length){
case 2:
return max_key__2.call(this,k,x);
case 3:
return max_key__3.call(this,k,x,y);
default:
return max_key__4.cljs$lang$arity$variadic(k,x,y, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
max_key.cljs$lang$maxFixedArity = 3;
max_key.cljs$lang$applyTo = max_key__4.cljs$lang$applyTo;
max_key.cljs$lang$arity$2 = max_key__2;
max_key.cljs$lang$arity$3 = max_key__3;
max_key.cljs$lang$arity$variadic = max_key__4.cljs$lang$arity$variadic;
return max_key;
})()
;
/**
* Returns the x for which (k x), a number, is least.
* @param {...*} var_args
*/
cljs.core.min_key = (function() {
var min_key = null;
var min_key__2 = (function (k,x){
return x;
});
var min_key__3 = (function (k,x,y){
if((k.call(null,x) < k.call(null,y)))
{return x;
} else
{return y;
}
});
var min_key__4 = (function() { 
var G__10588__delegate = function (k,x,y,more){
return cljs.core.reduce.call(null,(function (p1__10584_SHARP_,p2__10585_SHARP_){
return min_key.call(null,k,p1__10584_SHARP_,p2__10585_SHARP_);
}),min_key.call(null,k,x,y),more);
};
var G__10588 = function (k,x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__10588__delegate.call(this, k, x, y, more);
};
G__10588.cljs$lang$maxFixedArity = 3;
G__10588.cljs$lang$applyTo = (function (arglist__10589){
var k = cljs.core.first(arglist__10589);
var x = cljs.core.first(cljs.core.next(arglist__10589));
var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__10589)));
var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__10589)));
return G__10588__delegate(k, x, y, more);
});
G__10588.cljs$lang$arity$variadic = G__10588__delegate;
return G__10588;
})()
;
min_key = function(k,x,y,var_args){
var more = var_args;
switch(arguments.length){
case 2:
return min_key__2.call(this,k,x);
case 3:
return min_key__3.call(this,k,x,y);
default:
return min_key__4.cljs$lang$arity$variadic(k,x,y, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
min_key.cljs$lang$maxFixedArity = 3;
min_key.cljs$lang$applyTo = min_key__4.cljs$lang$applyTo;
min_key.cljs$lang$arity$2 = min_key__2;
min_key.cljs$lang$arity$3 = min_key__3;
min_key.cljs$lang$arity$variadic = min_key__4.cljs$lang$arity$variadic;
return min_key;
})()
;
/**
* Returns a lazy sequence of lists like partition, but may include
* partitions with fewer than n items at the end.
*/
cljs.core.partition_all = (function() {
var partition_all = null;
var partition_all__2 = (function (n,coll){
return partition_all.call(null,n,n,coll);
});
var partition_all__3 = (function (n,step,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____10590 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____10590))
{var s__10591 = temp__324__auto____10590;
return cljs.core.cons.call(null,cljs.core.take.call(null,n,s__10591),partition_all.call(null,n,step,cljs.core.drop.call(null,step,s__10591)));
} else
{return null;
}
})));
});
partition_all = function(n,step,coll){
switch(arguments.length){
case 2:
return partition_all__2.call(this,n,step);
case 3:
return partition_all__3.call(this,n,step,coll);
}
throw('Invalid arity: ' + arguments.length);
};
partition_all.cljs$lang$arity$2 = partition_all__2;
partition_all.cljs$lang$arity$3 = partition_all__3;
return partition_all;
})()
;
/**
* Returns a lazy sequence of successive items from coll while
* (pred item) returns true. pred must be free of side-effects.
*/
cljs.core.take_while = (function take_while(pred,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____10592 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____10592))
{var s__10593 = temp__324__auto____10592;
if(cljs.core.truth_(pred.call(null,cljs.core.first.call(null,s__10593))))
{return cljs.core.cons.call(null,cljs.core.first.call(null,s__10593),take_while.call(null,pred,cljs.core.rest.call(null,s__10593)));
} else
{return null;
}
} else
{return null;
}
})));
});
cljs.core.mk_bound_fn = (function mk_bound_fn(sc,test,key){
return (function (e){
var comp__10594 = cljs.core._comparator.call(null,sc);
return test.call(null,comp__10594.call(null,cljs.core._entry_key.call(null,sc,e),key),0);
});
});
/**
* sc must be a sorted collection, test(s) one of <, <=, > or
* >=. Returns a seq of those entries with keys ek for
* which (test (.. sc comparator (compare ek key)) 0) is true
*/
cljs.core.subseq = (function() {
var subseq = null;
var subseq__3 = (function (sc,test,key){
var include__10595 = cljs.core.mk_bound_fn.call(null,sc,test,key);
if(cljs.core.truth_(cljs.core.set([cljs.core._GT_,cljs.core._GT__EQ_]).call(null,test)))
{var temp__324__auto____10596 = cljs.core._sorted_seq_from.call(null,sc,key,true);
if(cljs.core.truth_(temp__324__auto____10596))
{var vec__10597__10598 = temp__324__auto____10596;
var e__10599 = cljs.core.nth.call(null,vec__10597__10598,0,null);
var s__10600 = vec__10597__10598;
if(cljs.core.truth_(include__10595.call(null,e__10599)))
{return s__10600;
} else
{return cljs.core.next.call(null,s__10600);
}
} else
{return null;
}
} else
{return cljs.core.take_while.call(null,include__10595,cljs.core._sorted_seq.call(null,sc,true));
}
});
var subseq__5 = (function (sc,start_test,start_key,end_test,end_key){
var temp__324__auto____10601 = cljs.core._sorted_seq_from.call(null,sc,start_key,true);
if(cljs.core.truth_(temp__324__auto____10601))
{var vec__10602__10603 = temp__324__auto____10601;
var e__10604 = cljs.core.nth.call(null,vec__10602__10603,0,null);
var s__10605 = vec__10602__10603;
return cljs.core.take_while.call(null,cljs.core.mk_bound_fn.call(null,sc,end_test,end_key),(cljs.core.truth_(cljs.core.mk_bound_fn.call(null,sc,start_test,start_key).call(null,e__10604))?s__10605:cljs.core.next.call(null,s__10605)));
} else
{return null;
}
});
subseq = function(sc,start_test,start_key,end_test,end_key){
switch(arguments.length){
case 3:
return subseq__3.call(this,sc,start_test,start_key);
case 5:
return subseq__5.call(this,sc,start_test,start_key,end_test,end_key);
}
throw('Invalid arity: ' + arguments.length);
};
subseq.cljs$lang$arity$3 = subseq__3;
subseq.cljs$lang$arity$5 = subseq__5;
return subseq;
})()
;
/**
* sc must be a sorted collection, test(s) one of <, <=, > or
* >=. Returns a reverse seq of those entries with keys ek for
* which (test (.. sc comparator (compare ek key)) 0) is true
*/
cljs.core.rsubseq = (function() {
var rsubseq = null;
var rsubseq__3 = (function (sc,test,key){
var include__10606 = cljs.core.mk_bound_fn.call(null,sc,test,key);
if(cljs.core.truth_(cljs.core.set([cljs.core._LT_,cljs.core._LT__EQ_]).call(null,test)))
{var temp__324__auto____10607 = cljs.core._sorted_seq_from.call(null,sc,key,false);
if(cljs.core.truth_(temp__324__auto____10607))
{var vec__10608__10609 = temp__324__auto____10607;
var e__10610 = cljs.core.nth.call(null,vec__10608__10609,0,null);
var s__10611 = vec__10608__10609;
if(cljs.core.truth_(include__10606.call(null,e__10610)))
{return s__10611;
} else
{return cljs.core.next.call(null,s__10611);
}
} else
{return null;
}
} else
{return cljs.core.take_while.call(null,include__10606,cljs.core._sorted_seq.call(null,sc,false));
}
});
var rsubseq__5 = (function (sc,start_test,start_key,end_test,end_key){
var temp__324__auto____10612 = cljs.core._sorted_seq_from.call(null,sc,end_key,false);
if(cljs.core.truth_(temp__324__auto____10612))
{var vec__10613__10614 = temp__324__auto____10612;
var e__10615 = cljs.core.nth.call(null,vec__10613__10614,0,null);
var s__10616 = vec__10613__10614;
return cljs.core.take_while.call(null,cljs.core.mk_bound_fn.call(null,sc,start_test,start_key),(cljs.core.truth_(cljs.core.mk_bound_fn.call(null,sc,end_test,end_key).call(null,e__10615))?s__10616:cljs.core.next.call(null,s__10616)));
} else
{return null;
}
});
rsubseq = function(sc,start_test,start_key,end_test,end_key){
switch(arguments.length){
case 3:
return rsubseq__3.call(this,sc,start_test,start_key);
case 5:
return rsubseq__5.call(this,sc,start_test,start_key,end_test,end_key);
}
throw('Invalid arity: ' + arguments.length);
};
rsubseq.cljs$lang$arity$3 = rsubseq__3;
rsubseq.cljs$lang$arity$5 = rsubseq__5;
return rsubseq;
})()
;

/**
* @constructor
*/
cljs.core.Range = (function (meta,start,end,step,__hash){
this.meta = meta;
this.start = start;
this.end = end;
this.step = step;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 16187486;
})
cljs.core.Range.cljs$lang$type = true;
cljs.core.Range.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.Range");
});
cljs.core.Range.prototype.cljs$core$IHash$ = true;
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = (function (rng){
var this__10617 = this;
var h__2236__auto____10618 = this__10617.__hash;
if((h__2236__auto____10618 != null))
{return h__2236__auto____10618;
} else
{var h__2236__auto____10619 = cljs.core.hash_coll.call(null,rng);
this__10617.__hash = h__2236__auto____10619;
return h__2236__auto____10619;
}
});
cljs.core.Range.prototype.cljs$core$ISequential$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = (function (rng,o){
var this__10620 = this;
return cljs.core.cons.call(null,o,rng);
});
cljs.core.Range.prototype.toString = (function (){
var this__10621 = this;
var this$__10622 = this;
return cljs.core.pr_str.call(null,this$__10622);
});
cljs.core.Range.prototype.cljs$core$IReduce$ = true;
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = (function (rng,f){
var this__10623 = this;
return cljs.core.ci_reduce.call(null,rng,f);
});
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = (function (rng,f,s){
var this__10624 = this;
return cljs.core.ci_reduce.call(null,rng,f,s);
});
cljs.core.Range.prototype.cljs$core$ISeqable$ = true;
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (rng){
var this__10625 = this;
var comp__10626 = (((this__10625.step > 0))?cljs.core._LT_:cljs.core._GT_);
if(cljs.core.truth_(comp__10626.call(null,this__10625.start,this__10625.end)))
{return rng;
} else
{return null;
}
});
cljs.core.Range.prototype.cljs$core$ICounted$ = true;
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = (function (rng){
var this__10627 = this;
if(cljs.core.not.call(null,cljs.core._seq.call(null,rng)))
{return 0;
} else
{return Math['ceil'](((this__10627.end - this__10627.start) / this__10627.step));
}
});
cljs.core.Range.prototype.cljs$core$ISeq$ = true;
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = (function (rng){
var this__10628 = this;
return this__10628.start;
});
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = (function (rng){
var this__10629 = this;
if(cljs.core.truth_(cljs.core._seq.call(null,rng)))
{return (new cljs.core.Range(this__10629.meta,(this__10629.start + this__10629.step),this__10629.end,this__10629.step,null));
} else
{return cljs.core.list.call(null);
}
});
cljs.core.Range.prototype.cljs$core$IEquiv$ = true;
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (rng,other){
var this__10630 = this;
return cljs.core.equiv_sequential.call(null,rng,other);
});
cljs.core.Range.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (rng,meta){
var this__10631 = this;
return (new cljs.core.Range(meta,this__10631.start,this__10631.end,this__10631.step,this__10631.__hash));
});
cljs.core.Range.prototype.cljs$core$IMeta$ = true;
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = (function (rng){
var this__10632 = this;
return this__10632.meta;
});
cljs.core.Range.prototype.cljs$core$IIndexed$ = true;
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = (function (rng,n){
var this__10633 = this;
if((n < cljs.core._count.call(null,rng)))
{return (this__10633.start + (n * this__10633.step));
} else
{if((function (){var and__132__auto____10634 = (this__10633.start > this__10633.end);
if(and__132__auto____10634)
{return (this__10633.step === 0);
} else
{return and__132__auto____10634;
}
})())
{return this__10633.start;
} else
{throw (new Error("Index out of bounds"));
}
}
});
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = (function (rng,n,not_found){
var this__10635 = this;
if((n < cljs.core._count.call(null,rng)))
{return (this__10635.start + (n * this__10635.step));
} else
{if((function (){var and__132__auto____10636 = (this__10635.start > this__10635.end);
if(and__132__auto____10636)
{return (this__10635.step === 0);
} else
{return and__132__auto____10636;
}
})())
{return this__10635.start;
} else
{return not_found;
}
}
});
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = (function (rng){
var this__10637 = this;
return cljs.core.with_meta.call(null,cljs.core.List.EMPTY,this__10637.meta);
});
cljs.core.Range;
/**
* Returns a lazy seq of nums from start (inclusive) to end
* (exclusive), by step, where start defaults to 0, step to 1,
* and end to infinity.
*/
cljs.core.range = (function() {
var range = null;
var range__0 = (function (){
return range.call(null,0,Number['MAX_VALUE'],1);
});
var range__1 = (function (end){
return range.call(null,0,end,1);
});
var range__2 = (function (start,end){
return range.call(null,start,end,1);
});
var range__3 = (function (start,end,step){
return (new cljs.core.Range(null,start,end,step,null));
});
range = function(start,end,step){
switch(arguments.length){
case 0:
return range__0.call(this);
case 1:
return range__1.call(this,start);
case 2:
return range__2.call(this,start,end);
case 3:
return range__3.call(this,start,end,step);
}
throw('Invalid arity: ' + arguments.length);
};
range.cljs$lang$arity$0 = range__0;
range.cljs$lang$arity$1 = range__1;
range.cljs$lang$arity$2 = range__2;
range.cljs$lang$arity$3 = range__3;
return range;
})()
;
/**
* Returns a lazy seq of every nth item in coll.
*/
cljs.core.take_nth = (function take_nth(n,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____10638 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____10638))
{var s__10639 = temp__324__auto____10638;
return cljs.core.cons.call(null,cljs.core.first.call(null,s__10639),take_nth.call(null,n,cljs.core.drop.call(null,n,s__10639)));
} else
{return null;
}
})));
});
/**
* Returns a vector of [(take-while pred coll) (drop-while pred coll)]
*/
cljs.core.split_with = (function split_with(pred,coll){
return cljs.core.PersistentVector.fromArray([cljs.core.take_while.call(null,pred,coll),cljs.core.drop_while.call(null,pred,coll)]);
});
/**
* Applies f to each value in coll, splitting it each time f returns
* a new value.  Returns a lazy seq of partitions.
*/
cljs.core.partition_by = (function partition_by(f,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____10641 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____10641))
{var s__10642 = temp__324__auto____10641;
var fst__10643 = cljs.core.first.call(null,s__10642);
var fv__10644 = f.call(null,fst__10643);
var run__10645 = cljs.core.cons.call(null,fst__10643,cljs.core.take_while.call(null,(function (p1__10640_SHARP_){
return cljs.core._EQ_.call(null,fv__10644,f.call(null,p1__10640_SHARP_));
}),cljs.core.next.call(null,s__10642)));
return cljs.core.cons.call(null,run__10645,partition_by.call(null,f,cljs.core.seq.call(null,cljs.core.drop.call(null,cljs.core.count.call(null,run__10645),s__10642))));
} else
{return null;
}
})));
});
/**
* Returns a map from distinct items in coll to the number of times
* they appear.
*/
cljs.core.frequencies = (function frequencies(coll){
return cljs.core.persistent_BANG_.call(null,cljs.core.reduce.call(null,(function (counts,x){
return cljs.core.assoc_BANG_.call(null,counts,x,(cljs.core.get.call(null,counts,x,0) + 1));
}),cljs.core.transient$.call(null,cljs.core.ObjMap.fromObject([],{})),coll));
});
/**
* Returns a lazy seq of the intermediate values of the reduction (as
* per reduce) of coll by f, starting with init.
*/
cljs.core.reductions = (function() {
var reductions = null;
var reductions__2 = (function (f,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__317__auto____10656 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__317__auto____10656))
{var s__10657 = temp__317__auto____10656;
return reductions.call(null,f,cljs.core.first.call(null,s__10657),cljs.core.rest.call(null,s__10657));
} else
{return cljs.core.list.call(null,f.call(null));
}
})));
});
var reductions__3 = (function (f,init,coll){
return cljs.core.cons.call(null,init,(new cljs.core.LazySeq(null,false,(function (){
var temp__324__auto____10658 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(temp__324__auto____10658))
{var s__10659 = temp__324__auto____10658;
return reductions.call(null,f,f.call(null,init,cljs.core.first.call(null,s__10659)),cljs.core.rest.call(null,s__10659));
} else
{return null;
}
}))));
});
reductions = function(f,init,coll){
switch(arguments.length){
case 2:
return reductions__2.call(this,f,init);
case 3:
return reductions__3.call(this,f,init,coll);
}
throw('Invalid arity: ' + arguments.length);
};
reductions.cljs$lang$arity$2 = reductions__2;
reductions.cljs$lang$arity$3 = reductions__3;
return reductions;
})()
;
/**
* Takes a set of functions and returns a fn that is the juxtaposition
* of those fns.  The returned fn takes a variable number of args, and
* returns a vector containing the result of applying each fn to the
* args (left-to-right).
* ((juxt a b c) x) => [(a x) (b x) (c x)]
* @param {...*} var_args
*/
cljs.core.juxt = (function() {
var juxt = null;
var juxt__1 = (function (f){
return (function() {
var G__10661 = null;
var G__10661__0 = (function (){
return cljs.core.vector.call(null,f.call(null));
});
var G__10661__1 = (function (x){
return cljs.core.vector.call(null,f.call(null,x));
});
var G__10661__2 = (function (x,y){
return cljs.core.vector.call(null,f.call(null,x,y));
});
var G__10661__3 = (function (x,y,z){
return cljs.core.vector.call(null,f.call(null,x,y,z));
});
var G__10661__4 = (function() { 
var G__10662__delegate = function (x,y,z,args){
return cljs.core.vector.call(null,cljs.core.apply.call(null,f,x,y,z,args));
};
var G__10662 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__10662__delegate.call(this, x, y, z, args);
};
G__10662.cljs$lang$maxFixedArity = 3;
G__10662.cljs$lang$applyTo = (function (arglist__10663){
var x = cljs.core.first(arglist__10663);
var y = cljs.core.first(cljs.core.next(arglist__10663));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__10663)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__10663)));
return G__10662__delegate(x, y, z, args);
});
G__10662.cljs$lang$arity$variadic = G__10662__delegate;
return G__10662;
})()
;
G__10661 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return G__10661__0.call(this);
case 1:
return G__10661__1.call(this,x);
case 2:
return G__10661__2.call(this,x,y);
case 3:
return G__10661__3.call(this,x,y,z);
default:
return G__10661__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
G__10661.cljs$lang$maxFixedArity = 3;
G__10661.cljs$lang$applyTo = G__10661__4.cljs$lang$applyTo;
return G__10661;
})()
});
var juxt__2 = (function (f,g){
return (function() {
var G__10664 = null;
var G__10664__0 = (function (){
return cljs.core.vector.call(null,f.call(null),g.call(null));
});
var G__10664__1 = (function (x){
return cljs.core.vector.call(null,f.call(null,x),g.call(null,x));
});
var G__10664__2 = (function (x,y){
return cljs.core.vector.call(null,f.call(null,x,y),g.call(null,x,y));
});
var G__10664__3 = (function (x,y,z){
return cljs.core.vector.call(null,f.call(null,x,y,z),g.call(null,x,y,z));
});
var G__10664__4 = (function() { 
var G__10665__delegate = function (x,y,z,args){
return cljs.core.vector.call(null,cljs.core.apply.call(null,f,x,y,z,args),cljs.core.apply.call(null,g,x,y,z,args));
};
var G__10665 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__10665__delegate.call(this, x, y, z, args);
};
G__10665.cljs$lang$maxFixedArity = 3;
G__10665.cljs$lang$applyTo = (function (arglist__10666){
var x = cljs.core.first(arglist__10666);
var y = cljs.core.first(cljs.core.next(arglist__10666));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__10666)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__10666)));
return G__10665__delegate(x, y, z, args);
});
G__10665.cljs$lang$arity$variadic = G__10665__delegate;
return G__10665;
})()
;
G__10664 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return G__10664__0.call(this);
case 1:
return G__10664__1.call(this,x);
case 2:
return G__10664__2.call(this,x,y);
case 3:
return G__10664__3.call(this,x,y,z);
default:
return G__10664__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
G__10664.cljs$lang$maxFixedArity = 3;
G__10664.cljs$lang$applyTo = G__10664__4.cljs$lang$applyTo;
return G__10664;
})()
});
var juxt__3 = (function (f,g,h){
return (function() {
var G__10667 = null;
var G__10667__0 = (function (){
return cljs.core.vector.call(null,f.call(null),g.call(null),h.call(null));
});
var G__10667__1 = (function (x){
return cljs.core.vector.call(null,f.call(null,x),g.call(null,x),h.call(null,x));
});
var G__10667__2 = (function (x,y){
return cljs.core.vector.call(null,f.call(null,x,y),g.call(null,x,y),h.call(null,x,y));
});
var G__10667__3 = (function (x,y,z){
return cljs.core.vector.call(null,f.call(null,x,y,z),g.call(null,x,y,z),h.call(null,x,y,z));
});
var G__10667__4 = (function() { 
var G__10668__delegate = function (x,y,z,args){
return cljs.core.vector.call(null,cljs.core.apply.call(null,f,x,y,z,args),cljs.core.apply.call(null,g,x,y,z,args),cljs.core.apply.call(null,h,x,y,z,args));
};
var G__10668 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__10668__delegate.call(this, x, y, z, args);
};
G__10668.cljs$lang$maxFixedArity = 3;
G__10668.cljs$lang$applyTo = (function (arglist__10669){
var x = cljs.core.first(arglist__10669);
var y = cljs.core.first(cljs.core.next(arglist__10669));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__10669)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__10669)));
return G__10668__delegate(x, y, z, args);
});
G__10668.cljs$lang$arity$variadic = G__10668__delegate;
return G__10668;
})()
;
G__10667 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return G__10667__0.call(this);
case 1:
return G__10667__1.call(this,x);
case 2:
return G__10667__2.call(this,x,y);
case 3:
return G__10667__3.call(this,x,y,z);
default:
return G__10667__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
G__10667.cljs$lang$maxFixedArity = 3;
G__10667.cljs$lang$applyTo = G__10667__4.cljs$lang$applyTo;
return G__10667;
})()
});
var juxt__4 = (function() { 
var G__10670__delegate = function (f,g,h,fs){
var fs__10660 = cljs.core.list_STAR_.call(null,f,g,h,fs);
return (function() {
var G__10671 = null;
var G__10671__0 = (function (){
return cljs.core.reduce.call(null,(function (p1__10646_SHARP_,p2__10647_SHARP_){
return cljs.core.conj.call(null,p1__10646_SHARP_,p2__10647_SHARP_.call(null));
}),cljs.core.PersistentVector.fromArray([]),fs__10660);
});
var G__10671__1 = (function (x){
return cljs.core.reduce.call(null,(function (p1__10648_SHARP_,p2__10649_SHARP_){
return cljs.core.conj.call(null,p1__10648_SHARP_,p2__10649_SHARP_.call(null,x));
}),cljs.core.PersistentVector.fromArray([]),fs__10660);
});
var G__10671__2 = (function (x,y){
return cljs.core.reduce.call(null,(function (p1__10650_SHARP_,p2__10651_SHARP_){
return cljs.core.conj.call(null,p1__10650_SHARP_,p2__10651_SHARP_.call(null,x,y));
}),cljs.core.PersistentVector.fromArray([]),fs__10660);
});
var G__10671__3 = (function (x,y,z){
return cljs.core.reduce.call(null,(function (p1__10652_SHARP_,p2__10653_SHARP_){
return cljs.core.conj.call(null,p1__10652_SHARP_,p2__10653_SHARP_.call(null,x,y,z));
}),cljs.core.PersistentVector.fromArray([]),fs__10660);
});
var G__10671__4 = (function() { 
var G__10672__delegate = function (x,y,z,args){
return cljs.core.reduce.call(null,(function (p1__10654_SHARP_,p2__10655_SHARP_){
return cljs.core.conj.call(null,p1__10654_SHARP_,cljs.core.apply.call(null,p2__10655_SHARP_,x,y,z,args));
}),cljs.core.PersistentVector.fromArray([]),fs__10660);
};
var G__10672 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__10672__delegate.call(this, x, y, z, args);
};
G__10672.cljs$lang$maxFixedArity = 3;
G__10672.cljs$lang$applyTo = (function (arglist__10673){
var x = cljs.core.first(arglist__10673);
var y = cljs.core.first(cljs.core.next(arglist__10673));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__10673)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__10673)));
return G__10672__delegate(x, y, z, args);
});
G__10672.cljs$lang$arity$variadic = G__10672__delegate;
return G__10672;
})()
;
G__10671 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case 0:
return G__10671__0.call(this);
case 1:
return G__10671__1.call(this,x);
case 2:
return G__10671__2.call(this,x,y);
case 3:
return G__10671__3.call(this,x,y,z);
default:
return G__10671__4.cljs$lang$arity$variadic(x,y,z, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
G__10671.cljs$lang$maxFixedArity = 3;
G__10671.cljs$lang$applyTo = G__10671__4.cljs$lang$applyTo;
return G__10671;
})()
};
var G__10670 = function (f,g,h,var_args){
var fs = null;
if (goog.isDef(var_args)) {
  fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__10670__delegate.call(this, f, g, h, fs);
};
G__10670.cljs$lang$maxFixedArity = 3;
G__10670.cljs$lang$applyTo = (function (arglist__10674){
var f = cljs.core.first(arglist__10674);
var g = cljs.core.first(cljs.core.next(arglist__10674));
var h = cljs.core.first(cljs.core.next(cljs.core.next(arglist__10674)));
var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__10674)));
return G__10670__delegate(f, g, h, fs);
});
G__10670.cljs$lang$arity$variadic = G__10670__delegate;
return G__10670;
})()
;
juxt = function(f,g,h,var_args){
var fs = var_args;
switch(arguments.length){
case 1:
return juxt__1.call(this,f);
case 2:
return juxt__2.call(this,f,g);
case 3:
return juxt__3.call(this,f,g,h);
default:
return juxt__4.cljs$lang$arity$variadic(f,g,h, cljs.core.array_seq(arguments, 3));
}
throw('Invalid arity: ' + arguments.length);
};
juxt.cljs$lang$maxFixedArity = 3;
juxt.cljs$lang$applyTo = juxt__4.cljs$lang$applyTo;
juxt.cljs$lang$arity$1 = juxt__1;
juxt.cljs$lang$arity$2 = juxt__2;
juxt.cljs$lang$arity$3 = juxt__3;
juxt.cljs$lang$arity$variadic = juxt__4.cljs$lang$arity$variadic;
return juxt;
})()
;
/**
* When lazy sequences are produced via functions that have side
* effects, any effects other than those needed to produce the first
* element in the seq do not occur until the seq is consumed. dorun can
* be used to force any effects. Walks through the successive nexts of
* the seq, does not retain the head and returns nil.
*/
cljs.core.dorun = (function() {
var dorun = null;
var dorun__1 = (function (coll){
while(true){
if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{{
var G__10676 = cljs.core.next.call(null,coll);
coll = G__10676;
continue;
}
} else
{return null;
}
break;
}
});
var dorun__2 = (function (n,coll){
while(true){
if(cljs.core.truth_((function (){var and__132__auto____10675 = cljs.core.seq.call(null,coll);
if(cljs.core.truth_(and__132__auto____10675))
{return (n > 0);
} else
{return and__132__auto____10675;
}
})()))
{{
var G__10677 = (n - 1);
var G__10678 = cljs.core.next.call(null,coll);
n = G__10677;
coll = G__10678;
continue;
}
} else
{return null;
}
break;
}
});
dorun = function(n,coll){
switch(arguments.length){
case 1:
return dorun__1.call(this,n);
case 2:
return dorun__2.call(this,n,coll);
}
throw('Invalid arity: ' + arguments.length);
};
dorun.cljs$lang$arity$1 = dorun__1;
dorun.cljs$lang$arity$2 = dorun__2;
return dorun;
})()
;
/**
* When lazy sequences are produced via functions that have side
* effects, any effects other than those needed to produce the first
* element in the seq do not occur until the seq is consumed. doall can
* be used to force any effects. Walks through the successive nexts of
* the seq, retains the head and returns it, thus causing the entire
* seq to reside in memory at one time.
*/
cljs.core.doall = (function() {
var doall = null;
var doall__1 = (function (coll){
cljs.core.dorun.call(null,coll);
return coll;
});
var doall__2 = (function (n,coll){
cljs.core.dorun.call(null,n,coll);
return coll;
});
doall = function(n,coll){
switch(arguments.length){
case 1:
return doall__1.call(this,n);
case 2:
return doall__2.call(this,n,coll);
}
throw('Invalid arity: ' + arguments.length);
};
doall.cljs$lang$arity$1 = doall__1;
doall.cljs$lang$arity$2 = doall__2;
return doall;
})()
;
/**
* Returns the result of (re-find re s) if re fully matches s.
*/
cljs.core.re_matches = (function re_matches(re,s){
var matches__10679 = re.exec(s);
if(cljs.core._EQ_.call(null,cljs.core.first.call(null,matches__10679),s))
{if((cljs.core.count.call(null,matches__10679) === 1))
{return cljs.core.first.call(null,matches__10679);
} else
{return cljs.core.vec.call(null,matches__10679);
}
} else
{return null;
}
});
/**
* Returns the first regex match, if any, of s to re, using
* re.exec(s). Returns a vector, containing first the matching
* substring, then any capturing groups if the regular expression contains
* capturing groups.
*/
cljs.core.re_find = (function re_find(re,s){
var matches__10680 = re.exec(s);
if((matches__10680 == null))
{return null;
} else
{if((cljs.core.count.call(null,matches__10680) === 1))
{return cljs.core.first.call(null,matches__10680);
} else
{return cljs.core.vec.call(null,matches__10680);
}
}
});
/**
* Returns a lazy sequence of successive matches of re in s.
*/
cljs.core.re_seq = (function re_seq(re,s){
var match_data__10681 = cljs.core.re_find.call(null,re,s);
var match_idx__10682 = s.search(re);
var match_str__10683 = ((cljs.core.coll_QMARK_.call(null,match_data__10681))?cljs.core.first.call(null,match_data__10681):match_data__10681);
var post_match__10684 = cljs.core.subs.call(null,s,(match_idx__10682 + cljs.core.count.call(null,match_str__10683)));
if(cljs.core.truth_(match_data__10681))
{return (new cljs.core.LazySeq(null,false,(function (){
return cljs.core.cons.call(null,match_data__10681,re_seq.call(null,re,post_match__10684));
})));
} else
{return null;
}
});
/**
* Returns an instance of RegExp which has compiled the provided string.
*/
cljs.core.re_pattern = (function re_pattern(s){
var vec__10686__10687 = cljs.core.re_find.call(null,/^(?:\(\?([idmsux]*)\))?(.*)/,s);
var ___10688 = cljs.core.nth.call(null,vec__10686__10687,0,null);
var flags__10689 = cljs.core.nth.call(null,vec__10686__10687,1,null);
var pattern__10690 = cljs.core.nth.call(null,vec__10686__10687,2,null);
return (new RegExp(pattern__10690,flags__10689));
});
cljs.core.pr_sequential = (function pr_sequential(print_one,begin,sep,end,opts,coll){
return cljs.core.concat.call(null,cljs.core.PersistentVector.fromArray([begin]),cljs.core.flatten1.call(null,cljs.core.interpose.call(null,cljs.core.PersistentVector.fromArray([sep]),cljs.core.map.call(null,(function (p1__10685_SHARP_){
return print_one.call(null,p1__10685_SHARP_,opts);
}),coll))),cljs.core.PersistentVector.fromArray([end]));
});
cljs.core.string_print = (function string_print(x){
cljs.core._STAR_print_fn_STAR_.call(null,x);
return null;
});
cljs.core.flush = (function flush(){
return null;
});
cljs.core.pr_seq = (function pr_seq(obj,opts){
if((obj == null))
{return cljs.core.list.call(null,"nil");
} else
{if((void 0 === obj))
{return cljs.core.list.call(null,"#<undefined>");
} else
{if("\uFDD0'else")
{return cljs.core.concat.call(null,(cljs.core.truth_((function (){var and__132__auto____10691 = cljs.core.get.call(null,opts,"\uFDD0'meta");
if(cljs.core.truth_(and__132__auto____10691))
{var and__132__auto____10695 = (function (){var G__10692__10693 = obj;
if((G__10692__10693 != null))
{if((function (){var or__138__auto____10694 = (G__10692__10693.cljs$lang$protocol_mask$partition0$ & 65536);
if(or__138__auto____10694)
{return or__138__auto____10694;
} else
{return G__10692__10693.cljs$core$IMeta$;
}
})())
{return true;
} else
{if((!G__10692__10693.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IMeta,G__10692__10693);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IMeta,G__10692__10693);
}
})();
if(cljs.core.truth_(and__132__auto____10695))
{return cljs.core.meta.call(null,obj);
} else
{return and__132__auto____10695;
}
} else
{return and__132__auto____10691;
}
})())?cljs.core.concat.call(null,cljs.core.PersistentVector.fromArray(["^"]),pr_seq.call(null,cljs.core.meta.call(null,obj),opts),cljs.core.PersistentVector.fromArray([" "])):null),(cljs.core.truth_((function (){var and__132__auto____10696 = (obj != null);
if(and__132__auto____10696)
{return obj.cljs$lang$type;
} else
{return and__132__auto____10696;
}
})())?obj.cljs$lang$ctorPrSeq(obj):(((function (){var G__10697__10698 = obj;
if((G__10697__10698 != null))
{if((function (){var or__138__auto____10699 = (G__10697__10698.cljs$lang$protocol_mask$partition0$ & 268435456);
if(or__138__auto____10699)
{return or__138__auto____10699;
} else
{return G__10697__10698.cljs$core$IPrintable$;
}
})())
{return true;
} else
{if((!G__10697__10698.cljs$lang$protocol_mask$partition0$))
{return cljs.core.type_satisfies_.call(null,cljs.core.IPrintable,G__10697__10698);
} else
{return false;
}
}
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IPrintable,G__10697__10698);
}
})())?cljs.core._pr_seq.call(null,obj,opts):(("\uFDD0'else")?cljs.core.list.call(null,"#<",[cljs.core.str(obj)].join(''),">"):null))));
} else
{return null;
}
}
}
});
cljs.core.pr_sb = (function pr_sb(objs,opts){
var first_obj__10700 = cljs.core.first.call(null,objs);
var sb__10701 = (new goog.string.StringBuffer());
var G__10702__10703 = cljs.core.seq.call(null,objs);
if(cljs.core.truth_(G__10702__10703))
{var obj__10704 = cljs.core.first.call(null,G__10702__10703);
var G__10702__10705 = G__10702__10703;
while(true){
if((obj__10704 === first_obj__10700))
{} else
{sb__10701.append(" ");
}
var G__10706__10707 = cljs.core.seq.call(null,cljs.core.pr_seq.call(null,obj__10704,opts));
if(cljs.core.truth_(G__10706__10707))
{var string__10708 = cljs.core.first.call(null,G__10706__10707);
var G__10706__10709 = G__10706__10707;
while(true){
sb__10701.append(string__10708);
var temp__324__auto____10710 = cljs.core.next.call(null,G__10706__10709);
if(cljs.core.truth_(temp__324__auto____10710))
{var G__10706__10711 = temp__324__auto____10710;
{
var G__10714 = cljs.core.first.call(null,G__10706__10711);
var G__10715 = G__10706__10711;
string__10708 = G__10714;
G__10706__10709 = G__10715;
continue;
}
} else
{}
break;
}
} else
{}
var temp__324__auto____10712 = cljs.core.next.call(null,G__10702__10705);
if(cljs.core.truth_(temp__324__auto____10712))
{var G__10702__10713 = temp__324__auto____10712;
{
var G__10716 = cljs.core.first.call(null,G__10702__10713);
var G__10717 = G__10702__10713;
obj__10704 = G__10716;
G__10702__10705 = G__10717;
continue;
}
} else
{}
break;
}
} else
{}
return sb__10701;
});
/**
* Prints a sequence of objects to a string, observing all the
* options given in opts
*/
cljs.core.pr_str_with_opts = (function pr_str_with_opts(objs,opts){
return [cljs.core.str(cljs.core.pr_sb.call(null,objs,opts))].join('');
});
/**
* Same as pr-str-with-opts followed by (newline)
*/
cljs.core.prn_str_with_opts = (function prn_str_with_opts(objs,opts){
var sb__10718 = cljs.core.pr_sb.call(null,objs,opts);
sb__10718.append("\n");
return [cljs.core.str(sb__10718)].join('');
});
/**
* Prints a sequence of objects using string-print, observing all
* the options given in opts
*/
cljs.core.pr_with_opts = (function pr_with_opts(objs,opts){
var first_obj__10719 = cljs.core.first.call(null,objs);
var G__10720__10721 = cljs.core.seq.call(null,objs);
if(cljs.core.truth_(G__10720__10721))
{var obj__10722 = cljs.core.first.call(null,G__10720__10721);
var G__10720__10723 = G__10720__10721;
while(true){
if((obj__10722 === first_obj__10719))
{} else
{cljs.core.string_print.call(null," ");
}
var G__10724__10725 = cljs.core.seq.call(null,cljs.core.pr_seq.call(null,obj__10722,opts));
if(cljs.core.truth_(G__10724__10725))
{var string__10726 = cljs.core.first.call(null,G__10724__10725);
var G__10724__10727 = G__10724__10725;
while(true){
cljs.core.string_print.call(null,string__10726);
var temp__324__auto____10728 = cljs.core.next.call(null,G__10724__10727);
if(cljs.core.truth_(temp__324__auto____10728))
{var G__10724__10729 = temp__324__auto____10728;
{
var G__10732 = cljs.core.first.call(null,G__10724__10729);
var G__10733 = G__10724__10729;
string__10726 = G__10732;
G__10724__10727 = G__10733;
continue;
}
} else
{}
break;
}
} else
{}
var temp__324__auto____10730 = cljs.core.next.call(null,G__10720__10723);
if(cljs.core.truth_(temp__324__auto____10730))
{var G__10720__10731 = temp__324__auto____10730;
{
var G__10734 = cljs.core.first.call(null,G__10720__10731);
var G__10735 = G__10720__10731;
obj__10722 = G__10734;
G__10720__10723 = G__10735;
continue;
}
} else
{return null;
}
break;
}
} else
{return null;
}
});
cljs.core.newline = (function newline(opts){
cljs.core.string_print.call(null,"\n");
if(cljs.core.truth_(cljs.core.get.call(null,opts,"\uFDD0'flush-on-newline")))
{return cljs.core.flush.call(null);
} else
{return null;
}
});
cljs.core._STAR_flush_on_newline_STAR_ = true;
cljs.core._STAR_print_readably_STAR_ = true;
cljs.core._STAR_print_meta_STAR_ = false;
cljs.core._STAR_print_dup_STAR_ = false;
cljs.core.pr_opts = (function pr_opts(){
return cljs.core.ObjMap.fromObject(["\uFDD0'flush-on-newline","\uFDD0'readably","\uFDD0'meta","\uFDD0'dup"],{"\uFDD0'flush-on-newline":cljs.core._STAR_flush_on_newline_STAR_,"\uFDD0'readably":cljs.core._STAR_print_readably_STAR_,"\uFDD0'meta":cljs.core._STAR_print_meta_STAR_,"\uFDD0'dup":cljs.core._STAR_print_dup_STAR_});
});
/**
* pr to a string, returning it. Fundamental entrypoint to IPrintable.
* @param {...*} var_args
*/
cljs.core.pr_str = (function() { 
var pr_str__delegate = function (objs){
return cljs.core.pr_str_with_opts.call(null,objs,cljs.core.pr_opts.call(null));
};
var pr_str = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return pr_str__delegate.call(this, objs);
};
pr_str.cljs$lang$maxFixedArity = 0;
pr_str.cljs$lang$applyTo = (function (arglist__10736){
var objs = cljs.core.seq(arglist__10736);;
return pr_str__delegate(objs);
});
pr_str.cljs$lang$arity$variadic = pr_str__delegate;
return pr_str;
})()
;
/**
* Same as pr-str followed by (newline)
* @param {...*} var_args
*/
cljs.core.prn_str = (function() { 
var prn_str__delegate = function (objs){
return cljs.core.prn_str_with_opts.call(null,objs,cljs.core.pr_opts.call(null));
};
var prn_str = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return prn_str__delegate.call(this, objs);
};
prn_str.cljs$lang$maxFixedArity = 0;
prn_str.cljs$lang$applyTo = (function (arglist__10737){
var objs = cljs.core.seq(arglist__10737);;
return prn_str__delegate(objs);
});
prn_str.cljs$lang$arity$variadic = prn_str__delegate;
return prn_str;
})()
;
/**
* Prints the object(s) using string-print.  Prints the
* object(s), separated by spaces if there is more than one.
* By default, pr and prn print in a way that objects can be
* read by the reader
* @param {...*} var_args
*/
cljs.core.pr = (function() { 
var pr__delegate = function (objs){
return cljs.core.pr_with_opts.call(null,objs,cljs.core.pr_opts.call(null));
};
var pr = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return pr__delegate.call(this, objs);
};
pr.cljs$lang$maxFixedArity = 0;
pr.cljs$lang$applyTo = (function (arglist__10738){
var objs = cljs.core.seq(arglist__10738);;
return pr__delegate(objs);
});
pr.cljs$lang$arity$variadic = pr__delegate;
return pr;
})()
;
/**
* Prints the object(s) using string-print.
* print and println produce output for human consumption.
* @param {...*} var_args
*/
cljs.core.print = (function() { 
var cljs_core_print__delegate = function (objs){
return cljs.core.pr_with_opts.call(null,objs,cljs.core.assoc.call(null,cljs.core.pr_opts.call(null),"\uFDD0'readably",false));
};
var cljs_core_print = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return cljs_core_print__delegate.call(this, objs);
};
cljs_core_print.cljs$lang$maxFixedArity = 0;
cljs_core_print.cljs$lang$applyTo = (function (arglist__10739){
var objs = cljs.core.seq(arglist__10739);;
return cljs_core_print__delegate(objs);
});
cljs_core_print.cljs$lang$arity$variadic = cljs_core_print__delegate;
return cljs_core_print;
})()
;
/**
* print to a string, returning it
* @param {...*} var_args
*/
cljs.core.print_str = (function() { 
var print_str__delegate = function (objs){
return cljs.core.pr_str_with_opts.call(null,objs,cljs.core.assoc.call(null,cljs.core.pr_opts.call(null),"\uFDD0'readably",false));
};
var print_str = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return print_str__delegate.call(this, objs);
};
print_str.cljs$lang$maxFixedArity = 0;
print_str.cljs$lang$applyTo = (function (arglist__10740){
var objs = cljs.core.seq(arglist__10740);;
return print_str__delegate(objs);
});
print_str.cljs$lang$arity$variadic = print_str__delegate;
return print_str;
})()
;
/**
* Same as print followed by (newline)
* @param {...*} var_args
*/
cljs.core.println = (function() { 
var println__delegate = function (objs){
cljs.core.pr_with_opts.call(null,objs,cljs.core.assoc.call(null,cljs.core.pr_opts.call(null),"\uFDD0'readably",false));
return cljs.core.newline.call(null,cljs.core.pr_opts.call(null));
};
var println = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return println__delegate.call(this, objs);
};
println.cljs$lang$maxFixedArity = 0;
println.cljs$lang$applyTo = (function (arglist__10741){
var objs = cljs.core.seq(arglist__10741);;
return println__delegate(objs);
});
println.cljs$lang$arity$variadic = println__delegate;
return println;
})()
;
/**
* println to a string, returning it
* @param {...*} var_args
*/
cljs.core.println_str = (function() { 
var println_str__delegate = function (objs){
return cljs.core.prn_str_with_opts.call(null,objs,cljs.core.assoc.call(null,cljs.core.pr_opts.call(null),"\uFDD0'readably",false));
};
var println_str = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return println_str__delegate.call(this, objs);
};
println_str.cljs$lang$maxFixedArity = 0;
println_str.cljs$lang$applyTo = (function (arglist__10742){
var objs = cljs.core.seq(arglist__10742);;
return println_str__delegate(objs);
});
println_str.cljs$lang$arity$variadic = println_str__delegate;
return println_str;
})()
;
/**
* Same as pr followed by (newline).
* @param {...*} var_args
*/
cljs.core.prn = (function() { 
var prn__delegate = function (objs){
cljs.core.pr_with_opts.call(null,objs,cljs.core.pr_opts.call(null));
return cljs.core.newline.call(null,cljs.core.pr_opts.call(null));
};
var prn = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return prn__delegate.call(this, objs);
};
prn.cljs$lang$maxFixedArity = 0;
prn.cljs$lang$applyTo = (function (arglist__10743){
var objs = cljs.core.seq(arglist__10743);;
return prn__delegate(objs);
});
prn.cljs$lang$arity$variadic = prn__delegate;
return prn;
})()
;
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
var pr_pair__10744 = (function (keyval){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,""," ","",opts,keyval);
});
return cljs.core.pr_sequential.call(null,pr_pair__10744,"{",", ","}",opts,coll);
});
(cljs.core.IPrintable["number"] = true);
(cljs.core._pr_seq["number"] = (function (n,opts){
return cljs.core.list.call(null,[cljs.core.str(n)].join(''));
}));
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
cljs.core.Subvec.prototype.cljs$core$IPrintable$ = true;
cljs.core.Subvec.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"["," ","]",opts,coll);
});
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
var pr_pair__10745 = (function (keyval){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,""," ","",opts,keyval);
});
return cljs.core.pr_sequential.call(null,pr_pair__10745,"{",", ","}",opts,coll);
});
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
var pr_pair__10746 = (function (keyval){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,""," ","",opts,keyval);
});
return cljs.core.pr_sequential.call(null,pr_pair__10746,"{",", ","}",opts,coll);
});
cljs.core.PersistentQueue.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"#queue ["," ","]",opts,cljs.core.seq.call(null,coll));
});
cljs.core.LazySeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.LazySeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"#{"," ","}",opts,coll);
});
(cljs.core.IPrintable["boolean"] = true);
(cljs.core._pr_seq["boolean"] = (function (bool,opts){
return cljs.core.list.call(null,[cljs.core.str(bool)].join(''));
}));
(cljs.core.IPrintable["string"] = true);
(cljs.core._pr_seq["string"] = (function (obj,opts){
if(cljs.core.keyword_QMARK_.call(null,obj))
{return cljs.core.list.call(null,[cljs.core.str(":"),cljs.core.str((function (){var temp__324__auto____10747 = cljs.core.namespace.call(null,obj);
if(cljs.core.truth_(temp__324__auto____10747))
{var nspc__10748 = temp__324__auto____10747;
return [cljs.core.str(nspc__10748),cljs.core.str("/")].join('');
} else
{return null;
}
})()),cljs.core.str(cljs.core.name.call(null,obj))].join(''));
} else
{if(cljs.core.symbol_QMARK_.call(null,obj))
{return cljs.core.list.call(null,[cljs.core.str((function (){var temp__324__auto____10749 = cljs.core.namespace.call(null,obj);
if(cljs.core.truth_(temp__324__auto____10749))
{var nspc__10750 = temp__324__auto____10749;
return [cljs.core.str(nspc__10750),cljs.core.str("/")].join('');
} else
{return null;
}
})()),cljs.core.str(cljs.core.name.call(null,obj))].join(''));
} else
{if("\uFDD0'else")
{return cljs.core.list.call(null,(cljs.core.truth_("\uFDD0'readably".call(null,opts))?goog.string.quote.call(null,obj):obj));
} else
{return null;
}
}
}
}));
cljs.core.NodeSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
cljs.core.RedNode.prototype.cljs$core$IPrintable$ = true;
cljs.core.RedNode.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"["," ","]",opts,coll);
});
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
var pr_pair__10751 = (function (keyval){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,""," ","",opts,keyval);
});
return cljs.core.pr_sequential.call(null,pr_pair__10751,"{",", ","}",opts,coll);
});
cljs.core.Vector.prototype.cljs$core$IPrintable$ = true;
cljs.core.Vector.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"["," ","]",opts,coll);
});
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"#{"," ","}",opts,coll);
});
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"["," ","]",opts,coll);
});
cljs.core.List.prototype.cljs$core$IPrintable$ = true;
cljs.core.List.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
(cljs.core.IPrintable["array"] = true);
(cljs.core._pr_seq["array"] = (function (a,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"#<Array [",", ","]>",opts,a);
}));
(cljs.core.IPrintable["function"] = true);
(cljs.core._pr_seq["function"] = (function (this$){
return cljs.core.list.call(null,"#<",[cljs.core.str(this$)].join(''),">");
}));
cljs.core.EmptyList.prototype.cljs$core$IPrintable$ = true;
cljs.core.EmptyList.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.list.call(null,"()");
});
cljs.core.BlackNode.prototype.cljs$core$IPrintable$ = true;
cljs.core.BlackNode.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"["," ","]",opts,coll);
});
cljs.core.Cons.prototype.cljs$core$IPrintable$ = true;
cljs.core.Cons.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
cljs.core.Range.prototype.cljs$core$IPrintable$ = true;
cljs.core.Range.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
cljs.core.ObjMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.ObjMap.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
var pr_pair__10752 = (function (keyval){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,""," ","",opts,keyval);
});
return cljs.core.pr_sequential.call(null,pr_pair__10752,"{",", ","}",opts,coll);
});
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});

/**
* @constructor
*/
cljs.core.Atom = (function (state,meta,validator,watches){
this.state = state;
this.meta = meta;
this.validator = validator;
this.watches = watches;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 1345404928;
})
cljs.core.Atom.cljs$lang$type = true;
cljs.core.Atom.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.Atom");
});
cljs.core.Atom.prototype.cljs$core$IHash$ = true;
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = (function (this$){
var this__10753 = this;
return goog.getUid.call(null,this$);
});
cljs.core.Atom.prototype.cljs$core$IWatchable$ = true;
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = (function (this$,oldval,newval){
var this__10754 = this;
var G__10755__10756 = cljs.core.seq.call(null,this__10754.watches);
if(cljs.core.truth_(G__10755__10756))
{var G__10758__10760 = cljs.core.first.call(null,G__10755__10756);
var vec__10759__10761 = G__10758__10760;
var key__10762 = cljs.core.nth.call(null,vec__10759__10761,0,null);
var f__10763 = cljs.core.nth.call(null,vec__10759__10761,1,null);
var G__10755__10764 = G__10755__10756;
var G__10758__10765 = G__10758__10760;
var G__10755__10766 = G__10755__10764;
while(true){
var vec__10767__10768 = G__10758__10765;
var key__10769 = cljs.core.nth.call(null,vec__10767__10768,0,null);
var f__10770 = cljs.core.nth.call(null,vec__10767__10768,1,null);
var G__10755__10771 = G__10755__10766;
f__10770.call(null,key__10769,this$,oldval,newval);
var temp__324__auto____10772 = cljs.core.next.call(null,G__10755__10771);
if(cljs.core.truth_(temp__324__auto____10772))
{var G__10755__10773 = temp__324__auto____10772;
{
var G__10780 = cljs.core.first.call(null,G__10755__10773);
var G__10781 = G__10755__10773;
G__10758__10765 = G__10780;
G__10755__10766 = G__10781;
continue;
}
} else
{return null;
}
break;
}
} else
{return null;
}
});
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = (function (this$,key,f){
var this__10774 = this;
return this$.watches = cljs.core.assoc.call(null,this__10774.watches,key,f);
});
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = (function (this$,key){
var this__10775 = this;
return this$.watches = cljs.core.dissoc.call(null,this__10775.watches,key);
});
cljs.core.Atom.prototype.cljs$core$IPrintable$ = true;
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq$arity$2 = (function (a,opts){
var this__10776 = this;
return cljs.core.concat.call(null,cljs.core.PersistentVector.fromArray(["#<Atom: "]),cljs.core._pr_seq.call(null,this__10776.state,opts),">");
});
cljs.core.Atom.prototype.cljs$core$IMeta$ = true;
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = (function (_){
var this__10777 = this;
return this__10777.meta;
});
cljs.core.Atom.prototype.cljs$core$IDeref$ = true;
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = (function (_){
var this__10778 = this;
return this__10778.state;
});
cljs.core.Atom.prototype.cljs$core$IEquiv$ = true;
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (o,other){
var this__10779 = this;
return (o === other);
});
cljs.core.Atom;
/**
* Creates and returns an Atom with an initial value of x and zero or
* more options (in any order):
* 
* :meta metadata-map
* 
* :validator validate-fn
* 
* If metadata-map is supplied, it will be come the metadata on the
* atom. validate-fn must be nil or a side-effect-free fn of one
* argument, which will be passed the intended new state on any state
* change. If the new state is unacceptable, the validate-fn should
* return false or throw an Error.  If either of these error conditions
* occur, then the value of the atom will not change.
* @param {...*} var_args
*/
cljs.core.atom = (function() {
var atom = null;
var atom__1 = (function (x){
return (new cljs.core.Atom(x,null,null,null));
});
var atom__2 = (function() { 
var G__10788__delegate = function (x,p__10782){
var map__10783__10784 = p__10782;
var map__10783__10785 = ((cljs.core.seq_QMARK_.call(null,map__10783__10784))?cljs.core.apply.call(null,cljs.core.hash_map,map__10783__10784):map__10783__10784);
var validator__10786 = cljs.core.get.call(null,map__10783__10785,"\uFDD0'validator");
var meta__10787 = cljs.core.get.call(null,map__10783__10785,"\uFDD0'meta");
return (new cljs.core.Atom(x,meta__10787,validator__10786,null));
};
var G__10788 = function (x,var_args){
var p__10782 = null;
if (goog.isDef(var_args)) {
  p__10782 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return G__10788__delegate.call(this, x, p__10782);
};
G__10788.cljs$lang$maxFixedArity = 1;
G__10788.cljs$lang$applyTo = (function (arglist__10789){
var x = cljs.core.first(arglist__10789);
var p__10782 = cljs.core.rest(arglist__10789);
return G__10788__delegate(x, p__10782);
});
G__10788.cljs$lang$arity$variadic = G__10788__delegate;
return G__10788;
})()
;
atom = function(x,var_args){
var p__10782 = var_args;
switch(arguments.length){
case 1:
return atom__1.call(this,x);
default:
return atom__2.cljs$lang$arity$variadic(x, cljs.core.array_seq(arguments, 1));
}
throw('Invalid arity: ' + arguments.length);
};
atom.cljs$lang$maxFixedArity = 1;
atom.cljs$lang$applyTo = atom__2.cljs$lang$applyTo;
atom.cljs$lang$arity$1 = atom__1;
atom.cljs$lang$arity$variadic = atom__2.cljs$lang$arity$variadic;
return atom;
})()
;
/**
* Sets the value of atom to newval without regard for the
* current value. Returns newval.
*/
cljs.core.reset_BANG_ = (function reset_BANG_(a,new_value){
var temp__324__auto____10790 = a.validator;
if(cljs.core.truth_(temp__324__auto____10790))
{var validate__10791 = temp__324__auto____10790;
if(cljs.core.truth_(validate__10791.call(null,new_value)))
{} else
{throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str("Validator rejected reference state"),cljs.core.str("\n"),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.with_meta(cljs.core.list("\uFDD1'validate","\uFDD1'new-value"),cljs.core.hash_map("\uFDD0'line",5917))))].join('')));
}
} else
{}
var old_value__10792 = a.state;
a.state = new_value;
cljs.core._notify_watches.call(null,a,old_value__10792,new_value);
return new_value;
});
/**
* Atomically swaps the value of atom to be:
* (apply f current-value-of-atom args). Note that f may be called
* multiple times, and thus should be free of side effects.  Returns
* the value that was swapped in.
* @param {...*} var_args
*/
cljs.core.swap_BANG_ = (function() {
var swap_BANG_ = null;
var swap_BANG___2 = (function (a,f){
return cljs.core.reset_BANG_.call(null,a,f.call(null,a.state));
});
var swap_BANG___3 = (function (a,f,x){
return cljs.core.reset_BANG_.call(null,a,f.call(null,a.state,x));
});
var swap_BANG___4 = (function (a,f,x,y){
return cljs.core.reset_BANG_.call(null,a,f.call(null,a.state,x,y));
});
var swap_BANG___5 = (function (a,f,x,y,z){
return cljs.core.reset_BANG_.call(null,a,f.call(null,a.state,x,y,z));
});
var swap_BANG___6 = (function() { 
var G__10793__delegate = function (a,f,x,y,z,more){
return cljs.core.reset_BANG_.call(null,a,cljs.core.apply.call(null,f,a.state,x,y,z,more));
};
var G__10793 = function (a,f,x,y,z,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5),0);
} 
return G__10793__delegate.call(this, a, f, x, y, z, more);
};
G__10793.cljs$lang$maxFixedArity = 5;
G__10793.cljs$lang$applyTo = (function (arglist__10794){
var a = cljs.core.first(arglist__10794);
var f = cljs.core.first(cljs.core.next(arglist__10794));
var x = cljs.core.first(cljs.core.next(cljs.core.next(arglist__10794)));
var y = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__10794))));
var z = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__10794)))));
var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__10794)))));
return G__10793__delegate(a, f, x, y, z, more);
});
G__10793.cljs$lang$arity$variadic = G__10793__delegate;
return G__10793;
})()
;
swap_BANG_ = function(a,f,x,y,z,var_args){
var more = var_args;
switch(arguments.length){
case 2:
return swap_BANG___2.call(this,a,f);
case 3:
return swap_BANG___3.call(this,a,f,x);
case 4:
return swap_BANG___4.call(this,a,f,x,y);
case 5:
return swap_BANG___5.call(this,a,f,x,y,z);
default:
return swap_BANG___6.cljs$lang$arity$variadic(a,f,x,y,z, cljs.core.array_seq(arguments, 5));
}
throw('Invalid arity: ' + arguments.length);
};
swap_BANG_.cljs$lang$maxFixedArity = 5;
swap_BANG_.cljs$lang$applyTo = swap_BANG___6.cljs$lang$applyTo;
swap_BANG_.cljs$lang$arity$2 = swap_BANG___2;
swap_BANG_.cljs$lang$arity$3 = swap_BANG___3;
swap_BANG_.cljs$lang$arity$4 = swap_BANG___4;
swap_BANG_.cljs$lang$arity$5 = swap_BANG___5;
swap_BANG_.cljs$lang$arity$variadic = swap_BANG___6.cljs$lang$arity$variadic;
return swap_BANG_;
})()
;
/**
* Atomically sets the value of atom to newval if and only if the
* current value of the atom is identical to oldval. Returns true if
* set happened, else false.
*/
cljs.core.compare_and_set_BANG_ = (function compare_and_set_BANG_(a,oldval,newval){
if(cljs.core._EQ_.call(null,a.state,oldval))
{cljs.core.reset_BANG_.call(null,a,newval);
return true;
} else
{return false;
}
});
cljs.core.deref = (function deref(o){
return cljs.core._deref.call(null,o);
});
/**
* Sets the validator-fn for an atom. validator-fn must be nil or a
* side-effect-free fn of one argument, which will be passed the intended
* new state on any state change. If the new state is unacceptable, the
* validator-fn should return false or throw an Error. If the current state
* is not acceptable to the new validator, an Error will be thrown and the
* validator will not be changed.
*/
cljs.core.set_validator_BANG_ = (function set_validator_BANG_(iref,val){
return iref.validator = val;
});
/**
* Gets the validator-fn for a var/ref/agent/atom.
*/
cljs.core.get_validator = (function get_validator(iref){
return iref.validator;
});
/**
* Atomically sets the metadata for a namespace/var/ref/agent/atom to be:
* 
* (apply f its-current-meta args)
* 
* f must be free of side-effects
* @param {...*} var_args
*/
cljs.core.alter_meta_BANG_ = (function() { 
var alter_meta_BANG___delegate = function (iref,f,args){
return iref.meta = cljs.core.apply.call(null,f,iref.meta,args);
};
var alter_meta_BANG_ = function (iref,f,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return alter_meta_BANG___delegate.call(this, iref, f, args);
};
alter_meta_BANG_.cljs$lang$maxFixedArity = 2;
alter_meta_BANG_.cljs$lang$applyTo = (function (arglist__10795){
var iref = cljs.core.first(arglist__10795);
var f = cljs.core.first(cljs.core.next(arglist__10795));
var args = cljs.core.rest(cljs.core.next(arglist__10795));
return alter_meta_BANG___delegate(iref, f, args);
});
alter_meta_BANG_.cljs$lang$arity$variadic = alter_meta_BANG___delegate;
return alter_meta_BANG_;
})()
;
/**
* Atomically resets the metadata for an atom
*/
cljs.core.reset_meta_BANG_ = (function reset_meta_BANG_(iref,m){
return iref.meta = m;
});
/**
* Alpha - subject to change.
* 
* Adds a watch function to an atom reference. The watch fn must be a
* fn of 4 args: a key, the reference, its old-state, its
* new-state. Whenever the reference's state might have been changed,
* any registered watches will have their functions called. The watch
* fn will be called synchronously. Note that an atom's state
* may have changed again prior to the fn call, so use old/new-state
* rather than derefing the reference. Keys must be unique per
* reference, and can be used to remove the watch with remove-watch,
* but are otherwise considered opaque by the watch mechanism.  Bear in
* mind that regardless of the result or action of the watch fns the
* atom's value will change.  Example:
* 
* (def a (atom 0))
* (add-watch a :inc (fn [k r o n] (assert (== 0 n))))
* (swap! a inc)
* ;; Assertion Error
* (deref a)
* ;=> 1
*/
cljs.core.add_watch = (function add_watch(iref,key,f){
return cljs.core._add_watch.call(null,iref,key,f);
});
/**
* Alpha - subject to change.
* 
* Removes a watch (set by add-watch) from a reference
*/
cljs.core.remove_watch = (function remove_watch(iref,key){
return cljs.core._remove_watch.call(null,iref,key);
});
cljs.core.gensym_counter = null;
/**
* Returns a new symbol with a unique name. If a prefix string is
* supplied, the name is prefix# where # is some unique number. If
* prefix is not supplied, the prefix is 'G__'.
*/
cljs.core.gensym = (function() {
var gensym = null;
var gensym__0 = (function (){
return gensym.call(null,"G__");
});
var gensym__1 = (function (prefix_string){
if((cljs.core.gensym_counter == null))
{cljs.core.gensym_counter = cljs.core.atom.call(null,0);
} else
{}
return cljs.core.symbol.call(null,[cljs.core.str(prefix_string),cljs.core.str(cljs.core.swap_BANG_.call(null,cljs.core.gensym_counter,cljs.core.inc))].join(''));
});
gensym = function(prefix_string){
switch(arguments.length){
case 0:
return gensym__0.call(this);
case 1:
return gensym__1.call(this,prefix_string);
}
throw('Invalid arity: ' + arguments.length);
};
gensym.cljs$lang$arity$0 = gensym__0;
gensym.cljs$lang$arity$1 = gensym__1;
return gensym;
})()
;
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;

/**
* @constructor
*/
cljs.core.Delay = (function (state,f){
this.state = state;
this.f = f;
this.cljs$lang$protocol_mask$partition1$ = 0;
this.cljs$lang$protocol_mask$partition0$ = 536887296;
})
cljs.core.Delay.cljs$lang$type = true;
cljs.core.Delay.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.Delay");
});
cljs.core.Delay.prototype.cljs$core$IPending$ = true;
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = (function (d){
var this__10796 = this;
return "\uFDD0'done".call(null,cljs.core.deref.call(null,this__10796.state));
});
cljs.core.Delay.prototype.cljs$core$IDeref$ = true;
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = (function (_){
var this__10797 = this;
return "\uFDD0'value".call(null,cljs.core.swap_BANG_.call(null,this__10797.state,(function (p__10798){
var curr_state__10799 = p__10798;
var curr_state__10800 = ((cljs.core.seq_QMARK_.call(null,curr_state__10799))?cljs.core.apply.call(null,cljs.core.hash_map,curr_state__10799):curr_state__10799);
var done__10801 = cljs.core.get.call(null,curr_state__10800,"\uFDD0'done");
if(cljs.core.truth_(done__10801))
{return curr_state__10800;
} else
{return cljs.core.ObjMap.fromObject(["\uFDD0'done","\uFDD0'value"],{"\uFDD0'done":true,"\uFDD0'value":this__10797.f.call(null)});
}
})));
});
cljs.core.Delay;
/**
* returns true if x is a Delay created with delay
*/
cljs.core.delay_QMARK_ = (function delay_QMARK_(x){
return cljs.core.instance_QMARK_.call(null,cljs.core.Delay,x);
});
/**
* If x is a Delay, returns the (possibly cached) value of its expression, else returns x
*/
cljs.core.force = (function force(x){
if(cljs.core.delay_QMARK_.call(null,x))
{return cljs.core.deref.call(null,x);
} else
{return x;
}
});
/**
* Returns true if a value has been produced for a promise, delay, future or lazy sequence.
*/
cljs.core.realized_QMARK_ = (function realized_QMARK_(d){
return cljs.core._realized_QMARK_.call(null,d);
});
/**
* Recursively transforms JavaScript arrays into ClojureScript
* vectors, and JavaScript objects into ClojureScript maps.  With
* option ':keywordize-keys true' will convert object fields from
* strings to keywords.
* @param {...*} var_args
*/
cljs.core.js__GT_clj = (function() { 
var js__GT_clj__delegate = function (x,options){
var map__10802__10803 = options;
var map__10802__10804 = ((cljs.core.seq_QMARK_.call(null,map__10802__10803))?cljs.core.apply.call(null,cljs.core.hash_map,map__10802__10803):map__10802__10803);
var keywordize_keys__10805 = cljs.core.get.call(null,map__10802__10804,"\uFDD0'keywordize-keys");
var keyfn__10806 = (cljs.core.truth_(keywordize_keys__10805)?cljs.core.keyword:cljs.core.str);
var f__10812 = (function thisfn(x){
if(cljs.core.seq_QMARK_.call(null,x))
{return cljs.core.doall.call(null,cljs.core.map.call(null,thisfn,x));
} else
{if(cljs.core.coll_QMARK_.call(null,x))
{return cljs.core.into.call(null,cljs.core.empty.call(null,x),cljs.core.map.call(null,thisfn,x));
} else
{if(cljs.core.truth_(goog.isArray.call(null,x)))
{return cljs.core.vec.call(null,cljs.core.map.call(null,thisfn,x));
} else
{if((cljs.core.type.call(null,x) === Object))
{return cljs.core.into.call(null,cljs.core.ObjMap.fromObject([],{}),(function (){var iter__2497__auto____10811 = (function iter__10807(s__10808){
return (new cljs.core.LazySeq(null,false,(function (){
var s__10808__10809 = s__10808;
while(true){
if(cljs.core.truth_(cljs.core.seq.call(null,s__10808__10809)))
{var k__10810 = cljs.core.first.call(null,s__10808__10809);
return cljs.core.cons.call(null,cljs.core.PersistentVector.fromArray([keyfn__10806.call(null,k__10810),thisfn.call(null,(x[k__10810]))]),iter__10807.call(null,cljs.core.rest.call(null,s__10808__10809)));
} else
{return null;
}
break;
}
})));
});
return iter__2497__auto____10811.call(null,cljs.core.js_keys.call(null,x));
})());
} else
{if("\uFDD0'else")
{return x;
} else
{return null;
}
}
}
}
}
});
return f__10812.call(null,x);
};
var js__GT_clj = function (x,var_args){
var options = null;
if (goog.isDef(var_args)) {
  options = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return js__GT_clj__delegate.call(this, x, options);
};
js__GT_clj.cljs$lang$maxFixedArity = 1;
js__GT_clj.cljs$lang$applyTo = (function (arglist__10813){
var x = cljs.core.first(arglist__10813);
var options = cljs.core.rest(arglist__10813);
return js__GT_clj__delegate(x, options);
});
js__GT_clj.cljs$lang$arity$variadic = js__GT_clj__delegate;
return js__GT_clj;
})()
;
/**
* Returns a memoized version of a referentially transparent function. The
* memoized version of the function keeps a cache of the mapping from arguments
* to results and, when calls with the same arguments are repeated often, has
* higher performance at the expense of higher memory use.
*/
cljs.core.memoize = (function memoize(f){
var mem__10814 = cljs.core.atom.call(null,cljs.core.ObjMap.fromObject([],{}));
return (function() { 
var G__10818__delegate = function (args){
var temp__317__auto____10815 = cljs.core.get.call(null,cljs.core.deref.call(null,mem__10814),args);
if(cljs.core.truth_(temp__317__auto____10815))
{var v__10816 = temp__317__auto____10815;
return v__10816;
} else
{var ret__10817 = cljs.core.apply.call(null,f,args);
cljs.core.swap_BANG_.call(null,mem__10814,cljs.core.assoc,args,ret__10817);
return ret__10817;
}
};
var G__10818 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__10818__delegate.call(this, args);
};
G__10818.cljs$lang$maxFixedArity = 0;
G__10818.cljs$lang$applyTo = (function (arglist__10819){
var args = cljs.core.seq(arglist__10819);;
return G__10818__delegate(args);
});
G__10818.cljs$lang$arity$variadic = G__10818__delegate;
return G__10818;
})()
;
});
/**
* trampoline can be used to convert algorithms requiring mutual
* recursion without stack consumption. Calls f with supplied args, if
* any. If f returns a fn, calls that fn with no arguments, and
* continues to repeat, until the return value is not a fn, then
* returns that non-fn value. Note that if you want to return a fn as a
* final value, you must wrap it in some data structure and unpack it
* after trampoline returns.
* @param {...*} var_args
*/
cljs.core.trampoline = (function() {
var trampoline = null;
var trampoline__1 = (function (f){
while(true){
var ret__10820 = f.call(null);
if(cljs.core.fn_QMARK_.call(null,ret__10820))
{{
var G__10821 = ret__10820;
f = G__10821;
continue;
}
} else
{return ret__10820;
}
break;
}
});
var trampoline__2 = (function() { 
var G__10822__delegate = function (f,args){
return trampoline.call(null,(function (){
return cljs.core.apply.call(null,f,args);
}));
};
var G__10822 = function (f,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return G__10822__delegate.call(this, f, args);
};
G__10822.cljs$lang$maxFixedArity = 1;
G__10822.cljs$lang$applyTo = (function (arglist__10823){
var f = cljs.core.first(arglist__10823);
var args = cljs.core.rest(arglist__10823);
return G__10822__delegate(f, args);
});
G__10822.cljs$lang$arity$variadic = G__10822__delegate;
return G__10822;
})()
;
trampoline = function(f,var_args){
var args = var_args;
switch(arguments.length){
case 1:
return trampoline__1.call(this,f);
default:
return trampoline__2.cljs$lang$arity$variadic(f, cljs.core.array_seq(arguments, 1));
}
throw('Invalid arity: ' + arguments.length);
};
trampoline.cljs$lang$maxFixedArity = 1;
trampoline.cljs$lang$applyTo = trampoline__2.cljs$lang$applyTo;
trampoline.cljs$lang$arity$1 = trampoline__1;
trampoline.cljs$lang$arity$variadic = trampoline__2.cljs$lang$arity$variadic;
return trampoline;
})()
;
/**
* Returns a random floating point number between 0 (inclusive) and
* n (default 1) (exclusive).
*/
cljs.core.rand = (function() {
var rand = null;
var rand__0 = (function (){
return rand.call(null,1);
});
var rand__1 = (function (n){
return Math.random() * n;
});
rand = function(n){
switch(arguments.length){
case 0:
return rand__0.call(this);
case 1:
return rand__1.call(this,n);
}
throw('Invalid arity: ' + arguments.length);
};
rand.cljs$lang$arity$0 = rand__0;
rand.cljs$lang$arity$1 = rand__1;
return rand;
})()
;
/**
* Returns a random integer between 0 (inclusive) and n (exclusive).
*/
cljs.core.rand_int = (function rand_int(n){
return Math.floor(Math.random() * n);
});
/**
* Return a random element of the (sequential) collection. Will have
* the same performance characteristics as nth for the given
* collection.
*/
cljs.core.rand_nth = (function rand_nth(coll){
return cljs.core.nth.call(null,coll,cljs.core.rand_int.call(null,cljs.core.count.call(null,coll)));
});
/**
* Returns a map of the elements of coll keyed by the result of
* f on each element. The value at each key will be a vector of the
* corresponding elements, in the order they appeared in coll.
*/
cljs.core.group_by = (function group_by(f,coll){
return cljs.core.reduce.call(null,(function (ret,x){
var k__10824 = f.call(null,x);
return cljs.core.assoc.call(null,ret,k__10824,cljs.core.conj.call(null,cljs.core.get.call(null,ret,k__10824,cljs.core.PersistentVector.fromArray([])),x));
}),cljs.core.ObjMap.fromObject([],{}),coll);
});
/**
* Creates a hierarchy object for use with derive, isa? etc.
*/
cljs.core.make_hierarchy = (function make_hierarchy(){
return cljs.core.ObjMap.fromObject(["\uFDD0'parents","\uFDD0'descendants","\uFDD0'ancestors"],{"\uFDD0'parents":cljs.core.ObjMap.fromObject([],{}),"\uFDD0'descendants":cljs.core.ObjMap.fromObject([],{}),"\uFDD0'ancestors":cljs.core.ObjMap.fromObject([],{})});
});
cljs.core.global_hierarchy = cljs.core.atom.call(null,cljs.core.make_hierarchy.call(null));
/**
* Returns true if (= child parent), or child is directly or indirectly derived from
* parent, either via a JavaScript type inheritance relationship or a
* relationship established via derive. h must be a hierarchy obtained
* from make-hierarchy, if not supplied defaults to the global
* hierarchy
*/
cljs.core.isa_QMARK_ = (function() {
var isa_QMARK_ = null;
var isa_QMARK___2 = (function (child,parent){
return isa_QMARK_.call(null,cljs.core.deref.call(null,cljs.core.global_hierarchy),child,parent);
});
var isa_QMARK___3 = (function (h,child,parent){
var or__138__auto____10825 = cljs.core._EQ_.call(null,child,parent);
if(or__138__auto____10825)
{return or__138__auto____10825;
} else
{var or__138__auto____10826 = cljs.core.contains_QMARK_.call(null,"\uFDD0'ancestors".call(null,h).call(null,child),parent);
if(or__138__auto____10826)
{return or__138__auto____10826;
} else
{var and__132__auto____10827 = cljs.core.vector_QMARK_.call(null,parent);
if(and__132__auto____10827)
{var and__132__auto____10828 = cljs.core.vector_QMARK_.call(null,child);
if(and__132__auto____10828)
{var and__132__auto____10829 = (cljs.core.count.call(null,parent) === cljs.core.count.call(null,child));
if(and__132__auto____10829)
{var ret__10830 = true;
var i__10831 = 0;
while(true){
if((function (){var or__138__auto____10832 = cljs.core.not.call(null,ret__10830);
if(or__138__auto____10832)
{return or__138__auto____10832;
} else
{return (i__10831 === cljs.core.count.call(null,parent));
}
})())
{return ret__10830;
} else
{{
var G__10833 = isa_QMARK_.call(null,h,child.call(null,i__10831),parent.call(null,i__10831));
var G__10834 = (i__10831 + 1);
ret__10830 = G__10833;
i__10831 = G__10834;
continue;
}
}
break;
}
} else
{return and__132__auto____10829;
}
} else
{return and__132__auto____10828;
}
} else
{return and__132__auto____10827;
}
}
}
});
isa_QMARK_ = function(h,child,parent){
switch(arguments.length){
case 2:
return isa_QMARK___2.call(this,h,child);
case 3:
return isa_QMARK___3.call(this,h,child,parent);
}
throw('Invalid arity: ' + arguments.length);
};
isa_QMARK_.cljs$lang$arity$2 = isa_QMARK___2;
isa_QMARK_.cljs$lang$arity$3 = isa_QMARK___3;
return isa_QMARK_;
})()
;
/**
* Returns the immediate parents of tag, either via a JavaScript type
* inheritance relationship or a relationship established via derive. h
* must be a hierarchy obtained from make-hierarchy, if not supplied
* defaults to the global hierarchy
*/
cljs.core.parents = (function() {
var parents = null;
var parents__1 = (function (tag){
return parents.call(null,cljs.core.deref.call(null,cljs.core.global_hierarchy),tag);
});
var parents__2 = (function (h,tag){
return cljs.core.not_empty.call(null,cljs.core.get.call(null,"\uFDD0'parents".call(null,h),tag));
});
parents = function(h,tag){
switch(arguments.length){
case 1:
return parents__1.call(this,h);
case 2:
return parents__2.call(this,h,tag);
}
throw('Invalid arity: ' + arguments.length);
};
parents.cljs$lang$arity$1 = parents__1;
parents.cljs$lang$arity$2 = parents__2;
return parents;
})()
;
/**
* Returns the immediate and indirect parents of tag, either via a JavaScript type
* inheritance relationship or a relationship established via derive. h
* must be a hierarchy obtained from make-hierarchy, if not supplied
* defaults to the global hierarchy
*/
cljs.core.ancestors = (function() {
var ancestors = null;
var ancestors__1 = (function (tag){
return ancestors.call(null,cljs.core.deref.call(null,cljs.core.global_hierarchy),tag);
});
var ancestors__2 = (function (h,tag){
return cljs.core.not_empty.call(null,cljs.core.get.call(null,"\uFDD0'ancestors".call(null,h),tag));
});
ancestors = function(h,tag){
switch(arguments.length){
case 1:
return ancestors__1.call(this,h);
case 2:
return ancestors__2.call(this,h,tag);
}
throw('Invalid arity: ' + arguments.length);
};
ancestors.cljs$lang$arity$1 = ancestors__1;
ancestors.cljs$lang$arity$2 = ancestors__2;
return ancestors;
})()
;
/**
* Returns the immediate and indirect children of tag, through a
* relationship established via derive. h must be a hierarchy obtained
* from make-hierarchy, if not supplied defaults to the global
* hierarchy. Note: does not work on JavaScript type inheritance
* relationships.
*/
cljs.core.descendants = (function() {
var descendants = null;
var descendants__1 = (function (tag){
return descendants.call(null,cljs.core.deref.call(null,cljs.core.global_hierarchy),tag);
});
var descendants__2 = (function (h,tag){
return cljs.core.not_empty.call(null,cljs.core.get.call(null,"\uFDD0'descendants".call(null,h),tag));
});
descendants = function(h,tag){
switch(arguments.length){
case 1:
return descendants__1.call(this,h);
case 2:
return descendants__2.call(this,h,tag);
}
throw('Invalid arity: ' + arguments.length);
};
descendants.cljs$lang$arity$1 = descendants__1;
descendants.cljs$lang$arity$2 = descendants__2;
return descendants;
})()
;
/**
* Establishes a parent/child relationship between parent and
* tag. Parent must be a namespace-qualified symbol or keyword and
* child can be either a namespace-qualified symbol or keyword or a
* class. h must be a hierarchy obtained from make-hierarchy, if not
* supplied defaults to, and modifies, the global hierarchy.
*/
cljs.core.derive = (function() {
var derive = null;
var derive__2 = (function (tag,parent){
if(cljs.core.truth_(cljs.core.namespace.call(null,parent)))
{} else
{throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.with_meta(cljs.core.list("\uFDD1'namespace","\uFDD1'parent"),cljs.core.hash_map("\uFDD0'line",6201))))].join('')));
}
cljs.core.swap_BANG_.call(null,cljs.core.global_hierarchy,derive,tag,parent);
return null;
});
var derive__3 = (function (h,tag,parent){
if(cljs.core.not_EQ_.call(null,tag,parent))
{} else
{throw (new Error([cljs.core.str("Assert failed: "),cljs.core.str(cljs.core.pr_str.call(null,cljs.core.with_meta(cljs.core.list("\uFDD1'not=","\uFDD1'tag","\uFDD1'parent"),cljs.core.hash_map("\uFDD0'line",6205))))].join('')));
}
var tp__10838 = "\uFDD0'parents".call(null,h);
var td__10839 = "\uFDD0'descendants".call(null,h);
var ta__10840 = "\uFDD0'ancestors".call(null,h);
var tf__10841 = (function (m,source,sources,target,targets){
return cljs.core.reduce.call(null,(function (ret,k){
return cljs.core.assoc.call(null,ret,k,cljs.core.reduce.call(null,cljs.core.conj,cljs.core.get.call(null,targets,k,cljs.core.set([])),cljs.core.cons.call(null,target,targets.call(null,target))));
}),m,cljs.core.cons.call(null,source,sources.call(null,source)));
});
var or__138__auto____10842 = ((cljs.core.contains_QMARK_.call(null,tp__10838.call(null,tag),parent))?null:(function (){if(cljs.core.contains_QMARK_.call(null,ta__10840.call(null,tag),parent))
{throw (new Error([cljs.core.str(tag),cljs.core.str("already has"),cljs.core.str(parent),cljs.core.str("as ancestor")].join('')));
} else
{}
if(cljs.core.contains_QMARK_.call(null,ta__10840.call(null,parent),tag))
{throw (new Error([cljs.core.str("Cyclic derivation:"),cljs.core.str(parent),cljs.core.str("has"),cljs.core.str(tag),cljs.core.str("as ancestor")].join('')));
} else
{}
return cljs.core.ObjMap.fromObject(["\uFDD0'parents","\uFDD0'ancestors","\uFDD0'descendants"],{"\uFDD0'parents":cljs.core.assoc.call(null,"\uFDD0'parents".call(null,h),tag,cljs.core.conj.call(null,cljs.core.get.call(null,tp__10838,tag,cljs.core.set([])),parent)),"\uFDD0'ancestors":tf__10841.call(null,"\uFDD0'ancestors".call(null,h),tag,td__10839,parent,ta__10840),"\uFDD0'descendants":tf__10841.call(null,"\uFDD0'descendants".call(null,h),parent,ta__10840,tag,td__10839)});
})());
if(cljs.core.truth_(or__138__auto____10842))
{return or__138__auto____10842;
} else
{return h;
}
});
derive = function(h,tag,parent){
switch(arguments.length){
case 2:
return derive__2.call(this,h,tag);
case 3:
return derive__3.call(this,h,tag,parent);
}
throw('Invalid arity: ' + arguments.length);
};
derive.cljs$lang$arity$2 = derive__2;
derive.cljs$lang$arity$3 = derive__3;
return derive;
})()
;
/**
* Removes a parent/child relationship between parent and
* tag. h must be a hierarchy obtained from make-hierarchy, if not
* supplied defaults to, and modifies, the global hierarchy.
*/
cljs.core.underive = (function() {
var underive = null;
var underive__2 = (function (tag,parent){
cljs.core.swap_BANG_.call(null,cljs.core.global_hierarchy,underive,tag,parent);
return null;
});
var underive__3 = (function (h,tag,parent){
var parentMap__10843 = "\uFDD0'parents".call(null,h);
var childsParents__10844 = (cljs.core.truth_(parentMap__10843.call(null,tag))?cljs.core.disj.call(null,parentMap__10843.call(null,tag),parent):cljs.core.set([]));
var newParents__10845 = (cljs.core.truth_(cljs.core.not_empty.call(null,childsParents__10844))?cljs.core.assoc.call(null,parentMap__10843,tag,childsParents__10844):cljs.core.dissoc.call(null,parentMap__10843,tag));
var deriv_seq__10846 = cljs.core.flatten.call(null,cljs.core.map.call(null,(function (p1__10835_SHARP_){
return cljs.core.cons.call(null,cljs.core.first.call(null,p1__10835_SHARP_),cljs.core.interpose.call(null,cljs.core.first.call(null,p1__10835_SHARP_),cljs.core.second.call(null,p1__10835_SHARP_)));
}),cljs.core.seq.call(null,newParents__10845)));
if(cljs.core.contains_QMARK_.call(null,parentMap__10843.call(null,tag),parent))
{return cljs.core.reduce.call(null,(function (p1__10836_SHARP_,p2__10837_SHARP_){
return cljs.core.apply.call(null,cljs.core.derive,p1__10836_SHARP_,p2__10837_SHARP_);
}),cljs.core.make_hierarchy.call(null),cljs.core.partition.call(null,2,deriv_seq__10846));
} else
{return h;
}
});
underive = function(h,tag,parent){
switch(arguments.length){
case 2:
return underive__2.call(this,h,tag);
case 3:
return underive__3.call(this,h,tag,parent);
}
throw('Invalid arity: ' + arguments.length);
};
underive.cljs$lang$arity$2 = underive__2;
underive.cljs$lang$arity$3 = underive__3;
return underive;
})()
;
cljs.core.reset_cache = (function reset_cache(method_cache,method_table,cached_hierarchy,hierarchy){
cljs.core.swap_BANG_.call(null,method_cache,(function (_){
return cljs.core.deref.call(null,method_table);
}));
return cljs.core.swap_BANG_.call(null,cached_hierarchy,(function (_){
return cljs.core.deref.call(null,hierarchy);
}));
});
cljs.core.prefers_STAR_ = (function prefers_STAR_(x,y,prefer_table){
var xprefs__10847 = cljs.core.deref.call(null,prefer_table).call(null,x);
var or__138__auto____10849 = (cljs.core.truth_((function (){var and__132__auto____10848 = xprefs__10847;
if(cljs.core.truth_(and__132__auto____10848))
{return xprefs__10847.call(null,y);
} else
{return and__132__auto____10848;
}
})())?true:null);
if(cljs.core.truth_(or__138__auto____10849))
{return or__138__auto____10849;
} else
{var or__138__auto____10851 = (function (){var ps__10850 = cljs.core.parents.call(null,y);
while(true){
if((cljs.core.count.call(null,ps__10850) > 0))
{if(cljs.core.truth_(prefers_STAR_.call(null,x,cljs.core.first.call(null,ps__10850),prefer_table)))
{} else
{}
{
var G__10854 = cljs.core.rest.call(null,ps__10850);
ps__10850 = G__10854;
continue;
}
} else
{return null;
}
break;
}
})();
if(cljs.core.truth_(or__138__auto____10851))
{return or__138__auto____10851;
} else
{var or__138__auto____10853 = (function (){var ps__10852 = cljs.core.parents.call(null,x);
while(true){
if((cljs.core.count.call(null,ps__10852) > 0))
{if(cljs.core.truth_(prefers_STAR_.call(null,cljs.core.first.call(null,ps__10852),y,prefer_table)))
{} else
{}
{
var G__10855 = cljs.core.rest.call(null,ps__10852);
ps__10852 = G__10855;
continue;
}
} else
{return null;
}
break;
}
})();
if(cljs.core.truth_(or__138__auto____10853))
{return or__138__auto____10853;
} else
{return false;
}
}
}
});
cljs.core.dominates = (function dominates(x,y,prefer_table){
var or__138__auto____10856 = cljs.core.prefers_STAR_.call(null,x,y,prefer_table);
if(cljs.core.truth_(or__138__auto____10856))
{return or__138__auto____10856;
} else
{return cljs.core.isa_QMARK_.call(null,x,y);
}
});
cljs.core.find_and_cache_best_method = (function find_and_cache_best_method(name,dispatch_val,hierarchy,method_table,prefer_table,method_cache,cached_hierarchy){
var best_entry__10865 = cljs.core.reduce.call(null,(function (be,p__10857){
var vec__10858__10859 = p__10857;
var k__10860 = cljs.core.nth.call(null,vec__10858__10859,0,null);
var ___10861 = cljs.core.nth.call(null,vec__10858__10859,1,null);
var e__10862 = vec__10858__10859;
if(cljs.core.isa_QMARK_.call(null,dispatch_val,k__10860))
{var be2__10864 = (cljs.core.truth_((function (){var or__138__auto____10863 = (be == null);
if(or__138__auto____10863)
{return or__138__auto____10863;
} else
{return cljs.core.dominates.call(null,k__10860,cljs.core.first.call(null,be),prefer_table);
}
})())?e__10862:be);
if(cljs.core.truth_(cljs.core.dominates.call(null,cljs.core.first.call(null,be2__10864),k__10860,prefer_table)))
{} else
{throw (new Error([cljs.core.str("Multiple methods in multimethod '"),cljs.core.str(name),cljs.core.str("' match dispatch value: "),cljs.core.str(dispatch_val),cljs.core.str(" -> "),cljs.core.str(k__10860),cljs.core.str(" and "),cljs.core.str(cljs.core.first.call(null,be2__10864)),cljs.core.str(", and neither is preferred")].join('')));
}
return be2__10864;
} else
{return be;
}
}),null,cljs.core.deref.call(null,method_table));
if(cljs.core.truth_(best_entry__10865))
{if(cljs.core._EQ_.call(null,cljs.core.deref.call(null,cached_hierarchy),cljs.core.deref.call(null,hierarchy)))
{cljs.core.swap_BANG_.call(null,method_cache,cljs.core.assoc,dispatch_val,cljs.core.second.call(null,best_entry__10865));
return cljs.core.second.call(null,best_entry__10865);
} else
{cljs.core.reset_cache.call(null,method_cache,method_table,cached_hierarchy,hierarchy);
return find_and_cache_best_method.call(null,name,dispatch_val,hierarchy,method_table,prefer_table,method_cache,cached_hierarchy);
}
} else
{return null;
}
});
void 0;cljs.core.IMultiFn = {};
cljs.core._reset = (function _reset(mf){
if((function (){var and__132__auto____10866 = mf;
if(and__132__auto____10866)
{return mf.cljs$core$IMultiFn$_reset$arity$1;
} else
{return and__132__auto____10866;
}
})())
{return mf.cljs$core$IMultiFn$_reset$arity$1(mf);
} else
{return (function (){var or__138__auto____10867 = (cljs.core._reset[goog.typeOf.call(null,mf)]);
if(or__138__auto____10867)
{return or__138__auto____10867;
} else
{var or__138__auto____10868 = (cljs.core._reset["_"]);
if(or__138__auto____10868)
{return or__138__auto____10868;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-reset",mf);
}
}
})().call(null,mf);
}
});
cljs.core._add_method = (function _add_method(mf,dispatch_val,method){
if((function (){var and__132__auto____10869 = mf;
if(and__132__auto____10869)
{return mf.cljs$core$IMultiFn$_add_method$arity$3;
} else
{return and__132__auto____10869;
}
})())
{return mf.cljs$core$IMultiFn$_add_method$arity$3(mf,dispatch_val,method);
} else
{return (function (){var or__138__auto____10870 = (cljs.core._add_method[goog.typeOf.call(null,mf)]);
if(or__138__auto____10870)
{return or__138__auto____10870;
} else
{var or__138__auto____10871 = (cljs.core._add_method["_"]);
if(or__138__auto____10871)
{return or__138__auto____10871;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-add-method",mf);
}
}
})().call(null,mf,dispatch_val,method);
}
});
cljs.core._remove_method = (function _remove_method(mf,dispatch_val){
if((function (){var and__132__auto____10872 = mf;
if(and__132__auto____10872)
{return mf.cljs$core$IMultiFn$_remove_method$arity$2;
} else
{return and__132__auto____10872;
}
})())
{return mf.cljs$core$IMultiFn$_remove_method$arity$2(mf,dispatch_val);
} else
{return (function (){var or__138__auto____10873 = (cljs.core._remove_method[goog.typeOf.call(null,mf)]);
if(or__138__auto____10873)
{return or__138__auto____10873;
} else
{var or__138__auto____10874 = (cljs.core._remove_method["_"]);
if(or__138__auto____10874)
{return or__138__auto____10874;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-remove-method",mf);
}
}
})().call(null,mf,dispatch_val);
}
});
cljs.core._prefer_method = (function _prefer_method(mf,dispatch_val,dispatch_val_y){
if((function (){var and__132__auto____10875 = mf;
if(and__132__auto____10875)
{return mf.cljs$core$IMultiFn$_prefer_method$arity$3;
} else
{return and__132__auto____10875;
}
})())
{return mf.cljs$core$IMultiFn$_prefer_method$arity$3(mf,dispatch_val,dispatch_val_y);
} else
{return (function (){var or__138__auto____10876 = (cljs.core._prefer_method[goog.typeOf.call(null,mf)]);
if(or__138__auto____10876)
{return or__138__auto____10876;
} else
{var or__138__auto____10877 = (cljs.core._prefer_method["_"]);
if(or__138__auto____10877)
{return or__138__auto____10877;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-prefer-method",mf);
}
}
})().call(null,mf,dispatch_val,dispatch_val_y);
}
});
cljs.core._get_method = (function _get_method(mf,dispatch_val){
if((function (){var and__132__auto____10878 = mf;
if(and__132__auto____10878)
{return mf.cljs$core$IMultiFn$_get_method$arity$2;
} else
{return and__132__auto____10878;
}
})())
{return mf.cljs$core$IMultiFn$_get_method$arity$2(mf,dispatch_val);
} else
{return (function (){var or__138__auto____10879 = (cljs.core._get_method[goog.typeOf.call(null,mf)]);
if(or__138__auto____10879)
{return or__138__auto____10879;
} else
{var or__138__auto____10880 = (cljs.core._get_method["_"]);
if(or__138__auto____10880)
{return or__138__auto____10880;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-get-method",mf);
}
}
})().call(null,mf,dispatch_val);
}
});
cljs.core._methods = (function _methods(mf){
if((function (){var and__132__auto____10881 = mf;
if(and__132__auto____10881)
{return mf.cljs$core$IMultiFn$_methods$arity$1;
} else
{return and__132__auto____10881;
}
})())
{return mf.cljs$core$IMultiFn$_methods$arity$1(mf);
} else
{return (function (){var or__138__auto____10882 = (cljs.core._methods[goog.typeOf.call(null,mf)]);
if(or__138__auto____10882)
{return or__138__auto____10882;
} else
{var or__138__auto____10883 = (cljs.core._methods["_"]);
if(or__138__auto____10883)
{return or__138__auto____10883;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-methods",mf);
}
}
})().call(null,mf);
}
});
cljs.core._prefers = (function _prefers(mf){
if((function (){var and__132__auto____10884 = mf;
if(and__132__auto____10884)
{return mf.cljs$core$IMultiFn$_prefers$arity$1;
} else
{return and__132__auto____10884;
}
})())
{return mf.cljs$core$IMultiFn$_prefers$arity$1(mf);
} else
{return (function (){var or__138__auto____10885 = (cljs.core._prefers[goog.typeOf.call(null,mf)]);
if(or__138__auto____10885)
{return or__138__auto____10885;
} else
{var or__138__auto____10886 = (cljs.core._prefers["_"]);
if(or__138__auto____10886)
{return or__138__auto____10886;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-prefers",mf);
}
}
})().call(null,mf);
}
});
cljs.core._dispatch = (function _dispatch(mf,args){
if((function (){var and__132__auto____10887 = mf;
if(and__132__auto____10887)
{return mf.cljs$core$IMultiFn$_dispatch$arity$2;
} else
{return and__132__auto____10887;
}
})())
{return mf.cljs$core$IMultiFn$_dispatch$arity$2(mf,args);
} else
{return (function (){var or__138__auto____10888 = (cljs.core._dispatch[goog.typeOf.call(null,mf)]);
if(or__138__auto____10888)
{return or__138__auto____10888;
} else
{var or__138__auto____10889 = (cljs.core._dispatch["_"]);
if(or__138__auto____10889)
{return or__138__auto____10889;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-dispatch",mf);
}
}
})().call(null,mf,args);
}
});
void 0;cljs.core.do_dispatch = (function do_dispatch(mf,dispatch_fn,args){
var dispatch_val__10890 = cljs.core.apply.call(null,dispatch_fn,args);
var target_fn__10891 = cljs.core._get_method.call(null,mf,dispatch_val__10890);
if(cljs.core.truth_(target_fn__10891))
{} else
{throw (new Error([cljs.core.str("No method in multimethod '"),cljs.core.str(cljs.core.name),cljs.core.str("' for dispatch value: "),cljs.core.str(dispatch_val__10890)].join('')));
}
return cljs.core.apply.call(null,target_fn__10891,args);
});

/**
* @constructor
*/
cljs.core.MultiFn = (function (name,dispatch_fn,default_dispatch_val,hierarchy,method_table,prefer_table,method_cache,cached_hierarchy){
this.name = name;
this.dispatch_fn = dispatch_fn;
this.default_dispatch_val = default_dispatch_val;
this.hierarchy = hierarchy;
this.method_table = method_table;
this.prefer_table = prefer_table;
this.method_cache = method_cache;
this.cached_hierarchy = cached_hierarchy;
this.cljs$lang$protocol_mask$partition0$ = 2097152;
this.cljs$lang$protocol_mask$partition1$ = 32;
})
cljs.core.MultiFn.cljs$lang$type = true;
cljs.core.MultiFn.cljs$lang$ctorPrSeq = (function (this__2326__auto__){
return cljs.core.list.call(null,"cljs.core.MultiFn");
});
cljs.core.MultiFn.prototype.cljs$core$IHash$ = true;
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = (function (this$){
var this__10892 = this;
return goog.getUid.call(null,this$);
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$ = true;
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = (function (mf){
var this__10893 = this;
cljs.core.swap_BANG_.call(null,this__10893.method_table,(function (mf){
return cljs.core.ObjMap.fromObject([],{});
}));
cljs.core.swap_BANG_.call(null,this__10893.method_cache,(function (mf){
return cljs.core.ObjMap.fromObject([],{});
}));
cljs.core.swap_BANG_.call(null,this__10893.prefer_table,(function (mf){
return cljs.core.ObjMap.fromObject([],{});
}));
cljs.core.swap_BANG_.call(null,this__10893.cached_hierarchy,(function (mf){
return null;
}));
return mf;
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = (function (mf,dispatch_val,method){
var this__10894 = this;
cljs.core.swap_BANG_.call(null,this__10894.method_table,cljs.core.assoc,dispatch_val,method);
cljs.core.reset_cache.call(null,this__10894.method_cache,this__10894.method_table,this__10894.cached_hierarchy,this__10894.hierarchy);
return mf;
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = (function (mf,dispatch_val){
var this__10895 = this;
cljs.core.swap_BANG_.call(null,this__10895.method_table,cljs.core.dissoc,dispatch_val);
cljs.core.reset_cache.call(null,this__10895.method_cache,this__10895.method_table,this__10895.cached_hierarchy,this__10895.hierarchy);
return mf;
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = (function (mf,dispatch_val){
var this__10896 = this;
if(cljs.core._EQ_.call(null,cljs.core.deref.call(null,this__10896.cached_hierarchy),cljs.core.deref.call(null,this__10896.hierarchy)))
{} else
{cljs.core.reset_cache.call(null,this__10896.method_cache,this__10896.method_table,this__10896.cached_hierarchy,this__10896.hierarchy);
}
var temp__317__auto____10897 = cljs.core.deref.call(null,this__10896.method_cache).call(null,dispatch_val);
if(cljs.core.truth_(temp__317__auto____10897))
{var target_fn__10898 = temp__317__auto____10897;
return target_fn__10898;
} else
{var temp__317__auto____10899 = cljs.core.find_and_cache_best_method.call(null,this__10896.name,dispatch_val,this__10896.hierarchy,this__10896.method_table,this__10896.prefer_table,this__10896.method_cache,this__10896.cached_hierarchy);
if(cljs.core.truth_(temp__317__auto____10899))
{var target_fn__10900 = temp__317__auto____10899;
return target_fn__10900;
} else
{return cljs.core.deref.call(null,this__10896.method_table).call(null,this__10896.default_dispatch_val);
}
}
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = (function (mf,dispatch_val_x,dispatch_val_y){
var this__10901 = this;
if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null,dispatch_val_x,dispatch_val_y,this__10901.prefer_table)))
{throw (new Error([cljs.core.str("Preference conflict in multimethod '"),cljs.core.str(this__10901.name),cljs.core.str("': "),cljs.core.str(dispatch_val_y),cljs.core.str(" is already preferred to "),cljs.core.str(dispatch_val_x)].join('')));
} else
{}
cljs.core.swap_BANG_.call(null,this__10901.prefer_table,(function (old){
return cljs.core.assoc.call(null,old,dispatch_val_x,cljs.core.conj.call(null,cljs.core.get.call(null,old,dispatch_val_x,cljs.core.set([])),dispatch_val_y));
}));
return cljs.core.reset_cache.call(null,this__10901.method_cache,this__10901.method_table,this__10901.cached_hierarchy,this__10901.hierarchy);
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = (function (mf){
var this__10902 = this;
return cljs.core.deref.call(null,this__10902.method_table);
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = (function (mf){
var this__10903 = this;
return cljs.core.deref.call(null,this__10903.prefer_table);
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch$arity$2 = (function (mf,args){
var this__10904 = this;
return cljs.core.do_dispatch.call(null,mf,this__10904.dispatch_fn,args);
});
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = (function() { 
var G__10905__delegate = function (_,args){
return cljs.core._dispatch.call(null,this,args);
};
var G__10905 = function (_,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return G__10905__delegate.call(this, _, args);
};
G__10905.cljs$lang$maxFixedArity = 1;
G__10905.cljs$lang$applyTo = (function (arglist__10906){
var _ = cljs.core.first(arglist__10906);
var args = cljs.core.rest(arglist__10906);
return G__10905__delegate(_, args);
});
G__10905.cljs$lang$arity$variadic = G__10905__delegate;
return G__10905;
})()
;
cljs.core.MultiFn.prototype.apply = (function (_,args){
return cljs.core._dispatch.call(null,this,args);
});
/**
* Removes all of the methods of multimethod.
*/
cljs.core.remove_all_methods = (function remove_all_methods(multifn){
return cljs.core._reset.call(null,multifn);
});
/**
* Removes the method of multimethod associated with dispatch-value.
*/
cljs.core.remove_method = (function remove_method(multifn,dispatch_val){
return cljs.core._remove_method.call(null,multifn,dispatch_val);
});
/**
* Causes the multimethod to prefer matches of dispatch-val-x over dispatch-val-y
* when there is a conflict
*/
cljs.core.prefer_method = (function prefer_method(multifn,dispatch_val_x,dispatch_val_y){
return cljs.core._prefer_method.call(null,multifn,dispatch_val_x,dispatch_val_y);
});
/**
* Given a multimethod, returns a map of dispatch values -> dispatch fns
*/
cljs.core.methods$ = (function methods$(multifn){
return cljs.core._methods.call(null,multifn);
});
/**
* Given a multimethod and a dispatch value, returns the dispatch fn
* that would apply to that value, or nil if none apply and no default
*/
cljs.core.get_method = (function get_method(multifn,dispatch_val){
return cljs.core._get_method.call(null,multifn,dispatch_val);
});
/**
* Given a multimethod, returns a map of preferred value -> set of other values
*/
cljs.core.prefers = (function prefers(multifn){
return cljs.core._prefers.call(null,multifn);
});
