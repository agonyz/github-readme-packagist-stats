## GitHub Readme Packagist Stats
Get dynamically generated stats for your top packagist bundles

## Features
- [Top bundles](#top-bundles)
  - [By vendor](#by-vendor)
  - [By maintainer](#by-maintainer)
- [Caching](#caching)

## Top bundles
### By vendor
- Retrieves the top bundles for the given vendor
- How to use:
  - https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor={your-packagist-user}
- Example:
  ```markdown
  ![Packagist Top Bundles](https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor=agonyz)
  ```
  ![Packagist Top Bundles](https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor=agonyz)

### By maintainer
- Retrieves the top bundles for the given maintainer from the given vendor
- How to use:
  - https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor={your-example-organization}&maintainer={your-packagist-user}
- Example:
  ```markdown
  ![Packagist Top Bundles](https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor={your-example-organization}&maintainer={your-packagist-user})
  ```
  
## Caching
- In order to not overuse the packagist api a cache time of `12 hours` was implemented.