/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */

(function(){
    
    document.body.addEventListener('keyup', InputSwitch);
    document.body.addEventListener('keydown', moveViewSwitch);
    
    function moveViewSwitch() {
        
        var bs = document.getElementById('blackScreen'),
            res = ((res = document.getElementById('resultsContainer')) !== undefined) ? (res.style.display !== 'none') : false ; 
        
        var event = (event || arguments[0]);
        
        function removeEl(){ 
            var cI = document.getElementById('cutImage'),
                nP = document.getElementById('nodeProperties'),
                iM = document.getElementById('infoMenu');
            
            if (nP) { 
                nP.style.display = 'none';
                DP.util.removeNode(nP);
                document.body.appendChild(nP);
                DP.selectedElement = undefined;
            }
            
            if (iM)
                DP.util.removeNode(iM);
            
            if (cI)
                DP.util.removeNode(cI);
            
        }
        
        switch (event.keyCode)
        {
            case 65:
                {
                    if (!bs && !res) {
                        DP.movingView = true;
                        DP.util.moveView('left', false);
                        removeEl();
                        break;
                    }
                }
            case 83:
                {
                    if (!bs && !res) {
                        DP.movingView = true;
                        DP.util.moveView('down', false);
                        removeEl();
                        break;    
                    }
                }
            case 68:
                {
                    if (!bs && !res) {
                        DP.movingView = true;
                        DP.util.moveView('right', false);
                        removeEl();                        
                        break;    
                    }
                }
            case 87:
                {
                    if (!bs && !res) {
                        DP.movingView = true;
                        DP.util.moveView('up', false);
                        removeEl();                        
                        break;    
                    }
                }
        }
    }
    
    function InputSwitch(){
        
        var event = (event || arguments[0]);
        DP.movingView = false;
        
        switch (event.keyCode)
        {
                /* Premuto ESC */
            case 27:
                {
                    escape();
                    break;
                } 
        }
    }
    
    /*
     * Handler per quando viene premmuto 'esc'
     */
    function escape(){
        var shower = document.getElementById('showerProperties');
        DP.util.removeNode(shower);
    }
    
})();