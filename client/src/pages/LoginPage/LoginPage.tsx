import styles from "./LoginPage.module.css";

export default function LoginPage() {
  return (
    <div className={styles["login-page"]}>
      <div>
        <img src="/logo.svg" alt="Shoppingify logo" />
        <h1>Login</h1>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" title="Login">
            Login
          </button>
        </form>
        <p>
          Don&apos;t have an account yet?{" "}
          <a href="/register" title="Register">
            Register
          </a>
        </p>
      </div>
      <footer>
        <a
          href="https://github.com/vanaldito"
          title="Vanaldito"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vanaldito
        </a>
        <a
          href="https://devchallenges.io"
          title="DevChallenges"
          target="_blank"
          rel="noopener noreferrer"
        >
          devchallenges.io
        </a>
      </footer>
    </div>
  );
}
