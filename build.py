#!/usr/bin/env python3
"""Bundle + minify Learns assets. Sources stay readable in assets/; run after editing them:

    python3 build.py

Outputs assets/css/learns.bundle.css and assets/js/learns.bundle.js.
shortcut: regex minifier (comments/whitespace only, no renaming); swap for esbuild/lightningcss if sources grow.
"""
import re
import subprocess
from pathlib import Path

A = Path(__file__).parent / "assets"
CSS_SRC = ["site.css", "learns.css"]
JS_SRC = ["site.js", "navbar.js", "learns.js"]

# Runs last: tells the inline loader the handlers are attached, then replays a click queued before load.
JS_READY = """(function(f){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f()})(function(){window.__rdvReady=true;var q=window.__rdvQ;window.__rdvQ=null;if(q)q.click()});"""


def min_css(s):
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"\s*([{};,])\s*", r"\1", s)  # never touch spaces before ':' (descendant selectors like ".x :last-child")
    s = re.sub(r":\s+", ":", s)
    return s.replace(";}", "}").strip()


def min_js(s):
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.S)
    out = []
    for line in s.splitlines():
        line = line.strip()
        if not line or line.startswith("//"):
            continue
        out.append(re.sub(r"([;{])\s+//.*$", r"\1", line))  # trailing comments after code only
    return "\n".join(out)


def main():
    css = "".join(min_css((A / f).read_text()) for f in CSS_SRC)
    (A / "css/learns.bundle.css").write_text(css + "\n")

    js = "\n".join(min_js((A / f).read_text()) for f in JS_SRC) + "\n" + JS_READY + "\n"
    out = A / "js/learns.bundle.js"
    out.write_text(js)

    # self-check: the bundle must parse, and every source brace must survive minification
    subprocess.run(["node", "--check", str(out)], check=True)
    src_css = "".join(re.sub(r"/\*.*?\*/", "", (A / f).read_text(), flags=re.S) for f in CSS_SRC)
    assert css.count("{") == src_css.count("{") and css.count("}") == src_css.count("}"), "CSS brace mismatch"
    print(f"css {len(css)} B, js {len(js)} B")


if __name__ == "__main__":
    main()
