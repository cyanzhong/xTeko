# 前情提要

如果你还不知道 JSBox 是什么，这里有一篇文章可以供你参考：[JSBox: 一个创造工具的工具](https://sspai.com/post/42361)。

简单说，JSBox 是一个为效率工具爱好者设计的 iOS 应用，你可以用他编写、运行标准的 JavaScript 脚本。更酷的是你可以通过 JavaScript 来实现各种原生的 iOS 插件，甚至定制自己的 widget 和键盘，我们提供丰富的接口让你无需对 iOS 有所了解就能制作出自己的应用。

在过去的三个月时间里，我们不断地完善 JSBox 的功能，现在是时候跟大家介绍一下现在的 JSBox 能做什么了，我们进步了很多，和以前大有不同。

# 触发通知

现在 JSBox 支持通过系统通知来做很多事情，比如：

- 每天下午六点钟提醒下班，并打开查询实时公交
- 每天到达公司的时候，提示查看最新的邮件
- 打开分享面板时候，根据当前输入的内容自动触发一个脚本

这是一个简单的演示：

![image](https://github.com/cyanzhong/app-tutorials/raw/master/asset/jsbox-notification.gif)

简而言之，现在 JSBox 支持了通过`时间`、`日期`、`地理位置`、`应用场景`等条件来触发执行一个脚本，被触发的脚本会通过系统通知的形式提醒用户。用户可以点击通知来处理这个任务，更酷的是，用户可以直接按压这个消息从而在通知中心直接处理这个任务。

通知中心上面执行的脚本可以为这个功能带来很多便利，他让系统通知的形式丰富多样，而不仅仅限于显示文字和图片。你可以用脚本设计任何界面，甚至查询一下数据之后根据结果来展现，正如上面公交查询脚本所展现的那样。

值得一提的是，通过推送消息运行脚本的时候极为流畅，不会出现通知中心小组件那样“无法载入”的情况，非常适合用来查询数据后展现出来。

# 自定义小组件

在早期的 JSBox 版本里面，就支持通过通知中心小组件启动脚本，这个功能其实是一个启动器的性质：

![image](https://github.com/cyanzhong/app-tutorials/raw/master/asset/jsbox-launcher-default.jpg)

![image](https://github.com/cyanzhong/app-tutorials/raw/master/asset/jsbox-launcher-calc.jpg)

你可以直接在通知中心执行脚本，对于复杂一点的任务，也可以跳转到应用内去执行。但这还不能满足一些效率爱好者的需求，他们希望能够通过脚本直接设计自己的小组件，于是现在 JSBox 支持了这个功能。

比如说这个例子，是用来演示自定义通知中心小组件的样例，在通知中心显示今年的进度：

![image](https://github.com/cyanzhong/app-tutorials/raw/master/asset/jsbox-widget.jpg)

这个样例非常简单，只是用来演示自定义小组件如何工作，你可以从这里下载这个脚本：[下载地址](https://xteko.com/redir?url=https://raw.githubusercontent.com/cyanzhong/xTeko/master/extension-scripts/year-progress.js)，同时也已经有用户为 JSBox 提供了很酷的小组件，例如通知中心查询套餐余量：[下载地址](https://jsboxbbs.com/d/160-10010)。

当然我们必须认识到的是，iOS 上面的通知中心小组件体验极为有限，所以请不要在上面做过于繁重的任务，否则会出现的效果就是“无法载入”。

# 自定义键盘

有很多文字输入的场景，可以通过键盘扩展来辅助操作，比如说翻译正在输入的文字或选中的文字，或者是将常用的短语收集到键盘上进行快速输入。JSBox 提供的自定义键盘功能能让你完全设计一个自己的键盘，我们提供了 iOS 支持的所有键盘功能，例如`输入文字`、`删除`、`获取选中的文字`、`切换到下一个键盘`等等。

同时我们提供了一个样例程序（短语键盘）：

![image](https://github.com/cyanzhong/app-tutorials/raw/master/asset/jsbox-keyboard.gif)

麻雀虽小但五脏俱全，包括了构建一个 app 你能碰到的大多数问题；`构建界面`、`数据存储`、`本地化`、`模块化`。功能方面支持分类新增删除排序，短语新增删除排序，以及输出文字。当然这些都不是最重要的，最重要的是我要通过这个例子来演示 JSBox 强大的核心为你隐藏掉了很多细节（这个例子只有 200 多行 js），你可以在这里安装体验：[下载地址](https://xteko.com/redir?url=https://github.com/cyanzhong/xTeko/raw/master/extension-demos/keyboard.box)

JSBox 键盘最底下的一排按钮是默认的，是为了保证最基本的文字输入操作，同时也可以在键盘上启动别的脚本。而上面的界面则完全可以由脚本控制，编写界面的方法与在主应用毫无区别，你只需要简单了解一下 JSBox 提供的键盘接口，就能制造出一个自己的键盘扩展。

# 社区建设

以上改进都是让 JSBox 提供的能力更为强大，而这项改进则让 JSBox 相关交流变得更为便捷，我们建设了交流社区：[JSBox 社区](https://jsboxbbs.com)

早期的时候 JSBox 交流主要是通过这个 [Telegram](http://t.me/PinTG)，这样做的缺陷是显而易见的：**对于一些常见的讨论，无法形成沉淀**。

所以我们搭建了这个社区，为了让有趣的脚本有更好的展示和收集，同时也为用户提供一个讨论问题、提出建议的地方。

# 其他改进

除了以上内容以外，我们还做了很多值得一提的改进，例如：

- 支持了安装包格式，能让程序模块化
- 编辑器和文件管理都支持了搜索
- 支持了本地的 Web 服务器
- 脚本支持了分类，让你更好的管理脚本
- 提升了对外接键盘的支持，现在可以更好的使用 iPad + 键盘

当然还有很多细节受限于篇幅问题没有提到，可以移步更新日志一探究竟：https://jsboxbbs.com/d/49

我们很高兴在过去的几个月为 JSBox 做了这么多改进，但我们也意识到现在仍处于高速发展的阶段，还有很多缺陷和不足之处，需要继续努力。

也欢迎来自各个方面的意见和建议，联系我们：

- [社区](https://jsboxbbs.com)
- [邮件](mailto:log.e@qq.com)
- [Telegram](https://t.me/PinTG)
- [Twitter](https://twitter.com/cyanapps)
- [微博](https://weibo.com/0x00eeee)
