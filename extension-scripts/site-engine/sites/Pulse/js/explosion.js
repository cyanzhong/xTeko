function randomFloat (min, max) {
	return min + Math.random()*(max-min);
}

function Explosion(options) {
  this.particles = [];
  this.x = options && options.x || 0;
  this.y = options && options.y || 0;
  this.color = options && options.color || '#ffffff';

  //this.createExplosion = function() {
    var minSize = 10;
  	var maxSize = 30;
  	var count = 10;
  	var minSpeed = 60.0;
  	var maxSpeed = 200.0;
  	var minScaleSpeed = 1.0;
  	var maxScaleSpeed = 4.0;

  	for (var angle=0; angle<360; angle += Math.round(360/count)) {
  		var particle = new Particle();

  		particle.x = this.x;
  		particle.y = this.y;

  		particle.radius = randomFloat(minSize, maxSize);

  		particle.color = this.color;

  		particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);

  		var speed = randomFloat(minSpeed, maxSpeed) * 2;

  		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
  		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

  		this.particles.push(particle);
  	//}

    this.update = function(frameDelay) {
    	// update and draw particles
    	for (var i=0; i<this.particles.length; i++) {
    		var particle = this.particles[i];
    		particle.update(frameDelay);
    	}
    }

    this.render = function(context2D) {
      context2D = this.ctx;
      for (var i=0; i<this.particles.length; i++) {
    		var particle = this.particles[i];
    		particle.render(context2D);
    	}
    }
  };
}
