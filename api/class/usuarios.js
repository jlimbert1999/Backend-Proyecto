class Usuarios {
    constructor() {
        this.personas = []
    }
    agregarPersona(id, id_cuenta, Nombre, NombreCargo) {
        let persona = {
            id,
            id_cuenta,
            Nombre,
            NombreCargo
        }
        this.personas.push(persona)
            // return this.personas;
    }
    getPersonas() {
        return this.personas;
    }
    getPersona(id) {
        let persona = this.personas.filter(perso => { //buscar personas 
            return perso.id === id
        })[0]
        return persona
    }
    deletePersona(id) {
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(perso => perso.id != id);
        return personaBorrada
    }
    quitarUser(id) {
        this.personas = this.personas.filter(perso => perso.id_cuenta != id);
    }
}
module.exports = {
    Usuarios
}