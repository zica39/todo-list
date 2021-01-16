<?php
$todos = json_decode( file_get_contents('../todo.db'), true );
$to_show = [];
$to_show_index = []; 


	// radi se pretraga
	if(isset($_POST['tekst']) && $_POST['tekst'] != ""){
		foreach($todos as $todo){
			if( stripos($todo['tekst'], $_POST['tekst']) !== FALSE ){
				$to_show[] = $todo;
			}
		}
	}else{
		$to_show = $todos;
		
	}
	
	$to_show1 = [];
	if(isset($_POST['opis']) && $_POST['opis'] != ""){
		foreach($to_show as $todo){
			if( stripos($todo['opis'], $_POST['opis']) !== FALSE ){
				
				$to_show1[] = $todo;
			}
		}
	}else{
		$to_show1 = $to_show;	
	}
	
	
	
	$to_show2 = [];
	if(isset($_POST['zavrsen']) && $_POST['zavrsen'] != ""){
		foreach($to_show1 as $todo){
			if( $_POST['zavrsen'] == 1 ){
				if($todo['zavrseno']){
					$to_show2[] = $todo;
				} 
			}else if($_POST['zavrsen'] == 0){
				if(!$todo['zavrseno']){
					$to_show2[] = $todo;
				} 
			}
		}
	}else{
		
	$to_show2 = $to_show1;
	}
	
	foreach($to_show2 as $index => $task){
		$to_show_index[] = array_search($task , $todos);
	}
	echo json_encode($to_show_index);
?>