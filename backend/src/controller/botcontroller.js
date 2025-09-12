import Bot from "../bot.js";

export const createBot = async (req, res) => {
  try {
    const bot = new Bot({ roomName: req.body.roomName });
    const savedBot = await bot.save();
    res.status(201).json(savedBot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

