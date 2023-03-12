import { Link } from "react-router-dom";
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
      <Link to="/" title="Shoppingify">
        <img src="/logo.svg" alt="Shoppingify logo" />
      </Link>
      <ul>
        <li>
          <Link to="/" title="Items">
            <ListIcon />
          </Link>
        </li>
        <li>
          <Link to="/history" title="History">
            <HistoryIcon />
          </Link>
        </li>
        <li>
          <Link to="/statistics" title="Statistics">
            <StatisticsIcon />
          </Link>
        </li>
      </ul>
      <button aria-label="Toggle shopping list">
        <ShoppingCartIcon />
      </button>
    </nav>
  );
}
