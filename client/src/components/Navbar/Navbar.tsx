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
      <a href="/" title="Shoppingify">
        <img src="/logo.svg" alt="Shoppingify logo" />
      </a>
      <ul>
        <li>
          <a href="/" title="Items">
            <ListIcon />
          </a>
        </li>
        <li>
          <a href="/history" title="History">
            <HistoryIcon />
          </a>
        </li>
        <li>
          <a href="/statistics" title="Statistics">
            <StatisticsIcon />
          </a>
        </li>
      </ul>
      <button aria-label="Toggle shopping list">
        <ShoppingCartIcon />
      </button>
    </nav>
  );
}
