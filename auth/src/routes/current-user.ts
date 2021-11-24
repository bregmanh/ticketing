import express from 'express'
import jwt from 'jsonwebtoken'


const router = express.Router()

router.get('/api/users/currentUser', (req, res) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null })
  }
  try {
    //JWT_KEY should be set as it is checked in the root file in start function
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!)
    res.send({ currentUser: payload })
  } catch (err) {
    res.send({ currentUSer: null })
  }
})

export { router as currentUserRouter }