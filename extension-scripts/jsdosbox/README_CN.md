# JsDosBox

基于 [js-dos](https://js-dos.com/) 的 DOSBox 环境。

# 使用

- 将 DOS 程序打包成 zip 文件放置于 `www/roms` 目录下
- 启动脚本，输入启动命令后启动
- 如不输入启动命令，可以在程序解压完成后打开键盘执行命令
- 可以为程序指定挂载的目录，目录只支持 8 位以内的字母或数字，默认状况下入文件名符合则使用文件名，否则自动生成
- 运行界面中的快捷键可以自定义，请参考 [keycode](https://keycode.info/) 获取键值
- 每个 DOS 程序可以有自己的 dosbox.conf 文件，[参考](http://js-dos.com/#js-dos-622-faq-how-to-override-dosboxconf)

# 已知问题

- 启动声音时可能会听到杂音，请小心
- 目前横屏模式下面无法使用全键盘（我们可能不会修复这个问题）

# TODO

- 外接键盘支持

# 致谢

- [js-dos](https://js-dos.com/)