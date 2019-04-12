
export const RegisterExceptions = {

    EmailInvalid: {
        error_code: 'E_REGISTER_01',
        error_message: 'Email is invalid.',
    },
    
    EmailAlreadyUsed: {
        error_code: 'E_REGISTER_02',
        error_message: 'Email is currently in use.',
    },

    ConfirmPasswordNotMatch: {
      error_code: 'E_REGISTER_03',
      error_message: 'Confirm password is not match.',
    },
  
  };