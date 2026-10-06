# 目次のサムネイル(thumbs/NN.jpg)を作る。各見開きの額縁の場面(ツアー25秒)を撮り、帯の内側を縮小して保存する。
# 使い方: python tools/make_thumbs.py   (要: pip install playwright pillow / playwright install chromium)
import asyncio, functools, http.server, io, pathlib, threading
from PIL import Image
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'thumbs'
W, H, TOP, BOTTOM = 1280, 800, 76, 64   # 画面の大きさと、額縁の上下の帯(index.html の #frame)
SIZE = (400, 206)

def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    h = functools.partial(Quiet, directory=str(ROOT))
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s.server_address[1]

async def main():
    port = serve()
    OUT.mkdir(exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-proxy-server'])
        pg = await b.new_page(viewport={'width': W, 'height': H})
        for s in range(1, 11):
            await pg.goto(f'http://127.0.0.1:{port}/?spread={s}&t=25', wait_until='domcontentloaded', timeout=60000)
            await pg.add_style_tag(content='body>*:not(canvas){visibility:hidden!important}')
            await pg.wait_for_function('document.body.classList.contains("framed")', timeout=60000)
            await pg.wait_for_timeout(2500)
            png = await pg.screenshot(clip={'x': 0, 'y': TOP, 'width': W, 'height': H - TOP - BOTTOM})
            Image.open(io.BytesIO(png)).convert('RGB').resize(SIZE, Image.LANCZOS).save(OUT / f'{s:02d}.jpg', quality=82, optimize=True)
            print('thumbs/%02d.jpg' % s)
        await b.close()

asyncio.run(main())
