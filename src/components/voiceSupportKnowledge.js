export const SUPPORT_LANGUAGES = [
  {
    code: "en",
    label: "English",
    recognitionLang: "en-IN",
    synthesisPrefixes: ["en-IN", "en-GB", "en-US", "en"],
    quickPrompts: [
      "How do I use this website?",
      "Where is the AI Toolkit?",
      "How do I switch roles?",
      "How do I book transport?",
    ],
  },
  {
    code: "hi",
    label: "Hindi",
    recognitionLang: "hi-IN",
    synthesisPrefixes: ["hi-IN", "hi"],
    quickPrompts: [
      "इस वेबसाइट का उपयोग कैसे करें?",
      "AI Toolkit कहाँ है?",
      "रोल कैसे बदलें?",
      "ट्रांसपोर्ट कैसे बुक करें?",
    ],
  },
  {
    code: "te",
    label: "Telugu",
    recognitionLang: "te-IN",
    synthesisPrefixes: ["te-IN", "te"],
    quickPrompts: [
      "ఈ వెబ్‌సైట్‌ను ఎలా ఉపయోగించాలి?",
      "AI Toolkit ఎక్కడ ఉంది?",
      "రోల్ ఎలా మార్చాలి?",
      "ట్రాన్స్‌పోర్ట్ ఎలా బుక్ చేయాలి?",
    ],
  },
];

const knowledgeBase = [
  {
    id: "general",
    route: null,
    keywords: [
      "how to use",
      "use website",
      "website",
      "start",
      "help",
      "guide",
      "इस वेबसाइट",
      "कैसे उपयोग",
      "मदद",
      "ఈ వెబ్‌సైట్",
      "ఎలా ఉపయోగించాలి",
      "సహాయం",
    ],
    answer: {
      en: "Start from the dashboard after login. Use the left menu to open Rentals, Shop, Marketplace, Transport, Contract Farming, Cold Storage, or AI Toolkit. If you are new, first choose a role, complete your profile, and then open the module you need.",
      hi: "लॉगिन के बाद डैशबोर्ड से शुरू करें। बाएँ मेनू से Rentals, Shop, Marketplace, Transport, Contract Farming, Cold Storage या AI Toolkit खोलें। अगर आप नए हैं, पहले role चुनें, profile पूरी करें, फिर जिस module की ज़रूरत हो उसे खोलें।",
      te: "లాగిన్ అయిన తర్వాత డాష్‌బోర్డ్ నుండి ప్రారంభించండి. ఎడమ వైపు మెనూ ద్వారా Rentals, Shop, Marketplace, Transport, Contract Farming, Cold Storage లేదా AI Toolkit తెరవండి. మీరు కొత్తవారైతే ముందుగా role ఎంచుకుని, profile పూర్తి చేసి, తర్వాత అవసరమైన module తెరవండి.",
    },
    suggestions: ["dashboard", "ai toolkit", "shop"],
  },
  {
    id: "dashboard",
    route: "/dashboard",
    keywords: ["dashboard", "home", "main page", "डैशबोर्ड", "होम", "డాష్‌బోర్డ్", "హోమ్"],
    answer: {
      en: "The dashboard is your main hub. It shows quick entry cards for core services like AI Toolkit, Rentals, Contract Farming, Shop, Transport, and Cold Storage.",
      hi: "डैशबोर्ड आपका मुख्य hub है। यहाँ AI Toolkit, Rentals, Contract Farming, Shop, Transport और Cold Storage जैसे मुख्य services के quick entry cards मिलते हैं।",
      te: "డాష్‌బోర్డ్ మీ ప్రధాన hub. ఇక్కడ AI Toolkit, Rentals, Contract Farming, Shop, Transport మరియు Cold Storage వంటి ముఖ్య సేవలకు quick entry cards కనిపిస్తాయి.",
    },
    suggestions: ["rentals", "transport", "contract farming"],
  },
  {
    id: "ai-toolkit",
    route: "/aitoolkit",
    keywords: [
      "ai toolkit",
      "crop recommendation",
      "disease prediction",
      "yield prediction",
      "price prediction",
      "ai tool",
      "एआई टूलकिट",
      "फसल रोग",
      "क्रॉप रिकमेंडेशन",
      "ఏఐ టూల్‌కిట్",
      "రోగ నిర్ధారణ",
      "క్రాప్ రికమెండేషన్",
    ],
    answer: {
      en: "AI Toolkit includes crop price prediction, crop yield prediction, crop disease prediction, and crop recommendation. Open AI Toolkit from the sidebar or dashboard, then choose the model card you want to use.",
      hi: "AI Toolkit में crop price prediction, crop yield prediction, crop disease prediction और crop recommendation शामिल हैं। Sidebar या dashboard से AI Toolkit खोलें, फिर जिस model का उपयोग करना है उसे चुनें।",
      te: "AI Toolkit లో crop price prediction, crop yield prediction, crop disease prediction మరియు crop recommendation ఉన్నాయి. Sidebar లేదా dashboard నుండి AI Toolkit తెరిచి, ఉపయోగించాలనుకున్న model ను ఎంచుకోండి.",
    },
    suggestions: ["crop recommendation", "crop disease", "dashboard"],
  },
  {
    id: "crop-recommendation",
    route: "/aitoolkit",
    keywords: [
      "crop recommendation",
      "soil image",
      "gps",
      "weather",
      "soil type",
      "एनपीके",
      "मिट्टी",
      "gps",
      "soil",
      "మట్టి",
      "వాతావరణం",
      "gps",
    ],
    answer: {
      en: "For crop recommendation, upload a soil image, allow GPS access, and click Generate. The system classifies the soil image, fetches weather from your current latitude and longitude, derives proxy NPK and pH values, and then predicts a recommended crop.",
      hi: "Crop recommendation के लिए soil image upload करें, GPS access दें, और Generate दबाएँ। सिस्टम soil image को classify करता है, आपकी current latitude और longitude से weather लाता है, proxy NPK और pH values बनाता है, और फिर recommended crop बताता है।",
      te: "Crop recommendation కోసం soil image upload చేసి, GPS access ఇవ్వండి, తర్వాత Generate నొక్కండి. సిస్టమ్ soil image ను classify చేసి, మీ current latitude మరియు longitude ఆధారంగా weather తెచ్చి, proxy NPK మరియు pH values రూపొందించి, recommended crop ను చూపిస్తుంది.",
    },
    suggestions: ["ai toolkit", "crop disease", "dashboard"],
  },
  {
    id: "crop-disease",
    route: "/aitoolkit",
    keywords: [
      "crop disease",
      "disease prediction",
      "leaf image",
      "disease",
      "रोग",
      "लीफ",
      "पत्ता",
      "రోగం",
      "ఆకు",
    ],
    answer: {
      en: "For crop disease prediction, open AI Toolkit, select Crop Disease Prediction, upload a clear plant or leaf image, and submit it. The system returns the most likely disease class and top matches.",
      hi: "Crop disease prediction के लिए AI Toolkit खोलें, Crop Disease Prediction चुनें, साफ plant या leaf image upload करें, और submit करें। सिस्टम सबसे probable disease class और top matches दिखाएगा।",
      te: "Crop disease prediction కోసం AI Toolkit తెరిచి, Crop Disease Prediction ఎంపిక చేసి, స్పష్టమైన plant లేదా leaf image upload చేసి submit చేయండి. సిస్టమ్ అత్యంత సాధ్యమైన disease class మరియు top matches ను చూపిస్తుంది.",
    },
    suggestions: ["ai toolkit", "crop recommendation"],
  },
  {
    id: "shop",
    route: "/shop",
    keywords: ["shop", "buy", "seeds", "fertilizers", "cart", "शॉप", "खरीद", "షాప్", "కొనాలి"],
    answer: {
      en: "Use Shop to browse agricultural products like seeds, fertilizers, and tools. Add items to the cart, review the cart page, and then place your order.",
      hi: "Shop का उपयोग seeds, fertilizers और tools जैसे agricultural products देखने के लिए करें। Items को cart में जोड़ें, cart page पर review करें, और फिर order place करें।",
      te: "Shop ను seeds, fertilizers మరియు tools వంటి agricultural products చూడటానికి ఉపయోగించండి. Items ను cart లోకి జోడించి, cart page లో review చేసి, తర్వాత order place చేయండి.",
    },
    suggestions: ["cart", "marketplace", "dashboard"],
  },
  {
    id: "marketplace",
    route: "/marketplace",
    keywords: ["marketplace", "list produce", "sell", "buyer", "मार्केटप्लेस", "बेचना", "మార్కెట్‌ప్లేస్", "అమ్మాలి"],
    answer: {
      en: "Marketplace is for listing and browsing farm produce. Farmers can showcase produce, and buyers or service providers can review listings and place orders depending on the current role.",
      hi: "Marketplace farm produce को list और browse करने के लिए है। Farmers अपनी produce दिखा सकते हैं, और buyers या service providers current role के अनुसार listings देखकर order कर सकते हैं।",
      te: "Marketplace farm produce ను list చేయడానికి మరియు browse చేయడానికి ఉపయోగపడుతుంది. Farmers తమ produce ను చూపవచ్చు, buyers లేదా service providers current role ఆధారంగా listings చూసి order చేయవచ్చు.",
    },
    suggestions: ["shop", "cart", "dashboard"],
  },
  {
    id: "rentals",
    route: "/rentals",
    keywords: ["rentals", "tractor", "equipment", "machinery", "रेंटल", "मशीन", "రెంటల్స్", "యంత్రాలు"],
    answer: {
      en: "Rentals lets you browse available farming equipment and request bookings. Open a rental item, review details, and submit the booking form.",
      hi: "Rentals में आप उपलब्ध farming equipment देख सकते हैं और booking request भेज सकते हैं। किसी rental item को खोलें, details देखें, और booking form submit करें।",
      te: "Rentals లో అందుబాటులో ఉన్న farming equipment ను చూసి booking request పంపవచ్చు. Rental item ను తెరిచి, details చూసి, booking form submit చేయండి.",
    },
    suggestions: ["transport", "cold storage", "dashboard"],
  },
  {
    id: "transport",
    route: "/transport",
    keywords: ["transport", "vehicle", "delivery", "pickup", "truck", "ट्रांसपोर्ट", "वाहन", "ట్రాన్స్‌పోర్ట్", "వాహనం"],
    answer: {
      en: "Transport helps you book vehicles for moving crops or goods. Fill in pickup, drop, crop name, contact details, and preferred date to submit a transport request.",
      hi: "Transport crop या goods ले जाने के लिए vehicle booking में मदद करता है। Pickup, drop, crop name, contact details और preferred date भरकर transport request submit करें।",
      te: "Transport ద్వారా పంటలు లేదా సరుకులు తరలించడానికి vehicle booking చేయవచ్చు. Pickup, drop, crop name, contact details, preferred date ఇచ్చి transport request submit చేయండి.",
    },
    suggestions: ["bookings", "rentals", "dashboard"],
  },
  {
    id: "coldstorage",
    route: "/coldstorage",
    keywords: ["cold storage", "storage", "warehouse", "cold", "कोल्ड स्टोरेज", "भंडारण", "కోల్డ్ స్టోరేజ్", "నిల్వ"],
    answer: {
      en: "Cold Storage helps you find storage facilities to protect harvested produce. Open a storage listing, review capacity and terms, and submit a booking request.",
      hi: "Cold Storage harvested produce को सुरक्षित रखने के लिए storage facilities ढूँढने में मदद करता है। Storage listing खोलें, capacity और terms देखें, और booking request submit करें।",
      te: "Cold Storage harvested produce ను భద్రంగా నిల్వ చేయడానికి facilities కనుగొనడంలో సహాయపడుతుంది. Storage listing ను తెరిచి, capacity మరియు terms చూసి, booking request submit చేయండి.",
    },
    suggestions: ["transport", "bookings", "dashboard"],
  },
  {
    id: "contract",
    route: "/contract",
    keywords: ["contract", "contract farming", "apply", "buyer", "कॉन्ट्रैक्ट", "कॉन्ट्रैक्ट फार्मिंग", "కాంట్రాక్ట్", "కాంట్రాక్ట్ ఫార్మింగ్"],
    answer: {
      en: "Contract Farming lets farmers view available contracts and submit applications. Service providers can create listings and review farmer applications from their own contract page.",
      hi: "Contract Farming में farmers available contracts देख सकते हैं और applications submit कर सकते हैं। Service providers अपनी contract page से listings बना सकते हैं और farmer applications review कर सकते हैं।",
      te: "Contract Farming లో farmers అందుబాటులో ఉన్న contracts ను చూసి applications submit చేయవచ్చు. Service providers తమ contract page నుండి listings సృష్టించి farmer applications ను review చేయవచ్చు.",
    },
    suggestions: ["dashboard", "profile", "bookings"],
  },
  {
    id: "cart",
    route: "/cart",
    keywords: ["cart", "checkout", "order", "कार्ट", "ऑर्डर", "కార్ట్", "ఆర్డర్"],
    answer: {
      en: "Cart stores the products or listings you plan to order. Open the cart page, adjust quantities if needed, and place the order from there.",
      hi: "Cart में वे products या listings रहती हैं जिन्हें आप order करना चाहते हैं। Cart page खोलें, quantity बदलें यदि ज़रूरी हो, और वहीं से order place करें।",
      te: "Cart లో మీరు order చేయాలనుకున్న products లేదా listings ఉంటాయి. Cart page తెరిచి, అవసరమైతే quantity మార్చి, అక్కడి నుంచే order place చేయండి.",
    },
    suggestions: ["shop", "marketplace", "bookings"],
  },
  {
    id: "bookings",
    route: "/bookings",
    keywords: ["bookings", "my bookings", "status", "बुकिंग", "स्टेटस", "బుకింగ్స్", "స్టేటస్"],
    answer: {
      en: "Bookings shows your submitted requests and order status across modules. If you want to track a rental, transport, or storage request, this is the first place to check.",
      hi: "Bookings page पर आपकी submitted requests और status दिखते हैं। अगर आप rental, transport या storage request track करना चाहते हैं, तो सबसे पहले यही page देखें।",
      te: "Bookings page లో మీ submitted requests మరియు status కనిపిస్తాయి. Rental, transport లేదా storage request ను track చేయాలంటే ముందుగా ఈ page చూడండి.",
    },
    suggestions: ["transport", "cold storage", "dashboard"],
  },
  {
    id: "profile",
    route: "/profile",
    keywords: ["profile", "account", "edit profile", "प्रोफाइल", "अकाउंट", "ప్రొఫైల్", "అకౌంట్"],
    answer: {
      en: "Profile lets you review and update your personal details. Open the profile page from the sidebar avatar area.",
      hi: "Profile page में आप अपनी personal details देख और update कर सकते हैं। Sidebar के avatar area से profile page खोलें।",
      te: "Profile page లో మీరు మీ personal details ను చూడవచ్చు మరియు update చేయవచ్చు. Sidebar avatar area నుంచి profile page తెరవండి.",
    },
    suggestions: ["dashboard", "role switch"],
  },
  {
    id: "role-switch",
    route: null,
    keywords: ["switch role", "service provider", "farmer role", "रोल बदलें", "सर्विस प्रोवाइडर", "రోల్ మార్చు", "సర్వీస్ ప్రొవైడర్"],
    answer: {
      en: "You can switch between Farmer and Service Provider from the sidebar using the switch role button near the bottom. The available modules stay similar, but actions and views change by role.",
      hi: "Sidebar के नीचे दिए गए switch role button से आप Farmer और Service Provider roles के बीच बदल सकते हैं। Modules लगभग वही रहते हैं, लेकिन actions और views role के अनुसार बदलते हैं।",
      te: "Sidebar కింద ఉన్న switch role button ద్వారా మీరు Farmer మరియు Service Provider roles మధ్య మారవచ్చు. Modules దాదాపు ఒకేలా ఉంటాయి, కానీ actions మరియు views role ఆధారంగా మారుతాయి.",
    },
    suggestions: ["dashboard", "profile"],
  },
  {
    id: "auth",
    route: "/auth",
    keywords: ["login", "signup", "register", "authentication", "लॉगिन", "साइनअप", "రెజిస్టర్", "లాగిన్"],
    answer: {
      en: "Use the authentication page to sign in or create an account. After authentication, choose your role and fill in your user information to continue.",
      hi: "Sign in या account बनाने के लिए authentication page का उपयोग करें। Authentication के बाद role चुनें और user information भरें।",
      te: "Sign in చేయడానికి లేదా account సృష్టించడానికి authentication page ఉపయోగించండి. Authentication తర్వాత role ఎంచుకుని user information పూర్తి చేయండి.",
    },
    suggestions: ["general", "dashboard"],
  },
];

const routeContexts = [
  {
    match: (path) => path === "/",
    title: { en: "landing page", hi: "लैंडिंग पेज", te: "ల్యాండింగ్ పేజీ" },
    detail: {
      en: "You are on the landing page. From here users can learn about services, open the authentication page, and explore the platform overview.",
      hi: "आप लैंडिंग पेज पर हैं। यहाँ से users services के बारे में जान सकते हैं, authentication page खोल सकते हैं, और platform overview देख सकते हैं।",
      te: "మీరు landing page లో ఉన్నారు. ఇక్కడి నుంచి users services గురించి తెలుసుకుని, authentication page తెరిచి, platform overview చూడవచ్చు.",
    },
  },
  {
    match: (path) => path.includes("/aitoolkit"),
    title: { en: "AI Toolkit", hi: "AI Toolkit", te: "AI Toolkit" },
    detail: {
      en: "This page contains AI models for price prediction, yield prediction, crop disease prediction, and crop recommendation.",
      hi: "इस page में price prediction, yield prediction, crop disease prediction और crop recommendation के AI models हैं।",
      te: "ఈ page లో price prediction, yield prediction, crop disease prediction మరియు crop recommendation AI models ఉన్నాయి.",
    },
  },
  {
    match: (path) => path.includes("/shop"),
    title: { en: "Shop", hi: "Shop", te: "Shop" },
    detail: {
      en: "This page is for browsing and ordering agricultural products.",
      hi: "यह page agricultural products browse और order करने के लिए है।",
      te: "ఈ page agricultural products browse చేసి order చేయడానికి ఉపయోగపడుతుంది.",
    },
  },
  {
    match: (path) => path.includes("/marketplace"),
    title: { en: "Marketplace", hi: "Marketplace", te: "Marketplace" },
    detail: {
      en: "This page is for produce listings and marketplace orders.",
      hi: "यह page produce listings और marketplace orders के लिए है।",
      te: "ఈ page produce listings మరియు marketplace orders కోసం ఉపయోగపడుతుంది.",
    },
  },
  {
    match: (path) => path.includes("/rentals"),
    title: { en: "Rentals", hi: "Rentals", te: "Rentals" },
    detail: {
      en: "This page helps users browse and request farm equipment rentals.",
      hi: "यह page users को farm equipment rentals browse और request करने में मदद करता है।",
      te: "ఈ page users కు farm equipment rentals browse చేసి request చేయడంలో సహాయపడుతుంది.",
    },
  },
  {
    match: (path) => path.includes("/transport"),
    title: { en: "Transport", hi: "Transport", te: "Transport" },
    detail: {
      en: "This page handles crop transport requests or transport service management depending on role.",
      hi: "यह page role के अनुसार crop transport requests या transport service management संभालता है।",
      te: "ఈ page role ఆధారంగా crop transport requests లేదా transport service management ను నిర్వహిస్తుంది.",
    },
  },
  {
    match: (path) => path.includes("/coldstorage"),
    title: { en: "Cold Storage", hi: "Cold Storage", te: "Cold Storage" },
    detail: {
      en: "This page shows cold storage listings and booking options.",
      hi: "यह page cold storage listings और booking options दिखाता है।",
      te: "ఈ page cold storage listings మరియు booking options ను చూపిస్తుంది.",
    },
  },
  {
    match: (path) => path.includes("/contract"),
    title: { en: "Contract Farming", hi: "Contract Farming", te: "Contract Farming" },
    detail: {
      en: "This page helps with viewing, creating, or applying to contract farming opportunities.",
      hi: "यह page contract farming opportunities को देखने, बनाने या apply करने में मदद करता है।",
      te: "ఈ page contract farming opportunities ను చూడటం, సృష్టించడం లేదా apply చేయడంలో సహాయపడుతుంది.",
    },
  },
  {
    match: (path) => path.includes("/cart"),
    title: { en: "Cart", hi: "Cart", te: "Cart" },
    detail: {
      en: "This page contains items selected for ordering.",
      hi: "इस page में order के लिए चुनी गई items होती हैं।",
      te: "ఈ page లో order కోసం ఎంచుకున్న items ఉంటాయి.",
    },
  },
  {
    match: (path) => path.includes("/bookings"),
    title: { en: "Bookings", hi: "Bookings", te: "Bookings" },
    detail: {
      en: "This page helps users track submitted bookings and requests.",
      hi: "यह page users को submitted bookings और requests track करने में मदद करता है।",
      te: "ఈ page users కు submitted bookings మరియు requests track చేయడంలో సహాయపడుతుంది.",
    },
  },
];

function normalizeText(value) {
  return (value || "").toLowerCase().trim();
}

function buildRoute(role, routeKey) {
  const effectiveRole = role || "farmer";
  const routes = {
    dashboard: `/${effectiveRole}/`,
    "ai toolkit": `/${effectiveRole}/aitoolkit`,
    "crop recommendation": `/${effectiveRole}/aitoolkit`,
    "crop disease": `/${effectiveRole}/aitoolkit`,
    shop: `/${effectiveRole}/shop`,
    marketplace: `/${effectiveRole}/marketplace`,
    rentals: `/${effectiveRole}/rentals`,
    transport: `/${effectiveRole}/transport`,
    "cold storage": `/${effectiveRole}/coldstorage`,
    "contract farming": `/${effectiveRole}/contract`,
    contract: `/${effectiveRole}/contract`,
    cart: `/${effectiveRole}/cart`,
    bookings: `/${effectiveRole}/bookings`,
    profile: effectiveRole === "serviceprovider" ? "/serviceprovider/profile" : "/farmer/profile",
  };
  return routes[routeKey] || null;
}

function createActionLabel(routeKey, language) {
  const labels = {
    en: `Open ${routeKey}`,
    hi: `${routeKey} खोलें`,
    te: `${routeKey} తెరవండి`,
  };
  return labels[language] || labels.en;
}

export function getContextualSupportResponse({ query, language = "en", pathname = "/", role = "farmer" }) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return {
      answer: {
        en: "Ask me about navigation, bookings, AI Toolkit, rentals, transport, or any page on this website.",
        hi: "मुझसे navigation, bookings, AI Toolkit, rentals, transport या इस वेबसाइट के किसी भी page के बारे में पूछें।",
        te: "నావిగేషన్, bookings, AI Toolkit, rentals, transport లేదా ఈ వెబ్‌సైట్‌లోని ఏ page గురించైనా నన్ను అడగండి.",
      }[language] || "",
      actions: [],
    };
  }

  const contextualIntent =
    normalizedQuery.includes("where am i") ||
    normalizedQuery.includes("this page") ||
    normalizedQuery.includes("current page") ||
    normalizedQuery.includes("here") ||
    normalizedQuery.includes("इस पेज") ||
    normalizedQuery.includes("यहाँ") ||
    normalizedQuery.includes("ఈ పేజీ") ||
    normalizedQuery.includes("ఇక్కడ");

  if (contextualIntent) {
    const currentContext = routeContexts.find((item) => item.match(pathname));
    if (currentContext) {
      return {
        answer: `${currentContext.detail[language] || currentContext.detail.en}`,
        actions: [],
      };
    }
  }

  let bestMatch = null;
  let bestScore = 0;

  knowledgeBase.forEach((entry) => {
    let score = 0;
    entry.keywords.forEach((keyword) => {
      if (normalizedQuery.includes(normalizeText(keyword))) {
        score += keyword.length > 8 ? 3 : 2;
      }
    });
    if (entry.route && pathname.includes(entry.route.replace(/^\//, ""))) {
      score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  });

  if (!bestMatch) {
    const fallback = {
      en: "I can help you find pages like AI Toolkit, Shop, Marketplace, Transport, Rentals, Contract Farming, Cold Storage, Cart, Bookings, and Profile. Ask me where something is or what action to take.",
      hi: "मैं आपको AI Toolkit, Shop, Marketplace, Transport, Rentals, Contract Farming, Cold Storage, Cart, Bookings और Profile जैसे pages ढूँढने में मदद कर सकता हूँ। मुझसे पूछें कि कुछ कहाँ है या कौन सा action लेना है।",
      te: "నేను AI Toolkit, Shop, Marketplace, Transport, Rentals, Contract Farming, Cold Storage, Cart, Bookings మరియు Profile వంటి pages కనుగొనడంలో మీకు సహాయపడగలను. ఏది ఎక్కడ ఉందో లేదా ఏ action తీసుకోవాలో అడగండి.",
    };

    return { answer: fallback[language] || fallback.en, actions: [] };
  }

  const actions = (bestMatch.suggestions || [])
    .map((routeKey) => {
      const path = buildRoute(role, routeKey);
      if (!path) return null;
      return {
        label: createActionLabel(routeKey, language),
        path,
      };
    })
    .filter(Boolean);

  return {
    answer: bestMatch.answer[language] || bestMatch.answer.en,
    actions,
  };
}

