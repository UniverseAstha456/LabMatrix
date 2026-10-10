// Ported from the old js/config.js. Each entity drives its own list page and form.
const STATUS = ['Working', 'Under Maintenance', 'Retired']
const F = (k, l, t = 'text', o = {}) => ({ k, l, t, ...o })

export const ENTITIES = {
  labs: {
    title: 'Labs', group: 'Resources', id: 'lab_id', roles: ['Admin'],
    cols: ['lab_name', 'building', 'floor', 'capacity', 'lab_type', 'in_charge_faculty_id'],
    fields: [
      F('lab_name', 'Lab name'), F('building', 'Building'), F('floor', 'Floor', 'number'),
      F('capacity', 'Capacity', 'number'),
      F('lab_type', 'Type', 'select', { opts: ['Computer', 'Electronics', 'Network', 'Research', 'General'] }),
      F('in_charge_faculty_id', 'In-charge faculty ID', 'number', { optional: true }),
    ],
  },
  computers: {
    title: 'Computers', group: 'Resources', id: 'computer_id', roles: ['Admin', 'Technician'],
    cols: ['asset_number', 'lab_id', 'processor', 'ram_gb', 'operating_system', 'status', 'warranty_expiry'],
    fields: [
      F('lab_id', 'Lab ID', 'number'), F('asset_number', 'Asset number'),
      F('processor', 'Processor', 'text', { optional: true }), F('ram_gb', 'RAM (GB)', 'number'),
      F('storage_gb', 'Storage (GB)', 'number', { optional: true }),
      F('operating_system', 'OS', 'text', { optional: true }),
      F('status', 'Status', 'select', { opts: STATUS }),
      F('purchase_date', 'Purchase date', 'date', { optional: true }),
      F('warranty_expiry', 'Warranty expiry', 'date', { optional: true }),
    ],
  },
  equipment: {
    title: 'Equipment', group: 'Resources', id: 'equipment_id', roles: ['Admin', 'Technician'],
    cols: ['asset_number', 'equipment_name', 'equipment_type', 'lab_id', 'status', 'warranty_expiry'],
    fields: [
      F('lab_id', 'Lab ID', 'number'), F('asset_number', 'Asset number'), F('equipment_name', 'Name'),
      F('equipment_type', 'Type', 'select', { opts: ['Projector', 'Printer', 'Router', 'Switch', 'Oscilloscope', 'UPS', 'Other'] }),
      F('status', 'Status', 'select', { opts: STATUS }),
      F('purchase_date', 'Purchase date', 'date', { optional: true }),
      F('warranty_expiry', 'Warranty expiry', 'date', { optional: true }),
    ],
  },
  software: {
    title: 'Software', group: 'Resources', id: 'software_id', roles: ['Admin'],
    cols: ['software_name', 'version', 'vendor', 'license_type', 'total_licenses', 'license_expiry'],
    fields: [
      F('software_name', 'Name'), F('version', 'Version'), F('vendor', 'Vendor', 'text', { optional: true }),
      F('license_type', 'License', 'select', { opts: ['Open Source', 'Educational', 'Commercial', 'Site License'] }),
      F('total_licenses', 'Seats (blank = unlimited)', 'number', { optional: true }),
      F('license_expiry', 'Expiry (blank = perpetual)', 'date', { optional: true }),
    ],
  },
  installs: {
    title: 'Installations', group: 'Resources', id: 'computer_id', roles: ['Admin', 'Technician'],
    cols: ['computer_id', 'software_id', 'install_date'],
    fields: [
      F('computer_id', 'Computer ID', 'number'), F('software_id', 'Software ID', 'number'),
      F('install_date', 'Install date', 'date', { optional: true }),
    ],
  },
  sessions: {
    title: 'Lab sessions', group: 'Academics', id: 'session_id', roles: ['Admin', 'Faculty'],
    cols: ['session_date', 'start_time', 'end_time', 'lab_id', 'course_id', 'batch_id', 'faculty_id', 'topic'],
    fields: [
      F('lab_id', 'Lab ID', 'number'), F('faculty_id', 'Faculty ID', 'number'),
      F('course_id', 'Course ID', 'number'), F('batch_id', 'Batch ID', 'number'),
      F('session_date', 'Date', 'date'), F('start_time', 'Start', 'time'), F('end_time', 'End', 'time'),
      F('topic', 'Topic', 'text', { optional: true, full: true }),
    ],
  },
  bookings: {
    title: 'Lab bookings', group: 'Academics', id: 'booking_id', roles: ['Admin', 'Faculty'], approve: true,
    cols: ['lab_id', 'faculty_id', 'start_datetime', 'end_datetime', 'purpose', 'status', 'approved_by'],
    fields: [
      F('lab_id', 'Lab ID', 'number'), F('faculty_id', 'Faculty ID', 'number'),
      F('start_datetime', 'Start', 'datetime-local'), F('end_datetime', 'End', 'datetime-local'),
      F('purpose', 'Purpose', 'textarea', { full: true }),
    ],
  },
  batches: {
    title: 'Batches', group: 'Academics', id: 'batch_id', roles: ['Admin'],
    cols: ['batch_name', 'branch', 'semester'],
    fields: [F('batch_name', 'Batch name'), F('branch', 'Branch'), F('semester', 'Semester (1-8)', 'number')],
  },
  courses: {
    title: 'Courses', group: 'Academics', id: 'course_id', roles: ['Admin'],
    cols: ['course_code', 'course_name', 'semester', 'credits'],
    fields: [
      F('course_code', 'Code'), F('course_name', 'Name'),
      F('semester', 'Semester', 'number'), F('credits', 'Credits', 'number'),
    ],
  },
  requests: {
    title: 'Fault reports', group: 'Maintenance', id: 'request_id',
    roles: ['Admin', 'Faculty', 'Student', 'Technician'],
    cols: ['request_id', 'computer_id', 'equipment_id', 'description', 'priority', 'status', 'reported_date'],
    fields: [
      F('computer_id', 'Computer ID (or blank)', 'number', { optional: true }),
      F('equipment_id', 'Equipment ID (or blank)', 'number', { optional: true }),
      F('priority', 'Priority', 'select', { opts: ['Low', 'Medium', 'High'] }),
      F('status', 'Status', 'select', { opts: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'] }),
      F('description', 'What is wrong?', 'textarea', { full: true }),
    ],
  },
  maintenance: {
    title: 'Repair jobs', group: 'Maintenance', id: 'maintenance_id', roles: ['Admin', 'Technician'],
    cols: ['request_id', 'technician_id', 'start_date', 'end_date', 'cost', 'status', 'remarks'],
    fields: [
      F('request_id', 'Request ID', 'number'), F('technician_id', 'Technician ID', 'number'),
      F('start_date', 'Start', 'date'), F('end_date', 'End', 'date', { optional: true }),
      F('cost', 'Cost (Rs)', 'number'),
      F('status', 'Status', 'select', { opts: ['Assigned', 'In Progress', 'Completed'] }),
      F('remarks', 'Remarks', 'textarea', { optional: true, full: true }),
    ],
  },
  users: {
    title: 'Users', group: 'Admin', id: 'user_id', roles: ['Admin'],
    cols: ['full_name', 'email', 'role', 'phone', 'is_active'],
    fields: [
      F('full_name', 'Full name'), F('email', 'Email', 'email'),
      F('password', 'Password (new users)', 'password', { optional: true }),
      F('role', 'Role', 'select', { opts: ['Admin', 'Faculty', 'Student', 'Technician'] }),
      F('phone', 'Phone', 'text', { optional: true }),
      F('enrollment_no', 'Enrollment no (students)', 'text', { optional: true }),
      F('batch_id', 'Batch ID (students)', 'number', { optional: true }),
      F('employee_id', 'Employee ID (staff)', 'text', { optional: true }),
      F('department', 'Department (faculty)', 'text', { optional: true }),
    ],
  },
}

// Which sidebar pages each role can see
export const ACCESS = {
  Admin: Object.keys(ENTITIES),
  Faculty: ['labs', 'computers', 'equipment', 'software', 'sessions', 'bookings', 'batches', 'courses', 'requests'],
  Student: ['labs', 'sessions', 'requests'],
  Technician: ['labs', 'computers', 'equipment', 'installs', 'requests', 'maintenance'],
}

export const label = (k) => k.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())
