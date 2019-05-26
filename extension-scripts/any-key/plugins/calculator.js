/* 
 * The MIT License (MIT)
 * 
 * Copyright (c) Ankit
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:</p>
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/** math-expression-evaluator version 1.2.17
 Dated:2017-05-05 */
 var mexp;
 !function(a){mexp = a()}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){var d=a("./postfix_evaluator.js");d.prototype.formulaEval=function(){"use strict";for(var a,b,c,d=[],e=this.value,f=0;f<e.length;f++)1===e[f].type||3===e[f].type?d.push({value:3===e[f].type?e[f].show:e[f].value,type:1}):13===e[f].type?d.push({value:e[f].show,type:1}):0===e[f].type?d[d.length-1]={value:e[f].show+("-"!=e[f].show?"(":"")+d[d.length-1].value+("-"!=e[f].show?")":""),type:0}:7===e[f].type?d[d.length-1]={value:(1!=d[d.length-1].type?"(":"")+d[d.length-1].value+(1!=d[d.length-1].type?")":"")+e[f].show,type:7}:10===e[f].type?(a=d.pop(),b=d.pop(),"P"===e[f].show||"C"===e[f].show?d.push({value:"<sup>"+b.value+"</sup>"+e[f].show+"<sub>"+a.value+"</sub>",type:10}):d.push({value:(1!=b.type?"(":"")+b.value+(1!=b.type?")":"")+"<sup>"+a.value+"</sup>",type:1})):2===e[f].type||9===e[f].type?(a=d.pop(),b=d.pop(),d.push({value:(1!=b.type?"(":"")+b.value+(1!=b.type?")":"")+e[f].show+(1!=a.type?"(":"")+a.value+(1!=a.type?")":""),type:e[f].type})):12===e[f].type&&(a=d.pop(),b=d.pop(),c=d.pop(),d.push({value:e[f].show+"("+c.value+","+b.value+","+a.value+")",type:12}));return d[0].value},b.exports=d},{"./postfix_evaluator.js":5}],2:[function(a,b,c){function d(a,b){for(var c=0;c<a.length;c++)a[c]+=b;return a}function e(a,b,c,d){for(var e=0;e<d;e++)if(a[c+e]!==b[e])return!1;return!0}var f=a("./math_function.js"),g=["sin","cos","tan","pi","(",")","P","C","asin","acos","atan","7","8","9","int","cosh","acosh","ln","^","root","4","5","6","/","!","tanh","atanh","Mod","1","2","3","*","sinh","asinh","e","log","0",".","+","-",",","Sigma","n","Pi","pow"],h=["sin","cos","tan","&pi;","(",")","P","C","asin","acos","atan","7","8","9","Int","cosh","acosh"," ln","^","root","4","5","6","&divide;","!","tanh","atanh"," Mod ","1","2","3","&times;","sinh","asinh","e"," log","0",".","+","-",",","&Sigma;","n","&Pi;","pow"],i=[f.math.sin,f.math.cos,f.math.tan,"PI","(",")",f.math.P,f.math.C,f.math.asin,f.math.acos,f.math.atan,"7","8","9",Math.floor,f.math.cosh,f.math.acosh,Math.log,Math.pow,Math.sqrt,"4","5","6",f.math.div,f.math.fact,f.math.tanh,f.math.atanh,f.math.mod,"1","2","3",f.math.mul,f.math.sinh,f.math.asinh,"E",f.math.log,"0",".",f.math.add,f.math.sub,",",f.math.sigma,"n",f.math.Pi,Math.pow],j={0:11,1:0,2:3,3:0,4:0,5:0,6:0,7:11,8:11,9:1,10:10,11:0,12:11,13:0},k=[0,0,0,3,4,5,10,10,0,0,0,1,1,1,0,0,0,0,10,0,1,1,1,2,7,0,0,2,1,1,1,2,0,0,3,0,1,6,9,9,11,12,13,12,8],l={0:!0,1:!0,3:!0,4:!0,6:!0,8:!0,9:!0,12:!0,13:!0},m={0:!0,1:!0,2:!0,3:!0,4:!0,5:!0,6:!0,7:!0,8:!0,9:!0,10:!0,11:!0,12:!0,13:!0},n={0:!0,3:!0,4:!0,8:!0,12:!0,13:!0},o={},p={0:!0,1:!0,3:!0,4:!0,6:!0,8:!0,12:!0,13:!0},q={1:!0},r=[[],["1","2","3","7","8","9","4","5","6","+","-","*","/","(",")","^","!","P","C","e","0",".",",","n"],["pi","ln","Pi"],["sin","cos","tan","Del","int","Mod","log","pow"],["asin","acos","atan","cosh","root","tanh","sinh"],["acosh","atanh","asinh","Sigma"]];f.addToken=function(a){for(var b=0;b<a.length;b++){var c=a[b].token.length,d=-1;if(c<r.length)for(var e=0;e<r[c].length;e++)if(a[b].token===r[c][e]){d=g.indexOf(r[c][e]);break}d===-1?(g.push(a[b].token),k.push(a[b].type),r.length<=a[b].token.length&&(r[a[b].token.length]=[]),r[a[b].token.length].push(a[b].token),i.push(a[b].value),h.push(a[b].show)):(g[d]=a[b].token,k[d]=a[b].type,i[d]=a[b].value,h[d]=a[b].show)}},f.lex=function(a,b){"use strict";var c,s,t,u,v={value:f.math.changeSign,type:0,pre:21,show:"-"},w={value:")",show:")",type:5,pre:0},x={value:"(",type:4,pre:0,show:"("},y=[x],z=[],A=a,B=0,C=l,D=0,E=o,F="";"undefined"!=typeof b&&f.addToken(b);var G={};for(s=0;s<A.length;s++)if(" "!==A[s]){for(c="",t=A.length-s>r.length-2?r.length-1:A.length-s;t>0;t--)for(u=0;u<r[t].length;u++)e(A,r[t][u],s,t)&&(c=r[t][u],u=r[t].length,t=0);if(s+=c.length-1,""===c)throw new f.Exception("Can't understand after "+A.slice(s));var H,I=g.indexOf(c),J=c,K=k[I],L=i[I],M=j[K],N=h[I],O=y[y.length-1];for(H=z.length;H--&&0===z[H];)if([0,2,3,5,9,11,12,13].indexOf(K)!==-1){if(C[K]!==!0)throw new f.Exception(c+" is not allowed after "+F);y.push(w),C=m,E=p,d(z,-1).pop()}if(C[K]!==!0)throw new f.Exception(c+" is not allowed after "+F);if(E[K]===!0&&(K=2,L=f.math.mul,N="&times;",M=3,s-=c.length),G={value:L,type:K,pre:M,show:N},0===K)C=l,E=o,d(z,2).push(2),y.push(G),y.push(x);else if(1===K)1===O.type?(O.value+=L,d(z,1)):y.push(G),C=m,E=n;else if(2===K)C=l,E=o,d(z,2),y.push(G);else if(3===K)y.push(G),C=m,E=p;else if(4===K)B+=z.length,z=[],D++,C=l,E=o,y.push(G);else if(5===K){if(!D)throw new f.Exception("Closing parenthesis are more than opening one, wait What!!!");for(;B--;)y.push(w);B=0,D--,C=m,E=p,y.push(G)}else if(6===K){if(O.hasDec)throw new f.Exception("Two decimals are not allowed in one number");1!==O.type&&(O={value:0,type:1,pre:0},y.push(O),d(z,-1)),C=q,d(z,1),E=o,O.value+=L,O.hasDec=!0}else 7===K&&(C=m,E=p,d(z,1),y.push(G));8===K?(C=l,E=o,d(z,4).push(4),y.push(G),y.push(x)):9===K?(9===O.type?O.value===f.math.add?(O.value=L,O.show=N,d(z,1)):O.value===f.math.sub&&"-"===N&&(O.value=f.math.add,O.show="+",d(z,1)):5!==O.type&&7!==O.type&&1!==O.type&&3!==O.type&&13!==O.type?"-"===J&&(C=l,E=o,d(z,2).push(2),y.push(v),y.push(x)):(y.push(G),d(z,2)),C=l,E=o):10===K?(C=l,E=o,d(z,2),y.push(G)):11===K?(C=l,E=o,y.push(G)):12===K?(C=l,E=o,d(z,6).push(6),y.push(G),y.push(x)):13===K&&(C=m,E=p,y.push(G)),d(z,-1),F=c}for(H=z.length;H--&&0===z[H];)y.push(w),d(z,-1).pop();if(C[5]!==!0)throw new f.Exception("complete the expression");for(;D--;)y.push(w);return y.push(w),new f(y)},b.exports=f},{"./math_function.js":3}],3:[function(a,b,c){var d=function(a){this.value=a};d.math={isDegree:!0,acos:function(a){return d.math.isDegree?180/Math.PI*Math.acos(a):Math.acos(a)},add:function(a,b){return a+b},asin:function(a){return d.math.isDegree?180/Math.PI*Math.asin(a):Math.asin(a)},atan:function(a){return d.math.isDegree?180/Math.PI*Math.atan(a):Math.atan(a)},acosh:function(a){return Math.log(a+Math.sqrt(a*a-1))},asinh:function(a){return Math.log(a+Math.sqrt(a*a+1))},atanh:function(a){return Math.log((1+a)/(1-a))},C:function(a,b){var c=1,e=a-b,f=b;f<e&&(f=e,e=b);for(var g=f+1;g<=a;g++)c*=g;return c/d.math.fact(e)},changeSign:function(a){return-a},cos:function(a){return d.math.isDegree&&(a=d.math.toRadian(a)),Math.cos(a)},cosh:function(a){return(Math.pow(Math.E,a)+Math.pow(Math.E,-1*a))/2},div:function(a,b){return a/b},fact:function(a){if(a%1!==0)return"NaN";for(var b=1,c=2;c<=a;c++)b*=c;return b},inverse:function(a){return 1/a},log:function(a){return Math.log(a)/Math.log(10)},mod:function(a,b){return a%b},mul:function(a,b){return a*b},P:function(a,b){for(var c=1,d=Math.floor(a)-Math.floor(b)+1;d<=Math.floor(a);d++)c*=d;return c},Pi:function(a,b,c){for(var d=1,e=a;e<=b;e++)d*=Number(c.postfixEval({n:e}));return d},pow10x:function(a){for(var b=1;a--;)b*=10;return b},sigma:function(a,b,c){for(var d=0,e=a;e<=b;e++)d+=Number(c.postfixEval({n:e}));return d},sin:function(a){return d.math.isDegree&&(a=d.math.toRadian(a)),Math.sin(a)},sinh:function(a){return(Math.pow(Math.E,a)-Math.pow(Math.E,-1*a))/2},sub:function(a,b){return a-b},tan:function(a){return d.math.isDegree&&(a=d.math.toRadian(a)),Math.tan(a)},tanh:function(a){return d.sinha(a)/d.cosha(a)},toRadian:function(a){return a*Math.PI/180}},d.Exception=function(a){this.message=a},b.exports=d},{}],4:[function(a,b,c){var d=a("./lexer.js");d.prototype.toPostfix=function(){"use strict";for(var a,b,c,e,f,g=[],h=[{value:"(",type:4,pre:0}],i=this.value,j=1;j<i.length;j++)if(1===i[j].type||3===i[j].type||13===i[j].type)1===i[j].type&&(i[j].value=Number(i[j].value)),g.push(i[j]);else if(4===i[j].type)h.push(i[j]);else if(5===i[j].type)for(;4!==(b=h.pop()).type;)g.push(b);else if(11===i[j].type){for(;4!==(b=h.pop()).type;)g.push(b);h.push(b)}else{a=i[j],e=a.pre,f=h[h.length-1],c=f.pre;var k="Math.pow"==f.value&&"Math.pow"==a.value;if(e>c)h.push(a);else{for(;c>=e&&!k||k&&e<c;)b=h.pop(),f=h[h.length-1],g.push(b),c=f.pre,k="Math.pow"==a.value&&"Math.pow"==f.value;h.push(a)}}return new d(g)},b.exports=d},{"./lexer.js":2}],5:[function(a,b,c){var d=a("./postfix.js");d.prototype.postfixEval=function(a){"use strict";a=a||{},a.PI=Math.PI,a.E=Math.E;for(var b,c,e,f=[],g=this.value,h="undefined"!=typeof a.n,i=0;i<g.length;i++)1===g[i].type?f.push({value:g[i].value,type:1}):3===g[i].type?f.push({value:a[g[i].value],type:1}):0===g[i].type?"undefined"==typeof f[f.length-1].type?f[f.length-1].value.push(g[i]):f[f.length-1].value=g[i].value(f[f.length-1].value):7===g[i].type?"undefined"==typeof f[f.length-1].type?f[f.length-1].value.push(g[i]):f[f.length-1].value=g[i].value(f[f.length-1].value):8===g[i].type?(b=f.pop(),c=f.pop(),f.push({type:1,value:g[i].value(c.value,b.value)})):10===g[i].type?(b=f.pop(),c=f.pop(),"undefined"==typeof c.type?(c.value=c.concat(b),c.value.push(g[i]),f.push(c)):"undefined"==typeof b.type?(b.unshift(c),b.push(g[i]),f.push(b)):f.push({type:1,value:g[i].value(c.value,b.value)})):2===g[i].type||9===g[i].type?(b=f.pop(),c=f.pop(),"undefined"==typeof c.type?(console.log(c),c=c.concat(b),c.push(g[i]),f.push(c)):"undefined"==typeof b.type?(b.unshift(c),b.push(g[i]),f.push(b)):f.push({type:1,value:g[i].value(c.value,b.value)})):12===g[i].type?(b=f.pop(),"undefined"!=typeof b.type&&(b=[b]),c=f.pop(),e=f.pop(),f.push({type:1,value:g[i].value(e.value,c.value,new d(b))})):13===g[i].type&&(h?f.push({value:a[g[i].value],type:3}):f.push([g[i]]));if(f.length>1)throw new d.exception("Uncaught Syntax error");return f[0].value>1e15?"Infinity":parseFloat(f[0].value.toFixed(15))},d.eval=function(a,b,c){return"undefined"==typeof b?this.lex(a).toPostfix().postfixEval():"undefined"==typeof c?"undefined"!=typeof b.length?this.lex(a,b).toPostfix().postfixEval():this.lex(a).toPostfix().postfixEval(b):this.lex(a,b).toPostfix().postfixEval(c)},b.exports=d},{"./postfix.js":4}]},{},[1])(1)});
 
 let compactMode = $app.env != $env.app && $app.env != $env.action;
 var lastKey = null;
 
 $define({
   type: "CalcButton: UIButton",
   props: [
     "container",
     "label",
     "overlay"
   ],
   events: {
     initWithInfo: info => {
       self = self.$super().$init();
 
       self.$setTitle_forState(info.title, 0);
       self.$setBackgroundColor(info.bgcolor.runtimeValue());
       self.$setTitleColor_forState(info.titleColor.runtimeValue(), 0);
       self.$setInfo(info.coord.runtimeValue());
       let label = self.$titleLabel();
       let font = $objc("UIFont").$systemFontOfSize_weight(info.fontSize, -0.5).rawValue();
       label.$setFont(font);
 
       let overlay = $objc("UIView").$new();
       overlay.$setBackgroundColor($color("black").runtimeValue());
       overlay.$setAlpha(0);
       self.$addSubview(overlay);
       self.$setOverlay(overlay);
 
       return self;
     },
     layoutSubviews: () => {
       self.$super().$layoutSubviews();
       let overlay = self.$overlay();
       overlay.$setFrame(self.$bounds());
     },
     setHighlighted: highlighted => {
       let overlay = self.$overlay();
       let alpha = highlighted ? 0.1 : 0;
       overlay.$setAlpha(alpha);
     }
   }
 });
 
 const colors = {
   black: $color("#000000"),
   white: $color("#ffffff"),
   red: $color("#ff3b30"),
   darkBlue: $color("#37474f"),
   lightBlue: $color("#157efb"),
   lightGray: $color("#eef1f1"),
 }
 
 const symbols = {
   clear: "C",
   back: "←",
   copy: "copy",
   enter: "enter",
   dot: ".",
   plus: "﹢",
   minus: "﹣",
   times: "×",
   obelus: "÷",
   equals: "=",
 }
 
 $ui.push({
   props: {
     title: $l10n("Calculator"),
     bgcolor: colors.darkBlue
   },
   views: [
     {
       type: "view",
       props: {
         id: "container"
       },
       layout: (make, view) => {
         make.edges.equalTo(view.super.safeArea);
       },
       events: {
         layoutSubviews: view => {
 
           let subviews = view.views;
           let width = view.frame.width;
           let height = view.frame.height;
           let cols = compactMode ? 10 : 4;
           let rows = compactMode ? 2 : 5;
           let inset = 1.0 / $device.info.screen.scale;
           let itemWidth = (width - (cols - 1) * inset) / cols;
           let itemHeight = Math.min(itemWidth, (height - rows * inset) / (rows + 1));
 
           for (const subview of subviews) {
             let coord = subview.info;
             if (coord) {
               let row = coord[0];
               let col = coord[1];
               let y = height - (itemHeight * (row + 1) + inset * row);
               let x = col * (itemWidth + inset);
               subview.frame = $rect(x, y, itemWidth, itemHeight);
             }
           }
 
           let gradient = $("gradient-layer");
           gradient.frame = $rect(view.frame.x, 0, width, height - (itemHeight * rows + inset * (rows - 1)));
         }
       }
     },
     {
       type: "gradient",
       props: {
         id: "gradient-layer",
         colors: [colors.black, colors.darkBlue],
         locations: [0.0, 1.0],
         startPoint: $point(0, 0.5),
         endPoint: $point(0, 1)
       },
       views: [
         {
           type: "label",
           props: {
             id: "result-label",
             text: "0",
             font: (() => {
               let size = ($app.env == $env.app || $app.env == $env.keyboard) ? 64 : 32;
               let font = $objc("UIFont").$systemFontOfSize(size);
               return font.rawValue();
             })(),
             textColor: colors.white,
             align: $align.right,
             lines: 0
           },
           layout: (make, view) => {
             make.top.bottom.equalTo(0);
             make.left.right.inset(8);
           }
         }
       ]
     }
   ]
 });
 
 let container = $("container");
 container.add(newButton("1", compactMode ? [1, 0] : [1, 0], colors.white, colors.darkBlue, 18));
 container.add(newButton("2", compactMode ? [1, 1] : [1, 1], colors.white, colors.darkBlue, 18));
 container.add(newButton("3", compactMode ? [1, 2] : [1, 2], colors.white, colors.darkBlue, 18));
 container.add(newButton("4", compactMode ? [1, 3] : [2, 0], colors.white, colors.darkBlue, 18));
 container.add(newButton("5", compactMode ? [1, 4] : [2, 1], colors.white, colors.darkBlue, 18));
 container.add(newButton("6", compactMode ? [1, 5] : [2, 2], colors.white, colors.darkBlue, 18));
 container.add(newButton("7", compactMode ? [1, 6] : [3, 0], colors.white, colors.darkBlue, 18));
 container.add(newButton("8", compactMode ? [1, 7] : [3, 1], colors.white, colors.darkBlue, 18));
 container.add(newButton("9", compactMode ? [1, 8] : [3, 2], colors.white, colors.darkBlue, 18));
 container.add(newButton("0", compactMode ? [1, 9] : [0, 0], colors.white, colors.darkBlue, 18));
 container.add(newButton(symbols.clear, compactMode ? [0, 0] : [4, 0], colors.lightGray, colors.red, 18));
 container.add(newButton(symbols.back, compactMode ? [0, 1] : [0, 2], colors.lightGray, colors.red, 18));
 container.add(newButton(symbols.copy, compactMode ? [0, 2] : [4, 1], colors.lightGray, colors.darkBlue, 15));
 container.add(newButton(symbols.enter, compactMode ? [0, 3] : [4, 2], colors.lightGray, colors.darkBlue, 15));
 container.add(newButton(symbols.dot, compactMode ? [0, 4] : [0, 1], colors.lightGray, colors.darkBlue, 20));
 container.add(newButton(symbols.plus, compactMode ? [0, 5] : [1, 3], colors.lightBlue, colors.white, 23));
 container.add(newButton(symbols.minus, compactMode ? [0, 6] : [2, 3], colors.lightBlue, colors.white, 23));
 container.add(newButton(symbols.times, compactMode ? [0, 7] : [3, 3], colors.lightBlue, colors.white, 23));
 container.add(newButton(symbols.obelus, compactMode ? [0, 8] : [4, 3], colors.lightBlue, colors.white, 23));
 container.add(newButton(symbols.equals, compactMode ? [0, 9] : [0, 3], colors.lightBlue, colors.white, 23));
 
 function newButton(title, coord, bgcolor, titleColor, fontSize) {
 
   let button = $objc("CalcButton").$alloc().$initWithInfo({
     title: title,
     coord: coord,
     bgcolor: bgcolor,
     titleColor: titleColor,
     fontSize: fontSize + (compactMode ? 0 : 20),
   });
 
   return {
     type: "runtime",
     props: {
       view: button
     },
     events: {
       tapped: tapped
     }
   }
 }
 
 function tapped(sender) {
   $device.taptic();
   $keyboard.playInputClick();
 
   let key = sender.title;
   let label = $("result-label");
   let text = label.text;
   let number = parseInt(text);
   let isInvalid = isNaN(number) || text === "0" || !isFinite(number);
 
   if (key === symbols.clear) {
     label.text = "0";
   } else if (key === symbols.back) {
     if (text.length === 1 || isInvalid) {
       label.text = "0";
     } else {
       label.text = text.substring(0, text.length - 1);
     }
   } else if (key === symbols.copy) {
     $clipboard.text = text;
   } else if (key === symbols.enter) {
     $keyboard.insert(text);
   } else if (key === symbols.equals) {
     try {
       var formula = text;
       formula = formula.replace(new RegExp(symbols.plus, "g"), "+");
       formula = formula.replace(new RegExp(symbols.minus, "g"), "-");
       formula = formula.replace(new RegExp(symbols.times, "g"), "*");
       formula = formula.replace(new RegExp(symbols.obelus, "g"), "/");
       label.text = mexp.eval(formula);
     } catch(err) {
       label.text = "Error";
     }
   } else if (
     key === symbols.plus ||
     key === symbols.minus ||
     key === symbols.times ||
     key === symbols.obelus ||
     key === symbols.dot) {
     if (!text.endsWith(key)) {
       if (text === "0" && key === symbols.minus) {
        label.text = key;
       } else {
        label.text = text + key;
       }
     }
   } else {
     if (text !== symbols.minus && (isInvalid || lastKey === symbols.equals)) {
       label.text = key;
     } else {
       label.text = text + key;
     }
   }

   lastKey = key;
 }