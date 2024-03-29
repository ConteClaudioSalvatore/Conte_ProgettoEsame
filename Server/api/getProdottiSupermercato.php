<?php
    require("databaseCredentials.php");  
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
    $supermercato = $con->real_escape_string($_POST["supermarket"]);
    $sql = "select * from prodotti_supermercati where codice_supermercato = (select id from supermercati where descrizione = '$supermercato' limit 1)";
    /*Il metodo query lancia la query sql e restituisce il recordset corrispondente*/
    $rs = $con->query($sql);
    /*Controlla se il recordset esiste o no cioè se ci sono stati degli errori*/
    if (!$rs)
        die("Errore nella query " . $con->errno . " " . $con->error);
    /*Ciclo di scansione del recordset*/
    if ($rs->num_rows == 0){
        $err->code = 1;
        $err->message = "Nessun prodotto trovato";
        die(json_encode($err));
    }
    else {
        $vect = [];
        while ($record = $rs->fetch_assoc())
            array_push($vect, $record);
        $json->product = json_encode($vect);
        echo json_encode($json);
    }
    $con->close();
?>