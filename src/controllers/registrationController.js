import { Registration } from "../models/Registration.js"
import bcrypt from 'bcryptjs'
// import { sendMail } from "../utils/nodemailer/sendEmail.js"


const ALLOWED_STATUSES = new Set(["pending", "confirmed", "cancelled"])

export async function createRegistration(req, res) {
  try {
    const {
      name,
      email,
      password,
      instituation,
      country,
      state,
      city,
      foodper,
      phone,
      altphone,
      cate,
      regFee,
      paymentmode,
      trnsNo,
      designation,
      memberId,
      studentId,
    } = req.body || {}

    const missing = []
    if (!name) missing.push('name')
    if (!email) missing.push('email')
    if (!password) missing.push('password')
    if (!instituation) missing.push('instituation')
    if (!country) missing.push('country')
    if (!state) missing.push('state')
    if (!city) missing.push('city')
    // if (!foodper) missing.push('foodper')
    if (!cate) missing.push('cate')
    if (!regFee) missing.push('regFee')
    if (!paymentmode) missing.push('paymentmode')
    if (!trnsNo) missing.push('trnsNo')
    if (!designation) missing.push('designation')

    if (cate === 'ARTTI MEMBER' && !memberId) {
      missing.push('ARTTI Member ID')
    }
    if (cate === 'student' && !studentId) {
      missing.push('Student ID')
    }
    

    if (missing.length) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` })
    }

    const passwordHash = await bcrypt.hash(String(password), 10)

    const paymentScreenshotUrl = req.file
      ? `/uploads/payments/${req.file.filename}`
      : undefined

      const existingTid = await Registration.findOne({trnsNo : trnsNo })

      if(existingTid){
        return res.status(403).json({
          error : "payment already exists",
          success : false
        })
      }
      const existingUser = await Registration.findOne({email : email })

      if(existingUser){
        return res.status(403).json({
          error : "email already exists",
          success : false
        })
      }

    const doc = await Registration.create({
      name,
      email,
      password: passwordHash,
      instituation,
      country,
      state,
      city,
      foodper,
      phone,
      altphone,
      cate,
      regFee,
      paymentmode,
      trnsNo,
      paymentScreenshotUrl,
      designation,
      memberId: cate === 'ARTTI MEMBER' ? memberId : undefined,
      studentId: cate === 'student' ? studentId : undefined,
    })
if(doc){
      // await sendMail(doc.email , doc.name  ,'registration')



}

    return res.status(201).json({ message: 'Registered successfully', id: doc._id, paymentScreenshotUrl })
  } catch (err) {
    console.error('Registration error:', err)
    const code = err?.code === 11000 ? 409 : 500
    res.status(code).json({ error: err?.message || 'Server error' })
  }
}

export async function listRegistrations(_req, res) {
  try {
    const docs = await Registration.find().sort({ createdAt: -1 }).lean()
    res.json(docs)
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Server error' })
  }
}

export async function updateRegistrationStatus(req, res) {
  try {
    const { id } = req.params || {}
    const { status } = req.body || {}
    console.log(status ,"staus")

    const nextStatus = String(status || "").toLowerCase().trim()
    if (!ALLOWED_STATUSES.has(nextStatus)) {
      return res.status(400).json({ error: "Invalid status. Use: pending, confirmed, cancelled" })
    }

    const updated = await Registration.findByIdAndUpdate(
      id,
      { status: nextStatus },
      { new: true, runValidators: true }
    ).lean()
    if (!updated) {
      return res.status(404).json({ error: "Registration not found" })
    }

    // if(status ==="confirmed"){
    //   await sendMail(updated.email , updated.name  ,'confirmation')
    // }
    // else if(status ==="cancel"){
    //   await sendMail(updated.email , updated.name  ,'cancel')
    // }
    // else{
    //   await sendMail(updated.email , updated.name  ,'pending')
    // }

    

    return res.json({ message: "Status updated", registration: updated })
  } catch (err) {
    res.status(500).json({ error: err?.message || "Server error" })
  }
}
