<?php
//$url = "https://serpapi.com/search.json?engine=youtube&search_query=".$_REQUEST['country']."+travel&api_key=775fcc9b93ae27691d8a1e5c1c74ef569324c31bd48f8b994a24bded78e8fc9f";
$url = "https://serpapi.com/search.json?engine=youtube&search_query=unitedkingdom+travel&api_key=775fcc9b93ae27691d8a1e5c1c74ef569324c31bd48f8b994a24bded78e8fc9f";


    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    
    $result=curl_exec($ch);

	curl_close($ch);

    $decode = json_decode($result,true);	
    
    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";

	
    $output['data'] = $decode;
    
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>