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
    $idReqMol = $data["idReqMol"];
    $idReqMolDet = $data["idReqMolDet"];
    $idMatPri = $data["idMatPri"];
    $docSalSto = $data["docSalSto"];
    $canReqMolDet = $data["canReqMolDet"];
    $salStoMolDet = $data["salStoMolDet"];
    $idEstSalStoMol = 1; // completado

    if ($pdo) {
        $sql = "";
        // RECORREMOS TODAS LAS ENTRADAS SELECCIONADAS PARA LA SALIDA
        foreach ($salStoMolDet as $item) {
            try {
                // INICIAMOS UNA TRANSACCION
                $pdo->beginTransaction();

                // OBTENEMOS LOS DATOS
                $idEntSto = $item["idEntSto"];
                $canSalReqMol = $item["canSalReqMol"];
                //$canTotDis = $item["canTotDis"];

                // CREAMOS LA CONSULTA
                $sql =
                    "INSERT
                salida_stock_molienda
                (idEntSto, idReqMol, idMatPri, idEstSalStoMol, docSalSto, canSalReqMol)
                VALUES (?,?,?,?,?,$canSalReqMol)";

                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(1, $idEntSto, PDO::PARAM_INT);
                $stmt->bindParam(2, $idReqMol, PDO::PARAM_INT);
                $stmt->bindParam(3, $idMatPri, PDO::PARAM_INT);
                $stmt->bindParam(4, $idEstSalStoMol, PDO::PARAM_INT);
                $stmt->bindParam(5, $docSalSto, PDO::PARAM_STR);

                // EJECUTAMOS LA CREACION DE UNA SALIDA
                $stmt->execute();

                // CONSULTA DE ENTRADA STOCK
                $canTotDisEntSto = 0;
                $idEntStoEst = 0;
                $canResAftOpe = 0;
                $idAlmacen = 0; // id del almacen para realizar la actualizacion

                $sql_consult_entrada_stock =
                    "SELECT 
                    canTotDis,
                    idAlm
                    FROM entrada_stock
                    WHERE id = ?";
                $stmt_consulta_entrada_stock = $pdo->prepare($sql_consult_entrada_stock);
                $stmt_consulta_entrada_stock->bindParam(1, $idEntSto, PDO::PARAM_INT);
                $stmt_consulta_entrada_stock->execute();

                while ($row = $stmt_consulta_entrada_stock->fetch(PDO::FETCH_ASSOC)) {
                    $canTotDisEntSto += $row["canTotDis"];
                    $idAlmacen = $row["idAlm"];
                }

                $canResAftOpe =  $canTotDisEntSto - $canSalReqMol;

                if ($canResAftOpe == 0) { // SI LA CANTIDAD RESTANTE ES 0
                    $idEntStoEst = 2; // ESTADO DE ENTRADA AGOTADA O TERMINADA
                } else {
                    $idEntStoEst = 1; // ESTADO DE ENTRADA DISPONIBLE
                }

                // ACTUALIZAMOS LA ENTRADA STOCK
                $sql_update_entrada_stock =
                    "UPDATE
                    entrada_stock
                    SET canTotDis = $canResAftOpe, idEntStoEst = ?
                    WHERE id = ?
                    ";
                $stmt_update_entrada_stock = $pdo->prepare($sql_update_entrada_stock);
                $stmt_update_entrada_stock->bindParam(1, $idEntStoEst, PDO::PARAM_INT);
                $stmt_update_entrada_stock->bindParam(2, $idEntSto, PDO::PARAM_INT);
                $stmt_update_entrada_stock->execute();

                // ACTUALIZAMOS EL ALMACEN CORRESPONDIENTE A LA ENTRADA
                $sql_update_almacen_stock =
                    "UPDATE almacen_stock
                    SET canSto = canSto - $canSalReqMol, canStoDis = canStoDis - $canSalReqMol
                    WHERE idAlm = ? AND idProd = ?";

                $stmt_update_almacen_stock = $pdo->prepare($sql_update_almacen_stock);
                $stmt_update_almacen_stock->bindParam(1, $idAlmacen, PDO::PARAM_INT);
                $stmt_update_almacen_stock->bindParam(2, $idMatPri, PDO::PARAM_INT);
                $stmt_update_almacen_stock->execute();

                // ACTUALIZAMOS EL STOCK TOTAL DE LA MATERIA PRIMA
                // $sql_update_materia_prima =
                //     "UPDATE materia_prima
                // SET stoMatPri = stoMatPri - $canSalReqMol
                // WHERE id = ?";

                // $stmt_update_materia_prima = $pdo->prepare($sql_update_materia_prima);
                // $stmt_update_materia_prima->bindParam(1, $idMatPri, PDO::PARAM_INT);
                // $stmt_update_materia_prima->execute();

                // TERMINAMOS LA TRANSACCION
                $pdo->commit();
            } catch (PDOException $e) {
                $pdo->rollback();
                $message_error = "ERROR INTERNO SERVER: fallo en inserción de salidas";
                $description_error = $e->getMessage();
            }
        }

        // ACTUALIZAMOS LOS ESTADOS DE LA REQUISICION MOLIENDA MAESTRO Y DETALLE
        if (empty($message_error)) {
            try {
                // Iniciamos una transaccion
                $pdo->beginTransaction();
                // ACTUALIZAMOS EL ESTADO DE LA REQUISICION MOLIENDA DETALLE

                $idReqMolDetEst = 2; // ESTADO DE COMPLETADO
                $total_requsiciones_molienda_detalle_no_completadas = 0;
                $sql_consulta_requisicion_molienda_detalle =
                    "SELECT * FROM requisicion_molienda_detalle
                WHERE idReqMol = ? AND idReqMolDetEst <> ?";
                $stmt_consulta_requisicion_molienda_detalle = $pdo->prepare($sql_consulta_requisicion_molienda_detalle);
                $stmt_consulta_requisicion_molienda_detalle->bindParam(1, $idReqMol, PDO::PARAM_INT);
                $stmt_consulta_requisicion_molienda_detalle->bindParam(2, $idReqMolDetEst, PDO::PARAM_INT);
                $stmt_consulta_requisicion_molienda_detalle->execute();

                $total_requsiciones_molienda_detalle_no_completadas = $stmt_consulta_requisicion_molienda_detalle->rowCount();

                $idReqMolEst = 0;

                if ($total_requsiciones_molienda_detalle_no_completadas == 1) {
                    $idReqMolEst = 3; // COMPLETADO
                } else {
                    $idReqMolEst = 2; // EN PROCESO
                }

                // PRIMERO ACTUALIZAMOS EL DETALLE
                $idReqMolDetEstCom = 2; // ESTADO DE COMPLETADO
                $sql_update_requisicion_molienda_detalle =
                    "UPDATE requisicion_molienda_detalle
                SET idReqMolDetEst = ?
                WHERE id = ?";
                $stmt_update_requisicion_molienda_detalle = $pdo->prepare($sql_update_requisicion_molienda_detalle);
                $stmt_update_requisicion_molienda_detalle->bindParam(1, $idReqMolDetEstCom, PDO::PARAM_INT);
                $stmt_update_requisicion_molienda_detalle->bindParam(2, $idReqMolDet, PDO::PARAM_INT);
                $stmt_update_requisicion_molienda_detalle->execute();

                // LUEGO ACTUALIZAMOS EL MAESTRO
                $sql_update_requisicion_molienda =
                    "UPDATE requisicion_molienda
                SET idReqMolEst = ?
                WHERE id = ?";
                $stmt_update_requisicion_molienda = $pdo->prepare($sql_update_requisicion_molienda);
                $stmt_update_requisicion_molienda->bindParam(1, $idReqMolEst, PDO::PARAM_INT);
                $stmt_update_requisicion_molienda->bindParam(2, $idReqMol, PDO::PARAM_INT);
                $stmt_update_requisicion_molienda->execute();

                // TERMINAMOS LA TRANSACCION
                $pdo->commit();
            } catch (PDOException $e) {
                $pdo->rollback();
                $message_error = "ERROR INTERNO SERVER: fallo en la actualización de los estados";
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
