import { lightTheme, darkTheme } from '../themes';

export class ThemeService {
  static getStyleContent(theme: string | null): string {
    let styleContent: string;
    switch (theme) {
      case 'light':
        styleContent = lightTheme;
        break;
      case 'dark':
        styleContent = darkTheme;
        break;
      default:
        console.error(`Styles not found for theme '${theme}'.`);
        return lightTheme;
    }
    return styleContent;
  }
}
