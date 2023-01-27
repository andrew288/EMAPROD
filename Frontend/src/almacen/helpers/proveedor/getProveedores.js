import axios from 'axios';

export const getProveedores = async () => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/proveedor/list_proveedores.php';
    const url = domain + path;

    const { data } = await axios.post(url);
    return data.result;
}