import React from 'react';
import { MapPin, Phone, Facebook, Linkedin, Twitter } from 'lucide-react';
import BranchImg from "@/assets/location-img.jpg";

const branches = [
  {
    id: 1,
    name: "Head Office",
    address: "No 7 VON Garden City Estate, Lugbe, Abuja.",
    tel: "+234 — 8101389942",
    image: BranchImg
  },
  {
    id: 2,
    name: "Pyakasa",
    address: "16b, Adewunmi Adebimpe, Lugbe, Abuja.",
    tel: "+234 — 8077411611",
    image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    name: "FHA Office",
    address: "37a, Glover Road (Glover retail), FHA, Lugbe, Abuja.",
    tel: "+234 — 8077411630",
    image: "/api/placeholder/400/250"
  },
  {
    id: 4,
    name: "Piwoyi",
    address: "24, Emma Abimbola Cole, Opposite Silverado Mall 2, Piwoyi, Lugbe, Abuja.",
    tel: "+234 — 8077411954",
    image: "/api/placeholder/400/250"
  },
  {
    id: 5,
    name: "Sabon-Lugbe",
    address: "Shop B4 Retail Center, Lakowe Lakes Golf & Country Estate, Sabon-Lugbe, Abuja.",
    tel: "+234 — 8077411648",
    image: "/api/placeholder/400/250"
  },
  {
    id: 6,
    name: "Kubwa Branch",
    address: "Shop 6, Banana Shopping Complex, Bryazhin, Kubwa, Abuja.",
    tel: "+234 — 8077411945",
    image: "/api/placeholder/400/250"
  },
  {
    id: 7,
    name: "NNPC Office",
    address: "NNPC filling Station, Kubwa, Abuja.",
    tel: "+234 — 8077411594",
    image: "/api/placeholder/400/250"
  },
  {
    id: 8,
    name: "NYSC Office",
    address: "NYSC Office, Palm Spring Road, off NYSC Camp kubwa, Abuja.",
    tel: "+234 — 8077411942",
    image: "/api/placeholder/400/250"
  }
];

const BranchCard = ({ branch }) => (
  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-slate-50">
    {/* Image Container with Curve Overlay */}
    <div className="relative h-40 w-full">
      <img 
        src={branch.image} 
        alt={branch.name} 
        className="w-full h-full object-cover object-center" 
        loading='lazy'
        decoding="async"
      />
      {/* The "Arc" Effect */}
      <div className="absolute -bottom-1 left-0 right-0 bg-white h-8 rounded-t-[50%] scale-x-125"></div>
    </div>

    {/* Content */}
    <div className="px-6 pb-8 pt-2 text-center flex flex-col flex-grow">
      <h3 className="text-lg font-bold text-slate-800 mb-3">{branch.name}</h3>

      <div className="text-[13px] text-slate-500 leading-relaxed mb-4 flex-grow">
        <p className="mb-1">{branch.address.split(',')[0]}</p>
        <p>{branch.address.split(',').slice(1).join(',')}</p>
        <p className="mt-3 font-medium text-slate-400">Tel: {branch.tel}</p>
      </div>

      {/* Social/Action Icons */}
      <div className="flex justify-center items-center gap-4 mt-auto">
        <button className="hover:scale-110 transition-transform">
          <Facebook size={18} className="text-[#4F7DF3]" />
        </button>

        <button className="hover:scale-110 transition-transform">
          <Linkedin size={18} className="text-[#4F7DF3]" />
        </button>

        <button className="hover:scale-110 transition-transform">
          <Twitter size={18} className="text-[#4F7DF3]" />
        </button>
      </div>
    </div>
  </div>
);

const Location = () => {
  return (
    <section className="bg-white py-20 px-4 md:px-10 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-16">
          Klean Enterprise branches
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Location;