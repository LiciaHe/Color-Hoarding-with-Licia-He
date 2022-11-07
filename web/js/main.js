// import * as d3 from "https://cdn.skypack.dev/d3@7";

function get_image_loc(d){
    return `swatches/${d["brand"]}_${d["name"]}_${d["type"]}.jpg`
}
function hover_over_card(e){
    let d3_this=d3.select(this);
    // console.log(d3.select(this).data()[0])
    d3_this.style(
        "background-color","white"
    ).style("width","30vw")
        .style("height","40vw")
        .style("border","8px solid black");
    d3_this.select("*")
        .style("display","block")


    // this.attr("background-color","white")
    // update_element_attribute(this,{"style":"background-color:white;"})
    // console.log(this)
    // document.getElementById("main_display").offsetHeight;
    //
}
function leave_card(e){
    let d3_this=d3.select(this);
    d3_this.style("background-color",(d)=>`rgb(${d["rgbs"][0]})`)   .style("width","max(5vw,30px)")
        .style("height","max(5vw,30px)")
        .style("border","8px solid white");
    d3_this.select("*")
        .style("display","none")



    // this.attr("background-color","white")
    // update_element_attribute(this,{"style":"background-color:white;"})
    // console.log(this)
    // document.getElementById("main_display").offsetHeight;
    //

}

function apply_card_attr(selector){
    selector.attr("class","card")
        .style("background-color",(d)=>`rgb(${d["rgbs"][0]})`)
        .on("mouseover",hover_over_card)
        .on("mouseenter",hover_over_card)
        .on("mouseout",leave_card);
    let imgs=selector.append("img")
        .attr("src",(d)=>get_image_loc(d))

}
function create_chart(){
    let bind=d3.select("#main_display").selectAll("div.card").data(window.entries,(d)=>d["id"]);
    window.enter=bind.enter()
        .append("div");
    apply_card_attr(window.enter);
    bind.exit().remove()
}

function generate(){
    init_popup();
    d3.json(`full_data.json`).then(function (data){
        window.full_data=data;

        window.entries=data["data"];
        window.collection=data["collection"];
        window.count=data["count"];
        console.log(data);
        // adjust_swatch_view_size(window.entries[0]);
        // set_bg_color(window.entries[0])
        // create_chart();
    })
    // popupDisplay
}
generate()