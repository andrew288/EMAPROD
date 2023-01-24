import React, { useState } from "react";
import { FilterCategoriaMateriaPrima } from "../../components/FilterCategoriaMateriaPrima";
import { FilterMedidas } from './../../components/FilterMedidas';

const AgregarMateriaPrima = () => {
  const [materiaPrima, setmateriaPrima] = useState({
    refCodMatPri: "",
    idMatPriCat: 0,
    idMed: 0,
    nomMatPri: "",
    desMatPri: "",
    stoMatPri: 0,
  });

  const { refCodMatPri, idMatPriCat, idMed, nomMatPri, desMatPri, stoMatPri } =
    materiaPrima;
  
  const handledForm = ({target}) => {
    const {name, value} = target;
    setmateriaPrima({
      ...materiaPrima,
      [name]: value
    })
  }

  const onAddCategoriaMateriaPrima = (newValue) => {
    setmateriaPrima({
      ...materiaPrima,
      idMatPriCat: newValue,
    })
  }

  const onAddMedida = (newValue) => {
    setmateriaPrima({
      ...materiaPrima,
      idMed: newValue,
    })
  }

  const handleSubmitMateriPrima = (e) => {
    e.preventDefault();
    if(refCodMatPri.length === 0 || nomMatPri.length === 0 || 
      idMatPriCat === 0 || idMed === 0){
        console.log("Asegurese de completar los campos requeridos")
      }
    else{
      console.log(materiaPrima);
    }
  }

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Agregar materia prima</h1>
        <form className="mt-4">
          <div class="mb-3 row">
            <label for="codigo_referencia" class="col-sm-2 col-form-label">
              Codigo de referencia
            </label>
            <div class="col-md-2">
              <input
                type="text"
                value={refCodMatPri}
                onChange={handledForm}
                name="refCodMatPri"
                class="form-control"
              />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="nombre" class="col-sm-2 col-form-label">
              Nombre
            </label>
            <div class="col-md-4">
              <input
                type="text"
                value={nomMatPri}
                onChange={handledForm}
                name="nomMatPri"
                class="form-control"
              />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="categoria" class="col-sm-2 col-form-label">
              Categoria
            </label>
            <div class="col-md-2">
              <FilterCategoriaMateriaPrima 
                onNewInput={onAddCategoriaMateriaPrima}
              />
            </div>
          </div>

          <div class="mb-3 row">
            <label for="medida" class="col-sm-2 col-form-label">
              Medida
            </label>
            <div class="col-md-2">
              <FilterMedidas 
                onNewInput={onAddMedida}
              />
            </div>
          </div>

          <div class="mb-3 row">
            <label for="descripcion" class="col-sm-2 col-form-label">
              Descripción
            </label>
            <div class="col-md-4">
              <div class="form-floating">
                <textarea
                  value={desMatPri}
                  onChange={handledForm}
                  name="desMatPri"
                  class="form-control"
                  placeholder="Leave a comment here"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="stock" class="col-sm-2 col-form-label">
              Cantidad en Stock
            </label>
            <div class="col-md-2">
              <input
                type="number"
                name="stoMatPri"
                onChange={handledForm}
                value={stoMatPri}
                class="form-control"
              />
            </div>
          </div>
          <button type="submit" onClick={handleSubmitMateriPrima} class="btn btn-primary">
            Guardar
          </button>
        </form>
      </div>
    </>
  );
};

export default AgregarMateriaPrima;
