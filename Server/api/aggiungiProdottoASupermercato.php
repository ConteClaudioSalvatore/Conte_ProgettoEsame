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
            $barcode = trim($_POST["barcode"]);
            $supermarket = $con->real_escape_string($_POST["supermarket"]);
            $prezzo = $_POST["prezzo"];
        }
        else{
            $barcode = trim($data->barcode);
            $supermarket = $con->real_escape_string($data->supermarket);
            $prezzo = $data->prezzo;
        }
        $sql = "select * from prodotti_supermercati where codice_a_barre = ? and codice_supermercato = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("ss", $barcode, $supermarket);
        $stmt->execute();
        if($stmt->num_rows()==0){
            $stmt->close();
            $sql = "insert into prodotti_supermercati(codice_a_barre, codice_supermercato, prezzo) 
                    values(
                        '$barcode',
                        '$supermarket',
                        ".floatval($prezzo).")";
            $rs = $con->query($sql);
            if($rs == true){
                $json->err = -1;
                $json->msg = "Prodotto aggiunto al supermercato";
                echo json_encode($json);
            }
            else
                echo json_encode("{err:1,message:\"Errore nell'inserimento".$rs->num_rows."\", sql:\"$sql\"}");
            $con->close();
        }
        else
        {
            $stmt->close();
            $sql = "update prodotti_supermercati 
                    set 
                    prezzo = ".floatval($prezzo)." 
                    where 
                        codice_a_barre = '$barcode'
                        and 
                        codice_supermercato = '$supermarket'";
            $rs = $con->query($sql);
            if($rs == true){
                $json->err = -1;
                $json->msg = "Prodotto modificato nel supermercato";
                echo json_encode($json);
            }
            else
                echo json_encode("{err:1,message:\"Errore nella modifica".$rs->num_rows."\", sql:\"$sql\"}");
        }
    }
    catch(Exception $e){
        echo json_encode("{err:1,message:'Errore nell'inserimento $e'}");
    }
    
?>