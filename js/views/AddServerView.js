var AddServerView = function (data) {
    //View for the login screen and login functionality

    this.initialize = function () {
        // View constructor
        if (data){
            // check the input
            if (!('ip' in data) || !data['ip'] || !checkIsIPV4(data['ip'])){
                error = 'The IP address given is invalid.';
                $('#ip').addClass('has-error');
            }
            if (!('user' in data) || !data['user'] || !data['user'].length > 2){
                error = error + 'The username given is invalid.';
                $('#user').addClass('has-error');
            }
            if (!('password' in data) || !data['password'] || !data['password'].length > 4){
                error = error + 'The password given is invalid';
                $('#password').addClass('has-error');
            }

            if (error){
                log('faulty parameters');
                render('addserver', data);
            } else {
                // parameters should work
                log('testing login details');
                if (ping(data['ip'])){
                    log('pinged successfully');
                } else {
                    log('Could not reach FN server; ' + data['ip']);
                    error = 'Could not reach FreeNAS server ' + data['ip'];
                    render('addserver', data);
                }
            }

        } else {
            log('loginview, no data');
            info = 'You haven\'t added any servers yet.';
            render('addserver', {
                'user' : 'root', //for the moment, FN only supports 'root' as rest user
            });
        }

        $(document).on('click', "#addsbutton", function(e) {
            redirect("#doadd");
        });
    }

    this.initialize();
}
