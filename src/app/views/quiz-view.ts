import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NetLabStateService } from '../services/netlab-state.service';

@Component({
  selector: 'app-quiz-view',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Header & Score Summary -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
              <mat-icon class="text-sky-400">quiz</mat-icon>
              <span>Ağ Bilgi Soruları & Sınav Modu</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              OSI, Subnetting, VLAN, Routing, DNS/DHCP ve Güvenlik konularında doğrudan bilgi ve senaryo soruları.
            </p>
          </div>

          <button
            type="button"
            (click)="state.resetQuiz()"
            class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700 shrink-0 self-start sm:self-auto"
          >
            <mat-icon class="text-sm">restart_alt</mat-icon>
            <span>Cevapları Sıfırla</span>
          </button>
        </div>

        <!-- Progress and Stats metrics -->
        @let stats = state.quizStats();
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span class="text-slate-500 block text-[11px]">Toplam Soru</span>
            <span class="text-lg font-bold text-slate-200">{{ stats.total }} Soru</span>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span class="text-slate-500 block text-[11px]">Cevaplanan</span>
            <span class="text-lg font-bold text-sky-400">{{ stats.answered }} / {{ stats.total }}</span>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span class="text-slate-500 block text-[11px]">Doğru Cevap</span>
            <span class="text-lg font-bold text-emerald-400">{{ stats.correct }} Doğru</span>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span class="text-slate-500 block text-[11px]">Başarı Oranı</span>
            <span class="text-lg font-bold text-indigo-300">%{{ stats.accuracy }}</span>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
          <!-- Module filter -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-slate-500 mr-1 font-medium">Modül:</span>
            <button
              type="button"
              (click)="setModuleFilter('all')"
              class="px-2.5 py-1 rounded-lg transition cursor-pointer"
              [class.bg-sky-500]="state.quizModuleFilter() === 'all'"
              [class.text-white]="state.quizModuleFilter() === 'all'"
              [class.bg-slate-800]="state.quizModuleFilter() !== 'all'"
              [class.text-slate-400]="state.quizModuleFilter() !== 'all'"
            >
              Tümü
            </button>
            @for (mod of state.modules(); track mod.id) {
              <button
                type="button"
                (click)="setModuleFilter(mod.id)"
                class="px-2.5 py-1 rounded-lg transition cursor-pointer"
                [class.bg-sky-500]="state.quizModuleFilter() === mod.id"
                [class.text-white]="state.quizModuleFilter() === mod.id"
                [class.bg-slate-800]="state.quizModuleFilter() !== mod.id"
                [class.text-slate-400]="state.quizModuleFilter() !== mod.id"
              >
                {{ mod.title.split(' ')[0] }}
              </button>
            }
          </div>

          <!-- Difficulty filter -->
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-slate-500 mr-1 font-medium">Zorluk:</span>
            @for (diff of ['all', 'Başlangıç', 'Orta', 'İleri']; track diff) {
              <button
                type="button"
                (click)="setDifficultyFilter(diff)"
                class="px-2.5 py-1 rounded-lg transition cursor-pointer"
                [class.bg-indigo-600]="state.quizDifficultyFilter() === diff"
                [class.text-white]="state.quizDifficultyFilter() === diff"
                [class.bg-slate-800]="state.quizDifficultyFilter() !== diff"
                [class.text-slate-400]="state.quizDifficultyFilter() !== diff"
              >
                {{ diff === 'all' ? 'Tümü' : diff }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Question Cards List -->
      <div class="space-y-4">
        @for (q of state.filteredQuestions(); track q.id) {
          @let answeredIndex = state.userAnswers()[q.id];
          @let isAnswered = answeredIndex !== undefined;
          @let isCorrect = isAnswered && answeredIndex === q.correctAnswerIndex;
          @let showExp = state.showExplanations()[q.id];

          <div 
            class="bg-slate-900 border rounded-2xl p-5 shadow-lg transition-all"
            [class.border-slate-800]="!isAnswered"
            [class.border-emerald-500_40]="isAnswered && isCorrect"
            [class.border-rose-500_40]="isAnswered && !isCorrect"
          >
            <!-- Card Header -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-300 border border-slate-700">
                  {{ q.category }}
                </span>
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [class.bg-emerald-950]="q.difficulty === 'Başlangıç'"
                  [class.text-emerald-300]="q.difficulty === 'Başlangıç'"
                  [class.bg-amber-950]="q.difficulty === 'Orta'"
                  [class.text-amber-300]="q.difficulty === 'Orta'"
                  [class.bg-rose-950]="q.difficulty === 'İleri'"
                  [class.text-rose-300]="q.difficulty === 'İleri'"
                >
                  {{ q.difficulty }}
                </span>
              </div>

              @if (q.rfcOrStandard) {
                <span class="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {{ q.rfcOrStandard }}
                </span>
              }
            </div>

            <!-- Question Statement -->
            <p class="text-sm font-semibold text-slate-100 mb-4 leading-relaxed">
              {{ q.question }}
            </p>

            <!-- Options Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              @for (opt of q.options; track $index) {
                @let isSelected = answeredIndex === $index;
                @let isThisCorrect = q.correctAnswerIndex === $index;

                <button
                  type="button"
                  (click)="selectOption(q.id, $index)"
                  class="p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer leading-relaxed"
                  [class.bg-slate-950]="!isAnswered && !isSelected"
                  [class.border-slate-800]="!isAnswered"
                  [class.hover:border-sky-500_50]="!isAnswered"
                  [class.hover:bg-slate-800_40]="!isAnswered"
                  [class.bg-emerald-950_60]="isAnswered && isThisCorrect"
                  [class.border-emerald-500]="isAnswered && isThisCorrect"
                  [class.text-emerald-200]="isAnswered && isThisCorrect"
                  [class.bg-rose-950_60]="isAnswered && isSelected && !isThisCorrect"
                  [class.border-rose-500]="isAnswered && isSelected && !isThisCorrect"
                  [class.text-rose-200]="isAnswered && isSelected && !isThisCorrect"
                  [class.opacity-50]="isAnswered && !isSelected && !isThisCorrect"
                >
                  <span class="w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[11px] shrink-0 border"
                    [class.bg-slate-800]="!isAnswered"
                    [class.border-slate-700]="!isAnswered"
                    [class.text-slate-300]="!isAnswered"
                    [class.bg-emerald-800]="isAnswered && isThisCorrect"
                    [class.border-emerald-600]="isAnswered && isThisCorrect"
                    [class.text-white]="isAnswered && isThisCorrect"
                    [class.bg-rose-800]="isAnswered && isSelected && !isThisCorrect"
                    [class.border-rose-600]="isAnswered && isSelected && !isThisCorrect"
                    [class.text-white]="isAnswered && isSelected && !isThisCorrect"
                  >
                    {{ ['A', 'B', 'C', 'D'][$index] }}
                  </span>
                  <span class="flex-1">{{ opt }}</span>
                </button>
              }
            </div>

            <!-- Explanation & Details Box -->
            @if (showExp || isAnswered) {
              <div class="mt-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 text-xs space-y-1.5">
                <div class="flex items-center justify-between text-slate-300 font-bold">
                  <span class="flex items-center gap-1.5"
                    [class.text-emerald-400]="isCorrect"
                    [class.text-rose-400]="isAnswered && !isCorrect"
                  >
                    <mat-icon class="text-sm">
                      {{ isCorrect ? 'check_circle' : 'info' }}
                    </mat-icon>
                    <span>
                      {{ isAnswered ? (isCorrect ? 'Tebrikler, Doğru Cevap!' : 'Yanlış Cevap') : 'Cevap Açıklaması' }}
                    </span>
                  </span>

                  <span class="text-[11px] font-mono text-sky-400">
                    Doğru Seçenek: {{ ['A', 'B', 'C', 'D'][q.correctAnswerIndex] }}
                  </span>
                </div>
                <p class="text-slate-400 leading-relaxed pt-1">
                  {{ q.explanation }}
                </p>
              </div>
            } @else {
              <!-- Flashcard Peek button -->
              <div class="mt-3 flex justify-end">
                <button
                  type="button"
                  (click)="state.toggleExplanation(q.id)"
                  class="text-[11px] text-slate-500 hover:text-sky-400 transition cursor-pointer flex items-center gap-1"
                >
                  <mat-icon class="text-xs">visibility</mat-icon>
                  <span>Cevabı Göster (Öğrenme Modu)</span>
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class QuizViewComponent {
  readonly state = inject(NetLabStateService);

  setModuleFilter(mod: string) {
    this.state.quizModuleFilter.set(mod);
  }

  setDifficultyFilter(diff: string) {
    this.state.quizDifficultyFilter.set(diff);
  }

  selectOption(questionId: string, optionIndex: number) {
    this.state.answerQuestion(questionId, optionIndex);
  }
}
