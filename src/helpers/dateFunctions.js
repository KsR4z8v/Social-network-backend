export const generateDateToRegister = () => {
    return new Date(new Date() - 567648000000)
}

export const validateDateToRegister = (date) => {
    const date_born = new Date(date);
    const time = (new Date()) - date_born
    const years = parseInt(time * 3.2 * Math.pow(10, -11))
    console.log(years)
    return years >= 18
}