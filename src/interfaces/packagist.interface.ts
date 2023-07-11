import { PackageDownloadStats } from '@agonyz/packagist-api-client/lib/interfaces';

export interface SortedPackage {
  packageName: string;
  downloadStats: PackageDownloadStats;
}
