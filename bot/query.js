import { bot } from "./bot.js";
import User from "../models/user.js";
import message from "./message.js";

const query = () => {
  bot.on("callback_query", async (query) => {
    const { data } = query;
    const chatId = query.from.id;
    const user = await User.findOne({ chatId }).lean();

    if (data === "register") {
      console.log(query);
      if (!user.firstname) {
        await User.findByIdAndUpdate(
          user._id,
          {
            ...user,
            action: "request_lastname",
          },
          { new: true }
        );

        bot.sendMessage(chatId, `Iltimas atin'izdi kiritin'!`);
      } else if (!user.lastname) {
        await User.findByIdAndUpdate(
          user._id,
          {
            ...user,
            action: "request_lastname",
          },
          { new: true }
        );

        bot.sendMessage(chatId, `Iltimas familiyan'izdi kiritin'!`);
      } else if (!user.phone) {
        await User.findByIdAndUpdate(
          user._id,
          {
            ...user,
            action: "request_phone",
          },
          { new: true }
        );

        bot.sendMessage(chatId, `Telefon nomerin'izdi kiritin'!`);
      } else {
        bot.sendMessage(chatId, `Kursti saylan'!`, {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Frontend",
                },
              ],
            ],
            resize_keyboard: true,
          },
        });
      }

      message();
    }
  });
};

export default query;
