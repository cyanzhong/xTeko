"use strict";

function GO(obj) {
  obj.ctx = null;
  obj.listeners = [];
}

GO.prototype.render = function(ctx) {
  if (!this.listeners) {
    return;
  }

  this.listeners.forEach(function(listener){
    if (listener.type == 'render') {
      listener.callback(ctx);
    }
  });
};

GO.prototype.update = function(dt) {
  if (!this.listeners) {
    return;
  }

  this.listeners.forEach(function(listener){
    if (listener.type == 'update') {
      listener.callback(dt);
    }
  });
};

GO.prototype.addListener = function(type, callback) {
  if (!this.listeners) {
    this.listeners = [];
  }

  this.listeners.push({
    type: type,
    callback: callback
  });
};

GO.prototype.triggerListeners = function(type, event) {
  if (!this.listeners) {
    this.listeners = [];
  }

  this.listeners.forEach(function(listener){
    if (listener.type == type) {
      listener.callback(event);
    }
  });
};
