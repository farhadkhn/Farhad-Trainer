
const DB_NAME = "FarhadTrainerV21";
const VERSION = "2.4.2";

const WORKOUTS = {
  1:{letter:"A",name:"Push + Core",focus:"Chest · shoulders · triceps · core",ex:[
    ["Incline Dumbbell Press","weighted",4],["Flat Dumbbell Press","weighted",3],
    ["Standing Dumbbell Shoulder Press","weighted",3],["Lateral Raise","weighted",3],
    ["Overhead Triceps Extension","weighted",3],["Plank","timed",3]
  ]},
  2:{letter:"B",name:"Pull + Core",focus:"Back · rear delts · biceps · core",ex:[
    ["One-arm Dumbbell Row","weighted",4],["Dumbbell Pullover","weighted",4],
    ["Rear Delt Fly","weighted",3],["Dumbbell Curl","weighted",3],
    ["Hammer Curl","weighted",2],["Side Plank","timed",3]
  ]},
  3:{letter:"C",name:"Legs + Shoulders",focus:"Quads · glutes · hamstrings · delts",ex:[
    ["Goblet Squat","weighted",4],["Dumbbell Romanian Deadlift","weighted",4],
    ["Bulgarian Split Squat","weighted",3],["Standing Calf Raise","weighted",3],
    ["Lateral Raise","weighted",3],["Farmer Carry","timed_weighted",3]
  ]}
};

let db;
let settings = {id:"main", week:1, measurementInterval:14, migratedToLb:true, weightUnit:"lb"};

const $ = id => document.getElementById(id);
const today = () => new Date().toISOString().slice(0,10);
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

function openDB(){
  return new Promise((resolve,reject)=>{
    const req = indexedDB.open(DB_NAME,1);
    req.onupgradeneeded = ()=>{
      db = req.result;
      ["settings","drafts","sessions","measurements","checkins"].forEach(name=>{
        if(!db.objectStoreNames.contains(name)) db.createObjectStore(name,{keyPath:"id"});
      });
    };
    req.onsuccess = ()=>{ db=req.result; resolve(); };
    req.onerror = ()=>reject(req.error);
  });
}
function get(store,id){
  return new Promise((resolve,reject)=>{
    const r=db.transaction(store).objectStore(store).get(id);
    r.onsuccess=()=>resolve(r.result);
    r.onerror=()=>reject(r.error);
  });
}
function all(store){
  return new Promise((resolve,reject)=>{
    const r=db.transaction(store).objectStore(store).getAll();
    r.onsuccess=()=>resolve(r.result||[]);
    r.onerror=()=>reject(r.error);
  });
}
function put(store,obj){
  return new Promise((resolve,reject)=>{
    const r=db.transaction(store,"readwrite").objectStore(store).put(obj);
    r.onsuccess=()=>resolve(obj);
    r.onerror=()=>reject(r.error);
  });
}
function remove(store,id){
  return new Promise((resolve,reject)=>{
    const r=db.transaction(store,"readwrite").objectStore(store).delete(id);
    r.onsuccess=()=>resolve();
    r.onerror=()=>reject(r.error);
  });
}
function toast(msg){
  const t=$("toast");
  if(!t) return;
  t.textContent=msg;
  t.classList.remove("hidden");
  setTimeout(()=>t.classList.add("hidden"),1500);
}
function validSet(type,s){
  if(!s || !s.done) return false;
  if(type==="weighted") return Number(s.weight)>0 && Number(s.reps)>0;
  if(type==="timed") return Number(s.seconds)>0;
  if(type==="timed_weighted") return Number(s.weight)>0 && Number(s.seconds)>0;
  return Number(s.weight)>0 && Number(s.reps)>0;
}
function workoutIdFor(session){
  const n=Number(session?.workoutId ?? session?.workout);
  if([1,2,3].includes(n)) return n;
  const name=String(session?.name||"").toLowerCase();
  if(name.includes("push")) return 1;
  if(name.includes("pull")) return 2;
  if(name.includes("leg") || name.includes("shoulder")) return 3;
  return null;
}
function defTypeFor(session,e,ei){
  const wid=workoutIdFor(session);
  const byIndex = wid && WORKOUTS[wid]?.ex?.[ei]?.[1];
  if(byIndex) return byIndex;
  for(const w of Object.values(WORKOUTS)){
    const hit=w.ex.find(x=>x[0]===e?.name);
    if(hit) return hit[1];
  }
  if((e?.sets||[]).some(s=>Number(s.seconds)>0 && Number(s.weight)>0)) return "timed_weighted";
  if((e?.sets||[]).some(s=>Number(s.seconds)>0)) return "timed";
  return "weighted";
}
function safeTime(x){ return Number(x?.createdAt || x?.completedAt || 0); }

async function nextWorkoutId(){
  const sessions=(await all("sessions")).filter(Boolean).sort((a,b)=>(b.completedAt||0)-(a.completedAt||0));
  for(const s of sessions){
    const id=workoutIdFor(s);
    if(id) return id%3+1;
  }
  return 1;
}

async function renderHome(){
  const hw=$("homeWeight"), hs=$("homeSessions"), hp=$("homePRs"), ha=$("homeAdherence");
  if(hw) hw.textContent="Loading…";
  if(hs) hs.textContent="Loading…";
  if(hp) hp.textContent="Loading…";
  if(ha) ha.textContent="Loading…";

  try{
    const sessions=await all("sessions").catch(()=>[]);
    const measurements=await all("measurements").catch(()=>[]);
    measurements.sort((a,b)=>safeTime(a)-safeTime(b));

    const now=new Date(), start=new Date(now);
    start.setDate(now.getDate()-now.getDay());
    start.setHours(0,0,0,0);
    const end=new Date(start); end.setDate(start.getDate()+7);
    const week=sessions.filter(s=>{
      if(!s?.date) return false;
      const d=new Date(s.date+"T12:00:00");
      return !Number.isNaN(d.getTime()) && d>=start && d<end;
    });

    const tracked=new Set();
    sessions.forEach(s=>{
      (s?.exercises||[]).forEach((e,ei)=>{
        const type=defTypeFor(s,e,ei);
        if((e?.sets||[]).some(set=>validSet(type,set))) tracked.add(e?.name||`Exercise ${ei+1}`);
      });
    });

    const latest=measurements.at(-1);
    if(hw) hw.textContent=(latest?.weight!=null)?latest.weight:"—";
    if(hs) hs.textContent=`${week.length}/3`;
    if(hp) hp.textContent=String(tracked.size);
    if(ha){
      const weekNo=Math.max(1,Number(settings.week)||1);
      ha.textContent=`${Math.min(100,Math.round(sessions.length/(weekNo*3)*100))}%`;
    }

    let next=await nextWorkoutId().catch(()=>1);
    if(!WORKOUTS[next]) next=1;
    if($("nextWorkoutTitle")) $("nextWorkoutTitle").textContent=`Workout ${WORKOUTS[next].letter} — ${WORKOUTS[next].name}`;
    if($("nextWorkoutMeta")) $("nextWorkoutMeta").textContent=WORKOUTS[next].focus;

    const body=$("bodyCheckSummary");
    if(body){
      if(!latest?.date){
        body.textContent="Add your first body measurement to create a baseline.";
      }else{
        const due=new Date(latest.date+"T12:00:00");
        if(Number.isNaN(due.getTime())){
          body.textContent="Open Progress to review your saved entries.";
        }else{
          due.setDate(due.getDate()+(Number(settings.measurementInterval)||14));
          body.textContent=`Next check-in: ${due.toLocaleDateString()}`;
        }
      }
    }
  }catch(err){
    console.error("renderHome failed",err);
    if(hw) hw.textContent="—";
    if(hs) hs.textContent="0/3";
    if(hp) hp.textContent="0";
    if(ha) ha.textContent="0%";
    if($("nextWorkoutTitle")) $("nextWorkoutTitle").textContent="Workout A — Push + Core";
    if($("nextWorkoutMeta")) $("nextWorkoutMeta").textContent="Your saved history remains available.";
    if($("bodyCheckSummary")) $("bodyCheckSummary").textContent="Open Progress to review saved entries.";
  }
}

function draftId(){ return `draft:${$("workoutDate")?.value||today()}:${$("workoutSelect")?.value||1}`; }

async function renderWorkout(){
  const selector=$("workoutSelect"), cards=$("exerciseCards");
  if(!selector || !cards) return;
  let id=Number(selector.value)||1;
  if(!WORKOUTS[id]) id=1;
  const w=WORKOUTS[id];
  const draft=await get("drafts",draftId()).catch(()=>null);
  let html="";

  w.ex.forEach((e,ei)=>{
    const [name,type,setCount]=e;
    let rows="";
    for(let si=0;si<setCount;si++){
      const v=draft?.data?.exercises?.[ei]?.sets?.[si]||{};
      if(type==="weighted"){
        rows+=`<div class="setrow" data-row="${ei}-${si}"><span>S${si+1}</span><input data-e="${ei}" data-s="${si}" data-f="weight" type="number" step=".5" placeholder="lb" value="${v.weight??""}"><input data-e="${ei}" data-s="${si}" data-f="reps" type="number" placeholder="reps" value="${v.reps??""}"><input class="done" data-e="${ei}" data-s="${si}" data-f="done" type="checkbox" ${v.done?"checked":""}></div>`;
      }else if(type==="timed"){
        rows+=`<div class="setrow" data-row="${ei}-${si}"><span>S${si+1}</span><input data-e="${ei}" data-s="${si}" data-f="seconds" type="number" placeholder="sec" value="${v.seconds??""}"><input disabled value="—"><input class="done" data-e="${ei}" data-s="${si}" data-f="done" type="checkbox" ${v.done?"checked":""}></div>`;
      }else{
        rows+=`<div class="setrow" data-row="${ei}-${si}"><span>S${si+1}</span><input data-e="${ei}" data-s="${si}" data-f="weight" type="number" step=".5" placeholder="lb" value="${v.weight??""}"><input data-e="${ei}" data-s="${si}" data-f="seconds" type="number" placeholder="sec" value="${v.seconds??""}"><input class="done" data-e="${ei}" data-s="${si}" data-f="done" type="checkbox" ${v.done?"checked":""}></div>`;
      }
    }
    html+=`<div class="exercise"><button class="exhead" type="button" data-toggle="${ei}">${name} <span class="muted">${setCount} sets</span></button><div id="exerciseBody${ei}" class="exbody ${ei===0?"":"hidden"}"><div class="setrow muted"><span>Set</span><span>${type==="timed"?"Sec":"LB"}</span><span>${type==="weighted"?"Reps":"Sec"}</span><span>✓</span></div>${rows}</div></div>`;
  });

  cards.innerHTML=html;
  document.querySelectorAll("[data-toggle]").forEach(b=>b.onclick=()=>{
    const body=$("exerciseBody"+b.dataset.toggle);
    if(body) body.classList.toggle("hidden");
  });
  document.querySelectorAll("#exerciseCards input[data-e]").forEach(x=>x.onchange=saveDraft);
  if($("sessionNotes")) $("sessionNotes").value=draft?.data?.notes??"";
}

function collectWorkout(){
  const id=Number($("workoutSelect")?.value)||1;
  const w=WORKOUTS[id]||WORKOUTS[1];
  const exercises=w.ex.map(e=>({name:e[0],sets:Array.from({length:e[2]},()=>({weight:"",reps:"",seconds:"",done:false}))}));
  document.querySelectorAll("#exerciseCards input[data-e]").forEach(x=>{
    const ei=Number(x.dataset.e), si=Number(x.dataset.s), f=x.dataset.f;
    exercises[ei].sets[si][f]=x.type==="checkbox"?x.checked:(x.value===""?"":Number(x.value));
  });
  return {workoutId:id,date:$("workoutDate")?.value||today(),notes:$("sessionNotes")?.value||"",exercises};
}
async function saveDraft(){
  await put("drafts",{id:draftId(),updatedAt:Date.now(),data:collectWorkout()});
  toast("Draft saved");
}
async function finishWorkout(){
  const d=collectWorkout(), w=WORKOUTS[d.workoutId];
  let validCount=0;
  d.exercises.forEach((e,ei)=>{
    const type=w.ex[ei][1];
    e.sets.forEach((s,si)=>{
      s.valid=validSet(type,s);
      if(s.valid) validCount++;
      else if(s.done) document.querySelector(`[data-row="${ei}-${si}"]`)?.classList.add("bad");
    });
  });
  if(!validCount){ toast("No valid completed sets"); return; }
  await put("sessions",{id:`session:${Date.now()}`,completedAt:Date.now(),date:d.date,workoutId:d.workoutId,name:w.name,notes:d.notes,exercises:d.exercises});
  await remove("drafts",draftId());
  toast("Workout saved");
  await renderWorkout();
  await renderHome();
}
async function resumeDraft(){
  const drafts=(await all("drafts")).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
  const d=drafts[0];
  if(!d){ toast("No saved draft"); return; }
  if($("workoutSelect")) $("workoutSelect").value=d.data?.workoutId||1;
  if($("workoutDate")) $("workoutDate").value=d.data?.date||today();
  await renderWorkout();
  await navigate("workout");
}

function showSession(){
  $("currentSessionTab")?.classList.add("active");
  $("historyTab")?.classList.remove("active");
  $("sessionView")?.classList.remove("hidden");
  $("historyView")?.classList.add("hidden");
}
async function showHistory(){
  $("historyTab")?.classList.add("active");
  $("currentSessionTab")?.classList.remove("active");
  $("sessionView")?.classList.add("hidden");
  $("historyView")?.classList.remove("hidden");
  await renderHistory();
}
async function renderHistory(){
  const holder=$("historyList");
  if(!holder) return;
  const sessions=(await all("sessions")).sort((a,b)=>(b.completedAt||0)-(a.completedAt||0));
  holder.innerHTML=sessions.length?sessions.map(s=>{
    const wid=workoutIdFor(s);
    const letter=WORKOUTS[wid]?.letter||"?";
    const exercises=(s?.exercises||[]).map((e,ei)=>{
      const type=defTypeFor(s,e,ei);
      const rows=(e?.sets||[]).filter(set=>validSet(type,set)).map((set,i)=>`<div class="muted">Set ${i+1}: ${set.weight||"—"} lb · ${set.reps||set.seconds||"—"}</div>`).join("");
      return `<div class="history"><b>${esc(e?.name||"Exercise")}</b>${rows||'<div class="muted">No valid sets</div>'}</div>`;
    }).join("");
    return `<details class="history"><summary>${esc(s?.date||"Unknown date")} · Workout ${letter} — ${esc(s?.name||"Workout")}</summary>${exercises}<button class="delete" type="button" data-delete-session="${esc(s.id)}">Delete workout</button></details>`;
  }).join(""):'<div class="muted">No workouts yet.</div>';

  document.querySelectorAll("[data-delete-session]").forEach(b=>b.onclick=async()=>{
    if(confirm("Delete this workout?")){
      await remove("sessions",b.dataset.deleteSession);
      toast("Workout deleted");
      await renderHistory();
      await renderHome();
    }
  });
}

async function fileData(file){
  if(!file) return null;
  return await new Promise((resolve,reject)=>{
    const r=new FileReader();
    r.onload=()=>resolve(r.result);
    r.onerror=()=>reject(r.error);
    r.readAsDataURL(file);
  });
}
const numberOrNull=id=>{
  const node=$(id);
  return !node || node.value==="" ? null : Number(node.value);
};
async function saveMeasurement(){
  const rec={
    id:`m:${Date.now()}`,date:today(),createdAt:Date.now(),
    weight:numberOrNull("mWeight"),waist:numberOrNull("mWaist"),chest:numberOrNull("mChest"),arm:numberOrNull("mArm"),thigh:numberOrNull("mThigh"),
    note:$("mNote")?.value||"",
    photos:{front:await fileData($("pFront")?.files?.[0]),side:await fileData($("pSide")?.files?.[0]),back:await fileData($("pBack")?.files?.[0])}
  };
  await put("measurements",rec);
  toast("Progress saved");
  await renderProgress();
  await renderHome();
}
async function renderProgress(){
  const holder=$("measurementHistory");
  if(!holder) return;
  const m=(await all("measurements")).sort((a,b)=>safeTime(a)-safeTime(b));
  holder.innerHTML=m.length?m.slice().reverse().map(x=>`<button class="progress-entry" type="button" data-progress-id="${esc(x.id)}"><b>${esc(x.date||"Unknown date")}</b><div class="muted">${x.weight??"—"} lb · waist ${x.waist??"—"} cm · chest ${x.chest??"—"} cm · arm ${x.arm??"—"} cm · thigh ${x.thigh??"—"} cm</div></button>`).join(""):'<div class="muted">No progress entries yet.</div>';
  document.querySelectorAll("[data-progress-id]").forEach(b=>b.onclick=()=>openProgress(b.dataset.progressId));
}
async function openProgress(id){
  const x=await get("measurements",id);
  if(!x) return;
  const photos=Object.entries(x.photos||{}).filter(([,v])=>v);
  $("modalContent").innerHTML=`<h2>${esc(x.date||"Progress entry")}</h2><div class="history"><div>Weight: <b>${x.weight??"—"} lb</b></div><div>Waist: <b>${x.waist??"—"} cm</b></div><div>Chest: <b>${x.chest??"—"} cm</b></div><div>Arm: <b>${x.arm??"—"} cm</b></div><div>Thigh: <b>${x.thigh??"—"} cm</b></div></div>${x.note?`<div class="history">${esc(x.note)}</div>`:""}${photos.length?`<div class="modalphotos">${photos.map(([p,u])=>`<div><b>${esc(p)}</b><img src="${u}"></div>`).join("")}</div>`:""}<button id="deleteProgress" class="delete" type="button">Delete progress entry</button>`;
  $("modal")?.classList.remove("hidden");
  $("deleteProgress").onclick=async()=>{
    if(confirm("Delete this progress entry?")){
      await remove("measurements",id);
      closeModal();
      toast("Progress entry deleted");
      await renderProgress();
      await renderHome();
    }
  };
}
function help(type){
  const map={
    weight:["Weight","Use the same scale under similar conditions, ideally in the morning after using the bathroom and before breakfast."],
    waist:["Waist","Measure horizontally at navel level, relaxed, after a normal exhale."],
    chest:["Chest","Measure around the fullest part of the chest, roughly nipple level."],
    arm:["Arm","Measure around the largest part of the same upper arm each time, arm relaxed."],
    thigh:["Thigh","Measure around the largest part of the same upper thigh each time."]
  };
  const c=map[type]||["Measurement","Measure consistently each time."];
  $("modalContent").innerHTML=`<h2>${c[0]}</h2><div class="history">${c[1]}</div>`;
  $("modal")?.classList.remove("hidden");
}
function closeModal(){ $("modal")?.classList.add("hidden"); }

async function refreshApp(){
  if("serviceWorker" in navigator){
    for(const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
  }
  if("caches" in window){
    for(const key of await caches.keys()) await caches.delete(key);
  }
  toast("App files refreshed");
  setTimeout(()=>location.reload(),500);
}
async function exportData(){
  const data={version:VERSION,settings,sessions:await all("sessions"),drafts:await all("drafts"),measurements:await all("measurements"),checkins:await all("checkins")};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob); a.download="Farhad-Trainer-V2.4.2-Backup.json"; a.click();
}

async function navigate(page){
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  $(page)?.classList.add("active");
  document.querySelectorAll("nav button[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  if(page==="home") await renderHome();
  if(page==="workout"){ await renderWorkout(); showSession(); }
  if(page==="progress") await renderProgress();
}
function bind(){
  document.querySelectorAll("nav button[data-page]").forEach(b=>b.onclick=()=>navigate(b.dataset.page));
  if($("startNextBtn")) $("startNextBtn").onclick=async()=>{ $("workoutSelect").value=await nextWorkoutId(); await renderWorkout(); await navigate("workout"); };
  if($("resumeDraftBtn")) $("resumeDraftBtn").onclick=resumeDraft;
  if($("goProgressBtn")) $("goProgressBtn").onclick=()=>navigate("progress");
  if($("workoutSelect")) $("workoutSelect").onchange=renderWorkout;
  if($("workoutDate")) $("workoutDate").onchange=renderWorkout;
  if($("saveDraftBtn")) $("saveDraftBtn").onclick=saveDraft;
  if($("finishBtn")) $("finishBtn").onclick=finishWorkout;
  if($("currentSessionTab")) $("currentSessionTab").onclick=showSession;
  if($("historyTab")) $("historyTab").onclick=showHistory;
  if($("backToSessionBtn")) $("backToSessionBtn").onclick=showSession;
  if($("saveMeasurementBtn")) $("saveMeasurementBtn").onclick=saveMeasurement;
  document.querySelectorAll(".help").forEach(b=>b.onclick=()=>help(b.dataset.help));
  if($("closeModal")) $("closeModal").onclick=closeModal;
  if($("modal")) $("modal").onclick=e=>{ if(e.target===$("modal")) closeModal(); };
  if($("refreshBtn")) $("refreshBtn").onclick=refreshApp;
  if($("exportBtn")) $("exportBtn").onclick=exportData;
}

async function init(){
  await openDB();
  settings={...settings,...(await get("settings","main")||{})};
  await put("settings",settings);
  if($("workoutDate")) $("workoutDate").value=today();
  bind();
  await renderHome();
  await renderWorkout();
  await renderProgress();
  if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js?v=2.4.2").catch(()=>{});
}

window.addEventListener("error",e=>console.error("Farhad Trainer error",e.error||e.message));
window.addEventListener("unhandledrejection",e=>console.error("Farhad Trainer promise error",e.reason));
init().catch(err=>{
  console.error("Initialization failed",err);
  if($("homeWeight")) $("homeWeight").textContent="—";
  if($("homeSessions")) $("homeSessions").textContent="0/3";
  if($("homePRs")) $("homePRs").textContent="0";
  if($("homeAdherence")) $("homeAdherence").textContent="0%";
  if($("nextWorkoutTitle")) $("nextWorkoutTitle").textContent="Workout A — Push + Core";
  if($("nextWorkoutMeta")) $("nextWorkoutMeta").textContent="Recovery mode — saved history is preserved.";
  bind();
});
