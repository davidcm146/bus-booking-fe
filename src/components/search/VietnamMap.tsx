"use client";

interface VietnamMapProps {
  readonly className?: string;
}

// Cities positioned using actual geographic coordinates projected via
// d3-geo Mercator fitSize([200, 450]) — aligned with the SVG path below.
const CITIES = [
  { id: "sapa", name: "Sapa", x: 46.6, y: 40.8, isHub: false },
  { id: "ha-noi", name: "Hà Nội", x: 102.7, y: 80.2, isHub: true },
  { id: "hai-phong", name: "Hải Phòng", x: 125.9, y: 85.2, isHub: false },
  { id: "ninh-binh", name: "Ninh Bình", x: 106.1, y: 103.4, isHub: false },
  { id: "hue", name: "Huế", x: 151.3, y: 214.9, isHub: false },
  { id: "da-nang", name: "Đà Nẵng", x: 168.9, y: 226.3, isHub: true },
  { id: "hoi-an", name: "Hội An", x: 172.2, y: 231.8, isHub: false },
  { id: "quy-nhon", name: "Quy Nhơn", x: 196.8, y: 292.4, isHub: false },
  { id: "nha-trang", name: "Nha Trang", x: 196, y: 336.6, isHub: false },
  { id: "da-lat", name: "Đà Lạt", x: 175, y: 345.1, isHub: false },
  { id: "ho-chi-minh", name: "HCM", x: 126.4, y: 378.2, isHub: true },
  { id: "vung-tau", name: "Vũng Tàu", x: 137, y: 390.7, isHub: false },
  { id: "can-tho", name: "Cần Thơ", x: 98.8, y: 400, isHub: false },
  { id: "long-xuyen", name: "Long Xuyên", x: 91.3, y: 389.2, isHub: false },
] as const;

// Route lines connecting major cities (using projected coordinates)
const ROUTES = [
  "M102.7,80.2 L151.3,214.9",       // HN -> Huế
  "M151.3,214.9 L168.9,226.3",      // Huế -> Đà Nẵng
  "M168.9,226.3 L196,336.6",        // Đà Nẵng -> Nha Trang
  "M196,336.6 L126.4,378.2",        // Nha Trang -> HCM
  "M102.7,80.2 L106.1,103.4",       // HN -> Ninh Bình
  "M126.4,378.2 L175,345.1",        // HCM -> Đà Lạt
  "M126.4,378.2 L98.8,400",         // HCM -> Cần Thơ
  "M102.7,80.2 L125.9,85.2",        // HN -> Hải Phòng
  "M102.7,80.2 L46.6,40.8",         // HN -> Sapa
] as const;

// Real Vietnam outline from Natural Earth 110m data, projected via Mercator
const VIETNAM_PATH = "M60.402,386.508L84.523,375.063L113.869,372.994L101.608,355.746L148.543,333.77L151.96,299.444L145.528,280.268L150.553,251.445L143.518,230.943L122.412,210.714L104.824,185.014L81.608,150.27L48.141,132.633L56.181,122.009L74.07,114.227L63.216,88.277L28.844,88.025L16.281,60.805L0,37.044L14.975,29.624L37.186,29.777L64.422,26.293L88.141,10.113L101.608,21.523L127.136,27.062L122.714,44.452L135.98,56.684L164.121,64.515L126.834,90.096L103.618,118.195L97.487,138.735L118.794,169.783L144.925,208.001L170.251,225.979L187.236,249.291L200,302.602L196.281,352.9L172.965,371.646L141.005,389.967L118.191,413.57L83.417,439.887L73.266,421.807L81.106,402.591Z";

export function VietnamMap({ className }: VietnamMapProps) {
  return (
    <div className={className}>
      <svg viewBox="-10 -5 220 460" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
        <defs>
          <linearGradient id="vietnamFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary-light)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--surface)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Real Vietnam outline from Natural Earth geographic data */}
        <path
          d={VIETNAM_PATH}
          fill="url(#vietnamFill)"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Route lines — marching dashes animate along paths */}
        <g fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8" opacity="0.75">
          {ROUTES.map((d) => (
            <path key={d} d={d} className="route-line" />
          ))}
        </g>

        {/* City dots — hubs pulse */}
        {CITIES.map((city) => (
          <g key={city.id}>
            <circle cx={city.x} cy={city.y} r={city.isHub ? 6 : 4} fill={city.isHub ? "var(--success)" : "var(--primary)"} className={city.isHub ? "hub-dot" : undefined} />
            <text
              x={city.x}
              y={city.y - 10}
              textAnchor="middle"
              className="fill-white text-[9px] font-semibold"
            >
              {city.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
