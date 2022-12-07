// let function_list=[
//     random,
//     choose,
//     random_in_range,
//     calculateScale,
//     convert_to_accumulate_weight,
//     closest_value_id_in_sorted_lst,
//     chooseWithWeight,
//     draw_colors_from_rules,
// ];

function random(){
    /**
     * replace with your own random function
     */
    return Math.random()
}
function choose(arr) {
    return arr[Math.floor(random() * arr.length)];
}
function calculateScale(input, inputDomain, outputRange){
    //helper function to scale values
    return ((input - inputDomain.min) === 0)?outputRange.min:(input-inputDomain.min)/(inputDomain.max-inputDomain.min)*(outputRange.max-outputRange.min)+outputRange.min
}
function random_in_range(rg) {
    return calculateScale(random(),{"max":1,"min":0},{"max":rg[1],"min":rg[0]})
}
function convert_to_accumulate_weight(weights){
    let accu_sum=[];
    let accu=0
    for (let i=0;i<weights.length;i++){
        accu+=weights[i]
        accu_sum.push(accu)
    }
    return accu_sum
}
function closest_value_id_in_sorted_lst(sorted_lst,value_to_compare){
    let s=0;
    let e=sorted_lst.length;
    let m;
    while(s<e){
        m=Math.floor((s+e)/2);
        if(sorted_lst[m]<value_to_compare){
            s=m+1
        }else{
            e=m
        }
    }

    return s
}
function chooseWithWeight(items, weights){
    let cum_weight=convert_to_accumulate_weight(weights)
    let total=cum_weight[cum_weight.length-1]
    if (total<=0){
        return choose(items)
    }
    let v_val=random()*total;
    let idx=closest_value_id_in_sorted_lst(cum_weight,v_val);
    return items[idx]
}
function draw_colors_from_rules(rules,rule_simulates,draw_ct){
    /**
     * return a list of colors created from the given rules
     * @param rules is an object {
     *     rule_id:{
     *         "hue":[],
     *         "saturation":[],
     *         "lightness":[],
     *         "pick":[],
     *         "weight":[],
     *     }
     * }
     * @param rule_simulates is an object that contains simulated color associated with each rule. If this value is null or undefined,create this object by running a draw simulation.
     * @param draw_ct: number of colors to draw
     * @return draw_result: a list that contains the draw result in the following format:
     * each result is: [rule_id, simulated_color_index,hex]
     *
     */
    let draw_result=[];
    let id_ordered=[];
    let weight_ordered=[];
    let id_color_ct={}

    for (const [id, value] of Object.entries(rules)) {
        if (!value){
            //skip undefined and null rules
            continue
        }
        let weight_range=rules[id]["weight"];
        let w=Math.floor(random_in_range(weight_range));
        id_ordered.push(id)
        weight_ordered.push(w)
        id_color_ct[id]=rule_simulates[id].length;
    }

    for (let i=0;i<draw_ct;i++){
        let rule_id=chooseWithWeight(
            id_ordered,
            weight_ordered
        );
        let color_rg=[0,id_color_ct[rule_id]];
        let color_id=Math.floor(random_in_range(color_rg));
        let hex=rule_simulates[rule_id][color_id];
        draw_result.push([rule_id,color_id,hex])
    }
    draw_result.sort(
        (a,b)=>a[0]-b[0]||a[1]-b[1]
    )
    return draw_result
}