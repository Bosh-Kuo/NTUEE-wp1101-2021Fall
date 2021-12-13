import axios from "axios";

const instance = axios.create({ baseURL: `http://localhost:4000/api/auth` });

const regist = async (username, password) => {
    try {
        const { data: { type, msg } } = await instance.post('/register', {
            username: username,
            password: password
        })
        return { type, msg }
    } catch (error) {
        console.log(error)
    }
}

const login = async (username, password) => {
    try {
        const { data: { type, msg } } = await instance.post('/login', {
            username: username,
            password: password
        })
        return { type, msg }
    } catch (error) {
        console.log(error)
    }
}
export { regist, login };