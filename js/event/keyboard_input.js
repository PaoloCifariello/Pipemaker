/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */

(function(){
    
    $(document.body).keyup(InputSwitch);
    $(document.body).keydown(moveViewSwitch);
    
    function moveViewSwitch() {
        
        var bs = document.getElementById('blackScreen'),
            res = ((res = $('#resultsContainer')).length) ? (res.css('display') !== 'none') : false ; 
        
        var event = (event || arguments[0]);
        
        function removeEl(){ 
            var cI = $('#cutImage'),
                nP = $('#nodeProperties'),
                iM = $('#infoMenu');
            
            if (nP) { 
                nP.css('display', 'none');
                nP.remove();
                $(document.body).append(nP);
                DP.selectedElement = undefined;
            }
            
            if (iM)
                iM.remove();
            
            if (cI)
                cI.remove();
            
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
        $('#showerProperties').remove();
    }
    
})();