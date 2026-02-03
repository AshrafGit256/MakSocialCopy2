
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { db } from '../db';
import { PlatformEmail, User, EmailAttachment } from '../types';
import { 
  Inbox, Send, FileText, Trash, Star, 
  ChevronRight, ChevronLeft, Search, Plus, 
  ArrowLeft, X, Paperclip, Reply, Forward,
  MoreHorizontal, Download, Image as ImageIcon, 
  File, Printer, ChevronDown, RotateCw, Filter,
  Tag, AlignLeft, AlignCenter, AlignRight, Bold,
  Italic, List, Code, Redo2, Terminal, AlertCircle, FilePlus, Menu
} from 'lucide-react';

const PAGE_SIZE = 10;

const EmailHub: React.FC = () => {
  const [view, setView] = useState<'list' | 'read' | 'compose'>('list');
  const [folder, setFolder] = useState<PlatformEmail['folder'] | 'all'>('inbox');
  const [activeLabel, setActiveLabel] = useState<PlatformEmail['label'] | null>(null);
  const [emails, setEmails] = useState<PlatformEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<PlatformEmail | null>(null);
  const [currentUser] = useState<User>(db.getUser());
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeAttachments, setComposeAttachments] = useState<EmailAttachment[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEmails(db.getEmails());
  }, []);

  const handleReadEmail = (email: PlatformEmail) => {
    setSelectedEmail(email);
    setView('read');
    if (!email.isRead) {
      const updated = emails.map(e => e.id === email.id ? { ...e, isRead: true } : e);
      setEmails(updated);
      db.saveEmails(updated);
    }
  };

  const handleToggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = emails.map(email => email.id === id ? { ...email, isStarred: !email.isStarred } : email);
    setEmails(updated);
    db.saveEmails(updated);
  };

  const handleForward = (email: PlatformEmail) => {
    setComposeTo('');
    setComposeSubject(`Fwd: ${email.subject}`);
    setComposeBody(`\n\n---------- Forwarded message ---------\nFrom: ${email.fromName} <${email.from}>\nDate: ${email.fullDate}\nSubject: ${email.subject}\nTo: ${email.to.join(', ')}\n\n${email.body}`);
    setComposeAttachments(email.attachments || []);
    setView('compose');
  };

  const handleReply = (email: PlatformEmail) => {
    setComposeTo(email.from);
    setComposeSubject(`Re: ${email.subject}`);
    setComposeBody(`\n\nOn ${email.fullDate}, ${email.fromName} wrote:\n> ${email.body.replace(/\n/g, '\n> ')}`);
    setView('compose');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: EmailAttachment[] = (Array.from(files) as File[]).map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: file.type.includes('image') ? 'image' : 'file',
      img: file.type.includes('image') ? URL.createObjectURL(file) : undefined
    }));

    setComposeAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setComposeAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSaveDraft = () => {
    const newDraft: PlatformEmail = {
      id: `draft-${Date.now()}`,
      from: currentUser.email || 'node@mak.ac.ug',
      fromName: currentUser.name,
      fromAvatar: currentUser.avatar,
      to: composeTo ? composeTo.split(/[,\s]+/).filter(e => e.includes('@')) : [],
      subject: composeSubject || '[NO SUBJECT]',
      body: composeBody,
      timestamp: 'Just now',
      fullDate: new Date().toLocaleString(),
      isRead: true,
      isStarred: false,
      folder: 'draft',
      attachments: composeAttachments.length > 0 ? composeAttachments : undefined
    };

    const updated = [newDraft, ...emails];
    setEmails(updated);
    db.saveEmails(updated);
    
    setView('list');
    setFolder('draft');
    resetCompose();
    setIsSidebarMobileOpen(false);
  };

  const handleSendEmail = () => {
    if (!composeTo.trim()) {
      alert("Diagnostic Error: Recipient Node Required.");
      return;
    }

    const recipients = composeTo.split(/[,\s]+/).filter(e => e.includes('@'));
    
    if (recipients.length === 0) {
      alert("Diagnostic Error: No valid node addresses detected.");
      return;
    }

    const newEmail: PlatformEmail = {
      id: `sent-${Date.now()}`,
      from: currentUser.email || 'node@mak.ac.ug',
      fromName: currentUser.name,
      fromAvatar: currentUser.avatar,
      to: recipients,
      subject: composeSubject || '[NO SUBJECT]',
      body: composeBody,
      timestamp: 'Just now',
      fullDate: new Date().toLocaleString(),
      isRead: true,
      isStarred: false,
      folder: 'sent',
      attachments: composeAttachments.length > 0 ? composeAttachments : undefined
    };

    const updated = [newEmail, ...emails];
    setEmails(updated);
    db.saveEmails(updated);
    
    setFolder('sent');
    setActiveLabel(null);
    setView('list');
    resetCompose();
    setIsSidebarMobileOpen(false);
  };

  const resetCompose = () => {
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setComposeAttachments([]);
  };

  const filteredEmails = useMemo(() => {
    return emails.filter(e => {
      const matchesSearch = e.subject.toLowerCase().includes(search.toLowerCase()) || 
                           e.fromName.toLowerCase().includes(search.toLowerCase());
      if (activeLabel) return e.label === activeLabel && matchesSearch;
      if (folder === 'all') return matchesSearch;
      if (folder === 'starred') return e.isStarred && matchesSearch;
      return e.folder === folder && matchesSearch;
    });
  }, [emails, folder, activeLabel, search]);

  const totalPages = Math.ceil(filteredEmails.length / PAGE_SIZE);
  const paginatedEmails = filteredEmails.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const sidebarItems = [
    { id: 'inbox', label: 'Inbox', icon: <Inbox size={18}/>, count: emails.filter(e => e.folder === 'inbox' && !e.isRead).length },
    { id: 'sent', label: 'Sent', icon: <Send size={18}/> },
    { id: 'draft', label: 'Draft', icon: <FileText size={18}/>, count: emails.filter(e => e.folder === 'draft').length },
    { id: 'starred', label: 'Starred', icon: <Star size={18}/> },
    { id: 'spam', label: 'Spam', icon: <AlertCircle size={18}/> },
    { id: 'trash', label: 'Trash', icon: <Trash size={18}/> },
  ];

  const labels = [
    { id: 'Social', color: 'bg-rose-500' },
    { id: 'Company', color: 'bg-cyan-500' },
    { id: 'Important', color: 'bg-emerald-500' },
    { id: 'Private', color: 'bg-indigo-500' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 pb-40 font-mono text-[var(--text-primary)]">
      {/* HEADER */}
      <div className="flex flex-col mb-6 md:mb-10">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Email_Registry</h1>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 md:mt-2">
                <Terminal size={14} className="text-[var(--brand-color)]"/> <span>Apps</span> <ChevronRight size={10}/> <span>Email</span>
              </div>
           </div>
           <button 
             onClick={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
             className="lg:hidden p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-[var(--brand-color)]"
           >
              <Menu size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR NAVIGATION - DESKTOP & MOBILE DRAWER */}
        <aside className={`
          ${isSidebarMobileOpen ? 'fixed inset-0 z-[200] bg-black/90 backdrop-blur-md p-8 overflow-y-auto block' : 'hidden lg:block lg:col-span-3'}
          space-y-6
        `}>
          {isSidebarMobileOpen && (
            <div className="flex justify-end mb-4">
              <button onClick={() => setIsSidebarMobileOpen(false)} className="text-white p-2"><X size={28}/></button>
            </div>
          )}

          <button 
            onClick={() => {setView('compose'); setIsSidebarMobileOpen(false);}}
            className="w-full py-4 bg-[var(--brand-color)] hover:brightness-110 text-white rounded-[2px] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Plus size={18}/> Compose_Signal
          </button>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] overflow-hidden shadow-sm">
            <div className="p-1 space-y-0.5">
              {sidebarItems.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => {setFolder(item.id as any); setActiveLabel(null); setView('list'); setCurrentPage(1); setIsSidebarMobileOpen(false);}}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-[2px] text-[11px] font-bold uppercase tracking-widest transition-all ${!activeLabel && folder === item.id ? 'bg-[var(--brand-color)] text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-4">{item.icon} <span>{item.label}</span></div>
                  {item.count ? <span className={`px-2 py-0.5 rounded-[2px] text-[9px] font-black ${!activeLabel && folder === item.id ? 'bg-white text-[var(--brand-color)]' : 'bg-[var(--brand-color)]/20 text-[var(--brand-color)]'}`}>{item.count}+</span> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="px-4 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Labels</h3>
             <div className="space-y-1">
                {labels.map(label => (
                  <button 
                    key={label.id} 
                    onClick={() => {setActiveLabel(label.id as any); setView('list'); setCurrentPage(1); setIsSidebarMobileOpen(false);}}
                    className={`w-full flex items-center gap-4 px-4 py-2.5 text-[11px] font-bold uppercase tracking-tighter transition-all rounded-[2px] ${activeLabel === label.id ? 'bg-white/10 text-[var(--text-primary)] border-l-4 border-current' : 'text-slate-500 hover:bg-[var(--bg-secondary)]'}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${label.color} shadow-sm`}></div>
                    <span>{label.id}</span>
                  </button>
                ))}
             </div>
          </div>
          
          <div className="pt-4 border-t border-[var(--border-color)]">
             <div className="space-y-1">
                <button 
                  onClick={() => {setFolder('all'); setActiveLabel(null); setView('list'); setCurrentPage(1); setIsSidebarMobileOpen(false);}}
                  className={`w-full flex items-center gap-4 px-4 py-2.5 text-[11px] font-bold transition-all uppercase tracking-tighter ${folder === 'all' && !activeLabel ? 'text-[var(--brand-color)]' : 'text-slate-400 hover:text-[var(--text-primary)]'}`}
                >
                   <Tag size={14} className="opacity-40" /> All Mail
                </button>
             </div>
          </div>
        </aside>

        {/* MAIN EMAIL WORKSPACE */}
        <main className="lg:col-span-9 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] shadow-2xl flex flex-col relative min-h-[600px] md:min-h-[800px] overflow-hidden">
          
          {view === 'list' && (
            <>
              <div className="p-4 border-b border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4 bg-white/5 backdrop-blur-sm">
                <div className="relative flex-1 max-w-lg group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[var(--brand-color)] transition-colors" size={16} />
                   <input 
                     value={search}
                     onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
                     className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[2px] py-2.5 pl-12 pr-4 text-xs font-bold outline-none focus:border-[var(--brand-color)] shadow-inner" 
                     placeholder="Search signals in registry..." 
                   />
                </div>
                <div className="flex items-center gap-5 text-[11px] font-black text-slate-500 uppercase tracking-widest w-full md:w-auto justify-between md:justify-end">
                    <span>{Math.min(filteredEmails.length, (currentPage-1)*PAGE_SIZE + 1)}-{Math.min(filteredEmails.length, currentPage*PAGE_SIZE)} OF {filteredEmails.length}</span>
                    <div className="flex gap-1">
                       <button 
                         disabled={currentPage === 1}
                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                         className="p-1.5 border border-[var(--border-color)] rounded-[2px] hover:bg-white/5 disabled:opacity-30"
                       >
                         <ChevronLeft size={16}/>
                       </button>
                       <button 
                         disabled={currentPage === totalPages || totalPages === 0}
                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                         className="p-1.5 border border-[var(--border-color)] rounded-[2px] hover:bg-white/5 disabled:opacity-30"
                       >
                         <ChevronRight size={16}/>
                       </button>
                    </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-[#050505]">
                {paginatedEmails.length > 0 ? paginatedEmails.map((email) => (
                  <div 
                    key={email.id} 
                    onClick={() => handleReadEmail(email)}
                    className={`px-4 md:px-6 py-4 border-b border-[var(--border-color)] flex flex-col md:flex-row md:items-center gap-3 md:gap-8 hover:bg-[var(--brand-color)]/5 cursor-pointer group transition-all ${!email.isRead ? 'bg-white dark:bg-white/[0.02]' : ''}`}
                  >
                    <div className="flex items-center justify-between md:justify-start gap-5 shrink-0">
                       <div className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4 rounded-[2px] bg-transparent border-[var(--border-color)] text-[var(--brand-color)] focus:ring-0" onClick={e => e.stopPropagation()}/>
                          <button className={`transition-all hover:scale-125 ${email.isStarred ? 'text-amber-500' : 'text-slate-700'}`} onClick={e => handleToggleStar(e, email.id)}>
                             <Star size={18} fill={email.isStarred ? "currentColor" : "none"}/>
                          </button>
                       </div>
                       <div className="md:hidden text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">{email.timestamp}</div>
                    </div>

                    <div className="flex items-center gap-4 min-w-0 overflow-hidden">
                       <img src={email.fromAvatar} className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-white object-cover grayscale group-hover:grayscale-0 transition-all shrink-0" />
                       <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between md:justify-start gap-3">
                             <span className={`text-[12px] uppercase tracking-tight truncate ${!email.isRead ? 'font-black text-[var(--text-primary)]' : 'font-bold text-slate-500'}`}>{email.fromName}</span>
                             {!email.isRead && <div className="md:hidden w-1.5 h-1.5 rounded-full bg-[var(--brand-color)] animate-pulse"></div>}
                          </div>
                          <p className={`text-[12px] truncate uppercase tracking-tighter md:hidden ${!email.isRead ? 'font-black text-[var(--text-primary)]' : 'font-bold text-slate-400'}`}>
                             {email.subject}
                          </p>
                       </div>
                    </div>

                    <div className="hidden md:block flex-1 min-w-0">
                       <div className="flex items-center gap-3 mb-0.5">
                          <p className={`text-[12px] truncate uppercase tracking-tighter ${!email.isRead ? 'font-black text-[var(--text-primary)]' : 'font-bold text-slate-400'}`}>
                             {email.subject}
                          </p>
                          {email.attachments && email.attachments.some(a => a.type === 'image') && <ImageIcon size={14} className="text-slate-600" />}
                          {!email.isRead && <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-color)] animate-pulse"></div>}
                       </div>
                       <p className="text-[11px] text-slate-500 truncate font-medium lowercase">
                          {email.body.split('\n')[0].slice(0, 100)}...
                       </p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end">
                       {email.label && (
                         <span className={`px-2 py-0.5 rounded-[1px] text-[8px] font-black uppercase tracking-widest border border-current opacity-60 ${
                           email.label === 'Important' ? 'text-emerald-500' :
                           email.label === 'Social' ? 'text-rose-500' :
                           email.label === 'Company' ? 'text-cyan-500' : 'text-indigo-500'
                         }`}>
                           {email.label}
                         </span>
                       )}
                       <span className="hidden md:block text-[10px] font-mono font-bold text-slate-600 uppercase tracking-widest">{email.timestamp}</span>
                    </div>
                  </div>
                )) : (
                  <div className="py-40 text-center space-y-6 opacity-30 px-6">
                     <Inbox size={64} className="mx-auto" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em]">No active signals in this strata</p>
                  </div>
                )}
              </div>
            </>
          )}

          {view === 'read' && selectedEmail && (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-2 duration-300">
              <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-white/5">
                 <div className="flex items-center gap-1">
                    <button onClick={() => setView('list')} className="p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[2px] text-slate-500 hover:text-[var(--brand-color)] transition-all"><ArrowLeft size={18}/></button>
                    <button className="p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[2px] text-slate-500 hover:text-rose-500"><Trash size={18}/></button>
                    <button className={`p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[2px] ${selectedEmail.isStarred ? 'text-amber-500' : 'text-slate-500'}`} onClick={(e) => handleToggleStar(e, selectedEmail.id)}><Star size={18} fill={selectedEmail.isStarred ? "currentColor" : "none"}/></button>
                 </div>
                 <div className="flex items-center gap-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    <div className="flex gap-1">
                       <button className="p-1 border border-[var(--border-color)] rounded-[2px] hover:bg-white/5"><ChevronLeft size={16}/></button>
                       <button className="p-1 border border-[var(--border-color)] rounded-[2px] hover:bg-white/5"><ChevronRight size={16}/></button>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-12 no-scrollbar space-y-8 md:space-y-12 bg-white dark:bg-[#050505]">
                 <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-6 flex-1 w-full">
                       <h2 className="text-xl md:text-3xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-tight">{selectedEmail.subject}</h2>
                       <div className="flex items-center gap-4">
                          <img src={selectedEmail.fromAvatar} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[var(--border-color)] bg-white object-cover shadow-xl" />
                          <div className="min-w-0 flex-1">
                             <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black text-[var(--brand-color)] lowercase truncate">{selectedEmail.from}</h3>
                                <ChevronDown size={14} className="text-slate-500 cursor-pointer shrink-0" />
                             </div>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 truncate">TO: {selectedEmail.to.join(', ')}</p>
                          </div>
                       </div>
                    </div>
                    <div className="text-left md:text-right shrink-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[var(--border-color)]">
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{selectedEmail.fullDate}</p>
                       <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-[var(--brand-color)]/10 text-[var(--brand-color)] rounded-sm border border-[var(--brand-color)]/20 text-[8px] font-black uppercase tracking-widest">
                          {selectedEmail.label || 'PROD'}
                       </div>
                    </div>
                 </div>

                 <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="text-[14px] text-slate-600 dark:text-slate-400 leading-[2] font-medium whitespace-pre-wrap font-sans">
                       {selectedEmail.body}
                    </div>
                 </div>

                 {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                    <div className="pt-10 border-t border-[var(--border-color)]">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-3">
                          <Paperclip size={14}/> Attached_Assets
                       </h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedEmail.attachments.map((att, i) => (
                            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2px] overflow-hidden group shadow-sm hover:shadow-xl transition-all">
                               <div className="h-32 bg-[var(--bg-primary)] flex items-center justify-center relative overflow-hidden">
                                  {att.type === 'image' ? (
                                    <img src={att.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                                  ) : (
                                    <File size={48} className="text-slate-700 opacity-20 group-hover:opacity-40 transition-all" />
                                  )}
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                     <button className="p-3 bg-white text-black rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300"><Download size={20}/></button>
                                  </div>
                               </div>
                               <div className="p-4 space-y-3">
                                  <p className="text-[11px] font-black text-slate-800 dark:text-slate-300 truncate uppercase">{att.name}</p>
                                  <div className="flex items-center justify-between">
                                     <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{att.size}</span>
                                     <span className="text-[8px] font-black text-[var(--brand-color)] uppercase tracking-widest bg-[var(--brand-color)]/10 px-1.5 py-0.5 rounded-sm">{att.type}</span>
                                  </div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 )}

                 <div className="pt-12 border-t border-[var(--border-color)] flex flex-wrap gap-4">
                    <button onClick={() => handleReply(selectedEmail)} className="flex-1 md:flex-none px-10 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95 shadow-sm">
                       <Reply size={16} className="rotate-180"/> Reply
                    </button>
                    <button onClick={() => handleForward(selectedEmail)} className="flex-1 md:flex-none px-10 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[var(--brand-color)] hover:text-white transition-all active:scale-95 shadow-sm">
                       Forward <Forward size={16}/>
                    </button>
                 </div>
              </div>
            </div>
          )}

          {view === 'compose' && (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-400">
               <div className="px-6 md:px-8 py-5 border-b border-[var(--border-color)] flex items-center justify-between bg-white/5 backdrop-blur-sm">
                  <h2 className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                     <Plus size={18} className="text-[var(--brand-color)]" /> Initializing_Signal
                  </h2>
                  <button onClick={() => setView('list')} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 md:space-y-8 no-scrollbar bg-white dark:bg-[#050505]">
                  <div className="grid grid-cols-1 gap-4 md:gap-6">
                     <div className="relative group">
                        <input 
                          className="w-full bg-transparent border-b border-[var(--border-color)] py-4 text-sm font-black dark:text-white outline-none focus:border-[var(--brand-color)] tracking-tighter" 
                          placeholder="TO_NODES (Comma separated):" 
                          value={composeTo}
                          onChange={e => setComposeTo(e.target.value)}
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-3 text-[10px] font-black text-slate-500">
                           <button className="hover:text-[var(--brand-color)]">CC</button>
                           <button className="hover:text-[var(--brand-color)]">BCC</button>
                        </div>
                     </div>
                     <div className="relative group">
                        <input 
                          className="w-full bg-transparent border-b border-[var(--border-color)] py-4 text-sm font-black dark:text-white outline-none focus:border-[var(--brand-color)] uppercase tracking-tighter" 
                          placeholder="SUBJECT_MANIFEST:" 
                          value={composeSubject}
                          onChange={e => setComposeSubject(e.target.value)}
                        />
                     </div>
                  </div>

                  {/* Attachment Previews */}
                  {composeAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                       {composeAttachments.map(att => (
                         <div key={att.id} className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-sm flex items-center gap-3 group">
                            {att.type === 'image' ? <ImageIcon size={12}/> : <FileText size={12}/>}
                            <span className="text-[9px] font-black uppercase truncate max-w-[120px]">{att.name}</span>
                            <button onClick={() => removeAttachment(att.id)} className="text-slate-400 hover:text-rose-500"><X size={12}/></button>
                         </div>
                       ))}
                    </div>
                  )}

                  <div className="border border-[var(--border-color)] rounded-[2px] overflow-hidden flex flex-col min-h-[400px] md:min-h-[500px] shadow-2xl">
                     {/* RICH TEXT TACTICAL TOOLBAR */}
                     <div className="flex flex-wrap items-center gap-1 p-2 md:p-3 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] overflow-x-auto no-scrollbar">
                        <button onClick={handleSendEmail} disabled={!composeTo.trim()} className="px-4 py-2 bg-[var(--brand-color)] text-white rounded-[2px] shadow-lg flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mr-4 hover:brightness-110 disabled:opacity-50 shrink-0"><Send size={14}/> Transmit</button>
                        <button className="p-2 hover:bg-white/10 rounded-[2px] text-slate-500"><Redo2 className="rotate-180" size={16}/></button>
                        <div className="w-px h-6 bg-[var(--border-color)] mx-2 shrink-0"></div>
                        <button className="p-2 hover:bg-white/10 rounded-[2px] text-slate-500 font-black">B</button>
                        <button className="p-2 hover:bg-white/10 rounded-[2px] text-slate-500 font-serif italic">I</button>
                        <button className="p-2 hover:bg-white/10 rounded-[2px] text-slate-500 font-serif font-black underline underline-offset-4">U</button>
                        <div className="w-px h-6 bg-[var(--border-color)] mx-2 shrink-0"></div>
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-white/10 rounded-[2px] text-slate-500"><ImageIcon size={16}/></button>
                        <button className="p-2 hover:bg-white/10 rounded-[2px] text-slate-500"><Code size={16}/></button>
                     </div>
                     <textarea 
                        className="flex-1 p-6 md:p-10 bg-transparent outline-none text-[14px] md:text-[15px] dark:text-white font-medium leading-relaxed resize-none font-sans" 
                        placeholder="TYPE MESSAGE PROTOCOL..."
                        value={composeBody}
                        onChange={e => setComposeBody(e.target.value)}
                     ></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-[var(--border-color)] gap-8">
                     <div className="flex items-center gap-6 w-full sm:w-auto">
                        <button 
                          onClick={() => fileInputRef.current?.click()} 
                          className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 py-2.5 border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-[2px] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--brand-color)] hover:border-[var(--brand-color)] transition-all shadow-sm"
                        >
                           <Paperclip size={18}/> Attach_Asset
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          multiple 
                          onChange={handleFileChange} 
                        />
                        <p className="hidden md:block text-[9px] font-black text-slate-400 uppercase tracking-widest">Max_Payload: 32MB</p>
                     </div>
                     <div className="flex flex-col md:flex-row gap-4 w-full sm:w-auto">
                        <div className="flex gap-4">
                           <button onClick={() => setView('list')} className="flex-1 md:flex-none px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-rose-500 transition-colors flex items-center justify-center gap-2"><X size={18}/> Discard</button>
                           <button onClick={handleSaveDraft} className="flex-1 md:flex-none px-8 py-3 border border-[var(--border-color)] rounded-[2px] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-white/5 transition-all flex items-center justify-center gap-2"><FileText size={18}/> Save_Draft</button>
                        </div>
                        <button 
                          onClick={handleSendEmail}
                          disabled={!composeTo.trim()}
                          className="w-full md:w-auto px-12 py-4 bg-[var(--brand-color)] hover:brightness-110 text-white rounded-[2px] text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
                        >
                           Transmit_Signal <Send size={20}/>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FLOATING ACTION BUTTON */}
      {view === 'list' && (
        <button 
          onClick={() => setView('compose')}
          className="lg:hidden fixed bottom-24 right-6 w-14 h-14 bg-[var(--brand-color)] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-[150]"
        >
          <Plus size={28} />
        </button>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .ticker-text { font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
};

export default EmailHub;
