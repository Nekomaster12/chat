import Cookies from "js-cookie";
import { AUTH_ELEMENTS } from "./authElements.js";
import { minEmailLength, API, arrobaCount, authorizationCode, trueArrobaCount } from "./const.js";
import { WrongEmailGiven, ResponseError, WrongVerifyCode } from "./errors.js";

//! const code = AUTH_ELEMENTS.CODE_INPUT.value
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
    const data = await response.json()
    console.log(data)
    return data
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


// async function createSocket(){
//     const socket = await new WebSocket(`wss://edu.strada.one/websockets?${Cookies.get(authorizationCode)}`);
//     return socket
// }


// export async function sendMessage(message){
//     if(message.length !== 0){
//         console.log(await socket)
//         (await socket).onopen = await function(){
//             socket.send(JSON.stringify({ text: message }));
//         }
//     }
// }

// async function getMessage(){
//     (await socket).onmessage = function(event){
//         console.log(event.data)
//     }
// }

// sendMessage(socket, "чупапи")


function checkEmail(){
    let arrobaCounter = 0;
    console.log(AUTH_ELEMENTS.EMAIL_INPUT.value)
    for(let item of AUTH_ELEMENTS.EMAIL_INPUT.value){
        if(item === "@"){
            console.log(item)
            arrobaCounter++
        }
    }
    console.log(arrobaCounter)
    console.log(arrobaCounter === trueArrobaCount && AUTH_ELEMENTS.EMAIL_INPUT.value.length > minEmailLength)
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
    // console.log(response)
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