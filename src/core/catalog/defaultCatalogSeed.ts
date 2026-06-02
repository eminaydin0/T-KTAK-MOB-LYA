import type { CatalogCategory, CatalogProduct } from './types'
import { extraCategories, extraProducts } from './defaultCatalogSeedExtra'
import { enrichCategories, enrichProducts } from './catalogSlugs'

const baseCategories: Omit<CatalogCategory, 'slug'>[] = [
  {
    id: 1,
    name: 'Mobilya',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    questions: [
      { id: 'q_mob_olcu', label: 'Ölçü (G x D x Y, cm)', placeholder: 'Örn: 180 x 90 x 75' },
      { id: 'q_mob_malzeme', label: 'Ana malzeme / kaplama', placeholder: 'Masif, MDF, laminat…' },
      { id: 'q_mob_renk', label: 'Renk / ton', placeholder: 'Doğal, ceviz, antrasit…' },
      { id: 'q_mob_bakim', label: 'Bakım önerisi', placeholder: 'Vernik, yağ, kuru bez…' },
    ],
  },
  {
    id: 2,
    name: 'Ofis Mobilyası',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    questions: [
      { id: 'q_ofis_ergo', label: 'Ergonomi / ayar özellikleri', placeholder: 'Yükseklik, bel desteği…' },
      { id: 'q_ofis_garanti', label: 'Garanti süresi', placeholder: 'Yıl' },
      { id: 'q_ofis_kapasite', label: 'Yük kapasitesi', placeholder: 'kg, raf adedi…' },
      { id: 'q_ofis_kablo', label: 'Kablo / priz yönetimi', placeholder: 'Gromet, kanal, USB…' },
    ],
  },
  {
    id: 3,
    name: 'Sehpa',
    imageUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop',
    questions: [
      { id: 'q_sehpa_tabla', label: 'Üst tabla ölçüleri (cm)', placeholder: 'Örn: 120 x 60' },
      { id: 'q_sehpa_raf', label: 'Raf / bölme sayısı', placeholder: '0, 1, 2…' },
      { id: 'q_sehpa_ayak', label: 'Ayak tipi / malzeme', placeholder: 'Metal, ahşap, teker…' },
      { id: 'q_sehpa_yukseklik', label: 'Yükseklik (cm)', placeholder: 'Oturma hizası' },
    ],
  },
  {
    id: 4,
    name: 'Yatak Odası',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
    questions: [
      { id: 'q_yatak_ebat', label: 'Baz / yatak ebat', placeholder: '160x200, 180x200…' },
      { id: 'q_yatak_malzeme', label: 'Kumaş / başlık', placeholder: 'Kadife, keten…' },
      { id: 'q_yatak_dep', label: 'Depolama özelliği', placeholder: 'Baza çekmecesi, lift…' },
      { id: 'q_yatak_set', label: 'Set içeriği', placeholder: 'Komodin, şifonyer…' },
    ],
  },
  {
    id: 5,
    name: 'Depolama',
    imageUrl: 'https://images.unsplash.com/photo-1595428774220-17a58b32ab47?w=800&h=600&fit=crop',
    questions: [
      { id: 'q_dep_ic', label: 'İç düzen / modül', placeholder: 'Askılı, raflı, çekmece' },
      { id: 'q_dep_malzeme', label: 'Gövde malzemesi', placeholder: 'MDF, suntalam…' },
      { id: 'q_dep_kapak', label: 'Kapak tipi', placeholder: 'Sürgülü, menteşeli, aynalı' },
      { id: 'q_dep_olcu', label: 'Dış ölçü (cm)', placeholder: 'G x D x Y' },
    ],
  },
  {
    id: 6,
    name: 'Aydınlatma',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop',
    questions: [
      { id: 'q_aydin_w', label: 'Watt / sıcaklık (K)', placeholder: 'Örn: 12W, 3000K' },
      { id: 'q_aydin_mont', label: 'Montaj', placeholder: 'Tavan, masa, plug-in' },
      { id: 'q_aydin_dim', label: 'Dimmer uyumu', placeholder: 'Evet / hayır' },
      { id: 'q_aydin_ip', label: 'IP koruma sınıfı', placeholder: 'IP20, IP44…' },
    ],
  },
]

export const defaultCategories: CatalogCategory[] = enrichCategories([...baseCategories, ...extraCategories])

const baseProducts: Omit<CatalogProduct, 'slug'>[] = [
  {
    id: 1,
    name: 'Ahşap Yemek Masası',
    categoryId: 1,
    description:
      'Masif meşe ağacından üretilen bu yemek masası, 6–8 kişilik aile sofraları ve misafir ağırlamaları için ideal ölçülerde tasarlandı. Üst tabla 40 mm kalınlığında masif meşe panelden oluşur; doğal damar desenleri her masada benzersiz bir karakter oluşturur.\n\nMat su bazlı vernik kaplama günlük kullanıma karşı dayanıklıdır; sıcak tabak altlığı kullanımı önerilir. Ayak yapısı yerden ağırlığı dengeli dağıtır ve metal bağlantılar gövde içinde gizlenmiştir.\n\nShowroom’da farklı ölçü ve ton seçenekleri için randevu alabilirsiniz. Profesyonel kurulum ve teslimat hizmeti talep üzerine sunulur.',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1615874959474-d60996a81fe8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop',
    ],
    priceUsd: 899,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '180 x 90 x 75 cm (tabla yüksekliği)',
      q_mob_malzeme: 'Masif meşe tabla, meşe ayak',
      q_mob_renk: 'Doğal meşe tonu, mat vernik',
      q_mob_bakim: 'Nemli bezle silin; doğrudan güneşten kaçının',
    },
  },
  {
    id: 2,
    name: 'Ergonomik Ofis Sandalyesi',
    categoryId: 2,
    description:
      'Uzun çalışma saatleri için tasarlanmış ergonomik ofis sandalyesi; file sırt paneli nefes alır ve sırt bölgesinde ısı birikimini azaltır. Bel desteği yükseklik ve derinlik ayarlıdır; kol dayamaları 3D hareket kabiliyeti sunar.\n\nSenkron mekanizma ile koltuk ve sırt birlikte eğilir; kilitlenebilir dik pozisyon toplantılar için uygundur. Tekerlekler hem halı hem sert zemin için uygundur.\n\nKurumsal siparişlerde toplu renk ve kumaş seçenekleri mevcuttur. 2 yıl mekanizma garantisi kapsamındadır.',
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592078613520-57b4989e6f9c?w=800&h=600&fit=crop',
    ],
    priceUsd: 249,
    stockStatus: 'pre_order',
    leadTimeDays: 14,
    categoryAnswers: {
      q_ofis_ergo: 'Bel + kol 3D ayar, senkron tilt, yükseklik pistonu',
      q_ofis_garanti: '2 yıl (mekanizma)',
      q_ofis_kapasite: 'Maks. 120 kg kullanıcı',
      q_ofis_kablo: '—',
    },
  },
  {
    id: 3,
    name: 'Modüler Köşe Koltuk',
    categoryId: 1,
    description:
      'Geniş oturma alanı sunan modüler köşe koltuk; sağ veya sol köşe modülü sipariş sırasında seçilir. Yüksek yoğunluklu sünger dolgusu uzun süreli konfor sağlar; kumaş kaplama çıkarılabilir ve yıkanabilir.\n\nAhşap ayaklar mat ceviz tonunda; alt gövde ahşap iskelet üzerine kuruludur. Kanepe yanında uyumlu puf ve sehpa seti ile tamamlanabilir.\n\nTeslimat öncesi ölçü keşfi önerilir. Kumaş kartelinden 40’tan fazla renk seçeneği sunulmaktadır.',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8c?w=800&h=600&fit=crop',
    ],
    priceUsd: 1899,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '280 x 180 x 85 cm (köşe dahil)',
      q_mob_malzeme: 'Keten karışım kumaş, ceviz ayak',
      q_mob_renk: 'Gri-bej (kartelden değiştirilebilir)',
      q_mob_bakim: 'Düzenli vakumlama; leke için profesyonel temizlik',
    },
  },
  {
    id: 4,
    name: 'TV Ünitesi Duvar Modülü',
    categoryId: 1,
    description:
      'Minimal çizgili duvar tipi TV ünitesi; 55–65 inç ekranlar için optimize edilmiştir. Arka panelde kablo kanalları ve gizli priz boşluğu bulunur; medya kutusu ve ses sistemleri düzenli saklanır.\n\nMat lake beyaz yüzey parmak izine dayanıklıdır; soft-close menteşeli kapaklar sessiz kapanır. Alt bölümde iki çekmece ve açık raf kombinasyonu vardır.\n\nDuvara sabitleme aparatı pakete dahildir. Özel ölçü ve renk (antrasit, ceviz) üretim siparişi alınır.',
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop',
    ],
    priceUsd: 620,
    stockStatus: 'pre_order',
    leadTimeDays: 21,
    categoryAnswers: {
      q_mob_olcu: '220 x 45 x 50 cm',
      q_mob_malzeme: '18 mm MDF, mat lake kaplama',
      q_mob_renk: 'Beyaz mat lake',
      q_mob_bakim: 'Mikrofiber bez; aşındırıcı kullanmayın',
    },
  },
  {
    id: 5,
    name: 'Yemek Sandalyesi (2’li Set)',
    categoryId: 1,
    description:
      'İki adet sandalyeden oluşan set; yemek masası ve ada mutfak bankları ile uyumludur. Suni deri döşeme kolay temizlenir; köpük dolgu orta sertlikte konfor sunar.\n\nSiyah mat metal ayaklar kaymaz tabanlıdır. Sandalye başlığı hafif eğimli olup uzun sofralarda sırt desteği sağlar.\n\nAynı seride bar yüksekliği ve bench seçenekleri mevcuttur. Toplu siparişlerde kumaş rengi özelleştirilebilir.',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop',
    ],
    priceUsd: 198,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '45 x 55 x 92 cm (tek sandalye)',
      q_mob_malzeme: 'Suni deri, metal ayak',
      q_mob_renk: 'Antrasit döşeme / siyah ayak',
      q_mob_bakim: 'Nemli bez; solvent içermeyin',
    },
  },
  {
    id: 6,
    name: 'Konsol Dresuar',
    categoryId: 1,
    description:
      'Dar koridor, antre ve yemek odası duvarları için tasarlanmış konsol; üst yüzey dekor ve ayna için ideal genişlik sunar. Üç çekmeceli alt bölüm günlük eşyaları düzenler.\n\nCeviz laminat kaplama sıcak bir atmosfer oluşturur; metal kulp detayları modern bir dokunuş katar. Soft-close ray sistemi standarttır.\n\nDuvara sabitleme önerilir (çocuklu haneler). Eşleşen duvar aynası ayrı satılır.',
    images: ['https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&h=600&fit=crop'],
    priceUsd: 410,
    stockStatus: 'unknown',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '120 x 35 x 78 cm',
      q_mob_malzeme: 'Ceviz laminat, metal aksesuar',
      q_mob_renk: 'Orta ceviz tonu',
      q_mob_bakim: 'Kuru bez; aşırı nemden koruyun',
    },
  },
  {
    id: 7,
    name: 'L Sektör Ofis Masası',
    categoryId: 2,
    description:
      'Geniş çalışma alanı sunan L sektör masa; çift monitör ve belge düzeni için idealdir. Kablo toplama tepsisi ve gromet delikleri masaüstünü düzenli tutar.\n\nSol veya sağ L konfigürasyonu siparişte belirtilir. 25 mm melamin tabla çizilmeye karşı dayanıklıdır; metal ayaklar yüksek stabilite sağlar.\n\nAynı seride üst raf modülü ve mobil çekmeceli dolap ile set oluşturulabilir. Kurulum videosu ve montaj aparatları kutuda yer alır.',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
    ],
    priceUsd: 579,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_ofis_ergo: 'Sabit 75 cm çalışma yüksekliği',
      q_ofis_garanti: '3 yıl gövde',
      q_ofis_kapasite: '80 kg üst yüzey yükü',
      q_ofis_kablo: 'Gromet + alt tepsi',
    },
  },
  {
    id: 8,
    name: 'Metal Kitaplık 5 Raflı',
    categoryId: 2,
    description:
      'Endüstriyel tarzda metal kitaplık; ofis arşivi, ev kütüphanesi ve showroom vitrinleri için uygundur. Beş ayarlanabilir raf seviyesi farklı dosya yüksekliklerine uyum sağlar.\n\nElektrostatik toz boya siyah yüzey çizilmeye dayanıklıdır. Raf başına yaklaşık 35 kg taşıma kapasitesi önerilir.\n\nMontaj vidaları ve seviye ayar ayakları dahildir. Beyaz ve antrasit renk alternatifleri stoktan sorulabilir.',
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=600&fit=crop'],
    priceUsd: 189,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_ofis_ergo: 'Raf yüksekliği 3 cm aralıklarla ayarlı',
      q_ofis_garanti: '1 yıl',
      q_ofis_kapasite: 'Raf başına ~35 kg',
      q_ofis_kablo: '—',
    },
  },
  {
    id: 9,
    name: 'Toplantı Masası 240 cm',
    categoryId: 2,
    description:
      '12–14 kişilik toplantı ve eğitim salonları için 240 cm uzunluğunda masa. Beyaz melamin yüzey projeksiyon ve yazı için yansıma minimize eder.\n\nOrta bölmeye entegre gizli priz modülü (TR priz + USB) opsiyoneldir. Metal ayaklar kablolama için üstten geçiş boşluğu sunar.\n\nKurumsal projelerde logo baskılı tabla ve özel ölçü üretimi yapılır. Teslimat süresi sipariş hacmine göre değişir.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1431540015161-0bf4a2d490fe?w=800&h=600&fit=crop',
    ],
    priceUsd: 1299,
    stockStatus: 'pre_order',
    leadTimeDays: 30,
    categoryAnswers: {
      q_ofis_ergo: 'Standart toplantı yüksekliği 74 cm',
      q_ofis_garanti: '2 yıl',
      q_ofis_kapasite: 'Çelik ayak, sabit zemin önerilir',
      q_ofis_kablo: 'Gizli priz modülü (opsiyonel)',
    },
  },
  {
    id: 10,
    name: 'Orta Sehpa Mermer Desenli',
    categoryId: 3,
    description:
      'Salonun odak noktası olacak yuvarlak orta sehpa; mermer desenli laminat tabla lüks bir görünüm sunar. Siyah mat metal ayak üçlü tripod formunda dengelidir.\n\nTabla kenarı ince profil bantla korunur. Cam ve seramik vazo kullanımına uygundur; doğrudan keskin cisim temasından kaçının.\n\nAynı koleksiyonda yan sehpa ve TV ünitesi ile kombinlenebilir. Yerden yükseklik oturma grubuna göre 42 cm’dir.',
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    ],
    priceUsd: 320,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_sehpa_tabla: 'Ø 80 cm yuvarlak',
      q_sehpa_raf: 'Alt raf yok',
      q_sehpa_ayak: 'Mat siyah metal tripod',
      q_sehpa_yukseklik: '42 cm',
    },
  },
  {
    id: 11,
    name: 'Yan Sehpa Çift Çekmece',
    categoryId: 3,
    description:
      'Kanepe ve yatak başı yanında kullanıma uygun kompakt yan sehpa. İki çekmeceli alt gövde kumanda, kitap ve küçük eşyaları saklar.\n\nMeşe kaplama doğal tonlarıyla sıcak bir görünüm verir; soft-close çekmece rayları sessiz çalışır. Üst tabla kenarı hafif yuvarlatılmıştır.\n\nÇift olarak satın alındığında eşleşen çift set indirimi uygulanabilir. Montaj gerektirmez, kutudan çıkar çıkmaz kullanılır.',
    images: ['https://images.unsplash.com/photo-1616628182502-6c2a9c0a6e0e?w=800&h=600&fit=crop'],
    priceUsd: 145,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_sehpa_tabla: '50 x 40 cm',
      q_sehpa_raf: '2 çekmece',
      q_sehpa_ayak: 'Meşe ayak, 4 ayaklı',
      q_sehpa_yukseklik: '58 cm',
    },
  },
  {
    id: 12,
    name: 'Şeffaflık Cam Sehpa',
    categoryId: 3,
    description:
      'Temperli 8 mm cam tabla ile modern ve havadar bir salon görünümü. Krom kaplama metal çerçeve ince profille mekânı geniş gösterir.\n\nCam yüzey kolay silinir; dekoratif objeler için ideal vitrin etkisi yaratır. Çocuklu hanelerde köşe koruyucu önerilir.\n\nKüçük daireler ve loft düzenlerde tercih edilir. Alt cam raf opsiyonel olarak eklenebilir.',
    images: ['https://images.unsplash.com/photo-1600585152220-90363fe7a115?w=800&h=600&fit=crop'],
    priceUsd: 265,
    stockStatus: 'pre_order',
    leadTimeDays: 10,
    categoryAnswers: {
      q_sehpa_tabla: '100 x 50 cm temperli cam',
      q_sehpa_raf: '—',
      q_sehpa_ayak: 'Krom metal çerçeve',
      q_sehpa_yukseklik: '45 cm',
    },
  },
  {
    id: 13,
    name: 'Baza Seti Komodin Dahil',
    categoryId: 4,
    description:
      'Yatak odası için tam set: döşemeli başlık, baza gövdesi ve eşleşen komodin. Ortopedik yatak ile uyumlu 160x200 cm ebat; başlık yüksekliği ayarlanabilir.\n\nGri kadife kumaş yumuşak dokuludur; leke tutmaz finish uygulanmıştır. Baza altında hafif depolama alanı bulunur.\n\nSet halinde %8 indirim avantajı sunulur. Montaj ve yatak odasına yerleştirme hizmeti talep edilebilir.',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&h=600&fit=crop',
    ],
    priceUsd: 749,
    stockStatus: 'pre_order',
    leadTimeDays: 18,
    categoryAnswers: {
      q_yatak_ebat: '160 x 200 cm',
      q_yatak_malzeme: 'Gri kadife başlık, laminat gövde',
      q_yatak_dep: 'Baza altı hafif depolama',
      q_yatak_set: 'Başlık + baza + 1 komodin',
    },
  },
  {
    id: 14,
    name: 'Komodin Tek Çekmece',
    categoryId: 4,
    description:
      'Yatak başı için kompakt komodin; gece lambası, kitap ve telefon için üst tabla yeterli genişlik sunar. Tek çekmeceli gövde soft-close mekanizmalıdır.\n\nCeviz kapak ve gövde uyumu klasik bir yatak odası estetiği yaratır. Metal kulplar mat siyah finishlidir.\n\nBaza seti ile aynı seriden üretilir; şifonyer ile tam takım oluşturulabilir.',
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=600&fit=crop'],
    priceUsd: 185,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_yatak_ebat: '50 x 40 x 48 cm',
      q_yatak_malzeme: 'Ceviz laminat',
      q_yatak_dep: '1 çekmece',
      q_yatak_set: 'Tekil komodin',
    },
  },
  {
    id: 15,
    name: 'Sürgülü Gardırop 240 cm',
    categoryId: 5,
    description:
      '240 cm yüksekliğinde tam boy gardırop; sürgülü aynalı kapaklar odayı ferah gösterir. İç düzen: çift askılık, dört raf ve alt çekmece bölmesi.\n\nSuntalam beyaz gövde nem ve güneşe karşı dayanıklı kaplamalıdır. Soft-close sürgü rayları sessiz hareket eder.\n\nÖlçü keşfi ve profesyonel montaj önerilir. İç modül (kemerlik, pantolon askısı) özelleştirilebilir.',
    images: [
      'https://images.unsplash.com/photo-1595428774220-17a58b32ab47?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    ],
    priceUsd: 1100,
    stockStatus: 'pre_order',
    leadTimeDays: 35,
    categoryAnswers: {
      q_dep_ic: '2 askılık + 4 raf + alt çekmece',
      q_dep_malzeme: '16 mm suntalam, beyaz',
      q_dep_kapak: 'Sürgülü aynalı',
      q_dep_olcu: '240 x 180 x 60 cm',
    },
  },
  {
    id: 16,
    name: 'Şifonyer 6 Çekmece',
    categoryId: 5,
    description:
      'Geniş depolama sunan altı çekmeceli şifonyer; çorap, aksesuar ve mevsimlik tekstiller için idealdir. Üst yüzey dekor ve ayna alanı olarak kullanılabilir.\n\nMDF gövde stabil ve hafiftir; çekmece rayları tam açılım özellikli. Mat beyaz ve ceviz renk seçenekleri vardır.\n\nÇocuk odası ve misafir odası için de uygundur. Duvara sabitleme aparatı pakete dahildir.',
    images: ['https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&h=600&fit=crop'],
    priceUsd: 425,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_dep_ic: '6 eşit çekmece',
      q_dep_malzeme: 'MDF, mat beyaz',
      q_dep_kapak: 'Çekmece ön panel',
      q_dep_olcu: '120 x 45 x 95 cm',
    },
  },
  {
    id: 17,
    name: 'Lambader Tripod',
    categoryId: 6,
    description:
      'Tripod ayaklı zemin lambaderi; okuma köşesi ve salon köşelerinde yumuşak ambient ışık sağlar. Keten abajur ışığı dağıtır ve göz yormaz.\n\n9W LED ampul (3000K sıcak beyaz) pakete dahildir; dimmer uyumlu dimmer satın alınabilir. Kablo uzunluğu priz mesafesine uygundur.\n\nAynı seride masa lambası mevcuttur. Abajur kumaşı toz aldığında düşük devirde vakumlanabilir.',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop'],
    priceUsd: 89,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_aydin_w: '9W LED, 3000K (dahil)',
      q_aydin_mont: 'Zemin / tripod',
      q_aydin_dim: 'Dimmer uyumlu (ayrı satılır)',
      q_aydin_ip: 'IP20 (iç mekân)',
    },
  },
  {
    id: 18,
    name: 'Modern Avize 3 Kollu',
    categoryId: 6,
    description:
      'Yemek masası ve oturma odası için üç kollu tavan avizesi. Buzlu cam küreler ışığı yumuşatır; bronz finish gövde sıcak bir metalik ton katar.\n\nG9 duy tipi ampul (3×4W LED önerilir). Tavan yüksekliği 2,4 m ve üzeri için idealdir; zincir uzunluğu ayarlanabilir.\n\nElektrik bağlantısı yetkili teknisyen tarafından yapılmalıdır. 5 kollu geniş model aynı seride mevcuttur.',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524484485831-a97ca0aa77be?w=800&h=600&fit=crop',
    ],
    priceUsd: 210,
    stockStatus: 'pre_order',
    leadTimeDays: 12,
    categoryAnswers: {
      q_aydin_w: '3× G9 (4W LED önerilir)',
      q_aydin_mont: 'Tavan, ayarlı zincir',
      q_aydin_dim: 'Duvar dimmer ile uyumlu',
      q_aydin_ip: 'IP20',
    },
  },
  {
    id: 19,
    name: 'Bench Oturak',
    categoryId: 1,
    description:
      'Çok amaçlı bench; yatak ucunda, antrede ve yemek masası yanlarında kullanılır. Keten döşeme nefes alır; ahşap ayaklar doğal tonludur.\n\n120 cm uzunluk iki kişinin yan yana oturmasına olanak tanır. Alt bölümde sepet veya ayakkabılık için boşluk bırakılmıştır.\n\nÖzel kumaş ve ölçü siparişi alınır. Duvara sabitleme opsiyoneldir.',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'],
    priceUsd: 165,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '120 x 40 x 45 cm',
      q_mob_malzeme: 'Keten döşeme, meşe ayak',
      q_mob_renk: 'Bej keten / doğal meşe',
      q_mob_bakim: 'Vakumlama; leke için hızlı müdahale',
    },
  },
  {
    id: 20,
    name: 'Dosya Dolabı Metal',
    categoryId: 2,
    description:
      'A4 klasör ve evrak arşivi için dört çekmeceli metal dosya dolabı. Üst çekmece kilitli; ofis belgeleri ve kişisel evraklar için güvenli saklama.\n\nTam açılım çekmece rayları dosyalara kolay erişim sağlar. Antrasit toz boya yüzey profesyonel görünüm sunar.\n\nTekerlekli versiyon ayrı kod ile sipariş edilir. Kurumsal alımlarda etiket tutucu ve iç bölücü hediyelidir.',
    images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop'],
    priceUsd: 298,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_ofis_ergo: 'Ergonomik çekmece yüksekliği',
      q_ofis_garanti: '2 yıl',
      q_ofis_kapasite: 'Çekmece başına ~25 kg',
      q_ofis_kablo: '—',
    },
  },
  {
    id: 21,
    name: 'Berjer Tekli Koltuk',
    categoryId: 1,
    description:
      'Salon ve otel lobileri için şık tekli berjer. Derin oturum ve yüksek sırt desteği uzun okuma seanslarında konfor sağlar.\n\nKadife kaplama lüks bir dokunuş sunar; ahşap ayaklar ceviz tonundadır. Yan sehpa ve lambader ile köşe seti oluşturulabilir.\n\n40’tan fazla kumaş rengi kartelden seçilebilir. Stok kumaşlar hızlı teslim, özel kumaş 3–4 hafta termin.',
    images: [
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551298370-9d6d1d6291c6?w=800&h=600&fit=crop',
    ],
    priceUsd: 520,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_mob_olcu: '78 x 82 x 95 cm',
      q_mob_malzeme: 'Kadife, ceviz ayak',
      q_mob_renk: 'Zeytin yeşili (kartel)',
      q_mob_bakim: 'Profesyonel kuru temizlik önerilir',
    },
  },
  {
    id: 22,
    name: 'Çalışma Lambası LED',
    categoryId: 6,
    description:
      'Masa üstü LED çalışma lambası; ayarlanabilir kol ve başlık ile ışığı tam ihtiyaç noktasına yönlendirir. 5W–12W arası parlaklık kademesi dokunmatik panelden ayarlanır.\n\n4000K nötr beyaz ışık odaklanmayı destekler; gece modu 2700K sıcak tona geçer. USB şarj çıkışı telefon ve tablet için pratiktir.\n\nKompakt taban masa kenarına sığar. 2 yıl LED modül garantisi.',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop'],
    priceUsd: 72,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_aydin_w: '5–12W LED, 4000K / 2700K',
      q_aydin_mont: 'Masa üstü',
      q_aydin_dim: 'Dahili kademeli dim',
      q_aydin_ip: 'IP20',
    },
  },
  {
    id: 23,
    name: 'Yemek Odası Büfe',
    categoryId: 1,
    description:
      'Yemek odası ve salon için geniş büfe ünitesi; üst vitrin cam kapaklı, alt kısımda kapalı depolama. İç LED aydınlatma (opsiyonel) koleksiyon objelerini sergiler.\n\nCeviz ve antrasit kombinasyonu modern-klasik bir çizgi sunar. Soft-close kapaklar ve çekmeceler standarttır.\n\nŞarap bölmesi ve içecek hazırlık tezgahı modülü eklenebilir. Ölçü keşfi ücretsizdir.',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&h=600&fit=crop',
    ],
    priceUsd: 1180,
    stockStatus: 'pre_order',
    leadTimeDays: 28,
    categoryAnswers: {
      q_mob_olcu: '200 x 45 x 90 cm',
      q_mob_malzeme: 'MDF + cam vitrin',
      q_mob_renk: 'Ceviz / antrasit',
      q_mob_bakim: 'Cam yüzey cam temizleyici ile',
    },
  },
  {
    id: 24,
    name: 'Köşe Gardırop Modülü',
    categoryId: 5,
    description:
      'Küçük yatak odaları için köşe tipi gardırop; L formunda iç köşeyi verimli kullanır. Sürgülü kapaklar dar alanlarda açılım kolaylığı sağlar.\n\nİç modül: tek askılık, üç raf ve üst bölme. Beyaz melamin yüzey ferah bir görünüm verir.\n\nDuvar düzleştirme ve montaj hizmeti talep edilebilir. Aynı seride komodin ve şifonyer ile set indirimi uygulanır.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'],
    priceUsd: 890,
    stockStatus: 'pre_order',
    leadTimeDays: 25,
    categoryAnswers: {
      q_dep_ic: '1 askılık + 3 raf + üst bölme',
      q_dep_malzeme: 'Melamin beyaz',
      q_dep_kapak: 'Sürgülü',
      q_dep_olcu: '120 x 120 x 220 cm (köşe)',
    },
  },
  {
    id: 25,
    name: 'Puf Yuvarlak',
    categoryId: 3,
    description:
      'Dekoratif yuvarlak puf; salon, çocuk odası ve giyinme odasında oturma ve ayak dayama için kullanılır. Çıkarılabilir kılıf makinede yıkanabilir (30°C).\n\nİç dolgu yüksek rebound süngerdir; formunu uzun süre korur. Ø 55 cm kompakt boyut küçük mekânlara uyar.\n\nKanepe ve berjer ile renk uyumu için kartelden seçim yapılır. Hızlı kargo ile stoktan gönderilir.',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'],
    priceUsd: 95,
    stockStatus: 'in_stock',
    leadTimeDays: null,
    categoryAnswers: {
      q_sehpa_tabla: 'Ø 55 cm (oturma)',
      q_sehpa_raf: '—',
      q_sehpa_ayak: 'Döşemeli, ayaksız',
      q_sehpa_yukseklik: '40 cm',
    },
  },
]

export const defaultProducts: CatalogProduct[] = enrichProducts([...baseProducts, ...extraProducts])
