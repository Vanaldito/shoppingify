import {
  HistoryIcon,
  ListIcon,
  ShoppingCartIcon,
  StatisticsIcon,
} from "../Icons";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="/">
        <img src="/logo.svg" />
      </a>
      <ul>
        <li>
          <a href="/">
            <ListIcon />
          </a>
        </li>
        <li>
          <a href="/history">
            <HistoryIcon />
          </a>
        </li>
        <li>
          <a href="/statistics">
            <StatisticsIcon />
          </a>
        </li>
      </ul>
      <button>
        <ShoppingCartIcon />
      </button>
    </nav>
  );
}
