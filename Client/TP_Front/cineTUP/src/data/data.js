// Almcanenamiento de las peliculas disponibles
import { generateTickets } from "./tickets";

export const MOVIES = [
  {
    id: 1,
    title: "El padrino",
    director: "Christopher Nolan",
    category: "Sci-Fi",
    summary: "Un ladrón roba secretos a través de los sueños.",
    imageUrl: "https://ca-times.brightspotcdn.com/dims4/default/8aa9b65/2147483647/strip/true/crop/2093x3000+0+0/resize/1200x1720!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F47%2F95%2Fcbf137037b833a53a724fde3f53e%2Fcfdj8emgq7504ddbn1ibedbziqes-ufxmz-ypi0gordml8oigvx-qxnfyjdexxje48b9jsnhzr2hbbtg9-5bm2ewo-sfvcb9svtpufonjqohy-raixysjlgk7fagt3voiify9grgz0pkj-sysmn1pfblqffyiedjz8nszvhrheowg2imuyrmeklodsplgwx3wmznmclm-gx-cvc7m0lf7h7crd5meu1oztvsd9po-e1pldrzmjwobcwk9h7avlf0y4ew56xkel9filhfyidkf9rpndq4ic7-snlvnin85poimejwzyp6rq-q8qsqvmlvl2xaq3rsy-7axvtxqcpqinvjubaglw5risa6bqkfrpqowvdt29rhgoxnbsbi3dnwzldfjuimuizsg2hody3cu-y1kgk",
    imageBanner: "https://nnc-media.netralnews.com/IMG-Netral-News-User-3610-IH5VNKB9ZM.jpg",
    duration: 148,
    language: "Español",
    isAvailable: true,
    tickets: generateTickets(),
  },
  {
    id: 2,
    title: "The Matrix",
    director: "Wachowski Sisters",
    category: "Acción",
    summary: "Un programador descubre la verdad sobre su mundo.",
    imageUrl: "https://m.media-amazon.com/images/I/51EG732BV3L.jpg",
    imageBanner: "https://lightbox-prod.imgix.net/images/assets/BANNER_WIDE_mac_10063986_CA2319C1-9CDB-4F42-9E19A0282F8D23B5.jpg",
    duration: 136,
    language: "Español",
    isAvailable: true,
    tickets: generateTickets(),
  },
  {
    id: 3,
    title: "Interstellar",
    director: "Christopher Nolan",
    category: "Sci-Fi",
    summary: "Un grupo de astronautas busca un nuevo hogar para la humanidad.",
    imageUrl: "https://m.media-amazon.com/images/I/91kFYg4fX3L._SL1500_.jpg",
    imageBanner: "https://www.mubis.es/media/users/10229/97648/banner-de-interstellar-original.jpg",
    duration: 169,
    language: "Español",
    isAvailable: false,
    tickets: generateTickets(),
  }
];

