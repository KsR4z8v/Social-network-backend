class TokenGoogleInvalid extends Error {
    constructor() {
        super('Token is not valid')
        this.code = 'TOKEN_INVALID'
    }
}

export default TokenGoogleInvalid