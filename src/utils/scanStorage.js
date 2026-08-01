// Local Storage Scan History Service for AgriVision
const STORAGE_KEY = 'agrivision_scan_history_v1';

const defaultMockScans = [
  {
    id: 'scan-1',
    date: '2026-08-01 10:24 AM',
    timestamp: Date.now() - 3600000 * 2,
    crop: 'Tomato',
    diseaseName: 'Tomato Early Blight',
    diseaseKey: 'tomato_early_blight',
    confidence: 97.4,
    status: 'Diseased',
    img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'scan-2',
    date: '2026-07-31 04:15 PM',
    timestamp: Date.now() - 3600000 * 26,
    crop: 'Corn / Maize',
    diseaseName: 'Corn Common Rust',
    diseaseKey: 'corn_common_rust',
    confidence: 94.8,
    status: 'Diseased',
    img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'scan-3',
    date: '2026-07-29 09:30 AM',
    timestamp: Date.now() - 3600000 * 70,
    crop: 'General Crop',
    diseaseName: 'Healthy Crop Leaf',
    diseaseKey: 'healthy_crop',
    confidence: 99.2,
    status: 'Healthy',
    img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80'
  }
];

export const getScanHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMockScans));
      return defaultMockScans;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to fetch scan history from localStorage", err);
    return defaultMockScans;
  }
};

export const saveScanRecord = (newScan) => {
  try {
    const history = getScanHistory();
    const updated = [newScan, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to save scan record to localStorage", err);
    return [];
  }
};

export const deleteScanRecord = (id) => {
  try {
    const history = getScanHistory();
    const updated = history.filter(scan => scan.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to delete scan record", err);
    return [];
  }
};

export const clearScanHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (err) {
    console.error("Failed to clear scan history", err);
    return [];
  }
};

export const getDashboardStats = () => {
  const history = getScanHistory();
  const totalScans = history.length;
  const healthyCount = history.filter(s => s.status === 'Healthy' || s.diseaseKey === 'healthy_crop').length;
  const diseasedCount = totalScans - healthyCount;

  // Calculate most common disease
  const diseaseCounts = {};
  history.forEach(s => {
    if (s.diseaseKey !== 'healthy_crop') {
      diseaseCounts[s.diseaseName] = (diseaseCounts[s.diseaseName] || 0) + 1;
    }
  });

  let mostCommonDisease = 'None Detected';
  let maxCount = 0;
  Object.entries(diseaseCounts).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonDisease = name;
    }
  });

  return {
    totalScans,
    healthyCount,
    diseasedCount,
    mostCommonDisease,
    recentHistory: history
  };
};
