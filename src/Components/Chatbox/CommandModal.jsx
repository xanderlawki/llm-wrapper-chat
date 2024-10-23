import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import ScrapingModal from "./ScrapingModal";

// Modal for processing and displaying scraping status

// Main component to handle command input and modal
const CommandModal = ({ onClose, onSubmit }) => {
  const [url, setUrl] = useState("");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [maxExecutionTime, setMaxExecutionTime] = useState(300);
  const [filter, setFilter] = useState(false);
  const [store, setStore] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [urlsToScrape, setUrlsToScrape] = useState([]);

  const handleSubmit = () => {
    const command = `[include-url: ${url} max_execution_time:${maxExecutionTime} filter:${filter} store:${store}]`;
    onSubmit(command);

    // Start scraping process
    setUrlsToScrape([url]);
    setScraping(true);
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h3>Commands</h3>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
      </div>
      <div className={styles.modalContent}>
        <div className={styles.section}>
          <label>INCLUDE URL</label>
          <div className={styles.inputRow}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className={styles.inputBox}
            />
            <button
              className={styles.advancedButton}
              onClick={() => setAdvancedMode(!advancedMode)}
            >
              {advancedMode ? "Basic Mode" : "Advanced"}
            </button>
            <button className={styles.insertButton} onClick={handleSubmit}>
              Insert
            </button>
          </div>

          {advancedMode && (
            <div className={styles.advancedOptions}>
              <label>
                Max Execution Time:
                <input
                  type="number"
                  value={maxExecutionTime}
                  onChange={(e) => setMaxExecutionTime(Number(e.target.value))}
                  className={styles.inputBox}
                />
              </label>

              <label>
                Filter Content:
                <input
                  type="checkbox"
                  checked={filter}
                  onChange={(e) => setFilter(e.target.checked)}
                />
              </label>

              <label>
                Store Content:
                <input
                  type="checkbox"
                  checked={store}
                  onChange={(e) => setStore(e.target.checked)}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Show ScrapingModal when scraping starts */}
      {scraping && (
        <ScrapingModal
          urls={urlsToScrape}
          onCancel={() => setScraping(false)}
        />
      )}
    </div>
  );
};

export default CommandModal;
