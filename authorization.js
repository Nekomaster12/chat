import { AUTH_ELEMENTS } from "./authElements.js";
import { minEmailLength, API } from "./const.js";
import { WrongEmailGiven, ResponseError } from "./errors.js";


function getEmail(){
    const email = AUTH_ELEMENTS.EMAIL_INPUT.value
    return email
}

function checkEmail(){
    const email = getEmail()
    // console.log(email)
    let dotCounter = 0;
    let arrobaCounter = 0;
    for(let item of email){
        if(item === "."){
            dotCounter++
        }else if(item === "@"){
            arrobaCounter++
        }
    }
    // console.log(dotCounter, arrobaCounter)
    if(dotCounter === 1 && arrobaCounter === 1 && email.length > minEmailLength){
        return true
    }else{
        throw WrongEmailGiven
    }
}

export async function sendAuthCode(){
    // 
    // if(checkEmail()){
    //     fetch(API, {
    //         method: "POST",
    //         headers: {
    //             email: getEmail()
    //         }
    //     })
    //     .then((result) => {console.log(result)})
    //     .catch(() => {throw ResponseError})
    // }
    // }catch(error){
    //     alert(error)
    // }
    try{
    if(checkEmail()){
    const response = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type":"application/json;charset=utf-8"
        },
        body: JSON.stringify({email:getEmail()})
    })
    // console.log(response)
    if(response.status > 299){
        throw ResponseError
    }else{
        const answer = await response.json()
        // console.log(answer)
    }
    }
}catch(error){
    alert(error)
}

}

AUTH_ELEMENTS.EMAIL_FORM.addEventListener("submit", sendAuthCode)