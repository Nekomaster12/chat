import { CHAT_ELEMENTS } from "./chatElements.js";
import { EmptyMessageError, ResponseError} from "./errors.js";
import Cookies from "js-cookie";
import format from "date-fns/format";
import { authorizationCode, EMPTY } from "./const.js";
import { getMyData } from "./authorization.js";
if(Cookies.get(authorizationCode) ){
    showChatHistory()
}


function checkMessage(){
    if(CHAT_ELEMENTS.MESSAGE_INPUT.value.length > 0){
        return true
    }else{
        throw EmptyMessageError
    }
}

function createNewMessage(messageText = null){
    const message = document.querySelector("#myMessage")
    if(messageText === null){
    checkMessage()
    message.content.querySelector("p").textContent = CHAT_ELEMENTS.MESSAGE_INPUT.value
    }else{
        message.content.querySelector("p").textContent = messageText
    }
    const newMessage = message.content.cloneNode(true)
    return newMessage
}

function clearMessageInput(){
    CHAT_ELEMENTS.MESSAGE_INPUT.value = EMPTY
}

function sendMyMessage(event){
    event.preventDefault()
    socket.send(JSON.stringify({ text: CHAT_ELEMENTS.MESSAGE_INPUT.value}));
    renderMyMessage()
}

function renderMyMessage(message = CHAT_ELEMENTS.MESSAGE_INPUT.value){
    try{
    const newMessage = createNewMessage(message)
    if(message === CHAT_ELEMENTS.MESSAGE_INPUT.value){
    document.querySelector("#chatWrap").append(newMessage)
    }else{
        document.querySelector("#chatWrap").prepend(newMessage)
    }
    }catch(error){
        alert(error)
    }
    scrollDown()
    clearMessageInput()
}

window.socket.onmessage = (event) => {
    const message = JSON.parse((event.data))
    createOthersMessage(message)
}

function formatDate(item){
    const date = new Date(item)
    return format(date, "HH:MM")
}

function scrollDown(){
    CHAT_ELEMENTS.MESSAGE_HISTORY.scrollTop = CHAT_ELEMENTS.MESSAGE_HISTORY.scrollHeight
}

function createOthersMessage(message){
        let date = formatDate(message.createdAt)
        const messageWrapper = document.createElement("div") //dialogue__message dialogue__message--interlocutor message
        messageWrapper.classList.add("dialogue__message", "dialogue__message--interlocutor", "message")
        const senderName = document.createElement("span") //! Добавить проверку на свое сообщение
        senderName.classList.add("message__sender")
        senderName.textContent = `${message.user.name}: `
        const messageText = document.createElement("div")
        messageText.classList.add("message__text")
        messageText.textContent = message.text
        const messageTime = document.createElement("div")
        messageTime.classList.add("message__time")
        messageTime.textContent = date
        messageWrapper.append(senderName)
        messageWrapper.append(messageText)
        messageWrapper.append(messageTime)
        return messageWrapper
}

async function getChatHistory(){
    const response = fetch("https://edu.strada.one/api/messages/", {
    method: "GET",
    headers: {
        "Content-Type":"application/json;charset=utf-8",
        "Authorization": `Bearer ${Cookies.get(authorizationCode)}`
    }
})
    if(!(await response).ok){
        throw ResponseError
    }
    return (await response).json()
}

async function showChatHistory(){
    const chatHisory = await getChatHistory()
    const myData = await getMyData()
    for(let message of await chatHisory.messages){
        if(message.user.email !== myData.email){
        CHAT_ELEMENTS.MESSAGE_HISTORY.prepend(createOthersMessage(message))
        }else{
            renderMyMessage(message.text)
        }
        
    }
    CHAT_ELEMENTS.DIALOGUE.prepend(CHAT_ELEMENTS.MESSAGE_HISTORY)
    scrollDown()
}

CHAT_ELEMENTS.MESSAGE_FORM.addEventListener("submit", function(event){sendMyMessage(event)})
