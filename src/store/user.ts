import { defineStore } from "pinia";
import { ref } from "vue";

import type {
  UserData,
  Best50SongsData,
  CommonUserStatsData,
} from "@/utils/api/types";

export const useUserStore = defineStore("user", () => {
  const username = ref("");

  const userData = ref<UserData | null>(null);

  const best50SongsData = ref<Best50SongsData | null>(null);

  const commonUserStatsData = ref<CommonUserStatsData>({
    b15sum: 0,
    b35sum: 0,
  });

  const isLoading = ref(false);

  const fullscreenLoading = ref(false);

  return {
    username,
    userData,
    commonUserStatsData,
    best50SongsData,
    fullscreenLoading,
    isLoading,
  };
});
