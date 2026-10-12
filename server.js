
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    name: "Muse AI API",
    status: "running",
    database: false,
    message: "Muse AI demo backend is ready."
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: false,
    timestamp: new Date().toISOString()
  });
});

function buildContent({ type, topic, tone, length }) {
  const subject = topic.trim();
  const style = tone || "Friendly";
  const size = length || "Medium";

  switch (type) {
    case "Instagram caption":
      return `✨ ${subject}\n\nEvery little detail has a story to tell. Take a moment, find your inspiration, and make it your own. 💜\n\nWhat does ${subject} mean to you?\n\n#Inspiration #CreativeLife #MuseAI`;

    case "Story ideas":
      return `STORY IDEA: A new beginning\n\nA character discovers something unexpected connected to ${subject}. At first, it seems ordinary, but each small discovery reveals a new possibility.\n\nBEGINNING\nIntroduce the character and their everyday world.\n\nMIDDLE\nAn unexpected event changes their plans.\n\nENDING\nA thoughtful choice leads to a surprising discovery.\n\nWRITING TIP\nGive the main character a clear goal and one meaningful challenge.`;

    case "Brand name ideas": {
      const clean = subject.replace(/[^a-zA-Z0-9 ]/g, "").trim();
      const word = clean.split(/\s+/)[0] || "Nova";

      return `BRAND NAME STARTING POINTS\n\n1. ${word} Studio\n2. Nova & Co.\n3. Purely ${word}\n4. Bright Origin\n5. Bloom Theory\n6. The Idea House\n7. Little Wonder\n\nCheck trademark and domain availability before choosing a name.`;
    }

    case "Post ideas":
      return `CONTENT IDEAS FOR ${subject.toUpperCase()}\n\n1. A beginner's guide\n2. Three common misunderstandings\n3. A personal lesson or reflection\n4. Five practical tips\n5. A question that starts a conversation\n6. A myth-versus-fact post\n7. A short step-by-step guide\n\nSuggested format: ${size === "Short" ? "short post or reel outline" : size === "Long" ? "detailed carousel or blog outline" : "medium-length carousel"}.\n\nTone: ${style}`;

    case "Product description":
      return `Discover ${subject}, designed with simplicity and everyday usefulness in mind.\n\nWHY IT STANDS OUT\n• A clear, easy-to-understand design\n• Made for everyday use\n• A thoughtful choice for people who value simplicity\n\nMake ${subject} part of your next idea.\n\nNote: Replace general statements with verified product information before publishing.`;

    case "Daily motivation":
      return `“You do not have to have everything figured out today. Take one honest step, learn from it, and keep moving toward the life you want.”\n\nTheme: ${subject}\nTone: ${style}`;

    default:
      return `Here is a ${style.toLowerCase()} starting draft about ${subject}.\n\nStart with one clear idea. Explain why it matters to your audience, provide a practical example, and finish with a useful takeaway.\n\nNext step: Add specific details and your own voice before publishing.\n\nRequested length: ${size}.`;
  }
}

app.post("/api/generate", (req, res) => {
  const { type, topic, tone, length } = req.body || {};

  if (typeof topic !== "string" || !topic.trim()) {
    return res.status(400).json({
      error: "Please provide a topic."
    });
  }

  if (topic.length > 3000) {
    return res.status(400).json({
      error: "Please keep the topic under 3000 characters."
    });
  }

  const safeType = typeof type === "string" ? type : "General draft";
  const safeTone = typeof tone === "string" ? tone : "Friendly";
  const safeLength = typeof length === "string" ? length : "Medium";

  const content = buildContent({
    type: safeType,
    topic,
    tone: safeTone,
    length: safeLength
  });

  return res.json({
    success: true,
    content,
    type: safeType,
    generatedAt: new Date().toISOString(),
    mode: "demo"
  });
});

app.use((_req, res) => {
  res.status(404).json({
    error: "Endpoint not found."
  });
});

app.listen(PORT, () => {
  console.log(`Muse AI backend running at http://localhost:${PORT}`);
  console.log("Database: disabled");
});
