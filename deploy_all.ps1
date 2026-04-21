$html = Get-Content index_all.html -Raw -Encoding UTF8
$payload = @{
    files = @{
        "index.html" = @{ content = $html }
    }
}
$json = $payload | ConvertTo-Json -Compress
$resp = Invoke-RestMethod -Method Post -Uri "https://codesandbox.io/api/v1/sandboxes/define?json=1" -Body $json -ContentType "application/json"
$resp.sandbox_id
