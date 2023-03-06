import React, { useEffect, useState } from "react";
import { useForm } from "./../../../hooks/useForm";
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
import MuiAlert from "@mui/material/Alert";
import { getFormulaDetalle } from "./../../helpers/formula/getFormulaDetalle";
import { TextField } from "@mui/material";
import FechaPickerDay from "./../../../components/Fechas/FechaPickerDay";
import { FormulaDetalle } from "./../../components/FormulaDetalle";
import { Link } from "react-router-dom";
import { FilterProductoProduccion } from "./../../../components/ReferencialesFilters/Producto/FilterProductoProduccion";
import { FilterTipoFormula } from "../../../components/ReferencialesFilters/Formula/FilterTipoFormula";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ListFormulas = () => {
  // ESTADOS PARA LOS FILTROS PERSONALIZADOS
  const [dataFormula, setdataFormula] = useState([]);
  const [dataFormulaTemp, setdataFormulaTemp] = useState([]);

  // ESTADOS PARA EL MODAL
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);

  // ESTADOS PARA LA PAGINACIÓN
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ESTADO PARA CONTROLAR EL FEEDBACK
  const [feedbackDelete, setfeedbackDelete] = useState(false);
  const [feedbackMessages, setfeedbackMessages] = useState({
    style_message: "",
    feedback_description_error: "",
  });
  const { style_message, feedback_description_error } = feedbackMessages;

  // MANEJADORES DE FEEDBACK
  const handleClickFeeback = () => {
    setfeedbackDelete(true);
  };

  const handleCloseFeedback = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setfeedbackDelete(false);
  };

  // MANEJADORES DE LA PAGINACION
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejadores de cambios
  const handleFormFilter = ({ target }) => {
    const { name, value } = target;
    filter(value, name);
  };

  const onChangeProducto = ({ label }) => {
    filter(label, "filterProducto");
  };

  const onChangeTipoFormula = ({ label }) => {
    filter(label, "filterTipoFormula");
  };

  const onChangeDateFechaCreado = (newDate) => {
    const dateFilter = newDate.split(" ");
    filter(dateFilter[0], "filterFechaCreado");
  };

  const onChangeDateFechaActualizado = (newDate) => {
    const dateFilter = newDate.split(" ");
    filter(dateFilter[0], "filterFechaActualizado");
  };

  // Funcion para filtrar la data
  const filter = (terminoBusqueda, name) => {
    let resultSearch = [];
    switch (name) {
      case "filterProducto":
        resultSearch = dataFormula.filter((element) => {
          if (
            element.nomProd
              .toString()
              .toLowerCase()
              .includes(terminoBusqueda.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        });
        setdataFormulaTemp(resultSearch);
        break;
      case "filterNombreFormula":
        console.log(terminoBusqueda);
        resultSearch = dataFormula.filter((element) => {
          if (
            element.nomFor
              .toString()
              .toLowerCase()
              .includes(terminoBusqueda.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        });
        setdataFormulaTemp(resultSearch);
        break;
      case "filterTipoFormula":
        resultSearch = dataFormula.filter((element) => {
          if (
            element.desTipFor
              .toString()
              .toLowerCase()
              .includes(terminoBusqueda.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        });
        setdataFormulaTemp(resultSearch);
        break;
      case "filterPesoFormula":
        resultSearch = dataFormula.filter((element) => {
          if (
            element.lotKgrFor
              .toString()
              .toLowerCase()
              .includes(terminoBusqueda.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        });
        setdataFormulaTemp(resultSearch);
        break;
      case "filterFechaCreado":
        resultSearch = dataFormula.filter((element) => {
          let aux = element.fecCreFor.split(" ");
          if (
            aux[0]
              .toString()
              .toLowerCase()
              .includes(terminoBusqueda.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        });
        setdataFormulaTemp(resultSearch);
        break;
      case "filterFechaActualizado":
        resultSearch = dataFormula.filter((element) => {
          if (element.fecTerReqMol !== null) {
            let aux = element.fecActFor.split(" ");
            if (
              aux[0]
                .toString()
                .toLowerCase()
                .includes(terminoBusqueda.toLowerCase())
            ) {
              return true;
            } else {
              return false;
            }
          }
        });
        setdataFormulaTemp(resultSearch);
        break;
      default:
        break;
    }
  };

  //FUNCION PARA TRAER LA DATA DE FORMULA
  const obtenerDataFormula = async () => {
    const resultPeticion = await getFormulaDetalle();
    const { message_error, description_error, result } = resultPeticion;
    if (message_error.length === 0) {
      setdataFormula(result);
      setdataFormulaTemp(result);
    } else {
      setfeedbackMessages({
        style_message: "error",
        feedback_description_error: description_error,
      });
      handleClickFeeback();
    }
  };

  // ******* REQUISICION MOLIENDA DETALLE ********

  const closeDetalleFormula = () => {
    // ocultamos el modal
    setMostrarDetalle(false);
    // dejamos el null la data del detalle
    setDetalleSeleccionado(null);
  };

  // MOSTRAR Y OCULTAR DETALLE DE REQUISICION MOLIENDA
  const showFormulaDetalle = (idPosElement) => {
    const formulaDetalle = dataFormulaTemp[idPosElement].forDet;
    // seteamos la data de la requisicion seleccionada
    setDetalleSeleccionado(formulaDetalle);
    // mostramos el modal
    setMostrarDetalle(true);
  };

  // ****** TRAEMOS LA DATA DE REQUISICION MOLIENDA ******
  useEffect(() => {
    obtenerDataFormula();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="mt-4">
          <Paper>
            <TableContainer>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        color: "rgba(96, 96, 96)",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell align="left" width={80}>
                      <b>Producto</b>
                      <FilterProductoProduccion onNewInput={onChangeProducto} />
                    </TableCell>
                    <TableCell align="left" width={150}>
                      <b>Nombre formula</b>
                      <TextField
                        name="filterNombreFormula"
                        onChange={handleFormFilter}
                        size="small"
                        autoComplete="off"
                        InputProps={{
                          style: {
                            color: "black",
                            background: "white",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" width={150}>
                      <b>Tipo formula</b>
                      <FilterTipoFormula onNewInput={onChangeTipoFormula} />
                    </TableCell>
                    <TableCell align="left" width={80}>
                      <b>Peso</b>
                      <TextField
                        name="filterPesoFormula"
                        type="number"
                        onChange={handleFormFilter}
                        size="small"
                        autoComplete="off"
                        InputProps={{
                          style: {
                            color: "black",
                            background: "white",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="left" width={140}>
                      <b>Fecha creado</b>
                      <FechaPickerDay
                        onNewfecEntSto={onChangeDateFechaCreado}
                      />
                    </TableCell>
                    <TableCell align="left" width={140}>
                      <b>Fecha actualizado</b>
                      <FechaPickerDay
                        onNewfecEntSto={onChangeDateFechaActualizado}
                      />
                    </TableCell>
                    <TableCell align="left" width={100}>
                      <b>Acciones</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataFormulaTemp
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, i) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.nomProd}
                        </TableCell>
                        <TableCell align="left">{row.nomFor}</TableCell>
                        <TableCell align="left">{row.desTipFor}</TableCell>
                        <TableCell align="left">{row.lotKgrFor}</TableCell>
                        <TableCell align="left">{row.fecCreFor}</TableCell>
                        <TableCell align="left">{row.fecActFor}</TableCell>
                        <TableCell align="left">
                          <div className="btn-toolbar">
                            <button
                              onClick={() => {
                                showFormulaDetalle(i);
                              }}
                              className="btn btn-primary me-2 btn"
                              data-toggle="modal"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                              </svg>
                            </button>
                            <Link
                              to={`/molienda/formula/actualizar/${row.id}`}
                              className="btn btn-warning btn"
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
                            </Link>
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
              count={dataFormulaTemp.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
          {mostrarDetalle && (
            <FormulaDetalle
              detalle={detalleSeleccionado}
              onClose={closeDetalleFormula}
            />
          )}
        </div>
      </div>
    </>
  );
};
