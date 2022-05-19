<?php
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli("localhost", "root", "", "dbdoveconviene");
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
	$postdata = file_get_contents("php://input");
    $params = json_decode($postdata);
	$barcode = $params->barcode;
    $supermercato = $params->supermercato;
    $prezzo = $params->prezzo;
    $sql = "update prodotti_supermercati set ";
    $sql .= "prezzo = :prezzo ";
    $sql .= "where codice_supermercato = :supermercato and codice_a_barre = :barcode";
    $stmt = $con->prepare($sql);
    $stmt->bind_param(":barcode", $barcode);
    $stmt->bind_param(":supermercato", $supermercato);
    $stmt->bind_param(":prezzo", $prezzo);
    if($stmt->execute())
        echo "Prezzo modificato correttamente";
    else
        echo "Errore nella modifica del prezzo";
?>
