let number

const getNumber = () => number;
const genNumber = (restart = false) => {
    if(!number || restart) {
        number = Math.floor(Math.random()*100 < 1 ? 1 : Math.random()*100)
    }
    return number
}
export {getNumber, genNumber}