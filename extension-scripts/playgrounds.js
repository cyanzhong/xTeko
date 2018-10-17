let string = await $qrcode.scan();
let links = $detector.link(string);
let {script} = await $http.get(links[0]);
$addin.eval(script);