$ErrorActionPreference = "Stop"

$shopUrl = "https://uzum.uz/uz/shop/beautyh"
$productsByHref = [ordered]@{}

function Convert-PriceToNumber {
  param([string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return $null
  }

  $digits = $Value -replace '[^0-9]', ''
  if ([string]::IsNullOrWhiteSpace($digits)) {
    return $null
  }

  return [int]$digits
}

for ($page = 1; $page -le 6; $page++) {
  $url = if ($page -eq 1) { $shopUrl } else { "$shopUrl`?currentPage=$page" }
  $response = Invoke-WebRequest $url -UseBasicParsing
  $cards = [regex]::Matches($response.Content, '<a href="(?<href>[^"]+)" class="product-card[\s\S]*?</a>')

  foreach ($card in $cards) {
    $html = $card.Value
    $hrefPath = [System.Net.WebUtility]::HtmlDecode(([regex]::Match($html, '<a href="(?<value>[^"]+)"')).Groups['value'].Value)
    $href = "https://uzum.uz$hrefPath"
    $id = ([regex]::Match($hrefPath, '/product/(?<value>[^?]+)')).Groups['value'].Value
    $title = [System.Net.WebUtility]::HtmlDecode(([regex]::Match($html, 'title="(?<value>[^"]+)"')).Groups['value'].Value)
    $image = [System.Net.WebUtility]::HtmlDecode(([regex]::Match($html, '<meta itemprop="image" content="(?<value>[^"]+)"')).Groups['value'].Value)
    $uzumCardPrice = Convert-PriceToNumber ([System.Net.WebUtility]::HtmlDecode(([regex]::Match($html, 'product-card__actual-price"[^>]*>(?<value>[^<]+)</span>')).Groups['value'].Value))
    $regularPrice = Convert-PriceToNumber ([System.Net.WebUtility]::HtmlDecode(([regex]::Match($html, 'product-card__old-price"[^>]*>(?<value>[^<]+)</span>')).Groups['value'].Value))

    if ($title -and $href -and $image) {
      $productsByHref[$href] = [ordered]@{
        id = $id
        title = $title
        href = $href
        image = $image
        price = if ($regularPrice) { $regularPrice } else { $uzumCardPrice }
        uzumCardPrice = $uzumCardPrice
      }
    }
  }
}

$products = @($productsByHref.Values)
$json = $products | ConvertTo-Json -Depth 5
$content = "export const uzumCatalogProductsRaw = $json;`n"
$targetDir = Join-Path (Resolve-Path ".").Path "src\data"
New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
$target = Join-Path $targetDir "uzumCatalogProducts.generated.js"
Set-Content -Path $target -Value $content -Encoding utf8

Write-Host "Saved $($products.Count) products to src/data/uzumCatalogProducts.generated.js"
