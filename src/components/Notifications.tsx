import { toast } from "sonner";

export const showLevelUpNotification = (level: number) => {
  toast.success(`تهانينا! وصلت للمستوى ${level}`, {
    description: "استمر في التقدم!",
    duration: 4000,
  });
};

export const showBadgeUnlockNotification = (badgeName: string, badgeDescription: string) => {
  toast.success(`حصلت على شارة جديدة: ${badgeName}`, {
    description: badgeDescription,
    duration: 4000,
  });
};
