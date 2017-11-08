var App = {
    umlauts: ['ä','ö','ü','Ä','Ö','Ü','ß'],
    umlauts_uppercase_only: ['Ä','Ö','Ü'],
    umlaut_replacement_primary: {'ä':"'",'ö':';','ü':'[','Ä':'"','Ö':':','Ü':'{','ß':'-'},
    cleaned_up_dict: [],
    all_lowercase_dict: [],
    output_dict: {},

    onLoad: function() {
        fetch('./DE_utf8.txt').then(response => {
            return response.text()
        }).then(text => {
            this.buildDict(text);
        });
    },
    buildDict: function(org) {
        // Track Status
        var status = document.getElementById('id-word');

        // Loop all lines, build the first Dictionary
        var lines = org.split('\n');
        for (let line of lines) {
            status.innerText = line;

            if (line.length == 0) {
                continue;
            }
            if (line.substring(0,1) == ' ') {
                continue;
            }
            if (line.includes(' ')) {
                continue;
            }

            var key = line;
            if (key.includes('/')) {
                key = key.split('/')[0];
            }

            this.cleaned_up_dict.push(key);
        }

        // Build the Dictionary of all Lowercase
        this.cleaned_up_dict.forEach(key => {
            this.all_lowercase_dict.push(key.toLowerCase()); 
        });

        // Build the Output Dictionary
        for (let word of this.cleaned_up_dict) {
            status.innerText = word;

            // Only for words that contain an Umlaut
            var relevant = false;

            for (let umlaut of this.umlauts) {
                if (word.includes(umlaut)) {
                    relevant = true;
                    break;
                }
            }

            if (relevant == false) {
                continue;
            }

            // Main Replacement
            // "bte => Äbte
            var word_out = word;
            for (let umlaut in this.umlaut_replacement_primary) {
                var replacement = this.umlaut_replacement_primary[umlaut];
                word_out = word_out.replace(umlaut,replacement);
            }

            this.output_dict[word_out] = word;

            // Lowercase to Upper Case Umlaut Replacement
            // (Meaning: if the word does not have a lowercase version, "invent" one)
            // Example: The Word "Äbte" is the plural of "Abt". There is no lowercase 
            // Version like "äbte". So we create it! 'bte > Äbte 
            relevant = false;
            for (let umlaut of this.umlauts_uppercase_only) {
                if (word.includes(umlaut)) {
                    relevant = true;
                    break;
                }
            }
            
            if (relevant == true) {
                var lowercase_word_out = word.toLowerCase();
                if (! this.all_lowercase_dict.includes(lowercase_word_out)) {
                    for (let umlaut in this.umlaut_replacement_primary) {
                        var replacement = this.umlaut_replacement_primary[umlaut];
                        lowercase_word_out = lowercase_word_out.replace(umlaut,replacement);
                    }

                    this.output_dict[lowercase_word_out] = word;                 
                }
            }

            // ß Special Handling: allow ss versions too!
            // But only if this is not another "real" Word!
            // Example: Fussball => Fußball
            if (word.includes('ß')) {
                word_out = word;
                word_out = word_out.replace('ß','ss');
                if (! this.cleaned_up_dict.includes(word_out)) {
                    for (let umlaut in this.umlaut_replacement_primary) {
                        var replacement = this.umlaut_replacement_primary[umlaut];
                        word_out = word_out.replace(umlaut,replacement);
                    } 

                    this.output_dict[word_out] = word;                       
                }

                // And again, but in lowercase! Example: fussball => Fußball
                var first_letter = word.substring(0,1);
                var uppercase_first_letter = first_letter.toUpperCase();
                if (first_letter == uppercase_first_letter) {
                    word_out = word;
                    word_out = word_out.toLowerCase();
                    word_out = word_out.replace('ß','ss');
                    if (! this.all_lowercase_dict.includes(word_out)) {
                        for (let umlaut in this.umlaut_replacement_primary) {
                            var replacement = this.umlaut_replacement_primary[umlaut];
                            word_out = word_out.replace(umlaut,replacement);
                        } 

                        this.output_dict[word_out] = word;                       
                    } 
                }               
            }
        }

        // Download JSON
        var blob = new Blob([JSON.stringify(this.output_dict)], {type : 'application/json'});
        var elem = document.createElement('a');
        elem.href = URL.createObjectURL(blob);
        var url = elem.href;
        elem.download = 'umlaut_dict.json';        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
        window.URL.revokeObjectURL(url); 
    }
}