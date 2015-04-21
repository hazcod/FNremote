var error = "";
var info  = "";

function log( msg ){
    dolog = true;
    if (dolog){
        console.log(msg);
    }
}

function render(template, args) {
    var deferration = $.Deferred();
    var source;
    var template;
    var path = 'js/templates/' +  template + '.html';

    if (! args){
        args = {};
    }
    
    args["msgerror"] = error;
    args["msginfo"]  = info;

    if (!app.userProfile){
        renderPartial('guestmenu', {});
    } else {
        renderPartial('menu', {});
    }

    renderPartial('messages', args);

    $.ajax({
        url: path,
        cache: true,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            $('#maincontainer').html(template(args)).trigger('create');
        },
        complete: function (){
            deferration.resolve();
        },
    });
    
    loading("hide");
    error = "";
    info = "";
    log('render done.');
    return deferration;
}

function renderPartial(name, args){
    var path = 'js/templates/partials/' +  name + '.html';
    $.ajax({
        async: false,
        url: path,
        cache: true,
        success: function (data) {
            source = data;
            Handlebars.registerPartial(name, source);
            log('Partial ' + name + ' rendered');
        }
    });
}

function redirect(location){
    loading("show");
    try {
        history.pushState("", document.title, window.location.pathname);
    } catch (err) {
        log('pushHistory failed: ' + err);
    }    
    if (location.charAt(0) != '#'){
        location = '#' + location;
    }
    log('Redirecting to ' + location);
	app.route(null, location);
}

function loading(showOrHide) {
    setTimeout(function(){
        $.mobile.loading(showOrHide);
    }, 1); 
}

function setErrorMessage(msg){
    error = msg;
}
function setInfoMessage(msg){
    info = msg;
}

function goToScreen() {
    log('-------- goToScreen');
    if (window.location.hash){
        window.history.back();//edirect(window.location.hash.substring(1));
    } else {
        redirect(app.serversURL);
    }
}

//---Network
function basename(path) {
    return path.split(/[\\/]/).pop();
}
function checkIsIPV4(entry) {
  var blocks = entry.split(".");
  if(blocks.length === 4) {
    return blocks.every(function(block) {
      return parseInt(block,10) >=0 && parseInt(block,10) <= 255;
    });
  }
  return false;
}
function ping(host) {
    return (app.model.getDataOnline('https://' + host + '/static/images/ui/freenas-logo.png') != false);
}