import type { Metadata } from "next";
import { SearchHero } from "@/components/search/SearchHero";

export const metadata: Metadata = {
  title: "BusGo — Travel Vietnam by bus",
  description:
    "Book intercity bus tickets across Vietnam. 200+ routes from Hà Nội to Sài Gòn. Sleeper coaches, honest VND prices, and the seat you actually picked.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <SearchHero />;
}
