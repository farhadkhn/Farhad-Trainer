
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WORKOUTS={
1:{name:"Push + Core",focus:"Chest · shoulders · triceps · core",ex:[
 {n:"Incline Dumbbell Press",sets:4,reps:"8–10",rest:120,target:"7–8",cue:"Lower under control; drive evenly.",sub:"Feet-elevated push-ups",primary:["Upper chest"],secondary:["Front delts","Triceps"]},
 {n:"Flat Dumbbell Press",sets:3,reps:"10–12",rest:90,target:"8",cue:"Keep shoulder blades tucked.",sub:"Dumbbell floor press",primary:["Chest"],secondary:["Front delts","Triceps"]},
 {n:"Standing Dumbbell Shoulder Press",sets:3,reps:"8–10",rest:90,target:"8",cue:"Brace core; avoid leaning back.",sub:"Seated dumbbell press",primary:["Shoulders"],secondary:["Triceps","Core"]},
 {n:"Lateral Raise",sets:3,reps:"12–15",rest:60,target:"8",cue:"Lead with elbows; stop around shoulder height.",sub:"Band lateral raise",primary:["Side delts"],secondary:["Upper traps"]},
 {n:"Overhead Triceps Extension",sets:3,reps:"12",rest:60,target:"8",cue:"Keep elbows close and ribs down.",sub:"Close-grip push-ups",primary:["Triceps"],secondary:["Core"]},
 {n:"Plank",sets:3,reps:"45–60 sec",rest:45,target:"7",cue:"Keep ribs and pelvis stacked.",sub:"Dead bug",primary:["Core"],secondary:["Glutes","Shoulders"]}
]},
2:{name:"Pull + Core",focus:"Back · rear delts · biceps · core",ex:[
 {n:"One-arm Dumbbell Row",sets:4,reps:"8–10",rest:90,target:"8",cue:"Pull elbow toward your hip.",sub:"Chest-supported dumbbell row",primary:["Lats","Mid-back"],secondary:["Rear delts","Biceps"]},
 {n:"Dumbbell Pullover",sets:4,reps:"10–12",rest:90,target:"8",cue:"Keep ribs down and feel the lats stretch.",sub:"Band straight-arm pulldown",primary:["Lats"],secondary:["Chest","Triceps"]},
 {n:"Rear Delt Fly",sets:3,reps:"12–15",rest:60,target:"8",cue:"Move through shoulders, not the neck.",sub:"Band reverse fly",primary:["Rear delts"],secondary:["Mid-back"]},
 {n:"Dumbbell Curl",sets:3,reps:"10–12",rest:60,target:"8",cue:"Keep elbows by your sides.",sub:"Alternating curl",primary:["Biceps"],secondary:["Forearms"]},
 {n:"Hammer Curl",sets:2,reps:"12",rest:60,target:"8",cue:"Control the lowering phase.",sub:"Cross-body hammer curl",primary:["Biceps","Brachialis"],secondary:["Forearms"]},
 {n:"Side Plank",sets:3,reps:"30–45 sec/side",rest:45,target:"7",cue:"Keep hips high and body straight.",sub:"Suitcase hold",primary:["Obliques"],secondary:["Glutes","Shoulders"]}
]},
3:{name:"Legs + Shoulders",focus:"Quads · glutes · hamstrings · delts",ex:[
 {n:"Goblet Squat",sets:4,reps:"10",rest:120,target:"8",cue:"Chest tall; knees track over toes.",sub:"Dumbbell front squat",primary:["Quads","Glutes"],secondary:["Core","Adductors"]},
 {n:"Dumbbell Romanian Deadlift",sets:4,reps:"8–10",rest:120,target:"8",cue:"Push hips back; keep dumbbells close.",sub:"Single-leg dumbbell RDL",primary:["Hamstrings","Glutes"],secondary:["Back extensors","Grip"]},
 {n:"Bulgarian Split Squat",sets:3,reps:"10/leg",rest:90,target:"8",cue:"Stay balanced and descend under control.",sub:"Reverse dumbbell lunge",primary:["Quads","Glutes"],secondary:["Hamstrings","Core"]},
 {n:"Standing Calf Raise",sets:3,reps:"15",rest:60,target:"8",cue:"Pause at the top and lower fully.",sub:"Single-leg calf raise",primary:["Calves"],secondary:["Ankle stabilizers"]},
 {n:"Lateral Raise",sets:3,reps:"15",rest:60,target:"8",cue:"Lead with elbows.",sub:"Band lateral raise",primary:["Side delts"],secondary:["Upper traps"]},
 {n:"Farmer Carry",sets:3,reps:"40–60 sec",rest:60,target:"7",cue:"Stand tall; shoulders down.",sub:"Suitcase carry",primary:["Grip","Core"],secondary:["Traps","Glutes"]}
]}};

const L=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
const S=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const K={schedule:"ft_schedule",history:"ft_history",progress:"ft_progress",prs:"ft_prs",week:"ft_week",checkins:"ft_checkins"};
let schedule=L(K.schedule,{d1:2,d2:4,d3:6,t1:"18:00",t2:"18:00",t3:"10:00"});
let timerSec=90,timerLeft=90,timerId=null,deferredPrompt=null;

function phaseFor(w){w=+w;if(w<=4)return["Adaptation","Technique and consistency. Keep most working sets around RPE 7–8."];if(w<=7)return["Progression","Add reps first. When every set reaches the top of the range at RPE ≤ 8, add 2.5–5% load."];if(w===8)return["Deload","Reduce total sets by 30–40% while keeping movement quality high."];return["Peak","Compounds mostly 6–10 reps; isolation 10–15. Use RPE 9 sparingly."]}

function iso(d){return d.toISOString().slice(0,10)}
function currentWeekStart(){let n=new Date(),s=new Date(n);s.setDate(n.getDate()-n.getDay());s.setHours(0,0,0,0);return s}
function sessionThisWeek(){let h=L(K.history,[]),s=currentWeekStart(),e=new Date(s);e.setDate(s.getDate()+7);return h.filter(x=>{let d=new Date(x.date+"T12:00:00");return d>=s&&d<e}).length}
function adherence(){let h=L(K.history,[]),w=+weekSelect.value||1;return Math.min(100,Math.round(h.length/(w*3)*100))}
function prsCount(){return Object.keys(L(K.prs,{})).length}

for(let i=1;i<=12;i++){let o=document.createElement("option");o.value=i;o.textContent="Week "+i;weekSelect.appendChild(o)}
weekSelect.value=localStorage.getItem(K.week)||"1";
function fillDay(el,val){DAYS.forEach((d,i)=>{let o=document.createElement("option");o.value=i;o.textContent=d;el.appendChild(o)});el.value=val}
fillDay(sched1,schedule.d1);fillDay(sched2,schedule.d2);fillDay(sched3,schedule.d3);time1.value=schedule.t1;time2.value=schedule.t2;time3.value=schedule.t3;
workoutDate.value=iso(new Date());

function navTo(p){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.getElementById(p).classList.add("active");document.querySelectorAll(".bottom-nav button").forEach(x=>x.classList.toggle("active",x.dataset.page===p));if(p==="progress")renderProgress();if(p==="checkin")renderCoachSummary()}
document.querySelectorAll(".bottom-nav button").forEach(b=>b.onclick=()=>navTo(b.dataset.page));

function renderHome(){
 let prog=L(K.progress,[]),latest=prog[prog.length-1];
 kpiWeight.textContent=latest?.weight?latest.weight+" kg":"—";
 kpiSessions.textContent=sessionThisWeek()+"/3";
 kpiPRs.textContent=prsCount();
 let a=adherence();kpiAdherence.textContent=a+"%";
 let [ph,note]=phaseFor(weekSelect.value);phaseBadge.textContent=ph;phaseNote.textContent=note;
 renderWeekStrip();
}
function renderWeekStrip(){
 let h=L(K.history,[]),s=currentWeekStart(),map={};[[schedule.d1,1],[schedule.d2,2],[schedule.d3,3]].forEach(([d,i])=>map[d]=i);
 weekStrip.innerHTML="";
 for(let i=0;i<7;i++){let d=new Date(s);d.setDate(s.getDate()+i);let wid=map[i],done=wid&&h.some(x=>x.date===iso(d)&&x.workout===wid);let el=document.createElement("div");el.className="daybox"+(wid?" train":"")+(done?" done":"");el.innerHTML=`<strong>${DAYS[i].slice(0,3)}</strong>${d.getDate()}${wid?`<br>${WORKOUTS[wid].name}`:""}`;weekStrip.appendChild(el)}
}
weekSelect.onchange=()=>{localStorage.setItem(K.week,weekSelect.value);renderHome()};

function renderWeekCards(){
 weekCards.innerHTML="";
 [1,2,3].forEach(i=>{let c=document.createElement("div");c.className="card";c.innerHTML=`<div class="eyebrow">DAY ${i}</div><h2>${WORKOUTS[i].name}</h2><p class="muted">${WORKOUTS[i].focus}</p>`+WORKOUTS[i].ex.map(e=>`<div class="exercise"><div class="exname">${e.n}</div><div class="meta">${e.sets} sets · ${e.reps} · rest ${e.rest}s · RPE ${e.target}</div><div><span class="pill">${e.primary.join(", ")}</span><span class="pill">${e.secondary.join(", ")}</span></div><div class="meta">Substitute: ${e.sub}</div></div>`).join("");weekCards.appendChild(c)})
}
saveSchedule.onclick=()=>{schedule={d1:+sched1.value,d2:+sched2.value,d3:+sched3.value,t1:time1.value,t2:time2.value,t3:time3.value};S(K.schedule,schedule);renderHome();alert("Schedule saved.")};

function draftKey(){return "ft_draft_"+workoutSelect.value}
function lastExercisePerformance(exName){
 let h=L(K.history,[]).slice().reverse();
 for(const s of h){let x=s.exercises?.find(e=>e.name===exName);if(x)return x}
 return null
}
function nextSuggestion(ex){
 let last=lastExercisePerformance(ex.n);if(!last)return "First logged session — choose a comfortable starting load at the target RPE.";
 let completed=last.sets.filter(s=>s.done&&s.weight&&s.reps), top=parseInt(String(ex.reps).match(/\d+$/)?.[0]||"0");
 if(!completed.length)return "No completed sets last time — repeat the previous load.";
 let allTop=completed.every(s=>(+s.reps)>=top && (+s.rpe||8)<=8);
 let failed=completed.some(s=>(+s.reps)<parseInt(String(ex.reps).match(/\d+/)?.[0]||"0"));
 let allHard=completed.every(s=>(+s.rpe||0)>=9.5);
 if(allHard)return "Deload this lift next session: reduce load ~10% and keep the same reps.";
 if(failed)return "Reduce load about 5% next time.";
 if(allTop)return "Increase load 2.5–5% next time.";
 let lastSet=completed[completed.length-1];if((+lastSet.rpe)>=9)return "Keep the same load and aim for +1 rep next time.";
 return "Keep the same load and improve reps or form.";
}
function renderWorkout(){
 let id=+workoutSelect.value,w=WORKOUTS[id],d=L(draftKey(),{});
 workoutTitle.textContent=`Day ${id} — ${w.name}`;workoutFocus.textContent=w.focus;exerciseList.innerHTML="";
 w.ex.forEach((e,ei)=>{let sets="";for(let s=0;s<e.sets;s++){let v=d[ei]?.sets?.[s]||{};sets+=`<div class="setrow"><span>Set ${s+1}</span><input data-e="${ei}" data-s="${s}" data-f="weight" type="number" step=".5" placeholder="kg" value="${v.weight??""}"><input data-e="${ei}" data-s="${s}" data-f="reps" placeholder="reps" value="${v.reps??""}"><input data-e="${ei}" data-s="${s}" data-f="rpe" type="number" step=".5" min="1" max="10" placeholder="RPE" value="${v.rpe??""}"><input class="check" data-e="${ei}" data-s="${s}" data-f="done" type="checkbox" ${v.done?"checked":""}></div>`}
 let box=document.createElement("div");box.className="exercise";box.innerHTML=`<div class="exhead"><div><div class="exname">${e.n}</div><div class="meta">${e.sets} × ${e.reps} · rest ${e.rest}s · target RPE ${e.target}</div></div><span class="badge">Home gym</span></div><div class="musclemap"><div class="musclebox"><strong>Primary</strong><div>${e.primary.join(", ")}</div></div><div class="musclebox"><strong>Secondary</strong><div>${e.secondary.join(", ")}</div></div></div><div><span class="pill">Cue: ${e.cue}</span><span class="pill">Sub: ${e.sub}</span></div><div class="suggest"><strong>Next-session suggestion:</strong> ${nextSuggestion(e)}</div>${sets}`;exerciseList.appendChild(box)})
 sessionRPE.value=d.sessionRPE||"";sessionScore.value=d.sessionScore||"";sessionDuration.value=d.sessionDuration||45;sessionNotes.value=d.notes||""
}
function gatherDraft(){let id=+workoutSelect.value,w=WORKOUTS[id],o={};w.ex.forEach((e,ei)=>o[ei]={sets:Array.from({length:e.sets},()=>({}))});document.querySelectorAll("[data-e]").forEach(el=>{let e=+el.dataset.e,s=+el.dataset.s,f=el.dataset.f;o[e].sets[s][f]=el.type==="checkbox"?el.checked:el.value});o.sessionRPE=sessionRPE.value;o.sessionScore=sessionScore.value;o.sessionDuration=sessionDuration.value;o.notes=sessionNotes.value;return o}
exerciseList.addEventListener("change",()=>S(draftKey(),gatherDraft()));workoutSelect.onchange=renderWorkout;
clearWorkout.onclick=()=>{if(confirm("Clear this workout's current entries?")){localStorage.removeItem(draftKey());renderWorkout()}};

finishWorkout.onclick=()=>{
 let id=+workoutSelect.value,d=gatherDraft(),prs=L(K.prs,{}),prUpdates=0,volume=0,exercises=[];
 WORKOUTS[id].ex.forEach((e,ei)=>{let sets=d[ei].sets.map(s=>({weight:+s.weight||0,reps:+s.reps||0,rpe:+s.rpe||0,done:!!s.done}));sets.forEach(s=>{if(s.done&&s.weight&&s.reps){volume+=s.weight*s.reps;let score=s.weight*s.reps;if(!prs[e.n]||score>prs[e.n].score){prs[e.n]={score,weight:s.weight,reps:s.reps,date:workoutDate.value};prUpdates++}}});exercises.push({name:e.n,sets})});
 S(K.prs,prs);let h=L(K.history,[]);h.push({date:workoutDate.value,workout:id,name:WORKOUTS[id].name,volume:Math.round(volume),sessionRPE:+d.sessionRPE||null,score:+d.sessionScore||null,duration:+d.sessionDuration||45,notes:d.notes,prUpdates,exercises});S(K.history,h);localStorage.removeItem(draftKey());alert(`Workout saved${prUpdates?` — ${prUpdates} new PR${prUpdates>1?"s":""}!`:"."}`);renderWorkout();renderHome();renderProgress()
};

function nextWorkoutId(){return (sessionThisWeek()%3)+1}
startNext.onclick=()=>{workoutSelect.value=nextWorkoutId();renderWorkout();navTo("workout")};openCheckin.onclick=()=>navTo("checkin");

function saveProgressEntry(){
 let p=L(K.progress,[]);p.push({date:iso(new Date()),weight:+bodyWeight.value||null,waist:+waist.value||null,chest:+chest.value||null,arm:+arm.value||null,thigh:+thigh.value||null,note:progressNote.value});S(K.progress,p);bodyWeight.value=waist.value=chest.value=arm.value=thigh.value=progressNote.value="";renderProgress();renderHome()
}
saveProgress.onclick=saveProgressEntry;

function drawChart(canvas,pts,label){
 const ctx=canvas.getContext("2d"),W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);ctx.strokeStyle="#e2e8f0";ctx.lineWidth=1;for(let i=1;i<5;i++){let y=i*H/5;ctx.beginPath();ctx.moveTo(45,y);ctx.lineTo(W-15,y);ctx.stroke()}
 if(!pts.length){ctx.fillStyle="#64748b";ctx.font="16px sans-serif";ctx.fillText("No data yet",20,34);return}
 let vals=pts.map(p=>p.v),min=Math.min(...vals),max=Math.max(...vals);if(min===max){min-=1;max+=1}let x=i=>45+i*(W-65)/Math.max(1,pts.length-1),y=v=>H-25-(v-min)*(H-50)/(max-min);
 ctx.strokeStyle="#0f172a";ctx.lineWidth=3;ctx.beginPath();pts.forEach((p,i)=>{let X=x(i),Y=y(p.v);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)});ctx.stroke();ctx.fillStyle="#0f172a";pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(x(i),y(p.v),4,0,Math.PI*2);ctx.fill()});ctx.fillStyle="#64748b";ctx.font="12px sans-serif";ctx.fillText(`${label}: ${vals[vals.length-1]}`,45,16)
}
function renderProgress(){
 let p=L(K.progress,[]),h=L(K.history,[]);progressHistory.innerHTML=p.slice().reverse().slice(0,10).map(x=>`<div class="history-item"><strong>${x.date}</strong> · ${x.weight??"—"} kg · waist ${x.waist??"—"} cm · chest ${x.chest??"—"} cm · arm ${x.arm??"—"} cm · thigh ${x.thigh??"—"} cm${x.note?`<div class="muted">${x.note}</div>`:""}</div>`).join("")||'<div class="muted">No progress entries yet.</div>';
 drawChart(weightChart,p.filter(x=>x.weight).map(x=>({v:x.weight,date:x.date})),"Weight");
 let by={};h.forEach(x=>by[x.date]=(by[x.date]||0)+(x.volume||0));drawChart(volumeChart,Object.entries(by).map(([date,v])=>({date,v})),"Volume")
}

function renderCoachSummary(){
 let c=L(K.checkins,[]);if(!c.length){coachSummary.textContent="Complete your first check-in to get a summary.";return}
 let x=c[c.length-1],bits=[];
 if(x.sessions<3){bits.push("Adherence was below plan, so keep next week simple and prioritize completing all three sessions before adding volume.")}
 if(x.rpe>=9.5){bits.push("Average effort was very high. Keep compounds away from failure and consider reducing load on any lift that repeatedly reaches RPE 9.5–10.")}
 if(x.energy<=2||x.sleep<=2){bits.push("Recovery looks low. Reduce volume about 15% next week and prioritize sleep, food, and stress management.")}
 if(x.pain==="Yes"){bits.push("You reported pain. Substitute the aggravating movement and seek professional evaluation if it persists or feels sharp/joint-related.")}
 if(x.lifts==="Down"){bits.push("Key lifts trended down. Hold or slightly reduce loads and rebuild reps with clean technique.")}
 if(!bits.length)bits.push("Your recovery and adherence look solid. Keep progressing with the current plan and add load only when all sets hit the top of the rep range at RPE 8 or below.");
 coachSummary.textContent=bits.join(" ")
}
saveCheckin.onclick=()=>{let c=L(K.checkins,[]);c.push({date:iso(new Date()),week:+weekSelect.value,weight:+ciWeight.value||null,sessions:+ciSessions.value||0,rpe:+ciRPE.value||0,sleep:+ciSleep.value||0,energy:+ciEnergy.value||0,pain:ciPain.value,good:ciGood.value,difficult:ciDifficult.value,lifts:ciLifts.value});S(K.checkins,c);renderCoachSummary();alert("Weekly check-in saved.")};

function nextDateForDow(dow){let d=new Date(),diff=(dow-d.getDay()+7)%7;d.setDate(d.getDate()+diff);return d}
function dtStr(d,time){let [hh,mm]=(time||"18:00").split(":").map(Number),x=new Date(d);x.setHours(hh,mm,0,0);let z=n=>String(n).padStart(2,"0");return`${x.getFullYear()}${z(x.getMonth()+1)}${z(x.getDate())}T${z(x.getHours())}${z(x.getMinutes())}00`}
function exportICS(){
 let pairs=[[schedule.d1,schedule.t1,1],[schedule.d2,schedule.t2,2],[schedule.d3,schedule.t3,3]],lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Farhad Trainer//EN","CALSCALE:GREGORIAN"];
 pairs.forEach(([dow,time,id])=>{let d=nextDateForDow(dow),[hh,mm]=time.split(":").map(Number),end=new Date(d);end.setHours(hh,mm+45,0,0);lines.push("BEGIN:VEVENT",`UID:farhad-trainer-${id}-${Date.now()}@local`,`DTSTART:${dtStr(d,time)}`,`DTEND:${dtStr(end,`${end.getHours()}:${end.getMinutes()}`)}`,"RRULE:FREQ=WEEKLY;COUNT=12",`SUMMARY:Farhad Trainer — Day ${id}: ${WORKOUTS[id].name}`,`DESCRIPTION:${WORKOUTS[id].ex.map(e=>e.n+" "+e.sets+"x"+e.reps).join("\\n")}`,"END:VEVENT")});lines.push("END:VCALENDAR");let blob=new Blob([lines.join("\r\n")],{type:"text/calendar;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Farhad_Trainer_12_Week_Calendar.ics";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000)
}
addCalendarHome.onclick=exportICS;addCalendarWeek.onclick=exportICS;

function setTimer(sec){timerSec=timerLeft=sec;renderTimer()}
function renderTimer(){let m=Math.floor(timerLeft/60),s=timerLeft%60;timerDisplay.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}
document.querySelectorAll(".timerPreset").forEach(b=>b.onclick=()=>setTimer(+b.dataset.sec));
timerStart.onclick=()=>{if(timerId)return;timerId=setInterval(()=>{if(timerLeft>0){timerLeft--;renderTimer()}else{clearInterval(timerId);timerId=null;navigator.vibrate?.([200,100,200])}},1000)};
timerPause.onclick=()=>{if(timerId){clearInterval(timerId);timerId=null}};timerReset.onclick=()=>{if(timerId){clearInterval(timerId);timerId=null}timerLeft=timerSec;renderTimer()};

exportData.onclick=()=>{let data={schedule:L(K.schedule,{}),history:L(K.history,[]),progress:L(K.progress,[]),prs:L(K.prs,{}),checkins:L(K.checkins,[])};let blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Farhad_Trainer_Backup.json";a.click()};
resetAll.onclick=()=>{if(confirm("Delete all locally saved Farhad Trainer data?")){Object.keys(localStorage).filter(k=>k.startsWith("ft_")).forEach(k=>localStorage.removeItem(k));location.reload()}};

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installBtn.classList.remove("hidden")});
installBtn.onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.classList.add("hidden")};

if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));

renderWeekCards();renderWorkout();renderProgress();renderCoachSummary();renderHome();renderTimer();
