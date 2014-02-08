/* Crea un User
 *
 * @param{string} type servizio associato (facebook,google,instagram)
 * @param{Object} user il descrittore di utente ottenuto dalle API
 */
function User(type,user){  
    switch (type)
    {
            
            // da aggiungere foto profilo per FB con /id/picture -> .url
        case 'facebook':
            {
                // ID
                this.id = user.id;
                
                var name = user.name.split(' ');
                // Nome
                if (user.first_name)
                    this.firstName = name[0];
                
                // Cognome
                this.lastName = (name[1] !== undefined) ? name[1] : undefined;
                name.splice(0,2);
                
                while (name[0]){
                    this.lastName = this.lastName.concat(' ' + name[0]);
                    name.splice(0,1);
                }
                // Data di nascita
                if (user.birthday){
                    var bir = user.birthday.split('/');
                    this.birthday = bir[2] + '-' + bir[0] + '-' + bir[1];
                }
                
                // Sesso
                if (user.gender)
                    this.gender = user.gender;
                // Dove vive
                if (user.hometown)
                    this.hometown = user.hometown.name;
                
                var lan = new Array();
                if (user.languages)
                    user.languages.each(function(el){
                        lan.push({name:el.name});
                    });
                
                // Che lingue parla
                this.languages = lan;
                // Links al profilo
                if (user.link)
                    this.link = user.link;
                
                break;
            }
        case 'google':
            {
                // ID
                this.id = user.id;
                // Nome
                if (user.name){
                    this.firstName = user.name.givenName;
                    // Cognome
                    if (user.name.familyName)
                        this.lastName = user.name.familyName;
                }
                else if (user.displayName) {
                    var names = user.displayName.split(' ');
                    
                    this.firstName = names[0];
                    
                    names = names.slice(1);
                    var lastName = "";
                    
                    for (var i = 0; i < names.length; i++){
                        if (names.lastElement === names[i])
                            lastName.concat(names[i]);
                        else 
                            lastName.concat(names[i] + ' ');
                    }
                    
                    this.lastName = lastName;
                }
                
                // Data di nascita
                if (user.birthday)
                    this.birthday = user.birthday;
                // Sesso
                if (user.gender)
                    this.gender = user.gender;
                
                var hometown;
                if (user.placesLived)
                    user.placesLived.each(function(el){
                        if (el.primary)
                            hometown = el.value;
                    });
                
                // Dove vive
                if (hometown)
                    this.hometown = hometown;
                // Che lingue parla
                if (user.language)
                    this.languages = [{name: user.language}];
                else
                    this.languages = [];
                
                // Links al profilo
                if (user.url)
                    this.link = user.url;
                // Immagine profilo
                if (user.image) {
                    var spli = user.image.url.split('sz=50');
                    this.image = spli[0] + 'sz=300';
                }
                
                break;
            }
        case 'instagram':
            {
                // ID
                this.id = user.id;
                // username
                this.username = user.username;
                
                var names = user.full_name.split(" ");
                // Nome
                this.firstName = names[0];
                
                names = names.slice(1);
                
                // Cognome
                this.lastName = "";
                
                for (var i = 0; i < names.length; i++){
                    if (i >= names.length - 1)
                        this.lastName = this.lastName.concat(names[i]);
                    else 
                        this.lastName = this.lastName.concat(names[i] + ' ');
                }
                
                // Lingue
                this.languages = [];
                // Immagine profilo
                if (user.profile_picture)
                    this.image = user.profile_picture;
                
                this.link = 'http://instagram.com/' + user.username; 
                
                break;
            }
    }
    
    this.type = 'user'
    // tipo di profilo (facebook, instagram, google+)
    this.source = type;
}

/* Crea un Evento
 *
 * @param{string} type servizio associato (facebook,google)
 * @param{Object} event il descrittore di evento ottenuto dalle API
 */
function Event(type,event){
    switch (type)
    {
        case 'facebook':
            {
                // ID
                this.id = event.id;
                // Nome evento
                if (event.name)
                    this.name = event.name;
                // Luogo evento
                if (event.location)
                    this.location = event.location;
                // Ora di inizio
                if (event.start_time)
                    this.startTime = event.start_time;
                // Ora di fine
                if (event.end_time)
                    this.endTime = event.end_time;
                // Descrizione
                if (event.description)
                    this.description = event.description;
                this.link = 'http://www.facebook.it/' + event.id;
                
                break;                
            }
        case 'google':
            {
                // Nome evento
                if (event.title)
                    this.name = event.title;
                // Luogo evento
                if (event.location)
                    this.location = event.location.displayName;
                if (event.url)
                    this.link = event.url;
                
                break;                
            }     
    }
    
    this.type = 'event'
    // Tipo di evento: facebook o google
    this.source = type;
}

/* Crea un media
 *
 * @param{User} user utente owner del media
 * @param{string} type servizio associato (facebook,instagram)
 * @param{Object} media il media ottenuto dalle API
 */
function Media(type,media){
    
    
    switch (type)
    {
        case 'facebook':
            {
                // ID
                this.id = media.id;
                // Immagine piccola
                this.picture = media.picture;
                // Immagine a grandezza naturale
                this.url = media.source;
                
                this.link = 'http://www.facebook.it/' + media.id;
                
                break;
            }
        case 'instagram':
            {
                // ID
                this.id = media.id;
                // Immagine piccola
                this.picture = media.images.thumbnail.url;
                // Immagine a grandezza naturale
                this.url = media.images.standard_resolution.url;
                this.user = new User('instagram', media.user);
                this.link = media.link;
                
                break;
            }
    }
    
    this.type = 'media'
    
    this.source = type;
    
}
/*
var feed = new google.feeds.Feed(url);
feed.load(function (data) {
    // Parse data depending on the specified response format, default is JSON.
    console.dir(data);
});
*/
/* Crea un feedRSS
 *
 * @param{Object} feed feed
 */
function FeedRSS(feed, source){    
    // Autore
    this.author = feed.author;
    // Titolo
    this.title = feed.title;
    // Categorie
    this.categories = feed.categories;
    // Contenuto
    this.content = feed.content;
    // Abbozzo
    this.contentSnippet = feed.contentSnippet;
    // Data di pubblicazione
    this.publishedDate = feed.publishedDate;
    // Link
    this.link = feed.link;
    // Source
    this.source = source;
    
    this.type = 'feedrss';
}
