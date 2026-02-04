import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, Loader2, Utensils } from 'lucide-react';
import { scanImage } from '../api';

const Home = () => {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setFile(file);
        });
    }
  }, [webcamRef]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
    }
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await scanImage(file);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        {!image ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="absolute w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4 w-full">
              <button onClick={capture} className="flex-1 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-bold">
                <Camera /> {t('scan_food')}
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-bold">
                <Upload /> {t('upload_text')}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img src={image} alt="Preview" className="w-full rounded-lg shadow-md" />
            <div className="flex gap-4 w-full">
              <button onClick={() => { setImage(null); setResult(null); }} className="flex-1 bg-gray-500 text-white p-3 rounded-lg">
                Retry
              </button>
              <button onClick={analyze} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-bold">
                {loading ? <Loader2 className="animate-spin" /> : <Utensils />}
                {loading ? t('analyzing') : t('analyze')}
              </button>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white">{result.food_name}</h2>
          
          <div className="grid grid-cols-4 gap-2 mb-6">
            <MacroCard label={t('calories')} value={result.calories} color="bg-red-100 text-red-800" />
            <MacroCard label={t('protein')} value={result.macros.protein} color="bg-blue-100 text-blue-800" />
            <MacroCard label={t('carbs')} value={result.macros.carbs} color="bg-yellow-100 text-yellow-800" />
            <MacroCard label={t('fats')} value={result.macros.fats} color="bg-purple-100 text-purple-800" />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-bold mb-2 text-lg">{t('health_analysis')}</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.analysis}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const MacroCard = ({ label, value, color }: any) => (
  <div className={`p-3 rounded-lg text-center ${color}`}>
    <div className="text-xs font-bold uppercase opacity-70">{label}</div>
    <div className="text-lg font-black">{value}</div>
  </div>
);

export default Home;