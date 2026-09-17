import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NetLabStateService } from '../services/netlab-state.service';
import { TabMode } from '../models/network.types';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 gap-4">
          <!-- Logo & Platform Name -->
          <button type="button" class="flex items-center gap-3 cursor-pointer select-none text-left bg-transparent border-0 p-0" (click)="state.setTab('learn')">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <mat-icon class="text-2xl">hub</mat-icon>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-base font-extrabold tracking-tight text-white font-sans">NetLab</span>
                <span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-950 text-sky-400 border border-sky-800">
                  v2.5
                </span>
              </div>
              <p class="text-[11px] text-slate-400 font-medium">Ağ & Network Öğrenme Laboratuvarı</p>
            </div>
          </button>

          <!-- Main Navigation Tabs -->
          <nav class="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              (click)="selectTab('learn')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              [class.bg-sky-500]="state.activeTab() === 'learn'"
              [class.text-white]="state.activeTab() === 'learn'"
              [class.shadow-sm]="state.activeTab() === 'learn'"
              [class.text-slate-300]="state.activeTab() !== 'learn'"
              [class.hover:text-white]="state.activeTab() !== 'learn'"
            >
              <mat-icon class="text-xs">menu_book</mat-icon>
              <span>Teorik Modüller</span>
            </button>

            <button
              type="button"
              (click)="selectTab('quiz')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              [class.bg-sky-500]="state.activeTab() === 'quiz'"
              [class.text-white]="state.activeTab() === 'quiz'"
              [class.shadow-sm]="state.activeTab() === 'quiz'"
              [class.text-slate-300]="state.activeTab() !== 'quiz'"
              [class.hover:text-white]="state.activeTab() !== 'quiz'"
            >
              <mat-icon class="text-xs">quiz</mat-icon>
              <span>Bilgi Soruları</span>
              <span class="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-slate-800 text-sky-300 border border-slate-700">
                {{ state.quizStats().answered }}/{{ state.quizStats().total }}
              </span>
            </button>

            <button
              type="button"
              (click)="selectTab('labs')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              [class.bg-sky-500]="state.activeTab() === 'labs'"
              [class.text-white]="state.activeTab() === 'labs'"
              [class.shadow-sm]="state.activeTab() === 'labs'"
              [class.text-slate-300]="state.activeTab() !== 'labs'"
              [class.hover:text-white]="state.activeTab() !== 'labs'"
            >
              <mat-icon class="text-xs">science</mat-icon>
              <span>Çözülecek Lablar</span>
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            <button
              type="button"
              (click)="selectTab('tools')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              [class.bg-sky-500]="state.activeTab() === 'tools'"
              [class.text-white]="state.activeTab() === 'tools'"
              [class.shadow-sm]="state.activeTab() === 'tools'"
              [class.text-slate-300]="state.activeTab() !== 'tools'"
              [class.hover:text-white]="state.activeTab() !== 'tools'"
            >
              <mat-icon class="text-xs">build</mat-icon>
              <span>Pratik Araçlar</span>
            </button>

            <button
              type="button"
              (click)="selectTab('docker')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              [class.bg-indigo-600]="state.activeTab() === 'docker'"
              [class.text-white]="state.activeTab() === 'docker'"
              [class.shadow-sm]="state.activeTab() === 'docker'"
              [class.text-indigo-300]="state.activeTab() !== 'docker'"
              [class.hover:text-white]="state.activeTab() !== 'docker'"
            >
              <mat-icon class="text-xs">developer_board</mat-icon>
              <span>Docker & Paylaş</span>
            </button>
          </nav>

          <!-- Quick Action CTA -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="selectTab('docker')"
              class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <mat-icon class="text-sm text-sky-400">cloud_download</mat-icon>
              <span class="hidden sm:inline">Sunucusuz Docker Rehberi</span>
              <span class="sm:hidden">Docker</span>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation bar -->
        <div class="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-800 gap-2 text-xs">
          <button
            type="button"
            (click)="selectTab('learn')"
            class="px-2.5 py-1 rounded-lg shrink-0"
            [class.bg-sky-500]="state.activeTab() === 'learn'"
            [class.text-white]="state.activeTab() === 'learn'"
            [class.text-slate-400]="state.activeTab() !== 'learn'"
          >
            Teori
          </button>
          <button
            type="button"
            (click)="selectTab('quiz')"
            class="px-2.5 py-1 rounded-lg shrink-0"
            [class.bg-sky-500]="state.activeTab() === 'quiz'"
            [class.text-white]="state.activeTab() === 'quiz'"
            [class.text-slate-400]="state.activeTab() !== 'quiz'"
          >
            Sorular
          </button>
          <button
            type="button"
            (click)="selectTab('labs')"
            class="px-2.5 py-1 rounded-lg shrink-0 font-bold text-sky-300"
            [class.bg-sky-500]="state.activeTab() === 'labs'"
            [class.text-white]="state.activeTab() === 'labs'"
          >
            Lablar (CLI)
          </button>
          <button
            type="button"
            (click)="selectTab('tools')"
            class="px-2.5 py-1 rounded-lg shrink-0"
            [class.bg-sky-500]="state.activeTab() === 'tools'"
            [class.text-white]="state.activeTab() === 'tools'"
            [class.text-slate-400]="state.activeTab() !== 'tools'"
          >
            Araçlar
          </button>
          <button
            type="button"
            (click)="selectTab('docker')"
            class="px-2.5 py-1 rounded-lg shrink-0 text-indigo-300 font-bold"
            [class.bg-indigo-600]="state.activeTab() === 'docker'"
            [class.text-white]="state.activeTab() === 'docker'"
          >
            Docker
          </button>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  readonly state = inject(NetLabStateService);

  selectTab(tab: TabMode) {
    this.state.setTab(tab);
  }
}
