import axios from 'axios';

export const deleteProducto = async (idProducto) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/molienda/producto/delete_producto.php';
    const url = domain + path;

    const { data } = await axios.delete(url,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                id: idProducto,
            },
        }
    );
    return data;
}