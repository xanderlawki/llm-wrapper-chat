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

import CommandModal from "./CommandModal";
import { scrapeWebsite } from "@/api/webscrapper";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Chatbox = () => {
  const inference = new HfInference(process.env.NEXT_PUBLIC_API_KEY);
  const [loading, setLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null); // Track which message is being edited
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "How can I help you today to ensure your prompts yield the best possible results?",
      sender: "bot",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [abortController, setAbortController] = useState(null);
  const [typingEffectActive, setTypingEffectActive] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState();
  const [showCommandModal, setShowCommandModal] = useState(false);
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
  const handleCustomCommand = async (messageText) => {
    const includeUrlRegex =
      /\[include-url:\s*(https?:\/\/[^\s]+)\s*(max_execution_time:(\d+))?\s*(filter:(true|false))?\s*(store:(true|false))?\]/;
    const match = messageText.match(includeUrlRegex);

    if (match) {
      const url = match[1];
      const maxExecutionTime = match[3] || 300; // default to 300
      const filter = match[5] === "true";
      const store = match[7] === "true";

      // Call the scraping function
      const scrapedContent = await scrapeWebsite(url);

      if (scrapedContent) {
        // Replace the command with the scraped content
        const updatedMessage = messageText.replace(
          includeUrlRegex,
          scrapedContent
        );
        return updatedMessage;
      } else {
        // Handle scraping failure
        return messageText.replace(
          includeUrlRegex,
          "[Error: Failed to scrape website]"
        );
      }
    }
    return messageText;
  };

  const sendMessage = async (
    messageText = newMessage,
    isEdited = false,
    editingId = null
  ) => {
    resetTypingState(); // Reset before sending a new message

    if (messageText?.trim()) {
      setLoading(true); // Start loading for the new message
      const processedMessage = await handleCustomCommand(messageText);

      if (!isEdited) {
        // Add a new user message
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: messages.length + 1, text: processedMessage, sender: "user" },
        ]);
      } else {
        // Replace an edited message
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === editingId ? { ...msg, text: processedMessage } : msg
          )
        );
      }

      setNewMessage(""); // Clear the input field

      if (abortController) {
        abortController.abort(); // Abort previous request
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

        console.log(fullResponse, "Full response received.");
        renderResponseWithTypingEffect(fullResponse); // Start typing effect
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request was aborted.");
        } else {
          console.error("Error fetching data:", error);
        }
        setLoading(false); // Reset loading state if error occurs
      }
    }
  };

  const renderResponseWithTypingEffect = (response) => {
    const words = response.split(" ");
    let index = 0;
    let typingActive = true; // Local variable to control typing

    // Add an empty bot message before starting typing effect
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: messages.length + 2, text: "", sender: "bot" },
    ]);

    const typeNextWord = () => {
      if (index < words.length && typingActive) {
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
        setTypingTimeout(timeoutId); // Save timeout for potential stop action
      } else {
        // Typing completed
        console.log("Typing effect completed.");
        resetTypingState();
        setLoading(false); // Typing has finished, stop loading
      }
    };

    // Start typing effect
    if (words.length > 0) {
      setMessages((prevMessages) => {
        const lastMessageIndex = prevMessages.length - 1;
        const lastMessage = prevMessages[lastMessageIndex];

        return [
          ...prevMessages.slice(0, -1),
          {
            ...lastMessage,
            text: words[0], // Start with the first word
          },
        ];
      });
    }

    index++;
    setTypingEffectActive(true); // Mark typing as active
    const timeoutId = setTimeout(typeNextWord, typingSpeed);
    setTypingTimeout(timeoutId); // Store the timeout
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort(); // Abort the API stream
      setAbortController(null);
      console.log("API request aborted.");
    }

    // Stop typing effect
    if (typingTimeout) {
      clearTimeout(typingTimeout); // Clear the typing effect timeout
      setTypingTimeout(null);
      console.log("Typing timeout cleared.");
    }

    setTypingEffectActive(false); // Stop typing effect
    setLoading(false); // Ensure UI reflects that loading has stopped
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

  const handleDisable = () => {
    if (newMessage.trim() === "") {
      setIsDisabled(true);
    } else {
      return setIsDisabled(false);
    }
  };

  useEffect(() => {
    handleDisable();
  }, [newMessage]);
  console.log(newMessage, "nee ee");
  return (
    <div className={styles.chatboxContainer}>
      <div className={styles.messagesArea}>
        <div className={styles.messageHeader}>
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
      </div>

      <div className={styles.inputMessageBox}>
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
              disabled={newMessage.trim() === ""}
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
            <button
              className={styles.menuButton}
              onClick={() => setShowCommandModal(true)}
            >
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

      {showCommandModal && (
        <CommandModal
          onClose={() => setShowCommandModal(false)}
          onSubmit={(command) =>
            setNewMessage((prev) => (prev ? prev + " " + command : command))
          }
        />
      )}
    </div>
  );
};

export default Chatbox;
