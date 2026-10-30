import { useEffect, useMemo, useState } from "react";
import { listings, cities, budgets } from "./data.js";

const price = (l) =>
  l.mode === "rent"
    ? `₹${l.price.toLocaleString("en-IN")}/mo`
    : l.price >= 1e7
    ? `₹${(l.price / 1e7).toFixed(2).replace(/\.?0+$/, "")} Cr`
    : `₹${(l.price / 1e5).toFixed(0)} L`;

function Art({ hue, type }) {
  const c1 = `hsl(${hue} 55% 78%)`, c2 = `hsl(${hue} 45% 55%)`, c3 = `hsl(${hue} 50% 30%)`;
  return (
    <svg viewBox="0 0 400 240" className="art" role="img" aria-label={`${type} illustration`} preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill={c1} />
      <circle cx="320" cy="55" r="26" fill="#fff" opacity=".7" />
      <rect y="190" width="400" height="50" fill={c2} opacity=".5" />
      {type === "Plot" ? (
        <g stroke={c3} strokeWidth="3" fill="none">
          <path d="M60 200 L340 200 L310 150 L90 150 Z" fill={c2} opacity=".6" />
          <path d="M120 200 V150 M200 200 V150 M280 200 V150" opacity=".5" />
        </g>
      ) : type === "Apartment" ? (
        <g fill={c3}>
          <rect x="130" y="50" width="90" height="150" /><rect x="225" y="95" width="70" height="105" opacity=".85" />
          {[0, 1, 2, 3].flatMap((r) => [0, 1, 2].map((k) => <rect key={`${r}${k}`} x={142 + k * 26} y={62 + r * 34} width="14" height="18" fill={c1} />))}
        </g>
      ) : (
        <g>
          <rect x="110" y="110" width="180" height="90" fill={c3} />
          <path d="M95 112 L200 50 L305 112 Z" fill={c2} />
          <rect x="185" y="148" width="30" height="52" fill={c1} />
          <rect x="130" y="130" width="32" height="26" fill={c1} /><rect x="238" y="130" width="32" height="26" fill={c1} />
        </g>
      )}
    </svg>
  );
}

const Heart = ({ on }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 21s-7-4.6-9.3-9.2C1.2 8.7 3 5 6.6 5c2 0 3.6 1.1 5.4 3 1.8-1.9 3.4-3 5.4-3 3.6 0 5.4 3.7 3.9 6.8C19 16.4 12 21 12 21z" />
  </svg>
);

function Modal({ l, onClose, saved, toggle }) {
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name: "", phone: "" });
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={l.title} onClick={(e) => e.stopPropagation()}>
        <Art hue={l.hue} type={l.type} />
        <div className="m-body">
          <div className="m-top">
            <div>
              <h2>{l.title}</h2>
              <p className="muted">{l.area}, {l.city}</p>
            </div>
            <b className="m-price">{price(l)}</b>
          </div>
          <div className="specs">
            {l.beds > 0 && <span>{l.beds} beds</span>}
            {l.baths > 0 && <span>{l.baths} baths</span>}
            <span>{l.sqft} sq ft</span>
            <span>{l.age === 0 ? "New / vacant" : `${l.age} yr old`}</span>
          </div>
          <p>{l.desc}</p>
          <div className="tags">{l.amenities.map((a) => <span key={a} className="tag">{a}</span>)}</div>
          {sent ? (
            <p className="ok">Thanks {f.name}. The owner will call you on {f.phone} soon.</p>
          ) : (
            <form className="enq" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <input required placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
              <input required pattern="[0-9]{10}" title="10 digit mobile number" placeholder="Mobile number" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              <button className="btn">Contact owner</button>
            </form>
          )}
          <div className="m-foot">
            <button className="ghost" onClick={() => toggle(l.id)}>{saved ? "Remove from saved" : "Save property"}</button>
            <button className="ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("buy");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All cities");
  const [type, setType] = useState("All");
  const [beds, setBeds] = useState(0);
  const [budget, setBudget] = useState(0);
  const [sort, setSort] = useState("new");
  const [onlySaved, setOnlySaved] = useState(false);
  const [open, setOpen] = useState(null);
  const [dark, setDark] = useState(false);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("saved-homes")) || []; } catch { return []; }
  });

  useEffect(() => { try { localStorage.setItem("saved-homes", JSON.stringify(saved)); } catch {} }, [saved]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  useEffect(() => setBudget(0), [mode]);

  const toggle = (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const results = useMemo(() => {
    const [, lo, hi] = budgets[mode][budget];
    const out = listings.filter(
      (l) =>
        l.mode === mode &&
        (city === "All cities" || l.city === city) &&
        (type === "All" || l.type === type) &&
        (beds === 0 || (beds === 4 ? l.beds >= 4 : l.beds === beds)) &&
        l.price >= lo && l.price < hi &&
        (!onlySaved || saved.includes(l.id)) &&
        `${l.title} ${l.area} ${l.city}`.toLowerCase().includes(q.toLowerCase())
    );
    const by = { new: (a, b) => b.id - a.id, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, area: (a, b) => b.sqft - a.sqft };
    return out.sort(by[sort]);
  }, [mode, q, city, type, beds, budget, sort, onlySaved, saved]);

  const reset = () => { setQ(""); setCity("All cities"); setType("All"); setBeds(0); setBudget(0); setOnlySaved(false); };
  const current = listings.find((l) => l.id === open);

  return (
    <>
      <header className="nav">
        <div className="logo"><span className="roof" />Gharana</div>
        <div className="nav-r">
          <button className={onlySaved ? "ghost on" : "ghost"} onClick={() => setOnlySaved(!onlySaved)}>Saved ({saved.length})</button>
          <button className="ghost" onClick={() => setDark(!dark)}>{dark ? "Light" : "Dark"}</button>
        </div>
      </header>

      <section className="hero">
        <h1>Find a home that fits your life</h1>
        <p>Browse verified flats, villas, houses and plots across Rajasthan and beyond.</p>
        <div className="search">
          <div className="seg">
            <button className={mode === "buy" ? "on" : ""} onClick={() => setMode("buy")}>Buy</button>
            <button className={mode === "rent" ? "on" : ""} onClick={() => setMode("rent")}>Rent</button>
          </div>
          <input aria-label="Search" placeholder="Search by locality, city or project" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </section>

      <main className="wrap">
        <div className="filters">
          <select aria-label="City" value={city} onChange={(e) => setCity(e.target.value)}>{cities.map((c) => <option key={c}>{c}</option>)}</select>
          <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value)}>
            {["All", "Apartment", "House", "Villa", "Plot"].map((t) => <option key={t} value={t}>{t === "All" ? "All types" : t}</option>)}
          </select>
          <select aria-label="Bedrooms" value={beds} onChange={(e) => setBeds(+e.target.value)}>
            <option value={0}>Any bedrooms</option>
            {[1, 2, 3].map((n) => <option key={n} value={n}>{n} BHK</option>)}
            <option value={4}>4+ BHK</option>
          </select>
          <select aria-label="Budget" value={budget} onChange={(e) => setBudget(+e.target.value)}>
            {budgets[mode].map((b, i) => <option key={b[0]} value={i}>{b[0]}</option>)}
          </select>
          <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="new">Newest first</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="area">Largest area</option>
          </select>
        </div>

        <p className="count">{results.length} {results.length === 1 ? "property" : "properties"} {mode === "buy" ? "for sale" : "for rent"}</p>

        <div className="grid">
          {results.map((l) => (
            <article key={l.id} className="card">
              <button className="art-btn" onClick={() => setOpen(l.id)} aria-label={`View ${l.title}`}><Art hue={l.hue} type={l.type} /></button>
              <button className={saved.includes(l.id) ? "fav on" : "fav"} onClick={() => toggle(l.id)} aria-label="Save property" aria-pressed={saved.includes(l.id)}><Heart on={saved.includes(l.id)} /></button>
              <div className="c-body" onClick={() => setOpen(l.id)}>
                <b className="p">{price(l)}</b>
                <h3>{l.title}</h3>
                <p className="muted">{l.area}, {l.city}</p>
                <div className="specs">
                  {l.beds > 0 && <span>{l.beds} bed</span>}
                  {l.baths > 0 && <span>{l.baths} bath</span>}
                  <span>{l.sqft} sq ft</span>
                  <span className="type">{l.type}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {results.length === 0 && (
          <div className="empty">
            <p>No properties match these filters.</p>
            <button className="btn" onClick={reset}>Clear filters</button>
          </div>
        )}
      </main>

      {current && <Modal l={current} onClose={() => setOpen(null)} saved={saved.includes(current.id)} toggle={toggle} />}
    </>
  );
}
