import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Coins } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              PARKIRKAN
            </span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Fitur
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Harga
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimoni
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto grid min-h-[calc(100vh-4rem)] grid-cols-1 gap-12 px-4 py-24 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Solusi Parkir <br />
              <span className="text-primary">Cerdas & Aman</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Kelola area parkir Anda dengan efisiensi tinggi. Pantau kendaraan,
              transaksi, dan petugas dalam satu dashboard terintegrasi.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Mulai Sekarang <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/50 lg:aspect-video">
            {/* Placeholder for Hero Image */}
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-muted-foreground">
              <span className="text-lg font-medium">Hero Image Visualization</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto py-24 px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Fitur Unggulan</h2>
            <p className="mt-4 text-muted-foreground">Semua yang Anda butuhkan untuk manajemen parkir modern.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Keamanan Terjamain",
                description: "Sistem pencatatan terperinci dengan identifikasi kendaraan yang akurat."
              },
              {
                icon: Clock,
                title: "Real-time Monitoring",
                description: "Pantau ketersediaan slot parkir dan aktivitas petugas secara langsung."
              },
              {
                icon: Coins,
                title: "Keuangan Transparan",
                description: "Laporan transaksi harian, mingguan, dan bulanan yang akuntabel."
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center rounded-lg border bg-card p-8 text-center shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Parkirkan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
