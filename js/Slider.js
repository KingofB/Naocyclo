/*****************************************

             CARROUSEL

*****************************************/



/*******************************************
      Fonction de changement de diapo
********************************************/

export function Slider() {

    // Variable JS de la div slider
    const slider = document.getElementById('slider');
    // Variable JS des divs enfants de la div slider
    const divsSlider = slider.querySelectorAll(':scope > div');

    // Variable du nombre de slides
    const nbSlides = divsSlider.length;


    // Création des boutons et LI de navigation
    slider.insertAdjacentHTML('afterbegin', `<span class="icomoon nav-prev"></span>
		            <span class="icomoon nav-pause"></span>
		            <span class="icomoon nav-next"></span>
		            <ul>${'<li></li>'.repeat(nbSlides)}</ul>`);
        

    // Variable jquery de la div slider
    const $slider = $('#slider');
    // Variable jquery de toutes les divs enfants de la div slider
    const $slides = $slider.find('> div');
    // Variable jquery de toutes les li de navigation de la div slider
    const $lis = $slider.find('ul li');
    

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


        // Attribution de la classe active au 1er LI de navigation
        $lis.first().addClass('active');


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
};
