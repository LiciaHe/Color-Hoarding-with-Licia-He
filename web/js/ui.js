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

function create_filter_checkbox(section_label_text,id,options){
    let storage_div=create_element_with_attribute("div",{"class":"filter_div","id":`${id}_div`});
    let section_label=create_element_with_attribute("label",{"class":section_title,"id":`${id}_section_label`});
    section_label.innerText=section_label_text;
    let filter_option_div=create_element_with_attribute("div",{"class":"filter_options","id":`${id}_option_div`});
    storage_div.appendChild(section_label);
    storage_div.appendChild(filter_option_div);
    for (let i=0;i<options;i++){
        let input=create_element_with_attribute(
            "input",
            {
                "type":"checkbox",
                "id":`${id}_${options[i]}`,
                "name":options[i],
                "value":options[i]
            }
        );
        let label=create_element_with_attribute(
            "label",
            {
                "for":`${id}_${options[i]}`,
            }
        )
        label.innerText=options[i];
        filter_option_div.appendChild(input);
        filter_option_div.appendChild(label);
    }


}

function init_filter_popup(){
    //add filters for brand, type, hue (10 category)
    document.getElementById("popuptitle").innerText="Add Filters";

    document.getElementById("popuptitle").innerText="Add Filters"

}
function populate_popup(){

}