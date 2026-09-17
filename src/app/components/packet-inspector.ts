import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-packet-inspector',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div class="border-b border-slate-800 pb-4">
        <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
          <mat-icon class="text-indigo-400">layers</mat-icon>
          <span>Paket İnceleme & Enkapsülasyon Analizörü</span>
        </h2>
        <p class="text-sm text-slate-400 mt-1">
          Ağ üzerinden gönderilen bir HTTP Web paketinin Layer 2'den Layer 7'ye başlık yapısını (Headers) ve katman katman paketlenmesini inceleyin.
        </p>
      </div>

      <!-- Interactive Encapsulation Hierarchy -->
      <div class="space-y-3">
        <!-- Layer 2: Ethernet Frame -->
        <button 
          type="button"
          (click)="selectedLayer.set('l2')"
          class="w-full text-left p-4 rounded-xl border transition-all cursor-pointer block"
          [class.bg-slate-950]="selectedLayer() === 'l2'"
          [class.border-indigo-500]="selectedLayer() === 'l2'"
          [class.ring-1]="selectedLayer() === 'l2'"
          [class.ring-indigo-500_30]="selectedLayer() === 'l2'"
          [class.bg-slate-950_60]="selectedLayer() !== 'l2'"
          [class.border-slate-800]="selectedLayer() !== 'l2'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                Layer 2 - Data Link
              </span>
              <span class="text-sm font-bold text-slate-200">Ethernet II Çerçevesi (Frame)</span>
            </div>
            <span class="text-xs font-mono text-slate-400">14 Byte Başlık + 4 Byte FCS</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs font-mono">
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">Hedef MAC (Dst)</span>
              <span class="text-indigo-300">00:1a:2b:3c:4d:5e</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">Kaynak MAC (Src)</span>
              <span class="text-indigo-300">52:54:00:12:34:56</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">EtherType</span>
              <span class="text-indigo-300">0x0800 (IPv4)</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">Hata Kontrolü (CRC)</span>
              <span class="text-emerald-400">FCS: 0x4A1F89B2</span>
            </div>
          </div>
        </button>

        <!-- Layer 3: IPv4 Packet -->
        <button 
          type="button"
          (click)="selectedLayer.set('l3')"
          class="w-full text-left p-4 rounded-xl border transition-all cursor-pointer block ml-0 sm:ml-4"
          [class.bg-slate-950]="selectedLayer() === 'l3'"
          [class.border-sky-500]="selectedLayer() === 'l3'"
          [class.ring-1]="selectedLayer() === 'l3'"
          [class.ring-sky-500_30]="selectedLayer() === 'l3'"
          [class.bg-slate-950_60]="selectedLayer() !== 'l3'"
          [class.border-slate-800]="selectedLayer() !== 'l3'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
                Layer 3 - Network
              </span>
              <span class="text-sm font-bold text-slate-200">IPv4 Başlığı (Packet)</span>
            </div>
            <span class="text-xs font-mono text-slate-400">20 Byte Sabit Başlık</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs font-mono">
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">Kaynak IP (Src IP)</span>
              <span class="text-sky-300 font-bold">192.168.1.10</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">Hedef IP (Dst IP)</span>
              <span class="text-sky-300 font-bold">10.0.0.50</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">TTL (Time to Live)</span>
              <span class="text-amber-400">64 Sekme (Hop)</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">Protokol</span>
              <span class="text-sky-300">6 (TCP)</span>
            </div>
          </div>
        </button>

        <!-- Layer 4: TCP Segment -->
        <button 
          type="button"
          (click)="selectedLayer.set('l4')"
          class="w-full text-left p-4 rounded-xl border transition-all cursor-pointer block ml-0 sm:ml-8"
          [class.bg-slate-950]="selectedLayer() === 'l4'"
          [class.border-emerald-500]="selectedLayer() === 'l4'"
          [class.ring-1]="selectedLayer() === 'l4'"
          [class.ring-emerald-500_30]="selectedLayer() === 'l4'"
          [class.bg-slate-950_60]="selectedLayer() !== 'l4'"
          [class.border-slate-800]="selectedLayer() !== 'l4'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Layer 4 - Transport
              </span>
              <span class="text-sm font-bold text-slate-200">TCP Segment Başlığı</span>
            </div>
            <span class="text-xs font-mono text-slate-400">20-60 Byte Başlık</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs font-mono">
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">Kaynak Port (Client)</span>
              <span class="text-emerald-300 font-bold">54322 (Dinamik)</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">Hedef Port (Server)</span>
              <span class="text-emerald-300 font-bold">80 (HTTP)</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">Sıra / Onay (Seq/Ack)</span>
              <span class="text-slate-300">Seq=1001, Ack=1</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800">
              <span class="text-[10px] text-slate-500 block">Aktif Bayraklar (Flags)</span>
              <span class="text-rose-400">[ACK, PSH]</span>
            </div>
          </div>
        </button>

        <!-- Layer 7: Application Payload -->
        <button 
          type="button"
          (click)="selectedLayer.set('l7')"
          class="w-full text-left p-4 rounded-xl border transition-all cursor-pointer block ml-0 sm:ml-12"
          [class.bg-slate-950]="selectedLayer() === 'l7'"
          [class.border-amber-500]="selectedLayer() === 'l7'"
          [class.ring-1]="selectedLayer() === 'l7'"
          [class.ring-amber-500_30]="selectedLayer() === 'l7'"
          [class.bg-slate-950_60]="selectedLayer() !== 'l7'"
          [class.border-slate-800]="selectedLayer() !== 'l7'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                Layer 7 - Application
              </span>
              <span class="text-sm font-bold text-slate-200">HTTP / Veri Yükü (Data Payload)</span>
            </div>
            <span class="text-xs font-mono text-slate-400">Ham Kullanıcı Verisi</span>
          </div>

          <div class="bg-slate-900 p-3 rounded-lg border border-slate-800 mt-3 font-mono text-xs text-amber-300 leading-relaxed overflow-x-auto">
            GET /api/status HTTP/1.1<br/>
            Host: lab.local<br/>
            User-Agent: NetLab/2.5 (CLI Inspector)<br/>
            Accept: application/json<br/>
            Connection: keep-alive
          </div>
        </button>
      </div>

      <!-- Explanatory note about selected layer -->
      <div class="p-4 bg-slate-950 border border-slate-800 rounded-xl">
        <h3 class="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <mat-icon class="text-sm text-sky-400">info</mat-icon>
          Seçili Katman Sorumluluğu & Dönüşüm Süreci
        </h3>
        <p class="text-xs text-slate-400 leading-relaxed">
          @switch (selectedLayer()) {
            @case ('l2') {
              Ethernet Katmanı (L2), veriyi yerel ağ kartları (NIC) ve Switch'ler arasında iletir. Router veya bir sonraki sekmenin (next-hop) MAC adresi buraya yazılır. Paket router'dan geçerken L2 başlığı sökülür ve yeni çıkış arayüzünün MAC adresiyle yeniden yazılır!
            }
            @case ('l3') {
              IP Katmanı (L3), paketin uçtan uca (kaynak istemciden hedef sunucuya kadar) yönlendirilmesinden sorumludur. Router'lar yönlendirme yaparken L3 Kaynak ve Hedef IP adreslerini asla değiştirmez (NAT uygulanmadığı sürece). TTL değeri her router geçişinde 1 azaltılır.
            }
            @case ('l4') {
              TCP Katmanı (L4), port numaraları sayesinde aynı bilgisayarda çalışan onlarca uygulamanın birbirinden ayrılmasını (multiplexing) sağlar. Kaynak port rastgele dinamik bir port (54322) atanırken, hedef port iyi bilinen HTTP portudur (80).
            }
            @case ('l7') {
              Uygulama Katmanı (L7), doğrudan web tarayıcısı, curl veya API istemcisi tarafından üretilen metinsel veya ikilik içeriktir. Alt katmanlar bu verinin içeriğiyle ilgilenmez, sadece güvenle taşır.
            }
          }
        </p>
      </div>
    </div>
  `
})
export class PacketInspectorComponent {
  readonly selectedLayer = signal<'l2' | 'l3' | 'l4' | 'l7'>('l3');
}
