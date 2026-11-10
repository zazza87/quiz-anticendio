import sys, io, zlib
import pikepdf
from pikepdf import PdfImage, Name
from PIL import Image
src, dst, maxpx, q = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
pdf = pikepdf.open(src)
done = set()
imgs = [o for o in pdf.objects if isinstance(o, pikepdf.Stream) and o.get('/Subtype') == '/Image']
for raw in imgs:
    if True:
        key = raw.objgen
        if key in done: continue
        done.add(key)
        try:
            if raw.get('/ImageMask', False): continue
            pim = PdfImage(raw)
            if raw.Length < 20000: continue
            im = pim.as_pil_image()
            if im.mode in ('CMYK',):
                im = im.convert('RGB')
            elif im.mode not in ('RGB', 'L'):
                im = im.convert('RGB')
            w, h = im.size
            s = min(1.0, maxpx / max(w, h))
            if s < 1: im = im.resize((max(1, int(w*s)), max(1, int(h*s))), Image.LANCZOS)
            buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q, optimize=True)
            data = buf.getvalue()
            if len(data) >= raw.Length: continue
            raw.write(data, filter=Name.DCTDecode)
            raw.Width, raw.Height = im.size
            raw.ColorSpace = Name.DeviceGray if im.mode == 'L' else Name.DeviceRGB
            raw.BitsPerComponent = 8
            for k in ('/DecodeParms', '/Decode'):
                if k in raw: del raw[k]
        except Exception as e:
            pass
pdf.save(dst, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)
