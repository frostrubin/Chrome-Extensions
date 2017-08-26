var InfluenceNavigationForS3 = {
    tabIds: {},
    
    register: function () {
        chrome.webNavigation.onBeforeNavigate.addListener( details => {
            new s3Downloader(details.url, details.tabId).download();
        }, {url: [{hostSuffix: 'amazonaws.com'}]});
    },
}


InfluenceNavigationForS3.prototype = {
    resetDataStorage: function() {
        this.tabIds = {};
        this.saveDataStorage_();
        // Load again, in case there is an outstanding storage.get request. This
        // one will reload the newly-cleared data.
        this.loadDataStorage_();
    },  
    saveDataStorage_: function() {
        chrome.storage.local.set({
            "tabIds": this.tabIds,
        });
    },      
    loadDataStorage_: function() {
        chrome.storage.local.get({
            "tabIds": {}
        }, function(storage) {
            this.tabIds = storage.tabIds;
        }.bind(this));
    }, 
}

class s3Downloader {
    constructor(url, tabId) {
        this.url = url;
        this.consoleUrl = 'https://console.aws.amazon.com/s3';
        this.tabId = tabId;
    }
    download() {
        // Only run for S3 URLs
        if (this.url.substring(0,11) != 'https://s3-') {
            return;
        } 

        // Get Tab
        chrome.tabs.get(this.tabId, tab => {
            // Is it maybe the console itself?
            if (this.consoleUrl == tab.url.substring(0,this.consoleUrl.length)) {
                return;
            }
            
            // Was its father the console?
            if (!tab['openerTabId']) { // Is this a potential pitfall? 
                return;                // We close tabs! openerTabId might be initial if we are too fast?
            }
            this.tabId = tab.id;
            chrome.tabs.get(tab.openerTabId, openerTab => {
                if (this.consoleUrl != openerTab.url.substring(0, this.consoleUrl.length) &&
                    InfluenceNavigationForS3.tabIds[openerTab.id] != true) {
                    return;
                }
                // Its a new tab, father was the console or another download tab
                // Log the tab id
                InfluenceNavigationForS3.tabIds[this.tabId] = true;
                           
                // Lets close it!
                chrome.tabs.remove(this.tabId);

                // And trigger Download instead
                chrome.downloads.download({
                   url: this.url
                }); 
                InfluenceNavigationForS3.saveDataStorage_();                 
            });                    
        });        
    }
}

InfluenceNavigationForS3.register();

// Reset the collection of tab ids
chrome.runtime.onStartup.addListener(function() {
    InfluenceNavigationForS3.resetDataStorage();
});