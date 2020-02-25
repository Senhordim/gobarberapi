import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import NotificationSchema from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      order: ['date'],
      include: [
        {
          model: User,
          as: 'providers',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      providers_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { providers_id, date } = req.body;

    const isProviders = await User.findOne({
      where: {
        id: providers_id,
        providers: true,
      },
    });

    if (!isProviders) {
      return res
        .status(401)
        .json({ error: 'You can only appointment with providers' });
    }

    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        providers_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      providers_id,
      date: hourStart,
    });

    const user = await User.findByPk(req.userId);
    const formatedDate = format(hourStart, "dd 'de' MMMM, 'as' H:mm'h'", {
      locale: pt,
    });

    /**
     * Notificar prestador de serviço
     */

    await NotificationSchema.create({
      content: `Novo agendamento de ${user.name} para o dia ${formatedDate}`,
      user: providers_id,
    });

    return res.json(appointment);
  }
}
export default new AppointmentController();
