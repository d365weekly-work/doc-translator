# Document Translator: English → Spanish (Mexico)

Translates Word, Excel, PowerPoint and Visio files offline in the browser, checks the result, and gives you a review summary. Your documents are never uploaded.

## Put it on GitHub (one time, about 5 minutes)

1. On github.com, click **New repository**. Name it, for example, `doc-translator`. It can be **Private** if your GitHub plan includes Pages for private repos. Otherwise make it Public. The repository holds only the tool, never your documents.
2. Click **Add file → Upload files** and upload `index.html`, `sw.js` and `README.md`. Click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, set **Source = Deploy from a branch**, **Branch = main**, folder **/ (root)**. Click **Save**.
4. After about a minute, the page shows your link: `https://<your-github-name>.github.io/doc-translator/`. Bookmark it in Microsoft Edge.

## First use on each computer

1. Open the link in **Microsoft Edge 148 or later** (Settings → About Microsoft Edge to check).
2. Click **Set up engines**. TranslateGemma (about 2.9 GB) and Edge's built-in translator download once and stay in the browser.
3. To prove nothing leaves the PC, turn off Wi-Fi and translate a file. The badge at the top shows **0 network requests**.

## Updating the tool later

Upload the new `index.html` or `sw.js` over the old one (Add file → Upload files). The page updates itself the next time it's opened while online.

## Notes

- Needs a laptop with a working graphics chip (WebGPU). Check `edge://gpu`. If WebGPU is missing, use **Fast** mode.
- Opening `index.html` straight from a folder (file://) won't work, because browsers only allow the offline cache on a web address. Use the GitHub link.
- Clearing browser data for the site removes the downloaded engine, glossary and translation memory. Export the glossary and memory regularly (Glossary → Export, Translation memory → Export).
