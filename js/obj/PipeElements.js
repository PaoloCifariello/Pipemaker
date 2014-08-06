/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */

(function() {
    
    /* struttura dati contenente informazioni sugli elementi pipe esistenti */
    DP.pipeElements = new PipeElementContainer();
    
    /* elemento attivo per lo spostamento */
    DP.elementToMove = undefined;
    
    /* connettore attivo */
    DP.attach = undefined;
    
    /*
     * Funzione che crea un elemento della pipe 
     * associato ad un elemento del DOM
     * 
     * @param {dom element} el nodo del DOM corrispondente
     * 
     */
    function PipeElement(el, type, name) {
        
        this.outputLinks = [];
        this.inputLinks = [];
        
        this.domNode = el;
        this.type = type;
        this.name = name;
        
        this.id = el.id;
        this.zoomMode = false;
        
        this.info = {
            input: new Array(),
            output: new Array()
        };
    }
    
    function PipeElementContainer() {
        
        /* 
         * Contenitore degli elementi della pipe
         * la hash map associa id di nodi del dom a elementi della pipe
         * in cui sono contenute le proprietà
         */
        this.elements = {};
        
        // Inizialmente lo zoom è disattivato
        this.zoomMode = false;
        
        /* Contenitore dei link tra elementi della pipe */
        this.links = new Array();
        
        /* aggiungo l'event handler per spostare elementi della pipe */
        document.body.addEventListener("mousemove", pipeElementMouseMoveHandler);
        
        /*
         * Crea un nuovo elemento da aggiungere alla pipe attuale
         * 
         * @param {dom node} element elemento del menu che è stato cliccato
         * 
         */
        this.createPipeElement = function(element, mod) {
            
            var pipeEditor = document.getElementById('pipeEditor');
            
            var el = document.createElement('div');
            // recupero l'oggetto di configurazione associato all'elemento scelto
            var obj = element ? DP.subMenu.getSubEntry(element.parentNode.id, element.id) : mod;
            
            /* ottengo un id per il nodo della forma 'tipo di nodo' + 'numero autoincrementale' 
             * (feedrss1, feedrss2 ...) 
             */
            el.setAttribute("id", DP.util.getNextId(obj.id));
            
            // Se sono in modalità scalata
            if (DP.pipeElements.zoomMode)
                el.style.webkitTransform = "scale(0.5)";
            
            /* Aggiungo l'elemento creato alla lista dei nodi presenti nella Pipe */
            var pipeEl = this.addPipeElement(el, obj.id, obj.name);
            
            /* Aggiungo i nodi di collegamento, se necessari, e quello di spostamento */
            if (obj.input) {
                var attach = document.createElement('div');
                
                if (DP.pipeElements.zoomMode)
                    attach.style.webkitTransform = "scale(2)";
                
                attach.setAttribute("class", "attach attachInput");
                attach.setAttribute("attachType", "input");
                attach.addEventListener("mousedown", pipeElementMousedownLinkHandler(pipeEl, obj.input, "input"), true);
                attach.addEventListener("mouseup", pipeElementMouseupLinkHandler(pipeEl, obj.input,  "input"));
                /* per evitare di spostare l'elemento della pipe quando in realtà si intende
                 * fare un collegamento tra elementi 
                 */
                attach.addEventListener("mousedown", function() {
                    event.stopPropagation();
                }, true);
                
                el.appendChild(attach);
            }
            
            if (obj.output) {
                var attach = document.createElement('div');
                
                if (DP.pipeElements.zoomMode)
                    attach.style.webkitTransform = "scale(2)";
                
                attach.setAttribute("class", "attach attachOutput");
                attach.setAttribute("attachType", "output");
                attach.addEventListener("mousedown", pipeElementMousedownLinkHandler(pipeEl, obj.output, "output"), true);
                attach.addEventListener("mouseup", pipeElementMouseupLinkHandler(pipeEl, obj.output, "output"));
                /* per evitare di spostare l'elemento della pipe quando in realtà si intende
                 * fare un collegamento tra elementi 
                 */
                attach.addEventListener("mousedown", function() {
                    event.stopPropagation();
                }, true);
                el.appendChild(attach);
                
            }
            
            if (obj.class)
                el.setAttribute("class", "pipeElement " + obj.class);
            else {
                el.setAttribute("class", "pipeElement");
                el.style.backgroundColor = DP.utilvar.color.DEFAULT_STANDARD_COLOR;
                var div = document.createElement('div');
                el.style.color = '#' + DP.util.getComplementary(DP.utilvar.color.DEFAULT_STANDARD_COLOR);
                div.setAttribute('type', 'name');
                div.innerText = obj.name;
                el.appendChild(div);
            }
            
            /* Assegno il nuovo z-index in modo che il nodo sia a top level */
            el.style.zIndex = DP.util.getNextZIndex();
            
            /* Aggiungo gli handler per spostare il nodo */
            el.addEventListener("mousedown", pipeElementMouseDownHandler, false);
            el.addEventListener("mouseup", pipeElementMouseUpHandler, false);
            el.addEventListener('mouseover', pipeElementMouseOverHandler);
            el.addEventListener('mouseout', pipeElementMouseOutHandler);
            
            DP.lastElement = el;
            
            pipeEditor.appendChild(el);
            return pipeEl;
        };
        
        
        /*
         * Funzione per la creazione dell'ultimo stadio della pipe
         * 
         * @returns {}
         */
        this.addFinalPipeElement = function() {
            
            var pipeEditor = document.getElementById('pipeEditor');
            var el = document.createElement('div');
            el.setAttribute('id', 'pipeEnd');
            el.style.backgroundColor = DP.utilvar.color.DEFAULT_END_COLOR;
            
            // Se sono in modalità scalata
            if (DP.pipeElements.zoomMode)
                el.style.webkitTransform = "scale(0.5)";
            
            var attach = document.createElement('div');
            
            if (DP.pipeElements.zoomMode)
                attach.style.webkitTransform = "scale(2)";
            
            /* Aggiungo l'elemento creato alla lista dei nodi presenti nella Pipe */
            var pipeEl = this.addPipeElement(el, el.id, 'Pipe end');
            
            attach.setAttribute("class", "attach attachInput");
            attach.setAttribute("attachType", "input");
            attach.addEventListener("mousedown", pipeElementMousedownLinkHandler(pipeEl, 1, "input"), true);
            attach.addEventListener("mouseup", pipeElementMouseupLinkHandler(pipeEl, 1, "input"));
            /* per evitare di spostare l'elemento della pipe quando in realtà si intende
             * fare un collegamento tra elementi 
             */
            attach.addEventListener("mousedown", function() {
                event.stopPropagation();
            }, true);
            el.appendChild(attach);
            
            el.setAttribute("class", "pipeElement" );
            
            /* Assegno il nuovo z-index in modo che il nodo sia a top level */
            el.style.zIndex = DP.util.getNextZIndex();
            el.style.color = '#' + DP.util.getComplementary(DP.utilvar.color.DEFAULT_END_COLOR);
            
            var div = document.createElement('div');
            div.setAttribute('type', 'name');
            div.innerText = 'Pipe end';
            el.appendChild(div);
            
            /* Aggiungo gli handler per spostare il nodo */
            el.addEventListener("mousedown", pipeElementMouseDownHandler);
            el.addEventListener("mouseup", pipeElementMouseUpHandler, true);
            el.addEventListener('mouseover', pipeElementMouseOverHandler);
            el.addEventListener('mouseout', pipeElementMouseOutHandler);
            
            el.style.left = ( pipeEditor.offsetWidth - DP.utilvar.info.PIPE_ELEMENT_WIDTH ) / 2 + 'px';
            el.style.top = pipeEditor.offsetHeight - 38 - DP.utilvar.info.PIPE_ELEMENT_HEIGHT + 'px';
            el.style.opacity = "1";
            
            pipeEditor.appendChild(el);
        };
        
        this.addPipeElement = function(element, type, name) {
            var el = new PipeElement(element, type, name);
            DP.pipeElements.elements[element.id] = el;
            
            if (DP.utilvar.SHOW_EVENTS)
                console.log('EVENT: Pipe element ' + element.id + ' has been created.');
            
            return el;
        };
        
        this.getPipeElement = function(id) {
            return DP.pipeElements.elements[id];
        };
        
        this.clearPipe = function() {
            this.elements = {};
            this.links = new Array();
            
            this.addFinalPipeElement();
        };
        
        this.each = function(callback) {
            for (var k in this.elements)
                callback(this.elements[k]);
        }
    }
    
    /*
     * Handler per quando viene cliccato un elemento della pipe
     * 
     */
    function pipeElementMouseDownHandler() {
        
        var info = document.getElementById('infoMenu'),
            event = (event || arguments[0]);
        
        if (info)
            DP.util.removeNode(info);
        
        if (DP.lastElement)
            return;
        
        if (event.target === this || (this.contains(event.target) && event.target.getAttribute('type') === 'name')) {
            
            if (event.button === 0) {
                this.style.zIndex = DP.util.getNextZIndex();
                this.style.opacity = "";
                
                var el = DP.pipeElements.getPipeElement(this.id);
                
                if (el)
                    DP.util.updateLinks(el, false);
                
                DP.elementToMove = {element: this, startx: event.clientX, starty: event.clientY, moved: false};
            }
        }
    }
    
    /*$
     * Aggiungo l'handler sul document, 
     * per quando viene trascinato un elemento fuori dall'editor
     */
    (function() {
        document.addEventListener('mouseup', pipeElementMouseUpHandler, false);
        document.addEventListener('mouseover', function() {
            
            var menu = document.getElementById('nodeProperties'),
                info = document.getElementById('infoMenu'),
                event = (event || arguments[0]);
            
            if (!DP.onMenu && menu.style.display !== 'none' && event.target !== document.getElementById('nodeProperties')
                && (!jscolor.picker || !document.contains(jscolor.picker.boxB))) {
                menu.style.display = 'none';
                DP.util.removeNode(menu);
                DP.util.removeNode(info);
                document.body.appendChild(menu);
                DP.selectedElement = undefined;
            }
        });
        
        document.getElementById('pipeEditor').addEventListener('mouseup', function(){
            var menu = document.getElementById('nodeProperties');
            if (DP.selectedElement && document.getElementById('inputColor') !== event.toElement) {
                DP.selectedElement = undefined;
                menu.style.display = "none";
                DP.util.removeNode(menu);
                document.body.appendChild(menu);
            }
        }, false);
        
        document.getElementById('nodeProperties').addEventListener('mouseover', function(){            
            var event = (event || arguments[0]);
            DP.onMenu = true;
            event.stopPropagation();
        }, true);
        
        document.getElementById('nodeProperties').addEventListener('mouseout', function(){   
            var event = (event || arguments[0]);
            DP.onMenu = false;
            event.stopPropagation();
        }, true);
    })();
    
    /*
     * Handler per quando viene spostato un elemento della pipe
     * 
     */
    function pipeElementMouseMoveHandler() {
        
        var sel = DP.subMenu.elements,
            tM = document.getElementById('toolsList'),
            cI = document.getElementById('cutImage'),
            event = (event || arguments[0]);
        
        if (tM && event.target !== tM && !tM.contains(event.target))
            for (var i = 0; i < sel.length; i++)
                if (!DP.subMenu.onSubMenu(event.x, event.y))
                    DP.subMenu.setState(i, false, true);
        
        if (!DP.attach && event.target.tagName === 'path') {
            with (DP.pipeElements) {    
                for (var i = 0; i < links.length; i++)
                    if (links[i].link === event.target)
                        DP.util.showCutImage(links[i], event.x, event.y);
            }
        }
        
        else if (event.target !== cI){
            DP.util.removeNode(cI);
            DP.currentLink = undefined;
        }
        
        if (DP.elementToMove) {
            var el = DP.elementToMove.element;
            var pipeEditor = document.getElementById('pipeEditor');
            
            var dx = event.clientX - DP.elementToMove.startx;
            var dy = event.clientY - DP.elementToMove.starty;
            
            var oldLeft = parseInt(el.style.left);
            var oldTop = parseInt(el.style.top);
            var delta = DP.util.getTransform(el);
            
            var newLeft = oldLeft + dx;
            var newTop = oldTop + dy;
            
            DP.elementToMove.startx = event.clientX;
            DP.elementToMove.starty = event.clientY;
            
            if (dx !== 0 || dy !== 0)
                DP.elementToMove.moved = true;
            
            DP.util.updateLinks(DP.pipeElements.getPipeElement(el.id), false);
            
            el.style.left = newLeft + "px";
            el.style.top = newTop + "px";
        }
        
        /*
         * Se sto creando un link
         * lo modifico dinamicamente
         */
        else if (DP.attach) {
            DP.util.removeNode(DP.attach.link);
            
            var linkContainer = document.getElementById('pipeLinks');
            
            var link = DP.util.drawLink(
                DP.attach.x,
                DP.attach.y,
                event.clientX - DP.utilvar.info.SVG_LEFT_MARGIN,
                event.clientY - DP.utilvar.info.SVG_TOP_MARGIN,
                false);
            
            linkContainer.appendChild(link);
            
            DP.attach.link = link;
        }
    }
    
    /*
     * Handler per quando viene rialzato il tasto del mouse dopo aver 
     * cliccato un elemento della pipe
     * 
     */
    function pipeElementMouseUpHandler() {
        
        var event = (event || arguments[0]);
        
        if (DP.elementToMove !== undefined) {
            DP.elementToMove.element.style.opacity = "1";
            
            var el = DP.pipeElements.getPipeElement(DP.elementToMove.element.id);
            
            if (el) {
                DP.util.updateLinks(el, true);
                
                // in caso non abbia mosso l'elemento, mostro il menu'
                if (!DP.elementToMove.moved)
                    DP.util.showProperties(DP.pipeElements.getPipeElement(this.id)); 
                
                if (DP.utilvar.SHOW_EVENTS)
                    console.log('EVENT: Pipe element ' + DP.elementToMove.element.id + ' has been moved to ' + '(' + DP.elementToMove.startx + ',' + DP.elementToMove.starty + ')');
                
                DP.elementToMove = undefined;
            }
        }
        
        // Se l'evento è destinato al pipe element o al div in esso contenuto
        // col nome allora fermo la propagazione per non far sparire il menù
        if ((event.target === this || (this.contains(event.target) && event.target.getAttribute('type') === 'name')) 
            && !DP.attach)
            event.stopPropagation();
    }
    
    function pipeElementMouseOverHandler() {
        
        var current = DP.pipeElements.getPipeElement(this.id),
            menu = document.getElementById('nodeProperties'),
            inputColor = document.getElementById('inputColor'),
            event = (event || arguments[0]);
        
        if (current === DP.selectedElement){
            event.stopPropagation();
            return;
        }
        
        DP.selectedElement = current;
        var domNode = current.domNode;
        domNode.appendChild(menu);
        menu.style.display = "";
        menu.children[0].innerHTML = current.name;
        
        if (DP.util.isSourceElement(current))
            menu.children[1].children[1].style.display = 'none';
        else {
            menu.children[1].children[1].style.display = '';
            inputColor.setAttribute('value', DP.util.colorToHex(domNode.style.backgroundColor));
            inputColor.color.fromString(DP.util.colorToHex(domNode.style.backgroundColor));
        }
        
        if (current.id === 'pipeEnd')
            menu.children[1].children[2].style.display = 'none';
        else 
            menu.children[1].children[2].style.display = '';
        
        event.stopPropagation();         
    }
    
    function pipeElementMouseOutHandler() {
        
        return;
        if (!DP.onMenu) {
            var menu = document.getElementById('nodeProperties');
            
            
            DP.selectedElement = undefined;
            DP.util.removeNode(menu);
            
            document.body.appendChild(menu);
            menu.style.display = 'none';
        }
    }
    
    function pipeElementMousedownLinkHandler(element, maxLinks, attachType) {
        
        return function() {
            
            if (attachType === 'input' && element.inputLinks.length >= maxLinks){
                if (DP.utilvar.SHOW_ERROR)
                    console.error("ERROR: Node " + element.id + " can't have more than " + maxLinks + " input links");
                return;
            }
            
            
            if (attachType === 'output' && element.outputLinks.length >= maxLinks) {
                if (DP.utilvar.SHOW_ERROR)
                    console.error("ERROR: Node " + element.id + " can't have more than " + maxLinks + " output links");
                return;
            }
            
            var pos = DP.util.getPosition(this, pipeEditor);
            
            var dx = this.offsetWidth / 2;
            var dy = this.offsetHeight / 2;
            
            var linkContainer = document.getElementById('pipeLinks');
            
            var delta = DP.util.getTransform(this.parentNode);
            
            
            var link = DP.util.drawLink(pos.left + dx + delta.dx, 
                                        pos.top + dy + delta.dy,
                                        pos.left + dx + delta.dx,
                                        pos.top + dy + delta.dy, 
                                        false);
            
            linkContainer.appendChild(link);
            
            if (attachType === 'output')
                DP.attach = {
                    node: this,
                    type: attachType, 
                    x: pos.left + dx + delta.dx,
                    y: pos.top + delta.dy,
                    link: link};
            else
                DP.attach = {
                    node: this,
                    type: attachType,
                    x: pos.left + dx + delta.dx, 
                    y: pos.top + 2 * dy + delta.dy,
                    link: link};
        };
    }
    
    function pipeElementMouseupLinkHandler(element, maxLinks, attachType) {
        
        return function() {
            
            /*
             * Se ho selezionato in precedenza un attach differente 
             * da quello su cui sono ora (es. prima input poi output
             * allora creo il collegamento
             */
            if ((DP.attach) && (DP.attach.type !== attachType)) {
                
                if (attachType === 'input' && element.inputLinks.length >= maxLinks){
                    if (DP.utilvar.SHOW_ERROR)
                        console.error("ERROR: Node " + element.id + " can't have more than " + maxLinks + " input links");
                    return
                }
                
                if (attachType === 'output' && element.outputLinks.length >= maxLinks) {
                    if (DP.utilvar.SHOW_ERROR)
                        console.error("ERROR: Node " + element.id + " can't have more than " + maxLinks + " output links");
                    return;
                }
                
                // rimozione del vecchio link
                DP.util.removeNode(DP.attach.link);
                
                // i due elementi pipe
                var pipeEl1 = DP.pipeElements.elements[DP.attach.node.parentNode.id];
                var pipeEl2 = DP.pipeElements.elements[this.parentNode.id];
                
                // controllo se il link esiste già
                if (!pipeEl1 || !pipeEl2 || DP.util.existLink(pipeEl1, pipeEl2)) {
                    if (DP.utilvar.SHOW_ERROR)
                        console.error('ERROR: link between ' + pipeEl1.domNode.id + ' and ' + pipeEl2.domNode.id + ' already exists!');
                    return;
                }
                
                if (attachType === 'input')
                    DP.util.createLink(pipeEl2,pipeEl1);
                else
                    DP.util.createLink(pipeEl1,pipeEl2);
            }
            
            // Se attach è definito lo elimino
            else if (DP.attach) {
                DP.util.removeNode(DP.attach.link);
                DP.attach = undefined;
                
                if (DP.utilvar.SHOW_ERROR)
                    console.error("ERROR: Can't attach two attach of type " + attachType);
            }
        };
    }
})();