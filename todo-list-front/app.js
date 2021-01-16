var zadaci = [];
var api_route = "../todo-list-back/api";
let tabela_body = $('#tabela_svih_body');
var pretraga = false;

function citajZadatke(){
	$('#loading').modal('show');
	
    return $.ajax({
        type: "GET",
        url: api_route + "/get_tasks.php",
        success: (result) => {
            zadaci = JSON.parse(result);
			setTimeout(() => {$('#loading').modal('hide')}, 500);
        }
    });
}

function prikaziZadatke(){
    // let tabela_body = document.getElementById('tabela_svih_body');
   
    let tabela = [];
    zadaci.forEach( (zadatak, i) => {
        let zavrseno_chk = '';
        let klasa_zavrseno = '';
        if(zadatak.zavrseno){
            zavrseno_chk = 'checked';
            klasa_zavrseno = 'zavrseno';
        }
        let chk_box = `<input type="checkbox" onchange="zavrsiZadatak(${i})" ${zavrseno_chk} />`;
        let dugme_brisanje = `<button class="btn btn-sm btn-danger " onclick="ukloniZadatak(${i})" ><i class="fa fa-trash"></i></button>`;
        let dugme_izmjena = `<button class="btn btn-sm btn-primary " onclick="izmijeniZadatak(${i})" ><i class="fa fa-edit"></i></button>`;
        tabela.push(`<tr id="red_${i}" class="${klasa_zavrseno}" > <td>${zadatak.id}</td><td>${zadatak.tekst}</td><td>${zadatak.opis}</td> <td>${chk_box}</td> <td>${dugme_brisanje}</td><td>${dugme_izmjena}</td> </tr>`);
    });
    tabela_body.html(tabela.join(''));
	izbroji_ih();
}

function generisiNoviID(){
    let max = 0;
    for(let i = 0; i < zadaci.length; i++){
        if(zadaci[i].id > max) max = zadaci[i].id;
    }
    return max+1;
}

function zavrsiZadatak(index){
    zadaci[index].zavrseno = !(zadaci[index].zavrseno);
    
	//$('#loading').modal('show');
	$.ajax({ 
        type: "POST",
        url: api_route + '/complete_task.php',
        data: { index: index, status: (zadaci[index].zavrseno) },
        success: (response) => {
            $('#red_'+index).toggleClass('zavrseno');
			//$('#loading').modal('hide');
        }
    });
    // prikaziZadatke();
}

function ukloniZadatak(index){
    if(confirm("Da li ste sigurni?")){
		
		$('#loading').modal('show');
		$.ajax({ 
        type: "POST",
        url: api_route + '/delete_task.php',
        data: { index: index },
        success: (response) => {
            zadaci.splice(index, 1);
			prikaziZadatke();
			
			 if(pretraga) $('#pretraga_btn').trigger('click'); 
			 setTimeout(() => {$('#loading').modal('hide')}, 0);
        }
		});  
       
    }
}

function izmijeniZadatak(index){
    let zadatak = zadaci[index];
    document.getElementById('izmjena_tekst').value = zadatak.tekst;
    document.getElementById('izmjena_opis').value = zadatak.opis;
    document.getElementById('index_izmjena').value = index;
    $("#modal_izmjena").modal('show');
}

function izbroji_ih(){
	document.getElementById('broj').innerHTML = zadaci.length;	
}


function isprazniPolja(tip){
    if(tip == 'izmjena'){
        document.getElementById('izmjena_tekst').value = "";
        document.getElementById('izmjena_opis').value = "";
        document.getElementById('index_izmjena').value = -1;
    }else if(tip == 'dodavanje'){
        document.getElementById('novi_zadatak_tekst').value = "";
        document.getElementById('novi_zadatak_opis').value = ""; 
    }
}

function prikazi_rezultate_preatrage(niz_indeksa){
	if($('#pretraga_tekst').val() || $('#pretraga_opis').val() || $('#pretraga_zavrsen').val()){
		$('#ponisti_pretragu_btn').removeAttr('hidden');
		pretraga = true;
	}
	tabela_body.children().css({display:''});
	document.getElementById('broj').innerHTML = niz_indeksa.length;	
	tabela_body.children().each((index) => {
		if(!niz_indeksa.includes(index))
			tabela_body.children().get(index).style.display = 'none';
	});	
}

function ponisti_pretragu(){
	pretraga = false;
	tabela_body.children().css({display:''});
	izbroji_ih();
	$('#pretraga_tekst').val('');
	$('#pretraga_opis').val('');
	$('#pretraga_zavrsen').val('');
	$('#ponisti_pretragu_btn').attr('hidden','hidden');
}

citajZadatke().then( () => {
    prikaziZadatke();
});

// dodavanje event listener-a
document.getElementById('dodaj_novi_forma').addEventListener('submit', function(e){
    e.preventDefault();
    let novi_tekst = document.getElementById('novi_zadatak_tekst').value;
    let novi_opis = document.getElementById('novi_zadatak_opis').value;
    let novi_zadatak = { id: generisiNoviID(), tekst: novi_tekst, opis: novi_opis, zavrseno: false };
    
	$('#loading').modal('show');
    $.ajax({
        type: "POST",
        url: api_route + '/add_task.php',
        data: novi_zadatak,
        success: (result) => {
            if(result == "OK"){
				zadaci.push(novi_zadatak);
				ponisti_pretragu();
                prikaziZadatke();
                $("#modal_dodavanje").modal('hide');
                isprazniPolja('dodavanje');
				 setTimeout(() => {$('#loading').modal('hide')}, 0);
            }else{
                alert(result);
            }
        }    
    });

});

document.getElementById('izmjena_zadatka_forma').addEventListener('submit', function(e){
    e.preventDefault();
	let index = document.getElementById('index_izmjena').value;
	let tekst = document.getElementById('izmjena_tekst').value;
	let opis = document.getElementById('izmjena_opis').value;
	let izmjena = { index: Number(index), tekst: tekst, opis: opis };
	
	$('#loading').modal('show');
	$.ajax({
        type: "POST",
        url: api_route + '/edit_task.php',
        data: izmjena,
        success: (result) => {
            if(result == "OK"){
                zadaci[index].tekst = tekst;
				zadaci[index].opis = opis;
				prikaziZadatke();
				if(pretraga)  $('#pretraga_btn').trigger('click');

				$("#modal_izmjena").modal('hide');
				isprazniPolja('izmjena');
				 setTimeout(() => {$('#loading').modal('hide')}, 0);
            }else{
                alert(result);
            }
        }    
    });

    
});


document.getElementById('pretraga_forma').addEventListener('submit', function(e){
    e.preventDefault();
	
	let tekst = document.getElementById('pretraga_tekst').value;
	let opis = document.getElementById('pretraga_opis').value;
	let zavrsen = document.getElementById('pretraga_zavrsen').value;
	
	let pretraga = { tekst: tekst, opis: opis, zavrsen:zavrsen };
	
	$('#loading').modal('show');
	$.ajax({
        type: "POST",
        url: api_route + '/search_tasks.php',
        data: pretraga,
        success: (result) => {
            if(result){
				//console.log(result);
				result = JSON.parse(result);
                prikazi_rezultate_preatrage(result);
				 setTimeout(() => {$('#loading').modal('hide')}, 0);
            }else{
                alert(result);
            }
        }    
    });

    
});