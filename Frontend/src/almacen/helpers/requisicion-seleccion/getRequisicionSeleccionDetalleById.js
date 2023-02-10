import axios from 'axios';

export const getRequisicionSeleccionDetalleById = async (id) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/requisicion-seleccion/get_requisicion_seleccion_detalle_by_id.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        id,
    });
    return data;
}