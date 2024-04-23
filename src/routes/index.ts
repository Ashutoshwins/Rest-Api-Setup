import proxy from "../service/AppServiceProxy";
import type { Application } from "express";
import ROUTES from "./routes";


export default async (app: Application) => {
    registerUserRoutes(app);
  };

  
function registerUserRoutes(app: Application) {
    const user = ROUTES.USER_ROUTES;
    app
      // Create Operations
      .post(user.CREATE_USER, proxy.user.register)
      
  }