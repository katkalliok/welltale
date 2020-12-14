import { Client } from "../deps.js";
import { Pool } from "../deps.js";
import { configs } from "../config/config.js";

const config = configs;

const connectionPool = new Pool(config.database, 5);

const executeQuery = async(query, ...params) => {
  const client = await connectionPool.connect();
  try {
    //   console.log(query);
    //   console.log(params);
      return await client.query(query, ...params);
  } catch (e) {
      console.log(e);  
  } finally {
      client.release();
  }
  
  return null;
};


export { executeQuery };