# Konuşmacı notları

## 01. OpenSearch’te log arama

Hedef kitle: log okuyan geliştirici, QA ve operasyon ekipleri. Temel HTTP/JSON bilgisi varsayılır. Örnekler sentetiktir. Açık kaynak OpenSearch temel alınır. Amazon OpenSearch Service önerileri ayrıca etiketlenir. Belgeler 29 Ekim 2026 tarihinde kontrol edilmiştir. Arayüz ve eklenti yetenekleri sürüme göre değişebilir.

[S01](https://docs.opensearch.org/latest/dashboards/discover/index/)

## 02. Bir olay incelemesinin ilk adımları

Önerilen çalışma sırasıdır, ürünün zorunlu akışı değildir. Önce dar bir pencere seç, ihtiyaç oldukça genişlet. Trace ile devam ederken ilk servisin filtresini kaldırmak gerekebilir. @timestamp burada olay zamanına eşlenmiştir. Gözlem zamanı ayrı tutulur, saat farkı ve gecikmiş teslim incelenir. Log korelasyonu tek başına kök neden kanıtı değildir.

[S01](https://docs.opensearch.org/latest/dashboards/discover/index/) [S19](https://opentelemetry.io/docs/specs/otel/logs/data-model/)

## 03. Alan türü, sorgunun anlamını değiştirir

Bu alan adları eğitim şemasıdır, OpenTelemetry veya ECS standardı olarak sunulmaz. Örnekte service_name doğrudan keyword türündedir; service_name.keyword yoktur. term analiz edilmiş message üzerinde beklenmedik sonuç verebilir. match_phrase analizörün ürettiği terim sırasını arar, ham metnin byte düzeyinde eşitliği anlamına gelmez. Sık kullanılan alanları açıkça tanımlamak kontrolsüz alan artışını önlemeye yardım eder. strict mapping bilinmeyen alanları reddeder; bu nedenle hatalı kayıt takibi gerekir.

[S03](https://docs.opensearch.org/latest/query-dsl/term/term/) [S04](https://docs.opensearch.org/latest/query-dsl/full-text/match-phrase/) [S12](https://docs.opensearch.org/latest/mappings/mapping-explosion/)

## 04. DSL ve PPL nereden çalıştırılır?

Query DSL: OpenSearch Dashboards içindeki Dev Tools konsolunda HTTP metodu, yol ve JSON gövdesiyle kullanılır. Aynı Search API curl, Postman veya bir uygulamanın OpenSearch istemcisinden çağrılabilir. PPL: klasik menüde OpenSearch Plugins > Query Workbench > PPL, ardından Run. Dev Tools içinden de POST /_plugins/_ppl endpointine JSON gövde gönderilebilir. SQL/PPL eklentisi ve PPL desteğinin açık olması gerekir. OpenSearch 3.5 ile gelen yeni Observability workspace içindeki Discover > Logs ekranı PPL kullanır; gerekli feature flag, workspace ve dataset yapılandırması kontrol edilir. Klasik Discover arama çubuğundaki DQL/Lucene ile Query DSL JSON aynı şey değildir. PPL API örneği küçük eğitim indeksini gösterir; gerçek log incelemesinde zaman ve ortam filtresi gerekir. Kimlik doğrulama dağıtıma bağlıdır; yönetilen AWS domaininde IAM kullanılıyorsa SigV4 imzası gerekir. API anahtarını prompt veya repo içine koyma.

[S01](https://docs.opensearch.org/latest/dashboards/discover/index/) [S08](https://docs.opensearch.org/latest/api-reference/search/) [S23](https://docs.opensearch.org/latest/sql-and-ppl/sql-and-ppl-api/index/) [S24](https://docs.opensearch.org/latest/dashboards/query-workbench/) [S25](https://docs.opensearch.org/latest/observing-your-data/exploring-observability-data/discover-logs/) [S30](https://docs.opensearch.org/latest/sql-and-ppl/settings/)

## 05. DQL: 5xx ve eksik alan tuzağı

Discover zaman aralığı: 29 Ekim 2026 10:00 dahil, 10:15 hariç UTC. Sorgunun metni UI zaman filtresini içermez; paylaşırken ikisini birlikte kaydet. İlk sorgu HTTP 5xx aralığını sınırlar. İkinci sorgu alanı bulunan ve 200 olmayan kayıtları seçer; 3xx/4xx de dahildir, dolayısıyla hata tanımı değildir. Yalnız not status_code:200 kullanılırsa alanı eksik kayıtlar da gelebilir. Phrase eşleşmesi message analizörüne bağlıdır.

[S02](https://docs.opensearch.org/latest/dashboards/dql/) [S04](https://docs.opensearch.org/latest/query-dsl/full-text/match-phrase/)

## 06. Günlük incelemede işe yarayan DQL kalıpları

Bunlar klasik Discover DQL arama çubuğu örnekleridir. duration_ms birimi bu eğitim şemasında milisaniyedir. message:connection and message:timeout iki terimi de arar; sıralarının bitişik olması gerekmez. message:"connection timeout" analizörle phrase eşleşmesi yapar. Tam kimlikleri keyword alanında ara. not trace_id:* indexed değeri eksik olayları bulur; boş string ile aynı şey değildir. Fixture bütün kayıtlarda trace_id içerdiğinden bu sorgunun boş dönmesi beklenir. Prefix check* mevcut keyword service_name için uygundur; baştaki *check* daha pahalı olabilir. Eklerde zaman aralığı, trace ID, alan varlığı, OR ve DSL should davranışına ilişkin ek kalıplar bulunur. Sorgular canlı motorda çalıştırılmadı.

[S02](https://docs.opensearch.org/latest/dashboards/dql/) [S03](https://docs.opensearch.org/latest/query-dsl/term/term/) [S04](https://docs.opensearch.org/latest/query-dsl/full-text/match-phrase/) [S10](https://docs.opensearch.org/latest/query-dsl/term/wildcard/)

## 07. Query DSL: sınırları görünür bir arama

filter belgeleri evet/hayır koşullarıyla eler ve relevance skoru üretmez. event_id örnekte benzersiz keyword olarak deterministik ikincil sıralama sağlar. _source seçimi dönen veriyi sınırlar; indeks taramasını otomatik olarak aynı oranda azaltacağı iddia edilmez. track_total_hits:false tam sayımı kapatır, hata oranı hesabında aynı ayar kullanılmaz. should ile alternatif koşullar zorunlu tutulacaksa minimum_should_match açıkça belirtilmelidir. examples/search.json aynı arama semantiğinin ek gösterim alanları içeren tam dosyasıdır.

[S05](https://docs.opensearch.org/latest/query-dsl/compound/bool/) [S08](https://docs.opensearch.org/latest/api-reference/search/)

## 08. PPL: hangi servis daha çok 5xx üretiyor?

Örnek oturumu UTC olarak varsayar. timestamp() dönüşümleri ve tarih karşılaştırmaları için hedef motor ve oturum zaman dilimi kontrol edilmelidir. UI zaman seçicisinin API çağrılarına otomatik taşındığı varsayılmaz, bu yüzden sorguda açık zaman sınırları vardır. stats gruplama yapar, sort azalan sayıya göre sıralar. Zaman serisi için stats count() as errors by span(`@timestamp`, 1m), service_name kullanılabilir. Yüksek kardinaliteli gruplamalarda PPL çevirisi ve kullanılan toplama stratejisi yaklaşık sonuç üretebilir. Sentetik örnek beklenen sonucu: checkout 3, catalog 1. Gerçek motor üzerinde çalıştırılmış test sonucu değildir.

[S06](https://docs.opensearch.org/latest/sql-and-ppl/ppl/commands/stats/) [S07](https://docs.opensearch.org/latest/sql-and-ppl/ppl/commands/where/) [S20](https://docs.opensearch.org/latest/sql-and-ppl/datatypes/) [S21](https://docs.opensearch.org/latest/sql-and-ppl/functions/)

## 09. Daha az hata, daha yüksek hata oranı

Tamamı sentetik aritmetik örnektir. 50/10000 = 0,005 ve 40/1000 = 0,04. Aynı servis, ortam ve eşit uzunluktaki zaman pencereleri varsayılır. Pay ve payda aynı tamamlanan istek evreninden üretilmelidir. Her istek için tek terminal kayıt gerekir. Retry, duplicate, sampling ve kayıp loglar oranı bozabilir. Üretim alarmında gecikme/SLO ve güvenilir istek metriğiyle birlikte değerlendirme önerilir. Tamamlanan istek oranı, hiç tamamlanmayan veya hiç loglanmayan istekleri kapsamaz. Top-N terms bütün dağılım değildir; hata sınırı ve dışarıda kalan belge sayısı ayrıca incelenir.

[S08](https://docs.opensearch.org/latest/api-reference/search/) [S09](https://docs.opensearch.org/latest/aggregations/bucket/terms/)

## 10. Arama maliyetini belirleyen seçimler

Bunlar ölçülecek hipotezlerdir, belirli bir hızlanma yüzdesi vaat edilmez. PIT sabit veri görünümü sağlar, açık kaldığı sürece segment ve kaynak tutar. from+size derin sayfalarda pahalıdır. time filtresi her shard temasını otomatik olarak ortadan kaldırmaz. Profile API yalnız teşhiste kullanılmalı, ek yükü vardır ve ağ/kuyruk gecikmesini ölçmez. Çok yüksek kardinaliteli trace_id için terms gruplaması yerine bilinen kimlikle arama çoğu incelemeye daha uygundur. Üretimde cache hit garantisi verilmez.

[S08](https://docs.opensearch.org/latest/api-reference/search/) [S10](https://docs.opensearch.org/latest/query-dsl/term/wildcard/) [S11](https://docs.opensearch.org/latest/search-plugins/searching-data/point-in-time/) [S17](https://docs.opensearch.org/latest/api-reference/search-apis/profile/)

## 11. Saklama ve shard planı

30–50 GiB önerisi Amazon OpenSearch Service belgesine aittir, evrensel optimum veya sabit limit olarak sunulmaz. Kurtarma süresi, node kaynakları ve arama yüküyle doğrulanmalıdır. Data stream zaman alanı gerektirir. ISM rollover içindeki min_size toplam primary depolamasını, min_primary_shard_size tek primary shardı değerlendirir. Doğrudan rollover koşulları OR ile birleşir. ISM periyodik kontrol yaptığı için eşik aşılabilir. Yeni any_of sözdizimi sürüme bağlı olduğundan örneğe dahil edilmemiştir. Retention yaşının indeks oluşturma/rollover olayına göre nasıl hesaplandığını hedef politikada incele, olay zamanı için belge başına tam TTL varsayma. Saklama süresi iş ihtiyacına göre belirlenir; 7/30 gün gibi keyfî üretim önerisi verilmez.

[S13](https://docs.opensearch.org/latest/opensearch/data-streams/) [S14](https://docs.opensearch.org/latest/im-plugin/ism/policies-operations/) [S15](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/bp.html)

## 12. Sonuca güvenmeden önce

HTTP 200 tek başına tüm arama shardlarının veya tüm Bulk öğelerinin başarı kanıtı değildir. Kayıp akış için ingest gecikmesi, parse hataları, reddedilen kayıtlar ve karantina/dead letter mekanizması gözlenir. Request slow logs OpenSearch 2.12 ile eklenmiştir, yönetilen dağıtım desteği kontrol edilir. Çok düşük slow log eşikleri disk ve performans maliyeti yaratır. Data Prepper obfuscate işleminde target orijinali korur. Temiz alanı yazarken ham alanı da göndermemek gerekir. Field masking indeks sonrasında uygulanır ve arama yeteneğini sınırlar; veri azaltmanın yerine geçmez. Bu sunum herhangi bir uyumluluk sertifikası iddia etmez.

[S08](https://docs.opensearch.org/latest/api-reference/search/) [S16](https://docs.opensearch.org/latest/install-and-configure/configuring-opensearch/logs/) [S18](https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/obfuscate/) [S22](https://docs.opensearch.org/latest/security/access-control/field-masking/)

## 13. LLM ile API üzerinden log incelemesi

İlk yol bir mimari öneridir: LLM servis/zaman/niyet parametrelerini çıkarır, backend izinli bir sorgu şablonunu oluşturur ve yürütür. Tam DSL üretimini açmak zorunlu değildir. Çok adımlı agent, ilk sorgunun sonucuna göre izinli araçlar arasında seçim yapar: servis bazında hata sayısı, önceki eşit pencereyle oran karşılaştırması, ardından bir trace_id için ilgili kayıtlar. Her aşamada sorgu ve kanıt kaydı tutulur. Tek doğal dil dönüşümü otomatik olarak çok adımlı inceleme veya kök neden tespiti sağlamaz. Yerleşik agentic query DSL üretir; PPLTool ayrı bir araçtır. PPLTool 2.13 ile eklendi ve execute varsayılanı true olduğu için yalnız üretim isteniyorsa false açıkça verilir. Model/connector ve desteklenen dağıtım gereklidir. Vector index bu örnekteki alan/aggregation araması için zorunlu değildir. LLM çağrısı gecikme ve model kullanım maliyeti ekler; başarı ve maliyet gerçek sorularla ölçülmelidir.

[S26](https://docs.opensearch.org/latest/query-dsl/specialized/agentic/) [S27](https://docs.opensearch.org/latest/vector-search/ai-search/agentic-search/index/) [S28](https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/query-planning-tool/) [S29](https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/ppl-tool/)

## 14. Yerleşik agentic search: API örneği

Agentic query OpenSearch 3.2 ile eklendi. Önce erişimi yapılandırılmış model/connector, QueryPlanningTool içeren agent ve agentic_query_translator request processor içeren search pipeline gerekir. Örnek pipeline adı logs-agentic varsayılmıştır, var olduğu veya burada oluşturulduğu iddia edilmez. Gövde examples/agentic/agentic-query.json dosyasındadır. query_text doğal dil niyetidir, service/environment/time sınırlarının güvenilir bir yürütücü tarafından uygulanmasının yerine geçmez. Yerleşik akış ürettiği DSL sorgusunu yürütür; istemcinin sonradan sonucu kontrol etmesi yürütme öncesi engelleme değildir. Üretilmiş sorguyu yürütmeden incelemek zorunluysa ayrı üretim/doğrulama/yürütme katmanı tercih edilir. Yönetilen servis özellikleri açık kaynak sürümüyle birebir eşleşmeyebilir. Modeli, agentı veya pipelineı bu çalışma kapsamında kurmadık.

[S26](https://docs.opensearch.org/latest/query-dsl/specialized/agentic/) [S27](https://docs.opensearch.org/latest/vector-search/ai-search/agentic-search/index/) [S28](https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/query-planning-tool/)

## 15. Agentın cevabını denetlenebilir kılan sınırlar

Bu satırlar önerilen uygulama kontrolleridir. Yetkilendirme ve query doğrulaması modelin dışındaki yürütücüde uygulanır. Log mesajları güvenilmeyen veri kabul edilir; içlerindeki talimatlar araç yetkisini genişletmez. Ham hassas loglar yerine gerekli alanlar ve özetler modele verilir. Büyük wildcard/regex, script, izinsiz indeks, zaman filtresi yokluğu ve pahalı aggregation için izinli sorgu şablonları veya parse edilmiş yapıda doğrulama kullanılır. Basit string regex filtresi güvenlik sınırı sayılmaz. QueryPlanningTool güncel belgede LLM geçerli JSON üretemediğinde size:10 match_all fallback döndürebilir ve hata fırlatmaz. fallback_query ile daha dar/match_none davranışı seçilebilir, ama boş sonucu veri yok diye sunmamak için uygulama ayrıca planlama başarısızlığını görünür kılmalıdır. Üretilmiş DSL/çalıştırma kaydı ve tanılama telemetrisi yoksa bu ayrımı garanti etme. Değerlendirme ölçütleri: doğru filtre/sayım, kanıta dayalı yanıt, red/boş sonuç ayrımı, toplam gecikme ve LLM maliyeti. Bu çalışma bir agent güvenlik veya canlı performans testi değildir.

[S08](https://docs.opensearch.org/latest/api-reference/search/) [S28](https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/query-planning-tool/) [S31](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

## 16. Ekibin kullanacağı küçük bir runbook

Bu runbook sunumun pratik önerisidir. Belgelere dayalı davranış ile ekibin operasyonel tercihini ayırır. Uygulama öncesinde hedef OpenSearch sürümü, dağıtım türü, SQL/PPL eklentisi ve mapping doğrulanır. Arama sorguları, sentetik fixture ve beklenen sonuçlar sunum eklerinde özetlenir. Örnekler canlı cluster üzerinde çalıştırılmamıştır. PDF üzerindeki kaynak bağlantıları ilgili resmî belgelere gider; tüm kaynakların kapsamı SOURCES.md dosyasındadır. Güncellemede normal arama kalıpları, DSL/PPL kullanım yüzeyleri ve LLM agentic arama seçenekleri eklendi.

[S01](https://docs.opensearch.org/latest/dashboards/discover/index/) [S08](https://docs.opensearch.org/latest/api-reference/search/) [S19](https://opentelemetry.io/docs/specs/otel/logs/data-model/)

## 17. Ek A · DQL arama rehberi

Bu reçeteleri servis, ortam ve uygun zaman filtresiyle birleştir. Göreli zamanı olay devrinde mutlak UTC aralığına çevir. HTTP 5xx için status_code < 600 üst sınırını da ekle. trace_id bu şemada keyword, message text türündedir. Bir timestamp aralığı için alt sınır gte, üst sınır lt kullanılması ardışık pencerelerin sınır kaydını iki kez saymasını önler. Aynı kelimelerin aynı kayıtta bulunması ile aynı sıradaki phrase eşleşmesi farklıdır. Eksik/null indexed değer ve boş string farklıdır. .* regex ifadesi DQL wildcard sözdizimi değildir. Lucene ve DSL ayrı yüzeylerdir.

[S02](https://docs.opensearch.org/latest/dashboards/dql/) [S03](https://docs.opensearch.org/latest/query-dsl/term/term/) [S04](https://docs.opensearch.org/latest/query-dsl/full-text/match-phrase/)

## 18. Ek B · DSL’de zorunlu alternatifler

Sorgu örneği canlı ortamda çalıştırılmadı. now-15m, çağrı anına göre değerlendirilir. Sentetik fixture eski kalırsa boş dönmesi normaldir; tekrar üretilebilir incelemede sabit UTC aralığı seç. Bu örnekte minimum_should_match:1 kaldırılırsa status_code şartları zorunlu olmaz. should bir sıralama tercihi de olabilir; bir filtre alternatifi olarak kullanılacaksa niyeti açıkça belirt. Kullanıcı farklı servisleri arıyorsa yetkili indeks, servis ve environment kapsamı ayrıca daraltılır.

[S05](https://docs.opensearch.org/latest/query-dsl/compound/bool/) [S08](https://docs.opensearch.org/latest/api-reference/search/)

## 19. Ek C · PPL ile zaman serisi ve trace inceleme

Kodlar sorgu parçalarıdır; tek başına çalıştırılacak tam sorgular değildir. Ana bölümdeki source=logs_demo ve açık UTC zaman sınırlarıyla birleştirilir. TRACE_ID gerçek bir yetkili kayıt kimliğiyle değiştirilir. Hata oranı için sadece error kayıtlarını saymak yeterli değildir, aynı istek evreninin tamamlanan istek sayısı gerekir. PPL sonuç sayıları özellikle yüksek kardinaliteli gruplamalarda motorun aggregation stratejisine bağlı yaklaşık olabilir. Süre ölçüsü kullanılıyorsa duration_ms birimi doğrulanır. Trace korelasyonu nedenselliği kanıtlamaz.

[S06](https://docs.opensearch.org/latest/sql-and-ppl/ppl/commands/stats/) [S07](https://docs.opensearch.org/latest/sql-and-ppl/ppl/commands/where/) [S19](https://opentelemetry.io/docs/specs/otel/logs/data-model/)

## 20. Ek D · API çağrıları ve yanıt kontrolü

curl -d POST isteği gönderir. Parolayı komut metnine sabit yazma; kimlik doğrulama ortamın politikasına göre seçilir. IAM kimlik doğrulamalı AWS domaini için SigV4 gerekir; bu Basic örneği o ortama doğrudan uygulanmaz. Uygulama kodu veya Postman da aynı endpointlere yetkili isteği gönderebilir. PPL için SQL/PPL plugin desteği açık olmalıdır. Küçük eğitim indeksi dışında head 20 tek başına kapsam kontrolü değildir, zaman ve servis filtreleri eklenir. DSL yanıtında HTTP durumuna ek olarak timed_out, _shards.failed ve gerekiyorsa hits.total.relation incelenir. PPL hata durumunu, şema ve dönen satır kapsamını ayrı kontrol et. _plugins/_ppl/_explain planı gösterir; Calcite motorunda çıktı her zaman yalnız saf DSL olmayabilir.

[S08](https://docs.opensearch.org/latest/api-reference/search/) [S23](https://docs.opensearch.org/latest/sql-and-ppl/sql-and-ppl-api/index/) [S30](https://docs.opensearch.org/latest/sql-and-ppl/settings/)

## 21. Ek E · Yerleşik agentic kurulum parçaları

Sol tarafta tam HTTP agent register gövdesi değil, tools bölümü gösterilir. Agent POST /_plugins/_ml/agents/_register ile kaydedilir. Flow agent içinde response_filter model sağlayıcısının gerçek yanıt biçimine göre ayarlanmalıdır. QueryPlanningTool generation_type:user_templates, izinli search template seçimleri için kullanılabilir. Sağ taraf search pipeline için tam JSON gövdesidir. match_none fallback kapsamı daraltır, ancak planlama başarısızlığını başarıyla bulunmuş sıfır kayıtla ayırmak için ek telemetri/durum gerekir. Güncel belgede fallback hata fırlatmayabilir. Native pipeline üretimi çalıştırmadan durduran bir uygulama kapısı değildir. Kesin ön doğrulama gereken işte dış yürütücü tasarlanmalıdır.

[S26](https://docs.opensearch.org/latest/query-dsl/specialized/agentic/) [S27](https://docs.opensearch.org/latest/vector-search/ai-search/agentic-search/index/) [S28](https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/query-planning-tool/)

## 22. Ek F · Agent için önerilen API sözleşmesi

Soldaki JSON önerilen bir uygulama sözleşmesidir, yerleşik OpenSearch endpoint gövdesi değildir. end_utc bu sözleşmede hariç üst sınırdır. Backend kimlikten dataset/alan izinlerini türetir ve zamanı, çıktıyı, aggregation maliyetini, araç sayısını ve toplam süreyi sınırlar. LLM bu sınırları arttıramaz. Sağdaki JSON agent tools alanına konan bir parçadır. Agent yürütme endpointi POST /_plugins/_ml/agents/AGENT_ID/_execute ve PPLTool için parametreler index ve question içerir. execute:false açıkça seçilir, çünkü varsayılan true olabilir. Log içeriğindeki talimatlar veri olarak kalır. Arama hatası, izin reddi, sıfır sonuç ve eksik veri için farklı durumlar dönülür. Yanıt kanıtla sınırlı olmalı, kök neden kanıtlanmadıysa hipotez olarak sunulmalıdır. Değerlendirme gerçek ekip sorularının beklenen filtre/sayımlarıyla yapılır. Gizli anahtarlar prompt ve kaynak koduna girmez.

[S23](https://docs.opensearch.org/latest/sql-and-ppl/sql-and-ppl-api/index/) [S28](https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/query-planning-tool/) [S29](https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/ppl-tool/) [S31](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

## 23. Ek G · Sonuçları yorumlarken teknik sınırlar

ISM doğrudan rollover koşulları OR ile birleşir. Kontroller periyodiktir, boyut eşiği aşılabilir. Saklama süresi iş gereksinimine göre seçilmelidir. QueryPlanningTool/PPLTool veya yeni Observability özelliklerinin bir yönetilen serviste varlığı, açık kaynak sürüm numarasından tek başına çıkarılmaz. Field masking indeks sonrasında uygulanır ve arama kısıtları vardır; veri azaltma yerine geçmez. Data Prepper target alanı orijinali koruyabilir. Replica yedekleme politikasının yerine geçmez.

[S09](https://docs.opensearch.org/latest/aggregations/bucket/terms/) [S11](https://docs.opensearch.org/latest/search-plugins/searching-data/point-in-time/) [S12](https://docs.opensearch.org/latest/mappings/mapping-explosion/) [S14](https://docs.opensearch.org/latest/im-plugin/ism/policies-operations/) [S17](https://docs.opensearch.org/latest/api-reference/search-apis/profile/) [S19](https://opentelemetry.io/docs/specs/otel/logs/data-model/)

## 24. Ek H · Örneklerin doğrulama kapsamı

Hedef sürüm, dağıtım ve kimlik doğrulama bilgisi verilmedi. Gerçek ortam kabulünde ayrı eğitim indeksinde sorgular çalıştırılmalı; izin, şema, boş sonuç ve timeout senaryoları doğrulanmalıdır. Ana oran tablosu 50/10000 ve 40/1000 hesabından oluşur, 8 kat değişim aritmetik olarak kontrol edilmiştir. Snapshot, device veya bir üretim ortamı doğrulaması iddia edilmez. Örnek agent/pipeline kurulumu yapılmadı. Sunumun kaynak kodu ve sentetik fixture ileride GitHub için saklanabilir; anlatıyı takip etmek için ayrı dosya zorunlu değildir.

[S08](https://docs.opensearch.org/latest/api-reference/search/)

## 25. Ek I · Kaynakça (1/2)

Araştırma: 29 Ekim 2026. Her başlık tıklanabilir özgün kaynak bağlantısıdır. latest belgeleri zamanla değişebilir. Sayısal örnekler, uygulama agentı mimarisi ve runbook bu çalışma için hazırlanmış sentezdir.



## 26. Ek I · Kaynakça (2/2)

Araştırma: 29 Ekim 2026. Her başlık tıklanabilir özgün kaynak bağlantısıdır. latest belgeleri zamanla değişebilir. Sayısal örnekler, uygulama agentı mimarisi ve runbook bu çalışma için hazırlanmış sentezdir.



