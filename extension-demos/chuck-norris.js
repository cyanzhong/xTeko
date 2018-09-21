let api = "https://api.chucknorris.io/jokes/random";
let result = await $http.get(api);
let value = result.data.value;

$intents.finish(value);
