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

    $detDevLotProd = $data["detDevLotProd"];

    if ($pdo) {
        $idAlm = 0;
        $sql_insert_detalle_devolucion_lote_produccion = "";
        $sql_update_almacen_stock = "";
        $sql_consult_almacen_stock = "";
        $sql_insert_almacen_stock = "";

        foreach ($detDevLotProd as $value) {
            $idProdc = $value["idProdc"];
            $idProdt = $value["idProdt"];
            $idProdDevMot = $value["idProdDevMot"];
            $canProdDev = $value["canProdDev"];

            // obtenemos el almacen de destino
            switch ($idProdDevMot) {
                case 1: // sobrantes de requisicion
                    $idAlm = 1; // almacen principal
                    break;
                case 2: // desmedros de produccion
                    $idAlm = 7; // almacen de desmedros
                    break;
                default:
                    $idAlm = 1; // almacen principal
            }
            $sql_insert_detalle_devolucion_lote_produccion =
                "INSERT INTO produccion_devolucion
            (idProdc, idProdt, idAlm, idProdDevMot, canProdDev)
            VALUES (?, ?, ?, ?, $canProdDev)";

            try {
                $stmt_insert_detalle_devolucion_lote_produccion = $pdo->prepare($sql_insert_detalle_devolucion_lote_produccion);
                $stmt_insert_detalle_devolucion_lote_produccion->bindParam(1, $idProdc, PDO::PARAM_INT);
                $stmt_insert_detalle_devolucion_lote_produccion->bindParam(2, $idProdt, PDO::PARAM_INT);
                $stmt_insert_detalle_devolucion_lote_produccion->bindParam(3, $idAlm, PDO::PARAM_INT);
                $stmt_insert_detalle_devolucion_lote_produccion->bindParam(4, $idProdDevMot, PDO::PARAM_INT);
                $stmt_insert_detalle_devolucion_lote_produccion->execute();

                // ahora actualizamos segun el almacen correspondiente
                // primero consultamos si existe ese almacen stock
                $sql_consult_almacen_stock =
                    "SELECT * FROM almacen_stock
                WHERE idProd = ? AND idAlm = ?";
                try {
                    $stmt_consult_almacen_stock = $pdo->prepare($sql_consult_almacen_stock);
                    $stmt_consult_almacen_stock->bindParam(1, $idProdt, PDO::PARAM_INT);
                    $stmt_consult_almacen_stock->bindParam(2, $idAlm, PDO::PARAM_INT);
                    $stmt_consult_almacen_stock->execute();

                    if ($stmt_consult_almacen_stock->rowCount() === 1) {
                        // ACTUALIZAMOS
                        $sql_update_almacen_stock =
                            "UPDATE almacen_stock 
                            SET canSto = canSto + $canProdDev, canStoDis = canStoDis + $canProdDev
                            WHERE idProd = ? AND idAlm = ?";

                        try {
                            $stmt_update_almacen_stock = $pdo->prepare($sql_update_almacen_stock);
                            $stmt_update_almacen_stock->bindParam(1, $idProdt, PDO::PARAM_INT);
                            $stmt_update_almacen_stock->bindParam(2, $idAlm, PDO::PARAM_INT);
                            $stmt_update_almacen_stock->execute();
                        } catch (PDOException $e) {
                            $message_error = "ERROR EN LA ACTUALIZACION DEL ALMACEN STOCK";
                            $description_error = $e->getMessage();
                        }
                    } else {
                        // CREAMOS
                        $sql_insert_almacen_stock =
                            "INSERT INTO almacen_stock
                            (idProd, idAlm, canSto, canStoDis)
                            VALUES(?, ?, $canProdDev, $canProdDev)";

                        try {
                            $stmt_insert_almacen_stock = $pdo->prepare($sql_insert_almacen_stock);
                            $stmt_insert_almacen_stock->bindParam(1, $idProdt, PDO::PARAM_INT);
                            $stmt_insert_almacen_stock->bindParam(2, $idAlm, PDO::PARAM_INT);
                            $stmt_insert_almacen_stock->execute();
                        } catch (PDOException $e) {
                            $message_error = "ERROR EN LA INSERCION DEL ALMACEN STOCK";
                            $description_error = $e->getMessage();
                        }
                    }
                } catch (PDOException $e) {
                    $message_error = "ERROR EN LA CONSULTA DEL ALMACEN STOCK";
                    $description_error = $e->getMessage();
                }
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
