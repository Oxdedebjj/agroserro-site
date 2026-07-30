import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]


class AnalyticsSetupTests(unittest.TestCase):
    def test_measurement_id_and_privacy_defaults(self):
        source = (ROOT / "analytics.js").read_text(encoding="utf-8")
        self.assertIn('const MEASUREMENT_ID = "G-PHJBVC6L6K";', source)
        self.assertIn('analytics_storage: "denied"', source)
        self.assertIn('ad_storage: "denied"', source)
        self.assertIn('allow_google_signals: false', source)
        self.assertIn('allow_ad_personalization_signals: false', source)

    def test_analytics_load_is_consent_gated(self):
        source = (ROOT / "analytics.js").read_text(encoding="utf-8")
        self.assertRegex(
            source,
            re.compile(r'if \(consent === "accepted"\) \{\s*loadAnalytics\(\);', re.MULTILINE),
        )
        self.assertIn('value === "accepted"', source)
        self.assertIn("googletagmanager.com/gtag/js", source)

    def test_conversion_events_are_configured(self):
        source = (ROOT / "analytics.js").read_text(encoding="utf-8")
        self.assertIn('sendEvent("generate_lead"', source)
        self.assertIn('contact_method: "whatsapp"', source)
        self.assertIn('contact_method: "telefone"', source)
        self.assertIn('sendEvent("social_click"', source)

    def test_public_pages_include_privacy_controls_and_analytics(self):
        pages = {
            "index.html": 'src="analytics.js?v=1"',
            "coluna.html": 'src="analytics.js?v=1"',
            "artigos/_template.html": 'src="../analytics.js?v=1"',
        }
        for relative_path, expected_script in pages.items():
            with self.subTest(page=relative_path):
                source = (ROOT / relative_path).read_text(encoding="utf-8")
                self.assertIn(expected_script, source)
                self.assertIn("Política de Privacidade", source)
                self.assertIn("data-cookie-settings", source)

    def test_privacy_page_exists_and_discloses_ga4(self):
        source = (ROOT / "privacidade.html").read_text(encoding="utf-8")
        self.assertIn("Google Analytics 4", source)
        self.assertIn("Lei Geral de Proteção de Dados", source)
        self.assertIn("data-cookie-settings", source)
        self.assertIn('src="analytics.js?v=1"', source)


if __name__ == "__main__":
    unittest.main()
