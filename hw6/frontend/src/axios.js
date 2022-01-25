
import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api/guess' })  // server's API endpoint

const startGame = async () => {
    try {
        // axios請求的response為一object，response={data: {...}, status: ,...}
        // destructor直接將return解構賦值給msg
        const { data: { msg } } = await instance.post('/start')
        return msg
    } catch (error) {
        console.log(error)
        throw new Error('Network Error(HTTP:500)! Contact the server owner'); // 使瀏覽器停在startGame mode不能往下進行
    }

}
const guess = async (number, prevNumber, status) => {
    try {
        // 透過{params: {key: value}(要傳的object)}傳入參數，相當於instance.get('/guess?Number=number')
        const { data: { msg, computer } } = await instance.get('/guess', { params: { Number: number, PrevNumber:prevNumber, Status:status } })
        return {msg, computer}
    }
    catch (error) {
        console.log(error.response.data.msg)  // 接收res.status(406).send({ msg: 'Not a legal number.' })
        return {msg:`Error: ${number} is not a valid number (1 - 100)`, computer:""}
    }
}
const restart = async () => {
    try {
        const { data: { msg } } = await instance.post('/restart')
        return msg
    } catch (error) {
        console.log(error)
        throw new Error('Network Error(HTTP:500)! Contact the server owner');
    }
}
export { startGame, guess, restart }