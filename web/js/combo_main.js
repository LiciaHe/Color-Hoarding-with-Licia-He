function make_gradient(){
    let svg_selector=document.getElementById("combo_g");
    window.hue_break=80;
    window.saturation_break=100;
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
                100-parseInt((window.current_light_lower+window.current_light_upper)/2)
            )
            addElementToSvg(
                "rect",
                {
                    "width":`${width_perc}%`,
                    "height":`${height_perc}%`,
                    "x":`${x}%`,
                    "y":`${y}%`,
                    // "stroke":"black",
                    "fill":hex,
                    "class":"gradient_rect",
                    "id":`gr_${i}_${j}`
                },
                svg_selector
            )
        }
    }
}
function add_grayscale_bar(){
    //get graybar location
    let gray_c=document.getElementById("grayscale_container");
    let gray_svg=document.getElementById("grayscale_svg");
    window.gray_c_bbox=gray_c.getBoundingClientRect().top;
    window.gray_c_height=gray_c.clientHeight;
    let attr= {
        "x1":"2%",
        "x2":"96%",
        "y1":`${window.current_light_lower}%`,
        "y2":`${window.current_light_lower}%`,
        // "style":"fill:white;stroke-width:1;stroke:none",
        "stroke":"yellow",
        "stroke-width":"4%",
        "id":"0_graybar",
        "class":"grayscale_bar"
    }
    let gsg=document.getElementById("grayscale_g");
    let b1=addElementToSvg(
        "line",attr,gsg
    )
    attr["y1"]=`${window.current_light_upper}%`
    attr["y2"]=`${window.current_light_upper}%`
    attr["id"]="1_graybar"
    let b2=addElementToSvg(
        "line",attr,gsg
    )

    for (let i=0;i<2;i++){
        let item=[b1,b2][i];
        item.addEventListener("mousedown",(e)=start_drag_bar)
        item.addEventListener("mousemove",drag_bar)
        item.addEventListener("mouseup",endDrag)
        item.addEventListener("mouseleave",endDrag)
    }


    // gray_bar.addEventListener("dragend",(e)=>console.log(e))
    // gray_bar.addEventListener("mouseenter",(e)=>console.log(e))

}
function update_lightness(){
    // given a new lightness level, update the color
    let svg_selector=document.getElementById("combo_g");
    let children=document.getElementsByClassName("gradient_rect");
    console.log(window.current_light_lower,current_light_upper,100-parseInt((window.current_light_lower+window.current_light_upper)/2))
    for (let ci=0;ci<children.length;ci++){
        let rect=children[ci];
        let ids=rect.getAttribute("id").split("_");
        let i=parseInt(ids[1]);
        let j=parseInt(ids[2]);
        let hex=hslToHex(
            360/window.hue_break*(i),
            // 100,
            100-100/window.saturation_break*(j),
            100-parseInt((window.current_light_lower+window.current_light_upper)/2)
        )

        update_element_attribute(rect,{"fill":hex});
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
window.current_light_lower=45;
window.current_light_upper=55;
//responsive
window.addEventListener("resize",()=>resize())
window.addEventListener('load', function () {
    adjust_window_size();
    generate()
})