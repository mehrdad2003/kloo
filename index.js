// Load the Telegram API library
import TelegramBot from 'node-telegram-bot-api';

// Define our PRIVATE token! 
const token = '6157645463:AAFV_j_JrD3A0GGvmd9aM5dPn2cXzvoHc9s';

// Initialize and connect the bot
const bot = new TelegramBot(token, {polling: true});

// Movies available for rent
const movies = [
  {title: 'The Godfather', price: 5},
  {title: 'The Shawshank Redemption', price: 6},
  {title: 'The Dark Knight', price: 7},
  {title: 'The Godfather: Part II', price: 5},
  {title: '12 Angry Men', price: 4},
  {title: 'Schindler\'s List', price: 6},
];

// Main menu
const mainMenu = {
  reply_markup: {
    keyboard: [
      ['📖 Rent a movie'],
      ['❌ Cancel'],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

// Movies menu
const moviesMenu = {
  reply_markup: {
    keyboard: movies.map(movie => [movie.title]),
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

// Rent confirmation menu
const confirmRentMenu = (movie, price) => ({
  reply_markup: {
    inline_keyboard: [
      [
        {text: `Confirm rent for ${price}$`, callback_data: `rent:${movie}:${price}`},
        {text: 'Cancel', callback_data: 'cancel'},
      ],
    ],
  },
});

// Handle commands
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome to our movie rental bot!', mainMenu);
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Use the main menu to rent a movie or cancel your request.', mainMenu);
});

// Handle button clicks
bot.on('callback_query', (query) => {
  const [action, movie, price] = query.data.split(':');

  switch (action) {
    case 'rent':
      bot.answerCallbackQuery(query.id, `You rented ${movie} for ${price}$`);
      break;
    case 'cancel':
      bot.answerCallbackQuery(query.id, 'Cancelled');
      break;
    default:
      break;
  }
});

// Handle messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  switch (text) {
    case '📖 Rent a movie':
      bot.sendMessage(chatId, 'Choose a movie:', moviesMenu);
      break;
    case '❌ Cancel':
      bot.sendMessage(chatId, 'Your request has been cancelled.', mainMenu);
      break;
    default:
      // Check if the selected text matches any of the available movies
      const movie = movies.find(movie => movie.title === text);
      if (movie) {
        bot.sendMessage(chatId, `You selected ${movie.title} for ${movie.price}$.\nConfirm your rent request:`, confirmRentMenu(movie.title, movie.price));
      } else {
        bot.sendMessage(chatId, 'Invalid input. Use the main menu to rent a movie or cancel your request.', mainMenu);
      }
      break;
  }
});