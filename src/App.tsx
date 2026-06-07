import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  Play, 
  Pause, 
  Save, 
  Download, 
  Trash2, 
  Settings, 
  BookOpen, 
  ArrowRight, 
  Image as ImageIcon, 
  Undo2, 
  RefreshCw, 
  Volume2, 
  VolumeX,
  FileText,
  AlertTriangle,
  Grid
} from 'lucide-react';

const IndexedDBName = "TeacherStudioDB";
const StoreName = "movies";

// Helper to convert base64 to WAV Blob URL
function pcmToWavUrl(b64: string, sr: number = 24000): string {
  try {
    const pcm = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
    const h = new ArrayBuffer(44);
    const v = new DataView(h);
    v.setUint32(0, 0x52494646, false); 
    v.setUint32(4, 36 + pcm.byteLength, true); 
    v.setUint32(8, 0x57415645, false);
    v.setUint32(12, 0x666d7420, false); 
    v.setUint32(16, 16, true); 
    v.setUint16(20, 1, true); 
    v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); 
    v.setUint32(28, sr * 2, true); 
    v.setUint16(32, 2, true); 
    v.setUint16(34, 16, true);
    v.setUint32(36, 0x64617461, false); 
    v.setUint32(40, pcm.byteLength, true);
    
    const blob = new Blob([h, pcm], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Failed to compile PCM to WAV", error);
    return "";
  }
}

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
        <path d="M -50,365 Q 300,310 700,365 T 850,370 L 850,450 L -50,455 Z" fill="#4ade80" />

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

interface Scene {
  img: string;
  text: string;
  audio?: string | null;
  audioSource?: string;
  imgMethodUsed?: string;
}

interface Lesson {
  id: string;
  title: string;
  type: 'story' | 'image';
  scenes: Scene[];
  createdAt: number;
}

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'story-mode' | 'image-mode' | 'player' | 'gallery' | 'settings'>('home');
  
  // State for modes
  const [storyText, setStoryText] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Configuration
  const [settings, setSettings] = useState({
    cols: 2,
    rows: 2,
    voice: 'Puck',
    duration: 8,
    transition: 'zoom'
  });

  const [loading, setLoading] = useState({ active: false, text: '' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Active movie being played
  const [currentMovie, setCurrentMovie] = useState<Lesson | null>(null);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [playerIsPlaying, setPlayerIsPlaying] = useState(false);
  const [playerAudio, setPlayerAudio] = useState<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [savedLessons, setSavedLessons] = useState<Lesson[]>([]);

  const [localModeActive, setLocalModeActive] = useState<boolean>(() => {
    return localStorage.getItem('local_mode_active') === 'true';
  });

  const toggleLocalMode = () => {
    setLocalModeActive(prev => {
      const next = !prev;
      localStorage.setItem('local_mode_active', String(next));
      if (next) {
        showToast("💡 تم تفعيل وضع معالجة المشاهد المحلي السريع!");
      } else {
        showToast("🚀 تم تشغيل الاعتماد على الذكاء الاصطناعي السحابي.");
      }
      return next;
    });
  };

  // Refs for uploads and audio
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize DB and load lessons
  useEffect(() => {
    initDB();
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // IndexedDB operations
  const initDB = () => {
    const request = indexedDB.open(IndexedDBName, 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(StoreName)) {
        db.createObjectStore(StoreName, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => {
      loadLessonsFromDB();
    };
    request.onerror = (e) => {
      console.error("IndexedDB error", e);
    };
  };

  const loadLessonsFromDB = () => {
    const request = indexedDB.open(IndexedDBName, 1);
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction(StoreName, 'readonly');
      const store = tx.objectStore(StoreName);
      const getReq = store.getAll();
      getReq.onsuccess = () => {
        const sorted = (getReq.result as Lesson[]).sort((a, b) => b.createdAt - a.createdAt);
        setSavedLessons(sorted);
      };
    };
  };

  const saveLessonToDB = (lesson: Lesson) => {
    const request = indexedDB.open(IndexedDBName, 1);
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction(StoreName, 'readwrite');
      const store = tx.objectStore(StoreName);
      const putReq = store.put(lesson);
      putReq.onsuccess = () => {
        showToast("✓ تم حفظ الدرس بنجاح في المكتبة المحلية!");
        loadLessonsFromDB();
      };
      putReq.onerror = () => {
        showToast("✗ فشل اللحفظ في المكتبة", "error");
      };
    };
  };

  const deleteLessonFromDB = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("هل أنت متأكد من حذف هذا الدرس بشكل نهائي؟")) return;

    const request = indexedDB.open(IndexedDBName, 1);
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction(StoreName, 'readwrite');
      const store = tx.objectStore(StoreName);
      const delReq = store.delete(id);
      delReq.onsuccess = () => {
        showToast("✓ تم إزالة الدرس بنجاح");
        loadLessonsFromDB();
      };
    };
  };

  // 1. Image Slicing Mode Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageMode = async () => {
    if (!uploadedImage) {
      showToast("برجاء رفع أو اختيار صورة أولاً", "error");
      return;
    }
    const title = imageTitle.trim() || 'درس تفاعلي مصور';

    const runLocalOfflineImageGen = async () => {
      showToast("💡 تم الاستمرار بوضع التقطيع والنطق المحلي فائق السرعة!", "success");
      setLoading({ active: true, text: 'جاري تقطيع وتلوين المربعات محلياً بذكاء ثواني...' });
      try {
        const img = new Image();
        img.src = uploadedImage;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const cols = settings.cols;
        const rows = settings.rows;
        const total = cols * rows;
        const pw = img.width / cols;
        const ph = img.height / rows;

        const canvas = document.createElement('canvas');
        canvas.width = pw;
        canvas.height = ph;
        const ctx = canvas.getContext('2d');

        const generatedScenes: Scene[] = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            ctx?.clearRect(0, 0, pw, ph);
            ctx?.drawImage(img, c * pw, r * ph, pw, ph, 0, 0, pw, ph);
            const sliceDataUrl = canvas.toDataURL('image/jpeg', 0.85);

            generatedScenes.push({
              img: sliceDataUrl,
              text: `البطاقة المصورة رقم ${idx + 1} - شرح تفاعلي ذاتي`,
              audio: null,
              audioSource: 'local',
              imgMethodUsed: 'slice'
            });
          }
        }

        const newLesson: Lesson = {
          id: Date.now().toString(),
          title,
          type: 'image',
          scenes: generatedScenes,
          createdAt: Date.now()
        };

        setCurrentMovie(newLesson);
        setPlayerIndex(0);
        setIsEnded(false);
        setPlayerIsPlaying(true);
        setActiveView('player');
      } catch (e: any) {
        showToast("خطأ في معالجة الصور المحلية: " + e.message, "error");
      } finally {
        setLoading({ active: false, text: '' });
      }
    };

    if (localModeActive) {
      await runLocalOfflineImageGen();
      return;
    }

    setLoading({ active: true, text: 'جاري البدء في تقطيع وتحليل الصورة...' });

    try {
      const img = new Image();
      img.src = uploadedImage;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const cols = settings.cols;
      const rows = settings.rows;
      const total = cols * rows;
      const pw = img.width / cols;
      const ph = img.height / rows;

      const canvas = document.createElement('canvas');
      canvas.width = pw;
      canvas.height = ph;
      const ctx = canvas.getContext('2d');

      const generatedScenes: Scene[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          setLoading({ active: true, text: `جاري تحليل وتقطيع المربع ${idx + 1} من ${total}...` });

          ctx?.clearRect(0, 0, pw, ph);
          ctx?.drawImage(img, c * pw, r * ph, pw, ph, 0, 0, pw, ph);

          const sliceDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          const sliceBase64 = sliceDataUrl.split(',')[1];

          // Call Express backend endpoint
          const res = await fetch('/api/process-slice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-api-key': localStorage.getItem('gemini_api_key') || ''
            },
            body: JSON.stringify({ sliceBase64, voice: settings.voice })
          });

          if (!res.ok) {
            const errJson = await res.json();
            throw new Error(errJson.error || `خطأ في المعالجة للمربع ${idx + 1}`);
          }

          const sceneData = await res.json();
          generatedScenes.push({
            img: sliceDataUrl,
            text: sceneData.text,
            audio: sceneData.audio,
            audioSource: sceneData.audioSource || 'gemini',
            imgMethodUsed: sceneData.imgMethodUsed || 'image'
          });
        }
      }

      const newLesson: Lesson = {
        id: Date.now().toString(),
        title,
        type: 'image',
        scenes: generatedScenes,
        createdAt: Date.now()
      };

      setCurrentMovie(newLesson);
      setPlayerIndex(0);
      setIsEnded(false);
      setPlayerIsPlaying(true);
      setActiveView('player');

    } catch (error: any) {
      console.warn("Global image processing failed or quota hit, reverting to local offline slicer", error);
      showToast("⚠️ تم بلوغ حد استهلاك الـ API السحابي! تم تحويل معالجة وتقطيع الصورة إلى الوضع المحلي فائق السرعة تلقائياً لمواصلة عملك.", "success");
      await runLocalOfflineImageGen();
    } finally {
      setLoading({ active: false, text: '' });
    }
  };

  // 2. Story Mode Handler
  const processStoryMode = async () => {
    const text = storyText.trim();
    if (!text) {
      showToast("برجاء كتابة القصة أو النص أولاً", "error");
      return;
    }
    const title = storyTitle.trim() || 'قصة تربوية سحرية';

    // Fully local offline story generator on quota/failures or if switched on
    const runLocalOfflineStoryGen = () => {
      showToast("💡 تم تشكيل الدرس والرسوم التوضيحية أوفلاين لتسريع العرض وتخطي الكوتا للذكاء الاصطناعي!", "success");
      setLoading({ active: true, text: 'جاري إنشاء فصول القصة ورسم المشاهد أوفلاين...' });
      
      const sceneTexts = text.split(/[.،؛؟\n]+/).map(s => s.trim()).filter(s => s.length > 3).slice(0, 5);
      if (sceneTexts.length === 0) {
        sceneTexts.push(text.substring(0, 50));
      }

      const generatedScenes: Scene[] = sceneTexts.map((sceneText) => {
        const svgMarkup = generateLocalArtSvg(sceneText);
        const base64 = btoa(unescape(encodeURIComponent(svgMarkup.trim())));
        return {
          img: `data:image/svg+xml;base64,${base64}`,
          text: sceneText,
          audio: null,
          audioSource: 'local',
          imgMethodUsed: 'svg-local-offline'
        };
      });

      const newLesson: Lesson = {
        id: Date.now().toString(),
        title,
        type: 'story',
        scenes: generatedScenes,
        createdAt: Date.now()
      };

      setCurrentMovie(newLesson);
      setPlayerIndex(0);
      setIsEnded(false);
      setPlayerIsPlaying(true);
      setActiveView('player');
      setLoading({ active: false, text: '' });
    };

    if (localModeActive) {
      runLocalOfflineStoryGen();
      return;
    }

    setLoading({ active: true, text: 'جاري تقسيم النص إلى مشاهد طفولية قصيرة...' });

    try {
      // 1. Get Split text scenes from express backend
      const splitRes = await fetch('/api/split-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-api-key': localStorage.getItem('gemini_api_key') || ''
        },
        body: JSON.stringify({ story: text })
      });

      if (!splitRes.ok) {
        const errJson = await splitRes.json();
        throw new Error(errJson.error || "خطأ أثناء محاولة تقسيم القصة");
      }

      const splitResData = await splitRes.json();
      const sceneTexts = splitResData.scenes || [];
      const generatedScenes: Scene[] = [];

      // 2. Generate assets sequentially
      for (let i = 0; i < sceneTexts.length; i++) {
        const sceneText = sceneTexts[i];
        setLoading({ 
          active: true, 
          text: `رسم المشهد التعليمي وتوليف الصوت للمشهد ${i + 1} من ${sceneTexts.length}...` 
        });

        try {
          const assetsRes = await fetch('/api/generate-scene-assets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-api-key': localStorage.getItem('gemini_api_key') || ''
            },
            body: JSON.stringify({ text: sceneText, voice: settings.voice })
          });

          if (!assetsRes.ok) {
            const errJson = await assetsRes.json();
            throw new Error(errJson.error || `فشل توليد محتوى المشهد رقم ${i + 1}`);
          }

          const sceneAssets = await assetsRes.json();
          generatedScenes.push({
            img: sceneAssets.img,
            text: sceneText,
            audio: sceneAssets.audio,
            audioSource: sceneAssets.audioSource || 'gemini',
            imgMethodUsed: sceneAssets.imgMethodUsed || 'imagen'
          });
        } catch (innerError) {
          console.warn(`Asset generation failed for scene ${i + 1}, using elegant local vector fallback`, innerError);
          const svgMarkup = generateLocalArtSvg(sceneText);
          const base64 = btoa(unescape(encodeURIComponent(svgMarkup.trim())));
          generatedScenes.push({
            img: `data:image/svg+xml;base64,${base64}`,
            text: sceneText,
            audio: null,
            audioSource: 'local',
            imgMethodUsed: 'svg-local-offline'
          });
        }
      }

      const newLesson: Lesson = {
        id: Date.now().toString(),
        title,
        type: 'story',
        scenes: generatedScenes,
        createdAt: Date.now()
      };

      setCurrentMovie(newLesson);
      setPlayerIndex(0);
      setIsEnded(false);
      setPlayerIsPlaying(true);
      setActiveView('player');

    } catch (error: any) {
      console.warn("Story generation failed globally, reverting automatically to local offline mode", error);
      showToast("⚠️ تم تجاوز حدود كوتا الذكاء الاصطناعي السحابية! تم تفعيل الرسام الصامت المدمج أوفلاين والتعليق الصوتي المباشر لجهازك تلقائياً.", "success");
      runLocalOfflineStoryGen();
    } finally {
      setLoading({ active: false, text: '' });
    }
  };

  // Playback state synchronization
  useEffect(() => {
    if (activeView === 'player' && currentMovie && playerIsPlaying && !isEnded) {
      const scene = currentMovie.scenes[playerIndex];
      
      if (playerAudio) {
        playerAudio.pause();
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      let audioObj: HTMLAudioElement | null = null;
      if (scene.audio && !isMuted) {
        const playUrl = pcmToWavUrl(scene.audio);
        audioObj = new Audio(playUrl);
        setPlayerAudio(audioObj);
        audioObj.play().catch(e => {
          console.log("Audio failed to play, falling back to browser Speech Synthesis", e);
          playSpeechSynthesisFallback();
        });

        audioObj.onended = () => {
          timerRef.current = setTimeout(() => {
            advancePlayer();
          }, 800);
        };
      } else if (!isMuted) {
        // Fallback to local browser speech synthesis so the narrator voice is never lost!
        playSpeechSynthesisFallback();
      } else {
        // Fallback timed transition when muted
        timerRef.current = setTimeout(() => {
          advancePlayer();
        }, settings.duration * 1000);
      }

      function playSpeechSynthesisFallback() {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
          timerRef.current = setTimeout(() => {
            advancePlayer();
          }, settings.duration * 1000);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(scene.text);
        utterance.lang = 'ar';
        
        // Find best Arabic voice
        const voices = window.speechSynthesis.getVoices();
        const arVoice = voices.find(v => v.lang.startsWith('ar'));
        if (arVoice) {
          utterance.voice = arVoice;
        }

        // Apply style characteristics for custom voice configurations
        if (settings.voice === 'Puck') {
          utterance.rate = 1.15;
          utterance.pitch = 1.25;
        } else if (settings.voice === 'Charon') {
          utterance.rate = 0.85;
          utterance.pitch = 0.95;
        } else if (settings.voice === 'Fenrir') {
          utterance.rate = 0.95;
          utterance.pitch = 0.85;
        } else {
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
        }

        utterance.onend = () => {
          timerRef.current = setTimeout(() => {
            advancePlayer();
          }, 800);
        };

        utterance.onerror = (e) => {
          console.error("Local speech synthesis failed, continuing on duration fallback", e);
          timerRef.current = setTimeout(() => {
            advancePlayer();
          }, settings.duration * 1000);
        };

        window.speechSynthesis.speak(utterance);
      }

      return () => {
        if (audioObj) {
          audioObj.pause();
        }
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [activeView, currentMovie, playerIndex, playerIsPlaying, isMuted, isEnded]);

  const advancePlayer = () => {
    if (!currentMovie) return;
    if (playerIndex < currentMovie.scenes.length - 1) {
      setPlayerIndex(prev => prev + 1);
    } else {
      setIsEnded(true);
      setPlayerIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isEnded) {
      setPlayerIndex(0);
      setIsEnded(false);
      setPlayerIsPlaying(true);
    } else {
      const targetPlaying = !playerIsPlaying;
      setPlayerIsPlaying(targetPlaying);
      if (playerAudio) {
        if (!targetPlaying) {
          playerAudio.pause();
        } else {
          playerAudio.play().catch(e => console.log(e));
        }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (!targetPlaying) {
          window.speechSynthesis.pause();
        } else {
          window.speechSynthesis.resume();
        }
      }
    }
  };

  const stopPlayerContext = () => {
    setPlayerIsPlaying(false);
    if (playerAudio) {
      playerAudio.pause();
      setPlayerAudio(null);
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Download all assets helper
  const triggerAssetsDownload = () => {
    if (!currentMovie) return;
    showToast("جاري إعداد محتويات العرض للتصدير في جهازك...");

    currentMovie.scenes.forEach((scene, index) => {
      // 1. Download image
      const imgLink = document.createElement('a');
      imgLink.href = scene.img;
      imgLink.download = `${currentMovie.title} - مشهد ${index + 1}.png`;
      document.body.appendChild(imgLink);
      imgLink.click();
      document.body.removeChild(imgLink);

      // 2. Download audio if exists
      if (scene.audio) {
        const audioUrl = pcmToWavUrl(scene.audio);
        const audLink = document.createElement('a');
        audLink.href = audioUrl;
        audLink.download = `${currentMovie.title} - تعليق صوتي ${index + 1}.wav`;
        document.body.appendChild(audLink);
        audLink.click();
        document.body.removeChild(audLink);
      }
    });

    showToast("✓ تم تنزيل كافة الصور والتعليقات الصوتية بنجاح!");
  };

  // Settings
  const saveCustomSettingsKey = () => {
    const keyInput = (document.getElementById('custom-key-field') as HTMLInputElement)?.value.trim();
    if (keyInput) {
      localStorage.setItem('gemini_api_key', keyInput);
      showToast("✓ تم حفظ مفتاح API المخصص المرفق لتجاوز أي مشاكل.");
    } else {
      localStorage.removeItem('gemini_api_key');
      showToast("تم العودة إلى استخدام مفتاح المنصة التلقائي الافتراضي.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-teal-500/30 selection:text-teal-300" dir="rtl">
      
      {/* Top Professional Navigation header */}
      <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => { stopPlayerContext(); setActiveView('home'); }}>
          <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-600/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-purple-400 via-indigo-300 to-teal-400 bg-clip-text text-transparent">منصة المعلم المبدع</h1>
            <p className="text-xs text-slate-400 font-medium">أداة صناعة الأفلام التعليمية بالذكاء الاصطناعي</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Persistent Local Mode Switch */}
          <div className="flex items-center gap-2.5 bg-slate-950/50 hover:bg-slate-950/80 border border-white/5 hover:border-white/10 py-1.5 px-3.5 rounded-2xl transition shadow-inner">
            <span className={`w-2 h-2 rounded-full ${localModeActive ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse' : 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]'}`} />
            <span className="text-xs font-bold text-slate-300">
              {localModeActive ? "الوضع المحلي (تجاوز الكوتا)" : "وضع الذكاء السحابي"}
            </span>
            <button 
              type="button"
              onClick={toggleLocalMode}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${localModeActive ? 'bg-amber-500' : 'bg-slate-700'}`}
            >
              <span
                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${localModeActive ? '-translate-x-3.5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          <div className="flex items-center gap-3">
          <button 
            onClick={() => { stopPlayerContext(); setActiveView('gallery'); }} 
            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition ${activeView === 'gallery' ? 'bg-indigo-600 text-white shadow-indigo-600/30' : 'bg-white/5 hover:bg-white/10 text-slate-200'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">مكتبة الدروس</span>
          </button>
          
          <button 
            onClick={() => { stopPlayerContext(); setActiveView('settings'); }} 
            className={`p-2.5 rounded-xl transition ${activeView === 'settings' ? 'bg-teal-600 text-white shadow-teal-600/30' : 'bg-white/5 hover:bg-white/10 text-slate-200'}`}
            title="الإعدادات ومفتاح التحكم"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>

      {/* Elegant floating toast notice */}
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3.5 rounded-2xl font-bold shadow-2xl text-center backdrop-blur-md z-50 transform animate-in slide-in-from-top-6 duration-300 ${toast.type === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'}`}>
          {toast.msg}
        </div>
      )}

      {/* Main interactive grid system */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* VIEW 1: HOME */}
        {activeView === 'home' && (
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">ابنِ درساً تفاعلياً <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">بأعلى وضوح</span></h2>
              <p className="text-lg text-slate-400 leading-relaxed">حوّل الأفكار والنصوص أو الصور والمراجعات المطبوعة إلى أفلام كرتونية ناطقة غامرة بالمشاهد التوضيحية لشد انتباه طلابك.</p>
              <div className="flex justify-center gap-2 text-sm text-yellow-400 font-bold bg-yellow-400/5 py-2 px-4 rounded-full w-fit mx-auto border border-yellow-400/20">
                <span>✨</span>
                <span>إبداعية خاصة بطلاب المعلم المتميز أ. مصطفى عبد العال دحروج</span>
              </div>
            </div>

            {/* Elegant Local Mode Promo Card */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/15 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-5 max-w-3xl mx-auto shadow-inner">
              <div className="flex items-center gap-4 text-right">
                <div className="bg-amber-500/10 text-amber-400 p-3 rounded-2xl shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm md:text-base">تم ترقية نظام التشغيل المحلي وتجاوز كوتا الذكاء الاصطناعي بنجاح!</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    إذا نفدت طاقة مفتاح API المجاني أو ظهرت لك أخطاء الاستهلاك (429)، قم بتفعيل <strong className="text-amber-400">"الوضع المحلي"</strong> من الشريط العلوي لتشغيل التقطيع والرسم والتعليق الصوتي المباشر أوفلاين دون إنترنت أو حدود استهلاك سحابية!
                  </p>
                </div>
              </div>
              <button 
                onClick={toggleLocalMode} 
                className={`px-5 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all ${localModeActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30' : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30'}`}
              >
                {localModeActive ? 'تعطيل الوضع المحلي' : 'تفعيل الوضع المحلي الآن'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-6">
              {/* Story Transformation Card */}
              <div 
                onClick={() => setActiveView('story-mode')} 
                className="group relative bg-gradient-to-b from-slate-900 to-slate-900/50 hover:from-indigo-950/20 hover:to-indigo-950/5 p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 cursor-pointer shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1.5"
              >
                <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-indigo-300 flex items-center gap-2">
                  تحويل قصة أو موضوع إلى مشاهد كرتونية
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2.5 py-1 rounded-full">توليد شامل</span>
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">اكتب قصة خيالية أو مفهوماً علمياً، والذكاء الاصطناعي سيقوم تلقائياً بتفكيكها إلى 5 مشاهد، ورسم صورة 3D خلابة وتأليف الراوي الصوتي لكل مشهد!</p>
              </div>

              {/* Image Split Card */}
              <div 
                onClick={() => setActiveView('image-mode')} 
                className="group relative bg-gradient-to-b from-slate-900 to-slate-900/50 hover:from-teal-950/20 hover:to-teal-950/5 p-8 rounded-3xl border border-white/5 hover:border-teal-500/30 cursor-pointer shadow-xl hover:shadow-teal-500/10 transition-all duration-300 transform hover:-translate-y-1.5"
              >
                <div className="w-14 h-14 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Grid className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-teal-300 flex items-center gap-2">
                  تقطيع وتحليل صورة تعليمية تفصيلية
                  <span className="text-xs bg-teal-500/20 text-teal-300 font-semibold px-2.5 py-1 rounded-full">تحليل ذكي</span>
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">ارفع أي صورة (خريطة جغرافية، رسومات للأطفال، ملصقات تعليمية)، وقم بتقطيعها لمصفوفة تفاعلية، وسيقوم الرائد بالتعرف على النص والمحتوى ليرويه بصوته السحري!</p>
              </div>
            </div>

            {/* Quick Gallery Preview Section if exists */}
            {savedLessons.length > 0 && (
              <div className="space-y-4 pt-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="text-xl font-bold text-slate-200">آخر الدروس المحفوظة في مكتبتك</h3>
                  <button onClick={() => setActiveView('gallery')} className="text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">عرض الكل <span>←</span></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {savedLessons.slice(0, 3).map((lesson) => (
                    <div 
                      key={lesson.id} 
                      onClick={() => { setCurrentMovie(lesson); setPlayerIndex(0); setIsEnded(false); setPlayerIsPlaying(true); setActiveView('player'); }}
                      className="group cursor-pointer bg-slate-900/40 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all shadow-md"
                    >
                      <div className="aspect-video relative overflow-hidden bg-slate-950">
                        <img src={lesson.scenes[0]?.img} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full text-white ${lesson.type === 'image' ? 'bg-teal-600' : 'bg-indigo-600'}`}>
                          {lesson.type === 'image' ? 'درس مصوّر' : 'قصة ذكية'}
                        </span>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <span className="font-bold text-slate-200 truncate pr-2">{lesson.title}</span>
                        <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: STORY MODE */}
        {activeView === 'story-mode' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <button 
              onClick={() => { stopPlayerContext(); setActiveView('home'); }} 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition text-slate-300"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              شاشة البداية
            </button>

            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-3xl">✍️</span>
                <h2 className="text-2xl font-black text-indigo-300 mt-2">منشئ القصص والمفاهيم الكرتونية التفاعلية</h2>
                <p className="text-xs text-slate-400 mt-1">اكتب قصة أطفال أو فقرة تعليمية وسأرسمها لك كعرض متحرك يروي نفسه</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">🏷️ عنوان القصة / الدرس</label>
                  <input 
                    type="text" 
                    value={storyTitle} 
                    onChange={e => setStoryTitle(e.target.value)} 
                    placeholder="مثال: رحلة أحمد في كوكب الحروف العربية..." 
                    className="w-full bg-slate-950 border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none text-slate-100 placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">📝 القصة أو المحتوى التعليمي</label>
                  <textarea 
                    value={storyText} 
                    onChange={e => setStoryText(e.target.value)} 
                    rows={6}
                    placeholder="اكتب القصة هنا... (مثال: في زاوية من الغابة الكثيفة، كان هناك أرنبٌ صغيرٌ يحب الرسم بالألوان. في أحد الأيام، وجد جداراً قديماً وبدأ برسم شمس ساطعة فدبّت الحياة بالحائط تدريجياً...)" 
                    className="w-full bg-slate-950 border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none text-slate-100 placeholder:text-slate-600 resize-none leading-relaxed"
                  />
                </div>

                {/* Voice & Playback Configurations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">🎤 صوت الراوي المفضل</label>
                    <select 
                      value={settings.voice}
                      onChange={e => setSettings({...settings, voice: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none text-slate-200"
                    >
                      <option value="Puck">أرنب ذكي ومرح (Puck)</option>
                      <option value="Charon">حكيم هادئ وصديق (Charon)</option>
                      <option value="Kore">مذيعة مبدعة ناعمة (Kore)</option>
                      <option value="Fenrir">مغامر شجاع غليظ (Fenrir)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">⏱️ تأثير الانتقال السينمائي للمشاهد</label>
                    <select 
                      value={settings.transition}
                      onChange={e => setSettings({...settings, transition: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none text-slate-200"
                    >
                      <option value="zoom">تكبير درامي مشوق (Zoom In)</option>
                      <option value="pan">تحريك أفقي مريح (Pan)</option>
                      <option value="fade">تلاشي وتحول ناعم (Fade)</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={processStoryMode}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xl shadow-lg shadow-purple-600/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-6 h-6 animate-spin" />
                  اصنع الرسوم التوضيحية والفيلم الكرتوني!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: IMAGE MODE */}
        {activeView === 'image-mode' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <button 
              onClick={() => { stopPlayerContext(); setActiveView('home'); }} 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition text-slate-300"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              شاشة البداية
            </button>

            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-3xl">🖼️</span>
                <h2 className="text-2xl font-black text-teal-300 mt-2">مقطع الصور والوسائل التفاعلية الذكي</h2>
                <p className="text-xs text-slate-400 mt-1">ارفع أي صورة مجمعة، لوحدة درس، أو وسيلة، وقم بتقسيمها لنطق وشرح أجزائها بصوت نقي</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">🏷️ عنوان الدرس المصور</label>
                  <input 
                    type="text" 
                    value={imageTitle} 
                    onChange={e => setImageTitle(e.target.value)} 
                    placeholder="مثال: شرح مكونات الخلية النباتية..." 
                    className="w-full bg-slate-950 border border-white/10 focus:border-teal-500 rounded-xl px-4 py-3 outline-none text-slate-100 placeholder:text-slate-600"
                  />
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                {!uploadedImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/10 transition-all rounded-2xl p-12 text-center cursor-pointer group"
                  >
                    <Upload className="w-12 h-12 text-teal-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-lg font-bold text-slate-200">اسحب أو انقر هنا لرفع الصورة التعليمية</p>
                    <p className="text-xs text-slate-500 mt-1">دعم لجميع صيغ الصور PNG, JPG, JPEG, WEBP</p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/60 p-4 flex flex-col items-center">
                      <img src={uploadedImage} alt="Main Visual Preview" className="max-h-72 rounded-lg object-contain shadow-md" />
                      <button 
                        onClick={() => setUploadedImage(null)}
                        className="mt-3 px-4 py-1.5 bg-red-500/15 hover:bg-red-500 text-red-300 rounded-xl text-xs font-bold transition-colors"
                      >
                        إلغاء وتغيير الصورة
                      </button>
                    </div>

                    {/* Slicing grid configuration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-2xl border border-white/5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2">📐 تقسيم العرض (أعمدة): <span className="text-teal-400 font-black">{settings.cols} أعمدة</span></label>
                        <input 
                          type="range" 
                          min={1} 
                          max={4} 
                          value={settings.cols} 
                          onChange={e => setSettings({...settings, cols: parseInt(e.target.value)})}
                          className="w-full accent-teal-500 h-1.5 bg-white/10 rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                          <span>1 عمود</span>
                          <span>4 أعمدة</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2">📏 تقسيم الارتفاع (صفوف): <span className="text-teal-400 font-black">{settings.rows} صفوف</span></label>
                        <input 
                          type="range" 
                          min={1} 
                          max={5} 
                          value={settings.rows} 
                          onChange={e => setSettings({...settings, rows: parseInt(e.target.value)})}
                          className="w-full accent-teal-500 h-1.5 bg-white/10 rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                          <span>1 صف</span>
                          <span>5 صفوف</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2">🎤 صوت المعلم الافتراضي</label>
                        <select 
                          value={settings.voice}
                          onChange={e => setSettings({...settings, voice: e.target.value})}
                          className="w-full bg-slate-900 border border-white/10 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none text-slate-200"
                        >
                          <option value="Puck">مشرق حيوي (Puck)</option>
                          <option value="Charon">هادئ مفصل (Charon)</option>
                          <option value="Kore">أستاذة متميزة (Kore)</option>
                          <option value="Fenrir">شجاع وقور (Fenrir)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2">⏱️ مدة الانتقال الافتراضية</label>
                        <select 
                          value={settings.duration}
                          onChange={e => setSettings({...settings, duration: parseInt(e.target.value)})}
                          className="w-full bg-slate-900 border border-white/10 focus:border-teal-500 rounded-xl px-3 py-2.5 outline-none text-slate-200"
                        >
                          <option value={5}>5 ثواني قصيرة</option>
                          <option value={8}>8 ثواني متوسطة</option>
                          <option value={12}>12 ثانية طويلة</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={processImageMode}
                      className="w-full py-4 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xl shadow-lg shadow-teal-600/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      ✂️ قطع كدرس تفاعلي ناطق الآن!
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: PLAYER (CINEMATIC) */}
        {activeView === 'player' && currentMovie && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <button 
                onClick={() => { stopPlayerContext(); setActiveView('home'); }} 
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition flex items-center gap-1 text-slate-300"
              >
                <ArrowRight className="w-4 h-4" />
                عودة للرئيسية
              </button>
              <h3 className="text-xl font-bold bg-gradient-to-r from-teal-300 to-purple-300 bg-clip-text text-transparent">{currentMovie.title}</h3>
              <span className="text-xs bg-emerald-500/10 text-emerald-300 font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
                مشهد {playerIndex + 1} من {currentMovie.scenes.length}
              </span>
            </div>

            {/* Metadata badges for status, fallbacks and mode details */}
            {currentMovie.scenes[playerIndex] && (
              <div className="flex flex-wrap gap-2 justify-center bg-slate-900/20 p-2.5 rounded-2xl border border-white/5">
                {currentMovie.scenes[playerIndex].imgMethodUsed?.startsWith('svg') ? (
                  <span className="text-xs bg-yellow-500/10 text-yellow-400 font-semibold px-3 py-1 rounded-full border border-yellow-500/20 flex items-center gap-1">
                    🎨 رسم كرتوني تعليمي ذكي (وضع احتياطي تلقائي)
                  </span>
                ) : (
                  <span className="text-xs bg-teal-500/10 text-teal-300 font-semibold px-3 py-1 rounded-full border border-teal-500/20 flex items-center gap-1">
                    🖼️ تصميم سينمائي فائق الدقة (الذكاء الاصطناعي)
                  </span>
                )}
                
                {(!currentMovie.scenes[playerIndex].audio || currentMovie.scenes[playerIndex].audioSource === 'local') ? (
                  <span className="text-xs bg-purple-500/10 text-purple-400 font-semibold px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-1">
                    🔊 قارئ محلي ذكي (لتجاوز حدود ضغط استخدام الخادم)
                  </span>
                ) : (
                  <span className="text-xs bg-emerald-500/10 text-emerald-300 font-semibold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    🎙️ تعليق صوتي سحابي فخم ({settings.voice})
                  </span>
                )}
              </div>
            )}

            {/* Cinematic stage */}
            <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_4px_50px_rgba(30,41,59,0.7)]">
              
              {!isEnded ? (
                <>
                  <img 
                    key={playerIndex} // Restart zoom key frame logic every swap
                    src={currentMovie.scenes[playerIndex]?.img} 
                    alt="Current representation" 
                    className={`absolute inset-0 w-full h-full object-cover origin-center
                      ${settings.transition === 'zoom' ? 'animate-[zoomIn_10s_ease-out_forwards]' : ''}
                      ${settings.transition === 'pan' ? 'animate-[panRight_10s_ease-out_forwards] scale-110' : ''}
                      ${settings.transition === 'fade' ? 'animate-[fadeIn_0.8s_ease-out_forwards]' : ''}
                    `}
                  />

                  {/* Clean speech bubble without overlays masking the main teacher visual */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-11/12 max-w-2xl z-20">
                    <div className="bg-white text-slate-900 text-base md:text-2xl font-black p-5 md:p-6 rounded-3xl border-4 border-teal-500 shadow-[0_10px_35px_rgba(0,0,0,0.6)] text-center relative animate-[bubblePop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                      {currentMovie.scenes[playerIndex]?.text}
                      
                      {/* Speech balloon indicators tail */}
                      <div className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 border-t-[18px] border-t-teal-500 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent"></div>
                      <div className="absolute -bottom-[12px] left-1/2 -translate-x-1/2 border-t-[14px] border-t-white border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent z-10"></div>
                    </div>
                  </div>
                </>
              ) : (
                /* Celebration stage at end */
                <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                  <span className="text-6xl animate-bounce">🏆</span>
                  <h2 className="text-3xl font-black mt-4 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">تفوق وتقدير كامل!</h2>
                  <p className="text-slate-300 mt-2 text-base max-w-md mx-auto leading-relaxed">أنهيت عرض الفيلم التعليمي بنجاح متميز. يمكنك الآن تصدير كل شيء لجهازك أو حفظ العرض بالمكتبة للتشغيل لاحقاً.</p>
                  
                  <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <button 
                      onClick={() => { setIsEnded(false); setPlayerIndex(0); setPlayerIsPlaying(true); }}
                      className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 rounded-xl font-bold flex items-center gap-2 text-sm transition"
                    >
                      <RefreshCw className="w-4 h-4" />
                      إعادة تشغيل العرض
                    </button>
                    <button 
                      onClick={() => { stopPlayerContext(); saveLessonToDB(currentMovie); }}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2 text-sm transition"
                    >
                      <Save className="w-4 h-4" />
                      حفظ بالمكتبة
                    </button>
                    <button 
                      onClick={() => { stopPlayerContext(); setActiveView('home'); }}
                      className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm transition"
                    >
                      ملصق جديد
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation and progress indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="flex gap-2">
                <button 
                  onClick={togglePlay}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 transition font-bold rounded-xl text-sm flex gap-2 justify-center items-center"
                >
                  {isEnded ? "🔄 إعادة تشغيل" : playerIsPlaying ? <><Pause className="w-4 h-4" /> إيقاف مؤقت</> : <><Play className="w-4 h-4" /> استكمال العرض</>}
                </button>

                <button 
                  onClick={() => setIsMuted(m => !m)}
                  className={`p-3 rounded-xl border transition ${isMuted ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-800 border-white/5 hover:bg-slate-700'}`}
                  title={isMuted ? "كتم الصوت" : "تشغيل الصوت"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => { saveLessonToDB(currentMovie); }}
                  className="px-4 py-3 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  حفظ محلي في المكتبة
                </button>

                <button 
                  onClick={triggerAssetsDownload}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  title="تنزيل الملفات الصوتية والصور لجهازك للعمل أوفلاين"
                >
                  <Download className="w-4 h-4" />
                  تنزيل الدرس كاملاً
                </button>
              </div>
            </div>

            {/* Dynamic visual slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-500 font-bold px-1">
                <span>البداية</span>
                <span>النهاية</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${((playerIndex + (isEnded ? 1 : 0)) / currentMovie.scenes.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: GALLERY */}
        {activeView === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => setActiveView('home')} 
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition text-slate-300"
              >
                <ArrowRight className="w-4 h-4 ml-1" />
                عودة للرئيسية
              </button>
              <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">📚 مكتبة دروس ومؤلفات المعلم</h2>
              <div className="w-12"></div>
            </div>

            {savedLessons.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-white/5 space-y-4">
                <span className="text-5xl block">📭</span>
                <h3 className="text-lg font-bold text-slate-300">المكتبة فارغة حالياً</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">لم تقم بحفظ أي دروس في مكتبتك بعد. اصنع فيلماً تعليمياً تفاعلياً من الشاشة الرئيسية واضغط على زر الحفظ للوصول إليه في أي وقت!</p>
                <button onClick={() => setActiveView('home')} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition">ابدأ الآن</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedLessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    onClick={() => {
                      setCurrentMovie(lesson);
                      setPlayerIndex(0);
                      setIsEnded(false);
                      setPlayerIsPlaying(true);
                      setActiveView('player');
                    }}
                    className="group bg-slate-900/50 hover:bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 cursor-pointer shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
                  >
                    <div className="aspect-video relative overflow-hidden bg-slate-950">
                      <img src={lesson.scenes[0]?.img} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full text-white ${lesson.type === 'image' ? 'bg-teal-600' : 'bg-indigo-600'}`}>
                        {lesson.type === 'image' ? 'درس مصوّر' : 'قصة ذكية'}
                      </span>
                    </div>

                    <div className="p-4 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-100 truncate group-hover:text-amber-300 transition-colors pr-1 max-w-[200px]">{lesson.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{lesson.scenes.length} مشهد تفاعلي ناطق</p>
                      </div>
                      <button 
                        onClick={(e) => deleteLessonFromDB(lesson.id, e)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition"
                        title="حذف الدرس"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: SETTINGS / API CONFIG */}
        {activeView === 'settings' && (
          <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
            <button 
              onClick={() => setActiveView('home')} 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition text-slate-300"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              الرئيسية
            </button>

            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-2xl">⚙️</span>
                <h3 className="text-xl font-bold mt-2">إعدادات الاتصال والرموز المخصصة</h3>
                <p className="text-xs text-slate-400 mt-1">يمكنك إدخال مفتاح مخصص في حال أردت تشغيل التقطيع محلياً خارج بيئة AI Studio</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">🔑 مفتاح Gemini API المخصص (اختياري)</label>
                  <input 
                    type="password" 
                    id="custom-key-field"
                    defaultValue={localStorage.getItem('gemini_api_key') || ''}
                    placeholder="AIzaSy..." 
                    className="w-full bg-slate-950 border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none text-slate-100 placeholder:text-slate-600 font-mono text-sm"
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">ملاحظة: يقوم الذكاء الاصطناعي على المنصة بحقن مفتاحك الأساسي للمطور تلقائياً في البيئة الافتراضية، لذا لست مضطراً لوضع أي شيء هنا إلا في الحالات المحددة.</p>
                </div>

                <button 
                  onClick={saveCustomSettingsKey}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm transition"
                >
                  حفظ وتأكيد المفتاح
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modern processing loader overlay */}
      {loading.active && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-in fade-in duration-300 text-center px-6">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
            <Sparkles className="w-8 h-8 text-indigo-400 absolute animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-slate-200 mb-2 animate-pulse">{loading.text}</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">الذكاء الاصطناعي يقوم الآن بالتحليل السمعي والبصري والتكوين، قد يأخذ بضع لحظات لتخريج الدرس بنقاوة كاملة...</p>
        </div>
      )}

      {/* Styled custom CSS animation rules */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes zoomIn { from { transform: scale(1); } to { transform: scale(1.15); } }
        @keyframes panRight { from { transform: scale(1.1) translateX(-3%); } to { transform: scale(1.1) translateX(3%); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bubblePop { 
          0% { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); } 
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } 
        }
      `}} />
    </div>
  );
}
