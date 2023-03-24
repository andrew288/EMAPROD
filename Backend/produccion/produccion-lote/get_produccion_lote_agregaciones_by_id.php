<?php

require('../../common/conexion.php');
require_once('../../common/utils.php');
include_once "../../common/cors.php";

$pdo = getPDO();
$result = [];
$message_error = "";
$description_error = "";


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($pdo) {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $idLotProdc = $data["id"];

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
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(1, $idLotProdc, PDO::PARAM_INT);
            $stmt->execute(); // ejecutamos
            // Recorremos los resultados
            $sql_detalle_agregaciones_lote_produccion = "";
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $row["detAgr"] = [];
                $sql_detalle_agregaciones_lote_produccion =
                    "SELECT 
                pa.id,
                pa.idProdc,
                pa.idProdt,
                p.nomProd,
                pa.idAlm,
                al.nomAlm,
                pa.idProdAgrMot,
                pam.desProdAgrMot,
                pa.canProdAgr
                FROM produccion_agregacion as pa
                JOIN producto as p ON p.id = pa.idProdt
                JOIN almacen as al ON al.id = pa.idAlm
                JOIN produccion_agregacion_motivo as pam ON pam.id = pa.idProdAgrMot
                WHERE pa.idProdc = ?";

                try {
                    $stmt_detalle_agregaciones_lote_produccion = $pdo->prepare($sql_detalle_agregaciones_lote_produccion);
                    $stmt_detalle_agregaciones_lote_produccion->bindParam(1, $idLotProdc, PDO::PARAM_INT);
                    $stmt_detalle_agregaciones_lote_produccion->execute();

                    while ($row_detalle_agregacion_lote_produccion = $stmt_detalle_agregaciones_lote_produccion->fetch(PDO::FETCH_ASSOC)) {
                        array_push($row["detAgr"], $row_detalle_agregacion_lote_produccion);
                    }
                } catch (PDOException $e) {
                    $message_error = "ERROR INTERNO EN LA CONSULTA DE AGREGACIONES";
                    $description_error = $e->getMessage();
                }
                array_push($result, $row);
            }
        } catch (PDOException $e) {
            $message_error = "ERROR INTERNO EN LA CONSULTA DE ENTRADAS";
            $description_error = $e->getMessage();
        }
    } else {
        // No se pudo realizar la conexion a la base de datos
        $message_error = "Error con la conexion a la base de datos";
        $description_error = "Error con la conexion a la base de datos a traves de PDO";
    }

    // Retornamos el resultado
    $return['message_error'] = $message_error;
    $return['description_error'] = $description_error;
    $return['result'] = $result;
    echo json_encode($return);
}
