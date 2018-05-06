(function(node, maker, setter, getter, identifier, src, element) {
  if (node.getElementById(identifier)) return;
  element = node[maker + 'NS'] && node.documentElement.namespaceURI;
  element = element ? node[maker + 'NS'](element, 'script') : node[maker]('script');
  element[setter]('id', identifier);
  element[setter]('src', src);
  (node[getter]('head')[0] || node[getter]('body')[0]).appendChild(element);
})(document, 'createElement', 'setAttribute', 'getElementsByTagName', 'FirebugLite', 'https://getfirebug.com/firebug-lite.js#startOpened')