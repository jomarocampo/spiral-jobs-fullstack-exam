
export const LoginExceptions = {

    UserNotExisting: {
      error_code: 'E_LOGIN_01',
      error_message: 'Account does not exist.',
    },
  
    UserArchived: {
      error_code: 'E_LOGIN_02',
      error_message: 'Account is already archived.',
    },
  
    UserPasswordError: {
      error_code: 'E_LOGIN_03',
      error_message: 'Provided password is incorrect.',
    },
  
  };