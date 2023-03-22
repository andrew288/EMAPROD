import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { viewProduccionRequisicionDetalleById } from "./../../helpers/lote-produccion/viewProduccionRequisicionDetalleById";

export const ViewLoteProduccion = () => {
  // RECIBIMOS LOS PARAMETROS DE LA URL
  const { id } = useParams();
  const [produccionRequisicionDetalle, setproduccionRequisicionDetalle] =
    useState({
      idProdt: 0,
      nomProd: "",
      idProdEst: 0,
      desEstPro: "",
      idProdTip: 0,
      desProdTip: "",
      codLotProd: "",
      klgLotProd: "",
      canLotProd: "",
      fecVenLotProd: "",
      prodLotReq: [],
    });

  const {
    nomProd,
    desEstPro,
    desProdTip,
    codLotProd,
    klgLotProd,
    canLotProd,
    fecVenLotProd,
    prodLotReq,
  } = produccionRequisicionDetalle;

  // funcion para obtener la produccion con sus requisiciones y su detalle
  const obtenerDataProduccionRequisicionesDetalle = async () => {
    const resultPeticion = await viewProduccionRequisicionDetalleById(id);
    const { message_error, description_error, result } = resultPeticion;
    if (message_error.length === 0) {
      setproduccionRequisicionDetalle(result[0]);
    } else {
      console.log("NO SE PUDO");
    }
  };

  useEffect(() => {
    obtenerDataProduccionRequisicionesDetalle();
  }, []);

  return (
    <>
      <div className="container-fluid mx-3">
        <h1 className="mt-4 text-center">Produccion Lote</h1>
        <div className="row mt-4 mx-4">
          {/* Datos de produccion */}
          <div className="card d-flex">
            <h6 className="card-header">Datos de produccion</h6>
            <div className="card-body">
              <div className="mb-3 row">
                {/* NUMERO DE LOTE */}
                <div className="col-md-2">
                  <label htmlFor="nombre" className="form-label">
                    <b>Numero de Lote</b>
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    value={codLotProd}
                    className="form-control"
                  />
                </div>
                {/* PRODUCTO */}
                <div className="col-md-4 me-4">
                  <label htmlFor="nombre" className="form-label">
                    <b>Producto</b>
                  </label>
                  <input
                    disabled={true}
                    type="text"
                    value={nomProd}
                    className="form-control"
                  />
                </div>
                {/* KILOGRAMOS DE LOTE */}
                <div className="col-md-2">
                  <label htmlFor="nombre" className="form-label">
                    <b>Peso de Lote</b>
                  </label>
                  <input
                    type="number"
                    disabled={true}
                    value={klgLotProd}
                    className="form-control"
                  />
                </div>
                {/* CANTIDAD DE LOTE */}
                <div className="col-md-2">
                  <label htmlFor="nombre" className="form-label">
                    <b>Cantidad</b>
                  </label>
                  <input
                    type="number"
                    disabled={true}
                    value={canLotProd}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="mb-3 row d-flex align-items-center">
                {/* TIPO DE PRODUCCION */}
                <div className="col-md-3">
                  <label htmlFor="nombre" className="form-label">
                    <b>Tipo de produccion</b>
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    value={desProdTip}
                    className="form-control"
                  />
                </div>
                {/* ESTADO DE PRODUCCION */}
                <div className="col-md-4">
                  <label htmlFor="nombre" className="form-label">
                    <b>Estado de produccion</b>
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    value={desEstPro}
                    className="form-control"
                  />
                </div>
                {/* FECHA DE VENCIMIENTO */}
                <div className="col-md-4">
                  <label htmlFor="nombre" className="form-label">
                    <b>Fecha vencimiento lote</b>
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    value={fecVenLotProd}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* DATOS DE  */}
        </div>
      </div>
    </>
  );
};
