import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import "../styles/style-modal.css";

export const RequisicionSeleccionDetalle = ({ detalle, onClose }) => {
  return (
    <div
      className="modal"
      tabIndex="-1"
      role="dialog"
      style={{
        display: detalle !== null ? "block" : "none",
      }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalle de la requisicion</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
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
                      <TableCell align="left" width={150}>
                        <b>Materia Prima</b>
                      </TableCell>
                      <TableCell align="left" width={70}>
                        <b>Cantidad</b>
                      </TableCell>
                      <TableCell align="left" width={70}>
                        <b>Estado</b>
                      </TableCell>
                      <TableCell align="left" width={50}>
                        <b>Acciones</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detalle.map((detalle, i) => (
                      <TableRow
                        key={detalle.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="detalle">
                          {detalle.nomProd}
                        </TableCell>
                        <TableCell align="left">
                          {detalle.canReqSelDet}
                        </TableCell>
                        <TableCell align="left">
                          <span
                            className={
                              detalle.idReqSelDetEst === 1
                                ? "badge text-bg-danger"
                                : "badge text-bg-success"
                            }
                          >
                            {detalle.desReqSelDetEst}
                          </span>
                        </TableCell>
                        <TableCell align="left">
                          <div className="btn-toolbar">
                            <Link
                              style={{
                                pointerEvents:
                                  detalle.idReqSelDetEst !== 1 ? "none" : "",
                              }}
                              to={`/almacen/requisicion-seleccion/salida-stock?idReqSelDet=${detalle.id}`}
                              className={
                                detalle.idReqSelDetEst !== 1
                                  ? "btn btn-secondary me-2"
                                  : "btn btn-warning me-2"
                              }
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
                                  detalle.idReqSelDetEst === 4 ||
                                  detalle.idReqSelDetEst === 1
                                    ? "none"
                                    : "",
                              }}
                              to={`/almacen/requisicion-seleccion/entrada-stock?idReqSelDet=${detalle.id}`}
                              className={
                                detalle.idReqSelDetEst === 4 ||
                                detalle.idReqSelDetEst === 1
                                  ? "btn btn-secondary me-2"
                                  : "btn btn-primary me-2"
                              }
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
