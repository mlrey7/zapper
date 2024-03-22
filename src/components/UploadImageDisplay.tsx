import Image from "next/image";
import LoadingImage from "./LoadingImage";
import UploadImageCarousel from "./UploadImageCarousel";
import { memo, useContext } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { OnDeleteImageContext } from "./MiniCreatePost";

interface UploadImageDisplayProps {
  isUploading: boolean;
  localImageSize: { width: number; height: number } | null;
  localImagesUploadQueue: Array<File>;
  localImages: Array<File>;
}

const UploadImageDisplay = memo(function UploadImageD({
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

  const onDeleteImage = useContext(OnDeleteImageContext);

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
        <div className="relative w-full">
          <Button
            className="absolute right-2 top-2 rounded-full bg-gray-800/80 hover:bg-gray-600/80"
            size={"icon"}
            onClick={() => onDeleteImage(0)}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
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
