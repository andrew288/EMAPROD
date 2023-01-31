import axios from 'axios';

export const createFormulaWithDetalle = async (body) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/molienda/formula/create_formula_formula_detalle.php';
    const url = domain + path;
    const { data } = await axios.post(url, {
        ...body,
    });
    console.log(data);
    return data;
}