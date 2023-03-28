import axios from 'axios';
import config from '../../../config';

export const getProduccionWhitProductosFinales = async (idProduccion) => {
    const { API_URL } = config;
    const domain = API_URL;
    const path = '/almacen/productos-produccion/getProduccionWithProductosFinalesById.php';
    const url = domain + path;
    const { data } = await axios.post(url, {
        id: idProduccion
    });
    return data;
}