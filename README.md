# LLM Wrapper Chat

## Overview
The LLM Wrapper Chat is an interactive web application that allows users to engage with a language model (LLM) through a rich text editor. This project includes features such as markdown rendering, command handling for web scraping, and an intuitive user interface based on the provided Figma design.

## Features
- **WYSIWYG Editor**: Users can type and format their messages using a user-friendly editor.
- **LLM Interaction**: Responses from the LLM are properly handled, including markdown and syntax highlighting.
- **Stop Generation**: Users can stop the generation of replies from the LLM at any time.
- **Edit Previous Messages**: Users can edit any previous message, and upon saving, the updated prompt is sent to the LLM again.
- **Custom Command Handling**: Support for custom commands, including:
  - **include-url Command**: Allows users to scrape content from a given URL and integrate it into their message.

## Getting Started
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/xanderlawki/llm-wrapper-chat.git
   cd your-repo-name

   Install Dependencies:
   npm install

   Environment Variables: Ensure you have the necessary environment variables set for the LLM endpoint and any other configurations required.


   Run the Application:
   npm run dev
Usage
To use the LLM wrapper, type your message in the WYSIWYG editor.
You can include commands like [include-url: [SOME URL] max_execution_time:300 filter:true store:true] in your message to scrape content from a specified URL.
Click the provided button to open a modal for easier command creation.
Edit previous messages as needed and click "Save" to resend the updated prompt to the LLM.
Technology Stack
Frontend: React, Next.js
Styling: CSS Modules
Services
 Hugging Face API for LLM interaction
Web Scraping: Custom scraping code provided in the project
Deployment
This project is deployed using Vercel. You can access the live application at https://llm-wrapper-chat-69btf61cd-xanders-projects-1a8d0072.vercel.app/.
