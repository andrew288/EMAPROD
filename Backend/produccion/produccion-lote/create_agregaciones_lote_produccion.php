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

    $detAgrLotProd = $data["detAgrLotProd"];

    if ($pdo) {
        $idAlm = 0;
        $sql_insert_detalle_agregacion_lote_produccion = "";

        foreach ($detAgrLotProd as $value) {
            $idProdc = $value["idProdc"];
            $idProdt = $value["idProdt"];
            $idProdAgrMot = $value["idProdAgrMot"];
            $canProdAgr = $value["canProdAgr"];

            // obtenemos el almacen de destino
            switch ($idProdAgrMot) {
                case 1:
                    $idAlm = 1; // almacen principal
                    break;
                case 7:
                    $idAlm = 7; // almacen de desmedros
                    break;
                default:
                    $idAlm = 1; // almacen principal
            }
            $sql_insert_detalle_agregacion_lote_produccion =
                "INSERT INTO produccion_agregacion
            (idProdc, idProdt, idAlm, idProdAgrMot, canProdAgr)
            VALUES (?, ?, ?, ?, $canProdAgr)";

            try {
                $stmt_insert_detalle_agregacion_lote_produccion = $pdo->prepare($sql_insert_detalle_agregacion_lote_produccion);
                $stmt_insert_detalle_agregacion_lote_produccion->bindParam(1, $idProdc, PDO::PARAM_INT);
                $stmt_insert_detalle_agregacion_lote_produccion->bindParam(2, $idProdt, PDO::PARAM_INT);
                $stmt_insert_detalle_agregacion_lote_produccion->bindParam(3, $idAlm, PDO::PARAM_INT);
                $stmt_insert_detalle_agregacion_lote_produccion->bindParam(4, $idProdAgrMot, PDO::PARAM_INT);
                $stmt_insert_detalle_agregacion_lote_produccion->execute();
            } catch (PDOException $e) {
                $message_error = "ERROR EN LA INSERCION DE UNA DEVOLUCION";
                $description_error = $e->getMessage();
            }
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
