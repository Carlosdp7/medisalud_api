const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const obtainAuthUser = async (req, res) => {
  try {
    //Encontrar el usuario por el id pero sin el password
    const user = await User.findById(req.user.id);

    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: 'Hubo un error' });
  }
}

const signinUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Revisar que sea un usuario registrado
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ err: 'Email o contraseña incorrectos' });
      return;
    }

    //Revisar el password
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ err: 'Email o contraseña incorrectos' });
      return;
    }

    const token = await User.generateAuthToken(user.id);

    res.send({ token })
  } catch (err) {
    console.log(err);
    res.status(400).send({
      err: 'Hubo un error'
    });
  }
}

const signupUser = async (req, res) => {
  //Extraer email y password
  const { email } = req.body;

  try {
    //Revidar que el usuario registrado sea unico
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).send({ err: 'El usuario ya existe' });
    }

    //Crear el nuevo usuario
    user = new User(req.body);

    //Guardar el muevo usuario
    await user.save();

    const token = await User.generateAuthToken(user.id);

    res.send({ token })
  } catch (err) {
    console.log(err);
    res.status(400).send({
      err: 'Hubo un error'
    });
  }
}

const logoutUser = (req, res) => {
  req.user = {};

  res.send({
    msg: 'ok'
  })
}

const updateUser = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.set(req.body);

  await user.save()

  res.send({
    msg: 'ok'
  });
}

module.exports = {
  signinUser,
  signupUser,
  updateUser,
  logoutUser,
  obtainAuthUser
}