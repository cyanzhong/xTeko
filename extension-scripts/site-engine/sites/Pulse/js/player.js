"use strict";

function Player(options) {
  this.position = {x: options && options.x || 0, y: options && options.y || 0};
  this.dimension = {w: 32, h: 32};
  this.velocity = 5;
  this.timer = 0;
  this.moveTo = {x: 0, y: 0};
  this.angle = 0;
  this.lives = 3;
  this.kills = 0;
  this.hitGlitch = false;

  this.idle = false;
  this.empState = 0; // States: 0=Idle, 1=Arming, 2=Release, 3=Exploding.
  this.empTimer = -1;
  this.explosionTimer = 0;
  this.spawning = false;
  this.moving = false;
  this.colliding = false;
  this.dying = false;
  this.diePreCallback = function(){};
  this.diePostCallback = function(){};
  this.canMove = false;

  // hack.
  this.isMouseDown = false;

  this.explosionCallback = null;

  this.emp = {
    x: this.x,
    y: this.y,
    radius: 0,
    pX: this.x,
    pY: this.y,
    pRadius: 0,
  }

  this.collisions = [];
  var that = this;

  this.checkCollisions = function() {
    that.colliding = false;
    if (that.empState === 0 || that.empState === 1 || that.empState === 3) {
      //that.collisions.forEach(function(collision){
      for (var i = 0; i < that.collisions.length; i++) {
        var collision = that.collisions[i];
        if (collision.type === 'player') {
          var c1 = {radius: collision.obj.radius, x: collision.obj.x, y: collision.obj.y};
          var c2 = {radius: that.emp.radius > that.dimension.w ? that.emp.radius : that.dimension.w, x: that.position.x, y: that.position.y};

          var dx = c1.x - c2.x;
          var dy = c1.y - c2.y;
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < c1.radius + c2.radius) {
            that.colliding = true;
            collision.callback(collision.obj, that);
          }
        }
      };
      //});
    }
  }

  var mobile = "ontouchstart" in document;

  if (!options.demo) {
    $.addEventListener('touchstart', function(e){
      if (that.empState === 0) {
        that.armEMP();
      }
      that.canMove = true;
      that.move(e.clientX, e.clientY);
    });

    $.addEventListener('touchend', function(e){
      that.canMove = false;
      if (that.empState === 1 && that.empTimer > 0.5) {
        that.releaseEMP();
      } else if(that.empState === 1 && that.empTimer <= 0.5) {
        that.empState = 0;
      }
    });

    $.addEventListener('touchmove', function(e){
      if (that.empState == 0) {
        that.armEMP();
      }

      that.canMove = true;
      that.move(e.clientX, e.clientY);
    });

    $.addEventListener('mousedown', function(e){
      that.isMouseDown = true;
      if (that.empState == 0) {
        that.armEMP();
      }
      that.canMove = true;
      that.move(e.offsetX, e.offsetY);
    });

    $.addEventListener('mouseup', function(e){
      that.isMouseDown = false;
      that.canMove = false;
      if (that.empState == 1) {
        that.releaseEMP();
      }
    });

    $.addEventListener('mousemove', function(e){
      that.isMouseDown = true;

      if (that.isMouseDown) {
        // if (that.empState == 0) {
        //   that.armEMP();
        // }

        that.canMove = true;
      }
      that.move(e.offsetX, e.offsetY);
    });
  }
}

Player.prototype.update = function(dt){
  if (!this.spawning) {
    this.checkCollisions();
  }

  if (this.moving) {
    var xDistance = this.moveTo.x - this.position.x;
    var yDistance = this.moveTo.y - this.position.y;
    var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    if (distance > 1) {
        this.position.x += xDistance * (dt * this.velocity);
        this.position.y += yDistance * (dt * this.velocity);
    } else {
      this.moving = false;
    }

    this.angle = Math.atan2(yDistance,xDistance) * (180/Math.PI);
  }

  //Spawning.
  if (this.spawning && this.timer > 2) {
    this.spawning = false;
  }

  //Dying.
  if (this.dying && this.timer > 1) {
    this.dying = false;
    this.timer = 0;
    this.diePostCallback(this);
    this.spawn();
  }

  // Arming EMP
  if (this.empState === 1) {
    this.empTimer += dt;
    this.emp.radius = 32 + this.empTimer * 50;
  }

  if (this.empState === 2) {
    this.empTimer += dt;

    if (this.empTimer > 1) {
      this.explodeEMP();
    }
  }

  if (this.empState === 3) {
    this.explosionTimer = 0;
    this.empState = 0; // back to iddle.
    this.empTimer = 0;
  }

  if (this.explosionTimer >= 0) {
    this.explosionTimer += dt;

    if (this.explosionTimer >= 1) {
      this.explosionTimer = -1;
    }
  }

  this.timer += dt;
}

Player.prototype.render = function(){
  var ctx = this.ctx;

  if (this.idle) {
    return false;
  }

  if (DEBUG) {
    ctx.textAlign = 'left';
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px "pulse"';
    ctx.fillText('STATE ' + this.empState, 1, ctx.canvas.height - 20);
    ctx.fillText('TIMER ' + this.empTimer, 100, ctx.canvas.height - 20);
  }


  if (this.empState == 1) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.emp.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(' + $palette[2] + ',0.8)';
    ctx.fill();

    ctx.globalCompositeOperation = "overlay";
    for (var i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(' + $palette[3] + ',0.8)';
      ctx.lineWidth = 10;
      var randomRadius = this.emp.radius - Math.random() * this.emp.radius;
      ctx.arc(this.position.x, this.position.y, randomRadius, randomRadius / 2, randomRadius / 2 + (Math.PI));
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  if (this.empState == 2) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.emp.radius, 0, 2 * Math.PI);

    ctx.fillStyle = parseInt(this.empTimer * 10) % 2 == 0?'rgba(' + $palette[1] + ',0.8)':'rgba(' + $palette[1] + ',0.4)';
    ctx.fill();
  }

  if (this.explosionTimer >= 0) {
    ctx.beginPath();
    ctx.arc(this.emp.pX, this.emp.pY, this.emp.pRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255,255,255,' + (1-this.explosionTimer) + ')';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.emp.pX, this.emp.pY, this.emp.pRadius + this.explosionTimer * 60, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255,255,255,' + (1-this.explosionTimer) + ')';
    ctx.stroke();
  }

  if (!this.dying) {
    if (this.spawning) {
      ctx.globalAlpha = parseInt(this.timer * 10) % 2 == 0?1:0.5;
    }

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.dimension.w, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(' + $palette[1] + ',1)';
    ctx.fill();

    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.rotate((this.timer*(this.empState == 1?400:200)) * Math.PI / 180);
    ctx.translate(-this.dimension.w/2,-this.dimension.h/2); // before we draw the sprite lets set the anchor point to its center.
    // ctx.beginPath();
    // ctx.rect(0, 0, this.dimension.w, this.dimension.h);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.rect(0, 0, this.dimension.w, this.dimension.h);
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

Player.prototype.move = function(x, y){
  if (this.canMove) {
    this.moveTo.x = x;
    this.moveTo.y = y;
    this.moving = true;
  }
}

Player.prototype.setIdle = function() {
  this.idle = true;
}

Player.prototype.spawn = function() {
  this.timer = 0;
  this.spawning = true;
  this.empState = 0;
}

Player.prototype.die = function(preCallback, postCallback) {
  var explosion1 = new Explosion({x: this.position.x, y: this.position.y, color: 'rgba(' + $palette[5] + ',1)'});
  var explosion2 = new Explosion({x: this.position.x, y: this.position.y, color: 'rgba(' + $palette[6] + ',1)'});
  this.parent.addEntity(explosion1);
  this.parent.addEntity(explosion2);

  this.emp.radius = 0;
  this.lives--;
  this.timer = 0;
  this.dying = true;
  this.diePostCallback = postCallback;
  this.empState = -1;
  preCallback(this);
  //this.spawn();
}

Player.prototype.armEMP = function() {
  this.emp.radius = 0;
  this.empTimer = 0;
  this.empState = 1;
}

Player.prototype.releaseEMP = function() {
  this.empState = 2;
  this.empTimer = 0;
}

Player.prototype.explodeEMP = function() {
  // trigger explosion collision tests.
  var that = this;

  this.collisions.forEach(function(collision){
    if (collision.type === 'explosion') {
      var r1 = collision.obj.radius;
      var r2 = that.emp.radius;
      var p1x = collision.obj.x;
      var p1y = collision.obj.y;
      var p2x = that.position.x;
      var p2y = that.position.y;

      var a = r1 + r2;
      var x = p1x - p2x;
      var y = p1y - p2y;

      if ( a > Math.sqrt( (x*x) + (y*y) ) ) {
        collision.callback(collision.obj, that);
      }
    }
  });

  if (this.explosionCallback) {
    this.explosionCallback(this);
  }

  this.emp.pX = this.position.x;
  this.emp.pY = this.position.y;
  this.emp.pRadius = this.emp.radius;
  this.emp.radius = 0;
  this.empState = 3;
  this.empTimer = 0;
  this.kills = 0;
}

Player.prototype.addCollisionTest = function(obj, type, callback) {
  this.collisions.push({
    obj: obj,
    type: type,
    callback: callback
  });
}
