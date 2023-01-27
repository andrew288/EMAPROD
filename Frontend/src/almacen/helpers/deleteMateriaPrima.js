import axios from 'axios';

export const deleteMateriaPrima = async (idMateriaPrima) => {

    const urlPeticion = 'http://localhost/EMAPROD/Backend/almacen/materia_prima/delete_materia_prima.php';
    const { data } = await axios.delete(urlPeticion,
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