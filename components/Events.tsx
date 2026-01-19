import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { LiveEvent, CalendarEvent, User, College, Post } from '../types';
import {
  Radio, Users, Share2, Youtube, Zap, CheckCircle2,
  CalendarDays, Plus, X, ExternalLink
} from 'lucide-react';

const COLLEGES: College[] = [
  'COCIS', 'CEDAT', 'CHUSS', 'CONAS', 'CHS',
  'CAES', 'COBAMS', 'CEES', 'LAW'
];

interface EventsProps {
  isAdmin?: boolean;
}

const Events: React.FC<EventsProps> = ({ isAdmin }) => {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [repostTarget, setRepostTarget] = useState<College | 'Global'>('Global');

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Social',
    registrationLink: '',
    image: ''
  });

  useEffect(() => {
    const user = db.getUser();
    if (user) setCurrentUser(user);

    const sync = () => {
      setLiveEvents(db.getEvents());
      setCalendarEvents(db.getCalendarEvents());
    };

    sync();
    const interval = setInterval(sync, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!currentUser) {
    return (
      <div className="text-center text-slate-400 py-20">
        Loading user profile...
      </div>
    );
  }

  const handleRegister = (eventId: string) => {
    db.registerForEvent(eventId, currentUser.id);
    setCalendarEvents(db.getCalendarEvents());
  };

  const handleAddEvent = () => {
    if (!form.title || !form.date || !form.location) {
      alert('Please fill all required fields');
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location,
      category: form.category,
      registrationLink: form.registrationLink,
      image: form.image,
      createdBy: currentUser.id,
      attendeeIds: []
    };

    db.saveCalendarEvent(newEvent);
    setCalendarEvents(db.getCalendarEvents());
    setIsAdding(false);

    setForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'Social',
      registrationLink: '',
      image: ''
    });
  };

  const pushToFeed = (event: CalendarEvent) => {
    const broadcast: Post = {
      id: `broadcast-${Date.now()}`,
      author: 'Campus Events Hub',
      authorId: currentUser.id,
      authorRole: 'Official Broadcast',
      authorAvatar:
        'https://raw.githubusercontent.com/AshrafGit256/MakSocialImages/main/Public/MakSocial10.png',
      timestamp: 'Just now',
      content: event.description,
      images: event.image ? [event.image] : undefined,
      hashtags: ['#MakEvent', `#${event.category}`, '#Official'],
      likes: 0,
      commentsCount: 0,
      comments: [],
      views: 0,
      flags: [],
      isOpportunity: false,
      college: repostTarget,
      isEventBroadcast: true,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventTitle: event.title,
      eventRegistrationLink: event.registrationLink
    };

    db.addPost(broadcast);
    alert(`Broadcast sent to ${repostTarget}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 pb-32">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white flex items-center gap-4 uppercase">
            <Radio className="text-red-500 animate-pulse" size={40} />
            Events Hub
          </h1>
          <p className="text-slate-400 mt-2 font-bold uppercase text-xs">
            Streaming ceremonies, workshops, and lectures
          </p>
        </div>

        <div className="flex gap-4">
          {isAdmin && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase"
            >
              <Plus size={16} /> Create Event
            </button>
          )}

          <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase">
            <Youtube size={16} /> Go Live
          </button>
        </div>
      </div>

      <section className="space-y-8">
        <h3 className="text-2xl font-black text-white uppercase flex items-center gap-3">
          <Zap className="text-amber-500" />
          Live Signals
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {liveEvents.map(event => (
            <div key={event.id} className="rounded-3xl overflow-hidden bg-slate-900">
              <iframe
                className="w-full aspect-video"
                src={event.youtubeUrl}
                title={event.title}
                allowFullScreen
              />
              <div className="p-6">
                <h3 className="text-xl font-black text-white">
                  {event.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Host: {event.organizer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h3 className="text-2xl font-black text-white uppercase flex items-center gap-3">
          <CalendarDays className="text-indigo-500" />
          Registry Hub
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calendarEvents.map(event => {
            const eventDate = new Date(event.date);
            const isExpired =
              !isNaN(eventDate.getTime()) && eventDate < new Date();

            const isRegistered =
              event.attendeeIds.includes(currentUser.id);

            return (
              <div
                key={event.id}
                className={`p-6 rounded-2xl bg-slate-900 ${
                  isExpired ? 'opacity-50' : ''
                }`}
              >
                <h4 className="text-lg font-black text-white">
                  {event.title}
                </h4>

                <p className="text-xs text-slate-400 mt-2">
                  {event.date} • {event.location}
                </p>

                <p className="text-sm text-slate-300 mt-3">
                  {event.description}
                </p>

                <button
                  disabled={isExpired || isRegistered}
                  onClick={() => handleRegister(event.id)}
                  className="w-full mt-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase"
                >
                  {isRegistered ? 'Registered' : isExpired ? 'Closed' : 'Register'}
                </button>

                {isAdmin && !isExpired && (
                  <button
                    onClick={() => pushToFeed(event)}
                    className="w-full mt-3 py-2 border border-rose-500 text-rose-500 rounded-xl text-xs uppercase"
                  >
                    <ExternalLink size={12} /> Broadcast
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {isAdding && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6">
          <div className="bg-slate-900 p-8 rounded-3xl max-w-xl w-full">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-black text-white uppercase">
                Add Event
              </h2>
              <button onClick={() => setIsAdding(false)}>
                <X />
              </button>
            </div>

            <input
              className="w-full mb-3 p-3 rounded bg-slate-800 text-white"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <input
              type="date"
              className="w-full mb-3 p-3 rounded bg-slate-800 text-white"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />

            <input
              className="w-full mb-3 p-3 rounded bg-slate-800 text-white"
              placeholder="Location"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />

            <textarea
              className="w-full mb-4 p-3 rounded bg-slate-800 text-white"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <button
              onClick={handleAddEvent}
              className="w-full bg-indigo-600 py-3 rounded-xl text-white font-black uppercase"
            >
              Save Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
