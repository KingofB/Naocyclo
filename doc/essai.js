/*********************************************************

Fonction de récupération des données sur les stations

*********************************************************/

JCDStation: function(data) {

    // Variable du numéro de la station
    const id = data.number;
    // Variable du nom de la station (dont on ne récupère qu'une partie de la chaîne de mots)
    const name = data.name.split('-').slice(1).join('-').trim();
    // Variable des coordonnées gps de la station
    const gps = [data.position.lat, data.position.lng];
    // Variable de l'adresse de la station
    const address = data.address;

    // Variable des vélos disponibles
    let freeBikes = data.available_bikes;



    // Fonction retournant le numéro de la station
    this.getId = function () {
        return id;
    };


    // Fonction retournant le nom de la station (arrow-function)
    this.getName = () => name;


    // Fonction retournant la position GPS de la station
    this.getGPS = () => gps;


    // Fonction retournant l'adresse de la station
    this.getAddress = () => address;


    // Fonction retournant le nombre de vélos disponibles
    this.getNbFreeBikes = () => freeBikes;


    // Fonction d'ajustement du nombre de vélos libres après une réservation
    this.reserveBike = () => --freeBikes;



    // Fonction d'ajustement du nombre de vélos libres après une annulation de réservation
    this.cancelResa = () => ++freeBikes;
},










/*****************************************

             CARROUSEL

*****************************************/



/*******************************************
      Fonction de changement de diapo
********************************************/

Slider: function() {

    // Variable de la div slider
    const $slider = $('#slider');
    // Variable de toutes les divs enfants de la div slider
    const $slides = $slider.find('> div');
    // Variable de toutes les li de navigation de la div slider
    const $lis = $slider.find('ul li');
    // Variable du nombre de slides
    const nbSlides = $slides.length;

    // Variable du timeout
    let timeoutId = null;
    // Variable de la diapo actuelle
    let currentSlide = 0;


    // Fonction principale de changement de slide :
    this.changeSlide = function(slideIdx) {

        // Mise à jour du numéro de la slide actuelle
        currentSlide = slideIdx;
        // Vérification des cas extrêmes
        if (currentSlide < 0) {
            currentSlide = nbSlides - 1;
        } else if (currentSlide >= nbSlides) {
            currentSlide = 0;
        }


        // On cache toutes les slides
        $slides.hide();
        // On récupère la slide sélectionnée par son index (d'où le -1) grâce à "eq"
        $slides.eq(currentSlide).show();
        // Changement du LI actif
        $lis.removeClass('active').eq(currentSlide).addClass('active');


        // Démarrage du diaporama auto :
        if ($slider.hasClass('paused')) {
            this.stopShow();
        }
        else {
            this.startShow();
        }
    };



    // Fonction de changement vers le prochain slide
    this.nextSlide = function() {
        this.changeSlide(currentSlide + 1);
    };



    // Fonction de changement vers la slide précédente
    this.prevSlide = () => {
        this.changeSlide(currentSlide - 1);
    };



    // Fonction de démarrage du carrousel auto
    this.startShow = function() {
        this.stopShow();
        timeoutId = setTimeout(this.nextSlide.bind(this), 5000);
    };


    // Fonction de pause du carrousel auto
    this.stopShow = function() {
        clearTimeout(timeoutId);
        timeoutId = null;
    };



    // Fonction ajustant la lecture ou la pause du carrousel en fonction de son état (sa classe "paused" ou pas)
    this.playPause = function() {
        $slider.toggleClass('paused');
        if ($slider.hasClass('paused')) {
            this.stopShow();
        }
        else {
            this.startShow();
        }
    };



    // Fonction gérant la navigation du carrousel avec les boutons ou les touches clavier
    this.init = function() {

        // Au clic sur nav-next, on affiche le slide suivant (on force jquery à prendre this (les slides) comme contexte grâce à bind) :
        $('.nav-next').click(this.nextSlide.bind(this));
        // Au clic sur nav-prev, on affiche le slide précédent (en arrow-fctn) :
        $('.nav-prev').click(() => this.prevSlide());
        // Au clic sur bouton pause, on arrête le carousel auto :
        $('.nav-pause').click(() => this.playPause());


        // Changement de slide par la liste de boutons :
        $lis.click(e => this.changeSlide($lis.index(e.currentTarget)));


        // Changement de slide par les touches clavier flèche droite et gauche :
        $('body').on('keyup', e => {
        // Vérification que la cible est bien sur le body, et pas sur un input par exemple :
            if (e.target != document.body) {
                return;
            }
            // Switch des différentes touches utilisées :
            switch (e.keyCode) {
                case 37:
                    this.prevSlide();
                    break;

                case 39:
                    this.nextSlide();
                    break;
            }

        });



        // Activation de la lecture ou de la pause du carrousel par la touche espace :
        $('body').on('keypress', e => {

            if (e.target != document.body) {
                return;
            }

            if (e.keyCode == 32) {
                this.playPause();
            }
        });



        // Appel de la fonction de démarrage du carrousel auto
        this.startShow();

    };



    // Appel de la fonction de gestion de la navigation du carrousel
    this.init();
},











/******************************

         RESERVATION

******************************/

// Fonction d'affichage de la carte et des marqueurs :
Map: function() {

    // Variable pour la clé de l'API Mapbox :
    const MAP_BOX_TOKEN = 'pk.eyJ1Ijoia2luZ29mYiIsImEiOiJjanRibzJ2b2MwaWtpNGJ0ZmZhYW9xbnB0In0.vWz6FyOCW94ScDgQt4CddQ';
    // Variable pour la clé de l'API JC Decaux :
    const JCD_API_KEY = 'c35cfff362ee5fd3c47c1b8f34a85e02b7067d27';
    // Variable pour le "contract" de JCDecaux :
    const JCD_CONTRACT = 'Nantes';

    // Variable pour la map de la ville de Nantes :
    const nantesMap = L.map('map').setView([47.2175, -1.5577], 14);
    // Variable de la liste des stations de la ville :
    const stations = {};


    // Fonction centralisée permettant d'appeler l'API JCDecaux :
    const jcdApi = function(action, data, callback) {
        data = data || {};
        data.apiKey = JCD_API_KEY;

        $.get('https://api.jcdecaux.com/vls/v1/' + action, data, function (response) {
            if (callback && $.isFunction(callback)) {
                callback(response);
            }
        });
    };



    // Code issu de l'API Mapbox permettant d'afficher la carte sur le site :
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + MAP_BOX_TOKEN, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: MAP_BOX_TOKEN
    }).addTo(nantesMap);



    // Récupération des stations de la ville de Nantes et leur affichage sur la carte
    jcdApi('stations', {contract: JCD_CONTRACT}, response => {

        // Récup des 10 premières stations seulement
        response = response.slice(0, 10);

        // Récup de la liste des stations et leur affichage sur la carte (méthode forEach)
        response.forEach(function(station) {
            console.log('station', station);
            const obj = new App.JCDStation(station);
            stations[station.number] = obj;
            let marker = L.marker(obj.getGPS()).addTo(nantesMap);
        });
    });
},












































