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
    $creator = $_POST['creator'];
    $created_t = floor(microtime(true) * 1000);
    $generic_name = $_POST['generic_name'];
    $image_front_url = $con->real_escape_string($_POST['image_front_url']);
    $ingredients_text = $con->real_escape_string($_POST['ingredients_text']);
    $nutriments = $_POST['nutriments'];
    $sql = "insert into prodotti(id, keywords, categories, creator, created_t, generic_name,image_front_url, ingredients_text";
    if($nutriments != null)
        $sql .= ", nutriments";
    $sql.=") ";
    $sql.="values('$barcode','$keywords','$categories','$creator',$created_t,'$generic_name','$image_front_url','$ingredients_text'";
    if($nutriments != null)
        $sql .= ",'$nutriments'";
    $sql.=")";
    if($con->query($sql))
    {
        $json->message = "Prodotto inserito correttamente";
        echo json_encode($json);
    }
    else
        echo "Errore nell'inserimento del prodotto";
    $con->close();
?>