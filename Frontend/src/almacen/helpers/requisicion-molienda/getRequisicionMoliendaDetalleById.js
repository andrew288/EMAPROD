import axios from 'axios';

export const getRequisicionMoliendaDetalleById = async (id) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/requisicion-molienda/get_requisicion_molienda_detalle_by_id.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        id,
    });
    return data;
}