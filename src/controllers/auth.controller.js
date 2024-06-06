import bcrypt from "bcryptjs";
import Usuarios from "../models/user.model.js";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET = process.env.SECRET;

export const register = async (req, res) => {
  const { user, password, name, masterU, masterP } = req.body;
  console.log(req.body);
  try {
    const userFound = await Usuarios.findOne({ user: masterU });
    if (!userFound)
      return res.status(400).json({ message: "Master-User incorrecto" });

    const isMatch = await bcrypt.compare(masterP, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Master-Password incorrecta" });
    } else {
      try {
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new Usuarios({
          user,
          password: passwordHash,
          name,
        });

        const userSaved = await newUser.save();
        res.status(200).json({ message: "Usuario creado correctamente!" });
      } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
      }
    }
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

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });
    res.json({
      user: userFound.user,
      nombre: userFound.nombre,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: "Sesión cerrada." });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await Usuarios.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};
