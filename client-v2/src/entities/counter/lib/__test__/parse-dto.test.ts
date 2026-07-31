import { describe, expect, it } from "vitest";

import { parseCounterDto } from "../parse-dto";

describe("parseCounterDto", () => {
  it("maps deviceId and normalizes nullable fields", () => {
    expect(parseCounterDto({ deviceId: "device-1", name: "카운터", startedAt: null, stoppedAt: null, divisionId: null })).toEqual({
      id: "device-1", name: "카운터", startedAt: null, stoppedAt: null, divisionId: null,
    });
  });
});
