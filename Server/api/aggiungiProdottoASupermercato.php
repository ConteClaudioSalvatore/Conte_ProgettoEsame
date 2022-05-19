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
    $barcode = $param->barcode;
    $supermarket = $param->supermarket;
    $prezzo = $param->prezzo;
    //cerco se il prodotto è già presente nel supermercato
    $sql = "select * from prodotti_supermercati where barcode = :barcode and supermarket = :supermarket";
    $stmt = $con->prepare($sql);
    $stmt->bind_param(":barcode", $barcode);
    $stmt->bind_param(":supermarket", $supermarket);
    $stmt->execute();
    if($stmt->num_rows()==0){
        $sql = "insert into prodotti_supermercati(barcode, supermarket, prezzo) ";
        $sql.="values(:barcode,:supermarket,:prezzo)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param(":barcode", $barcode);
        $stmt->bind_param(":supermarket", $supermarket);
        $stmt->bind_param(":prezzo", $prezzo);
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