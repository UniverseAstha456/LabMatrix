const router = require('express').Router();
const { z } = require('zod');
const c = require('../controllers/course.controller');
const validate = require('../middleware/validate');
// TODO: auth - const auth = require('../middleware/auth'); const role = require('../middleware/role');

const schema = z.object({
  course_code: z.string().min(1).max(15),
  course_name: z.string().min(1).max(100),
  semester: z.number().int().min(1).max(8),
  credits: z.number().int().min(1).default(3),
});

router.get('/', c.list);                         // TODO: auth
router.get('/:id', c.get);                       // TODO: auth
router.post('/', validate(schema), c.create);    // TODO: auth, role('Admin')
router.put('/:id', validate(schema), c.update);  // TODO: auth, role('Admin')
router.delete('/:id', c.remove);                 // TODO: auth, role('Admin')

module.exports = router;