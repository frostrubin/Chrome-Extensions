var extensionToggle = 1;

chrome.action.onClicked.addListener(function() {
    //console.log('action.OnClick:');

    extensionToggle++;
    if (extensionToggle > 2){
        extensionToggle = 1;
    }

    switch(extensionToggle) {
    case 2:
        chrome.action.setBadgeText({text: "OFF"});
        break;
    default:
        chrome.action.setBadgeText({text: "ON"});
    }
});

console.log("Initializing IME");

var ime_api = chrome.input.ime;
var context_id = -1;

chrome.action.setBadgeText({text: "ON"});

var UmlautKeyCombinationHelper = {
    memory: '',
    dictionary: {'ae':'ä','oe':'ö','ue':'ü','AE':'Ä','OE':'Ö','UE':'Ü'},
    clear: function() {
        this.memory = '';
    },
    onKeyDown: function(engineID, keyData) {
        // Only run for normal Alphabet Characters
        if (keyData.key.length > 1) {
            return false;
        }

        // Only run if no special Modifier is present
        if (keyData.ctrlKey || keyData.altKey || keyData.metaKey) {
            return false;
        }

        // Append to memory
        this.memory += keyData.key
        //console.log('UmlautKeyCombinationHelperMemory ' + this.memory);    

        // Find Replacement Character
        var newChar = this.dictionary[this.memory];
        if (typeof newChar == 'undefined') {
            return false;
        }

        // Still here? Then Text Replacement should happen!
        
        // Remove the "old" First Letter that was used to create the key combination
        ime_api.deleteSurroundingText({'engineID': engineID, 
                                       'contextID': context_id, 
                                       'offset': -1, 
                                       'length': 1}, function(){
            ime_api.commitText({'contextID': context_id,
                                'text': newChar});
        });
        
        return true;
    },
    onKeyUp: function(engineID, keyData) {
        this.memory = '';
        return false;
    },    
}

var SharpSHelper = {
    memory: '',
    search: 'sss',
    clear: function() {
        this.memory = '';
    },
    onKeyDown: function(engineID, keyData) {
        // Only run for the lowercase letter s 
        if (keyData.key != 's') {
            this.memory = '';
            return false;
        }

        // Append to memory
        this.memory += keyData.key;
        //console.log('UmlautKeyCombinationHelperMemory ' + this.memory); 

        // Look up replacement
        if (this.memory == this.search) {
            // Remove the "old" Two S Letters that were used to create the key combination
            ime_api.deleteSurroundingText({'engineID': engineID, 
                                           'contextID': context_id, 
                                           'offset': -2, 
                                           'length': 2}, function(){
                ime_api.commitText({'contextID': context_id,
                                    'text': 'ß'});
            });            
            
            // Clear Memory
            this.memory = '';

            // Prevent Default
            return true;    
        }
        
        return false;
    },
    onKeyUp: function(engineID, keyData) {
        return false;
    },       
}

var EuroSignHelper = {
    clear: function() {
        // Nothing
    },
    onKeyDown: function(engineID, keyData) {
        if (keyData.key == 'e' && keyData.ctrlKey && keyData.altKey) {
            // Commit Text
            ime_api.commitText({'contextID': context_id,
                                'text': '€ '}); // The space at the end is needed! Otherwise: UTF8 Char Length Problems/Cursor Positioning Problems
                                
            // Prevent Default
            return true;          
        }
        return false;
    },
    onKeyUp: function(engineID, keyData) {
        this.memory = '';
        return false;
    },      
}

ime_api.onFocus.addListener(function(context) {
    //console.log('onFocus:' + context.contextID);
    switch(context.type) {
        case 'text':
        case 'search':
        case 'tel':
        case 'url':
        case 'email':
        case 'number':
            break;
        case 'password':
            return;
        default:
            //console.log('Unknown context.type ' + context.type);
            return;
    }
    context_id = context.contextID;
});

ime_api.onBlur.addListener(function(contextID) {
    //console.log('onBlur:' + contextID);
    context_id = -1;
});

//ime_api.onActivate.addListener(function(engineID) {
//    console.log('onActivate:' + engineID);
//});

//ime_api.onDeactivated.addListener(function(engineID) {
//    console.log('onDeactivated:' + engineID);
//});

ime_api.onKeyEvent.addListener(function(engineID, keyData) {
    //console.log('onKeyEvent:' + keyData.key + " context: " + context_id);
    if (context_id == -1) {
        return false;
    }

    if (extensionToggle == 3) {
        return false;
    }

    var result = [];
    if (keyData.type == 'keydown') {
        result.push(UmlautKeyCombinationHelper.onKeyDown(engineID, keyData));
        result.push(EuroSignHelper.onKeyDown(engineID, keyData));
        result.push(SharpSHelper.onKeyDown(engineID, keyData));
    } else if (keyData.type == 'keyup') {
        result.push(UmlautKeyCombinationHelper.onKeyUp(engineID, keyData));
        result.push(EuroSignHelper.onKeyUp(engineID, keyData));
        result.push(SharpSHelper.onKeyUp(engineID, keyData));     
    }

    var retVal = result.includes(true);
    //console.log('Returning ' + retVal);
    ime_api.keyEventHandled(keyData.requestId, retVal);
    return retVal;
});
