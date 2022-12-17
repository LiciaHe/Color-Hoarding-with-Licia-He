function sample(arr, size) {
    /**
     * ref https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
     * @type {T[] | Uint8ClampedArray | Uint32Array | Blob | Int16Array | Float64Array | any}
     */
    if(size>arr.length){
        return arr
    }
    let shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
function choose(arr) {
    return arr[Math.floor(random() * arr.length)];
}
function shuffle(a) {
    //IN PLACE
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
function random(){
    /**
     * replace with your own random function
     */
    return Math.random()
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
function calculateScale(input, inputDomain, outputRange){
    //helper function to scale values
    return ((input - inputDomain.min) === 0)?outputRange.min:(input-inputDomain.min)/(inputDomain.max-inputDomain.min)*(outputRange.max-outputRange.min)+outputRange.min
}