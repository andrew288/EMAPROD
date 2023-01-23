import axios from 'axios';

export const getMateriaPrima = async () => {

    const url = `http://localhost/EMAPROD/Backend/almacen/materia_prima/list_materias_primas.php`;
    const {data} = await axios.post(url);
    return data.result;
}