<?php
    require("databaseCredentials.php");    
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
    
    
    //cerco se il prodotto è già presente nel supermercato
    $sql = "select * from prodotti_supermercati where codice_a_barre = ? and codice_supermercato = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("ss", $barcode, $supermarket);
    $barcode = $_POST["barcode"];
    $supermarket = $_POST["supermarket"];
    $stmt->execute();
    if($stmt->num_rows()==0){
        $sql = "insert into prodotti_supermercati(codice_a_barre, codice_supermercato, prezzo) ";
        $sql.="values(?,?,?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("ssd", $barcode, $supermarket, $prezzo);
        $barcode = $_POST["barcode"];
        $supermarket = $_POST["supermarket"];
        $prezzo = $_POST["prezzo"];
        if($stmt->execute())
            echo "{err:-1,message:'Prodotto inserito correttamente nel supermercato!'}";
        else
            echo "{err:1,message:Errore nell'inserimento}";
        $stmt->close();
        $con->close();
    }
    else
        echo "{err:2,message:'Prodotto già presente nel supermercato'}";
    
?>