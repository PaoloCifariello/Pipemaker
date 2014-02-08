/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */


/* 
 * 
 * gestione eventi dell'editor
 * 
 */

var addEditorEvent = (function() {
    
    /*
     * Setta l'handler di click sugli elementi dei sub menu
     * 
     */
    function setHandlerSubMenuElement() {
        
        var subs = document.getElementsByClassName("subElement");
        
        for (var i = 0; i < subs.length; i++){
            var modulo = moduli.findModule(subs[i].getAttribute('id'));
            // Se è un elemento di esempio scelgo un event listener appropriato
            if (modulo && modulo.example){
                subs[i].addEventListener('click',function() {
                    if (confirm("Eliminare la pipe corrente per caricare la nuova pipe?")){
                        var diagram = JSON.parse(moduli.findModule(this.getAttribute('id')).diagram);
                        DP.util.startNewPipe(diagram);
                    }
                });
            }
            // altrimenti di default creo un nuovo elemento pipe
            else 
                subs[i].addEventListener('click', function() {

                    var index = DP.subMenu.getIndex(this.parentNode);
                    DP.pipeElements.createPipeElement(this);
                    
                    if (typeof (index) === 'number')
                        DP.subMenu.setState(index, false, true);
                    
                }, false);
        }
    }
    
    /*
     * 
     * Eventi sull'editor
     * 
     */
    function setHandlerEditor() {
        
        var pipeEditor = document.getElementById('pipeEditor');
        
        pipeEditor.addEventListener('mousemove', function(pos) {
            if (DP.lastElement) {
                
                var left = pipeEditor.offsetLeft;
                var top = pipeEditor.offsetTop;
                
                var newLeft = pos.clientX - left - 50;
                var newTop = pos.clientY - top - 25;
                
                DP.lastElement.style.left = newLeft + "px";
                
                DP.lastElement.style.top = newTop + "px";
                
                
            }
        }, false);
        
        pipeEditor.addEventListener('click', function() {
            if (DP.lastElement) {
                DP.lastElement.style.opacity = 1;
                DP.lastElement = undefined;
            }
            
        }, false);
        
        /*
         * Mouse up sull'editor
         */
        pipeEditor.addEventListener('mouseup', function() {
            if (DP.attach) {
                DP.util.removeNode(DP.attach.link);
                DP.attach = undefined;
            }
            
        }, false);
        
        document.getElementById('deleteNode').addEventListener('mouseup', DP.util.removePipeElement, false);
    }
    
    /*
     * eventi sui bottoni
     * 
     */
    function setHandlerButton() {
        
        var btn = document.getElementById('newPipeButton');
        btn.addEventListener('mouseup', function() {
            if (confirm("Sei sicuro di voler eliminare la Pipe corrente?"))
                DP.util.startNewPipe();
        }, false);
        
        /*
        btn = document.getElementById('normalView');
        btn.addEventListener('click', function() {
            DP.util.removeScale();
        }, false);
        
        btn = document.getElementById('zoomView');
        btn.addEventListener('click', function() {
            DP.util.setScale();
        }, false);
        */
        
        btn = document.getElementById('saveButton');
        btn.addEventListener('mouseup', function() {
            var file = new Blob([DP.util.getPipeString()], {type: "text/plain;charset=utf-8"});
            saveAs(file, "MyPipe.txt");
        }, false);
        
        btn = document.getElementById('files');
        btn.addEventListener('change', function(){
            DP.util.readBlob();
        }, false);
        
        btn = document.getElementById('runButton');
        btn.addEventListener('mouseup',function(){
            if (event.button === 0)
                DP.util.runPipe();
        }, false);
    }
    
    
    /*
     * 
     * Setta i vari handler:
     * 
     * - sugli elementi dei sub menu
     * - sull'editor
     * - sui bottoni
     * 
     */
    function setHandler() {
        
        /*
         * click su un elemento del submenu 
         */
        setHandlerSubMenuElement();
        
        /*
         * eventi di mousemove e click
         * sull'editor di Pipe
         */
        setHandlerEditor();
        
        /*
         * eventi sui bottoni
         */
        setHandlerButton();
    }
    
    return  setHandler;
})();