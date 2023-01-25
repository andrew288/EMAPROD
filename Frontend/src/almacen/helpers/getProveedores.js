import axios from 'axios';

export const getProveedor = async () => {

    const url = `http://localhost/EMAPROD/Backend/almacen/proveedor/list_proveedores.php`;
    const {data} = await axios.post(url);
    return data.result;
}