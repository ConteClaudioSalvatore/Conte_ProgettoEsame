<?php
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	header("Content-Type: application/json; charset=UTF-8");
    $con = new mysqli("localhost", "root", "", "dbdoveconviene");
    /*Controlla se il codice di errore è diverso da 0*/
    if ($con->connect_errno)
        die("Errore connessione database " . $con->connect_errno . " " . $con->connect_error);
	$postdata = file_get_contents("php://input");
    $params = json_decode($postdata);
	$barcode = $params->barcode;
    $keywords = $params->keywords;
    $categories = $params->categories;
    $generic_name = $params->generic_name;
    $image_front_url = $params->image_front_url;
    $ingredients_text = $params->ingredients_text;
    $nutriments = $params->nutriments;
    $lastEditor = $params->lastEditor;
    $lastEditedT = floor(microtime(true) * 1000);
    $sql = "update prodotti set ";
    if($keywords != null)
        $sql .= "keywords = :keywords, ";
    if($categories != null)
        $sql .= "categories = :categories, ";
    $sql.="generic_name = :generic_name,";
    if($image_front_url != null)
        $sql .= "image_front_url = :image_front_url, ";
    $sql .= "
        ingredients_text = :ingredients_text,
        nutriments = :nutriments,
        lastEditor = :lastEditor,
        lastEditedT = :lastEditedT
        where id = :barcode";
    $stmt = $con->prepare($sql);
    $stmt->bind_param(":barcode", $barcode);
    if($keywords != null)
        $stmt->bind_param(":keywords", $keywords);
    if($categories != null)
        $stmt->bind_param(":categories", $categories);
    $stmt->bind_param(":generic_name", $generic_name);
    if($image_front_url != null)
        $stmt->bind_param(":image_front_url", $image_front_url);
    $stmt->bind_param(":ingredients_text", $ingredients_text);
    $stmt->bind_param(":nutriments", $nutriments);
    $stmt->bind_param(":lastEditor", $lastEditor);
    $stmt->bind_param(":lastEditedT", $lastEditedT);
    if($stmt->execute())
        echo "Prodotto modificato correttamente";
    else
        echo "Errore nella modifica del prodotto";
?>
