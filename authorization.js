import Cookies from "js-cookie";
import { AUTH_ELEMENTS } from "./authElements.js";
import { minEmailLength, API } from "./const.js";
import { WrongEmailGiven, ResponseError, WrongVerifyCode } from "./errors.js";

renderLoginForm()

function renderLoginForm(){
    if(!Cookies.get("authCode")){
        AUTH_ELEMENTS.AUTH_WINDOW.style.visibility = "visible"
    }else{
        AUTH_ELEMENTS.AUTH_WINDOW.style.display = "hidden"
    }
}


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
    if(dotCounter === 1 && arrobaCounter === 1 && email.length > minEmailLength){
        return true
    }else{
        throw WrongEmailGiven
    }
}

export async function sendAuthCode(){
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
        }
    }
}catch(error){
    alert(error)
}
}

async function verifyCode(){
    try{
    const code = AUTH_ELEMENTS.CODE_INPUT.value
    const response = await fetch("https://edu.strada.one/api/user/me", {
        headers: {
            Authorization: `Bearer ${code}`
        }
    })
    if(response.status <= 299){
        Cookies.set("authCode", code)
        renderLoginForm()
    }else{
        throw WrongVerifyCode
    }}catch(error){
        alert(error)
    }
}

async function getMyData(){
    await fetch("https://edu.strada.one/api/user/me")
}

AUTH_ELEMENTS.EMAIL_FORM.addEventListener("submit", sendAuthCode)
AUTH_ELEMENTS.CODE_FORM.addEventListener("submit", verifyCode)