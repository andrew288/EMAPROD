import axios from 'axios';

export const createEntradaStock = async (body) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/entradas_stock/create_entrada_stock.php';
    const url = domain + path;

    const { data } = await axios.post(url, {
        ...body
    });
    return data;
}