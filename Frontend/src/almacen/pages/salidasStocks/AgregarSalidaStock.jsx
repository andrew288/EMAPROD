import React, { useEffect, useState, useRef } from "react";
import FechaPicker from "../../components/FechaPicker";
import HoraPicker from "./../../components/HoraPicker";
import { useLocation } from "react-router-dom";
import { getRequisicionMoliendaDetalleById } from "./../../helpers/requisicion-molienda/getRequisicionMoliendaDetalleById";
import queryString from "query-string";
import { getEntradasDisponibles } from "./../../helpers/salidas-stock/getEntradasDisponibles";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { createSalidasStockByReqMolDet } from "./../../helpers/salidas-stock/createSalidasStockByReqMolDet";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AgregarSalidaStock = () => {
  const refTable = useRef();

  const location = useLocation();

  const { idReqMolDet = "" } = queryString.parse(location.search);

  // ESTADOS PARA EL FORMULARIO DE SALIDA
  const [salidaMolienda, setSalidaMolienda] = useState({
    idReqMol: 0,
    idReqMolDet: 0,
    codLotReqMol: "",
    idMatPri: 0,
    codMatPri: "",
    salStoMolDet: [],
    fecSalStoReqMol: "",
    canReqMolDet: 0,
    docSalSto: "",
  });

  const {
    idReqMol,
    codLotReqMol,
    idMatPri,
    codMatPri,
    fecSalStoReqMol,
    canReqMolDet,
    docSalSto,
    salStoMolDet,
  } = salidaMolienda;

  // ESTADO PARA LAS ENTRADAS DISPONIBLES
  const [entradasDisponibles, setentradasDisponibles] = useState([]);

  // ESTADO PARA CONTROLAR LAS CANTIDADES DE LAS DIFERENTES ENTRADAS
  const [count, setcount] = useState(0);

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

  // CONTROLADOR DE FORMULARIO
  const handledForm = ({ target }) => {
    const { name, value } = target;
    setSalidaMolienda({
      ...salidaMolienda,
      [name]: value,
    });
  };

  // TRAER DATOS DE REQUISICION MOLIENDA DETALLE
  const traerDatosRequisicionMoliendaDetalle = async () => {
    if (idReqMolDet.length !== 0) {
      try {
        const resultData = await getRequisicionMoliendaDetalleById(idReqMolDet);
        const { message_error, description_error, result } = resultData;

        if (message_error.length === 0) {
          // SETEAMOS EL CONTADOR
          setcount(result[0].canReqMolDet);
          setSalidaMolienda({
            ...salidaMolienda,
            idReqMol: result[0].idReqMol,
            idReqMolDet: parseInt(idReqMolDet, 10),
            idMatPri: result[0].idMatPri,
            codLotReqMol: result[0].codLotReqMol,
            codMatPri: result[0].codMatPri,
            canReqMolDet: result[0].canReqMolDet,
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

  // TRAER DATOS DE ENTRADAS DISPONIBLES PARA LA REQUISICION MOLIENDA DETALLE
  const traerDatosEntradasDisponibles = async () => {
    const { result } = await getEntradasDisponibles(idMatPri);
    setentradasDisponibles(result);
  };

  // Habilitar input de envio
  const habilitarInputCantidad = (idPosElement, { id, canTotDis }) => {
    let inputSelected =
      refTable.current.children[idPosElement].childNodes[4].childNodes[0]
        .childNodes[1].childNodes[0];

    let checkState =
      refTable.current.children[idPosElement].childNodes[4].childNodes[0]
        .childNodes[0];

    // Obtenemos la cantidad actual de la entrada
    let cantidadDisponible = parseInt(canTotDis, 10);
    console.log(count);

    // Verificamos si la casilla fue seleccionada
    if (checkState.checked) {
      // Habilitamos el input
      inputSelected.disabled = false;
      // si la cantidad requerida es mayor o igual a la cantidad de la entrada
      if (count >= cantidadDisponible) {
        // Actualizamos el input con toda la cantidad de su entrada
        inputSelected.value = cantidadDisponible;
        // Actualizamos la cantidad requerida
        setcount(count - cantidadDisponible);

        // Añadimos la informacion a la salida detalle
        let aux = [...salStoMolDet];
        console.log(aux);
        aux.push({
          idEntSto: id,
          canSalReqMol: cantidadDisponible,
          // canTotDis: canTotDis,
        });
        setSalidaMolienda({
          ...salidaMolienda,
          salStoMolDet: aux,
        });

        console.log("COUNT: " + (count - cantidadDisponible));
      }
      // si la cantidad requerida es menor a la cantidad de la entrada
      else {
        // si la cantidad requerida es igual a 0
        if (count === 0) {
          inputSelected.value = 0;
          console.log("COUNT: " + 0);
        }
        // si la cantidad requerida es menor a la cantidad de la entrada
        else {
          inputSelected.value = count;
          setcount(0);
          // Añadimos la informacion a la salida detalle
          let aux = [...salStoMolDet];
          console.log(aux);
          aux.push({
            idEntSto: id,
            canSalReqMol: count,
            // canTotDis: canTotDis,
          });
          setSalidaMolienda({
            ...salidaMolienda,
            salStoMolDet: aux,
          });
          console.log("COUNT: " + 0);
        }
      }
    } else {
      inputSelected.disabled = true;
      setcount(count + parseInt(inputSelected.value, 10));
      // Eliminamos la informacion deseleccionada
      let aux = salStoMolDet.filter((element) => {
        if (element.idEntSto !== id) {
          return true;
        } else {
          return false;
        }
      });
      console.log(aux);
      setSalidaMolienda({
        ...salidaMolienda,
        salStoMolDet: aux,
      });
      console.log("COUNT: " + (count + parseInt(inputSelected.value, 10)));
      inputSelected.value = 0;
    }
  };

  const crearSalidasStockByRequisicionMoliendaDetalle = async () => {
    console.log(salidaMolienda);
    const { message_error, description_error } =
      await createSalidasStockByReqMolDet(salidaMolienda);

    if (message_error.length === 0) {
      console.log("Se agregaron las salidas exitosamente");
      // Volvemos a la vista de requisiciones
      onNavigateBack();
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

  // enviar salida
  const onSubmitSalidaStock = (e) => {
    e.preventDefault();
    // CONDICIONES DE ENVIO
    if (
      docSalSto.length === 0 ||
      salStoMolDet.length === 0 ||
      idReqMol === 0 ||
      idMatPri === 0
    ) {
      // MANEJAMOS FORMULARIOS INCOMPLETOS
      if (salStoMolDet.length === 0) {
        setfeedbackMessages({
          style_message: "error",
          feedback_description_error:
            "No hay entradas de materia prima para este producto.",
        });
        handleClickFeeback();
      } else {
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error:
            "Asegurese de llenar los datos requeridos",
        });
        handleClickFeeback();
      }
    } else {
      // PRIMERO HACEMOS UNA VALIDACION SI LA SALIDA DE STOCK DETALLE CUMPLE CON LO REQUERIDO
      let cantSalStoDet = 0;
      salStoMolDet.forEach((element) => {
        cantSalStoDet += parseInt(element.canSalReqMol);
      });

      // Si las entradas elegidas cumplen con la cantidada requerida
      if (cantSalStoDet != canReqMolDet) {
        setfeedbackMessages({
          style_message: "error",
          feedback_description_error:
            "Asegurese de completar la cantidad requerida. Si no alcanza lo solicitado, realizace una entrada de stock de la materia prima",
        });
        handleClickFeeback();
      } else {
        // Deshabilitamos el boton de enviar
        setdisableButton(true);
        // llamamos a la funcion de registrar salidas segun el detalle
        crearSalidasStockByRequisicionMoliendaDetalle();
      }
    }
  };

  useEffect(() => {
    // TRAEMOS DATOS DE REQUISICION DETALLE
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
                readOnly
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
                readOnly
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
              Código de entrada
            </label>
            <div className="col-md-3">
              <div className="input-group">
                <div className="input-group-append">
                  <button
                    onClick={traerDatosEntradasDisponibles}
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
                <tbody ref={refTable}>
                  {entradasDisponibles.map((element, i) => (
                    <tr key={element.id}>
                      <td>{element.codEntSto}</td>
                      <td>{element.refNumIngEntSto}</td>
                      <td>{element.fecEntSto}</td>
                      <td>{element.canTotDis}</td>
                      <td className="col-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            onChange={() => {
                              habilitarInputCantidad(i, { ...element });
                            }}
                            id="flexCheckDefault"
                          />
                          <div
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            <input
                              className="form-control"
                              type="number"
                              placeholder="0"
                              disabled={true}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                name="canReqMolDet"
                value={canReqMolDet}
                readOnly
                className="form-control"
                onChange={handledForm}
              />
            </div>
          </div>
          {/* BOTONES DE CANCELAR Y GUARDAR */}
          <div className="btn-toolbar">
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
              onClick={(e) => onSubmitSalidaStock(e)}
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div>
        </form>
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

export default AgregarSalidaStock;
