import { model, Model, Schema } from "mongoose";
import userMongo from "../../models/user";
import IUser from "../../utils/interface/IUser";
export interface IUserModel extends IUser, Document {
  _id: string;
}
export const UserSchema = new Schema(userMongo, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);

export default class UserStore {
  public static OPERATION_UNSUCCESSFUL = class extends Error {
    constructor() {
      super("An error occured while processing the request.");
    }
  };


  /**
    * Description: Create a User
    * @param  {attribute}
    * @returns Promise
    */
  public async register(attribute: IUser): Promise<IUser> {
    let user: IUser;
    try {
      user = await User.create(attribute);
    } catch (e) {
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
    return user;
  }

  /**
   * Description: Get user Details by attributes
   * @param  {attributes}
   * @returns Promise
   */
  public async getByAttributes(attributes: object): Promise<IUser> {
    try {
      return await User.findOne(attributes).lean();
    } catch (e) {
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
  }

}
