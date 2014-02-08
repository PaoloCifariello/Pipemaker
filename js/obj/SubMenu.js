/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */

/*
 * 
 * I sub menu
 * 
 */
(function() {
    
    DP.subMenu = new SubMenu();
    
    function SubMenuEntry(el) {
        
        this.node = el;
        this.active = false;
        this.visibile = false;
        
        /*
         * viene eseguito solo la prima volta
         * successivamente la funzione è nel prototype
         */
        if (typeof this.isIn !== "function") {
            SubMenuEntry.prototype.isIn = function(x, y) {
                
                if (this.node.style.display !== 'none') {
                    
                    if (!(this.left) || !(this.top)) {
                        var margin = DP.util.getPosition(this.node);
                        
                        this.left = 168;
                        this.top = margin.top;
                        this.width = this.node.offsetWidth;
                        this.height = this.node.offsetHeight;
                        
                    }
                    
                    return ((x >= 168) &&
                            (x <= this.left + 120) &&
                            (y >= this.top) &&
                            (y < this.top + this.node.offsetHeight));
                    
                }
            };
        }
    }
    
    /*
     * 
     * contiene informazioni sui sub menu
     * 
     * 
     */
    function SubMenu() {
        
        /* il numero di sottomenu */
        this.length = 0;
        /* i sottomenu */
        this.elements = Array();
        
        if (typeof moduli !== undefined)
            this.moduli = moduli;
        
        /*
         * Aggiunge un sotto menu
         * 
         * @param {object} el sottomenu
         * @param {int} index indice da associare al sottomenu
         */
        this.add = function(el, index) {
            
            this.elements[index] = new SubMenuEntry(el);
            this.length++;
        };
        
        /*
         * Ottiene il sotto meu associato all'indice passato
         * 
         * @param {type} index indice del sottomenu
         * @returns {object} elemento del sottomenu o undefined
         */
        this.get = function(index) {
            
            return this.elements[index];
        };
        
        /*
         * Ottiene l'indice dell'elemento el 
         * all'interno della struttura dati subMenu
         * 
         * @param {object} el elemento del DOM da ricercare
         * @returns {Number} indice all'interno della struttura dati
         */
        this.getIndex = function(el) {
            with (DP.subMenu) {
                for (var i = 0;i < elements.length; i++)
                    if (elements[i].node === el)
                        return i;
            }
        };
        
        /*
         * il mouse è sul menu di indice 'index' quindi
         * tale menu deve essere mostrato
         */
        this.show = function(index) {
            
            var obj = this.get(index);
            var menu = obj.node;
            
            if (!obj.visible) {
                menu.style.display = "";
                menu.style.left = DP.utilvar.menu.SUBMENU_LEFT_START + '%';
                setTimeout(overFunShow, 1, index);
            }
        };
        
        /*
         * il mouse è fuori dal menu di indice 'index' quindi
         * tale menu deve essere nascosto
         */
        this.hide = function(index, interval) {
            if (interval)
                setTimeout(overFunHide, interval, index);
            else
                setTimeout(overFunHide, 1, index);
        };
        
        /*
         * Cambio di stato di un sotto menu 
         * 
         * @param {int} index indice del sotto menu che deve cambiare stato
         * @param {bool} activate stato in cui deve transire il sotto menu
         * @param {bool} now se true allora la transizione deve essere immediata
         * 
         */
        this.setState = function(index, activate, now) {
            
            var el = this.get(index);
            
            if (activate)
                for (var j = 0; j < this.elements.length; j++)
                    if (j !== index)
                        this.setState(j, false, true);
            
            if (el.active != activate) {
                if (activate) {
                    el.active = true;
                    this.show(index);
                }
                
                else {
                    el.active = false;
                    if (now)
                        DP.subMenu.hide(index);
                    else
                        DP.subMenu.hide(index, 200);
                }
            }
        };
        
        /*
         * Controllo se un punto è su un sub menu
         * 
         * @param {int} x coordinata del punto
         * @param {int} y coordinata del punto
         * @returns {Boolean} true se sono su un sub menu, false altrimenti
         */
        this.onSubMenu = function(x, y) {
            
            for (var i = 0; i < DP.subMenu.elements.length; i++)
                if (DP.subMenu.elements[i].isIn(x,y))
                    return true;
            
            return false;
        };
        
        /*
         * 
         * @param {string} id del nodo padre (serve per ottenere la categoria di appartenenza
         * @param {string} subId id del nodo 
         * @returns {}
         */
        this.getSubEntry = function(parentId, subId) {
            
            if (!parentId || !subId)
                return;
            
            var parent = searchById(this.moduli.menuItems, parentId);
            
            if (parent)
                return searchById(parent.subs, subId);
        };
        
        
        function searchById(array, id) {
            for (var i = 0; i < array.length; i++)
                if(array[i].id === id) 
                    return array[i];
        }
        
        /*
         * 
         * Funzione di supporto 
         * per quando deve essere nascosto un sub menu
         * essa si richiama fino a che il sotto menu 
         * non è completamente nascosto
         * 
         * @param {int} index l'indice del sotto menu da nascondere
         * 
         */
        function overFunHide(index) {
            
            var obj = DP.subMenu.get(index);
            
            if (obj.active)
                return;
            
            obj.visible = false;
            var menu = obj.node;
            
            
            if (!changeMenuStyle(menu, -1))
                setTimeout(overFunHide, 1, index);
            else {
                menu.style.left = "0%";
                menu.style.display = "none";
            }
        }
        
        
        /*
         * 
         * Funzione di supporto 
         * per quando deve essere mostrato un sub menu
         * essa si richiama fino a che il sotto menu 
         * non è completamente visibile
         * 
         * @param {int} index l'indice del sotto menu da mostrare
         * 
         */
        function overFunShow(index) {
            
            var obj = DP.subMenu.get(index);
            
            if (!obj.active)
                return;
            
            var menu = obj.node;
            
            if (!changeMenuStyle(menu, 2))
                setTimeout(overFunShow, 1, index);
            else
                obj.visible = true;
        }
        
        /*
         * incrementa i parametri di stile left e opacity
         * dell'elemento entry di un valore pari a dl 
         * e salva i valori aggiornati
         */
        
        function changeMenuStyle(entry, dl) {
            
            if (!entry || !dl)
                return;
            
            var style = entry.style;
            
            if (style.opacity) {
                
                var opacity = parseFloat(style.opacity);
                opacity = opacity + dl / 50;
                
                if (opacity >= 1)
                    opacity = 1;
                else if (opacity <= 0)
                    opacity = 0;
                
                style.opacity = opacity;
            }
            
            if (style.left) {
                
                var left = parseInt(style.left);
                left = left + dl;
                
                if ((dl > 0) && (left >= 100)) {
                    style.left = "100%";
                    return true;
                }
                
                else if ((dl < 0) && (left <= DP.utilvar.menu.SUBMENU_LEFT_START)) {
                    style.left = DP.utilvar.menu.SUBMENU_LEFT_START + '%';
                    return true;
                }
                
                style.left = left + '%';
            }
            
            return false;
        }
    }
})();