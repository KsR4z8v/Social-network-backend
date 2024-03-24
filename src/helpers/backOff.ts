export interface typeFunction {
  (): Promise<any>;
}

const sleep = async (time: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("");
    }, time);
  });
};

/**
 *
 * @param totry function to try
 * @param increment
 * @param limit
 * @returns
 */
const backOff = async (
  totry: typeFunction,
  increment: "1s" | "sec" | "exp",
  limit: number = -1
): Promise<any | string> => {
  let delay: number = 0;
  let iteration: number = 1;

  const calcDelay = () => {
    if (increment === "1s") {
      delay = 1000;
    }
    if (increment === "sec") {
      delay += 1000;
    }
    if (increment === "exp") {
      delay = 1000 * Math.pow(2, iteration);
    }
  };

  while (iteration <= limit || limit === -1) {
    try {
      return await totry();
    } catch (e) {
      console.log("Reintenta en...", delay, "ms", iteration, "ERROR", e);
      await sleep(delay);
      calcDelay();
    }
    iteration += 1;
  }
  return "limit exced";
};

export default backOff;
