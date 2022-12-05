window.SETTING={
    "structure":{
        "gray_c_bbox_top":null,
        "gray_c_height":null,
        "current_rect_rule":null,
        "start_rect":null,
        "warning_div":null,

    },
    "basic":{
        "rule_ct":0,
        "svgns":"http://www.w3.org/2000/svg",
    },
    "view":{
        "hint_texts":[
            "Hue is a value between 0 and 360 (degrees). Adjust the red rectangle horizontally to modify the range of hue.",
            "Saturation is a value between 0 and 100 (percent). Adjust the red rectangle vertically to modify the range of saturation.",
            "Lightness is a value between 0 and 100 (percent). Adjust the yellow bars to modify the range of lightness. Mean value is visualized.",
            "Determine the number of color (between 0 and 50) that this rule can potentially produce.",
            "If there are multiple color rules, rules with larger weight are more likely to be chosen. The weight range values are non-negative numbers.",
        ],
        "rule_action_hint_text": {
            "coll_test":"Simulate: Click to run another simulation.",
            "coll_close":"Delete: Click to delete this rule.",
            "coll_finalize":"Finalize: Click to finalize and fold this rule.",
        }
    },
    "action":{
        "gradient_dragged":null,
        "start_drag_rect":null,
        "pending_rule":null,
        "start_drag_bar":null,
    },
    "calculation":{
        "hue_break":80,
        "saturation_break":100,
        "current_light_lower":45,
        "current_light_upper":55,
        "dist_threshold":1
    }
}

function getValueFromObj(kLst,obj){
    let info=obj;
    if (typeof(kLst)==="string"){
        return obj[kLst]
    }
    for (let i=0;i<kLst.length;i++){
        try{
            info=info[kLst[i]]
        }catch (e){
            return undefined
        }
    }
    return info
}

function setValueInObj(kLst,obj,value){
    let info=obj;
    // kLst.forEach((k)=>info=info[kLst[i]])
    for (let i=0;i<kLst.length-1;i++){

        info=info[kLst[i]]
    }
    info[kLst[kLst.length-1]]=value
}
function IIS(kLst,increment){
    /**
     * increment in setting
     */
    let v=GVS(kLst);
    return SVS(kLst,v+increment)
}
function SVS(kLst,value){
    //no check
    return setValueInObj(kLst,window.SETTING,value)
}
function GVS(kLst){
    /**
     * get a value from setting
     */
    return getValueFromObj(kLst,window.SETTING)
}
function RVS(kLst){
    //get a random_value_from_setting range
    return random_in_range(GVS(kLst))
}
function RCVS(kLst){
    //choose a random choose value from a setting lst
    // let rg=GVS(kLst);
    return choose(GVS(kLst))
}