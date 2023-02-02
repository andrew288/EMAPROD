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
    $idFor = $data["id"];

    if ($pdo) {
        $sql =
            "SELECT
            f.id,
            f.idProd,
            p.nomProd,
            f.nomFor,
            f.desFor,
            f.lotKgrFor,
            fd.idMatPri,
            fd.refCodMatPri,
            m.nomMatPri,
            me.simMed,
            fd.canMatPriFor
            FROM formula_detalle as fd
            JOIN formula as f on f.id = fd.idFor
            JOIN producto as p on p.id = f.idProd
            JOIN materia_prima as m on m.id = fd.idMatPri
            JOIN medida as me on me.id = m.idMed
            WHERE fd.idFor = ?
            ";
        // PREPARAMOS LA CONSULTA
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(1, $idFor, PDO::PARAM_INT);
        try {
            $stmt->execute();
        } catch (Exception $e) {
            $message_error = "ERROR INTERNO SERVER";
            $description_error = $e->getMessage();
        }

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($result, $row);
        }

        // DESCOMENTAR PARA VER LA DATA DE LA CONSULTA Y REALIZAR CAMBIOS
        // print_r($result)

        // FORMATEAMOS EL RESULTADO
        $result_formater = [];
        $result_formater["id"] = $result[0]["id"];
        $result_formater["idProd"] = $result[0]["idProd"];
        $result_formater["nomProd"] = $result[0]["nomProd"];
        $result_formater["nomFor"] = $result[0]["nomFor"];
        $result_formater["desFor"] = $result[0]["desFor"];
        $result_formater["lotKgrFor"] = $result[0]["lotKgrFor"];
        $result_formater["forDet"] = [];

        foreach ($result as $item) {
            array_push(
                $result_formater["forDet"],
                array(
                    'idMatPri' => $item['idMatPri'],
                    'refCodMatPri' => $item['refCodMatPri'],
                    'nomMatPri' => $item['nomMatPri'],
                    'simMed' => $item['simMed'],
                    'canMatPriFor' => $item['canMatPriFor']
                )
            );
        }
        $result = $result_formater;
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
