(function () {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = "var script = document.createElement('script');script.type = 'text/javascript';script.src = '//cdn.jsdelivr.net/npm/vconsole';script.onload = function () {var vConsole = new VConsole(); };document.body.appendChild(script);"
  document.body.appendChild(script);
})();
