<?php
//$url = "http://api.geonames.org/searchJSON?country=".$_REQUEST['country']."&countryBias=".$_REQUEST['country']."&featureClass=P&maxRows=10&orderby=population&username=mitchcann";
$url = "https://api.getfestivo.com/v2/holidays?country=".$_REQUEST['country']."&year=2021&public=1&api_key=c8b9812e26c220573630257e629cdedc";



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