// Backend base URL: change to your Node/Express API
const API_BASE='http://localhost:5000/api';
const MS=['Working','Under Maintenance','Retired'];
const F=(k,l,t='text',o={})=>({k,l,t,...o});
// Each entity drives its own list page and add/edit form.
const ENTITIES={
 labs:{t:'Labs',g:'Resources',id:'lab_id',roles:['Admin'],cols:['lab_name','building','floor','capacity','lab_type','in_charge_faculty_id'],
  f:[F('lab_name','Lab name'),F('building','Building'),F('floor','Floor','number'),F('capacity','Capacity','number'),F('lab_type','Type','select',{opts:['Computer','Electronics','Network','Research','General']}),F('in_charge_faculty_id','In-charge faculty ID','number',{opt:1})]},
 computers:{t:'Computers',g:'Resources',id:'computer_id',roles:['Admin','Technician'],cols:['asset_number','lab_id','processor','ram_gb','operating_system','status','warranty_expiry'],
  f:[F('lab_id','Lab ID','number'),F('asset_number','Asset number'),F('processor','Processor','text',{opt:1}),F('ram_gb','RAM (GB)','number'),F('storage_gb','Storage (GB)','number',{opt:1}),F('operating_system','OS','text',{opt:1}),F('status','Status','select',{opts:MS}),F('purchase_date','Purchase date','date',{opt:1}),F('warranty_expiry','Warranty expiry','date',{opt:1})]},
 equipment:{t:'Equipment',g:'Resources',id:'equipment_id',roles:['Admin','Technician'],cols:['asset_number','equipment_name','equipment_type','lab_id','status','warranty_expiry'],
  f:[F('lab_id','Lab ID','number'),F('asset_number','Asset number'),F('equipment_name','Name'),F('equipment_type','Type','select',{opts:['Projector','Printer','Router','Switch','Oscilloscope','UPS','Other']}),F('status','Status','select',{opts:MS}),F('purchase_date','Purchase date','date',{opt:1}),F('warranty_expiry','Warranty expiry','date',{opt:1})]},
 software:{t:'Software',g:'Resources',id:'software_id',roles:['Admin'],cols:['software_name','version','vendor','license_type','total_licenses','license_expiry'],
  f:[F('software_name','Name'),F('version','Version'),F('vendor','Vendor','text',{opt:1}),F('license_type','License','select',{opts:['Open Source','Educational','Commercial','Site License']}),F('total_licenses','Seats (blank = unlimited)','number',{opt:1}),F('license_expiry','Expiry (blank = perpetual)','date',{opt:1})]},
 installs:{t:'Installations',g:'Resources',id:'computer_id',roles:['Admin','Technician'],cols:['computer_id','software_id','install_date'],
  f:[F('computer_id','Computer ID','number'),F('software_id','Software ID','number'),F('install_date','Install date','date',{opt:1})]},
 sessions:{t:'Lab sessions',g:'Academics',id:'session_id',roles:['Admin','Faculty'],cols:['session_date','start_time','end_time','lab_id','course_id','batch_id','faculty_id','topic'],
  f:[F('lab_id','Lab ID','number'),F('faculty_id','Faculty ID','number'),F('course_id','Course ID','number'),F('batch_id','Batch ID','number'),F('session_date','Date','date'),F('start_time','Start','time'),F('end_time','End','time'),F('topic','Topic','text',{opt:1,full:1})]},
 bookings:{t:'Lab bookings',g:'Academics',id:'booking_id',roles:['Admin','Faculty'],cols:['lab_id','faculty_id','start_datetime','end_datetime','purpose','status','approved_by'],approve:1,
  f:[F('lab_id','Lab ID','number'),F('faculty_id','Faculty ID','number'),F('start_datetime','Start','datetime-local'),F('end_datetime','End','datetime-local'),F('purpose','Purpose','textarea',{full:1})]},
 batches:{t:'Batches',g:'Academics',id:'batch_id',roles:['Admin'],cols:['batch_name','branch','semester'],
  f:[F('batch_name','Batch name'),F('branch','Branch'),F('semester','Semester (1-8)','number')]},
 courses:{t:'Courses',g:'Academics',id:'course_id',roles:['Admin'],cols:['course_code','course_name','semester','credits'],
  f:[F('course_code','Code'),F('course_name','Name'),F('semester','Semester','number'),F('credits','Credits','number')]},
 requests:{t:'Fault reports',g:'Maintenance',id:'request_id',roles:['Admin','Faculty','Student','Technician'],cols:['request_id','computer_id','equipment_id','description','priority','status','reported_date'],
  f:[F('computer_id','Computer ID (or blank)','number',{opt:1}),F('equipment_id','Equipment ID (or blank)','number',{opt:1}),F('priority','Priority','select',{opts:['Low','Medium','High']}),F('status','Status','select',{opts:['Open','Assigned','In Progress','Resolved','Closed']}),F('description','What is wrong?','textarea',{full:1})]},
 maintenance:{t:'Repair jobs',g:'Maintenance',id:'maintenance_id',roles:['Admin','Technician'],cols:['request_id','technician_id','start_date','end_date','cost','status','remarks'],
  f:[F('request_id','Request ID','number'),F('technician_id','Technician ID','number'),F('start_date','Start','date'),F('end_date','End','date',{opt:1}),F('cost','Cost (₹)','number'),F('status','Status','select',{opts:['Assigned','In Progress','Completed']}),F('remarks','Remarks','textarea',{opt:1,full:1})]},
 users:{t:'Users',g:'Admin',id:'user_id',roles:['Admin'],cols:['full_name','email','role','phone','is_active'],
  f:[F('full_name','Full name'),F('email','Email','email'),F('password','Password (new users)','password',{opt:1}),F('role','Role','select',{opts:['Admin','Faculty','Student','Technician']}),F('phone','Phone','text',{opt:1}),F('enrollment_no','Enrollment no (students)','text',{opt:1}),F('batch_id','Batch ID (students)','number',{opt:1}),F('employee_id','Employee ID (staff)','text',{opt:1}),F('department','Department (faculty)','text',{opt:1})]}
};
// Role -> pages shown in the sidebar
const ACCESS={Admin:Object.keys(ENTITIES),Faculty:['labs','computers','equipment','software','sessions','bookings','batches','courses','requests'],Student:['labs','sessions','requests'],Technician:['labs','computers','equipment','installs','requests','maintenance']};
