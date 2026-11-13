import { writeFileSync } from "fs";
import { join } from "path";

const PUBLIC_DIR = "E:\\PROJELER\\ghm-dis-klinigi\\public";

// Bölüm başlığından URL parçası üretir (scripts/clean_urls.py ile aynı kurallar)
function slugify(title: string): string {
  const tr: Record<string, string> = { "ç": "c", "ğ": "g", "ı": "i", "İ": "i", "ö": "o", "ş": "s", "ü": "u", "Ç": "c", "Ğ": "g", "Ö": "o", "Ş": "s", "Ü": "u", "â": "a", "î": "i", "û": "u", "Â": "a", "Î": "i", "Û": "u" };
  return title
    .replace(/&amp;/g, "&")
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[’'`]/g, "")
    .replace(/&/g, " ve ")
    .replace(/[çğıİöşüÇĞÖŞÜâîûÂÎÛ]/g, (c) => tr[c] || c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface SubBranch {
  // NOT: bölüm adresleri /<sayfa>/<slug> biçimindedir (slug = başlıktan üretilir, bkz. slugify)
  id: string; // e.g. "bolum-1"
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  steps: string[];
  features: string[];
  facts: Record<string, string>;
  image: string;
}

interface TreatmentCategory {
  slug: string;
  pageTitle: string;
  metaDesc: string;
  badge: string;
  heroTitle: string;
  heroDesc: string;
  subBranches: SubBranch[];
}

const CATEGORIES: TreatmentCategory[] = [
  {
    slug: "genel-dis-tedavileri",
    pageTitle: "Genel Diş Tedavileri | Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir",
    metaDesc: "Kırşehir genel diş tedavileri: Diş muayenesi, estetik kompozit dolgu, kanal tedavisi, diş çekimi, 20'lik diş ve kırık diş tedavisi. Dt. Gözde Hilal Morkoyunlu.",
    badge: "Kırşehir Genel Diş Hekimliği",
    heroTitle: "Genel Diş Tedavileri",
    heroDesc: "Sağlıklı ve ışıltılı bir gülüşün temeli, düzenli kontroller ve zamanında yapılan koruyucu müdahalelerdir. Kliniğimizde ileri teknolojiyle ağrısız ve kalıcı çözümler sunuyoruz.",
    subBranches: [
      {
        id: "bolum-1",
        badge: "01 / Teşhis & Muayene",
        title: "Genel Diş Muayenesi ve Dijital Teşhis",
        subtitle: "Detaylı Ağız İçi Teşhis ve Dijital Panoramik Görüntüleme",
        description: "Ağız ve diş sağlığının korunmasında ilk adım, düzenli ve kapsamlı bir hekim muayenesidir. Kliniğimizde yüksek çözünürlüklü dijital panoramik röntgen teknolojisi ve ağız içi kameralar ile henüz gözle fark edilmeyen gizli çürükler, kemik seviyeleri ve diş eti problemleri erken aşamada tespit edilir. Erken teşhis, büyük diş kayıplarını ve maliyetli operasyonları önlemenin en güvenli yoludur.",
        steps: [
          "Dijital Panoramik ve Periapikal Radyografi Taraması",
          "Ağız İçi Kamera ile Dişlerin ve Diş Etlerinin Detaylı İncelemesi",
          "Kişiye Özel Tedavi Haritasının ve Öncelik Sırasının Çıkarılması",
          "Hastaya Görsel Eşliğinde Şeffaf Bilgilendirme ve Planlama"
        ],
        features: ["Dijital Panoramik Röntgen", "Gizli Çürük Erken Teşhisi", "Ağız İçi Kamera Analizi", "Kişiselleştirilmiş Tedavi Planı"],
        facts: { "Seans Süresi": "20 - 30 Dakika", "Anestezi": "Gerektirmez", "Periyot": "6 Ayda Bir", "Konfor": "Tamamen Ağrısız" },
        image: "/images/tedaviler/genel-dis.jpg"
      },
      {
        id: "bolum-2",
        badge: "02 / Restoratif Tedavi",
        title: "Diş Dolgusu (Estetik Kompozit Restorasyon)",
        subtitle: "Doğal Diş Dokusunu Birebir Taklit Eden Nanokompozit Dolgular",
        description: "Çürük, aşınma veya travma nedeniyle madde kaybına uğramış dişlerin hem estetik hem de çiğneme fonksiyonunu geri kazandıran modern dolgu uygulamalarıdır. Kliniğimizde A sınıfı nano-hibrit kompozit materyaller kullanılarak dişinizin kendi rengi, şeffaflığı ve anatomik olukları birebir taklit edilir. Eski gri amalgam dolguların aksine estetik ve biyouyumludur.",
        steps: [
          "Çürük Dokunun Mikron Hassasiyetinde Temizlenmesi",
          "Biyouyumlu Adeziv Ajanlarla Diş Yüzeyinin Hazırlanması",
          "Katmanlı Nanokompozit Yerleştirme ve Işıkla Polimerizasyon",
          "Anatomik Çiğneme Formunun İşlenmesi ve Elmas Pasta ile Parlatma"
        ],
        features: ["Doğal Diş Rengiyle Birebir Uyum", "Yüksek Çiğneme Mukavemeti", "Cıva ve Metal İçermez", "Tek Seansta Tamamlanır"],
        facts: { "Seans Süresi": "30 - 45 Dakika", "Anestezi": "Lokal (Ağrısız)", "Dayanıklılık": "Uzun Yıllar", "Konfor": "Maksimum" },
        image: "/images/klinik/klinik-oda-2.jpg"
      },
      {
        id: "bolum-3",
        badge: "03 / Endodonti",
        title: "Kanal Tedavisi (Endodonti)",
        subtitle: "Doğal Dişi Çekilmekten Kurtaran Modern Kök Kanal Terapisi",
        description: "İlerlemiş çürüklerin veya şiddetli travmaların dişin canlı sinir dokusu olan pulpaya ulaşması şiddetli zonklayıcı ağrılara sebep olur. Kanal tedavisinde, enfekte olmuş pulpa dokusu özel döner alet sistemleri ve apeks bulucu cihazlarla mikrometrik hassasiyetle temizlenir, antibakteriyel solüsyonlarla yıkanır ve biyouyumlu dolgu maddeleriyle üç boyutlu olarak kapatılır. Dişinizi çekilmekten kurtararak ağızda tutmanın en etkili yoludur.",
        steps: [
          "Etkili Lokal Anestezi ile Bölgenin Tamamen Ağrısızlaştırılması",
          "Dijital Apeks Bulucu Eşliğinde Kök Boyunun Belirlenmesi",
          "Döner Alet Sistemleriyle Kök Kanallarının Genişletilip Temizlenmesi",
          "Biyouyumlu Güta-Perka Materyali ile Sızdırmaz Üç Boyutlu Dolum"
        ],
        features: ["Doğal Kendi Dişinizin Korunması", "Döner Sistem Dijital Endodonti", "Apeks Bulucu Hassasiyeti", "Ağrısız ve Konforlu Seanslar"],
        facts: { "Seans": "1 - 2 Seans (45 dk)", "Anestezi": "Etkili Lokal Anestezi", "Başarı Oranı": "%95 Üzeri", "Sonuç": "Kalıcı Diş Kurtarma" },
        image: "/images/galeri/waiting-lounge.jpg"
      },
      {
        id: "bolum-4",
        badge: "04 / Cerrahi",
        title: "Diş Çekimi",
        subtitle: "Doku Dostu, Nazik ve Travmasız Diş Çekim İşlemleri",
        description: "Modern diş hekimliğinde temel amaç daima dişi kurtarmaktır; ancak kurtarılması tıbben mümkün olmayan aşırı harabiyete uğramış veya kök kırığı bulunan dişlerin çevre dokulara ve komşu dişlere zarar vermemesi için güvenle çekilmesi gerekir. Kliniğimizde uygulanan atraumatik çekim tekniği sayesinde çene kemiği korunur, bu sayede gelecekte yapılacak implant tedavisi için zemin hazır tutulur.",
        steps: [
          "Dijital Röntgen ile Kök Açılarının ve Kemik Desteğinin İncelenmesi",
          "Bölgesel Lokal Anestezi ile Sıfır Ağrı Sağlanması",
          "Kemik Dokusunu Koruyan Özel Aletlerle Hassas Çekim",
          "Steril Tampon ve Hızlı Doku İyileşmesi İçin Bakım Talimatları"
        ],
        features: ["Travmasız Kemik Koruma Protokolü", "Sıfır Ağrı Garantili Anestezi", "Hızlı Doku İyileşmesi", "İmplant Öncesi Hazırlık"],
        facts: { "Seans Süresi": "15 - 30 Dakika", "Anestezi": "Lokal Anestezi", "İyileşme": "3 - 5 Gün", "Konfor": "Yüksek" },
        image: "/images/klinik/klinik-oda-4.jpg"
      },
      {
        id: "bolum-5",
        badge: "05 / Çene Cerrahisi",
        title: "Gömülü Diş Çekimi",
        subtitle: "Çene Kemiği İçinde Kalan Dişlerin Cerrahi Olarak Alınması",
        description: "Çene kemiğinde yeterli yer bulunmaması, genetik yatkınlık veya anormal sürme açısı nedeniyle diş eti veya kemik altında sıkışıp kalan dişlerdir. Gömülü dişler zamanla komşu dişlerin köklerini eritebilir, kist oluşturabilir veya şiddetli çene ağrılarına yol açabilir. Çene cerrahisi tecrübemiz ve minimal invaziv cerrahi yaklaşımımızla gömülü dişler konforla ve güvenle çıkarılır.",
        steps: [
          "3 Boyutlu Kemik ve Çene Siniri Analizi",
          "Ağrısız Cerrahi İçin Derin Lokal Anestezi",
          "Minimal İnvaziv Kesi ile Dişe Ulaşılması ve Bölümlenerek Alınması",
          "Doku Dostu Estetik Dikiş ile Hızlı Kapanma"
        ],
        features: ["Sinir Dokularına Saygılı Cerrahi", "Şişlik ve Ödem Önleyici Protokol", "Minimal İnvaziv Yaklaşım", "Kapsamlı Operasyon Sonrası Takip"],
        facts: { "Seans Süresi": "30 - 50 Dakika", "Anestezi": "Güçlü Lokal Anestezi", "Dikiş Alımı": "7 Gün Sonra", "İyileşme": "Hızlı ve Güvenli" },
        image: "/images/klinik/klinik-oda-5.jpg"
      },
      {
        id: "bolum-6",
        badge: "06 / 20'lik Diş",
        title: "20'lik Diş Çekimi (Üçüncü Azı Dişleri)",
        subtitle: "Ağrı, Şişlik ve Çapraşıklık Yapan 20 Yaş Dişlerinin Konforlu Çekimi",
        description: "Genellikle 17-25 yaş aralığında sürmeye çalışan yirmi yaş dişleri, modern çene yapısında yeterli yer bulamadığı için yarı gömülü kalarak diş eti iltihabına (perikoronit), apseye veya ön dişleri sıkıştırarak çarpıklığa sebep olur. Dt. Gözde Hilal Morkoyunlu Kliniği'nde panoramik röntgen analiziyle 20'lik dişin kök anatomisi incelenir ve hızlı, acısız bir operasyonla problem kökten çözülür.",
        steps: [
          "Panoramik Radyografi ile Kök ve Sinir Kanalı İlişkisinin Tespiti",
          "Tam Uyuşma Sağlayan Konforlu Lokal Anestezi",
          "Travmasız Cerrahi Teknikle Dişin Çıkarılması",
          "Soğuk Uygulama ve Ağrı Kesici Protokolü ile Rahat İyileşme"
        ],
        features: ["Çene Kapanışının Korunması", "Diş Çarpışıklıklarının Önlenmesi", "Enfeksiyon ve Perikoronit Tedavisi", "Konforlu İyileşme Dönemi"],
        facts: { "Seans Süresi": "20 - 40 Dakika", "Anestezi": "Lokal Anestezi", "Etki": "Ağrıdan Anında Kurtulma", "Takip": "Düzenli Kontrol" },
        image: "/images/galeri/clinic-unit.jpg"
      },
      {
        id: "bolum-7",
        badge: "07 / Acil & Travma",
        title: "Diş Kırığı Tedavisi",
        subtitle: "Travma ve Darbelere Bağlı Kırıklarda Acil Estetik Restorasyon",
        description: "Sert gıdaların ısırılması, spor kazaları veya düşmeler sonucu meydana gelen diş kırıkları hem acil estetik kaygı hem de açıkta kalan sinirler nedeniyle şiddetli sızlama yaratır. Kliniğimizde kırığın derinliğine göre bonding kompozit restorasyon, yaprak porselen veya kuron kaplama yöntemleriyle dişiniz orijinal formuna kavuşturulur.",
        steps: [
          "Acil Radyolojik İnceleme ve Sinir Canlılık (Vitalite) Testi",
          "Kırık Kenarların Hassas Düzeltilmesi ve İzolasyonu",
          "Biyouyumlu Nanokompozit veya Porselen ile Restorasyon",
          "Kapanış Dengesi Kontrolü ve Yüksek Parlaklıkta Polisaj"
        ],
        features: ["Acil Estetik Müdahale", "Kendi Doğal Dişinizin Kurtarılması", "Görünmeyen Kırık Çizgisi Restorasyonu", "Uzun Ömürlü Çiğneme Direnci"],
        facts: { "Seans Süresi": "30 - 60 Dakika", "Müdahale": "Aynı Gün Acil Çözüm", "Estetik": "Doğal Görünüm", "Konfor": "Ağrısız Uygulama" },
        image: "/images/klinik/klinik-oda-7.jpg"
      }
    ]
  },
  {
    slug: "ortodontik-tedaviler",
    pageTitle: "Ortodontik Tedaviler & Şeffaf Plak | Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir",
    metaDesc: "Kırşehir ortodonti kliniği: Diş teli, Invisalign şeffaf plak tedavisi, şeffaf porselen braketler. Dt. Gözde Hilal Morkoyunlu ile düzgün diş dizilimi.",
    badge: "Kırşehir Ortodonti & Telsiz Tedavi",
    heroTitle: "Ortodontik Tedaviler",
    heroDesc: "Çapraşık dişler, aralıklar ve çene kapanış bozuklukları artık kader değil. Şeffaf plaklar ve estetik braket sistemleri ile hayalinizdeki düzgün diş dizilimine konforla kavuşun.",
    subBranches: [
      {
        id: "bolum-1",
        badge: "01 / Geleneksel Ortodonti",
        title: "Diş Teli Tedavisi (Braket Sistemleri)",
        subtitle: "Güvenilir, Kanıtlanmış ve Kusursuz Diş Dizilimi",
        description: "Dişlerdeki ileri seviye çapraşıklıkların, rotasyonların ve çene kapanış bozukluklarının ideal anatomik konumuna getirilmesinde altın standart yöntemdir. Modern minyatür metal veya kendinden kapaklı (düşük sürtünmeli) braketler sayesinde dişler planlanan hızda, dokulara zarar vermeden hareket ettirilir.",
        steps: [
          "Sefalometrik ve Panoramik Röntgen Analizi ile Ayrıntılı Planlama",
          "Braketlerin Diş Yüzeylerine Hassas Ajanlarla Yapıştırılması",
          "Hafızalı Ark Tellerinin Takılması ve Aylık Rutin Kontroller",
          "Tedavi Bitiminde Pekiştirme (Retainer) Teli ile Sonucun Sabitlenmesi"
        ],
        features: ["Her Derecedeki Çapraşıklıkta Kesin Çözüm", "Yüz Profilini ve Gülüşü Geliştirir", "Düzgün Çiğneme ve Çene Fonksiyonu", "Uzun Vadeli Kalıcı Başarı"],
        facts: { "Tedavi Süresi": "12 - 24 Ay", "Kontrol": "4 - 6 Haftada Bir", "Yaş Grubu": "Çocuk & Yetişkin", "Anestezi": "Gerektirmez" },
        image: "/images/tedaviler/invisalign.jpg"
      },
      {
        id: "bolum-2",
        badge: "02 / Telsiz Ortodonti",
        title: "Invisalign (Şeffaf Plak Tedavisi)",
        subtitle: "Telsiz, Görünmez ve Tamamen Dijital Ortodonti Deneyimi",
        description: "Sosyal ve profesyonel hayatınızdan ödün vermeden dişlerinizi düzeltmek istiyorsanız Invisalign şeffaf plaklar tam size göredir. Ağız içi 3D tarayıcı ile alınan dijital ölçüler sonrasında tedavinizin tüm aşamaları bilgisayarda simüle edilir; dişlerinizin hafta hafta nasıl düzeleceğini ve bitiş gülüşünüzü ilk günden izleyebilirsiniz.",
        steps: [
          "3D Dijital Tarama ve Bilgisayar Destekli Tedavi Simülasyonu",
          "Kişiye Özel Seri Şeffaf Plakların (Aligner) Hazırlanması",
          "Plakların 7-10 Günde Bir Sıradaki Plakla Değiştirilmesi",
          "Günde 20-22 Saat Kullanım ile Hızlı ve Estetik Sonuç"
        ],
        features: ["Dışarıdan Neredeyse Hiç Görünmez", "Yemek Yerken Çıkarılabilir Özgürlük", "Yumuşak Dokuya Asla Batmaz", "Dijital Tedavi Simülasyonu"],
        facts: { "Plak Değişimi": "7 - 10 Günde Bir", "Kullanım": "Günde 20-22 Saat", "Görünürlük": "%100 Şeffaf", "Konfor": "Maksimum" },
        image: "/images/tedaviler/treatment-invisalign.jpg"
      },
      {
        id: "bolum-3",
        badge: "03 / Estetik Braket",
        title: "Şeffaf Braketli Tedavi (Porselen / Safir Braket)",
        subtitle: "Estetik Görünüm Sunan Kristal ve Porselen Braketler",
        description: "Geleneksel metal tellerin görünümünü tercih etmeyen ancak tel tedavisinin gücünden faydalanmak isteyen hastalar için mükemmel bir alternatiftir. Doğal diş rengini yansıtan porselen veya tamamen cam şeffaflığında safir braketler kullanılır. Leke tutmaz ve dışarıdan bakıldığında fark edilmesi çok güçtür.",
        steps: [
          "Estetik Braket Seçimi ve Diş Yüzeyine Konumlandırılması",
          "Beyaz / Şeffaf Kaplamalı Ark Tellerinin Takılması",
          "Aylık Nazik Kuvvet Ayarlamaları ile Aşamalı İlerleme",
          "Tedavi Tamamlandığında Diş Minesine Zarar Vermeden Söküm"
        ],
        features: ["Doğal Diş Rengiyle Kamufle Olur", "Leke Tutmayan Safir/Porselen Yapı", "Metal Braket Kadar Güçlü Mekanik", "Yetişkin Ortodontisinde Popüler"],
        facts: { "Tedavi Süresi": "12 - 18 Ay", "Görünüm": "Zarif ve Estetik", "Materyal": "Porselen / Safir", "Konfor": "Pürüzsüz Kenarlar" },
        image: "/images/clinic-interior.jpg"
      }
    ]
  },
  {
    slug: "implant-tedavisi",
    pageTitle: "İmplant Tedavisi & All-on-4 | Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir",
    metaDesc: "Kırşehir diş implantı tedavisi: Tek diş implant, çoklu diş implantı, All-on-4/6 sabit diş, kemik greftleme ve sinüs lifting. Dt. Gözde Hilal Morkoyunlu.",
    badge: "Kırşehir İleri Cerrahi & İmplantoloji",
    heroTitle: "İmplant Tedavisi",
    heroDesc: "Kaybedilen dişlerin yerine konmasında en doğal, en estetik ve en sağlam yöntem diş implantlarıdır. Kliniğimizde dünya standartlarında sertifikalı implant sistemleri ve 3D rehberli cerrahi uygulanmaktadır.",
    subBranches: [
      {
        id: "bolum-1",
        badge: "01 / Tek Diş Eksikliği",
        title: "Tek Diş İmplant Tedavisi",
        subtitle: "Komşu Sağlıklı Dişlere Dokunmadan Tek Diş Eksikliğinin Giderilmesi",
        description: "Tek bir diş eksikliğinde geleneksel köprü yönteminde yanlardaki iki sağlam diş kesilip küçültülürdü. İmplant tedavisinde ise çene kemiğine yerleştirilen biyouyumlu titanyum yapay kök sayesinde hiçbir komşu dişe dokunulmaz. Kendi doğal dişiniz gibi hisseder, çiğner ve gülersiniz.",
        steps: [
          "3D Çene Tomografisi ile Kemik Kalitesi ve Genişliği Ölçümü",
          "Lokal Anestezi ile 10-15 Dakikada İmplantın Yerleştirilmesi",
          "Kemik ile Titanyumun Biyolojik Kaynaması (2-3 Ay)",
          "Zirkonyum veya Porselen Kuronun İmplant Üzerine Takılması"
        ],
        features: ["Komşu Sağlam Dişler Kesilmez", "Çene Kemiği Erimesini Önler", "Doğal Diş Çiğneme Hissi ve Gücü", "Ömür Boyu Kullanım Potansiyeli"],
        facts: { "Operasyon": "15 - 20 Dakika", "Anestezi": "Lokal (Sıfır Ağrı)", "Kaynama": "2 - 3 Ay", "Kalıcılık": "Ömür Boyu" },
        image: "/images/tedaviler/implant.jpg"
      },
      {
        id: "bolum-2",
        badge: "02 / Bölgesel Dişsizlik",
        title: "Çoklu Diş İmplant Tedavisi",
        subtitle: "Birden Fazla Diş Kaybında Sabit ve Sağlam İmplant Destekli Köprüler",
        description: "Yan yana birkaç dişin kaybedildiği durumlarda her boşluğa ayrı implant yerleştirmek gerekmez. Stratejik olarak konumlandırılan 2 veya 3 adet implant üzerine hazırlanan monolitik zirkonyum köprüler ile tüm boşluk doldurulur. Çiğneme fonksiyonu eksiksiz geri kazanılır.",
        steps: [
          "Panoramik ve 3D Tomografik Tasarım",
          "Stratejik Noktalara İmplant Yerleşimi",
          "Geçici Protezle Konforlu Bekleme Süreci",
          "Sabit Zirkonyum/Porselen Köprü Montajı"
        ],
        features: ["Daha Az İmplantla Geniş Açıklık Tedavisi", "Yanak ve Dudak Çöküntülerini Giderir", "Yüksek Çiğneme Performansı", "Ekonomik ve Dayanıklı Çözüm"],
        facts: { "İmplant Sayısı": "2 - 4 Adet", "Seans Süresi": "40 - 60 Dakika", "Uyum": "Tam Sabit Konfor", "Malzeme": "A Sınıfı Titanyum" },
        image: "/images/tedaviler/treatment-implant.jpg"
      },
      {
        id: "bolum-3",
        badge: "03 / Tam Dişsizlik",
        title: "Full Ağız İmplant Tedavisi (All-on-4 / All-on-6)",
        subtitle: "Tam Dişsiz Çenelerde Aynı Gün Sabit Diş Konsepti",
        description: "Ağzında hiç dişi kalmayan veya kalan dişleri kurtarılamayacak durumda olan hastalar için devrim niteliğinde bir çözümdür. Çene kemiğine özel açılarla yerleştirilen 4 veya 6 adet implant üzerine sabit hibrit protez aynı gün veya kısa sürede vidalanır; hareketli damak protezlerinin vuruk ve düşme kabusuna son verilir.",
        steps: [
          "3D Cerrahi Rehber (Surgical Guide) ile Hassas Planlama",
          "Özel Açılı İmplantların Tek Seansta Yerleştirilmesi",
          "Aynı Gün Geçici Sabit Dişlerin Takılması",
          "Kemikleşme Sonrası Daimi Premium Zirkonyum Dişlerin Teslimi"
        ],
        features: ["Damak Protezlerinin Düşme Problemine Son", "Aynı Gün Sabit Geçici Diş Konforu", "Tat Alma Duyusunu Engellemez (Damaksız)", "Gençleştiren Yüz ve Gülüş Estetiği"],
        facts: { "Konsept": "All-on-4 / All-on-6", "Uygulama": "Tek Seansta Cerrahi", "Kullanım": "Sabit ve Çıkarılamaz", "Memnuniyet": "%99+" },
        image: "/images/klinik/klinik-oda-8.jpg"
      },
      {
        id: "bolum-4",
        badge: "04 / İleri Kemik Cerrahisi",
        title: "Box Teknik (Kemik Greftleme & Sinüs Lifting)",
        subtitle: "Yetersiz Kemik Hacminde İleri Kemik Oluşturma Cerrahisi",
        description: "Yıllar süren dişsizlik nedeniyle çene kemiği erimiş veya üst çenede sinüs boşlukları aşağı sarkmış hastalarda implant yapabilmek için kemik hacminin artırılması gerekir. Biyouyumlu kemik tozları (greft), membranlar ve sinüs lifting cerrahisi ile implant için sağlam bir kemik temeli oluşturulur.",
        steps: [
          "3 Boyutlu Kemik Yüksekliği ve Genişliği Ölçümü",
          "Sinüs Tabanı Yükseltme (Açık/Kapalı Sinüs Lift)",
          "Biyouyumlu Kemik Grefti ve Bariyer Membran Yerleşimi",
          "Kemikleşme Dönemi Sonrası Güvenli İmplant Uygulaması"
        ],
        features: ["İmplant Yapılamaz Denen Vakalara Çözüm", "Doku Dostu Biyolojik Greftler", "Ultrasonik Piezocerrahi Güvenliği", "Doğal Kemik Rejenerasyonu"],
        facts: { "Cerrahi": "İleri Periodontal Cerrahi", "Kemikleşme": "4 - 6 Ay", "Başarı": "Yüksek Stabilite", "Konfor": "Sedasyon / Lokal Anestezi" },
        image: "/images/galeri/sterilization.jpg"
      }
    ]
  },
  {
    slug: "cocuk-dis-hekimligi",
    pageTitle: "Çocuk Diş Hekimliği (Pedodonti) | Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir",
    metaDesc: "Kırşehir çocuk diş hekimi: Flor uygulaması, fissür örtücü diş aşısı, yer tutucu tedavisi. Korkusuz ve eğlenceli diş tedavisi. Dt. Gözde Hilal Morkoyunlu.",
    badge: "Kırşehir Pedodonti & Çocuk Kliniği",
    heroTitle: "Çocuk Diş Hekimliği",
    heroDesc: "Çocuklarımızın diş hekimi korkusu olmadan, şefkatli ve oyun dolu bir ortamda sağlıklı dişlerle büyümesini sağlıyoruz. Koruyucu uygulamalarla çürüksüz bir geleceğin kapılarını aralıyoruz.",
    subBranches: [
      {
        id: "bolum-1",
        badge: "01 / Koruyucu Vernik",
        title: "Fluorid Uygulaması",
        subtitle: "Diş Minesini Güçlendiren ve Asit Saldırılarına Karşı Koruyan Kalkan",
        description: "Çocukların yeni süren kalıcı ve süt dişlerinin minesini kuvvetlendiren profesyonel flor verniği uygulamasıdır. Diş yüzeyine fırça yardımıyla saniyeler içinde sürülen bu koruyucu tabaka, bakterilerin ürettiği asitlere karşı dişi zırh gibi korur ve başlangıç çürüklerini durdurur.",
        steps: [
          "Diş Yüzeylerinin Temizlenmesi ve Kurulanması",
          "Meyve Aromalı Flor Verniğinin Fırçayla Sürülmesi",
          "30 Dakika Yeme-İçme Kısıtlaması",
          "6 Aylık Periyotlarla Rutin Olarak Yenilenmesi"
        ],
        features: ["Tamamen Acısız ve İğnesiz İşlem", "Diş Çürüklerini %70'e Varan Oranda Engeller", "Meyve Aromalı Çocuk Dostu Formül", "Sadece 2-3 Dakikada Tamamlanır"],
        facts: { "Süre": "5 Dakika", "Ağrı": "Sıfır Ağrı", "Yaş": "3 Yaşından İtibaren", "Sıklık": "Yılda 2 Kez" },
        image: "/images/tedaviler/pedodonti.jpg"
      },
      {
        id: "bolum-2",
        badge: "02 / Diş Aşısı",
        title: "Fissür Örtücü (Fissure Sealant)",
        subtitle: "Azı Dişlerinin Çiğneme Yüzeylerindeki Derin Olukların Kapatılması",
        description: "Çocuklarda çürüklerin %80'i çiğneme dişlerindeki dar ve derin anatomik girintilerde başlar. Fissür örtücü, bu derin olukları akışkan koruyucu bir kompozit katmanla pürüzsüzleştirerek yemek artıklarının ve bakterilerin tutunmasını önler. 'Diş aşısı' olarak da bilinir.",
        steps: [
          "Diş Oluklarının Detaylı Temizliği",
          "Diş Yüzeyinin Hazırlanması (Delme / Aşındırma Yapılmaz)",
          "Fissür Örtücü Sıvının Uygulanması",
          "Mavi Işık ile 20 Saniyede Sertleştirilmesi"
        ],
        features: ["Diş Minesine Asla Zarar Vermez", "Ağrısız, İğnesiz ve Delmesiz İşlem", "Ömür Boyu Çürük Riski Azaltımı", "Çocuklar İçin Eğlenceli ve Hızlı"],
        facts: { "Diş Başına Süre": "3 - 5 Dakika", "Anestezi": "Gerektirmez", "Kalıcılık": "Yıllarca Korur", "Hedef": "6 ve 12 Yaş Azı Dişleri" },
        image: "/images/tedaviler/treatment-pedodonti.jpg"
      },
      {
        id: "bolum-3",
        badge: "03 / Ortodonti Koruyucu",
        title: "Yer Tutucu Tedavisi",
        subtitle: "Erken Süt Dişi Kayıplarında Çarpıklığı Önleyen Koruyucu Apereyler",
        description: "Süt dişleri sadece çiğnemeye yaramaz, alttan gelecek daimi dişler için rehberlik yapar. Çürük veya kaza nedeniyle erken kaybedilen süt dişinin boşluğu, komşu dişler tarafından kapatılmasın diye sabit veya hareketli yer tutucular uygulanır.",
        steps: [
          "Çekim Boşluğu ve Alttaki Dişin Radyolojik Takibi",
          "Ağız İçi Dijital/Hassas Ölçü Alımı",
          "Kişiye Özel Biyouyumlu Yer Tutucu Hazırlığı",
          "Uyumlandırma ve Alttaki Diş Sürene Dek Takip"
        ],
        features: ["Gelecekteki Ortodonti İhtiyacını Önler", "Alttan Gelen Dişin Rahatça Sürmesini Sağlar", "Çocuğun Çiğneme ve Konuşmasını Destekler", "Sabit veya Hareketli Seçenekler"],
        facts: { "Tür": "Sabit veya Hareketli", "Kontrol": "3 - 6 Ayda Bir", "Çıkarılma": "Kalıcı Diş Sürdüğünde", "Konfor": "Çocuk Çabuk Alışır" },
        image: "/images/klinik/cocuk-dis-hekimligi.jpg"
      }
    ]
  },
  {
    slug: "koruyucu-dis-tedavileri",
    pageTitle: "Koruyucu Diş Tedavileri & Bruksizm | Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir",
    metaDesc: "Kırşehir koruyucu diş tedavisi: Ağız kokusu tedavisi, hassas diş tedavisi, diş sıkma ve gıcırdatma (bruksizm), gece plağı. Dt. Gözde Hilal Morkoyunlu.",
    badge: "Önleyici ve Koruyucu Hekimlik",
    heroTitle: "Koruyucu Diş Tedavileri",
    heroDesc: "En iyi tedavi, hastalığın hiç başlamamasını sağlamaktır. Ağız kokusu, diş aşırı hassasiyeti ve gece diş sıkma problemlerine karşı modern medikal çözümler sunuyoruz.",
    subBranches: [
      {
        id: "bolum-1",
        badge: "01 / Halitozis",
        title: "Ağız Kokusu Tedavisi",
        subtitle: "Sosyal Yaşamı Etkileyen Nefes Kokusuna Bilimsel ve Kalıcı Çözüm",
        description: "Kronik ağız kokusunun %90'ı ağız içi kaynaklıdır; dil sırtındaki anaerobik bakteriler, derin diş eti cepleri veya sızıntılı eski dolgular sülfür gazları yayar. Kliniğimizde ağız kokusunun kaynağı tespit edilip kapsamlı medikal terapi uygulanarak ferah bir nefes sağlanır.",
        steps: [
          "Ağız İçi Bakteriyel ve Periodontal Teşhis",
          "Derin Detertraj ve Dil Hijyen Eğitimi",
          "Çürük ve Eski Sızıntılı Dolguların Yenilenmesi",
          "Medikal Ağız Gargarası ve Takip"
        ],
        features: ["Kalıcı ve Taze Bir Nefes", "Özgüveni Yeniden Kazandırır", "Kök Nedenin Tedavisi", "Sosyal Hayatta Tam Konfor"],
        facts: { "Seans": "1 - 2 Seans", "Teşhis": "Mikrobiyolojik Analiz", "Etki": "İlk Seanstan İtibaren", "Konfor": "Ağrısız Prosedür" },
        image: "/images/tedaviler/koruyucu.jpg"
      },
      {
        id: "bolum-2",
        badge: "02 / Dentin Hassasiyeti",
        title: "Hassas Diş Tedavisi",
        subtitle: "Sıcak, Soğuk ve Tatlı Tüketiminde Oluşan Sızılara Son",
        description: "Diş eti çekilmesi, yanlış fırçalama veya mine aşınması sonucunda dentin kanalcıkları açığa çıkar ve ani şiddetli sızılara sebep olur. Lazer desensitizasyonu ve mineral tıkayıcı biyoaktif ajanlarla kanallar kapatılarak hassasiyet kalıcı olarak sonlandırılır.",
        steps: [
          "Hassasiyet Odaklarının Tespiti",
          "Diş Yüzeylerinin Hassas Temizliği",
          "Lazer / Biyoaktif Ajan Uygulaması",
          "Remineralize Edici Koruyucu Kalkan"
        ],
        features: ["Dondurma ve Sıcak İçecekleri Rahatça Tüketme", "Dentin Tübüllerinin Kalıcı Mühürlenmesi", "Diş Minesinin Güçlendirilmesi", "Anında Rahatlama Etkisi"],
        facts: { "Seans": "20 Dakika", "Uygulama": "İğnesiz & Ağrısız", "Sonuç": "Hemen Hissedilen Rahatlama", "Kalıcılık": "Uzun Süreli" },
        image: "/images/tedaviler/treatment-koruyucu.jpg"
      },
      {
        id: "bolum-3",
        badge: "03 / Bruksizm & Gece Plağı",
        title: "Diş Sıkma ve Gıcırdatma Tedavisi",
        subtitle: "Çene Eklemi Ağrılarını, Baş Ağrısını ve Diş Kırıklarını Önleyen Terapi",
        description: "Günlük stres ve anatomik faktörler sebebiyle gece uykuda istemsiz diş sıkma; diş minelerinde aşınmaya, çene ekleminde klik seslerine ve sabah baş-boyun ağrılarına yol açar. Kişiye özel sert gece plakları ve masseter botoksu ile çene kasları rahatlatılır.",
        steps: [
          "Çene Eklemi (TME) ve Çiğneme Kaslarının Muayenesi",
          "3D Dijital Tarama ile Gece Plağı Tasarımı",
          "Gerekli Vakada Masseter Botoksu Enjeksiyonu",
          "Oklüzal Dengeleme ve Takip"
        ],
        features: ["Sabah Yorgunluğu ve Baş Ağrılarına Son", "Diş Kırılmalarını ve Aşınmasını Engeller", "Çene Eklemini Kireçlenmeden Korur", "Yüz Hatlarında İncelme (Masseter İnceltme)"],
        facts: { "Plağın Türü": "Kişiye Özel Termoplastik", "Botoks": "5 Dakikalık Uygulama", "Etki": "3-5 Günde Başlar", "Koruma": "Tam Eklem Koruması" },
        image: "/images/klinik/koruyucu-dis-tedavileri.jpg"
      }
    ]
  },
  {
    slug: "kozmetik-dis-hekimligi",
    pageTitle: "Kozmetik Diş Hekimliği & Gülüş Tasarımı | Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir",
    metaDesc: "Kırşehir estetik diş hekimliği: Diş beyazlatma, lamine yaprak porselen, zirkonyum kaplama, estetik dolgu, bonding uygulaması. Dt. Gözde Hilal Morkoyunlu.",
    badge: "Kırşehir Estetik Diş Kliniği",
    heroTitle: "Kozmetik Diş Hekimliği",
    heroDesc: "Gülüşünüz, ilk izleniminizin en güçlü parçasıdır. Zirkonyum, lamine yaprak porselen, lazer beyazlatma ve bonding ile hayalinizdeki Hollywood gülüşünü tasarlıyoruz.",
    subBranches: [
      {
        id: "bolum-1",
        badge: "01 / Beyazlatma",
        title: "Diş Beyazlatma (Bleaching)",
        subtitle: "Ofis Tipi Güvenli Lazer Aktivasyonlu Profesyonel Beyazlatma",
        description: "Çay, kahve, sigara ve yaşa bağlı olarak sararan diş minelerinin klinik ortamında 3-4 ton güvenle açılması işlemidir. Diş minesine hiçbir zarar vermeden sadece 45 dakikada göz alıcı ışıltılı bir beyazlık kazandırır.",
        steps: [
          "Diş Taşlarının Temizliği ve Diş Eti Bariyeri Koruma",
          "Medikal Beyazlatma Jelinin Uygulanması",
          "LED / Lazer Işık Aktivasyonu (3 x 15 dk)",
          "Hassasiyet Giderici Bakım"
        ],
        features: ["3 ila 8 Tona Kadar Etkili Beyazlama", "Mine Dokusuna Zarar Vermez", "Sadece 45 Dakikada Sonuç", "Kalıcı ve Homojen Parlaklık"],
        facts: { "Süre": "45 - 60 Dakika", "Etki": "Anında Görülür", "Kalıcılık": "1 - 2 Yıl", "Ağrı": "Ağrısız & Güvenli" },
        image: "/images/tedaviler/kozmetik.jpg"
      },
      {
        id: "bolum-2",
        badge: "02 / Yaprak Porselen",
        title: "Lamina Diş Kaplama (Laminate Veneer)",
        subtitle: "Dişe Minimum Müdahale ile Kusursuz ve Doğal Hollywood Gülüşü",
        description: "Dişlerin sadece ön yüzeyinden tırnak kalınlığında (0.3 - 0.5 mm) mikro aşındırma yapılarak yapıştırılan yüksek teknolojili porselen yapraklardır. Renk değiştirmez, leke tutmaz ve ışık geçirgenliği mükemmeldir.",
        steps: [
          "Dijital Gülüş Tasarımı & Mock-Up Ön İzleme",
          "Minimalist Mikro Hazırlık & 3D Tarama",
          "Laboratuvarda Robotik CAD/CAM Üretim",
          "Özel Rezin Siman ile Güçlü Bağlanma"
        ],
        features: ["Doğal Diş Dokusu Maksimum Korunur", "Kahve, Çay ve Sigaradan Asla Sararmaz", "Mükemmel Işık Geçirgenliği ve Doğallık", "Gülüş Çizgisini Kusursuzlaştırır"],
        facts: { "Kalınlık": "0.3 - 0.7 mm", "Seans Sayısı": "2 - 3 Seans", "Ömür": "15 - 20 Yıl+", "Görünüm": "Kusursuz Estetik" },
        image: "/images/tedaviler/treatment-kozmetik.jpg"
      },
      {
        id: "bolum-3",
        badge: "03 / Zirkonyum",
        title: "Zirkonyum Kaplama",
        subtitle: "Metal Desteksiz, Üstün Biyouyumlu ve Dayanıklı Estetik Restorasyon",
        description: "Geleneksel metal destekli porselenlerin yerine kullanılan zirkonyum dioksit altyapı, hem arka dişlerin çiğneme kuvvetine dayanır hem de ön dişlerde doğal diş minesi gibi ışığı geçirir. Diş etinde gri leke yapmaz ve alerji riski yoktur.",
        steps: [
          "Dişlerin Estetik Ölçülerde Şekillendirilmesi",
          "3D İntraoral Dijital Tarama",
          "Bilgisayar Destekli CAD/CAM Frezeleme",
          "Renk & Parlaklık Provası ve Simantasyon"
        ],
        features: ["Diş Etinde Kararma ve Alerji Yapmaz", "Metal Altyapı İçermez", "Çiğneme Kuvvetlerine Üstün Direnç", "Sıcak-Soğuk İletkenliği Çok Düşüktür"],
        facts: { "Materyal": "Saf Zirkonya", "Seans": "3 - 5 Gün (2-3 Seans)", "Uyum": "%100 Doku Dostu", "Dayanıklılık": "Maksimum" },
        image: "/images/klinik/kozmetik-dis-hekimligi.webp"
      },
      {
        id: "bolum-4",
        badge: "04 / Cam Seramik",
        title: "Porselen Kaplama (E-Max / Empress)",
        subtitle: "Cam Seramik Teknolojisi ile Maksimum Saydamlık ve Canlılık",
        description: "Lityum disilikat cam seramikten üretilen E-Max kaplamalar, ışık geçirgenliği bakımından doğal diş minesine en yakın malzemedir. Özellikle ön grup dişlerin estetik restorasyonlarında tek tek kuron olarak rakipsiz sonuçlar verir.",
        steps: [
          "Dijital Renk ve Işık İletim Analizi",
          "Hassas Diş Preparasyonu",
          "E-Max Cam Seramik Bloktan Frezeleme",
          "Fırınlama, Glaze ve Adeziv Yapıştırma"
        ],
        features: ["Işık Geçirgenliğinde Zirve Noktası", "Doğal Dişten Asla Ayırt Edilemez", "Diş Etiyle %100 Biyolojik Uyum", "Ön Diş Estetiğinde Altın Standart"],
        facts: { "Materyal": "Lityum Disilikat Seramik", "Işık İletimi": "%100 Doğal", "Seans": "2 - 3 Seans", "Estetik": "A++ Sınıfı" },
        image: "/images/galeri/smile-transformation.jpg"
      },
      {
        id: "bolum-5",
        badge: "05 / Estetik Restorasyon",
        title: "Estetik Diş Dolgusu",
        subtitle: "Ön ve Arka Dişlerde Doğal Katmanlama Tekniği ile Görünmez Dolgular",
        description: "Eski gri amalgam dolguların yerine geçen, dişin dentin ve mine tabakalarının renk tonlarını ayrı ayrı taklit eden nanohibrit estetik dolgulardır. Dolgunun nerede başlayıp dişin nerede bittiği mikroskop altında dahi ayırt edilemez.",
        steps: [
          "Eski Dolgunun ve Çürüğün Uzaklaştırılması",
          "Tabakalı (Layering) Kompozit Tekniği",
          "Anatomik Diş Tüberküllerinin İşlenmesi",
          "Elmas Pasta ile Ayna Parlaklığı Polisajı"
        ],
        features: ["Diş Rengine Birebir Uyum", "Aşınmaya Karşı Güçlendirilmiş Yapı", "Amalgam Dolgu Değişimi", "Görünmez Kenar Geçişleri"],
        facts: { "Seans": "Tek Seans (30-45 dk)", "Kullanım": "Hemen Yemek Yenilebilir", "Anestezi": "Ağrısız Lokal", "Estetik": "Doğal Doku" },
        image: "/images/clinic-interior.jpg"
      },
      {
        id: "bolum-6",
        badge: "06 / Kompozit Lamine",
        title: "Bonding Uygulaması",
        subtitle: "Dişleri Kesmeden, Tek Seansta Diastema Kapatma ve Şekillendirme",
        description: "Dişlerin arasındaki boşlukların (diastema) kapatılması, kırık uçların düzeltilmesi veya hafif çapraşıklıkların kamufle edilmesi amacıyla diş dokusuna hiç dokunmadan kompozit materyalin dişe yapıştırılması işlemidir.",
        steps: [
          "Diş Yüzeyinin Kimyasal Pürüzlendirilmesi (Diş Aşındırılmaz)",
          "Adeziv Ajan Uygulaması",
          "Kompozitin Sanatsal Olarak Şekillendirilmesi",
          "Polisaj ve Cila"
        ],
        features: ["Diş Kesimi veya Küçültme Yapılmaz", "Tek Seansta (1 Saatte) Biter", "Ekonomik ve Hızlı Gülüş Estetiği", "Geri Dönüşümlü Bir İşlemdir"],
        facts: { "Süre": "Tek Seans (45 - 60 dk)", "Aşındırma": "Yok / Minimal", "Anestezi": "Genelde Gerekmez", "Sonuç": "Anında Yeni Gülüş" },
        image: "/images/klinik/klinik-oda-2.jpg"
      }
    ]
  },
  {
    slug: "eksik-dis-tedavileri",
    pageTitle: "Eksik Diş Tedavileri & Köprü Protez | Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir",
    metaDesc: "Kırşehir eksik diş tedavisi: İmplant tedavisi, zirkonyum köprü porselen, full ağız diş protezleri. Dt. Gözde Hilal Morkoyunlu Diş Kliniği.",
    badge: "Kırşehir Protetik Diş Tedavisi",
    heroTitle: "Eksik Diş Tedavileri",
    heroDesc: "Eksik dişler sadece estetik kayıp değil, çiğneme zorluğu, sindirim problemleri ve çene eklemi rahatsızlıklarına neden olur. Sabit ve hareketli protezlerle eksiksiz bir ağız yapısı sağlıyoruz.",
    subBranches: [
      {
        id: "bolum-1",
        badge: "01 / İmplant",
        title: "İmplant Tedavisi",
        subtitle: "Boşluğu Dolduran En Sağlam ve Doğal Diş Kökü Alternatifi",
        description: "Çene kemiğine yerleştirilen titanyum yapay kökler sayesinde eksik olan diş boşluğu, komşu dişlere hiçbir müdahale yapılmadan bağımsız bir diş olarak tamamlanır. Çiğneme kuvvetini doğrudan kemiğe ileterek kemik erimesini engeller.",
        steps: [
          "Kemik Hacminin 3D Ölçümü",
          "Ağrısız İmplant Cerrahisi",
          "Kemik Bütünleşmesi (Osseointegrasyon)",
          "Sabit Porselen / Zirkonyum Diş Teslimi"
        ],
        features: ["Komşu Dişlere Kesim Yapılmaz", "Çene Kemiği Erimesini Durdurur", "Doğal Çiğneme Konforu", "Ömür Boyu Kalıcılık"],
        facts: { "Uygulama": "15 - 20 Dakika", "Anestezi": "Lokal (Sıfır Ağrı)", "Kaynama": "8 - 12 Hafta", "Başarı": "%98.5" },
        image: "/images/tedaviler/eksik-dis.jpg"
      },
      {
        id: "bolum-2",
        badge: "02 / Köprü",
        title: "Köprü Porselen",
        subtitle: "Komşu Dişlerden Güç Alan Sabit ve Estetik Restorasyonlar",
        description: "İmplant cerrahisine kemik durumu elvermeyen veya cerrahi istemeyen hastalar için eksik diş boşluğunun iki yanındaki dişlerin kaplanarak aradaki boşluğun porselen gövde ile doldurulması işlemidir.",
        steps: [
          "Dayanak Dişlerin Hassas Şekillendirilmesi",
          "Dijital Ağız İçi Tarama",
          "Zirkonyum Altyapılı Köprünün Üretimi",
          "Estetik Prova ve Daimi Yapıştırma"
        ],
        features: ["Cerrahi Operasyon Gerektirmez", "Birkaç Günde Hızlı Çözüm", "Sağlam Çiğneme Kapasitesi", "Doğal Görünümlü Zirkonyum Gövde"],
        facts: { "Süre": "3 - 5 Gün", "Seans": "2 - 3 Seans", "Kullanım": "Sabit (Çıkarılamaz)", "Dayanıklılık": "10 - 15 Yıl+" },
        image: "/images/tedaviler/treatment-eksik-dis.jpg"
      },
      {
        id: "bolum-3",
        badge: "03 / Komple Rehabilitasyon",
        title: "Full Ağız Diş Tedavisi (Kombine Protezler)",
        subtitle: "Çoklu ve Tam Dişsizlik Vakalarında Kapsamlı Ağız Rehabilitasyonu",
        description: "Ağızdaki dişlerin büyük bölümünün veya tamamının kaybedildiği durumlarda sabit hibrit köprüler, hassas tutuculu çıtçıtlı protezler veya modern damak protezleri ile tüm ağız fonksiyonu baştan aşağı yenilenir.",
        steps: [
          "Çene İlişkileri ve Dikey Boyut Analizi",
          "İmplant veya Diş Destekli Altyapı Planı",
          "Fonetik ve Estetik Gülüş Provaları",
          "Tam Konforlu Protezin Teslimi"
        ],
        features: ["Yüz Çöküntülerini ve Kırışıklıkları Giderir", "Kusursuz Konuşma ve Çiğneme", "Kişiye Özel Doğal Diş Dizilimi", "Düşmeyen ve Oynamayan Sağlam Tutuculuk"],
        facts: { "Tedavi": "Kişiye Özel Komple Çözüm", "Seçenekler": "Sabit / Hassas Tutuculu", "Estetik": "Gençleştirici Etki", "Konfor": "Yüksek" },
        image: "/images/klinik/eksik-dis-tedavileri.jpg"
      }
    ]
  },
  {
    slug: "dis-eti-periodontal-hastaliklar-ve-tedavileri",
    pageTitle: "Diş Eti Hastalıkları ve Tedavileri (Periodontoloji) | Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir",
    metaDesc: "Kırşehir diş eti tedavisi (periodontoloji): Küretaj, flap cerrahisi, gingivitis diş eti iltihabı ve diş taşı temizliği. Dt. Gözde Hilal Morkoyunlu.",
    badge: "Kırşehir Periodontoloji Uzmanlığı",
    heroTitle: "Diş Eti Hastalıkları ve Tedavileri",
    heroDesc: "Sağlıklı dişler ancak sağlıklı diş etleri üzerinde yaşayabilir. Diş eti kanaması, çekilme ve iltihaplanmalara karşı en güncel tedavi protokollerini uyguluyoruz.",
    subBranches: [
      {
        id: "bolum-1",
        badge: "01 / Periodontal Bakım",
        title: "Diş Eti Tedavisi (Periodontal Terapi)",
        subtitle: "Diş Kaybına Neden Olan Diş Eti Hastalıklarının Önlenmesi ve İyileştirilmesi",
        description: "Periodontal hastalıklar, dişleri çevreleyen kemik ve diş eti dokularını tahrip eden sinsi enfeksiyonlardır. Tedavi edilmediğinde tamamen çürüksüz sağlam dişlerin bile sallanarak düşmesine yol açar. Kliniğimizde diş eti sağlığı bilimsel yöntemlerle korunur.",
        steps: [
          "Cep Derinliklerinin (Periodontal Sondalama) Ölçümü",
          "Ultrasonik Detertraj ve Subgingival Bakım",
          "İlaçlı Cep İrrigasyonu",
          "3-6 Aylık Periyodik İdame Tedavisi"
        ],
        features: ["Diş Kayıplarını Engeller", "Kanamayı ve Kötü Kokuyu Durdurur", "Pembe ve Sıkı Sağlıklı Diş Etleri", "Kemik Erimesinin İlerlemesini Durdurur"],
        facts: { "Seans": "1 - 3 Seans", "Ağrı": "Ağrısız Prosedür", "Sonuç": "Kanamanın Tamamen Durması", "Kontrol": "Düzenli Takip" },
        image: "/images/tedaviler/dis-eti.jpg"
      },
      {
        id: "bolum-2",
        badge: "02 / Küretaj",
        title: "Küretaj Tedavisi (Derin Diş Eti Temizliği)",
        subtitle: "Kök Yüzeylerindeki Taşların ve İltihaplı Doku Artıklarının Kazınması",
        description: "Standart diş taşı temizliğinin yetersiz kaldığı, iltihabın diş eti çizgisinin altına (periodontal ceplere) indiği durumlarda Gracey küretleri ile kök yüzeyi düzleştirilir ve enfekte dokular temizlenir.",
        steps: [
          "Bölgesel Lokal Anestezi ile Konfor Sağlama",
          "Derin Ceplerdeki Subgingival Diş Taşlarının Temizliği",
          "Kök Yüzeyi Düzleştirme (Root Planing)",
          "Diş Etinin Kök Yüzeyine Yeniden Yapışması"
        ],
        features: ["Derinleşen Diş Eti Ceplerini Daraltır", "Sallanmaya Başlayan Dişleri Sabitler", "Lokal Anestezi ile Sıfır Ağrı", "Cerrahi Olmayan Güçlü Müdahale"],
        facts: { "Seans": "Yarım Çene Başına 30 dk", "Anestezi": "Lokal Anestezi", "İyileşme": "1 Hafta İçinde", "Konfor": "Yüksek" },
        image: "/images/tedaviler/treatment-dis-eti.jpg"
      },
      {
        id: "bolum-3",
        badge: "03 / Periodontal Cerrahi",
        title: "Flap Tedavisi",
        subtitle: "İleri Derecede Kemik Erimesi Olan Bölgelerde Cerrahi Açma ve Kemik Greftleme",
        description: "İleri periodontitis vakalarında diş eti cerrahi olarak açılarak kök yüzeyleri ve kemik cepleri doğrudan gözle görülür şekilde temizlenir. Kaybolan kemik dokusunu geri kazanmak için kemik grefti (tozu) ve membran yerleştirilir.",
        steps: [
          "Minimal Cerrahi İnsizyon ile Diş Etinin Kaldırılması",
          "Kemik Ceplerinin Derinlemesine Arındırılması",
          "Kemik Tozu ve PRF/Membran Uygulaması",
          "Mikrocerrahi Dikişlerle Kapatma"
        ],
        features: ["Dişi Çekilmekten Kurtaran Son Cerrahi Savunma", "Erimeye Uğramış Kemiği Yeniden Yapılandırır", "Derin Bakteriyel Odakları Yok Eder", "Uzun Vadeli Diş Tutunması"],
        facts: { "Operasyon": "45 - 60 Dakika", "Dikiş Alımı": "7 - 10 Gün", "Anestezi": "Lokal Anestezi", "Başarı": "Yüksek Doku Kazanımı" },
        image: "/images/klinik/dis-eti-tedavileri.jpg"
      },
      {
        id: "bolum-4",
        badge: "04 / Gingivitis",
        title: "Diş Eti İltihabı (Gingivitis Tedavisi)",
        subtitle: "Fırçalarken Kanayan, Şişen ve Kızaran Diş Etlerinin Tedavisi",
        description: "Gingivitis, diş eti hastalığının en erken ve tamamen geri döndürülebilir evresidir. Diş yüzeyindeki bakteri plağının diş etini tahriş etmesiyle oluşur. Erken dönemde yapılan profesyonel temizlik ile dokular eski pembe sağlığına kavuşur.",
        steps: [
          "Plak ve Tartar Birikiminin Teşhisi",
          "Ağrısız Detertraj ve Polisaj",
          "Doğru Diş Fırçalama ve Arayüz Temizliği Eğitimi",
          "2 Haftalık Kontrol"
        ],
        features: ["Erken Evrede %100 İyileşme Garantisi", "Diş Eti Kanamasına Kesin Son", "Ağız Kokusu ve Şişliklerin Giderilmesi", "İlerideki Cerrahi İhtiyaçları Önler"],
        facts: { "Seans": "Tek Seans (30 dk)", "İyileşme": "5 - 7 Gün", "Anestezi": "Gerektirmez", "Konfor": "Maksimum" },
        image: "/images/galeri/waiting-lounge.jpg"
      },
      {
        id: "bolum-5",
        badge: "05 / Detertraj",
        title: "Diş Taşı Temizliği (Detertraj & Polisaj)",
        subtitle: "Ultrasonik Cihazlarla Plak, Tartar ve Çay/Kahve Lekelerinin Arındırılması",
        description: "Tükürükteki mineraller ve gıda artıkları zamanla sertleşerek diş taşına dönüşür. Fırçalama ile temizlenemeyen bu taşlar kliniğimizde ultrasonik piezo uçlar ve özel Air-Flow cihazları ile diş minesine zarar verilmeden uzaklaştırılır.",
        steps: [
          "Ultrasonik Titreşimlerle Tartarların Ayrıştırılması",
          "Arayüzlerin İpek Diş İpiyle Temizliği",
          "Air-Flow Basınçlı Toz ile Çay/Sigara Lekelerinin Silinmesi",
          "Floridli Pasta ile Polisaj (Cilalama)"
        ],
        features: ["Diş Minesini Çizmez veya Aşındırmaz", "Çay, Kahve, Sigara Lekelerine Anında Veda", "Daha Beyaz ve Pürüzsüz Dişler", "6 Ayda Bir Rutin Sağlık Kalkanı"],
        facts: { "Süre": "25 - 35 Dakika", "Periyot": "6 Ayda Bir", "Leke Çıkarma": "%100 Etkili", "Ağrı": "Hassas Uçlarla Ağrısız" },
        image: "/images/galeri/clinic-unit.jpg"
      }
    ]
  },
  {
    slug: "ozel-dis-tedavileri",
    pageTitle: "Özel Diş Tedavileri & Dijital Diş Hekimliği | Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir",
    metaDesc: "Kırşehir dijital diş hekimliği: 3D gülüş tasarımı ve SMART protokolü ile güvenli amalgam dolgu sökümü. Dt. Gözde Hilal Morkoyunlu.",
    badge: "Kırşehir İleri Teknoloji Diş Hekimliği",
    heroTitle: "Özel Diş Tedavileri",
    heroDesc: "Dijital teknoloji, 3D tarayıcılar ve yüksek güvenlikli SMART protokolü ile amalgam dolgu sökümü gibi kliniğimize özgü ileri diş hekimliği uygulamaları.",
    subBranches: [
      {
        id: "bolum-1",
        badge: "01 / Dijital Diş Hekimliği",
        title: "Dijital Diş Hekimliği ve Gülüş Tasarımı",
        subtitle: "3D Ağız İçi Tarama, Dijital Mock-Up ve Kişiye Özel Bilgisayar Destekli Tasarım",
        description: "Bulantı refleksi yaratan geleneksel hamur ölçülere son! İntraoral 3D dijital tarayıcılar ile saniyeler içinde ağız yapınız mikron hassasiyetinde bilgisayara aktarılır. Yüz oranlarınız, dudak çizginiz ve ten renginizle uyumlu dijital gülüş tasarımı oluşturulur.",
        steps: [
          "HD Yüz Fotoğrafçılığı ve 3D Ağız İçi Dijital Tarama",
          "Bilgisayar Destekli Gülüş Estetiği Simülasyonu",
          "Mock-Up ile Tedaviye Başlamadan Ağızda Birebir Ön İzleme",
          "CAD/CAM Teknolojisi ile Kusursuz Üretim"
        ],
        features: ["Geleneksel Ölçü Hamurları ve Bulantı Yok", "Tedavi Sonucunu Baştan Görme İmkanı", "Mikron Düzeyinde Kusursuz Uyum", "Hızlı ve Sıfır Hata Payı"],
        facts: { "Tarama": "2 - 3 Dakika", "Simülasyon": "Aynı Gün Dijital Görsel", "Teknoloji": "3D CAD/CAM", "Konfor": "%100 Konforlu" },
        image: "/images/tedaviler/ozel-tedaviler.jpg"
      },
      {
        id: "bolum-2",
        badge: "02 / SMART Protokolü",
        title: "Amalgam Dolgu Çıkarma (Rubber Dam İzolasyonu)",
        subtitle: "Cıva İçeren Eski Gri Dolguların Uluslararası Güvenlik Protokolü ile Değişimi",
        description: "Eski tip siyah/gri amalgam dolguların içeriğinde yaklaşık %50 oranında cıva bulunur. Söküm esnasında cıva buharının ve partiküllerinin solunmasını veya yutulmasını önlemek için Rubber Dam (lastik örtü), özel yüksek vakumlu aspiratör ve koruyucu filtrelerle SMART protokolü uygulanır.",
        steps: [
          "Rubber Dam (Lastik Örtü) ile Dişin Tamamen İzolasyonu",
          "Cıva Buharı Filtreli Özel Cerrahi Aspiratör Kullanımı",
          "Dolgunun Parçalanmadan Blok Halinde Ayrılması",
          "Biyouyumlu Estetik Kompozit veya Porselen İnley ile Yenilenme"
        ],
        features: ["Uluslararası SMART Sertifikalı Güvenlik", "Vücuda Cıva Teması ve Solunumu Sıfıra İndirilir", "Rubber Dam ile %100 Koruyucu İzolasyon", "Doğal Diş Renginde Toksiksiz Restorasyon"],
        facts: { "Protokol": "SMART Cıva Güvenliği", "İzolasyon": "Rubber Dam Barajı", "Süre": "30 - 45 Dakika", "Yeni Dolgu": "Biyouyumlu Kompozit/Seramik" },
        image: "/images/tedaviler/treatment-ozel.jpg"
      }
    ]
  }
];

function generateTreatmentPageHtml(cat: TreatmentCategory): string {
  const pillsHtml = cat.subBranches
    .map(
      (b, idx) =>
        `<a class="pk-subnav-pill" href="#${b.id}"><span class="num">${idx + 1}</span> ${b.title.split("(")[0].trim()}</a>`
    )
    .join("\n\t\t\t");

  const cardsHtml = cat.subBranches
    .map((b, idx) => {
      const isAlt = idx % 2 === 1 ? " pk-treatment-card--alt" : "";
      const stepsHtml = b.steps
        .map(
          (step, sIdx) =>
            `<div class="pk-step-item"><strong>Adım ${sIdx + 1}:</strong> <span>${step}</span></div>`
        )
        .join("\n\t\t\t\t\t\t");

      const featuresHtml = b.features
        .map(
          (f) =>
            `<div class="pk-feature-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${f}</span></div>`
        )
        .join("\n\t\t\t\t\t\t");

      const factsHtml = Object.entries(b.facts)
        .map(
          ([k, v]) =>
            `<div class="pk-fact-item"><span class="pk-fact-label">${k}</span><span class="pk-fact-val">${v}</span></div>`
        )
        .join("\n\t\t\t\t\t\t");

      const waMsg = encodeURIComponent(
        `Merhaba, Dt. Gözde Hilal Morkoyunlu Kliniği web sitenizden ulaşıyorum. "${b.title}" tedavisi hakkında detaylı bilgi ve randevu almak istiyorum.`
      );

      return `
		<!-- Bölüm: ${b.title} -->
		<section class="pk-treatment-card${isAlt}" id="${b.id}" data-slug="${slugify(b.title)}">
			<div class="pk-card-header">
				<div class="pk-badge">${b.badge}</div>
				<span style="font-size:0.85rem; color:#94A3B8; font-weight:600;">Dt. Gözde Hilal Morkoyunlu Diş Kliniği · Kırşehir</span>
			</div>
			
			<h2 class="pk-treatment-title">${b.title}</h2>
			<p style="font-size:1.1rem; color:var(--pk-gold-hover, #A67C1E); font-weight:600; margin:8px 0 24px;">${b.subtitle}</p>

			<div class="pk-card-body">
				<div class="pk-card-text">
					<p>${b.description}</p>

					<h3 class="pk-card-subtitle">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
						Kliniğimizdeki Tedavi Aşamaları
					</h3>
					<div class="pk-step-list">
						${stepsHtml}
					</div>

					<h3 class="pk-card-subtitle">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
						Öne Çıkan Klinik Avantajlar
					</h3>
					<div class="pk-features-grid">
						${featuresHtml}
					</div>

					<div class="pk-action-btns">
						<a class="pk-btn-gold" href="/randevu" data-pk-randevu>
							<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
							Bu Tedavi İçin Randevu Al
						</a>
						<a class="pk-btn-whatsapp" href="https://wa.me/905402134040?text=${waMsg}" target="_blank" rel="noopener">
							<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.1z"/></svg>
							WhatsApp Bilgi Al
						</a>
						<a class="pk-btn-outline" href="tel:+903862134040">
							<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>
							0386 213 40 40
						</a>
					</div>
				</div>

				<div class="pk-card-media">
					<div class="pk-media-frame">
						<img src="${b.image}" alt="${b.title} - Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir" loading="lazy" decoding="async">
					</div>
					<div class="pk-quick-facts">
						<div class="pk-facts-title">
							<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
							Klinik Tedavi Özeti
						</div>
						<div class="pk-facts-grid">
							${factsHtml}
						</div>
					</div>
				</div>
			</div>
		</section>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="tr">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${cat.pageTitle}</title>
	<meta name="description" content="${cat.metaDesc}">
	<link rel="canonical" href="/${cat.slug}/">
	<link rel="icon" href="/images/logo.png" sizes="32x32">
	<link rel="icon" href="/images/logo.png" sizes="192x192">
	<link rel="apple-touch-icon" href="/images/logo.png">

	<link rel="stylesheet" id="hello-elementor-css" href="/css/theme/reset.css" media="all">
	<link rel="stylesheet" id="hello-elementor-theme-style-css" href="/css/theme/theme.css" media="all">
	<link rel="stylesheet" id="ghm-child-css" href="/css/theme/core-theme.css" media="all">
	<link rel="stylesheet" id="ghm-layout-css" href="/css/theme/layout.css?v=20261113-url" media="all">
	<link rel="stylesheet" id="ghm-pages-css" href="/css/theme/pages.css" media="all">
	<link rel="stylesheet" id="ghm-randevu-css" href="/css/theme/randevu-modal.css" media="all">
	<link rel="stylesheet" id="ghm-site-css" href="/css/theme/site.css" media="all">
	<link rel="stylesheet" id="ghm-mobile-css" href="/css/theme/mobile.css" media="all">
	<link rel="stylesheet" id="ghm-treatment-css" href="/css/theme/treatment-page.css" media="all">
	<link rel="stylesheet" id="elementor-gf-poppins-css" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap&subset=latin-ext" media="all">

	<script id="jquery-core-js" src="/js/theme/jquery.min.js"></script>
	<script id="jquery-migrate-js" src="/js/theme/jquery-migrate.min.js"></script>

	<style id="ghm-luxury-theme">
		.screen-reader-text, .skip-link {
			position: absolute !important;
			overflow: hidden !important;
			clip: rect(1px, 1px, 1px, 1px) !important;
			width: 1px !important;
			height: 1px !important;
		}
		:root {
			--pk-teal: #C59B27 !important;
			--pk-teal-2: #A67C1E !important;
			--e-global-color-accent: #C59B27 !important;
			--e-global-color-pkteal2: #A67C1E !important;
			--e-global-color-c1fe6f4: rgba(197, 155, 39, 0.3) !important;
		}
		.pkh-logo img {
			height: 54px !important;
			width: auto !important;
			object-fit: contain !important;
		}
		.pkl--light { display: none !important; }
		.pkl--dark { display: block !important; }
		.pk-b--primary, button.pk-b--primary, a.pk-b--primary, .pkh-cta, .pkr-send {
			background: #C59B27 !important;
			border-color: #C59B27 !important;
			color: #FFFFFF !important;
		}
		.pk-b--primary:hover, button.pk-b--primary:hover, a.pk-b--primary:hover, .pkh-cta:hover, .pkr-send:hover {
			background: #A67C1E !important;
			border-color: #A67C1E !important;
		}
		.pk-b--outline {
			border-color: #C59B27 !important;
			color: #C59B27 !important;
		}
		.pk-b--outline:hover {
			background: #C59B27 !important;
			color: #FFFFFF !important;
		}
		a {
			color: #C59B27;
			text-decoration: none;
			transition: color 0.2s ease;
		}
		a:hover, a:focus {
			color: #A67C1E;
		}
		.pkh-nav a, .pkh-menu a, .pkm-label, .pk-mega a {
			color: #373736 !important;
		}
		.pkh-nav a:hover, .pkh-menu a:hover, .pkm-label:hover, .pk-mega a:hover,
		.pkh-nav li.current-menu-item > a, .pkh-nav li.current-menu-ancestor > a {
			color: #C59B27 !important;
		}
	</style>
</head>
<body class="wp-singular page pk-no-band elementor-default">

<a class="skip-link screen-reader-text" role="link" tabindex="0" data-pk-skip>İçeriğe atla</a>

<header id="site-header" class="pkh" data-pkh>
	<div class="pkh-in">
		<a class="pkh-logo" href="/" aria-label="Dt. Gözde Hilal Morkoyunlu Diş Kliniği ana sayfa"><img class="pkl" src="/images/logo.png" alt="Dt. Gözde Hilal Morkoyunlu Diş Kliniği" style="height:54px; width:auto; max-width:240px; object-fit:contain;"></a>

		<nav class="pkh-nav" aria-label="Ana menü">
			<ul id="pkh-menu" class="pkh-menu">
				<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1687">
					<a role="button" tabindex="0" data-pk-sub aria-haspopup="true" aria-expanded="false"><span class="pkm-label">Dt. Gözde Hilal Morkoyunlu Diş Kliniği</span></a>
					<button type="button" class="pkm-toggle" aria-label="Dt. Gözde Hilal Morkoyunlu Diş Kliniği alt menüsü" aria-expanded="false"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
					<div class="pk-mega pk-mega--cards">
						<ul class="sub-menu">
							<li class="menu-item menu-item-type-post_type menu-item-object-page"><a href="/hakkimizda/"><span class="pkm-img"><img src="/images/galeri/waiting-lounge.jpg" alt="" loading="lazy" decoding="async"></span><span class="pkm-text"><span class="pkm-label">Hakkımızda</span></span></a></li>
							<!--gizli:anlasmali-kurumlar <li class="menu-item menu-item-type-post_type menu-item-object-page"><a href="/anlasmali-kurumlar/"><span class="pkm-img"><img src="/images/galeri/waiting-lounge.jpg" alt="" loading="lazy" decoding="async"></span><span class="pkm-text"><span class="pkm-label">Anlaşmalı Kurumlar</span></span></a></li> -->
							<li class="menu-item menu-item-type-post_type menu-item-object-page"><a href="/galeri/"><span class="pkm-img"><img src="/images/galeri/waiting-lounge.jpg" alt="" loading="lazy" decoding="async"></span><span class="pkm-text"><span class="pkm-label">Kliniğimiz</span></span></a></li>
						</ul>
					</div>
				</li>
				<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children pk-doctors">
					<a href="/ekibimiz/" aria-haspopup="true" aria-expanded="false"><span class="pkm-label">Ekibimiz</span></a>
					<button type="button" class="pkm-toggle" aria-label="Ekibimiz alt menüsü" aria-expanded="false"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
					<div class="pk-mega pk-mega--cards">
						<ul class="sub-menu">
							<li class="menu-item menu-item-type-post_type menu-item-object-page"><a href="/hekimimiz/"><span class="pkm-img"><img src="/images/doctor-gozde.jpg" alt="" loading="lazy" decoding="async"></span><span class="pkm-text"><span class="pkm-label">Dt. Gözde Hilal Morkoyunlu</span><span class="pkm-sub">Kurucu Diş Hekimi</span></span></a></li>
						</ul>
					</div>
				</li>
				<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children current-menu-ancestor current-menu-parent">
					<a href="/tedaviler" role="button" data-pk-sub aria-haspopup="true" aria-expanded="false"><span class="pkm-label" style="color:var(--pk-teal);">Tedavilerimiz</span></a>
					<button type="button" class="pkm-toggle" aria-label="Tedavilerimiz alt menüsü" aria-expanded="false"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
					<div class="pk-mega pk-mega--cols">
						<ul class="sub-menu">
							<li class="menu-item menu-item-type-post_type menu-item-object-post menu-item-has-children">
								<a href="/genel-dis-tedavileri/"><span class="pkm-label">Genel Diş Tedavileri</span></a>
								<ul class="sub-menu">
									<li><a href="/genel-dis-tedavileri/genel-dis-muayenesi-ve-dijital-teshis"><span class="pkm-label">Genel Diş Muayenesi</span></a></li>
									<li><a href="/genel-dis-tedavileri/dis-dolgusu"><span class="pkm-label">Diş Dolgusu</span></a></li>
									<li><a href="/genel-dis-tedavileri/kanal-tedavisi"><span class="pkm-label">Kanal Tedavisi</span></a></li>
									<li><a href="/genel-dis-tedavileri/dis-cekimi"><span class="pkm-label">Diş Çekimi</span></a></li>
									<li><a href="/genel-dis-tedavileri/gomulu-dis-cekimi"><span class="pkm-label">Gömülü Diş Çekimi</span></a></li>
									<li><a href="/genel-dis-tedavileri/20lik-dis-cekimi"><span class="pkm-label">20'lik Diş Çekimi</span></a></li>
									<li><a href="/genel-dis-tedavileri/dis-kirigi-tedavisi"><span class="pkm-label">Diş Kırığı Tedavisi</span></a></li>
								</ul>
							</li>
							<li class="menu-item menu-item-type-post_type menu-item-object-post menu-item-has-children">
								<a href="/ortodontik-tedaviler/"><span class="pkm-label">Ortodontik Tedaviler</span></a>
								<ul class="sub-menu">
									<li><a href="/ortodontik-tedaviler/dis-teli-tedavisi"><span class="pkm-label">Diş Teli Tedavisi</span></a></li>
									<li><a href="/ortodontik-tedaviler/invisalign"><span class="pkm-label">Invisalign (Şeffaf Plak)</span></a></li>
									<li><a href="/ortodontik-tedaviler/seffaf-braketli-tedavi"><span class="pkm-label">Şeffaf Braketli Tedavi</span></a></li>
								</ul>
							</li>
							<li class="menu-item menu-item-type-post_type menu-item-object-post menu-item-has-children">
								<a href="/implant-tedavisi/"><span class="pkm-label">İmplant Tedavisi</span></a>
								<ul class="sub-menu">
									<li><a href="/implant-tedavisi/tek-dis-implant-tedavisi"><span class="pkm-label">Tek Diş İmplant Tedavisi</span></a></li>
									<li><a href="/implant-tedavisi/coklu-dis-implant-tedavisi"><span class="pkm-label">Çoklu Diş İmplant Tedavisi</span></a></li>
									<li><a href="/implant-tedavisi/full-agiz-implant-tedavisi"><span class="pkm-label">Full Ağız İmplant Tedavisi</span></a></li>
									<li><a href="/implant-tedavisi/box-teknik"><span class="pkm-label">Box Teknik (Greftleme)</span></a></li>
								</ul>
							</li>
							<li class="menu-item menu-item-type-post_type menu-item-object-post menu-item-has-children">
								<a href="/cocuk-dis-hekimligi/"><span class="pkm-label">Çocuk Diş Hekimliği</span></a>
								<ul class="sub-menu">
									<li><a href="/cocuk-dis-hekimligi/fluorid-uygulamasi"><span class="pkm-label">Fluorid Uygulaması</span></a></li>
									<li><a href="/cocuk-dis-hekimligi/fissur-ortucu"><span class="pkm-label">Fissür Örtücü</span></a></li>
									<li><a href="/cocuk-dis-hekimligi/yer-tutucu-tedavisi"><span class="pkm-label">Yer Tutucu Tedavisi</span></a></li>
								</ul>
							</li>
							<li class="menu-item menu-item-type-post_type menu-item-object-post menu-item-has-children">
								<a href="/koruyucu-dis-tedavileri/"><span class="pkm-label">Koruyucu Diş Tedavileri</span></a>
								<ul class="sub-menu">
									<li><a href="/koruyucu-dis-tedavileri/agiz-kokusu-tedavisi"><span class="pkm-label">Ağız Kokusu Tedavisi</span></a></li>
									<li><a href="/koruyucu-dis-tedavileri/hassas-dis-tedavisi"><span class="pkm-label">Hassas Diş Tedavisi</span></a></li>
									<li><a href="/koruyucu-dis-tedavileri/dis-sikma-ve-gicirdatma-tedavisi"><span class="pkm-label">Diş Sıkma ve Gıcırdatma</span></a></li>
								</ul>
							</li>
							<li class="menu-item menu-item-type-post_type menu-item-object-post menu-item-has-children">
								<a href="/kozmetik-dis-hekimligi/"><span class="pkm-label">Kozmetik Diş Hekimliği</span></a>
								<ul class="sub-menu">
									<li><a href="/kozmetik-dis-hekimligi/dis-beyazlatma"><span class="pkm-label">Diş Beyazlatma</span></a></li>
									<li><a href="/kozmetik-dis-hekimligi/lamina-dis-kaplama"><span class="pkm-label">Lamina Diş Kaplama</span></a></li>
									<li><a href="/kozmetik-dis-hekimligi/zirkonyum-kaplama"><span class="pkm-label">Zirkonyum Kaplama</span></a></li>
									<li><a href="/kozmetik-dis-hekimligi/porselen-kaplama"><span class="pkm-label">Porselen Kaplama</span></a></li>
									<li><a href="/kozmetik-dis-hekimligi/estetik-dis-dolgusu"><span class="pkm-label">Estetik Diş Dolgusu</span></a></li>
									<li><a href="/kozmetik-dis-hekimligi/bonding-uygulamasi"><span class="pkm-label">Bonding Uygulaması</span></a></li>
								</ul>
							</li>
							<li class="menu-item menu-item-type-post_type menu-item-object-post menu-item-has-children">
								<a href="/eksik-dis-tedavileri/"><span class="pkm-label">Eksik Diş Tedavileri</span></a>
								<ul class="sub-menu">
									<li><a href="/eksik-dis-tedavileri/implant-tedavisi"><span class="pkm-label">İmplant Tedavisi</span></a></li>
									<li><a href="/eksik-dis-tedavileri/kopru-porselen"><span class="pkm-label">Köprü Porselen</span></a></li>
									<li><a href="/eksik-dis-tedavileri/full-agiz-dis-tedavisi"><span class="pkm-label">Full Ağız Diş Tedavisi</span></a></li>
								</ul>
							</li>
							<li class="menu-item menu-item-type-post_type menu-item-object-post menu-item-has-children">
								<a href="/dis-eti-periodontal-hastaliklar-ve-tedavileri/"><span class="pkm-label">Diş Eti (Periodontal) Tedaviler</span></a>
								<ul class="sub-menu">
									<li><a href="/dis-eti-periodontal-hastaliklar-ve-tedavileri/dis-eti-tedavisi"><span class="pkm-label">Diş Eti Tedavisi</span></a></li>
									<li><a href="/dis-eti-periodontal-hastaliklar-ve-tedavileri/kuretaj-tedavisi"><span class="pkm-label">Küretaj Tedavisi</span></a></li>
									<li><a href="/dis-eti-periodontal-hastaliklar-ve-tedavileri/flap-tedavisi"><span class="pkm-label">Flap Tedavisi</span></a></li>
									<li><a href="/dis-eti-periodontal-hastaliklar-ve-tedavileri/dis-eti-iltihabi"><span class="pkm-label">Diş Eti İltihabı</span></a></li>
									<li><a href="/dis-eti-periodontal-hastaliklar-ve-tedavileri/dis-tasi-temizligi"><span class="pkm-label">Diş Taşı Temizliği</span></a></li>
								</ul>
							</li>
							<li class="menu-item menu-item-type-post_type menu-item-object-post menu-item-has-children">
								<a href="/ozel-dis-tedavileri/"><span class="pkm-label">Özel Diş Tedavileri</span></a>
								<ul class="sub-menu">
									<li><a href="/ozel-dis-tedavileri/dijital-dis-hekimligi-ve-gulus-tasarimi"><span class="pkm-label">Dijital Gülüş Tasarımı</span></a></li>
									<li><a href="/ozel-dis-tedavileri/amalgam-dolgu-cikarma"><span class="pkm-label">Amalgam Dolgu Çıkarma</span></a></li>
								</ul>
							</li>
						</ul>
					</div>
				</li>
				<li class="menu-item menu-item-type-post_type menu-item-object-page"><a href="/iletisim/"><span class="pkm-label">İletişim</span></a></li>
			</ul>
		</nav>

		<div class="pkh-act">
			<a class="pkh-tel" href="tel:+903862134040"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>0386 213 40 40</a>
			<a class="pk-b pk-b--primary pkh-cta" href="/randevu" data-pk-randevu>Randevu Oluştur</a>
			<a class="pkh-telic" href="tel:+903862134040" aria-label="Ara: 0386 213 40 40"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg></a>
			<button type="button" class="pkh-toggle" aria-expanded="false" aria-controls="pkh-mobile" aria-label="Menüyü aç">
				<span class="pkh-tl pkh-tl-open" aria-hidden="true">Menü</span>
				<span class="pkh-tl pkh-tl-close" aria-hidden="true">Kapat</span>
				<span class="pkh-ic-open"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
				<span class="pkh-ic-close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
			</button>
		</div>
	</div>

	<!-- Mobil Menü -->
	<div id="pkh-mobile" class="pkh-mobile" hidden>
		<nav aria-label="Mobil menü">
			<ul id="pkh-menu-mobile" class="pkh-menu">
				<li><a href="/"><span class="pkm-label">Ana Sayfa</span></a></li>
				<li><a href="/hakkimizda/"><span class="pkm-label">Hakkımızda</span></a></li>
				<li><a href="/ekibimiz/"><span class="pkm-label">Ekibimiz</span></a></li>
				<li><a href="/tedaviler/"><span class="pkm-label">Tedavilerimiz</span></a></li>
				<li><a href="/galeri/"><span class="pkm-label">Kliniğimiz &amp; Galeri</span></a></li>
				<!--gizli:anlasmali-kurumlar <li><a href="/anlasmali-kurumlar/"><span class="pkm-label">Anlaşmalı Kurumlar</span></a></li> -->
				<li><a href="/iletisim/"><span class="pkm-label">İletişim</span></a></li>
			</ul>
		</nav>
		<div class="pkh-mobile-act">
			<a class="pk-b pk-b--primary" href="/randevu" data-pk-randevu>Randevu Oluştur</a>
			<a class="pk-b pk-b--outline" href="tel:+903862134040">0386 213 40 40</a>
		</div>
		<p class="pkh-mobile-info">
			Nasuh Dede Mah. Prof. Dr. Mehmet Ali Altın Bulvarı No:14/A, Merkez / KIRŞEHİR<br>
			Pazartesi – Cumartesi 09:00 – 19:00
		</p>
	</div>
</header>

<!-- Hero Başlık Bandı -->
<div class="pk-band">
	<img class="pk-band-mark" src="/images/logo.png" alt="Dt. Gözde Hilal Morkoyunlu Diş Kliniği" width="520" height="198" decoding="async">
	<div class="pk-band-in">
		<nav class="pk-crumbs pk-in" aria-label="Sayfa yolu">
			<span><span><a href="/">Anasayfa</a></span> <span class="pk-crumb-sep" aria-hidden="true">›</span> <span><a href="/tedaviler">Tedavilerimiz</a></span> <span class="pk-crumb-sep" aria-hidden="true">›</span> <span class="breadcrumb_last" aria-current="page">${cat.heroTitle}</span></span>
		</nav>
		<span class="pk-badge" style="margin-bottom:12px; display:inline-block;">${cat.badge}</span>
		<h1 class="pk-band-title pk-in pk-d1">${cat.heroTitle}</h1>
		<p class="pk-band-desc">${cat.heroDesc}</p>
	</div>
</div>

<!-- Ana İçerik ve Bölümler -->
<main id="content" class="site-main">
	<div class="pk-treatment-sections">
		${cardsHtml}

		<!-- Sayfa Sonu Çağrı Kartı -->
		<div class="pk-treatment-cta-banner">
			<div class="pk-cta-banner-in">
				<h2>Sağlıklı ve Estetik Bir Gülüş İçin <span>İlk Adımı Atın</span></h2>
				<p>Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir'de son teknoloji cihazlar, konforlu klinik ortamı ve alanında uzman hekim yaklaşımıyla yanınızda.</p>
				<div class="pk-cta-banner-btns">
					<a class="pk-b pk-b--primary" href="/randevu" data-pk-randevu style="padding:14px 32px; font-size:1.05rem;">Hemen Randevu Oluştur</a>
					<a class="pk-b pk-b--outline" href="tel:+903862134040" style="padding:14px 28px; font-size:1.05rem; color:#FFFFFF !important; border-color:rgba(255,255,255,0.4) !important;">
						<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-right:6px;"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>
						0386 213 40 40
					</a>
				</div>
			</div>
		</div>
	</div>
</main>

<footer id="site-footer" class="pkf" aria-label="Site alt bilgisi">
	<div class="pkf-in">
		<div class="pkf-top">
			<a class="pkf-logo" href="/" aria-label="Dt. Gözde Hilal Morkoyunlu Diş Kliniği ana sayfa"><img class="pkl pkl--white" src="/images/logo-beyaz.png" alt="Dt. Gözde Hilal Morkoyunlu Diş Kliniği" width="1956" height="649" decoding="async" loading="lazy" style="height:52px; width:auto; max-width:240px; object-fit:contain; display:block !important;"></a>
			<div class="pkf-act">
				<a class="pk-b pk-b--primary" href="/randevu" data-pk-randevu>Randevu Oluştur</a>
				<a class="pk-b pk-b--outline-light" href="tel:+903862134040">0386 213 40 40</a>
				<div class="pkf-social">
					<a href="https://www.instagram.com/gozde_hilal_morkoyunlu/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/></svg></a>
					<a href="https://kirsehirwebdesign.com/" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 8h2.5V4.5H14c-2.5 0-4 1.6-4 4.1V11H7.5v3.5H10V21h3.5v-6.5h2.7l.5-3.5h-3.2V8.9c0-.6.3-.9.5-.9z"/></svg></a>
					<a href="https://wa.me/905402134040" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.1z"/></svg></a>
				</div>
			</div>
		</div>

		<div class="pkf-info">
			<div class="pkf-col">
				<p class="pkf-h">Adresimiz</p>
				<p>Nasuh Dede Mah. Prof. Dr. Mehmet Ali Altın Bulvarı No:14/A<br>Merkez / KIRŞEHİR</p>
				<a class="pkf-more" href="https://maps.google.com/?q=Nasuh+Dede+Mah.+Prof.+Dr.+Mehmet+Ali+Altın+Bulvarı+No:14/A+Kırşehir" target="_blank" rel="noopener">Yol tarifi al</a>
			</div>
			<div class="pkf-col">
				<p class="pkf-h">Çalışma Saatleri</p>
				<p>Pazartesi – Cumartesi: 09:00 – 19:00<br>Pazar: Kapalı</p>
			</div>
			<div class="pkf-col">
				<p class="pkf-h">İletişim &amp; Randevu</p>
				<p>Telefon: <a href="tel:+903862134040">0386 213 40 40</a><br>WhatsApp: <a href="https://wa.me/905402134040">0540 213 40 40</a></p>
			</div>
		</div>
	</div>

	<div class="pkf-bar">
		<div class="pkf-bar-in">
			<span>© 2026 Dt. Gözde Hilal Morkoyunlu Diş Kliniği | Tüm hakları saklıdır.</span>
			<span style="display:inline-flex; align-items:center; gap:8px;">Web Tasarım &amp; Yazılım: <a href="https://kirsehirwebdesign.com/" target="_blank" rel="noopener" title="Kırşehir Web Design" style="display:inline-flex; align-items:center; gap:6px; color:inherit; text-decoration:none;"><img src="/images/kirsehirwebdesign-logo-trans.png" alt="Kırşehir Web Design" style="height:30px; width:auto; vertical-align:middle;"></a></span>
		</div>
	</div>
</footer>

<div class="pk-mbar" data-pk-mbar>
	<span class="pk-mbar-txt">Sorunuz mu var? <b>0386 213 40 40</b></span>
	<a class="pk-mbar-tel" href="tel:+903862134040"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>Ara</a>
	<a class="pk-b pk-b--primary pk-mbar-cta" href="/randevu" data-pk-randevu>Randevu Oluştur</a>
</div>

<!-- Randevu Modal Dialog -->
<dialog id="pk-randevu" class="pkr-modal">
	<div class="pkr-card">
		<header class="pkr-head">
			<h2 class="pkr-title">Online Randevu Oluştur</h2>
			<p class="pkr-sub">Dt. Gözde Hilal Morkoyunlu Diş Kliniği · Kırşehir</p>
		</header>
		<form id="pkr-form" class="pkr-form" method="post" action="/api/appointments">
			<label class="pkr-f"><span>Adınız Soyadınız<i aria-hidden="true"> *</i></span><input name="ad_soyad" type="text" required placeholder="Adınız Soyadınız"></label>
			<label class="pkr-f"><span>Telefon Numaranız<i aria-hidden="true"> *</i></span><input name="telefon" type="tel" required placeholder="05XX XXX XX XX"></label>
			<label class="pkr-f"><span>İlgilendiğiniz Tedavi</span>
				<select name="tedavi">
					<option value="${cat.heroTitle}">${cat.heroTitle}</option>
					<option value="İmplant Tedavisi">İmplant Tedavisi</option>
					<option value="Zirkonyum Kaplama">Zirkonyum Kaplama</option>
					<option value="Diş Beyazlatma">Diş Beyazlatma</option>
					<option value="Invisalign Şeffaf Plak">Invisalign Şeffaf Plak</option>
					<option value="Kanal Tedavisi & Dolgu">Kanal Tedavisi &amp; Dolgu</option>
					<option value="Diş Eti Tedavisi">Diş Eti Tedavisi</option>
					<option value="Genel Diş Kontrolü">Genel Diş Kontrolü</option>
				</select>
			</label>
			<label class="pkr-f"><span>Tercih Edilen Tarih</span><input name="tarih" type="date"></label>
			<label class="pkr-f pkr-f--full"><span>Eklemek İstediğiniz Not veya Şikayetiniz</span><textarea name="mesaj" rows="3" placeholder="Şikayetinizi veya sormak istediklerinizi kısaca belirtebilirsiniz."></textarea></label>
			<div class="pkr-foot">
				<button class="pk-b pk-b--primary pkr-send" type="submit" style="width:100%;">Randevu Talebini Gönder</button>
			</div>
			<p class="pkr-status" role="status" aria-live="polite"></p>
		</form>
		<button class="pkr-close" type="button" aria-label="Kapat" data-pkr-close><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
	</div>
</dialog>

<script defer src="/js/theme/app-nav.js?v=20261113-url"></script>
<script defer src="/js/theme/randevu-modal.js"></script>
</body>
</html>`;
}

// Write the 9 treatment category pages
for (const cat of CATEGORIES) {
  const html = generateTreatmentPageHtml(cat);
  const filePath = join(PUBLIC_DIR, `${cat.slug}.html`);
  writeFileSync(filePath, html, "utf-8");
  console.log(`Generated: ${cat.slug}.html (${html.length} bytes)`);
}

// Also write anlasmali-kurumlar.html
const anlasmaliKurumlarHtml = `<!doctype html>
<html lang="tr">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Anlaşmalı Kurumlar & Özel Sigortalar | Dt. Gözde Hilal Morkoyunlu Diş Kliniği Kırşehir</title>
	<meta name="description" content="Kırşehir Dt. Gözde Hilal Morkoyunlu Diş Kliniği anlaşmalı özel sağlık sigortaları, banka sandıkları ve kurumsal anlaşmalar.">
	<link rel="canonical" href="/anlasmali-kurumlar/">
	<link rel="icon" href="/images/logo.png" sizes="32x32">
	<link rel="stylesheet" id="hello-elementor-css" href="/css/theme/reset.css" media="all">
	<link rel="stylesheet" id="hello-elementor-theme-style-css" href="/css/theme/theme.css" media="all">
	<link rel="stylesheet" id="ghm-child-css" href="/css/theme/core-theme.css" media="all">
	<link rel="stylesheet" id="ghm-layout-css" href="/css/theme/layout.css?v=20261113-url" media="all">
	<link rel="stylesheet" id="ghm-pages-css" href="/css/theme/pages.css" media="all">
	<link rel="stylesheet" id="ghm-randevu-css" href="/css/theme/randevu-modal.css" media="all">
	<link rel="stylesheet" id="ghm-site-css" href="/css/theme/site.css" media="all">
	<link rel="stylesheet" id="ghm-treatment-css" href="/css/theme/treatment-page.css" media="all">
	<link rel="stylesheet" id="elementor-gf-poppins-css" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800&display=swap&subset=latin-ext" media="all">
	<style>
		:root {
			--pk-teal: #C59B27 !important;
			--pk-teal-2: #A67C1E !important;
		}
		.kurum-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
			gap: 20px;
			margin: 30px 0 50px;
		}
		.kurum-card {
			background: #FFFFFF;
			border: 1px solid #E2E8F0;
			border-radius: 16px;
			padding: 24px;
			text-align: center;
			box-shadow: 0 8px 20px rgba(0,0,0,0.04);
			transition: all 0.3s ease;
		}
		.kurum-card:hover {
			border-color: #C59B27;
			transform: translateY(-4px);
			box-shadow: 0 12px 28px rgba(197, 155, 39, 0.15);
		}
		.kurum-icon {
			width: 56px;
			height: 56px;
			border-radius: 50%;
			background: rgba(197, 155, 39, 0.1);
			color: #C59B27;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto 16px;
		}
		.kurum-name {
			font-size: 1.1rem;
			font-weight: 700;
			color: #0F172A;
			margin-bottom: 6px;
		}
		.kurum-badge {
			font-size: 0.8rem;
			color: #8C6D1F; background: #FAF5E8;
			background: #F1F5F9;
			padding: 4px 10px;
			border-radius: 20px;
			display: inline-block;
		}
	</style>
</head>
<body class="wp-singular page pk-no-band elementor-default">

<header id="site-header" class="pkh" data-pkh>
	<div class="pkh-in">
		<a class="pkh-logo" href="/" aria-label="Dt. Gözde Hilal Morkoyunlu Diş Kliniği ana sayfa"><img class="pkl" src="/images/logo.png" alt="Dt. Gözde Hilal Morkoyunlu Diş Kliniği" style="height:54px; width:auto; max-width:240px; object-fit:contain;"></a>
		<nav class="pkh-nav" aria-label="Ana menü">
			<ul id="pkh-menu" class="pkh-menu">
				<li><a href="/"><span class="pkm-label">Ana Sayfa</span></a></li>
				<li><a href="/hakkimizda/"><span class="pkm-label">Hakkımızda</span></a></li>
				<li><a href="/tedaviler/"><span class="pkm-label">Tedavilerimiz</span></a></li>
				<li><a href="/ekibimiz/"><span class="pkm-label">Ekibimiz</span></a></li>
				<li><a href="/galeri/"><span class="pkm-label">Kliniğimiz</span></a></li>
				<!--gizli:anlasmali-kurumlar <li class="current-menu-item"><a href="/anlasmali-kurumlar/"><span class="pkm-label" style="color:#C59B27;">Anlaşmalı Kurumlar</span></a></li> -->
				<li><a href="/iletisim/"><span class="pkm-label">İletişim</span></a></li>
			</ul>
		</nav>
		<div class="pkh-act">
			<a class="pkh-tel" href="tel:+903862134040"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>0386 213 40 40</a>
			<a class="pk-b pk-b--primary pkh-cta" href="/randevu" data-pk-randevu>Randevu Oluştur</a>
		</div>
	</div>
</header>

<div class="pk-band">
	<img class="pk-band-mark" src="/images/logo.png" alt="Dt. Gözde Hilal Morkoyunlu Diş Kliniği" width="520" height="198" decoding="async">
	<div class="pk-band-in">
		<nav class="pk-crumbs pk-in" aria-label="Sayfa yolu">
			<span><span><a href="/">Anasayfa</a></span> <span class="pk-crumb-sep" aria-hidden="true">›</span> <span class="breadcrumb_last" aria-current="page">Anlaşmalı Kurumlar</span></span>
		</nav>
		<span class="pk-badge" style="margin-bottom:12px; display:inline-block;">Özel Sağlık Sigortaları &amp; Kurumsal Protokoller</span>
		<h1 class="pk-band-title pk-in pk-d1">Anlaşmalı Kurumlar</h1>
		<p class="pk-band-desc">Tedavi süreçlerinizde anlaşmalı özel sağlık sigortaları, banka sandıkları ve kurumsal protokoller ile geniş avantajlar, indirimler ve ödeme kolaylıkları sunuyoruz.</p>
	</div>
</div>

<main id="content" class="site-main" style="max-width:1320px; margin:50px auto 80px; padding:0 20px;">
	<div style="background:#FFFFFF; border-radius:24px; padding:40px; border:1px solid #E2E8F0; box-shadow:0 12px 30px rgba(0,0,0,0.05); margin-bottom:40px;">
		<h2 style="font-size:1.8rem; font-weight:800; color:#0F172A; margin-bottom:12px;">Özel Sağlık Sigortaları &amp; Sandıklar</h2>
		<p style="color:#475569; font-size:1.05rem; line-height:1.7; max-width:850px;">Kliniğimizde anlaşmalı özel sigorta kartınız veya T.C. kimlik numaranızla anında online provizyon alınarak, poliçeniz kapsamındaki tedavileriniz doğrudan sigortanız üzerinden karşılanır.</p>

		<div class="kurum-grid">
			<div class="kurum-card">
				<div class="kurum-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
				<div class="kurum-name">Allianz Sigorta</div>
				<span class="kurum-badge">Tam Kapsamlı Anlaşma</span>
			</div>
			<div class="kurum-card">
				<div class="kurum-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
				<div class="kurum-name">Acıbadem Sigorta</div>
				<span class="kurum-badge">Bupa Acıbadem Network</span>
			</div>
			<div class="kurum-card">
				<div class="kurum-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
				<div class="kurum-name">Aksigorta</div>
				<span class="kurum-badge">Özel Sağlık Poliçesi</span>
			</div>
			<div class="kurum-card">
				<div class="kurum-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
				<div class="kurum-name">Anadolu Sigorta</div>
				<span class="kurum-badge">Geniş Kapsamlı Sağlık</span>
			</div>
			<div class="kurum-card">
				<div class="kurum-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
				<div class="kurum-name">Mapfre Sigorta</div>
				<span class="kurum-badge">Özel Diş Teminatı</span>
			</div>
			<div class="kurum-card">
				<div class="kurum-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
				<div class="kurum-name">Türkiye Sigorta</div>
				<span class="kurum-badge">Kurumsal Sağlık Ağı</span>
			</div>
			<div class="kurum-card">
				<div class="kurum-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
				<div class="kurum-name">Sompo Sigorta</div>
				<span class="kurum-badge">Özel Sağlık &amp; Tamamlayıcı</span>
			</div>
			<div class="kurum-card">
				<div class="kurum-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3l9 7H3l9-7z"></path></svg></div>
				<div class="kurum-name">Banka Emekli Sandıkları</div>
				<span class="kurum-badge">Garanti, İş Bankası, YKB vb.</span>
			</div>
		</div>

		<div style="background:#F8FAFC; border-radius:16px; padding:28px; border:1px solid #E2E8F0; margin-top:20px;">
			<h3 style="font-size:1.25rem; font-weight:700; color:#0F172A; margin-bottom:12px;">Poliçeniz Kapsamında Hangi Tedavilerden Yararlanabilirsiniz?</h3>
			<ul style="color:#475569; font-size:1rem; line-height:1.8; margin-left:20px;">
				<li>Yıllık rutin diş hekimi muayenesi ve dijital panoramik röntgen çekimi</li>
				<li>Diş taşı temizliği (detertraj) ve polisaj uygulamaları</li>
				<li>Dolgu ve acil diş çekimi tedavileri</li>
				<li>Kapsamlı poliçelerde kanal tedavisi, cerrahi çekimler ve diş eti tedavileri</li>
			</ul>
			<p style="margin-top:16px; font-size:0.95rem; color: #8C6D1F; background: #FAF5E8;">Sigortanızın kliniğimizde geçerli olup olmadığını öğrenmek için lütfen kimlik bilgilerinizle kliniğimize danışınız: <a href="tel:+903862134040" style="color:#C59B27; font-weight:700;">0386 213 40 40</a></p>
		</div>
	</div>
</main>

<footer id="site-footer" class="pkf" aria-label="Site alt bilgisi">
	<div class="pkf-in">
		<div class="pkf-top">
			<a class="pkf-logo" href="/" aria-label="Dt. Gözde Hilal Morkoyunlu Diş Kliniği ana sayfa"><img class="pkl pkl--white" src="/images/logo-beyaz.png" alt="Dt. Gözde Hilal Morkoyunlu Diş Kliniği" width="1956" height="649" decoding="async" loading="lazy" style="height:52px; width:auto; max-width:240px; object-fit:contain; display:block !important;"></a>
			<div class="pkf-act">
				<a class="pk-b pk-b--primary" href="/randevu" data-pk-randevu>Randevu Oluştur</a>
				<a class="pk-b pk-b--outline-light" href="tel:+903862134040">0386 213 40 40</a>
			</div>
		</div>
		<div class="pkf-info">
			<div class="pkf-col">
				<p class="pkf-h">Adresimiz</p>
				<p>Nasuh Dede Mah. Prof. Dr. Mehmet Ali Altın Bulvarı No:14/A<br>Merkez / KIRŞEHİR</p>
			</div>
			<div class="pkf-col">
				<p class="pkf-h">Çalışma Saatleri</p>
				<p>Pazartesi – Cumartesi: 09:00 – 19:00<br>Pazar: Kapalı</p>
			</div>
			<div class="pkf-col">
				<p class="pkf-h">İletişim &amp; Randevu</p>
				<p>Telefon: <a href="tel:+903862134040">0386 213 40 40</a><br>WhatsApp: <a href="https://wa.me/905402134040">0540 213 40 40</a></p>
			</div>
		</div>
	</div>
	<div class="pkf-bar">
		<div class="pkf-bar-in">
			<span>© 2026 Dt. Gözde Hilal Morkoyunlu Diş Kliniği | Tüm hakları saklıdır.</span>
			<span style="display:inline-flex; align-items:center; gap:8px;">Web Tasarım &amp; Yazılım: <a href="https://kirsehirwebdesign.com/" target="_blank" rel="noopener" title="Kırşehir Web Design" style="display:inline-flex; align-items:center; gap:6px; color:inherit; text-decoration:none;"><img src="/images/kirsehirwebdesign-logo-trans.png" alt="Kırşehir Web Design" style="height:30px; width:auto; vertical-align:middle;"></a></span>
		</div>
	</div>
</footer>

<dialog id="pk-randevu" class="pkr-modal">
	<div class="pkr-card">
		<header class="pkr-head">
			<h2 class="pkr-title">Online Randevu Oluştur</h2>
			<p class="pkr-sub">Dt. Gözde Hilal Morkoyunlu Diş Kliniği · Kırşehir</p>
		</header>
		<form id="pkr-form" class="pkr-form" method="post" action="/api/appointments">
			<label class="pkr-f"><span>Adınız Soyadınız<i aria-hidden="true"> *</i></span><input name="ad_soyad" type="text" required placeholder="Adınız Soyadınız"></label>
			<label class="pkr-f"><span>Telefon Numaranız<i aria-hidden="true"> *</i></span><input name="telefon" type="tel" required placeholder="05XX XXX XX XX"></label>
			<label class="pkr-f"><span>İlgilendiğiniz Tedavi / Kurum</span><input name="tedavi" type="text" value="Anlaşmalı Kurum / Sigorta Randevusu"></label>
			<div class="pkr-foot">
				<button class="pk-b pk-b--primary pkr-send" type="submit" style="width:100%;">Randevu Talebini Gönder</button>
			</div>
		</form>
		<button class="pkr-close" type="button" aria-label="Kapat" data-pkr-close><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
	</div>
</dialog>

<script defer src="/js/theme/app-nav.js?v=20261113-url"></script>
<script defer src="/js/theme/randevu-modal.js"></script>
</body>
</html>`;

// Anlaşmalı Kurumlar sayfası: scripts/toggle_anlasmali_kurumlar.py ile açılıp kapatılır
const ANLASMALI_KURUMLAR_AKTIF = false;
if (ANLASMALI_KURUMLAR_AKTIF) {
  writeFileSync(join(PUBLIC_DIR, "anlasmali-kurumlar.html"), anlasmaliKurumlarHtml, "utf-8");
  console.log(`Generated: anlasmali-kurumlar.html (${anlasmaliKurumlarHtml.length} bytes)`);
} else {
  console.log("Skipped: anlasmali-kurumlar.html (gizli)");
}
console.log("\n✅ All 10 treatment & institutional pages successfully generated!");

