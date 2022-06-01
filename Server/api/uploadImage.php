<?php
    require("databaseCredentials.php");  
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
    if(!empty($_FILES["image"]["name"])){
        $filePath = basename($_FILES["image"]["name"]); 
        $fileType = pathinfo($filePath, PATHINFO_EXTENSION); 
        $fileName = pathinfo($filePath, PATHINFO_FILENAME);
        $allowTypes = array('jpg','png','jpeg','gif'); 
        if(in_array($fileType, $allowTypes)){ 
            $image = $_FILES['image']['tmp_name']; 
            $imgContent = addslashes(file_get_contents($image)); 
            $sql = "insert into images(image_name, image_ext, image_data) values('$fileName', '$fileType', '$imgContent')";
            if($con->query($sql)){
                $json->url = "https://claudioconte.altervista.org/api/getImage.php?image_name=$fileName&image_ext=$fileType";
                echo json_encode($json);
            }
            else
                echo "Errore nell'inserimento dell'immagine";
        }
    }
    else{
        $json->message = "Nessuna immagine da inserire";
        echo json_encode($json);
    }
    $con->close();
    
?>