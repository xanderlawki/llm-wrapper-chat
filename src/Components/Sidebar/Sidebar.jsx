import Image from "next/image";
import styles from "./styles.module.css";

import {
  FaChevronDown,
  FaFolder,
  FaHistory,
  FaCloud,
  FaFileAlt,
} from "react-icons/fa"; // Icons from react-icons
import TokenCounter from "../TokenContainer/TokenCounter";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.logo}>
          <Image
            src="/unic-logo.svg"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "50%", height: "50%" }}
            alt="students talking"
          />
        </div>

        <button className={styles.newChatButton}>+ New Chat</button>
        <ul className={styles.menu}>
          <li>
            <FaHistory className={styles.icon} />{" "}
            <p className={styles.listText}>Recents</p>
          </li>
          <li className={styles.library}>
            <div className={styles.imglibrary}>
              <Image
                src="/library.svg"
                width={12}
                height={12}
                className={styles.icon}
                alt="library"
              />{" "}
              <p className={styles.listText}>Library</p>
            </div>
            <FaChevronDown />
          </li>
          <ul className={styles.subMenu}>
            <li>Lists</li>
            <li>Personas</li>
            <li>Agents</li>
            <li>Projects</li>
            <li>Prompts</li>
          </ul>
          <li>
            <FaCloud className={styles.icon} />{" "}
            <p className={styles.listText}>App Files</p>
          </li>
        </ul>
      </div>
      <div className={styles.tokenCntainer}>
        <TokenCounter />
        <ul className={styles.sharedelete}>
          <li>
            <FaFileAlt className={styles.icon} /> Shared
          </li>
          <li>
            <FaFileAlt className={styles.icon} /> Recently Deleted
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
