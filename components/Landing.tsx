import React from "react";

interface LandingProps {
  onStart: () => void;
}

const LandingV1: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="bg-white text-slate-800 overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png"
              className="w-10 h-10"
            />
            <span className="text-xl font-extrabold text-indigo-600">
              MakSocial
            </span>
          </div>

          <div className="hidden md:flex gap-10 text-sm font-semibold text-slate-600">
            <a className="hover:text-indigo-600 cursor-pointer">Features</a>
            <a className="hover:text-indigo-600 cursor-pointer">Community</a>
            <a className="hover:text-indigo-600 cursor-pointer">Events</a>
            <a className="hover:text-indigo-600 cursor-pointer">Alumni</a>
          </div>

          <button
            onClick={onStart}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-28 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              The Social Network <br />
              <span className="text-indigo-600">
                Built for Makerere
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mb-10">
              MakSocial connects students, lecturers, alumni, and the entire university community in one trusted digital space.
            </p>

            <div className="flex gap-6">
              <button
                onClick={onStart}
                className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-indigo-700 transition"
              >
                Join MakSocial
              </button>

              <button className="border border-slate-300 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 transition">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1601582584375-8a78d6c47b7b"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-8">

          <h2 className="text-4xl font-extrabold text-center mb-16">
            Everything Campus Life Needs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <img
                src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b"
                className="rounded-2xl mb-6"
              />
              <h3 className="text-xl font-bold mb-3">
                Student Communities
              </h3>
              <p className="text-slate-600">
                Join course groups, college communities, clubs, and interest spaces.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                className="rounded-2xl mb-6"
              />
              <h3 className="text-xl font-bold mb-3">
                Academic Updates
              </h3>
              <p className="text-slate-600">
                Receive announcements, notes, and lecturer communication in one place.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                className="rounded-2xl mb-6"
              />
              <h3 className="text-xl font-bold mb-3">
                Opportunities
              </h3>
              <p className="text-slate-600">
                Discover internships, scholarships, events, and career opportunities.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-indigo-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">

          <div>
            <h3 className="text-4xl font-extrabold">50k+</h3>
            <p className="opacity-80 mt-2">Students</p>
          </div>

          <div>
            <h3 className="text-4xl font-extrabold">9</h3>
            <p className="opacity-80 mt-2">Colleges</p>
          </div>

          <div>
            <h3 className="text-4xl font-extrabold">300+</h3>
            <p className="opacity-80 mt-2">Communities</p>
          </div>

          <div>
            <h3 className="text-4xl font-extrabold">100%</h3>
            <p className="opacity-80 mt-2">Campus Focused</p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-28 text-center">
        <h2 className="text-4xl font-extrabold mb-6">
          Join the Makerere Digital Community
        </h2>
        <p className="text-slate-600 mb-10 max-w-xl mx-auto">
          Be part of conversations, opportunities, and connections that shape campus life.
        </p>

        <button
          onClick={onStart}
          className="bg-indigo-600 text-white px-10 py-4 rounded-full font-semibold hover:bg-indigo-700 transition"
        >
          Create Your Account
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="font-semibold text-white mb-2">MakSocial</p>
          <p className="text-sm">
            © 2026 Makerere University. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default LandingV1;
