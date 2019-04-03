// Fonction de récupération des données des stations lors d'une réservation
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
    
    reserveBike() {
        if (this.freeBikes <= 0) {
            return false;
        }
        
        this.freeBikes--;
        return true;
    }
    
    cancelResa() {
        this.freeBikes++;
    }
};

