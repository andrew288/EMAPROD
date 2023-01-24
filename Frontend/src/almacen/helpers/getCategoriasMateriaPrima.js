import axios from 'axios';

export const getCategoriasMateriaPrima = async () => {

    const url = `http://localhost/EMAPROD/Backend/almacen/materia-prima-categoria/list-categoria-materia-prima.php`;
    const {data} = await axios.post(url);
    return data.result;
}