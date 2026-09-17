import { NetworkModule } from '../models/network.types';

export const NETWORK_MODULES: NetworkModule[] = [
  {
    id: 'osi-tcpip',
    title: 'OSI ve TCP/IP Modelleri',
    badge: 'Katman 1 - 7',
    icon: 'layers',
    shortDesc: 'Ağ iletişiminin temel omurgası, 7 katmanlı OSI modeli ve 4 katmanlı TCP/IP mimarisi.',
    color: 'emerald',
    objectives: [
      'OSI ve TCP/IP modellerinin katmanlarını ve sorumluluklarını kavramak',
      'PDU (Protokol Veri Birimi) kavramı ve enkapsülasyon sürecini anlamak',
      'TCP 3 Yollu El Sıkışma (3-Way Handshake) ve UDP arasındaki farkları analiz etmek'
    ],
    keyConcepts: [
      {
        term: 'Enkapsülasyon (Encapsulation)',
        description: 'Verinin üst katmanlardan alt katmanlara indikçe her katmanın kendi başlığını (header) eklemesi sürecidir.',
        example: 'Data -> TCP Başlığı (Segment) -> IP Başlığı (Paket) -> Ethernet Başlığı (Frame) -> Bit akışı'
      },
      {
        term: 'TCP 3-Way Handshake',
        description: 'Güvenilir bağlantı kurmak için istemci ve sunucu arasında gerçekleşen 3 adımlı bayrak takası.',
        example: '1. SYN (seq=x) -> 2. SYN-ACK (seq=y, ack=x+1) -> 3. ACK (ack=y+1)'
      },
      {
        term: 'TCP vs UDP',
        description: 'TCP bağlantı yönelimli, sıralı ve hata kontrolü sağlar (Web, Mail). UDP ise bağlantısız, başlık yükü az ve gecikmeye duyarlıdır (DNS, Canlı Yayın, Oyunlar).',
        example: 'TCP Header: 20-60 byte, UDP Header: sabit 8 byte'
      }
    ],
    theorySections: [
      {
        title: '1. OSI Modeli 7 Katmanı ve PDU Eşleşmeleri',
        content: 'Uluslararası Standartlar Teşkilatı (ISO) tarafından ağ mimarilerini standartlaştırmak için geliştirilmiştir.',
        bulletPoints: [
          'Katman 7 - Uygulama (Application): HTTP, DNS, SSH, FTP, SMTP (PDU: Data)',
          'Katman 6 - Sunum (Presentation): Veri formatlama, şifreleme (TLS/SSL), sıkıştırma (PDU: Data)',
          'Katman 5 - Oturum (Session): Oturum başlatma, sürdürme, sonlandırma (PDU: Data)',
          'Katman 4 - Taşıma (Transport): Uçtan uca iletişim, port numaraları, TCP/UDP (PDU: Segment)',
          'Katman 3 - Ağ (Network): Mantıksal adresleme (IP), yönlendirme (Router), ICMP, ARP (PDU: Paket)',
          'Katman 2 - Veri Bağı (Data Link): Fiziksel adresleme (MAC), Switch, Çerçeveleme (PDU: Frame)',
          'Katman 1 - Fiziksel (Physical): Kablolar (Bakır, Fiber), Sinyaller, Hub, Bitler (PDU: Bits)'
        ]
      },
      {
        title: '2. TCP/IP Modeli vs OSI Eşleşmesi',
        content: 'Gerçek dünyada internetin üzerinde çalıştığı pratik 4 katmanlı mimaridir: Uygulama (OSI 5,6,7), Taşıma (OSI 4), İnternet (OSI 3) ve Ağ Arayüzü / Network Access (OSI 1,2).',
        bulletPoints: [
          'Uygulama Katmanı: Kullanıcı programlarının doğrudan konuştuğu katman (Port 80/443 HTTP/S, Port 53 DNS).',
          'Taşıma Katmanı: Port tabanlı çoklama (multiplexing). Kaynak ve Hedef portları belirler.',
          'İnternet Katmanı: IP paketlerinin internet üzerindeki yönlendirilmesi (IPv4, IPv6, ICMP).',
          'Ağ Arayüzü: Yerel ağ kartları (NIC), MAC adresleri ve fiziksel aktarım.'
        ]
      }
    ]
  },
  {
    id: 'ip-subnetting',
    title: 'IP Adresleme ve Subnetting (CIDR)',
    badge: 'IPv4 & Alt Ağlar',
    icon: 'pin',
    shortDesc: 'IPv4 sınıfları, RFC 1918 özel IP blokları, CIDR notasyonu ve alt ağ hesaplama teknikleri.',
    color: 'sky',
    objectives: [
      'IPv4 adres yapısını ve ikilik (binary) mantığını kavramak',
      'RFC 1918 Özel (Private) IP aralıklarını ve kullanım amaçlarını öğrenmek',
      'Alt ağ maskesi (Subnet Mask) ve CIDR yardımıyla Network ID, Broadcast ve Host aralıklarını hesaplamak'
    ],
    keyConcepts: [
      {
        term: 'CIDR Notasyonu (/X)',
        description: 'Alt ağ maskesindeki 1 olan bit sayısını ifade eder. Örneğin /24, ilk 24 bitin ağa, kalan 8 bitin hostlara ayrıldığını gösterir.',
        example: '/24 = 255.255.255.0 (256 - 2 = 254 kullanılabilir host)'
      },
      {
        term: 'RFC 1918 Özel IP Blokları',
        description: 'İnternet üzerinde doğrudan yönlendirilmeyen, yerel ağlarda ücretsiz kullanılabilen adres bloklarıdır.',
        example: 'A Sınıfı: 10.0.0.0/8 | B Sınıfı: 172.16.0.0/12 | C Sınıfı: 192.168.0.0/16'
      },
      {
        term: 'Network ve Broadcast Adresleri',
        description: 'Bir alt ağdaki tüm host bitleri 0 ise Network ID (ağ adresi), tüm host bitleri 1 ise Broadcast adresidir. Bu iki adres cihazlara atanamaz.',
        example: '192.168.1.0/24 ağında Network ID: 192.168.1.0, Broadcast: 192.168.1.255'
      }
    ],
    theorySections: [
      {
        title: '1. İkilik Sistem ve Alt Ağ Mantığı',
        content: 'Her IPv4 adresi 32 bit uzunluğundadır ve 4 oktetten (her biri 8 bit) oluşur. Noktalarla ayrılmış desimal gösterim kullanılır.',
        bulletPoints: [
          '8 bit ikilik değerleri: 128, 64, 32, 16, 8, 4, 2, 1',
          '/25 maskesi: 255.255.255.128 -> Her alt ağda 128 adres (126 kullanılabilir host)',
          '/26 maskesi: 255.255.255.192 -> Her alt ağda 64 adres (62 kullanılabilir host)',
          '/27 maskesi: 255.255.255.224 -> Her alt ağda 32 adres (30 kullanılabilir host)',
          '/28 maskesi: 255.255.255.240 -> Her alt ağda 16 adres (14 kullanılabilir host)',
          '/30 maskesi: 255.255.255.252 -> Point-to-point router linkleri için (2 kullanılabilir host)'
        ]
      },
      {
        title: '2. Subnetting Altın Kuralı',
        content: 'Kullanılabilir Host Sayısı Formülü: 2^(32 - CIDR) - 2. Örneğin /29 için: 32 - 29 = 3 bit host. 2^3 = 8 adres. 8 - 2 = 6 host.',
        bulletPoints: [
          'Adım 1: CIDR değerinden host bit sayısını (h = 32 - n) bulun.',
          'Adım 2: Blok boyutunu hesaplayın (2^h).',
          'Adım 3: Alt ağ başlangıçlarını blok boyutunun katları olarak listeleyin.',
          'Adım 4: Network adresi ilk adres, Broadcast adresi bir sonraki alt ağın 1 eksiğidir.'
        ]
      }
    ]
  },
  {
    id: 'switching-vlan',
    title: 'Anahtarlama (Switching) ve VLAN',
    badge: 'Layer 2 Mimarisi',
    icon: 'hub',
    shortDesc: 'MAC adres tablosu (CAM), çarpışma/yayın etki alanları ve IEEE 802.1Q VLAN izolasyonu.',
    color: 'indigo',
    objectives: [
      'Switchlerin CAM (MAC adres tablosu) öğrenme ve iletme mantığını anlamak',
      'Collision Domain (Çarpışma Alanı) ve Broadcast Domain (Yayın Alanı) farkını kavramak',
      'VLAN (Sanal Yerel Ağ), Access ve Trunk port yapılandırmasını uygulamak'
    ],
    keyConcepts: [
      {
        term: 'CAM / MAC Adres Tablosu',
        description: 'Switch gelen çerçevenin kaynak MAC adresine bakarak port eşleştirmesini kaydeder. Hedef MAC tabloda yoksa o port hariç tüm portlara "Flooding" yapar.',
        example: 'MAC: a4:83:e7:... -> Port Gi0/1 (VLAN 10)'
      },
      {
        term: 'Access vs Trunk Port',
        description: 'Access port tek bir VLAN taşır ve son kullanıcı cihazlarına bağlanır. Trunk port ise 802.1Q etiketi ekleyerek birden fazla VLAN trafiğini switchler arası taşır.',
        example: 'Switch -> PC: Access (Untagged) | Switch -> Switch: Trunk (802.1Q Tagged)'
      },
      {
        term: 'Inter-VLAN Routing (Router-on-a-Stick)',
        description: 'Farklı VLAN\'lar varsayılan olarak birbiriyle konuşamaz. Birbirleriyle haberleşmeleri için Layer 3 bir yönlendiriciye (Router veya L3 Switch) ihtiyaç duyarlar.',
        example: 'Router sub-interface: int g0/0.10 (encapsulation dot1Q 10)'
      }
    ],
    theorySections: [
      {
        title: '1. Hub ve Switch Karşılaştırması',
        content: 'Eski nesil Hub\'lar fiziksel katmanda çalışır ve gelen sinyali körü körüne herkese iletir. Switchler ise veri bağı katmanında (L2) MAC tablosu tutarak hedefe iletir.',
        bulletPoints: [
          'Hub: Tek bir büyük Collision Domain (Çarpışma Alanı) oluşturur. Bant genişliği paylaşılır.',
          'Switch: Her portu bağımsız bir Collision Domain\'dir. Ancak varsayılan olarak tüm portlar tek bir Broadcast Domain içindedir.',
          'VLAN: Bir switch üzerindeki Broadcast Domain\'leri mantıksal parçalara ayırarak güvenlik ve performans sağlar.'
        ]
      }
    ]
  },
  {
    id: 'routing-gateway',
    title: 'Yönlendirme (Routing) ve Ağ Geçidi',
    badge: 'Layer 3 Mimarisi',
    icon: 'alt_route',
    shortDesc: 'Default Gateway, ARP protokolü, statik yönlendirme ve dinamik yönlendirme ilkeleri.',
    color: 'amber',
    objectives: [
      'Varsayılan Ağ Geçidinin (Default Gateway) neden vazgeçilmez olduğunu öğrenmek',
      'ARP (Address Resolution Protocol) önbelleği ve çalışma mekanizmasını kavramak',
      'Routing Tablosu okuma ve En Uzun Önek Eşleşmesi (Longest Prefix Match) kuralını uygulamak'
    ],
    keyConcepts: [
      {
        term: 'Default Gateway (Ağ Geçidi)',
        description: 'Bir cihaz kendi yerel alt ağında bulunmayan bir IP\'ye paket göndermek istediğinde, paketi yerel yönlendiricinin IP\'sine yönlendirir.',
        example: 'Hedef 8.8.8.8 yerel ağda değil -> Paket 192.168.1.1 Default Gateway\'e teslim edilir.'
      },
      {
        term: 'ARP (Address Resolution Protocol)',
        description: 'Bilinen bir IP adresinin yerel ağdaki donanımsal MAC adresini öğrenmek için kullanılan L2/L3 köprü protokolüdür.',
        example: 'ARP Request: "192.168.1.1 kimde? (Broadcast ff:ff:ff:ff:ff:ff)" -> ARP Reply: "Bende, MAC: 00:11:22:.."'
      },
      {
        term: 'Longest Prefix Match (LPM)',
        description: 'Yönlendirici routing tablosunda hedefe uygun birden fazla rota bulursa, alt ağ maskesi en spesifik (en uzun önek) olanı seçer.',
        example: '10.1.1.5 hedefi için 10.1.1.0/24 rotası, 10.0.0.0/8 veya 0.0.0.0/0 (Default Route) rotasına göre önceliklidir.'
      }
    ],
    theorySections: [
      {
        title: '1. Bir Paketin Yolculuğu (Paket Gönderim Algoritması)',
        content: 'Bilgisayar hedefe ping atarken şu mantıksal adımları takip eder:',
        bulletPoints: [
          'Adım 1: Kendi IP\'si ve maskesi ile hedef IP\'yi AND işlemine tabi tutar: Hedef aynı ağda mı?',
          'Adım 2: Eğer aynı ağdaysa, ARP tablosunda hedef IP\'nin MAC adresini arar. Yoksa ARP Request yollar.',
          'Adım 3: Eğer hedef farklı bir ağdaysa, paketin L3 hedefi değişmez ancak L2 çerçevesi Default Gateway\'in MAC adresine adreslenir!',
          'Adım 4: Default Gateway paketi alır, L2 başlığını söker, routing tablosuna göre bir sonraki sekmeye (next-hop) iletir.'
        ]
      }
    ]
  },
  {
    id: 'app-protocols',
    title: 'Ağ Servisleri: DNS, DHCP ve HTTP',
    badge: 'Layer 7 Protokolleri',
    icon: 'dns',
    shortDesc: 'İnternetin işleyişini sağlayan temel servisler: Alan adı çözümleme, dinamik IP dağıtımı ve web trafiği.',
    color: 'teal',
    objectives: [
      'DNS hiyerarşisi, kayıt tipleri (A, CNAME, MX) ve çözümleme adımlarını öğrenmek',
      'DHCP DORA (Discover, Offer, Request, Ack) sürecini adım adım kavramak',
      'HTTP durum kodları, başlıkları ve TLS/SSL güvenliğini anlamak'
    ],
    keyConcepts: [
      {
        term: 'DHCP DORA Süreci',
        description: 'Bir istemcinin ağa bağlandığında IP, maske, gateway ve DNS bilgilerini otomatik alma protokolüdür.',
        example: '1. Discover (Broadcast) -> 2. Offer (Unicast/Broadcast) -> 3. Request (Broadcast) -> 4. Acknowledge (ACK)'
      },
      {
        term: 'DNS Çözümleme (Resolution)',
        description: 'İnsan tarafından okunabilir alan adlarını (örn: google.com) IP adreslerine çeviren dağıtık sistemdir. UDP port 53 kullanır.',
        example: 'İstemci -> Local DNS Cache -> Recursive Resolver -> Root Server (.) -> TLD (.com) -> Yetkili Sunucu (Authoritative)'
      },
      {
        term: 'DNS Kayıt Tipleri',
        description: 'A: IPv4 adresi, AAAA: IPv6 adresi, CNAME: Takma isim/Alias, MX: E-posta sunucusu, TXT: Doğrulama metni/SPF.',
        example: 'app.example.com -> CNAME -> cloud.hosting.com'
      }
    ],
    theorySections: [
      {
        title: '1. DHCP Neden 4 Aşamalıdır?',
        content: 'Ağda birden fazla DHCP sunucusu olabilir. İstemci Offer aşamasında gelen tekliflerden birini seçer ve Request aşamasında broadcast yaparak seçtiği sunucuyu diğerlerine bildirir. Diğer sunucular rezerve ettikleri IP\'leri geri havuza alır.',
        bulletPoints: [
          'Discover: "Ağda DHCP sunucu var mı? Bana IP lazım!" (Hedef: 255.255.255.255, Port: 67)',
          'Offer: "Elimde 192.168.1.105 IP\'si var, ister misin?"',
          'Request: "192.168.1.105 teklifini kabul ediyorum, bana rezerve et!"',
          'ACK: "Onaylandı, IP senindir. Kira süresi: 24 saat."'
        ]
      }
    ]
  },
  {
    id: 'security-firewall',
    title: 'Ağ Güvenliği, NAT ve Güvenlik Duvarı',
    badge: 'Güvenlik & Savunma',
    icon: 'security',
    shortDesc: 'Stateless/Stateful Firewall mantığı, iptables kuralları, Port Adres Çevirisi (PAT/NAT) ve saldırı türleri.',
    color: 'rose',
    objectives: [
      'Stateless ve Stateful paket filtreleme arasındaki farkları analiz etmek',
      'NAT (Network Address Translation) ve PAT (Port Address Translation) çalışma mekanizmasını öğrenmek',
      'Linux iptables zincirlerini (INPUT, FORWARD, OUTPUT) ve kural yazımını uygulamak'
    ],
    keyConcepts: [
      {
        term: 'NAT / PAT (Port Address Translation)',
        description: 'Yerel ağdaki yüzlerce cihazın tek bir genel (Public) IP üzerinden internete çıkmasını sağlayan port eşleme tablosudur.',
        example: '192.168.1.50:48201 -> NAT Router -> 203.0.113.1:52110 -> Web Server'
      },
      {
        term: 'Stateful Firewall (Durum Denetimli)',
        description: 'Paketleri tek tek değil, TCP/UDP bağlantı oturumunun durumuna göre (NEW, ESTABLISHED, RELATED) değerlendirir. İçeriden başlatılan isteklerin dönüşüne otomatik izin verir.',
        example: 'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT'
      },
      {
        term: 'Yaygın Port Numaraları',
        description: 'SSH: 22, DNS: 53, HTTP: 80, HTTPS: 443, MySQL: 3306, RDP: 3389, NTP: 123.',
        example: 'Well-Known Ports (0-1023), Registered Ports (1024-49151), Dynamic/Private Ports (49152-65535)'
      }
    ],
    theorySections: [
      {
        title: '1. Güvenlik Duvarı Zincirleri (Chains)',
        content: 'Linux çekirdeğindeki Netfilter mimarisi paketleri hedefine göre ayrıştırır:',
        bulletPoints: [
          'INPUT Zinciri: Doğrudan sunucunun kendisine gelen paketler (örn: sunucuya gelen SSH bağlantısı).',
          'OUTPUT Zinciri: Sunucunun kendisi tarafından üretilip dışarı gönderilen paketler.',
          'FORWARD Zinciri: Sunucunun üzerinden transit geçen paketler (Router/Firewall olarak çalıştığında kullanılır).'
        ]
      }
    ]
  }
];
