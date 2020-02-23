import User from '../models/User';

class UserController {
  async all(req, res) {
    const users = await User.findAll();
    res.json(users);
  }

  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, providers } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      providers,
    });
  }

  async update(req, res) {
    res.json({
      ok: true,
    });
  }
}

export default new UserController();
