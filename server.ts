import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Ensure Gemini client utility uses the recommended telemetry header Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

function generateLocalArtSvg(text: string): string {
  const normalizedText = text.toLowerCase();
  
  // 1. Space / Night / Milkyway / Stars
  const nightKeywords = ["ليل", "نجوم", "قمر", "مساء", "عتمة", "سوداء", "كواكب", "فضاء", "ظلام"];
  // 2. Water / Ocean / Sea / Ships / Waves
  const oceanKeywords = ["بحر", "مياه", "ماء", "سمك", "سمكة", "حوت", "سفينة", "مركب", "موج", "أمواج", "نهر"];
  // 3. Nature / Sun / Meadows / Trees / Garden
  const natureKeywords = ["شمس", "نهار", "صباح", "شروق", "ضياء", "نور", "دافئ", "حديقة", "بستان", "غابة", "طبيعة", "عشب", "شجرة", "أشجار", "زهرة", "زهور", "ورد", "حقل", "ريف"];
  // 4. House / Room / Family
  const houseKeywords = ["بيت", "منزل", "دار", "غرفة", "غرف", "أسرة", "عائلة", "بناية", "سكن"];
  // 5. School / Chalkboard / Notebook / Pen
  const schoolKeywords = ["مدرسة", "صف", "سبورة", "درس", "كتاب", "دفتر", "معلم", "معلمة", "تلميذ", "حساب", "رسم", "قلم", "جامعة", "تعليم"];

  const hasKeyword = (words: string[]) => words.some(w => normalizedText.includes(w));

  if (hasKeyword(nightKeywords)) {
    // Night Theme
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
        <rect width="800" height="450" fill="#0f172a" rx="20"/>
        <rect x="20" y="20" width="760" height="410" fill="none" stroke="#f43f5e" stroke-width="4" stroke-dasharray="8, 8" rx="15" opacity="0.6"/>
        
        <!-- Stars -->
        <polygon points="120,80 125,95 140,95 128,105 132,120 120,110 108,120 112,105 100,95 115,95" fill="#fef08a" />
        <polygon points="250,150 253,160 263,160 255,167 258,177 250,170 242,177 245,167 237,160 247,160" fill="#a5f3fc" />
        <polygon points="680,260 683,270 693,270 685,277 688,287 680,280 672,287 675,277 667,270 677,270" fill="#fbcfe8" />
        <polygon points="450,100 452,108 460,108 454,113 456,121 450,116 444,121 446,113 440,108 448,108" fill="#fef08a" />
        <polygon points="180,280 182,288 190,288 184,293 186,301 180,296 174,301 176,293 170,288 178,288" fill="#fef08a" />
        <polygon points="620,110 622,118 630,118 624,123 626,131 620,126 614,131 616,123 610,118 618,118" fill="#fbcfe8" />
        
        <!-- Crescent Moon -->
        <path d="M 600,100 A 55,55 0 1,0 660,155 A 42,42 0 1,1 600,100 Z" fill="#fef08a" filter="drop-shadow(0 0 15px rgba(254, 240, 138, 0.7))" />
        
        <!-- Friendly Saucer -->
        <g transform="translate(320, 180)">
          <ellipse cx="60" cy="50" rx="40" ry="15" fill="#a855f7" />
          <ellipse cx="60" cy="40" rx="25" ry="18" fill="#38bdf8" opacity="0.8" />
          <circle cx="35" cy="50" r="3" fill="#fb923c" />
          <circle cx="60" cy="52" r="3" fill="#fb923c" />
          <circle cx="85" cy="50" r="3" fill="#fb923c" />
          <path d="M 45,50 Q 60,65 75,50" stroke="#f43f5e" stroke-width="2" fill="none" />
        </g>

        <!-- Subtitle Box -->
        <rect x="50" y="340" width="700" height="75" fill="#1e293b" opacity="0.9" rx="15" stroke="#475569" stroke-width="2"/>
        <text x="50%" y="380" dominant-baseline="middle" text-anchor="middle" font-family="'Tajawal', sans-serif" font-size="24" font-weight="bold" fill="#f8fafc">${text}</text>
      </svg>
    `;
  }
  
  if (hasKeyword(oceanKeywords)) {
    // Ocean Theme
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
        <!-- Sky -->
        <rect width="800" height="450" fill="#bae6fd" rx="20"/>
        
        <!-- Sun -->
        <circle cx="100" cy="90" r="35" fill="#fef08a" opacity="0.9" />
        
        <!-- Clouds -->
        <g fill="#ffffff" opacity="0.85">
          <circle cx="580" cy="70" r="25"/>
          <circle cx="610" cy="60" r="35"/>
          <circle cx="640" cy="70" r="25"/>
          <rect x="580" y="70" width="60" height="25" rx="10"/>
        </g>
        
        <!-- Water base -->
        <path d="M 0,220 Q 200,190 400,220 T 800,220 L 800,450 L 0,450 Z" fill="#0284c7" />
        <path d="M 0,245 Q 200,215 400,245 T 800,245 L 800,450 L 0,450 Z" fill="#0369a1" opacity="0.6" />
        
        <!-- Sailboat -->
        <g transform="translate(250, 140)">
          <path d="M 10,45 L 110,45 L 90,75 L 30,75 Z" fill="#d97706" />
          <line x1="60" y1="45" x2="60" y2="5" stroke="#78350f" stroke-width="4" />
          <polygon points="60,5 60,40 100,32" fill="#f8fafc" />
          <polygon points="60,5 60,40 25,28" fill="#f43f5e" />
        </g>
        
        <!-- Beautiful Fish -->
        <g transform="translate(520, 290)">
          <path d="M 20,10 C 40,-5 60,10 70,10 L 85,0 L 80,20 L 85,40 L 70,30 C 60,30 40,45 20,30 Z" fill="#fb923c" />
          <circle cx="35" cy="15" r="4" fill="white" />
          <circle cx="36" cy="15" r="2" fill="black" />
          <circle cx="10" cy="-5" r="5" fill="none" stroke="white" stroke-width="1.5" opacity="0.7"/>
          <circle cx="-5" cy="-20" r="7" fill="none" stroke="white" stroke-width="1.5" opacity="0.7"/>
        </g>

        <!-- Subtitle Box -->
        <rect x="50" y="340" width="700" height="75" fill="#0c4a6e" opacity="0.85" rx="15" stroke="#0284c7" stroke-width="2"/>
        <text x="50%" y="380" dominant-baseline="middle" text-anchor="middle" font-family="'Tajawal', sans-serif" font-size="24" font-weight="bold" fill="#f8fafc">${text}</text>
      </svg>
    `;
  }

  if (hasKeyword(natureKeywords)) {
    // Nature Theme (Sun, Trees, Garden)
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
        <!-- Sky -->
        <rect width="800" height="450" fill="#bae6fd" rx="20"/>
        
        <!-- Sun -->
        <circle cx="110" cy="110" r="45" fill="#fbcfe8" opacity="0.3" />
        <circle cx="110" cy="110" r="35" fill="#fef08a" />
        <g stroke="#eab308" stroke-width="3" stroke-linecap="round">
          <line x1="110" y1="60" x2="110" y2="45" />
          <line x1="110" y1="160" x2="110" y2="175" />
          <line x1="60" y1="110" x2="45" y2="110" />
          <line x1="160" y1="110" x2="175" y2="110" />
          <line x1="75" y1="75" x2="64" y2="64" />
          <line x1="145" y1="145" x2="156" y2="156" />
          <line x1="145" y1="75" x2="156" y2="64" />
          <line x1="75" y1="145" x2="64" y2="156" />
        </g>
        
        <!-- Clouds -->
        <g fill="#ffffff" opacity="0.9">
          <circle cx="640" cy="100" r="30"/>
          <circle cx="680" cy="85" r="40"/>
          <circle cx="720" cy="100" r="30"/>
          <rect x="640" y="100" width="80" height="30" rx="15"/>
        </g>

        <!-- Rolling Green Hills -->
        <path d="M -100,340 Q 200,270 500,340 T 900,320 L 900,450 L -100,450 Z" fill="#86efac" />
        <path d="M -50,365 Q 300,310 700,365 T 850,370 L 850,450 L -50,450 Z" fill="#4ade80" />

        <!-- Cute Tree -->
        <g transform="translate(560, 180)">
          <rect x="35" y="80" width="20" height="90" fill="#a16207" rx="3" />
          <circle cx="45" cy="60" r="50" fill="#15803d" />
          <circle cx="15" cy="45" r="40" fill="#16a34a" />
          <circle cx="75" cy="50" r="45" fill="#166534" />
          <!-- Apples -->
          <circle cx="15" cy="45" r="7" fill="#dc2626" />
          <circle cx="55" cy="30" r="7" fill="#dc2626" />
          <circle cx="60" cy="75" r="7" fill="#dc2626" />
        </g>

        <!-- Little Butterflies and Flowers -->
        <g transform="translate(180, 360)">
          <!-- Flower 1 -->
          <circle cx="50" cy="40" r="8" fill="#f43f5e"/>
          <circle cx="62" cy="48" r="8" fill="#f43f5e"/>
          <circle cx="38" cy="48" r="8" fill="#f43f5e"/>
          <circle cx="56" cy="60" r="8" fill="#f43f5e"/>
          <circle cx="44" cy="60" r="8" fill="#f43f5e"/>
          <circle cx="50" cy="50" r="6" fill="#fbbf24"/>
        </g>
        <g transform="translate(320, 370)">
          <!-- Flower 2 -->
          <circle cx="50" cy="40" r="8" fill="#a855f7"/>
          <circle cx="62" cy="48" r="8" fill="#a855f7"/>
          <circle cx="38" cy="48" r="8" fill="#a855f7"/>
          <circle cx="56" cy="60" r="8" fill="#a855f7"/>
          <circle cx="44" cy="60" r="8" fill="#a855f7"/>
          <circle cx="50" cy="50" r="6" fill="#fbbf24"/>
        </g>

        <!-- Subtitle Box -->
        <rect x="50" y="340" width="700" height="75" fill="#14532d" opacity="0.85" rx="15" stroke="#22c55e" stroke-width="2"/>
        <text x="50%" y="380" dominant-baseline="middle" text-anchor="middle" font-family="'Tajawal', sans-serif" font-size="24" font-weight="bold" fill="#f8fafc">${text}</text>
      </svg>
    `;
  }

  if (hasKeyword(houseKeywords)) {
    // House / Home Theme
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
        <!-- Ground -->
        <rect width="800" height="450" fill="#fef3c7" rx="20"/>
        
        <rect x="0" y="330" width="800" height="120" fill="#cbd5e1" />
        <rect x="0" y="325" width="800" height="8" fill="#4ade80" />

        <!-- Luminous Sun -->
        <circle cx="680" cy="90" r="30" fill="#fbbf24" filter="drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))" />
        
        <!-- Clouds -->
        <g fill="#ffffff" opacity="0.8">
          <circle cx="150" cy="80" r="25"/>
          <circle cx="180" cy="70" r="35"/>
          <circle cx="210" cy="80" r="25"/>
          <rect x="150" y="80" width="60" height="25" rx="10"/>
        </g>

        <!-- Beautiful Cartoon House -->
        <g transform="translate(250, 140)">
          <!-- Main wall -->
          <rect x="50" y="70" width="200" height="120" fill="#fecdd3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" rx="8" />
          
          <!-- Roof -->
          <polygon points="30,70 150,-5 270,70" fill="#ef4444" />
          
          <!-- Chimney -->
          <rect x="200" y="10" width="25" height="40" fill="#b91c1c" />
          <!-- Smoke -->
          <path d="M 212,0 C 205,-15 220,-30 210,-45 T 215,-70" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" opacity="0.6" />

          <!-- Main Door -->
          <rect x="125" y="120" width="50" height="70" fill="#78350f" rx="4" />
          <circle cx="165" cy="155" r="4.5" fill="#f59e0b" />

          <!-- Windows -->
          <rect x="75" y="95" width="35" height="35" fill="#93c5fd" stroke="#475569" stroke-width="2.5" rx="4" />
          <rect x="190" y="95" width="35" height="35" fill="#93c5fd" stroke="#475569" stroke-width="2.5" rx="4" />
        </g>

        <!-- Subtitle Box -->
        <rect x="50" y="340" width="700" height="75" fill="#4d1d1d" opacity="0.85" rx="15" stroke="#ef4444" stroke-width="2"/>
        <text x="50%" y="380" dominant-baseline="middle" text-anchor="middle" font-family="'Tajawal', sans-serif" font-size="24" font-weight="bold" fill="#f8fafc">${text}</text>
      </svg>
    `;
  }

  if (hasKeyword(schoolKeywords)) {
    // School / Classroom Chalkboard Theme
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
        <!-- Classroom Wall -->
        <rect width="800" height="450" fill="#334155" rx="20"/>
        
        <!-- Large Classroom Blackboard -->
        <rect x="50" y="40" width="700" height="280" fill="#047857" stroke="#78350f" stroke-width="14" rx="15" filter="drop-shadow(0 8px 12px rgba(0,0,0,0.4))" />
        
        <!-- Chalk Alphabet Layout -->
        <text x="400" y="100" font-family="'Tajawal', sans-serif" font-weight="bold" font-size="38" fill="#ffffff" opacity="0.85" text-anchor="middle">أ ب ت ث ج ح خ</text>
        
        <!-- Chalk Mathematical doodle -->
        <text x="180" y="180" font-family="'JetBrains Mono', monospace" font-size="24" fill="#a7f3d0" opacity="0.75">ا - ب - ج</text>
        <text x="180" y="230" font-family="'JetBrains Mono', monospace" font-size="26" fill="#a7f3d0" opacity="0.75">١ + ٢ = ٣</text>
        
        <!-- Chalk Drawing of an Apple/Smile -->
        <g transform="translate(560, 150)" opacity="0.75" stroke="#fef08a" stroke-width="3" fill="none">
          <circle cx="30" cy="30" r="25" />
          <path d="M 30,5 C 25,-10 15,-10 15,-10" stroke-linecap="round" />
          <!-- Leaf -->
          <path d="M 30,5 Q 40,-5 45,5 T 30,5" fill="#fef08a" />
          <!-- Small smiling face inside -->
          <circle cx="20" cy="25" r="2" fill="#fef08a" />
          <circle cx="40" cy="25" r="2" fill="#fef08a" />
          <path d="M 23,35 Q 30,40 37,35" />
        </g>

        <!-- Wooden shelf with chalk blocks at the bottom -->
        <rect x="300" y="313" width="200" height="7" fill="#d97706" rx="2" />
        <rect x="320" y="307" width="20" height="6" fill="#ffffff" rx="1" />
        <rect x="350" y="309" width="15" height="4" fill="#a7f3d0" rx="1" />

        <!-- Subtitle Box -->
        <rect x="50" y="340" width="700" height="75" fill="#1e293b" opacity="0.9" rx="15" stroke="#047857" stroke-width="2"/>
        <text x="50%" y="380" dominant-baseline="middle" text-anchor="middle" font-family="'Tajawal', sans-serif" font-size="24" font-weight="bold" fill="#f8fafc">${text}</text>
      </svg>
    `;
  }

  // 6. Generic Drawing Board Theme (Warm & Artistic with a big happy smiling star)
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
      <rect width="800" height="450" fill="#fafaf9" rx="20"/>
      <!-- Rainbow dashed border -->
      <rect x="20" y="20" width="760" height="410" fill="none" stroke="#22c55e" stroke-width="6" stroke-dasharray="12, 12" rx="15" opacity="0.6"/>
      <rect x="23" y="23" width="754" height="404" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="8, 20" rx="13" opacity="0.5"/>

      <!-- Clouds -->
      <g fill="#bae6fd" opacity="0.4">
        <circle cx="650" cy="80" r="30"/>
        <circle cx="690" cy="70" r="40"/>
        <circle cx="730" cy="80" r="30"/>
      </g>
      <g fill="#fdba74" opacity="0.3">
        <circle cx="120" cy="180" r="20"/>
        <circle cx="150" cy="170" r="30"/>
        <circle cx="180" cy="180" r="20"/>
      </g>

      <!-- Giant Happy Star -->
      <g transform="translate(0, -10)">
        <polygon points="400,100 422,150 477,153 435,190 448,245 400,215 352,245 365,190 323,153 378,150" fill="#fcd34d" stroke="#f59e0b" stroke-width="4" stroke-linejoin="round" />
        <!-- smiley face on starchild -->
        <circle cx="388" cy="170" r="4" fill="#451a03" />
        <circle cx="412" cy="170" r="4" fill="#451a03" />
        <path d="M 392,185 Q 400,195 408,185" fill="none" stroke="#451a03" stroke-width="3" stroke-linecap="round" />
        <!-- Pink cheeks -->
        <circle cx="382" cy="177" r="3" fill="#f43f5e" opacity="0.6" />
        <circle cx="418" cy="177" r="3" fill="#f43f5e" opacity="0.6" />
        <!-- sparkles -->
        <circle cx="465" cy="115" r="3" fill="#60a5fa" />
        <circle cx="320" cy="200" r="4" fill="#f472b6" />
        <circle cx="490" cy="210" r="3" fill="#34d399" />
        <circle cx="335" cy="100" r="3" fill="#fb923c" />
      </g>

      <!-- Subtitle Box -->
      <rect x="50" y="340" width="700" height="75" fill="#f5f5f4" opacity="0.95" rx="15" stroke="#d6d3d1" stroke-width="3"/>
      <text x="50%" y="380" dominant-baseline="middle" text-anchor="middle" font-family="'Tajawal', sans-serif" font-size="24" font-weight="bold" fill="#1c1917">${text}</text>
    </svg>
  `;
}

let globalQuotaExceeded = false;
let lastGlobalQuotaCheck = 0;

function checkExhausted(error: any) {
  const errMsg = String(error?.message || error).toLowerCase();
  if (
    errMsg.includes("429") ||
    errMsg.includes("quota") ||
    errMsg.includes("exhausted") ||
    errMsg.includes("rate limit") ||
    errMsg.includes("resource_exhausted") ||
    errMsg.includes("limit: 0")
  ) {
    globalQuotaExceeded = true;
    lastGlobalQuotaCheck = Date.now();
    console.warn("[Quota Monitor] Global API Key quota limit exceeded. Switching to instant local/offline mode for 5 minutes.");
  }
}

function isGlobalQuotaExceeded(): boolean {
  if (globalQuotaExceeded && (Date.now() - lastGlobalQuotaCheck < 5 * 60 * 1000)) {
    return true;
  }
  globalQuotaExceeded = false;
  return false;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limits for sending slice base64 images
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Helper function to get the current API key safely from header or environment
  const getAiClient = (req: express.Request) => {
    const customKey = req.headers['x-api-key']?.toString();
    if (customKey && customKey.trim()) {
      return {
        client: new GoogleGenAI({
          apiKey: customKey.trim(),
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        }),
        isCustom: true
      };
    }
    return {
      client: ai,
      isCustom: false
    };
  };

  // API 1: Process a single image slice (Vision + TTS)
  app.post("/api/process-slice", async (req, res) => {
    try {
      const { sliceBase64, voice } = req.body;
      if (!sliceBase64) {
        return res.status(400).json({ error: "مفقود base64 للصورة" });
      }

      const { client, isCustom } = getAiClient(req);
      const skipToLocal = !isCustom && isGlobalQuotaExceeded();

      let extractedText = 'مشهد صامت';
      let audioBase64 = null;
      let audioSource = 'gemini';

      if (skipToLocal) {
        extractedText = `البطاقة المصورة رقم ${Math.floor(Math.random() * 20) + 1}`;
        audioSource = 'local';
      } else {
        // 1. Text extraction and description using gemini-3.5-flash
        try {
          const visionResp = await client.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: [
              { text: 'اقرأ النص الموجود في هذه الصورة بدقة. إذا لم يكن هناك نص، صف المشهد بجملة واحدة قصيرة بأسلوب قصصي باللغة العربية.' },
              { inlineData: { mimeType: 'image/jpeg', data: sliceBase64 } }
            ]
          });
          extractedText = visionResp.text?.trim() || 'مشهد صامت';
        } catch (visionError: any) {
          if (!isCustom) {
            checkExhausted(visionError);
          }
          console.warn("[Vision non-critical warning] Failover to local text triggered. Detail:", visionError.message || visionError);
          extractedText = `البطاقة المصورة رقم ${Math.floor(Math.random() * 20) + 1}`;
        }

        // 2. Generate Audio Narration using gemini-3.1-flash-tts-preview
        if (audioSource !== 'local') {
          try {
            const audioResp = await client.models.generateContent({
              model: 'gemini-3.1-flash-tts-preview',
              contents: [{ parts: [{ text: extractedText }] }],
              config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voice || 'Puck' }
                  }
                }
              }
            });
            audioBase64 = audioResp.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
          } catch (audioError: any) {
            if (!isCustom) {
              checkExhausted(audioError);
            }
            console.warn("[TTS non-critical warning] Failover to local speech synthesizer fallback. Detail:", audioError.message || audioError);
            audioSource = 'local';
          }
        }
      }

      res.json({
        text: extractedText,
        audio: audioBase64,
        audioSource
      });

    } catch (error: any) {
      console.warn("[Process-slice failover logic] Returning non-crashing elegant slice result:", error?.message || error);
      res.json({
        text: `بطاقة مصورة تفاعلية مدمجة`,
        audio: null,
        audioSource: 'local'
      });
    }
  });

  // API 2: Split story into scenes using Gemini 3.5-flash
  app.post("/api/split-story", async (req, res) => {
    const { story } = req.body;
    if (!story) {
      return res.status(400).json({ error: "القصة فارغة" });
    }
    try {
      const { client, isCustom } = getAiClient(req);
      let scenes: string[] = [];
      const skipToLocal = !isCustom && isGlobalQuotaExceeded();

      if (skipToLocal) {
        scenes = story.split(/[.،؛؛\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 3).slice(0, 5);
      } else {
        try {
          const splitPrompt = `قم بتحليل هذه القصة: "${story}".
المهمة: قسم القصة إلى 5 مشاهد قصيرة جداً ومناسبة للأطفال (بحد أقصى 5 كلمات للمشهد لكي يسهل فهمها وقراءتها).
يجب أن يكون الرد عبارة عن مصفوفة JSON تحتوي فقط على 5 نصوص قصيرة باللغة العربية ولا تحتوي على أي نص إضافي خارج الصيغة.
مثال: ["يطير التنين عالياً", "يبحث عن الكهف", "يجد كنزاً سحرياً", "يفرح بجمال المكان", "يعود سعيداً لأهله"]`;

          const splitResp = await client.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: splitPrompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "مصفوفة من 5 مشاهد قصيرة باللغة العربية"
              }
            }
          });

          const responseText = splitResp.text?.trim() || "[]";
          try {
            scenes = JSON.parse(responseText);
          } catch (parseError) {
            scenes = story.split(/[.،؛؛\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 3).slice(0, 5);
          }
        } catch (geminiError: any) {
          if (!isCustom) {
            checkExhausted(geminiError);
          }
          console.warn("[Split-story non-critical warning] Offline splitter fall back due to:", geminiError.message || geminiError);
          scenes = story.split(/[.،؛؛\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 3).slice(0, 5);
        }
      }

      if (!scenes || scenes.length === 0) {
        scenes = story.split(/[.،؟؛\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 3).slice(0, 5);
      }
      if (scenes.length === 0) {
        scenes = [story];
      }

      res.json({ scenes });

    } catch (error: any) {
      console.warn("[Split story error fallback] Failover triggered:", error?.message || error);
      const fallbackScenes = story.split(/[.،؟؛\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 3).slice(0, 5);
      res.json({ scenes: fallbackScenes.length > 0 ? fallbackScenes : [story] });
    }
  });

  // API 3: Generate single story scene assets (Image via Imagen + TTS)
  app.post("/api/generate-scene-assets", async (req, res) => {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ error: "النص مفقود" });
    }
    try {
      const { client, isCustom } = getAiClient(req);

      let imgBase64 = null;
      let imgMethodUsed = 'gemini-2.5-flash-image';
      const skipToLocal = !isCustom && isGlobalQuotaExceeded();

      if (skipToLocal) {
        imgMethodUsed = 'svg-static';
        const fallbackSvg = generateLocalArtSvg(text);
        const base64Bytes = Buffer.from(fallbackSvg.trim(), "utf-8").toString("base64");
        imgBase64 = `data:image/svg+xml;base64,${base64Bytes}`;
      } else {
        // Try Layer 1: Try gemini-2.5-flash-image (General Image Generation and Editing)
        try {
          const imagePrompt = `Educational child illustration, simple cute cartoon style, warm colors: ${text}`;
          const imgResp = await client.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: imagePrompt }] },
            config: { imageConfig: { aspectRatio: '16:9' } }
          });
          
          const parts = imgResp.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              const mimeType = part.inlineData.mimeType || 'image/png';
              imgBase64 = `data:${mimeType};base64,${part.inlineData.data}`;
              imgMethodUsed = 'gemini-2.5-flash-image';
              break;
            }
          }
        } catch (imgError: any) {
          if (!isCustom) {
            checkExhausted(imgError);
          }
          console.warn("[Image Layer 1 warning] failing over to Layer 2 because:", imgError.message || imgError);
          
          // Try Layer 2: Try gemini-3.1-flash-image (High Quality Image)
          try {
            const imagePrompt = `Educational child illustration, simple cute cartoon style, warm colors: ${text}`;
            const imgResp = await client.models.generateContent({
              model: 'gemini-3.1-flash-image',
              contents: { parts: [{ text: imagePrompt }] },
              config: { imageConfig: { aspectRatio: '16:9' } }
            });
            
            const parts = imgResp.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                imgBase64 = `data:${mimeType};base64,${part.inlineData.data}`;
                imgMethodUsed = 'gemini-3.1-flash-image';
                break;
              }
            }
          } catch (img3Error: any) {
            if (!isCustom) {
              checkExhausted(img3Error);
            }
            console.warn("[Image Layer 2 warning] failing over to Layer 3 (Dynamic SVG) because:", img3Error.message || img3Error);
            
            // Try Layer 3: Dynamic SVG via gemini-3.5-flash
            try {
              const svgPrompt = `يمكنك رسم وتصميم رسمة كرتونية متكاملة للأطفال بلغة SVG.
موضوع الرسمة هو المشهد التالي: "${text}"
المطلوب:
كتابة كود SVG كامل ومنسق وجميل جداً ومفعم بالألوان الزاهية ليمثل هذا المشهد التعليمي (يفضل استخدام مساحة عرض viewBox="0 0 800 450").
ارسم عناصر خلابة مثل شخصيات كرتونية مبسطة، حيوانات، أشجار، سماء، شمس صفراء، غيوم، جبال، بحار، أو عناصر مدرسة حسب موضوع المشهد.
شروط هامة جداً:
1. يجب أن يبدأ الرد بـ <svg ويكون كود SVG صالحاً تماماً.
2. لا تضعه داخل بلوكات كود الماركداون (لا تكتب \`\`\`svg أو \`\`\`xml). أرسل النص البرمجي الصافي مباشرة.
3. لا تكتب أي كلام توضيحي، لا عربي ولا إنجليزي، فقط كود الـ SVG الصافي والكامل من البداية للنهاية.
4. اجعل الأشكال كرتونية وواضحة جداً وجذابة لطلاب المدارس والأطفال.`;

              const svgResp = await client.models.generateContent({
                model: 'gemini-3.5-flash',
                contents: svgPrompt
              });

              let svgCode = svgResp.text?.trim() || "";
              if (svgCode.startsWith("```")) {
                svgCode = svgCode.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").trim();
              }
              
              if (svgCode.includes("<svg") && svgCode.includes("</svg>")) {
                const base64Bytes = Buffer.from(svgCode, "utf-8").toString("base64");
                imgBase64 = `data:image/svg+xml;base64,${base64Bytes}`;
                imgMethodUsed = 'svg-dynamic';
              } else {
                throw new Error("Invalid SVG generated from Gemini");
              }
            } catch (svgErr: any) {
              if (!isCustom) {
                checkExhausted(svgErr);
              }
              console.warn("[Image Layer 3 warning] failing over to local static SVG:", svgErr.message || svgErr);
              imgMethodUsed = 'svg-static';
              const fallbackSvg = generateLocalArtSvg(text);
              const base64Bytes = Buffer.from(fallbackSvg.trim(), "utf-8").toString("base64");
              imgBase64 = `data:image/svg+xml;base64,${base64Bytes}`;
            }
          }
        }
      }

      // Generate Audio Narration
      let audioBase64 = null;
      let audioSource = 'gemini';
      if (!skipToLocal) {
        try {
          const audioResp = await client.models.generateContent({
            model: 'gemini-3.1-flash-tts-preview',
            contents: [{ parts: [{ text: text }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voice || 'Puck' }
                }
              }
            }
          });
          audioBase64 = audioResp.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
        } catch (audioError: any) {
          if (!isCustom) {
            checkExhausted(audioError);
          }
          console.warn("[TTS warning] Falling back to browser speech synthesis. Detail:", audioError.message || audioError);
          audioSource = 'local';
        }
      } else {
        audioSource = 'local';
      }

      res.json({
        img: imgBase64,
        audio: audioBase64,
        imgMethodUsed,
        audioSource
      });

    } catch (error: any) {
      console.warn("[Scene-assets global error fallback] Triggering static local response:", error?.message || error);
      const fallbackSvg = generateLocalArtSvg(text);
      const base64Bytes = Buffer.from(fallbackSvg.trim(), "utf-8").toString("base64");
      res.json({
        img: `data:image/svg+xml;base64,${base64Bytes}`,
        audio: null,
        imgMethodUsed: 'svg-static',
        audioSource: 'local'
      });
    }
  });

  // Serve Vite in development, static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Magic Studio] Server is happily running on http://localhost:${PORT}`);
  });
}

startServer();
