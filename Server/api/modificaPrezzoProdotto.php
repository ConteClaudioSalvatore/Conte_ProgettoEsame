<?php
    require("databaseCredentials.php");  
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
    $sql = "update prodotti_supermercati set ";
    $sql .= "prezzo = ? ";
    $sql .= "where codice_supermercato = ? and codice_a_barre = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("dss", $prezzo, $supermercato, $barcode);
    $barcode = $_POST["barcode"];
    $supermercato = $_POST["supermercato"];
    $prezzo = $_POST["prezzo"];
    if($stmt->execute()){
        $json->err = -1;
        $json->message = "Prezzo modificato correttamente";
        echo json_encode($json);
    }
    else
        echo "Errore nella modifica del prezzo";
?>
