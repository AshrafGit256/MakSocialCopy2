import React from "react";

interface LandingProps {
  onStart: () => void;
}

const LandingV2: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">

      {/* NAVBAR */}
      <header className="absolute top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-10 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png"
              className="w-10 h-10"
            />
            <span className="text-xl font-extrabold text-indigo-600">
              MakSocial
            </span>
          </div>

          <button
            onClick={onStart}
            className="bg-indigo-600 text-white px-7 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
          >
            Join Now
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-40 pb-32 relative">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* TEXT */}
          <div>
            <h1 className="text-6xl font-extrabold leading-tight mb-6">
              Campus Life,
              <br />
              <span className="text-indigo-600">
                Connected Digitally
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mb-10">
              MakSocial is the social platform where Makerere students, lecturers, alumni, and communities connect, share updates, and discover opportunities.
            </p>

            <div className="flex gap-6">
              <button
                onClick={onStart}
                className="bg-indigo-600 text-white px-10 py-4 rounded-full font-semibold hover:bg-indigo-700 transition"
              >
                Get Started
              </button>

              <button className="text-indigo-600 font-semibold">
                See How It Works
              </button>
            </div>
          </div>

          {/* IMAGE COLLAGE */}
          <div className="relative h-[520px]">

            <img
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b"
              className="absolute top-0 left-0 w-72 rounded-3xl shadow-xl"
            />

            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              className="absolute top-24 right-0 w-80 rounded-3xl shadow-xl"
            />

            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
              className="absolute bottom-0 left-24 w-72 rounded-3xl shadow-xl"
            />

          </div>
        </div>
      </section>

      {/* SOCIAL PROOF STRIP */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <h3 className="text-4xl font-extrabold text-indigo-600">50k+</h3>
            <p className="text-slate-600 mt-2">Students</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-indigo-600">9</h3>
            <p className="text-slate-600 mt-2">Colleges</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-indigo-600">300+</h3>
            <p className="text-slate-600 mt-2">Groups</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-indigo-600">100%</h3>
            <p className="text-slate-600 mt-2">Campus Focused</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-10 space-y-28">

          {/* FEATURE 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <img
              src="https://images.unsplash.com/photo-1529070538774-1843cb3265df"
              className="rounded-3xl shadow-2xl"
            />
            <div>
              <h2 className="text-4xl font-extrabold mb-6">
                One Feed for Campus Life
              </h2>
              <p className="text-lg text-slate-600">
                Follow colleges, clubs, friends, and lecturers. Never miss an announcement or event.
              </p>
            </div>
          </div>

          {/* FEATURE 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-extrabold mb-6">
                Discover Opportunities
              </h2>
              <p className="text-lg text-slate-600">
                Internships, scholarships, events, and campus opportunities shared in real time.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1515169067865-5387ec356754"
              className="rounded-3xl shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-32 text-center text-white">
        <h2 className="text-5xl font-extrabold mb-6">
          Join the MakSocial Community
        </h2>
        <p className="text-lg opacity-90 mb-10 max-w-xl mx-auto">
          Your university. Your people. One digital home.
        </p>
        <button
          onClick={onStart}
          className="bg-white text-indigo-600 px-12 py-4 rounded-full font-semibold hover:bg-slate-100 transition"
        >
          Create Account
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-14 text-center text-slate-500 text-sm">
        © 2026 MakSocial. Makerere University.
      </footer>

    </div>
  );
};

export default LandingV2;
