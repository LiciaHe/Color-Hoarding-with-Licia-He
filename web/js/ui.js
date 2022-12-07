function set_popup_scale() {

    let popup=document.getElementById("popup");
    let w,h,left,top,window_w,window_h;
    window_w = window.innerWidth;
    window_h = window.innerHeight;

    const attr={
        "style":`height:${h}px;left:${left}px;top:${top}px;width:${w}px;display:${window.popupDisplay}`
    }
    update_element_attribute(popup,attr);
}

function hidePopup() {
    window.popupDisplay="none";
    document.getElementById("popup").style.display=window.popupDisplay;
}

function showPopup() {
    window.popupDisplay="block";
    document.getElementById("popup").style.display=window.popupDisplay;
}

function display_filter(){
    init_filter_popup();
    showPopup()
}

function init_popup(){
    window.popupDisplay="none";
    document.getElementById("filter_btn").addEventListener("click",display_filter);
    document.getElementById("closebtn").addEventListener("click",hidePopup);
}

function create_drop_down(label_name,id,options){

    let label=create_element_with_attribute(
        "label",{
            "for":`${id}`,
            "id":`${id}_label`
        }
    )
    label.innerText=label_name;
    let select=create_element_with_attribute(
        "select",{
            "name":`${id}`,
            "id":`${id}_select`
        }
    );
    for (let i=0;i<options.length;i++){
        let option=create_element_with_attribute("option",{"value":options[i]});
        option.innerText=options[i];
        select.appendChild(select);
    }
    let div=create_element_with_attribute("div",{});
    div.appendChild(label);
    div.appendChild(select);
    return div
}
function create_colored_div_checkbox(section_label_text,id,options,option_rgb){
    let storage_div=create_element_with_attribute("div",{"class":"filter_div","id":`${id}_div`});
    let section_label=create_element_with_attribute("label",{"class":"section_title","id":`${id}_section_label`});
    section_label.innerText=section_label_text;
    let filter_option_div=create_element_with_attribute("div",{"class":"filter_options","id":`${id}_option_div`});
    storage_div.appendChild(section_label);
    storage_div.appendChild(filter_option_div);
    for (let i=0;i<options.length;i++){
        let il_div=create_element_with_attribute("div",{})
        let input=create_element_with_attribute(
            "input",
            {
                "type":"checkbox",
                "id":`${id}_${options[i]}`,
                "name":options[i],
                "value":options[i]
            }
        );
        input.checked=true;
        let label=create_element_with_attribute(
            "label",
            {
                "for":`${id}_${options[i]}`,
                "class":"filter_color_block",
                "style":`background-color:rgb(${option_rgb[i]});padding:10px;`
            }
        )
        // label.innerText=options[i];
        il_div.appendChild(input);
        il_div.appendChild(label);
        filter_option_div.appendChild(il_div);
    }
    return storage_div
}
function create_filter_checkbox(section_label_text,id,options){
    let storage_div=create_element_with_attribute("div",{"class":"filter_div","id":`${id}_div`});
    let section_label=create_element_with_attribute("label",{"class":"section_title","id":`${id}_section_label`});
    section_label.innerText=section_label_text;
    let filter_option_div=create_element_with_attribute("div",{"class":"filter_options","id":`${id}_option_div`});
    storage_div.appendChild(section_label);
    storage_div.appendChild(filter_option_div);
    for (let i=0;i<options.length;i++){
        let il_div=create_element_with_attribute("div",{})
        let input=create_element_with_attribute(
            "input",
            {
                "type":"checkbox",
                "id":`${id}_${options[i]}`,
                "name":options[i],
                "value":options[i]
            }
        );
        input.checked=true;
        let label=create_element_with_attribute(
            "label",
            {
                "for":`${id}_${options[i]}`,
            }
        )
        label.innerText=options[i];
        il_div.appendChild(input);
        il_div.appendChild(label);
        filter_option_div.appendChild(il_div);
    }
    return storage_div
}

function init_filter_popup(){
    //add filters for brand, type, hue (10 category)
    // document.getElementById("popuptitle").innerText="Add Filters";
    let keys=["Type","Brand"];
    let popup_storage=document.getElementById("currentInfo");
    //generate hsl lst
    let hsl_options=[];
    let hsl_options_rgb=[];
    for (let i=0;i<10;i++){
        hsl_options.push(i);
        hsl_options_rgb.push(hsl_to_rgb(i*0.1,0.5,0.5));
    }
    popup_storage.appendChild(
        create_colored_div_checkbox(
            "Hue",
            `filter_Hue`,
            hsl_options,
            hsl_options_rgb
        )
    );


    for (let i=0;i<2;i++){
        // section_label_text,id,options
        window.collection[keys[i].toLowerCase()].sort();
        let div= create_filter_checkbox(
            keys[i],
            `filter_${keys[i]}`,
            window.collection[keys[i].toLowerCase()]
        )
        popup_storage.appendChild(div);
    }

    let submit_btn=create_element_with_attribute(
        "button",{"id":"filter_btn"}
    )
    popup_storage.appendChild(submit_btn);
    submit_btn.innerText="Update Filter"
    submit_btn.addEventListener("click",update_filter);
}
function populate_popup(){

}

function update_filter(){
    console.log("todo, update filter")
}

function adjust_swatch_view_size(entry){
    /**
     * get the current main content height, set the correct size for full content
     */
    let hor_containter=document.getElementById("information");
    console.log(window.innerHeight)
    let current_height=hor_containter.clientHeight;

    let fc=document.getElementById("full_content");
    let target_height=window.innerHeight-current_height
    fc.setAttribute("style",`height:${target_height}px`);

    let  option_height=document.getElementById("options").clientHeight;
    let svheight=target_height-option_height;
    document.getElementById("swatch-view").style.height=`${svheight}px`;
    console.log(entry)
    let r1,g1,b1=entry["rgbs"][0];
    console.log(entry["rgbs"][0])
    document.getElementById("swatch").setAttribute("style",`height:${svheight}px;background-color:rgb(${r1},${g1},${b1})`);

    let r2,g2,b2=entry["rgbs"][1];
    document.getElementById("color-view").setAttribute("style",`height:${svheight}px;;background-color:rgb(${r2},${g2},${b2})`);


    // console.log(window.innerHeight,current_height,target_height)
    // console.log()

}
function set_bg_color(entry){
    let sw=document.getElementById("swatch");
    let cv=document.getElementById("color-view");
    sw.style.backgroundColor=entry["rgbs"][0];
    cv.style.backgroundColor=entry["rgbs"][1];
    console.log(sw)
}