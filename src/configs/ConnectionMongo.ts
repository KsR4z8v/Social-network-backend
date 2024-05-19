import { createConnection, type Connection } from "mongoose";

const ConnectionMongo = (): Connection => {
  const uri: string = process.env.DB_URL_MONGO ?? " ";
  const connection: Connection = createConnection(uri, {
    maxPoolSize: 100,
    minPoolSize: 20,
  });

  connection.on("connected", () => {
    console.log("Connection established");
  });

  connection.on("acquire", () => {
    console.log("xd");
  });

  connection.on("disconnected", () => {
    console.log("disconnected");
  });
  /*   connection.on("open", () => console.log("open")); */

  return connection;
};

export default ConnectionMongo;
