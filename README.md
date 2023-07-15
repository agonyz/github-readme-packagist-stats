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
- [Themes](#themes)
  - [Add own themes](#add-own-themes)
- [Skip Bundles](#skip-bundles)
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

## Themes
You can use different themes for the cards
- How to use: 
  ```markdown
  /api/packagist/card?vendor={your-packagist-user}&theme=dark
  ```
- Example:
  ```markdown
  ![Packagist Top Bundles](https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor=agonyz&theme=dark)
  ```
  ![Packagist Top Bundles](https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor=agonyz&theme=dark)

### Add own themes
To add your own themes, do the following:
- Navigate to the theme directory `src/themes/`
- Create a theme file e.g. `dark.ts`
- Place your styles inside the theme file and export your theme
- Create a pull request e.g. `feature/add-theme-{theme-name}`

## Skip Bundles
You can skip bundles you don't want to display
- How to use:
  ```markdown
  /api/packagist/card?vendor={your-packagist-user}&skip={bundle-name1, bundle-name2, ..}
  ```
- Example:
  ```markdown
  ![Packagist Top Bundles](https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor=agonyz&skip=contao-countdown-bundle,contao-page-speed-insights-bundle)
  ```
  ![Packagist Top Bundles](https://github-readme-packagist-stats.vercel.app/api/packagist/card?vendor=agonyz&skip=contao-countdown-bundle,contao-page-speed-insights-bundle)


## Caching
- In order to not overuse the packagist api a cache time of `12 hours` was implemented.