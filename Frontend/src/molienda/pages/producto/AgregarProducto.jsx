import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// IMPORTACIONES PARA EL FEEDBACK
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { FilterCategoriaProducto } from "./../../components/FilterCategoriaProducto";
import { createProducto } from "./../../helpers/producto/createProducto";

// CONFIGURACION DE FEEDBACK
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AgregarProducto = () => {
  // ESTADOS PARA EL CONTROL DEL FORMULARIO MATERIA PRIMA
  const [producto, setProducto] = useState({
    idProdCat: 0,
    nomProd: "",
    desProd: "",
    stoProd: 0,
  });

  const { idProdCat, nomProd, desProd, stoProd } = producto;

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
    setProducto({
      ...producto,
      [name]: value,
    });
  };

  // CONTROLADOR DE CATEGORIA PRODUCTO
  const onAddCategoriaProducto = ({ value }) => {
    setProducto({
      ...producto,
      idProdCat: value,
    });
  };

  // FUNCION PARA CREAR PRODUCTO
  const crearProducto = async () => {
    const { message_error, description_error } = await createProducto(producto);
    if (message_error.length === 0) {
      console.log("Se creo exitosamente");
      setfeedbackMessages({
        style_message: "success",
        feedback_description_error: "Se creó exitosamente",
      });
      handleClickFeeback();
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

  // CONTROLADOR DE SUBMIT
  const handleSubmitProducto = (e) => {
    e.preventDefault();
    if (
      nomProd.length === 0 ||
      desProd.length === 0 ||
      stoProd < 0 ||
      idProdCat === 0
    ) {
      // MANEJAMOS FORMULARIOS INCOMPLETOS
      setfeedbackMessages({
        style_message: "warning",
        feedback_description_error: "Asegurese de llenar los datos requeridos",
      });
      handleClickFeeback();
    } else {
      setdisableButton(true);
      // LLAMAMOS A LA FUNCION CREAR MATERIA PRIMA
      crearProducto();
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Agregar Producto</h1>
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
          {/* CATEGORIA */}
          <div className="mb-3 row">
            <label htmlFor="categoria" className="col-sm-2 col-form-label">
              Categoria
            </label>
            <div className="col-md-2">
              <FilterCategoriaProducto onNewInput={onAddCategoriaProducto} />
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
