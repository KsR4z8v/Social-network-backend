import pool from "../../configs/db_connection.js";
import userModel from "./userModel.js";
import postModel from "./postModel.js";
import interactionsModels from "./postInteractionModel.js";
export default {
    userModels: userModel(pool),
    postModels: postModel(pool),
    interactionsModels: interactionsModels(pool)
}