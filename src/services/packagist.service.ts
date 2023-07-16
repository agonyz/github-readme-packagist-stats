import PackagistApi from '@agonyz/packagist-api-client';
import {
  Maintainer,
  Package,
  PackagesByOrganization,
} from '@agonyz/packagist-api-client/lib/interfaces';
import { LoggerService } from './logger.service';
import { BundleService } from './bundle.service';

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
   * @param vendor
   * @param maintainer
   * @param skip
   */
  async getPackagistData(
    vendor: string,
    maintainer: string | null,
    skip: string | null
  ): Promise<Package[] | null> {
    try {
      let packages = await this.getPackagesByVendor(vendor);
      if (!packages || packages.packageNames.length === 0) {
        return null;
      }

      if (skip) {
        const filteredPackages = BundleService.skipBundles(
          skip,
          packages,
          vendor
        );
        if (!filteredPackages) {
          return null;
        }
        packages = filteredPackages;
      }

      let detailedPackages = await this.getDetailPackageData(packages);
      if (!detailedPackages) {
        return null;
      }

      if (maintainer) {
        detailedPackages = this.getMaintainerBundles(
          detailedPackages,
          maintainer
        );
        if (!detailedPackages) {
          return null;
        }
      }

      return this.getTopPackagesByDownloads(detailedPackages, 3);
    } catch (error) {
      this.loggerService.logError(error);
      return null;
    }
  }

  /**
   * @param vendor
   * @private
   */
  private async getPackagesByVendor(
    vendor: string
  ): Promise<PackagesByOrganization | null> {
    try {
      const packages: PackagesByOrganization =
        await this.client.getPackagesByOrganization(vendor);
      return packages && packages.packageNames.length > 0 ? packages : null;
    } catch (error) {
      this.loggerService.logError(error);
      return null;
    }
  }

  /**
   * @param packages
   * @private
   */
  private async getDetailPackageData(
    packages: PackagesByOrganization
  ): Promise<Package[] | null> {
    try {
      return await Promise.all(
        packages.packageNames.map(async (packageName: string) => {
          return await this.client.getPackageInfo(packageName);
        })
      );
    } catch (error) {
      this.loggerService.logError(error);
      return null;
    }
  }

  /**
   * @param packages
   * @param maintainer
   * @private
   */
  private getMaintainerBundles(
    packages: Package[],
    maintainer: string
  ): Package[] | null {
    const maintainerPackages = packages.filter((pkg: Package) =>
      pkg.package.maintainers.some((pkgMaintainer: Maintainer) =>
        pkgMaintainer.name.includes(maintainer)
      )
    );
    return maintainerPackages.length > 0 ? maintainerPackages : null;
  }

  /**
   * @param packages
   * @param count
   * @private
   */
  private getTopPackagesByDownloads(
    packages: Package[],
    count: number
  ): Package[] {
    return packages
      .sort(
        (a: Package, b: Package) =>
          b.package.downloads.total - a.package.downloads.total
      )
      .slice(0, count);
  }
}
