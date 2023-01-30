import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// IMPORTACIONES PARA TABLE MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
//IMPORTACIONES PARA DIALOG DELETE
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { FilterProducto } from "../../components/FilterProducto";
import { FilterMateriaPrimaWhitId } from "./../../components/FilterMateriaPrimaWhitId";
import { getMateriaPrimaById } from "./../../../almacen/helpers/materia-prima/getMateriaPrimaById";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AgregarFormula = () => {
  // ESTADOS PARA DATOS DE FORMULARO FORMULA
  const [formula, setformula] = useState({
    idProd: 0,
    nomFor: "",
    desFor: "",
    lotKgrFor: 1500,
    forDet: [], // DETALLE DE FORMULAS
  });
  const { idProd, nomFor, desFor, lotKgrFor, forDet } = formula;

  // ESTADOS PARA DATOS DE DETALLE FORMULA
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

  const handleAddNewMateriPrimaDetalle = async (e) => {
    e.preventDefault();

    // PRIMERO VERIFICAMOS SI EXISTE ALGUNA COINCIDENCIA DE LO INGRESADO
    const itemFound = forDet.find((elemento) => elemento.id === idMateriaPrima);
    if (itemFound) {
      setfeedbackMessages({
        style_message: "warning",
        feedback_description_error: "Ya se agrego esta materia prima",
      });
      handleClickFeeback();
    } else {
      // HACEMOS UNA CONSULTA A LA MATERIA PRIMA Y DESESTRUCTURAMOS
      const result = await getMateriaPrimaById(idMateriaPrima);
      const { id, refCodMatPri, nomMatPri, simMed } = result[0];

      // GENERAMOS NUESTRO DETALLE DE FORMULA DE MATERIA PRIMA
      const detalleFormulaMateriaPrima = {
        id: id,
        refCodMatPri: refCodMatPri,
        nomMatPri: nomMatPri,
        simMed: simMed,
        cantidad: cantidadMateriaPrima,
      };

      // SETEAMOS SU ESTADO PARA QUE PUEDA SER MOSTRADO EN LA TABLA DE DETALLE
      const dataMateriaPrimaDetalle = [...forDet, detalleFormulaMateriaPrima];
      setformula({
        ...formula,
        forDet: dataMateriaPrimaDetalle,
      });
      console.log(dataMateriaPrimaDetalle);
    }
  };

  // MANEJADOR DE ELIMINACION DE MATERIA PRIMA
  const deleteDetalleMateriaPrima = (idItem) => {
    const nuevaDataDetalleFormulario = forDet.filter((element) => {
      if (element.id !== idItem) {
        return element;
      } else {
        return false;
      }
    });
    console.log(nuevaDataDetalleFormulario);
    setformula({
      ...formula,
      forDet: nuevaDataDetalleFormulario,
    });
  };

  // CONTROLADOR DE FORMULARIO
  const handledForm = ({ target }) => {
    const { name, value } = target;
    setformula({
      ...formula,
      [name]: value,
    });
  };

  // EVENTO DE ASOCIAR FORMULA A UN PRODUCTO
  const onAddProducto = ({ value }) => {
    setformula({
      ...formula,
      idProd: value,
    });
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

  // FUNCION PARA CREAR FORMULARIO
  const crearFormula = async () => {
    console.log(formula);
    setInterval(() => {
      setdisableButton(false);
    }, 1000);
  };

  // CONTROLADOR DE SUBMIT
  const handleSubmitFormula = (e) => {
    e.preventDefault();
    if (
      nomFor.length === 0 ||
      idProd === 0 ||
      lotKgrFor < 0 ||
      forDet.length === 0
    ) {
      // MANEJAMOS FORMULARIOS INCOMPLETOS
      setfeedbackMessages({
        style_message: "warning",
        feedback_description_error: "Asegurese de llenar los datos requeridos",
      });
      handleClickFeeback();
    } else {
      setdisableButton(true);
      // LLAMAMOS A LA FUNCION CREAR MATERIA PRIMA
      crearFormula();
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Agregar Formula</h1>
        <form className="mt-4">
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
              Nombre Formula
            </label>
            <div className="col-md-3">
              <input
                type="text"
                name="nomFor"
                onChange={handledForm}
                value={nomFor}
                className="form-control"
              />
            </div>
          </div>
          {/* DESCRIPCION */}
          <div className="mb-3 row">
            <label htmlFor="descripcion" className="col-sm-2 col-form-label">
              Descripción
            </label>
            <div className="col-md-4">
              <div className="form-floating">
                <textarea
                  value={desFor}
                  onChange={handledForm}
                  name="desFor"
                  className="form-control"
                  placeholder="Leave a comment here"
                ></textarea>
              </div>
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
                name="lotKgrFor"
                onChange={handledForm}
                value={lotKgrFor}
                className="form-control"
              />
            </div>
          </div>
        </form>

        <div className="container mt-5">
          <h3 className="">Agregar insumos</h3>
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
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forDet
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
                        <TableCell align="left">
                          <div className="btn-toolbar">
                            <button
                              onClick={() => {
                                deleteDetalleMateriaPrima(row.id);
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
              count={forDet.length}
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
            onClick={handleSubmitFormula}
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
