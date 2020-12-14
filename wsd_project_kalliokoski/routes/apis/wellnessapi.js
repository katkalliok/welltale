import * as userService from "../../services/userService.js";

const getUser = async({response}) => {
    response.body = { message: await userService.getUser() };
};

const createUser = async({request, response}) => {
    const body = request.body({type: 'json'});
    const document = await body.value;
    userService.createUser(document.message);
    response.status = 200;
};
   
export { getUser, createUser };