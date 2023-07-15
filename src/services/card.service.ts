import { Package } from '@agonyz/packagist-api-client/lib/interfaces';
const { createSVGWindow } = require('svgdom');
const d3 = require('d3-node');
import { ThemeService } from './theme.service';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class CardService {
  createCard(
    bundles: Package[],
    vendor: string,
    maintainer: string | null,
    theme: string | null
  ): string {
    // if maintainer is set, replace the vendor
    if (maintainer) {
      vendor = maintainer;
    }
    const window = createSVGWindow();
    const document = window.document;
    const svgWidth = 450;
    const svgHeight = this.getCardHeight(bundles.length);
    const d3n = new d3({ window, document });
    const svg = d3n.createSVG(svgWidth, svgHeight);

    // add theme
    svg.append('style').text(ThemeService.getStyleContent(theme));

    // create main card
    this.createMainCard(svg, svgHeight, svgWidth);

    // add vendor/maintainer
    this.addVendor(svg, vendor);

    // add bundle cards
    let startY = 80;
    bundles.map((bundle: Package): void => {
      this.addBundleCard(svg, bundle, startY);
      startY += 70;
    });

    return d3n.svgString();
  }

  /**
   * determines the card height by the number of bundles
   * @param bundleCount
   */
  private getCardHeight(bundleCount: number): number {
    switch (bundleCount) {
      case 1:
        return 170;
      case 2:
        return 235;
      default:
        return 300;
    }
  }

  /**
   * create the main card
   * @param svg
   * @param cardHeight
   * @param cardWidth
   * @private
   */
  private createMainCard(
    svg: any,
    cardHeight: number,
    cardWidth: number
  ): void {
    svg
      .append('rect')
      .attr('width', cardWidth)
      .attr('height', cardHeight)
      .attr('id', 'rect');
  }

  /**
   * add the vendor information
   * @param svg
   * @param vendor
   * @private
   */
  private addVendor(svg: any, vendor: string): void {
    const vendorHeadline: string = vendor + "'s Packagist Stats";
    const vendorLink: string = 'https://packagist.org/users/' + vendor;
    svg
      .append('text')
      .attr('x', 40)
      .attr('y', 35)
      .attr('id', 'name')
      .text(vendorHeadline);
    const packagistLink = svg
      .append('a')
      .attr('href', vendorLink)
      .attr('target', '_blank');
    const packagistLinkText = svg
      .append('text')
      .attr('x', 40)
      .attr('y', 65)
      .attr('id', 'packagist-link')
      .text(vendorLink);
    packagistLink.append(() => packagistLinkText.node().cloneNode(true));
    packagistLinkText.remove();
  }

  /**
   * adds a bundle card
   * @param svg
   * @param bundle
   * @param startY
   * @private
   */
  private addBundleCard(svg: any, bundle: Package, startY: number): void {
    const mainGroup = svg.append('g').attr('class', 'card');
    const bundleCard = svg
      .append('rect')
      .attr('width', 390)
      .attr('height', 55)
      .attr('x', 30)
      .attr('y', startY)
      .attr('class', 'bundle-card');
    const bundleName = svg
      .append('text')
      .attr('x', 40)
      .attr('y', startY + 20)
      .attr('class', 'bundle-name')
      .text(bundle.package.name);
    const bundleLink = svg
      .append('a')
      .attr('href', bundle.package.repository)
      .attr('target', '_blank');
    const bundleDescription = svg
      .append('text')
      .attr('x', 40)
      .attr('y', startY + 40)
      .attr('class', 'bundle-description')
      .text(this.trimBundleDescription(bundle.package.description));
    const language = svg
      .append('text')
      .attr('x', this.determineLanguagePosition(bundle.package.language))
      .attr('y', startY + 20)
      .attr('class', 'bundle-language')
      .text(bundle.package.language);
    const upLineGroup = svg.append('g').attr('class', 'up-line');
    const downLineGroup = svg.append('g').attr('class', 'down-line');

    const downloadIcon = svg
      .append('path')
      .attr(
        'd',
        'M27.414 19.414l-10 10c-0.781 0.781-2.047 0.781-2.828 0l-10-10c-0.781-0.781-0.781-2.047 0-2.828s2.047-0.781 2.828 0l6.586 6.586v-19.172c0-1.105 0.895-2 2-2s2 0.895 2 2v19.172l6.586-6.586c0.39-0.39 0.902-0.586 1.414-0.586s1.024 0.195 1.414 0.586c0.781 0.781 0.781 2.047 0 2.828z'
      )
      .attr('class', 'download-icon')
      .attr('transform', `translate(368, ${startY + 8}), scale(0.40)`);
    const starIcon = svg
      .append('path')
      .attr(
        'd',
        'M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z'
      )
      .attr('class', 'star-icon')
      .attr('transform', `translate(368, ${startY + 28}), scale(0.40)`);
    const downloads = svg
      .append('text')
      .attr('x', 383)
      .attr('y', startY + 20)
      .attr('class', 'bundle-downloads')
      .text(this.numberFormatHelper(bundle.package.downloads.total));
    const stars = svg
      .append('text')
      .attr('x', 383)
      .attr('y', startY + 40)
      .attr('class', 'bundle-stars')
      .text(this.numberFormatHelper(bundle.package.github_stars));
    // generate upper line group
    bundleLink.append(() => bundleName.node().cloneNode(true));
    upLineGroup.append(() => bundleLink.node().cloneNode(true));
    upLineGroup.append(() => language.node().cloneNode(true));
    upLineGroup.append(() => downloadIcon.node().cloneNode(true));
    upLineGroup.append(() => downloads.node().cloneNode(true));

    // generate lower line group
    downLineGroup.append(() => bundleDescription.node().cloneNode(true));
    downLineGroup.append(() => starIcon.node().cloneNode(true));
    downLineGroup.append(() => stars.node().cloneNode(true));

    // generate bundle card group
    mainGroup.append(() => bundleCard.node().cloneNode(true));
    mainGroup.append(() => upLineGroup.node().cloneNode(true));
    mainGroup.append(() => downLineGroup.node().cloneNode(true));

    svg.append(() => mainGroup.node().cloneNode(true));
  }

  /**
   * helper function to trim the bundle description
   * @param description
   */
  private trimBundleDescription(description?: string): string {
    if (!description || description.length <= 0) {
      return '';
    }

    // Allow only ASCII characters
    /* eslint-disable no-control-regex */
    description = description.replace(/[\x00-\x1F\x80-\xFF]/g, '');
    if (description.length < 50) {
      return description;
    }
    return `${description.substring(0, 50)} ..`;
  }

  /**
   * helper function to format numbers
   * @param downloads
   * @param precision
   */
  private numberFormatHelper(downloads: number, precision = 0): string {
    const suffixes: string[] = ['', 'K', 'M', 'B', 'T'];
    let index = 0;

    while (downloads >= 1000 && index < suffixes.length - 1) {
      downloads /= 1000;
      index++;
    }

    let formattedNumber: string;
    if (downloads >= 1000000) {
      formattedNumber = downloads.toFixed(precision);
      // Remove trailing zeros from decimal portion
      formattedNumber = formattedNumber.replace(/\.?0+$/, '');
    } else {
      formattedNumber = downloads.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
    }

    formattedNumber += suffixes[index]; // Add the appropriate suffix

    return formattedNumber;
  }

  /**
   * helper function to determine language text position
   * @param language
   */
  private determineLanguagePosition(language: string): number {
    if (language === 'JavaScript') {
      return 300;
    }
    return 335;
  }
}
