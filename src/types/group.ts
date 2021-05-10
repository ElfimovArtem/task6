export enum Permissions {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  UPLOAD_FILES = 'UPLOAD_FILES'
}

export type Group = {
  id: string;
  name: string;
  permissions: Permissions[];
}