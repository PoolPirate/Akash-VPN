export * from './lease';
export interface LeaseStatus {
  services: {
    [name: string]: {
      name: string;
      uris: string[];
    };
  };
}
