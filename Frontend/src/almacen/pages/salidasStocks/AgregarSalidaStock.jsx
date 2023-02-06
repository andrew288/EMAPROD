import React, { useEffect, useState } from "react";
import FechaPicker from "../../components/FechaPicker";
import HoraPicker from "./../../components/HoraPicker";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { getRequisicionMoliendaDetalleById } from "./../../helpers/requisicion-molienda/getRequisicionMoliendaDetalleById";

const AgregarSalidaStock = () => {
  // CONSTANTES PARA LOS PARAMETROS DE LA URL
  const location = useLocation();
  const { idReqMol = "" } = queryString.parse(location.search);

  // ESTADOS PARA EL htmlForMULARIO DE SALIDA
  const [salidaMolienda, setSalidaMolienda] = useState({
    codLotReqMol: "",
    codMatPri: "",
    codEntSto: "",
    fecSalStoReqMol: "",
    canSalReqMol: 0,
    docSalSto: "",
  });

  const {
    codLotReqMol,
    codMatPri,
    codEntSto,
    fecSalStoReqMol,
    canSalReqMol,
    docSalSto,
  } = salidaMolienda;

  // ESTADO PARA CONTROLAR EL FEEDBACK
  const [feedbackCreate, setfeedbackCreate] = useState(false);
  const [feedbackMessages, setfeedbackMessages] = useState({
    style_message: "",
    feedback_description_error: "",
  });
  const { style_message, feedback_description_error } = feedbackMessages;

  const traerDatosRequisicionMoliendaDetalle = async () => {
    if (idReqMol.length !== 0) {
      console.log(idReqMol);
      try {
        const idParserNumber = Number(idReqMol);
        const resultData = await getRequisicionMoliendaDetalleById(
          idParserNumber
        );
        const { message_error, description_error, result } = resultData;
        const { codLotReqMol, codMatPri, canReqMolDet } = result;

        if (message_error.length === 0) {
          setSalidaMolienda({
            ...salidaMolienda,
            codLotReqMol: codLotReqMol,
            codMatPri: codMatPri,
            canSalReqMol: canReqMolDet,
          });
        } else {
          console.log("Se proporciono un id inexistente");
          setfeedbackMessages({
            style_message: "error",
            feedback_description_error: description_error,
          });
          handleClickFeeback();
        }
        setdisableButton(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

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

  // CONTROLADOR DE htmlForMULARIO
  const handledForm = ({ target }) => {
    const { name, value } = target;
    setSalidaMolienda({
      ...salidaMolienda,
      [name]: value,
    });
  };

  useEffect(() => {
    traerDatosRequisicionMoliendaDetalle();
  }, []);

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Registrar salida</h1>
        <form className="mt-4">
          <div className="mb-3 row">
            <label htmlFor="codigo-lote" className="col-sm-2 col-form-label">
              Código del Lote
            </label>
            <div className="col-md-2">
              <input
                type="text"
                name="codLotReqMol"
                value={codLotReqMol}
                className="form-control"
                onChange={handledForm}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="codigo-materia-prima"
              className="col-sm-2 col-form-label"
            >
              Código de la materia prima
            </label>
            <div className="col-md-2">
              <input
                type="text"
                name="codMatPri"
                value={codMatPri}
                className="form-control"
                onChange={handledForm}
              />
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <input
                  type="text"
                  name="nombreMateriaPrima"
                  readOnly
                  className="form-control"
                  id="nombre-materia-prima"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="agregarCodigoMateriaPrima"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="codigo-materia-prima"
              className="col-sm-2 col-form-label"
            >
              Código de entrada
            </label>
            <div className="col-md-3">
              <div className="input-group">
                <input
                  type="text"
                  name="codEntSto"
                  value={codEntSto}
                  className="form-control"
                  onChange={handledForm}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="agregarCodigoProveedor"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="table-responsive mt-4">
              <table className="table text-center">
                <thead className="table-success ">
                  <tr>
                    <th scope="col">Cod. Ingreso</th>
                    <th scope="col">N° Ingreso</th>
                    <th scope="col">Fecha ingreso</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2111131c</td>
                    <td>002</td>
                    <td>24/01/2023</td>
                    <td>200 kg</td>
                    <td>
                      {/* <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <div
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          <input className="form-control" type="number" />
                        </div>
                      </div> */}
                    </td>
                  </tr>
                  <tr>
                    <td>2111131c</td>
                    <td>002</td>
                    <td>24/01/2023</td>
                    <td>200 kg</td>
                    <td>
                      {/* <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <div
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          <input className="form-control" type="number" />
                        </div>
                      </div> */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="fecha-salida-stock"
              className="col-sm-2 col-form-label"
            >
              Fecha de salida
            </label>
            <div className="col-md-3">
              <FechaPicker />
            </div>
            <div className="col-md-3">
              <HoraPicker />
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="documento-salida"
              className="col-sm-2 col-form-label"
            >
              Documento
            </label>
            <div className="col-md-3">
              <input
                type="text"
                name="docSalSto"
                value={docSalSto}
                className="form-control"
                onChange={handledForm}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="cantidad-salida"
              className="col-sm-2 col-form-label"
            >
              Cantidad Salida
            </label>
            <div className="col-md-2">
              <input
                type="number"
                name="cantidadSalida"
                value={canSalReqMol}
                className="form-control"
                onChange={handledForm}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AgregarSalidaStock;
