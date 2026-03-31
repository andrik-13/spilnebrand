# SPIL'NE — Figma-бриф

## Структура файла в Figma

```
Страницы:
1. Design System
2. Components
3. Home (Desktop + Mobile)
4. Catalog (Desktop + Mobile)
5. Product (Desktop + Mobile)
```

---

## 1. Design System

### Цвета (Styles → Color)

| Название | HEX |
|---|---|
| Background | `#FAFAF7` |
| Surface | `#F0EAE0` |
| Text/Primary | `#1A1816` |
| Text/Muted | `#6B6560` |
| Accent | `#C4B5A0` |
| Dark | `#2C2420` |
| White | `#FFFFFF` |

### Типографика (Styles → Text)

Подключить через Google Fonts:
- **Cormorant Garamond** → https://fonts.google.com/specimen/Cormorant+Garamond
- **DM Sans** → https://fonts.google.com/specimen/DM+Sans

| Название стиля | Шрифт | Размер | Weight | Tracking | Line-height |
|---|---|---|---|---|---|
| H1 | Cormorant Garamond | 72px | Regular | -1 | 1.1 |
| H2 | Cormorant Garamond | 48px | Regular | -0.5 | 1.2 |
| H3 | Cormorant Garamond | 32px | Regular | 0 | 1.3 |
| Body | DM Sans | 16px | Regular | 0 | 1.6 |
| Small | DM Sans | 13px | Regular | 2px | 1.4 |
| Button | DM Sans | 14px | Medium | 1.5px | 1 |

### Сетка

| Устройство | Ширина | Колонки | Gutter | Margin |
|---|---|---|---|---|
| Desktop | 1440px | 12 | 24px | 80px |
| Mobile | 390px | 4 | 16px | 20px |

### Отступы (Spacing)

```
4, 8, 12, 16, 24, 32, 48, 64, 80, 100, 120px
```

---

## 2. Components

### Header

```
┌─────────────────────────────────────────────────────────┐
│  [Меню]          SPIL'NE          [UA | EN]  [Корзина]  │
└─────────────────────────────────────────────────────────┘
Высота: 72px
Фон: #FAFAF7
Снизу: линия 1px #C4B5A0
Логотип по центру
```

**Mobile Header:**
```
┌─────────────────┐
│ [≡]  SPIL'NE [🛍]│
└─────────────────┘
Высота: 60px
```

### Карточка товара

```
┌──────────────┐
│              │
│    ФОТО      │  ← пропорция 4:5, фон #F0EAE0
│              │
├──────────────┤
│ Название     │  ← H3, #1A1816
│ 1 200 ₴      │  ← Body, #1A1816
│ [S] [M]      │  ← плашки 28x28px, Small
└──────────────┘
Hover: затемнение фото на 10%
```

### Кнопка Primary

```
Фон: #2C2420
Текст: #FFFFFF, стиль Button
Padding: 16px 40px
Border-radius: 0 (без скруглений!)
Hover: #1A1816
```

### Кнопка Secondary (outline)

```
Фон: transparent
Border: 1px solid #2C2420
Текст: #2C2420, стиль Button
Padding: 14px 38px
Border-radius: 0
```

### Кнопка Secondary Light (для hero на тёмном фото)

```
Фон: transparent
Border: 1px solid #FFFFFF
Текст: #FFFFFF, стиль Button
Padding: 14px 38px
```

### Плашка размера

```
Размер: 36x36px
Default: Border 1px #C4B5A0, текст #6B6560
Selected: Фон #2C2420, текст #FFFFFF
```

### Аккордеон (для страницы товара)

```
┌──────────────────────────────────┐
│ Склад та догляд              [+] │  ← линия снизу 1px #C4B5A0
├──────────────────────────────────┤
│ (развёрнутый текст)              │
└──────────────────────────────────┘
```

---

## 3. Главная страница (Home)

### Desktop (1440px)

**Секция 1 — Hero**
```
Высота: 100vh
Фото на весь блок (на модели, вертикальное)
Тёмный оверлей: rgba(0,0,0,0.2)
По центру снизу (~30% от низа):
  "Базовий гардероб"  ← H1, #FFFFFF
  "Для тих, хто цінує якість"  ← Small, #FFFFFF, отступ сверху 16px
  [ПЕРЕГЛЯНУТИ КОЛЕКЦІЮ]  ← Secondary Light, отступ сверху 32px
```

**Секция 2 — Новая коллекция**
```
Padding: 100px 80px
  "Нова колекція"  ← H2, по центру
  отступ снизу 8px
  "Весна 2025"  ← Small/Muted, по центру

Сетка: 4 карточки горизонтально, gap 24px, отступ сверху 48px
Справа снизу: "Дивитись всі →"  ← Body/Muted, underline
```

**Секция 3 — О бренде**
```
Фон: #F0EAE0
Padding: 100px 80px
Две колонки 50/50:
  Левая: фото 1:1 (квадратное)
  Правая:
    "Про нас"  ← Small/Muted, отступ снизу 16px
    "SPIL'NE — це речі, які залишаються"  ← H2
    отступ снизу 24px
    текст 2-3 строки  ← Body/Muted
    отступ снизу 40px
    [ПРО БРЕНД]  ← Secondary
```

**Секция 4 — Lookbook / Instagram**
```
Padding: 80px 0
"@spilne"  ← Small, по центру, отступ снизу 32px
Горизонтальная лента: 5 квадратных фото без gaps
```

**Footer**
```
Фон: #1A1816
Padding: 60px 80px
Две колонки:
  Левая: логотип SPIL'NE (белый), снизу копирайт Small/Muted
  Правая: навигация Small/White + Telegram-ссылка
Снизу по центру: "Зроблено з любов'ю в Україні"  ← Small/Muted
```

---

### Mobile (390px) — Главная

```
Hero: 100dvh, текст меньше (H2 вместо H1)
Новая коллекция: 2 карточки в ряд, gap 12px
О бренде: одна колонка, фото сверху, текст снизу
Instagram лента: скроллится горизонтально (swipe)
Footer: одна колонка, по центру
```

---

## 4. Каталог (/catalog)

### Desktop

```
Padding: 60px 80px

Хлебные крошки: "Головна → Каталог"  ← Small/Muted

"Колекція"  ← H2, по центру
отступ снизу 48px

Фильтр (горизонтально, по центру):
[Усі]  [Tops]  [Bottoms]  [Sets]
Активный: подчёркнутый, #1A1816
Неактивный: #6B6560
Отступ между пунктами: 32px

отступ снизу 48px

Сетка товаров: 3 колонки, gap 24px
```

### Mobile

```
Фильтр: горизонтальный скролл
Сетка: 2 колонки, gap 12px
```

---

## 5. Страница товара (/catalog/[slug])

### Desktop

```
Padding: 60px 80px
Две колонки:

Левая (60%):
  Главное фото (большое, пропорция 3:4)
  Снизу: 3 мини-фото горизонтально (gap 8px)

Правая (40%, sticky при скролле):
  "TOPS"  ← Small/Muted (категория)
  отступ 8px
  "Название товара"  ← H2
  отступ 16px
  "1 200 ₴"  ← H3
  отступ 24px
  линия 1px #C4B5A0
  отступ 24px
  "РОЗМІР"  ← Small/Muted
  отступ 12px
  [S]  [M]  ← Плашки размера
  отступ 32px
  [ЗАМОВИТИ У TELEGRAM]  ← Primary, full width
  отступ 12px
  "Ми зв'яжемося з вами у Telegram"  ← Small/Muted, по центру
  отступ 48px
  линия 1px #C4B5A0
  [Склад та догляд]  ← аккордеон
  [Доставка]  ← аккордеон
```

### Mobile

```
Одна колонка
Фото сверху (swipe-галерея)
Весь контент снизу
Кнопка "ЗАМОВИТИ" — fixed снизу экрана
```

---

## Чеклист для Figma

- [ ] Подключить шрифты Cormorant Garamond + DM Sans
- [ ] Создать все цвета как Styles
- [ ] Создать все текстовые стили
- [ ] Настроить сетку для Desktop и Mobile
- [ ] Сделать компоненты (Header, Карточка, Кнопки, Аккордеон)
- [ ] Сделать Desktop: Home, Catalog, Product
- [ ] Сделать Mobile: Home, Catalog, Product
- [ ] Поделиться ссылкой или скриншотами для согласования
