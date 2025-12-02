// Equipment catalog data from equipment-info.csv
// Auto-populates the Add Equipment form

export type LabType = 'wet-lab' | 'dry-lab';

export interface EquipmentCatalogItem {
  name: string;
  category: string;
  labType: LabType;
  carbonFootprint: number; // kgCO2e
  annualUsage: number; // hours/runs
  annualCarbonImpact: number; // kgCO2e
  equipmentType: string;
  manufacturer: string;
  hasApi: boolean;
  apiVendor: string;
  energyConsumption: number; // kWh
  image: string;
}

export const equipmentCatalog: EquipmentCatalogItem[] = [
  // === WET LAB EQUIPMENT ===
  {
    name: "Refrigerator (4°C)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 120,
    annualUsage: 8760,
    annualCarbonImpact: 1051,
    equipmentType: "Cold Storage",
    manufacturer: "Thermo Fisher",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 1281.71,
    image: "refrigerator_4c.png"
  },
  {
    name: "Freezer (–20°C)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 250,
    annualUsage: 8760,
    annualCarbonImpact: 2190,
    equipmentType: "Cold Storage",
    manufacturer: "Panasonic",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 2670.73,
    image: "freezer_minus_20c.png"
  },
  {
    name: "ULT Freezer (–80°C)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 5000,
    annualUsage: 8760,
    annualCarbonImpact: 43800,
    equipmentType: "Cold Storage",
    manufacturer: "Eppendorf",
    hasApi: true,
    apiVendor: "Panasonic IoT",
    energyConsumption: 53414.63,
    image: "ult_freezer_minus_80c.png"
  },
  {
    name: "CO₂ Incubator",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 750,
    annualUsage: 8760,
    annualCarbonImpact: 6570,
    equipmentType: "Incubation",
    manufacturer: "Sanyo",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 8012.20,
    image: "co2_incubator.png"
  },
  {
    name: "Shaking Incubator",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 600,
    annualUsage: 6000,
    annualCarbonImpact: 3600,
    equipmentType: "Incubation",
    manufacturer: "New Brunswick",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 4390.24,
    image: "shaking_incubator.png"
  },
  {
    name: "Water Bath",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 150,
    annualUsage: 4000,
    annualCarbonImpact: 600,
    equipmentType: "Heating",
    manufacturer: "Thermo Fisher",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 731.71,
    image: "water_bath.png"
  },
  {
    name: "Dry Bath",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 100,
    annualUsage: 2000,
    annualCarbonImpact: 200,
    equipmentType: "Heating",
    manufacturer: "Eppendorf",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 243.90,
    image: "dry_bath.png"
  },
  {
    name: "Ice Machine",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 300,
    annualUsage: 8760,
    annualCarbonImpact: 2628,
    equipmentType: "Support Equipment",
    manufacturer: "Hoshizaki",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 3204.88,
    image: "ice_machine.png"
  },
  {
    name: "Ice Bucket",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 10,
    annualUsage: 500,
    annualCarbonImpact: 5,
    equipmentType: "Support Equipment",
    manufacturer: "Nalgene",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 6.10,
    image: "ice_bucket.png"
  },
  {
    name: "Cryogenic Storage (LN₂ Tank)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 1200,
    annualUsage: 8760,
    annualCarbonImpact: 10512,
    equipmentType: "Storage",
    manufacturer: "Taylor-Wharton",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 12819.51,
    image: "cryogenic_storage.png"
  },
  {
    name: "Analytical Balance / Precision Balance",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 80,
    annualUsage: 2000,
    annualCarbonImpact: 160,
    equipmentType: "Measurement",
    manufacturer: "Mettler Toledo",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 195.12,
    image: "analytical_balance.png"
  },
  {
    name: "pH Meter",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 100,
    annualUsage: 1500,
    annualCarbonImpact: 150,
    equipmentType: "Measurement",
    manufacturer: "Hanna Instruments",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 182.93,
    image: "ph_meter.png"
  },
  {
    name: "Magnetic Stirrer / Hot Plate",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 200,
    annualUsage: 3000,
    annualCarbonImpact: 600,
    equipmentType: "Mixing",
    manufacturer: "Ika",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 731.71,
    image: "magnetic_stirrer.png"
  },
  {
    name: "Vortex Mixer",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 150,
    annualUsage: 2500,
    annualCarbonImpact: 375,
    equipmentType: "Mixing",
    manufacturer: "Scientific Industries",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 457.32,
    image: "vortex_mixer.png"
  },
  {
    name: "Centrifuge (Microcentrifuge)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 400,
    annualUsage: 2000,
    annualCarbonImpact: 800,
    equipmentType: "Separation",
    manufacturer: "Eppendorf",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 975.61,
    image: "centrifuge_micro.png"
  },
  {
    name: "Centrifuge (High-Speed)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 800,
    annualUsage: 2500,
    annualCarbonImpact: 2000,
    equipmentType: "Separation",
    manufacturer: "Beckman Coulter",
    hasApi: true,
    apiVendor: "Beckman Connect",
    energyConsumption: 2439.02,
    image: "centrifuge_high_speed.png"
  },
  {
    name: "Centrifuge (Ultracentrifuge)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 2500,
    annualUsage: 3000,
    annualCarbonImpact: 7500,
    equipmentType: "Separation",
    manufacturer: "Hitachi",
    hasApi: true,
    apiVendor: "Hitachi LabLink",
    energyConsumption: 9146.34,
    image: "centrifuge_ultra.png"
  },
  {
    name: "Laminar Flow Hood / Biosafety Cabinet (Class II)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 1800,
    annualUsage: 4000,
    annualCarbonImpact: 7200,
    equipmentType: "Sterile Workstation",
    manufacturer: "ESCO",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 8780.49,
    image: "laminar_flow_hood.png"
  },
  {
    name: "Autoclave (for Sterilization)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 2500,
    annualUsage: 2000,
    annualCarbonImpact: 5000,
    equipmentType: "Sterilization",
    manufacturer: "Tuttnauer",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 6097.56,
    image: "autoclave_sterilization.png"
  },
  {
    name: "Spectrophotometer / NanoDrop",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 300,
    annualUsage: 1500,
    annualCarbonImpact: 450,
    equipmentType: "Analytical Equipment",
    manufacturer: "Thermo Fisher",
    hasApi: true,
    apiVendor: "Thermo Cloud",
    energyConsumption: 548.78,
    image: "spectrophotometer.png"
  },
  {
    name: "Gel Electrophoresis System (Agarose, SDS-PAGE)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 200,
    annualUsage: 1000,
    annualCarbonImpact: 200,
    equipmentType: "Analytical Equipment",
    manufacturer: "Bio-Rad",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 243.90,
    image: "gel_electrophoresis.png"
  },
  {
    name: "Shaking Incubator for Culture Flasks",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 700,
    annualUsage: 4000,
    annualCarbonImpact: 2800,
    equipmentType: "Incubation",
    manufacturer: "New Brunswick",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 3414.63,
    image: "shaking_incubator_flasks.png"
  },
  {
    name: "CO₂ Incubator (for Mammalian Cells)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 800,
    annualUsage: 8760,
    annualCarbonImpact: 7000,
    equipmentType: "Incubation",
    manufacturer: "Sanyo",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 8536.59,
    image: "co2_incubator_mammalian.png"
  },
  {
    name: "Vacuum Pump and Filtration System",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 600,
    annualUsage: 3000,
    annualCarbonImpact: 1800,
    equipmentType: "Filtration",
    manufacturer: "Millipore",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 2195.12,
    image: "vacuum_pump.png"
  },
  {
    name: "Chromatography System (HPLC)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 1500,
    annualUsage: 3000,
    annualCarbonImpact: 4500,
    equipmentType: "Separation",
    manufacturer: "Agilent",
    hasApi: true,
    apiVendor: "Agilent OpenLab",
    energyConsumption: 5487.80,
    image: "chromatography_hplc.png"
  },
  {
    name: "Chromatography System (FPLC)",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 1200,
    annualUsage: 2500,
    annualCarbonImpact: 3000,
    equipmentType: "Separation",
    manufacturer: "Cytiva",
    hasApi: true,
    apiVendor: "UNICORN",
    energyConsumption: 3658.54,
    image: "chromatography_fplc.png"
  },
  {
    name: "Autoclave",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 2500,
    annualUsage: 2000,
    annualCarbonImpact: 5000,
    equipmentType: "Sterilization",
    manufacturer: "Sanyo",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 6097.56,
    image: "autoclave.png"
  },
  {
    name: "UV Sterilizer / Crosslinker",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 300,
    annualUsage: 1000,
    annualCarbonImpact: 300,
    equipmentType: "Sterilization",
    manufacturer: "UVP",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 365.85,
    image: "uv_sterilizer.png"
  },
  {
    name: "Fume Hood / Chemical Hood",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 2000,
    annualUsage: 8760,
    annualCarbonImpact: 17520,
    equipmentType: "Safety",
    manufacturer: "Labconco",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 21365.85,
    image: "fume_hood.png"
  },
  {
    name: "Barcode Scanners and Label Printers",
    category: "Data Management",
    labType: "wet-lab",
    carbonFootprint: 150,
    annualUsage: 3000,
    annualCarbonImpact: 450,
    equipmentType: "Support",
    manufacturer: "Zebra",
    hasApi: true,
    apiVendor: "Zebra API",
    energyConsumption: 548.78,
    image: "barcode_scanners.png"
  },
  {
    name: "Calibrated Timers and Thermometers",
    category: "Laboratory Equipment",
    labType: "wet-lab",
    carbonFootprint: 50,
    annualUsage: 2000,
    annualCarbonImpact: 100,
    equipmentType: "Measurement",
    manufacturer: "Fisherbrand",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 121.95,
    image: "calibrated_timers.png"
  },
  {
    name: "pH Calibration Buffers and Standards",
    category: "Laboratory Consumables",
    labType: "wet-lab",
    carbonFootprint: 30,
    annualUsage: 500,
    annualCarbonImpact: 15,
    equipmentType: "Consumables",
    manufacturer: "Hanna Instruments",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 18.29,
    image: "ph_calibration_buffers.png"
  },

  // === DRY LAB EQUIPMENT (Compute) ===
  {
    name: "GPU Accelerator (NVIDIA A100)",
    category: "Compute Infrastructure",
    labType: "dry-lab",
    carbonFootprint: 2500,
    annualUsage: 8760,
    annualCarbonImpact: 21900,
    equipmentType: "GPU Accelerator",
    manufacturer: "NVIDIA",
    hasApi: true,
    apiVendor: "NVIDIA DCGM",
    energyConsumption: 26707.32,
    image: ""
  },
  {
    name: "GPU Accelerator (NVIDIA H100)",
    category: "Compute Infrastructure",
    labType: "dry-lab",
    carbonFootprint: 3500,
    annualUsage: 8760,
    annualCarbonImpact: 30660,
    equipmentType: "GPU Accelerator",
    manufacturer: "NVIDIA",
    hasApi: true,
    apiVendor: "NVIDIA DCGM",
    energyConsumption: 37390.24,
    image: ""
  },
  {
    name: "GPU Accelerator (NVIDIA RTX 4090)",
    category: "Compute Infrastructure",
    labType: "dry-lab",
    carbonFootprint: 1200,
    annualUsage: 6000,
    annualCarbonImpact: 7200,
    equipmentType: "GPU Accelerator",
    manufacturer: "NVIDIA",
    hasApi: true,
    apiVendor: "NVIDIA SMI",
    energyConsumption: 8780.49,
    image: ""
  },
  {
    name: "High-Performance Workstation",
    category: "Compute Infrastructure",
    labType: "dry-lab",
    carbonFootprint: 800,
    annualUsage: 8760,
    annualCarbonImpact: 7008,
    equipmentType: "Workstation",
    manufacturer: "Dell",
    hasApi: false,
    apiVendor: "",
    energyConsumption: 8546.34,
    image: ""
  },
  {
    name: "Server Rack (42U)",
    category: "Compute Infrastructure",
    labType: "dry-lab",
    carbonFootprint: 15000,
    annualUsage: 8760,
    annualCarbonImpact: 131400,
    equipmentType: "Server",
    manufacturer: "HPE",
    hasApi: true,
    apiVendor: "HPE iLO",
    energyConsumption: 160243.90,
    image: ""
  },
  {
    name: "Network Storage (NAS)",
    category: "Compute Infrastructure",
    labType: "dry-lab",
    carbonFootprint: 500,
    annualUsage: 8760,
    annualCarbonImpact: 4380,
    equipmentType: "Storage",
    manufacturer: "Synology",
    hasApi: true,
    apiVendor: "Synology API",
    energyConsumption: 5341.46,
    image: ""
  },
  {
    name: "Laboratory Information Management System (LIMS)",
    category: "Data Management",
    labType: "dry-lab",
    carbonFootprint: 1000,
    annualUsage: 8760,
    annualCarbonImpact: 8760,
    equipmentType: "Software",
    manufacturer: "Thermo Fisher",
    hasApi: true,
    apiVendor: "Thermo Cloud",
    energyConsumption: 10682.93,
    image: ""
  },
  {
    name: "ML Training Cluster",
    category: "Compute Infrastructure",
    labType: "dry-lab",
    carbonFootprint: 25000,
    annualUsage: 8760,
    annualCarbonImpact: 219000,
    equipmentType: "GPU Accelerator",
    manufacturer: "NVIDIA DGX",
    hasApi: true,
    apiVendor: "NVIDIA Base Command",
    energyConsumption: 267073.17,
    image: ""
  }
];

// Get unique equipment types from catalog
export const catalogEquipmentTypes = [...new Set(equipmentCatalog.map(item => item.equipmentType))];

// Get unique manufacturers from catalog
export const catalogManufacturers = [...new Set(equipmentCatalog.map(item => item.manufacturer))];

// Filter by lab type
export const getEquipmentByLabType = (labType: LabType) =>
  equipmentCatalog.filter(item => item.labType === labType);

export const wetLabEquipment = equipmentCatalog.filter(item => item.labType === 'wet-lab');
export const dryLabEquipment = equipmentCatalog.filter(item => item.labType === 'dry-lab');
