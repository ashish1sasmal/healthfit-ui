import axios from "axios";


const auth_token = JSON.parse(localStorage.getItem("user") || '{}')?.auth_token;
axios.defaults.baseURL = "https://ashish202major.herokuapp.com"
axios.defaults.headers.common = {
    "Auth-token" : auth_token
}

export default axios;