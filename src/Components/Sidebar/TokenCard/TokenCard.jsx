// components/TokenCounter.js
import Image from "next/image";
import styles from "./styles.module.css";

const TokenCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p className={styles.tokenText}>125,000 tokens left</p>
        <p className={styles.wordCount}>~145,000 words</p>
        <p className={styles.wordCount}>See My Plan</p>
      </div>
      <div className={styles.progressContainer}>
        <Image src="/Loader.png" width={30} height={30} alt="logo" />
      </div>
    </div>
  );
};

export default TokenCard;
