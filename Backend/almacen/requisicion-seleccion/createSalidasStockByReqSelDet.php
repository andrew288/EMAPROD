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
    //$docSalSto = $data["docSalSto"];
    $canReqSelDet = $data["canReqSelDet"];
    $salStoSelDet = $data["salStoSelDet"];

    if ($pdo) {
        $sql = "";
        foreach ($salStoSelDet as $item) {

            try {
                // INICIAMOS UNA TRANSACCION
                $pdo->beginTransaction();

                // OBTENEMOS LOS DATOS
                $idEntSto = $item["idEntSto"];
                $canSalReqSel = $item["canSalReqSel"];
                $idSalEntSelEst = 1; // ESTADO DE SALIDA COMPLETA
                //$canTotDis = $item["canTotDis"];

                // CREAMOS LA CONSULTA
                $sql =
                    "INSERT
            salida_entrada_seleccion
            (idEntSto, idReqSel, idMatPri, idSalEntSelEst, canSalStoReqSel)
            VALUES (?,?,?,?,$canSalReqSel)";

                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(1, $idEntSto, PDO::PARAM_INT);
                $stmt->bindParam(2, $idReqSel, PDO::PARAM_INT);
                $stmt->bindParam(3, $idMatPri, PDO::PARAM_INT);
                $stmt->bindParam(4, $idSalEntSelEst, PDO::PARAM_INT);

                // EJECUTAMOS LA CREACION DE UNA SALIDA
                $stmt->execute();


                // CONSULTA DE ENTRADA STOCK
                $canTotPorSelEntSto = 0;
                $idEntStoEst = 1; // DISPONIBLE
                $canPorSelResAftOpe = 0;

                $sql_consult_entrada_stock =
                    "SELECT 
                canPorSel
                FROM entrada_stock
                WHERE id = ?";
                $stmt_consulta_entrada_stock = $pdo->prepare($sql_consult_entrada_stock);
                $stmt_consulta_entrada_stock->bindParam(1, $idEntSto, PDO::PARAM_INT);
                $stmt_consulta_entrada_stock->execute();

                while ($row = $stmt_consulta_entrada_stock->fetch(PDO::FETCH_ASSOC)) {
                    $canTotPorSelEntSto += $row["canPorSel"];
                }

                $canPorSelResAftOpe =  $canTotPorSelEntSto - $canSalReqSel;

                // CONDICIONES DE ESTADO
                // if ($canPorSelResAftOpe == 0) {
                //     $idEntStoEst = 2; 
                // } else {
                //     $idEntStoEst = 1; 
                // }

                // ACTUALIZAMOS LA ENTRADA STOCK
                $sql_update_entrada_stock =
                    "UPDATE
                entrada_stock
                SET canPorSel = $canPorSelResAftOpe, idEntStoEst = ?
                WHERE id = ?
                ";
                $stmt_update_entrada_stock = $pdo->prepare($sql_update_entrada_stock);
                $stmt_update_entrada_stock->bindParam(1, $idEntStoEst, PDO::PARAM_INT);
                $stmt_update_entrada_stock->bindParam(2, $idEntSto, PDO::PARAM_INT);
                $stmt_update_entrada_stock->execute();

                // ACTUALIZAMOS EL STOCK TOTAL DE LA MATERIA PRIMA
                $sql_update_materia_prima =
                    "UPDATE materia_prima
                SET stoMatPri = stoMatPri - $canSalReqSel
                WHERE id = ?";

                $stmt_update_materia_prima = $pdo->prepare($sql_update_materia_prima);
                $stmt_update_materia_prima->bindParam(1, $idMatPri, PDO::PARAM_INT);
                $stmt_update_materia_prima->execute();

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
            try {
                // Iniciamos una transaccion
                $pdo->beginTransaction();
                // ACTUALIZAMOS EL ESTADO DE LA REQUISICION SELECCION DETALLE

                // $idReqSelDetEst = 2; // ESTADO DE POR SELECCIONAR
                // $total_requsiciones_molienda_detalle_no_completadas = 0;
                // $sql_consulta_requisicion_molienda_detalle =
                //     "SELECT * FROM requisicion_molienda_detalle
                // WHERE idReqSel = ? AND idReqSelDetEst <> ?";
                // $stmt_consulta_requisicion_molienda_detalle = $pdo->prepare($sql_consulta_requisicion_molienda_detalle);
                // $stmt_consulta_requisicion_molienda_detalle->bindParam(1, $idReqSel, PDO::PARAM_INT);
                // $stmt_consulta_requisicion_molienda_detalle->bindParam(2, $idReqSelDetEst, PDO::PARAM_INT);
                // $stmt_consulta_requisicion_molienda_detalle->execute();

                // $total_requsiciones_molienda_detalle_no_completadas = $stmt_consulta_requisicion_molienda_detalle->rowCount();

                // $idReqSelEst = 0;

                // if ($total_requsiciones_molienda_detalle_no_completadas == 1) {
                //     $idReqSelEst = 3; // COMPLETADO
                // } else {
                //     $idReqSelEst = 2; // EN PROCESO
                // }

                // PRIMERO ACTUALIZAMOS EL DETALLE
                $idReqSelDetEstPorSel = 2; // ESTADO DE POR SELECCIONAR
                $sql_update_requisicion_molienda_detalle =
                    "UPDATE requisicion_seleccion_detalle
                SET idReqSelDetEst = ?
                WHERE id = ?";
                $stmt_update_requisicion_molienda_detalle = $pdo->prepare($sql_update_requisicion_molienda_detalle);
                $stmt_update_requisicion_molienda_detalle->bindParam(1, $idReqSelDetEstPorSel, PDO::PARAM_INT);
                $stmt_update_requisicion_molienda_detalle->bindParam(2, $idReqSelDet, PDO::PARAM_INT);
                $stmt_update_requisicion_molienda_detalle->execute();

                // LUEGO ACTUALIZAMOS EL MAESTRO
                // $sql_update_requisicion_molienda =
                //     "UPDATE requisicion_molienda
                // SET idReqSelEst = ?
                // WHERE id = ?";
                // $stmt_update_requisicion_molienda = $pdo->prepare($sql_update_requisicion_molienda);
                // $stmt_update_requisicion_molienda->bindParam(1, $idReqSelEst, PDO::PARAM_INT);
                // $stmt_update_requisicion_molienda->bindParam(2, $idReqSel, PDO::PARAM_INT);
                // $stmt_update_requisicion_molienda->execute();

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
