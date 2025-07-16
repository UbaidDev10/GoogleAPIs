# GoogleAPIs

A Node.js REST API server that provides access to Google Generative AI models (Gemini) for text, chat, multimodal (text+image), and embeddings, with user authentication and MongoDB storage.

## Features
- **Text-to-Text Generation**: Generate text completions using Gemini models.
- **Multi-turn Conversation**: Chat with context/history using Gemini models.
- **Text+Image to Text (Multimodal)**: Send text and images for multimodal generation.
- **Embeddings**: Generate vector embeddings for text.
- **User Registration & API Key Management**: Register users and issue API keys.
- **Basic Auth**: Secure endpoints with HTTP Basic Auth and API key.
- **MongoDB Storage**: Store requests, responses, and images.

## Tech Stack
- Node.js, Express
- MongoDB, Mongoose
- @google/generative-ai
- dotenv, multiparty, cors

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)

### Installation
```bash
cd GoogleAPIs
npm install
```

### Environment Variables
Create a `.env` file in `GoogleAPIs/` with the following variables:

```
DBCONNECTION=<Your MongoDB connection string>
APIKEY=<Your Google Generative AI API key>
X_KEY=<Default API key for admin or system>
HOST_URL=http://localhost:3000
IMAGE_UPLOAD_DIR=uploads/images
TOKENS=2048 # or your preferred max tokens
TEXTMODEL=gemini-pro
TEXT_IMG_MODEL=gemini-pro-vision
```

### Running the Server
```bash
npm start
```
The server will run on [http://localhost:3000](http://localhost:3000).

## API Endpoints

### User Registration
- `POST /api/user/userRegistration`
  - **Body:** `{ "email": "user@example.com" }`
  - **Response:** `{ email, apiKey }`

### Authenticated Endpoints
All endpoints below require HTTP Basic Auth (`Authorization: Basic base64(email:password)`) and `xkey` header (your API key).

#### 1. Text-to-Text Generation
- `POST /api/googleAPIs/textToText`
  - **Headers:** `model: gemini-pro`, `xkey: <apiKey>`
  - **Body:** `{ "prompt": "Your prompt here" }`
  - **Response:** `{ data: <generated text> }`

#### 2. Multi-turn Conversation
- `POST /api/googleAPIs/multiTurnConversation`
  - **Headers:** `model: gemini-pro`, `xkey: <apiKey>`
  - **Body:** `{ "prompt": "Your message", "history": [ { role, parts } ] }`
  - **Response:** `{ data: <generated reply> }`

#### 3. Text+Image to Text (Multimodal)
- `POST /api/googleAPIs/textImgToText`
  - **Headers:** `model: gemini-pro-vision`, `xkey: <apiKey>`
  - **Form Data:** `prompt: <text>`, `images: <one or more image files>`
  - **Response:** `{ data: <generated text> }`

#### 4. Embeddings
- `POST /api/googleAPIs/embeddings`
  - **Headers:** `model: embedding-001`, `xkey: <apiKey>`
  - **Body:** `{ "prompt": "Text to embed" }`
  - **Response:** `{ data: <embedding array> }`

## Example Usage
Register a user, then use the returned API key and your email for Basic Auth to access endpoints.

## Project Structure
- `controllers/` — Route handlers for API logic
- `routes/` — Express route definitions
- `models/` — Mongoose models
- `middlewares/` — Auth middleware
- `dataLayer/` — Database helpers
- `uploads/images/` — Uploaded images
