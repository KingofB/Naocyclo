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


    let lastname = localStorage.getItem("lastname");
    if (lastname) {
        userLastname.value = lastname;
    }
        
    let firstname = localStorage.getItem("firstname");
    if (firstname) {
        userFirstname.value = lastname;
    }
    
    
    btnResa.addEventListener("click", function() {
        localStorage.setItem("lastname", userLastname.value);
        localStorage.setItem("firstname", userFirstname.value);
        const canvas = new Canvas();
            
        // Code qui était dans validateCanvas.addEventListener !
        const canvasImg = canvas.saveCanvas();
        sessionStorage.setItem("canvasImg", canvasImg);
        const bookingConfirm = document.createElement("p");
        bookingConfirm.textContent = "Votre réservation est validée. Elle expirera dans 20 minutes.";
        bookingSection.appendChild(bookingConfirm);
        
	});
};