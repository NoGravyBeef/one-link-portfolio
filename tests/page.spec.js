import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const evidenceDir = resolve("public/evidence");
const viewports = [
  { width: 1366, height: 768, name: "after-1366x768.png" },
  { width: 1920, height: 1080, name: "after-1920x1080.png" },
];

async function captureConsole(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test.beforeAll(async () => {
  await mkdir(evidenceDir, { recursive: true });
});

for (const viewport of viewports) {
  test(`${viewport.width}x${viewport.height} 첫 화면과 넘침`, async ({ page }) => {
    const errors = await captureConsole(page);
    await page.setViewportSize(viewport);
    await page.goto("./", { waitUntil: "networkidle" });

    for (const selector of ["#intro-title", ".intro-lede", "[data-testid=hero-evidence]", ".audience-block", ".scope-block"]) {
      const box = await page.locator(selector).boundingBox();
      expect(box, `${selector}가 보여야 함`).not.toBeNull();
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
    }

    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      sections: [...document.querySelectorAll("section")].map((section) => ({
        id: section.id || section.className,
        overflow: section.scrollWidth - section.clientWidth,
      })),
    }));
    expect(overflow.document).toBeLessThanOrEqual(0);
    expect(overflow.sections.filter((item) => item.overflow > 0)).toEqual([]);
    expect(errors).toEqual([]);

    await page.screenshot({ path: resolve(evidenceDir, viewport.name), fullPage: false });
  });
}

test("경험 선택이 클릭·Enter·Space에서 작동함", async ({ page }) => {
  const errors = await captureConsole(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("./", { waitUntil: "networkidle" });
  await page.locator("#experiences").scrollIntoViewIfNeeded();

  const buttons = page.locator(".experience-button");
  await expect(buttons).toHaveCount(3);
  for (let index = 0; index < 3; index += 1) {
    await buttons.nth(index).click();
    await expect(page.locator(".detail-block")).toHaveCount(4);
    for (const block of await page.locator(".detail-block p").all()) {
      expect((await block.textContent()).trim().length).toBeGreaterThan(0);
    }
  }
  await buttons.nth(1).click();
  await expect(page.locator("#experience-detail-title")).toContainText("경험 2 상세");
  await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");

  await buttons.nth(2).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#experience-detail-title")).toContainText("경험 3 상세");

  await buttons.nth(0).focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#experience-detail-title")).toContainText("경험 1 상세");
  await expect(buttons.nth(0)).toBeFocused();
  await expect(errors).toEqual([]);
  await page.waitForTimeout(450);
  await page.locator("#experiences").evaluate((element) => element.scrollIntoView({ block: "start", behavior: "instant" }));
  await page.waitForTimeout(100);
  const sectionBox = await page.locator("#experiences").boundingBox();
  expect(Math.abs(sectionBox.y)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: resolve(evidenceDir, "interaction-check.png"), fullPage: false });
});

test("검증 안내서가 공개 경로에서 열림", async ({ page }) => {
  const errors = await captureConsole(page);
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("verification.html", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "검증 안내서", level: 1 })).toBeVisible();
  await expect(page.locator(".guide-card")).toHaveCount(4);
  await expect(errors).toEqual([]);
});

test("좁은 화면에서 블록이 세로 배치되고 넘치지 않음", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./", { waitUntil: "networkidle" });
  await page.locator("#experiences").scrollIntoViewIfNeeded();
  const columns = await page.locator(".experience-buttons").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("움직임 줄이기에서 스냅과 큰 애니메이션이 제거됨", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("./", { waitUntil: "networkidle" });
  const values = await page.evaluate(() => ({
    snap: getComputedStyle(document.documentElement).scrollSnapType,
    ambientDuration: getComputedStyle(document.querySelector(".ambient-one")).animationDuration,
  }));
  expect(values.snap).toBe("none");
  expect(Number.parseFloat(values.ambientDuration)).toBeLessThanOrEqual(0.001);
  await page.locator(".experience-button").nth(1).click();
  await expect(page.locator("#experience-detail-title")).toContainText("경험 2 상세");
});
