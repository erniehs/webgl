(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
    ? define(["exports"], factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      factory((global.glUtils = {})));
})(this, function (exports) {
  "use strict";

  function createShader(gl, sourceCode, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var info = gl.getShaderInfoLog(shader);
      throw "Could not compile WebGL program.\n\n" + info;
    }
    return shader;
  }

  function createShaderProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var info = gl.getProgramInfoLog(program);
      throw "Could not compile WebGL program.\n\n" + info;
    }
    return program;
  }

  function initShaderProgram(gl, vertexSource, fragmentSource) {
    return createShaderProgram(
      gl,
      createShader(gl, vertexSource, gl.VERTEX_SHADER),
      createShader(gl, fragmentSource, gl.FRAGMENT_SHADER)
    );
  }

  function initBuffer(gl, target, data, usage) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage);
    return buffer;
  }

  function initBuffersFromWavefront(gl, wavefront) {
    return Object.entries(wavefront.materials).map((m) => ({
      ambient: m[1].Ka,
      diffuse: m[1].Kd,
      vb: initBuffer(
        gl,
        gl.ARRAY_BUFFER,
        new Float32Array(m[1].v.map((i) => wavefront.v[i]).flat()),
        gl.STATIC_DRAW
      ),
      nb: initBuffer(
        gl,
        gl.ARRAY_BUFFER,
        new Float32Array(m[1].vn.map((i) => wavefront.vn[i]).flat()),
        gl.STATIC_DRAW
      ),
      length: m[1].v.length,
    }));
  }

  exports.initShaderProgram = initShaderProgram;
  exports.initBuffersFromWavefront = initBuffersFromWavefront;

  Object.defineProperty(exports, "__esModule", { value: true });
});
