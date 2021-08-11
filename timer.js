// jshint esversion: 9
// jshint laxbreak: true

class Timer {
  start() {
    this.start = Date.now();
  }

  getDuration() {
    return Date.now() - this.start;
  }
}