export const SPECIFICATION_OPTIONS = {
  Tiles: [
    { value: "glossy", label: "White glossy / Marble pattern" },
    { value: "floor", label: "Ceramic floor tile (24x24 / 16x16)" },
    { value: "wall", label: "Glazed wall tile" },
    { value: "matte", label: "Grey / Matte anti-skid finish" },
    { value: "homogenous", label: "Homogenous / Mirror polish" },
    { value: "china", label: "Imported / Made in China" },
  ],
  Bricks: [
    { value: "1st class", label: "1st Class Red Clay Bricks" },
    { value: "auto", label: "Auto / Machine-made Bricks" },
    { value: "hollow", label: "Hollow Concrete Blocks" },
    { value: "picket", label: "Picket Bricks (for Khoa)" },
    { value: "fire", label: "Fire / Refractory Bricks" },
  ],
  Cement: [
    { value: "opc", label: "OPC (Ordinary Portland Cement - 53 Grade)" },
    { value: "pcc", label: "PCC (Portland Composite Cement)" },
    { value: "white", label: "White Cement" },
    { value: "fresh", label: "Fresh Stock (Unopened 50kg bags)" },
  ],
  Steel: [
    { value: "60 grade", label: "60 Grade Deformed TMT Bar" },
    { value: "75 grade", label: "75 Grade / 500W High-Strength TMT" },
    { value: "10mm", label: "10mm / 12mm Rod" },
    { value: "16mm", label: "16mm / 20mm / 25mm Rod" },
    { value: "ms pipe", label: "MS Angle / Flat Bar / Square Pipe" },
  ],
  Pipes: [
    { value: "upvc", label: "uPVC Water Supply Pipe" },
    { value: "pvc", label: "PVC Drainage / Sewerage Pipe (4 in / 6 in)" },
    { value: "ppr", label: "PPR Hot & Cold Water Pipe" },
    { value: "gi", label: "GI (Galvanized Iron) Pipe" },
    { value: "hdpe", label: "HDPE Conduit Pipe" },
  ],
  Paint: [
    { value: "interior", label: "Interior Plastic / Silk Emulsion" },
    { value: "exterior", label: "Exterior Weather Coat" },
    { value: "enamel", label: "Synthetic Enamel (Wood & Metal)" },
    { value: "distemper", label: "Acrylic Distemper" },
    { value: "primer", label: "Wall Sealer / Primer / Putty" },
  ],
  "Sanitary items": [
    { value: "commode", label: "Western Commode / Water Closet" },
    { value: "basin", label: "Pedestal / Countertop Wash Basin" },
    { value: "faucet", label: "Bib Cock / Pillar Cock / Mixer Tap" },
    { value: "shower", label: "Overhead Shower Set" },
    { value: "sink", label: "Stainless Steel Kitchen Sink" },
  ],
  "Doors and windows": [
    { value: "wooden", label: "Solid Wooden Door Frame & Shutter" },
    { value: "flush", label: "Flush / Veneer Door" },
    { value: "upvc window", label: "uPVC / Thai Aluminum Sliding Window" },
    { value: "glass", label: "Tempered / Clear Glass Panel" },
  ],
  "Electrical materials": [
    { value: "cable", label: "BYA / NYY Copper Wire & Cable" },
    { value: "switch", label: "Gang Switch & Socket Set" },
    { value: "breaker", label: "MCB / MCCB Circuit Breaker & DB Box" },
    { value: "light", label: "LED Panel / Tube Light" },
  ],
};

export const DEFAULT_SPECIFICATIONS = [
  { value: "unused", label: "Unused / Sealed Packaging" },
  { value: "surplus", label: "Leftover Project Surplus" },
  { value: "grade a", label: "Standard Grade-A Quality" },
];

export const QUANTITY_OPTIONS = ["50", "100", "250", "450", "500", "1000"];
export const BUDGET_OPTIONS = ["40", "50", "60", "80", "100", "500"];

// ১. সিলেক্ট করা Product Type অনুযায়ী Specification লিস্ট রিটার্ন করে
export const getSpecificationsByType = (selectedType) => {
  if (!selectedType) return [];
  const matchedKey = Object.keys(SPECIFICATION_OPTIONS).find(
    (key) => key.toLowerCase() === selectedType.toLowerCase()
  );
  return matchedKey ? SPECIFICATION_OPTIONS[matchedKey] : DEFAULT_SPECIFICATIONS;
};

// ২. ডাটাবেজের লিস্টিং এবং ডিফল্ট ভ্যালু মার্জ করে ড্রপডাউন অপশন তৈরি করে
export const buildDropdownOptions = (listings = []) => {
  const categories = Array.from(
    new Set([
      "Tiles",
      "Bricks",
      "Cement",
      "Steel",
      "Pipes",
      "Paint",
      "Sanitary items",
      ...listings.map((item) => item.category).filter(Boolean),
    ])
  );

  const brands = Array.from(
    new Set([
      "RAK",
      "BSRM",
      "BD ceramics",
      "Bashundhara",
      ...listings.map((item) => item.brand).filter(Boolean),
    ])
  );

  const locations = Array.from(
    new Set([
      "Bashundhara",
      "Mirpur",
      "Uttara",
      "Dhanmondi",
      "Gafargaon",
      ...listings.map((item) => item.location).filter(Boolean),
    ])
  );

  const units = Array.from(
    new Set([
      "sqft",
      "pcs",
      "bags",
      "m",
      "tins",
      "kg",
      ...listings.map((item) => item.unit).filter(Boolean),
    ])
  );

  return { categories, brands, locations, units };
};

// ৩. একক প্রোডাক্টের জন্য ৬টি ক্রাইটেরিয়া যাচাই ও Integer Percentage হিসাব করে
export const evaluateListingMatch = (item, req) => {
  const totalCriteria = 6;
  let matchedCount = 0;

  // Criteria 1: Product Type
  const isProductTypeMatch =
    !req.productType ||
    item.category?.toLowerCase() === req.productType.toLowerCase();
  if (isProductTypeMatch) matchedCount += 1;

  // Criteria 2: Specification
  const specQuery = req.specification.toLowerCase();
  const isSpecMatch =
    !specQuery ||
    item.description?.toLowerCase().includes(specQuery) ||
    item.title?.toLowerCase().includes(specQuery) ||
    item.condition?.toLowerCase().includes(specQuery);
  if (isSpecMatch) matchedCount += 1;

  // Criteria 3: Quantity & Unit
  const reqQty = Number(req.quantity) || 0;
  const isUnitMatch =
    !req.unit || item.unit?.toLowerCase() === req.unit.toLowerCase();
  const isQuantityMatch =
    (!req.quantity || Number(item.quantity) >= reqQty) && isUnitMatch;
  if (isQuantityMatch) matchedCount += 1;

  // Criteria 4: Brand
  const isBrandMatch =
    !req.brand || item.brand?.toLowerCase().includes(req.brand.toLowerCase());
  if (isBrandMatch) matchedCount += 1;

  // Criteria 5: Max Budget
  const maxPrice = Number(req.maxBudget);
  const isPriceMatch =
    !req.maxBudget || Number(item.pricePerUnit) <= maxPrice;
  if (isPriceMatch) matchedCount += 1;

  // Criteria 6: Location
  const isLocationMatch =
    !req.location ||
    item.location?.toLowerCase().includes(req.location.toLowerCase());
  if (isLocationMatch) matchedCount += 1;

  // Integer Percentage Calculation (6 তে 100%, কম হলে 100/6 করে কমে পূর্ণসংখ্যা হবে)
  const unitPenalty = 100 / totalCriteria;
  const unmatchedCount = totalCriteria - matchedCount;
  const matchPercentage =
    matchedCount === totalCriteria
      ? 100
      : Math.round(100 - unmatchedCount * unitPenalty);

  return {
    ...item,
    matchedCriteriaCount: matchedCount,
    matchPercentage,
    breakdown: {
      productType: isProductTypeMatch,
      specification: isSpecMatch,
      quantity: isQuantityMatch,
      brand: isBrandMatch,
      price: isPriceMatch,
      location: isLocationMatch,
    },
  };
};

// ৪. Strict Product Type ফিল্টার এবং পার্সেন্টেজ অনুযায়ী Descending Sorting
export const getRankedMatches = (allListings = [], appliedReq) => {
  const filtered = allListings.filter((item) => {
    if (item.status?.toLowerCase() !== "available") return false;

    if (
      appliedReq.productType &&
      item.category?.toLowerCase() !== appliedReq.productType.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  return filtered
    .map((item) => evaluateListingMatch(item, appliedReq))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
};