<?php
    require("databaseCredentials.php");    
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
    $postdata = file_get_contents("php://input");
    $data = json_decode($postdata);
    //cerco se il prodotto è già presente nel supermercato
    $barcode = trim($_POST["barcode"]);
    $supermarket = $con->real_escape_string($_POST["supermarket"]);
    $prezzo = $_POST["prezzo"];
    $sql = "select * from prodotti_supermercati where codice_a_barre = '$barcode' and codice_supermercato = (select id from supermercati where descrizione = '$supermarket' limit 1)";
    $rs = $con->query($sql);
    if (!$rs)
        die("Errore nella query " . $con->errno . " " . $con->error);
    $row_cnt = $rs->num_rows;
    if (intval($row_cnt) == 0){
        $sql = "insert into prodotti_supermercati(codice_a_barre, codice_supermercato, prezzo) 
                values(
                    '$barcode',
                    (select id from supermercati where descrizione = '$supermarket' limit 1),
                    ".floatval($prezzo).")";
        $rs = $con->query($sql);
        if($rs == true){
            $json->err = -1;
            $json->msg = "Prezzo aggiunto al supermercato";
            $json->barcode = $barcode;
            echo json_encode($json);
        }
        else
            echo json_encode("{err:1,message:\"Errore nell'inserimento".$rs->num_rows."\", sql:\"$sql\"}");
        $con->close();
    }
    else
    {
        $sql = "update prodotti_supermercati 
                set 
                prezzo = ".floatval($prezzo)." 
                where 
                    codice_a_barre = '$barcode'
                    and 
                    codice_supermercato = (select id from supermercati where descrizione = '$supermarket' limit 1)";
        $rs = $con->query($sql);
        if($rs == true){
            $json->err = -1;
            $json->msg = "Prezzo modificato nel supermercato";
            $json->barcode = $barcode;
            echo json_encode($json);
        }
        else
            echo json_encode("{err:1,message:\"Errore nella modifica".$rs->num_rows."\", sql:\"$sql\"}");
    }
    
?>