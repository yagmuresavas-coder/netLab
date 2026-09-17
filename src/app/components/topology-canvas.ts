import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NetLabStateService } from '../services/netlab-state.service';
import { TopologyNode } from '../models/network.types';

@Component({
  selector: 'app-topology-canvas',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full bg-slate-950 rounded-xl border border-slate-800 p-4 min-h-[260px] overflow-hidden select-none">
      <!-- Grid pattern background -->
      <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <!-- Header status & legend -->
      <div class="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800 text-xs">
        <div class="flex items-center gap-2 text-slate-300 font-medium">
          <mat-icon class="text-sky-400 text-sm">device_hub</mat-icon>
          <span>Canlı Ağ Topolojisi</span>
        </div>
        <div class="flex items-center gap-4 text-[11px] text-slate-400">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Çevrimiçi
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Yapılandırma Gerekli
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-sky-400"></span> Paket Akışı
          </span>
        </div>
      </div>

      <!-- Links visualizer (SVG) -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
        @for (link of currentLab()?.topology?.links || []; track $index) {
          @let nFrom = getNode(link.from);
          @let nTo = getNode(link.to);
          @if (nFrom && nTo) {
            <line
              [attr.x1]="nFrom.x + '%'"
              [attr.y1]="nFrom.y + '%'"
              [attr.x2]="nTo.x + '%'"
              [attr.y2]="nTo.y + '%'"
              stroke="#334155"
              stroke-width="2.5"
              stroke-dasharray="4 4"
            />
          }
        }
      </svg>

      <!-- Nodes layer -->
      <div class="relative z-10 w-full h-[190px]">
        @for (node of currentLab()?.topology?.nodes || []; track node.id) {
          @let dynamicStatus = getNodeStatus(node.id, node.status);
          @let isSelected = state.activeDeviceId() === node.id;
          
          <button
            type="button"
            class="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105 p-0 bg-transparent border-0 text-left"
            [style.left]="node.x + '%'"
            [style.top]="node.y + '%'"
            (click)="onNodeClick(node.id)"
          >
            <div 
              class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl backdrop-blur-md border transition-all"
              [class.bg-slate-900]="!isSelected"
              [class.bg-slate-800]="isSelected"
              [class.border-sky-500]="isSelected"
              [class.ring-2]="isSelected"
              [class.ring-sky-400_30]="isSelected"
              [class.border-slate-700]="!isSelected"
            >
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center text-white relative shadow-sm"
                [class.bg-indigo-600]="node.type === 'switch'"
                [class.bg-amber-600]="node.type === 'router'"
                [class.bg-sky-600]="node.type === 'pc'"
                [class.bg-emerald-600]="node.type === 'server'"
                [class.bg-rose-600]="node.type === 'firewall'"
              >
                <mat-icon class="text-xl">
                  @switch (node.type) {
                    @case ('router') { alt_route }
                    @case ('switch') { hub }
                    @case ('pc') { computer }
                    @case ('server') { dns }
                    @case ('firewall') { security }
                    @default { devices }
                  }
                </mat-icon>
                
                <!-- Status dot -->
                <span 
                  class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950"
                  [class.bg-emerald-400]="dynamicStatus === 'online'"
                  [class.bg-amber-400]="dynamicStatus === 'misconfigured'"
                  [class.animate-pulse]="dynamicStatus === 'misconfigured'"
                ></span>
              </div>

              <!-- Node labels -->
              <span class="text-xs font-semibold text-slate-200 whitespace-nowrap">{{ node.name }}</span>
              <span class="text-[10px] text-slate-400 font-mono">
                {{ getNodeSubtext(node) }}
              </span>
            </div>
          </button>
        }

        <!-- Animated packet flow notification -->
        @if (state.packetFlow(); as flow) {
          <div class="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 shadow-lg backdrop-blur-md transition-all border"
            [class.bg-emerald-950_80]="flow.success"
            [class.border-emerald-500_50]="flow.success"
            [class.text-emerald-300]="flow.success"
            [class.bg-rose-950_80]="!flow.success"
            [class.border-rose-500_50]="!flow.success"
            [class.text-rose-300]="!flow.success"
          >
            <mat-icon class="text-sm animate-spin">
              {{ flow.success ? 'sync' : 'error_outline' }}
            </mat-icon>
            <span>{{ flow.label }}: {{ flow.from }} ➔ {{ flow.to }} ({{ flow.success ? 'İletildi' : 'Paket Düştü' }})</span>
          </div>
        }
      </div>
    </div>
  `
})
export class TopologyCanvasComponent {
  readonly state = inject(NetLabStateService);
  readonly currentLab = this.state.activeLab;

  getNode(id: string): TopologyNode | undefined {
    return this.currentLab()?.topology.nodes.find(n => n.id === id);
  }

  getNodeStatus(nodeId: string, initialStatus: 'online' | 'misconfigured' | 'offline'): 'online' | 'misconfigured' | 'offline' {
    const labId = this.state.activeLabId();
    const devStates = this.state.labDeviceStates();

    if (labId === 'lab-routing-gateway' && nodeId === 'pc1') {
      return devStates['pc1']?.gateway === '192.168.1.1' ? 'online' : 'misconfigured';
    }
    if (labId === 'lab-vlan-trunk' && nodeId === 'pc_dev') {
      return devStates['sw1']?.vlan === 20 ? 'online' : 'misconfigured';
    }
    if (labId === 'lab-dns-resolution' && nodeId === 'client_pc') {
      return devStates['client_pc']?.dns === '192.168.1.5' ? 'online' : 'misconfigured';
    }
    if (labId === 'lab-firewall-iptables' && nodeId === 'fw_node') {
      const rules = devStates['fw_node']?.firewallRules || [];
      return rules.some(r => r.includes('dport 80')) ? 'online' : 'misconfigured';
    }
    return initialStatus;
  }

  getNodeSubtext(node: TopologyNode): string {
    const labId = this.state.activeLabId();
    const devStates = this.state.labDeviceStates();

    if (labId === 'lab-routing-gateway' && node.id === 'pc1') {
      const gw = devStates['pc1']?.gateway || '192.168.1.254';
      return `GW: ${gw}`;
    }
    if (labId === 'lab-vlan-trunk') {
      if (node.id === 'pc_dev') {
        const v = devStates['sw1']?.vlan || 10;
        return `VLAN: ${v}`;
      }
    }
    if (labId === 'lab-dns-resolution' && node.id === 'client_pc') {
      const dns = devStates['client_pc']?.dns || '192.168.1.99';
      return `DNS: ${dns}`;
    }
    return node.ip || (node.vlan ? `VLAN ${node.vlan}` : node.type.toUpperCase());
  }

  onNodeClick(nodeId: string) {
    const lab = this.currentLab();
    const existsInCli = lab?.cliDevices.some(d => d.id === nodeId);
    if (existsInCli) {
      this.state.selectDevice(nodeId);
    }
  }
}
