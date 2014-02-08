/* 
 * dotPipe
 * Paolo Cifariello, paolocifa@gmail.com
 */

/*
 * 
 * Variabili di utilità
 * 
 */

/** DotPipe */
var DP = {};

/** Identifica il menu laterale */
DP.subMenu = (DP.subMenu) ? DP.subMenu : undefined;

/** ultimo elemento cliccato */
DP.lastElement = (DP.lastElement) ? DP.lastElement : undefined;

/** struttura dati contenente informazioni sugli elementi pipe esistenti */
DP.pipeElements = (DP.pipeElements) ? DP.pipeElements : undefined;

/** elemento attivo per lo spostamento */
DP.elementToMove = (DP.elementToMove) ? DP.elementToMove : undefined;

/** link attivo in fase di creazione */
DP.attach = (DP.attach) ? DP.attach : undefined;

/** Elemento di cui si stanno modificando le proprietà */
DP.currentChange = (DP.currentChange) ? DP.currentChange : undefined;

/** Array di id di timer per il movimento della vista */
DP.currentMoving = new Array();

DP.utilvar = {
    
    activateModules: [],
    
    link: {
        /* larghezza delle linee di collegamento tra elementi della pipe */
        LINK_WIDTH: 3
    },
            
    menu: {
        /* da dove parte il sub menu (0% significa in linea con il soprameni
         * 100% significa completamente staccato */
        SUBMENU_LEFT_START: 40
    },
            
    social: {
        BASE_TIME_TO_WAIT: 1000,
        
        FACEBOOK_REST_API_URL: 'https://graph.facebook.com/',
        
        INSTAGRAM_AUTH_URL: 'https://instagram.com/oauth/authorize/',
        INSTAGRAM_CLIENT_ID: '91a69ae1d53d4804855bf3cfb47a2c23',
        INSTAGRAM_REST_API_URL: 'https://api.instagram.com/v1/',

        GOOGLE_REST_API_URL: '/plus/v1/',
        QUOTA_GOOGLE: 5
    },
    
    // Tipi di dato possibili
    type: {
        EMPTY: 'empty',
        /* Sorgenti */
        // Sequenza utenti
        USER_SEQ: 'user_seq',
        // Sequenza eventi
        EVENT_SEQ: 'event_seq',
        // Sequenza media
        MEDIA_SEQ: 'media_seq',
        // Sequenza feed
        FEED_SEQ: 'feed_seq',
        // Intero
        INT: 'int'
    },
    
    // Campi dei vari oggetti
    fields: {
        user_seq: ['Name', 'Surname', 'Gender', 'Birthday', 'Hometown'],
        event_seq: ['Name', 'Location'],
        feed_seq: ['Author', 'Title', 'Publication date']
    },
    
    // Info per i feed RSS
    feed: {
    
        DEFAULT_NUMBER_OF_FEED: 20
        
    },
    
    // Info Generali
    info: {
        SVG_LEFT_MARGIN: 180,
        SVG_TOP_MARGIN: 60,
        
        PIPE_ELEMENT_WIDTH: 100,
        PIPE_ELEMENT_HEIGHT: 50
    },
    
    manager: {
        SAVE_LINK: "save.php"
    },
    
    color: {
        DEFAULT_STANDARD_COLOR: "#3091FF",
        DEFAULT_END_COLOR: "#04A200"
    },
    
    view : 40,
    
    SHOW_ERROR: true,
    SHOW_EVENTS: true
    
};