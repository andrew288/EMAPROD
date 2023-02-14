
const dev = {
    API_URL: "http://localhost/EMAPROD/Backend"
}
const prod = {
    API_URL: "https://emaprod.emaransac.com/"
}
const config = process.env.NODE_ENV == 'development' ? dev : prod
export default config