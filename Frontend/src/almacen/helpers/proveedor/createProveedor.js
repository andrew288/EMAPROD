import axios from 'axios';

export const createProveedor = async (body) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/proveedor/create_proveedor.php';
    const url = domain + path;
    const { data } = await axios.post(url, {
        ...body,
    });
    return data;
}