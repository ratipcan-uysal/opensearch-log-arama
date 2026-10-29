# Sorgu laboratuvarı

Bu örnekler eğitim içindir. Alan adları bu paketteki mapping'e aittir. Canlı OpenSearch üzerinde çalıştırma doğrulaması yapılmadı. Yazma adımlarını yalnızca yetkili bir test ortamında uygula.

## 1. Test indeksi ve veri

`logs_demo` adının mevcut bir kullanıcı indeksine ait olmadığını kontrol et. Mevcut indeksi silme veya üzerine yazma. Başka ad seçersen tüm örneklerde aynı adı kullan.

Dev Tools veya yetkili HTTP istemcisiyle:

1. `PUT /logs_demo` gövdesi: [mapping.json](mapping.json).
2. `POST /logs_demo/_bulk?refresh=wait_for` gövdesi: [bulk.ndjson](bulk.ndjson), içerik türü `application/x-ndjson`.
3. Bulk yanıtında `errors:false` ve bütün öğelerin başarılı olduğunu doğrula. Aynı fixture yeniden gönderilirse `create` eylemleri çakışma verir. Bunu sessizce başarı sayma.

Mapping'de `dynamic:strict`, bilinmeyen alanları reddeder. Bu bir eğitim tercihidir. Üretim pipeline'ında şema değişikliği, hata gözlemi ve karantina akışı tasarlanmalıdır. Shard ve replica ayarları bu örnekte üretim önerisi olarak belirlenmedi.

## 2. Query DSL

- `POST /logs_demo/_search` gövdesi: [search.json](search.json).
- Beklenen olay kimlikleri, azalan zamanla: `evt-011`, `evt-003`, `evt-002`.
- Zaman aralığı `[2026-10-29T10:00:00Z, 2026-10-29T10:15:00Z)`.
- `evt-008`, tam üst sınırda olduğu için dışarıda kalır.
- `track_total_hits:false` nedeniyle yanıt toplam eşleşme sayısını sunmaz. Bu bir hata değildir.

## 3. DQL

Discover'da bu indeksi seç, zaman alanını `@timestamp` yap ve yukarıdaki mutlak UTC aralığını uygula. Arama çubuğunun DQL kullandığını doğrula.

```text
service_name: "checkout" and environment: "prod"
and status_code >= 500 and status_code < 600
```

Bağlam filtresi ve zaman aralığı aynı kalırken:

```text
status_code:* and not status_code: 200
```

Beklenen dört kayıt: `evt-002`, `evt-003`, `evt-009`, `evt-011`. Bu sorgu 404'ü de getirir. `status_code:*` kaldırılırsa eksik alanlı `evt-005` ve `evt-012` de kapsama girer.

```text
message: "connection timeout"
```

Bu phrase araması `text` analizörüne bağlıdır. Ham metnin byte düzeyinde eşitliğini garanti etmez. Örnekte `service_name` doğrudan keyword'dür; `.keyword` alt alanı yoktur.

## 4. PPL

[errors-by-service.ppl](errors-by-service.ppl) dosyasını PPL destekli Query Workbench'te çalıştır veya `POST /_plugins/_ppl` gövdesi olarak [ppl-request.json](ppl-request.json) kullan.

UTC oturumu varsayılır. PPL motor/eklenti sürümünü ve tarih dönüşüm davranışını doğrula. Beklenen sonuç: `checkout:3`, `catalog:1`.

Dakikalık seri için son iki adımın yerine:

```text
| stats count() as errors by span(`@timestamp`, 1m), service_name
```

API çağrısı, Dashboards zaman seçicisini otomatik olarak devralmaz. Sorguda açık tarih sınırlarını koru.

## 5. Pay ve payda

`POST /logs_demo/_search` gövdesi: [error-rate.json](error-rate.json).

Bu fixture'da `checkout`, `prod`, seçilen pencere ve `event_kind=request_completed` için:

- Payda: `hits.total.value = 7`, `relation = eq`.
- Pay: `aggregations.server_errors.doc_count = 3`.
- Oran: `3 / 7 × 100 ≈ %42,86`.

Bu küçük fixture, slayt 9'daki ayrı sentetik karşılaştırma tablosu değildir. Örnek birimler tamamlanan istek kayıtlarıdır. Her gerçek istek için tek terminal kayıt yoksa bu hesabı kullanıcı isteği hata oranı olarak sunma. Retry, duplicate, sampling, eksik log ve hiç tamamlanmayan istekler ayrıca ele alınmalıdır.

## 6. Sonuç kabulü

`timed_out:false`, `_shards.failed:0` ve varsa `terminated_early` kontrolü olmadan tamlık iddiasında bulunma. Boş sonuçta önce indeks, zaman alanı, saat dilimi, mapping, yetki ve ingest akışını kontrol et.

Bu paket ISM policy uygulamaz, veri silmez ve üretim cluster ayarını değiştirmez. PIT kullanırsan bitince yalnızca oluşturduğun PIT kimliğini kapat.

## Yerel statik kontrol

```bash
python3 validate_examples.py
```

Bu kontrol JSON/NDJSON yapısını, mapping tür uyumunu, sorgu kapsamını ve beklenen fixture hesaplarını doğrular. OpenSearch sorgu motorunun yerini tutmaz.
