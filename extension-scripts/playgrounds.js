let string = await $qrcode.scan();
let links = $detector.link(string);
let {data} = await $http.get(links[0]);
$addin.eval(data);