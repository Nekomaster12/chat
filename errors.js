class INPUT_ERROR extends Error{
    constructor(message){
        super(message)
        this.name = "INPUT_ERROR"
    }
}

class RESPONSE_ERROR extends Error{
    constructor(){
        super("Fetch is failed")
        this.name = "RESPONSE_ERROR"
    }
}
export const EmptyMessageError = new INPUT_ERROR("Вы не ввели сообщение!")
export const WrongEmailGiven = new INPUT_ERROR("Вы ввели неверный email!")
export const CodeIsEmpty = new INPUT_ERROR("Вы не ввели код!")
export const WrongVerifyCode = new INPUT_ERROR("Вы ввели неверный код!")
export const EmptyErrorGiven = new INPUT_ERROR("Вы не ввели имя!")
export const ResponseError = new RESPONSE_ERROR()

