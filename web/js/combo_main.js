function make_gradient(){
    let svg_selector=document.getElementById("combo_g");
    let hue_break=36;
    // let saturation_break=10;
    let light_break=36;
    let width_perc=100/hue_break;
    let height_perc=100/light_break;
    for(let i=0;i<hue_break;i++){
        let x=i*width_perc;
        for (let j=0;j<light_break;j++){
            let y=j*height_perc;
            let hex=hslToHex(
                360/hue_break*(i),
                100,
                100-100/light_break*(j)
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
    )
    // update_svg
    addBackgroundRectangle(document.getElementById("combo_g"));
    update_all_svg_size();
    //make gradient
    make_gradient();



    // let g=document.getElementById("grayscale_container")
    // console.log(g.clientWidth,g.offsetWidth)

    //add svg
    //add instruction
    //add exporter
    //add
}

//responsive
window.addEventListener("resize",()=>resize())
window.addEventListener('load', function () {
    adjust_window_size();
    generate()
})