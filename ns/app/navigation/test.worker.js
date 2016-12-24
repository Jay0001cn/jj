  require('globals'); // necessary to bootstrap tns modules on the new thread
   

  onready = function() {
    postMessage("Hi");
  };