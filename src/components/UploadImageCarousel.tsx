"use client";

import { Loader2, X } from "lucide-react";
import LoadingImage from "./LoadingImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import Image from "next/image";
import { Button } from "./ui/button";
import { useContext } from "react";
import { OnDeleteImageContext } from "./MiniCreatePost";

const UploadImageCarousel = ({
  imageUrls,
  imageUrlsQueue,
  localImageSize,
}: {
  imageUrls: Array<string>;
  imageUrlsQueue: Array<string>;
  localImageSize: { width: number; height: number };
}) => {
  const onDeleteImage = useContext(OnDeleteImageContext);

  return (
    <div className="w-full">
      <Carousel
        opts={{
          slidesToScroll: "auto",
        }}
      >
        <CarouselContent>
          {...imageUrls.map((imageUrl, index) => (
            <CarouselItem key={imageUrl} className="relative basis-1/2">
              <Button
                className="absolute right-2 top-2 rounded-full bg-gray-800/80 hover:bg-gray-600/80"
                size={"icon"}
                onClick={() => onDeleteImage(index)}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
              <Image
                src={imageUrl}
                alt="Uploaded Image"
                width={0}
                height={0}
                className="h-full w-full rounded-3xl object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              />
            </CarouselItem>
          ))}
          {...imageUrlsQueue.map((imageUrl) => (
            <CarouselItem className="basis-1/2" key={imageUrl}>
              {imageUrls.length ? (
                <div
                  className={`flex h-full w-full items-center justify-center rounded-3xl bg-gray-600`}
                >
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <LoadingImage
                  width={localImageSize.width}
                  height={localImageSize.height}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default UploadImageCarousel;
