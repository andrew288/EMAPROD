import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterTipoProduccion } from "./../../../components/ReferencialesFilters/TipoProduccion/FilterTipoProduccion";
// IMPORTACIONES PARA TABLE MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import FechaPicker from "../../../components/Fechas/FechaPicker";
import { FilterProductoProduccion } from "./../../../components/ReferencialesFilters/Producto/FilterProductoProduccion";
import { createProduccionLote } from "./../../helpers/produccion_lote/createProduccionLote";
import { Checkbox } from "@mui/material";
import FechaPickerYear from "./../../../components/Fechas/FechaPickerYear";
import { FilterAllProductos } from "./../../../components/ReferencialesFilters/Producto/FilterAllProductos";

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

        <div className="row mt-4 mx-4">
          {/* Datos de produccion */}
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
                  {/* PRODUCTO */}
                  <div className="col-md-4 me-4">
                    <label htmlFor="nombre" className="form-label">
                      <b>Producto</b>
                    </label>
                    <FilterProductoProduccion
                      onNewInput={onAddProductoMolienda}
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
                </div>

                <div className="mb-3 row d-flex align-items-center">
                  {/* TIPO DE PRODUCCION */}
                  <div className="col-md-4">
                    <label htmlFor="nombre" className="form-label">
                      <b>Tipo de produccion</b>
                    </label>
                    <FilterTipoProduccion onNewInput={onAddTipoProduccion} />
                  </div>
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

          {/* DATOS DE PROGRAMACION */}
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
          {/* DATOS DE PRODUCTOS FINALES O LOTES DE SUBPRODUCTOS*/}
          <div className="card d-flex mt-4">
            <h6 className="card-header">Detalle lote produccion</h6>
            <div className="card-body">
              <form className="row mb-4 mt-4 d-flex flex-row justify-content-start align-items-end">
                {/* AGREGAR PRODUCTO */}
                <div className="col-md-3">
                  <label className="form-label">Producto</label>
                  {/* <FilterAllProductos onNewInput={onProductoId} /> */}
                  <FilterAllProductos />
                </div>
                {/* BOTON AGREGAR PRODUCTO */}
                <div className="col-md-3 d-flex justify-content-end align-self-center ms-auto">
                  <button
                    // onClick={handleAddProductoDetalle}
                    className="btn btn-primary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus-circle-fill me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                    </svg>
                    Agregar
                  </button>
                </div>
              </form>
              {/* PRODUCTOS FINALES O SUBPRODUCTOS */}
              <Paper>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow
                        sx={{
                          "& th": {
                            color: "rgba(96, 96, 96)",
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        <TableCell align="left" width={200}>
                          <b>Nombre</b>
                        </TableCell>
                        <TableCell align="left" width={20}>
                          <b>U.M</b>
                        </TableCell>
                        <TableCell align="left" width={150}>
                          <b>Almacen</b>
                        </TableCell>
                        <TableCell align="left" width={150}>
                          <b>Cantidad</b>
                        </TableCell>
                        <TableCell align="left" width={150}>
                          <b>Acciones</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody></TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          </div>
          {/* DATOS DEL DETALLE */}
          <div className="card d-flex mt-4">
            <h6 className="card-header">Detalle de las requisiciones</h6>
            <div className="card-body">
              <div className="card d-flex mt-3">
                <h6 className="card-header">Detalle materia prima</h6>
                <div className="card-body">
                  <Paper>
                    <TableContainer>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow
                            sx={{
                              "& th": {
                                color: "rgba(96, 96, 96)",
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                          >
                            <TableCell align="left" width={200}>
                              <b>Nombre</b>
                            </TableCell>
                            <TableCell align="left" width={20}>
                              <b>U.M</b>
                            </TableCell>
                            <TableCell align="left" width={150}>
                              <b>Almacen</b>
                            </TableCell>
                            <TableCell align="left" width={150}>
                              <b>Cantidad</b>
                            </TableCell>
                            <TableCell align="left" width={150}>
                              <b>Acciones</b>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody></TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </div>
              {/* DETALLE DE ENVASADO */}
              <div className="card d-flex mt-3">
                <h6 className="card-header">Detalle envasado</h6>
                <div className="card-body">
                  <Paper>
                    <TableContainer>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow
                            sx={{
                              "& th": {
                                color: "rgba(96, 96, 96)",
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                          >
                            <TableCell align="left" width={200}>
                              <b>Nombre</b>
                            </TableCell>
                            <TableCell align="left" width={20}>
                              <b>U.M</b>
                            </TableCell>
                            <TableCell align="left" width={150}>
                              <b>Almacen</b>
                            </TableCell>
                            <TableCell align="left" width={150}>
                              <b>Cantidad</b>
                            </TableCell>
                            <TableCell align="left" width={150}>
                              <b>Acciones</b>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody></TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </div>
              {/* DETALLE DE ENCAJONADO */}
              <div className="card d-flex mt-3">
                <h6 className="card-header">Detalle encajonado</h6>
                <div className="card-body">
                  <Paper>
                    <TableContainer>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow
                            sx={{
                              "& th": {
                                color: "rgba(96, 96, 96)",
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                          >
                            <TableCell align="left" width={200}>
                              <b>Nombre</b>
                            </TableCell>
                            <TableCell align="left" width={20}>
                              <b>U.M</b>
                            </TableCell>
                            <TableCell align="left" width={150}>
                              <b>Almacen</b>
                            </TableCell>
                            <TableCell align="left" width={150}>
                              <b>Cantidad</b>
                            </TableCell>
                            <TableCell align="left" width={150}>
                              <b>Acciones</b>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody></TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
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
