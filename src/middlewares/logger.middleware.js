import colors from 'colors'
colors.enable()
const logger = (req, res, next) => {
    const pet = ` IP: ${req.ip}  METHOD:${req.method}  ROUTE: ${req.url}`;
    const fecha = new Date().toISOString().split("T")[0];
    const hora = new Date().toLocaleTimeString().split(" ")[0];
    if (process.env.logger) {
        fs.appendFile(
            `./logs/historyLogs_${fecha}.txt`,
            `- ${hora} - ${pet}\n`
        ).then((err) => {
            console.log(
                ` IP: ${req.ip.green}  METHOD:${req.method.red}  ROUTE: ${req.url.blue}`,
                "SAVE in log"
            );
        });
    } else {
        console.log(` IP: ${req.ip.green}  METHOD: ${req.method.red}  ROUTE: ${req.url.blue}`.yellow);
    }
    next();
};
export default logger
