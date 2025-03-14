import Link from "next/link";
import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href="/">Forsíða</Link>
        </li>
        <li>
          <Link href="/categories">Categories</Link>
        </li>
      </ul>
    </nav>
  );
}
