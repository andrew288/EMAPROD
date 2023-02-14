import axios from 'axios';
import config from '../.././../config';

export const getRequisicionMoliendaWithDetalle = async () => {
    const domain = config.API_URL;
    const path = '/almacen/requisicion-molienda/list_requisicion_molienda_detalle.php';
    const url = domain + path;

    const { data } = await axios.post(url);
    const { result } = data;
    return result;
}