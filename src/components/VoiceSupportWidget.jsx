import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  LanguageIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  StopIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { UseAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { SUPPORT_LANGUAGES, getContextualSupportResponse } from "./voiceSupportKnowledge";
import { useLocation } from "react-router";

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function createVoice(language, voices) {
  const config = SUPPORT_LANGUAGES.find((item) => item.code === language) || SUPPORT_LANGUAGES[0];
  return voices.find((voice) =>
    config.synthesisPrefixes.some((prefix) => voice.lang?.toLowerCase().startsWith(prefix.toLowerCase()))
  );
}

export default function VoiceSupportWidget() {
  const { navigate, role } = UseAppContext();
  const { language, changeLanguage } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: "welcome",
      sender: "assistant",
      text: {
        en: "I'm your website support assistant. Ask me how to use this site, where features are, or use the microphone to speak.",
        hi: "मैं आपकी website support assistant हूँ। मुझसे पूछें कि इस site का उपयोग कैसे करें, features कहाँ हैं, या microphone से बोलें।",
        te: "నేను మీ website support assistant ని. ఈ site ను ఎలా ఉపయోగించాలి, features ఎక్కడ ఉన్నాయి అని అడగండి, లేదా microphone ద్వారా మాట్లాడండి.",
      }[language],
      actions: [],
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [statusText, setStatusText] = useState("");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const interimRef = useRef("");

  const recognitionSupported = useMemo(() => Boolean(getSpeechRecognitionConstructor()), []);
  const selectedLanguage = useMemo(
    () => SUPPORT_LANGUAGES.find((item) => item.code === language) || SUPPORT_LANGUAGES[0],
    [language]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return undefined;

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    setMessages((prev) => {
      if (!prev.length || prev[0].id !== "welcome") return prev;
      return [
        {
          ...prev[0],
          text: {
            en: "I'm your website support assistant. Ask me how to use this site, where features are, or use the microphone to speak.",
            hi: "मैं आपकी website support assistant हूँ। मुझसे पूछें कि इस site का उपयोग कैसे करें, features कहाँ हैं, या microphone से बोलें।",
            te: "నేను మీ website support assistant ని. ఈ site ను ఎలా ఉపయోగించాలి, features ఎక్కడ ఉన్నాయి అని అడగండి, లేదా microphone ద్వారా మాట్లాడండి.",
          }[language],
        },
        ...prev.slice(1),
      ];
    });
  }, [language]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text) => {
    if (!speechEnabled || typeof window === "undefined" || !window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage.recognitionLang;
    const voice = createVoice(language, voices);
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const appendAssistantMessage = (text, actions = []) => {
    const message = {
      id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: "assistant",
      text,
      actions,
    };
    setMessages((prev) => [...prev, message]);
    speakText(text);
  };

  const handleAssistantQuery = (rawQuery) => {
    const query = (rawQuery || "").trim();
    if (!query) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: "user",
        text: query,
        actions: [],
      },
    ]);

    const response = getContextualSupportResponse({
      query,
      language,
      pathname: location.pathname,
      role,
    });

    appendAssistantMessage(response.answer, response.actions);
    setInputValue("");
    setStatusText("");
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    interimRef.current = "";
    setStatusText("");
  };

  const startListening = () => {
    const Recognition = getSpeechRecognitionConstructor();
    if (!Recognition) {
      appendAssistantMessage(
        {
          en: "Voice input is not supported in this browser. You can still type your question.",
          hi: "इस browser में voice input supported नहीं है। आप अपना सवाल type कर सकते हैं।",
          te: "ఈ browser లో voice input support లేదు. మీరు మీ ప్రశ్నను type చేయవచ్చు.",
        }[language]
      );
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new Recognition();
    recognition.lang = selectedLanguage.recognitionLang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setStatusText(
        {
          en: "Listening...",
          hi: "सुन रहा हूँ...",
          te: "వింటున్నాను...",
        }[language]
      );
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript || "";
        if (event.results[index].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      interimRef.current = interimText;
      setInputValue(finalText || interimText);

      if (finalText.trim()) {
        handleAssistantQuery(finalText);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setStatusText(
        {
          en: `Voice input error: ${event.error}`,
          hi: `Voice input error: ${event.error}`,
          te: `Voice input error: ${event.error}`,
        }[language]
      );
    };

    recognition.onend = () => {
      setIsListening(false);
      if (interimRef.current && !inputValue) {
        setInputValue(interimRef.current);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const quickPrompts = selectedLanguage.quickPrompts || [];

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[120]">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex h-16 w-16 items-center justify-center rounded-full border border-[#f0d97b]/40 bg-gradient-to-br from-[#D4AF37] to-[#FFF085] text-[#0a1a0c] shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition hover:-translate-y-1"
            aria-label="Open voice support"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="size-8" />
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <div className="fixed bottom-3 right-3 z-[120] w-[calc(100vw-2rem)] max-w-[390px] rounded-[28px] border border-[#f0d97b]/20 bg-[#060606]/97 text-white shadow-[0_28px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="rounded-t-[28px] border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.25),_rgba(6,6,6,0.98)_55%)] px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-montserrat text-xs font-bold uppercase tracking-[0.24em] text-gold/85">
                  Voice Support
                </p>
                <p className="mt-1 font-montserrat text-sm text-white/70">
                  Ask about this website, then jump directly to the right page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setIsOpen(false);
                }}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/75 transition hover:bg-white/10"
                aria-label="Close assistant"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLanguageMenu((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-xs font-semibold text-gold"
                >
                  <LanguageIcon className="size-4" />
                  {selectedLanguage.label}
                </button>
                {showLanguageMenu ? (
                  <div className="absolute left-0 top-11 w-36 rounded-2xl border border-white/10 bg-[#090909] p-2 shadow-2xl">
                    {SUPPORT_LANGUAGES.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          changeLanguage(item.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm transition last:mb-0 ${
                          item.code === language
                            ? "bg-gold text-[#0a1a0c]"
                            : "bg-white/5 text-white hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setSpeechEnabled((prev) => !prev)}
                className="rounded-full border border-white/10 bg-black/35 p-2 text-gold transition hover:bg-white/10"
                aria-label={speechEnabled ? "Mute voice responses" : "Enable voice responses"}
              >
                {speechEnabled ? <SpeakerWaveIcon className="size-4" /> : <SpeakerXMarkIcon className="size-4" />}
              </button>

              <div className="ml-auto text-right font-montserrat text-[11px] text-white/45">
                {recognitionSupported ? "Browser voice ready" : "Type-only mode"}
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-[360px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[22px] px-4 py-3 font-montserrat text-sm leading-6 ${
                    message.sender === "user"
                      ? "bg-gold text-[#0a1a0c]"
                      : "border border-white/10 bg-white/5 text-white"
                  }`}
                >
                  <p>{message.text}</p>
                  {message.actions?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.actions.map((action) => (
                        <button
                          key={`${message.id}-${action.path}`}
                          type="button"
                          onClick={() => navigate(action.path)}
                          className="rounded-full border border-gold/30 bg-black px-3 py-1 text-xs font-semibold text-gold transition hover:bg-white/10"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleAssistantQuery(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1 rounded-[20px] border border-white/10 bg-black/40 px-3 py-2">
                <textarea
                  rows={2}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder={
                    {
                      en: "Ask where features are or what to do next...",
                      hi: "पूछें feature कहाँ है या आगे क्या करना है...",
                      te: "Feature ఎక్కడ ఉందో లేదా తర్వాత ఏమి చేయాలో అడగండి...",
                    }[language]
                  }
                  className="w-full resize-none bg-transparent font-montserrat text-sm text-white outline-none placeholder:text-white/35"
                />
                {statusText ? (
                  <p className="mt-1 font-montserrat text-[11px] text-gold/85">{statusText}</p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={startListening}
                className={`rounded-full border p-3 transition ${
                  isListening
                    ? "border-[#ff9d9d]/30 bg-[#3a0f0f] text-[#ffb3b3]"
                    : "border-white/10 bg-white/5 text-gold hover:bg-white/10"
                }`}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <StopIcon className="size-5" /> : <MicrophoneIcon className="size-5" />}
              </button>

              <button
                type="button"
                onClick={() => handleAssistantQuery(inputValue)}
                className="rounded-full border border-gold/20 bg-gold p-3 text-[#0a1a0c] transition hover:brightness-110"
                aria-label="Send question"
              >
                <PaperAirplaneIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

