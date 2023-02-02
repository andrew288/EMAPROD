import axios from 'axios';

export const getFormulaWithDetalleById = async (idFormula) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/molienda/formula/get_formula_formula_detalle_by_id.php';
    const url = domain + path;
    const { data } = await axios.post(url, {
        id: idFormula,
    });
    return data;
}