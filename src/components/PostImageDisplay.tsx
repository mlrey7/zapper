import Image from "next/image";
import React from "react";

interface PostImageDisplayProps {
  images: Array<string>;
}
const PostImageDisplay = ({ images }: PostImageDisplayProps) => {
  return (
    <div>
      {images.length === 1 && (
        <Image
          src={images[0]}
          alt="post embed"
          width={0}
          height={0}
          className="h-auto w-full rounded-3xl object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
        ></Image>
      )}

      {images.length === 2 && (
        <div className="grid grid-cols-2 overflow-hidden">
          <Image
            src={images[0]}
            alt="post embed"
            width={0}
            height={0}
            className="h-72 w-full rounded-l-3xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            key={images[0]}
          ></Image>

          <Image
            src={images[1]}
            alt="post embed"
            width={0}
            height={0}
            className="h-72 w-full rounded-r-3xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            key={images[1]}
          ></Image>
        </div>
      )}

      {images.length === 3 && (
        <div className="grid h-72 grid-cols-2 gap-1 overflow-hidden">
          <Image
            src={images[0]}
            alt="post embed"
            width={0}
            height={0}
            className="row-span-2 h-72 w-full rounded-l-3xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            key={images[0]}
          ></Image>

          <Image
            src={images[1]}
            alt="post embed"
            width={0}
            height={0}
            className="h-36 w-full rounded-tr-3xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            key={images[1]}
          ></Image>

          <Image
            src={images[2]}
            alt="post embed"
            width={0}
            height={0}
            className="h-36 w-full rounded-br-3xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            key={images[2]}
          ></Image>
        </div>
      )}

      {images.length === 4 && (
        <div className="grid h-72 grid-cols-2 gap-1 overflow-hidden">
          <Image
            src={images[0]}
            alt="post embed"
            width={0}
            height={0}
            className="h-36 w-full rounded-tl-3xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            key={images[0]}
          ></Image>

          <Image
            src={images[1]}
            alt="post embed"
            width={0}
            height={0}
            className="h-36 w-full rounded-tr-3xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            key={images[1]}
          ></Image>

          <Image
            src={images[2]}
            alt="post embed"
            width={0}
            height={0}
            className="h-36 w-full rounded-bl-3xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            key={images[2]}
          ></Image>

          <Image
            src={images[3]}
            alt="post embed"
            width={0}
            height={0}
            className="h-36 w-full rounded-br-3xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            key={images[3]}
          ></Image>
        </div>
      )}
    </div>
  );
};

export default PostImageDisplay;
