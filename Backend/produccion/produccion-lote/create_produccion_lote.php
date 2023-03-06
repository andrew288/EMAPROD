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

    $idProdt = $data["idProdt"];
    $idProdTip = $data["idProdTip"]; // id
    $codTipProd = $data["codTipProd"]; // codigo
    $esEnv = $data["esEnv"];
    $codLotProd = $data["codLotProd"];
    $canLotProd = $data["canLotProd"];
    $klgLotProd = $data["klgLotProd"];
    $fecProdIniProg = $data["fecProdIniProg"];
    $fecProdFinProg = $data["fecProdFinProg"];
    $obsProd = $data["obsProd"];

    if ($pdo) {
        /* CONDICION:
            1.- EL CODIGO DE LOTE NO DEBE SER REPETIDO DURANTE TODO EL AÑO DE PRODUCCION
            2.- OTHER RULES ...
        */
        $year = date("Y"); // obtenemos el año actual
        $sql = "SELECT * FROM produccion WHERE codLotProd = ? AND fecProdIni REGEXP '^$year-*'";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(1, $codLotProd, PDO::PARAM_STR);
        $stmt->execute();
        $countRows = $stmt->rowCount();

        if ($countRows > 0) {
            $message_error = "REGISTRO EXISTENTE";
            $description_error = "Ya existe una produccion lote con ese codigo";
        } else {
            // CALCULAMOS EL ESTADO DE LA PRODUCCION
            $idProdEst = 1; // iniciado

            // CALCULAMOS EL ESTADO DE LA PRODUCCION SEGUN SU PROGRAMACION DE INICIO
            $idProdIniProgEst = 0; // valor nulo
            $fechaIniciadoProgramacion = strtotime(explode(" ", $fecProdIniProg)[0]);
            $fechaIniciadoActual = strtotime(date("Y-m-d"));

            /* 
                1. A tiempo
                2. Atrasado
                3. Adelantado
            */
            if ($fechaIniciadoProgramacion > $fechaIniciadoActual) {
                $idProdIniProgEst = 2; // inicio atrasado
            } else {
                if ($fechaIniciadoProgramacion == $fechaIniciadoActual) {
                    $idProdIniProgEst = 1; // inicio a tiempo
                } else {
                    $idProdIniProgEst = 3; // inicio adelantado
                }
            }

            // CALCULAMOS EL ESTADO DE LA PRODUCCION SEGUN SU PROGRAMACION DE FIN
            $idProdFinProgEst = 0;
            /* 
                1. A tiempo
                2. Atrasado
                3. Adelantado
            */
            if ($idProdIniProgEst == 2) {
                $idProdFinProgEst = 2; // fin atrasado
            } else {
                if ($idProdIniProgEst == 3) {
                    $idProdFinProgEst = 3; // fin adelantado
                } else {
                    $idProdFinProgEst = 1; // fin a tiempo
                }
            }

            // PARA COMPLETAR EL CODIGO NUMÉRICO PRIMERO DEBEMOS CONSULTAR LA ULTIMA INSERCION
            $sql_consult_produccion =
                "SELECT SUBSTR(codProd,5,8) AS numberCodProd FROM produccion ORDER BY id DESC LIMIT 1";

            $stmt_consult_produccion = $pdo->prepare($sql_consult_produccion);
            $stmt_consult_produccion->execute();

            $numberProduccion = 0;
            $codProd = ""; // CODIGO DE PRODUCCION

            if ($stmt_consult_produccion->rowCount() !== 1) {
                // nueva insercion
                $codProd = "PL" . $codTipProd . "00000001";
            } else {
                while ($row = $stmt_consult_produccion->fetch(PDO::FETCH_ASSOC)) {
                    $numberProduccion = intval($row["numberCodProd"]) + 1; // el siguiente numeral
                }
                $codProd = "PL" . $codTipProd . str_pad(strval($numberProduccion), 8, "0", STR_PAD_LEFT);
            }

            $sql_insert_produccion =
                "INSERT INTO
                produccion
                (idProdt, 
                idProdEst, 
                idProdTip, 
                idProdFinProgEst, 
                idProdIniProgEst,
                esEnv,
                codProd, 
                codLotProd, 
                klgLotProd, 
                canLotProd,
                obsProd,
                fecProdIniProg,
                fecProdFinProg)
                VALUES (?,?,?,?,?,?,?,?,$klgLotProd,$canLotProd,?,?,?);
                ";
            try {
                // PREPARAMOS LA CONSULTA
                $stmt_insert_produccion = $pdo->prepare($sql_insert_produccion);
                $stmt_insert_produccion->bindParam(1, $idProdt, PDO::PARAM_INT);
                $stmt_insert_produccion->bindParam(2, $idProdEst, PDO::PARAM_INT);
                $stmt_insert_produccion->bindParam(3, $idProdTip, PDO::PARAM_INT);
                $stmt_insert_produccion->bindParam(4, $idProdFinProgEst, PDO::PARAM_INT);
                $stmt_insert_produccion->bindParam(5, $idProdIniProgEst, PDO::PARAM_INT);
                $stmt_insert_produccion->bindParam(6, $esEnv, PDO::PARAM_BOOL);
                $stmt_insert_produccion->bindParam(7, $codProd, PDO::PARAM_STR);
                $stmt_insert_produccion->bindParam(8, $codLotProd, PDO::PARAM_STR);
                $stmt_insert_produccion->bindParam(9, $obsProd, PDO::PARAM_STR);
                $stmt_insert_produccion->bindParam(10, $fecProdIniProg, PDO::PARAM_STR);
                $stmt_insert_produccion->bindParam(11, $fecProdFinProg, PDO::PARAM_STR);
                $stmt_insert_produccion->execute();
            } catch (PDOException $e) {
                $message_error = "ERROR INTERNO SERVER: fallo en insercion de maestro requisicion molienda";
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
