async function getMaxNum() {
  let result = await $http.get("https://xkcd.com/info.0.json");
  return result.data.num;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

$ui.render({
  views: [
    {
      type: "image",
      props: {
        contentMode: $contentMode.scaleAspectFit
      },
      layout: $layout.fill
    }
  ]
});

let maxNum = await getMaxNum();
let num = getRandomInt(1, maxNum);
let result = await $http.get(`https://xkcd.com/${num}/info.0.json`);

$("image").src = result.data.img;
