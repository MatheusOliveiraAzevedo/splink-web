"""Run with fonttools[woff]; retain originals for other writing systems."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2] / 'src/assets/fonts'
RANGES = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-036F,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2605,U+2713,U+2715,U+2716,U+2212,U+2215,U+FEFF,U+FFFD'

for name in ('CodecPro-Regular', 'CodecPro-Bold', 'Inter-Regular'):
    source = ROOT / f'{name}.woff2'
    font = TTFont(source)
    original_chars = set(font.getBestCmap())
    options = subset.Options()
    options.layout_features = ['*']
    cutter = subset.Subsetter(options=options)
    cutter.populate(unicodes=subset.parse_unicodes(RANGES))
    cutter.subset(font)
    output = ROOT / f'{name}-latin.woff2'
    font.save(output)
    expected = original_chars.intersection(subset.parse_unicodes(RANGES))
    assert expected <= set(TTFont(output).getBestCmap())
    print(f'{name}: {source.stat().st_size} → {output.stat().st_size} bytes')
