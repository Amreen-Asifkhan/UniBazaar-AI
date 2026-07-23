import { useState, useMemo, useEffect } from "react";

type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  image: string;
};

type Category = {
  name: string;
  label: string;
  icon: string;
  gradient: string;
};

const CATEGORIES: Category[] = [
  { name: "All", label: "All Items", icon: "🛍️", gradient: "linear-gradient(135deg, #0f766e, #14b8a6)" },
  { name: "Textbooks", label: "Textbooks", icon: "📚", gradient: "linear-gradient(135deg, #1e40af, #3b82f6)" },
  { name: "Electronics", label: "Electronics", icon: "💻", gradient: "linear-gradient(135deg, #0c4a6e, #0ea5e9)" },
  { name: "Furniture", label: "Furniture", icon: "🪑", gradient: "linear-gradient(135deg, #78350f, #f59e0b)" },
  { name: "Clothing", label: "Clothing", icon: "👕", gradient: "linear-gradient(135deg, #831843, #ec4899)" },
  { name: "Tickets", label: "Tickets", icon: "🎟️", gradient: "linear-gradient(135deg, #14532d, #22c55e)" },
  { name: "Other", label: "Other", icon: "📦", gradient: "linear-gradient(135deg, #44403c, #78716c)" },
];

const CONDITION_BADGE: Record<string, string> = {
  "New": "#16a34a",
  "Like New": "#2563eb",
  "Good": "#0891b2",
  "Fair": "#d97706",
  "Digital": "#7c3aed",
};

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Calculus: Early Transcendentals (8th Ed.)",
    price: 45,
    category: "Textbooks",
    condition: "Good",
    image: "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "2",
    title: "MacBook Air M2 — 13\" 256GB",
    price: 750,
    category: "Electronics",
    condition: "Like New",
    image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "3",
    title: "Adjustable Desk Lamp — LED",
    price: 15,
    category: "Furniture",
    condition: "Good",
    image: "https://images.pexels.com/photos/1112588/pexels-photo-1112588.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "4",
    title: "University Hoodie — Navy, Size M",
    price: 25,
    category: "Clothing",
    condition: "New",
    image: "https://images.pexels.com/photos/2421374/pexels-photo-2421374.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "5",
    title: "Homecoming Football Tickets (Pair)",
    price: 60,
    category: "Tickets",
    condition: "Digital",
    image: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "6",
    title: "Organic Chemistry — McMurry 9th Ed.",
    price: 30,
    category: "Textbooks",
    condition: "Fair",
    image: "https://images.pexels.com/photos/159711/books-literature-covers-bookshelves-159711.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "7",
    title: "Sony WH-1000XM4 Noise-Cancel Headphones",
    price: 180,
    category: "Electronics",
    condition: "Like New",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "8",
    title: "Mini Fridge — 3.2 cu ft",
    price: 50,
    category: "Furniture",
    condition: "Good",
    image: "https://images.pexels.com/photos/6486252/pexels-photo-6486252.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export default function App() {
  const [listings, setListings] = useState<Listing[]>(SAMPLE_LISTINGS);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "Textbooks",
    condition: "Good",
    image: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("unibazaar_listings");
    if (saved) {
      try {
        setListings(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("unibazaar_listings", JSON.stringify(listings));
  }, [listings]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || l.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [listings, search, activeCategory]);

  const handleAddListing = () => {
    if (!form.title.trim() || !form.price) return;
    const newListing: Listing = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      price: parseFloat(form.price),
      category: form.category,
      condition: form.condition,
      image:
        form.image.trim() ||
        "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=800",
    };
    setListings([newListing, ...listings]);
    setForm({ title: "", price: "", category: "Textbooks", condition: "Good", image: "" });
    setShowModal(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">UB</span>
            <span className="logo-text">UniBazaar<span className="logo-accent">AI</span></span>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <span className="btn-icon">+</span> Sell an item
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-badge">Trusted by 12,000+ students</div>
        <h1>Buy &amp; sell with fellow students</h1>
        <p>
          Your campus marketplace for textbooks, electronics, furniture, and more.
          Find great deals or list your stuff in seconds.
        </p>
        <div className="search-bar">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search for textbooks, electronics, furniture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="category-cards">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            className={`category-card ${activeCategory === cat.name ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            <span className="category-icon" style={{ background: cat.gradient }}>
              {cat.icon}
            </span>
            <span className="category-label">{cat.label}</span>
          </button>
        ))}
      </section>

      <div className="listings-header">
        <h2 className="section-title">
          {activeCategory === "All" ? "All listings" : activeCategory}
          <span className="listing-count">{filtered.length} items</span>
        </h2>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>No listings found.</p>
          <span>Try a different search or category.</span>
        </div>
      ) : (
        <div className="listings-grid">
          {filtered.map((listing) => (
            <div key={listing.id} className="card">
              <div className="card-img-wrap">
                <img
                  className="card-img"
                  src={listing.image}
                  alt={listing.title}
                  loading="lazy"
                />
                <span
                  className="condition-badge"
                  style={{ background: CONDITION_BADGE[listing.condition] || "#64748b" }}
                >
                  {listing.condition}
                </span>
              </div>
              <div className="card-body">
                <div className="card-category">{listing.category}</div>
                <div className="card-title">{listing.title}</div>
                <div className="card-footer">
                  <span className="card-price">${listing.price}</span>
                  <button className="btn-contact">Message</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>List a new item</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Intro to Psychology Textbook"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="25"
                />
              </div>
              <div className="form-group">
                <label>Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Digital">Digital</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.filter((c) => c.name !== "All").map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Image URL (optional)</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-actions">
              <button className="btn-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddListing}>
                Post listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
