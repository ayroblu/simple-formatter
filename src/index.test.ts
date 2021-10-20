import { formatter } from "./formatter";

describe("formatter", () => {
  test("using an example query,", () => {
    expect(formatter(input)).toEqual(output2);
  });
});

const input = `
100 * zone([atla, smf1], movingavg(5, 1 - default(0,
        sumany(rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/failures))) /
        sumany(rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/requests))))))
`.trim();
const output = `
100 * zone(
  [atla, smf1], movingavg(5, 1 - default(0, sumany(
    rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/failures))
  ) / sumany(
    rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/requests))
  )))
)
`.trim();
const output2 = `
100 * zone(
  [atla, smf1], movingavg(
    5, 1 - default(
      0, sumany(
        rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/failures))
      ) / sumany(
        rate(ts(insights-service.prod.easypromote, members(sd.insights-service.prod.easypromote), promote/requests))
      )
    )
  )
)
`.trim();
