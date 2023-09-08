require "pathname"

__app = File.expand_path(File.join(File.dirname(__FILE__), ".."))

markdown = "
| Page | Native | Mobile | Desktop |
| ---- | ------ | ------ | ------- |
"

Dir.glob(File.join(__app, "src/pages", "**/*.vue")).each do |file|
  page_path = Pathname.new(file).relative_path_from(File.join(__app, "src/pages"))

  markdown += "| `#{page_path}` | [ ] | [ ] | [ ] |
"
  # puts (file)
end

File.open(File.join(__app, "sites.md"), "w") do |file|
  file.write(markdown)
end

puts markdown
