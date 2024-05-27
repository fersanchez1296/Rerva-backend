import emailContacto from "../assets/email-responses/contacto/contacto.js"

export const contacto = async (req, res) => {
  console.log(req.body);
  try {
    const result = await emailContacto(
      req.body.email,
      req.body.subject,
    );

    if (result) {
      res.status(200).json({
        message: "Gracias por ponerte en contacto no nosostros. Te responderemos a la brevedad.",
        status: 200,
        result: result,
      });
    } else {
      res.json({
        message: "Ocurrió en error al enviar el mensaje.",
        status: 404,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
