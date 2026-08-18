import { ConnectionCancelledError } from "@/shared/api";

import type { ProgressChannel, ProgressRepository } from "../api/types";

import { useProgressStore } from "./store.zustand";
import type { ProgressState } from "./types";

export function createProgressService({
  progressRepository,
  progressChannel,
}: {
  progressRepository: ProgressRepository;
  progressChannel: ProgressChannel;
}) {
  let unsubscribe: (() => void) | null = null;
  const useProgress = (): ProgressState | null => useProgressStore((state) => state.progress);
  const useCompetition = () => useProgressStore((state) => state.progress?.competition ?? null);
  const useDivision = () => useProgressStore((state) => state.progress?.division ?? null);
  const useRunner = () => useProgressStore((state) => state.progress?.runner ?? null);
  const useNextRunners = () => useProgressStore((state) => state.progress?.nextRunners ?? null);
  const useTopRecords = () => useProgressStore((state) => state.progress?.topRecords ?? null);

  return {
    load: {
      byDivision: async (divisionId: string): Promise<ProgressState> => {
        const progress = await progressRepository.getProgress(divisionId);
        useProgressStore.getState().setProgress(progress);
        return progress;
      },
    },
    admin: {
      openDivision: (divisionId: string) => progressRepository.openProgressDivision(divisionId),
      closeDivision: (divisionId: string) => progressRepository.closeProgressDivision(divisionId),
      resetDivision: (divisionId: string) => progressRepository.resetProgressDivision(divisionId),
      postponeCurrentRunner: (divisionId: string) => progressRepository.postponeCurrentRunner(divisionId),
      setCurrentRunner: (divisionId: string, participantId: string) =>
        progressRepository.setCurrentRunner(divisionId, participantId),
    },
    connection: {
      connect: async (divisionId: string): Promise<void> => {
        unsubscribe?.();
        const subscription = progressChannel.subscribe((progress) => useProgressStore.getState().setProgress(progress));
        unsubscribe = subscription;
        try {
          await progressChannel.connect(divisionId);
        } catch (error) {
          if (unsubscribe === subscription) {
            subscription();
            unsubscribe = null;
          }
          if (error instanceof ConnectionCancelledError) return;
          throw error;
        }
      },
      disconnect: async (): Promise<void> => {
        unsubscribe?.();
        unsubscribe = null;
        await progressChannel.disconnect();
        if (unsubscribe === null) useProgressStore.getState().reset();
      },
    },
    use: {
      progress: useProgress,
      competition: useCompetition,
      division: useDivision,
      runner: useRunner,
      nextRunners: useNextRunners,
      topRecords: useTopRecords,
    },
  };
}
