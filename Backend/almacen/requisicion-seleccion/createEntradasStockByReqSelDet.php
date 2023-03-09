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
    $idReqSel = $data["idReqSel"]; // id requisicion seleccion
    $idReqSelDet = $data["idReqSelDet"]; // id requisicion seleccion detalle
    $idMatPri = $data["idMatPri"]; // id materia prima
    $salStoSelDet = $data["salStoSelDet"]; // salida

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
                $canSalStoReqSel = $item["canSalStoReqSel"];
                $canEntStoReqSel = $item["canEntStoReqSel"];
                $merReqSel = $item["merReqSel"];
                $idAlm = $item["idAlm"];
                $fecEntStoReqSel = date('Y-m-d H:i:s'); // Fecha de la entrada a stock

                $idSalEntSelEst = 2; // ESTADO DE ENTRADA COMPLETADA

                // ACTUALIZAMOS LA SALIDA_ENTRADA_SELECCION
                $idSalEntSelEstSalidaCompleta = 1;
                $sql =
                    "UPDATE
            salida_entrada_seleccion
            SET canEntStoReqSel = $canEntStoReqSel, merReqSel = $merReqSel, idSalEntSelEst = ?, fecEntStoReqSel = ?
            WHERE id = ? AND idSalEntSelEst = ?";

                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(1, $idSalEntSelEst, PDO::PARAM_INT);
                $stmt->bindParam(2, $fecEntStoReqSel); // fecha de la entrada
                $stmt->bindParam(3, $idSalEntStoSel, PDO::PARAM_INT);
                $stmt->bindParam(4, $idSalEntSelEstSalidaCompleta, PDO::PARAM_INT);

                // EJECUTAMOS LA ACTUALIZACION DE LA TABLA
                $stmt->execute();

                $lineas_afectadas = $stmt->rowCount();

                if ($lineas_afectadas != 0) {
                    // ACTUALIZAMOS LA ENTRADA STOCK
                    /*
                        DE LA ENTRADA ACTUALIZAMOS.
                        - merTor ( la merma total de la entrada)
                        - merDis ( la merma disponible que se reduce en cada r. molienda detalle)
                        - canTotDis ( la cantidad total disponible )
                        - estado de la entrada ( estado disponible porque esta entrando materia prima seleccionada que sera disponible)
                    */
                    $idEntStoEst = 1; // ESTADO DE ENTRADA DISPONIBLE
                    $sql_update_entrada_stock =
                        "UPDATE
                    entrada_stock
                    SET merTot = merTot + $merReqSel, merDis = merDis + $merReqSel, canTotDis = canTotDis + $canEntStoReqSel, idEntStoEst = ?
                    WHERE id = ?
                    ";
                    $stmt_update_entrada_stock = $pdo->prepare($sql_update_entrada_stock);
                    $stmt_update_entrada_stock->bindParam(1, $idEntStoEst, PDO::PARAM_INT);
                    $stmt_update_entrada_stock->bindParam(2, $idEntSto, PDO::PARAM_INT);
                    $stmt_update_entrada_stock->execute();

                    // ACTUALIZAMOS LA MATERIA PRIMA
                    // $sql_update_materia_prima =
                    //     "UPDATE materia_prima
                    // SET stoMatPri = stoMatPri + $canEntStoReqSel
                    // WHERE id = ?";

                    // $stmt_update_materia_prima = $pdo->prepare($sql_update_materia_prima);
                    // $stmt_update_materia_prima->bindParam(1, $idMatPri, PDO::PARAM_INT);
                    // $stmt_update_materia_prima->execute();

                    // ACTUALIZAMOS ALMACEN
                    $sql_update_almacen =
                        "UPDATE
                almacen_stock
                SET canStoDis = canStoDis + $canEntStoReqSel
                WHERE idAlm = ? AND idProd = ?
                ";
                    $stmt_update_almacen_stock =  $pdo->prepare($sql_update_almacen);
                    $stmt_update_almacen_stock->bindParam(1, $idAlm, PDO::PARAM_INT);
                    $stmt_update_almacen_stock->bindParam(2, $idMatPri, PDO::PARAM_INT);
                    // ejecutamos
                    $stmt_update_almacen_stock->execute();
                }

                // TERMINAMOS LA TRANSACCION
                $pdo->commit();
            } catch (PDOException $e) {
                $pdo->rollback();
                $message_error = "ERROR INTERNO SERVER: fallo en inserción de salidas";
                $description_error = $e->getMessage();
            }
            // SE TERMINA LA ITERACION Y SE CONTINUA CON LA SIGUIENTE SALIDA
        }

        // ACTUALIZAMOS LOS ESTADOS DE LA REQUISICION SELECCION MAESTRO Y DETALLE
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
                $idReqSelEst = 0;
                $idReqSelDetEst = 0; // ESTADO PARA EL DETALLE
                if ($total_salidas_entradas_salidas_terminadas != 0) {
                    $idReqSelDetEst = 3; // EN PROCESO
                } else {
                    $idReqSelDetEst = 4; // COMPLETADO
                }

                // ACTUALIZAMOS EL DETALLE
                $sql_update_requisicion_seleccion_detalle =
                    "UPDATE requisicion_seleccion_detalle
                SET idReqSelDetEst = ?
                WHERE idReqSel = ? AND idMatPri = ? AND id = ?";
                $stmt_update_requisicion_seleccion_detalle = $pdo->prepare($sql_update_requisicion_seleccion_detalle);
                $stmt_update_requisicion_seleccion_detalle->bindParam(1, $idReqSelDetEst, PDO::PARAM_INT);
                $stmt_update_requisicion_seleccion_detalle->bindParam(2, $idReqSel, PDO::PARAM_INT);
                $stmt_update_requisicion_seleccion_detalle->bindParam(3, $idMatPri, PDO::PARAM_INT);
                $stmt_update_requisicion_seleccion_detalle->bindParam(4, $idReqSelDet, PDO::PARAM_INT);
                $stmt_update_requisicion_seleccion_detalle->execute();

                // TERMINAMOS LA TRANSACCION
                $pdo->commit();


                // POR ULTIMO ACTUALIZAMOS EL MAESTRO DE REQUISICION SELECCION
                try {
                    // Iniciamos una transaccion
                    $pdo->beginTransaction();
                    $idReqSelDetEst = 4; // ESTADO DE DETALLE REQUISICION SELECCION COMPLETADO
                    $sql_consulta_requisicion_seleccion_detalle =
                        "SELECT * FROM requisicion_seleccion_detalle
                WHERE idReqSelDetEst <> ? AND idReqSel = ?";
                    $stmt_consulta_requisicion_seleccion_detalle = $pdo->prepare($sql_consulta_requisicion_seleccion_detalle);
                    $stmt_consulta_requisicion_seleccion_detalle->bindParam(1, $idReqSelDetEst, PDO::PARAM_INT);
                    $stmt_consulta_requisicion_seleccion_detalle->bindParam(2, $idReqSel, PDO::PARAM_INT);
                    $stmt_consulta_requisicion_seleccion_detalle->execute();

                    $total_requisiciones_seleccion_detalle_completadas = $stmt_consulta_requisicion_seleccion_detalle->rowCount();
                    $idReqSelEst = 0; // ESTADO DE REQUISICION SELECCION
                    if ($total_requisiciones_seleccion_detalle_completadas != 0) {
                        $idReqSelEst = 2; // ESTADO EN PROCESO
                    } else {
                        $idReqSelEst = 3; // ESTADO COMPLETADO
                    }

                    // ACTUALIZAMOS EL MAESTRO
                    if ($idReqSelEst == 3) {
                        $dateReqSelTerminado = date('Y-m-d H:i:s');
                        $sql_update_requisicion_seleccion =
                            "UPDATE requisicion_seleccion
                    SET idReqSelEst = ?, fecTerReqSel = ?
                    WHERE id = ?";
                        $stmt_update_requsicion_seleccion = $pdo->prepare($sql_update_requisicion_seleccion);
                        $stmt_update_requsicion_seleccion->bindParam(1, $idReqSelEst, PDO::PARAM_INT);
                        $stmt_update_requsicion_seleccion->bindParam(2, $dateReqSelTerminado);
                        $stmt_update_requsicion_seleccion->bindParam(3, $idReqSel, PDO::PARAM_INT);
                        $stmt_update_requsicion_seleccion->execute();
                    } else {
                        if ($idReqSelEst == 2) {
                            $sql_update_requisicion_seleccion =
                                "UPDATE requisicion_seleccion
                    SET idReqSelEst = ?
                    WHERE id = ?";
                            $stmt_update_requsicion_seleccion = $pdo->prepare($sql_update_requisicion_seleccion);
                            $stmt_update_requsicion_seleccion->bindParam(1, $idReqSelEst, PDO::PARAM_INT);
                            $stmt_update_requsicion_seleccion->bindParam(2, $idReqSel, PDO::PARAM_INT);
                            $stmt_update_requsicion_seleccion->execute();
                        }
                    }

                    // TERMINAMOS LA TRANSACCION
                    $pdo->commit();
                } catch (PDOException $e) {
                    $pdo->rollback();
                    $message_error = "ERROR INTERNO SERVER: fallo en la actualización del estadp de requisicion seleccion";
                    $description_error = $e->getMessage();
                }
            } catch (PDOException $e) {
                $pdo->rollback();
                $message_error = "ERROR INTERNO SERVER: fallo en la actualización del estado de requision seleccion detalle";
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
