import React, { useState } from "react";
// IMPORTACIONES PARA TABLE MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { FilterMateriaPrimaWhitId } from "./../../components/FilterMateriaPrimaWhitId";
import { FilterProducto } from "./../../components/FilterProducto";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AgregarRequisicionMolienda = () => {
  // ESTADOS PARA LOS DATOS DE REQUISICION
  const [requisicion, setRequisicion] = useState({
    numReqLot: "",
    idProd: 0,
    canReqLot: 0,
    klgReqLot: 0,
    fetPedReqLot: "",
    idReqLotEst: 0,
    reqMolDet: [], // DETALLE DE REQUISICION MOLIENDA
  });
  const {
    numReqLot,
    idProd,
    canReqLot,
    klgReqLot,
    fetPedReqLot,
    idReqLotEst,
    reqMolDet,
  } = requisicion;

  // ESTADOS PARA DATOS DE DETALLE FORMULA (DETALLE)
  const [materiaPrimaDetalle, setmateriaPrimaDetalle] = useState({
    idMateriaPrima: 0,
    cantidadMateriaPrima: 0,
  });
  const { idMateriaPrima, cantidadMateriaPrima } = materiaPrimaDetalle;

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

  // ESTADOS PARA LA PAGINACIÓN
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // MANEJADORES DE LA PAGINACION
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // CONTROLADOR DE FORMULARIO
  const handledForm = ({ target }) => {
    const { name, value } = target;
    setRequisicion({
      ...requisicion,
      [name]: value,
    });
  };

  // EVENTO DE ASOCIAR FORMULA A UN PRODUCTO
  const onAddProducto = ({ value }) => {
    setRequisicion({
      ...requisicion,
      idProd: value,
    });
  };

  // MANEJADOR DE AGREGAR MATERIA PRIMA A DETALLE DE FORMULA
  const onMateriaPrimaId = (value) => {
    setmateriaPrimaDetalle({
      ...materiaPrimaDetalle,
      idMateriaPrima: value,
    });
  };

  const handleCantidadMateriaPrima = ({ target }) => {
    const { name, value } = target;
    setmateriaPrimaDetalle({
      ...materiaPrimaDetalle,
      [name]: value,
    });
  };

  // ELIMINAR DETALLE DE REQUISICION
  const deleteDetalleRequisicion = () => {};
  // SUBMIT FORMULARIO DE REQUISICION (M-D)
  const handleSubmitRequisicion = () => {};

  // MANEJADOR COMPLETAR FORMULARIO SEGUN FORMULA
  const handleCompleteFormFormula = () => {};

  // FILTER POR FORMULA
  const onFilterFormula = () => {};

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Agregar Requisicion</h1>
        <div className=" container mt-4">
          <form className="row mb-4 mt-4 d-flex flex-row justify-content-start align-items-end">
            {/* FILTRO POR FORMULA */}
            <div className="col-md-3">
              <label htmlFor="inputPassword4" className="form-label">
                Formula
              </label>
              {/* <FilterFormula onNewInput={onFilterFormula} /> */}
            </div>
            {/* BOTON AGREGAR MATERIA PRIMA */}
            <div className="col-md-3 d-flex justify-content-end ms-auto">
              <button
                // onClick={handleAddNewMateriPrimaDetalle}
                onClick={handleCompleteFormFormula}
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
        </div>
        <form className="mt-4">
          {/* NUMERO DE LOTE */}
          <div className="mb-3 row">
            <label htmlFor="nombre" className="col-sm-2 col-form-label">
              Numero de Lote
            </label>
            <div className="col-md-1">
              <input
                type="text"
                name="numReqLot"
                onChange={handledForm}
                value={numReqLot}
                className="form-control"
              />
            </div>
          </div>
          {/* PRODUCTO */}
          <div className="mb-3 row">
            <label htmlFor="nombre" className="col-sm-2 col-form-label">
              Producto
            </label>
            <div className="col-md-3">
              <FilterProducto onNewInput={onAddProducto} />
            </div>
          </div>
          {/* NOMBRE FORMULA */}
          <div className="mb-3 row">
            <label htmlFor="categoria" className="col-sm-2 col-form-label">
              Cantidad
            </label>
            <div className="col-md-2">
              <input
                type="number"
                name="canReqLot"
                onChange={handledForm}
                value={canReqLot}
                className="form-control"
              />
            </div>
          </div>
          {/* KILOGRAMOS POR LOTE */}
          <div className="mb-3 row">
            <label htmlFor="stock" className="col-sm-2 col-form-label">
              Kilogramos de lote
            </label>
            <div className="col-md-2">
              <input
                type="number"
                name="klgReqLot"
                onChange={handledForm}
                value={klgReqLot}
                className="form-control"
              />
            </div>
          </div>
        </form>

        <div className="container mt-5">
          <h3 className="">Agregar Detalle</h3>
          <form className="row mb-4 mt-4 d-flex flex-row justify-content-start align-items-end">
            {/* AGREGAR MATERIA PRIMA */}
            <div className="col-md-3">
              <label htmlFor="inputPassword4" className="form-label">
                Materia Prima
              </label>
              <FilterMateriaPrimaWhitId onNewInput={onMateriaPrimaId} />
            </div>

            {/* AGREGAR CANTIDAD*/}
            <div className="col-md-4">
              <label htmlFor="inputPassword4" className="form-label">
                Cantidad
              </label>
              <input
                type="number"
                onChange={handleCantidadMateriaPrima}
                value={cantidadMateriaPrima}
                name="cantidadMateriaPrima"
                className="form-control"
              />
            </div>
            {/* BOTON AGREGAR MATERIA PRIMA */}
            <div className="col-md-3 d-flex justify-content-end ms-auto">
              <button className="btn btn-primary">
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
          {/* TABLA DE RESULTADOS */}
          <Paper>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" width={80}>
                      Código
                    </TableCell>
                    <TableCell align="left" width={350}>
                      Nombre
                    </TableCell>
                    <TableCell align="left" width={150}>
                      Stock
                    </TableCell>
                    <TableCell align="left" width={150}>
                      Estado
                    </TableCell>
                    <TableCell align="left" width={150}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reqMolDet
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.refCodMatPri}
                        </TableCell>
                        <TableCell align="left">{row.nomMatPri}</TableCell>
                        <TableCell align="left">
                          {row.cantidad}&nbsp;{row.simMed}
                        </TableCell>
                        <TableCell align="left">Requerido</TableCell>
                        <TableCell align="left">
                          <div className="btn-toolbar">
                            <button
                              onClick={() => {
                                deleteDetalleRequisicion(row.id);
                              }}
                              className="btn btn-danger"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                              </svg>
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* PAGINACION DE LA TABLA */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={reqMolDet.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>

        {/* BOTONES DE CANCELAR Y GUARDAR */}
        <div className="btn-toolbar mt-4">
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
            onClick={handleSubmitRequisicion}
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
