const chatinput= document.querySelector('.chat-input')
const chatMessages=document.querySelector('.chat-messages')
const chatInputForm= document.querySelector('.chat-input-form')

const chatMessageElement = (message) =>`
  <div class="message ${'gray-bg'}">
    <div class="message-text">${message.text}</div>
  </div>
`
const sendMessage = (e) => {
    e.preventDefault()
    const message={text: chatinput.value}
    chatMessages.innerHTML += chatMessageElement(message)
}

chatInputForm.addEventListener('submit', sendMessage)


