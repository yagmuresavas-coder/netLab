import { Injectable, signal, computed } from '@angular/core';
import { ModuleId, TabMode, LabScenario, Question } from '../models/network.types';
import { NETWORK_MODULES } from '../data/network-modules.data';
import { NETWORK_QUESTIONS } from '../data/network-questions.data';
import { NETWORK_LABS } from '../data/network-labs.data';
import { calculateSubnet, SubnetResult } from '../utils/subnet.util';

export interface TerminalLine {
  text: string;
  type: 'cmd' | 'output' | 'error' | 'success' | 'system';
  timestamp?: string;
}

export interface LabDeviceState {
  ip?: string;
  gateway?: string;
  vlan?: number;
  dns?: string;
  firewallRules?: string[];
  interfaces?: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class NetLabStateService {
  // Navigation
  readonly activeTab = signal<TabMode>('learn');
  readonly selectedModuleId = signal<ModuleId | 'all'>('all');

  // Educational Modules
  readonly modules = signal(NETWORK_MODULES);

  // Questions / Quiz State
  readonly questions = signal<Question[]>(NETWORK_QUESTIONS);
  readonly currentQuestionIndex = signal<number>(0);
  readonly userAnswers = signal<Record<string, number>>({});
  readonly showExplanations = signal<Record<string, boolean>>({});
  readonly quizDifficultyFilter = signal<string>('all');
  readonly quizModuleFilter = signal<string>('all');

  // Labs State
  readonly labs = signal<LabScenario[]>(NETWORK_LABS);
  readonly activeLabId = signal<string>(NETWORK_LABS[0]?.id || '');
  readonly activeDeviceId = signal<string>('pc1');
  
  // Terminal history by key: scenarioId_deviceId
  readonly terminalLogs = signal<Record<string, TerminalLine[]>>({});
  
  // Dynamic runtime configuration overrides for current lab
  readonly labDeviceStates = signal<Record<string, LabDeviceState>>({});
  
  // Lab Tasks completed tracking
  readonly completedTaskIds = signal<Record<string, boolean>>({});

  // Packet animation state for visual topology
  readonly packetFlow = signal<{
    active: boolean;
    from: string;
    to: string;
    type: 'icmp' | 'dns' | 'http' | 'arp';
    success: boolean;
    label: string;
  } | null>(null);

  // Verification status message for lab
  readonly labVerification = signal<{
    status: 'idle' | 'success' | 'failed';
    message: string;
    details?: string;
  }>({ status: 'idle', message: '' });

  // Subnetting tool state
  readonly subnetIpInput = signal<string>('192.168.10.0');
  readonly subnetCidrInput = signal<number>(26);

  // Computed values
  readonly activeLab = computed(() => {
    return this.labs().find(l => l.id === this.activeLabId()) || this.labs()[0];
  });

  readonly filteredQuestions = computed(() => {
    const mod = this.quizModuleFilter();
    const diff = this.quizDifficultyFilter();
    return this.questions().filter(q => {
      const matchMod = mod === 'all' || q.moduleId === mod;
      const matchDiff = diff === 'all' || q.difficulty === diff;
      return matchMod && matchDiff;
    });
  });

  readonly quizStats = computed(() => {
    const answers = this.userAnswers();
    const all = this.filteredQuestions();
    const answeredCount = all.filter(q => answers[q.id] !== undefined).length;
    let correctCount = 0;
    all.forEach(q => {
      if (answers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    return {
      total: all.length,
      answered: answeredCount,
      correct: correctCount,
      accuracy
    };
  });

  readonly calculatedSubnet = computed<SubnetResult | null>(() => {
    return calculateSubnet(this.subnetIpInput(), this.subnetCidrInput());
  });

  constructor() {
    this.initDefaultLabState();
  }

  setTab(tab: TabMode) {
    this.activeTab.set(tab);
  }

  setSelectedModule(modId: ModuleId | 'all') {
    this.selectedModuleId.set(modId);
  }

  selectLab(labId: string) {
    this.activeLabId.set(labId);
    const lab = this.labs().find(l => l.id === labId);
    if (lab && lab.cliDevices.length > 0) {
      this.activeDeviceId.set(lab.cliDevices[0].id);
    }
    this.initLabStateFor(labId);
    this.labVerification.set({ status: 'idle', message: '' });
  }

  selectDevice(deviceId: string) {
    this.activeDeviceId.set(deviceId);
  }

  // Quiz Methods
  answerQuestion(questionId: string, optionIndex: number) {
    const current = { ...this.userAnswers() };
    current[questionId] = optionIndex;
    this.userAnswers.set(current);

    const explains = { ...this.showExplanations() };
    explains[questionId] = true;
    this.showExplanations.set(explains);
  }

  toggleExplanation(questionId: string) {
    const explains = { ...this.showExplanations() };
    explains[questionId] = !explains[questionId];
    this.showExplanations.set(explains);
  }

  resetQuiz() {
    this.userAnswers.set({});
    this.showExplanations.set({});
  }

  // Terminal & Command Simulation
  private getTerminalKey(labId: string, deviceId: string): string {
    return `${labId}_${deviceId}`;
  }

  private initDefaultLabState() {
    if (this.labs().length > 0) {
      this.initLabStateFor(this.labs()[0].id);
    }
  }

  private initLabStateFor(labId: string) {
    const currentLogs = { ...this.terminalLogs() };
    const currentDeviceStates = { ...this.labDeviceStates() };

    if (labId === 'lab-routing-gateway') {
      currentDeviceStates['pc1'] = {
        ip: '192.168.1.10/24',
        gateway: '192.168.1.254' // Misconfigured
      };
      currentDeviceStates['r1'] = {
        ip: 'eth0: 192.168.1.1, eth1: 10.0.0.1'
      };

      const keyPc1 = this.getTerminalKey(labId, 'pc1');
      if (!currentLogs[keyPc1]) {
        currentLogs[keyPc1] = [
          { text: 'NetLab v2.5 Interactive Terminal - Linux 6.8.0-netlab', type: 'system' },
          { text: 'İpucu: Komut yardımı için "help" yazabilirsiniz.', type: 'output' },
          { text: 'Hedef: 10.0.0.50 Web Sunucusuna ping atarak bağlantıyı test edin.', type: 'output' }
        ];
      }
    } else if (labId === 'lab-vlan-trunk') {
      currentDeviceStates['pc_dev'] = {
        ip: '192.168.20.15/24',
        vlan: 10 // Misconfigured port
      };
      currentDeviceStates['sw1'] = {
        vlan: 10
      };
      const keyDev = this.getTerminalKey(labId, 'pc_dev');
      if (!currentLogs[keyDev]) {
        currentLogs[keyDev] = [
          { text: 'NetLab v2.5 Terminal - Workstation Dev PC', type: 'system' },
          { text: 'Hedef: Dev Sunucusuna (192.168.20.100) erişim sağlayın.', type: 'output' }
        ];
      }
    } else if (labId === 'lab-dns-resolution') {
      currentDeviceStates['client_pc'] = {
        ip: '192.168.1.20',
        dns: '192.168.1.99' // Misconfigured
      };
      const keyClient = this.getTerminalKey(labId, 'client_pc');
      if (!currentLogs[keyClient]) {
        currentLogs[keyClient] = [
          { text: 'NetLab v2.5 Terminal - Client Host', type: 'system' },
          { text: 'Hedef: "lab.local" alan adını doğru DNS sunucusu (192.168.1.5) ile çözümleyin.', type: 'output' }
        ];
      }
    } else if (labId === 'lab-firewall-iptables') {
      currentDeviceStates['fw_node'] = {
        firewallRules: ['-P INPUT DROP', '-A INPUT -p tcp --dport 22 -j ACCEPT']
      };
      const keyFw = this.getTerminalKey(labId, 'fw_node');
      if (!currentLogs[keyFw]) {
        currentLogs[keyFw] = [
          { text: 'NetLab v2.5 Server Console - iptables v1.8.10', type: 'system' },
          { text: 'Hedef: TCP Port 80 (HTTP) web trafiğine izin verin.', type: 'output' }
        ];
      }
    }

    this.terminalLogs.set(currentLogs);
    this.labDeviceStates.set(currentDeviceStates);
  }

  executeCommand(rawCmd: string) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    const labId = this.activeLabId();
    const deviceId = this.activeDeviceId();
    const key = this.getTerminalKey(labId, deviceId);

    const logs = [...(this.terminalLogs()[key] || [])];
    const devStates = { ...this.labDeviceStates() };
    const deviceState = devStates[deviceId] || {};

    const lab = this.activeLab();
    const cliDev = lab?.cliDevices.find(d => d.id === deviceId);
    const prompt = cliDev?.prompt || '> ';

    // Append command line
    logs.push({ text: `${prompt}${cmd}`, type: 'cmd' });

    const lower = cmd.toLowerCase();

    // Built-in commands
    if (lower === 'clear' || lower === 'cls') {
      this.terminalLogs.set({ ...this.terminalLogs(), [key]: [] });
      return;
    }

    if (lower === 'help' || lower === '?') {
      logs.push({ text: '--- Kullanılabilir Komutlar ---', type: 'system' });
      cliDev?.helpCommands.forEach(h => logs.push({ text: `  • ${h}`, type: 'output' }));
      this.terminalLogs.set({ ...this.terminalLogs(), [key]: logs });
      return;
    }

    // SCENARIO 1: Routing & Gateway Lab
    if (labId === 'lab-routing-gateway') {
      if (deviceId === 'pc1') {
        if (lower.startsWith('ip route show') || lower === 'ip route' || lower === 'route -n') {
          const gw = deviceState.gateway || '192.168.1.254';
          logs.push({ text: `default via ${gw} dev eth0 proto static metric 100`, type: 'output' });
          logs.push({ text: `192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10`, type: 'output' });
          this.markTaskCompleted('t1');
        } else if (lower.startsWith('ip a') || lower === 'ifconfig') {
          logs.push({ text: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST> mtu 1500`, type: 'output' });
          logs.push({ text: `    inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0`, type: 'output' });
          logs.push({ text: `    ether 52:54:00:12:34:56 txqueuelen 1000 (Ethernet)`, type: 'output' });
        } else if (lower.includes('set gateway') || lower.includes('ip route replace default via') || lower.includes('ip route add default via')) {
          const match = cmd.match(/(?:set gateway|via)\s+([0-9.]+)/i);
          const newGw = match ? match[1] : '';
          if (newGw) {
            deviceState.gateway = newGw;
            devStates[deviceId] = deviceState;
            this.labDeviceStates.set(devStates);
            logs.push({ text: `[OK] Varsayılan ağ geçidi (Default Gateway) ${newGw} olarak güncellendi.`, type: 'success' });
            if (newGw === '192.168.1.1') {
              this.markTaskCompleted('t2');
            }
          } else {
            logs.push({ text: 'Kullanım: set gateway 192.168.1.1 veya ip route replace default via 192.168.1.1', type: 'error' });
          }
        } else if (lower.startsWith('ping')) {
          const target = cmd.split(' ')[1] || '';
          if (target === '10.0.0.50' || target === '10.0.0.1') {
            const currentGw = deviceState.gateway;
            if (currentGw === '192.168.1.1') {
              // Success!
              this.triggerPacketAnimation('pc1', 'srv1', 'icmp', true, 'ICMP Echo Ping');
              logs.push({ text: `PING ${target} (${target}) 56(84) bytes of data.`, type: 'output' });
              logs.push({ text: `64 bytes from ${target}: icmp_seq=1 ttl=63 time=2.41 ms`, type: 'success' });
              logs.push({ text: `64 bytes from ${target}: icmp_seq=2 ttl=63 time=1.89 ms`, type: 'success' });
              logs.push({ text: `64 bytes from ${target}: icmp_seq=3 ttl=63 time=2.04 ms`, type: 'success' });
              logs.push({ text: `--- ${target} ping statistics ---`, type: 'output' });
              logs.push({ text: `3 packets transmitted, 3 received, 0% packet loss, time 2002ms`, type: 'success' });
              this.markTaskCompleted('t3');
            } else {
              // Failure due to bad gateway
              this.triggerPacketAnimation('pc1', 'sw1', 'icmp', false, 'ICMP Dropped (No Route)');
              logs.push({ text: `PING ${target} (${target}) 56(84) bytes of data.`, type: 'output' });
              logs.push({ text: `From ${currentGw} icmp_seq=1 Destination Host Unreachable`, type: 'error' });
              logs.push({ text: `From ${currentGw} icmp_seq=2 Destination Host Unreachable`, type: 'error' });
              logs.push({ text: `--- ${target} ping statistics ---`, type: 'output' });
              logs.push({ text: `2 packets transmitted, 0 received, +2 errors, 100% packet loss`, type: 'error' });
              logs.push({ text: `HATA: Paketler ağ geçidine ulaşıyor ancak ${currentGw} geçerli bir yönlendirici değil!`, type: 'error' });
            }
          } else if (target === '192.168.1.1') {
            logs.push({ text: `PING 192.168.1.1 56(84) bytes: 64 bytes from 192.168.1.1: icmp_seq=1 time=0.45 ms`, type: 'success' });
          } else {
            logs.push({ text: `PING ${target}: Request timed out.`, type: 'error' });
          }
        } else if (lower.startsWith('traceroute')) {
          const target = cmd.split(' ')[1] || '10.0.0.50';
          if (deviceState.gateway === '192.168.1.1') {
            logs.push({ text: `traceroute to ${target} (10.0.0.50), 30 hops max`, type: 'output' });
            logs.push({ text: ` 1  192.168.1.1 (Router-R1 eth0)  0.812 ms`, type: 'output' });
            logs.push({ text: ` 2  10.0.0.50 (Web-Sunucu)  2.140 ms`, type: 'success' });
          } else {
            logs.push({ text: ` 1  ${deviceState.gateway} * * * Destination Host Unreachable`, type: 'error' });
          }
        } else {
          logs.push({ text: `bash: ${cmd}: komut anlaşılamadı. Desteklenen komutlar için 'help' yazın.`, type: 'error' });
        }
      } else if (deviceId === 'r1') {
        if (lower.includes('show ip interface') || lower === 'ip a') {
          logs.push({ text: `Interface                  IP-Address      OK? Status                Protocol`, type: 'output' });
          logs.push({ text: `GigabitEthernet0/0 (eth0)  192.168.1.1     YES up                    up`, type: 'output' });
          logs.push({ text: `GigabitEthernet0/1 (eth1)  10.0.0.1        YES up                    up`, type: 'output' });
        } else if (lower.includes('show ip route')) {
          logs.push({ text: `Codes: C - connected, S - static, R - RIP, O - OSPF`, type: 'output' });
          logs.push({ text: `C    192.168.1.0/24 is directly connected, GigabitEthernet0/0`, type: 'output' });
          logs.push({ text: `C    10.0.0.0/24 is directly connected, GigabitEthernet0/1`, type: 'output' });
        } else {
          logs.push({ text: `R1: Bilinmeyen komut. 'show ip interface brief' veya 'show ip route' deneyin.`, type: 'error' });
        }
      }
    }

    // SCENARIO 2: VLAN & Trunk Lab
    else if (labId === 'lab-vlan-trunk') {
      if (deviceId === 'sw1') {
        const swState = devStates['sw1'] || {};
        const currentVlan = swState.vlan || 10;
        if (lower.includes('show vlan') || lower === 'vlan list') {
          logs.push({ text: `VLAN Name                             Status    Ports`, type: 'output' });
          logs.push({ text: `---- -------------------------------- --------- -------------------------------`, type: 'output' });
          logs.push({ text: `1    default                          active    Fa0/3, Fa0/4`, type: 'output' });
          logs.push({ text: `10   Muhasebe_VLAN                    active    Fa0/1, ${currentVlan === 10 ? 'Fa0/2' : ''}`, type: 'output' });
          logs.push({ text: `20   Yazilim_Dev                      active    Fa0/24, ${currentVlan === 20 ? 'Fa0/2' : ''}`, type: 'output' });
          this.markTaskCompleted('v1');
        } else if (lower.includes('set vlan') || lower.includes('switchport access vlan') || lower.includes('vlan 20')) {
          swState.vlan = 20;
          devStates['sw1'] = swState;
          devStates['pc_dev'] = { ...(devStates['pc_dev'] || {}), vlan: 20 };
          this.labDeviceStates.set(devStates);
          logs.push({ text: `Switch-Kat1(config-if)# switchport mode access`, type: 'output' });
          logs.push({ text: `Switch-Kat1(config-if)# switchport access vlan 20`, type: 'output' });
          logs.push({ text: `[BAŞARILI] Port FastEthernet0/2 VLAN 20 (Yazilim_Dev) grubuna atandı.`, type: 'success' });
          this.markTaskCompleted('v2');
        } else {
          logs.push({ text: `Desteklenen switch komutları: 'show vlan brief', 'set vlan Fa0/2 20'`, type: 'error' });
        }
      } else if (deviceId === 'pc_dev') {
        const swState = devStates['sw1'] || {};
        const vlan = swState.vlan || 10;
        if (lower.startsWith('ping')) {
          const target = cmd.split(' ')[1] || '192.168.20.100';
          if (target === '192.168.20.100') {
            if (vlan === 20) {
              this.triggerPacketAnimation('pc_dev', 'srv_dev', 'icmp', true, 'VLAN 20 L2 Frame');
              logs.push({ text: `PING 192.168.20.100 (192.168.20.100) 56(84) bytes:`, type: 'output' });
              logs.push({ text: `64 bytes from 192.168.20.100: icmp_seq=1 ttl=64 time=0.62 ms`, type: 'success' });
              logs.push({ text: `64 bytes from 192.168.20.100: icmp_seq=2 ttl=64 time=0.51 ms`, type: 'success' });
              logs.push({ text: `--- 192.168.20.100 ping istatistikleri: 0% paket kaybı ---`, type: 'success' });
              this.markTaskCompleted('v3');
            } else {
              this.triggerPacketAnimation('pc_dev', 'sw1', 'icmp', false, 'Dropped by VLAN 10 Boundary');
              logs.push({ text: `PING 192.168.20.100: Request timed out.`, type: 'error' });
              logs.push({ text: `HATA: PC-Dev portu VLAN 10'da, sunucu portu VLAN 20'de! Layer 2 izolasyonu nedeniyle ARP/ICMP paketleri hedefe iletilemiyor.`, type: 'error' });
            }
          } else {
            logs.push({ text: `PING ${target}: Request timed out.`, type: 'error' });
          }
        } else if (lower.startsWith('ip a')) {
          logs.push({ text: `inet 192.168.20.15/24 brd 192.168.20.255 scope global eth0`, type: 'output' });
        } else {
          logs.push({ text: `Komut: 'ping 192.168.20.100' veya 'help' yazın.`, type: 'output' });
        }
      }
    }

    // SCENARIO 3: DNS Resolution Lab
    else if (labId === 'lab-dns-resolution') {
      const clientState = devStates['client_pc'] || {};
      const currentDns = clientState.dns || '192.168.1.99';

      if (lower.includes('cat /etc/resolv.conf')) {
        logs.push({ text: `# Generated by NetworkManager`, type: 'system' });
        logs.push({ text: `nameserver ${currentDns}`, type: 'output' });
        this.markTaskCompleted('d1');
      } else if (lower.includes('set dns') || lower.includes('nameserver 192.168.1.5') || lower.includes('192.168.1.5')) {
        clientState.dns = '192.168.1.5';
        devStates['client_pc'] = clientState;
        this.labDeviceStates.set(devStates);
        logs.push({ text: `[OK] /etc/resolv.conf güncellendi: nameserver 192.168.1.5`, type: 'success' });
        this.markTaskCompleted('d2');
      } else if (lower.startsWith('nslookup') || lower.startsWith('curl')) {
        const domain = cmd.split(' ')[1] || 'lab.local';
        if (currentDns === '192.168.1.5') {
          this.triggerPacketAnimation('client_pc', 'dns_srv', 'dns', true, 'DNS Query (Port 53)');
          logs.push({ text: `Server:         192.168.1.5`, type: 'output' });
          logs.push({ text: `Address:        192.168.1.5#53`, type: 'output' });
          logs.push({ text: `Non-authoritative answer:`, type: 'output' });
          logs.push({ text: `Name:   ${domain}`, type: 'output' });
          logs.push({ text: `Address: 192.168.1.50`, type: 'success' });
          logs.push({ text: `HTTP/1.1 200 OK - Welcome to Internal Web Service!`, type: 'success' });
          this.markTaskCompleted('d3');
        } else {
          this.triggerPacketAnimation('client_pc', 'dns_srv', 'dns', false, 'DNS Server Unreachable');
          logs.push({ text: `;; connection timed out; no servers could be reached (${currentDns}:53)`, type: 'error' });
          logs.push({ text: `curl: (6) Could not resolve host: ${domain}`, type: 'error' });
        }
      } else {
        logs.push({ text: `Komut listesi için 'help' yazınız.`, type: 'output' });
      }
    }

    // SCENARIO 4: Firewall iptables Lab
    else if (labId === 'lab-firewall-iptables') {
      const fwState = devStates['fw_node'] || {};
      const rules = fwState.firewallRules || ['-P INPUT DROP', '-A INPUT -p tcp --dport 22 -j ACCEPT'];

      if (deviceId === 'fw_node') {
        if (lower.includes('iptables -l') || lower.includes('iptables -s')) {
          logs.push({ text: `Chain INPUT (policy DROP 41 packets, 2460 bytes)`, type: 'output' });
          logs.push({ text: ` pkts bytes target     prot opt in     out     source      destination`, type: 'output' });
          logs.push({ text: `  124  8920 ACCEPT     tcp  --  *      *       0.0.0.0/0   0.0.0.0/0   tcp dpt:22`, type: 'output' });
          if (rules.some(r => r.includes('dport 80'))) {
            logs.push({ text: `   88  5280 ACCEPT     tcp  --  *      *       0.0.0.0/0   0.0.0.0/0   tcp dpt:80`, type: 'success' });
          }
          logs.push({ text: `Chain FORWARD (policy ACCEPT)`, type: 'output' });
          logs.push({ text: `Chain OUTPUT (policy ACCEPT)`, type: 'output' });
          this.markTaskCompleted('f1');
        } else if (lower.includes('dport 80') || lower.includes('allow port 80') || (lower.includes('iptables -a input') && lower.includes('80'))) {
          rules.push('-A INPUT -p tcp --dport 80 -j ACCEPT');
          fwState.firewallRules = rules;
          devStates['fw_node'] = fwState;
          this.labDeviceStates.set(devStates);
          logs.push({ text: `[BAŞARILI] iptables kuralı eklendi: INPUT zincirinde TCP port 80 trafiğine izin verildi.`, type: 'success' });
          this.markTaskCompleted('f2');
        } else {
          logs.push({ text: `Desteklenen komut: 'iptables -L -n -v', 'iptables -A INPUT -p tcp --dport 80 -j ACCEPT'`, type: 'output' });
        }
      } else if (deviceId === 'client_audit') {
        const hasPort80 = (fwState.firewallRules || []).some(r => r.includes('dport 80'));
        if (lower.startsWith('curl')) {
          if (hasPort80) {
            this.triggerPacketAnimation('client_audit', 'app_srv', 'http', true, 'HTTP GET / 200 OK');
            logs.push({ text: `> GET / HTTP/1.1`, type: 'output' });
            logs.push({ text: `> Host: 192.168.100.10`, type: 'output' });
            logs.push({ text: `< HTTP/1.1 200 OK`, type: 'success' });
            logs.push({ text: `< Content-Type: text/html; charset=UTF-8`, type: 'success' });
            logs.push({ text: `<!DOCTYPE html><html><body><h1>NetLab Web Servisi Aktif!</h1></body></html>`, type: 'success' });
            this.markTaskCompleted('f3');
          } else {
            this.triggerPacketAnimation('client_audit', 'fw_node', 'http', false, 'Dropped by iptables INPUT DROP');
            logs.push({ text: `curl: (7) Failed to connect to 192.168.100.10 port 80: Connection timed out`, type: 'error' });
            logs.push({ text: `HATA: Paket güvenlik duvarının INPUT filtresine takıldı ve DROP edildi.`, type: 'error' });
          }
        } else if (lower.startsWith('ping')) {
          logs.push({ text: `PING 192.168.100.10: 64 bytes time=0.89 ms`, type: 'output' });
        }
      }
    }

    this.terminalLogs.set({ ...this.terminalLogs(), [key]: logs });
  }

  private markTaskCompleted(taskId: string) {
    const tasks = { ...this.completedTaskIds() };
    tasks[taskId] = true;
    this.completedTaskIds.set(tasks);
  }

  private triggerPacketAnimation(from: string, to: string, type: 'icmp' | 'dns' | 'http' | 'arp', success: boolean, label: string) {
    this.packetFlow.set({ active: true, from, to, type, success, label });
    setTimeout(() => {
      this.packetFlow.set(null);
    }, 2800);
  }

  // Automated solution checker
  verifyLabSolution() {
    const labId = this.activeLabId();
    const devStates = this.labDeviceStates();

    if (labId === 'lab-routing-gateway') {
      const pc1State = devStates['pc1'] || {};
      if (pc1State.gateway === '192.168.1.1') {
        this.markTaskCompleted('t1');
        this.markTaskCompleted('t2');
        this.markTaskCompleted('t3');
        this.labVerification.set({
          status: 'success',
          message: 'Tebrikler! Lab Başarıyla Tamamlandı!',
          details: 'PC-1 için varsayılan ağ geçidi (Default Gateway) 192.168.1.1 olarak doğru ayarlandı. Artık yerel ağ dışındaki 10.0.0.50 sunucusuna paketler Router-R1 üzerinden eksiksiz ulaşıyor.'
        });
      } else {
        this.labVerification.set({
          status: 'failed',
          message: 'Henüz doğru çözüme ulaşılamadı.',
          details: `PC-1 üzerindeki varsayılan ağ geçidi şu anda "${pc1State.gateway || 'Tanımsız'}". Ağ geçidinin Router-R1 yerel IP adresi olan "192.168.1.1" olması gerekmektedir. PC-1 terminalinde "set gateway 192.168.1.1" çalıştırın.`
        });
      }
    } else if (labId === 'lab-vlan-trunk') {
      const swState = devStates['sw1'] || {};
      if (swState.vlan === 20) {
        this.markTaskCompleted('v1');
        this.markTaskCompleted('v2');
        this.markTaskCompleted('v3');
        this.labVerification.set({
          status: 'success',
          message: 'Tebrikler! VLAN Yapılandırması Başarılı!',
          details: 'FastEthernet0/2 portu VLAN 20 Yazılım grubuna dahil edildi. PC-Dev ve Dev-Sunucu artık aynı L2 yayın etki alanında iletişim kurabiliyor.'
        });
      } else {
        this.labVerification.set({
          status: 'failed',
          message: 'VLAN port ataması henüz tamamlanmadı.',
          details: 'Switch-Kat1 terminalinde Fa0/2 portunu VLAN 20\'ye atayın: "set vlan Fa0/2 20"'
        });
      }
    } else if (labId === 'lab-dns-resolution') {
      const clientState = devStates['client_pc'] || {};
      if (clientState.dns === '192.168.1.5') {
        this.markTaskCompleted('d1');
        this.markTaskCompleted('d2');
        this.markTaskCompleted('d3');
        this.labVerification.set({
          status: 'success',
          message: 'Mükemmel! DNS Çözümleme Tamamlandı!',
          details: '/etc/resolv.conf dosyasındaki nameserver adresi 192.168.1.5 yapıldı. "lab.local" sorguları artık doğru web sunucusunu (192.168.1.50) çözümlüyor.'
        });
      } else {
        this.labVerification.set({
          status: 'failed',
          message: 'DNS sunucu adresi güncellenmedi.',
          details: 'İstemci terminalinde "set dns 192.168.1.5" komutunu çalıştırarak aktif DNS sunucu IP\'sini tanımlayın.'
        });
      }
    } else if (labId === 'lab-firewall-iptables') {
      const fwState = devStates['fw_node'] || {};
      const rules = fwState.firewallRules || [];
      if (rules.some(r => r.includes('dport 80'))) {
        this.markTaskCompleted('f1');
        this.markTaskCompleted('f2');
        this.markTaskCompleted('f3');
        this.labVerification.set({
          status: 'success',
          message: 'Harika! Güvenlik Duvarı Kuralı Onaylandı!',
          details: 'iptables INPUT zincirine Port 80 için ACCEPT kuralı eklendi. Web servisi güvenli bir şekilde dış istemcilerin erişimine açıldı.'
        });
      } else {
        this.labVerification.set({
          status: 'failed',
          message: 'Port 80 izin kuralı eksik.',
          details: 'Sunucu konsolunda "iptables -A INPUT -p tcp --dport 80 -j ACCEPT" veya "allow port 80" komutunu çalıştırın.'
        });
      }
    }
  }

  // Update subnet inputs
  updateSubnet(ip: string, cidr: number) {
    this.subnetIpInput.set(ip);
    this.subnetCidrInput.set(cidr);
  }
}
