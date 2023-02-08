import axios from 'axios';

export const createSalidasStockByReqMolDet = async (body) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/salidas_stock/createSalidasStockByReqMolDet.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        ...body
    });
    return data;
}