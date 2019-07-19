# siteEngine

一个本地 Web 服务器，无需网络即可部署网站。

# 如何工作

在默认状况下，本脚本内置了 10 个离线网站，你可以把他们当做样例。

如果需要添加新的站点，可以通过如下的一些方法：

- 打包网站成 zip 文件，通过 Web 服务器上传
- 打包网站成 zip 文件，通过 Files 应用导入
- 可以将网站目录 AirDrop 至 `sites` 目录
- 还可以通过 JSBox 内置的文件管理器手动创建网站

# 首页文件

在默认状况下，默认首页是 `index.html`，你可以在设置页面里面更改。

siteEngine 会通过下面的顺序寻找首页文件：

- 默认首页
- index.html
- index.htm
- 根目录下任何一个 *.html 或 *.htm

如果没有找到一个可用的首页，将会提示错误。

# 自定义拦截

你可以定制 Handlers 用来拦截请求，并可以返回定制的结果。

在 `handlers.js` 文件里面有一个例子，如果感兴趣的话可以尝试一下。

相关文档：https://docs.xteko.com/#/network/server

# 免责声明

一部分例子是从 https://js13kgames.com 上面获取的，其中一部分使用的是 MIT 协议，但有些并没有提供一个协议。如果你不希望你的程序作为 siteEngine 的一个样例出现，请通过 0x00eeee@gmail.com 联系我，我将尽快移除。