let Controller = function (model, view) {
  let context = this,
    autioUris = {
      add: './audio/button_click_03.mp3',
      subtract: './audio/button_click_01.mp3',
      denied: './audio/button_click_04.mp3'
    };

  this.init = function () {
    model.init();
    view.init();

    view.bindOnBlockClick(this.onBlockClick.bind(this));
    view.bindOnOperationClick(this.onOperationClick.bind(this));

    const towers = [
      { multiplier: 1000000, value: parseInt(Math.random() * 9) },
      { multiplier: 100000, value: parseInt(Math.random() * 9) },
      { multiplier: 10000, value: parseInt(Math.random() * 9) },
      { multiplier: 1000, value: parseInt(Math.random() * 9) },
      { multiplier: 100, value: parseInt(Math.random() * 9) },
      { multiplier: 10, value: parseInt(Math.random() * 9) },
      { multiplier: 1, value: parseInt(Math.random() * 9) }
    ];

    model.set('towers', towers);
    view.render({
      towers: towers,
      theme: 'theme-' + parseInt(Math.random() * 6)
    });
  }

  this.onBlockClick = function (data) {
    let tower = undefined;
    let isSelect = false;
    let towers = model.get('towers').map(t => {
      if(t.multiplier === data.multiplier) {
        isSelect = data.value > t.value;
        t.value = isSelect ? data.value : data.value - 1;

        tower = t;
      }

      return t;
    });

    isSelect ? new Audio(autioUris.add).play() : new Audio(autioUris.subtract).play();

    model.set('towers', towers);
    view.updateTower(tower);
    view.updateDisplay(tower);
  }

  this.onOperationClick = function(data) {
    let current = getValue(model.get('towers'));
    let future = current + (data.multiplier * (data.isAddition ? 1 : -1));

    if(future < 0 || future > 9999999) {
      new Audio(autioUris.denied).play();
      return;
    }

    if (data.isAddition) {
      new Audio(autioUris.add).play();
    } else {
      new Audio(autioUris.subtract).play();
    }

    updateDisplayByTotal(future)
  }

  function updateDisplayByTotal(total) {
    let towers = model.get('towers');
    let numbers = String(total).padStart(7, 0);
    numbers = numbers.substring(numbers.length - 7);

    for(let i = 0; i < numbers.length; i++) {
      if(parseInt(numbers[i]) !== towers[i].value) {
        towers[i].value = parseInt(numbers[i]);
        view.updateTower(towers[i]);
        view.updateDisplay(towers[i]);
      }
    }

    model.set('towers', towers);
  }

  function getValue(towers) {
    return towers.map(tower => tower.value * tower.multiplier)
      .reduce((current, next) => current + next);
  }
}