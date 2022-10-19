var fs = require("fs");
const path = require("path");

var getFiles = function (pathDir) {
  if (typeof pathDir !== "string") {
    return [];
  }
  var files = [];
  fs.readdirSync(pathDir).forEach(function (file) {
    var subpathDir = path.join(pathDir, file);
    if (fs.lstatSync(subpathDir).isDirectory()) {
      getFiles(subpathDir, files);
    } else {
      files.push(subpathDir);
    }
  });
  return files;
};

module.exports = { getFiles };
