import StatusCodeEnum from "../../utils/enum/statusCodesEnum";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as IUserService from "./IUserServices";
import { IAppServiceProxy } from "../AppServiceProxy";
import userStore from "../user/userStore";
import IUser from "./../../utils/interface/IUser";
import { UserSchema, loginSchema } from "../../utils/Schema/userValidate";
import { AuthService } from "../auth/validateAuthService";
import { ApiResponse } from "../../utils/functions/ApiResponse";


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
    const params = UserSchema.validate(request, { abortEarly: false });
    const { email,  password } = params.value;
    if (params.error) {
      console.error(params.error);
      response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
      response.error = params.error;
      return response;
    }
    params.value.password = await this.authService.createHashedPassword(password);
    const attributes = {
      ...params.value,
      isSubscribed: false,
      isVerified: false,
      isActive: false,
      meta: {
        createdAt: Date.now(),
      },
    };
    // exist-user
    let existingUser: IUser | null;
    try {
      existingUser = await this.storage.getByAttributes({ email });
    } catch (e) {
      console.error(e);
      return this.apiResponse.setResponse(StatusCodeEnum.INTERNAL_SERVER_ERROR, { message: e.message, success: false }, {});
    }

    if (existingUser && existingUser.email) {
      // Check if email is verified 
      if (existingUser && existingUser.email) {
        return this.apiResponse.setResponse(StatusCodeEnum.BAD_REQUEST, { message: ErrorMessageEnum.DUPLICATE_USER_EXIST, success: false }, {});
      }
      let user: IUser;
      try {
        user = await this.storage.register(attributes);
        if (!user) {
          return this.apiResponse.setResponse(StatusCodeEnum.BAD_REQUEST, { message: ErrorMessageEnum.INVALID_REQUEST, success: false }, {});
        }
      } catch (e) {
        return this.apiResponse.setResponse(StatusCodeEnum.INTERNAL_SERVER_ERROR, { success: false, message: e.message }, {});
      }
      response.status = StatusCodeEnum.OK;
      response.user = user;
      return response;
    }

  };

  public login = async (
    request: IUserService.ILoginUserRequest
  ): Promise<IUserService.ILoginUserResponse> => {
    const response: IUserService.ILoginUserResponse = {
      status: StatusCodeEnum.UNKNOWN_CODE,
    };
    try {
      const params = loginSchema.validate(request, { abortEarly: false });
      if (params.error) {
        return this.apiResponse.setResponse(StatusCodeEnum.BAD_REQUEST, { success: false, message: ErrorMessageEnum.INVALID_REQUEST, error: params.error.details }, {});
      }
      const { email, password } = params.value;

      //Make sure that account associated with this email exists in the database
      let user: IUser;
      try {
        user = await this.storage.getByAttributes(email);
      } catch (e) {
        console.error(e);
        return this.apiResponse.setResponse(StatusCodeEnum.INTERNAL_SERVER_ERROR, { success: false, message: e.message }, {});
      }

      if (!user) {
        return this.apiResponse.setResponse(StatusCodeEnum.BAD_REQUEST, { success: false, message: ErrorMessageEnum.FILE_REQUIRED }, {});
      }
      // check If user email has been verified 
      const comparePassword = await this.authService.comparePassword(password, user.password);
      if (!comparePassword) {
        return this.apiResponse.setResponse(StatusCodeEnum.BAD_REQUEST, { success: false, message: ErrorMessageEnum.EMAIL_ALREADY_EXIST }, {});
      }
      let token: any = await this.authService.createToken(user);
      const expireIn = Date.parse(new Date().toString()) + 30 * 60000;
      const result: any = await Promise.allSettled([token]);
      token = result[0].value;
      const response: any = { ...user, token, expireIn };
      return this.apiResponse.setResponse(StatusCodeEnum.OK, { success: true, message: ErrorMessageEnum.FILE_FAILED, data: response }, {});
    } catch (err) {
      return this.apiResponse.setResponse(StatusCodeEnum.INTERNAL_SERVER_ERROR, { success: false, message: err.message }, {});
    }
  };
}





