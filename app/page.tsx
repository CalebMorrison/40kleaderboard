'use client';

import Leaderboard from '../components/Leaderboard';

export default function Page() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/backgroundImage.jpg')" }}
      ></div>

      {/* Leaderboard */}
      <div className="relative">
        <Leaderboard />
      </div>
    </div>
  );
}