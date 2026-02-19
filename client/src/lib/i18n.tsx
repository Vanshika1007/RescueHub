import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type LanguageCode =
  | "en" | "hi" | "bn" | "ta" | "te" | "mr" | "gu" | "pa" | "or" | "kn" | "ml" | "ur";

// Core supported languages for the selector
export type CoreLanguageCode = "en" | "hi" | "pa" | "te" | "bn" | "mr";

type Dictionary = Record<string, string>;
type Resources = Record<LanguageCode, Dictionary>;

const resources: Resources = {
  en: {
    brand: "RescueHub",
    tagline: "Emergency Response Network",
    nav_emergency: "Emergency Help",
    nav_volunteer: "Become a Volunteer",
    nav_donate: "Donation",
    nav_dashboard: "NGO Connect",
    nav_disaster_info: "Disaster Info",
    hero_title: "One Platform for Disaster Relief",
    hero_subtitle:
      "Fast, Transparent, Real-Time - Connecting survivors, volunteers, and NGOs when every second counts.",
    btn_emergency: "Request Emergency Help",
    btn_volunteer: "Volunteer Now",
    stat_active: "Active Cases",
    stat_volunteers: "Volunteers",
    stat_raised: "Raised",
    stat_lives: "Lives Helped",
    // Emergency Form
    emergency_title: "Emergency Help Request",
    emergency_subtitle: "Choose how you want to report your emergency",
    voice_option: "Quick Voice Message",
    voice_desc: "Just speak your emergency details. Your location will be automatically detected and sent with your voice message.",
    form_option: "Detailed Form",
    form_desc: "Fill out a detailed form with specific information about your emergency situation.",
    emergency_type: "Emergency Type",
    urgency_level: "Urgency Level",
    location: "Location",
    people_count: "Number of People Affected",
    description: "Description (Optional)",
    get_location: "Get My Location",
    send_request: "Send Emergency Request",
    // Volunteer Page
    volunteer_title: "Join Our Volunteer Network",
    volunteer_subtitle: "Make a difference when it matters most. Our AI-powered matching system connects your skills with urgent needs in real-time.",
    skills_title: "Skills We Need",
    skills_subtitle: "Every skill makes a difference. Find how your expertise can help save lives and rebuild communities.",
    join_now: "Join Now",
    learn_more: "Learn More",
    // Donation Page
    donation_title: "Transparent Donations",
    donation_subtitle: "Blockchain-powered transparency ensures every dollar reaches those in need. Track your impact in real-time.",
    donate_now: "Donate Now",
    // Dashboard
    dashboard_title: "Real-time Dashboard",
    dashboard_subtitle: "Monitor emergency situations, volunteer activities, and donation progress in real-time.",
    // Home Page
    emergency_system_title: "Emergency Help Request",
    emergency_system_subtitle: "Fast, AI-powered emergency response system that works offline and connects you to immediate help.",
    volunteer_network_title: "Join Our Volunteer Network",
    volunteer_network_subtitle: "Make a difference when it matters most. Our AI-powered matching system connects your skills with urgent needs in real-time.",
    transparent_donations_title: "Transparent Donations",
    transparent_donations_subtitle: "Blockchain-powered transparency ensures every dollar reaches those in need. Track your impact in real-time.",
    // Volunteer Page
    volunteer_leaderboard_title: "Volunteer Leaderboard",
    volunteer_leaderboard_subtitle: "Earn points for helping others and compete with fellow volunteers!",
    points_system: "Points System",
    your_progress: "Your Progress",
    your_badges: "Your Badges",
    top_volunteers: "Top Volunteers This Month",
    volunteer_stories_title: "Volunteer Stories",
    volunteer_stories_subtitle: "Hear from volunteers who are making a real difference in their communities.",
    // Donation Page
    current_campaign_title: "Current Campaign",
    current_campaign_subtitle: "Every donation is tracked on the blockchain for complete transparency and accountability.",
    where_money_goes: "Where Your Money Goes",
    where_money_goes_subtitle: "Complete transparency on fund allocation across different relief categories.",
    donor_recognition_title: "Donor Recognition",
    donor_recognition_subtitle: "We honor the generous donors whose contributions make our mission possible.",
    corporate_partners_title: "Corporate Partners",
    corporate_partners_subtitle: "Join leading companies in making a meaningful impact on disaster relief efforts.",
    // Dashboard Page
    command_center: "Command Center",
    command_center_subtitle: "Real-time coordination and analytics for disaster relief operations",
    system_operational: "System Operational",
    export_data: "Export Data",
    response_time: "Response Time",
    success_rate: "Success Rate",
    platform_load: "Platform Load",
    geographic_distribution: "Geographic Distribution",
    emergency_types: "Emergency Types",
    recent_activity: "Recent Activity Timeline",
    // SOS Button
    sos_button: "SOS",
  },
  hi: {
    brand: "रेस्क्यूहब",
    tagline: "आपातकालीन प्रतिक्रिया नेटवर्क",
    nav_emergency: "आपातकालीन सहायता",
    nav_volunteer: "स्वयंसेवक बनें",
    nav_donate: "दान",
    nav_dashboard: "एनजीओ कनेक्ट",
    nav_disaster_info: "आपदा जानकारी",
    hero_title: "आपदा राहत के लिए एक मंच",
    hero_subtitle:
      "तेज़, पारदर्शी, वास्तविक समय - जब हर सेकंड मायने रखता है तो बचे लोगों, स्वयंसेवकों और एनजीओ को जोड़ना।",
    btn_emergency: "आपातकालीन सहायता माँगें",
    btn_volunteer: "अभी स्वयंसेवा करें",
    stat_active: "सक्रिय मामले",
    stat_volunteers: "स्वयंसेवक",
    stat_raised: "उठाई गई राशि",
    stat_lives: "जीवनों की मदद",
    // Emergency Form
    emergency_title: "आपातकालीन सहायता अनुरोध",
    emergency_subtitle: "चुनें कि आप अपनी आपातकालीन स्थिति कैसे रिपोर्ट करना चाहते हैं",
    voice_option: "त्वरित आवाज़ संदेश",
    voice_desc: "बस अपनी आपातकालीन जानकारी बोलें। आपका स्थान स्वचालित रूप से पता लगाया जाएगा और आपके आवाज़ संदेश के साथ भेजा जाएगा।",
    form_option: "विस्तृत फॉर्म",
    form_desc: "अपनी आपातकालीन स्थिति के बारे में विशिष्ट जानकारी के साथ एक विस्तृत फॉर्म भरें।",
    emergency_type: "आपातकालीन प्रकार",
    urgency_level: "तात्कालिकता स्तर",
    location: "स्थान",
    people_count: "प्रभावित लोगों की संख्या",
    description: "विवरण (वैकल्पिक)",
    get_location: "मेरा स्थान प्राप्त करें",
    send_request: "आपातकालीन अनुरोध भेजें",
    // Volunteer Page
    volunteer_title: "हमारे स्वयंसेवक नेटवर्क में शामिल हों",
    volunteer_subtitle: "जब सबसे ज्यादा मायने रखता है तब फर्क करें। हमारी AI-संचालित मैचिंग प्रणाली आपके कौशल को वास्तविक समय में तत्काल आवश्यकताओं से जोड़ती है।",
    skills_title: "हमें जिन कौशलों की आवश्यकता है",
    skills_subtitle: "हर कौशल फर्क करता है। पता करें कि आपकी विशेषज्ञता कैसे जीवन बचाने और समुदायों को पुनर्निर्माण में मदद कर सकती है।",
    join_now: "अभी शामिल हों",
    learn_more: "और जानें",
    // Donation Page
    donation_title: "पारदर्शी दान",
    donation_subtitle: "ब्लॉकचेन-संचालित पारदर्शिता सुनिश्चित करती है कि हर डॉलर जरूरतमंदों तक पहुंचे। वास्तविक समय में अपने प्रभाव को ट्रैक करें।",
    donate_now: "अभी दान करें",
    // Dashboard
    dashboard_title: "वास्तविक समय डैशबोर्ड",
    dashboard_subtitle: "आपातकालीन स्थितियों, स्वयंसेवक गतिविधियों और दान प्रगति को वास्तविक समय में मॉनिटर करें।",
    // Home Page
    emergency_system_title: "आपातकालीन सहायता अनुरोध",
    emergency_system_subtitle: "तेज़, AI-संचालित आपातकालीन प्रतिक्रिया प्रणाली जो ऑफलाइन काम करती है और आपको तत्काल सहायता से जोड़ती है।",
    volunteer_network_title: "हमारे स्वयंसेवक नेटवर्क में शामिल हों",
    volunteer_network_subtitle: "जब सबसे ज्यादा मायने रखता है तब फर्क करें। हमारी AI-संचालित मैचिंग प्रणाली आपके कौशल को वास्तविक समय में तत्काल आवश्यकताओं से जोड़ती है।",
    transparent_donations_title: "पारदर्शी दान",
    transparent_donations_subtitle: "ब्लॉकचेन-संचालित पारदर्शिता सुनिश्चित करती है कि हर डॉलर जरूरतमंदों तक पहुंचे। वास्तविक समय में अपने प्रभाव को ट्रैक करें।",
    // Volunteer Page
    volunteer_leaderboard_title: "स्वयंसेवक लीडरबोर्ड",
    volunteer_leaderboard_subtitle: "दूसरों की मदद करने के लिए अंक अर्जित करें और साथी स्वयंसेवकों के साथ प्रतिस्पर्धा करें!",
    points_system: "अंक प्रणाली",
    your_progress: "आपकी प्रगति",
    your_badges: "आपके बैज",
    top_volunteers: "इस महीने के शीर्ष स्वयंसेवक",
    volunteer_stories_title: "स्वयंसेवक कहानियां",
    volunteer_stories_subtitle: "स्वयंसेवकों से सुनें जो अपने समुदायों में वास्तविक बदलाव ला रहे हैं।",
    // Donation Page
    current_campaign_title: "वर्तमान अभियान",
    current_campaign_subtitle: "पूरी पारदर्शिता और जवाबदेही के लिए हर दान ब्लॉकचेन पर ट्रैक किया जाता है।",
    where_money_goes: "आपका पैसा कहां जाता है",
    where_money_goes_subtitle: "विभिन्न राहत श्रेणियों में फंड आवंटन पर पूरी पारदर्शिता।",
    donor_recognition_title: "दानदाता मान्यता",
    donor_recognition_subtitle: "हम उन उदार दानदाताओं का सम्मान करते हैं जिनके योगदान से हमारा मिशन संभव होता है।",
    corporate_partners_title: "कॉर्पोरेट भागीदार",
    corporate_partners_subtitle: "आपदा राहत प्रयासों पर सार्थक प्रभाव डालने के लिए अग्रणी कंपनियों के साथ जुड़ें।",
    // Dashboard Page
    command_center: "कमांड सेंटर",
    command_center_subtitle: "आपदा राहत संचालन के लिए वास्तविक समय समन्वय और विश्लेषण",
    system_operational: "सिस्टम परिचालन",
    export_data: "डेटा निर्यात करें",
    response_time: "प्रतिक्रिया समय",
    success_rate: "सफलता दर",
    platform_load: "प्लेटफॉर्म लोड",
    geographic_distribution: "भौगोलिक वितरण",
    emergency_types: "आपातकालीन प्रकार",
    recent_activity: "हाल की गतिविधि टाइमलाइन",
    // SOS Button
    sos_button: "SOS",
  },
  bn: {
    brand: "রেস্কিউহাব",
    tagline: "জরুরি সাড়া নেটওয়ার্ক",
    nav_emergency: "জরুরি সহায়তা",
    nav_volunteer: "স্বেচ্ছাসেবক হন",
    nav_donate: "দান",
    nav_dashboard: "এনজিও কানেক্ট",
    nav_disaster_info: "দুর্যোগ তথ্য",
    hero_title: "কোনো সাহায্যের আর্তি অনুলঙ্ঘিত নয়",
    hero_subtitle:
      "দুর্যোগে প্রতিটি সেকেন্ড মূল্যবান। অফলাইন-ফার্স্ট প্ল্যাটফর্ম বেঁচে থাকা, স্বেচ্ছাসেবক ও রেস্পন্ডারদের তাৎক্ষণিকভাবে যুক্ত করে — নেটওয়ার্ক না থাকলেও।",
    btn_emergency: "জরুরি সহায়তা চান",
    btn_volunteer: "এখনই স্বেচ্ছাসেবক হন",
    stat_active: "সক্রিয় কেস",
    stat_volunteers: "স্বেচ্ছাসেবক",
    stat_raised: "উত্থাপিত",
    stat_lives: "সহায়তা পাওয়া জীবন",
  },
  ta: {
    brand: "ரெஸ்க்யூஹப்",
    tagline: "அவசர உதவி வலை",
    nav_emergency: "அவசரம்",
    nav_volunteer: "தன்னார்வலர்",
    nav_donate: "நன்கொடை",
    nav_dashboard: "டாஷ்போர்டு",
    hero_title: "உதவி கோரிக்கை எதுவும் கேட்காமல் போகாது",
    hero_subtitle:
      "அபாய நேரத்தில் ஒவ்வொரு விநாடியும் முக்கியம். எங்கள் ஆஃப்லைன்-முதல் தளம் உயிர் பிழைத்தோர், தன்னார்வலர்கள், பதிலளிப்போர் ஆகியோரை உடனடியாக இணைக்கிறது — நெட்வொர்க் செயலிழந்தாலும்.",
    btn_emergency: "அவசர உதவி கோருக",
    btn_volunteer: "இப்போது தன்னார்வலர் ஆகவும்",
    stat_active: "செயலில் உள்ள வழக்குகள்",
    stat_volunteers: "தன்னார்வலர்கள்",
    stat_raised: "உதவித்தொகை",
    stat_lives: "உதவிபெற்ற உயிர்கள்",
  },
  te: {
    brand: "రెస్క్యూహబ్",
    tagline: "అత్యవసర ప్రతిస్పందన నెట్వర్క్",
    nav_emergency: "అత్యవసర సహాయం",
    nav_volunteer: "స్వచ్ఛంద సేవకుడిగా మారండి",
    nav_donate: "దానం",
    nav_dashboard: "ఎన్‌జీఓ కనెక్ట్",
    nav_disaster_info: "విపత్తు సమాచారం",
    hero_title: "సహాయం కోసం పెట్టిన మొర ఏదీ వినిపించకుండా ఉండదు",
    hero_subtitle:
      "విపత్తుల సమయంలో ప్రతి క్షణం విలువైనది. నెట్‌వర్క్‌లు విఫలమైనా మా ఆఫ్‌లైన్-ఫస్ట్ ప్లాట్‌ఫారమ్ వెంటనే కలుపుతుంది.",
    btn_emergency: "తక్షణ సహాయం కోరండి",
    btn_volunteer: "ఇప్పుడే వాలంటీర్ అవ్వండి",
    stat_active: "క్రియాశీల కేసులు",
    stat_volunteers: "వాలంటీర్లు",
    stat_raised: "సేకరించిన నిధులు",
    stat_lives: "సహాయం పొందిన ప్రాణాలు",
  },
  mr: {
    brand: "रेस्क्यूहब",
    tagline: "आपत्कालीन प्रतिसाद नेटवर्क",
    nav_emergency: "आपत्कालीन मदत",
    nav_volunteer: "स्वयंसेवक बना",
    nav_donate: "देणगी",
    nav_dashboard: "एनजीओ कनेक्ट",
    nav_disaster_info: "आपत्ती माहिती",
    hero_title: "मदतीची एकही हाक बहिरी राहत नाही",
    hero_subtitle:
      "आपत्तीच्या वेळी प्रत्येक सेकंद महत्त्वाचा. आमचे ऑफलाइन‑फर्स्ट प्लॅटफॉर्म नेटवर्क बंद असतानाही त्वरित जोडणी देते.",
    btn_emergency: "आपत्कालीन मदत मागा",
    btn_volunteer: "आता स्वयंसेवा करा",
    stat_active: "सक्रिय प्रकरणे",
    stat_volunteers: "स्वयंसेवक",
    stat_raised: "उभारलेली रक्कम",
    stat_lives: "वाचलेली जीव",
  },
  gu: {
    brand: "રેસ્ક્યુહબ",
    tagline: "એમર્જન્સી રિસ્પોન્સ નેટવર્ક",
    nav_emergency: "આપત્તિ",
    nav_volunteer: "સ્વયંસેવક",
    nav_donate: "દાન કરો",
    nav_dashboard: "ડેશબોર્ડ",
    hero_title: "મદદની કોઈ પુકાર અનસુણી નથી રહેતી",
    hero_subtitle:
      "આપત્તિમાં દરેક સેકન્ડ કિંમતી. ઓફલાઇન-ફર્સ્ટ પ્લેટફોર્મ નેટવર્ક બંધ હોવા છતા તુરંત જોડે છે.",
    btn_emergency: "તાત્કાલિક મદદ માગો",
    btn_volunteer: "હમણાં સ્વયંસેવક બનો",
    stat_active: "સક્રિય કેસ",
    stat_volunteers: "સ્વયંસેવકો",
    stat_raised: "એકત્રિત રકમ",
    stat_lives: "મદદ મળેલા જીવ",
  },
  pa: {
    brand: "ਰੈਸਕਿਊਹਬ",
    tagline: "ਐਮਰਜੈਂਸੀ ਰਿਸਪਾਂਸ ਨੈਟਵਰਕ",
    nav_emergency: "ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ",
    nav_volunteer: "ਵਲੰਟੀਅਰ ਬਣੋ",
    nav_donate: "ਦਾਨ",
    nav_dashboard: "ਐਨਜੀਓ ਕਨੈਕਟ",
    nav_disaster_info: "ਆਫ਼ਤ ਜਾਣਕਾਰੀ",
    hero_title: "ਮਦਦ ਦੀ ਕੋਈ ਪੁਕਾਰ ਅਣਸੁਣੀ ਨਹੀਂ ਰਹਿੰਦੀ",
    hero_subtitle:
      "ਸੰਕਟ ਵੇਲੇ ਹਰ ਸੈਕੰਡ ਮਹੱਤਵਪੂਰਨ। ਨੈੱਟਵਰਕ ਫੇਲ ਹੋਣ ਤੇ ਵੀ ਸਾਡਾ ਪਲੇਟਫਾਰਮ ਤੁਰੰਤ ਜੋੜਦਾ ਹੈ।",
    btn_emergency: "ਤੁਰੰਤ ਮਦਦ ਮੰਗੋ",
    btn_volunteer: "ਹੁਣੇ ਵਲੰਟੀਅਰ ਬਣੋ",
    stat_active: "ਸਰਗਰਮ ਕੇਸ",
    stat_volunteers: "ਵਲੰਟੀਅਰ",
    stat_raised: "ਇਕੱਠੀ ਰਕਮ",
    stat_lives: "ਮਦਦ ਕੀਤੀਆਂ ਜਾਨਾਂ",
  },
  or: {
    brand: "ରେସ୍କ୍ୟୁହବ୍",
    tagline: "ଜରୁରୀ ପ୍ରତିକ୍ରିୟା ନେଟୱର୍କ",
    nav_emergency: "ଜରୁରୀ",
    nav_volunteer: "ସେବକ",
    nav_donate: "ଦାନ କରନ୍ତୁ",
    nav_dashboard: "ଡ୍ୟାଶବୋର୍ଡ",
    hero_title: "ସହାଯ୍ୟ ମାଗିବାର କୌଣସି ଆବାଜ ଅନୁଶୁନା ହୁଏନା",
    hero_subtitle:
      "ଦୁର୍ଜୋଗ ସମୟରେ ପ୍ରତିଟି ସେକେଣ୍ଡ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ନେଟୱର୍କ ବନ୍ଦ ହେଲେ ମଧ୍ୟ ଆମ ପ୍ଲାଟଫର୍ମ ତୁରନ୍ତ ଯୋଡ଼େ।",
    btn_emergency: "ତତ୍କ୍ଷଣାତ୍ ସହାଯ୍ୟ ଚାହିଁବେ",
    btn_volunteer: "ଏବେ ସେବକ ହେଉନ୍ତୁ",
    stat_active: "ସକ୍ରିୟ କେସ",
    stat_volunteers: "ସେବକ",
    stat_raised: "ଉଠା ରାଶି",
    stat_lives: "ସହାଯ୍ୟପ୍ରାପ୍ତ ଜୀବନ",
  },
  kn: {
    brand: "ರೆಸ್ಕ್ಯೂಹಬ್",
    tagline: "ತುರ್ತು ಪ್ರತಿಕ್ರಿಯಾ ಜಾಲ",
    nav_emergency: "ತುರ್ತು",
    nav_volunteer: "ಸೇವಾಪ್ರವೃತ್ತ",
    nav_donate: "ದೇಣಿಗೆ",
    nav_dashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
    hero_title: "ಸಹಾಯದ ಒಂದು ಕಿರುಚಾಟವೂ ಅನುದಿನವಾಗುವುದಿಲ್ಲ",
    hero_subtitle:
      "ವಿಪತ್ತಿನಲ್ಲಿ ಪ್ರತಿ ಕ್ಷಣವೂ ಬೆಲೆಬಾಳುತ್ತದೆ. ನೆಟ್ವರ್ಕ್ ವಿಫಲವಾದರೂ ನಮ್ಮ ವೇದಿಕೆ ತಕ್ಷಣ ಸಂಪರ್ಕ ಮಾಡುತ್ತದೆ.",
    btn_emergency: "ತಕ್ಷಣ ಸಹಾಯ ಕೇಳಿ",
    btn_volunteer: "ಈಗ ಸ್ವಯಂಸೇವಕವಾಗಿರಿ",
    stat_active: "ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು",
    stat_volunteers: "ಸ್ವಯಂಸೇವಕರು",
    stat_raised: "ಸಂಗ್ರಹಿತ ನಿಧಿ",
    stat_lives: "ಸಹಾಯ ಪಡೆದ ಜೀವಗಳು",
  },
  ml: {
    brand: "റെസ്ക്യൂഹബ്",
    tagline: "ആപത് പ്രതികരണ ശൃംഖല",
    nav_emergency: "ആപത്ത്",
    nav_volunteer: "സ്വയംസേവകൻ",
    nav_donate: "സംഭാവന",
    nav_dashboard: "ഡാഷ്ബോർഡ്",
    hero_title: "സഹായവേണ്ടി ഉള്ള ഒരു നിലവിളിയും അവഗണിക്കപ്പെടില്ല",
    hero_subtitle:
      "ദുരന്തസമയത്ത് ഓരോ സെക്കന്റും നിർണായകം. നെറ്റ്വർക്കുകൾ പരാജയപ്പെട്ടാലും ഞങ്ങളുടെ പ്ലാറ്റ്‌ഫോം ഉടൻ ബന്ധിപ്പിക്കുന്നു.",
    btn_emergency: "ആപത് സഹായം അഭ്യർത്ഥിക്കുക",
    btn_volunteer: "ഇപ്പോൾ തന്നെ സ്വയംസേവകനാകൂ",
    stat_active: "സജീവ കേസുകൾ",
    stat_volunteers: "സ്വയംസേവകർ",
    stat_raised: "ശേഖരിച്ചത്",
    stat_lives: "സഹായം ലഭിച്ച ജീവിതങ്ങൾ",
  },
  ur: {
    brand: "ریسکیوہب",
    tagline: "ایمرجنسی ریسپانس نیٹ ورک",
    nav_emergency: "ایمرجنسی",
    nav_volunteer: "رضاکار",
    nav_donate: "عطیہ کریں",
    nav_dashboard: "ڈیش بورڈ",
    hero_title: "مدد کی کوئی پکار سنی ان سنی نہیں ہوتی",
    hero_subtitle:
      "آفت کے وقت ہر لمحہ قیمتی ہے۔ نیٹ ورک ناکام ہونے پر بھی ہمارا پلیٹ فارم فوری رابطہ فراہم کرتا ہے۔",
    btn_emergency: "فوری مدد طلب کریں",
    btn_volunteer: "ابھی رضا کار بنیں",
    stat_active: "فعال کیسز",
    stat_volunteers: "رضاکار",
    stat_raised: "جمع شدہ رقم",
    stat_lives: "مدد یافتہ جانیں",
  },
};

type I18nContextType = {
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  t: (key: keyof typeof resources["en"], fallback?: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Auto-detect browser language
const detectBrowserLanguage = (): LanguageCode => {
  const browserLang = navigator.language.toLowerCase();
  
  // Map browser language codes to our supported languages
  const languageMap: Record<string, LanguageCode> = {
    'hi': 'hi',
    'hi-in': 'hi',
    'pa': 'pa',
    'pa-in': 'pa',
    'te': 'te',
    'te-in': 'te',
    'bn': 'bn',
    'bn-in': 'bn',
    'bn-bd': 'bn',
    'mr': 'mr',
    'mr-in': 'mr',
    'ta': 'ta',
    'ta-in': 'ta',
    'gu': 'gu',
    'gu-in': 'gu',
    'or': 'or',
    'or-in': 'or',
    'kn': 'kn',
    'kn-in': 'kn',
    'ml': 'ml',
    'ml-in': 'ml',
    'ur': 'ur',
    'ur-in': 'ur',
    'ur-pk': 'ur',
  };
  
  // Check exact match first
  if (languageMap[browserLang]) {
    return languageMap[browserLang];
  }
  
  // Check language code without country
  const langCode = browserLang.split('-')[0];
  if (languageMap[langCode]) {
    return languageMap[langCode];
  }
  
  // Default to English
  return 'en';
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem("lang") as LanguageCode;
    if (savedLang) return savedLang;
    
    // Auto-detect browser language on first visit
    const detectedLang = detectBrowserLanguage();
    console.log(`🌐 Auto-detected language: ${detectedLang} (browser: ${navigator.language})`);
    
    // Show notification for auto-detection (only on first visit)
    if (detectedLang !== 'en') {
      setTimeout(() => {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 12px 16px; border-radius: 8px; z-index: 1000; font-family: system-ui; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            🌐 Language auto-detected: ${coreLanguageList.find(l => l.code === detectedLang)?.native || 'English'}
          </div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }, 1000);
    }
    
    return detectedLang;
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    const dict = resources[lang] || resources.en;
    return (key: keyof typeof resources["en"], fallback?: string) => dict[key] ?? resources.en[key] ?? fallback ?? String(key);
  }, [lang]);

  const value: I18nContextType = { lang, setLang, t };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

// Core language list for the main selector (6 languages)
export const coreLanguageList: Array<{ code: CoreLanguageCode; native: string; english: string; flag: string }> = [
  { code: "en", native: "English", english: "English", flag: "🇺🇸" },
  { code: "hi", native: "हिंदी", english: "Hindi", flag: "🇮🇳" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", flag: "🇮🇳" },
  { code: "te", native: "తెలుగు", english: "Telugu", flag: "🇮🇳" },
  { code: "bn", native: "বাংলা", english: "Bengali", flag: "🇮🇳" },
  { code: "mr", native: "मराठी", english: "Marathi", flag: "🇮🇳" },
];

// Full language list (all supported languages)
export const languageList: Array<{ code: LanguageCode; native: string; english: string; flag: string }> = [
  { code: "en", native: "English", english: "English", flag: "🇺🇸" },
  { code: "hi", native: "हिंदी", english: "Hindi", flag: "🇮🇳" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", flag: "🇮🇳" },
  { code: "te", native: "తెలుగు", english: "Telugu", flag: "🇮🇳" },
  { code: "bn", native: "বাংলা", english: "Bengali", flag: "🇮🇳" },
  { code: "mr", native: "मराठी", english: "Marathi", flag: "🇮🇳" },
  { code: "ta", native: "தமிழ்", english: "Tamil", flag: "🇮🇳" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", flag: "🇮🇳" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia", flag: "🇮🇳" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", flag: "🇮🇳" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", flag: "🇮🇳" },
  { code: "ur", native: "اردو", english: "Urdu", flag: "🇵🇰" },
];


