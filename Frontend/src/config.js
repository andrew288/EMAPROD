const dev={
    API_URL:"http://localhost/EMAPROD/Backend"
};

const prod={
    API_URL:"llll"
};

const config = process.env.NODE_ENV=='development' ? dev : prod;
export default config