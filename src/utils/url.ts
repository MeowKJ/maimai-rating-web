export const generateImageUrl = (songId: number) => {
  return `https://maimai.mpas.top/assets/cover/${songId}`;
};

export const generateRateUrl = (rate: string) => {
  return `https://maimai.mpas.top/assets/rank/${rate}`;
};

export const generateBadgeUrl = (badge: string | null) => {
  if (!badge) {
    badge = "blank";
  }
  return `https://maimai.mpas.top/assets/badge/${badge}`;
};

export const generatePlateUrl = (plateId: number | null) => {
  if (!plateId) {
    plateId = 0;
  }
  return `https://maimai.mpas.top/assets/plate/${plateId}`;
};

export const generateTrophyUrl = (trophyColor: string | null) => {
  return `https://maimai.mpas.top/assets/trophy/${trophyColor}`;
};
