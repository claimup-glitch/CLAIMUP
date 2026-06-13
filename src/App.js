import { useState } from "react";

const C = {
  navy: "#0B1120", navyMid: "#161F35", navyLight: "#1E2D4A",
  amber: "#F5A623", amberLight: "#FFC854",
  white: "#F7F8FA", muted: "#8A95A8",
  green: "#22C55E", red: "#EF4444", blue: "#3B82F6",
};

const MOCK_DOSSIERS = [
  { id: "CU-2026-001", client: "Marie Lefebvre", vol: "AF1234", trajet: "Paris CDG → New York JFK", date: "12 juin 2026", motif: "Vol annulé", montant: 600, statut: "en_cours", etape: "Dossier envoyé à Air France", progression: 60, dateDepot: "10 juin 2026", commission: 180 },
  { id: "CU-2026-002", client: "Thomas Bernard", vol: "EZY789", trajet: "Lyon → Londres Gatwick", date: "8 juin 2026", motif: "Retard +4h", montant: 400, statut: "gagne", etape: "Remboursement reçu", progression: 100, dateDepot: "5 juin 2026", commission: 120 },
  { id: "CU-2026-003", client: "Sophie Martin", vol: "U21456", trajet: "Marseille → Amsterdam", date: "15 juin 2026", motif: "Refus d'embarquement", montant: 400, statut: "nouveau", etape: "Vérification éligibilité", progression: 15, dateDepot: "11 juin 2026", commission: 120 },
  { id: "CU-2026-004", client: "Lucas Dubois", vol: "VY3312", trajet: "Nice → Barcelone", date: "3 juin 2026", motif: "Vol annulé", montant: 250, statut: "perdu", etape: "Compagnie a refusé", progression: 100, dateDepot: "2 juin 2026", commission: 0 },
];

const ETAPES = [
  "Réception du dossier",
  "Vérification éligibilité CE 261/2004",
  "Collecte des documents",
  "Réclamation envoyée à la compagnie",
  "Relance / Médiation",
  "Remboursement obtenu",
];

const statutConfig = {
  nouveau: { label: "Nouveau", color: C.blue, bg: "#1E3A5F" },
  en_cours: { label: "En cours", color: C.amber, bg: "#3D2A00" },
  gagne: { label: "Gagné ✓", color: C.green, bg: "#052E16" },
  perdu: { label: "Clôturé", color: C.muted, bg: "#1A1F2E" },
};

function Badge({ statut }) {
  const cfg = statutConfig[statut] || statutConfig.nouveau;
  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40`, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600, letterSpacing: "0.03em" }}>
      {cfg.label}
    </span>
  );
}

function ProgressBar({ value, statut }) {
  const color = statut === "gagne" ? C.green : statut === "perdu" ? C.muted : C.amber;
  return (
    <div style={{ background: "#ffffff12", borderRadius: 4, height: 4, marginTop: 8 }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}

// ─── LANDING PAGE ────────────────────────────────────────────────
function LandingPage({ onGoToDashboard }) {
  const [form, setForm] = useState({ nom: "", email: "", tel: "", vol: "", date: "", trajet: "", compagnie: "", siteAchat: "", motif: "" });
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [dossierNum] = useState(() => Math.floor(Math.random() * 900 + 100));
  const [hover, setHover] = useState(null);

  const handleNext = async () => {
    if (step < 3) { setStep(s => s + 1); return; }
    try {
      // Email à toi avec le dossier complet
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_k45pihh",
          template_id: "template_75mpran",
          user_id: "VUu4I7Uw8R9JS5pUl",
          template_params: {
            title: `Nouveau dossier - ${form.nom}`,
            name: form.nom,
            email: form.email,
            message: `Vol : ${form.vol}\nDate : ${form.date}\nTrajet : ${form.trajet}\nCompagnie : ${form.compagnie}\nSite achat : ${form.siteAchat}\nMotif : ${form.motif}\nTél : ${form.tel}`,
          }
        })
      });
      // Email de confirmation au client
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_k45pihh",
          template_id: "template_75mpran",
          user_id: "VUu4I7Uw8R9JS5pUl",
          template_params: {
            title: `Confirmation de votre dossier ClaimUp`,
            name: "ClaimUp",
            email: "contact@claimup.fr",
            message: `Bonjour ${form.nom},\n\nVotre dossier a bien été enregistré.\n\nNous allons étudier votre demande et vous recontacter rapidement.\n\nVol : ${form.vol}\nTrajet : ${form.trajet}\nMotif : ${form.motif}\n\nÀ très bientôt,\nL'équipe ClaimUp\ncontact@claimup.fr`,
          },
          headers: { "Reply-To": form.email, "To": form.email }
        })
      });
    } catch(e) { console.log(e); }
    setSubmitted(true);
  };

  const field = (key, label, placeholder, type = "text") => (
    <div key={key}>
      <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        style={{ width: "100%", background: C.navyLight, border: `1px solid #ffffff15`, borderRadius: 8, padding: "12px 14px", color: C.white, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
      />
    </div>
  );

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: C.navy, minHeight: "100vh", color: C.white }}>

      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: "1px solid #ffffff0f", position: "sticky", top: 0, background: C.navy + "ee", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: C.amber, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✈</div>
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.03em" }}>ClaimUp</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="#comment" style={{ color: C.muted, fontSize: 13, textDecoration: "none" }}>Comment ça marche</a>
          <a href="#faq" style={{ color: C.muted, fontSize: 13, textDecoration: "none" }}>FAQ</a>
          <button
            onClick={onGoToDashboard}
            style={{ background: "transparent", border: "1px solid #ffffff20", color: C.muted, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}
          >Espace pro →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "72px 24px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#F5A62318", border: `1px solid ${C.amber}35`, borderRadius: 20, padding: "5px 14px", fontSize: 11, color: C.amber, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 28 }}>
          Règlement CE 261/2004 · Jusqu'à 600€ par passager
        </div>

        <h1 style={{ fontSize: "clamp(34px, 5.5vw, 56px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 22 }}>
          Vol annulé ou retardé ?<br />
          <span style={{ color: C.amber }}>On réclame à votre place.</span>
        </h1>

        <p style={{ color: C.muted, fontSize: 17, lineHeight: 1.75, maxWidth: 500, margin: "0 auto 40px" }}>
          Déposez votre dossier en 2 minutes. On contacte la compagnie, on relance, on négocie.
          Vous ne payez que si on obtient votre remboursement.
        </p>

        {/* STATS */}
        <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 60 }}>
          {[
            { val: "94%", label: "Taux de succès" },
            { val: "45 j", label: "Délai moyen" },
            { val: "0 €", label: "Si on perd" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, maxWidth: 170, padding: "20px 16px", background: C.navyMid, border: "1px solid #ffffff0a", borderRadius: i === 0 ? "12px 0 0 12px" : i === 2 ? "0 12px 12px 0" : 0 }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: C.amber }}>{s.val}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 24px 80px" }}>
        {!submitted ? (
          <div style={{ background: C.navyMid, border: "1px solid #ffffff0f", borderRadius: 16, padding: "28px 32px" }}>

            {/* Steps */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              {["Votre vol", "Vos infos", "Confirmation"].map((s, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <div style={{ height: 3, borderRadius: 2, background: i + 1 <= step ? C.amber : "#ffffff15", marginBottom: 6, transition: "background 0.3s" }} />
                  <div style={{ fontSize: 11, color: i + 1 <= step ? C.amber : C.muted }}>{s}</div>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700 }}>Votre vol</h3>
                {field("vol", "Numéro de vol", "AF1234, EZY789…")}
                {field("date", "Date du vol", "12/06/2026")}
                {field("trajet", "Trajet", "Paris CDG → New York JFK")}
                <div>
                  <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Compagnie aérienne</label>
                  <select value={form.compagnie} onChange={e => setForm({ ...form, compagnie: e.target.value })} style={{ width: "100%", background: C.navyLight, border: "1px solid #ffffff15", borderRadius: 8, padding: "12px 14px", color: C.white, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}>
                    <option value="">Sélectionner…</option>
                    <option>Air France</option>
                    <option>easyJet</option>
                    <option>Ryanair</option>
                    <option>Transavia</option>
                    <option>Vueling</option>
                    <option>Lufthansa</option>
                    <option>British Airways</option>
                    <option>TUI</option>
                    <option>Wizz Air</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Site d'achat du billet</label>
                  <select value={form.siteAchat} onChange={e => setForm({ ...form, siteAchat: e.target.value })} style={{ width: "100%", background: C.navyLight, border: "1px solid #ffffff15", borderRadius: 8, padding: "12px 14px", color: C.white, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}>
                    <option value="">Sélectionner…</option>
                    <option>Directement sur le site de la compagnie</option>
                    <option>Opodo</option>
                    <option>eDreams</option>
                    <option>Booking.com</option>
                    <option>Kayak</option>
                    <option>Expedia</option>
                    <option>Lastminute</option>
                    <option>Voyage Privé</option>
                    <option>Autre revendeur</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Motif</label>
                  <select value={form.motif} onChange={e => setForm({ ...form, motif: e.target.value })} style={{ width: "100%", background: C.navyLight, border: "1px solid #ffffff15", borderRadius: 8, padding: "12px 14px", color: C.white, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}>
                    <option value="">Sélectionner…</option>
                    <option>Vol annulé</option>
                    <option>Retard de +3h</option>
                    <option>Refus d'embarquement</option>
                    <option>Correspondance manquée</option>
                    <option>Annulation partielle par revendeur (Opodo, eDreams…)</option>
                    <option>Modification unilatérale par revendeur</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700 }}>Vos coordonnées</h3>
                {field("nom", "Nom complet", "Marie Dupont")}
                {field("email", "Email", "marie@exemple.fr", "email")}
                {field("tel", "Téléphone", "+33 6 12 34 56 78", "tel")}
                <div style={{ background: "#F5A62310", border: `1px solid ${C.amber}28`, borderRadius: 10, padding: "14px 16px", fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
                  📋 En soumettant ce formulaire, vous nous mandatez pour agir en votre nom auprès de la compagnie aérienne. Notre commission est de <strong style={{ color: C.amber }}>30% du montant obtenu</strong>, uniquement en cas de succès.
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700 }}>Récapitulatif</h3>
                <div style={{ background: C.navyLight, borderRadius: 12, padding: "18px 20px", fontSize: 14 }}>
                  {[
                    ["Vol", form.vol || "—"],
                    ["Trajet", form.trajet || "—"],
                    ["Date", form.date || "—"],
                    ["Compagnie", form.compagnie || "—"],
                    ["Site d'achat", form.siteAchat || "—"],
                    ["Motif", form.motif || "—"],
                    ["Nom", form.nom || "—"],
                    ["Email", form.email || "—"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #ffffff08" }}>
                      <span style={{ color: C.muted }}>{k}</span>
                      <span style={{ fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              style={{ width: "100%", marginTop: 22, background: C.amber, color: C.navy, border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: "-0.01em" }}
            >
              {step < 3 ? "Continuer →" : "Déposer mon dossier"}
            </button>
          </div>
        ) : (
          /* BOARDING PASS SUCCESS */
          <div style={{ background: C.navyMid, border: `1px solid ${C.amber}50`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ background: C.amber, padding: "22px 28px", color: C.navy }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Dossier enregistré</div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>CU-2026-{dossierNum}</div>
            </div>
            <div style={{ height: 12, background: "repeating-linear-gradient(90deg, #0B1120 0px, #0B1120 10px, #161F35 10px, #161F35 20px)" }} />
            <div style={{ padding: "24px 28px" }}>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.75, marginBottom: 16 }}>
                Votre dossier est entre nos mains. Vous recevrez une confirmation par email et on vous tient informé à chaque étape.
              </p>
              <div style={{ fontSize: 13, color: C.amber, fontWeight: 600 }}>✉ Confirmation envoyée à {form.email || "votre email"}</div>
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #ffffff10", fontSize: 12, color: C.muted }}>
                Des questions ? Écrivez-nous à <strong style={{ color: C.white }}>contact@claimup.fr</strong>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section id="comment" style={{ borderTop: "1px solid #ffffff08", padding: "64px 24px", maxWidth: 820, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, marginBottom: 48, letterSpacing: "-0.02em" }}>Comment ça marche</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {[
            { icon: "📝", title: "Déposez votre dossier", desc: "2 minutes. Numéro de vol, date, motif. C'est tout." },
            { icon: "✍️", title: "Vous signez le mandat", desc: "Un document électronique pour qu'on agisse officiellement en votre nom." },
            { icon: "📨", title: "On contacte la compagnie", desc: "Réclamation, relances, négociation. On s'occupe de tout." },
            { icon: "💰", title: "Vous recevez votre argent", desc: "Commission de 30% seulement si on obtient votre remboursement." },
          ].map((s, i) => (
            <div key={i} style={{ background: C.navyMid, borderRadius: 14, padding: "24px 20px", border: "1px solid #ffffff08" }}>
              <div style={{ fontSize: 30, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.title}</div>
              <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AVIS CLIENTS */}
      <section style={{ borderTop: "1px solid #ffffff08", padding: "64px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "#F5A62318", border: `1px solid ${C.amber}35`, borderRadius: 20, padding: "5px 14px", fontSize: 11, color: C.amber, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
            Témoignages
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>Ils ont été remboursés</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { nom: "Sarah M.", ville: "Paris", avis: "Mon vol Air France a été annulé 2h avant le départ. J'avais abandonné l'idée d'être remboursée. ClaimUp a récupéré 600€ en 3 semaines. Incroyable !", montant: "600€", etoiles: 5 },
            { nom: "Julien T.", ville: "Lyon", avis: "Retard de 4h sur un vol easyJet. J'avais essayé seul mais la compagnie ne répondait plus. ClaimUp a tout géré, j'ai reçu 400€ sans rien faire.", montant: "400€", etoiles: 5 },
            { nom: "Camille R.", ville: "Bordeaux", avis: "Refus d'embarquement sur un vol Ryanair. En moins de 6 semaines, 250€ sur mon compte. Je recommande à tous mes amis !", montant: "250€", etoiles: 5 },
            { nom: "Marc D.", ville: "Marseille", avis: "J'étais sceptique au départ mais le service est vraiment sérieux. Ils m'ont tenu informé à chaque étape. 400€ récupérés !", montant: "400€", etoiles: 5 },
            { nom: "Léa B.", ville: "Toulouse", avis: "Vol annulé la veille des vacances. Stressée et déçue, ClaimUp a pris en charge tout le dossier. 600€ remboursés en 5 semaines.", montant: "600€", etoiles: 5 },
            { nom: "Antoine F.", ville: "Nantes", avis: "Simple, rapide, efficace. J'avais abandonné après 2 mois de relances. Ils ont obtenu 250€ là où je n'avais rien eu.", montant: "250€", etoiles: 5 },
            { nom: "Inès K.", ville: "Strasbourg", avis: "eDreams avait annulé mon vol retour sans me prévenir. Impossible de les joindre. ClaimUp a récupéré 400€ en s'occupant de tout le litige.", montant: "400€", etoiles: 5 },
          ].map((a, i) => (
            <div key={i} style={{ background: C.navyMid, borderRadius: 14, padding: "24px 22px", border: "1px solid #ffffff08" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                {Array.from({ length: a.etoiles }).map((_, j) => (
                  <span key={j} style={{ color: C.amber, fontSize: 14 }}>★</span>
                ))}
              </div>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.75, marginBottom: 18 }}>"{a.avis}"</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.nom}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{a.ville}</div>
                </div>
                <div style={{ background: "#052E16", color: C.green, border: `1px solid ${C.green}40`, borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>
                  +{a.montant}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ maxWidth: 620, margin: "0 auto", padding: "20px 24px 80px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, letterSpacing: "-0.02em" }}>Questions fréquentes</h2>
        {[
          { q: "Combien coûte le service ?", r: "Rien si on perd. En cas de succès, on prélève 30% du montant remboursé. Exemple : 600€ récupérés → vous recevez 420€, on garde 180€." },
          { q: "Quels vols sont éligibles ?", r: "Les vols au départ ou à destination de l'UE, retardés de +3h, annulés ou avec refus d'embarquement. Les annulations partielles effectuées par un revendeur (Opodo, eDreams, Booking…) sont également concernées. La règle CE 261/2004 s'applique." },
          { q: "Mon billet a été partiellement annulé par un revendeur, suis-je concerné ?", r: "Oui ! Si un revendeur a annulé un tronçon de votre billet (ex : retour annulé, escale supprimée) sans votre accord, vous avez droit à une indemnisation. On s'occupe de tout, y compris les litiges avec les intermédiaires." },
          { q: "Combien de temps ça prend ?", r: "En moyenne 45 jours. Certaines compagnies règlent en 2 semaines, d'autres traînent jusqu'à 3 mois." },
          { q: "Et si j'ai déjà contacté la compagnie ?", r: "Pas de problème, déposez quand même votre dossier. On prend le relais à partir de là où vous en êtes." },
        ].map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #ffffff0a", padding: "20px 0" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.q}</div>
            <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>{f.r}</div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #ffffff08", padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, background: C.amber, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✈</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>ClaimUp</span>
        </div>
        <div style={{ fontSize: 12, color: C.muted }}>contact@claimup.fr · Commission 30% au succès uniquement</div>
        <div style={{ fontSize: 12, color: C.muted }}>© 2026 ClaimUp</div>
      </footer>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────
function Dashboard({ onBack }) {
  const [dossiers, setDossiers] = useState(MOCK_DOSSIERS);
  const [selected, setSelected] = useState(null);
  const [filterStatut, setFilterStatut] = useState("tous");
  const [search, setSearch] = useState("");
  const [note, setNote] = useState("");

  const totalGagne = dossiers.filter(d => d.statut === "gagne").reduce((s, d) => s + d.commission, 0);
  const enCours = dossiers.filter(d => d.statut === "en_cours" || d.statut === "nouveau").length;
  const closes = dossiers.filter(d => d.statut !== "nouveau" && d.statut !== "en_cours");
  const tauxSucces = closes.length ? Math.round(dossiers.filter(d => d.statut === "gagne").length / closes.length * 100) : 0;

  const filtered = dossiers.filter(d => {
    const matchStatut = filterStatut === "tous" || d.statut === filterStatut;
    const matchSearch = d.client.toLowerCase().includes(search.toLowerCase()) || d.vol.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchSearch;
  });

  const updateStatut = (id, statut) => {
    setDossiers(ds => ds.map(d => d.id === id ? { ...d, statut, progression: statut === "gagne" ? 100 : statut === "perdu" ? 100 : d.progression } : d));
    setSelected(s => s ? { ...s, statut, progression: statut === "gagne" ? 100 : statut === "perdu" ? 100 : s.progression } : null);
  };

  if (selected) {
    const d = selected;
    return (
      <div style={{ fontFamily: "Inter, sans-serif", background: C.navy, minHeight: "100vh", color: C.white }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px" }}>

          <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
            ← Tous les dossiers
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{d.id} · Déposé le {d.dateDepot}</div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{d.client}</h2>
            </div>
            <Badge statut={d.statut} />
          </div>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              ["Vol", d.vol], ["Date", d.date],
              ["Trajet", d.trajet], ["Motif", d.motif],
              ["Montant réclamé", `${d.montant} €`], ["Commission potentielle", `${d.commission} €`],
            ].map(([label, val]) => (
              <div key={label} style={{ background: C.navyMid, borderRadius: 10, padding: "14px 16px", border: "1px solid #ffffff08" }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Change statut */}
          <div style={{ background: C.navyMid, borderRadius: 12, padding: "20px 24px", border: "1px solid #ffffff08", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Changer le statut</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(statutConfig).map(([k, v]) => (
                <button key={k} onClick={() => updateStatut(d.id, k)} style={{
                  background: d.statut === k ? v.bg : "transparent",
                  color: d.statut === k ? v.color : C.muted,
                  border: `1px solid ${d.statut === k ? v.color : "#ffffff15"}`,
                  borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}>{v.label}</button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: C.navyMid, borderRadius: 12, padding: "22px 24px", border: "1px solid #ffffff08", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Progression</div>
            <ProgressBar value={d.progression} statut={d.statut} />
            <div style={{ marginTop: 22 }}>
              {ETAPES.map((etape, i) => {
                const stepPct = (i + 1) / ETAPES.length * 100;
                const done = d.progression >= stepPct;
                const active = !done && d.progression >= (i / ETAPES.length * 100);
                return (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: done ? C.green : active ? C.amber : "#ffffff10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, marginTop: 1, color: C.navy, fontWeight: 700 }}>
                      {done ? "✓" : ""}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: done || active ? 600 : 400, color: done || active ? C.white : C.muted }}>{etape}</div>
                      {active && <div style={{ fontSize: 12, color: C.amber, marginTop: 2 }}>{d.etape}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Notes internes</label>
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="Historique des échanges, promesses de la compagnie, numéros de dossier…"
              style={{ width: "100%", background: C.navyMid, border: "1px solid #ffffff15", borderRadius: 10, padding: "12px 14px", color: C.white, fontSize: 13, outline: "none", resize: "vertical", minHeight: 100, boxSizing: "border-box", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: C.navy, minHeight: "100vh", color: C.white }}>

      {/* HEADER */}
      <div style={{ borderBottom: "1px solid #ffffff0a", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: C.navy + "f0", backdropFilter: "blur(10px)", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.amber, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>✈</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>ClaimUp</div>
            <div style={{ fontSize: 11, color: C.muted }}>Espace pro</div>
          </div>
        </div>
        <button onClick={onBack} style={{ background: "transparent", border: "1px solid #ffffff15", color: C.muted, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12 }}>
          Voir le site →
        </button>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 24px" }}>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Commissions encaissées", val: `${totalGagne} €`, icon: "💶" },
            { label: "Dossiers actifs", val: enCours, icon: "📂" },
            { label: "Taux de succès", val: `${tauxSucces} %`, icon: "🎯" },
          ].map((k, i) => (
            <div key={i} style={{ background: C.navyMid, borderRadius: 12, padding: "18px 20px", border: "1px solid #ffffff08" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{k.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: i === 0 ? C.amber : C.white }}>{k.val}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un client, vol, numéro…"
            style={{ flex: 1, minWidth: 200, background: C.navyMid, border: "1px solid #ffffff10", borderRadius: 8, padding: "9px 14px", color: C.white, fontSize: 13, outline: "none", fontFamily: "Inter, sans-serif" }}
          />
          {["tous", "nouveau", "en_cours", "gagne", "perdu"].map(s => (
            <button key={s} onClick={() => setFilterStatut(s)} style={{
              background: filterStatut === s ? C.amber : C.navyMid,
              color: filterStatut === s ? C.navy : C.muted,
              border: `1px solid ${filterStatut === s ? C.amber : "#ffffff10"}`,
              borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>
              {s === "tous" ? "Tous" : statutConfig[s]?.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(d => (
            <div
              key={d.id}
              onClick={() => setSelected(d)}
              style={{ background: C.navyMid, borderRadius: 12, padding: "16px 20px", border: "1px solid #ffffff08", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#ffffff22"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#ffffff08"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{d.client}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{d.id}</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.muted }}>{d.vol} · {d.trajet} · {d.date}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <Badge statut={d.statut} />
                  <div style={{ fontSize: 13, color: d.statut === "gagne" ? C.green : C.muted, marginTop: 6, fontWeight: 600 }}>
                    {d.statut === "gagne" ? `+${d.commission} € commission` : `${d.montant} € réclamés`}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{d.etape}</div>
              <ProgressBar value={d.progression} statut={d.statut} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: C.muted, fontSize: 14 }}>Aucun dossier trouvé</div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onSuccess, onBack }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (pwd === "1945T1955W") {
      onSuccess();
    } else {
      setError(true);
      setPwd("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: C.navy, minHeight: "100vh", color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 380, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: C.amber, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>✈</div>
          <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em" }}>ClaimUp Pro</div>
          <div style={{ color: C.muted, fontSize: 14, marginTop: 6 }}>Accès réservé</div>
        </div>

        <div style={{ background: C.navyMid, borderRadius: 16, padding: "28px 24px", border: `1px solid ${error ? C.red : "#ffffff0f"}`, transition: "border-color 0.3s" }}>
          <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mot de passe</label>
          <input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="••••••••••"
            style={{ width: "100%", background: C.navyLight, border: `1px solid ${error ? C.red : "#ffffff15"}`, borderRadius: 8, padding: "12px 14px", color: C.white, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif", marginBottom: 8 }}
          />
          {error && <div style={{ color: C.red, fontSize: 12, marginBottom: 8 }}>Mot de passe incorrect</div>}
          <button
            onClick={handleLogin}
            style={{ width: "100%", marginTop: 8, background: C.amber, color: C.navy, border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 800, cursor: "pointer" }}
          >
            Accéder →
          </button>
        </div>

        <button onClick={onBack} style={{ display: "block", margin: "20px auto 0", background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 13 }}>
          ← Retour au site
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing");

  if (view === "login") return <LoginPage onSuccess={() => setView("dashboard")} onBack={() => setView("landing")} />;
  if (view === "dashboard") return <Dashboard onBack={() => setView("landing")} />;
  return <LandingPage onGoToDashboard={() => setView("login")} />;
}
