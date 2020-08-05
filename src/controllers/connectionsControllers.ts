import { Request, Response } from 'express'
import db from './../database/connection';

export default class ConnectionControllers {
  async create(req: Request, res: Response) {
    const { user_id } = req.body

    await db('connections').insert({
      user_id
    })
    return res.status(201).send(req.body)
  }

  async index(req: Request, res: Response) {
    const totalConnections = await db('connections').count('* as total')

    const {total} = totalConnections[0]

    return res.status(200).send({total})
  }
}