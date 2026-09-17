import { Component, ChangeDetectionStrategy, inject, signal, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NetLabStateService } from '../services/netlab-state.service';

@Component({
  selector: 'app-cli-terminal',
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono shadow-2xl">
      <!-- Terminal Header / Device Tabs -->
      <div class="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-3 py-2">
        <div class="flex items-center gap-1.5 overflow-x-auto py-0.5">
          @for (dev of currentLab()?.cliDevices || []; track dev.id) {
            @let isSelected = state.activeDeviceId() === dev.id;
            <button
              type="button"
              (click)="selectDevice(dev.id)"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer"
              [class.bg-sky-500]="isSelected"
              [class.text-white]="isSelected"
              [class.font-semibold]="isSelected"
              [class.shadow-sm]="isSelected"
              [class.bg-slate-800]="!isSelected"
              [class.text-slate-300]="!isSelected"
              [class.hover:bg-slate-700]="!isSelected"
            >
              <mat-icon class="text-xs">
                @switch (dev.type) {
                  @case ('router') { alt_route }
                  @case ('switch') { hub }
                  @case ('pc') { computer }
                  @case ('server') { dns }
                  @default { terminal }
                }
              </mat-icon>
              <span>{{ dev.name }}</span>
            </button>
          }
        </div>

        <!-- Terminal Actions -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="clearTerminal()"
            title="Terminali Temizle"
            class="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer rounded hover:bg-slate-800"
          >
            <mat-icon class="text-sm">delete_sweep</mat-icon>
          </button>
        </div>
      </div>

      <!-- Quick command shortcuts -->
      <div class="bg-slate-900/60 border-b border-slate-800/80 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span class="text-slate-500 font-sans flex items-center gap-1 whitespace-nowrap">
          <mat-icon class="text-[12px] text-sky-400">bolt</mat-icon> Hızlı Komutlar:
        </span>
        @for (cmd of getQuickCommands(); track cmd) {
          <button
            type="button"
            (click)="runQuickCommand(cmd)"
            class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-sky-200 border border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
          >
            {{ cmd }}
          </button>
        }
      </div>

      <!-- Logs area -->
      <div 
        #terminalScroll
        class="flex-1 p-4 overflow-y-auto space-y-1 text-xs text-slate-200 bg-slate-950/90 leading-relaxed select-text"
      >
        @for (line of currentLogs(); track $index) {
          <div [class]="getLineClass(line.type)">
            @if (line.type === 'cmd') {
              <span class="text-emerald-400 select-none">❯ </span>
            }
            <span class="whitespace-pre-wrap">{{ line.text }}</span>
          </div>
        }
      </div>

      <!-- Input line -->
      <form (submit)="onSubmit($event)" class="flex items-center bg-slate-900 border-t border-slate-800 px-3 py-2">
        <span class="text-sky-400 mr-2 text-xs font-bold select-none">{{ currentPrompt() }}</span>
        <input
          #cmdInput
          type="text"
          [value]="commandInput()"
          (input)="commandInput.set($any($event.target).value)"
          (keydown)="onKeyDown($event)"
          placeholder="Komut girin (örn: help, ping, ip route...)"
          class="flex-1 bg-transparent border-none outline-none text-xs text-slate-100 placeholder-slate-600 focus:ring-0"
          autocomplete="off"
          spellcheck="false"
        />
        <button
          type="submit"
          class="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-sans font-medium transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Çalıştır</span>
          <mat-icon class="text-[14px]">subdirectory_arrow_left</mat-icon>
        </button>
      </form>
    </div>
  `
})
export class CliTerminalComponent {
  readonly state = inject(NetLabStateService);
  readonly currentLab = this.state.activeLab;
  readonly commandInput = signal('');
  readonly history = signal<string[]>([]);
  readonly historyIndex = signal<number>(-1);

  readonly terminalScroll = viewChild<ElementRef<HTMLDivElement>>('terminalScroll');
  readonly cmdInput = viewChild<ElementRef<HTMLInputElement>>('cmdInput');

  constructor() {
    afterNextRender(() => {
      this.scrollToBottom();
    });
  }

  currentLogs() {
    const labId = this.state.activeLabId();
    const devId = this.state.activeDeviceId();
    const key = `${labId}_${devId}`;
    return this.state.terminalLogs()[key] || [];
  }

  currentPrompt(): string {
    const lab = this.currentLab();
    const dev = lab?.cliDevices.find(d => d.id === this.state.activeDeviceId());
    return dev?.prompt || '$ ';
  }

  getQuickCommands(): string[] {
    const labId = this.state.activeLabId();
    const devId = this.state.activeDeviceId();

    if (labId === 'lab-routing-gateway') {
      if (devId === 'pc1') {
        return ['ip route show', 'set gateway 192.168.1.1', 'ping 10.0.0.50', 'traceroute 10.0.0.50', 'ip a'];
      }
      return ['show ip interface brief', 'show ip route'];
    }
    if (labId === 'lab-vlan-trunk') {
      if (devId === 'sw1') {
        return ['show vlan brief', 'set vlan Fa0/2 20', 'show mac address-table'];
      }
      return ['ping 192.168.20.100', 'ip a'];
    }
    if (labId === 'lab-dns-resolution') {
      return ['cat /etc/resolv.conf', 'set dns 192.168.1.5', 'nslookup lab.local', 'curl http://lab.local'];
    }
    if (labId === 'lab-firewall-iptables') {
      if (devId === 'fw_node') {
        return ['iptables -L -n -v', 'iptables -A INPUT -p tcp --dport 80 -j ACCEPT'];
      }
      return ['curl http://192.168.100.10', 'ping 192.168.100.10'];
    }
    return ['help', 'clear'];
  }

  selectDevice(devId: string) {
    this.state.selectDevice(devId);
    setTimeout(() => {
      this.cmdInput()?.nativeElement.focus();
      this.scrollToBottom();
    }, 50);
  }

  clearTerminal() {
    this.state.executeCommand('clear');
  }

  runQuickCommand(cmd: string) {
    this.state.executeCommand(cmd);
    this.scrollToBottom();
  }

  onSubmit(e: Event) {
    e.preventDefault();
    const val = this.commandInput().trim();
    if (!val) return;

    this.history.update(h => [...h, val]);
    this.historyIndex.set(-1);

    this.state.executeCommand(val);
    this.commandInput.set('');

    setTimeout(() => {
      this.scrollToBottom();
    }, 20);
  }

  onKeyDown(e: KeyboardEvent) {
    const hist = this.history();
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hist.length === 0) return;
      let nextIdx = this.historyIndex() === -1 ? hist.length - 1 : this.historyIndex() - 1;
      if (nextIdx < 0) nextIdx = 0;
      this.historyIndex.set(nextIdx);
      this.commandInput.set(hist[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex() === -1) return;
      const nextIdx = this.historyIndex() + 1;
      if (nextIdx >= hist.length) {
        this.historyIndex.set(-1);
        this.commandInput.set('');
      } else {
        this.historyIndex.set(nextIdx);
        this.commandInput.set(hist[nextIdx]);
      }
    }
  }

  getLineClass(type: string): string {
    switch (type) {
      case 'cmd':
        return 'text-sky-300 font-semibold';
      case 'success':
        return 'text-emerald-400 font-medium';
      case 'error':
        return 'text-rose-400 font-medium';
      case 'system':
        return 'text-amber-400/90 italic';
      default:
        return 'text-slate-300';
    }
  }

  private scrollToBottom() {
    const el = this.terminalScroll()?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
