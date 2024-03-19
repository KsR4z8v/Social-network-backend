import config from "../configs/config";
import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  if (config.logger) {
    console.log(
      `${new Date().toISOString()}  IP: ${req.ip}  METHOD: ${
        req.method
      }  ROUTE: ${req.url}`
    );
  }
  next();
};
export default logger;
