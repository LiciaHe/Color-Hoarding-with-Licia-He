function adjust_window_size(){
    /**
     * set up the generator area size (adjusting height)
     */
    // let hor_containter=document.getElementById("information");
    // let current_height=hor_containter.clientHeight;
    // //
    let gc=document.getElementById("generator-container");
    let target_height=window.innerHeight;
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
////bar
function start_drag_bar(e){
    SVS(["action","start_drag_bar"],true);
    drag_bar(e)
}
function find_nearest_bar(e){
    let mouse_y=e.clientY;
    let b0=document.getElementById("0_graybar");
    let b1=document.getElementById("1_graybar");
    let y_perc_0=b0.getAttributeNS(null,"y1")
    let y_value_0=y_perc_0.slice(0,y_perc_0.length-1);
    let y_perc_1=b1.getAttributeNS(null,"y1")
    let y_value_1=y_perc_1.slice(0,y_perc_1.length-1);
    let mouse_perc=parseInt((mouse_y-GVS(["structure","gray_c_bbox_top"]))/GVS(["structure","gray_c_height"])*100);


    if (Math.abs(mouse_perc-y_value_0)>Math.abs(mouse_perc-y_value_1)){
        //closes to y1
        return [b1,y_value_1,mouse_perc,1]
    }else{
        return [b0,y_value_0,mouse_perc,0]
    }

}
function drag_bar(e){
    if (GVS(["action","start_drag_bar"])){
        let b_yv_mp=find_nearest_bar(e);
        let y_value=b_yv_mp[1];
        let perc=b_yv_mp[2];
        let line=b_yv_mp[0];
        if (y_value!==perc){
            update_element_attribute(
                line,
                {
                    "y1":`${perc}%`,
                    "y2":`${perc}%`,
                }
            )
            if (b_yv_mp[3]===0){
                SVS(["calculation","current_light_lower"],perc);
            }else{
                SVS(["calculation","current_light_upper"],perc);
            }

            update_lightness()

        }
    }
}
function end_drag_bar(e){
    SVS(["action","start_drag_bar"],false);

}

//rectangle
function start_selecting_gradient(e){
    SVS(["action","start_drag_rect"],true);

    SVS(["structure","start_rect"],e.target);

}
function drag_through_gradient(e){
    // window.gradient_dragged=true;
    SVS(["action","gradient_dragged"],true);
    if (GVS(["action","start_drag_rect"])&&GVS(["structure","current_rect_rule"])===null){
        //initiate a new rule based on the start rect
        IIS(["basic","rule_ct"],1);
        // window.rule_ct+=1;
        let start_rect=GVS(["structure","start_rect"]);
        SVS(["structure","current_rect_rule"],addElementToSvg(
            "rect",
            {
                "width":start_rect.getAttributeNS(null,"width"),
                "height":start_rect.getAttributeNS(null,"height"),
                "x":start_rect.getAttributeNS(null,"x"),
                "y":start_rect.getAttributeNS(null,"y"),
                // "stroke":"black",
                // "stroke-width":"1%",
                // "fill":"none",
                "class":"rule_rect rule_rect_forming",
                "id":`rule_${GVS(["basic","rule_ct"])-1}`
            },
            document.getElementById("combo_g")
        ))
    }else if (GVS(["action","start_drag_rect"])&&GVS(["structure","current_rect_rule"])&&!GVS(["action","pending_rule"])){
        //update current rule
        let attr=calculate_rect_drag_wh(GVS(["structure","start_rect"]),e.target);
        update_element_attribute(GVS(["structure","current_rect_rule"]),attr);
    }
}



function end_gradient(e){
    if(GVS(["structure","current_rect_rule"])){
        update_element_attribute(GVS(["structure","current_rect_rule"]),{"class":"rule_rect rule_rect_pending"});
    }
    SVS(["action","start_drag_rect"],false);
    SVS(["action","gradient_dragged"],false);
    SVS(["action","pending_rule"],true);// prevent the creation of the new rect until users have finished the rules


}
