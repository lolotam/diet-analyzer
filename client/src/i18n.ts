import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "app_title": "Diet Analyzer",
      "scan_food": "Scan Food",
      "history": "History",
      "analyze": "Analyze",
      "analyzing": "Analyzing...",
      "calories": "Calories",
      "protein": "Protein",
      "carbs": "Carbs",
      "fats": "Fats",
      "health_analysis": "Health Analysis",
      "upload_text": "Take a photo or upload to analyze",
      "switch_lang": "عربي",
      "toggle_theme": "Toggle Theme"
    }
  },
  ar: {
    translation: {
      "app_title": "محلل الغذاء",
      "scan_food": "فحص الطعام",
      "history": "السجل",
      "analyze": "تحليل",
      "analyzing": "جاري التحليل...",
      "calories": "سعرات",
      "protein": "بروتين",
      "carbs": "كربوهيدرات",
      "fats": "دهون",
      "health_analysis": "التحليل الصحي",
      "upload_text": "التقط صورة أو ارفع ملف للتحليل",
      "switch_lang": "English",
      "toggle_theme": "تغيير المظهر"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;