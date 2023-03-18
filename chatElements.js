function createMessageHistory(){
    const messages = document.createElement("div")
    messages.className = "wrap"
    messages.id = "chatWrap"
    return messages
}

export const CHAT_ELEMENTS = {
    MESSAGE_INPUT: document.querySelector("#chat__input"),
    MESSAGE_FORM: document.querySelector("#chat__form"),
    SEND_BUTTON: document.querySelector("#chat__send"),
    DIALOGUE: document.querySelector(".chat__dialogue.dialogue"),
    MESSAGE_HISTORY: createMessageHistory()
}
