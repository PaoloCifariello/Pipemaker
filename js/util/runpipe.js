/*
 * Fuzione che ottiene dati da nodi della pipe
 *
 * @param{PipeElement} node il nodo della pipe da cui ottenere informazioni
 */
DP.getPipeData = function(node, callback){
    
    var dataToReturn;
    
    // Se i risultati sono già presenti
    if (node.result)
        return node.result;
    
    switch (node.type)
    {       
            // Sorgenti
        case 'facebook':
            {
                facebookapi.searchAndGet(node, callback);
                break;
            }
        case 'google+':
            {
                googleapi.searchAndGet(node, callback);
                break;
            }
        case 'instagram':
            {
                instagramapi.searchAndGet(node, callback);
                break;
            }  
        case 'feedrss':
            {
                feedrssapi.getRSS(node, callback);
                break;
            }
            
            
            // Secondary fetch    
        case 'getmedia':
            {
                var data;
                
                var inputNode = (node.inputLinks[0]) ? node.inputLinks[0].outputNode : undefined;
                
                if (inputNode) {
                    data = DP.getPipeData(inputNode).slice(0);
                    
                    var facebookUsers = new Array();
                    var instagramUsers = new Array();
                    var others = new Array();
                    
                    for (var i = 0; i < data.length; i++)
                        if (data[i].type === 'user' && data[i].source === 'facebook')
                            facebookUsers.push(data[i]);
                        else if (data[i].type === 'user' && data[i].source === 'instagram')
                            instagramUsers.push(data[i]);
                        else
                            others.push(data[i]);
                    
                    node.result = others;
                    
                    instagramapi.getMedia(instagramUsers, node, function(){
                            facebookapi.getMedia(facebookUsers, node, callback);
                        });
                }
                
                break;
            }
        case 'getuser':
            {
                var data;
                
                var inputNode = (node.inputLinks[0]) ? node.inputLinks[0].outputNode : undefined;
                
                if (inputNode) {
                    data = DP.getPipeData(inputNode).slice(0);
                    facebookapi.searchUsersFromEvent(data, node, callback);
                }
                
                break;
            }
            
            // Filtri semplici
        case 'union':
            {
                var data = new Array();
                
                for (var i = 0; i < node.inputLinks.length; i++) {
                    var input = node.inputLinks[i].outputNode;
                    data = data.concat(DP.getPipeData(input).slice(0));
                }
                
                node.result = dataToReturn = data;
                break;
            }
        case 'head':
            {
                var data;
                
                var inputNode = (node.inputLinks[0]) ? node.inputLinks[0].outputNode : undefined;
                
                if (inputNode) {
                    data = DP.getPipeData(inputNode).slice(0);
                    
                    // Se ho settato la quantità di elementi da prendere
                    if (node.info.number){
                        if (data.length > node.info.number)
                            data = data.slice(0,node.info.number);
                    }
                    
                    node.result = data;
                }
                
                dataToReturn = data;
                break;
            }
        case 'tail':
            {
                var data;
                
                var inputNode = (node.inputLinks[0]) ? node.inputLinks[0].outputNode : undefined;
                
                if (inputNode) {
                    data = DP.getPipeData(inputNode).slice(0);
                    
                    // Se ho settato la quantità di elementi da prendere
                    if (node.info.number){
                        if (data.length > node.info.number)
                            data = data.slice(data.length - node.info.number, data.length);
                    }
                    
                    node.result = data;
                }
                
                dataToReturn = data;
                break;  
            }
        case 'sort':
            {
                var data;
                
                var inputNode = (node.inputLinks[0]) ? node.inputLinks[0].outputNode : undefined;
                
                if (inputNode) {
                    data = DP.getPipeData(inputNode).slice(0);
                    
                    if (node.info.sortBy){
                        var sortFun = DP.util.getSortFunction(node.info.sortBy);
                        data.sort(sortFun);
                        if (node.info.sortOrder === 'descending')
                            data.reverse();
                    }
                    
                    node.result = data;
                }
                
                dataToReturn = data;
                break;
            }
        case 'reverse':
            {
                var data;
                
                var inputNode = (node.inputLinks[0]) ? node.inputLinks[0].outputNode : undefined;
                
                if (inputNode) {
                    data = DP.getPipeData(inputNode).slice(0);
                    
                    // Se ho settato la quantità di elementi da prendere
                    data.reverse();
                    
                    node.result = data;
                }
                
                dataToReturn = data;
                break;
            }
        case 'split':
            {
                var data;
                
                var inputNode = (node.inputLinks[0]) ? node.inputLinks[0].outputNode : undefined;
                
                if (inputNode) {
                    data = DP.getPipeData(inputNode).slice(0);
                    
                    node.result = data;
                }
                
                dataToReturn = data;
                break;
            }
            
        case 'filter':
            {
                var inData,
                    filter = new Array(),
                    data = new Array();
                
                if (node.info.filter1)
                    filter.push(node.info.filter1);
                if (node.info.filter2)
                    filter.push(node.info.filter2);
                if (node.info.filter3)
                    filter.push(node.info.filter3);
                if (node.info.filter4)
                    filter.push(node.info.filter4);
                
                var inputNode = (node.inputLinks[0]) ? node.inputLinks[0].outputNode : undefined;
                
                if (inputNode) {
                    inData = DP.getPipeData(inputNode).slice(0);
                    
                    for (var i = 0; i < inData.length; i++)
                        if (DP.util.applyFilter(inData[i], filter, node.info.what, node.info.type))
                            data.push(inData[i]);
                }
                 
                node.result = data;
                dataToReturn = data;
                break;
            }     
        case 'unique':
            {
                var inData,
                    data = new Array();

                var inputNode = (node.inputLinks[0]) ? node.inputLinks[0].outputNode : undefined;
                
                if (inputNode) {
                    inData = DP.getPipeData(inputNode).slice(0);
                    
                    for (var i = 0; i < inData.length; i++) {
                        data.push(inData[i]);
                        
                        if (inData[i].type === node.info.type)
                            for (var j = i + 1; j < inData.length; j++) {
                                if (inData[j].type === node.info.type && 
                                    (inData[j])[node.info.uniqueBy] !== undefined &&
                                    (inData[j])[node.info.uniqueBy] === (inData[i])[node.info.uniqueBy]){

                                    inData.splice(j,1);
                                    j--;
                                }
                            }
                    }
                    
                    node.result = data;
                }
                
                dataToReturn = data;
                break;
            }       
    }
    
    return dataToReturn;
}