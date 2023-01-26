<?php
include_once "../../common/cors.php";
header('Content-Type: application/json; charset=utf-8');
require('../../common/conexion.php');

$pdo = getPDO();
$result = [];
$message_error = "";
$description_error = "";

if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    if (isset($data["id"])) {

        $idMateriaPrima = $data["id"];
        $refCodMatPri = $data["refCodMatPri"];
        $idMatPriCat = $data["idMatPriCat"];
        $desMatPri = $data["desMatPri"];
        //if(isset($data["desMatPri"]))
        $idMed = $data["idMed"];
        $nomMatPri = $data["nomMatPri"];
        $stoMatPri = $data["stoMatPri"];

        if ($pdo) {
            $sql =
                "UPDATE
            materia_prima
            SET refCodMatPri = :refCodMatPri,
            idMatPriCat = :idMatPriCat,
            desMatPri = :desMatPri,
            idMed = :idMed,
            nomMatPri = :nomMatPri,
            stoMatPri = '$stoMatPri'
            WHERE id = :id;
            ";
            //Preparamos la consulta
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':refCodMatPri', $refCodMatPri, PDO::PARAM_STR); //CODIGO
            $stmt->bindParam(':idMatPriCat', $idMatPriCat, PDO::PARAM_INT); //CATEGORIA
            $stmt->bindParam(':desMatPri', $desMatPri, PDO::PARAM_STR); //DESCRIPCION
            $stmt->bindParam(':idMed', $idMed, PDO::PARAM_INT); //MEDIDA
            $stmt->bindParam(':nomMatPri', $nomMatPri, PDO::PARAM_STR); //NOMBRE
            $stmt->bindParam(':id', $idMateriaPrima, PDO::PARAM_INT); //ID

            // Comprobamos la respuesta
            if (!$stmt->execute()) {
                $message_error = "No se pudo realizar la actualización";
                $description_error = "No se pudo actualizar, por favor verifique que existe el id ingresado";
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
