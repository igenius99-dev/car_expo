import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Navigation Header */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <span className={styles.logoText}>CAR EXPO</span>
            <span className={styles.logoYear}>2024</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#showcase">Showcase</a>
            <a href="#events">Events</a>
            <a href="#exhibitors">Exhibitors</a>
            <a href="#tickets">Tickets</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Premium Automotive
            <span className={styles.heroHighlight}> Showcase</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Experience the future of automotive innovation with the world's most prestigious brands
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton}>
              Get Tickets
            </button>
            <button className={styles.secondaryButton}>
              View Schedule
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.carPlaceholder}>
            🚗
          </div>
        </div>
      </section>

      {/* Car Showcase Section */}
      <section id="showcase" className={styles.showcase}>
        <h2 className={styles.sectionTitle}>Featured Vehicles</h2>
        <div className={styles.carGrid}>
          <div className={styles.carCard}>
            <div className={styles.carImage}>🏎️</div>
            <h3>Luxury Sports</h3>
            <p>High-performance vehicles for the discerning enthusiast</p>
          </div>
          <div className={styles.carCard}>
            <div className={styles.carImage}>🚙</div>
            <h3>Electric Future</h3>
            <p>Cutting-edge electric vehicles leading the charge</p>
          </div>
          <div className={styles.carCard}>
            <div className={styles.carImage}>🚗</div>
            <h3>Classic Collection</h3>
            <p>Timeless classics that define automotive history</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Car Expo 2024</h4>
            <p>Premium automotive showcase featuring the world's finest vehicles</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <a href="#showcase">Showcase</a>
            <a href="#events">Events</a>
            <a href="#exhibitors">Exhibitors</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>info@carexpo2024.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 Car Expo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
