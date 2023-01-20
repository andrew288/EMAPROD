import React, { useState } from "react";
import { InputFieldForm } from "../../../utils/components/InputFieldForm";
import FechaPicker from "../../components/FechaPicker";

const AgregarEntradaStock = () => {
  const [entrada, setEntrada] = useState({
    codigoMateriaPrima: "",
    codigoProveedor: "",
    fechaEntrada: "",
    documentoEntrada: "",
    cantidadEntrada: 0,
  });

  // INPUT CODIGO MATERIA PRIMA
  const onAddCodigoEntrada = (newCodMateriaPrima) => {
    setEntrada({ ...entrada, codigoMateriaPrima:newCodMateriaPrima});
  }

  // INPUT CODIGO PROVEEDOR
  const onAddCodigoProveedor = (newCodProveedor) => {
    setEntrada({ ...entrada, codigoProveedor:newCodProveedor})
  }

  // SETTEAR VALOR DE FECHA DE ENTRADA
  const onAddFechaEntrada = (newFechaEntrada) => {
    setEntrada({ ...entrada, fechaEntrada: newFechaEntrada.toJSON() });
  };

  // INPUT DOCUMENTO ENTRADA

  const onAddDocumentoEntrada = (newDocumentoEntrada) => {
    setEntrada({ ...entrada, documentoEntrada: newDocumentoEntrada })
  }

  // INPUT CANTIDAD ENTRADA
  
  const onAddCantidadEntrada = (newCantidadEntrada) => {
    setEntrada({ ...entrada, cantidadEntrada: newCantidadEntrada})
  }

  // FECHA PARA MYSQL 2014-10-25 20:00:00




  // SUBMIT DE UNA ENTRADA COMUNICACION CON BACKEND
  const onAddEntrada = (event) => {
    event.preventDefault();
    let ResponseJSON = {...entrada};
    if(entrada.fechaEntrada.length == 0){
        // onAddFechaEntrada(new Date().toLocaleString());
        ResponseJSON = {...ResponseJSON, fechaEntrada: new Date().toISOString()};
    }
    
    console.log(ResponseJSON);
  };

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Registrar entrada</h1>
        <form className="mt-4">
          <div className="mb-3 row">
            <label htmlFor={"codigo-materia-prima"} className="col-sm-2 col-form-label">
              Código de la materia prima
            </label>

            {/* CODIGO MATERIA PRIMA */}
            <InputFieldForm 
                onNewInput={onAddCodigoEntrada}
                nameInput={"codMateriaPrima"}
                typeInput={"text"}
            />
            {/* Componente SEARCH NAME MATERIA PRIMA */}
            <div className="col-md-4">
              <div className="input-group">
                <input
                  type="text"
                  name="nombreMateriaPrima"
                  readOnly = {true}
                  className="form-control"
                  id="nombre-materia-prima"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="agregarCodigoMateriaPrima"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor={"codigo-proveedor"} className="col-sm-2 col-form-label">
              Código de proveedor
            </label>
            {/* CODIGO PROVEEDOR*/}
            <InputFieldForm 
                onNewInput={onAddCodigoProveedor}
                nameInput={"codProveedor"}
                typeInput={"text"}
            />
            {/* SEARCH NAME PROVEEDOR */}
            <div className="col-md-4">
              <div className="input-group">
                <input
                  type="text"
                  name="nombreProveedor"
                  readOnly = {true}
                  className="form-control"
                  id="nombre-proveedor"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="agregarCodigoProveedor"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FECHA DE LA ENTRADA */}
          <div className="mb-3 row">
            <label htlmfor={"fecha-entrada-stock"} className="col-sm-2 col-form-label">
              Fecha de entrada
            </label>
            <div className="col-md-3">
              <FechaPicker onNewFechaEntrada={onAddFechaEntrada} />
            </div>
          </div>

          <div className="mb-3 row">
            <label htlmfor={"documento-entrada"} className="col-sm-2 col-form-label">
              Documento
            </label>
            {/* INPUT DOCUMENTO ENTRADA */}
            <InputFieldForm 
                onNewInput={onAddDocumentoEntrada}
                nameInput={"documentoEntrada"}
                typeInput={"text"}
            />
          </div>

          <div className="mb-3 row">
            <label htlmfor={"cantidad-ingresada"} className="col-sm-2 col-form-label">
              Cantidad ingresada
            </label>
            {/* INPUT CANTIDAD ENTRADA */}
            <InputFieldForm
                onNewInput={onAddCantidadEntrada}
                nameInput={"cantidadEntrada"}
                typeInput={"number"}
            />
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              onClick={(e) => onAddEntrada(e)}
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AgregarEntradaStock;
