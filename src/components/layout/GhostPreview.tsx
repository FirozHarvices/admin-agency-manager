import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

// Define more structured layouts
const layouts = [
  // Layout 1: Classic Hero Section
  {
    key: 'hero',
    component: () => (
      <>
        {/* Header */}
        <div className="flex justify-between items-center flex-shrink-0">
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="h-4 w-12 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-12 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        {/* Hero Content */}
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-10 bg-gray-300 rounded-lg w-32 mt-4"></div>
        </div>
      </>
    )
  },
  // Layout 2: Three-Column Feature Section
  {
    key: 'features',
    component: () => (
      <div className="flex-grow flex items-center justify-center gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-1/3 h-4/5 bg-gray-200 rounded-lg flex flex-col p-4 gap-2">
            <div className="h-16 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  },
  // Layout 3: Image + Text Section
  {
    key: 'image-text',
    component: () => (
      <div className="flex-grow flex items-center justify-center gap-8">
        <div className="w-1/2 h-3/4 bg-gray-200 rounded-lg"></div>
        <div className="w-1/2 h-3/4 flex flex-col gap-4">
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  },
  // Layout 4: Testimonials
  {
    key: 'testimonials',
    component: () => (
      <div className="flex-grow flex flex-col items-center justify-center gap-4">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
         <div className="flex gap-8 w-full">
            <div className="w-1/2 h-32 bg-gray-200 rounded-lg p-4 flex flex-col gap-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mt-auto"></div>
            </div>
            <div className="w-1/2 h-32 bg-gray-200 rounded-lg p-4 flex flex-col gap-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mt-auto"></div>
            </div>
         </div>
      </div>
    )
  }
];

interface GhostPreviewProps {
  isActive: boolean;
}

export const GhostPreview = ({ isActive }: GhostPreviewProps) => {
  const [layoutIndex, setLayoutIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    // --- THE FIX: Only run the animation if isActive is true ---
    if (isActive) {
      interval = setInterval(() => {
        setLayoutIndex(prev => (prev + 1) % layouts.length);
      }, 2000);
    }

    // The cleanup function will clear the interval if isActive becomes false or the component unmounts
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full h-full flex flex-col gap-4 overflow-hidden">
      {/* 
        We show a static, generic layout if the animation is not active.
        This provides a stable background for the "Generation Failed" state.
      */}
      {!isActive ? (
        <div className="w-full h-full flex items-center justify-center gap-4 opacity-50">
            <div className="w-1/4 h-1/2 bg-gray-200 rounded-lg"></div>
            <div className="w-1/4 h-1/2 bg-gray-200 rounded-lg"></div>
            <div className="w-1/4 h-1/2 bg-gray-200 rounded-lg"></div>
        </div>
      ) : (
        layouts.map((layout, index) => (
          <div
            key={layout.key}
            className={cn(
              "w-full h-full flex flex-col gap-4 transition-opacity duration-500 ease-in-out",
              layoutIndex === index ? 'opacity-100' : 'opacity-0 hidden'
            )}
          >
            {layout.component()}
          </div>
        ))
      )}
    </div>
  );
};