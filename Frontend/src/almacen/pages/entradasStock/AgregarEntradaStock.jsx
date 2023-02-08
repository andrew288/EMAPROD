import React, { useState } from "react";
// IMPORT D EFECHA PICKER
import FechaPicker from "../../components/FechaPicker";
// FUNCIONES UTILES
import {
  DiaJuliano,
  FormatDateTimeMYSQLNow,
  letraAnio,
} from "../../../utils/functions/FormatDate";
// IMPORTACIONES DE FILTROS
import { FilterMateriaPrima } from "../../components/FilterMateriaPrima";
import { FilterProveedor } from "../../components/FilterProveedor";
import { getIngresoMateriaPrimaById } from "./../../helpers/entradas-stock/getIngresoMateriaPrimaById";
// IMPORTACIONES DE COMPONENTES MUI
import Checkbox from "@mui/material/Checkbox";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { createEntradaStock } from "./../../helpers/entradas-stock/createEntradaStock";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AgregarEntradaStock = () => {
  const [entrada, setEntrada] = useState({
    idMatPri: 0,
    idPro: 0,
    idEntStoEst: 1,
    letAniEntSto: "",
    diaJulEntSto: "",
    refNumIngEntSto: "",
    esSel: false,
    codMatPri: "",
    codPro: "",
    docEntSto: "",
    fecEntSto: "",
    canTotEnt: 0,
  });

  const {
    codMatPri,
    codPro,
    docEntSto,
    canTotEnt,
    idMatPri,
    idPro,
    esSel,
    fecEntSto,
  } = entrada;

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

  // MANEJADOR DE FORMUALARIO
  const handledForm = ({ target }) => {
    const { name, value } = target;
    setEntrada({
      ...entrada,
      [name]: value,
    });
  };

  const obtenerUltimoIngresoMateriaPrima = async (id) => {
    const response = await getIngresoMateriaPrimaById(id);
    const { result } = response;
    let parseResult = result.toString();
    if (parseResult.length === 1) {
      parseResult = `0${parseResult}`;
    }
    return parseResult;
  };

  // INPUT CODIGO MATERIA PRIMA
  const onAddCodigoMateriPrima = ({ value, id }) => {
    // ACTUALIZAMOS EL CAMPO DE MUESTRA
    setEntrada({ ...entrada, codMatPri: value, idMatPri: id });
  };

  // INPUT CODIGO PROVEEDOR
  const onAddcodPro = ({ value, id }) => {
    setEntrada({ ...entrada, codPro: value, idPro: id });
  };

  // SETTEAR VALOR DE FECHA DE ENTRADA
  const onAddfecEntSto = (newfecEntSto) => {
    setEntrada({ ...entrada, fecEntSto: newfecEntSto });
  };

  //SETEAMOS EL VALOR DE ES SELECCION
  const onChangeEsSel = (event) => {
    setEntrada({ ...entrada, esSel: event.target.checked });
  };

  // CREAR ENTRADA DE STOCK
  const crearEntradaStock = async () => {
    let requestJSON = { ...entrada };

    // verificamos si se ingrso una fecha de ingreso
    if (fecEntSto.length === 0) {
      requestJSON = {
        ...requestJSON,
        fecEntSto: FormatDateTimeMYSQLNow(),
      };
    }

    // OBTENEMOS EL NUMERO DE INGRESO DE LA MATERIA PRIMA
    const numIng = await obtenerUltimoIngresoMateriaPrima(idMatPri);

    //FORMAMOS EL CODIGO DE ENTRADA
    const codEntrada = `${codMatPri}${codPro}${letraAnio(
      requestJSON.fecEntSto
    )}${DiaJuliano(requestJSON.fecEntSto)}${numIng}`;

    // SETEAMO EL VALOR DE CODIGO DE ENTRADA
    requestJSON = {
      ...requestJSON,
      codEntSto: codEntrada,
      diaJulEntSto: DiaJuliano(requestJSON.fecEntSto),
      letAniEntSto: letraAnio(requestJSON.fecEntSto),
      refNumIngEntSto: numIng,
    };
    console.log(requestJSON);

    // AHORA ENVIAMOS LA DATA AL BACKEND
    const { message_error, description_error } = await createEntradaStock(
      requestJSON
    );
    if (message_error.length === 0) {
      console.log("Se creo exitosamente");
      setfeedbackMessages({
        style_message: "success",
        feedback_description_error: "Se creó exitosamente",
      });
      handleClickFeeback();
    } else {
      console.log("No se pudo crear");
      setfeedbackMessages({
        style_message: "error",
        feedback_description_error: description_error,
      });
      handleClickFeeback();
    }
    setdisableButton(false);
  };

  // SUBMIT DE UNA ENTRADA COMUNICACION CON BACKEND
  const onSubmitEntrada = (event) => {
    event.preventDefault();

    // VERIFICAMOS SI SE INGRESARON LOS CAMPOS REQUERIDOS
    if (
      idMatPri === 0 ||
      idPro === 0 ||
      docEntSto.length === 0 ||
      canTotEnt <= 0
    ) {
      // MANEJAMOS FORMULARIOS INCOMPLETOS
      setfeedbackMessages({
        style_message: "warning",
        feedback_description_error: "Asegurese de llenar los datos requeridos",
      });
      handleClickFeeback();
    } else {
      // DESABILTIAMOS EL BOTON DE ENVIAR
      setdisableButton(true);
      // FUNCION DE ENVIAR
      crearEntradaStock();
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Registrar entrada</h1>
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
                onChange={handledForm}
                value={codMatPri}
                readOnly
                type="text"
                name="codMatPri"
                className="form-control"
              />
            </div>
            {/* SEARCH NAME MATERIA PRIMA */}
            <div className="col-md-4">
              <div className="input-group">
                <FilterMateriaPrima onNewInput={onAddCodigoMateriPrima} />
              </div>
            </div>
          </div>

          <div className="mb-3 row">
            <div className="form-check">
              <label className="form-check-label" htmlFor="flexCheckChecked">
                Es para seleccionar
              </label>
              <Checkbox
                checked={esSel}
                onChange={onChangeEsSel}
                inputProps={{ "aria-label": "controlled" }}
              />
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
                onChange={handledForm}
                value={codPro}
                readOnly
                type="text"
                name="codPro"
                className="form-control"
              />
            </div>
            {/* SEARCH NAME PROVEEDOR */}
            <div className="col-md-4">
              <div className="input-group">
                <FilterProveedor onNewInput={onAddcodPro} />
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
                onChange={handledForm}
                value={docEntSto}
                type="text"
                name="docEntSto"
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
                onChange={handledForm}
                value={canTotEnt}
                type="number"
                name="canTotEnt"
                className="form-control"
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
              Cancelar
            </button>
            <button
              type="submit"
              disabled={disableButton}
              onClick={(e) => onSubmitEntrada(e)}
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
