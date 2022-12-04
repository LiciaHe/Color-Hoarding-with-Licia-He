function get_hs_by_id(id){
    /**
     * given a id, parse the id, obtain the hs information and the location information (upper left and lower right
     *
     */
    let ids=id.split("_");
    let i=parseInt(ids[1]);
    let j=parseInt(ids[2]);
    let h=360/GVS(["calculation","hue_break"])*(i);
    let s=100-100/GVS(["calculation","saturation_break"])*(j);
    return [h,s]
}
function remove_percentage(perc){
    return parseFloat(perc.slice(0,perc.length-1));
}
function calculate_rect_drag_wh(start_target,end_target){
    let start_x=remove_percentage(start_target.getAttributeNS(null,"x"));
    let start_y=remove_percentage(start_target.getAttributeNS(null,"y"));
    let end_x=remove_percentage(end_target.getAttributeNS(null,"x"));
    let end_y=remove_percentage(end_target.getAttributeNS(null,"y"));
    let top_left=[Math.min(start_x,end_x),Math.min(start_y,end_y)];
    let bottom_right=[Math.max(start_x,end_x),Math.max(start_y,end_y)];
    let width=bottom_right[0]-top_left[0];
    let height=bottom_right[1]-top_left[1];
    return {
        "x":`${top_left[0]}%`,
        "y":`${top_left[1]}%`,
        "width":`${width}%`,
        "height":`${height}%`,
    }
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