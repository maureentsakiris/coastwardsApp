export type ExifData = Record<string, unknown>;

export type UploadLocation = {
  latitude: number;
  longitude: number;
};

export type UploadDraft = {
  uri: string;
  location: UploadLocation;
  exif: ExifData;
  source?: string;
};

export type PendingGuidelinesAction = "camera" | "library";
