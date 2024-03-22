/* eslint-disable jsx-a11y/alt-text */
"use client";

import UserAvatar from "./UserAvatar";
import { User } from "@prisma/client";
import {
  CalendarClock,
  Earth,
  Image as LucideImage,
  ListTodo,
  MapPin,
  Smile,
} from "lucide-react";
import { createContext, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Separator } from "./ui/separator";
import { Button, buttonVariants } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { PostCreationRequest } from "@/lib/validators/post";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { generateMimeTypes } from "uploadthing/client";
import UploadImageDisplay from "./UploadImageDisplay";
import { useRouter } from "next/navigation";
interface MiniCreatePostProps {
  user: Pick<User, "name" | "image">;
}

interface Size {
  width: number;
  height: number;
}

type onDelete = (index: number) => void;

export const OnDeleteImageContext = createContext<onDelete>(() => {});

const MiniCreatePost = ({ user }: MiniCreatePostProps) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState<Array<string>>([]);
  const [localImages, setLocalImages] = useState<Array<File>>([]);
  const [localImagesUploadQueue, setLocalImagesUploadQueue] = useState<
    Array<File>
  >([]);
  const [localImageSize, setLocalImageSize] = useState<Size | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const onDeleteImage = (index: number) => {
    setLocalImages(localImages.filter((_, idx) => index !== idx));
    setImages(images.filter((_, idx) => index !== idx));
  };

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async ({
      content,
      quoteToId,
      replyToId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        content,
        quoteToId,
        replyToId,
      };

      const { data } = await axios.post("/api/post/create", payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Your post was not published, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setText("");
      setImages([]);
      setLocalImages([]);
      setLocalImagesUploadQueue([]);
      setLocalImageSize(null);
      router.refresh();

      return toast({
        title: "Success",
        description: "Your post has been published",
      });
    },
  });

  const handleOnPost = () => {
    createPost({
      content: {
        text,
        images,
      },
    });
  };

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: (imgs) => {
        setLocalImages((prev) => [...prev, ...localImagesUploadQueue]);
        setLocalImagesUploadQueue([]);
        setImages((prev) => [...prev, ...imgs.map((img) => img.url)]);

        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
      },
      onUploadError: (error) => {
        return toast({
          title: "Something went wrong",
          description: "Your image was not uploaded",
          variant: "destructive",
        });
      },
    },
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  return (
    <div className="flex w-full items-start border-b px-4 py-3">
      <UserAvatar user={user} className="mr-1" />
      <div className="flex w-full flex-col pt-1.5">
        <TextareaAutosize
          value={text}
          placeholder="What is happening?!"
          onChange={(e) => setText(e.target.value)}
          className="flex min-h-[40px] w-full resize-none rounded-md bg-background px-2 text-xl outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        <OnDeleteImageContext.Provider value={onDeleteImage}>
          <UploadImageDisplay
            isUploading={isUploading}
            localImageSize={localImageSize}
            localImages={localImages}
            localImagesUploadQueue={localImagesUploadQueue}
          />
        </OnDeleteImageContext.Provider>

        <Button
          className="w-fit px-2 font-medium text-blue-500 hover:text-blue-500"
          variant={"ghost"}
          size={"sm"}
        >
          <Earth className="mr-1 h-4 w-4 text-sm" />
          Everyone can reply
        </Button>
        <Separator className="my-3" />
        <div className="flex items-center">
          <label
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
              className: "cursor-pointer text-blue-500",
            })}
          >
            <input
              className="hidden"
              type="file"
              multiple={true}
              accept={generateMimeTypes(fileTypes ?? [])?.join(", ")}
              onChange={async (e) => {
                if (!e.target.files) return;
                setLocalImagesUploadQueue([...e.target.files]);

                if (e.target.files.length) {
                  const image = e.target.files[0];
                  const bmp = await createImageBitmap(image);
                  const { width, height } = bmp;
                  setLocalImageSize({ width, height });
                  bmp.close();
                }

                startUpload(Array.from(e.target.files));
              }}
              ref={imageInputRef}
            />
            <LucideImage className="h-4 w-4" />
          </label>
          <Button variant="ghost" size="icon" className="text-blue-500">
            <ListTodo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-blue-500">
            <Smile className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-blue-500">
            <CalendarClock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-blue-500">
            <MapPin className="h-4 w-4" />
          </Button>
          <div className="flex-grow"></div>
          <Button
            onClick={handleOnPost}
            isLoading={isPending}
            disabled={isUploading || (text.length === 0 && images.length === 0)}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MiniCreatePost;
