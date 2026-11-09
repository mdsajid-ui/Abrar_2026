import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false,
});

export const IconCart = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></svg>);
export const IconMenu = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const IconClose = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const IconCheck = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
export const IconDrop = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" /></svg>);
export const IconShield = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>);
export const IconMountain = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M3 19l6-10 4 6 2-3 6 7H3z" /></svg>);
export const IconLeaf = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" /><path d="M5 19l7-7" /></svg>);
export const IconTruck = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="17.5" r="1.7" /><circle cx="17" cy="17.5" r="1.7" /></svg>);
export const IconBox = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z" /><path d="M3 7.5l9 4.5 9-4.5M12 12v9" /></svg>);
export const IconLock = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>);
export const IconCash = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>);
export const IconRefresh = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4" /></svg>);
export const IconPin = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M12 21s7-6 7-11.5A7 7 0 0 0 5 9.5C5 15 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>);
export const IconBuilding = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 21V5l8-2v18M12 8h8v13M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01M2 21h20" /></svg>);
export const IconParty = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 20l5-14 9 9-14 5z" /><path d="M14 4l1 2M19 9l2-1M17 3l-1 3" /></svg>);
export const IconHome = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M3 11l9-7 9 7M5 10v10h14V10" /></svg>);
export const IconStore = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6" /></svg>);
export const IconPhone = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>);
export const IconRecycle = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M7 19H4.5a1.5 1.5 0 0 1-1.3-2.2L5 13.5M9.5 5.5l1.2-2a1.5 1.5 0 0 1 2.6 0L15 6.5M17 19h2.5a1.5 1.5 0 0 0 1.3-2.2L19 13.5M7 19l2-2M7 19l2 2M15 6.5l-2.7.3M15 6.5l.6-2.6M17 19h-6" /></svg>);
export const IconArrow = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconSun = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></svg>);
export const IconTrash = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>);
