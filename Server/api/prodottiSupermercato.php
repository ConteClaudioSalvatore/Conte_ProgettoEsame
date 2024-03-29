<?php
    require("databaseCredentials.php");  
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
    $barcode = trim($_POST['barcode']);
    $sql = "select ps.prezzo as prezzo, s.descrizione as codice_supermercato
            from prodotti_supermercati as ps left join supermercati as s on ps.codice_supermercato = s.id
            where ps.codice_a_barre = '$barcode' 
            order by ps.prezzo";
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
        $json->data = $vect;
        echo json_encode($json);
    }
    $con->close();
?>