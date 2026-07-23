import { useState, useMemo, useEffect } from "react";

type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  image: string;
};

const CATEGORIES = [
  "All",
  "Textbooks",
  "Electronics",
  "Furniture",
  "Clothing",
  "Tickets",
  "Other",
];

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Calculus: Early Transcendentals",
    price: 45,
    category: "Textbooks",
    condition: "Good",
    image:
      "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "2",
    title: "MacBook Air M2 - 13 inch",
    price: 750,
    category: "Electronics",
    condition: "Like New",
    image:
      "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "3",
    title: "Ikea Desk Lamp",
    price: 15,
    category: "Furniture",
    condition: "Good",
    image:
      "https://images.pexels.com/photos/1112588/pexels-photo-1112588.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "4",
    title: "University Hoodie - Size M",
    price: 25,
    category: "Clothing",
    condition: "New",
    image:
      "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "5",
    title: "Football Game Tickets (2)",
    price: 60,
    category: "Tickets",
    condition: "Digital",
    image:
      "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "6",
    title: "Organic Chemistry Textbook",
    price: 30,
    category: "Textbooks",
    condition: "Fair",
    image:
      "https://images.pexels.com/photos/159711/books-literature-covers-bookshelves-159711.jpeg?auto=compress&cs=tinysrgb&w=600",
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
      const matchesSearch = l.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || l.category === activeCategory;
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
        "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600",
    };
    setListings([newListing, ...listings]);
    setForm({ title: "", price: "", category: "Textbooks", condition: "Good", image: "" });
    setShowModal(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-mark">UB</span>
          UniBazaar-AI
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Sell an item
        </button>
      </header>

      <section className="hero">
        <h1>Buy & sell with fellow students</h1>
        <p>
          UniBazaar-AI is your campus marketplace for textbooks, electronics,
          furniture, and more. Find great deals or list your stuff in seconds.
        </p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for textbooks, electronics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <div className="categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2 className="section-title">
        {activeCategory === "All" ? "All listings" : activeCategory}
      </h2>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No listings found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="listings-grid">
          {filtered.map((listing) => (
            <div key={listing.id} className="card">
              <img
                className="card-img"
                src={listing.image}
                alt={listing.title}
                loading="lazy"
              />
              <div className="card-body">
                <div className="card-title">{listing.title}</div>
                <div className="card-price">${listing.price}</div>
                <div className="card-meta">
                  <span>{listing.category}</span>
                  <span>·</span>
                  <span>{listing.condition}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>List a new item</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Intro to Psychology Textbook"
              />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 25"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
