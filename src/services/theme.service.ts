import * as themes from '../themes';
import { Theme, ThemeMap } from '../interfaces/theme.interface';

export class ThemeService {
  static getStyleContent(theme: string | null): string {
    const themeMap: ThemeMap = {};
    Object.keys(themes).forEach((key: string) => {
      const themeModule = (themes as { [key: string]: Theme })[key];
      themeMap[themeModule.name] = {
        name: themeModule.name,
        styleContent: themeModule.styleContent,
      };
    });
    const selectedTheme = theme ? themeMap[theme] : null;

    if (selectedTheme) {
      return selectedTheme.styleContent;
    } else {
      console.error(`Styles not found for theme '${theme}'.`);
      return themeMap['light'].styleContent;
    }
  }
}
