import React from 'react';
import FechaPicker from '../../components/FechaPicker';
import HoraPicker from './../../components/HoraPicker';

const ActualizarEntradaStock = () => {
  return (
    <>
      <div class='container'>
        <h1 class='mt-4 text-center'>Actualizar entrada</h1>
        <form class='mt-4'>
          <div class="mb-3 row">
            <label for="codigo-materia-prima" class="col-sm-2 col-form-label">Código de la materia prima</label>
            <div class="col-md-2">
              <input type="text" name='codMateriaPrima' readonly class="form-control" id="codigo-materia-prima"/>
            </div>
            <div class="col-md-4">
                <div class="input-group">
                    <input type="text" name='nombreMateriaPrima' readonly class="form-control" id="nombre-materia-prima"/>
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" id="agregarCodigoMateriaPrima">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
          </div>
          <div class="mb-3 row">
            <label for="codigo-proveedor" class="col-sm-2 col-form-label">Código de proveedor</label>
            <div class="col-md-2">
              <input type="text" name='codProveedor' readonly class="form-control" id="codigo-proveedor"/>
            </div>
            <div class="col-md-4">
                <div class="input-group">
                    <input type="text" name='nombreProveedor' readonly class="form-control" id="nombre-proveedor"/>
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" id="agregarCodigoProveedor">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="fecha-entrada-stock" class="col-sm-2 col-form-label">Fecha de entrada</label>
            <div class="col-md-3">
                <FechaPicker/>
            </div>
            <div class="col-md-3">
                <HoraPicker/>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="documento-entrada" class="col-sm-2 col-form-label">Documento</label>
            <div class="col-md-3">
              <input type="text" name='documentoEntrada' readonly class="form-control" id="documento-entrada"/>
            </div>
          </div>

          <div class="mb-3 row">
          <label for="cantidad-ingresada" class="col-sm-2 col-form-label">Cantidad ingresada</label>
              <div class="col-md-2">
                <input type="number" name='cantidadIngresada' readonly class="form-control" id="cantidad-ingresada"/>
              </div>
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">Actualizar</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default ActualizarEntradaStock
