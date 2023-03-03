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

        $añoActual = date("Y");

        $sql =
            "SELECT
            pd.id,
            pd.idProdt,
            p.nomProd,
            pd.codLotProd,
            DATE(pd.fecProdIni) AS fecProdIni
        FROM produccion pd
        JOIN producto p ON pd.idProdt = p.id
        WHERE pd.esEnv = ? AND pd.idProdEst = ?
        ORDER BY pd.fecProdIni DESC";

        try {
            $esEnv = 0; // no es solo envasado
            $idProdEst = 1; // es un lote de produccion iniciado

            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(1, $esEnv, PDO::PARAM_INT);
            $stmt->bindParam(2, $idProdEst, PDO::PARAM_INT);
            $stmt->execute(); // ejecutamos
            // Recorremos los resultados
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
