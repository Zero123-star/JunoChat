import React, { useState } from 'react';
import { Camera, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/Button';
import GlassmorphicContainer from '@/components/GlassmorphicContainer';
import { toast } from 'sonner';

const PhotoboothPage: React.FC = () => {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [characterImage, setCharacterImage] = useState<File | null>(null);
  const [childName, setChildName] = useState('');
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [characterImagePreview, setCharacterImagePreview] = useState<string | null>(null);

  React.useEffect(() => {
    // Open curtain after a short delay
    const timer = setTimeout(() => setCurtainOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'user' | 'character'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'user') {
        setUserImage(file);
        setUserImagePreview(URL.createObjectURL(file));
      } else {
        setCharacterImage(file);
        setCharacterImagePreview(URL.createObjectURL(file));
      }
      toast.success(`${type === 'user' ? 'Your' : 'Character'} image uploaded!`);
    }
  };

  const mergeFaces = async () => {
    if (!userImage || !characterImage || !childName.trim()) {
      toast.error('Please upload both images and enter a name!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create a canvas to merge the two images side by side
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Load both images
      const loadImage = (file: File): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      };

      const [img1, img2] = await Promise.all([
        loadImage(userImage),
        loadImage(characterImage)
      ]);

      // Set canvas size for polaroid style (400x500)
      const photoSize = 340;
      canvas.width = 400;
      canvas.height = 500;

      // Draw white polaroid background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 500);

      // Add subtle shadow/border
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;
      ctx.fillRect(20, 20, 360, 440);
      ctx.shadowColor = 'transparent';

      // Create a merged/blended image area
      const mergeCanvas = document.createElement('canvas');
      mergeCanvas.width = photoSize;
      mergeCanvas.height = photoSize;
      const mergeCtx = mergeCanvas.getContext('2d');
      
      if (mergeCtx) {
        // Draw first image
        const scale1 = Math.max(photoSize / img1.width, photoSize / img1.height);
        const x1 = (photoSize - img1.width * scale1) / 2;
        const y1 = (photoSize - img1.height * scale1) / 2;
        mergeCtx.drawImage(img1, x1, y1, img1.width * scale1, img1.height * scale1);
        
        // Blend second image with 50% opacity
        mergeCtx.globalAlpha = 0.5;
        const scale2 = Math.max(photoSize / img2.width, photoSize / img2.height);
        const x2 = (photoSize - img2.width * scale2) / 2;
        const y2 = (photoSize - img2.height * scale2) / 2;
        mergeCtx.drawImage(img2, x2, y2, img2.width * scale2, img2.height * scale2);
        
        // Draw merged result onto main canvas
        ctx.drawImage(mergeCanvas, 30, 30, photoSize, photoSize);
      }

      // Add decorative elements
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, photoSize + 10, photoSize + 10);

      // Add text at bottom of polaroid
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(childName, 200, 410);
      
      ctx.font = 'italic 16px Arial, sans-serif';
      ctx.fillStyle = '#9333ea';
      ctx.fillText('✨ Photo Booth Magic ✨', 200, 440);
      
      // Add date
      ctx.font = '12px Arial, sans-serif';
      ctx.fillStyle = '#6b7280';
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      ctx.fillText(date, 200, 465);

      const resultImage = canvas.toDataURL('image/png');
      setMergedImage(resultImage);
      toast.success('Your magical creation is ready!');
      
    } catch (error) {
      console.error('Error merging images:', error);
      toast.error('Failed to merge images. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPhotobooth = () => {
    setUserImage(null);
    setCharacterImage(null);
    setChildName('');
    setMergedImage(null);
    setUserImagePreview(null);
    setCharacterImagePreview(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Curtain Animation */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-red-800 to-red-600 transition-transform duration-1000 ease-in-out ${
            curtainOpen ? '-translate-x-full' : 'translate-x-0'
          }`}
          style={{
            boxShadow: '5px 0 15px rgba(0,0,0,0.3)',
          }}
        >
          <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>
        <div
          className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-800 to-red-600 transition-transform duration-1000 ease-in-out ${
            curtainOpen ? 'translate-x-full' : 'translate-x-0'
          }`}
          style={{
            boxShadow: '-5px 0 15px rgba(0,0,0,0.3)',
          }}
        >
          <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>
      </div>

      {/* Background Photobooth Image */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 flex items-center justify-center gap-3">
            <Camera className="h-12 w-12 text-purple-600" />
            Photo Booth Magic
            <Sparkles className="h-12 w-12 text-pink-600" />
          </h1>
          <p className="text-gray-700 text-lg">
            Create a magical blend of you and your favorite character!
          </p>
        </div>

        {!mergedImage ? (
          <GlassmorphicContainer className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* User Image Upload */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-purple-700 flex items-center gap-2">
                  <Upload className="h-6 w-6" />
                  Your Photo
                </h3>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'user')}
                    className="hidden"
                    id="user-upload"
                  />
                  <label
                    htmlFor="user-upload"
                    className="block w-full h-64 border-4 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 transition-colors overflow-hidden"
                  >
                    {userImagePreview ? (
                      <img
                        src={userImagePreview}
                        alt="Your photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-purple-400">
                        <Upload className="h-16 w-16 mb-2" />
                        <p className="text-lg font-medium">Click to upload</p>
                        <p className="text-sm">Your beautiful face</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Character Image Upload */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-pink-700 flex items-center gap-2">
                  <Upload className="h-6 w-6" />
                  Character Photo
                </h3>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'character')}
                    className="hidden"
                    id="character-upload"
                  />
                  <label
                    htmlFor="character-upload"
                    className="block w-full h-64 border-4 border-dashed border-pink-300 rounded-xl cursor-pointer hover:border-pink-500 transition-colors overflow-hidden"
                  >
                    {characterImagePreview ? (
                      <img
                        src={characterImagePreview}
                        alt="Character photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-pink-400">
                        <Upload className="h-16 w-16 mb-2" />
                        <p className="text-lg font-medium">Click to upload</p>
                        <p className="text-sm">Your favorite character</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-8">
              <label className="block text-xl font-semibold text-gray-700 mb-3">
                Name Your Creation ✨
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g., 'Luna-Storm' or 'Alex-Phoenix'"
                className="w-full px-6 py-4 text-lg border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all"
              />
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <Button
                onClick={mergeFaces}
                disabled={isLoading || !userImage || !characterImage || !childName.trim()}
                gradient
                className="px-8 py-4 text-xl font-bold flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6" />
                    Create Magic!
                    <Sparkles className="h-6 w-6" />
                  </>
                )}
              </Button>
            </div>
          </GlassmorphicContainer>
        ) : (
          <div className="text-center">
            <GlassmorphicContainer className="inline-block p-8">
              <h2 className="text-3xl font-bold text-purple-700 mb-6">
                ✨ Your Magical Creation! ✨
              </h2>
              
              {/* Polaroid Result */}
              <div className="relative inline-block mb-8">
                <div className="bg-white p-4 shadow-2xl transform hover:scale-105 transition-transform duration-300 rotate-1">
                  <img
                    src={mergedImage}
                    alt={childName}
                    className="w-96 h-auto rounded-sm"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-2xl font-bold text-gray-800">{childName}</p>
                    <p className="text-sm text-gray-500">Photo Booth Magic</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `${childName}-photobooth.png`;
                    link.href = mergedImage;
                    link.click();
                    toast.success('Image downloaded!');
                  }}
                  gradient
                  className="flex items-center gap-2"
                >
                  <Upload className="h-5 w-5" />
                  Download Photo
                </Button>
                
                <Button
                  onClick={resetPhotobooth}
                  glassEffect
                  className="flex items-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Create Another
                </Button>
              </div>
            </GlassmorphicContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoboothPage;