import { useCallback, useEffect, useState } from "react";
import {
  DAILY_MISSION_CORE_TASK_ORDER,
  DAILY_MISSION_STORAGE_KEY,
  DAILY_MISSION_UPDATED_EVENT,
  getCoreMissionCompletedCount,
  getCoreProgressLabel,
  getDailyMissionPrimaryCtaLabel,
  getCoreMissionProgressPercent,
  getMissionStatusHeadline,
  getNextIncompleteCoreTask,
  isDailyGoalAchieved,
  isFullMissionAchieved,
  isOptionalJobUpdateChecked,
  readDailyMissionState,
  type DailyMissionState,
} from "@/lib/dailyMission";

export function useDailyMission() {
  const [state, setState] = useState<DailyMissionState>(() => readDailyMissionState());

  const refresh = useCallback(() => {
    setState(readDailyMissionState());
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    const onStorage = (event: StorageEvent) => {
      if (event.key === DAILY_MISSION_STORAGE_KEY) refresh();
    };
    window.addEventListener(DAILY_MISSION_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(DAILY_MISSION_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const coreCompletedCount = getCoreMissionCompletedCount(state);
  const coreTotal = DAILY_MISSION_CORE_TASK_ORDER.length;
  const nextTaskId = getNextIncompleteCoreTask(state);
  const progressPercent = getCoreMissionProgressPercent(state);
  const primaryCtaLabel = getDailyMissionPrimaryCtaLabel(state);
  const fullMissionComplete = isFullMissionAchieved(state);
  const dailyGoalAchieved = isDailyGoalAchieved(state);
  const statusHeadline = getMissionStatusHeadline(state);
  const coreProgressLabel = getCoreProgressLabel(state);
  const jobUpdateChecked = isOptionalJobUpdateChecked(state);

  return {
    state,
    coreCompletedCount,
    /** @deprecated Prefer coreCompletedCount */
    completedCount: coreCompletedCount,
    coreTotal,
    /** @deprecated Prefer coreTotal */
    total: coreTotal,
    nextTaskId,
    progressPercent,
    primaryCtaLabel,
    fullMissionComplete,
    /** @deprecated Prefer fullMissionComplete */
    allComplete: fullMissionComplete,
    dailyGoalAchieved,
    statusHeadline,
    coreProgressLabel,
    jobUpdateChecked,
    refresh,
  };
}
