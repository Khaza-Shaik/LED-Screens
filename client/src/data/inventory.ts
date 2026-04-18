export interface Billboard {
  id: string | number;
  location: string;
  status: 'Active' | 'High Demand';
  price: string;
  impressions: string;
  image?: string;
  lat: number;
  lng: number;
}

export const FALLBACK_BILLBOARDS: Billboard[] = [
  { 
    id: 1, 
    location: "Cyber Hub, Gurgaon", 
    status: "Active", 
    price: "₹5,000/hr", 
    impressions: "1.5M", 
    image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1920&q=80", 
    lat: 28.4951, 
    lng: 77.0878 
  },
  { 
    id: 2, 
    location: "Bandra-Worli Sea Link, Mumbai", 
    status: "Active", 
    price: "₹4,200/hr", 
    impressions: "2.1M", 
    image: "https://images.unsplash.com/photo-1562613531-df24579cc5cf?auto=format&fit=crop&w=1920&q=80", 
    lat: 19.0371, 
    lng: 72.8174 
  },
  { 
    id: 3, 
    location: "Connaught Place, Delhi", 
    status: "High Demand", 
    price: "₹6,100/hr", 
    impressions: "1.8M", 
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=80", 
    lat: 28.6330, 
    lng: 77.2194 
  },
  { 
    id: 4, 
    location: "Brigade Road, Bengaluru", 
    status: "Active", 
    price: "₹8,000/hr", 
    impressions: "3M", 
    image: "https://images.unsplash.com/photo-1570160897042-da39847f3ec3?auto=format&fit=crop&w=1920&q=80", 
    lat: 12.9734, 
    lng: 77.6061 
  },
  { 
    id: 5, 
    location: "Hi-Tech City, Hyderabad", 
    status: "Active", 
    price: "₹3,500/hr", 
    impressions: "1.2M", 
    image: "https://images.unsplash.com/photo-1510146752391-aa953155700a?auto=format&fit=crop&w=1920&q=80", 
    lat: 17.4435, 
    lng: 78.3772 
  },
  { 
    id: 6, 
    location: "MG Road, Pune", 
    status: "High Demand", 
    price: "₹7,500/hr", 
    impressions: "2.5M", 
    image: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1920&q=80", 
    lat: 18.5204, 
    lng: 73.8567 
  }
];

export const TARGET_LOCATIONS = FALLBACK_BILLBOARDS.map(bb => ({
  name: bb.location,
  price: parseInt(bb.price.replace(/[^\d]/g, '')),
  reach: bb.impressions,
  impressions: parseInt(bb.impressions.replace(/[^\d.]/g, '')) * (bb.impressions.includes('M') ? 1000000 : 1000)
}));

export const DEFAULT_MAP_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
};
