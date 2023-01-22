import React, { useState } from "react";
import { InputFieldForm } from "../../../utils/components/InputFieldForm";
import FechaPicker from "../../components/FechaPicker";
import {FormatDateTimeMYSQLNow} from '../../../utils/functions/FormatDate';

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
    setEntrada({ ...entrada, fechaEntrada: newFechaEntrada});
  };

  // INPUT DOCUMENTO ENTRADA

  const onAddDocumentoEntrada = (newDocumentoEntrada) => {
    setEntrada({ ...entrada, documentoEntrada: newDocumentoEntrada })
  }

  // INPUT CANTIDAD ENTRADA
  
  const onAddCantidadEntrada = (newCantidadEntrada) => {
    setEntrada({ ...entrada, cantidadEntrada: newCantidadEntrada})
  }

  // SUBMIT DE UNA ENTRADA COMUNICACION CON BACKEND
  const onAddEntrada = (event) => {
    event.preventDefault();

    const {codigoMateriaPrima, codigoProveedor, documentoEntrada} = entrada;

    // VERIFICAMOS SI SE INGRESARON LOS CAMPOS REQUERIDOS
    if(codigoMateriaPrima.length != 0 && codigoProveedor.length != 0 && documentoEntrada.length != 0 ){
      let ResponseJSON = {...entrada};
      // VERIFICAMOS SI SE INGRESO UNA FECHA DE ENTRADA
      if(entrada.fechaEntrada.length == 0){
        ResponseJSON = {...ResponseJSON, fechaEntrada: FormatDateTimeMYSQLNow()};
      }
      console.log(ResponseJSON);
    } else {
      console.log("Complete todos los campos");
    }

  };

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Registrar entrada</h1>
        <form className="mt-4">
          {/* CODIGO MATERIA PRIMA */}
          <div className="mb-3 row">
            <label htmlFor={"codigo-materia-prima"} className="col-sm-2 col-form-label">
              Código de la materia prima
            </label>
            <div className="col-md-2">
              <InputFieldForm 
                  onNewInput={onAddCodigoEntrada}
                  nameInput={"codMateriaPrima"}
                  typeInput={"text"}
              />
            </div>
            {/* SEARCH NAME MATERIA PRIMA */}
            <div className="col-md-4">
              <div className="input-group">
                <input
                  type="text"
                  name="nombreMateriaPrima"
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

          {/* CODIGO PROVEEDOR*/}
          <div className="mb-3 row">
            <label htmlFor={"codigo-proveedor"} className="col-sm-2 col-form-label">
              Código de proveedor
            </label>
            <div className="col-md-2">
              <InputFieldForm 
                  onNewInput={onAddCodigoProveedor}
                  nameInput={"codProveedor"}
                  typeInput={"text"}
              />
            </div>
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
            <div className="col-md-4">
              <FechaPicker onNewFechaEntrada={onAddFechaEntrada} />
            </div>
          </div>

          {/* INPUT DOCUMENTO ENTRADA */}
          <div className="mb-3 row">
            <label htlmfor={"documento-entrada"} className="col-sm-2 col-form-label">
              Documento
            </label>
            <div className="col-md-4">
              <InputFieldForm 
                  onNewInput={onAddDocumentoEntrada}
                  nameInput={"documentoEntrada"}
                  typeInput={"text"}
              />
            </div>
          </div>

          {/* INPUT CANTIDAD ENTRADA */}
          <div className="mb-3 row">
            <label htlmfor={"cantidad-ingresada"} className="col-sm-2 col-form-label">
              Cantidad ingresada
            </label>
            <div className="col-md-3">
              <InputFieldForm
                  onNewInput={onAddCantidadEntrada}
                  nameInput={"cantidadEntrada"}
                  typeInput={"number"}
              />
            </div>
          </div>

          {/*   BUTTON SUBMIT */}
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
