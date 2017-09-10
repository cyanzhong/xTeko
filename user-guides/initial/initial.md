# xTeko: 为 Pin 3.0 创造无限的可能

Pin 最近推出了上线以来最大的一次更新：「xTeko 实验室」，用一句话概括这次更新的话就是：Pin 3.0 支持基于 `JavaScript` 的扩展程序，这意味着 Pin 已经从一个剪贴板应用蜕变成了「可扩展的效率利器」。

# 能做什么

对于大部分的用户而言，这个功能能做什么是最重要的。通俗的讲，xTeko 带给 Pin 一种插件热插拔的能力，让 Pin 可以随时加载、拆卸基于 JavaScript 编写的各种扩展，用一个通俗的比喻就是：Pin 的小程序系统。

虽然从技术的角度并无多少相似之处，但这样是最容易理解的。

但是 xTeko 也有一些独特的优点，例如：

- 支持运行在通知中心上
- 支持运行在分享面板上
- 支持丰富的原生接口调用，并且不断在增加
- 支持通过 Pin 内置的动作系统启动，与 Pin 现有功能有紧密的结合
- 仅仅需要 JavaScript 就能写出扩展，无须任何依赖以及 iOS 知识
- 支持构建纯原生、高性能的 iOS 用户界面

完全支持一门编程语言的标准是极为重要的，这意味着他能解决绝大部分「编程能解决」的问题，所受限的只是你的想象力。

# 如何使用

正如上述内容提到的，扩展插件支持很多的入口，所以我们有必要看看如何使用他，在这里会尽量介绍一些有趣的例子。

<img src="https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/lab.jpg" width="346px" />

在这里可以点击播放键运行扩展，界面支持滑动返回（到了首页继续返回将关闭界面）：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/app.gif)

通过长按可以对扩展进行排序操作：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/reorder.gif)

滑动可以删除某个扩展：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/delete.gif)

当你需要编辑一个扩展的时候，可以打开编辑器：

<img src="https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/editor.jpg" width="346px" />

目前这个编辑器支持简单的代码高亮和格式化操作，将会在之后的更新中逐步完善对自动提示的支持。

想要安装扩展？打开扩展商店便可以浏览在线推荐的扩展插件（目前扩展数量不多，还没有提供搜索操作）：

<img src="https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/store.jpg" width="346px" />

# 从通知中心启动扩展

Pin 作为从通知中心起步的应用，对通知中心的支持是必不可少的，所以大部分的扩展都会支持从通知中心运行，并且 Pin 3.0 提供了一个独立的插件：

<img src="https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/widget-01.jpg" width="346px" />

<img src="https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/widget-02.jpg" width="346px" />

不过受限于 iOS 的系统限制，部分功能无法在通知中心直接运行（例如拍照），部分功能在通知中心运行效果较差（例如列表不能滚动），退而求其次的，xTeko 可以从通知中心打开到主应用内去运行。

# 从分享面板启动

除了新增加的通知中心小部件以外，Pin 3.0 还提供的独立的分享面板插件，可以方便的从分享面板启动各种扩展：

<img src="https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/share.jpg" width="346px" />

这种操作方式带给了 Pin 增强其他应用的能力，只要从分享面板中启动，将可以获取的分享的数据，之后我们将看到一些有趣的例子。

# 如何安装扩展

Pin 的扩展插件支持多种安装方式，除了可以直接在扩展商店里面安装以外，还可以通过以下方式安装：

- 通过打开扩展商店分享出来的链接直接安装
- 如果是在电脑上打开的分享页面，可以通过扫描二维码安装
- 支持通过 Web 服务器从电脑端传输脚本到 iOS 设备
- 支持 AirDrop 从 macOS 传输脚本到 iOS 设备
- 支持从别的应用通过分享面板拷贝到 Pin 里面
- 支持通过 URL Scheme 安装扩展，例如：pin://install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fcyanzhong%2FxTeko%2Fmaster%2Fextension-scripts%2Fapi.js&name=%E6%B5%8B%E8%AF%95%E5%9C%A8%E7%BA%BF%E5%AE%89%E8%A3%85&icon=icon_063.png
- 复制脚本的链接，通过实验室的导入功能

提供多种方式是为了让扩展脚本的分享变得更便捷，后续会考虑让用户上传自己的脚本，让扩展插件的分享变得进一步简单。

# 一些有趣的例子

描述总是空洞的，再详细的描述不如看例子来的容易理解，这里展示几个扩展插件的功能（均可以从商店下载）。

**在通知中心查询汇率**

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/widget.gif)

**查看微信上面不支持预览的文件**

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/wechat.gif)

**在相册搜索图片（以图搜图）**

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/share-sheet.gif)

**在 App Store 上面获取资源**

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/app-store-01.gif)

**在 App Store 上面查看应用信息**

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/app-store-02.gif)

**图片打包分享**

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/zip.gif)

**在 Safari 上面查看网页源码**

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/safari-01.gif)

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/safari-02.gif)

以上只是部分扩展插件的效果展示，在之后扩展商店的内容也会不断的更新，从而可以实现各种各样的需求，需要的时候安装，不需要时即可卸载。

# 如何开发 xTeko 插件

Pin 3.0 支持的是标准 JavaScript，也就是说所有 `ECMAScript` 标准的内容都可以使用，但不包括 `BOM` 也就是浏览器对象，例如 `window` 对象。

在 xTeko 实验室中有默认安装的两个插件 `API 示例` 和 `UIKit 示例`，分别展示了部分 API 如何使用，以及如何实现自定义的界面，可以起到较好的参考作用。

将写好的代码通过上述提到的安装方式安装到 iOS 设备上，就能够运行、测试了。

在一篇以用户为主要受众的文章中，并不会介绍过多的开发细节，关于开发所有的细节都在官方文档里：

<img src="https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/docs.jpg" width="346px" />

# 亟待解决的问题

其实 xTeko 从打算开始做到现在已经陆陆续续持续了半年时间，按理说应该拿出一个很靠谱的版本才对，实际上现存的版本有很多问题：

- 无法重命名一个扩展（已经提交新版解决）
- 在商店更新扩展并不方便（正在实现新的界面）
- 通知中心性能不好，部分扩展运行起来会崩溃
- 开发过程中不好调试（正在优化）
- 部分开发接口文档缺失，或者不够详细（正在细化）

很抱歉现状并不够好，在之后的更新中将会努力地逐步的优化，敬请期待。

# 一些相关信息

最重要的是 xTeko 的官方文档：https://docs.xteko.com 之后任何关于扩展插件框架的更新都会同步到这里。

同时，我们也建立了一个 Telegram Channel 用于推送扩展商店上面的更新，欢迎订阅：https://t.me/xteko

当然，欢迎任何对此有兴趣的开发者朋友关注这个开源项目：https://github.com/cyanzhong/xteko 上面会同步所有的脚本更新和用户教程更新（也欢迎提交 PR）。

最后，一如既往地，不管是用户还是开发者，都欢迎通过邮件交流使用或者开发方面的问题：log.e@qq.com。

# xTeko 的愿景

尽管 xTeko 的现状是渺小的，但他的愿景是伟岸的：

- 让有能力写程序的人写程序
- 让有能力改代码的人改代码
- 让有兴趣的朋友加入这个队伍
- 让小白也可以从商店安装扩展

> Write script for your life, 为你的生活编写脚本

一起做点有趣的事，我们最终的目标是让生活更有效率。

PS: xTeko 这个单词是我胡乱拼凑的，没有任何意义，但正如 https://xkcd.com 一样，如果说刻意让其没有意义也算是一种意义，那 xTeko 的想法就如同 xkcd 网站：`想要一个没有任何意义的名字，这样就不会有一天对其感到厌倦`。
