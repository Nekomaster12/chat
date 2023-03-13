import { CHAT_ELEMENTS } from "./chatElements.js";
import { EmptyMessageError } from "./errors.js";

function checkMessage(){
    if(CHAT_ELEMENTS.MESSAGE_INPUT.value.length > 0){
        return true
    }else{
        throw EmptyMessageError
    }
}

function createNewMessage(){
    const message = document.querySelector("#myMessage")
    message.content.querySelector("p").textContent = CHAT_ELEMENTS.MESSAGE_INPUT.value
    const newMessage = message.content.cloneNode(true)
    return newMessage
}

function clearMessageInput(){
    CHAT_ELEMENTS.MESSAGE_INPUT.value = ""
}

function renderMessage(event){
    event.preventDefault()
    try{
    if(checkMessage()){
    const newMessage = createNewMessage()
    CHAT_ELEMENTS.DIALOGUE.append(newMessage)
    clearMessageInput()
    }}catch(error){
        alert(error)
    }
}


CHAT_ELEMENTS.MESSAGE_FORM.addEventListener("submit", renderMessage)

