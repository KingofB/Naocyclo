// Classe des stations
export class JCDStation {
    constructor(data) {
        
        if(data === undefined)
            throw new Error("data need to be defined !");
        this.id = data.number;
        this.name = data.name.split('-').slice(1).join('-').trim();
        this.gps = [data.position.lat, data.position.lng];
        this.address = data.address;
        this.freeBikes = data.available_bikes;
    }
    
    // Fonction d'ajustement du nombre de vélos disponibles lors d'une réservation
    reserveBike() {
        if (this.freeBikes <= 0) {
            return false;
        }
        
        this.freeBikes--;
        return true;
    }
    
    // Fonction d'ajustement du nombre de vélos disponibles lors d'une annulation de réservation
    cancelResa() {
        this.freeBikes++;
    }
};

