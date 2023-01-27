import axios from 'axios';

export const updateProveedor = async (idProveedor, body) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/proveedor/update_proveedor.php';
    const url = domain + path;

    const { data } = await axios.put(
        url,
        {
            ...body,
            id: idProveedor,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return data;
}