import axios from "axios";


const auth_token = JSON.parse(localStorage.getItem("user") || '{}')?.auth_token;
// axios.defaults.baseURL = "https://localhost:8000"
axios.defaults.baseURL = "http://localhost:8000"
axios.defaults.headers.common = {
    "Auth-token" : auth_token
}

export default axios;