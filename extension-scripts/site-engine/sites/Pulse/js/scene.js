"use strict";

function Scene() {
  GO(this); //extend from game object.
  this.entities = [];
  this.parent = null;
  var that = this;

  this.addListener('update', function(dt){
    that.entities.forEach(function(entity){
      entity.update(dt);
    });
  });

  this.addListener('render', function(){
    that.entities.forEach(function(entity){
      entity.render();
    });
  });
};

Scene.prototype = Object.create(GO.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.addEntity = function(entity, zIndex){
  entity.ctx = this.ctx;
  entity.parent = this;
  this.entities.push(entity);
}

Scene.prototype.init = function(){
  this.triggerListeners('init');
}

Scene.prototype.clear = function(){
  this.entities = [];
  //this.listeners = [];
}
