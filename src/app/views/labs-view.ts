import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NetLabStateService } from '../services/netlab-state.service';
import { TopologyCanvasComponent } from '../components/topology-canvas';
import { CliTerminalComponent } from '../components/cli-terminal';

@Component({
  selector: 'app-labs-view',
  imports: [CommonModule, MatIconModule, TopologyCanvasComponent, CliTerminalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Scenario Selector Tabs -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
              <mat-icon class="text-sky-400">science</mat-icon>
              <span>Etkileşimli Ağ Laboratuvarları & Arıza Çözümü</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              Topoloji diyagramı ve gerçekçi komut satırı terminali (CLI) ile gerçek ağ problemlerini çözün.
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              (click)="state.verifyLabSolution()"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-950"
            >
              <mat-icon class="text-sm">verified</mat-icon>
              <span>Lab Çözümünü Doğrula</span>
            </button>
          </div>
        </div>

        <!-- Lab tabs -->
        <div class="flex flex-wrap gap-2">
          @for (lab of state.labs(); track lab.id) {
            @let isSelected = state.activeLabId() === lab.id;
            <button
              type="button"
              (click)="state.selectLab(lab.id)"
              class="px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
              [class.bg-sky-500]="isSelected"
              [class.text-white]="isSelected"
              [class.font-semibold]="isSelected"
              [class.shadow-md]="isSelected"
              [class.bg-slate-950]="!isSelected"
              [class.text-slate-300]="!isSelected"
              [class.border]="!isSelected"
              [class.border-slate-800]="!isSelected"
              [class.hover:bg-slate-800]="!isSelected"
            >
              <span class="w-2 h-2 rounded-full"
                [class.bg-white]="isSelected"
                [class.bg-sky-400]="!isSelected"
              ></span>
              <span>{{ lab.title }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Active Lab Scenario Container -->
      @if (currentLab(); as lab) {
        <!-- Verification Banner if verified -->
        @if (state.labVerification().status !== 'idle') {
          <div 
            class="p-4 rounded-2xl border transition-all animate-fadeIn"
            [class.bg-emerald-950_60]="state.labVerification().status === 'success'"
            [class.border-emerald-500_60]="state.labVerification().status === 'success'"
            [class.bg-rose-950_60]="state.labVerification().status === 'failed'"
            [class.border-rose-500_60]="state.labVerification().status === 'failed'"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <mat-icon 
                  class="text-xl mt-0.5"
                  [class.text-emerald-400]="state.labVerification().status === 'success'"
                  [class.text-rose-400]="state.labVerification().status === 'failed'"
                >
                  {{ state.labVerification().status === 'success' ? 'check_circle' : 'warning' }}
                </mat-icon>
                <div>
                  <h4 class="text-sm font-bold"
                    [class.text-emerald-200]="state.labVerification().status === 'success'"
                    [class.text-rose-200]="state.labVerification().status === 'failed'"
                  >
                    {{ state.labVerification().message }}
                  </h4>
                  <p class="text-xs mt-1 leading-relaxed"
                    [class.text-emerald-300_90]="state.labVerification().status === 'success'"
                    [class.text-rose-300_90]="state.labVerification().status === 'failed'"
                  >
                    {{ state.labVerification().details }}
                  </p>
                </div>
              </div>

              <button
                type="button"
                (click)="state.labVerification.set({ status: 'idle', message: '' })"
                class="text-slate-400 hover:text-white cursor-pointer"
              >
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>
          </div>
        }

        <!-- Interactive Topology Canvas -->
        <app-topology-canvas />

        <!-- Split Grid: Scenario Tasks & CLI Terminal -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Left Column: Scenario Details & Tasks -->
          <div class="lg:col-span-5 space-y-4">
            <!-- Problem Definition -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-300 border border-slate-700">
                  {{ lab.badge }}
                </span>
                <span class="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <mat-icon class="text-xs">schedule</mat-icon> {{ lab.estimatedTime }}
                </span>
              </div>

              <h3 class="text-base font-bold text-slate-100">{{ lab.title }}</h3>
              <p class="text-xs text-slate-300 leading-relaxed">{{ lab.description }}</p>

              <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span class="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Öğrenme Hedefi</span>
                <span class="text-sky-300 font-medium mt-0.5 block">{{ lab.goal }}</span>
              </div>
            </div>

            <!-- Tasks Checklist -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <mat-icon class="text-sm text-sky-400">task_alt</mat-icon>
                <span>Görev Listesi & Çözüm Adımları</span>
              </h4>

              <div class="space-y-2.5">
                @for (task of lab.tasks; track task.id) {
                  @let isDone = state.completedTaskIds()[task.id];
                  <div 
                    class="p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5"
                    [class.bg-slate-950]="!isDone"
                    [class.border-slate-800]="!isDone"
                    [class.bg-emerald-950_30]="isDone"
                    [class.border-emerald-500_50]="isDone"
                  >
                    <mat-icon 
                      class="text-sm shrink-0 mt-0.5"
                      [class.text-emerald-400]="isDone"
                      [class.text-slate-600]="!isDone"
                    >
                      {{ isDone ? 'check_circle' : 'radio_button_unchecked' }}
                    </mat-icon>

                    <div class="flex-1 space-y-1">
                      <p 
                        class="text-slate-200 leading-relaxed"
                        [class.line-through]="isDone"
                        [class.text-slate-400]="isDone"
                      >
                        {{ task.description }}
                      </p>

                      <div class="text-[11px] text-slate-500 flex items-center gap-1">
                        <mat-icon class="text-[11px] text-sky-400">help_outline</mat-icon>
                        <span>İpucu: {{ task.hint }}</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Solution Walkthrough Accordion -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <button
                type="button"
                (click)="showWalkthrough.set(!showWalkthrough())"
                class="w-full flex items-center justify-between text-xs font-bold text-slate-200 hover:text-sky-300 transition cursor-pointer"
              >
                <span class="flex items-center gap-1.5">
                  <mat-icon class="text-sm text-amber-400">psychology</mat-icon>
                  <span>Çözüm Rehberi ve Teknik Açıklama</span>
                </span>
                <mat-icon class="text-sm">{{ showWalkthrough() ? 'expand_less' : 'expand_more' }}</mat-icon>
              </button>

              @if (showWalkthrough()) {
                <div class="mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div class="text-sky-300 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                    Beklenen Komut / Düzeltme: {{ lab.expectedCommandsOrFix }}
                  </div>
                  <div class="space-y-1 pt-1">
                    @for (step of lab.solutionWalkthrough; track step) {
                      <div class="flex items-start gap-1.5">
                        <span class="text-emerald-400 font-bold">•</span>
                        <span class="leading-relaxed">{{ step }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Right Column: Interactive CLI Terminal -->
          <div class="lg:col-span-7 h-[580px]">
            <app-cli-terminal />
          </div>
        </div>
      }
    </div>
  `
})
export class LabsViewComponent {
  readonly state = inject(NetLabStateService);
  readonly currentLab = this.state.activeLab;
  readonly showWalkthrough = signal(false);
}
