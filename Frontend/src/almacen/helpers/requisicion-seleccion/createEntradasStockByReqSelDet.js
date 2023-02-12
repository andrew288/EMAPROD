import axios from 'axios';

export const createEntradasStockByReqSelDet = async (body) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/requisicion-seleccion/createEntradasStockByReqSelDet.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        ...body
    });
    return data;
}