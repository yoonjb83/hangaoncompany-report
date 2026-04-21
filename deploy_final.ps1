$index = Get-Content index.html -Raw -Encoding UTF8
$js = Get-Content app.js -Raw -Encoding UTF8
$files = @{
    "index.html" = @{ content = $index }
    "app.js" = @{ content = $js }
    "package.json" = @{ content = "{ `"name`": `"hangaon-v406`", `"main`": `"index.html`" }" }
}
$payload = @{ files = $files }
$json = $payload | ConvertTo-Json -Depth 10 -Compress
$resp = Invoke-RestMethod -Method Post -Uri "https://codesandbox.io/api/v1/sandboxes/define?json=1" -Body $json -ContentType "application/json"
$resp.sandbox_id
