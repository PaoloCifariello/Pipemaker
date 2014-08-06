/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */

/* 
 * 
 * aggiunta eventi al menu principale
 * 
 */

var setHandlerMenu = (function() {

    /*
     * 
     * controlla se le coordinate (x,y) si trovano sul menu el o su un suo sottomenu
     * altrimenti viene restituito false.
     * 
     */
    function onMenu(el, x, y) {
        var horiz = x <= (el.offsetLeft + el.offsetWidth);
        var vert = y <= (el.offsetTop + el.offsetHeight);

        return (!horiz || vert);
    }

    /*
     * setta gli handler per i submenu
     * di mouseover e mouseout
     * per lo scorrimento
     * sfruttando una struttura dati 'subMenu'
     */
    function setHandlerMenu() {

        var menu = $('#toolsList');
        var childs = menu.children();

        for (var i = 0; i < childs.length; i++) {
            
            DP.subMenu.add(childs[i].firstElementChild, i);

            childs[i].addEventListener('mouseover', function(index) {
                return function() {
                    var event = (event || arguments[0]);
                    /* 
                     * Se non sono sotto al menu'
                     * per essere sicuri che l'evento non sia stato scatenato da un sotto menu
                     * e se non sto spostando alcun elememnt 
                     * rendo visibile il sottomenu evidenziato
                     */
                    if (onMenu(this.parentNode, event.clientX, event.clientY) && !DP.lastElement && !DP.elementToMove && !DP.attach )
                        DP.subMenu.setState(index, true);
                };

            }(i), true);
        }           
    }

    return setHandlerMenu;

})();