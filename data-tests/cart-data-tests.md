# Essential Order Table Data Tests

Here are the essential data-test attributes needed for testing the order information in element2.html:

## Main Container
```html
<div class="rounded-xl border bg-card text-card-foreground shadow-sm mb-8" data-test="order-card">
    <!-- Card content -->
</div>
```

## Date Element
```html
<span data-test="order-date">pátek 30.5.</span>
```

## Day Label (Today indicator)
```html
<div class="inline-flex items-center rounded-md border px-2.5 py-1 text-xs w-max bg-brand text-white !border-transparent mt-2" data-test="order-date-today-indicator">
    Dnes
</div>
```

## Meal Type, Quantity and Name
```html
<!-- Type icon -->
<svg
    class="min-w-6"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-test="order-meal-type-icon"
>
    <!-- SVG path -->
</svg>

<!-- Quantity -->
<span class="text-sm text-gray-500" data-test="order-meal-quantity">2x</span>

<!-- Name -->
<span class="font-medium text-sm" data-test="order-meal-name">Interní hlavní jídlo druhé ze dvou za 120</span>
```

## Restaurant
```html
<span data-test="order-restaurant-name">Interní restaurace</span>
```

## Time
```html
<span data-test="order-time">11:00 - 11:30</span>
```

## Note (if present)
```html
<div data-test="order-note-container">
    <span data-test="order-note-text">Poznámka</span>
</div>
```

## Price Per Unit
```html
<span data-test="order-price-per-unit">120&nbsp;Kč</span>
```

## Total Price for Item
```html
<strong data-test="order-total-price">240&nbsp;Kč</strong>
```

## Total Price for All Items
```html
<strong class="text-black" data-test="order-summary-total-price">Celková cena: 440&nbsp;Kč</strong>
```
