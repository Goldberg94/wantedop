import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "../firebaseConfig"; // Assure-toi que le fichier firebaseConfig est bien importé
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

function Gallery() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Récupérer les 40 dernières affiches depuis Firestore
  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const postersRef = collection(db, "posters");
        const q = query(postersRef, orderBy("createdAt", "desc"), limit(40));
        const querySnapshot = await getDocs(q);

        // Extraire les URLs des affiches
        const images = querySnapshot.docs.map((doc) => doc.data().url);
        setGalleryImages(images);
      } catch (error) {
        console.error("Error fetching posters: ", error);
      }
    };

    fetchPosters();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    const newPosition =
      direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount;
    setScrollPosition(newPosition);
    scrollContainerRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  return (
    <section id="gallery" className="mt-24">
      <h2 className="text-3xl text-center text-[#fff] mb-12 font-bold">
        Latest Created Posters
      </h2>
      <div className="relative max-w-6xl mx-auto">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-3 rounded-full shadow-lg z-10"
          onClick={() => handleScroll("left")}
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-12">
          {galleryImages.length === 0 ? (
            <p className="text-gray-400 text-center w-full">
              No posters yet. Create your first one!
            </p>
          ) : (
            galleryImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-60 h-80 relative rounded-lg overflow-hidden border border-gray-600"
              >
                <img src={image} alt={`Poster ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))
          )}
        </div>

        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 p-3 rounded-full shadow-lg z-10"
          onClick={() => handleScroll("right")}
          disabled={
            scrollContainerRef.current &&
            scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth <= scrollPosition
          }
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>
    </section>
  );
}

export default Gallery;