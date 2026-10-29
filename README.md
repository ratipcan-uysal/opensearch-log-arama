# OpenSearch'te log arama

Doğru sorgu, güvenilir sonuç. Geliştirici, QA ve operasyon ekipleri için 26 slaytlık (16 ana slayt + 10 ek) Türkçe sunum.

[**PDF’yi aç**](opensearch-log-arama.pdf) · [**PowerPoint’i indir**](opensearch-log-arama.pptx)

16 ana slayt ve 10 ekte normal arama kalıpları, DSL/PPL kullanım yerleri, API üzerinden LLM ile agentic search ve 31 kaynak aynı dosyada yer alır.

## İçerik

- Olay inceleme akışı ve zaman kapsamı
- `text` / `keyword` ve DQL / Lucene / PPL / Query DSL ayrımı
- Kopyalanabilir arama ve gruplama örnekleri
- Hata sayısı, hata oranı ve sonuç tamlığı
- Arama maliyeti, PIT, shard planı ve ISM
- Ingest hataları, slow logs ve hassas alanlar
- DSL/PPL arayüzleri ve API çağrıları
- Normal arama kalıpları ve LLM ile agentic search seçenekleri

Ana anlatı, sorgu rehberi, API/agent örnekleri, teknik sınırlar ve kaynakça aynı sunumun içindedir. PDF, sunumla aynı sayfa sırasını izler. Diğer kaynak dosyaları yalnız yeniden üretim/GitHub içindir.

## Dosyalar

- [opensearch-log-arama.pptx](opensearch-log-arama.pptx): düzenlenebilir sunum ve kaynaklı konuşmacı notları
- [opensearch-log-arama.pdf](opensearch-log-arama.pdf): aynı slaytların PDF sürümü
- [SPEAKER_NOTES.md](SPEAKER_NOTES.md): anlatım ayrıntıları ve sınırlar
- [SOURCES.md](SOURCES.md): 31 resmî kaynak ve hangi iddiaları destekledikleri
- [examples/README.md](examples/README.md): sentetik veriler ve sorgu laboratuvarı
- `src/`: slayt içeriği, kaynak kayıtları ve üretim kodu

Araştırma tarihi: **29 Ekim 2026**. Temel yaklaşım açık kaynak OpenSearch içindir. AWS önerileri ayrıca etiketlenmiştir. `latest` belgeleri, arayüzler ve PPL desteği değişebilir. Hedef cluster sürümü belirtilmediğinden örnekleri kendi sürümünde doğrula.

## Doğrulama sınırı

Sorgular gerçek OpenSearch cluster'ında çalıştırılmadı. Statik kontrol, JSON/NDJSON biçimi, mapping türleri ve sentetik veri hesaplarını kapsar. Performans ölçümü veya üretim ortamı testi iddiası yoktur.

PPTX paket/yerleşim ve yeniden içe aktarma kontrolleri geçti. 26 slaytlık nihai PDF'nin tüm sayfaları görsel olarak incelendi. PDF içerik sayfalarındaki kaynak bağlantıları korundu. Microsoft PowerPoint uygulamasında açılış testi yapılmadı.

## Kaynak dosyalarıyla yeniden üretim

`src/build.mjs`, Codex'in paketli Node çalışma ortamındaki `@oai/artifact-tool` modülünü kullanır. Bu modül genel bir npm kurulum varsayımı değildir. Uygun çalışma ortamında `node src/build.mjs <taslak-dizini> A` veya `B`, slayt PNG'lerini ve taslak PPTX'i üretir. Ardından sunum becerisinin finalizer kontrolünü çalıştır ve doğrulanan PPTX'i PDF'ye dönüştür. Düzenleme için kaynak JSON'ları veya PPTX kullanılabilir.

## Kapsam ve lisans

Örnekler sentetik veridir; gerçek log, endpoint, kimlik bilgisi veya müşteri verisi içermez.

Bu repoya henüz bir açık kaynak lisansı eklenmemiştir. Bağlantılı belgeler kendi yayıncılarına aittir.
