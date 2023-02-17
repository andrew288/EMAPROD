<?php
include_once "../../common/cors.php";
include_once "../../common/conexion_integracion.php";

$pdo = getPDO();
$result = [];
$message_error = "";
$description_error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($pdo) {
        $sql =
            "SELECT 
            c.Cd_Com,
            c.FecMov,
            c.Cd_Prv,
            c.Proveedor,
            c.Cd_TD,
            c.NroSre,
            c.NroDoc,
            CONVERT(decimal(20,2), c.ValorTotal) AS ValorTotal,
            CONVERT(decimal(20,2), c.Igv) AS Igv,
            CONVERT(decimal(20,2), c.Total) AS Total,
            c.UsuCrea
            FROM Compra2 c";

        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $Cd_Com = $row["Cd_Com"];
                $row["com2Det"] = [];

                $sql_detalle =
                    "SELECT
                cd.Cd_Com,
                cd.Item,
                cd.Cd_Prod,
                cd.Descrip,
                CONVERT(decimal(20,2), cd.BimUni) AS BimUni,
                CONVERT(decimal(20,2), cd.IgvUni) AS IgvUni,
                CONVERT(decimal(20,2), cd.PrecioUni) AS PrecioUni,
                CONVERT(decimal(20,2), cd.Cant) AS Cant,
                CONVERT(decimal(20,2), cd.ValorTotal) AS ValorTotal,
                CONVERT(decimal(20,2), cd.Bim) AS Bim,
                CONVERT(decimal(20,2), cd.Igv) AS Igv,
                CONVERT(decimal(20,2), cd.Total) AS Total,
                cd.FecEnt
                FROM CompraDet2 cd
                WHERE cd.Cd_Com = ?
                ";
                $stmt_detalle = $pdo->prepare($sql_detalle);
                $stmt_detalle->bindParam(1, $Cd_Com, PDO::PARAM_STR);
                $stmt_detalle->execute();
                while ($row_detalle = $stmt_detalle->fetch(PDO::FETCH_ASSOC)) {
                    array_push($row["com2Det"], $row_detalle);
                }
                array_push($result, $row);
            }
        } catch (PDOException $e) {
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
