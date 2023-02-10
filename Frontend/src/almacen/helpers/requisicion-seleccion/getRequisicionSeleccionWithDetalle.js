import axios from 'axios';
import { getProductoById } from './../../../molienda/helpers/producto/getProductoById';

export const getRequisicionSeleccionWithDetalle = async () => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/requisicion-seleccion/list_requisicion_seleccion_detalle.php';
    const url = domain + path;

    const { data } = await axios.post(url);
    const { result } = data;
    return result;
}