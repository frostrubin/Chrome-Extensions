// Saves options to chrome.storage.sync.
function save_options() {
    var syncOpt = {};
    // Get all Checkboxes
    var boxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < boxes.length; ++i) {
      var box = boxes[i];
      syncOpt[box.name] = box.checked; 
    }

    // Get all Input Texts
    var texts = document.querySelectorAll('input[type="text"]');
    for (var i = 0; i < texts.length; ++i) {
      var text = texts[i];
      syncOpt[text.name] = text.value; 
    }    

    chrome.storage.sync.set(syncOpt, function() {
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {status.textContent = '';}, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get(function(syncOpt) {
      if (has_any_property(syncOpt) == false) {
        // Nothing synced yet? Then the standards hard-coded in HTML apply. 
        // Save them once, then return
        save_options();
        return;
      }

      // Get all Checkboxes
      var boxes = document.querySelectorAll('input[type="checkbox"]');
      for (var i = 0; i < boxes.length; ++i) {
        var box = boxes[i];
        try {
          box.checked = syncOpt[box.name];
        } catch(e) {
        }
      }

      // Get all Input Texts
      var texts = document.querySelectorAll('input[type="text"]');
      for (var i = 0; i < texts.length; ++i) {
        var text = texts[i];
        if (syncOpt.hasOwnProperty(text.name)) {
          text.value = syncOpt[text.name]; 
        }
      }    
    });
}

function has_any_property(obj) {
    for(var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return true;
        }
    }
    return false;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);