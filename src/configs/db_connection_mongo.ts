import dotenv from "dotenv";
import { createConnection, Connection } from "mongoose";
dotenv.config();

const MongoConnection = (): Connection => {
  const uri: string = process.env.DB_URL_MONGO || " ";
  const connection: Connection = createConnection(uri, {
    maxPoolSize: 100,
    minPoolSize: 20,
    maxConnecting: 50,
  });

  connection.on("connected", () => {
    console.log("Connection established");
  });

  connection.on("disconnected", () => {
    console.log("disconnected");
  });
  connection.on("open", () => console.log("open"));

  return connection;
};

export default MongoConnection;
