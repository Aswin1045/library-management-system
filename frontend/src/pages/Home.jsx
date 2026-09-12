import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import client from "../api/client";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const staggerContainer = (delay = 0.13) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: delay } },
});

const InView = ({ children, delay = 0, style }) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
    variants={staggerContainer(0.12)}
    transition={{ delay }}
    style={style}
  >
    {children}
  </motion.div>
);

const MiniCard = ({ book }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -6, boxShadow: "0 12px 36px rgba(44,85,69,0.12)" }}
    transition={{ type: "spring", stiffness: 280, damping: 22 }}
    className="card"
    style={{ padding: 0, overflow: "hidden", cursor: "default" }}
  >
    <div style={{
      height: "120px",
      background: "linear-gradient(135deg, var(--surface-alt) 0%, #e8f0ec 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      borderBottom: "1px solid var(--border)",
    }}>
      <span style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", color: "var(--accent)", opacity: 0.45 }}>
        {book.title.charAt(0)}
      </span>
    </div>
    <div style={{ padding: "12px 14px" }}>
      <span style={{ display: "inline-block", padding: "2px 7px", backgroundColor: "var(--accent-light)", color: "var(--accent)", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>
        {book.category}
      </span>
      <h4 style={{ fontSize: "0.95rem", lineHeight: 1.3, marginBottom: "4px" }}>{book.title}</h4>
      <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>by {book.author}</p>
      <p style={{ marginTop: "8px", fontSize: "0.8rem", fontWeight: 600, color: book.availableQuantity > 0 ? "var(--accent)" : "var(--danger)" }}>
        {book.availableQuantity > 0 ? book.availableQuantity + " available" : "Checked out"}
      </p>
    </div>
  </motion.div>
);

const SectionLabel = ({ children }) => (
  <p style={{ textTransform: "uppercase", letterSpacing: "1.5px", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", marginBottom: "12px" }}>
    {children}
  </p>
);

const SearchIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
  </svg>
);

const BookIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19V6.2A1.2 1.2 0 0 1 5.2 5h13.6A1.2 1.2 0 0 1 20 6.2V17H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h14"/>
    <path d="M9 10h6M9 14h4"/>
  </svg>
);

const CalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="m9 16 2 2 4-4"/>
  </svg>
);

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [publicStats, setPublicStats] = useState(null);
  const [booksLoaded, setBooksLoaded] = useState(false);

  useEffect(() => {
    client.get("/books?size=6&page=0")
      .then(r => { setFeaturedBooks(r.data.content || []); })
      .catch(() => {})
      .finally(() => setBooksLoaded(true));
    client.get("/stats/public")
      .then(r => setPublicStats(r.data))
      .catch(() => {});
  }, []);

  const howItWorks = [
    { icon: <SearchIcon />, step: "01", title: "Browse & search", body: "Explore hundreds of titles by category, author, or keyword." },
    { icon: <BookIcon />,   step: "02", title: "Register & borrow", body: "Create a free account, then borrow any available book in one click." },
    { icon: <CalIcon />,    step: "03", title: "Track & return", body: "Monitor due dates and fines from your dashboard, return when done." },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

      <motion.section variants={staggerContainer(0.14)} initial="hidden" animate="show" style={S.hero}>
        <motion.p variants={fadeUp} style={S.heroEyebrow}>Your campus reading companion</motion.p>
        <motion.h1 variants={fadeUp} className="serif" style={S.heroHeading}>
          Every great story<br />starts with a single page.
        </motion.h1>
        <motion.p variants={fadeUp} style={S.heroSub}>
          Folio is a beautifully simple library system - browse the catalog, borrow books in seconds, and track your reading life from one tidy dashboard.
        </motion.p>
        <motion.div variants={fadeUp} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/books" className="btn btn-primary" style={{ padding: "14px 30px", fontSize: "1rem" }}>Browse Catalog</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/register" className="btn btn-outline" style={{ padding: "14px 30px", fontSize: "1rem" }}>Create Account</Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {publicStats && (
        <InView>
          <motion.div variants={fadeUp} style={S.statsBar}>
            <div style={S.statItem}><span style={S.statNumber}>{publicStats.totalBooks}</span><span style={S.statLabel}>books in catalog</span></div>
            <div style={S.statDivider} />
            <div style={S.statItem}><span style={S.statNumber}>{publicStats.totalCategories}</span><span style={S.statLabel}>subject categories</span></div>
            <div style={S.statDivider} />
            <div style={S.statItem}><span style={S.statNumber}>24/7</span><span style={S.statLabel}>digital access</span></div>
          </motion.div>
        </InView>
      )}

      {booksLoaded && featuredBooks.length > 0 && (
        <section style={S.section}>
          <InView>
            <motion.div variants={fadeUp}>
              <SectionLabel>From the Catalog</SectionLabel>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-xl)" }}>
                <h2 className="serif" style={{ fontSize: "2rem", margin: 0 }}>Featured books</h2>
                <Link to="/books" style={{ color: "var(--accent)", fontWeight: 500, fontSize: "0.95rem" }}>View all books</Link>
              </div>
            </motion.div>
          </InView>
          <motion.div style={S.bookGrid} variants={staggerContainer(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}>
            {featuredBooks.map(book => <MiniCard key={book.id} book={book} />)}
          </motion.div>
          <InView style={{ textAlign: "center", marginTop: "var(--space-xl)" }}>
            <motion.div variants={fadeUp} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} style={{ display: "inline-block" }}>
              <Link to="/books" className="btn btn-outline" style={{ padding: "10px 28px" }}>See the full catalog</Link>
            </motion.div>
          </InView>
        </section>
      )}

      <section style={{ ...S.section, backgroundColor: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "var(--space-xxl)" }}>
        <InView>
          <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
            <SectionLabel>Getting started</SectionLabel>
            <h2 className="serif" style={{ fontSize: "2rem", margin: 0 }}>How Folio works</h2>
          </motion.div>
          <motion.div style={S.stepsGrid} variants={staggerContainer(0.14)} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
            {howItWorks.map(item => (
              <motion.div key={item.step} variants={fadeUp} style={S.stepCard}>
                <div style={S.stepIcon}>{item.icon}</div>
                <span style={S.stepNumber}>{item.step}</span>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", marginBottom: "8px", color: "var(--text-main)" }}>{item.title}</h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.65, fontSize: "0.93rem" }}>{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </InView>
      </section>

      <InView style={{ margin: "var(--space-xxl) 0" }}>
        <motion.div variants={fadeUp} style={S.ctaBanner}>
          <h2 className="serif" style={{ fontSize: "1.9rem", color: "#fff", marginBottom: "10px" }}>Ready to start reading?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "var(--space-lg)", fontSize: "1rem" }}>
            Join Folio today - it takes less than a minute.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" style={S.ctaBtnWhite}>Create free account</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/books" style={S.ctaBtnOutline}>Browse books</Link>
            </motion.div>
          </div>
        </motion.div>
      </InView>

    </div>
  );
};

const S = {
  hero: { textAlign: "center", padding: "var(--space-xxl) var(--space-lg)", paddingTop: "calc(var(--space-xxl) * 1.5)" },
  heroEyebrow: { textTransform: "uppercase", letterSpacing: "2px", fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)", marginBottom: "16px" },
  heroHeading: { fontSize: "clamp(2.2rem, 5vw, 3.4rem)", lineHeight: 1.18, marginBottom: "20px", color: "var(--text-main)" },
  heroSub: { color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 32px" },
  statsBar: { display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-xxl)", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl) var(--space-xxl)", margin: "0 0 var(--space-xxl)" },
  statItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  statNumber: { fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 600, color: "var(--accent)", lineHeight: 1 },
  statLabel: { fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.6px" },
  statDivider: { width: "1px", height: "48px", backgroundColor: "var(--border)" },
  section: { marginBottom: "var(--space-xxl)" },
  bookGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--space-lg)" },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-xl)" },
  stepCard: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" },
  stepIcon: { width: "56px", height: "56px", backgroundColor: "var(--accent-light)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" },
  stepNumber: { fontSize: "0.72rem", fontWeight: 700, color: "var(--text-light)", letterSpacing: "1px", textTransform: "uppercase" },
  ctaBanner: { backgroundColor: "var(--accent)", borderRadius: "var(--radius-lg)", padding: "var(--space-xxl)", textAlign: "center" },
  ctaBtnWhite: { display: "inline-block", padding: "12px 26px", backgroundColor: "#fff", color: "var(--accent)", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" },
  ctaBtnOutline: { display: "inline-block", padding: "12px 26px", border: "1.5px solid rgba(255,255,255,0.5)", color: "#fff", borderRadius: "var(--radius-md)", fontWeight: 500, fontSize: "0.95rem", textDecoration: "none" },
};

export default Home;