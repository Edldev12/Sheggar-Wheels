
"use client";

import dynamic from "next/dynamic";

const BookingMap = dynamic(() => import("./BookingMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-2xl bg-slate-900 text-slate-400">
      Loading map...
    </div>
  ),
});

export default function BookingMapLoader(props) {
  return <BookingMap {...props} />;
}
