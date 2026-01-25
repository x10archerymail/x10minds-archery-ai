import  { createContext, useContext, useState, useEffect } from "react";

interface Preferences {
  darkMode: boolean;
  language: string;
  currency: string;
  mfaEnabled: boolean;
  fontSize: "small" | "medium" | "large";
}

interface PreferencesContextType {
  preferences: Preferences;
  setDarkMode: (value: boolean) => void;
  setLanguage: (value: string) => void;
  setCurrency: (value: string) => void;
  setMfaEnabled: (value: boolean) => void;
  setFontSize: (value: "small" | "medium" | "large") => void;
  formatPrice: (price: number) => string;
  savePreferences: () => void;
  t: (key: string) => string;
}

const currencySymbols: Record<string, string> = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  INR: "₹",
  CHF: "CHF",
  CNY: "¥",
  KRW: "₩",
  TRY: "₺",
};

const conversionRates: Record<string, number> = {
  USD: 1,
  INR: 89.83,
  BDT: 110.5,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 156.4,
  CAD: 1.36,
  AUD: 1.5,
  CHF: 0.89,
  CNY: 7.24,
  KRW: 1370,
  TRY: 32.5,
};

const translations: Record<string, Record<string, string>> = {
  English: {
    home: "Home",
    shop: "Shop",
    reviews: "Reviews",
    blog: "Blog",
    about: "About",
    contact: "Contact",
    signIn: "Sign In",
    signOut: "Sign Out",
    welcome: "Master Your Inner Aim",
    exploreGear: "Explore Gear",
    featured: "Featured",
    categories: "Categories",
    eliteEquipment: "Elite Equipment",
    address: "Address",
    phone: "Phone",
    email: "Email",
    saveChanges: "Save Profile Changes",
    displayMode: "Display Mode",
    language: "Language",
    currency: "Currency",
    saveSettings: "Save All Settings",
    settingsSaved: "All settings saved successfully!",
    profileInfo: "Profile Info",
    myOrders: "My Orders",
    securitySafety: "Security & Safety",
    preferences: "Preferences",
    billingPayments: "Billing & Payments",
    accountSettings: "Account Settings",
    collection: "The Collection",
    collectionDesc: "Discover our curated selection of high-end archery gear.",
    searchPlaceholder: "Search gear...",
    viewSpecs: "View Specs",
    noProductsFound: "No products found matches your criteria.",
    clearFilters: "Clear Filters",
    allProducts: "All Products",
    specialOffers: "Special Offers",
    customerReviews: "Customer Reviews",
    contactUs: "Contact Us",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    explore: "Explore",
    support: "Support",
    mfa: "Multi-Factor Authentication",
    verifyIdentity: "Verify Identity",
    mfaDesc: "Enter the 6-digit code sent to your registered device",
    mfaSettingDesc:
      "Add an extra layer of security to your account. When enabled, we'll ask for a secondary code during sign-in.",
    verifyAndSignIn: "Verify & Sign In",
  },
  Bengali: {
    home: "হোম",
    shop: "দোকান",
    reviews: "রিভিউ",
    blog: "ব্লগ",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    signIn: "সাইন ইন",
    signOut: "সাইন আউট",
    welcome: "আপনার লক্ষ্য জয় করুন",
    exploreGear: "গিয়ার দেখুন",
    featured: "বৈশিষ্ট্যযুক্ত",
    categories: "বিভাগসমূহ",
    eliteEquipment: "এলিট সরঞ্জাম",
    address: "ঠিকানা",
    phone: "ফোন",
    email: "ইমেইল",
    saveChanges: "পরিবর্তন সংরক্ষণ করুন",
    displayMode: "ডিসপ্লে মোড",
    language: "ভাষা",
    currency: "মুদ্রা",
    saveSettings: "সব সেটিংস সংরক্ষণ করুন",
    settingsSaved: "সব সেটিংস সফলভাবে সংরক্ষিত হয়েছে!",
    profileInfo: "প্রোফাইল তথ্য",
    myOrders: "আমার অর্ডার",
    securitySafety: "নিরাপত্তা ও সুরক্ষা",
    preferences: "সেটিংস",
    billingPayments: "বিলিং ও পেমেন্ট",
    accountSettings: "অ্যাকাউন্ট সেটিংস",
    collection: "কালেকশন",
    collectionDesc: "আমাদের হাই-এন্ড আর্চারি গিয়ারের কিউরেটেড কালেকশন দেখুন।",
    searchPlaceholder: "গিয়ার খুঁজুন...",
    viewSpecs: "বিস্তারিত দেখুন",
    noProductsFound: "আপনার মানদণ্ডের সাথে কোনও পণ্য পাওয়া যায়নি।",
    clearFilters: "ফিল্টার মুছুন",
    allProducts: "সব পণ্য",
    specialOffers: "বিশেষ অফার",
    customerReviews: "গ্রাহক রিভিউ",
    contactUs: "আমাদের সাথে যোগাযোগ",
    privacyPolicy: "গোপনীয়তা নীতি",
    termsOfService: "পরিষেবার শর্তাবলী",
    explore: "এক্সপ্লোর",
    support: "সাপোর্ট",
    mfa: "মাল্টি-ফ্যাক্টর অথেন্টিকেশন",
    verifyIdentity: "পরিচয় যাচাই করুন",
    mfaDesc: "আপনার নিবন্ধিত ডিভাইসে পাঠানো ৬-সংখ্যার কোডটি লিখুন",
    mfaSettingDesc:
      "আপনার অ্যাকাউন্টে নিরাপত্তার একটি অতিরিক্ত স্তর যুক্ত করুন। এটি সক্রিয় থাকলে সাইন-ইন করার সময় একটি কোড চাওয়া হবে।",
    verifyAndSignIn: "যাচাই করুন এবং সাইন-ইন করুন",
  },
  Hindi: {
    home: "होम",
    shop: "शॉप",
    reviews: "समीक्षाएं",
    blog: "ब्लॉग",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    signIn: "साइन इन",
    signOut: "साइन आउट",
    welcome: "अपने लक्ष्य में महारत हासिल करें",
    exploreGear: "गियर देखें",
    featured: "विशेष रुप से प्रदर्शित",
    categories: "श्रेणियाँ",
    eliteEquipment: "एलीट उपकरण",
    address: "पता",
    phone: "फ़ोन",
    email: "इमे़ल",
    saveChanges: "प्रोफ़ाइल परिवर्तन सहेजें",
    displayMode: "डिस्प्ले मोड",
    language: "भाषा",
    currency: "मुद्रा",
    saveSettings: "सभी सेटिंग्स सहेजें",
    settingsSaved: "सभी सेटिंग्स सफलतापूर्वक सहेजी गईं!",
    profileInfo: "प्रोफ़ाइल जानकारी",
    myOrders: "मेरे ऑर्डर",
    securitySafety: "सुरक्षा और बचाव",
    preferences: "प्राथमिकताएं",
    billingPayments: "बिलिंग और भुगतान",
    accountSettings: "खाता सेटिंग्स",
    collection: "संग्रह",
    collectionDesc:
      "उच्च-स्तरीय तीरंदाजी गियर के हमारे क्यूरेटेड चयन की खोज करें।",
    searchPlaceholder: "गियर खोजें...",
    viewSpecs: "विशेष विवरण देखें",
    noProductsFound: "आपके मानदंडों से मेल खाने वाला कोई उत्पाद नहीं मिला।",
    clearFilters: "फिल्टर साफ़ करें",
    allProducts: "सभी उत्पाद",
    specialOffers: "विशेष ऑफर",
    customerReviews: "ग्राहक समीक्षा",
    contactUs: "संपर्क करें",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    explore: "एक्सप्लोर",
    support: "सपोर्ट",
    mfa: "बहु-कारक प्रमाणीकरण",
    verifyIdentity: "पहचान सत्यापित करें",
    mfaDesc: "अपने पंजीकृत डिवाइस पर भेजा गया 6-अंकीय कोड दर्ज करें",
    mfaSettingDesc:
      "अपने खाते में सुरक्षा की एक अतिरिक्त परत जोड़ें। सक्षम होने पर, हम साइन-इन के दौरान एक द्वितीयक कोड मांगेंगे।",
    verifyAndSignIn: "सत्यापित करें और साइन इन करें",
  },
  Spanish: {
    home: "Inicio",
    shop: "Tienda",
    reviews: "Reseñas",
    blog: "Blog",
    about: "Nosotros",
    contact: "Contacto",
    signIn: "Iniciar Sesión",
    signOut: "Cerrar Sesión",
    welcome: "Domina Tu Puntería",
    exploreGear: "Explorar Equipo",
    featured: "Destacado",
    categories: "Categorías",
    eliteEquipment: "Equipo de Élite",
    address: "Dirección",
    phone: "Teléfono",
    email: "Correo electrónico",
    saveChanges: "Guardar Cambios de Perfil",
    displayMode: "Modo de Pantalla",
    language: "Idioma",
    currency: "Moneda",
    saveSettings: "Guardar Ajustes",
    settingsSaved: "¡Ajustes guardados con éxito!",
    profileInfo: "Información del Perfil",
    myOrders: "Mis Pedidos",
    securitySafety: "Seguridad",
    preferences: "Preferencias",
    billingPayments: "Facturación",
    accountSettings: "Ajustes de la Cuenta",
    collection: "La Colección",
    collectionDesc:
      "Descubre nuestra selección de equipos de tiro con arco de alta gama.",
    searchPlaceholder: "Buscar equipo...",
    viewSpecs: "Ver Detalles",
    noProductsFound:
      "No se encontraron productos que coincidan con sus criterios.",
    clearFilters: "Borrar Filtros",
    allProducts: "Todos los productos",
    specialOffers: "Ofertas especiales",
    customerReviews: "Reseñas de clientes",
    contactUs: "Contáctenos",
    privacyPolicy: "Política de privacidad",
    termsOfService: "Términos del servicio",
    explore: "Explorar",
    support: "Soporte",
    mfa: "Autenticación de Dos Factores",
    verifyIdentity: "Verificar Identidad",
    mfaDesc: "Ingrese el código de 6 dígitos enviado a su dispositivo",
    mfaSettingDesc:
      "Agregue una capa adicional de seguridad a su cuenta. Cuando esté habilitado, solicitaremos un código secundario al iniciar sesión.",
    verifyAndSignIn: "Verificar e Iniciar Sesión",
  },
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const saved = localStorage.getItem("x10minds_preferences");
    const globalSettings = localStorage.getItem("x10minds_settings");

    let initialPrefs: Preferences = {
      darkMode: true,
      language: "English",
      currency: "INR",
      mfaEnabled: false,
      fontSize: "medium",
    };

    if (saved) {
      initialPrefs = { ...initialPrefs, ...JSON.parse(saved) };
    }

    // Explicitly sync theme with global settings if available
    if (globalSettings) {
      try {
        const parsedGlobal = JSON.parse(globalSettings);
        if (parsedGlobal.theme) {
          initialPrefs.darkMode = parsedGlobal.theme === "dark";
        }
        if (parsedGlobal.language) {
          initialPrefs.language = parsedGlobal.language;
        }
      } catch (e) {}
    }

    return initialPrefs;
  });

  useEffect(() => {
    // Applying font size to document root
    const root = document.documentElement;
    root.classList.remove("font-small", "font-medium", "font-large");
    root.classList.add(`font-${preferences.fontSize}`);
  }, [preferences.fontSize]);

  // Auto-save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("x10minds_preferences", JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    // Applying modes to document immediately on state change
    if (preferences.darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.style.colorScheme = "light";
    }
  }, [preferences.darkMode]);

  const setDarkMode = (darkMode: boolean) => {
    setPreferences((prev) => ({ ...prev, darkMode }));
  };

  const setLanguage = (language: string) => {
    setPreferences((prev) => ({ ...prev, language }));
  };

  const setCurrency = (currency: string) => {
    setPreferences((prev) => ({ ...prev, currency }));
  };

  const setMfaEnabled = (mfaEnabled: boolean) => {
    setPreferences((prev) => ({ ...prev, mfaEnabled }));
  };

  const setFontSize = (fontSize: "small" | "medium" | "large") => {
    setPreferences((prev) => ({ ...prev, fontSize }));
  };

  const savePreferences = () => {
    // This is now handled automatically by the useEffect above,
    // but kept for backward compatibility if components call it manually.
    localStorage.setItem("x10minds_preferences", JSON.stringify(preferences));
  };

  const formatPrice = (price: number) => {
    const rate = conversionRates[preferences.currency] || 1;
    const converted = price * rate;
    const symbol = currencySymbols[preferences.currency] || "$";

    // Formatting for currencies like JPY/KRW which usually don't have decimals
    const fractionDigits =
      preferences.currency === "JPY" || preferences.currency === "KRW" ? 0 : 2;

    return `${symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    })}`;
  };

  const t = (key: string) => {
    const lang = preferences.language;
    return translations[lang]?.[key] || translations["English"][key] || key;
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setDarkMode,
        setLanguage,
        setCurrency,
        setMfaEnabled,
        setFontSize,
        formatPrice,
        savePreferences,
        t,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
