import { TextField } from "@mui/material";
import React, { useState } from "react";

export const DialogUpdateDetalleRequisicion = ({
  itemUpdate,
  onClose,
  onUpdateItemSelected,
}) => {
  const [inputValue, setinputValue] = useState(0.0);

  const handleInputValue = ({ target }) => {
    const { value, name } = target;
    setinputValue(value);
  };

  return (
    <div
      className="modal"
      tabIndex="-1"
      role="dialog"
      style={{
        display: itemUpdate !== null ? "block" : "none",
      }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar detalle requisicion</h5>
            <button
              type="button"
              className="close ms-2"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p className="fw-bolder text-danger">
              ¿Quieres actualizar este detalle?
            </p>
            <p>
              <b className="me-2">Materia Prima:</b>
              {itemUpdate.nomProd}
            </p>
            <p>
              <b className="me-2">Cantidad:</b>
              {itemUpdate.canReqDet}
              <span className="ms-2">{itemUpdate.itemUpdateUM}</span>
            </p>
            <p>
              <b className="me-2">Nueva cantidad</b>
              <TextField
                value={inputValue}
                onChange={handleInputValue}
                size="small"
                type="number"
                autoComplete="off"
              />
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
              onClick={() => {
                onUpdateItemSelected(itemUpdate, inputValue);
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
