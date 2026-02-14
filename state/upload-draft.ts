import type { UploadDraft } from "@/state/types";

let draft: UploadDraft | null = null;

export const setUploadDraft = (value: UploadDraft) => {
  draft = value;
};

export const consumeUploadDraft = () => {
  const currentDraft = draft;
  draft = null;
  return currentDraft;
};
