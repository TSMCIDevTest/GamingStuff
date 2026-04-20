"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentUser = params.get("user") || "Banerlc"; 
    setUser(currentUser);

    // This fetch now works because the API above returns JSON
    fetch(`/api/profile?user=${currentUser}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => console.error("Error loading PSN data:", err));
  }, []);

  if (!data) return <div style={{ color: "white", padding: 40 }}>Loading Profile...</div>;

  return (
    <div style={{
      background: "linear-gradient(135deg,#0a0f2c,#1b2a6b)",
      minHeight: "100vh",
      padding: 40,
      color: "white",
      fontFamily: "Inter",
      position: "relative",
      overflow: "hidden"
    }}>

      {/* VIDEO BACKGROUND */}
      {data.gameData?.video && (
        <video autoPlay loop muted
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.2,
            zIndex: 0
          }}>
          <source src={data.gameData.video} type="video/mp4" />
        </video>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <img src={data.avatar} width={100} style={{ borderRadius: "50%", border: "3px solid #2f80ff" }} alt="avatar" />
          <div>
            <h1 style={{ fontFamily: "Orbitron", margin: 0 }}>{data.username}</h1>
            <div style={{ color: data.status === "Online" ? "#2cff88" : "#ff4d4d" }}>● {data.status}</div>
            <div style={{ fontSize: "1.2rem", marginTop: 5 }}>🎮 {data.game?.name || "Idle"}</div>
          </div>
        </div>

        {/* COVER ART */}
        {data.gameData?.cover && (
          <img
            src={data.gameData.cover}
            style={{ width: "100%", maxWidth: "800px", borderRadius: 12, marginTop: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
            alt="cover"
          />
        )}

        <div style={{ marginTop: 20, display: "flex", gap: "20px", opacity: 0.8 }}>
          <span>⭐ Rating: {data.gameData?.rating || "N/A"}</span>
          <span>📅 Released: {data.gameData?.released || "N/A"}</span>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ marginTop: 30, maxWidth: "600px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span>Level {data.level}</span>
            <span>{data.progress}%</span>
          </div>
          <div style={{ height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 5 }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${data.progress}%` }}
              style={{ height: "100%", background: "#2f80ff", borderRadius: 5, boxShadow: "0 0 10px #2f80ff" }} 
            />
          </div>
        </div>

        {/* TROPHY GRID */}
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 15 }}>
          {data.trophyTitles?.map((t, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.05, backgroundColor: "#1c254f" }}
              style={{ background: "rgba(0,0,0,0.4)", padding: 15, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <img src={t.icon} width={50} style={{ marginBottom: 10 }} alt="trophy-icon" />
              <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>{t.name}</div>
              <div style={{ fontSize: "0.8rem", color: "#56ccf2" }}>{t.progress}% Complete</div>
            </motion.div>
          ))}
        </div>

        <hr style={{ margin: "50px 0", opacity: 0.1 }} />

        {/* THE STATIC IMAGE VERSION (Optional) */}
        <h3>PSN Card</h3>
        <img 
          src={`/api/profile?user=${user}&format=svg`} // Note: Only if you handle '&format=svg' in your API
          alt="PSN Card"
          style={{ borderRadius: '15px', width: '100%', maxWidth: '600px' }}
        />

      </motion.div>
    </div>
  );
}