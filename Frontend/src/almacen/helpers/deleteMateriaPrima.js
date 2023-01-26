import axios from 'axios';

export const deleteMateriaPrima = async (idMateriaPrima) => {

    const urlPeticion = 'http://localhost/EMAPROD/Backend/almacen/materia_prima/update_materia_prima.php';
    const { data } = await axios.delete(
        urlPeticion,
        {
            id: idMateriaPrima,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return data;
}