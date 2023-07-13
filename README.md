<div align="center">
  <img alt="Packagist Logo" src="docs/packagist.svg" width="100" align="center">
  <h1>GitHub Readme Packagist Stats</h1>

[![Badge](https://img.shields.io/github/issues/agonyz/github-readme-packagist-stats?style=for-the-badge)](https://github.com/agonyz/github-readme-packagist-stats/issues)
[![Badge](https://img.shields.io/github/issues-pr/agonyz/github-readme-packagist-stats?style=for-the-badge)](https://github.com/agonyz/github-readme-packagist-stats/pulls)
[![Badge](https://img.shields.io/github/stars/agonyz/github-readme-packagist-stats?style=for-the-badge)](https://github.com/agonyz/github-readme-packagist-stats/stargazers)

</div>

<p align="center">
  Dynamically generated statistics of your Packagist Bundles for your GitHub README
</p>


## Features
- [Top bundles](#top-bundles)
  - [By vendor](#by-vendor)
  - [By maintainer](#by-maintainer)
- [Caching](#caching)

## Top bundles
### By vendor
Retrieves the top bundles for the given vendor
- How to use:
  ```markdown
  /api/packagist/card?vendor={your-packagist-user}
  ```
- Example:
  ```markdown
  ![Packagist Top Bundles](https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor=agonyz)
  ```
  ![Packagist Top Bundles](https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor=agonyz)

### By maintainer
Retrieves the top bundles for the given maintainer from the given vendor
- How to use:
  ```markdown
  /api/packagist/card?vendor={your-example-organization}&maintainer={your-packagist-user}
  ```
- Example:
  ```markdown
  ![Packagist Top Bundles](https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor=exampleOrganization&maintainer=agonyz)
  ```

## Caching
- In order to not overuse the packagist api a cache time of `12 hours` was implemented.