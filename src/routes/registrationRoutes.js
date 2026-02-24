import { Router } from 'express'
import { createRegistration, listRegistrations, updateRegistrationStatus } from '../controllers/registrationController.js'
import { uploadPaymentScreenshot } from '../middlewares/uploadPaymentScreenshot.js'
import { isAllowedRoles, isAuthenticated } from '../middlewares/isAuthenticated.js'

const router = Router()

router.post('/register', uploadPaymentScreenshot.single('screenshot'), createRegistration)
router.get('/registrations' , isAuthenticated , isAllowedRoles("admin") ,  listRegistrations)
router.patch('/registrations/:id/status', updateRegistrationStatus)
router.put('/registrations/:id/status', updateRegistrationStatus)

export default router
