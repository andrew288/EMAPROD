import axios from 'axios';

export const getFormulas = async () => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/molienda/formula/list_formulas.php';
    const url = domain + path;
    const { data } = await axios.post(url);
    return data;
}