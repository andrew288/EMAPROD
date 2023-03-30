import React, { useEffect, useState } from "react";
import { useForm } from "./../../../hooks/useForm";
// IMPORT DE EFECHA PICKER
import FechaPicker from "./../../../components/Fechas/FechaPicker";
import FechaPickerYear from "./../../../components/Fechas/FechaPickerYear";
// FUNCIONES UTILES
import {
  DiaJuliano,
  FormatDateTimeMYSQLNow,
  letraAnio,
} from "../../../utils/functions/FormatDate";
// IMPORTACIONES DE FILTROS
// IMPORTACIONES DE COMPONENTES MUI
import Checkbox from "@mui/material/Checkbox";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { createEntradaStock } from "./../../helpers/entradas-stock/createEntradaStock";
import { FilterProveedor } from "./../../../components/ReferencialesFilters/Proveedor/FilterProveedor";
import { FilterAlmacen } from "./../../../components/ReferencialesFilters/Almacen/FilterAlmacen";
import { FilterAllProductos } from "./../../../components/ReferencialesFilters/Producto/FilterAllProductos";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AgregarEntradaStock = () => {
  const {
    idProd,
    idProv,
    idAlm,
    canTotCom,
    canTotEnt,
    canVar,
    docEntSto,
    fecVenEntSto,
    fecEntSto,
    codProd,
    codProv,
    codAlm,
    formState,
    setFormState,
    onInputChange,
  } = useForm({
    idProd: 0,
    idProv: 0,
    idAlm: 0,
    esSel: false,
    canTotCom: 0,
    canTotEnt: 0,
    canVar: 0,
    docEntSto: "",
    fecVenEntSto: "",
    fecEntSto: "",
    codProd: "",
    codProv: "",
    codAlm: "",
  });

  // ESTADO PARA CONTROLAR EL FEEDBACK
  const [feedbackCreate, setfeedbackCreate] = useState(false);
  const [feedbackMessages, setfeedbackMessages] = useState({
    style_message: "",
    feedback_description_error: "",
  });
  const { style_message, feedback_description_error } = feedbackMessages;

  // MANEJADORES DE FEEDBACK
  const handleClickFeeback = () => {
    setfeedbackCreate(true);
  };

  const handleCloseFeedback = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setfeedbackCreate(false);
  };

  // ESTADO PARA BOTON CREAR
  const [disableButton, setdisableButton] = useState(false);

  // ESTADOS PARA LA NAVEGACION
  const navigate = useNavigate();
  const onNavigateBack = () => {
    navigate(-1);
  };

  // INPUT CODIGO MATERIA PRIMA
  const onAddCodProd = ({ value, id }) => {
    setFormState({ ...formState, codProd: value, idProd: id });
  };

  // INPUT CODIGO PROVEEDOR
  const onAddCodProv = ({ value, id }) => {
    setFormState({ ...formState, codProv: value, idProv: id });
  };

  // INPUT CODIGO ALMACEN
  const onAddCodAlm = ({ value, id }) => {
    setFormState({ ...formState, codAlm: value, idAlm: id });
  };

  // SET VALOR DE FECHA DE VENCIMIENTO
  const onAddFecVenEntSto = (newfecVentEntSto) => {
    console.log(newfecVentEntSto);
    setFormState({ ...formState, fecVenEntSto: newfecVentEntSto });
  };

  // SET VALOR DE FECHA DE formState
  const onAddFecEntSto = (newfecEntSto) => {
    console.log(newfecEntSto);
    setFormState({ ...formState, fecEntSto: newfecEntSto });
  };

  // CREAR ENTRADA DE STOCK
  const crearEntradaStock = async () => {
    let requestJSON = { ...formState };

    // verificamos si se ingreso una fecha de ingreso
    if (fecEntSto.length === 0) {
      requestJSON = {
        ...requestJSON,
        fecEntSto: FormatDateTimeMYSQLNow(),
      };
    }

    requestJSON = {
      ...requestJSON,
      diaJulEntSto: DiaJuliano(requestJSON.fecEntSto),
      letAniEntSto: letraAnio(requestJSON.fecEntSto),
    };

    console.log(requestJSON);
    // AHORA ENVIAMOS LA DATA AL BACKEND
    const { message_error, description_error } = await createEntradaStock(
      requestJSON
    );
    if (message_error.length === 0) {
      // navegamos a la anterior vista
      onNavigateBack();
    } else {
      // mostramos el error recepcionado del backend
      setfeedbackMessages({
        style_message: "error",
        feedback_description_error: description_error,
      });
      handleClickFeeback();
      // habilitamos el boton de crear
    }

    setdisableButton(false);
  };

  // SUBMIT DE UNA formState COMUNICACION CON BACKEND
  const onSubmitformState = (event) => {
    event.preventDefault();

    // VERIFICAMOS SI SE INGRESARON LOS CAMPOS REQUERIDOS
    if (
      idProd === 0 ||
      idProv === 0 ||
      idAlm === 0 ||
      docEntSto.length === 0 ||
      canTotEnt <= 0 ||
      canTotCom <= 0 ||
      fecVenEntSto.length === 0
    ) {
      if (fecVenEntSto.length === 0) {
        // MANEJAMOS FORMULARIOS INCOMPLETOS
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error:
            "Asegurese de ingresar una fecha de vencimiento",
        });
        handleClickFeeback();
      } else {
        // MANEJAMOS FORMULARIOS INCOMPLETOS
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error:
            "Asegurese de llenar los datos requeridos",
        });
        handleClickFeeback();
      }
    } else {
      // DESABILTIAMOS EL BOTON DE ENVIAR
      setdisableButton(true);
      // FUNCION DE ENVIAR
      crearEntradaStock();
    }
  };

  useEffect(() => {
    if (canTotCom.length === 0 || canTotEnt.length === 0) {
      setFormState({
        ...formState,
        canVar: 0,
      });
    } else {
      const cantidadVariacion = parseFloat(canTotEnt) - parseFloat(canTotCom);
      setFormState({
        ...formState,
        canVar: cantidadVariacion,
      });
    }
  }, [canTotCom, canTotEnt]);

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Registrar Entrada de stock</h1>
        <form className="mt-4">
          {/* CODIGO MATERIA PRIMA */}
          <div className="mb-3 row">
            <label className="col-md-2 col-form-label">Producto</label>
            <div className="col-md-2">
              <input
                onChange={onInputChange}
                value={codProd}
                readOnly
                type="text"
                name="codProd"
                className="form-control"
              />
            </div>
            {/* SEARCH NAME PRODUCTO */}
            <div className="col-md-3">
              <FilterAllProductos onNewInput={onAddCodProd} />
            </div>
            {/* <div className="col-md-3 form-check d-flex justify-content-start align-items-center">
              <label className="form-check-label">Para seleccionar</label>
              <Checkbox
                checked={esSel}
                onChange={onChangeEsSel}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div> */}
          </div>

          {/* CODIGO PROVEEDOR*/}
          <div className="mb-3 row">
            <label className="col-md-2 col-form-label">Proveedor</label>
            <div className="col-md-2">
              <input
                onChange={onInputChange}
                value={codProv}
                readOnly
                type="text"
                name="codProv"
                className="form-control"
              />
            </div>
            {/* SEARCH NAME PROVEEDOR */}
            <div className="col-md-3">
              <FilterProveedor onNewInput={onAddCodProv} />
            </div>
          </div>

          {/* CODIGO ALMACEN */}
          <div className="mb-3 row">
            <label className="col-md-2 col-form-label">Almacen</label>
            <div className="col-md-2">
              <input
                onChange={onInputChange}
                value={codAlm}
                readOnly
                type="text"
                name="codAlm"
                className="form-control"
              />
            </div>
            {/* SEARCH NAME PROVEEDOR */}
            <div className="col-md-3">
              <FilterAlmacen onNewInput={onAddCodAlm} />
            </div>
          </div>

          {/* FECHA DE LA formState */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">
              Fecha de Entrada Stock
            </label>
            <div className="col-md-4">
              <FechaPicker onNewfecEntSto={onAddFecEntSto} />
            </div>
          </div>

          {/* FECHA DE VENCIMIENTO DE LA formState */}
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">
              Fecha de vencimiento
            </label>
            <div className="col-md-4">
              <FechaPickerYear onNewfecEntSto={onAddFecVenEntSto} />
            </div>
          </div>

          {/* INPUT DOCUMENTO formState */}
          <div className="mb-3 row">
            <label
              htlmfor={"documento-formState"}
              className="col-sm-2 col-form-label"
            >
              Documento
            </label>
            <div className="col-md-3">
              <input
                onChange={onInputChange}
                value={docEntSto}
                type="text"
                name="docEntSto"
                className="form-control"
              />
            </div>
          </div>

          {/* INPUT CANTIDAD COMPRA */}
          <div className="mb-3 row">
            <label
              htlmfor={"cantidad-ingresada"}
              className="col-sm-2 col-form-label"
            >
              Cantidad compra
            </label>
            <div className="col-md-2">
              <input
                onChange={onInputChange}
                value={canTotCom}
                type="number"
                name="canTotCom"
                className="form-control"
              />
            </div>
          </div>

          {/* INPUT CANTIDAD formState */}
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
                value={canTotEnt}
                type="number"
                name="canTotEnt"
                className="form-control"
              />
            </div>
          </div>

          {/* INPUT CANTIDAD EXEDIDA */}
          <div className="mb-3 row">
            <label
              htlmfor={"cantidad-ingresada"}
              className="col-sm-2 col-form-label"
            >
              Cantidad variacion
            </label>
            <div className="col-md-2">
              <input
                disabled={true}
                onChange={onInputChange}
                value={canVar}
                type="number"
                name="canVar"
                className={`form-control ${
                  parseFloat(canVar) < 0 ? "text-danger" : "text-success"
                }`}
              />
            </div>
          </div>

          {/* BOTONES DE CANCELAR Y GUARDAR */}
          <div className="btn-toolbar">
            <button
              type="button"
              onClick={onNavigateBack}
              className="btn btn-secondary me-2"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={disableButton}
              onClick={(e) => onSubmitformState(e)}
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
      {/* FEEDBACK AGREGAR MATERIA PRIMA */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={feedbackCreate}
        autoHideDuration={6000}
        onClose={handleCloseFeedback}
      >
        <Alert
          onClose={handleCloseFeedback}
          severity={style_message}
          sx={{ width: "100%" }}
        >
          {feedback_description_error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AgregarEntradaStock;
