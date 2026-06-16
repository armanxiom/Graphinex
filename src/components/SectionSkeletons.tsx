import type { Key } from 'react';

type SkeletonProps = {
  key?: Key;
  className?: string;
};

function SkeletonBlock({ className = '' }: SkeletonProps) {
  return <div className={`skeleton-shimmer ${className}`} />;
}

function SectionHeaderSkeleton({
  align = 'left',
  width = 'w-1/3',
  subWidth = 'w-2/5'
}: {
  align?: 'left' | 'center';
  width?: string;
  subWidth?: string;
}) {
  return (
    <div className={`mb-8 grid gap-4 ${align === 'center' ? 'justify-items-center text-center' : ''}`}>
      <SkeletonBlock className="h-2.5 w-36 rounded-full" />
      <SkeletonBlock className={`h-12 rounded-[1.1rem] ${width}`} />
      <SkeletonBlock className={`h-4 rounded-full ${subWidth}`} />
    </div>
  );
}

function GridSkeleton({
  cards = 4,
  columns = 'grid-cols-2 md:grid-cols-4',
  aspect = 'aspect-square',
  rounded = 'rounded-[1.5rem]'
}: {
  cards?: number;
  columns?: string;
  aspect?: string;
  rounded?: string;
}) {
  return (
    <div className={`grid gap-3 sm:gap-4 ${columns}`}>
      {Array.from({ length: cards }).map((_, index) => (
        <SkeletonBlock key={index} className={`${aspect} ${rounded}`} />
      ))}
    </div>
  );
}

function CarouselSkeleton({
  cards = 4
}: {
  cards?: number;
}) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: cards }).map((_, index) => (
        <SkeletonBlock
          key={index}
          className="h-[clamp(18rem,48vw,25rem)] w-[78vw] shrink-0 rounded-[1.35rem] sm:w-[32vw] md:w-[24vw]"
        />
      ))}
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-5 backdrop-blur-sm md:rounded-[1.5rem] md:px-5 md:py-6"
        >
          <SkeletonBlock className="h-8 rounded-[0.9rem] w-20" />
          <SkeletonBlock className="mt-3 h-3 rounded-full w-24" />
        </div>
      ))}
    </div>
  );
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="border-t border-white/8">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="border-b border-white/8 bg-[#0a0a0a] px-5 py-6 sm:px-8 sm:py-7 lg:px-16 xl:px-20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="flex items-start gap-4 sm:gap-6">
              <SkeletonBlock className="h-4 w-10 rounded-full" />
              <div className="space-y-3">
                <SkeletonBlock className="h-11 w-[min(18rem,62vw)] rounded-[1rem]" />
                <SkeletonBlock className="h-4 w-[min(32rem,78vw)] rounded-full" />
              </div>
            </div>
            <SkeletonBlock className="hidden h-11 w-11 rounded-full lg:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FooterColumnsSkeleton() {
  return (
    <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr_1fr] md:gap-16">
      <div className="grid gap-4">
        <SkeletonBlock className="h-8 w-28 rounded-full" />
        <SkeletonBlock className="h-4 w-[min(24rem,80%)] rounded-full" />
        <SkeletonBlock className="h-4 w-[min(20rem,65%)] rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="min-h-[13rem] rounded-[1.15rem]" />
        ))}
      </div>
      <div className="grid gap-4">
        <SkeletonBlock className="h-4 w-24 rounded-full" />
        <SkeletonBlock className="h-4 w-36 rounded-full" />
        <SkeletonBlock className="h-4 w-32 rounded-full" />
        <SkeletonBlock className="h-4 w-40 rounded-full" />
      </div>
    </div>
  );
}

export function ShowreelSkeleton() {
  return (
    <section className="theme-panel relative overflow-hidden" aria-hidden="true">
      <div className="container-boxed relative z-10">
        <div className="mx-auto mb-12 max-w-4xl text-center md:mb-14">
          <SectionHeaderSkeleton align="center" width="w-48" subWidth="w-80" />
        </div>
        <SkeletonBlock className="mx-auto aspect-video w-full max-w-6xl rounded-[2rem] border border-white/10" />
        <SkeletonBlock className="mx-auto mt-9 h-3 w-64 rounded-full" />
      </div>
    </section>
  );
}

export function ServicesSkeleton() {
  return (
    <section className="theme-panel relative overflow-hidden py-20 md:py-28" aria-hidden="true">
      <div className="container-boxed relative z-10">
        <div className="mb-12 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <SectionHeaderSkeleton width="w-80" subWidth="w-[min(34rem,78vw)]" />
          </div>
          <SkeletonBlock className="h-12 w-44 rounded-full" />
        </div>
        <ListSkeleton rows={3} />
      </div>
    </section>
  );
}

export function PortfolioSkeleton() {
  return (
    <section className="theme-panel relative overflow-hidden py-20 md:py-28" aria-hidden="true">
      <div className="container-boxed mb-12 md:mb-16">
        <SectionHeaderSkeleton width="w-72" subWidth="w-[min(28rem,68vw)]" />
      </div>
      <div className="container-boxed">
        <GridSkeleton cards={4} />
      </div>
    </section>
  );
}

export function CollectionsSkeleton() {
  return (
    <>
      <section className="theme-panel py-12 sm:py-20" aria-hidden="true">
        <div className="container-boxed">
          <SectionHeaderSkeleton width="w-72" subWidth="w-[min(26rem,68vw)]" />
          <GridSkeleton cards={4} />
        </div>
      </section>
      <section className="theme-panel py-12 sm:py-20" aria-hidden="true">
        <div className="container-boxed">
          <SectionHeaderSkeleton width="w-72" subWidth="w-[min(26rem,68vw)]" />
          <GridSkeleton cards={4} />
        </div>
      </section>
      <section className="theme-panel py-12 sm:py-20" aria-hidden="true">
        <div className="container-boxed">
          <SectionHeaderSkeleton width="w-72" subWidth="w-[min(26rem,68vw)]" />
          <GridSkeleton cards={4} />
        </div>
      </section>
    </>
  );
}

export function ResultsSkeleton() {
  return (
    <section className="theme-panel relative overflow-hidden" aria-hidden="true">
      <div className="container-boxed relative z-10">
        <div className="mb-14 max-w-3xl">
          <SectionHeaderSkeleton width="w-[min(34rem,88vw)]" subWidth="w-[min(24rem,72vw)]" />
        </div>
        <StatSkeleton />
      </div>
    </section>
  );
}

export function TestimonialsSkeleton() {
  return (
    <section className="theme-panel relative overflow-hidden py-20 text-white md:py-28" aria-hidden="true">
      <div className="container-boxed relative z-10">
        <div className="mb-10 max-w-4xl md:mb-14">
          <SectionHeaderSkeleton width="w-[min(38rem,88vw)]" subWidth="w-[min(30rem,72vw)]" />
        </div>
        <div className="mx-auto max-w-5xl">
          <SkeletonBlock className="min-h-[24rem] rounded-[2rem] border border-white/12" />
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-1.5 w-2 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HappyClientsSkeleton() {
  return (
    <section className="happy-clients-section relative overflow-hidden py-20 text-white md:py-28" aria-hidden="true">
      <div className="container-boxed relative z-10">
        <div className="mb-10 max-w-4xl md:mb-14">
          <SectionHeaderSkeleton width="w-[min(40rem,88vw)]" subWidth="w-[min(28rem,68vw)]" />
        </div>
        <CarouselSkeleton cards={4} />
      </div>
    </section>
  );
}

export function ProcessSkeleton() {
  return (
    <section className="theme-panel relative overflow-hidden py-20 md:py-28" aria-hidden="true">
      <div className="container-boxed relative z-10">
        <div className="mb-12 max-w-4xl md:mb-16">
          <SectionHeaderSkeleton width="w-[min(34rem,88vw)]" subWidth="w-[min(24rem,72vw)]" />
        </div>
        <ListSkeleton rows={4} />
      </div>
    </section>
  );
}

export function SocialProofSkeleton() {
  return <div className="pointer-events-none fixed bottom-24 left-4 z-40 hidden md:block" aria-hidden="true" />;
}

export function BehindTheSceneSkeleton() {
  return (
    <section className="relative isolate overflow-hidden bg-[#050505] text-white" aria-hidden="true">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeaderSkeleton width="w-[min(32rem,80vw)]" subWidth="w-[min(28rem,70vw)]" />
        <CarouselSkeleton cards={3} />
      </div>
    </section>
  );
}

export function FooterSkeleton() {
  return (
    <section className="theme-panel relative overflow-hidden px-5 py-12 md:py-[4.5rem]" aria-hidden="true">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:gap-16">
        <FooterColumnsSkeleton />
        <SkeletonBlock className="h-px w-full rounded-full" />
      </div>
    </section>
  );
}

export function PortfolioPageSkeleton() {
  return (
    <div className="min-h-screen bg-brand-light" aria-hidden="true">
      <section className="relative overflow-hidden pb-20 pt-[11rem] md:pt-[13rem]">
        <div className="container-boxed relative z-10 text-center">
          <SectionHeaderSkeleton align="center" width="w-[min(44rem,88vw)]" subWidth="w-[min(28rem,72vw)]" />
        </div>
      </section>
      <section className="bg-[#0c0c0c] py-16 sm:py-20">
        <div className="container-boxed">
          <SkeletonBlock className="aspect-video rounded-[2rem]" />
          <SkeletonBlock className="mx-auto mt-8 h-3 w-72 rounded-full" />
        </div>
      </section>
      <section className="py-12 sm:py-20">
        <div className="container-boxed">
          <SectionHeaderSkeleton width="w-[min(24rem,72vw)]" subWidth="w-[min(18rem,56vw)]" />
          <GridSkeleton cards={4} />
        </div>
      </section>
      <FooterSkeleton />
    </div>
  );
}
