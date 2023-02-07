'use strict';

let express = require('express');
let taskCtrl = require('./task.controller');
const upload = require('../../services/upload');
let router = express.Router();


// *Prefix Path --- '/api/task'

//post
router.get('/:id',taskCtrl.allTaskAssign);
router.post('/assign',taskCtrl.taskAssignToDev);
router.post('/update', upload.any() ,taskCtrl.taskCompleteByDev);

module.exports = router;