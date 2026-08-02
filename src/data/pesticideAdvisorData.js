// Local advisor data. Replace this module with a government/API adapter later
// without changing the page component.
export const pesticideAdvisorData = {
  tomato_early_blight: [
    { name: 'Mancozeb 75% WP', price: '₹180–₹240', packSizes: ['100 g', '250 g', '500 g', '1 kg'], subsidy: 'Check the state horticulture department for plant-protection input assistance.', eligibility: 'Small and marginal farmers enrolled in an applicable state horticulture scheme may be eligible.' },
    { name: 'Chlorothalonil 75% WP', price: '₹220–₹320', packSizes: ['100 g', '250 g', '500 g', '1 kg'], subsidy: null, eligibility: null },
  ],
  corn_common_rust: [
    { name: 'Propiconazole 25% EC', price: '₹340–₹480', packSizes: ['100 ml', '250 ml', '500 ml', '1 L'], subsidy: 'Availability varies by district plant-protection programme.', eligibility: 'Farmers registered with the local agriculture office should confirm current scheme eligibility.' },
    { name: 'Azoxystrobin 23% SC', price: '₹420–₹620', packSizes: ['100 ml', '250 ml', '500 ml', '1 L'], subsidy: null, eligibility: null },
  ],
  potato_late_blight: [
    { name: 'Metalaxyl + Mancozeb 72% WP', price: '₹260–₹380', packSizes: ['100 g', '250 g', '500 g', '1 kg'], subsidy: 'May be covered under seasonal potato crop-protection support in selected state schemes.', eligibility: 'Availability and eligibility are set by the state agriculture department; contact the local office.' },
    { name: 'Copper Hydroxide 77% WP', price: '₹380–₹520', packSizes: ['100 g', '250 g', '500 g', '1 kg'], subsidy: null, eligibility: null },
  ],
};

export const purchaseOptions = [
  { type: 'Nearby agriculture store', detail: 'Green Field Agro Store — sample local listing' },
  { type: 'Government agriculture center', detail: 'Nearest Krishi Vigyan Kendra / Agriculture Department office' },
  { type: 'Cooperative society', detail: 'Local farmer cooperative or PACS outlet' },
  { type: 'Online purchase', detail: 'Licensed agricultural-input marketplaces' },
];
