// Yes this is lazy, yes this can easily be abused, yes this is probably a security risk.
// But I am not going to have a dedicated server just for sending an inquiry.


const DiscordUser = "181958738335236097";
const DiscordWebhook = "https://discord.com/api/webhooks/1379050256200761445/niRl1Z90M-g2hLojPSHJdGXvgO2UMpXisgQsfYcCqYTx4dBNisHfyBar0FXgkIcmvojV";

// Store a variable to localStorage to prevent multiple submissions within a short time frame
export function canSendInquiry(): boolean {
  const lastSent = localStorage.getItem("lastInquirySentV1");
  const now = Date.now();
  if (lastSent) {
    const lastSentTime = parseInt(lastSent, 10);
    // Allow sending an inquiry every day
    return now - lastSentTime > 24 * 60 * 60 * 1000;
  }
  return true;
}

export function setInquirySent(): void {
  localStorage.setItem("lastInquirySentV1", Date.now().toString());
}

export async function sendInquiry(email: string, message?: string): Promise<void> {
  if (!canSendInquiry()) {
    throw new Error("You can only send an inquiry once every 24 hours.");
  }

  const payload = {
    content: `<@${DiscordUser}>`,
    embeds: [
      {
        description: message || "No message provided.",
        color: 0xf5b44a,
        author: {
          name: email,
        },
        fields: [
          // Timezone
          {
            name: "⏳ Timezone",
            value: `\`${Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown"}\``,
            inline: true,
          },
          // Language
          {
            name: "🗣️ Language",
            value: `\`${navigator.language || "Unknown"}\``,
            inline: true,
          },
          // Email
          {
            name: "✉️ Email",
            value: `[${email}](mailto:${email})`,
            inline: true,
          },
        ]
      },
    ],
  };

  const response = await fetch(DiscordWebhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to send inquiry.");
  }

  setInquirySent();
}
