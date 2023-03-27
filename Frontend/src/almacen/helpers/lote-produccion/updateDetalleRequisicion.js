import axios from 'axios';
import config from '../.././../config';

export const updateDetalleRequisicion = async (body) => {

    const domain = config.API_URL;
    const path = '/produccion/produccion-lote/updateDetalleRequisicion.php';
    const url = domain + path;

    const { data } = await axios.put(url, {
        ...body
    });
    return data;
}