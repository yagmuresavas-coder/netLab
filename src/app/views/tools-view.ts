import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SubnetCalcComponent } from '../components/subnet-calc';
import { PacketInspectorComponent } from '../components/packet-inspector';

@Component({
  selector: 'app-tools-view',
  imports: [CommonModule, MatIconModule, SubnetCalcComponent, PacketInspectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Tool Selector Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
            <mat-icon class="text-sky-400">build</mat-icon>
            <span>Pratik Ağ Hesaplama ve Analiz Araçları</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Alt ağ hesaplama motoru ve L2-L7 paket enkapsülasyon inceleme aracı.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="activeTool.set('subnet')"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            [class.bg-sky-500]="activeTool() === 'subnet'"
            [class.text-white]="activeTool() === 'subnet'"
            [class.bg-slate-900]="activeTool() !== 'subnet'"
            [class.text-slate-300]="activeTool() !== 'subnet'"
            [class.border]="activeTool() !== 'subnet'"
            [class.border-slate-800]="activeTool() !== 'subnet'"
          >
            <mat-icon class="text-sm">pin</mat-icon>
            <span>Subnet Calculator</span>
          </button>

          <button
            type="button"
            (click)="activeTool.set('inspector')"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            [class.bg-sky-500]="activeTool() === 'inspector'"
            [class.text-white]="activeTool() === 'inspector'"
            [class.bg-slate-900]="activeTool() !== 'inspector'"
            [class.text-slate-300]="activeTool() !== 'inspector'"
            [class.border]="activeTool() !== 'inspector'"
            [class.border-slate-800]="activeTool() !== 'inspector'"
          >
            <mat-icon class="text-sm">layers</mat-icon>
            <span>Paket İnceleyici</span>
          </button>
        </div>
      </div>

      <!-- Active Tool Rendering -->
      @if (activeTool() === 'subnet') {
        <app-subnet-calc />
      } @else {
        <app-packet-inspector />
      }
    </div>
  `
})
export class ToolsViewComponent {
  readonly activeTool = signal<'subnet' | 'inspector'>('subnet');
}
