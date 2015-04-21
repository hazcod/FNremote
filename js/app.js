var app = {
    initialize: function() {
	// Application Constructor
		this.model = new Model();

		this.setupURLS();

		this.setupAJAX();

		//-- for internal testing
		Handlebars.registerHelper('json', function(context) {
    		return JSON.stringify(context);
		});

		this.bindEvents();
		this.route(); //!!! temporary for testing
    },

    setupURLS: function() {
	// Setup RegEx URLs of our routes
		this.loginURL = /#login/;
		this.dologinURL = /#servers/;
    },

    bindEvents: function() {
    // Bind all our events
    	document.addEventListener('deviceready', this.onDeviceReady, false); //cordova
    	this.onDeviceReady(); //temp for testing when there is no cordova
    },

    setupAJAX: function() {
    // Setup secure AjaX calls
        log('Setting up secure AjaX calls');
        $.ajaxSetup({
		  'beforeSend': function(xhr) {
		    if (localStorage.getItem('userToken')) {
		      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
		      if (app.userProfile){
			      xhr.setRequestHeader('ID', app.userProfile.user_id);
			  }
		    }
		  }
		});
    },

    onDeviceReady: function() {
    // When everything is loaded, do this
    	//Setup routing
    	log('Setting up routes');
        $(window).on('hashchange', $.proxy(this.route, this));
    },

    logout: function() {
    	this.loggedin = false;
    	$.jStorage.flush(); //cache
		this.userProfile = null;
		history.pushState("", document.title, window.location.pathname); //Reset hash to prevent logging us out when logging in!
		redirect('login');
    },

    getID: function(url) {
    	var idmatch = /\?id=(\d+)/;
    	var matches = url.match(idmatch);
    	if (matches){
    		return matches[1];
    	} else {
    		return false;
    	}
    },

    getPar: function(url, par) {
    	var match = new RegExp("(?:\\?|&)" + par + "=" + "(\\d+)");
    	log(match);
    	var result = url.match(match);
    	if (result){
    		return result[1];
    	} else {
    		return false;
    	}
    },


    route: function(eventt, input) {
    // route is called when a link is clicked
    	var hash = input;
    	log(hash);

    	if (!hash){
    		if (window.location.hash){
    			hash = window.location.hash;
    		} else {
    			hash = "";
    		}
    	}

    	if (hash.match(/#clearcache/)){
    		$.jStorage.flush();
    		redirect('overview');
    	} else

	    if (hash.match(app.exitURL)){
	    	if(navigator.app){
        		navigator.app.exitApp();
			} else if(navigator.device){
        		navigator.device.exitApp();
			}
	    } else

	    if (!app.loggedin){
	    	log('user not logged in');
	    	//check routes
    	} else {
    		log('user logged in');
    		//check routes
		}
    }

};
