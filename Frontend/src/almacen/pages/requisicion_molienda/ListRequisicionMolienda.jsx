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
import { getRequisicionMoliendaWithDetalle } from "./../../helpers/requisicion-molienda/getRequisicionMoliendaWithDetalle";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ListRequisicionMolienda = () => {
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
  const obtenerDataRequisicionMolienda = async () => {
    const resultPeticion = await getRequisicionMoliendaWithDetalle();
    setdataRequisicion(resultPeticion);
    setdataRequisicionTemp(resultPeticion);
  };

  // MOSTRAR Y OCULTAR DETALLE DE REQUISICION MOLIENDA
  const showHiddenRequisicionMoliendaDetalle = (idPosElement) => {
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
    obtenerDataRequisicionMolienda();
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
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Peso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody ref={refTable}>
              {dataRequisicionTemp.map((row, i) => (
                <>
                  <tr key={row.id}>
                    <td>{row.codLotReqMol}</td>
                    <td>{row.nomProd}</td>
                    <td>{row.canLotReqMol}</td>
                    <td>
                      {row.klgLotReqMol}&nbsp;{"KG"}
                    </td>
                    <td>{row.desReqMolEst}</td>
                    <td>
                      <div className="btn-toolbar">
                        <button
                          onClick={() => {
                            showHiddenRequisicionMoliendaDetalle(i);
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
                          disabled={
                            row.idReqMolEst == 2 || row.idReqMolEst == 3
                              ? true
                              : false
                          }
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
                            {row.reqMolDet.map((row_item) => (
                              <tr key={row_item.id}>
                                <td>{row_item.codMatPri}</td>
                                <td>{row_item.nomMatPri}</td>
                                <td>{row_item.canReqMolDet}</td>
                                <td>{row_item.desReqMolDetEst}</td>
                                <td>
                                  <div className="btn-toolbar">
                                    <Link
                                      style={{
                                        pointerEvents:
                                          row_item.idReqMolDetEst == 2
                                            ? "none"
                                            : "",
                                      }}
                                      to={`/almacen/salidas-stock/crear?idReqMolDet=${row_item.id}`}
                                      className="btn btn-warning me-2"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-journal-check"
                                        viewBox="0 0 16 16"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                                        />
                                        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                                        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                                      </svg>
                                    </Link>
                                    <button
                                      disabled={
                                        row_item.idReqMolDetEst == 2
                                          ? true
                                          : false
                                      }
                                      className="btn btn-success me-2"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-check-lg"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                                      </svg>
                                    </button>
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
