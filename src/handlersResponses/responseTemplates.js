export default ({
    userNotFound: (message) => ({ status: 'USER_NOT_FOUND', message: message ?? 'user not exist' }),
    accountDeactivated: (message) => ({ status: 'ACCOUNT_DEACTIVATED', message: message ?? 'The account is deactivated' }),
    passwordIncorrect: (message) => ({ status: 'PASSWORD_INCORRECT', message: message ?? 'the password is incorrect' }),
    internalError: (message) => ({ status: 'INTERNAL_SERVER_ERROR', message: message ?? 'Internal server error' })
})