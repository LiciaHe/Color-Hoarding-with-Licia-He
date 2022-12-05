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
    return Math.random()
}
function random_in_range(rg) {
    // let v=random();
    return calculateScale(random(),{"max":1,"min":0},{"max":rg[1],"min":rg[0]})
}
function chooseWithWeight(items, weights){
    let i;

    for (i = 0; i < weights.length; i++){
        weights[i] += weights[i - 1] || 0;
    }
    let randomValue = random() * weights[weights.length - 1];

    for (i = 0; i < weights.length; i++){
        if (weights[i] > randomValue){
            break;
        }
    }
    return items[i];
}
function calculateScale(input, inputDomain, outputRange){
    //helper function to scale values (e.g., height and color) for canvas without using D3
    // let inputDiff=inputDomain.max-inputDomain.min;
    // // let outputDiff=outputRange.max-outputRange.min;
    // if ((input - inputDomain.min) === 0) {
    //     return(outputRange.min);
    // }
    return ((input - inputDomain.min) === 0)?outputRange.min:(input-inputDomain.min)/(inputDomain.max-inputDomain.min)*(outputRange.max-outputRange.min)+outputRange.min
}