import Chatbox from "../Chatbox/Chatbox";
import Header from "../Header/Header";

import Navbar from "../NavBar";

import styles from "./styles.module.css";

const MainContent = () => {
  return (
    <div className={styles.mainContent}>
      <div>
        <div className={styles.navbar}>
          <Navbar />
        </div>

        <div className={styles.header}>
          <Header />
        </div>
      </div>

      <div className={styles.chatbox}>
        <Chatbox />
      </div>
    </div>
  );
};

export default MainContent;
