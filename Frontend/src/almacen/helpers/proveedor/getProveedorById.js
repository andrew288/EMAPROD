import axios from 'axios';

export const getProveedorById = async (idProveedor) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/proveedor/view_proveedor.php';
    const url = domain + path;

    const { data } = await axios.post(
        url,
        {
            id: idProveedor
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return data.result;
}