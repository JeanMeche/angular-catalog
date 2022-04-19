import * as fromTemperature from './temperature.actions';

describe('loadTemperatures', () => {
  it('should return an action', () => {
    expect(fromTemperature.loadTemperatures().type).toBe('[Temperature] Load Temperatures');
  });
});
