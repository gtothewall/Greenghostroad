import { Link } from "react-router-dom";
import { CHARACTERS, ACCENT } from "../data/characters.js";

export default function Landing() {
  return (
    <div className="landing">
      <style>{LANDING_CSS}</style>

      <nav>
        <div className="nav-inner">
          <div className="wordmark">Ghoul Kids <span>Club</span></div>
          <div className="nav-links">
            <a href="#crew">Meet the Crew</a>
            <a href="#shop">Shop</a>
            <Link to="/quiz">Play the Quiz</Link>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-dots">
          {CHARACTERS.map((c) => (
            <span key={c.id} style={{ background: c.primary }} />
          ))}
        </div>
        <h1>Five friends,<br />five elements,<br />one club.</h1>
        <p className="tag">Welcome to Boo York — where Mia, Echo, King, Chace, and Hope turn earth, air, fire, water, and space into beats, rhymes, and moves.</p>
        <div className="hero-cta">
          <a href="#crew" className="btn btn-primary">Meet the Crew</a>
          <a href="#shop" className="btn btn-ghost">Shop the Drop</a>
        </div>
      </header>

      <section id="crew">
        <div className="wrap">
          <div className="section-head">
            <h2>Meet the Crew</h2>
            <p>Five non-human friends. Five natural elements. Five pieces of hip hop culture.</p>
          </div>

          <div className="crew-grid">
            {CHARACTERS.map((c) => {
              const accent = ACCENT[c.id];
              return (
                <div
                  className="card"
                  key={c.id}
                  style={{ borderColor: accent.border, boxShadow: `6px 6px 0 ${accent.border}` }}
                >
                  <div className="badge" style={{ borderColor: accent.border }}>
                    <img src={c.img} alt={`${c.name} badge`} />
                  </div>
                  <h3>{c.name}</h3>
                  <div className="role" style={{ color: accent.text }}>{c.species} · {c.natural} · {c.hiphop}</div>
                  <p className="blurb">{c.blurb}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="shop">
        <div className="wrap">
          <div className="section-head">
            <h2>Shop the Drop</h2>
            <p>Fresh gear from the Ghoul Kids Club, printed on demand.</p>
          </div>

          <div className="shop-grid">
            <div className="shop-card">
              <h3>Crew Tees</h3>
              <p>Individual character tees plus the full five-friend group shirt.</p>
              <a href="#" className="btn btn-primary">Shop Tees</a>
            </div>
            <div className="shop-card">
              <h3>Sticker Pack</h3>
              <p>All five characters, die-cut and ready to ride on any notebook.</p>
              <a href="#" className="btn btn-primary">Shop Stickers</a>
            </div>
            <div className="shop-card">
              <h3>Mystic Marker</h3>
              <p>King's signature accessory — for the crew's next mural.</p>
              <a href="#" className="btn btn-primary">Shop Accessories</a>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="wordmark">Ghoul Kids Club</div>
        <p>Fivelementals is created by <a href="https://gtothewall.com">G to the WALL</a></p>
        <p>Say hi at <a href="mailto:hello@fivelementals.com">hello@fivelementals.com</a></p>
      </footer>
    </div>
  );
}

const LANDING_CSS = `
.landing {
  --ink:#241A3D;
  --ink-muted:#6E6482;
  --paper:#FFFFFF;
  --bg:#FFF8EC;
  --card:#FFFFFF;
  --brand:#FF6A2B;
  --brand-dk:#C43F0E;

  --line:3px;

  background:var(--bg);
  background-image:
    radial-gradient(circle at 12% 12%, rgba(255,196,74,0.35), transparent 40%),
    radial-gradient(circle at 90% 10%, rgba(120,200,255,0.30), transparent 42%),
    radial-gradient(circle at 20% 92%, rgba(255,138,178,0.28), transparent 42%),
    radial-gradient(circle at 82% 88%, rgba(124,232,164,0.28), transparent 42%);
  color:var(--ink);
  font-family:'Nunito', sans-serif;
  font-weight:500;
  min-height:100vh;
}
.landing h1,.landing h2,.landing h3,.landing .wordmark{font-family:'Fredoka', sans-serif; margin:0;}
.landing a{color:inherit;}
.landing section{padding:88px 24px;}
.landing .wrap{max-width:1120px; margin:0 auto;}

/* NAV */
.landing nav{
  position:sticky; top:0; z-index:50;
  background:rgba(255,248,236,0.88);
  backdrop-filter:blur(6px);
  border-bottom:var(--line) solid var(--ink);
}
.landing .nav-inner{
  max-width:1120px; margin:0 auto; padding:14px 24px;
  display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;
}
.landing .wordmark{font-size:1.35rem; font-weight:700; letter-spacing:0.01em;}
.landing .wordmark span{color:var(--brand);}
.landing .nav-links{display:flex; gap:26px; font-weight:700; font-size:0.98rem;}
.landing .nav-links a{text-decoration:none; opacity:0.82; transition:opacity 0.15s;}
.landing .nav-links a:hover{opacity:1;}

/* HERO */
.landing .hero{
  padding:96px 24px 64px;
  text-align:center;
  position:relative;
  overflow:hidden;
}
.landing .hero-dots{
  display:flex; justify-content:center; gap:10px; margin-bottom:28px;
}
.landing .hero-dots span{
  width:16px; height:16px; border-radius:50%;
  border:2.5px solid var(--ink);
  opacity:0; animation:landing-pop 0.5s ease forwards;
}
.landing .hero-dots span:nth-child(1){animation-delay:0.05s;}
.landing .hero-dots span:nth-child(2){animation-delay:0.15s;}
.landing .hero-dots span:nth-child(3){animation-delay:0.25s;}
.landing .hero-dots span:nth-child(4){animation-delay:0.35s;}
.landing .hero-dots span:nth-child(5){animation-delay:0.45s;}
@keyframes landing-pop{
  0%{opacity:0; transform:translateY(8px) scale(0.6);}
  100%{opacity:1; transform:translateY(0) scale(1);}
}
.landing .hero h1{
  font-size:clamp(2.6rem, 7vw, 4.6rem);
  line-height:1.02;
  font-weight:700;
  color:var(--ink);
}
.landing .hero p.tag{
  max-width:520px; margin:22px auto 0;
  font-size:1.15rem; font-weight:700; color:var(--ink-muted);
}
.landing .hero-cta{
  margin-top:38px; display:flex; gap:16px; justify-content:center; flex-wrap:wrap;
}

/* BUTTONS */
.landing .btn{
  display:inline-block; text-decoration:none;
  font-family:'Fredoka', sans-serif; font-weight:600; font-size:1.02rem;
  padding:13px 30px; border-radius:999px;
  border:var(--line) solid var(--ink);
  box-shadow:4px 4px 0 var(--ink);
  transition:transform 0.12s ease, box-shadow 0.12s ease;
}
.landing .btn:hover{transform:translate(-1px,-1px); box-shadow:5px 5px 0 var(--ink);}
.landing .btn:active{transform:translate(2px,2px); box-shadow:1px 1px 0 var(--ink);}
.landing .btn-primary{background:var(--brand); color:#2B1200;}
.landing .btn-ghost{background:var(--paper); color:var(--ink);}

/* SECTION HEADINGS */
.landing .section-head{text-align:center; max-width:560px; margin:0 auto 52px;}
.landing .section-head h2{font-size:clamp(1.9rem, 4vw, 2.6rem);}
.landing .section-head p{margin-top:12px; color:var(--ink-muted); font-weight:700;}

/* CREW */
.landing .crew-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));
  gap:26px;
}
.landing .card{
  background:var(--card);
  border:var(--line) solid var(--ink);
  border-radius:22px;
  padding:26px 20px 24px;
  text-align:center;
}
.landing .badge{
  width:96px; height:96px; margin:0 auto 18px;
  border-radius:50%;
  border:var(--line) solid var(--ink);
  display:flex; align-items:center; justify-content:center;
  overflow:hidden;
  background:var(--paper);
}
.landing .badge img{width:100%; height:100%; object-fit:contain;}
.landing .card h3{font-size:1.35rem; margin-bottom:4px;}
.landing .card .role{
  font-weight:800; font-size:0.82rem; letter-spacing:0.02em;
  margin-bottom:12px;
}
.landing .card p.blurb{font-size:0.95rem; line-height:1.5; color:var(--ink-muted);}

/* SHOP */
.landing .shop-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));
  gap:24px;
}
.landing .shop-card{
  background:var(--card);
  border:var(--line) solid var(--ink);
  border-radius:20px;
  padding:30px 22px;
  box-shadow:6px 6px 0 var(--ink);
}
.landing .shop-card h3{font-size:1.2rem; margin-bottom:8px;}
.landing .shop-card p{font-size:0.92rem; color:var(--ink-muted); margin-bottom:18px; line-height:1.5;}
.landing .shop-card .btn{padding:10px 22px; font-size:0.92rem;}

/* FOOTER */
.landing footer{
  border-top:var(--line) solid var(--ink);
  padding:56px 24px 40px;
  text-align:center;
}
.landing footer .wordmark{font-size:1.1rem; margin-bottom:10px;}
.landing footer p{color:var(--ink-muted); font-size:0.92rem; margin:6px 0;}
.landing footer a{text-decoration:underline; font-weight:700;}

@media (prefers-reduced-motion: reduce){
  .landing .hero-dots span{animation:none; opacity:1;}
}
`;
