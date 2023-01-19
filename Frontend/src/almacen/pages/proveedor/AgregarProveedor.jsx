import React from 'react';

const AgregarProveedor = () => {
  return (
    <>
      <div className='container'>
        <h1 className='mt-4 text-center'>Agregar proveedor</h1>
        <form className='mt-4'>
          <div class="mb-3 row">
            <label for="codigo_referencia" class="col-sm-2 col-form-label">Codigo de referencia</label>
            <div class="col-md-2">
              <input type="text" name='codReferencia' readonly class="form-control" id="codigo_referencia"/>
            </div>
          </div>
          <div class="mb-3 row">
            <label for="nombre" class="col-sm-2 col-form-label">Nombre</label>
            <div class="col-md-6">
              <input type="text" name='nombre' readonly class="form-control" id="nombre"/>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="descripcion" class="col-sm-2 col-form-label">Descripción</label>
              <div class="col-md-6">
                <div class="form-floating">
                  <textarea name='descripcion' class="form-control" placeholder="Leave a comment here" id="descripcion"></textarea>
                </div>
              </div>
          </div>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </form>
      </div>
    </>
  )
}

export default AgregarProveedor
