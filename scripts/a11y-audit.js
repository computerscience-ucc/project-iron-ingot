const pa11y = require("pa11y");

const PAGES = [
  { path: "/", name: "Home" },
  { path: "/dev/components", name: "Dev Components" },
  { path: "/about", name: "About" },
];

async function runAudit() {
  const BASE = process.env.A11Y_BASE_URL || "http://localhost:3000";
  let results = [];

  for (const page of PAGES) {
    const url = `${BASE}${page.path}`;
    process.stdout.write(`Scanning ${page.name}...`);
    try {
      const result = await pa11y(url, { standard: "WCAG2AA", wait: 2000, timeout: 20000 });
      results.push({ page: page.name, issues: result.issues });
      process.stdout.write(` ${result.issues.length} issues\n`);
    } catch (err) {
      process.stdout.write(` ERROR: ${err.message}\n`);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("A11Y AUDIT SUMMARY");
  console.log("=".repeat(50));

  let total = 0;
  for (const r of results) {
    const errors = r.issues.filter((i) => i.type === "error").length;
    const warnings = r.issues.filter((i) => i.type === "warning").length;
    const notices = r.issues.filter((i) => i.type === "notice").length;
    total += r.issues.length;

    console.log(`\n${r.page}: ${errors} errors, ${warnings} warnings, ${notices} notices`);
    r.issues.slice(0, 10).forEach((i) => {
      console.log(`  [${i.type}] ${i.message}`);
    });
    if (r.issues.length > 10) console.log(`  ... +${r.issues.length - 10} more`);
  }

  console.log(`\nTotal: ${total} issues`);
}

runAudit().catch(process.exit.bind(process, 1));
