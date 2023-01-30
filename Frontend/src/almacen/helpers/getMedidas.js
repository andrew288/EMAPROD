import axios from 'axios';

export const getMedidas = async () => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/medidas/list-medidas.php';
    const url = domain + path;

    const { data } = await axios.post(url);
    return data.result;
}