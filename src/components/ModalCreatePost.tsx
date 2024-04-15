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
import { createContext, startTransition, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Separator } from "./ui/separator";
import { Button, buttonVariants } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  PostContentValidator,
  PostCreationRequest,
} from "@/lib/validators/post";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { generateMimeTypes } from "uploadthing/client";
import UploadImageDisplay from "./UploadImageDisplay";
import { useRouter } from "next/navigation";
import CloseModal from "./CloseModal";
import { useClickOutside } from "@mantine/hooks";
import { PostAndAuthor } from "@/types/db";
import { formatTimeToNow } from "@/lib/utils";
import EmbeddedPost from "./EmbeddedPost";

interface ModalCreatePostProps {
  user: Pick<User, "name" | "image">;
  replyToPost: PostAndAuthor | null;
  quotedPost: PostAndAuthor | null;
}

interface Size {
  width: number;
  height: number;
}

type onDelete = (index: number) => void;

export const OnDeleteImageContext = createContext<onDelete>(() => {});

const ModalCreatePost = ({
  user,
  replyToPost,
  quotedPost,
}: ModalCreatePostProps) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState<Array<string>>([]);
  const [localImages, setLocalImages] = useState<Array<File>>([]);
  const [localImagesUploadQueue, setLocalImagesUploadQueue] = useState<
    Array<File>
  >([]);
  const [localImageSize, setLocalImageSize] = useState<Size | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const replyToPostContent = PostContentValidator.safeParse(
    replyToPost?.content,
  );

  const onDeleteImage = (index: number) => {
    setLocalImages(localImages.filter((_, idx) => index !== idx));
    setImages(images.filter((_, idx) => index !== idx));
  };

  const clickOutsideRef = useClickOutside(() => {
    router.back();
  });

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
      router.back();
      startTransition(() => {
        router.refresh();
      });

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
      replyToId: replyToPost?.id,
      quoteToId: quotedPost?.id,
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
    <div
      className="relative mx-auto flex h-fit w-[600px] flex-col gap-2 rounded-lg bg-background px-3 py-3"
      ref={clickOutsideRef}
    >
      <CloseModal />
      <div className="flex w-full flex-col pt-1.5">
        {!!replyToPost && (
          <>
            <div className="relative flex items-start gap-3 before:absolute before:left-0 before:top-11 before:ml-[1.25rem] before:h-full before:-translate-x-1/2 before:self-start before:bg-gray-600 before:px-px">
              <UserAvatar user={replyToPost.author} />
              <div className="flex w-full flex-col overflow-hidden">
                <div className="flex items-center gap-1">
                  <h6 className="text-sm font-bold">
                    {replyToPost.author.name}
                  </h6>
                  <p className="text-sm text-gray-600">
                    @{replyToPost.author.username}
                  </p>
                  <span className="text-sm text-gray-600">•</span>
                  <p className="text-sm text-gray-600">
                    {formatTimeToNow(new Date(replyToPost.createdAt))}
                  </p>
                </div>
                <p className="w-full text-wrap break-words text-sm">
                  {replyToPostContent.success && (
                    <>
                      {replyToPostContent.data.text}
                      {replyToPostContent.data.images.length > 0 && <br />}
                      {replyToPostContent.data.images.join(" ")}
                    </>
                  )}
                </p>
              </div>
            </div>
            <p className="mb-6 ml-10 mt-3 pl-3 text-sm text-gray-600">
              Replying to{" "}
              <span className="text-blue-500">
                @{replyToPost.author.username}
              </span>
            </p>
          </>
        )}

        <div className="flex">
          <UserAvatar user={user} className="mr-1" />
          <TextareaAutosize
            value={text}
            placeholder={
              !!replyToPost
                ? "Post your reply"
                : !!quotedPost
                  ? "Add a comment"
                  : "What is happening?!"
            }
            minRows={!!quotedPost ? 2 : 4}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 flex min-h-[40px] w-full resize-none rounded-md bg-background pl-2 text-xl outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            name="post content"
          />
        </div>

        <OnDeleteImageContext.Provider value={onDeleteImage}>
          <UploadImageDisplay
            isUploading={isUploading}
            localImageSize={localImageSize}
            localImages={localImages}
            localImagesUploadQueue={localImagesUploadQueue}
          />
        </OnDeleteImageContext.Provider>
        {!!quotedPost && (
          <div className="flex w-full gap-2">
            <div className="w-10" />
            <EmbeddedPost embeddedPost={quotedPost} className="ml-2 w-full" />
          </div>
        )}
        {!replyToPost && (
          <>
            <Button
              className="w-fit px-2 font-medium text-blue-500 hover:text-blue-500"
              variant={"ghost"}
              size={"sm"}
            >
              <Earth className="mr-1 h-4 w-4 text-sm" />
              Everyone can reply
            </Button>
            <Separator className="my-3" />
          </>
        )}

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
            {!!replyToPost ? "Reply" : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreatePost;
