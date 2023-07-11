import PackagistApi from '@agonyz/packagist-api-client';
import {
  Maintainer,
  Package,
  PackageDownloadStats,
  PackagesByOrganization,
} from '@agonyz/packagist-api-client/lib/interfaces';
import { SortedPackage } from '../interfaces/packagist.interface';
import { LoggerService } from './logger.service';

export class PackagistService {
  private client: PackagistApi;
  private loggerService: LoggerService;

  constructor() {
    this.client = new PackagistApi(
      'https://github.com/agonyz/github-readme-packagist-stats - email: agonyz@outlook.de'
    );
    this.loggerService = LoggerService.getInstance();
  }

  /**
   *
   * @param vendor
   * @param maintainer
   */
  async getPackagistData(
    vendor: string,
    maintainer: string | null
  ): Promise<Package[] | null> {
    // get packages by vendor
    let packages;
    try {
      packages = await this.client.getPackagesByOrganization(vendor);
      if (!packages || packages.packageNames.length <= 0) {
        return null;
      }
    } catch (error) {
      this.loggerService.logError(error);
      return null;
    }

    // get maintainer top bundles if maintainer is set
    if (maintainer) {
      const maintainerBundles: Package[] | null =
        await this.getMaintainerBundles(packages, maintainer);
      return maintainerBundles?.slice(0, 3) ?? null;
    }

    // sort packages by total download stats and only keep the 3 top packages
    const sortedPackages = await this.getSortedPackages(packages);

    if (sortedPackages) {
      const topPackages = sortedPackages.slice(0, 3);
      return this.getDetailPackageData(topPackages);
    }
    return null;
  }

  /**
   * sort packages by total download stats
   * @param packages
   */
  private async getSortedPackages(
    packages: PackagesByOrganization
  ): Promise<SortedPackage[] | null> {
    try {
      const sortedPackages: SortedPackage[] = await Promise.all(
        packages.packageNames.map(async (packageName: string) => {
          const result: PackageDownloadStats =
            await this.client.getPackageDownloadStats(packageName);

          return {
            packageName: packageName,
            downloadStats: result,
          };
        })
      );

      sortedPackages.sort((a: SortedPackage, b: SortedPackage) => {
        return (
          Number(b.downloadStats.downloads.total) -
          Number(a.downloadStats.downloads.total)
        );
      });

      return sortedPackages;
    } catch (error) {
      this.loggerService.logError(error);
      return null;
    }
  }

  /**
   * get detail information for the top packages
   * @param packages
   */
  private async getDetailPackageData(
    packages: SortedPackage[]
  ): Promise<Package[] | null> {
    try {
      return await Promise.all(
        packages.map(async (sortedPackage: SortedPackage) => {
          return await this.client.getPackageInfo(sortedPackage.packageName);
        })
      );
    } catch (error) {
      this.loggerService.logError(error);
      return null;
    }
  }

  private async getMaintainerBundles(
    organizationPackages: PackagesByOrganization,
    maintainer: string
  ): Promise<Package[] | null> {
    try {
      const packageNames: string[] = organizationPackages.packageNames;
      const packageDetails: (Package | null)[] = await Promise.all(
        packageNames.map(async (packageName: string) => {
          try {
            return await this.client.getPackageInfo(packageName);
          } catch (error) {
            this.loggerService.logError(error);
            return null;
          }
        })
      );

      const maintainerPackages: Package[] = packageDetails
        .filter(
          (packageDetail: Package | null): packageDetail is Package =>
            packageDetail !== null
        )
        .filter((packageDetail: Package): packageDetail is Package => {
          return packageDetail.package.maintainers.some(
            (packageMaintainer: Maintainer) => {
              return packageMaintainer.name === maintainer;
            }
          );
        })
        .map((packageDetail: Package): Package => packageDetail);

      maintainerPackages.sort((a: Package, b: Package) => {
        const totalDownloadsA: number = a.package.downloads.total;
        const totalDownloadsB: number = b.package.downloads.total;

        if (totalDownloadsA < totalDownloadsB) {
          return 1;
        } else if (totalDownloadsA > totalDownloadsB) {
          return -1;
        } else {
          return 0;
        }
      });

      if (!maintainerPackages || maintainerPackages.length <= 0) {
        return null;
      }

      return maintainerPackages;
    } catch (error) {
      this.loggerService.logError(error);
      return null;
    }
  }
}
