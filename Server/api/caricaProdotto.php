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

    $sql = "insert into prodotti(id, ";
    if($_POST['keywords'] != null)
        $sql .= "keywords, ";
    if($_POST['categories'] != null)
        $sql .= "categories, ";
    $sql.="creator, created_t, generic_name, image_front_url, ingredients_text, nutriments) ";
    $sql.="values(?,";
    if($_POST['keywords'] != null)
        $sql .= "?, ";
    if($_POST['categories'] != null)
        $sql .= "?, ";
    $sql.="?,?,?,?,?,?)";
    $stmt = $con->prepare($sql);
    if($_POST['keywords'] != null){
        if($_POST['categories'] != null)
            $stmt->bind_param("sssissss", $barcode, $categories, $creator, $created_t, $generic_name, $image_front_url, $ingredients_text, $nutriments);
        else
            $stmt->bind_param("ssssissss", $barcode, $keywords, $categories, $creator, $created_t, $generic_name, $image_front_url, $ingredients_text, $nutriments);
        }
        
    else if($_POST['categories'] != null)
        $stmt->bind_param("sssissss",$barcode, $categories, $creator, $created_t, $generic_name, $image_front_url, $ingredients_text, $nutriments);
    else
        $stmt->bind_param("ssisss", $barcode, $creator, $created_t, $generic_name, $image_front_url, $ingredients_text, $nutriments);
    $barcode = $_POST['barcode'];
    if($_POST['keywords'] != "")
        $keywords = $_POST['keywords'];
    else
        $keywords = null;
    if($_POST['categories'] != "")
        $categories = $_POST['categories'];
    else
        $categories = null;
    $creator = $_POST['creator'];
    $created_t = floor(microtime(true) * 1000);
    $generic_name = $_POST['generic_name'];
    if($_POST['image_front_url']!="")
        $image_front_url = $_POST['image_front_url'];
    else
        $image_front_url = null;
    $ingredients_text = $_POST['ingredients_text'];
    $nutriments = $_POST['nutriments'];
    if($stmt->execute())
    {
        $json->message = "Prodotto inserito correttamente";
        echo json_encode($json);
    }
    else
        echo "Errore nell'inserimento del prodotto";
    $stmt->close();
    $con->close();
?>