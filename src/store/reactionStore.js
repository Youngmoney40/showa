import { create } from 'zustand';

export const useReactionStore = create((set) => ({
  reactions: {},
  reactionCounts: {},
  setReaction: (postId, reactionType) =>
    set((state) => ({
      reactions: { ...state.reactions, [postId]: reactionType },
    })),
  setReactionCounts: (postId, counts) =>
    set((state) => ({
      reactionCounts: { ...state.reactionCounts, [postId]: counts },
    })),
}));
