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
    $idProd = $data["id"];
    $fecFinMolProd = $data["fecFinMolProd"];
    $fecFinEnvProd = $data["fecFinEnvProd"];
    $fecFinEncProd = $data["fecFinEncProd"];
    $fecProdFin = $data["fecProdFin"];

    if ($pdo) {

        // actualizamos el maestro de formula
        $sql =
            "UPDATE produccion
            SET fecFinMolProd = ?, fecFinEnvProd = ?, fecFinEncProd = ?, fecProdFin = ?
            WHERE id = ?";

        try {
            // PREPARAMOS LA CONSULTA
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(1, $fecFinMolProd);
            $stmt->bindParam(2, $fecFinEnvProd);
            $stmt->bindParam(3, $fecFinEncProd);
            $stmt->bindParam(4, $fecProdFin);
            $stmt->bindParam(5, $idProd, PDO::PARAM_INT);
            $stmt->execute();

            if (isset($fecProdFin)) {
                $fechaFinProgramado = "";

                $sql_consult =
                    "SELECT DATE(pd.fecProdFinProg) FROM produccion pd 
                WHERE pd.id = ?";

                $stmt_consult = $pdo->prepare($sql_consult);
                $stmt_consult->bindParam(1, $idProd, PDO::PARAM_INT);
                $stmt_consult->execute();

                while ($row = $stmt_consult->fetch(PDO::FETCH_ASSOC)) {
                    $fechaFinProgramado = $row["fecProgFinProd"];
                }

                $fechaFinProgramado = strtotime(explode(" ", $fechaFinProgramado)[0]);
                $fechaFin = strtotime(explode(" ", $fecProdFin)[0]);
                $idProdFinProgEst = 0; // valor nulo
                /* 
                    1. A tiempo
                    2. Atrasado
                    3. Adelantado
                */
                if ($fechaFinProgramado > $fechaFin) {
                    $idProdFinProgEst = 2; // fin atrasado
                } else {
                    if ($fechaFinProgramado == $fechaFin) {
                        $idProdFinProgEst = 1; // fin a tiempo
                    } else {
                        $idProdFinProgEst = 3; // fin adelantado
                    }
                }

                // ACTUALIZAR EL ESTADO DE FIN PROGRAMADO DE LA PRODUCCION
                $sql_update =
                    "UPDATE produccion
                SET idProdFinProgEst = ?
                WHERE id = ?";
                $stmt_update = $pdo->prepare($sql_update);
                $stmt_update->bindParam(1, $idProdFinProgEst, PDO::PARAM_INT);
                $stmt_update->bindParam(2, $idProd, PDO::PARAM_INT);
                $stmt_update->execute();
            }
        } catch (PDOException $e) {
            $message_error = "ERROR INTERNO SERVER: fallo en la actualizacion de la produccion lote";
            $description_error = $e->getMessage();
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
