import { Event } from "./functions.js";

// MY LOCATION
export const getMyLocationInfo = async (lat, long) => {
  try {
    return await $.ajax({
      url: "php/openCage.php",
      type: "GET",
      dataType: "json",
      data: {
        lat: lat,
        long: long,
        key: APIkeys.openCage,
      },
      success(result) {
        console.log("Success from OpenCage");
        console.log(result);

        const code = result.data.results[0].components[
          "ISO_3166-1_alpha-3"
        ].toLowerCase();

        $(`#countries option:selected`).attr("selected", null);
        $(`#countries option[value='${code}']`).prop({ selected: true });
        var select = document.querySelector("#countries");
        select.dispatchEvent(new Event("change"));

        // $("#countries").select2(options).trigger("change");
      },
      error(jqXHR, textStatus, errorThrown) {
        console.log(
          "There was something wrong with the getMyLocationInfo request"
        );
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } catch (e) {
    console.log(e);
  } }