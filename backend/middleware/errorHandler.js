module.exports = (err, req, res, next) => {
  const map = {
    ER_DUP_ENTRY: [409, 'Duplicate value already exists'],
    ER_ROW_IS_REFERENCED_2: [409, 'Cannot delete: record is in use'],
    ER_NO_REFERENCED_ROW_2: [400, 'Invalid reference (foreign key)'],
    ER_CHECK_CONSTRAINT_VIOLATED: [400, 'Value violates a rule'],
  };
  // trigger / SIGNAL errors (booking overlap, license seats)
  if (err.sqlState === '45000')
    return res.status(400).json({ success: false, message: err.sqlMessage });
  const m = map[err.code];
  if (m) return res.status(m[0]).json({ success: false, message: m[1] });
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
};