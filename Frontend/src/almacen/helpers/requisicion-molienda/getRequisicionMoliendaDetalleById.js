import axios from 'axios';
import { getProductoById } from './../../../molienda/helpers/producto/getProductoById';

export const getRequisicionMoliendaDetalleById = async (id) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/requisicion-molienda/list_requisicion_molienda_detalle.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        id,
    });
    return data;
}