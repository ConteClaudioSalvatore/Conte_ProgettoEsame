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
    $barcode = $param->code;
    $keywords = $param->keywords;
    $categories = $param->categories;
    $creator = $param->creator;
    $created_t = floor(microtime(true) * 1000);
    $generic_name = $param->generic_name;
    $image_front_url = $param->image_front_url;
    $ingredients_text = $param->ingredients_text;
    $nutriments->json_encode($param->nutriments);
    $sql = "insert into prodotti(id, ";
    if($keywords != null)
        $sql .= "keywords, ";
    if($categories != null)
        $sql .= "categories, ";
    $sql.="creator, created_t, generic_name, image_front_url, ingredients_text, nutriments) ";
    $sql.="values(:id,";
    if($keywords != null)
        $sql .= ":keywords, ";
    if($categories != null)
        $sql .= ":categories, ";
    $sql.=":creator,:created_t,:generic_name,:image_front_url,:ingredients_text, :nutriments)";
    $stmt = $con->prepare($sql);
    $stmt->bind_param(":id", $id);
    if($keywords != null)
        $stmt->bind_param(":keywords", $keywords);
    if($categories != null)
        $stmt->bind_param(":categories", $categories);
    $stmt->bind_param(":creator", $creator);
    $stmt->bind_param(":created_t", $created_t);
    $stmt->bind_param(":generic_name", $generic_name);
    $stmt->bind_param(":image_front_url", $image_front_url);
    $stmt->bind_param(":ingredients_text", $ingredients_text);
    $stmt->bind_param(":nutriments", $nutriments);
    if($stmt->execute())
        echo "Prodotto inserito correttamente";
    else
        echo "Errore nell'inserimento del prodotto";
    $stmt->close();
    $con->close();
?>