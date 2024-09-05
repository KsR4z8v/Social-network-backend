import { MongoClient } from "mongodb";
let clientSaved: MongoClient;
const createClientMongo = (): MongoClient => {
  if (clientSaved) {
    return clientSaved;
  }
  const uri: string =
    process.env.DB_URL_MONGO ??
    "mongodb+srv://davz42:1kfmibro86662@cluster0.klylabv.mongodb.net/Snapwire";
  const client: MongoClient = new MongoClient(uri, {
    maxPoolSize: 100,
    minPoolSize: 20,
  });
  clientSaved = client;
  client.on("connected", () => {
    console.log("Mongo Database Connection established");
  });

  client.on("acquire", () => {
    console.log("xd");
  });

  client.on("disconnected", () => {
    console.log("disconnected");
  });
  return client;
};

export default createClientMongo;
