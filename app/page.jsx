"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// page

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user") || "YOUR_USERNAME";

    fetch(`/api/profile?user=${user}`)
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div style={{color:"white"}}>Loading...</div>;

  return (
    <div style={{
      background: "linear-gradient(135deg,#0a0f2c,#1b2a6b)",
      minHeight: "100vh",
      padding: 40,
      color: "white",
      fontFamily: "Inter"
    }}>

    {/* VIDEO BACKGROUND */}
    {data.gameData?.video && (
        <video autoPlay loop muted
            style={{
                position: "fixed",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.2,
                zIndex: 0
            }}>
            <source src={data.gameData.video} />
        </video>
    )}

      <motion.div initial={{opacity:0}} animate={{opacity:1}}>

        <div style={{display:"flex",gap:20}}>
          <img src={data.avatar} width={100} style={{borderRadius:"50%"}}/>

          <div>
            <h1 style={{fontFamily:"Orbitron"}}>{data.username}</h1>
            <div>{data.status}</div>
            <div>🎮 {data.game?.name}</div>
          </div>
        </div>

        {/* COVER */}
        {data.gameData?.cover && (
            <img  
                src={data.gameData.cover}
                style={{ width: "100%", borderRadius: 12, marginTop: 20 }}
            />
        )}

        <p>⭐ Rating: {data.gameData?.rating}</p> 
        <p>📅 Released: {data.gameData?.released}</p>
        <p>🎭 Genres: {data.gameData?.genres?.join(", ")}</p>

        {/* PROGRESS */}
        <div style={{marginTop:20}}>
          Level {data.level}
          <div style={{height:10,background:"#1c254f"}}>
            <div style={{width:`${data.progress}%`,height:"100%",background:"#2f80ff"}}/>
          </div>
        </div>

        {/* TROPHIES */}
        <div style={{marginTop:30,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {data.trophyTitles.map(t => (
            <motion.div key={t.name} whileHover={{scale:1.05}}
              style={{background:"#111",padding:10,borderRadius:10}}
            >
              <img src={t.icon} width={40}/>
              <div>{t.name}</div>
              <div>{t.progress}%</div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </div>
  );
}