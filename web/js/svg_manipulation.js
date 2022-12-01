function addSVGElementToParent(element_name,attribute_dict,parent) {

    const element=document.createElementNS(window.svgns,element_name);
    for (let key in attribute_dict){
        element.setAttribute(key,attribute_dict[key]);
    }
    parent.appendChild(element);
    return element
}
function addElementToSvg(element_name,attribute_dict,svg_group_selector){
    return  addSVGElementToParent(element_name,attribute_dict, svg_group_selector)
}

function addBackgroundRectangle(svg_selector) {
    return addElementToSvg(
        "rect",
        {
        "width":"100%",
        "height":"100%",
        "style":"fill:white;stroke-width:1;stroke:none",
        "x":0,
        "y":0
        },
        svg_selector
    )
}


function initSVG(svg_id,svg_w,svg_h){
    /*
    Use existing info to modify the svg property
     */

    // window.svg=document.getElementById("main_svg");
    // window.main_g=document.getElementById("main_g");
    // window.defs=document.getElementById("svg_defs");
    let svg_selector=document.getElementById(svg_id);
    const default_attrs={
        "width":"100%",
        "height":"100%",
        "viewBox":`0 0 ${svg_w} ${svg_h}`,
        "xmlns":window.svgns,
        "xmlns:xlink":"http://www.w3.org/1999/xlink",
        "preserveAspectRatio":"xMidYMid meet"
    }
    for (let key in default_attrs){
        svg_selector.setAttribute(key,default_attrs[key]);
    }
    return svg_selector

}
window.svgns="http://www.w3.org/2000/svg";

