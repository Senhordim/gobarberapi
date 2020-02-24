import User from '../models/User';
import File from '../models/File';

class ProvidersController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { providers: true },
      attributes: ['id', 'name', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProvidersController();
