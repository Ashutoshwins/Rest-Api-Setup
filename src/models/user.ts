import shortid from "shortid";
import MetaData from "./meta";

export default {
    _id: {
        type: String,
        required: true,
        default: shortid.generate
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        // enum: Object.values(StatusEnum),
        required: false,
        // default: StatusEnum.ACTIVE
    },
    verifyEmailCode: {
        type: String,
        required: false,
        default: null,

    },
    emailVerifiedAt: {
        type: Number,
        required: false,
        default: null,
    },
    isVerified: {
        type: Boolean,
        required: false,
    },
    isSubscribed: {
        type: Boolean,
        required: false,
      },
    meta: MetaData
};