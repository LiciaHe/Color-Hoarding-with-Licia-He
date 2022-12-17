function update_element_attribute(element,attrDict) {
    for (let key in attrDict){
        element.setAttribute(key,attrDict[key]);
    }
}
function create_element_with_attribute(element_name,attrDict){
    let e=document.createElement(element_name);
    update_element_attribute(e,attrDict);
    return e
}
function hsl_to_rgb(h,s,l){
    /*
    hsl is 0-1 based
    RGB IS 255
     */

    let  r, g, b;

    if(s === 0){
        r = g = b = l;
    }else{
        let hue2rgb = function(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);

    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];

}


function download_svg(content,save_name){
    let svgData = content.outerHTML;
    let svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `${save_name}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}