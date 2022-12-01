function make_gradient(){
    let svg_selector=document.getElementById("combo_g");
    let hue_break=36;
    let saturation_break=36;
    // let light_break=36;
    let width_perc=100/hue_break;
    let height_perc=100/saturation_break;
    for(let i=0;i<hue_break;i++){
        let x=i*width_perc;
        for (let j=0;j<saturation_break;j++){
            let y=j*height_perc;
            let hex=hslToHex(
                360/hue_break*(i),
                // 100,
                100-100/saturation_break*(j),
                window.current_light
            )
            addElementToSvg(
                "rect",
                {
                    "width":`${width_perc}%`,
                    "height":`${height_perc}%`,
                    "x":`${x}%`,
                    "y":`${y}%`,
                    // "stroke":"black",
                    "fill":hex
                },
                svg_selector
            )
        }
    }
}
function add_grayscale_bar(){
    let gray_bar=addElementToSvg(
        "line",
        {
            "x1":"2%",
            "x2":"96%",
            "y1":`${window.current_light}%`,
            "y2":`${window.current_light}%`,
            // "style":"fill:white;stroke-width:1;stroke:none",
            "stroke":"yellow",
            "stroke-width":"2%",
            "id":"grayscale_bar",
            "pointer-events":"all"
        },
        document.getElementById("grayscale_g")
    )

    gray_bar.addEventListener("mousedown",(e)=>console.log(e))
    gray_bar.addEventListener("mousemove",(e)=>console.log("move"))
    // gray_bar.addEventListener("dragend",(e)=>console.log(e))
    // gray_bar.addEventListener("mouseenter",(e)=>console.log(e))

}
function generate(){

    update_all_svg_size();
    let gray_rect=addBackgroundRectangle(
        document.getElementById("grayscale_g")
    );

    update_element_attribute(
        gray_rect,
        {
            "style":"",
            "fill":"url(#gray)"
        }
    );
    add_grayscale_bar();
    // update_svg
    addBackgroundRectangle(document.getElementById("combo_g"));
    update_all_svg_size();
    //add light bar

    //make gradient
    make_gradient();



    // let g=document.getElementById("grayscale_container")
    // console.log(g.clientWidth,g.offsetWidth)

    //add svg
    //add instruction
    //add exporter
    //add
}
window.current_light=50;
//responsive
window.addEventListener("resize",()=>resize())
window.addEventListener('load', function () {
    adjust_window_size();
    generate()
})