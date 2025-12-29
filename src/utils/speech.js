const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;

export const recognition = (() => {
  if (!Speech) return null;
  const rec = new Speech();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = 'ar-SA'; // لغة التعرف
  return rec;
})();