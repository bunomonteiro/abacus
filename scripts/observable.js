Observable = function() {
  let context = this;
  let _observers = [];

  this.data = {};

  this.subscribe = function(f) {
    if(typeof f === 'function') {
      _observers.push(f);
    }
  },

  this.unsubscribe = function(f) {
    if(typeof f === 'function') {
      _observers = _observers.filter(subscriber => subscriber !== f);
    }
  }

  this.notify = function() {
    _observers.forEach(observer => observer(context.data));
  }
}
