"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import {
  FaSun,
  FaMoon,
  FaGlobe,
  FaMicrochip,
  FaPaintBrush,
  FaMap,
} from "react-icons/fa";
import CarPopup from "./mappopup";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const STYLES: Record<string, string> = {
  "3D Standard": "3d-standard",
  Tech: "mapbox://styles/mapbox/navigation-night-v1",
  Custom: "mapbox://styles/pratham1606/cmg36wcr5003h01psfrlyd7ql",
  Retro: "mapbox://styles/mapbox/retro-v1",
};

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentStyle, setCurrentStyle] = useState(STYLES["3D Standard"]);
  const [standardDark, setStandardDark] = useState(false);
  const geocoderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const styleUrl =
      currentStyle === "3d-standard"
        ? standardDark
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/streets-v12"
        : currentStyle;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: [-111.94, 33.4255],
        zoom: 12,
        pitch: 60,
        antialias: true,
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      const geocoder = new MapboxGeocoder({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "",
        mapboxgl: mapboxgl as any,
        marker: false,
        placeholder: "Search for places...",
      });

      if (geocoderContainerRef.current) {
        geocoderContainerRef.current.appendChild(geocoder.onAdd(map.current));
      }

      map.current.on("style.load", async () => {
        const carData = await fetch("/cars.json").then((res) => res.json());

        carData.forEach((dealership: any) => {
          const el = document.createElement("div");
          el.className =
            "car-marker flex items-center justify-center font-bold text-white shadow-lg cursor-pointer";
          el.style.width = "42px";
          el.style.height = "42px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor = "#000";
          el.style.border = "2px solid white";
          el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
          el.innerHTML = `<span>${dealership.count}</span>`;

          const popupNode = document.createElement("div");
          const root = createRoot(popupNode);
          root.render(<CarPopup cars={dealership.cars} />);

          const popup = new mapboxgl.Popup({ offset: 25, closeButton: true }).setDOMContent(popupNode);

          new mapboxgl.Marker(el)
            .setLngLat([dealership.lng, dealership.lat])
            .setPopup(popup)
            .addTo(map.current!);
        });
      });
    } else {
      map.current.setStyle(styleUrl);
    }
  }, [currentStyle, standardDark]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      <Link
        href="/"
        className="absolute top-4 left-4 bg-white text-black font-semibold px-4 py-2 rounded shadow hover:bg-gray-200 transition z-10"
      >
        ⬅ Home
      </Link>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-md w-72">
        <div ref={geocoderContainerRef} className="w-full mb-2" />
        <div className="flex gap-2">
          {Object.keys(STYLES).map((style) => {
            let icon;
            switch (style) {
              case "3D Standard":
                icon = <FaGlobe />;
                break;
              case "Tech":
                icon = <FaMicrochip />;
                break;
              case "Custom":
                icon = <FaMap />;
                break;
              case "Retro":
                icon = <FaPaintBrush />;
                break;
              default:
                icon = <FaGlobe />;
            }
            return (
              <button
                key={style}
                onClick={() => setCurrentStyle(STYLES[style])}
                title={style}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                  currentStyle === STYLES[style]
                    ? "bg-blue-600 text-white scale-110 shadow"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {icon}
              </button>
            );
          })}
          {currentStyle === STYLES["3D Standard"] && (
            <button
              onClick={() => setStandardDark(!standardDark)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
              title={standardDark ? "Switch to Streets (3D)" : "Switch to Dark"}
            >
              {standardDark ? <FaSun className="text-yellow-500" /> : <FaMoon />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
