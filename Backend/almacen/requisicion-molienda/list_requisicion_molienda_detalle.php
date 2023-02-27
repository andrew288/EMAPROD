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

    $fechasMes = getStartEndDateNow();
    $fechaInicio = $fechasMes[0]; // inicio del mes
    $fechaFin = $fechasMes[1]; // fin del mes

    if (isset($data)) {
        if (!empty($data["fecReqMolIni"])) {
            $fechaInicio = $data["fecReqMolIni"];
        }
        if (!empty($data["fecReqMolFin"])) {
            $fechaFin = $data["fecReqMolFin"];
        }
    }

    $data_requsicion_molienda = [];

    if ($pdo) {
        $sql =
            "SELECT
            rm.id,
            rm.idProdc,
            pc.codLotPro,
            pc.esProPol,
            pc.esProLiq,
            rm.idReqMolEst,
            rme.desReqMolEst,
            rm.idProdt,
            p.nomProd,
            rm.canLotReqMol,
            rm.klgLotReqMol,
            rm.fecPedReqMol,
            rm.fecTerReqMol
            FROM requisicion_molienda rm
            JOIN producto as p on p.id = rm.idProdt
            JOIN produccion pc  on pc.id = rm.idProdc
            JOIN requisicion_molienda_estado as rme on rme.id = rm.idReqMolEst
            WHERE DATE(rm.fecPedReqMol) BETWEEN '$fechaInicio' AND '$fechaFin'
            ORDER BY rm.fecPedReqMol DESC
            ";
        try {
            // PREPARAMOS LA CONSULTA
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $sql_detalle = "";

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $idReqMol = $row["id"];
                $row["reqMolDet"] = [];

                $sql_detalle =
                    "SELECT
                rmd.id,
                rmd.idMatPri,
                p.nomProd,
                p.codProd,
                rmd.idReqMolDetEst,
                rmde.desReqMolDetEst,
                rmd.canReqMolDet
                FROM requisicion_molienda_detalle rmd
                JOIN producto as p on p.id = rmd.idMatPri
                JOIN requisicion_molienda_detalle_estado as rmde on rmde.id = rmd.idReqMolDetEst
                WHERE rmd.idReqMol = ?
                ";

                try {
                    $stmt_detalle = $pdo->prepare($sql_detalle);
                    $stmt_detalle->bindParam(1, $idReqMol, PDO::PARAM_INT);
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
