var Model = function () {

	this.getDataOnline = function(input, auth) {
	// Get data and transform
		result = false;
		$.ajax({
			async: false,
			crossDomain: true,
			url: input,

			beforeSend: function(req) {
				if (auth != false){
					req.setRequestHeader('Authorization', auth);
				}
			}
		})
			.done(function (data){
				if (!data) {
					log('getData error failed but completed, data = null: ' + url);
				} else {
					log(data);
					if (typeof data === "object" && data !== null) {
						log('object returned');
						result = data;
					} else {
						log('JSON returned');
						try {
							result = $.parseJSON(data);
						} catch (err) {
							log('getData Json parse error: ' + err);
							result = false;
						}
					}
				}
			})

			.error(function (request, status, error){
				log('getData error failed! input: ' + input + ", status: " + status + ", error: " + error);
			});
		return result;
	},

	this.getData = function (input, force){

		var server = basename(input);
		if (this.getLogin(server) != false){

		} else {
			log('Could not find login details for server: ' + server)
			return false;
		}

	    var ttl = parseInt(this.getLocal('TTL_' + input.trim()));
		log('TTL is ' + ttl + ' for ' + input);
		now = new Date();
		log('(TTL: ' + ttl + ' and now: ' + now.getTime() + ')');

        if ((!ttl) || (isNaN(ttl)) || ttl <= now.getTime() || (force)){
			log('TTL expired/not existant. Fetching online..');
			//if it doesnt exist cached or TTL is more than a day old
			var result = this.getDataOnline(input);

			if (result){
				log('Putting result in cache..');
				// Fill our local database
				this.putLocal(input.trim(), result);
				// Adjust/add the TTL, add one extra day
				this.putLocal('TTL_' + input.trim(), new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getTime());
				log('Put in cache:');
				log(this.getLocal(input.trim()));
				return result;
			} else {
				if (ttl){
					log('No network, but we have a cached version.');
					//Online doesnt work, but we have a local copy!
					return this.getLocal(input.trim());
				} else {
					log('No network and no cached version.. Returning false..');
					//Online doesnt work and we dont have a local copy..
					return false;
				}
			}
		} else {
			log('TTL valid, opening from cache..');
			var local = this.getLocal(input.trim());
			log(local);
			if (local){
				//Safe to use our cached copy
				return local;
			} else {
				//Local db is non existant. Try to fetch online by removing TTL and recursive call.
				log('Local db is empty. Removing TTL and recursively calling myself.');
				this.removeLocal('TTL_' + input.trim());
				return this.getData(input);
			}
		}
	},

	this.getLogin = function(server) {
		return this.getLocal('LOGIN_' + server);
	},

	this.setLogin = function(server, login, pass) {
		var lbase = window.btoa(login + ':' + pass);
		return this.putLocal('LOGIN_' + server, lbase);
	}

	this.getServers = function() {
		return this.getLocal('servers');
	},

	this.getUsers = function(server) {
		return this.getData(server + this.usersURL);
	},

	this.setupURLs = function () {
		this.baseURL = '/api/v1.0/';
		
		this.usersURL = this.baseURL + 'account/users/';
	},

	this.removeLocal = function (key) {
		return $.jStorage.deleteKey(key);
	},

	this.getLocal = function (key) {
		return $.jStorage.get(key, false);
	},

	this.putLocal = function (key, value) {
		return $.jStorage.set(key, value);
	},

	this.initialize = function () {
	// Model constructor
		//all online URLs
		this.setupURLs();
	},

	this.initialize();
};
