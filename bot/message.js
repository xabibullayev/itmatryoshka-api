import { bot } from "./bot.js";
import { start } from "../bot/helper/start.js";
import User from "../models/user.js";
import Lid from "../models/lids.js";

let course = {
  name: "",
  date: new Date(),
  group: "",
  type: "",
  day: "",
  time: "",
};
let isApplied = false;

const message = () => {
  bot.on("message", async (msg) => {
    const chatId = msg.from.id;
    const text = msg.text;
    const user = await User.findOne({ chatId }).lean();

    if (text === "/start") {
      start(msg);
      return;
    }

    if (user) {
      if (user?.action === "request_firstname" && !user?.firstname) {
        await User.findByIdAndUpdate(user._id, {
          ...user,
          action: "request_lastname",
          firstname: text,
        });

        bot.sendMessage(chatId, `<b>Iltimas familiyanizdi kiritin'!</b>`, {
          parse_mode: "HTML",
        });
      }

      if (user?.action === "request_lastname" && !user?.lastname) {
        await User.findByIdAndUpdate(user._id, {
          ...user,
          action: "request_phone",
          lastname: text,
        });

        bot.sendMessage(
          chatId,
          `<b>Iltimas telefon nomerinizdi kiritin kiritin'!</b>`,
          {
            parse_mode: "HTML",
            reply_markup: {
              keyboard: [
                [
                  {
                    text: "Telefon nomerin jiberiw!",
                    request_contact: true,
                  },
                ],
              ],
              resize_keyboard: true,
            },
          }
        );
      }

      if (user?.action === "request_phone" && !user.phone) {
        await User.findByIdAndUpdate(user._id, {
          ...user,
          action: "registred",
          phone: msg.contact ? msg.contact.phone_number : text,
        });

        bot.sendMessage(chatId, `<b>Kerekli bo'limdi saylan'!</b>`, {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Kursqa jaziliw",
                },
                {
                  text: "Menin' kurslarim",
                },
              ],
            ],
            resize_keyboard: true,
          },
        });
      }

      if (text === "Kursqa jaziliw") {
        await User.findByIdAndUpdate(user?._id, {
          ...user,
          action: "choose_course",
        });

        bot.sendMessage(chatId, `<b>Kursti saylan'</b>`, {
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
                  text: "UI/UX dizayn",
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

      if (text === "Menin' kurslarim") {
        let list = `<b>Siz to'mendegi kurslarg'a jazilg'ansiz:</b>\n`;

        user?.lids.forEach((lid) => {
          list += `<b>${lid.name}</b> ${lid.group} ${lid.type} ${lid.day} ${
            lid.time
          } ${new Date(lid.date).toLocaleDateString("UZ")}\n`;
        });

        bot.sendMessage(chatId, list, { parse_mode: "HTML" });
      }

      if (text === "Artqa qaytiw") {
        if (user?.action === "choose_course") {
          await User.findByIdAndUpdate(user._id, {
            ...user,
            action: "registred",
          });

          bot.sendMessage(chatId, `<b>Kerekli bo'limdi saylan'!</b>`, {
            parse_mode: "HTML",
            reply_markup: {
              keyboard: [
                [
                  {
                    text: "Kursqa jaziliw",
                  },
                  {
                    text: "Menin' kurslarim",
                  },
                ],
              ],
              resize_keyboard: true,
            },
          });
        }
      }

      if (text === "Frontend" || text === "UI/UX dizayn" || text === "Python") {
        if (user?.action === "choose_course") {
          user.lids.map((lid) => {
            if (lid.name === text) {
              isApplied = true;
            }
          });

          if (isApplied === true) {
            bot.sendMessage(
              chatId,
              `<b>Siz aldin bul kursqa jazilg'ansiz! Basqa kurslardi saylawiniz mu'mkin!</b>`,
              {
                parse_mode: "HTML",
              }
            );

            isApplied = false;
            return;
          } else {
            await User.findByIdAndUpdate(user._id, {
              ...user,
              action: "choose_day",
            });

            course.name = text;

            bot.sendMessage(chatId, `<b>Qaysi ku'nleri kele alasiz?</b>`, {
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
        }
      }

      if (
        text === "Taq ku'nleri" ||
        text === "Jup ku'nleri" ||
        text === "Ha'r ku'ni"
      ) {
        if (user?.action === "choose_day") {
          await User.findByIdAndUpdate(user._id, {
            ...user,
            action: "choose_time",
          });

          course.day = text;

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

      if (text === "Azanda" || text === "Tu'sten keyin" || text === "Keshte") {
        if (user?.action === "choose_time") {
          const newLid = new Lid({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone,
            name: course.name,
            date: new Date(),
            group: course.group,
            type: course.type,
            day: course.day,
            time: text,
            status: "",
          });

          await newLid.save();

          await User.findByIdAndUpdate(user._id, {
            ...user,
            action: "registred",
            lids: [
              ...user.lids,
              {
                name: course.name,
                date: new Date(),
                group: course.group,
                type: course.type,
                day: course.day,
                time: text,
              },
            ],
          });

          course = {
            name: "",
            date: new Date(),
            group: "",
            type: "",
            day: "",
            time: text,
          };
          isApplied = false;

          bot.sendMessage(
            chatId,
            `<b>Tanlawiniz ushin raxmet. Tez arada operatorlarimiz siz benen baylanisadi.</b>`,
            {
              parse_mode: "HTML",
              reply_markup: {
                keyboard: [
                  [
                    {
                      text: "Kursqa jaziliw",
                    },
                    {
                      text: "Menin' kurslarim",
                    },
                  ],
                ],
                resize_keyboard: true,
              },
            }
          );
        }
      }

      if (
        text === "Inglis tili" ||
        text === "Kompyuter sawatqanlig'i" ||
        text === "Rus tili"
      ) {
        if (user?.action === "choose_course") {
          user.lids.map((lid) => {
            if (lid.name === text) {
              isApplied = true;
            }
          });

          if (isApplied === true) {
            bot.sendMessage(
              chatId,
              `<b>Siz aldin bul kursqa jazilg'ansiz! Basqa kurslardi saylawiniz mu'mkin!</b>`,
              {
                parse_mode: "HTML",
              }
            );

            isApplied = false;

            return;
          } else {
            await User.findByIdAndUpdate(user._id, {
              ...user,
              action: "choose_group_type",
            });

            course.name = text;

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
        }
      }

      if (text === "Individual" || text === "Gruppa") {
        if (user?.action === "choose_group_type") {
          if (course?.name === "Rus tili") {
            await User.findByIdAndUpdate(user?._id, {
              ...user,
              action: "choose_course_type",
            });

            course.group = text;

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
          } else {
            await User.findByIdAndUpdate(user._id, {
              ...user,
              action: "choose_day",
            });

            course.group = text;

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
        }
      }

      if (text === "Online" || text === "Offline") {
        if (user?.action === "choose_course_type") {
          await User.findByIdAndUpdate(user._id, {
            ...user,
            action: "choose_day",
          });

          course.type = text;

          bot.sendMessage(chatId, `<b>Qaysi ku'nleri kele alasiz?</b>`, {
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
      }
    }
  });
};

export default message;
