<?php

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

?>

<?php

 

    $executionStartTime = microtime(true);

 

    $countryData = json_decode(file_get_contents("../json/countryBorders.geo.json"), true);

 

    $country = [];

 

    foreach ($countryData['features'] as $feature) {

 

        $temp = null;

        $temp['code'] = $feature["properties"]['iso_a3'];

        $temp['name'] = $feature["properties"]['name'];

 

        array_push($country, $temp);

        

    }

 

    usort($country, function ($item1, $item2) {

 

        return $item1['name'] <=> $item2['name'];

 

    });

 

    $output['status']['code'] = "200";

    $output['status']['name'] = "ok";

    $output['status']['description'] = "success";

    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    $output['data'] = $country;

    

    header('Content-Type: application/json; charset=UTF-8');

 

    echo json_encode($output);

 

?>