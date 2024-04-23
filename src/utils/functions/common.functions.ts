import STATUS_CODES from '../enum/statusCodesEnum';
import MessageEnum from '../enum/messageEnum';
import { IError } from '../interface/common';

/**
 * Send standard error for invalid payload
 * @param err error of joi used to print in console
 * @param res response object to send response to client
 */
export const sendPayloadError = (err, res) => {
  console.log(err);
  const response: any = {};
  response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
  response.error = toError(MessageEnum.INVALID_PAYLOAD);
  SendResponse(res, response);
};

/**
 * Send response to client
 * @param res response object
 * @param data data object with status,message or error
 */
export const SendResponse = (
  res: any,
  data: any = { status: 400, message: 'Invalid Request' },
) => {
  res.status(data.status).send(data);
};

/**
 * Return object with message property with value as argument
 * @param message
 * @returns object with propery "message" with value of argument
 */
export function toError(message: string): IError {
  const error: IError = {
    message,
  };

  return error;
}
