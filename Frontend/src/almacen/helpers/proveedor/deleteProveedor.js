import axios from 'axios';

export const deleteProveedor = async (idProveedor) => {

    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/proveedor/delete_proveedor.php';
    const url = domain + path;

    const { data } = await axios.delete(url,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                id: idProveedor,
            },
        }
    );
    return data;
}