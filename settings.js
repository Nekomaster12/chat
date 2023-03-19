import { SETTINGS_ELEMENTS } from "./settingsElements.js";
import { EmptyErrorGiven, ResponseError } from "./errors.js";
import { API_USER, EMPTY, maxNameLength } from "./const.js";
import Cookies from "js-cookie";

function openSettings(){
    SETTINGS_ELEMENTS.SETTINGS.style.visibility = "visible"
    SETTINGS_ELEMENTS.SETTINGS_WRAP.style.visibility = "visible"
}

function closeSettings(){
    clearNameInput()
    SETTINGS_ELEMENTS.SETTINGS.style.visibility = "hidden"
    SETTINGS_ELEMENTS.SETTINGS_WRAP.style.visibility = "hidden"
}

function getNewName(){
    let name = SETTINGS_ELEMENTS.NAME_INPUT.value
    name = name.trim()
    return name
}

function checkNewName(){
    const name = getNewName()
    if(name !== EMPTY && name.length <= maxNameLength){
            return true
    }else{
        throw EmptyErrorGiven
    }
}

function clearNameInput(){
    SETTINGS_ELEMENTS.NAME_INPUT.value = EMPTY
}

async function setNewName(event){
    event.preventDefault()
    try{
    if(checkNewName()){
        const response = await fetch(API_USER, {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json;charset=utf-8",
                "Authorization": `Bearer ${Cookies.get(authorizationCode)}`
            },
            body: JSON.stringify({name: getNewName()})
            
        })
        clearNameInput()
        if(response.status > 299){
            throw ResponseError
        }else{
            alert("Имя успешно изменено!")
        }
    }
    }catch(error){
        alert(error)
    }
}



SETTINGS_ELEMENTS.OPEN_BUTTON.addEventListener("click", openSettings)
SETTINGS_ELEMENTS.CLOSE_BUTTON.addEventListener("click", closeSettings)
SETTINGS_ELEMENTS.NAME_FORM.addEventListener("submit", setNewName)