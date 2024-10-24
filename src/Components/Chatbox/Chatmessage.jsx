import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import DOMPurify from "dompurify";
import { FaEdit } from "react-icons/fa";
import styles from "./styles.module.css";
import Image from "next/image";
import dynamic from "next/dynamic";

// Load ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ChatMessage = ({
  message,
  onEditMessage,
  isEditing,
  onSaveEdit,
  onCancelEdit,
  setNewMessage,
}) => {
  const [sanitizedMessage, setSanitizedMessage] = useState("");
  const [editContent, setEditContent] = useState(message.text); // Track the edited message content

  useEffect(() => {
    // Sanitize the message text
    const cleanMessage = DOMPurify.sanitize(message.text);
    setSanitizedMessage(cleanMessage);
  }, [message.text]);

  const handleSaveEdit = () => {
    onSaveEdit(message.id, editContent);
  };

  return (
    <div
      className={`${styles.messageContainer} ${
        message.sender === "bot" ? styles.botContainer : ""
      }`}
    >
      <div
        className={`${styles.message} ${
          message.sender === "bot" ? styles.botMessage : styles.userMessage
        }`}
      >
        {isEditing ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {/* Render ReactQuill editor when in edit mode */}
            <ReactQuill
              className={styles.editquillWrapper}
              theme="snow"
              value={editContent}
              onChange={setEditContent}
            />
            <div className={styles.editControls}>
              <button onClick={handleSaveEdit} className={styles.saveButton}>
                Save
              </button>
              <button onClick={onCancelEdit} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        ) : // Show the sanitized message if not in edit mode
        message.sender === "user" ? (
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

      {/* Icons under both user and bot messages */}
      {message.sender === "user" && !isEditing && (
        <div
          className={
            message.sender === "bot"
              ? styles.botIconContainer
              : styles.iconContainer
          }
        >
          <>
            <Image
              src={"/library.svg"}
              alt="library"
              width={10}
              height={20}
              className={styles.icon}
            />
            <FaEdit
              className={styles.icon}
              onClick={() => onEditMessage(message.id)} // Trigger edit mode on click
            />
            <Image
              src={"/share.png"}
              alt="share"
              width={30}
              height={20}
              className={styles.icon}
            />
          </>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
