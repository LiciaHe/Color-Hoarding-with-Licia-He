function adjust_window_size(){
    /**
     * set up the generator area size (adjusting height)
     */
    let hor_containter=document.getElementById("information");
    let current_height=hor_containter.clientHeight;
    //
    let gc=document.getElementById("generator-container");
    let target_height=window.innerHeight-current_height
    gc.setAttribute("style",`height:${target_height}px`);
}

function update_svg_size(container_id,svg_id){
    let svg_container=document.getElementById(container_id);
    let svg_w=svg_container.clientWidth;
    let svg_h=svg_container.clientHeight;
    // console.log(svg_w,svg_h,container_id,svg_container.offsetWidth);
    return initSVG(svg_id,svg_w,svg_h);
}

function update_all_svg_size(){
    update_svg_size("grayscale_container","grayscale_svg");
    update_svg_size("svg_container","color_combo_svg");
}
function resize(){
    adjust_window_size();
    update_all_svg_size();
}