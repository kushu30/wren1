document.addEventListener("DOMContentLoaded", () => {

const API_KEY = "6a9ee949134aafd8a04740679cbb157efc99503da038bfad"

const messages = document.getElementById("messages")
const events = document.getElementById("events")

function addMessage(text, cls){
const div = document.createElement("div")
div.className = cls
div.innerText = text
messages.appendChild(div)
messages.scrollTop = messages.scrollHeight
}

window.sendMessage = async function(){

const input = document.getElementById("input")
const text = input.value

addMessage("You: " + text, "user")

const res = await fetch("http://127.0.0.1:8000/v1/chat/completions",{
method:"POST",
headers:{
"Content-Type":"application/json",
"X-Wren-Key":API_KEY
},
body:JSON.stringify({
model:"gpt-4o-mini",
messages:[{role:"user",content:text}]
})
})

const data = await res.json()

if(data.error){
addMessage("Blocked by Wren", "block")
}else{
addMessage(data.choices[0].message.content, "bot")
}

input.value=""
}

async function loadEvents(){

const res = await fetch("http://127.0.0.1:8000/events",{
headers:{
"X-Wren-Key":API_KEY
}
})

const data = await res.json()

events.innerHTML=""

data.events.forEach(e=>{

const div=document.createElement("div")

if(e.action==="blocked"){
div.className="block"
}

if(e.action==="redacted"){
div.className="redact"
}

div.innerText=`${e.timestamp} | ${e.action} | ${e.reason}`

events.appendChild(div)

})

}

setInterval(loadEvents,2000)

})