const router = require("express").Router();
const {dataGeneration} = require('../Controller/patientMonitoring')

 router.post('/monitoring/:patientId', dataGeneration);

module.exports = router;