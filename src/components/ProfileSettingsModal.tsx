"use client";
import { useRouter } from "next/navigation";
import { useClickOutside } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PrismaUserType, UserProfileValidator } from "@/lib/validators/user";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import { generateMimeTypes } from "uploadthing/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Icons } from "./Icons";
import { IftaInput } from "./IftaInput";

const ProfileSettingsModal = ({
  initialProfileSettings,
  userId,
}: {
  initialProfileSettings: PrismaUserType;
  userId: string;
}) => {
  const router = useRouter();
  const clickOutsideRef = useClickOutside(() => {
    router.back();
  });

  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [localCoverImage, setLocalCoverImage] = useState("");
  const [localImage, setLocalImage] = useState("");

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user", "settings", "profile", userId],
    queryFn: async () => {
      const data = await fetch(`/api/user/${userId}/profile`);
      const profile = await data.json();
      return UserProfileValidator.parse(profile);
    },
    initialData: initialProfileSettings,
  });

  const {
    handleSubmit,
    setValue: setFormValue,
    watch,
    control,
  } = useForm<PrismaUserType>({
    resolver: zodResolver(UserProfileValidator),
    defaultValues: user,
  });

  const { mutate: submitProfile } = useMutation({
    mutationFn: async (profile: PrismaUserType) => {
      return await fetch(`/api/user/${userId}/profile`, {
        body: JSON.stringify(profile),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(
        ["user", "settings", "profile", userId],
        await data.json(),
      );
      router.back();
    },
  });

  const onSubmit = (data: PrismaUserType) => {
    submitProfile(data);
  };

  const {
    startUpload: startCoverImageUpload,
    permittedFileInfo,
    isUploading: isCoverImageUploading,
  } = useUploadThing("coverImageUploader", {
    onClientUploadComplete: (imgs) => {
      if (imgs.length > 0) setFormValue("coverImage", imgs[0].url);

      if (coverImageInputRef.current) {
        coverImageInputRef.current.value = "";
      }
    },
    onUploadError: (error) => {
      return toast({
        title: "Something went wrong",
        description: "Your image was not uploaded",
        variant: "destructive",
      });
    },
  });

  const { startUpload: startImageUpload, isUploading: isImageUploading } =
    useUploadThing("imageUploader", {
      onClientUploadComplete: (imgs) => {
        if (imgs.length > 0) setFormValue("image", imgs[0].url);

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
    });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  return (
    <div
      className="relative mx-auto flex h-fit max-h-[600px] w-[600px] flex-col gap-2 overflow-y-scroll rounded-lg bg-background"
      ref={clickOutsideRef}
    >
      <div className="flex flex-col">
        <div className="flex items-center px-3 py-2">
          <Button
            aria-label="close modal"
            variant={"ghost"}
            className="h-6 w-6 rounded-md p-0"
            onClick={() => router.back()}
          >
            <X className="h-5 w-5" />
          </Button>
          <h2 className="pl-8 text-xl font-semibold">Edit Profile</h2>
          <div className="flex-1" />
          <Button
            type="submit"
            form="profileForm"
            disabled={isCoverImageUploading || isImageUploading}
            size={"sm"}
          >
            Save
          </Button>
        </div>
        <div className="relative min-h-0 w-full bg-gray-500 sm:h-[200px]">
          <div
            className={
              "absolute inset-0 flex items-center justify-center bg-background/30"
            }
          >
            {isCoverImageUploading ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : (
              <div className="flex gap-5">
                <label
                  className={buttonVariants({
                    variant: "roundImageOverlay",
                    size: "circle",
                    className: "cursor-pointer !rounded-full",
                  })}
                >
                  <input
                    className="hidden"
                    type="file"
                    multiple={true}
                    accept={generateMimeTypes(fileTypes ?? [])?.join(", ")}
                    onChange={async (e) => {
                      if (!e.target.files?.length) return;

                      setLocalCoverImage(
                        URL.createObjectURL(e.target.files[0]),
                      );
                      startCoverImageUpload(Array.from(e.target.files));
                    }}
                    ref={coverImageInputRef}
                  />
                  <ImagePlus className="h-5 w-5 text-white" />
                </label>
                {(!!localCoverImage || !!watch("coverImage")) && (
                  <Button
                    variant={"roundImageOverlay"}
                    size={"circle"}
                    onClick={() => {
                      if (localCoverImage === "") {
                        setFormValue("coverImage", null);
                      } else {
                        setLocalCoverImage("");
                        setFormValue(
                          "coverImage",
                          initialProfileSettings.coverImage,
                        );
                      }
                    }}
                  >
                    <X className="h-5 w-5 text-white" />
                  </Button>
                )}
              </div>
            )}
          </div>
          {(!!localCoverImage || !!watch("coverImage")) && (
            <Image
              alt="cover image"
              src={
                localCoverImage === ""
                  ? watch("coverImage") ?? ""
                  : localCoverImage
              }
              height={0}
              width={0}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
              className="h-full w-full object-cover"
            />
          )}

          <Avatar className="absolute -bottom-14 left-4 h-28 w-28 border-4 border-background">
            {!!localImage || !!watch("image") ? (
              <AvatarImage
                src={localImage === "" ? watch("image") ?? "" : localImage}
                referrerPolicy="no-referrer"
              />
            ) : (
              <AvatarFallback>
                <span className="sr-only">{watch("name")}</span>
                <Icons.user />
              </AvatarFallback>
            )}

            <div
              className={
                "absolute inset-0 flex items-center justify-center bg-background/30"
              }
            >
              {isImageUploading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <label
                  className={buttonVariants({
                    variant: "roundImageOverlay",
                    size: "circle",
                    className: "cursor-pointer !rounded-full",
                  })}
                >
                  <input
                    className="hidden"
                    type="file"
                    multiple={true}
                    accept={generateMimeTypes(fileTypes ?? [])?.join(", ")}
                    onChange={async (e) => {
                      if (!e.target.files?.length) return;

                      setLocalImage(URL.createObjectURL(e.target.files[0]));
                      startImageUpload(Array.from(e.target.files));
                    }}
                    ref={imageInputRef}
                  />
                  <ImagePlus className="h-5 w-5 text-white" />
                </label>
              )}
            </div>
          </Avatar>
        </div>
        <div className="flex h-full w-full flex-1 flex-col px-4 py-3 pb-16">
          <form
            className="mt-14 flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            id="profileForm"
            autoComplete="off"
          >
            <Controller
              control={control}
              name="name"
              render={({ field }) => <IftaInput label="Name" {...field} />}
            />
            <Controller
              control={control}
              name="bio"
              render={({ field }) => <IftaInput label="Bio" {...field} />}
            />
            <Controller
              control={control}
              name="location"
              render={({ field }) => <IftaInput label="Location" {...field} />}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsModal;
