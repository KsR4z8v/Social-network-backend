export default ({
    userNotFound: (message) => ({ status: 'USER_NOT_FOUND', message: message ?? 'El usuario no existe' }),
    accountDeactivated: (message) => ({ status: 'ACCOUNT_DEACTIVATED', message: message ?? 'la cuenta se encuentra desactivada' }),
    incorrectCodeVerified: (message) => ({ status: 'CODE_INCORRECT', message: message ?? 'Código de verificación incorrecto. Por favor verifique su correo e intentelo de nuevo.' }),
    dataAlreadyExist: (message) => ({ status: 'USER_ALREADY_EXIST', message: message ?? 'El correo o el username ya esta en uso' }),
    passwordIncorrect: (message) => ({ status: 'PASSWORD_INCORRECT', message: message ?? 'the password is incorrect' }),
    internalError: (message) => ({ status: 'INTERNAL_SERVER_ERROR', message: message ?? 'Error interno del servidor' }),
    invalidBodyKeys: (message) => ({ status: 'INVALID_BODY_KEYS', message: message ?? 'La estructura del body es incorrecta, faltan keys o son incorrectas' }),
    invalidDateFormat: (message) => ({ status: 'INVALID_DATE_FORMAT', message: message ?? 'El formato de fecha es incorrecto' }),
    invalidFormatPassword: (message) => ({ status: 'INVALID_PASSWORD_FORMAT', message: message ?? 'El formato de la contraseña es incorrecto' }),
})