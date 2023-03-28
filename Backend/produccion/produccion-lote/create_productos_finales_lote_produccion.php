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

    $detProdFinLotProd = $data["detProdFinLotProd"];
    $fecha = date('Y-m-d H:i:s');

    if ($pdo) {

        foreach ($detProdFinLotProd as $row) {
            $idProdc = $row["idProdc"]; // lote produccion
            $idProdt = $row["idProdt"]; // producto
            $canProdFin = $row["canProdFin"]; // cantidad total
            $fecVenEntProdFin = $row["fecVenEntProdFin"]; // fecha de vencimiento

            $sql_consult_producto_final =
                "SELECT * FROM produccion_producto_final
            WHERE idProdc = ? AND idProdt = ?";

            try {
                $stmt_consult_producto_final = $pdo->prepare($sql_consult_producto_final);
                $stmt_consult_producto_final->bindParam(1, $idProdc, PDO::PARAM_INT);
                $stmt_consult_producto_final->bindParam(2, $idProdt, PDO::PARAM_INT);
                $stmt_consult_producto_final->execute();

                // si es un producto que ha sido programado
                if ($stmt_consult_producto_final->rowCount() === 1) {
                    $sql_update_producto_final =
                        "UPDATE produccion_producto_final
                    SET canTotIngProdFin = canTotIngProdFin + $canProdFin, fecActProdcProdtFin = ?
                    WHERE idProdc = ? AND idProdt = ?";

                    try {
                        $stmt_update_producto_final = $pdo->prepare($sql_update_producto_final);
                        $stmt_update_producto_final->bindParam(1, $fecha); // fecha de actualizacion
                        $stmt_update_producto_final->bindParam(2, $idProdc, PDO::PARAM_INT);
                        $stmt_update_producto_final->bindParam(3, $idProdt, PDO::PARAM_INT);
                        $stmt_update_producto_final->execute();
                    } catch (PDOException $e) {
                        $message_error = "Error en la actualizacion de producto final";
                        $description_error = $e->getMessage();
                    }
                    // si es un producto que no fue programado
                } else {
                    $idProdcProdtFinEst = 1; // creado
                    $cantidadProgramada = 0; // cantidad programada
                    $sql_insert_producto_final =
                        "INSERT INTO produccion_producto_final
                    (idProdc, idProdcProdtFinEst, idProdt, canTotProgProdFin, canTotIngProdFin)
                    VALUES(?, ?, ?, $cantidadProgramada, $canProdFin)";

                    try {
                        $stmt_insert_producto_final = $pdo->prepare($sql_insert_producto_final);
                        $stmt_insert_producto_final->bindParam(1, $idProdc, PDO::PARAM_INT);
                        $stmt_insert_producto_final->bindParam(2, $idProdcProdtFinEst, PDO::PARAM_INT);
                        $stmt_insert_producto_final->bindParam(3, $idProdt, PDO::PARAM_INT);
                        $stmt_insert_producto_final->execute();
                    } catch (PDOException $e) {
                        $message_error = "Error en la insercion de producto final";
                        $description_error = $e->getMessage();
                    }
                }

                // ahora creamos la entrada de producto final
                $sql_insert_entrada_producto_final =
                    "INSERT INTO entrada_producto_final
                (idProdc, idProdt, canTotEntProFin, canTotDisEntProdFin, fecVenEntProdFin)
                VALUES(?, ?, $canProdFin, $canProdFin, ?)";

                try {
                    $stmt_insert_entrada_producto_final = $pdo->prepare($sql_insert_entrada_producto_final);
                    $stmt_insert_entrada_producto_final->bindParam(1, $idProdc, PDO::PARAM_INT);
                    $stmt_insert_entrada_producto_final->bindParam(2, $idProdt, PDO::PARAM_INT);
                    $stmt_insert_entrada_producto_final->bindParam(3, $fecVenEntProdFin);
                    $stmt_insert_entrada_producto_final->execute();

                    // finalmente actualizamos stock de almacen principal
                    // primero consultamos si existe el producto registrado
                    $idAlmacenPrincipal = 1; // alamacen principal
                    $sql_consult_stock_almacen_principal =
                        "SELECT * FROM almacen_stock
                    WHERE idAlm = ? AND idProd = ?";

                    try {
                        $stmt_consult_stock_almacen_principal = $pdo->prepare($sql_consult_stock_almacen_principal);
                        $stmt_consult_stock_almacen_principal->bindParam(1, $idAlmacenPrincipal, PDO::PARAM_INT);
                        $stmt_consult_stock_almacen_principal->bindParam(2, $idProdt, PDO::PARAM_INT);
                        $stmt_consult_stock_almacen_principal->execute();

                        // Si esta registrado el producto en el almacen principal (UPDATE)
                        if ($stmt_consult_stock_almacen_principal->rowCount() == 1) {
                            $sql_update_stock_almacen_principal =
                                "UPDATE almacen_stock SET
                            canSto = canSto + $canProdFin, canStoDis = canStoDis + $canProdFin
                            WHERE idAlm = ? AND idProd = ?";

                            try {
                                $stmt_update_stock_almacen_principal = $pdo->prepare($sql_update_stock_almacen_principal);
                                $stmt_update_stock_almacen_principal->bindParam(1, $idAlmacenPrincipal, PDO::PARAM_INT);
                                $stmt_update_stock_almacen_principal->bindParam(2, $idProdt, PDO::PARAM_INT);
                                $stmt_update_stock_almacen_principal->execute();
                            } catch (PDOException $e) {
                                $message_error = "Error en la actualizacion de almacen principal";
                                $description_error = $e->getMessage();
                            }
                            // Si no esta registrado el producto en el almacen principal (CREATE)
                        } else {
                            $sql_create_stock_almacen_principal =
                                "INSERT INTO almacen_stock
                            (idProd, idAlm, canSto, canStoDis)
                            VALUES(?, ?, $canProdFin, $canProdFin)";

                            try {
                                $stmt_create_stock_almacen_principal = $pdo->prepare($sql_create_stock_almacen_principal);
                                $stmt_create_stock_almacen_principal->bindParam(1, $idProdt, PDO::PARAM_INT);
                                $stmt_create_stock_almacen_principal->bindParam(2, $idAlmacenPrincipal, PDO::PARAM_INT);
                                $stmt_create_stock_almacen_principal->execute();
                            } catch (PDOException $e) {
                                $message_error = "Error en la insercion de almacen principal";
                                $description_error = $e->getMessage();
                            }
                        }
                    } catch (PDOException $e) {
                        $message_error = "Error en la consulta de almacen principal";
                        $description_error = $e->getMessage();
                    }
                } catch (PDOException $e) {
                    $message_error = "Error en la insercion de una entrada de producto final";
                    $description_error = $e->getMessage();
                }
            } catch (PDOException $e) {
                $message_error = "Error en la consulta de producto final";
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
