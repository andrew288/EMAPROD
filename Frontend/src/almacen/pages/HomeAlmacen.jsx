import React from "react";
import { Link } from "react-router-dom";

const HomeAlmacen = () => {
  return (
    <>
      <div className="container">
        <h2 className="mt-4 p-2 bg-success-subtle text-emphasis-success">
          Acciones Frecuentes
        </h2>
        <section className="pt-4">
          <div className="container px-lg-5">
            <div className="row gx-lg-5">
              {/* REQUISICIONES SELECCION */}
              <div className="col-lg-6 col-xxl-4 mb-5">
                <div className="card bg-light border-0 h-100">
                  <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-4 mt-n4">
                      <i className="bi bi-collection"></i>
                    </div>
                    <h2 className="fs-4 fw-bold">Requisiciones Seleccion</h2>
                    <Link
                      to="/almacen/requisicion-seleccion"
                      className="btn btn-primary"
                    >
                      Ingresar
                    </Link>
                  </div>
                </div>
              </div>
              {/* ENTRADAS DE STOCK */}
              <div className="col-lg-6 col-xxl-4 mb-5">
                <div className="card bg-light border-0 h-100">
                  <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-4 mt-n4">
                      <i className="bi bi-collection"></i>
                    </div>
                    <h2 className="fs-4 fw-bold">Entradas stock</h2>
                    <Link
                      to="/almacen/entradas-stock"
                      className="btn btn-primary"
                    >
                      Ingresar
                    </Link>
                  </div>
                </div>
              </div>
              {/* REPORTES ALMACEN */}
              <div className="col-lg-6 col-xxl-4 mb-5">
                <div className="card bg-light border-0 h-100">
                  <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-4 mt-n4">
                      <i className="bi bi-collection"></i>
                    </div>
                    <h2 className="fs-4 fw-bold">Reportes</h2>
                    <Link to="/almacen/reportes" className="btn btn-primary">
                      Ingresar
                    </Link>
                  </div>
                </div>
              </div>
              {/* LOTE PRODUCCION */}
              <div className="col-lg-6 col-xxl-4 mb-5">
                <div className="card bg-light border-0 h-100">
                  <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-4 mt-n4">
                      <i className="bi bi-collection"></i>
                    </div>
                    <h2 className="fs-4 fw-bold">Lote produccion</h2>
                    <Link
                      to="/almacen/lote-produccion"
                      className="btn btn-primary"
                    >
                      Ingresar
                    </Link>
                  </div>
                </div>
              </div>
              {/* STOCK ALMACENES */}
              <div className="col-lg-6 col-xxl-4 mb-5">
                <div className="card bg-light border-0 h-100">
                  <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-4 mt-n4">
                      <i className="bi bi-collection"></i>
                    </div>
                    <h2 className="fs-4 fw-bold">Stock almacenes</h2>
                    <Link
                      to="/almacen/stock-almacen"
                      className="btn btn-primary"
                    >
                      Ingresar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <h2 className="mt-4 p-2 bg-success-subtle text-emphasis-success">
          Acciones administrativas
        </h2>
        <section className="pt-4">
          <div className="container px-lg-5">
            <div className="row gx-lg-5">
              <div className="col-lg-6 col-xxl-4 mb-5">
                <div className="card bg-light border-0 h-100">
                  <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-4 mt-n4">
                      <i className="bi bi-collection"></i>
                    </div>
                    <h2 className="fs-4 fw-bold">Materias Primas</h2>
                    <Link
                      to="/almacen/materia-prima"
                      className="btn btn-primary"
                    >
                      Ingresar
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-xxl-4 mb-5">
                <div className="card bg-light border-0 h-100">
                  <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-4 mt-n4">
                      <i className="bi bi-collection"></i>
                    </div>
                    <h2 className="fs-4 fw-bold">Proveedores</h2>
                    <Link to="/almacen/proveedor" className="btn btn-primary">
                      Ingresar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomeAlmacen;
