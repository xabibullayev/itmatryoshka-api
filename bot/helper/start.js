import { bot } from "../bot.js";
import User from "../../models/user.js";
import message from "../message.js";

export const start = async (msg) => {
  const chatId = msg.from.id;
  const user = await User.findOne({ chatId }).lean();

  if (!user) {
    const newUser = new User({
      username: msg.from.username,
      chatId,
      createdAt: new Date(),
      action: "request_firstname",
    });

    await newUser.save();

    bot.sendMessage(chatId, `<b>Iltimas atinizdi kiritin'!</b>`, {
      parse_mode: "HTML",
      reply_markup: {
        remove_keyboard: true,
      },
    });
  } else {
    if (!user?.firstname && user?.action === "request_firstname") {
      bot.sendMessage(chatId, `<b>Iltimas atinizdi kiritin'!</b>`, {
        parse_mode: "HTML",
      });
    }

    if (!user?.lastname && user?.action === "request_lastname") {
      bot.sendMessage(chatId, `<b>Iltimas familiyanizdi kiritin'!</b>`, {
        parse_mode: "HTML",
      });
    }

    if (!user?.phone && user?.action === "request_phone") {
      bot.sendMessage(chatId, `<b>Iltimas telefon nomerinizdi kiritin'!</b>`, {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            [
              {
                text: "Telefon nomerdi jiberiw!",
                request_contact: true,
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    }

    if (user?.action === "choose_course") {
      bot.sendMessage(chatId, `<b>Kursti saylan'.</b>`, {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            [
              {
                text: "Rus tili",
              },
              {
                text: "Inglis tili",
              },
            ],
            [
              {
                text: "Kompyuter sawatqanlig'i",
              },
              {
                text: "Python",
              },
            ],
            [
              {
                text: "Frontend",
              },
              {
                text: "Backend",
              },
            ],
            [
              {
                text: "Artqa qaytiw",
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    }

    if (user?.action === "choose_group_type") {
      bot.sendMessage(
        chatId,
        `<b>Jaqsi. Sabaqlar qanday formada o'tiliwin qa'leysiz?</b>`,
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Individual",
                },
                {
                  text: "Gruppa",
                },
              ],
            ],
            resize_keyboard: true,
          },
        }
      );
    }

    if (user?.action === "choose_course_type") {
      bot.sendMessage(
        chatId,
        `<b>Jaqsi. Sabaqlar qanday tipte boliwin qa'leysiz?</b>`,
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Online",
                },
                {
                  text: "Offline",
                },
              ],
            ],
            resize_keyboard: true,
          },
        }
      );
    }

    if (user?.action === "choose_day") {
      bot.sendMessage(chatId, `<b>Qaysi kunleri kele alasiz?</b>`, {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            [
              {
                text: "Taq ku'nleri",
              },
              {
                text: "Jup ku'nleri",
              },
              {
                text: "Ha'r ku'ni",
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    }

    if (user?.action === "choose_time") {
      bot.sendMessage(chatId, `<b>Qaysi waqit sizge qolayli?</b>`, {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            [
              {
                text: "Azanda",
              },
              {
                text: "Tu'sten keyin",
              },
              {
                text: "Keshte",
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    }
  }
};
