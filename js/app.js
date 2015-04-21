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
		this.addURL = /#add/;
		this.doAddURL = /#doadd/;
		this.serversURL = /#servers/;
		this.exitURL = /#exit/;
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
    	log('hash: ' + hash);

    	if (!hash){
    		if (window.location.hash){
				hash = window.location.hash;
    		} else {
    			hash = '';
    		}
    		log('hash set to ' + hash);
    	}

    	if (hash.match(/#clearcache/)){
    		log('flushcache');
    		$.jStorage.flush();
    		goToScreen();
    	} else

	    if (hash.match(app.exitURL)){
	    	log('exit');
	    	if(navigator.app){
        		navigator.app.exitApp();
			} else if(navigator.device){
        		navigator.device.exitApp();
			}
		} else 

		if (hash.match(app.doAddURL)){
			log('doAddServer');
			return new AddServerView({
				'ip': document.getElementById('ip').value,
				'user': document.getElementById('user').value,
				'password': document.getElementById('password').value,
			});
	    } else 

	    if (hash.match(app.addURL)) {
	    	log('addserver');
	    	var as = new AddServerView();
	    } 
	    else
	    {
	    	log('test');
		    if (!app.model.getServers()){
		    	// If we don't have any servers yet
		    	log('addserverview');
		    	var as = new AddServerView();
		    } else {
		    	if (!app.model.getDefaultServer()){
		    		// If we don't have a default server
		    		log('serversoverview');
					var sv = new ServersOverview();
		    	} else {
		    		// If we do have a default server, go there
		    		log('overview of default server');
		    		var so = new Overview(app.model.getDefaultServer());
		    	}
		    }
		}
    }

};
