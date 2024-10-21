import { useState } from "react";
import styles from "./styles.module.css"; // Importing the CSS module

const TabSwitcher = () => {
  const [activeTab, setActiveTab] = useState("Sequential");

  return (
    <div className={styles.tabcontainer}>
      {["Stream", "Parallel", "Sequential"].map((tab) => (
        <button
          key={tab}
          className={`${styles.tab} ${
            activeTab === tab ? styles.active : styles.inactive
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
