import proxy from "../service/AppServiceProxy";
import type { Application } from "express";
import ROUTES from "./routes";


export default async (app: Application) => {
  userRoutes(app);
};


function userRoutes(app: Application) {
  const user = ROUTES.USER_ROUTES;
  app
    // Create Operations
    .post(user.CREATE_USER, proxy.user.register)
    .post(user.LOGIN_USER, proxy.user.login);

}