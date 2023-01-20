import React from "react";
import FechaPicker from "../../components/FechaPicker";
import HoraPicker from "./../../components/HoraPicker";

const AgregarSalidaStock = () => {
  return (
    <>
      <div class="container">
        <h1 class="mt-4 text-center">Registrar salida</h1>
        <form class="mt-4">
          <div class="mb-3 row">
            <label for="codigo-lote" class="col-sm-2 col-form-label">
              Código del Lote
            </label>
            <div class="col-md-2">
              <input
                type="text"
                name="codLote"
                readonly
                class="form-control"
                id="codigo-lote"
              />
            </div>
          </div>

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
            <label for="codigo-materia-prima" class="col-sm-2 col-form-label">
              Código de entrada
            </label>
            <div class="col-md-3">
              <div class="input-group">
                <input
                  type="text"
                  name="nombreMateriaPrima"
                  readonly
                  class="form-control"
                  id="nombre-materia-prima"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    id="agregarCodigoProveedor"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="table-responsive mt-4">
              <table class="table text-center">
                <thead class="table-success ">
                  <tr>
                    <th scope="col">Cod. Ingreso</th>
                    <th scope="col">N° Ingreso</th>
                    <th scope="col">Fecha ingreso</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2111131c</td>
                    <td>002</td>
                    <td>24/01/2023</td>
                    <td>200 kg</td>
                    <td>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <div class="form-check-label" for="flexCheckDefault">
                            <input class="form-control" type="number" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>2111131c</td>
                    <td>002</td>
                    <td>24/01/2023</td>
                    <td>200 kg</td>
                    <td>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <div class="form-check-label" for="flexCheckDefault">
                            <input class="form-control" type="number" />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mb-3 row">
            <label for="fecha-salida-stock" class="col-sm-2 col-form-label">
              Fecha de salida
            </label>
            <div class="col-md-3">
              <FechaPicker />
            </div>
            <div class="col-md-3">
              <HoraPicker />
            </div>
          </div>

          <div class="mb-3 row">
            <label for="documento-salida" class="col-sm-2 col-form-label">
              Documento
            </label>
            <div class="col-md-3">
              <input
                type="text"
                name="documentoSalida"
                readonly
                class="form-control"
                id="documento-salida"
              />
            </div>
          </div>

          <div class="mb-3 row">
            <label for="cantidad-salida" class="col-sm-2 col-form-label">
              Cantidad Salida
            </label>
            <div class="col-md-2">
              <input
                type="number"
                name="cantidadSalida"
                readonly
                class="form-control"
                id="cantidad-salida"
              />
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AgregarSalidaStock;
