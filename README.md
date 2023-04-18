# AI Chatbot API

This project provides an API for interacting with an AI chatbot based on OpenAI's GPT-4 model. The API allows users to initialize, open, prompt, and close the bot using Express and Node.js.

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/ai-chatbot-api.git
   ```

2. Install dependencies:
   ```
   cd ai-chatbot-api
   npm install
   ```

### Usage

1. Start the development server:
   ```
   npm run start
   ```

The server will start on port 3001 or the port specified in the environment variable `PORT`. The bot will be initialized and opened automatically.

### API Endpoints

#### POST /api/bot/close

Closes the bot.

Request Body: None

Response:

```json
{
  "message": "Bot closed successfully."
}
```

#### POST /api/bot/prompt

Sends a prompt to the bot and receives a response.

Request Body:

```json
{
  "prompt": "Your prompt text here"
}
```

Response:

```json
{
  "message": "Bot's response text here"
}
```

## Contributing

Please feel free to submit issues or pull requests for improving the project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
