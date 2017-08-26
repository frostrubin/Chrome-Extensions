var Simplifier = {
    _loadingOptions: false,
    _options: {},
    _sim: function(options) {
        if (options['ec2-ck-hide-header'] == true) {
            // Hide the general AWS Header
            this.hide(this.byId('awsgnav'));

			var main = this.query('.NHG.KHG');
			if (main.length > 0) {
				main[0].style.marginTop = '1.2rem';
			}			
        }

        if (options['ec2-ck-add-logout'] == true) {
            // Add a Logout button
           
            if (this.query('button.ec2-simplifier-logout-button').length < 1) {
                var button = document.createElement('button');
                button.className = 'awsui-button awsui-button-size-normal awsui-button-variant-normal ec2-simplifier-logout-button';
                button.style.marginBottom = '1.5rem';
                button.textContent = 'Logout';
                
                var leftpanel = this.query('.MMG');
                var dashLink = this.byId('gwt-debug-leftNav-Home');
                if (leftpanel.length > 0 && dashLink) {
                    leftpanel[0].insertBefore(button, dashLink);
                }

                // Add EventListeners
                var logoutButtons = this.query('button.ec2-simplifier-logout-button');
                for (var i = 0; i < logoutButtons.length; ++i) {
                    logoutButtons[i].addEventListener('click', Simplifier.onLogout);
                }
            }
        }

        if (options['ec2-ck-hide-footer'] == true) {
            // Hide the general AWS Footer
            this.hide(this.byId('console-nav-footer'));
        }

        var childDiv = -1;
        try {
            if (options['ec2-ck-hide-left-menu-smsr'] == true) {
                // Get the Div containing the menu options
                childDiv = this.byId('gwt-debug-leftNav-ManagedInstances').parentElement;
                // Hide it
                this.hide(childDiv);
                // Hide the menu itself
                this.hide(childDiv.previousSibling)
            }
        } catch (e) {}

        try {
            if (options['ec2-ck-hide-left-menu-sms'] == true) {
                // Get the Div containing the menu options
                childDiv = this.byId('gwt-debug-leftNav-Automations').parentElement;
                // Hide it
                this.hide(childDiv);
                // Hide the menu itself
                this.hide(childDiv.previousSibling)
            }
        } catch (e) {}

        try {
            if (options['ec2-ck-hide-left-menu-autoscale'] == true) {
                // Get the Div containing the menu options
                childDiv = this.byId('gwt-debug-leftNav-LaunchConfigurations').parentElement;
                // Hide it
                this.hide(childDiv);
                // Hide the menu itself
                this.hide(childDiv.previousSibling)
            }
        } catch (e) {}

        try {
            if (options['ec2-ck-hide-left-menu-loadbalancing'] == true) {
                // Get the Div containing the menu options
                childDiv = this.byId('gwt-debug-leftNav-LoadBalancers').parentElement;
                // Hide it
                this.hide(childDiv);
                // Hide the menu itself
                this.hide(childDiv.previousSibling)
            }
        } catch (e) {}

        try {
            if (options['ec2-ck-hide-left-menu-networkandsec'] == true) {
                // Get the Div containing the menu options
                childDiv = this.byId('gwt-debug-leftNav-SecurityGroups').parentElement;
                // Hide it
                this.hide(childDiv);
                // Hide the menu itself
                this.hide(childDiv.previousSibling)
            }
        } catch (e) {}

        try {
            if (options['ec2-ck-hide-left-menu-elasticblock'] == true) {
                // Get the Div containing the menu options
                childDiv = this.byId('gwt-debug-leftNav-Volumes').parentElement;
                // Hide it
                this.hide(childDiv);
                // Hide the menu itself
                this.hide(childDiv.previousSibling)
            }
        } catch (e) {}

        try {
            if (options['ec2-ck-hide-left-menu-images'] == true) {
                // Get the Div containing the menu options
                childDiv = this.byId('gwt-debug-leftNav-Images').parentElement;
                // Hide it
                this.hide(childDiv);
                // Hide the menu itself
                this.hide(childDiv.previousSibling)
            }
        } catch (e) {}

        try {
            if (options['ec2-ck-hide-left-menu-instances'] == true) {
                // Get the Div containing the menu options
                childDiv = this.byId('gwt-debug-leftNav-Instances').parentElement;
                // Hide it
                this.hide(childDiv);
                // Hide the menu itself
                this.hide(childDiv.previousSibling)
            } else {
                if (options['ec2-ck-hide-left-submenu-dedichost'] == true) {
                    this.hide(this.byId('gwt-debug-leftNav-Hosts'));
                }
                if (options['ec2-ck-hide-left-submenu-schedins'] == true) {
                    var submenues = this.query('.gwt-Anchor.KN');
                    this.hideBasedOnText(submenues, 'Scheduled Instances');
                }
                if (options['ec2-ck-hide-left-submenu-reservedins'] == true) {
                    this.hide(this.byId('gwt-debug-leftNav-ReservedInstances'));
                }
            }
        } catch (e) {
        	console.log(e);
        }

		if (options['ec2-ck-hide-dash-right-addmarkt'] == true) {
			this.hideAll(this.query('#gwt-debug-additionalInfoView'));
		}

        if (options['ec2-ck-hide-dash-middle-createinst'] == true) {
        	this.hide(this.byId('gwt-debug-createInstanceView'));
        }

        if (options['ec2-ck-hide-left-menu-tags'] == true) {
			this.hide(this.byId('gwt-debug-leftNav-Tags'));
        }

        if (options['ec2-ck-hide-left-menu-reports'] == true) {
        	this.hide(this.byId('gwt-debug-leftNav-Reports'));
        }        

    },
    byId: function(id) {
        return document.getElementById(id);
    },
    hide: function(elem) {
        try {
            elem.style.display = 'none';
        } catch (e) {}
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
            try {
				if (element.innerText.trim().toLowerCase() == text.toLowerCase()) {
					// Hide the element itself
					this.hide(element);
				} else {
					// Hide a sub-element?
					for (var j = 0; j < element.childNodes.length; ++j) {
						try {
							if (element.childNodes[j].innerText.trim().toLowerCase() == text.toLowerCase()) {
								this.hide(element.childNodes[j]);
							}
						} catch(e) {}
					}
				}
            } catch(e) {}
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

// Observer Configuration
var observerTarget = document.querySelector('body');
var observerConfig = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
}

// Create an observer instance
var observer = new MutationObserver(function(mutations) {
    //console.log('dom change detected');
    observer.disconnect();
    Simplifier.simplify();
    observer.observe(observerTarget, observerConfig);
});

// Start Observing right away
observer.observe(observerTarget, observerConfig);