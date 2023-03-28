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
        $sql_consult_stock_almacen = "";
        $sql_insert_detalle_agregacion_lote_produccion = "";
        $sql_update_almacen_principal = "";
        $sql_update_almacen_destino = "";

        foreach ($detAgrLotProd as $value) {
            // OBTENEMOS LOS DATOS DE LOS DETALLES
            $idProdc = $value["idProdc"];
            $nomProd = $value["nomProd"];
            $idProdt = $value["idProdt"];
            $idProdAgrMot = $value["idProdAgrMot"];
            $canProdAgr = $value["canProdAgr"];
            $idAre = $value["idAre"];

            // primero consultamos la disponibilidad de stock
            $idAlmacenPrincipal = 1;
            $stockProductoAlmacenPrincipal = 0;
            $sql_consult_stock_almacen =
                "SELECT * FROM almacen_stock
                WHERE idAlm = ? AND idProd = ?";

            try {
                $stmt_consult_stock_almacen = $pdo->prepare($sql_consult_stock_almacen);
                $stmt_consult_stock_almacen->bindParam(1, $idAlmacenPrincipal, PDO::PARAM_INT);
                $stmt_consult_stock_almacen->bindParam(2, $idProdt, PDO::PARAM_INT);
                $stmt_consult_stock_almacen->execute();

                if ($stmt_consult_stock_almacen->rowCount() === 1) {
                    while ($row_consult_stock_almacen = $stmt_consult_stock_almacen->fetch(PDO::FETCH_ASSOC)) {
                        $stockProductoAlmacenPrincipal = $row_consult_stock_almacen["canStoDis"];
                    }
                    // si la cantidad solicitada es menor a lo encontrado en stock
                    if ($stockProductoAlmacenPrincipal > floatval($canProdAgr)) {
                        // obtenemos el almacen de destino
                        switch ($idAre) {
                            case 5:
                                $idAlm = 3; // almacen envases
                                break;
                            case 6:
                                $idAlm = 4; // almacen de encajes
                                break;
                        }

                        // insertamos el registro en produccion agregacion
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

                            // ahora actualizamos el almacen principal
                            $sql_update_almacen_principal =
                                "UPDATE almacen_stock SET canStoDis = canStoDis - $canProdAgr, canSto = canSto - $canProdAgr
                            WHERE idAlm = ? AND idProd = ?";

                            try {
                                $stmt_update_almacen_principal = $pdo->prepare($sql_update_almacen_principal);
                                $stmt_update_almacen_principal->bindParam(1, $idAlmacenPrincipal, PDO::PARAM_INT);
                                $stmt_update_almacen_principal->bindParam(2, $idProdt, PDO::PARAM_INT);
                                $stmt_update_almacen_principal->execute();

                                // luego realizamos la transferencia al almacen pertinente
                                //primero consultamos si existe el almacen pertinente
                                $sql_consult_almacen_destino =
                                    "SELECT * FROM almacen_stock
                                    WHERE idAlm = ? AND idProd = ?";

                                try {
                                    $stmt_consult_almacen_destino = $pdo->prepare($sql_consult_almacen_destino);
                                    $stmt_consult_almacen_destino->bindParam(1, $idAlm, PDO::PARAM_INT);
                                    $stmt_consult_almacen_destino->bindParam(2, $idProdt, PDO::PARAM_INT);
                                    $stmt_consult_almacen_destino->execute();

                                    if ($stmt_consult_almacen_destino->rowCount() === 1) {
                                        // ACTUALIZAMOS
                                        $sql_update_almacen_destino =
                                            "UPDATE almacen_stock 
                                            SET canSto = canSto + $canProdAgr, canStoDis = canStoDis + $canProdAgr
                                            WHERE idAlm = ? AND idProd = ?";

                                        try {
                                            $stmt_update_almacen_destino = $pdo->prepare($sql_update_almacen_destino);
                                            $stmt_update_almacen_destino->bindParam(1, $idAlm, PDO::PARAM_INT);
                                            $stmt_update_almacen_destino->bindParam(2, $idProdt, PDO::PARAM_INT);
                                            $stmt_update_almacen_destino->execute();
                                        } catch (PDOException $e) {
                                            $message_error = "ERROR EN LA ACTUALIZACION DEL STOCK DEL ALMACEN DESTINO";
                                            $description_error = $e->getMessage();
                                        }
                                    } else {
                                        // INSERTAMOS
                                        $sql_insert_almacen_destino =
                                            "INSERT INTO almacen_stock (idProd, idAlm, canSto, canStoDis)
                                        VALUES(?, ?, $canProdAgr, $canProdAgr)";

                                        try {
                                            $stmt_insert_almacen_destino = $pdo->prepare($sql_insert_almacen_destino);
                                            $stmt_insert_almacen_destino->bindParam(1, $idProdt, PDO::PARAM_INT);
                                            $stmt_insert_almacen_destino->bindParam(2, $idAlm, PDO::PARAM_INT);
                                            $stmt_insert_almacen_destino->execute();
                                        } catch (PDOException $e) {
                                            $message_error = "ERROR EN LA INSERCION DEL STOCK DEL ALMACEN DESTINO";
                                            $description_error = $e->getMessage();
                                        }
                                    }
                                } catch (PDOException $e) {
                                    $message_error = "ERROR EN LA CONSULTA DEL ALMACEN DESTINO";
                                    $description_error = $e->getMessage();
                                }
                            } catch (PDOException $e) {
                                $message_error = "ERROR EN LA ACTUALIZACION DEL STOCK";
                                $description_error = $e->getMessage();
                            }
                        } catch (PDOException $e) {
                            $message_error = "ERROR EN LA INSERCION DE UNA AGREGACION";
                            $description_error = $e->getMessage();
                        }
                    } else {
                        $message_error = "No se pudo agregar un detalle";
                        $description_error = $description_error . "No se pudo agregar el producto $nomProd, no hay suficiente stock" . "\n";
                    }
                } else {
                    $message_error = "NO SE ENCUENTRA EL PRODUCTO REGISTRADO";
                    $description_error = "En el almacen principal no se encuentra el producto registrado";
                }
            } catch (PDOException $e) {
                $message_error = "ERROR EN LA CONSULTA DEL STOCK DE ALMACEN";
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
