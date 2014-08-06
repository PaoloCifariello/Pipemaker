/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
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
        
        listEl = $('<li>', {id: entry.id, class : 'subElement' });
        span = $('<span>', { class: 'elementContainerClass elementClass'});
        
        span.text(entry.name);
        
        if (entry.desc)
            span.attr('title', entry.desc);
        
        listEl.append(span);
        return listEl;
    }
    
    /* 
     * crea il submenu
     */
    function createSubMenu(elements, parentId) {
        
        var list = $('<ul>', { id: parentId });
        list.css('display', 'none');
        list.css('left', '0%');
        list.css('opacity', '0');
        
        elements.each(function(el){
            if ((el.active) || (el.dependencies && DP.utilvar.activateModules.hasSubArray(el.dependencies))) {
                var subEntry = createSubMenuEntry(el);
                list.append(subEntry);
            }   
        });
        
        return list;
    }
    
    /* 
     * crea un'entry del menu' 
     */
    function createMenuEntry(item, last) {
        
        var menuEntry = $('<li>', { class: 'elementContainerClass' }),
            span = $('<span>');
        

        /*
         *  se e' l'ultimo elemento aggiungo la classe ultimo elemento
         *  per i bordi arrotondati 
         */
        if (last)
            menuEntry.attr('class', menuEntry.attr('class') + ' lastElementContainerClass');

        menuEntry.text(item.name);
        
        var subMenu = createSubMenu(item.subs, item.id);
        
        menuEntry.append(subMenu);
        menuEntry.append(span);
        
        
        $('#toolsList').append(menuEntry);
    }
    
    /* 
     * crea il menu' a partire dagli elementi in moduli  
     */
    function createMenu() {
        
        $('#blackScreen').remove();
        
        $('#toolsMenu').append(
            $('<ul>', {id: 'toolsList'})
        );
        
        
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
        
        $('#mainTable').css('display', '');
        DP.pipeElements.addFinalPipeElement();
    }
    
    return createMenu;
})();
