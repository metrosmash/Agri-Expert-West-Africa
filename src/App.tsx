import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { 
  Sprout, 
  Camera, 
  Upload, 
  MessageSquare, 
  Calendar, 
  Globe, 
  ChevronRight, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Leaf,
  Wind,
  Droplets
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";
import { diagnoseCrop, getAdvice } from "./services/gemini";

type Tab = "diagnosis" | "advice" | "schedule";
type Language = "English" | "Nigerian Pidgin" | "Yoruba" | "Hausa" | "Igbo" | "French";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("diagnosis");
  const [language, setLanguage] = useState<Language>("English");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setIsAnalyzing(true);
      setDiagnosisResult(null);
      
      try {
        const base64Data = base64.split(",")[1];
        const result = await diagnoseCrop(base64Data, file.type);
        setDiagnosisResult(result || "Could not generate diagnosis.");
      } catch (error) {
        console.error("Diagnosis error:", error);
        setDiagnosisResult("An error occurred during analysis. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userMessage = chatQuery;
    setChatQuery("");
    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
    setIsChatLoading(true);

    try {
      const response = await getAdvice(userMessage, language);
      setChatHistory(prev => [...prev, { role: "ai", content: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please check your connection." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-olive/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-olive p-2 rounded-xl">
              <Sprout className="text-warm-bg w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Agri-Expert <span className="text-olive">West Africa</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-warm-bg px-3 py-1.5 rounded-full border border-olive/10">
              <Globe className="w-4 h-4 text-olive" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
              >
                <option>English</option>
                <option>Nigerian Pidgin</option>
                <option>Yoruba</option>
                <option>Hausa</option>
                <option>Igbo</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        <section className="mb-12 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Bridging the <span className="text-olive italic">Extension Gap</span> for Every Farmer
            </h2>
            <p className="text-lg text-earth-brown/70 serif-text">
              Instant, localized, and climate-smart agricultural advice at your fingertips.
            </p>
          </motion.div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: "diagnosis", label: "Crop Diagnosis", icon: Camera },
            { id: "advice", label: "Expert Advice", icon: MessageSquare },
            { id: "schedule", label: "Planting Schedule", icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-olive text-white shadow-lg shadow-olive/20 scale-105" 
                  : "bg-white text-earth-brown hover:bg-olive/5 border border-olive/10"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-earth-brown/5 border border-olive/5 overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "diagnosis" && (
              <motion.div
                key="diagnosis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 sm:p-10"
              >
                <div className="grid lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Diagnose Your Crop</h3>
                      <p className="text-earth-brown/60 serif-text">Upload a clear photo of your crop's leaves or stem to identify pests and diseases.</p>
                    </div>

                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden relative",
                        imagePreview ? "border-olive" : "border-olive/20 hover:border-olive/40 bg-warm-bg/50"
                      )}
                    >
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <>
                          <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <Camera className="w-8 h-8 text-olive" />
                          </div>
                          <p className="font-medium">Tap to take photo or upload</p>
                          <p className="text-sm text-earth-brown/50">Supports Maize, Cassava, Yam, Cocoa, Rice</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>

                    {imagePreview && (
                      <button 
                        onClick={() => {
                          setImagePreview(null);
                          setDiagnosisResult(null);
                        }}
                        className="text-sm text-red-600 font-medium hover:underline"
                      >
                        Remove and try another photo
                      </button>
                    )}
                  </div>

                  <div className="bg-warm-bg/30 rounded-3xl p-6 sm:p-8 border border-olive/5 min-h-[300px] flex flex-col">
                    {isAnalyzing ? (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-10 h-10 text-olive animate-spin" />
                        <div className="text-center">
                          <p className="font-bold text-lg">Analyzing Image...</p>
                          <p className="text-sm text-earth-brown/60 serif-text italic">Performing visual reasoning for accurate diagnosis</p>
                        </div>
                      </div>
                    ) : diagnosisResult ? (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 text-olive">
                          <CheckCircle2 className="w-6 h-6" />
                          <h4 className="text-xl font-bold">Analysis Complete</h4>
                        </div>
                        <div className="prose prose-earth max-w-none">
                          <div className="whitespace-pre-wrap text-earth-brown/80 leading-relaxed serif-text">
                            {diagnosisResult}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                        <AlertCircle className="w-12 h-12" />
                        <p className="serif-text italic">Upload an image to see the expert diagnosis here.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "advice" && (
              <motion.div
                key="advice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 sm:p-10 flex flex-col h-full max-h-[700px]"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold">Expert Advice Chat</h3>
                  <p className="text-earth-brown/60 serif-text">Ask anything about your farm, fertilizers, or local markets.</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                  {chatHistory.length === 0 && (
                    <div className="text-center py-10 opacity-40">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                      <p className="serif-text italic">No messages yet. Ask your first question!</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-6">
                        {["How to control Fall Armyworm?", "Best time to plant Maize in Oyo?", "Organic fertilizer for Cassava"].map(q => (
                          <button 
                            key={q}
                            onClick={() => setChatQuery(q)}
                            className="text-xs bg-olive/5 hover:bg-olive/10 px-3 py-1.5 rounded-full border border-olive/10 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user" 
                          ? "bg-olive text-white rounded-tr-none" 
                          : "bg-warm-bg border border-olive/10 rounded-tl-none serif-text"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-warm-bg border border-olive/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-olive" />
                        <span className="text-sm italic serif-text">Expert is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleChatSubmit} className="relative">
                  <input 
                    type="text"
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full bg-warm-bg border border-olive/10 rounded-2xl px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-olive/20 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={isChatLoading || !chatQuery.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-olive text-white p-2 rounded-xl disabled:opacity-50 hover:scale-105 transition-transform"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 sm:p-10"
              >
                <div className="max-w-3xl mx-auto space-y-10">
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-bold">Climate-Smart Scheduling</h3>
                    <p className="text-earth-brown/60 serif-text">Localized planting windows based on 2026 rainfall trends.</p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="bg-warm-bg p-6 rounded-3xl border border-olive/10 text-center space-y-3">
                      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <Droplets className="text-blue-500 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-earth-brown/40">Rainfall Status</p>
                        <p className="font-bold text-lg">Early Onset</p>
                      </div>
                    </div>
                    <div className="bg-warm-bg p-6 rounded-3xl border border-olive/10 text-center space-y-3">
                      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <Wind className="text-amber-500 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-earth-brown/40">Wind Pattern</p>
                        <p className="font-bold text-lg">Moderate Harmattan</p>
                      </div>
                    </div>
                    <div className="bg-warm-bg p-6 rounded-3xl border border-olive/10 text-center space-y-3">
                      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <Leaf className="text-green-500 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-earth-brown/40">Soil Temp</p>
                        <p className="font-bold text-lg">Optimal (28°C)</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-olive/5 rounded-3xl p-8 border border-olive/10 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold">Recommended Planting Windows</h4>
                      <div className="text-xs bg-olive text-white px-3 py-1 rounded-full">April 2026</div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { crop: "Maize", window: "April 15 - May 10", status: "Optimal", color: "bg-green-500" },
                        { crop: "Cassava", window: "April 01 - June 30", status: "Good", color: "bg-blue-500" },
                        { crop: "Yam", window: "March 20 - April 30", status: "Late Stage", color: "bg-amber-500" },
                      ].map((item) => (
                        <div key={item.crop} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-olive/5">
                          <div className="flex items-center gap-4">
                            <div className={cn("w-2 h-10 rounded-full", item.color)} />
                            <div>
                              <p className="font-bold">{item.crop}</p>
                              <p className="text-sm text-earth-brown/60 serif-text">{item.window}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold uppercase text-earth-brown/40">Status</p>
                            <p className="text-sm font-medium">{item.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-olive/10">
                      <p className="text-sm text-earth-brown/60 serif-text italic text-center">
                        *Data based on current LGA trends. For more specific advice, please use the Expert Advice chat.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-earth-brown text-warm-bg py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sprout className="w-6 h-6" />
                <h3 className="text-lg font-bold">Agri-Expert West Africa</h3>
              </div>
              <p className="text-sm text-warm-bg/60 serif-text">
                Empowering smallholder farmers with AI-driven insights to ensure food security and sustainable livelihoods across West Africa.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-xs tracking-widest text-warm-bg/40">Supported Regions</h4>
              <ul className="text-sm space-y-2 serif-text">
                <li>Nigeria (All States)</li>
                <li>Ghana (Ashanti, Greater Accra)</li>
                <li>Senegal (Dakar, Thiès)</li>
                <li>Ivory Coast (Abidjan, Yamoussoukro)</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-xs tracking-widest text-warm-bg/40">Safety & IPM</h4>
              <p className="text-sm text-warm-bg/60 serif-text">
                We prioritize Integrated Pest Management (IPM). Always wear protective gear when handling chemicals. Consult local extension officers for verification.
              </p>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-warm-bg/10 text-center text-xs text-warm-bg/30">
            © 2026 Agri-Expert West Africa. Powered by Gemini 1.5 Pro.
          </div>
        </div>
      </footer>
    </div>
  );
}
