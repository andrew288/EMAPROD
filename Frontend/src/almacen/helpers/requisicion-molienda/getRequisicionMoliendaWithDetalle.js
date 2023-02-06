import axios from 'axios';
import { getProductoById } from './../../../molienda/helpers/producto/getProductoById';

export const getRequisicionMoliendaWithDetalle = async () => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/requisicion-molienda/list_requisicion_molienda_detalle.php';
    const url = domain + path;

    const { data } = await axios.post(url);
    const { result } = data;
    return result;
}