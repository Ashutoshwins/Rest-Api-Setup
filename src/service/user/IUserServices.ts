import IUser from "../../utils/interface/IUser";
import { IRequest, IResponse } from "../../utils/interface/common";

export interface IUserServiceAPI {
  register(request: IRegisterUserRequest): Promise<IRegisterUserResponse>;
  login(request:ILoginUserRequest):Promise<ILoginUserResponse>
}

export interface IRegisterUserRequest extends IRequest {
  _id?: string;
  firstName?:string
  lastName?:string
  email?:string
  role?:string
  isActive?:string
  password?:string
}

export interface IRegisterUserResponse extends IResponse {
  token?: string;
  user?: any;
  error?: any;
}

export interface ILoginUserRequest {
  email: string;
  password: string;
}
export interface ILoginUserResponse extends IResponse {
  user?: IUser;
  token?: string;
  message?: string;

}
