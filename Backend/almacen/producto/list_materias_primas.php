<?php

require('../../common/conexion.php');
include_once "../../common/cors.php";

$pdo = getPDO();
$result = [];
$message_error = "";
$description_error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($pdo) {
        $sql =
            "SELECT
        M.id,
        M.idCat,
        C.desCat,
        M.idMed,
        ME.simMed,
        M.codProd, 
        M.nomProd,
        M.stoActProd,
        M.esMatPri,
        M.esProFin,
        M.esProInt,
        M.cta1,
        M.cta2
        FROM producto M
        LEFT JOIN categoria C ON M.idCat = C.id
        LEFT JOIN medida ME ON M.idMed = ME.id
        WHERE M.esMatPri = ?
        ";
        // Preparamos la consulta
        $stmt = $pdo->prepare($sql);
        $esMatPri = 1; // filtramos las materis primas
        $stmt->bindParam(1, $esMatPri, PDO::PARAM_BOOL);
        // Ejecutamos la consulta
        try {
            $stmt->execute();
            // Recorremos los resultados
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($result, $row);
            }
        } catch (Exception $e) {
            $message_error = "ERROR INTERNO SERVER";
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
} else {
    $message_error = "No se realizo una peticion post";
    $description_error = "No se realizo una peticion post";
    $return['message_error'] = $message_error;
    $return['description_error'] = $description_error;
    $return['result'] = $result;
    echo json_encode($return);
}

// Si se pudo realizar la conexion a la base de datos

// Programa terminado
