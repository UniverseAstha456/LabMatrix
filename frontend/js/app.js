const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const label=k=>k.replace(/_/g,' ').replace(/^./,c=>c.toUpperCase());
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
const BADGE={Working:'g',Approved:'g',Present:'g',Completed:'g',Resolved:'g',Closed:'g','Under Maintenance':'a',Pending:'a',Open:'a',Late:'a',Assigned:'a','In Progress':'a',Medium:'a',Retired:'r',Rejected:'r',Cancelled:'r',Absent:'r',High:'r'};
const cell=(k,v)=>v===true?'Yes':v===false?'No':BADGE[v]?`<span class="badge ${BADGE[v]}">${esc(v)}</span>`:/(date|_at)/.test(k)&&v?esc(String(v).slice(0,16).replace('T',' ').replace(/ 00:00$/,'')):esc(v);
function table(rows,cols,actions){
 if(!rows.length)return'<div class="empty">Nothing here yet.</div>';
 return`<div class="tw"><table><thead><tr>${cols.map(c=>`<th>${label(c)}</th>`).join('')}${actions?'<th></th>':''}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${cell(c,r[c])}</td>`).join('')}${actions?`<td>${actions(r)}</td>`:''}</tr>`).join('')}</tbody></table></div>`;
}
function shell(active,html){
 const u=Auth.user,groups={};
 ACCESS[u.role].forEach(k=>(groups[ENTITIES[k].g]??=[]).push(k));
 $('#app').innerHTML=`<div class="shell"><aside id="side"><div class="logo">Lab<span>Sphere</span></div>
 <a href="#/dashboard" class="${active==='dashboard'?'on':''}">Dashboard</a>
 ${['Faculty','Admin'].includes(u.role)?`<a href="#/attendance" class="${active==='attendance'?'on':''}">Attendance</a>`:''}
 <a href="#/reports" class="${active==='reports'?'on':''}">Reports</a>
 ${Object.entries(groups).map(([g,ks])=>`<div class="grp">${g}</div>`+ks.map(k=>`<a href="#/e/${k}" class="${active===k?'on':''}">${ENTITIES[k].t}</a>`).join('')).join('')}
 <div class="grp">${esc(u.full_name||u.email)} (${u.role})</div><a href="#" id="out">Sign out</a></aside>
 <main><button class="btn menu" id="mb">Menu</button><div id="view">${html||''}</div></main></div>`;
 $('#out').onclick=e=>{e.preventDefault();Auth.clear();location.hash='#/login'};
 $('#mb').onclick=()=>$('#side').classList.toggle('open');
}
function login(){
 $('#app').innerHTML=`<div class="login"><div class="art"><h1>LabSphere</h1><p>Book labs, track computers and software licences, mark attendance, and get faults fixed, all in one place.</p></div>
 <div class="f"><form id="lf"><h2>Sign in</h2><div><label for="em">Email</label><input id="em" type="email" required autocomplete="username"></div>
 <div><label for="pw">Password</label><input id="pw" type="password" required autocomplete="current-password"></div>
 <div class="err" id="er"></div><button class="btn p">Sign in</button></form></div></div>`;
 $('#lf').onsubmit=async e=>{e.preventDefault();try{const d=await API.login($('#em').value,$('#pw').value);Auth.set(d.user,d.token);location.hash='#/dashboard'}catch(x){$('#er').textContent=x.message}};
}
async function dashboard(){
 shell('dashboard','<div class="empty">Loading…</div>');
 try{
  const [health,lic,usage]=await Promise.all([API.view('lab_health'),API.view('expiring_licenses'),API.view('lab_usage')]);
  const s=k=>health.reduce((a,r)=>a+Number(r[k]||0),0);
  $('#view').innerHTML=`<div class="top"><h1>Dashboard</h1></div>
  <div class="kpis"><div class="kpi"><b>${health.length}</b><small>Labs</small></div><div class="kpi"><b>${s('total_computers')}</b><small>Computers</small></div>
  <div class="kpi w"><b>${s('under_maintenance')}</b><small>Under maintenance</small></div><div class="kpi r"><b>${lic.length}</b><small>Licences expiring in 60 days</small></div></div>
  <div class="card"><h2>Lab health</h2>${table(health,Object.keys(health[0]||{}))}</div>
  <div class="card"><h2>Licences expiring soon</h2>${table(lic,Object.keys(lic[0]||{}))}</div>
  <div class="card"><h2>Most-used labs</h2>${table(usage,Object.keys(usage[0]||{}))}</div>`;
 }catch(x){$('#view').innerHTML=`<div class="card err">${esc(x.message)}</div>`}
}
async function crud(key){
 const E=ENTITIES[key],u=Auth.user;
 if(!ACCESS[u.role].includes(key))return location.hash='#/dashboard';
 const can=E.roles.includes(u.role);
 shell(key,'<div class="empty">Loading…</div>');
 let rows=[];
 const draw=()=>{
  const q=($('#q')?.value||'').toLowerCase(),sf=$('#sf')?.value||'';
  const vis=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q)&&(!sf||r.status===sf));
  $('#tbl').innerHTML=table(vis,E.cols,r=>{
   let a='';const id=r[E.id];
   if(E.approve&&u.role==='Admin'&&r.status==='Pending')a+=`<button class="btn s p" data-a="ok" data-id="${id}">Approve</button> <button class="btn s d" data-a="no" data-id="${id}">Reject</button> `;
   if(can)a+=`<button class="btn s" data-a="ed" data-id="${id}">Edit</button> <button class="btn s d" data-a="rm" data-id="${id}">Delete</button>`;
   return a;});
 };
 try{rows=await API.list(key)}catch(x){toast(x.message)}
 const sfld=E.f.find(f=>f.k==='status'),canAdd=can||key==='requests';
 $('#view').innerHTML=`<div class="top"><h1>${E.t}</h1><div class="bar"><input id="q" type="search" placeholder="Search ${E.t.toLowerCase()}" aria-label="Search">
 ${sfld?`<select id="sf" aria-label="Filter by status"><option value="">All statuses</option>${sfld.opts.map(o=>`<option>${o}</option>`).join('')}</select>`:''}
 ${canAdd?`<button class="btn p" id="add">Add new</button>`:''}</div></div><div class="card" id="tbl"></div>`;
 draw();$('#q').oninput=draw;if($('#sf'))$('#sf').onchange=draw;
 const reload=async()=>{rows=await API.list(key);draw()};
 if($('#add'))$('#add').onclick=()=>form(E,key,null,reload);
 $('#tbl').onclick=async e=>{
  const b=e.target.closest('button');if(!b)return;const id=b.dataset.id,row=rows.find(r=>String(r[E.id])===id);
  try{
   if(b.dataset.a==='ed')form(E,key,row,reload);
   if(b.dataset.a==='rm'&&confirm('Delete this record? This cannot be undone.')){await API.remove(key,id);toast('Deleted');reload()}
   if(b.dataset.a==='ok'){await API.approve(id);toast('Booking approved');reload()}
   if(b.dataset.a==='no'){await API.reject(id);toast('Booking rejected');reload()}
  }catch(x){toast(x.message)}};
}
function form(E,key,row,done){
 const m=document.createElement('div');m.className='modal';
 m.innerHTML=`<form><h2>${row?'Edit':'Add'} ${E.t.toLowerCase()}</h2>${E.f.map(f=>{
  const v=row?.[f.k]??'',val=f.t==='date'?String(v).slice(0,10):f.t==='datetime-local'?String(v).slice(0,16).replace(' ','T'):v;
  const inp=f.t==='select'?`<select name="${f.k}">${f.opts.map(o=>`<option ${o===v?'selected':''}>${o}</option>`).join('')}</select>`
  :f.t==='textarea'?`<textarea name="${f.k}" rows="3" ${f.opt?'':'required'}>${esc(v)}</textarea>`
  :`<input name="${f.k}" type="${f.t}" value="${esc(val)}" ${f.opt?'':'required'}>`;
  return`<div class="${f.full||f.t==='textarea'?'full':''}"><label>${f.l}</label>${inp}</div>`}).join('')}
 <div class="acts"><button type="button" class="btn" id="cx">Cancel</button><button class="btn p">Save changes</button></div></form>`;
 document.body.appendChild(m);$('#cx',m).onclick=()=>m.remove();
 $('form',m).onsubmit=async e=>{e.preventDefault();
  const b=Object.fromEntries([...new FormData(e.target)].map(([k,v])=>[k,v===''?null:v]));
  try{row?await API.update(key,row[E.id],b):await API.create(key,b);m.remove();toast('Saved');done()}catch(x){toast(x.message)}};
}
async function attendance(){
 shell('attendance','<div class="top"><h1>Attendance</h1></div><div class="card"><label for="ss">Session</label><select id="ss"><option value="">Select a session</option></select></div><div id="att"></div>');
 try{const ss=await API.list('sessions');
 $('#ss').innerHTML+=ss.map(s=>`<option value="${s.session_id}">${esc(String(s.session_date).slice(0,10))}: ${esc(s.topic||'Session '+s.session_id)}</option>`).join('')}catch(x){toast(x.message)}
 $('#ss').onchange=async()=>{const id=$('#ss').value;if(!id)return;
  try{const rows=await API.attendance(id);
  $('#att').innerHTML=`<div class="card"><div class="tw"><table><thead><tr><th>Enrollment</th><th>Name</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr data-s="${r.student_id}"><td>${esc(r.enrollment_no)}</td><td>${esc(r.full_name)}</td><td><select>${['Present','Absent','Late'].map(o=>`<option ${o===r.status?'selected':''}>${o}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div><p><button class="btn p" id="sv">Save attendance</button></p></div>`;
  $('#sv').onclick=async()=>{try{await API.saveAttendance(id,[...document.querySelectorAll('#att tr[data-s]')].map(t=>({student_id:+t.dataset.s,status:t.querySelector('select').value})));toast('Attendance saved')}catch(x){toast(x.message)}};
  }catch(x){toast(x.message)}};
}
const REPORTS={lab_usage:'Most-used labs',student_attendance:'Student attendance',frequent_maintenance:'Repeated maintenance',expiring_licenses:'Licence expiry',lab_health:'Lab health'};
async function reports(name='lab_usage'){
 shell('reports',`<div class="top"><h1>Reports</h1><div class="bar" id="rb">${Object.entries(REPORTS).map(([k,v])=>`<button class="btn ${k===name?'p':''}" data-r="${k}">${v}</button>`).join('')}</div></div><div class="card" id="rp">Loading…</div>`);
 $('#rb').onclick=e=>{const b=e.target.closest('[data-r]');if(b)reports(b.dataset.r)};
 try{const d=await API.view(name);$('#rp').innerHTML=table(d,Object.keys(d[0]||{}))}catch(x){$('#rp').innerHTML=`<span class="err">${esc(x.message)}</span>`}
}
function route(){
 const h=location.hash||'#/dashboard',p=h.split('/');
 if(!Auth.user&&h!=='#/login')return location.hash='#/login';
 if(h==='#/login')return login();
 if(p[1]==='e'&&ENTITIES[p[2]])return crud(p[2]);
 if(p[1]==='attendance')return attendance();
 if(p[1]==='reports')return reports();
 dashboard();
}
addEventListener('hashchange',route);route();
