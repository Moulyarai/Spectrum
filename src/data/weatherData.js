// Weather Data & Farming Advisories Generator
export const sampleCitiesWeather = {
  "new delhi": { temp: "31°C", humidity: "65%", rainfall: "12 mm", condition: "Partly Cloudy" },
  "delhi": { temp: "31°C", humidity: "65%", rainfall: "12 mm", condition: "Partly Cloudy" },
  "mumbai": { temp: "29°C", humidity: "82%", rainfall: "45 mm", condition: "Heavy Rain" },
  "bengaluru": { temp: "24°C", humidity: "70%", rainfall: "5 mm", condition: "Pleasant" },
  "punjab": { temp: "33°C", humidity: "58%", rainfall: "0 mm", condition: "Sunny" },
  "patna": { temp: "32°C", humidity: "75%", rainfall: "18 mm", condition: "Humid & Showers" },
  "lucknow": { temp: "30°C", humidity: "72%", rainfall: "8 mm", condition: "Cloudy" },
  "jaipur": { temp: "34°C", humidity: "50%", rainfall: "0 mm", condition: "Clear Sky" },
  "bhopal": { temp: "28°C", humidity: "78%", rainfall: "22 mm", condition: "Moderate Rain" },
  "default": { temp: "28°C", humidity: "68%", rainfall: "10 mm", condition: "Scattered Clouds" }
};

export const getWeatherAdvisory = (humidity, rainfall, lang = 'en') => {
  const rainVal = parseInt(rainfall) || 0;
  const humVal = parseInt(humidity) || 65;

  if (lang === 'hi') {
    if (rainVal > 20) {
      return {
        title: "अत्यधिक वर्षा चेतावनी",
        advice: "खेतों में जलभराव की स्थिति न होने दें। जल निकासी की समुचित व्यवस्था करें और अगले 48 घंटों तक किसी भी फफूंदनाशक या उर्वरक का छिड़काव स्थगित रखें।",
        status: "High Warning"
      };
    } else if (humVal > 75) {
      return {
        title: "उच्च आर्द्रता और फफूंद रोग जोखिम",
        advice: "उच्च नमी के कारण आलू के पछेती झुलसा और टमाटर के अगेती झुलसा का खतरा बढ़ता है। एहतियातन कॉपर फफूंदनाशक या नीम तेल का हल्का छिड़काव करें।",
        status: "Caution"
      };
    } else {
      return {
        title: "अनुकूल मौसम सलाह",
        advice: "मौसम सामान्य और अनुकूल है। अपनी नियमित सिंचाई और खरपतवार नियंत्रण जारी रखें। शाम के समय हल्की नाइट्रोजन खाद दे सकते हैं।",
        status: "Optimal"
      };
    }
  } else {
    if (rainVal > 20) {
      return {
        title: "Heavy Rainfall Advisory",
        advice: "Ensure proper field drainage to prevent waterlogging. Postpone all fungicide sprays and fertilizer applications until heavy rains subside.",
        status: "High Warning"
      };
    } else if (humVal > 75) {
      return {
        title: "High Humidity & Fungal Risk Notice",
        advice: "Elevated moisture increases the risk of Blight and Rust spore formation. Apply protective neem oil or copper soap sprays proactively.",
        status: "Caution"
      };
    } else {
      return {
        title: "Optimal Farming Weather",
        advice: "Weather conditions are stable. Continue scheduled irrigation and routine weed management. Ideal time for balanced foliage nutrition.",
        status: "Optimal"
      };
    }
  }
};
