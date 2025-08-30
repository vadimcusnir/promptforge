export function uploadArtifacts(basePath: any, artifacts: any) { 
  return Promise.resolve({
    'prompt.txt': { url: 'mock-url-1', bytes: 1024 },
    'prompt.json': { url: 'mock-url-2', bytes: 2048 },
    'manifest.json': { url: 'mock-url-3', bytes: 512 }
  }); 
}
export function generateStoragePath(params: any) { return "mock-storage-path"; }
export function getContentType(filename: any) { return "application/octet-stream"; }
export function createZipArchive(artifacts: any) { return Promise.resolve(Buffer.from("mock-zip-content")); }
export function validateStorageConfig() { return true; }
