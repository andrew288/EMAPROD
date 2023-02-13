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
    $idProd = $data["idProd"];
    $idReqMolEst = $data["idReqMolEst"];
    $codLotReqMol = $data["codLotReqMol"];
    $canLotReqMol = $data["canLotReqMol"];
    $klgLotReqMol = $data["klgLotReqMol"];
    $reqMolDet = $data["reqMolDet"];
    $idLastInsertion = 0;

    if ($pdo) {
        /* CONDICION:
            1.- EL CODIGO DE LOTE NO DEBE SER REPETIDO DURANTE TODO EL AÑO DE PRODUCCION
            2.- OTHER RULES
        */
        $year = date("Y"); // obtenemos el año actual
        $sql = "SELECT * FROM requisicion_molienda WHERE codLotReqMol=? AND fecPedReqMol REGEXP '^$year-*'";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(1, $codLotReqMol, PDO::PARAM_STR);
        $stmt->execute();
        $countRows = $stmt->rowCount();
        if ($countRows > 0) {
            $message_error = "REGISTRO EXISTENTE";
            $description_error = "Ya existe una requisicion con el numero de lote ingresado, si es correcto consulte con soporte";
        } else {
            $sql =
                "INSERT INTO
                requisicion_molienda
                (idProd, idReqMolEst, codLotReqMol, canLotReqMol, klgLotReqMol)
                VALUES (?,?,?,'$canLotReqMol','$klgLotReqMol');
                ";
            // PREPARAMOS LA CONSULTA
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(1, $idProd, PDO::PARAM_INT);
            $stmt->bindParam(2, $idReqMolEst, PDO::PARAM_INT);
            $stmt->bindParam(3, $codLotReqMol, PDO::PARAM_STR);

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
