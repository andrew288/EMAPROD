import axios from 'axios';

export const getIngresoMateriaPrimaById = async (id) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/entradas_stock/get_numero_ingreso_entrada_stock_by_idMatPri.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        id
    });
    return data;
}