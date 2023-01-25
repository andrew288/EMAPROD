import React, { useState, useEffect } from "react";
import { FilterCategoriaMateriaPrima } from "../../components/FilterCategoriaMateriaPrima";
import { ItemMateriPrima } from "../../components/ItemMateriPrima";
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
    if (name == "filterCodMatPri") {
      let resultadoBusqueda = dataMatPri.filter((element) => {
        if (
          element.refCodMatPri
            .toString()
            .toLowerCase()
            .includes(terminoBusqueda.toLowerCase())
        ) {
          return element;
        }
      });
      setdataMatPriTmp(resultadoBusqueda);
    } else {
      let resultadoBusqueda = dataMatPri.filter((element) => {
        if (
          element.nomMatPri
            .toString()
            .toLowerCase()
            .includes(terminoBusqueda.toLowerCase())
        ) {
          return element;
        }
      });
      setdataMatPriTmp(resultadoBusqueda);
    }
  };

  const AddNewCategory = ({label}) => {
    setfilters({
      ...filters,
      filterCatMatPri: label
    });
    filterByCategory(label);
  }

  const filterByCategory = (terminoBusqueda) => {
    let resultadoBusqueda = dataMatPri.filter((element) => {
      if (
        element.desMatPriCat
          .toString()
          .toLowerCase()
          .includes(terminoBusqueda.toLowerCase())
      ) {
        return element;
      }
    });
    setdataMatPriTmp(resultadoBusqueda);
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
              Codigo
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
            <FilterCategoriaMateriaPrima onNewInput={AddNewCategory}/>
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
            {dataMatPriTmp.length !== 0
              ? dataMatPriTmp.map((element) => (
                  <ItemMateriPrima key={element.id} {...element} />
                ))
              : ""}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListMateriaPrima;
