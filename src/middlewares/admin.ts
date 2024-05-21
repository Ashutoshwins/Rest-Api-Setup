import STATUS_CODES from "../utils/enum/StatusCodesEnum";
import { SendResponse } from "../utils/functions/common.functions";

export const validateAdmin = (req, res, next) => {
  const adminToken = req.headers.admin_token;

  if (process.env.ADMIN_TOKEN !== adminToken) {
    SendResponse(res, {
      status: STATUS_CODES.UNAUTHORIZED,
      error: "You are not authorized",
    });
    return;
  }

  next();
};
