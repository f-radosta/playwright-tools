# Your Meal Today Card Data Tests

Based on the provided section of the meal order page, here are the data-test attributes needed for testing the key elements:

## Container Elements (Rows/Divs)

### Main Meal Card Container
```html
<div
    class="rounded-xl border bg-card text-card-foreground shadow-sm mb-8 svg--wrapper !border-brand border-2"
    data-test="meal-card"
>
    <!-- Card content -->  
</div>
```

### Card Header with Title
```html
<div class="flex flex-col space-y-1.5 p-3 md:p-6 pb-0" data-test="meal-card-header">
    <div class="infoTile outline" data-test="meal-card-title-container">
        <div class="infoTile__icon">
            <svg class="icon-coffee">
                <use xlink:href="#coffee-icon"></use>
            </svg>
        </div>

        <div class="infoTile__content">
            <div class="infoTile__title">Dnes papkáš</div>
        </div>
    </div>
</div>
```

### Card Body Container
```html
<div class="p-3 md:p-6 pt-0 card__body" data-test="meal-card-body">
    <div
        class="rounded-xl border bg-card text-card-foreground shadow-sm h-full relative !border-none shadow-none"
        data-test="meal-card-content"
    >
        <!-- Content goes here -->
    </div>
</div>
```

### Meal Section Container (for each meal type - soup, main course, etc.)
```html
<div
    class="p-3 md:p-6 pt-0 flex flex-row flex-wrap gap-[.35rem] pb-2 !px-0"
    data-test="meal-section-container"
>
    <!-- Meal details go here -->
</div>
```

### Meal Row (containing meal type icon and description)
```html
<div class="flex flex-row gap-2 w-full mt-4 mt-2" data-test="meal-row">
    <!-- Meal type icon and description -->
</div>
```

## Individual Elements

### Meal Type Icon
```html
<svg
    class="min-w-6"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-controller="tooltip"
    aria-label="Polévka"
    data-bs-original-title="Polévka"
    data-test="meal-type-icon"
>
    <!-- path elements -->
</svg>
```

### Meal Quantity and Name
```html
<div class="line-clamp-2" data-controller="tooltip" data-test="meal-item">
    <span class="text-sm text-gray-500" data-test="meal-quantity">1x</span>
    <span class="font-medium text-sm" data-test="meal-name">Gulášová polévka</span>
</div>
```

### Restaurant Information
```html
<div 
    class="items-center rounded-md border text-xs w-max text-brand !border-brand bg-transparent flex flex-row gap-[0_.5rem] px-1 py-[2px]" 
    data-test="meal-restaurant-container"
>
    <svg class="w-6 h-6 min-w-6 fill-brand">
        <use xlink:href="#home-icon"></use>
    </svg>
    <span data-test="meal-restaurant-name">eBRÁNA jídelna</span>
</div>
```

### Price Information
```html
<div 
    class="items-center rounded-md border text-xs w-max text-brand !border-brand bg-transparent flex flex-row gap-[0_.5rem] px-1 py-[2px]" 
    data-test="meal-price-container"
>
    <svg class="w-6 h-6 min-w-6 fill-brand">
        <use xlink:href="#money-icon"></use>
    </svg>
    <strong data-test="meal-price"> 25&nbsp;Kč </strong>
</div>
```

### Time Information
```html
<div 
    class="items-center rounded-md border text-xs w-max text-brand !border-brand bg-transparent flex flex-row gap-[0_.5rem] px-1 py-[2px]"
    data-test="meal-time-container"
>
    <svg class="w-6 h-6 min-w-6 fill-brand">
        <use xlink:href="#clock-icon"></use>
    </svg>
    <span data-test="meal-time"> 11:00 - 11:30 </span>
</div>
```

### Note/Comment Information
```html
<div 
    class="items-center rounded-md border text-xs w-max text-brand !border-brand bg-transparent flex flex-row gap-[0_.5rem] px-1 py-[2px]"
    data-controller="tooltip"
    data-bs-original-title="1x do krabičky "
    data-test="meal-note-container"
>
    <svg class="w-6 h-6 min-w-6 fill-brand">
        <use xlink:href="#documentWithPen-icon"></use>
    </svg>
    <span data-test="meal-note-text"> Poznámka </span>
</div>
```

### Separator Between Meal Items
```html
<hr data-test="meal-separator" />
```