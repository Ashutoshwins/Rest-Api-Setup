import StatusCodeEnum from "../../utils/enum/statusCodesEnum";
import ErrorMessageEnum from "../../utils/enum/messageEnum";
import * as IUserService from './IUserServices'
import { IAppServiceProxy } from "../AppServiceProxy";
import Joi from "joi";
import userStore from "../user/userStore";
import IUser from "./../../utils/interface/IUser";
import bcrypt from "bcrypt";
import { toError } from "../../utils/interface/common";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";






export default class UserService implements IUserService.IUserServiceAPI {
  private storage = new userStore();
  public proxy: IAppServiceProxy;
  constructor(proxy: IAppServiceProxy) {
    this.proxy = proxy;
  }

  /*****Generate a Token*****/
  private generateJWT = (user: IUser): string => {
    const payLoad = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    return jwt.sign(payLoad, JWT_SECRET);
  };
  /**
   * @param  {IUserService.IRegisterUserRequest} request
   * Desc: register a user
   * @returns Promise
   */
  public register = async (request: IUserService.IRegisterUserRequest): Promise<IUserService.IRegisterUserResponse> => {
    let response: IUserService.IRegisterUserResponse = {
      status: StatusCodeEnum.UNKNOWN_CODE
    };
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().optional(),
    });
    const params = schema.validate(request, { abortEarly: false });

    const { firstName, lastName, email, role, password } = params.value;
    if (params.error) {
      console.error(params.error);
      response.status = StatusCodeEnum.UNPROCESSABLE_ENTITY;
      response.error = params.error;
      return response;
    }

    const hashPassword = await bcrypt.hash(password, 10);


    const attributes = {
      firstName,
      lastName,
      email,
      role,
      password: hashPassword,
      isSubscribed: false,
      isVerified: false,
      isActive: false,
      meta: {
        createdAt: Date.now(),
      },
    };
    // exist-user
    let existingUser: IUser;
    try {
      existingUser = await this.storage.getByAttributes({ email });
    } catch (e) {
      console.error(e);
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    if (existingUser && existingUser.email) {
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      response.error = "An account with this email already exists.";
      return response;
    }

    let user: IUser;
    try {
      user = await this.storage.register(attributes);
      if (!user) {
        console.error(ErrorMessageEnum.RECORD_NOT_FOUND);
        response = {
          status: StatusCodeEnum.INTERNAL_SERVER_ERROR,
          error: ErrorMessageEnum.RECORD_NOT_FOUND
        };

        return response;
      }
    } catch (e) {
      response.status = StatusCodeEnum.INTERNAL_SERVER_ERROR;
      return response;
    }
    response.status = StatusCodeEnum.OK;
    response.user = user;
    return response;
  };






}
