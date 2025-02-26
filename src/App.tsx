import React, { useState, useRef, useEffect } from 'react';
import { Skull, Upload, Trash2 } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import { db } from './firebaseConfig'; // Import Firestore
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import Contact from './components/Contact';
import { storage } from './firebaseConfig';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';


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
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const controlsCanvasRef = useRef<HTMLCanvasElement>(null);
  const templateRef = useRef<HTMLImageElement | null>(null);
  const berriesLogoRef = useRef<HTMLImageElement | null>(null);
  const uploadedImageRef = useRef<HTMLImageElement | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
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
  }, [name, bounty, imagePosition, imageScale, isDragOver, nameHeight, backgroundImage, customBackground]);

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
    let scale = 1;

    if (textWidth > MAX_NAME_WIDTH) {
      scale = MAX_NAME_WIDTH / textWidth;
    }

    ctx.translate(CANVAS_WIDTH / 2, NAME_Y_POSITION);
    ctx.scale(scale, nameHeight);

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

    // Get the canvas data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    // 1. First save locally (current functionality)
    const link = document.createElement('a');
    link.download = `wanted-poster-${rawName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();
    
    // 2. Then upload to Firebase
    try {
      setIsUploading(true);
      // Upload to Firebase Storage using the imported storage
      const storageRef = ref(storage, `posters/${Date.now()}.png`);
      await uploadString(storageRef, dataUrl, 'data_url');
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Save to Firestore
      await addDoc(collection(db, "posters"), {
        url: downloadURL,
        name: rawName,
        bounty: bounty,
        createdAt: new Date()
      });
      
      // Show success message
      setUploadSuccess(true);
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading poster: ", error);
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
      className="w-full accent-[#8B5CF6]"
      style={{ cursor: 'pointer' }}
    />
  </div>
</div>

<div>
  <label className="block text-gray-300 font-medium mb-2">Bounty (Berries)</label>
  <input 
    type="number"
    className="w-full p-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition-all"
    value={bounty}
    onChange={(e) => setBounty(e.target.value)}
    placeholder="Enter bounty amount"
  />
</div>

<div>
  <label className="block text-white font-medium mb-2">Upload your Photo</label>
  <div className="flex items-center gap-2">
    {!image ? (
      <label className="cursor-pointer bg-[#374151] text-white px-4 py-3 rounded-xl hover:bg-[#4B5563] transition-colors flex items-center gap-2">
        <Upload size={16} />
        {fileInputRef.current?.files?.[0] 
          ? getFileName(fileInputRef.current.files[0])
          : 'Choose File'
        }
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
        />
      </label>
    ) : (
      <button
        onClick={handleDeleteImage}
        className="bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
      >
        <Trash2 size={16} />
        Delete Image
      </button>
    )}
  </div>
</div>

<div>
  <label className="block text-white font-medium mb-2">Background</label>
  <div className="relative">
    <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 mb-4 px-2">
      <button
        onClick={() => selectBackground(null)}
        className={`shrink-0 w-24 sm:w-32 h-16 sm:h-20 rounded-lg border-2 flex items-center justify-center overflow-hidden ${
          !backgroundImage && !customBackground ? 'border-[#8B5CF6]' : 'border-gray-600'
        }`}
      >
        <span className="text-gray-400 text-lg">None</span>
      </button>
      {PREDEFINED_BACKGROUNDS.map((bg) => (
        <button
          key={bg.id}
          onClick={() => selectBackground(bg.url)}
          className={`shrink-0 w-24 sm:w-32 h-16 sm:h-20 rounded-lg border-2 overflow-hidden ${
            backgroundImage === bg.url ? 'border-[#8B5CF6]' : 'border-gray-600'
          }`}
        >
          <img 
            src={bg.thumbnail} 
            alt={`Background ${bg.id}`}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#1a1b26] pointer-events-none"></div>
  </div>
  <div className="flex items-center gap-2">
    <label className="cursor-pointer bg-[#374151] text-white px-4 py-3 rounded-xl hover:bg-[#4B5563] transition-colors flex items-center gap-2">
      <Upload size={16} />
      Upload Custom
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleBackgroundUpload}
        ref={backgroundInputRef}
      />
    </label>
    <span className="text-gray-300">
      {customBackground ? 'Custom background selected' : ''}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleDownload}
                  disabled={isUploading}
                  className={`w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] 
    text-white font-semibold p-4 rounded-xl sm:rounded-2xl 
    flex items-center justify-center gap-2 
    hover:opacity-90 transition-all shadow-lg ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
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
                  <div className="text-center text-green-400 mt-2 animate-pulse">
                    Poster successfully added to the gallery!
                  </div>
                )}
              </div>
            </div>

            <div 
              className="relative w-full" 
              style={{ aspectRatio: "2000/2828" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <canvas
                ref={mainCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className={`w-full h-full absolute top-0 left-0 ${getCursorStyle()}`}
                onClick={handleCanvasClick}
              />
              <canvas
                ref={controlsCanvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full h-full absolute top-0 left-0 pointer-events-none"
              />
            </div>
          </div>
          <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 text-white text-sm leading-relaxed">
  <h1 className="text-xl sm:text-xl font-semibold mb-4 mt-16">
    Create Your Own Custom One Piece Wanted Posters!
  </h1>

  <p className="text-justify mb-2">
    You can now design your own <span className="font-bold">One Piece</span>-inspired 
    <span className="font-bold"> Wanted posters</span>, just like in the anime! Bring your imagination 
    to life with customizable templates that let you create posters featuring your favorite characters, 
    original creations, or even yourself!
  </p>

  <p className="text-justify mb-2">
    Are you a <span className="font-bold">One Piece</span> fan looking to make your own bounty posters?
  </p>

  <p className="text-justify mb-8">
    <span className="font-bold">Wanted Poster Generator</span> is the ultimate tool for creating 
    <strong> realistic, high-quality </strong> One Piece-style posters. Whether you're a cosplayer, 
    a content creator, or just a fan of the series, our app makes it easy to design and personalize 
    <strong> your own wanted posters </strong> <strong> your own wanted posters </strong> in just a few clicks!
  </p>

  <p className="text-xl sm:text-xl font-semibold mb-4">Features:</p>
  <ul className="space-y-3 text-justify">
    <li className="flex items-start gap-3">
      <span className="text-white-500 text-xl">•</span>
      <span><strong>Authentic Design:</strong> Create posters that look just like the official bounty posters from 
      <em> One Piece</em>. Adjust the layout, fonts, and details to match the anime's iconic style.</span>
    </li>
    <li className="flex items-start gap-3">
      <span className="text-white-500 text-xl">•</span>
      <span><strong>Unlimited Customization:</strong> Personalize every element, including the 
      <span className="font-bold"> name</span>, <span className="font-bold"> bounty amount</span>, 
      <span className="font-bold"> photo</span>, and <span className="font-bold"> Marine insignia</span>. 
      Add your own text, choose your poster's background, and even edit the <strong>"Dead or Alive"</strong> status!</span>
    </li>
    <li className="flex items-start gap-3">
      <span className="text-white-500 text-xl">•</span>
      <span><strong>Share & Print:</strong> Once your masterpiece is ready, share it with your friends on 
      social media or print it in high resolution to display in your room.</span>
    </li>
    <li className="flex items-start gap-3">
      <span className="text-white-500 text-xl">•</span>
      <span><strong>Community & Inspiration:</strong> Join a passionate <span className="font-bold">One Piece</span> 
      community and browse thousands of fan-made posters. Get inspired, share your creations, and bring your 
      <em> One Piece</em> dreams to life!</span>
    </li>
  </ul>

  <p className="text-justify mt-8">
    Unleash your creativity and step into the world of <span className="font-bold">One Piece</span> with the 
    <strong> Wanted Poster Generator</strong>! Whether for fun, gifts, or social media, our app gives you all the tools 
    to craft the perfect bounty poster. Start creating your custom One Piece Wanted posters today! 🏴‍☠️🔥
  </p>
</section>

          <Gallery />

          <section id="faq" className="mt-24">
  <h2 className="text-3xl text-center text-[#fff] mb-12 font-bold">Frequently Asked Questions</h2>
  <div className="max-w-3xl mx-auto space-y-3">

    {/* Supported formats */}
<details 
  className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
  open={openItem === 'formats'}
  onClick={(e) => {
    e.preventDefault();
    setOpenItem(openItem === 'formats' ? null : 'formats')
  }}
>
  <summary className="flex items-center justify-between p-4 cursor-pointer">
    <h3 className="text-xl text-white">What image formats are supported?</h3>
    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="p-4 pt-0 text-[#f4e4bc]">
    You can upload images in <strong>JPG, PNG, and WEBP</strong> formats. For the best results, use a high-resolution image with a clean background.
  </div>
</details>

    {/* Adjusting image size and position */}
<details 
  className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
  open={openItem === 'size'}
  onClick={(e) => {
    e.preventDefault();
    setOpenItem(openItem === 'size' ? null : 'size');
  }}
>
  <summary className="flex items-center justify-between p-4 cursor-pointer">
    <h3 className="text-xl text-white">Can I adjust my image's size and position?</h3>
    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="p-4 pt-0 text-[#f4e4bc]">
    Yes! After uploading your image, you can <strong>move, resize, and zoom</strong> to ensure a perfect fit within the poster frame.
  </div>
</details>


    {/* Poster styles */}
<details 
  className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
  open={openItem === 'styles'}
  onClick={(e) => {
    e.preventDefault();
    setOpenItem(openItem === 'styles' ? null : 'styles');
  }}
>
  <summary className="flex items-center justify-between p-4 cursor-pointer">
    <h3 className="text-xl text-white">What Wanted poster styles are available?</h3>
    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="p-4 pt-0 text-[#f4e4bc]">
    We offer several styles:
    <ul className="list-disc pl-5 mt-2 space-y-1">
      <li><strong>Classic</strong> (aged paper effect)</li>
      <li><strong>Holo</strong> (shiny and modern)</li>
      <li><strong>White Edition</strong> (clean, minimalist look)</li>
    </ul>
  </div>
</details>

{/* Background options */}
<details 
  className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
  open={openItem === 'backgrounds'}
  onClick={(e) => {
    e.preventDefault();
    setOpenItem(openItem === 'backgrounds' ? null : 'backgrounds');
  }}
>
  <summary className="flex items-center justify-between p-4 cursor-pointer">
    <h3 className="text-xl text-white">What backgrounds can I choose from?</h3>
    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="p-4 pt-0 text-[#f4e4bc]">
    You can select from One Piece-inspired locations, including:
    <ul className="list-disc pl-5 mt-2 space-y-1">
      <li><strong>Wano Kuni</strong></li>
      <li><strong>Dressrosa</strong></li>
      <li><strong>Skypiea</strong></li>
      <li><strong>Sabaody</strong></li>
      <li><strong>Ohara</strong></li>
      <li><strong>Water 7</strong></li>
    </ul>
    You can also <strong>upload your own background</strong> for a fully customized look!
  </div>
</details>

    {/* File format and resolution */}
<details 
  className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
  open={openItem === 'format'}
  onClick={(e) => {
    e.preventDefault();
    setOpenItem(openItem === 'format' ? null : 'format');
  }}
>
  <summary className="flex items-center justify-between p-4 cursor-pointer">
    <h3 className="text-xl text-white">What's the output format and quality?</h3>
    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="p-4 pt-0 text-[#f4e4bc]">
    Your poster will be downloaded in <strong>high-resolution PNG format (2000x2828 px)</strong>, perfect for sharing or printing.
  </div>
</details>

{/* Printing the poster */}
<details 
  className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
  open={openItem === 'print'}
  onClick={(e) => {
    e.preventDefault();
    setOpenItem(openItem === 'print' ? null : 'print');
  }}
>
  <summary className="flex items-center justify-between p-4 cursor-pointer">
    <h3 className="text-xl text-white">Can I print my Wanted poster?</h3>
    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="p-4 pt-0 text-[#f4e4bc]">
    Yes! You can print your poster on <strong>A3/A4 paper, photo paper, or even a t-shirt</strong>.  
    Be sure to use a <strong>high-resolution image</strong> for the best results.
  </div>
</details>

{/* Sharing on social media */}
<details 
  className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
  open={openItem === 'social'}
  onClick={(e) => {
    e.preventDefault();
    setOpenItem(openItem === 'social' ? null : 'social');
  }}
>
  <summary className="flex items-center justify-between p-4 cursor-pointer">
    <h3 className="text-xl text-white">Can I share my Wanted poster on social media?</h3>
    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="p-4 pt-0 text-[#f4e4bc]">
    Absolutely! Share your Wanted poster on <strong>Instagram, TikTok, Twitter, or Facebook</strong>.  
    Use the hashtag <strong>#WantedOnePieceMaker</strong> for a chance to be featured!
  </div>
</details>

{/* Custom text options */}
<details 
  className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
  open={openItem === 'customText'}
  onClick={(e) => {
    e.preventDefault();
    setOpenItem(openItem === 'customText' ? null : 'customText');
  }}
>
  <summary className="flex items-center justify-between p-4 cursor-pointer">
    <h3 className="text-xl text-white">Can I add custom text to my poster?</h3>
    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="p-4 pt-0 text-[#f4e4bc]">
    Currently, the <strong>"Dead or Alive"</strong> text is fixed. However, you can <strong>customize the character's name and bounty</strong>  
    to create your own unique Wanted poster.
  </div>
</details>

{/* Editing after download */}
<details 
  className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
  open={openItem === 'edit'}
  onClick={(e) => {
    e.preventDefault();
    setOpenItem(openItem === 'edit' ? null : 'edit');
  }}
>
  <summary className="flex items-center justify-between p-4 cursor-pointer">
    <h3 className="text-xl text-white">Can I edit my poster after downloading it?</h3>
    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="p-4 pt-0 text-[#f4e4bc]">
    If you need to make changes, simply <strong>return to the editor</strong>, adjust your settings,  
    and download a new version.
  </div>
</details>

{/* Using as a personalized gift */}
<details 
  className="group bg-[rgba(15,15,25,0.6)] backdrop-blur-md rounded-xl"
  open={openItem === 'gift'}
  onClick={(e) => {
    e.preventDefault();
    setOpenItem(openItem === 'gift' ? null : 'gift');
  }}
>
  <summary className="flex items-center justify-between p-4 cursor-pointer">
    <h3 className="text-xl text-white">Can I use this as a personalized gift?</h3>
    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="#fff">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="p-4 pt-0 text-[#f4e4bc]">
    Yes! A custom Wanted poster makes a <strong>perfect gift for One Piece fans</strong> or  
    a unique surprise for a <strong>birthday, special occasion, or even as a joke</strong>.
  </div>
</details>

  </div>
</section>

          <Contact />


        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;