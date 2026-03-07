document.addEventListener("DOMContentLoaded", () => {

const API_KEY = "b444f63f32ed4481fe2b7a47451bd8f02e466c5a505d6b1f"

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
if(!text.trim()) return

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
let blockMsg = "🛡️ BLOCKED BY WREN"
blockMsg += "\nReason: " + (data.reason || "Unknown")
if(data.ml_score !== undefined){
blockMsg += "\nScore: " + data.ml_score.toFixed(4)
}
if(data.detection_type){
blockMsg += "\nClassification: " + data.detection_type
}
addMessage(blockMsg, "block")
} else {
const reply = data.choices[0].message.content
const meta = data.wren_meta
let botMsg = reply
if(meta){
botMsg += "\n\n📊 ML Rank: " + (meta.detection_type || "BENIGN") + " (Score: " + (meta.ml_score || 0.0).toFixed(4) + ")"
}
addMessage(botMsg, "bot")
}

input.value=""
}

async function loadEvents(){
try {
const res = await fetch("http://127.0.0.1:8000/events",{
headers:{
"X-Wren-Key":API_KEY
}
})

if(!res.ok) return

const data = await res.json()

events.innerHTML=""

if(data.events){
data.events.forEach(e=>{

const div=document.createElement("div")

if(e.action==="blocked"){
div.className="block"
}

if(e.action==="redacted"){
div.className="redact"
}

div.innerText=`${e.timestamp} | ${e.module} | ${e.action} | ${e.reason}`

events.appendChild(div)

})
}
} catch(err) {
// silently ignore fetch errors
}
}

setInterval(loadEvents,2000)

})