export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  description: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  colors?: string[];
  sizes?: string[];
  colorImages?: Record<string, string>;
  specifications?: Record<string, string>;
}

// Combine all product data into a single source of truth without hardcoded IDs
// IDs will be generated based on index to guarantee uniqueness
const rawProducts: Partial<Product>[] = [
  // --- FAMOUS PRODUCTS (The main high-tier items) ---
  {
    name: "Hoyt Stratos 36 HBT",
    category: "Bows",
    description: "The pinnacle of target compound performance, featuring the adjustable HBT cam system for ultimate precision.",
    price: 1899.00,
    image: "/images/products/hoyt starts 36.png",
    images: ["/images/products/hoyt starts 36.png", "/images/products/hoyt startas 36 second pic.png"],
    colors: ["Cobalt Blue", "Championship Red", "Black Out"],
    specifications: { "Axle to Axle": "36.5\"", "Brace Height": "7.3\"", "Speed": "318 FPS", "Draw Length": "25.5-31\"" }
  },
  {
    name: "Win & Win Wiawis ATF-X",
    category: "Bows",
    description: "Anti-Torsional Design forged riser for ultimate stability and vibration dampening. Preferred by elite Olympic archers.",
    price: 950.00,
    image: "/images/products/ATF-X bow.png",
    images: ["/images/products/ATF-X bow.png", "/images/products/ATF-X second pic.png"],
    colors: ["Brilliant White", "Graphite Black", "Sonic Red", "Indigo Blue"],
    sizes: ["25\"", "27\""]
  },
  {
    name: "Mathews Title 36",
    category: "Bows",
    description: "Designed for the most competitive archers, delivering unmatched stability and consistency with the new Bridge-Lock technology.",
    price: 2099.00,
    image: "/images/products/Mathews title 36.png",
    images: ["/images/products/Mathews title 36.png"],
    colors: ["Black", "Blue", "Red", "White"]
  },
  {
    name: "Easton X10 Pro Tour (Dozen)",
    category: "Arrows",
    description: "The world's most advanced arrow, used by nearly every Olympic medalist. Engineered for long-distance accuracy.",
    price: 550.00,
    image: "/images/products/proTour Arrow.png",
    images: ["/images/products/proTour Arrow.png"],
    sizes: ["380", "420", "470", "520", "570", "620"]
  },
  {
    name: "Axcel Achieve XP Sight",
    category: "Accessories",
    description: "The gold standard for tournament sights with ultra-fine micro-adjustment and zero backlash.",
    price: 499.00,
    image: "/images/products/axcel sight.png",
    images: ["/images/products/axcel sight.png"],
    colors: ["Black", "Blue", "Red", "Silver"]
  },
  {
    name: "Hoyt Formula XD Riser",
    category: "Bows",
    description: "Featuring a new grip geometry and dynamic balance design for recurve perfection. The evolution of the Olympic champion.",
    price: 899.00,
    image: "/images/products/formula xd.png",
    images: ["/images/products/formula xd.png"],
    colors: ["Slate Arctic", "Liquid Blue", "White Lightning", "Black Ink"]
  },
  {
    name: "MK Korea MK X10 Riser",
    category: "Bows",
    description: "Premium machining and material technology for the serious competitor. Offers extreme durability and a perfect shot feel.",
    price: 850.00,
    image: "/images/products/mk recurve bow.png",
    images: ["/images/products/mk recurve bow.png"],
    colors: ["Gold", "Silver", "Black", "Blue"]
  },
  {
    name: "Shibuya Ultima RCIII Sight",
    category: "Accessories",
    description: "Lightweight, carbon fiber sight favored by recurve champions worldwide for its reliability and simplicity.",
    price: 380.00,
    image: "/images/products/shubiya sight.png",
    images: ["/images/products/shubiya sight.png", "/images/products/shubiya sight second pic.png"],
    colors: ["Black", "Blue", "Red", "Gold"]
  },
  {
    name: "Beiter Plunger",
    category: "Accessories",
    description: "The most precise and tunable pressure button on the market. Used by pros to fine-tune arrow flight.",
    price: 215.00,
    image: "/images/products/beiter plunger.png",
    images: ["/images/products/beiter plunger.png"],
    colors: ["Black", "Silver", "Blue", "Red"]
  },
  {
    name: "RamRods Edge Stabilizer Set",
    category: "Accessories",
    description: "Wind-cutting aerodynamic design for superior outdoor stability and vibration dampening.",
    price: 650.00,
    image: "/images/products/ramrod set.png",
    images: ["/images/products/ramrod set.png"],
    sizes: ["27\"", "30\"", "33\""]
  },
  {
    name: "Easton A/C/E Arrows (Dozen)",
    category: "Arrows",
    description: "Legendary aluminum/carbon barreled design for field and target archery. Exceptional speed and precision.",
    price: 420.00,
    image: "/images/products/easton ACE arrow.png",
    images: ["/images/products/easton ACE arrow.png", "/images/products/Easton ACE arrow second pic.png"],
    sizes: ["370", "400", "430", "470", "520", "570", "620", "670", "720", "780", "850", "920", "1000", "1100", "1250"]
  },
  {
    name: "Fivics Saker 2 Finger Tab",
    category: "Accessories",
    description: "Ergonomic brass plate tab designed for ultimate comfort and consistent release. Used by the world's best.",
    price: 210.00,
    image: "/images/products/fivics finager tape.png",
    images: ["/images/products/fivics finager tape.png"],
    sizes: ["Small", "Medium", "Large"]
  },
  {
    name: "Block Target 6x6 Professional",
    category: "Targets",
    description: "Massive, high-density target block for professional range setups. Stops all arrows and offers easy removal.",
    price: 450.00,
    image: "/images/products/shooting block 6x6.png",
    images: ["/images/products/shooting block 6x6.png"]
  },
  {
    name: "NS-G Wooden Limbs",
    category: "Bows",
    description: "High-performance wooden-core limbs for a traditional feel with modern Olympic speed.",
    price: 950.00,
    image: "/images/products/limd W&W wooden.png",
    images: ["/images/products/limd W&W wooden.png"],
    sizes: ["66\"", "68\"", "70\""],
    specifications: { "Material": "Carbon/Wood", "Mount": "ILF" }
  },
  {
    name: "Gas Pro String Set",
    category: "Accessories",
    description: "Custom premium bowstrings with zero creep and perfect peep alignment.",
    price: 220.00,
    image: "/images/products/gas pro string.png",
    images: ["/images/products/gas pro string.png"],
    colors: ["Black/Gold", "Blue/White", "Red/Black"]
  },
  {
    name: "Win & Win MXT-XP Limbs",
    category: "Bows",
    description: "The next generation of carbon limbs, engineered for explosive speed and smooth drawing.",
    price: 1099.00,
    image: "/images/products/W&W xp limb.png",
    images: ["/images/products/W&W xp limb.png"],
    sizes: ["66\"", "68\"", "70\""]
  },
  {
    name: "Easton Nocks (12pk)",
    category: "Accessories",
    description: "Precision fit nocks for consistent arrow flight and perfect string alignment.",
    price: 24.00,
    image: "/images/products/Easton Nock.png",
    images: ["/images/products/Easton Nock.png"],
    colors: ["Clear", "Neon Green", "Ruby Red", "Electric Blue"]
  },
  {
    name: "Premium Bow Bag",
    category: "Cases",
    description: "Durable, high-capacity bow bag with multiple compartments for all your archery gear.",
    price: 150.00,
    image: "/images/products/bow bag.png",
    images: ["/images/products/bow bag.png", "/images/products/Bow bag(1).png"],
    colors: ["Black", "Blue", "Red"]
  },
  {
    name: "Full Tournament Case",
    category: "Cases",
    description: "Luxury tournament case with wheels. Fits two complete bow setups and all accessories.",
    price: 350.00,
    image: "/images/products/Easton bow bag.png",
    images: ["/images/products/Easton bow bag.png"]
  },
  {
    name: "Compound Release Aid",
    category: "Accessories",
    description: "Precision release aid with adjustable trigger tension and ergonomic grip.",
    price: 280.00,
    image: "/images/products/compound releaser.png",
    images: ["/images/products/compound releaser.png"]
  },
  {
    name: "Fivics Titan Compound Bow",
    category: "Bows",
    description: "Engineered for pure speed and stability, the Titan is the ultimate competition compound machine.",
    price: 1650.00,
    image: "/images/products/Fivics compound bow.png",
    images: ["/images/products/Fivics compound bow.png"],
    colors: ["Gold", "Silver", "Black"]
  },
  {
    name: "Stabilizer Long Rod",
    category: "Accessories",
    description: "Ultra-stiff carbon stabilizer for maximum balance and vibration control.",
    price: 220.00,
    image: "/images/products/stabilizer long rod.png",
    images: ["/images/products/stabilizer long rod.png"],
    sizes: ["28\"", "30\"", "32\""]
  },
  {
    name: "Stabilizer Short Rod",
    category: "Accessories",
    description: "Compact side rod for lateral balance and improved bow stability during full draw.",
    price: 110.00,
    image: "/images/products/commander short rod.png",
    images: ["/images/products/commander short rod.png"],
    sizes: ["10\"", "12\"", "15\""]
  },
  {
    name: "Win & Win NS Graphene Limbs",
    category: "Bows",
    description: "Revolutionary Graphene foam core limbs for the fastest recovery and smoothest shot ever designed.",
    price: 1150.00,
    image: "/images/products/limb W&W carbon.png",
    images: ["/images/products/limb W&W carbon.png"],
    sizes: ["66\"", "68\"", "70\""]
  },
  // --- ADDITIONAL PRODUCTS (Previously hardcoded) ---
  {
    name: "Legend Archery Quiver",
    category: "Accessories",
    price: 85.00,
    image: "/images/products/LEGEND quiver.png",
    description: "High-quality hip quiver with four arrow tubes and multiple accessory pockets.",
    rating: 4.7,
    reviews: 42,
    colors: ["Black", "Blue", "Red", "Grey"]
  },
  {
    name: "Arm Guard Elite",
    category: "Accessories",
    price: 35.00,
    image: "/images/products/W&W arm gaurd.png",
    description: "Low profile, ventilated arm guard for maximum protection and comfort.",
    rating: 4.9,
    reviews: 88,
    colors: ["Black", "White", "Blue"]
  },
  {
    name: "Professional Finger Sling",
    category: "Accessories",
    price: 12.00,
    image: "/images/products/sling.png",
    description: "Durable finger sling for consistent bow control and release.",
    rating: 4.8,
    reviews: 156,
    colors: ["Black", "Red", "Blue", "Yellow"]
  },
  {
    name: "Target Face 80cm (10pk)",
    category: "Targets",
    price: 65.00,
    image: "/images/products/80cm face.png",
    description: "FITA regulation target faces for tournament practice.",
    rating: 4.5,
    reviews: 210
  },
  {
    name: "FITA 122cm Target Face (10pk)",
    category: "Targets",
    price: 85.00,
    image: "/images/products/144cm FAce.png",
    description: "Official 122cm tournament target faces for 70m/90m distances. Reinforced paper.",
    rating: 4.9,
    reviews: 45
  },
  {
    name: "Recurve Bow Case Pro",
    category: "Cases",
    price: 180.00,
    image: "/images/products/bow bag 5.png",
    description: "Hardshell protection for your recurve setup with dedicated limb and riser slots.",
    rating: 4.9,
    reviews: 67
  },
  {
    name: "Elite Chest Guard",
    category: "Accessories",
    price: 40.00,
    image: "/images/products/chest gaurd.png",
    description: "Breathable mesh chest guard for consistent string clearance and protection.",
    rating: 4.7,
    reviews: 120,
    colors: ["White", "Black", "Blue", "Red"]
  },
  {
    name: "Arrow Puller 2.0",
    category: "Accessories",
    price: 15.00,
    image: "/images/products/arrow puller.png",
    description: "High-grip rubber arrow puller for easy removal from dense targets.",
    rating: 4.8,
    reviews: 300
  },
  {
    name: "Easton SuperDrive 23 (Dozen)",
    category: "Arrows",
    price: 240.00,
    image: "/images/products/Easton 23 arrow.png",
    description: "The ultimate standard for 23-diameter indoor target arrows.",
    rating: 4.9,
    reviews: 85,
    sizes: ["325", "375", "475"]
  },
  {
    name: "Legend Everest 44 Case",
    category: "Cases",
    price: 280.00,
    image: "/images/products/everest 44 Bow bag.png",
    description: "Premium rolling compound case with heavy-duty padding and internal security straps.",
    rating: 4.9,
    reviews: 72,
    colors: ["Black", "Blue", "Red"]
  },
  {
    name: "Easton Deluxe Compound Case",
    category: "Cases",
    price: 110.00,
    image: "/images/products/Bow bag(1).png",
    description: "Compact and rugged soft case with multiple accessory pockets and sleek design.",
    rating: 4.5,
    reviews: 215,
    colors: ["Black", "Grey", "Camo"]
  },
  {
    name: "SKB iSeries Recurve Case",
    category: "Cases",
    price: 450.00,
    image: "/images/products/bow bag 4.png",
    description: "Mil-spec hardshell transport case with custom foam for Olympic recurve setups.",
    rating: 5.0,
    reviews: 45
  },
  {
    name: "Shrewd Atlas Double V-Bar",
    category: "Accessories",
    price: 129.99,
    image: "/images/products/vbar set.png",
    description: "Heavy-duty adjustable V-bar with patented locking system for absolute rock-solid stability. Features integrated quick disconnects.",
    rating: 4.9,
    reviews: 112,
    colors: ["Matte Black", "Gloss Black", "Silver"]
  },
  {
    name: "Easton Adjustable V-Bar",
    category: "Accessories",
    price: 75.00,
    image: "/images/products/easton vbar.png",
    description: "Precision machined aluminum block allowing for infinite adjustment of elevation and horizontal angles for perfect balance.",
    rating: 4.7,
    reviews: 84,
    colors: ["Black"]
  },
  {
    name: "Beiter V-Bar Force",
    category: "Accessories",
    price: 58.00,
    image: "/images/products/vbar set.png",
    description: "The evolution of the classic. High-density plastic components provide superior vibration damping compared to metal alternatives.",
    rating: 4.8,
    reviews: 230,
    colors: ["Black", "Silver", "Blue"]
  },
  {
    name: "RamRods Vektor Stabilizer Set",
    category: "Accessories",
    price: 850.00,
    image: "/images/products/Vector stabilizer set.png",
    description: "The Vektor features a tapered design that maximizes stiffness-to-weight ratio. Includes one 30\" long rod and two 12\" side rods.",
    rating: 4.9,
    reviews: 65,
    sizes: ["30\" Set", "33\" Set"]
  },
  {
    name: "Win & Win ACS-EL Stabilizer Set",
    category: "Accessories",
    price: 495.00,
    image: "/images/products/rods set.png",
    description: "Graphene foam core technology provides exceptional shock absorption without sacrificing stiffness. Complete 3-rod competition setup.",
    rating: 4.7,
    reviews: 142,
    colors: ["Carbon Black", "White Gold", "Red Gold"]
  },
  {
    name: "Range-O-Matic Spin Wing Vanes (50pk)",
    category: "Accessories",
    price: 18.50,
    image: "/images/products/spin wing.png",
    description: "The original curl vane used by Olympic Champions for decades. Extremely light and forgiving with excellent clearance.",
    rating: 4.8,
    reviews: 320,
    colors: ["White", "Blue", "Red", "Yellow", "Black"],
    sizes: ["1 3/4\"", "2\""]
  },
  {
    name: "KSL Jet6 Vanes (50pk)",
    category: "Accessories",
    price: 32.00,
    image: "/images/products/jet 6.png",
    description: "Aerodynamic vanes designed with airflow technology for high speed and stability in crosswinds. Developed by Coach Kisik Lee.",
    rating: 4.9,
    reviews: 145,
    colors: ["Berry Purple", "Apple Green", "Rose Pink", "Ocean Blue"],
    sizes: ["Short", "Medium", "Long"]
  },
  {
    name: "Tournament Compound Bow Stand",
    category: "Accessories",
    price: 45.00,
    image: "/images/products/compound stand.png",
    description: "Stable and foldable stand designed specifically for compound bows. Protects cams from ground contact.",
    rating: 4.6,
    reviews: 34,
    colors: ["Black", "Silver", "Red"]
  },
  {
    name: "Professional Recurve Bow Stand",
    category: "Accessories",
    price: 35.00,
    image: "/images/products/stand for recurve MULTI.png",
    images: ["/images/products/stand for recurve MULTI.png", "/images/products/multi stand seconf pic.png"],
    description: "Lightweight and magnetic collapsing bow stand. Essential for every recurve archer.",
    rating: 4.7,
    reviews: 156,
    colors: ["Silver", "Black", "Blue"]
  },
  {
    name: "Leather Pocket Quiver",
    category: "Accessories",
    price: 18.00,
    image: "/images/products/pocket.png",
    description: "Compact leather pocket quiver for convenient arrow carrying during practice or field sessions.",
    rating: 4.5,
    reviews: 78
  }
];

// Pre-compute IDs and random stats ONCE to prevent render loops
export const products: Product[] = rawProducts.map((p, i) => {
  const id = (i + 1).toString();
  // Use existing rating/reviews if provided (for the second half of list), otherwise generate
  const rating = p.rating || +(4.8 + Math.random() * 0.2).toFixed(1);
  const reviews = p.reviews || Math.floor(Math.random() * 200) + 50;
  const featured = p.featured !== undefined ? p.featured : i < 12;

  return {
    ...p,
    id,
    rating,
    reviews,
    featured,
  } as Product;
});

export const getProducts = () => Promise.resolve(products);
export const getProductById = (id: string) => Promise.resolve(products.find(p => p.id === id));
