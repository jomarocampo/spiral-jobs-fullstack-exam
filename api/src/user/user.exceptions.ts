
export const UserExceptions = {

    UserNotExisting: {
      error_code: 'E_USER_01',
      error_message: 'Account does not exist.',
    },
  
    UserFilterRangeInvalid: {
      error_code: 'E_USER_02',
      error_message: 'Invalid filter ranges.',
    },
  
    UserIdNotNumeric: {
      error_code: 'E_USER_03',
      error_message: 'Invalid user id.',
    },
  
    UserEmailAlreadyUsed: {
      error_code: 'E_USER_04',
      error_message: 'Email is currently in use.',
    },
  
    UserEmailInvalid: {
      error_code: 'E_USER_05',
      error_message: 'Email is invalid.',
    },
  
    UserSortParamsInvalid: {
      error_code: 'E_USER_06',
      error_message: 'Invalid sort param values.',
    },
  
    UserRoleNotExisting: {
      error_code: 'E_USER_07',
      error_message: 'User role with given ID does not exist.',
    },
  
  };