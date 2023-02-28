import React, { useState, useEffect } from "react";
// IMPORTACIONES PARA LA NAVEGACION
import { useParams, useNavigate } from "react-router-dom";
// IMPORTACIONES PARA EL MANEJO DE LA DATA
import { updateProducto } from "./../../helpers/producto/updateProducto";
import { getProductoById } from "../../helpers/producto/getProductoById";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ActualizarProducto = () => {
  // RECIBIMOS LOS PARAMETROS DE LA URL
  const { id } = useParams();

  // ESTADOS PARA LA NAVEGACION
  const navigate = useNavigate();
  const onNavigateBack = () => {
    navigate(-1);
  };

  const [producto, setproducto] = useState({
    idProdCat: 0,
    nomProd: "",
    desProdCat: "",
    desProd: "",
    stoProd: 0,
  });

  const { idProdCat, nomProd, desProd, stoProd, desProdCat } = producto;

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

  // ESTADO PARA BOTON ACTUALIZAR
  const [disableButton, setdisableButton] = useState(false);

  // FUNCION PARA TRAER LA DATA DE MATERIA DE PRIMA
  const obtenerProductoById = async () => {
    const resultPeticion = await getProductoById(id);
    setproducto({
      ...producto,
      nomProd: resultPeticion[0].nomProd,
      idProdCat: resultPeticion[0].idProdCat,
      desProd: resultPeticion[0].desProd,
      desProdCat: resultPeticion[0].desProdCat,
      stoProd: resultPeticion[0].stoProd,
    });
  };

  // MANEJADOR DE FORMULARIO
  const handledForm = ({ target }) => {
    const { name, value } = target;
    setproducto({
      ...producto,
      [name]: value,
    });
  };

  // CONTROLADOR DE CATEGORIA MATERIA PRIMA
  const onAddCategoriaProducto = ({ value }) => {
    setproducto({
      ...producto,
      idProdCat: value,
    });
  };

  // FUNCION PARA ACTUALIZAR MATERIA PRIMA
  const actualizarProducto = async (idProd, data) => {
    const { message_error, description_error } = await updateProducto(
      idProd,
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
  const handleSubmitProducto = (e) => {
    e.preventDefault();
    if (
      nomProd.length === 0 ||
      idProdCat === 0 ||
      desProd.length === 0 ||
      stoProd < 0
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
      actualizarProducto(id, producto);
    }
  };

  // CODIGO QUE SE EJECUTA ANTES DE LA RENDERIZACION
  useEffect(() => {
    obtenerProductoById();
  }, []);

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Actualizar producto</h1>
        <form className="mt-4">
          {/* NOMBRE */}
          <div className="mb-3 row">
            <label htmlFor="nombre" className="col-sm-2 col-form-label">
              Nombre
            </label>
            <div className="col-md-4">
              <input
                type="text"
                value={nomProd}
                onChange={handledForm}
                name="nomProd"
                className="form-control"
              />
            </div>
          </div>
          {/* DESCRIPCION */}
          <div className="mb-3 row">
            <label htmlFor="descripcion" className="col-sm-2 col-form-label">
              Descripción
            </label>
            <div className="col-md-4">
              <div className="form-floating">
                <textarea
                  value={desProd}
                  onChange={handledForm}
                  name="desProd"
                  className="form-control"
                  placeholder="Leave a comment here"
                ></textarea>
              </div>
            </div>
          </div>
          {/* CANTIDAD STOCK */}
          <div className="mb-3 row">
            <label htmlFor="stock" className="col-sm-2 col-form-label">
              Cantidad en Stock
            </label>
            <div className="col-md-2">
              <input
                type="number"
                name="stoProd"
                onChange={handledForm}
                value={stoProd}
                className="form-control"
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
              onClick={handleSubmitProducto}
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
