import Image from "next/image";
import { useState } from "react";

export default function ImageWithFallback({
  src,
  alt,
  fill,
  sizes,
  className,
  fallbackSrc = "/mascot/empty-bot.png",
  blurDataURL,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${fill ? "absolute inset-0" : ""} ${className || ""}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-[#242424] animate-pulse rounded" />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${className || ""}`}
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
            setIsLoading(false);
          }
        }}
        {...props}
      />
    </div>
  );
}
