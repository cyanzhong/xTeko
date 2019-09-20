/* Boid prototype */
"use strict";

function Boid(swarm, type) {
  this.x = Math.random() * 10 + (parseInt(Math.random() * 2) == 0?swarm.width - 10:0);
  this.y = Math.random() * 10 + (parseInt(Math.random() * 2) == 0?swarm.height - 10:0);

  this.type = type || 'normal';
  this.radius = 6;
  this.speed = this.type=='normal'?(Math.random() * 1.5) + 0.5:2.2; //1;
  this.radialSpeed = Math.PI / 60;
  this.vision = 50;
  this.heading = Math.random() * 2 * Math.PI - Math.PI;
}

Boid.prototype.draw = function(ctx) {
    var pointLen = this.radius * 2.5;
    ctx.fillStyle = 'rgba(' + $palette[4] + ',1)'; //this.type=='normal'?'#C7F464':'red';

    if (this.type == 'alt') {
      ctx.fillStyle = 'rgba(' + $palette[9] + ',1)';
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x + Math.cos(this.heading + Math.PI / 2) * this.radius,
               this.y + Math.sin(this.heading + Math.PI / 2) * this.radius);
    ctx.lineTo(this.x + Math.cos(this.heading + Math.PI) * pointLen,
               this.y + Math.sin(this.heading + Math.PI) * pointLen);
    ctx.lineTo(this.x + Math.cos(this.heading - Math.PI / 2) * this.radius,
               this.y + Math.sin(this.heading - Math.PI / 2) * this.radius);
    ctx.fill();
};

Boid.prototype.distance = function(boid, width, height) {
    var x0 = Math.min(this.x, boid.x), x1 = Math.max(this.x, boid.x);
    var y0 = Math.min(this.y, boid.y), y1 = Math.max(this.y, boid.y);
    var dx = Math.min(x1 - x0, x0 + width - x1);
    var dy = Math.min(y1 - y0, y0 + height - y1);
    return Math.sqrt(dx * dx + dy * dy);
};

Boid.prototype.getNeighbors = function(swarm) {
    var w = swarm.width, h = swarm.height;
    var neighbors = [];
    for (var i = 0; i < swarm.boids.length; i++) {
        var boid = swarm.boids[i];
        if (this !== boid && this.distance(boid, w, h) < this.vision) {
            neighbors.push(boid);
        }
    }
    return neighbors;
};

Boid.wrap = function(value) {
    var min, max;
    if (arguments.length === 2) {
        min = 0;
        max = arguments[1];
    } else if (arguments.length === 3) {
        min = arguments[1];
        max = arguments[2];
    } else {
        throw new Error('wrong number of arguments');
    }
    while (value >= max) value -= (max - min);
    while (value < min) value += (max - min);
    return value;
};

Boid.clamp = function(value, limit) {
    return Math.min(limit, Math.max(-limit, value));
};

Boid.meanAngle = function() {
    var sumx = 0, sumy = 0, len = arguments.length;
    for (var i = 0; i < len; i++) {
        sumx += Math.cos(arguments[i]);
        sumy += Math.sin(arguments[i]);
    }
    return Math.atan2(sumy / len, sumx / len);
};

Boid.prototype.step = function(swarm) {
    var w = swarm.width, h = swarm.height;
    var neighbors = this.getNeighbors(swarm);
    if (neighbors.length > 0) {
        var meanhx = 0, meanhy = 0;
        var meanx = 0, meany = 0;
        var mindist = this.radius * 2, min = null;
        for (var i = 0; i < neighbors.length; i++) {
            var boid = neighbors[i];
            meanhx += Math.cos(boid.heading);
            meanhy += Math.sin(boid.heading);
            meanx += boid.x;
            meany += boid.y;
            var dist = this.distance(boid, w, h);
            if (dist < mindist) {
                mindist = dist;
                min = boid;
            }
        }
        meanhx /= neighbors.length;
        meanhy /= neighbors.length;
        meanx /= neighbors.length;
        meany /= neighbors.length;

        var target;
        if (min) {
            // Keep away!
            target = Math.atan2(this.y - min.y, this.x - min.x);
        } else {
            // Match heading and move towards center
            var meanh = Math.atan2(meanhy, meanhx);
            var center = Math.atan2(meany - this.y, meanx - this.x);
            target = Boid.meanAngle(meanh, meanh, meanh, center);
        }

        // Move in this direction
        var delta = Boid.wrap(target - this.heading, -Math.PI, Math.PI);
        delta = Boid.clamp(delta, this.radialSpeed);
        this.heading = Boid.wrap(this.heading + delta, -Math.PI, Math.PI);
    }

    this.move(swarm);
};

Boid.prototype.move = function(swarm) {
    var padding = swarm.padding;
    var width = swarm.width, height = swarm.height;
    this.x = Boid.wrap(this.x + Math.cos(this.heading) * this.speed,
                       -padding, width + padding * 2);
    this.y = Boid.wrap(this.y + Math.sin(this.heading) * this.speed,
                       -padding, height + padding * 2);
};

/* Swam prototype. */

function Swarm(options) {
  this.width = options && options.width || 400;
  this.height = options && options.height || 400;
  this.boids = [];
  this.padding = 18;
}

Swarm.prototype.createBoid = function(n, type) {
  var createdBoids = [];
  for (var i = 0; i < (n || 1); i++) {
    var boid = new Boid(this, type);
    boid.parent = this;
    this.boids.push(boid);
    createdBoids.push(boid);
  }
  return createdBoids;
};

Swarm.prototype.clear = function() {
  this.boids = [];
};

Swarm.prototype.update = function(dt) {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].step(this);
  }
}

Swarm.prototype.render = function() {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].draw(this.ctx);
  }
}
