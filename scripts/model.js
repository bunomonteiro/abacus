let Model = function (data) {
  let context = this,
    _modelData = {};
  
  this.init = function () {
    this.set('data', data);
  }

  this.bind = function (name, cb) {
    if(typeof cb !== 'function'){
      throw 'the Callback must be a function';
    }

    if(typeof name !== 'string'){
      throw 'the Name must be a string';
    }

    if(typeof _modelData[name] !== 'object'){
      _modelData[name] = new Observable();
    }

    _modelData[name].subscribe(cb);
  }

  this.unbind = function (name, cb) {
    if(typeof _modelData[name] === 'object' && typeof cb === 'function'){
      try {
        _modelData[name].unsubscribe(cb);
      } catch {}
    }
  }

  this.set = function (name, data) {
    if(typeof name !== 'string') {
      throw 'name must be a string';
    }

    if(typeof _modelData[name] !== 'object'){
      _modelData[name] = new Observable();
    }
    
    _modelData[name].data = data;
    _modelData[name].notify();
  };

  this.get = function (name, defaultValue = {}) {
    return cloneData(_modelData[name], defaultValue);
  };

  function cloneData(entity, defaultValue) {
    if(typeof entity !== 'undefined') {
      if(Array.isArray(entity.data)) {
        return entity.data.slice() || defaultValue;
      } else {
        return JSON.parse(JSON.stringify(entity.data)) || defaultValue;
      }
    }
    return defaultValue;
  }
}