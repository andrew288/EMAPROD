import axios from 'axios';

export const getMateriaPrimaById = async (idMateriaPrima) => {

    const urlPeticion = "http://localhost/EMAPROD/Backend\almacen\materia_prima\view_materia_prima.php";
    // const { data } = await axios({
    //     method: 'post',
    //     url: urlPeticion,
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     data: {
    //         id: idMateriaPrima
    //     }
    // });
    // const { data } = await axios.post(
    //     urlPeticion,
    //     {
    //         id: idMateriaPrima
    //     },
    //     {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         }
    //     }
    // );
    const data = await fetch(urlPeticion, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: idMateriaPrima,
        })
    })
    console.log(data);
    // return data.result;
}