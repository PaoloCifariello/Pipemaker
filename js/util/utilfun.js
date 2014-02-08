/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */

/*
 * 
 * Funzioni di utilità
 * 
 */
DP.util = function () {
    
    
    function colorToHex(color) {
        
        if(color === "")
            return "";
        
        if (color.substr(0, 1) === '#') {
            return color;
        }
        
        var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
        
        var red = parseInt(digits[2]);
        var green = parseInt(digits[3]);
        var blue = parseInt(digits[4]);
        
        var rgb = blue | (green << 8) | (red << 16);
        var toRet = rgb.toString(16);
        var nzeri = 6 - toRet.length;
        var final = '';
        
        while (nzeri > 0){
            final = final.concat('0');
            nzeri--;
        }
        
        return '#' + final.concat(toRet);
    };
    
    function getComplementary(hex){
        
        R = hexToR(hex);
        G = hexToG(hex);
        B = hexToB(hex);
        
        function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
        function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
        function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
        function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
        function min3(a,b,c) { return (a<b)?((a<c)?a:c):((b<c)?b:c); } 
        function max3(a,b,c) { return (a>b)?((a>c)?a:c):((b>c)?b:c); } 
        function HueShift(h,s) { h+=s; while (h>=360.0) h-=360.0; while (h<0.0) h+=360.0; return h; }
        function maxDelta(v1,v2,v3) { return max3(Math.abs(v1 - v2),Math.abs(v1 - v3),Math.abs(v2 - v3));}
        
        var rgb = {r:R, g:G, b:B};
        
        // in caso il colore sia bianco
        if (R >= 230 && G >= 230 && B >= 230)
            return '000000';
        
        // se sono in una scala di grigi
        if (maxDelta(R,G,B) < 30)
            return 'FFFFFF';
        
        // altrimenti se Ã© nero 
        else if (R <= 30 && G <= 30 && B <= 30)
            return 'FFFFFF';
        
        // altrimenti
        else {
            var hsv = new Object(),
                max = max3(rgb.r,rgb.g,rgb.b),
                dif = max - min3(rgb.r,rgb.g,rgb.b);
            
            hsv.saturation = (max == 0.0) ? 0 : (100*dif/max);
            
            if (hsv.saturation==0) hsv.hue=0;
            else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
            else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
            else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
            
            if (hsv.hue<0.0) 
                hsv.hue+=360.0;
            
            hsv.value = Math.round(max*100/255);
            
            hsv.hue = Math.round(hsv.hue);
            hsv.saturation=Math.round(hsv.saturation);
            
            // conversione
            hsv.hue = HueShift(hsv.hue, 180.0);
            
            var rgb=new Object();
            
            if (hsv.saturation==0) {
                rgb.r = rgb.g = rgb.b = Math.round(hsv.value*2.55);
            } else {
                hsv.hue/=60;
                hsv.saturation/=100;
                hsv.value/=100;
                
                var i=Math.floor(hsv.hue);
                var f = hsv.hue - i;
                var p = hsv.value*(1-hsv.saturation);
                var q = hsv.value*(1-hsv.saturation*f);
                var t = hsv.value*(1-hsv.saturation*(1-f));
                
                switch(i) {
                    case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
                    case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
                    case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
                    case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
                    case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
                    default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
                }
                
                rgb.r = Math.round(rgb.r*255);
                rgb.g = Math.round(rgb.g*255);
                rgb.b = Math.round(rgb.b*255);
                
                // c'è un bug che scambia r e b
                r = rgb.r;
                rgb.r = rgb.b;
                rgb.b = r;
            }
            
            if ((Math.abs(rgb.r - R) <= 15) &&
                (Math.abs(rgb.b - B) <= 15) &&
                (Math.abs(rgb.g - G) <= 15))
                return 'FFFFFF';
            
            var decColor = rgb.r + 256 * rgb.g + 65536 * rgb.b;
            return decColor.toString(16);
        }
    }
    
    function convertDate(oldFormat, intFormat) {
        
        if (!oldFormat)
            return "";
        
        var date = new Date(oldFormat);
        
        if (intFormat)
            return date.getFullYear() + " " + date.getMonth() + " " + date.getDate();
        
        var months = Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var string = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        return string;
    }
    
    /*
     * 
     * Azzera la pipe attuale eliminando tutti gli elementi
     * se pipeDiagram esiste allora renderizza la pipe identificata
     * da pipeDiagram
     * 
     */
    function startNewPipe(pipeDiagram) {
        
        var pipeEditor = document.getElementById('pipeEditor'),
            children = pipeEditor.children,
            menu = document.getElementById('nodeProperties');
        
        if (pipeEditor) {
            
            while (children[1] !== undefined) 
                DP.util.removeNode(children[1]);
            
            clearLinks();
        }
        
        DP.pipeElements.clearPipe();
        
        if (pipeDiagram){
            renderPipe(pipeDiagram);
        }
        
        document.body.appendChild(menu);
    }
    
    /* Pipe caricata da file, aggiorno gli id nel diagramma di pipe
     * 
     * @param {Array} links array di link da aggiornare
     * @param {string} oldid vecchio id, da aggiornare
     * @param {string} newid nuovo id da sostituire a oldid
     */
    function updatePipeDiagramLinks (links, oldid, newid) {
        
        for (var i = 0; i < links.length; i++) {
        
            if (links[i].input === oldid && !links[i].inputModified) {
                links[i].input = newid;
                links[i].inputModified = true;   
            }
            else if (links[i].output === oldid && !links[i].outputModified) {
                links[i].output = newid;   
                links[i].outputModified = true;
            }
        }
    }
    
    /* Renderizza la pipe identificata da pipeDiagram
     * 
     */
    function renderPipe(pipeDiagram) {
        
        var elements = pipeDiagram.elements.slice(0),
            links = pipeDiagram.links.slice(0);
        
        DP.pipeElements.zoomMode = pipeDiagram.zoomMode;
        
        
        elements.each(function(el){
            var mod = moduli.findModule(el.type)
            
            if (mod) {
                var newPipeEl = DP.pipeElements.createPipeElement(undefined, mod)
                newPipeEl.info = el.info;

                DP.lastElement.style.left = el.location.left;
                DP.lastElement.style.top = el.location.top;
                DP.lastElement.style.opacity = "1";
                DP.lastElement.style.backgroundColor = (el.color !== undefined) ? el.color : "";
                DP.lastElement.style.webkitTransform = el.transform;
                DP.lastElement = undefined;
                
                updatePipeDiagramLinks(links, el.id, newPipeEl.id)
            }
            
            else if (el.type === 'pipeEnd') {
                var pe = DP.pipeElements.getPipeElement('pipeEnd');
                pe.domNode.style.left = el.location.left;
                pe.domNode.style.top = el.location.top;
                pe.domNode.style.opacity = '1';
                pe.domNode.style.backgroundColor = (el.color !== undefined) ? el.color : "";
                pe.domNode.style.webkitTransform = el.transform;
            }
        });
        
        links.each(function(el){
            var input = DP.pipeElements.getPipeElement(el.input);
            var output = DP.pipeElements.getPipeElement(el.output);
            
            var link = DP.util.createLink(input, output);
        });
        
        // Ricalcolo l'output
        recalcOutput();
    }
    
    /* Read File
     *
     */
    function readBlob(opt_startByte, opt_stopByte) {
        
        var input = document.getElementById('files');
        var files = input.files;
        if (!files.length) {
            if (DP.utilvar.SHOW_ERROR)
                console.error('ERROR: No file selected');
            
            return;
        }
        
        var file = files[0];
        var start = parseInt(opt_startByte) || 0;
        var stop = parseInt(opt_stopByte) || file.size - 1;
        
        var reader = new FileReader();
        
        // If we use onloadend, we need to check the readyState.
        reader.onloadend = function(evt) {
            if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                
                var pipeDiagram = JSON.parse(evt.target.result);
                
                if (!pipeDiagram){
                    if (DP.utilvar.SHOW_ERROR)
                        console.error('ERROR: Invalid Pipe');
                    return;
                }
                
                DP.util.startNewPipe(pipeDiagram);
            }
        };
        
        var blob = file.slice(start, stop + 1);
        reader.readAsBinaryString(blob);
        input.value = "";
    }
    
    /**    
     * Costruisce una stringa che rappresenta un elemento della Pipe    
     * @param {PipeElement} el elemento da descrivere    
     */
    function getPipeElementDiagram(el) {
        
        var diagram = {};
        
        diagram.id = el.id;
        diagram.info = el.info;
        diagram.type = el.type;
        diagram.transform = el.domNode.style.webkitTransform;
        
        if (!DP.util.isSourceElement(el)){
            var node = document.getElementById(diagram.id);
            diagram.color = node.style.backgroundColor;
        }
        
        diagram.location = {
            left: el.domNode.style.left,
            top: el.domNode.style.top
        }
        
        return diagram;
    }
    
    /**     
     * Costruisce una stringa che rappresenta un link della Pipe
     * @param {Link} link il link da descrivere     
     */
    function getPipeLinkDiagram(link) {
        
        var diagram = {};
        
        diagram.input = link.inputNode.id;
        diagram.output = link.outputNode.id;
        diagram.transform = link.link.style.webkitTransform;
        
        return diagram;
    }
    
    /*
     * Costruisce una stringa che rappresenta la Pipe corrente
     * 
     * @returns {string} La pipe convertita in stringa
     */
    function getPipeString() {
        
        var pipeDiagram = {
            elements: new Array(),
            links: new Array(),
            zoomMode: DP.pipeElements.zoomMode
        }
        
        // riempo l'array di elementi pipe
        for (var i in DP.pipeElements.elements){
            var PipeElementDiagram = getPipeElementDiagram(DP.pipeElements.elements[i]);   
            pipeDiagram.elements.push(PipeElementDiagram);
        }
        
        DP.pipeElements.links.each(function(link){
            var PipeLinkDiagram = getPipeLinkDiagram(link); 
            pipeDiagram.links.push(PipeLinkDiagram);            
        });
        
        return JSON.stringify(pipeDiagram);
    }
    
    /*
     * Azzera i link
     *
     *  @returns {undefined}
     * 
     */
    function clearLinks() {
        
        var pipeLinks = document.getElementById('pipeLinks');
        
        if (pipeLinks)
            while (pipeLinks.firstChild)
                pipeLinks.removeChild(pipeLinks.firstChild);
    }
    
    /*
     *  Cerca la posizione (intesa come coppia left,top )
     *  di un elemento
     *
     * @param {object} elem elemento del quale ricercare la posizione assoluta
     * @returns {(left, top)} la coppia di coordinate assolute dell'elemento
     */
    function getposition(elem, firstOf) {
        
        if (elem === undefined)
            return undefined;
        
        var left = 0,
            top = 0;
        
        do {
            if (firstOf && elem == firstOf) {
                break;
            }
            
            left += elem.offsetLeft;
            top += elem.offsetTop;
        } while (elem = elem.offsetParent);
        
        return {left: left, top: top};
    }
    
    function moveNode(node, dx, dy) {
        
        var current = node.style.webkitTransform;
        
        if (current === ""){
            node.style.webkitTransform = "translate(" + dx + "px," + dy + "px)";
            return;
        }
        
        var cur = current.split('(')[1];
        
        var cx = parseInt(cur);
        
        cur = cur.split(',')[1];
        
        var cy = parseInt(cur);
        
        cx = cx + dx;
        cy = cy + dy;
        
        node.style.webkitTransform = "translate(" + cx + "px," + cy + "px)";
    }
    
    function moveView(where, repeat) {
        if (!DP.movingView)
            return;
        
        var dx, dy;
        
        switch (where)
        {
            case 'up':
                {
                    dy = - DP.utilvar.view;
                    dx = 0;
                    break;
                }
            case 'down':
                {
                    dy = DP.utilvar.view;
                    dx = 0;
                    break;
                }
            case 'left':
                {
                    dy = 0;
                    dx = - DP.utilvar.view;
                    break;
                }
            case 'right':
                {
                    dy = 0;
                    dx = DP.utilvar.view;
                    break;
                }
        }
        
        function getFun(node, dx, dy){
            
            var total = 20,
                current = 0;
            
            return function(){
                setTimeout(function(){
                    moveNode(node, dx/total, dy/total);
                    current++;
                    if (current < total)
                        setTimeout(arguments.callee, 1);
                    
                }, 1);
            };
            
            
        };
        
        for (var i in DP.pipeElements.elements) 
            (getFun(DP.pipeElements.elements[i].domNode, dx, dy))();
        
        DP.pipeElements.links.each(function(el){
            (getFun(el.link, dx, dy))();
        });
        
        if (jscolor.picker && document.body.contains(jscolor.picker.boxB))
            (getFun(jscolor.picker.boxB, dx, dy))();
        
        if (repeat){
            var timerNumber = setTimeout(function(){
                var index = DP.currentMoving.indexOf(timerNumber);
                if(index !== -1)
                    DP.currentMoving.splice(index, 1);
                moveView(where, true);
            }, 250);
            
            DP.currentMoving.push(timerNumber);
        }
    }
    
    function stopMoving() {
        DP.movingView = false;
        
        DP.currentMoving.each(function(el){
            window.clearTimeout(el);
        });
    }
    
    function getTransform(node) {
        
        var current = node.style.webkitTransform;
        
        if (current === "")
            return {dx: 0, dy: 0};
        
        var cur = current.split('(')[1];
        var cx = parseInt(cur);
        cur = cur.split(',')[1];
        var cy = parseInt(cur);        
        
        return {dx: cx, dy: cy};
    }
    
    /*
     * Aggiunge il link tra i due nodi
     * 
     * @param {PipeElement} outputNode il nodo che ha il collegamento sull'output
     * @param {PipeElement} inputNode il nodo che ha il collegamento sull'input
     * @param {SVG Node} link il nodo SVG associato
     * * @returns {undefined}
     */
    function addLink(outputNode, inputNode, link, position) {
        
        var l = {
            link: link,
            outputNode: outputNode,
            inputNode: inputNode,
            position: position
        };
        
        // Creo il collegamento 
        outputNode.outputLinks.push(l);
        inputNode.inputLinks.push(l);
        DP.pipeElements.links.push(l);
        
        if (DP.utilvar.SHOW_EVENTS)
            console.log('EVENT: Link between ' + outputNode.domNode.id + ' and ' + inputNode.domNode.id + ' has been created.');
    }
    
    /*
     * Creazione di un collegamento
     * 
     * @param {int} startx coordinata x inizio
     * @param {int} starty coordinata y inizio
     * @param {int} endx coordinata x fine
     * @param {int} endy coordinata y fine
     * @param {bool} definitive definisce se il link è definitivo o dinamico
     * @returns {svgnode} il link creato
     */
    function drawLink(startx, starty, endx, endy, definitive) {
        
        var link = document.createElementNS("http://www.w3.org/2000/svg", "path");
        
        var delta = DP.utilvar.link.LINK_WIDTH / 2;
        
        startx += delta;
        endx += delta;
        
        link.setAttribute('d', 'M ' + startx + ' ' + starty + ' ' +
                          'C ' + startx + ' ' + endy + ' ' + endx + ' ' + starty + ' ' + endx + ' ' + endy);
        link.setAttribute('stroke-width', DP.utilvar.link.LINK_WIDTH);
        link.setAttribute('fill', 'none');
        link.setAttribute('stroke', 'black');
        
        if (!definitive)
            link.style.opacity = "0.3";
        
        return link;
    }
    
    /* Crea un link tra due elementi
     *
     * @param {PipeElement} inputNode primo nodo da collegare
     * @param {PipeElement} outputNode secondo nodo da collegare
     */
    function createLink (inputNode, outputNode, definitive) {
        
        var domNode1 = inputNode.domNode,
            domNode2 = outputNode.domNode,
            attach1,
            attach2;
        
        for (var i = 0; i < domNode1.childNodes.length; i++){
            if (domNode1.childNodes[i].nodeName === 'DIV' && domNode1.childNodes[i].getAttribute('attachtype') === 'input') {
                attach1 = domNode1.childNodes[i];
                break;
            }
        }
        
        for (var i = 0; i < domNode2.childNodes.length; i++){
            if (domNode2.childNodes[i].nodeName === 'DIV' && domNode2.childNodes[i].getAttribute('attachtype') === 'output') {
                attach2 = domNode2.childNodes[i];
                break;
            }
        }
        
        if (!attach2 || !attach1)
            return;
        
        var pos1 = DP.util.getPosition(attach1, pipeEditor);
        var dx1 = attach1.offsetWidth / 2;
        var dy1 = attach1.offsetHeight / 2;
        
        var delta1 = DP.util.getTransform(attach1.parentNode);
        
        var pos2 = DP.util.getPosition(attach2, pipeEditor);
        var dx2 = attach2.offsetWidth / 2;
        var dy2 = attach2.offsetHeight / 2;
        
        var delta2 = DP.util.getTransform(attach2.parentNode);
        
        var linkContainer = document.getElementById('pipeLinks');
        
        var link = DP.util.drawLink(pos1.left + dx1 + delta1.dx,
                                    pos1.top + 2 + delta1.dy , 
                                    pos2.left + dx2 + delta2.dx, 
                                    pos2.top + (2 * dy2) + delta2.dy, definitive === undefined ? true : false);
        
        var position = {
            outputx: pos2.left + dx2 + delta2.dx,
            outputy: pos2.top + (2 * dy2) + delta2.dy,
            inputx: pos1.left + dx1 + delta1.dx,
            inputy: pos1.top + 2 + delta1.dy
        };
        
        DP.util.addLink(outputNode, inputNode, link, position);
        linkContainer.appendChild(link);
        recalcOutput();
        
        return link;
    }
    
    function updateLink(linkStr, type, definite) {
        
        // rimuovo il vecchio link
        var svgPath = linkStr.link,
            index = DP.pipeElements.links.indexOf(linkStr);
        
        var arr;
        
        if (type === 'input')
            arr = linkStr.outputNode.outputLinks; 
        
        else if (type === 'output')
            arr = linkStr.inputNode.inputLinks;
        
        arr.splice(arr.indexOf(linkStr), 1);
        
        if (index !== -1)
            DP.pipeElements.links.splice(index, 1);
        
        DP.util.removeNode(svgPath);
        var link = DP.util.createLink(linkStr.inputNode, linkStr.outputNode, (definite === true) ? undefined : true);
    }
    
    function updateLinks(node, definite) {
        
        var oL = node.outputLinks,
            iL = node.inputLinks;
        
        node.outputLinks = [];
        node.inputLinks = [];
        
        for (var i = 0; i < oL.length; i++)
            updateLink(oL[i], 'output', definite);
        for (var i = 0; i < iL.length; i++)
            updateLink(iL[i], 'input', definite);
    }
    
    /*
     * Controllo se il link che collega node1 e node2 esiste già
     * 
     * @param {type} node1 primo nodo
     * @param {type} node2 secondo nodo
     * @returns {bool} true se esiste, false altrimenti
     */
    function existLink(node1, node2) {
        
        var links = DP.pipeElements.links;
        
        for (var i = 0; i < links.length; i++)
            if ((links[i].inputNode === node1 && links[i].outputNode === node2) ||
                (links[i].inputNode === node2 && links[i].outputNode === node1))
                return true;
        
        return false;
        
    }
    
    /*
     * Creo una funzione che racchiude un array contenente gli id da restituire 
     * quando invocata
     * 
     */
    var getNextId = (function() {
        var ids = {};
        
        return function(id) {
            if (ids[id] === undefined) {
                ids[id] = 1;
                return id + "0";
            }
            
            else {
                ids[id]++;
                return id + (ids[id] - 1);
            }
        };
    })();
    
    /*
     * Creo una funzione che ogni volta ritorna un indice z 
     * da assegnare a un elemento della pipe
     * 
     */
    var getNextZIndex = (function() {
        var nextZ = 1;
        
        return function() {
            return nextZ++;
        };
    })();
    
    function propertiesShortcut() {
        // esc
        if (event.keyCode === 27)
            saveChange(false);
        
        // enter
        else if (event.keyCode === 13)
            saveChange(true);    
    }
    
    /*
     * Handler per mostrare le proprietà di un elemento della pipe
     * 
     * @param {PipeElement} element l'elemento di cui mostrare le proprietà
     */
    function showProperties(element) {
        
        var shower = document.getElementById('blackScreen');
        var propertiesContainer = document.getElementById('propertiesContainer');
        
        if (shower || !propertiesContainer)
            return;
        
        // Prendo il figlio giusto, ossia il menù delle proprietà da mostrare
        var children = propertiesContainer.children;
        
        for (var i = 0; i < children.length; i++)
            if (children[i].id === element.type)
                break;
        
        // il menu non c'è ??? 
        if (i >= children.length)
            return;
        
        children[i].style.display = "block";
        
        shower = document.createElement('div');
        shower.setAttribute('id', 'blackScreen');
        
        document.addEventListener('keydown', propertiesShortcut);
        
        // Per quando deve scomparire la finestra delle proprietà
        shower.addEventListener('click', function() {
            saveChange(false);
        });
        
        fillProperties(element);
        
        // salvo l'elemento che sto modificando
        DP.currentChange = {'element': element, 'form': children[i]};
        
        shower.appendChild(propertiesContainer);
        propertiesContainer.style.display = "block";
        document.body.appendChild(shower);
    }
    
    function saveChange(save) {
        
        document.removeEventListener('keydown', propertiesShortcut);
        
        if (!DP.currentChange)
            return;
        
        var element = DP.currentChange.element,
            form = DP.currentChange.form,
            menu = document.getElementById('nodeProperties');
        
        menu.style.display = 'none';
        DP.util.removeNode(menu);
        document.body.appendChild(menu);
        
        // controllo il tipo di elemento pipe
        switch (element.type)
        {
            case 'facebook':
                {
                    var text = document.getElementById('facebooktext1');
                    
                    if (save)
                        element.info.query = text.value;
                    
                    text.value = "";
                    
                    var radio1 = document.getElementById('facebookradio1');
                    var radio2 = document.getElementById('facebookradio2');
                    
                    if (save) {
                        if (radio1.checked === true && radio2.checked === false){
                            element.info.queryType = 'Users';
                            element.info.output = [DP.utilvar.type.USER_SEQ];  
                        }
                        else if (radio1.checked === false && radio2.checked === true){
                            element.info.queryType = 'Events';
                            element.info.output = [DP.utilvar.type.EVENT_SEQ];
                        }
                    }
                    
                    radio1.checked = radio2.checked = false;
                    
                    break;
                }
            case 'google+':
                {
                    var text = document.getElementById('googletext1');
                    
                    if (save)
                        element.info.query = text.value;
                    
                    text.value = "";
                    
                    var radio1 = document.getElementById('googleradio1');
                    var radio2 = document.getElementById('googleradio2');
                    
                    if (save) {
                        if (radio1.checked === true && radio2.checked === false){
                            element.info.queryType = 'Users';
                            element.info.output = [DP.utilvar.type.USER_SEQ];
                        }
                        else if (radio1.checked === false && radio2.checked === true){
                            element.info.queryType = 'Events';
                            element.info.output = [DP.utilvar.type.EVENT_SEQ];
                        }
                    }
                    
                    radio1.checked = radio2.checked = false;
                    
                    break;
                }
            case 'instagram':
                {
                    var text = document.getElementById('instagramtext1');
                    
                    if (save)
                        element.info.query = text.value;
                    
                    text.value = "";
                    
                    var radio1 = document.getElementById('instagramradio1');
                    var radio2 = document.getElementById('instagramradio2');
                    
                    if (save) {
                        if (radio1.checked === true && radio2.checked === false){
                            element.info.queryType = 'Users';
                            element.info.output = [DP.utilvar.type.USER_SEQ];
                        }
                        else if (radio1.checked === false && radio2.checked === true){
                            element.info.queryType = 'Media';
                            element.info.output = [DP.utilvar.type.MEDIA_SEQ];
                        }
                    }
                    
                    radio1.checked = radio2.checked = false;
                    
                    break;
                }
            case 'feedrss':
                {
                    var text = document.getElementById('feedrsstext1');
                    
                    if (save) {
                        element.info.url = text.value;
                        element.info.output = [DP.utilvar.type.FEED_SEQ];
                    }
                    
                    text.value = "";
                    
                    break;
                }
            case 'head':
                {
                    var text = document.getElementById('headtext1');
                    
                    if (save)
                        element.info.number = parseInt(text.value);
                    
                    text.value = "";
                    
                    break;
                }
            case 'tail':
                {
                    var text = document.getElementById('tailtext1');
                    
                    if (save)
                        element.info.number = parseInt(text.value);
                    
                    text.value = "";
                    
                    break;
                }
            case 'sort':
                {
                    var select = document.getElementById('sortselect');
                    var order = document.getElementById('sortselectOrder');
                    
                    if (save){
                        element.info.sortBy = select.value;
                        element.info.sortOrder = order.value;
                    }
                    
                    select.value = "";
                    
                    break;
                }
            case 'filter':
                {
                    var filter1 = document.getElementById('innerfilter1'),
                        filter2 = document.getElementById('innerfilter2'),
                        filter3 = document.getElementById('innerfilter3'),
                        filter4 = document.getElementById('innerfilter4'),
                        type =  document.getElementById('filtertypeselect'),
                        what =  document.getElementById('filterwhatselect');
                    
                    if (save){
                        
                        element.info.type = type.value;    
                        element.info.what = what.value;
                        
                        if (filter1.style.display !== 'none') {
                            element.info.filter1 = {};
                            element.info.filter1.field = filter1.children[1].value;
                            element.info.filter1.opt = filter1.children[2].value;
                            element.info.filter1.str = filter1.children[3].value;
                        }
                        else
                            element.info.filter1 = undefined;
                        
                        if(filter2.style.display !== 'none') {
                            element.info.filter2 = {};
                            element.info.filter2.field = filter2.children[1].value;
                            element.info.filter2.opt = filter2.children[2].value;
                            element.info.filter2.str = filter2.children[3].value;
                        }
                        else
                            element.info.filter2 = undefined;
                        
                        
                        if(filter3.style.display !== 'none') {
                            element.info.filter3 = {};
                            element.info.filter3.field = filter3.children[1].value;
                            element.info.filter3.opt = filter3.children[2].value;
                            element.info.filter3.str = filter3.children[3].value;
                        }
                        else
                            element.info.filter3 = undefined;
                        
                        
                        if(filter4.style.display !== 'none') {
                            element.info.filter4 = {};
                            element.info.filter4.field = filter4.children[1].value;
                            element.info.filter4.opt = filter4.children[2].value; 
                            element.info.filter4.str = filter4.children[3].value;
                        } 
                        else
                            element.info.filter4 = undefined;
                        
                        
                    }
                    
                    type.value = 'block';
                    what.value = 'all';
                    
                    break;
                }
            case 'subelement':
                {
                    var select = document.getElementById('subelementselect');
                    
                    if (save)
                        element.info.subBy = select.value;
                    
                    select.value = "";
                    
                    break;
                }
            case 'unique':
                {
                    var select = document.getElementById('uniqueselect');
                    
                    if (save) {
                        var arr = select.value.split(' ');
                        
                        element.info.type = arr[0];
                        element.info.uniqueBy = arr[1];
                    }
                    select.value = "";
                    break;
                }                
        }
        
        // elimino la schermata di proprietà e il sottofondo nero trasparente
        var shower = document.getElementById('blackScreen');
        var pc = document.getElementById('propertiesContainer');
        DP.util.removeNode(shower);
        pc.style.display = 'none';
        form.style.display = 'none';
        document.body.appendChild(pc);
        
        recalcOutput();
        
        DP.currentChange = undefined;  
    }
    
    function createFilter() {
        
        
        var div = document.createElement('div');
        div.setAttribute('class', 'input');
        div.style.marginBottom = '10px';
        div.style.display = '-webkit-inline-box';
        
        var imgDiv = document.createElement('div');
        imgDiv.style.marginRight = '14px';
        var img = document.createElement('img');
        img.src = "img/minus.png";
        img.width = "20";
        img.height = "20";
        img.style.marginTop = "11px";
        img.style.cursor = 'pointer';
        img.setAttribute('onclick',"this.parentNode.parentNode.style.display = 'none';");
        imgDiv.appendChild(img);
        
        var select = document.createElement('select');
        select.setAttribute('class', 'uniqueselector');
        select.style.borderRadius = '10px 0 0 10px';
        select.style.marginRight = '0px';
        
        var secSelect = document.createElement('select');
        secSelect.setAttribute('class', ' uniqueselector');
        secSelect.style.borderRadius = '1px';
        secSelect.style.width = '135px';
        secSelect.style.marginRight = '0px';
        
        var opt = document.createElement('option');
        opt.value = 'cnt';
        opt.innerHTML = 'contains';
        secSelect.appendChild(opt);        
        opt = document.createElement('option');
        opt.value = 'dnc';
        opt.innerHTML = 'does not contain';
        secSelect.appendChild(opt);
        opt = document.createElement('option');
        opt.value = 'is';
        opt.innerHTML = 'is';
        secSelect.appendChild(opt);
        
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('size', '30');
        input.setAttribute('name','name');
        input.value = '';
        input.style.width = '140px';
        
        div.appendChild(imgDiv);
        div.appendChild(select);
        div.appendChild(secSelect);
        div.appendChild(input);
        
        return div;
    }
    
    function addFilter() {
        
        var fc = document.getElementById('filterContainer'),
            filter;
        
        if (fc.children[0].style.display === 'none')
            filter = fc.children[0];
        
        else if (fc.children[1].style.display === 'none')
            filter = fc.children[1];
        
        else if (fc.children[2].style.display === 'none')
            filter = fc.children[2];
        
        else if (fc.children[3].style.display === 'none')
            filter = fc.children[3];
        
        if (!filter)
            return;
        
        filter.style.display = '-webkit-inline-box';
        filter.children[1].value = filter.children[1].options[0].value;
        filter.children[2].value = 'cnt';
        filter.children[3].value = '';
    }
    
    function hideFilter(filterid) {
        
        var filter = document.getElementById(filterid),
            fc = document.getElementById('filterContainer');
        
        if (!filter || !fc)
            return;
        
        DP.util.removeNode(filter);
        filter.style.display = 'none';
        
        
        fc.appendChild(filter);
        
    }
    
    function changeNodeColor(value) {
        var menu = document.getElementById('nodeProperties'),
            input = document.getElementById('inputColor');
        
        if (!menu)
            return;
        
        
        var node = menu.parentNode;
        
        if (node){
            node.style.backgroundColor = '#' + input.value;
            node.style.color = '#' + DP.util.getComplementary('#' + input.value);
        }
    }
    
    function showInfo(show){
        var infoMenu = document.getElementById('infoMenu'),
            currentType = (DP.selectedElement) ? DP.selectedElement.type : undefined;
        
        if (infoMenu || !show)
            DP.util.removeNode(infoMenu);
        
        if (show) {
            var infoMenu = document.createElement('div');
            var inner = document.createElement('div');
            
            inner.style.margin = '4px';
            
            infoMenu.setAttribute('id', 'infoMenu');
            
            if (currentType === 'pipeEnd')
                inner.innerHTML = 'Last element of the Pipe';
            else {
                var mod = moduli.findModule(currentType);
                
                if (mod)
                    inner.innerHTML = mod.desc;
            }
            
            infoMenu.style.left = event.x + 'px';
            infoMenu.style.top = (event.y + 20) + 'px';
            
            infoMenu.appendChild(inner);
            document.body.appendChild(infoMenu);
            event.stopPropagation();
        }
    }
    
    function removePipeElement() {
        
        var menu = document.getElementById('nodeProperties'),
            info = document.getElementById('infoMenu');
        
        if (!menu && !info)
            return;
        
        if (menu) {
            var id = menu.parentNode.id;
            var pe = DP.pipeElements.getPipeElement(id);
            
            while (pe.outputLinks[0] !== undefined)
                DP.util.removeLink(pe.outputLinks[0]);
            
            while (pe.inputLinks[0] !== undefined)
                DP.util.removeLink(pe.inputLinks[0]);
            
            DP.pipeElements.elements[id] = undefined;
            delete(DP.pipeElements.elements[id]);
            DP.util.removeNode(pe.domNode);
            DP.elementToMove = undefined;
            DP.selectedElement = undefined;
            
            document.body.appendChild(menu);
            menu.style.display = 'none';
            
            recalcOutput();
        }
        
        if (info)
            DP.util.removeNode(info);
    }
    
    function removeLink(link) {
        
        var input = link.inputNode.inputLinks,
            output = link.outputNode.outputLinks,
            el = link.link;
        
        for (var i = 0 ; i < input.length; i++)
            if (input[i] === link){
                input.splice(i,1);
                i--;
            }
        
        for (var i = 0; i < output.length; i++)
            if (output[i] === link){
                output.splice(i,1);
                i--;
            }
        
        var index = DP.pipeElements.links.indexOf(link);
        if (index !== -1)
            DP.pipeElements.links.splice(index, 1);
        
        DP.util.removeNode(el);
    }
    
    function showCutImage(link, dx, dy){
        
        var cur = document.getElementById('cutImage');
        
        if (cur) {
            cur.style.left = (dx - 20) + 'px';
            cur.style.top = (dy - 20) + 'px';
        }
        
        else {
            var img = document.createElement('div');
            img.setAttribute('id', 'cutImage');
            img.style.left = (dx - 20) + 'px';
            img.style.top = (dy - 20) + 'px';
            img.addEventListener('click', function(){
                DP.util.removeLink(link);
                DP.util.removeNode(img);
            });
            
            document.body.appendChild(img);   
        }
        
        DP.currentLink = link;
    }
    
    function fillSelector(selector, input, date) {
        selector.innerHTML = "";
        
        // Se devo fare il fill delle info per eventi
        if (input.indexOf(DP.utilvar.type.USER_SEQ) !== -1)
            DP.utilvar.fields.user_seq.each(function(el){
                var opt = new Option('U: ' + el,0);
                
                switch (el)
                {
                    case "Name":
                        {
                            opt.value = 'user firstName';
                            break;
                        }
                    case "Surname":
                        {
                            opt.value = 'user lastName';
                            break;
                        }
                    case "Gender":
                        {
                            opt.value = 'user gender';
                            break;
                        }
                    case "Birthday":
                        {
                            opt.value = 'user birthday';
                            break;
                        }
                    case "Hometown":
                        {
                            opt.value = 'user hometown';
                            break;
                        }
                }
                if (!date || el !== "Birthday")
                    selector.add(opt);
            });
        if (input.indexOf(DP.utilvar.type.EVENT_SEQ) !== -1) 
            DP.utilvar.fields.event_seq.each(function(el){
                var opt = new Option('E: ' + el,0);
                
                switch (el)
                {
                    case "Name":
                        {
                            opt.value = 'event name';
                            break;
                        }
                    case "Location":
                        {
                            opt.value = 'event location';
                            break;
                        }
                }
                
                selector.add(opt);;                
            });
        if (input.indexOf(DP.utilvar.type.FEED_SEQ) !== -1)
            DP.utilvar.fields.feed_seq.each(function(el){
                var opt = new Option('F: ' + el,0);
                
                switch (el)
                {
                    case "Author":
                        {
                            opt.value = 'feedrss author';
                            break;
                        }
                    case "Title":
                        {
                            opt.value = 'feedrss title';
                            break;
                        }
                    case "Publication date":
                        {
                            opt.value = 'feedrss publishedDate';
                            break;
                        }
                }
                
                if (!date || el !== "Publication date")
                    selector.add(opt);  
            });
        
    }
    
    /*
     * Riempie le proprietà dell'elemento corrente
     */
    function fillProperties(element) {
        
        // controllo il tipo di elemento pipe
        switch (element.type)
        {
            case 'facebook':
                {
                    if (element.info.query)
                        document.getElementById('facebooktext1').value = element.info.query;
                    if (element.info.queryType === 'Users')
                        document.getElementById('facebookradio1').checked = true;
                    else if (element.info.queryType === 'Events')
                        document.getElementById('facebookradio2').checked = true;
                    
                    break;
                }
            case 'google+':
                {
                    if (element.info.query)
                        document.getElementById('googletext1').value = element.info.query;
                    if (element.info.queryType === 'Users')
                        document.getElementById('googleradio1').checked = true;
                    else if (element.info.queryType === 'Events')
                        document.getElementById('googleradio2').checked = true;
                    
                    break;
                }
            case 'instagram':
                {
                    if (element.info.query)
                        document.getElementById('instagramtext1').value = element.info.query;
                    if (element.info.queryType === 'Users')
                        document.getElementById('instagramradio1').checked = true;
                    else if (element.info.queryType === 'Media')
                        document.getElementById('instagramradio2').checked = true;
                    
                    break;
                }
            case 'feedrss':
                {
                    if (element.info.url)
                        document.getElementById('feedrsstext1').value = element.info.url;
                    
                    break;
                }
            case 'head':
                {
                    if (element.info.number)
                        document.getElementById('headtext1').value = element.info.number;
                    
                    break;
                }
            case 'tail':
                {
                    if (element.info.number)
                        document.getElementById('tailtext1').value = element.info.number;
                    
                    break;
                }
            case 'sort':
                {
                    var selector = document.getElementById('sortselect');
                    fillSelector(selector, element.info.input);
                    if (element.info.sortBy)
                        document.getElementById('sortselect').value = element.info.sortBy;
                    if (element.info.sortOrder)
                        document.getElementById('sortselectOrder').value = element.info.sortOrder;
                    break;
                }
            case 'filter':
                {
                    var fc = document.getElementById('filterContainer'),
                        filter1 = document.getElementById('innerfilter1'),
                        filter2 = document.getElementById('innerfilter2'),
                        filter3 = document.getElementById('innerfilter3'),
                        filter4 = document.getElementById('innerfilter4');
                    
                    fillSelector(filter1.children[1], element.info.input, true);
                    fillSelector(filter2.children[1], element.info.input, true);
                    fillSelector(filter3.children[1], element.info.input, true);
                    fillSelector(filter4.children[1], element.info.input, true);
                    
                    // fill filter 1
                    if (element.info.filter1) {
                        filter1.children[1].value = element.info.filter1.field;
                        filter1.children[2].value = element.info.filter1.opt;
                        filter1.children[3].value = element.info.filter1.str;
                        filter1.style.display = '-webkit-inline-box';
                    }
                    else {
                        filter1.children[1].value = '';
                        filter1.children[2].value = 'cnt';
                        filter1.children[3].value = "";
                        filter1.style.display = 'none';
                    }
                    
                    // fill filter2
                    if (element.info.filter2) {
                        filter2.children[1].value = element.info.filter2.field;
                        filter2.children[2].value = element.info.filter2.opt;
                        filter2.children[3].value = element.info.filter2.str;
                        filter2.style.display = '-webkit-inline-box';
                    }
                    else {
                        filter2.children[1].value = '';
                        filter2.children[2].value = 'cnt';
                        filter2.children[3].v$alue = ""; 
                        filter2.style.display = 'none';
                    }
                    
                    // fill filter3
                    if (element.info.filter3) {
                        filter3.children[1].value = element.info.filter3.field;
                        filter3.children[2].value = element.info.filter3.opt;
                        filter3.children[3].value = element.info.filter3.str;
                        filter3.style.display = '-webkit-inline-box';                        
                    }
                    else {
                        filter3.children[1].value = '';
                        filter3.children[2].value = 'cnt';
                        filter3.children[3].value = "";       
                        filter3.style.display = 'none';
                    }
                    
                    // fill filter4
                    if (element.info.filter4) {
                        filter4.children[1].value = element.info.filter4.field;
                        filter4.children[2].value = element.info.filter4.opt;
                        filter4.children[3].value = element.info.filter4.str;
                        filter4.style.display = '-webkit-inline-box';                        
                    }
                    else {
                        filter4.children[1].value = '';
                        filter4.children[2].value = 'cnt';
                        filter4.children[3].value = "";  
                        filter4.style.display = 'none';
                    }
                    
                    if (!element.info.filter1 && !element.info.filter2 && !element.info.filter3 && !element.info.filter4)
                        fc.children[0].style.display = '-webkit-inline-box';
                    
                    if (element.info.type)
                        document.getElementById('filtertypeselect').value = element.info.type;
                    if (element.info.what)
                        document.getElementById('filterwhatselect').value = element.info.what;
                    
                    break;
                }
            case 'subelement':
                {
                    var selector = document.getElementById('subelementselect');
                    fillSelector(selector, element.info.input);
                    if (element.info.subBy)
                        document.getElementById('subelementselect').value = element.info.subBy;
                    
                    break;
                }
            case 'unique':
                {
                    var selector = document.getElementById('uniqueselect');
                    fillSelector(selector, element.info.input);
                    if (element.info.uniqueBy)
                        document.getElementById('uniqueselect').value = element.info.type + ' ' + element.info.uniqueBy;
                    
                    break;
                }
        }
        
        
    }
    
    function showLogin() {
        
        var shower = document.getElementById('blackScreen');
        
        if (shower)
            return;
        
        shower = document.createElement('div');
        shower.setAttribute('id', 'blackScreen');
        
        var loginScreen = document.createElement('div');
        
    }
    
    function addCheckmark(parentNode) {
        
        var doneImg = document.createElement('img');
        doneImg.setAttribute('src', 'img/ckmark.png');
        
        parentNode.appendChild(doneImg);
    }
    
    function isActiveModule(id) {
        return (DP.utilvar.activateModules.indexOf(id) === -1) ? false : true;
    }
    
    function activateModule(id) {
        
        if (!id)
            return false;
        
        // Se il modulo è già attivo
        if (DP.utilvar.activateModules.indexOf(id) !== -1)
            return false;
        
        var mods = moduli.menuItems[0].subs;
        
        for (var i = 0; i < mods.length; i++)
            if (mods[i].id === id) {
                if (mods[i].active) 
                    return false;
                else {
                    mods[i].active = true;
                    DP.utilvar.activateModules.push(id);
                    return true;
                }
            }
        return false;
    }
    
    function removeNode(node) {
        if ((node) && (node.parentNode))
            node.parentNode.removeChild(node);
    }
    
    /* Controlla se il secondo nodo è antenato del primo 
     *
     *
     * @param{PipeElement} node1 nodo1
     * @param{PipeElement} node2 nodo2
     * @return true se node2 è antenato di node1, false altrimenti
     */
    function isParent(node1, node2) {
        
        var result = false;
        
        for (var i = 0; i < node1.inputLinks.length; i++)
            if (node1.inputLinks[i].outputNode === node2)
                return true;
        else {
            result = result || isParent(node1.inputLinks[i].outputNode,node2);
            if (result)
                return result;
        }
        
        return false;
    }
    
    /* Estrae da array un nodo senza antenati in array
     *
     *
     * @param{Array} array di nodi in cui cercare
     */
    function extractRadix(array) {
        
        var hasParent;
        
        for (var i = 0; i < array.length; i++) {
            hasParent = false;
            
            for (var j = 0; j < array.length; j++) {
                if (i !== j) 
                    hasParent = hasParent || isParent(array[i], array[j]);
                
                if (hasParent)
                    break;
            }
            // Se non ho trovato parent, allora ho trovato la radice
            if (!hasParent)
                return array[i];
        }
        
        if (DP.utilvar.SHOW_ERROR)
            console.error("ERROR: Ciclo all'interno della Pipe");
    }
    
    function sortSecondarySources(array) {
        
        if (array.isEmpty())
            return;
        
        var radixNode,
            newArray = new Array(),
            i = 0,
            length = array.length;
        
        while(i < length) {
            radixNode = extractRadix(array);
            newArray[i] = radixNode;
            i++;
            array.splice(array.indexOf(radixNode),1);
        }
        
        return newArray;
    }
    
    
    
    function setScale() {
        
        DP.pipeElements.each(function(obj) {
            var el = obj.domNode;
            
            el.style.webkitTransform = "scale(0.5)";
            
            for (var i = 0; i < el.children.length; i++)
                el.children[i].style.webkitTransform = "scale(2)"
                });
        
        DP.pipeElements.zoomMode = true;
    }
    
    function removeScale() {
        
        var r = document.getElementsByClassName('pipeElement');
        
        DP.pipeElements.each(function(obj){
            var el = obj.domNode;
            
            el.style.webkitTransform = "";
            
            for (var i = 0; i <el.children.length; i++)
                el.children[i].style.webkitTransform = "";
        });
        
        DP.pipeElements.zoomMode = false;
    }
    
    /*
     * Validazione dell'input
     */
    function validate (evt, type) {
        var event = evt || window.event;
        var key = event.keyCode || event.which;
        key = String.fromCharCode( key );
        
        if (type === 'int')
            var regex = /[0-9]|\./;
        
        else
            return;
        
        if( !regex.test(key) ) {
            event.returnValue = false;
            if(event.preventDefault) 
                event.preventDefault();
            
            if (DP.utilvar.SHOW_ERROR)
                console.error('ERROR: Insert only numbers');
        }
    }
    
    // funzione di supporto per eliminare il contenuto della pagina
    function clearDocument(){
        if (confirm('Are you sure?')) {
            document.body.innerHTML = "";
            return true;
        }
        
        return false;
    }
    
    /* Controlla che un nodo sia linkato al pipeEnd
     *
     *
     */
    function linked(node1) {
        
        if (node1.type === 'pipeEnd')
            return true;
        
        for (var i = 0; i < node1.outputLinks.length; i++)
            if (linked(node1.outputLinks[i].inputNode))
                return true;
        
        return false;
    }
    
    /* Effettua il fetching asincrono delle sorgenti
     * e l'inizio dell'esecuzione
     *
     */
    function runPipe() {
        
        var bs = document.getElementById('blackScreen'),
            la = document.getElementById('loadingAnimation');
        
        DP.cancel = false;
        
        DP.data = {
            user: new Array(),
            event: new Array(),
            media: new Array(),
            feed: new Array()
        };
        
        
        if(bs)
            return;
        
        // Inserisco i nodi sorgente i cui dati
        // saranno utili ai fini della pipe in una
        // struttura dati
        DP.sources = new Array();
        DP.secondarySources = new Array();
        
        with (DP) {
            for (var k in pipeElements.elements){
                var node = pipeElements.getPipeElement(k);
                node.result = undefined;
                if (util.isSourceElement(node) && util.linked(node))
                    sources.push(node);
                else if (util.isSecondarySourceElement(node) && util.linked(node))
                    secondarySources.push(node);
            }
            
            // Se non vi sono sorgenti utili il risultato è vuoto
            if (sources.isEmpty()){
                
                DP.data = {
                    user: new Array(),
                    event: new Array(),
                    media: new Array(),
                    feed: new Array()
                }
                
                DP.util.showResults();   
                return;
            }
        }
        
        if (DP.secondarySources.length > 0)
            DP.secondarySources = DP.util.sortSecondarySources(DP.secondarySources);
        
        if (!DP.secondarySources)
            return;
        
        // funzione da richiamare quando un nodo sorgente ha 
        // eseguito il fetching dei dati async
        // se tutti i nodi hanno completato, inizio l'esecuzione
        // della pipe a ritroso a partire da pipeEnd
        function callbackSources() {
            
            if (DP.cancel)
                return;
            
            for (var i = 0; i < DP.sources.length; i++)
                if (!DP.sources[i].result)
                    return;
            
            if (DP.secondarySources.isEmpty())
                callbackSecondarySources();
            
            else 
                DP.getPipeData(DP.secondarySources[0], function(){
                    DP.secondarySources.splice(0,1);
                    callbackSecondarySources();
                });
        }
        
        function callbackSecondarySources() {
            
            if (DP.cancel)
                return;
            
            var thisFun = arguments.callee;
            // Se non ci sono più sorgenti secondarie da fetchare passo ad eseguire la pipe
            if (DP.secondarySources.length > 0) {
                DP.getPipeData(DP.secondarySources[0], function(){
                    DP.secondarySources.splice(0,1);
                    thisFun();
                });
                
                return;
            }
            
            var el = DP.pipeElements.getPipeElement('pipeEnd');
            
            if (!el) {
                if (DP.utilvar.SHOW_ERROR)
                    console.error('ERROR: No final pipe element found');
                return;
            }
            
            // Prendo il predecessore del nodo finale (se esiste)
            var inputNode = (el.inputLinks[0]) ? el.inputLinks[0].outputNode : undefined;
            
            // Richiamo la funzione ricorsiva per il fetching dei dati
            var data = (inputNode) ? DP.getPipeData(inputNode) : [];
            
            DP.data = {
                user: new Array(),
                event: new Array(),
                media: new Array(),
                feed: new Array()
            }
            
            // Inserisco i dati in una struttura utilizzata per mostrarli in output
            data.each(function(el){
                switch (el.type){
                    case "user":
                        {
                            DP.data.user.push(el);
                            break;
                        }
                    case "event":
                        {
                            DP.data.event.push(el);
                            break;
                        }
                    case "media":
                        {
                            DP.data.media.push(el);
                            break;                        
                        }
                    case "feedrss":
                        {
                            DP.data.feed.push(el);
                            break;
                        }
                }
            })
            
            var bs = document.getElementById('blackScreen'),
                la = document.getElementById('loadingAnimation');
            
            DP.util.removeNode(bs);
            DP.util.removeNode(la);
            la.style.display = 'none';
            document.body.appendChild(la);
            document.body.style.overflowY = 'scroll';
            
            DP.util.showResults();
            
            // Adesso il risultato finale è in data, da mostrare all'utente
            if (DP.utilvar.SHOW_EVENTS)
                console.log('EVENT: Obtained data');
        }
        
        
        // Aggiungo l'immagine di caricamento
        DP.util.removeNode(la);
        bs = document.createElement('div');
        bs.setAttribute('id', 'blackScreen');
        bs.appendChild(la);
        la.style.display = "";
        bs.style.backgroundColor = 'rgba(0, 0, 0, .5)'
        var cancel = document.createElement('div');
        cancel.setAttribute('id', 'cancelButton');
        document.getElementById('runButton').style.display = 'none';
        bs.appendChild(cancel);
        
        cancel.addEventListener('click', (function(){
            return function() {
                if (confirm('Do you really want to stop current Pipe?')) {
                    var la = document.getElementById('loadingAnimation');
                    DP.util.removeNode(bs);
                    document.getElementById('runButton').style.display = '';
                    document.body.appendChild(la);
                    DP.cancel = true;
                }
            }
        })());
        
        document.body.appendChild(bs);
        DP.sources.each(function(el){
            DP.getPipeData(el,callbackSources);
        });
    }
    
    function applyFilter(element, filters, what, type) {
        
        if (type === 'block') {
            
            // Blocco solo se si applica almeno un filtro con risultato positivo
            if (what === 'any') {
                for (var i = 0; i < filters.length; i++) {
                    var fld = filters[i].field.split(' ');
                    var type = fld[0],
                        field = fld[1];
                    
                    if (element.type !== type || !element[field])
                        continue;
                    
                    // se deve contenere e contiene, l'elemento è da bloccare
                    else if (filters[i].opt === 'cnt' && element[field].indexOf(filters[i].str) !== -1)
                        return false;
                    // se non deve contenere e non contiene, l'elemento è da bloccare
                    else if (filters[i].opt === 'dnc' && element[field].indexOf(filters[i].str) === -1)
                        return false;
                    // se deve essere uguale e lo è, l'elemento è da bloccare
                    else if (filters[i].opt === 'is' && element[field] === filters[i].str)
                        return false;
                }
                
                // l'elemento non è da eliminare altrimenti
                return true;
            }
            
            else if (what === 'all') {
                var j = 0;
                
                for (var i = 0; i < filters.length; i++) {
                    var fld = filters[i].field.split(' ');
                    var type = fld[0],
                        field = fld[1];
                    
                    if (element.type !== type)
                        j++;
                    
                    else if (!element[field] && filters[i].opt === 'cnt')
                        return true;
                        
                    else if (!element[field] && filters[i].opt === 'dnc')
                        j++
                    
                    // il filtro non è soddisfatto, quindi l'elemento deve passare
                    else if (!element[field] && filters[i].opt === 'is')
                        return true;
                    
                    // se deve contenere e non contiene, l'elemento non è da bloccare
                    else if (filters[i].opt === 'cnt' && element[field].indexOf(filters[i].str) === -1)
                        return true;
                    // se non deve contenere, ma contiene, l'elemento non è da bloccare
                    else if (filters[i].opt === 'dnc' && element[field].indexOf(filters[i].str) !== -1)
                        return true;
                    // se deve essere uguale, ma non lo è, l'elemento non è da bloccare
                    else if (filters[i].opt === 'is' && element[field] !== filters[i].str)
                        return true;
                }
                
                // se non ho applicato nessun filtro, l'elemento non è da bloccare
                if (j === filters.length)
                    return true;
                // altrimenti 
                else
                    return false;
            }
        }
        
        else if (type === 'permit') {
            
            if (what === 'any') {
                var j = 0;
                
                for (var i = 0; i < filters.length; i++) {
                    var fld = filters[i].field.split(' ');
                    var type = fld[0],
                        field = fld[1];
                    
                    if (element.type !== type)
                        j++;
                    
                    else if (!element[field] && filters[i].opt === 'cnt')
                        continue;
                        
                    else if (!element[field] && filters[i].opt === 'dnc')
                        return true;
                    
                    // il filtro non è soddisfatto, quindi l'elemento deve passare
                    else if (!element[field] && filters[i].opt === 'is')
                        continue;
                    
                    // se deve contenere e non contiene, l'elemento non è da bloccare
                    else if (filters[i].opt === 'cnt' && element[field].indexOf(filters[i].str) !== -1)
                        return true;
                    // se non deve contenere, ma contiene, l'elemento non è da bloccare
                    else if (filters[i].opt === 'dnc' && element[field].indexOf(filters[i].str) === -1)
                        return true;
                    // se deve essere uguale, ma non lo è, l'elemento non è da bloccare
                    else if (filters[i].opt === 'is' && element[field] === filters[i].str)
                        return true;
                }
                
                // se non ho applicato nessun filtro, l'elemento non è da bloccare
                if (j === filters.length)
                    return true;
                // altrimenti
                else
                    return false;
            }
            
            else if (what === 'all') {
                for (var i = 0; i < filters.length; i++) {
                    var fld = filters[i].field.split(' ');
                    var type = fld[0],
                        field = fld[1];
                    
                    if (element.type !== type)
                        continue;

                    else if (!element[field] && filters[i].opt === 'cnt')
                        return false;
                        
                    else if (!element[field] && filters[i].opt === 'dnc')
                        continue;
                    
                    // il filtro non è soddisfatto, quindi l'elemento deve passare
                    else if (!element[field] && filters[i].opt === 'is')
                        return false;                    
                    
                    // se deve contenere e non contiene, l'elemento non è da bloccare
                    else if (filters[i].opt === 'cnt' && element[field].indexOf(filters[i].str) === -1)
                        return false;
                    // se non deve contenere, ma contiene, l'elemento non è da bloccare
                    else if (filters[i].opt === 'dnc' && element[field].indexOf(filters[i].str) !== -1)
                        return false;
                    // se deve essere uguale, ma non lo è, l'elemento non è da bloccare
                    else if (filters[i].opt === 'is' && element[field] !== filters[i].str)
                        return false;
                }
                
                return true;            
            }
        }
        
    }
    
    function getSortFunction(type) {
        var infos = type.split(' ');
        var type = infos[0];
        var attr = infos[1];
        
        return function(a,b){
            
            if (a.type === type && b.type !== type)
                return -1;
            
            else if (a.type !== type && b.type === type)
                return 1;
            
            // Elementi dello stesso tipo, da confrontare
            else if (a.type === type && b.type === type){
                
                if (a[attr] === undefined && b[attr] === undefined)
                    return 0;
                
                else if (a[attr] === undefined && b[attr] !== undefined)
                    return 1;
                
                else if (a[attr] !== undefined && b[attr] === undefined)
                    return -1;
                
                else if (attr === 'publishedDate') {
                    if (DP.util.convertDate(a[attr],true) < DP.util.convertDate(b[attr], true))
                        return -1;
                    else return 1;
                }
                
                else if (a[attr] < b[attr])
                        return -1;
                
                else if (a[attr] > b[attr])
                    return 1;
                
                else return 0;
            }
            
            else return 0;
        };
    }
    
    /* Mostra i risultati ottenuti
     *
     *
     */
    function showResults() {
        
        var div1 = document.getElementById('resultsContainer');
        var div2 = document.getElementById('chooseResult');
        var mainTable = document.getElementById('mainTable');
        
        if (!div1 || !div2 || !mainTable){
            if (DP.utilvar.SHOW_ERROR)
                console.error('ERROR: Cannot find result window!');
            return;
            
        }
        
        mainTable.style.display = "none";
        div1.style.display = div2.style.display = "";
        document.body.style.overflowY = "scroll";
        
        if (DP.data && DP.data.user.length > 0)
            DP.util.showElements('user');
        else if (DP.data && DP.data.media.length > 0)
            DP.util.showElements('media');
        else if (DP.data && DP.data.event.length > 0)
            DP.util.showElements('event');
        else if (DP.data && DP.data.feed.length > 0)
            DP.util.showElements('feed');
        else DP.util.showElements('user');
    }
    
    function hideResults() {
        
        var div1 = document.getElementById('resultsContainer');
        var div2 = document.getElementById('chooseResult');
        var mainTable = document.getElementById('mainTable');
        var resultList = document.getElementById('resultList');
        
        if (!div1 || !div2 || !mainTable || !resultList){
            if (DP.utilvar.SHOW_ERROR)
                console.error('ERROR: Cannot find result window!');
            return;
            
        }
        
        mainTable.style.display = "";
        div1.style.display = div2.style.display = "none";
        document.body.style.overflow = "";
        resultList.innerHTML = "";
        
        // azzero tutti i risultati
        for (var k in DP.pipeElements.elements) {
            var node = DP.pipeElements.getPipeElement(k);
            if(node.result)
                node.result = undefined;
        }
        
        document.body.style.overflowY = '';
        document.getElementById('runButton').style.display = '';
    }
    
    /* Mostra i risultati di un determinato tipo
     *
     */
    function showElements(type) {
        
        var list = document.getElementById('resultList'),
            uS = document.getElementById('sceltauser'),
            eS = document.getElementById('sceltaevent'),
            mS = document.getElementById('sceltamedia'),
            fS = document.getElementById('sceltafeed');
        
        if(!type || !list)
            return;
        
        list.innerHTML = "";
        
        switch (type)
        {
            case 'user':
                {
                    DP.data.user.each(function(el){
                        var re = DP.util.createResultElement(el, 'user');
                        list.appendChild(re);
                    });
                    
                    uS.style.fontWeight = 'bold';
                    eS.style.fontWeight = '';
                    mS.style.fontWeight = '';
                    fS.style.fontWeight = '';
                    
                    break;
                }
            case 'event':
                {
                    DP.data.event.each(function(el){
                        var re = DP.util.createResultElement(el, 'event');
                        list.appendChild(re);
                    });
                    
                    uS.style.fontWeight = '';
                    eS.style.fontWeight = 'bold';
                    mS.style.fontWeight = '';
                    fS.style.fontWeight = '';
                    
                    break;         
                }
            case 'media':
                {
                    DP.data.media.each(function(el){
                        var re = DP.util.createResultElement(el, 'media');
                        list.appendChild(re);
                    });
                    
                    uS.style.fontWeight = '';
                    eS.style.fontWeight = '';
                    mS.style.fontWeight = 'bold';
                    fS.style.fontWeight = '';
                    
                    break;                
                }
            case 'feed':
                {
                    DP.data.feed.each(function(el){
                        var re = DP.util.createResultElement(el, 'feedRSS');
                        list.appendChild(re);
                    });
                    
                    uS.style.fontWeight = '';
                    eS.style.fontWeight = '';
                    mS.style.fontWeight = '';
                    fS.style.fontWeight = 'bold';
                    
                    break;                
                }
        }
        
        if (list.innerHTML === ''){
            var div = document.createElement('div');
            div.innerHTML = 'No ' + type + ' found';
            div.style.fontSize = '20px';
            div.style.textAlign = 'center';
            list.appendChild(div);
        }
    } 
    
    /* Crea un elemento div che descrive l'elemento el
     *
     * @param{User, Media, FeedRSS, Event} el oggetto da descrivere 
     */
    function createResultElement(el, type) {
        
        var list = document.getElementById('resultList');
        if (list)
            list.style.textAlign = '';
        
        switch (type)
        {
            case 'user':
                {
                    // Div contenente la foto
                    var div = document.createElement('div');
                    div.setAttribute('class', 'userResultElement');
                    div.addEventListener('click', (function(){
                        
                        var link = el.link;
                        
                        return function(){
                            var win = window.open(link, '_blank');
                            win.focus();
                        };
                        
                    })());
                    
                    // Immagine profilo
                    var img = document.createElement('div');
                    img.setAttribute('class', 'imageResult');
                    
                    if (el.source === 'facebook' && el.image === undefined)
                        facebookapi.getPhoto(el.id,function(link){
                            el.image = link;
                            img.style.backgroundImage = "url('" + link + "')"
                        });
                    else
                        img.style.backgroundImage = "url('" + el.image + "')"
                        
                        img.style.backgroundSize = "cover";
                    
                    div.appendChild(img);
                    var inDiv = document.createElement('div');
                    inDiv.style.display = "-webkit-inline-box";
                    var logo = document.createElement('img');
                    if (el.source === 'facebook')
                        logo.src = 'img/fblogo.png';
                    else if (el.source === 'instagram')
                        logo.src = 'img/instalogo.png';
                    else if (el.source === 'google')
                        logo.src = 'img/googlelogo.png';
                    logo.setAttribute('class', 'logo');
                    inDiv.appendChild(logo);
                    var name = document.createElement('div');
                    name.setAttribute('class', 'resultName');
                    
                    if (el.firstName === "" && el.lastName === "") {
                        name.innerHTML = 'No name specified';
                        name.style.color = 'white';
                    }
                    
                    else {
                        var toWrite = el.firstName + ' ' + el.lastName;
                        
                        if (toWrite.length > 20)
                            toWrite = toWrite.substring(0,19).trimRight().concat('..');
                        
                        name.innerHTML = toWrite;     
                    }
                    
                    inDiv.appendChild(name);
                    div.appendChild(inDiv);
                    break;
                }
            case 'event':
                {
                    var div = document.createElement('div');
                    div.setAttribute('class', 'eventResultElement');
                    div.addEventListener('click', (function(){
                        
                        var link = el.link;
                        
                        return function(){
                            var win = window.open(link, '_blank');
                            win.focus();                        
                        };
                        
                    })());
                    
                    
                    // contenitore del testo
                    var textContainer = document.createElement('div');
                    textContainer.style.display = "inline-block";
                    
                    var when = document.createElement('div');
                    when.setAttribute('class', 'resultEventSub');
                    if (el.startTime === undefined)
                        when.innerHTML = "";
                    else {
                        var spl = el.startTime.split('-');
                        var year = spl[0];
                        var mounth = spl[1];
                        spl = spl[2].split('T');
                        var day = spl[0];
                        if (spl[1]) {
                            spl = spl[1].split('+');
                            var time = spl[0];
                            when.innerHTML = day + '/' + mounth +'/' + year + ' - ' + time;
                        }
                        
                        else
                            when.innerHTML = day + '/' + mounth +'/' + year;
                    }
                    
                    when.style.marginBottom = '-4px';
                    when.style.fontSize = '14px';
                    textContainer.appendChild(when);
                    
                    var title = document.createElement('div');
                    title.setAttribute('class','resultEventName')
                    title.innerHTML = el.name !== undefined ? el.name : "Unnamed event";
                    //if (el.name && el.name.length >= 130)
                     //   div.style.height = '130px';
                    textContainer.appendChild(title);
                    
                    var subtitle = document.createElement('div');
                    subtitle.setAttribute('class', 'resultEventSub');
                    subtitle.innerHTML = el.location !== undefined ? "Location: " + el.location : "";
                    subtitle.style.marginBottom = '10px';
                    textContainer.appendChild(subtitle);
                    
                    div.appendChild(textContainer);
                    break;
                }
            case 'media':
                {
                    // Div contenente la foto
                    var div = document.createElement('div');
                    div.setAttribute('class', 'mediaResultElement');
                    
                    div.addEventListener('click', (function(){
                        
                        var link = el.link;
                        
                        return function(){
                            var win = window.open(link, '_blank');
                            win.focus();                        
                        };
                        
                    })());
                    
                    div.style.backgroundImage = "url('" + el.url + "')";
                    div.style.backgroundSize = "cover";
                    
                    var inDiv = document.createElement('div');
                    inDiv.style.display = "-webkit-inline-box";
                    
                    var logo = document.createElement('img');
                    if (el.source === 'facebook')
                        logo.src = 'img/fblogo.png';
                    else if (el.source === 'instagram')
                        logo.src = 'img/instalogo.png';
                    else if (el.source === 'google')
                        logo.src = 'img/googlelogo.png';
                    logo.setAttribute('class', 'logomedia');
                    inDiv.appendChild(logo);
                    
                    div.appendChild(inDiv);
                    break;                                    
                }
            case 'feedRSS':
                {
                    var list = document.getElementById('resultList');
                    if (list)
                        list.style.textAlign = 'center';
                    var div = document.createElement('div');
                    div.setAttribute('class','feedResultElement');
                    
                    div.addEventListener('click', (function(){
                        
                        var link = el.link;
                        
                        return function(){
                            var win = window.open(link, '_blank');
                            win.focus();                        
                        };
                        
                    })());
                    
                    var inDiv = document.createElement('div');
                    var title = document.createElement('div');
                    title.setAttribute('class','resultTitleFeed');
                    title.innerHTML = el.title;
                    inDiv.appendChild(title);
                    
                    var author = document.createElement('div');
                    author.setAttribute('class', 'resultTitleFeed');
                    author.style.marginTop = '4px';
                    author.style.fontSize = '12px';
                    if (el.author.length > 0)
                        author.innerHTML = el.author + ', ' + DP.util.convertDate(el.publishedDate);
                    else
                        author.innerHTML = DP.util.convertDate(el.publishedDate);
                    
                    inDiv.appendChild(author);
                    
                    
                    var content = document.createElement('div');
                    content.setAttribute('class','resultContentFeed');
                    content.innerHTML = el.contentSnippet;
                    inDiv.appendChild(content);
                    div.appendChild(inDiv);
                    
                    var source = document.createElement('div');
                    source.setAttribute('class','resultContentFeed');
                    source.style.marginTop = '0px';
                    source.style.marginBottom = '6px';
                    source.style.fontSize = '12px';
                    
                    source.style.textAlign = 'right';
                    source.innerHTML = el.source;
                    inDiv.appendChild(source);
                    
                    div.appendChild(inDiv);                    
                    break;
                }
        }
        
        return div;
    }
    
    /* Controlla se element è un elemento sorgente
     *
     * @param{PipeElement} element elemento da controllare
     */
    function isSourceElement(element) {
        
        var mod = moduli.findModule(element.type);
        
        if (mod && mod.source)
            return true;
        
        return false;
    }
    
    function isSecondarySourceElement(element){
        return (element.type === 'getmedia' || element.type === 'getuser')
    }
    
    /* Azzera tutte le informazioni su input e output
     * negli elementi della Pipe
     *
     */
    function clearIOInfo() {
        
        for (var i in DP.pipeElements.elements)
            if (!isSourceElement(DP.pipeElements.elements[i])) {
                DP.pipeElements.elements[i].info.input = [];
                DP.pipeElements.elements[i].info.output = []; 
            }
    }
    
    /* Ricalcola il tipo di output attraverso la pipe
     *
     */
    function recalcOutput() {
        
        clearIOInfo();
        
        for (var i in DP.pipeElements.elements) {
            if (isSourceElement(DP.pipeElements.elements[i]))
                propagateType(DP.pipeElements.elements[i], true);
        }
    }
    
    /* Propaga il tipo a partire da node
     *
     *
     * @param{PipeElement} node nodo da cui iniziare
     * @param{bool} isSource true se node è sorgente, false altrimenti
     */
    function propagateType(node, isSource) {
        
        // Se non c'è niente da settare
        if (node.info.output.isEmpty() && node.info.input.isEmpty())
            return;
        
        // Se non sono su un nodo sorgente setto in output il tipo giusto
        if (!isSource)
            switch (node.type)
            {
                    // getmedia ha in output solo media
                case "getmedia":
                    {
                        node.info.output = [DP.utilvar.type.MEDIA_SEQ];
                        
                        break;
                    }
                    // getuser ha in output solo user
                case "getuser":
                    {
                        node.info.output = [DP.utilvar.type.USER_SEQ];
                        
                        break;
                    }
                    // altrimenti l'output è l'input
                default:
                    {
                        node.info.output = node.info.input;
                        break;
                    }
            }
        
        node.outputLinks.each(function(el){
            el.inputNode.info.input = el.inputNode.info.input.concat(node.info.output).unique()
            propagateType(el.inputNode);
        });
    }
    
    return {
        colorToHex: colorToHex,
        getComplementary: getComplementary,
        convertDate: convertDate,
        // Gestione Pipe
        startNewPipe: startNewPipe,
        getPipeString: getPipeString,
        readBlob: readBlob,
        // Position
        getPosition: getposition,
        moveView: moveView,
        stopMoving: stopMoving,
        getTransform: getTransform,
        // Links
        createLink: createLink,
        drawLink: drawLink,
        addLink: addLink,
        updateLinks: updateLinks,
        existLink: existLink,
        // ID
        getNextId: getNextId,
        getNextZIndex: getNextZIndex,
        // Proprietà
        showProperties: showProperties,
        saveChange: saveChange,
        addFilter: addFilter,
        hideFilter: hideFilter,
        changeNodeColor: changeNodeColor,
        showInfo: showInfo,
        // Moduli
        addCheckmark: addCheckmark,
        isActiveModule: isActiveModule,
        activateModule: activateModule,
        // Gestione nodi
        linked: linked,
        isSourceElement: isSourceElement,
        isSecondarySourceElement: isSecondarySourceElement,
        removeNode: removeNode,
        removePipeElement: removePipeElement,
        removeLink: removeLink,
        showCutImage: showCutImage,
        // Topological sort
        sortSecondarySources: sortSecondarySources,
        // Scala
        setScale: setScale,
        removeScale: removeScale,
        // input
        validate: validate,
        // Run
        runPipe: runPipe,
        applyFilter: applyFilter,
        getSortFunction: getSortFunction,
        showResults: showResults,
        hideResults: hideResults,
        showElements: showElements,
        createResultElement: createResultElement
    };
}();