var game = new Scene();

game.addStats = function() {
  game.stats = {
    date: Date.now(),
    score: game.score,
    pulses: game.pulsesCount,
    kills: game.kills,
    maxKills: game.maxKills,
    maxScore: game.maxScore,
    startTime: game.startTime,
    endTime: game.endTime,
  }

  var stats = window.localStorage.getItem('stats');
  var col = [];
  if (stats) {
    col = JSON.parse(stats);
  }

  col.push(game.stats);

  window.localStorage.setItem('stats', JSON.stringify(col));
}

game.getHiScore = function() {
  var stats = window.localStorage.getItem('stats');
  var hi = 0;
  if (stats) {
    var col = JSON.parse(stats);
    col.forEach(function(stat){
      if (stat.score > hi) {
        hi = stat.score;
      }
    });
  }
  return hi;
}

game.addListener('init', function(){
  game.timer = 0;
  game.score = 0;
  game.kills = 0;
  game.maxKills = 0;
  game.maxScore = 0;
  game.addBoids = false;
  game.boidsCounter = 0;
  game.pulsesCount = 0;
  game.startTime = Date.now();
  game.endTime = null;
  game.stats = null;
  game.gameOver = false;

  // Every 2 seconds add 20 boids.
  game.boidsCreationInterval = window.setInterval(function(){
    var num = 10;
    var type = 'normal';

    if (game.boidsCounter == 20) {
      num = 1;
      type = 'alt';
    }

    var boids = game.entities[0].createBoid(num, type);
    boids.forEach(function(boid){
      player.addCollisionTest(boid, 'explosion', function(boid, player){
        // Don't destroy the boid, just reset position.
        boid.x = 0;
        boid.y = 0;
        player.kills++;

        if (boid.type == 'alt') {
          player.hitGlitch = true;
        }
      });

      player.addCollisionTest(boid, 'player', collisionCallback);
    });

    game.boidsCounter += num;

    if (game.boidsCounter > (MOBILE?100:200)) {
      window.clearInterval(game.boidsCreationInterval);
    }
  }, 5000);

  var swarm = new Swarm({
    width: game.parent.width,
    height: game.parent.height,
  });
  //swarm.createBoid(100);
  swarm.createBoid(20);

  game.addEntity(swarm);

  var player = new Player({
    x: game.parent.width / 2,
    y: game.parent.height / 2
  });

  player.explosionCallback = function(player){
    game.pulsesCount++;
    if (player.kills === 0) {
      return;
    }

    if (player.hitGlitch) {
      console.log('NO SCORE!');
      player.hitGlitch = false;
      return;
    }
    // Higher the kill count in one explosion, higher the bonus.
    var killScore = player.kills + Math.floor(Math.pow(player.kills / 2, 2));
    killScore = killScore < player.kills?player.kills:killScore;

    game.score += killScore;
    game.kills += player.kills;

    if (killScore > game.maxScore) {
      game.maxScore = killScore;
    }

    if (player.kills > game.maxKills) {
      game.maxKills = player.kills;
    }

    killsText.text = '+' + killScore; // + '[' + player.kills + ']';
    killsText.fillStyle = 'rgba(' + $palette[7] + ',1)';
    if (player.kills > 20) {
      killsText.fillStyle = 'rgba(' + $palette[8] + ',1)';
    }
    if (player.kills > 40) {
      killsText.fillStyle = 'red';
    }
    killsText.start();
  }

  function collisionCallback(boid) {
    if (boid.type == 'alt') {
      return;
    }

    if (player.dying) {
      return;
    }

    player.die(
      function(player) {
        if (player.lives <= 0) {
          game.gameOver = true;
          game.timer = 0;
          var hiScore = game.getHiScore();
          var isHiScore = game.score > hiScore;

          var text = new T({
            x: game.parent.width / 2,
            y: game.parent.height / 2 - 140,
            font: '48px "pulse"',
            text: 'GAME OVER!'
          });

          game.addEntity(text);
          game.endTime = Date.now();
          game.addStats();

          var text1 = new T({
            x: game.parent.width / 2,
            y: game.parent.height / 2 - 90,
            font: '36px "pulse"',
            text: 'SCORE: ' + game.score,
          });
          game.addEntity(text1);

          var text11 = new T({
            x: game.parent.width / 2,
            y: game.parent.height / 2 - 70,
            font: '14px "pulse"',
            fillStyle: 'rgba(' + $palette[8] + ',1)',
            text: '\u2605 NEW HI-SCORE \u2605',
            //text: 'NEW HI-SCORE',
          });

          if (!isHiScore) {
            text11.text = 'HI-SCORE: ' + hiScore;
          }

          game.addEntity(text11);

          var text2 = new T({
            x: game.parent.width / 2,
            y: game.parent.height / 2 - 30,
            font: '24px "pulse"',
            text: 'Pulses: ' + game.stats.pulses,
          });
          game.addEntity(text2);

          var text3 = new T({
            x: game.parent.width / 2,
            y: game.parent.height / 2,
            font: '24px "pulse"',
            text: 'Kills: ' + game.stats.kills,
          });
          game.addEntity(text3);

          var text4 = new T({
            x: game.parent.width / 2,
            y: game.parent.height / 2 + 40,
            font: '18px "pulse"',
            text: 'In one pulse',
          });
          game.addEntity(text4);

          var text5 = new T({
            x: game.parent.width / 2,
            y: game.parent.height / 2 + 60,
            font: '18px "pulse"',
            text: 'Max Kills: ' + game.stats.maxKills,
          });
          game.addEntity(text5);

          var text6 = new T({
            x: game.parent.width / 2,
            y: game.parent.height / 2 + 80,
            font: '18px "pulse"',
            text: 'Max Score: ' + game.stats.maxScore,
          });
          game.addEntity(text6);

        }
      },
      function(player) {
        if (player.lives <= 0) {
          game.entities.splice(game.entities.indexOf(player) , 1);
          var setActiveScene = function() {
            $.setActiveScene(0);
            $.removeEventListener(l1);
            $.removeEventListener(l2);
          }
          var l1 = $.addEventListener('touchstart', setActiveScene);
          var l2 = $.addEventListener('mousedown', setActiveScene);
          window.clearInterval(game.boidsCreationInterval);
        }
      }
    );
  }

  swarm.boids.forEach(function(boid){
    player.addCollisionTest(boid, 'explosion', function(boid, player){
      // Don't destroy the boid, just reset position.
      boid.x = 0;
      boid.y = 0;
      player.kills++;

      if (boid.type == 'alt') {
        player.hitGlitch = true;
        console.log('HIT!');
      }
    });

    player.addCollisionTest(boid, 'player', collisionCallback);
  });

  game.addListener('update', function(dt){
    game.timer += dt;
  });

  game.addEntity(player);

  var scoreText = new T({
    x: game.parent.width / 2,
    y: 60,
    font: '36px "pulse"',
    text: game.score
  });

  scoreText.addListener('update', function(dt){
    scoreText.text = game.score;
    if (game.gameOver && scoreText.y > - 20) {
      scoreText.y -= dt * 200;
    }
  });

  game.addEntity(scoreText);

  var livesText = new T({
    x: game.parent.width / 2,
    y: 30,
    font: '24px "pulse"',
    fillStyle: 'red',
    text: "\u2665\u2665\u2665"
  });

  livesText.addListener('update', function(dt){
    livesText.text = '\u2665\u2665\u2665'.substring(0, player.lives);
  });

  game.addEntity(livesText);

  var killsText = new T({
    x: game.parent.width / 2,
    y: 80,
    font: '36px "pulse"',
    text: ''
  });
  killsText.timer = 0;

  // Clear all listeners, doing custom ones.
  killsText.listeners = [];

  killsText.addListener('update', function(dt){
    if (!killsText.show) {
      return;
    }

    killsText.timer += dt / 2;
    //killsText.y -= dt * 5:

    var xDistance = $.width/2 - killsText.x;
    var yDistance = 40 - killsText.y;
    var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    if (distance > 1) {
        killsText.x += xDistance * (dt * 2);
        killsText.y += yDistance * (dt * 2);
    }

    if (killsText.timer > 1) {
      killsText.show = false;
    }
  });

  killsText.addListener('render', function(ctx){
    if (!killsText.show) {
      return;
    }

    var ctx = killsText.ctx;
    ctx.globalAlpha = 1 - killsText.timer;
    ctx.fillStyle = killsText.fillStyle;
    ctx.font = killsText.font;
    ctx.textAlign = killsText.align;
    // Update text bounds property.
    killsText.bounds = ctx.measureText(killsText.text);
    ctx.fillText(killsText.text, killsText.x, killsText.y);
    ctx.globalAlpha = 1;
  });

  killsText.start = function(){
    killsText.show = true;
    killsText.timer = 0;
    killsText.x = player.position.x;
    killsText.y = player.position.y;
  }

  game.addEntity(killsText);

});
