import MainContent from "@/Components/MainContent";
import Sidebar from "@/Components/Sidebar";
import styles from "./styles.module.css";
export default function Home() {
  return (
    <div className={styles.container}>
      <Sidebar />

      <MainContent />
    </div>
  );
}
