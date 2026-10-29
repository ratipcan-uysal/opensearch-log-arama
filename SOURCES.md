# Kaynaklar ve iddia sınırları

Araştırma tarihi: 29 Ekim 2026. Resmî OpenSearch, AWS ve OpenTelemetry belgeleri. `latest` bağlantıları zamanla değişebilir. Hedef cluster sürümü paylaşılmadı.

## S01 — Discover ve sorgu araçları

[Discover ve sorgu araçları](https://docs.opensearch.org/latest/dashboards/discover/index/)

DQL/Lucene, Query Workbench ve Dev Tools ayrımı.

## S02 — DQL başvuru belgesi

[DQL başvuru belgesi](https://docs.opensearch.org/latest/dashboards/dql/)

Alan türü, phrase, exists, NOT ve sayısal aralık semantiği.

## S03 — Term query

[Term query](https://docs.opensearch.org/latest/query-dsl/term/term/)

Exact term araması ve text alanlarında term kullanımının riski.

## S04 — Match phrase query

[Match phrase query](https://docs.opensearch.org/latest/query-dsl/full-text/match-phrase/)

Sıralı terim eşleşmesi ve analizör etkisi.

## S05 — Boolean query

[Boolean query](https://docs.opensearch.org/latest/query-dsl/compound/bool/)

filter skor üretmez. must/filter varken should varsayılan olarak zorunlu değildir.

## S06 — PPL stats

[PPL stats](https://docs.opensearch.org/latest/sql-and-ppl/ppl/commands/stats/)

Gruplama, span ve yüksek kardinalitede yaklaşık sonuç olasılığı.

## S07 — PPL where

[PPL where](https://docs.opensearch.org/latest/sql-and-ppl/ppl/commands/where/)

Boolean koşullarla filtreleme.

## S08 — Search API

[Search API](https://docs.opensearch.org/latest/api-reference/search/)

size, _source, timed_out, _shards ve track_total_hits.

## S09 — Terms aggregation

[Terms aggregation](https://docs.opensearch.org/latest/aggregations/bucket/terms/)

Top-N kapsamı ve sayı doğruluğu göstergeleri.

## S10 — Wildcard query

[Wildcard query](https://docs.opensearch.org/latest/query-dsl/term/wildcard/)

Baştaki wildcard maliyeti.

## S11 — Point in Time

[Point in Time](https://docs.opensearch.org/latest/search-plugins/searching-data/point-in-time/)

PIT + search_after, sabit veri görünümü ve segment tutma maliyeti.

## S12 — Mapping explosion

[Mapping explosion](https://docs.opensearch.org/latest/mappings/mapping-explosion/)

Kontrolsüz dinamik alanların maliyeti ve açık mapping yaklaşımı.

## S13 — Data streams

[Data streams](https://docs.opensearch.org/latest/opensearch/data-streams/)

Zaman alanı zorunluluğu, backing index ve rollover.

## S14 — ISM supported operations

[ISM supported operations](https://docs.opensearch.org/latest/im-plugin/ism/policies-operations/)

min_primary_shard_size, min_size, periyodik kontroller ve koşullar.

## S15 — Amazon OpenSearch Service best practices

[Amazon OpenSearch Service best practices](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/bp.html)

Log iş yüklerinde 30–50 GiB shard başlangıç rehberi ve iş yüküyle doğrulama gereği.

## S16 — OpenSearch logs ve slow logs

[OpenSearch logs ve slow logs](https://docs.opensearch.org/latest/install-and-configure/configuring-opensearch/logs/)

Request ve shard slow log ayrımı. Bulk mapping hataları için öğe yanıtı kontrolü.

## S17 — Profile API

[Profile API](https://docs.opensearch.org/latest/api-reference/search-apis/profile/)

Profiling ek yük getirir. Ağ ve kuyruk süresini ölçmez.

## S18 — Data Prepper obfuscate

[Data Prepper obfuscate](https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/obfuscate/)

target verilirse orijinal alan değişmeden kalır. İndeks öncesi maskeleme.

## S19 — OpenTelemetry Logs Data Model

[OpenTelemetry Logs Data Model](https://opentelemetry.io/docs/specs/otel/logs/data-model/)

Olay zamanı ile gözlem zamanı ve trace bağlamı ayrımı.

## S20 — SQL/PPL veri türleri

[SQL/PPL veri türleri](https://docs.opensearch.org/latest/sql-and-ppl/datatypes/)

Timestamp ve oturum zaman dilimi.

## S21 — SQL/PPL ortak fonksiyonları

[SQL/PPL ortak fonksiyonları](https://docs.opensearch.org/latest/sql-and-ppl/functions/)

timestamp() tarih dönüşümü.

## S22 — Field masking

[Field masking](https://docs.opensearch.org/latest/security/access-control/field-masking/)

Rol bazlı maskeleme, arama kısıtları ve indeks sonrası uygulama.

## S23 — SQL ve PPL API

[SQL ve PPL API](https://docs.opensearch.org/latest/sql-and-ppl/sql-and-ppl-api/index/)

PPL endpoint, query gövdesi ve Explain API.

## S24 — Query Workbench

[Query Workbench](https://docs.opensearch.org/latest/dashboards/query-workbench/)

OpenSearch Plugins > Query Workbench > PPL menü yolu.

## S25 — Discover Logs

[Discover Logs](https://docs.opensearch.org/latest/observing-your-data/exploring-observability-data/discover-logs/)

3.5 ile gelen PPL log ekranı, workspace ve feature flag gereksinimleri.

## S26 — Agentic query

[Agentic query](https://docs.opensearch.org/latest/query-dsl/specialized/agentic/)

3.2 ile eklenen agentic query, query_text, query_fields ve önkoşullar.

## S27 — Agentic search kurulumu

[Agentic search kurulumu](https://docs.opensearch.org/latest/vector-search/ai-search/agentic-search/index/)

Model, agent ve search pipeline üzerinden yerleşik agentic arama.

## S28 — QueryPlanningTool

[QueryPlanningTool](https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/query-planning-tool/)

Şablon kullanımı, DSL üretimi ve varsayılan match_all fallback davranışı.

## S29 — PPLTool

[PPLTool](https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/ppl-tool/)

2.13 ile eklenen doğal dil/PPL dönüşümü. execute:false sadece sorgu döndürür.

## S30 — SQL/PPL settings

[SQL/PPL settings](https://docs.opensearch.org/latest/sql-and-ppl/settings/)

PPL eklentisi, enable ayarı ve gövdedeki indeks erişimi.

## S31 — OWASP LLM Prompt Injection Prevention

[OWASP LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

Araç yetkisi ve argüman doğrulamasının model dışında uygulanması.

## Sentez ve sınırlamalar

- İnceleme sırası, runbook ve ölçüm önerileri bu çalışma için hazırlanmış pratik sentezdir. Ürünün zorunlu iş akışı değildir.
- Sayısal hata oranı örneği tamamen sentetiktir. Bir performans benchmarkı veya üretim bulgusu içermez.
- 30–50 GiB, AWS log iş yükü rehberidir. Açık kaynak OpenSearch için evrensel optimum olarak genellenmez.
- Örnek alan adları eğitim şemasıdır. OpenTelemetry/ECS alan adları veya varsayılan mapping oldukları iddia edilmez.
- DQL, Lucene, PPL ve DSL farklı yüzeylerdir. Yeni Discover ekranları ile klasik Dashboards farklılaşabilir.
- Request slow logs 2.12 ile eklenmiştir. PPL komut desteği, motor ve eklenti sürümüyle değişebilir.
- Kaynak doğrulaması ve JSON/fixture kontrolleri, gerçek cluster çalıştırma testi değildir.
- Bulk HTTP başarısı, bütün öğelerin indekslendiğini göstermez. Arama HTTP başarısı da tam sonuç garantisi değildir.

- Agentic API örnekleri kurulum taslağıdır. Model bağlantısı, agent kaydı veya gerçek LLM çağrısı yapılmadı. Uygulama agentı ve kontrol kapıları bu çalışma için önerilen mimaridir.
- Native agentic query 3.2, PPLTool 2.13, yeni Discover Logs yüzeyi 3.5 ile eklenmiştir. Dağıtım ve eklenti desteği ayrıca doğrulanmalıdır.
