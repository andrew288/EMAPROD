import axios from 'axios';

export const getEntradasDisponibles = async (id) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/salidas_stock/getEntradasDisponiblesByMatPri.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        idMatPri: id,
    });
    return data;
}