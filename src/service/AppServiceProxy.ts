import * as IUserService from "../service/user/IUserServices";
import UserService from "./user/userService";


export interface IAppServiceProxy {
  user: IUserService.IUserServiceAPI;
}
class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;
  constructor() {
    this.user = new UserService(this);

  }
}

export default new AppServiceProxy();
