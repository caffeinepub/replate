import type {
  CompanySize,
  Lead,
  LeadSource,
  LeadStatus,
  TurnoverRange,
} from "./leads";
import { ALL_AREAS, ALL_PRODUCTS } from "./leads";

// Deterministic pseudo-random number generator (seeded)
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pick<T>(arr: readonly T[] | T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickMultiple<T>(
  arr: readonly T[] | T[],
  count: number,
  rand: () => number,
): T[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

const FIRST_NAMES = [
  "Rajesh",
  "Priya",
  "Anand",
  "Suresh",
  "Meena",
  "Vikram",
  "Kavita",
  "Amit",
  "Ravi",
  "Deepa",
  "Sanjay",
  "Nisha",
  "Arun",
  "Mohan",
  "Sonali",
  "Harish",
  "Pooja",
  "Rohit",
  "Kiran",
  "Deepak",
  "Preeti",
  "Suhas",
  "Nilesh",
  "Rekha",
  "Santosh",
  "Girish",
  "Swati",
  "Ajay",
  "Manish",
  "Laxmi",
  "Mahesh",
  "Sunita",
  "Vinod",
  "Shilpa",
  "Ganesh",
  "Archana",
  "Milind",
  "Vandana",
  "Sachin",
  "Smita",
  "Dinesh",
  "Pratima",
  "Ramesh",
  "Nalini",
  "Vijay",
  "Rashmi",
  "Nitin",
  "Veena",
  "Yogesh",
  "Padma",
  "Sunil",
  "Madhuri",
  "Pramod",
  "Leena",
  "Balaji",
  "Divya",
  "Ashish",
  "Chitra",
  "Hemant",
  "Jyoti",
  "Prafulla",
  "Sumedha",
  "Devendra",
  "Shalini",
  "Chandrakant",
  "Vaishali",
  "Eknath",
  "Savita",
  "Dattatray",
  "Rohini",
  "Tanmay",
  "Rutuja",
  "Kapil",
  "Ishita",
  "Tejas",
  "Neeta",
  "Omkar",
  "Sujata",
  "Prasad",
  "Ujwala",
];

const LAST_NAMES = [
  "Mehta",
  "Sharma",
  "Nair",
  "Patil",
  "Desai",
  "Joshi",
  "Rao",
  "Kumar",
  "Kulkarni",
  "Iyer",
  "Verma",
  "Gupta",
  "Pillai",
  "Tiwari",
  "Shah",
  "Bhat",
  "Menon",
  "Naik",
  "Sawant",
  "Kadam",
  "Bhosale",
  "Raut",
  "Surve",
  "Gawde",
  "Pawar",
  "Shinde",
  "Koli",
  "Salvi",
  "Jadhav",
  "Thite",
  "Mhatre",
  "Gadkar",
  "Rane",
  "More",
  "Ghag",
  "Thakur",
  "Deshpande",
  "Salunkhe",
  "Dalvi",
  "Mane",
  "Bhatt",
  "Parab",
  "Gogate",
  "Shirke",
  "Parekh",
  "Jain",
  "Doke",
  "Thorat",
  "Ghosh",
  "Kapoor",
  "Shetty",
  "Patel",
  "Reddy",
  "Singh",
  "Bose",
  "Raj",
  "Merchant",
  "Khan",
  "Mishra",
  "Yadav",
];

const DESIGNATIONS = [
  "IT Manager",
  "CTO",
  "CEO",
  "IT Head",
  "IT Director",
  "VP IT",
  "CIO",
  "GM IT",
  "Director IT",
  "Plant IT Manager",
  "Systems Manager",
  "IT Administrator",
  "VP Engineering",
  "Founder",
  "MD",
  "Operations Head",
  "Admin Head",
  "GM Operations",
  "Branch Manager IT",
  "Campus IT Manager",
  "Park Manager IT",
  "Zone IT Manager",
  "Data Centre Manager",
  "Plant Manager",
  "CFO",
  "Network Manager",
  "Infrastructure Head",
  "Digital Transformation Lead",
  "Sr. IT Manager",
];

const COMPANY_SUFFIXES = [
  "Pvt Ltd",
  "Ltd",
  "Corp",
  "Industries",
  "Solutions",
  "Services",
  "Technologies",
  "Enterprises",
  "Group",
  "Associates",
  "Systems",
  "Consultancy",
  "Works",
  "Agency",
  "Hub",
  "Park",
  "Centre",
];

const _COMPANY_PREFIXES = [
  "Navi Mumbai",
  "Vashi",
  "Airoli",
  "Belapur",
  "Mumbai",
  "Andheri",
  "BKC",
  "Powai",
  "Delhi",
  "Gurugram",
  "Noida",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Chandigarh",
  "Jaipur",
  "Bhopal",
  "Indore",
];

// City label sanitiser for company names — strips "Bengaluru Whitefield" → "Bengaluru" etc.
function sanitiseCityForName(area: string): string {
  // Take just the first word for compound area names
  const simpleMap: Record<string, string> = {
    "Gurugram Cyber City": "Gurugram",
    "Gurugram DLF Phase 1": "Gurugram",
    "Gurugram DLF Phase 2": "Gurugram",
    "Noida Sector 62": "Noida",
    "Noida Sector 18": "Noida",
    "Noida Sector 16": "Noida",
    "Delhi Okhla": "Delhi",
    "Delhi Dwarka": "Delhi",
    "Delhi Janakpuri": "Delhi",
    "Delhi Rohini": "Delhi",
    "Bengaluru Whitefield": "Bengaluru",
    "Bengaluru Electronic City": "Bengaluru",
    "Bengaluru Koramangala": "Bengaluru",
    "Bengaluru Hebbal": "Bengaluru",
    "Bengaluru Manyata Tech Park": "Bengaluru",
    "Bengaluru Indiranagar": "Bengaluru",
    "Bengaluru HSR Layout": "Bengaluru",
    "Bengaluru BTM Layout": "Bengaluru",
    "Hyderabad HITEC City": "Hyderabad",
    "Hyderabad Gachibowli": "Hyderabad",
    "Hyderabad Kondapur": "Hyderabad",
    "Hyderabad Madhapur": "Hyderabad",
    "Hyderabad Begumpet": "Hyderabad",
    "Hyderabad Banjara Hills": "Hyderabad",
    "Chennai Anna Salai": "Chennai",
    "Chennai Guindy": "Chennai",
    "Chennai Tidel Park": "Chennai",
    "Chennai OMR": "Chennai",
    "Chennai Mount Road": "Chennai",
    "Chennai Ambattur": "Chennai",
    "Kolkata Salt Lake Sector V": "Kolkata",
    "Kolkata Rajarhat": "Kolkata",
    "Kolkata Park Street": "Kolkata",
    "Kolkata New Town": "Kolkata",
    "Kolkata Howrah": "Kolkata",
    "Pune Hinjewadi": "Pune",
    "Pune Kharadi": "Pune",
    "Pune Baner": "Pune",
    "Pune Hadapsar": "Pune",
    "Pune Magarpatta": "Pune",
    "Pune Wakad": "Pune",
    "Pune Viman Nagar": "Pune",
    "Pune Yerawada": "Pune",
    "Navi Mumbai CBD": "Navi Mumbai",
    "Pune City": "Pune",
    "Nagpur Central": "Nagpur",
    "Connaught Place": "Delhi",
    "Nehru Place": "Delhi",
    Saket: "Delhi",
  };
  return simpleMap[area] ?? area.split(" ")[0];
}

const COMPANY_INDUSTRY = [
  "Tech",
  "Finance",
  "Pharma",
  "Logistics",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Chemical",
  "Textile",
  "Auto",
  "Media",
  "Education",
  "Hospitality",
  "Shipping",
  "Engineering",
  "Food",
  "Steel",
  "Construction",
  "Digital",
  "IT",
  "Software",
  "Biotech",
  "Export",
  "Trading",
];

const NOTES_TEMPLATES = [
  "Requires {product} for main office",
  "Expanding operations, needs {product}",
  "Upgrading existing network to {product}",
  "Looking for cost-effective {product} solution",
  "Multi-branch deployment of {product}",
  "Compliance requirements driving {product} need",
  "New office setup requiring {product}",
  "Migration from legacy system to {product}",
  "Budget approved for {product} in Q{q}",
  "Comparing vendors for {product}",
  "High-speed {product} needed for operations",
  "Digital transformation requires {product}",
  "Remote work setup needs {product}",
  "Cloud migration with {product} as priority",
  "Factory automation needs {product}",
];

function generateNote(products: string[], rand: () => number): string {
  const template = pick(NOTES_TEMPLATES, rand);
  const product = pick(products, rand);
  const quarter = Math.ceil((new Date().getMonth() + 1) / 3);
  return template.replace("{product}", product).replace("{q}", String(quarter));
}

function generateEmail(
  firstName: string,
  lastName: string,
  company: string,
): string {
  const domain = company
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);
  const user = (
    firstName.toLowerCase() + lastName.toLowerCase().slice(0, 3)
  ).replace(/[^a-z]/g, "");
  return `${user}@${domain}.com`;
}

function generatePhone(rand: () => number): string {
  const prefix = pick(
    [
      "98",
      "97",
      "96",
      "95",
      "90",
      "91",
      "87",
      "86",
      "85",
      "84",
      "83",
      "82",
      "81",
      "80",
      "79",
      "78",
      "77",
      "76",
      "75",
    ],
    rand,
  );
  const digits = Array.from({ length: 8 }, () => Math.floor(rand() * 10)).join(
    "",
  );
  return prefix + digits;
}

export interface GenerateOptions {
  count: number;
  areas?: string[];
  products?: string[];
  companySize?: CompanySize[];
  startId: number;
  seedOffset?: number;
}

export function generateLeads(options: GenerateOptions): Lead[] {
  const {
    count,
    areas = [...ALL_AREAS],
    products = [...ALL_PRODUCTS],
    companySize,
    startId,
    seedOffset = 0,
  } = options;

  const statuses: LeadStatus[] = [
    "New",
    "New",
    "New",
    "Contacted",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Won",
    "Lost",
  ];
  const sources: LeadSource[] = [
    "Cold Call",
    "Cold Call",
    "Referral",
    "Referral",
    "Website",
    "Event",
    "Walk-in",
  ];
  const sizes: CompanySize[] = companySize ?? [
    "SME",
    "SME",
    "Mid-Market",
    "Mid-Market",
    "Enterprise",
  ];

  const leads: Lead[] = [];

  for (let i = 0; i < count; i++) {
    const rand = seededRand(
      (startId + i) * 31337 + seedOffset * 7919 + i * 1234,
    );
    // Warm up the generator
    for (let w = 0; w < 5; w++) rand();

    const firstName = pick(FIRST_NAMES, rand);
    const lastName = pick(LAST_NAMES, rand);
    const area = pick(areas, rand);
    const industry = pick(COMPANY_INDUSTRY, rand);
    const suffix = pick(COMPANY_SUFFIXES, rand);
    const cityLabel = sanitiseCityForName(area);
    const companyName = `${cityLabel} ${industry} ${suffix}`;
    const designation = pick(DESIGNATIONS, rand);
    const size = pick(sizes, rand);
    const status = pick(statuses, rand);
    const source = pick(sources, rand);

    // Select 1-4 products, weighted toward the passed products
    const productCount = Math.floor(rand() * 3) + 1;
    const selectedProducts = pickMultiple(products, productCount, rand);

    const email = generateEmail(firstName, lastName, companyName);
    const phone = generatePhone(rand);
    const notes = generateNote(selectedProducts, rand);

    const turnoverMap: Record<CompanySize, TurnoverRange[]> = {
      SME: ["< 1 Cr", "1–5 Cr", "5–25 Cr"],
      "Mid-Market": ["25–100 Cr", "100–500 Cr"],
      Enterprise: ["100–500 Cr", "500 Cr+"],
    };
    const turnoverCrores = pick(turnoverMap[size], rand);

    leads.push({
      id: startId + i,
      companyName,
      contactPerson: `${firstName} ${lastName}`,
      designation,
      phone,
      email,
      area,
      companySize: size,
      turnoverCrores,
      interestedProducts: selectedProducts,
      leadStatus: status,
      source,
      notes,
    });
  }

  return leads;
}

// Get today's date string as YYYY-MM-DD
export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Daily expansion: generate leads for today if not already done
export function getDailyLeads(existingMaxId: number, dailyCount = 15): Lead[] {
  const today = getTodayKey();
  const storageKey = `daily_leads_${today}`;
  const cached = localStorage.getItem(storageKey);
  if (cached) {
    try {
      return JSON.parse(cached) as Lead[];
    } catch {
      // fallthrough to generate
    }
  }
  // Seed based on today's date
  const dateSeed = Number.parseInt(today.replace(/-/g, ""), 10);
  const newLeads = generateLeads({
    count: dailyCount,
    startId: existingMaxId + 1,
    seedOffset: dateSeed,
  });
  localStorage.setItem(storageKey, JSON.stringify(newLeads));
  return newLeads;
}
