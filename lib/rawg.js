import fetch from "node-fetch";
export async function getGameData(name) {
    if (!name) return {};
        try {
            const clean = name
            .replace(/™|®/g, "")
            .replace(/PS4|PS5/gi, "")
        .trim();

        const res = await fetch(
            `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(clean)}&page_size=1`
        );

        const data = await res.json();
        const game = data.results?.[0];


        return {
            cover: game.background_image,
            rating: game.rating,
            released: game.released,
            genres: game.genres?.map(g => g.name),
            video: game.clip?.clip || null
        };
    } catch (e) {
        return {};
    }
}