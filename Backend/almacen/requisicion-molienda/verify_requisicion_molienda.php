<?php
include_once "../../common/cors.php";
header('Content-Type: application/json; charset=utf-8');
require('../../common/conexion.php');
require_once('../../common/utils.php');

$pdo = getPDO();
$result = [];
$message_error = "";
$description_error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $idReqMol = $data["id"];

    if ($pdo) {
        $idReqMolEst = 4; //verificado
        $idReqMolEstCompletado = 3; // completado pero no verificado
        $sql =
            "UPDATE
            requisicion_molienda
            SET idReqMolEst = ?
            WHERE id = ? AND idReqMolEst = ?
            ";
        try {
            // PREPARAMOS LA CONSULTA
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(1, $idReqMolEst, PDO::PARAM_INT);
            $stmt->bindParam(2, $idReqMol, PDO::PARAM_INT);
            $stmt->bindParam(3, $idReqMolEstCompletado, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() !== 1) {
                $message_error = "Esta requisicion no tiene un estado de completo";
                $description_error = "Esta requisicion no tiene un estado de completo por lo tanto no se puede verificar";
            }
        } catch (Exception $e) {
            $message_error = "ERROR INTERNO SERVER";
            $description_error = $e->getMessage();
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
