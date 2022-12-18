function update_gray_bar_attr(){
    let b0=document.getElementById('0_graybar');
    let b1=document.getElementById('1_graybar');
    if(GVS(["calculation","current_light_lower"])===null){
        SVS(
            ["calculation","current_light_lower"],
            GVS(["basic","default","current_light_lower"])
        )
    }
    if(GVS(["calculation","current_light_upper"])===null){
        SVS(
            ["calculation","current_light_upper"],
            GVS(["basic","default","current_light_upper"])
        )
    }
    update_element_attribute(
        b0,{
            "y1":`${GVS(["calculation","current_light_lower"])}%`,
            "y2":`${GVS(["calculation","current_light_lower"])}%`,
        }
    )
    update_element_attribute(
        b1,{
            "y1":`${GVS(["calculation","current_light_upper"])}%`,
            "y2":`${GVS(["calculation","current_light_upper"])}%`,
        }
    )
}
function add_grayscale_bar(){
    //get graybar location
    let gray_c=document.getElementById("grayscale_container");
    let gray_svg=document.getElementById("grayscale_svg");
    SVS(["structure","gray_c_bbox_top"],gray_c.getBoundingClientRect().top);
    SVS(["structure","gray_c_height"],gray_c.clientHeight);

    let attr= {
        "x1":"2%",
        "x2":"96%",
        // "y1":`${GVS(["calculation","current_light_lower"])}%`,
        // "y2":`${GVS(["calculation","current_light_lower"])}%`,
        // "style":"fill:white;stroke-width:1;stroke:none",
        "stroke":"yellow",
        "stroke-width":"4%",
        "id":"0_graybar",
        "class":"grayscale_bar"
    }
    let gsg=document.getElementById("grayscale_g");
    addElementToSvg(
        "line",attr,gsg
    )

    attr["id"]="1_graybar"
    addElementToSvg(
        "line",attr,gsg
    )
    update_gray_bar_attr();
    // for (let i=0;i<2;i++){
    //     let item=[b1,b2][i];
    //     item.addEventListener("mousedown",(e)=start_drag_bar)
    //     item.addEventListener("mousemove",drag_bar)
    //     item.addEventListener("mouseup",endDrag)
    //     item.addEventListener("mouseleave",endDrag)
    // }
    gray_svg.addEventListener("mousedown",(e)=start_drag_bar)
    gray_svg.addEventListener("mousemove",drag_bar)
    gray_svg.addEventListener("mouseup",end_drag_bar)
    // gray_svg.addEventListener("mouseleave",end_drag_bar)

    // gray_bar.addEventListener("dragend",(e)=>console.log(e))
    // gray_bar.addEventListener("mouseenter",(e)=>console.log(e))

}



function update_lightness(){
    // given a new lightness level, update the color
    let svg_selector=document.getElementById("combo_g");
    let children=document.getElementsByClassName("gradient_rect");

    for (let ci=0;ci<children.length;ci++){
        let rect=children[ci];
        let ids=rect.getAttribute("id").split("_");
        let i=parseInt(ids[1]);
        let j=parseInt(ids[2]);
        let hex=hslToHex(
            360/GVS(["calculation","hue_break"])*(i),
            // 100,
            100/GVS(["calculation","saturation_break"])*(j),
            parseInt((GVS(["calculation","current_light_lower"])+GVS(["calculation","current_light_upper"]))/2)
        )

        update_element_attribute(rect,{"fill":hex,"stroke":hex});
    }
}
function add_gradient_interaction(){
    let svg_selector=document.getElementById("color_combo_svg");
    svg_selector.addEventListener("mousedown",(e)=start_selecting_gradient)
    svg_selector.addEventListener("mousemove",drag_through_gradient)
    svg_selector.addEventListener("mouseup",end_gradient)
    svg_selector.addEventListener("mouseleave",end_gradient)
}

function create_rule_container(id_tag){
    let action_a=document.getElementById("action-area");

    let rule_div=create_element_with_attribute(
        "div",
        {
            "class":"rule",
            "id":`rule_${id_tag}`
        }
    )
    action_a.appendChild(rule_div);
    let btn=create_element_with_attribute(
        "div",
        {
            "class":"collapsible",
            "id":`btn_r_${id_tag}`
        });
    //add 3 divs
    let btn_content=[
        [`Rule ${id_tag}`,"coll_rule"],
        ["&#128473;","coll_close"],
        ["&#129514;","coll_test"],
        ["&#10004;","coll_finalize"],
    ];
    for (let i=0;i<btn_content.length;i++){
        let btn_div=create_element_with_attribute(
            "div",
            {"class":btn_content[i][1]}
        );
        btn_div.innerHTML=`<span>${btn_content[i][0]}</span>`;
        btn.appendChild(btn_div);
        btn_div.addEventListener("mouseover",adjust_hint_text);
        btn_div.addEventListener("mouseout",adjust_hint_text);
        btn_div.addEventListener("click",rule_action_clicked);
    }
    rule_div.appendChild(btn);
    let rc=create_element_with_attribute(
        "div",
        {
            "class":"rule_content",
            "id":`rule_content_${id_tag}`
        })
    rule_div.appendChild(rc);
    //testing area
    let test_div=create_element_with_attribute(
        "div",
        {
            "class":"rule_test_mini",
            "id":`rule_test_m_${id_tag}`
        }
    )
    rule_div.appendChild(test_div);
    // btn.addEventListener("click",toggle_collapse);
    return rc
}
function create_rule_content(rc,id_tag){
    /**
     * go through the rule content to create  individual div
     */
    let rules_template=[
        [
            ["s","Hue Range: "],
            ["i",[0,359]],
            ["p"," to "],
            ["i",[0,359]],
        ],
        [
            ["s","Saturation Range: "],
            ["i",[0,99]],
            ["p"," to "],
            ["i",[0,99]],
        ],
        [
            ["s","Lightness Range: "],
            ["i",[0,99]],
            ["p"," to "],
            ["i",[0,99]],
        ],
        [
            ["s","Pick "],
            ["i",[0,99]],
            ["p"," to "],
            ["i",[0,99]],
            ["s"," color from this rule."],
        ],
        [
            ["s","Rule Weight: "],
            ["i",[0,99]],
            ["p"," to "],
            ["i",[0,99]],
        ]
    ];

    // console.log(rc,id_tag)
    for (let i=0;i<rules_template.length;i++){
        let rules=rules_template[i];
        let div=create_element_with_attribute(
            "div",
            {
                "id":`rcd_${id_tag}_${i}`
            }
        )
        rc.appendChild(div);
        let content;
        for (let j=0;j<rules.length;j++){
            let rule=rules[j];
            if(rule[0]==="s"){
                content=create_element_with_attribute(
                    "span",
                    {
                        "class":`rule_hint rcs_${i}`
                    }
                )
                content.innerText=rule[1];
                content.addEventListener("mouseover",adjust_hint_text);
                content.addEventListener("mouseout",adjust_hint_text);

            }else if (rule[0]==="i"){
                content=create_element_with_attribute(
                    "input",
                    {
                        "type":"number",
                        "min":rule[1][0],
                        "max":rule[1][1],
                    }
                )
                content.addEventListener("change",update_rule_from_form)
            }else{
                content=create_element_with_attribute(
                    "span",
                    {
                    }
                )
                content.innerText=rule[1]
            }
            div.appendChild(content)
        }
    }
}

function pass_lightness_information(id_tag){
    let b0=document.getElementById("0_graybar");
    let b1=document.getElementById("1_graybar");

    let l_percs=[
        remove_percentage(b0.getAttributeNS(null,"y1")),
        remove_percentage(b1.getAttributeNS(null,"y1")),
    ];
    l_percs.sort((a,b)=>a-b);
    let lightness_id=2;
    let rule_content_div=document.getElementById(
        `rcd_${id_tag}_${lightness_id}`
    )
    let inputs=rule_content_div.getElementsByTagName("input");
    for (let i=0;i<inputs.length;i++){
        inputs[i].value=l_percs[i].toFixed(1)
    }
}
function pass_hue_saturation_information(id_tag){
    let rect_rule=GVS(["structure","current_rect_rule"]);
    let rect_attr=extract_rect_attr(rect_rule);
    let h_s=convert_rect_attr_to_hs_range(rect_attr);
    h_s["pick"]=GVS(["calculation","current_pick_number"]);
    h_s["weight"]=GVS(["calculation","current_weight"]);
    let keys=[
        ["hue",0],
        ["saturation",1],
        ["pick",3],
        ["weight",4],
    ]
    for (let i=0;i<keys.length;i++){
        let value=h_s[keys[i][0]];
        value.sort((a,b)=>a-b);
        let id=keys[i][1]
        let rule_content_div=document.getElementById(
            `rcd_${id_tag}_${id}`
        )
        let inputs=rule_content_div.getElementsByTagName("input");

        for (let j=0;j<inputs.length;j++){
            let v;
            if (i<2){

                v=value[j].toFixed(1)
            }else{
                v=parseInt(value[j]);
            }
            inputs[j].value=v;
        }
    }
}
function populate_color_div(div_id,id_tag){
    let sr_hexs=GVS(["sim_result"])[id_tag];
    let div=document.getElementById(`${div_id}_${id_tag}`);
    let color_blocks=Array.from(div.getElementsByTagName("div"));

    for (let i=0;i<sr_hexs.length;i++){
        if (i>=color_blocks.length){
            //create new div
            let new_div=create_element_with_attribute(
                "div",
                {
                    "style":`background-color:${sr_hexs[i]};`
                }
            )
            div.appendChild(new_div)
        } else{
            let div=color_blocks.pop();
            update_element_attribute(
                div,
                {
                    "style":`background-color:${sr_hexs[i]};`
                }
            )
        }
    }
    while(color_blocks.length>0){
        div.removeChild(color_blocks.pop())
    }
}
function populate_simulation(id_tag){
    //generate from rules
    //append div
    let rule_values=get_rule_values_by_id(id_tag);
    let simulate_results_hsl=run_single_rule_simulation(rule_values);
    let sr_hexs=simulate_results_hsl.map((hsl)=>hslToHex(...hsl));

    //store the sr_hexes
    GVS(["sim_result"])[id_tag]=sr_hexs;
    // let rule_test_div=document.getElementById(`rule_test_m_${id_tag}`);


    populate_color_div("rule_test_m",id_tag);
    populate_color_div("sample_div",id_tag);


    //will trigger preview change
    if(GVS(["valid_rule_id"]).size>0){
        populate_preview_color()
    }
}
function populate_rule_content(){
    /**
     * extract hsl information from the current rect
     */
    let id_tag=GVS(["basic","rule_ct"])-1;
    let current_rule_div=document.getElementById(`rule_${id_tag}`);
    if (!current_rule_div){
        return
    }
    pass_lightness_information(id_tag);
    pass_hue_saturation_information(id_tag);
    populate_simulation(id_tag);
}

function display_palette_div(){
    /**
     * put "palette_active"in the class
     */
    if (GVS(["structure","palette_active"])){
        //already active
        return
    }
    let palette_div=document.getElementById("palette");
    palette_div.setAttribute("class","palette_active flex_display");

    SVS(["structure","palette_active"],true);
    resize();
}
function hide_palette_div(){
    /**
     * modify palette and preview_svg_container
     */
    document.getElementById("palette").setAttribute("class","");
    SVS(["structure","palette_active"],false);
    resize();
}
function fold_rule_by_id(id_tag){
    update_lightness();
    let btn_div=document.getElementById(`btn_r_${id_tag}`);
    if(btn_div.getAttribute("class").includes("fold")){
        //already folded
        return
    }
    let rc=document.getElementById(`rule_content_${id_tag}`);
    let rtm=document.getElementById(`rule_test_m_${id_tag}`);
    //this rule has to be active

    GVS(["valid_rule_id"]).add(id_tag);
    GVS(["result"])[id_tag]=extract_and_reset_rule(id_tag);

    update_element_attribute(btn_div,{"class":"collapsible fold"});
    let fold_span=btn_div.getElementsByClassName("coll_finalize")[0].getElementsByTagName("span")[0];

    fold_span.innerHTML=GVS(["basic","default","expand_icon"]);
    let hidden_tags=["coll_close","coll_test"];
    for (let i=0;i<hidden_tags.length;i++){
        let action_div=btn_div.getElementsByClassName(hidden_tags[i])[0];
        update_element_attribute(action_div,
            {"class":`${hidden_tags[i]} hidden`}
        )
    }


    update_element_attribute(btn_div,{"class":"collapsible fold"})
    for (let i=0;i<2;i++){
        let elem=[rc,rtm][i];
        let c=elem.getAttribute("class");
        update_element_attribute(
            elem,
            {"class":`${c} fold_content`}
        )
    }


}
function update_visual_by_values(value,id_tag){
    /**
     * given a set of values, update the bar, hidden values, and construct the rectangles
     */
    SVS(["calculation","current_light_lower"],value["lightness"][0]);
    SVS(["calculation","current_light_upper"],value["lightness"][1]);
    update_gray_bar_attr();
    update_lightness();
    //h_sat
    let start_attr={
        "x":`${value["hue"][0]/360*100}%`,
        "width":`${(value["hue"][1]-value["hue"][0])/360*100}%`,
        "y":`${(value["saturation"][0])}%`,
        "height":`${(value["saturation"][1]-value["saturation"][0])}%`
    }

    start_attr["id"]=`rule_fill${id_tag}`
    start_attr["class"]="rule_rect_fill rule_rect_fill_pending"

    SVS(["structure","current_rect_rule_fill"],addElementToSvg(
        "rect", start_attr,
        document.getElementById("combo_g")
    ))

    start_attr["id"]=`rule_rect_${id_tag}`
    start_attr["class"]="rule_rect rule_rect_pending"

    SVS(["structure","current_rect_rule"],addElementToSvg(
        "rect", start_attr,
        document.getElementById("combo_g")
    ))
    SVS(["action","pending_rule"],true);
}

function adjust_hint_text(e){
    let warning=GVS(["structure","warning_div"]);
    let default_text=`Finalize Rule ${GVS(["action","active_rule_id"])} before adding another.`;
    let text=default_text;
    // let default_text;
    if (GVS(["action","pending_rule"])){
        if (e){
            if (e.type==="mouseover"){
                let parent=e.target.parentElement.parentElement;
                let pc=parent.getAttribute("class");
                if (pc.includes("collapsible")){
                    // console.log(e.target.getAttribute("class"))
                    text=GVS(["view","rule_action_hint_text"])[e.target.parentElement.getAttribute("class")]
                }
                else{
                    // console.log(e.target.getAttribute("class"));
                    let c_lst=e.target.getAttribute("class").split("_");

                    let id=parseInt(c_lst[c_lst.length-1]);
                    text=GVS(["view","hint_texts"])[id];
                }
            }
        }
        if (text===undefined){
            text=default_text;
        }
    }else{
        text=`Drag through the canvas to initialize a color rule.`
    }
    warning.innerText=text;

}

function adjust_rule_status(){
    // using the current status to adjust whether the rectrangle is editable
    //status: pending, new,

    let combo_selector=document.getElementById("combo_g");
    if (GVS(["action","pending_rule"])){
        /**
         * PENDING, CAN DRAG TO IMPROVE
         */
        update_element_attribute(combo_selector,{"class":"disable_new_rules"})
    }
    adjust_hint_text();
}

function extract_and_reset_rule(id_tag){
    /**
     * extract all info from the current rule div, reset all value to default
     * doesn't touch the rule form.
     */
    let value=get_rule_values_by_id(id_tag);
    let default_reset=[
        [["calculation","current_light_upper"],["basic","default","current_light_upper"]],
        [["calculation","current_light_lower"],["basic","default","current_light_lower"]],
    ];
    for (let i=0;i<default_reset.length;i++){
        let d=GVS(default_reset[i][1]);

        SVS(default_reset[i][0],d)
    }
    update_gray_bar_attr();
    //clean up the rectangles
    let parent_clean=[
        ["structure","current_rect_rule"],
        ["structure","current_rect_rule_fill"],

    ];
    for (let i=0;i<parent_clean.length;i++){
        let s=GVS(parent_clean[i]);
        s.parentElement.removeChild(s);
        SVS(
            parent_clean[i],null
        )
    }
    let null_reset=[
        ["action","pending_rule"],
        ["action","start_drag_rect"],
        ["structure","start_rect"],
        ["action","gradient_dragged"]
    ]
    for (let i=0;i<null_reset.length;i++){
        SVS(
            null_reset[i],null
        )
    }
    adjust_hint_text();
    SVS(["action","active_rule_id"],null);
    return value
}
function toggle_rule_form(id_tag,e){
    //toggle
    /**
     * check of the
     * @type {{}}
     */
    let btn_div=e.target.parentElement.parentElement;
    let btn_div_class=btn_div.getAttribute("class");

    if (btn_div_class.includes("fold")){
        //expand
        let active_rule_id=GVS(["action","active_rule_id"]);
        if (active_rule_id!==null &&active_rule_id!==undefined&& active_rule_id!==id_tag){
            //fold previous rule
            fold_rule_by_id(GVS(["action","active_rule_id"]));
        }
        expand_rule_by_id(id_tag);
    }else{
        fold_rule_by_id(id_tag);
    }


}
function expand_rule_by_id(id_tag){
    let rc=document.getElementById(`rule_content_${id_tag}`);
    let rtm=document.getElementById(`rule_test_m_${id_tag}`);
    let btn_div=document.getElementById(`btn_r_${id_tag}`)
    //set the current active
    SVS(["action","active_rule_id"],id_tag);
    SVS(["action","pending_rule"],true);

    //update span icon
    let fold_span=btn_div.getElementsByClassName("coll_finalize")[0].getElementsByTagName("span")[0];
    fold_span.innerHTML=GVS(["basic","default","finalize_icon"]);
    //update other span
    let hidden_tags=["coll_close","coll_test"];
    for (let i=0;i<hidden_tags.length;i++){
        let action_div=btn_div.getElementsByClassName(hidden_tags[i])[0];
        update_element_attribute(action_div,
            {"class":`${hidden_tags[i]}`}
        )
    }

    //update content class (remove folded)
    for (let i=0;i<2;i++){
        let elem=[rc,rtm][i];
        let c=elem.getAttribute("class");
        update_element_attribute(
            elem,
            {"class":c.split(" ")[0]}
        )
    }

    //remove fold  from btn class
    update_element_attribute(btn_div,{"class":"collapsible"})

    //restore rectangle and bar
    let values=GVS(["result"])[id_tag];
    update_visual_by_values(values,id_tag);

}

function redraw_palette(){
    let valid_id=GVS(["valid_rule_id"]);
    valid_id.forEach(
        (id)=>populate_simulation(id)
    )
    populate_preview_color();
}
function download_palette(){
    /**
     * Export the following information in a popup window
     *
     */
    let rules=export_rules();
    let pretty_print=JSON.stringify(rules, undefined, 1);
    let reg1=/\n\s\s\s+/igm;
    pretty_print=pretty_print.replace(reg1,"");
    pretty_print=pretty_print.replace(/\n\s+\},/igm,"},");
    pretty_print=pretty_print.replace(/\n\s+\}/igm,"}");
    pretty_print=pretty_print.replace(/\n\s+\],/igm,"],");
    pretty_print=pretty_print.replace(/\n\s+\]/igm,"]");
    // pretty_print=pretty_print.replace(/\n\s\s/igm," ");
    let content=`let rules=${pretty_print};`
    document.getElementById("download_text_area").innerHTML=content
    showPopup();
}
function copy_result(){
    let text_area=document.getElementById("download_text_area").innerHTML;
    navigator.clipboard.writeText(text_area);

}
function redraw_preview(){
    populate_preview_color();
}
function download_preview(){
    let copy_svg=document.getElementById("preview_svg");
    download_svg(copy_svg,"color_combo");
}

function init_preview_rects(){
    /**
     * initiate rectangles in the preview svg
     */
    let pcr=GVS(["calculation","preview_col_row"]);
    let w=100/pcr[0];
    let h=100/pcr[0];
    let attr={
        "width":`${w}%`,
        "height":`${h}%`,
        "class":"preview_block"
    }
    let selector=document.getElementById("preview_g");
    let idx=0
    for (let i=0;i<pcr[1];i++){
        let y=i*h;
        for (let j=0;j<pcr[0];j++){
            let x=j*w;
            attr["id"]=`preview_block_${idx}`;
            attr["x"]=`${x}%`;
            attr["y"]=`${y}%`;
            let rect=addElementToSvg(
                "rect",
                attr,
                selector
            )
            idx+=1
            rect.addEventListener("mouseenter",link_preview_highlight)
            rect.addEventListener("mouseleave",unlink_preview_highlight)
        }
    }

}
function populate_preview_color(){
    let draw_result=draw_preview_color();
    SVS(["preview_result"],draw_result);
    let rects=document.getElementsByClassName("preview_block");
    for (let i=0;i<rects.length;i++){
        let r=rects[i];
        let id_l=r.getAttribute("id").split("_");
        let idx=id_l[id_l.length-1];
        let hex=draw_result[idx][2];
        update_element_attribute(r,
            {
                "fill":hex,
                "stroke":hex,
                "info":`${draw_result[idx][0]}_${draw_result[idx][1]}_${draw_result[idx][2]}`
            })
    }
}


