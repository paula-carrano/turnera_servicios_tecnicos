import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));

describe("application scope", () => {
  it("contains exactly the request list and request form screens", () => {
    const screenDirectories = readdirSync(`${sourceRoot}/screens`, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(screenDirectories).toEqual(["request-form", "request-list"]);
  });

  it("does not expose search, filters, pagination or deletion actions", () => {
    const applicationSource = [
      "App.jsx",
      "screens/request-list/RequestListScreen.jsx",
      "screens/request-form/RequestFormScreen.jsx",
      "services/serviceRequestApi.js",
    ]
      .map((path) => readFileSync(`${sourceRoot}/${path}`, "utf8"))
      .join("\n");

    expect(applicationSource).not.toMatch(/type=["']search["']/i);
    expect(applicationSource).not.toMatch(/method:\s*["']DELETE["']/i);
    expect(applicationSource).not.toMatch(/[?&](page|size|filter|search)=/i);
    expect(applicationSource).not.toMatch(/>\s*(Buscar|Filtrar|Eliminar)\s*</i);
  });
});
