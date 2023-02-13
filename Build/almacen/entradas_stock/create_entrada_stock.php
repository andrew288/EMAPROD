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

    //DATOS RECIBIDOS
    $idMatPri = $data["idMatPri"];
    $idPro = $data["idPro"];
    $idEntStoEst = 0;
    $codEntSto = $data["codEntSto"];
    $letAniEntSto = $data["letAniEntSto"];
    $diaJulEntSto = $data["diaJulEntSto"];
    $refNumIngEntSto = $data["refNumIngEntSto"];
    $esSel = $data["esSel"];
    // SOLO SI ES SELECCION
    $canSel = 0;
    $canPorSel = 0;
    $merTot = 0;
    $canTotEnt = $data["canTotEnt"];
    $canTotDis = 0; // CONDICION
    $docEntSto = $data["docEntSto"];
    $fecEntSto = $data["fecEntSto"];

    if ($pdo) {
        // VERIFICAMOS QUE LA ENTRADA SEA DE SELECCION O NO
        if ($esSel) {
            // LA CANTIDAD POR SELECCIONAR ES IGUAL A LA CANTIDAD ENTRANTE
            $canPorSel = $canTotEnt;
            $idEntStoEst = 2;
        } else {
            // LA CANTIDAD DISPONIBLE ES IGUAL A LA CANTIDAD ENTRANTE
            $canTotDis = $canTotEnt;
            $idEntStoEst = 1;
        }

        // INSERTAMOS LA ENTRADA
        $sql =
            "INSERT INTO
        entrada_stock
        (idMatPri, 
        idPro, 
        idEntStoEst, 
        codEntSto, 
        letAniEntSto, 
        diaJulEntSto, 
        refNumIngEntSto,
        esSel,
        canSel,
        canPorSel,
        merTot,
        canTotEnt,
        canTotDis,
        docEntSto,
        fecEntSto)
        VALUES (?,?,?,?,?,?,?,?,$canSel, $canPorSel, $merTot, $canTotEnt, $canTotDis,?,?)
        ";
        //Preparamos la consulta
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(1, $idMatPri, PDO::PARAM_INT);
        $stmt->bindParam(2, $idPro, PDO::PARAM_INT);
        $stmt->bindParam(3, $idEntStoEst, PDO::PARAM_INT);
        $stmt->bindParam(4, $codEntSto, PDO::PARAM_STR);
        $stmt->bindParam(5, $letAniEntSto, PDO::PARAM_STR);
        $stmt->bindParam(6, $diaJulEntSto, PDO::PARAM_STR);
        $stmt->bindParam(7, $refNumIngEntSto, PDO::PARAM_INT);
        $stmt->bindParam(8, $esSel, PDO::PARAM_BOOL);
        $stmt->bindParam(9, $docEntSto, PDO::PARAM_STR);
        $stmt->bindParam(10, $fecEntSto, PDO::PARAM_STR);
        // Comprobamos la respuesta
        try {
            // Iniciamos una transaccion
            $pdo->beginTransaction();
            $stmt->execute();

            // ACTUALIZAMOS EL STOCK TOTAL DE LA MATERIA PRIMA
            // SI NO ES UNA ENTRADA DE SELECCION, ENTONCES ACTUALIZAMOS DIRECTAMENTE EL STOCK
            if (!$esSel) {
                $sql_update_materia_prima =
                    "UPDATE materia_prima
                    SET stoMatPri = stoMatPri + $canTotEnt
                    WHERE id = ?";

                $stmt_update_materia_prima = $pdo->prepare($sql_update_materia_prima);
                $stmt_update_materia_prima->bindParam(1, $idMatPri, PDO::PARAM_INT);
                $stmt_update_materia_prima->execute();
            }

            // TERMINAMOS LA TRANSACCION
            $pdo->commit();
        } catch (PDOException $e) {
            $pdo->rollback();
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
