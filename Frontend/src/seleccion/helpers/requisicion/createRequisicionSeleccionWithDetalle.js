import axios from 'axios';

export const createRequisicionSeleccionWithDetalle = async (body) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/seleccion/requisicion/create_requisicion_requisicion_detalle.php';
    const url = domain + path;
    const { data } = await axios.post(url, {
        ...body,
    });
    console.log(data);
    return data;
}