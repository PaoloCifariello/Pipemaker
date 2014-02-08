/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */

/*
 * Libreria per l'uso di Facebook
 */
var facebookapi = function(){
    
    var baseUrl = DP.utilvar.social.FACEBOOK_REST_API_URL;
    var apiKey;
    
    function setToken(token){
        
        if(typeof token === 'string')
            apiKey = token;
    }
    
    /*
     * param contiene i parametri:
     * {
     *   q: "Query da ricercare,
     *   type: "tipo di oggetti da ricercare (user o event),
     *   fields: "i campi voluti (id, name..),
     *   center: "latitudine e longitudine del luogo da ricercare"
     *   distance: "la distanza dal center specificato"
     *   place: "id di un luogo in cui ricercare"
     * }
     * 
     * callback è la funziona da richiamare sui dati
     */
    function search(param, callback){
        
        if (!param || typeof(param) !== 'object' || typeof(callback) !== 'function')
            return;
        
        var char = '?';
        var query = '/search';
        var parameters = '';
        
        for(var key in param){
            parameters = parameters.concat(char + key + '=' + param[key]);
            char = '&';
        }
        
        if(parameters === '')
            return;
        
        query = query.concat(parameters + '&access_token=' + apiKey);
        query = encodeURI(query);
        
        if (DP.utilvar.SHOW_EVENTS)
            console.log('Query SEARCH a Facebook: ' + query);
        FB.api(query, callback);
    }
    
    function get(id, callback){
        
        if (typeof(id) !== 'string')
            return;
        
        if (DP.utilvar.SHOW_EVENTS)
            console.log('Query GET a Facebook: ' + id);
        
        FB.api('/' + id,callback);   
    }
    
    function searchAndGet(node, callback) {
        
        var data = new Array();
        
        var param = {q: node.info.query};
        if (node.info.queryType === 'Users')
            param.type = 'user';
        else if (node.info.queryType === 'Events')
            param.type = 'event';
        else {
            node.result = [];
            callback();
            return;
        }
            
         
        
        // Effettuo la ricerca 
        search(param,function(result){
            if (DP.cancel)
                return;
            // se ottengo risultati effettuo la get per ogni risultato e aggiungo il risultato  result
            // infine chiamo callback
            if (result.data) {
                if (result.data.length === 0) {
                    node.result = [];
                    callback();
                    return;
                }
                    
                result.data.each(function(el){
                    get(el.id,function(el){
                        if (DP.cancel)
                            return;
                        
                        if (param.type === 'user'){
                            var newUser = new User('facebook',el);
                            data.push(newUser);
                            getPhoto(el.id, function(res){
                                newUser.image = res;
                            });
                        }
                        else
                            data.push(new Event('facebook',el));
                        if (data.length === result.data.length){
                            node.result = data;
                            callback();
                        }
                    });
                });
            }
            
            else {
                node.result = [];
                callback();
            }
        });
    }
    
    function getUsersFromEvent(userList, node, callback) {
        
        var totalLength = userList.length + node.result.length;
        
        for (var i = 0; i < userList.length; i++) {
            get(userList[i].id, function(el){
                
                if (DP.cancel)
                    return;
                
                var newUser = new User('facebook', el);
                node.result.push(newUser);
                getPhoto(el.id, function(res){
                    newUser.image = res;
                });
                if (node.result.length === totalLength)
                    callback();
            })
        }
    }
    
    function searchUsersFromEvent(array, node, callback) {
        
        var events = new Array();
        var others = new Array(); 
        
        for(var i = 0; i < array.length; i++) {
            if (array[i].type === 'event' && array[i].source === 'facebook') 
                events.push(array[i]);
            else 
                others.push(array[i]);
        }
        
        node.result = others;
        
        if (events.length === 0){
            callback();
            return;
        }
        
        var users = new Array();
        
        for (var i = 0; i < events.length; i++) {
            var newEvent = {};
            var index = users.push(newEvent) - 1;
            
            
            
            FB.api('/' + events[i].id + '/attending', (function() {
                
                var obj = users[index];
                
                return function(res) {
                    
                    if (DP.cancel)
                        return;
                    
                    obj.peoples = res.data;
                    
                    for (var j = 0; j < users.length; j++) {
                        if (users[j].peoples === undefined)
                            return;
                    }
                    
                    var usersToGet = new Array();
                    
                    for (var j = 0; j < users.length; j++)
                        usersToGet = usersToGet.concat(users[j].peoples);
                    
                    getUsersFromEvent(usersToGet, node, callback);
                }
            })());
            
        }
    }
    
    function getMedia(userList, node, callback) {
        
        
        if(userList.length === 0) {
            callback();
            return;
        }
        
        var result = new Array();
        
        var newCallback = function(res) {
            
            if(DP.cancel)
                return;
            
            result.push(res);
            
            if(result.length < userList.length) {
                return;
            }
            
            for (var i = 0; i < result.length; i++) {
                if (result[i].data) {
                    for (var j = 0; j < result[i].data.length; j++)
                        node.result.push(new Media('facebook', result[i].data[j]));
                }
            }
            
            callback();
        }
        
        for (var i = 0; i < userList.length; i++) 
            FB.api('/' + userList[i].id + '/photos', newCallback);
    }
    
    function getPhoto(id, callback) {
        FB.api('/' + id + '/picture?type=large', function(res){
            if (DP.cancel)
                return;
            
            if (res.data)
                callback(res.data.url);
        })
    }
    
    return {
        search : search,
        get : get,
        searchAndGet: searchAndGet,
        searchUsersFromEvent: searchUsersFromEvent,
        getMedia: getMedia,
        getPhoto: getPhoto,
        setToken : setToken
    };
}();
