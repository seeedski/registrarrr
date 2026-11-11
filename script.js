const DOCS=[
["TOR","Transcript of Records",150,"5–7 working days",0],
["GRADES","Grades / Report Card",50,"1–2 working days",1],
["PREV","Previous Grades (past terms)",50,"2–3 working days",1],
["COR","Certificate of Registration (COR)",50,"1–2 working days",1],
["ENR","Certification of Enrollment",50,"1–2 working days",0],
["GMC","Certificate of Good Moral Character",75,"2–3 working days",0],
["HD","Honorable Dismissal",100,"3–5 working days",0],
["DIP","Certified True Copy of Diploma",100,"3–5 working days",0],
["F137","Form 137 / Permanent Record",100,"5–7 working days",0],
["GRAD","Certification of Graduation",75,"2–3 working days",0]];
const FLOW=["Pending","Processing","Ready","Released"];
let R=[],mem=null,sel={};
const $=id=>document.getElementById(id);
const peso=n=>"₱"+n.toLocaleString();
function load(){try{R=JSON.parse(localStorage.getItem("reqs")||"[]")}catch(e){R=mem||[]}}
function save(){mem=R;try{localStorage.setItem("reqs",JSON.stringify(R))}catch(e){}}
function tab(n){["req","trk"].forEach(k=>{$("v-"+k).classList.toggle("hide",k!==n);$("t-"+k).classList.toggle("on",k===n)})}
["req","trk"].forEach(k=>$("t-"+k).onclick=()=>tab(k));
$("docs").innerHTML=DOCS.map(d=>`<label class="doc" id="d-${d[0]}"><input type="checkbox" value="${d[0]}"><span><b>${d[1]}</b><small>Processing: ${d[3]}</small></span></label>`).join("");
$("docs").onchange=e=>{const c=e.target;sel[c.value]=c.checked;$("d-"+c.value).classList.toggle("sel",c.checked);fee()};
function chosen(){return DOCS.filter(d=>sel[d[0]])}
function fee(){$("termBox").classList.toggle("hide",!chosen().some(d=>d[4]))}
$("cp").oninput=fee;
$("sub").onclick=()=>{
const v=id=>$(id).value.trim(),ds=chosen();$("err").textContent="";
if(!v("sid")||!v("nm")||!v("em")||!v("pg"))return $("err").textContent="Please complete all required student information.";
if(!/^\S+@\S+\.\S+$/.test(v("em")))return $("err").textContent="Please enter a valid email address.";
if(!ds.length)return $("err").textContent="Select at least one document.";
if(ds.some(d=>d[4])&&!v("term"))return $("err").textContent="Enter the school year and term for grades / COR.";
const now=new Date(),ref="REQ-"+now.toISOString().slice(0,10).replace(/-/g,"")+"-"+Math.floor(1000+Math.random()*9000);
const r={ref,sid:v("sid"),name:v("nm"),email:v("em"),phone:v("ph"),prog:v("pg"),stt:$("stt").value,docs:ds.map(d=>d[1]),term:v("term"),copies:+$("cp").value||1,purpose:$("pu").value,notes:v("nt"),status:"Pending",date:now.toLocaleDateString("en-PH",{year:"numeric",month:"short",day:"numeric"}),log:[{s:"Pending",t:now.toLocaleString("en-PH")}]};
R.unshift(r);save();
$("done").classList.remove("hide");
$("done").innerHTML=`<b>Request submitted!</b><br>Your reference number is <b>${ref}</b>. Keep it to track your request. The registrar will email you once your document is ready.`;
$("f").reset();sel={};document.querySelectorAll(".doc").forEach(x=>x.classList.remove("sel"));fee();window.scrollTo(0,0)};
$("go").onclick=()=>{const f=R.find(r=>r.ref.toLowerCase()===$("ref").value.trim().toLowerCase()&&r.sid.toLowerCase()===$("rsid").value.trim().toLowerCase());
if(!f)return $("tr").innerHTML='<div class="msg">No matching request found. Check your reference number and Student ID.</div>';
const i=FLOW.indexOf(f.status);
$("tr").innerHTML=`<div class="msg"><b>${f.ref}</b> · <span class="pill s-${f.status}">${f.status}</span><div class="steps">${FLOW.map((s,k)=>`<div class="${k<=i?"d":""}"></div>`).join("")}</div>
<small>${FLOW.join(" → ")}</small><p><b>Documents:</b> ${f.docs.join(", ")}${f.term?" ("+f.term+")":""}<br><b>Copies:</b> ${f.copies}<br><b>Filed:</b> ${f.date}</p>
${f.log.map(l=>`<small>• ${l.s} – ${l.t}</small>`).join("<br>")}</div>`};
load();fee();
