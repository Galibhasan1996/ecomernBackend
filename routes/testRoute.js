import testControllers from '../controller/testController.js'

import express from 'express'
const router = express.Router()


// router

router.get('/test', testControllers)




export default router