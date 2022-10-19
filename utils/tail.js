const events = require("events");
const childProcess = require("child_process");
const tailStream = require("fs-tail-stream");

const util = require("util");
const CBuffer = require("CBuffer");
const byline = require("byline");

function Tail(pathParam, opts) {
  events.EventEmitter.call(this);
  this.path = pathParam;
  this.options = opts || {
    buffer: 0,
  };

  this._buffer = new CBuffer(this.options.buffer);

  this.onChangeFile = (str) => {
    this.path = str;
    if (this.stream) this.stream.close();

    this.stream = tailStream.createReadStream(this.path, {
      encoding: "utf8",
      start: this.options.buffer,
      tail: true,
    });

    this.byline = byline(this.stream, { keepEmptyLines: true }).on(
      "data",
      (line) => {
        const str = line.toString();
        this._buffer.push(str);
        this.emit("line", str);
      }
    );
  };

  this.onChangeFile(pathParam); // for first init

  this.on("change-file", (str) => this.onChangeFile(str));
}

util.inherits(Tail, events.EventEmitter);

Tail.prototype.getBuffer = function getBuffer() {
  return this._buffer.toArray();
};

module.exports = (path, options) => new Tail(path, options);
