function make_gradient(){
    let svg_selector=document.getElementById("background");
    let hue_break=GVS(["calculation","hue_break"]);
    let saturation_break=GVS(["calculation","saturation_break"]);
    let current_light_lower=GVS(["calculation","current_light_lower"]);
    let current_light_upper=GVS(["calculation","current_light_upper"]);

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
                100/saturation_break*(j),
                parseInt((current_light_lower+current_light_upper)/2)
            )
            addElementToSvg(
                "rect",
                {
                    "width":`${width_perc}%`,
                    "height":`${height_perc}%`,
                    "x":`${x}%`,
                    "y":`${y}%`,
                    "stroke":hex,
                    "fill":hex,
                    "class":"gradient_rect",
                    "id":`gr_${i}_${j}`
                },
                svg_selector
            )
        }
    }
}
function init_new_rule(){
    /**
     * Given the current hsl, init a new rule form.
     */
    if (GVS(["action","pending_rule"])){
        return
    }
    let id_tag=GVS(["basic","rule_ct"])-1;
    if(document.getElementById(`rule_${id_tag}`)){
        //already exist
        return
    }

    let rc=create_rule_container(id_tag);
    create_rule_content(rc,id_tag);
    //create the inner structures
    //populate rule content
    //default content
    SVS(
        ["calculation","current_pick_number"],
        GVS(["basic","default","pick"])
    );
    SVS(
        ["calculation","current_weight"],
        GVS(["basic","default","weight"])
    )

    //add palette preview section
    create_sample_display(id_tag);
    populate_rule_content();
    SVS(["action","active_rule_id"],id_tag);
    GVS(["valid_rule_id"]).add(id_tag);
    GVS(["result"])[id_tag]=get_rule_values_by_id(id_tag);
    if(!GVS(["action","palette_active"])){
        display_palette_div();
        populate_preview_color()
    }
}
function remove_rule(id_tag){
    //RULE CT WILL NOT RESET
    //reset current keys and graphics
    //reset defaults
    extract_and_reset_rule(id_tag);
    //delete the rule div
    let rule_div=document.getElementById(
        `rule_${id_tag}`
    )
    rule_div.parentElement.removeChild(rule_div);
    let r=GVS(
        ["result"]
    )
    //remove rules
    r[id_tag]=null;//set the result as null.
    remove_sample_display(id_tag);
    IIS(["basic","valid_rule_ct"],-1);
    if(GVS(["basic","valid_rule_ct"])<1){
        hide_palette_div();
    }
    //remove the sample_div
    let sd=document.getElementById(`sample_display_${id_tag}`);
    sd.parentElement.removeChild(sd);
    GVS(["valid_rule_id"]).remove(id_tag);
}

function export_rules(){
    let valid_rule_id=GVS(["valid_rule_id"]);
    let rules={};
    let rule_simulates={};
    valid_rule_id.forEach(
        function (id){
            rules[id]=GVS(["result"])[id]
            rule_simulates[id]=GVS(["sim_result"])[id]
        }
    )
    return {
        "rules":rules,
        "rule_simulates":rule_simulates
    }
}
function draw_preview_color(){
    /**
     * Picking colors fill a 10 by 10 grid.
     * Utilize all existing tools
     */
    let er=export_rules()
    let pcr=GVS(["calculation","preview_col_row"]);
    let draw_ct=pcr[0]*pcr[1];
    return draw_colors_from_rules(er["rules"],er["rule_simulates"],draw_ct)
}

function generate(){
    init_popup();
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
    // addBackgroundRectangle(document.getElementById("combo_g"));
    update_all_svg_size();
    let combo_selector=document.getElementById("combo_g");
    SVS(["structure","combo_g"],combo_selector);
    update_element_attribute(combo_selector,{"class":"init_new_rule"})

    //add light bar

    //make gradient
    make_gradient();
    add_gradient_interaction();

    //palette rectangles
    init_preview_rects();

    SVS(["structure","warning_div"],document.getElementById("warning_div"));
    // SVS(["structure","warning_div"],document.getElementById("warning_div"));
    adjust_rule_status();

    // init_palette_div();
    //add preview_interaction
    init_palette_preview_interaction();
}
//responsive
window.addEventListener("resize",()=>resize())
window.addEventListener('load', function () {
    adjust_window_size();
    generate()
})