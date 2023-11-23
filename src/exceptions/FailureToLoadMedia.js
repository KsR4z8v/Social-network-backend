class FailureToLoadMedia extends Error {
    constructor() {
        super('Tenemos problemas para crear tu publicacion, porfavor intenta en unos minutos')
        this.httpCode = 503
        this.stack = ''
    }
}

export default FailureToLoadMedia;