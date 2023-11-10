import pool from "../../configs/db_connection.js";
import userModel from "./userModel.js";
import postModel from "./postModel.js";

export default {
    userModels: userModel(pool),
    postModels: postModel(pool)
}