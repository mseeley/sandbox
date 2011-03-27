/*
Copyright (c) 2010, Matthew Seeley
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Matthew Seeley nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function (global) {

  var type = "log",
      timers = {},
      doc = global.document,
      el;

  function create () {
    var d = doc.createElement("div"),
        s = doc.createElement("style"),
        css = "\
.log {padding:5px; line-height:1.25;}\
.log p {border-bottom:1px Solid #ccc; padding:4px; margin:0;}\
.log .log {color:#333;}\
.log .info {color:royalblue;}\
.log .warn {color:orange;}\
.log .error {color:crimson;font-weight:bold;}\
";

    d.className = "log";
    s.type = "text/css";

    if (s.textContent !== undefined)
      s.textContent = css;
    else
      s.styleSheet.cssText = css;

    // Append to head for compat in Safari 3
    doc.getElementsByTagName("HEAD")[0].appendChild(s);

    // Make the log element available in shared scope
    el = (doc.getElementById("log") || doc.body).appendChild(d);
  }

  function log (/* strings */) {
    if (!el) {
      create();
    }

    el.innerHTML += "<p class=\"" + type + "\">" + [].slice.call(arguments).join(" ") + "</p>";
    el.scrollTop = el.scrollHeight;
    type = "log";
  }

  log.info = function (/* strings */) {
    type = "info";
    log.apply(null, arguments);
  }

  log.warn = function (/* strings */) {
    type = "warn";
    log.apply(null, arguments);
  };

  log.error = function (/* strings */) {
    type = "error";
    log.apply(null, arguments);
  };

  log.time = function (name) {
    timers[name] = +new Date();
  };

  log.timeEnd = function (name) {
    log.info(name + ": " + (+new Date - timers[name]) + "ms");
    delete timers[name];
  };
  
  log.clear = function () {
    el.innerHTML = "";
  };
  
  log.keys = function (obj) {
    var keys = [],
        each,
        i;

    for (each in obj) {
        keys.push(each);
    }
    
    keys.sort();
    
    for (i=0; i < keys.length; i++) {
        log(keys[i]);
    }    
    
  };
  
  log.inspect = function (obj) {
    var messages = [],
        each;
    for (each in obj) {
        messages.push(each + ": " + obj[each] + "<br>");
    }
    log.apply(null, messages);
  };

  global.log = log;

})(this);
