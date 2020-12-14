import { config } from "../deps.js";

let configs = {};
const conf = config();

configs.database = {
    hostname: conf.HOSTNAME,
    database: conf.DATABASE,
    user: conf.USER,
    password: conf.PASSWORD,
    port: Number(conf.PORT)
};

export { configs }; 