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
    $idReqMolDet = $data["id"];

    if ($pdo) {
        $sql =
            "SELECT
            rmd.id,
            rmd.idMatPri,
            rmd.idReqMol,
            pd.codLotProd,
            p.nomProd,
            p.codProd,
            p.codProd2,
            rmd.idReqMolDetEst,
            rmde.desReqMolDetEst,
            rmd.canReqMolDet
            FROM requisicion_molienda_detalle as rmd
            JOIN producto as p on p.id = rmd.idMatPri
            JOIN requisicion_molienda_detalle_estado as rmde on rmde.id = rmd.idReqMolDetEst
            JOIN requisicion_molienda as rm on rm.id = rmd.idreqMol
            JOIN produccion pd on pd.id = rm.idProdc
            WHERE rmd.id = ?
            ";
        // PREPARAMOS LA CONSULTA
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(1, $idReqMolDet, PDO::PARAM_INT);
        try {
            $stmt->execute();
        } catch (Exception $e) {
            $message_error = "ERROR INTERNO SERVER";
            $description_error = $e->getMessage();
        }

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($result, $row);
        }

        // DESCOMENTAR PARA VER LA DATA DE LA CONSULTA Y REALIZAR CAMBIOS
        // print_r($result);
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
