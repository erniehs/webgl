(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
    ? define(["exports"], factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      factory((global.wavefront = {})));
})(this, function (exports) {
  "use strict";

  var isInt = (n) => n % 1 == 0;

  var parseArg = (a) => (isNaN(a) ? a : isInt(a) ? parseInt(a) : parseFloat(a));

  var parseArgs = (args) =>
    args.length > 1 ? args.map((e) => parseArg(e)) : parseArg(args[0]);

  var processIndices = (indices) =>
    indices.map((idc) => idc.split("/").map((i) => parseInt(i) - 1));

  var transpose = (m) => m.map((r, i) => r.map((c, j) => m[j][i]));

  var fIdx = (i) => ["v", "vt", "vn"][i];

  // TODO refactor... can u see the pattern?!
  function wavefront(data) {
    var curr;
    return data
      .split("\n")
      .map((l) => l.trim().split(" "))
      .reduce((p, c) => {
        var token = c[0];
        var args = parseArgs(c.slice(1));
        switch (token) {
          case "usemtl":
          case "newmtl":
            if (p["materials"] == undefined) {
              p["materials"] = {};
            }
            if (p["materials"][args] == undefined) {
              p["materials"][args] = {};
            }
            curr = p["materials"][args];
            break;
          case "Ka":
          case "Kd":
          case "Ke":
          case "Ks":
          case "Ni":
          case "Ns":
          case "d":
          case "illum":
            curr[token] = args;
            break;
          case "v":
          case "vt":
          case "vn":
            if (p[token] == undefined) {
              p[token] = [args];
            } else {
              p[token].push(args);
            }
            break;
          case "f":
            var data = transpose(processIndices(args));
            data.forEach((d, i) => {
              if (curr[fIdx(i)] != undefined) {
                curr[fIdx(i)].push(...d);
              } else {
                curr[fIdx(i)] = d;
              }
            });
            break;
        }
        return p;
      }, {});
  }

  function parse(...sources) {
    return wavefront(sources.join("\n"));
  }

  exports.parse = parse;

  Object.defineProperty(exports, "__esModule", { value: true });
});
