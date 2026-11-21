# WearSahin

Gençler için sokak stili giyim mağazası. Ödemeler Shopier üzerinden alınır.

## Ürün ekleme / düzenleme
1. `https://<site-adresi>/admin/` adresine git.
2. **Sign In with Token** ile GitHub erişim anahtarınla giriş yap (sadece ilk seferde).
3. **Ürünler → Yeni Ürün**: adını, fiyatını, fotoğraflarını, bedenlerini ve Shopier linkini gir → **Kaydet**.
4. Yaklaşık 1–2 dakika sonra ürün sitede görünür.

## Klasörler
- `_data/urunler/` — her ürün bir dosya (panel yönetir)
- `_data/ayarlar.json` — mağaza ayarları, SSS, sosyal medya linkleri
- `sayfalar/` — yasal metinler
- `images/urunler/` — yüklenen fotoğraflar
- `index.html`, `app.js` — vitrin tasarımı
- `admin/` — yönetim paneli (Sveltia CMS)
