import { MapPin, Phone, Globe, ExternalLink, MessageCircle } from "lucide-react";
import BranchImg from "@/assets/location-img.jpg";

const branches = [
  {
    id: 1,
    name: "Head Office",
    address: "No 7 VON Garden City Estate, Lugbe, Abuja.",
    tel: "+234 — 8101389942",
    image: BranchImg,
  },
  {
    id: 2,
    name: "Pyakasa",
    address: "16b, Adewunmi Adebimpe, Lugbe, Abuja.",
    tel: "+234 — 8077411611",
    image: BranchImg,
  },
  {
    id: 3,
    name: "FHA Office",
    address: "37a, Glover Road (Glover retail), FHA, Lugbe, Abuja.",
    tel: "+234 — 8077411630",
    image: BranchImg,
  },
  {
    id: 4,
    name: "Piwoyi",
    address:
      "24, Emma Abimbola Cole, Opposite Silverado Mall 2, Piwoyi, Lugbe, Abuja.",
    tel: "+234 — 8077411954",
    image: BranchImg,
  },
  {
    id: 5,
    name: "Sabon-Lugbe",
    address:
      "Shop B4 Retail Center, Lakowe Lakes Golf & Country Estate, Sabon-Lugbe, Abuja.",
    tel: "+234 — 8077411648",
    image: BranchImg,
  },
  {
    id: 6,
    name: "Kubwa Branch",
    address: "Shop 6, Banana Shopping Complex, Bryazhin, Kubwa, Abuja.",
    tel: "+234 — 8077411945",
    image: BranchImg,
  },
  {
    id: 7,
    name: "NNPC Office",
    address: "NNPC filling Station, Kubwa, Abuja.",
    tel: "+234 — 8077411594",
    image: BranchImg,
  },
  {
    id: 8,
    name: "NYSC Office",
    address: "NYSC Office, Palm Spring Road, off NYSC Camp kubwa, Abuja.",
    tel: "+234 — 8077411942",
    image: BranchImg,
  },
];

const BranchCard = ({ branch }) => {
  const isHeadOffice = branch.name === "Head Office";

  return (
    <div className="group relative bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 border border-slate-100 flex flex-col h-full overflow-hidden">
      
      {/* Image Section */}
      <div className="relative h-52 w-full rounded-[1.5rem] overflow-hidden">
        <img
          src={branch.image}
          alt={branch.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Badge */}
        {isHeadOffice && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            Main Hub
          </div>
        )}

        {/* Floating Quick Actions (Visible on Hover) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <a href={`tel:${branch.tel}`} className="p-3 bg-white rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors shadow-xl">
            <Phone size={20} />
          </a>
          <button className="p-3 bg-white rounded-full text-green-600 hover:bg-green-600 hover:text-white transition-colors shadow-xl">
            <MessageCircle size={20} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
            {branch.name}
          </h3>
          <MapPin size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
        </div>

        <div className="space-y-3 flex-grow">
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
            {branch.address}
          </p>
          
          <div className="pt-4 border-t border-slate-50">
             <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                <Phone size={14} />
                <span className="text-[12px] font-medium">{branch.tel}</span>
             </div>
          </div>
        </div>

        {/* Modern "Directions" Button */}
        <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white rounded-xl font-semibold text-sm transition-all duration-300">
          <span>Get Directions</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

const Location = () => {
  return (
    <section className="bg-[#f7f7f7] py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#4F7DF3] uppercase">
            Our Network
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Find a Klean Enterprise branch closest to you. Professional garment care, just around the corner.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Location;