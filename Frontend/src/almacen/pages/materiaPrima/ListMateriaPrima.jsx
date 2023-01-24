import React, { useState, useEffect } from "react";
import { FilterCategoriaMateriaPrima } from "../../components/FilterCategoriaMateriaPrima";
import { getMateriaPrima } from "./../../helpers/getMateriaPrima";

const ListMateriaPrima = () => {
  const [dataMatPri, setdataMatPri] = useState([]);
  const [dataMatPriTmp, setdataMatPriTmp] = useState([]);
  const [filters, setfilters] = useState({
    filterCodMatPri: "",
    filterCatMatPri: 0,
    filterNomMatPri: "",
  });

  const { filterCodMatPri, filterCatMatPri, filterNomMatPri } = filters;

  const obtenerDataMateriPrima = async () => {
    const resultPeticion = await getMateriaPrima();
    setdataMatPri(resultPeticion);
    setdataMatPriTmp(resultPeticion);
  };

  const handleFormFilter = ({ target }) => {
    const { name, value } = target;
    setfilters({
      ...filters,
      [name]: value,
    });
    filter(value, name);
  };

  const filter = (terminoBusqueda, name) => {
    if(name == "filterCodMatPri"){
      console.log("fILTRO DE cod");
      let resultadoBusqueda = dataMatPri.filter((element) => {
        if(element.refCodMatPri.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          element.nomMatPri.toString().toLowerCase().includes(filterNomMatPri)){
            return element;
        }
      })
      setdataMatPriTmp(resultadoBusqueda);

    }else{
      console.log("fILTRO DE nom");
      let resultadoBusqueda = dataMatPri.filter((element) => {
        if(element.nomMatPri.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          element.refCodMatPri.toString().toLowerCase().includes(filterCodMatPri)){
            return element;
        }
      })
      setdataMatPriTmp(resultadoBusqueda);
    }
  }

  useEffect(() => {
    obtenerDataMateriPrima();
  }, []);

  return (
    <>
      <div className="container">
        <form className="row mb-4 mt-4">
          <div className="col-md-2">
            <label for="inputEmail4" className="form-label">
              Codigo Materia Prima
            </label>
            <input
              type="text"
              onChange={handleFormFilter}
              value={filterCodMatPri}
              name="filterCodMatPri"
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <label for="inputPassword4" className="form-label">
              Categoria
            </label>
            <FilterCategoriaMateriaPrima />
          </div>
          <div className="col-md-4">
            <label for="inputPassword4" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              onChange={handleFormFilter}
              value={filterNomMatPri}
              name="filterNomMatPri"
              className="form-control"
            />
          </div>
        </form>
        <table className="table">
          <thead className="table-light">
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Categoria</th>
              <th scope="col">Nombre</th>
              <th scope="col">Stock</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataMatPri.length !== 0
              ? dataMatPriTmp.map((element) => {
                  return (
                    <tr>
                      <td>{element.refCodMatPri}</td>
                      <td>{element.desMatPriCat}</td>
                      <td>{element.nomMatPri}</td>
                      <td>
                        {element.stoMatPri} {element.simMed}
                      </td>
                      <td>
                        <div className="btn-toolbar">
                          <button className="btn btn-success me-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-pencil-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                            </svg>
                          </button>
                          <button className="btn btn-danger">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-trash-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : ""}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListMateriaPrima;
