import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NetLabStateService } from '../services/netlab-state.service';
import { ModuleId } from '../models/network.types';

@Component({
  selector: 'app-learn-view',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
            <mat-icon class="text-sky-400">menu_book</mat-icon>
            <span>Teorik Ağ Modülleri & Konu Anlatımı</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Temel katmanlardan ileri düzey yönlendirme ve güvenliğe kadar adım adım hazırlanmış zengin modüller.
          </p>
        </div>

        <!-- Module selector chips -->
        <div class="flex flex-wrap items-center gap-2">
          @for (mod of state.modules(); track mod.id) {
            @let isSelected = selectedModuleId() === mod.id;
            <button
              type="button"
              (click)="selectModule(mod.id)"
              class="px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              [class.bg-sky-500]="isSelected"
              [class.text-white]="isSelected"
              [class.font-semibold]="isSelected"
              [class.shadow-sm]="isSelected"
              [class.bg-slate-900]="!isSelected"
              [class.text-slate-300]="!isSelected"
              [class.border]="!isSelected"
              [class.border-slate-800]="!isSelected"
              [class.hover:bg-slate-800]="!isSelected"
            >
              <mat-icon class="text-xs">{{ mod.icon }}</mat-icon>
              <span>{{ mod.title.split(' ')[0] }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Active Module Details -->
      @if (currentModule(); as mod) {
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <!-- Module Header Card -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                <mat-icon class="text-2xl">{{ mod.icon }}</mat-icon>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-sky-300 border border-slate-700">
                    {{ mod.badge }}
                  </span>
                </div>
                <h3 class="text-xl font-bold text-slate-100 mt-1">{{ mod.title }}</h3>
                <p class="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">{{ mod.shortDesc }}</p>
              </div>
            </div>

            <!-- Quick Action Links -->
            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                (click)="goToQuiz(mod.id)"
                class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
              >
                <mat-icon class="text-sm">quiz</mat-icon>
                <span>Soruları Çöz</span>
              </button>
              <button
                type="button"
                (click)="goToLab(mod.id)"
                class="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <mat-icon class="text-sm">science</mat-icon>
                <span>İlgili Laba Git</span>
              </button>
            </div>
          </div>

          <!-- Learning Objectives -->
          <div class="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-2">
            <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <mat-icon class="text-sm text-emerald-400">check_circle</mat-icon>
              <span>Bu Modülün Öğrenme Hedefleri</span>
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-300 pt-1">
              @for (obj of mod.objectives; track obj) {
                <div class="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span class="text-emerald-400 font-bold">•</span>
                  <span>{{ obj }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Key Concepts Cards with Examples -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <mat-icon class="text-sm text-sky-400">lightbulb</mat-icon>
              <span>Kritik Kavramlar & Gerçek Hayat Örnekleri</span>
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              @for (concept of mod.keyConcepts; track concept.term) {
                <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span class="text-xs font-bold text-sky-300">{{ concept.term }}</span>
                  <p class="text-xs text-slate-400 leading-relaxed">{{ concept.description }}</p>
                  @if (concept.example) {
                    <div class="mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400/90 bg-slate-900 p-2 rounded">
                      <span class="text-slate-500 font-sans block text-[10px]">Örnek Senaryo:</span>
                      {{ concept.example }}
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Detailed Theory Sections -->
          <div class="space-y-4 pt-2">
            @for (sec of mod.theorySections; track sec.title) {
              <div class="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                <h4 class="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span class="w-1.5 h-4 rounded-full bg-sky-500"></span>
                  <span>{{ sec.title }}</span>
                </h4>
                <p class="text-xs text-slate-300 leading-relaxed">{{ sec.content }}</p>

                @if (sec.bulletPoints && sec.bulletPoints.length > 0) {
                  <div class="space-y-1.5 pt-2">
                    @for (bullet of sec.bulletPoints; track bullet) {
                      <div class="flex items-start gap-2 text-xs text-slate-300">
                        <mat-icon class="text-sky-400 text-xs mt-0.5">arrow_right</mat-icon>
                        <span class="leading-relaxed">{{ bullet }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class LearnViewComponent {
  readonly state = inject(NetLabStateService);
  readonly selectedModuleId = signal<ModuleId>('osi-tcpip');

  currentModule() {
    return this.state.modules().find(m => m.id === this.selectedModuleId()) || this.state.modules()[0];
  }

  selectModule(id: ModuleId) {
    this.selectedModuleId.set(id);
  }

  goToQuiz(modId: ModuleId) {
    this.state.quizModuleFilter.set(modId);
    this.state.setTab('quiz');
  }

  goToLab(modId: ModuleId) {
    const matchingLab = this.state.labs().find(l => l.moduleId === modId);
    if (matchingLab) {
      this.state.selectLab(matchingLab.id);
    }
    this.state.setTab('labs');
  }
}
