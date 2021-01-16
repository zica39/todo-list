<?php 
	$todos = json_decode( file_get_contents('../todo.db'), true );

  if( isset($_POST['index']) && is_numeric($_POST['index']) ){
        $index = $_POST['index'];
    }else{
        exit("Greska 1 - nepravilan index");
   }
   
    if( isset($_POST['tekst']) && $_POST['tekst'] != "" ){
        $tekst = $_POST['tekst'];
    }else{
        exit("Greska 2 - morate unijeti tekst...");
    }
    if( isset($_POST['opis']) && $_POST['opis'] != "" ){
        $opis = $_POST['opis'];
    }else{
        exit("Greska 3 - morate unijeti opis...");
    }

    $todos[$index]['tekst'] = $tekst;
    $todos[$index]['opis'] = $opis;

   if( file_put_contents( '../todo.db', json_encode($todos) ) ){
		exit("OK");
	}else{
		exit("Greska pri upisu...");
	}

  
	
?>