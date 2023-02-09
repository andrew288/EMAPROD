import React, { useState, useRef } from "react";
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
import { FilterMateriaPrimaSeleccionWhitId } from "./../../components/FilterMateriaPrimaSeleccionWhitId";
import { getMateriaPrimaById } from "./../../../almacen/helpers/materia-prima/getMateriaPrimaById";
import { createRequisicionSeleccionWithDetalle } from "./../../helpers/requisicion/createRequisicionSeleccionWithDetalle";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export const AgregarRequisicionSeleccion = () => {
  const refTable = useRef();

  // ESTADOS PARA LOS DATOS DE REQUISICION
  const [requisicion, setRequisicion] = useState({
    codReqSel: "",
    canReqSel: 1,
    idReqSelEst: 1,
    reqSelDet: [], // DETALLE DE REQUISICION MOLIENDA
  });
  const { codReqSel, canReqSel, idReqSelEst, reqSelDet } = requisicion;

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
  const deleteDetalleRequisicion = (idItem) => {
    // FILTRAMOS EL ELEMENTO ELIMINADO
    const nuevaDataDetalleRequisicion = reqSelDet.filter((element) => {
      if (element.idMatPri !== idItem) {
        return element;
      } else {
        return false;
      }
    });

    // VOLVEMOS A SETEAR LA DATA
    setRequisicion({
      ...requisicion,
      reqSelDet: nuevaDataDetalleRequisicion,
    });
  };

  // ACTUALIZAR DETALLE DE REQUISICION
  const updateDetalleRequisicion = (idPosElement) => {
    console.log("update");
    let inputSelected =
      refTable.current.children[idPosElement].childNodes[2].childNodes[0];

    if (inputSelected.disabled) {
      inputSelected.disabled = false;
    } else {
      inputSelected.disabled = true;
    }
  };

  // MANEJADOR PARA ACTUALIZAR REQUISICION
  const handledFormularioDetalle = ({ target }, index) => {
    const { value } = target;
    let editFormDetalle = [...reqSelDet];
    const aux = { ...reqSelDet[index], canMatPriFor: value };
    editFormDetalle[index] = aux;

    setRequisicion({
      ...requisicion,
      reqSelDet: editFormDetalle,
    });
  };

  // FUNCION ASINCRONA PARA CREAR LA REQUISICION CON SU DETALLE
  const crearRequisicion = async () => {
    console.log(requisicion);
    const { message_error, description_error } =
      await createRequisicionSeleccionWithDetalle(requisicion);

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

  // SUBMIT FORMULARIO DE REQUISICION (M-D)
  const handleSubmitRequisicion = (e) => {
    e.preventDefault();
    if (codReqSel.length === 0 || reqSelDet.length === 0) {
      setfeedbackMessages({
        style_message: "warning",
        feedback_description_error:
          "Asegurate de completar los campos requeridos",
      });
      handleClickFeeback();
    } else {
      // setdisableButton(true);
      // LLAMAMOS A LA FUNCION CREAR REQUISICION
      crearRequisicion();
      // RESETEAMOS LOS VALORES
    }
  };

  // AGREGAR MATERIA PRIMA A DETALLE DE REQUISICION
  const handleAddNewMateriPrimaDetalle = async (e) => {
    e.preventDefault();

    // PRIMERO VERIFICAMOS QUE LOS INPUTS TENGAN DATOS
    if (idMateriaPrima !== 0 && cantidadMateriaPrima > 0) {
      // PRIMERO VERIFICAMOS SI EXISTE ALGUNA COINCIDENCIA DE LO INGRESADO
      const itemFound = reqSelDet.find(
        (elemento) => elemento.idMatPri === idMateriaPrima
      );
      if (itemFound) {
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error: "Ya se agrego esta materia prima",
        });
        handleClickFeeback();
      } else {
        // HACEMOS UNA CONSULTA A LA MATERIA PRIMA Y DESESTRUCTURAMOS
        const result = await getMateriaPrimaById(idMateriaPrima);
        const { id, codMatPri, nomMatPri, simMed } = result[0];
        // GENERAMOS NUESTRO DETALLE DE FORMULA DE MATERIA PRIMA
        const detalleFormulaMateriaPrima = {
          idMatPri: id,
          codMatPri: codMatPri,
          nomMatPri: nomMatPri,
          simMed: simMed,
          canMatPriFor: cantidadMateriaPrima,
        };
        // SETEAMOS SU ESTADO PARA QUE PUEDA SER MOSTRADO EN LA TABLA DE DETALLE
        const dataMateriaPrimaDetalle = [
          ...reqSelDet,
          detalleFormulaMateriaPrima,
        ];
        setRequisicion({
          ...requisicion,
          reqSelDet: dataMateriaPrimaDetalle,
        });
      }
    } else {
      setfeedbackMessages({
        style_message: "warning",
        feedback_description_error: "Asegurese de llenar los datos requeridos",
      });
      handleClickFeeback();
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Agregar Requisicion</h1>
        <form className="mt-4">
          {/* NUMERO DE LOTE */}
          <div className="mb-3 row">
            <label htmlFor="nombre" className="col-sm-2 col-form-label">
              Numero de Lote
            </label>
            <div className="col-md-2">
              <input
                type="text"
                name="codReqSel"
                onChange={handledForm}
                value={codReqSel}
                className="form-control"
              />
            </div>
          </div>
          {/* CANTIDAD REQUISICION */}
          <div className="mb-3 row">
            <label htmlFor="categoria" className="col-sm-2 col-form-label">
              Cantidad
            </label>
            <div className="col-md-2">
              <input
                type="number"
                name="canReqSel"
                onChange={handledForm}
                value={canReqSel}
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
              <FilterMateriaPrimaSeleccionWhitId
                onNewInput={onMateriaPrimaId}
              />
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
              <button
                onClick={handleAddNewMateriPrimaDetalle}
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
                <TableBody ref={refTable}>
                  {reqSelDet
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow
                        key={row.idMatPri}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.codMatPri}
                        </TableCell>
                        <TableCell align="left">{row.nomMatPri}</TableCell>
                        <TableCell align="left">
                          <input
                            id={`input-cantidad-${row.idMatPri}`}
                            onChange={(e) => {
                              handledFormularioDetalle(e, i);
                            }}
                            type="number"
                            value={row.canMatPriFor}
                            disabled={true}
                          />
                          &nbsp;{row.simMed}
                        </TableCell>
                        <TableCell align="left">Requerido</TableCell>
                        <TableCell align="left">
                          <div className="btn-toolbar">
                            <button
                              onClick={() => {
                                updateDetalleRequisicion(i);
                              }}
                              className="btn btn-success me-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-pencil-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                deleteDetalleRequisicion(row.idMatPri);
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
              count={reqSelDet.length}
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
