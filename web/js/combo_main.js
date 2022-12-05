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
function add_grayscale_bar(){
    //get graybar location
    let gray_c=document.getElementById("grayscale_container");
    let gray_svg=document.getElementById("grayscale_svg");
    SVS(["structure","gray_c_bbox_top"],gray_c.getBoundingClientRect().top);
    SVS(["structure","gray_c_height"],gray_c.clientHeight);

    let attr= {
        "x1":"2%",
        "x2":"96%",
        "y1":`${GVS(["calculation","current_light_lower"])}%`,
        "y2":`${GVS(["calculation","current_light_lower"])}%`,
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
    attr["y1"]=`${GVS(["calculation","current_light_upper"])}%`
    attr["y2"]=`${GVS(["calculation","current_light_upper"])}%`
    attr["id"]="1_graybar"
    let b2=addElementToSvg(
        "line",attr,gsg
    )

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
    let svg_selector=document.getElementById("combo_g");
    svg_selector.addEventListener("mousedown",(e)=start_selecting_gradient)
    svg_selector.addEventListener("mousemove",drag_through_gradient)
    svg_selector.addEventListener("mouseup",end_gradient)
    svg_selector.addEventListener("mouseleave",end_gradient)
}
function create_rule_container(){
    let action_a=document.getElementById("action-area");
    let id_tag=GVS(["basic","rule_ct"])-1;
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
    }
    rule_div.appendChild(btn);
    let rc=create_element_with_attribute(
        "div",
        {
            "class":"rule_content",
            "id":`rule_content_${id_tag}`
        })
    rule_div.appendChild(rc);
    // btn.addEventListener("click",toggle_collapse);
    return [rc,id_tag]
}
function create_rule_content(rc_id_tag){
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
    let rc=rc_id_tag[0];
    let id_tag=rc_id_tag[1];
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
function init_new_rule(){
    /**
     * Given the current hsl, init a new rule form.
     */

    let rc_id_tag=create_rule_container();
    create_rule_content(rc_id_tag);
    //create the inner structures
    //populate rule content
    //default content
    SVS(
        ["calculation","current_pick_number"],
        [1,5]
    );
    SVS(
        ["calculation","current_weight"],
        [1,1]
    )
    populate_rule_content();
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
    pass_hue_saturation_information(id_tag)

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

    //hint text

}
function adjust_hint_text(e){
    let warning=GVS(["structure","warning_div"]);
    let default_text=`Finalize Rule ${GVS(["basic","rule_ct"])} before adding another.`;
    let text=default_text;
    // let default_text;
    if (GVS(["action","pending_rule"])){
        if (e){
            if (e.type==="mouseover"){
                let parent=e.target.parentElement.parentElement;
                let pc=parent.getAttribute("class");
                if (pc==="collapsible"){
                    // console.log(e.target.getAttribute("class"))
                    text=GVS(["view","rule_action_hint_text"])[e.target.parentElement.getAttribute("class")]
                }
                else{
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

//responsive
window.addEventListener("resize",()=>resize())
window.addEventListener('load', function () {
    adjust_window_size();
    generate()
})