import React, { useState, useEffect } from "react";
import { FilterCategoriaMateriaPrima } from "../../components/FilterCategoriaMateriaPrima";
// import { ItemMateriPrima } from "../../components/ItemMateriPrima";
import { getMateriaPrima } from "../../helpers/getMateriasPrimas";

// IMPORTACIONES PARA TABLE MUI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

const ListMateriaPrima = () => {
  // ESTADOS PARA LOS FILTROS PERSONALIZADOS
  const [dataMatPri, setdataMatPri] = useState([]);
  const [dataMatPriTmp, setdataMatPriTmp] = useState([]);
  const [filters, setfilters] = useState({
    filterCodMatPri: "",
    filterCatMatPri: 0,
    filterNomMatPri: "",
  });

  const { filterCodMatPri, filterCatMatPri, filterNomMatPri } = filters;

  // ESTADOS PARA LA PAGINACIÓN
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // FUNCION PARA TRAER LA DATA DE MATERIA DE PRIMA
  const obtenerDataMateriPrima = async () => {
    const resultPeticion = await getMateriaPrima();
    setdataMatPri(resultPeticion);
    setdataMatPriTmp(resultPeticion);
  };

  // MANEJADORES DE LOS FILTROS
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

  const AddNewCategory = ({ label }) => {
    setfilters({
      ...filters,
      filterCatMatPri: label,
    });
    filterByCategory(label);
  };

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
  };

  // MANEJADORES DE LA PAGINACION
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // INICIALIZAMOS LA DATA ANTES DE RENDERIZAR EL COMPONENTE
  useEffect(() => {
    obtenerDataMateriPrima();
  }, []);

  return (
    <>
      <div className="container">
        <form className="row mb-4 mt-4">
          {/* FILTRO POR MATERIA PRIMA */}
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

          {/* FILTRO POR CATEGORIA */}
          <div className="col-md-3">
            <label for="inputPassword4" className="form-label">
              Categoria
            </label>
            <FilterCategoriaMateriaPrima onNewInput={AddNewCategory} />
          </div>

          {/* FILTRO POR NOMBRE */}
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

        {/* TABLA DE RESULTADOS */}
        <Paper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" width={80}>
                    Código
                  </TableCell>
                  <TableCell align="left" width={150}>
                    Categoria
                  </TableCell>
                  <TableCell align="left" width={350}>
                    Nombre
                  </TableCell>
                  <TableCell align="left" width={150}>
                    Stock
                  </TableCell>
                  {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                  <TableCell align="left" width={150}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataMatPriTmp
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.refCodMatPri}
                      </TableCell>
                      <TableCell align="left">{row.desMatPriCat}</TableCell>
                      <TableCell align="left">{row.nomMatPri}</TableCell>
                      <TableCell align="left">
                        {row.stoMatPri}&nbsp;{row.simMed}
                      </TableCell>
                      <TableCell align="left">
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
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataMatPriTmp.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* FORMA BASICA DE TABLA (OBSOLETA) */}
        {/* <table className="table">
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
        </table> */}
      </div>
    </>
  );
};

export default ListMateriaPrima;
