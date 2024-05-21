"use strict";
import * as bcrypt from "bcrypt";
import IUser from "../../utils/interface/IUser";
import * as jwt from "jsonwebtoken";
import { ApiResponse } from "../../utils/functions/ApiResponse";
import { JWT_SECRET } from "../../env";


export class AuthService {
    protected stage: string;
    protected apiResponse: any;
    protected userService: any;
    constructor() {
        this.apiResponse = new ApiResponse();
        // this.userService = new UserService();
    }
    public static OPERATION_UNSUCCESSFUL = class extends Error {
        constructor() {
            super("An error occured while processing the request.");
        }
    };
    /**
     * Description: Hash the password
     * @param  {string} password
     * @returns Promise
     */
    public async createHashedPassword(password: string): Promise<string> {
        try {
            const hashedPassword = await bcrypt.hash(password, 8);
            return hashedPassword;
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Description: compare user password
     * @param  {string} password
     * @param  {string} passwordFromDB
     * @returns Promise
     */
    public async comparePassword(password: string, passwordFromDB: string): Promise<boolean> {
        try {
            const compare = await bcrypt.compare(password, passwordFromDB);
            return compare;
        } catch (err) {
            return Promise.reject(err);
        }
    }


    async validate(schema, data) {
        const param = schema.validate(data, { abortEarly: false });
        if (param.error) {
            return param.error.details;
        }
        return param;
    }

    /**
     * Description: Creating user authentication token
     * @param  {IUser} attributes
     * @returns Promise
     */
    public async createToken(attributes: Partial<IUser>): Promise<string> {
        try {
            const token = jwt.sign(attributes, JWT_SECRET, { expiresIn: 604800 });
            return token;
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Description: Generate One time password 
     * @param  {number=6} length
     * @returns Promise
     */
    public async generateOTP(length = 6): Promise<number> {
        const digits = "123456789";
        let randomNumber = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            randomNumber += digits.charAt(randomIndex);
        }
        return Number(randomNumber);
    }

    /**
     * Description: Authenticate token
     * @param  {any} event
     * @returns Promise
     */
    //   public async authenticate(event: any): Promise<any> {
    //     try {
    //       const token = await this.extractBearerToken(event.headers);
    //       if (!token) {
    //         return this.apiResponse.setResponse(StatusCodeEnum.UNAUTHORIZED, { message: ErrorMessageEnum.UNAUTHORIZED, status: false }, {});
    //       }
    //       const decoded: any = jwt.verify(token, JWT_SECRET);
    //       if (!decoded || !decoded._id) {
    //         return this.apiResponse.setResponse(StatusCodeEnum.UNAUTHORIZED, { message:ErrorMessageEnum.INVALID_TOKEN, status: false }, {});
    //       }

    //       // Confirm if user exist
    //       const user: IUser = await this.userService.findById(decoded._id);
    //       if (!user) {
    //         return this.apiResponse.setResponse(StatusCodeEnum.UNAUTHORIZED, { message: ErrorMessageEnum.INVALID_TOKEN, status: false }, {});
    //       }

    //       event.user = {
    //         _id: decoded._id,
    //         firstName: user?.firstName,
    //         lastName: user?.lastName,
    //         email: user?.email,
    //         deviceToken: user?.deviceToken
    //       };
    //       return true;
    //     } catch (err) {
    //       return this.apiResponse.setResponse(StatusCodeEnum.UNAUTHORIZED, { message: "Invalid auth token", status: false }, {});
    //     }
    //   }

    /**
     * Description: Extract the token from the authorization
     * @param  {{authorization:string}} headers
     * @returns Promise
     */
    public async extractBearerToken(headers: { authorization: string }): Promise<string> {
        let token;
        const raw = headers.authorization || "";
        if (raw.match(/Bearer /)) {
            token = raw.split("Bearer ")[1];
        }
        return token;
    }


}