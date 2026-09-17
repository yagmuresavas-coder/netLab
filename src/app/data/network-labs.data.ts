import { LabScenario } from '../models/network.types';

export const NETWORK_LABS: LabScenario[] = [
  {
    id: 'lab-routing-gateway',
    moduleId: 'routing-gateway',
    title: 'Lab 1: Default Gateway ve Yönlendirme Arızası',
    badge: 'Layer 3 Arıza Tespiti',
    difficulty: 'Kolay',
    estimatedTime: '10 dk',
    description: 'PC1 istemcisi şirket iç ağı dışındaki Kurumsal Web Sunucusuna (10.0.0.50) erişemiyor. Ping attığında "Destination Host Unreachable" hatası alıyor. Ağ kartı ayarlarını ve ağ geçidini inceleyerek sorunu çözün.',
    goal: 'PC1 üzerinden 10.0.0.50 Web Sunucusuna başarılı ICMP Echo (ping) bağlantısı sağlamak.',
    topology: {
      nodes: [
        {
          id: 'pc1',
          name: 'PC-1 (İstemci)',
          type: 'pc',
          ip: '192.168.1.10',
          mask: '255.255.255.0',
          gateway: '192.168.1.254 (HATALI)',
          status: 'misconfigured',
          x: 15,
          y: 45
        },
        {
          id: 'sw1',
          name: 'Switch-Yerel',
          type: 'switch',
          status: 'online',
          x: 40,
          y: 45
        },
        {
          id: 'r1',
          name: 'Router-R1',
          type: 'router',
          ip: 'eth0: 192.168.1.1 | eth1: 10.0.0.1',
          status: 'online',
          x: 65,
          y: 45
        },
        {
          id: 'srv1',
          name: 'Web-Sunucu',
          type: 'server',
          ip: '10.0.0.50',
          mask: '255.255.255.0',
          gateway: '10.0.0.1',
          status: 'online',
          x: 88,
          y: 45
        }
      ],
      links: [
        { from: 'pc1', to: 'sw1', label: '1 Gbps Access', active: true },
        { from: 'sw1', to: 'r1', label: '1 Gbps Uplink', active: true },
        { from: 'r1', to: 'srv1', label: 'Wan Link (10.0.0.0/24)', active: true }
      ]
    },
    tasks: [
      {
        id: 't1',
        description: 'PC-1 üzerinde `ip route show` komutunu çalıştırarak mevcut ağ geçidini inceleyin.',
        hint: 'PC-1 terminalinde "ip route show" veya "route -n" yazın.',
        isCompleted: false
      },
      {
        id: 't2',
        description: 'Ağ geçidini Router-R1\'in yerel IP adresi olan 192.168.1.1 olarak düzeltin.',
        hint: '"ip route replace default via 192.168.1.1" veya "set gateway 192.168.1.1" komutunu kullanın.',
        isCompleted: false
      },
      {
        id: 't3',
        description: 'Sunucuya `ping 10.0.0.50` komutuyla paket gönderip bağlantıyı doğrulayın.',
        hint: '"ping 10.0.0.50" yazarak ICMP yanıtını gözlemleyin.',
        isCompleted: false
      }
    ],
    cliDevices: [
      {
        id: 'pc1',
        name: 'PC-1',
        type: 'pc',
        prompt: 'user@pc1:~$ ',
        helpCommands: [
          'ip a (Ağ arayüzlerini listele)',
          'ip route show (Yönlendirme ve gateway tablosunu göster)',
          'set gateway <ip> (Ağ geçidini değiştir)',
          'ip route replace default via <ip> (Varsayılan rotayı güncelle)',
          'ping <ip> (Hedef cihaza ICMP paketi gönder)',
          'traceroute <ip> (Paketin izlediği rotayı sekme sekme göster)',
          'clear (Ekranı temizle)'
        ]
      },
      {
        id: 'r1',
        name: 'Router-R1',
        type: 'router',
        prompt: 'R1# ',
        helpCommands: [
          'show ip interface brief (Router IP arayüzlerini listele)',
          'show ip route (Yönlendirme tablosunu listele)',
          'ping <ip> (Ping at)',
          'clear (Ekranı temizle)'
        ]
      }
    ],
    initialConfigSummary: 'PC1 IP: 192.168.1.10/24, Gateway: 192.168.1.254 (Geçersiz/Cevap vermeyen IP). Router eth0: 192.168.1.1, eth1: 10.0.0.1.',
    expectedCommandsOrFix: 'set gateway 192.168.1.1 veya ip route replace default via 192.168.1.1',
    solutionWalkthrough: [
      'PC1 kendi ağı dışındaki 10.0.0.50 adresine paket yollamak istediğinde Default Gateway\'e bakar.',
      'Mevcut gateway 192.168.1.254 olarak ayarlanmış fakat bu adreste aktif bir yönlendirici yoktur.',
      'Router R1\'in yerel IP\'si 192.168.1.1\'dir.',
      '"set gateway 192.168.1.1" komutu ile rota düzeltildiğinde ping paketleri başarıyla R1 üzerinden 10.0.0.50 sunucusuna ulaşır.'
    ]
  },
  {
    id: 'lab-vlan-trunk',
    moduleId: 'switching-vlan',
    title: 'Lab 2: VLAN İzolasyonu ve Port Yapılandırması',
    badge: 'Layer 2 Switching',
    difficulty: 'Orta',
    estimatedTime: '12 dk',
    description: 'Yazılım Departmanı bilgisayarı (PC-Dev), Yazılım Test Sunucusuna (192.168.20.100) erişemiyor. Yapılan ilk kontrolde Switch-1 üzerindeki FastEthernet0/2 portunun yanlışlıkla Muhasebe VLAN 10\'a atandığı fark edildi. Portu doğru VLAN\'a (VLAN 20) alarak izolasyonu çözün.',
    goal: 'PC-Dev portunu VLAN 20\'ye atayarak Test Sunucusuna ping atılabilir hale getirmek.',
    topology: {
      nodes: [
        {
          id: 'pc_dev',
          name: 'PC-Dev (Yazılımcı)',
          type: 'pc',
          ip: '192.168.20.15/24',
          status: 'misconfigured',
          vlan: 10,
          x: 18,
          y: 35
        },
        {
          id: 'pc_acc',
          name: 'PC-Acc (Muhasebe)',
          type: 'pc',
          ip: '192.168.10.15/24',
          status: 'online',
          vlan: 10,
          x: 18,
          y: 65
        },
        {
          id: 'sw1',
          name: 'Switch-Kat1',
          type: 'switch',
          status: 'online',
          x: 52,
          y: 50
        },
        {
          id: 'srv_dev',
          name: 'Dev-Sunucu (VLAN 20)',
          type: 'server',
          ip: '192.168.20.100/24',
          vlan: 20,
          status: 'online',
          x: 82,
          y: 50
        }
      ],
      links: [
        { from: 'pc_dev', to: 'sw1', label: 'Port Fa0/2 (VLAN 10 HATALI)', active: true },
        { from: 'pc_acc', to: 'sw1', label: 'Port Fa0/1 (VLAN 10)', active: true },
        { from: 'sw1', to: 'srv_dev', label: 'Port Fa0/24 (VLAN 20)', active: true }
      ]
    },
    tasks: [
      {
        id: 'v1',
        description: 'Switch-Kat1 terminalinde `show vlan brief` veya `show mac address-table` çalıştırıp port atamalarını görün.',
        hint: 'Switch terminaline geçin ve "show vlan brief" yazın.',
        isCompleted: false
      },
      {
        id: 'v2',
        description: 'Fa0/2 portunu VLAN 20 (Yazılım) olarak yeniden yapılandırın.',
        hint: '"set vlan Fa0/2 20" veya "switchport access vlan 20" komutunu çalıştırın.',
        isCompleted: false
      },
      {
        id: 'v3',
        description: 'PC-Dev terminaline dönerek `ping 192.168.20.100` ile bağlantıyı test edin.',
        hint: '"ping 192.168.20.100" yazarak iletişimi onaylayın.',
        isCompleted: false
      }
    ],
    cliDevices: [
      {
        id: 'pc_dev',
        name: 'PC-Dev',
        type: 'pc',
        prompt: 'dev@workstation:~$ ',
        helpCommands: [
          'ip a (IP adresini kontrol et)',
          'ping <ip> (Sunucuya ping at)',
          'arp -a (ARP tablosunu görüntüle)',
          'clear (Ekranı temizle)'
        ]
      },
      {
        id: 'sw1',
        name: 'Switch-Kat1',
        type: 'switch',
        prompt: 'Switch-Kat1# ',
        helpCommands: [
          'show vlan brief (VLAN ve port eşleşmelerini listele)',
          'set vlan <port> <vlan_id> (Belirtilen portun VLAN numarasını güncelle)',
          'switchport access vlan <id> (Portu belirtilen VLAN\'a ata)',
          'show mac address-table (Öğrenilen MAC adreslerini göster)',
          'clear (Ekranı temizle)'
        ]
      }
    ],
    initialConfigSummary: 'Fa0/1 -> VLAN 10, Fa0/2 -> VLAN 10 (HATALI, PC-Dev bağlı), Fa0/24 -> VLAN 20 (Dev-Sunucu bağlı).',
    expectedCommandsOrFix: 'set vlan Fa0/2 20',
    solutionWalkthrough: [
      'Switchler Layer 2 seviyesinde VLAN etiketlerine göre yayın etki alanlarını ayırır.',
      'PC-Dev (192.168.20.15) VLAN 10 portuna takılı olduğu için gönderdiği ARP ve ICMP paketleri sadece VLAN 10 portlarına yayılıyordu.',
      'Fa0/2 portu VLAN 20\'ye geçirildiğinde, PC-Dev artık Dev-Sunucu ile aynı L2 yayın alanında buluşur ve bağlantı sağlanır.'
    ]
  },
  {
    id: 'lab-dns-resolution',
    moduleId: 'app-protocols',
    title: 'Lab 3: DNS Çözümleme ve resolv.conf Arızası',
    badge: 'Layer 7 Uygulama Servisleri',
    difficulty: 'Kolay',
    estimatedTime: '8 dk',
    description: 'Bir istemci internete ve doğrudan IP adreslerine (örneğin 1.1.1.1 ve intranet sunucusu 192.168.1.50) ping atabilmektedir. Ancak "curl http://lab.local" veya "nslookup lab.local" yaptığında "DNS resolution failed" hatası almaktadır. İstemcinin DNS yapılandırmasını düzeltin.',
    goal: 'lab.local alan adının 192.168.1.50 IP adresine başarıyla çözümlenmesini sağlamak.',
    topology: {
      nodes: [
        {
          id: 'client_pc',
          name: 'İstemci PC',
          type: 'pc',
          ip: '192.168.1.20',
          gateway: '192.168.1.1',
          status: 'misconfigured',
          x: 20,
          y: 45
        },
        {
          id: 'dns_srv',
          name: 'DNS Sunucusu (Bind9)',
          type: 'server',
          ip: '192.168.1.5 (Port 53)',
          status: 'online',
          x: 55,
          y: 25
        },
        {
          id: 'web_srv',
          name: 'Web Sunucusu (lab.local)',
          type: 'server',
          ip: '192.168.1.50 (Port 80)',
          status: 'online',
          x: 75,
          y: 65
        }
      ],
      links: [
        { from: 'client_pc', to: 'dns_srv', label: 'DNS UDP 53', active: true },
        { from: 'client_pc', to: 'web_srv', label: 'HTTP TCP 80', active: true }
      ]
    },
    tasks: [
      {
        id: 'd1',
        description: 'İstemcide `cat /etc/resolv.conf` komutuyla mevcut DNS ayarını görüntüleyin.',
        hint: 'Terminalde "cat /etc/resolv.conf" yazarak hatalı nameserver adresini görün.',
        isCompleted: false
      },
      {
        id: 'd2',
        description: 'Nameserver adresini aktif yerel DNS sunucu olan 192.168.1.5 olarak güncelleyin.',
        hint: '"set dns 192.168.1.5" veya "echo nameserver 192.168.1.5 > /etc/resolv.conf" yazın.',
        isCompleted: false
      },
      {
        id: 'd3',
        description: '`nslookup lab.local` veya `curl http://lab.local` komutunu çalıştırarak alan adı çözümlemesini doğrulayın.',
        hint: '"nslookup lab.local" komutuyla 192.168.1.50 yanıtını test edin.',
        isCompleted: false
      }
    ],
    cliDevices: [
      {
        id: 'client_pc',
        name: 'İstemci PC',
        type: 'pc',
        prompt: 'user@terminal:~$ ',
        helpCommands: [
          'cat /etc/resolv.conf (Mevcut DNS sunucu adresini oku)',
          'set dns <ip> (DNS sunucu IP adresini güncelle)',
          'echo nameserver <ip> > /etc/resolv.conf (DNS yapılandırma dosyasını yaz)',
          'nslookup <domain> (Alan adı DNS sorgusu yap)',
          'ping <ip_or_host> (Ping gönder)',
          'curl <url> (HTTP isteği gönder)',
          'clear (Ekranı temizle)'
        ]
      }
    ],
    initialConfigSummary: 'İstemci /etc/resolv.conf dosyası "nameserver 192.168.1.99" (yanıt vermeyen adres) olarak ayarlı. Gerçek DNS sunucusu: 192.168.1.5.',
    expectedCommandsOrFix: 'set dns 192.168.1.5 veya echo nameserver 192.168.1.5 > /etc/resolv.conf',
    solutionWalkthrough: [
      'İstemcideki /etc/resolv.conf dosyasında bulunan 192.168.1.99 IP adresi ağda mevcut değildir.',
      'İstemci DNS sorgularına cevap alamadığı için alan adını çözümleyememektedir.',
      'Doğru DNS IP\'si 192.168.1.5 olarak güncellendiğinde DNS sorguları başarıyla çözümlenir.'
    ]
  },
  {
    id: 'lab-firewall-iptables',
    moduleId: 'security-firewall',
    title: 'Lab 4: iptables Güvenlik Duvarı ve Port Engelleme',
    badge: 'Ağ Güvenliği & Savunma',
    difficulty: 'Orta',
    estimatedTime: '15 dk',
    description: 'Üretim sunucusunda yeni bir Web uygulaması (TCP Port 80) devreye alındı. Ancak istemciler web sayfasına bağlanamıyor (`curl: (7) Failed to connect`). Güvenlik duvarı (iptables) kurallarını inceleyin, varsayılan DROP politikasını koruyarak Port 80 web trafiğine izin veren kuralı ekleyin.',
    goal: 'iptables INPUT zincirine TCP Port 80 ACCEPT kuralı ekleyerek Web erişimini sağlamak.',
    topology: {
      nodes: [
        {
          id: 'client_audit',
          name: 'İstemci / Tarayıcı',
          type: 'pc',
          ip: '192.168.100.25',
          status: 'online',
          x: 20,
          y: 45
        },
        {
          id: 'fw_node',
          name: 'Sunucu Firewall (iptables)',
          type: 'firewall',
          status: 'misconfigured',
          x: 55,
          y: 45
        },
        {
          id: 'app_srv',
          name: 'Web Servisi (Nginx)',
          type: 'server',
          ip: '192.168.100.10:80',
          status: 'online',
          x: 82,
          y: 45
        }
      ],
      links: [
        { from: 'client_audit', to: 'fw_node', label: 'HTTP İstek (Port 80)', active: true },
        { from: 'fw_node', to: 'app_srv', label: 'Localhost Proxy', active: true }
      ]
    },
    tasks: [
      {
        id: 'f1',
        description: 'Sunucu terminalinde `iptables -L -n -v` komutunu çalıştırarak mevcut güvenlik kurallarını ve bloklanan paketleri inceleyin.',
        hint: 'Terminalde "iptables -L -n" yazın.',
        isCompleted: false
      },
      {
        id: 'f2',
        description: 'TCP Port 80 (HTTP) trafiğine izin veren kuralı INPUT zincirine ekleyin.',
        hint: '"iptables -A INPUT -p tcp --dport 80 -j ACCEPT" veya "allow port 80" yazın.',
        isCompleted: false
      },
      {
        id: 'f3',
        description: 'İstemci terminalinden `curl http://192.168.100.10` komutunu vererek web sayfasının döndüğünü doğrulayın.',
        hint: '"curl http://192.168.100.10" komutunu çalıştırın.',
        isCompleted: false
      }
    ],
    cliDevices: [
      {
        id: 'fw_node',
        name: 'Sunucu Konsolu',
        type: 'server',
        prompt: 'root@production-srv:~# ',
        helpCommands: [
          'iptables -L -n -v (Mevcut firewall kurallarını ve sayaçlarını listele)',
          'iptables -A INPUT -p tcp --dport 80 -j ACCEPT (Port 80 trafiğine izin ver)',
          'allow port 80 (Port 80 için izin kuralı ekle)',
          'iptables -F (Tüm kuralları temizle)',
          'curl http://192.168.100.10 (Yerel HTTP servisini test et)',
          'clear (Ekranı temizle)'
        ]
      },
      {
        id: 'client_audit',
        name: 'İstemci',
        type: 'pc',
        prompt: 'tester@client:~$ ',
        helpCommands: [
          'curl http://192.168.100.10 (Sunucuya HTTP isteği gönder)',
          'ping 192.168.100.10 (ICMP ping testi)',
          'clear (Ekranı temizle)'
        ]
      }
    ],
    initialConfigSummary: 'INPUT zinciri varsayılan DROP politikası. Yalnızca Port 22 (SSH) ACCEPT tanımlı. Port 80 için herhangi bir kural yok.',
    expectedCommandsOrFix: 'iptables -A INPUT -p tcp --dport 80 -j ACCEPT veya allow port 80',
    solutionWalkthrough: [
      'Linux Netfilter mimarisinde varsayılan politika DROP ise, açıkça izin verilmemiş tüm gelen paketler sessizce yok edilir.',
      'Port 80 için "iptables -A INPUT -p tcp --dport 80 -j ACCEPT" kuralı eklendiğinde HTTP trafiği Nginx servisine iletilir.'
    ]
  }
];
