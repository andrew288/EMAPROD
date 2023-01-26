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
    if (isset($data["id"])) {

        $idMateriaPrima = $data["id"];

        if ($pdo) {
            $sql =
                "SELECT
            M.id,
            M.refCodMatPri, 
            M.idMatPriCat,
            M.desMatPri,
            C.desMatPriCat,
            M.idMed,
            ME.simMed,
            M.nomMatPri,
            M.stoMatPri
            FROM materia_prima M
            LEFT JOIN materia_prima_categoria C ON M.idMatPriCat = C.id
            LEFT JOIN medida ME ON M.idMed = ME.id
            WHERE M.id = ?
            ";
            // Preparamos la consulta
            $stmt = $pdo->prepare($sql);

            $stmt->bindParam(1, $idMateriaPrima, PDO::PARAM_INT);
            // Ejecutamos la consulta
            $stmt->execute();
            // Recorremos los resultados
            $count_results = 0;
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($result, $row);
                $count_results++;
            }

            if ($count_results == 0) {
                $message_error = "No se pudo encontrar el elemento";
                $description_error = "El id proporcionado no corresponde a ninguna materia prima";
            }
        } else {
            // No se pudo realizar la conexion a la base de datos
            $message_error = "Error con la conexion a la base de datos";
            $description_error = "Error con la conexion a la base de datos a traves de PDO";
        }
    } else {
        $message_error = "No se proporciono el id de la materia prima";
        $description_error = "No se proporciono el id de la materia prima en la consulta";
    }

    // Retornamos el resultado
    $return['message_error'] = $message_error;
    $return['description_error'] = $description_error;
    $return['result'] = $result;
    echo json_encode($return);
}