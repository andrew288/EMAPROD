import React, { useState } from "react";
import FechaPicker from "../../../components/Fechas/FechaPicker";
import {
  DiaJuliano,
  FormatDateTimeMYSQLNow,
} from "../../../utils/functions/FormatDate";
import { useForm } from "./../../../hooks/useForm";
import { FilterMateriaPrima } from "./../../../components/ReferencialesFilters/Producto/FilterMateriaPrima";
import { FilterProveedor } from "./../../../components/ReferencialesFilters/Proveedor/FilterProveedor";

const ActualizarEntradaStock = () => {
  const [entrada, setFormState, onInputChange] = useForm({
    idProd: 0,
    idProv: 0,
    idAlm: 0,
    fecEntSto: "",
    documentoEntrada: "",
    cantidadEntrada: 0,
  });

  const {
    idProd,
    idProv,
    idAlm,
    fecEntSto,
    documentoEntrada,
    cantidadEntrada,
  } = entrada;

  // MANEJADOR DE FORMUALARIO

  // INPUT CODIGO MATERIA PRIMA
  const onAddCodigoEntrada = (newCodMateriaPrima) => {
    setFormState({ ...entrada, idProd: newCodMateriaPrima });
  };

  // INPUT CODIGO PROVEEDOR
  const onAddidProv = (newCodProveedor) => {
    setFormState({ ...entrada, idProv: newCodProveedor });
  };

  // SETTEAR VALOR DE FECHA DE ENTRADA
  const onAddfecEntSto = (newfecEntSto) => {
    setFormState({ ...entrada, fecEntSto: newfecEntSto });
  };

  // SUBMIT DE UNA ENTRADA COMUNICACION CON BACKEND
  const onAddEntrada = (event) => {
    event.preventDefault();

    const { idProd, idProv, documentoEntrada } = entrada;

    // VERIFICAMOS SI SE INGRESARON LOS CAMPOS REQUERIDOS
    if (
      idProd.length != 0 &&
      idProv.length != 0 &&
      documentoEntrada.length != 0
    ) {
      let ResponseJSON = { ...entrada };
      // VERIFICAMOS SI SE INGRESO UNA FECHA DE ENTRADA
      if (entrada.fecEntSto.length == 0) {
        ResponseJSON = {
          ...ResponseJSON,
          fecEntSto: FormatDateTimeMYSQLNow(),
        };
      }

      //Formamos el codigo de entrada
      /*
        1-5: codigo de materia prima
        6-7: codigo de proveedor
        8: letra correspondiente al año
        9-11: dia juliano
        12-13: num. ingreso de la misma materia prima
      */
      const codEntrada = `${idProd}${idProv}C${DiaJuliano(
        ResponseJSON.fecEntSto
      )}01`;

      console.log(ResponseJSON);
      console.log(codEntrada);
    } else {
      console.log("Complete todos los campos");
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Actualizar entrada</h1>
        <form className="mt-4">
          {/* CODIGO MATERIA PRIMA */}
          <div className="mb-3 row">
            <label
              htmlFor={"codigo-materia-prima"}
              className="col-sm-2 col-form-label"
            >
              Código de la materia prima
            </label>
            <div className="col-md-2">
              <input
                onChange={onInputChange}
                value={idProd}
                type="text"
                name="idProd"
                className="form-control"
              />
            </div>
            {/* SEARCH NAME MATERIA PRIMA */}
            <div className="col-md-4">
              <div className="input-group">
                <FilterMateriaPrima onNewInput={onAddCodigoEntrada} />
              </div>
            </div>
          </div>

          {/* CODIGO PROVEEDOR*/}
          <div className="mb-3 row">
            <label
              htmlFor={"codigo-proveedor"}
              className="col-sm-2 col-form-label"
            >
              Código de proveedor
            </label>
            <div className="col-md-2">
              <input
                onChange={onInputChange}
                value={idProv}
                type="text"
                name="idProv"
                className="form-control"
              />
            </div>
            {/* SEARCH NAME PROVEEDOR */}
            <div className="col-md-4">
              <div className="input-group">
                <FilterProveedor onNewInput={onAddidProv} />
              </div>
            </div>
          </div>

          {/* FECHA DE LA ENTRADA */}
          <div className="mb-3 row">
            <label
              htlmfor={"fecha-entrada-stock"}
              className="col-sm-2 col-form-label"
            >
              Fecha de entrada
            </label>
            <div className="col-md-4">
              <FechaPicker onNewfecEntSto={onAddfecEntSto} />
            </div>
          </div>

          {/* INPUT DOCUMENTO ENTRADA */}
          <div className="mb-3 row">
            <label
              htlmfor={"documento-entrada"}
              className="col-sm-2 col-form-label"
            >
              Documento
            </label>
            <div className="col-md-4">
              <input
                onChange={onInputChange}
                value={documentoEntrada}
                type="text"
                name="documentoEntrada"
                className="form-control"
              />
            </div>
          </div>

          {/* INPUT CANTIDAD ENTRADA */}
          <div className="mb-3 row">
            <label
              htlmfor={"cantidad-ingresada"}
              className="col-sm-2 col-form-label"
            >
              Cantidad ingresada
            </label>
            <div className="col-md-2">
              <input
                onChange={onInputChange}
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

export default ActualizarEntradaStock;
