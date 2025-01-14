
# CDP ChatBot

The CDP Support Agent Chatbot is a Next.js-based application designed to assist users with "how-to" questions related to four Customer Data Platforms (CDPs): Segment, mParticle, Lytics, and Zeotap. The chatbot leverages Langchain and OpenAI API to extract relevant information from the official documentation of these platforms and provide accurate, step-by-step guidance to users.

Built with TypeScript, ShadCN UI, and modern web technologies, this chatbot is capable of handling variations in user questions, navigating through documentation, and delivering precise answers to user queries.

## Tech Stack Used


- **Frontend**:  Next.js, TypeScript, Tailwind CSS
- **Backend**:  Next.js API routes, TypeScript, Langchain, OpenAI API
- **UI Library**:  ShadCN UI


## Screenshots

![App Screenshot](https://firebasestorage.googleapis.com/v0/b/docwrite-38576.appspot.com/o/ksnip_20250114-125124.png?alt=media&token=16105a99-2b7b-4447-88dc-4a90bfc26d1f)



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`OPENAI_API_KEY`="your OPENAI API KEY"


## Deployment

- You can view the application by clicking the URL:
-  URL: https://cdp-chatbot.vercel.app/
## Run Locally

Clone the project

```bash
  git clone https://github.com/abhinavkr2108/cdp-chatbot
```

Go to the project directory

```bash
  cd chatbot
```

Install dependencies

```bash
  npm install
```

Run the development Server

```bash
  npm run dev
```

