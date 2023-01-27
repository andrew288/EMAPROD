import React, { useState, useEffect } from "react";
// IMPORTACIONES PARA LA NAVEGACION
import { useParams, useNavigate } from "react-router-dom";
// IMPORTACIONES PARA EL MANEJO DE LA DATA
import { FilterCategoriaMateriaPrima } from "../../components/FilterCategoriaMateriaPrima";
import { FilterMedidas } from "./../../components/FilterMedidas";
import { getMateriaPrimaById } from "./../../helpers/getMateriaPrimaById";
import { updateMateriaPrima } from "./../../helpers/updateMateriaPrima";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ActualizarMateriaPrima = () => {
  // RECIBIMOS LOS PARAMETROS DE LA URL
  const { id } = useParams();

  // ESTADOS PARA LA NAVEGACION
  const navigate = useNavigate();
  const onNavigateBack = () => {
    navigate(-1);
  };

  // ESTADOS DE LA MATERIA PRIMA
  const [materiaPrima, setmateriaPrima] = useState({
    refCodMatPri: "",
    idMatPriCat: 0,
    idMed: 0,
    nomMatPri: "",
    desMatPri: "",
    stoMatPri: 0,
  });

  const { refCodMatPri, idMatPriCat, idMed, nomMatPri, desMatPri, stoMatPri } =
    materiaPrima;

  // ESTADO PARA CONTROLAR EL FEEDBACK
  const [feedbackUpdate, setfeedbackUpdate] = useState(false);
  const [feedbackMessages, setfeedbackMessages] = useState({
    style_message: "",
    feedback_description_error: "",
  });
  const { style_message, feedback_description_error } = feedbackMessages;

  // MANEJADORES DE FEEDBACK
  const handleClickFeeback = () => {
    setfeedbackUpdate(true);
  };

  const handleCloseFeedback = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setfeedbackUpdate(false);
  };

  // ESTADO PARA BOTON CREAR
  const [disableButton, setdisableButton] = useState(false);

  // FUNCION PARA TRAER LA DATA DE MATERIA DE PRIMA
  const obtenerDataMateriPrimaById = async () => {
    const resultPeticion = await getMateriaPrimaById(id);
    setmateriaPrima({
      ...materiaPrima,
      refCodMatPri: resultPeticion[0].refCodMatPri,
      idMatPriCat: resultPeticion[0].idMatPriCat,
      idMed: resultPeticion[0].idMed,
      nomMatPri: resultPeticion[0].nomMatPri,
      desMatPri: resultPeticion[0].desMatPri,
      stoMatPri: resultPeticion[0].stoMatPri,
    });
  };

  // CODIGO QUE SE EJECUTA ANTES DE LA RENDERIZACION
  useEffect(() => {
    obtenerDataMateriPrimaById();
  }, []);

  // MANEJADOR DE FORMULARIO
  const handledForm = ({ target }) => {
    const { name, value } = target;
    setmateriaPrima({
      ...materiaPrima,
      [name]: value,
    });
  };

  // CONTROLADOR DE CATEGORIA MATERIA PRIMA
  const onAddCategoriaMateriaPrima = ({ value }) => {
    setmateriaPrima({
      ...materiaPrima,
      idMatPriCat: value,
    });
  };

  // CONTROLADOR DE MEDIDA MATERIA PRIMA
  const onAddMedida = (newValue) => {
    setmateriaPrima({
      ...materiaPrima,
      idMed: newValue,
    });
  };

  // FUNCION PARA ACTUALIZAR MATERIA PRIMA
  const actualizarMateriaPrima = async (idMatPri, data) => {
    const { message_error, description_error } = await updateMateriaPrima(
      idMatPri,
      data
    );

    if (message_error.length === 0) {
      console.log("Se actualizo correctamente");
      // MOSTRAMOS FEEDBACK
      setfeedbackMessages({
        style_message: "success",
        feedback_description_error: "Se actualizó exitosamente",
      });
      handleClickFeeback();
    } else {
      console.log("No se pudo actualizar");
      setfeedbackMessages({
        style_message: "error",
        feedback_description_error: description_error,
      });
      handleClickFeeback();
    }
    setdisableButton(false);
  };

  // CONTROLADOR SUBMIT DEL FORMULARIO
  const handleSubmitMateriPrima = (e) => {
    e.preventDefault();
    if (
      refCodMatPri.length === 0 ||
      nomMatPri.length === 0 ||
      idMatPriCat === 0 ||
      idMed === 0 ||
      stoMatPri < 0
    ) {
      // MANEJAMOS FORMULARIOS INCOMPLETOS
      setfeedbackMessages({
        style_message: "warning",
        feedback_description_error: "Asegurese de llenar los datos requeridos",
      });
      handleClickFeeback();
    } else {
      setdisableButton(true);
      // EJECUTAMOS LA ACTUALIZACION
      actualizarMateriaPrima(id, materiaPrima);
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Actualizar materia prima</h1>
        <form className="mt-4">
          {/* CODIGO DE REFERENCIA */}
          <div class="mb-3 row">
            <label for="codigo_referencia" class="col-sm-2 col-form-label">
              Codigo de referencia
            </label>
            <div class="col-md-2">
              <input
                type="text"
                value={refCodMatPri}
                onChange={handledForm}
                name="refCodMatPri"
                class="form-control"
              />
            </div>
          </div>
          {/* NOMBRE */}
          <div class="mb-3 row">
            <label for="nombre" class="col-sm-2 col-form-label">
              Nombre
            </label>
            <div class="col-md-4">
              <input
                type="text"
                value={nomMatPri}
                onChange={handledForm}
                name="nomMatPri"
                class="form-control"
              />
            </div>
          </div>
          {/* CATEGORIA */}
          <div class="mb-3 row">
            <label for="categoria" class="col-sm-2 col-form-label">
              Categoria
            </label>
            <div class="col-md-2">
              <FilterCategoriaMateriaPrima
                onNewInput={onAddCategoriaMateriaPrima}
              />
            </div>
          </div>
          {/* MEDIDA */}
          <div class="mb-3 row">
            <label for="medida" class="col-sm-2 col-form-label">
              Medida
            </label>
            <div class="col-md-2">
              <FilterMedidas onNewInput={onAddMedida} />
            </div>
          </div>
          {/* DESCRIPCION */}
          <div class="mb-3 row">
            <label for="descripcion" class="col-sm-2 col-form-label">
              Descripción
            </label>
            <div class="col-md-4">
              <div class="form-floating">
                <textarea
                  value={desMatPri}
                  onChange={handledForm}
                  name="desMatPri"
                  class="form-control"
                  placeholder="Leave a comment here"
                ></textarea>
              </div>
            </div>
          </div>
          {/* CANTIDAD STOCK */}
          <div class="mb-3 row">
            <label for="stock" class="col-sm-2 col-form-label">
              Cantidad en Stock
            </label>
            <div class="col-md-2">
              <input
                type="number"
                name="stoMatPri"
                onChange={handledForm}
                value={stoMatPri}
                class="form-control"
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
              onClick={handleSubmitMateriPrima}
              className="btn btn-primary"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
      {/* FEEDBACK UPDATE */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={feedbackUpdate}
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

export default ActualizarMateriaPrima;
