
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WORKOUTS={
1:{name:"Push + Core",focus:"Chest · shoulders · triceps · core",ex:[
 {n:"Incline Dumbbell Press",sets:4,reps:"8–10",rest:120,target:"7–8",cue:"Lower under control; drive evenly.",sub:"Feet-elevated push-ups",primary:["Upper chest"],secondary:["Front delts","Triceps"],yt:"https://www.youtube.com/results?search_query=incline+dumbbell+press+proper+form"},
 {n:"Flat Dumbbell Press",sets:3,reps:"10–12",rest:90,target:"8",cue:"Keep shoulder blades tucked.",sub:"Dumbbell floor press",primary:["Chest"],secondary:["Front delts","Triceps"],yt:"https://www.youtube.com/results?search_query=dumbbell+bench+press+proper+form"},
 {n:"Standing Dumbbell Shoulder Press",sets:3,reps:"8–10",rest:90,target:"8",cue:"Brace core; avoid leaning back.",sub:"Seated dumbbell press",primary:["Shoulders"],secondary:["Triceps","Core"],yt:"https://www.youtube.com/results?search_query=standing+dumbbell+shoulder+press+proper+form"},
 {n:"Lateral Raise",sets:3,reps:"12–15",rest:60,target:"8",cue:"Lead with elbows; stop around shoulder height.",sub:"Band lateral raise",primary:["Side delts"],secondary:["Upper traps"],yt:"https://www.youtube.com/results?search_query=dumbbell+lateral+raise+proper+form"},
 {n:"Overhead Triceps Extension",sets:3,reps:"12",rest:60,target:"8",cue:"Keep elbows close and ribs down.",sub:"Close-grip push-ups",primary:["Triceps"],secondary:["Core"],yt:"https://www.youtube.com/results?search_query=dumbbell+overhead+triceps+extension+proper+form"},
 {n:"Plank",sets:3,reps:"45–60 sec",rest:45,target:"7",cue:"Keep ribs and pelvis stacked.",sub:"Dead bug",primary:["Core"],secondary:["Glutes","Shoulders"],yt:"https://www.youtube.com/results?search_query=plank+proper+form"}
]},
2:{name:"Pull + Core",focus:"Back · rear delts · biceps · core",ex:[
 {n:"One-arm Dumbbell Row",sets:4,reps:"8–10",rest:90,target:"8",cue:"Pull elbow toward your hip.",sub:"Chest-supported dumbbell row",primary:["Lats","Mid-back"],secondary:["Rear delts","Biceps"],yt:"https://www.youtube.com/results?search_query=one+arm+dumbbell+row+proper+form"},
 {n:"Dumbbell Pullover",sets:4,reps:"10–12",rest:90,target:"8",cue:"Keep ribs down and feel the lats stretch.",sub:"Band straight-arm pulldown",primary:["Lats"],secondary:["Chest","Triceps"],yt:"https://www.youtube.com/results?search_query=dumbbell+pullover+proper+form"},
 {n:"Rear Delt Fly",sets:3,reps:"12–15",rest:60,target:"8",cue:"Move through shoulders, not the neck.",sub:"Band reverse fly",primary:["Rear delts"],secondary:["Mid-back"],yt:"https://www.youtube.com/results?search_query=dumbbell+rear+delt+fly+proper+form"},
 {n:"Dumbbell Curl",sets:3,reps:"10–12",rest:60,target:"8",cue:"Keep elbows by your sides.",sub:"Alternating curl",primary:["Biceps"],secondary:["Forearms"],yt:"https://www.youtube.com/results?search_query=dumbbell+biceps+curl+proper+form"},
 {n:"Hammer Curl",sets:2,reps:"12",rest:60,target:"8",cue:"Control the lowering phase.",sub:"Cross-body hammer curl",primary:["Biceps","Brachialis"],secondary:["Forearms"],yt:"https://www.youtube.com/results?search_query=hammer+curl+proper+form"},
 {n:"Side Plank",sets:3,reps:"30–45 sec/side",rest:45,target:"7",cue:"Keep hips high and body straight.",sub:"Suitcase hold",primary:["Obliques"],secondary:["Glutes","Shoulders"],yt:"https://www.youtube.com/results?search_query=side+plank+proper+form"}
]},
3:{name:"Legs + Shoulders",focus:"Quads · glutes · hamstrings · delts",ex:[
 {n:"Goblet Squat",sets:4,reps:"10",rest:120,target:"8",cue:"Chest tall; knees track over toes.",sub:"Dumbbell front squat",primary:["Quads","Glutes"],secondary:["Core","Adductors"],yt:"https://www.youtube.com/results?search_query=goblet+squat+proper+form"},
 {n:"Dumbbell Romanian Deadlift",sets:4,reps:"8–10",rest:120,target:"8",cue:"Push hips back; keep dumbbells close.",sub:"Single-leg dumbbell RDL",primary:["Hamstrings","Glutes"],secondary:["Back extensors","Grip"],yt:"https://www.youtube.com/results?search_query=dumbbell+romanian+deadlift+proper+form"},
 {n:"Bulgarian Split Squat",sets:3,reps:"10/leg",rest:90,target:"8",cue:"Stay balanced and descend under control.",sub:"Reverse dumbbell lunge",primary:["Quads","Glutes"],secondary:["Hamstrings","Core"],yt:"https://www.youtube.com/results?search_query=bulgarian+split+squat+proper+form"},
 {n:"Standing Calf Raise",sets:3,reps:"15",rest:60,target:"8",cue:"Pause at the top and lower fully.",sub:"Single-leg calf raise",primary:["Calves"],secondary:["Ankle stabilizers"],yt:"https://www.youtube.com/results?search_query=standing+calf+raise+proper+form"},
 {n:"Lateral Raise",sets:3,reps:"15",rest:60,target:"8",cue:"Lead with elbows.",sub:"Band lateral raise",primary:["Side delts"],secondary:["Upper traps"],yt:"https://www.youtube.com/results?search_query=dumbbell+lateral+raise+proper+form"},
 {n:"Farmer Carry",sets:3,reps:"40–60 sec",rest:60,target:"7",cue:"Stand tall; shoulders down.",sub:"Suitcase carry",primary:["Grip","Core"],secondary:["Traps","Glutes"],yt:"https://www.youtube.com/results?search_query=farmer+carry+proper+form"}
]}};

const DBNAME="FarhadTrainerV2";
let db;
function openDB(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open(DBNAME,1);
    r.onupgradeneeded=()=>{db=r.result;["workouts","drafts","progress","checkins","settings"].forEach(s=>{if(!db.objectStoreNames.contains(s))db.createObjectStore(s,{keyPath:"id"})})};
    r.onsuccess=()=>{db=r.result;res(db)};r.onerror=()=>rej(r.error)
  })
}
function put(store,obj){return new Promise((res,rej)=>{let tx=db.transaction(store,"readwrite"),r=tx.objectStore(store).put(obj);r.onsuccess=()=>res(obj);r.onerror=()=>rej(r.error)})}
function get(store,id){return new Promise((res,rej)=>{let tx=db.transaction(store),r=tx.objectStore(store).get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function all(store){return new Promise((res,rej)=>{let tx=db.transaction(store),r=tx.objectStore(store).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error)})}
function del(store,id){return new Promise((res,rej)=>{let tx=db.transaction(store,"readwrite"),r=tx.objectStore(store).delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function clearStore(store){return new Promise((res,rej)=>{let tx=db.transaction(store,"readwrite"),r=tx.objectStore(store).clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}

const iso=d=>d.toISOString().slice(0,10);
function phaseFor(w){w=+w;if(w<=4)return["Adaptation","Technique and consistency. Keep most working sets around RPE 7–8."];if(w<=7)return["Progression","Add reps first. When every set reaches the top of the range at RPE ≤ 8, add 2.5–5% load."];if(w===8)return["Deload","Reduce total sets by 30–40% while keeping movement quality high."];return["Peak","Compounds mostly 6–10 reps; isolation 10–15. Use RPE 9 sparingly."]}
function toast(msg){toastEl.textContent=msg;toastEl.classList.remove("hidden");setTimeout(()=>toastEl.classList.add("hidden"),1800)}
const toastEl=document.getElementById("toast");

let schedule={d1:2,d2:4,d3:6,t1:"18:00",t2:"18:00",t3:"10:00"}, currentWeek=1;
let timerLeft=90,timerBase=90,timerId=null,deferredPrompt=null;

async function initSettings(){
  const s=await get("settings","main");
  if(s){schedule=s.schedule||schedule;currentWeek=s.week||1}
  else await put("settings",{id:"main",schedule,currentWeek});
  for(let i=1;i<=12;i++){let o=document.createElement("option");o.value=i;o.textContent="Week "+i;weekSelect.appendChild(o)}
  weekSelect.value=currentWeek;
  fillDay(sched1,schedule.d1);fillDay(sched2,schedule.d2);fillDay(sched3,schedule.d3);time1.value=schedule.t1;time2.value=schedule.t2;time3.value=schedule.t3;
}
function fillDay(el,val){DAYS.forEach((d,i)=>{let o=document.createElement("option");o.value=i;o.textContent=d;el.appendChild(o)});el.value=val}

async function navTo(p){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.getElementById(p).classList.add("active");document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.toggle("active",x.dataset.page===p));if(p==="progress")await renderProgress();if(p==="checkin")await renderCoachSummary();if(p==="learn")renderLearn()}
document.querySelectorAll(".bottom-nav button").forEach(b=>b.onclick=()=>navTo(b.dataset.page));

function currentWeekStart(){let n=new Date(),s=new Date(n);s.setDate(n.getDate()-n.getDay());s.setHours(0,0,0,0);return s}
async function workoutsThisWeek(){let h=await all("workouts"),s=currentWeekStart(),e=new Date(s);e.setDate(s.getDate()+7);return h.filter(x=>{let d=new Date(x.date+"T12:00:00");return d>=s&&d<e})}
async function prCount(){let h=await all("workouts"),m={};h.forEach(w=>w.exercises?.forEach(e=>e.sets?.forEach(s=>{if(s.done&&s.weight&&s.reps){let sc=s.weight*s.reps;if(!m[e.name]||sc>m[e.name])m[e.name]=sc}})));return Object.keys(m).length}
async function renderHome(){
 let p=await all("progress"),latest=p.sort((a,b)=>a.date.localeCompare(b.date)).at(-1),wh=await workoutsThisWeek(),allW=await all("workouts");
 kpiWeight.textContent=latest?.weight?latest.weight+" kg":"—";kpiSessions.textContent=wh.length+"/3";kpiPRs.textContent=await prCount();kpiAdherence.textContent=Math.min(100,Math.round(allW.length/(Math.max(1,currentWeek)*3)*100))+"%";
 let [ph,n]=phaseFor(currentWeek);phaseBadge.textContent=ph;phaseNote.textContent=n;renderWeekStrip(wh);let next=(wh.length%3)+1;todayTitle.textContent=`Day ${next} — ${WORKOUTS[next].name}`;todaySummary.textContent=`${WORKOUTS[next].focus}. ${WORKOUTS[next].ex.length} exercises.`;
}
function renderWeekStrip(wh){
 let s=currentWeekStart(),map={};[[schedule.d1,1],[schedule.d2,2],[schedule.d3,3]].forEach(([d,i])=>map[d]=i);weekStrip.innerHTML="";
 for(let i=0;i<7;i++){let d=new Date(s);d.setDate(s.getDate()+i);let wid=map[i],done=wid&&wh.some(x=>x.date===iso(d)&&x.workout===wid);let el=document.createElement("div");el.className="daybox"+(wid?" train":"")+(done?" done":"");el.innerHTML=`<strong>${DAYS[i].slice(0,3)}</strong>${d.getDate()}${wid?`<br>${WORKOUTS[wid].name}`:""}`;weekStrip.appendChild(el)}
}
weekSelect.onchange=async()=>{currentWeek=+weekSelect.value;await put("settings",{id:"main",schedule,currentWeek});await renderHome()};

function renderWeekCards(){
 weekCards.innerHTML="";
 [1,2,3].forEach(i=>{let c=document.createElement("div");c.className="card";c.innerHTML=`<div class="eyebrow">DAY ${i}</div><h2>${WORKOUTS[i].name}</h2><p class="muted">${WORKOUTS[i].focus}</p>`+WORKOUTS[i].ex.map(e=>`<div class="history-item"><strong>${e.n}</strong><div class="meta">${e.sets} sets · ${e.reps} · rest ${e.rest}s · RPE ${e.target}</div><span class="pill">${e.primary.join(", ")}</span><span class="pill secondary">${e.secondary.join(", ")}</span></div>`).join("");weekCards.appendChild(c)})
}
saveSchedule.onclick=async()=>{schedule={d1:+sched1.value,d2:+sched2.value,d3:+sched3.value,t1:time1.value,t2:time2.value,t3:time3.value};await put("settings",{id:"main",schedule,currentWeek});await renderHome();toast("Schedule saved")};

function draftId(){return `draft-${workoutDate.value}-${workoutSelect.value}`}
async function latestCompletedExercise(name){
 let h=(await all("workouts")).sort((a,b)=>b.date.localeCompare(a.date));
 for(const w of h){let e=w.exercises?.find(x=>x.name===name);if(e)return e}return null
}
function parseRange(reps){let nums=String(reps).match(/\d+/g)||[];return {low:+nums[0]||0,high:+nums.at(-1)||0}}
async function suggestion(ex){
 let last=await latestCompletedExercise(ex.n);if(!last)return {text:"First logged session — choose a comfortable starting load at the target RPE.",prev:"—",suggested:"Start conservative"};
 let done=last.sets.filter(s=>s.done&&s.weight&&s.reps),r=parseRange(ex.reps);if(!done.length)return {text:"Repeat the previous load.",prev:"No completed sets",suggested:"Same load"};
 let prev=`${done.at(-1).weight} kg × ${done.at(-1).reps}`;
 let allTop=done.every(s=>s.reps>=r.high && (s.rpe||8)<=8),failed=done.some(s=>s.reps<r.low),allHard=done.every(s=>(s.rpe||0)>=9.5),lastSet=done.at(-1);
 if(allHard)return {text:"Deload this lift next session.",prev,suggested:`~${(lastSet.weight*.9).toFixed(1)} kg`};
 if(failed)return {text:"Reduce load about 5% next time.",prev,suggested:`~${(lastSet.weight*.95).toFixed(1)} kg`};
 if(allTop)return {text:"Increase load 2.5–5% next time.",prev,suggested:`${(lastSet.weight*1.025).toFixed(1)}–${(lastSet.weight*1.05).toFixed(1)} kg`};
 if((lastSet.rpe||0)>=9)return {text:"Keep the same load and aim for +1 rep.",prev,suggested:`${lastSet.weight} kg`};
 return {text:"Keep the same load and improve reps or form.",prev,suggested:`${lastSet.weight} kg`}
}
async function renderWorkout(){
 let id=+workoutSelect.value,w=WORKOUTS[id],d=await get("drafts",draftId());workoutTitle.textContent=`Day ${id} — ${w.name}`;workoutFocus.textContent=w.focus;exerciseList.innerHTML="";
 for(let ei=0;ei<w.ex.length;ei++){let e=w.ex[ei],sug=await suggestion(e),sets="";
   for(let s=0;s<e.sets;s++){let v=d?.data?.[ei]?.sets?.[s]||{};sets+=`<div class="setrow"><span>S${s+1}</span><input data-e="${ei}" data-s="${s}" data-f="weight" type="number" step=".5" placeholder="kg" value="${v.weight??""}"><input data-e="${ei}" data-s="${s}" data-f="reps" placeholder="reps" value="${v.reps??""}"><input data-e="${ei}" data-s="${s}" data-f="rpe" type="number" step=".5" min="1" max="10" placeholder="RPE" value="${v.rpe??""}"><input class="check" data-e="${ei}" data-s="${s}" data-f="done" type="checkbox" ${v.done?"checked":""}></div>`}
   let card=document.createElement("div");card.className="card exercise-card";card.innerHTML=`<div class="exercise-summary" data-toggle="${ei}"><div><div class="exname">${e.n}</div><div class="meta">${e.sets} × ${e.reps} · rest ${e.rest}s · target RPE ${e.target}</div></div><span class="badge">Tap to expand</span></div><div class="exercise-body ${ei===0?"":"hidden"}" id="body-${ei}"><div class="musclemap"><div class="musclebox"><strong>Primary</strong><div>${e.primary.join(", ")}</div></div><div class="musclebox"><strong>Secondary</strong><div>${e.secondary.join(", ")}</div></div></div><div><span class="pill">Cue: ${e.cue}</span><span class="pill secondary">Sub: ${e.sub}</span></div><div class="compare"><div><strong>Previous</strong><span>${sug.prev}</span></div><div><strong>Suggested</strong><span>${sug.suggested}</span></div><div><strong>Coach</strong><span>${sug.text}</span></div></div><div class="links"><a class="learn-link" target="_blank" rel="noopener" href="${e.yt}">Watch YouTube demos</a><button class="learn-link startRest" data-rest="${e.rest}">Start ${e.rest}s rest</button></div>${sets}</div>`;exerciseList.appendChild(card)
 }
 exerciseList.querySelectorAll(".exercise-summary").forEach(x=>x.onclick=()=>document.getElementById("body-"+x.dataset.toggle).classList.toggle("hidden"));
 exerciseList.querySelectorAll(".startRest").forEach(x=>x.onclick=()=>startRest(+x.dataset.rest));
 sessionRPE.value=d?.data?.sessionRPE||"";sessionScore.value=d?.data?.sessionScore||"";sessionNotes.value=d?.data?.notes||""
}
function gatherDraft(){let id=+workoutSelect.value,w=WORKOUTS[id],o={};w.ex.forEach((e,ei)=>o[ei]={sets:Array.from({length:e.sets},()=>({}))});document.querySelectorAll("[data-e]").forEach(el=>{let e=+el.dataset.e,s=+el.dataset.s,f=el.dataset.f;o[e].sets[s][f]=el.type==="checkbox"?el.checked:(el.value===""?"":+el.value)});o.sessionRPE=sessionRPE.value;o.sessionScore=sessionScore.value;o.notes=sessionNotes.value;return o}
async function saveDraftNow(){await put("drafts",{id:draftId(),date:workoutDate.value,workout:+workoutSelect.value,data:gatherDraft()});toast("Draft saved")}
saveDraft.onclick=saveDraftNow;
exerciseList.addEventListener("change",()=>saveDraftNow());
workoutSelect.onchange=renderWorkout;workoutDate.onchange=renderWorkout;

finishWorkout.onclick=async()=>{
 let id=+workoutSelect.value,d=gatherDraft(),exercises=WORKOUTS[id].ex.map((e,ei)=>({name:e.n,sets:d[ei].sets})),volume=0,prs=0;
 exercises.forEach(e=>e.sets.forEach(s=>{if(s.done&&s.weight&&s.reps)volume+=s.weight*s.reps}));
 let prev=await all("workouts"),best={};prev.forEach(w=>w.exercises?.forEach(e=>e.sets?.forEach(s=>{if(s.done&&s.weight&&s.reps){let sc=s.weight*s.reps;if(!best[e.name]||sc>best[e.name])best[e.name]=sc}})));
 exercises.forEach(e=>e.sets.forEach(s=>{if(s.done&&s.weight&&s.reps){let sc=s.weight*s.reps;if(!best[e.name]||sc>best[e.name])prs++}}));
 await put("workouts",{id:`${workoutDate.value}-${id}-${Date.now()}`,date:workoutDate.value,workout:id,name:WORKOUTS[id].name,volume:Math.round(volume),sessionRPE:+d.sessionRPE||null,score:+d.sessionScore||null,notes:d.notes,prs,exercises});
 await del("drafts",draftId());toast(`Workout saved${prs?` · ${prs} PR${prs>1?"s":""}`:""}`);await renderWorkout();await renderHome()
};

function startRest(sec){timerBase=timerLeft=sec;showTimer();if(timerId)clearInterval(timerId);timerId=setInterval(()=>{timerLeft--;showTimer();if(timerLeft<=0){clearInterval(timerId);timerId=null;navigator.vibrate?.([150,80,150]);toast("Rest complete")}},1000)}
function showTimer(){document.title=`${Math.max(0,timerLeft)}s · Farhad Trainer`}

function renderLearn(){
 let q=(learnSearch.value||"").toLowerCase();learnList.innerHTML="";
 let allx=[];Object.values(WORKOUTS).forEach(w=>w.ex.forEach(e=>{if(!allx.find(x=>x.n===e.n))allx.push(e)}));
 allx.filter(e=>e.n.toLowerCase().includes(q)).forEach(e=>{let c=document.createElement("div");c.className="card learn-card";c.innerHTML=`<div class="exname">${e.n}</div><div class="meta">Target RPE ${e.target} · rest ${e.rest}s</div><div class="thumb">Muscles: ${e.primary.join(" + ")}</div><div class="musclemap"><div class="musclebox"><strong>Primary</strong><div>${e.primary.join(", ")}</div></div><div class="musclebox"><strong>Secondary</strong><div>${e.secondary.join(", ")}</div></div></div><p class="muted"><strong>How:</strong> ${e.cue}</p><p class="muted"><strong>Alternative:</strong> ${e.sub}</p><a class="learn-link" target="_blank" rel="noopener" href="${e.yt}">Open YouTube demos</a>`;learnList.appendChild(c)})
}
learnSearch.oninput=renderLearn;

saveProgress.onclick=async()=>{await put("progress",{id:`${iso(new Date())}-${Date.now()}`,date:iso(new Date()),weight:+bodyWeight.value||null,waist:+waist.value||null,chest:+chest.value||null,arm:+arm.value||null,thigh:+thigh.value||null,note:progressNote.value});bodyWeight.value=waist.value=chest.value=arm.value=thigh.value=progressNote.value="";toast("Progress saved");await renderProgress();await renderHome()};

function drawChart(canvas,pts,label){const ctx=canvas.getContext("2d"),W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);ctx.strokeStyle="#e2e8f0";for(let i=1;i<5;i++){let y=i*H/5;ctx.beginPath();ctx.moveTo(45,y);ctx.lineTo(W-15,y);ctx.stroke()}if(!pts.length){ctx.fillStyle="#64748b";ctx.font="16px sans-serif";ctx.fillText("No data yet",20,34);return}let vals=pts.map(p=>p.v),min=Math.min(...vals),max=Math.max(...vals);if(min===max){min-=1;max+=1}let x=i=>45+i*(W-65)/Math.max(1,pts.length-1),y=v=>H-25-(v-min)*(H-50)/(max-min);ctx.strokeStyle="#0b1220";ctx.lineWidth=3;ctx.beginPath();pts.forEach((p,i)=>{let X=x(i),Y=y(p.v);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)});ctx.stroke();ctx.fillStyle="#0b1220";pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(x(i),y(p.v),4,0,Math.PI*2);ctx.fill()});ctx.fillStyle="#64748b";ctx.font="12px sans-serif";ctx.fillText(`${label}: ${vals.at(-1)}`,45,16)}
async function renderProgress(){
 let p=(await all("progress")).sort((a,b)=>a.date.localeCompare(b.date)),h=(await all("workouts")).sort((a,b)=>b.date.localeCompare(a.date));
 progressHistory.innerHTML=p.slice().reverse().slice(0,10).map(x=>`<div class="history-item"><strong>${x.date}</strong> · ${x.weight??"—"} kg · waist ${x.waist??"—"} · chest ${x.chest??"—"} · arm ${x.arm??"—"} · thigh ${x.thigh??"—"}${x.note?`<div class="muted">${x.note}</div>`:""}</div>`).join("")||'<div class="muted">No progress entries yet.</div>';
 workoutHistory.innerHTML=h.slice(0,12).map(x=>`<div class="history-item"><strong>${x.date}</strong> · ${x.name} · volume ${x.volume} · PRs ${x.prs||0}<div class="muted">${x.notes||""}</div></div>`).join("")||'<div class="muted">No saved workouts yet.</div>';
 drawChart(weightChart,p.filter(x=>x.weight).map(x=>({v:x.weight,date:x.date})),"Weight");let by={};h.forEach(x=>by[x.date]=(by[x.date]||0)+(x.volume||0));drawChart(volumeChart,Object.entries(by).sort().map(([date,v])=>({date,v})),"Volume")
}

saveCheckin.onclick=async()=>{await put("checkins",{id:`week-${currentWeek}-${Date.now()}`,date:iso(new Date()),week:currentWeek,weight:+ciWeight.value||null,sessions:+ciSessions.value||0,rpe:+ciRPE.value||0,sleep:+ciSleep.value||0,energy:+ciEnergy.value||0,pain:ciPain.value,good:ciGood.value,difficult:ciDifficult.value,lifts:ciLifts.value});toast("Check-in saved");await renderCoachSummary()};
async function renderCoachSummary(){let c=(await all("checkins")).sort((a,b)=>a.date.localeCompare(b.date));if(!c.length){coachSummary.textContent="Complete your first check-in to get a summary.";return}let x=c.at(-1),bits=[];if(x.sessions<3)bits.push("Adherence was below plan, so prioritize completing all three sessions before adding volume.");if(x.rpe>=9.5)bits.push("Effort was very high. Keep compounds away from failure and reduce load if a lift repeatedly reaches RPE 9.5–10.");if(x.energy<=2||x.sleep<=2)bits.push("Recovery looks low. Reduce volume about 15% next week and prioritize sleep and nutrition.");if(x.pain==="Yes")bits.push("You reported pain. Substitute the aggravating movement and seek professional evaluation if it persists or feels sharp/joint-related.");if(x.lifts==="Down")bits.push("Key lifts trended down. Hold or slightly reduce loads and rebuild reps with clean technique.");if(!bits.length)bits.push("Recovery and adherence look solid. Keep progressing and add load only when all sets hit the top of the rep range at RPE 8 or below.");coachSummary.textContent=bits.join(" ")}

function nextDateForDow(dow){let d=new Date(),diff=(dow-d.getDay()+7)%7;d.setDate(d.getDate()+diff);return d}
function dtStr(d,time){let [hh,mm]=(time||"18:00").split(":").map(Number),x=new Date(d);x.setHours(hh,mm,0,0);let z=n=>String(n).padStart(2,"0");return`${x.getFullYear()}${z(x.getMonth()+1)}${z(x.getDate())}T${z(x.getHours())}${z(x.getMinutes())}00`}
function exportICS(){let pairs=[[schedule.d1,schedule.t1,1],[schedule.d2,schedule.t2,2],[schedule.d3,schedule.t3,3]],lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Farhad Trainer V2//EN","CALSCALE:GREGORIAN"];pairs.forEach(([dow,time,id])=>{let d=nextDateForDow(dow),[hh,mm]=time.split(":").map(Number),end=new Date(d);end.setHours(hh,mm+45,0,0);lines.push("BEGIN:VEVENT",`UID:ft-v2-${id}-${Date.now()}@local`,`DTSTART:${dtStr(d,time)}`,`DTEND:${dtStr(end,`${end.getHours()}:${end.getMinutes()}`)}`,"RRULE:FREQ=WEEKLY;COUNT=12",`SUMMARY:Farhad Trainer — Day ${id}: ${WORKOUTS[id].name}`,`DESCRIPTION:${WORKOUTS[id].ex.map(e=>e.n+" "+e.sets+"x"+e.reps).join("\\n")}`,"END:VEVENT")});lines.push("END:VCALENDAR");let blob=new Blob([lines.join("\r\n")],{type:"text/calendar;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Farhad_Trainer_V2_12_Week_Calendar.ics";a.click()}
addCalendarHome.onclick=exportICS;addCalendarWeek.onclick=exportICS;
startNext.onclick=async()=>{let wh=await workoutsThisWeek(),n=(wh.length%3)+1;workoutSelect.value=n;await renderWorkout();navTo("workout")};

exportData.onclick=async()=>{let data={settings:await get("settings","main"),workouts:await all("workouts"),drafts:await all("drafts"),progress:await all("progress"),checkins:await all("checkins")};let blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Farhad_Trainer_V2_Backup.json";a.click()};
resetAll.onclick=async()=>{if(confirm("Delete all Farhad Trainer V2 data on this device?")){for(const s of ["workouts","drafts","progress","checkins","settings"])await clearStore(s);location.reload()}};

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installBtn.classList.remove("hidden")});
installBtn.onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.classList.add("hidden")};
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));

(async()=>{await openDB();await initSettings();renderWeekCards();workoutDate.value=iso(new Date());await renderWorkout();renderLearn();await renderProgress();await renderCoachSummary();await renderHome()})();
