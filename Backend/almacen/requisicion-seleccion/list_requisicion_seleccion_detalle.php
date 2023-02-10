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

    $data_requisicion_seleccion = [];

    if ($pdo) {
        $sql =
            "SELECT
            rs.id,
            rs.idReqSelEst,
            rse.desReqSelEst,
            rs.codReqSel,
            rs.canReqSel,
            DATE(rs.fecPedReqSel) as fecPedReqSel
            FROM requisicion_seleccion rs
            JOIN requisicion_seleccion_estado as rse on rse.id = rs.idReqSelEst
            ";
        // PREPARAMOS LA CONSULTA
        $stmt = $pdo->prepare($sql);
        try {
            $stmt->execute();
        } catch (Exception $e) {
            $message_error = "ERROR INTERNO SERVER";
            $description_error = $e->getMessage();
        }
        $sql_detalle = "";

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $idReqSel = $row["id"];
            $row["reqSelDet"] = [];

            $sql_detalle =
                "SELECT
            rsd.id,
            rsd.idReqSel,
            rsd.idMatPri,
            mp.nomMatPri,
            mp.codMatPri,
            rsd.idReqSelDetEst,
            rsde.desReqSelDetEst,
            rsd.canReqSelDet
            FROM requisicion_seleccion_detalle rsd
            JOIN materia_prima as mp on mp.id = rsd.idMatPri
            JOIN requisicion_seleccion_detalle_estado as rsde on rsde.id = rsd.idReqSelDetEst
            WHERE rsd.idReqSel = ?
            ";
            $stmt_detalle = $pdo->prepare($sql_detalle);
            $stmt_detalle->bindParam(1, $idReqSel, PDO::PARAM_INT);
            try {
                $stmt_detalle->execute();
            } catch (Exception $e) {
                $message_error = "ERROR INTERNO SERVER";
                $description_error = $e->getMessage();
            }
            while ($row_detalle = $stmt_detalle->fetch(PDO::FETCH_ASSOC)) {
                array_push($row["reqSelDet"], $row_detalle);
            }
            //AÑADIMOS TODA LA DATA FORMATEADA
            array_push($data_requisicion_seleccion, $row);
        }
        // DESCOMENTAR PARA VER LA DATA
        //print_r($data_requisicion_seleccion);

        $result = $data_requisicion_seleccion;
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
