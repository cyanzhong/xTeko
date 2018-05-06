# 简介

本扩展通过 [$safari.inject()](https://docs.xteko.com/#/sdk/safari?id=safariinjectscript) 方法在 Safari 上面运行 JavaScript 脚本，利用这个功能可以实现很多有趣的功能，例如本扩展目前包含的 3 个插件：

- [Firebug Lite](https://github.com/firebug/firebug-lite)
- [Eruda](https://eruda.liriliri.io/)
- [vConsole](https://github.com/Tencent/vConsole)

你可以在使用 Safari 的时候，通过分享面板打开 JSBox，然后根据需求分别使用这几个插件。

# 如何实现

简单介绍下 $safari.inject() 的使用方法，如果是本地脚本，非常简单像是这样：

```js
$safari.inject("window.location.href = 'https://apple.com';")
```

但是如果想要引入远程的 JavaScript 文件，则需要变通一下（Safari 有些限制）：

```js
(function() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://xteko.blob.core.windows.net/neo/eruda-loader.js';
  document.body.appendChild(script);
})();
```

请注意上述例子中的 `eruda-loader.js` 并不是 Eruda 本身的内容，而是长这个样子：

```js
var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://xteko.blob.core.windows.net/neo/eruda.min.js";
script.onload = function() {
  eruda.init()
}
document.body.appendChild(script);
```

也就是说远程的脚本，需要通过另外一个脚本来加载，所以当你想要加载远程 JavaScript 的时候，要准备两份 JavaScript 文件。

# 特别感谢

$safari.inject() 这个接口上线之后我一直没有去探究清楚远程脚本加载不成功的办法，[简悦](http://ksria.com/simpread/) 的作者发现了能够成功加载远程脚本的方法，在此对他表示感谢。