var googleapi = function() {
    
    var baseUrl = DP.utilvar.social.GOOGLE_REST_API_URL;
    
    /*
     * param contiene i parametri:
     * {
     *   type: tipo di query(user o event),
     *   query: parole da ricercare,
     *   fields: "i campi voluti (id, name..),
     * }
     * 
     *  callback è la funziona da richiamare sui dati
     */
    function search(param, callback){
        
        var path;
        
        if (typeof(param) !== 'object' || !param.type || !param.q || typeof(callback) !== 'function'){
            callback({});
            return;
        }
        
        /* Se si sta cercando una persona */
        if(param.type === 'user')
            path = baseUrl + 'people';
        
        /* Se si sta cercando un'attività */
        else if (param.type === 'event')
            path = baseUrl + 'activities';
        
        /* Nessuna tipologia di ricerca riconosciuta */
            else
                return;
        
        if (DP.utilvar.SHOW_EVENTS)
            console.log('Query SEARCH a Google+: ' + path + ' ' + param.q);
        
        gapi.client.request({
            'path': path,
            'params': { 'query': param.q, 'orderBy': 'best'},
            callback: callback
        });
    }
    
    /* 
     * recupero informazioni dettagliate 
     * 
     * param.id -> id della risorsa
     * param.type -> event o user
     * callback -> funzione di callback
     * 
     */
    function get(param, callback){
        
        if (typeof(param) !== 'object' || typeof(callback) !== 'function' || typeof(param.id) !== 'string' || typeof(param.type) !== 'string')
            return;
        
        /* Se si sta cercando una persona */
        if(param.type === 'user')
            query = baseUrl + 'people/' + param.id;
        
        /* Se si sta cercando un'attività */
        else if (param.type === 'event')
            query = baseUrl + 'activities/' + param.id;
        
        /* Nessuna tipologia di ricerca riconosciuta */
            else
                return;
        
        if (DP.utilvar.SHOW_EVENTS)
            console.log('Query GET a Google+: ' + query);
        
        gapi.client.request({
            'path': query,
            'callback': callback
        });
    }
    
    function getArray(param,callback) {
        
        var data = new Array();
        var items = param.items;
        var type = param.type;
        var node = param.node
        
        for (var i = 0; i < items.length; i++){
            var interval = parseInt(i/DP.utilvar.social.QUOTA_GOOGLE);
            
            setTimeout((function(){
                var el = items[i];
                
                return function() {
                    get({type: type, id: el.id}, function(obj){
                        
                        if (DP.cancel)
                            return;
                        
                        if (type === 'user')
                            data.push(new User('google', obj))
                        else
                            data.push(new Event('google', obj));
                        
                        if (data.length === items.length){
                            node.result = data;
                            callback();
                        }
                    });
                }
            })(), interval * 2000)   
            console.log(interval*2000);
        }
    }
    
    function searchAndGet(node, callback) {
        
        var data = new Array(),
            reqType,
            param = {q: node.info.query};
        
        if (node.info.queryType === 'Users')
            reqType = param.type = 'user';
        else if (node.info.queryType === 'Events')
            reqType = param.type = 'event';
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
            if (result.items) 
                getArray({items: result.items, type: reqType, node: node}, callback)   
            else {
                node.result = [];
                callback();
            }
        });
    }
    
    return {
        search : search,
        get : get,
        searchAndGet: searchAndGet
    };
}();