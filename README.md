# HAC Web - Product Catalog Roadmap

Tai lieu nay dung de ghi nho yeu cau xay dung he thong danh muc san pham cho website HAC. Khi tiep tuc phat trien, doc file nay truoc de tranh lam sai luong category -> brand -> product.

## Muc Tieu

Website HAC can co he thong danh muc san pham theo mo hinh web phan phoi thiet bi mang chuyen nghiep:

1. User bam vao danh muc chinh, vi du `Switch`, `Firewall`, `Wireless`, `Router`, `Module quang`, `Phu kien mang`.
2. Trang danh muc KHONG hien san pham ngay.
3. Trang danh muc hien grid logo cac hang thuoc danh muc do.
4. User bam logo hang thi moi vao trang san pham da loc theo ca `category` va `brand`.
5. Trang chi tiet san pham hien anh, gallery, mo ta, thong so ky thuat, datasheet va nut lien he.
6. San pham import moi phai o trang thai `draft`; frontend public chi hien `published`.

Vi du:

- `/switch` hien logo Cisco, HPE Aruba, Extreme, Ruijie, Huawei, Juniper...
- `/switch/cisco` chi hien san pham co `category = Switch` va `brand = Cisco`.
- Khong duoc hien Cisco Firewall hoac Cisco Wireless trong trang Switch Cisco.

## Route Frontend Mong Muon

Uu tien URL SEO ngan gon:

- `/:categorySlug`
  - Vi du: `/switch`, `/firewall`, `/wireless`
  - Hien logo hang theo danh muc.

- `/:categorySlug/:brandSlug`
  - Vi du: `/switch/cisco`, `/firewall/fortinet`
  - Hien san pham theo dung category + brand.

- `/product/:productSlug`
  - Hien chi tiet san pham.

Co the dung route ro hon neu can:

- `/category/:categorySlug`
- `/category/:categorySlug/:brandSlug`
- `/product/:productSlug`

## Database Can Co

Mo hinh du lieu mong muon:

1. `categories`
2. `brands`
3. `category_brands`
4. `products`
5. `product_images`
6. `product_specs`

Neu tiep tuc dung MongoDB hien tai, co the map nhu sau:

- `categories`: collection `Category`
- `brands`: collection `Brand`
- `category_brands`: quan he `Category.brandIDs` va `Brand.categoryIDs`
- `products`: collection `Product`
- `product_images`: field `Product.images`
- `product_specs`: field `Product.specifications`

## Categories

Luu danh muc san pham:

- Switch
- Firewall
- Wireless
- Router
- Module quang
- Phu kien mang
- Server
- Storage
- Software
- Thiet bi khac

Field can co:

- `title`
- `slug`
- `description`
- `icon`
- `status`: `active` / `inactive`
- `brandIDs`
- `filterIDs`

## Brands

Luu hang san xuat:

- Cisco
- HPE Aruba
- Extreme
- Ruijie
- Huawei
- Juniper
- Fortinet
- Palo Alto
- SonicWall
- CheckPoint
- CoreEdge

Field can co:

- `title`
- `slug`
- `description`
- `logo`
- `status`: `active` / `inactive`
- `categoryIDs`

## Category Brands

Bang/quan he trung gian de xac dinh hang nao thuoc danh muc nao.

Vi du:

- Cisco thuoc Switch, Firewall, Wireless, Router.
- Fortinet thuoc Firewall.
- Extreme thuoc Switch, Wireless.
- HPE Aruba thuoc Switch, Wireless.
- CoreEdge thuoc Switch, Wireless, Module quang.

Quy tac bat buoc:

- Neu brand khong thuoc category thi URL nhu `/switch/fortinet` phai bao loi.
- Khong duoc lay san pham chi theo brand, phai loc ca category + brand.

## Products

San pham la bang/collection trung tam.

Field bat buoc:

- `sku` hoac field hien tai `productID`
- `name` hoac field hien tai `title`
- `slug`
- `category_id` hoac `categoryID`
- `brand_id` hoac `brandID`
- `main_image_url` hoac `images[0].url`
- `short_description`
- `description`
- `technical_specs` hoac `specifications`
- `price_text` hoac `prices = 0` de hien `Lien he`
- `status`: `draft` / `published` / `hidden`
- `datasheet_url`

Quy tac:

- SKU la khoa dong bo du lieu.
- SKU phai unique.
- Slug phai unique.
- San pham import moi mac dinh `draft`.
- Frontend public chi hien `status = published`.
- Neu code hien tai chua co `status`, can them field nay vao product schema. Co the map tam:
  - `isDisabled = false` chua du, vi thieu `draft`.
  - Nen them `status` rieng.

## Product Images

Folder anh nen theo cau truc:

```text
uploads/
  brands/
    cisco.png
    hpe-aruba.png
    extreme.png
    ruijie.png
    fortinet.png
  products/
    AP310E-WR/
      main.jpg
      1.jpg
      2.jpg
    FG-40F/
      main.jpg
      1.jpg
    C9200L-24T-4G-E/
      main.jpg
      1.jpg
```

Quy tac:

- Ten folder san pham = SKU.
- Anh chinh uu tien `main.jpg`.
- Anh phu la `1.jpg`, `2.jpg`, `3.jpg`...
- Neu khong co anh, frontend hien placeholder.
- Khong tu doan SKU neu ten folder khong khop. Phai bao loi trong preview import.

## Datasheets

Folder datasheet nen theo SKU:

```text
uploads/
  datasheets/
    AP310E-WR.pdf
    FG-40F.pdf
    C9200L-24T-4G-E.pdf
```

Quy tac:

- Ten file datasheet = SKU + `.pdf`.
- Neu khong co datasheet, preview import bao `Thieu datasheet`.
- Trang chi tiet hien link tai datasheet neu co.

## Product Specs

Thong so ky thuat can dong bo theo SKU.

Dang hien thi frontend:

| Thong so | Gia tri |
| --- | --- |
| Ethernet Port | 2 x 10/100/1000Mbps |
| Wi-Fi Standard | 802.11ax |
| Antenna | External Antennas |

Neu dung schema hien tai:

```js
specifications: [
  {
    topic: "Thong so ky thuat",
    details: [
      { title: "Ethernet Port", description: "2 x 10/100/1000Mbps" },
      { title: "Wi-Fi Standard", description: "802.11ax" }
    ]
  }
]
```

Can co import specs tu Excel/CSV. Neu chi co PDF datasheet thi can parser PDF rieng, khong nen xem link PDF la specs da du.

## Trang Category

URL: `/:categorySlug`, vi du `/switch`.

Noi dung:

1. Breadcrumb: `Trang chu > Switch`
2. Tieu de: `THIET BI SWITCH`
3. Mo ta ngan ve danh muc.
4. Grid logo hang thuoc danh muc.

Card brand:

- Logo hang
- Ten hang
- Hover shadow nhe
- Click sang `/:categorySlug/:brandSlug`

Responsive:

- Desktop: 4 hoac 5 cot
- Tablet: 3 cot
- Mobile: 2 cot

Empty state:

```text
Chua co hang san pham trong danh muc nay.
```

## Trang Brand Product

URL: `/:categorySlug/:brandSlug`, vi du `/switch/cisco`.

Noi dung:

1. Breadcrumb: `Trang chu > Switch > Cisco`
2. Logo hang.
3. Tieu de: `Switch Cisco`
4. Mo ta: `Danh sach san pham Switch thuoc hang Cisco.`
5. Product grid.

Card san pham:

- Anh san pham
- Ten san pham
- SKU
- Mo ta ngan neu co
- Gia hoac `Lien he`
- Nut `Xem chi tiet` hoac click vao card

Responsive:

- Desktop: 4 san pham/hang
- Tablet: 3 san pham/hang
- Mobile: 2 san pham/hang

Empty state:

```text
Chua co san pham trong danh muc nay.
```

## Trang Chi Tiet San Pham

URL: `/product/:productSlug`

Can co:

1. Breadcrumb: `Trang chu > Switch > Cisco > Ten san pham`
2. Anh chinh san pham
3. Gallery anh phu
4. Ten san pham
5. SKU
6. Hang
7. Danh muc
8. Gia hoac `Lien he`
9. Mo ta san pham
10. Bang thong so ky thuat
11. Link tai datasheet neu co
12. Nut:
    - `Yeu cau bao gia`
    - `Lien he tu van`

## API Backend Can Co

### 1. Lay danh sach danh muc

```http
GET /api/categories
```

Tra ve danh muc active.

### 2. Lay danh sach hang theo danh muc

```http
GET /api/categories/:categorySlug/brands
```

Vi du:

```http
GET /api/categories/switch/brands
```

Response mau:

```json
{
  "category": {
    "id": 1,
    "name": "Switch",
    "slug": "switch",
    "description": "Thiet bi chuyen mach mang doanh nghiep"
  },
  "brands": [
    {
      "id": 1,
      "name": "Cisco",
      "slug": "cisco",
      "logo_url": "/uploads/brands/cisco.png"
    }
  ]
}
```

### 3. Lay san pham theo danh muc va hang

```http
GET /api/categories/:categorySlug/brands/:brandSlug/products
```

Vi du:

```http
GET /api/categories/switch/brands/cisco/products
```

Quy tac:

- Kiem tra category ton tai.
- Kiem tra brand ton tai.
- Kiem tra brand co thuoc category.
- Chi lay san pham `published`.
- Loc theo ca `categoryID` va `brandID`.

Response mau:

```json
{
  "category": {
    "id": 1,
    "name": "Switch",
    "slug": "switch"
  },
  "brand": {
    "id": 1,
    "name": "Cisco",
    "slug": "cisco",
    "logo_url": "/uploads/brands/cisco.png"
  },
  "products": [
    {
      "id": 101,
      "sku": "C9200L-24T-4G-E",
      "name": "Cisco Catalyst 9200L 24-port Data 4x1G Uplink",
      "slug": "cisco-catalyst-9200l-24t-4g-e",
      "image_url": "/uploads/products/C9200L-24T-4G-E/main.jpg",
      "price_text": "Lien he"
    }
  ]
}
```

### 4. Lay chi tiet san pham

```http
GET /api/products/:productSlug
```

Chi tra san pham `published` cho frontend public.

### 5. Lay thong ke admin

```http
GET /api/admin/stats/products
```

Can tra:

- Tong san pham
- So san pham `published`
- So san pham `draft`
- So san pham `hidden`
- So san pham thieu anh
- So san pham thieu thong so
- So san pham thieu datasheet
- So san pham theo tung danh muc
- So san pham theo tung hang
- San pham moi import gan day

## Admin Can Co

### Quan ly danh muc

- Them/sua/xoa danh muc
- Slug danh muc
- Mo ta danh muc
- Trang thai active/inactive

### Quan ly hang

- Them/sua/xoa hang
- Upload logo hang
- Slug hang
- Mo ta hang
- Trang thai active/inactive

### Gan hang vao danh muc

Vi du:

- Switch: Cisco, HPE Aruba, Extreme, Ruijie
- Firewall: Fortinet, Cisco, Palo Alto, SonicWall
- Wireless: Cisco, Aruba, Extreme, Ruijie

### Quan ly san pham

Form san pham can co:

- SKU
- Ten san pham
- Slug
- Danh muc
- Hang
- Anh chinh
- Anh phu
- Mo ta ngan
- Mo ta chi tiet
- Thong so ky thuat dang key-value
- Datasheet
- Gia hoac chu `Lien he`
- Trang thai: `draft` / `published` / `hidden`

Quy tac:

- Khi chon danh muc, dropdown hang chi hien cac hang thuoc danh muc do.
- Vi du chon Switch thi chi hien Cisco, HPE Aruba, Extreme, Ruijie...
- Khong hien Fortinet neu Fortinet khong thuoc Switch.

## Import Du Lieu

Can co import tu Excel/CSV va folder anh/datasheet.

File Excel/CSV nen co cot:

- `sku`
- `name`
- `category_slug`
- `brand_slug`
- `short_description`
- `description`
- `price_text`
- `spec_name`
- `spec_value`
- `datasheet_filename`

Quy trinh import:

1. Doc SKU.
2. Neu SKU chua ton tai thi tao san pham.
3. Neu SKU da ton tai thi cap nhat san pham.
4. Tim anh theo folder SKU.
5. Tim datasheet theo SKU.
6. Ghi thong so ky thuat vao `product_specs` / `specifications`.
7. San pham sau import co `status = draft`.
8. Khong ghi du lieu loi truc tiep vao `published`.

## Preview Import

Can co man hinh preview truoc khi import that.

Bang preview:

| SKU | Ten san pham | Danh muc | Hang | Anh | Datasheet | Thong so | Trang thai |
| --- | --- | --- | --- | --- | --- | --- | --- |

Trang thai co the gom:

- OK
- Thieu anh
- Thieu datasheet
- Thieu thong so
- Khong tim thay danh muc
- Khong tim thay hang
- Hang khong thuoc danh muc
- SKU bi trung
- Loi du lieu

Chi cho bam `Confirm Import` khi loi nghiem trong da duoc xu ly.

## Dong Bo Theo SKU

Toan bo he thong dung SKU lam khoa dong bo.

Cong thuc:

```text
SKU trong database = ten folder anh = ten file datasheet = SKU trong Excel
```

Vi du:

```text
Database: sku = AP310E-WR
Folder anh: uploads/products/AP310E-WR/main.jpg
Datasheet: uploads/datasheets/AP310E-WR.pdf
Excel: sku = AP310E-WR
```

Neu khong khop SKU:

- Khong tu doan bua.
- Phai bao loi trong preview import.
- Admin tu sua data hoac map thu cong.

## Giao Dien

Phong cach:

- Chuyen nghiep
- Sach
- De nhin
- Phu hop web ban thiet bi mang doanh nghiep
- Card bo goc nhe
- Hover shadow nhe
- Logo hang can giua
- Anh san pham `object-contain`
- Responsive tot tren mobile

Mau sac:

- Xanh duong / xanh navy cho heading va nut chinh
- Trang cho nen card
- Xam nhat cho background
- Do/cam chi dung nhe cho gia hoac `Lien he` neu can noi bat

## Chong Loi

He thong can xu ly:

1. Category khong ton tai:
   - Hien 404 hoac `Khong tim thay danh muc`.

2. Brand khong ton tai:
   - Hien 404 hoac `Khong tim thay hang`.

3. Brand khong thuoc category:
   - Vi du `/switch/fortinet`.
   - Khong hien san pham.
   - Tra loi: `Hang nay khong thuoc danh muc Switch.`

4. San pham thieu anh:
   - Hien placeholder.

5. San pham chua `published`:
   - Khong hien o frontend public.

6. Slug bi trung:
   - Khong cho luu.

7. SKU bi trung:
   - Khong cho tao moi.
   - Chi cho cap nhat neu dung san pham.

## Dashboard Admin

Thong ke lay tu database, khong dem thu cong.

Can co:

- Tong so san pham
- Tong so danh muc
- Tong so hang
- San pham `published`
- San pham `draft`
- San pham `hidden`
- San pham thieu anh
- San pham thieu thong so
- San pham thieu datasheet
- San pham theo danh muc
- San pham theo hang
- San pham moi import gan day

## Checklist Trien Khai

### Backend

- [ ] Them field `description`, `status` cho Category neu chua co.
- [ ] Them field `description`, `status` cho Brand neu chua co.
- [ ] Them field `status`, `shortDescription`, `datasheetUrl`, `priceText` cho Product.
- [ ] Chuan hoa `productID` thanh SKU hoac giu `productID` nhung document ro la SKU.
- [ ] Tao API `GET /api/categories`.
- [ ] Tao API `GET /api/categories/:categorySlug/brands`.
- [ ] Tao API `GET /api/categories/:categorySlug/brands/:brandSlug/products`.
- [ ] Tao API `GET /api/products/:productSlug`.
- [ ] Tao API `GET /api/admin/stats/products`.
- [ ] Frontend public chi query `status = published`.
- [ ] Validate brand thuoc category khi lay products.

### Frontend Public

- [ ] Route `/:categorySlug` hien brand logo grid.
- [ ] Route `/:categorySlug/:brandSlug` hien product grid.
- [ ] Product grid loc dung category + brand.
- [ ] Product detail hien datasheet + specs table.
- [ ] Placeholder cho san pham thieu anh.
- [ ] 404/empty state ro rang.

### Admin

- [ ] CRUD categories.
- [ ] CRUD brands.
- [ ] Gan brands vao categories.
- [ ] CRUD products.
- [ ] Product status: draft/published/hidden.
- [ ] Dropdown brand phu thuoc category.
- [ ] Dashboard stats.

### Import

- [ ] Upload/chon Excel/CSV.
- [ ] Chon folder anh.
- [ ] Chon folder datasheet.
- [ ] Preview import.
- [ ] Bao loi SKU/category/brand/image/datasheet/specs.
- [ ] Confirm import tao/cap nhat san pham `draft`.
- [ ] Map anh theo SKU folder.
- [ ] Map datasheet theo SKU PDF.
- [ ] Map specs theo SKU.

## Tinh Trang Hien Tai Can Nho

Hien project dang dung MongoDB voi cac model:

- `Category`
- `Brand`
- `Product`

Mot so script import da co:

- `server/scripts/importSwitchZipProducts.js`
- `server/scripts/importCoreEdgeProducts.js`

CoreEdge hien da import:

- 35 san pham
- 130 anh public
- 29 datasheet PDF public
- 35/35 san pham co image refs
- Specs chi tiet trong `Product.specifications` chua duoc parse tu PDF

Can lam tiep:

1. Them status `draft/published/hidden`.
2. Chuyen import mac dinh ve `draft`.
3. Lam route category brand logo truoc khi hien product.
4. Lam API category/brand/product moi theo spec o tren.
5. Lam preview import.
6. Parse specs tu Excel/CSV hoac PDF vao `Product.specifications`.
