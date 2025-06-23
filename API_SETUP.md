# OpenAI API Setup Guide

## 🔑 Setting Up Your OpenAI API Key

To enable intelligent divine responses, you need to set up your OpenAI API key:

### 1. Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in your dashboard
4. Create a new API key
5. Copy the API key (it starts with `sk-`)

### 2. Configure the Environment
1. Create a file named `.env` in the root directory of your project
2. Add your API key to the file:
   ```
   REACT_APP_OPENAI_API_KEY=sk-your_actual_api_key_here
   ```
3. Save the file

### 3. Restart the Development Server
After adding the API key, restart your development server:
```bash
npm start
```

## 🚀 Features Enabled with OpenAI

With the API key configured, you'll get:

- **Intelligent Responses**: Each God responds contextually to your messages
- **God-Specific Personalities**: Different response styles for each deity
- **Sanskrit Integration**: Responses include appropriate Sanskrit phrases
- **Spiritual Guidance**: Personalized divine wisdom based on your questions
- **Conversation Memory**: Gods remember your previous messages for context

## 💰 API Usage Costs

- **GPT-4 Model**: Used for intelligent responses
- **Token Usage**: Approximately 100-200 tokens per response
- **Estimated Cost**: ~$0.01-0.03 per conversation session
- **Rate Limits**: OpenAI has rate limits, but they're generous for personal use

## 🔒 Security Notes

- **Never commit your API key** to version control
- The `.env` file is automatically ignored by Git
- Keep your API key private and secure
- Consider using environment variables in production

## 🛠️ Fallback System

If the API is unavailable or fails:
- The app will use predefined divine responses
- No functionality will be lost
- Users can still have meaningful conversations

## 📝 Example Usage

Once configured, you can ask questions like:
- "Lord Ganesha, I'm starting a new business. Can you help me?"
- "Goddess Lakshmi, I need financial guidance."
- "Lord Shiva, I'm struggling with meditation."
- "Lord Krishna, teach me about dharma."

Each God will respond with personalized wisdom and guidance! 