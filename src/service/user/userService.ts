import StatusCodeEnum from "../../utils/enum/statusCodesEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as IUserService from "./IUserServices";
import { IAppServiceProxy } from "../AppServiceProxy";
import userStore from "../user/userStore";
import IUser from "./../../utils/interface/IUser";
import { UserSchema, loginSchema } from "../../utils/schema/userValidate";
import { AuthService } from "../auth/validateAuthService";
import { ApiResponse } from "../../utils/functions/apiResponse";
import LogsMessage from "../../utils/enum/loggerMessage";
import { logger } from "../../utils/functions/logger";
import * as Time from "../../utils/enum/Time";
import { SendResponse } from "../../utils/functions/common.functions"
import MessageEnum from "../../utils/enum/messageEnum";

export default class UserService implements IUserService.IUserServiceAPI {
  private storage = new userStore();
  private apiResponse = new ApiResponse();
  private authService = new AuthService();
  public proxy: IAppServiceProxy;

  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }
  /**
   * @param  {IUserService.IRegisterUserRequest} request
   * Desc: register a user
   * @returns Promise
   */
  public register = async (request: IUserService.IRegisterUserRequest): Promise<IUserService.IRegisterUserResponse> => {
    const response: IUserService.IRegisterUserResponse = {
      status: StatusCodeEnum.UNKNOWN_CODE
    };
    const params = await this.authService.validate(UserSchema, request);
    const { email, password } = params.value;
    if (params.error) {
      logger.error(MessageEnum.logMessage.INVALID_REQUEST)
      SendResponse(StatusCodeEnum.BAD_REQUEST, { success: false, message: MessageEnum.user.INVALID_REQUEST, error: params.error.details });
    }
    const now = Time.now();
    params.value.password = await this.authService.createHashedPassword(password);
    const attributes = {
      ...params.value,
      isSubscribed: false,
      isVerified: false,
      isActive: false,
      meta: {
        createdAt: now
      },
    };
    // exist-user
    let existingUser: IUser | null;
    try {
      existingUser = await this.storage.getByAttributes({ email });
    } catch (e) {
      logger.error(MessageEnum.logMessage.DUPLICATE_USER_EXIST,JSON.stringify(existingUser))
      SendResponse(StatusCodeEnum.BAD_REQUEST, { message: MessageEnum.user.EMAIL_ALREADY_EXIST, success: false },);
    }

    if (existingUser && existingUser.email) {
      // Check if email is verified 
      if (existingUser && existingUser.email) {
        logger.error(MessageEnum.logMessage.DUPLICATE_USER_EXIST,JSON.stringify(existingUser))
        SendResponse(StatusCodeEnum.BAD_REQUEST, { message: MessageEnum.user.DUPLICATE_USER_EXIST, success: false },);
      }
      let user: IUser;
      try {
        user = await this.storage.register(attributes);
        if (!user) {
          logger.error(MessageEnum.logMessage.INVALID_PAYLOAD,JSON.stringify(attributes))
          SendResponse(StatusCodeEnum.BAD_REQUEST, { message: MessageEnum.user.INVALID_REQUEST, success: false });
        }
      } catch (e) {
        logger.error(MessageEnum.logMessage.INTERNAL_SERVER_ERROR,JSON.stringify(existingUser))
        SendResponse(StatusCodeEnum.INTERNAL_SERVER_ERROR, { success: false, message: MessageEnum.user.INTERNAL_SERVER_ERROR });
      }
      response.status = StatusCodeEnum.OK;
      response.user = user;
      return response;
    }

  };

  /**
 * @param  {IUserService.ILoginUserRequest} request
 * Desc: Login a User
 * @returns Promise
 */
  public login = async (
    request: IUserService.ILoginUserRequest
  ): Promise<void> => {
    const response: IUserService.ILoginUserResponse = {
      status: StatusCodeEnum.UNKNOWN_CODE,
    };
    try {
      const params = await this.authService.validate(loginSchema, request);

      if (params.error) {
        logger.error(MessageEnum.logMessage.INVALID_REQUEST,JSON.stringify(params.error))
        SendResponse(StatusCodeEnum.BAD_REQUEST, { success: false, message: MessageEnum.user.INVALID_REQUEST, error: params.error.details });
      }
      const { email, password } = params.value;

      //Make sure that account associated with this email exists in the database
      let user: IUser;
      try {
        user = await this.storage.getByAttributes(email);
      } catch (e) {
        logger.error(MessageEnum.logMessage.INVALID_REQUEST, JSON.stringify(params.error))
        SendResponse(StatusCodeEnum.INTERNAL_SERVER_ERROR, { success: false, message: e.message });
      }

      if (!user) {
        logger.error(MessageEnum.logMessage.DUPLICATE_USER_EXIST,JSON.stringify(params.error))
        SendResponse(StatusCodeEnum.BAD_REQUEST, { success: false, message:  MessageEnum.user.INVALID_REQUEST });
      }
      // check If user password has been verified 
      const comparePassword = await this.authService.comparePassword(password, user.password);
      if (!comparePassword) {
        logger.error(MessageEnum.logMessage.DUPLICATE_USER_EXIST,JSON.stringify(params.error))
        SendResponse(StatusCodeEnum.BAD_REQUEST, { success: false, message: MessageEnum.user.PASSWORD_NOT_MATCH });
      }
      const token: any = await this.authService.createToken(user);
      const response: any = { ...user, token };
      SendResponse(StatusCodeEnum.OK, { success: true, message: MessageEnum.user.LOGIN_SUCCESSFULY, data: response });
    } catch (err) {
      logger.error(MessageEnum.logMessage.INTERNAL_SERVER_ERROR,JSON.stringify(err))
      SendResponse(StatusCodeEnum.INTERNAL_SERVER_ERROR, { success: false, message: err.message });
    }
  };
}





