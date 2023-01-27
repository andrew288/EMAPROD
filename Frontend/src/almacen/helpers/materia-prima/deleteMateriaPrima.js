import axios from 'axios';

export const deleteMateriaPrima = async (idMateriaPrima) => {
    const domain = 'http://localhost/EMAPROD/Backend';
    const path = '/almacen/materia_prima/delete_materia_prima.php';
    const url = domain + path;
    const { data } = await axios.delete(url,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                id: idMateriaPrima,
            },
        }
    );
    return data;
}