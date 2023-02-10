import axios from 'axios';

export const getSalidasDisponiblesForSeleccion = async (idReqSel, idMatPri) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/requisicion-seleccion/getSalidasDisponiblesByReqSelDet.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        idReqSel: idReqSel,
        idMatPri: idMatPri,
    });
    return data;
}