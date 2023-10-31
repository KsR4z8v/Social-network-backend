import pool from "../../configs/db_connection.js";
import userModel from "./userModel.js";

export default {
    userModels: userModel(pool)
}