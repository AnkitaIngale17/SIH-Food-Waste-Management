import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  HandHeart,
  Info,
  Leaf,
  Loader2,
  LogIn,
  MapPin,
  PackageOpen,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  UtensilsCrossed,
  XCircle,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";
import { api, apiConfigured } from "./lib/api";

const cream = "#FFF8E7";

const backgroundStyle = {
  backgroundImage:
    "linear-gradient(rgba(245,245,239,0.38), rgba(245,245,239,0.62)), url('/AnnSahay-intro.jpg.jpg')",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat"
};


const LANGUAGE_STORAGE_KEY = "AnnSahay_language";
const LANGUAGE_LOCALES = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN"
};

const translations = {
  hi: {
    "urgency": "तत्कालता",
    "Language": "भाषा",
    "Kitchen/Restaurant": "रसोई/रेस्तरां",
    "Organization": "संगठन",
    "Volunteer": "स्वयंसेवक",
    "Report surplus, view forecasts, and manage food handovers.": "अतिरिक्त भोजन की सूचना दें, पूर्वानुमान देखें और भोजन हस्तांतरण प्रबंधित करें।",
    "Review nearby food offers and accept available food.": "पास के भोजन प्रस्ताव देखें और उपलब्ध भोजन स्वीकार करें।",
    "Pick up assigned food and verify delivery using OTP.": "सौंपा गया भोजन लें और OTP से डिलीवरी सत्यापित करें।",
    "Draft": "ड्राफ्ट",
    "Confirmed": "पुष्ट",
    "Matching": "मिलान हो रहा है",
    "Claimed": "दावा किया गया",
    "In transit": "रास्ते में",
    "Delivered": "डिलीवर किया गया",
    "Loading…": "लोड हो रहा है…",
    "Nothing here yet": "अभी यहाँ कुछ नहीं है",
    "Connect your backend API to load real data.": "वास्तविक डेटा लोड करने के लिए अपना बैकएंड API कनेक्ट करें।",
    "Could not load this page": "यह पेज लोड नहीं हो सका",
    "Please try again.": "कृपया फिर कोशिश करें।",
    "Try again": "फिर कोशिश करें",
    "Who’s signing in?": "कौन साइन इन कर रहा है?",
    "Choose the workspace for this device.": "इस डिवाइस के लिए कार्यक्षेत्र चुनें।",
    "FSSAI-aligned food redistribution · verified handovers": "FSSAI-अनुरूप भोजन पुनर्वितरण · सत्यापित हस्तांतरण",
    "Passwords do not match.": "पासवर्ड मेल नहीं खाते।",
    "Draft": "ड्राफ्ट",
    "Confirmed": "पुष्ट",
    "Matching": "मिलान हो रहा है",
    "Claimed": "दावा किया गया",
    "In transit": "रास्ते में",
    "Delivered": "डिलीवर किया गया",
    "Change role": "भूमिका बदलें",
    "Create {role} account": "{role} खाता बनाएँ",
    "Sign in as {role}": "{role} के रूप में साइन इन करें",
    "Full name": "पूरा नाम",
    "Organisation name": "संगठन का नाम",
    "Phone number": "फ़ोन नंबर",
    "Email address": "ईमेल पता",
    "Password": "पासवर्ड",
    "At least 6 characters": "कम से कम 6 अक्षर",
    "Hide password": "पासवर्ड छिपाएँ",
    "Show password": "पासवर्ड दिखाएँ",
    "Confirm password": "पासवर्ड की पुष्टि करें",
    "Hide confirm password": "पुष्टि वाला पासवर्ड छिपाएँ",
    "Show confirm password": "पुष्टि वाला पासवर्ड दिखाएँ",
    "Create account": "खाता बनाएँ",
    "Sign in": "साइन इन",
    "Already registered?": "पहले से पंजीकृत हैं?",
    "New to अन्नSahay?": "अन्नSahay पर नए हैं?",
    "Create an account": "खाता बनाएँ",
    "Sign out": "साइन आउट",
    "You are signed out": "आप साइन आउट हो चुके हैं",
    "Your local session has been cleared from this device.": "इस डिवाइस से आपका स्थानीय सत्र साफ़ कर दिया गया है।",
    "Choose a login": "लॉगिन चुनें",
    "Dashboard": "डैशबोर्ड",
    "Report": "रिपोर्ट",
    "Impact": "प्रभाव",
    "Compliance": "अनुपालन",
    "Offers": "प्रस्ताव",
    "My pickup": "मेरा पिकअप",
    "Kitchen dashboard": "रसोई डैशबोर्ड",
    "Kitchen workspace": "रसोई कार्यक्षेत्र",
    "Urgent": "तत्काल",
    "Tomorrow’s forecast": "कल का पूर्वानुमान",
    "Predicted surplus load": "अनुमानित अतिरिक्त भोजन",
    "Awaiting kitchen history": "रसोई के इतिहास की प्रतीक्षा है",
    "Surplus risk": "अतिरिक्त भोजन का जोखिम",
    "Not calculated yet": "अभी गणना नहीं हुई",
    "Today’s AI brief": "आज का AI सारांश",
    "A real-time AI brief will appear when kitchen data is connected.": "रसोई डेटा कनेक्ट होने पर रीयल-टाइम AI सारांश दिखाई देगा।",
    "7-day demand forecast": "7-दिन की मांग का पूर्वानुमान",
    "The chart will show only real forecast data from your backend.": "चार्ट में आपके बैकएंड का वास्तविक पूर्वानुमान डेटा ही दिखेगा।",
    "Why this forecast": "यह पूर्वानुमान क्यों",
    "Plain-language reasoning": "सरल भाषा में कारण",
    "Reasons will appear with real forecast data.": "वास्तविक पूर्वानुमान डेटा के साथ कारण दिखाई देंगे।",
    "Active listings": "सक्रिय लिस्टिंग",
    "Everything reported today, across every channel": "आज रिपोर्ट की गई सभी चीज़ें, हर चैनल से",
    "+ New": "+ नया",
    "Low": "कम",
    "Low urgency": "कम प्राथमिकता",
    "No listings yet": "अभी कोई लिस्टिंग नहीं है",
    "Report available surplus and start matching it with nearby organisations.": "उपलब्ध अतिरिक्त भोजन की रिपोर्ट करें और पास के संगठनों से उसका मिलान शुरू करें।",
    "Report surplus": "अतिरिक्त भोजन की रिपोर्ट करें",
    "Report surplus via text or browser microphone": "टेक्स्ट या ब्राउज़र माइक्रोफ़ोन से अतिरिक्त भोजन की रिपोर्ट करें",
    "Quick Voice Input (Speak to Fill)": "त्वरित वॉइस इनपुट (बोलकर भरें)",
    "Tap the button and say:": "बटन दबाएँ और कहें:",
    "Listening... Speak now": "सुन रहा है... अब बोलें",
    "Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.": "इस ब्राउज़र में वॉइस पहचान समर्थित नहीं है। कृपया Chrome, Edge या Safari इस्तेमाल करें।",
    "Voice details extracted and populated into the form!": "वॉइस विवरण निकाले गए और फ़ॉर्म में भर दिए गए हैं!",
    "Could not process voice input with backend.": "बैकएंड से वॉइस इनपुट संसाधित नहीं हो सका।",
    "This form is ready for the real backend API.": "यह फ़ॉर्म वास्तविक बैकएंड API के लिए तैयार है।",
    "Listening... (Tap to stop)": "सुन रहा है... (रोकने के लिए दबाएँ)",
    "🎙️ Speak to Report": "🎙️ बोलकर रिपोर्ट करें",
    "Food item": "भोजन का प्रकार",
    "Quantity": "मात्रा",
    "Unit": "इकाई",
    "Cooked at": "पकाया गया",
    "Pickup by": "पिकअप समय",
    "Notes": "नोट्स",
    "Start urgent matching": "तत्काल मिलान शुरू करें",
    "Publish listing": "लिस्टिंग प्रकाशित करें",
    "Map awaits real locations": "मानचित्र वास्तविक स्थानों की प्रतीक्षा कर रहा है",
    "Pickup and recipient pins will appear when the backend sends coordinates.": "बैकएंड निर्देशांक भेजने पर पिकअप और प्राप्तकर्ता के पिन दिखाई देंगे।",
    "Kitchen pickup": "रसोई पिकअप",
    "Restaurant location": "रेस्तरां का स्थान",
    "Urgent matching will start when the backend API is connected.": "बैकएंड API कनेक्ट होने पर तत्काल मिलान शुरू होगा।",
    "Live urgent matching has started.": "लाइव तत्काल मिलान शुरू हो गया है।",
    "Listing status": "लिस्टिंग स्थिति",
    "Track every handover": "हर हस्तांतरण ट्रैक करें",
    "Listing unavailable": "लिस्टिंग उपलब्ध नहीं है",
    "Create a surplus listing first.": "पहले अतिरिक्त भोजन की लिस्टिंग बनाएँ।",
    "Dashboard": "डैशबोर्ड",
    "Handover progress": "हस्तांतरण की प्रगति",
    "Incoming offers": "आने वाले प्रस्ताव",
    "Surplus food near you, matched in real time": "आपके पास का अतिरिक्त भोजन, रीयल-टाइम में मिलान किया गया",
    "Checking offers…": "प्रस्ताव जाँचे जा रहे हैं…",
    "Handover Verification Code": "हस्तांतरण सत्यापन कोड",
    "Provide this 4-digit code to the volunteer when they arrive for collection.": "कलेक्शन के लिए स्वयंसेवक आने पर यह 4-अंकीय कोड उन्हें दें।",
    "Offer accepted! Share the 4-digit Handover Code below with the volunteer.": "प्रस्ताव स्वीकार हुआ! नीचे दिया गया 4-अंकीय हस्तांतरण कोड स्वयंसेवक के साथ साझा करें।",
    "This action is ready for the backend.": "यह कार्रवाई बैकएंड के लिए तैयार है।",
    "No offers right now": "अभी कोई प्रस्ताव नहीं है",
    "Nearby kitchen offers will arrive here the moment they are matched.": "मिलान होते ही पास की रसोई के प्रस्ताव यहाँ दिखाई देंगे।",
    "Kitchen": "रसोई",
    "Decline": "अस्वीकार करें",
    "Accept": "स्वीकार करें",
    "Enter the four-digit code from the restaurant.": "रेस्तरां से मिला चार-अंकीय कोड दर्ज करें।",
    "OTP verification will work once the backend API is connected.": "बैकएंड API कनेक्ट होने पर OTP सत्यापन काम करेगा।",
    "Delivery verified successfully.": "डिलीवरी सफलतापूर्वक सत्यापित हुई।",
    "Your pickup": "आपका पिकअप",
    "Volunteer workspace": "स्वयंसेवक कार्यक्षेत्र",
    "Loading assigned pickup…": "सौंपा गया पिकअप लोड हो रहा है…",
    "No pickup assigned yet": "अभी कोई पिकअप सौंपा नहीं गया है",
    "Your next kitchen collection and delivery will appear here.": "आपका अगला रसोई कलेक्शन और डिलीवरी यहाँ दिखाई देगा।",
    "Load": "लोड",
    "Confirm handover": "हस्तांतरण की पुष्टि करें",
    "Ask the restaurant representative to read their four-digit code.": "रेस्तरां प्रतिनिधि से उनका चार-अंकीय कोड बताने को कहें।",
    "Verify delivery": "डिलीवरी सत्यापित करें",
    "Every figure explains how it was calculated": "हर आँकड़ा बताता है कि उसकी गणना कैसे हुई",
    "Calculating impact…": "प्रभाव की गणना हो रही है…",
    "Meals redistributed": "पुनर्वितरित भोजन",
    "Verified delivered quantity divided by the configured serving size.": "सत्यापित डिलीवरी की मात्रा को निर्धारित सर्विंग आकार से विभाजित किया गया है।",
    "Waste prevented": "बचा हुआ कचरा",
    "Total weight from OTP-verified deliveries.": "OTP-सत्यापित डिलीवरी का कुल वज़न।",
    "Rupees saved": "बचाए गए रुपये",
    "Replacement meal cost multiplied by verified meals.": "प्रतिस्थापन भोजन की लागत को सत्यापित भोजन की संख्या से गुणा किया गया है।",
    "Meals redistributed — trend": "पुनर्वितरित भोजन — रुझान",
    "Trend awaits verified deliveries": "रुझान सत्यापित डिलीवरी की प्रतीक्षा कर रहा है",
    "This chart will use only real completed handovers.": "यह चार्ट केवल वास्तविक पूर्ण हस्तांतरण का उपयोग करेगा।",
    "Server export failed": "सर्वर से एक्सपोर्ट विफल हुआ",
    "Compliance register": "अनुपालन रजिस्टर",
    "FSSAI surplus-food handover log — OTP-verified deliveries": "FSSAI अतिरिक्त-भोजन हस्तांतरण लॉग — OTP-सत्यापित डिलीवरी",
    "Reference ID": "संदर्भ ID",
    "Date": "तारीख",
    "Recipient": "प्राप्तकर्ता",
    "Food Item": "भोजन का प्रकार",
    "Page not found": "पेज नहीं मिला",
    "Go to login": "लॉगिन पर जाएँ",
    "Could not download {format}. Please ensure you are logged in.": "{format} डाउनलोड नहीं हो सका। कृपया सुनिश्चित करें कि आप लॉग इन हैं।",
    "Allergens, packaging, gate instructions…": "एलर्जेन, पैकेजिंग, गेट निर्देश…",
    "e.g. Vegetable pulao": "जैसे, वेजिटेबल पुलाव",
    "Kitchen workspace": "रसोई कार्यक्षेत्र",
    "Surplus risk": "अतिरिक्त भोजन का जोखिम",
    "Not calculated yet": "अभी गणना नहीं हुई",
    "Load": "लोड",
    "Confirm handover": "हस्तांतरण की पुष्टि करें",
    "Pickup by": "पिकअप समय",
    "Kitchen": "रसोई",
    "Start urgent matching": "तत्काल मिलान शुरू करें",
    "Publish listing": "लिस्टिंग प्रकाशित करें",
    "kg": "किग्रा",
    "servings": "सर्विंग",
    "packets": "पैकेट",
    "plates": "प्लेट",
    "trays": "ट्रे",
    "meals": "भोजन",
    "boxes": "बॉक्स",
    "Mon": "सोम",
    "Tue": "मंगल",
    "Wed": "बुध",
    "Thu": "गुरु",
    "Fri": "शुक्र",
    "Sat": "शनि",
    "Sun": "रवि",
    "Monday": "सोमवार",
    "Tuesday": "मंगलवार",
    "Wednesday": "बुधवार",
    "Thursday": "गुरुवार",
    "Friday": "शुक्रवार",
    "Saturday": "शनिवार",
    "Sunday": "रविवार",
    "High": "उच्च",
    "Medium": "मध्यम",
    "High urgency": "उच्च प्राथमिकता",
    "Medium urgency": "मध्यम प्राथमिकता",
    "Day 1": "दिन 1",
    "Day 2": "दिन 2",
    "Day 3": "दिन 3",
    "Day 4": "दिन 4",
    "Day 5": "दिन 5",
    "Day 6": "दिन 6",
    "Day 7": "दिन 7",
    "We have 25 kg of vegetable pulao ready by 9 pm": "रात 9 बजे तक 25 किग्रा वेजिटेबल पुलाव तैयार है",
    "Change role": "भूमिका बदलें"
  },
  mr: {
    "urgency": "तातडी",
    "Language": "भाषा",
    "Kitchen/Restaurant": "स्वयंपाकघर/रेस्टॉरंट",
    "Organization": "संस्था",
    "Volunteer": "स्वयंसेवक",
    "Report surplus, view forecasts, and manage food handovers.": "उरलेल्या अन्नाची नोंद करा, अंदाज पहा आणि अन्न हस्तांतरण व्यवस्थापित करा.",
    "Review nearby food offers and accept available food.": "जवळचे अन्न प्रस्ताव पहा आणि उपलब्ध अन्न स्वीकारा.",
    "Pick up assigned food and verify delivery using OTP.": "नेमून दिलेले अन्न घ्या आणि OTP वापरून डिलिव्हरी सत्यापित करा.",
    "Draft": "मसुदा",
    "Confirmed": "पुष्टी केलेले",
    "Matching": "जुळवणी सुरू",
    "Claimed": "स्वीकारलेले",
    "In transit": "मार्गावर",
    "Delivered": "पोहोचवलेले",
    "Loading…": "लोड होत आहे…",
    "Nothing here yet": "अजून येथे काहीही नाही",
    "Connect your backend API to load real data.": "खरा डेटा लोड करण्यासाठी तुमचे बॅकएंड API कनेक्ट करा.",
    "Could not load this page": "हे पेज लोड करता आले नाही",
    "Please try again.": "कृपया पुन्हा प्रयत्न करा.",
    "Try again": "पुन्हा प्रयत्न करा",
    "Who’s signing in?": "कोण साइन इन करत आहे?",
    "Choose the workspace for this device.": "या डिव्हाइससाठी कार्यक्षेत्र निवडा.",
    "FSSAI-aligned food redistribution · verified handovers": "FSSAI-अनुरूप अन्न पुनर्वितरण · सत्यापित हस्तांतरण",
    "Passwords do not match.": "पासवर्ड जुळत नाहीत.",
    "Draft": "मसुदा",
    "Confirmed": "पुष्टी",
    "Matching": "जुळणी सुरू आहे",
    "Claimed": "दावा केलेले",
    "In transit": "मार्गावर",
    "Delivered": "वितरित",
    "Change role": "भूमिका बदला",
    "Create {role} account": "{role} खाते तयार करा",
    "Sign in as {role}": "{role} म्हणून साइन इन करा",
    "Full name": "पूर्ण नाव",
    "Organisation name": "संस्थेचे नाव",
    "Phone number": "फोन नंबर",
    "Email address": "ईमेल पत्ता",
    "Password": "पासवर्ड",
    "At least 6 characters": "किमान 6 अक्षरे",
    "Hide password": "पासवर्ड लपवा",
    "Show password": "पासवर्ड दाखवा",
    "Confirm password": "पासवर्डची पुष्टी करा",
    "Hide confirm password": "पुष्टीचा पासवर्ड लपवा",
    "Show confirm password": "पुष्टीचा पासवर्ड दाखवा",
    "Create account": "खाते तयार करा",
    "Sign in": "साइन इन",
    "Already registered?": "आधीच नोंदणी केली आहे?",
    "New to अन्नSahay?": "अन्नSahay वर नवीन आहात?",
    "Create an account": "खाते तयार करा",
    "Sign out": "साइन आउट",
    "You are signed out": "तुम्ही साइन आउट केले आहे",
    "Your local session has been cleared from this device.": "या डिव्हाइसवरील तुमचे स्थानिक सत्र साफ केले आहे.",
    "Choose a login": "लॉगिन निवडा",
    "Dashboard": "डॅशबोर्ड",
    "Report": "रिपोर्ट",
    "Impact": "परिणाम",
    "Compliance": "अनुपालन",
    "Offers": "प्रस्ताव",
    "My pickup": "माझा पिकअप",
    "Kitchen dashboard": "स्वयंपाकघर डॅशबोर्ड",
    "Kitchen workspace": "स्वयंपाकघर कार्यक्षेत्र",
    "Urgent": "तातडीचे",
    "Tomorrow’s forecast": "उद्याचा अंदाज",
    "Predicted surplus load": "अंदाजित उरलेले अन्न",
    "Awaiting kitchen history": "स्वयंपाकघराच्या इतिहासाची प्रतीक्षा आहे",
    "Surplus risk": "उरलेल्या अन्नाचा धोका",
    "Not calculated yet": "अजून गणना झालेली नाही",
    "Today’s AI brief": "आजचा AI सारांश",
    "A real-time AI brief will appear when kitchen data is connected.": "स्वयंपाकघराचा डेटा कनेक्ट झाल्यावर रिअल-टाइम AI सारांश दिसेल.",
    "7-day demand forecast": "७ दिवसांचा मागणी अंदाज",
    "The chart will show only real forecast data from your backend.": "चार्टमध्ये तुमच्या बॅकएंडमधील खरा अंदाज डेटा दाखवला जाईल.",
    "Why this forecast": "हा अंदाज का",
    "Plain-language reasoning": "सोप्या भाषेतील कारणे",
    "Reasons will appear with real forecast data.": "खरा अंदाज डेटा उपलब्ध झाल्यावर कारणे दिसतील.",
    "Active listings": "सक्रिय लिस्टिंग",
    "Everything reported today, across every channel": "आज सर्व चॅनेलवर नोंदवलेले सर्व काही",
    "+ New": "+ नवीन",
    "Low": "कमी",
    "No listings yet": "अजून लिस्टिंग नाहीत",
    "Report available surplus and start matching it with nearby organisations.": "उपलब्ध उरलेल्या अन्नाची नोंद करा आणि जवळच्या संस्थांशी जुळवणी सुरू करा.",
    "Report surplus": "उरलेल्या अन्नाची नोंद करा",
    "Report surplus via text or browser microphone": "टेक्स्ट किंवा ब्राउझर मायक्रोफोनद्वारे उरलेल्या अन्नाची नोंद करा",
    "Quick Voice Input (Speak to Fill)": "त्वरित व्हॉइस इनपुट (बोलून भरा)",
    "Tap the button and say:": "बटण दाबा आणि म्हणा:",
    "Listening... Speak now": "ऐकत आहे... आता बोला",
    "Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.": "या ब्राउझरमध्ये व्हॉइस ओळख समर्थित नाही. कृपया Chrome, Edge किंवा Safari वापरा.",
    "Voice details extracted and populated into the form!": "व्हॉइस तपशील काढून फॉर्ममध्ये भरले आहेत!",
    "Could not process voice input with backend.": "बॅकएंडकडून व्हॉइस इनपुट प्रक्रिया करता आली नाही.",
    "This form is ready for the real backend API.": "हा फॉर्म खऱ्या बॅकएंड API साठी तयार आहे.",
    "Listening... (Tap to stop)": "ऐकत आहे... (थांबवण्यासाठी दाबा)",
    "🎙️ Speak to Report": "🎙️ बोलून नोंद करा",
    "Food item": "अन्नाचा प्रकार",
    "Quantity": "प्रमाण",
    "Unit": "एकक",
    "Cooked at": "शिजवलेले",
    "Pickup by": "पिकअप वेळ",
    "Notes": "नोंदी",
    "Start urgent matching": "तातडीची जुळवणी सुरू करा",
    "Publish listing": "लिस्टिंग प्रकाशित करा",
    "Map awaits real locations": "नकाशा खऱ्या ठिकाणांची प्रतीक्षा करत आहे",
    "Pickup and recipient pins will appear when the backend sends coordinates.": "बॅकएंड निर्देशांक पाठवल्यावर पिकअप आणि प्राप्तकर्त्याचे पिन दिसतील.",
    "Kitchen pickup": "स्वयंपाकघर पिकअप",
    "Restaurant location": "रेस्टॉरंटचे ठिकाण",
    "Urgent matching will start when the backend API is connected.": "बॅकएंड API कनेक्ट झाल्यावर तातडीची जुळवणी सुरू होईल.",
    "Live urgent matching has started.": "लाइव्ह तातडीची जुळवणी सुरू झाली आहे.",
    "Listing status": "लिस्टिंग स्थिती",
    "Track every handover": "प्रत्येक हस्तांतरणाचा मागोवा घ्या",
    "Listing unavailable": "लिस्टिंग उपलब्ध नाही",
    "Create a surplus listing first.": "प्रथम उरलेल्या अन्नाची लिस्टिंग तयार करा.",
    "Handover progress": "हस्तांतरणाची प्रगती",
    "Incoming offers": "येणारे प्रस्ताव",
    "Surplus food near you, matched in real time": "तुमच्या जवळचे उरलेले अन्न, रिअल-टाइममध्ये जुळवलेले",
    "Checking offers…": "प्रस्ताव तपासत आहे…",
    "Handover Verification Code": "हस्तांतरण सत्यापन कोड",
    "Provide this 4-digit code to the volunteer when they arrive for collection.": "संकलनासाठी स्वयंसेवक आल्यावर हा ४-अंकी कोड त्यांना द्या.",
    "Offer accepted! Share the 4-digit Handover Code below with the volunteer.": "प्रस्ताव स्वीकारला! खालील ४-अंकी हस्तांतरण कोड स्वयंसेवकासोबत शेअर करा.",
    "This action is ready for the backend.": "ही कृती बॅकएंडसाठी तयार आहे.",
    "No offers right now": "सध्या कोणतेही प्रस्ताव नाहीत",
    "Nearby kitchen offers will arrive here the moment they are matched.": "जुळवणी होताच जवळच्या स्वयंपाकघराचे प्रस्ताव येथे दिसतील.",
    "Kitchen": "स्वयंपाकघर",
    "Decline": "नकार द्या",
    "Accept": "स्वीकारा",
    "Enter the four-digit code from the restaurant.": "रेस्टॉरंटकडून मिळालेला चार-अंकी कोड प्रविष्ट करा.",
    "OTP verification will work once the backend API is connected.": "बॅकएंड API कनेक्ट झाल्यावर OTP सत्यापन काम करेल.",
    "Delivery verified successfully.": "डिलिव्हरी यशस्वीरित्या सत्यापित झाली.",
    "Your pickup": "तुमचा पिकअप",
    "Volunteer workspace": "स्वयंसेवक कार्यक्षेत्र",
    "Loading assigned pickup…": "नेमलेला पिकअप लोड होत आहे…",
    "No pickup assigned yet": "अजून पिकअप नेमलेला नाही",
    "Your next kitchen collection and delivery will appear here.": "तुमचे पुढील स्वयंपाकघर संकलन आणि डिलिव्हरी येथे दिसेल.",
    "Load": "लोड",
    "Confirm handover": "हस्तांतरणाची पुष्टी करा",
    "Ask the restaurant representative to read their four-digit code.": "रेस्टॉरंट प्रतिनिधीला त्यांचा चार-अंकी कोड सांगण्यास सांगा.",
    "Verify delivery": "डिलिव्हरी सत्यापित करा",
    "Every figure explains how it was calculated": "प्रत्येक आकडा कसा मोजला गेला हे येथे स्पष्ट केले आहे",
    "Calculating impact…": "परिणामाची गणना होत आहे…",
    "Meals redistributed": "पुनर्वितरित जेवणे",
    "Verified delivered quantity divided by the configured serving size.": "सत्यापित डिलिव्हरीचे प्रमाण निश्चित सर्व्हिंग आकाराने भागले आहे.",
    "Waste prevented": "वाचवलेला कचरा",
    "Total weight from OTP-verified deliveries.": "OTP-सत्यापित डिलिव्हरीचे एकूण वजन.",
    "Rupees saved": "वाचवलेले रुपये",
    "Replacement meal cost multiplied by verified meals.": "पर्यायी जेवणाची किंमत सत्यापित जेवणांच्या संख्येने गुणली आहे.",
    "Meals redistributed — trend": "पुनर्वितरित जेवणे — कल",
    "Trend awaits verified deliveries": "कल सत्यापित डिलिव्हरीची प्रतीक्षा करत आहे",
    "This chart will use only real completed handovers.": "हा चार्ट फक्त प्रत्यक्ष पूर्ण झालेल्या हस्तांतरणांचा वापर करेल.",
    "Server export failed": "सर्व्हर एक्सपोर्ट अयशस्वी झाला",
    "Compliance register": "अनुपालन नोंदवही",
    "FSSAI surplus-food handover log — OTP-verified deliveries": "FSSAI उरलेले-अन्न हस्तांतरण नोंद — OTP-सत्यापित डिलिव्हरी",
    "Reference ID": "संदर्भ ID",
    "Date": "तारीख",
    "Recipient": "प्राप्तकर्ता",
    "Food Item": "अन्नाचा प्रकार",
    "Page not found": "पेज सापडले नाही",
    "Go to login": "लॉगिनवर जा",
    "Could not download {format}. Please ensure you are logged in.": "{format} डाउनलोड करता आले नाही. कृपया तुम्ही लॉग इन आहात याची खात्री करा.",
    "Allergens, packaging, gate instructions…": "अॅलर्जन्स, पॅकेजिंग, गेट सूचना…",
    "e.g. Vegetable pulao": "उदा. व्हेजिटेबल पुलाव",
    "Kitchen workspace": "स्वयंपाकघर कार्यक्षेत्र",
    "Surplus risk": "उरलेल्या अन्नाचा धोका",
    "Not calculated yet": "अद्याप गणना झालेली नाही",
    "Load": "लोड",
    "Confirm handover": "हस्तांतरणाची पुष्टी करा",
    "Pickup by": "पिकअप वेळ",
    "Kitchen": "स्वयंपाकघर",
    "Start urgent matching": "तातडीचे जुळवणी सुरू करा",
    "Publish listing": "लिस्टिंग प्रकाशित करा",
    "kg": "किलो",
    "servings": "सर्व्हिंग्स",
    "packets": "पॅकेट्स",
    "plates": "प्लेट्स",
    "trays": "ट्रे",
    "meals": "जेवणे",
    "boxes": "बॉक्सेस",
    "Mon": "सोम",
    "Tue": "मंगळ",
    "Wed": "बुध",
    "Thu": "गुरु",
    "Fri": "शुक्र",
    "Sat": "शनि",
    "Sun": "रवि",
    "Monday": "सोमवार",
    "Tuesday": "मंगळवार",
    "Wednesday": "बुधवार",
    "Thursday": "गुरुवार",
    "Friday": "शुक्रवार",
    "Saturday": "शनिवार",
    "Sunday": "रविवार",
    "High": "उच्च",
    "Medium": "मध्यम",
    "High urgency": "उच्च तातडी",
    "Medium urgency": "मध्यम तातडी",
    "Day 1": "दिवस 1",
    "Day 2": "दिवस 2",
    "Day 3": "दिवस 3",
    "Day 4": "दिवस 4",
    "Day 5": "दिवस 5",
    "Day 6": "दिवस 6",
    "Day 7": "दिवस 7",
    "We have 25 kg of vegetable pulao ready by 9 pm": "रात्री 9 वाजेपर्यंत 25 किलो व्हेजिटेबल पुलाव तयार आहे",
    "Change role": "भूमिका बदला"
  }
};

let currentLanguage =
  localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";

function t(text, values = {}) {
  const translated = translations[currentLanguage]?.[text] || text;
  return translated.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
}

function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

function locale() {
  return LANGUAGE_LOCALES[currentLanguage] || LANGUAGE_LOCALES.en;
}

function translateUnit(unit) {
  return unit ? t(unit) : unit;
}

function translateForecastLabel(label) {
  if (label == null) return label;
  const value = String(label);

  // Keep ISO/date-like labels localized using the selected locale.
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat(locale(), {
        month: "short",
        day: "numeric"
      }).format(date);
    }
  }

  // Forecast APIs commonly return weekday labels such as Mon or Monday.
  return t(value);
}

function translateBackendText(value) {
  if (typeof value !== "string") return value;
  return t(value);
}

function LanguageSwitcher({ language, onChange }) {
  return (
    <div className="fixed right-4 top-4 z-50">
      <select
        value={language}
        onChange={(event) => onChange(event.target.value)}
        aria-label={t("Language")}
        className="rounded-md border border-[#d6d6c9] bg-white px-3 py-2 text-xs font-semibold text-[#173f2e] shadow-sm"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="mr">मराठी</option>
      </select>
    </div>
  );
}

const roles = {
  kitchen: {
    title: "Kitchen/Restaurant",
    description: "Report surplus, view forecasts, and manage food handovers.",
    icon: Store,
    home: "/kitchen/dashboard"
  },
  restaurant: {
    title: "Organization",
    description: "Review nearby food offers and accept available food.",
    icon: HandHeart,
    home: "/restaurant/offers"
  },
  volunteer: {
    title: "Volunteer",
    description: "Pick up assigned food and verify delivery using OTP.",
    icon: Truck,
    home: "/volunteer/pickup/assigned"
  }
};

const stages = [
  "draft",
  "confirmed",
  "matching",
  "claimed",
  "in_transit",
  "delivered"
];

const stageNames = {
  draft: "Draft",
  confirmed: "Confirmed",
  matching: "Matching",
  claimed: "Claimed",
  in_transit: "In transit",
  delivered: "Delivered"
};

const urgencyStyles = {
  high: "bg-red-50 text-red-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-emerald-50 text-emerald-700"
};

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? response;
}

function list(value) {
  return Array.isArray(value) ? value : value?.items || value?.data || [];
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat(locale(), {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatNumber(value) {
  return typeof value === "number"
    ? new Intl.NumberFormat(locale()).format(value)
    : "—";
}

function useApi(loader, key) {
  const [state, setState] = useState({
    loading: true,
    data: null,
    error: null,
    offline: false
  });

  async function reload() {
    setState((old) => ({ ...old, loading: true, error: null }));

    try {
      const result = await loader();

      setState({
        loading: false,
        data: unwrap(result),
        error: null,
        offline: Boolean(result?.offline)
      });
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error,
        offline: false
      });
    }
  }

  useEffect(() => {
    reload();
  }, [key]);

  return { ...state, reload };
}

function Brand() {
  return (
    <Link to="/login" className="inline-flex items-center gap-2 text-[#173f2e]">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-[#173f2e] text-white">
        <Leaf className="h-5 w-5" />
      </span>
      <span className="font-serif text-2xl font-semibold">अन्नSahay</span>
    </Link>
  );
}

function Loading({ text = t("Loading…") }) {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#173f2e]" />
        <p className="mt-3 text-sm text-[#667268]">{text}</p>
      </div>
    </div>
  );
}

function EmptyState({
  title = t("Nothing here yet"),
  text,
  Icon = PackageOpen,
  offline,
  action
}) {
  return (
    <div className="card grid min-h-52 place-items-center text-center">
      <div>
        <Icon className="mx-auto mb-3 h-7 w-7 text-[#173f2e]" />
        <h3 className="text-xl">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#667268]">
          {text}
        </p>

        {offline && (
          <p className="mt-3 text-xs text-[#7a857d]">
            {t("Connect your backend API to load real data.")}
          </p>
        )}

        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}

function ErrorState({ error, reload }) {
  return (
    <div className="card text-center">
      <h3 className="text-xl">{t("Could not load this page")}</h3>

      <p className="mt-2 text-sm text-red-700">
        {translateBackendText(error?.message || t("Please try again."))}
      </p>

      <button onClick={reload} className="btn-secondary mt-4">
        <RefreshCw className="h-4 w-4" />
        {t("Try again")}
      </button>
    </div>
  );
}

function InfoTip({ children }) {
  return (
    <span className="group relative inline-flex cursor-help">
      <Info className="h-3.5 w-3.5 text-[#7a857d]" />

      <span className="pointer-events-none absolute bottom-5 left-1/2 z-30 hidden w-52 -translate-x-1/2 rounded bg-[#173f2e] p-2 text-center text-xs text-white group-hover:block">
        {children}
      </span>
    </span>
  );
}

function RoleDropdown({ role }) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <select
        value={role}
        onChange={(event) => navigate(`/login/${event.target.value}`)}
        className="appearance-none rounded-md border border-[#d6d6c9] bg-white py-2 pl-3 pr-8 text-xs font-semibold text-[#173f2e]"
      >
        <option value="kitchen">{t("Kitchen/Restaurant")}</option>
        <option value="restaurant">{t("Organization")}</option>
        <option value="volunteer">{t("Volunteer")}</option>
      </select>

      <ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-[#173f2e]" />
    </div>
  );
}

function RolePicker() {
  return (
    <main
      className="grid min-h-screen place-items-center p-4"
      style={backgroundStyle}
    >
      <div className="w-full max-w-[430px]">
        <div className="mb-7 text-center">
          <Brand />
        </div>

        <section
          className="rounded-xl border border-[#eadfca] p-7 shadow-xl"
          style={{ backgroundColor: cream }}
        >
          <h1 className="text-2xl">{t("Who’s signing in?")}</h1>

          <p className="mt-1 text-sm text-[#667268]">
            {t("Choose the workspace for this device.")}
          </p>

          <div className="mt-5 space-y-2">
            {Object.entries(roles).map(([key, role]) => {
              const Icon = role.icon;

              return (
                <Link
                  key={key}
                  to={`/login/${key}`}
                  className="flex items-center gap-3 rounded-lg border border-[#ddd4bf] p-3 transition hover:border-[#173f2e] hover:bg-[#f5eedc]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded bg-[#e8eee5] text-[#173f2e]">
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="flex-1">
                    <strong className="block text-sm">{t(role.title)}</strong>

                    <span className="block text-xs leading-5 text-[#667268]">
                      {t(role.description)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <p className="mt-4 text-center text-xs text-[#324b3d]">
          {t("FSSAI-aligned food redistribution · verified handovers")}
        </p>
      </div>
    </main>
  );
}

function AuthPage({ mode }) {
  const { role } = useParams();
  const navigate = useNavigate();

  const selectedRole = roles[role] || roles.kitchen;
  const Icon = selectedRole.icon;
  const isSignup = mode === "signup";

  const [form, setForm] = useState({
    fullName: "",
    organisationName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function update(name, value) {
    setForm({ ...form, [name]: value });
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");

    if (isSignup && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = isSignup
        ? await api.signup({
            fullName: form.fullName,
            organisationName: form.organisationName,
            email: form.email,
            phone: form.phone,
            password: form.password,
            role
          })
        : await api.login({
            email: form.email,
            password: form.password,
            role
          });

      if (response.offline) {
        navigate(selectedRole.home);
        return;
      }

      const data = unwrap(response);

      if (data?.accessToken) {
        localStorage.setItem("AnnSahay_access_token", data.accessToken);
      }

      navigate(selectedRole.home);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main
      className="grid min-h-screen place-items-center p-4"
      style={backgroundStyle}
    >
      <div className="w-full max-w-[430px]">
        <div className="mb-7 flex items-center justify-between">
          <Brand />

          <RoleDropdown role={role || "kitchen"} />
        </div>

        <form
          onSubmit={submit}
          className="rounded-xl border border-[#eadfca] p-7 shadow-xl"
          style={{ backgroundColor: cream }}
        >
          <Link to="/login" className="text-xs text-[#667268]">
            ← {t("Change role")}
          </Link>

          <div className="mt-5 flex items-center gap-2">
            <Icon className="h-5 w-5 text-[#173f2e]" />

            <h1 className="text-2xl">
              {isSignup
                ? t("Create {role} account", { role: t(selectedRole.title).toLowerCase() })
                : t("Sign in as {role}", { role: t(selectedRole.title).toLowerCase() })}
            </h1>
          </div>

          <p className="mt-2 text-sm text-[#667268]">
            {t(selectedRole.description)}
          </p>

          {isSignup && (
            <>
              <label className="mt-5 block text-xs font-semibold">
                {t("Full name")}

                <input
                  required
                  className="input"
                  value={form.fullName}
                  onChange={(event) =>
                    update("fullName", event.target.value)
                  }
                />
              </label>

              {role !== "volunteer" && (
                <label className="mt-4 block text-xs font-semibold">
                  {t("Organisation name")}

                  <input
                    required
                    className="input"
                    value={form.organisationName}
                    onChange={(event) =>
                      update("organisationName", event.target.value)
                    }
                  />
                </label>
              )}

              <label className="mt-4 block text-xs font-semibold">
                {t("Phone number")}

                <input
                  required
                  type="tel"
                  className="input"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(event) =>
                    update("phone", event.target.value)
                  }
                />
              </label>
            </>
          )}

          <label className="mt-5 block text-xs font-semibold">
            {t("Email address")}

            <input
              required
              type="email"
              className="input"
              placeholder="name@organisation.org"
              value={form.email}
              onChange={(event) =>
                update("email", event.target.value)
              }
            />
          </label>

          <label className="mt-4 block text-xs font-semibold">
            {t("Password")}

            <div className="relative mt-1.5">
              <input
                required
                type={showPassword ? "text" : "password"}
                minLength="6"
                className="input mt-0 pr-10"
                placeholder={t("At least 6 characters")}
                value={form.password}
                onChange={(event) =>
                  update("password", event.target.value)
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667268] hover:text-[#173f2e]"
                aria-label={
                  showPassword ? t("Hide password") : t("Show password")
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          {isSignup && (
            <label className="mt-4 block text-xs font-semibold">
              {t("Confirm password")}

              <div className="relative mt-1.5">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  minLength="6"
                  className="input mt-0 pr-10"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    update("confirmPassword", event.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667268] hover:text-[#173f2e]"
                  aria-label={
                    showConfirmPassword
                      ? t("Hide confirm password")
                      : t("Show confirm password")
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>
          )}

          {message && (
            <p className="mt-3 text-xs text-red-700">{message}</p>
          )}

          <button className="btn-primary mt-5 w-full">
            {isSignup ? "Create account" : "Sign in"}
          </button>

          <p className="mt-5 text-center text-xs text-[#667268]">
            {isSignup ? "Already registered?" : "New to अन्नSahay?"}{" "}

            <Link
              to={
                isSignup
                  ? `/login/${role}`
                  : `/signup/${role}`
              }
              className="font-bold text-[#173f2e]"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

function SignOutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("AnnSahay_access_token");
  }, []);

  return (
    <main
      className="grid min-h-screen place-items-center p-4"
      style={backgroundStyle}
    >
      <section
        className="w-full max-w-[430px] rounded-xl border border-[#eadfca] p-7 text-center shadow-xl"
        style={{ backgroundColor: cream }}
      >
        <ShieldCheck className="mx-auto h-9 w-9 text-[#173f2e]" />

        <h1 className="mt-4 text-2xl">{t("You are signed out")}</h1>

        <p className="mt-2 text-sm text-[#667268]">
          {t("Your local session has been cleared from this device.")}
        </p>

        <button
          onClick={() => navigate("/login")}
          className="btn-primary mt-6"
        >
          {t("Choose a login")}
        </button>
      </section>
    </main>
  );
}

function Shell({ title, subtitle, role, children, action }) {
  const links =
    role === "kitchen"
      ? [
          ["/kitchen/dashboard", t("Dashboard"), Store],
          ["/kitchen/report-surplus", t("Report"), ClipboardList],
          ["/impact", t("Impact"), Sparkles],
          ["/compliance", t("Compliance"), ShieldCheck]
        ]
      : role === "restaurant"
      ? [
          ["/restaurant/offers", t("Offers"), HandHeart],
          ["/signout", t("Sign out"), LogIn]
        ]
      : [
          ["/volunteer/pickup/assigned", t("My pickup"), Truck],
          ["/signout", t("Sign out"), LogIn]
        ];

  return (
    <div className="min-h-screen bg-[#f5f5ef]">
      <header className="border-b bg-[#f5f5ef]">
        <div className="mx-auto flex max-w-[700px] items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-[25px]">{title}</h1>
            <p className="text-xs text-[#667268]">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            {action}

            <Link
              to="/signout"
              className="btn-secondary px-3 py-2 text-xs"
            >
              {t("Sign out")}
            </Link>
          </div>
        </div>
      </header>

      <main className="page">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t bg-white py-2">
        {links.map(([path, label, Icon]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex min-w-16 flex-col items-center gap-1 text-[10px] ${
                isActive
                  ? "text-[#173f2e]"
                  : "text-[#7e887f]"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function KitchenDashboard() {
  const resource = useApi(
    api.kitchenDashboard,
    "kitchen-dashboard"
  );

  const navigate = useNavigate();
  const dashboard = resource.data || {};
  const listings = list(dashboard.listings);

  return (
    <Shell
      title={dashboard.kitchenName || t("Kitchen dashboard")}
      subtitle={t("Kitchen workspace")}
      role="kitchen"
      action={
        <button
          onClick={() =>
            navigate("/kitchen/report-surplus?urgent=1")
          }
          className="btn-primary bg-[#c9981e] text-[#173f2e]"
        >
          <Zap className="h-4 w-4" />
          {t("Urgent")}
        </button>
      }
    >
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState {...resource} />
      ) : (
        <>
          <section className="space-y-3">
            <div className="card border-l-2 border-l-[#173f2e]">
              <h3>{t("Tomorrow’s forecast")}</h3>

              <p className="eyebrow">
                {t("Predicted surplus load")}
              </p>

              <p className="mt-2 font-serif text-3xl">
                {translateBackendText(dashboard.forecast?.headline ||
                  t("Awaiting kitchen history"))}
              </p>
            </div>

            <div className="card border-l-2 border-l-[#c9981e]">
              <h3>{t("Surplus risk")}</h3>

              <p className="mt-2 text-sm">
                {translateBackendText(dashboard.risk?.label ||
                  t("Not calculated yet"))}
              </p>
            </div>

            <div className="card border-l-2 border-l-[#173f2e]">
              <h3>{t("Today’s AI brief")}</h3>

              <p className="mt-2 text-sm">
                {translateBackendText(dashboard.brief ||
                  t("A real-time AI brief will appear when kitchen data is connected."))}
              </p>
            </div>
          </section>

          <section className="card mt-4">
            <h3>{t("7-day demand forecast")}</h3>

            {dashboard.forecast?.points?.length ? (
              <div className="mt-4 h-52">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart data={dashboard.forecast.points}>
                    <XAxis dataKey="label" tickFormatter={translateForecastLabel} />
                    <YAxis />
                    <Tooltip labelFormatter={translateForecastLabel} />

                    <Area
                      dataKey="value"
                      stroke="#173f2e"
                      fill="#dce8d8"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#667268]">
                {t("The chart will show only real forecast data from your backend.")}
              </p>
            )}
          </section>

          <section className="card mt-4">
            <h3>{t("Why this forecast")}</h3>

            <p className="eyebrow">
              {t("Plain-language reasoning")}
            </p>

            {dashboard.forecast?.reasons?.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {dashboard.forecast.reasons.map((reason) => (
                  <li key={reason}>— {translateBackendText(reason)}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[#667268]">
                {t("Reasons will appear with real forecast data.")}
              </p>
            )}
          </section>

          <section className="card mt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3>{t("Active listings")}</h3>

                <p className="eyebrow">
                  {t("Everything reported today, across every channel")}
                </p>
              </div>

              <Link
                to="/kitchen/report-surplus"
                className="btn-secondary px-3 py-2 text-xs"
              >
                {t("+ New")}
              </Link>
            </div>

            {listings.length ? (
              listings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/kitchen/listings/${listing.id}`}
                  className="flex items-center justify-between border-b py-4 last:border-0"
                >
                  <span>
                    <strong className="text-sm">
                      {listing.foodItem || listing.title}
                    </strong>

                    <span
                      className={`pill ml-2 ${
                        urgencyStyles[
                          listing.urgency?.toLowerCase()
                        ] || urgencyStyles.low
                      }`}
                    >
                      {t(listing.urgency || "Low")} {t("urgency")}
                    </span>

                    <small className="mt-1 block text-xs text-[#667268]">
                      {listing.quantity} {translateUnit(listing.unit)} · {t("Pickup by")} {formatDate(listing.pickupBy)}
                    </small>
                  </span>

                  <span className="text-xs">
                    {t(stageNames[listing.status] || "Matching")}{" "}
                    ›
                  </span>
                </Link>
              ))
            ) : (
              <div className="mt-4">
                <EmptyState
                  title={t("No listings yet")}
                  text={t("Report available surplus and start matching it with nearby organisations.")}
                  offline={resource.offline}
                />
              </div>
            )}
          </section>
        </>
      )}
    </Shell>
  );
}

function ReportSurplus() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const urgent = search.get("urgent") === "1";

  const [form, setForm] = useState({
    foodItem: "",
    quantity: "",
    unit: "kg",
    cookedAt: "",
    pickupBy: "",
    notes: ""
  });

  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");

  // Native In-Browser Voice Recognition
  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage(t("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari."));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = locale();
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setLiveTranscript(t("Listening... Speak now"));

    recognition.onresult = async (event) => {
      const currentText = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setLiveTranscript(currentText);

      // When speech pauses and is finalized
      if (event.results[0].isFinal) {
        setIsListening(false);
        try {
          // Send to backend extractor
          const response = await fetch(
            "https://AnnSahay-food-management-system.onrender.com/channels/voice/turn",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ transcript: currentText })
            }
          );
          const data = await response.json();
          const parsed = data.parsed_so_far || {};

          // Auto-fill form fields with parsed results
          setForm((prev) => ({
            ...prev,
            foodItem: parsed.foodItem || prev.foodItem,
            quantity: parsed.quantity || prev.quantity,
            unit: parsed.unit || prev.unit,
            pickupBy: parsed.pickupBy
              ? parsed.pickupBy.slice(0, 16)
              : prev.pickupBy,
            notes: prev.notes || `Reported via Voice Assistant: "${currentText}"`
          }));

          setMessage(t("Voice details extracted and populated into the form!"));
        } catch (err) {
          setMessage(t("Could not process voice input with backend."));
        }
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setLiveTranscript("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }

  async function submit(event) {
    event.preventDefault();

    try {
      const response = await api.createListing({
        ...form,
        quantity: Number(form.quantity),
        urgency: urgent ? "high" : "medium"
      });

      if (response.offline) {
        setMessage(t("This form is ready for the real backend API."));
        return;
      }

      navigate(`/kitchen/listings/${unwrap(response).id}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <Shell
      title={t("Report surplus")}
      subtitle={t("Report surplus via text or browser microphone")}
      role="kitchen"
    >
      <div className="card mt-4 max-w-[480px]">
        {/* Voice Assistant Mic Button */}
        <div className="mb-4 rounded-xl border border-[#dce8d8] bg-[#f2f7f1] p-4 text-center">
          <p className="text-xs font-semibold text-[#173f2e]">
            {t("Quick Voice Input (Speak to Fill)")}
          </p>
          <p className="mt-1 text-xs text-[#667268]">
            {t("Tap the button and say:")} <em>"{t("We have 25 kg of vegetable pulao ready by 9 pm")}"</em>
          </p>

          <button
            type="button"
            onClick={startVoiceInput}
            className={`btn-primary mx-auto mt-3 flex items-center gap-2 ${
              isListening ? "animate-pulse bg-red-600" : "bg-[#173f2e]"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            {isListening ? t("Listening... (Tap to stop)") : t("🎙️ Speak to Report")}
          </button>

          {liveTranscript && (
            <p className="mt-2 text-xs italic text-[#173f2e]">
              "{liveTranscript}"
            </p>
          )}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-xs font-semibold">
            {t("Food item")}
            <input
              required
              className="input"
              placeholder={t("e.g. Vegetable pulao")}
              value={form.foodItem}
              onChange={(e) => setForm({ ...form, foodItem: e.target.value })}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold">
              {t("Quantity")}
              <input
                required
                type="number"
                min="0"
                className="input"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </label>

            <label className="text-xs font-semibold">
              {t("Unit")}
              <select
                className="input"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              >
                <option value="kg">{t("kg")}</option>
                <option value="servings">{t("servings")}</option>
                <option value="packets">{t("packets")}</option>
                <option value="plates">{t("plates")}</option>
                <option value="trays">{t("trays")}</option>
                <option value="meals">{t("meals")}</option>
                <option value="boxes">{t("boxes")}</option>
              </select>
            </label>

            <label className="text-xs font-semibold">
              {t("Cooked at")}
              <input
                required
                type="datetime-local"
                className="input"
                value={form.cookedAt}
                onChange={(e) => setForm({ ...form, cookedAt: e.target.value })}
              />
            </label>

            <label className="text-xs font-semibold">
              {t("Pickup by")}
              <input
                required
                type="datetime-local"
                className="input"
                value={form.pickupBy}
                onChange={(e) => setForm({ ...form, pickupBy: e.target.value })}
              />
            </label>
          </div>

          <label className="block text-xs font-semibold">
            {t("Notes")}
            <textarea
              className="input min-h-20"
              placeholder={t("Allergens, packaging, gate instructions…")}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>

          {message && (
            <p className="rounded bg-[#eaf1e8] p-3 text-xs text-[#173f2e]">
              {message}
            </p>
          )}

          <button className="btn-primary w-full">
            {urgent ? t("Start urgent matching") : t("Publish listing")}
          </button>
        </form>
      </div>
    </Shell>
  );
}

function Timeline({ current = "draft" }) {
  const activeIndex = Math.max(
    0,
    stages.indexOf(current)
  );

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-6">
      {stages.map((stage, index) => {
        const complete = index < activeIndex;
        const active = index === activeIndex;

        return (
          <div
            key={stage}
            className="flex gap-2 sm:block"
          >
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-xs ${
                active
                  ? "bg-[#173f2e] text-white ring-4 ring-[#dce8d8]"
                  : complete
                  ? "bg-[#dce8d8] text-[#173f2e]"
                  : "bg-[#ecece6] text-[#7a857d]"
              }`}
            >
              {complete ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </span>

            <span
              className={`text-xs ${
                active
                  ? "font-bold text-[#173f2e]"
                  : "text-[#667268]"
              }`}
            >
              {t(stageNames[stage])}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FoodMap({ pickup, recipient }) {
  if (
    pickup?.latitude == null ||
    pickup?.longitude == null
  ) {
    return (
      <EmptyState
        Icon={MapPin}
        title={t("Map awaits real locations")}
        text={t("Pickup and recipient pins will appear when the backend sends coordinates.")}
      />
    );
  }

  const position = [
    pickup.latitude,
    pickup.longitude
  ];

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>
          {pickup.address || t("Kitchen pickup")}
        </Popup>
      </Marker>

      {recipient?.latitude != null && (
        <Marker
          position={[
            recipient.latitude,
            recipient.longitude
          ]}
        >
          <Popup>
            {recipient.address || t("Restaurant location")}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

function ListingPage() {
  const { id } = useParams();

  const resource = useApi(
    () => api.getListing(id),
    `listing-${id}`
  );

  const listing = resource.data;
  const [message, setMessage] = useState("");

  async function urgentMatch() {
    try {
      const response = await api.urgentMatch(id);

      setMessage(
        response.offline
          ? t("Urgent matching will start when the backend API is connected.")
          : t("Live urgent matching has started.")
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <Shell
      title={t("Listing status")}
      subtitle={t("Track every handover")}
      role="kitchen"
    >
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState {...resource} />
      ) : !listing ? (
        <EmptyState
          title={t("Listing unavailable")}
          text={t("Create a surplus listing first.")}
          offline={resource.offline}
        />
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                to="/kitchen/dashboard"
                className="inline-flex items-center gap-1 text-xs text-[#667268]"
              >
                <ArrowLeft className="h-3 w-3" />
                {t("Dashboard")}
              </Link>

              <h2 className="page-title mt-3">
                {listing.foodItem || listing.title}
              </h2>

              <p className="mt-1 text-sm text-[#667268]">
                {listing.quantity} {translateUnit(listing.unit)} · {t("Pickup by")} {formatDate(listing.pickupBy)}
              </p>
            </div>

            <button
              onClick={urgentMatch}
              className="btn-primary"
            >
              <Zap className="h-4 w-4" />
              {t("Urgent")}
            </button>
          </div>

          {message && (
            <p className="mt-3 rounded bg-[#eaf1e8] p-3 text-sm text-[#173f2e]">
              {message}
            </p>
          )}

          <section className="card mt-4">
            <h3>{t("Handover progress")}</h3>

            <Timeline current={listing.status} />
          </section>

          <section className="card mt-4 h-72 p-2">
            <FoodMap
              pickup={listing.pickup}
              recipient={listing.recipient}
            />
          </section>
        </>
      )}
    </Shell>
  );
}

function RestaurantOffers() {
  const resource = useApi(
    api.recipientOffers,
    "restaurant-offers"
  );

  const offers = list(resource.data);
  const [message, setMessage] = useState("");
  const [claimedOtp, setClaimedOtp] = useState(null);

  async function decide(id, decision) {
    try {
      const response = await api.respondToOffer(
        id,
        decision
      );

      const resData = unwrap(response);
      const demoOtp = resData?.otp_for_demo_only;

      if (decision === "accept" && demoOtp) {
        setClaimedOtp(demoOtp);
        setMessage(t("Offer accepted! Share the 4-digit Handover Code below with the volunteer."));
      } else {
        setMessage(
          response.offline
            ? t("This action is ready for the backend.")
            : `Offer ${t(decision === "accept" ? "Accept" : "Decline").toLowerCase()}d successfully.`
        );
      }

      resource.reload();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <Shell
      title={t("Incoming offers")}
      subtitle={t("Surplus food near you, matched in real time")}
      role="restaurant"
    >
      {resource.loading ? (
        <Loading text={t("Checking offers…")} />
      ) : resource.error ? (
        <ErrorState {...resource} />
      ) : (
        <>
          {/* Prominent Verification OTP Card */}
          {claimedOtp && (
            <div className="mb-4 rounded-xl border-2 border-[#173f2e] bg-[#eaf1e8] p-5 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-[#667268]">
                {t("Handover Verification Code")}
              </p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-widest text-[#173f2e]">
                {claimedOtp}
              </p>
              <p className="mt-2 text-xs text-[#173f2e]">
                {t("Provide this 4-digit code to the volunteer when they arrive for collection.")}
              </p>
            </div>
          )}

          {message && !claimedOtp && (
            <p className="mb-3 rounded bg-[#eaf1e8] p-3 text-sm">
              {message}
            </p>
          )}

          {!offers.length ? (
            <EmptyState
              Icon={HandHeart}
              title={t("No offers right now")}
              text={t("Nearby kitchen offers will arrive here the moment they are matched.")}
              offline={resource.offline}
            />
          ) : (
            offers.map((offer) => (
              <article
                key={offer.id}
                className="card mb-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3>
                      {offer.foodItem || offer.title}
                    </h3>

                    <p className="text-xs text-[#667268]">
                      {offer.kitchen?.name || t("Kitchen")}
                    </p>
                  </div>

                  {offer.distanceKm != null && (
                    <span className="pill bg-[#eaf1e8]">
                      {offer.distanceKm} km
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm">
                  {offer.quantity} {translateUnit(offer.unit)}
                </p>

                <p className="mt-1 text-xs text-[#667268]">
                  {t("Pickup by")} {formatDate(offer.pickupBy)}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      decide(offer.id, "decline")
                    }
                    className="btn-secondary text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                    {t("Decline")}
                  </button>

                  <button
                    onClick={() =>
                      decide(offer.id, "accept")
                    }
                    className="btn-primary"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {t("Accept")}
                  </button>
                </div>
              </article>
            ))
          )}
        </>
      )}
    </Shell>
  );
}

function VolunteerPickup() {
  const { id } = useParams();

  const resource = useApi(
    () => api.getPickup(id),
    `pickup-${id}`
  );

  const pickup = resource.data;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  async function verify(event) {
    event.preventDefault();

    if (otp.length !== 4) {
      setMessage(t("Enter the four-digit code from the restaurant."));
      return;
    }

    try {
      const response = await api.verifyDelivery(
        id,
        otp
      );

      setMessage(
        response.offline
          ? t("OTP verification will work once the backend API is connected.")
          : t("Delivery verified successfully.")
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <Shell
      title={t("Your pickup")}
      subtitle={t("Volunteer workspace")}
      role="volunteer"
    >
      {resource.loading ? (
        <Loading text={t("Loading assigned pickup…")} />
      ) : resource.error ? (
        <ErrorState {...resource} />
      ) : !pickup ? (
        <EmptyState
          Icon={Truck}
          title={t("No pickup assigned yet")}
          text={t("Your next kitchen collection and delivery will appear here.")}
          offline={resource.offline}
        />
      ) : (
        <>
          <section className="card h-72 p-2">
            <FoodMap
              pickup={pickup.pickup}
              recipient={pickup.recipient}
            />
          </section>

          <section className="card mt-3">
            <h3>{t("Load")}</h3>

            <p className="mt-2 text-sm">
              {pickup.foodItem || pickup.title} ·{" "}
              {pickup.quantity} {translateUnit(pickup.unit)}
            </p>
          </section>

          <form
            onSubmit={verify}
            className="card mt-3"
          >
            <h3>{t("Confirm handover")}</h3>

            <p className="mt-1 text-xs text-[#667268]">
              {t("Ask the restaurant representative to read their four-digit code.")}
            </p>

            <input
              required
              inputMode="numeric"
              maxLength="4"
              placeholder="0000"
              className="input text-center text-2xl tracking-[0.7em]"
              value={otp}
              onChange={(event) =>
                setOtp(
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 4)
                )
              }
            />

            {message && (
              <p className="mt-3 text-xs text-[#173f2e]">
                {message}
              </p>
            )}

            <button className="btn-primary mt-4 w-full">
              <ShieldCheck className="h-4 w-4" />
              {t("Verify delivery")}
            </button>
          </form>
        </>
      )}
    </Shell>
  );
}

function ImpactPage() {
  const resource = useApi(api.impact, "impact");
  const impact = resource.data || {};
  const trend = impact.trend || [];

  function metric(title, value, Icon, note) {
    return (
      <div className="card border-l-2 border-l-[#173f2e]">
        <p className="flex items-center gap-1 text-xs">
          {title}

          <InfoTip>{note}</InfoTip>
        </p>

        <div className="mt-2 flex items-center justify-between">
          <p className="font-serif text-3xl">
            {value}
          </p>

          <Icon className="h-5 w-5 text-[#173f2e]" />
        </div>
      </div>
    );
  }

  return (
    <Shell
      title={t("Impact")}
      subtitle={t("Every figure explains how it was calculated")}
      role="kitchen"
    >
      {resource.loading ? (
        <Loading text={t("Calculating impact…")} />
      ) : resource.error ? (
        <ErrorState {...resource} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {metric(
              t("Meals redistributed"),
              formatNumber(
                impact.mealsRedistributed
              ),
              UtensilsCrossed,
              impact.computations
                ?.mealsRedistributed ||
                t("Verified delivered quantity divided by the configured serving size.")
            )}

            {metric(
              t("Waste prevented"),
              impact.wastePreventedKg != null
                ? `${formatNumber(
                    impact.wastePreventedKg
                  )} kg`
                : "—",
              Leaf,
              impact.computations
                ?.wastePreventedKg ||
                t("Total weight from OTP-verified deliveries.")
            )}

            {metric(
              t("Rupees saved"),
              impact.rupeesSaved != null
                ? `₹${formatNumber(
                    impact.rupeesSaved
                  )}`
                : "—",
              Sparkles,
              impact.computations?.rupeesSaved ||
                t("Replacement meal cost multiplied by verified meals.")
            )}
          </div>

          <section className="card mt-4">
            <h3>{t("Meals redistributed — trend")}</h3>

            {trend.length ? (
              <div className="mt-4 h-56">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart data={trend}>
                    <XAxis dataKey="label" tickFormatter={translateForecastLabel} />
                    <YAxis />
                    <Tooltip labelFormatter={translateForecastLabel} />

                    <Area
                      dataKey="value"
                      stroke="#8d670e"
                      fill="#f2dfac"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  Icon={Sparkles}
                  title={t("Trend awaits verified deliveries")}
                  text={t("This chart will use only real completed handovers.")}
                  offline={resource.offline}
                />
              </div>
            )}
          </section>
        </>
      )}
    </Shell>
  );
}

function CompliancePage() {
  const resource = useApi(
    api.compliance,
    "compliance"
  );

  const rows = list(resource.data);
  const [downloading, setDownloading] = useState(false);

  async function download(format) {
    setDownloading(true);
    const token = localStorage.getItem("annsahay_access_token") || localStorage.getItem("annsetu_access_token");

    try {
      const response = await fetch(
        `https://annsetu-food-management-system.onrender.com/compliance/handovers/export?format=${format}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (!response.ok) {
        throw new Error("Server export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `fssai_compliance_register.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (format === "csv" && rows.length > 0) {
        const headers = [t("Reference ID"), t("Date"), t("Kitchen"), t("Recipient"), t("Food Item"), t("Quantity"), t("Unit")];
        const csvContent = [
          headers.join(","),
          ...rows.map(r => [
            `"${r.reference || 'AS-' + r.id}"`,
            `"${formatDate(r.deliveredAt)}"`,
            `"${(r.kitchen?.name || r.kitchenName || '').replace(/"/g, '""')}"`,
            `"${(r.recipient?.name || r.recipientName || '').replace(/"/g, '""')}"`,
            `"${(r.foodItem || '').replace(/"/g, '""')}"`,
            r.quantity,
            `"${r.unit || ''}"`
          ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "fssai_compliance_register.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(t("Could not download {format}. Please ensure you are logged in.", { format: format.toUpperCase() }));
      }
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Shell
      title={t("Compliance register")}
      subtitle={t("FSSAI surplus-food handover log — OTP-verified deliveries")}
      role="kitchen"
      action={
        <div className="flex gap-2">
          <button
            onClick={() => download("csv")}
            className="btn-secondary flex items-center gap-1 px-3 py-2 text-xs"
          >
            <Download className="h-3 w-3" />
            CSV
          </button>

          <button
            onClick={() => download("pdf")}
            className="btn-secondary flex items-center gap-1 px-3 py-2 text-xs"
          >
            <Download className="h-3 w-3" />
            PDF
          </button>
        </div>
      }
    >
      {resource.loading ? (
        <Loading />
      ) : resource.error ? (
        <ErrorState {...resource} />
      ) : !rows.length ? (
        <div className="mt-4">
          <EmptyState
            Icon={ShieldCheck}
            title={t("No compliance records yet")}
            text={t("Verified delivery logs will appear here once handovers are completed.")}
            offline={resource.offline}
          />
        </div>
      ) : (
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#ddd4bf] pb-2 text-[#7a857d]">
                <th className="pb-2 font-semibold">{t("Reference ID")}</th>
                <th className="pb-2 font-semibold">{t("Date")}</th>
                <th className="pb-2 font-semibold">{t("Recipient")}</th>
                <th className="pb-2 font-semibold">{t("Food Item")}</th>
                <th className="pb-2 text-right font-semibold">{t("Quantity")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ecece6]">
              {rows.map((row) => (
                <tr key={row.id} className="transition hover:bg-[#f7f7f2]">
                  <td className="py-2.5 font-mono font-medium text-[#173f2e]">
                    {row.reference || `AS-${String(row.id).padStart(5, '0')}`}
                  </td>
                  <td className="py-2.5 text-[#667268]">
                    {formatDate(row.deliveredAt)}
                  </td>
                  <td className="py-2.5 font-medium">
                    {row.recipientName || row.recipient?.name || "—"}
                  </td>
                  <td className="py-2.5">
                    {row.foodItem}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-[#173f2e]">
                    {row.quantity} {translateUnit(row.unit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}


function NotFound() {
  return (
    <main
      className="grid min-h-screen place-items-center p-4"
      style={backgroundStyle}
    >
      <section
        className="rounded-xl border border-[#eadfca] p-7 text-center shadow-xl"
        style={{ backgroundColor: cream }}
      >
        <h1 className="text-2xl">
          {t("Page not found")}
        </h1>

        <Link
          to="/login"
          className="btn-primary mt-5"
        >
          {t("Go to login")}
        </Link>
      </section>
    </main>
  );
}

export default function App() {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en"
  );

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
    setLanguageState(nextLanguage);
  }

  currentLanguage = language;

  return (
    <>
      <LanguageSwitcher language={language} onChange={handleLanguageChange} />
      <Routes key={language}>
      <Route
        path="/login"
        element={<RolePicker />}
      />

      <Route
        path="/login/:role"
        element={<AuthPage mode="login" />}
      />

      <Route
        path="/signup/:role"
        element={<AuthPage mode="signup" />}
      />

      <Route
        path="/signout"
        element={<SignOutPage />}
      />

      <Route
        path="/kitchen/dashboard"
        element={<KitchenDashboard />}
      />

      <Route
        path="/kitchen/report-surplus"
        element={<ReportSurplus />}
      />

      <Route
        path="/kitchen/listings/:id"
        element={<ListingPage />}
      />

      <Route
        path="/restaurant/offers"
        element={<RestaurantOffers />}
      />

      <Route
        path="/volunteer/pickup/:id"
        element={<VolunteerPickup />}
      />

      <Route
        path="/impact"
        element={<ImpactPage />}
      />

      <Route
        path="/compliance"
        element={<CompliancePage />}
      />

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
      </Routes>
    </>
  );
}

export const listenVoice = (lang = 'mr-IN', onResult) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return alert("Browser does not support voice input.");

  const recognition = new SpeechRecognition();
  recognition.lang = lang; // 'mr-IN' for Marathi, 'hi-IN' for Hindi, 'en-IN' for English
  recognition.onresult = (e) => onResult(e.results[0][0].transcript);
  recognition.start();
};




