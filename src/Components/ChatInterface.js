import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitization
import styles from "./styles.module.css";

const ChatMessage = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState("");

  useEffect(() => {
    // Sanitize the message text
    const cleanMessage = DOMPurify.sanitize(message.text);
    setSanitizedMessage(cleanMessage);
  }, [message.text]);

  return (
    <div
      className={`${styles.message} ${
        message.sender === "bot" ? styles.botMessage : styles.userMessage
      }`}
    >
      {/* Using dangerouslySetInnerHTML for rendering sanitized HTML */}
      {message.sender === "user" ? (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      ) : (
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={darcula}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {sanitizedMessage}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default ChatMessage;
