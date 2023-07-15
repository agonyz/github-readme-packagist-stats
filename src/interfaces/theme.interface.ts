export interface Theme {
  name: string;
  styleContent: string;
}

export interface ThemeMap {
  [key: string]: Theme;
}
