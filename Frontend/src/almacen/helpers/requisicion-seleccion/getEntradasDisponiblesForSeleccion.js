import axios from 'axios';

export const getEntradasDisponiblesForSeleccion = async (id) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/requisicion-seleccion/getEntradasDisponiblesByMatPriSel.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        idMatPri: id,
    });
    return data;
}