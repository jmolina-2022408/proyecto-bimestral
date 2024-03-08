'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'
import Invoice from '../invoice/invoice.model.js'

export const register = async (req, res) => {
  try {
    let data = req.body
    data.password = await encrypt(data.password)
    data.role = 'CLIENT'
    let user = new User(data)
    await user.save()
    return res.send({ message: `Registered succesfully, can be logged with email use ${user.username}` })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Error registering user', err: err })
  }
}

export const login = async (req, res) => {
  try {
    let { username, password } = req.body
    let user = await User.findOne({ username })
    if (user && await checkPassword(password, user.password)) {
      let loggedUser = {
        uid: user._id,
        name: user.name,
        username: user.username,
        direction: user.direction,
        role: user.role
      }
      let token = await generateJwt(loggedUser)
      return res.send({ message: `Welcome ${user.name}`, loggedUser, token })
    }
    return res.status(404).send({ message: 'Invalid credentials' })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Error to login' })
  }
}

let defaultAdmin = {
  name: 'José Molina',
  username: 'jmolina-2022408',
  password: '12345678',
  email: 'jmolina-2022408@kinal.org.gt',
  phone: '12345678',
  direction: 'Guatemala',
  role: 'ADMIN'
}

export const adminDefault = async (req, res) => {
  try {
    let admin = await User.findOne({ username: defaultAdmin.username })
    if (admin) {
      console.log('This admin is already exists')
    } else {
      defaultAdmin.password = await encrypt(defaultAdmin.password)
      let newAdmin = await User.create(defaultAdmin)
      console.log(`A default admin is create, can be logged with user: ${newAdmin.username}`)
    }
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Error registering user' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    let { id } = req.params
    let data = req.body
    let update = checkUpdate(data, id)
    if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
    let updatedUser = await User.findOneAndUpdate(
      { _id: id },
      data,
      { new: true }
    )
    if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
    return res.send({ message: 'Updated user', updatedUser })
  } catch (err) {
    console.error(err)
    if (err.keyValue.username) return res.status(400).send({ message: `Username: ${err.keyValue.username}, is already taken` })
    return res.status(500).send({ message: 'Error updating account' })
  }
}

export const deleteProfile = async (req, res) => {
  try {
    let { id } = req.params
    let deletedUser = await User.findOneAndDelete({ _id: id })
    if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
    return res.send({ message: `Account whith username ${deletedUser.username} deleted succesfully` })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Error deleting account' })
  }
}

export const shoppingHistory = async (req, res) => {
  try {
    let user = req.user.id;

    let invoices = await Invoice.find({ user: user }).populate('cart');

    if (!invoices || invoices.length === 0) {
      return res.status(404).send({ message: 'No shopping history found for the user' });
    }

    return res.status(200).send({ message: 'Shopping history found', invoices });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Error fetching shopping history', err });
  }
}