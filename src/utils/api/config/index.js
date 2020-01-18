import axios from "axios";

const config = axios.create({
    baseURL: "http://localhost/corebos/webservice.php"
});

config.defaults.headers['Content-Type'] = 'application/json';

export default config;