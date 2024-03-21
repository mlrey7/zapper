import Image from "next/image";
import LoadingImage from "./LoadingImage";
import UploadImageCarousel from "./UploadImageCarousel";
import { memo } from "react";

interface UploadImageDisplayProps {
  isUploading: boolean;
  localImageSize: { width: number; height: number } | null;
  localImagesUploadQueue: Array<File>;
  localImages: Array<File>;
}

const UploadImageDisplay = memo(function x({
  isUploading,
  localImageSize,
  localImagesUploadQueue,
  localImages,
}: UploadImageDisplayProps) {
  const localImagesUrls = localImages.map((localImage) =>
    URL.createObjectURL(localImage),
  );
  const localImagesUploadQueueUrls = localImagesUploadQueue.map((l) =>
    URL.createObjectURL(l),
  );

  return (
    <div className="mt-2 flex">
      {isUploading &&
      localImageSize &&
      localImagesUploadQueue.length === 1 &&
      localImages.length === 0 ? (
        <LoadingImage
          width={localImageSize!.width}
          height={localImageSize!.height}
        />
      ) : null}

      {isUploading &&
      localImageSize &&
      (localImagesUploadQueue.length > 1 || localImages.length > 0) ? (
        <UploadImageCarousel
          imageUrls={localImagesUrls}
          imageUrlsQueue={localImagesUploadQueueUrls}
          localImageSize={localImageSize!}
        />
      ) : null}

      {!isUploading && localImages.length === 1 ? (
        <div className="w-full">
          <Image
            src={localImagesUrls[0]}
            alt="Uploaded Image"
            width={0}
            height={0}
            className="h-auto w-full rounded-3xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
          />
        </div>
      ) : null}

      {!isUploading && localImages.length > 1 ? (
        <UploadImageCarousel
          imageUrls={localImagesUrls}
          imageUrlsQueue={localImagesUploadQueueUrls}
          localImageSize={localImageSize!}
        />
      ) : null}
    </div>
  );
});

export default UploadImageDisplay;
