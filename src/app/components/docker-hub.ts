import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-docker-hub',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Hero Banner -->
      <div class="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-800/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-900/60 text-sky-300 border border-sky-700 text-xs font-semibold mb-3">
            <mat-icon class="text-sm">cloud_off</mat-icon>
            <span>Harici Sunucuya / Buluta Gerek Yok • 100% Yerel & Docker Uyumlu</span>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">
            NetLab'ı Docker ile Çalıştırın ve Arkadaşlarınızla Paylaşın
          </h2>
          <p class="text-slate-300 text-sm mt-2 leading-relaxed">
            Bu platform tamamen bağımsız, modüler ve hafif bir yapıda inşa edilmiştir. Harici bir veri tabanına veya pahalı sunuculara ihtiyaç duymadan, projedeki <code class="text-sky-300 bg-slate-950/80 px-1.5 py-0.5 rounded font-mono">Dockerfile</code> ve <code class="text-sky-300 bg-slate-950/80 px-1.5 py-0.5 rounded font-mono">docker-compose.yml</code> dosyaları sayesinde arkadaşlarınız tek bir komutla kendi bilgisayarlarında veya yerel ağınızda (LAN) çalıştırabilir.
          </p>
        </div>
      </div>

      <!-- 3-Step Quick Launch -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Step 1 -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div class="w-8 h-8 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow">
            1
          </div>
          <h3 class="text-base font-semibold text-slate-100">Proje Dosyalarını Alın</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            NetLab klasörünü arkadaşınıza gönderin veya Git deposundan klonlamasını sağlayın.
          </p>
          <div class="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
            <span class="truncate">cd netlab</span>
            <button
              type="button"
              (click)="copyCode('cd netlab', 'step1')"
              class="text-sky-400 hover:text-sky-300 cursor-pointer ml-2"
              title="Kopyala"
            >
              <mat-icon class="text-sm">{{ copiedKey() === 'step1' ? 'done' : 'content_copy' }}</mat-icon>
            </button>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
            2
          </div>
          <h3 class="text-base font-semibold text-slate-100">Docker ile Başlatın</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Tek komutla imajı inşa edip arka planda çalıştırın (Port 3000).
          </p>
          <div class="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 flex items-center justify-between">
            <span class="truncate">docker compose up -d</span>
            <button
              type="button"
              (click)="copyCode('docker compose up -d', 'step2')"
              class="text-sky-400 hover:text-sky-300 cursor-pointer ml-2"
              title="Kopyala"
            >
              <mat-icon class="text-sm">{{ copiedKey() === 'step2' ? 'done' : 'content_copy' }}</mat-icon>
            </button>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow">
            3
          </div>
          <h3 class="text-base font-semibold text-slate-100">Tarayıcıdan Açın</h3>
          <p class="text-xs text-slate-400 leading-relaxed">
            Tarayıcınızda veya yerel ağdaki (LAN/Wi-Fi) tüm cihazlardan erişin.
          </p>
          <div class="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
            <span class="truncate">http://localhost:3000</span>
            <button
              type="button"
              (click)="copyCode('http://localhost:3000', 'step3')"
              class="text-sky-400 hover:text-sky-300 cursor-pointer ml-2"
              title="Kopyala"
            >
              <mat-icon class="text-sm">{{ copiedKey() === 'step3' ? 'done' : 'content_copy' }}</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Local Network Sharing Guide -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div class="flex items-center gap-2 text-slate-100 font-bold text-lg">
          <mat-icon class="text-emerald-400">wifi</mat-icon>
          <span>Yerel Ağdaki (Wi-Fi / LAN) Arkadaşlarınızın Erişmesi İçin</span>
        </div>
        <p class="text-sm text-slate-300 leading-relaxed">
          Eğer siz kendi bilgisayarınızda Docker'ı başlattıysanız, aynı Wi-Fi ağına bağlı arkadaşlarınızın bilgisayarlarında veya telefonlarında herhangi bir şey kurmalarına gerek yoktur! Doğrudan sizin yerel IP adresiniz üzerinden bağlanabilirler:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span class="text-slate-400 font-sans font-semibold block">Windows Kullanıcıları İçin:</span>
            <div class="text-slate-200">1. CMD'ye <code class="text-sky-400">ipconfig</code> yazın.</div>
            <div class="text-slate-200">2. "IPv4 Address" satırını bulun (örn: 192.168.1.45).</div>
            <div class="text-emerald-400 font-bold">3. Arkadaşınıza Verin: http://192.168.1.45:3000</div>
          </div>

          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span class="text-slate-400 font-sans font-semibold block">Mac & Linux Kullanıcıları İçin:</span>
            <div class="text-slate-200">1. Terminalde <code class="text-sky-400">ip a</code> veya <code class="text-sky-400">ifconfig</code> yazın.</div>
            <div class="text-slate-200">2. "inet" altındaki IP'yi bulun (örn: 192.168.1.72).</div>
            <div class="text-emerald-400 font-bold">3. Arkadaşınıza Verin: http://192.168.1.72:3000</div>
          </div>
        </div>
      </div>

      <!-- Included Docker Configurations Preview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Dockerfile View -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <mat-icon class="text-sky-400 text-sm">description</mat-icon>
              <span class="text-xs font-bold text-slate-200 font-mono">Dockerfile (Hazır Entegre)</span>
            </div>
            <button
              type="button"
              (click)="copyCode(dockerfileContent, 'dockerfile')"
              class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs flex items-center gap-1 cursor-pointer transition border border-slate-700"
            >
              <mat-icon class="text-xs">{{ copiedKey() === 'dockerfile' ? 'done' : 'content_copy' }}</mat-icon>
              <span>{{ copiedKey() === 'dockerfile' ? 'Kopyalandı' : 'Kopyala' }}</span>
            </button>
          </div>
          <pre class="bg-slate-950 p-3 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed max-h-64">{{ dockerfileContent }}</pre>
        </div>

        <!-- docker-compose.yml View -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <mat-icon class="text-indigo-400 text-sm">settings_suggest</mat-icon>
              <span class="text-xs font-bold text-slate-200 font-mono">docker-compose.yml (Hazır Entegre)</span>
            </div>
            <button
              type="button"
              (click)="copyCode(composeContent, 'compose')"
              class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs flex items-center gap-1 cursor-pointer transition border border-slate-700"
            >
              <mat-icon class="text-xs">{{ copiedKey() === 'compose' ? 'done' : 'content_copy' }}</mat-icon>
              <span>{{ copiedKey() === 'compose' ? 'Kopyalandı' : 'Kopyala' }}</span>
            </button>
          </div>
          <pre class="bg-slate-950 p-3 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800/80 leading-relaxed max-h-64">{{ composeContent }}</pre>
        </div>
      </div>
    </div>
  `
})
export class DockerHubComponent {
  readonly copiedKey = signal<string | null>(null);

  readonly dockerfileContent = `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/app/server/server.mjs"]`;

  readonly composeContent = `version: '3.8'

services:
  netlab:
    build: .
    image: netlab-platform:latest
    container_name: netlab_server
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production`;

  copyCode(text: string, key: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    this.copiedKey.set(key);
    setTimeout(() => {
      this.copiedKey.set(null);
    }, 2000);
  }
}
