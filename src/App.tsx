import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, X } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './components/Contact';
import RichTextDescription from './components/RichTextDescription';
import FAQ from './components/FAQ';
import TermsConditions from './components/TermsConditions';

type PosterVersion = 'classic' | 'holo' | 'white';
type Rank = 'pirate' | 'marine';
type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;

const PREDEFINED_BACKGROUNDS = [
  {
    id: 'wano',
    name: 'Wano Kuni',
    url: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/wano_kuni_sakura_2f11db4f-1edb-4fff-81aa-041cf9b16264.jpg?v=1701945120',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/wano_kuni_sakura_2f11db4f-1edb-4fff-81aa-041cf9b16264.jpg?v=1701945120'
  },
  {
    id: 'dressrosa',
    name: 'Dressrosa',
    url: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/champ_de_fleurs_dressrosa.jpg?v=1701945154',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/champ_de_fleurs_dressrosa.jpg?v=1701945154'
  },
  {
    id: 'hakumai',
    name: 'Hakumai Village',
    url: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/hakumai_village_one_piece_wano.jpg?v=1701945240',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/hakumai_village_one_piece_wano.jpg?v=1701945240'
  },
  {
    id: 'sabaody',
    name: 'Sabaody Park',
    url: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/sabaody_park_archipel_one_piece.jpg?v=1701945342',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/sabaody_park_archipel_one_piece.jpg?v=1701945342'
  },
  {
    id: 'skypiea',
    name: 'Shandora',
    url: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/cite_or_shandora_skypiea.jpg?v=1701945431',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/cite_or_shandora_skypiea.jpg?v=1701945431'
  },
  {
    id: 'ohara',
    name: 'Ohara',
    url: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/ohara_arbre_one_piece.jpg?v=1701945545',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/ohara_arbre_one_piece.jpg?v=1701945545'
  },
  {
    id: 'water7',
    name: 'Water 7',
    url: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/water_7_one_piece.jpg?v=1701945579',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/water_7_one_piece.jpg?v=1701945579'
  },
  {
    id: 'wholecake',
    name: 'Whole Cake Island',
    url: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/foret_de_la_tentation_one_piece.jpg?v=1701946079',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/foret_de_la_tentation_one_piece.jpg?v=1701946079'
  },
  {
    id: 'mariegeoise',
    name: 'Marie Geoise',
    url: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/mary_geoise_chateau_pangee.jpg?v=1701946202',
    thumbnail: 'https://cdn.shopify.com/s/files/1/0770/3425/8763/files/mary_geoise_chateau_pangee.jpg?v=1701946202'
  }
];

function App() {
  const [name, setName] = useState('MONKEY D LUFFY');
  const [bounty, setBounty] = useState('3000000000');
  const [rank, setRank] = useState<Rank>('pirate');
  const [version, setVersion] = useState<PosterVersion>('classic');
  const [image, setImage] = useState<string | null>(null);
  const [useBullets, setUseBullets] = useState(false);
  const [rawName, setRawName] = useState('Monkey D Luffy');
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialScale, setInitialScale] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [lastMouseEvent, setLastMouseEvent] = useState<MouseEvent | null>(null);
  const [nameHeight, setNameHeight] = useState(3.2);
  const [nameWeight, setNameWeight] = useState(1.0);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const controlsCanvasRef = useRef<HTMLCanvasElement>(null);
  const templateRef = useRef<HTMLImageElement | null>(null);
  const berriesLogoRef = useRef<HTMLImageElement | null>(null);
  const uploadedImageRef = useRef<HTMLImageElement | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const backgroundsScrollRef = useRef<HTMLDivElement>(null);
  const CANVAS_WIDTH = 2000;
  const CANVAS_HEIGHT = 2828;
  const MAX_NAME_WIDTH = 1460;
  const MAX_BOUNTY_WIDTH = 1470;
  const NAME_Y_POSITION = 2180;
  const BOUNTY_Y_POSITION = 2480;
  const BASE_IMAGE_WIDTH = CANVAS_WIDTH * 0.85;
  const IMAGE_Y = CANVAS_HEIGHT * 0.12;
  const HANDLE_SIZE = 40;
  const SAFE_AREA = {
    top: CANVAS_HEIGHT * 0.12,
    bottom: CANVAS_HEIGHT * 0.70,
    left: CANVAS_WIDTH * 0.08,
    right: CANVAS_WIDTH * 0.92
  };

  useEffect(() => {
    // Check if URL has #terms hash or /terms path
    if (window.location.hash === '#terms' || window.location.pathname === '/terms') {
      setShowTerms(true);
      // Scroll to terms section
      setTimeout(() => {
        document.getElementById('terms')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  useEffect(() => {
    const template = new Image();
    template.src = 'https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Template_vide_3.png';
    template.crossOrigin = 'anonymous';
    template.onload = () => {
      templateRef.current = template;
      drawMainCanvas();
    };

    const berriesLogo = new Image();
    berriesLogo.src = 'https://cdn.shopify.com/s/files/1/0665/3404/7973/files/Berries_Logo.png';
    berriesLogo.crossOrigin = 'anonymous';
    berriesLogo.onload = () => {
      berriesLogoRef.current = berriesLogo;
      drawMainCanvas();
    };
  }, []);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        uploadedImageRef.current = img;
        drawMainCanvas();
      };
    } else {
      uploadedImageRef.current = null;
      drawMainCanvas();
    }
  }, [image]);

  useEffect(() => {
    if (backgroundImage || customBackground) {
      const img = new Image();
      img.src = backgroundImage || customBackground || '';
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        backgroundImageRef.current = img;
        drawMainCanvas();
      };
    } else {
      backgroundImageRef.current = null;
      drawMainCanvas();
    }
  }, [backgroundImage, customBackground]);

  useEffect(() => {
    const processedName = useBullets
      ? rawName.split(' ').filter(word => word).join('•')
      : rawName;
    setName(processedName.toUpperCase());
  }, [useBullets, rawName]);

  // Reset upload success message after 3 seconds
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const getFileName = (file: File): string => {
    const maxLength = 20;
    const name = file.name;
    const extension = name.split('.').pop() || '';
    const baseName = name.substring(0, name.lastIndexOf('.'));
    
    if (baseName.length <= maxLength) return name;
    return `${baseName.substring(0, maxLength)}...${extension}`;
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomBackground(e.target?.result as string);
        setBackgroundImage(null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const selectBackground = (bgUrl: string | null) => {
    setBackgroundImage(bgUrl);
    setCustomBackground(null);
  };

  const handleDeleteImage = () => {
    setImage(null);
    uploadedImageRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImagePosition({ x: 0, y: 0 });
    setImageScale(1);
    drawMainCanvas();
  };

  const getImageDimensions = () => {
    if (!uploadedImageRef.current) return { width: 0, height: 0, x: 0, y: 0 };
    
    const img = uploadedImageRef.current;
    const drawWidth = BASE_IMAGE_WIDTH * imageScale;
    const drawHeight = (img.height * BASE_IMAGE_WIDTH * imageScale) / img.width;
    const x = (CANVAS_WIDTH - drawWidth) / 2 + imagePosition.x;
    const y = IMAGE_Y + imagePosition.y;

    return { width: drawWidth, height: drawHeight, x, y };
  };

  const isInSafeArea = (x: number, y: number) => {
    return x >= SAFE_AREA.left && 
           x <= SAFE_AREA.right && 
           y >= SAFE_AREA.top && 
           y <= SAFE_AREA.bottom;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image) {
      const canvas = mainCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      if (
        x >= SAFE_AREA.left &&
        x <= SAFE_AREA.right &&
        y >= SAFE_AREA.top &&
        y <= SAFE_AREA.bottom
      ) {
        fileInputRef.current?.click();
      }
    }
  };

  const drawMainCanvas = () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background if available
    if (backgroundImageRef.current) {
      const bg = backgroundImageRef.current;
      const safeWidth = SAFE_AREA.right - SAFE_AREA.left;
      const safeHeight = SAFE_AREA.bottom - SAFE_AREA.top;
      const scale = Math.max(safeWidth / bg.width, safeHeight / bg.height) * 0.75;
      const width = bg.width * scale;
      const height = bg.height * scale;
      const x = SAFE_AREA.left + (safeWidth - width) / 2 + width * 0.02;
      const y = SAFE_AREA.top + (safeHeight - height) / 2;
      ctx.drawImage(bg, x, y, width, height);
    }

    if (!image && !isDragging && !isResizing) {
      const dropZoneWidth = SAFE_AREA.right - SAFE_AREA.left;
      const dropZoneHeight = SAFE_AREA.bottom - SAFE_AREA.top;
      const centerX = SAFE_AREA.left + dropZoneWidth / 2;
      const centerY = SAFE_AREA.top + dropZoneHeight / 2;

      ctx.save();
      ctx.fillStyle = backgroundImageRef.current 
        ? 'rgba(255, 255, 255, 0.7)' 
        : 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(SAFE_AREA.left, SAFE_AREA.top, dropZoneWidth, dropZoneHeight);

      ctx.strokeStyle = isDragOver ? '#4a9eff' : '#666';
      ctx.lineWidth = 6;
      const iconSize = 180;

      ctx.beginPath();
      ctx.roundRect(centerX - iconSize/2, centerY - iconSize/3, iconSize, iconSize/1.5, 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, iconSize/4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(centerX + iconSize/4, centerY - iconSize/3 - iconSize/8, iconSize/4, iconSize/8, 5);
      ctx.stroke();

      ctx.font = 'bold 60px sans-serif';
      ctx.fillStyle = isDragOver ? '#4a9eff' : '#666';
      ctx.textAlign = 'center';
      ctx.fillText(
        isDragOver ? 'Drop image here' : 'Drop or click to upload image',
        centerX,
        centerY + iconSize
      );

      ctx.restore();
    }

    if (uploadedImageRef.current) {
      const { width, height, x, y } = getImageDimensions();
      ctx.drawImage(uploadedImageRef.current, x, y, width, height);
    }

    if (templateRef.current) {
      ctx.drawImage(templateRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    drawName(ctx, name);
    drawBounty(ctx, formatBounty(bounty));
    drawControls();
  };

  const drawControls = () => {
    const canvas = controlsCanvasRef.current;
    if (!canvas || !uploadedImageRef.current || !isHovering) {
      const ctx = canvas?.getContext('2d');
      ctx?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const { width, height, x, y } = getImageDimensions();

    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    const handles = [
      { x, y },
      { x: x + width, y },
      { x, y: y + height },
      { x: x + width, y: y + height },
    ];

    handles.forEach(handle => {
      ctx.fillStyle = 'white';
      ctx.fillRect(
        handle.x - HANDLE_SIZE/2,
        handle.y - HANDLE_SIZE/2,
        HANDLE_SIZE,
        HANDLE_SIZE
      );
      ctx.strokeRect(
        handle.x - HANDLE_SIZE/2,
        handle.y - HANDLE_SIZE/2,
        HANDLE_SIZE,
        HANDLE_SIZE
      );
    });
  };

  useEffect(() => {
    drawMainCanvas();
  }, [name, bounty, imagePosition, imageScale, isDragOver, nameHeight, nameWeight, backgroundImage, customBackground]);

  useEffect(() => {
    drawControls();
  }, [isHovering, isResizing, activeHandle]);

  const getResizeHandle = (x: number, y: number): ResizeHandle => {
    const { width, height, x: imageX, y: imageY } = getImageDimensions();
    const handles = [
      { pos: { x: imageX, y: imageY }, type: 'top-left' as ResizeHandle },
      { pos: { x: imageX + width, y: imageY }, type: 'top-right' as ResizeHandle },
      { pos: { x: imageX, y: imageY + height }, type: 'bottom-left' as ResizeHandle },
      { pos: { x: imageX + width, y: imageY + height }, type: 'bottom-right' as ResizeHandle },
    ];

    for (const handle of handles) {
      if (
        x >= handle.pos.x - HANDLE_SIZE/2 &&
        x <= handle.pos.x + HANDLE_SIZE/2 &&
        y >= handle.pos.y - HANDLE_SIZE/2 &&
        y <= handle.pos.y + HANDLE_SIZE/2
      ) {
        return handle.type;
      }
    }

    return null;
  };

  const isOverImage = (x: number, y: number) => {
    if (!image) return false;
    const { width, height, x: imageX, y: imageY } = getImageDimensions();
    const isOver = x >= imageX && x <= imageX + width && y >= imageY && y <= imageY + height;
    return isOver && isInSafeArea(x, y);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!image) return;

    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const resizeHandle = getResizeHandle(x, y);
    
    if (resizeHandle) {
      setIsResizing(resizeHandle);
      setInitialScale(imageScale);
      setDragStart({ x, y });
    } else if (isOverImage(x, y)) {
      setIsDragging(true);
      setDragStart({
        x: x - imagePosition.x,
        y: y - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setLastMouseEvent(e.nativeEvent);
    
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const resizeHandle = getResizeHandle(x, y);
    const isOverImageArea = isOverImage(x, y);
    
    setActiveHandle(resizeHandle);
    setIsHovering(isOverImageArea || !!resizeHandle);
    
    if (isResizing) {
      const dx = x - dragStart.x;
      const scaleFactor = 0.002;
      
      let newScale = initialScale;
      
      if (isResizing.includes('right')) {
        newScale = initialScale + (dx * scaleFactor);
      } else if (isResizing.includes('left')) {
        newScale = initialScale - (dx * scaleFactor);
      }
      
      newScale = Math.max(0.5, Math.min(2, newScale));
      setImageScale(newScale);
    } else if (isDragging && image) {
      setImagePosition({
        x: x - dragStart.x,
        y: y - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsResizing(null);
    setIsHovering(false);
    setActiveHandle(null);
  };

  const drawName = (ctx: CanvasRenderingContext2D, text: string) => {
    ctx.save();
    
    const baseFontSize = 140;
    ctx.font = `900 ${baseFontSize}px "Times New Roman"`;
    ctx.fillStyle = '#3e2c2a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const spacedText = text.split('').join('\u200A');
    let textWidth = ctx.measureText(spacedText).width;
    
    // First apply the nameWeight to get the desired width
    let desiredWidth = textWidth * nameWeight;
    
    // Then check if it exceeds MAX_NAME_WIDTH and scale down if needed
    let finalScaleX = nameWeight;
    if (desiredWidth > MAX_NAME_WIDTH) {
      finalScaleX = MAX_NAME_WIDTH / textWidth;
    }

    ctx.translate(CANVAS_WIDTH / 2, NAME_Y_POSITION);
    ctx.scale(finalScaleX, nameHeight);

    if (text.includes('•')) {
      const chars = spacedText.split('');
      let totalWidth = ctx.measureText(spacedText).width;
      let currentX = -totalWidth / 2;

      chars.forEach((char) => {
        const charWidth = ctx.measureText(char).width;
        if (char === '•') {
          ctx.save();
          ctx.scale(1, 0.35);
          ctx.fillText(char, currentX + charWidth / 2, 0);
          ctx.restore();
        } else {
          ctx.fillText(char, currentX + charWidth / 2, 0);
        }
        currentX += charWidth;
      });
    } else {
      ctx.fillText(spacedText, 0, 0);
    }

    ctx.restore();
  };

  const drawBounty = (ctx: CanvasRenderingContext2D, text: string) => {
    ctx.save();
    
    const fontSize = 120;
    const letterSpacing = 20;
    ctx.font = `400 ${fontSize}px "Margarine"`;
    ctx.fillStyle = '#3A1F04';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const chars = text.split('');
    const charWidths = chars.map(char => ctx.measureText(char).width);
    const totalSpacing = (chars.length - 1) * letterSpacing;
    const totalWidth = charWidths.reduce((sum, width) => sum + width, 0) + totalSpacing;
    
    const berriesSize = 152;
    const berriesSpacing = 40;
    const totalWidthWithBerries = totalWidth + berriesSize + berriesSpacing;
    const bountyOffset = 80;

    let scale = 1;
    if (totalWidthWithBerries > MAX_BOUNTY_WIDTH) {
      scale = MAX_BOUNTY_WIDTH / totalWidthWithBerries;
    }

    const bountyX = CANVAS_WIDTH / 2 + bountyOffset;
    const bountyY = BOUNTY_Y_POSITION - 50;

    ctx.translate(bountyX, bountyY);
    ctx.scale(scale, scale);

    if (berriesLogoRef.current) {
      const berriesX = -(totalWidth / 2) - berriesSize - berriesSpacing;
      const berriesY = -(berriesSize / 2);
      ctx.drawImage(berriesLogoRef.current, berriesX, berriesY, berriesSize, berriesSize);
    }

    let currentX = -(totalWidth / 2);
    chars.forEach((char, i) => {
      if (char === '-') {
        ctx.save();
        ctx.translate(currentX + (charWidths[i] / 2), 0);
        ctx.scale(1.5, 1);
        ctx.fillText(char, 0, 0);
        ctx.restore();
      } else {
        ctx.fillText(char, currentX + (charWidths[i] / 2), 0);
      }
      currentX += charWidths[i] + letterSpacing;
    });
    
    ctx.restore();
  };

  const formatBounty = (value: string) => {
    const number = parseInt(value.replace(/\D/g, ''), 10) || 0;
    return number.toLocaleString('fr-FR').replace(/\s/g, ',') + '-';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRawName(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setImagePosition({ x: 0, y: 0 });
        setImageScale(1);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setImagePosition({ x: 0, y: 0 });
        setImageScale(1);
      };
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDownload = async () => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    // Set uploading state
    setIsUploading(true);

    try {
      // Get the canvas data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `wanted-poster-${rawName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      
      // Show success message and reset uploading state
      setUploadSuccess(true);
      setIsUploading(false);
      
      // Dispatch a custom event to increment the poster count
      const event = new CustomEvent('posterDownloaded');
      window.dispatchEvent(event);
      
      // Initialize the global counter if it doesn't exist yet
      if (!localStorage.getItem('globalPosterCount')) {
        localStorage.setItem('globalPosterCount', '1');
      } else {
        const currentCount = parseInt(localStorage.getItem('globalPosterCount') || '0', 10);
        localStorage.setItem('globalPosterCount', (currentCount + 1).toString());
      }
    } catch (error) {
      console.error("Error downloading poster: ", error);
      setIsUploading(false);
    }
  };

  const getCursorStyle = () => {
    if (!image) {
      const canvas = mainCanvasRef.current;
      if (!canvas) return '';

      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;

      const mouseX = lastMouseEvent 
        ? (lastMouseEvent.clientX - rect.left) * scaleX 
        : 0;
      const mouseY = lastMouseEvent
        ? (lastMouseEvent.clientY - rect.top) * scaleY
        : 0;

      if (
        mouseX >= SAFE_AREA.left &&
        mouseX <= SAFE_AREA.right &&
        mouseY >= SAFE_AREA.top &&
        mouseY <= SAFE_AREA.bottom
      ) {
        return 'cursor-pointer';
      }
    }

    if (activeHandle) return 'cursor-nwse-resize';
    if (isResizing) return 'cursor-nwse-resize';
    if (isHovering) return isDragging ? 'cursor-grabbing' : 'cursor-grab';
    return '';
  };

  // If we're showing the Terms page, render only that
  if (showTerms) {
    return (
      <div className="min-h-screen bg-[#1a1b26] relative overflow-hidden flex flex-col">
        <Header />
        <div 
          className="fixed top-0 left-0 w-full h-screen pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 70%)',
            opacity: '0.15',
            filter: 'blur(120px)'
          }}
        />
        <main className="flex-1 pt-24 pb-8 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <TermsConditions />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b26] relative overflow-hidden flex flex-col">
      <Header />
      
      <div 
        className="fixed top-0 left-0 w-full h-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, #3B82F6 0%, transparent 70%)',
          opacity: '0.15',
          filter: 'blur(120px)'
        }}
      />
      <main className="flex-1 pt-24 pb-8 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-b from-[#1e1f2b] to-[#151621] 
  backdrop-blur-lg border border-[rgba(255,255,255,0.1)] 
  rounded-xl sm:rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.3)] 
  p-6 sm:p-8 space-y-4">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all"
                    value={rawName}
                    onChange={handleNameChange}
                    placeholder="Enter name"
                  />
                  <div className="flex items-center gap-2 mt-2 mb-4">
                    <input
                      type="checkbox"
                      id="useBullets"
                      checked={useBullets}
                      onChange={(e) => setUseBullets(e.target.checked)}
                      className="rounded border-gray-400"
                    />
                    <label htmlFor="useBullets" className="text-sm text-gray-300">
                      Replace spaces with • (Example: Monkey•D•Luffy)
                    </label>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Name Height ({nameHeight.toFixed(1)}x)
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="3.4"
                        step="0.1"
                        value={nameHeight}
                        onChange={(e) => setNameHeight(parseFloat(e.target.value))}
                        className="w-full h-auto accent-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Name Width ({nameWeight.toFixed(1)}x)
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={nameWeight}
                        onChange={(e) => setNameWeight(parseFloat(e.target.value))}
                        className="w-full h-auto accent-[#8B5CF6]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Bounty</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all"
                    value={bounty}
                    onChange={(e) => setBounty(e.target.value)}
                    placeholder="Enter bounty amount"
                  />
                </div>

                {/* Upload Photo Button */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Photo</label>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white p-3 flex items-center justify-center gap-2 hover:bg-[#4B5563] transition-colors"
                    >
                      <Upload size={20} />
                      Upload Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {image && (
                      <button
                        onClick={handleDeleteImage}
                        className="w-full bg-red-500 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={20} />
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">Background</label>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Horizontal scrolling background container with fade effect */}
                    <div className="relative">
                      <div 
                        ref={backgroundsScrollRef}
                        className="flex overflow-x-auto pb-2 scrollbar-hide"
                        style={{ 
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none'
                        }}
                      >
                        {/* None option as a thumbnail */}
                        <button
                          onClick={() => selectBackground(null)}
                          className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex flex-col items-center justify-center mr-2 ${!backgroundImage && !customBackground ? 'border-2 border-[#8B5CF6] bg-[#8B5CF6]/20' : 'border border-gray-600 bg-[rgba(255,255,255,0.1)]'}`}
                          title="None"
                        >
                          <X size={24} className="text-white mb-1" />
                          <span className="text-xs text-white">None</span>
                        </button>
                        
                        {/* Predefined backgrounds */}
                        {PREDEFINED_BACKGROUNDS.map((bg) => (
                          <button
                            key={bg.id}
                            onClick={() => selectBackground(bg.url)}
                            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden mr-2 ${backgroundImage === bg.url ? 'border-2 border-[#8B5CF6]' : 'border border-gray-600'}`}
                            title={bg.name}
                          >
                            <img src={bg.thumbnail} alt={bg.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                      {/* Fade effect on the right side */}
                      <div 
                        className="absolute top-0 right-0 h-full w-16 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to right, rgba(30, 31, 43, 0), rgba(30, 31, 43, 1))'
                        }}
                      ></div>
                    </div>
                    
                    <button
                      onClick={() => backgroundInputRef.current?.click()}
                      className="p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white flex items-center justify-center gap-2 hover:bg-[#4B5563] transition-colors"
                    >
                      <Upload size={20} />
                      Upload Custom Background
                    </button>
                    <input
                      ref={backgroundInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isUploading}
                  className={`w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white font-semibold p-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Poster
                    </>
                  )}
                </button>

                {uploadSuccess && (
                  <div className="text-center text-green-400">
                    Poster downloaded successfully!
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div
                className={`relative ${getCursorStyle()}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <canvas
                  ref={mainCanvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="w-full h-auto"
                  onClick={handleCanvasClick}
                />
                <canvas
                  ref={controlsCanvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="absolute top-0 left-0 w-full h-auto pointer-events-none"
                />
                
                {image && (
                  <button
                    onClick={handleDeleteImage}
                    className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <RichTextDescription />
          <FAQ />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;