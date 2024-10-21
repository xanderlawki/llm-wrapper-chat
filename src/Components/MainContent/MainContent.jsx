import Header from "../Header/Header";
import Navbar from "../NavBar/navbar";
import styles from "./styles.module.css";

const MainContent = () => {
  return (
    <div className={styles.mainContent}>
      <Navbar />
      <Header />
    </div>
  );
};

export default MainContent;
