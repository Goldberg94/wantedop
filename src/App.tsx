import React, { useState, useRef, useEffect } from 'react';
import { Skull } from 'lucide-react';

type PosterVersion = 'classic' | 'holo' | 'white';
type Rank = 'pirate' | 'marine';

function App() {
  const [name, setName] = useState('Monkey•D•Luffy');
  const [bounty, setBounty] = useState('3000000000');
  const [rank, setRank] = useState<Rank>('pirate');
  const [version, setVersion] = useState<PosterVersion>('classic');
  const [image, setImage] = useState<string | null>(null);
  const [useBullets, setUseBullets] = useState(true);
  const [rawName, setRawName] = useState('Monkey D Luffy');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CANVAS_WIDTH = 2000;
  const CANVAS_HEIGHT = 2828;
  const MAX_NAME_WIDTH = 1500;
  const NAME_Y_POSITION = 2200;
  const BOUNTY_Y_POSITION = 2450;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawPoster = async () => {
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Load and draw template
      if (version === 'classic') {
        const template = await loadImage('https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Template_vide.png');
        ctx.drawImage(template, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      // Draw uploaded image if exists
      if (image) {
        const img = await loadImage(image);
        const imageSize = CANVAS_WIDTH * 0.85;
        const x = (CANVAS_WIDTH - imageSize) / 2;
        const y = CANVAS_HEIGHT * 0.12;
        ctx.drawImage(img, x, y, imageSize, imageSize);
      }

      // Draw name
      drawName(ctx, name.toUpperCase());

      // Draw bounty
      drawBounty(ctx, formatBounty(bounty));
    };

    drawPoster().catch(console.error);
  }, [name, bounty, image, version]);

  const drawName = (ctx: CanvasRenderingContext2D, text: string) => {
    ctx.save();
    
    // Set initial font properties
    const baseFontSize = 140;
    ctx.font = `900 ${baseFontSize}px "Times New Roman"`;
    ctx.fillStyle = '#3e2c2a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Measure text width
    let textWidth = ctx.measureText(text).width;
    let scale = 1;

    // Calculate scale if text is too wide
    if (textWidth > MAX_NAME_WIDTH) {
      scale = MAX_NAME_WIDTH / textWidth;
    }

    // Apply transformations
    ctx.translate(CANVAS_WIDTH / 2, NAME_Y_POSITION);
    ctx.scale(scale, 2.2); // Vertical stretch of 2.2

    if (text.includes('•')) {
      const chars = text.split('');
      let totalWidth = ctx.measureText(text).width;
      let currentX = -totalWidth / 2;

      chars.forEach((char) => {
        const charWidth = ctx.measureText(char).width;
        if (char === '•') {
          ctx.save();
          ctx.scale(1, 0.35); // Scale down bullet points
          ctx.fillText(char, currentX + charWidth / 2, 0);
          ctx.restore();
        } else {
          ctx.fillText(char, currentX + charWidth / 2, 0);
        }
        currentX += charWidth;
      });
    } else {
      ctx.fillText(text, 0, 0);
    }

    ctx.restore();
  };

  const drawBounty = (ctx: CanvasRenderingContext2D, text: string) => {
    ctx.save();
    ctx.font = `700 120px "Courier Prime"`;
    ctx.fillStyle = '#3A1F04';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Position the bounty text slightly higher
    ctx.translate(CANVAS_WIDTH / 2, BOUNTY_Y_POSITION - 50);
    
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = 'anonymous';
      img.src = src;
    });
  };

  const formatBounty = (value: string) => {
    const number = parseInt(value.replace(/\D/g, ''), 10) || 0;
    return number.toLocaleString('fr-FR').replace(/\s/g, ',') + '-';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRawName(value);
    if (useBullets) {
      const processedName = value
        .split(' ')
        .filter(word => word)
        .join('•');
      setName(processedName.toUpperCase());
    } else {
      setName(value.toUpperCase());
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `wanted-poster-${rawName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#8B4513] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#f4e4bc] mb-2 flex items-center justify-center gap-2">
          <Skull className="w-8 h-8" />
          One Piece Wanted Poster Creator
          <Skull className="w-8 h-8" />
        </h1>
        <p className="text-center text-[#f4e4bc] mb-8">Create your own bounty poster!</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-[#f4e4bc] p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Customize Your Poster</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#8B4513] font-medium mb-2">Name</label>
                <input 
                  type="text"
                  className="w-full p-2 border border-[#8B4513] rounded bg-[#fff8e7] mb-2"
                  value={rawName}
                  onChange={handleNameChange}
                  placeholder="Enter name"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useBullets"
                    checked={useBullets}
                    onChange={(e) => setUseBullets(e.target.checked)}
                    className="rounded border-[#8B4513]"
                  />
                  <label htmlFor="useBullets" className="text-sm text-[#8B4513]">
                    Replace spaces with • (Example: Monkey•D•Luffy)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[#8B4513] font-medium mb-2">Bounty (Berries)</label>
                <input 
                  type="number"
                  className="w-full p-2 border border-[#8B4513] rounded bg-[#fff8e7]"
                  value={bounty}
                  onChange={(e) => setBounty(e.target.value)}
                  placeholder="Enter bounty amount"
                />
              </div>

              <div>
                <label className="block text-[#8B4513] font-medium mb-2">Upload your Photo</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-[#8B4513] text-[#f4e4bc] px-4 py-2 rounded hover:bg-[#6d3610] transition-colors">
                    Choose File
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <span className="text-[#8B4513]">
                    {image ? 'Image selected' : 'No file chosen'}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleDownload}
                className="w-full bg-[#8B4513] text-[#f4e4bc] p-3 rounded flex items-center justify-center gap-2 hover:bg-[#6d3610] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Poster
              </button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="relative w-full" style={{ aspectRatio: "2000/2828" }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;