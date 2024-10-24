import Chatbox from "../Chatbox/Chatbox";
import Header from "../Header/Header";

import Navbar from "../NavBar/Navbar";

import styles from "./styles.module.css";

const MainContent = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.navbar}>
        <Navbar />
      </div>

      <div className={styles.header}>
        <Header />
      </div>

      <div className={styles.chatbox}>
        <Chatbox />
      </div>
    </div>
  );
};

export default MainContent;
