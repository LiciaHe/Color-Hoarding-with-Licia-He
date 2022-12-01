function generate(){

    update_all_svg_size();
    addBackgroundRectangle(
        document.getElementById("grayscale_g")
    );
    addBackgroundRectangle(document.getElementById("combo_g"));
    update_all_svg_size();


    // let g=document.getElementById("grayscale_container")
    // console.log(g.clientWidth,g.offsetWidth)

    //add svg
    //add instruction
    //add exporter
    //add
}

//responsive
window.addEventListener("resize",()=>adjust_window_size())
window.addEventListener('load', function () {
    adjust_window_size();
    generate()
})