import axios from "axios"

export const getAmptDetails = (apmt_id) =>{
    return axios.get("/consult/get/" + apmt_id);
}
export const startConsult = () => {
    return axios.post("/consult/start/");
}

export const updateAmptDetails = (apmt_id, details) => {
    return axios.post("/consult/update/"+apmt_id, details);
}