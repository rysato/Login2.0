import axios from 'axios'
const api = axios.create({
    baseURL: 'https://login2-0.onrender.com'
})

export default api