<?php
include_once "../../common/cors.php";
header('Content-Type: application/json; charset=utf-8');
require('../../common/conexion.php');

$pdo = getPDO();
$result = [];
$message_error = "";
$description_error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $idProdt = $data["idProdt"];
    $idProdTip = $data["idProdTip"];
    $codLotProd = $data["codLotProd"];
    $canLotProd = $data["canLotProd"];
    $klgLotProd = $data["klgLotProd"];
    $fecProdIniProg = $data["fecProdIniProg"];
    $fecProdFinProg = $data["fecProdFinProg"];
    $obsProd = $data["obsProd"];

    if ($pdo) {
        /* CONDICION:
            1.- EL CODIGO DE LOTE NO DEBE SER REPETIDO DURANTE TODO EL AÑO DE PRODUCCION
            2.- OTHER RULES
        */
        $year = date("Y"); // obtenemos el año actual
        $sql = "SELECT * FROM produccion WHERE codLotProd = ? AND fecProdIni REGEXP '^$year-*'";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(1, $codLotProd, PDO::PARAM_STR);
        $stmt->execute();
        $countRows = $stmt->rowCount();

        if ($countRows > 0) {
            $message_error = "REGISTRO EXISTENTE";
            $description_error = "Ya existe una requisicion con el numero de lote ingresado, si es correcto consulte con soporte";
        } else {
            // CALCULAMOS EL ESTADO DE LA PRODUCCION
            $idProdEst = 1; // iniciado

            // CALCULAMOS EL ESTADO DE LA PRODUCCION SEGUN SU PROGRAMACION DE INICIO
            $idProdIniProgEst = 0; // valor nulo
            $fechaIniciadoProgramacion = strtotime(explode(" ", $fecProdIniProg)[0]);
            $fechaIniciadoActual = strtotime(date("Y-m-d"));

            if ($fechaIniciadoProgramacion > $fechaIniciadoActual) {
                $idProdIniProgEst = 2; // inicio atrasado
            } else {
                if ($fechaIniciadoProgramacion == $fechaIniciadoActual) {
                    $idProdIniProgEst = 3; // inicio adelantado
                } else {
                    $idProdIniProgEst = 1; // inicio a tiempo
                }
            }

            // CALCULAMOS EL ESTADO DE LA PRODUCCION SEGUN SU PROGRAMACION DE FIN
            $idProdFinProgEst = 0;
            if ($idProdIniProgEst == 2) {
                $idProdFinProgEst = 2; // fin atrasado
            } else {
                if ($idProdFinProgEst == 3) {
                    $idProdFinProgEst = 3; // fin adelantado
                } else {
                    $idProdFinProgEst = 1; // fin a tiempo
                }
            }

            $sql =
                "INSERT INTO
                produccion
                (idProdt, 
                idProdEst, 
                idProdTip, 
                idProdFinProgEst, 
                idProdIniProgEst, 
                codProd, 
                codLotProd, 
                klgLotProd, 
                canLotProd,
                obsProd,
                fecProdIniProg
                fecProdFinProg)
                VALUES (?,?,?,?,?,?,?,$klgLotProd,$canLotProd,?,?,?);
                ";
            // PREPARAMOS LA CONSULTA
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(1, $idProdt, PDO::PARAM_INT);
            $stmt->bindParam(2, $idProdEst, PDO::PARAM_INT);
            $stmt->bindParam(3, $idProdTip, PDO::PARAM_INT);
            $stmt->bindParam(4, $idProdFinProgEst, PDO::PARAM_INT);
            $stmt->bindParam(5, $idProdIniProgEst, PDO::PARAM_INT);



            try {
                $pdo->beginTransaction();
                $stmt->execute();
                $idLastInsertion = $pdo->lastInsertId();
                $pdo->commit();
            } catch (PDOException $e) {
                $pdo->rollback();
                $message_error = "ERROR INTERNO SERVER: fallo en insercion de maestro requisicion molienda";
                $description_error = $e->getMessage();
            }

            if ($idLastInsertion != 0) {
                $sql_detalle = "";
                $idReqMolDetEst = 1; // ESTADO REQUERIDO
                try {
                    // COMENZAMOS LA TRANSACCION
                    $pdo->beginTransaction();
                    foreach ($reqMolDet as $fila) {
                        // EXTRAEMOS LOS VALORES
                        $idMatPri = $fila["idMatPri"];
                        $canMatPriReq = $fila["canMatPriFor"];

                        // CREAMOS LA SENTENCIA
                        $sql_detalle = "INSERT INTO 
                            requisicion_molienda_detalle (idReqMol, idMatPri, idReqMolDetEst, canReqMolDet) 
                            VALUES (?, ?, ?, $canMatPriReq);";
                        // PREPARAMOS LA CONSULTA
                        $stmt_detalle = $pdo->prepare($sql_detalle);
                        $stmt_detalle->bindParam(1, $idLastInsertion, PDO::PARAM_INT);
                        $stmt_detalle->bindParam(2, $idMatPri, PDO::PARAM_INT);
                        $stmt_detalle->bindParam(3, $idReqMolDetEst, PDO::PARAM_INT);
                        // EJECUTAMOS LA CONSULTA
                        $stmt_detalle->execute();
                        $sql_detalle = "";
                    }
                    // TERMINAMOS LA TRANSACCION
                    $pdo->commit();
                } catch (PDOException $e) {
                    $pdo->rollback();
                    $message_error = "ERROR INTERNO SERVER: fallo en inserción de detalles formula";
                    $description_error = $e->getMessage();
                }
            }
        }
    } else {
        $message_error = "Error con la conexion a la base de datos";
        $description_error = "Error con la conexion a la base de datos a traves de PDO";
    }
    // Retornamos el resultado
    $return['message_error'] = $message_error;
    $return['description_error'] = $description_error;
    $return['result'] = $result;
    echo json_encode($return);
}
