import axios from 'axios';

export const getMedidas = async () => {

    const url = `http://localhost/EMAPROD/Backend/almacen/medidas/list-medidas.php`;
    const {data} = await axios.post(url);
    return data.result;
}