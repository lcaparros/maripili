# import logging
# import requests
# import schedule

# # Enable logging
# logging.basicConfig(
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
# )

# logger = logging.getLogger(__name__)

token = '1842565926:AAHwS7j3WvO26JRGiqHcG1U9iUEkAnsgRsA'
# chat_id = '6269548'

# def bot_send_text(bot_message):
#     send_text = 'https://api.telegram.org/bot' + token + '/sendMessage?chat_id=' + chat_id + '&parse_mode=Markdown&text=' + bot_message

#     response = requests.get(send_text)

#     return response

# test_bot = bot_send_text('¡Hola, Kabesa!')
import logging
from uuid import uuid4

from telegram import InlineQueryResultArticle, ParseMode, InputTextMessageContent, Update
from telegram.ext import Updater, InlineQueryHandler, CommandHandler, CallbackContext
from telegram.utils.helpers import escape_markdown

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)


# Define a few command handlers. These usually take the two arguments update and
# context. Error handlers also receive the raised TelegramError object in error.
def start(update: Update, context: CallbackContext) -> None:
    """Send a message when the command /start is issued."""
    update.message.reply_text('Hi!')


def help_command(update: Update, context: CallbackContext) -> None:
    """Send a message when the command /help is issued."""
    update.message.reply_text('Help!')


def inlinequery(update: Update, context: CallbackContext) -> None:
    """Handle the inline query."""
    query = update.inline_query.query

    if query == "":
        return
    
    if "goated" in query:
        results = InlineQueryResultArticle(
            id=str(uuid4()),
            title="Viraa",
            input_message_content=InputTextMessageContent("Ole Oleee!!"),
        ),

    # results = [
        # InlineQueryResultArticle(
        #     id=str(uuid4()),
        #     title="Caps",
        #     input_message_content=InputTextMessageContent(query.upper()),
        # ),
    #     InlineQueryResultArticle(
    #         id=str(uuid4()),
    #         title="Bold",
    #         input_message_content=InputTextMessageContent(
    #             f"*{escape_markdown(query)}*", parse_mode=ParseMode.MARKDOWN
    #         ),
    #     ),
    #     InlineQueryResultArticle(
    #         id=str(uuid4()),
    #         title="Italic",
    #         input_message_content=InputTextMessageContent(
    #             f"_{escape_markdown(query)}_", parse_mode=ParseMode.MARKDOWN
    #         ),
    #     ),
    # ]

    update.inline_query.answer(results)


def main() -> None:
    """Run the bot."""
    # Create the Updater and pass it your bot's token.
    updater = Updater(token)

    # Get the dispatcher to register handlers
    dispatcher = updater.dispatcher

    # on different commands - answer in Telegram
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("help", help_command))

    # on non command i.e message - echo the message on Telegram
    dispatcher.add_handler(InlineQueryHandler(inlinequery))

    # Start the Bot
    updater.start_polling()

    logger.info("Let's wait for something interesting")
    # Block until the user presses Ctrl-C or the process receives SIGINT,
    # SIGTERM or SIGABRT. This should be used most of the time, since
    # start_polling() is non-blocking and will stop the bot gracefully.
    updater.idle()


if __name__ == '__main__':
    main()
