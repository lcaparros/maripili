import mongoose from 'mongoose'
import dotenv from 'dotenv'

import { logDebug, logError } from '../log.js'

dotenv.config()

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_DATABASE } = process.env

export async function connect() {
  const mongooseOptions = {
    retryWrites: true,
    authSource: 'admin',
    // autoIndex: false,
    user: MONGO_USER,
    pass: MONGO_PASSWORD
  }

  try {
    const mongoUrl = `mongodb://${MONGO_HOST}/${MONGO_DATABASE}`
    await mongoose.connect(mongoUrl, mongooseOptions)
    logDebug('Successfully connected to database')
  } catch (error) {
    logError('Error connecting to database')
    console.log(error)
  }

  process.on('uncaughtException', (error) => {
    logError('Uncaugh exception -> Disconnecting database')
    console.log(error)
    mongoose.connection.disconnect().then(() => logDebug('Disconnected from database'))
  })
}

export async function disconnect() {
  try {
    await mongoose.disconnect()
    logDebug('Disconnected from database')
  } catch (error) {
    logError('Error disconnecting to database')
    console.log(error)
  }
}
