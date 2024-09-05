// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type typeFunction = () => Promise<any>;

const sleep = async (time: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, time);
  });
};

/**
 *
 * @param toTry function to try
 * @param increment
 * @param limit
 * @returns
 */
const backOff = async (
  toTry: typeFunction,
  increment: "1s" | "sec" | "exp",
  limit = -1,
): Promise<unknown | string> => {
  let delay = 0;
  let iteration = 1;

  const calcDelay = (): void => {
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

  // eslint-disable-next-line no-unmodified-loop-condition
  while (iteration <= limit || limit === -1) {
    try {
      return await toTry();
    } catch (e) {
      console.log("trying in...", delay, "ms", iteration, "ERROR", e);
      await sleep(delay);
      calcDelay();
    }
    iteration += 1;
  }
  return "limit exceed";
};

export default backOff;
