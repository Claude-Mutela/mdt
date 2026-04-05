
export type MediaType = 'video' | 'image' | 'audio' | 'document';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  category: string;
  date: string;
  duration?: string;
  thumbnail: string;
  url: string;
  description?: string;
  speaker?: string;
  size?: string; // Pour les documents
}

export interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban?: string;
  swift?: string;
  currency: string;
}
