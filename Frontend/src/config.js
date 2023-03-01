
const dev = {
    API_URL: "http://localhost/EMAPROD/Backend"
    // API_URL: "http://192.168.1.136/EMAPROD/Backend"
}
const prod = {
    API_URL: "https://emaprod.emaransac.com/"
}
const config = process.env.NODE_ENV == 'development' ? dev : prod
export default config