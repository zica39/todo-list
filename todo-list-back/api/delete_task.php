<?php
    $todos = json_decode( file_get_contents('../todo.db'), true );

    if( isset($_POST['index']) && is_numeric($_POST['index']) ){
        $index = $_POST['index'];
    }else{
        exit("Greska 1 - nepravilan index");
    }
   
	array_splice ($todos, $index, 1);

	if( file_put_contents( '../todo.db', json_encode($todos) ) ){
		exit("OK");
	}else{
		exit("Greska pri upisu...");
	}
		
?>