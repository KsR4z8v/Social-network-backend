export default ({
    userNotFound: (message) => ({ status: 'USER_NOT_FOUND', message: message ?? 'user not exist' }),
    accountDeactivated: (message) => ({ status: 'ACCOUNT_DEACTIVATED', message: message ?? 'The account is deactivated' }),
    incorrectCodeVerified: (message) => ({ status: 'CODE_INCORRECT', message: message ?? 'Código de verificación incorrecto. Por favor verifique su correo e intentelo de nuevo.' }),
    dataAlreadyExist: (message) => ({ status: 'USER_ALREADY_EXIST', message: message ?? 'The username or  email is already in used' }),
    passwordIncorrect: (message) => ({ status: 'PASSWORD_INCORRECT', message: message ?? 'the password is incorrect' }),
    internalError: (message) => ({ status: 'INTERNAL_SERVER_ERROR', message: message ?? 'Internal server error' })
})