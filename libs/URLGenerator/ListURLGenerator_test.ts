import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { createListURLGenerator } from "./ListURLGenerator.ts";

Deno.test("Basic params", () => {
  const generator = createListURLGenerator({
    userId: "emo-user",
    listId: "emo-list",
  });

  assertEquals(
    generator.run().toString(),
    "https://rateyourmusic.com/list/emo-user/emo-list/1/"
  );
});

Deno.test("Basic params (with pageNum)", () => {
  const generator = createListURLGenerator({
    userId: "emo-user",
    listId: "emo-list",
    pageNum: 4,
  });

  assertEquals(
    generator.run().toString(),
    "https://rateyourmusic.com/list/emo-user/emo-list/4/"
  );
});
