var feedrssapi = function(){
    
    function getRSS(node, callback, num){
     
        if (!node || typeof(callback) !== 'function'){
            if (DP.utilvar.SHOW_ERROR)
                console.error('ERROR: Mush specify url and valid callback');
            return;
        }
        
        var feed = new google.feeds.Feed(node.info.url);
        
        if (num)
            feed.setNumEntries(num);
        else
            feed.setNumEntries(DP.utilvar.feed.DEFAULT_NUMBER_OF_FEED);
        
        feed.load(function(res){
            
            if (DP.cancel)
                return;
            
            node.result = new Array();
            if (res.feed)
                res.feed.entries.each(function(el){
                   node.result.push(new FeedRSS(el, res.feed.link));
                });
            
            callback();
        });
    }
    
    return {
        getRSS: getRSS
    };
}();