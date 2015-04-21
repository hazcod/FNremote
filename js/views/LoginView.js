var LoginView = function (data) {
    //View for the login screen and login functionality

    this.initialize = function () {
        // View constructor
        if (data){
            console.log('loginview data passed along');
            if (this.checkLogin(data[0], data[1]) == true){
                app.loggedin = true;
                redirect('#overview');
            } else {
                //Re-render and show login page with login filled in
                //TODO: SHow username pre-filled in
                redirect('#login');
            }
        } else {
            log('loginview, no data');

            //Is this our first run?
            var first = app.model.getLocal('first');
            var loggedin = (app.model.getLocal('userToken') && app.getLocal('userID'));

            if (first || !loggedin){
                setInfoMessage("We need internet access the first time to fetch some goodness.");
                //Setup authentication/login form
                $(document).on('click', "#loginbtn", function(e) {
                    e.preventDefault();
                    app.lock.show({ icon: 'css/images/logo.svg' }, function(err, profile, token) {
                        if (err) {
                            // Error callback
                            log('Login failed.. ' + err);
                        } else {
                            // Success callback
                            log('Logged in successfully!');
                            // Save the JWT token.
                            localStorage.setItem('userToken', token);
                            localStorage.setItem('userID', profile.user_id);
                            log('userID set = ' + localStorage.getItem('userID'));
                            // We are logged in from now on
                            app.loggedin = true;
                            // Save the profile
                            app.userProfile = profile;
                            setInfoMessage('Welcome back ' + profile.given_name + "!");

                            redirect('#overview');

                            log('Prefetching questions for later use..');
                            app.model.getMoreQuestions();
                        }
                    });
                });
                render('login', {}).done(function(){
                });
            } else if (loggedin && !first){
                redirect('overview');
            }
        }
    }

    this.initialize();
}
