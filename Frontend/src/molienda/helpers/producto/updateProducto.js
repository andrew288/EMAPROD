import axios from 'axios';

export const updateProducto = async (idProd, body) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/molienda/producto/update_producto.php';
    const url = domain + path;

    const { data } = await axios.put(
        url,
        {
            ...body,
            id: idProd,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return data;
}