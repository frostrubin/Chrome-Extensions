    //firstLetters: ['a','o','u','A','O','U'],
    //secondLetters: ['e','E'],

var App = {
    memory: '',

    dictionary: {'ae':'ä','oe':'ö','ue':'ü','AE':'Ä','OE':'Ö','UE':'Ü'},
    area: {},


    word_dict: {},
    word_separators: [' ','Enter'],
    word_memory: '',

    onLoad: function() {
        this.area = document.getElementById('textarea');
        fetch('./umlaut_dict.json').then(response => {
            return response.json()
        }).then(data => {
            this.word_dict = data;
            document.getElementById('status').innerText = 'Dictionary Loaded'
        });        
    },
    onKeyDown: function(event) {
        this.onKeyDownUmlaut(event);
        this.onKeyDownEuroSign(event);
        this.onKeyDownWords(event);
    },
    onKeyDownEuroSign: function(event) {
        if (event.key == 'e' && event.ctrlKey == true) {
            // Remove the "old" First Letter that was used to create the key combination
            var oldContent = this.area.value;
            var selStart   = this.area.selectionStart;
            this.area.value = oldContent.substring(0, selStart);

            // Append our Replacement
            this.area.value += '€';

            // Append the remainder of the old content
            this.area.value += oldContent.substring(selStart)

            // Prevent Default
            event.preventDefault();            
        }  
    },
    onKeyDownUmlaut: function(event) {
        console.log(event);
       
        // Only run for normal Alphabet Characters
        if (event.key.length > 1) {
            return;
        }

        // Only run if no special Modifier is present
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }

        // Append to memory
        this.memory += event.key
        console.log('Memory ' + this.memory);
        
        var newChar = this.dictionary[this.memory];
        if (typeof newChar == 'undefined') {
            return;
        }

        // Still here? Then Text Replacement should happen!
        
        // Remove the "old" First Letter that was used to create the key combination
        var oldContent = this.area.value;
        var selStart   = this.area.selectionStart;
        var newVal = oldContent.substring(0, selStart - this.memory.length + 1);
        newVal += newChar;                        // Append our Replacement
        newVal += oldContent.substring(selStart); // Append the remainder of the old content
        this.area.value = newVal;                 // Update Textarea
        this.area.selectionEnd = selStart;        // Keep cursor from moving to the end
        
        event.preventDefault();
    },  
    onKeyDownWords: function(event) {
        // Only run if no special Modifier is present
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }

        // Append to memory (for Real Characters only)
        var old_memory = this.word_memory;
        if (event.key.length == 1) {
            this.word_memory += event.key
            console.log('Word Memory ' + this.word_memory);    
        }

        // In case of Character deletions: Deal with them!
        if (event.code == 'Backspace') {
            this.word_memory = old_memory.slice(0, -1);
        }

        // On Special Word Separators: Do lookup
        if (! this.word_separators.includes(event.key)) {
            return;
        }
            
        // Clear Memory
        this.word_memory = '';
        
        var replacement = this.word_dict[old_memory];
        if (typeof replacement == 'undefined') {
            return;
        }

        // Still here? Then Replace!
        var oldContent = this.area.value;
        var selStart   = this.area.selectionStart;
        var newVal = oldContent.substring(0, selStart - old_memory.length);
        newVal += replacement                     // Append our Replacement
        newVal += oldContent.substring(selStart); // Append the remainder of the old content
        this.area.value = newVal;                 // Update Textarea
        this.area.selectionEnd = selStart;        // Keep cursor from moving to the end
    },
    onKeyUp: function(event) {
        this.memory = '';
    },
}