import { PackagesByOrganization } from '@agonyz/packagist-api-client/lib/interfaces';

export class BundleService {
  static skipBundles(
    skip: string,
    packages: PackagesByOrganization,
    vendor: string
  ): PackagesByOrganization | null {
    const bundlesToSkip = new Set(
      skip.split(',').map((bundle) => bundle.trim())
    );

    packages.packageNames = packages.packageNames
      .filter((bundle) => {
        const bundleName = bundle.replace(vendor + '/', '');
        return !bundlesToSkip.has(bundleName);
      })
      .map((bundle) => vendor + '/' + bundle.replace(vendor + '/', ''));

    if (packages.packageNames.length <= 0) {
      return null;
    }
    return packages;
  }
}
