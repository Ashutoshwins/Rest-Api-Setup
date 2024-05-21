const BASE_URL = "/api/v1";
const ROUTES = {
    USER_ROUTES: {
        CREATE_USER: `${BASE_URL}/user/create`,
        LOGIN_USER:  `${BASE_URL}/user/login`,
        UPDATE_USER: `${BASE_URL}/user/update`,
        GET_USER_RECORD: `${BASE_URL}/user/get`,
    },
};

export default ROUTES;
