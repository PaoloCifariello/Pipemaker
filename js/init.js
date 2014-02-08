/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */


/*

!!!TODO!!!

-   Implementare la rimozione di archi
-   Abbellire la UI (mettere scritta Load sul pulsante, barra del titolo, colori barra opzioni,
    schermata di scelta social, )

!Maybe!

---

!!!BUGS!!!

---

*/


/* 
 * Init script
 * 
 * adds menu and sub-menu
 */
var createMenu = (function() {
    
    /*
     * crea un elemento del submenu
     */
    function createSubMenuEntry(entry) {
        
        var listEl, span;
        
        listEl = document.createElement('li');
        span = document.createElement('span');
        
        with (listEl) {
            setAttribute("id", entry.id);
            setAttribute("class", "subElement");
        }
        
        with (span) {
            className = "elementContainerClass elementClass";
            innerText = entry.name;
            
            if (entry.desc)
                title = entry.desc;
        }
        
        listEl.appendChild(span);
        
        return listEl;
    }
    
    /* 
     * crea il submenu
     */
    function createSubMenu(elements, parentId) {
        
        var list = document.createElement('ul');
        list.setAttribute("id", parentId);
        
        list.style.display = "none";
        list.style.left = "0%";
        list.style.opacity = "0";
        
        elements.each(function(el){
            if ((el.active) || (el.dependencies && DP.utilvar.activateModules.hasSubArray(el.dependencies))) {
                var subEntry = createSubMenuEntry(el);
                list.appendChild(subEntry);
            }   
        });
        
        return list;
    }
    
    /* 
     * crea un'entry del menu' 
     */
    function createMenuEntry(item, last) {
        
        var menuEntry = document.createElement('li');
        
        var span = document.createElement('span');
        
        with (span) {
            className = "elementContainerClass";
            
            /*
             *  se e' l'ultimo elemento aggiungo la classe ultimo elemento
             *  per i bordi arrotondati 
             */
            if (last)
                className += " lastElementContainerClass";
            
            innerText = item.name;
            
            //if (item.desc)
              //  title = item.desc;
        }
        
        
        var subMenu = createSubMenu(item.subs, item.id);
        
        menuEntry.appendChild(subMenu);
        menuEntry.appendChild(span);
        
        
        var list = document.getElementById('toolsList');
        
        if (list)
            list.appendChild(menuEntry);
    }
    
    /* 
     * crea il menu' a partire dagli elementi in moduli  
     */
    function createMenu() {
        
        var loginScreen = document.getElementById('blackScreen');
        
        if (loginScreen)
            loginScreen.parentNode.removeChild(loginScreen);
        
        var lista = document.createElement('ul');
        lista.id = "toolsList";
        
        var container = document.getElementById('toolsMenu');
        container.appendChild(lista);
        
        
        
        with (moduli) {
            menuItems.each(function(item){
                if (menuItems.lastElement() === item)
                    createMenuEntry(item, true);
                else
                    createMenuEntry(item);
            });
        }
        
        /* Setto gli handler per il menu */
        setHandlerMenu();
        
        /* Setto gli handler per l'editor */
        addEditorEvent();
        
        document.getElementById('mainTable').style.display = "";
        DP.pipeElements.addFinalPipeElement();
    }
    
    return createMenu;
})();