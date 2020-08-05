import { Request, Response } from 'express'
import db from './../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesControllers {

  async index(req: Request, res: Response) {
    const filters = req.query
    
    if(!filters.subject || !filters.week_day || !filters.time) return res.status(400).send({error: 'Filtro invalido'})

    const timeInMinutes = convertHourToMinutes(filters.time as string)

    const classes = await db('classes')
    .whereExists(function() {
      this.select('classe_schedule.*')
      .from('classe_schedule')
        .whereRaw('`classe_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`classe_schedule`.`week_day` = ??', [Number(filters.week_day)])
            .whereRaw('`classe_schedule`.`from` <= ??', [timeInMinutes])
            .whereRaw('`classe_schedule`.`to` > ??', [timeInMinutes])
    })
      .where('classes.subject', '=', filters.subject as string)
        .join('users', 'classes.user_id', '=', 'users.id')
          .select(['classes.*', 'users.*'])
      return res.status(200).send(classes)
  }

  async create(req: Request, res: Response) {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body
  
    const trx = await db.transaction()
  
    try {
      const insertUsersID = await trx('users').insert({ name, avatar, whatsapp, bio });
  
      const user_id = insertUsersID[0]
  
      const insertClassesID = await trx('classes').insert({ subject, cost, user_id })
  
      const class_id = insertClassesID[0]
  
      const classSchedule = schedule.map((s: ScheduleItem) => {
        return {
          class_id: class_id,
          week_day: s.week_day,
          from: convertHourToMinutes(s.from),
          to: convertHourToMinutes(s.to)
        }
      })
  
      await trx('classe_schedule').insert(classSchedule)
  
      await trx.commit()
  
      return res.status(201).send(req.body)
    } catch (error) {
      await trx.rollback()
      return res.status(400).send({ error: "Erro inesperado" })
    }
  }
}