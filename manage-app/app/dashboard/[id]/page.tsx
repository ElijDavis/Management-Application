// app/dashboard/[id]/page.tsx
'use client'

import { useParams } from "next/navigation";

const Visual = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard Tile: {id}</h1>
      <p>You clicked on the "{id}" tile.</p>
    </div>
  );
};

export default Visual;
