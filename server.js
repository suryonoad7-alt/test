// server.js
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent]
});

const DISCORD_TOKEN = "BOT_TOKEN_KAMU";
const GUILD_ID = "SERVER_ID_DISCORD_KAMU";

// Database sederhana (gunakan DB sungguhan untuk produksi)
const verifiedUsers = new Set(); // Simpan userId Roblox yang sudah verifikasi

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Cek jika pesan berformat kode verifikasi
    if (message.content.startsWith("VERIFY-")) {
        const robloxUserId = message.content.replace("VERIFY-", "").trim();
        
        // Cek apakah user ada di server Discord
        const guild = client.guilds.cache.get(GUILD_ID);
        const member = guild.members.cache.get(message.author.id) || 
                       await guild.members.fetch(message.author.id).catch(() => null);

        if (member) {
            verifiedUsers.add(robloxUserId);
            message.reply("✅ Verifikasi berhasil! Kamu sekarang bisa masuk ke game Roblox.");
        } else {
            message.reply("❌ Kamu harus berada di server ini terlebih dahulu!");
        }
    }
});

// Endpoint untuk dicek Roblox
app.get("/check-verified", (req, res) => {
    const userId = req.query.userId;
    res.json({ verified: verifiedUsers.has(userId) });
});

client.login(DISCORD_TOKEN);
app.listen(3000, () => console.log("Backend berjalan di port 3000"));
