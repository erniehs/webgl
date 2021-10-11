(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
    ? define(["exports"], factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      factory((global.camera = {})));
})(this, function (exports) {
  "use strict";

  // TODO clean up

  var origin = [0, 0, 10];

  var up = [0, 1, 0, 0];
  var right = [1, 0, 0, 0];
  var forward = [0, 0, -1, 0];

  var near = 0.1;
  var far = 100.0;
  var fov = Math.PI / 4;

  var start,
    finish = [0, 0];
  var down = false;

  var yaw = -Math.PI / 2;
  var pitch = 0;
  var roll = 0;

  function ypr(v) {
    var p = glMatrix.quat.fromEuler(glMatrix.quat.create(), pitch, yaw, roll);
    var ip = glMatrix.quat.invert(glMatrix.quat.create(), p);
    return glMatrix.quat.mul(
      glMatrix.quat.create(),
      glMatrix.quat.mul(glMatrix.quat.create(), p, v),
      ip
    );
  }

  window.addEventListener("wheel", (e) => {
    move(
      ypr(
        glMatrix.vec4.scale(glMatrix.quat.create(), forward, -e.deltaY * 0.005)
      )
    );
  });

  window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  window.addEventListener("mousedown", (event) => {
    event.preventDefault();
    start = finish = [event.x, event.y];
    down = true;
  });

  window.addEventListener("mousemove", (event) => {
    event.preventDefault();
    if (down) {
      finish = [event.x, event.y];
      yaw += (finish[0] - start[0]) / 10;
      pitch += (finish[1] - start[1]) / 10;
      start = finish;
    }
  });

  window.addEventListener("mouseup", (event) => {
    event.preventDefault();
    finish = [event.x, event.y];
    down = false;
  });

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "a":
        move(ypr(glMatrix.vec4.scale(glMatrix.quat.create(), right, -0.05)));
        break;
      case "d":
        move(ypr(glMatrix.vec4.scale(glMatrix.quat.create(), right, 0.05)));
        break;
    }
  });

  function move(d) {
    glMatrix.vec4.add(origin, origin, d);
  }

  function viewMatrix() {
    return glMatrix.mat4.lookAt(
      glMatrix.mat4.create(),
      origin,
      glMatrix.vec4.add([0, 0, 0, 0], origin, ypr(forward)),
      ypr(up)
    );
  }

  function projectionMatrix(gl) {
    return glMatrix.mat4.perspective(
      glMatrix.mat4.create(),
      fov,
      gl.canvas.clientWidth / gl.canvas.clientHeight,
      near,
      far
    );
  }

  exports.viewMatrix = viewMatrix;
  exports.projectionMatrix = projectionMatrix;

  Object.defineProperty(exports, "__esModule", { value: true });
});
