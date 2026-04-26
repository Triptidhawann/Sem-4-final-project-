// ─── Hospitals ─────────────────────────────────────────────────────────────────
// Extended with district field and richer resource numbers
// beds/vents/oxygen/blood are "used" values; capacity is stored in RESOURCE_CAPS

export const RESOURCE_CAPS = {
  beds: 500, vents: 150, oxygen: 100, blood: 300,
};

export const HOSPITALS = [
  { id:1,  name:"Apollo Medanta",           city:"Delhi",        district:"New Delhi",     state:"Delhi",          beds:120, vents:34,  oxygen:78, blood:45,  status:"critical" },
  { id:2,  name:"Fortis Ludhiana",          city:"Ludhiana",     district:"Ludhiana",      state:"Punjab",         beds:230, vents:67,  oxygen:91, blood:120, status:"stable"   },
  { id:3,  name:"AIIMS Chandigarh",         city:"Chandigarh",   district:"Chandigarh",    state:"Punjab",         beds:450, vents:120, oxygen:60, blood:200, status:"critical" },
  { id:4,  name:"Manipal Jaipur",           city:"Jaipur",       district:"Jaipur",        state:"Rajasthan",      beds:180, vents:45,  oxygen:85, blood:90,  status:"stable"   },
  { id:5,  name:"Max Mumbai",               city:"Mumbai",       district:"Mumbai City",   state:"Maharashtra",    beds:320, vents:89,  oxygen:72, blood:150, status:"moderate" },
  { id:6,  name:"Safdarjung Hospital",      city:"Delhi",        district:"South Delhi",   state:"Delhi",          beds:380, vents:110, oxygen:65, blood:180, status:"critical" },
  { id:7,  name:"PGIMER Chandigarh",        city:"Chandigarh",   district:"Chandigarh",    state:"Punjab",         beds:290, vents:88,  oxygen:80, blood:140, status:"moderate" },
  { id:8,  name:"SMS Medical College",      city:"Jaipur",       district:"Jaipur",        state:"Rajasthan",      beds:210, vents:55,  oxygen:90, blood:95,  status:"stable"   },
  { id:9,  name:"KEM Hospital",             city:"Mumbai",       district:"Mumbai City",   state:"Maharashtra",    beds:340, vents:95,  oxygen:74, blood:165, status:"moderate" },
  { id:10, name:"Civil Hospital Amritsar",  city:"Amritsar",     district:"Amritsar",      state:"Punjab",         beds:150, vents:38,  oxygen:55, blood:60,  status:"critical" },
  { id:11, name:"Mahatma Gandhi Hospital",  city:"Jodhpur",      district:"Jodhpur",       state:"Rajasthan",      beds:195, vents:50,  oxygen:88, blood:110, status:"stable"   },
  { id:12, name:"Hinduja Hospital",         city:"Mumbai",       district:"Mumbai Suburban",state:"Maharashtra",   beds:260, vents:72,  oxygen:82, blood:130, status:"stable"   },
];

// ─── Derived lists for filter dropdowns ────────────────────────────────────────

export const STATES    = [...new Set(HOSPITALS.map(h => h.state))].sort();
export const CITIES    = [...new Set(HOSPITALS.map(h => h.city))].sort();
export const DISTRICTS = [...new Set(HOSPITALS.map(h => h.district))].sort();

// ─── Allocations ───────────────────────────────────────────────────────────────

export const ALLOCATIONS = [
  { id:1,  from:"Fortis Ludhiana",   to:"AIIMS Chandigarh",      resource:"Ventilators",      qty:20,  status:"in-transit", date:"18 Feb 2026", eta:"22 Feb 2026", priority:"high"     },
  { id:2,  from:"Manipal Jaipur",    to:"Apollo Medanta",         resource:"Oxygen Cylinders", qty:50,  status:"delivered",  date:"15 Feb 2026", eta:"17 Feb 2026", priority:"critical" },
  { id:3,  from:"Max Mumbai",        to:"AIIMS Chandigarh",       resource:"Blood Units",      qty:80,  status:"processing", date:"20 Feb 2026", eta:"24 Feb 2026", priority:"medium"   },
  { id:4,  from:"Apollo Medanta",    to:"Fortis Ludhiana",        resource:"ICU Beds",         qty:15,  status:"delivered",  date:"10 Feb 2026", eta:"12 Feb 2026", priority:"low"      },
  { id:5,  from:"AIIMS Chandigarh",  to:"Max Mumbai",             resource:"PPE Kits",         qty:500, status:"in-transit", date:"19 Feb 2026", eta:"23 Feb 2026", priority:"medium"   },
  { id:6,  from:"Hinduja Hospital",  to:"Civil Hospital Amritsar",resource:"Blood Units",      qty:40,  status:"processing", date:"21 Feb 2026", eta:"25 Feb 2026", priority:"critical" },
  { id:7,  from:"PGIMER Chandigarh", to:"Apollo Medanta",         resource:"Ventilators",      qty:10,  status:"in-transit", date:"20 Feb 2026", eta:"22 Feb 2026", priority:"high"     },
];

// ─── Requests ──────────────────────────────────────────────────────────────────

export const REQUESTS = [
  { id:1, hospital:"AIIMS Chandigarh",        resource:"Ventilators",     qty:30,  priority:"critical", date:"21 Feb 2026", status:"pending"   },
  { id:2, hospital:"Apollo Medanta",           resource:"Blood O+",        qty:60,  priority:"high",     date:"20 Feb 2026", status:"approved"  },
  { id:3, hospital:"Max Mumbai",               resource:"Oxygen Cylinders",qty:100, priority:"medium",   date:"19 Feb 2026", status:"pending"   },
  { id:4, hospital:"Manipal Jaipur",           resource:"ICU Beds",        qty:10,  priority:"low",      date:"18 Feb 2026", status:"fulfilled" },
  { id:5, hospital:"Civil Hospital Amritsar",  resource:"Blood Units",     qty:50,  priority:"critical", date:"21 Feb 2026", status:"pending"   },
  { id:6, hospital:"Safdarjung Hospital",      resource:"Ventilators",     qty:25,  priority:"high",     date:"20 Feb 2026", status:"approved"  },
];

// ─── Tracking steps ────────────────────────────────────────────────────────────

export const TRACKING_STEPS = [
  { label:"Request Submitted",    time:"18 Feb, 09:14", desc:"Received and logged by the system." },
  { label:"Allocation Confirmed", time:"18 Feb, 11:30", desc:"Fortis Ludhiana confirmed dispatch."  },
  { label:"In Transit",           time:"19 Feb, 07:00", desc:"Vehicle dispatched — ETA 3 days."     },
  { label:"Checkpoint — Ambala",  time:"20 Feb, 14:22", desc:"Consignment scanned at depot."        },
  { label:"Final Delivery",       time:"—",             desc:"Expected: 22 February 2026."          },
];

// ─── Resource types for filter UI ─────────────────────────────────────────────

export const RESOURCE_TYPES = [
  { key: "beds",   label: "ICU Beds",   cap: RESOURCE_CAPS.beds   },
  { key: "vents",  label: "Ventilators",cap: RESOURCE_CAPS.vents  },
  { key: "oxygen", label: "Oxygen %",   cap: RESOURCE_CAPS.oxygen },
  { key: "blood",  label: "Blood Units",cap: RESOURCE_CAPS.blood  },
];
