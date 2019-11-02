### codeCam

Share good looking code snippets as images, inspired by [Carbon](https://carbon.now.sh).

### Features

- Themes, fonts, and many other options
- Prettier (for JavaScript/TypeScript)
- Language detection (highlighjs based, may not be very accurate)
- Read code from clipboard or the Action Extension sharing

### Edit/Preview?

codeCam uses `CodeMirror` as its editor, ideally, it should work for editing. However, there are many bugs in iOS 13, the most annoying one is that the "text selection" is really buggy. Before we solve those issues, you can use the plain text editor.

### Tips

- Language detection may not be great, in that case, you can set it manually
- If you set language as plain text, it becomes a "text to card" tool, results are great as well

### Reference

- [Carbon](https://carbon.now.sh): The project that inspired codeCam
- [CodeMirror](https://codemirror.net): A web based code editor
- [highlight.js](https://highlightjs.org): A syntax highlighter, used for language detection
- [html2canvas](https://html2canvas.hertzen.com/): Used for converting DOM to image