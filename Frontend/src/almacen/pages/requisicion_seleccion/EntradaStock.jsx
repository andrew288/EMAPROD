import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { getRequisicionSeleccionDetalleById } from "./../../helpers/requisicion-seleccion/getRequisicionSeleccionDetalleById";
import { getSalidasDisponiblesForSeleccion } from "./../../helpers/requisicion-seleccion/getSalidasDisponiblesForSeleccion";
import { createEntradasStockByReqSelDet } from "../../helpers/requisicion-seleccion/createEntradasStockByReqSelDet";
import FechaPicker from "./../../../components/Fechas/FechaPicker";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export const EntradaStock = () => {
  const refTable = useRef();

  const location = useLocation();

  const { idReqSelDet = "" } = queryString.parse(location.search);

  // ESTADOS PARA EL FORMULARIO DE SALIDA
  const [entradaSeleccion, setentradaSeleccion] = useState({
    idReqSelDet: 0,
    idReqSel: 0,
    codReqSel: "",
    idMatPri: 0,
    codMatPri: "",
    salStoSelDet: [],
  });

  const { idReqSel, idMatPri, codReqSel, codMatPri, salStoSelDet } =
    entradaSeleccion;

  // ESTADO PARA LAS SALIDAS DISPONIBLES
  const [salidasDisponibles, setsalidasDisponibles] = useState([]);

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
    setentradaSeleccion({
      ...entradaSeleccion,
      [name]: value,
    });
  };

  // MANEJADOR PARA ACTUALIZAR REQUISICION
  const handledSalidasDetalle = ({ target }, index) => {
    const { value, name } = target;
    let editFormDetalle = [...salidasDisponibles];
    const aux = { ...salidasDisponibles[index], [name]: value };
    editFormDetalle[index] = aux;

    setsalidasDisponibles(editFormDetalle);
  };

  // TRAER DATOS DE REQUISICION SELECCION DETALLE
  const traerDatosRequisicionSeleccionDetalle = async () => {
    if (idReqSelDet.length !== 0) {
      try {
        const resultData = await getRequisicionSeleccionDetalleById(
          idReqSelDet
        );
        const { message_error, description_error, result } = resultData;

        if (message_error.length === 0) {
          const { idReqSel, idMatPri, codReqSel, codMatPri, canReqSelDet } =
            result[0];
          // SETEAMOS EL CONTADOR
          setcount(canReqSelDet);
          setentradaSeleccion({
            ...entradaSeleccion,
            idReqSel: idReqSel,
            idReqSelDet: parseInt(idReqSelDet, 10),
            idMatPri: idMatPri,
            codReqSel: codReqSel,
            codMatPri: codMatPri,
          });
          // TRAEMOS LOS DATOS DE SUS SALIDAS CORRESPONDIENTE A LA MATERIA PRIMA
          traerDatosEntradasDisponibles(idReqSel, idMatPri);
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

  // TRAER DATOS DE SALIDAS DISPONIBLES PARA LA REQUISICION SELECCION DETALLE
  const traerDatosEntradasDisponibles = async (idReqSel, idMatPri) => {
    const { result } = await getSalidasDisponiblesForSeleccion(
      idReqSel,
      idMatPri
    );
    setsalidasDisponibles(result);
  };

  // Habilitar input de envio
  const habilitarInputCantidad = (idPosElement, { id }) => {
    let inputSelected =
      refTable.current.children[idPosElement].childNodes[2].childNodes[0];
    let checkState =
      refTable.current.children[idPosElement].childNodes[5].childNodes[0];
    let buttonCalcularMerma =
      refTable.current.children[idPosElement].childNodes[3].childNodes[1];

    // Verificamos si la casilla fue seleccionada
    if (checkState.checked) {
      // Habilitamos el input
      inputSelected.disabled = false;
      buttonCalcularMerma.disabled = false;
      // Añadimos la informacion a la salida detalle
      let aux = [...salStoSelDet];
      console.log(aux);
      aux.push(id);
      setentradaSeleccion({
        ...entradaSeleccion,
        salStoSelDet: aux,
      });
    } else {
      inputSelected.disabled = true;
      buttonCalcularMerma.disabled = true;
      // Eliminamos la informacion deseleccionada
      let aux = salStoSelDet.filter((element) => {
        if (element !== id) {
          return true;
        } else {
          return false;
        }
      });
      console.log(aux);
      setentradaSeleccion({
        ...entradaSeleccion,
        salStoSelDet: aux,
      });
      inputSelected.value = 0;
    }
  };

  const calcularMerma = (e, index) => {
    e.preventDefault();

    let editFormDetalle = [...salidasDisponibles];
    const { canSalStoReqSel, canEntStoReqSel } = {
      ...salidasDisponibles[index],
    };

    let parserinputCantidadSalida = parseInt(canSalStoReqSel, 10); // PARSEAMOS EL VALOR
    let parserinputCantidadEntrada = parseInt(canEntStoReqSel, 10);

    if (
      parserinputCantidadEntrada <= parserinputCantidadSalida &&
      parserinputCantidadEntrada > 0
    ) {
      const mermaTotal = parserinputCantidadSalida - parserinputCantidadEntrada;
      // actualizamos la merma
      const aux = { ...salidasDisponibles[index], merReqSel: mermaTotal };
      editFormDetalle[index] = aux;

      setsalidasDisponibles(editFormDetalle);
    } else {
      if (parserinputCantidadEntrada <= 0) {
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error:
            "La cantidad ingresada no puede ser menor o igual a cero",
        });
        handleClickFeeback();
      } else {
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error:
            "La cantidad de entrada no puede ser mayor al de salida",
        });
        handleClickFeeback();
      }
    }
  };

  const crearEntradasStockByRequisicionSeleccionDetalle = async (body) => {
    console.log(body);
    const { message_error, description_error } =
      await createEntradasStockByReqSelDet(body);

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
    if (salStoSelDet.length === 0 || idReqSel === 0 || idMatPri === 0) {
      // MANEJAMOS FORMULARIOS INCOMPLETOS
      if (salStoSelDet.length === 0) {
        setfeedbackMessages({
          style_message: "error",
          feedback_description_error:
            "No hay salidas seleccionadas para esta entrada de requisicion seleccion.",
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
      let auxSal = [];
      salStoSelDet.forEach((element) => {
        salidasDisponibles.filter((element_salida) => {
          if (element_salida.id === element) {
            auxSal.push(element_salida);
          }
        });
      });

      // si las salidas seleccionadas cumplen con dos condiciones:
      /*
        CANTIDAD ENTRADA: mayor a 0 y menor o igual a la cantidad de salida
        MERMA: si la entrada es igual a la salida, la merma puede ser 0
               si la entrada no es igual a la salida, la merma debe ser mayor que 0
      */
      let isValid = false;
      for (let i = 0; i < auxSal.length; i++) {
        let parserCanEntStoReqSel = parseInt(auxSal[i].canEntStoReqSel, 10);
        let parserCanSalStoReqSel = parseInt(auxSal[i].canSalStoReqSel, 10);
        let parserMerReqSel = parseInt(auxSal[i].merReqSel, 10);

        if (
          parserCanEntStoReqSel > 0 &&
          parserCanEntStoReqSel <= parserCanSalStoReqSel
        ) {
          if (parserCanEntStoReqSel !== parserCanSalStoReqSel) {
            let mermaPlusSalSto = parserMerReqSel + parserCanEntStoReqSel;
            let siCorresponde =
              mermaPlusSalSto === parserCanSalStoReqSel ? true : false;
            if (parserMerReqSel > 0) {
              if (siCorresponde) {
                isValid = true;
              } else {
                isValid = false;
                break;
              }
            } else {
              isValid = false;
              break;
            }
          } else {
            isValid = true;
          }
        } else {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        console.log("ES VALIDO");
        //ACTUALIZAMOS EL DETALLE
        let dataEntradasReqSelDet = {
          ...entradaSeleccion,
          salStoSelDet: auxSal,
        };
        // Deshabilitamos el boton de enviar
        setdisableButton(true);
        crearEntradasStockByRequisicionSeleccionDetalle(dataEntradasReqSelDet);
      } else {
        setfeedbackMessages({
          style_message: "warning",
          feedback_description_error:
            "Asegurese de que el ingreso y merma sean válidos para cada item seleccionado",
        });
        handleClickFeeback();
      }
    }
  };

  useEffect(() => {
    // TRAEMOS DATOS DE REQUISICION DETALLE
    traerDatosRequisicionSeleccionDetalle();
  }, []);

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Registrar Entrada de seleccion</h1>
        <form className="mt-4">
          <div className="mb-3 row">
            <label htmlFor="codigo-lote" className="col-sm-2 col-form-label">
              Código del Lote
            </label>
            <div className="col-md-2">
              <input
                type="text"
                name="codReqSel"
                value={codReqSel}
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
              Salidas realizadas
            </label>
            <div className="col-md-3">
              <div className="input-group">
                <div className="input-group-append">
                  <input type="number" />
                  <button
                    onClick={traerDatosEntradasDisponibles}
                    className="btn btn-success ms-2"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-calculator-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zm0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-1z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="table-responsive mt-4">
              <table className="table text-center">
                <thead className="table-success ">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Salida</th>
                    <th scope="col">Ingreso</th>
                    <th scope="col">Merma</th>
                    <th scope="col">Fecha ingreso</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody ref={refTable}>
                  {salidasDisponibles.map((element, i) => (
                    <tr key={element.id}>
                      <td scope="row">{i + 1}</td>
                      <td>{element.canSalStoReqSel}</td>
                      <td>
                        <input
                          className=""
                          name="canEntStoReqSel"
                          value={element.canEntStoReqSel}
                          onChange={(e) => {
                            handledSalidasDetalle(e, i);
                          }}
                          type="number"
                          disabled={true}
                        />
                      </td>
                      <td>
                        <input
                          name="merReqSel"
                          className="me-2"
                          value={element.merReqSel}
                          onChange={(e) => {
                            handledSalidasDetalle(e, i);
                          }}
                          type="number"
                          disabled={true}
                        />
                        <button
                          className="btn btn-success"
                          onClick={(e) => calcularMerma(e, i)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-calculator"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z" />
                            <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z" />
                          </svg>
                        </button>
                      </td>
                      <td>
                        <FechaPicker
                          onNewFechaEntrada={() => {
                            console.log("GAA");
                          }}
                        />
                      </td>
                      <td className="col-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          onChange={() => {
                            habilitarInputCantidad(i, { ...element });
                          }}
                          id="flexCheckDefault"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOTONES DE CANCELAR Y GUARDAR */}
          <div className="btn-toolbar">
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
