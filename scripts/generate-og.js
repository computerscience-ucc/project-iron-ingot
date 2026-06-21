const sharp = require("sharp");
const path = require("path");

const WIDTH = 1200;
const HEIGHT = 630;
const BG_COLOR = "#0f1218";

async function generateOG() {
  const screenshot = sharp(path.join(__dirname, "../public/uccingo.png"));
  const metadata = await screenshot.metadata();

  const scale = Math.min(WIDTH / metadata.width, HEIGHT / metadata.height);
  const resizedW = Math.round(metadata.width * scale);
  const resizedH = Math.round(metadata.height * scale);

  const resized = await screenshot
    .resize(resizedW, resizedH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const offsetX = Math.round((WIDTH - resizedW) / 2);
  const offsetY = Math.round((HEIGHT - resizedH) / 2);

  const bottomBar = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${BG_COLOR}" stop-opacity="0"/>
          <stop offset="40%" stop-color="${BG_COLOR}" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="${BG_COLOR}" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
      <rect y="${HEIGHT - 130}" width="${WIDTH}" height="130" fill="url(#bottomFade)"/>
      <text x="60" y="${HEIGHT - 50}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="44" fill="white" letter-spacing="-1">uccingo</text>
      <text x="60" y="${HEIGHT - 18}" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="18" fill="#999">Your CS Information on the Go</text>
      <text x="${WIDTH - 60}" y="${HEIGHT - 25}" font-family="Arial, Helvetica, sans-serif" font-weight="500" font-size="15" fill="#666" text-anchor="end">uccingo.tech</text>
    </svg>
  `);

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 15, g: 18, b: 24, alpha: 1 },
    },
  })
    .composite([
      { input: resized, left: offsetX, top: offsetY },
      { input: bottomBar, left: 0, top: 0 },
    ])
    .png({ quality: 95 })
    .toFile(path.join(__dirname, "../public/branding/og-image.png"));

  console.log("OG image generated: public/branding/og-image.png (1200x630)");
}

generateOG().catch((err) => {
  console.error("Failed to generate OG image:", err);
  process.exit(1);
});
