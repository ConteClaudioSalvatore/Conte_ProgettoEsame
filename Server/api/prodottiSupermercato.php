<?php
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli("localhost", "root", "", "dbdoveconviene");
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
	$postdata = file_get_contents("php://input");
	$param = json_decode($postdata);
    $nomeSupermercato = $param->supermarket;
    $sql = "select * from prodotti_supermercati where codice_supermercato = '$nomeProdotto'";
    /*Il metodo query lancia la query sql e restituisce il recordset corrispondente*/
    $rs = $con->query($sql);
    /*Controlla se il recordset esiste o no cioè se ci sono stati degli errori*/
    if (!$rs)
        die("Errore nella query " . $con->errno . " " . $con->error);
    /*Ciclo di scansione del recordset*/
    if ($rs->num_rows == 0){
        $err->code = 1;
        $err->message = "Nessun supermercato ha questo prodotto";
        echo json_encode($err);
    }
    else {
        $vect = [];
        while ($record = $rs->fetch_assoc())
            array_push($vect, $record);
        $json->id = $vect["id"];
        $json->barcodeProdotto = $vect["codice_a_barre"];
        $json->prezzo = $vect["prezzo"];
        echo json_encode($json);
    }
    $con->close();
?>