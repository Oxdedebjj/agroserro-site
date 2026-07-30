import unittest
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
EXPECTED_URLS = [
    "https://agroserro.com.br/",
    "https://agroserro.com.br/coluna.html",
    "https://agroserro.com.br/privacidade.html",
]


class SeoIndexationTests(unittest.TestCase):
    def test_robots_allows_site_blocks_template_and_points_to_sitemap(self):
        robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
        self.assertIn("User-agent: *", robots)
        self.assertIn("Allow: /", robots)
        self.assertIn("Disallow: /artigos/_template.html", robots)
        self.assertIn("Sitemap: https://agroserro.com.br/sitemap.xml", robots)

    def test_sitemap_is_valid_and_contains_only_public_pages(self):
        tree = ET.parse(ROOT / "sitemap.xml")
        urls = [node.text for node in tree.findall("sm:url/sm:loc", SITEMAP_NS)]
        self.assertEqual(urls, EXPECTED_URLS)
        self.assertNotIn("https://agroserro.com.br/artigos/_template.html", urls)

    def test_every_sitemap_url_has_a_local_file(self):
        local_files = {
            "https://agroserro.com.br/": ROOT / "index.html",
            "https://agroserro.com.br/coluna.html": ROOT / "coluna.html",
            "https://agroserro.com.br/privacidade.html": ROOT / "privacidade.html",
        }
        for url in EXPECTED_URLS:
            self.assertTrue(local_files[url].is_file(), url)

    def test_indexable_pages_have_self_referencing_canonicals(self):
        expected = {
            "index.html": "https://agroserro.com.br/",
            "coluna.html": "https://agroserro.com.br/coluna.html",
            "privacidade.html": "https://agroserro.com.br/privacidade.html",
        }
        for filename, canonical in expected.items():
            html = (ROOT / filename).read_text(encoding="utf-8")
            self.assertIn(f'<link rel="canonical" href="{canonical}">', html)


if __name__ == "__main__":
    unittest.main()
