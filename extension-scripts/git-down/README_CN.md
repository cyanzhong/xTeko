JSBox 有很多样例代码放在了 https://github.com/cyanzhong/xTeko 这个仓库，这是一个所有官方样例的合辑，要把其中某一个样例安装到设备上可能会有点麻烦。

这个脚本就是为了解决这个问题，它可以用来下载 GitHub 的某个子目录，支持安装为脚本或者保存到 Files 应用。

例如这是一个样例的路径：https://github.com/cyanzhong/xTeko/tree/master/extension-demos/stack-view

你可以复制后打开本脚本，或者通过扫描桌面端浏览器的二维码（可以通过浏览器插件生成）。此外，也支持在移动端的 Safari 中通过 Share Sheet 来运行。

如果某个 GitHub 仓库本身就是一个 JSBox 脚本，你可以通过这个脚本下载 `master` 分支的代码，这会直接下载 `/archive/master.zip`。

请注意，如果某个子目录有大量的文件，本脚本可能会由于 GitHub 对请求频率的限制而失败，请仅用于安装少量的样例代码。