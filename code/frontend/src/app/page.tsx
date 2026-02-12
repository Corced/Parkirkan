'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  MapPin,
  Building2,
  Hospital,
  School,
  Hotel
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0F5FF]">
      {/* Navbar */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between sticky top-0 bg-[#F0F5FF]/80 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-[#111827] tracking-tighter">PARKIRKAN</span>
        </Link>
        <nav className="hidden md:flex gap-10">
          <Link href="#manual" className="text-sm font-black text-black">Manual</Link>
          <Link href="#fitur" className="text-sm font-black text-black">Fitur</Link>
        </nav>
        <Link href="/login">
          <Button className="bg-[#2563EB] hover:bg-blue-700 text-white font-black px-12 rounded-lg text-sm h-11">
            Masuk
          </Button>
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#111827] leading-[1.1] tracking-tight">
            Aplikasi Manajemen <br />
            <span className="text-[#111827]">Parkir Online</span>
          </h1>
          <p className="text-lg font-bold text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sistem manajemen parkir terintegrasi untuk pemantauan <br />
            kapasitas dan laporan pendapatan secara real-time.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-[#2563EB] hover:bg-blue-700 text-white font-black px-10 py-7 rounded-lg text-lg shadow-lg shadow-blue-500/30">
              Mulai Sekarang
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section id="fitur" className="py-24 bg-[#1F2937] text-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-black text-center mb-16 tracking-tight">Fitur Utama Aplikasi</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                { title: 'Real-Time Monitoring', desc: 'Pantau kapasitas parkir, kendaraan masuk keluar secara langsung tanpa delay.', icon: Activity, bg: 'bg-green-50', iconColor: 'text-green-600' },
                { title: 'Tarif Fleksibel', desc: 'Atur tarif parkir per jam dan maksimal harian untuk berbagai jenis kendaraan.', icon: CreditCard, bg: 'bg-purple-50', iconColor: 'text-purple-600' },
                { title: 'Manajemen Area', desc: 'Kelola multiple area parkir dengan tracking kapasitas masing-masing zona.', icon: MapPin, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
                { title: 'Log Aktivitas', desc: 'Tracking semua aktivitas user untuk audit dan keamanan sistem.', icon: FileText, bg: 'bg-green-50', iconColor: 'text-green-600' },
                { title: 'Cetak Struk Otomatis', desc: 'Generate dan print struk parkir secara otomatis untuk setiap transaksi.', icon: LayoutDashboard, bg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
                { title: 'Rekap Transaksi', desc: 'Laporan pendapatan lengkap dengan filter waktu dan ekspor ke berbagai format.', icon: CreditCard, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
              ].map((f, idx) => (
                <div key={idx} className="bg-[#F9FAFB] p-8 rounded-xl border-b-8 border-[#374151] shadow-xl group hover:-translate-y-2 transition-transform">
                  <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center mb-6 border", f.bg)}>
                    <f.icon className={cn("h-6 w-6", f.iconColor)} />
                  </div>
                  <h3 className="text-xl font-black text-black mb-4">{f.title}</h3>
                  <p className="text-slate-800 font-bold text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Users Section */}
        <section className="py-24 bg-[#111827] text-white overflow-hidden">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-black mb-16 tracking-tight">Siapa yang Menggunakan PARKIRKAN?</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
              {[
                { label: 'Mall & Shopping Center', icon: Building2, desc: 'Kelola ratusan slot dengan mudah' },
                { label: 'Gedung Perkantoran', icon: LayoutDashboard, desc: 'Sistem parkir karyawan & tamu' },
                { label: 'Rumah Sakit', icon: Hospital, desc: 'Prioritas parkir darurat' },
                { label: 'Kampus & Sekolah', icon: School, desc: 'Parkir mahasiswa & staf' },
                { label: 'Hotel & Resort', icon: Hotel, desc: 'Parkir tamu & valet' },
              ].map((s, idx) => (
                <div key={idx} className="space-y-4 flex flex-col items-center group">
                  <div className="h-16 w-16 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:bg-blue-600/20 group-hover:border-blue-500 transition-colors">
                    <s.icon className="h-8 w-8 text-blue-400 group-hover:text-blue-300" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm tracking-tight">{s.label}</h4>
                    <p className="text-[10px] font-bold text-slate-700 tracking-widest">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="manual" className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <h2 className="text-4xl lg:text-5xl font-black text-[#111827] mb-20 tracking-tight leading-none">Cara Kerja Aplikasi</h2>
            <div className="space-y-20 relative">
              {/* Decorative line */}
              <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-slate-100 -translate-x-1/2 hidden lg:block" />

              {[
                { title: 'Masuk & Setup', desc: 'Masuk & Konfigurasikan area parkir, tarif, dan user sesuai kebutuhan bisnis Anda.' },
                { title: 'Kelola Transaksi', desc: 'Proses check-in/out kendaraan secara real-time dengan cetak struk otomatis untuk setiap transaksi.' },
                { title: 'Monitor & Analisis', desc: 'Pantau kapasitas dan analisis pendapatan dengan dashboard lengkap dan laporan detail.' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col lg:flex-row items-center gap-12 text-left relative z-10 lg:even:flex-row-reverse">
                  <div className={cn(
                    "h-32 w-32 rounded-full flex items-center justify-center shrink-0 border-8 border-white shadow-2xl text-white text-6xl font-black",
                    idx === 0 ? "bg-pink-500" : idx === 1 ? "bg-orange-500" : "bg-slate-800"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="space-y-4 flex-1 text-center lg:text-left">
                    <h3 className="text-2xl font-black text-[#111827]">{step.title}</h3>
                    <p className="text-slate-600 font-bold text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-[#1F2937] text-white text-center">
          <div className="container mx-auto px-6 space-y-10">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">Siap Modernisasi Sistem <br /> Parkir Anda?</h2>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-black text-slate-700 tracking-widest hover:text-white transition-colors"
            >
              Bagian Laman teratas
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 border-t bg-[#EBEDF2]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-2xl font-black text-[#111827] tracking-tighter opacity-30">PARKIRKAN</span>
          <p className="text-xs font-bold text-slate-700">
            © 2025 Parkirkan. <span className="text-black">Aplikasi Manajemen Parkir Online</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
