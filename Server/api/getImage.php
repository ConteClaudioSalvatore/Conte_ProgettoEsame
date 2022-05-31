<?php
    require("databaseCredentials.php");  
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
    if(!empty($_GET["image_name"]) && !empty($_GET["image_ext"])){
        $fileName = $_GET["image_name"]; 
        $fileExt = $_GET["image_ext"]; 
        $sql = "select image_data from images where image_name = '$fileName' and image_ext = '$fileExt'";
        $result = $con->query($sql);
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();
            $imageData = $row["image_data"];
            $json->image = base64_encode($imageData);
            echo json_encode($json);
        }
        else
            echo "Image not foud";
    }
    $con->close();
    exit;
?>