import ProfileSettingsModal from "@/components/ProfileSettingsModal";
import { getAuthUserProfile } from "@/controllers/userController";
import { getAuthSession } from "@/lib/auth";
import React from "react";

const Page = async () => {
  const userProfile = await getAuthUserProfile();
  const session = await getAuthSession();

  if (!session) return null;
  if (!userProfile) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-600/30">
      <div className="container mx-auto flex h-full w-full pt-12">
        <ProfileSettingsModal
          initialProfileSettings={userProfile}
          userId={session.user.id}
        />
      </div>
    </div>
  );
};

export default Page;
