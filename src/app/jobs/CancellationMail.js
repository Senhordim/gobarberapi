import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    console.log('A fila executou!');
    const { appointment } = data;
    await Mail.sendMail({
      to: `${appointment.providers.name} <${appointment.providers.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        providers: appointment.providers.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date), "dd 'de' MMMM, 'as' H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new CancellationMail();
