export default interface StoreImageService {
  upload: () => Promise<void>;
  delete: () => Promise<void>;
  get: () => Promise<void>;
}
