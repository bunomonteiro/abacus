let View = function () {
  let context = this,
    $els = {
      $wrapper: undefined
    },
    eventListeners = {
      onBlockClick: [],
      onOperationClick: []
    };

  this.init = function () {
    $els.$wrapper = document.querySelector('.wrapper');

    configEventHandlers();
  }

  this.bindOnBlockClick = function (cb) {
    if (typeof cb === 'function') {
      eventListeners.onBlockClick.push(cb);
    }
  }


  this.bindOnOperationClick = function (cb) {
    if (typeof cb === 'function') {
      eventListeners.onOperationClick.push(cb);
    }
  }

  this.render = function (data) {
    Array.from(document.getElementsByClassName('tower')).forEach(el => el.remove());

    for (let t = 0; t < data.towers.length; t++) {
      const $tower = document.getElementById('tower--template').content.firstElementChild.cloneNode(true);
      $tower.setAttribute('data-counter', t);
      $tower.setAttribute('data-multiplier', data.towers[t].multiplier);

      let $tempBlock;
      for (let b = 0; b < 9; b++) {        
        $tempBlock = document.getElementById('block-wrapper--template').content.firstElementChild.cloneNode(true);
        $tempBlock.setAttribute('data-counter', b);
        $tempBlock.setAttribute('data-value', b + 1);
        $tempBlock.setAttribute('data-empty', b >= data.towers[t].value);
        Array.from($tempBlock.querySelectorAll('.face')).forEach(el => el.setAttribute('data-value', b + 1));
        
        $tower.prepend($tempBlock);
        $tower.classList.add(data.theme);
      }

      $els.$wrapper.append($tower);
      this.updateDisplay(data.towers[t]);
    }
  }

  this.updateTower = function (tower) {
    if (typeof tower == 'undefined') {
      return;
    }

    let $lastBlockWrapper = undefined;
    Array.from($els.$wrapper.querySelectorAll(`[data-multiplier="${tower.multiplier}"] .block-wrapper`)).forEach($el => {
      const isEmpty = parseInt($el.getAttribute('data-value')) > tower.value;
      
      if(typeof $lastBlockWrapper === 'undefined' && !isEmpty) {
        $lastBlockWrapper = $el;
      }

      $el.setAttribute('data-empty', isEmpty);
    });

    if(typeof $lastBlockWrapper !== 'undefined') {
      $lastBlockWrapper.classList.add('animate__bounceIn');
      setTimeout(() => $lastBlockWrapper.classList.remove('animate__bounceIn'), 500);
    }
  }

  this.updateDisplay = function(tower) {
    document.querySelector(`.numbers .number[data-multiplier="${tower.multiplier}"]`).innerText = tower.value;
  }

  function configEventHandlers() {
    let onBlockWrapperClick = function($el) {
      const data = {
        multiplier: parseInt($el.closest('.tower').getAttribute('data-multiplier')),
        value: parseInt($el.getAttribute('data-value'))
      }

      $el.classList.add('animate__rubberBand');
      setTimeout(() => $el.classList.remove('animate__rubberBand'), 500);

      eventListeners.onBlockClick.forEach(listener => listener(data));
    }

    let onOperationClick = function($el) {
      const classes = Array.from($el.classList);
      const data = {
        isAddition: classes.indexOf('add') >= 0,
        isSubtraction: classes.indexOf('subtract') >= 0,
        multiplier: parseInt($el.closest('.tower').getAttribute('data-multiplier'))
      }

      eventListeners.onOperationClick.forEach(listener => listener(data));      
    }

    let onWrapperClick = function(e) {
      const $blockWrapper = e.target.closest('.block-wrapper');
      const $operation = e.target.closest('.operation');
      
      if($blockWrapper) {
        onBlockWrapperClick($blockWrapper);
      } else if ($operation) {
        onOperationClick($operation);
      }      
    }

    $els.$wrapper.addEventListener('click', onWrapperClick, false);
  }
}