<?php
// Definicoes padrao do upload
$uploadDirectory = 'uploads/'; // Pasta onde os arquivos sao salvos
$extensions = array('jpg', 'pdf'); // Extensoes permitidas

$totalItens = count($_FILES['arquivo']['tmp_name']);
$msgRetorno = array();

for($i = 0; $i < $totalItens; $i++){
	$fileExtension = substr($_FILES['arquivo']['name'][$i], -3);
	
	if($extensions){
		if(in_array($fileExtension, $extensions)){
			$nome_aleatorio = md5(date("Y-m-d H:i:s")) . '_' . $_FILES['arquivo']['name'][$i];
			
			if(move_uploaded_file($_FILES['arquivo']['tmp_name'][$i], $uploadDirectory . $nome_aleatorio)){
				$msgRetorno[] = array(
					'status' => 1,
					'filename' => $nome_aleatorio
				);
			} else {
				$msgRetorno[] = array(
					'status' => 0,
					'msgerror' => "Erro ao mover arquivo \"{$nome_aleatorio}\" para a pasta \"{$uploadDirectory}\""
				);
			}
		} else {
			$msgRetorno[] = array(
				'status' => 0,
				'msgerror' => "A extensão do arquivo \"{$nome_aleatorio}\" não é permitida"
			);
		}
	} else {
		$nome_aleatorio = md5(date("Y-m-d H:i:s")) . '_' . $_FILES['arquivo']['name'][$i];
			
		if(move_uploaded_file($_FILES['arquivo']['tmp_name'][$i], $nome_aleatorio)){
			$msgRetorno[] = array(
				'status' => 1,
				'filename' => $nome_aleatorio
			);
		} else {
			$msgRetorno[] = array(
				'status' => 0,
				'msgerror' => "Erro ao mover arquivo \"{$nome_aleatorio}\" para a pasta \"{$uploadDirectory}\""
			);
		}
	}
}

echo json_encode($msgRetorno);

?>