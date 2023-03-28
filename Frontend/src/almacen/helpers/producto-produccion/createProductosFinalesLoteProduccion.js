import axios from 'axios';
import config from '../.././../config';

export const createProductosFinalesLoteProduccion = async (body) => {

    const domain = config.API_URL;
    const path = '/produccion/produccion-lote/create_productos_finales_lote_produccion.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        detProdFinLotProd: body
    });
    return data;
}