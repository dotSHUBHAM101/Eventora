const events = [
 {id:1,title:"Future Forward Summit",category:"Technology",date:"NOV 14, 2026",time:"9:30 AM – 5:00 PM",venue:"T-Hub, Hyderabad",price:"Free entry",description:"A full day of bold ideas, emerging tech, and conversations with the people building tomorrow. Meet founders, makers, and curious minds.",image:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85",short:"Big ideas, bold builders, and a glimpse into what's next."},
 {id:2,title:"The Indie Soundscape",category:"Music",date:"NOV 21, 2026",time:"6:00 PM – 10:00 PM",venue:"The Moonshine Project, Hyderabad",price:"From ₹499",description:"An intimate evening of independent music, fresh voices, and good energy. Discover your next favourite artist in a space made for music lovers.",image:"https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",short:"An evening of independent sounds and electric energy."},
 {id:3,title:"Founders & Chai",category:"Business",date:"NOV 28, 2026",time:"10:00 AM – 1:00 PM",venue:"Social, Jubilee Hills",price:"₹299",description:"Skip the stiff networking. Share stories, exchange lessons, and connect with founders and aspiring entrepreneurs over a great cup of chai.",image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",short:"Real conversations for people building something new."},
 {id:4,title:"Sunday Slowdown",category:"Lifestyle",date:"DEC 06, 2026",time:"7:00 AM – 10:00 AM",venue:"Botanical Garden, Hyderabad",price:"₹199",description:"A mindful morning of guided movement, journaling, and community. Take a breath, reset your rhythm, and make a little space for yourself.",image:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85",short:"Move, breathe, and reset with a mindful morning."},
 {id:5,title:"The Art of Seeing",category:"Arts",date:"DEC 12, 2026",time:"11:00 AM – 4:00 PM",venue:"State Art Gallery, Hyderabad",price:"₹350",description:"Explore the stories behind visual art in a hands-on creative workshop. Experiment with new perspectives and leave with something you made.",image:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=85",short:"A hands-on creative workshop for curious minds."},
 {id:6,title:"Designing Tomorrow",category:"Technology",date:"DEC 19, 2026",time:"10:00 AM – 4:00 PM",venue:"WE Hub, Hyderabad",price:"₹499",description:"A practical design-thinking experience where you turn everyday problems into ideas worth exploring. Bring your curiosity; we'll bring the prompts.",image:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1000&q=85",short:"Turn everyday problems into ideas worth exploring."}
];

const grid = document.getElementById("eventGrid");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("categoryFilters");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const modal = document.getElementById("eventModal");
let activeCategory = "All";
let savedEvents = JSON.parse(localStorage.getItem("eventoraSaved") || "[]");

function renderEvents(){
 const term = searchInput.value.trim().toLowerCase();
 const filtered = events.filter(e => (activeCategory === "All" || e.category === activeCategory) &&
  [e.title,e.category,e.venue,e.description].some(v => v.toLowerCase().includes(term)));
 resultsCount.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? "experience" : "experiences"}`;
 grid.innerHTML = filtered.map(e => `
  <article class="event-card" tabindex="0" role="button" aria-label="View ${e.title}" data-id="${e.id}">
   <div class="card-image"><img src="${e.image}" alt="${e.title}" loading="lazy"><span class="category-label">${e.category}</span>
    <button class="card-save ${savedEvents.includes(e.id) ? "saved" : ""}" data-save="${e.id}" aria-label="${savedEvents.includes(e.id) ? "Unsave" : "Save"} ${e.title}" title="Save event">${savedEvents.includes(e.id) ? "♥" : "♡"}</button></div>
   <div class="card-body"><div class="card-date">${e.date}</div><h3 class="card-title">${e.title}</h3><p class="card-description">${e.short}</p>
    <div class="card-footer"><span class="venue">⌖ ${e.venue}</span><span class="card-arrow">↗</span></div></div>
  </article>`).join("");
 emptyState.classList.toggle("hidden", filtered.length !== 0);
 grid.classList.toggle("hidden", filtered.length === 0);
}
function openEvent(id){
 const e = events.find(item => item.id === Number(id)); if(!e) return;
 document.getElementById("modalImage").src=e.image;
 document.getElementById("modalImage").alt=e.title;
 document.getElementById("modalCategory").textContent=e.category;
 document.getElementById("modalTitle").textContent=e.title;
 document.getElementById("modalDescription").textContent=e.description;
 document.getElementById("modalDate").textContent=`${e.date} · ${e.time}`;
 document.getElementById("modalVenue").textContent=e.venue;
 document.getElementById("modalPrice").textContent=e.price;
 document.getElementById("selectedEvent").value=e.title;
 const select=document.getElementById("eventSelect");
 select.innerHTML=events.map(item=>`<option value="${item.title}" ${item.id===e.id?"selected":""}>${item.title}</option>`).join("");
 document.getElementById("registrationForm").classList.remove("hidden");
 document.getElementById("successPanel").classList.add("hidden");
 document.getElementById("formError").textContent="";
 modal.classList.remove("hidden"); document.body.style.overflow="hidden";
}
function closeModal(){modal.classList.add("hidden");document.body.style.overflow="";}
filters.addEventListener("click",e=>{
 const chip=e.target.closest("[data-category]");if(!chip)return;
 activeCategory=chip.dataset.category;
 filters.querySelectorAll(".filter-chip").forEach(c=>c.classList.toggle("selected",c===chip));
 renderEvents();
});
searchInput.addEventListener("input",renderEvents);
grid.addEventListener("click",e=>{
 const save=e.target.closest("[data-save]");
 if(save){e.stopPropagation();const id=Number(save.dataset.save);savedEvents=savedEvents.includes(id)?savedEvents.filter(x=>x!==id):[...savedEvents,id];localStorage.setItem("eventoraSaved",JSON.stringify(savedEvents));renderEvents();return;}
 const card=e.target.closest("[data-id]");if(card)openEvent(card.dataset.id);
});
grid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-id]")){e.preventDefault();openEvent(e.target.dataset.id);}});
document.getElementById("resetFilters").addEventListener("click",()=>{activeCategory="All";searchInput.value="";filters.querySelectorAll(".filter-chip").forEach(c=>c.classList.toggle("selected",c.dataset.category==="All"));renderEvents();});
document.getElementById("closeModal").addEventListener("click",closeModal);
document.getElementById("doneButton").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.classList.contains("hidden"))closeModal();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();searchInput.focus();}});
document.getElementById("eventSelect").addEventListener("change",e=>document.getElementById("selectedEvent").value=e.target.value);

function showError(message){document.getElementById("formError").textContent=message;}
document.getElementById("registrationForm").addEventListener("submit",e=>{
 e.preventDefault();const form=e.currentTarget;
 const name=document.getElementById("fullName"),email=document.getElementById("email"),phone=document.getElementById("phone");
 [name,email,phone].forEach(x=>x.classList.remove("invalid"));
 const cleanName=name.value.trim(),cleanEmail=email.value.trim(),cleanPhone=phone.value.replace(/\D/g,"");
 if(cleanName.length<2){name.classList.add("invalid");name.focus();return showError("Please enter your full name (at least 2 characters).");}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)){email.classList.add("invalid");email.focus();return showError("Please enter a valid email address.");}
 if(!/^[6-9]\d{9}$/.test(cleanPhone)){phone.classList.add("invalid");phone.focus();return showError("Enter a valid 10-digit Indian mobile number.");}
 const registration={name:cleanName,email:cleanEmail,phone:cleanPhone,event:document.getElementById("eventSelect").value,registeredAt:new Date().toISOString()};
 const registrations=JSON.parse(localStorage.getItem("eventoraRegistrations")||"[]");
 registrations.push(registration);localStorage.setItem("eventoraRegistrations",JSON.stringify(registrations));
 document.getElementById("successMessage").textContent=`Thanks, ${cleanName}! Your spot for ${registration.event} is saved on this device.`;
 form.classList.add("hidden");document.getElementById("successPanel").classList.remove("hidden");
});
document.getElementById("newsletterForm").addEventListener("submit",e=>{
 e.preventDefault();const email=document.getElementById("newsletterEmail");
 if(!email.checkValidity()){email.reportValidity();return;}
 document.getElementById("newsletterMessage").textContent="You're on the list. Watch your inbox!";
 email.value="";
});
document.getElementById("themeToggle").addEventListener("click",()=>{
 document.body.classList.toggle("dark");const dark=document.body.classList.contains("dark");
 document.getElementById("themeToggle").textContent=dark?"☀":"☾";
 localStorage.setItem("eventoraTheme",dark?"dark":"light");
});
if(localStorage.getItem("eventoraTheme")==="dark"){document.body.classList.add("dark");document.getElementById("themeToggle").textContent="☀";}
document.getElementById("menuToggle").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
renderEvents();
