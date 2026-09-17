import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NetLabStateService } from '../services/netlab-state.service';

@Component({
  selector: 'app-subnet-calc',
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
            <mat-icon class="text-sky-400">pin</mat-icon>
            <span>IPv4 Subnet & CIDR Hesaplayıcı</span>
          </h2>
          <p class="text-sm text-slate-400 mt-1">
            Alt ağ maskesi, ağ kimliği, yayın adresi ve kullanılabilir host aralığını anında hesaplayın.
          </p>
        </div>

        <!-- Quick Presets -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="text-slate-400">Hazır Şablonlar:</span>
          <button
            type="button"
            (click)="applyPreset('192.168.1.0', 24)"
            class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition cursor-pointer"
          >
            /24 Ev Ağı (254 Host)
          </button>
          <button
            type="button"
            (click)="applyPreset('10.0.0.0', 26)"
            class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition cursor-pointer"
          >
            /26 Departman (62 Host)
          </button>
          <button
            type="button"
            (click)="applyPreset('172.16.1.0', 30)"
            class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition cursor-pointer"
          >
            /30 Router-to-Router (2 Host)
          </button>
        </div>
      </div>

      <!-- Controls form -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div class="md:col-span-6 space-y-2">
          <label for="ip-address-input" class="block text-xs font-semibold text-slate-300">
            IP Adresi
          </label>
          <div class="relative">
            <input
              id="ip-address-input"
              type="text"
              [value]="ipInput()"
              (input)="onIpChange($any($event.target).value)"
              placeholder="Örn: 192.168.10.0"
              class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>
        </div>

        <div class="md:col-span-6 space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>CIDR Öneki: /{{ cidrInput() }}</span>
            <span class="text-sky-400 font-mono">{{ calcResult()?.netmask || '' }}</span>
          </div>
          <div class="flex items-center gap-3">
            <input
              type="range"
              min="8"
              max="32"
              aria-label="CIDR Alt Ağ Maskesi Seçici"
              [value]="cidrInput()"
              (input)="onCidrChange(+$any($event.target).value)"
              class="w-full accent-sky-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <span class="w-12 text-center text-sm font-mono font-bold text-sky-400 bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-800">
              /{{ cidrInput() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Calculation Result Cards -->
      @if (calcResult(); as res) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Network Address -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span class="text-xs text-slate-400 font-medium flex items-center gap-1">
              <mat-icon class="text-xs text-sky-400">lan</mat-icon> Network ID (Ağ Adresi)
            </span>
            <p class="text-lg font-bold font-mono text-sky-400 mt-1">{{ res.networkAddress }}</p>
            <span class="text-[11px] text-slate-500">İlk adres, ağın kimliğidir</span>
          </div>

          <!-- Broadcast Address -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span class="text-xs text-slate-400 font-medium flex items-center gap-1">
              <mat-icon class="text-xs text-amber-400">podcasts</mat-icon> Broadcast (Yayın Adresi)
            </span>
            <p class="text-lg font-bold font-mono text-amber-400 mt-1">{{ res.broadcastAddress }}</p>
            <span class="text-[11px] text-slate-500">Tüm host bitleri 1 olan son adres</span>
          </div>

          <!-- Usable Hosts -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span class="text-xs text-slate-400 font-medium flex items-center gap-1">
              <mat-icon class="text-xs text-emerald-400">dns</mat-icon> Kullanılabilir Host Sayısı
            </span>
            <p class="text-lg font-bold font-mono text-emerald-400 mt-1">
              {{ res.usableHosts.toLocaleString() }}
            </p>
            <span class="text-[11px] text-slate-500">Toplam {{ res.totalHosts.toLocaleString() }} adres (-2)</span>
          </div>

          <!-- Subnet Mask -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span class="text-xs text-slate-400 font-medium flex items-center gap-1">
              <mat-icon class="text-xs text-indigo-400">tune</mat-icon> Alt Ağ Maskesi
            </span>
            <p class="text-lg font-bold font-mono text-indigo-300 mt-1">{{ res.netmask }}</p>
            <span class="text-[11px] text-slate-500">Wildcard: {{ res.wildcard }}</span>
          </div>
        </div>

        <!-- Detailed Range & Classification -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Usable IP Range -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 class="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <mat-icon class="text-sm text-sky-400">swap_horiz</mat-icon>
              Kullanılabilir IP Aralığı (Host Range)
            </h3>
            <div class="flex items-center justify-between p-3 bg-slate-900 rounded-lg font-mono text-sm border border-slate-800">
              <div>
                <span class="text-[10px] text-slate-500 block">İlk Kullanılabilir Host</span>
                <span class="text-emerald-400 font-bold">{{ res.firstHost }}</span>
              </div>
              <span class="text-slate-600 font-sans">➔</span>
              <div class="text-right">
                <span class="text-[10px] text-slate-500 block">Son Kullanılabilir Host</span>
                <span class="text-emerald-400 font-bold">{{ res.lastHost }}</span>
              </div>
            </div>
          </div>

          <!-- IP Specs -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 class="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <mat-icon class="text-sm text-sky-400">verified</mat-icon>
              IP Sınıfı & RFC Durumu
            </h3>
            <div class="flex items-center justify-between p-3 bg-slate-900 rounded-lg text-xs border border-slate-800">
              <div>
                <span class="text-slate-400">Sınıf:</span>
                <span class="font-bold text-slate-200 ml-1">{{ res.ipClass }} Sınıfı</span>
              </div>
              <div>
                <span class="text-slate-400">Tür:</span>
                <span 
                  class="ml-1 px-2 py-0.5 rounded text-[11px] font-medium font-mono"
                  [class.bg-emerald-950]="res.isPrivate"
                  [class.text-emerald-300]="res.isPrivate"
                  [class.bg-amber-950]="!res.isPrivate"
                  [class.text-amber-300]="!res.isPrivate"
                >
                  {{ res.isPrivate ? 'RFC 1918 Özel (Private)' : 'Genel (Public İnternet)' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Binary Bit Visualization -->
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-300 flex items-center gap-1.5">
              <mat-icon class="text-sm text-sky-400">binary</mat-icon>
              İkilik (Binary 32-Bit) Gösterim & Bit Dağılımı
            </span>
            <div class="flex items-center gap-4 text-[11px]">
              <span class="flex items-center gap-1 text-sky-400">
                <span class="w-2.5 h-2.5 rounded-sm bg-sky-500"></span> Ağ Bitleri ({{ res.cidr }})
              </span>
              <span class="flex items-center gap-1 text-slate-400">
                <span class="w-2.5 h-2.5 rounded-sm bg-slate-600"></span> Host Bitleri ({{ 32 - res.cidr }})
              </span>
            </div>
          </div>

          <div class="p-3 bg-slate-900 rounded-lg space-y-2 font-mono text-xs overflow-x-auto border border-slate-800">
            <div class="flex items-center justify-between min-w-[380px]">
              <span class="text-slate-500 w-28">IP (Binary):</span>
              <span class="text-slate-200 tracking-wider">{{ res.binaryIp }}</span>
            </div>
            <div class="flex items-center justify-between min-w-[380px]">
              <span class="text-slate-500 w-28">Maske (Binary):</span>
              <span class="text-sky-400 tracking-wider">{{ res.binaryMask }}</span>
            </div>
          </div>
        </div>
      } @else {
        <div class="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <mat-icon class="text-sm">error</mat-icon>
          <span>Geçerli bir IPv4 adresi girin (örn: 192.168.1.1). Her oktet 0-255 arasında olmalıdır.</span>
        </div>
      }
    </div>
  `
})
export class SubnetCalcComponent {
  readonly state = inject(NetLabStateService);
  readonly ipInput = signal(this.state.subnetIpInput());
  readonly cidrInput = signal(this.state.subnetCidrInput());
  readonly calcResult = this.state.calculatedSubnet;

  onIpChange(val: string) {
    this.ipInput.set(val);
    this.state.updateSubnet(val, this.cidrInput());
  }

  onCidrChange(cidr: number) {
    this.cidrInput.set(cidr);
    this.state.updateSubnet(this.ipInput(), cidr);
  }

  applyPreset(ip: string, cidr: number) {
    this.ipInput.set(ip);
    this.cidrInput.set(cidr);
    this.state.updateSubnet(ip, cidr);
  }
}
