(function (document, window, undefined) {
  document.addEventListener("DOMContentLoaded", function (event) {
    const model = new Model();
    const view = new View();
    const controller = new Controller(model, view);

    controller.init();
  });
})(document, window)