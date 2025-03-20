import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Velkominn/n, hér er verkefni 4</h1>
        <p className={styles.linkText}>
          <Link href="/questions/create">Búa til nýja spurningu</Link>
        </p>
      </div>
    </div>
  );
}
