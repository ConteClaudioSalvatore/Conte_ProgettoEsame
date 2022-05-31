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
    try{
        if($_POST["barcode"] != null && $_POST["supermarket"] != null && $_POST["prezzo"] != null){
            $barcode = $_POST["barcode"];
            $supermarket = $_POST["supermarket"];
            $prezzo = $_POST["prezzo"];
        }
        else{
            $barcode = trim($data->barcode);
            $supermarket = $data->supermarket;
            $prezzo = $data->prezzo;
        }
        $sql = "select * from prodotti_supermercati where codice_a_barre = ? and codice_supermercato = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("ss", $barcode, $supermarket);
        $stmt->execute();
        if($stmt->num_rows()==0){
            $stmt->close();
            $sql = "insert into prodotti_supermercati(codice_a_barre, codice_supermercato, prezzo) values('$barcode','$supermarket',".floatval($prezzo).")";
            $rs = $con->query($sql);
            if($rs == true)
                echo "{err:-1,message:\"Prodotto inserito correttamente nel supermercato!\"}";
            else
                echo "{err:1,message:\"Errore nell'inserimento".$rs->num_rows."\", sql:\"$sql\"}";
            $con->close();
        }
        else
            echo "{err:2,message:'Prodotto già presente nel supermercato'}";
    }
    catch(Exception $e){
        echo "{err:1,message:'Errore nell'inserimento'}";
    }
    
?>