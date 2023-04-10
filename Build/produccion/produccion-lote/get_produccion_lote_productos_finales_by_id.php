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
    $idLotProdc = $data["id"];

    if ($pdo) {
        $sql =
            "SELECT
            pd.id,
            pd.idProdt,
            p.nomProd,
            pd.idProdEst,
            pe.desEstPro,
            pd.idProdTip,
            pt.desProdTip,
            pd.codLotProd,
            pd.klgLotProd,
            pd.canLotProd,
            pd.fecVenLotProd
        FROM produccion pd
        JOIN producto as p ON p.id = pd.idProdt
        JOIN produccion_estado as pe ON pe.id = pd.idProdEst
        JOIN produccion_tipo as pt ON pt.id = pd.idProdTip 
        WHERE pd.id = ?";

        try {
            // PREPARAMOS LA CONSULTA
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(1, $idLotProdc, PDO::PARAM_INT);
            $stmt->execute();
            // recorremos los resultados
            $sql_detalle = "";

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $row["proFinProdDet"] = [];

                $sql_detalle =
                    "SELECT
                ppf.id,
                ppf.idProdcProdtFinEst,
                ppfe.desProProFinEst,
                ppf.idProdt,
                pd.nomProd,
                me.simMed,
                cl.desCla,
                ppf.canTotProgProdFin,
                ppf.canTotIngProdFin
                FROM produccion_producto_final ppf
                JOIN producto as pd on pd.id = ppf.idProdt
                JOIN medida as me on me.id = pd.idMed
                JOIN clase as cl on cl.id = pd.idCla
                JOIN produccion_producto_final_estado as ppfe on ppfe.id = ppf.idProdcProdtFinEst
                WHERE ppf.idProdc = ?
                ";
                try {
                    $stmt_detalle = $pdo->prepare($sql_detalle);
                    $stmt_detalle->bindParam(1, $idLotProdc, PDO::PARAM_INT);
                    $stmt_detalle->execute();

                    while ($row_detalle = $stmt_detalle->fetch(PDO::FETCH_ASSOC)) {
                        array_push($row["proFinProdDet"], $row_detalle);
                    }
                } catch (PDOException $e) {
                    $message_error = "ERROR INTERNO SERVER";
                    $description_error = $e->getMessage();
                }
                //AÑADIMOS TODA LA DATA FORMATEADA
                array_push($result, $row);
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