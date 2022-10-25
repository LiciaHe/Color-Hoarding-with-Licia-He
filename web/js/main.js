import * as d3 from "https://cdn.skypack.dev/d3@7";


function generate(){
    init_popup();
    d3.json(`full_data.json`).then(function (data){
        window.full_data=data;
        window.entries=data["data"];
        window.collection=data["collection"];
        window.count=data["count"];
        console.log(data);


    })
    // popupDisplay
}
generate()