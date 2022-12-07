function make_gradient(){
    let svg_selector=document.getElementById("combo_g");
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
    // let active_rule_id=GVS(["action","active_rule_id"]);
    // if (active_rule_id!==null &&active_rule_id!==undefined&& active_rule_id!==id_tag){
    //     //fold previous rule
    //     console.log(GVS(["action","active_rule_id"]),id_tag)
    //     fold_rule_by_id(GVS(["action","active_rule_id"]));
    // }

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
    // let rule_value_container=GVS(["result"]);
    // rule_value_container[]=null;//add null value as a place holder.
    //add palette preview section
    create_sample_display(id_tag);

    populate_rule_content();
    SVS(["action","active_rule_id"],id_tag);
    GVS(["valid_rule_id"]).add(id_tag);
    GVS(["result"])[id_tag]=extract_and_reset_rule(id_tag);
    if(!GVS(["action","palette_active"])){
        display_palette_div();
        draw_preview_color();
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
function draw_preview_color(){
    /**
     * Picking colors fill a 10 by 10 grid.
     * Utilize all existing tools
     */
    let valid_rule_id=GVS(["valid_rule_id"]);
    let draw_result=[];//choose rules
    let id_ordered=[]
    let weight_ordered=[]
    let id_color_ct={}
    valid_rule_id.forEach(
        function (id){
            let weight_range=GVS(["result"])[id]["weight"];
            let w=Math.floor(random_in_range(weight_range));
            id_ordered.push(id)
            weight_ordered.push(w)
            id_color_ct[id]=GVS(['sim_result'])[id].length;
        }
    )
    console.log(id_ordered,weight_ordered)
    let ct={}
    for (let i=0;i<100;i++){
        let rule_id=chooseWithWeight(
            id_ordered,
            weight_ordered
        );
        let color_rg=[0,id_color_ct[rule_id]];
        let color_id=Math.floor(random_in_range(color_rg));
        if (ct[rule_id]){
            ct[rule_id]+=1
        }else{
            ct[rule_id]=1
        }
        let hex=GVS(['sim_result'])[rule_id][color_id];
        draw_result.push([rule_id,color_id,hex])
    }
    console.log(ct)
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
    let combo_selector=document.getElementById("combo_g");
    SVS(["structure","combo_g"],combo_selector);
    update_element_attribute(combo_selector,{"class":"init_new_rule"})

    //add light bar

    //make gradient
    make_gradient();
    add_gradient_interaction();

    SVS(["structure","warning_div"],document.getElementById("warning_div"));
    // SVS(["structure","warning_div"],document.getElementById("warning_div"));
    adjust_rule_status();

    // init_palette_div();
    //add preview_interaction
    init_palette_preview_interaction()
}
//responsive
window.addEventListener("resize",()=>resize())
window.addEventListener('load', function () {
    adjust_window_size();
    generate()
})