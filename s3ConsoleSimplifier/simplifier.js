var Simplifier = {
	_loadingOptions: false,
	_options: {},
	_sim: function(options) {
		if (options['ck-hide-header'] == true) {
			// Hide the general AWS Header
			this.hide(this.byId('awsgnav'));

			// This yields 145px more space. Use them
	  		var tabs = this.query('awsui-tabs');
	  		for (var i = 0; i < tabs.length; ++i) {
	  			tabs[i].style.height = '100vh';
	  		}				
		}

		if (options['ck-add-logout'] == true) {
			// Add a Logout button
			
			if (this.query('button.s3-simplifier-logout-button').length < 1) {
				var button = document.createElement('button');
				button.className = 'awsui-button awsui-button-size-normal awsui-button-variant-normal s3-simplifier-logout-button';
				button.textContent = 'Logout';

				var headers = this.query('div.header-section.watermark-wrapper');
				var tips    = this.query('div.useful-links');

				if (tips.length > 0) {
					tips[0].appendChild(button);
				}

				if (headers.length > 0) {
					button.style.position = 'absolute';
					button.style.right = '20px';
					button.style.top   = '20px';					
					headers[0].appendChild(button);
				}

				// Add EventListeners
				var logoutButtons = this.query('button.s3-simplifier-logout-button');
				for (var i = 0; i < logoutButtons.length; ++i) {
					logoutButtons[i].addEventListener('click', Simplifier.onLogout);
				}
			}
		}

		if (options['ck-hide-footer'] == true) {
			// Hide the general AWS Footer
			this.hide(this.byId('console-nav-footer'));
		}

		if (options['ck-hide-tagnot'] == true) {
			// Hide the Notification Panel about Object Tagging
			var taggingElements = this.query('awsui-alert.notification.dark.ng-scope[ng-if="notificationShow"]');
			this.hideAll(taggingElements);
		}

		if (options['ck-hide-oldlink'] == true) {
			// Hide the Link to the old Console
			var oldConsoleLinks = this.query('div.hint-button[fac-id="s3-old-console"]');
			this.hideAll(oldConsoleLinks);
		}

		var tabs = this.query('ul.awsui-tabs-container');
		if (options['ck-hide-tabper'] == true) {
			// Hide the Permissions Tab for a Bucket
  			this.hideBasedOnText(tabs, 'Permissions');
  		}

  		if (options['ck-hide-tabpercont'] == true) {
	  		// Hide the Permissions Tab Contents for a Bucket
	  		var bucketPermissions = this.query('bucketpermissions');
	  		this.hideAll(bucketPermissions);  
	  	}

	  	if (options['ck-hide-tabper'] == true && options['ck-hide-tabpercont'] == true) {
	  		// The Tab and its contents are hidden
	  		// Then there is no point in linking there...
	  		var links = this.query('div.subtitle[translate="bucketproperties.permissions"]');
	  		this.removeBucketLinks(links);

	  		// And if somebody got here by Accident? We route them to the Object List
	  		this.checkForGetParameterAndRerouteURL('tab', 'permissions');
	  	}

	  	if (options['ck-hide-tabpro'] == true) {
	  		// Hide the Properties Tab for a Bucket
  			this.hideBasedOnText(tabs, 'Properties');	  		
	  	}

	  	if (options['ck-hide-tabprocont'] == true) {
	  		// Hide the Properties Tab Contents for a Bucket
	  		var bucketProperties = this.query('div[ng-switch-when="properties"]');
	  		this.hideAll(bucketProperties);  
	  	} else {
		  	if (options['ck-hide-tabprocontadv'] == true) {
		  		// Hide the "Advanced" Options in the Properties Tab
		  		var headers = this.query('h1[translate="bucketproperties.title.advancedsettings"]');
		  		this.hideAll(headers);
		  		this.hide(this.byId('bucket-tagging-card'));
		  		this.hide(this.byId('bucket-crr-card'));
		  		this.hide(this.byId('bucket-accelerate-card'));
		  		this.hide(this.byId('bucket-events-card'));
		  		this.hide(this.byId('bucket-requesterpays-card'));
		  	}
	  	}

	  	if (options['ck-hide-tabpro'] == true && options['ck-hide-tabprocont'] == true) {
  			// The Tab and its contents are hidden
	  		// Then there is no point in linking there...
	  		var links = this.query('div.subtitle[translate="bucketproperties.properties"]');
	  		this.removeBucketLinks(links);

	  		// And if somebody got here by Accident? We route them to the Object List
	  		this.checkForGetParameterAndRerouteURL('tab', 'properties');	  		
	  	}


	  	if (options['ck-hide-tabmgm'] == true) {
	  		// Hide the Management Tab for a Bucket
  			this.hideBasedOnText(tabs, 'Management');	  		
	  	}	 

	  	if (options['ck-hide-tabmgmcont'] == true) {
	  		// Hide the Content of the Management Tab
	  		var bucketManagement = this.query('div[ng-switch-when="management"]');
	  		this.hideAll(bucketManagement);
	  	} else {
	  		if (options['ck-hide-tabmgmlfc'] == true) {
	  			// Hide the Lifecycle Button
	  			this.hide(this.byId('lifecycle-tab'));
	  		}

	  		if (options['ck-hide-tabmgmana'] == true) {
	  			// Hide the Analytics Button
	  			this.hide(this.byId('analytics-tab'));
	  		}

	  		if (options['ck-hide-tabmgmmet'] == true) {
	  			// Hide the Metrics Button
	  			this.hide(this.byId('cloudwatch-tab'));
	  		}

	  		if (options['ck-hide-tabmgminv'] == true) {
	  			// Hide the Inventory Button
	  			this.hide(this.byId('inventory-tab'));
	  		}

	  		if (options['ck-hide-mgmlfcact'] == true) {
		  		// Hide Lifecylce Actions
		  		var moreStorageButtons = this.query('bucket-lifecycle div.action-strip');
		  		this.hideAll(moreStorageButtons);
	  		}
	  	}

	  	if (options['ck-hide-tabmgm'] == true && options['ck-hide-tabmgmcont'] == true) {
  			// The Tab and its contents are hidden
	  		// Then there is no point in linking there...
	  		var links = this.query('div.subtitle[translate="bucketproperties.management"]');
	  		this.removeBucketLinks(links);

	  		// And if somebody got here by Accident? We route them to the Object List
	  		this.checkForGetParameterAndRerouteURL('tab', 'management');	  		
	  	}

	  	if (options['ck-hide-tabper'] == true      &&  // 1. Permissions tab
	  		options['ck-hide-tabpercont'] == true  &&  //    and its contents
	  		options['ck-hide-tabpro'] == true      &&  // 2. Properties tab
	  		options['ck-hide-tabprocont'] == true  &&  //    and its contents
	  		options['ck-hide-tabmgm'] == true      &&  // 3. Management tab
	  		options['ck-hide-tabmgmcont '] == true     //    and its contents
	  		) {
	  		// All three tabs hidden: Then we can hide the complete Tab Bar
	  		var bar = this.query('ul.awsui-tabs-container');
	  		this.hideAll(bar);
	  	}

	  	if (options['ck-hide-buckdel'] == true) {
	  		// Hide the "Delete Bucket" Button
	  		var deleteBucketButtons = this.query('awsui-button[text="Delete bucket"]');
	  		this.hideAll(deleteBucketButtons);
	  	}

	  	if (options['ck-hide-buckemp'] == true) {
	  		// Hide the "Empty Bucket" Button
	  		var emptyBucketButtons = this.query('awsui-button[text="Empty Bucket"]');
	  		this.hideAll(emptyBucketButtons);
  		}

  		if (options['ck-hide-buckcre'] == true) {
	  		// Hide the "Create Bucket" Button
	  		var createBucketButtons = this.query('awsui-button[text="Create Bucket"]');
	  		this.hideAll(createBucketButtons);
  		}





  		var opt = this.query('ul.awsui-button-dropdown-content');
  		if (options['ck-hide-objmkpub'] == true) {
  			// Hide the "Make Public" Option for files
  			this.hideBasedOnText(opt, 'Make public');
  		}

  		if (options['ck-hide-objaddtag'] == true) {
  			// Hide the "Add Tags" Option for files
  			this.hideBasedOnText(opt, 'Add tags');
  		}


  		if (options['in-hide-textcontent'] != '') {
  			// Remove things based on user input
  			var longString = String(options['in-hide-textcontent']) + ';';
  			var searchArray = longString.split(';').filter(String);
  			searchArray = searchArray.map(v => v.toLowerCase());

  			var allElements = this.query('body *');
  			for (var i = 0; i < allElements.length; ++i) {
  				var element = allElements[i];
				if (searchArray.includes(element.innerText.trim().toLowerCase())) {
					this.hide(element);
				}
  			}
  		}
	},
	byId: function(id) {
		return document.getElementById(id);
	},
	hide: function(elem) {
		try {
			elem.style.display = 'none';
		} catch(e) {
		}
	},
	query: function(selector) {
		return document.querySelectorAll(selector);
	},
	hideAll: function(list) {
		for (var i = 0; i < list.length; ++i) {
  			this.hide(list[i]);
		}
	},
	hideBasedOnText: function(list, text) {
		for (var i = 0; i < list.length; ++i) {
			var element = list[i];
			if (element.innerText.trim().toLowerCase() == text.toLowerCase()) {
				// Hide the element itself
				this.hide(element);
			} else {
				// Hide a sub-element?
				for (var j = 0; j < element.childNodes.length; ++j) {
					if (element.childNodes[j].innerText.trim().toLowerCase() == text.toLowerCase()) {
						this.hide(element.childNodes[j]);
					}
				}
			}
		}
	},
	removeBucketLinks: function(links) {
  		for (var i = 0; i < links.length; ++i) {
  			var parent = links[i];
  			j = 0;
  			while(true) {
  				j++;
  				parent = parent.parentElement;
  				if (j == 6) {
  					break;
  				}
  				if (parent.nodeName.toLowerCase() == 'ul') {
  					// Replace the element with a clone
  					// Clones don't have Event Listeners :-)
					var elClone = parent.cloneNode(true);
					elClone.style.cursor = 'auto';
					parent.parentNode.replaceChild(elClone, parent);	  					
  					break;
  				}
  			}
  		}
	},
	simplify: function() {
		//console.log('simplification triggered');
		// Get User-Options, call the actual Hiding routine
		if (Object.getOwnPropertyNames(this._options).length == 0) {
			if (this._loadingOptions == false) {
				// Only call sync get once
				this._loadingOptions = true;
			    chrome.storage.sync.get(function(syncOpt) {
			    	Simplifier._options = syncOpt;
			    	Simplifier._sim(syncOpt);
			    });
			}
		} else {
			this._sim(this._options);
		}
	},
	checkForGetParameterAndRerouteURL: function(parameter, value) {
  		var url = new URL(window.location.href);
  		var tab = url.searchParams.get(parameter);

  		if (tab && tab.toLowerCase() == value) {
  			var newUrl = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
  			window.location.href = newUrl;
  		}
	},
	onLogout: function() {
		document.getElementById('aws-console-logout').click(); 
	},
}

// window.addEventListener ("load", myMain, false);
// function myMain (evt) {
//     Simplifier.simplify();
// }

// Observer Configuration
var observerTarget = document.querySelector('body');
var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true }

// Create an observer instance
var observer = new MutationObserver(function(mutations) {
	//console.log('dom change detected');
	observer.disconnect();
	Simplifier.simplify();
	observer.observe(observerTarget, observerConfig);
});
 
// Start Observing right away
observer.observe(observerTarget, observerConfig);