import bcrypt from "bcryptjs";
import Usuarios from "../models/user.model.js";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET = process.env.SECRET;
const MASTER_USER = process.env.MASTER_USER;

export const register = async (req, res) => {
  const { user, password, name, masterPassword } = req.body;
  console.log(req.body);
  try {
    const userFound = await Usuarios.findOne({ user: MASTER_USER });
    if (!userFound)
      return res
        .status(400)
        .json({ status: 400, message: "Master-User incorrecto" });

    const isMatch = await bcrypt.compare(masterPassword, userFound.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, message: "Master-Password incorrecta" });
    } else {
      try {
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new Usuarios({
          nombre: name,
          user,
          password: passwordHash,
        });

        const userSaved = await newUser.save();
        res
          .status(200)
          .json({ status: 200, message: "Usuario creado correctamente!" });
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

export const edit = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  const { masterPassword } = req.body;
  try {
    const userFound = await Usuarios.findOne({ user: MASTER_USER });
    const isMatch = await bcrypt.compare(masterPassword, userFound.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, message: "Master-Password incorrecta" });
    } else {
      try {
        const userEdited = await Usuarios.findOneAndUpdate(
          { _id: id },
          {
            user: req.body.user,
            nombre: req.body.name,
          }
        );
        console.log(userEdited);
        res
          .status(200)
          .json({ status: 200, message: "Usuario modificado correctamente!" });
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

export const drop = async (req, res) => {
  const id = req.params.id;
  const { masterPassword } = req.body;
  try {
    const userFound = await Usuarios.findOne({ user: MASTER_USER });
    const isMatch = await bcrypt.compare(masterPassword, userFound.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 400, message: "Master-Password incorrecta" });
    } else {
      try {
        const dropedUser = await Usuarios.deleteOne({ _id: id });
        console.log(dropedUser);
        res
          .status(200)
          .json({ status: 200, message: "Usuario eliminado correctamente!" });
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
