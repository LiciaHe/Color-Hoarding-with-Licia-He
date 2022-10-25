function update_element_attribute(element,attrDict) {
    for (let key in attrDict){
        element.setAttribute(key,attrDict[key]);
    }
}
function create_element_with_attribute(element_name,attrDict){
    let e=document.createElement(element_name);
    update_element_attribute(e);
    return e
}