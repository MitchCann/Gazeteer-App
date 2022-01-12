<?php /*

	$executionStartTime = microtime(true) / 1000;
	
	$result = file_get_contents('../json/countryBorders.geo.json');
    

    $border = json_decode($result,true);
    $countryInfo = json_decode($result,true);
    
	$output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['name'] = $decode["name"][0];

    $output['data']['border'] = $border;
    
    
    //repeat above line for each API result

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
*/
?> 

<?php

  // remove for production

  ini_set('display_errors', 'On');
  error_reporting(E_ALL);

  $executionStartTime = microtime(true);

    $result = file_get_contents("../json/countryBorders.geo.json");


  $decode = json_decode($result,true);



  $borders = [];


  $i = 0;

  for ($i = 0; $i < count($decode['features']); $i++) {

    if($decode['features'] === $_REQUEST['iso_a2']){
      array_push($borders,$decode['features'][$i]['geometry']);
    }

    
  };




  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";
  $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
  $output['data'] = $borders;
  
  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output); 

?>