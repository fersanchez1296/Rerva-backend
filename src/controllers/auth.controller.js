import bcrypt from "bcryptjs";
import Usuarios from "../models/user.model.js";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { user, password, nombre } = req.body;
  console.log("Este es el body->", req.body);
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new Usuarios({
      user,
      password: passwordHash,
      nombre,
    });

    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token);
    res.json({
      user: userSaved.user,
      nombre: userSaved.nombre,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { user, password } = req.body;
  console.log("Este es el body->", req.body.password);
  try {
    const userFound = await Usuarios.findOne({ user });
    console.log("Este es el usuario->", userFound.password);
    if (!userFound)
      return res.status(400).json({ message: "Usuario incorrecto" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      user: userFound.user,
      nombre: userFound.nombre,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};
