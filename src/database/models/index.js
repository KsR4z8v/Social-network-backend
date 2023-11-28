import userModel from "./userModel.js";
import postModel from "./postModel.js";
import interactionsModels from "./postInteractionModel.js";

import dotenv from 'dotenv'
dotenv.config()

import poolMain from "../../configs/db_connection_server.js";
import poolLocal from "../../configs/db_connection_local.js";

export default {
    userModels: userModel([poolMain, poolLocal]),
    postModels: postModel([poolMain, poolLocal]),
    interactionsModels: interactionsModels([poolMain, poolLocal])
}