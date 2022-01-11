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

 

    /* getCountryISO2AndName.php */

   

    // The first two lines provide error reporting when the routine is called from a browser, eg:

   

    // http://localhost/exampleWebsite/libs/php/getCountryISO2AndName.php

   

    // Remove or comment them out once you are sure that the routine is stable.

 

    ini_set('display_errors', 'On');

    error_reporting(E_ALL);

 

    // Set the return header

 

    header('Content-Type: application/json; charset=UTF-8');

 

    // start recording the time taken

 

    $executionStartTime = microtime(true);

 

    // Open the file and seralise it to an associative array by using the optional

    // json_decode parameter TRUE. Omitting this will create an object instead.

 

    $countryData = json_decode(file_get_contents("../json/country.json"), true);

   

    // Test that it worked

 

    if (is_null($countryData)) {

 

        $output['status']['code'] = "400";

        $output['status']['name'] = "failure";

        $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

 

    } else {

 

        // Create output array

 

        $countryArray = [];
        $countryName = $('#selCountry').val();
 

        // Loop through objects

 

        foreach ($countryData['features'] as $features) {

 


            // Create a temporary variable, add two properties to it

            // from current iteration and append it to the array

 

            $temp = null;


            $temp['border'] = $features['border'];

 

            

           if ($countryName == $countryData){
            array_push($countryArray, 'border');
            print_r($countryArray)
           }

        }
            
 
        $output['status']['code'] = "200";

        $output['status']['name'] = "ok";

        $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

        $output['data'] = $countryArray;

 

    }

   

    echo json_encode($output);

 

?>