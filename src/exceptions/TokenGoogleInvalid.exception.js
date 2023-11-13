class TokenGoogleInvalid extends Error {
    constructor() {
        super('Token is not valid')
        this.code = 'TOKEN_INVALID'
        this.httpCode = 401
    }
}

export default TokenGoogleInvalid