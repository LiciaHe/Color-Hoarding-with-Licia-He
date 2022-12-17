function get_hs_by_id(id){
    /**
     * given a id, parse the id, obtain the hs information and the location information (upper left and lower right
     *
     */
    let ids=id.split("_");
    let i=parseInt(ids[1]);
    let j=parseInt(ids[2]);
    let h=360/GVS(["calculation","hue_break"])*(i);
    let s=100/GVS(["calculation","saturation_break"])*(j);
    return [h,s]
}
function remove_percentage(perc){
    return parseFloat(perc.slice(0,perc.length-1));
}
function determine_rect_from_two_pts(x0,y0,x1,y1){
    let top_left=[Math.min(x0,x1),Math.min(y0,y1)];
    let bottom_right=[Math.max(x0,x1),Math.max(y0,y1)];
    let width=bottom_right[0]-top_left[0];
    let height=bottom_right[1]-top_left[1];
    return {
        "x":`${top_left[0]}%`,
        "y":`${top_left[1]}%`,
        "width":`${width}%`,
        "height":`${height}%`,
    }
}
function calculate_rect_drag_wh(start_target,end_target){

    let start_x=remove_percentage(start_target.getAttributeNS(null,"x"));
    let start_y=remove_percentage(start_target.getAttributeNS(null,"y"));
    let end_x=remove_percentage(end_target.getAttributeNS(null,"x"));
    let end_y=remove_percentage(end_target.getAttributeNS(null,"y"));

    return determine_rect_from_two_pts(start_x,start_y,end_x,end_y)
}
function update_rect_attr_by_hs_info(hue_range,sat_range){
    /**
     * hue
     */
    let attr={}
    if (hue_range){

        attr["x"]=`${hue_range[0]/360*100}%`;
        attr["width"]=`${(hue_range[1]-hue_range[0])/360*100}%`
    }
    if (sat_range){
        attr["y"]=`${sat_range[0]}%`;
        attr["height"]=`${sat_range[1]-sat_range[0]}%`;
    }

    let rect=GVS(["structure","current_rect_rule"]);
    let rect_fill=GVS(["structure","current_rect_rule_fill"]);
    update_element_attribute(rect,attr);
    update_element_attribute(rect_fill,attr);
}
function extract_rect_attr(rect){
    let x=remove_percentage(rect.getAttributeNS(null,"x"));
    let y=remove_percentage(rect.getAttributeNS(null,"y"));
    let width=remove_percentage(rect.getAttributeNS(null,"width"));
    let height=remove_percentage(rect.getAttributeNS(null,"height"));
    return {
        "x":x,"y":y,"width":width,"height":height
    }
}
function convert_rect_attr_to_hs_range(rect_attr){
    /**
     * given a rect_attr (percentage, convert it back to the range
     */
    let hue_start=rect_attr["x"]/100*360;
    let hue_end=(rect_attr["x"]+rect_attr["width"])/100*360;
    let sat_start=rect_attr["y"];
    let sat_end=(rect_attr["y"]+rect_attr["height"])
    return {
        "hue":[hue_start,hue_end],
        "saturation":[sat_start,sat_end]
    }


}
function determine_bbox_update_mode(prev_box,cursor_loc){
    /**
     * Given a location, determine if it's corner case,or edge case, also which corner it is.
     * Starting from the top left, going clockwise.
     * e.g. C0 means top left corner, C2 is bottom right
     * E0 is top edge, E3 is left edge
     * The mode is stored as a list [case, number]
     */
    let xmin,xmax,ymin,ymax;
    xmin=prev_box["x"];
    xmax=prev_box["x"]+prev_box["width"];
    ymin=prev_box["y"];
    ymax=prev_box["y"]+prev_box["height"];
    let x=cursor_loc[0];
    let y=cursor_loc[1];
    // let corners=[
    //     [xmin,ymin],
    //     [xmax,ymin],
    //     [xmax,ymax],
    // ]
    let bbox_mode;
    if (abs_dist_less_than_thresh(x,xmin)){
        if(abs_dist_less_than_thresh(y,ymin)){
            //corner 0
            bbox_mode=["c",0]
        }else if (abs_dist_less_than_thresh(y,ymax)){
            bbox_mode=["c",3]
        }else{
            bbox_mode=["e",3]
        }
    }else if (abs_dist_less_than_thresh(x,xmax)){
        if(abs_dist_less_than_thresh(y,ymin)){
            //corner 0
            bbox_mode=["c",1]
        }else if (abs_dist_less_than_thresh(y,ymax)){
            bbox_mode=["c",2]
        }else{
            bbox_mode=["e",1]
        }
    }else{
        if(abs_dist_less_than_thresh(y,ymin)){
            bbox_mode=["e",0]
        }else{
            bbox_mode=["e",2]
        }
    }
    return bbox_mode

}
function abs_dist_less_than_thresh(value,to_compare){
    return Math.abs(value-to_compare)<GVS(["calculation","dist_threshold"])
}
function get_perc_loc_in_svg(e){
    let svg_container=document.getElementById("color_combo_svg");
    let sw=svg_container.clientWidth;
    let sh=svg_container.clientHeight;
    let top=svg_container.getBoundingClientRect().top;
    let left=svg_container.getBoundingClientRect().left;
    let x_loc=(e.clientX-left)/sw*100;
    let y_loc=(e.clientY-top)/sh*100;
    return [x_loc,y_loc]
}
function adjust_bounding_box(prev_box,cursor_loc){
    /**
     * given a location within or outside of the rectangle, adjust the previous bounding box based on the current location.
     * 1) determine drag mode -> corner /edge (if there's a mode already, use that)
     * 2) calculate xmin-xmax bounding box
     * 3) convert back to wh bounding box
     * cursor loc is in percentage
     */
    let mode=GVS(["action","bbox_adjust_mode"]);
    let xmin,xmax,ymin,ymax;
    xmin=prev_box["x"];
    xmax=prev_box["x"]+prev_box["width"];
    ymin=prev_box["y"];
    ymax=prev_box["y"]+prev_box["height"];

    let adjust_action={//return two corners
        "c0":function (x,y){
            return [[x,y],[xmax,ymax]]
        },
        "c1":(x,y)=>[[xmin,y],[x,ymax]],
        "c2":(x,y)=>[[xmin,ymin],[x,y]],
        "c3":(x,y)=>[[x,ymin],[xmax,y]],
        "e0":(x,y)=>[[xmin,y],[xmax,ymax]],
        "e1":(x,y)=>[[xmin,ymin],[x,ymax]],
        "e2":(x,y)=>[[xmin,ymin],[xmax,y]],
        "e3":(x,y)=>[[x,ymin],[xmax,ymax]],
    }
    let two_corners=adjust_action[`${mode[0]}${mode[1]}`](cursor_loc[0],cursor_loc[1]);
    // console.log(mode,two_corners,xmin,xmax,ymin,ymax)
    let updated_attr=determine_rect_from_two_pts(
        ...two_corners[0],...two_corners[1]
    )
    //figure out new box
    return updated_attr




}
function get_rule_values_by_id(id_tag){
    /**
     * extract from the rule set
     */
    let current_rule_div=document.getElementById(`rule_content_${id_tag}`);
    let rules=current_rule_div.getElementsByTagName("div");
    let order=["hue","saturation","lightness","pick","weight"];
    let rule_value={}
    for (let i=0;i<rules.length;i++){
        let key=order[i];
        let inputs=rules[i].getElementsByTagName("input");
        let values=[];
        for (let j=0;j<inputs.length;j++){
            values.push(parseFloat(inputs[j].value));
        }
        rule_value[key]=values
    }
    return rule_value
}

function run_single_rule_simulation(rule_values){
    /**
     * given a set of rule values ({}),
     * return the result of the simulation (hsls, sorted)
     */
    let pick_ct=parseInt(random_in_range(rule_values["pick"]));
    let hsls=[];
    for (let i=0;i<pick_ct;i++){
        let hsl=[
            random_in_range(rule_values["hue"]),
            random_in_range(rule_values["saturation"]),
            random_in_range(rule_values["lightness"]),
        ]
        hsls.push(hsl)
    }
    return hsls
}

