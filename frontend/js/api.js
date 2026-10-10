const Auth={get user(){try{return JSON.parse(localStorage.getItem('ls_user'))}catch{return null}},
 set(u,t){localStorage.setItem('ls_user',JSON.stringify(u));localStorage.setItem('ls_token',t)},
 clear(){localStorage.removeItem('ls_user');localStorage.removeItem('ls_token')}};
async function api(path,method='GET',body){
 const r=await fetch(API_BASE+path,{method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+(localStorage.getItem('ls_token')||'')},body:body?JSON.stringify(body):undefined});
 const d=await r.json().catch(()=>({}));
 if(r.status===401&&path!=='/auth/login'){Auth.clear();location.hash='#/login'}
 if(!r.ok)throw new Error(d.message||d.error||'Request failed ('+r.status+')');
 return d;
}
const API={login:(email,password)=>api('/auth/login','POST',{email,password}),
 list:k=>api('/'+k),create:(k,b)=>api('/'+k,'POST',b),update:(k,id,b)=>api(`/${k}/${id}`,'PUT',b),remove:(k,id)=>api(`/${k}/${id}`,'DELETE'),
 view:n=>api('/views/'+n),approve:id=>api(`/bookings/${id}/approve`,'POST'),reject:id=>api(`/bookings/${id}`,'PUT',{status:'Rejected'}),
 attendance:s=>api(`/sessions/${s}/attendance`),saveAttendance:(s,rows)=>api(`/sessions/${s}/attendance`,'PUT',{rows})};
