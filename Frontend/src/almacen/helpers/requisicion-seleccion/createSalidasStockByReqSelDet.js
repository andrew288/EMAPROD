import axios from 'axios';

export const createSalidasStockByReqSelDet = async (body) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/requisicion-seleccion/createSalidasStockByReqSelDet.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        ...body
    });
    return data;
}