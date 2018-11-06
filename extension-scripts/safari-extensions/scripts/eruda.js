(function () {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.innerHTML = "var script = document.createElement('script');script.type = 'text/javascript';script.src = '//cdn.jsdelivr.net/npm/eruda';script.onload = function () { eruda.init() };document.body.appendChild(script);"
  document.body.appendChild(script);
})();