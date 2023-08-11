Get-ChildItem -Path src/apis -Filter *.txt | ForEach-Object {
  $file = $_.FullName
  Get-Content $file | Out-File $file -Encoding ASCII
}
