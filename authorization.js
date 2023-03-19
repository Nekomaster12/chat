import Cookies from "js-cookie";
import { AUTH_ELEMENTS } from "./authElements.js";
import { minEmailLength, API, authorizationCode, trueArrobaCount } from "./const.js";
import { WrongEmailGiven, ResponseError, WrongVerifyCode } from "./errors.js";

checkAuthCode()
.then(Authorize())

async function checkAuthCode(){
    try{
    const response = await sendGetRequest()
    if(response.status >= 299){
        Cookies.remove(authorizationCode)
    }
    }catch(error){
        alert(error)
    }
}

async function sendGetRequest(){
    const response = await fetch("https://edu.strada.one/api/user/me", {
            method: "GET",
            headers: {
                "Content-Type":"application/json;charset=utf-8",
                "Authorization": `Bearer ${Cookies.get(authorizationCode)}`
            }
        })
    return await response
}

export async function getMyData(){
    try{
    const response = await sendGetRequest()
    return await response.json()
    }catch(error){
        alert(error)
    }
}

async function Authorize(){
    if(!Cookies.get(authorizationCode)){
        AUTH_ELEMENTS.AUTH_WINDOW.style.display = "block"
    }else{
        AUTH_ELEMENTS.AUTH_WINDOW.style.display = "none"
        window.socket = new WebSocket(`wss://edu.strada.one/websockets?${Cookies.get(authorizationCode)}`);
    }
}

function checkEmail(){
    let arrobaCounter = 0;
    for(let item of AUTH_ELEMENTS.EMAIL_INPUT.value){
        if(item === "@"){
            arrobaCounter++
        }
    }
    if(arrobaCounter === trueArrobaCount && AUTH_ELEMENTS.EMAIL_INPUT.value.length > minEmailLength){
        return true
    }else{
        throw WrongEmailGiven
    }
}

function clearEmailInput(){
    AUTH_ELEMENTS.EMAIL_INPUT.value = ""
}

export async function sendAuthCode(){
    try{
    if(checkEmail()){
    const response = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type":"application/json;charset=utf-8"
        },
        body: JSON.stringify({email:AUTH_ELEMENTS.EMAIL_INPUT.value})
    })
    if(response.status > 299){
        throw ResponseError
        }else{
            alert("the code is sent")
            clearEmailInput()
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
    if(response.ok){
        Cookies.set(authorizationCode, code)
        Authorize()
    }else{
        throw WrongVerifyCode
    }}catch(error){
        alert(error)
    }
}


AUTH_ELEMENTS.EMAIL_FORM.addEventListener("submit", sendAuthCode)
AUTH_ELEMENTS.CODE_FORM.addEventListener("submit", verifyCode)