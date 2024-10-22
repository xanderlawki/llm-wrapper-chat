import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { FiCommand } from "react-icons/fi";
import { FaCommentAlt, FaUserAlt, FaChevronRight } from "react-icons/fa";
import styles from "./styles.module.css";
import ChatMessage from "./Chatmessage";
import Persona from "./DefaultPersona";
import dynamic from "next/dynamic";
import { HfInference } from "@huggingface/inference";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Chatbox = () => {
  const inference = new HfInference(process.env.NEXT_PUBLIC_API_KEY);
  const [loading, setLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null); // Track which message is being edited
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "<p>This is a <strong>bold</strong> statement!</p>",
      sender: "user",
    },
    {
      id: 2,
      text: "Here is some code:\n```js\nconsole.log('Hello World');\n```",
      sender: "bot",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [abortController, setAbortController] = useState(null);
  const [typingEffectActive, setTypingEffectActive] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const typingSpeed = 100;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const resetTypingState = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
    setTypingEffectActive(false);
  };

  const sendMessage = async (
    messageText = newMessage,
    isEdited = false,
    editingId = null
  ) => {
    console.log(newMessage, "message yext");
    resetTypingState(); // Reset before sending a new message or edited message

    if (messageText?.trim()) {
      setLoading(true);

      if (!isEdited) {
        // This handles adding a new message
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: messages.length + 1, text: messageText, sender: "user" },
        ]);
      } else {
        // This handles replacing an edited message
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === editingId ? { ...msg, text: messageText } : msg
          )
        );
      }

      setNewMessage(""); // Clear the input field

      if (abortController) {
        abortController.abort(); // Cancel any previous requests
      }

      const controller = new AbortController();
      setAbortController(controller);

      try {
        const stream = inference.chatCompletionStream({
          model: "meta-llama/Llama-3.2-3B-Instruct",
          messages: [{ role: "user", content: messageText }],
          max_tokens: 4000,
          signal: controller.signal,
        });

        let fullResponse = "";

        for await (const chunk of stream) {
          const responseContent = chunk.choices[0]?.delta?.content || "";
          fullResponse += responseContent;
        }

        renderResponseWithTypingEffect(fullResponse);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request was aborted");
        } else {
          console.error("Error fetching data:", error);
        }
        setLoading(false);
      }
    }
  };

  const renderResponseWithTypingEffect = (response) => {
    const words = response.split(" ");
    let index = 0;

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: messages.length + 2, text: "", sender: "bot" },
    ]);

    const typeNextWord = () => {
      if (index < words.length && typingEffectActive) {
        setMessages((prevMessages) => {
          const lastMessageIndex = prevMessages.length - 1;
          const lastMessage = prevMessages[lastMessageIndex];

          return [
            ...prevMessages.slice(0, -1),
            {
              ...lastMessage,
              text:
                lastMessage.text + (lastMessage.text ? " " : "") + words[index],
            },
          ];
        });

        index++;
        const timeoutId = setTimeout(typeNextWord, typingSpeed);
        setTypingTimeout(timeoutId);
      } else {
        setLoading(false);
      }
    };

    if (words.length > 0) {
      setMessages((prevMessages) => {
        const lastMessageIndex = prevMessages.length - 1;
        const lastMessage = prevMessages[lastMessageIndex];

        return [
          ...prevMessages.slice(0, -1),
          {
            ...lastMessage,
            text: words[0],
          },
        ];
      });
    }

    index++;
    setTypingEffectActive(true);
    const timeoutId = setTimeout(typeNextWord, typingSpeed);
    setTypingTimeout(timeoutId);
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }
    resetTypingState();
    setLoading(false);
  };

  const handleEditMessage = (id) => {
    setEditingMessageId(id); // Set the message ID for the one being edited
  };

  const handleSaveEdit = (id, updatedText) => {
    setMessages((prevMessages) => {
      // Remove the edited message from its current position
      const filteredMessages = prevMessages.filter((msg) => msg.id !== id);

      // Append the edited message to the end of the array
      const editedMessage = { id, text: updatedText, sender: "user" };

      return [...filteredMessages, editedMessage];
    });

    setEditingMessageId(null); // Exit edit mode after saving

    sendMessage(updatedText, true, id); // Call the sendMessage function to handle the edited message
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null); // Exit edit mode without saving
  };

  return (
    <div className={styles.chatboxContainer}>
      <div className={styles.messagesArea}>
        <Persona />
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isEditing={editingMessageId === message.id}
            onEditMessage={handleEditMessage}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            setNewMessage={setNewMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <div className={styles.quillWrapper}>
          <ReactQuill
            theme="snow"
            className={`custom-toolbar ${styles.messageInput}`}
            value={newMessage}
            onChange={setNewMessage}
            placeholder="Type '/' for quick access to the command menu."
          />

          <button
            className={
              newMessage ? styles.sendButton : styles.sendButtonDisabled
            }
            onClick={loading ? handleStop : () => sendMessage(newMessage)}
            disabled={newMessage ? false : true}
          >
            {loading ? (
              <Image src="/stop.svg" width={30} height={30} alt="stop" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
      </div>

      <div className={styles.bottomMenu}>
        <div className={styles.menuButtons}>
          <button className={styles.menuButton}>
            <FiCommand className={styles.menuIcon} /> Commands
          </button>
          <button className={styles.menuButton}>
            <FaCommentAlt className={styles.menuIcon} /> Prompts
          </button>
          <button className={styles.menuButton}>
            <FaUserAlt className={styles.menuIcon} /> Personas
          </button>
          <button className={styles.menuButton}>
            <IoIosAdd className={styles.menuIcon} /> Add
          </button>
        </div>
        <div className={styles.messageStatus}>
          32/818 <FaChevronRight />
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
