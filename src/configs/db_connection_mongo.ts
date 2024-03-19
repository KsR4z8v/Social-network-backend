import dotenv from "dotenv";
import { createConnection, Connection } from "mongoose";
dotenv.config();

const MongoConnection = (): Connection => {
  const uri: string = process.env.DB_URL_MONGO || " ";
  const connection: Connection = createConnection(uri);

  connection.on("connect", () => {
    console.log("Connection established");
  });

  return connection;
};

export default MongoConnection;
