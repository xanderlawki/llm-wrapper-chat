// components/Navbar.js
import Image from "next/image";
import styles from "./styles.module.css";
import TabSwitcher from "./TabSwitcher";
const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.task}>
        <p>Front End Task</p>
        <Image src="/editicon.png" width={10} height={10} alt="task" />
      </div>
      <div>
        <TabSwitcher />
      </div>
      <div className={styles.chatgptcontainer}>
        <div className={styles.chatgpt}>
          <p className={styles.chatgptText}>ChatGpt 4o</p>
        </div>

        <Image src="/library.svg" width={10} height={10} alt="library" />
        <Image src="/download.png" width={30} height={30} alt="download" />
        <Image src="/share.png" width={30} height={30} alt="share" />
      </div>
    </div>
  );
};

export default Header;
