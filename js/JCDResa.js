import { JCDStation } from './JCDStation.js'
import { Canvas } from './Canvas.js'

export function JCDResa() {

    // Variable contenant le span de l'adresse de la station
    const stationAddress = document.getElementById('station-address');
    // Variable contenant le span du nombre de vélos libres de la station
    const stationBikes = document.getElementById('station-freeBikes');
    // Variable contenant le nom de l'utilisateur :
    const userLastname = document.getElementById('lastname');
    // Variable contenant le prénom de l'utilisateur :
    const userFirstname = document.getElementById('firstname');
    // Variable contenant le formulaire :
    const form = document.querySelector("form");
    // Variable contenant le canvas :
    const userSignature = document.querySelector('canvas');
    // Variable contenant le bouton submit :
    const btnResa = document.getElementById('sub-btn');


    
    form.addEventListener("submit", function(e) {
        e.preventDefault();
    });

    
    userLastname.addEventListener("change", function() {
        
        if (localStorage.getItem("lastname")) {
            let lastname = localStorage.getItem("lastname");
        } else {
            localStorage.setItem("lastname", userLastname.value);
        }
        
        userFirstname.focus();
    });

    
    
    userFirstname.addEventListener("change", function() {
        localStorage.setItem("firstname", userFirstname.value);
        btnResa.focus();
    });


    btnResa.addEventListener("click", function() {
		new Canvas();
	});
};