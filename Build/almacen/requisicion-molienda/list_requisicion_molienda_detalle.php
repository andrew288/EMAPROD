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

    $data_requsicion_molienda = [];

    if ($pdo) {
        $sql =
            "SELECT
            rm.id,
            rm.idProd,
            p.nomProd,
            rm.idReqMolEst,
            rme.desReqMolEst,
            rm.codLotReqMol,
            rm.canLotReqMol,
            rm.klgLotReqMol,
            DATE(rm.fecPedReqMol) as fecPedReqMol,
            DATE(rm.fecTerReqMol) as fecTerReqMol
            FROM requisicion_molienda rm
            JOIN producto as p on p.id = rm.idProd
            JOIN requisicion_molienda_estado as rme on rme.id = rm.idReqMolEst
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
            $idReqMol = $row["id"];
            $row["reqMolDet"] = [];

            $sql_detalle =
                "SELECT
            rmd.id,
            rmd.idMatPri,
            mp.nomMatPri,
            mp.codMatPri,
            rmd.idReqMolDetEst,
            rmde.desReqMolDetEst,
            rmd.canReqMolDet
            FROM requisicion_molienda_detalle rmd
            JOIN materia_prima as mp on mp.id = rmd.idMatPri
            JOIN requisicion_molienda_detalle_estado as rmde on rmde.id = rmd.idReqMolDetEst
            WHERE rmd.idReqMol = ?
            ";
            $stmt_detalle = $pdo->prepare($sql_detalle);
            $stmt_detalle->bindParam(1, $idReqMol, PDO::PARAM_INT);
            try {
                $stmt_detalle->execute();
            } catch (Exception $e) {
                $message_error = "ERROR INTERNO SERVER";
                $description_error = $e->getMessage();
            }
            while ($row_detalle = $stmt_detalle->fetch(PDO::FETCH_ASSOC)) {
                array_push($row["reqMolDet"], $row_detalle);
            }
            //AÑADIMOS TODA LA DATA FORMATEADA
            array_push($data_requsicion_molienda, $row);
        }
        // DESCOMENTAR PARA VER LA DATA
        //print_r($data_requsicion_molienda);

        $result = $data_requsicion_molienda;
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
