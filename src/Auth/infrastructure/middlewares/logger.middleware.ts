import { SERVER_CONFIG } from "../../../Default/configs/config";
import { type Request, type Response, type NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction): void => {
  if (SERVER_CONFIG.logger) {
    console.log(
      `${new Date().toISOString()}  IP: ${req.ip}  METHOD: ${
        req.method
      }  ROUTE: ${req.url}`,
    );
  }
  next();
};
export default logger;
