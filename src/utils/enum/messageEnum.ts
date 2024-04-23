enum MessageEnum {
  INVALID_REQUEST = 'Invalid Request Created',
  RECORD_NOT_FOUND = 'Record Not Found',
  INVALID_USER_ID = 'Invalid User Id',
  INVALID_EMAIL_OR_CODE = 'Invalid email or code!!',
  SET_YOUR_PASSWORD = 'Please set your password first!!',
  INVALID_CREDENTIALS = 'messages.error.login.invaildCredentials',
  EMAIL_ALREADY_EXIST = 'Email Already Exist',
  INVALID_UUID = 'Invalid UUID',
  TOKEN_NOT_PROVIDED = 'messages.error.login.unauthorizedUser',
  TOKEN_EXPIRED = 'messages.error.login.sessionExpired',
  FILE_FAILED = 'Error while saving file',
  FILE_TOO_LARGE = 'File size too large',
  USER_NOT_FOUND = 'User does not exist',
  FILE_TYPE_NOT_ALLOWED = 'File type not allowed',
  FILE_REQUIRED = 'At least one file is required',
  PASSWORD_CHANGED = 'Password changed successfully',
  PASSWORD_IDENTICAL = 'New password and current passwords are Identical',
  INVALID_PAYLOAD = 'messages.error.invalidPayload',
}

export default MessageEnum;
