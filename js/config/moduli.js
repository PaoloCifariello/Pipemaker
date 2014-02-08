/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */

moduli = {
    /* elementi del menu' */
    menuItems: [
        /* primo elemento */
        {
            "id": "source",
            "name": "Sources",
            "desc": "Data sources",
            "subs": [
                /* elementi del submenu */
                {
                    "id": "facebook",
                    "name": "Facebook",
                    "desc": "Get events or users from Facebook",
                    "class": "facebookobj",
                    "input": 0,
                    "inputType": [DP.utilvar.type.EMPTY],
                    "outputType": [DP.utilvar.type.USER_SEQ, DP.utilvar.type.EVENT_SEQ],
                    "output": 1,
                    "source": true,
                    "active" : false
                },
                {
                    "id": "google+",
                    "name": "Google+",
                    "desc": "Get events or users from Google+",
                    "class": "googleobj",
                    "input": 0,
                    "inputType": [DP.utilvar.type.EMPTY],
                    "outputType": [DP.utilvar.type.USER_SEQ, DP.utilvar.type.EVENT_SEQ],
                    "output": 1,
                    "source": true,
                    "active" : false
                },
                {
                    "id": "instagram",
                    "name": "Instagram",
                    "desc": "Get Media or users from Instagram",
                    "class": "instagramobj",
                    "input": 0,                   
                    "output": 1,
                    "inputType": [DP.utilvar.type.EMPTY],
                    "outputType": [DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ], 
                    "source": true,
                    "active" : false
                },
                {
                    "id": "flickr",
                    "name": "Flickr",
                    "desc": "Ottieni informazioni da Flickr",
                    "class": "flickrobj",
                    "input": 0,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EMPTY],
                    "outputType": [],
                    "source": true,
                    "active" : false
                },
                {
                    "id": "youtube",
                    "name": "Youtube",
                    "desc": "Ottieni informazioni da un Youtube",
                    "class": "youtubeobj",
                    "input": 0,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EMPTY],
                    "outputType": [],
                    "source": true,
                    "active" : false
                },
                {
                    "id": "feedrss",
                    "name": "Feed RSS",
                    "desc": "Get feed RSS",
                    "class": "feedobj",
                    "input": 0,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EMPTY],
                    "outputType": [DP.utilvar.type.FEED_SEQ],
                    "source": true,
                    "active" : true
                }
            ]
        },
        /* secondo elemento */
        {
            "id": "secondaryfetch",
            "name": "Secondary Fetch",
            "desc": "Secondary Fetch",
            "subs": [
                /* elementi del submenu */
                {
                    "id": "getmedia",
                    "name": "Get Media",
                    "desc": "Get media from Facebook and Instagram users",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.USER_SEQ],
                    "outputType": [DP.utilvar.type.MEDIA_SEQ],
                    "active": true
                },
                {
                    "id": "getuser",
                    "name": "Get Users",
                    "desc": "Get users from Facebook events",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ],
                    "outputType": [DP.utilvar.type.USER_SEQ],        
                    "activate": 1,
                    "active": true
                }
            ]
        },
        
        /* terzo elemento */
        {
            "id": "operators",
            "name": "Operators",
            "desc": "Operators on data",
            "subs": [
                {
                    "id": "union",
                    "name": "Union",
                    "desc": "Unify streams of elements",
                    "input": 4,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "outputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "active" : true
                },
                {
                    "id": "split",
                    "name": "Split",
                    "desc": "Generate multiple streams from a single one",
                    "input": 1,
                    "output": 4,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],                                     "outputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "active": true
                },
                {
                    "id": "head",
                    "name": "Head",
                    "desc": "Get head of a stream",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "outputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "active" : true
                },
                {
                    "id": "tail",
                    "name": "Tail",
                    "desc": "Get tail of a stream",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "outputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "active" : true
                },
                {
                    "id": "count",
                    "name": "Count",
                    "desc": "Count list elements",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "outputType": [DP.utilvar.type.INT],
                    "active" : false
                },
                {
                    "id": "reverse",
                    "name": "Reverse",
                    "desc": "Reverse stream order",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],                                     "outputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "active" : true
                }
            ]
        },
        /* Quarto elemento */
        {
            "id": "advancedoperators",
            "name": "Advanced operators",
            "desc": "Advanced operators",
            "subs": [
                {
                    "id": "rename",
                    "name": "Rename",
                    "desc": "Rename or copy property",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],                                     "outputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "active" : false
                },
                {
                    "id": "filter",
                    "name": "Filter",
                    "desc": "Filter elements of a stream",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],                                     "outputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "active" : true
                },
                {
                    "id": "subelement",
                    "name": "Sub-element",
                    "desc": "Get sub elements",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],                                     "outputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "active" : false
                },
                {
                    "id": "unique",
                    "name": "Unique",
                    "desc": "Unify elements of the stream with same selected field value",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],                                     "outputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "active" : true
                },
                {
                    "id": "sort",
                    "name": "Sort",
                    "desc": "Sort stream of elements",
                    "input": 1,
                    "output": 1,
                    "inputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],                                     "outputType": [DP.utilvar.type.EVENT_SEQ, DP.utilvar.type.FEED_SEQ, DP.utilvar.type.MEDIA_SEQ, DP.utilvar.type.USER_SEQ],
                    "active" : true
                },
            ]
                },
                {
                "id": "examples",
                "name": "Examples",
                "desc": "Some examples of pipes",
                "subs": [
                {
                "id": "example1",
                "name": "Example1",
                "desc": "example1",
                "example": true,
                "dependencies": [],
            "diagram": '{"elements":[{"id":"pipeEnd","info":{"input":["feed_seq"],"output":["feed_seq"]},"type":"pipeEnd","transform":"translate(0px, -120px)","color":"rgb(60, 162, 121)","location":{"left":"389px","top":"629px"}},{"id":"feedrss0","info":{"input":[],"output":["feed_seq"],"url":"http://www.engadget.com/rss.xml"},"type":"feedrss","transform":"translate(0px, -120px)","location":{"left":"251px","top":"132px"}},{"id":"filter1","info":{"input":["feed_seq"],"output":["feed_seq"],"type":"permit","what":"any","filter1":{"field":"feedrss title","opt":"dnc","str":"smartphone"}},"type":"filter","transform":"translate(0px, -120px)","color":"rgb(48, 145, 255)","location":{"left":"207px","top":"262px"}},{"id":"feedrss1","info":{"input":[],"output":["feed_seq"],"url":"http://feeds.feedburner.com/engeene/aggiornamenti"},"type":"feedrss","transform":"translate(0px, -120px)","location":{"left":"462px","top":"168px"}},{"id":"union1","info":{"input":["feed_seq"],"output":["feed_seq"]},"type":"union","transform":"translate(0px, -120px)","color":"rgb(46, 213, 255)","location":{"left":"366px","top":"371px"}},{"id":"sort1","info":{"input":["feed_seq"],"output":["feed_seq"],"sortBy":"feedrss publishedDate","sortOrder":"descending"},"type":"sort","transform":"translate(0px, -120px)","color":"rgb(255, 105, 210)","location":{"left":"571px","top":"498px"}}],"links":[{"input":"union1","output":"filter1","transform":""},{"input":"filter1","output":"feedrss0","transform":""},{"input":"union1","output":"feedrss1","transform":""},{"input":"pipeEnd","output":"sort1","transform":""},{"input":"sort1","output":"union1","transform":""}],"zoomMode":false}'
        },
        {
            "id": "example2",
            "name": "Example2",
            "desc": "example2",
            "example": true,
            "dependencies": ['facebook'],
            "diagram": '{"elements":[{"id":"pipeEnd","info":{"input":["user_seq","event_seq"],"output":["user_seq","event_seq"]},"type":"pipeEnd","transform":"translate(0px, -200px)","color":"rgb(4, 162, 0)","location":{"left":"628px","top":"760px"}},{"id":"facebook3","info":{"input":[],"output":["event_seq"],"query":"unipi","queryType":"Events"},"type":"facebook","transform":"translate(0px, -200px)","location":{"left":"85px","top":"-106px"}},{"id":"split3","info":{"input":["event_seq"],"output":["event_seq"]},"type":"split","transform":"translate(0px, -200px)","color":"rgb(48, 145, 255)","location":{"left":"268px","top":"52px"}},{"id":"union3","info":{"input":["user_seq","event_seq"],"output":["user_seq","event_seq"]},"type":"union","transform":"translate(0px, -200px)","color":"rgb(48, 145, 255)","location":{"left":"221px","top":"429px"}},{"id":"getuser3","info":{"input":["event_seq"],"output":["user_seq"]},"type":"getuser","transform":"translate(0px, -200px)","color":"rgb(48, 145, 255)","location":{"left":"478px","top":"194px"}},{"id":"sort3","info":{"input":["user_seq","event_seq"],"output":["user_seq","event_seq"],"sortBy":"user firstName","sortOrder":"ascending"},"type":"sort","transform":"translate(0px, -200px)","color":"rgb(48, 145, 255)","location":{"left":"294px","top":"598px"}},{"id":"unique3","info":{"input":["user_seq"],"output":["user_seq"],"type":"user","uniqueBy":"lastName"},"type":"unique","transform":"translate(0px, -200px)","color":"rgb(48, 145, 255)","location":{"left":"506px","top":"308px"}}],"links":[{"input":"split3","output":"facebook3","transform":"translate(240px, -40px)"},{"input":"getuser3","output":"split3","transform":"translate(240px, -40px)"},{"input":"pipeEnd","output":"sort3","transform":"translate(240px, -40px)"},{"input":"unique3","output":"getuser3","transform":"translate(240px, -40px)"},{"input":"sort3","output":"union3","transform":"translate(240px, -40px)"},{"input":"union3","output":"split3","transform":"translate(240px, -40px)"},{"input":"union3","output":"unique3","transform":"translate(240px, -40px)"}],"zoomMode":false}'
        },
        {
            "id": "example3",
            "name": "Example3",
            "desc": "example3",
            "example": true,
            "dependencies": ['facebook','google+','instagram'],
            "diagram": '{"elements":[{"id":"pipeEnd","info":{"input":["media_seq","user_seq"],"output":["media_seq","user_seq"]},"type":"pipeEnd","transform":"translate(0px, 0px)","color":"rgb(154, 157, 162)","location":{"left":"389px","top":"542px"}},{"id":"instagram0","info":{"input":[],"output":["user_seq"],"query":"Jack","queryType":"Users"},"type":"instagram","transform":"translate(0px, 0px)","location":{"left":"136px","top":"0px"}},{"id":"union1","info":{"input":["media_seq","user_seq"],"output":["media_seq","user_seq"]},"type":"union","transform":"translate(0px, 0px)","color":"rgb(5, 63, 255)","location":{"left":"490px","top":"460px"}},{"id":"facebook1","info":{"input":[],"output":["user_seq"],"query":"Jack","queryType":"Users"},"type":"facebook","transform":"translate(0px, 0px)","location":{"left":"625px","top":"13px"}},{"id":"split0","info":{"input":["user_seq"],"output":["user_seq"]},"type":"split","transform":"translate(0px, 0px)","color":"rgb(171, 199, 255)","location":{"left":"364px","top":"177px"}},{"id":"getmedia1","info":{"input":["user_seq"],"output":["media_seq"]},"type":"getmedia","transform":"translate(0px, 0px)","color":"rgb(255, 212, 94)","location":{"left":"203px","top":"257px"}},{"id":"filter1","info":{"input":["user_seq"],"output":["user_seq"],"type":"permit","what":"all","filter1":{"field":"user firstName","opt":"is","str":"Jack"}},"type":"filter","transform":"translate(0px, 0px)","color":"rgb(0, 255, 255)","location":{"left":"262px","top":"85px"}},{"id":"filter2","info":{"input":["user_seq"],"output":["user_seq"],"type":"permit","what":"all","filter1":{"field":"user firstName","opt":"is","str":"Jack"}},"type":"filter","transform":"translate(0px, 0px)","color":"rgb(0, 255, 195)","location":{"left":"679px","top":"353px"}},{"id":"head1","info":{"input":["media_seq"],"output":["media_seq"],"number":50},"type":"head","transform":"translate(0px, 0px)","color":"rgb(51, 255, 0)","location":{"left":"315px","top":"350px"}},{"id":"google+0","info":{"input":[],"output":["user_seq"],"query":"Jack","queryType":"Users"},"type":"google+","transform":"","location":{"left":"857px","top":"16px"}},{"id":"union3","info":{"input":["user_seq"],"output":["user_seq"]},"type":"union","transform":"","color":"rgb(0, 68, 255)","location":{"left":"760px","top":"246px"}},{"id":"head2","info":{"input":["user_seq"],"output":["user_seq"],"number":40},"type":"head","transform":"","color":"rgb(9, 255, 0)","location":{"left":"575px","top":"126px"}}],"links":[{"input":"filter1","output":"instagram0","transform":""},{"input":"filter2","output":"union3","transform":""},{"input":"union3","output":"head2","transform":""},{"input":"head2","output":"facebook1","transform":""},{"input":"union3","output":"google+0","transform":""},{"input":"getmedia1","output":"split0","transform":""},{"input":"split0","output":"filter1","transform":""},{"input":"union1","output":"filter2","transform":""},{"input":"union1","output":"split0","transform":""},{"input":"union1","output":"head1","transform":""},{"input":"head1","output":"getmedia1","transform":""},{"input":"pipeEnd","output":"union1","transform":""}],"zoomMode":false}'
        }
    ]
    
}
],
    findModule : function(id) {
        for (var i = 0; i < this.menuItems.length; i++){
            for (var j = 0; j < this.menuItems[i].subs.length; j++)
                if (this.menuItems[i].subs[j].id === id)
                    return this.menuItems[i].subs[j];
        }
    }
};