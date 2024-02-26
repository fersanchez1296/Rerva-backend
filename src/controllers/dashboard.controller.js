import Documents from "../models/document.model.js";

export const getDocuments = async (req, res) => {
  try {
    const result = await Documents.find();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
};
