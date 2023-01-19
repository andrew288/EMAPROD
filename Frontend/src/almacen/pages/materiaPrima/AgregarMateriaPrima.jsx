import React from 'react';

const AgregarMateriaPrima = () => {
  return (
    <>
      <div className='container'>
        <h1 className='mt-4 text-center'>Agregar materia prima</h1>
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
            <label for="categoria" class="col-sm-2 col-form-label">Categoria</label>
            <div class="col-md-3">
              <select name='categoria' id='categoria' class="form-select form-select mb-3" aria-label=".form-select-lg example">
                <option selected>Seleccione una categoria</option>
                <option value="1">Envase</option>
                <option value="2">Insumo</option>
                <option value="3">Insumo procesado</option>
              </select>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="medida" class="col-sm-2 col-form-label">Medida</label>
            <div class="col-md-2">
              <select name='medida' id='medida' class="form-select form-select mb-3" aria-label=".form-select-lg example">
                <option selected>Seleccione una medida</option>
                <option value="1">Kilogramos</option>
                <option value="2">Litros</option>
                <option value="3">Toneladas</option>
              </select>
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

          <div class="mb-3 row">
          <label for="stock" class="col-sm-2 col-form-label">Cantidad en Stock</label>
              <div class="col-md-2">
                <input type="number" name='stock' readonly class="form-control" id="stock"/>
              </div>
          </div>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </form>
      </div>
    </>
  )
}

export default AgregarMateriaPrima
