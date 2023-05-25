import axios from "axios";


const closetApi = axios.create({
    baseURL: '/api'
});

export default closetApi;