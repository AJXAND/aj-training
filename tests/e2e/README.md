# Playwright checks (Python)
Serve the build: `npm run build && (cd dist && python3 -m http.server 8765)`
Each script routes config.js to `window.AJ_CONFIG={};` (local IndexedDB mode, no Supabase) and blocks Google Fonts.
Outputs/screenshots go to /tmp/ajt/. Run e.g. `python3 tests/e2e/p2.py`. A pass prints `errors: []` or `[]`.
- p1b: welcome + nutrition flows   - p2: app structure   - p3 <flows>: plan builder, e.g. `p3.py muscle,aesthetic,power,crossfit,run,hyrox,tri,hybrid,custom`
- p3b/p3c: plan builder extras   - p4: live workout   - p5: food logging   - glitch: in-place updates (no flashing)
- lbl2: label scanner with fake camera (needs .mjpeg clips in /tmp/ajt; regenerate with ffmpeg if missing)   - dark: dark mode   - vis: gym + sports step screenshots
