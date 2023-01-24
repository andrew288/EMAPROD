import React from "react";
import { useState } from "react";

const AgregarProveedor = () => {
  const [proveedor, setproveedor] = useState({
    refCodPro: "",
    nomPro: "",
    apePro: "",
    desPro: "",
  });

  const { refCodPro, nomPro, apePro, desPro } = proveedor;

  const handledForm = ({ target }) => {
    const { name, value } = target;
    setproveedor({
      ...proveedor,
      [name]: value,
    });
  };

  const handleSubmitProveedor = (e) => {
    e.preventDefault();
    if(refCodPro.length === 0 || nomPro.length === 0 || apePro.length === 0){
      console.log("Asegurese de completar los campos requeridos")
    } else {
      console.log(proveedor);
    }
  }

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Agregar proveedor</h1>
        <form className="mt-4">
          <div class="mb-3 row">
            <label for="codigo_referencia" class="col-sm-2 col-form-label">
              Codigo de referencia
            </label>
            <div class="col-md-2">
              <input
                type="text"
                onChange={handledForm}
                value={refCodPro}
                name="refCodPro"
                class="form-control"
              />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="nombre" class="col-sm-2 col-form-label">
              Nombres
            </label>
            <div class="col-md-4">
              <input
                type="text"
                onChange={handledForm}
                value={nomPro}
                name="nomPro"
                class="form-control"
              />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="nombre" class="col-sm-2 col-form-label">
              Apellidos
            </label>
            <div class="col-md-4">
              <input
                type="text"
                onChange={handledForm}
                value={apePro}
                name="apePro"
                class="form-control"
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
                  value={desPro}
                  onChange={handledForm}
                  name="desPro"
                  class="form-control"
                  placeholder="Leave a comment here"
                ></textarea>
              </div>
            </div>
          </div>
          <button type="submit" onClick={handleSubmitProveedor} class="btn btn-primary">
            Guardar
          </button>
        </form>
      </div>
    </>
  );
};

export default AgregarProveedor;
