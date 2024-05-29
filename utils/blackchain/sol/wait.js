function wait(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
  }
  
  module.exports = wait;
  