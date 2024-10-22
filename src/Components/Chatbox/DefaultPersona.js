// components/Persona.js
import styles from "./styles.module.css";

const Persona = () => {
  return (
    <div className={styles.personaContainer}>
      <p className={styles.defaultText}>DEFAULT PERSONA</p>
      <h2 className={styles.personaTitle}>
        World-Class React/Front-End Developer
      </h2>
    </div>
  );
};

export default Persona;
