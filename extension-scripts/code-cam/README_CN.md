### codeCam

以漂亮的图片分享代码段，深受 [Carbon](https://carbon.now.sh) 的启发。

### 特性

- 主题，字体，以及很多其他设置项
- 内置 JavaScript/TypeScript 格式化工具
- 自动检查语言（基于 highlighjs，可能不能精确工作）
- 从剪贴板或 Action Extension 分享中获取代码

### 编辑/预览？

codeCam 内部使用 `CodeMirror` 作为编辑器，在理想状况下应该可以很好地用来编辑代码。但在 iOS 13 上面有很多问题，其中最严重的是文字选择经常不工作。在我们解决这些问题之前，你可以用纯文本编辑器来进行编辑。

### 提示

- 不要太依赖语言检测，在他不工作的时候你可以手动设置
- 将语言设置为 Plain Text 你将得到一个将文字转成卡片的工具，效果看起来很好

### 参考

- [Carbon](https://carbon.now.sh): 启发了 codeCam 的项目
- [CodeMirror](https://codemirror.net): 一个基于网页技术的代码编辑器
- [highlight.js](https://highlightjs.org): 代码高亮工具，在本项目中用来检测语言
- [html2canvas](https://html2canvas.hertzen.com/): 用来将 DOM 转换成图片