import pool from "../../configs/db_connection.js";
import usersService from "./userModel.js";

export default {
    usersService: usersService(pool)
}