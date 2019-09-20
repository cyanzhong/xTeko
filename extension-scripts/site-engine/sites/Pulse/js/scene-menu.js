var menu = new Scene();

menu.addListener('init', function(){
  menu.timer = 0;

  function startGame() {
    //music.stop();
    var player = menu.entities[0];
    player.spawn();
    $.setActiveScene(1);
    $.removeEventListener(l1);
    $.removeEventListener(l2);
  }

  var l1 = $.addEventListener('touchstart', startGame);
  var l2 = $.addEventListener('mousedown', startGame);

  var player = new Player({
    x: game.parent.width / 2,
    y: game.parent.height / 2,
    demo: true,
  });
  menu.addEntity(player);

  menu.swarm = new Swarm({
    width: menu.parent.width,
    height: menu.parent.height,
  });
  menu.swarm.createBoid(1, 'alt');

  menu.addEntity(menu.swarm);


  menu.introTexts = [
    {
      queue: [1,3],
      text: 'HOW TO PLAY...',
    },
    {
      queue: [4,6],
      text: 'TOUCH TO MOVE',
    },
    {
      queue: [6,8],
      text: 'AND TO ARM THE PULSE',
    },
    {
      queue: [9,13],
      text: 'RELEASE TO TRIGGER IT!',
    },
    {
      queue: [14,18],
      text: 'AFTER RELEASING THE PULSE',
    },
    {
      queue: [18,22],
      text: 'PLACE YOURSELF ABOVE',
    },
    {
      queue: [22,26],
      text: 'THE ENEMIES TO DESTROY THEM',
    },
    {
      queue: [28,34],
      text: 'GOOD LUCK!',
    },
  ];
});

menu.addListener('render', function(ctx){
  // ctx.beginPath();
  // ctx.rect(0, 0, $.width, $.height);
  // ctx.fillStyle = '#1A2333';
  // ctx.fill();

  var scale = (Math.abs(Math.cos(menu.timer)) / 2) / 3 + 0.7;

  ctx.fillStyle = 'rgba(' + $palette[7] + ',1)';
  ctx.font = 'bold 16px "pulse"';
  ctx.textAlign = 'center';
  ctx.fillText('A GAME BY MARCO FERNANDES', $.width / 2, 30);
  ctx.fillText('twitter.com/marcoffernandes', $.width / 2, 45);

  ctx.save();
  ctx.translate($.width / 2, 100);
  ctx.scale(scale, scale);

  ctx.shadowBlur = 100;
  ctx.shadowColor = 'rgba(' + $palette[3] + ', 0.4)';

  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.textAlign = 'center';
  ctx.font = 'bold 120px "pulse"';

  ctx.fillText('PULSE', -2, 38);
  ctx.fillText('PULSE', 2, 38);
  ctx.fillText('PULSE', -2, 42);
  ctx.fillText('PULSE', 2, 42);

  ctx.fillStyle = 'rgb(' + $palette[0] + ')';
  ctx.font = 'bold 120px "pulse"';
  ctx.textAlign = 'center';
  ctx.fillText('PULSE', 0, 40);

  ctx.restore();

  menu.introTexts.forEach(function(help){
    if (menu.timer > help.queue[0] && menu.timer < help.queue[1]) {
      ctx.fillStyle = 'rgba(' + $palette[8] + ',1)';
      ctx.font = 'bold 24px "pulse"';
      ctx.textAlign = 'center';
      ctx.fillText(help.text, menu.parent.width / 2, menu.parent.height / 2 + 80);
    }
  });

  ctx.fillStyle = 'rgba(' + $palette[7] + ',1)';
  ctx.font = 'bold 16px "pulse"';
  ctx.textAlign = 'center';
  ctx.fillText('WATCH OUT FOR THE GLITCH', $.width / 2, $.height / 2 + 120);
  ctx.fillText('IT IS FRIENDLY', $.width / 2, $.height / 2 + 135);
  ctx.fillText('BUT MESSES WITH YOUR PULSE SCORE', $.width / 2, $.height / 2 + 150);
  ctx.fillText('WHEN HITTING IT', $.width / 2, $.height / 2 + 165);

  ctx.fillStyle = 'rgba(' + $palette[8] + ',1)';
  ctx.font = 'bold 24px "pulse"';
  ctx.textAlign = 'center';
  ctx.fillText('TOUCH TO START', $.width / 2, $.height - 20);
});

menu.addListener('update', function(dt){
  menu.timer += dt * 2;

  menu.swarm.boids[0].x = menu.parent.width / 2 + 130;
  menu.swarm.boids[0].y = menu.parent.height / 2 + 115;

  var player = menu.entities[0];
  player.canMove = true;

  if (menu.timer > 4 && menu.timer < 5) {
    player.move(game.parent.width / 2 - 50, game.parent.height / 2 - 20);
  }

  if (menu.timer > 5 && menu.timer < 6) {
    player.move(game.parent.width / 2 + 50, game.parent.height / 2 - 20);
  }

  if (menu.timer > 6 && menu.timer < 7) {
    player.move(game.parent.width / 2, game.parent.height / 2);
  }

  if (menu.timer > 5 && menu.timer < 6 && player.empState === 0) {
    player.armEMP();
  }

  if (menu.timer > 9 && menu.timer < 10 && player.empState === 1) {
    player.releaseEMP();
  }

  if (menu.timer > 35) {
    menu.timer = 0;
  }
});
