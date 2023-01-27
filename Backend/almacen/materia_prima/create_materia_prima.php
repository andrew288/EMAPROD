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

    $refCodMatPri = $data["refCodMatPri"];
    $idMatPriCat = $data["idMatPriCat"];
    $desMatPri = $data["desMatPri"];
    //if(isset($data["desMatPri"]))
    $idMed = $data["idMed"];
    $nomMatPri = $data["nomMatPri"];
    $stoMatPri = $data["stoMatPri"];

    if ($pdo) {
        $sql =
            "INSERT INTO
        materia_prima
        (refCodMatPri, idMatPriCat, desMatPri, idMed, nomMatPri, stoMatPri)
        VALUES (?,?,?,?,?,'$stoMatPri')
        ";
        //Preparamos la consulta
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(1, $refCodMatPri, PDO::PARAM_STR); //CODIGO
        $stmt->bindParam(2, $idMatPriCat, PDO::PARAM_INT); //CATEGORIA
        $stmt->bindParam(3, $desMatPri, PDO::PARAM_STR); //DESCRIPCION
        $stmt->bindParam(4, $idMed, PDO::PARAM_INT); //MEDIDA
        $stmt->bindParam(5, $nomMatPri, PDO::PARAM_STR); //NOMBRE

        // Comprobamos la respuesta
        try {
            if (!$stmt->execute()) {
                $message_error = "No se pudo realizar la insercion";
                $description_error = "No se pudo realizar la insercion por favor verifique los datos ingresados";
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
}
