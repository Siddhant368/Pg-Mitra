"use client";

import React from "react";
import Image from "next/image";
import {
  Home,
  IndianRupee,
  ShieldCheck,
  Leaf,
} from "lucide-react";

interface AuthLayoutProps {
  headline: string | React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthLayout({
  headline,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#FAFAF8] font-sans text-ink selection:bg-mint-400/30 lg:grid lg:grid-cols-[55%_45%]">

      {/* =====================================================
          LEFT SIDE - HERO
      ====================================================== */}
      <div className="relative hidden min-h-screen overflow-hidden bg-[#064E4A] lg:flex lg:flex-col lg:rounded-tr-[40px]">

        {/* =================================================
            HERO IMAGE
        ================================================== */}
        <div className="absolute inset-0 z-0">

          <Image
            src="/images/login_image.png"
            alt="Modern PG room"
            fill
            priority
            sizes="55vw"
            className="object-cover object-[65%_center]"
          />

          {/* Main teal overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#064E4A] via-[#064E4A]/80 to-[#064E4A]/20" />

          {/* Bottom dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#043F3C]/95 via-transparent to-[#064E4A]/20" />

          {/* Soft radial lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(45,212,191,0.20),transparent_42%)]" />

          {/* Left readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#043F3C]/60 via-transparent to-transparent" />
        </div>

        {/* =================================================
            DECORATIVE BLOBS
        ================================================== */}

        <div
          className="
            absolute
            -bottom-32
            -left-32
            z-[1]
            h-[450px]
            w-[450px]
            rounded-full
            bg-[#14B8A6]/20
            blur-3xl
            animate-[pulse_10s_ease-in-out_infinite]
          "
        />

        <div
          className="
            absolute
            -right-32
            top-1/4
            z-[1]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[#064E4A]/40
            blur-3xl
          "
        />

        {/* =================================================
            TOP LEFT BRAND
        ================================================== */}

        <div className="relative z-20 p-10 xl:p-12">

          <div className="mb-2 flex items-center gap-2 text-white">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
              <Home className="h-6 w-6 text-emerald-300" />
            </div>

            <span className="text-2xl tracking-tight">
              <span className="font-bold">PG</span>
              <span className="text-emerald-300">Mitra</span>
            </span>

          </div>

          <p className="text-sm font-medium tracking-wide text-emerald-200/80">
            Better Stays · Easier Management
          </p>

        </div>

        {/* =================================================
            CENTER HERO CONTENT
        ================================================== */}

        <div className="relative z-20 flex flex-1 flex-col justify-center px-10 pb-20 xl:px-12">

          <div className="max-w-[650px]">

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-lg xl:text-5xl">

              {headline}

            </h1>

            {/* Subtitle */}
            <p className="mb-2 max-w-xl text-base leading-relaxed text-white/90 xl:text-lg">
              {subtitle}
            </p>

            <p className="mb-10 text-sm text-emerald-200/80">
              Simple, smart and digital.
            </p>

            {/* =================================================
                FEATURES
            ================================================== */}

            <div className="grid max-w-[560px] grid-cols-3 gap-3">

              {/* Manage Rooms */}
              <div
                className="
                  group
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  px-3
                  py-4
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white/15
                "
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15">
                  <Home className="h-5 w-5 text-emerald-300 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <span className="text-center text-xs font-medium leading-tight text-white/90">
                  Manage
                  <br />
                  Rooms
                </span>
              </div>


              {/* Handle Rent */}
              <div
                className="
                  group
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  px-3
                  py-4
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white/15
                "
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15">
                  <IndianRupee className="h-5 w-5 text-emerald-300 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <span className="text-center text-xs font-medium leading-tight text-white/90">
                  Handle
                  <br />
                  Rent
                </span>
              </div>

              {/* Safe & Secure */}
              <div
                className="
                  group
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  px-3
                  py-4
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white/15
                "
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15">
                  <ShieldCheck className="h-5 w-5 text-emerald-300 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <span className="text-center text-xs font-medium leading-tight text-white/90">
                  Safe &
                  <br />
                  Secure
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            SMARTER PG MANAGEMENT
        ================================================== */}

        

        <div className="absolute bottom-12 left-12 z-20">
  <div className="relative inline-block -rotate-3">
    <span
      className="
        block
        font-[cursive]
        text-[25px]
        font-medium
        italic
        leading-[1.15]
        tracking-wide
        text-white/90
      "
    >
      “Smarter PG
      <br />
      Management”
    </span>

    <svg
      className="absolute -bottom-5 left-8 w-[135px]"
      viewBox="0 0 140 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 10C35 3 92 4 136 1"
        stroke="#2DD4BF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </div>
</div>

      </div>

      {/* =====================================================
          RIGHT SIDE - LOGIN
      ====================================================== */}

      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-y-auto bg-[#FAFAF8] p-6 sm:p-10 lg:p-12">

        {/* =================================================
            MOBILE LOGO
        ================================================== */}

        <div className="absolute left-6 top-7 flex items-center gap-2 text-ink lg:hidden">

          <Home className="h-6 w-6 text-forest-600" />

          <span className="text-xl tracking-tight">
            <span className="font-bold">PG</span>
            <span className="text-forest-600">Mitra</span>
          </span>

        </div>

        {/* =================================================
            SECURE LOGIN
        ================================================== */}

        <div className="absolute right-6 top-7 flex items-center gap-3 text-right sm:right-8 sm:top-8">

          

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 shadow-sm">

            <ShieldCheck className="h-5 w-5 text-forest-600" />

          </div>

        </div>

        {/* =================================================
            BACKGROUND DECORATIONS
        ================================================== */}

        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-400/5 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-forest-600/5 blur-3xl" />

        {/* =================================================
            MAIN LOGIN CONTENT
        ================================================== */}

        <div className="relative z-10 mt-16 w-full max-w-[420px] lg:mt-0">

          {children}

        </div>

        {/* =================================================
            MANAGE · GROW · SUCCEED
        ================================================== */}

        <div className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2">

          <div className="flex flex-col items-center">

            <Leaf className="mb-1 h-4 w-4 text-emerald-500/80" />

            <div className="relative">

              <p
                className="
                  whitespace-nowrap
                  font-caveat
                  text-xl
                  italic
                  tracking-wide
                  text-forest-900/70
                "
              >
                Manage
                <span className="mx-2 text-emerald-500">·</span>
                Grow
                <span className="mx-2 text-emerald-500">·</span>
                Succeed
              </p>

              {/* Handwritten underline */}
              <svg
                className="absolute -bottom-2 left-1/2 h-3 w-[125px] -translate-x-1/2 text-emerald-400/70"
                viewBox="0 0 130 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 C30 2, 90 4, 128 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}