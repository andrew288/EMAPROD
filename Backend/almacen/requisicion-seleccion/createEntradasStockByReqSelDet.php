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

    // OBTENEMOS LOS DATOS
    $idReqSel = $data["idReqSel"];
    $idReqSelDet = $data["idReqSelDet"];
    $idMatPri = $data["idMatPri"];
    $salStoSelDet = $data["salStoSelDet"];

    $idEstSalStoMol = 1;

    if ($pdo) {
        $sql = "";
        foreach ($salStoSelDet as $item) {

            try {
                // INICIAMOS UNA TRANSACCION
                $pdo->beginTransaction();

                // OBTENEMOS LOS DATOS
                $idSalEntStoSel = $item["id"];
                $idEntSto = $item["idEntSto"];
                $canSalReqSel = $item["canSalReqSel"];
                $canEntReqSel = $item["canEntReqSel"];
                $merReqSel = $item["merReqSel"];
                $fecEntStoReqSel = "HORA ACTUAL"; //FALTA
                $idSalEntSelEst = 2;

                // ACTUALIZAMOS LA SALIDA_ENTRADA_SELECCION
                $sql =
                    "UPDATE
            salida_entrada_seleccion
            SET canEntReqSel = $canEntReqSel, merReqSel = $merReqSel, idSalEntSelEst = ?, fecEntStoReqSel = ?
            WHERE id = ?";

                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(1, $idSalEntSelEst, PDO::PARAM_INT);
                $stmt->bindParam(2, $fecEntStoReqSel, PDO::PARAM_INT);
                $stmt->bindParam(3, $idSalEntStoSel, PDO::PARAM_INT);

                // EJECUTAMOS LA ACTUALIZACION DE LA TABLA
                $stmt->execute();

                // ACTUALIZAMOS LA ENTRADA STOCK
                $idEntStoEst = 1; // ESTADO DE ENTRADA DISPONIBLE
                $sql_update_entrada_stock =
                    "UPDATE
                entrada_stock
                SET canTotDis = canTotDis + $canEntReqSel, canSel = canSel + $canEntReqSel ,idEntStoEst = ?
                WHERE id = ?
                ";
                $stmt_update_entrada_stock = $pdo->prepare($sql_update_entrada_stock);
                $stmt_update_entrada_stock->bindParam(1, $idEntStoEst, PDO::PARAM_INT);
                $stmt_update_entrada_stock->bindParam(2, $idEntSto, PDO::PARAM_INT);
                $stmt_update_entrada_stock->execute();

                // TERMINAMOS LA TRANSACCION
                $pdo->commit();
            } catch (PDOException $e) {
                $pdo->rollback();
                $message_error = "ERROR INTERNO SERVER: fallo en inserción de salidas";
                $description_error = $e->getMessage();
            }
            // SE TERMINA LA ITERACION Y SE CONTINUA CON LA SIGUIENTE SALIDA
        }

        // ACTUALIZAMOS LOS ESTADOS DE LA REQUISICION MOLIENDA MAESTRO Y DETALLE
        if (empty($message_error)) {

            // PRIMERO ACTUALIZAMOS EL DETALLE DE REQUISICION SELECCION
            try {
                // Iniciamos una transaccion
                $pdo->beginTransaction();
                $idSalEntSelEst = 1; // ESTADO DE SALIDA TERMINADA
                $sql_consulta_salida_entrada_seleccion =
                    "SELECT * FROM salida_entrada_seleccion
                WHERE idSalEntSelEst = ? AND idReqSel = ? AND idMatPri = ?";
                $stmt_consulta_salida_entrada_seleccion = $pdo->prepare($sql_consulta_salida_entrada_seleccion);
                $stmt_consulta_salida_entrada_seleccion->bindParam(1, $idSalEntSelEst, PDO::PARAM_INT);
                $stmt_consulta_salida_entrada_seleccion->bindParam(2, $idReqSel, PDO::PARAM_INT);
                $stmt_consulta_salida_entrada_seleccion->bindParam(3, $idMatPri, PDO::PARAM_INT);
                $stmt_consulta_salida_entrada_seleccion->execute();

                $total_salidas_entradas_salidas_terminadas = $stmt_consulta_salida_entrada_seleccion->rowCount();

                $idReqSelDetEst = 0;
                if ($total_salidas_entradas_salidas_terminadas != 0) {
                    $idReqSelDetEst = 3; // EN PROCESO
                } else {
                    $idReqSelDetEst = 4; // COMPLETADO
                }

                // ACTUALIZAMOS EL DETALLE
                $sql_update_requisicion_seleccion_detalle =
                    "UPDATE requisicion_seleccion_detalle
                SET idReqSelDetEst = ?";
                $stmt_update_requisicion_seleccion_detalle = $pdo->prepare($sql_update_requisicion_seleccion_detalle);
                $stmt_update_requisicion_seleccion_detalle->bindParam(1, $idReqSelDetEst, PDO::PARAM_INT);
                $stmt_update_requisicion_seleccion_detalle->execute();

                // TERMINAMOS LA TRANSACCION
                $pdo->commit();
            } catch (PDOException $e) {
                $pdo->rollback();
                $message_error = "ERROR INTERNO SERVER: fallo en la actualización del estado de requision seleccion detalle";
                $description_error = $e->getMessage();
            }

            // POR ULTIMO ACTUALIZAMOS EL MAESTRO DE REQUISICION SELECCION
            try {
                // Iniciamos una transaccion
                $pdo->beginTransaction();
                $idReqSelDetEst = 4;


                // TERMINAMOS LA TRANSACCION
                $pdo->commit();
            } catch (PDOException $e) {
                $pdo->rollback();
                $message_error = "ERROR INTERNO SERVER: fallo en la actualización del estaid de requisicion seleccion";
                $description_error = $e->getMessage();
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
