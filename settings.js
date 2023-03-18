import { SETTINGS_ELEMENTS } from "./settingsElements.js";
import { EmptyErrorGiven, ResponseError } from "./errors.js";
import { maxNameLength } from "./const.js";
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
    if(name !== "" && name.length <= maxNameLength){
            return true
    }else{
        throw EmptyErrorGiven
    }
}

function clearNameInput(){
    SETTINGS_ELEMENTS.NAME_INPUT.value = ""
}

async function setNewName(event){
    event.preventDefault()
    try{
    if(checkNewName()){
        const response = await fetch("https://edu.strada.one/api/user", {
            method: "PATCH",
            headers: {
                "Content-Type":"application/json;charset=utf-8",
                "Authorization": `Bearer ${Cookies.get("authCode")}`
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