const backOff = async (totry, options = { increment: '1s' }, limit = undefined,) => {
    const sleep = async (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    };

    let delay = 0;
    let iteration = 1;

    const calcDelay = () => {
        if (options.increment === "1s") {
            (delay = 1000);
        }
        if (options.increment === "sec") {
            (delay += 1000);
        }
        if (options.increment === "exp") {
            delay = 1000 * Math.pow(2, iteration);
        }
    };

    while (true) {
        try {
            await totry();
            return "Ok";
        } catch (e) {
            console.log("Reintenta en...", delay, "ms", iteration, 'ERROR', e);
            await sleep(delay);
            calcDelay()
            if (limit === iteration) {
                console.log("entra");
                return "Limite excedido de intentos";
            }
        }
        iteration += 1;
    }
};


export default backOff