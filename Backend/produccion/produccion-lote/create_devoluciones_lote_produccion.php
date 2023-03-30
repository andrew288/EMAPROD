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

        /*
        EN LAS DEVOLUCIONES TENEMOS 2 OPCIONES
        1.- DEVOLUCION DE DESMEDRO (NO GENERA ENTRADAS INTERINAS)
        2.- DEVOLUCION DE SOBRANTE (GENERA ENTRADA INTERINA)
        */
        $idAlm = 0; // Almacen destino

        foreach ($detDevLotProd as $value) {
            $idProdc = $value["idProdc"]; // lote produccion
            $idProdt = $value["idProdt"]; // producto
            $idProdDevMot = $value["idProdDevMot"]; // motivo de devolucion
            $canProdDev = $value["canProdDev"]; // cantidad devuelta
            $nomProd = $value["nomProd"];

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


            // creamos el detalle de produccion devolucion
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

                // MANEJAMOS LAS 2 CASUISTICAS
                // si es desmedro
                if ($idProdDevMot != 2) {

                    $salidasEmpleadas = [];
                    $totalRequisicionProducto = 0;

                    /*
                        Primero debemos identificar que entradas fueron utilizadas para
                        cumplir con la requisicion del producto a devolver:

                        1. Primero recorro las requisicion con idProdc
                        2. Recorro las salidas de stock del idReq donde idProdt = ?
                        3. Obtengo las salidas utilizadas para cumplir con idProdt = ?
                        4. Realizamos el prorrateo con la cantidad devuelta y lo utilzado
                        en cada salida
                        5. Creamos cada registro para la trazabilidad
                        6. Fin del algoritmo
                    */

                    $sql_salidas_empleadas_requisicion_detalle =
                        "SELECT * 
                    FROM salida_stock st
                    JOIN requisicion AS r ON r.id = st.idReq
                    WHERE r.idProdt = ? AND r.idProdc = ?";

                    try {
                        $stmt_salidas_empleadas_requisicion_detalle = $pdo->prepare($sql_salidas_empleadas_requisicion_detalle);
                        $stmt_salidas_empleadas_requisicion_detalle->bindParam(1, $idProdt, PDO::PARAM_INT);
                        $stmt_salidas_empleadas_requisicion_detalle->bindParam(2, $idProdc, PDO::PARAM_INT);
                        $stmt_salidas_empleadas_requisicion_detalle->execute();

                        if ($stmt_salidas_empleadas_requisicion_detalle->rowCount() != 0) {
                            while ($row_salidas_empleadas = $stmt_salidas_empleadas_requisicion_detalle->fetch(PDO::FETCH_ASSOC)) {
                                array_push($salidasEmpleadas, $row_salidas_empleadas);
                                $totalRequisicionProducto += $row_salidas_empleadas["canSalStoReq"];
                            }

                            foreach ($salidasEmpleadas as $value) {
                                $idEntSto = $value["idEntSto"]; // entrada
                                $idReq = $value["idReq"]; // requisicion
                                $canSalStoReq = $value["canSalStoReq"]; // cantidad

                                // REALIZAMOS EL PRORRATEO


                                // ACTUALIZAMOS LA ENTRADA
                                $idEntStoEst = 1; // disponible

                                $sql_update_entrada_stock =
                                    "UPDATE entrada_stock
                                SET canTotDis = canTotDis + 
                                WHERE id = ?";

                                // GENERAMOS EL REGISTRO
                            }
                        } else {
                            $message_error = "No se genero las salidas del producto";
                            $description_error = "No se generaron las salidas del producto: $nomProd";
                        }
                    } catch (PDOException $e) {
                    }
                }

                if (empty($message_error)) {
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
