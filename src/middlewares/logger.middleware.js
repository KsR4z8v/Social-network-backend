import config from '../configs/config.js'
const logger = (req, res, next) => {
    if (config.logger) {
        console.log(`${new Date().toISOString()}  IP: ${req.ip}  METHOD: ${req.method}  ROUTE: ${req.url}`);
    }
    next();
};
export default logger
s