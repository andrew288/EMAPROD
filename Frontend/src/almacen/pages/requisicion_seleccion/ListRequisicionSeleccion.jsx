import React, { useState, useEffect, useRef } from "react";
// IMPORTACIONES PARA TABLE MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Link } from "react-router-dom";
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
import { getRequisicionSeleccionWithDetalle } from "./../../helpers/requisicion-seleccion/getRequisicionSeleccionWithDetalle";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ListRequisicionSeleccion = () => {
  const refTable = useRef();
  // ESTADOS PARA LOS FILTROS PERSONALIZADOS
  const [dataRequisicion, setdataRequisicion] = useState([]);
  const [dataRequisicionTemp, setdataRequisicionTemp] = useState([]);
  const [filters, setfilters] = useState({
    filterCodLotMol: "",
    filterDate: 0,
    filtersState: "",
  });
  const { filterCodLotMol, filterDate, filtersState } = filters;

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

  //FUNCION PARA TRAER LA DATA DE REQUISICION MOLIENDA
  const obtenerDataRequisicionSeleccion = async () => {
    const resultPeticion = await getRequisicionSeleccionWithDetalle();
    setdataRequisicion(resultPeticion);
    setdataRequisicionTemp(resultPeticion);
  };

  // MOSTRAR Y OCULTAR DETALLE DE REQUISICION MOLIENDA
  const showHiddenRequisicionSeleccionDetalle = (idPosElement) => {
    let requisicionDetalleIndex =
      refTable.current.children[idPosElement * 2 + 1];
    if (requisicionDetalleIndex.hidden) {
      requisicionDetalleIndex.hidden = false;
    } else {
      requisicionDetalleIndex.hidden = true;
    }
  };

  // TRAEMOS LA DATA ANTES DE QUE SE RENDERICE EL COMPONENTE
  useEffect(() => {
    obtenerDataRequisicionSeleccion();
  }, []);

  return (
    <>
      <div className="container">
        <form className="row mb-4 mt-4 d-flex flex-row justify-content-start align-items-end">
          <div className="col-md-4">FILTER FOR LOTE</div>
          <div className="col-md-4">FILTER FOR DATE</div>
          <div className="col-md-4">FILTER FOR STATTE</div>
        </form>

        <div className="">
          <table className="table">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody ref={refTable}>
              {dataRequisicionTemp.map((row, i) => (
                <>
                  <tr key={row.id}>
                    <td>{row.codReqSel}</td>
                    <td>{row.canReqSel}</td>
                    <td>{row.desReqSelEst}</td>
                    <td>{row.fecPedReqSel}</td>
                    <td>
                      <div className="btn-toolbar">
                        <button
                          onClick={() => {
                            showHiddenRequisicionSeleccionDetalle(i);
                          }}
                          className="btn btn-primary me-2"
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
                        <button
                          // disabled={
                          //   row.idReqMolEst == 2 || row.idReqMolEst == 3
                          //     ? true
                          //     : false
                          // }
                          className="btn btn-success"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-check-all"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr key={row.codLotReqMol} hidden={true}>
                    <td colSpan={6}>
                      <div>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Codigo</th>
                              <th>Nombre</th>
                              <th>Cantidad</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {row.reqSelDet.map((row_item) => (
                              <tr key={row_item.id}>
                                <td>{row_item.codMatPri}</td>
                                <td>{row_item.nomMatPri}</td>
                                <td>{row_item.canReqSelDet}</td>
                                <td>{row_item.desReqSelDetEst}</td>
                                <td>
                                  <div className="btn-toolbar">
                                    <Link
                                      style={{
                                        pointerEvents:
                                          row_item.idReqSelDetEst !== 1
                                            ? "none"
                                            : "",
                                      }}
                                      to={`/almacen/requisicion-seleccion/salida-stock?idReqSelDet=${row_item.id}`}
                                      className="btn btn-warning me-2"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-caret-down-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                                      </svg>
                                    </Link>
                                    <Link
                                      style={{
                                        pointerEvents:
                                          row_item.idReqSelDetEst === 4 ||
                                          row_item.idReqSelDetEst === 1
                                            ? "none"
                                            : "",
                                      }}
                                      to={`/almacen/requisicion-seleccion/entrada-stock?idReqSelDet=${row_item.id}`}
                                      className="btn btn-secondary me-2"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-caret-up-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                                      </svg>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        {/* <Paper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" width={100}>
                    Numero
                  </TableCell>
                  <TableCell align="left" width={300}>
                    Producto
                  </TableCell>
                  <TableCell align="left" width={150}>
                    Cantidad
                  </TableCell>
                  <TableCell align="left" width={150}>
                    Peso lote
                  </TableCell>
                  <TableCell align="left" width={150}>
                    Estado
                  </TableCell>
                  <TableCell align="left" width={200}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataRequisicionTemp
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <>
                      <TableRow
                        key={`${row.id}`}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.codLotReqMol}
                        </TableCell>
                        <TableCell align="left">{row.nomProd}</TableCell>
                        <TableCell align="left">{row.canLotReqMol}</TableCell>
                        <TableCell align="left">
                          {row.klgLotReqMol}&nbsp;{"KG"}
                        </TableCell>
                        <TableCell align="left">{row.desReqMolEst}</TableCell>
                        <TableCell align="left">
                          <button>
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
                          <div className="btn-toolbar">
                            <Link
                                        to={`/molienda/producto/actualizar/${row.id}`}
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
                                    </Link>
                                    <button
                                        onClick={() => {
                                        openDialogDeleteItem(row);
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
                    </>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper> */}
      </div>
    </>
  );
};
