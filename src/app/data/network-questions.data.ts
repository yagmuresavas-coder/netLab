import { Question } from '../models/network.types';

export const NETWORK_QUESTIONS: Question[] = [
  // Module 1: OSI & TCP/IP
  {
    id: 'q1',
    moduleId: 'osi-tcpip',
    difficulty: 'Başlangıç',
    category: 'OSI Modeli',
    question: 'OSI modelinde mantıksal adresleme (IP) ve en iyi yol seçimi (routing) hangi katmanda gerçekleşir?',
    options: [
      'Katman 2 - Veri Bağı (Data Link)',
      'Katman 3 - Ağ (Network)',
      'Katman 4 - Taşıma (Transport)',
      'Katman 5 - Oturum (Session)'
    ],
    correctAnswerIndex: 1,
    explanation: 'Katman 3 (Ağ Katmanı), mantıksal IP adresleme, paketleme ve yönlendiriciler (Router) aracılığıyla paketlerin en iyi rotadan hedefe iletilmesini sağlar.',
    rfcOrStandard: 'ISO 7498-1 Standardı'
  },
  {
    id: 'q2',
    moduleId: 'osi-tcpip',
    difficulty: 'Orta',
    category: 'TCP Protokolü',
    question: 'TCP 3 yollu el sıkışma (3-Way Handshake) sürecinde sunucunun istemciye gönderdiği ikinci pakette hangi bayraklar (flags) aktiftir?',
    options: [
      'Yalnızca SYN',
      'SYN ve ACK',
      'Yalnızca ACK',
      'RST ve ACK'
    ],
    correctAnswerIndex: 1,
    explanation: 'İstemci ilk olarak SYN (Synchronize) bayraklı paket gönderir. Sunucu bu isteği aldığını bildirmek için kendi sıra numarasını (SYN) ve istemcinin sıra numarasının onayını (ACK) tek bir pakette birleştirerek SYN-ACK gönderir.',
    rfcOrStandard: 'RFC 793 - Transmission Control Protocol'
  },
  {
    id: 'q3',
    moduleId: 'osi-tcpip',
    difficulty: 'Başlangıç',
    category: 'PDU ve Enkapsülasyon',
    question: 'OSI Katman 4 (Taşıma Katmanı) protokol veri birimine (PDU) ne ad verilir?',
    options: [
      'Bit',
      'Çerçeve (Frame)',
      'Paket (Packet)',
      'Segment'
    ],
    correctAnswerIndex: 3,
    explanation: 'Katman 4 PDU\'su TCP için Segment, UDP için Datagram olarak adlandırılır. Katman 3\'te Paket, Katman 2\'de Çerçeve (Frame), Katman 1\'de ise Bit adını alır.',
    rfcOrStandard: 'OSI Reference Model PDU Nomenclature'
  },
  {
    id: 'q4',
    moduleId: 'osi-tcpip',
    difficulty: 'İleri',
    category: 'TCP Bayrakları',
    question: 'Bir ana bilgisayar, açık olmayan veya dinlenmeyen bir TCP portuna gelen SYN paketine standart olarak hangi bayrakla yanıt verir?',
    options: [
      'FIN',
      'RST (Reset)',
      'URG',
      'ICMP Echo Reply'
    ],
    correctAnswerIndex: 1,
    explanation: 'Hedef portta hiçbir servis dinlemiyorsa işletim sistemi TCP bağlantısını derhal reddetmek için RST (Reset) veya RST-ACK bayrağı içeren bir paket döndürür.',
    rfcOrStandard: 'RFC 793 Section 3.4'
  },

  // Module 2: IP Subnetting & CIDR
  {
    id: 'q5',
    moduleId: 'ip-subnetting',
    difficulty: 'Başlangıç',
    category: 'Özel IP Adresleri',
    question: 'RFC 1918 standardına göre C Sınıfı özel (Private) IP adres aralığı aşağıdakilerden hangisidir?',
    options: [
      '10.0.0.0 - 10.255.255.255 (/8)',
      '172.16.0.0 - 172.31.255.255 (/12)',
      '192.168.0.0 - 192.168.255.255 (/16)',
      '169.254.0.0 - 169.254.255.255 (/16)'
    ],
    correctAnswerIndex: 2,
    explanation: 'RFC 1918\'e göre C sınıfı özel IP bloğu 192.168.0.0/16\'dır. 10.0.0.0/8 A sınıfı, 172.16.0.0/12 B sınıfı özel adreslerdir. 169.254.0.0/16 ise APIPA (Link-Local) aralığıdır.',
    rfcOrStandard: 'RFC 1918'
  },
  {
    id: 'q6',
    moduleId: 'ip-subnetting',
    difficulty: 'Orta',
    category: 'Alt Ağ Hesaplama',
    question: '192.168.10.64/26 alt ağında kullanılabilecek geçerli ilk ve son ana bilgisayar (usable host) IP adresleri hangileridir?',
    options: [
      '192.168.10.64 - 192.168.10.127',
      '192.168.10.65 - 192.168.10.126',
      '192.168.10.1 - 192.168.10.62',
      '192.168.10.65 - 192.168.10.127'
    ],
    correctAnswerIndex: 1,
    explanation: '/26 maskesi 64\'lük bloklar oluşturur. Bu bloğun Network adresi 192.168.10.64, Broadcast adresi 192.168.10.127\'dir. Dolayısıyla atanabilir hostlar 192.168.10.65 ile 192.168.10.126 arasındadır (toplam 62 host).',
    rfcOrStandard: 'RFC 4632 - CIDR'
  },
  {
    id: 'q7',
    moduleId: 'ip-subnetting',
    difficulty: 'İleri',
    category: 'Alt Ağ Tasarımı',
    question: 'İki router arasında noktadan noktaya (Point-to-Point) bir seri bağlantı için IP israfını en aza indiren en uygun CIDR maskesi hangisidir?',
    options: [
      '/28 (255.255.255.240)',
      '/29 (255.255.255.248)',
      '/30 (255.255.255.252)',
      '/24 (255.255.255.0)'
    ],
    correctAnswerIndex: 2,
    explanation: '/30 maskesi toplam 4 IP adresi sağlar: 1 Network ID, 1 Broadcast ve 2 kullanılabilir IP (2^(32-30) - 2 = 2 host). Bu iki IP tam olarak iki router ucu için mükemmeldir. (RFC 3021 /31 desteği istisnalar hariç standartta /30 kullanılır).',
    rfcOrStandard: 'RFC 1878 & RFC 3021'
  },

  // Module 3: Switching & VLAN
  {
    id: 'q8',
    moduleId: 'switching-vlan',
    difficulty: 'Başlangıç',
    category: 'Switching Mantığı',
    question: 'Bir switch, hedefine gidecek çerçevenin hedef MAC adresini kendi CAM (MAC) tablosunda bulamazsa ne yapar?',
    options: [
      'Çerçeveyi derhal drop eder (yok eder).',
      'Çerçeveyi geldiği port dahil her yere yayınlar.',
      'Gelen port hariç tüm aktif portlara çerçeveyi iletir (Flooding).',
      'Paketi varsayılan ağ geçidine (Gateway) gönderir.'
    ],
    correctAnswerIndex: 2,
    explanation: 'Bu duruma "Unknown Unicast Flooding" denir. Switch hedef MAC adresini henüz öğrenmediği için çerçeveyi geldiği kaynak port hariç aynı VLAN\'daki tüm portlara yayarak yanıt bekler.',
    rfcOrStandard: 'IEEE 802.1D Standardı'
  },
  {
    id: 'q9',
    moduleId: 'switching-vlan',
    difficulty: 'Orta',
    category: 'VLAN ve Trunk',
    question: 'İki switch arasındaki bir bağlantıda birden fazla VLAN trafiğini etiketleyerek taşımak için kullanılan evrensel IEEE standardı hangisidir?',
    options: [
      'IEEE 802.3u',
      'IEEE 802.11ax',
      'IEEE 802.1Q (dot1q)',
      'IEEE 802.1X'
    ],
    correctAnswerIndex: 2,
    explanation: 'IEEE 802.1Q (kısaca dot1q), Ethernet çerçevelerine 4 byte\'lık bir VLAN etiketi (VLAN Tag) ekleyerek trunk bağlantılar üzerinden birden çok VLAN\'ın taşınmasını sağlayan standarttır.',
    rfcOrStandard: 'IEEE 802.1Q'
  },

  // Module 4: Routing & Gateway
  {
    id: 'q10',
    moduleId: 'routing-gateway',
    difficulty: 'Başlangıç',
    category: 'Varsayılan Ağ Geçidi',
    question: '192.168.1.10 IP adresine sahip bir bilgisayar, 8.8.8.8 IP\'sine paket göndermek istediğinde neden Default Gateway\'e başvurur?',
    options: [
      '8.8.8.8 aynı yerel alt ağda yer almadığı için.',
      'DNS sunucusu kapalı olduğu için.',
      'Yerel switch arızalandığı için.',
      'Kendi IP adresi dinamik olarak değiştiği için.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Bilgisayar hedef IP ile kendi alt ağ maskesini kıyaslar (AND işlemi). Hedef yerel ağda (192.168.1.0/24) bulunmadığı için paketin yerel ağdan çıkıp harici ağlara gidebilmesi için Default Gateway\'e teslim edilmesi şarttır.',
    rfcOrStandard: 'RFC 1122 - Requirements for Internet Hosts'
  },
  {
    id: 'q11',
    moduleId: 'routing-gateway',
    difficulty: 'Orta',
    category: 'ARP Protokolü',
    question: 'Aynı yerel ağdaki bir cihazın IP adresi biliniyor ancak MAC adresi bilinmiyorsa, MAC adresini öğrenmek için hangi protokol kullanılır ve sorgu hangi adresleme ile gönderilir?',
    options: [
      'RARP protokolü, Unicast adresleme',
      'ARP protokolü, Broadcast (FF:FF:FF:FF:FF:FF) adresleme',
      'DHCP protokolü, Multicast adresleme',
      'DNS protokolü, Anycast adresleme'
    ],
    correctAnswerIndex: 1,
    explanation: 'ARP (Address Resolution Protocol), hedef IP\'nin MAC adresini bulmak için yerel ağa L2 Broadcast (hedef MAC: FF:FF:FF:FF:FF:FF) olarak "Bu IP kime ait?" sorusunu içeren bir ARP Request gönderir.',
    rfcOrStandard: 'RFC 826'
  },
  {
    id: 'q12',
    moduleId: 'routing-gateway',
    difficulty: 'İleri',
    category: 'Yönlendirme Tablosu',
    question: 'Bir yönlendirici (router) bir paketi iletirken tablosunda birden fazla eşleşen rota varsa seçimini hangi kurala göre yapar?',
    options: [
      'En Düşük Metrik Kuralı (Lowest Metric Only)',
      'En Uzun Önek Eşleşmesi (Longest Prefix Match / LPM)',
      'En İlk Eklenen Rota Kuralı (FIFO)',
      'Rastgele Seçim (ECMP)'
    ],
    correctAnswerIndex: 1,
    explanation: 'Yönlendiriciler her zaman "Longest Prefix Match" (LPM) kuralını uygular. Maskesi en uzun olan (yani hedefe en spesifik tanımlanmış olan) rota öncelikle tercih edilir.',
    rfcOrStandard: 'RFC 1812 - Requirements for IP Version 4 Routers'
  },

  // Module 5: App Protocols (DNS, DHCP)
  {
    id: 'q13',
    moduleId: 'app-protocols',
    difficulty: 'Başlangıç',
    category: 'DHCP Protokolü',
    question: 'DHCP sürecinin doğru sırası (DORA) aşağıdakilerden hangisidir?',
    options: [
      'Offer -> Discover -> Request -> Acknowledge',
      'Discover -> Offer -> Request -> Acknowledge',
      'Request -> Discover -> Offer -> Acknowledge',
      'Discover -> Request -> Offer -> Acknowledge'
    ],
    correctAnswerIndex: 1,
    explanation: 'DHCP 4 adımdan oluşur: 1. Discover (İstemci arar), 2. Offer (Sunucu IP teklif eder), 3. Request (İstemci teklifi kabul eder), 4. Acknowledge (Sunucu onaylar ve lease başlatır).',
    rfcOrStandard: 'RFC 2131 - Dynamic Host Configuration Protocol'
  },
  {
    id: 'q14',
    moduleId: 'app-protocols',
    difficulty: 'Orta',
    category: 'DNS Kayıtları',
    question: 'Bir alan adını (örn: blog.sirket.com) başka bir alan adına (örn: sirket.cdn-servisi.net) yönlendirmek için hangi DNS kayıt tipi kullanılır?',
    options: [
      'A Kaydı',
      'PTR Kaydı',
      'CNAME (Canonical Name) Kaydı',
      'MX (Mail Exchange) Kaydı'
    ],
    correctAnswerIndex: 2,
    explanation: 'CNAME kaydı bir alan adını başka bir alan adına (takma ad / alias) bağlar. A kaydı doğrudan IPv4 adresine, AAAA IPv6 adresine, MX ise e-posta sunucusuna işaret eder.',
    rfcOrStandard: 'RFC 1035 - Domain Names - Implementation and Specification'
  },

  // Module 6: Security & Firewall
  {
    id: 'q15',
    moduleId: 'security-firewall',
    difficulty: 'Orta',
    category: 'Firewall Türleri',
    question: 'Gelen bir paketi değerlendirirken o paketin daha önce kurulmuş geçerli bir TCP oturumunun parçası olup olmadığını kontrol eden güvenlik duvarı türü hangisidir?',
    options: [
      'Stateless Packet Filter (Durumsuz Filtre)',
      'Stateful Inspection (Durum Denetimli Güvenlik Duvarı)',
      'Hub Repeater',
      'Proxy olmaksızın sadece L1 filtreleyici'
    ],
    correctAnswerIndex: 1,
    explanation: 'Stateful (Durum Denetimli) firewall, ağ bağlantılarının durumunu (Connection State: NEW, ESTABLISHED, RELATED) takip eden bir durum tablosu tutar. Böylece içeriden açılan web isteklerinin dönüş paketleri otomatik olarak güvenli kabul edilir.',
    rfcOrStandard: 'RFC 2979'
  },
  {
    id: 'q16',
    moduleId: 'security-firewall',
    difficulty: 'İleri',
    category: 'iptables',
    question: 'Linux iptables aracında yerel makinenin kendisinde çalışan bir servise (örneğin port 22 SSH) dışarıdan gelen bağlantıları filtrelemek için hangi zincir (chain) kullanılır?',
    options: [
      'OUTPUT',
      'FORWARD',
      'INPUT',
      'PREROUTING'
    ],
    correctAnswerIndex: 2,
    explanation: 'INPUT zinciri yerel sistemin kendisini hedef alan (yerel soketlere teslim edilecek) gelen paketleri filtrelemek için kullanılır. FORWARD ise makineden transit geçen paketler içindir.',
    rfcOrStandard: 'Netfilter & Linux iptables Documentation'
  }
];
