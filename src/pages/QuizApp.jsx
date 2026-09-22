import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Compass, Wind, Flame, Mountain, Droplets,
  Home, ShoppingBag, User, ChevronLeft,
  Lock, CheckCircle2, Sparkles, Crown,
  ShirtIcon, Sticker, Backpack, PenLine, ChevronRight, Star,
  Ear, Hand, Eye, Utensils, Zap, ChevronDown
} from "lucide-react";
import { CHARACTERS, ALL_ENTITIES, entityById } from "../data/characters.js";
import quizBank from "../data/quizBank.json";

const FACTS_BANK = quizBank.factsBank;
const COMBOS = quizBank.combos;
const DIFF_XP = quizBank.meta.difficulty_xp;
const COMBO_XP_EACH = quizBank.meta.combo_xp_each;
const DIFFS = ["easy", "medium", "hard"];
const DIFF_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };
const DIFF_COLOR = { easy: "#39FF88", medium: "#FFD84D", hard: "#FF3B3B" };

const NATURAL_ICON = { mia: Compass, echo: Wind, king: Flame, chace: Mountain, hope: Droplets };

/* ---------------------------------------------------------
   TOKENS
--------------------------------------------------------- */
const bg = "#15121F";
const surface = "#1E1930";
const surfaceLight = "#271F3D";
const ink = "#F6F3FF";
const inkMuted = "#B7AFD1";

const GEAR_TIERS = [
  { key: "rookie", label: "Rookie", xp: 0, itemLabel: "Signature fit" },
  { key: "pro", label: "Pro", xp: 120, itemLabel: "Crew cap", Icon: Crown },
  { key: "legend", label: "Legend", xp: 280, itemLabel: "Aura + shine", Icon: Sparkles },
  { key: "icon", label: "Icon", xp: 450, itemLabel: "Gold trim + star", Icon: Star },
];

const SHOP_ITEMS = [
  { id: "s1", name: "Mia Neon Tee", cat: "Apparel", charId: "mia", price: "$26", Icon: ShirtIcon },
  { id: "s2", name: "Echo Bomber Hoodie", cat: "Apparel", charId: "echo", price: "$48", Icon: ShirtIcon },
  { id: "s3", name: "King Sticker Pack", cat: "Stationery", charId: "king", price: "$8", Icon: Sticker },
  { id: "s4", name: "Chace Snapback", cat: "Accessories", charId: "chace", price: "$22", Icon: Crown },
  { id: "s5", name: "Hope Spiral Notebook", cat: "Stationery", charId: "hope", price: "$10", Icon: PenLine },
  { id: "s6", name: "Mia Tote Bag", cat: "Accessories", charId: "mia", price: "$18", Icon: Backpack },
  { id: "s7", name: "King Graffiti Tee", cat: "Apparel", charId: "king", price: "$26", Icon: ShirtIcon },
  { id: "s8", name: "Hope Enamel Pin", cat: "Accessories", charId: "hope", price: "$9", Icon: Sparkles },
  { id: "s9", name: "Chace Sticker Sheet", cat: "Stationery", charId: "chace", price: "$8", Icon: Sticker },
  { id: "s10", name: "Echo Pencil Case", cat: "Stationery", charId: "echo", price: "$14", Icon: PenLine },
];
const CATS = ["All", "Apparel", "Stationery", "Accessories"];

function tierFor(xp) {
  let t = GEAR_TIERS[0];
  for (const tier of GEAR_TIERS) if (xp >= tier.xp) t = tier;
  return t;
}
function nextTier(xp) {
  return GEAR_TIERS.find((t) => xp < t.xp) || null;
}

function ArtBadge({ img, primary, xp, size = 120, small }) {
  const tier = tierFor(xp);
  const glowStrength = tier.key === "icon" ? 0.65 : tier.key === "legend" ? 0.5 : tier.key === "pro" ? 0.3 : 0.12;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {!small && (
        <div style={{
          position: "absolute", inset: -size * 0.12, borderRadius: "9999px",
          background: `radial-gradient(circle, ${primary}${Math.round(glowStrength * 255).toString(16).padStart(2, "0")}, transparent 72%)`,
          filter: tier.key === "legend" || tier.key === "icon" ? "blur(1px)" : "none",
        }} />
      )}
      <div style={{
        position: "relative", width: "100%", height: "100%", borderRadius: small ? 14 : 20,
        background: surface, border: `2.5px solid ${primary}`, display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <img src={img} alt="" style={{ width: "88%", height: "88%", objectFit: "contain" }} />
      </div>
      {!small && tier.key !== "rookie" && (
        <div style={{
          position: "absolute", top: -6, right: -6, width: size * 0.28, height: size * 0.28,
          borderRadius: "9999px", background: primary, display: "flex", alignItems: "center",
          justifyContent: "center", border: `2px solid ${bg}`,
        }}>
          <tier.Icon size={size * 0.15} color="#0c0c14" strokeWidth={2.5} />
        </div>
      )}
    </div>
  );
}

function DiffPill({ diff, active, onClick }) {
  const color = DIFF_COLOR[diff];
  return (
    <button onClick={onClick} style={{
      flex: 1, border: `2px solid ${active ? color : surfaceLight}`, borderRadius: 12,
      background: active ? `${color}22` : surface, padding: "8px 4px", display: "flex",
      flexDirection: "column", alignItems: "center", gap: 2,
    }}>
      <span style={{ fontWeight: 800, fontSize: "0.78rem", color: active ? color : inkMuted }}>
        {DIFF_LABEL[diff]}
      </span>
      <span style={{ fontSize: "0.62rem", color: inkMuted }}>+{DIFF_XP[diff]} XP</span>
    </button>
  );
}

/* ---------------------------------------------------------
   MAIN APP
--------------------------------------------------------- */
export default function QuizApp() {
  const [tab, setTab] = useState("home");
  const [selected, setSelected] = useState(null);
  const [xp, setXp] = useState(Object.fromEntries(ALL_ENTITIES.map((e) => [e.id, 0])));
  const [answered, setAnswered] = useState({});
  const [factSource, setFactSource] = useState("main");
  const [difficulty, setDifficulty] = useState("medium");
  const [activeFactIdx, setActiveFactIdx] = useState(0);
  const [pickedOption, setPickedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [shopCat, setShopCat] = useState("All");
  const [cart, setCart] = useState({});
  const [openCombo, setOpenCombo] = useState(null);
  const [comboAnswered, setComboAnswered] = useState({});
  const [comboPicked, setComboPicked] = useState(null);
  const [comboFeedback, setComboFeedback] = useState(null);

  const totalXp = Object.values(xp).reduce((a, b) => a + b, 0);
  const level = Math.floor(totalXp / 300) + 1;

  function openCharacter(c) {
    setSelected(c);
    setFactSource("main");
    setDifficulty("medium");
    setActiveFactIdx(0);
    setPickedOption(null);
    setFeedback(null);
    setTab("detail");
  }

  function resetQuiz() {
    setActiveFactIdx(0);
    setPickedOption(null);
    setFeedback(null);
  }

  function switchFactSource(src) {
    setFactSource(src);
    resetQuiz();
  }
  function switchDifficulty(d) {
    setDifficulty(d);
    resetQuiz();
  }

  function answerQuestion(fact, optionIdx, entityId) {
    if (answered[fact.id]) return;
    setPickedOption(optionIdx);
    const correct = optionIdx === fact.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setAnswered((a) => ({ ...a, [fact.id]: true }));
      setXp((x) => ({ ...x, [entityId]: x[entityId] + DIFF_XP[difficulty] }));
    }
  }

  function nextFact(maxIdx) {
    setPickedOption(null);
    setFeedback(null);
    setActiveFactIdx((i) => Math.min(i + 1, maxIdx));
  }

  function answerCombo(combo, optionIdx) {
    if (comboAnswered[combo.id]) return;
    setComboPicked(optionIdx);
    const correct = optionIdx === combo.answer;
    setComboFeedback(correct ? "correct" : "wrong");
    if (correct) {
      setComboAnswered((a) => ({ ...a, [combo.id]: true }));
      setXp((x) => {
        const next = { ...x };
        combo.pairIds.forEach((id) => { next[id] = next[id] + COMBO_XP_EACH; });
        return next;
      });
    }
  }

  function toggleCombo(id) {
    if (openCombo === id) { setOpenCombo(null); return; }
    setOpenCombo(id);
    setComboPicked(null);
    setComboFeedback(null);
  }

  function toggleCart(id) {
    setCart((c) => ({ ...c, [id]: !c[id] }));
  }
  const cartCount = Object.values(cart).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: bg, color: ink, fontFamily: "'Nunito', sans-serif", display: "flex", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Nunito:wght@500;700;800&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, minHeight: "100vh", background: bg, position: "relative", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {tab === "detail" ? (
              <button onClick={() => setTab("home")} style={{ background: surfaceLight, border: "none", borderRadius: 999, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: ink }}>
                <ChevronLeft size={18} />
              </button>
            ) : (
              <Link to="/" style={{ background: surfaceLight, border: "none", borderRadius: 999, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: ink, textDecoration: "none" }}>
                <ChevronLeft size={18} />
              </Link>
            )}
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: "1.3rem", letterSpacing: "0.01em" }}>
              {tab === "shop" ? "The Merch Wall" : tab === "combo" ? "Crew Combos" : tab === "detail" ? selected?.tag : "Five Elements Crew"}
            </div>
          </div>
          {tab !== "detail" && (
            <div style={{ background: surfaceLight, borderRadius: 999, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", fontWeight: 800 }}>
              <Star size={14} color="#FFD84D" fill="#FFD84D" />
              Lv.{level}
            </div>
          )}
        </div>

        <div style={{ flex: 1, padding: "0 18px 100px", overflowY: "auto" }}>
          {tab === "home" && <HomeScreen xp={xp} totalXp={totalXp} level={level} onOpen={openCharacter} onCombo={() => setTab("combo")} />}
          {tab === "detail" && selected && (
            <DetailScreen
              character={selected} xp={xp} factSource={factSource} onSwitchSource={switchFactSource}
              difficulty={difficulty} onSwitchDifficulty={switchDifficulty}
              activeFactIdx={activeFactIdx} setActiveFactIdx={(i) => { setActiveFactIdx(i); setPickedOption(null); setFeedback(null); }}
              answered={answered} pickedOption={pickedOption} feedback={feedback}
              onAnswer={answerQuestion} onNext={nextFact}
            />
          )}
          {tab === "combo" && (
            <ComboScreen xp={xp} openCombo={openCombo} toggleCombo={toggleCombo} comboAnswered={comboAnswered}
              comboPicked={comboPicked} comboFeedback={comboFeedback} onAnswer={answerCombo} />
          )}
          {tab === "shop" && <ShopScreen shopCat={shopCat} setShopCat={setShopCat} cart={cart} toggleCart={toggleCart} />}
          {tab === "profile" && <ProfileScreen xp={xp} totalXp={totalXp} level={level} />}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: surface, borderTop: `2px solid ${surfaceLight}`, display: "flex", justifyContent: "space-around", padding: "10px 6px 16px" }}>
          <NavBtn icon={Home} label="Crew" active={tab === "home" || tab === "detail"} onClick={() => setTab("home")} />
          <NavBtn icon={Zap} label="Combos" active={tab === "combo"} onClick={() => setTab("combo")} />
          <NavBtn icon={ShoppingBag} label="Shop" active={tab === "shop"} onClick={() => setTab("shop")} badge={cartCount || null} />
          <NavBtn icon={User} label="Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
        </div>
      </div>
    </div>
  );
}

function NavBtn({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? "#FF3EC8" : inkMuted, position: "relative", width: 64 }}>
      <Icon size={22} strokeWidth={active ? 2.6 : 2} />
      <span style={{ fontSize: "0.66rem", fontWeight: 700 }}>{label}</span>
      {badge && (
        <span style={{ position: "absolute", top: -4, right: 8, background: "#FF3B3B", color: "#fff", fontSize: "0.6rem", fontWeight: 800, borderRadius: 999, padding: "1px 5px" }}>{badge}</span>
      )}
    </button>
  );
}

function HomeScreen({ xp, totalXp, level, onOpen, onCombo }) {
  const levelFloor = (level - 1) * 300;
  const progress = Math.min(100, ((totalXp - levelFloor) / 300) * 100);

  return (
    <div>
      <div style={{ background: surface, borderRadius: 20, padding: "16px 18px", margin: "6px 0 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: inkMuted, marginBottom: 6 }}>
          <span>Crew Level {level}</span>
          <span>{totalXp} XP</span>
        </div>
        <div style={{ height: 10, background: surfaceLight, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #FF3EC8, #2E8BFF)", borderRadius: 999 }} />
        </div>
      </div>

      <button onClick={onCombo} style={{
        width: "100%", background: "linear-gradient(90deg, #FF3EC833, #2E8BFF33)", border: `2px solid #FF3EC855`,
        borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={18} color="#FF3EC8" />
          <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>Try a Crew Combo — earn XP for two at once!</span>
        </div>
        <ChevronRight size={16} color={inkMuted} />
      </button>

      <div style={{ fontSize: "0.95rem", color: inkMuted, marginBottom: 10, fontWeight: 700 }}>
        Tap a friend to learn their facts & their sidekick's facts too
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {CHARACTERS.map((c) => {
          const charXp = xp[c.id];
          const petXp = xp[c.pet.id];
          const t = tierFor(charXp);
          return (
            <button key={c.id} onClick={() => onOpen(c)} style={{
              background: surface, border: `2px solid ${c.primary}44`, borderRadius: 18, padding: "16px 10px 12px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative",
            }}>
              <div style={{ position: "relative" }}>
                <ArtBadge img={c.img} primary={c.primary} xp={charXp} size={92} />
                <div style={{
                  position: "absolute", bottom: -6, left: -6, width: 34, height: 34, borderRadius: "9999px",
                  background: surface, border: `2px solid ${c.secondary}`, overflow: "hidden", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <img src={c.pet.img} alt="" style={{ width: "85%", height: "85%", objectFit: "contain" }} />
                </div>
              </div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>{c.name}</div>
              <div style={{ fontSize: "0.68rem", color: inkMuted, textAlign: "center" }}>{c.species} · {c.natural} · {c.hiphop}</div>
              <div style={{ fontSize: "0.65rem", fontWeight: 800, color: c.primary, background: `${c.primary}22`, padding: "2px 8px", borderRadius: 999 }}>
                {t.label} · {charXp} XP
              </div>
              <div style={{ fontSize: "0.6rem", color: inkMuted }}>{c.pet.name}: {petXp} XP</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailScreen({ character, xp, factSource, onSwitchSource, difficulty, onSwitchDifficulty, activeFactIdx, setActiveFactIdx, answered, pickedOption, feedback, onAnswer, onNext }) {
  const isPet = factSource === "pet";
  const activeEntity = isPet ? character.pet : character;
  const entityXp = xp[activeEntity.id];
  const facts = FACTS_BANK[activeEntity.id][difficulty];
  const fact = facts[activeFactIdx];
  const isAnswered = answered[fact.id];
  const tier = tierFor(entityXp);
  const upcoming = nextTier(entityXp);
  const accentColor = isPet ? character.secondary : character.primary;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 6px" }}>
        <ArtBadge img={activeEntity.pose} primary={accentColor} xp={entityXp} size={150} />
        <div style={{ color: inkMuted, fontSize: "0.85rem", marginTop: 12, textAlign: "center" }}>{activeEntity.blurb}</div>
        <div style={{ fontSize: "0.72rem", color: accentColor, fontWeight: 800, marginTop: 6 }}>
          {isPet ? `${character.pet.species.toUpperCase()} · SENSE OF ${character.pet.sense.toUpperCase()}` : `${character.species.toUpperCase()} · ${character.natural.toUpperCase()} · ${character.hiphop.toUpperCase()}`}
        </div>
      </div>

      <div style={{ display: "flex", background: surface, borderRadius: 999, padding: 4, margin: "16px 0 10px" }}>
        <button onClick={() => onSwitchSource("main")} style={{ flex: 1, border: "none", borderRadius: 999, padding: "9px 0", fontWeight: 800, fontSize: "0.8rem", background: factSource === "main" ? character.primary : "transparent", color: factSource === "main" ? "#0c0c14" : inkMuted }}>
          {character.name}'s Facts
        </button>
        <button onClick={() => onSwitchSource("pet")} style={{ flex: 1, border: "none", borderRadius: 999, padding: "9px 0", fontWeight: 800, fontSize: "0.8rem", background: factSource === "pet" ? character.secondary : "transparent", color: factSource === "pet" ? "#0c0c14" : inkMuted }}>
          {character.pet.name}'s Facts
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {DIFFS.map((d) => <DiffPill key={d} diff={d} active={difficulty === d} onClick={() => onSwitchDifficulty(d)} />)}
      </div>

      <div style={{ background: surface, borderRadius: 16, padding: 14, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: inkMuted }}>
          <span>{activeEntity.name}: {tier.label}</span>
          <span>{upcoming ? `${upcoming.xp - entityXp} XP to ${upcoming.label}` : "Max tier!"}</span>
        </div>
        <div style={{ height: 8, background: surfaceLight, borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${upcoming ? (entityXp / upcoming.xp) * 100 : 100}%`, background: accentColor }} />
        </div>
      </div>

      <div style={{ background: surface, borderRadius: 18, padding: 18, border: `2px solid ${accentColor}33` }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {facts.map((f, i) => (
            <div key={f.id} onClick={() => setActiveFactIdx(i)} style={{ width: 8, height: 8, borderRadius: 999, background: i === activeFactIdx ? accentColor : surfaceLight, cursor: "pointer" }} />
          ))}
        </div>

        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.4, marginBottom: 10 }}>"{fact.rhyme}"</div>
        <div style={{ fontSize: "0.82rem", color: inkMuted, marginBottom: 16 }}>Did you know? {fact.fact}</div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>{fact.q}</div>
          <div style={{ fontSize: "0.62rem", fontWeight: 800, color: DIFF_COLOR[difficulty], whiteSpace: "nowrap", marginLeft: 8 }}>+{DIFF_XP[difficulty]} XP</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {fact.options.map((opt, i) => {
            let stateColor = surfaceLight;
            if (isAnswered || pickedOption !== null) {
              if (i === fact.answer) stateColor = "#39FF8844";
              else if (i === pickedOption) stateColor = "#FF3B3B44";
            }
            return (
              <button key={i} onClick={() => onAnswer(fact, i, activeEntity.id)} disabled={isAnswered} style={{
                background: stateColor, border: `2px solid ${i === pickedOption ? accentColor : "transparent"}`, borderRadius: 12,
                padding: "10px 14px", textAlign: "left", color: ink, fontWeight: 700, fontSize: "0.85rem",
              }}>
                {opt}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div style={{ marginTop: 12, fontSize: "0.85rem", fontWeight: 800, color: feedback === "correct" ? "#39FF88" : "#FF8A1E" }}>
            {feedback === "correct" ? `+${DIFF_XP[difficulty]} XP — nice ear for facts!` : "Not quite — check the highlighted answer."}
          </div>
        )}

        {activeFactIdx < facts.length - 1 && (isAnswered || feedback) && (
          <button onClick={() => onNext(facts.length - 1)} style={{
            marginTop: 14, width: "100%", background: accentColor, border: "none", borderRadius: 999, padding: "10px 0",
            fontWeight: 800, color: "#0c0c14", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            Next fact <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div style={{ margin: "20px 0 10px", fontWeight: 800, fontSize: "0.95rem" }}>{activeEntity.name}'s Gear Closet</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {GEAR_TIERS.map((t) => {
          const unlocked = entityXp >= t.xp;
          return (
            <div key={t.key} style={{ background: surface, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: unlocked ? 1 : 0.55 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{t.itemLabel}</div>
                <div style={{ fontSize: "0.7rem", color: inkMuted }}>{t.label} tier · {t.xp} XP</div>
              </div>
              {unlocked ? <CheckCircle2 size={20} color={accentColor} /> : <Lock size={18} color={inkMuted} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComboScreen({ xp, openCombo, toggleCombo, comboAnswered, comboPicked, comboFeedback, onAnswer }) {
  const duos = COMBOS.filter((c) => c.type === "duo");
  const crews = COMBOS.filter((c) => c.type === "crew");

  const renderCombo = (combo) => {
    const isOpen = openCombo === combo.id;
    const isDone = comboAnswered[combo.id];
    const [aId, bId] = combo.pairIds;
    const a = entityById(aId);
    const b = entityById(bId);
    return (
      <div key={combo.id} style={{ background: surface, borderRadius: 16, border: `2px solid ${a.primary}33`, overflow: "hidden", marginBottom: 10 }}>
        <button onClick={() => toggleCombo(combo.id)} style={{ width: "100%", background: "none", border: "none", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex" }}>
            <div style={{ width: 34, height: 34, borderRadius: 999, border: `2px solid ${a.primary}`, overflow: "hidden", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={a.img} alt="" style={{ width: "85%", height: "85%", objectFit: "contain" }} />
            </div>
            <div style={{ width: 34, height: 34, borderRadius: 999, border: `2px solid ${b.primary}`, overflow: "hidden", background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: -10 }}>
              <img src={b.img} alt="" style={{ width: "85%", height: "85%", objectFit: "contain" }} />
            </div>
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{combo.title}</div>
            <div style={{ fontSize: "0.68rem", color: inkMuted }}>{combo.theme}</div>
          </div>
          {isDone && <CheckCircle2 size={18} color="#39FF88" />}
          <ChevronDown size={16} color={inkMuted} style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
        </button>

        {isOpen && (
          <div style={{ padding: "0 14px 16px" }}>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.4, marginBottom: 8 }}>"{combo.rhyme}"</div>
            <div style={{ fontSize: "0.78rem", color: inkMuted, marginBottom: 14 }}>Did you know? {combo.fact}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{combo.q}</div>
              <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#FF3EC8", whiteSpace: "nowrap", marginLeft: 8 }}>+{COMBO_XP_EACH} XP each</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {combo.options.map((opt, i) => {
                let stateColor = surfaceLight;
                if (isDone || comboPicked !== null) {
                  if (i === combo.answer) stateColor = "#39FF8844";
                  else if (i === comboPicked) stateColor = "#FF3B3B44";
                }
                return (
                  <button key={i} onClick={() => onAnswer(combo, i)} disabled={isDone} style={{
                    background: stateColor, border: `2px solid ${i === comboPicked ? a.primary : "transparent"}`, borderRadius: 12,
                    padding: "10px 14px", textAlign: "left", color: ink, fontWeight: 700, fontSize: "0.85rem",
                  }}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {comboFeedback && isOpen && (
              <div style={{ marginTop: 10, fontSize: "0.8rem", fontWeight: 800, color: comboFeedback === "correct" ? "#39FF88" : "#FF8A1E" }}>
                {comboFeedback === "correct" ? `+${COMBO_XP_EACH} XP to ${a.name} and +${COMBO_XP_EACH} XP to ${b.name}!` : "Not quite — check the highlighted answer."}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ fontSize: "0.85rem", color: inkMuted, marginBottom: 16, fontWeight: 700 }}>
        Combo questions link two crew members together — get it right and XP goes to both!
      </div>
      <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: 10 }}>Duo Challenges — Friend + Sidekick</div>
      {duos.map(renderCombo)}
      <div style={{ fontWeight: 800, fontSize: "0.9rem", margin: "18px 0 10px" }}>Crew Combos — Friend + Friend</div>
      {crews.map(renderCombo)}
    </div>
  );
}

function ShopScreen({ shopCat, setShopCat, cart, toggleCart }) {
  const items = SHOP_ITEMS.filter((i) => shopCat === "All" || i.cat === shopCat);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, margin: "10px 0 16px", overflowX: "auto" }}>
        {CATS.map((c) => (
          <button key={c} onClick={() => setShopCat(c)} style={{
            background: shopCat === c ? "#FF3EC8" : surface, color: shopCat === c ? "#0c0c14" : inkMuted, border: "none",
            borderRadius: 999, padding: "8px 16px", fontWeight: 800, fontSize: "0.78rem", whiteSpace: "nowrap",
          }}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {items.map((item) => {
          const char = CHARACTERS.find((c) => c.id === item.charId);
          const inCart = cart[item.id];
          return (
            <div key={item.id} style={{ background: surface, borderRadius: 16, padding: 14, border: `2px solid ${char.primary}33` }}>
              <div style={{ height: 70, borderRadius: 12, background: `linear-gradient(135deg, ${char.primary}33, ${char.secondary}33)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <item.Icon size={30} color={char.primary} />
              </div>
              <div style={{ fontWeight: 800, fontSize: "0.82rem", marginBottom: 2 }}>{item.name}</div>
              <div style={{ fontSize: "0.68rem", color: inkMuted, marginBottom: 8 }}>{item.cat}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>{item.price}</span>
                <button onClick={() => toggleCart(item.id)} style={{
                  background: inCart ? "#39FF88" : char.primary, border: "none", borderRadius: 999, padding: "5px 10px",
                  fontWeight: 800, fontSize: "0.68rem", color: "#0c0c14",
                }}>
                  {inCart ? "Added ✓" : "Add"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileScreen({ xp, totalXp, level }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0" }}>
        <div style={{ display: "flex" }}>
          {CHARACTERS.map((c, i) => (
            <div key={c.id} style={{ marginLeft: i === 0 ? 0 : -16, zIndex: CHARACTERS.length - i }}>
              <ArtBadge img={c.img} primary={c.primary} xp={xp[c.id]} size={58} />
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: "1.2rem", marginTop: 14 }}>Crew Level {level}</div>
        <div style={{ color: inkMuted, fontSize: "0.85rem" }}>{totalXp} total XP earned</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        {CHARACTERS.map((c) => {
          const charXp = xp[c.id];
          const petXp = xp[c.pet.id];
          const t = tierFor(charXp);
          const petT = tierFor(petXp);
          return (
            <div key={c.id} style={{ background: surface, borderRadius: 16, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <ArtBadge img={c.img} primary={c.primary} xp={charXp} size={50} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{c.name} · {t.label}</div>
                <div style={{ fontSize: "0.7rem", color: inkMuted }}>{c.pet.name} the {c.pet.species} · {petT.label}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, color: c.primary, fontSize: "0.78rem" }}>{charXp} XP</div>
                <div style={{ fontWeight: 800, color: c.secondary, fontSize: "0.7rem" }}>{petXp} XP</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
