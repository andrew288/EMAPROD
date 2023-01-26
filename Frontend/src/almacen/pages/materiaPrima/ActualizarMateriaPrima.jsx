import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { FilterCategoriaMateriaPrima } from "../../components/FilterCategoriaMateriaPrima";
import { FilterMedidas } from "./../../components/FilterMedidas";
import { getMateriaPrimaById } from "./../../helpers/getMateriaPrimaById";
import { updateMateriaPrima } from "./../../helpers/updateMateriaPrima";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

  // ESTADOS DE ERRORES DE ACTUALIZACION
  const [messageError, setmessageError] = useState({
    message_error: "",
    description_error: "",
  });

  const { message_error, description_error } = messageError;

  const [open, setOpen] = React.useState(false);

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

  useEffect(() => {
    obtenerDataMateriPrimaById();
  }, []);

  const handledForm = ({ target }) => {
    const { name, value } = target;
    setmateriaPrima({
      ...materiaPrima,
      [name]: value,
    });
  };

  const onAddCategoriaMateriaPrima = ({ value }) => {
    setmateriaPrima({
      ...materiaPrima,
      idMatPriCat: value,
    });
  };

  const onAddMedida = (newValue) => {
    setmateriaPrima({
      ...materiaPrima,
      idMed: newValue,
    });
  };

  const actualizarMateriaPrima = async (idMatPri, data) => {
    const { message_error, description_error } = await updateMateriaPrima(
      idMatPri,
      data
    );

    if (message_error.length === 0) {
      console.log("Se actualizo correctamente");
      // REDIRECCIONAMOS
      onNavigateBack();
    } else {
      setmessageError({
        ...messageError,
        message_error: message_error,
        description_error: description_error,
      });
      handleOn();
    }
  };

  const handleSubmitMateriPrima = (e) => {
    e.preventDefault();
    if (
      refCodMatPri.length === 0 ||
      nomMatPri.length === 0 ||
      idMatPriCat === 0 ||
      idMed === 0 ||
      stoMatPri <= 0
    ) {
      console.log("Asegurese de completar los campos requeridos");
    } else {
      // EJECUTAMOS LA ACTUALIZACION
      actualizarMateriaPrima(id, materiaPrima);
    }
  };

  // MANEJADORES DE CUADRO DE DIALOGO
  const handleClose = () => {
    setOpen(false);
  };

  const handleOn = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="container">
        <h1 className="mt-4 text-center">Actualizar materia prima</h1>
        <form className="mt-4">
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

          <div class="mb-3 row">
            <label for="medida" class="col-sm-2 col-form-label">
              Medida
            </label>
            <div class="col-md-2">
              <FilterMedidas onNewInput={onAddMedida} />
            </div>
          </div>

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
          <div className="btn-toolbar">
            <button
              type="button"
              onClick={onNavigateBack}
              class="btn btn-secondary me-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmitMateriPrima}
              class="btn btn-primary"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>

      {/* DIALOG DE ERRORES DE ACTUALIZACION */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <p className="fs-3 text-danger">No se ha podido actualizar</p>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <p>
                <b className="text-danger">Error: </b>
                {message_error}
              </p>
              <p>
                <b className="text-danger">Descripcion: </b>
                {description_error}
              </p>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActualizarMateriaPrima;
