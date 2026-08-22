const asset = (path: string) => `/assets/images/${path}`;

export const IMAGES = {
  logo: {
    mark: asset("logo/logo-mark.png"),
    full: asset("logo/logo-full.webp"),
    favicon: asset("logo/favicon.png"),
  },
  hero: {
    home: asset("hero/hero-home.jpg"),
    login: asset("hero/hero-login.jpg"),
    register: asset("hero/hero-register.jpg"),
  },
  regions: {
    rajasthan: asset("regions/rajasthan.jpg"),
    himalayas: asset("regions/himalayas.jpg"),
    keralaBackwaters: asset("regions/kerala-backwaters.jpg"),
    goldenTriangle: asset("regions/golden-triangle.jpg"),
    goa: asset("regions/goa.jpg"),
    southIndiaTemples: asset("regions/south-india-temples.jpg"),
  },
  destinations: {
    tajMahal: asset("destinations/taj-mahal.jpg"),
    amberFort: asset("destinations/amber-fort.jpg"),
    mehrangarhFort: asset("destinations/mehrangarh-fort.jpg"),
    udaipurCityPalace: asset("destinations/udaipur-city-palace.jpg"),
    hawaMahal: asset("destinations/hawa-mahal.jpg"),
    jaisalmerFort: asset("destinations/jaisalmer-fort.jpg"),
    varanasiGhats: asset("destinations/varanasi-ghats.jpg"),
    hampi: asset("destinations/hampi.jpg"),
    goldenTemple: asset("destinations/golden-temple.jpg"),
    mysorePalace: asset("destinations/mysore-palace.jpg"),
    lehLadakh: asset("destinations/leh-ladakh.jpg"),
    manali: asset("destinations/manali.jpg"),
    shimla: asset("destinations/shimla.jpg"),
  },
  activities: {
    desertSafariJaisalmer: asset("activities/desert-safari-jaisalmer.jpg"),
    monasteryMorningLadakh: asset("activities/monastery-morning-ladakh.jpg"),
    backwaterCanoeAlleppey: asset("activities/backwater-canoe-alleppey.jpg"),
  },
  community: {
    postPlaceholder: asset("community/post-placeholder-1.jpg"),
  },
  avatars: {
    default: asset("avatars/default-avatar.png"),
  },
} as const;

export const DEFAULT_IMAGE = IMAGES.logo.mark;
