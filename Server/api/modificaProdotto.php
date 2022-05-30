<?php
    require("databaseCredentials.php");  
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
    $sql = "update prodotti set ";
    if($_POST['keywords'] != null)
        $sql .= "keywords = ?, ";
    if($_POST['categories'] != null)
        $sql .= "categories = ?, ";
    $sql.="last_editor = ?, last_edited_t = ?, generic_name = ?, ";
    if($_POST['image_front_url'] != null)
        $sql .= "image_front_url = ?, ";
    $sql = "ingredients_text = ?, nutriments = ? 
            where id = ?";
    $stmt = $con->prepare($sql);
    if($_POST['keywords'] != null){
        if($_POST['categories'] != null)
            $stmt->bind_param("sssissss", $categories, $creator, $created_t, $generic_name, $image_front_url, $ingredients_text, $nutriments, $barcode);
        else
            $stmt->bind_param("ssssissss", $keywords, $categories, $creator, $created_t, $generic_name, $image_front_url, $ingredients_text, $nutriments, $barcode);
        }
        
    else if($_POST['categories'] != null)
        $stmt->bind_param("sssissss", $categories, $creator, $created_t, $generic_name, $image_front_url, $ingredients_text, $nutriments,$barcode);
    else
        $stmt->bind_param("ssisss", $creator, $created_t, $generic_name, $image_front_url, $ingredients_text, $nutriments, $barcode);
    $barcode = $_POST['barcode'];
    if($_POST['keywords'] != "")
        $keywords = $_POST['keywords'];
    else
        $keywords = null;
    if($_POST['categories'] != "")
        $categories = $_POST['categories'];
    else
        $categories = null;
    $creator = $_POST['last_editor'];
    $created_t = floor(microtime(true) * 1000);
    $generic_name = $_POST['generic_name'];
    $image_front_url = $_POST['image_front_url'];
    $ingredients_text = $_POST['ingredients_text'];
    $nutriments = $_POST['nutriments'];
    if($stmt->execute())
    {
        $sql = "select * from prodotti_supermercati where codice_a_barre = '$barcode' and codice_supermercato = '$creator'";
        $rs = $con->query($sql);
        if($rs->num_rows == 0){
            $prezzo = $_POST["prezzo"];
            $supermercato = $_POST["supermarket"];
            $sql = "insert into prodotti_supermercati (codice_a_barre, codice_supermercato, prezzo)
                    values ('$barcode', '$supermercato', '$prezzo')";
        }
        else{
            $sql = "update prodotti_supermercati set prezzo = $prezzo
                    where codice_a_barre = '$barcode' and codice_supermercato = '$creator'";
        }
        $con->query($sql);
        $json->message = "Prodotto modificato correttamente";
        echo json_encode($json);
    }
    else
        echo "Errore nell'inserimento del prodotto";
    $stmt->close();
    $con->close();
?>