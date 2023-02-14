import axios from 'axios';
import config from '../.././../config';

export const getRequisicionSeleccionWithDetalle = async () => {
    const domain = config.API_URL;
    const path = '/almacen/requisicion-seleccion/list_requisicion_seleccion_detalle.php';
    const url = domain + path;

    const { data } = await axios.post(url);
    const { result } = data;
    return result;
}