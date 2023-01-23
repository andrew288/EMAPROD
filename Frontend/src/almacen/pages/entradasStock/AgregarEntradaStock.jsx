import React, { useState, useEffect } from "react";
import { InputFieldForm } from "../../../utils/components/InputFieldForm";
import FechaPicker from "../../components/FechaPicker";
import {DiaJuliano, FormatDateTimeMYSQLNow} from '../../../utils/functions/FormatDate';
import { FilterMateriaPrima } from "../../components/FilterMateriaPrima";
import { FilterProveedor } from "../../components/FilterProveedor";

const AgregarEntradaStock = () => { 
  
  const [entrada, setEntrada] = useState({
    codigoMateriaPrima: '',
    codigoProveedor: '',
    fechaEntrada: '',
    documentoEntrada: '',
    cantidadEntrada: 0,
  });

  const {codigoMateriaPrima, codigoProveedor, fechaEntrada, documentoEntrada, cantidadEntrada} = entrada;

  // MANEJADOR DE FORMUALARIO

  const handledForm = ({target}) => {
    const {name, value} = target;
    setEntrada({
      ...entrada,
      [name]: value
    }) 
    
  }
  
  // INPUT CODIGO MATERIA PRIMA
  const onAddCodigoEntrada = (newCodMateriaPrima) => {
    setEntrada({ ...entrada, codigoMateriaPrima : newCodMateriaPrima});
  }

  // INPUT CODIGO PROVEEDOR
  const onAddCodigoProveedor = (newCodProveedor) => {
    setEntrada({ ...entrada, codigoProveedor:newCodProveedor})
  }

  // SETTEAR VALOR DE FECHA DE ENTRADA
  const onAddFechaEntrada = (newFechaEntrada) => {
    setEntrada({ ...entrada, fechaEntrada: newFechaEntrada});
  };

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

      //Formamos el codigo de entrada
      /*
        1-5: codigo de materia prima
        6-7: codigo de proveedor
        8: letra correspondiente al año
        9-11: dia juliano
        12-13: num. ingreso de la misma materia prima
      */
     const codEntrada = `${codigoMateriaPrima}${codigoProveedor}C${DiaJuliano(ResponseJSON.fechaEntrada)}01`;

      console.log(ResponseJSON);
      console.log(codEntrada);
    } else {
      console.log("Complete todos los campos");
    }

  };

  // useEffect(() => {
  // }, [codigoMateriaPrima]);
  

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
              <input
                onChange={handledForm}
                value={codigoMateriaPrima}
                type="text"
                name="codigoMateriaPrima"
                className="form-control"
              />
            </div>
            {/* SEARCH NAME MATERIA PRIMA */}
            <div className="col-md-4">
              <div className="input-group">
                <FilterMateriaPrima 
                  onNewInput={onAddCodigoEntrada}
                />
              </div>
            </div>
          </div>

          {/* CODIGO PROVEEDOR*/}
          <div className="mb-3 row">
            <label htmlFor={"codigo-proveedor"} className="col-sm-2 col-form-label">
              Código de proveedor
            </label>
            <div className="col-md-2">
              <input
                onChange={handledForm}
                value={codigoProveedor}
                type="text"
                name="codigoProveedor"
                className="form-control"
              />
            </div>
            {/* SEARCH NAME PROVEEDOR */}
            <div className="col-md-4">
              <div className="input-group">
                <FilterProveedor 
                  onNewInput={onAddCodigoProveedor}
                />
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
              <input
                onChange={handledForm}
                value={documentoEntrada}
                type="text"
                name="documentoEntrada"
                className="form-control"
              />
            </div>
          </div>

          {/* INPUT CANTIDAD ENTRADA */}
          <div className="mb-3 row">
            <label htlmfor={"cantidad-ingresada"} className="col-sm-2 col-form-label">
              Cantidad ingresada
            </label>
            <div className="col-md-3">
              <input
                onChange={handledForm}
                value={cantidadEntrada}
                type="number"
                name="cantidadEntrada"
                className="form-control"
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
