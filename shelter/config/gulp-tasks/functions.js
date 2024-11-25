const getFontName = (fontFile) => {
  let font = fontFile.split('.')[0];
  return font.split('-')[0] ? font.split('-')[0] : font;
};

export const getFontWeight = (font, isFile = true) => {
  if (isFile) {
    font = font.split('.')[0];
  }
  let fontWeight = font.split('-')[1] ? font.split('-')[1] : font;
  switch (fontWeight.toLowerCase()) {
    case 'thin': fontWeight = 100; break;
    case 'extralight': fontWeight = 200; break;
    case 'light': fontWeight = 300; break;
    case 'medium': fontWeight = 500; break;
    case 'semibold': fontWeight = 600; break;
    case 'bold': fontWeight = 700; break;
    case 'extrabold', 'heavy': fontWeight = 800; break;
    case 'black': fontWeight = 900; break;
    default: fontWeight = 400;
  }
  return fontWeight;
};

export const sortFonts = (a, b) => {
  if (getFontName(a) < getFontName(b)) {
    return -1;
  } else if (getFontName(a) > getFontName(b)) {
    return 1;
  } else {
    if (getFontWeight(a) < getFontWeight(b)) {
      return -1;
    }
    else if (getFontWeight(a) > getFontWeight(b)) {
      return 1;
    }
    else {
      return 0;
    }
  }
};