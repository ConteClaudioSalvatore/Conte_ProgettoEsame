<?php
    require("databaseCredentials.php");  
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
    $barcode = $_POST['barcode'];
    $keywords = $_POST['keywords'];
    $categories = $_POST['categories'];
    $creator = $_POST['last_editor'];
    $created_t = floor(microtime(true) * 1000);
    $generic_name = $_POST['generic_name'];
    $image_front_url = $_POST['image_front_url'];
    $ingredients_text = $_POST['ingredients_text'];
    $nutriments = $_POST['nutriments'];
    $supermarket = $_POST['supermarket'];
    $sql = "update prodotti set ";
    if($_POST['keywords'] != null)
        $sql .= "keywords = '".$con->real_escape_string($keywords)."', ";
    if($_POST['categories'] != null)
        $sql .= "categories = '".$con->real_escape_string($categories)."', ";
    $sql.="last_editor = '".$con->real_escape_string($creator)."', last_edited_t = $created_t, generic_name = '".$con->real_escape_string($generic_name)."', ";
    if($_POST['image_front_url'] != null)
        $sql .= "image_front_url = '".$image_front_url."', ";
    $sql.= "ingredients_text = '".$con->real_escape_string($ingredients_text)."', nutriments = '".$nutriments."'
            where id = '$barcode'";
    $rs = $con->query($sql);
    if($con->affected_rows>0)
    {
        $sql = "select * from prodotti_supermercati where codice_a_barre = '$barcode' and codice_supermercato = (select id from supermercati where descrizione = '$supermarket' limit 1)";
        $rs = $con->query($sql);
        if($rs->num_rows == 0){
            $prezzo = $_POST["prezzo"];
            $supermercato = $_POST["supermarket"];
            $sql = "insert into prodotti_supermercati (codice_a_barre, codice_supermercato, prezzo)
                    values ('$barcode', (select id from supermercati where descrizione = '$supermarket' limit 1), '$prezzo')";
        }
        else{
            $sql = "update prodotti_supermercati set prezzo = $prezzo
                    where codice_a_barre = '$barcode' and codice_supermercato = (select id from supermercati where descrizione = '$supermarket' limit 1)";
        }
        $con->query($sql);
        $json->message = "Prodotto modificato correttamente";
        echo json_encode($json);
    }
    else
        echo "Errore nell'aggiornamento del prodotto";
    $con->close();
