var MOBILE = "ontouchstart" in document;
var WIDTH = window.innerWidth < window.innerHeight && window.innerWidth > 420 ? 420 : window.innerWidth > window.innerHeight && window.innerWidth > 767 ? 768 : window.innerWidth;
var HEIGHT = window.innerHeight < window.innerWidth && window.innerHeight > 420 ? 420 : window.innerHeight > window.innerWidth && window.innerHeight > 767 ? 768 : window.innerHeight;

if (window.innerHeight > 768) {
  WIDTH = 420;
  HEIGHT = 768;
}
var $;
var DEBUG = false;

//Christina - http://www.colourlovers.com/palette/2562636/Christina
var $palette = [
  '78,57,93',     // 0 background and title
  '142,190,148',  // 1 player
  '142,190,148',  // 2 emp background
  '204,252,142',  // 3 emp ray
  '220,91,62',    // 4 boid
  '130,112,133',  // 5 explosion 1
  '204,252,142',  // 6 explosion 2
  '130,112,133',  // 7 text color
  '193,184,194',  // 8 text highlight color
  '142,190,148',  // 9 alt boid
];

window.addEventListener('load', function(){
  $ = new Game({
    canvas: document.getElementById('canvas'),
    width: WIDTH, //window.innerWidth,
    height: HEIGHT, //window.innerHeight,
  });

  document.getElementById('canvas').style.display = 'block';
  document.getElementById('loading').style.display = 'none';

  // Setup menu scene - from scene-menu.js.
  $.addScene(menu);

  // Setup game scene - from scene-game.js.
  $.addScene(game);

  $.setActiveScene(0);

  $.run();
});

window.addEventListener('resize', function(){
  WIDTH = window.innerWidth < window.innerHeight && window.innerWidth > 420 ? 420 : window.innerWidth > window.innerHeight && window.innerWidth > 767 ? 768 : window.innerWidth;
  HEIGHT = window.innerHeight < window.innerWidth && window.innerHeight > 420 ? 420 : window.innerHeight > window.innerWidth && window.innerHeight > 767 ? 768 : window.innerHeight;
  $.width = WIDTH;
  $.height = HEIGHT;
  $.ctx.canvas.width = WIDTH;
  $.ctx.canvas.height = HEIGHT;
});
