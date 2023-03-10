import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterTipoProduccion } from "./../../../components/ReferencialesFilters/TipoProduccion/FilterTipoProduccion";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import FechaPicker from "../../../components/Fechas/FechaPicker";
import { FilterProductoProduccion } from "./../../../components/ReferencialesFilters/Producto/FilterProductoProduccion";
import { createProduccionLote } from "./../../helpers/produccion_lote/createProduccionLote";
import { Checkbox } from "@mui/material";
import FechaPickerYear from "./../../../components/Fechas/FechaPickerYear";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const CrearProduccionLote = () => {
  // ESTADO PARA LOS DATOS DE PRODUCCION LOTE
  const [produccionLote, setproduccionLote] = useState({
    idProdt: 0,
    idProdTip: 0,
    esEnv: 0,
    codLotProd: "",
    klgLotProd: 1500,
    canLotProd: 1,
    obsProd: "",
    fecProdIniProg: "",
    fecProdFinProg: "",
    fecVenLotProd: "",
  });

  const {
    idProdt,
    idProdTip,
    esEnv,
    codLotProd,
    klgLotProd,
    canLotProd,
    obsProd,
    fecProdIniProg,
    fecProdFinProg,
    fecVenLotProd,
  } = produccionLote;

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

  // CONTROLADOR DE FORMULARIO
  const handledForm = ({ target }) => {
    const { name, value } = target;
    setproduccionLote({
      ...produccionLote,
      [name]: value,
    });
  };

  // EVENTOS DE FORMULARIO

  // EVENTO DE PRODUCTO
  const onAddProductoMolienda = ({ id }) => {
    setproduccionLote({
      ...produccionLote,
      idProdt: id,
    });
  };

  // EVENTO DE TIPO DE PRODUCCION
  const onAddTipoProduccion = ({ id, cod }) => {
    setproduccionLote({
      ...produccionLote,
      idProdTip: id,
      codTipProd: cod,
    });
  };

  // EVENTO DE ES SOLO ENVASADO
  const onChangeEsEnvasado = (e, value) => {
    const valueCheck = value ? 1 : 0;
    setproduccionLote({
      ...produccionLote,
      esEnv: valueCheck,
    });
  };

  // ENVENTO DE FECHA INICIO PROGRAMADO
  const onAddFechaInicioProgramado = (newFecha) => {
    setproduccionLote({ ...produccionLote, fecProdIniProg: newFecha });
  };
  // EVENTO DE FECHA FIN PROGRAMADO
  const onAddFechaFinProgramado = (newFecha) => {
    setproduccionLote({ ...produccionLote, fecProdFinProg: newFecha });
  };

  // EVENTO DE FECHA VENCIMIENTO LOTE
  const onAddFechaVencimientoLoteProduccion = (newFecha) => {
    setproduccionLote({ ...produccionLote, fecVenLotProd: newFecha });
  };

  // CREAR LOTE DE PRODUCCION
  const crearProduccionLote = async () => {
    const resultPeticion = await createProduccionLote(produccionLote);
    const { message_error, description_error, result } = resultPeticion;

    if (message_error.length === 0) {
      // regresamos a la anterior vista
      onNavigateBack();
    } else {
      // hubo error en la insercion
      setfeedbackMessages({
        style_message: "error",
        feedback_description_error: description_error,
      });
      handleClickFeeback();
      // habilitamos el boton de crear
      setdisableButton(false);
    }
  };

  // SUBMIT FORMULARIO DE REQUISICION (M-D)
  const handleSubmitProduccionLote = (e) => {
    e.preventDefault();
    if (
      idProdt === 0 ||
      idProdTip === 0 ||
      klgLotProd <= 0 ||
      canLotProd <= 0 ||
      fecProdIniProg.length === 0 ||
      fecProdFinProg.length === 0 ||
      fecVenLotProd.length === 0
    ) {
      if (fecProdIniProg.length === 0) {
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error: "Ingrese una fecha de inicio programado",
        });
        handleClickFeeback();
      } else {
        if (fecProdFinProg.length === 0) {
          setfeedbackMessages({
            style_message: "warning",
            feedback_description_error: "Ingrese una fecha de fin programado",
          });
          handleClickFeeback();
        } else {
          if (fecVenLotProd.length === 0) {
            setfeedbackMessages({
              style_message: "warning",
              feedback_description_error:
                "Ingrese una fecha de vencimiento del lote",
            });
            handleClickFeeback();
          } else {
            setfeedbackMessages({
              style_message: "warning",
              feedback_description_error:
                "Asegurate de completar los campos requeridos o validar su integridad",
            });
            handleClickFeeback();
          }
        }
      }
    } else {
      setdisableButton(true);
      // LLAMAMOS A LA FUNCION CREAR REQUISICION
      crearProduccionLote();
      // RESETEAMOS LOS VALORES
    }
  };

  return (
    <>
      <div className="container-fluid mx-3">
        <h1 className="mt-4 text-center">Crear Produccion Lote</h1>

        {/* Datos de produccion */}
        <div className="row mt-4 mx-4">
          <div className="card d-flex">
            <h6 className="card-header">Datos de produccion</h6>
            <div className="card-body">
              <form>
                <div className="mb-3 row">
                  {/* NUMERO DE LOTE */}
                  <div className="col-md-2">
                    <label htmlFor="nombre" className="form-label">
                      <b>Numero de Lote</b>
                    </label>
                    <input
                      type="text"
                      name="codLotProd"
                      onChange={handledForm}
                      value={codLotProd}
                      className="form-control"
                    />
                  </div>
                  {/* KILOGRAMOS DE LOTE */}
                  <div className="col-md-3">
                    <label htmlFor="nombre" className="form-label">
                      <b>Peso de Lote</b>
                    </label>
                    <input
                      type="number"
                      name="klgLotProd"
                      onChange={handledForm}
                      value={klgLotProd}
                      className="form-control"
                    />
                  </div>
                  {/* CANTIDAD DE LOTES */}
                  <div className="col-md-3">
                    <label htmlFor="nombre" className="form-label">
                      <b>Cantidad</b>
                    </label>
                    <input
                      type="number"
                      name="canLotProd"
                      onChange={handledForm}
                      value={canLotProd}
                      className="form-control"
                    />
                  </div>
                  {/* TIPO DE PRODUCCION */}
                  <div className="col-md-4">
                    <label htmlFor="nombre" className="form-label">
                      <b>Tipo de produccion</b>
                    </label>
                    <FilterTipoProduccion onNewInput={onAddTipoProduccion} />
                  </div>
                </div>

                <div className="mb-3 row d-flex align-items-center">
                  {/* PRODUCTO */}
                  <div className="col-md-4 me-4">
                    <label htmlFor="nombre" className="form-label">
                      <b>Producto</b>
                    </label>
                    <FilterProductoProduccion
                      onNewInput={onAddProductoMolienda}
                    />
                  </div>
                  {/* PRODUCTO */}
                  <div className="col-md-4">
                    <label htmlFor="nombre" className="form-label">
                      <b>Solo envasado</b>
                      <Checkbox size="large" onChange={onChangeEsEnvasado} />
                    </label>
                  </div>
                </div>

                {/* FECHAS DE VENCIMIENTO */}
                <div className="mb-3 row d-flex align-items-center">
                  <div className="col-md-4 me-4">
                    <label htmlFor="nombre" className="form-label">
                      <b>Fecha vencimiento lote</b>
                    </label>
                    <FechaPickerYear
                      onNewfecEntSto={onAddFechaVencimientoLoteProduccion}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="card d-flex mt-4">
            <h6 className="card-header">Datos de programacion</h6>
            <div className="card-body">
              <div className="mb-3 row">
                <div className="col-md-3">
                  <label htmlFor="nombre" className="form-label">
                    <b>Fecha de inicio programado</b>
                  </label>
                  <FechaPicker onNewfecEntSto={onAddFechaInicioProgramado} />
                </div>
                <div className="col-md-3">
                  <label htmlFor="nombre" className="form-label">
                    <b>Fecha de fin programado</b>
                  </label>
                  <FechaPicker onNewfecEntSto={onAddFechaFinProgramado} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="nombre" className="form-label">
                    <b>Observaciones</b>
                  </label>
                  <textarea
                    value={obsProd}
                    name="obsProd"
                    onChange={handledForm}
                    className="form-control"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTONES DE CANCELAR Y GUARDAR */}
        <div className="btn-toolbar mt-4 ms-4">
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
            onClick={handleSubmitProduccionLote}
            className="btn btn-primary"
          >
            Guardar
          </button>
        </div>
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
