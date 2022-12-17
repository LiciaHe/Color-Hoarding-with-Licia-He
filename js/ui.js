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
    SVS(["action","popupDisplay"],false);
    document.getElementById("popup").style.display="none"
}

function showPopup() {
    SVS(["action","popupDisplay"],true);
    document.getElementById("popup").style.display="block";
}

