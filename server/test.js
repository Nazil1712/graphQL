const string = "American British Mexican Italian Chinese Pakistani Canadian Spanish Russian Indian Argentinian Australian Japanese Egyptian South Korean Brazilian German Moroccan American Portuguese"

const arr = string.split(" ")

const result  = arr.map((v,i,arr)=>{
    return v.toUpperCase()
})
console.log("India".toUpperCase())