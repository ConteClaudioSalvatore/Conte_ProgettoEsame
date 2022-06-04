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
    $sql = "select * from supermercati where descrizione = '$supermercato'";
    /*Il metodo query lancia la query sql e restituisce il recordset corrispondente*/
    $rs = $con->query($sql);
    /*Controlla se il recordset esiste o no cioè se ci sono stati degli errori*/
    if (!$rs)
        die("Errore nella query " . $con->errno . " " . $con->error);
    /*Ciclo di scansione del recordset*/
    if ($rs->num_rows == 0){
        $sql = "insert into supermercati(descrizione) values ('$supermercato')";
        if($con->query($sql)){
            $json->code = -1;
            $json->message = "Nuovo Supermercato Aggiunto: $supermercato";
            echo(json_encode($json));
        }
        else
            die("Errore query " . $con->connect_errno . " " . $con->connect_error);
    }
    else {
        $err->code = 1;
        $err->message = "Supermercato già presente";
        die(json_encode($err));
    }
    $con->close();
?>