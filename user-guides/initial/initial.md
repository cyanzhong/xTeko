# xTeko: 为 Pin 3.0 创造无限的可能

Pin 最近推出了上线以来最大的一次更新：「xTeko 实验室」，用一句话概括这次更新的话就是：Pin 3.0 支持基于 `JavaScript` 的扩展程序，这意味着 Pin 已经从一个剪贴板应用蜕变成了「可扩展的效率利器」。

# 能做什么

对于大部分的用户而言，这个功能能做什么是最重要的。通俗的讲，xTeko 带给 Pin 一种热插拔插件的能力，让 Pin 可以随时加载、拆卸基于 JavaScript 编写的各种扩展，用一个通俗的比喻就是：Pin 的小程序系统。

虽然从技术的角度并无多少相似之处，但这样是最容易理解的。

但是 xTeko 也有一些独特的特点，例如：

- 支持从通知中心启动
- 支持从分享面板启动
- 支持丰富的原生接口调用，并且不断的在增加
- 标准 JavaScript 支持，并且仅仅需要 JavaScript
- 支持构建纯原生的 iOS 用户界面
- 支持通过 Pin 内置的动作系统启动

支持标准 JavaScript 的意思是，他能解决绝大部分编程能解决的问题，所受限的只是你的想象力。

# 如何使用

正如上述内容提到的，扩展插件支持很多的入口，所以我们有必要看看如何使用他，在这里会尽量介绍一些有趣的例子。

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/lab.jpg)

在这里可以点击播放键运行扩展，界面支持滑动返回，继续返回将关闭界面：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/app.gif)

通过长按可以对扩展进行排序操作：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/reorder.gif)

滑动可以删除某个扩展：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/delete.gif)

当你需要编辑一个扩展的时候，可以打开代码编辑器：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/editor.jpg)

目前这个编辑器支持简单的代码高亮和格式化操作，将会在之后的更新中逐步完善对自动提示的支持。

想要安装扩展？打开扩展商店便可以浏览在线推荐的扩展插件（目前扩展数量不多，还没有提供搜索操作）：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/store.jpg)

# 从通知中心启动扩展

作为从通知中心起步的应用 Pin 来说，对通知中心的支持是必不可少的，所以大部分的扩展都会支持从通知中心运行，并且 Pin 3.0 提供了一个独立的插件：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/widget-01.jpg)

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/widget-02.jpg)

# 从分享面板启动

除了新增加的通知中心小部件以外，Pin 3.0 还提供的独立的分享面板插件，可以方便的从分享面板启动各种扩展：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/share.jpg)

# 如何安装扩展

Pin 的扩展插件支持多种安装方式，除了可以直接在扩展商店里面安装以外，还可以通过以下方式安装：

- 通过打开扩展商店分享出来的链接直接安装
- 如果是在电脑上打开的分享页面，可以通过扫描二维码安装
- 支持通过 Web 服务器从电脑端传输脚本到 iOS 设备
- 支持 AirDrop 从 macOS 传输脚本到 iOS 设备
- 支持通过 URL Scheme 安装扩展，例如：pin://install?url=https%3A%2F%2Fraw.githubusercontent.com%2Fcyanzhong%2FxTeko%2Fmaster%2Fextension-scripts%2Fapi.js&name=%E6%B5%8B%E8%AF%95%E5%9C%A8%E7%BA%BF%E5%AE%89%E8%A3%85&icon=icon_063.png
- 复制脚本的链接，通过实验室的导入功能

提供多种方式是为了让扩展脚本的分享变得更便捷，后续会考虑让用户上传自己的脚本。

# 一些有趣的例子

描述总是空洞的，一切都不如看例子来的实在，这里展示几个现在商店上可以下载到扩展的功能。

**在通知中心查询汇率**

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/widget.gif)

**查看微信上面不支持预览的文件**

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/animations/wechat.gif)

**在相册搜索图片**

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

这些只是部分扩展插件的效果展示，在之后扩展商店的内容也会不断的更新，从而可以实现各种各样的需求。

# 如何开发 xTeko 插件

Pin 3.0 支持的是标准 JavaScript，也就是说所有 `ECMAScript` 标准的内容都可以使用，但不包括 BOM 也就是浏览器对象，例如 `window` 对象。

在 xTeko 实验室中有默认安装的两个插件 `API 示例` 和 `UIKit 示例`，分别展示了部分 API 如何使用，以及如何实现自定义的界面，可以起到较好的参考作用。

将写好的代码通过上述提到的安装方式安装到 iOS 设备上，就能够运行、测试了。

在一篇以用户为主要受众的文章中，并不会介绍过多的开发细节，关于开发所有的细节都在官方文档里：

![image](https://raw.githubusercontent.com/cyanzhong/xTeko/master/user-guides/initial/screenshots/docs.jpg)

# 一些相关的信息

最重要的是 xTeko 的官方文档：https://docs.xteko.com 之后任何关于扩展插件框架的更新都会同步到这里。

同时，我们也建立了一个 Telegram Channel 用于推送扩展商店上面的更新，欢迎订阅：https://t.me/xteko

当然，欢迎任何对此有兴趣的开发者朋友关注这个开源项目，上面会同步 xTeko 所有的脚本更新和用户教程更新：https://github.com/cyanzhong/xteko 也欢迎提交 PR。

最后，一如既往地，不管是用户还是开发者，都欢迎通过邮件交流使用或者开发方面的问题：log.e@qq.com。

# xTeko 的愿景

xTeko 的现状是渺小的，但他的愿景是伟岸的：

- 让有能力写程序的人写程序
- 让有能力改代码的人改代码
- 让有兴趣的朋友加入这个队伍
- 让小白也可以从商店安装扩展

> Write script for your life, 为你的生活编写脚本

一起做点有趣的事，我们最终的目标是让生活更有效率。