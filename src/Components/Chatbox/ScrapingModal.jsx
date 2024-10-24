import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

const ScrapingModal = ({ urls, onCancel }) => {
  const [status, setStatus] = useState({});

  useEffect(() => {
    const scrapeUrls = async () => {
      const updatedStatus = { ...status };
      for (const url of urls) {
        try {
          updatedStatus[url] = "Accessing";
          setStatus({ ...updatedStatus });

          // Simulate scraping or call real scraping API here
          await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate delay
          updatedStatus[url] = "Complete"; // You can update this with real results
        } catch (error) {
          updatedStatus[url] = "Failed";
        }
        setStatus({ ...updatedStatus });
      }
    };

    scrapeUrls();
  }, [urls]);

  return (
    <div className={styles.scrapingModal}>
      <h3>Scraping in Progress</h3>
      {urls.map((url, index) => (
        <div key={index} className={styles.urlStatus}>
          <p>{url}</p>
          <p>{status[url] || "Waiting..."}</p>
        </div>
      ))}
      <button className={styles.cancelButton} onClick={onCancel}>
        Cancel All
      </button>
    </div>
  );
};

export default ScrapingModal;
