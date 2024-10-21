// components/Navbar.js
import styles from "./styles.module.css";
import { FaChevronDown } from "react-icons/fa";
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftMenu}>
        <a href="#" className={styles.menuItem}>
          Dashboard
        </a>
        <a href="#" className={styles.menuItem}>
          My Apps
        </a>
        <a href="#" className={styles.menuItem}>
          App Store
        </a>
      </div>
      <div className={styles.rightMenu}>
        <div className={styles.profileIcon}>
          <span>AP</span>
        </div>
        <FaChevronDown />
      </div>
    </nav>
  );
};

export default Navbar;
