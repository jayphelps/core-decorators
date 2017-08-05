var pattern = /from TypeScript/i;

export default function skipTypescriptTest(ctx) {
  const suite = ctx.test.parent.title + '';
  if (pattern.test(suite)) {
    ctx.skip();
    return true;
  }
  return false;
}
