import { useCallback, useEffect, useState } from "react";
import {
  DAILY_MISSION_UPDATED_EVENT,
  getDailyMissionCompletedCount,
  getDailyMissionPrimaryCtaLabel,
  getDailyMissionProgressPercent,
  getNextIncompleteDailyMissionTask,
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
    window.addEventListener(DAILY_MISSION_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(DAILY_MISSION_UPDATED_EVENT, onUpdate);
  }, [refresh]);

  const completedCount = getDailyMissionCompletedCount(state);
  const total = 4;
  const nextTaskId = getNextIncompleteDailyMissionTask(state);
  const progressPercent = getDailyMissionProgressPercent(state);
  const primaryCtaLabel = getDailyMissionPrimaryCtaLabel(state);
  const allComplete = completedCount >= total;

  return {
    state,
    completedCount,
    total,
    nextTaskId,
    progressPercent,
    primaryCtaLabel,
    allComplete,
    refresh,
  };
}
