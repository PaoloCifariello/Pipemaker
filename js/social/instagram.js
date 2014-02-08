
var instagramapi = function() {
    
    var loginUrl = DP.utilvar.social.INSTAGRAM_AUTH_URL;
    var client_id = DP.utilvar.social.INSTAGRAM_CLIENT_ID;
    
    var baseUrl = DP.utilvar.social.INSTAGRAM_REST_API_URL;
    var apiKey;
    
    var popup = {};
    
    var Callbacks = new Array();
    
    /*
     * param contiene i parametri:
     * {
     *   type: tipo di query(user),
     *   query: parole da ricercare,
     * }
     * 
     *  callback è la funziona da richiamare sui dati
     */
    function search(param, callback) {
        
        var query;
        
        if (typeof (param) !== 'object' || !param.type || !param.query || typeof (callback) !== 'string'){
            
            return;
        }
        
        /* Se si sta cercando una persona */
        if (param.type == 'user')
            query = baseUrl + 'users/search?q=' + param.query;
        
        /* Nessuna tipologia di ricerca riconosciuta */
        else
            return;
        
        query = query.concat('&access_token=' + apiKey + '&callback=' + callback);
        query = encodeURI(query);
        
        if (DP.utilvar.SHOW_EVENTS)
            console.log('EVENT: Instagram query ->' + query);
        
        // uso di JSONP
        var req = document.createElement('script');
        req.src = query;
        document.body.appendChild(req);
    }
    
    /* recupero informazioni dettagliate 
     * 
     * param.id -> id della risorsa (id utente o tag)
     * param.type -> media o user
     * callback -> funzione di callback
     * 
     */
    function get(param, callback) {
        
        if (typeof (param) !== 'object' || typeof (callback) !== 'string' || typeof (param.id) !== 'string' || typeof (param.type) !== 'string')
            return;
        
        /* Se si sta cercando una persona */
        if (param.type == 'user')
            query = baseUrl + 'users/' + param.id;
        
        /* Se si sta cercando un'attività */
        else if (param.type == 'media')
            query = baseUrl + 'tags/' + param.id + '/media/recent';
        
        /* Nessuna tipologia di ricerca riconosciuta */
        else
            return;
        
        query = query.concat('?access_token=' + apiKey + '&callback=' + callback);
        query = encodeURI(query );
        
        // uso di JSONP
        var req = document.createElement('script');
        req.src = query;
        document.body.appendChild(req);
    }
    
    function searchAndGet(node, callback){
        var data = new Array(),
            reqType = node.info.queryType,
            url;
        
        if (reqType === 'Users')
            url = DP.utilvar.social.INSTAGRAM_REST_API_URL + 
                '/users/search?q=' + node.info.query + 
                '&access_token=' + instagramapi.getToken();
        else if (reqType === 'Media')
            url = DP.utilvar.social.INSTAGRAM_REST_API_URL +
                '/tags/' + node.info.query +
                '/media/recent?access_token=' + instagramapi.getToken();
        else {
            node.result = [];
            callback();
            return;
        }
        
        var script = document.createElement('script');
        
        var newCallback = function(res){
            
            if (DP.cancel)
                return;
            
            if (res.data){
                res.data.each(function(el){
                    if (reqType === 'Users')
                        data.push(new User('instagram', el));
                    else
                        data.push(new Media('instagram', el));
                });
            }
            
            node.result = data;
            callback();
        }
        
        var index = instagramapi.Callbacks.push(newCallback);
        script.src = url + '&callback=instagramapi.Callbacks[' + (index - 1) + ']';
        document.body.appendChild(script);
    }
    
    function getMedia(userList, node, callback) {
        
        if (userList.length === 0){
            callback();
            return;
        }
        
        var result = new Array(),
            url;
        
        var newCallback = function(res) {
            
            if (DP.cancel)
                return;
            
            result.push(res);
            
            if (result.length < userList.length)
                return;
            
            for (var j = 0; j < result.length; j++)
                if (result[j].data) {
                    for (var k = 0; k < result[j].data.length; k++)
                        node.result.push(new Media('instagram', result[j].data[k]));
                }
            
            callback();
        }
        
        var index = instagramapi.Callbacks.push(newCallback);
        
        for (var i = 0; i < userList.length; i++) {
            url = DP.utilvar.social.INSTAGRAM_REST_API_URL +
                '/users/' + userList[i].id + '/media/recent/?access_token=' +
                instagramapi.getToken();
            
            var script = document.createElement('script');
            
            script.src = url + '&callback=instagramapi.Callbacks[' + (index - 1) + ']';
            document.body.appendChild(script);
        }
    }
    
    function tryLogin() {
        
        var redirect_uri = 'http://pipemaker.altervista.org/dotPipe/socialLogin/loginDone.html';
        var response_type = 'token';
        
        var url = loginUrl + '?' + 'client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=' + response_type;
        var popupName = 'instagramLogin';
        var popupParam = 'toolbar=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=600';
        
        popup = window.open(url, popupName, popupParam);
    }
    
    function getToken() {
        return apiKey;
    }
    
    /*
     * Setta il token di accesso a Instagram
     */
    function setToken(token) {
        apiKey = token;
        popup.close();
        
        var instaBtn = document.getElementById('instagramLoginButton');
        instaBtn.style.display = 'none';
        
        if (DP.util.activateModule('instagram'))
            DP.util.addCheckmark(instaBtn.parentNode);
        
    }
    
    return {
        search: search,
        get: get,
        searchAndGet: searchAndGet,
        getMedia: getMedia,
        tryLogin: tryLogin,
        getToken: getToken,
        setToken: setToken,
        Callbacks: Callbacks
    };
}();