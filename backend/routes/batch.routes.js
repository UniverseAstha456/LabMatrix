const router = require('express').Router();
const { z } = require('zod');
const c = require('../controllers/batch.controller');
const validate = require('../middleware/validate');
// TODO: auth - const auth = require('../middleware/auth'); const role = require('../middleware/role');

const schema = z.object({
  batch_name: z.string().min(1).max(30),
  branch: z.string().min(1).max(50),
  semester: z.number().int().min(1).max(8),
});

router.get('/', c.list);                         // TODO: auth (any logged-in user)
router.get('/:id', c.get);                       // TODO: auth
router.post('/', validate(schema), c.create);    // TODO: auth, role('Admin')
router.put('/:id', validate(schema), c.update);  // TODO: auth, role('Admin')
router.delete('/:id', c.remove);                 // TODO: auth, role('Admin')

module.exports = router;