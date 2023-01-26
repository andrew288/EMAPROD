import axios from 'axios';

export const getMateriaPrimaById = async (idMateriaPrima) => {

    const urlPeticion = "http://localhost/EMAPROD/Backend/almacen/materia_prima/view_materia_prima.php";
    const { data } = await axios.post(
        urlPeticion,
        {
            id: idMateriaPrima
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    return data.result;
}