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
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { getMateriaPrimaById } from "./../../../helpers/Referenciales/producto/getMateriaPrimaById";
import { FilterAllProductos } from "./../../../components/ReferencialesFilters/Producto/FilterAllProductos";
import { TextField } from "@mui/material";
import { FilterAreaEncargada } from "../../components/FilterAreaEncargada";
import { RowEditDetalleFormulaProducto } from "./../../components/componentes-formula-producto/RowEditDetalleFormulaProducto";
import { createFormulaProductoWithDetalle } from "../../helpers/formula_producto/createFormulaProductoWithDetalle";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AgregarFormulaPorProducto = () => {
  // **************** ESTRUCTURAS NECESARIAS *************
  // DETALLES DEL MAESTRO
  const [formula, setformula] = useState({
    idProdFin: 0,
    forProdTerDet: [], // DETALLE DE FORMULAS
  });

  const { idProdFin, forProdTerDet } = formula;

  // DETALLES DEL FILTRO DE PRODUCTO
  const [productoDetalle, setproductoDetalle] = useState({
    idProd: 0,
    canForProDet: 0.0,
    idAre: 0,
    idAlm: 0,
  });

  const { idProd, canForProDet, idAre, idAlm } = productoDetalle;

  // ************* FEEDBACK ******************
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

  // ******** MANEJADORES DE LOS FILTROS **********
  // MANEJADOR DE AGREGAR PRODUCTO AL FILTRO
  const onProductoId = ({ id }) => {
    setproductoDetalle({
      ...productoDetalle,
      idProd: id,
    });
  };

  // MANEJADOR DE AGREGAR CANTIDAD AL FILTRO
  const handleCantidad = ({ target }) => {
    const { name, value } = target;
    setproductoDetalle({
      ...productoDetalle,
      [name]: value,
    });
  };

  // MAJEADOR PARA AGREGAR EL AREA AL FILTRO
  const handleAreaId = ({ id }) => {
    setproductoDetalle({
      ...productoDetalle,
      idAre: id,
    });
  };

  // *********** MANEJADOR DE ACCIONES ***************
  const handleAddProductoDetalle = async (e) => {
    console.log(productoDetalle);
    e.preventDefault();

    // primero verificamos que se tenga información
    if (idProd !== 0 && canForProDet > 0 && idAre !== 0) {
      // se verifica si existe alguna coincidencia de lo ingresado
      const itemFound = forProdTerDet.find(
        (element) => element.idProd === idProd
      );

      if (itemFound) {
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error: "Ya se agrego este producto",
        });
        handleClickFeeback();
      } else {
        // hacemos una consulta al producto y desestructuramos
        const resultPeticion = await getMateriaPrimaById(idProd);
        const { message_error, description_error, result } = resultPeticion;

        if (message_error.length === 0) {
          const { id, codProd, desCla, desSubCla, nomProd, simMed } = result[0];
          // generamos nuestro detalle de formula
          const detalleFormulaProducto = {
            idProd: id,
            idAre: idAre, // area
            idAlm: 0, // almacen de orgien
            codProd: codProd,
            desCla: desCla,
            desSubCla: desSubCla,
            nomProd: nomProd,
            simMed: simMed,
            canForProDet: canForProDet, // cantidad
          };

          // seteamos el detalle en general de la formula
          const dataDetalle = [...forProdTerDet, detalleFormulaProducto];
          console.log(dataDetalle);
          setformula({
            ...formula,
            forProdTerDet: dataDetalle,
          });
        } else {
          setfeedbackMessages({
            style_message: "error",
            feedback_description_error: description_error,
          });
          handleClickFeeback();
        }
      }
    } else {
      setfeedbackMessages({
        style_message: "warning",
        feedback_description_error: "Asegurese de llenar los datos requeridos",
      });
      handleClickFeeback();
    }
  };

  // MANEJADOR DE ELIMINACION DE PRODUCTO
  const handleDeleteDetalleProducto = (idItem) => {
    // filtramos el elemento eliminado
    const dataDetalleFormula = forProdTerDet.filter((element) => {
      if (element.idProd !== idItem) {
        return true;
      } else {
        return false;
      }
    });

    // VOLVEMOS A SETEAR LA DATA
    setformula({
      ...formula,
      forProdTerDet: dataDetalleFormula,
    });
  };

  // *********** EDICION DE LOS CAMPOS DEL DETALLE *************

  // EDICION DE CANTIDAD
  const handleFormulaDetalle = ({ target }, idItem) => {
    const { value } = target;
    const editFormDetalle = forProdTerDet.map((element) => {
      if (element.idProd === idItem) {
        return {
          ...element,
          canForProDet: value,
        };
      } else {
        return element;
      }
    });
    setformula({
      ...formula,
      forProdTerDet: editFormDetalle,
    });
  };

  // EDICION DE AREA
  const handledAreaEncargada = (idAre, idItem) => {
    const editFormDetalle = forProdTerDet.map((element) => {
      if (element.idProd === idItem) {
        return {
          ...element,
          idAre: idAre,
        };
      } else {
        return element;
      }
    });

    setformula({
      ...formula,
      forProdTerDet: editFormDetalle,
    });
  };

  // EDICION DE ALMACEN
  const handledAlmacenEncargado = (idAlm, idItem) => {
    const editFormDetalle = forProdTerDet.map((element) => {
      if (element.idProd === idItem) {
        return {
          ...element,
          idAlm: idAlm,
        };
      } else {
        return element;
      }
    });

    setformula({
      ...formula,
      forProdTerDet: editFormDetalle,
    });
  };

  // ********* EDICION DE DATOS DE LA FORMULA ***********

  // añadir producto final a formula
  const onAddProducto = ({ id }) => {
    setformula({
      ...formula,
      idProdFin: id,
    });
  };

  // ********** SUBMIT DEL FORMULARIO ************

  // FUNCION PARA CREAR FORMULARIO
  const crearFormula = async () => {
    console.log(formula);
    const { message_error, description_error } =
      await createFormulaProductoWithDetalle(formula);

    if (message_error.length === 0) {
      // regresamos a la anterior vista
      onNavigateBack();
    } else {
      setfeedbackMessages({
        style_message: "error",
        feedback_description_error: description_error,
      });
      handleClickFeeback();
    }
    setdisableButton(false);
  };

  const handleSubmitFormula = (e) => {
    e.preventDefault();
    if (idProd === 0 || forProdTerDet.length === 0) {
      if (forProdTerDet.length === 0) {
        // MANEJAMOS FORMULARIOS INCOMPLETOS
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error:
            "El detalle de la formula no puede estar vacio",
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
      const validAlmacenOrigen = forProdTerDet.find(
        (element) => element.idAlm === 0
      );
      if (validAlmacenOrigen) {
        // MANEJAMOS FORMULARIOS INCOMPLETOS
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error:
            "Asegurese de asignar almacenes de origen para cada item",
        });
        handleClickFeeback();
      } else {
        setdisableButton(true);
        // LLAMAMOS A LA FUNCION CREAR MATERIA PRIMA
        crearFormula();
      }
    }
  };

  return (
    <>
      <div className="container-fluid mx-3">
        <h1 className="mt-4 text-center">Agregar Formula de producto</h1>
        <div className="row mt-4 mx-2">
          <div className="card d-flex">
            <h6 className="card-header">Datos de la formula</h6>
            <div className="card-body">
              <form>
                {/* PRESENTACION FINAL */}
                <div className="mb-3 row">
                  <label htmlFor="nombre" className="col-sm-2 col-form-label">
                    Producto final
                  </label>
                  <div className="col-md-6">
                    <FilterAllProductos onNewInput={onAddProducto} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="row mt-4 mx-2">
          <div className="card d-flex">
            <h6 className="card-header">Detalle de la formula</h6>
            <div className="card-body">
              <form className="row mb-4 mt-4 d-flex flex-row justify-content-start align-items-end">
                {/* AGREGAR PRODUCTO */}
                <div className="col-md-3">
                  <label className="form-label">Producto</label>
                  <FilterAllProductos onNewInput={onProductoId} />
                </div>

                {/* AGREGAR AREA */}
                <div className="col-md-2">
                  <label className="form-label">Area solicitante</label>
                  <FilterAreaEncargada onNewInput={handleAreaId} />
                </div>

                {/* AGREGAR CANTIDAD*/}
                <div className="col-md-2">
                  <label className="form-label">Cantidad</label>
                  <TextField
                    type="number"
                    onChange={handleCantidad}
                    value={canForProDet}
                    name="canForProDet"
                    className="form-control"
                    size="small"
                  />
                </div>

                {/* BOTON AGREGAR PRODUCTO */}
                <div className="col-md-3 d-flex justify-content-end align-self-center ms-auto">
                  <button
                    onClick={handleAddProductoDetalle}
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
              {/* DETALLE DE MATERIA PRIMA */}
              <div className="card text-bg-primary d-flex">
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
                        <TableBody>
                          {forProdTerDet.map((row, i) => {
                            if (row.idAre === 2 || row.idAre === 7) {
                              return (
                                <RowEditDetalleFormulaProducto
                                  key={row.idProd}
                                  detalle={row}
                                  onDeleteDetalleFormula={
                                    handleDeleteDetalleProducto
                                  }
                                  onChangeFormulaDetalle={handleFormulaDetalle}
                                  onChangeAlmacenEncargadoDetalle={
                                    handledAlmacenEncargado
                                  }
                                />
                              );
                            }
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </div>
              {/* DETALLE DE ENVASADO */}
              <div className="card text-bg-success d-flex mt-3">
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
                        <TableBody>
                          {forProdTerDet.map((row, i) => {
                            if (row.idAre === 5) {
                              return (
                                <RowEditDetalleFormulaProducto
                                  key={row.idProd}
                                  detalle={row}
                                  onDeleteDetalleFormula={
                                    handleDeleteDetalleProducto
                                  }
                                  onChangeFormulaDetalle={handleFormulaDetalle}
                                  onChangeAlmacenEncargadoDetalle={
                                    handledAlmacenEncargado
                                  }
                                />
                              );
                            }
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </div>
              {/* DETALLE DE ENCAJONADO */}
              <div className="card text-bg-warning d-flex mt-3">
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
                        <TableBody>
                          {forProdTerDet.map((row, i) => {
                            if (row.idAre === 6) {
                              return (
                                <RowEditDetalleFormulaProducto
                                  key={row.idProd}
                                  detalle={row}
                                  onDeleteDetalleFormula={
                                    handleDeleteDetalleProducto
                                  }
                                  onChangeFormulaDetalle={handleFormulaDetalle}
                                  onChangeAlmacenEncargadoDetalle={
                                    handledAlmacenEncargado
                                  }
                                />
                              );
                            }
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </div>
            </div>
          </div>
          {/* BOTONES DE CANCELAR Y GUARDAR */}
          <div className="btn-toolbar mt-4">
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
              onClick={handleSubmitFormula}
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div>
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
