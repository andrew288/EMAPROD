import React, { useState, useEffect } from "react";
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

import { getProduccionWhitProductosFinales } from "./../../helpers/producto-produccion/getProduccionWhitProductosFinales";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RowProductosAgregadosProduccion } from "./../../components/RowProductosAgregadosProduccion";
import { FilterProductoProduccion } from "../../../components/ReferencialesFilters/Producto/FilterProductoProduccion";
import { PackAsyncFilterProductosProduccionLote } from "./../../components/PackAsyncFilterProductosProduccionLote";
import { RowProductosDisponiblesProduccion } from "./../../components/RowProductosDisponiblesProduccion";

export const AgregarProductosLoteProduccion = () => {
  // RECIBIMOS LOS PARAMETROS DE LA URL
  const { id } = useParams();

  // ESTADOS DE LOS PRODUCTOS FINALES DE LA PRODUCCION
  const [proFinProd, setProFinProd] = useState({
    codLotProd: "",
    klgLotProd: 0.0,
    idProdt: 0,
    nomProd: "",
    idProdEst: 0,
    desEstPro: "",
    idProdTip: 0,
    desProdTip: "",
    proFinProdDet: [],
  });

  const {
    codLotProd,
    nomProd,
    klgLotProd,
    desEstPro,
    desProdTip,
    proFinProdDet,
  } = proFinProd;

  // PRODUCTOS FINALES DISPONIBLES POR PRODUCCIÓN
  const [proDisProd, setProDisProd] = useState([]);

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

  const obtenerDataProductosFinalesProduccion = async () => {
    const idParse = parseInt(id);
    const resultPeticion = await getProduccionWhitProductosFinales(idParse);

    const { message_error, description_error, result } = resultPeticion;
    if (message_error.length === 0) {
      setProFinProd(result[0]);
    } else {
      setfeedbackMessages({
        style_message: "error",
        feedback_description_error: description_error,
      });
      handleClickFeeback();
    }
  };

  // AÑADIR PRODUCTOS FINALES AL DETALLE
  const onAddProductosFinalesLoteProduccion = (producto) => {
    console.log(producto);
    // primero evaluamos que no exista el producto en el detalle
    const findProducto = proDisProd.find(
      (element) => element.id === producto.id
    );
    if (!findProducto) {
      const newData = [...proDisProd, producto];
      setProDisProd(newData);
    } else {
      console.log("Ya se agrego este producto");
    }
  };

  // ELIMINAR PRODUCTOS FINALES DETALLE
  const onDeleteProductosFinalesLoteProducccion = (id) => {
    const filterData = proDisProd.filter((element) => {
      if (element.id !== id) {
        return element;
      }
    });
    setProDisProd(filterData);
  };

  // EDITAR PRODUCTOS FINALES DETALLE
  const onChangeProductosFinalesLoteProduccion = () => {};

  // CODIGO QUE SE EJECUTA ANTES DE LA RENDERIZACION
  useEffect(() => {
    obtenerDataProductosFinalesProduccion();
  }, []);

  return (
    <div className="container-fluid mx-3">
      <h1 className="mt-4 text-center">Agregar Productos Finales</h1>
      {/* DATOS DE LA PRODUCCION */}
      <div className="row mt-4 mx-4">
        <div className="card d-flex">
          <h6 className="card-header">Datos del lote de produccion</h6>
          <div className="card-body">
            {/* PRODUCCION LOTE */}
            <div className="mb-3 row">
              {/* NUMERO DE LOTE */}
              <div className="col-md-2">
                <label htmlFor="nombre" className="form-label">
                  Numero de lote
                </label>
                <input
                  type="text"
                  name="codLotProd"
                  disabled
                  value={codLotProd}
                  className="form-control"
                />
              </div>

              {/* ESTADO PRODUCCION */}
              <div className="col-md-3">
                <label htmlFor="nombre" className="form-label">
                  Estado producción
                </label>
                <input
                  type="text"
                  name="desEstPro"
                  disabled
                  value={desEstPro}
                  className="form-control"
                />
              </div>

              {/* KILOGRAMOS */}
              <div className="col-md-2">
                <label htmlFor="nombre" className="form-label">
                  Peso
                </label>
                <input
                  type="text"
                  name="klgLotProd"
                  disabled
                  value={klgLotProd}
                  className="form-control"
                />
              </div>
            </div>
            {/* PRODUCTO */}
            <div className="mb-3 row">
              <div className="col-md-4">
                <label htmlFor="nombre" className="form-label">
                  Producto
                </label>
                <input
                  type="text"
                  name="nomProd"
                  disabled
                  value={nomProd}
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="nombre" className="form-label">
                  Tipo produccion
                </label>
                <input
                  type="text"
                  name="desProdTip"
                  disabled
                  value={desProdTip}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTOS AGREGADOS */}
        <div className="card d-flex mt-4">
          <h6 className="card-header">
            <b>Productos agregados</b>
          </h6>
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
                      <TableCell align="left" width={70}>
                        <b>Unidad</b>
                      </TableCell>
                      <TableCell align="left" width={70}>
                        <b>Clase</b>
                      </TableCell>
                      <TableCell align="left" width={70}>
                        <b>Sub clase</b>
                      </TableCell>
                      <TableCell align="left" width={70}>
                        <b>Cantidad</b>
                      </TableCell>
                      <TableCell align="left" width={70}>
                        <b>Acciones</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {proFinProdDet.map((row, i) => (
                      <RowProductosAgregadosProduccion
                        key={row.id}
                        detalle={row}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </div>
        </div>

        {/* PRODUCTOS POR AGREGAR */}
        <div className="card d-flex mt-4">
          <h6 className="card-header">
            <b>Lista productos</b>
          </h6>
          <div className="card-body">
            {/* FILTROS DE PRODUCTO */}
            <PackAsyncFilterProductosProduccionLote
              key={"unique-key"}
              onAddProducto={onAddProductosFinalesLoteProduccion}
            />
            {/* LISTA DE PRODUCTOS */}
            <div className="mb-3 row">
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
                        <TableCell align="left" width={70}>
                          <b>Unidad</b>
                        </TableCell>
                        <TableCell align="left" width={70}>
                          <b>Clase</b>
                        </TableCell>
                        <TableCell align="left" width={70}>
                          <b>Sub clase</b>
                        </TableCell>
                        <TableCell align="left" width={70}>
                          <b>Cantidad</b>
                        </TableCell>
                        <TableCell align="left" width={100}>
                          <b>Acciones</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {proDisProd.map((row, i) => (
                        <RowProductosDisponiblesProduccion
                          key={row.idProdt}
                          detalle={row}
                          onDeleteDetalle={
                            onDeleteProductosFinalesLoteProducccion
                          }
                          onChangeDetalle={
                            onChangeProductosFinalesLoteProduccion
                          }
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
