"""Run with Python + Playwright: python3 tests/test_pwa_update.py."""
from pathlib import Path
from tempfile import TemporaryDirectory
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
import shutil, subprocess, re, time
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
with TemporaryDirectory() as tmp, sync_playwright() as pw:
    dest=Path(tmp)
    for file in (ROOT/'dist/site').iterdir(): shutil.copy(file,dest/file.name)
    html=(dest/'index.html').read_text();sw=(dest/'sw.js').read_text()
    build=re.search('name="app-build" content="([^"]+)"',html)[1]
    # Real pre-V1.5 release exercises migration from the old cache-first worker.
    (dest/'index.html').write_bytes(subprocess.check_output(['git','show','d0b45fd:index.html'],cwd=ROOT))
    (dest/'sw.js').write_bytes(subprocess.check_output(['git','show','d0b45fd:sw.js'],cwd=ROOT))
    server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=tmp))
    Thread(target=server.serve_forever,daemon=True).start()
    browser=pw.chromium.launch();context=browser.new_context(viewport={'width':390,'height':844})
    page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(f'http://127.0.0.1:{server.server_port}/')
    page.evaluate('navigator.serviceWorker.ready');page.reload()
    (dest/'index.html').write_text(html);(dest/'sw.js').write_text(sw)
    page.evaluate('async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();}')
    deadline=time.monotonic()+20
    while not page.evaluate('async()=>{const keys=await caches.keys();return keys.includes("decomp-'+build+'") && keys.filter(k=>k.startsWith("decomp-")).length===1;}'):
        assert time.monotonic()<deadline, 'New worker failed to activate'
        page.wait_for_timeout(100)

    page.reload()
    expect(page.locator('.update-bar')).to_contain_text('当前版本 V1.5')
    page.locator('#checkUpdateBtn').click();expect(page.locator('#updateStatus')).to_contain_text('为最新版本',timeout=15000)
    context.set_offline(True);page.locator('#checkUpdateBtn').click();expect(page.locator('#updateStatus')).to_contain_text('当前离线')
    page.reload()
    expect(page.locator('.update-bar')).to_contain_text('V1.5')
    page.locator('#fixA').fill('R229');page.locator('#fixB').fill('');page.locator('#goBtn').click();assert page.locator('.seg-title').count()==2
    context.set_offline(False)
    # Same visible version, different build: still offer the update, without auto-reload.
    new='test-next-release'
    (dest/'index.html').write_text(html.replace(build,new));(dest/'sw.js').write_text(sw.replace(build,new))
    page.locator('#checkUpdateBtn').click();expect(page.locator('#applyUpdateBtn')).to_be_visible(timeout=15000)
    assert page.locator('meta[name="app-build"]').get_attribute('content')==build
    assert page.locator('.seg-title').count()==2
    page.locator('#applyUpdateBtn').click();page.wait_for_function('document.querySelector(\'meta[name="app-build"]\').content==="'+new+'"')
    context.set_offline(True);page.reload();assert page.locator('meta[name="app-build"]').get_attribute('content')==new
    context.set_offline(False)
    # Incomplete new release must fail installation and preserve offline availability.
    failed='test-broken-release'
    (dest/'index.html').write_text(html.replace(build,failed));(dest/'sw.js').write_text(sw.replace(build,failed))
    (dest/'icon-192.png').rename(dest/'icon-192.saved')
    page.locator('#checkUpdateBtn').click();expect(page.locator('#updateStatus')).to_contain_text('未能完成',timeout=15000)
    expect(page.locator('#applyUpdateBtn')).to_be_hidden()
    context.set_offline(True);page.reload();assert page.locator('meta[name="app-build"]').get_attribute('content')==new
    page.screenshot(path='/tmp/decomp-v15-mobile.png')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    assert not errors,errors
    browser.close();server.shutdown()
    print('PASS: legacy migration, V1.5 latest, offline query/reload, same-version build update, explicit refresh, failed-download rollback, mobile, no JS errors')
